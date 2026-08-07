#!/usr/bin/env python3
"""Deeper probes: OZ Stoners nav, Rollitup /f/ boards, MA CCC 2024 strain density."""
from __future__ import annotations

import csv
import io
import re
import ssl
import sys
import urllib.error
import urllib.request
from collections import Counter
from urllib.parse import urljoin

CTX = ssl.create_default_context()
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def fetch(url: str, timeout: int = 60, bytes_limit: int | None = None) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            raw = resp.read(bytes_limit) if bytes_limit else resp.read()
            return resp.status, raw.decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        raw = exc.read(bytes_limit) if exc.fp else b""
        return exc.code, raw.decode("utf-8", "replace")


def main() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    print("=== OZ STONERS HOME LINKS ===")
    status, html = fetch("https://www.ozstoners.com/")
    print("status", status, "len", len(html))
    hrefs = re.findall(r"""href=["']([^"']+)["']""", html, re.I)
    for h in list(dict.fromkeys(hrefs))[:80]:
        full = urljoin("https://www.ozstoners.com/", h)
        if any(
            x in full.lower()
            for x in ("forum", "board", "thread", "grow", "strain", "journal", "community", "xenforo")
        ):
            print(" ", full)
    # any path-like anchors
    for m in re.finditer(r"""<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)</a>""", html, re.I | re.S):
        label = re.sub(r"<[^>]+>", " ", m.group(2))
        label = re.sub(r"\s+", " ", label).strip()
        href = m.group(1)
        if any(x in label.lower() for x in ("forum", "grow", "strain", "journal", "board")):
            print(f"  LABELED {label!r} -> {urljoin('https://www.ozstoners.com/', href)}")

    print("\n=== ROLLITUP BOARD PAGE ===")
    board = "https://www.rollitup.org/f/grow-journals.54/"
    status, html = fetch(board)
    print("status", status, "len", len(html))
    # thread links /t/
    threads = re.findall(r'href=["\']([^"\']*?/t/[^"\'?#]+)["\']', html, re.I)
    print("thread_hrefs", len(threads))
    for t in list(dict.fromkeys(threads))[:12]:
        print(" ", urljoin(board, t))
    # also structItem
    titles = re.findall(
        r'<div class="structItem-title">(.*?)</div>',
        html,
        re.I | re.S,
    )
    print("structItem titles", len(titles))
    for block in titles[:5]:
        m = re.search(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', block, re.I | re.S)
        if m:
            title = re.sub(r"<[^>]+>", "", m.group(2))
            title = re.sub(r"\s+", " ", title).strip()
            print(f"  {title!r} -> {urljoin(board, m.group(1))}")

    print("\n=== ROLLITUP THREAD SAMPLE ===")
    # pick first thread if any
    if threads:
        tu = urljoin(board, threads[0].split("#")[0])
        # normalize to thread root without /post-
        tu = re.sub(r"/post-\d+/?$", "/", tu)
        status, html = fetch(tu)
        print("thread", status, tu, "len", len(html))
        tm = re.search(r'class="[^"]*p-title-value[^"]*"[^>]*>(.*?)</h1>', html, re.I | re.S)
        print("title", re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", tm.group(1))).strip() if tm else None)
        bodies = re.findall(r'class="[^"]*bbWrapper[^"]*"[^>]*>(.*?)</div>', html, re.I | re.S)
        if bodies:
            text = re.sub(r"<[^>]+>", " ", bodies[0])
            text = re.sub(r"\s+", " ", text).strip()
            print("body", text[:400])

    print("\n=== FORUM LIST ROLLITUP ===")
    status, html = fetch("https://www.rollitup.org/forums/")
    forums = re.findall(r'href=["\']([^"\']*?/f/[^"\'?#]+)["\'][^>]*>([^<]+)', html, re.I)
    print("f_links", len(forums))
    for href, label in list(dict.fromkeys((h, re.sub(r"\s+", " ", l).strip()) for h, l in forums))[:40]:
        lab = label.lower()
        if any(k in lab for k in ("grow", "strain", "seed", "journal", "breed", "genetics", "auto")):
            print(f"  {label!r} -> {urljoin('https://www.rollitup.org/', href)}")

    print("\n=== MA CCC 2024 strain density (first 2MB) ===")
    url = "https://masscannabiscontrol.com/resource/Testing_Results_2024_20260415_OpenData.csv"
    status, text = fetch(url, bytes_limit=2_000_000)
    print("status", status, "got", len(text))
    if "\n" in text:
        text = text.rsplit("\n", 1)[0]
    reader = csv.DictReader(io.StringIO(text))
    strains = Counter()
    analytes = Counter()
    thc_named = 0
    named = 0
    empty = 0
    for row in reader:
        s = (row.get("Strain") or "").strip()
        a = (row.get("Analyte/Test ID") or "").strip()
        analytes[a] += 1
        if not s:
            empty += 1
            continue
        named += 1
        strains[s] += 1
        if "thc" in a.lower():
            thc_named += 1
    print("rows_parsed approx", named + empty, "named", named, "empty", empty, "thc_named", thc_named)
    print("top_analytes", analytes.most_common(15))
    print("top_strains", strains.most_common(15))
    print("unique_named_strains", len(strains))


if __name__ == "__main__":
    main()
