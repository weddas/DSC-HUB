#!/usr/bin/env python3
"""Polite seed-bank scrapers (research corpus). Checkpoint/resume; maximize fields.

Priority banks use product sitemaps (full coverage): Herbies, RQS, ILGM,
Zamnesia, SeedSupreme. Other banks still use list-page discovery.

Dump:    homeassistant/data/dsc_strains_{bank}.json
Staging: brain/data/staging/bank_*.sqlite3 (FULL raw_record)
Redistributable=false — research scrape until legal review.
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
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402

UA_NOTE = "research archival scrape; redistributable=false until legal review"

# Category/hub pages that share .html product-shaped URLs (SeedSupreme Magento).
_SS_HUBS = {
    "feminized-seeds",
    "autoflowering-seeds",
    "autoflower-seeds",
    "cannabis-seeds",
    "medicinal-seeds",
    "regular-seeds",
    "cbd-seeds",
    "420-sale",
    "best-sellers",
    "featured-products",
    "staff-picks",
    "free-cannabis-seeds",
    "seedsupreme-bank",
    "seed-supreme-bank-autos",
    "seedsupreme-bank-feminized",
    "outdoor-marijuana-seeds",
    "marijuana-seeds-for-sale",
    "420-gift-box",
    "4th-of-july-sale",
    "seedfinder",
}

BANKS: dict[str, dict[str, Any]] = {
    "herbies": {
        "source_url": "https://herbiesheadshop.com/",
        "list_pages": [
            "https://herbiesheadshop.com/us/feminized-cannabis-seeds",
            "https://herbiesheadshop.com/us/autoflower-cannabis-seeds",
            "https://herbiesheadshop.com/",
        ],
        "sitemap_index": "https://herbiesheadshop.com/sitemap.xml",
        # EN locale only — other locales duplicate the same catalog.
        "sitemap_urls": ["https://herbiesheadshop.com/sitemaps/en.xml"],
        "product_re": re.compile(
            r"^https://herbiesheadshop\.com/(?:[a-z]{2}/)?cannabis-seeds/[a-z0-9\-]+/?$",
            re.I,
        ),
    },
    "rqs": {
        "source_url": "https://www.royalqueenseeds.com/",
        "list_pages": [
            "https://www.royalqueenseeds.com/33-feminized-cannabis-seeds",
            "https://www.royalqueenseeds.com/34-autoflowering-cannabis-seeds",
            "https://www.royalqueenseeds.com/36-cbd-seeds",
        ],
        "sitemap_index": "https://www.royalqueenseeds.com/sitemap.xml",
        "sitemap_urls": ["https://www.royalqueenseeds.com/sitemapCOM.xml"],
        "product_re": re.compile(
            r"^https://www\.royalqueenseeds\.com/"
            r"(?:feminized-cannabis-seeds|autoflowering-cannabis-seeds|"
            r"cbd-seeds|cbd-cannabis-seeds|f1-hybrid-cannabis-seeds|"
            r"rqs-tyson-cannabis-seeds|cannabis-seeds-mix-packs)/"
            r"\d+-[a-z0-9\-]+\.html$",
            re.I,
        ),
    },
    "seedsman": {
        "list_pages": [
            "https://www.seedsman.com/us/feminized-seeds",
            "https://www.seedsman.com/us/autoflowering-seeds",
            "https://www.seedsman.com/us/cannabis-seeds",
        ],
        "product_re": re.compile(
            r"https://www\.seedsman\.com/(?:[a-z]{2}/)?[a-z0-9\-]+\.html",
            re.I,
        ),
    },
    "ilgm": {
        "source_url": "https://ilgm.com/",
        "list_pages": [
            "https://ilgm.com/collections/feminized-seeds",
            "https://ilgm.com/collections/autoflower-seeds",
        ],
        "sitemap_urls": ["https://ilgm.com/sitemap.xml"],
        "product_re": re.compile(r"^https://ilgm\.com/products/[a-z0-9\-]+/?$", re.I),
        # Shopify catalog mixes gummies / merch — keep seed + mix packs.
        "product_keep_re": re.compile(
            r"(?:seed|mix.?pack|mixpack|snack.?mix|classics.?mix|arcade.?mix)",
            re.I,
        ),
        "product_skip_re": re.compile(
            r"(?:gumm|delta-?\d|ashtray|gift.?box|merchandise|apparel|hat|shirt)",
            re.I,
        ),
    },
    "seedfinder": {
        "list_pages": [
            "https://en.seedfinder.eu/database/strains/alphabetical/a/",
            "https://en.seedfinder.eu/database/strains/alphabetical/b/",
            "https://en.seedfinder.eu/database/strains/alphabetical/c/",
            "https://en.seedfinder.eu/database/strains/alphabetical/d/",
            "https://en.seedfinder.eu/database/strains/alphabetical/g/",
            "https://en.seedfinder.eu/database/strains/alphabetical/n/",
            "https://en.seedfinder.eu/database/strains/alphabetical/o/",
            "https://en.seedfinder.eu/database/strains/alphabetical/s/",
            "https://en.seedfinder.eu/database/strains/alphabetical/w/",
        ],
        "product_re": re.compile(
            r"https://(?:en\.)?seedfinder\.eu/(?:en/)?strain-info/[A-Za-z0-9_\-%\.]+/[A-Za-z0-9_\-%\.]+/?",
            re.I,
        ),
    },
    "cropking": {
        # List pages weak; prefer scripts/scrape_cropking_dcseed.py (product-sitemap*.xml).
        "list_pages": [
            "https://www.cropkingseeds.com/feminized-seeds/",
            "https://www.cropkingseeds.com/autoflowering-seeds/",
            "https://www.cropkingseeds.com/regular-marijuana-seeds/",
            "https://www.cropkingseeds.com/new-strains/",
        ],
        "product_re": re.compile(
            r"https://www\.cropkingseeds\.com/"
            r"(?:autoflowering-seeds|feminized-seeds|regular-marijuana-seeds|"
            r"fast-version-seeds|high-cbd|new-strains|cup-winner-strains)/"
            r"[a-z0-9\-]+/?",
            re.I,
        ),
    },
    "seedsupreme": {
        "source_url": "https://seedsupreme.com/",
        "list_pages": [
            "https://seedsupreme.com/feminized-seeds.html",
            "https://seedsupreme.com/autoflowering-seeds.html",
            "https://seedsupreme.com/cannabis-seeds/outdoor-marijuana-seeds.html",
        ],
        "sitemap_urls": ["https://seedsupreme.com/media/sitemap/sitemap.xml"],
        "product_re": re.compile(
            r"^https://seedsupreme\.com/[a-z0-9\-]+\.html$",
            re.I,
        ),
        "product_skip_hubs": _SS_HUBS,
    },
    "zamnesia": {
        "source_url": "https://www.zamnesia.com/",
        "list_pages": [
            "https://www.zamnesia.com/35-cannabis-seeds",
            "https://www.zamnesia.com/35-cannabis-seeds/295-feminized-cannabis-seeds",
            "https://www.zamnesia.com/35-cannabis-seeds/294-autoflowering-cannabis-seeds",
        ],
        "sitemap_index": "https://www.zamnesia.com/sitemap.xml",
        "sitemap_urls": ["https://www.zamnesia.com/sitemapCOM.xml"],
        "product_re": re.compile(
            r"^https://www\.zamnesia\.com/\d+-[a-z0-9\-]+\.html$",
            re.I,
        ),
        # PrestaShop mix of seeds + gear; keep seed-ish PDPs only.
        "product_keep_re": re.compile(
            r"(?:seeds?|feminiz|autoflower|automatic|regular|photoperiod)",
            re.I,
        ),
        "product_skip_re": re.compile(
            r"(?:vapou?r|grinder|bong|pipe|paper|truffle|mushroom|spore|"
            r"fertiliz|nutrient|tent|lamp|led|filter|extractor|growbox)",
            re.I,
        ),
    },
    "alchimia": {
        "list_pages": [
            "https://www.alchimiaweb.com/en/feminized-cannabis-seeds-tag-2/",
            "https://www.alchimiaweb.com/en/automatic-seeds-tag-1/",
        ],
        "product_re": re.compile(
            r"https://www\.alchimiaweb\.com/en/[a-z0-9\-]+-\d+\.html",
            re.I,
        ),
    },
    "attitude": {
        "list_pages": [
            "https://www.attitudeseedbank.com/feminized-cannabis-seeds",
            "https://www.attitudeseedbank.com/autoflowering-cannabis-seeds",
        ],
        "product_re": re.compile(
            r"https://www\.attitudeseedbank\.com/[a-z0-9\-]+",
            re.I,
        ),
    },
    "northatlantic": {
        "list_pages": [
            "https://northatlanticseed.com/collections/all",
            "https://northatlanticseed.com/collections/feminized",
        ],
        "product_re": re.compile(
            r"https://northatlanticseed\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "multiverse": {
        # WooCommerce — use scripts/scrape_wc_seed_banks.py (product-sitemap*).
        "list_pages": [
            "https://multiversebeans.com/shop/",
            "https://multiversebeans.com/product-sitemap1.xml",
        ],
        "product_re": re.compile(
            r"https://(?:www\.)?multiversebeans\.com/product/[a-z0-9\-]+",
            re.I,
        ),
    },
    "greenhouse": {
        "list_pages": [
            "https://www.greenhouseseeds.nl/feminised-seeds",
            "https://www.greenhouseseeds.nl/seeds",
        ],
        "product_re": re.compile(
            r"https://www\.greenhouseseeds\.nl/[a-z0-9\-]+",
            re.I,
        ),
    },
    "seedcity_bank": {
        "list_pages": [
            "https://www.seed-city.com/",
            "https://www.seed-city.com/feminised-cannabis-seeds",
        ],
        "product_re": re.compile(
            r"https://www\.seed-city\.com/[a-z0-9\-]+",
            re.I,
        ),
    },
    "beaver": {
        "list_pages": [
            "https://www.beaverseeds.com/collections/all",
            "https://www.beaverseeds.com/collections/feminized-seeds",
        ],
        "product_re": re.compile(
            r"https://(?:www\.)?beaverseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "dcseed": {
        # WooCommerce (NOT Shopify). Prefer scripts/scrape_cropking_dcseed.py (sitemap-first).
        "list_pages": [
            "https://dcseedexchange.com/shop/",
            "https://dcseedexchange.com/product-category/feminized-seeds/",
        ],
        "product_re": re.compile(
            r"https://dcseedexchange\.com/product/[a-z0-9\-]+/?",
            re.I,
        ),
    },
    "greatlakes": {
        "list_pages": [
            "https://greatlakesgenetics.com/collections/all",
            "https://greatlakesgenetics.com/collections/seeds",
        ],
        "product_re": re.compile(
            r"https://greatlakesgenetics\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "growerschoice": {
        "list_pages": [
            "https://growerschoiceseeds.com/collections/all",
            "https://growerschoiceseeds.com/collections/feminized-seeds",
        ],
        "product_re": re.compile(
            r"https://growerschoiceseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "neptune": {
        "list_pages": [
            "https://neptuneseedbank.com/collections/all",
            "https://neptuneseedbank.com/collections/feminized",
        ],
        "product_re": re.compile(
            r"https://neptuneseedbank\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "oregonelite": {
        "list_pages": [
            "https://oregoneliteseeds.com/collections/all",
            "https://oregoneliteseeds.com/collections/feminized",
        ],
        "product_re": re.compile(
            r"https://oregoneliteseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "organicearth": {
        "list_pages": [
            "https://organicearthseeds.com/collections/all",
        ],
        "product_re": re.compile(
            r"https://organicearthseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "pacific": {
        "list_pages": [
            "https://pacificseedbank.com/collections/all",
            "https://pacificseedbank.com/collections/feminized-seeds",
        ],
        "product_re": re.compile(
            r"https://pacificseedbank\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "quebec": {
        "list_pages": [
            "https://quebeccannabisseeds.com/collections/all",
            "https://quebeccannabisseeds.com/collections/feminized",
        ],
        "product_re": re.compile(
            r"https://quebeccannabisseeds\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "truenorth": {
        "list_pages": [
            "https://truenorthseedbank.com/collections/all",
            "https://truenorthseedbank.com/collections/feminized-seeds",
        ],
        "product_re": re.compile(
            r"https://truenorthseedbank\.com/products/[a-z0-9\-]+",
            re.I,
        ),
    },
    "weedseedsexpress": {
        # WooCommerce — use scripts/scrape_wc_seed_banks.py (sitemap-en.xml).
        "list_pages": [
            "https://weedseedsexpress.com/sitemap-en.xml",
            "https://weedseedsexpress.com/",
        ],
        "product_re": re.compile(
            r"https://(?:www\.)?weedseedsexpress\.com/product/[a-z0-9\-]+",
            re.I,
        ),
    },
}


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
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
    out = []
    for m in re.finditer(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.I | re.S,
    ):
        try:
            doc = json.loads(m.group(1))
            if isinstance(doc, list):
                out.extend(d for d in doc if isinstance(d, dict))
            elif isinstance(doc, dict):
                out.append(doc)
        except json.JSONDecodeError:
            continue
    return out


def product_name_from_page(html: str, url: str) -> str:
    for block in extract_json_ld(html):
        if block.get("@type") in ("Product", ["Product"]) or "Product" in str(block.get("@type")):
            name = block.get("name")
            if name:
                return str(name).strip()
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    if m:
        return clean(m.group(1))[:120]
    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    return slug.replace("-", " ").replace("_", " ").strip()


def normalize_url(url: str) -> str:
    return (url or "").strip().split("#")[0].split("?")[0].rstrip("/") or url


def sitemap_locs(body: str) -> list[str]:
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body or "", re.I)


def accept_product_url(url: str, cfg: dict) -> bool:
    u = normalize_url(url)
    cre = cfg.get("product_re")
    if not cre:
        return False
    if not (cre.match(u) or cre.match(u + "/")):
        return False
    skip = cfg.get("product_skip_re")
    if skip and skip.search(u):
        return False
    keep = cfg.get("product_keep_re")
    if keep and not keep.search(u):
        return False
    hubs = cfg.get("product_skip_hubs")
    if hubs:
        slug = u.rsplit("/", 1)[-1].lower().removesuffix(".html")
        if slug in hubs:
            return False
    return True


def load_product_urls(bank: str, cfg: dict, *, delay: float, refresh: bool) -> list[str]:
    """Sitemap-first when configured; else list-page discovery."""
    cache = DATA / f"dsc_strains_{bank}.sitemap_urls.json"
    has_sitemap = bool(cfg.get("sitemap_urls") or cfg.get("sitemap_index"))
    if has_sitemap and cache.exists() and not refresh:
        try:
            doc = json.loads(cache.read_text(encoding="utf-8"))
            urls = [normalize_url(u) for u in (doc.get("urls") or [])]
            if urls:
                print(f"{bank}: sitemap cache {len(urls)} from {cache.name}", flush=True)
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    if has_sitemap:
        sm_urls: list[str] = list(cfg.get("sitemap_urls") or [])
        if cfg.get("sitemap_index") and not sm_urls:
            print(f"{bank}: fetching sitemap index {cfg['sitemap_index']}", flush=True)
            idx_body = polite_get(cfg["sitemap_index"], delay=delay, timeout=90)
            for loc in sitemap_locs(idx_body):
                if "sitemap" in loc.lower():
                    sm_urls.append(loc)
            sm_urls = sorted(set(sm_urls))
        urls_set: set[str] = set()
        for sm in sm_urls:
            print(f"{bank}: fetching sitemap {sm}", flush=True)
            try:
                body = polite_get(sm, delay=delay, timeout=180)
            except Exception as exc:  # noqa: BLE001
                print(f"  sitemap fail {sm}: {exc}", flush=True)
                continue
            child_locs = sitemap_locs(body)
            # Nested index? follow children that look like sitemaps.
            if child_locs and all("sitemap" in u.lower() for u in child_locs[: min(5, len(child_locs))]):
                for child in child_locs:
                    if cfg.get("sitemap_urls") and child not in cfg["sitemap_urls"]:
                        # Prefer explicitly configured children when set.
                        continue
                    try:
                        cbody = polite_get(child, delay=delay, timeout=180)
                    except Exception as exc:  # noqa: BLE001
                        print(f"  child sitemap fail {child}: {exc}", flush=True)
                        continue
                    for loc in sitemap_locs(cbody):
                        if accept_product_url(loc, cfg):
                            urls_set.add(normalize_url(loc))
                continue
            for loc in child_locs:
                if accept_product_url(loc, cfg):
                    urls_set.add(normalize_url(loc))
        urls = sorted(urls_set)
        cache.write_text(
            json.dumps(
                {
                    "bank": bank,
                    "count": len(urls),
                    "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "sitemaps": sm_urls,
                    "urls": urls,
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"{bank}: sitemap total {len(urls)} (cached {cache.name})", flush=True)
        return urls

    # List-page fallback (non-priority / legacy banks).
    return discover_links_list(bank, cfg, delay=delay, limit=cfg.get("_list_limit") or 500)


def discover_links_list(bank: str, cfg: dict, *, delay: float, limit: int) -> list[str]:
    links: set[str] = set()
    cre = cfg.get("product_re")
    for page in cfg.get("list_pages") or []:
        try:
            html = polite_get(page, delay=delay)
            for m in cre.finditer(html):
                u = normalize_url(m.group(0))
                if accept_product_url(u, cfg):
                    links.add(u)
            for m in re.finditer(r'href=["\']([^"\']+)["\']', html, re.I):
                abs_u = normalize_url(urljoin(page, m.group(1)))
                if accept_product_url(abs_u, cfg):
                    links.add(abs_u)
            if len(links) >= limit * 3:
                break
        except Exception as exc:  # noqa: BLE001
            print(f"  list fail {page}: {exc}", flush=True)
    return sorted(links)[: max(limit * 5, limit)]


def stage_dump(bank: str, *, reset: bool = True) -> dict:
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


def scrape_bank(
    bank: str,
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool = False,
    checkpoint_every: int = 25,
    stage_every: int = 400,
    no_stage: bool = False,
) -> Path:
    cfg = BANKS[bank]
    out = DATA / f"dsc_strains_{bank}.json"
    ck = Checkpoint(DATA / f"dsc_strains_{bank}.checkpoint.json")
    cfg = {**cfg, "_list_limit": limit or 500}
    links = load_product_urls(bank, cfg, delay=delay, refresh=refresh_sitemap)
    if limit is not None:
        links = links[: max(0, limit)]
    print(f"{bank}: queued {len(links)} product URLs", flush=True)

    items: list[dict] = []
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except Exception:
            items = []
    by_url = {normalize_url(str(i.get("url"))): i for i in items if i.get("url")}
    done = set(ck.data.get("done") or []) | set(by_url.keys())
    blockers: list[str] = []
    consecutive_walls = 0
    scraped_this_run = 0
    last_staged_at = 0
    t0 = time.time()

    for idx, url in enumerate(links, 1):
        url = normalize_url(url)
        if url in by_url:
            done.add(url)
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
                    print(f"{bank}: aborting — repeated bot walls", flush=True)
                    break
                continue
            consecutive_walls = 0
            name = product_name_from_page(html, url)
            text = clean(html)
            props = parse_grow_fields(text)
            breeder = None
            for block in extract_json_ld(html):
                brand = block.get("brand")
                if isinstance(brand, dict):
                    brand = brand.get("name")
                if brand:
                    breeder = str(brand)
            m = re.search(r"(?i)breeder[:\s]+([A-Za-z0-9][A-Za-z0-9 &\-\.]{1,40})", text)
            if m and not breeder:
                breeder = m.group(1).strip()
            description = None
            for block in extract_json_ld(html):
                for key in ("description", "abstract"):
                    v = block.get(key)
                    if isinstance(v, str) and len(v.strip()) > 40:
                        description = clean(v)[:8000]
                        break
                if description:
                    break
            if not description:
                for pat in (
                    r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']',
                    r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
                    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:description["\']',
                    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']',
                ):
                    mm = re.search(pat, html, re.I)
                    if mm and len(mm.group(1).strip()) > 40:
                        description = clean(mm.group(1))[:8000]
                        break
            row = {
                "name": name,
                "name_norm": name_norm(name),
                "breeder": breeder or bank.title(),
                "url": url,
                "source": bank,
                "bank_props": props,
                **props,
                "page_text_excerpt": text[:1500],
            }
            if description:
                row["description"] = description
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            if "HTTP 404" in str(exc) or "HTTP 410" in str(exc):
                done.add(url)  # do not retry dead PDPs
                if scraped_this_run % 50 == 0:
                    print(f"  skip 404 {url}", flush=True)
            else:
                blockers.append(msg)
                ck.note_error(msg)
                print(f"  fail {msg}", flush=True)
            if idx % checkpoint_every == 0:
                ck.data["done"] = sorted(done)
                ck.data["cursor"] = url
                ck.save()
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(links):
            items = list(by_url.values())
            ck.data["done"] = sorted(done)
            ck.data["cursor"] = url
            ck.save()
            try:
                write_dump(
                    out,
                    "strains",
                    items,
                    source=bank,
                    source_url=cfg.get("source_url"),
                    license=UA_NOTE,
                    redistributable=False,
                    note=f"partial checkpoint {len(items)}/{len(links)}",
                    blockers=blockers[-40:],
                )
            except OSError as exc:
                print(f"  dump write warn: {exc}", flush=True)
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  {bank} checkpoint items={len(items)} this_run={scraped_this_run} "
                f"rate={rate:.2f}/s idx={idx}/{len(links)}",
                flush=True,
            )
            if (
                not no_stage
                and stage_every > 0
                and (len(items) - last_staged_at) >= stage_every
            ):
                try:
                    stage_dump(bank, reset=True)
                    last_staged_at = len(items)
                except Exception as exc:  # noqa: BLE001
                    print(f"  staging warn: {exc}", flush=True)

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    ck.data["done"] = sorted(done)
    ck.save()
    write_dump(
        out,
        "strains",
        items,
        source=bank,
        source_url=cfg.get("source_url"),
        license=UA_NOTE,
        redistributable=False,
        note="sitemap/list research scrape complete",
        sitemap_count=len(links),
        blockers=blockers[-40:],
    )
    print(f"wrote {out.name} count={len(items)}", flush=True)
    if not no_stage:
        try:
            stage_dump(bank, reset=True)
        except Exception as exc:  # noqa: BLE001
            print(f"{bank} staging failed: {exc}", flush=True)
    return out


def discover_more_banks() -> Path:
    """Write a discovery list of additional bank domains for future waves."""
    candidates = [
        {"name": "Crop King Seeds", "url": "https://www.cropkingseeds.com/", "region": "CA"},
        {"name": "Seed Supreme", "url": "https://seedsupreme.com/", "region": "US"},
        {"name": "MSNL", "url": "https://www.msnlsseeds.com/", "region": "UK"},
        {"name": "Fast Buds", "url": "https://fastbuds.com/", "region": "ES"},
        {"name": "Barney's Farm", "url": "https://www.barneysfarm.com/", "region": "NL"},
        {"name": "Dutch Passion", "url": "https://dutch-passion.com/", "region": "NL"},
        {"name": "Greenhouse Seeds", "url": "https://www.greenhouseseeds.nl/", "region": "NL"},
        {"name": "DNA Genetics", "url": "https://dnagenetics.com/", "region": "NL"},
        {"name": "Mephisto Genetics", "url": "https://mephistogenetics.com/", "region": "ES"},
        {"name": "Night Owl Seeds", "url": "https://nightowleseeds.com/", "region": "US"},
        {"name": "Australian Seed Banks portal", "url": "https://www.theseedbank.com.au/", "region": "AU"},
        {"name": "Dr Chronic", "url": "https://www.drchronic.com/", "region": "AU"},
        {"name": "Alchimia Grow Shop", "url": "https://www.alchimiaweb.com/", "region": "ES"},
        {"name": "Attitude Seedbank", "url": "https://www.attitudeseedbank.com/", "region": "UK"},
        {"name": "Beaver Seeds", "url": "https://www.beaverseeds.com/", "region": "CA"},
        {"name": "DC Seed Exchange", "url": "https://dcseedexchange.com/", "region": "US"},
        {"name": "Great Lakes Genetics", "url": "https://greatlakesgenetics.com/", "region": "US"},
        {"name": "Growers Choice Seeds", "url": "https://growerschoiceseeds.com/", "region": "US"},
        {"name": "Multiverse Beans", "url": "https://www.multiversebeans.com/", "region": "US"},
        {"name": "Neptune Seed Bank", "url": "https://neptuneseedbank.com/", "region": "US"},
        {"name": "North Atlantic Seed Co", "url": "https://northatlanticseed.com/", "region": "US"},
        {"name": "Oregon Elite Seeds", "url": "https://oregoneliteseeds.com/", "region": "US"},
        {"name": "Organic Earth", "url": "https://organicearthseeds.com/", "region": "US"},
        {"name": "Pacific Seed Bank", "url": "https://pacificseedbank.com/", "region": "US"},
        {"name": "Quebec Cannabis Seeds", "url": "https://quebeccannabisseeds.com/", "region": "CA"},
        {"name": "Seed City", "url": "https://www.seed-city.com/", "region": "UK"},
        {"name": "True North Seedbank", "url": "https://truenorthseedbank.com/", "region": "CA"},
        {"name": "Weed Seeds Express", "url": "https://weedseedsexpress.com/", "region": "US"},
        {"name": "Zamnesia", "url": "https://www.zamnesia.com/", "region": "NL"},
    ]
    # Merge breeder inventory counts when present
    breeder_path = DATA / "dsc_seed_breeders.json"
    note = "candidates for Wave B+ scrapers; see SEED_BREEDERS.md"
    if breeder_path.exists():
        try:
            inv = json.loads(breeder_path.read_text(encoding="utf-8"))
            note += f"; breeders_inventory={inv.get('counts', {}).get('breeders')}"
        except Exception:
            pass
    out = DATA / "dsc_bank_discovery.json"
    write_dump(
        out,
        "bank_discovery",
        candidates,
        source="n087_discovery",
        note=note,
        redistributable=True,
    )
    print(f"wrote discovery {out} count={len(candidates)}")
    return out


PRIORITY_BANKS = ("herbies", "ilgm", "rqs", "zamnesia", "seedsupreme")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bank", choices=list(BANKS) + ["all", "priority", "discover"], default="priority")
    ap.add_argument(
        "--limit",
        type=int,
        default=None,
        help="max products per bank (default: full sitemap/list)",
    )
    ap.add_argument("--delay", type=float, default=0.65)
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--stage-every", type=int, default=400)
    ap.add_argument("--sitemap-only", action="store_true")
    ap.add_argument("--stage-only", action="store_true")
    ap.add_argument("--no-stage", action="store_true")
    ap.add_argument("--no-discover", action="store_true", help="skip writing bank discovery dump")
    args = ap.parse_args()
    DATA.mkdir(parents=True, exist_ok=True)
    if args.bank == "discover":
        discover_more_banks()
        return 0
    if args.bank == "priority":
        banks = list(PRIORITY_BANKS)
    elif args.bank == "all":
        banks = list(BANKS)
    else:
        banks = [args.bank]

    if args.stage_only:
        for b in banks:
            stage_dump(b, reset=True)
        return 0

    if args.sitemap_only:
        for b in banks:
            urls = load_product_urls(b, BANKS[b], delay=args.delay, refresh=True)
            print(json.dumps({"bank": b, "count": len(urls), "sample": urls[:5]}, indent=2))
        return 0

    if not args.no_discover:
        discover_more_banks()
    for b in banks:
        try:
            scrape_bank(
                b,
                delay=args.delay,
                limit=args.limit,
                refresh_sitemap=args.refresh_sitemap,
                checkpoint_every=max(5, args.checkpoint_every),
                stage_every=0 if args.no_stage else max(0, args.stage_every),
                no_stage=args.no_stage,
            )
        except Exception as exc:  # noqa: BLE001
            print(f"bank {b} aborted: {exc}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
