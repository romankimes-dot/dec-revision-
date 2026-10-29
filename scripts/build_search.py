"""Texte intégral des volumes V1-V8 et des fiches K2 / K4, page par page, pour la recherche « Trouver » de l'app.
python3 -I scripts/build_search.py  → data/search.json  (--check : vérifie qu'il est à jour)"""
import json, re, subprocess, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOLS = [('V1', 'V1_NEP', 'NEP'), ('V2', 'V2_Livre_VIII_CNCC', 'Livre VIII (CAC)'), ('V3', 'V3_PCG', 'PCG'),
        ('V4', 'V4_Deontologie', 'Déontologie'), ('V5', 'V5_Referentiel_OEC', 'Référentiel OEC'),
        ('V6', 'V6_Textes_choisis', 'Textes choisis'), ('V7', 'V7_Annales', 'Annales'), ('V8', 'V8_Fiscal_choisi', 'Fiscal choisi'),
        ('K2', 'K2_Fiches_de_synthese', 'Fiches de synthèse'), ('K4', 'K4_Trames_de_reponse', 'Trames de réponse')]


def pages(pdf):
    t = subprocess.run(['pdftotext', '-enc', 'UTF-8', pdf, '-'], capture_output=True, text=True, check=True).stdout
    return t.split('\f')[:-1] if t.endswith('\f') else t.split('\f')


def clean(t, v, n):
    t = t.replace('­', '').replace('‐', '-')
    t = re.sub(r'(\w)[-‐]\n(\w)', r'\1\2', t)              # césures de fin de ligne
    t = re.sub(rf'(?m)^\s*{v} · {n}\s*$', '', t)             # folio
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def build():
    out = {'version': 1, 'vols': {}, 'pages': []}
    for v, f, titre in VOLS:
        pdf = f'{ROOT}/imprimer/{f}.pdf'
        ps = pages(pdf)
        out['vols'][v] = {'pdf': f'imprimer/{f}.pdf', 'titre': titre, 'n': len(ps)}
        for n, t in enumerate(ps, 1):
            t = clean(t, v, n)
            if len(t) > 40:
                out['pages'].append([v, n, t])
    return json.dumps(out, ensure_ascii=False, separators=(',', ':'))


if __name__ == '__main__':
    s = build(); dst = f'{ROOT}/data/search.json'
    if '--check' in sys.argv:
        ok = os.path.exists(dst) and open(dst, encoding='utf-8').read() == s
        print('recherche à jour' if ok else 'data/search.json à régénérer : python3 -I scripts/build_search.py'); sys.exit(0 if ok else 1)
    open(dst, 'w', encoding='utf-8').write(s)
    print(f'{len(s) / 1e6:.1f} Mo, {s.count("],[") + 1} pages')
