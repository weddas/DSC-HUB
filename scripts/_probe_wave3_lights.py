#!/usr/bin/env python3
"""One-shot probe for Wave 3 light manufacturer feeds."""
from __future__ import annotations

import json
import re
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 DSC-HUB-catalog-research/0.1", "Accept": "*/*"}


def get(url: str, n: int = 3_000_000) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(n).decode("utf-8", errors="replace")


def main() -> None:
    for base in [
        "https://treegers.com",
        "https://growkings.com.au",
        "https://www.growkings.com.au",
    ]:
        try:
            j = json.loads(get(base + "/products.json?limit=250"))
            products = j.get("products") or []
            print(base, "products", len(products), [p.get("title", "")[:40] for p in products[:5]])
        except Exception as e:
            print("FAIL products", base, e)
        try:
            t = get(base + "/sitemap_products_1.xml")
            locs = re.findall(r"<loc>(.*?)</loc>", t)
            print(base, "sitemap1 locs", len(locs))
        except Exception as e:
            print("FAIL sm", base, e)

    for u in [
        "https://digilumen.com.au/",
        "https://digilumen.com.au/shop/",
        "https://digilumen.com.au/collections/all",
        "https://digilumen.com.au/products.json",
        "https://digilumen.com.au/wp-sitemap-posts-product-1.xml",
    ]:
        try:
            t = get(u, 200_000)
            print(
                "OK",
                u,
                "len",
                len(t),
                "woo" if "woocommerce" in t.lower() else "",
                "shopify" if "cdn.shopify" in t.lower() else "",
            )
        except Exception as e:
            print("FAIL", u, e)

    html = get("https://www.spider-farmer.com/products/sf-1000-led-grow-light/")
    imgs = re.findall(r"https?://[^\"']+\.(?:jpg|jpeg|png|webp|pdf)", html, re.I)
    ppfd = [i for i in set(imgs) if re.search(r"ppfd|spectrum|par[\s_-]?map", i, re.I)]
    print("SF1000 imgs", len(set(imgs)), "ppfdish", len(ppfd))
    for x in ppfd[:8]:
        print(" ", x[:140])


if __name__ == "__main__":
    main()
