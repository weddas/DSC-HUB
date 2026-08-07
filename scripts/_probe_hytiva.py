#!/usr/bin/env python3
"""Quick Hytiva HTML discovery probe."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

UA = {"User-Agent": "DSC-HUB-catalog-research/0.1 (+local research corpus)"}
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_probe_hytiva.json"


def get(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strain_links(html: str) -> list[str]:
    return sorted(
        set(re.findall(r"/strains/(?:hybrid|indica|sativa)/[a-z0-9\-]+", html, re.I))
    )


def main() -> None:
    results: dict = {}
    urls = [
        "https://www.hytiva.com/strains",
        "https://www.hytiva.com/strains?page=2",
        "https://www.hytiva.com/strains?page=3",
        "https://www.hytiva.com/strains/hybrid",
        "https://www.hytiva.com/strains/indica",
        "https://www.hytiva.com/strains/sativa",
        "https://www.hytiva.com/strains/explore",
        "https://www.hytiva.com/strains/hybrid?page=2",
        "https://www.hytiva.com/sitemap.xml",
        "https://www.hytiva.com/sitemap_index.xml",
        "https://www.hytiva.com/strains/hybrid/blue-dream",
    ]
    for u in urls:
        try:
            html = get(u)
            sl = strain_links(html)
            locs = re.findall(r"<loc>([^<]+)</loc>", html)
            page_hrefs = sorted(
                set(re.findall(r'href=["\']([^"\']*(?:page|start|offset|p=)[^"\']*)["\']', html, re.I))
            )[:40]
            ld = re.findall(
                r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                html,
                re.I | re.S,
            )
            # look for embedded JSON state
            state_hints = []
            for pat in (
                r"window\.__[A-Z_]+__\s*=",
                r'"strains"\s*:',
                r'"totalCount"\s*:',
                r'"total"\s*:\s*\d+',
                r'data-total',
                r'"pagination"',
                r'"cursor"',
                r"/api/[^\"']+",
            ):
                m = re.search(pat, html, re.I)
                if m:
                    state_hints.append(m.group(0)[:120])
            results[u] = {
                "ok": True,
                "bytes": len(html),
                "strain_links": len(sl),
                "sl_sample": sl[:8],
                "locs": len(locs),
                "loc_sample": locs[:5],
                "page_hrefs": page_hrefs,
                "ld_count": len(ld),
                "ld_preview": (ld[0][:500] if ld else ""),
                "state_hints": state_hints,
                "title": (re.search(r"<title>(.*?)</title>", html, re.I | re.S) or [None, ""])[1][:200],
            }
            print(u, results[u]["bytes"], "links", results[u]["strain_links"], "locs", results[u]["locs"])
        except Exception as exc:  # noqa: BLE001
            results[u] = {"ok": False, "error": str(exc)}
            print(u, "ERR", exc)

    # detail page field harvest
    detail = get("https://www.hytiva.com/strains/hybrid/blue-dream")
    text = re.sub(r"(?is)<script.*?</script>", " ", detail)
    text = re.sub(r"(?is)<style.*?</style>", " ", text)
    text = re.sub(r"(?is)<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    results["detail_text_preview"] = text[:2500]
    results["detail_h1"] = re.findall(r"<h1[^>]*>(.*?)</h1>", detail, re.I | re.S)[:3]
    # meta / structured bits
    for label, pat in [
        ("thc", r"(?i)(\d+(?:\.\d+)?)\s*%?\s*THC|THC[^%]{0,20}(\d+(?:\.\d+)?)\s*%"),
        ("cbd", r"(?i)(\d+(?:\.\d+)?)\s*%?\s*CBD|CBD[^%]{0,20}(\d+(?:\.\d+)?)\s*%"),
        ("terpene", r"(?i)([A-Za-z]+)\s+(\d+(?:\.\d+)?)\s*mg/g"),
        ("effects", r'(?i)effects?=([a-zA-Z]+)'),
        ("flavors", r'(?i)flavors?=([a-zA-Z]+)'),
        ("lineage", r"(?i)lineage|parents|crossed"),
    ]:
        results[f"detail_{label}"] = re.findall(pat, detail)[:15]

    # try explore pagination patterns
    for u in [
        "https://www.hytiva.com/strains/explore?page=2",
        "https://www.hytiva.com/strains/explore?page=10",
        "https://www.hytiva.com/strains?letter=A",
        "https://www.hytiva.com/strains?q=a",
        "https://www.hytiva.com/strains?sort=name",
        "https://e.hytiva.com/",
    ]:
        try:
            html = get(u)
            sl = strain_links(html)
            results[u] = {"ok": True, "bytes": len(html), "strain_links": len(sl), "sl_sample": sl[:5]}
            print(u, results[u])
        except Exception as exc:  # noqa: BLE001
            results[u] = {"ok": False, "error": str(exc)}
            print(u, "ERR", exc)

    OUT.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
