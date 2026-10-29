// Recherche « Trouver » : texte intégral des volumes (data/search.json) et index, hors ligne.
// Module pur (aucun accès au DOM) : sert à l'app, à l'outil de Claude et aux tests node.

const STOP = new Set(('a au aux avec ce ces cet cette d dans de des du elle en est et etre il ils l la le les leur lui mais ne ni '
  + 'on ou par pas pour qu que qui sa se ses si son sont sur un une y quel quelle quels quelles comment quand faut doit peut '
  + 'faire fait sous entre tout tous toute toutes plus tres art article articles cf').split(' '));

// Sigles courants → termes développés (ajoutés à la requête avec un poids réduit).
export const SYN = {
  cac: 'commissaire comptes', ag: 'assemblee generale', age: 'assemblee generale extraordinaire', ago: 'assemblee generale ordinaire',
  abs: 'abus biens sociaux', lcbft: 'blanchiment terrorisme', lcb: 'blanchiment', pfu: 'prelevement forfaitaire unique',
  is: 'impot societes', ir: 'impot revenu', tva: 'taxe valeur ajoutee', nep: 'norme exercice professionnel',
  sacc: 'services autres certification', eip: 'entite interet public', h2a: 'haute autorite audit', h3c: 'haute autorite audit',
  ec: 'expert comptable', oec: 'ordre experts comptables', cse: 'comite social economique', ca: 'chiffre affaires',
  pv: 'plus value', rcs: 'registre commerce', cncc: 'compagnie nationale commissaires', pme: 'petite moyenne entreprise',
  sci: 'societe civile immobiliere', lmnp: 'loueur meuble', lmp: 'loueur meuble professionnel', tup: 'transmission universelle patrimoine',
  pcg: 'plan comptable general', anc: 'autorite normes comptables', urssaf: 'recouvrement cotisations',
};

export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/[^a-z0-9]+/g, ' ').trim();
const stem = (t) => (t.length > 4 && /[sx]$/.test(t) ? t.slice(0, -1) : t);
const terms = (s) => norm(s).split(' ').filter((t) => t && !STOP.has(t)).map(stem);

// Index BM25 sur les pages. data = { vols, pages: [[vol, n, texte], …] }
export function createIndex(data) {
  const df = new Map(); let tot = 0;
  const pages = data.pages.map(([v, n, text]) => {
    const tf = new Map(); const ts = terms(text);
    for (const t of ts) tf.set(t, (tf.get(t) || 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1);
    tot += ts.length;
    return { v, n, text, nt: ' ' + norm(text) + ' ', tf, len: ts.length };
  });
  return { vols: data.vols, pages, df, N: pages.length, avg: tot / Math.max(pages.length, 1) };
}

function parse(q) {
  const qn = norm(q);
  const w = new Map();
  for (const t of terms(q)) w.set(t, 1);
  for (const raw of qn.split(' ')) if (SYN[raw]) for (const t of terms(SYN[raw])) if (!w.has(t)) w.set(t, 0.6);
  const core = qn.replace(/^((art|article|articles|l|r|d|a|cgi|lpf) )+/, '').replace(/( (cgi|lpf|code|commerce))+$/, '');
  // Requête de numéro (« L. 225-38 », « NEP 570 », « 150-0 B ter ») : la page où le texte commence passe devant les citations.
  const num = /\d/.test(core);
  const toks = core.split(' ').map((t) => [...t].map((ch) => (/[a-z]/.test(ch) ? `[${ch}${ch.toUpperCase()}]` : ch)).join('')).join('[\\s.\\-–‐]+');
  const tete = num ? new RegExp(`(?<![’'\\p{L}])(?:Art\\.|Article|CGI Article|NEP)\\s+(?:[LRDA]\\.\\s*)?${toks}(?![\\d\\-–])\\s*\\.?\\s*[-–—(«]?\\s*[\\p{Lu}«(]`
    + `|(?<![\\p{L}])[LRD]\\.\\s*${toks}\\s+(?:ORDONNANCE|LOI|DÉCRET|Modifié|Créé)`, 'u') : null;
  // Occurrence exacte entre guillemets (« prix de transfert », "…", “…”) : la page doit la contenir telle quelle (accents et casse ignorés).
  const phrases = [...String(q || '').matchAll(/[«"“]\s*([^»"”]+?)\s*[»"”]/g)].map((m) => norm(m[1])).filter(Boolean);
  return { qn, core, w, num, tete, phrases, main: [...w].filter(([, x]) => x === 1).map(([t]) => t) };
}

// Pages classées. opts : { fam, famOf, limit }
export function search(idx, q, { fam = null, famOf = () => null, limit = 20 } = {}) {
  const P = parse(q); if (!P.w.size) return [];
  const k1 = 1.2, b = 0.75; const out = [];
  const nMain = Math.max(P.main.length, 1);
  const exact = ' ' + P.core + ' ';
  const strict = P.num && idx.pages.some((p) => p.nt.includes(exact));
  for (const p of idx.pages) {
    if (fam && famOf(p.v) !== fam) continue;
    if (strict && !p.nt.includes(exact)) continue;
    if (P.phrases.some((ph) => !p.nt.includes(' ' + ph + ' '))) continue;
    let s = 0; let hit = 0;
    for (const [t, wt] of P.w) {
      const f = p.tf.get(t); if (!f) continue;
      const df = idx.df.get(t);
      const idf = Math.log(1 + (idx.N - df + 0.5) / (df + 0.5));
      s += wt * idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * p.len / idx.avg));
      if (wt === 1) hit++;
    }
    const phrase = P.core.includes(' ') && p.nt.includes(' ' + P.core + ' ');
    if (!s && !phrase) continue;
    s *= Math.pow(hit / nMain, 1.5);
    if (phrase) s += 6 + (P.qn !== P.core && p.nt.includes(' ' + P.qn + ' ') ? 3 : 0);
    if (P.tete && P.tete.test(p.text)) s += 12;
    for (const ph of P.phrases) s += 4 + Math.min(p.nt.split(' ' + ph + ' ').length - 1, 5);
    if (p.v === 'V7') s *= 0.75; // annales : utiles, mais après les textes
    if (s > 0) out.push({ v: p.v, n: p.n, score: s, p });
  }
  out.sort((x, y) => y.score - x.score);
  return out.slice(0, limit).map(({ v, n, score, p }) => ({ v, n, score, extrait: extrait(p.text, P) }));
}

// Phrase la plus riche en termes de la requête (≈ 260 caractères).
function extrait(text, P, max = 260) {
  const parts = text.split(/(?<=[.;:!?])(?<!(?:^|[\s(])[A-Za-z]\.)(?<![Aa]rt\.)(?<!n°\s?\d*\.)\s+(?=\S)/);
  let best = parts[0] || '', bs = -1;
  for (const s of parts) {
    const ns = ' ' + norm(s) + ' ';
    let sc = 0; for (const [t, wt] of P.w) if (ns.includes(' ' + t)) sc += wt;
    if (P.core.includes(' ') && ns.includes(' ' + P.core + ' ')) sc += 3;
    if (P.tete && P.tete.test(s)) sc += 5;
    for (const ph of P.phrases) if (ns.includes(' ' + ph + ' ')) sc += 6;
    if (sc > bs) { bs = sc; best = s; }
  }
  if (best.length <= max) return best;
  const ns = norm(best); const first = Math.min(...[...P.phrases, ...P.w.keys()].map((t) => { const i = ns.indexOf(t); return i < 0 ? Infinity : i; }));
  const start = Number.isFinite(first) ? Math.max(0, Math.round(first * best.length / Math.max(ns.length, 1)) - 60) : 0;
  return (start ? '… ' : '') + best.slice(start, start + max).trim() + ' …';
}

// Passages plus longs pour Claude : page entière tronquée autour du meilleur extrait.
export function passages(idx, q, { k = 6, max = 1800 } = {}) {
  return search(idx, q, { limit: k }).map((r) => {
    const p = idx.pages.find((x) => x.v === r.v && x.n === r.n);
    const at = Math.max(0, p.text.indexOf(r.extrait.replace(/^… /, '').replace(/ …$/, '').slice(0, 40)));
    const start = Math.max(0, Math.min(at - max / 3, p.text.length - max));
    return { v: r.v, n: r.n, titre: idx.vols[r.v]?.titre || r.v, texte: p.text.slice(start, start + max) };
  });
}

// Entrées d'index (pré-rempli + perso) : motcle + texte.
export function searchEntries(entries, q, limit = 6) {
  const P = parse(q); if (!P.w.size) return [];
  const nMain = Math.max(P.main.length, 1);
  return entries.map((e) => {
    const ns = ' ' + norm(e.motcle + ' ' + (e.texte || '')) + ' ';
    if (P.phrases.some((ph) => !ns.includes(' ' + ph + ' '))) return { e, s: 0 };
    let s = 0, hit = 0;
    for (const [t, wt] of P.w) if (ns.includes(' ' + t)) { s += wt; if (wt === 1) hit++; }
    if (P.core.includes(' ') && ns.includes(' ' + P.core + ' ')) s += 3;
    return { e, s: hit / nMain >= 0.6 || s >= 3 ? s : 0 };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}

// Surlignage insensible aux accents (texte déjà échappé en HTML).
const CL = { a: '[aàâä]', e: '[eéèêë]', i: '[iîï]', o: '[oôö]', u: '[uùûü]', c: '[cç]', y: '[yÿ]' };
export function surligner(html, q) {
  const P = parse(q);
  const motif = (t) => [...t].map((c) => CL[c] || c).join('');
  const sep = '(?:[^\\p{L}\\p{N}&]|&#39;|&amp;|&quot;)+';
  const phr = P.phrases.map((ph) => ph.split(' ').map(motif).join(sep) + '(?![\\p{L}\\p{N}])');
  const ts = [...P.w.keys()].filter((t) => t.length > 1).sort((a, b) => b.length - a.length).map((t) => motif(t) + '[\\p{L}]*');
  if (!ts.length && !phr.length) return html;
  const rx = new RegExp(`(?<![\\p{L}\\p{N}])(?:${[...phr, ...ts].join('|')})`, 'giu');
  return html.replace(/(<[^>]*>)|([^<]+)/g, (m, tag, txt) => tag || txt.replace(rx, '<mark>$&</mark>'));
}
