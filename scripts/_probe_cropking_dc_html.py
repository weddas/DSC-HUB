#!/usr/bin/env python3
from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
CTX = ssl.create_default_context()
DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"


def grab(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read().decode("utf-8", "replace")


pairs = [
    (
        "ck",
        "https://www.cropkingseeds.com/feminized-seeds/night-moves-strain-feminized-marijuana-seeds/",
    ),
    (
        "dc",
        "https://dcseedexchange.com/product/lane-8-f1-pink-runtz-x-711-3-feminized-seeds/",
    ),
]

for name, url in pairs:
    body = grab(url)
    (DATA / f"_sample_{name}_pdp.html").write_text(body, encoding="utf-8")
    print("====", name, "len", len(body))
    for pat in [
        "product_meta",
        "woocommerce-Tabs",
        "summary entry-summary",
        "product-details",
        "ck-product",
        "elementor",
        "yoast",
        "og:title",
        "application/ld",
        "woocommerce-product-attributes",
        "wp-block",
        "sku",
    ]:
        print(f"  {pat}: {body.lower().count(pat.lower())}")

    for m in re.finditer(
        r'<meta[^>]+(?:property|name)=["\']([^"\']+)["\'][^>]+content=["\']([^"\']*)["\']',
        body,
        re.I,
    ):
        key = m.group(1).lower()
        if any(k in key for k in ("og:", "description", "twitter", "sku")):
            print("  meta", m.group(1), m.group(2)[:120])

    # THC contexts excluding nav noise
    n = 0
    for m in re.finditer(r".{0,50}THC.{0,90}", body, re.I):
        s = re.sub(r"\s+", " ", m.group(0))
        if re.search(r"High THC Seeds|THC Seeds High|menu|nav", s, re.I):
            continue
        print("  THC:", s[:160])
        n += 1
        if n >= 6:
            break

    # Find description / short description divs
    for cls in [
        "woocommerce-product-details__short-description",
        "entry-content",
        "product-description",
        "summary",
        "description",
    ]:
        m = re.search(rf'class=["\'][^"\']*{re.escape(cls)}[^"\']*["\'][^>]*>(.+?)</div>', body, re.I | re.S)
        if m:
            snippet = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(1)))[:300]
            print(f"  div.{cls}:", snippet)

    # table rows
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", body, re.I | re.S)
    print("  tr count", len(rows))
    for row in rows[:15]:
        cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.I | re.S)
        if len(cells) >= 2:
            a = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", cells[0])).strip()
            b = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", cells[1])).strip()
            if a and b and len(a) < 60:
                print(f"   {a} => {b[:90]}")
