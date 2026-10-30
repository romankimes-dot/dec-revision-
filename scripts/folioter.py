"""Ajoute un folio uniforme « Vx · n » en haut de page, côté extérieur (droite au recto, gauche au verso).
Repositionner les folios déjà posés : python scripts/folioter.py --refolio [--sans-reduction] fichier.pdf [...]"""
import io, re, sys
from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.generic import ContentStream
from reportlab.pdfgen import canvas

MARGE_X, MARGE_Y = 16, 15   # folio de la pose d'origine
# Folios repositionnés : plus loin du bord ; la page source est réduite pour libérer une bande en haut.
REF_X, REF_Y, ECHELLE, BANDE = 30, 30, .94, 38

def overlay(w, h, label, right, mx=MARGE_X, my=MARGE_Y):
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=(w, h))
    c.setFont('Helvetica-Bold', 9)
    tw = c.stringWidth(label, 'Helvetica-Bold', 9)
    x = w - tw - mx if right else mx
    y = h - my
    c.setFillColorRGB(1, 1, 1); c.rect(x - 3, y - 2, tw + 6, 11, fill=1, stroke=0)
    c.setFillColorRGB(.1, .1, .1); c.drawString(x, y, label)
    c.save(); buf.seek(0)
    return PdfReader(buf).pages[0]

POSE = re.compile(rb'q\n0\.0 0\.0 [\d.]+ [\d.]+ re\nW\nn\n1 0 0 1 0 0 cm\nBT\n/F\S+ 12 Tf\n.{0,300}?\((V\d \\267 \d+)\) Tj\nT\*\nET\nQ\n$', re.S)

def refolio(path, reduire=True):
    """Retire le folio posé en surcouche (en gardant son numéro) et le repose plus loin du bord.
    reduire : la page est réduite à ECHELLE et calée à BANDE pt du haut, pour que le folio ne masque rien."""
    r = PdfWriter(clone_from=path); wr = PdfWriter()
    for i, p in enumerate(r.pages, start=1):
        d = p.get_contents().get_data(); m = POSE.search(d)
        if not m: raise SystemExit(f'{path} p. {i} : folio introuvable')
        cs = ContentStream(None, r); cs.set_data(d[:m.start()]); p.replace_contents(cs)
        w, h = float(p.mediabox.width), float(p.mediabox.height)
        t = Transformation().scale(ECHELLE).translate(w * (1 - ECHELLE) / 2, h * (1 - ECHELLE) - BANDE) if reduire else Transformation()
        np_ = wr.add_blank_page(width=w, height=h)
        np_.merge_transformed_page(p, t)
        np_.merge_page(overlay(w, h, m.group(1).decode('latin-1').replace('\\267', '\xb7'), i % 2 == 1, REF_X, REF_Y))
    wr.compress_identical_objects()
    with open(path, 'wb') as f: wr.write(f)
    print(path, len(r.pages), 'folios repositionnés', '(page réduite)' if reduire else '')

if __name__ == '__main__' and sys.argv[1] == '--refolio':
    args = sys.argv[2:]; reduire = '--sans-reduction' not in args
    for f in (a for a in args if not a.startswith('--')): refolio(f, reduire)
elif __name__ == '__main__':
    src, dst, vol = sys.argv[1], sys.argv[2], sys.argv[3]
    r = PdfReader(src); wr = PdfWriter()
    for i, p in enumerate(r.pages, start=1):
        box = p.mediabox; w, h = float(box.width), float(box.height)
        rot = (p.get('/Rotate') or 0) % 360
        if rot in (90, 270): w, h = h, w
        if rot: p.transfer_rotation_to_content()
        x0, y0 = float(box.left), float(box.bottom)
        np_ = wr.add_blank_page(width=w, height=h)       # page neuve : aucun contenu partagé entre pages
        np_.merge_transformed_page(p, Transformation().translate(-x0, -y0))
        np_.merge_page(overlay(w, h, f'{vol} · {i}', i % 2 == 1))
    with open(dst, 'wb') as f: wr.write(f)
    print(vol, len(r.pages), 'pages')
