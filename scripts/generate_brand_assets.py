"""Regenerate the web-ready Sindhoora logo crops from the ORIGINAL logo files.

The originals in public/assets/branding/ are never modified. Each derived .webp is a crop of an
original with its pure-black background converted to transparency (un-premultiplied against black,
so compositing on black reproduces the original pixels exactly).

Usage (from the frontend folder, requires Pillow):
    python scripts/generate_brand_assets.py
"""
from pathlib import Path

from PIL import Image

BRANDING = Path(__file__).resolve().parent.parent / "public" / "assets" / "branding"
PRIMARY = BRANDING / "sindhoora-logo-primary.jpg"
SIGNATURE = BRANDING / "sindhoora-logo-signature.jpg"

# Crop boxes (left, top, right, bottom) in the original 1254x1254 artwork.
PRIMARY_FULL = (66, 105, 1199, 1075)
SIGNATURE_FULL = (66, 105, 1199, 1229)
WORDMARK = (66, 711, 1199, 952)  # "SINDHOORA" + "JEWELS" rows
EMBLEM = (457, 105, 790, 651)  # the gold "S"


def black_to_alpha(img: Image.Image) -> Image.Image:
    src = img.convert("RGB")
    out = Image.new("RGBA", src.size)
    s, d = src.load(), out.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b = s[x, y]
            a = max(r, g, b)
            d[x, y] = (0, 0, 0, 0) if a <= 4 else (min(255, r * 255 // a), min(255, g * 255 // a), min(255, b * 255 // a), a)
    return out


def save_webp(img: Image.Image, name: str, width: int) -> None:
    img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(BRANDING / name, "WEBP", quality=86, alpha_quality=70, method=6)
    print(f"{name}: {img.size}")


def main() -> None:
    primary = Image.open(PRIMARY)
    signature = Image.open(SIGNATURE)

    save_webp(black_to_alpha(primary.crop(PRIMARY_FULL)), "sindhoora-primary.webp", 880)
    save_webp(black_to_alpha(signature.crop(SIGNATURE_FULL)), "sindhoora-signature.webp", 900)
    save_webp(black_to_alpha(primary.crop(WORDMARK)), "sindhoora-wordmark.webp", 600)
    save_webp(black_to_alpha(primary.crop(EMBLEM)), "sindhoora-emblem.webp", 240)

    emblem = primary.crop(EMBLEM)
    for size, name in ((64, "favicon.png"), (180, "apple-touch-icon.png")):
        canvas = Image.new("RGB", (size, size), (0, 0, 0))
        h = round(size * 0.84)
        w = round(emblem.width * h / emblem.height)
        canvas.paste(emblem.resize((w, h), Image.LANCZOS), ((size - w) // 2, (size - h) // 2))
        canvas.save(BRANDING / name)
        print(f"{name}: {canvas.size}")


if __name__ == "__main__":
    main()
