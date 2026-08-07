#!/usr/bin/env python3
"""Forum-only staging->master merge with faulthandler; skip init_corpus/connect helper."""
from __future__ import annotations
import faulthandler
import json
import sqlite3
import sys
import time
import traceback
from pathlib import Path

faulthandler.enable()
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

LOG = ROOT / "_forum_progress.log"
OUT = ROOT / "_forum_merge_results.json"
HB = ROOT / "_forum_hb.txt"
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
STAGING = ROOT / "brain" / "data" / "staging"
FAMILIES = ["forum_420mag", "forum_phenohunter", "forum_mjpassion"]

def L(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg}".rstrip() + "\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(line)
    HB.write_text(time.strftime("%H:%M:%S"), encoding="utf-8")

def open_master(retries: int = 120):
    for i in range(1, retries + 1):
        try:
            c = sqlite3.connect(str(MASTER), timeout=20)
            c.row_factory = sqlite3.Row
            c.execute("PRAGMA busy_timeout=20000")
            c.execute("UPDATE meta SET value=value WHERE key='corpus_schema_version'")
            c.commit()
            c.execute("PRAGMA busy_timeout=300000")
            L(f"OPEN_OK attempt={i}")
            return c
        except Exception as e:
            L(f"OPEN_WAIT {i}: {type(e).__name__}: {e}")
            try:
                c.close()
            except Exception:
                pass
            time.sleep(15)
    raise SystemExit("could not open master")

def main() -> int:
    LOG.write_text("", encoding="utf-8")
    L("start forum merge")
    from merge_staging_to_master import merge_one
    from brain.dsc_brain.corpus import corpus_stats

    master = open_master()
    before = corpus_stats(master)
    L("BEFORE " + json.dumps(before, default=str))
    results = []
    for fam in FAMILIES:
        path = STAGING / f"{fam}.sqlite3"
        L(f"MERGE {fam} exists={path.is_file()} size={path.stat().st_size if path.is_file() else 0}")
        for attempt in range(1, 16):
            try:
                st = merge_one(master, path, include_raw=False)
                master.commit()
                L(f"OK {fam} attempt={attempt} " + json.dumps(st, default=str))
                results.append({"family": fam, "status": "ok", "attempt": attempt, **st})
                break
            except Exception as e:
                L(f"FAIL {fam} attempt={attempt}: {e}")
                L(traceback.format_exc())
                try:
                    master.rollback()
                except Exception:
                    pass
                if "locked" in str(e).lower() or "busy" in str(e).lower():
                    time.sleep(min(45, 5 * attempt))
                    continue
                results.append({"family": fam, "status": "error", "error": str(e)})
                break
        else:
            results.append({"family": fam, "status": "gave_up"})

    after = corpus_stats(master)
    verify = {}
    for fam in FAMILIES:
        verify[fam] = {
            "source_record": master.execute("SELECT COUNT(*) FROM source_record WHERE id=?", (fam,)).fetchone()[0],
            "grow_trait": master.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id=?", (fam,)).fetchone()[0],
            "strain_variant": master.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (fam,)).fetchone()[0],
            "chemistry_profile": master.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (fam,)).fetchone()[0],
            "entity_link": master.execute("SELECT COUNT(*) FROM entity_link WHERE source_id=?", (fam,)).fetchone()[0],
        }
    master.close()
    out = {"results": results, "before": before, "after": after, "verify": verify, "ha_indexes": "skipped"}
    OUT.write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
    L("SUMMARY " + json.dumps(out, indent=2, default=str))
    ok = all(r.get("status") == "ok" for r in results)
    L("DONE ok=" + str(ok))
    return 0 if ok else 1

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except Exception as e:
        L("FATAL " + type(e).__name__ + ": " + str(e))
        L(traceback.format_exc())
        raise SystemExit(1)
