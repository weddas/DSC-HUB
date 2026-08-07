#!/usr/bin/env python3
"""Exclusive cannaconnection merge with lock retries (no --reset)."""
from __future__ import annotations

import json
import sqlite3
import sys
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "brain"))
sys.path.insert(0, str(ROOT / "scripts"))

from dsc_brain.corpus import connect, corpus_stats, link_science_to_seed, rebuild_search_docs
from dsc_brain.paths import DEFAULT_DB, STAGING_DIR
from merge_staging_to_master import merge_one

LOG = ROOT / "brain" / "data" / "_cc_merge_result.log"
OUT = ROOT / "brain" / "data" / "_cc_merge_result.json"
FAMILY = "cannaconnection"
STAGING = STAGING_DIR / f"{FAMILY}.sqlite3"


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def open_master():
    m = connect(DEFAULT_DB, timeout=120.0)
    try:
        m.rollback()
    except Exception:
        pass
    m.execute("PRAGMA busy_timeout=300000")
    try:
        m.execute("PRAGMA synchronous=NORMAL")
    except sqlite3.OperationalError:
        m.rollback()
        m.execute("PRAGMA synchronous=NORMAL")
    m.execute("PRAGMA temp_store=MEMORY")
    m.execute("BEGIN IMMEDIATE")
    m.execute("CREATE TABLE IF NOT EXISTS _lock_ping(x INTEGER)")
    m.execute("DELETE FROM _lock_ping")
    m.execute("INSERT INTO _lock_ping(x) VALUES (1)")
    m.commit()
    return m


def safe_stats(m, label: str, attempts: int = 30):
    for i in range(attempts):
        try:
            return corpus_stats(m)
        except sqlite3.OperationalError as e:
            log(f"STATS_WAIT {label} {i}: {e}")
            time.sleep(5)
            try:
                m.rollback()
            except Exception:
                pass
    raise RuntimeError(f"stats failed for {label}")


def attempt_merge(round_i: int) -> dict:
    log(f"ROUND {round_i} open_master")
    m = open_master()
    log(f"ROUND {round_i} OPEN_OK")
    before = safe_stats(m, "before")
    log(f"BEFORE {json.dumps(before)}")
    st = merge_one(m, STAGING, include_raw=False)
    m.commit()
    log(f"MERGE_OK {json.dumps(st)}")
    links = None
    docs = None
    try:
        links = link_science_to_seed(m)
        log(f"LINKS {links}")
    except Exception as e:
        log(f"LINK_FAIL {e}")
    try:
        docs = rebuild_search_docs(m)
        m.commit()
        log(f"SEARCH_DOCS {docs}")
    except Exception as e:
        log(f"SEARCH_FAIL {e}")
    after = safe_stats(m, "after")
    log(f"AFTER {json.dumps(after)}")
    try:
        m.close()
    except Exception:
        pass
    return {
        "family": FAMILY,
        "status": "ok",
        "merged": st,
        "before": before,
        "after": after,
        "links": links,
        "search_docs": docs,
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    log(f"start family={FAMILY} staging={STAGING} exists={STAGING.exists()}")
    if not STAGING.exists():
        log("FAIL missing staging")
        return 2
    src = sqlite3.connect(str(STAGING), timeout=60)
    try:
        raw_n = src.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0]
    except Exception:
        raw_n = None
    src.close()
    log(f"staging raw_record={raw_n}")

    last_err = None
    for round_i in range(1, 91):  # up to ~90 attempts
        try:
            result = attempt_merge(round_i)
            result["staging_raw"] = raw_n
            OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
            log("DONE wrote " + str(OUT))
            print(json.dumps(result, indent=2), flush=True)
            return 0
        except Exception as e:
            last_err = e
            log(f"ROUND {round_i} FAIL {type(e).__name__}: {e}")
            with LOG.open("a", encoding="utf-8") as f:
                f.write(traceback.format_exc() + "\n")
            sleep_s = 15 if "locked" in str(e).lower() or "busy" in str(e).lower() else 8
            log(f"sleep {sleep_s}s")
            time.sleep(sleep_s)

    result = {"family": FAMILY, "status": "failed", "error": str(last_err), "staging_raw": raw_n}
    OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    log(f"GIVE_UP {last_err}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
