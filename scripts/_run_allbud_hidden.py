#!/usr/bin/env python3
"""Launch scrape_allbud.py with CREATE_NO_WINDOW (no visible console).

Does NOT pass --merge. Writes stdout/stderr to homeassistant/data logs.
"""
from __future__ import annotations

import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRAPE = ROOT / "scripts" / "scrape_allbud.py"
DATA = ROOT / "homeassistant" / "data"
LOG = DATA / "_allbud_scrape_hidden.log"
PID = DATA / "_allbud_scrape_hidden.pid"
RC = DATA / "_allbud_scrape_hidden.rc"

CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    # Extra args after -- forwarded to scrape_allbud
    extra = sys.argv[1:]
    cmd = [sys.executable, str(SCRAPE), *extra]
    # Default: resume full sitemap, stage as it goes; never merge.
    if not any(a.startswith("--") for a in extra):
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

    log_f = open(LOG, "a", encoding="utf-8", errors="replace")
    log_f.write(f"\n===== start {time.strftime('%Y-%m-%dT%H:%M:%S')} =====\n")
    log_f.write("cmd: " + " ".join(cmd) + "\n")
    log_f.flush()

    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": log_f,
        "stderr": subprocess.STDOUT,
        "env": env,
        "close_fds": True,
    }
    if sys.platform == "win32":
        kwargs["creationflags"] = CREATE_NO_WINDOW

    proc = subprocess.Popen(cmd, **kwargs)
    PID.write_text(str(proc.pid), encoding="utf-8")
    print(f"launched pid={proc.pid} log={LOG}", flush=True)
    rc = proc.wait()
    RC.write_text(str(rc), encoding="utf-8")
    log_f.write(f"\n===== exit rc={rc} {time.strftime('%Y-%m-%dT%H:%M:%S')} =====\n")
    log_f.close()
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
