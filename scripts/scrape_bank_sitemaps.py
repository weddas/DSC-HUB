#!/usr/bin/env python3
"""Sitemap-first scrapers for priority uncovered seed banks (non-WC or mixed).

Banks:
  - truenorth   True North Seedbank (Magento) — flat /{slug} product URLs
  - ilgm        ILGM (Shopify storefront) — /products/{slug} from sitemap.xml
  - seedsupreme SeedSupreme (Magento) — media/sitemap + *.html products
  - fastbuds    Fast Buds — /seeds/{slug}
  - barneys     Barney's Farm — /{slug}-{id}
  - greenhouse  Green House Seed Co shop — CS-Cart leaf PDPs
  - mephisto    Mephisto Genetics (Shopify) — /products/{slug}
  - dna         DNA Genetics (Woo) — /product/{slug}
  - dutchpassion Dutch Passion (PrestaShop) — /en/... product paths (CDATA sitemap)

Checkpoint/resume; dumps → homeassistant/data/dsc_strains_{bank}.json
Staging → brain/data/staging/bank_*.sqlite3 with FULL raw_record.
redistributable=false until legal review.

Skip Multiverse / WSE / Alchimia / Hytiva / CannaConnection / Seedsman (other runners).
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

LICENSE = "research archival scrape; redistributable=false until legal review"

TN_SKIP_SLUGS = {
    "cannabis-seeds",
    "bulk-seeds",
    "bulk-seeds-guru",
    "accessories",
    "about-us",
    "contact",
    "blog",
    "customer",
    "checkout",
    "cart",
    "search",
    "privacy-policy",
    "terms",
    "shipping",
    "faq",
}

BANKS: dict[str, dict[str, Any]] = {
    "truenorth": {
        "source_id": "truenorth",
        "source_url": "https://www.truenorthseedbank.com/",
        "sitemap_urls": ["https://www.truenorthseedbank.com/sitemap.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?truenorthseedbank\.com/([a-z0-9][a-z0-9\-]{2,})/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*True North Seed\s*Bank.*$",
            re.I,
        ),
    },
    "ilgm": {
        "source_id": "ilgm",
        "source_url": "https://ilgm.com/",
        "sitemap_urls": ["https://ilgm.com/sitemap.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?ilgm\.com/products/([a-z0-9\-]+)/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*(?:ILGM|I Love Growing Marijuana).*$",
            re.I,
        ),
        # Drop edibles / hardware noise from shared Shopify catalog.
        "slug_skip_re": re.compile(
            r"(?:gumm|delta|thc-gumm|vape|cart|tincture|edible|apparel|shirt|hat|hoodie|merch)",
            re.I,
        ),
        "slug_keep_re": re.compile(
            r"(?:seed|autoflower|feminized|regular|photoperiod|kush|haze|widow|og\b)",
            re.I,
        ),
    },
    "seedsupreme": {
        "source_id": "seedsupreme",
        "source_url": "https://seedsupreme.com/",
        "sitemap_urls": ["https://seedsupreme.com/media/sitemap/sitemap.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?seedsupreme\.com/([a-z0-9\-]+)\.html$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*Seed\s*Supreme.*$",
            re.I,
        ),
        "slug_skip_re": re.compile(
            r"(?:gift-card|gift-box|shipping|contact|about|blog|login|account|cart|checkout|"
            r"seedfinder|marijuana-seeds-for-sale|cannabis-seeds$|"
            r"outdoor-marijuana|autoflowering-seeds$|feminized-seeds$|"
            r"(?:^|-)sale(?:-|$)|promo|bundle-deal)",
            re.I,
        ),
    },
    "fastbuds": {
        "source_id": "fastbuds",
        "source_url": "https://fastbuds.com/",
        "sitemap_urls": ["https://fastbuds.com/sitemap.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?fastbuds\.com/seeds/([a-z0-9\-]+)/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*(?:Fast\s*Buds|42 Fast Buds).*$",
            re.I,
        ),
        "default_breeder": "Fast Buds",
    },
    "barneys": {
        "source_id": "barneys",
        "source_url": "https://www.barneysfarm.com/",
        "sitemap_urls": [
            "https://www.barneysfarm.com/sitemap-com.xml",
            "https://www.barneysfarm.com/us/sitemap-usa.xml",
        ],
        # Product PDPs end with -{numeric id}; categories do not.
        "product_re": re.compile(
            r"^https?://(?:www\.)?barneysfarm\.com/(?:us/)?([a-z0-9\-]+-\d+)/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*Barney'?s?\s*Farm.*$",
            re.I,
        ),
        "default_breeder": "Barney's Farm",
    },
    "greenhouse": {
        "source_id": "greenhouse",
        "source_url": "https://shop.greenhouseseeds.nl/",
        "sitemap_urls": ["https://shop.greenhouseseeds.nl/sitemap.xml"],
        # Leaf PDPs under seed category roots (any depth of filter folders).
        "product_re": re.compile(
            r"^https?://shop\.greenhouseseeds\.nl/"
            r"(?:medicinal-seeds|feminised-cannabis-seeds|autoflowering-seeds|"
            r"regular-cannabis-seeds)/(?:[a-z0-9.\-]+/)*"
            r"([a-z0-9][a-z0-9\-]{2,})/?$",
            re.I,
        ),
        "slug_skip_re": re.compile(
            r"^(?:indoor|outdoor|tropical-and-mediterranean|moderate-and-continental|"
            r"hybrid-cannabis-seeds|mostly-sativa-seeds|mostly-indica-seeds|"
            r"white-family-seeds|arjans-haze-seeds|cbd-auto-flowering-seeds|"
            r"moderate-thc-seeds|high-thc-seeds|low-thc-seeds|medicinal-cbd-seeds|"
            r"climate-zones|families|types-of-seeds|cbd-seeds|usa-genetics|"
            r"usa-and-landrace-limited-edition|high-yield-seeds|1-seed-pack|"
            r"bundles|kush-strains|cold-and-northern|disclamer|disclaimer|"
            r"ghm-botanicals|payment-and-shipping|strains-list|"
            r"research-and-development|about-franco-loja|about-our-company|"
            r"cannabis-cup-awards|about-arjan-roskam|page-\d+)$",
            re.I,
        ),
        # Extra category pages to crawl (sitemap misses climate-zone leaf PDPs).
        "category_crawl_urls": [
            "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/",
            "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/1-seed-pack/",
            "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/climate-zones/indoor/",
            "https://shop.greenhouseseeds.nl/feminised-cannabis-seeds/climate-zones/outdoor/",
            "https://shop.greenhouseseeds.nl/medicinal-seeds/",
            "https://shop.greenhouseseeds.nl/medicinal-seeds/high-thc-seeds/",
            "https://shop.greenhouseseeds.nl/medicinal-seeds/moderate-thc-seeds/",
            "https://shop.greenhouseseeds.nl/bestsellers/",
            "https://shop.greenhouseseeds.nl/usa/",
        ],
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*(?:Green\s*House(?:\s*Seed(?:s|\s*Co(?:mpany)?)?)?).*$",
            re.I,
        ),
        "default_breeder": "Green House Seed Co",
    },
    "mephisto": {
        "source_id": "mephisto",
        "source_url": "https://mephistogenetics.com/",
        "sitemap_index": "https://mephistogenetics.com/sitemap.xml",
        "sitemap_urls": None,  # filled from index product sitemaps
        "product_re": re.compile(
            r"^https?://(?:www\.)?mephistogenetics\.com/products/([a-z0-9\-]+)/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*Mephisto(?:\s*Genetics)?.*$",
            re.I,
        ),
        "default_breeder": "Mephisto Genetics",
        "slug_skip_re": re.compile(
            r"(?:gift|merch|shirt|hoodie|hat|sticker|poster|tee|apparel|packaging|"
            r"grove-bags|bags?$|t-shirt|beanie|grinder|tray)",
            re.I,
        ),
    },
    "dna": {
        "source_id": "dna",
        "source_url": "https://dnagenetics.com/",
        "sitemap_urls": ["https://dnagenetics.com/product-sitemap.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?dnagenetics\.com/product/([a-z0-9\-]+)/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*DNA\s*Genetics.*$",
            re.I,
        ),
        "default_breeder": "DNA Genetics",
        "slug_skip_re": re.compile(
            r"(?:lighter|gift|merch|shirt|hoodie|membership|vault|packaging|hat|tee)",
            re.I,
        ),
    },
    "dutchpassion": {
        "source_id": "dutchpassion",
        "source_url": "https://dutch-passion.com/",
        "sitemap_urls": ["https://dutch-passion.com/1_en_0_sitemap.xml"],
        "product_re": re.compile(
            r"^https?://(?:www\.)?dutch-passion\.com/en/"
            r"(?:cannabis-seeds|discontinued-cannabis-strains)/"
            r"([a-z0-9\-]+)/?$",
            re.I,
        ),
        "site_suffix_re": re.compile(
            r"\s*[|–-]\s*Dutch\s*Passion.*$",
            re.I,
        ),
        "default_breeder": "Dutch Passion",
        "slug_skip_re": re.compile(
            r"(?:package-deal|trial-pack|mix|nutrient|biotabs|shirt|grinder|ashtray|"
            r"rolling|skateboard|beanie|bong)$",
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
    """Extract <loc> URLs; supports plain text and CDATA (PrestaShop)."""
    out: list[str] = []
    for m in re.finditer(r"<loc>\s*(?:<!\[CDATA\[(.*?)\]\]>|([^<\s]+))\s*</loc>", body or "", re.I | re.S):
        u = (m.group(1) or m.group(2) or "").strip()
        if u:
            out.append(html_lib.unescape(u))
    return out


def normalize_url(url: str) -> str:
    u = (url or "").strip().split("#")[0].split("?")[0]
    # Keep trailing slash off for stable checkpoint keys.
    if u.endswith("/") and len(urlparse(u).path) > 1:
        u = u.rstrip("/")
    return u


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


def accept_url(bank: str, cfg: dict, url: str) -> bool:
    u = normalize_url(url)
    m = cfg["product_re"].match(u)
    if not m:
        return False
    slug = m.group(1).lower()
    if bank == "truenorth":
        if slug in TN_SKIP_SLUGS:
            return False
        # Prefer product-like slugs; drop bare brand category pages.
        if not re.search(r"(seed|auto|fem|regular|kush|haze|widow|og)", slug):
            return False
        # Brand-only pages tend to be short: "barney-s-farm", "canuk-seeds"
        if slug.endswith("-seeds") and slug.count("-") <= 2 and "feminized" not in slug and "auto" not in slug:
            return False
        return True
    skip_re = cfg.get("slug_skip_re")
    keep_re = cfg.get("slug_keep_re")
    if skip_re and skip_re.search(slug):
        return False
    if keep_re and not keep_re.search(slug):
        return False
    return True


def resolve_sitemap_urls(cfg: dict, *, delay: float) -> list[str]:
    """Return leaf sitemap URLs (expand sitemap_index product children when set)."""
    explicit = list(cfg.get("sitemap_urls") or [])
    index = cfg.get("sitemap_index")
    if not index:
        return explicit
    try:
        body = polite_get(index, delay=delay, timeout=90)
    except Exception as exc:  # noqa: BLE001
        print(f"  sitemap_index fail {index}: {exc}", flush=True)
        return explicit
    children = sitemap_locs(body)
    productish = [
        html_lib.unescape(u).replace("&amp;", "&")
        for u in children
        if re.search(r"product", u, re.I)
    ]
    if productish:
        print(f"  sitemap_index {index} -> {len(productish)} product sitemaps", flush=True)
        return productish
    return explicit or children


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

    found: set[str] = set()
    sitemaps = resolve_sitemap_urls(cfg, delay=delay)
    for sm in sitemaps:
        try:
            body = polite_get(sm, delay=delay, timeout=120)
        except Exception as exc:  # noqa: BLE001
            print(f"  sitemap fail {sm}: {exc}", flush=True)
            continue
        n = 0
        for loc in sitemap_locs(body):
            u = normalize_url(loc)
            if accept_url(bank, cfg, u):
                found.add(u)
                n += 1
        print(f"  {sm} -> accepted {n}", flush=True)

    # Category crawl (Greenhouse CS-Cart: climate-zone leaf PDPs absent from sitemap).
    cat_urls = list(cfg.get("category_crawl_urls") or [])
    if cat_urls:
        href_re = re.compile(r"""href=["']([^"'#?]+)["']""", re.I)
        before = len(found)
        for cat in cat_urls:
            try:
                html = polite_get(cat, delay=delay, timeout=90)
            except Exception as exc:  # noqa: BLE001
                print(f"  category fail {cat}: {exc}", flush=True)
                continue
            if is_bot_wall(html):
                print(f"  category BOT_WALL {cat}", flush=True)
                continue
            n = 0
            for href in href_re.findall(html or ""):
                full = normalize_url(urljoin(cat, href))
                if accept_url(bank, cfg, full):
                    if full not in found:
                        n += 1
                    found.add(full)
            print(f"  category {cat} -> +{n} (total {len(found)})", flush=True)
        print(f"{bank}: category crawl added {len(found) - before}", flush=True)

    urls = sorted(found)
    cache.write_text(
        json.dumps(
            {
                "bank": bank,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "sitemaps": sitemaps,
                "category_crawl_urls": cat_urls,
                "count": len(urls),
                "urls": urls,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"{bank}: sitemap total {len(urls)} (cached {cache.name})", flush=True)
    return urls


def parse_breeder_from_name(name: str, bank: str) -> tuple[str, str | None]:
    """Split 'Strain Feminized Seeds (Breeder)' / 'Strain - Breeder'."""
    breeder = None
    display = name
    m = re.search(r"\(([^)]+)\)\s*$", name)
    if m:
        cand = m.group(1).strip()
        if cand and bank.lower() not in cand.lower() and len(cand) < 80:
            breeder = cand
            display = name[: m.start()].strip()
    else:
        parts = [p.strip() for p in re.split(r"\s+[-–]\s+", name) if p.strip()]
        if len(parts) >= 2 and "seed" not in parts[-1].lower():
            breeder = parts[-1]
            display = " - ".join(parts[:-1])
    display = re.sub(
        r"\s*(?:Feminized|Autoflower(?:ing)?|Regular|Auto|Fast Version)?\s*Seeds?\s*$",
        "",
        display,
        flags=re.I,
    ).strip() or display
    display = re.sub(
        r"\s*(?:Feminized|Autoflower(?:ing)?|Regular|Auto)\s*$",
        "",
        display,
        flags=re.I,
    ).strip() or display
    return display, breeder


def parse_truenorth_slug(slug: str) -> dict[str, Any]:
    """acapulco-gold-feminized-seeds-barney-s-farm → strain + breeder."""
    s = (slug or "").lower().strip()
    out: dict[str, Any] = {}
    m = re.match(
        r"^(.+?)-(?:autoflowering-)?(?:feminized|regular|auto)-seeds-(.+)$",
        s,
    )
    if not m:
        m = re.match(r"^(.+?)-seeds-(.+)$", s)
    if m:
        strain = m.group(1).replace("-", " ").strip()
        breeder = m.group(2).replace("-", " ").strip()
        # bulk-seeds / canuk-seeds brand tails
        breeder = re.sub(r"\bseeds?\b$", "Seeds", breeder, flags=re.I).strip()
        if strain:
            out["strain_name"] = " ".join(w.capitalize() for w in strain.split())
        if breeder and breeder.lower() not in {"seeds", "seed"}:
            out["breeder_guess"] = " ".join(
                w.upper() if w.lower() in {"og", "thc", "cbd"} else w.capitalize()
                for w in breeder.split()
            )
    if "auto" in s:
        out["seed_type"] = "autoflower"
        out["flowering_behavior"] = "autoflower"
    if "feminized" in s or re.search(r"-fem-", s):
        out["seed_gender"] = "feminized"
    elif "regular" in s:
        out["seed_gender"] = "regular"
    return out


def parse_product(html: str, url: str, *, bank: str, cfg: dict) -> dict[str, Any] | None:
    if is_bot_wall(html):
        raise RuntimeError(f"BOT_WALL {url}")

    blocks = extract_json_ld(html)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), None)

    # Magento category pages often lack Product JSON-LD — skip.
    if product is None and bank in {"truenorth", "seedsupreme"}:
        if not re.search(r"add[\s-]to[\s-]cart|product-info-main|product-add-form", html or "", re.I):
            return None

    product = product or {}
    raw_name = str(product.get("name") or "").strip()
    if not raw_name:
        raw_name = meta_content(html, "og:title") or ""
    if not raw_name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        raw_name = clean(m.group(1)) if m else ""
    if not raw_name:
        raw_name = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ").replace(".html", "")

    suffix_re = cfg.get("site_suffix_re")
    display = suffix_re.sub("", raw_name).strip() if suffix_re else raw_name
    display = re.sub(r"\s*\|\s*.*$", "", display).strip() or display
    name, breeder_guess = parse_breeder_from_name(display, bank)

    slug = urlparse(url).path.rstrip("/").split("/")[-1].replace(".html", "")
    if bank == "truenorth":
        slug_bits = parse_truenorth_slug(slug)
        # Slug is the stable SoT on Magento (titles/JSON-LD often cross-sell polluted).
        if slug_bits.get("strain_name"):
            name = slug_bits["strain_name"]
        if slug_bits.get("breeder_guess"):
            breeder_guess = slug_bits["breeder_guess"]
        display = name
    if bank == "ilgm":
        # Shopify titles are often SEO ("Buy X", "X Seeds For Sale") — prefer slug.
        leaf = slug
        leaf = re.sub(r"-seeds?$", "", leaf, flags=re.I)
        pretty = " ".join(w.upper() if w.lower() in {"og", "ak", "thc", "cbd"} else w.capitalize() for w in leaf.split("-") if w)
        if pretty:
            name = pretty
            display = pretty
        name = re.sub(r"^(?:Buy|Shop)\s+", "", name, flags=re.I).strip() or name
        name = re.sub(r"\s+For Sale\b.*$", "", name, flags=re.I).strip() or name
        breeder_guess = breeder_guess or "ILGM"

    description = html_lib.unescape(str(product.get("description") or "")).strip()
    if not description:
        description = meta_content(html, "og:description") or ""
    # Magento often dumps related-product titles into JSON-LD description — prefer og.
    og = meta_content(html, "og:description") or ""
    if og and description and (
        "elite strain" in description.lower()
        or (breeder_guess and breeder_guess.lower() not in description.lower() and len(description) < 120)
    ):
        description = og
    for cls in (
        "product.attribute.description",
        "product-description",
        "woocommerce-product-details__short-description",
        "product-info-main",
    ):
        m = re.search(
            rf'class=["\'][^"\']*{re.escape(cls)}[^"\']*["\'][^>]*>(.*?)</div>',
            html or "",
            re.I | re.S,
        )
        if m:
            short = clean(m.group(1))
            if short and (not description or len(short) > len(description)):
                description = short
                break
    # Green House CS-Cart: rich grow copy lives in content_description / ty-wysiwyg.
    if bank == "greenhouse":
        for pat in (
            r'id=["\']content_description["\'][^>]*>(.*?)</div>\s*</div>',
            r'id=["\']content_description["\'][^>]*>(.*?)</div>',
            r'class=["\'][^"\']*ty-wysiwyg-content[^"\']*["\'][^>]*>(.*?)</div>',
        ):
            m = re.search(pat, html or "", re.I | re.S)
            if m:
                short = clean(m.group(1))
                if short and len(short) > 80 and (
                    not description or len(short) > len(description) * 0.6
                ):
                    description = short
                    break

    brand = brand_name(product.get("brand"))
    breeder = breeder_guess or brand
    if bank == "ilgm" and brand and re.search(r"ilgm|i love growing", brand, re.I):
        breeder = breeder_guess or "ILGM"
    if bank == "truenorth":
        if brand and re.search(r"true\s*north|elite\s*strain", brand, re.I):
            breeder = breeder_guess or None
        if not breeder:
            breeder = parse_truenorth_slug(slug).get("breeder_guess")
    if bank == "seedsupreme" and brand and re.search(r"seed\s*supreme", brand, re.I):
        breeder = breeder_guess or brand
    if not breeder and cfg.get("default_breeder"):
        breeder = cfg["default_breeder"]
    if bank in {"fastbuds", "mephisto", "dna", "dutchpassion", "greenhouse", "barneys"}:
        # House-brand storefronts: prefer default breeder over store SEO brand.
        store_brand = cfg.get("default_breeder")
        if store_brand and (not brand or re.search(re.escape(store_brand.split()[0]), brand, re.I)):
            breeder = store_brand
        elif store_brand and not breeder:
            breeder = store_brand

    sku = product.get("sku")
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
    price = currency = availability = None
    if isinstance(offers, list) and offers:
        offers = offers[0]
    if isinstance(offers, dict):
        try:
            price = float(offers.get("price"))
        except (TypeError, ValueError):
            price = None
        currency = offers.get("priceCurrency")
        availability = offers.get("availability")

    text = clean(html)
    # Prefer product description for grow parsing (nav chrome pollutes full-page text).
    grow_src = description or text[:2500]
    if bank == "greenhouse" and description:
        grow_src = description
    grow = parse_grow_fields(grow_src)
    # Drop polluted yield leftovers from older parsers / nav bleed.
    yi = grow.get("yield_indoor")
    if isinstance(yi, str) and (
        "seed" in yi.lower()
        or "bundle" in yi.lower()
        or not re.search(r"\d", yi)
        or len(yi) > 40
    ):
        grow.pop("yield_indoor", None)

    low = f"{name} {slug} {raw_name}".lower()
    seed_type = flowering = seed_gender = None
    if bank == "truenorth":
        slug_bits = parse_truenorth_slug(slug)
        seed_type = slug_bits.get("seed_type")
        flowering = slug_bits.get("flowering_behavior")
        seed_gender = slug_bits.get("seed_gender")
    if "auto" in low:
        seed_type = seed_type or "autoflower"
        flowering = flowering or "autoflower"
    elif "photo" in low:
        seed_type = seed_type or "photoperiod"
        flowering = flowering or "photoperiod"
    if "fem" in low:
        seed_gender = seed_gender or "feminized"
    elif "regular" in low or re.search(r"\breg\b", low):
        seed_gender = seed_gender or "regular"

    chemistry: dict[str, Any] = {}
    if grow.get("thc") is not None:
        chemistry["thc"] = grow["thc"]
        if grow.get("thc_range"):
            chemistry["thc_range"] = grow["thc_range"]
    if grow.get("cbd") is not None:
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
        "seed_bank": cfg.get("source_url"),
        "url": normalize_url(url),
        "slug": slug,
        "sku": str(sku) if sku else None,
        "description": (description[:4000] if description else None),
        "image_url": image_url,
        "price": price,
        "currency": currency,
        "availability": availability,
        "seed_type": seed_type,
        "flowering_behavior": flowering,
        "seed_gender": seed_gender,
        "page_text_excerpt": text[:1200],
        "raw_record": {
            "json_ld_product": {k: product.get(k) for k in ("@type", "name", "sku", "brand", "offers") if product.get(k)},
            "url": url,
        },
    }
    row.update({k: v for k, v in grow.items() if v not in (None, "", [], {})})
    if chemistry:
        row["chemistry"] = chemistry
        for k, v in chemistry.items():
            row.setdefault(k, v)
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def save_checkpoint(
    ck: Checkpoint,
    done: set[str],
    *,
    skipped: set[str] | None = None,
    cursor: str | None = None,
) -> None:
    ck.data["done"] = sorted(done)
    ck.data["done_count"] = len(done)
    if skipped is not None:
        ck.data["skipped"] = sorted(skipped)
        ck.data["skipped_count"] = len(skipped)
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
    ck = Checkpoint(DATA / f"dsc_strains_{bank}.checkpoint.json")
    urls = load_product_urls(bank, cfg, delay=delay, refresh=refresh_sitemap)
    if limit is not None:
        urls = urls[: max(0, limit)]

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
    skipped_non_product = 0
    last_staged_at = 0
    t0 = time.time()

    print(
        f"{bank}: {len(urls)} urls queued; resume done={len(done)} "
        f"dump_items={len(by_url)} skipped={len(skipped)}",
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

        try:
            html = polite_get(url, delay=delay, timeout=90)
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
            row = parse_product(html, url, bank=bank, cfg=cfg)
            if row is None:
                skipped_non_product += 1
                skipped.add(nu)
                done.add(nu)
                if skipped_non_product <= 5 or skipped_non_product % 50 == 0:
                    print(f"  skip non-product ({skipped_non_product}) {url}", flush=True)
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
            save_checkpoint(ck, done, skipped=skipped, cursor=url)
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
                        f"skipped={len(skipped)} non_product={skipped_non_product}"
                    ),
                    blockers=blockers[-40:],
                )
            except OSError as exc:
                print(f"  dump write warn: {exc}", flush=True)
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  {bank} checkpoint items={len(items)} done={len(done)} "
                f"skipped={len(skipped)} this_run={scraped_this_run} "
                f"rate={rate:.2f}/s idx={idx}/{len(urls)}",
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
    save_checkpoint(ck, done, skipped=skipped)
    write_dump(
        out,
        "strains",
        items,
        source=bank,
        source_url=cfg["source_url"],
        license=LICENSE,
        redistributable=False,
        note="sitemap scrape complete",
        sitemap_count=len(urls),
        skipped=len(skipped),
        blockers=blockers[-40:],
    )
    print(
        f"wrote {out.name} count={len(items)} skipped={len(skipped)} "
        f"errors={len(ck.data.get('errors') or [])}",
        flush=True,
    )
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape priority seed banks via sitemaps")
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
