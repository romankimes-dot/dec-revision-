#!/usr/bin/env python3
"""Recherche de page dans les volumes tamponnés : python3 -I pages.py "motif regex" [V1 V2 ...]
Affiche, pour chaque volume, les folios (numéro « Vx · n ») des pages où le motif apparaît."""
import re, subprocess, sys, functools
VOL = {'V1': 'V1_NEP', 'V2': 'V2_Livre_VIII_CNCC', 'V3': 'V3_PCG', 'V4': 'V4_Deontologie', 'V5': 'V5_Referentiel_OEC', 'V6': 'V6_Textes_choisis', 'V7': 'V7_Annales'}
@functools.lru_cache(None)
def pages(v):
    t = subprocess.run(['pdftotext', '-layout', f'/home/user/dec-revision-/imprimer/{VOL[v]}.pdf', '-'], capture_output=True, text=True).stdout
    return t.split('\f')
def find(pattern, vols=None):
    rx = re.compile(pattern, re.I)
    return {v: [i + 1 for i, t in enumerate(pages(v)) if rx.search(re.sub(r'\s+', ' ', t))] for v in (vols or VOL)}
if __name__ == '__main__':
    for v, ps in find(sys.argv[1], sys.argv[2:] or None).items():
        if ps: print(v, ps[:40])
