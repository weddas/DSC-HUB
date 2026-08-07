#!/usr/bin/env python3
from __future__ import annotations

import re
import ssl
import urllib.request
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

import html as html_lib
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
CTX = ssl.create_default_context()


def html_unescape(s: str) -> str:
    return html_lib.unescape(s)


def grab(url: str, n: int = 3_000_000) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        return r.read(n).decode("utf-8", "replace")


CK_PRODUCT_RE = re.compile(
    r"^https://www\.cropkingseeds\.com/"
    r"(?:autoflowering-seeds|feminized-seeds|regular-marijuana-seeds|"
    r"fast-version-seeds|high-cbd(?:-seeds)?|high-yielding-strain|"
    r"new-strains|cup-winner-strains|award-winning-strain|"
    r"sativa-seeds|indica-seeds|hybrid-seeds|"
    r"[a-z0-9\-]+-seeds)/"
    r"[a-z0-9\-]+(?:-marijuana)?-seeds?/?$",
    re.I,
)
# Broader: any /{cat}/…-seeds/ under cropking excluding non-product roots
CK_BROAD = re.compile(
    r"^https://www\.cropkingseeds\.com/"
    r"(?!marijuana-seeds/?$|shop/?$|cart/?$|checkout/?$|my-account/?$)"
    r"(?:[a-z0-9\-]+)/"
    r"[a-z0-9\-]+-seeds?/?$",
    re.I,
)

DC_PRODUCT_RE = re.compile(
    r"^https://dcseedexchange\.com/product/[a-z0-9\-]+/?$",
    re.I,
)
DC_SKIP = re.compile(r"gift-card|auction|membership|shipping|sticker|shirt|hat|merch", re.I)

print("=== CROP KING SITEMAPS ===")
ck_urls: list[str] = []
seen: set[str] = set()
for i, sm in enumerate(
    [
        "https://www.cropkingseeds.com/product-sitemap.xml",
        "https://www.cropkingseeds.com/product-sitemap2.xml",
        "https://www.cropkingseeds.com/product-sitemap3.xml",
        "https://www.cropkingseeds.com/product-sitemap4.xml",
    ],
    1,
):
    try:
        body = grab(sm)
    except Exception as e:  # noqa: BLE001
        print(f"  sm{i} FAIL {e}")
        continue
    locs = [html_unescape(x.strip()) for x in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body)]
    print(f"  sm{i} locs={len(locs)}")
    for loc in locs:
        u = loc.split("?")[0].split("#")[0]
        if not u.endswith("/"):
            u += "/"
        if u in seen:
            continue
        seen.add(u)
        ck_urls.append(u)

print("unique locs", len(ck_urls))
matched = [u for u in ck_urls if CK_BROAD.match(u.rstrip("/") + "/") or CK_BROAD.match(u)]
# normalize match without forcing trailing slash in regex
CK_BROAD2 = re.compile(
    r"^https://www\.cropkingseeds\.com/"
    r"(?!marijuana-seeds/?$)"
    r"([a-z0-9\-]+)/"
    r"([a-z0-9\-]+-seeds?)/?$",
    re.I,
)
matched = []
cats = Counter()
for u in ck_urls:
    m = CK_BROAD2.match(u.rstrip("/"))
    if not m:
        continue
    cat, slug = m.group(1), m.group(2)
    # skip non-seed category pages that look like products? keep marijuana-seeds category root out
    if slug in {"marijuana-seeds"} and cat == "something":
        pass
    cats[cat] += 1
    matched.append(u.rstrip("/") + "/")
print("matched PDPs", len(matched))
print("cats", cats.most_common(20))
print("unmatched samples:")
for u in ck_urls:
    if not CK_BROAD2.match(u.rstrip("/")):
        print(" ", u)

print("\n=== DC SITEMAPS ===")
dc_urls = []
seen = set()
for i, sm in enumerate(
    [
        "https://dcseedexchange.com/product-sitemap.xml",
        "https://dcseedexchange.com/product-sitemap2.xml",
    ],
    1,
):
    body = grab(sm)
    locs = [html_unescape(x.strip()) for x in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body)]
    print(f"  sm{i} locs={len(locs)}")
    for loc in locs:
        u = loc.split("?")[0].split("#")[0].rstrip("/") + "/"
        if not DC_PRODUCT_RE.match(u.rstrip("/")) and not DC_PRODUCT_RE.match(u):
            continue
        if DC_SKIP.search(u):
            continue
        if u in seen:
            continue
        seen.add(u)
        dc_urls.append(u)
print("dc product urls", len(dc_urls))
print("samples", dc_urls[:3])

# DC description grow fields
body = grab(
    "https://dcseedexchange.com/product/lane-8-f1-pink-runtz-x-711-3-feminized-seeds/"
)
# pull description tab content
m = re.search(
    r'id=["\']tab-description["\'][^>]*>(.*?)</div>\s*<div',
    body,
    re.I | re.S,
)
if m:
    text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(1)))
    print("DC desc:", text[:800])
# also short desc
m = re.search(
    r'woocommerce-product-details__short-description[^>]*>(.*?)</div>',
    body,
    re.I | re.S,
)
if m:
    print("DC short:", re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(1)))[:300])

# Crop king all table rows
body = Path("homeassistant/data/_sample_ck_pdp.html").read_text(encoding="utf-8")
rows = re.findall(r"<tr[^>]*>(.*?)</tr>", body, re.I | re.S)
print("\nCK all rows:")
for row in rows:
    cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.I | re.S)
    if len(cells) >= 2:
        a = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", cells[0])).strip()
        b = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", cells[1])).strip()
        print(f"  {a} => {b}")
