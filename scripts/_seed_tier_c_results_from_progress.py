#!/usr/bin/env python3
"""Seed Tier C results from progress (crash recovery) + verify UTF-8 stdout fix."""
from __future__ import annotations

import json
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"
PROGRESS = DATA / "_tier_c_first_half_progress.json"
RESULTS = DATA / "_tier_c_first_half_results.json"


def main() -> int:
    if not PROGRESS.exists():
        print("no progress file")
        return 1
    prog = json.loads(PROGRESS.read_text(encoding="utf-8"))
    results = list(prog.get("results") or [])
    by_status: dict[str, int] = {}
    for r in results:
        st = str(r.get("status") or "?")
        by_status[st] = by_status.get(st, 0) + 1
    summary = {
        "finished_at": None,
        "owner": prog.get("owner") or "tier_c_first_half",
        "half": "first",
        "partial": True,
        "note": "seeded from progress after UnicodeEncodeError crash; resume will continue",
        "attempted": len(results),
        "ok": sum(1 for r in results if r.get("status") == "ok"),
        "items_total": sum(int(r.get("items") or 0) for r in results),
        "by_status": by_status,
        "results": results,
    }
    RESULTS.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"seeded {RESULTS.name}: attempted={summary['attempted']} ok={summary['ok']} items={summary['items_total']}")
    print("by_status", by_status)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
