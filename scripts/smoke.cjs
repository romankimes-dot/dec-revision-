// Test de fumée dans Chromium (local, hors CI) : node scripts/smoke.cjs [url] [dossier_captures]
const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'http://localhost:8765/';
  const out = process.argv[3] || '.';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ignoreHTTPSErrors: !!process.env.SMOKE_PROXY });
  const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/40[14]/.test(m.text())) errs.push('console ' + m.text()); });
  await p.addInitScript(() => { if (!localStorage.getItem('dec2.state.v1')) localStorage.setItem('dec2.state.v1', JSON.stringify({ settings: { dateSimulee: '2026-10-29' } })); });
  await p.goto(url); await p.waitForSelector('.summary');
  await p.screenshot({ path: out + '/1-home.png', fullPage: true });
  await p.check('[data-task="2026-10-29|0"]'); await p.waitForTimeout(400);
  for (const t of ['outils', 'carte', 'methode', 'materiel']) { await p.click(`nav [data-tab="${t}"]`); await p.waitForTimeout(150); await p.screenshot({ path: `${out}/2-${t}.png`, fullPage: true }); }
  await p.click('nav [data-tab="carte"]'); await p.click('[data-cf="stats"]'); await p.screenshot({ path: out + '/3-stats.png', fullPage: true });
  await p.click('nav [data-tab="outils"]'); await p.click('[data-go="chrono"]'); await p.selectOption('#cStruct', '8-6-6'); await p.click('#cStart14');
  await p.waitForSelector('#chronoLive .big'); await p.click('#cNext'); await p.click('#cStop'); await p.waitForTimeout(1200);
  await p.screenshot({ path: out + '/4-chrono.png', fullPage: true });
  await p.click('#cEnd'); await p.waitForSelector('#dbNew');
  await p.fill('#dbN', '3'); await p.click('#dbNew'); await p.selectOption('.qrow[data-qi="0"] select[data-f="theme"]', { index: 1 });
  await p.selectOption('.qrow[data-qi="0"] select[data-f="statut"]', 'cherche'); await p.selectOption('.qrow[data-qi="0"] select[data-f="cause"]', 'doc');
  await p.fill('#dbNote', '7.5'); await p.click('#dbSave'); await p.waitForTimeout(200);
  await p.click('nav [data-tab="outils"]'); await p.click('[data-go="recitation"]'); await p.click('#recGo'); await p.click('#recShow'); await p.click('[data-rs="2"]');
  await p.screenshot({ path: out + '/5-recit.png', fullPage: true });
  await p.click('nav [data-tab="outils"]'); await p.click('[data-go="drill"]'); await p.click('#drLoc'); await p.fill('#drRef', 'p. 412'); await p.click('#drOk'); await p.click('[data-back]'); await p.click('[data-go="drill"]');
  await p.click('[data-go="imprimer"]'); await p.waitForSelector('table.print');
  await p.click('nav [data-tab="outils"]'); await p.click('[data-go="ecriture"]'); await p.click('#ecrGo'); await p.fill('#ecrMots', '190'); await p.click('#ecrSave');
  await p.screenshot({ path: out + '/6-ecriture.png', fullPage: true });
  await p.click('nav [data-tab="outils"]'); await p.click('[data-go="decision"]'); await p.fill('#deE1', '12'); await p.fill('#deE2', '8'); await p.click('#deGo');
  await p.screenshot({ path: out + '/7-decision.png', fullPage: true });
  // Claude : page sans clé, puis clé factice -> erreur d'authentification attendue (prouve que le SDK se charge et appelle l'API)
  await p.click('#claudeBtn'); await p.waitForSelector('#aiKey');
  await p.fill('#aiKey', 'sk-ant-factice'); await p.click('#aiKeySave');
  await p.fill('#aiQ', 'Bonjour'); await p.click('#aiSend');
  await p.waitForFunction(() => /Clé API refusée|Erreur/.test(document.querySelector('#chat')?.textContent || ''), null, { timeout: 30000 });
  const aiTxt = await p.textContent('#chat'); if (!/Clé API refusée|401/i.test(aiTxt)) errs.push('réponse Claude inattendue : ' + aiTxt.slice(0, 200));
  await p.screenshot({ path: out + '/9-claude.png', fullPage: true });
  // Après novembre
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('dec2.state.v1')); s.settings.dateSimulee = '2026-11-20'; localStorage.setItem('dec2.state.v1', JSON.stringify(s)); });
  await p.reload(); await p.waitForSelector('main .card');
  await p.screenshot({ path: out + '/8-apres.png', fullPage: true });
  const txt = await p.textContent('main');
  if (!/Phase 0/.test(txt)) errs.push('écran après-novembre absent');
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('dec2.state.v1')));
  if (!st.jours['2026-10-29'] || !st.seances.length || !st.debriefs.length || !Object.keys(st.index).length || !st.ecriture.length || !Object.keys(st.recit).length) errs.push('état incomplet');
  console.log(errs.length ? 'ERREURS\n' + errs.join('\n') : 'OK : aucun erreur, parcours complet');
  await b.close(); process.exit(errs.length ? 1 : 0);
})();
