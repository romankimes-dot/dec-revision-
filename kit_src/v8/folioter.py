"""Folio « V8 · n » posé sur les pages du PDF rendu par Chromium (flux non partagés), polices dédoublonnées.
python3 -I kit_src/v8/folioter.py entree.pdf imprimer/V8_Fiscal_choisi.pdf"""
import sys
sys.path.insert(0, __file__.rsplit('/kit_src/', 1)[0] + '/scripts')
from pypdf import PdfWriter
from folioter import overlay

src, dst = sys.argv[1:3]
w = PdfWriter(clone_from=src)
for i, p in enumerate(w.pages, 1):
    b = p.mediabox
    p.merge_page(overlay(float(b.width), float(b.height), f'V8 · {i}', i % 2 == 1))
    p.compress_content_streams()
w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
w.write(dst)
print('V8', len(w.pages), 'pages')
