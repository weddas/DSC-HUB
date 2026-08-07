#!/usr/bin/env python3
import sys
print("1", flush=True)
import faulthandler
print("2", flush=True)
faulthandler.enable()
print("3", flush=True)
import importlib.util
print("4", flush=True)
import json, sqlite3, time, traceback
print("5", flush=True)
from pathlib import Path
print("6", flush=True)
ROOT = Path(__file__).resolve().parent
print("7", ROOT, flush=True)
sys.path.insert(0, str(ROOT))
print("8", flush=True)
LOG = ROOT / "_forum_progress.log"
LOG.write_text("cleared\n", encoding="utf-8")
print("9 log cleared", flush=True)
spec = importlib.util.spec_from_file_location("mst", str(ROOT / "scripts" / "merge_staging_to_master.py"))
print("10 spec", flush=True)
mst = importlib.util.module_from_spec(spec)
print("11 mod", flush=True)
spec.loader.exec_module(mst)
print("12 loaded", flush=True)
from brain.dsc_brain.corpus import corpus_stats
print("13 corpus_stats", flush=True)

MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
STAGING = ROOT / "brain" / "data" / "staging"
FAMILIES = ["forum_420mag", "forum_phenohunter", "forum_mjpassion"]
OUT = ROOT / "_forum_merge_results.json"

def L(msg):
    line = f"{time.strftime('%H:%M:%S')} {msg}\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(line)

L("open loop")
master = None
for i in range(1, 180):
    try:
        master = sqlite3.connect(str(MASTER), timeout=20)
        master.row_factory = sqlite3.Row
        master.execute("PRAGMA busy_timeout=20000")
        master.execute("UPDATE meta SET value=value WHERE key=?", ("corpus_schema_version",))
        master.commit()
        master.execute("PRAGMA busy_timeout=300000")
        L(f"OPEN_OK {i}")
        break
    except Exception as e:
        L(f"OPEN_WAIT {i}: {e}")
        try:
            master.close()
        except Exception:
            pass
        master = None
        time.sleep(10)
if master is None:
    L("GAVE_UP")
    raise SystemExit(2)

before = corpus_stats(master)
L("BEFORE " + json.dumps(before, default=str))
results = []
for fam in FAMILIES:
    path = STAGING / f"{fam}.sqlite3"
    L(f"MERGE {fam}")
    for attempt in range(1, 20):
        try:
            st = mst.merge_one(master, path, include_raw=False)
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
    }
master.close()
out = {"results": results, "before": before, "after": after, "verify": verify, "ha_indexes": "skipped"}
OUT.write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
L("SUMMARY " + json.dumps(out, indent=2, default=str))
ok = all(r.get("status") == "ok" for r in results)
L("DONE ok=" + str(ok))
raise SystemExit(0 if ok else 1)