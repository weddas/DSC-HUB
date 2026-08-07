#!/usr/bin/env python3
"""Inspect product/brand/pharmacy HTML + try export job completion paths."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.request
from pathlib import Path
from urllib.error import HTTPError

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
CTX = ssl.create_default_context()
CACHE = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"
CACHE.mkdir(parents=True, exist_ok=True)


def fetch(url: str, *, cookies: str | None = None, maxb: int | None = 500_000) -> tuple[int, dict, bytes]:
    headers = {
        "User-Agent": UA,
        "Accept": "text/html,application/json,*/*",
        "Accept-Language": "en-AU,en;q=0.9",
    }
    if cookies:
        headers["Cookie"] = cookies
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
            body = r.read() if maxb is None else r.read(maxb)
            return getattr(r, "status", 200), {k.lower(): v for k, v in r.headers.items()}, body
    except HTTPError as e:
        body = e.read() if maxb is None else e.read(maxb)
        return e.code, {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}, body


def sniff_html(name: str, body: bytes) -> dict:
    text = body.decode("utf-8", "replace")
    out = {
        "bytes": len(body),
        "title": (re.search(r"<title>([^<]+)</title>", text, re.I) or [None, ""])[1][:120],
        "login": bool(re.search(r"login|sign in|age.?gate|over.?18|medauth", text, re.I)),
        "json_ld": len(re.findall(r'application/ld\+json', text, re.I)),
        "wire": len(re.findall(r"wire:|livewire", text, re.I)),
        "api_paths": sorted(set(re.findall(r"/api/[A-Za-z0-9._\-/]+", text)))[:40],
        "download_links": sorted(set(re.findall(r'https?://[^"\']+/download/[^"\']+|/[a-z0-9_/.-]*download[a-z0-9_/.-]*', text, re.I)))[:40],
        "price_hits": len(re.findall(r"\$\s?\d+|AUD|price", text, re.I)),
        "review_hits": len(re.findall(r"review", text, re.I)),
        "data_attrs": sorted(set(re.findall(r'data-[a-z0-9-]+=', text, re.I)))[:30],
        "snippet": re.sub(r"\s+", " ", text)[:500],
    }
    # extract alpine/livewire payloads
    for m in re.finditer(r'wire:initial-data="([^"]+)"', text):
        out.setdefault("wire_initial_len", []).append(len(m.group(1)))
    for m in re.finditer(r'x-data="([^"]{20,500})"', text):
        out.setdefault("x_data_sample", []).append(m.group(1)[:200])
    # script type application/json
    scripts = re.findall(r'<script[^>]*type=["\']application/json["\'][^>]*>(.*?)</script>', text, re.I | re.S)
    out["json_script_count"] = len(scripts)
    if scripts:
        out["json_script0_head"] = scripts[0][:300]
    (CACHE / f"{name}.html").write_text(text, encoding="utf-8")
    return out


def main() -> None:
    report: dict = {}
    pages = {
        "home": "https://cannareviews.health/",
        "products": "https://cannareviews.health/products",
        "product_list": "https://cannareviews.health/products/legal-cannabis-product-list-australia",
        "brands": "https://cannareviews.health/cannabis-brands-australia",
        "pharmacies": "https://cannareviews.health/cannabis-dispensary-pharmacies",
        "product_sample": "https://cannareviews.health/product/antg-eve-cbd16-flower-10g",
        "brand_sample": None,  # filled from sitemap
        "reviews": "https://cannareviews.health/reviews",
        "research": "https://cannareviews.health/research",
    }

    # pick a brand URL from sitemap
    sm = (CACHE / "sitemap_full.xml").read_text(encoding="utf-8", errors="replace")
    brands = re.findall(r"<loc>(https://cannareviews\.health/cannabis-brands-australia/[^<]+)</loc>", sm)
    products = re.findall(r"<loc>(https://cannareviews\.health/product/[^<]+)</loc>", sm)
    print("sitemap products", len(products), "brand pages", len(brands))
    if brands:
        pages["brand_sample"] = brands[0]
        print("brand_sample", brands[0])

    for name, url in pages.items():
        if not url:
            continue
        st, hdr, body = fetch(url)
        print(name, st, len(body), hdr.get("content-type"))
        report[name] = {"url": url, "status": st, **sniff_html(name, body)}

    # Try export with Referer + Accept json, then poll alternate paths
    for export_url in [
        "https://cannareviews.health/api/v5.2.1/products/export",
        "https://cannareviews.health/api/v5.2.1/data/download",
        "https://cannareviews.health/api/v5.2.1/products/bulk",
        "https://cannareviews.health/download/product-catalog.csv",
    ]:
        st, hdr, body = fetch(export_url, maxb=5000)
        print("EXPORT", st, export_url, body[:200])
        try:
            j = json.loads(body)
        except Exception:
            continue
        report.setdefault("exports", {})[export_url] = j
        job = j.get("job_id")
        dl = j.get("download_url")
        candidates = []
        if dl:
            candidates.append(dl)
        if job:
            candidates.extend(
                [
                    f"https://cannareviews.health/api/v3/downloads/{job}",
                    f"https://cannareviews.health/api/v5.2.1/downloads/{job}",
                    f"https://cannareviews.health/api/v5.2.1/jobs/{job}",
                    f"https://cannareviews.health/api/v5.2.1/exports/{job}",
                    f"https://cannareviews.health/downloads/{job}",
                    f"https://cannareviews.health/download/{job}",
                ]
            )
        # wait then try
        time.sleep(35)
        for c in candidates:
            st2, hdr2, body2 = fetch(c, maxb=2000)
            print("  TRY", st2, c, body2[:120])
            report.setdefault("export_tries", []).append(
                {"url": c, "status": st2, "head": body2[:200].decode("utf-8", "replace")}
            )
            if st2 == 200 and not body2.lstrip().startswith(b"<!DOCTYPE") and not body2.lstrip().startswith(b"<html"):
                path = CACHE / f"got_{job or 'dl'}.bin"
                # refetch full
                st3, hdr3, body3 = fetch(c, maxb=None)
                path.write_bytes(body3)
                print("  GOT FILE", path, len(body3))
                report["got_file"] = {"path": str(path), "bytes": len(body3), "from": c}

    (CACHE / "html_inspect.json").write_text(json.dumps(report, indent=2, default=str), encoding="utf-8")
    print("WROTE", CACHE / "html_inspect.json")


if __name__ == "__main__":
    main()
