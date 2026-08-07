#!/usr/bin/env python3
"""Download cannareviews.health exports by polling /api/v5.2.1/downloads/{job_id}."""

from __future__ import annotations

import json
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


def fetch(url: str, *, maxb: int | None = None, cookies: str | None = None) -> tuple[int, dict, bytes]:
    headers = {
        "User-Agent": UA,
        "Accept": "application/json,text/csv,*/*",
        "Referer": "https://cannareviews.health/products",
    }
    if cookies:
        headers["Cookie"] = cookies
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
            body = resp.read() if maxb is None else resp.read(maxb)
            return getattr(resp, "status", 200), {k.lower(): v for k, v in resp.headers.items()}, body
    except HTTPError as exc:
        body = exc.read() if maxb is None else exc.read(maxb)
        return exc.code, {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}, body


def queue_export(url: str) -> dict:
    st, hdr, body = fetch(url, maxb=8000)
    print(f"QUEUE {st} {url} {body[:220]!r}")
    try:
        return json.loads(body.decode("utf-8", "replace"))
    except Exception as exc:  # noqa: BLE001
        return {"_status": st, "_error": str(exc), "_body": body[:500].decode("utf-8", "replace")}


def poll_job(job_id: str, *, out_name: str, max_wait: int = 300) -> Path | None:
    url = f"https://cannareviews.health/api/v5.2.1/downloads/{job_id}"
    t0 = time.time()
    while time.time() - t0 < max_wait:
        st, hdr, body = fetch(url, maxb=None)
        ctype = hdr.get("content-type", "")
        print(f"POLL {job_id[:8]} {st} {ctype} {len(body)} {body[:100]!r}")
        if st == 202:
            time.sleep(5)
            continue
        if st != 200:
            time.sleep(5)
            continue
        # status JSON?
        if ctype.startswith("application/json") or (body[:1] in (b"{", b"[") and len(body) < 2000):
            try:
                jj = json.loads(body)
            except Exception:
                jj = None
            if isinstance(jj, dict) and jj.get("status") in ("processing", "queued", "pending"):
                print("  progress", jj)
                time.sleep(5)
                continue
            # completed JSON payload
            path = CACHE / out_name
            if not out_name.endswith(".json"):
                path = CACHE / (out_name + ".json")
            path.write_bytes(body)
            print("SAVED JSON", path, len(body))
            return path
        # binary/csv
        path = CACHE / out_name
        path.write_bytes(body)
        print("SAVED BIN", path, len(body), "head", body[:80])
        return path
    print("TIMEOUT", job_id)
    return None


def poll_download_url(dl: str, *, out_name: str, max_wait: int = 300) -> Path | None:
    """data/download returns v3 URL; also try swapping to v5.2.1."""
    candidates = [dl]
    if "/api/v3/downloads/" in dl:
        candidates.append(dl.replace("/api/v3/downloads/", "/api/v5.2.1/downloads/"))
    t0 = time.time()
    while time.time() - t0 < max_wait:
        for url in candidates:
            st, hdr, body = fetch(url, maxb=None)
            ctype = hdr.get("content-type", "")
            print(f"DL {st} {ctype} {len(body)} {url} {body[:80]!r}")
            if st in (202, 404):
                continue
            if st != 200:
                continue
            if body.lstrip()[:1] in (b"{", b"[") and len(body) < 2000:
                try:
                    jj = json.loads(body)
                except Exception:
                    jj = None
                if isinstance(jj, dict) and jj.get("status") in ("processing", "queued", "pending"):
                    print("  progress", jj)
                    continue
            path = CACHE / out_name
            path.write_bytes(body)
            print("SAVED", path, len(body))
            return path
        time.sleep(8)
    return None


def main() -> None:
    results: dict = {}

    # 1) products/export
    j = queue_export("https://cannareviews.health/api/v5.2.1/products/export")
    results["products_export_queue"] = j
    if j.get("job_id"):
        p = poll_job(j["job_id"], out_name="products_export.bin", max_wait=240)
        results["products_export"] = str(p) if p else None

    # 2) products/bulk
    j = queue_export("https://cannareviews.health/api/v5.2.1/products/bulk")
    results["products_bulk_queue"] = j
    if j.get("job_id"):
        p = poll_job(j["job_id"], out_name="products_bulk.bin", max_wait=240)
        results["products_bulk"] = str(p) if p else None

    # 3) data/download (large)
    j = queue_export("https://cannareviews.health/api/v5.2.1/data/download")
    results["data_download_queue"] = j
    if j.get("download_url"):
        p = poll_download_url(j["download_url"], out_name="data_download.bin", max_wait=300)
        results["data_download"] = str(p) if p else None
    if j.get("job_id"):
        p = poll_job(j["job_id"], out_name="data_download_job.bin", max_wait=120)
        results["data_download_job"] = str(p) if p else None

    # 4) product-catalog.csv (queues like API)
    j = queue_export("https://cannareviews.health/download/product-catalog.csv")
    results["catalog_csv_queue"] = j
    if j.get("job_id"):
        p = poll_job(j["job_id"], out_name="product-catalog.csv", max_wait=240)
        results["catalog_csv"] = str(p) if p else None
    elif j.get("download_url"):
        p = poll_download_url(j["download_url"], out_name="product-catalog.csv", max_wait=240)
        results["catalog_csv"] = str(p) if p else None

    (CACHE / "export_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("RESULTS", json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
