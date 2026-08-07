#!/usr/bin/env python3
from __future__ import annotations
import json, sqlite3, sys, time, traceback
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))
from merge_staging_to_master import merge_one

LOG = Path(r"C:\Users\cmgwe\AppData\Local\Temp\_cr_exclusive.log")
OUT = ROOT / "brain" / "data" / "_cr_merge_result.json"
STAGING = ROOT / "brain" / "data" / "staging" / "cannareviews.sqlite3"
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
NAS_LOG = ROOT / "brain" / "data" / "_cr_exclusive.log"

def log(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    for p in (LOG, NAS_LOG):
        try:
            with p.open("a", encoding="utf-8") as f:
                f.write(line + "\n"); f.flush()
        except Exception:
            pass

def main() -> int:
    for p in (LOG, NAS_LOG):
        p.write_text("", encoding="utf-8")
    log(f"RAW-HOLD cannareviews start size={STAGING.stat().st_size}")
    src0 = sqlite3.connect(str(STAGING), timeout=60)
    staging_counts = {t: src0.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
                      for t in ["source_record","strain_canonical","strain_variant","chemistry_profile","entity_link","raw_record"]}
    sids = [r[0] for r in src0.execute("SELECT id FROM source_record")]
    src0.close()
    log(f"staging={staging_counts} sids={sids}")

    for attempt in range(1, 90):
        m = None
        try:
            log(f"a{attempt} open+BEGIN IMMEDIATE")
            m = sqlite3.connect(str(MASTER), timeout=20)
            m.row_factory = sqlite3.Row
            m.execute("PRAGMA busy_timeout=20000")
            m.execute("BEGIN IMMEDIATE")
            log(f"a{attempt} lock held — merge_one")
            st = merge_one(m, STAGING, include_raw=False)
            log(f"a{attempt} merge_one returned, committing")
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
                    "canonical_touch": staging_counts.get("strain_canonical"),
                }
            m.close(); m = None
            result = {
                "family": "cannareviews",
                "status": "ok",
                "staging_counts": staging_counts,
                "merged": st,
                "by_source": by,
                "attempt": attempt,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "note": "full review text still pending medauth; not blocking. raw-hold merge_one (no corpus.connect)",
            }
            OUT.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
            (ROOT / "brain" / "data" / "_cr_merge_out.txt").write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
            Path(r"C:\Users\cmgwe\AppData\Local\Temp\_cr_merge_result.json").write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
            log("DONE")
            return 0
        except Exception as e:
            log(f"a{attempt} FAIL {type(e).__name__}: {e}")
            log(traceback.format_exc())
            if m is not None:
                try: m.rollback()
                except Exception: pass
                try: m.close()
                except Exception: pass
            time.sleep(15)
    log("GIVE_UP")
    return 1

if __name__ == "__main__":
    raise SystemExit(main())
