#!/usr/bin/env python3
"""In-process NA merge with lock wait (no subprocess)."""
from __future__ import annotations

import sys
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

LOG = ROOT / "brain" / "data" / "_na_merge_retry.log"


def log(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg.rstrip()}\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line)


def wait_writable(master: Path, attempts: int = 10, sleep_s: float = 20.0) -> bool:
    import sqlite3

    for i in range(1, attempts + 1):
        log(f"lock-probe {i}/{attempts}")
        try:
            con = sqlite3.connect(str(master), timeout=15)
            con.execute("PRAGMA busy_timeout=15000")
            con.execute("BEGIN IMMEDIATE")
            con.execute("ROLLBACK")
            con.close()
            log("lock-probe OK writable")
            return True
        except Exception as exc:  # noqa: BLE001
            log(f"lock-probe busy: {exc}")
            time.sleep(sleep_s)
    return False


def merge_only(only: str) -> int:
    from merge_staging_to_master import main

    log(f"invoking merge --only {only} --no-search --no-link")
    try:
        rc = main(["--only", only, "--no-search", "--no-link"])
        log(f"merge returned rc={rc}")
        return int(rc or 0)
    except Exception as exc:  # noqa: BLE001
        log(f"merge exception: {exc}")
        traceback.print_exc()
        return 1


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    log("START in-process NA merge")
    from brain.dsc_brain.paths import DEFAULT_DB

    master = DEFAULT_DB
    log(f"master={master}")

    if not wait_writable(Path(master), attempts=10, sleep_s=20):
        log("FAILED: master never writable")
        return 1

    rc = merge_only("north_atlantic.sqlite3")
    if rc != 0:
        log(f"FAILED primary rc={rc}")
        return rc
    log("MERGE_OK north_atlantic.sqlite3")

    local = ROOT / "brain" / "data" / "staging" / "north_atlantic_local.sqlite3"
    if local.exists():
        # brief re-probe
        if not wait_writable(Path(master), attempts=5, sleep_s=15):
            log("FAILED: master locked before local")
            return 1
        rc2 = merge_only("north_atlantic_local.sqlite3")
        if rc2 != 0:
            log(f"FAILED local rc={rc2}")
            return rc2
        log("MERGE_OK north_atlantic_local.sqlite3")
    log("DONE all OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
