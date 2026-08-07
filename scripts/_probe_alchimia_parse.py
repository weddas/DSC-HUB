#!/usr/bin/env python3
"""Deep-parse Alchimia sample PDP for scraper field map."""
from __future__ import annotations

import html as H
import json
import re
from pathlib import Path

body = Path("homeassistant/data/_sample_alchimia_pdp.html").read_text(encoding="utf-8")


def clean(s: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", s or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", H.unescape(t)).strip()


# JSON-LD
for m in re.finditer(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    body,
    re.I | re.S,
):
    doc = json.loads(m.group(1))
    print("=== JSON-LD ===")
    print(json.dumps(doc, indent=2, ensure_ascii=False)[:2500])

# characteristics table
m = re.search(
    r'<table[^>]*class=["\'][^"\']*caracteristiques[^"\']*["\'][^>]*>(.*?)</table>',
    body,
    re.I | re.S,
)
if m:
    print("\n=== CARACTERISTIQUES TABLE ===")
    print(clean(m.group(1))[:2000])
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", m.group(1), re.I | re.S):
        cells = [clean(c) for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, re.I | re.S)]
        if len(cells) >= 2:
            print(f"  ROW: {cells[0]!r} => {cells[1]!r}")

# breadcrumbs
print("\n=== BREADCRUMBS ===")
for m in re.finditer(r'itemprop=["\']name["\'][^>]*>([^<]+)', body, re.I):
    print(" ", m.group(1).strip())
for m in re.finditer(r'class=["\'][^"\']*breadcrumb[^"\']*["\'][^>]*>(.*?)</(?:div|nav|ol|ul)>', body, re.I | re.S):
    print(" crumb block:", clean(m.group(1))[:300])
    break

# tags / categories links
print("\n=== TAG LINKS ===")
tags = re.findall(
    r'href=["\'](https://www\.alchimiaweb\.com/en/[^"\']+-tag-\d+/?)["\'][^>]*>([^<]+)',
    body,
    re.I,
)
for href, label in tags[:40]:
    print(f"  {clean(label)} -> {href}")

# brand
print("\n=== BRAND ===")
for pat in [
    r'itemprop=["\']brand["\'][^>]*>(.*?)</',
    r'class=["\'][^"\']*brand[^"\']*["\'][^>]*>(.*?)</',
    r'href=["\'][^"\']*breeders?[^"\']*["\'][^>]*>([^<]+)',
    r'by\s+([A-Z][A-Za-z0-9\'\-\s]+)',
]:
    m = re.search(pat, body, re.I | re.S)
    if m:
        print(pat[:40], "=>", clean(m.group(1))[:80])

# description block
print("\n=== DESC BLOCKS ===")
for pat in [
    r'id=["\']description["\'][^>]*>(.*?)</div>',
    r'class=["\'][^"\']*product-description[^"\']*["\'][^>]*>(.*?)</div>',
    r'itemprop=["\']description["\'][^>]*>(.*?)</div>',
]:
    m = re.search(pat, body, re.I | re.S)
    if m:
        print(pat[:50], clean(m.group(1))[:400])
