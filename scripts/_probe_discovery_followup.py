#!/usr/bin/env python3
"""Follow-up spot-checks for discovery ranking."""

from __future__ import annotations

import json
import re
import ssl
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
CTX = ssl.create_default_context()


def grab(url: str, n: int = 600_000):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
            return r.status, r.geturl(), r.read(n).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        b = e.read(200_000).decode("utf-8", "replace") if e.fp else ""
        return e.code, url, b
    except Exception as e:  # noqa: BLE001
        return None, url, str(e)


def summarize_locs(locs: list[str]) -> None:
    paths = []
    for u in locs[:3000]:
        parts = urlparse(u).path.strip("/").split("/")
        paths.append("/".join(parts[:2]) if parts else "")
    print("  top path prefixes:", Counter(paths).most_common(10))
    prod = [u for u in locs if re.search(r"(product|seed|strain|/p/)", u, re.I)]
    print("  productish", len(prod), "of", len(locs))
    for u in (prod or locs)[:8]:
        print("   ", u)


checks = [
    ("cropking_prod_sm", "https://www.cropkingseeds.com/product-sitemap.xml"),
    ("dc_prod_sm", "https://dcseedexchange.com/product-sitemap.xml"),
    ("multiverse_prod_sm", "https://multiversebeans.com/product-sitemap1.xml"),
    ("ss_sm", "https://seedsupreme.com/media/sitemap/sitemap.xml"),
    ("alchimia_en_idx", "https://www.alchimiaweb.com/en/sitemap-index.xml"),
    ("seedsman_usa_sm", "https://www.seedsman.com/sitemaps/seedsman_usa_site_map_live.xml"),
    ("wse_sm", "https://weedseedsexpress.com/sitemap-en.xml"),
    ("pacific_prod_sm", "https://www.pacificseedbank.com/product-sitemap.xml"),
    ("gh_home", "https://www.greenhouseseeds.nl/"),
    ("quebec_home", "https://quebeccannabisseeds.com/"),
    ("growers_home", "https://growerschoiceseeds.com/"),
    ("dc_shop", "https://dcseedexchange.com/shop/"),
    ("truenorth_seeds", "https://www.truenorthseedbank.com/cannabis-seeds"),
    ("beaver_alt", "https://beaverseeds.ca/"),
    ("organic_alt", "https://organicearthseeds.com/"),
    ("multiverse_shop", "https://multiversebeans.com/shop/"),
    ("growers_shop", "https://growerschoiceseeds.com/shop/"),
]

print("=== DUMP COUNTS ===")
for name in [
    "ilgm",
    "herbies",
    "zamnesia",
    "seedsupreme",
    "cropking",
    "alchimia",
    "seedsman",
    "northatlantic",
    "seedcity",
    "rqs",
]:
    p = DATA / f"dsc_strains_{name}.json"
    if not p.exists():
        print(f"{name}: MISSING")
        continue
    d = json.loads(p.read_text(encoding="utf-8"))
    note = (d.get("note") or "")[:70]
    print(f"{name}: count={d.get('count')} items={len(d.get('items') or [])} note={note}")

print("\n=== SPOT CHECKS ===")
for name, url in checks:
    code, final, body = grab(url)
    print(f"==== {name} http={code} final={(final or '')[:90]} len={len(body or '')}")
    if not body:
        continue
    if code not in (200, 202) and code is not None and code >= 400:
        print("  snippet:", body[:160].replace("\n", " "))
        continue
    locs = re.findall(r"<loc>([^<]+)</loc>", body)
    if locs:
        # nested sitemap index?
        if all("sitemap" in u.lower() for u in locs[:5]):
            print("  nested sitemaps:", len(locs))
            for u in locs[:8]:
                print("   ", u)
            # fetch first product-ish child
            child = next((u for u in locs if "product" in u.lower() or "en" in u.lower()), locs[0])
            c2, f2, b2 = grab(child)
            locs2 = re.findall(r"<loc>([^<]+)</loc>", b2 or "")
            print(f"  child {child} http={c2} locs={len(locs2)}")
            if locs2:
                summarize_locs(locs2)
        else:
            summarize_locs(locs)
        continue
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', body, re.I)
    interesting = [
        h
        for h in hrefs
        if re.search(r"(product|seed|strain|femin|auto|shop|catalog)", h, re.I)
    ]
    print("  interesting hrefs", len(interesting), "of", len(hrefs))
    for h in interesting[:12]:
        print("   ", h)
    if "cdn.shopify.com" in body:
        print("  platform shopify")
    if "woocommerce" in body.lower() or "wp-content" in body:
        print("  platform woo/wp")
    title = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
    if title:
        print("  title", re.sub(r"\s+", " ", title.group(1))[:120])
