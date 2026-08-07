#!/usr/bin/env python3
"""Probe Alchimia PDP HTML + sitemap seed filter counts."""
from __future__ import annotations

import html as H
import json
import re
import ssl
import urllib.request
from collections import Counter
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
CTX = ssl.create_default_context()
DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"


def grab(url: str, limit: int = 2_000_000) -> tuple[str, str]:
    req = urllib.request.Request(url, headers={**UA, "Accept": "text/html,application/xml,*/*"})
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        body = r.read(limit).decode("utf-8", "replace")
        return r.geturl(), body


def clean(s: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", s or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", H.unescape(t)).strip()


def main() -> None:
    sm_url = "https://www.alchimiaweb.com/en/sitemap-products.xml"
    _, xml = grab(sm_url)
    locs = [H.unescape(u.strip()) for u in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml, re.I)]
    pdp_re = re.compile(r"^https://www\.alchimiaweb\.com/en/[a-z0-9\-]+-product-\d+\.php$", re.I)
    html_re = re.compile(r"-\d+\.html$", re.I)
    pdp = [u for u in locs if pdp_re.match(u.split("?")[0])]
    htmlish = [u for u in locs if html_re.search(u)]
    print(f"sitemap locs={len(locs)} pdp_php={len(pdp)} html={len(htmlish)}")

    SEED = re.compile(
        r"(?:seed|feminis|autoflower|auto-|regular|photoperiod|cbd|indica|sativa|hybrid)",
        re.I,
    )
    MERCH = re.compile(
        r"(?:grinder|shirt|hoodie|hat|vapou?r|pipe|bong|tray|fertiliz|nutrient|soil|"
        r"light|lamp|tent|filter|extractor|scissors|trimmer|paper|rolling|grow-box|"
        r"closet|substrate|coco|perlite|humic|insect|trap|spray|book|dvd|merch|gift|"
        r"promo|accessory|watering|pump|timer|ph-meter|ec-meter|thermometer|"
        r"hygrometer|net[- ]?pot|rockwool|clay[- ]?pebble|mycorrhiza|trichoderma|"
        r"pesticide|fungicide|insecticide|sticky|gloves|jar|container|bag|"
        r"carbon[- ]?filter|odour|odor|charcoal|inline[- ]?fan|duct|reflector|"
        r"ballast|hid|hps|cmh|led[- ]?panel|quantum|bar[- ]?light)",
        re.I,
    )
    seedish = [u for u in pdp if SEED.search(u) and not MERCH.search(u)]
    print(f"seedish_slug_filter={len(seedish)}")

    # token histogram from slug before -product-N
    toks: Counter[str] = Counter()
    for u in pdp:
        m = re.search(r"/en/(.+)-product-\d+\.php$", u, re.I)
        if not m:
            continue
        for t in m.group(1).split("-"):
            if len(t) > 2:
                toks[t.lower()] += 1
    print("top slug tokens:", toks.most_common(40))

    sample = pdp[0]
    final, body = grab(sample)
    print(f"sample {sample} -> {final} len={len(body)}")
    (DATA / "_sample_alchimia_pdp.html").write_text(body, encoding="utf-8")

    for label, pat in [
        ("h1", r"<h1[^>]*>(.*?)</h1>"),
        ("title", r"<title[^>]*>(.*?)</title>"),
        ("og:title", r'property=["\']og:title["\'][^>]+content=["\']([^"\']+)'),
        ("og:desc", r'property=["\']og:description["\'][^>]+content=["\']([^"\']+)'),
    ]:
        m = re.search(pat, body, re.I | re.S)
        if m:
            print(f"  {label}: {clean(m.group(1))[:160]}")

    lds = re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        body,
        re.I | re.S,
    )
    print(f"  jsonld blocks={len(lds)}")
    for raw in lds[:2]:
        try:
            doc = json.loads(raw)
            print("  ld keys", list(doc.keys())[:12] if isinstance(doc, dict) else type(doc))
            print("  ld sample", json.dumps(doc, ensure_ascii=False)[:500])
        except json.JSONDecodeError:
            print("  ld parse fail", raw[:200])

    # look for data sheets / tables / features
    interesting = []
    for m in re.finditer(
        r'class=["\']([^"\']*(?:ficha|caracter|attribute|spec|feature|datasheet|'
        r"product-info|product_details|info-product|propiedades)[^\"']*)[\"']",
        body,
        re.I,
    ):
        interesting.append(m.group(1)[:120])
    print("  interesting classes:", interesting[:20])

    # dt/dd or table rows near genetics
    for kw in ["Genetics", "THC", "CBD", "Flowering", "Yield", "Breeder", "Type", "Sativa", "Indica"]:
        idx = body.lower().find(kw.lower())
        if idx >= 0:
            snippet = clean(body[max(0, idx - 40) : idx + 120])
            print(f"  near {kw}: {snippet[:140]}")

    # try a second non-seedish looking product if any
    nonseed = [u for u in pdp if not SEED.search(u)][:3]
    print("nonseed samples:", nonseed)
    if nonseed:
        _, body2 = grab(nonseed[0])
        print("nonseed title:", clean(re.search(r"<title[^>]*>(.*?)</title>", body2, re.I | re.S).group(1))[:160])


if __name__ == "__main__":
    main()
