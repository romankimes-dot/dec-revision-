// Recherche « Trouver » : qualité mesurée sur les folios vérifiés de l'index pré-rempli.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createIndex, search, searchEntries, passages, surligner, norm } from '../js/search.js';

const root = new URL('../', import.meta.url);
const J = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const idx = createIndex(J('data/search.json'));
const top = (q, n = 1) => search(idx, q, { limit: n }).map((r) => `${r.v} · ${r.n}`);

test('normalisation : accents, casse, ponctuation', () => {
  assert.equal(norm('Révélation des faits délictueux (L. 821-10)'), 'revelation des faits delictueux l 821 10');
});

test('numéros de texte : la page où le texte commence passe en tête', () => {
  assert.equal(top('L. 821-44')[0], 'V2 · 37');
  assert.equal(top('150-0 B ter CGI')[0], 'V8 · 18');
  assert.equal(top('NEP 570')[0], 'V1 · 66');
  assert.equal(top('Article 21', 2).includes('V4 · 7'), true);
});

test('index pré-rempli : la page vérifiée est dans les 5 premiers résultats pour ≥ 90 % des entrées', () => {
  const E = J('data/index_prerempli.json').entrees.filter((e) => /^V[1-8]$/.test(e.volume));
  const ok = E.filter((e) => top(e.texte, 5).includes(`${e.volume} · ${e.ref}`)).length;
  assert.ok(ok / E.length >= 0.9, `${ok}/${E.length}`);
});

test('questions en langage courant, filtre par famille, entrées d\'index, passages, surlignage', () => {
  assert.ok(top('franchise en base TVA', 3).includes('V8 · 59'));
  assert.ok(top('révélation faits délictueux', 3).includes('V2 · 19'));
  const fisc = search(idx, 'plus-values', { fam: 'fisc', famOf: (v) => (v === 'V8' ? 'fisc' : null) });
  assert.ok(fisc.length && fisc.every((r) => r.v === 'V8'));
  const ents = searchEntries(J('data/index_prerempli.json').entrees, 'conventions réglementées SA');
  assert.ok(ents.some((e) => e.texte === 'L. 225-38'));
  const p = passages(idx, 'L. 225-38', { k: 2 });
  assert.equal(p.length, 2); assert.ok(p[0].texte.includes('225-38'));
  assert.equal(surligner('La révélation au procureur', 'revelation'), 'La <mark>révélation</mark> au procureur');
});

test('guillemets : occurrence exacte obligatoire, surlignée en bloc', () => {
  const r = search(idx, '« faits délictueux » procureur', { limit: 50 });
  assert.ok(r.length > 0);
  for (const x of r) assert.ok(idx.pages.find((p) => p.v === x.v && p.n === x.n).nt.includes(' faits delictueux '));
  assert.equal(search(idx, '« prix de transfert »').length, 0);
  assert.ok(search(idx, 'prix de transfert').length > 0);
  assert.equal(surligner('de l&#39;assemblée générale', '« l\'assemblée générale »'), 'de <mark>l&#39;assemblée générale</mark>');
});
