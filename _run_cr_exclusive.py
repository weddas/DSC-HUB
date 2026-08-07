#!/usr/bin/env python3
from __future__ import annotations
import json, sqlite3, sys, time, traceback
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))
from brain.dsc_brain.corpus import connect, link_science_to_seed, rebuild_search_docs
from brain.dsc_brain.paths import DEFAULT_DB
from merge_staging_to_master import merge_one

LOG = ROOT / "brain" / "data" / "_cr_exclusive.log"
OUT = ROOT / "brain" / "data" / "_cr_merge_result.json"
STAGING = ROOT / "brain" / "data" / "staging" / "cannareviews.sqlite3"

def log(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")

def main() -> int:
    LOG.write_text("", encoding="utf-8")
    log(f"EXCLUSIVE cannareviews start staging={STAGING} size={STAGING.stat().st_size}")
    src = sqlite3.connect(str(STAGING), timeout=60)
    # counts
    tables = [r[0] for r in src.execute("SELECT name FROM sqlite_master WHERE type='table'")]
    staging_counts = {}
    for t in tables:
        try:
            staging_counts[t] = src.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        except Exception:
            pass
    sids = [r[0] for r in src.execute("SELECT id FROM source_record")]
    src.close()
    log(f"staging_counts={staging_counts} source_ids={sids}")

    for attempt in range(1, 60):
        m = None
        try:
            log(f"attempt {attempt} acquire lock")
            raw = sqlite3.connect(str(DEFAULT_DB), timeout=30)
            raw.execute("PRAGMA busy_timeout=30000")
            raw.execute("BEGIN IMMEDIATE")
            raw.execute("CREATE TABLE IF NOT EXISTS _lock_ping(x INTEGER)")
            raw.execute("DELETE FROM _lock_ping")
            raw.execute("INSERT INTO _lock_ping(x) VALUES (1)")
            raw.commit()
            raw.close()
            log(f"attempt {attempt} lock acquired")

            m = connect(DEFAULT_DB, timeout=120.0)
            try:
                m.rollback()
            except Exception:
                pass
            m.execute("PRAGMA busy_timeout=600000")
            try:
                m.execute("PRAGMA synchronous=NORMAL")
            except sqlite3.OperationalError:
                m.rollback()
                m.execute("PRAGMA synchronous=NORMAL")

            log(f"attempt {attempt} merge_one")
            st = merge_one(m, STAGING, include_raw=False)
            m.commit()
            log(f"MERGE_OK {json.dumps(st, default=str)}")

            by = {}
            for sid in sids:
                row = m.execute("SELECT id,name FROM source_record WHERE id=?", (sid,)).fetchone()
                by[sid] = {
                    "source": list(row) if row else None,
                    "variant": m.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (sid,)).fetchone()[0],
                    "chem": m.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (sid,)).fetchone()[0],
                    "grow": m.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id=?", (sid,)).fetchone()[0],
                    "links": m.execute("SELECT COUNT(*) FROM entity_link WHERE source_id=?", (sid,)).fetchone()[0],
                }
            links = {}
            docs = 0
            try:
                links = link_science_to_seed(m)
                m.commit()
                log(f"LINKS {links}")
            except Exception as e:
                log(f"LINK_FAIL {e}")
            try:
                docs = rebuild_search_docs(m)
                m.commit()
                log(f"SEARCH_DOCS {docs}")
            except Exception as e:
                log(f"SEARCH_FAIL {e}")
            m.close()
            result = {
                "family": "cannareviews",
                "status": "ok",
                "staging_counts": staging_counts,
                "merged": st,
                "by_source": by,
                "links": links,
                "search_docs": docs,
                "attempt": attempt,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "note": "full review text still pending medauth; not blocking. in-process merge_one (CLI exits -1 under contention)",
            }
            OUT.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
            (ROOT / "brain" / "data" / "_cr_merge_out.txt").write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
            log("DONE")
            print(json.dumps(result, indent=2, default=str), flush=True)
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
            time.sleep(20)
    log("GIVE_UP")
    return 1

if __name__ == "__main__":
    raise SystemExit(main())
