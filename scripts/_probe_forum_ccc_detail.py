#!/usr/bin/env python3
"""Probe forum URL structures + MA CCC CSV headers (sample only)."""
from __future__ import annotations

import csv
import io
import re
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

CTX = ssl.create_default_context()
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def fetch(url: str, timeout: int = 60, bytes_limit: int | None = None) -> tuple[int, str, bytes]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            raw = resp.read(bytes_limit) if bytes_limit else resp.read()
            # If limited, still try decode what we have
            text = raw.decode("utf-8", "replace")
            return resp.status, text, raw
    except urllib.error.HTTPError as exc:
        raw = exc.read(bytes_limit) if exc.fp else b""
        return exc.code, raw.decode("utf-8", "replace"), raw


def is_wall(html: str, status: int | None) -> bool:
    low = (html or "").lower()
    markers = (
        "just a moment",
        "cf-browser-verification",
        "attention required | cloudflare",
        "verifying you're human",
        "enable javascript and cookies to continue",
    )
    if status in (403, 503, 429) and ("cloudflare" in low or any(m in low for m in markers)):
        return True
    return any(m in low for m in markers[:4])


def probe_forum(name: str, roots: list[str]) -> None:
    print(f"\n=== {name} ===")
    for url in roots:
        try:
            status, html, _ = fetch(url, timeout=45)
        except Exception as exc:  # noqa: BLE001
            print(f"  ERR {url}: {exc}")
            continue
        wall = is_wall(html, status)
        print(f"  {status} wall={wall} len={len(html)} {url}")
        if wall or status in (403, 401):
            continue
        # Collect interesting hrefs
        hrefs = re.findall(r"""href=["']([^"'#?]+)""", html, re.I)
        interesting = []
        for h in hrefs:
            full = urljoin(url, h)
            low = full.lower()
            if any(
                x in low
                for x in (
                    "/forums/",
                    "/threads/",
                    "/forum/",
                    "/grow",
                    "/strain",
                    "/journal",
                    "/seeds",
                    "xenforo",
                    "viewforum",
                    "viewtopic",
                    "index.php?forums",
                    "index.php?threads",
                )
            ):
                interesting.append(full)
        uniq = list(dict.fromkeys(interesting))
        print(f"  interesting_hrefs={len(uniq)}")
        for u in uniq[:15]:
            print(f"    {u}")
        # Title hint
        tm = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
        if tm:
            title = re.sub(r"\s+", " ", tm.group(1)).strip()[:120]
            print(f"  title={title}")


def probe_ccc_headers() -> None:
    print("\n=== MA CCC CSV HEADERS ===")
    urls = [
        "https://masscannabiscontrol.com/resource/CCC_Testing_Results_2025.csv",
        "https://masscannabiscontrol.com/resource/Testing_Results_2024_20260415_OpenData.csv",
        "https://masscannabiscontrol.com/resource/Research-IndustryReport/Testing_Data_THC_THCA_Y%26M-2021-2023.csv",
    ]
    for url in urls:
        try:
            status, text, raw = fetch(url, timeout=90, bytes_limit=256_000)
        except Exception as exc:  # noqa: BLE001
            print(f"  ERR {url}: {exc}")
            continue
        print(f"  {status} bytes_got={len(raw)} {url}")
        if status != 200:
            print(f"  body_head={text[:200]!r}")
            continue
        # Parse a few CSV rows from the prefix
        # Find last incomplete line and drop it
        if "\n" in text:
            text = text.rsplit("\n", 1)[0]
        try:
            reader = csv.DictReader(io.StringIO(text))
            fields = reader.fieldnames or []
            print(f"  cols={len(fields)} names={fields[:40]}")
            rows = []
            for i, row in enumerate(reader):
                rows.append(row)
                if i >= 2:
                    break
            for r in rows:
                # Print strain-ish keys
                slim = {
                    k: r.get(k)
                    for k in fields
                    if any(
                        x in (k or "").lower()
                        for x in (
                            "strain",
                            "product",
                            "thc",
                            "thca",
                            "cbd",
                            "terp",
                            "name",
                            "type",
                            "category",
                        )
                    )
                }
                print(f"  sample={slim}")
        except Exception as exc:  # noqa: BLE001
            print(f"  parse_fail {exc} head={text[:300]!r}")


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    probe_forum(
        "rollitup",
        [
            "https://www.rollitup.org/",
            "https://www.rollitup.org/community/",
            "https://www.rollitup.org/forums/",
            "https://www.rollitup.org/threads/",
        ],
    )
    probe_forum(
        "sensi",
        [
            "https://forum.sensiseeds.com/",
            "https://forum.sensiseeds.com/forums/",
            "https://forum.sensiseeds.com/index.php",
        ],
    )
    probe_forum(
        "growery",
        [
            "https://www.growery.org/",
            "https://www.growery.org/forums/",
            "https://growery.org/",
        ],
    )
    probe_forum(
        "ozstoners",
        [
            "https://www.ozstoners.com/",
            "https://www.ozstoners.com/community/",
            "https://www.ozstoners.com/forums/",
            "https://ozstoners.com/forum/",
        ],
    )
    probe_ccc_headers()
