#!/usr/bin/env python3
"""Launch headed StrainDB CF capture (writes storage_state)."""
from __future__ import annotations

import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
OUT = DATA / "_pw_strain_db_capture_20260809_resume2.out"
ERR = DATA / "_pw_strain_db_capture_20260809_resume2.err"
PID = DATA / "_pw_strain_db_capture.pid"
CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    OUT.write_text(f"===== capture launch {stamp} =====\n", encoding="utf-8")
    ERR.write_text("", encoding="utf-8")
    out_f = open(OUT, "a", encoding="utf-8", buffering=1)
    err_f = open(ERR, "a", encoding="utf-8", buffering=1)
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "_pw_strain_db_capture.py"),
        "--wait=300",
    ]
    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": out_f,
        "stderr": err_f,
        "env": {**os.environ, "PYTHONUNBUFFERED": "1"},
        "close_fds": False,
    }
    if sys.platform == "win32":
        # Visible window so operator can pass CF — do NOT use CREATE_NO_WINDOW.
        kwargs["creationflags"] = subprocess.CREATE_NEW_CONSOLE  # type: ignore[attr-defined]
    proc = subprocess.Popen(cmd, **kwargs)
    PID.write_text(str(proc.pid), encoding="utf-8")
    print(f"capture_pid={proc.pid} wait=300s — pass CF in Chrome if shown")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
