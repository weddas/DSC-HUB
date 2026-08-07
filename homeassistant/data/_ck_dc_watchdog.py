"""Watchdog: keep Crop King / DC resume wrappers healthy (hidden).

Kills competing scrape_cropking_dcseed.py subprocesses. Restarts missing
_resume_bank_scrape.py workers. Stages both when coverage >= 98%.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "homeassistant" / "data"
PY = sys.executable
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0
LOG = DATA / "_ck_dc_watchdog.log"
PIDF = DATA / "_ck_dc_watchdog.pid"
BANKS = ("cropking", "dcseedexchange")
CFG = {
    "cropking": {"delay": "0.35", "batch": "50"},
    "dcseedexchange": {"delay": "0.5", "batch": "40"},
}


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def counts(bank: str) -> tuple[int, int, int]:
    sm = DATA / f"dsc_strains_{bank}.sitemap_urls.json"
    ck = DATA / f"dsc_strains_{bank}.checkpoint.json"
    dump = DATA / f"dsc_strains_{bank}.json"
    n = 0
    if sm.exists():
        n = int(json.loads(sm.read_text(encoding="utf-8")).get("count") or 0)
    done = 0
    if ck.exists():
        done = len(json.loads(ck.read_text(encoding="utf-8")).get("done") or [])
    items = 0
    if dump.exists():
        doc = json.loads(dump.read_text(encoding="utf-8"))
        items = int(doc.get("count") or 0) or len(doc.get("items") or [])
    return n, done, items


def coverage_met(bank: str) -> bool:
    n, done, items = counts(bank)
    if n <= 0:
        return False
    need = max(1, int(n * 0.98))
    return done >= need and items >= need


def ps_python_cmds() -> list[tuple[int, str]]:
    script = (
        "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | "
        "ForEach-Object { if ($_.CommandLine) { '{0}`t{1}' -f $_.ProcessId, $_.CommandLine } }"
    )
    try:
        out = subprocess.check_output(
            ["powershell", "-NoProfile", "-Command", script],
            text=True,
            encoding="utf-8",
            errors="replace",
            creationflags=CREATE_NO_WINDOW,
            timeout=45,
        )
    except Exception:
        return []
    rows: list[tuple[int, str]] = []
    for line in (out or "").splitlines():
        if "\t" not in line:
            continue
        pid_s, cmd = line.split("\t", 1)
        try:
            rows.append((int(pid_s), cmd))
        except ValueError:
            continue
    return rows


def kill_pid(pid: int) -> None:
    try:
        subprocess.call(
            ["taskkill", "/PID", str(pid), "/F"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=CREATE_NO_WINDOW,
        )
        log(f"killed {pid}")
    except Exception as exc:
        log(f"kill fail {pid}: {exc}")


def has_resume(bank: str, rows: list[tuple[int, str]]) -> bool:
    for _, cmd in rows:
        if "_resume_bank_scrape.py" in cmd and f"--bank {bank}" in cmd:
            return True
        # ArgumentList sometimes renders without space consistency
        if "_resume_bank_scrape.py" in cmd and bank in cmd.split():
            # ensure it's the bank arg value
            parts = cmd.replace('"', " ").split()
            for i, p in enumerate(parts):
                if p == "--bank" and i + 1 < len(parts) and parts[i + 1] == bank:
                    return True
    return False


def start_resume(bank: str) -> None:
    cfg = CFG[bank]
    # Unique redirect paths so we never block on a live resume's console log lock.
    stamp = time.strftime("%H%M%S")
    out = DATA / f"_resume_{bank}_console_{stamp}.log"
    err = DATA / f"_resume_{bank}_console_{stamp}.err"
    pidf = DATA / f"_resume_{bank}.outer.pid"
    arglist = (
        f'-u scripts\\_resume_bank_scrape.py --bank {bank} '
        f'--delay {cfg["delay"]} --batch-limit {cfg["batch"]} '
        f'--checkpoint-every 10 --stage --max-rounds 200'
    )
    ps = (
        f"$p = Start-Process -FilePath '{PY}' -ArgumentList '{arglist}' "
        f"-WorkingDirectory '{ROOT}' -RedirectStandardOutput '{out}' "
        f"-RedirectStandardError '{err}' -PassThru -WindowStyle Hidden; "
        f"Set-Content -Path '{pidf}' -Value $p.Id; Write-Output $p.Id"
    )
    try:
        got = subprocess.check_output(
            ["powershell", "-NoProfile", "-Command", ps],
            text=True,
            encoding="utf-8",
            errors="replace",
            creationflags=CREATE_NO_WINDOW,
            timeout=60,
        )
        log(f"started resume {bank} outer={got.strip()} log={out.name}")
    except Exception as exc:
        log(f"start fail {bank}: {exc}")


def stage_all() -> None:
    for bank in BANKS:
        cmd = [
            PY,
            "-u",
            str(ROOT / "scripts" / "scrape_cropking_dcseed.py"),
            "--bank",
            bank,
            "--stage-only",
        ]
        p = subprocess.run(
            cmd,
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            creationflags=CREATE_NO_WINDOW,
        )
        log(f"stage-only {bank} rc={p.returncode} {(p.stdout or '')[-400:]}")


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    PIDF.write_text(str(os.getpid()), encoding="ascii")
    log(f"watchdog start pid={os.getpid()}")
    while True:
        rows = ps_python_cmds()
        for pid, cmd in rows:
            if "scrape_cropking_dcseed.py" in cmd:
                kill_pid(pid)

        rows = ps_python_cmds()
        status = {}
        all_done = True
        for bank in BANKS:
            n, done, items = counts(bank)
            status[bank] = {"sitemap": n, "done": done, "dump": items}
            if coverage_met(bank):
                continue
            all_done = False
            if not has_resume(bank, rows):
                start_resume(bank)

        log(f"status {json.dumps(status)}")
        if all_done:
            log("coverage met for both; staging")
            stage_all()
            # final counts
            final = {b: counts(b) for b in BANKS}
            log(f"FINAL {json.dumps(final)}")
            return 0
        time.sleep(120)


if __name__ == "__main__":
    raise SystemExit(main())
