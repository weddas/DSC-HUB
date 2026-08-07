#!/usr/bin/env python3
"""Quick Wave 2 missing-bank sitemap probe (dump-only discovery)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import polite_get  # noqa: E402

TARGETS = [
    ("gh_shop_robots", "https://shop.greenhouseseeds.nl/robots.txt"),
    ("gh_shop_sm", "https://shop.greenhouseseeds.nl/sitemap.xml"),
    ("gh_shop_prod", "https://shop.greenhouseseeds.nl/product-sitemap.xml"),
    ("gh_shop_home", "https://shop.greenhouseseeds.nl/"),
    ("fastbuds_robots", "https://fastbuds.com/robots.txt"),
    ("fastbuds_sm", "https://fastbuds.com/sitemap.xml"),
    ("fastbuds_home", "https://fastbuds.com/"),
    ("barneys_robots", "https://www.barneysfarm.com/robots.txt"),
    ("barneys_sm", "https://www.barneysfarm.com/sitemap.xml"),
    ("barneys_home", "https://www.barneysfarm.com/"),
    ("dutch_robots", "https://dutch-passion.com/robots.txt"),
    ("dutch_sm", "https://dutch-passion.com/sitemap.xml"),
    ("dutch_home", "https://dutch-passion.com/"),
    ("mephisto_robots", "https://mephistogenetics.com/robots.txt"),
    ("mephisto_sm", "https://mephistogenetics.com/sitemap.xml"),
    ("nightowl_robots", "https://nightowleseeds.com/robots.txt"),
    ("nightowl_sm", "https://nightowleseeds.com/sitemap.xml"),
    ("dna_sm", "https://dnagenetics.com/sitemap.xml"),
    ("msnls_sm", "https://www.msnlsseeds.com/sitemap.xml"),
]


def main() -> None:
    for name, url in TARGETS:
        try:
            body = polite_get(url, delay=0.35, timeout=60)
            text = body if isinstance(body, str) else str(body)
            locs = len(re.findall(r"<loc>", text, re.I))
            print(f"=== {name} len={len(text)} locs={locs}")
            print(text[:450].replace("\n", " | "))
            print()
        except Exception as exc:  # noqa: BLE001
            print(f"=== {name} ERR {exc}\n")


if __name__ == "__main__":
    main()
