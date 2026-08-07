#!/usr/bin/env python3
"""Estimate Alchimia seed PDP count from sitemap slug heuristics + sample categories."""
from __future__ import annotations

import html as H
import json
import re
import ssl
import time
import urllib.request
from collections import Counter

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
CTX = ssl.create_default_context()
PDP_RE = re.compile(
    r"^https://www\.alchimiaweb\.com/en/([a-z0-9\-]+)-product-(\d+)\.php$",
    re.I,
)
SEEDISH = re.compile(
    r"(?:feminis(?:ed|zed)|autoflower(?:ing)?|(?:^|-)seeds?(?:-|$)|"
    r"(?:^|-)(?:auto|regular|cbd)(?:-|$)|photodependent|marijuana|cannabis)",
    re.I,
)
# Equipment / non-seed slug markers (avoid bare 'duct'/'hat'/etc).
MERCH = re.compile(
    r"(?:^|-)(?:grinder|shirt|hoodie|hat|cap|vapou?r|pipe|bong|tray|fertiliz|"
    r"nutrient|soil|lamp|tent|extractor|scissors|trimmer|rolling|closet|"
    r"substrate|coco|perlite|humic|insect|spray|book|dvd|merch|gift|promo|"
    r"accessory|watering|pump|timer|thermometer|hygrometer|rockwool|"
    r"mycorrhiza|trichoderma|pesticide|fungicide|insecticide|gloves|jar|"
    r"charcoal|reflector|ballast|muffler|filter|fan|ducting|led|hps|cmh|"
    r"panel|quantum|pot|netpot|pebble|phmeter|ecmeter|meter|kit|box|"
    r"chamber|growbox|grolab|cabinet|shelf|table|scissors|blade|razor|"
    r"paper|tips|lighter|ashtray|storage|container|baggie|vacuum|"
    r"microscope|loupe|trichome|missing)(?:-|$)",
    re.I,
)


def grab(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read().decode("utf-8", "replace")


def main() -> None:
    xml = grab("https://www.alchimiaweb.com/en/sitemap-products.xml")
    locs = [H.unescape(u.strip()).split("?")[0] for u in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)]
    pdps = []
    for u in locs:
        m = PDP_RE.match(u)
        if m:
            pdps.append((u, m.group(1), m.group(2)))
    print(f"pdp={len(pdps)}")

    seedish = [(u, s, i) for u, s, i in pdps if SEEDISH.search(s) and not MERCH.search(s)]
    merchish = [(u, s, i) for u, s, i in pdps if MERCH.search(s)]
    ambiguous = [(u, s, i) for u, s, i in pdps if not SEEDISH.search(s) and not MERCH.search(s)]
    print(f"seedish={len(seedish)} merchish={len(merchish)} ambiguous={len(ambiguous)}")
    print("ambiguous samples:", [u for u, _, _ in ambiguous[:15]])

    # sample categories from 8 seedish + 5 merch + 5 ambiguous
    samples = (
        [u for u, _, _ in seedish[:8]]
        + [u for u, _, _ in merchish[:5]]
        + [u for u, _, _ in ambiguous[:8]]
    )
    cats: Counter[str] = Counter()
    for url in samples:
        time.sleep(0.4)
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
        cat = "?"
        name = "?"
        if m:
            try:
                doc = json.loads(m.group(1))
                cat = str(doc.get("category") or "?")
                name = str(doc.get("name") or "?")
            except json.JSONDecodeError:
                pass
        cats[cat] += 1
        print(f"  [{cat}] {name[:60]} | {url.split('/')[-1]}")
    print("category counts among samples:", dict(cats))


if __name__ == "__main__":
    main()
