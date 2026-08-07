#!/usr/bin/env python3
"""Scrape CannaReviews product LIST pages (works while /product/* is 429)."""
from __future__ import annotations

import html as htmlmod
import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path
from urllib.error import HTTPError

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
CACHE = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"
CACHE.mkdir(parents=True, exist_ok=True)
LIST = "https://cannareviews.health/products/legal-cannabis-product-list-australia"


def fetch(url: str, maxb: int | None = None) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    try:
        with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
            return getattr(r, "status", 200), (r.read() if maxb is None else r.read(maxb))
    except HTTPError as e:
        return e.code, e.read(maxb or 5000)


def parse_list(html: str) -> dict:
    text = html
    hrefs = sorted(set(re.findall(r"/product/[a-z0-9\-]+", text)))
    # table rows often have product name + brand + thc/cbd
    rows = []
    # try data attributes
    for m in re.finditer(r'data-product[^=]*="([^"]+)"', text, re.I):
        rows.append({"data_product": htmlmod.unescape(m.group(1))})
    # alpine / livewire
    wire = re.search(r'wire:initial-data="([^"]+)"', text)
    wire_data = None
    if wire:
        try:
            wire_data = json.loads(htmlmod.unescape(wire.group(1)))
        except Exception:
            pass
    # pagination links
    pages = sorted(set(re.findall(r'legal-cannabis-product-list-australia[^"\']*[?&]page=(\d+)', text)))
    pages2 = sorted(set(re.findall(r'[?&]page=(\d+)', text)))
    # visible product name spans
    names = re.findall(r'class="[^"]*truncate-product[^"]*"[^>]*>([^<]+)', text)
    brands = re.findall(r'href="/cannabis-brands-australia/([^"]+)"', text)
    prices = re.findall(r"\$\s*(\d+(?:\.\d+)?)", text)
    return {
        "hrefs": hrefs,
        "href_count": len(hrefs),
        "names_sample": [htmlmod.unescape(n).strip() for n in names[:30]],
        "name_count": len(names),
        "brands_sample": brands[:20],
        "brand_count": len(set(brands)),
        "prices_sample": prices[:20],
        "page_params": pages or pages2[:20],
        "wire_keys": list(((wire_data or {}).get("serverMemo") or {}).get("data") or {}).keys()
        if wire_data
        else [],
        "wire_data": ((wire_data or {}).get("serverMemo") or {}).get("data") if wire_data else None,
        "bytes": len(text),
    }


def main() -> None:
    # fetch full list page (uncapped)
    st, body = fetch(LIST)
    print("list", st, len(body))
    if st != 200:
        return
    (CACHE / "product_list_full.html").write_bytes(body)
    html = body.decode("utf-8", "replace")
    info = parse_list(html)
    # don't dump huge wire into report
    wire = info.pop("wire_data", None)
    print(json.dumps({k: v for k, v in info.items() if k != "wire_data"}, indent=2, default=str)[:2000])
    if wire:
        (CACHE / "product_list_wire.json").write_text(json.dumps(wire, indent=2, default=str)[:2_000_000], encoding="utf-8")
        print("wire data keys", list(wire.keys())[:40])
        for k, v in wire.items():
            if isinstance(v, list):
                print(f"  {k}: list[{len(v)}]")
                if v and isinstance(v[0], dict):
                    print("   item0 keys", list(v[0].keys())[:30])
            elif isinstance(v, dict):
                print(f"  {k}: dict keys={list(v.keys())[:20]}")
            else:
                print(f"  {k}: {v!r}"[:120])

    # try page=2..N
    all_hrefs = set(info["hrefs"])
    for page in range(2, 40):
        url = f"{LIST}?page={page}"
        st, body = fetch(url)
        print("page", page, st, len(body))
        if st != 200 or len(body) < 1000:
            break
        hrefs = set(re.findall(r"/product/[a-z0-9\-]+", body.decode("utf-8", "replace")))
        new = hrefs - all_hrefs
        print("  hrefs", len(hrefs), "new", len(new))
        if not new:
            break
        all_hrefs |= hrefs
        time.sleep(0.5)
    print("TOTAL unique product hrefs from list pages", len(all_hrefs))
    (CACHE / "list_product_hrefs.json").write_text(
        json.dumps(sorted(all_hrefs), indent=2), encoding="utf-8"
    )

    # brand index links
    st, body = fetch("https://cannareviews.health/cannabis-brands-australia")
    brands = sorted(set(re.findall(r"/cannabis-brands-australia/[a-z0-9\-]+", body.decode("utf-8", "replace"))))
    print("brand index links", len(brands))
    (CACHE / "brand_index_hrefs.json").write_text(json.dumps(brands, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
