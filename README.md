# DEC · Épreuve 2 — préparation (révision légale et contractuelle des comptes)

Application web installable sur iPhone, hors ligne, pour préparer l'épreuve n° 2 du DEC.
Session test : **mardi 10 novembre 2026, 14h-18h30**. Vraie tentative : **mardi 4 mai 2027, 14h-18h30**.

## L'organisation : trois boucles, une seule app

1. **Boucle documentation.** L'épreuve se passe avec ta doc papier. Chaque notion cherchée devient une ligne d'index (notion, volume, page) ; le drill te la refait chercher à intervalles croissants, chronométré. Mesure : temps médian et taux de trouvaille. Ta doc devient un outil que tu as entraîné, pas une pile de livres.
2. **Boucle copie.** Annale manuscrite au chrono à jalons (11 min par point, stop-loss 5 min) → débrief question par question (su, cherché en vain, blanc, cause) → les priorités se recalculent (thèmes ratés pondérés par leur fréquence sur 14 sujets) → les briques suivantes en tiennent compte.
3. **Boucle décision.** Le 8 janvier, l'écran Décision calcule ce que tes notes de novembre imposent au mémoire et dit quoi faire avant le 28 février 17h.

Le reste sert ces boucles : récitation 30 s des 15 notions par cœur, mesure de ta vitesse d'écriture (elle fixe ta longueur de réponse), carte des notions, méthode minute par minute, matériel coché.

## Installer sur l'iPhone

1. Ouvrir l'adresse GitHub Pages du dépôt dans Safari (voir « Publication » ci-dessous).
2. Partager › Sur l'écran d'accueil.
3. Les données restent sur le téléphone ; Réglages › Exporter pour sauvegarder.

## Publication (une fois)

GitHub › dépôt `dec-revision-` › Settings › Pages › Source : « Deploy from a branch », branche de travail, dossier `/ (root)`. L'app est alors servie à `https://romankimes-dot.github.io/dec-revision-/`.

## Contenu du dépôt

| Dossier | Contenu |
|---|---|
| `index.html`, `js/`, `css/`, `sw.js` | l'app (aucune dépendance) |
| `data/` | parcours jour par jour, 15 notions, carte, statistiques, méthode, matériel, phases nov.→mai |
| `docs/PLAN.md` | le plan validé (arbitré par le collège de stratèges) |
| `docs/STATS.md`, `docs/data/` | récurrence des thèmes : 14 sujets officiels, 260 questions codées |
| `docs/VERIF.md` | 121 vérifications juridiques sourcées (Légifrance, BOFiP, CNCC, H2A, SIEC) |
| `docs/college/` | le débat : deux stratèges, deux contradicteurs, l'arbitre |
| `imprimer/` | les volumes gratuits à imprimer et relier, avec `LISEZMOI.md` |

## Vérifications

```
npm test                         # syntaxe + 21 tests (jalons, décision, données, liste noire, sources)
python3 -I scripts/build_data.py # régénère data/notions.json et data/stats.json
node scripts/smoke.cjs URL DIR   # parcours complet dans Chromium (local)
```

Les tests bloquent notamment : un parcours qui ne fait pas 40 h, une notion sans source dans `docs/VERIF.md`, une valeur périmée (anciens seuils micro, « NP 2010 », NEP 9505…), un ancien numéro du livre VIII cité sans son nouveau numéro, des statistiques qui ne correspondent plus au codage.
