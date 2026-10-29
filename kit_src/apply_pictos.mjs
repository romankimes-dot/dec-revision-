// Pose les badges forme + picto à côté des couleurs du kit (K1, K3) : node kit_src/apply_pictos.mjs
import { readFileSync, writeFileSync } from 'fs';
import { badge, FAMILLES, VOL_FAM } from '../js/familles.js';

// Anciennes couleurs du K1 → famille.
const ANCIENNES = { c62828: 'cac', '1f5fbf': 'soc', '7b3fa0': 'deonto', '2e7d32': 'fisc', f2c200: 'compta', ef7d00: 'social' };
const COUL = Object.fromEntries(FAMILLES.map((f) => [f.id, f.couleur]));
const famDe = (hex) => ANCIENNES[hex.toLowerCase()] || FAMILLES.find((f) => f.couleur.slice(1) === hex.toLowerCase())?.id;
const b = (id, mm) => badge(id, 20, { trait: '#1b1b1b' }).replace('<svg class="fam" width="20" height="20"', `<svg class="fam" style="width:${mm}mm;height:${mm}mm;vertical-align:${mm < 3 ? -0.12 : -0.18}em"`);

// K1 : pastilles → badges ; bordures recolorées + badge en tête de bloc.
let k1 = readFileSync('kit_src/K1_classement.html', 'utf8');
if (k1.includes('class="fam"')) { console.log('K1 : badges déjà posés'); } else {
k1 = k1.replace(/<span class="sw" style="background:#([0-9a-fA-F]{6})"><\/span>/g, (m, h) => { const f = famDe(h); return f ? b(f, 2.5) + ' ' : m; });
k1 = k1.replace(/border-(top|left):(\d+)px solid #([0-9a-fA-F]{6})"><div class="bn">/g, (m, s, w, h) => { const f = famDe(h); return f ? `border-${s}:${w}px solid ${COUL[f]}"><div class="bn">${b(f, 4.2)} ` : m; });
k1 = k1.replace(/border-(top|left):(\d+)px solid #([0-9a-fA-F]{6})">/g, (m, s, w, h) => { const f = famDe(h); return f ? `border-${s}:${w}px solid ${COUL[f]}">${s === 'left' ? b(f, 3.6) + ' ' : ''}` : m; });
for (const [h, f] of Object.entries(ANCIENNES)) k1 = k1.replace(new RegExp('#' + h, 'gi'), COUL[f]);
writeFileSync('kit_src/K1_classement.html', k1);
console.log('K1 :', (k1.match(/class="fam"/g) || []).length, 'badges');
}

// K3 : badge du volume devant chaque renvoi.
let k3 = readFileSync('kit_src/K3_index.html', 'utf8');
if (k3.includes('class="fam"')) { console.log('K3 : badges déjà posés'); } else {
  const VK3 = { 'Mém. Fiscal': 'fisc', 'Mém. Sociétés': 'soc', 'Mém. Audit': 'cac' };
  k3 = k3.replace(/<td class="v">([^<]+)<\/td>/g, (m, v) => { const f = VOL_FAM[v] || VK3[v]; return f ? `<td class="v">${b(f, 2.8)} ${v}</td>` : m; });
  k3 = k3.replace('table.ix .v { width: 20mm;', 'table.ix .v { width: 23mm;');
  writeFileSync('kit_src/K3_index.html', k3);
  console.log('K3 :', (k3.match(/class="fam"/g) || []).length, 'badges');
}
