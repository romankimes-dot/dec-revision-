// Logique pure (sans DOM), testée par tests/core.test.js.

export const pad = (n) => String(n).padStart(2, '0');
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hm = (min) => `${pad(Math.floor(min / 60) % 24)}h${pad(Math.round(min % 60))}`;
export const toMin = (s) => { const m = /^(\d{1,2})[h:](\d{2})$/.exec(String(s).trim()); return m ? +m[1] * 60 + +m[2] : NaN; };

// Jalons d'épreuve : lecture 30 min + plan 5 min, rédaction jusqu'à 18h15 (220 min), 11 min par point.
// points : barème des dossiers dans l'ordre choisi ; null = barème absent (parts égales). start en minutes depuis minuit.
export function jalons(points, start = 14 * 60, { lecture = 30, plan = 5, total = 270, relecture = 15 } = {}) {
  const n = points.length;
  if (!n) return { debutRedaction: start + lecture + plan, fins: [], budgets: [], fin: start + total - relecture };
  const writeStart = start + lecture + plan;
  const writeEnd = start + total - relecture;
  const avail = writeEnd - writeStart;
  const known = points.every((p) => typeof p === 'number' && p > 0);
  const sum = known ? points.reduce((a, b) => a + b, 0) : n;
  const weights = known ? points : points.map(() => 1);
  const budgets = [];
  const fins = [];
  let acc = 0;
  weights.forEach((w, i) => {
    const prev = Math.round((acc / sum) * avail);
    acc += w;
    const end = i === n - 1 ? avail : Math.round((acc / sum) * avail);
    budgets.push(end - prev);
    fins.push(writeStart + end);
  });
  return { debutRedaction: writeStart, fins, budgets, fin: writeEnd, finLecture: start + lecture };
}

export const STRUCTURES = [
  { id: '10-10', label: '2 × 10 (7 sessions sur 14)', points: [10, 10] },
  { id: '8-6-6', label: '8 + 6 + 6 (mai 2025)', points: [8, 6, 6] },
  { id: '3-9-8', label: '3 + 9 + 8 (mai 2026)', points: [3, 9, 8] },
  { id: '7-6-7', label: '7 + 6 + 7', points: [7, 6, 7] },
  { id: '6-7-7', label: '6 + 7 + 7 (nov. 2023)', points: [6, 7, 7] },
  { id: '7-4-5-4', label: '7 + 4 + 5 + 4 (mai 2021)', points: [7, 4, 5, 4] },
];

// Écriture : vitesse et norme de longueur (100-140 mots/point par défaut, bornée par ce que la main produit en 110 min / 10 pts).
export function normeMots(motsParMin) {
  if (!(motsParMin > 0)) return { min: 100, max: 140, mesure: false };
  const capacite = Math.round(motsParMin * 5.5); // 110 min nets pour 10 points
  const max = Math.max(70, Math.min(140, capacite));
  const min = Math.max(60, Math.min(100, max - 30));
  return { min, max, capacite, mesure: true };
}

// Phase du calendrier selon la date (chaîne AAAA-MM-JJ).
export function phaseFor(day, phases) {
  if (day < '2026-10-28') return 'avant';
  if (day <= '2026-11-09') return 'sprint';
  if (day === '2026-11-10') return 'jourJ';
  if (day === '2026-11-11') return 'debrief';
  for (const p of phases) if (day >= p.debut && day <= p.fin) return p.id;
  return 'apres';
}

// Décision du 8 janvier (PLAN 0.3). e1 : nombre ou 'blanche' ; e2 : nombre ; e3 : hypothèse de note au mémoire.
export function decision(e1raw, e2, e3 = 11) {
  const blanche = e1raw === 'blanche' || e1raw === null || e1raw === undefined || e1raw === '';
  const e1 = blanche ? 0 : Number(e1raw);
  const res = { e1: blanche ? 'copie blanche' : e1, e2, e3, actions: [], alertes: [] };
  const e1Status = blanche || e1 < 6 ? 'repasser' : e1 >= 10 ? 'acquise' : 'conservable';
  const e2Status = e2 < 6 ? 'repasser' : e2 >= 10 ? 'acquise' : 'conservable';
  res.e1Status = e1Status; res.e2Status = e2Status;
  const e1c = e1Status === 'repasser' ? null : e1;
  const e2c = e2Status === 'repasser' ? null : e2;
  res.S = e1c !== null && e2c !== null ? e1c + 3 * e2c : null;
  const e3Needed = (s) => Math.max(10, Math.ceil(((80 - s) / 4) * 4) / 4);
  if (res.S !== null) res.e3Requis = e3Needed(res.S);

  if (e1Status === 'acquise') res.actions.push('Épreuve 1 : note ≥ 10 conservée 8 sessions, impossible à repasser.');
  else if (e1Status === 'conservable') res.actions.push(`Épreuve 1 : ${e1} est conservable sur demande ; la repasser n'est utile que si elle bloque le total.`);
  else res.actions.push("Épreuve 1 : à repasser le 4 mai 2027 (10h30-11h30).");

  if (e2Status === 'acquise') {
    res.actions.push("Épreuve 2 : acquise, impossible à repasser. Tout l'effort va au mémoire.");
    res.verdict = e1Status === 'repasser' ? 'E1 seule en mai' : "Pas d'inscription aux écrits en mai";
  } else if (e2Status === 'repasser') {
    res.actions.push("Épreuve 2 : à repasser le 4 mai 2027, cible 10, plancher 8.");
    res.verdict = e1Status === 'repasser' ? 'E1 et E2 en mai (journée complète)' : 'E2 en mai';
  } else {
    const S = (e1c ?? 0) + 3 * e2;
    const besoin = e3Needed(S);
    res.besoinSiConserve = besoin;
    if (e1c !== null && S >= 36) {
      res.actions.push(`Épreuve 2 : ${e2} à conserver (demande écrite). Avec ces notes, le mémoire doit valoir ${besoin} : dans la ligne réaliste (11).`);
      res.verdict = e1Status === 'repasser' ? 'Conserver E2, repasser E1' : 'Conserver E2';
    } else if (e1c !== null && S >= 32) {
      res.actions.push(`Zone grise : en conservant, le mémoire doit valoir ${besoin}. Conserver seulement si ton directeur de mémoire t'estime à ce niveau ; sinon repasser E2 avec cible 10.`);
      res.verdict = 'Zone grise : décider avec le mémoire';
    } else {
      res.actions.push(`Épreuve 2 : en conservant ${e2}, le mémoire devrait valoir ${besoin}${e1c === null ? ' (avec une épreuve 1 encore à obtenir)' : ''}. Repasser E2 le 4 mai, cible 10.`);
      res.verdict = e1Status === 'repasser' ? 'E1 et E2 en mai' : 'Repasser E2';
    }
  }
  res.alertes.push("À vérifier par écrit auprès du SIEC avant de t'inscrire : forme de la demande de conservation d'une note de 6 à 9,99, et effet d'une réinscription sur une note conservée (l'arrêté du 23 avril 2026 ne prévoit pas d'effacement, mais ne dit rien de la réinscription).");
  res.alertes.push('Inscriptions du 11 janvier au 28 février 2027, 17h. Mémoire : dépôt du 1er au 8 mars 2027.');
  return res;
}

// Répétition espacée simple (boîtes de Leitner) pour le drill d'index et la récitation.
export const INTERVALS = [0, 1, 3, 7, 14, 30]; // jours
export function nextBox(box, ok) { return ok ? Math.min((box || 0) + 1, INTERVALS.length - 1) : 0; }
export function isDue(entry, todayStr) { return !entry.due || entry.due <= todayStr; }
export function addDays(dayStr, n) { const d = new Date(dayStr + 'T12:00:00'); d.setDate(d.getDate() + n); return ymd(d); }

// Comparaison d'une référence saisie avec la référence enregistrée (« p. 412 », « n° 41250 », « 412 »…).
export function normRef(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/(^|[^a-z0-9])(pages?|pp?|n°|no|num|numero|§|article|art)(?![a-z])\.?/g, '$1 ').replace(/[^a-z0-9]+/g, ' ').trim();
}
export const sameRef = (a, b) => normRef(a) !== '' && normRef(a) === normRef(b);

export function median(arr) {
  const a = arr.filter((x) => Number.isFinite(x)).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

// Débrief : priorités de révision à partir des questions ratées (thème -> poids), pondérées par la fréquence au corpus.
export function priorites(debriefs, notions) {
  const freq = Object.fromEntries(notions.map((n) => [n.id, n.sessions]));
  const score = {};
  for (const d of debriefs) for (const q of d.questions || []) {
    if (!q.theme || q.statut === 'su') continue;
    const w = q.statut === 'blanc' ? 3 : q.statut === 'cherche' ? 2 : 1.5;
    score[q.theme] = (score[q.theme] || 0) + w * (1 + (freq[q.theme] || 0) / 14);
  }
  return Object.entries(score).sort((a, b) => b[1] - a[1]).map(([id, s]) => ({ id, s: Math.round(s * 10) / 10 }));
}

export function causes(debriefs) {
  const c = {};
  let n = 0;
  for (const d of debriefs) for (const q of d.questions || []) { if (q.cause) { c[q.cause] = (c[q.cause] || 0) + 1; n++; } }
  return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ cause: k, n: v, part: n ? Math.round((v / n) * 100) : 0 }));
}

export const CAUSES = [
  ['doc', 'Doc introuvable'], ['perime', 'Texte périmé'], ['piege', 'Piège non vu'], ['concl', 'Pas de conclusion'],
  ['temps', 'Manque de temps'], ['calcul', 'Calcul'], ['personnage', 'Cru le personnage'], ['savoir', 'Notion inconnue'],
];
