import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { addDays } from '../js/core.js';

const root = new URL('../', import.meta.url);
const J = (f) => JSON.parse(readFileSync(new URL(f, root), 'utf8'));
const parcours = J('data/parcours.json');
const items = J('data/items.json').items;
const notions = J('data/notions.json').notions;
const stats = J('data/stats.json');
const methode = J('data/methode.json');
const verif = readFileSync(new URL('docs/VERIF.md', root), 'utf8');
const verifRows = new Set([...verif.matchAll(/^\| (\d+) \|/gm)].map((m) => +m[1]));

test('parcours : 40 h exactement, jours consécutifs du 28 octobre au 11 novembre', () => {
  assert.equal(parcours.jours.reduce((a, j) => a + j.h, 0), parcours.budget_h);
  assert.equal(parcours.budget_h, 40);
  assert.equal(parcours.jours[0].date, '2026-10-28');
  for (let i = 1; i < parcours.jours.length; i++) assert.equal(parcours.jours[i].date, addDays(parcours.jours[i - 1].date, 1));
  assert.equal(parcours.jours.find((j) => j.jourJ).date, '2026-11-10');
});

test('parcours : deux annales manuscrites, mai 2025 le 31 octobre et nov. 2025 le 7 novembre', () => {
  const a = parcours.jours.filter((j) => j.annale).map((j) => `${j.date}:${j.annale}`);
  assert.deepEqual(a, ['2026-10-31:2025-05', '2026-11-07:2025-11']);
});

test('parcours : chaque jour a des tâches et des livrables', () => {
  for (const j of parcours.jours) { assert.ok(j.taches.length >= 3, j.date); assert.ok(j.livrables.length >= 1, j.date); }
});

test('items : 15 notions par cœur, chacune sourcée sur une ligne existante de VERIF.md', () => {
  assert.equal(items.length, 15);
  assert.equal(new Set(items.map((i) => i.id)).size, 15);
  for (const it of items) {
    assert.ok(it.dire.length > 120, it.id);
    assert.ok(it.verif.length > 0, it.id);
    for (const n of it.verif) assert.ok(verifRows.has(n), `${it.id} : ligne VERIF ${n} absente`);
  }
});

test('carte : 15 étoiles, identique au plan, références VERIF existantes', () => {
  assert.equal(notions.filter((n) => n.star).length, 15);
  for (const n of notions) for (const v of n.verif) assert.ok(verifRows.has(v), `${n.id} : VERIF ${v}`);
});

const scan = () => {
  const { pieges_chiffres, ...m } = methode;
  return [['items', JSON.stringify(items)], ['notions', JSON.stringify(notions)], ['methode', JSON.stringify(m)], ['parcours', JSON.stringify(parcours)], ['index', readFileSync(new URL('data/index_seed.json', root), 'utf8')]];
};

test('liste noire : aucune valeur périmée dans les données', () => {
  const noir = ['188 700', '188700', '77 700', '77700', 'NP 2010', '9 / 18 / 50', '9/18/50', 'NEP 9505', 'NEP 705', 'R. 233-16', 'L. 821-52 (ex'];
  for (const [nom, txt] of scan()) for (const v of noir) assert.ok(!txt.includes(v), `${nom} contient « ${v} »`);
});

test('livre VIII : un ancien numéro (L. 820, 822, 823) n\'apparaît jamais seul', () => {
  for (const [nom, txt] of scan()) {
    for (const m of txt.matchAll(/L\.\s?82[023]-[\d-]+/g)) {
      const before = txt.slice(Math.max(0, m.index - 4), m.index);
      assert.ok(/ex\s?$/.test(before), `${nom} : « ${m[0]} » sans « ex » devant`);
    }
  }
});

test('seuils CAC : 5 M€ / 10 M€ / 50 et filiales 2,5 / 5 / 25 présents et datés', () => {
  const n = items.find((i) => i.id === 'nomination').dire;
  assert.match(n, /5 M€/); assert.match(n, /10 M€/); assert.match(n, /50 salariés/); assert.match(n, /1er janvier 2024/);
  assert.match(n, /2,5 M€ \/ 5 M€ \/ 25/);
  const micro = items.find((i) => i.id === 'micro').dire;
  assert.match(micro, /203 100 €/); assert.match(micro, /83 600 €/);
});

test('stats : totaux identiques au codage des sujets', () => {
  const lines = readdirSync(new URL('docs/data/', root)).filter((f) => /^sujets_codes.*\.jsonl$/.test(f))
    .flatMap((f) => readFileSync(new URL('docs/data/' + f, root), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)));
  assert.equal(stats.n_questions, lines.length);
  assert.equal(stats.n_sessions, new Set(lines.map((l) => l.session)).size);
  assert.equal(stats.domaines.reduce((a, d) => a + d.questions, 0), lines.length);
});

test('service worker : chaque fichier précaché existe, chaque donnée est précachée', () => {
  const sw = readFileSync(new URL('sw.js', root), 'utf8');
  const core = [...sw.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1]).filter(Boolean);
  for (const f of core) assert.ok(existsSync(new URL(f, root)), `absent : ${f}`);
  for (const f of readdirSync(new URL('data/', root))) assert.ok(core.includes('data/' + f), `non précaché : data/${f}`);
  for (const f of readdirSync(new URL('js/', root))) assert.ok(core.includes('js/' + f), `non précaché : js/${f}`);
});

test('index pré-rempli : entrées valides, triées, sans doublon d\'id, folios numériques pour V1-V6', () => {
  const idx = J('data/index_prerempli.json').entrees;
  assert.ok(idx.length >= 180, `${idx.length} entrées`);
  assert.equal(new Set(idx.map((e) => e.id)).size, idx.length);
  for (const e of idx) {
    assert.ok(e.motcle && e.volume, e.id);
    if (/^V[1-6]$/.test(e.volume)) assert.match(String(e.ref), /^\d+$/, `${e.id} : folio attendu`);
    else assert.equal(e.ref, '', `${e.id} : page Mémento à compléter`);
  }
  const noms = idx.map((e) => e.motcle.toLocaleLowerCase('fr'));
  assert.ok(!JSON.stringify(idx).includes('NEP 705'));
});
