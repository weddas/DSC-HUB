#!/usr/bin/env python3
"""Merge alchimia when unlocked. Never --reset."""
from __future__ import annotations

import json
import sqlite3
import sys
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
LOG = ROOT / "brain" / "data" / "_alchimia_merge_live.txt"
RESULT = ROOT / "brain" / "data" / "_alchimia_merge_result.json"
HB = ROOT / "brain" / "data" / "_alchimia_hb.txt"


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
    print(line, flush=True)
    for p in (LOG, HB):
        with p.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
            f.flush()


def wait_unlock(max_polls: int = 360) -> bool:
    for i in range(1, max_polls + 1):
        try:
            c = sqlite3.connect(str(MASTER), timeout=2)
            c.execute("BEGIN IMMEDIATE")
            c.rollback()
            c.close()
            log(f"unlocked poll={i}")
            return True
        except Exception as e:
            if i == 1 or i % 3 == 0:
                log(f"locked poll={i} {e}")
            time.sleep(10)
    return False


def alchimia_stats(conn: sqlite3.Connection) -> dict:
    stats = {}
    for key, sql in {
        "source_record": "SELECT COUNT(*) FROM source_record WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'",
        "chem": "SELECT COUNT(*) FROM chemistry_profile WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'",
        "grow": "SELECT COUNT(*) FROM grow_trait WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'",
        "variant": "SELECT COUNT(*) FROM strain_variant WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'",
        "links": "SELECT COUNT(*) FROM entity_link WHERE lower(COALESCE(source_id,'')) LIKE '%alchimia%'",
    }.items():
        try:
            stats[key] = conn.execute(sql).fetchone()[0]
        except Exception as e:
            stats[key] = str(e)
    return stats


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    HB.write_text("", encoding="utf-8")
    log("alchimia merge v2 start")
    if not wait_unlock():
        RESULT.write_text(json.dumps({"ok": False, "error": "locked"}), encoding="utf-8")
        return 2

    # settle briefly but keep heartbeating
    for s in range(3):
        time.sleep(1)
        log(f"settle {s+1}/3")

    log("importing")
    from merge_staging_to_master import main as merge_main
    from brain.dsc_brain.corpus import connect, corpus_stats
    log("imports ok")

    before_stats = {}
    try:
        m = connect(MASTER, timeout=30)
        before_stats = alchimia_stats(m)
        m.close()
        log(f"before_alc {json.dumps(before_stats)}")
    except Exception as e:
        log(f"before_alc skip {e}")

    # Full merge including search/link (user asked for merge into master)
    log("calling merge_main --only alchimia")
    try:
        rc = merge_main(["--only", "alchimia"])
    except Exception:
        tb = traceback.format_exc()
        log(tb)
        RESULT.write_text(json.dumps({"ok": False, "tb": tb}, indent=2), encoding="utf-8")
        return 1

    log(f"merge rc={rc}")
    try:
        m = connect(MASTER, timeout=120)
        after = corpus_stats(m)
        after_stats = alchimia_stats(m)
        m.close()
    except Exception as e:
        after, after_stats = {}, {"err": str(e)}
        log(f"after fail {e}")

    payload = {
        "ok": int(rc or 0) == 0,
        "rc": rc,
        "before_alchimia": before_stats,
        "after": after,
        "after_alchimia": after_stats,
        "finished_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    RESULT.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")
    log("DONE " + json.dumps({"ok": payload["ok"], "after_alchimia": after_stats}))
    return 0 if int(rc or 0) == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
