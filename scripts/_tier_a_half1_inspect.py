#!/usr/bin/env python3
"""Inspect Tier A queue and emit first-half claim list (A–M / first half)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
Q = ROOT / "homeassistant" / "data" / "_breeder_scrape_queue_1482.json"
OUT = ROOT / "homeassistant" / "data" / "_tier_a_half1_claim.json"


def main() -> int:
    q = json.loads(Q.read_text(encoding="utf-8"))
    print("partial", q.get("partial"))
    print("counts", json.dumps(q.get("counts"), indent=2))
    print("notes", q.get("notes"))
    A = q["tiers"]["A"]
    print("tier_A", len(A))
    for i, e in enumerate(A):
        print(
            f"{i:3d} {e.get('name')!r:42s} plat={e.get('platform')!s:12s} "
            f"url={e.get('url')} signals={e.get('signals')}"
        )
    # Prefer alphabetical A–M by name; else first half of list
    am = [
        e
        for e in A
        if (e.get("name") or "")[:1].upper() in "ABCDEFGHIJKLM"
        or (
            (e.get("name") or "")[:1].isdigit()
            and True  # numeric names go with first half
        )
    ]
    # Numeric + A–M
    first = []
    for e in A:
        ch = (e.get("name") or "Z")[0].upper()
        if ch.isdigit() or ("A" <= ch <= "M"):
            first.append(e)
    if not first:
        mid = max(1, len(A) // 2)
        first = A[:mid]
    # Claim file for siblings
    claim = {
        "owner": "tier_a_half1",
        "queue_built_at": q.get("built_at"),
        "queue_partial": q.get("partial"),
        "tier_A_total": len(A),
        "claimed": first,
        "claimed_names": [e.get("name") for e in first],
    }
    OUT.write_text(json.dumps(claim, indent=2), encoding="utf-8")
    print("claimed", len(first), "->", OUT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
