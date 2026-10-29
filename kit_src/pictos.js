// Planche des familles : pictogramme au trait inscrit dans une forme géométrique (utilisée par l'app et le kit).
export const FAMILLES = [
  { id: 'cac', nom: 'Commissariat aux comptes', couleur: '#c0392b', forme: 'triangle', picto: 'loupe' },
  { id: 'soc', nom: 'Sociétés', couleur: '#1f5fbf', forme: 'carre', picto: 'immeuble' },
  { id: 'fisc', nom: 'Fiscal', couleur: '#1e8449', forme: 'rond', picto: 'euro' },
  { id: 'compta', nom: 'Comptable (PCG)', couleur: '#b7950b', forme: 'losange', picto: 'calculette' },
  { id: 'social', nom: 'Social', couleur: '#d35400', forme: 'hexagone', picto: 'personne' },
  { id: 'deonto', nom: 'Déontologie', couleur: '#7d3c98', forme: 'ecusson', picto: 'balance' },
  { id: 'annales', nom: 'Annales', couleur: '#7f8c8d', forme: 'rondpointille', picto: 'feuille' },
];
const FORMES = {
  triangle: '<path d="M50 6 95 88H5z"/>',
  carre: '<rect x="8" y="8" width="84" height="84" rx="6"/>',
  rond: '<circle cx="50" cy="50" r="44"/>',
  losange: '<path d="M50 4 96 50 50 96 4 50z"/>',
  hexagone: '<path d="M27 8h46l23 42-23 42H27L4 50z"/>',
  ecusson: '<path d="M50 5 90 18v28c0 24-17 41-40 49C27 87 10 70 10 46V18z"/>',
  rondpointille: '<circle cx="50" cy="50" r="44" stroke-dasharray="7 6"/>',
};
// Pictos centrés dans une boîte 100×100, placés plus bas dans le triangle.
const PICTOS = {
  loupe: '<circle cx="46" cy="58" r="13"/><path d="m55 67 11 11"/>',
  immeuble: '<rect x="34" y="28" width="32" height="46"/><path d="M41 36h6M53 36h6M41 46h6M53 46h6M41 56h6M53 56h6M46 74v-9h8v9"/>',
  euro: '<path d="M64 34a20 20 0 1 0 0 32"/><path d="M30 45h26M30 55h24"/>',
  calculette: '<rect x="35" y="27" width="30" height="46" rx="3"/><path d="M41 34h18v8H41zM42 51h2M50 51h2M58 51h0M42 59h2M50 59h2M42 66h2M50 66h2M58 58v9"/>',
  personne: '<circle cx="50" cy="38" r="9"/><path d="M33 72c2-13 9-19 17-19s15 6 17 19"/>',
  balance: '<path d="M50 28v40M38 68h24M32 36h36"/><path d="m32 36-7 15h14zM68 36l-7 15h14z"/>',
  feuille: '<path d="M38 28h18l10 10v34H38z"/><path d="M56 28v10h10M44 50h16M44 58h16"/>',
};
export function badge(id, size = 28, { couleur = true } = {}) {
  const f = FAMILLES.find((x) => x.id === id); if (!f) return '';
  const c = couleur ? f.couleur : 'currentColor';
  return `<svg class="fam" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${f.nom}">`
    + `<g stroke="${c}" stroke-width="6" fill="${couleur ? f.couleur + '1f' : 'none'}">${FORMES[f.forme]}</g>`
    + `<g stroke="${couleur ? '#1b1b1b' : 'currentColor'}" stroke-width="5">${PICTOS[f.picto]}</g></svg>`;
}
