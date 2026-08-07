#!/usr/bin/env python3
from __future__ import annotations
import json, sqlite3, sys, time, traceback
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "brain"))
sys.path.insert(0, str(ROOT / "scripts"))
from dsc_brain.corpus import connect, corpus_stats, link_science_to_seed, rebuild_search_docs
from dsc_brain.paths import DEFAULT_DB, STAGING_DIR
from merge_staging_to_master import merge_one

LOG = ROOT / "brain" / "data" / "_cc_merge_result.log"
OUT = ROOT / "brain" / "data" / "_cc_merge_result.json"
STAGING = STAGING_DIR / "cannaconnection.sqlite3"

def log(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")

def main():
    LOG.write_text("", encoding="utf-8")
    log(f"EXCLUSIVE start staging={STAGING}")
    src = sqlite3.connect(str(STAGING), timeout=60)
    raw_n = src.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0]
    src.close()
    log(f"staging raw_record={raw_n}")

    for attempt in range(1, 31):
        m = None
        try:
            log(f"attempt {attempt} connect")
            # raw connect first to avoid meta-txn pragma issues
            raw = sqlite3.connect(str(DEFAULT_DB), timeout=60)
            raw.execute("PRAGMA busy_timeout=180000")
            raw.execute("BEGIN IMMEDIATE")
            raw.execute("CREATE TABLE IF NOT EXISTS _lock_ping(x INTEGER)")
            raw.execute("DELETE FROM _lock_ping")
            raw.execute("INSERT INTO _lock_ping(x) VALUES (1)")
            raw.commit()
            raw.close()
            log(f"attempt {attempt} lock acquired")

            m = connect(DEFAULT_DB, timeout=60.0)
            try:
                m.rollback()
            except Exception:
                pass
            m.execute("PRAGMA busy_timeout=180000")
            try:
                m.execute("PRAGMA synchronous=NORMAL")
            except sqlite3.OperationalError:
                m.rollback()
                m.execute("PRAGMA synchronous=NORMAL")

            before = corpus_stats(m)
            log(f"BEFORE {json.dumps(before)}")
            st = merge_one(m, STAGING, include_raw=False)
            m.commit()
            log(f"MERGE_OK {json.dumps(st)}")
            links = {}
            try:
                links = link_science_to_seed(m)
                log(f"LINKS {links}")
            except Exception as e:
                log(f"LINK_FAIL {e}")
            docs = 0
            try:
                docs = rebuild_search_docs(m)
                m.commit()
                log(f"SEARCH_DOCS {docs}")
            except Exception as e:
                log(f"SEARCH_FAIL {e}")
            after = corpus_stats(m)
            log(f"AFTER {json.dumps(after)}")
            m.close()
            result = {
                "family": "cannaconnection",
                "status": "ok",
                "staging_raw": raw_n,
                "merged": st,
                "before": before,
                "after": after,
                "links": links,
                "search_docs": docs,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "note": "exclusive in-process merge via merge_one (CLI exits -1 under contention)",
            }
            OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
            log("DONE")
            print(json.dumps(result, indent=2), flush=True)
            return 0
        except Exception as e:
            log(f"attempt {attempt} FAIL {type(e).__name__}: {e}")
            with LOG.open("a", encoding="utf-8") as f:
                f.write(traceback.format_exc() + "\n")
            if m is not None:
                try:
                    m.close()
                except Exception:
                    pass
            time.sleep(10)
    log("GIVE_UP")
    return 1

if __name__ == "__main__":
    raise SystemExit(main())
