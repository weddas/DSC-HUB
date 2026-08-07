#!/usr/bin/env python3
"""Inspect CCC rows for any recoverable strain identity; probe OZ IPS topics."""
from __future__ import annotations

import csv
import re
import ssl
import sys
import urllib.request
from collections import Counter
from urllib.parse import urljoin

CTX = ssl.create_default_context()
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"


def main() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    print("=== CCC 2024 THC rows sample ===")
    url = "https://masscannabiscontrol.com/resource/Testing_Results_2024_20260415_OpenData.csv"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    thc_rows = []
    note_hits = Counter()
    with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
        reader = csv.DictReader((ln.decode("utf-8", "replace") for ln in resp))
        for i, row in enumerate(reader, 1):
            a = (row.get("Analyte/Test ID") or "").lower()
            if "thc" not in a:
                continue
            thc_rows.append(row)
            note = (row.get("Notes/comments") or "").strip()
            if note:
                note_hits[note[:80]] += 1
            if len(thc_rows) >= 20:
                break
    print("thc_samples", len(thc_rows))
    for r in thc_rows[:8]:
        print(
            {
                k: r.get(k)
                for k in (
                    "Strain",
                    "Analyte/Test ID",
                    "Result",
                    "UnitOfMeasure",
                    "ProductCategoryTypeName",
                    "METRC ID",
                    "Notes/comments",
                    "TestCategory",
                )
            }
        )
    print("note_hits", note_hits.most_common(10))

    print("\n=== CCC 2025 header + THC sample ===")
    url5 = "https://masscannabiscontrol.com/resource/CCC_Testing_Results_2025.csv"
    req5 = urllib.request.Request(url5, headers={"User-Agent": UA})
    with urllib.request.urlopen(req5, timeout=180, context=CTX) as resp:
        reader = csv.DictReader((ln.decode("utf-8", "replace") for ln in resp))
        print("fields", reader.fieldnames)
        thc5 = []
        for row in reader:
            a = (row.get("ANALYTE/TEST ID") or "").lower()
            if "thc" in a:
                thc5.append(row)
                if len(thc5) >= 5:
                    break
        for r in thc5:
            print(dict(r))

    print("\n=== OZ forumId=8 topics ===")
    url = "https://community.ozstoners.com/?forumId=8"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
        html = resp.read().decode("utf-8", "replace")
    topics = re.findall(r'href=["\']([^"\']*?/topic/\d+-[^"\'?#]+)["\']', html, re.I)
    uniq = list(dict.fromkeys(urljoin(url, t.split("#")[0]) for t in topics))
    print("topics", len(uniq))
    for t in uniq[:15]:
        print(" ", t)
    if uniq:
        turl = uniq[0]
        req = urllib.request.Request(turl, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
            th = resp.read().decode("utf-8", "replace")
        title = re.search(r"<title[^>]*>(.*?)</title>", th, re.I | re.S)
        print("sample title", re.sub(r"\s+", " ", title.group(1)).strip()[:120] if title else None)
        # IPS post body
        bodies = re.findall(
            r'class="[^"]*(?:ipsType_richText|cPost_contentWrap)[^"]*"[^>]*>(.*?)</div>',
            th,
            re.I | re.S,
        )
        print("bodies", len(bodies))
        if bodies:
            text = re.sub(r"<[^>]+>", " ", bodies[0])
            text = re.sub(r"\s+", " ", text).strip()
            print("body", text[:400])


if __name__ == "__main__":
    main()
