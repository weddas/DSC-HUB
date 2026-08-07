#!/usr/bin/env python3
"""Parse CannaReviews legal product list HTML table → dumps + staging."""
from __future__ import annotations

import html as htmlmod
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.corpus import (  # noqa: E402
    add_chemistry,
    add_link,
    corpus_stats,
    ensure_source,
    store_raw_record,
    upsert_canonical,
)
from brain.dsc_brain.paths import staging_db_path  # noqa: E402
from brain.dsc_brain.staging import connect_staging, init_staging, resolve_source_family  # noqa: E402

SOURCE_ID = "cannareviews"
LICENSE = "AU medical / site ToS — license unclear; research corpus only"
CACHE = DATA / "_cache_cannareviews"
LIST_URL = "https://cannareviews.health/products/legal-cannabis-product-list-australia"


def clean(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = htmlmod.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def pct(s: str) -> float | None:
    s = (s or "").strip()
    m = re.search(r"(\d+(?:\.\d+)?)", s.replace("<", ""))
    if not m:
        return None
    try:
        return float(m.group(1))
    except ValueError:
        return None


def parse_rows(text: str) -> list[dict]:
    items: list[dict] = []
    chunks = re.split(r'<td class="truncate-brand">', text)[1:]
    for chunk in chunks:
        brand = clean(re.match(r"([^<]*)", chunk).group(1) if re.match(r"([^<]*)", chunk) else "")
        am = re.search(
            r'<a href="(https://cannareviews\.health/product/([a-z0-9\-]+))"[^>]*>(.*?)</a>',
            chunk,
            re.S,
        )
        if not am:
            continue
        url, slug, name = am.group(1), am.group(2), clean(am.group(3))
        # tds after product cell
        after = chunk[am.end() :]
        tds = [clean(x) for x in re.findall(r"<td[^>]*>(.*?)</td>", after, re.S)]
        # Expected: pack, spectrum, unit_price, price, stock, thc%, cbd%, cultivar, rating, ...
        pack = tds[0] if len(tds) > 0 else None
        spectrum = tds[1] if len(tds) > 1 else None
        unit_price = tds[2] if len(tds) > 2 else None
        price_raw = tds[3] if len(tds) > 3 else None
        stock = tds[4] if len(tds) > 4 else None
        thc_raw = tds[5] if len(tds) > 5 else None
        cbd_raw = tds[6] if len(tds) > 6 else None
        cultivar = tds[7] if len(tds) > 7 else None
        rating = tds[8] if len(tds) > 8 else None

        price = None
        try:
            if price_raw:
                price = float(re.sub(r"[^\d.]", "", price_raw))
        except ValueError:
            price = None
        unit = None
        try:
            if unit_price:
                unit = float(re.sub(r"[^\d.]", "", unit_price))
        except ValueError:
            unit = None

        thc = pct(thc_raw or "")
        cbd = pct(cbd_raw or "")
        chem: dict = {}
        if thc is not None:
            chem["thc_range"] = [thc, thc]
            chem["thc_pct"] = thc
        if cbd is not None:
            chem["cbd_range"] = [cbd, cbd]
            chem["cbd_pct"] = cbd
            if "<" in (cbd_raw or ""):
                chem["cbd_lt"] = True

        strain = cultivar or name
        if brand and strain and strain.lower().startswith(brand.lower()):
            strain = strain[len(brand) :].strip(" -")

        item = {
            "source": SOURCE_ID,
            "slug": slug,
            "url": url,
            "name": name,
            "name_norm": name_norm(name),
            "brand": brand or None,
            "brand_norm": name_norm(brand) if brand else None,
            "pack_size": pack,
            "spectrum": spectrum,
            "unit_price_aud": unit,
            "stock": stock,
            "cultivar": cultivar,
            "list_rating": rating,
            "country": "AU",
            "market": "AU medical",
            "currency": "AUD",
            "from_list": True,
            "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        if price is not None and price > 0:
            item["price_aud"] = price
            item["prices_aud"] = [price]
            item["price_aud_min"] = price
            item["price_aud_max"] = price
        if chem:
            item["chemistry"] = chem
        if strain:
            item["strain_name"] = strain
            item["strain_name_norm"] = name_norm(strain)
        items.append(item)
    return items


def parse_brands_from_sitemap() -> list[dict]:
    sm = CACHE / "sitemap_full.xml"
    if not sm.exists():
        return []
    locs = re.findall(
        r"<loc>(https://cannareviews\.health/cannabis-brands-australia/([^<]+))</loc>",
        sm.read_text(encoding="utf-8", errors="replace"),
    )
    return [
        {
            "source": SOURCE_ID,
            "slug": slug,
            "url": url,
            "name": slug.replace("-", " ").title(),
            "name_norm": name_norm(slug.replace("-", " ")),
            "country": "AU",
            "from_sitemap": True,
        }
        for url, slug in locs
    ]


def main() -> int:
    path = CACHE / "product_list_full.html"
    if not path.exists() or path.stat().st_size < 100_000:
        raise SystemExit("Run scripts/_scrape_cannareviews_lists.py first")
    text = path.read_text(encoding="utf-8", errors="replace")
    products = parse_rows(text)
    print(f"parsed rows={len(products)}")
    if not products:
        return 1
    print("sample", json.dumps(products[0], indent=2))

    # Enrich from prior PDP scrape if present
    pdp_path = DATA / "dsc_products_cannareviews.json"
    by_slug = {p["slug"]: p for p in products}
    if pdp_path.exists():
        try:
            prev = json.loads(pdp_path.read_text(encoding="utf-8"))
            for it in prev.get("items") or []:
                slug = it.get("slug")
                if not slug or slug not in by_slug:
                    continue
                base = by_slug[slug]
                for k in (
                    "review_count",
                    "star_rate",
                    "product_id",
                    "description",
                    "aggregate_rating",
                    "star_histogram",
                    "login_gated",
                ):
                    if it.get(k) not in (None, "", [], {}) and base.get(k) in (None, "", [], {}):
                        base[k] = it[k]
        except Exception as exc:  # noqa: BLE001
            print("pdp enrich skip", exc)
    products = list(by_slug.values())

    brands = parse_brands_from_sitemap()
    reviews = [
        {
            "source": SOURCE_ID,
            "entity": "review_aggregate",
            "product_url": p.get("url"),
            "product_name": p.get("name"),
            "product_id": p.get("product_id"),
            "review_count": p.get("review_count"),
            "star_rate": p.get("star_rate"),
            "list_rating": p.get("list_rating"),
            "login_gated": p.get("login_gated"),
        }
        for p in products
        if p.get("review_count") or p.get("star_rate") or p.get("list_rating")
    ]

    price_n = sum(1 for p in products if p.get("price_aud") is not None)
    chem_n = sum(1 for p in products if p.get("chemistry"))
    brand_n = sum(1 for p in products if p.get("brand"))

    write_dump(
        DATA / "dsc_products_cannareviews.json",
        "products",
        products,
        source=SOURCE_ID,
        source_url=LIST_URL,
        license=LICENSE,
        redistributable=False,
        note="AU medical product list table; prices AUD; chem THC/CBD % columns",
    )
    write_dump(
        DATA / "dsc_brands_cannareviews.json",
        "brands",
        brands,
        source=SOURCE_ID,
        source_url="https://cannareviews.health/cannabis-brands-australia",
        license=LICENSE,
        redistributable=False,
    )
    write_dump(
        DATA / "dsc_reviews_cannareviews.json",
        "reviews",
        reviews,
        source=SOURCE_ID,
        source_url="https://cannareviews.health/",
        license=LICENSE,
        redistributable=False,
        note="Aggregates/list ratings; full review text needs medauth + PDP scrape",
    )

    family = resolve_source_family(SOURCE_ID)
    stg = staging_db_path(family)
    if stg.exists():
        stg.unlink()
    init_staging(SOURCE_ID, note="list table full raw; redistributable=false")
    conn = connect_staging(SOURCE_ID)
    ensure_source(
        conn,
        SOURCE_ID,
        "CannaReviews AU medical (cannareviews.health)",
        url="https://cannareviews.health/",
        license=LICENSE,
        redistributable=False,
        note="AU medical product list prices AUD; PDP reviews when available",
    )
    for p in products:
        name = p.get("strain_name") or p.get("name") or ""
        chem = dict(p.get("chemistry") or {})
        payload = {
            **p,
            "thc_range": chem.get("thc_range"),
            "cbd_range": chem.get("cbd_range"),
            "product": {
                "name": p.get("name"),
                "brand": p.get("brand"),
                "slug": p.get("slug"),
                "url": p.get("url"),
                "price_aud": p.get("price_aud"),
                "unit_price_aud": p.get("unit_price_aud"),
                "pack_size": p.get("pack_size"),
                "spectrum": p.get("spectrum"),
                "stock": p.get("stock"),
                "review_count": p.get("review_count"),
                "star_rate": p.get("star_rate"),
                "market": "AU medical",
            },
        }
        cid = add_chemistry(conn, name, payload, source_id=SOURCE_ID)
        key = name_norm(name)
        if key:
            upsert_canonical(conn, name)
            add_link(conn, "chemistry_profile", cid, "strain_canonical", key, source=SOURCE_ID)
        store_raw_record(
            conn,
            source_id=SOURCE_ID,
            entity_kind="product",
            entity_id=cid,
            name=p.get("name") or name,
            payload=p,
        )
    for b in brands:
        store_raw_record(conn, source_id=SOURCE_ID, entity_kind="brand", name=b.get("name"), payload=b)
    for r in reviews:
        store_raw_record(
            conn,
            source_id=SOURCE_ID,
            entity_kind="review_aggregate",
            name=r.get("product_name"),
            payload=r,
        )
    conn.commit()
    stats = corpus_stats(conn)
    conn.close()

    summary = {
        "products": len(products),
        "brands": len(brands),
        "review_aggregates": len(reviews),
        "products_with_price_aud": price_n,
        "products_with_chemistry": chem_n,
        "products_with_brand": brand_n,
        "price_field_coverage_pct": round(100.0 * price_n / max(1, len(products)), 2),
        "staging": str(stg),
        "staging_stats": stats,
    }
    (DATA / "dsc_cannareviews_report.json").write_text(
        json.dumps(summary, indent=2, default=str), encoding="utf-8"
    )
    print(json.dumps(summary, indent=2, default=str))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
