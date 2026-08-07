#!/usr/bin/env python3
"""Rewrite Tier A half-1 claim: first half of sorted Tier A (stable)."""

from __future__ import annotations

import json
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
QUEUE = DATA / "_breeder_scrape_queue_1482.json"
CLAIM = DATA / "_tier_a_half1_claim.json"
RESULTS = DATA / "_tier_a_half1_results.json"

# Already covered / mid-flight — never claim
EXCLUDE = {
    "multiverse beans",
    "weed seeds express",
    "alchimia grow shop",
    "hytiva",
    "cannaconnection",
    "seedsman",
    "royal queen seeds",
    "fast buds",
    "barney's farm",
    "mephisto genetics",
    "dna genetics",
    "dna genetics seeds",
    "dutch passion",
    "greenhouse seed company",
    "ilgm",
    "seedsupreme",
    "pacific seed bank",
    "true north seedbank",
    "crop king seeds",
    "dc seed exchange",
    "zamnesia",
    "herbies",
    "herbies seeds",
}


def main() -> int:
    q = json.loads(QUEUE.read_text(encoding="utf-8"))
    A = [
        e
        for e in (q.get("tiers", {}).get("A") or [])
        if (e.get("name") or "").lower().strip() not in EXCLUDE
    ]
    A_sorted = sorted(A, key=lambda e: (e.get("name") or "").lower())
    mid = max(1, (len(A_sorted) + 1) // 2)
    claimed = A_sorted[:mid]
    # Also prefer sticking to A–M when sibling owns N–Z
    letters = {(e.get("name") or "Z")[0].upper() for e in A_sorted}
    if any(ch.isalpha() and ch >= "N" for ch in letters):
        claimed = [
            e
            for e in A_sorted
            if (e.get("name") or "Z")[0].isdigit()
            or ("A" <= (e.get("name") or "Z")[0].upper() <= "M")
        ]
        # If A–M is huge, take first half of A–M only (sibling may also scrape late A–M
        # as their 'second half' of Tier A — split A–M in half to avoid overlap)
        if len(claimed) > 40:
            mid_am = max(1, (len(claimed) + 1) // 2)
            claimed = claimed[:mid_am]

    doc = {
        "owner": "tier_a_half1",
        "queue_built_at": q.get("built_at"),
        "queue_partial": q.get("partial"),
        "tier_A_total": len(A),
        "claimed_count": len(claimed),
        "claimed_names": [e.get("name") for e in claimed],
        "claimed": claimed,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "note": "first half of Tier A A-M (sorted); excludes covered banks",
    }
    CLAIM.write_text(json.dumps(doc, indent=2), encoding="utf-8")
    # Reset results so we re-attempt charmap victims
    if RESULTS.exists():
        RESULTS.write_text(
            json.dumps(
                {
                    "updated_at": doc["updated_at"],
                    "attempted": 0,
                    "succeeded": 0,
                    "total_items": 0,
                    "results": [],
                },
                indent=2,
            ),
            encoding="utf-8",
        )
    print(f"claimed {len(claimed)} / tierA {len(A)}")
    for n in doc["claimed_names"]:
        print(" ", n)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
