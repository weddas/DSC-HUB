#!/usr/bin/env python3
"""Find Hytiva catalog size + parse one detail page richly."""
from __future__ import annotations

import html as html_lib
import json
import re
import urllib.request
from pathlib import Path

UA = {"User-Agent": "DSC-HUB-catalog-research/0.1 (+local research corpus)"}


def get(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strain_paths(html: str) -> set[str]:
    return set(re.findall(r"/strains/(?:hybrid|indica|sativa)/[a-z0-9\-]+", html, re.I))


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def binary_find_last_page(base: str, lo: int = 1, hi: int = 200) -> int:
    last_good = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        url = f"{base}?page={mid}" if "?" not in base else f"{base}&page={mid}"
        html = get(url)
        n = len(strain_paths(html))
        print(f"  probe {url} -> {n}")
        if n > 0:
            last_good = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return last_good


def main() -> None:
    print("Finding last pages...")
    last_all = binary_find_last_page("https://www.hytiva.com/strains", 1, 120)
    last_hyb = binary_find_last_page("https://www.hytiva.com/strains/hybrid", 1, 120)
    print("last_all", last_all, "last_hybrid", last_hyb)

    # Collect all from type pages (complete)
    all_links: set[str] = set()
    for typ, last in (("indica", 15), ("sativa", 12), ("hybrid", last_hyb or 80)):
        for p in range(1, last + 1):
            html = get(f"https://www.hytiva.com/strains/{typ}?page={p}")
            links = strain_paths(html)
            if not links:
                print(f"{typ} empty at {p}")
                break
            all_links |= links
            if p % 10 == 0:
                print(f"{typ} p{p} cum={len(all_links)}")
    print("TYPE TOTAL", len(all_links))

    # Detail blue-dream structure dump
    html = get("https://www.hytiva.com/strains/hybrid/blue-dream")
    text = clean(html)
    Path("homeassistant/data/_probe_hytiva_detail.txt").write_text(text[:5000], encoding="utf-8")
    # class names that look like field cards
    classes = sorted(set(re.findall(r'class=["\']([^"\']+)["\']', html)))
    interesting = [c for c in classes if re.search(r"strain|effect|flavor|terp|thc|cbd|lineage|chem|review|stat|card|spec", c, re.I)]
    Path("homeassistant/data/_probe_hytiva_classes.json").write_text(
        json.dumps({"last_all": last_all, "last_hybrid": last_hyb, "type_total": len(all_links), "interesting_classes": interesting[:80], "text_preview": text[:2000]}, indent=2),
        encoding="utf-8",
    )
    print("interesting classes", len(interesting))
    print(text[:1500])


if __name__ == "__main__":
    main()
