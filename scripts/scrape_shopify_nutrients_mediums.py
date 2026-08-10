#!/usr/bin/env python3
"""Wave D: Shopify products.json → nutrient/medium for multiple AU shops.

Does not invent NPK/dose. Stages into local + NAS master when --stage.

Usage:
  python scripts/scrape_shopify_nutrients_mediums.py --shop all --stage
  python scripts/scrape_shopify_nutrients_mediums.py --shop hydrocentre --stage
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.corpus import connect, ensure_source, init_corpus  # noqa: E402

DATA = ROOT / "homeassistant" / "data"

SHOPS: dict[str, dict[str, str]] = {
    "growkings": {
        "label": "Grow Kings AU",
        "base": "https://growkings.com.au",
        "products": "https://growkings.com.au/products.json",
    },
    "hydrowarehouse": {
        "label": "Hydro Warehouse AU",
        "base": "https://www.hydrowarehouse.com.au",
        "products": "https://www.hydrowarehouse.com.au/products.json",
    },
    "apexgrow": {
        "label": "Apex Grow AU",
        "base": "https://apexgrow.com.au",
        "products": "https://apexgrow.com.au/products.json",
    },
    "tghydroponics": {
        "label": "TG Hydroponics AU",
        "base": "https://tghydroponics.com.au",
        "products": "https://tghydroponics.com.au/products.json",
    },
    # Retries / known-bad kept for --shop explicit attempts
    "hydrocentre": {
        "label": "Hydroponic Centre AU",
        "base": "https://www.hydroponiccentre.com.au",
        "products": "https://www.hydroponiccentre.com.au/products.json",
    },
    "greengrow": {
        "label": "Green Grow Hydroponics",
        "base": "https://www.greengrow.com.au",
        "products": "https://www.greengrow.com.au/products.json",
    },
    "simplyhydro": {
        "label": "Simply Hydroponics",
        "base": "https://www.simplyhydroponics.com.au",
        "products": "https://www.simplyhydroponics.com.au/products.json",
    },
}

NUTE_RE = re.compile(
    r"\b(nutrient|fertili[sz]er|bloom|grow\s*a\b|grow\s*b\b|base\s*nutrient|"
    r"cal.?mag|pk\s*13|npk|feed\s*chart|hydroponic\s*nutrient|canna\b|advanced\s*nutrients|"
    r"flora\s*series|house\s*&?\s*garden|athena|cyco|grotek|plant\s*prod)\b",
    re.I,
)
MED_RE = re.compile(
    r"\b(coco|coir|perlite|vermiculite|leca|clay\s*ball|rockwool|soil|medium|"
    r"substrate|promix|peat|canna\s*coco|jiffy)\b",
    re.I,
)
SKIP_RE = re.compile(
    r"\b(led|light|tent|fan|filter|duct|pot\b|timer|trimmer|scissors|"
    r"seed|strain|clone|vapor|vape|hoodie|shirt|cap\b)\b",
    re.I,
)


def fetch_page(products_url: str, page: int) -> list[dict]:
    url = f"{products_url}?limit=250&page={page}"
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
    pt = (p.get("product_type") or "").lower()
    if "nutrient" in pt or "fertili" in pt:
        return "nutrient"
    if any(x in pt for x in ("coco", "soil", "medium", "substrate")):
        return "medium"
    return None


def scrape_shop(shop_id: str, *, max_pages: int, limit: int) -> tuple[list[dict], list[dict], str | None]:
    cfg = SHOPS[shop_id]
    nutes: list[dict] = []
    meds: list[dict] = []
    err: str | None = None
    for page in range(1, max_pages + 1):
        try:
            products = fetch_page(cfg["products"], page)
        except Exception as exc:  # noqa: BLE001
            err = str(exc)
            break
        if not products:
            break
        for p in products:
            kind = classify(p)
            if not kind:
                continue
            row = {
                "id": f"{shop_id}:{p.get('handle') or p.get('id')}",
                "name": p.get("title"),
                "brand": (p.get("vendor") or "").strip() or None,
                "category": p.get("product_type"),
                "source": shop_id,
                "url": f"{cfg['base'].rstrip('/')}/products/{p.get('handle')}",
                "tags": p.get("tags") or [],
                "handle": p.get("handle"),
                "body_html": (p.get("body_html") or "")[:4000],
            }
            if kind == "nutrient":
                nutes.append(row)
            else:
                meds.append(row)
            if limit and (len(nutes) + len(meds)) >= limit:
                return nutes, meds, err
        time.sleep(0.35)
    return nutes, meds, err


def stage_rows(
    shop_id: str,
    label: str,
    nutes: list[dict],
    meds: list[dict],
    masters: list[Path],
) -> None:
    for master_path in masters:
        if not master_path.exists():
            continue
        con = connect(master_path)
        ensure_source(con, shop_id, label, redistributable=False, note="Wave D Shopify")
        for row in nutes:
            con.execute(
                "INSERT OR REPLACE INTO nutrient_product("
                "id, name, brand, category, source_id, dose_ml_l, stage, npk, payload_json) "
                "VALUES(?,?,?,?,?,?,?,?,?)",
                (
                    row["id"],
                    row["name"],
                    row.get("brand"),
                    row.get("category"),
                    shop_id,
                    None,
                    None,
                    None,
                    json.dumps(row, ensure_ascii=False),
                ),
            )
        for row in meds:
            con.execute(
                "INSERT OR REPLACE INTO medium_product("
                "id, name, brand, category, source_id, composition, payload_json) "
                "VALUES(?,?,?,?,?,?,?)",
                (
                    row["id"],
                    row["name"],
                    row.get("brand"),
                    row.get("category"),
                    shop_id,
                    None,
                    json.dumps(row, ensure_ascii=False),
                ),
            )
        con.commit()
        print(
            json.dumps(
                {
                    "master": str(master_path),
                    "shop": shop_id,
                    "nutrient_product": con.execute("SELECT COUNT(*) FROM nutrient_product").fetchone()[0],
                    "medium_product": con.execute("SELECT COUNT(*) FROM medium_product").fetchone()[0],
                }
            )
        )
        con.close()


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--shop", default="all", help="shop id or 'all'")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--stage", action="store_true")
    ap.add_argument("--max-pages", type=int, default=40)
    args = ap.parse_args(argv)

    shop_ids = sorted(SHOPS) if args.shop == "all" else [args.shop]
    for sid in shop_ids:
        if sid not in SHOPS:
            print(json.dumps({"error": "unknown_shop", "shop": sid, "known": sorted(SHOPS)}))
            return 2

    DATA.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    if args.stage:
        init_corpus(ROOT / "brain" / "data" / "dsc_brain.sqlite3")
    masters = [
        Path(r"C:\DSC\collation\dsc_brain.sqlite3"),
        ROOT / "brain" / "data" / "dsc_brain.sqlite3",
    ]

    totals = {"nutrients": 0, "mediums": 0, "shops_ok": 0, "shops_fail": 0}
    for sid in shop_ids:
        nutes, meds, err = scrape_shop(sid, max_pages=args.max_pages, limit=args.limit)
        nute_path = DATA / f"dsc_nutrients_{sid}.json"
        med_path = DATA / f"dsc_mediums_{sid}.json"
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
        print(
            json.dumps(
                {
                    "shop": sid,
                    "nutrients": len(nutes),
                    "mediums": len(meds),
                    "error": err,
                    "nute_path": str(nute_path),
                }
            )
        )
        if err and not nutes and not meds:
            totals["shops_fail"] += 1
            continue
        totals["shops_ok"] += 1
        totals["nutrients"] += len(nutes)
        totals["mediums"] += len(meds)
        if args.stage and (nutes or meds):
            stage_rows(sid, SHOPS[sid]["label"], nutes, meds, masters)

    print(json.dumps({"totals": totals}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
