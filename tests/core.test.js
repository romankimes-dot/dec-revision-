import test from 'node:test';
import assert from 'node:assert/strict';
import { jalons, hm, STRUCTURES, normeMots, phaseFor, decision, sameRef, normRef, priorites, causes, nextBox, addDays, median } from '../js/core.js';
import { readFileSync } from 'node:fs';
const phases = JSON.parse(readFileSync(new URL('../data/phases.json', import.meta.url))).phases;

test('jalons : identiques aux grilles du plan (section 3.2)', () => {
  const g = (p) => jalons(p).fins.map(hm).join(' ');
  assert.equal(g([10, 10]), '16h25 18h15');
  assert.equal(g([8, 6, 6]), '16h03 17h09 18h15');
  assert.equal(g([3, 9, 8]), '15h08 16h47 18h15');
  assert.equal(g([7, 6, 7]), '15h52 16h58 18h15');
  assert.equal(g([7, 4, 5, 4]), '15h52 16h36 17h31 18h15');
  assert.deepEqual(jalons([8, 6, 6]).budgets, [88, 66, 66]);
});

test('jalons : 11 minutes par point, toujours 220 minutes de rédaction', () => {
  for (const s of STRUCTURES) {
    const j = jalons(s.points);
    assert.equal(j.budgets.reduce((a, b) => a + b, 0), 220, s.id);
    assert.equal(s.points.reduce((a, b) => a + b, 0), 20, s.id);
  }
  const eq = jalons([null, null, null]);
  assert.equal(eq.budgets.reduce((a, b) => a + b, 0), 220);
  assert.ok(Math.max(...eq.budgets) - Math.min(...eq.budgets) <= 1);
});

test('jalons : départ à une autre heure (annale à la maison)', () => {
  assert.equal(hm(jalons([10, 10], 9 * 60).fins[1]), '13h15');
});

test('norme de longueur : bornée par la vitesse mesurée', () => {
  assert.deepEqual(normeMots(0), { min: 100, max: 140, mesure: false });
  assert.equal(normeMots(15).max, 83);
  assert.equal(normeMots(30).max, 140);
  assert.ok(normeMots(20).min < normeMots(20).max);
});

test('phase selon la date', () => {
  assert.equal(phaseFor('2026-10-20', phases), 'avant');
  assert.equal(phaseFor('2026-10-29', phases), 'sprint');
  assert.equal(phaseFor('2026-11-10', phases), 'jourJ');
  assert.equal(phaseFor('2026-11-11', phases), 'debrief');
  assert.equal(phaseFor('2026-11-20', phases), 'phase0');
  assert.equal(phaseFor('2027-01-08', phases), 'phase1');
  assert.equal(phaseFor('2027-03-15', phases), 'phase2');
  assert.equal(phaseFor('2027-04-15', phases), 'phase3');
  assert.equal(phaseFor('2027-05-04', phases), 'phase4');
  assert.equal(phaseFor('2027-06-01', phases), 'apres');
});

test('phases : contiguës du 12 novembre au 4 mai', () => {
  assert.equal(phases[0].debut, '2026-11-12');
  for (let i = 1; i < phases.length; i++) assert.equal(addDays(phases[i - 1].fin, 1), phases[i].debut, phases[i].id);
  assert.equal(phases[phases.length - 1].fin, '2027-05-04');
});

test('décision de janvier : règles du plan (section 0.3)', () => {
  let r = decision(12, 8, 11);
  assert.equal(r.S, 36); assert.equal(r.e3Requis, 11); assert.equal(r.verdict, 'Conserver E2');
  r = decision(12, 10.5);
  assert.equal(r.e2Status, 'acquise'); assert.equal(r.verdict, "Pas d'inscription aux écrits en mai");
  r = decision('blanche', 10);
  assert.equal(r.e1Status, 'repasser'); assert.equal(r.verdict, 'E1 seule en mai');
  r = decision(10, 7.5);
  assert.equal(r.S, 32.5); assert.match(r.verdict, /Zone grise/);
  r = decision(9, 6.5);
  assert.equal(r.verdict, 'Repasser E2');
  r = decision('blanche', 5);
  assert.equal(r.verdict, 'E1 et E2 en mai (journée complète)');
  r = decision(5, 8);
  assert.equal(r.e1Status, 'repasser');
  assert.ok(r.alertes.some((a) => /SIEC/.test(a)));
});

test('décision : le mémoire requis ne descend jamais sous 10 (note éliminatoire)', () => {
  assert.equal(decision(16, 16).e3Requis, 10);
});

test('références : comparaison tolérante', () => {
  assert.ok(sameRef('p. 412', '412'));
  assert.ok(sameRef('n° 41250', 'N°41250'));
  assert.ok(sameRef('Page 12', 'p12'));
  assert.ok(sameRef('n° 41250', '41250'));
  assert.ok(!sameRef('412', '421'));
  assert.ok(!sameRef('', ''));
  assert.equal(normRef('Art. L. 821-6'), 'l 821 6');
});

test('répétition espacée et médiane', () => {
  assert.equal(nextBox(0, true), 1); assert.equal(nextBox(4, false), 0); assert.equal(nextBox(5, true), 5);
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(median([3, 1, 2]), 2); assert.equal(median([]), null);
});

test('débrief : priorités et causes', () => {
  const notions = [{ id: 'a', sessions: 10 }, { id: 'b', sessions: 2 }];
  const db = [{ questions: [{ theme: 'a', statut: 'cherche', cause: 'doc' }, { theme: 'b', statut: 'blanc', cause: 'temps' }, { theme: 'a', statut: 'su' }] }];
  const p = priorites(db, notions);
  assert.equal(p.length, 2);
  assert.ok(p.find((x) => x.id === 'a').s > 0);
  const c = causes(db);
  assert.equal(c.reduce((a, x) => a + x.part, 0), 100);
});
