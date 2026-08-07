#!/usr/bin/env python3
"""Probe CannaConnection detail + sitemap strain count."""
from __future__ import annotations

import gzip
import json
import re
import urllib.request
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
        },
    )
    with urllib.request.urlopen(req, timeout=90) as r:
        raw = r.read()
        enc = (r.headers.get("Content-Encoding") or "").lower()
        if enc == "gzip" or raw[:2] == b"\x1f\x8b":
            try:
                raw = gzip.decompress(raw)
            except OSError:
                pass
        print(f"GET {url} -> {r.status} bytes={len(raw)}")
        return raw


def fetch(url: str) -> str:
    return fetch_bytes(url).decode("utf-8", "replace")


def main() -> None:
    # sitemap
    xml = fetch("https://www.cannaconnection.com/6_en_0_sitemap.xml")
    locs = re.findall(r"<loc>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</loc>", xml, re.I | re.S)
    locs = [re.sub(r"<!\[CDATA\[|\]\]>", "", x).strip() for x in locs]
    print("sitemap locs", len(locs))
    strain_re = re.compile(
        r"^https://www\.cannaconnection\.com/strains/([a-z0-9\-]+)/?$",
        re.I,
    )
    skip = {"breeders", "breeders-list"}
    strains = []
    for u in locs:
        m = strain_re.match(u.split("?")[0].split("#")[0])
        if not m:
            continue
        slug = m.group(1).lower()
        if slug in skip:
            continue
        strains.append(u.rstrip("/"))
    strains = sorted(set(strains))
    print("strain urls", len(strains))
    print("sample", strains[:10])
    (DATA / "_cc_sitemap_strain_urls.json").write_text(
        json.dumps({"count": len(strains), "urls": strains}, indent=1),
        encoding="utf-8",
    )

    # also A-Z discover count
    letters = list("abcdefghijklmnopqrstuvwxyz") + ["0-9"]
    az: set[str] = set()
    for c in letters:
        html = fetch(f"https://www.cannaconnection.com/strains?show_char={c}")
        found = re.findall(
            r'href=["\'](https://www\.cannaconnection\.com/strains/[a-z0-9\-]+)/?["\']',
            html,
            re.I,
        )
        for u in found:
            slug = u.rstrip("/").rsplit("/", 1)[-1].lower()
            if slug in skip or slug == "strains":
                continue
            az.add(u.rstrip("/"))
        print(f"  letter {c}: +{len(found)} total={len(az)}")
    print("A-Z unique", len(az))
    only_sm = set(strains) - az
    only_az = az - set(strains)
    print("sitemap-only", len(only_sm), "az-only", len(only_az))

    # detail page
    url = strains[0] if strains else "https://www.cannaconnection.com/strains/ak-47"
    html = fetch(url)
    (DATA / "_cc_detail_sample.html").write_text(html, encoding="utf-8")
    print("detail", url, "len", len(html))
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
    print("h1 raw", (h1.group(1)[:200] if h1 else None))
    # feature / info blocks
    for pat in (
        r'class="[^"]*strain[^"]*"',
        r'id="[^"]*strain[^"]*"',
        r"feature-name",
        r"features_block",
        r"pb-center-column",
        r"product_features",
        r"data-sheet",
        r"thc",
        r"flowering",
    ):
        print(f"  matches {pat!r}: {len(re.findall(pat, html, re.I))}")
    # table rows / dl
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.I | re.S)
    print("tr count", len(rows))
    for row in rows[:40]:
        cells = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.I | re.S)
        cells = [re.sub(r"<[^>]+>", " ", c) for c in cells]
        cells = [" ".join(c.split()) for c in cells]
        if any(cells):
            print("  ROW", cells)
    # look for description sections
    for m in re.finditer(r"<h2[^>]*>(.*?)</h2>", html, re.I | re.S):
        title = re.sub(r"<[^>]+>", " ", m.group(1))
        title = " ".join(title.split())
        if title:
            print("H2:", title[:120])


if __name__ == "__main__":
    main()
