#!/usr/bin/env python3
"""One-shot Hytiva detail field probe (PowerShell-safe)."""
from __future__ import annotations

import html as html_lib
import json
import re
import urllib.request
from pathlib import Path

UA = {"User-Agent": "DSC-HUB-catalog-research/0.1"}
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_probe_hytiva_detail.json"


def main() -> None:
    url = "https://www.hytiva.com/strains/hybrid/blue-dream"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        page = resp.read().decode("utf-8", errors="replace")

    lds = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        page,
        re.I | re.S,
    )
    docs = []
    for raw in lds:
        try:
            docs.append(json.loads(raw))
        except json.JSONDecodeError:
            docs.append({"_raw": raw[:500]})

    text = re.sub(r"(?is)<script.*?</script>", " ", page)
    text = re.sub(r"(?is)<style.*?</style>", " ", text)
    text = re.sub(r"(?is)<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", html_lib.unescape(text)).strip()

    payload = {
        "url": url,
        "bytes": len(page),
        "title": (re.search(r"<title>(.*?)</title>", page, re.I | re.S) or [None, ""])[1],
        "meta_desc": (re.search(r'<meta name="description" content="([^"]+)"', page, re.I) or [None, ""])[1],
        "og_title": (re.search(r'<meta property="og:title" content="([^"]+)"', page, re.I) or [None, ""])[1],
        "h1": re.findall(r"<h1[^>]*>(.*?)</h1>", page, re.I | re.S)[:3],
        "ld": docs,
        "effects": sorted(set(re.findall(r"effects=([a-zA-Z]+)", page))),
        "flavors": sorted(set(re.findall(r"flavors=([a-zA-Z]+)", page))),
        "pairs": sorted(set(re.findall(r"pairsWellWith=([a-zA-Z]+)", page))),
        "related": sorted(set(re.findall(r"/strains/(?:hybrid|indica|sativa)/([a-z0-9\-]+)", page))),
        "text_preview": text[:2500],
    }
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print("wrote", OUT, "bytes", len(page), "effects", len(payload["effects"]))


if __name__ == "__main__":
    main()
