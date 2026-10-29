"""Ajoute un folio uniforme « Vx · n » en haut de page, côté extérieur (droite au recto, gauche au verso)."""
import io, sys
from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.pdfgen import canvas

def overlay(w, h, label, right):
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=(w, h))
    c.setFont('Helvetica-Bold', 9)
    tw = c.stringWidth(label, 'Helvetica-Bold', 9)
    x = w - tw - 16 if right else 16
    y = h - 15
    c.setFillColorRGB(1, 1, 1); c.rect(x - 3, y - 2, tw + 6, 11, fill=1, stroke=0)
    c.setFillColorRGB(.1, .1, .1); c.drawString(x, y, label)
    c.save(); buf.seek(0)
    return PdfReader(buf).pages[0]

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
