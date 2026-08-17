#!/usr/bin/env python3
"""Twin /live/twin loads dsc-the-dash-card, which requires a THREE global.

Fail if the React loader or ha-sync omit vendor/three.min.js. The dedicated
dash IIFE is not a fat bundle — THREE must be on the page before the card
renders, or the scene paints 'THREE.js not loaded — redeploy DSC-HUB bundle.'
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOADER = ROOT / "homeassistant/custom_components/dsc_hub/frontend/src/lib/ensureLocalCards.ts"
HA_SYNC = ROOT / "scripts/ha-sync.sh"


def _fail(msg: str) -> int:
    print(f"FAIL: {msg}", file=sys.stderr)
    return 1


def main() -> int:
    loader = LOADER.read_text(encoding="utf-8")
    if "/local/vendor/three.min.js" not in loader:
        return _fail("ensureLocalCards.ts must reference /local/vendor/three.min.js")
    dash_block = re.search(
        r'"dsc-the-dash-card"\s*:\s*\[(.*?)\]',
        loader,
        flags=re.S,
    )
    if not dash_block:
        return _fail("dsc-the-dash-card script list missing in ensureLocalCards.ts")
    scripts = dash_block.group(1)
    three_token = "THREE_JS" if "THREE_JS" in scripts else "/local/vendor/three.min.js"
    if three_token not in scripts:
        return _fail(
            "dsc-the-dash-card must load /local/vendor/three.min.js before the card IIFE"
        )
    three_at = scripts.index(three_token)
    card_at = scripts.find("/local/dsc-the-dash-card.js")
    if card_at < 0:
        return _fail("dsc-the-dash-card.js missing from its own script list")
    if three_at > card_at:
        return _fail("three.min.js must be listed before dsc-the-dash-card.js")
    if "function hasThree" not in loader:
        return _fail("loader must check the THREE global before treating the dash card as ready")

    sync = HA_SYNC.read_text(encoding="utf-8")
    if "www/vendor/three.min.js" not in sync:
        return _fail("ha-sync.sh must publish /config/www/vendor/three.min.js")
    print("OK: Twin THREE prerequisite is wired in the loader and ha-sync.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
