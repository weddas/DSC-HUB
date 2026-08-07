#!/usr/bin/env python3
"""Sitemap-first scrapers for Crop King Seeds + DC Seed Exchange.

Discovery [a9819597]: list pages are weak; product sitemaps are the SoT.
- Crop King: WooCommerce product-sitemap*.xml; PDPs under
  /{autoflowering|feminized|…}-seeds/… (and -strain slugs).
- DC Seed Exchange: WooCommerce /product/{slug}/ (NOT Shopify).

Checkpoint/resume, polite delay, maximize grow/chem fields.
redistributable=false — research scrape until legal review.
Dumps → homeassistant/data/dsc_strains_{cropking|dcseedexchange}.json
Staging → brain/data/staging/{cropking|dcseedexchange}.sqlite3 (FULL raw_record)
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path
from typing import Callable
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

NOTE = "research scrape of public bank HTML; redistributable=false until legal review"

# --- Crop King ---------------------------------------------------------------
CK_SOURCE = "cropking"
CK_SOURCE_URL = "https://www.cropkingseeds.com/"
CK_SITEMAPS = [
    "https://www.cropkingseeds.com/product-sitemap.xml",
    "https://www.cropkingseeds.com/product-sitemap2.xml",
    "https://www.cropkingseeds.com/product-sitemap3.xml",
    "https://www.cropkingseeds.com/product-sitemap4.xml",
]
CK_CATS = (
    "autoflowering-seeds|feminized-seeds|regular-marijuana-seeds|fast-version-seeds|"
    "high-cbd(?:-seeds)?|high-yielding-strain|new-strains|cup-winner-strains|"
    "award-winning-strain|sativa-seeds|indica-seeds|hybrid-seeds|dwarf-auto-fem|"
    "assorted-packs"
)
CK_PRODUCT_RE = re.compile(
    rf"^https://www\.cropkingseeds\.com/({CK_CATS})/([a-z0-9\-%]+)/?$",
    re.I,
)
CK_SKIP_SLUG = re.compile(
    r"(?:^|-)(?:gift-card|free-seed|qr-code|sticker|shirt|hat|hoodie|merch)(?:-|$)",
    re.I,
)

# --- DC Seed Exchange --------------------------------------------------------
DC_SOURCE = "dcseedexchange"
DC_SOURCE_URL = "https://dcseedexchange.com/"
DC_SITEMAPS = [
    "https://dcseedexchange.com/product-sitemap.xml",
    "https://dcseedexchange.com/product-sitemap2.xml",
]
DC_PRODUCT_RE = re.compile(
    r"^https://dcseedexchange\.com/product/([a-z0-9\-]+)/?$",
    re.I,
)
DC_SKIP_SLUG = re.compile(
    r"(?:gift-card|membership|shipping|sticker|shirt|hat|hoodie|merch|apparel|poster|"
    r"^test-product|salve|body-butter|detection-kit|hlvd|viroid)",
    re.I,
)
DC_BREEDER_CAT_SKIP = {
    "feminized-seeds",
    "feminized-photoperiod-seeds",
    "regular-seeds",
    "autoflower-seeds",
    "autoflowering-seeds",
    "cbd-seeds",
    "regional-breeders-strains",
    "auctions",
    "sale",
    "uncategorized",
}


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def polite_get_retry(
    url: str,
    *,
    delay: float,
    timeout: int = 60,
    retries: int = 4,
) -> str:
    """Fetch with backoff on transient 429/500/502/503/504."""
    last_exc: Exception | None = None
    for attempt in range(retries):
        try:
            return polite_get(url, delay=delay if attempt == 0 else delay + attempt * 1.5, timeout=timeout)
        except Exception as exc:  # noqa: BLE001
            last_exc = exc
            msg = str(exc)
            transient = any(code in msg for code in ("429", "500", "502", "503", "504"))
            if not transient or attempt >= retries - 1:
                raise
            wait = delay * (2 ** attempt) + 1.0
            print(f"  retry {attempt + 1}/{retries} after {wait:.1f}s: {msg[:120]}", flush=True)
            time.sleep(wait)
    assert last_exc is not None
    raise last_exc


def is_bot_wall(html: str) -> bool:
    low = (html or "").lower()
    markers = (
        "verifying you're human",
        "cf-browser-verification",
        "attention required | cloudflare",
        "just a moment...",
        "enable javascript and cookies to continue",
        "access denied",
        "captcha-delivery.com",
    )
    if any(m in low for m in markers):
        return True
    if len(low) < 1500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def extract_json_ld(html: str) -> list[dict]:
    out: list[dict] = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html or "",
        re.I | re.S,
    ):
        raw = m.group(1).strip()
        if not raw:
            continue
        try:
            doc = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(doc, list):
            out.extend(x for x in doc if isinstance(x, dict))
        elif isinstance(doc, dict):
            # Yoast often wraps @graph
            if "@graph" in doc and isinstance(doc["@graph"], list):
                out.extend(x for x in doc["@graph"] if isinstance(x, dict))
            out.append(doc)
    return out


def _uniq(seq: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in seq:
        k = (x or "").strip()
        if not k:
            continue
        lk = k.lower()
        if lk in seen:
            continue
        seen.add(lk)
        out.append(k)
    return out


def _meta(html: str, prop: str) -> str | None:
    m = re.search(
        rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop)}["\'][^>]+content=["\']([^"\']*)["\']',
        html or "",
        re.I,
    )
    if not m:
        m = re.search(
            rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]+(?:property|name)=["\']{re.escape(prop)}["\']',
            html or "",
            re.I,
        )
    return html_lib.unescape(m.group(1)).strip() if m else None


def _pct_pair(s: str) -> list[float] | None:
    m = re.search(r"(\d+(?:\.\d+)?)\s*[-–/to]+\s*(\d+(?:\.\d+)?)\s*%?", s)
    if m:
        return [float(m.group(1)), float(m.group(2))]
    m = re.search(r"(\d+(?:\.\d+)?)\s*%?", s)
    if m:
        v = float(m.group(1))
        return [v, v]
    return None


def _weeks_to_days(s: str) -> int | list[int] | None:
    m = re.search(r"(\d+)\s*[-–]\s*(\d+)\s*weeks?", s, re.I)
    if m:
        return [int(m.group(1)) * 7, int(m.group(2)) * 7]
    m = re.search(r"(\d+)\s*weeks?", s, re.I)
    if m:
        return int(m.group(1)) * 7
    m = re.search(r"(\d+)\s*[-–]\s*(\d+)\s*days?", s, re.I)
    if m:
        return [int(m.group(1)), int(m.group(2))]
    m = re.search(r"(\d+)\s*days?", s, re.I)
    if m:
        return int(m.group(1))
    return None


def parse_spec_table(html: str) -> dict[str, str]:
    """Key/value rows from WooCommerce / Elementor product tables."""
    specs: dict[str, str] = {}
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", html or "", re.I | re.S):
        cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.I | re.S)
        if len(cells) < 2:
            continue
        key = clean(cells[0])
        val = clean(cells[1])
        if not key or not val or len(key) > 80:
            continue
        # skip related-product noise
        if key.lower() in {"product", ""}:
            continue
        specs[key] = val
    return specs


def apply_ck_specs(row: dict, specs: dict[str, str]) -> None:
    if not specs:
        return
    row["bank_specs"] = specs
    low = {k.lower(): v for k, v in specs.items()}

    def pick(*names: str) -> str | None:
        for n in names:
            if n in low and low[n].strip():
                return low[n].strip()
        return None

    genetics = pick("genetics", "genetic", "parents", "cross")
    if genetics:
        row["genetics"] = genetics
        row["lineage"] = genetics

    thc = pick("thc level", "thc", "thc %", "thc content")
    if thc:
        pair = _pct_pair(thc)
        if pair:
            row["thc_range"] = pair
            row.setdefault("chemistry", {})["thc_range"] = pair
            if pair[0] == pair[1]:
                row["thc"] = pair[0]
                row["chemistry"]["thc"] = pair[0]
        row["thc_label"] = thc

    cbd = pick("cbd level", "cbd", "cbd %", "cbd content")
    if cbd:
        pair = _pct_pair(cbd)
        if pair:
            row["cbd_range"] = pair
            row.setdefault("chemistry", {})["cbd_range"] = pair
            if pair[0] == pair[1]:
                row["cbd"] = pair[0]
                row["chemistry"]["cbd"] = pair[0]
        row["cbd_label"] = cbd

    typ = pick("category type", "type", "strain type")
    if typ:
        row["type"] = typ
        row["type_label"] = typ

    grow_lvl = pick("growing level", "difficulty", "grow difficulty")
    if grow_lvl:
        row["grow_difficulty"] = grow_lvl

    flower = pick("flowering time", "flowering", "flower time")
    if flower:
        row["flowering_time"] = flower
        days = _weeks_to_days(flower)
        if days is not None:
            row["flowering_days"] = days

    ih = pick("indoor height", "height indoor")
    if ih:
        row["height_indoor"] = ih
    oh = pick("outdoor height", "height outdoor")
    if oh:
        row["height_outdoor"] = oh

    harvest = pick("harvest time", "harvest", "outdoor harvest")
    if harvest:
        row["harvest_time"] = harvest

    yi = pick("indoor yields", "indoor yield", "yield indoor")
    if yi:
        row["yield_indoor"] = yi
    yo = pick("outdoor yields", "outdoor yield", "yield outdoor")
    if yo:
        row["yield_outdoor"] = yo

    taste = pick("taste and smell", "taste", "smell", "aroma", "flavor")
    if taste:
        parts = _uniq([p.strip() for p in re.split(r"[,;/]", taste) if p.strip()])
        if parts:
            row["flavors"] = parts
            row["aromas"] = parts
            row["top_flavors"] = parts[:8]

    terps = pick("terpenes", "terpene profile", "dominant terpenes")
    if terps:
        parts = _uniq([p.strip() for p in re.split(r"[,;/]", terps) if p.strip()])
        if parts:
            row["top_terpenes"] = parts
            row.setdefault("chemistry", {})["top_terpenes"] = parts


def strain_name_from_product(name: str) -> str:
    n = name.strip()
    n = re.sub(
        r"\s+(?:Autoflowering|Feminized|Regular|Fast Version)?\s*Marijuana Seeds\s*$",
        "",
        n,
        flags=re.I,
    )
    n = re.sub(r"\s+Seeds\s*$", "", n, flags=re.I)
    n = re.sub(r"\s+Strain\s*$", "", n, flags=re.I)
    return n.strip() or name.strip()


def parse_cropking(html: str, url: str) -> dict:
    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), {})
    name = str(product.get("name") or "").strip()
    if not name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        name = clean(m.group(1)) if m else ""
    if not name:
        name = _meta(html, "og:title") or ""
        name = re.sub(r"\s*\|\s*Crop King Seeds\s*$", "", name, flags=re.I)
        name = re.sub(r"^Buy\s+", "", name, flags=re.I).strip()
    if not name:
        name = unquote(urlparse(url).path.rstrip("/").split("/")[-1]).replace("-", " ")

    parts = [p for p in urlparse(url).path.strip("/").split("/") if p]
    cat = parts[0] if parts else None
    slug = parts[-1] if parts else None

    short = None
    m = re.search(
        r'class=["\'][^"\']*woocommerce-product-details__short-description[^"\']*["\'][^>]*>(.*?)</div>',
        html or "",
        re.I | re.S,
    )
    if m:
        short = clean(m.group(1))
    desc = str(product.get("description") or "").strip() or short
    if not desc:
        desc = _meta(html, "og:description")

    image = product.get("image")
    if isinstance(image, list):
        image = image[0] if image else None
    if isinstance(image, dict):
        image = image.get("url")
    if not image:
        image = _meta(html, "og:image")

    specs = parse_spec_table(html)
    strain = strain_name_from_product(name)
    text = clean(html)

    row: dict = {
        "name": strain[:200],
        "name_norm": name_norm(strain),
        "product_name": name[:240],
        "breeder": "Crop King Seeds",
        "seed_bank": "Crop King Seeds",
        "url": url.split("?")[0].split("#")[0],
        "source": CK_SOURCE,
        "category_slug": cat,
        "slug": slug,
        "description": (desc or "")[:5000] or None,
        "short_description": (short or "")[:2000] or None,
        "image_url": image,
    }

    # seed sex / photoperiod from category
    cat_l = (cat or "").lower()
    if "auto" in cat_l:
        row["seed_type"] = "autoflower"
        row["photoperiod"] = False
    elif "fast-version" in cat_l:
        row["seed_type"] = "fast_version"
    elif "regular" in cat_l:
        row["seed_type"] = "regular"
        row["sex"] = "regular"
    elif "feminized" in cat_l or "fem" in cat_l:
        row["seed_type"] = "feminized"
        row["sex"] = "feminized"
    if "cbd" in cat_l:
        row["chemotype_hint"] = "cbd"

    apply_ck_specs(row, specs)

    grow = parse_grow_fields(f"{short or ''} {desc or ''} {text[:4000]}")
    for k, v in grow.items():
        if k == "chemistry" and isinstance(v, dict):
            chem = dict(row.get("chemistry") or {})
            chem.update({kk: vv for kk, vv in v.items() if kk not in chem})
            row["chemistry"] = chem
        elif k not in row or row.get(k) in (None, "", [], {}):
            row[k] = v

    row["page_text_excerpt"] = text[:2000]
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def parse_dc_pack(title: str) -> dict:
    out: dict = {}
    m = re.search(
        r"(\d+)\s+(Feminized|Regular|Autoflower(?:ing)?)\s+"
        r"(?:Autoflower\s+)?(?:Photoperiod\s+)?Seeds",
        title,
        re.I,
    )
    if m:
        out["pack_size"] = int(m.group(1))
        kind = m.group(2).lower()
        if "auto" in kind:
            out["seed_type"] = "autoflower"
            out["photoperiod"] = False
            out["sex"] = "feminized"
        elif "regular" in kind:
            out["seed_type"] = "regular"
            out["sex"] = "regular"
        else:
            out["seed_type"] = "feminized"
            out["sex"] = "feminized"
            out["photoperiod"] = True
    if re.search(r"\bphotoperiod\b", title, re.I):
        out["photoperiod"] = True
    if re.search(r"\bautoflower", title, re.I):
        out["seed_type"] = "autoflower"
        out["photoperiod"] = False
    return out


def parse_dc_title_parts(title: str) -> dict:
    """Pull strain + optional (parents) + pack suffix from DC titles."""
    out: dict = {}
    # e.g. Lane 8 F1 (Pink Runtz x 711) 3 Feminized Seeds
    m = re.match(
        r"^(.+?)\s*\(([^)]+)\)\s*(\d+\s+.+Seeds.*)?$",
        title.strip(),
        re.I,
    )
    if m:
        out["strain_title"] = m.group(1).strip()
        out["genetics"] = m.group(2).strip()
        return out
    m = re.match(r"^(.+?)\s+(\d+\s+(?:Feminized|Regular|Autoflower).+)$", title.strip(), re.I)
    if m:
        out["strain_title"] = m.group(1).strip()
        return out
    out["strain_title"] = re.sub(
        r"\s+\d+\s+(?:Feminized|Regular|Autoflower).+$",
        "",
        title,
        flags=re.I,
    ).strip() or title
    return out


def parse_dcseed(html: str, url: str) -> dict:
    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), {})
    name = str(product.get("name") or "").strip()
    if not name:
        m = re.search(r"<h1[^>]*class=[\"'][^\"']*product_title[^\"']*[\"'][^>]*>(.*?)</h1>", html or "", re.I | re.S)
        if not m:
            m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        name = clean(m.group(1)) if m else ""
    if not name:
        name = unquote(urlparse(url).path.rstrip("/").split("/")[-1]).replace("-", " ")

    short = None
    m = re.search(
        r'class=["\'][^"\']*woocommerce-product-details__short-description[^"\']*["\'][^>]*>(.*?)</div>',
        html or "",
        re.I | re.S,
    )
    if m:
        short = clean(m.group(1))
    # description tab
    desc = None
    m = re.search(
        r'id=["\']tab-description["\'][^>]*>(.*?)</div>\s*(?:<div|$)',
        html or "",
        re.I | re.S,
    )
    if m:
        desc = clean(m.group(1))
    if not desc:
        desc = str(product.get("description") or "").strip() or short

    image = product.get("image")
    if isinstance(image, list):
        image = image[0] if image else None
    if isinstance(image, dict):
        image = image.get("url")
    if not image:
        image = _meta(html, "og:image")

    # categories / tags — product meta only (page also has full breeder nav)
    meta_chunk = ""
    m = re.search(
        r'class=["\'][^"\']*product_meta[^"\']*["\'][^>]*>(.*?)</div>\s*(?:</div>|$)',
        html or "",
        re.I | re.S,
    )
    if m:
        meta_chunk = m.group(1)
    else:
        # fallback: posted_in / tagged_as spans only
        bits = re.findall(
            r'class=["\'][^"\']*(?:posted_in|tagged_as)[^"\']*["\'][^>]*>(.*?)</span>',
            html or "",
            re.I | re.S,
        )
        meta_chunk = " ".join(bits)

    categories: list[str] = []
    for m in re.finditer(
        r'href=["\']https?://dcseedexchange\.com/product-category/([^/"\']+)/["\'][^>]*>([^<]+)<',
        meta_chunk,
        re.I,
    ):
        categories.append(clean(m.group(2)) or m.group(1).replace("-", " "))
    categories = _uniq(categories)

    tags: list[str] = []
    for m in re.finditer(
        r'href=["\']https?://dcseedexchange\.com/product-tag/([^/"\']+)/["\'][^>]*>([^<]+)<',
        meta_chunk,
        re.I,
    ):
        tags.append(clean(m.group(2)) or m.group(1).replace("-", " "))
    tags = _uniq(tags)

    # breeder from product-category in meta (skip seed-type cats)
    breeder = None
    for m in re.finditer(
        r'href=["\']https?://dcseedexchange\.com/product-category/([^/"\']+)/["\'][^>]*>([^<]+)<',
        meta_chunk,
        re.I,
    ):
        slug = m.group(1).lower()
        label = clean(m.group(2))
        if slug in DC_BREEDER_CAT_SKIP or any(
            x in slug for x in ("feminized", "regular", "autoflower", "auction", "sale", "cbd", "regional")
        ):
            continue
        if label:
            breeder = label
            break

    # short description often starts with "Breeder Name …"
    if short and not breeder:
        m2 = re.match(r"^(.+? Seeds)\s+", short)
        if m2:
            breeder = m2.group(1).strip()

    sku = product.get("sku")
    if not sku:
        m = re.search(r'data-product_sku=["\']([^"\']+)["\']', html or "", re.I)
        if m:
            sku = m.group(1)

    title_parts = parse_dc_title_parts(name)
    strain = title_parts.get("strain_title") or strain_name_from_product(name)
    pack = parse_dc_pack(name + " " + (short or ""))

    text = clean(html)
    # Prefer description region for grow parse (avoid nav noise)
    grow_text = " ".join(x for x in (short, desc, name) if x)

    row: dict = {
        "name": strain[:200],
        "name_norm": name_norm(strain),
        "product_name": name[:240],
        "breeder": breeder or "DC Seed Exchange",
        "seed_bank": "DC Seed Exchange",
        "url": url.split("?")[0].split("#")[0],
        "source": DC_SOURCE,
        "slug": urlparse(url).path.rstrip("/").split("/")[-1],
        "description": (desc or "")[:5000] or None,
        "short_description": (short or "")[:2000] or None,
        "image_url": image,
        "sku": sku,
        "categories": categories or None,
        "tags": tags or None,
    }
    if title_parts.get("genetics"):
        row["genetics"] = title_parts["genetics"]
        row["lineage"] = title_parts["genetics"]
    row.update(pack)

    # type hints from tags/categories
    hay = " ".join(categories + tags).lower()
    if "indica" in hay and "sativa" not in hay:
        row["type"] = "indica"
    elif "sativa" in hay and "indica" not in hay:
        row["type"] = "sativa"
    elif "hybrid" in hay:
        row["type"] = "hybrid"

    flavors = [t for t in tags if t.lower() in {
        "berry", "candy", "cherry", "citrus", "fruity", "gas", "diesel", "earthy",
        "floral", "fuel", "grape", "lemon", "mint", "pine", "skunk", "sweet",
        "tropical", "vanilla", "cream", "cookie", "chocolate", "coffee", "pepper",
    }]
    if flavors:
        row["flavors"] = flavors
        row["top_flavors"] = flavors[:8]

    # Flower Time / Yield labeled lines in description
    m = re.search(r"Flower(?:ing)?\s*Time\s*[:\s]+([0-9][^\n.<]{0,40})", grow_text, re.I)
    if m:
        row["flowering_time"] = m.group(1).strip()
        days = _weeks_to_days(m.group(1))
        if days is not None:
            row["flowering_days"] = days
    m = re.search(
        r"Yield\s*[:\s]+(.+?)(?:\s+\d+\s+(?:Feminized|Regular|Autoflower)|$)",
        grow_text,
        re.I,
    )
    if m:
        row["yield_indoor"] = m.group(1).strip(" .;")[:120]

    grow = parse_grow_fields(grow_text)
    for k, v in grow.items():
        if k == "chemistry" and isinstance(v, dict):
            chem = dict(row.get("chemistry") or {})
            chem.update({kk: vv for kk, vv in v.items() if kk not in chem})
            row["chemistry"] = chem
        elif k not in row or row.get(k) in (None, "", [], {}):
            row[k] = v

    specs = parse_spec_table(html)
    if specs:
        row["bank_specs"] = specs
        apply_ck_specs(row, specs)

    row["page_text_excerpt"] = (desc or text)[:2000]
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def normalize_url(u: str) -> str:
    u = html_lib.unescape((u or "").strip()).split("?")[0].split("#")[0]
    if not u.endswith("/"):
        u += "/"
    return u


def load_sitemap_urls(
    *,
    bank: str,
    delay: float,
    refresh: bool,
) -> list[str]:
    if bank == "cropking":
        sitemaps, cache_name, source = CK_SITEMAPS, "dsc_strains_cropking.sitemap_urls.json", CK_SOURCE
        matcher = CK_PRODUCT_RE
        skip = CK_SKIP_SLUG
    else:
        sitemaps, cache_name, source = DC_SITEMAPS, "dsc_strains_dcseedexchange.sitemap_urls.json", DC_SOURCE
        matcher = DC_PRODUCT_RE
        skip = DC_SKIP_SLUG

    cache = DATA / cache_name
    if cache.exists() and not refresh:
        try:
            cached = json.loads(cache.read_text(encoding="utf-8"))
            urls = [u for u in (cached.get("urls") or [])]
            if urls:
                print(f"{source}: sitemap cache {len(urls)} URLs from {cache.name}")
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    urls: list[str] = []
    seen: set[str] = set()
    for sm in sitemaps:
        print(f"{source}: fetching {sm}")
        try:
            xml = polite_get(sm, delay=delay, timeout=180)
        except Exception as exc:  # noqa: BLE001
            print(f"  sitemap fail {sm}: {exc}")
            continue
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)
        print(f"  locs={len(locs)}")
        for loc in locs:
            u = normalize_url(loc)
            path = urlparse(u).path
            slug = path.rstrip("/").split("/")[-1]
            bare = u.rstrip("/")
            if not (matcher.match(bare) or matcher.match(u)):
                continue
            if skip.search(slug):
                continue
            if u in seen:
                continue
            seen.add(u)
            urls.append(u)

    cache.write_text(
        json.dumps(
            {
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "source": source,
                "sitemaps": sitemaps,
                "count": len(urls),
                "urls": urls,
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )
    print(f"{source}: cached {len(urls)} product URLs")
    return urls


def paths_for(bank: str) -> tuple[Path, Path, str, str, Callable[[str, str], dict]]:
    if bank == "cropking":
        return (
            DATA / "dsc_strains_cropking.json",
            DATA / "dsc_strains_cropking.checkpoint.json",
            CK_SOURCE,
            CK_SOURCE_URL,
            parse_cropking,
        )
    return (
        DATA / "dsc_strains_dcseedexchange.json",
        DATA / "dsc_strains_dcseedexchange.checkpoint.json",
        DC_SOURCE,
        DC_SOURCE_URL,
        parse_dcseed,
    )


def save_checkpoint(ck: Checkpoint, done: set[str], cursor: str | None = None) -> None:
    ck.data["done"] = sorted(done)
    if cursor is not None:
        ck.data["cursor"] = cursor
    ck.data["done_count"] = len(done)
    ck.save()


def scrape_bank(
    bank: str,
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool,
    checkpoint_every: int,
) -> Path:
    out, ck_path, source, source_url, parse_fn = paths_for(bank)
    urls = load_sitemap_urls(bank=bank, delay=delay, refresh=refresh_sitemap)

    ck = Checkpoint(ck_path)
    done = set(ck.data.get("done") or [])
    items: list[dict] = []
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            items = []
    by_url = {i.get("url"): i for i in items if i.get("url")}
    # Re-queue checkpoint-done URLs missing from dump
    for u in list(done):
        if u not in by_url:
            done.discard(u)

    pending = [u for u in urls if u not in done or u not in by_url]
    if limit is not None:
        pending = pending[: max(0, limit)]

    blockers: list[str] = []
    consecutive_walls = 0
    scraped_this_run = 0
    t0 = time.time()

    print(
        f"{source}: sitemap={len(urls)} pending={len(pending)} "
        f"resume done={len(done)} dump_items={len(items)}"
        + (f" batch_limit={limit}" if limit is not None else ""),
        flush=True,
    )

    for idx, url in enumerate(pending, 1):
        if scraped_this_run == 0:
            print(f"  fetching first pending: {url}", flush=True)

        try:
            html = polite_get_retry(url, delay=delay, timeout=60, retries=4)
            if is_bot_wall(html):
                msg = f"BOT_WALL {url}"
                blockers.append(msg)
                ck.note_error(msg)
                consecutive_walls += 1
                print(f"  blocker: {msg}", flush=True)
                if consecutive_walls >= 5:
                    print("aborting: repeated bot walls", flush=True)
                    break
                continue
            consecutive_walls = 0
            row = parse_fn(html, url)
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
            # Persist done-set frequently — host kills long runs before fat dump
            if scraped_this_run % 5 == 0:
                save_checkpoint(ck, done, cursor=url)
            if scraped_this_run <= 3 or scraped_this_run % 10 == 0:
                print(
                    f"  ok #{scraped_this_run} idx={idx}/{len(pending)} name={row.get('name')!r}",
                    flush=True,
                )
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            print(f"  fail {msg}", flush=True)
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(pending):
            items = list(by_url.values())
            save_checkpoint(ck, done, cursor=url)
            write_dump(
                out,
                "strains",
                items,
                source=source,
                source_url=source_url,
                license=NOTE,
                redistributable=False,
                note=f"partial checkpoint {len(items)}/{len(urls)}",
                blockers=(blockers or [])[-30:],
                compact=True,
            )
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} done={len(done)} "
                f"this_run={scraped_this_run} rate={rate:.2f}/s batch={idx}/{len(pending)}",
                flush=True,
            )

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    save_checkpoint(ck, done)
    write_dump(
        out,
        "strains",
        items,
        source=source,
        source_url=source_url,
        license=NOTE,
        redistributable=False,
        note=f"{source} sitemap scrape "
        + ("batch complete" if limit is not None else "complete"),
        blockers=(blockers or [])[-30:],
        compact=len(items) >= 800,
    )
    print(f"wrote {out.name} count={len(items)} errors={len(ck.data.get('errors') or [])}", flush=True)
    return out


def stage_dump(bank: str, *, reset: bool = True) -> dict:
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    out, _, source, _, _ = paths_for(bank)
    if not out.exists():
        raise FileNotFoundError(out)
    st = write_dump_to_staging(out, source_id=source, reset=reset)
    print(
        "staging:",
        json.dumps(
            {k: st[k] for k in ("family", "staging_db", "count", "stats") if k in st},
            indent=2,
            default=str,
        ),
    )
    return st


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape Crop King + DC Seed Exchange via sitemaps")
    ap.add_argument("--bank", choices=["cropking", "dcseedexchange", "both"], default="both")
    ap.add_argument("--delay", type=float, default=0.5)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--sitemap-only", action="store_true")
    ap.add_argument("--stage", action="store_true", help="write staging sqlite after scrape")
    ap.add_argument("--stage-only", action="store_true", help="skip scrape; stage existing dumps")
    args = ap.parse_args(argv)

    banks = ["cropking", "dcseedexchange"] if args.bank == "both" else [args.bank]
    DATA.mkdir(parents=True, exist_ok=True)

    if args.stage_only:
        for b in banks:
            stage_dump(b)
        return 0

    if args.sitemap_only:
        for b in banks:
            urls = load_sitemap_urls(bank=b, delay=args.delay, refresh=True)
            print(json.dumps({"bank": b, "sitemap_urls": len(urls), "sample": urls[:5]}, indent=2))
        return 0

    for b in banks:
        scrape_bank(
            b,
            delay=args.delay,
            limit=args.limit,
            refresh_sitemap=args.refresh_sitemap,
            checkpoint_every=max(5, args.checkpoint_every),
        )
        if args.stage:
            stage_dump(b)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
