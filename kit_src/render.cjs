// Rend un fichier HTML du kit en PDF A4 : node render.cjs entree.html sortie.pdf
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [inp, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(inp)); await p.waitForLoadState('networkidle');
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('PDF :', out);
})();
