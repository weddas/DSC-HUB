#!/usr/bin/env python3
"""Lightweight discovery probe for strain directories (no bulk scrape)."""

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
    r"\_probe_strain_dirs.json"
)

SITES = {
    "strain-database": {
        "home": "https://strain-database.com/strains",
        "robots": "https://strain-database.com/robots.txt",
        "sitemap": "https://strain-database.com/sitemap.xml",
    },
    "cannareviews": {
        "home": "https://cannareviews.health/",
        "robots": "https://cannareviews.health/robots.txt",
        "sitemap": "https://cannareviews.health/sitemap.xml",
    },
    "seedfinder": {
        "home": "https://en.seedfinder.eu/",
        "robots": "https://en.seedfinder.eu/robots.txt",
        "sitemap": "https://en.seedfinder.eu/sitemap.xml",
    },
    "leafly": {
        "home": "https://www.leafly.com/strains",
        "robots": "https://www.leafly.com/robots.txt",
        "sitemap": "https://www.leafly.com/sitemap.xml",
    },
    "wikileaf": {
        "home": "https://www.wikileaf.com/strains/",
        "robots": "https://www.wikileaf.com/robots.txt",
        "sitemap": "https://www.wikileaf.com/sitemap.xml",
    },
    "allbud": {
        "home": "https://www.allbud.com/marijuana-strains",
        "robots": "https://www.allbud.com/robots.txt",
        "sitemap": "https://www.allbud.com/sitemap.xml",
    },
    "weedmaps": {
        "home": "https://weedmaps.com/strains",
        "robots": "https://weedmaps.com/robots.txt",
        "sitemap": "https://weedmaps.com/sitemap.xml",
    },
    "wayofleaf": {
        "home": "https://wayofleaf.com/strains",
        "robots": "https://wayofleaf.com/robots.txt",
        "sitemap": "https://wayofleaf.com/sitemap.xml",
    },
    "hytiva": {
        "home": "https://www.hytiva.com/strains",
        "robots": "https://www.hytiva.com/robots.txt",
        "sitemap": "https://www.hytiva.com/sitemap.xml",
    },
    "cannaconnection": {
        "home": "https://www.cannaconnection.com/strains",
        "robots": "https://www.cannaconnection.com/robots.txt",
        "sitemap": "https://www.cannaconnection.com/sitemap.xml",
    },
}


def fetch(url: str, max_bytes: int = 120000) -> dict:
    req = Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    try:
        with urlopen(req, timeout=25, context=CTX) as resp:
            raw = resp.read(max_bytes)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            return {
                "ok": True,
                "status": getattr(resp, "status", 200),
                "final_url": resp.geturl(),
                "ctype": headers.get("content-type", ""),
                "server": headers.get("server", ""),
                "cf_ray": headers.get("cf-ray", ""),
                "body": raw.decode("utf-8", "replace"),
            }
    except HTTPError as e:
        body = ""
        try:
            body = e.read(80000).decode("utf-8", "replace")
        except Exception:
            pass
        headers = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        return {
            "ok": False,
            "status": e.code,
            "final_url": url,
            "ctype": headers.get("content-type", ""),
            "server": headers.get("server", ""),
            "cf_ray": headers.get("cf-ray", ""),
            "body": body,
            "error": str(e),
        }
    except Exception as e:  # noqa: BLE001
        return {
            "ok": False,
            "status": None,
            "final_url": url,
            "body": "",
            "error": repr(e),
        }


def summarize_robots(txt: str) -> dict:
    lines = [l.strip() for l in txt.splitlines() if l.strip() and not l.strip().startswith("#")]
    disallow = [l for l in lines if l.lower().startswith("disallow:")]
    allow = [l for l in lines if l.lower().startswith("allow:")]
    smaps = [l.split(":", 1)[1].strip() for l in lines if l.lower().startswith("sitemap:")]
    agents = [l for l in lines if l.lower().startswith("user-agent:")]
    strainish = [
        l for l in (disallow + allow) if re.search(r"strain|api|search|sitemap|bot", l, re.I)
    ]
    return {
        "agents": len(agents),
        "disallow_count": len(disallow),
        "sitemap_refs": smaps[:10],
        "notable": strainish[:25],
        "preview": "\n".join(lines[:50]),
    }


def detect_wall(body: str, meta: dict) -> list[str]:
    b = (body or "").lower()
    flags: list[str] = []
    if meta.get("cf_ray") or "cloudflare" in (meta.get("server") or "").lower():
        flags.append("cloudflare-headers")
    if (
        "cf-browser-verification" in b
        or "just a moment" in b
        or "attention required" in b
        or "challenge-platform" in b
    ):
        flags.append("cf-challenge")
    if "captcha" in b or "recaptcha" in b or "hcaptcha" in b:
        flags.append("captcha")
    if ("sign in" in b or "log in" in b) and "password" in b:
        flags.append("login-form-present")
    if "access denied" in b or "403 forbidden" in b:
        flags.append("access-denied")
    return flags


def main() -> None:
    out: dict = {}
    for name, urls in SITES.items():
        entry: dict = {"name": name}
        for kind in ("home", "robots", "sitemap"):
            max_b = 180000 if kind == "home" else 100000
            r = fetch(urls[kind], max_b)
            walls = detect_wall(r.get("body", ""), r)
            item: dict = {
                "status": r.get("status"),
                "ok": r.get("ok"),
                "final_url": r.get("final_url"),
                "server": r.get("server"),
                "cf_ray": bool(r.get("cf_ray")),
                "ctype": r.get("ctype"),
                "walls": walls,
                "error": r.get("error"),
                "bytes": len(r.get("body") or ""),
            }
            body = r.get("body") or ""
            if kind == "robots" and body:
                item["robots"] = summarize_robots(body)
            if kind == "sitemap" and body:
                locs = re.findall(r"<loc>([^<]+)</loc>", body, re.I)
                item["loc_count_sample"] = len(locs)
                item["loc_sample"] = locs[:10]
                item["is_index"] = "sitemapindex" in body.lower()
            if kind == "home" and body:
                hrefs = re.findall(r"""href=["']([^"']+)["']""", body, re.I)
                strain_hrefs = [h for h in hrefs if re.search(r"strain", h, re.I)]
                item["href_count"] = len(hrefs)
                item["strain_href_sample"] = strain_hrefs[:15]
                nums = re.findall(r"([0-9][0-9,]{2,})\s+(?:strains?|variet)", body, re.I)
                item["size_mentions"] = nums[:8]
                title = re.search(r"<title[^>]*>([^<]+)</title>", body, re.I)
                item["title"] = (title.group(1).strip() if title else "")[:140]
                api = re.findall(
                    r"""["'](https?://[^"']*(?:api|graphql)[^"']*)["']""",
                    body,
                    re.I,
                )
                api += re.findall(r"""["'](/api/[^"']+)["']""", body, re.I)
                item["api_hints"] = list(dict.fromkeys(api))[:12]
                item["has_next_data"] = "__NEXT_DATA__" in body
                item["has_nuxt"] = "__NUXT__" in body
            entry[kind] = item
        out[name] = entry
        print(
            "DONE",
            name,
            "home",
            entry["home"].get("status"),
            "robots",
            entry["robots"].get("status"),
            "sitemap",
            entry["sitemap"].get("status"),
            "walls",
            entry["home"].get("walls"),
        )

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print("WROTE", OUT)


if __name__ == "__main__":
    main()
