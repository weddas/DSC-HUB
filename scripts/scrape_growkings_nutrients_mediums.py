#!/usr/bin/env python3
"""Wave D lite: pull Grow Kings Shopify products.json → nutrient/medium dumps + staging.

Public products.json (same path as lights scraper). Filters by product_type/tags/title.
Does not invent NPK/dose — stores payload only.

Usage:
  python scripts/scrape_growkings_nutrients_mediums.py --stage
  python scripts/scrape_growkings_nutrients_mediums.py --stage --limit 500
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.corpus import connect, ensure_source, init_corpus  # noqa: E402

DATA = ROOT / "homeassistant" / "data"
BASE = "https://growkings.com.au/products.json"

NUTE_RE = re.compile(
    r"\b(nutrient|fertili[sz]er|bloom|grow\s*a\b|grow\s*b\b|base\s*nutrient|"
    r"cal.?mag|pk\s*13|npk|feed\s*chart|hydroponic\s*nutrient)\b",
    re.I,
)
MED_RE = re.compile(
    r"\b(coco|coir|perlite|vermiculite|leca|clay\s*ball|rockwool|soil|medium|"
    r"substrate|promix|peat)\b",
    re.I,
)
SKIP_RE = re.compile(
    r"\b(led|light|tent|fan|filter|duct|pot\b|timer|trimmer|scissors|"
    r"seed|strain|clone|vapor|vape)\b",
    re.I,
)


def fetch_page(page: int) -> list[dict]:
    url = f"{BASE}?limit=250&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "DSC-HUB-catalog/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode("utf-8", "replace"))
    return list(data.get("products") or [])


def classify(p: dict) -> str | None:
    blob = " ".join(
        str(x or "")
        for x in (
            p.get("title"),
            p.get("product_type"),
            " ".join(p.get("tags") or []),
            p.get("handle"),
        )
    )
    if SKIP_RE.search(blob) and not NUTE_RE.search(blob) and not MED_RE.search(blob):
        return None
    if NUTE_RE.search(blob):
        return "nutrient"
    if MED_RE.search(blob):
        return "medium"
    # product_type hints
    pt = (p.get("product_type") or "").lower()
    if "nutrient" in pt or "fertili" in pt:
        return "nutrient"
    if any(x in pt for x in ("coco", "soil", "medium", "substrate")):
        return "medium"
    return None


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--stage", action="store_true")
    ap.add_argument("--max-pages", type=int, default=40)
    args = ap.parse_args(argv)

    nutes: list[dict] = []
    meds: list[dict] = []
    for page in range(1, args.max_pages + 1):
        try:
            products = fetch_page(page)
        except Exception as exc:  # noqa: BLE001
            print(json.dumps({"error": str(exc), "page": page}))
            break
        if not products:
            break
        for p in products:
            kind = classify(p)
            if not kind:
                continue
            row = {
                "id": f"growkings:{p.get('handle') or p.get('id')}",
                "name": p.get("title"),
                "brand": (p.get("vendor") or "").strip() or None,
                "category": p.get("product_type"),
                "source": "growkings",
                "url": f"https://growkings.com.au/products/{p.get('handle')}",
                "tags": p.get("tags") or [],
                "handle": p.get("handle"),
                "body_html": (p.get("body_html") or "")[:4000],
            }
            if kind == "nutrient":
                nutes.append(row)
            else:
                meds.append(row)
            if args.limit and (len(nutes) + len(meds)) >= args.limit:
                break
        if args.limit and (len(nutes) + len(meds)) >= args.limit:
            break
        time.sleep(0.35)

    DATA.mkdir(parents=True, exist_ok=True)
    nute_path = DATA / "dsc_nutrients_growkings.json"
    med_path = DATA / "dsc_mediums_growkings.json"
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    nute_path.write_text(
        json.dumps(
            {"schema_version": 1, "kind": "nutrients", "imported_at": stamp, "items": nutes},
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    med_path.write_text(
        json.dumps(
            {"schema_version": 1, "kind": "mediums", "imported_at": stamp, "items": meds},
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(json.dumps({"nutrients": len(nutes), "mediums": len(meds), "nute_path": str(nute_path)}))

    if not args.stage:
        return 0

    init_corpus(ROOT / "brain" / "data" / "dsc_brain.sqlite3")
    # stage into local collation master too if present
    masters = [
        Path(r"C:\DSC\collation\dsc_brain.sqlite3"),
        ROOT / "brain" / "data" / "dsc_brain.sqlite3",
    ]
    for master_path in masters:
        if not master_path.exists():
            continue
        con = connect(master_path)
        ensure_source(con, "growkings", "Grow Kings AU", redistributable=False, note="Wave D lite Shopify")
        for row in nutes:
            nid = row["id"]
            con.execute(
                "INSERT OR REPLACE INTO nutrient_product("
                "id, name, brand, category, source_id, dose_ml_l, stage, npk, payload_json) "
                "VALUES(?,?,?,?,?,?,?,?,?)",
                (
                    nid,
                    row["name"],
                    row.get("brand"),
                    row.get("category"),
                    "growkings",
                    None,
                    None,
                    None,
                    json.dumps(row, ensure_ascii=False),
                ),
            )
        for row in meds:
            mid = row["id"]
            con.execute(
                "INSERT OR REPLACE INTO medium_product("
                "id, name, brand, category, source_id, composition, payload_json) "
                "VALUES(?,?,?,?,?,?,?)",
                (
                    mid,
                    row["name"],
                    row.get("brand"),
                    row.get("category"),
                    "growkings",
                    None,
                    json.dumps(row, ensure_ascii=False),
                ),
            )
        con.commit()
        print(
            json.dumps(
                {
                    "master": str(master_path),
                    "nutrient_product": con.execute("SELECT COUNT(*) FROM nutrient_product").fetchone()[0],
                    "medium_product": con.execute("SELECT COUNT(*) FROM medium_product").fetchone()[0],
                }
            )
        )
        con.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
