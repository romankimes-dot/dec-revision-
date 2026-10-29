import { load, save, exportJSON, importJSON, defaultState } from './store.js';
import {
  ymd, hm, jalons, STRUCTURES, normeMots, phaseFor, decision, nextBox, isDue, addDays, INTERVALS,
  sameRef, median, priorites, causes, CAUSES,
} from './core.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = (s) => esc(s).replace(/\n/g, '<br>');
const REPO = 'https://github.com/romankimes-dot/dec-revision-/blob/claude/plan-ue2/';

let S = load();
const D = {};
let tab = 'home';
let sub = null;          // sous-écran des outils
let viewDay = null;      // jour affiché dans le sprint
let timer = null;        // intervalle d'affichage
let wakeLock = null;

const persist = () => { S.activite = S.activite || {}; S.activite[today()] = 1; save(S); };
const today = () => S.settings.dateSimulee || ymd(new Date());
const nowMs = () => Date.now();

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2600);
}

function beep(n = 2) {
  try {
    const ctx = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)());
    for (let i = 0; i < n; i++) {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(ctx.destination);
      const t0 = ctx.currentTime + i * 0.35; o.start(t0); o.stop(t0 + 0.2);
    }
  } catch { /* son indisponible */ }
  try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch { /* */ }
}

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) wakeLock = await navigator.wakeLock.request('screen');
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* non supporté */ }
}

async function loadData() {
  const files = ['parcours', 'items', 'notions', 'stats', 'methode', 'materiel', 'phases', 'index_seed'];
  await Promise.all(files.map(async (f) => { D[f] = await (await fetch(`./data/${f}.json`)).json(); }));
  D.notionById = Object.fromEntries(D.notions.notions.map((n) => [n.id, n]));
  D.itemById = Object.fromEntries(D.items.items.map((i) => [i.id, i]));
}

// ---------- utilitaires d'affichage ----------
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
function jourFait(j) {
  const st = S.jours[j.date]; if (!st) return false;
  return j.taches.every((_, i) => st.taches && st.taches[i]);
}
function heuresFaites() {
  return D.parcours.jours.reduce((a, j) => a + (jourFait(j) ? j.h : 0), 0);
}
function ring(pct, label, sub2) {
  const r = 34; const c = 2 * Math.PI * r; const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return `<div class="ring"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="${r}" class="track"/><circle cx="40" cy="40" r="${r}" class="bar" stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg><div class="ringtxt"><b>${esc(label)}</b><small>${esc(sub2)}</small></div></div>`;
}
const freqBar = (n, max = 14) => `<span class="fbar" title="${n} sessions sur ${max}"><span style="width:${Math.round((n / max) * 100)}%"></span></span>`;
const toolBtn = (id) => {
  const L = { recitation: 'Réciter', drill: 'Index', chrono: 'Chrono', ecriture: 'Écriture', debrief: 'Bilan', methode: 'Méthode', materiel: 'Matériel', decision: 'Décision' };
  return `<button class="btn sm" data-go="${id}">${L[id] || id}</button>`;
};

// ---------- écrans ----------
function render(keep = false) {
  const y = window.scrollY;
  clearInterval(timer); timer = null;
  document.querySelectorAll('nav.bottom button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  const m = $('#main');
  const html = tab === 'home' ? home() : tab === 'outils' ? outils() : tab === 'carte' ? carte() : tab === 'methode' ? methode() : tab === 'materiel' ? materiel() : '';
  m.innerHTML = html;
  bindCommon(m);
  if (tab === 'outils' && sub === 'chrono' && S.chrono) startTick();
  if (tab === 'outils' && (sub === 'ecriture' || sub === 'recitation' || sub === 'drill') && runState.t0) startTick();
  window.scrollTo(0, keep ? y : 0);
  renderHeader();
}

function renderHeader() {
  const d = today();
  const j = daysBetween(d, d <= '2026-11-10' ? '2026-11-10' : '2027-05-04');
  $('#count').textContent = j > 0 ? `J-${j}` : j === 0 ? 'Jour J' : '';
  $('#count').title = d <= '2026-11-10' ? 'avant l\'épreuve du 10 novembre 2026' : 'avant l\'épreuve du 4 mai 2027';
}

function home() {
  const d = today();
  const ph = phaseFor(d, D.phases.phases);
  if (ph === 'avant' || ph === 'sprint' || (ph === 'jourJ' && viewDay)) return sprint(d);
  return apres(d, ph);
}

function sprint(d) {
  const jours = D.parcours.jours;
  const def = jours.find((j) => j.date === d) || (d < jours[0].date ? jours[0] : jours[jours.length - 1]);
  const j = jours.find((x) => x.date === viewDay) || def;
  const h = heuresFaites();
  const retard = jours.filter((x) => x.date < d && x.h > 0 && !jourFait(x));
  const st = S.jours[j.date] || { taches: {} };
  const dd = new Date(j.date + 'T12:00:00');
  const titreDate = dd.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return `
  ${S.lus.guide ? '' : `<section class="card hero2"><h2>Comment utiliser l'app</h2><ul class="plain">
    <li><b>Aujourd'hui</b> : ce que tu as à faire ce jour-là. Coche au fur et à mesure.</li>
    <li><b>S'entraîner</b> : les exercices (chrono d'annale, index de tes livres, réciter, vitesse d'écriture, bilan).</li>
    <li><b>À savoir</b> : ce qui tombe le plus à l'épreuve, et ce qu'il faut savoir dire de mémoire.</li>
    <li><b>Méthode</b> : déroulé des 4h30 et façon de rédiger une réponse.</li>
    <li><b>Matériel</b> : les PDF à imprimer, les livres à acheter, le sac du jour J.</li></ul>
    <button class="btn sm" data-guideok="1">Compris</button></section>`}
  <section class="card hero">
    ${ring(h / D.parcours.budget_h, `${h} h`, `sur ${D.parcours.budget_h} h`)}
    <div>
      <h2>Sprint vers le 10 novembre</h2>
      <p class="muted">Objectif réaliste en novembre : répondre à toutes les questions, chacune avec un article de loi et une conclusion. À partir de 6, la note peut être gardée ; 8 est utile ; 10 est acquise.</p>
    </div>
  </section>
  ${retard.length ? `<div class="card warnbox"><b>Jours non bouclés :</b> ${retard.map((x) => `<button class="link" data-day="${x.date}">${esc(x.date.slice(8))}/${esc(x.date.slice(5, 7))} ${esc(x.titre)}</button>`).join(' · ')}<div class="muted">Reporte-les sur les jours légers (6, 8, 9 novembre) plutôt que de sauter l'annale.</div></div>` : ''}
  <div class="days">${jours.map((x) => `<button class="day ${x.date === j.date ? 'sel' : ''} ${jourFait(x) ? 'done' : ''} ${x.date === d ? 'today' : ''} ${x.annale || x.jourJ ? 'key' : ''}" data-day="${x.date}"><small>${new Date(x.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3)}</small>${+x.date.slice(8)}</button>`).join('')}</div>
  <section class="card">
    <div class="row between"><h2 style="text-transform:capitalize">${esc(titreDate)}</h2><span class="badge">${j.h ? `${j.h} h` : j.horsBudget ? `${j.horsBudget} h hors budget` : 'jour J'}</span></div>
    <h3>${esc(j.titre)}</h3>
    <ul class="checks">${j.taches.map((t, i) => `<li><label><input type="checkbox" data-task="${j.date}|${i}" ${st.taches && st.taches[i] ? 'checked' : ''}><span>${esc(t)}</span></label></li>`).join('')}</ul>
    <div class="muted"><b>À la fin de la journée :</b> ${j.livrables.map(esc).join(' · ')}</div>
    <div class="row" style="margin-top:10px">${(j.outils || []).map(toolBtn).join('')}</div>
  </section>
  <section class="card">
    <h2>Ta stratégie, en clair</h2>
    <ul class="plain">
      <li><b>Épreuve 1 :</b> la performer pour prendre des points d'avance (≥ 10 conservé 8 sessions), ou copie blanche si tu n'es pas prêt (0, à repasser en mai).</li>
      <li><b>Épreuve 2 :</b> novembre est un vrai essai, pas un galop. 8 est déjà utile, 10 est la cible de mai : avec 10 à l'épreuve 2, un 10 au mémoire suffit pour le diplôme.</li>
      <li><b>Mémoire :</b> 12-13 visés ; le calcul se fait avec 11, la ligne réaliste.</li>
    </ul>
    <button class="btn sm" data-goafter="1">Voir l'après-novembre</button>
  </section>`;
}

function apres(d, ph) {
  const phases = D.phases.phases;
  const cur = phases.find((p) => p.id === ph);
  const reel = S.debriefs.find((x) => /r[ée]el/i.test(x.session));
  const prio = priorites(S.debriefs, D.notions.notions).slice(0, 8);
  const cz = causes(S.debriefs).slice(0, 5);
  const fenetre = d >= '2027-01-08' && d <= '2027-02-28';
  const next = D.phases.dates.filter((x) => x.d.slice(0, 10) >= d).slice(0, 4);
  let head = '';
  if (ph === 'jourJ') head = `<section class="card hero2"><h2>Jour J</h2><ul class="plain">${D.methode.journee.map((x) => `<li><b>${esc(x.h)}</b> ${esc(x.a)}</li>`).join('')}</ul><button class="btn sm" data-day="2026-11-10">Check-list du jour</button></section>`;
  return `
  ${head}
  ${!reel && d >= '2026-11-10' ? `<section class="card warnbox"><h2>Bilan de novembre</h2><p>Note, question par question, ce que tu as su ou pas : c'est lui qui recale la suite (priorités, blocs, décision de janvier).</p><button class="btn primary" data-go="debrief" data-newreel="1">Faire le bilan de l'examen</button></section>` : ''}
  ${fenetre ? `<section class="card hero2"><h2>Fenêtre de décision</h2><p>Du 8 janvier au 28 février 2027, 17h : calcule, écris au SIEC, puis inscris-toi.</p><button class="btn primary" data-go="decision">Ouvrir la décision</button></section>` : ''}
  ${cur ? `<section class="card"><div class="row between"><h2>${esc(cur.titre)}</h2><span class="badge">${cur.e2h} h/sem. épreuve 2</span></div>
    <p class="muted">${esc(cur.debut.split('-').reverse().join('/'))} → ${esc(cur.fin.split('-').reverse().join('/'))}</p>
    <ul class="checks">${cur.taches.map((t, i) => `<li><label><input type="checkbox" data-ptask="${cur.id}|${i}" ${S.jours['p:' + cur.id]?.taches?.[i] ? 'checked' : ''}><span>${esc(t)}</span></label></li>`).join('')}</ul>
    ${cur.briques ? `<h3>Blocs à travailler, dans l'ordre${prio.length ? ' (commence par tes priorités ci-dessous)' : ''}</h3><ol>${cur.briques.map((b) => `<li>${esc(b)}</li>`).join('')}</ol>` : ''}
    ${cur.annales ? `<p><b>Annales :</b> ${cur.annales.map(esc).join(', ')}</p>` : ''}
  </section>` : `<section class="card"><h2>${ph === 'apres' ? 'Après mai 2027' : 'Calendrier'}</h2><p class="muted">${ph === 'apres' ? 'Résultats le 2 juillet 2027.' : ''}</p></section>`}
  <section class="card"><h2>Tes priorités</h2>
    ${prio.length ? `<ol>${prio.map((p) => `<li>${esc(D.itemById[D.notionById[p.id]?.item]?.titre || (D.notionById[p.id]?.theme || p.id).replace(/_/g, ' '))} <span class="muted">(${p.s})</span></li>`).join('')}</ol><p class="muted">Calcul : questions ratées, cherchées en vain ou laissées blanches, pondérées par la fréquence du thème dans les sujets officiels.</p>` : '<p class="muted">Elles apparaîtront après ton premier débrief.</p>'}
    ${cz.length ? `<h3>Causes de perte de points</h3><ul class="plain">${cz.map((c) => `<li>${esc(CAUSES.find((x) => x[0] === c.cause)?.[1] || c.cause)} : ${c.part} %${c.part > 25 ? ' <span class="badge warn">drills imposés</span>' : ''}</li>`).join('')}</ul>` : ''}
  </section>
  <section class="card"><h2>Semaine type</h2><p>${esc(D.phases.semaine_type)}</p></section>
  <section class="card"><h2>Prochaines dates</h2><ul class="plain">${next.map((x) => `<li><b>${esc(new Date(x.d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))}</b> ${esc(x.t)} <span class="muted">(J-${daysBetween(d, x.d.slice(0, 10))})</span></li>`).join('')}</ul>
    <div class="row">${toolBtn('decision')}${toolBtn('debrief')}${toolBtn('chrono')}</div></section>
  ${ph !== 'jourJ' && d < '2026-11-10' ? '<button class="btn" data-backsprint="1">Revenir au sprint</button>' : ''}`;
}

// ---------- outils ----------
const runState = { t0: 0, kind: null, dur: 0, item: null };

function outils() {
  if (sub === 'chrono') return chronoView();
  if (sub === 'ecriture') return ecritureView();
  if (sub === 'recitation') return recitView();
  if (sub === 'drill') return drillView();
  if (sub === 'debrief') return debriefView();
  if (sub === 'decision') return decisionView();
  if (sub === 'imprimer') return imprimerView();
  const nIdx = Object.keys(S.index).length;
  const med = median(Object.values(S.index).flatMap((e) => (e.hist || []).slice(-3).filter((h) => h.ok).map((h) => h.ms)));
  const lastE = S.ecriture.filter((e) => !e.heure).slice(-1)[0];
  const maitrise = Object.values(S.recit).filter((r) => (r.box || 0) >= 3).length;
  const card = (id, ico, t, d, m) => `<button class="tool" data-go="${id}"><span><b>${t}</b><small>${d}</small></span><span class="m">${m || ''}</span></button>`;
  return `<h2 class="h">S'entraîner</h2><p class="intro">Chaque exercice entraîne un geste de l'épreuve : tenir le temps, trouver vite dans tes livres, savoir dire l'essentiel, écrire assez vite, comprendre tes erreurs. Le téléphone sert à chronométrer et à noter ; le travail se fait sur papier.</p>
  ${card('chrono', '', 'Chrono d\'épreuve', 'Pour faire une annale en 4h30 : il te dit quand changer de dossier', S.chrono ? 'en cours' : `${S.seances.length} séance(s)`)}
  ${card('drill', '', 'Index de ta documentation', 'Note où se trouve chaque notion dans tes livres, puis entraîne-toi à la retrouver vite', `${nIdx} lignes${med ? ` · ${Math.round(med / 1000)} s` : ''}`)}
  ${card('recitation', '', 'Réciter en 30 s', 'Les 15 notions à savoir dire de mémoire, à voix haute', `${maitrise}/15 solides`)}
  ${card('ecriture', '', 'Vitesse d\'écriture', 'Recopier 10 min à la main : tu sauras quelle longueur viser par réponse', lastE ? `${(lastE.mots / lastE.minutes).toFixed(1)} mots/min` : 'à mesurer')}
  ${card('debrief', '', 'Bilan d\'une annale', 'Question par question : su ou pas, et pourquoi. Il fixe tes priorités', `${S.debriefs.length}`)}
  ${card('decision', '', 'Décision de janvier', 'Avec tes notes de novembre : garder ou repasser l\'épreuve', '')}`;
}

// --- Chrono ---
const SESSIONS = ['2026-05', '2025-11', '2025-05', '2024-11', '2024-05', '2023-11', '2023-05', '2022-11', '2022-05', '2021-11', '2021-05', '2020-11', '2019-11', '2019-05', '2018-11', '2018-05'];
function chronoView() {
  const c = S.chrono;
  if (!c) {
    const last = S.seances.slice(-5).reverse();
    return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Chrono d'épreuve</h2>
    <section class="card">
      <label class="lbl">Session travaillée<select id="cSess">${SESSIONS.map((s) => `<option>${s}</option>`).join('')}<option>Réel nov. 2026</option><option>Réel mai 2027</option><option>Exercice libre</option></select></label>
      <label class="lbl">Structure (barème imprimé sur le sujet)<select id="cStruct">${STRUCTURES.map((s) => `<option value="${s.id}">${esc(s.label)}</option>`).join('')}<option value="custom">Autre…</option></select></label>
      <label class="lbl" id="cCustomL" hidden>Barème dans l'ordre où tu traites les dossiers (ex. 3+9+8)<input id="cCustom" type="text" inputmode="numeric" placeholder="3+9+8"></label>
      <label class="lbl">Ordre de traitement des dossiers (ex. 1,3,2)<input id="cOrdre" type="text" inputmode="numeric" placeholder="1,2,3"></label>
      <div class="btnrow"><button class="btn primary" id="cStartNow">Démarrer maintenant</button><button class="btn" id="cStart14">Démarrer à 14h00</button></div>
      <p class="muted">Lecture 30 min, plan 5 min, puis 11 min par point de barème jusqu'à 18h15, relecture 15 min. Le chrono annonce chaque changement de dossier. L'écran reste allumé si l'iPhone le permet. Le chrono survit à la fermeture de l'app.</p>
    </section>
    ${last.length ? `<section class="card"><h3>Dernières séances</h3><ul class="plain">${last.map((s) => `<li>${esc(new Date(s.t).toLocaleDateString('fr-FR'))} · ${esc(s.session)} · ${s.questions.length} questions · médiane ${median(s.questions.map((q) => q.min))?.toFixed(0) ?? '—'} min/question</li>`).join('')}</ul></section>` : ''}`;
  }
  return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">${esc(c.session)} <span class="muted">${esc(c.points.join(' + '))}</span></h2>
  <section class="card chrono" id="chronoLive"></section>
  <div class="btnrow"><button class="btn primary" id="cNext">Question suivante</button><button class="btn" id="cStop">Je cherche : 5 min max</button></div>
  <div style="height:10px"></div>
  <div class="btnrow"><button class="btn" id="cEnd">Terminer et enregistrer</button><button class="btn" id="cCancel">Abandonner</button></div>
  <section class="card" id="cQs"></section>`;
}

function chronoSegments(c) {
  const startMin = c.startMin;
  const j = jalons(c.points, startMin);
  const segs = [{ label: 'Lecture intégrale', end: j.finLecture }, { label: 'Plan et heures de fin', end: j.debutRedaction }];
  c.points.forEach((p, i) => segs.push({ label: `Dossier ${c.ordre[i] ?? i + 1} (${p} pts, ${j.budgets[i]} min)`, end: j.fins[i] }));
  segs.push({ label: 'Relecture technique', end: startMin + 270 });
  return segs;
}

function tickChrono() {
  const c = S.chrono; const el = $('#chronoLive'); if (!c || !el) return;
  const now = new Date(); const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const elapsed = (nowMs() - c.start) / 60000;
  const virt = c.startMin + elapsed; // horloge d'épreuve
  const segs = chronoSegments(c);
  const k = segs.findIndex((s) => virt < s.end);
  const cur = k === -1 ? null : segs[k];
  if (c.lastSeg !== k) { if (c.lastSeg !== undefined) beep(k === -1 ? 3 : 2); c.lastSeg = k; save(S); }
  const rest = cur ? cur.end - virt : 0;
  const stop = c.stopUntil && nowMs() < c.stopUntil ? Math.ceil((c.stopUntil - nowMs()) / 1000) : 0;
  if (c.stopUntil && !stop) { c.stopUntil = 0; save(S); beep(1); toast('5 minutes : écris ce que tu sais et passe à la suite.'); }
  el.innerHTML = `
    <div class="big">${hm(virt)}</div>
    <div class="muted">heure d'épreuve${Math.abs(virt - nowMin) > 1 ? ` · il est ${hm(nowMin)}` : ''}</div>
    <h3>${cur ? esc(cur.label) : 'Terminé : pose le stylo'}</h3>
    ${cur ? `<div class="restant">${Math.floor(rest)} min ${String(Math.floor((rest % 1) * 60)).padStart(2, '0')} s</div>` : ''}
    ${stop ? `<div class="stoploss">Recherche : ${Math.floor(stop / 60)}:${String(stop % 60).padStart(2, '0')}</div>` : ''}
    <ol class="segs">${segs.map((s, i) => `<li class="${i < k || k === -1 ? 'past' : i === k ? 'now' : ''}">${hm(s.end)} · ${esc(s.label)}</li>`).join('')}</ol>`;
  const q = $('#cQs');
  if (q) {
    const qs = c.questions; const base = c.start + 35 * 60000; const last = qs.length ? qs[qs.length - 1].t : base;
    q.innerHTML = `<h3>Question en cours : n° ${qs.length + 1} · ${Math.max(0, Math.floor((nowMs() - last) / 60000))} min</h3>${qs.length ? `<p class="muted">${qs.map((x, i) => `Q${i + 1} ${Math.round((x.t - (i ? qs[i - 1].t : base)) / 60000)} min`).join(' · ')}</p>` : ''}`;
  }
}

function startChrono(at14) {
  const st = $('#cStruct').value;
  let points = st === 'custom' ? $('#cCustom').value.split(/[+\s,;]+/).map(Number).filter((x) => x > 0) : STRUCTURES.find((s) => s.id === st).points.slice();
  if (!points.length) { toast('Indique le barème, par exemple 3+9+8'); return; }
  const ordre = ($('#cOrdre').value || '').split(/[,\s;]+/).map(Number).filter((x) => x > 0);
  const now = new Date();
  const startMin = at14 ? 14 * 60 : now.getHours() * 60 + now.getMinutes();
  S.chrono = { start: nowMs(), startMin, points, ordre: ordre.length === points.length ? ordre : points.map((_, i) => i + 1), session: $('#cSess').value, questions: [] };
  if (at14 && now.getHours() * 60 + now.getMinutes() < 14 * 60) S.chrono.start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).getTime();
  persist(); keepAwake(true); render();
}

// --- Écriture ---
function ecritureView() {
  const hist = S.ecriture.filter((e) => !e.heure);
  const last = hist.slice(-1)[0];
  const mpm = last ? last.mots / last.minutes : 0;
  const n = normeMots(mpm);
  const running = runState.kind === 'ecriture';
  const mod = D.methode.modeles[S.lus.modeleEcriture || 0];
  const annale = S.ecriture.filter((e) => e.heure);
  const h1 = annale.filter((e) => e.heure === 1).slice(-1)[0]; const h4 = annale.filter((e) => e.heure === 4).slice(-1)[0];
  return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Vitesse d'écriture</h2>
  <section class="card">
    <p>Recopie à la main, à ta vitesse d'examen et lisiblement, le modèle ci-dessous pendant 10 minutes. Puis compte les mots écrits. Tu apprends le gabarit en même temps.</p>
    <div class="row">${D.methode.modeles.map((m, i) => `<button class="btn sm ${i === (S.lus.modeleEcriture || 0) ? 'primary' : ''}" data-modele="${i}">Modèle ${i + 1}</button>`).join('')}</div>
    <div class="modele"><b>${esc(mod.titre)}</b><p>${nl2br(mod.texte)}</p></div>
    ${running ? '<div class="big" id="ecrT"></div>' : '<button class="btn primary" id="ecrGo">Lancer 10 minutes</button>'}
    <label class="lbl">Mots écrits en 10 minutes<input id="ecrMots" type="number" inputmode="numeric" min="0" placeholder="ex. 180"></label>
    <button class="btn" id="ecrSave">Enregistrer la mesure</button>
  </section>
  <section class="card"><h3>Ta norme</h3>
    ${n.mesure ? `<p><b>${mpm.toFixed(1)} mots/min</b> → en 110 min nettes pour 10 points, ta main produit ≈ ${n.capacite} mots par point. Vise <b>${n.min} à ${n.max} mots par point</b>.</p>${n.capacite < 100 ? '<p class="muted">Sous 100 mots par point : réponses plus courtes, une seule référence par règle, application en une phrase.</p>' : ''}` : '<p class="muted">Pas encore mesurée. Norme de départ : 100 à 140 mots par point.</p>'}
    ${hist.length > 1 ? `<p class="muted">Historique : ${hist.slice(-6).map((e) => (e.mots / e.minutes).toFixed(1)).join(' → ')} mots/min</p>` : ''}
  </section>
  <section class="card"><h3>Fatigue en annale</h3><p class="muted">Pendant une annale, compte les mots écrits en 10 minutes pendant la 1re heure puis pendant la 4e.</p>
    <div class="btnrow"><label class="lbl">1re heure<input id="ecrH1" type="number" inputmode="numeric" min="0"></label><label class="lbl">4e heure<input id="ecrH4" type="number" inputmode="numeric" min="0"></label></div>
    <button class="btn" id="ecrSaveH">Enregistrer</button>
    ${h1 && h4 ? `<p>Ratio 4e / 1re heure : <b>${(h4.mots / h1.mots).toFixed(2)}</b> ${h4.mots / h1.mots < 0.7 ? '<span class="badge warn">chute forte : en-cas à 16h30, écrire plus court en fin d\'épreuve</span>' : h4.mots / h1.mots < 0.8 ? '<span class="badge">à surveiller (cible ≥ 0,8)</span>' : '<span class="badge ok">tenu</span>'}</p>` : ''}
  </section>`;
}

// --- Récitation ---
function recitQueue() {
  const d = today();
  return D.items.items.filter((it) => isDue(S.recit[it.id] || {}, d)).sort((a, b) => ((S.recit[a.id]?.box || 0) - (S.recit[b.id]?.box || 0)));
}
function recitView() {
  const q = recitQueue();
  const it = runState.item ? D.items.items.find((x) => x.id === runState.item) : null;
  if (it) {
    const revealed = runState.revealed;
    return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Récitation 30 s</h2>
    <section class="card recit"><div class="row between"><span class="badge ${it.prof === 'CAC' ? 'cac' : it.prof === 'EC' ? 'ec' : ''}">${esc(it.prof)}</span><span class="muted">fréquence ${esc(it.freq)}</span></div>
      <h2>${esc(it.titre)}</h2>
      ${revealed ? `<div class="answer">${esc(it.dire)}</div><p class="ref">Où le trouver : ${esc(it.ou)} · sources vérifiées (VERIF.md, lignes ${it.verif.join(', ')})</p>
        <p class="muted">Tu as dit l'essentiel (seuils, textes, conséquence) ?</p>
        <div class="btnrow3"><button class="btn" data-rs="0">Non</button><button class="btn" data-rs="1">En partie</button><button class="btn primary" data-rs="2">Oui</button></div>`
      : `<p>Dis-le à voix haute, sans regarder : règle, textes, chiffres, conséquence.</p><div class="big" id="recT">30</div><button class="btn primary" id="recShow">Révéler</button>`}
    </section>`;
  }
  return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Réciter en 30 s</h2>
  <section class="card"><p>${q.length} notion(s) à réciter aujourd'hui sur 15. Les ratées reviennent demain, les sues s'espacent (1, 3, 7, 14, 30 jours).</p>
  <button class="btn primary" id="recGo" ${q.length ? '' : 'disabled'}>${q.length ? 'Commencer' : 'Rien à réciter aujourd\'hui'}</button></section>
  <section class="card"><h3>Les 15 notions</h3><ul class="plain">${D.items.items.map((it) => { const r = S.recit[it.id]; return `<li><span class="dots">${'●'.repeat(Math.min(5, r?.box || 0))}${'○'.repeat(5 - Math.min(5, r?.box || 0))}</span> ${esc(it.titre)} ${it.e1 ? '<span class="badge">aussi épreuve 1</span>' : ''}</li>`; }).join('')}</ul></section>`;
}

// --- Index et drill ---
function idxEntries() { return Object.entries(S.index).map(([id, e]) => ({ id, ...e })); }
function drillView() {
  const d = today();
  const all = idxEntries();
  const due = all.filter((e) => e.ref && isDue(e, d));
  const todo = D.index_seed.entrees.filter((s) => !S.index[s.id]);
  const lastOk = all.flatMap((e) => (e.hist || []).filter((h) => h.ok).map((h) => h.ms)).slice(-20);
  const allH = all.flatMap((e) => e.hist || []).slice(-30);
  const rate = allH.length ? Math.round((allH.filter((h) => h.ok).length / allH.length) * 100) : null;
  const cur = runState.item ? (S.index[runState.item] || D.index_seed.entrees.find((x) => x.id === runState.item)) : null;
  if (cur) {
    const first = !S.index[runState.item]?.ref;
    return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">${first ? 'Trouve-la dans tes livres' : 'Retrouve-la'}</h2>
    <section class="card recit"><span class="badge">${esc(cur.volume)}</span><h2>${esc(cur.motcle)}</h2>
      <div class="big" id="drT">0</div>
      <p class="muted">${first ? 'Trouve-la dans ta doc papier, puis note la page ou le numéro de paragraphe.' : 'Retrouve-la dans ta doc papier et note la référence.'}</p>
      <label class="lbl">Référence (page, n° de paragraphe, article)<input id="drRef" type="text" autocomplete="off" placeholder="ex. p. 412 ou n° 41250"></label>
      <label class="lbl">Volume réel<input id="drVol" type="text" value="${esc(S.index[runState.item]?.volume || cur.volume)}"></label>
      <div class="btnrow"><button class="btn primary" id="drOk">Valider</button><button class="btn" id="drFail">Introuvable</button></div>
    </section>`;
  }
  return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Index de ta documentation</h2><p class="intro">Le jour J, tu perds des points à chercher. Ici, tu notes la page où se trouve chaque notion dans tes livres ; l'app te la refait chercher de temps en temps, chronométré, jusqu'à ce que ce soit rapide. À la fin, tu imprimes ton index et tu l'emportes.</p>
  <section class="card"><div class="grid3"><div class="stat"><div class="n">${all.filter((e) => e.ref).length}</div><div class="l">lignes</div></div><div class="stat"><div class="n">${lastOk.length ? Math.round(median(lastOk) / 1000) + ' s' : '—'}</div><div class="l">médiane</div></div><div class="stat"><div class="n">${rate === null ? '—' : rate + ' %'}</div><div class="l">trouvées</div></div></div>
  <p class="muted">Cibles : 80 lignes le 5 novembre, 100 le 8, 500 le 4 mai ; médiane sous 60 s et plus de 95 % trouvées en avril.</p>
  <div class="btnrow"><button class="btn primary" id="drGo" ${due.length ? '' : 'disabled'}>Retrouver (${due.length} à revoir)</button><button class="btn" id="drLoc" ${todo.length ? '' : 'disabled'}>Chercher une nouvelle (${todo.length})</button></div>
  <div style="height:10px"></div><div class="btnrow"><button class="btn" data-go="imprimer">Imprimer l'index</button><button class="btn" id="drAdd">Ajouter une ligne</button></div></section>
  <section class="card" id="drAddF" hidden><label class="lbl">Notion<input id="drAm" type="text"></label><label class="lbl">Volume<input id="drAv" type="text" placeholder="Mémento Audit, V1…"></label><label class="lbl">Référence<input id="drAr" type="text"></label><button class="btn primary" id="drAs">Ajouter</button></section>
  ${all.length ? `<section class="card"><h3>Ton index</h3><ul class="plain small">${all.sort((a, b) => a.motcle.localeCompare(b.motcle, 'fr')).map((e) => `<li><b>${esc(e.motcle)}</b> · ${esc(e.volume)} · ${esc(e.ref || 'introuvable')}</li>`).join('')}</ul></section>` : ''}`;
}

function imprimerView() {
  const all = idxEntries().filter((e) => e.ref).sort((a, b) => a.motcle.localeCompare(b.motcle, 'fr'));
  return `<button class="link noprint" data-back="1">‹ Outils</button><div class="noprint"><h2 class="h">Index imprimable</h2><p class="muted">${all.length} lignes, triées. Partager › Imprimer (ou Enregistrer en PDF).</p><div class="btnrow"><button class="btn primary" id="prGo">Imprimer</button><button class="btn" id="prCsv">Exporter CSV</button></div></div>
  <table class="print"><thead><tr><th>Notion</th><th>Volume</th><th>Réf.</th></tr></thead><tbody>${all.map((e) => `<tr><td>${esc(e.motcle)}</td><td>${esc(e.volume)}</td><td>${esc(e.ref)}</td></tr>`).join('')}</tbody></table>`;
}

// --- Débrief ---
let draft = null;
function debriefView() {
  if (draft) {
    const opts = D.notions.notions.map((n) => `<option value="${n.id}">${esc((D.itemById[n.item]?.titre || n.theme.replace(/_/g, ' ')).slice(0, 48))}</option>`).join('');
    return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Débrief : ${esc(draft.session)}</h2>
    <section class="card"><p class="muted">Une ligne par question. Thème = la notion principale ; statut = ce qui s'est passé ; cause = pourquoi des points ont été perdus.</p>
    ${draft.questions.map((q, i) => `<div class="qrow" data-qi="${i}"><b>Q${esc(q.n)}</b>
      <select data-f="theme"><option value="">Thème…</option>${opts.replace(`value="${q.theme}"`, `value="${q.theme}" selected`)}</select>
      <select data-f="statut">${[['su', 'Su'], ['partiel', 'Partiel'], ['cherche', 'Cherché en vain'], ['blanc', 'Blanc']].map(([v, l]) => `<option value="${v}" ${q.statut === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <select data-f="cause"><option value="">Cause…</option>${CAUSES.map(([v, l]) => `<option value="${v}" ${q.cause === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>`).join('')}
    <div class="btnrow"><button class="btn" id="dbAddQ">+ question</button><label class="lbl">Note auto-attribuée /20<input id="dbNote" type="number" step="0.25" min="0" max="20" value="${esc(draft.note ?? '')}"></label></div>
    <div class="btnrow"><button class="btn primary" id="dbSave">Enregistrer</button><button class="btn" id="dbCancel">Annuler</button></div></section>`;
  }
  const cz = causes(S.debriefs);
  return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Bilan d'une annale</h2><p class="intro">Après chaque annale (et après le vrai examen), une ligne par question : ce que tu as su, ce que tu as cherché en vain, ce que tu as laissé blanc, et pourquoi. L'écran Aujourd'hui en déduit tes priorités.</p>
  <section class="card"><label class="lbl">Session<select id="dbSess"><option>Réel nov. 2026</option>${SESSIONS.map((s) => `<option>${s}</option>`).join('')}<option>Réel mai 2027</option></select></label>
  <label class="lbl">Nombre de questions<input id="dbN" type="number" min="1" max="30" value="${S.seances.slice(-1)[0]?.questions.length || 18}"></label>
  <button class="btn primary" id="dbNew">Nouveau débrief</button></section>
  ${S.debriefs.length ? `<section class="card"><h3>Historique</h3><ul class="plain">${S.debriefs.slice().reverse().map((d) => `<li>${esc(new Date(d.t).toLocaleDateString('fr-FR'))} · <b>${esc(d.session)}</b> · ${d.note !== '' && d.note != null ? esc(d.note) + '/20 · ' : ''}${d.questions.filter((q) => q.statut === 'su').length}/${d.questions.length} sues <button class="link" data-dbedit="${d.id}">modifier</button></li>`).join('')}</ul></section>` : ''}
  ${cz.length ? `<section class="card"><h3>Causes cumulées</h3><ul class="plain">${cz.map((c) => `<li>${esc(CAUSES.find((x) => x[0] === c.cause)?.[1] || c.cause)} : ${c.n} (${c.part} %)</li>`).join('')}</ul></section>` : ''}`;
}

// --- Décision ---
function decisionView() {
  const v = S.decision;
  const has = v.e2 !== '' && v.e2 != null;
  const r = has ? decision(v.e1 === 'blanche' ? 'blanche' : (v.e1 === '' ? 'blanche' : Number(v.e1)), Number(v.e2), Number(v.e3)) : null;
  const rows = [[12, 11], [10, 11], [12, 12], [10, 12], [12, 13], [14, 12]].map(([e1, e3]) => `<tr><td>${e1}</td><td>${e3}</td><td><b>${Math.max(6, Math.ceil(((80 - e1 - 4 * e3) / 3) * 2) / 2)}</b></td></tr>`).join('');
  return `<button class="link" data-back="1">‹ Outils</button><h2 class="h">Décision de janvier</h2>
  <section class="card"><p class="intro">Le diplôme s'obtient avec : épreuve 1 + 3 × épreuve 2 + 4 × mémoire ≥ 80 points, sans note éliminatoire (moins de 6 aux écrits, moins de 10 au mémoire). Entre tes notes de novembre et ce calcul.</p>
    <label class="lbl">Épreuve 1 (novembre)<input id="deE1" type="text" inputmode="decimal" placeholder="note, ou « blanche »" value="${esc(v.e1)}"></label>
    <label class="lbl">Épreuve 2 (novembre)<input id="deE2" type="number" step="0.25" min="0" max="20" value="${esc(v.e2)}"></label>
    <label class="lbl">Hypothèse mémoire : <b id="deE3v">${esc(v.e3)}</b><input id="deE3" type="range" min="10" max="16" step="0.5" value="${esc(v.e3)}"></label>
    <button class="btn primary" id="deGo">Calculer</button></section>
  ${r ? `<section class="card hero2"><h2>${esc(r.verdict)}</h2><ul class="plain">${r.actions.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>${r.S !== null ? `<p class="muted">Points acquis aux écrits : ${r.S} ; note de mémoire nécessaire : ${r.e3Requis}.</p>` : ''}${r.alertes.map((a) => `<p class="warnline">${esc(a)}</p>`).join('')}</section>` : ''}
  <section class="card"><h3>Ce que l'épreuve 2 doit rapporter</h3><table class="tbl"><thead><tr><th>Épreuve 1</th><th>Mémoire</th><th>Épreuve 2 nécessaire</th></tr></thead><tbody>${rows}</tbody></table><p class="muted">8 est le plancher, 10 la cible.</p></section>`;
}

// ---------- carte ----------
// Fréquence d'une notion recalculée sur tous les sujets codés (16), à partir du code de thème en tête de son libellé.
function freqOf(n) {
  const code = n.theme.split(/[\s+,]/)[0];
  const t = D.stats.themes.find((x) => x.code === code);
  return t ? { s: t.sessions, n: D.stats.n_sessions } : { s: n.sessions, n: 14 };
}
let carteFiltre = 'star';
let carteQ = '';
function carte() {
  let list = D.notions.notions;
  if (carteFiltre === 'star') list = list.filter((n) => n.star);
  if (carteFiltre === 'B') list = list.filter((n) => !n.star && n.nov === 'B');
  if (carteFiltre === 'mai') list = list.filter((n) => !n.star && n.mai === 'A');
  if (carteQ) { const q = carteQ.toLowerCase(); list = list.filter((n) => (n.theme + ' ' + n.dire).toLowerCase().includes(q)); }
  const st = D.stats;
  const chip = (id, l) => `<button class="chip ${carteFiltre === id ? 'sel' : ''}" data-cf="${id}">${l}</button>`;
  const intro = '<h2 class="h">À savoir</h2><p class="intro">Ce qui tombe le plus, d\'après les 16 derniers sujets. « Par cœur » : à savoir dire sans livre. « À retrouver » : à savoir trouver vite dans tes livres. La barre verte montre combien de sujets en ont parlé.</p>';
  const chips = `<div class="chips">${chip('star', 'Par cœur')}${chip('B', 'À retrouver')}${chip('mai', 'Pour mai')}${chip('all', 'Tout')}${chip('stats', 'Statistiques')}</div>`;
  if (carteFiltre === 'stats') {
    const maxQ = Math.max(...st.themes.map((t) => t.sessions));
    return `${intro}${chips}
    <section class="card"><h2>${st.n_questions} questions, ${st.n_sessions} sujets officiels</h2><p class="muted">Sessions ${esc(st.sessions[0])} à ${esc(st.sessions[st.sessions.length - 1])}, codées question par question. Questions EC : ${st.profession.EC}, CAC : ${st.profession.CAC}, mixtes : ${st.profession.MIXTE || 0}.</p>
    <h3>Domaines (présents dans N sessions sur ${st.n_sessions})</h3>${st.domaines.map((d) => `<div class="hb"><span>${esc(d.code)}</span>${freqBar(d.sessions, st.n_sessions)}<small>${d.sessions} · ${d.questions} q.</small></div>`).join('')}</section>
    <section class="card"><h3>Thèmes, du plus récurrent au plus rare</h3>${st.themes.map((t) => `<div class="hb"><span>${esc(t.code.replace(/_/g, ' '))}</span>${freqBar(t.sessions, maxQ > 14 ? maxQ : 14)}<small>${t.sessions} · ${t.questions} q. · ${esc(t.derniere)}</small></div>`).join('')}
    <p class="muted">Lecture : un thème présent dans 10 sessions sur 14 tombera probablement. Le nombre de questions ne pèse pas les points (barème par dossier seulement).</p></section>`;
  }
  return `${intro}${chips}
  <input id="cq" type="search" placeholder="Chercher une notion, un article…" value="${esc(carteQ)}">
  <p class="muted">${carteFiltre === 'star' ? 'Les 15 notions à savoir dire de mémoire en 30 secondes. Touche une notion pour l\'ouvrir.' : carteFiltre === 'B' ? 'À savoir retrouver dans tes livres en moins de 90 secondes : ajoute-les à ton index.' : carteFiltre === 'mai' ? 'À apprendre par cœur d\'ici mai 2027.' : ''}</p>
  ${list.map((n) => `<details class="card notion"><summary><div class="row between"><b>${esc(n.item && D.itemById[n.item] ? D.itemById[n.item].titre : n.theme.replace(/_/g, ' '))}</b>${n.e1 ? '<span class="badge">sert aussi à l\'épreuve 1</span>' : ''}</div><div class="row">${freqBar(freqOf(n).s, freqOf(n).n)}<small class="muted">${freqOf(n).s} sujets sur ${freqOf(n).n} · ${n.nov === 'A' ? 'par cœur' : n.nov === 'B' ? 'à retrouver' : 'secondaire'} en novembre</small></div></summary>
    ${n.item && D.itemById[n.item] ? `<p>${esc(D.itemById[n.item].dire)}</p><details class="tech"><summary>Détail technique (notes du plan)</summary><p>${esc(n.dire)}</p></details>` : `<p>${esc(n.dire)}</p>`}<p class="ref">Où le trouver : ${esc(n.ou)}${n.verif.length ? ` · sources vérifiées (VERIF.md, lignes ${n.verif.join(', ')})` : ''}</p></details>`).join('')}`;
}

// ---------- méthode ----------
function methode() {
  const M = D.methode;
  const sec = (id, t, body, open) => `<details class="card" ${open ? 'open' : ''}><summary><h2>${t}</h2></summary>${body}</details>`;
  const grilles = STRUCTURES.map((s) => { const j = jalons(s.points); return `<tr><td>${esc(s.label)}</td><td>${j.budgets.join(' / ')}</td><td>${j.fins.map(hm).join(' · ')}</td></tr>`; }).join('');
  return `<h2 class="h">Méthode</h2><p class="intro">Comment se déroule l'épreuve, comment gérer les 4h30 et comment rédiger une réponse. À relire avant chaque annale.</p>
  ${sec('ep', "L'épreuve, officiellement", `<ul class="plain">${M.epreuve.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p class="ref">Note du jury du 6 juillet 2026 ; arrêté du 13 février 2019 ; arrêté du 23 avril 2026.</p>`)}
  ${sec('sq', 'Le squelette, minute par minute', `<ol class="plain">${M.squelette.map((x) => `<li><b>${esc(x.h)}</b> ${esc(x.a)}</li>`).join('')}</ol>`, true)}
  ${sec('gr', 'Heures de fin par dossier (11 min par point)', `<table class="tbl"><thead><tr><th>Structure</th><th>Minutes</th><th>Fins</th></tr></thead><tbody>${grilles}</tbody></table><p class="muted">Dossiers pris par points décroissants, sauf un petit dossier facile à prendre en premier (mai 2026 : le 3 points).</p>`)}
  ${sec('rg', 'Règles de gestion', `<ul class="plain">${M.regles.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`)}
  ${sec('cr', 'Critique de document (format le plus fréquent)', `<ol class="plain">${M.critique.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><p><b>${esc(M.critique_regle)}</b></p>`)}
  ${sec('ga', 'Format de réponse et modèles', `<pre class="gabarit">${esc(M.gabarit)}</pre><p>${esc(M.longueur)}</p>${M.modeles.map((m) => `<div class="modele"><b>${esc(m.titre)}</b><div class="muted">${esc(m.meta)}</div><p>${nl2br(m.texte)}</p></div>`).join('')}`)}
  ${sec('jj', 'Journée du 10 novembre', `<ul class="plain">${M.journee.map((x) => `<li><b>${esc(x.h)}</b> ${esc(x.a)}</li>`).join('')}</ul>`)}
  ${sec('er', 'Sept erreurs fatales', `<ol class="plain">${M.erreurs.map((x) => `<li><b>${esc(x.e)}.</b> ${esc(x.r)}</li>`).join('')}</ol><p class="warnline">${esc(M.pieges_chiffres)}</p>`)}
  <section class="card"><h2>Pour aller au fond</h2><ul class="plain"><li><a href="${REPO}docs/PLAN.md" target="_blank" rel="noopener">Le plan complet</a></li><li><a href="${REPO}docs/VERIF.md" target="_blank" rel="noopener">Les 121 vérifications juridiques sourcées</a></li><li><a href="${REPO}docs/STATS.md" target="_blank" rel="noopener">Les statistiques de récurrence</a></li><li><a href="${REPO}docs/college/" target="_blank" rel="noopener">Le débat du collège (stratèges, contradicteurs)</a></li></ul></section>`;
}

// ---------- matériel ----------
function materiel() {
  const G = D.materiel.groupes;
  const tot = G.flatMap((g) => g.items).length; const ok = G.flatMap((g) => g.items).filter((i) => S.materiel[i.id]).length;
  const docs = G.find((g) => g.id === 'gratuits').items.filter((i) => i.pdf);
  return `<h2 class="h">Matériel</h2><p class="intro">Ce qu'il faut imprimer, acheter et emporter le jour J. Coche au fur et à mesure.</p>
  <section class="card hero2"><h2>Documents à imprimer</h2><p class="muted">Touche un document pour l'ouvrir, puis Partager › Imprimer, ou envoie-le à la reprographie (recto-verso, reliure spirale).</p>
    <ul class="docs">${docs.map((i) => `<li><a href="./${i.pdf}" target="_blank" rel="noopener"><b>${esc(i.court)}</b><small>${i.pages} pages · onglets ${esc(i.onglet)}</small></a></li>`).join('')}</ul>
    <a class="btn sm" href="${REPO}imprimer/LISEZMOI.md" target="_blank" rel="noopener">Consignes pour la reprographie</a></section>
  <section class="card hero">${ring(ok / tot, `${ok}`, `sur ${tot}`)}<div><p>Rien dans le sac qui n'ait servi dans une annale.</p></div></section>
  ${G.map((g) => `<section class="card"><h2>${esc(g.titre)}</h2><ul class="checks">${g.items.map((i) => `<li><label><input type="checkbox" data-mat="${i.id}" ${S.materiel[i.id] ? 'checked' : ''}><span>${esc(i.t)}${i.note ? `<small class="muted"> · ${esc(i.note)}</small>` : ''}</span></label></li>`).join('')}</ul></section>`).join('')}
  <p class="muted">${esc(D.materiel.exclus)}</p>`;
}

// ---------- réglages ----------
function applyTheme() {
  const t = S.settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  try { localStorage.setItem('dec2.theme', t || 'auto'); } catch { /* */ }
}
function openSettings() {
  const sh = $('#sheet');
  sh.innerHTML = `<div class="sheetin"><h2>Réglages</h2>
    <label class="lbl">Apparence<select id="stTheme">${[['auto', 'Automatique (comme l\'iPhone)'], ['light', 'Toujours clair'], ['dark', 'Toujours sombre']].map(([v, l]) => `<option value="${v}" ${(S.settings.theme || 'auto') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="lbl">Date simulée (pour tester l'après-novembre)<input id="stDate" type="date" value="${esc(S.settings.dateSimulee)}"></label>
    <div class="btnrow"><button class="btn" id="stExp">Exporter ma progression</button><label class="btn">Importer<input id="stImp" type="file" accept="application/json" hidden></label></div>
    <div style="height:10px"></div><button class="btn" id="stReset">Tout effacer</button>
    <div style="height:10px"></div><button class="btn primary" id="stClose">Fermer</button>
    <p class="muted">Données stockées sur cet iPhone uniquement. Exporte avant de changer de téléphone.</p></div>`;
  sh.hidden = false;
  $('#stTheme').onchange = () => { S.settings.theme = $('#stTheme').value; applyTheme(); persist(); };
  $('#stClose').onclick = () => { S.settings.dateSimulee = $('#stDate').value; persist(); sh.hidden = true; viewDay = null; render(); };
  $('#stExp').onclick = () => {
    const blob = new Blob([exportJSON(S)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `dec2-progression-${ymd(new Date())}.json`; a.click();
  };
  $('#stImp').onchange = async (e) => { try { S = importJSON(await e.target.files[0].text(), S); persist(); toast('Progression importée'); sh.hidden = true; render(); } catch (err) { toast('Import impossible : ' + err.message); } };
  $('#stReset').onclick = () => { if (confirm('Effacer toute la progression ? (une copie est gardée)')) { localStorage.setItem('dec2.state.prev', JSON.stringify(S)); S = defaultState(); persist(); sh.hidden = true; render(); } };
}

// ---------- minuteries ----------
function startTick() {
  clearInterval(timer);
  const f = () => {
    if (sub === 'chrono') tickChrono();
    else if (runState.t0) {
      const el = $('#ecrT') || $('#recT') || $('#drT'); if (!el) return;
      const s = (nowMs() - runState.t0) / 1000;
      if (runState.kind === 'ecriture') { const r = Math.max(0, 600 - s); el.textContent = `${Math.floor(r / 60)}:${String(Math.floor(r % 60)).padStart(2, '0')}`; if (r === 0 && !runState.done) { runState.done = 1; beep(3); toast('Stop : compte tes mots.'); } }
      if (runState.kind === 'recit') { const r = Math.max(0, 30 - Math.floor(s)); el.textContent = r; if (r === 0 && !runState.done) { runState.done = 1; beep(1); } }
      if (runState.kind === 'drill') { el.textContent = `${Math.floor(s)} s`; el.classList.toggle('late', s > 90); }
    }
  };
  f(); timer = setInterval(f, 1000);
}

// ---------- liaisons ----------
function bindCommon(m) {
  m.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const g = b.dataset.go;
    if (['methode', 'materiel'].includes(g)) { tab = g; sub = null; }
    else { tab = 'outils'; sub = g; }
    if (b.dataset.newreel) draft = { id: 'd' + nowMs(), session: 'Réel nov. 2026', note: '', questions: Array.from({ length: 18 }, (_, i) => ({ n: i + 1, theme: '', statut: 'su', cause: '' })) };
    runState.t0 = 0; runState.item = null; render();
  }));
  m.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => { sub = null; runState.t0 = 0; runState.item = null; render(); }));
  m.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { viewDay = b.dataset.day; tab = 'home'; render(); }));
  m.querySelectorAll('[data-goafter]').forEach((b) => b.addEventListener('click', () => { m.innerHTML = apres(today() < '2026-11-11' ? '2026-11-11' : today(), phaseFor(today() < '2026-11-11' ? '2026-11-12' : today(), D.phases.phases)); bindCommon(m); }));
  m.querySelectorAll('[data-guideok]').forEach((b) => b.addEventListener('click', () => { S.lus.guide = 1; persist(); render(true); }));
  m.querySelectorAll('[data-backsprint]').forEach((b) => b.addEventListener('click', () => render()));
  m.querySelectorAll('[data-task]').forEach((c) => c.addEventListener('change', () => {
    const [date, i] = c.dataset.task.split('|');
    const st = S.jours[date] || (S.jours[date] = { taches: {} });
    st.taches[i] = c.checked;
    const j = D.parcours.jours.find((x) => x.date === date);
    if (jourFait(j) && !st.fait) { st.fait = nowMs(); toast(`Journée bouclée : ${heuresFaites()} h sur ${D.parcours.budget_h}`); }
    persist(); setTimeout(() => render(true), 250);
  }));
  m.querySelectorAll('[data-ptask]').forEach((c) => c.addEventListener('change', () => {
    const [p, i] = c.dataset.ptask.split('|'); const k = 'p:' + p;
    const st = S.jours[k] || (S.jours[k] = { taches: {} }); st.taches[i] = c.checked; persist();
  }));
  m.querySelectorAll('[data-mat]').forEach((c) => c.addEventListener('change', () => { S.materiel[c.dataset.mat] = c.checked; persist(); setTimeout(() => render(true), 200); }));
  m.querySelectorAll('[data-cf]').forEach((b) => b.addEventListener('click', () => { carteFiltre = b.dataset.cf; render(); }));
  const cq = $('#cq', m); if (cq) cq.addEventListener('input', () => { carteQ = cq.value; const pos = cq.selectionStart; render(true); const n = $('#cq'); n.focus(); n.setSelectionRange(pos, pos); });

  // chrono
  if ($('#cStruct', m)) $('#cStruct').onchange = () => { $('#cCustomL').hidden = $('#cStruct').value !== 'custom'; };
  if ($('#cStartNow', m)) $('#cStartNow').onclick = () => startChrono(false);
  if ($('#cStart14', m)) $('#cStart14').onclick = () => startChrono(true);
  if ($('#cNext', m)) $('#cNext').onclick = () => { S.chrono.questions.push({ t: nowMs() }); persist(); tickChrono(); };
  if ($('#cStop', m)) $('#cStop').onclick = () => { S.chrono.stopUntil = nowMs() + 5 * 60000; persist(); tickChrono(); };
  if ($('#cCancel', m)) $('#cCancel').onclick = () => { if (confirm('Abandonner la séance sans l\'enregistrer ?')) { S.chrono = null; persist(); keepAwake(false); render(); } };
  if ($('#cEnd', m)) $('#cEnd').onclick = () => {
    const c = S.chrono; const qs = c.questions; const base = c.start + 35 * 60000;
    const mins = qs.map((q, i) => Math.round(((q.t - (i ? qs[i - 1].t : base)) / 60000) * 10) / 10);
    S.seances.push({ t: c.start, session: c.session, points: c.points, questions: mins.map((min) => ({ min })), dureeMin: Math.round((nowMs() - c.start) / 60000) });
    S.chrono = null; persist(); keepAwake(false); toast('Séance enregistrée : fais le débrief'); sub = 'debrief'; render();
  };
  // écriture
  m.querySelectorAll('[data-modele]').forEach((b) => b.addEventListener('click', () => { S.lus.modeleEcriture = +b.dataset.modele; persist(); render(true); }));
  if ($('#ecrGo', m)) $('#ecrGo').onclick = () => { runState.t0 = nowMs(); runState.kind = 'ecriture'; runState.done = 0; keepAwake(true); render(); };
  if ($('#ecrSave', m)) $('#ecrSave').onclick = () => {
    const n = +$('#ecrMots').value; if (!(n > 0)) { toast('Indique le nombre de mots'); return; }
    const minutes = runState.kind === 'ecriture' && runState.t0 ? Math.min(10, Math.max(1, (nowMs() - runState.t0) / 60000)) : 10;
    S.ecriture.push({ t: nowMs(), mots: n, minutes: Math.round(minutes * 10) / 10 }); runState.t0 = 0; runState.kind = null; keepAwake(false); persist(); render();
  };
  if ($('#ecrSaveH', m)) $('#ecrSaveH').onclick = () => {
    const a = +$('#ecrH1').value; const b = +$('#ecrH4').value;
    if (a > 0) S.ecriture.push({ t: nowMs(), mots: a, minutes: 10, heure: 1 });
    if (b > 0) S.ecriture.push({ t: nowMs(), mots: b, minutes: 10, heure: 4 });
    persist(); render();
  };
  // récitation
  if ($('#recGo', m)) $('#recGo').onclick = () => { const q = recitQueue(); runState.item = q[0]?.id; runState.revealed = false; runState.t0 = nowMs(); runState.kind = 'recit'; runState.done = 0; render(); };
  if ($('#recShow', m)) $('#recShow').onclick = () => { runState.revealed = true; runState.t0 = 0; render(); };
  m.querySelectorAll('[data-rs]').forEach((b) => b.addEventListener('click', () => {
    const s = +b.dataset.rs; const id = runState.item; const r = S.recit[id] || (S.recit[id] = { box: 0, hist: [] });
    r.box = s === 2 ? nextBox(r.box, true) : s === 0 ? 0 : r.box || 0;
    r.due = addDays(today(), s === 1 ? 1 : INTERVALS[r.box]); r.hist = [...(r.hist || []).slice(-20), { t: nowMs(), s }];
    persist();
    const q = recitQueue().filter((x) => x.id !== id);
    runState.item = q[0]?.id || null; runState.revealed = false; runState.t0 = runState.item ? nowMs() : 0; runState.done = 0;
    if (!runState.item) toast('Récitation terminée pour aujourd\'hui');
    render();
  }));
  // drill
  if ($('#drGo', m)) $('#drGo').onclick = () => { const d = today(); const due = idxEntries().filter((e) => e.ref && isDue(e, d)).sort((a, b) => (a.box || 0) - (b.box || 0)); runState.item = due[0]?.id; runState.t0 = nowMs(); runState.kind = 'drill'; render(); };
  if ($('#drLoc', m)) $('#drLoc').onclick = () => { const todo = D.index_seed.entrees.filter((s) => !S.index[s.id]); runState.item = todo[0]?.id; runState.t0 = nowMs(); runState.kind = 'drill'; render(); };
  if ($('#drAdd', m)) $('#drAdd').onclick = () => { $('#drAddF').hidden = false; };
  if ($('#drAs', m)) $('#drAs').onclick = () => {
    const mc = $('#drAm').value.trim(); if (!mc) return;
    S.index['u' + nowMs()] = { motcle: mc, volume: $('#drAv').value.trim(), ref: $('#drAr').value.trim(), box: 0, due: today(), hist: [] }; persist(); render();
  };
  const finishDrill = (found) => {
    const id = runState.item; const ms = nowMs() - runState.t0; const ref = $('#drRef').value.trim(); const vol = $('#drVol').value.trim();
    const seed = D.index_seed.entrees.find((x) => x.id === id);
    let e = S.index[id];
    if (!e || !e.ref) {
      e = S.index[id] = { motcle: (e || seed).motcle, volume: vol || (e || seed).volume, ref: found ? ref : '', box: 0, due: addDays(today(), 1), hist: [{ t: nowMs(), ms, ok: found && !!ref, first: true }] };
      if (found && !ref) { toast('Note la référence trouvée'); delete S.index[id]; return; }
    } else {
      const ok = found && sameRef(ref, e.ref);
      e.box = nextBox(e.box, ok); e.due = addDays(today(), ok ? INTERVALS[e.box] : 0); e.hist = [...(e.hist || []).slice(-20), { t: nowMs(), ms, ok }];
      if (vol) e.volume = vol;
      toast(ok ? `Trouvé en ${Math.round(ms / 1000)} s` : `Réf. attendue : ${e.ref}`);
    }
    persist(); runState.item = null; runState.t0 = 0; render();
  };
  if ($('#drOk', m)) $('#drOk').onclick = () => finishDrill(true);
  if ($('#drFail', m)) $('#drFail').onclick = () => finishDrill(false);
  if ($('#drRef', m)) $('#drRef').addEventListener('keydown', (e) => { if (e.key === 'Enter') finishDrill(true); });
  if ($('#prGo', m)) $('#prGo').onclick = () => window.print();
  if ($('#prCsv', m)) $('#prCsv').onclick = () => {
    const rows = idxEntries().filter((e) => e.ref).sort((a, b) => a.motcle.localeCompare(b.motcle, 'fr')).map((e) => [e.motcle, e.volume, e.ref].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(';'));
    const blob = new Blob(['﻿Notion;Volume;Référence\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'index-dec2.csv'; a.click();
  };
  // débrief
  if ($('#dbNew', m)) $('#dbNew').onclick = () => { const n = Math.max(1, Math.min(30, +$('#dbN').value || 18)); draft = { id: 'd' + nowMs(), session: $('#dbSess').value, note: '', questions: Array.from({ length: n }, (_, i) => ({ n: i + 1, theme: '', statut: 'su', cause: '' })) }; render(); };
  m.querySelectorAll('[data-dbedit]').forEach((b) => b.addEventListener('click', () => { draft = JSON.parse(JSON.stringify(S.debriefs.find((d) => d.id === b.dataset.dbedit))); render(); }));
  m.querySelectorAll('.qrow select').forEach((s) => s.addEventListener('change', () => { const i = +s.closest('.qrow').dataset.qi; draft.questions[i][s.dataset.f] = s.value; }));
  if ($('#dbAddQ', m)) $('#dbAddQ').onclick = () => { draft.questions.push({ n: draft.questions.length + 1, theme: '', statut: 'su', cause: '' }); render(true); };
  if ($('#dbCancel', m)) $('#dbCancel').onclick = () => { draft = null; render(); };
  if ($('#dbSave', m)) $('#dbSave').onclick = () => {
    draft.note = $('#dbNote').value; draft.t = draft.t || nowMs();
    const i = S.debriefs.findIndex((d) => d.id === draft.id); if (i >= 0) S.debriefs[i] = draft; else S.debriefs.push(draft);
    draft = null; persist(); toast('Débrief enregistré : priorités recalculées'); render();
  };
  // décision
  if ($('#deE3', m)) $('#deE3').oninput = () => { $('#deE3v').textContent = $('#deE3').value; };
  if ($('#deGo', m)) $('#deGo').onclick = () => {
    const e1 = $('#deE1').value.trim().toLowerCase();
    S.decision = { e1: /blanch/.test(e1) ? 'blanche' : e1.replace(',', '.'), e2: $('#deE2').value, e3: $('#deE3').value }; persist(); render();
  };
}

// ---------- démarrage ----------
async function boot() {
  applyTheme();
  await loadData();
  $('nav.bottom').innerHTML = [['home', 'Aujourd\'hui'], ['outils', 'S\'entraîner'], ['carte', 'À savoir'], ['methode', 'Méthode'], ['materiel', 'Matériel']]
    .map(([id, l]) => `<button data-tab="${id}">${l}</button>`).join('');
  document.querySelectorAll('nav.bottom button').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; sub = null; viewDay = null; draft = null; runState.t0 = 0; runState.item = null; render(); }));
  $('#settingsBtn').onclick = openSettings;
  if (S.chrono) { tab = 'outils'; sub = 'chrono'; keepAwake(true); }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && (S.chrono || runState.t0)) { keepAwake(true); startTick(); } });
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
}
boot().catch((e) => { $('#main').innerHTML = `<div class="card">Erreur de démarrage : ${esc(e.message)}</div>`; });
