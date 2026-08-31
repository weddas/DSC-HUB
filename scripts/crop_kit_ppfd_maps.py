#!/usr/bin/env python3
"""Border-crop kit PPFD maps (trim uniform marketing margins)."""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
DIRS = [
    ROOT / "homeassistant" / "www" / "dsc-catalog" / "ppfd",
    ROOT / "homeassistant" / "custom_components" / "dsc_hub" / "frontend" / "public" / "dsc-catalog" / "ppfd",
    ROOT / "homeassistant" / "custom_components" / "dsc_hub" / "frontend" / "spa-dist" / "dsc-catalog" / "ppfd",
]


def crop_one(path: Path) -> None:
    im = Image.open(path).convert("RGB")
    bg = Image.new("RGB", im.size, im.getpixel((0, 0)))
    bbox = ImageChops.difference(im, bg).getbbox()
    if not bbox:
        bg = Image.new("RGB", im.size, im.getpixel((im.width - 1, im.height - 1)))
        bbox = ImageChops.difference(im, bg).getbbox()
    if bbox:
        pad = 4
        l, t, r, b = bbox
        cropped = im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))
    else:
        cropped = im
    max_w = 1200
    if cropped.width > max_w:
        h = int(cropped.height * max_w / cropped.width)
        cropped = cropped.resize((max_w, h), Image.Resampling.LANCZOS)
    cropped.save(path, quality=88, optimize=True)
    print(path.name, "->", cropped.size, path.stat().st_size)


def main() -> None:
    primary = DIRS[0]
    for p in sorted(primary.glob("*.jpg")):
        crop_one(p)
    # sync copies
    for dest in DIRS[1:]:
        if not dest.exists():
            continue
        for p in primary.glob("*"):
            target = dest / p.name
            target.write_bytes(p.read_bytes())
            print("sync", target)


if __name__ == "__main__":
    main()
