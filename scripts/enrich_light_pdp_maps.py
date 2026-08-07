#!/usr/bin/env python3
"""Enrich light dumps with PDP HTML asset scans (map URL keywords).

Shopify CDN image filenames often lack PPFD/spectrum hints; manufacturer PDPs
embed labeled gallery URLs. Rewrites dump in place; optional --stage.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, polite_get  # noqa: E402
from scrape_grow_lights import ASSET_RE, bucket_assets, coverage  # noqa: E402


def merge_assets(row: dict, html: str) -> dict:
    found = bucket_assets(ASSET_RE.findall(html or ""))
    for key in ("ppfd_maps", "spectrum_maps", "beam_maps", "datasheets"):
        existing = { (x.get("url") or "") for x in (row.get(key) or []) if isinstance(x, dict) }
        merged = list(row.get(key) or [])
        for item in found.get(key) or []:
            u = item.get("url") or ""
            if u and u not in existing:
                item = dict(item)
                item["source"] = "pdp_enrich"
                merged.append(item)
                existing.add(u)
        row[key] = merged
    return row


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dump", required=True, help="dsc_lights_*.json filename")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--delay", type=float, default=0.45)
    ap.add_argument("--stage", action="store_true")
    args = ap.parse_args()

    path = DATA / args.dump
    doc = json.loads(path.read_text(encoding="utf-8"))
    rows = list(doc.get("products") or doc.get("items") or [])
    before = coverage(rows)
    n = 0
    for row in rows:
        if args.limit is not None and n >= args.limit:
            break
        url = row.get("url")
        if not url:
            continue
        # Only enrich rows thin on maps
        if row.get("ppfd_maps") or row.get("spectrum_maps") or row.get("beam_maps"):
            continue
        try:
            html = polite_get(str(url), delay=args.delay, timeout=90)
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {url}: {exc}")
            continue
        merge_assets(row, html)
        n += 1
        print(
            f"enrich {n} {str(row.get('name') or '')[:50]} "
            f"ppfd={len(row.get('ppfd_maps') or [])} "
            f"spec={len(row.get('spectrum_maps') or [])} "
            f"beam={len(row.get('beam_maps') or [])}"
        )

    after = coverage(rows)
    doc["products"] = rows
    doc["items"] = rows
    doc["coverage"] = after
    doc["pdp_enrich"] = {"scanned": n, "before": before, "after": after}
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"dump": str(path), "scanned": n, "before": before, "after": after}, indent=2))

    if args.stage:
        from brain.dsc_brain.staging import write_dump_to_staging

        sid = str(doc.get("source") or path.stem.replace("dsc_lights_", ""))
        st = write_dump_to_staging(path, source_id=sid)
        print("staged", st.get("staging_db"), "n=", st.get("count"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
