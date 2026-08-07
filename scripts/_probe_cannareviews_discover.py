#!/usr/bin/env python3
"""Discover cannareviews.health API routes from HTML/JS."""

from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_probe_cannareviews_discover.json"


def fetch(url: str, maxb: int = 2_000_000) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
            return getattr(resp, "status", 200), resp.read(maxb).decode("utf-8", "replace")
    except HTTPError as exc:
        return exc.code, exc.read(maxb).decode("utf-8", "replace")


def main() -> None:
    pages = [
        "https://cannareviews.health/",
        "https://cannareviews.health/products",
        "https://cannareviews.health/reviews",
        "https://cannareviews.health/brands",
        "https://cannareviews.health/sitemap.xml",
        "https://cannareviews.health/robots.txt",
    ]
    out: dict = {"pages": {}, "scripts": {}, "api_hits": {}, "api_candidates": []}
    all_apis: set[str] = set()
    script_urls: set[str] = set()

    for url in pages:
        st, body = fetch(url)
        apis = sorted(set(re.findall(r"/api/[A-Za-z0-9._\-/]+", body)))
        scripts = re.findall(r"""src=["']([^"']+\.js[^"']*)["']""", body, re.I)
        hrefs = re.findall(r"""href=["']([^"']+)["']""", body, re.I)[:40]
        out["pages"][url] = {
            "status": st,
            "bytes": len(body),
            "apis": apis[:50],
            "scripts": scripts[:30],
            "href_sample": hrefs,
            "snippet": re.sub(r"\s+", " ", body)[:400],
        }
        all_apis.update(apis)
        for s in scripts:
            script_urls.add(urljoin(url, s))
        print(url, st, "apis", len(apis), "scripts", len(scripts))

    for su in sorted(script_urls)[:25]:
        st, body = fetch(su, 3_000_000)
        apis = sorted(set(re.findall(r"/api/[A-Za-z0-9._\-/]+", body)))
        # also bare path fragments
        more = sorted(
            set(
                re.findall(
                    r"""["'](/api/v[^"']+)["']|["'](products/export|data/download|products/bulk|reviews|brands)["']""",
                    body,
                )
            )
        )
        flat = []
        for m in more:
            if isinstance(m, tuple):
                flat.extend([x for x in m if x])
            else:
                flat.append(m)
        out["scripts"][su] = {"status": st, "bytes": len(body), "apis": apis[:80], "more": flat[:40]}
        all_apis.update(apis)
        print("SCRIPT", su, st, "apis", len(apis))

    # Candidate API probes
    candidates = [
        "/api/v5.2.1/products/export",
        "/api/v5.2.1/data/download",
        "/api/v5.2.1/products/bulk",
        "/api/v5.2.1/reviews/export",
        "/api/v5.2.1/reviews/bulk",
        "/api/v5.2.1/brands/export",
        "/api/v5.2.1/brands/bulk",
        "/api/v5.2.1/prices/export",
        "/api/v5.2.1/pharmacies/export",
        "/api/v3/products/export",
        "/api/v3/data/download",
        "/api/v3/reviews",
        "/api/v3/brands",
        "/api/v3/products",
        "/api/v4/products/export",
        "/api/v5/products/export",
        "/api/v5.2.1/search",
        "/api/v5.2.1/stats",
        "/api/graphql",
        "/api/v5.2.1/products.json",
        "/api/v5.2.1/reviews.json",
        "/api/v5.2.1/brands.json",
        "/products.json",
        "/reviews.json",
        "/brands.json",
        "/data/products.csv",
        "/data/reviews.csv",
        "/data/brands.csv",
        "/export/products",
        "/export/reviews",
        "/export/brands",
    ]
    for a in sorted(all_apis):
        if a not in candidates:
            candidates.append(a)

    for path in candidates:
        url = path if path.startswith("http") else f"https://cannareviews.health{path}"
        st, body = fetch(url, 1500)
        out["api_hits"][url] = {
            "status": st,
            "bytes": len(body),
            "head": re.sub(r"\s+", " ", body)[:250],
        }
        print("HIT", st, url, body[:80].replace("\n", " "))

    out["api_candidates"] = sorted(all_apis)
    OUT.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("WROTE", OUT)


if __name__ == "__main__":
    main()
