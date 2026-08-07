#!/usr/bin/env python3
"""List host-validated Tier A N–Z Shopify targets from queue for fast fan-out."""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
Q = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.json"


def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^\w\s\-]+", " ", s)
    s = re.sub(r"\s+", "-", s.strip())
    return re.sub(r"-+", "-", s).strip("-")


def host_key(h: str) -> str:
    h = (h or "").lower()
    return h[4:] if h.startswith("www.") else h


def ok(url: str, name: str) -> bool:
    host = host_key(urlparse(url).hostname or "")
    if any(j in host or j in url.lower() for j in ("hugedomains", "godaddy", "google.", "wordpress.com")):
        return False
    tokens = [
        t
        for t in slugify(name).split("-")
        if t not in {"seeds", "seed", "genetics", "genetix", "company", "co", "bank", "the", "of", "and"}
        and len(t) >= 3
    ]
    compact = host.replace("-", "").replace(".", "")
    return any(t in compact for t in tokens) if tokens else False


def main() -> None:
    q = json.loads(Q.read_text(encoding="utf-8"))
    rows = []
    for r in q.get("tiers", {}).get("A", []):
        name = r.get("name") or ""
        if not name or not name[0].isalpha() or name[0].upper() < "N":
            continue
        url = r.get("url") or ""
        if r.get("platform") != "shopify":
            continue
        if not ok(url, name):
            continue
        rows.append((slugify(name), name, url))
    print("shopify_nz", len(rows))
    for slug, name, url in rows:
        print(f"{slug}\t{url}")


if __name__ == "__main__":
    main()
