#!/usr/bin/env python3
"""Final lightweight probes: sitemaps + API auth headers only (no bulk)."""

from __future__ import annotations

import json
import re
import ssl
from urllib.error import HTTPError
from urllib.request import Request, urlopen

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
OUT = (
    r"y:\Digital Stealth Care\Projects\DSC-HUB\homeassistant\data"
    r"\_probe_strain_dirs_final.json"
)


def fetch(url: str, max_bytes: int = 250000) -> dict:
    req = Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urlopen(req, timeout=30, context=CTX) as resp:
            raw = resp.read(max_bytes)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            body = raw.decode("utf-8", "replace")
            locs = re.findall(r"<loc>([^<]+)</loc>", body, re.I)
            return {
                "ok": True,
                "status": getattr(resp, "status", 200),
                "final_url": resp.geturl(),
                "ctype": headers.get("content-type", ""),
                "bytes": len(body),
                "loc_count": len(locs),
                "loc_sample": locs[:15],
                "is_index": "sitemapindex" in body.lower(),
                "strain_locs": [u for u in locs if re.search(r"strain", u, re.I)][:12],
                "href_sample": re.findall(
                    r"""href=["']([^"']*(?:strain-info|marijuana-strains|/strains/)[^"']*)["']""",
                    body,
                    re.I,
                )[:15],
                "auth_hint": headers.get("www-authenticate", ""),
                "snippet": re.sub(r"\s+", " ", body)[:300],
            }
    except HTTPError as e:
        body = ""
        try:
            body = e.read(40000).decode("utf-8", "replace")
        except Exception:
            pass
        headers = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        return {
            "ok": False,
            "status": e.code,
            "final_url": url,
            "auth_hint": headers.get("www-authenticate", ""),
            "ctype": headers.get("content-type", ""),
            "bytes": len(body),
            "snippet": re.sub(r"\s+", " ", body)[:300],
            "error": str(e),
        }
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "status": None, "error": repr(e)}


URLS = [
    "https://seedfinder.eu/sitemap/sitemap-index.xml",
    "https://en.seedfinder.eu/database/strains/alphabetical/b/",
    "https://www.allbud.com/sitemap.xml",
    "https://www.allbud.com/sitemap-strains.xml",
    "https://www.allbud.com/sitemap-strains-symptoms.xml",
    "https://www.leafly.com/leafly-sitemaps/sitemap-index.xml",
    "https://weedmaps.com/sitemap.xml.gz",
    "https://cannareviews.health/api/v5.2.1/products/export",
    "https://cannareviews.health/api/v5.2.1/data/download",
    "https://cannareviews.health/api/v5.2.1/products/bulk",
    "https://cannareviews.health/products/legal-cannabis-product-list-australia",
    "https://strain-database.com/sitemap/0.xml",
    "https://www.hytiva.com/strains/explore",
]


def main() -> None:
    out = {}
    for url in URLS:
        print("FETCH", url)
        out[url] = fetch(url)
        r = out[url]
        print(
            " ",
            r.get("status"),
            "locs=",
            r.get("loc_count"),
            "strain_locs=",
            len(r.get("strain_locs") or []),
            "auth=",
            r.get("auth_hint"),
        )
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print("WROTE", OUT)


if __name__ == "__main__":
    main()
