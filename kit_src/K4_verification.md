# K4 — Vérification indépendante des trames de réponse

Vérification du 29/10/2026, faite sur `kit_src/K4_trames.html` tel qu'il est au commit 247b069 (07:03), avec la conclusion corrigée de 2024-05 Q2.5 (« révèle au procureur, sauf régularisation spontanée »). Le PDF `imprimer/K4_Trames_de_reponse.pdf` (6 p.) a été régénéré à 07:02 et contient bien cette correction.

Méthode :
- intitulés : recherche dans `work/*.txt` (14 sujets) et, pour 2024-11 et 2026-05, dans le jsonl ;
- fréquences : recomptées depuis les deux jsonl (298 questions, 16 sessions) et, pour les consignes, par regex sur les 14 txt ;
- folios : page de début de chaque article ou norme, retrouvée dans le texte extrait (`pdftotext -layout`) de V1 à V6 (folio = numéro de page du PDF, vérifié sur l'en-tête « Vx · n ») ;
- règles : VERIF.md (colonne « valeur correcte ») et texte imprimé dans les volumes ;
- longueur : mots contenant au moins une lettre ou un chiffre ; le chiffre `wc -w` brut est donné entre parenthèses.

Légende : OK · ERREUR · FOLIO FAUX · AMBIGU (vrai mais trompeur ou incomplet) · NON VÉRIFIABLE.

## Tableau

| Famille | Élément | Verdict | Correction proposée | Preuve |
|---|---|---|---|---|
| Général | 16 sessions, 298 questions | OK | — | jsonl : 260 + 38 lignes ; 16 sessions distinctes (2018-05 → 2026-05) |
| Général | Effectifs par famille (61/43/34/32/30/30/26/17/16/9) et sessions (14, 14, 15, 14, 13, 14, 15, 9, 11, 8) | NON VÉRIFIABLE | Joindre la liste question → famille (ou les mots-clés et les 27 arbitrages). | La méthode ne donne ni les mots-clés ni les 27 cas tranchés. Une reconstitution par mots-clés donne de 19 à 56 questions pour la famille 2 selon la liste retenue (strict : 24 questions dans 10 sessions ; large : 56 dans 16) et 49 au lieu de 32 pour la famille 4. Les domaines du jsonl (FISC 72/15, SOCIAL 11/8) restent compatibles avec 61/14 et 9/8. |
| Général | Méthode « critique d'abord » | AMBIGU | 2024-05 Q2.3 est codée « position à critiquer » : avec cette règle, elle irait en famille 2, alors qu'elle sert de modèle à la famille 5. Le dire, ou la reclasser. | jsonl 2024-05 2.3 : « … position à critiquer » |
| Général | « Justifiez votre réponse » : 11 sujets sur 14 | OK | — | Regex `justifi(ez\|er)` : 11 sujets. La forme exacte « justifiez votre réponse » : 10 (2022-11 écrit « Justifiez la réponse »). |
| Général | « Que pensez-vous de / Que faut-il penser de » : 8 sur 14 | OK | — | 2019-05, 2021-05, 2022-11, 2023-05, 2023-11, 2024-05, 2025-05, 2025-11 |
| Général | « Sans réaliser de calcul / aucun calcul » : 6 sur 14 | AMBIGU | Écrire « 4 sujets (6 avec les formulations voisines) ». | Formule exacte : 2018-11, 2020-11, 2024-05, 2025-05. Formulations voisines : 2018-05 (« il ne vous est pas demandé de calculer ») et 2019-05 (« aucun calcul d'impôt… »). |
| Général | 220 min (14h35-18h15), 11 min par point ; dossier de 10 pts et 9 questions ≈ 12 min | OK | — | Épreuve 14h-18h30 (VERIF 113) ; 10 × 11 / 9 = 12,2 |
| 1 | Intitulé 2024-05 Q1.4 | OK | — | 2024-05.txt l. 92-95 |
| 1 | Intitulé 2025-11 Q1.3 | OK | — | 2025-11.txt l. 111-113 |
| 1 | Micro 203 100 / 83 600 ; franchise 85 000 / 37 500 ; IS 15 % jusqu'à 42 500 € ; TVA dans le CIBS au 1/1/2027 | OK | — | VERIF 72, 75, 76, 81 |
| 1 | « Aucun texte fiscal dans V1-V6 » | OK | — | V6 ne contient le CGI qu'en renvoi (p. 11, 37) |
| 1 | Modèle Q1.4 : 151 septies (250 000 / 350 000), 238 quindecies (500 000 / 1 M€), 151 septies A, condition de 5 ans, 50-0 1 al. 6 | OK | — | VERIF 74, 86-88, 90 |
| 1 | Modèle Q1.4 : faits (15/12/2019 → 30/11/2023, 143 555 et 152 801 € HT, 65 000 €, reprise en avril 2024) | OK | — | 2024-05.txt annexes A2 et A4 |
| 1 | Modèle Q1.4 : conclusion (aucune exonération, PVLT à 12,8 % + 17,2 %) | OK pour le cas (cession 2023) ; NON VÉRIFIABLE pour 2026 | Ajouter : « taux des prélèvements sociaux à vérifier pour une cession 2026 (LFSS 2026) ». | VERIF 80, 91 (17,2 %). La hausse de la CSG sur les revenus du capital prévue par la LFSS 2026 n'est pas traitée dans VERIF. |
| 1 | Longueur : 127 mots (139) | OK | — | Q1.4 : dossier de 10 pts pour 8 questions, soit 1,25 pt (125-175 mots) |
| 2 | Intitulé 2019-11 Q1.4 | OK | — | 2019-11.txt l. 99-101 |
| 2 | Intitulé 2023-11 Q3.2 | OK | — | 2023-11.txt l. 511 |
| 2 | Piège : « un ancien numéro (L. 823-x) est en soi une anomalie » | AMBIGU | Ajouter : « si le document est daté de 2024 ou après ». Le projet de 2019-11 cite à bon droit L. 823-9 et R. 823-7. | Ord. 2023-1142 en vigueur au 1/1/2024 (VERIF 1) |
| 2 | Ouvrir : NEP 700 § 18 (89-90), NEP 570 § 12-14 (67), concordance (2) | OK | — | V1 · 89-90 (§ 18 a-e) ; V1 · 67 (§ 12-14) ; V2 · 2. Attention : la colonne « p. » de la concordance renvoie à la page de la brochure, pas au folio. |
| 2 | Modèle : règle (NEP 700 § 18 ; L. 821-53 ; L. 821-40 = ex L. 823-1, désignation par l'AGO) | OK | — | V1 · 89-90 ; VERIF 2, 9 |
| 2 | Modèle : anomalies (1) à (6) | OK | — | Annexe 2 du sujet : « A Monsieur Le Président », « confiée par le conseil d'administration », 31/12/2018 et 30/09/2018, signature d'Ella TOUFEAU, « certification pure et simple », « Présidente », « association » |
| 2 | Modèle : exhaustivité | AMBIGU | Ajouter (7) capital de 80 000 € en en-tête contre 36 000 € au bilan (inférieur au minimum de 37 000 € d'une SA) et (8) « comptes arrêtés par le Président » au lieu du conseil d'administration. Ce sont deux contrôles « chiffres comparés aux annexes » que la trame elle-même impose. | 2019-11.txt annexes 2 et 3 |
| 2 | Longueur : 129 mots (150) | OK (AMBIGU en `wc -w`) | — | 10 pts pour 9 questions |
| 3 | Intitulé 2025-05 Q2.2 et contexte PEE | OK | — | 2025-05.txt l. 470-485 |
| 3 | Intitulé 2021-05 Q1.7 | OK | — | 2021-05.txt l. 133-134 |
| 3 | Code CAC art. 13 (aucune rémunération proportionnelle ou conditionnelle) | OK | — | V4 · 5 |
| 3 | L. 821-28 IV (non-EIP : autorévision sans sauvegarde possible) | OK | — | V2 · 30 |
| 3 | NP 2300 / 2400 / 3100 / 4410 | OK | — | VERIF 105 |
| 3 | Pièges : règle de rémunération donnée pour le seul CAC, alors que l'exemple 2021-05 Q1.7 porte sur un expert-comptable (15 % des dégrèvements) | AMBIGU | Ajouter : « EC : honoraires librement fixés (décret 2012-432 art. 158, V4 · 30) ; honoraires de succès seulement en complément, convenus à l'avance (ord. 1945 art. 24, absent de V4) ». Ne pas appliquer l'art. 13 du code CAC à l'EC. | 2021-05.txt l. 234-245 ; V4 · 30 (art. 158). L'art. 24 de l'ordonnance n'est pas imprimé. |
| 3 | Ouvrir V2 : L. 821-27/28 (29-30), L. 821-35 (33) | OK | — | Débuts d'article : V2 · 29, 29, 33 |
| 3 | Ouvrir V4 : art. 5 (3), 13 (5), 18 (6-7), 21-22 (7-8), décret 145-151 (26-27), ord. art. 2, 21, 22 (33, 40-41) | OK | — | Titres trouvés à V4 · 3, 5, 6, 7, 8, 26-27 (art. 151 continue en 28), 33, 40, 41 |
| 3 | Ouvrir V1 : NEP 210 (8), 9605 (129) | OK | — | NEP 210 : V1 · 8-9 ; NEP 9605 : V1 · 129-141 |
| 3 | Ouvrir V5 : cadre (10) | OK | — | V5 · 10 |
| 3 | Ouvrir V5 : NPLAB (27-36) | FOLIO FAUX (incomplet) | « NPLAB 20-59 ; § 18-22 : 27-28 ; A19-A22 : 43-46 ». La réponse modèle cite A19.2, A20 et A22, qui sont aux folios 44-45, hors de la plage 27-36. | V5 · 20 (début de la NPLAB), 27-28, 44, 45 |
| 3 | Modèle 2023-11 Q2.1 : NPLAB § 19, 20, 21, 22, A19.2, A20, A22 ; CMF L. 561-4-1 | OK | — | V5 · 27-28, 44-45 ; V6 · 7 (L. 561-4-1) |
| 3 | Modèle : faits (« normal » pour le client, faible pour les 3 autres critères, risque global « normal ») et conclusion (vigilance standard) | OK | — | 2023-11.txt l. 345-347 ; § 21 |
| 3 | Modèle : « maçonnerie cotée faible alors que la grille tient compte des espèces » | AMBIGU | Le sujet ne parle pas d'espèces pour la SARL TG. Formuler : « le BTP est un secteur à justifier (A19.2) ». | 2023-11.txt note de synthèse n° 1 |
| 3 | Longueur : 119 mots (132) | OK | — | 7 pts pour 9 sous-questions |
| 4 | Intitulé 2025-11 Q2.7 | OK | — | 2025-11.txt l. 408-409 |
| 4 | Intitulé 2023-11 Q3.3 et contexte (capital libéré de moitié) | OK | — | 2023-11.txt l. 481, 529 |
| 4 | Acompte : L. 232-12, R. 232-17 (CA, directoire, gérants ; pas l'AG) | OK | — | VERIF 47 ; V6 · 55, 84 |
| 4 | Conventions L. 225-38 / L. 227-10 / registre de la SASU ; L. 225-129-6 triennal supprimé en 2019 | OK | — | VERIF 56, 58 |
| 4 | Ouvrir V6 : L. 223-42 (30), L. 225-38 à 43 (35-37), L. 225-135 (42), L. 225-248 (47), L. 227-9 à 10 (52-53), L. 232-12 (55), R. 223-37 (77), R. 232-17 (84) | OK | — | Débuts d'article : 30, 35-36, 42, 47, 52-53, 55, 77, 84 |
| 4 | Modèle 2024-05 Q2.7 : L. 223-42 (4 mois, 2e exercice, seuil, tout intéressé, délai de 6 mois), R. 223-37 (1 %) | OK | — | V6 · 30-31 (texte complet) ; VERIF 54-55 |
| 4 | Modèle : faits (capital 100 000 €, perte 2022, 4-5 ans) | OK | — | 2024-05.txt dossier 2 |
| 4 | Longueur : 137 mots (142) | OK | — | 10 pts pour 9 questions |
| 5 | Intitulés 2020-11 Q1.1 et 2023-05 Q1.6 | OK | — | 2020-11.txt l. 81 ; 2023-05.txt l. 122 |
| 5 | Textes qui obligent : L. 221-9, L. 223-35, L. 225-218, L. 227-9-1, L. 821-43, L. 612-1 / L. 612-4 ; D. 123-200 ; L. 821-44, 46, 57, 40, 6, 5 | OK | — | VERIF 3, 6-8, 13, 15, 35-36 |
| 5 | Seuils 5 / 10 / 50 (4 / 8 / 50) ; filiales 2,5 / 5 / 25 ; sortie ; 1/10 en justice et 1/3 demande motivée ; associations 153 000 €, 50 / 3,1 M€ / 1,55 M€ | OK | — | V6 · 29, 46, 52 (1/10 et 1/3 dans les trois formes) ; VERIF 35-43 |
| 5 | Ouvrir V6 : D. 221-5 (75), L. 227-9-1 (52), L. 223-35 (29), L. 225-218 (46), D. 123-200 (74), D. 821-171/172 (90-91), R. 612-1 (87), D. 612-5 (88) | OK | — | Débuts d'article identiques |
| 5 | Ouvrir V2 : L. 821-40 (35), 43-44 (37), 46-47 (40) ; V1 : NEP 911 (99), 912 (107) | OK | — | V2 · 35, 37, 37, 40, 40 ; V1 · 99, 107 |
| 5 | Modèle 2024-05 Q2.3 : chiffres du groupe en 2022 (21 913 K€, 10 632 K€, 49) et contrôle par une personne physique | OK | — | Somme de l'annexe D vérifiée : 953 + 10 500 + 3 589 + 1 213 + 5 658 ; 1 560 + 1 022 + 4 174 + 2 923 + 953 ; 15 + 4 + 20 + 10 + 0 |
| 5 | Modèle : raisonnement | AMBIGU | Pour un renouvellement, citer la règle de sortie de D. 821-171 al. 3 : l'obligation ne cesse que si deux seuils n'ont pas été dépassés pendant les deux exercices précédant l'expiration ; or 2022 dépasse. Signaler aussi l'option d'un mandat de 3 exercices (L. 821-46) à côté des 6 exercices (L. 821-44). Conclusion inchangée. | V6 · 90-91 ; VERIF 7 |
| 5 | Longueur : 134 mots (143) | OK | — | 10 pts pour 9 questions |
| 6 | Intitulés 2022-11 Q2.1 et 2023-11 Q2.5 | OK | — | 2022-11.txt l. 184-185 ; 2023-11.txt l. 327-328 |
| 6 | PCG 122-2 / 122-5 / 122-6 ; méthodes de référence irréversibles (121-5) ; 214-9 | OK | — | V3 · 11-13, 25 |
| 6 | Ouvrir V3 : 122-1 à 122-6 (12-13), 121-5 (11-12), actif 14-28, titres 29, provisions 35-38, annexe 105 ; V1 : NEP 540 (53), 730 (98) | OK | — | V3 · 12-13 ; 11 (la liste des méthodes de référence est en 12) ; 211-1 en 14 ; 221-1 en 29 ; 321-1 en 35 ; 831-1 en 105 ; V1 · 53, 98 |
| 6 | Modèle 2023-05 Q3.3 : 214-14, 214-1, 214-4, 122-5, 122-2 | OK | — | V3 · 23-26, 12-13 |
| 6 | Modèle : faits (fonte des glaces, composants, valeur résiduelle) et conclusion | OK | — | 2023-05.txt l. 495-530 |
| 6 | Longueur : 120 mots (125) | AMBIGU | Le dossier 3 vaut 8 pts pour 6 questions, soit ≈ 1,33 pt. La règle du document donne alors 133-187 mots : ajouter 15 à 25 mots (par exemple l'information en annexe et l'absence d'incidence sur le passé). | 2023-05.txt l. 50 (barème) ; questions 3.1 à 3.6 |
| 7 | Intitulés 2020-11 Q1.8 et 2023-05 Q3.4 | OK | — | 2020-11.txt l. 114 ; 2023-05.txt l. 533 |
| 7 | Rapports : L. 821-53 / NEP 700, L. 821-54 / NEP 9510, L. 225-40 / L. 227-10, L. 821-57 / NEP 911 | OK | — | VERIF 8-10, 56, 107 |
| 7 | Ouvrir V1 : NEP 500 (42-43), 540 (53), 700 (87-90), 9510 (121), 911 (99) ; V2 : L. 821-53/54 (42-43), L. 821-57 (44) ; V6 : L. 225-40 (35-36), L. 225-135 (42), L. 225-204 (45), L. 227-10 (53) | OK | — | Débuts trouvés aux mêmes folios |
| 7 | Modèle 2025-11 Q2.5 : NEP 500 § 9, PCG 221-1 et 221-3, NEP 700 § 16, § 11 et § 14, L. 233-6 | OK | — | V1 · 42-43, 88-89 ; V3 · 29 |
| 7 | Modèle : faits (titres acquis le 1/1/2024, acte non obtenu) | OK | — | 2025-11.txt l. 339, 352-353 |
| 7 | Longueur : 123 mots (133) | OK | — | 10 pts pour 9 questions |
| 8 | Intitulés 2024-05 Q2.6 et 2025-05 Q2.1 | OK | — | 2024-05.txt l. 459 ; 2025-05.txt l. 465 |
| 8 | L. 821-63, L. 821-10 al. 1 et 2, L. 234-1 / 234-2 (15 jours, 6 mois), NEP 9605, L. 821-35, L. 821-9 (5 ans et 75 000 €) | OK | — | VERIF 11, 12, 19, 20, 68 |
| 8 | Ouvrir V2 : L. 821-6 (18), L. 821-9/10 (19), L. 821-63 (46), L. 821-65 (49) ; V1 : NEP 250 (16-17), 260 (18), 570 (66-67), 9605 (138-140) ; V6 : L. 234-1/2 (62-64), D. 821-185 (92) | OK | — | V1 · 138-140 = § 60-72 (déclaration à TRACFIN) ; la section déclaration et révélation se poursuit en 141. Les autres débuts sont aux mêmes folios. |
| 8 | Modèle 2025-11 Q2.6 : L. 227-9-1, D. 221-5, L. 821-6 1° (2 ans et 30 000 €), L. 821-5, L. 821-10 ; faits (CA de 15 M€, 132 salariés, filiale à 100 %) | OK | — | V6 · 52, 75 ; VERIF 13, 15 ; 2025-11.txt l. 339-341 |
| 8 | Modèle : conclusion « signaler l'irrégularité à l'assemblée, apprécier la révélation » | AMBIGU | M. CHRONO est le commissaire de la mère, pas de la filiale. Préciser : signalement à l'assemblée de la mère, et révélation seulement si les faits concernent l'entité contrôlée ou ses dirigeants (le président de BRASSE COULÉE est vraisemblablement la mère). Rappeler que l'obligation de désigner pèse sur la filiale (L. 227-9-1, ou L. 821-43 al. 3 pour une filiale significative). | L. 821-10 vise les irrégularités relevées au cours de la mission (VERIF 11) |
| 8 | Longueur : 134 mots (147) | OK (AMBIGU en `wc -w`) | — | 10 pts pour 9 questions |
| 9 | Intitulés 2023-11 Q3.7 (avec le contexte des 4 jours) et 2025-11 Q2.2 | OK | — | 2023-11.txt l. 560-569 ; 2025-11.txt l. 372-373 |
| 9 | Piège : « Nullité jamais automatique » | ERREUR (généralisation) | « Défaut de convocation du CAC : pas de nullité (Com. 10 févr. 2021). Défaut de désignation régulière : délibérations nulles, action éteinte par confirmation sur rapport d'un CAC régulier (L. 821-5). » La phrase actuelle contredit la réponse modèle 8 et le texte de L. 821-5 (« Sont nulles »). | V2 · 18 (L. 821-5) ; VERIF 15, 67 |
| 9 | Peines L. 821-6 1° et 3° ; L. 242-6 (5 ans et 375 000 €) ; L. 821-38 (3 ans) | OK | — | VERIF 13, 48, 66, 21 |
| 9 | Ouvrir V2 : L. 821-5/6 (18), L. 821-9 (19), L. 821-37/38 (34), L. 821-72 s. (56) ; V6 : L. 241-3 (67), L. 242-6 (69), L. 232-17 (56), R. 247-3 (85) | OK | — | Débuts trouvés aux mêmes folios |
| 9 | Modèle 2024-05 Q2.5 : L. 232-22 (1 mois, 2 mois si électronique), R. 247-3 et C. pén. 131-13 (1 500 € et 3 000 €), L. 123-5-1, L. 611-2 II | OK | — | V6 · 58, 85 ; VERIF 51-53 |
| 9 | Modèle : révélation sauf régularisation spontanée | OK | — | VERIF 122 (pratique CNCC 2014 : contraventions comprises ; dispense si irrégularité manifestement non intentionnelle) |
| 9 | Modèle : « pour qui » | AMBIGU | Ajouter la société, personne morale : amende quintuplée (C. pén. 131-41). La gérante n'est pas la seule personne exposée. | R. 247-3 punit « le fait de ne pas satisfaire » sans désigner l'auteur (V6 · 85) |
| 9 | Modèle : longueur annoncée « ≈ 129 mots » | AMBIGU | Après la correction de 07:03, la réponse fait 138 mots (145 en `wc -w`) : mettre l'étiquette à jour. Le texte reste dans la limite de 140. | Recomptage |
| 10 | Intitulé 2021-11 Q2.6 et intitulé codé 2026-05 Q1.2 | OK | — | 2021-11.txt l. 373 ; jsonl 2026-05 1.2 |
| 10 | URSSAF : avis 30 jours avant, réponse sous 30 jours prorogeable à 60 ; L. 130-1 CSS | OK | — | VERIF 39, 100 |
| 10 | Ouvrir V6 : L. 130-1 CSS (17-18), R. 243-59 (19-21) | OK | — | V6 · 17, 19 |
| 10 | Modèle 2024-05 Q1.3 : L. 3121-36 (25 % et 50 %), L. 8221-5, 199 sexdecies ; L. 1271-1 marqué « à vérifier » | OK | — | VERIF 97, 99. L. 1271-1 n'est pas dans les volumes (prudence correcte). |
| 10 | Modèle : faits (Ange en CESU dans le food-truck en juillet-août, Martin à 48 h, heures « payées par la suite ») | OK | — | 2024-05.txt annexe A3 |
| 10 | Longueur : 133 mots (141) | OK | — | 10 pts pour 8 questions |

## Résumé

Éléments contrôlés (environ 150) :
- 20 intitulés d'exemple et les 10 questions des réponses modèles : tous retrouvés à la session et au numéro indiqués ;
- environ 95 folios (V1 à V6) ;
- environ 60 articles, seuils, délais et sanctions ;
- les 10 raisonnements modèles ;
- les 10 longueurs ;
- les fréquences.

Erreurs, des plus graves aux moins graves :
1. **Famille 9, piège « Nullité jamais automatique » : ERREUR.** L. 821-5 rend nulles les délibérations prises sans commissaire régulièrement désigné ; seul le défaut de convocation échappe à la nullité (Com. 10 févr. 2021). Un candidat qui recopie la phrase se trompe dès que la question porte sur une absence de désignation.
2. **Famille 3, renvoi « NPLAB (27-36) » : FOLIO FAUX.** La norme couvre V5 · 20-59, et les paragraphes cités dans la réponse modèle (A19.2, A20, A22) sont en 44-45.
3. **Famille 3 : règle d'honoraires du seul CAC (art. 13).** L'exemple 2021-05 Q1.7 concerne un expert-comptable. La règle applicable (art. 158 du décret de 2012, honoraires de succès complémentaires de l'art. 24 de l'ordonnance) manque, et le risque d'appliquer la règle du CAC à l'EC est réel.
4. **Réponses modèles justes mais incomplètes** :
   - 2019-11 : manquent l'écart de capital 80 000 / 36 000 € et l'arrêté des comptes par le Président ;
   - 2024-05 Q2.3 : la règle de sortie (D. 821-171 al. 3) et l'option d'un mandat de 3 exercices ne sont pas citées ;
   - 2025-11 Q2.6 : le commissaire de la mère doit signaler à quelle assemblée, et la révélation de faits de la filiale est discutable ;
   - 2024-05 Q2.5 : la société, personne morale, n'est pas citée comme exposée.
5. **Fréquences des familles non reproductibles.** Les mots-clés et les 27 arbitrages ne sont pas fournis. Une reconstitution donne de 19 à 56 questions pour la famille 2, et 2024-05 Q2.3, codée « à critiquer », contredit la règle « critique d'abord ». Pour les consignes, le chiffre « 6 sujets sur 14 » pour « sans calcul » suppose des formulations voisines : la formule exacte n'apparaît que dans 4 sujets.
6. **Points mineurs** :
   - le piège « ancien numéro = anomalie » ne vaut que pour un document postérieur à 2024 ;
   - la réponse 2023-05 Q3.3 (120 mots) est courte pour une question à ≈ 1,33 point ;
   - l'étiquette « ≈ 129 mots » de 2024-05 Q2.5 est périmée (138) ;
   - le taux de 17,2 % de prélèvements sociaux est à revérifier pour une cession de 2026.

Aucun autre folio faux ; tous les seuils, délais et peines sont conformes à VERIF.md. Les 10 réponses modèles concluent juste au vu du cas. Aucune règle propre à une forme sociale n'est présentée comme générale, sauf le point 3 (règle CAC donnée à la place de la règle EC). Longueurs : de 119 à 138 mots selon le décompte « mots », toutes dans la plage de 100 à 140 ; en `wc -w` brut, 5 réponses dépassent 140 (141 à 150).
