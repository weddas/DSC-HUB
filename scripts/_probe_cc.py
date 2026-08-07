#!/usr/bin/env python3
"""Probe CannaConnection listing + detail HTML structure."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml"},
    )
    with urllib.request.urlopen(req, timeout=45) as r:
        print(f"GET {url} -> {r.status} {r.geturl()} len={r.length}")
        return r.read().decode("utf-8", "replace")


def main() -> None:
    body = fetch("https://www.cannaconnection.com/strains")
    (DATA / "_cc_list_sample.html").write_text(body, encoding="utf-8")
    print("list len", len(body))

    rel = sorted(set(re.findall(r'href=["\'](/strains/[a-z0-9\-]+)["\']', body, re.I)))
    print("rel strain links", len(rel))
    print(rel[:25])

    # filter out /strains alone and list helpers
    detail = [u for u in rel if u.count("/") == 2 and u != "/strains"]
    print("detail-like", len(detail), detail[:15])

    chars = sorted(set(re.findall(r"show_char=([a-z0-9%]+)", body, re.I)))
    print("show_char", chars)

    pages = sorted(set(re.findall(r"strains\?[^\"']*page=(\d+)", body, re.I)))
    print("page nums", pages[:30])

    # other list patterns
    for pat in (
        "show_char",
        "strain-item",
        "strain_item",
        "strain-list",
        "letter-",
        "alphabet",
        "pagination",
        "data-strain",
        "breeder",
    ):
        print(f"  contains {pat!r}: {pat.lower() in body.lower()}")

    # try letter A
    a = fetch("https://www.cannaconnection.com/strains?show_char=a")
    (DATA / "_cc_list_a_sample.html").write_text(a, encoding="utf-8")
    rel_a = sorted(set(re.findall(r'href=["\'](/strains/[a-z0-9\-]+)["\']', a, re.I)))
    print("letter A links", len(rel_a), rel_a[:20])

    # try sitemap
    for sm in (
        "https://www.cannaconnection.com/sitemap.xml",
        "https://www.cannaconnection.com/sitemap_index.xml",
        "https://www.cannaconnection.com/robots.txt",
    ):
        try:
            txt = fetch(sm)
            print(sm, "bytes", len(txt), "preview", txt[:400].replace("\n", " "))
            (DATA / f"_cc_{Path(sm).name.replace('.', '_')}").write_text(txt, encoding="utf-8")
        except Exception as exc:
            print(sm, "ERR", exc)

    if detail:
        slug = detail[0]
        durl = "https://www.cannaconnection.com" + slug
        detail_html = fetch(durl)
        (DATA / "_cc_detail_sample.html").write_text(detail_html, encoding="utf-8")
        print("detail len", len(detail_html), durl)
        # json-ld
        jlds = re.findall(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            detail_html,
            re.I | re.S,
        )
        print("json-ld blocks", len(jlds))
        for i, j in enumerate(jlds[:3]):
            print(f"  ld[{i}]", j[:300].replace("\n", " "))
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", detail_html, re.I | re.S)
        print("h1", re.sub(r"<[^>]+>", "", h1.group(1)) if h1 else None)
        # look for grow/chem labels
        for label in (
            "THC",
            "CBD",
            "Flowering",
            "Yield",
            "Genetics",
            "Breeder",
            "Terpene",
            "Effects",
            "Flavor",
            "Indoor",
            "Outdoor",
            "Height",
            "Grow",
        ):
            if label.lower() in detail_html.lower():
                print(f"  has {label}")

    # discover all letters quickly
    all_links: set[str] = set()
    for c in "abcdefghijklmnopqrstuvwxyz":
        try:
            html = fetch(f"https://www.cannaconnection.com/strains?show_char={c}")
        except Exception as exc:
            print("letter", c, "ERR", exc)
            continue
        found = set(re.findall(r'href=["\'](/strains/[a-z0-9\-]+)["\']', html, re.I))
        found = {u for u in found if u.count("/") == 2}
        print(f"  letter {c}: {len(found)}")
        all_links |= found
    print("TOTAL unique detail links from A-Z", len(all_links))
    (DATA / "_cc_discovered_urls.json").write_text(
        json.dumps({"count": len(all_links), "urls": sorted(all_links)}, indent=1),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
