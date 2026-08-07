#!/usr/bin/env python3
"""Serialize staging->master merges one family at a time with lock waits."""
from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from brain.dsc_brain.corpus import corpus_stats  # noqa: E402
from brain.dsc_brain.paths import DEFAULT_DB  # noqa: E402

STAGING = ROOT / "brain" / "data" / "staging"

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

SKIP_REASON = {
    "allbud": "tiny/in-progress raw=6",
    "cannlytics_expand": "journal lock",
    "leafly_flat": "prefer leafly_flat_enrich",
    "phytochem_lab": "prefer phytochem_smith",
    "north_atlantic": "prefer north_atlantic_local (more rows)",
}


def wait_lock(timeout_s: int = 600) -> bool:
    deadline = time.time() + timeout_s
    attempt = 0
    while time.time() < deadline:
        attempt += 1
        try:
            c = sqlite3.connect(str(DEFAULT_DB), timeout=15)
            c.execute("PRAGMA busy_timeout=15000")
            c.execute("BEGIN IMMEDIATE")
            c.execute("COMMIT")
            c.close()
            print(f"LOCK_FREE attempt={attempt}", flush=True)
            return True
        except Exception as exc:  # noqa: BLE001
            print(f"LOCK_WAIT {attempt}: {exc}", flush=True)
            time.sleep(5)
    return False


def print_stats(label: str) -> dict:
    for i in range(60):
        try:
            if not wait_lock(120):
                time.sleep(5)
                continue
            c = sqlite3.connect(str(DEFAULT_DB), timeout=60)
            c.row_factory = sqlite3.Row
            c.execute("PRAGMA busy_timeout=60000")
            s = corpus_stats(c)
            c.close()
            print(f"=== {label} ===", flush=True)
            print(json.dumps(s, indent=2), flush=True)
            return s
        except Exception as exc:  # noqa: BLE001
            print(f"STATS_WAIT {i}: {exc}", flush=True)
            time.sleep(5)
    raise SystemExit(f"could not read stats for {label}")


def journal_locked(family: str) -> bool:
    j = STAGING / f"{family}.sqlite3-journal"
    return j.exists() and j.stat().st_size > 0


def db_exists(family: str) -> bool:
    return (STAGING / f"{family}.sqlite3").exists()


def merge_one(family: str) -> dict:
    if not wait_lock(600):
        return {"family": family, "status": "skipped", "reason": "master lock timeout"}
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "merge_staging_to_master.py"),
        "--only",
        family,
        "--no-search",
    ]
    print(f"MERGE_START {family}", flush=True)
    p = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
    out = (p.stdout or "") + (p.stderr or "")
    print(out, flush=True)
    status = "merged" if p.returncode == 0 else "failed"
    return {"family": family, "status": status, "rc": p.returncode, "out_tail": out[-2500:]}


def main() -> int:
    before = print_stats("BEFORE")
    results = []

    for fam, reason in SKIP_REASON.items():
        results.append({"family": fam, "status": "skipped", "reason": reason})
        print(f"SKIP {fam}: {reason}", flush=True)

    for family in ORDER:
        if not db_exists(family):
            results.append({"family": family, "status": "skipped", "reason": "missing sqlite3"})
            print(f"SKIP {family}: missing", flush=True)
            continue
        if journal_locked(family):
            results.append({"family": family, "status": "skipped", "reason": "journal lock"})
            print(f"SKIP {family}: journal lock", flush=True)
            continue
        results.append(merge_one(family))
        time.sleep(1)

    if not wait_lock(600):
        print("INDEX_SKIP: lock timeout", flush=True)
        index_rc = None
    else:
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
        index_rc = p.returncode

    after = print_stats("AFTER")
    summary = {"before": before, "after": after, "results": results, "index_rc": index_rc}
    out_path = ROOT / "scripts" / "_merge_serial_summary.json"
    out_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("=== SUMMARY ===", flush=True)
    for r in results:
        print(json.dumps({k: v for k, v in r.items() if k != "out_tail"}), flush=True)
    print(f"wrote {out_path}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
