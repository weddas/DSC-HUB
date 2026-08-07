#!/usr/bin/env python3
"""Ensure queue partitions include Tier C halves (first=0:311, second=311:621)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.json"


def main() -> int:
    d = json.loads(QUEUE.read_text(encoding="utf-8"))
    c = list(d.get("tiers", {}).get("C") or [])
    n = len(c)
    mid = (n + 1) // 2
    parts = d.setdefault("partitions", {})
    parts["tier_C_first_half"] = {"slice": [0, mid], "count": mid, "owner": "tier_c_first_half"}
    parts["tier_C_second_half"] = {
        "slice": [mid, n],
        "count": n - mid,
        "owner": "tier_c_second_half",
    }
    note = parts.get("note") or ""
    if "tiers.C" not in note:
        parts["note"] = (
            (note + " ").strip()
            + " Use tiers.C[start:end] — lists are ranked. "
            "tier_C_first_half / tier_C_second_half own non-overlapping slices."
        ).strip()
    QUEUE.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"tier_C={n} first={mid} second={n - mid}")
    print("first last:", c[mid - 1].get("name") if c else None)
    print("second first:", c[mid].get("name") if mid < n else None)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
