#!/usr/bin/env python3
"""Fan-out Tier B breeder storefront scrape from _breeder_scrape_queue_1482.json.

Dump + staging only (NO master merge). Shopify products.json / WC product-sitemap /
generic sitemap discovery. Short-attempt bailout for heavy-JS / link-hub / empty.

Claim locks under homeassistant/data/_breeder_claims/ so Tier A siblings do not
fight the same slug.
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
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from brain.dsc_brain.paths import sanitize_source_slug  # noqa: E402

LICENSE = "research archival scrape; redistributable=false until legal review"
QUEUE = DATA / "_breeder_scrape_queue_1482.json"
CLAIM_DIR = DATA / "_breeder_claims"
# Half-specific paths set in main() so first/second halves do not clobber each other.
PROGRESS = DATA / "_tier_b_first_half_progress.json"
RESULTS = DATA / "_tier_b_first_half_results.json"


def half_paths(half: str) -> tuple[Path, Path]:
    tag = "first" if half.startswith("f") else "second"
    return (
        DATA / f"_tier_b_{tag}_half_progress.json",
        DATA / f"_tier_b_{tag}_half_results.json",
    )

SKIP_HOST_FRAGMENTS = (
    "fanlink.tv",
    "linktr.ee",
    "bio.link",
    "beacons.ai",
    "instagram.com",
    "facebook.com",
    "twitter.com",
    "x.com",
    "youtube.com",
    "tiktok.com",
    "strain-database",
    # Domain parking / brokers / unrelated marketplaces (bad domain_guess)
    "perfectdomain.com",
    "domaineasy.com",
    "venture.com",
    "sedo.com",
    "godaddy.com",
    "afternic.com",
    "dan.com",
    "hugedomains.com",
    "namecheap.com",
    "seniorsmeetonline.com",
    "g2g.com",
    "komi.io",
    "youstream.com",
    "phenohunter.org",
)

BOT_MARKERS = (
    "verifying you're human",
    "cf-browser-verification",
    "attention required | cloudflare",
    "just a moment...",
    "enable javascript and cookies to continue",
    "access denied",
    "captcha-delivery.com",
)

PRODUCT_PATH_HINTS = (
    "/product/",
    "/products/",
    "/shop/",
    "/seeds/",
    "/cannabis-",
    "/marijuana-",
    "-seeds",
    "-seed/",
)


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", t)
    t = re.sub(r"(?is)<noscript\b[^>]*>.*?</noscript>", " ", t)
    t = re.sub(r"(?is)<!--.*?-->", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def is_bot_wall(html: str) -> bool:
    low = (html or "").lower()
    if any(m in low for m in BOT_MARKERS):
        return True
    if len(low) < 1500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def looks_heavy_js(html: str) -> bool:
    low = (html or "").lower()
    text = clean(html)
    if len(text) < 80 and ("__next" in low or "id=\"root\"" in low or "id='root'" in low):
        return True
    if len(text) < 120 and ("react" in low or "nuxt" in low or "scandipwa" in low):
        return True
    return False


def sitemap_locs(body: str) -> list[str]:
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body or "", re.I)


def normalize_url(url: str) -> str:
    u = (url or "").strip().split("#")[0].split("?")[0]
    return u.rstrip("/") if u.count("/") > 3 else u


def bank_slug(entry: dict) -> str:
    raw = entry.get("seedfinder_slug") or entry.get("name_norm") or entry.get("name") or "unknown"
    return sanitize_source_slug(str(raw))


def source_id_for(entry: dict) -> str:
    return f"bank_{bank_slug(entry)}"


def claim_path(slug: str) -> Path:
    CLAIM_DIR.mkdir(parents=True, exist_ok=True)
    return CLAIM_DIR / f"{slug}.claim.json"


def try_claim(slug: str, *, owner: str) -> bool:
    path = claim_path(slug)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    if path.exists():
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            doc = {}
        existing = str(doc.get("owner") or "")
        if existing and existing != owner:
            return False
    path.write_text(
        json.dumps({"owner": owner, "slug": slug, "claimed_at": now}, indent=2),
        encoding="utf-8",
    )
    return True


def load_queue_slice(*, half: str) -> tuple[dict, list[dict]]:
    d = json.loads(QUEUE.read_text(encoding="utf-8"))
    b = list(d.get("tiers", {}).get("B") or [])
    # Prefer classifier partitions when present (stable slice indices).
    part_key = "tier_B_first_half" if half.startswith("f") else "tier_B_second_half"
    part = (d.get("partitions") or {}).get(part_key)
    if isinstance(part, dict) and isinstance(part.get("slice"), list) and len(part["slice"]) == 2:
        start, end = int(part["slice"][0]), int(part["slice"][1])
        slice_ = b[start:end]
        return d, slice_
    mid = (len(b) + 1) // 2
    slice_ = b[:mid] if half.startswith("f") else b[mid:]
    return d, slice_


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


def brand_name(val: Any) -> str | None:
    if isinstance(val, dict):
        n = val.get("name")
        return str(n).strip() if n else None
    if isinstance(val, str) and val.strip():
        return val.strip()
    return None


def host_is_skipped(host: str) -> bool:
    h = (host or "").lower().split(":")[0].strip(".")
    if not h:
        return False
    for frag in SKIP_HOST_FRAGMENTS:
        f = frag.lower().strip(".")
        if h == f or h.endswith("." + f):
            return True
    return False


def soft_get(url: str, *, delay: float, timeout: int = 45) -> tuple[str | None, str | None]:
    """Return (body, error). Never raises."""
    try:
        return polite_get(url, delay=delay, timeout=timeout), None
    except Exception as exc:  # noqa: BLE001
        return None, str(exc)


def try_shopify_products(base: str, *, delay: float, max_pages: int = 20) -> list[dict]:
    """Return Shopify product dicts via /products.json pagination."""
    products: list[dict] = []
    root = base.rstrip("/")
    for page in range(1, max_pages + 1):
        url = f"{root}/products.json?limit=250&page={page}"
        body, err = soft_get(url, delay=delay, timeout=60)
        if err or not body:
            break
        text = body.lstrip()
        if not text.startswith("{") and not text.startswith("["):
            break
        try:
            doc = json.loads(text)
        except json.JSONDecodeError:
            break
        batch = doc.get("products") if isinstance(doc, dict) else None
        if not isinstance(batch, list) or not batch:
            break
        products.extend(p for p in batch if isinstance(p, dict))
        if len(batch) < 250:
            break
    return products


def shopify_row(prod: dict, *, bank: str, base: str, breeder_name: str) -> dict[str, Any] | None:
    handle = str(prod.get("handle") or "").strip()
    title = str(prod.get("title") or "").strip()
    if not handle and not title:
        return None
    url = urljoin(base.rstrip("/") + "/", f"products/{handle}") if handle else base
    name = re.sub(r"\s*[|–-]\s*.*$", "", title).strip() or title
    name = re.sub(
        r"\s+(?:seeds?|feminized|autoflower(?:ing)?|photoperiod)\s*$",
        "",
        name,
        flags=re.I,
    ).strip() or name
    body_html = str(prod.get("body_html") or "")
    text = clean(body_html)
    grow = parse_grow_fields(f"{title} {text}")
    tags = prod.get("tags") or []
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]
    images = prod.get("images") or []
    image_url = None
    if images and isinstance(images[0], dict):
        image_url = images[0].get("src")
    variants = prod.get("variants") or []
    price = None
    if variants and isinstance(variants[0], dict):
        try:
            price = float(variants[0].get("price"))
        except (TypeError, ValueError):
            price = None
    chemistry: dict[str, Any] = {}
    if grow.get("thc") is not None:
        chemistry["thc"] = grow["thc"]
    if grow.get("cbd") is not None:
        chemistry["cbd"] = grow["cbd"]
    row: dict[str, Any] = {
        "name": name[:200],
        "name_norm": name_norm(name),
        "name_raw": title[:300],
        "display_name": title[:300],
        "breeder": breeder_name,
        "bank": bank,
        "source": bank,
        "url": normalize_url(url),
        "slug": handle or None,
        "description": (text[:4000] if text else None),
        "image_url": image_url,
        "price": price,
        "product_type": prod.get("product_type"),
        "vendor": prod.get("vendor"),
        "tags": tags[:30] if isinstance(tags, list) else None,
        "page_text_excerpt": text[:1200] if text else None,
        "raw_record": {
            "shopify_product_id": prod.get("id"),
            "handle": handle,
            "vendor": prod.get("vendor"),
            "product_type": prod.get("product_type"),
            "tags": tags[:40] if isinstance(tags, list) else tags,
        },
    }
    row.update({k: v for k, v in grow.items() if v not in (None, "", [], {})})
    if chemistry:
        row["chemistry"] = chemistry
    # Prefer seed-ish products; keep others if title suggests genetics.
    hay = f"{title} {prod.get('product_type') or ''} {' '.join(tags) if isinstance(tags, list) else ''}".lower()
    if not re.search(r"seed|autoflower|feminized|photoperiod|genetics|strain|cannabis|marijuana", hay):
        if prod.get("product_type") and not re.search(r"seed|strain|flower|cannabis", str(prod.get("product_type")), re.I):
            return None
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def discover_sitemap_product_urls(base: str, *, delay: float, limit: int = 2500) -> list[str]:
    root = base.rstrip("/")
    # Prefer product sitemaps first; avoid crawling every WP/page sitemap.
    candidates = [
        f"{root}/product-sitemap.xml",
        f"{root}/product-sitemap1.xml",
        f"{root}/wp-sitemap-posts-product-1.xml",
        f"{root}/sitemap_products_1.xml",
        f"{root}/sitemap_index.xml",
        f"{root}/sitemap.xml",
        f"{root}/media/sitemap/sitemap.xml",
    ]
    found: set[str] = set()
    sm_queue: list[str] = []
    seen_sm: set[str] = set()

    def is_product_url(u: str) -> bool:
        low = u.lower()
        if any(h in low for h in PRODUCT_PATH_HINTS):
            return True
        if re.search(r"/products?/[^/]+/?$", low):
            return True
        # PrestaShop / Magento leaf often ends with .html
        if re.search(r"/[a-z0-9][a-z0-9\-_]{2,}\.html?$", low) and "sitemap" not in low:
            return True
        return False

    def is_product_sitemap(u: str) -> bool:
        low = u.lower()
        return bool(
            re.search(
                r"product[-_]?sitemap|sitemap[-_]?products?|wp-sitemap-posts-product|"
                r"sitemap_products|products?\.xml",
                low,
            )
        )

    for sm in candidates:
        body, err = soft_get(sm, delay=min(delay, 0.35), timeout=25)
        if err or not body:
            continue
        if is_bot_wall(body):
            continue
        locs = sitemap_locs(body)
        if not locs:
            # Some indexes bury locs oddly; still try regex on raw
            continue
        child_sms = [u for u in locs if u.lower().endswith(".xml") or "sitemap" in u.lower()]
        # If this looks like an index, only enqueue product-ish children
        if child_sms and len(child_sms) >= max(1, len(locs) // 2):
            for c in child_sms:
                if c in seen_sm:
                    continue
                if is_product_sitemap(c) or "product" in c.lower():
                    sm_queue.append(c)
                    seen_sm.add(c)
            # If no product child found, still enqueue first few xml children as fallback
            if not sm_queue:
                for c in child_sms[:4]:
                    if c not in seen_sm:
                        sm_queue.append(c)
                        seen_sm.add(c)
        for loc in locs:
            lu = normalize_url(loc)
            if is_product_url(lu):
                found.add(lu)
                if len(found) >= limit:
                    return sorted(found)
        if found and is_product_sitemap(sm):
            return sorted(found)

    # Cap child sitemap fetches hard so we never hang on full-site maps
    fetches = 0
    while sm_queue and len(found) < limit and fetches < 12:
        sm = sm_queue.pop(0)
        fetches += 1
        body, err = soft_get(sm, delay=min(delay, 0.35), timeout=35)
        if err or not body or is_bot_wall(body):
            continue
        for loc in sitemap_locs(body):
            low_loc = loc.lower()
            if (low_loc.endswith(".xml") or "sitemap" in low_loc) and loc not in seen_sm:
                if is_product_sitemap(loc) or "product" in low_loc:
                    sm_queue.append(loc)
                    seen_sm.add(loc)
                continue
            lu = normalize_url(loc)
            if is_product_url(lu):
                found.add(lu)
                if len(found) >= limit:
                    return sorted(found)
    return sorted(found)


def parse_html_product(html: str, url: str, *, bank: str, breeder_name: str) -> dict[str, Any] | None:
    if is_bot_wall(html):
        return None
    if looks_heavy_js(html):
        return None
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
        return None
    display = re.sub(r"\s*[|–-]\s*.*$", "", raw_name).strip() or raw_name
    description = html_lib.unescape(str(product.get("description") or "")).strip()
    if not description:
        description = meta_content(html, "og:description") or ""
    text = clean(html)
    grow = parse_grow_fields(f"{display} {description} {text[:4000]}")
    brand = brand_name(product.get("brand")) or breeder_name
    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    chemistry: dict[str, Any] = {}
    if grow.get("thc") is not None:
        chemistry["thc"] = grow["thc"]
    if grow.get("cbd") is not None:
        chemistry["cbd"] = grow["cbd"]
    offers = product.get("offers")
    price = None
    if isinstance(offers, list) and offers:
        offers = offers[0]
    if isinstance(offers, dict):
        try:
            price = float(offers.get("price"))
        except (TypeError, ValueError):
            price = None
    row: dict[str, Any] = {
        "name": display[:200],
        "name_norm": name_norm(display),
        "name_raw": raw_name[:300],
        "display_name": display[:300],
        "breeder": brand,
        "bank": bank,
        "source": bank,
        "url": normalize_url(url),
        "slug": slug,
        "description": (description[:4000] if description else None),
        "price": price,
        "page_text_excerpt": text[:1200],
        "raw_record": {"url": url, "json_ld_type": product.get("@type")},
    }
    row.update({k: v for k, v in grow.items() if v not in (None, "", [], {})})
    if chemistry:
        row["chemistry"] = chemistry
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def stage_dump(bank: str, *, reset: bool = True) -> dict:
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    out = DATA / f"dsc_strains_{bank}.json"
    if not out.exists():
        raise FileNotFoundError(out)
    return write_dump_to_staging(out, source_id=bank, reset=reset)


def save_progress(doc: dict) -> None:
    PROGRESS.write_text(json.dumps(doc, indent=2, ensure_ascii=False), encoding="utf-8")


def scrape_entry(
    entry: dict,
    *,
    owner: str,
    delay: float,
    max_html: int,
    checkpoint_every: int,
) -> dict[str, Any]:
    name = entry.get("name") or "?"
    base = (entry.get("base") or entry.get("url") or "").rstrip("/")
    url = entry.get("url") or (base + "/")
    slug = bank_slug(entry)
    bank = source_id_for(entry)
    result: dict[str, Any] = {
        "name": name,
        "slug": slug,
        "bank": bank,
        "url": url,
        "base": base,
        "platform_hint": entry.get("platform"),
        "status": "pending",
        "items": 0,
        "method": None,
        "note": None,
        "blockers": [],
    }

    host = (urlparse(base or url).netloc or "").lower()
    path_l = (urlparse(url).path or "").lower()
    if host_is_skipped(host):
        result["status"] = "skipped_linkhub"
        result["note"] = f"skip host {host}"
        return result
    if "/domain/" in path_l or "/buy-domain/" in path_l or "/domains/" in path_l:
        result["status"] = "skipped_linkhub"
        result["note"] = f"skip domain-parking path {path_l[:80]}"
        return result
    if path_l.rstrip("/").endswith("/password") or "/password" == path_l:
        result["status"] = "skipped_password"
        result["note"] = "storefront behind password gate"
        return result

    # Resume: keep prior successful dump/staging
    out_existing = DATA / f"dsc_strains_{bank}.json"
    if out_existing.exists():
        try:
            prev = json.loads(out_existing.read_text(encoding="utf-8"))
            prev_n = int(prev.get("count") or len(prev.get("items") or []) or 0)
            if prev_n >= 3:
                result["status"] = "ok"
                result["items"] = prev_n
                result["method"] = "resume_existing"
                result["note"] = f"resume existing dump count={prev_n}"
                print(f"  RESUME {bank} items={prev_n}", flush=True)
                return result
        except (OSError, json.JSONDecodeError, TypeError, ValueError):
            pass
    if path_l.rstrip("/").endswith("/password") or "/password" in path_l:
        result["status"] = "skipped_password_wall"
        result["note"] = "shopify password / coming-soon gate"
        return result

    # Already-fat staging from prior bank waves (e.g. Herbies) — do not re-scrape.
    staging_db = ROOT / "brain" / "data" / "staging" / f"{bank}.sqlite3"
    if staging_db.exists() and staging_db.stat().st_size > 500_000:
        result["status"] = "skipped_already_staged"
        result["note"] = f"staging already fat ({staging_db.stat().st_size} bytes)"
        return result

    if not try_claim(slug, owner=owner):
        result["status"] = "skipped_claimed"
        result["note"] = "slug claimed by another worker"
        return result

    # Also claim bank_ prefix collision with Tier A style ids
    if not try_claim(bank, owner=owner):
        result["status"] = "skipped_claimed"
        result["note"] = "bank id claimed by another worker"
        return result

    out = DATA / f"dsc_strains_{bank}.json"
    ck = Checkpoint(DATA / f"dsc_strains_{bank}.checkpoint.json")
    sm_cache = DATA / f"dsc_strains_{bank}.sitemap_urls.json"

    # Quick home probe (one short CF retry then skip)
    home, herr = soft_get(url, delay=delay, timeout=40)
    if herr:
        result["status"] = "failed_dns_or_http"
        result["note"] = herr[:240]
        result["blockers"].append(herr[:240])
        return result
    assert home is not None
    if is_bot_wall(home):
        time.sleep(2.0)
        home2, herr2 = soft_get(url, delay=delay, timeout=40)
        if herr2 or not home2 or is_bot_wall(home2):
            result["status"] = "blocked_cf"
            result["note"] = "bot wall on home after short retry"
            result["blockers"].append("BOT_WALL home")
            return result
        home = home2
    if looks_heavy_js(home):
        result["status"] = "skipped_heavy_js"
        result["note"] = "home looks SPA/JS-heavy after short attempt"
        return result

    # Detect Shopify from home
    low = home.lower()
    platform = str(entry.get("platform") or "").lower()
    is_shopify = (
        platform == "shopify"
        or "cdn.shopify.com" in low
        or ("shopify" in low and platform not in {"woocommerce", "magento", "wordpress"})
    )

    items: list[dict] = []
    method = None

    # 1) Shopify products.json (only when Shopify-ish)
    shopify_prods: list[dict] = []
    if is_shopify or platform in {"", "none"} and "cdn.shopify.com" in low:
        shopify_prods = try_shopify_products(base, delay=delay, max_pages=8)
    if shopify_prods:
        method = "shopify_products_json"
        for prod in shopify_prods:
            row = shopify_row(prod, bank=bank, base=base, breeder_name=str(name))
            if row:
                items.append(row)
        result["shopify_raw"] = len(shopify_prods)

    # 2) Sitemap HTML PDPs if Shopify empty / non-shopify
    if not items:
        print(f"  {bank}: discovering sitemaps…", flush=True)
        urls = discover_sitemap_product_urls(base, delay=delay)
        print(f"  {bank}: sitemap products={len(urls)}", flush=True)
        sm_cache.write_text(
            json.dumps(
                {
                    "bank": bank,
                    "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "count": len(urls),
                    "urls": urls,
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        if urls:
            method = "sitemap_html"
            done = set(ck.data.get("done") or [])
            skipped = set(ck.data.get("skipped") or [])
            by_url: dict[str, dict] = {}
            consecutive_walls = 0
            scraped = 0
            for idx, purl in enumerate(urls[:max_html], 1):
                nu = normalize_url(purl)
                if nu in done or nu in skipped:
                    continue
                body, err = soft_get(purl, delay=delay, timeout=35)
                if err:
                    if "HTTP 404" in err or "HTTP 410" in err:
                        skipped.add(nu)
                        done.add(nu)
                    else:
                        result["blockers"].append(err[:200])
                    continue
                assert body is not None
                if is_bot_wall(body):
                    consecutive_walls += 1
                    result["blockers"].append(f"BOT_WALL {purl}")
                    if consecutive_walls >= 2:
                        result["note"] = "abort html scrape: CF after short retry"
                        break
                    time.sleep(1.5)
                    continue
                consecutive_walls = 0
                if looks_heavy_js(body):
                    skipped.add(nu)
                    done.add(nu)
                    continue
                row = parse_html_product(body, purl, bank=bank, breeder_name=str(name))
                if not row:
                    skipped.add(nu)
                    done.add(nu)
                    continue
                by_url[nu] = row
                done.add(nu)
                scraped += 1
                if scraped % checkpoint_every == 0:
                    items = list(by_url.values())
                    ck.data["done"] = sorted(done)
                    ck.data["skipped"] = sorted(skipped)
                    ck.data["done_count"] = len(done)
                    try:
                        ck.save()
                    except OSError:
                        ck.path.write_text(json.dumps(ck.data, indent=2), encoding="utf-8")
                    write_dump(
                        out,
                        "strains",
                        items,
                        source=bank,
                        source_url=url,
                        license=LICENSE,
                        redistributable=False,
                        note=f"partial {len(items)} via {method}",
                        blockers=result["blockers"][-20:],
                    )
                    print(f"  {bank} checkpoint items={len(items)} idx={idx}/{min(len(urls), max_html)}", flush=True)
            items = list(by_url.values())
            ck.data["done"] = sorted(done)
            ck.data["skipped"] = sorted(skipped)
            try:
                ck.save()
            except OSError:
                ck.path.write_text(json.dumps(ck.data, indent=2), encoding="utf-8")
        elif is_shopify:
            result["status"] = "empty_shopify"
            result["note"] = "shopify signals but no products.json / sitemap products"
            return result
        else:
            # Magento/other: short home-link attempt only
            method = "home_link_scan"
            hrefs = re.findall(r'href=["\']([^"\']+)["\']', home or "", re.I)
            cand: list[str] = []
            for h in hrefs:
                full = urljoin(url, h)
                lowu = full.lower()
                if any(x in lowu for x in PRODUCT_PATH_HINTS):
                    cand.append(normalize_url(full))
            cand = sorted(set(cand))[:30]
            print(f"  {bank}: home_link_scan candidates={len(cand)}", flush=True)
            if not cand:
                result["status"] = "empty_or_unclear"
                result["note"] = "no sitemap products and no productish home links"
                return result
            by_url = {}
            for purl in cand:
                body, err = soft_get(purl, delay=min(delay, 0.4), timeout=20)
                if err or not body or is_bot_wall(body) or looks_heavy_js(body):
                    continue
                row = parse_html_product(body, purl, bank=bank, breeder_name=str(name))
                if row:
                    by_url[normalize_url(purl)] = row
            items = list(by_url.values())

    if not items:
        result["status"] = "empty_catalog"
        result["note"] = "discovery found no parseable products"
        result["method"] = method
        return result

    write_dump(
        out,
        "strains",
        items,
        source=bank,
        source_url=url,
        license=LICENSE,
        redistributable=False,
        note=f"{method} captured {len(items)}",
        blockers=result["blockers"][-30:],
        breeder_name=name,
        platform=entry.get("platform"),
        tier="B",
    )
    try:
        st = stage_dump(bank, reset=True)
        result["staging"] = {
            "family": st.get("family"),
            "staging_db": str(st.get("staging_db")),
            "count": st.get("count"),
        }
    except Exception as exc:  # noqa: BLE001
        result["staging_error"] = str(exc)[:300]
        print(f"  staging fail {bank}: {exc}", flush=True)

    result["status"] = "ok"
    result["items"] = len(items)
    result["method"] = method
    result["note"] = f"wrote {out.name}"
    print(f"  OK {bank} items={len(items)} method={method}", flush=True)
    return result


def main() -> int:
    global PROGRESS, RESULTS
    ap = argparse.ArgumentParser()
    ap.add_argument("--half", default="first", choices=("first", "second"))
    ap.add_argument("--owner", default=None, help="Claim owner (default tier_b_<half>_half)")
    ap.add_argument("--delay", type=float, default=0.7)
    ap.add_argument("--max-html", type=int, default=400)
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--limit-banks", type=int, default=0)
    ap.add_argument(
        "--wait-queue-sec",
        type=int,
        default=0,
        help="If queue is partial, wait up to N seconds for classifier to finish before slicing",
    )
    ap.add_argument(
        "--passes",
        type=int,
        default=1,
        help="Re-read queue and scrape newly unlocked second/first-half banks (claims prevent dupes)",
    )
    ap.add_argument("--pass-sleep", type=int, default=90, help="Seconds between refresh passes")
    args = ap.parse_args()

    owner = args.owner or f"tier_b_{args.half}_half"
    PROGRESS, RESULTS = half_paths(args.half)

    if not QUEUE.exists():
        print(f"queue missing: {QUEUE}", flush=True)
        return 2

    if args.wait_queue_sec > 0:
        deadline = time.time() + args.wait_queue_sec
        while time.time() < deadline:
            try:
                qpeek = json.loads(QUEUE.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                time.sleep(5)
                continue
            if not qpeek.get("partial"):
                print(
                    f"queue complete tier_B={qpeek.get('counts', {}).get('tier_B')}",
                    flush=True,
                )
                break
            print(
                f"waiting queue… partial tier_B={qpeek.get('counts', {}).get('tier_B')} "
                f"probed={qpeek.get('counts', {}).get('probed')}",
                flush=True,
            )
            time.sleep(15)

    all_results: list[dict] = []
    progress: dict[str, Any] = {
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "owner": owner,
        "half": args.half,
        "passes": [],
        "results": [],
    }

    for pass_i in range(max(1, args.passes)):
        qdoc, slice_ = load_queue_slice(half=args.half)
        if args.limit_banks > 0:
            slice_ = slice_[: args.limit_banks]

        tier_a = {
            str(x.get("name_norm") or "").lower()
            for x in (qdoc.get("tiers", {}).get("A") or [])
        }
        already = {str(r.get("slug") or "") for r in all_results if r.get("slug")}
        # Also skip banks we already finished this process
        todo = []
        for entry in slice_:
            slug = bank_slug(entry)
            if slug in already:
                continue
            # Skip if claim owned by someone else (sibling)
            cp = claim_path(slug)
            if cp.exists():
                try:
                    cdoc = json.loads(cp.read_text(encoding="utf-8"))
                    if cdoc.get("owner") and cdoc.get("owner") != owner:
                        continue
                except (OSError, json.JSONDecodeError):
                    pass
            todo.append(entry)

        progress["queue_partial"] = qdoc.get("partial")
        progress["queue_counts"] = qdoc.get("counts")
        progress["slice_n"] = len(slice_)
        progress["todo_n"] = len(todo)
        progress["pass"] = pass_i + 1
        save_progress(progress)

        print(
            f"Tier B {args.half} half pass {pass_i + 1}/{args.passes}: "
            f"slice={len(slice_)} todo={len(todo)} "
            f"(queue partial={qdoc.get('partial')} tier_B={qdoc.get('counts', {}).get('tier_B')})",
            flush=True,
        )

        pass_results: list[dict] = []
        for entry in todo:
            nn = str(entry.get("name_norm") or "").lower()
            if nn in tier_a:
                r = {
                    "name": entry.get("name"),
                    "slug": bank_slug(entry),
                    "status": "skipped_tier_a_sibling",
                    "note": "name also in Tier A",
                    "items": 0,
                }
                pass_results.append(r)
                all_results.append(r)
                print(f"SKIP Tier A overlap: {entry.get('name')}", flush=True)
                continue
            print(f"\n=== {entry.get('name')} {entry.get('url')} ===", flush=True)
            r = scrape_entry(
                entry,
                owner=owner,
                delay=args.delay,
                max_html=args.max_html,
                checkpoint_every=max(5, args.checkpoint_every),
            )
            pass_results.append(r)
            all_results.append(r)
            progress["results"] = all_results
            progress["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            save_progress(progress)

        progress["passes"].append(
            {
                "pass": pass_i + 1,
                "slice_n": len(slice_),
                "todo_n": len(todo),
                "attempted": len(pass_results),
                "ok": sum(1 for r in pass_results if r.get("status") == "ok"),
                "items": sum(int(r.get("items") or 0) for r in pass_results),
            }
        )
        save_progress(progress)

        if pass_i + 1 < args.passes:
            # Stop early if queue finalized and nothing left
            if not qdoc.get("partial") and not todo:
                break
            print(f"sleep {args.pass_sleep}s before refresh pass…", flush=True)
            time.sleep(max(5, args.pass_sleep))

    summary = {
        "finished_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "owner": owner,
        "half": args.half,
        "attempted": len(all_results),
        "ok": sum(1 for r in all_results if r.get("status") == "ok"),
        "items_total": sum(int(r.get("items") or 0) for r in all_results),
        "by_status": {},
        "results": all_results,
    }
    for r in all_results:
        st = str(r.get("status") or "?")
        summary["by_status"][st] = summary["by_status"].get(st, 0) + 1
    RESULTS.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    progress["summary"] = {
        k: summary[k] for k in ("attempted", "ok", "items_total", "by_status")
    }
    save_progress(progress)
    print("\n=== SUMMARY ===", flush=True)
    print(json.dumps(progress["summary"], indent=2), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
