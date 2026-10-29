#!/usr/bin/env python3
"""Contrôle de data/index_prerempli.json : python3 -I kit_src/check_index.py

Pour chaque entrée V1-V6, vérifie sur la page imprimée (folio « Vx · n » = page n du PDF) :
  1. que le folio de la page est bien « Vx · ref » ;
  2. que le « texte » y figure ;
  3. que le texte y COMMENCE (et n'y est pas seulement cité) :
     V1  « NEP 570 »        → titre « NEP 570 - » sur la page ;
         « NEP 570 § 16 »   → pied « NEP 570 — » et paragraphe « 16. » en début de ligne ;
     V2  « L. 821-44 »      → en-tête « Art. L. 821-44 » ou « Article L. 821-44 » ; autre texte → titre de la page ;
     V3  « 122-5 »          → en-tête « Art. 122-5 » en début de ligne ;
     V4  « Article 151 »    → en-tête « Article 151 » seul en début de ligne ;
         autre texte        → présent dans les 12 premières lignes (titre de la norme) ;
     V5  texte              → présent dans les 15 premières lignes (titre de la norme) ;
     V6  « L. 225-38 »      → en-tête d'article de l'édition codes.droit.org (« L. 225-38   <texte modificatif> »).
Vérifie aussi les champs, l'unicité des id, le tri alphabétique, les codes thème (taxonomie.md),
qu'aucune entrée Mémento / hors kit ne porte de folio et qu'aucune entrée ne cite la NEP 705.
Sort avec le code 1 s'il y a au moins une anomalie.
"""
import json, re, subprocess, sys, unicodedata, functools

ROOT = '/home/user/dec-revision-'
VOL = {'V1': 'V1_NEP', 'V2': 'V2_Livre_VIII_CNCC', 'V3': 'V3_PCG', 'V4': 'V4_Deontologie',
       'V5': 'V5_Referentiel_OEC', 'V6': 'V6_Textes_choisis'}
NOFOLIO = {'Mémento Fiscal', 'Mémento Sociétés', 'Mémento Audit', 'Hors kit'}


@functools.lru_cache(None)
def pages(v):
    t = subprocess.run(['pdftotext', '-layout', f'{ROOT}/imprimer/{VOL[v]}.pdf', '-'],
                       capture_output=True, text=True, check=True).stdout
    return t.split('\f')


def flat(s):
    """Espaces normalisés ; « L. 821- 45 » → « L. 821-45 »."""
    s = re.sub(r'\s+', ' ', s)
    return re.sub(r'(\d)\s*-\s*(\d)', r'\1-\2', s)


def num_rx(n):
    """Numéro d'article non suivi d'un autre chiffre ni d'un « -chiffre » (L. 232-1 ≠ L. 232-12)."""
    return re.escape(n).replace(r'\ ', r'\s*') + r'(?![\d])(?!\s*-\s*\d)'


def themes():
    t = open(f'{ROOT}/docs/data/taxonomie.md', encoding='utf-8').read()
    bloc = t.split('liste fermée :', 1)[1].split('\n\n', 1)[0]
    return {c.strip().rstrip('.') for c in bloc.split(',') if c.strip()}


def check_page(v, ref, texte):
    """Retourne None si OK, sinon le motif de l'anomalie."""
    p = pages(v)
    n = int(ref)
    if not 1 <= n <= len(p) - 1:
        return f'folio {ref} hors volume ({len(p) - 1} p.)'
    raw = p[n - 1]
    if not re.search(rf'{v}\s*·\s*{n}(?!\d)', raw):
        return f'folio « {v} · {n} » absent de la page'
    page = flat(raw)
    para = None
    m = re.fullmatch(r'(.+?) § (\d+)', texte)
    if m:
        texte, para = m.group(1), m.group(2)
    if not re.search(num_rx(texte), page, re.I):
        return f'« {texte} » absent de la page'
    if v == 'V1':
        if para:
            if not re.search(rf'{num_rx(texte)}\s*—', page):
                return f'page hors de la {texte}'
            if not re.search(rf'(?m)^\s*{para}\.\s', raw):
                return f'§ {para} ne commence pas sur la page'
        elif not re.search(rf'(?m)^\s*{num_rx(texte)} - ', raw):
            return f'la {texte} ne commence pas sur la page'
    elif v == 'V2' and not texte.startswith('L.'):
        head = flat('\n'.join([l for l in raw.splitlines() if l.strip()][:6]))
        if texte not in head:
            return f'« {texte} » absent du titre de la page'
    elif v == 'V2':
        if not re.search(r'Art(?:icle|\.)\s*' + num_rx(texte), page):
            return f'en-tête « Art. {texte} » absent (simple citation ?)'
    elif v == 'V3':
        if not re.search(r'(?m)^\s*Art(?:icle|\.)?\s*' + num_rx(texte), raw):
            return f'en-tête « Art. {texte} » absent (simple citation ?)'
    elif v == 'V4':
        if texte.startswith('Article '):
            if not re.search(r'(?m)^\s*' + re.escape(texte) + r'\s*$', raw):
                return f'en-tête « {texte} » absent (simple citation ?)'
        else:
            head = flat('\n'.join([l for l in raw.splitlines() if l.strip()][:12]))
            if texte not in head:
                return f'« {texte} » absent du titre de la page'
    elif v == 'V5':
        head = flat('\n'.join([l for l in raw.splitlines() if l.strip()][:15]))
        if texte not in head:
            return f'« {texte} » absent du titre de la page'
    elif v == 'V6':
        if not re.search(r'(?m)^\s{0,4}' + num_rx(texte) + r'\s{3,}\S', raw):
            return f'en-tête d\'article « {texte} » absent (simple citation ?)'
    return None


def main():
    data = json.load(open(f'{ROOT}/data/index_prerempli.json', encoding='utf-8'))
    E = data['entrees']
    codes = themes()
    anomalies, ok = [], 0
    ids = [e.get('id') for e in E]
    if len(set(ids)) != len(ids):
        anomalies.append('id en double')
    def k(s):
        s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
        return re.sub(r'[^a-z0-9 ]', ' ', s).split()
    if [k(e['motcle']) for e in E] != sorted(k(e['motcle']) for e in E):
        anomalies.append('entrées non triées alphabétiquement')
    for e in E:
        tag = f"{e.get('id')} « {e.get('motcle')} »"
        if set(e) != {'id', 'motcle', 'volume', 'ref', 'texte', 'theme'}:
            anomalies.append(f'{tag} : champs {sorted(e)}'); continue
        if e['theme'] not in codes:
            anomalies.append(f"{tag} : thème inconnu {e['theme']}")
        if re.search(r'NEP\s*705', e['motcle'] + e['texte']):
            anomalies.append(f'{tag} : NEP 705 (inexistante)')
        v = e['volume']
        if v in VOL:
            why = check_page(v, e['ref'], e['texte']) if e['ref'].isdigit() else f"ref « {e['ref']} » non numérique"
            if why:
                anomalies.append(f"{tag} : {v} · {e['ref']} — {why}")
            else:
                ok += 1
        elif v in NOFOLIO:
            if e['ref']:
                anomalies.append(f"{tag} : {v} doit avoir ref vide")
        else:
            anomalies.append(f'{tag} : volume inconnu {v}')
    n_vol = sum(e['volume'] in VOL for e in E)
    print(f"{len(E)} entrées ; V1-V6 : {n_vol} (vérifiées OK : {ok}) ; Mémentos / hors kit : {len(E) - n_vol}")
    for a in anomalies:
        print('ANOMALIE', a)
    print(f'{len(anomalies)} anomalie(s)')
    sys.exit(1 if anomalies else 0)


if __name__ == '__main__':
    main()
