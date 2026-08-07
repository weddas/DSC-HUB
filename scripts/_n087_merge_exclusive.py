#!/usr/bin/env python3
"""Lean exclusive merge: one master connection, merge_one per family, no per-family stats."""
from __future__ import annotations

import json
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.corpus import connect, corpus_stats, init_corpus, link_science_to_seed  # noqa: E402
from brain.dsc_brain.paths import DEFAULT_DB  # noqa: E402
from brain.dsc_brain.staging import list_staging_dbs  # noqa: E402
from merge_staging_to_master import merge_one  # noqa: E402

MAX_ATTEMPTS = 20
SLEEP_S = 30
OUT = ROOT / "scripts" / "_n087_merge_result.json"


def journal_locked(path: Path) -> bool:
    j = path.with_name(path.name + "-journal")
    w = path.with_suffix(path.suffix + "-wal")
    return (j.exists() and j.stat().st_size > 0) or w.exists()


def open_master():
    for i in range(MAX_ATTEMPTS):
        try:
            init_corpus(DEFAULT_DB)
            master = connect(DEFAULT_DB, timeout=120.0)
            master.execute("PRAGMA busy_timeout=120000")
            master.execute("BEGIN IMMEDIATE")
            master.execute("COMMIT")
            return master
        except Exception as exc:  # noqa: BLE001
            print(f"OPEN_FAIL {i}: {exc}", flush=True)
            time.sleep(SLEEP_S)
    raise SystemExit("could not open master")


def quick_stats(master) -> dict:
    return corpus_stats(master)


def main() -> int:
    staging = ROOT / "brain" / "data" / "staging"
    dbs = list_staging_dbs(staging)
    print("FAMILIES", [p.stem for p in dbs], flush=True)

    master = open_master()
    before = quick_stats(master)
    print("BEFORE", json.dumps(before), flush=True)

    merged: list[str] = []
    skipped: list[str] = []
    failed: list[str] = []

    for path in dbs:
        stem = path.stem
        if journal_locked(path):
            skipped.append(f"{stem} (journal/wal)")
            print(f"SKIP {stem}", flush=True)
            continue
        ok = False
        last = ""
        for i in range(MAX_ATTEMPTS):
            if journal_locked(path):
                skipped.append(f"{stem} (journal mid-run)")
                print(f"SKIP {stem} mid-run", flush=True)
                ok = True
                break
            print(f"MERGE {stem} attempt {i}", flush=True)
            try:
                st = merge_one(master, path, include_raw=False)
                master.commit()
                c = st.get("counts") or {}
                print(
                    f"OK {stem}: can={c.get('strain_canonical')} var={c.get('strain_variant')} "
                    f"chem={c.get('chemistry_profile')} grow={c.get('grow_trait')} links={c.get('entity_link')}",
                    flush=True,
                )
                merged.append(stem)
                ok = True
                break
            except Exception as exc:  # noqa: BLE001
                last = str(exc)
                print(f"FAIL {stem} {i}: {exc}", flush=True)
                try:
                    master.rollback()
                except Exception:
                    pass
                if "locked" in last.lower() or "busy" in last.lower():
                    try:
                        master.close()
                    except Exception:
                        pass
                    time.sleep(SLEEP_S)
                    master = open_master()
                    continue
                time.sleep(SLEEP_S)
        if not ok:
            failed.append(f"{stem}: {last}")

    try:
        links = link_science_to_seed(master)
        master.commit()
        print("LINKS", links, flush=True)
    except Exception as exc:  # noqa: BLE001
        print(f"LINK_FAIL {exc}", flush=True)
        try:
            master.rollback()
        except Exception:
            pass

    after = quick_stats(master)
    master.close()
    print("AFTER", json.dumps(after), flush=True)

    result = {"before": before, "after": after, "merged": merged, "skipped": skipped, "failed": failed}
    OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print("MERGED", merged, flush=True)
    print("SKIPPED", skipped, flush=True)
    print("FAILED", failed, flush=True)
    print("WROTE", OUT, flush=True)
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
