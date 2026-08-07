#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "homeassistant" / "data"


def main() -> int:
    p = DATA / "_tier_b_first_half_progress.json"
    r = DATA / "_tier_b_first_half_results.json"
    if p.exists():
        d = json.loads(p.read_text(encoding="utf-8"))
        rs = d.get("results") or []
        print(
            "progress pass=%s todo=%s slice=%s done=%s"
            % (d.get("pass"), d.get("todo_n"), d.get("slice_n"), len(rs))
        )
        print("by_status", dict(Counter(x.get("status") for x in rs)))
        print("items", sum(int(x.get("items") or 0) for x in rs))
        for x in rs:
            note = (x.get("note") or "")[:70]
            print(
                " ",
                x.get("name"),
                x.get("status"),
                "items=",
                x.get("items"),
                x.get("method"),
                note,
            )
    if r.exists():
        d = json.loads(r.read_text(encoding="utf-8"))
        print(
            "results_file attempted=%s ok=%s items=%s by=%s finished=%s"
            % (
                d.get("attempted"),
                d.get("ok"),
                d.get("items_total"),
                d.get("by_status"),
                d.get("finished_at"),
            )
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
