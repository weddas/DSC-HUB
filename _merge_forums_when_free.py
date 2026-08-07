#!/usr/bin/env python3
"""Wait for master unlock, then merge forum_* families one-by-one (no --reset, no HA)."""
from __future__ import annotations

import json
import sys
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[0]
# script is in repo root as _merge_forums_when_free.py
if (ROOT / "scripts" / "merge_staging_to_master.py").exists():
    pass
else:
    ROOT = Path(__file__).resolve().parents[1]

sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

LOG = ROOT / "_merge_forums_when_free.log"

def log(msg: str) -> None:
    line = msg.rstrip() + "\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(line)

FAMILIES = ["forum_420mag", "forum_phenohunter", "forum_mjpassion"]

def main() -> int:
    LOG.write_text("", encoding="utf-8")
    from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus
    from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
    from merge_staging_to_master import merge_one

    log(f"START families={FAMILIES}")
    log(f"master={DEFAULT_DB}")

    # Wait for write lock
    master = None
    for i in range(1, 121):  # up to ~60 min at 30s
        try:
            init_corpus(DEFAULT_DB)
            master = connect(DEFAULT_DB, timeout=30.0)
            master.execute("PRAGMA busy_timeout=300000")
            master.execute("BEGIN IMMEDIATE")
            master.execute("COMMIT")
            log(f"MASTER_OPEN ok attempt={i}")
            break
        except Exception as exc:
            log(f"MASTER_OPEN wait {i}: {exc}")
            try:
                if master is not None:
                    master.close()
            except Exception:
                pass
            master = None
            time.sleep(30)
    if master is None:
        log("GAVE_UP could not open master")
        return 2

    before = corpus_stats(master)
    log("BEFORE " + json.dumps(before, default=str))

    results = []
    for fam in FAMILIES:
        path = STAGING_DIR / f"{fam}.sqlite3"
        log(f"MERGE {fam} path={path} exists={path.is_file()}")
        if not path.is_file():
            results.append({"family": fam, "status": "missing"})
            continue
        # retry per family if locked mid-run
        ok = False
        for attempt in range(1, 16):
            try:
                st = merge_one(master, path, include_raw=False)
                master.commit()
                c = st.get("counts", {})
                log(
                    f"OK {fam} attempt={attempt} "
                    f"canonical={c.get('strain_canonical')} variant={c.get('strain_variant')} "
                    f"chem={c.get('chemistry_profile')} grow={c.get('grow_trait')} "
                    f"links={c.get('entity_link')} source_record={c.get('source_record')}"
                )
                log("RESULT " + json.dumps(st, default=str))
                results.append({"family": fam, "status": "ok", "attempt": attempt, **st})
                ok = True
                break
            except Exception as exc:
                master.rollback()
                msg = str(exc)
                log(f"FAIL {fam} attempt={attempt}: {exc}")
                log(traceback.format_exc())
                if "locked" in msg.lower() or "busy" in msg.lower():
                    time.sleep(min(60, 5 * attempt))
                    # re-open master
                    try:
                        master.close()
                    except Exception:
                        pass
                    for j in range(1, 41):
                        try:
                            master = connect(DEFAULT_DB, timeout=30.0)
                            master.execute("PRAGMA busy_timeout=300000")
                            master.execute("BEGIN IMMEDIATE")
                            master.execute("COMMIT")
                            log(f"REOPEN ok after lock j={j}")
                            break
                        except Exception as e2:
                            log(f"REOPEN wait j={j}: {e2}")
                            time.sleep(15)
                    continue
                results.append({"family": fam, "status": "error", "error": msg})
                ok = True
                break
        if not ok:
            results.append({"family": fam, "status": "gave_up"})

    after = corpus_stats(master)
    master.close()
    summary = {"results": results, "before": before, "after": after, "ha_indexes": "skipped"}
    log("SUMMARY " + json.dumps(summary, indent=2, default=str))
    all_ok = all(r.get("status") == "ok" for r in results)
    log("DONE all_ok=" + str(all_ok))
    return 0 if all_ok else 1

if __name__ == "__main__":
    raise SystemExit(main())
