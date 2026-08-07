#!/usr/bin/env python3
"""Progress report for tier_A_first_half scrape."""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
STAGING = ROOT / "brain" / "data" / "staging"


def slugify(name: str) -> str:
    s = (name or "").lower().strip().replace("&", " and ").replace("'", "")
    s = re.sub(r"[^\w\s\-]+", " ", s)
    s = re.sub(r"\s+", "-", s.strip())
    return re.sub(r"-+", "-", s).strip("-")[:60]


def main() -> int:
    claim = json.loads((DATA / "_tier_a_half1_claim.json").read_text(encoding="utf-8"))
    results_path = DATA / "_tier_a_half1_results.json"
    d = json.loads(results_path.read_text(encoding="utf-8")) if results_path.exists() else {}
    results = d.get("results") or []
    print(f"partition={claim.get('partition')} claimed={claim.get('claimed_count')}")
    print(
        f"attempted={d.get('attempted')} ok={d.get('succeeded')} "
        f"items={d.get('total_items')} remaining="
        f"{claim.get('claimed_count', 0) - len(results)}"
    )
    print("statuses", dict(Counter(r.get("status") for r in results)))
    print("--- OK ---")
    for r in results:
        if r.get("status") == "ok":
            print(
                f"  {int(r.get('count') or 0):5d}  {r.get('name')}  "
                f"({r.get('slug')}) mode={r.get('mode')}"
            )
    print("--- skip/fail ---")
    for r in results:
        if r.get("status") != "ok":
            print(f"  {r.get('status'):22s}  {r.get('name')}  err={r.get('error')}")
    print("--- staging ---")
    for name in claim.get("claimed_names") or []:
        sl = slugify(name)
        for cand in (f"bank_{sl}.sqlite3", f"bank_{sl.replace('-', '_')}.sqlite3"):
            p = STAGING / cand
            if p.exists():
                print(f"  {p.name}  {p.stat().st_size}")
                break
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
