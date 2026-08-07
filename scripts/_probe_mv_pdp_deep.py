#!/usr/bin/env python3
"""Deeper Multiverse PDP field probe (full HTML)."""

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
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_probe_mv_pdp_deep.json"
URL = "https://multiversebeans.com/product/in-house-genetics-platinum-float-strain-fem-photo/"


def grab(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read().decode("utf-8", "replace")


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", t)
    t = re.sub(r"(?is)<noscript\b[^>]*>.*?</noscript>", " ", t)
    t = re.sub(r"(?is)<!--.*?-->", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def main() -> int:
    html = grab(URL)
    Path(OUT.parent / "_probe_mv_sample.html").write_text(html, encoding="utf-8")

    meta = {}
    for prop in ("og:title", "og:description", "og:url", "product:brand", "product:price:amount"):
        m = re.search(
            rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop)}["\'][^>]+content=["\']([^"\']+)',
            html,
            re.I,
        ) or re.search(
            rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{re.escape(prop)}["\']',
            html,
            re.I,
        )
        if m:
            meta[prop] = html_lib.unescape(m.group(1))

    title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)

    # Woo product JSON often in script type application/json or wc settings
    json_blobs = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/(?:ld\+)?json["\'][^>]*>(.*?)</script>',
        html,
        re.I | re.S,
    ):
        raw = m.group(1).strip()
        try:
            doc = json.loads(raw)
            json_blobs.append({"type": "ld+json", "keys": list(doc.keys()) if isinstance(doc, dict) else type(doc).__name__, "snip": str(doc)[:400]})
        except Exception:
            json_blobs.append({"type": "ld+json", "raw_snip": raw[:200]})

    # look for product data in wp / woo
    markers = {}
    for pat in [
        r'"@type"\s*:\s*"Product"',
        r"product_cat-",
        r"posted_in",
        r"sku",
        r"Breeder",
        r"THC",
        r"Flowering",
        r"data-product_id",
        r"woocommerce-product-details__short-description",
        r"entry-summary",
        r"product_title",
        r"wp-block-post-title",
    ]:
        markers[pat] = bool(re.search(pat, html, re.I))

    # short description block
    short = None
    m = re.search(
        r'class=["\'][^"\']*woocommerce-product-details__short-description[^"\']*["\'][^>]*>(.*?)</div>',
        html,
        re.I | re.S,
    )
    if m:
        short = clean(m.group(1))[:800]

    # categories
    cats = re.findall(
        r'rel=["\']tag["\'][^>]*>([^<]+)<|product_cat[^"\']*["\'][^>]*>([^<]+)<',
        html,
        re.I,
    )
    cat_labels = [clean(a or b) for a, b in cats if (a or b)]

    # product id
    pid = None
    m = re.search(r'data-product_id=["\'](\d+)', html, re.I) or re.search(
        r'"product_id"\s*:\s*(\d+)', html
    )
    if m:
        pid = m.group(1)

    # title from product_title class
    pt = re.search(
        r'class=["\'][^"\']*product_title[^"\']*["\'][^>]*>(.*?)</',
        html,
        re.I | re.S,
    )

    text = clean(html)
    report = {
        "url": URL,
        "html_len": len(html),
        "title": clean(title_m.group(1)) if title_m else None,
        "h1": clean(h1_m.group(1)) if h1_m else None,
        "product_title": clean(pt.group(1)) if pt else None,
        "meta": meta,
        "product_id": pid,
        "short_description": short,
        "category_labels": cat_labels[:30],
        "markers": markers,
        "json_blobs": json_blobs[:10],
        "text_head": text[:1200],
        "has_thc_in_text": bool(re.search(r"\bTHC\b", text, re.I)),
        "grow_snip": None,
    }
    for kw in ("THC", "CBD", "Flower", "Yield", "Indica", "Sativa", "Genetics", "Breeder"):
        m = re.search(rf".{{0,40}}{kw}.{{0,80}}", text, re.I)
        if m:
            report.setdefault("kw_snips", {})[kw] = m.group(0)

    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({k: report[k] for k in (
        "html_len", "title", "h1", "product_title", "meta", "product_id",
        "short_description", "category_labels", "markers", "has_thc_in_text"
    ) if k in report}, indent=2))
    print("kw_snips", report.get("kw_snips"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
