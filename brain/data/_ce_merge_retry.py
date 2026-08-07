#!/usr/bin/env python3
"""Retry cannlytics_expand merge when master unlocks."""
from __future__ import annotations

import subprocess
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if not (ROOT / "scripts" / "merge_staging_to_master.py").exists():
    ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")

MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
LOG = ROOT / "brain" / "data" / "_ce_merge_live.txt"
OUT = ROOT / "brain" / "data" / "_ce_merge_stdout.txt"
ERR = ROOT / "brain" / "data" / "_ce_merge_err.txt"
PY = sys.executable
CREATE_NO_WINDOW = 0x08000000
MAX_ATTEMPTS = 15
SLEEP_SEC = 20


def log(msg: str) -> None:
    line = msg.rstrip() + "\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line)


def master_free() -> bool:
    try:
        c = sqlite3.connect(str(MASTER), timeout=2)
        c.execute("BEGIN IMMEDIATE")
        c.rollback()
        c.close()
        return True
    except Exception as e:  # noqa: BLE001
        log(f"BUSY {type(e).__name__}: {e}")
        return False


def main() -> int:
    LOG.write_text(f"=== cannlytics_expand merge retry started {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} ===\n", encoding="utf-8")
    for attempt in range(1, MAX_ATTEMPTS + 1):
        ts = time.strftime("%H:%M:%S")
        log(f"[{ts}] attempt {attempt}/{MAX_ATTEMPTS}: probing lock...")
        if not master_free():
            log(f"[{ts}] locked; sleeping {SLEEP_SEC}s")
            time.sleep(SLEEP_SEC)
            continue
        log(f"[{ts}] unlocked; starting merge...")
        OUT.write_text("", encoding="utf-8")
        ERR.write_text("", encoding="utf-8")
        with OUT.open("w", encoding="utf-8") as fo, ERR.open("w", encoding="utf-8") as fe:
            _kw = {
                "cwd": str(ROOT),
                "stdout": fo,
                "stderr": fe,
                "stdin": subprocess.DEVNULL,
            }
            if sys.platform == "win32":
                _kw["creationflags"] = CREATE_NO_WINDOW
                _si = subprocess.STARTUPINFO(); _si.dwFlags |= subprocess.STARTF_USESHOWWINDOW; _si.wShowWindow = 0
                _kw["startupinfo"] = _si
            p = subprocess.Popen(
                [PY, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"), "--only", "cannlytics_expand"],
                **_kw,
            )
        waited = 0
        while p.poll() is None:
            time.sleep(5)
            waited += 5
            if waited % 30 == 0:
                log(f"[{time.strftime('%H:%M:%S')}] merge running {waited}s stdout_bytes={OUT.stat().st_size if OUT.exists() else 0}")
        exit_code = p.returncode
        stdout = OUT.read_text(encoding="utf-8", errors="replace") if OUT.exists() else ""
        stderr = ERR.read_text(encoding="utf-8", errors="replace") if ERR.exists() else ""
        log(f"[{time.strftime('%H:%M:%S')}] merge exit={exit_code}")
        if stdout:
            log(stdout.rstrip())
        if stderr:
            log("STDERR: " + stderr.rstrip())
        combined = stdout + "\n" + stderr
        if exit_code == 0:
            log(f"SUCCESS on attempt {attempt}")
            log(f"=== done result=ok {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} ===")
            return 0
        if "locked" in combined.lower() or "OperationalError" in combined:
            log(f"[{time.strftime('%H:%M:%S')}] got lock error; sleeping {SLEEP_SEC}s before retry")
            time.sleep(SLEEP_SEC)
            continue
        if exit_code in (-1, 4294967295) or exit_code is None:
            log(f"[{time.strftime('%H:%M:%S')}] abnormal exit {exit_code}; sleeping {SLEEP_SEC}s before retry")
            time.sleep(SLEEP_SEC)
            continue
        log(f"FAILED non-lock exit={exit_code}; stopping")
        log(f"=== done result=fail {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} ===")
        return exit_code or 1
    log(f"EXHAUSTED {MAX_ATTEMPTS} attempts without success")
    log(f"=== done result=exhausted {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} ===")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
