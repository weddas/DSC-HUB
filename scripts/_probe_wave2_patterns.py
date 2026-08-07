#!/usr/bin/env python3
"""Deeper Wave 2 product-URL pattern probe."""
from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import polite_get  # noqa: E402


def locs(body: str) -> list[str]:
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body or "", re.I)


def path_bucket(url: str) -> str:
    p = urlparse(url).path.strip("/")
    parts = p.split("/") if p else []
    if not parts:
        return "(root)"
    if len(parts) == 1:
        return f"/{parts[0]}/…" if False else f"1seg:{parts[0][:40]}"
    return f"{len(parts)}seg:/{parts[0]}/…/{parts[-1][:40]}"


def summarize(name: str, urls: list[str], n: int = 12) -> None:
    print(f"=== {name} count={len(urls)}")
    c = Counter(path_bucket(u) for u in urls)
    for k, v in c.most_common(15):
        print(f"  {v:5d}  {k}")
    print("  samples:")
    for u in urls[:n]:
        print(f"    {u}")
    print()


def main() -> None:
    # Greenhouse shop
    gh = locs(polite_get("https://shop.greenhouseseeds.nl/sitemap.xml", delay=0.3))
    seedish = [
        u
        for u in gh
        if re.search(r"seed|feminis|auto|strain|cannabis", u, re.I)
        and not re.search(r"/category/|/blog/|/page/|/index\.php", u, re.I)
    ]
    summarize("greenhouse_all", gh)
    summarize("greenhouse_seedish", seedish)

    # Fastbuds — filter product-like
    fb = locs(polite_get("https://fastbuds.com/sitemap.xml", delay=0.4, timeout=120))
    fb_en = [u for u in fb if "fastbuds.com/" in u and "/de/" not in u and "/es/" not in u and "/fr/" not in u and "/it/" not in u and "/pt/" not in u]
    fb_prod = [u for u in fb_en if re.search(r"/seeds?/|/product|/autoflower|/strain", u, re.I)]
    summarize("fastbuds_enish", fb_en[:5000] if len(fb_en) > 5000 else fb_en)
    # path prefixes
    pref = Counter()
    for u in fb_en:
        parts = urlparse(u).path.strip("/").split("/")
        if parts:
            pref[parts[0]] += 1
    print("fastbuds top path[0]:", pref.most_common(20))
    summarize("fastbuds_prodish", fb_prod)

    # Barneys com sitemap
    bc = locs(polite_get("https://www.barneysfarm.com/sitemap-com.xml", delay=0.4, timeout=120))
    summarize("barneys_com", bc)
    pref2 = Counter()
    for u in bc:
        parts = urlparse(u).path.strip("/").split("/")
        if parts:
            pref2[parts[0]] += 1
    print("barneys top path[0]:", pref2.most_common(25))

    # Mephisto product sitemap
    ms = polite_get("https://mephistogenetics.com/sitemap.xml", delay=0.3)
    child = locs(ms)
    print("mephisto children", child)
    for sm in child:
        if "product" in sm:
            mu = locs(polite_get(sm, delay=0.35, timeout=90))
            summarize(f"mephisto_{sm.split('/')[-1]}", mu)

    # Dutch passion — find sitemap from robots
    robots = polite_get("https://dutch-passion.com/robots.txt", delay=0.3)
    sms = re.findall(r"(?i)sitemap:\s*(\S+)", robots)
    print("dutch sitemaps from robots:", sms)
    for sm in sms[:5]:
        try:
            body = polite_get(sm, delay=0.35, timeout=90)
            lu = locs(body)
            summarize(f"dutch_{sm.split('/')[-1]}", lu[:3000] if len(lu) > 3000 else lu)
            pref3 = Counter()
            for u in lu:
                parts = urlparse(u).path.strip("/").split("/")
                if parts:
                    pref3[parts[0] if parts[0] not in {"en", "nl", "de", "fr", "es"} else (parts[1] if len(parts) > 1 else parts[0])] += 1
            print("  path buckets:", pref3.most_common(20))
        except Exception as exc:  # noqa: BLE001
            print("dutch fail", sm, exc)

    # DNA product sitemap
    dna_idx = locs(polite_get("https://dnagenetics.com/sitemap.xml", delay=0.3))
    print("dna children", dna_idx)
    for sm in dna_idx:
        if "product" in sm:
            du = locs(polite_get(sm, delay=0.35, timeout=90))
            summarize("dna_products", du)


if __name__ == "__main__":
    main()
