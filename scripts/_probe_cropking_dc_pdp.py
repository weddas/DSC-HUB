#!/usr/bin/env python3
"""One-shot PDP HTML probe for Crop King + DC Seed Exchange."""

from __future__ import annotations

import html as html_lib
import json
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
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data"


def grab(url: str, n: int = 900_000) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read(n).decode("utf-8", "replace")


def clean(s: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", s or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


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
        if isinstance(doc, list):
            out.extend(x for x in doc if isinstance(x, dict))
        elif isinstance(doc, dict):
            out.append(doc)
    return out


URLS = [
    "https://www.cropkingseeds.com/autoflowering-seeds/space-cookies-autoflowering-marijuana-seeds/",
    "https://www.cropkingseeds.com/feminized-seeds/night-moves-strain-feminized-marijuana-seeds/",
    "https://dcseedexchange.com/product/gorilla-cookie-cakes-auto-gorilla-cookies-x-gelato-auto-5-feminized-autoflower-seeds/",
    "https://dcseedexchange.com/product/lane-8-f1-pink-runtz-x-711-3-feminized-seeds/",
]

samples = []
for url in URLS:
    body = grab(url)
    blocks = extract_json_ld(body)
    product = next((b for b in blocks if "Product" in str(b.get("@type"))), {})
    text = clean(body)
    # attribute tables
    attrs = []
    for m in re.finditer(
        r'woocommerce-product-attributes-item__label[^>]*>(.*?)</[^>]+>\s*'
        r'.*?woocommerce-product-attributes-item__value[^>]*>(.*?)</t[dh]',
        body,
        re.I | re.S,
    ):
        attrs.append((clean(m.group(1)), clean(m.group(2))))
    if not attrs:
        for m in re.finditer(r"<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>", body, re.I | re.S):
            attrs.append((clean(m.group(1)), clean(m.group(2))))
    # cropking often uses definition lists / labeled spans
    labeled = []
    for m in re.finditer(
        r"(?i)(?:THC|CBD|Flowering|Yield|Genetics|Breeder|Type|Height|Indica|Sativa)"
        r"[:\s]+([^\n.<]{2,80})",
        text,
    ):
        labeled.append(m.group(0)[:100])
    sample = {
        "url": url,
        "len": len(body),
        "title": clean(re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S).group(1))
        if re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
        else None,
        "h1": clean(re.search(r"<h1[^>]*>(.*?)</h1>", body, re.I | re.S).group(1))
        if re.search(r"<h1[^>]*>(.*?)</h1>", body, re.I | re.S)
        else None,
        "woo": "woocommerce" in body.lower(),
        "wp": "wp-content" in body.lower(),
        "shopify": "cdn.shopify.com" in body,
        "product_ld": {
            "name": product.get("name"),
            "brand": product.get("brand"),
            "sku": product.get("sku"),
            "desc": str(product.get("description") or "")[:300],
            "keys": list(product.keys())[:20],
        },
        "attrs": attrs[:20],
        "labeled": labeled[:20],
        "text_excerpt": text[:1200],
    }
    samples.append(sample)
    print("====", url)
    print(" h1:", sample["h1"])
    print(" woo/wp/shopify:", sample["woo"], sample["wp"], sample["shopify"])
    print(" attrs:", len(attrs))
    for a, b in attrs[:10]:
        print(f"  {a} => {b}")
    print(" labeled:", labeled[:8])
    print(" product name:", product.get("name"))

out = OUT / "_probe_cropking_dc_pdp.json"
out.write_text(json.dumps(samples, indent=2, ensure_ascii=False), encoding="utf-8")
print("wrote", out)
