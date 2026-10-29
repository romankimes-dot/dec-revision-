// Familles : pictogramme au trait inscrit dans une forme géométrique (app et kit, repérage sans la couleur).
export const FAMILLES = [
  { id: 'cac', nom: 'Commissariat aux comptes', couleur: '#c0392b', forme: 'triangle', picto: 'loupe' },
  { id: 'soc', nom: 'Sociétés', couleur: '#1f5fbf', forme: 'carre', picto: 'immeuble' },
  { id: 'fisc', nom: 'Fiscal', couleur: '#1e8449', forme: 'rond', picto: 'pourcent' },
  { id: 'compta', nom: 'Comptable (PCG)', couleur: '#b7950b', forme: 'losange', picto: 'barres' },
  { id: 'social', nom: 'Social', couleur: '#d35400', forme: 'hexagone', picto: 'personne' },
  { id: 'deonto', nom: 'Déontologie', couleur: '#7d3c98', forme: 'ecusson', picto: 'bouclier' },
  { id: 'annales', nom: 'Annales', couleur: '#7f8c8d', forme: 'rondpointille', picto: 'horloge' },
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
// Pictos centrés dans une boîte 100×100 ; réduits et descendus dans le triangle.
const PICTOS = {
  loupe: '<circle cx="46" cy="46" r="14"/><path d="m56 56 13 13"/>',
  immeuble: '<rect x="34" y="26" width="32" height="48"/><path d="M41 34h6M53 34h6M41 44h6M53 44h6M41 54h6M53 54h6M46 74v-9h8v9"/>',
  pourcent: '<path d="M66 32 34 68"/><circle cx="37" cy="36" r="6"/><circle cx="63" cy="64" r="6"/>',
  barres: '<path d="M30 72h40M36 72V56M48 72V40M60 72V28"/>',
  personne: '<circle cx="50" cy="38" r="9"/><path d="M33 72c2-13 9-19 17-19s15 6 17 19"/>',
  bouclier: '<path d="M50 26 68 32v14c0 12-8 20-18 24-10-4-18-12-18-24V32z"/><path d="m42 47 6 6 11-12"/>',
  horloge: '<circle cx="50" cy="52" r="20"/><path d="M50 52V40M50 52l9 6M44 26h12"/>',
};
export function badge(id, size = 28, { couleur = true, trait = 'currentColor' } = {}) {
  const f = FAMILLES.find((x) => x.id === id); if (!f) return '';
  const c = couleur ? f.couleur : 'currentColor';
  return `<svg class="fam" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${f.nom}">`
    + `<g stroke="${c}" stroke-width="6" fill="${couleur ? f.couleur + '1f' : 'none'}">${FORMES[f.forme]}</g>`
    + `<g stroke="${couleur ? trait : 'currentColor'}" stroke-width="5">${f.forme === 'triangle' ? `<g transform="translate(50 62) scale(.72) translate(-50 -50)">${PICTOS[f.picto]}</g>` : PICTOS[f.picto]}</g></svg>`;
}

// Volume (ou Mémento) → famille.
export const VOL_FAM = { V1: 'cac', V2: 'cac', 'Mémento Audit': 'cac', V6: 'soc', 'Mémento Sociétés': 'soc', V3: 'compta', V4: 'deonto', V5: 'deonto', V8: 'fisc', 'Mémento Fiscal': 'fisc', V7: 'annales' };
export const volFam = (v) => VOL_FAM[v] || VOL_FAM[String(v || '').replace(/^Mém\. /, 'Mémento ')] || null;
// Thème des sujets (taxonomie) → famille.
const T = {
  cac: 'nomination_CAC mandat_duree_cessation SACC_autres_missions demarche_audit_risques controle_interne elements_probants seuils_signification rapport_CAC_opinion verifications_specifiques procedure_alerte revelation_faits_delictueux EIP',
  deonto: 'independance_incompatibilites LCBFT secret_pro lettre_mission honoraires responsabilite',
  soc: 'conventions_reglementees AG_convocation_approbation transformation fusion_scission_TUP apports_commissariat augmentation_reduction_capital dividendes perte_moitie_capital depot_comptes rapport_gestion_gouvernance dirigeants_gerance cession_titres_fonds liquidation_dissolution procedures_collectives association_non_lucrativite subventions',
  fisc: 'integration_fiscale IS IR_BIC_BNC TVA plus_values fiscalite_immobiliere_SCI_LMNP micro_entreprise_regimes droits_enregistrement_succession mecenat_fiscalite_asso controle_fiscal_procedures',
  compta: 'groupe_filiales_conso immobilisations_amortissements stocks provisions evenements_post_cloture changements_methodes annexe_comptes_annuels IFRS consolidation_technique comptes_previsionnels evaluation_entreprise numerique_RGPD_FEC_caisse crypto RSE_durabilite_CSRD',
  social: 'paie_charges_sociales contrat_travail URSSAF_controle CSE_participation statut_dirigeant_social',
};
export const THEME_FAM = Object.fromEntries(Object.entries(T).flatMap(([f, s]) => s.split(' ').map((c) => [c, f])));
export const themeFam = (t) => THEME_FAM[String(t || '').split(/[\s+,]/)[0]] || null;
