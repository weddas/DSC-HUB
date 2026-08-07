#!/usr/bin/env python3
from __future__ import annotations
import json, sys, time
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT/"scripts"))
from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus, link_science_to_seed
from brain.dsc_brain.paths import DEFAULT_DB
from merge_staging_to_master import merge_one
STAGING = ROOT/"brain"/"data"/"staging"
OUT = ROOT/"scripts"/"_n087_merge_result.json"
ORDER = [
  "alchimia","bank_weedseedsexpress","cannaconnection","cannareviews","cannia",
  "forum_420mag","forum_mjpassion","forum_phenohunter","medical_effects",
  "north_atlantic_local","north_atlantic","pickle_archive","replication_labs",
  "seedsman","strain_database","strains_master","leafly_flat","leafly_flat_enrich",
  "phytochem_lab","seedfinder","allbud","seedcity","kushy_crosses_local",
  "cannabis_intelligence","phytochem_smith","cannlytics_expand",
]
SESSION_BEFORE = {"strain_canonical":57167,"strain_variant":17713,"chemistry_profile":330341,"grow_trait":18282,"entity_link":865678,"attribute_kv":1075,"raw_record":0,"light_fixture":7,"nutrient_product":3,"medium_product":1,"media_asset":16,"followup_gap":1,"schema_extension_log":13,"source_record":44}

def journal_locked(stem: str) -> bool:
    j = STAGING/f"{stem}.sqlite3-journal"; w = STAGING/f"{stem}.sqlite3-wal"
    return (j.exists() and j.stat().st_size>0) or w.exists()

def open_master():
    for i in range(20):
        try:
            init_corpus(DEFAULT_DB)
            m = connect(DEFAULT_DB, timeout=20.0)
            m.execute("PRAGMA busy_timeout=120000")
            m.execute("CREATE TABLE IF NOT EXISTS _lock_ping(x INTEGER)")
            m.execute("DELETE FROM _lock_ping"); m.execute("INSERT INTO _lock_ping(x) VALUES(1)"); m.commit()
            print(f"OPEN_OK {i}", flush=True); return m
        except Exception as e:
            print(f"OPEN_FAIL {i}: {e}", flush=True); time.sleep(20)
    raise SystemExit("no master")

def main():
    print("SESSION_BEFORE", json.dumps(SESSION_BEFORE), flush=True)
    m = open_master()
    merged, skipped, failed = [], [], []
    for stem in ORDER:
        path = STAGING/f"{stem}.sqlite3"
        if not path.exists():
            skipped.append(f"{stem} (missing)"); continue
        if journal_locked(stem):
            skipped.append(f"{stem} (journal/wal)"); print("SKIP", stem, flush=True); continue
        print(f"APPLY {stem}", flush=True)
        try:
            st = merge_one(m, path, include_raw=False); m.commit()
            print(f"OK {stem} {st.get('counts')}", flush=True); merged.append(stem)
        except Exception as e:
            print(f"FAIL {stem}: {e}", flush=True)
            try: m.rollback()
            except Exception: pass
            failed.append(f"{stem}: {e}")
            try: m.close()
            except Exception: pass
            m = open_master()
    try:
        print("LINKS", link_science_to_seed(m), flush=True); m.commit()
    except Exception as e:
        print("LINK_FAIL", e, flush=True)
    after = {}
    try: after = corpus_stats(m)
    except Exception as e: print("AFTER_FAIL", e, flush=True)
    try: m.close()
    except Exception: pass
    res = {"session_before": SESSION_BEFORE, "after": after, "merged": merged, "skipped": skipped, "failed": failed}
    OUT.write_text(json.dumps(res, indent=2), encoding="utf-8")
    print("MERGED", merged, flush=True); print("SKIPPED", skipped, flush=True); print("FAILED", failed, flush=True)
    print("AFTER", json.dumps(after), flush=True); print("WROTE", OUT, flush=True)
    return 0 if not failed else 1
if __name__ == "__main__":
    raise SystemExit(main())
