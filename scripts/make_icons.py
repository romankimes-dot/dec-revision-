#!/usr/bin/env python3
"""Icônes PWA 192 et 512 px (Pillow). Même gabarit que l'app UE1 (Dec-Deonto) : fond ardoise, tuile arrondie,
pictogramme blanc au trait, « DEC 2 » à la même place. Seules la couleur de tuile (émeraude au lieu de bleu)
et le pictogramme (page de comptes sous la loupe au lieu de la balance) changent."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "icons"
OUT.mkdir(exist_ok=True)
FOND = (15, 23, 42, 255)      # identique à UE1
TUILE = (4, 120, 87, 255)     # émeraude, même luminosité que le bleu UE1 (30, 64, 175)
W = (248, 250, 252)           # identique à UE1


def icon(size: int) -> Image.Image:
    im = Image.new("RGBA", (size, size), FOND)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([size * 0.08, size * 0.08, size * 0.92, size * 0.92], radius=size // 5, fill=TUILE)
    w = max(2, size // 40)  # même épaisseur de trait que UE1
    # Page de comptes, dans la même zone que la balance UE1 (haut ≈ 0,30 ; bas ≈ 0,66)
    x0, y0, x1, y1 = size * 0.27, size * 0.24, size * 0.58, size * 0.66
    d.rectangle([x0, y0, x1, y1], outline=W, width=w)
    for i in range(4):
        y = size * (0.33 + i * 0.075)
        d.line([(size * 0.33, y), (size * 0.52, y)], fill=W, width=w)
    # Loupe
    cx, cy, r = size * 0.62, size * 0.52, size * 0.10
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=TUILE, outline=W, width=w + w // 2)
    d.line([(cx + r * 0.72, cy + r * 0.72), (size * 0.78, size * 0.68)], fill=W, width=w * 2)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.17))
    except OSError:
        font = ImageFont.load_default()
    txt = "DEC 2"
    bb = d.textbbox((0, 0), txt, font=font)
    d.text(((size - (bb[2] - bb[0])) / 2, size * 0.70), txt, font=font, fill=W)
    return im


for s in (192, 512):
    icon(s).save(OUT / f"icon-{s}.png")
icon(180).save(OUT / "ue2-touch-180.png")
print("icônes générées dans", OUT)
