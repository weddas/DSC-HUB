#!/usr/bin/env python3
"""Size estimates + SeedFinder link pattern + CannaReviews API body peek."""

from __future__ import annotations

import json
import re
import ssl
from urllib.error import HTTPError
from urllib.request import Request, urlopen

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
CTX = ssl.create_default_context()
OUT = (
    r"y:\Digital Stealth Care\Projects\DSC-HUB\homeassistant\data"
    r"\_probe_strain_dirs_sizes.json"
)


def peek(url: str, max_bytes: int = 80000) -> dict:
    req = Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urlopen(req, timeout=30, context=CTX) as resp:
            cl = resp.headers.get("Content-Length")
            data = resp.read(max_bytes)
            body = data.decode("utf-8", "replace")
            locs = re.findall(r"<loc>([^<]+)</loc>", body, re.I)
            return {
                "status": getattr(resp, "status", 200),
                "content_length": cl,
                "ctype": resp.headers.get("Content-Type"),
                "read": len(data),
                "loc_in_chunk": len(locs),
                "loc_sample": locs[:6],
                "body_head": body[:350],
            }
    except HTTPError as e:
        try:
            data = e.read(2000)
        except Exception:
            data = b""
        return {
            "status": e.code,
            "error": str(e),
            "body_head": data.decode("utf-8", "replace")[:350],
            "auth": (e.headers.get("WWW-Authenticate") if e.headers else None),
        }
    except Exception as e:  # noqa: BLE001
        return {"error": repr(e)}


def main() -> None:
    out: dict = {"sizes": {}, "seedfinder_links": {}, "cannareviews_api": {}}

    for url in [
        "https://www.allbud.com/sitemap-strains.xml",
        "https://www.allbud.com/sitemap-strains-varieties.xml",
        "https://www.leafly.com/leafly-sitemaps/strains-sitemap-1.xml.gz",
        "https://seedfinder.eu/sitemap/sitemap1.xml.gz",
        "https://strain-database.com/sitemap/0.xml",
        "https://strain-database.com/sitemap/1.xml",
        "https://weedmaps.com/sitemap.xml.gz",
    ]:
        print("SIZE", url)
        out["sizes"][url] = peek(url, 60000)
        print(" ", out["sizes"][url].get("status"), "CL", out["sizes"][url].get("content_length"), "locs_chunk", out["sizes"][url].get("loc_in_chunk"))

    # SeedFinder alphabetical B links
    sf = peek("https://en.seedfinder.eu/database/strains/alphabetical/b/", 220000)
    body = sf.get("body_head")  # not full; re-fetch properly
    req = Request(
        "https://en.seedfinder.eu/database/strains/alphabetical/b/",
        headers={"User-Agent": UA},
    )
    with urlopen(req, timeout=30, context=CTX) as resp:
        full = resp.read(250000).decode("utf-8", "replace")
    abs_links = sorted(
        set(re.findall(r"https://seedfinder\.eu/(?:en/)?strain-info/[^\"'#?\s]+", full))
    )
    rel_links = sorted(
        set(re.findall(r'href=["\']((?:/en)?/strain-info/[^"\']+)["\']', full, re.I))
    )
    # modern path?
    other = sorted(
        set(
            re.findall(
                r'href=["\']([^"\']*(?:strain-info|database/strains)[^"\']*)["\']',
                full,
                re.I,
            )
        )
    )
    out["seedfinder_links"] = {
        "abs_count": len(abs_links),
        "abs_sample": abs_links[:10],
        "rel_count": len(rel_links),
        "rel_sample": rel_links[:10],
        "other_sample": other[:20],
        "size_mentions": re.findall(r"([0-9][0-9,]{2,})", full)[:10],
    }
    print("SF abs", len(abs_links), abs_links[:5])
    print("SF rel", len(rel_links), rel_links[:5])

    for url in [
        "https://cannareviews.health/api/v5.2.1/products/export",
        "https://cannareviews.health/api/v5.2.1/data/download",
        "https://cannareviews.health/api/v5.2.1/products/bulk",
    ]:
        out["cannareviews_api"][url] = peek(url, 3000)
        print("API", url, out["cannareviews_api"][url].get("status"), out["cannareviews_api"][url].get("body_head")[:200])

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print("WROTE", OUT)


if __name__ == "__main__":
    main()
