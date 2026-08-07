#!/usr/bin/env python3
"""Probe Seedsman USA sitemap + one PDP for scraper field mapping."""

from __future__ import annotations

import html as html_lib
import json
import re
import ssl
import urllib.request
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
SITEMAP = "https://www.seedsman.com/sitemaps/seedsman_usa_site_map_live.xml"
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
CTX = ssl.create_default_context()


def grab(url: str, n: int | None = None) -> tuple[int | None, str, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=120, context=CTX) as r:
            raw = r.read() if n is None else r.read(n)
            return r.status, r.geturl(), raw.decode("utf-8", "replace")
    except Exception as exc:  # noqa: BLE001
        return None, url, str(exc)


def main() -> None:
    code, final, body = grab(SITEMAP)
    print(f"sitemap http={code} final={final} bytes={len(body)}")
    locs = [
        html_lib.unescape(u.strip()).split("?")[0].split("#")[0].rstrip("/")
        for u in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body, re.I)
    ]
    print(f"locs={len(locs)}")

    prefixes: Counter[str] = Counter()
    pdp: list[str] = []
    for u in locs:
        parts = urlparse(u).path.strip("/").split("/")
        if len(parts) == 2 and parts[0] == "us-en":
            pdp.append(u)
            prefixes["__pdp__"] += 1
        elif len(parts) >= 2 and parts[0] == "us-en":
            prefixes[parts[1]] += 1
        else:
            prefixes["__other__"] += 1
    print("prefixes", prefixes.most_common(30))
    print("pdp_count", len(pdp))
    no_seed = [u for u in pdp if "seed" not in u.rsplit("/", 1)[-1].lower()]
    print("pdp_no_seed", len(no_seed))
    for u in no_seed[:15]:
        print(" ", u)

    # Probe a few PDPs
    samples = pdp[:3] + ([no_seed[0]] if no_seed else [])
    for url in samples:
        c, f, html = grab(url)
        print(f"\n=== PDP http={c} url={url} len={len(html)}")
        title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
        h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
        print("title:", re.sub(r"\s+", " ", html_lib.unescape(title_m.group(1))).strip()[:160] if title_m else None)
        print("h1:", re.sub(r"<[^>]+>", " ", h1_m.group(1) if h1_m else "")[:160])
        lds = re.findall(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html,
            re.I | re.S,
        )
        print("jsonld", len(lds))
        for i, raw in enumerate(lds[:2]):
            try:
                doc = json.loads(raw.strip())
                print(" ld", i, "type", doc.get("@type") if isinstance(doc, dict) else type(doc), str(doc)[:350])
            except json.JSONDecodeError:
                print(" ld", i, "parse_fail", raw[:200])
        for marker in (
            "__NEXT_DATA__",
            "window.__INITIAL_STATE__",
            "Magento_",
            '"sku"',
            "og:title",
            "product-info",
            "data-product",
            "flowering",
            "THC",
            "breeder",
        ):
            print(f"  marker {marker}: {marker in html or marker.lower() in html.lower()}")
        # meta property
        for prop in ("og:title", "og:description", "product:brand", "og:image"):
            m = re.search(rf'<meta[^>]+property=["\']{prop}["\'][^>]+content=["\']([^"\']+)', html, re.I)
            if not m:
                m = re.search(rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']{prop}', html, re.I)
            if m:
                print(f"  meta {prop}: {html_lib.unescape(m.group(1))[:180]}")

    # Save first PDP for offline parse
    if pdp:
        c, f, html = grab(pdp[0])
        out = DATA / "_seedsman_pdp_sample.html"
        out.write_text(html[:250_000], encoding="utf-8")
        print(f"\nwrote {out} ({min(len(html), 250_000)} chars of {len(html)})")


if __name__ == "__main__":
    main()
