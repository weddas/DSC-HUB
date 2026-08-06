#!/usr/bin/env python3
"""Clean PPFD / spectrum / beam map URL lists on light dumps (no invented grids).

Keeps only image/PDF assets; drops product-page false positives and tiny
WordPress thumbs when a larger sibling exists. Rewrites dumps in place and
prints before/after coverage.

Usage:
  python scripts/clean_light_map_assets.py
  python scripts/clean_light_map_assets.py --dump dsc_lights_spider_farmer.json
"""
from __future__ import annotations

import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"

IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg")
PDF_EXT = (".pdf",)
THUMB = re.compile(r"-\d{2,4}x\d{2,4}(?=\.(?:jpe?g|png|webp|gif))", re.I)
PPFD_HINT = re.compile(r"(?i)ppfd|par[\s_-]?map|intensity[\s_-]?map|umol|µmol")
SPEC_HINT = re.compile(r"(?i)spectrum|spd|spectral|wavelength|chromatic")
BEAM_HINT = re.compile(r"(?i)beam[\s_-]?map|polar|candela|ies|radiation[\s_-]?pattern")


def _ext(url: str) -> str:
    path = unquote(urlparse(url).path).lower()
    for e in IMG_EXT + PDF_EXT:
        if path.endswith(e):
            return e
    return ""


def _is_asset(url: str) -> bool:
    return bool(_ext(url))


def _base_key(url: str) -> str:
    path = unquote(urlparse(url).path)
    path = THUMB.sub("", path)
    return path.lower()


def _score(url: str, hint: re.Pattern[str]) -> tuple[int, int]:
    """Higher is better: hint match, then prefer non-thumb / longer path."""
    path = unquote(urlparse(url).path)
    hint_score = 2 if hint.search(path) or hint.search(url) else 0
    thumb_penalty = -1 if THUMB.search(path) else 1
    return (hint_score, thumb_penalty, len(path))


def clean_bucket(items: list | None, hint: re.Pattern[str]) -> list[dict]:
    if not items:
        return []
    by_key: dict[str, dict] = {}
    for raw in items:
        if not isinstance(raw, dict):
            continue
        url = (raw.get("url") or "").strip()
        if not url or not _is_asset(url):
            continue
        key = _base_key(url)
        prev = by_key.get(key)
        if prev is None or _score(url, hint) > _score(prev.get("url") or "", hint):
            row = dict(raw)
            row["url"] = url
            row["mime_hint"] = (
                "application/pdf"
                if _ext(url) == ".pdf"
                else f"image/{_ext(url).lstrip('.')}"
            )
            by_key[key] = row
    # Prefer hint-matching assets first
    out = list(by_key.values())
    out.sort(key=lambda r: _score(r.get("url") or "", hint), reverse=True)
    # Drop non-hint leftovers when we already have hint matches
    hinted = [r for r in out if hint.search(r.get("url") or "")]
    return hinted if hinted else out[:8]


def clean_product(row: dict) -> dict:
    row = dict(row)
    row["ppfd_maps"] = clean_bucket(row.get("ppfd_maps"), PPFD_HINT)
    row["spectrum_maps"] = clean_bucket(row.get("spectrum_maps"), SPEC_HINT)
    row["beam_maps"] = clean_bucket(row.get("beam_maps"), BEAM_HINT)
    return row


def coverage(rows: list[dict]) -> dict[str, int]:
    return {
        "wattage_w": sum(1 for r in rows if r.get("wattage_w") is not None),
        "ppf_umol_s": sum(1 for r in rows if r.get("ppf_umol_s") is not None),
        "efficacy_umol_j": sum(1 for r in rows if r.get("efficacy_umol_j") is not None),
        "ppfd_maps": sum(1 for r in rows if r.get("ppfd_maps")),
        "spectrum_maps": sum(1 for r in rows if r.get("spectrum_maps")),
        "beam_maps": sum(1 for r in rows if r.get("beam_maps")),
        "datasheets": sum(1 for r in rows if r.get("datasheets")),
        "ppfd_map_urls": sum(len(r.get("ppfd_maps") or []) for r in rows),
        "spectrum_map_urls": sum(len(r.get("spectrum_maps") or []) for r in rows),
    }


def process(path: Path) -> None:
    doc = json.loads(path.read_text(encoding="utf-8"))
    rows = list(doc.get("products") or [])
    before = coverage(rows)
    cleaned = [clean_product(r) for r in rows]
    after = coverage(cleaned)
    doc["products"] = cleaned
    doc["coverage"] = {k: after[k] for k in after if k in (
        "wattage_w", "ppf_umol_s", "efficacy_umol_j", "ppfd_maps",
        "spectrum_maps", "beam_maps", "datasheets",
    )}
    doc["map_cleanup"] = {
        "cleaned_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "before": before,
        "after": after,
        "note": "Dropped non-image/PDF map URLs and WordPress thumbs; no OCR / no invented grids.",
    }
    path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"{path.name}: PPFD rows {before['ppfd_maps']}→{after['ppfd_maps']} "
        f"urls {before['ppfd_map_urls']}→{after['ppfd_map_urls']}; "
        f"spectrum rows {before['spectrum_maps']}→{after['spectrum_maps']} "
        f"urls {before['spectrum_map_urls']}→{after['spectrum_map_urls']}"
    )


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dump", action="append", default=[], help="Specific dump filename(s)")
    args = ap.parse_args()
    if args.dump:
        paths = [DATA / n for n in args.dump]
    else:
        paths = sorted(
            p
            for p in DATA.glob("dsc_lights_*.json")
            if "checkpoint" not in p.name
        )
    for path in paths:
        if not path.exists():
            print(f"MISSING {path.name}")
            continue
        process(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
