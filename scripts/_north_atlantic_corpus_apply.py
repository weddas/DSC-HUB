#!/usr/bin/env python3
"""Wait for apply lock file to clear, then in-process merge NA families."""
from __future__ import annotations

import sqlite3
import sys
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

LOG = ROOT / "brain" / "data" / "_na_wait_serial.log"
APPLY_LOCK = ROOT / "scripts" / "_n087_apply_staging.lock"
EXCL_LOCK = ROOT / "scripts" / "_n087_merge_exclusive.lock"


def log(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg.rstrip()}\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line)


def locks_held() -> bool:
    return APPLY_LOCK.exists() or EXCL_LOCK.exists()


def wait_locks(max_polls: int = 90, sleep_s: float = 20.0) -> bool:
    for i in range(1, max_polls + 1):
        held = locks_held()
        log(f"poll {i}/{max_polls} locks_held={held} apply={APPLY_LOCK.exists()} excl={EXCL_LOCK.exists()}")
        if not held:
            time.sleep(2)
            if not locks_held():
                log("LOCKS_CLEAR")
                return True
        time.sleep(sleep_s)
    return False


def writable(master: Path, timeout: float = 25.0) -> bool:
    try:
        con = sqlite3.connect(str(master), timeout=timeout)
        con.execute(f"PRAGMA busy_timeout={int(timeout * 1000)}")
        con.execute("BEGIN IMMEDIATE")
        con.execute("ROLLBACK")
        con.close()
        return True
    except Exception as exc:  # noqa: BLE001
        log(f"not writable: {exc}")
        return False


def merge_only(only: str) -> int:
    from merge_staging_to_master import main

    log(f"INPROCESS merge --only {only} --no-search --no-link")
    try:
        rc = main(["--only", only, "--no-search", "--no-link"])
        log(f"merge rc={rc}")
        return int(rc or 0)
    except Exception as exc:  # noqa: BLE001
        log(f"merge exception: {exc}")
        traceback.print_exc()
        return 1


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    log("START NA waiter (lockfile-only)")
    if not wait_locks():
        log("TIMEOUT on locks")
        return 2

    from brain.dsc_brain.paths import DEFAULT_DB

    master = Path(DEFAULT_DB)
    for attempt in range(1, 11):
        if locks_held():
            log(f"locks returned during primary attempt {attempt}; re-wait")
            if not wait_locks(max_polls=30, sleep_s=15):
                return 2
        log(f"primary attempt {attempt}/10")
        if not writable(master):
            time.sleep(15)
            continue
        rc = merge_only("north_atlantic.sqlite3")
        if rc == 0:
            log("MERGE_OK north_atlantic.sqlite3")
            break
        time.sleep(15)
    else:
        log("FAILED primary")
        return 1

    local = ROOT / "brain" / "data" / "staging" / "north_atlantic_local.sqlite3"
    if local.exists():
        for attempt in range(1, 11):
            if locks_held():
                log(f"locks returned during local attempt {attempt}; re-wait")
                if not wait_locks(max_polls=30, sleep_s=15):
                    return 2
            log(f"local attempt {attempt}/10")
            if not writable(master):
                time.sleep(15)
                continue
            rc = merge_only("north_atlantic_local.sqlite3")
            if rc == 0:
                log("MERGE_OK north_atlantic_local.sqlite3")
                break
            time.sleep(15)
        else:
            log("FAILED local")
            return 1
    log("DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
