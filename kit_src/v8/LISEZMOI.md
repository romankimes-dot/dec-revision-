# V8 Fiscal choisi : sources et régénération

- Texte des articles : base LEGI de la DILA (archive globale du 13/07/2025 + mises à jour quotidiennes jusqu'au 28/10/2026), version en vigueur au 29/10/2026. Les archives téléchargées ne sont pas dans le dépôt (plusieurs Go) : les scripts `legi.py`, `cdo.py`, `build.py`, `split.py`, `pages.py` et `run.sh` les lisaient dans le dossier temporaire de la session de production ; ils sont gardés ici comme référence et devront être repointés pour une nouvelle édition.
- Rendu : `node kit_src/render.cjs kit_src/V8_fiscal.html v8_src.pdf`, puis folio : `python3 -I kit_src/v8/folioter.py v8_src.pdf imprimer/V8_Fiscal_choisi.pdf` (≈ 1,2 Mo ; `scripts/folioter.py` recopierait les polices sur chaque page : 27 Mo).
- Index : renvois V8 contrôlés par `python3 -I kit_src/check_index.py` (en-tête « CGI Article n » sur la page).
- À refaire en janvier 2027 : art. 293 B et 260 abrogés au 1/1/2027 (ordonnance 2025-1247, TVA recodifiée dans le CIBS) ; nouvelles rédactions des art. 39, 93, 200, 231 quater et 238 bis applicables au 1/1/2027.
