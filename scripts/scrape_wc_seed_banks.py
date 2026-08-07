#!/usr/bin/env python3
"""WooCommerce seed-bank scrapers via product sitemaps (research corpus).

Banks:
  - multiverse       Multiverse Beans — product-sitemap*.xml (/product/…)
  - weedseedsexpress Weed Seeds Express — sitemap-en.xml (/product/…)
  - pacific          Pacific Seed Bank — product-sitemap (nested /shop-all-…/…-seeds/)

Checkpoint/resume; fat dumps under homeassistant/data/; staging under
brain/data/staging/ with FULL raw_record. redistributable=false.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import random
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402

LICENSE = "research archival scrape; redistributable=false until legal review"

BANKS: dict[str, dict[str, Any]] = {
    "multiverse": {
        "source_id": "multiverse",
        "source_url": "https://multiversebeans.com/shop/",
        "home": "https://multiversebeans.com/",
        "sitemap_index": "https://multiversebeans.com/sitemap_index.xml",
        "sitemap_urls": None,  # filled from index product-sitemap*
        "product_re": re.compile(
            r"^https?://(?:www\.)?multiversebeans\.com/product/[a-z0-9\-]+/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*\|\s*Multiverse Beans(?: Seed Bank)?\s*$",
            re.I,
        ),
    },
    "weedseedsexpress": {
        "source_id": "weedseedsexpress",
        "source_url": "https://weedseedsexpress.com/",
        "home": "https://weedseedsexpress.com/",
        "sitemap_index": None,
        "sitemap_urls": ["https://weedseedsexpress.com/sitemap-en.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?weedseedsexpress\.com/product/[a-z0-9\-]+/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[-–|]\s*WSE(?:\s+Europe)?\s*$",
            re.I,
        ),
    },
    # Nested Woo category paths (not /product/{slug}). Prefer leaf slugs with "seed".
    "pacific": {
        "source_id": "pacific",
        "source_url": "https://www.pacificseedbank.com/",
        "home": "https://www.pacificseedbank.com/",
        "sitemap_index": "https://www.pacificseedbank.com/sitemap_index.xml",
        "sitemap_urls": [
            "https://www.pacificseedbank.com/product-sitemap.xml",
            "https://www.pacificseedbank.com/product-sitemap1.xml",
        ],
        "product_re": re.compile(
            r"^https?://(?:www\.)?pacificseedbank\.com/shop-all-marijuana-seeds/"
            r"(?:[a-z0-9\-]+/)+[a-z0-9\-]*seed[a-z0-9\-]*/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*Pacific Seed Bank.*$",
            re.I,
        ),
    },
}


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", t)
    t = re.sub(r"(?is)<noscript\b[^>]*>.*?</noscript>", " ", t)
    t = re.sub(r"(?is)<!--.*?-->", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


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
        docs = doc if isinstance(doc, list) else [doc]
        for d in docs:
            if not isinstance(d, dict):
                continue
            if "@graph" in d and isinstance(d["@graph"], list):
                out.extend(x for x in d["@graph"] if isinstance(x, dict))
            else:
                out.append(d)
    return out


def sitemap_locs(body: str) -> list[str]:
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body or "", re.I)


def normalize_url(url: str) -> str:
    u = (url or "").strip().split("#")[0].split("?")[0]
    if u.endswith("/") and "/product/" in u:
        u = u.rstrip("/")
    return u


def load_product_urls(bank: str, cfg: dict, *, delay: float, refresh: bool) -> list[str]:
    cache = DATA / f"dsc_strains_{bank}.sitemap_urls.json"
    if cache.exists() and not refresh:
        try:
            doc = json.loads(cache.read_text(encoding="utf-8"))
            urls = [normalize_url(u) for u in (doc.get("urls") or [])]
            if urls:
                print(f"{bank}: sitemap cache {len(urls)} from {cache.name}", flush=True)
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    sm_urls: list[str] = list(cfg.get("sitemap_urls") or [])
    if cfg.get("sitemap_index"):
        print(f"{bank}: fetching sitemap index {cfg['sitemap_index']}", flush=True)
        idx_body = polite_get(cfg["sitemap_index"], delay=delay, timeout=60)
        for loc in sitemap_locs(idx_body):
            if "product-sitemap" in loc.lower():
                sm_urls.append(loc)
        sm_urls = sorted(set(sm_urls))

    product_re: re.Pattern[str] = cfg["product_re"]
    found: set[str] = set()
    for sm in sm_urls:
        try:
            body = polite_get(sm, delay=delay, timeout=90)
        except Exception as exc:  # noqa: BLE001
            print(f"  sitemap fail {sm}: {exc}", flush=True)
            continue
        n = 0
        for loc in sitemap_locs(body):
            u = normalize_url(loc)
            if product_re.match(u):
                found.add(u)
                n += 1
        print(f"  {sm} -> {n} products", flush=True)

    urls = sorted(found)
    cache.write_text(
        json.dumps(
            {
                "bank": bank,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "sitemaps": sm_urls,
                "count": len(urls),
                "urls": urls,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"{bank}: sitemap total {len(urls)} (cached {cache.name})", flush=True)
    return urls


def meta_content(html: str, prop: str) -> str | None:
    m = re.search(
        rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop)}["\'][^>]+content=["\']([^"\']+)',
        html or "",
        re.I,
    ) or re.search(
        rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{re.escape(prop)}["\']',
        html or "",
        re.I,
    )
    return html_lib.unescape(m.group(1)).strip() if m else None


def brand_name(val: Any) -> str | None:
    if isinstance(val, dict):
        n = val.get("name")
        return str(n).strip() if n else None
    if isinstance(val, str) and val.strip():
        return val.strip()
    return None


def parse_wse_spec_block(text: str) -> dict[str, Any]:
    """Parse Weed Seeds Express Genetics/THC/Flowering/Yield/Aroma blocks."""
    props: dict[str, Any] = {}
    m = re.search(
        r"Genetics:\s*([^\n]+?)(?:\s+THC Content:|\s+Flowering Time:|\s+Yield:|\s+Aroma|$)",
        text,
        re.I,
    )
    if m:
        props["genetics_label"] = m.group(1).strip()[:240]
        g = m.group(1)
        for kind, key in (
            ("Indica", "indica_pct"),
            ("Sativa", "sativa_pct"),
            ("Ruderalis", "ruderalis_pct"),
        ):
            mm = re.search(rf"(\d+)\s*%\s*{kind}", g, re.I)
            if mm:
                props[key] = int(mm.group(1))
        if re.search(r"autoflower", g, re.I):
            props["flowering_behavior"] = "autoflower"
            props.setdefault("seed_type", "autoflower")

    m = re.search(r"THC Content:\s*(?:Up to\s*)?([\d.]+)\s*%", text, re.I)
    if m:
        thc = float(m.group(1))
        props["thc"] = thc
        props["thc_range"] = [thc, thc]
        props.setdefault("chemistry", {})["thc"] = thc
        props["chemistry"]["thc_range"] = [thc, thc]

    m = re.search(r"CBD Content:\s*(?:Up to\s*)?([\d.]+)\s*%", text, re.I)
    if m:
        cbd = float(m.group(1))
        props["cbd"] = cbd
        props["cbd_range"] = [cbd, cbd]
        props.setdefault("chemistry", {})["cbd"] = cbd
        props["chemistry"]["cbd_range"] = [cbd, cbd]

    m = re.search(
        r"Flowering Time:\s*(\d+)\s*[-–]\s*(\d+)\s*weeks?",
        text,
        re.I,
    )
    if m:
        props["flowering_weeks"] = [int(m.group(1)), int(m.group(2))]
        props["flowering_days"] = [int(m.group(1)) * 7, int(m.group(2)) * 7]
    else:
        m = re.search(r"Flowering Time:\s*(\d+)\s*weeks?", text, re.I)
        if m:
            w = int(m.group(1))
            props["flowering_weeks"] = w
            props["flowering_days"] = w * 7

    m = re.search(r"Yield:\s*(.+?)(?:\s+Aroma|\s+Effects|$)", text, re.I)
    if m:
        props["yield_label"] = m.group(1).strip()[:240]
        yi = re.search(r"([\d.]+)\s*g/m", m.group(1), re.I)
        if yi:
            props["yield_indoor_g_m2"] = float(yi.group(1))
        yo = re.search(r"([\d.]+)\s*g/plant", m.group(1), re.I)
        if yo:
            props["yield_outdoor_g_plant"] = float(yo.group(1))

    m = re.search(r"Aroma\s*(?:&\s*)?Effects?:\s*(.+)$", text, re.I)
    if m:
        aroma_raw = m.group(1).strip()
        # cut page bleed if description was concatenated with body
        aroma_raw = re.split(
            r"\b(?:Select your|home Collections|continue shopping)\b",
            aroma_raw,
            maxsplit=1,
        )[0].strip()
        bits = [x.strip(" .") for x in re.split(r"[,;/]", aroma_raw) if x.strip(" .")]
        bits = [b for b in bits if len(b) < 40][:8]
        if bits:
            # WSE lists aroma then effect adjectives together
            props["aromas"] = bits[:3]
            props["top_flavors"] = bits[:3]
            if len(bits) >= 2:
                props["effects"] = bits[-2:]
                props["top_effects"] = bits[-2:]
    return props


def parse_multiverse_name(raw: str) -> dict[str, Any]:
    """'IN HOUSE GENETICS - PLATINUM FLOAT STRAIN - FEM PHOTO' → parts."""
    name = re.sub(r"\s*\|\s*Multiverse Beans(?: Seed Bank)?\s*$", "", raw or "", flags=re.I).strip()
    parts = [p.strip() for p in re.split(r"\s+[-–]\s+", name) if p.strip()]
    out: dict[str, Any] = {"display_name": name}
    if len(parts) >= 2:
        out["breeder_guess"] = parts[0]
        strain_parts = []
        flags = []
        for p in parts[1:]:
            pl = p.lower()
            if re.fullmatch(r"(fem|feminized|reg|regular|auto|autoflower|photo|photoperiod|"
                            r"fem photo|fem auto|auto fem|3 pack|6 pack|\d+\s*pack)", pl):
                flags.append(p)
            elif "strain" in pl and len(p.split()) <= 6:
                strain_parts.append(re.sub(r"\s*strain\s*$", "", p, flags=re.I).strip())
            else:
                strain_parts.append(p)
        if strain_parts:
            out["strain_name"] = " ".join(strain_parts).strip()
        if flags:
            out["pack_flags"] = flags
            joined = " ".join(flags).lower()
            if "auto" in joined:
                out["seed_type"] = "autoflower"
                out["flowering_behavior"] = "autoflower"
            elif "photo" in joined:
                out["seed_type"] = "photoperiod"
                out["flowering_behavior"] = "photoperiod"
            if "fem" in joined:
                out["seed_gender"] = "feminized"
            elif "reg" in joined:
                out["seed_gender"] = "regular"
    return out


def extract_categories(html: str) -> list[str]:
    """Prefer on-product taxonomy; fall back to sparse product-category links."""
    labels: list[str] = []

    def add(lab: str) -> None:
        lab = clean(lab)
        if not lab:
            return
        low = lab.lower()
        if low.startswith("shop ") or low in {"home", "products", "breeders"}:
            return
        if low not in {x.lower() for x in labels}:
            labels.append(lab)

    # Woo "posted in" / product meta
    m = re.search(
        r'class=["\'][^"\']*posted_in[^"\']*["\'][^>]*>(.*?)</span>',
        html or "",
        re.I | re.S,
    )
    if m:
        for lab in re.findall(r">([^<]+)<", m.group(1)):
            add(lab)

    m = re.search(
        r'class=["\'][^"\']*tagged_as[^"\']*["\'][^>]*>(.*?)</span>',
        html or "",
        re.I | re.S,
    )
    if m:
        for lab in re.findall(r">([^<]+)<", m.group(1)):
            add(lab)

    if labels:
        return labels[:20]

    # BreadcrumbList from JSON-LD already handled by caller; sparse href fallback
    for m in re.finditer(
        r'href=["\'][^"\']*product-category/([^"\']+)["\'][^>]*>([^<]+)<',
        html or "",
        re.I,
    ):
        slug = m.group(1).strip("/").lower()
        # skip top-level nav dumps
        if slug in {"autoflower", "photoperiod", "breeders", "bundle", "bogo", "best-sellers"}:
            continue
        if slug.startswith("breeders/") or "preservation" in slug:
            add(m.group(2))
    return labels[:20]


def extract_variations(html: str) -> list[dict] | None:
    m = re.search(r"data-product_variations=(['\"])(.*?)\1", html or "", re.I | re.S)
    if not m:
        return None
    try:
        raw = html_lib.unescape(m.group(2))
        vars_ = json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return None
    if not isinstance(vars_, list):
        return None
    slim = []
    for v in vars_:
        if not isinstance(v, dict):
            continue
        slim.append(
            {
                k: v.get(k)
                for k in (
                    "variation_id",
                    "sku",
                    "display_price",
                    "display_regular_price",
                    "attributes",
                    "is_in_stock",
                    "weight",
                    "dimensions",
                )
                if v.get(k) not in (None, "", [], {})
            }
        )
    return slim or None


def parse_product(html: str, url: str, *, bank: str, cfg: dict) -> dict[str, Any]:
    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), {}) or {}

    raw_name = str(product.get("name") or "").strip()
    if not raw_name:
        raw_name = meta_content(html, "og:title") or ""
    if not raw_name:
        m = re.search(r"<title[^>]*>(.*?)</title>", html or "", re.I | re.S)
        raw_name = clean(m.group(1)) if m else ""
    if not raw_name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        raw_name = clean(m.group(1)) if m else ""
    if not raw_name:
        raw_name = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ")

    suffix_re = cfg.get("site_suffix_re")
    display = suffix_re.sub("", raw_name).strip() if suffix_re else raw_name
    display = re.sub(r"\s*\|\s*.*$", "", display).strip() or display

    description = html_lib.unescape(str(product.get("description") or "")).strip()
    if not description:
        description = meta_content(html, "og:description") or ""
    m = re.search(
        r'class=["\'][^"\']*woocommerce-product-details__short-description[^"\']*["\'][^>]*>(.*?)</div>',
        html or "",
        re.I | re.S,
    )
    short = clean(m.group(1)) if m else None
    if short and (not description or len(short) > len(description)):
        description = short

    sku = product.get("sku")
    brand = brand_name(product.get("brand"))
    category = product.get("category")
    if isinstance(category, str):
        category = html_lib.unescape(category)

    images = product.get("image") or []
    if isinstance(images, dict):
        images = [images.get("url")]
    elif isinstance(images, str):
        images = [images]
    image_url = None
    if images:
        first = images[0]
        image_url = first.get("url") if isinstance(first, dict) else str(first)

    offers = product.get("offers")
    price = None
    currency = None
    availability = None
    if isinstance(offers, list) and offers:
        offers = offers[0]
    if isinstance(offers, dict):
        try:
            price = float(offers.get("price"))
        except (TypeError, ValueError):
            price = None
        currency = offers.get("priceCurrency")
        availability = offers.get("availability")

    agg = product.get("aggregateRating")
    rating = review_count = None
    if isinstance(agg, dict):
        try:
            rating = float(agg.get("ratingValue"))
        except (TypeError, ValueError):
            rating = None
        try:
            review_count = int(float(agg.get("reviewCount") or agg.get("ratingCount") or 0)) or None
        except (TypeError, ValueError):
            review_count = None

    text = clean(html)
    grow = parse_grow_fields(text)
    cats = extract_categories(html)
    variations = extract_variations(html)
    slug = urlparse(url).path.rstrip("/").split("/")[-1]

    # Prefer strain-facing name
    name = display
    breeder = brand
    extra: dict[str, Any] = {}

    if bank == "multiverse":
        parsed = parse_multiverse_name(display)
        extra.update({k: v for k, v in parsed.items() if k != "display_name"})
        if parsed.get("strain_name"):
            name = parsed["strain_name"]
        if parsed.get("breeder_guess"):
            breeder = parsed["breeder_guess"]
        # Pipe titles: Strain | Breeder | FEM Autoflower Seeds | Multiverse...
        if "|" in raw_name:
            segs = [s.strip() for s in raw_name.split("|") if s.strip()]
            if segs:
                name = re.sub(
                    r"\s*\|\s*Multiverse Beans(?: Seed Bank)?\s*$",
                    "",
                    segs[0],
                    flags=re.I,
                ).strip() or name
            if len(segs) >= 2 and not breeder:
                cand = segs[1]
                if "multiverse" not in cand.lower() and "seed" not in cand.lower():
                    breeder = cand
            joined = " | ".join(segs).lower()
            if "auto" in joined:
                extra["seed_type"] = "autoflower"
                extra["flowering_behavior"] = "autoflower"
            elif "photo" in joined:
                extra["seed_type"] = "photoperiod"
                extra["flowering_behavior"] = "photoperiod"
            if re.search(r"\bfem", joined):
                extra["seed_gender"] = "feminized"
            elif re.search(r"\breg", joined):
                extra["seed_gender"] = "regular"
        # category "Breeders > In House Genetics"
        if isinstance(category, str) and ">" in category:
            breeder = category.split(">")[-1].strip() or breeder
        # lineage often in description / og:description
        if description and (" x " in description.lower() or "bx" in description.lower()):
            extra["lineage"] = description[:240]
            extra["genetic_background"] = description[:240]
        low = f"{name} {slug} {raw_name}".lower()
        if "auto" in low:
            extra.setdefault("seed_type", "autoflower")
            extra.setdefault("flowering_behavior", "autoflower")
        if re.search(r"\bfem", low):
            extra.setdefault("seed_gender", "feminized")

    if bank == "weedseedsexpress":
        # strip trailing "Seeds"
        name = re.sub(r"\s+Seeds?\s*$", "", name, flags=re.I).strip() or name
        # retailer brand is not the breeder
        if brand and "weedseed" in brand.lower():
            breeder = None
        # Specs live in JSON-LD description — do NOT scan full page chrome.
        wse = parse_wse_spec_block(description or "")
        if not wse.get("thc"):
            # fallback: first 1200 chars of cleaned body only
            wse.update({k: v for k, v in parse_wse_spec_block(text[:1200]).items() if k not in wse})
        extra.update(wse)
        # type from name/url
        low = f"{name} {url}".lower()
        if "auto" in low:
            extra.setdefault("seed_type", "autoflower")
            extra.setdefault("flowering_behavior", "autoflower")
        elif "regular" in low:
            extra.setdefault("seed_gender", "regular")
        if "fem" in low or "feminized" in (description or "").lower():
            extra.setdefault("seed_gender", "feminized")

    # chemistry merge from grow regex if missing
    chemistry = {}
    if isinstance(extra.get("chemistry"), dict):
        chemistry.update(extra.pop("chemistry"))
    if grow.get("thc") is not None and "thc" not in chemistry:
        chemistry["thc"] = grow["thc"]
        if grow.get("thc_range"):
            chemistry["thc_range"] = grow["thc_range"]
    if grow.get("cbd") is not None and "cbd" not in chemistry:
        chemistry["cbd"] = grow["cbd"]

    row: dict[str, Any] = {
        "name": name[:200],
        "name_norm": name_norm(name),
        "name_raw": raw_name[:300],
        "display_name": display[:300],
        "breeder": breeder,
        "brand": brand,
        "bank": bank,
        "source": bank,
        "url": normalize_url(url),
        "slug": slug,
        "sku": str(sku) if sku else None,
        "description": (description[:4000] if description else None),
        "category": category if isinstance(category, str) else None,
        "categories": cats or None,
        "image_url": image_url,
        "price": price,
        "currency": currency,
        "availability": availability,
        "rating": rating,
        "review_count": review_count,
        "variations": variations,
        "variation_count": len(variations) if variations else None,
        "page_text_excerpt": text[:1200],
    }
    row.update(grow)
    row.update({k: v for k, v in extra.items() if v not in (None, "", [], {})})
    if chemistry:
        row["chemistry"] = chemistry
        for k, v in chemistry.items():
            row.setdefault(k, v)

    # type hint
    if not row.get("type"):
        if row.get("indica_pct") is not None and row.get("sativa_pct") is not None:
            if row["indica_pct"] > row["sativa_pct"] + 10:
                row["type"] = "indica"
            elif row["sativa_pct"] > row["indica_pct"] + 10:
                row["type"] = "sativa"
            else:
                row["type"] = "hybrid"

    # drop empties
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def save_checkpoint(
    ck: Checkpoint,
    done: set[str],
    *,
    skipped_404: set[str] | None = None,
    cursor: str | None = None,
) -> None:
    ck.data["done"] = sorted(done)
    ck.data["done_count"] = len(done)
    if skipped_404 is not None:
        ck.data["skipped_404"] = sorted(skipped_404)
        ck.data["skipped_404_count"] = len(skipped_404)
    if cursor is not None:
        ck.data["cursor"] = cursor
    try:
        ck.save()
    except OSError:
        ck.path.write_text(json.dumps(ck.data, indent=2), encoding="utf-8")


def stage_dump(bank: str, *, reset: bool = True) -> dict:
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    out = DATA / f"dsc_strains_{bank}.json"
    if not out.exists():
        raise FileNotFoundError(out)
    st = write_dump_to_staging(out, source_id=bank, reset=reset)
    print(
        f"{bank} staging:",
        json.dumps(
            {k: st[k] for k in ("family", "staging_db", "count", "bulk", "store_raw", "stats") if k in st},
            indent=2,
            default=str,
        ),
        flush=True,
    )
    return st


def _jittered_delay(delay: float) -> float:
    """Base delay plus polite jitter (never faster than delay)."""
    base = max(0.0, float(delay))
    # 0.4–1.2s extra jitter, scaled up slightly for slower bases.
    jitter = random.uniform(0.4, max(1.2, base * 0.35))
    return base + jitter


def polite_get_product(url: str, *, delay: float, bank: str) -> tuple[str, str]:
    """GET product HTML. Multiverse Woo PDPs prefer a trailing slash.

    On HTTP 429: minute-scale backoff and retry the same URL. After sustained
    429 walls, raise RuntimeError('HTTP_429_STORM …') so the caller can stop
    cleanly with checkpoint intact.
    """
    if bank == "multiverse":
        # One attempt with trailing slash — stale sitemap locs 404 either way;
        # do not double-hit every dead URL.
        target = url if url.endswith("/") else (url + "/")
    else:
        target = url

    max_429_rounds = 6  # ~2+4+6+8+10+12 min ≈ 42 min of backoff
    for round_i in range(max_429_rounds + 1):
        d = _jittered_delay(delay)
        try:
            html = polite_get(target, delay=d, timeout=90)
            return html, normalize_url(target)
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            if "HTTP 429" not in msg:
                raise
            if round_i >= max_429_rounds:
                raise RuntimeError(
                    f"HTTP_429_STORM after {max_429_rounds} minute-scale backoffs for {target}"
                ) from exc
            # 2, 4, 6, 8, 10, 12 minutes (capped at 15)
            wait = min(900, 120 * (round_i + 1))
            wait += random.uniform(5.0, 45.0)
            print(
                f"  429 backoff {wait / 60.0:.1f}min "
                f"(round {round_i + 1}/{max_429_rounds}) {target}",
                flush=True,
            )
            time.sleep(wait)
    raise RuntimeError(f"HTTP_429_STORM for {target}")


def scrape_bank(
    bank: str,
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool,
    checkpoint_every: int,
    stage_every: int,
) -> Path:
    cfg = BANKS[bank]
    out = DATA / f"dsc_strains_{bank}.json"
    ck_path = DATA / f"dsc_strains_{bank}.checkpoint.json"
    urls = load_product_urls(bank, cfg, delay=delay, refresh=refresh_sitemap)
    if limit is not None:
        urls = urls[: max(0, limit)]

    ck = Checkpoint(ck_path)
    done = set(ck.data.get("done") or [])
    skipped: set[str] = set(ck.data.get("skipped_404") or [])
    # legacy: errors that were pure 404s
    for err in ck.data.get("errors") or []:
        msg = str((err or {}).get("msg") or "")
        if "HTTP 404" in msg or "HTTP 410" in msg:
            m = re.search(r"https?://\S+", msg)
            if m:
                skipped.add(normalize_url(m.group(0).rstrip(":")))

    items: list[dict] = []
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            items = []
    by_url = {normalize_url(str(i.get("url"))): i for i in items if i.get("url")}
    done |= set(by_url.keys())
    blockers: list[str] = []
    consecutive_walls = 0
    scraped_this_run = 0
    skipped_404 = 0
    last_staged_at = 0
    hard_stop_reason: str | None = None
    t0 = time.time()

    print(
        f"{bank}: queued={len(urls)} resume_done={len(done)} "
        f"skipped_404_cache={len(skipped)} dump_items={len(items)}",
        flush=True,
    )

    for idx, url in enumerate(urls, 1):
        url = normalize_url(url)
        if url in by_url:
            done.add(url)
            continue
        if url in skipped:
            continue

        try:
            html, final_url = polite_get_product(url, delay=delay, bank=bank)
            url = normalize_url(final_url)
            if url in by_url:
                done.add(url)
                continue
            if is_bot_wall(html):
                msg = f"BOT_WALL {url}"
                blockers.append(msg)
                ck.note_error(msg)
                consecutive_walls += 1
                print(f"  blocker: {msg}", flush=True)
                if consecutive_walls >= 5:
                    print(f"{bank}: aborting — repeated bot walls", flush=True)
                    break
                continue
            consecutive_walls = 0
            row = parse_product(html, url, bank=bank, cfg=cfg)
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            if "HTTP_429_STORM" in str(exc):
                hard_stop_reason = "HTTP_429_STORM"
                blockers.append(msg)
                ck.note_error(msg)
                print(f"  HARD STOP 429 storm: {msg}", flush=True)
                save_checkpoint(ck, done, skipped_404=skipped, cursor=url)
                items = list(by_url.values())
                try:
                    write_dump(
                        out,
                        "strains",
                        items,
                        source=bank,
                        source_url=cfg["source_url"],
                        license=LICENSE,
                        redistributable=False,
                        note=(
                            f"partial checkpoint {len(items)}/{len(urls)} "
                            f"skipped_404={len(skipped)} hard_stop=HTTP_429_STORM"
                        ),
                        blockers=blockers[-40:],
                        skipped_404=len(skipped),
                    )
                except OSError as wexc:
                    print(f"  dump write warn: {wexc}", flush=True)
                break
            if "HTTP 404" in str(exc) or "HTTP 410" in str(exc):
                skipped_404 += 1
                skipped.add(url)
                if skipped_404 <= 5 or skipped_404 % 50 == 0:
                    print(f"  skip 404 ({skipped_404}) {url}", flush=True)
            elif "HTTP 500" in str(exc) or "HTTP 502" in str(exc) or "HTTP 503" in str(exc):
                # transient — record but do not mark skipped so resume can retry
                blockers.append(msg)
                ck.note_error(msg)
                print(f"  fail {msg}", flush=True)
            else:
                blockers.append(msg)
                ck.note_error(msg)
                print(f"  fail {msg}", flush=True)
            if idx % checkpoint_every == 0:
                print(
                    f"  {bank} progress idx={idx}/{len(urls)} ok={len(by_url)} "
                    f"404={len(skipped)} this_run={scraped_this_run}",
                    flush=True,
                )
                save_checkpoint(ck, done, skipped_404=skipped, cursor=url)
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(urls):
            items = list(by_url.values())
            save_checkpoint(ck, done, skipped_404=skipped, cursor=url)
            try:
                write_dump(
                    out,
                    "strains",
                    items,
                    source=bank,
                    source_url=cfg["source_url"],
                    license=LICENSE,
                    redistributable=False,
                    note=f"partial checkpoint {len(items)}/{len(urls)} skipped_404={len(skipped)}",
                    blockers=blockers[-40:],
                    skipped_404=len(skipped),
                )
            except OSError as exc:
                print(f"  dump write warn: {exc}", flush=True)
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  {bank} checkpoint items={len(items)} done={len(done)} "
                f"404={len(skipped)} this_run={scraped_this_run} rate={rate:.2f}/s "
                f"idx={idx}/{len(urls)}",
                flush=True,
            )
            if stage_every > 0 and (len(items) - last_staged_at) >= stage_every:
                try:
                    stage_dump(bank, reset=True)
                    last_staged_at = len(items)
                except Exception as exc:  # noqa: BLE001
                    print(f"  staging warn: {exc}", flush=True)

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    save_checkpoint(ck, done, skipped_404=skipped)
    if hard_stop_reason:
        note = (
            f"partial checkpoint {len(items)}/{len(urls)} "
            f"skipped_404={len(skipped)} hard_stop={hard_stop_reason}"
        )
    elif len(done) >= len(urls) or len(items) + len(skipped) >= len(urls):
        note = "woocommerce product-sitemap scrape complete"
    else:
        note = (
            f"partial checkpoint {len(items)}/{len(urls)} "
            f"skipped_404={len(skipped)}"
        )
    write_dump(
        out,
        "strains",
        items,
        source=bank,
        source_url=cfg["source_url"],
        license=LICENSE,
        redistributable=False,
        note=note,
        sitemap_count=len(urls),
        skipped_404=len(skipped),
        blockers=blockers[-40:],
    )
    print(
        f"wrote {out.name} count={len(items)} skipped_404={len(skipped)} "
        f"errors={len(ck.data.get('errors') or [])}"
        + (f" hard_stop={hard_stop_reason}" if hard_stop_reason else ""),
        flush=True,
    )
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape WooCommerce seed banks via sitemaps")
    ap.add_argument("--bank", choices=list(BANKS) + ["all"], default="all")
    ap.add_argument("--delay", type=float, default=0.55)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--stage-every", type=int, default=400)
    ap.add_argument("--sitemap-only", action="store_true")
    ap.add_argument("--stage-only", action="store_true")
    ap.add_argument("--no-stage", action="store_true")
    args = ap.parse_args(argv)

    DATA.mkdir(parents=True, exist_ok=True)
    banks = list(BANKS) if args.bank == "all" else [args.bank]

    if args.stage_only:
        for b in banks:
            stage_dump(b, reset=True)
        return 0

    if args.sitemap_only:
        for b in banks:
            urls = load_product_urls(b, BANKS[b], delay=args.delay, refresh=True)
            print(json.dumps({"bank": b, "count": len(urls), "sample": urls[:5]}, indent=2))
        return 0

    for b in banks:
        scrape_bank(
            b,
            delay=args.delay,
            limit=args.limit,
            refresh_sitemap=args.refresh_sitemap,
            checkpoint_every=max(5, args.checkpoint_every),
            stage_every=0 if args.no_stage else max(0, args.stage_every),
        )
        if not args.no_stage:
            try:
                stage_dump(b, reset=True)
            except Exception as exc:  # noqa: BLE001
                print(f"{b} final staging failed: {exc}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
