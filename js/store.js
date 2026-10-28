// Persistance locale avec copie de secours, export et import JSON.
const KEY = 'dec2.state.v1';
const BACKUP_KEY = 'dec2.state.backup';
const PREV_KEY = 'dec2.state.prev';

export const defaultState = () => ({
  version: 1,
  settings: { dateSimulee: '', e1Option: 'composer' },
  jours: {},        // date -> { taches: {i: true}, fait: timestamp }
  recit: {},        // id item -> { box, due, hist: [{t, s}] }
  index: {},        // id -> { motcle, volume, ref, box, due, hist: [{t, ms, ok}] }
  ecriture: [],     // { t, mots, minutes, texte, heure? }
  chrono: null,     // séance en cours : { start (ms), points, ordre, labels, questions: [{t}], session }
  seances: [],      // séances chrono terminées : { t, session, points, questions: [{min}], dureeMin }
  debriefs: [],     // { id, t, session, note, questions: [{n, theme, statut, cause, doc}] }
  materiel: {},     // id -> true
  decision: { e1: '', e2: '', e3: 11 },
  lus: {},          // sections lues
});

const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function hydrate(s) {
  const d = defaultState();
  if (!isObj(s)) return d;
  const out = { ...d, ...s, settings: { ...d.settings, ...(isObj(s.settings) ? s.settings : {}) }, decision: { ...d.decision, ...(isObj(s.decision) ? s.decision : {}) } };
  for (const k of ['jours', 'recit', 'index', 'materiel', 'lus']) if (!isObj(out[k])) out[k] = {};
  for (const k of ['ecriture', 'seances', 'debriefs']) if (!Array.isArray(out[k])) out[k] = [];
  return out;
}

export function load() {
  const raw = get(KEY);
  if (!raw) return defaultState();
  try { return hydrate(JSON.parse(raw)); } catch {
    set('dec2.state.corrupt', raw);
    try { return hydrate(JSON.parse(get(BACKUP_KEY) || 'null')); } catch { return defaultState(); }
  }
}

let lastBackup = 0;
export function save(state) {
  const raw = JSON.stringify(state);
  const ok = set(KEY, raw);
  if (Date.now() - lastBackup > 30 * 60 * 1000) { set(BACKUP_KEY, raw); lastBackup = Date.now(); }
  return ok;
}

export function exportJSON(state) { return JSON.stringify({ app: 'dec2', exporte: new Date().toISOString(), state }, null, 1); }

export function importJSON(text, current) {
  const o = JSON.parse(text);
  const s = o && o.app === 'dec2' ? o.state : o;
  if (!isObj(s)) throw new Error('fichier non reconnu');
  set(PREV_KEY, JSON.stringify(current));
  return hydrate(s);
}
