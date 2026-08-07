#!/usr/bin/env python3
"""Phase A: classify ~1482 breeder inventory into scrape tiers A/B/C/D.

No master merge. No Task Scheduler. Fast concurrent probes only.
Writes: homeassistant/data/_breeder_scrape_queue_1482.json
"""

from __future__ import annotations

import concurrent.futures
import json
import re
import socket
import ssl
import time
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
INV = DATA / "dsc_seed_breeders.json"
SF_URLS = DATA / "dsc_strains_seedfinder.urls.json"
OUT = DATA / "_breeder_scrape_queue_1482.json"
PROGRESS = DATA / "_breeder_scrape_queue_1482.progress.json"

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
CTX = ssl.create_default_context()

# Already well-covered / mid-flight — exclude from active probe queue (listed for siblings).
EXCLUDED: dict[str, str] = {
    # Large bank / directory scrapes already done or mid-flight
    "multiverse beans": "multiverse",
    "multiverse": "multiverse",
    "weed seeds express": "wse",
    "wse": "wse",
    "alchimia grow shop": "alchimia",
    "alchimia": "alchimia",
    "hytiva": "hytiva",
    "cannaconnection": "cannaconnection",
    "canna connection": "cannaconnection",
    "seedsman": "seedsman",
    "royal queen seeds": "rqs",
    "rqs": "rqs",
    "fast buds": "fastbuds",
    "fastbuds": "fastbuds",
    "barney's farm": "barneys",
    "barneys farm": "barneys",
    "barneys": "barneys",
    "mephisto genetics": "mephisto",
    "mephisto": "mephisto",
    "dna genetics": "dna",
    "dutch passion": "dutchpassion",
    "greenhouse seed company": "greenhouse",
    "greenhouse seeds": "greenhouse",
    "ilgm": "ilgm",
    "ilove growing marijuana": "ilgm",
    "i love growing marijuana": "ilgm",
    "seedsupreme": "seedsupreme",
    "seed supreme": "seedsupreme",
    "pacific seed bank": "pacific",
    "true north seedbank": "truenorth",
    "true north seed bank": "truenorth",
    "crop king seeds": "cropking",
    "cropking": "cropking",
    "dc seed exchange": "dcseed",
    "zamnesia": "zamnesia",
    "herbies": "herbies",
    "herbies head shop": "herbies",
    # Official DBs / directories (not breeder storefronts)
    "seedfinder": "seedfinder",
    "leafly": "leafly",
    "wikileaf": "wikileaf",
    "allbud": "allbud",
    "weedmaps": "weedmaps",
    "way of leaf": "wayofleaf",
    # StrainDB paused
    "straindb": "straindb",
    "strain-database": "straindb",
    "strain database": "straindb",
}

# Known storefront URLs for inventory names (banks + common breeders).
KNOWN_URLS: dict[str, str] = {
    "alchimia grow shop": "https://www.alchimiaweb.com/",
    "attitude seedbank": "https://www.attitudeseedbank.com/",
    "beaver seeds": "https://www.beaverseeds.com/",
    "crop king seeds": "https://www.cropkingseeds.com/",
    "dc seed exchange": "https://dcseedexchange.com/",
    "great lakes genetics": "https://greatlakesgenetics.com/",
    "greenhouse seed company": "https://shop.greenhouseseeds.nl/",
    "growers choice seeds": "https://growerschoiceseeds.com/",
    "herbies": "https://herbiesheadshop.com/",
    "ilgm": "https://ilgm.com/",
    "multiverse beans": "https://multiversebeans.com/",
    "neptune seed bank": "https://neptuneseedbank.com/",
    "north atlantic seed co": "https://northatlanticseed.com/",
    "oregon elite seeds": "https://oregoneliteseeds.com/",
    "organic earth": "https://organicearthseeds.com/",
    "pacific seed bank": "https://pacificseedbank.com/",
    "quebec cannabis seeds": "https://quebeccannabisseeds.com/",
    "seed city": "https://www.seed-city.com/",
    "seedsman": "https://www.seedsman.com/",
    "seedsupreme": "https://seedsupreme.com/",
    "true north seedbank": "https://truenorthseedbank.com/",
    "weed seeds express": "https://weedseedsexpress.com/",
    "zamnesia": "https://www.zamnesia.com/",
    "fast buds": "https://fastbuds.com/",
    "barney's farm": "https://www.barneysfarm.com/",
    "dutch passion": "https://dutch-passion.com/",
    "dna genetics": "https://dnagenetics.com/",
    "mephisto genetics": "https://mephistogenetics.com/",
    "royal queen seeds": "https://www.royalqueenseeds.com/",
    "ace seeds": "https://www.aceseeds.org/",
    "sensi seeds": "https://sensiseeds.com/",
    "serious seeds": "https://seriousseeds.com/",
    "paradise seeds": "https://www.paradise-seeds.com/",
    "sweet seeds": "https://www.sweetseeds.com/",
    "world of seeds": "https://www.worldofseeds.eu/",
    "exotic seeds": "https://www.exoticseed.eu/",
    "ripper seeds": "https://www.ripperseeds.com/",
    "delicious seeds": "https://www.deliciousseeds.com/",
    "philosopher seeds": "https://www.philosopherseeds.com/",
    "medical seeds": "https://www.medicalseeds.com/",
    "kannabia": "https://www.kannabia.com/",
    "budeeze": "https://budeeze.com/",
    "ethos genetics": "https://ethosgenetics.com/",
    "humboldt seed company": "https://humboldtseedcompany.com/",
    "humboldt seed co": "https://humboldtseedcompany.com/",
    "archive seed bank": "https://archiveseedbank.com/",
    "compound genetics": "https://compoundgenetics.com/",
    "raw genetics": "https://rawgenetics.com/",
    "in house genetics": "https://inhousegenetics.com/",
    "solfire gardens": "https://solfiregardens.com/",
    "cannarado genetics": "https://cannaradogenetics.com/",
    "thugpug genetics": "https://thugpug.com/",
    "clearwater genetics": "https://clearwatergenetics.com/",
    "twenty20 mendocino": "https://twenty20mendocino.com/",
    "night owl seeds": "https://nightowlseeds.com/",
    "mosca seeds": "https://moscaseeds.com/",
    "bodhi seeds": "https://theseedbank.com/",  # often reseller; keep tentative
    "crockett family farms": "https://crockettfamilyfarms.com/",
    "dark horse genetics": "https://darkhorsegenetics.com/",
    "onibreeding": "https://onibreeding.com/",
    "csi: humboldt": "https://csihumboldt.com/",
    "csi humboldt": "https://csihumboldt.com/",
    "relentless genetics": "https://relentlessgenetics.com/",
    "bloom seed co": "https://bloomseedco.com/",
    "beleaf cannabis": "https://beleafcannabis.com/",
    "g13 labs": "https://www.g13labs.com/",
    "nirvana seeds": "https://www.nirvana-seeds.com/",
    "female seeds": "https://www.femaleseeds.nl/",
    "00 seeds bank": "https://00seeds.com/",
    "advanced seeds": "https://www.advancedseeds.com/",
    "amsterdam genetics": "https://amsterdamgenetics.com/",
    "anesia seeds": "https://anesia-seeds.com/",
    "big buddha seeds": "https://bigbuddhaseeds.com/",
    "blackskull seeds": "https://blackskullseeds.com/",
    "bomb seeds": "https://www.bombseeds.com/",
    "cali connection": "https://thecaliconnection.com/",
    "chefans": "https://chefans.com/",
    "ckc genetics": "https://ckcgenetics.com/",
    "cookie fam genetics": "https://cookiefamgenetics.com/",
    "dank genetics": "https://dankgenetics.com/",
    "elev8 seeds": "https://elev8seeds.com/",
    "expert seeds": "https://expertseeds.com/",
    "freeborn selections": "https://freebornselections.com/",
    "gauge genetics": "https://gaugegenetics.com/",
    "green house seed co": "https://shop.greenhouseseeds.nl/",
    "green house seeds": "https://shop.greenhouseseeds.nl/",
    "growing tips": "https://growingtips.nl/",
    "heavyweight seeds": "https://www.heavyweightseeds.com/",
    "holy smoke seeds": "https://holysmokeseeds.com/",
    "homegrown cannabis co": "https://homegrowncannabisco.com/",
    "jamaican lion": "https://jamaicanlion.com/",
    "jinxproof genetics": "https://jinxproofgenetics.com/",
    "king's cali connection": "https://thecaliconnection.com/",
    "loud seeds": "https://loudseeds.com/",
    "mandala seeds": "https://www.mandalaseeds.com/",
    "marijuana seeds": "https://www.marijuanaseeds.com/",
    "ministry of cannabis": "https://www.ministryofcannabis.com/",
    "mr nice seedbank": "https://mrnice.nl/",
    "pyramid seeds": "https://www.pyramidseeds.com/",
    "rare dankness": "https://raredankness.com/",
    "reservoir seeds": "https://reservoirseeds.com/",
    "royal seeds": "https://www.royalseeds.com/",
    "seeds of africa": "https://seedsofafrica.com/",
    "shortstuff seeds": "https://shortstuffseeds.com/",
    "soma seeds": "https://somaseeds.nl/",
    "strain hunters": "https://www.strainhunters.com/",
    "super sativa seed club": "https://supersativaseedclub.com/",
    "tg genetics": "https://tgagenetics.com/",
    "the real seed company": "https://therealseedcompany.com/",
    "tropical seeds": "https://tropicalseedscompany.com/",
    "vision seeds": "https://www.visionseeds.com/",
    "white label seed co": "https://www.whitelabelseeds.com/",
    "world of seeds bank": "https://www.worldofseeds.eu/",
}


def norm_name(s: str) -> str:
    s = s.lower().strip()
    s = s.replace("&", " and ")
    s = re.sub(r"[^\w\s\-']+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def slugify(s: str) -> str:
    s = norm_name(s)
    s = s.replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def seedfinder_slug(s: str) -> str:
    """Seedfinder uses underscore / hyphen variants; prefer hyphen then underscore."""
    return slugify(s)


def http_get(
    url: str,
    *,
    timeout: float = 8.0,
    max_bytes: int = 120_000,
) -> tuple[int | None, str, str | None, dict[str, str]]:
    """Return status, body(text), final_url, headers(lower)."""
    req = urllib.request.Request(url, headers=UA, method="GET")
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=timeout) as resp:
            status = getattr(resp, "status", None) or resp.getcode()
            final = resp.geturl()
            headers = {k.lower(): v for k, v in resp.headers.items()}
            raw = resp.read(max_bytes)
            charset = "utf-8"
            ctype = headers.get("content-type", "")
            m = re.search(r"charset=([\w\-]+)", ctype, re.I)
            if m:
                charset = m.group(1)
            try:
                text = raw.decode(charset, errors="replace")
            except LookupError:
                text = raw.decode("utf-8", errors="replace")
            return int(status), text, final, headers
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read(max_bytes).decode("utf-8", errors="replace")
        except Exception:
            pass
        headers = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        return int(e.code), body, url, headers
    except socket.gaierror:
        return None, "", None, {"_error": "dns"}
    except TimeoutError:
        return None, "", None, {"_error": "timeout"}
    except Exception as e:  # noqa: BLE001
        err = type(e).__name__
        msg = str(e).lower()
        if "getaddrinfo" in msg or "name or service" in msg or "nodename" in msg:
            return None, "", None, {"_error": "dns"}
        if "timed out" in msg or "timeout" in msg:
            return None, "", None, {"_error": "timeout"}
        if "connection refused" in msg:
            return None, "", None, {"_error": "refused"}
        if "ssl" in msg:
            return None, "", None, {"_error": "ssl"}
        return None, "", None, {"_error": err}


def detect_platform(url: str, html: str, headers: dict[str, str]) -> dict[str, Any]:
    h = html.lower()
    signals: list[str] = []
    platform = None

    if "cdn.shopify.com" in h or "myshopify.com" in h or "Shopify.theme" in html:
        platform = "shopify"
        signals.append("shopify_cdn")
    if "woocommerce" in h or "wp-content/plugins/woocommerce" in h:
        platform = platform or "woocommerce"
        signals.append("woocommerce")
    if "mage/" in h or "magento" in h or "Magento_" in html:
        platform = platform or "magento"
        signals.append("magento")
    if "wp-content" in h or "wordpress" in h:
        signals.append("wordpress")
    if 'application/ld+json' in h and '"product"' in h:
        signals.append("jsonld_product")
    if "/products.json" in h or "ShopifyAnalytics" in html:
        signals.append("shopify_analytics")

    # Sitemap / product path hints in HTML
    if "sitemap" in h:
        signals.append("sitemap_mention")
    if "/product/" in h or "/products/" in h:
        signals.append("product_paths")
    if "coming soon" in h or "comingsoon" in h or "under construction" in h:
        signals.append("coming_soon")
    if "parked" in h and ("domain" in h or "godaddy" in h or "hugedomains" in h):
        signals.append("parked")
    if len(html.strip()) < 400:
        signals.append("thin_body")

    server = headers.get("server", "")
    powered = headers.get("x-powered-by", "")
    if "shopify" in server.lower():
        platform = "shopify"
        signals.append("server_shopify")
    if "magento" in powered.lower():
        platform = platform or "magento"

    return {"platform": platform, "signals": sorted(set(signals))}


def probe_endpoint(base: str, path: str, *, timeout: float = 6.0) -> dict[str, Any]:
    url = base.rstrip("/") + path
    status, body, final, headers = http_get(url, timeout=timeout, max_bytes=80_000)
    ok = status is not None and 200 <= status < 400
    hint = None
    if ok and body:
        bl = body.lower()
        if path.endswith(".json") and ("products" in bl or '"product"' in bl):
            hint = "product_json"
        elif "sitemap" in path and ("<urlset" in bl or "<sitemapindex" in bl or "<loc>" in bl):
            hint = "sitemap_xml"
            # count product-ish locs
            locs = re.findall(r"<loc>([^<]+)</loc>", body, re.I)
            prodish = [
                u
                for u in locs
                if re.search(r"/(product|products)/", u, re.I)
                or re.search(r"product-sitemap", u, re.I)
            ]
            return {
                "url": url,
                "status": status,
                "ok": ok,
                "hint": hint,
                "loc_count": len(locs),
                "productish_locs": len(prodish),
                "final": final,
            }
        elif "woocommerce" in bl or "/product/" in bl:
            hint = "wc_html"
        elif "shopify" in bl or "/products/" in bl:
            hint = "shopify_html"
    return {
        "url": url,
        "status": status,
        "ok": ok,
        "hint": hint,
        "error": headers.get("_error"),
        "final": final,
        "bytes": len(body or ""),
    }


SITEMAP_PATHS = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/product-sitemap.xml",
    "/wp-sitemap.xml",
    "/sitemap-products.xml",
]
API_PATHS = [
    "/products.json",
    "/collections/all/products.json",
    "/wp-json/wc/store/products",
    "/wp-json/wc/v3/products",
    "/index.php?route=extension/feed/google_sitemap",
]


def candidate_domains(name: str) -> list[str]:
    """Guess likely storefront domains from a breeder name (keep short)."""
    base = slugify(name)
    compact = base.replace("-", "")
    trimmed = re.sub(
        r"-(seeds?|seed-bank|seedbank|genetics|genetix|company|co|labs?|farm|farms)$",
        "",
        base,
    )
    stems: list[str] = []
    for stem in (compact, trimmed.replace("-", ""), base, trimmed):
        if stem and len(stem) >= 3 and stem not in stems:
            stems.append(stem)
    variants: list[str] = []
    for stem in stems[:3]:
        for tld in (".com", ".nl", ".eu", ".org"):
            variants.append(f"https://{stem}{tld}/")
    prefer = [c for c in variants if c.endswith(".com/")]
    rest = [c for c in variants if c not in prefer]
    return (prefer + rest)[:6]


def dns_ok(host: str) -> bool:
    if not host:
        return False
    try:
        socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
        return True
    except OSError:
        try:
            socket.getaddrinfo(host, 80, type=socket.SOCK_STREAM)
            return True
        except OSError:
            return False


def looks_seedish(html: str, name: str) -> bool:
    h = (html or "").lower()
    if any(
        k in h
        for k in (
            "cannabis",
            "marijuana",
            "seed bank",
            "seedbank",
            "feminized",
            "autoflower",
            "genetics",
            "strain",
            "woocommerce",
            "cdn.shopify.com",
            "/products/",
            "/product/",
        )
    ):
        return True
    tokens = [t for t in re.split(r"[^a-z0-9]+", norm_name(name)) if len(t) >= 4]
    hits = sum(1 for t in tokens if t in h)
    return hits >= max(1, min(2, len(tokens)))


def load_seedfinder_breeder_slugs() -> dict[str, str]:
    """Map normalized breeder display guess → seedfinder slug from strain URLs."""
    mapping: dict[str, str] = {}
    if not SF_URLS.exists():
        return mapping
    data = json.loads(SF_URLS.read_text(encoding="utf-8"))
    urls = data.get("urls") or []
    for u in urls:
        m = re.search(r"/strain-info/[^/]+/([^/?#]+)/?$", u, re.I)
        if not m:
            continue
        slug = m.group(1).lower()
        # slug → readable-ish key
        key = slug.replace("-", " ").replace("_", " ")
        mapping[key] = slug
        mapping[slug.replace("_", "-")] = slug
        mapping[slug.replace("-", "_")] = slug
    return mapping


def extract_external_from_sf(html: str) -> str | None:
    """Pull likely official website from a Seedfinder breeder page."""
    # Prefer labeled website links
    patterns = [
        r'(?:Homepage|Website|Official|Homepage:)\s*</[^>]+>\s*<a[^>]+href=["\'](https?://[^"\']+)["\']',
        r'href=["\'](https?://(?!seedfinder\.eu|facebook\.com|instagram\.com|twitter\.com|x\.com|youtube\.com|t\.me|wa\.me)[^"\']+)["\'][^>]*>\s*(?:Homepage|Website|Official)',
        r'<a[^>]+rel=["\'][^"\']*noopener[^"\']*["\'][^>]+href=["\'](https?://(?!seedfinder\.eu)[^"\']+)["\']',
    ]
    for pat in patterns:
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1)
    # Fallback: first external http link that looks like a site root-ish
    for m in re.finditer(r'href=["\'](https?://[^"\']+)["\']', html, re.I):
        u = m.group(1)
        host = urlparse(u).netloc.lower()
        if not host or "seedfinder" in host:
            continue
        if any(
            x in host
            for x in (
                "facebook",
                "instagram",
                "twitter",
                "youtube",
                "linkedin",
                "reddit",
                "t.me",
                "wa.me",
                "google.",
                "apple.com",
            )
        ):
            continue
        return u
    return None


def resolve_url(
    name: str,
    *,
    sf_slugs: dict[str, str],
    fetch_sf: bool = False,
) -> dict[str, Any]:
    key = norm_name(name)
    if key in KNOWN_URLS:
        return {"url": KNOWN_URLS[key], "url_source": "known_map"}

    # Seedfinder slug match (optional live fetch — often 403; off by default)
    slug = sf_slugs.get(key) or sf_slugs.get(slugify(name)) or sf_slugs.get(
        slugify(name).replace("-", "_")
    )
    if not slug:
        s = slugify(name)
        for cand in (s, s.replace("-", "_"), s.replace("-", " ")):
            if cand in sf_slugs:
                slug = sf_slugs[cand]
                break

    if fetch_sf and slug:
        for style in (slug.replace("_", "-"), slug.replace("-", "_"), slug):
            sf_url = f"https://seedfinder.eu/en/database/breeder/{style}/"
            status, html, _, headers = http_get(sf_url, timeout=7.0, max_bytes=100_000)
            if status and 200 <= status < 400 and html:
                ext = extract_external_from_sf(html)
                if ext:
                    return {
                        "url": ext if ext.endswith("/") else ext,
                        "url_source": "seedfinder_breeder",
                        "seedfinder_url": sf_url,
                        "seedfinder_slug": style,
                    }
            if headers.get("_error") == "dns":
                break
            if status == 404:
                continue
            break

    # Domain guess — probe will try candidate list
    cands = candidate_domains(name)
    # Prefer .com without www first (faster DNS success rate historically)
    prefer = [c for c in cands if c.startswith("https://") and "www." not in c and c.endswith(".com/")]
    rest = [c for c in cands if c not in prefer]
    ordered = prefer + rest
    return {
        "url": ordered[0] if ordered else None,
        "url_source": "domain_guess",
        "url_candidates": ordered,
        "seedfinder_slug": slug,
    }


def classify_row(row: dict[str, Any]) -> str:
    """Assign tier A/B/C/D."""
    if row.get("excluded"):
        return "excluded"
    status = row.get("status")
    err = row.get("error")
    signals = set(row.get("signals") or [])
    probes = row.get("probes") or []
    platform = row.get("platform")

    if err in ("dns", "refused") or status is None and err:
        return "D"
    if "coming_soon" in signals or "parked" in signals:
        return "D"
    if status and status >= 400 and not any(p.get("ok") for p in probes):
        return "D"

    sitemap_hits = [
        p
        for p in probes
        if p.get("hint") == "sitemap_xml" and p.get("ok")
    ]
    api_hits = [
        p
        for p in probes
        if p.get("hint") in ("product_json",) and p.get("ok")
    ]
    strong_sitemap = any(
        (p.get("productish_locs") or 0) > 0 or (p.get("loc_count") or 0) >= 5
        for p in sitemap_hits
    )

    if api_hits or (platform in ("shopify", "woocommerce", "magento") and strong_sitemap):
        return "A"
    if strong_sitemap or (platform and "product_paths" in signals):
        return "A"
    if platform in ("shopify", "woocommerce", "magento") and status and 200 <= status < 400:
        return "A" if api_hits or sitemap_hits else "B"
    if sitemap_hits or "jsonld_product" in signals or "product_paths" in signals:
        return "B"
    if status and 200 <= status < 400 and "thin_body" not in signals:
        # Live host, unclear platform — likely needs crawl/JS
        if "wordpress" in signals:
            return "B"
        return "C"
    if status and 200 <= status < 400:
        return "C"
    return "D"


def probe_storefront(entry: dict[str, Any]) -> dict[str, Any]:
    name = entry["name"]
    url = entry.get("url")
    candidates = list(entry.get("url_candidates") or [])
    if url and url not in candidates:
        candidates = [url] + candidates
    seen: set[str] = set()
    ordered: list[str] = []
    for c in candidates:
        if c and c not in seen:
            seen.add(c)
            ordered.append(c)
    if entry.get("url_source") == "known_map":
        candidates = ordered[:2]
    else:
        candidates = ordered[:4]

    best: dict[str, Any] | None = None
    tried: list[str] = []
    rank = {"A": 0, "B": 1, "C": 2, "D": 3, "excluded": 4}

    for cand in candidates:
        tried.append(cand)
        host = urlparse(cand).hostname or ""
        if not dns_ok(host):
            continue

        status, html, final, headers = http_get(cand, timeout=4.0, max_bytes=60_000)
        err = headers.get("_error")
        if status is None:
            if cand.startswith("https://"):
                http_cand = "http://" + cand[len("https://") :]
                status, html, final, headers = http_get(
                    http_cand, timeout=3.0, max_bytes=60_000
                )
                err = headers.get("_error")
                cand = http_cand
            if status is None:
                continue

        det = detect_platform(cand, html or "", headers)
        base = f"{urlparse(final or cand).scheme}://{urlparse(final or cand).netloc}"
        seedish = looks_seedish(html or "", name) or entry.get("url_source") == "known_map"
        probes: list[dict[str, Any]] = []

        if seedish or det["platform"] or "wordpress" in det["signals"]:
            if det["platform"] == "shopify" or "shopify" in " ".join(det["signals"]):
                paths = ["/products.json", "/sitemap.xml"]
            elif det["platform"] == "woocommerce" or "woocommerce" in det["signals"]:
                paths = ["/product-sitemap.xml", "/sitemap_index.xml", "/sitemap.xml"]
            else:
                paths = ["/products.json", "/sitemap.xml", "/product-sitemap.xml"]
            for path in paths[:3]:
                probes.append(probe_endpoint(base, path, timeout=3.5))
            row = {
                **entry,
                "url": final or cand,
                "base": base,
                "status": status,
                "error": err,
                "platform": det["platform"],
                "signals": det["signals"],
                "probes": probes,
                "tried_urls": tried,
                "html_bytes": len(html or ""),
            }
            row["tier"] = classify_row(row)
        else:
            # Live host but not seed-related — don't burn sitemap budget
            row = {
                **entry,
                "url": final or cand,
                "base": base,
                "status": status,
                "error": err,
                "platform": det["platform"],
                "signals": det["signals"] + ["not_seedish"],
                "probes": [],
                "tried_urls": tried,
                "html_bytes": len(html or ""),
                "tier": "C" if status and 200 <= status < 400 else "D",
            }

        if best is None or rank.get(row["tier"], 9) < rank.get(best["tier"], 9):
            best = row
        if row["tier"] in ("A", "B"):
            break
        if entry.get("url_source") == "known_map" and row["tier"] != "D":
            break

    if best is None:
        best = {
            **entry,
            "url": url,
            "status": None,
            "error": "dns",
            "platform": None,
            "signals": [],
            "probes": [],
            "tried_urls": tried,
            "tier": "D",
        }
    if "not_seedish" not in (best.get("signals") or []):
        best["tier"] = classify_row(best)
    return best


def slim_row(r: dict[str, Any]) -> dict[str, Any]:
    return {
        "name": r.get("name"),
        "name_norm": r.get("name_norm"),
        "url": r.get("url"),
        "base": r.get("base"),
        "url_source": r.get("url_source"),
        "platform": r.get("platform"),
        "signals": r.get("signals") or [],
        "status": r.get("status"),
        "error": r.get("error"),
        "tier": r.get("tier"),
        "probes": [
            {
                "url": p.get("url"),
                "status": p.get("status"),
                "ok": p.get("ok"),
                "hint": p.get("hint"),
                "loc_count": p.get("loc_count"),
                "productish_locs": p.get("productish_locs"),
            }
            for p in (r.get("probes") or [])
            if p.get("ok") or p.get("hint")
        ][:6],
        "seedfinder_url": r.get("seedfinder_url"),
        "seedfinder_slug": r.get("seedfinder_slug"),
        "exclude_reason": r.get("exclude_reason"),
    }


def main() -> int:
    t0 = time.time()
    socket.setdefaulttimeout(4.0)
    inv = json.loads(INV.read_text(encoding="utf-8"))
    breeders: list[str] = list(inv.get("breeders") or [])
    banks: list[str] = list(inv.get("seed_banks") or [])
    # Union: probe breeders + banks that aren't already in breeders list
    names = list(dict.fromkeys(breeders + banks))

    print(f"inventory breeders={len(breeders)} banks={len(banks)} union={len(names)}", flush=True)
    sf_slugs = load_seedfinder_breeder_slugs()
    print(f"seedfinder slug keys={len(sf_slugs)}", flush=True)

    excluded_rows: list[dict[str, Any]] = []
    to_probe: list[dict[str, Any]] = []

    for name in names:
        key = norm_name(name)
        if key in EXCLUDED:
            excluded_rows.append(
                {
                    "name": name,
                    "name_norm": key,
                    "excluded": True,
                    "exclude_reason": EXCLUDED[key],
                    "tier": "excluded",
                    "url": KNOWN_URLS.get(key),
                }
            )
            continue
        to_probe.append({"name": name, "name_norm": key})

    print(f"excluded={len(excluded_rows)} remaining={len(to_probe)}", flush=True)

    # Phase 1: resolve URLs (known map + domain guess; no Seedfinder live fetch)
    def resolve_one(item: dict[str, Any]) -> dict[str, Any]:
        resolved = resolve_url(item["name"], sf_slugs=sf_slugs, fetch_sf=False)
        return {**item, **resolved}

    resolved_list: list[dict[str, Any]] = []
    # Seedfinder fetches are the slow part — bound workers
    with concurrent.futures.ThreadPoolExecutor(max_workers=24) as ex:
        futs = {ex.submit(resolve_one, it): it for it in to_probe}
        done = 0
        for fut in concurrent.futures.as_completed(futs):
            resolved_list.append(fut.result())
            done += 1
            if done % 100 == 0:
                print(f"  resolve {done}/{len(to_probe)}", flush=True)
                PROGRESS.write_text(
                    json.dumps(
                        {"phase": "resolve", "done": done, "total": len(to_probe)},
                        indent=2,
                    ),
                    encoding="utf-8",
                )

    src_counts = Counter(r.get("url_source") for r in resolved_list)
    print(f"url sources: {dict(src_counts)}")

    # Phase 2: probe storefronts
    results: list[dict[str, Any]] = []

    def write_partial(done: int, final: bool = False) -> None:
        tiers_c = Counter(r.get("tier") for r in results)
        by: dict[str, list] = {"A": [], "B": [], "C": [], "D": []}
        for r in results:
            t = r.get("tier") or "D"
            if t not in by:
                t = "D"
            by[t].append(slim_row(r))
        for t in by:
            by[t].sort(key=lambda x: (x.get("name_norm") or ""))
        payload = {
            "schema_version": 1,
            "kind": "breeder_scrape_queue",
            "partial": not final,
            "built_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "source_inventory": str(INV.relative_to(ROOT)).replace("\\", "/"),
            "counts": {
                "inventory_breeders": len(breeders),
                "inventory_banks": len(banks),
                "union": len(names),
                "excluded": len(excluded_rows),
                "probed": len(results),
                "tier_A": len(by["A"]),
                "tier_B": len(by["B"]),
                "tier_C": len(by["C"]),
                "tier_D": len(by["D"]),
            },
            "excluded_banks": [slim_row(r) for r in sorted(excluded_rows, key=lambda x: x["name_norm"])],
            "excluded_list": sorted({r["exclude_reason"] for r in excluded_rows}),
            "tiers": by,
            "url_source_counts": dict(src_counts),
            "elapsed_sec": round(time.time() - t0, 1),
            "notes": [
                "Tier A: clear sitemap/API/product JSON signals",
                "Tier B: live + likely crawlable (WP/platform hints)",
                "Tier C: live but hard/JS/unclear",
                "Tier D: dead/DNS/empty/coming-soon/parked — skip",
                "No master merge. CREATE_NO_WINDOW launches only for scrape siblings.",
            ],
        }
        OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        PROGRESS.write_text(
            json.dumps(
                {
                    "phase": "probe" if not final else "done",
                    "done": done,
                    "total": len(resolved_list),
                    "tiers": dict(tiers_c),
                    "partial": not final,
                },
                indent=2,
            ),
            encoding="utf-8",
        )

    # Modest concurrency: Windows getaddrinfo + NAS JSON writes stall hard at 40–60.
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        futs = {ex.submit(probe_storefront, it): it for it in resolved_list}
        done = 0
        for fut in concurrent.futures.as_completed(futs):
            try:
                results.append(fut.result(timeout=120))
            except Exception as exc:  # noqa: BLE001
                it = futs[fut]
                results.append(
                    {
                        **it,
                        "status": None,
                        "error": f"probe_exc:{type(exc).__name__}",
                        "platform": None,
                        "signals": [],
                        "probes": [],
                        "tier": "D",
                    }
                )
            done += 1
            if done % 60 == 0 or done == len(resolved_list):
                tiers = Counter(r.get("tier") for r in results)
                print(f"  probe {done}/{len(resolved_list)} tiers={dict(tiers)}", flush=True)
                try:
                    write_partial(done, final=False)
                except OSError as wexc:
                    print(f"  partial write warn: {wexc}", flush=True)

    # Final ranked rewrite
    def sort_key(r: dict[str, Any]) -> tuple:
        probes = r.get("probes") or []
        prod = max((p.get("productish_locs") or 0) for p in probes) if probes else 0
        locs = max((p.get("loc_count") or 0) for p in probes) if probes else 0
        plat = 0 if r.get("platform") else 1
        return (plat, -prod, -locs, r.get("name_norm") or "")

    by_tier: dict[str, list[dict[str, Any]]] = {"A": [], "B": [], "C": [], "D": []}
    for r in results:
        t = r.get("tier") or "D"
        if t not in by_tier:
            t = "D"
        by_tier[t].append(r)
    for t in by_tier:
        by_tier[t].sort(key=sort_key)

    payload = {
        "schema_version": 1,
        "kind": "breeder_scrape_queue",
        "partial": False,
        "built_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source_inventory": str(INV.relative_to(ROOT)).replace("\\", "/"),
        "counts": {
            "inventory_breeders": len(breeders),
            "inventory_banks": len(banks),
            "union": len(names),
            "excluded": len(excluded_rows),
            "probed": len(results),
            "tier_A": len(by_tier["A"]),
            "tier_B": len(by_tier["B"]),
            "tier_C": len(by_tier["C"]),
            "tier_D": len(by_tier["D"]),
        },
        "excluded_banks": [
            slim_row(r) for r in sorted(excluded_rows, key=lambda x: x["name_norm"])
        ],
        "excluded_list": sorted({r["exclude_reason"] for r in excluded_rows}),
        "tiers": {
            "A": [slim_row(r) for r in by_tier["A"]],
            "B": [slim_row(r) for r in by_tier["B"]],
            "C": [slim_row(r) for r in by_tier["C"]],
            "D": [slim_row(r) for r in by_tier["D"]],
        },
        "url_source_counts": dict(src_counts),
        "elapsed_sec": round(time.time() - t0, 1),
        "notes": [
            "Tier A: clear sitemap/API/product JSON signals",
            "Tier B: live + likely crawlable (WP/platform hints)",
            "Tier C: live but hard/JS/unclear",
            "Tier D: dead/DNS/empty/coming-soon/parked — skip",
            "No master merge. CREATE_NO_WINDOW launches only for scrape siblings.",
        ],
    }
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    PROGRESS.write_text(
        json.dumps(
            {
                "phase": "done",
                "done": len(results),
                "total": len(resolved_list),
                "tiers": {
                    "A": len(by_tier["A"]),
                    "B": len(by_tier["B"]),
                    "C": len(by_tier["C"]),
                    "D": len(by_tier["D"]),
                },
                "partial": False,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"wrote {OUT}")
    print(json.dumps(payload["counts"], indent=2))
    print(f"elapsed_sec={payload['elapsed_sec']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
