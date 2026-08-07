#!/usr/bin/env python3
"""Follow-up probes: robots detail, alternate URLs, sample strain pages."""

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
BASE = r"y:\Digital Stealth Care\Projects\DSC-HUB\homeassistant\data"
PROBE = BASE + r"\_probe_strain_dirs.json"
OUT = BASE + r"\_probe_strain_dirs_followup.json"


def fetch(url: str, max_bytes: int = 200000) -> dict:
    req = Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urlopen(req, timeout=30, context=CTX) as resp:
            raw = resp.read(max_bytes)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            body = raw.decode("utf-8", "replace")
            return {
                "ok": True,
                "status": getattr(resp, "status", 200),
                "final_url": resp.geturl(),
                "server": headers.get("server", ""),
                "cf_ray": bool(headers.get("cf-ray")),
                "ctype": headers.get("content-type", ""),
                "bytes": len(body),
                "title": _title(body),
                "snippet": _snip(body),
                "href_sample": _strain_hrefs(body),
                "size_mentions": re.findall(
                    r"([0-9][0-9,]{2,})\s+(?:strains?|variet|products?)", body, re.I
                )[:8],
                "api_hints": _api(body),
                "wall": _wall(body, headers),
                "has_next_data": "__NEXT_DATA__" in body,
                "sitemap_refs": _sitemap_refs(body) if "robots" in url or url.endswith(".txt") else [],
                "robots_preview": body[:2500] if url.endswith("robots.txt") else "",
                "loc_sample": re.findall(r"<loc>([^<]+)</loc>", body, re.I)[:12]
                if "xml" in (headers.get("content-type") or "") or "<urlset" in body.lower() or "<sitemapindex" in body.lower()
                else [],
            }
    except HTTPError as e:
        body = ""
        try:
            body = e.read(60000).decode("utf-8", "replace")
        except Exception:
            pass
        headers = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        return {
            "ok": False,
            "status": e.code,
            "final_url": url,
            "server": headers.get("server", ""),
            "cf_ray": bool(headers.get("cf-ray")),
            "bytes": len(body),
            "title": _title(body),
            "wall": _wall(body, headers),
            "snippet": _snip(body),
            "error": str(e),
            "robots_preview": body[:2500] if url.endswith("robots.txt") else "",
        }
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "status": None, "final_url": url, "error": repr(e), "wall": []}


def _title(body: str) -> str:
    m = re.search(r"<title[^>]*>([^<]+)</title>", body or "", re.I)
    return (m.group(1).strip() if m else "")[:160]


def _snip(body: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", body or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:350]


def _strain_hrefs(body: str) -> list[str]:
    hrefs = re.findall(r"""href=["']([^"']+)["']""", body or "", re.I)
    out = []
    for h in hrefs:
        if re.search(r"strain|marijuana-strains|/strain/", h, re.I):
            out.append(h)
    return out[:20]


def _api(body: str) -> list[str]:
    api = re.findall(r"""["'](https?://[^"']*(?:api|graphql)[^"']*)["']""", body or "", re.I)
    api += re.findall(r"""["'](/api/[^"']+)["']""", body or "", re.I)
    return list(dict.fromkeys(api))[:15]


def _wall(body: str, headers: dict) -> list[str]:
    b = (body or "").lower()
    flags = []
    if headers.get("cf-ray") or "cloudflare" in (headers.get("server") or "").lower():
        flags.append("cloudflare-headers")
    if "just a moment" in b or "cf-browser-verification" in b or "challenge-platform" in b:
        flags.append("cf-challenge")
    if "captcha" in b or "hcaptcha" in b or "recaptcha" in b:
        flags.append("captcha")
    if "access denied" in b:
        flags.append("access-denied")
    if ("sign in" in b or "log in" in b) and "password" in b:
        flags.append("login-form")
    if "you agree" in b and ("18" in b or "age" in b):
        flags.append("age-gate")
    return flags


def _sitemap_refs(body: str) -> list[str]:
    return [
        l.split(":", 1)[1].strip()
        for l in body.splitlines()
        if l.lower().startswith("sitemap:")
    ]


URLS = [
    # robots deep
    "https://strain-database.com/robots.txt",
    "https://cannareviews.health/robots.txt",
    "https://en.seedfinder.eu/robots.txt",
    "https://www.leafly.com/robots.txt",
    "https://www.wikileaf.com/robots.txt",
    "https://www.allbud.com/robots.txt",
    "https://weedmaps.com/robots.txt",
    "https://wayofleaf.com/robots.txt",
    "https://www.hytiva.com/robots.txt",
    "https://www.cannaconnection.com/robots.txt",
    # sitemaps / indexes
    "https://strain-database.com/sitemap.xml",
    "https://cannareviews.health/sitemap.xml",
    "https://www.allbud.com/sitemap.xml",
    "https://wayofleaf.com/sitemap.xml",
    "https://www.leafly.com/sitemap_index.xml",
    "https://weedmaps.com/sitemap_index.xml",
    "https://en.seedfinder.eu/sitemap_index.xml",
    "https://www.hytiva.com/sitemap_index.xml",
    "https://www.allbud.com/sitemap_index.xml",
    # alternate / sample pages
    "https://cannareviews.health/",
    "https://cannareviews.health/products",
    "https://cannareviews.health/strains",
    "https://en.seedfinder.eu/",
    "https://en.seedfinder.eu/strain-info/Blue_Dream/Unknown_or_Legendary/",
    "https://en.seedfinder.eu/database/strains/alphabetical/b/",
    "https://www.allbud.com/",
    "https://www.allbud.com/marijuana-strains/search",
    "https://www.allbud.com/marijuana-strains/hybrid/blue-dream",
    "https://www.allbud.com/marijuana-strains/indica/granddaddy-purple",
    "https://wayofleaf.com/strain-reviews",
    "https://wayofleaf.com/cannabis/blue-dream",
    "https://www.hytiva.com/strains/hybrid/blue-dream",
    "https://www.hytiva.com/strains/hybrid/oreoz",
    "https://weedmaps.com/strains/blue-dream",
    "https://www.leafly.com/strains/blue-dream",
    "https://www.wikileaf.com/strain/blue-dream/",
    "https://www.cannaconnection.com/strains/blue-dream",
    "https://strain-database.com/strains/blue-dream",
    # leafly api hints commonly used historically
    "https://consumer-api.leafly.com/api/strains",
    "https://www.leafly.com/strains-explorer/api/strains",
]


def main() -> None:
    results = {}
    for url in URLS:
        print("FETCH", url)
        results[url] = fetch(url)
        r = results[url]
        print(
            " ",
            r.get("status"),
            "wall=",
            r.get("wall"),
            "title=",
            (r.get("title") or "")[:60],
            "hrefs=",
            len(r.get("href_sample") or []),
        )

    # compact robots notes from primary probe
    primary = json.loads(open(PROBE, encoding="utf-8").read())
    summary = {"followup": results, "primary_compact": {}}
    for name, e in primary.items():
        summary["primary_compact"][name] = {
            "home_status": e["home"].get("status"),
            "home_walls": e["home"].get("walls"),
            "home_title": e["home"].get("title"),
            "home_size": e["home"].get("size_mentions"),
            "home_api": e["home"].get("api_hints"),
            "home_hrefs": e["home"].get("strain_href_sample"),
            "robots_status": e["robots"].get("status"),
            "robots_sitemaps": (e["robots"].get("robots") or {}).get("sitemap_refs"),
            "robots_notable": (e["robots"].get("robots") or {}).get("notable"),
            "robots_preview": ((e["robots"].get("robots") or {}).get("preview") or "")[:1200],
            "sitemap_status": e["sitemap"].get("status"),
            "sitemap_index": e["sitemap"].get("is_index"),
            "sitemap_locs": e["sitemap"].get("loc_count_sample"),
            "sitemap_sample": e["sitemap"].get("loc_sample"),
        }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print("WROTE", OUT)


if __name__ == "__main__":
    main()
