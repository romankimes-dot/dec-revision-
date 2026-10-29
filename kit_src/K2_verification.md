# K2 — Vérification indépendante des 12 fiches de synthèse

Vérifié le 29/10/2026 par un vérificateur distinct de l'auteur. Objet : `kit_src/K2_fiches.html` et `imprimer/K2_Fiches_de_synthese.pdf` (12 pages, généré le 29/10/2026 06:45, 8 s après le HTML). Les fiches n'ont pas été modifiées. Aucun commit n'a été fait.

## Méthode

- Extraction automatique des **223 lignes de tableau** des 12 fiches (et des 3 encadrés). Contrôle de concordance HTML ↔ PDF : chaque nombre du HTML figure dans le texte du PDF. **Le PDF imprimé correspond au HTML.**
- Champ couvert : **100 % des lignes des 12 fiches**, pas d'échantillonnage. Cela fait environ **355 références** (articles, NEP, NP, articles du code de déontologie), **247 valeurs chiffrées** (seuils, montants, délais, durées, taux, peines, dates) et **315 folios** cités dans la colonne « Où ».
- Valeurs : comparées à la colonne « valeur correcte » de `docs/VERIF.md` (vNN), qui fait foi, puis au texte imprimé des volumes.
- Folios : les volumes ont été extraits page par page avec `pdftotext`. Le folio « Vx · n » correspond à la page n du PDF : l'alignement a été contrôlé sur toutes les pages de V1, V2, V4, V5 et V6. Pour chaque article cité, la page qui porte son en-tête et les pages où son texte se poursuit ont été repérées automatiquement, puis comparées aux folios de la ligne. Chaque valeur a ensuite été relue dans le texte de l'article (colonne « preuve »).
- Les folios « Mém. Audit / Sociétés / Fiscal » renvoient à des ouvrages qui ne sont pas dans le kit. La valeur a été contrôlée contre VERIF ; le folio lui-même est NON VÉRIFIABLE. Cela concerne 31 lignes, dont toute la fiche 11.
- Verdict OK = valeur conforme à VERIF ou au texte, et folio qui contient le texte. Quand le folio est exact mais incomplet, le verdict reste OK et la ligne porte une remarque.

## Tableau de vérification

| fiche | ligne | valeur | verdict | correction proposée | preuve (ligne VERIF ou folio lu) |
|---|---|---|---|---|---|
| 1 | 1.1 Société isolée : SA, SAS, SARL, SNC | 5 M€ / 10 M€ / 50 ; 1/1/2024 | **OK** | Folio incomplet : V6 · 75 ne contient que D. 221-5 ; les textes L. 225-218, L. 227-9-1, L. 223-35, L. 221-9 sont en V6 · 46, 52, 29, 22 (donnés en 2.1). Ajouter ces folios. | V6 · 75 lu (D. 221-5 : 5 000 000 / 10 000 000 / cinquante) ; v35 |
| 1 | 1.2 Même société, exercice ouvert avant le 1/1/2024 | 1/1/2024 ; 4 M€ ; 8 M€ ; 2024 ; 1/9/2023 ; 31/8/2024 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v35, v41 |
| 1 | 1.3 Tête de « petit groupe » (contrôle des sociétés, pas de comp | 5 M€ ; 10 M€ ; L. 821-43 ; L. 823-2-2 ; D. 821-171 ; D. 221-5 | **OK** |  | V2 · 37 lu (L. 821-43 al. 1) ; V6 · 90-91 lus (D. 821-171 → D. 221-5, chiffres cumulés) ; v36 |
| 1 | 1.4 Filiale « significative » d'une tête de petit groupe | 2,5 M€ ; 5 M€ ; L. 821-43 ; D. 821-172 ; 1/1/2024 ; 2 / 4 | **OK** |  | V6 · 91 lu (D. 821-172 : 2 500 000 / 5 000 000 / vingt-cinq) ; v37 |
| 1 | 1.5 Association ou personne morale non commerçante à activité éc | 1,55 M€ / 3,1 M€ / 50 | **OK** | Folio incomplet : L. 612-1 est en V6 · 70-71 ; R. 612-1 (chiffres) en V6 · 87. | V6 · 87 lu (R. 612-1 : cinquante, 3 100 000, 1 550 000, CDI, fin de trimestre, CAC + suppléant) ; v43 |
| 1 | 1.6 Association subventionnée | 153 000 € ; L. 612-4 ; D. 612-5 | **OK** |  | V6 · 71-72 lus (L. 612-4) ; V6 · 88 lu (D. 612-5 : 153 000 €) ; v42 |
| 1 | 1.7 Sortie de l'obligation | « Le mandat en cours va à son terme » appliqué aux associations | **ERREUR** | Associations : le mandat ne va PAS à son terme : « il est mis fin dans les mêmes conditions au mandat du CAC par l'organe délibérant appelé à statuer sur les comptes » (R. 612-1). Écrire : « Sociétés, petits groupes, filiales : le mandat en cours va à son terme. Associations : 2 exercices successifs sous 2 seuils → l'organe délibérant met fin au mandat. » | V6 · 88 lu (R. 612-1, dernier al.) ; V6 · 75, 91 lus (D. 221-5, D. 821-171/172) ; v38, v43 |
| 1 | 1.8 Calcul des salariés | L. 130-1 I CSS | **OK** | Folio incomplet : la règle associations (fins de trimestre, R. 612-1) est en V6 · 87, non cité. | V6 · 74 lu (D. 123-200 renvoie à L. 130-1 I CSS) ; V6 · 17 lu ; v39 |
| 1 | 1.9 Dispense « petit groupe » | — | **OK** |  | V2 · 37 lu (L. 821-43 al. 2) ; v40 |
| 1 | 1.10 Micro-entreprise | 450 000 € ; 900 000 € ; L. 232-25 | **OK** |  | V6 · 74 lu (450 000 / 900 000 / 10) ; V6 · 59 lu ; v44 |
| 1 | 1.11 Petite entreprise | 7,5 M€ / 15 M€ / 50 | **AMBIGU** | Ajouter « hors sociétés appartenant à un groupe (L. 233-16) et entités L. 123-16-2 » (la fiche 10.5 le dit, pas la fiche 1). | V6 · 74 lu (D. 123-200 2°) ; V6 · 59 lu (L. 232-25) |
| 1 | 1.12 Moyenne entreprise | 25 M€ ; 50 M€ ; 250 | **OK** |  | V6 · 74 lu (25 000 000 / 50 000 000 / 250) ; v44 |
| 1 | 1.13 Petit groupe / groupe moyen-grand | 9 M€ ; 30 M€ ; 18 M€ ; 60 M€ ; 50 / 250 ; L. 233-17 ; 30 / 60 ; 250 ; 9 / 18 | **OK** |  | V6 · 82 lu (D. 230-2 : 9/18/50 ; 30/60/250) ; V6 · 60 lu (L. 233-17 2° « grand groupe ») ; v45 |
| 1 | 1.14 Micro-BIC ventes et hébergement | 203 100 € ; 71 % ; 15 000 € ; 30 % ; 2026 ; 2028 ; CGI 50-0 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v72, v73 |
| 1 | 1.15 Micro-BIC services et micro-BNC | 83 600 € ; 50 % ; 34 % ; 305 € ; 2026 ; 2028 ; CGI 50-0 ; 102 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v72, v73 |
| 1 | 1.16 Franchise en base de TVA | 85 000 € ; 37 500 € ; 500 / 41 ; 250 € ; 25 000 € ; 2025 ; 1044 ; 2026 ; CGI 293 B ; 1/1/2027 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v75, v76 |
| 1 | 1.17 IS | 25 % ; 15 % ; 42 500 € ; 10 M€ ; 75 % ; 2026 ; CGI 219 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v81 |
| 1 | 1.18 Compte bancaire dédié (micro-entrepreneur) | 10 000 € ; L. 613-10 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v71 |
| 2 | 2.1 Société au-dessus des seuils (fiche 1) | L. 225-218 ; L. 227-9-1 ; L. 223-35 ; L. 221-9 | **OK** |  | V6 · 46, 52, 29, 22 lus (2 critères sur 3 « à la clôture ») ; v3 |
| 2 | 2.2 Tête de petit groupe ; filiale significative | L. 821-43 ; L. 823-2-2 | **OK** |  | V2 · 37 lu (« même CAC » possible) ; v4 |
| 2 | 2.3 Comptes consolidés obligatoires | au moins deux CAC | **OK** | Valeur conforme à VERIF (L. 821-41 = ex L. 823-2, v5/v29). Attention : la brochure V2 · 37 imprime « L. 821-41 (ancien article L. 823-1) » : ne pas recopier la brochure. | V2 · 37 lu ; v29 |
| 2 | 2.4 Entité d'intérêt public (EIP) | L. 821-42 | **OK** |  | V2 · 37 lu (L. 821-42) |
| 2 | 2.5 Associations | 153 000 € ; L. 612-1 ; L. 612-4 | **OK** |  | V6 · 70-72 lus |
| 2 | 2.6 Sous les seuils : demande en justice | 1/10 ; L. 225-218 ; L. 227-9-1 ; L. 223-35 ; L. 221-9 | **OK** |  | V6 · 46, 52, 29 lus (« dixième du capital ») ; V6 · 22 lu (SNC : « par un associé ») ; v25, v26 |
| 2 | 2.7 Sous les seuils : demande motivée | 1/3 ; 3 exercices ; NEP 911 | **OK** |  | V6 · 23, 29, 46, 52 lus (« tiers du capital », « trois exercices ») ; V1 · 99 lu (NEP 911 §02) ; v26 |
| 2 | 2.8 Organe | L. 821-40 I ; L. 823-1 ; L. 225-228 ; L. 227-9 | **OK** |  | V2 · 35 lu (L. 821-40 I) ; V6 · 46 lu (L. 225-228) ; V6 · 52 lu (L. 227-9 al. 2 : nomination des CAC par décision collective) ; v2 |
| 2 | 2.9 Liberté de choix | L. 821-40 I | **OK** |  | V2 · 35 lu (« réputée non écrite ») |
| 2 | 2.10 Oubli de nomination | L. 821-47 ; L. 823-4 ; D. 821-174 | **OK** |  | V2 · 40 lu (L. 821-47 « tout membre de l'assemblée ») ; V6 · 91 lu (D. 821-174 référé) ; v27 |
| 2 | 2.11 Suppléant | L. 821-40 I | **OK** |  | V2 · 35 lu (suppléant ; empêchement temporaire) ; v28 |
| 2 | 2.12 Formalité du CAC | 8 jours ; D. 821-173 | **OK** |  | V6 · 91 lu (D. 821-173 : huit jours, LRAR ou voie électronique) |
| 2 | 2.13 Droit commun | 6 exercices ; L. 821-44 ; L. 823-3 | **OK** |  | V2 · 37 lu (L. 821-44) ; v6 |
| 2 | 2.14 Nomination volontaire, tête de petit groupe, filiale signifi | 3 exercices ; L. 821-46 ; L. 823-3-2 | **OK** |  | V2 · 40 lu (L. 821-46 : 1er ou dernier al. de L. 821-43) ; v7 |
| 2 | 2.15 Mandat de 3 exercices = mission « ALPE » (audit légal des pe | 3 exercices ; arrêté 24/07/2026 | **OK** | NEP 911 : arrêté du 24/07/2026 (JO 26/07/2026) confirmé par V1 · 99 (VERIF v46 le laissait « à contrôler »). | V2 · 44 lu (L. 821-57 + liste des dispenses) ; V1 · 99 lu ; v8, v46 |
| 2 | 2.16 Petite entreprise, mandat de 6 exercices | 6 exercices ; NEP 912 | **OK** |  | V1 · 107 lu (NEP 912) |
| 2 | 2.17 EIP | 10 ans / 24 ans / viduité 4 ans | **AMBIGU** | « 10 ans maximum » est incomplet : au terme des 10 ans, nouveau mandat de 6 exercices possible si les conditions de l'art. 16 §2-5 du règlement 537/2014 sont respectées (appel d'offres) ; 24 ans si co-commissariat ; +2 ans exceptionnels sur autorisation H2A (L. 821-45 I à III). | V2 · 38 lu (L. 821-45 I, II, III, IV) |
| 2 | 2.18 Récusation | 5 % ; 30 jours ; L. 821-49 ; L. 823-6 ; R. 821-176 | **OK** |  | V2 · 41 lu (L. 821-49 : 5 %, CE, MP, AMF, divergence comptable) ; V6 · 91-92 lus (R. 821-176 : trente jours) ; v25 |
| 2 | 2.19 Relèvement | 5 % ; L. 821-50 ; L. 823-7 | **OK** |  | V2 · 41 lu (L. 821-50) |
| 2 | 2.20 Non-renouvellement | L. 821-51 | **OK** |  | V2 · 41-42 lus (L. 821-51) |
| 2 | 2.21 Sortie de l'obligation | D. 221-5 al. 2 | **ERREUR** | Citer « D. 221-5 » sans numéro d'alinéa, ou « al. 3 » comme VERIF v38 (la phrase est le 2e paragraphe dans la mise en page de V6, d'où la confusion). | v38 (« D. 221-5 al. 3 ») ; V6 · 75 lu |
| 3 | 3.1 Certification des comptes annuels : sans réserve, avec réser | L. 821-53 ; L. 823-9 ; 700 ; 701 ; 702 | **OK** |  | V2 · 42 lu (L. 821-53) ; V1 · 87, 91, 94 lus (NEP 700/701/702) ; v9 |
| 3 | 3.2 Certification des comptes consolidés (rapport distinct) | L. 821-53 ; L. 821-41 ; 700 ; 600 | **OK** |  | V2 · 42 lu (L. 821-53 al. 2) ; V2 · 37 (L. 821-41) ; V1 · 70 |
| 3 | 3.3 Vérifications spécifiques : rapport de gestion, documents au | L. 821-54 ; L. 823-10 ; 9510 ; 20/04/2026 | **OK** |  | V2 · 43 lu (L. 821-54 I) ; V1 · 121 lu (NEP 9510, arrêté 20/04/2026) ; v10, v107 |
| 3 | 3.4 Égalité entre actionnaires (vérification) | L. 821-56 ; L. 823-11 | **OK** |  | V2 · 44 lu (L. 821-56) |
| 3 | 3.5 Rapport spécial sur les conventions réglementées | L. 225-40 ; R. 225-31 ; L. 223-19 ; L. 227-10 ; L. 612-5 | **OK** |  | V6 · 35-36, 80, 25, 53, 72 lus ; V1 · 3 lu (aucune NEP hors 2410/9510/9520/9605 dans « autres interventions ») |
| 3 | 3.6 Suppression du droit préférentiel de souscription (DPS) | L. 225-135 ; L. 225-136 | **OK** |  | V6 · 42 lu (L. 225-135 : rapport CAC + rapport sur conditions définitives si délégation) |
| 3 | 3.7 Réduction de capital : appréciation des causes et conditions | 45 jours ; L. 225-204 ; L. 223-34 ; R. 223-33 | **OK** |  | V6 · 45 lu (L. 225-204) ; V6 · 77 lu (R. 223-33 : 45 jours) ; V2 · 44 (renvoi L. 223-34, non reproduit) |
| 3 | 3.8 Certification du bilan permettant un acompte sur dividende | L. 232-12 ; R. 232-17 | **OK** |  | V6 · 55 lu (L. 232-12 al. 2) ; V6 · 84 lu (R. 232-17) ; v47 |
| 3 | 3.9 Paiement du dividende en actions : vérification du prix d'ém | L. 232-19 | **OK** |  | V6 · 56 lu (L. 232-19 : vérification du prix, rapport spécial) |
| 3 | 3.10 Libération d'actions par compensation de créances : certific | L. 225-146 | **OK** |  | V6 · 43 lu (L. 225-146 : certificat du CAC tient lieu de certificat du dépositaire) |
| 3 | 3.11 Transformation : SA → autre forme (rapport du CAC) ; SARL →  | L. 225-244 ; L. 223-43 | **OK** |  | V6 · 31 lu (L. 223-43 : rapport d'un CAC inscrit) ; V2 · 45 lu (note 14 : rapport sur la transformation des SA ; L. 225-244 non reproduit) |
| 3 | 3.12 Rapport « ALPE » sur les risques financiers, comptables et d | 3 exercices ; L. 821-57 ; R. 821-183 ; 911 | **OK** |  | V2 · 44 lu ; V6 · 92 lu (R. 821-183) ; V1 · 99 |
| 3 | 3.13 Rapport spécial d'alerte (fiche 6) | L. 234-1 ; L. 234-2 ; L. 612-3 ; 570 | **OK** |  | V6 · 62-63, 71 lus ; V1 · 66 |
| 3 | 3.14 Signalement des irrégularités (fiche 5) | L. 821-10 ; L. 823-12 ; 250 | **OK** |  | V2 · 19 lu (L. 821-10 al. 1) ; V1 · 16 ; v11 |
| 3 | 3.15 Communication aux organes : programme de travail, sondages,  | L. 821-63 I ; L. 823-16 ; 260 ; 265 | **OK** |  | V2 · 46-47 lus (L. 821-63 I 1° à 6°) ; V1 · 18, 20 ; v19 |
| 3 | 3.16 Rapport complémentaire au comité d'audit (EIP) | au plus tard avec le rapport | **OK** | Le délai « au plus tard à la date de présentation du rapport d'audit » est dans l'art. 11 du règlement cité en note, pas dans L. 821-63 III. | V2 · 47 lu (L. 821-63 III + note art. 11) |
| 3 | 3.17 Examen limité de comptes intermédiaires (quand la loi l'impo | 2410 | **OK** |  | V1 · 116 lu (NEP 2410) |
| 3 | 3.18 Certification des informations de durabilité (CSRD) | L. 821-54 II | **OK** |  | V2 · 43 lu (L. 821-54 II) |
| 4 | 4.1 Convocation | L. 821-65 ; L. 823-17 | **OK** |  | V2 · 49 lu (L. 821-65) ; v17 |
| 4 | 4.2 Forme et délai | D. 821-185 ; L. 223-39 | **OK** |  | V6 · 92-93 lus (D. 821-185 : au plus tard lors de la convocation ; LRAR) ; V6 · 30 lu (L. 223-39) ; v17 |
| 4 | 4.3 Documents à remettre | 1 mois ; 45 jours ; R. 232-1 ; R. 221-6 ; R. 612-2 | **OK** |  | V6 · 83 lu (R. 232-1 : un mois au moins) ; V6 · 75 lu (R. 221-6) ; V6 · 88 lu (R. 612-2 : quarante-cinq jours) |
| 4 | 4.4 Conventions (SA) | R. 225-30 | **OK** |  | V6 · 79-80 lus (R. 225-30 : un mois / un mois de la clôture) — lève v57 NON VÉRIFIABLE |
| 4 | 4.5 Accès à l'information | L. 821-60 ; L. 821-61 ; D. 821-175 | **OK** |  | V2 · 46 lu (L. 821-60, L. 821-61 : tiers, décision de justice, auxiliaires de justice) ; V6 · 91 lu (D. 821-175) |
| 4 | 4.6 Réponses aux questions d'associés | 5 % ; L. 225-231 ; L. 223-36 | **OK** |  | V6 · 46-47 lus (L. 225-231 : 5 %) ; V6 · 29 lu (L. 223-36) |
| 4 | 4.7 Honoraires | L. 821-66 | **OK** |  | V2 · 49 lu (L. 821-66 I) |
| 4 | 4.8 Ne pas provoquer la désignation du CAC ; ne pas le convoquer | 2 ans + 30 000 € | **OK** | Attention : V2 · 8 contient un NOUVEL article L. 820-4 (sans rapport) ; « ex L. 820-4 » désigne l'ancien numéro (v13). | V2 · 18 lu (L. 821-6 1°) ; v13 |
| 4 | 4.9 Idem pour le CAC chargé des informations de durabilité | L. 821-6 | **OK** |  | V2 · 19 lu (L. 821-6 2°) ; v14 |
| 4 | 4.10 Entrave : faire obstacle aux vérifications, refuser la commu | 5 ans ; 75 000 € ; L. 821-6 | **OK** |  | V2 · 19 lu (L. 821-6 3°) ; v13 |
| 4 | 4.11 Informations mensongères ; non-révélation de faits délictueu | 5 ans + 75 000 € | **OK** | Même remarque : « ex L. 820-7 » = ancien numéro ; le L. 820-7 de V2 · 9 est un autre texte. | V2 · 19 lu (L. 821-9) ; v12 |
| 4 | 4.12 Exercer malgré une incompatibilité légale | 6 mois ; 7 500 € ; L. 821-8 | **OK** |  | V2 · 19 lu (L. 821-8 : six mois, 7 500 €) |
| 4 | 4.13 Usage du titre sans inscription ; exercice illégal | 1 an ; 15 000 € ; L. 821-7 | **OK** |  | V2 · 19 lu (L. 821-7 : un an, 15 000 €) |
| 4 | 4.14 Violation du secret professionnel | 226 ; L. 821-7 ; L. 821-35 | **OK** |  | V2 · 19 lu (L. 821-7 dernier al. : C. pén. 226-13 et 226-14) ; V2 · 33 |
| 4 | 4.15 Délibérations prises sans CAC régulièrement désigné, ou sur  | nullité ; confirmation | **OK** | Même remarque pour « ex L. 820-3-1 » (V2 · 8 = nouveau L. 820-3-1, autre texte). | V2 · 18 lu (L. 821-5) ; v15 |
| 4 | 4.16 CAC (régulièrement désigné) seulement non convoqué | 2021 ; 302 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v67 |
| 4 | 4.17 SARL : documents non communiqués aux associés | L. 223-26 | **OK** |  | V6 · 27 lu (L. 223-26 « peut être annulée ») |
| 4 | 4.18 Responsabilité civile du CAC | L. 821-37 ; L. 822-17 | **OK** |  | V2 · 34 lu (L. 821-37) ; v21 |
| 4 | 4.19 Prescription | 3 ans ; 10 ans ; L. 821-38 ; L. 225-254 | **OK** |  | V2 · 34 lu (L. 821-38 → L. 225-254 : trois ans / dix ans) ; v30 |
| 5 | 5.1 1. Une irrégularité ou une inexactitude (règle non respectée | art. 7 du ; 537/2014 ; L. 821-63 I ; L. 821-10 ; L. 823-12 | **OK** |  | V2 · 47 lu (L. 821-63 I 5°) ; V2 · 19-20 lus (L. 821-10 al. 1, art. 7 règl.) ; v11 |
| 5 | 5.2 2. Un fait délictueux (infraction pénale dont j'ai connaissa | 5 ans ; 75 000 € ; L. 821-10 ; L. 821-9 | **OK** |  | V2 · 19 lu (L. 821-10 al. 2, L. 821-9) ; v11, v12 |
| 5 | 5.3 3. Un soupçon de blanchiment, de financement du terrorisme o | L. 561-23 ; L. 821-10 ; L. 561-15 ; L. 561-18 | **OK** |  | V2 · 19 lu (al. 3) ; V6 · 12 lu (L. 561-15 I, II critère du décret, V tentatives, VI par écrit) ; V6 · 13 lu (L. 561-18 confidentialité) |
| 5 | 5.4 3 bis. Opération complexe, montant inhabituel, sans justific | L. 561-10-2 ; L. 561-15 III | **OK** |  | V6 · 10 lu (L. 561-10-2) ; V6 · 12 lu (L. 561-15 III) |
| 5 | 5.5 4. Des comptes non déposés au greffe | 1 mois / 2 mois ; 1 500 € / 3 000 € ; L. 232-21 à -23 ; R. 247-3 | **AMBIGU** | L. 232-21 ne vise que les SNC dont tous les associés indéfiniment responsables sont des SARL ou sociétés par actions : une SNC « ordinaire » n'a pas à déposer ses comptes. Ajouter cette restriction. Montants 1 500 / 3 000 € : exacts (v52) mais absents de V6 · 85 (R. 247-3 renvoie à C. pén. 131-13 5°). Contradiction avec data/items.json (« revelation » : non-dépôt « à signaler, pas à révéler ») alors que la fiche dit « position CNCC à vérifier » : harmoniser. | V6 · 57 lu (L. 232-21 I) ; V6 · 58 (L. 232-22, -23) ; V6 · 85 lu ; v51, v52 |
| 5 | 5.6 4 bis. Suite du non-dépôt | L. 232-24 ; L. 123-5-1 ; L. 611-2 II | **OK** |  | V6 · 59 lu (L. 232-24) ; v53 |
| 5 | 5.7 5. Des faits qui compromettent la continuité d'exploitation | NEP 570 ; L. 234-1 ; L. 234-2 ; L. 612-3 | **OK** |  | V6 · 62-63, 71 ; V1 · 66 |
| 5 | 5.8 6. Une convention non autorisée (SA) | L. 225-42 | **OK** |  | V6 · 36 lu (L. 225-42 al. 3 : rapport exposant les circonstances) |
| 5 | 5.9 Acompte distribué sans bilan certifié | L. 232-12 ; 5 ans ; 375 000 € ; L. 242-6 ; L. 241-3 | **OK** |  | V6 · 55 lu (L. 232-12 dernier al.) ; V6 · 69 lu (L. 242-6 1°) ; V6 · 67 lu (L. 241-3 2°) ; v48 |
| 5 | 5.10 CAC non convoqué à l'assemblée | 2 ans ; 30 000 € ; L. 821-6 | **OK** |  | V2 · 18 lu ; v13 |
| 5 | 5.11 Abus de biens sociaux | 5 ans ; 375 000 € ; 7 ans ; 500 000 € ; L. 242-6 ; L. 241-3 | **OK** |  | V6 · 69 lu (L. 242-6 3° ; 7 ans / 500 000 €) ; V6 · 67 lu (L. 241-3 4°) ; v66 |
| 5 | 5.12 Comptes infidèles présentés pour cacher la situation | 5 ans ; 375 000 € ; L. 242-6 ; L. 241-3 | **OK** |  | V6 · 69 lu (L. 242-6 2°) ; V6 · 67 lu (L. 241-3 3°) |
| 5 | 5.13 Assujettis | L. 561-2 | **OK** |  | V6 · 5 lu (L. 561-2 12° EC, 12° bis CAC) |
| 5 | 5.14 Normes | NEP 9605 ; 1/1/2024 ; 2020 | **OK** |  | V1 · 129 et V1 · 3 lus (NEP 9605, en vigueur 1/1/2024) ; V5 · 20 lu (NPLAB, arrêté 7/12/2020) ; v105 |
| 5 | 5.15 Secret | L. 821-10 ; 1945 ; art. 21 | **OK** |  | V2 · 33 lu (L. 821-35 « sous réserve de L. 821-10 ») ; V4 · 40 lu (ord. art. 21) |
| 6 | 6.1 1 | 15 jours | **OK** |  | V6 · 62-63 lus (L. 234-1 al. 1) ; V6 · 63 lu (L. 234-2 : 15 jours, CSE, président du TC) ; V6 · 71 lu (L. 612-3) ; v68 |
| 6 | 6.2 2 | 15 jours | **OK** |  | V6 · 63 lu (L. 234-1 al. 2 ; L. 234-2 al. 3) ; V6 · 71 lu (L. 612-3 : délai fixé par décret) |
| 6 | 6.3 3 | — | **OK** |  | V6 · 63 lu (L. 234-1 al. 3) ; V6 · 63 (L. 234-2 al. 4) ; V6 · 71 |
| 6 | 6.4 4 | — | **OK** |  | V6 · 63 lu ; V6 · 71 lu |
| 6 | 6.5 Où | — | **OK** |  | V6 · 62-64, 71, 88 lus |
| 6 | 6.6 Délai de réponse | 15 jours ; L. 234-1 ; L. 234-2 | **OK** |  | V6 · 63 lu (quinze jours) ; v68 |
| 6 | 6.7 Reprise | 6 mois ; L. 234-1 ; L. 234-2 ; L. 612-3 | **OK** |  | V6 · 63 lu (six mois, dernier al. ; renvoi par L. 234-2) ; V6 · 71 lu ; v68 |
| 6 | 6.8 Audition | L. 234-1 ; L. 234-2 ; L. 611-2 I | **OK** |  | V6 · 63 lu (« peut demander à être entendu », L. 611-2 I al. 2) |
| 6 | 6.9 Exclusion | L. 234-4 ; L. 612-3 | **OK** |  | V6 · 64 lu (L. 234-4) ; V6 · 71 lu (L. 612-3 dernier al.) |
| 6 | 6.10 Secret professionnel | L. 821-35 ; L. 822-15 | **OK** |  | V2 · 33 lu (L. 821-35 al. 1) |
| 6 | 6.11 Associations : forme | R. 234-1 ; R. 234-5 ; R. 612-4 | **OK** |  | V6 · 88 lu (R. 612-4) |
| 6 | 6.12 Portée | L. 821-55 | **OK** |  | V2 · 44 lu (L. 821-55) |
| 6 | 6.13 Norme | NEP 570 | **OK** |  | V1 · 66 lu |
| 6 | 6.14 Capitaux propres < ½ capital | 4 mois ; L. 223-42 ; L. 225-248 | **OK** |  | V6 · 30 lu (L. 223-42 : 4 mois ; gérant ou CAC ; tout intéressé) ; V6 · 47 lu (L. 225-248) ; v54 |
| 6 | 6.15 Cessation des paiements | 45 jours ; L. 631-4 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v69 |
| 6 | 6.16 Comptes non déposés | L. 611-2 II ; L. 232-24 | **OK** |  | V6 · 59 lu ; v53 |
| 7 | 7.1 Incompatibilités générales | 1945 ; art. 22 ; L. 821-27 ; L. 822-10 | **OK** |  | V2 · 29 lu (L. 821-27 1° à 3°) ; v22 |
| 7 | 7.2 Services interdits (EIP) | art. 5 ; 537/2014 ; L. 821-28 I ; L. 822-11 | **OK** |  | V2 · 29-30 lus (L. 821-28 I-III, note art. 5 règl.) |
| 7 | 7.3 Non-EIP | L. 821-28 IV | **OK** |  | V2 · 30 lu (L. 821-28 IV) |
| 7 | 7.4 Autres services (EIP) | 70 % ; L. 821-30 ; L. 821-66 II | **OK** |  | V2 · 31 lu (L. 821-30) ; V2 · 49 lu (L. 821-66 II : 70 %, 3 derniers exercices) |
| 7 | 7.5 Intérêts | L. 821-31 ; L. 822-11-3 | **OK** |  | V2 · 31 lu (L. 821-31 I) |
| 7 | 7.6 Viduité : CAC → dirigeant | 3 ans ; 1 an ; L. 821-32 ; L. 822-12 | **OK** |  | V2 · 32 lu (L. 821-32 : trois ans ; un an) ; v22 |
| 7 | 7.7 Viduité : dirigeant ou salarié → CAC | 5 ans ; 10 % ; L. 821-33 ; L. 822-13 | **OK** |  | V2 · 32 lu (L. 821-33 : cinq années ; 10 %) ; v22 |
| 7 | 7.8 Rotation des signataires | 6 exercices / 7 années / 3 ans | **OK** | Formulation exacte du texte : EIP, entités L. 612-1, et associations L. 612-4 « dès lors qu'elles font appel à la générosité du public ». | V2 · 32 lu (L. 821-34 I) ; v24 |
| 7 | 7.9 Durée maximale du cabinet (EIP) | 10 ans / 24 ans / 4 ans | **AMBIGU** | Même correction que 2.17 : 10 ans, renouvelable 6 exercices après procédure de sélection (art. 16 règl.), 24 ans en co-commissariat, +2 ans H2A. | V2 · 38 lu |
| 7 | 7.10 Avant d'accepter | L. 821-4 II | **OK** |  | V2 · 18 lu (L. 821-4 II) |
| 7 | 7.11 3 | — | **OK** |  | V4 · 3 (art. 3) et V4 · 5 (art. 13 rémunération proportionnelle ou conditionnelle) lus ; v33, v34 |
| 7 | 7.12 4 | — | **OK** |  | V4 · 3 (art. 4), V4 · 5 (art. 14) lus |
| 7 | 7.13 5 | L. 821-28 | **OK** |  | V4 · 3 (art. 5), V4 · 6-7 (art. 18 → L. 821-28) lus ; v33 |
| 7 | 7.14 6 | — | **OK** |  | V4 · 3 (art. 6), V4 · 7 (art. 19) lus |
| 7 | 7.15 9 | — | **OK** |  | V4 · 4 (art. 9), V4 · 8 (art. 22) lus |
| 7 | 7.16 10 | — | **OK** |  | V4 · 4 (art. 10), V4 · 9 (art. 26, 28) lus ; v33 |
| 7 | 7.17 32-34 | — | **OK** |  | V4 · 11-12 lus (art. 32-34) |
| 7 | 7.18 Ordonnance 45-2138 | 2138 ; art. 21 ; art. 22 | **OK** |  | V4 · 33 (art. 2), 40 (art. 21), 41 (art. 22) lus ; v102 |
| 7 | 7.19 Code de déontologie EC (décret 2012-432, art. 141 à 169) | 2012 ; 432 ; art. 141 à ; 169 ; 145 ; 146 ; 147 ; 150 ; 151 ; 155 | **OK** |  | V4 · 26-31 lus (art. 145, 146, 147, 150, 151, 155, 156, 163) ; v103, v104 |
| 7 | 7.20 Normes de l'Ordre | NP 2300 ; NP 2400 ; NP 2910 ; NP 3100 ; NP 3400 ; NP 4400 ; NP 4410 ; 7/12/2020 | **OK** |  | V5 · 60, 78, 100, 152, 186, 206, 220, 20 lus (pages de titre de chaque norme) ; v105 |
| 8 | 8.1 Personnes visées | 10 % des droits de vote ; personnes visées | **AMBIGU** | En-tête de colonne « SARL (et EURL) » : pour l'EURL, une convention avec l'associé unique est seulement mentionnée au registre des décisions (L. 223-19 al. 3) : ni rapport ni vote (lignes 8.5-8.6). Ajouter « EURL : mention au registre » dans la ligne Rapport. Contenu des personnes visées : exact. | V6 · 25-26 lus (L. 223-19) ; V6 · 35 lu (L. 225-38) ; V6 · 53 lu (L. 227-10) |
| 8 | 8.2 Hors champ | 100 % | **OK** |  | V6 · 35 lu (L. 225-39) ; V6 · 53 lu (L. 227-11) ; V6 · 26 lu (L. 223-20) |
| 8 | 8.3 Avant | — | **OK** |  | V6 · 35-36 lus (L. 225-38 dernier al., L. 225-40 al. 1) ; V6 · 25 lu (L. 223-19 al. 2 : gérant non associé sans CAC) |
| 8 | 8.4 Information du CAC | SA : 1 mois ; SARL : non fixé | **AMBIGU** | Colonne SARL « Non fixées par L. 223-19 » : vrai pour l'article législatif, mais la partie réglementaire (R. 223-17, non reproduit dans V6) prévoit un avis du gérant au CAC dans le mois de la conclusion (et dans le mois de la clôture pour les conventions poursuivies) — à vérifier dans le Mémento Sociétés avant de l'écrire. Colonne SA : exacte (R. 225-30 ; L. 225-40-1). | V6 · 79-80 lus (R. 225-30) ; V6 · 36 lu (L. 225-40-1) ; R. 223-17 absent des volumes (NON VÉRIFIABLE) |
| 8 | 8.5 Rapport | — | **OK** |  | V6 · 80 lu (R. 225-31) ; V6 · 53 lu (L. 227-10) ; V6 · 25 lu (L. 223-19) |
| 8 | 8.6 Vote | — | **OK** |  | V6 · 36 lu (L. 225-40 : actions non prises en compte pour la majorité) ; V6 · 25 lu (L. 223-19 : quorum et majorité) |
| 8 | 8.7 Si non approuvée | — | **OK** |  | V6 · 36 lu (L. 225-41) ; V6 · 53 lu (L. 227-10 al. 3) ; V6 · 25 (L. 223-19) ; V6 · 27 lu (L. 223-23 : 3 ans) |
| 8 | 8.8 Sans autorisation préalable | 3 ans | **OK** |  | V6 · 36 lu (L. 225-42 : 3 ans, révélation, rapport spécial) |
| 8 | 8.9 Conventions interdites (nullité) | L. 225-43 | **OK** |  | V6 · 36-37 lus (L. 225-43) ; V6 · 53 lu (L. 227-12) ; V6 · 26 lu (L. 223-21) |
| 8 | 8.10 Textes | L. 225-38 ; R. 225-30 ; R. 225-31 ; L. 227-10 ; L. 227-11 ; L. 227-12 | **OK** |  | V6 · 35-37, 53, 25-27 lus (L. 227-10 al. 4 = SASU) |
| 8 | 8.11 Où | — | **OK** |  | V6 · 35-37, 79-80, 53, 25-27 lus ; v56 |
| 8 | 8.12 Associations et personnes morales non commerçantes | L. 612-5 | **OK** |  | V6 · 72 lu (L. 612-5) |
| 8 | 8.13 Mandat ALPE (3 exercices) | 3 exercices ; L. 821-57 | **OK** |  | V2 · 44 lu (L. 821-57 : L. 223-19, L. 225-40, L. 227-10) |
| 8 | 8.14 Ce que fait le CAC | L. 225-40 ; L. 821-10 | **OK** |  | V6 · 36 ; V2 · 19 lus |
| 8 | 8.15 Norme | — | **OK** |  | V1 · 3 lu |
| 9 | 9.1 Constitution de SA avec apports en nature ou avantages parti | L. 225-14 ; L. 225-8 | **OK** |  | V6 · 33-34 lus (L. 225-8) |
| 9 | 9.2 Augmentation de capital de SA par apport en nature | L. 225-147 | **OK** |  | V6 · 43-44 lus (L. 225-147) |
| 9 | 9.3 Constitution de SARL | 30 000 € ; L. 223-9 ; D. 223-6-1 | **OK** |  | V6 · 24 lu (L. 223-9) ; V6 · 76 lu (D. 223-6-1 : 30 000 €) ; v59 |
| 9 | 9.4 Constitution de SAS | 30 000 € ; moitié du capital | **OK** | Le « à vérifier » peut être levé : L. 227-1 al. 3 rend applicables à la SAS les règles de la SA (dont L. 225-8) et organise la même dispense (30 000 €, ½ capital). | V6 · 50 lu (L. 227-1) |
| 9 | 9.5 SA : achat d'un bien à un actionnaire dans les 2 ans de l'im | 2 ans ; 1/10 ; L. 225-101 | **OK** |  | V6 · 39 lu (L. 225-101 : 2 ans, 1/10, AGO à peine de nullité) |
| 9 | 9.6 Fusion | 100 % ; 90 % ; L. 236-10 ; L. 236-11 ; L. 236-12 | **OK** |  | V6 · 65-66 lus (L. 236-10 I-II, L. 236-11, L. 236-12 2°) ; v60 |
| 9 | 9.7 Fusion avec apports en nature ou avantages particuliers | L. 225-147 ; L. 236-10 III | **OK** |  | V6 · 65 lu (L. 236-10 III) |
| 9 | 9.8 Transformation en société par actions d'une société sans CAC | L. 223-43 ; L. 224-3 | **OK** |  | V6 · 32 lu (L. 224-3) ; v61 |
| 9 | 9.9 SARL → SA | 750 000 € ; L. 223-43 | **OK** |  | V6 · 31 lu (L. 223-43 : 750 000 €) |
| 9 | 9.10 Transformation en SAS | L. 227-3 | **OK** |  | V6 · 51 lu (L. 227-3) |
| 9 | 9.11 SA → société européenne | L. 225-245-1 | **OK** |  | V6 · 47 lu (L. 225-245-1) |
| 9 | 9.12 Avantages particuliers | L. 225-8 ; L. 225-147 ; L. 224-3 | **OK** |  | V6 · 33-34, 43, 32 lus |
| 9 | 9.13 Pas de commissaire ou valeur différente (SARL, SAS) | 5 ans ; L. 223-9 ; L. 227-1 | **OK** |  | V6 · 24, 50 lus (5 ans) |
| 9 | 9.14 Surévaluation frauduleuse d'un apport | 5 ans ; 375 000 € ; L. 241-3 | **OK** |  | V6 · 67 lu (L. 241-3 1° : 5 ans, 375 000 €) |
| 9 | 9.15 Commissaire aux apports en situation d'incompatibilité | 6 mois ; 9 000 € ; L. 242-5 | **OK** |  | V6 · 69 lu (L. 242-5 : six mois, 9 000 €) |
| 9 | 9.16 Normes | — | **OK** |  | V1 · 3 lu ; doctrine NON VÉRIFIABLE (Mémento) |
| 9 | 9.17 Ancien CAC devenu commissaire | L. 821-40 I | **OK** |  | V2 · 35 lu (L. 821-40 I : deux derniers exercices) |
| 10 | 10.1 Approbation | 6 mois ; L. 225-100 ; L. 223-26 ; L. 221-7 ; L. 227-9 ; R. 612-2 | **OK** |  | V6 · 38 (L. 225-100), 27 (L. 223-26), 22 (L. 221-7), 52 (L. 227-9 SASU), 88 (R. 612-2) lus ; v50 |
| 10 | 10.2 Convocation de l'assemblée | 15 jours ; 10 jours ; R. 225-69 ; R. 223-20 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v63 |
| 10 | 10.3 Dépôt au greffe | 1 mois / 2 mois ; refus → délibération | **AMBIGU** | « L. 232-21 (SNC) » : préciser « SNC dont tous les associés indéfiniment responsables sont des SARL/SA/SAS (ou SNC/SCS de même composition) ». Délais 1 mois / 2 mois et dépôt de la délibération en cas de refus : exacts. | V6 · 57-58 lus (L. 232-21 I-III, L. 232-22 II, L. 232-23 I) ; v51 |
| 10 | 10.4 Non-dépôt | 1 500 € ; 3 000 € ; R. 247-3 ; L. 232-24 | **OK** |  | V6 · 85 lu (R. 247-3 → C. pén. 131-13) ; V6 · 59 lu ; v52 (montants) |
| 10 | 10.5 Confidentialité | L. 232-25 | **OK** |  | V6 · 59 lu (L. 232-25) |
| 10 | 10.6 Réserve légale (SARL, sociétés par actions) | 1/20 ; 1/10 ; L. 232-10 | **OK** |  | V6 · 54-55 lus (vingtième ; dixième) ; v49 |
| 10 | 10.7 Bénéfice distribuable | L. 232-11 | **OK** |  | V6 · 55 lu (L. 232-11) |
| 10 | 10.8 Paiement des dividendes | 9 mois ; L. 232-13 ; R. 232-18 | **OK** |  | V6 · 55 lu (L. 232-13 : neuf mois) ; V6 · 84 lu (R. 232-18) |
| 10 | 10.9 Acompte sur dividende | L. 232-12 ; R. 232-17 ; L. 227-1 | **OK** |  | V6 · 55 (L. 232-12), 84 (R. 232-17), 50 (L. 227-1) lus ; v47 |
| 10 | 10.10 Dividende fictif | 5 ans + 375 000 € | **AMBIGU** | Contredit la fiche 5 (5.9). Le dividende fictif (civil) = toute distribution contraire à L. 232-11/12 ; le DÉLIT (5 ans + 375 000 €) exige en plus l'absence d'inventaire ou des inventaires frauduleux (L. 242-6 1°, L. 241-3 2°). Écrire : « Délit si absence d'inventaire ou inventaires frauduleux : 5 ans + 375 000 € ». | V6 · 55 lu (L. 232-12 dernier al.) ; V6 · 69, 67 lus ; v48 |
| 10 | 10.11 Répétition | 3 ans ; L. 232-17 ; L. 223-40 | **OK** |  | V6 · 56 lu (L. 232-17) ; V6 · 30 lu (L. 223-40 : trois ans) |
| 10 | 10.12 1. Décision | 4 mois ; publication | **OK** | Remarque : les en-têtes V6 de L. 223-42 et L. 225-248 citent « Conseil Constit. 2026-1213 QPC » (décision non lue) ; le texte imprimé (édition 27/10/2026) est celui de la fiche. | V6 · 47, 30 lus (L. 225-248, L. 223-42 : 4 mois) ; V6 · 81, 77 lus (R. 225-166, R. 223-36) ; v54 |
| 10 | 10.13 2. Régularisation | — | **OK** |  | V6 · 47, 30 lus |
| 10 | 10.14 3. Seuil | 2 exercices ; 1 % ; 37 000 € ; R. 223-37 ; R. 225-166-1 ; L. 224-2 | **OK** |  | V6 · 77-78 lus (R. 223-37 : 1 %) ; V6 · 81 lu (R. 225-166-1 b) ; V6 · 31 lu (L. 224-2 : 37 000 €) ; v55 |
| 10 | 10.15 4. Sanction | 6 mois | **OK** |  | V6 · 30-31, 47-48 lus (six mois ; sauvegarde/RJ) |
| 10 | 10.16 Capital minimum SA | 37 000 € ; L. 224-2 | **OK** |  | V6 · 31 lu |
| 10 | 10.17 Libération du numéraire | 5 ans ; L. 225-3 ; L. 225-144 | **OK** |  | V6 · 33 lu (L. 225-3 : moitié, 5 ans) ; V6 · 43 lu (L. 225-144 : quart + prime, 5 ans) |
| 10 | 10.18 Suppression du DPS | L. 225-135 | **OK** |  | V6 · 42 lu |
| 10 | 10.19 Résolution « salariés » | 3 % / triennale supprimée | **AMBIGU** | Incomplet, donc trompeur : l'obligation triennale (3 %) est supprimée, MAIS l'AGE doit toujours se prononcer sur un projet de résolution « salariés » lors de toute augmentation de capital en numéraire (L. 225-129-6 al. 1, sauf exceptions). Ajouter cette phrase. | V6 · 40 lu (L. 225-129-6) ; v58 |
| 10 | 10.20 Réduction de capital non motivée par des pertes | 20 jours ; 1 mois ; R. 225-152 ; R. 223-35 ; L. 225-204 | **OK** |  | V6 · 77 lu (R. 223-35 : un mois) ; V6 · 45 lu (L. 225-204) ; v62 (SA 20 jours, R. 225-152 non reproduit) |
| 11 | 11.1 Micro-BIC | 203 100 € ; 71 % ; 83 600 € ; 50 % ; 15 000 € ; 30 % ; 2026 ; 2028 ; 305 € ; CGI 50-0 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v72, v73 |
| 11 | 11.2 Micro-BNC | 83 600 € ; 34 % ; CGI 102 ter | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v72, v73 |
| 11 | 11.3 Plus-values du micro-entrepreneur | 151 ; CGI 50-0 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v74 |
| 11 | 11.4 Micro-social | — | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v78 |
| 11 | 11.5 Entrepreneur individuel | 2022 ; L. 526-22 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v70 |
| 11 | 11.6 IS | 25 % ; 15 % ; 42 500 € ; 10 M€ ; 75 % ; CGI 219 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v81 |
| 11 | 11.7 Groupe | 5 % ; 2 ans ; 1 % ; 95 % ; CGI 145 ; 216 ; 223 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v82 |
| 11 | 11.8 SEL | BNC (2035) depuis revenus 2024 | **OK** | Valeur conforme à v84 ; VERIF signale CE 8 avril 2025 n° 492154 ayant annulé certains commentaires BOFiP : à garder en tête. | v84 ; folio Mémento NON VÉRIFIABLE |
| 11 | 11.9 Mécénat d'entreprise | 60 % ; 2 M€ ; 40 % ; 20 000 € ; 5 ‰ ; CGI 238 bis | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v95 |
| 11 | 11.10 Dividendes | 12,8 % ; 17,2 % ; 40 % ; CGI 200 A ; 158 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v80 |
| 11 | 11.11 Plus-value de cession de titres | 2018 ; 150 ; 500 000 € ; CGI 150-0 D | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v92 (taux 150-0 D 1 quater laissés « à vérifier » : correct, v92 NON VÉRIFIABLE) |
| 11 | 11.12 Réduction IR-PME | 18 % ; 25 % ; 31/12/2027 ; 30 % ; 50 % ; 50 000 € ; 100 000 € ; 31/12 ; CGI 199 terdecies- | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v79 |
| 11 | 11.13 151 septies (petites entreprises) | 151 ; 5 ans ; 250 000 € ; 90 000 € ; 350 000 € ; 126 000 € ; 2 an | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v86 |
| 11 | 11.14 238 quindecies (transmission) | 238 ; 5 ans ; 500 000 € ; 1 M€ ; 700 000 € ; 1,2 M€ | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v87 |
| 11 | 11.15 151 septies A (départ à la retraite) | 151 ; 5 ans ; 2 ans ; 250 salariés ; 50 M€ ; 43 M€ | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v88 |
| 11 | 11.16 151 septies B (immeubles d'exploitation) | 151 ; 5 ans ; 10 % | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v89 |
| 11 | 11.17 Sans 5 ans, aucun de ces régimes. Le délai court depuis le d | 5 ans ; 2018 ; 12,8 % ; 17,2 % | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v90, v91 |
| 11 | 11.18 Cession de fonds de commerce | 0 % ; 23 000 € ; 3 % ; 200 000 € ; 5 % ; CGI 719 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v93 |
| 11 | 11.19 Cession de droits sociaux | 3 % ; 23 000 € ; 0,1 % ; 5 % ; CGI 726 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v94 |
| 11 | 11.20 SCI à l'IS | CGI 239 | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v83 |
| 11 | 11.21 Loueur meublé professionnel (LMP) | 23 000 € ; CGI 155 IV | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v85 |
| 11 | 11.22 Franchise en base de TVA | 85 000 € ; 37 500 € ; 93 500 € ; 41 250 € ; 50 000 € ; 35 000 € ; 1/1/2027 ; CGI 293 B | **OK** | Folio « Mémento » : NON VÉRIFIABLE dans les volumes (ouvrage externe). | v75 (avocats-auteurs 50 000 / 35 000) ; v76 ; v77 (taux TVA NON VÉRIFIABLE, laissé « à vérifier ») |
| 12 | 12.1 Acceptation | 210 ; art. 21 | **OK** |  | V1 · 8 (NEP 210) ; V4 · 7-8 (art. 21-22) lus |
| 12 | 12.2 Connaissance de l'entité, risques | 315 ; 19/11/2024 | **OK** |  | V1 · 23 lu (arrêté 13/11/2024, JO 19/11/2024, exercices ouverts à compter de la publication) ; V1 · 1 |
| 12 | 12.3 Seuil de signification | 320 | **OK** |  | V1 · 31 lu |
| 12 | 12.4 Réponse aux risques | 330 ; 19/11/2024 | **OK** |  | V1 · 34 lu (idem 315) ; V1 · 1 |
| 12 | 12.5 Fraude ; textes légaux | 240 ; 250 ; L. 821-10 | **OK** |  | V1 · 12, 16 lus |
| 12 | 12.6 Éléments probants | 500 ; 505 ; 520 ; 530 | **OK** |  | V1 · 42, 46, 50, 51 lus |
| 12 | 12.7 Anomalies | 450 | **OK** |  | V1 · 39 lu |
| 12 | 12.8 Fin de mission | 560 ; 570 ; 580 | **OK** |  | V1 · 63, 66, 68 lus |
| 12 | 12.9 Groupe | 600 ; 04/11/2025 | **OK** |  | V1 · 70 lu (arrêté 29/10/2025, JO 04/11/2025) ; V1 · 2 |
| 12 | 12.10 Rapport | arrêté 28/12/2023 | **OK** | Conforme à V1 (NEP 700 : arrêté du 28/12/2023, JO 31/12/2023). VERIF v107 évoque une « NEP 700 révisée » d'avril 2026 : V1 · 1 et V1 · 3 précisent que la NEP 700 révisée date de l'arrêté du 1/10/2018 ; la fiche suit V1, garder. | V1 · 87 lu ; V1 · 1-3 lus ; v107 |
| 12 | 12.11 Vérifications spécifiques | 9510 ; 20/04/2026 ; 26/04/2026 | **OK** |  | V1 · 121 lu (arrêté 20/04/2026, JO 26/04/2026) ; V1 · 1 ; v107 |
| 12 | 12.12 LCB-FT | 9605 ; NEP 9505 ; 1/10/2018 | **OK** |  | V1 · 129 ; V1 · 3 lu (NEP 9505 abrogée, arrêté 1/10/2018) |
| 12 | 12.13 réalité ; exhaustivité ; mesure ; séparation des exercices ; | — | **OK** |  | V1 · 43 lu (§09 assertions, §10 techniques) |
| 12 | 12.14 Sans réserve | — | **OK** |  | V1 · 87 lu |
| 12 | 12.15 Avec réserve | — | **OK** |  | V1 · 88 lu (§§ réserve : clairement circonscrites) |
| 12 | 12.16 Refus de certifier | — | **OK** |  | V1 · 88 lu |
| 12 | 12.17 Impossibilité de certifier | — | **OK** |  | V1 · 88 lu |
| 12 | 12.18 Observation | — | **OK** |  | V1 · 87 lu (§07 : partie distincte avant la justification ; changement de méthode) |
| 12 | 12.19 1 | — | **AMBIGU** | « organe de nomination … dirigeants pour ALPE » : le CAC ALPE est nommé par l'AGO comme les autres ; les dirigeants sont seulement destinataires du rapport sur les risques (L. 821-57, R. 821-183). Écrire « destinataire : AGO ; rapport ALPE sur les risques : dirigeants ». | V2 · 44 lu (L. 821-57) ; V6 · 92 lu (R. 821-183) |
| 12 | 12.20 2 | — | **OK** |  | Méthode, pas de valeur |
| 12 | 12.21 3 | — | **OK** |  | Méthode, pas de valeur |
| 12 | 12.22 4 | — | **OK** |  | Méthode, pas de valeur |

## Contradictions entre fiches et avec `data/items.json`

| # | Où | Contradiction | À faire |
|---|---|---|---|
| C1 | 5.9 ↔ 10.10 | 5.9 : le délit de dividende fictif suppose l'« absence d'inventaire ou [un] inventaire frauduleux ». 10.10 : « toute distribution contraire à ces règles. Délit ». | Aligner 10.10 sur 5.9 (L. 242-6 1°, L. 241-3 2°, V6 · 69, 67). |
| C2 | 1.7 ↔ R. 612-1 ; `items.json` « mandat » | 1.7 et items.json disent « le mandat en cours va à son terme », sans exception. Pour les associations, R. 612-1 dit le contraire : l'organe délibérant met fin au mandat. | Corriger 1.7. Dans items.json, réserver la phrase aux sociétés. |
| C3 | 5.5 ↔ `items.json` « revelation » | items.json : non-dépôt = contravention « à signaler, pas à révéler ». 5.5 : « position CNCC à vérifier ». | Trancher dans le Mémento Audit, puis harmoniser les deux. |
| C4 | 2.21 ↔ VERIF v38 | 2.21 cite « D. 221-5 al. 2 », VERIF « al. 3 ». | Citer « D. 221-5 » sans alinéa. |
| C5 | 4.4 ↔ 8.4 | Pas de contradiction, mais 8.4 omet le délai réglementaire (« dans le mois de la clôture », R. 225-30) donné en 4.4. | Facultatif : ajouter « R. 225-30 » en 8.4. |
| C6 | 2.3 ↔ brochure V2 · 37 | La fiche (conforme à VERIF v5/v29) écrit L. 821-41 = ex L. 823-2. La brochure imprime « ancien article L. 823-1 ». | Rien à corriger dans la fiche. Savoir que la brochure diverge. |
| C7 | 12.10 ↔ VERIF v107 | VERIF évoque une « NEP 700 révisée » d'avril 2026. V1 · 1, 3 et 87 donnent NEP 700 = arrêté du 28/12/2023 et rattachent la NEP 700 révisée à l'arrêté du 1/10/2018. La fiche suit V1. | Garder la fiche. La formulation de VERIF v107 est ambiguë. |

Aucune autre contradiction chiffrée entre fiches. Les doublons suivants sont cohérents : seuils 1 ↔ 2 ; micro-BIC et TVA 1 ↔ 11 ; IS 1 ↔ 11 ; EIP 2.17 ↔ 7.9 ; ALPE 2.15 ↔ 3.12 ↔ 8.13 ; dépôt 5.5 ↔ 10.3 ; capitaux propres 6.14 ↔ 10.12-10.15 ; peines 4.8 ↔ 5.10 ; acompte 3.8 ↔ 10.9. Les items de `data/items.json` (seuils, mandat, convocation, peines, micro, plus-values, dividendes) concordent avec les fiches, sauf C2 et C3.

## Formulations ambiguës ou trompeuses (rappel des lignes AMBIGU)

1. **2.17 / 7.9** : « EIP : 10 ans maximum » omet le renouvellement de 6 exercices après procédure de sélection (L. 821-45 I al. 2) et la prolongation de 2 ans par la H2A.
2. **5.5 / 10.3** : le dépôt des comptes par une SNC (L. 232-21) est présenté comme général. Il ne vise que les SNC dont tous les associés indéfiniment responsables sont des SARL ou des sociétés par actions.
3. **10.10** : délit de dividende fictif présenté sans sa condition (voir C1).
4. **10.19** : « obligation supprimée par la loi PACTE ». Le candidat peut croire qu'aucune résolution « salariés » n'est due. Or elle reste obligatoire lors de toute augmentation de capital en numéraire.
5. **8.1 (en-tête « SARL (et EURL) »)** : dans l'EURL, une convention avec l'associé unique donne seulement lieu à une mention au registre. Il n'y a ni rapport ni vote.
6. **8.4 (SARL)** : « non fixées par L. 223-19 » laisse croire qu'aucun délai n'existe. La partie réglementaire (R. 223-17, absent des volumes) prévoit un avis dans le mois. À vérifier.
7. **12.19** : « organe de nomination … dirigeants pour ALPE ». Le CAC ALPE est nommé par l'AGO. Les dirigeants sont seulement destinataires du rapport sur les risques.
8. **1.11** : non-publication du compte de résultat d'une petite entreprise, sans l'exclusion des sociétés appartenant à un groupe (fiche 10.5 la donne).
9. **1.7** : voir C2 (classé ERREUR, car la règle est fausse pour les associations).

Points d'attention sans erreur dans la fiche :
- Les en-têtes V6 de L. 223-42 et L. 225-248 citent la décision « Conseil Constit. 2026-1213 QPC ». Elle n'a pas été lue. Le texte imprimé (édition du 27/10/2026) est bien celui que reprennent les fiches 6.14 et 10.12-10.15.
- Les montants 1 500 € / 3 000 € (5.5, 10.4) sont exacts (v52) mais ne figurent pas en V6 · 85 : R. 247-3 renvoie à l'art. 131-13 5° du Code pénal.
- « ex L. 820-4 / L. 820-7 / L. 820-3-1 » (4.8, 4.11, 4.15) sont des anciens numéros. V2 · 8-9 contient de **nouveaux** articles L. 820-x sans rapport : ne pas les confondre en salle.
- Folios incomplets, mais exacts : 1.1 (ajouter V6 · 46, 52, 29, 22), 1.5 (ajouter V6 · 70-71), 1.8 (ajouter V6 · 87).

## Résumé chiffré

- Lignes contrôlées : **223 / 223** (12 fiches, 100 %). Environ **600 valeurs** (≈ 355 références, ≈ 247 chiffres) et **≈ 315 folios** contrôlés.
- **OK : 211** lignes, dont 31 dont la valeur est conforme à VERIF mais dont le folio « Mémento » n'est pas vérifiable, et 9 avec une remarque (folio incomplet ou précision utile).
- **ERREUR : 2** :
  - 1.7 : sortie de l'obligation pour les associations. Le mandat prend fin, il ne « va pas à son terme ».
  - 2.21 : alinéa de D. 221-5.
- **FOLIO FAUX : 0** : chaque folio V1, V2, V4, V5 et V6 cité contient bien le texte invoqué.
- **AMBIGU : 10** : 1.11, 2.17, 5.5, 7.9, 8.1, 8.4, 10.3, 10.10, 10.19, 12.19.
- **NON VÉRIFIABLE : 0** ligne entière. Deux éléments ponctuels ne sont pas vérifiables : R. 223-17 en 8.4, et les taux de TVA et de l'abattement renforcé, que la fiche laisse déjà « à vérifier ».
- Contradictions : 2 entre fiches ou avec items.json (C1, C2), 1 avec items.json (C3), 1 avec VERIF (C4).
- Priorité avant impression : 1.7 → 10.10 → 5.5/10.3 → 10.19 → 2.17/7.9 → 12.19 → 8.1/8.4 → 2.21 → 1.11.
