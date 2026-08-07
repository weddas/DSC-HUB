#!/usr/bin/env python3
"""Check Alchimia sitemap index + sample more categories for seed fraction."""
from __future__ import annotations

import html as H
import json
import re
import ssl
import time
import urllib.request
from collections import Counter

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"}
CTX = ssl.create_default_context()
PDP_RE = re.compile(
    r"^https://www\.alchimiaweb\.com/en/([a-z0-9\-]+)-product-(\d+)\.php$",
    re.I,
)


def grab(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read().decode("utf-8", "replace")


def main() -> None:
    for url in [
        "https://www.alchimiaweb.com/en/sitemap-index.xml",
        "https://www.alchimiaweb.com/sitemap-index.xml",
    ]:
        try:
            body = grab(url)
        except Exception as exc:  # noqa: BLE001
            print(url, "FAIL", exc)
            continue
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body, re.I)
        print(url, "locs", len(locs))
        for u in locs:
            print(" ", H.unescape(u.strip()))

    xml = grab("https://www.alchimiaweb.com/en/sitemap-products.xml")
    locs = [H.unescape(u.strip()).split("?")[0] for u in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)]
    pdps = [u for u in locs if PDP_RE.match(u)]
    # stratified sample by product id ranges
    by_id = []
    for u in pdps:
        m = PDP_RE.match(u)
        by_id.append((int(m.group(2)), u))
    by_id.sort()
    # sample every Nth
    step = max(1, len(by_id) // 40)
    sample = [u for _, u in by_id[::step][:40]]
    cats: Counter[str] = Counter()
    for url in sample:
        time.sleep(0.35)
        try:
            html = grab(url)
        except Exception as exc:  # noqa: BLE001
            print("fail", url, exc)
            continue
        m = re.search(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html,
            re.I | re.S,
        )
        cat = name = "?"
        if m:
            try:
                doc = json.loads(m.group(1))
                cat = str(doc.get("category") or "?")
                name = str(doc.get("name") or "?")[:50]
            except json.JSONDecodeError:
                pass
        cats[cat] += 1
        print(f"[{cat}] {name}")
    print("TOTAL sample cats:", dict(cats))
    # rough estimate
    total = len(pdps)
    seed_n = cats.get("Cannabis seeds", 0)
    print(f"estimate seeds ~ {seed_n / max(1, sum(cats.values())) * total:.0f} of {total}")


if __name__ == "__main__":
    main()
