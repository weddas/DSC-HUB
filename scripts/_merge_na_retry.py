#!/usr/bin/env python3
from __future__ import annotations
import re, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / "brain" / "data" / "_na_merge_retry.log"

def log(msg: str) -> None:
    line = msg.rstrip() + "\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line)

def run_merge(only: str, attempts: int = 10, sleep_s: int = 30) -> int:
    cmd = [sys.executable, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"),
           "--only", only, "--no-search", "--no-link"]
    for i in range(1, attempts + 1):
        log(f"=== Attempt {i}/{attempts}: --only {only} ===")
        try:
            p = subprocess.run(cmd, capture_output=True, text=True, cwd=str(ROOT), timeout=900)
        except subprocess.TimeoutExpired as exc:
            log(((exc.stdout or "") + (exc.stderr or "")).rstrip())
            log("TIMEOUT; sleep")
            time.sleep(sleep_s)
            continue
        out = (p.stdout or "") + (p.stderr or "")
        if out.strip():
            log(out.rstrip())
        else:
            log("(empty output)")
        log(f"exit={p.returncode}")
        ok_line = f"ok {only}" in out.lower() or (p.returncode == 0 and "FAIL" not in out and "Merging" in out)
        if p.returncode == 0 and ok_line:
            log(f"MERGE_OK {only}")
            return 0
        if p.returncode == 0 and "Merging 0 staging" in out:
            log(f"NO_MATCH {only}")
            return 2
        locked = bool(re.search(r"lock|busy|database is locked", out, re.I))
        if locked or p.returncode != 0 or not out.strip():
            log(f"contention/fail; sleep {sleep_s}s")
            time.sleep(sleep_s)
            continue
        log(f"NON-LOCK failure for {only}")
        return p.returncode or 1
    log(f"MERGE_FAILED {only}")
    return 1

def main() -> int:
    LOG.write_text("", encoding="utf-8")
    log("START precise NA merge")
    # exact filename fragment so local is not matched
    rc = run_merge("north_atlantic.sqlite3", attempts=10, sleep_s=30)
    if rc != 0:
        log(f"DONE failed primary rc={rc}")
        return rc
    local = ROOT / "brain" / "data" / "staging" / "north_atlantic_local.sqlite3"
    if local.exists():
        log("merging north_atlantic_local (differs)")
        rc2 = run_merge("north_atlantic_local.sqlite3", attempts=10, sleep_s=30)
        log(f"DONE local rc={rc2}")
        return rc2
    log("DONE no local")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
