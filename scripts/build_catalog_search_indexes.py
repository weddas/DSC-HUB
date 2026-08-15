#!/usr/bin/env python3
"""Pull CannaLib search indexes into Hub www + dist.

CannaLib owns the corpus and the builder. This repo only consumes:

1. Live catalog — HA cards hit https://cannalib.plausible-deniability.net
2. Capped offline JSON — copied from CannaLib/publish/dsc-catalog/

Usage (from DSC-HUB):

  python scripts/build_catalog_search_indexes.py

Rebuilds CannaLib indexes (passing this repo's curated YAML as --extra-data),
then copies publish/*.json into homeassistant/www/dsc-catalog/ and dist/.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

HUB = Path(__file__).resolve().parents[1]
CANNALIB = HUB.parent / "CannaLib"
BUILDER = CANNALIB / "scripts" / "build_catalog_search_indexes.py"
PUBLISH = CANNALIB / "publish" / "dsc-catalog"
HUB_DATA = HUB / "homeassistant" / "data"
HUB_WWW = HUB / "homeassistant" / "www" / "dsc-catalog"
HUB_DIST = HUB / "dist" / "dsc-catalog"


def main() -> int:
    if not BUILDER.is_file():
        print(f"CannaLib builder missing: {BUILDER}", file=sys.stderr)
        print("Clone weddas/CannaLib as a sibling of DSC-HUB.", file=sys.stderr)
        return 1
    extra = sys.argv[1:]
    cmd = [sys.executable, str(BUILDER), *extra]
    if HUB_DATA.is_dir() and "--extra-data" not in extra:
        cmd.extend(["--extra-data", str(HUB_DATA)])
    rc = subprocess.call(cmd, cwd=str(CANNALIB))
    if rc != 0:
        return rc
    if not PUBLISH.is_dir():
        print(f"CannaLib publish dir missing: {PUBLISH}", file=sys.stderr)
        return 1
    HUB_WWW.mkdir(parents=True, exist_ok=True)
    HUB_DIST.mkdir(parents=True, exist_ok=True)
    copied = 0
    for src in sorted(PUBLISH.glob("*.json")):
        shutil.copy2(src, HUB_WWW / src.name)
        shutil.copy2(src, HUB_DIST / src.name)
        copied += 1
        print("pulled", src.name)
    if copied == 0:
        print("no index JSON in CannaLib publish/", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
