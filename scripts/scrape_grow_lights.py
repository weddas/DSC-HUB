#!/usr/bin/env python3
"""Wave C / N-087 grow-light brand dumps → JSON + optional staging SQLite.

Maximizes photometric capture (wattage / PPF / efficacy / PPFD+spectrum+beam map
URLs / datasheets). Never invents PPFD grid cells.

Modes:
  - woo_sitemap: Spider Farmer, Mars Hydro AU (product-sitemap → PDP HTML)
  - shopify_json: ViparSpectra, Treegers, Grow Kings (products.json pages)

Usage:
  python scripts/scrape_grow_lights.py --brand spider_farmer --stage
  python scripts/scrape_grow_lights.py --all --stage
  python scripts/scrape_grow_lights.py --brand growkings --limit 80
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

LICENSE = "research archival scrape; redistributable=false until legal review"

PPFD_HINT = re.compile(r"(?i)ppfd|par[\s_-]?map|intensity[\s_-]?map|umol|µmol")
SPEC_HINT = re.compile(r"(?i)spectrum|spd|spectral|wavelength")
BEAM_HINT = re.compile(r"(?i)beam[\s_-]?map|polar|candela|ies|radiation[\s_-]?pattern")
DATASHEET_HINT = re.compile(r"(?i)\.pdf(?:\?|$)")
ASSET_RE = re.compile(
    r"https?://[^\s\"'<>]+?\.(?:jpg|jpeg|png|webp|gif|svg|pdf)(?:\?[^\s\"'<>]*)?",
    re.I,
)
WATT_RE = re.compile(r"(?i)(?:^|[^\w])(\d{2,4}(?:\.\d+)?)\s*w(?:att)?s?\b")
PPF_RE = re.compile(
    r"(?i)(?:ppf|photosynthetic\s+photon\s+flux)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(?:µ|u|μ)?mol"
)
PPE_RE = re.compile(
    r"(?i)(?:ppe|efficacy|µmol/?j|umol/?j)\s*[:=]?\s*(\d+(?:\.\d+)?)"
)
LIGHT_HINT = re.compile(
    r"(?i)\b(?:led|grow\s*light|fixture|luminaire|quantum|bar\s*light|panel|"
    r"horticulture\s*light|ppfd|full[\s-]*spectrum)\b"
)
NOT_LIGHT = re.compile(
    r"(?i)\b(?:tent|filter|fan|duct|pot|nutrient|soil|coco|perlite|timer|"
    r"controller\s*only|carbon|odour|odor|humidifier|dehumidifier|tray|"
    r"net\s*pot|scissors|glove|eyewear|tin|cap|hat|shirt|hoodie)\b"
)

BRANDS: dict[str, dict[str, Any]] = {
    "spider_farmer": {
        "source_id": "spider_farmer",
        "brand": "Spider Farmer",
        "mode": "woo_sitemap",
        "home": "https://www.spider-farmer.com/",
        "sitemap_urls": [
            "https://www.spider-farmer.com/product-sitemap.xml",
            "https://www.spider-farmer.com/product-sitemap1.xml",
        ],
        "product_re": re.compile(
            r"^https?://(?:www\.)?spider-farmer\.com/products/[a-z0-9\-]+/?$",
            re.I,
        ),
        "delay": 0.55,
    },
    "mars_hydro_au": {
        "source_id": "mars_hydro_au",
        "brand": "Mars Hydro",
        "mode": "woo_sitemap",
        "home": "https://marshydroau.com/",
        "sitemap_urls": [
            "https://marshydroau.com/product-sitemap.xml",
            "https://marshydroau.com/wp-sitemap-posts-product-1.xml",
        ],
        "product_re": re.compile(
            r"^https?://(?:www\.)?marshydroau\.com/products/[a-z0-9\-]+/?$",
            re.I,
        ),
        "delay": 0.55,
    },
    "viparspectra": {
        "source_id": "viparspectra",
        "brand": "ViparSpectra",
        "mode": "shopify_json",
        "home": "https://viparspectra.com/",
        "products_json": "https://viparspectra.com/products.json",
        "filter_lights": True,
        "delay": 0.35,
    },
    "treegers": {
        "source_id": "treegers",
        "brand": "Treegers",
        "mode": "shopify_json",
        "home": "https://treegers.com/",
        "products_json": "https://treegers.com/products.json",
        "filter_lights": True,
        "delay": 0.35,
    },
    "growkings": {
        "source_id": "growkings",
        "brand": None,  # multi-brand retailer
        "mode": "shopify_json",
        "home": "https://growkings.com.au/",
        "products_json": "https://growkings.com.au/products.json",
        "filter_lights": True,
        "delay": 0.4,
    },
}


def slug_id(*parts: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", "_".join(parts).lower()).strip("_")
    return s[:100] or "unknown"


def clean_html(frag: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", frag or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def clean_asset_url(raw: str) -> str | None:
    if not raw:
        return None
    # srcset leftovers: take first URL token
    u = raw.strip().split()[0].rstrip(".,);]")
    u = html_lib.unescape(u)
    if not u.startswith("http"):
        return None
    # drop wordpress thumbs when full sibling exists later
    return u.split("#")[0]


def bucket_assets(urls: list[str]) -> dict[str, list[dict]]:
    buckets: dict[str, list[dict]] = {
        "ppfd_maps": [],
        "spectrum_maps": [],
        "beam_maps": [],
        "datasheets": [],
    }
    seen: set[str] = set()
    for raw in urls:
        url = clean_asset_url(raw)
        if not url or url in seen:
            continue
        seen.add(url)
        path = unquote(urlparse(url).path)
        row = {"url": url, "title": path.rsplit("/", 1)[-1], "source": "page_scan"}
        if DATASHEET_HINT.search(url):
            buckets["datasheets"].append(row)
        elif PPFD_HINT.search(url) or PPFD_HINT.search(path):
            buckets["ppfd_maps"].append(row)
        elif SPEC_HINT.search(url) or SPEC_HINT.search(path):
            buckets["spectrum_maps"].append(row)
        elif BEAM_HINT.search(url) or BEAM_HINT.search(path):
            buckets["beam_maps"].append(row)
    return buckets


def parse_metrics(text: str) -> dict[str, Any]:
    out: dict[str, Any] = {}
    m = WATT_RE.search(text)
    if m:
        try:
            out["wattage_w"] = float(m.group(1))
        except ValueError:
            pass
    m = PPF_RE.search(text)
    if m:
        try:
            out["ppf_umol_s"] = float(m.group(1))
        except ValueError:
            pass
    m = PPE_RE.search(text)
    if m:
        try:
            out["efficacy_umol_j"] = float(m.group(1))
        except ValueError:
            pass
    if re.search(r"(?i)full\s*spectrum", text):
        out["spectrum"] = "full spectrum"
    if re.search(r"(?i)dimmable", text):
        out["dimmable"] = True
    return out


def extract_json_ld(html: str) -> list[dict]:
    out: list[dict] = []
    for m in re.finditer(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html or "",
        re.I | re.S,
    ):
        raw = m.group(1).strip()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            out.extend(x for x in data if isinstance(x, dict))
        elif isinstance(data, dict):
            if "@graph" in data and isinstance(data["@graph"], list):
                out.extend(x for x in data["@graph"] if isinstance(x, dict))
            else:
                out.append(data)
    return out


def looks_like_light(title: str, *, product_type: str = "", tags: list[str] | None = None) -> bool:
    hay = " ".join([title or "", product_type or "", " ".join(tags or [])])
    if NOT_LIGHT.search(hay) and not LIGHT_HINT.search(hay):
        return False
    if LIGHT_HINT.search(hay):
        return True
    # Treegers / Vipar product lines often omit "LED" in short titles
    if re.search(r"(?i)\b(?:gl\d|tl\d|xs\d|p\d{3,4}|sf\d|fc[- ]?e?\d|se\d|tsw?\d)\b", hay):
        return True
    return False


def sitemap_locs(urls: list[str], product_re: re.Pattern[str]) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for sm in urls:
        try:
            body = polite_get(sm, delay=0.2, timeout=90)
        except Exception as exc:  # noqa: BLE001
            print(f"  sitemap FAIL {sm}: {exc}")
            continue
        for loc in re.findall(r"<loc>\s*(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?\s*</loc>", body, re.I):
            loc = html_lib.unescape(loc.strip())
            if not product_re.match(loc):
                continue
            if loc in seen:
                continue
            seen.add(loc)
            found.append(loc)
    return found


def parse_woo_pdp(url: str, html: str, *, brand: str, source_id: str) -> dict[str, Any]:
    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), {}) or {}
    title = str(product.get("name") or "").strip()
    if not title:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
        title = clean_html(m.group(1)) if m else url.rstrip("/").split("/")[-1]
    title = re.sub(r"\s*[|\-–].*$", "", title).strip() or title

    desc = html_lib.unescape(str(product.get("description") or ""))
    text = clean_html(html)
    metrics = parse_metrics(f"{title} {desc} {text[:12000]}")

    assets = bucket_assets(ASSET_RE.findall(html))
    handle = urlparse(url).path.rstrip("/").split("/")[-1]
    brand_name = brand
    b = product.get("brand")
    if isinstance(b, dict) and b.get("name"):
        brand_name = str(b["name"])
    elif isinstance(b, str) and b.strip():
        brand_name = b.strip()

    sku = product.get("sku")
    price = None
    offers = product.get("offers")
    if isinstance(offers, list) and offers:
        offers = offers[0]
    if isinstance(offers, dict):
        try:
            price = float(offers.get("price"))
        except (TypeError, ValueError):
            price = None

    return {
        "id": slug_id(source_id, "light", handle),
        "name": title,
        "brand": brand_name,
        "kind": "light",
        "url": url,
        "handle": handle,
        "sku": sku,
        "wattage_w": metrics.get("wattage_w"),
        "ppf_umol_s": metrics.get("ppf_umol_s"),
        "efficacy_umol_j": metrics.get("efficacy_umol_j"),
        "spectrum": metrics.get("spectrum"),
        "dimmable": metrics.get("dimmable"),
        "ppfd_maps": assets["ppfd_maps"],
        "spectrum_maps": assets["spectrum_maps"],
        "beam_maps": assets["beam_maps"],
        "datasheets": assets["datasheets"],
        "price": price,
        "description": clean_html(desc)[:4000] if desc else None,
        "raw_props": {
            "json_ld_keys": sorted(product.keys()) if product else [],
            "name_norm": name_norm(title),
        },
        "source_urls": [url],
        "notes": "Woo PDP scan; map URLs only when filename keywords match; no invented grids.",
    }


def shopify_pages(base_url: str, *, delay: float) -> list[dict]:
    products: list[dict] = []
    page = 1
    while page <= 40:
        url = f"{base_url}?limit=250&page={page}"
        try:
            body = polite_get(url, delay=delay, timeout=90)
            doc = json.loads(body)
        except Exception as exc:  # noqa: BLE001
            print(f"  shopify FAIL page={page}: {exc}")
            break
        batch = doc.get("products") or []
        if not batch:
            break
        products.extend(x for x in batch if isinstance(x, dict))
        if len(batch) < 250:
            break
        page += 1
    return products


def parse_shopify_product(p: dict, *, cfg: dict) -> dict[str, Any] | None:
    title = str(p.get("title") or "").strip()
    if not title:
        return None
    tags = p.get("tags") or []
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",")]
    product_type = str(p.get("product_type") or "")
    if cfg.get("filter_lights") and not looks_like_light(
        title, product_type=product_type, tags=[str(t) for t in tags]
    ):
        return None

    handle = str(p.get("handle") or slug_id(title))
    home = cfg["home"].rstrip("/")
    url = f"{home}/products/{handle}"
    body_html = str(p.get("body_html") or "")
    text = clean_html(body_html)
    metrics = parse_metrics(f"{title} {product_type} {text}")

    urls: list[str] = []
    for img in p.get("images") or []:
        if isinstance(img, dict) and img.get("src"):
            urls.append(str(img["src"]))
    urls.extend(ASSET_RE.findall(body_html))
    assets = bucket_assets(urls)

    vendor = str(p.get("vendor") or cfg.get("brand") or "").strip() or cfg.get("brand")
    variants = p.get("variants") or []
    price = None
    sku = None
    if isinstance(variants, list) and variants:
        v0 = variants[0] if isinstance(variants[0], dict) else {}
        sku = v0.get("sku")
        try:
            price = float(v0.get("price"))
        except (TypeError, ValueError):
            price = None

    # Keep a slim but rich raw snapshot (full shopify row can be large; NAS OK).
    raw = {
        "id": p.get("id"),
        "title": title,
        "handle": handle,
        "vendor": vendor,
        "product_type": product_type,
        "tags": tags,
        "variants": variants,
        "images": p.get("images"),
        "options": p.get("options"),
        "body_html": body_html,
        "created_at": p.get("created_at"),
        "updated_at": p.get("updated_at"),
    }

    return {
        "id": slug_id(cfg["source_id"], "light", handle),
        "name": title,
        "brand": vendor,
        "kind": "light",
        "url": url,
        "handle": handle,
        "sku": sku,
        "product_type": product_type,
        "tags": tags,
        "wattage_w": metrics.get("wattage_w"),
        "ppf_umol_s": metrics.get("ppf_umol_s"),
        "efficacy_umol_j": metrics.get("efficacy_umol_j"),
        "spectrum": metrics.get("spectrum"),
        "dimmable": metrics.get("dimmable"),
        "ppfd_maps": assets["ppfd_maps"],
        "spectrum_maps": assets["spectrum_maps"],
        "beam_maps": assets["beam_maps"],
        "datasheets": assets["datasheets"],
        "price": price,
        "description": text[:4000] if text else None,
        "raw_props": {"name_norm": name_norm(title), "shopify_id": p.get("id")},
        "raw_shopify": raw,
        "source_urls": [url],
        "notes": "Shopify products.json; map URLs only when filename keywords match.",
    }


def coverage(rows: list[dict]) -> dict[str, int]:
    return {
        "wattage_w": sum(1 for r in rows if r.get("wattage_w") is not None),
        "ppf_umol_s": sum(1 for r in rows if r.get("ppf_umol_s") is not None),
        "efficacy_umol_j": sum(1 for r in rows if r.get("efficacy_umol_j") is not None),
        "ppfd_maps": sum(1 for r in rows if r.get("ppfd_maps")),
        "spectrum_maps": sum(1 for r in rows if r.get("spectrum_maps")),
        "beam_maps": sum(1 for r in rows if r.get("beam_maps")),
        "datasheets": sum(1 for r in rows if r.get("datasheets")),
    }


def write_light_dump(source_id: str, rows: list[dict], *, home: str) -> Path:
    path = DATA / f"dsc_lights_{source_id}.json"
    payload_rows = rows
    doc_path = write_dump(
        path,
        "lights",
        payload_rows,
        source=source_id,
        source_url=home,
        redistributable=False,
        license=LICENSE,
        products=payload_rows,  # dual key for clean_light_map_assets / pack builders
        coverage=coverage(rows),
        note="Wave C light dump; maximize capture; no invented PPFD cells",
    )
    # write_dump puts items=; also ensure products= for older cleaners
    doc = json.loads(doc_path.read_text(encoding="utf-8"))
    doc["products"] = rows
    doc["items"] = rows
    doc["coverage"] = coverage(rows)
    doc_path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return doc_path


def stage_dump(path: Path, source_id: str) -> dict[str, Any]:
    from brain.dsc_brain.staging import write_dump_to_staging

    return write_dump_to_staging(path, source_id=source_id)


def scrape_brand(brand_key: str, *, limit: int | None, resume: bool, stage: bool) -> dict[str, Any]:
    cfg = BRANDS[brand_key]
    source_id = cfg["source_id"]
    ck = Checkpoint(DATA / f"_ckpt_lights_{source_id}.json")
    if not resume:
        ck.data = {"done": [], "failed": [], "meta": {}}
        ck.save()

    rows_by_id: dict[str, dict] = {}
    dump_path = DATA / f"dsc_lights_{source_id}.json"
    if resume and dump_path.exists():
        try:
            prev = json.loads(dump_path.read_text(encoding="utf-8"))
            for r in prev.get("products") or prev.get("items") or []:
                if isinstance(r, dict) and r.get("id"):
                    rows_by_id[str(r["id"])] = r
        except Exception:  # noqa: BLE001
            pass

    done = set(ck.data.get("done") or [])
    mode = cfg["mode"]
    print(f"=== {brand_key} mode={mode} ===")

    if mode == "woo_sitemap":
        locs = sitemap_locs(list(cfg["sitemap_urls"]), cfg["product_re"])
        print(f"  sitemap products: {len(locs)}")
        if limit is not None:
            locs = locs[:limit]
        for i, url in enumerate(locs):
            if url in done:
                continue
            try:
                html = polite_get(url, delay=float(cfg.get("delay") or 0.5), timeout=90)
                row = parse_woo_pdp(
                    url,
                    html,
                    brand=str(cfg.get("brand") or source_id),
                    source_id=source_id,
                )
                rows_by_id[row["id"]] = row
                done.add(url)
                ck.data["done"] = sorted(done)
                if i % 10 == 0:
                    ck.save()
                    write_light_dump(source_id, list(rows_by_id.values()), home=cfg["home"])
                print(
                    f"  [{i+1}/{len(locs)}] {row['name'][:55]} "
                    f"ppfd={len(row.get('ppfd_maps') or [])} "
                    f"spec={len(row.get('spectrum_maps') or [])}"
                )
            except Exception as exc:  # noqa: BLE001
                failed = list(ck.data.get("failed") or [])
                failed.append({"url": url, "error": str(exc)})
                ck.data["failed"] = failed[-200:]
                print(f"  FAIL {url}: {exc}")
            if (i + 1) % 25 == 0:
                ck.save()

    elif mode == "shopify_json":
        products = shopify_pages(cfg["products_json"], delay=float(cfg.get("delay") or 0.35))
        print(f"  shopify products fetched: {len(products)}")
        parsed = 0
        for i, p in enumerate(products):
            if limit is not None and parsed >= limit:
                break
            handle = str(p.get("handle") or "")
            key = f"shopify:{handle}"
            if key in done:
                row_id = slug_id(source_id, "light", handle)
                if row_id in rows_by_id:
                    parsed += 1
                continue
            row = parse_shopify_product(p, cfg=cfg)
            if not row:
                done.add(key)
                continue
            rows_by_id[row["id"]] = row
            done.add(key)
            parsed += 1
            if parsed % 20 == 0:
                ck.data["done"] = sorted(done)
                ck.save()
                write_light_dump(source_id, list(rows_by_id.values()), home=cfg["home"])
            print(
                f"  [{parsed}] {row['name'][:55]} "
                f"ppfd={len(row.get('ppfd_maps') or [])} "
                f"brand={row.get('brand')}"
            )
    else:
        raise ValueError(f"unknown mode {mode}")

    ck.data["done"] = sorted(done)
    ck.save()
    rows = list(rows_by_id.values())
    out = write_light_dump(source_id, rows, home=cfg["home"])
    result: dict[str, Any] = {
        "brand": brand_key,
        "dump": str(out),
        "count": len(rows),
        "coverage": coverage(rows),
        "failed": len(ck.data.get("failed") or []),
    }
    if stage:
        st = stage_dump(out, source_id)
        result["staging"] = {
            "family": st.get("family"),
            "staging_db": st.get("staging_db"),
            "count": st.get("count"),
        }
        print(f"  staged -> {st.get('staging_db')} n={st.get('count')}")
    print(json.dumps({k: result[k] for k in ("brand", "count", "coverage", "dump")}, indent=2))
    return result


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand", choices=sorted(BRANDS.keys()), action="append")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--stage", action="store_true", help="Write per-source staging sqlite")
    args = ap.parse_args()

    brands = list(args.brand or [])
    if args.all or not brands:
        brands = list(BRANDS.keys())

    DATA.mkdir(parents=True, exist_ok=True)
    summary = []
    for b in brands:
        summary.append(
            scrape_brand(b, limit=args.limit, resume=args.resume, stage=args.stage)
        )
    print(json.dumps({"summary": summary}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
