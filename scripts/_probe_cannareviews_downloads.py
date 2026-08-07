#!/usr/bin/env python3
"""Fetch known cannareviews download paths and inspect sitemap/HTML."""

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
ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "homeassistant" / "data" / "_cache_cannareviews"
CACHE.mkdir(parents=True, exist_ok=True)


def fetch(url: str, maxb: int | None = None) -> tuple[int, dict, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
            data = resp.read() if maxb is None else resp.read(maxb)
            return getattr(resp, "status", 200), {k.lower(): v for k, v in resp.headers.items()}, data
    except HTTPError as exc:
        data = exc.read() if maxb is None else exc.read(maxb)
        return exc.code, {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}, data


def main() -> None:
    urls = [
        "https://cannareviews.health/download/product-catalog.csv",
        "https://cannareviews.health/download/reviews.csv",
        "https://cannareviews.health/download/brands.csv",
        "https://cannareviews.health/download/prices.csv",
        "https://cannareviews.health/download/pharmacies.csv",
        "https://cannareviews.health/download/product-catalog.json",
        "https://cannareviews.health/download/full-export.zip",
        "https://cannareviews.health/download/data.zip",
        "https://cannareviews.health/sitemap.xml",
        "https://cannareviews.health/sitemap_index.xml",
        "https://cannareviews.health/products/sitemap.xml",
        "https://cannareviews.health/robots.txt",
    ]
    report: dict = {}
    for url in urls:
        st, hdr, body = fetch(url, 5000 if "sitemap" in url or "robots" in url else None)
        ctype = hdr.get("content-type", "")
        print(f"{st} {ctype} {len(body)} {url}")
        entry = {
            "status": st,
            "ctype": ctype,
            "bytes": len(body),
            "head": body[:300].decode("utf-8", "replace"),
            "final": None,
        }
        if st == 200 and len(body) > 100 and not body.lstrip().startswith(b"<!DOCTYPE") and not body.lstrip().startswith(b"<html"):
            name = url.rstrip("/").split("/")[-1] or "download.bin"
            path = CACHE / name
            # re-fetch full if we capped
            if "sitemap" in url or "robots" in url:
                path.write_bytes(body)
            else:
                # already full
                path.write_bytes(body)
            entry["saved"] = str(path)
            print("  SAVED", path, "head:", body[:120])
        report[url] = entry

    # queue data/download and poll hard
    st, hdr, body = fetch("https://cannareviews.health/api/v5.2.1/data/download", 4000)
    print("QUEUE", st, body[:250])
    try:
        j = json.loads(body)
    except Exception as exc:  # noqa: BLE001
        print("queue parse fail", exc)
        (CACHE / "fetch_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
        return
    dl = j.get("download_url")
    print("dl", dl)
    for i in range(24):
        time.sleep(5)
        st, hdr, body = fetch(dl, None)
        ctype = hdr.get("content-type", "")
        print(f"poll {i} {st} {ctype} {len(body)} {body[:100]!r}")
        if st == 202:
            continue
        if st == 200:
            if body.lstrip()[:1] in (b"{", b"[") and len(body) < 500:
                try:
                    jj = json.loads(body)
                    if isinstance(jj, dict) and jj.get("status") in ("queued", "processing"):
                        dl = jj.get("download_url") or dl
                        continue
                except Exception:
                    pass
            path = CACHE / "export_data_download.bin"
            path.write_bytes(body)
            print("SAVED EXPORT", path, len(body))
            # sniff
            if body[:2] == b"PK":
                print("ZIP")
            elif b"," in body[:300]:
                print("CSV?", body[:200])
            elif body.lstrip()[:1] in (b"{", b"["):
                print("JSON")
            report["export"] = {"path": str(path), "bytes": len(body), "ctype": ctype}
            break
    (CACHE / "fetch_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("DONE")


if __name__ == "__main__":
    main()
