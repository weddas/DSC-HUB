#!/usr/bin/env python3
"""Resume/expand Tier B first-half scrape against the live queue file."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
QUEUE = DATA / "_breeder_scrape_queue_1482.json"
RESULTS = DATA / "_tier_b_first_half_results.json"
DONE_NAMES = DATA / "_tier_b_first_half_done_names.json"
SLICE = DATA / "_tier_b_first_half_slice_live.json"

CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    q = json.loads(QUEUE.read_text(encoding="utf-8"))
    b = list(q.get("tiers", {}).get("B") or [])
    mid = (len(b) + 1) // 2
    slice_ = b[:mid]

    done: set[str] = set()
    if RESULTS.exists():
        prev = json.loads(RESULTS.read_text(encoding="utf-8"))
        for r in prev.get("results") or []:
            n = str(r.get("name") or "").strip().lower()
            if n:
                done.add(n)
    if DONE_NAMES.exists():
        for n in json.loads(DONE_NAMES.read_text(encoding="utf-8")) or []:
            done.add(str(n).strip().lower())

    remaining = [e for e in slice_ if str(e.get("name") or "").strip().lower() not in done]
    SLICE.write_text(
        json.dumps(
            {
                "counts": q.get("counts"),
                "partial": q.get("partial"),
                "first_half_n": len(slice_),
                "already_done": sorted(done),
                "remaining_n": len(remaining),
                "remaining": remaining,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(
        f"live Tier B={q.get('counts', {}).get('tier_B')} first_half={len(slice_)} "
        f"done={len(done)} remaining={len(remaining)} partial={q.get('partial')}",
        flush=True,
    )
    if not remaining:
        print("nothing remaining", flush=True)
        return 0

    # Write a temporary queue override consumed by scrape script via env? 
    # Instead: invoke scrape_breeder_tier_b with --from-json
    tmp = DATA / "_tier_b_first_half_remaining.json"
    tmp.write_text(json.dumps(remaining, indent=2, ensure_ascii=False), encoding="utf-8")
    cmd = [
        sys.executable,
        str(ROOT / "scripts" / "scrape_breeder_tier_b.py"),
        "--from-json",
        str(tmp),
        "--owner",
        "tier_b_first_half",
        "--delay",
        "0.65",
        "--max-html",
        "350",
        "--results-out",
        str(DATA / "_tier_b_first_half_results_pass2.json"),
        "--progress-out",
        str(DATA / "_tier_b_first_half_progress_pass2.json"),
        "--merge-done",
        str(RESULTS),
    ]
    kw: dict = {}
    if sys.platform == "win32":
        kw["creationflags"] = CREATE_NO_WINDOW
    print("launching", " ".join(cmd), flush=True)
    # Run inline (this wrapper itself should be launched hidden)
    return subprocess.call(cmd, cwd=str(ROOT), **kw)


if __name__ == "__main__":
    raise SystemExit(main())
