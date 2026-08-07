#!/usr/bin/env python3
from pathlib import Path
import re

CACHE = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"


def sniff(name: str) -> None:
    p = CACHE / name
    if not p.exists():
        print("missing", name)
        return
    t = p.read_text(encoding="utf-8", errors="replace")
    print("===", name, "bytes", len(t))
    m = re.search(r"<title>([^<]+)", t)
    print("title", (m.group(1) if m else "")[:120])
    print("login?", bool(re.search(r"medauth|Sign in to|login to view|age.?gate", t, re.I)))
    print("prices", re.findall(r"\$[\d,.]+", t)[:15])
    print("thc", re.findall(r"THC[^<\n]{0,40}", t, re.I)[:8])
    print("cbd", re.findall(r"CBD[^<\n]{0,40}", t, re.I)[:8])
    print("review_word", len(re.findall(r"review", t, re.I)))
    print("product_hrefs", len(set(re.findall(r"/product/[a-z0-9\-]+", t))))
    print("brand_hrefs", len(set(re.findall(r"/cannabis-brands-australia/[a-z0-9\-]+", t))))
    for jm in re.finditer(r"<script[^>]*ld\+json[^>]*>(.*?)</script>", t, re.I | re.S):
        print("JSONLD", jm.group(1)[:500])
    wi = re.search(r'wire:initial-data="([^"]+)"', t)
    print("wire", bool(wi), "len", len(wi.group(1)) if wi else 0)
    # look for table headers / csv-ish
    print("table", len(re.findall(r"<table", t, re.I)))
    # meta description
    md = re.search(r'name="description"\s+content="([^"]+)"', t, re.I)
    if md:
        print("desc", md.group(1)[:200])


for n in [
    "product_sample.html",
    "product_list.html",
    "brands.html",
    "brand_sample.html",
    "pharmacies.html",
    "reviews.html",
    "products.html",
]:
    sniff(n)
    print()
