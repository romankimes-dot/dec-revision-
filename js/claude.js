// Page « Claude » : questions posées à Claude (API Anthropic) depuis le navigateur, avec la clé de l'utilisateur
// enregistrée uniquement sur cet appareil. Claude reçoit le contexte de l'app (plan, notions, méthode, ta progression)
// et dispose de trois outils exécutés ici, dans le navigateur : recherche dans les volumes imprimés, liste et lecture du dépôt.
const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.133.0/+esm';
export const MODEL = 'claude-opus-5-5';
const REPO = 'romankimes-dot/dec-revision-';
const BRANCH = 'claude/plan-ue2';
const KEY_KEY = 'dec2.claude.key';
const CONV_KEY = 'dec2.claude.conv';
const MAX_TOURS = 8;

const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* */ } };

export const getKey = () => get(KEY_KEY) || '';
export const setKey = (k) => set(KEY_KEY, k ? k.trim() : null);
export function loadConv() { try { return JSON.parse(get(CONV_KEY) || '[]'); } catch { return []; } }
export function saveConv(m) { set(CONV_KEY, JSON.stringify(m.slice(-40))); }
export function clearConv() { set(CONV_KEY, null); }

// Recherche plein texte dans les volumes (fournie par l'app : search.js + data/search.json).
let recherche = null;
export const setRecherche = (fn) => { recherche = fn; };

// Outils lus dans le navigateur (dépôt public, sans jeton).
export const TOOLS = [
  {
    name: 'chercher_volumes',
    description: "Recherche plein texte dans la documentation papier du candidat : V1 NEP, V2 Livre VIII du Code de commerce (CAC), V3 PCG, V4 déontologie, V5 référentiel OEC, V6 textes choisis (sociétés, CMF, CSS), V7 annales, V8 articles du CGI et du LPF, K2 fiches, K4 trames. Renvoie les passages les plus pertinents avec leur folio « Vx · n » (page imprimée). Requête courte : mots-clés ou numéro de texte (« convocation commissaire assemblée SAS », « L. 225-38 », « NEP 570 »). Appelle-la plusieurs fois si besoin.",
    input_schema: { type: 'object', properties: { requete: { type: 'string', description: 'Mots-clés ou numéro de texte' } }, required: ['requete'], additionalProperties: false },
    strict: true, eager_input_streaming: true,
  },
  {
    name: 'lister_fichiers_depot',
    description: "Liste les fichiers du dépôt GitHub de préparation (plan, vérifications juridiques, statistiques des annales, débat du collège, kit, données de l'app). À appeler avant lire_fichier_depot si tu ne connais pas le chemin exact.",
    input_schema: { type: 'object', properties: { dossier: { type: 'string', description: "Préfixe de chemin à filtrer, par ex. « docs/ » ou « kit_src/ ». Chaîne vide pour tout." } }, required: ['dossier'], additionalProperties: false },
    strict: true, eager_input_streaming: true,
  },
  {
    name: 'lire_fichier_depot',
    description: "Lit un fichier texte du dépôt (Markdown, JSON, HTML) et renvoie son contenu. Fichiers utiles : docs/PLAN.md (plan validé), docs/VERIF.md (121 vérifications juridiques sourcées : valeurs qui font foi), docs/STATS.md (récurrence des thèmes sur 16 sujets), imprimer/LISEZMOI.md (volumes à imprimer), data/*.json (contenu de l'app), docs/data/*.jsonl (questions des annales codées).",
    input_schema: { type: 'object', properties: { chemin: { type: 'string', description: 'Chemin relatif dans le dépôt, par ex. docs/VERIF.md' } }, required: ['chemin'], additionalProperties: false },
    strict: true, eager_input_streaming: true,
  },
];

let treeCache = null;
async function runTool(name, input) {
  if (name === 'chercher_volumes') {
    if (typeof input?.requete !== 'string' || !input.requete.trim()) throw new Error('entrée invalide : « requete » attendue');
    if (!recherche) throw new Error('recherche indisponible');
    const ps = await recherche(input.requete);
    return ps.length ? ps.map((x) => `[${x.v} · ${x.n}] (${x.titre})\n${x.texte}`).join('\n\n---\n\n') : 'Aucun passage trouvé : reformule avec d\'autres mots-clés.';
  }
  if (name === 'lister_fichiers_depot') {
    if (typeof input?.dossier !== 'string') throw new Error('entrée invalide : « dossier » attendu');
    if (!treeCache) {
      const r = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${encodeURIComponent(BRANCH)}?recursive=1`);
      if (!r.ok) throw new Error(`GitHub a répondu ${r.status}`);
      treeCache = (await r.json()).tree.filter((t) => t.type === 'blob').map((t) => t.path);
    }
    const list = treeCache.filter((p) => p.startsWith(input.dossier) && !/\.(pdf|png|jpg)$/i.test(p));
    return list.slice(0, 400).join('\n') || '(aucun fichier)';
  }
  if (name === 'lire_fichier_depot') {
    const p = input?.chemin;
    if (typeof p !== 'string' || !p || p.includes('..')) throw new Error('entrée invalide : « chemin » attendu');
    if (/\.pdf$/i.test(p)) return "Les PDF ne sont pas lisibles ici ; lis plutôt imprimer/LISEZMOI.md ou les sources HTML dans kit_src/.";
    const r = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${p.split('/').map(encodeURIComponent).join('/')}`);
    if (!r.ok) throw new Error(`fichier introuvable (${r.status}) : ${p}`);
    const t = await r.text();
    return t.length > 120000 ? t.slice(0, 120000) + '\n[… fichier tronqué à 120 000 caractères ; demande une section précise si besoin]' : t;
  }
  throw new Error(`outil inconnu : ${name}`);
}

export function systemPrompt(ctx) {
  return `Tu es l'assistant de préparation de ${ctx.prenom || 'ce candidat'} à l'épreuve n° 2 du DEC (révision légale et contractuelle des comptes), intégré à son application de révision.

Le candidat : stagiaire expert-comptable, côté expertise comptable (le commissariat aux comptes est son point faible), parti de zéro sur cette épreuve. Épreuve test le mardi 10 novembre 2026 (14h-18h30) ; vraie tentative le 4 mai 2027. Il prépare aussi l'épreuve 1 (déontologie) et son mémoire.

Comment répondre :
- En français, clairement, phrases courtes, sans jargon inutile. Va droit au but.
- Pour toute règle de droit, cite l'article (numérotation du livre VIII du Code de commerce en vigueur depuis le 1er janvier 2024), la NEP ou le texte, puis applique au cas, puis conclus (règle, application, conclusion), comme à l'épreuve.
- Les valeurs chiffrées (seuils, délais, sanctions) qui font foi sont dans docs/VERIF.md : lis-le avec l'outil avant d'affirmer un chiffre dont tu n'es pas sûr. Si une information n'est pas vérifiable, dis-le.
- Pour une question de fond (règle, délai, seuil, procédure), cherche d'abord dans ses volumes avec chercher_volumes et appuie-toi sur les passages trouvés. Cite chaque fois la page sous la forme exacte « V2 · 37 » (l'app la rend cliquable et ouvre la page). Si les passages ne suffisent pas, dis-le et indique le Mémento à consulter (Audit, Sociétés commerciales, Fiscal).
- Pour l'organisation et le planning, appuie-toi sur docs/PLAN.md et sur sa progression ci-dessous.
- Tu ne peux pas modifier le dépôt ni l'application ; tu peux seulement les lire.

Contexte de l'application (extrait) :
${ctx.resume}`;
}

let sdk = null;
async function client(key) {
  if (!sdk) sdk = await import(SDK_URL);
  const Anthropic = sdk.default || sdk.Anthropic;
  return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
}

// Envoie la conversation et gère la boucle d'outils. onText(texte cumulé du tour), onStatus(message).
export async function ask(messages, ctx, { onText, onStatus, signal } = {}) {
  const key = getKey();
  if (!key) throw new Error('Ajoute ta clé API dans Réglages › Claude.');
  const c = await client(key);
  const system = [{ type: 'text', text: systemPrompt(ctx), cache_control: { type: 'ephemeral' } }];
  for (let tour = 0; tour < MAX_TOURS; tour++) {
    let txt = '';
    const stream = c.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium' },
      system,
      tools: TOOLS,
      messages,
    }, { signal });
    stream.on('text', (d) => { txt += d; onText && onText(txt); });
    const msg = await stream.finalMessage();
    messages.push({ role: 'assistant', content: msg.content });
    if (msg.stop_reason === 'refusal') return { messages, fin: 'refus' };
    if (msg.stop_reason === 'max_tokens') return { messages, fin: 'coupe' };
    if (msg.stop_reason !== 'tool_use') return { messages, fin: 'ok' };
    const uses = msg.content.filter((b) => b.type === 'tool_use');
    const results = await Promise.all(uses.map(async (u) => {
      onStatus && onStatus(u.name === 'chercher_volumes' ? `Recherche dans tes volumes : ${u.input?.requete || ''}…` : u.name === 'lire_fichier_depot' ? `Lecture de ${u.input?.chemin || 'un fichier'}…` : 'Consultation du dépôt…');
      try { return { type: 'tool_result', tool_use_id: u.id, content: await runTool(u.name, u.input) }; }
      catch (e) { return { type: 'tool_result', tool_use_id: u.id, content: String(e.message || e), is_error: true }; }
    }));
    messages.push({ role: 'user', content: results });
  }
  return { messages, fin: 'boucle' };
}

// Texte affichable d'un message enregistré.
export function textOf(m) {
  if (typeof m.content === 'string') return m.content;
  return (m.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
}
