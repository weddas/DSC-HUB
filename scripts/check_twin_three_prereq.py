#!/usr/bin/env python3
"""Twin /live/twin loads dsc-the-dash-card, which requires a THREE global.

Fail if the Pi SPA loader omits vendor/three.min.js before the dash IIFE.
THREE must be on the page before the card renders, or the scene paints
'THREE.js not loaded — redeploy DSC-HUB bundle.'
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOADER = ROOT / "frontend/src/lib/ensureLocalCards.ts"


def _fail(msg: str) -> int:
    print(f"FAIL: {msg}", file=sys.stderr)
    return 1


def main() -> int:
    if not LOADER.is_file():
        return _fail(f"missing loader {LOADER}")

    loader = LOADER.read_text(encoding="utf-8")
    if "/vendor/three.min.js" not in loader:
        return _fail("ensureLocalCards.ts must reference /vendor/three.min.js for Pi mode")

    dash_block = re.search(
        r'"dsc-the-dash-card"\s*:\s*PI_MODE\s*\?\s*\[(.*?)\]\s*:',
        loader,
        flags=re.S,
    )
    if not dash_block:
        # Fallback: any dsc-the-dash-card script list
        dash_block = re.search(
            r'"dsc-the-dash-card"\s*:\s*\[(.*?)\]',
            loader,
            flags=re.S,
        )
    if not dash_block:
        return _fail("dsc-the-dash-card script list missing in ensureLocalCards.ts")

    scripts = dash_block.group(1)
    three_token = "THREE_JS" if "THREE_JS" in scripts else "/vendor/three.min.js"
    if three_token not in scripts:
        return _fail(
            "dsc-the-dash-card must load /vendor/three.min.js before the card IIFE"
        )
    three_at = scripts.index(three_token)
    card_at = scripts.find("dsc-the-dash-card.js")
    if card_at < 0:
        return _fail("dsc-the-dash-card.js missing from its own script list")
    if three_at > card_at:
        return _fail("three.min.js must be listed before dsc-the-dash-card.js")
    if "function hasThree" not in loader:
        return _fail("loader must check the THREE global before treating the dash card as ready")

    print("OK: Twin THREE prerequisite is wired in the Pi SPA loader.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
