#!/usr/bin/env python3
"""Probe + download cannareviews.health export jobs."""

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
OUT_DIR = Path(__file__).resolve().parents[1] / "homeassistant" / "data" / "_cache_cannareviews"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def fetch(url: str, maxb: int | None = 5000) -> tuple[int, dict, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
            data = resp.read() if maxb is None else resp.read(maxb)
            return getattr(resp, "status", 200), {k.lower(): v for k, v in resp.headers.items()}, data
    except HTTPError as exc:
        data = exc.read() if maxb is None else exc.read(maxb)
        return exc.code, {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}, data


def main() -> None:
    endpoints = [
        "https://cannareviews.health/api/v5.2.1/products/export",
        "https://cannareviews.health/api/v5.2.1/data/download",
        "https://cannareviews.health/api/v5.2.1/products/bulk",
    ]
    jobs: dict[str, dict] = {}
    for url in endpoints:
        st, hdr, body = fetch(url, 4000)
        print("QUEUE", st, url, body[:200])
        try:
            jobs[url] = json.loads(body.decode("utf-8", "replace"))
        except Exception as exc:  # noqa: BLE001
            jobs[url] = {"raw": body[:500].decode("utf-8", "replace"), "error": str(exc)}

    # Prefer data/download which gave a download_url previously
    dl = None
    for j in jobs.values():
        if isinstance(j, dict) and j.get("download_url"):
            dl = j["download_url"]
            break
    job_ids = []
    for j in jobs.values():
        if isinstance(j, dict) and j.get("job_id"):
            job_ids.append(j["job_id"])

    print("download_url", dl)
    print("job_ids", job_ids)

    # Probe job status URLs
    for jid in job_ids:
        for path in (
            f"https://cannareviews.health/api/v5.2.1/jobs/{jid}",
            f"https://cannareviews.health/api/v5.2.1/exports/{jid}",
            f"https://cannareviews.health/api/v3/jobs/{jid}",
            f"https://cannareviews.health/api/v3/downloads/{jid}",
            f"https://cannareviews.health/api/v5.2.1/products/export/{jid}",
            f"https://cannareviews.health/api/v5.2.1/products/bulk/{jid}",
        ):
            st, hdr, body = fetch(path, 800)
            print("JOBPROBE", st, path, body[:180])

    if not dl:
        print("NO DOWNLOAD URL")
        (OUT_DIR / "queue.json").write_text(json.dumps(jobs, indent=2), encoding="utf-8")
        return

    out_path = OUT_DIR / "data_download.bin"
    for i in range(18):
        time.sleep(8)
        st, hdr, body = fetch(dl, None)
        ctype = hdr.get("content-type", "")
        print(f"POLL {i} status={st} ctype={ctype} bytes={len(body)} head={body[:120]!r}")
        if st == 202:
            continue
        if st != 200:
            continue
        # still a status json?
        if ctype.startswith("application/json") or body[:1] in (b"{", b"["):
            try:
                jj = json.loads(body)
            except Exception:
                out_path.write_bytes(body)
                print("WROTE", out_path, len(body))
                break
            if isinstance(jj, dict) and jj.get("status") in ("queued", "processing"):
                # maybe updated download_url
                if jj.get("download_url"):
                    dl = jj["download_url"]
                print(" still", jj)
                continue
            # actual json payload
            out_json = OUT_DIR / "data_download.json"
            out_json.write_bytes(body)
            print("WROTE JSON", out_json, len(body), "type", type(jj).__name__)
            if isinstance(jj, dict):
                print("keys", list(jj.keys())[:40])
            elif isinstance(jj, list):
                print("list_len", len(jj))
                if jj and isinstance(jj[0], dict):
                    print("item0_keys", list(jj[0].keys())[:40])
            break
        out_path.write_bytes(body)
        print("WROTE BIN", out_path, len(body))
        # sniff
        if body[:2] == b"PK":
            print("looks like zip")
        elif b"," in body[:200] and b"\n" in body[:500]:
            print("looks like csv head", body[:200])
        break
    else:
        print("TIMEOUT waiting for download")

    (OUT_DIR / "queue.json").write_text(json.dumps(jobs, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
