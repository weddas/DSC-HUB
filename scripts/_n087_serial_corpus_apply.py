#!/usr/bin/env python3
"""In-process serialized staging->master merge (one family at a time)."""
from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus  # noqa: E402
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR  # noqa: E402
from merge_staging_to_master import merge_one  # noqa: E402

ORDER = [
    "seedcity",
    "kushy_crosses_local",
    "cannabis_intelligence",
    "phytochem_smith",
    "leafly_flat_enrich",
    "replication_labs",
    "north_atlantic_local",
    "medical_effects",
    "cannia",
    "pickle_archive",
    "strains_master",
    "cannaconnection",
    "seedfinder",
]

SKIP = {
    "allbud": "tiny/in-progress raw=6",
    "cannlytics_expand": "journal lock / skip",
    "leafly_flat": "prefer leafly_flat_enrich",
    "phytochem_lab": "prefer phytochem_smith",
    "north_atlantic": "prefer north_atlantic_local",
}


def journal_locked(family: str) -> bool:
    j = STAGING_DIR / f"{family}.sqlite3-journal"
    return j.exists() and j.stat().st_size > 0


def open_master(retries: int = 40):
    init_corpus(DEFAULT_DB)
    for i in range(retries):
        try:
            m = connect(DEFAULT_DB)
            m.execute("PRAGMA busy_timeout=300000")
            m.execute("BEGIN IMMEDIATE")
            m.execute("COMMIT")
            print(f"MASTER_OPEN ok attempt={i}", flush=True)
            return m
        except Exception as exc:
            print(f"MASTER_OPEN wait {i}: {exc}", flush=True)
            time.sleep(5)
    raise SystemExit("could not open master")


def main() -> int:
    results = []
    for fam, reason in SKIP.items():
        results.append({"family": fam, "status": "skipped", "reason": reason})
        print(f"SKIP {fam}: {reason}", flush=True)

    master = open_master()
    before = corpus_stats(master)
    print("=== BEFORE ===", flush=True)
    print(json.dumps(before, indent=2), flush=True)

    for family in ORDER:
        path = STAGING_DIR / f"{family}.sqlite3"
        if not path.exists():
            results.append({"family": family, "status": "skipped", "reason": "missing"})
            print(f"SKIP {family}: missing", flush=True)
            continue
        if journal_locked(family):
            results.append({"family": family, "status": "skipped", "reason": "journal lock"})
            print(f"SKIP {family}: journal lock", flush=True)
            continue
        print(f"MERGE_START {family}", flush=True)
        t0 = time.time()
        try:
            st = merge_one(master, path, include_raw=False)
            master.commit()
            elapsed = round(time.time() - t0, 1)
            c = st.get("counts") or {}
            print(
                f"MERGE_OK {family} {elapsed}s canonical={c.get('strain_canonical')} "
                f"variant={c.get('strain_variant')} chem={c.get('chemistry_profile')} "
                f"grow={c.get('grow_trait')} links={c.get('entity_link')}",
                flush=True,
            )
            results.append({"family": family, "status": "merged", "counts": c, "seconds": elapsed})
        except Exception as exc:
            try:
                master.rollback()
            except Exception:
                pass
            print(f"MERGE_FAIL {family}: {exc}", flush=True)
            results.append({"family": family, "status": "failed", "error": str(exc)})
            try:
                master.close()
            except Exception:
                pass
            master = open_master()

    after = corpus_stats(master)
    print("=== AFTER_MERGE ===", flush=True)
    print(json.dumps(after, indent=2), flush=True)
    master.close()

    print("BUILD_INDEXES", flush=True)
    p = subprocess.run(
        [sys.executable, "-u", str(ROOT / "scripts" / "build_catalog_search_indexes.py")],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    print(p.stdout or "", flush=True)
    print(p.stderr or "", flush=True)
    print(f"INDEX_RC {p.returncode}", flush=True)

    master = open_master()
    final = corpus_stats(master)
    master.close()
    print("=== AFTER ===", flush=True)
    print(json.dumps(final, indent=2), flush=True)

    summary = {
        "before": before,
        "after_merge": after,
        "after": final,
        "results": results,
        "index_rc": p.returncode,
    }
    out = ROOT / "scripts" / "_merge_serial_summary.json"
    out.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("=== SUMMARY ===", flush=True)
    for r in results:
        print(json.dumps(r), flush=True)
    print(f"wrote {out}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())