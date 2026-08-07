#!/usr/bin/env python3
"""Probe DoltHub cannabis repos for usable refs/tables."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request

UA = "DSC-HUB-catalog-research/0.1"


def get(url: str) -> dict | str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return raw[:500]


def main() -> None:
    base = "https://www.dolthub.com/api/v1alpha1/Liquidata/cannabis-testing-wa"
    print("root", get(base))
    for ref in ("master", "main", "HEAD"):
        sql = urllib.parse.quote("SHOW TABLES")
        url = f"{base}/{ref}?q={sql}"
        try:
            doc = get(url)
            print(ref, doc if isinstance(doc, dict) else doc)
        except Exception as exc:  # noqa: BLE001
            print(ref, "ERR", exc)

    # HTML scrape repo page for table names / clone hint
    for path in (
        "https://www.dolthub.com/repositories/Liquidata/cannabis-testing-wa",
        "https://www.dolthub.com/repositories/liquidata-samples/marijuana_data",
    ):
        req = urllib.request.Request(path, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        print(path, "len", len(html))
        for needle in ("dolt clone", "leafly", "SHOW TABLES", "branch", "master", "main"):
            if needle in html.lower() or needle in html:
                print("  has", needle)


if __name__ == "__main__":
    main()
