#!/usr/bin/env python3
"""Icônes PWA 192 et 512 px (Pillow) : une loupe sur une page de comptes, « DEC 2 »."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "icons"
OUT.mkdir(exist_ok=True)

def icon(size):
    im = Image.new("RGBA", (size, size), (20, 83, 45, 255))
    d = ImageDraw.Draw(im)
    W = (248, 250, 252)
    d.rounded_rectangle([size * .08, size * .08, size * .92, size * .92], radius=size // 5, fill=(22, 101, 52, 255))
    w = max(2, size // 40)
    # page
    d.rounded_rectangle([size * .24, size * .18, size * .62, size * .64], radius=size // 40, outline=W, width=w)
    for i in range(4):
        y = size * (.28 + i * .08)
        d.line([(size * .30, y), (size * .56, y)], fill=W, width=max(1, w // 2))
    # loupe
    d.ellipse([size * .48, size * .40, size * .72, size * .64], outline=(250, 204, 21), width=w * 2)
    d.line([(size * .69, size * .61), (size * .78, size * .70)], fill=(250, 204, 21), width=w * 2)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * .15))
    except OSError:
        font = ImageFont.load_default()
    t = "DEC 2"
    bb = d.textbbox((0, 0), t, font=font)
    d.text(((size - (bb[2] - bb[0])) / 2, size * .72), t, font=font, fill=W)
    return im

for s in (192, 512):
    icon(s).save(OUT / f"icon-{s}.png")
print("icônes générées")
