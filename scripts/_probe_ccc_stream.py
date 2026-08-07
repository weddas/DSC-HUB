#!/usr/bin/env python3
"""Stream-scan MA CCC 2024 for named strains + probe OZ community."""
from __future__ import annotations

import csv
import re
import ssl
import sys
import urllib.error
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

    print("=== OZ COMMUNITY ===")
    for url in (
        "https://community.ozstoners.com/",
        "https://community.ozstoners.com/?forumId=8",
        "https://community.ozstoners.com/?forumId=1",
    ):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=45, context=CTX) as resp:
                html = resp.read().decode("utf-8", "replace")
                status = resp.status
                final = resp.geturl()
        except urllib.error.HTTPError as exc:
            status, final = exc.code, url
            html = exc.read().decode("utf-8", "replace") if exc.fp else ""
        except Exception as exc:  # noqa: BLE001
            print(url, "ERR", exc)
            continue
        low = html.lower()
        wall = "just a moment" in low or "cf-browser-verification" in low
        print(f"{status} wall={wall} final={final} len={len(html)}")
        tm = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
        if tm:
            print(" title", re.sub(r"\s+", " ", tm.group(1)).strip()[:100])
        hrefs = re.findall(r"""href=["']([^"']+)["']""", html, re.I)
        interesting = []
        for h in hrefs:
            full = urljoin(final, h)
            if any(x in full.lower() for x in ("topic", "thread", "forum", "grow", "strain", "post")):
                interesting.append(full)
        for u in list(dict.fromkeys(interesting))[:20]:
            print(" ", u)

    print("\n=== CCC 2024 STREAM SCAN ===")
    url = "https://masscannabiscontrol.com/resource/Testing_Results_2024_20260415_OpenData.csv"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    named = 0
    empty = 0
    thc_named = 0
    strains = Counter()
    analytes_named = Counter()
    sample_named = []
    with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
        # Stream decode
        text_stream = (line.decode("utf-8", "replace") for line in resp)
        reader = csv.DictReader(text_stream)
        for i, row in enumerate(reader, 1):
            s = (row.get("Strain") or "").strip()
            a = (row.get("Analyte/Test ID") or row.get("Analyte/TestID") or "").strip()
            if not s:
                empty += 1
                continue
            named += 1
            strains[s] += 1
            analytes_named[a] += 1
            if "thc" in a.lower():
                thc_named += 1
                if len(sample_named) < 8:
                    sample_named.append(
                        {
                            "Strain": s,
                            "Analyte": a,
                            "Result": row.get("Result"),
                            "Unit": row.get("UnitOfMeasure"),
                            "Cat": row.get("ProductCategoryTypeName"),
                        }
                    )
            if i % 200_000 == 0:
                print(f"  scanned {i} named={named} empty={empty} thc_named={thc_named}", flush=True)
    print(f"DONE rows~{named+empty} named={named} empty={empty} thc_named={thc_named}")
    print("unique_strains", len(strains))
    print("top_strains", strains.most_common(20))
    print("top_analytes_named", analytes_named.most_common(20))
    print("samples", sample_named)

    print("\n=== CCC 2021-2023 STREAM SCAN ===")
    url2 = "https://masscannabiscontrol.com/resource/Research-IndustryReport/Testing_Data_THC_THCA_Y%26M-2021-2023.csv"
    req2 = urllib.request.Request(url2, headers={"User-Agent": UA})
    named2 = anon = 0
    strains2 = Counter()
    thc2 = 0
    with urllib.request.urlopen(req2, timeout=180, context=CTX) as resp:
        text_stream = (line.decode("utf-8", "replace") for line in resp)
        reader = csv.DictReader(text_stream)
        for i, row in enumerate(reader, 1):
            s = (row.get("Strain") or "").strip()
            if not s:
                continue
            if re.match(r"(?i)^strain[_\s-]?\d+$", s) or s.lower() in {"unknown", "n/a", "na", "none"}:
                anon += 1
                continue
            named2 += 1
            strains2[s] += 1
            tt = (row.get("Test Type Name") or "").lower()
            if "thc" in tt:
                thc2 += 1
            if i % 100_000 == 0:
                print(f"  scanned {i} named={named2} anon={anon}", flush=True)
    print(f"DONE named={named2} anon={anon} thc_rows={thc2} unique={len(strains2)}")
    print("top", strains2.most_common(20))


if __name__ == "__main__":
    main()
