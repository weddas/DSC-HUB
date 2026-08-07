#!/usr/bin/env python3
"""Probe bank/directory HTML for product link patterns."""

from __future__ import annotations

import re
import urllib.request

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}


def grab(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def main() -> None:
    pages = {
        "cropking": "https://www.cropkingseeds.com/collections/all",
        "seedsupreme": "https://seedsupreme.com/",
        "zamnesia": "https://www.zamnesia.com/",
        "alchimia": "https://www.alchimiaweb.com/en/",
        "attitude": "https://www.attitudeseedbank.com/",
        "greenhouse": "https://www.greenhouseseeds.nl/",
        "cannaconnection": "https://www.cannaconnection.com/strains",
        "hytiva": "https://www.hytiva.com/strains",
    }
    for name, url in pages.items():
        try:
            html = grab(url)
        except Exception as exc:  # noqa: BLE001
            print(name, "FAIL", exc)
            continue
        hrefs = re.findall(r'href=["\']([^"\']+)["\']', html, re.I)
        interesting = [
            h
            for h in hrefs
            if any(k in h.lower() for k in ("product", "strain", "seed", "/p-", "femin"))
        ]
        print(f"=== {name} hrefs={len(hrefs)} interesting={len(interesting)}")
        for h in interesting[:25]:
            print(" ", h)


if __name__ == "__main__":
    main()
