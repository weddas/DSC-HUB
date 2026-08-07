#!/usr/bin/env python3
"""Detach scrape_allbud behind CREATE_NO_WINDOW and exit immediately."""
from __future__ import annotations

import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
SCRAPE = ROOT / "scripts" / "scrape_allbud.py"
LOG = DATA / "_allbud_scrape_hidden.log"
PID = DATA / "_allbud_scrape_hidden.pid"
CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable,
        str(SCRAPE),
        "--delay",
        "0.55",
        "--checkpoint-every",
        "25",
        "--stage-every",
        "500",
    ]
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    env["PYTHONIOENCODING"] = "utf-8"

    # Append header then reopen for child inheritance
    with open(LOG, "a", encoding="utf-8", errors="replace") as hdr:
        hdr.write(f"\n===== detach start {time.strftime('%Y-%m-%dT%H:%M:%S')} =====\n")
        hdr.write("cmd: " + " ".join(cmd) + "\n")

    # Binary append so child owns a plain OS handle (avoids console attach).
    log_f = open(LOG, "ab", buffering=0)
    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": log_f,
        "stderr": subprocess.STDOUT,
        "stdin": subprocess.DEVNULL,
        "env": env,
    }
    if sys.platform == "win32":
        # Hidden console only — no DETACHED_PROCESS (breaks redirected stdio).
        kwargs["creationflags"] = CREATE_NO_WINDOW

    proc = subprocess.Popen(cmd, **kwargs)
    log_f.close()  # parent drops handle; child keeps its dup
    PID.write_text(str(proc.pid), encoding="utf-8")
    print(json_dumps(proc.pid))
    return 0


def json_dumps(pid: int) -> str:
    return f'{{"pid": {pid}, "log": "{LOG.as_posix()}", "pid_file": "{PID.as_posix()}"}}'


if __name__ == "__main__":
    raise SystemExit(main())
