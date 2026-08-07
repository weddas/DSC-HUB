#!/usr/bin/env python3
"""Generic Tier-A breeder storefront scraper (dump + staging only).

Discovers PDPs via Shopify products.json / Woo-Magento sitemaps, scrapes JSON-LD,
writes homeassistant/data/dsc_strains_{slug}.json + brain/data/staging/bank_{slug}.sqlite3.

No master merge. Checkpoint/resume. Skip DNS/empty after one failure.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import socket
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
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402

LICENSE = "research archival scrape; redistributable=false until legal review"
QUEUE = DATA / "_breeder_scrape_queue_1482.json"
CLAIM = DATA / "_tier_a_half1_claim.json"
RESULTS = DATA / "_tier_a_half1_results.json"
STAGING_DIR = ROOT / "brain" / "data" / "staging"

SITEMAP_CANDIDATES = (
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/product-sitemap.xml",
    "/product-sitemap1.xml",
    "/wp-sitemap.xml",
    "/wp-sitemap-posts-product-1.xml",
    "/sitemap-products.xml",
    "/media/sitemap/sitemap.xml",
)

SKIP_HOST_MARKERS = (
    "hugedomains.com",
    "godaddy.com",
    "sedo.com",
    "dan.com",
    "afternic.com",
    "parkingcrew",
)


def slugify(name: str) -> str:
    s = (name or "").lower().strip()
    s = s.replace("&", " and ").replace("'", "")
    s = re.sub(r"[^\w\s\-]+", " ", s)
    s = re.sub(r"\s+", "-", s.strip())
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:60] or "unknown"


def bank_slug(name: str) -> str:
    return slugify(name)


def staging_id(slug: str) -> str:
    return f"bank_{slug}" if not slug.startswith("bank_") else slug


def normalize_url(url: str) -> str:
    u = (url or "").strip().split("#")[0].split("?")[0]
    return u.rstrip("/") if u.endswith("/") and "/product" in u else u


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", t)
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


def sitemap_locs(body: str) -> list[str]:
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body or "", re.I)


def host_alive(url: str) -> bool:
    host = urlparse(url).hostname
    if not host:
        return False
    try:
        socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
        return True
    except socket.gaierror:
        try:
            socket.getaddrinfo(host, 80, type=socket.SOCK_STREAM)
            return True
        except socket.gaierror:
            return False


def looks_parked(url: str, html: str = "") -> bool:
    host = (urlparse(url).hostname or "").lower()
    if any(m in host for m in SKIP_HOST_MARKERS):
        return True
    low = (html or "").lower()
    if "hugedomains" in low or "this domain is for sale" in low:
        return True
    if "godaddy" in low and "parked" in low:
        return True
    return False


def productish_url(url: str, platform: str | None) -> bool:
    u = url.lower()
    path = urlparse(u).path.rstrip("/")
    parts = [p for p in path.split("/") if p]
    leaf = parts[-1] if parts else ""
    junk_leaf = (
        "blog",
        "home",
        "cart",
        "shop",
        "store",
        "brands",
        "brand",
        "badges",
        "archive",
        "black-friday",
        "sale",
        "clearance",
        "gift-card",
        "gift-cards",
        "contact",
        "about",
        "shipping",
        "privacy",
        "terms",
        "faq",
        "login",
        "account",
        "newsletter",
        "breeding",
        "new-page",
        "obchodni-podminky",
        "cleaning_services",
        "gallery",
        "coupons",
        "our_coupons",
    )
    if leaf in junk_leaf or any(j in leaf for j in ("badge", "black-friday", "gift-card")):
        return False
    if any(
        x in path
        for x in (
            "/cart",
            "/checkout",
            "/account",
            "/login",
            "/blog/",
            "/news/",
            "/tag/",
            "/wp-content/",
            "/cdn-cgi/",
            "/newsletter",
            "/contact",
            "/about",
            "/breeding",
            "/new-page",
            "/obchodni-podminky",
            "/product_cat",
            "/product-tag",
            "/product_tag",
        )
    ):
        return False
    # Advanced Seeds / Spanish WC: /tienda/{cat}/{slug}/
    if parts and parts[0] == "tienda":
        if len(parts) >= 3 and parts[1] in {
            "feminizadas",
            "automaticas",
            "regulares",
            "mixes",
            "cbd",
            "fast",
        }:
            return parts[2] not in {"", "page"}
        return False
    # ADKGrass-style /seeds/p/{id}
    if len(parts) >= 3 and parts[0] == "seeds" and parts[1] == "p":
        return True
    if platform == "shopify" or "/products/" in path:
        return bool(re.search(r"/products/[a-z0-9][a-z0-9\-]+/?$", u))
    if "/product/" in path:
        # Prefer seed-ish leaf; still keep unknown genetics slugs
        if re.search(r"/product/[a-z0-9][a-z0-9\-]+/?$", u):
            if any(
                x in leaf
                for x in (
                    "brand",
                    "badge",
                    "friday",
                    "gift",
                    "shipping",
                    "blog",
                    "archive",
                    "cleaning",
                    "coupon",
                    "service",
                )
            ):
                return False
            return True
        return False
    if path.endswith(".html") or (parts and parts[-1].endswith(".html")):
        if len(leaf) < 8:
            return False
        skip = (
            "contact",
            "about",
            "shipping",
            "privacy",
            "terms",
            "faq",
            "index",
            "home",
            "blog",
            "cart",
            "login",
            "podminky",
        )
        return not any(s in leaf for s in skip)
    # Flat strain pages (ALTVM): single slug, not utility
    if len(parts) == 1:
        if leaf in {"home", "about", "contact", "breeding", "new-page", "seeds", "shop", "store"}:
            return False
        if len(leaf) >= 4 and re.match(r"^[a-z0-9][a-z0-9\-]+$", leaf):
            return True
    if re.match(r"^/[a-z0-9][a-z0-9\-]{4,}/?$", path) and "seed" in path:
        return True
    return False


def discover_shopify(base: str, *, delay: float) -> tuple[list[str], dict[str, dict]]:
    """Return (product_urls, handle -> product dict from products.json)."""
    urls: list[str] = []
    by_handle: dict[str, dict] = {}
    for page in range(1, 40):
        api = f"{base.rstrip('/')}/products.json?limit=250&page={page}"
        try:
            body = polite_get(api, delay=delay, timeout=90)
        except Exception as exc:  # noqa: BLE001
            print(f"  shopify products.json fail page={page}: {exc}", flush=True)
            break
        try:
            doc = json.loads(body)
        except json.JSONDecodeError as exc:
            print(f"  shopify json decode fail page={page}: {exc}", flush=True)
            break
        products = doc.get("products") or []
        if not products:
            break
        for p in products:
            if not isinstance(p, dict):
                continue
            handle = (p.get("handle") or "").strip()
            if not handle:
                continue
            title = str(p.get("title") or "")
            ptype = str(p.get("product_type") or "")
            tags = p.get("tags") or []
            if isinstance(tags, str):
                tag_s = tags
            else:
                tag_s = " ".join(str(t) for t in tags if t)
            blob = f"{handle} {title} {ptype} {tag_s}".lower()
            merch = any(
                x in blob
                for x in (
                    "t-shirt",
                    "tshirt",
                    "hoodie",
                    "hat",
                    "beanie",
                    "sticker",
                    "gift-card",
                    "gift card",
                    "apparel",
                    "sweatshirt",
                    "tank top",
                )
            )
            seedish = any(
                x in blob
                for x in (
                    "seed",
                    "feminized",
                    "autoflower",
                    "regular",
                    "pack",
                    "genetics",
                    "strain",
                )
            )
            if merch and not seedish:
                continue
            by_handle[handle] = p
            urls.append(f"{base.rstrip('/')}/products/{handle}")
        print(f"  shopify page {page}: +{len(products)} (kept cumulative {len(urls)})", flush=True)
        if len(products) < 250:
            break
    return sorted(set(normalize_url(u) for u in urls)), by_handle


def row_from_shopify_product(
    p: dict[str, Any],
    url: str,
    *,
    slug: str,
    breeder_name: str,
) -> dict[str, Any]:
    title = str(p.get("title") or "").strip()
    display = re.sub(r"\s*[|–-]\s*.*$", "", title).strip() or title
    display = re.sub(
        r"\s*(?:Feminized|Autoflower(?:ing)?|Regular)?\s*Seeds?\s*$",
        "",
        display,
        flags=re.I,
    ).strip() or display
    body_html = str(p.get("body_html") or "")
    description = clean(body_html)
    grow = parse_grow_fields(description)
    tags = p.get("tags") or []
    if isinstance(tags, str):
        tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    else:
        tag_list = [str(t) for t in tags if t]
    row: dict[str, Any] = {
        "name": display,
        "name_norm": name_norm(display),
        "breeder": str(p.get("vendor") or "").strip() or breeder_name,
        "url": url,
        "source": slug,
        "description": description[:4000] if description else None,
        "product_type": p.get("product_type"),
        "tags": tag_list[:20] or None,
        "raw_record": {
            "from_products_json": True,
            "shopify_product": {
                k: p.get(k)
                for k in (
                    "id",
                    "handle",
                    "title",
                    "body_html",
                    "vendor",
                    "product_type",
                    "tags",
                    "variants",
                    "images",
                )
                if k in p
            },
        },
    }
    row.update(grow)
    chem = {k: grow[k] for k in ("thc", "thc_range", "cbd", "cbd_range") if k in grow}
    if chem:
        row["chemistry"] = chem
    return row


def discover_sitemaps(base: str, platform: str | None, *, delay: float) -> list[str]:
    found: set[str] = set()
    sm_bodies: list[str] = []
    tried: list[str] = []
    for path in SITEMAP_CANDIDATES:
        sm = urljoin(base if base.endswith("/") else base + "/", path.lstrip("/"))
        if sm in tried:
            continue
        tried.append(sm)
        try:
            body = polite_get(sm, delay=delay, timeout=60)
        except Exception as exc:  # noqa: BLE001
            print(f"  sitemap miss {sm}: {exc}", flush=True)
            continue
        if "<loc>" not in body.lower() and "<sitemap" not in body.lower():
            continue
        sm_bodies.append(body)
        # nested sitemap index — only follow product-ish child sitemaps
        for loc in sitemap_locs(body):
            low = loc.lower()
            if "sitemap" not in low:
                continue
            # Skip blog/page/tax/media noise
            if any(
                x in low
                for x in (
                    "post-sitemap",
                    "page-sitemap",
                    "attachment",
                    "category-sitemap",
                    "author",
                    "tag-sitemap",
                    "product_cat",
                    "product_tag",
                    "product_shipping",
                    "taxonomies",
                    "badge",
                    "gallery",
                    "coupon",
                    "cleaning",
                )
            ):
                continue
            productish_sm = (
                "product-sitemap" in low
                or "products-sitemap" in low
                or "sitemap-product" in low
                or "wp-sitemap-posts-product" in low
                or low.rstrip("/").endswith("sitemap.xml")
                or "sitemap_index" in low
            )
            if productish_sm and loc not in tried and len(tried) < 40:
                tried.append(loc)
                try:
                    nested = polite_get(loc, delay=delay, timeout=90)
                    sm_bodies.append(nested)
                    print(f"  nested sitemap {loc}", flush=True)
                except Exception as exc:  # noqa: BLE001
                    print(f"  nested fail {loc}: {exc}", flush=True)

    host = (urlparse(base).hostname or "").lower().removeprefix("www.")
    for body in sm_bodies:
        for loc in sitemap_locs(body):
            u = normalize_url(loc)
            uh = (urlparse(u).hostname or "").lower().removeprefix("www.")
            if host and uh and host not in uh and uh not in host:
                continue
            if productish_url(u, platform):
                found.add(u)
    return sorted(found)


def load_or_discover_urls(
    slug: str,
    base: str,
    platform: str | None,
    *,
    delay: float,
    refresh: bool,
) -> tuple[list[str], dict[str, dict]]:
    cache = DATA / f"dsc_strains_{slug}.sitemap_urls.json"
    shopify_cache = DATA / f"dsc_strains_{slug}.shopify_products.json"
    shopify_by_handle: dict[str, dict] = {}

    if cache.exists() and not refresh:
        try:
            doc = json.loads(cache.read_text(encoding="utf-8"))
            urls = [normalize_url(u) for u in (doc.get("urls") or [])]
            if urls:
                if shopify_cache.exists():
                    try:
                        shopify_by_handle = json.loads(
                            shopify_cache.read_text(encoding="utf-8")
                        )
                    except (OSError, json.JSONDecodeError):
                        shopify_by_handle = {}
                print(f"{slug}: cache {len(urls)} urls", flush=True)
                return urls, shopify_by_handle
        except (OSError, json.JSONDecodeError):
            pass

    urls: list[str] = []
    # Always try Shopify JSON first — cheap and high-signal when present.
    shop_urls, shopify_by_handle = discover_shopify(base, delay=delay)
    if shop_urls:
        print(f"{slug}: shopify products.json -> {len(shop_urls)}", flush=True)
        urls = shop_urls
        shopify_cache.write_text(
            json.dumps(shopify_by_handle, ensure_ascii=False),
            encoding="utf-8",
        )
    if not urls:
        urls = discover_sitemaps(base, platform, delay=delay)
        print(f"{slug}: sitemap discover -> {len(urls)}", flush=True)

    cache.write_text(
        json.dumps(
            {
                "bank": slug,
                "base": base,
                "platform": platform,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "count": len(urls),
                "urls": urls,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    return urls, shopify_by_handle


def parse_product(html: str, url: str, *, slug: str, breeder_name: str) -> dict[str, Any] | None:
    if is_bot_wall(html):
        raise RuntimeError(f"BOT_WALL {url}")
    if looks_parked(url, html):
        return None

    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), None) or {}

    raw_name = str(product.get("name") or "").strip()
    if not raw_name:
        raw_name = meta_content(html, "og:title") or ""
    if not raw_name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        raw_name = clean(m.group(1)) if m else ""
    if not raw_name:
        raw_name = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ").replace(".html", "")

    display = re.sub(r"\s*[|–-]\s*.*$", "", raw_name).strip() or raw_name
    display = re.sub(
        r"\s*(?:Feminized|Autoflower(?:ing)?|Regular)?\s*Seeds?\s*$",
        "",
        display,
        flags=re.I,
    ).strip() or display

    description = html_lib.unescape(str(product.get("description") or "")).strip()
    if not description:
        description = meta_content(html, "og:description") or ""
    text = clean(html)[:12000]
    grow = parse_grow_fields(f"{description}\n{text}")

    brand = None
    b = product.get("brand")
    if isinstance(b, dict):
        brand = str(b.get("name") or "").strip() or None
    elif isinstance(b, str):
        brand = b.strip() or None

    # Thin non-product pages
    if not product and len(description) < 40 and "add to cart" not in (html or "").lower():
        # still accept if grow fields found
        if not grow:
            return None

    row: dict[str, Any] = {
        "name": display,
        "name_norm": name_norm(display),
        "breeder": brand or breeder_name,
        "url": url,
        "source": slug,
        "description": description[:4000] if description else None,
        "raw_record": {
            "html_excerpt": text[:3000],
            "json_ld_product": product or None,
            "og_title": meta_content(html, "og:title"),
            "og_description": meta_content(html, "og:description"),
        },
    }
    row.update(grow)
    # chemistry nest
    chem = {}
    if "thc" in grow:
        chem["thc"] = grow["thc"]
    if "thc_range" in grow:
        chem["thc_range"] = grow["thc_range"]
    if "cbd" in grow:
        chem["cbd"] = grow["cbd"]
    if "cbd_range" in grow:
        chem["cbd_range"] = grow["cbd_range"]
    if chem:
        row["chemistry"] = chem
    return row


def stage_dump(slug: str, *, reset: bool = True) -> dict:
    out = DATA / f"dsc_strains_{slug}.json"
    if not out.exists():
        raise FileNotFoundError(out)
    st = write_dump_to_staging(out, source_id=staging_id(slug), reset=reset)
    print(
        f"{slug} staging:",
        json.dumps(
            {k: st[k] for k in ("family", "staging_db", "count", "bulk", "store_raw", "stats") if k in st},
            indent=2,
            default=str,
        ),
        flush=True,
    )
    return st


def save_checkpoint(ck: Checkpoint, done: set[str], skipped: set[str], cursor: str | None = None) -> None:
    ck.data["done"] = sorted(done)
    ck.data["skipped"] = sorted(skipped)
    if cursor is not None:
        ck.data["cursor"] = cursor
    try:
        ck.save()
    except OSError:
        ck.path.write_text(json.dumps(ck.data, indent=2), encoding="utf-8")


def scrape_bank(
    entry: dict[str, Any],
    *,
    delay: float,
    limit: int | None,
    refresh: bool,
    checkpoint_every: int,
    stage_every: int,
    no_stage: bool,
) -> dict[str, Any]:
    name = entry["name"]
    slug = bank_slug(name)
    base = entry.get("url") or ""
    platform = entry.get("platform")
    result: dict[str, Any] = {
        "name": name,
        "slug": slug,
        "url": base,
        "platform": platform,
        "status": "pending",
        "count": 0,
        "urls_discovered": 0,
        "error": None,
    }

    if not base:
        result["status"] = "skip_no_url"
        return result
    if looks_parked(base):
        result["status"] = "skip_parked"
        result["error"] = "parked_host"
        print(f"{slug}: SKIP parked {base}", flush=True)
        return result
    if not host_alive(base):
        result["status"] = "skip_dns"
        result["error"] = "dns"
        print(f"{slug}: SKIP dns {base}", flush=True)
        return result

    # Home fetch once — detect parked/empty. Shopify often bot-walls HTML but
    # still serves /products.json; do not hard-fail until discovery is empty.
    home = ""
    home_bot = False
    try:
        home = polite_get(base, delay=delay, timeout=45)
    except Exception as exc:  # noqa: BLE001
        print(f"{slug}: home warn {exc}", flush=True)
    if home and looks_parked(base, home):
        result["status"] = "skip_parked"
        result["error"] = "parked_html"
        print(f"{slug}: SKIP parked html", flush=True)
        return result
    if home and is_bot_wall(home):
        home_bot = True
        print(f"{slug}: home bot wall — will try API/sitemap discovery", flush=True)
    if home and not home_bot and len(home.strip()) < 400 and platform != "shopify":
        result["status"] = "skip_empty"
        result["error"] = "thin_home"
        print(f"{slug}: SKIP thin home", flush=True)
        return result

    # Refine platform from home if missing
    hl = (home or "").lower()
    if not platform:
        if "cdn.shopify.com" in hl or "myshopify.com" in hl:
            platform = "shopify"
        elif "woocommerce" in hl:
            platform = "woocommerce"
        elif "magento" in hl:
            platform = "magento"
        result["platform"] = platform
    # Classifier often marks Shopify correctly even when home is walled
    if not platform and entry.get("platform") == "shopify":
        platform = "shopify"
        result["platform"] = platform

    try:
        urls, shopify_by_handle = load_or_discover_urls(
            slug, base, platform, delay=delay, refresh=refresh
        )
    except Exception as exc:  # noqa: BLE001
        result["status"] = "skip_discover_fail"
        result["error"] = str(exc)[:200]
        print(f"{slug}: SKIP discover {exc}", flush=True)
        return result

    result["urls_discovered"] = len(urls)
    if not urls:
        if home_bot:
            result["status"] = "skip_bot_wall"
            result["error"] = "bot_wall_no_api"
        else:
            result["status"] = "skip_empty_catalog"
            result["error"] = "no_product_urls"
        print(f"{slug}: SKIP empty catalog", flush=True)
        return result

    if limit is not None:
        urls = urls[: max(0, limit)]

    # Prefer Shopify JSON ingest when HTML is bot-walled (common).
    if shopify_by_handle and (home_bot or platform == "shopify"):
        print(
            f"{slug}: ingesting {len(shopify_by_handle)} from products.json "
            f"(HTML may be walled)",
            flush=True,
        )
        out = DATA / f"dsc_strains_{slug}.json"
        items = []
        for handle, pdata in shopify_by_handle.items():
            url = f"{base.rstrip('/')}/products/{handle}"
            items.append(
                row_from_shopify_product(
                    pdata, url, slug=slug, breeder_name=name
                )
            )
        if limit is not None:
            items = items[: max(0, limit)]
        items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
        write_dump(
            out,
            "strains",
            items,
            source=slug,
            source_url=base,
            license=LICENSE,
            redistributable=False,
            note="shopify products.json ingest (HTML bot-wall bypass)",
            sitemap_count=len(urls),
            breeder_name=name,
            platform=platform or "shopify",
        )
        print(f"wrote {out.name} count={len(items)}", flush=True)
        if not no_stage and items:
            try:
                stage_dump(slug, reset=True)
            except Exception as exc:  # noqa: BLE001
                print(f"{slug} final staging failed: {exc}", flush=True)
                result["staging_error"] = str(exc)[:200]
        result["status"] = "ok" if items else "empty_after_scrape"
        result["count"] = len(items)
        result["skipped"] = 0
        result["mode"] = "shopify_json"
        return result

    out = DATA / f"dsc_strains_{slug}.json"
    ck = Checkpoint(DATA / f"dsc_strains_{slug}.checkpoint.json")
    done = set(ck.data.get("done") or [])
    skipped = set(ck.data.get("skipped") or [])
    items: list[dict] = []
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            items = []
    by_url = {normalize_url(i.get("url") or ""): i for i in items if i.get("url")}
    blockers: list[str] = []
    consecutive_walls = 0
    scraped_this_run = 0
    last_staged_at = 0
    t0 = time.time()

    print(
        f"{slug}: queued={len(urls)} resume_done={len(done)} dump_items={len(by_url)}",
        flush=True,
    )

    for idx, url in enumerate(urls, 1):
        nu = normalize_url(url)
        if nu in skipped:
            continue
        if nu in done and nu in by_url:
            continue
        if nu in done and nu not in by_url:
            done.discard(nu)

        # Shopify JSON fallback per-URL if present
        handle = urlparse(nu).path.rstrip("/").split("/")[-1]
        if handle in shopify_by_handle:
            row = row_from_shopify_product(
                shopify_by_handle[handle], nu, slug=slug, breeder_name=name
            )
            by_url[nu] = row
            done.add(nu)
            scraped_this_run += 1
            if scraped_this_run <= 3 or scraped_this_run % 25 == 0:
                print(
                    f"  ok(json) #{scraped_this_run} idx={idx}/{len(urls)} name={row.get('name')!r}",
                    flush=True,
                )
            continue

        try:
            html = polite_get(url, delay=delay, timeout=90)
            if is_bot_wall(html):
                msg = f"BOT_WALL {url}"
                blockers.append(msg)
                ck.note_error(msg)
                consecutive_walls += 1
                print(f"  blocker: {msg}", flush=True)
                if consecutive_walls >= 5:
                    print(f"{slug}: aborting — repeated bot walls", flush=True)
                    break
                continue
            consecutive_walls = 0
            row = parse_product(html, url, slug=slug, breeder_name=name)
            if row is None:
                skipped.add(nu)
                done.add(nu)
            else:
                by_url[nu] = row
                done.add(nu)
                scraped_this_run += 1
                if scraped_this_run <= 3 or scraped_this_run % 25 == 0:
                    print(
                        f"  ok #{scraped_this_run} idx={idx}/{len(urls)} name={row.get('name')!r}",
                        flush=True,
                    )
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            if "HTTP 404" in str(exc) or "HTTP 410" in str(exc):
                skipped.add(nu)
                done.add(nu)
            else:
                blockers.append(msg)
                ck.note_error(msg)
                print(f"  fail {msg}", flush=True)
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(urls) or (
            scraped_this_run == 0 and idx % checkpoint_every == 0
        ):
            items = list(by_url.values())
            save_checkpoint(ck, done, skipped, cursor=url)
            try:
                write_dump(
                    out,
                    "strains",
                    items,
                    source=slug,
                    source_url=base,
                    license=LICENSE,
                    redistributable=False,
                    note=f"partial checkpoint {len(items)}/{len(urls)}",
                    blockers=blockers[-40:],
                    breeder_name=name,
                )
            except OSError as exc:
                print(f"  dump write warn: {exc}", flush=True)
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  {slug} checkpoint items={len(items)} this_run={scraped_this_run} "
                f"rate={rate:.2f}/s idx={idx}/{len(urls)}",
                flush=True,
            )
            if (
                not no_stage
                and stage_every > 0
                and (len(items) - last_staged_at) >= stage_every
            ):
                try:
                    stage_dump(slug, reset=True)
                    last_staged_at = len(items)
                except Exception as exc:  # noqa: BLE001
                    print(f"  staging warn: {exc}", flush=True)

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    save_checkpoint(ck, done, skipped)
    write_dump(
        out,
        "strains",
        items,
        source=slug,
        source_url=base,
        license=LICENSE,
        redistributable=False,
        note="tier-A storefront scrape complete",
        sitemap_count=len(urls),
        skipped=len(skipped),
        blockers=blockers[-40:],
        breeder_name=name,
        platform=platform,
    )
    print(f"wrote {out.name} count={len(items)}", flush=True)
    if not no_stage and items:
        try:
            stage_dump(slug, reset=True)
        except Exception as exc:  # noqa: BLE001
            print(f"{slug} final staging failed: {exc}", flush=True)
            result["staging_error"] = str(exc)[:200]

    result["status"] = "ok" if items else "empty_after_scrape"
    result["count"] = len(items)
    result["skipped"] = len(skipped)
    return result



def claim_tier_a_half1(*, force_refresh: bool = False) -> list[dict[str, Any]]:
    """Authoritative: partitions.tier_A_first_half -> tiers.A[lo:hi]."""
    if not QUEUE.exists():
        raise FileNotFoundError(QUEUE)
    q = json.loads(QUEUE.read_text(encoding="utf-8"))
    A = list((q.get("tiers") or {}).get("A") or [])
    part = (q.get("partitions") or {}).get("tier_A_first_half") or {}
    sl = part.get("slice")
    if not (isinstance(sl, list) and len(sl) == 2 and A):
        raise RuntimeError("queue missing partitions.tier_A_first_half.slice")
    lo, hi = int(sl[0]), int(sl[1])
    claimed = A[lo:hi]
    claim = {
        "owner": "tier_a_first_half",
        "partition": "partitions.tier_A_first_half",
        "queue_built_at": q.get("built_at"),
        "queue_partial": q.get("partial"),
        "tier_A_total": len(A),
        "slice": [lo, hi],
        "claimed_count": len(claimed),
        "claimed_names": [e.get("name") for e in claimed],
        "claimed": claimed,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    if force_refresh or not CLAIM.exists():
        CLAIM.write_text(json.dumps(claim, indent=2), encoding="utf-8")
    else:
        prev = json.loads(CLAIM.read_text(encoding="utf-8"))
        if (
            prev.get("partition") == "partitions.tier_A_first_half"
            and prev.get("claimed_count") == len(claimed)
            and prev.get("slice") == [lo, hi]
        ):
            print(
                f"using partition claim {len(claimed)} banks "
                f"(updated_at={prev.get('updated_at')})",
                flush=True,
            )
            return list(prev.get("claimed") or claimed)
        CLAIM.write_text(json.dumps(claim, indent=2), encoding="utf-8")
    print(f"partition tier_A_first_half slice=[{lo}:{hi}] n={len(claimed)}", flush=True)
    return claimed


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape Tier A half-1 breeder storefronts")
    ap.add_argument("--delay", type=float, default=0.55)
    ap.add_argument("--limit", type=int, default=None, help="Max PDPs per bank")
    ap.add_argument("--refresh-urls", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--stage-every", type=int, default=200)
    ap.add_argument("--no-stage", action="store_true")
    ap.add_argument("--bank", default=None, help="Only this slug/name")
    ap.add_argument("--refresh-claim", action="store_true")
    ap.add_argument("--max-banks", type=int, default=None)
    args = ap.parse_args(argv)

    DATA.mkdir(parents=True, exist_ok=True)
    STAGING_DIR.mkdir(parents=True, exist_ok=True)

    claimed = claim_tier_a_half1(force_refresh=args.refresh_claim)
    print(f"claimed {len(claimed)} banks: {[c.get('name') for c in claimed]}", flush=True)

    if args.bank:
        key = args.bank.lower().replace("_", " ").replace("-", " ")
        claimed = [
            c
            for c in claimed
            if bank_slug(c.get("name") or "") == args.bank
            or (c.get("name") or "").lower() == args.bank.lower()
            or key in (c.get("name") or "").lower()
        ]
        if not claimed:
            # allow direct queue lookup
            q = json.loads(QUEUE.read_text(encoding="utf-8"))
            for tier in q.get("tiers", {}).values():
                for e in tier:
                    if bank_slug(e.get("name") or "") == args.bank or (
                        e.get("name") or ""
                    ).lower() == args.bank.lower():
                        claimed = [e]
                        break
        if not claimed:
            print(f"bank not found: {args.bank}", flush=True)
            return 2

    if args.max_banks is not None:
        claimed = claimed[: max(0, args.max_banks)]

    results: list[dict[str, Any]] = []
    if RESULTS.exists():
        try:
            prev = json.loads(RESULTS.read_text(encoding="utf-8"))
            results = list(prev.get("results") or [])
        except (OSError, json.JSONDecodeError):
            results = []
    by_name = {r.get("name"): r for r in results if r.get("name")}

    for entry in claimed:
        name = entry.get("name")
        # Skip if already successfully scraped with items
        prev_r = by_name.get(name) or {}
        if prev_r.get("status") == "ok" and (prev_r.get("count") or 0) > 0:
            dump = DATA / f"dsc_strains_{bank_slug(name)}.json"
            if dump.exists():
                print(f"skip already ok: {name} count={prev_r.get('count')}", flush=True)
                continue
        # Skip permanent failures after one attempt
        if prev_r.get("status", "").startswith("skip_") and prev_r.get("status") in {
            "skip_dns",
            "skip_parked",
            "skip_empty",
            "skip_empty_catalog",
            "skip_home_fail",
        }:
            print(f"skip prior fail: {name} {prev_r.get('status')}", flush=True)
            continue

        print(f"\n=== {name} ({entry.get('url')}) plat={entry.get('platform')} ===", flush=True)
        r = scrape_bank(
            entry,
            delay=args.delay,
            limit=args.limit,
            refresh=args.refresh_urls,
            checkpoint_every=max(5, args.checkpoint_every),
            stage_every=0 if args.no_stage else max(0, args.stage_every),
            no_stage=args.no_stage,
        )
        by_name[name] = r
        results = list(by_name.values())
        RESULTS.write_text(
            json.dumps(
                {
                    "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "attempted": len(results),
                    "succeeded": sum(1 for x in results if x.get("status") == "ok"),
                    "total_items": sum(int(x.get("count") or 0) for x in results),
                    "results": results,
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        print(json.dumps(r, indent=2), flush=True)

    ok = [r for r in by_name.values() if r.get("status") == "ok"]
    print(
        f"\nDONE attempted={len(by_name)} succeeded={len(ok)} "
        f"items={sum(int(r.get('count') or 0) for r in ok)}",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
