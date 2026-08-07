#!/usr/bin/env python3
"""Quick peek: sensi / sweet / raw product surfaces."""
import json
import re
import ssl
import urllib.request

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}
CTX = ssl.create_default_context()


def get(url: str, max_bytes: int = 200_000) -> tuple[int, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=25) as r:
            return r.status, r.read(max_bytes).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        body = e.read(max_bytes).decode("utf-8", "replace") if e.fp else ""
        return e.code, body


import urllib.error

urls = [
    "https://sensiseeds.com/en/cannabis-seeds",
    "https://sensiseeds.com/en/feminized-seeds",
    "https://sensiseeds.com/media/sitemap/sitemap.xml",
    "https://www.sweetseeds.com/en/sitemap.xml",
    "https://www.sweetseeds.com/sitemap.xml",
    "https://www.sweetseeds.es/sitemap.xml",
    "https://rawgenetics.com/products.json",
    "https://solfiregardens.com/products.json",
    "https://solfiregardens.com/product-sitemap.xml",
    "https://www.somaseeds.nl/sitemap.xml",
    "https://quebeccannabisseeds.com/sitemap.xml",
]
for u in urls:
    code, body = get(u)
    locs = re.findall(r"<loc>([^<]+)</loc>", body, re.I) if body else []
    print(f"{code} {u} bytes={len(body)} locs={len(locs)} head={body[:80]!r}")
