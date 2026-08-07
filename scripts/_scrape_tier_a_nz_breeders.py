#!/usr/bin/env python3
"""Fan-out Tier A second half from classifier queue partitions.

Owns `partitions.tier_A_second_half` (tiers.A[96:192], 96 banks).
Dump + staging only. NO master merge. NO StrainDB. NO Task Scheduler.
Writes: homeassistant/data/dsc_strains_<slug>.json
        brain/data/staging/bank_<slug>.sqlite3
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, polite_get, write_dump, parse_grow_fields  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402
from _classify_breeder_storefronts_1482 import (  # noqa: E402
    EXCLUDED,
    KNOWN_URLS,
    detect_platform,
    http_get,
    norm_name,
    slugify,
)

LICENSE = "research archival scrape; redistributable=false until legal review"
QUEUE = DATA / "_breeder_scrape_queue_1482.json"
RESULTS = DATA / "_tier_a_second_half_scrape_results.json"
PARTITION_KEY = "tier_A_second_half"
FIRST_HALF_KEY = "tier_A_first_half"
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Already covered / mid-flight — do not touch (sibling A–M + prior waves).
SKIP_SLUGS = {
    "multiverse",
    "weedseedsexpress",
    "wse",
    "alchimia",
    "hytiva",
    "cannaconnection",
    "seedsman",
    "rqs",
    "royal-queen",
    "fastbuds",
    "barneys",
    "mephisto",
    "dna",
    "dutchpassion",
    "greenhouse",
    "ilgm",
    "seedsupreme",
    "seed-supreme",
    "pacific",
    "truenorth",
    "cropking",
    "dcseed",
    "dcseedexchange",
    "zamnesia",
    "herbies",
    "seedfinder",
    "seed-city",
    "seedcity",
    "north-atlantic-seed-co",
    "north-atlantic",
    "northatlantic",
    "straindb",
    "strain-database",
}

SKIP_NAME_SUBSTR = (
    "north atlantic",
    "seed city",
    "seedfinder",
)

SEED_KEEP_RE = re.compile(
    r"(?:seed|autoflower|feminiz|regular|photoperiod|cbd|cannabis|marijuana|"
    r"strain|genetics|bean|pack)",
    re.I,
)
SEED_SKIP_RE = re.compile(
    r"(?:shirt|hoodie|hat|merch|apparel|sticker|poster|gift.?card|grinder|"
    r"tray|lighter|ashtray|vape|cart|gumm|delta|edible|tincture|bong|pipe)",
    re.I,
)


def is_nz_name(name: str) -> bool:
    """True for inventory names whose leading letter is N–Z (digits → sibling)."""
    s = (name or "").strip()
    if not s:
        return False
    c = s[0].upper()
    if not c.isalpha():
        return False
    return c >= "N"


def staging_source_id(slug: str) -> str:
    return f"bank_{slug}"


def dump_path(slug: str) -> Path:
    return DATA / f"dsc_strains_{slug}.json"


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


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def sitemap_locs(body: str) -> list[str]:
    out: list[str] = []
    for m in re.finditer(
        r"<loc>\s*(?:<!\[CDATA\[(.*?)\]\]>|([^<\s]+))\s*</loc>",
        body or "",
        re.I | re.S,
    ):
        u = (m.group(1) or m.group(2) or "").strip()
        if u:
            out.append(html_lib.unescape(u))
    return out


def normalize_url(url: str) -> str:
    u = (url or "").strip().split("#")[0].split("?")[0]
    if u.endswith("/") and len(urlparse(u).path) > 1:
        u = u.rstrip("/")
    return u


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


def looks_like_seed_product(title: str, tags: str = "", handle: str = "") -> bool:
    blob = f"{title} {tags} {handle}"
    if re.search(
        r"(?:about us|how to germinate|privacy|shipping|contact|faq|blog|"
        r"gift card|sticker|hat pin|merch)",
        blob,
        re.I,
    ):
        return False
    if SEED_SKIP_RE.search(blob) and not SEED_KEEP_RE.search(blob):
        return False
    if SEED_KEEP_RE.search(blob):
        return True
    # Many breeder shops are seeds-only; keep if not clearly merch
    return not SEED_SKIP_RE.search(blob)


def host_matches_name(url: str, name: str) -> bool:
    """Reject false domain guesses (olympic.com, power.com, hugedomains, …)."""
    host = _host_key(urlparse(url).hostname or "")
    if not host:
        return False
    junk = (
        "hugedomains",
        "godaddy",
        "sedo.",
        "domain_profile",
        "google.",
        "chrome",
        "wordpress.com",
        "facebook.",
        "instagram.",
        "nameadvisor",
        "namecheap",
    )
    if any(j in host or j in url.lower() for j in junk):
        return False
    tokens = [
        t
        for t in slugify(name).split("-")
        if t not in {"seeds", "seed", "genetics", "genetix", "company", "co", "bank", "the", "of", "and"}
        and len(t) >= 3
    ]
    compact = host.replace("-", "").replace(".", "")
    if not tokens:
        return slugify(name).replace("-", "")[:5] in compact
    return any(t in compact for t in tokens)


def load_partition_rows(partition_key: str = PARTITION_KEY) -> tuple[list[dict[str, Any]], set[str]]:
    """Return (second_half rows, first_half name set) from classifier queue."""
    if not QUEUE.exists():
        raise FileNotFoundError(QUEUE)
    doc = json.loads(QUEUE.read_text(encoding="utf-8"))
    tiers_a = list((doc.get("tiers") or {}).get("A") or [])
    parts = doc.get("partitions") or {}
    part = parts.get(partition_key) or {}
    sl = part.get("slice") or [96, 192]
    start, end = int(sl[0]), int(sl[1])
    rows = tiers_a[start:end]
    first = parts.get(FIRST_HALF_KEY) or {}
    fsl = first.get("slice") or [0, 96]
    first_names = {
        (r.get("name") or "")
        for r in tiers_a[int(fsl[0]) : int(fsl[1])]
        if r.get("name")
    }
    print(
        f"partition {partition_key} slice=[{start}:{end}] rows={len(rows)} "
        f"(tiers.A={len(tiers_a)})",
        flush=True,
    )
    return rows, first_names


def load_targets(*, only: set[str] | None = None) -> list[dict[str, Any]]:
    """Load official tier_A_second_half partition; never include first_half banks."""
    rows, first_names = load_partition_rows(PARTITION_KEY)
    targets: list[dict[str, Any]] = []
    skipped_first = 0
    skipped_host = 0
    skipped_done = 0
    for r in rows:
        name = r.get("name") or r.get("breeder") or ""
        if not name:
            continue
        if name in first_names:
            skipped_first += 1
            continue
        if norm_name(name) in EXCLUDED:
            continue
        url = r.get("url") or r.get("base") or KNOWN_URLS.get(norm_name(name))
        if not url:
            continue
        # Soft filter junk parked domains; still allow weak host match for ranked A
        if "hugedomains" in url.lower() or "domain_profile" in url.lower():
            skipped_host += 1
            continue
        slug = r.get("slug") or slugify(name)
        if slug in SKIP_SLUGS or any(s in norm_name(name) for s in SKIP_NAME_SUBSTR):
            continue
        if only and slug not in only and slugify(name) not in only:
            continue
        # Resume: skip already-fat dumps unless forced via --only
        if not only:
            dump = dump_path(slug)
            st = ROOT / "brain" / "data" / "staging" / f"bank_{slug}.sqlite3"
            if st.exists() and st.stat().st_size > 200_000:
                skipped_done += 1
                continue
            if dump.exists():
                try:
                    prev = json.loads(dump.read_text(encoding="utf-8"))
                    if int(prev.get("count") or 0) >= 25:
                        skipped_done += 1
                        continue
                except (OSError, json.JSONDecodeError, TypeError, ValueError):
                    pass
        caps = [
            p.get("hint")
            for p in (r.get("probes") or [])
            if p.get("ok") and p.get("hint")
        ]
        targets.append(
            {
                "name": name,
                "slug": slug,
                "url": url,
                "platform": r.get("platform"),
                "tier": "A",
                "source": "partition",
                "capabilities": [c for c in caps if c],
            }
        )
    print(
        f"targets={len(targets)} skipped_done={skipped_done} "
        f"skipped_parked={skipped_host} skipped_first_half={skipped_first}",
        flush=True,
    )
    return targets


def probe_target(t: dict[str, Any]) -> dict[str, Any]:
    url = t["url"]
    host = urlparse(url).hostname or ""
    out = {**t, "probe_ok": False, "skip_reason": None}
    try:
        socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    except socket.gaierror:
        out["skip_reason"] = "dns"
        out["tier"] = "D"
        return out

    status, html, final, headers = http_get(url, timeout=8.0, max_bytes=100_000)
    err = headers.get("_error")
    if status is None:
        out["skip_reason"] = err or "unreachable"
        out["tier"] = "D"
        return out
    if status >= 400:
        out["skip_reason"] = f"http_{status}"
        out["status"] = status
        out["tier"] = "D"
        return out
    if is_bot_wall(html or ""):
        out["skip_reason"] = "bot_wall"
        out["tier"] = "C"
        return out

    det = detect_platform(final or url, html or "", headers)
    base = f"{urlparse(final or url).scheme}://{urlparse(final or url).netloc}"
    out.update(
        {
            "probe_ok": True,
            "status": status,
            "url": final or url,
            "base": base,
            "platform": det.get("platform") or t.get("platform"),
            "signals": det.get("signals") or [],
        }
    )

    # Quick capability probes
    capabilities: list[str] = []
    for path, label in (
        ("/products.json", "shopify_json"),
        ("/sitemap.xml", "sitemap"),
        ("/sitemap_index.xml", "sitemap_index"),
        ("/product-sitemap.xml", "wc_product_sitemap"),
        ("/sitemap_products_1.xml", "shopify_sitemap"),
    ):
        st2, body2, _, _ = http_get(base + path, timeout=6.0, max_bytes=60_000)
        if st2 and 200 <= st2 < 400 and body2:
            if label == "shopify_json" and '"products"' in body2:
                capabilities.append(label)
            elif "sitemap" in label and ("<loc>" in body2 or "<urlset" in body2.lower()):
                capabilities.append(label)
    out["capabilities"] = capabilities
    if "coming_soon" in (out.get("signals") or []):
        out["skip_reason"] = "coming_soon"
        out["tier"] = "D"
        out["probe_ok"] = False
        return out
    if "parked" in (out.get("signals") or []):
        out["skip_reason"] = "parked"
        out["tier"] = "D"
        out["probe_ok"] = False
        return out
    if not capabilities and not out.get("platform"):
        out["skip_reason"] = "no_catalog_signal"
        out["tier"] = "C"
        # still mark probe_ok so we can try hard later — but for fan-out skip quick
        out["probe_ok"] = False
        return out
    out["tier"] = "A" if capabilities or out.get("platform") in (
        "shopify",
        "woocommerce",
        "magento",
    ) else "B"
    return out


def fetch_json(url: str, *, timeout: int = 60) -> Any:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, context=ssl.create_default_context(), timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def scrape_shopify_products_json(
    slug: str,
    name: str,
    base: str,
    *,
    delay: float,
    limit: int | None,
) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    page = 1
    while True:
        url = f"{base.rstrip('/')}/products.json?limit=250&page={page}"
        time.sleep(max(0.0, delay))
        try:
            doc = fetch_json(url, timeout=60)
        except Exception as exc:  # noqa: BLE001
            print(f"  {slug} products.json page {page} fail: {exc}", flush=True)
            break
        products = doc.get("products") if isinstance(doc, dict) else None
        if not products:
            break
        for p in products:
            if not isinstance(p, dict):
                continue
            title = str(p.get("title") or "").strip()
            handle = str(p.get("handle") or "").strip()
            tags = p.get("tags") or ""
            if isinstance(tags, list):
                tags = ", ".join(str(x) for x in tags)
            if not title or not looks_like_seed_product(title, str(tags), handle):
                continue
            product_url = f"{base.rstrip('/')}/products/{handle}" if handle else None
            body = clean(str(p.get("body_html") or ""))
            grow = parse_grow_fields(f"{title} {body} {tags}")
            vendor = str(p.get("vendor") or "").strip() or name
            images = p.get("images") or []
            image_url = None
            if images and isinstance(images[0], dict):
                image_url = images[0].get("src")
            variants = p.get("variants") or []
            price = None
            sku = None
            if variants and isinstance(variants[0], dict):
                price = variants[0].get("price")
                sku = variants[0].get("sku")
            chemistry: dict[str, Any] = {}
            if grow.get("thc") is not None:
                chemistry["thc"] = grow["thc"]
            if grow.get("cbd") is not None:
                chemistry["cbd"] = grow["cbd"]
            row: dict[str, Any] = {
                "name": title[:200],
                "name_norm": name_norm(title),
                "breeder": vendor,
                "brand": vendor,
                "bank": slug,
                "source": staging_source_id(slug),
                "seed_bank": base,
                "url": product_url,
                "slug": handle,
                "sku": str(sku) if sku else None,
                "description": body[:4000] if body else None,
                "image_url": image_url,
                "price": price,
                "tags": tags if tags else None,
                "product_type": p.get("product_type"),
                "raw_record": {
                    "shopify_product": {
                        k: p.get(k)
                        for k in (
                            "id",
                            "title",
                            "handle",
                            "vendor",
                            "product_type",
                            "tags",
                            "variants",
                            "images",
                            "body_html",
                        )
                        if p.get(k) is not None
                    }
                },
            }
            row.update({k: v for k, v in grow.items() if v not in (None, "", [], {})})
            if chemistry:
                row["chemistry"] = chemistry
            items.append({k: v for k, v in row.items() if v not in (None, "", [], {})})
            if limit is not None and len(items) >= limit:
                return items
        if len(products) < 250:
            break
        page += 1
        if page > 40:
            break
    return items


def _host_key(netloc: str) -> str:
    h = (netloc or "").lower()
    if h.startswith("www."):
        h = h[4:]
    return h


def is_product_url(url: str, base_host: str) -> bool:
    """Accept common WC/Shopify/Magento product URL shapes (www-tolerant)."""
    u = normalize_url(url)
    p = urlparse(u)
    if _host_key(p.netloc) != _host_key(base_host):
        return False
    path = p.path or ""
    if re.search(
        r"/(?:cart|checkout|account|login|blog|contact|about|privacy|terms|"
        r"shipping|faq|category|tag|author|page|shop/?$|collections/)(/|$)",
        path,
        re.I,
    ):
        return False
    # Woo / Shopify classic
    if re.search(r"^/(?:product|products)/[a-z0-9][a-z0-9\-_%]+/?$", path, re.I):
        return True
    # Some WC catalogs use /shop/{slug}/
    if re.search(r"^/shop/[a-z0-9][a-z0-9\-_%]+/?$", path, re.I):
        return True
    # Magento / Presta-ish .html products
    if re.search(r"/[a-z0-9][a-z0-9\-_%]+\.html?$", path, re.I):
        return True
    # Locale + product: /en/.../product-name or /product/name
    if re.search(r"^/(?:en|es|de|fr|nl|it)/product/[a-z0-9][a-z0-9\-_%]+/?$", path, re.I):
        return True
    if re.search(r"^/product/[a-z0-9][a-z0-9\-_%]+(?:/\d+)?/?$", path, re.I):
        return True
    return False


def discover_product_urls(base: str, platform: str | None, *, delay: float) -> list[str]:
    found: set[str] = set()
    host = urlparse(base).netloc.lower()
    roots = [base.rstrip("/")]
    # Also try www / non-www twin
    if "://" in base:
        scheme, rest = base.split("://", 1)
        rest = rest.rstrip("/")
        if rest.startswith("www."):
            roots.append(f"{scheme}://{rest[4:]}")
        else:
            roots.append(f"{scheme}://www.{rest}")
    sm_paths = [
        "/product-sitemap.xml",
        "/product-sitemap1.xml",
        "/sitemap_index.xml",
        "/sitemap.xml",
        "/sitemap_products_1.xml",
        "/wp-sitemap-posts-product-1.xml",
        "/media/sitemap/sitemap.xml",
        "/pub/media/sitemap/sitemap.xml",
    ]
    sm_candidates: list[str] = []
    for root in roots:
        for path in sm_paths:
            sm_candidates.append(root + path)

    seen_sm: set[str] = set()
    for sm in sm_candidates:
        if sm in seen_sm:
            continue
        seen_sm.add(sm)
        try:
            body = polite_get(sm, delay=delay, timeout=60)
        except Exception:
            continue
        # Skip HTML soft-404s pretending to be sitemaps
        if "<html" in (body or "")[:200].lower() and "<urlset" not in (body or "").lower():
            continue
        locs = sitemap_locs(body)
        # Expand nested sitemap indexes (prefer product* names first)
        child_sms = [u for u in locs if "sitemap" in u.lower() and ".xml" in u.lower()]
        child_sms.sort(key=lambda u: (0 if "product" in u.lower() else 1, u))
        for child in child_sms[:20]:
            if child in seen_sm:
                continue
            seen_sm.add(child)
            try:
                body2 = polite_get(child, delay=delay, timeout=60)
            except Exception:
                continue
            if "<html" in (body2 or "")[:200].lower() and "<urlset" not in (body2 or "").lower():
                continue
            locs.extend(sitemap_locs(body2))
        before = len(found)
        for loc in locs:
            u = normalize_url(loc)
            if is_product_url(u, host):
                found.add(u)
        print(f"  sitemap {sm} +children -> +{len(found) - before} (total {len(found)})", flush=True)
        if len(found) >= 20:
            break

    # Category HTML fallback (Magento / custom — Sensi, Sweet, etc.)
    if len(found) < 5:
        cat_paths = [
            "/en/cannabis-seeds",
            "/en/feminized-seeds",
            "/en/autoflowering-seeds",
            "/en/regular-seeds",
            "/cannabis-seeds",
            "/feminized-seeds",
            "/shop/",
            "/en/shop/",
            "/collections/all",
            "/seed-bank/",
            "/seeds/",
        ]
        href_re = re.compile(r'href=["\']([^"\']+)["\']', re.I)
        for root in roots:
            for path in cat_paths:
                try:
                    html = polite_get(root + path, delay=delay, timeout=45)
                except Exception:
                    continue
                before = len(found)
                for href in href_re.findall(html or ""):
                    abs_u = normalize_url(urljoin(root + "/", href))
                    if is_product_url(abs_u, host) or (
                        _host_key(urlparse(abs_u).netloc) == _host_key(host)
                        and SEED_KEEP_RE.search(abs_u)
                        and re.search(r"/[a-z0-9\-]+/?$", urlparse(abs_u).path, re.I)
                        and not re.search(
                            r"/(?:cannabis-seeds|feminized|autoflower|regular|shop|collections)(?:/|$)",
                            urlparse(abs_u).path,
                            re.I,
                        )
                    ):
                        # Prefer seed-ish product paths from category pages
                        if "/product" in abs_u or abs_u.endswith(".html") or SEED_KEEP_RE.search(
                            urlparse(abs_u).path
                        ):
                            found.add(abs_u)
                if len(found) > before:
                    print(
                        f"  category {root}{path} -> +{len(found) - before} (total {len(found)})",
                        flush=True,
                    )
                if len(found) >= 40:
                    break
            if len(found) >= 40:
                break
    return sorted(found)


def parse_pdp(html: str, url: str, *, slug: str, default_breeder: str) -> dict[str, Any] | None:
    if is_bot_wall(html):
        return None
    text = clean(html)
    if len(text) < 80:
        return None
    title = None
    m = re.search(r"<title[^>]*>([^<]+)</title>", html or "", re.I)
    if m:
        title = html_lib.unescape(m.group(1)).strip()
        title = re.sub(r"\s*[|–-]\s*.*$", "", title).strip()
    product: dict[str, Any] = {}
    for d in extract_json_ld(html):
        types = d.get("@type")
        tlist = types if isinstance(types, list) else [types]
        if any(str(t).lower() == "product" for t in tlist if t):
            product = d
            break
    if product.get("name"):
        title = str(product["name"]).strip()
    if not title:
        return None
    if not looks_like_seed_product(title, handle=urlparse(url).path):
        return None
    brand = default_breeder
    b = product.get("brand")
    if isinstance(b, dict) and b.get("name"):
        brand = str(b["name"]).strip()
    elif isinstance(b, str) and b.strip():
        brand = b.strip()
    description = None
    if product.get("description"):
        description = clean(str(product["description"]))[:4000]
    elif text:
        description = text[:4000]
    grow = parse_grow_fields(f"{title} {description or ''} {text[:2000]}")
    chemistry: dict[str, Any] = {}
    if grow.get("thc") is not None:
        chemistry["thc"] = grow["thc"]
    if grow.get("cbd") is not None:
        chemistry["cbd"] = grow["cbd"]
    image_url = None
    img = product.get("image")
    if isinstance(img, str):
        image_url = img
    elif isinstance(img, list) and img:
        image_url = img[0] if isinstance(img[0], str) else (img[0] or {}).get("url")
    elif isinstance(img, dict):
        image_url = img.get("url") or img.get("contentUrl")
    row: dict[str, Any] = {
        "name": title[:200],
        "name_norm": name_norm(title),
        "breeder": brand,
        "brand": brand,
        "bank": slug,
        "source": staging_source_id(slug),
        "url": normalize_url(url),
        "description": description,
        "image_url": image_url,
        "page_text_excerpt": text[:1200],
        "raw_record": {
            "json_ld_product": {
                k: product.get(k)
                for k in ("@type", "name", "sku", "brand", "offers", "description")
                if product.get(k) is not None
            },
            "url": url,
        },
    }
    row.update({k: v for k, v in grow.items() if v not in (None, "", [], {})})
    if chemistry:
        row["chemistry"] = chemistry
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def scrape_sitemap_pdps(
    slug: str,
    name: str,
    base: str,
    platform: str | None,
    *,
    delay: float,
    limit: int | None,
    checkpoint_every: int,
    stage_every: int,
) -> list[dict[str, Any]]:
    out = dump_path(slug)
    ck = Checkpoint(DATA / f"dsc_strains_{slug}.checkpoint.json")
    urls = discover_product_urls(base, platform, delay=delay)
    if limit is not None:
        urls = urls[: max(0, limit)]
    print(f"{slug}: sitemap/product urls={len(urls)}", flush=True)
    if not urls:
        return []

    done = set(ck.data.get("done") or [])
    skipped = set(ck.data.get("skipped") or [])
    by_url: dict[str, dict] = {}
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8"))
            for i in prev.get("items") or []:
                if isinstance(i, dict) and i.get("url"):
                    by_url[normalize_url(i["url"])] = i
        except (OSError, json.JSONDecodeError):
            pass

    scraped = 0
    walls = 0
    t0 = time.time()
    last_staged = 0
    for idx, url in enumerate(urls, 1):
        nu = normalize_url(url)
        if nu in skipped or (nu in done and nu in by_url):
            continue
        try:
            html = polite_get(url, delay=delay, timeout=90)
            if is_bot_wall(html):
                walls += 1
                print(f"  {slug} bot wall {url}", flush=True)
                if walls >= 4:
                    break
                continue
            walls = 0
            row = parse_pdp(html, url, slug=slug, default_breeder=name)
            if row is None:
                skipped.add(nu)
                done.add(nu)
            else:
                by_url[nu] = row
                done.add(nu)
                scraped += 1
                if scraped <= 2 or scraped % 25 == 0:
                    print(f"  {slug} ok #{scraped} {row.get('name')!r}", flush=True)
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            if "HTTP 404" in msg or "HTTP 410" in msg:
                skipped.add(nu)
                done.add(nu)
            else:
                print(f"  {slug} fail {url}: {exc}", flush=True)
            continue

        if scraped % checkpoint_every == 0 or idx == len(urls):
            items = list(by_url.values())
            ck.data["done"] = sorted(done)
            ck.data["skipped"] = sorted(skipped)
            ck.data["done_count"] = len(done)
            try:
                ck.save()
            except OSError:
                pass
            write_dump(
                out,
                "strains",
                items,
                source=staging_source_id(slug),
                source_url=base,
                license=LICENSE,
                redistributable=False,
                note=f"partial {len(items)}/{len(urls)}",
                breeder_name=name,
            )
            print(
                f"  {slug} checkpoint items={len(items)} scraped={scraped} "
                f"rate={scraped / max(1.0, time.time() - t0):.2f}/s",
                flush=True,
            )
            if stage_every > 0 and (len(items) - last_staged) >= stage_every:
                try:
                    stage_bank(slug, reset=True)
                    last_staged = len(items)
                except Exception as exc:  # noqa: BLE001
                    print(f"  staging warn: {exc}", flush=True)

    return list(by_url.values())


def stage_bank(slug: str, *, reset: bool = True) -> dict:
    out = dump_path(slug)
    if not out.exists():
        raise FileNotFoundError(out)
    st = write_dump_to_staging(out, source_id=staging_source_id(slug), reset=reset)
    print(
        f"{slug} staging: family={st.get('family')} raw={((st.get('stats') or {}).get('raw_record'))} "
        f"db={st.get('staging_db')}",
        flush=True,
    )
    return st


def scrape_one(
    t: dict[str, Any],
    *,
    delay: float,
    limit: int | None,
    checkpoint_every: int,
    stage_every: int,
    enrich_pdp: bool,
) -> dict[str, Any]:
    slug = t["slug"]
    name = t["name"]
    base = t.get("base") or t["url"]
    platform = t.get("platform")
    caps = set(t.get("capabilities") or [])
    result: dict[str, Any] = {
        "name": name,
        "slug": slug,
        "url": base,
        "platform": platform,
        "status": "started",
        "count": 0,
    }
    print(f"=== scrape {slug} ({name}) platform={platform} caps={sorted(caps)}", flush=True)
    items: list[dict[str, Any]] = []
    method = None
    try:
        # Always try Shopify products.json first — cheap & high-yield when present
        items = scrape_shopify_products_json(
            slug, name, base, delay=delay, limit=limit
        )
        if items:
            method = "shopify_products_json"
        elif "shopify_json" in caps or platform == "shopify":
            method = "sitemap_fallback"
            items = scrape_sitemap_pdps(
                slug,
                name,
                base,
                platform,
                delay=delay,
                limit=limit,
                checkpoint_every=checkpoint_every,
                stage_every=stage_every,
            )
        else:
            method = "sitemap_pdp"
            items = scrape_sitemap_pdps(
                slug,
                name,
                base,
                platform,
                delay=delay,
                limit=limit,
                checkpoint_every=checkpoint_every,
                stage_every=stage_every,
            )

        items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
        write_dump(
            dump_path(slug),
            "strains",
            items,
            source=staging_source_id(slug),
            source_url=base,
            license=LICENSE,
            redistributable=False,
            note=f"{method} complete",
            breeder_name=name,
            method=method,
        )
        result["count"] = len(items)
        result["method"] = method
        if items:
            st = stage_bank(slug, reset=True)
            result["staging_family"] = st.get("family")
            result["staging_raw"] = (st.get("stats") or {}).get("raw_record")
            result["status"] = "ok"
        else:
            result["status"] = "empty"
            result["skip_reason"] = "zero_products"
    except Exception as exc:  # noqa: BLE001
        result["status"] = "error"
        result["error"] = str(exc)
        print(f"{slug} ERROR: {exc}", flush=True)
    return result


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Tier A N–Z breeder fan-out scrape")
    ap.add_argument("--delay", type=float, default=0.55)
    ap.add_argument("--limit", type=int, default=None, help="Max products per bank")
    ap.add_argument("--max-banks", type=int, default=None)
    ap.add_argument("--only", type=str, default=None, help="Comma slug filter")
    ap.add_argument("--probe-only", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=20)
    ap.add_argument("--stage-every", type=int, default=80)
    ap.add_argument("--enrich-pdp", action="store_true")
    args = ap.parse_args(argv)

    DATA.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in (args.only or "").split(",") if s.strip()}
    targets = load_targets(only=only or None)

    print(f"probing {len(targets)} targets…", flush=True)
    probed: list[dict[str, Any]] = []
    for t in targets:
        row = probe_target(t)
        probed.append(row)
        reason = row.get("skip_reason") or ("ok" if row.get("probe_ok") else "?")
        print(
            f"  probe {row['slug']}: tier={row.get('tier')} platform={row.get('platform')} "
            f"{reason} caps={row.get('capabilities')}",
            flush=True,
        )

    scrapeable = [p for p in probed if p.get("probe_ok") and p.get("tier") in ("A", "B", "A?")]
    # Prefer Shopify JSON / strong WC sitemaps first
    def _rank(r: dict[str, Any]) -> tuple:
        caps = set(r.get("capabilities") or [])
        plat = r.get("platform")
        if "shopify_json" in caps or plat == "shopify":
            return (0, r["slug"])
        if "wc_product_sitemap" in caps or plat == "woocommerce":
            return (1, r["slug"])
        if plat == "magento":
            return (2, r["slug"])
        return (3, r["slug"])

    scrapeable.sort(key=_rank)
    if args.max_banks is not None:
        scrapeable = scrapeable[: args.max_banks]

    summary: dict[str, Any] = {
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "partition": PARTITION_KEY,
        "half": "tier_A_second_half",
        "tier": "A",
        "probed": len(probed),
        "scrapeable": len(scrapeable),
        "skipped": [
            {
                "slug": p["slug"],
                "name": p["name"],
                "reason": p.get("skip_reason"),
                "tier": p.get("tier"),
            }
            for p in probed
            if not p.get("probe_ok")
        ],
        "results": [],
    }

    if args.probe_only:
        RESULTS.write_text(json.dumps(summary, indent=2), encoding="utf-8")
        print(json.dumps({k: summary[k] for k in ("probed", "scrapeable")}, indent=2))
        return 0

    for t in scrapeable:
        res = scrape_one(
            t,
            delay=args.delay,
            limit=args.limit,
            checkpoint_every=args.checkpoint_every,
            stage_every=args.stage_every,
            enrich_pdp=args.enrich_pdp,
        )
        summary["results"].append(res)
        RESULTS.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    ok = [r for r in summary["results"] if r.get("status") == "ok"]
    empty = [r for r in summary["results"] if r.get("status") == "empty"]
    err = [r for r in summary["results"] if r.get("status") == "error"]
    total_items = sum(int(r.get("count") or 0) for r in summary["results"])
    summary["totals"] = {
        "ok_banks": len(ok),
        "empty_banks": len(empty),
        "error_banks": len(err),
        "items": total_items,
    }
    RESULTS.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(
        f"DONE ok={len(ok)} empty={len(empty)} err={len(err)} items={total_items} "
        f"skipped_dead={len(summary['skipped'])}",
        flush=True,
    )
    for r in ok:
        print(f"  OK {r['slug']}: {r['count']} ({r.get('method')})", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
