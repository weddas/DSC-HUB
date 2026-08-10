#!/usr/bin/env python3
"""Clear StrainDB DEFERRED_CF pause and launch headed PW scrape (CREATE_NO_WINDOW)."""

from __future__ import annotations

import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
PAUSE = DATA / "_pw_strain_db_PAUSE.txt"
OUT = DATA / "_pw_strain_db_scrape_unlocked.log"
ERR = DATA / "_pw_strain_db_scrape_unlocked.err"
PID = DATA / "_pw_strain_db_scrape.pid"

CREATE_NO_WINDOW = 0x08000000


def main() -> int:
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    PAUSE.write_text(
        "\n".join(
            [
                "status=RUNNING",
                "reason=Operator unlocked all gates 2026-08-10; headed PW resume delay 8-20s",
                "n=resume",
                "cmd=python -u scripts/_pw_scrape_strain_database.py --headed --delay-min=8 --delay-max=20",
                f"updated_at={stamp}",
                "",
            ]
        ),
        encoding="utf-8",
    )
    cmd = [
        sys.executable,
        "-u",
        str(ROOT / "scripts" / "_pw_scrape_strain_database.py"),
        "--headed",
        "--delay-min=8",
        "--delay-max=20",
    ]
    out_f = open(OUT, "a", encoding="utf-8", buffering=1)
    err_f = open(ERR, "a", encoding="utf-8", buffering=1)
    out_f.write(f"\n===== unlock launch {stamp} =====\n")
    out_f.flush()
    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    kwargs: dict = {
        "cwd": str(ROOT),
        "stdout": out_f,
        "stderr": err_f,
        "env": env,
        "close_fds": False,
    }
    if sys.platform == "win32":
        # Headed must be visible for CF — do NOT use CREATE_NO_WINDOW
        si = subprocess.STARTUPINFO()
        kwargs["startupinfo"] = si
    proc = subprocess.Popen(cmd, **kwargs)
    PID.write_text(str(proc.pid), encoding="utf-8")
    print(f"started straindb pid={proc.pid} out={OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
