#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
ST = ROOT / "brain" / "data" / "staging"


def main() -> int:
    q = json.loads((DATA / "_breeder_scrape_queue_1482.json").read_text(encoding="utf-8"))
    start, end = q["partitions"]["tier_B_first_half"]["slice"]
    part = q["tiers"]["B"][start:end]
    print("partition", len(part), "slice", [start, end], "partial", q.get("partial"))

    prog = DATA / "_tier_b_first_half_progress.json"
    res = DATA / "_tier_b_first_half_results.json"
    rs = []
    finished = None
    if res.exists():
        rf = json.loads(res.read_text(encoding="utf-8"))
        finished = rf.get("finished_at")
        rs = list(rf.get("results") or [])
        print(
            "results_file finished=%s attempted=%s ok=%s items=%s by=%s"
            % (
                finished,
                rf.get("attempted"),
                rf.get("ok"),
                rf.get("items_total"),
                rf.get("by_status"),
            )
        )
    if prog.exists():
        d = json.loads(prog.read_text(encoding="utf-8"))
        if not rs:
            rs = list(d.get("results") or [])
        print(
            "progress done=%s pass=%s todo=%s"
            % (len(d.get("results") or []), d.get("pass"), d.get("todo_n"))
        )

    by = {str(x.get("name") or ""): x for x in rs}
    print("by_status", dict(Counter(x.get("status") for x in rs)))
    dump_total = 0
    staged_total = 0
    print("name | status | dump | staging | method")
    for e in part:
        n = e.get("name")
        row = by.get(str(n))
        if not row:
            print("%s | MISSING | - | - | -" % n)
            continue
        items = int(row.get("items") or 0)
        dump_total += items if row.get("status") == "ok" else 0
        bank = str(row.get("bank") or "")
        st = ST / f"{bank}.sqlite3"
        sc = 0
        if st.exists():
            try:
                con = sqlite3.connect(f"file:{st}?mode=ro", uri=True)
                sc = int(con.execute("select count(*) from raw_record").fetchone()[0])
                con.close()
            except Exception as exc:  # noqa: BLE001
                sc = -1
                print("  staging err", bank, exc)
        if sc > 0:
            staged_total += sc
        print(
            "%s | %s | %s | %s | %s"
            % (n, row.get("status"), items, sc, row.get("method"))
        )
    print("TOTAL ok_dump_items", dump_total, "staging_raw_records", staged_total)
    missing = [e.get("name") for e in part if str(e.get("name")) not in by]
    if missing:
        print("missing_from_results", missing)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
