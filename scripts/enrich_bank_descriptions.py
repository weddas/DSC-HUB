#!/usr/bin/env python3
"""Re-fetch bank PDPs to fill missing description (Herbies/Zamnesia etc.).

Reads existing dump items, only re-GETs URLs lacking description, updates dump + staging.

Usage:
  python scripts/enrich_bank_descriptions.py --bank herbies --delay 0.8
  python scripts/enrich_bank_descriptions.py --bank zamnesia --limit 200
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, polite_get, write_dump  # noqa: E402
from scrape_seed_banks import (  # noqa: E402
    BANKS,
    clean,
    extract_json_ld,
    is_bot_wall,
    stage_dump,
)

UA_NOTE = "bank HTML scrape; redistributable=false until legal review"


def extract_description(html: str) -> str | None:
    for block in extract_json_ld(html):
        for key in ("description", "abstract"):
            v = block.get(key)
            if isinstance(v, str) and len(v.strip()) > 40:
                return clean(v)[:8000]
    for pat in (
        r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:description["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']',
    ):
        mm = re.search(pat, html, re.I)
        if mm and len(mm.group(1).strip()) > 40:
            return clean(mm.group(1))[:8000]
    return None


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--bank", required=True, choices=sorted(BANKS))
    ap.add_argument("--delay", type=float, default=0.8)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--stage", action="store_true")
    args = ap.parse_args(argv)

    out = DATA / f"dsc_strains_{args.bank}.json"
    if not out.exists():
        print(f"missing dump {out}")
        return 2
    doc = json.loads(out.read_text(encoding="utf-8"))
    items = [i for i in (doc.get("items") or []) if isinstance(i, dict)]
    need = [
        i
        for i in items
        if not (isinstance(i.get("description"), str) and i["description"].strip())
        and i.get("url")
    ]
    if args.limit:
        need = need[: args.limit]
    print(f"{args.bank}: enrich {len(need)}/{len(items)} missing description")

    filled = 0
    walls = 0
    for idx, item in enumerate(need, 1):
        url = str(item["url"])
        try:
            html = polite_get(url, delay=args.delay, timeout=90)
        except Exception as exc:  # noqa: BLE001
            print(f"  fail {url}: {exc}")
            continue
        if is_bot_wall(html):
            walls += 1
            print(f"  wall {url}")
            if walls >= 8:
                print("abort repeated walls")
                break
            continue
        walls = 0
        desc = extract_description(html)
        if desc:
            item["description"] = desc
            filled += 1
        if idx % 25 == 0:
            write_dump(
                out,
                "strains",
                items,
                source=args.bank,
                source_url=BANKS[args.bank].get("source_url"),
                license=UA_NOTE,
                redistributable=False,
                note=f"description enrich partial filled={filled}",
            )
            print(f"  checkpoint filled={filled} idx={idx}/{len(need)}")
        time.sleep(0)  # polite_get already delays

    write_dump(
        out,
        "strains",
        items,
        source=args.bank,
        source_url=BANKS[args.bank].get("source_url"),
        license=UA_NOTE,
        redistributable=False,
        note=f"description enrich filled={filled}",
    )
    if args.stage:
        stage_dump(args.bank, reset=True)
    print(json.dumps({"bank": args.bank, "filled": filled, "attempted": len(need)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
