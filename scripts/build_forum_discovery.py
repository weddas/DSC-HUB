#!/usr/bin/env python3
"""Map forum inventory names to public base URLs for later thread scrapes."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, write_dump  # noqa: E402

FORUM_URLS = {
    "420 Magazine": "https://www.420magazine.com/community/",
    "Autoflower Network": "https://www.autoflower.org/",
    "Cannabis.com Forums": "https://forums.cannabis.com/",
    "CannabisCafe 2.0": "https://www.cannabiscafe.net/",
    "Cannabisanbauen.net": "https://www.cannabisanbauen.net/",
    "Cannaweed": "https://www.cannaweed.com/",
    "Chuckersparadise": "https://www.chuckersparadise.com/",
    "FCF": "https://forum.cannabisforum.nl/",
    "Grasscity": "https://forum.grasscity.com/",
    "GreenPassion": "https://www.greenpassion.org/",
    "GrowKind": "https://www.growkind.com/",
    "Grower.ch": "https://www.grower.ch/",
    "Grower.cz": "https://www.grower.cz/",
    "Growery": "https://www.growery.org/",
    "ICMag": "https://www.icmag.com/forums/",
    "Jointjedraaien.nl": "https://www.jointjedraaien.nl/",
    "Lamarihuana": "https://www.lamarihuana.com/foros/",
    "Marijuana Growing Forums": "https://www.marijuanagrowing.com/",
    "Marijuana Passion": "https://www.marijuanapassion.com/",
    "Mr.Nice": "https://www.mrnice.nl/forum/",
    "OZ Stoners": "https://www.ozstoners.com/",
    "Olkpeace": "https://olkpeace.org/",
    "OpenGrow": "https://www.opengrow.com/",
    "Overgrow": "https://www.overgrow.com/",
    "Phenohunter": "https://phenohunter.org/",
    "Reddit Cannabis": "https://www.reddit.com/r/cannabis/",
    "Rollitup": "https://www.rollitup.org/",
    "Sensi Seeds Forums": "https://forum.sensiseeds.com/",
    "Strain Hunters": "https://www.strainhunters.com/",
    "Swecan": "https://www.swecan.org/",
    "THCfarmer": "https://www.thcfarmer.com/",
    "THCtalk": "https://www.thctalk.com/",
    "The Green Circle": "https://www.thegreencircle.org/",
    "UK420": "https://www.uk420.com/",
    "Wiet Forum NL": "https://www.wietforum.nl/",
}


def main() -> int:
    inv_path = DATA / "dsc_seed_breeders.json"
    forums = list(FORUM_URLS)
    if inv_path.exists():
        try:
            inv = json.loads(inv_path.read_text(encoding="utf-8"))
            forums = inv.get("forums") or forums
        except Exception:
            pass
    items = []
    for name in forums:
        items.append(
            {
                "name": name,
                "url": FORUM_URLS.get(name),
                "status": "mapped" if name in FORUM_URLS else "needs_url",
                "scrape": "pending",
                "note": "public pages only; structured grow facts with provenance",
            }
        )
    write_dump(
        DATA / "dsc_forum_discovery.json",
        "forum_discovery",
        items,
        source="n087_forums",
        built_note=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        redistributable=False,
        note="URL map for Wave B+ forum scrapers; no invented chem from threads",
    )
    print(f"wrote forum discovery n={len(items)} mapped={sum(1 for i in items if i.get('url'))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
