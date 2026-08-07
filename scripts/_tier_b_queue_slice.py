#!/usr/bin/env python3
"""Print Tier B first/second half slice from the 1482 queue."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.json"


def main() -> int:
    half = (sys.argv[1] if len(sys.argv) > 1 else "first").lower()
    d = json.loads(QUEUE.read_text(encoding="utf-8"))
    b = list(d.get("tiers", {}).get("B") or [])
    a = list(d.get("tiers", {}).get("A") or [])
    n = len(b)
    mid = (n + 1) // 2
    slice_ = b[:mid] if half.startswith("f") else b[mid:]
    out = {
        "queue": str(QUEUE),
        "partial": d.get("partial"),
        "counts": d.get("counts"),
        "tier_a_names": [x.get("name") for x in a],
        "tier_b_total": n,
        "half": half,
        "slice_n": len(slice_),
        "slice": slice_,
    }
    print(json.dumps(out, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
