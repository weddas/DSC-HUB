#!/usr/bin/env python3
"""Quick fetch full sitemap + product-catalog.csv head check."""
from __future__ import annotations

import ssl
import urllib.request
from pathlib import Path
from urllib.error import HTTPError

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
CTX = ssl.create_default_context()
CACHE = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"
CACHE.mkdir(parents=True, exist_ok=True)


def fetch(url: str) -> tuple[int, bytes, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=180, context=CTX) as r:
            return getattr(r, "status", 200), r.read(), r.headers.get("Content-Type", "")
    except HTTPError as e:
        return e.code, e.read(), ""


for url, name in [
    ("https://cannareviews.health/sitemap.xml", "sitemap_full.xml"),
    ("https://cannareviews.health/download/product-catalog.csv", "product-catalog.csv"),
]:
    st, body, ctype = fetch(url)
    print(name, st, ctype, len(body), body[:150])
    if st == 200:
        (CACHE / name).write_bytes(body)
        print("saved", CACHE / name)
