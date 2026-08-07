"""Crash-resilient waiter without psutil."""
from __future__ import annotations
import json, time, re, sys, subprocess, os, traceback
from datetime import datetime
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "homeassistant" / "data"
STATUS = ROOT / "_straindb_wait_poll.txt"
READY = ROOT / "_straindb_wait_ready.txt"
LOG = ROOT / "_straindb_py_waiter.log"
CRASH = ROOT / "_straindb_py_waiter_crash.txt"
PIDFILE = ROOT / "_straindb_py_waiter.pid"
RESULT = ROOT / "_straindb_resume_result.txt"
SCRAPE_LOG = DATA / "_pw_strain_db_scrape_deferred.log"
SCRAPE_ERR = DATA / "_pw_strain_db_scrape_deferred.err"
DEADLINE = datetime(2026, 8, 8, 6, 11, 0)
DELAY = "4.0"
WAVE = 200

BANK_RES = [
    re.compile(r"scrape_alchimia", re.I),
    re.compile(r"scrape_seedsman\.py", re.I),
    re.compile(r"scrape_cropking_dcseed\.py.*cropking", re.I),
    re.compile(r"scrape_cropking_dcseed\.py.*dcseed", re.I),
    re.compile(r"scrape_wc_seed_banks\.py.*multiverse", re.I),
    re.compile(r"weedseedsexpress", re.I),
]
LONG_RES = [
    re.compile(r"scrape_allbud\.py", re.I),
    re.compile(r"scrape_seedfinder\.py", re.I),
]

def log(msg: str) -> None:
    line = f"{datetime.now().isoformat()} {msg}"
    for path in (LOG, STATUS):
        try:
            with path.open("a", encoding="utf-8") as f:
                f.write(line + "\n")
                f.flush()
        except Exception:
            pass

def list_python_cmds():
    """Return list of (pid, cmdline) for python.exe via PowerShell CIM."""
    ps = (
        "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | "
        "ForEach-Object { '{0}`t{1}' -f $_.ProcessId, ($_.CommandLine -replace '[\\r\\n]',' ') }"
    )
    r = subprocess.run(
        ["powershell", "-NoProfile", "-Command", ps],
        capture_output=True, text=True, timeout=60,
    )
    out = []
    for line in (r.stdout or "").splitlines():
        if "`t" in line:
            pid_s, cmd = line.split("`t", 1)
        elif "\t" in line:
            pid_s, cmd = line.split("\t", 1)
        else:
            continue
        try:
            out.append((int(pid_s.strip()), cmd.strip()))
        except ValueError:
            continue
    return out

def match_pids(patterns):
    hits = []
    for pid, cmd in list_python_cmds():
        if "_straindb_py_waiter" in cmd or "_pw_scrape_strain_database" in cmd:
            continue
        if any(rx.search(cmd) for rx in patterns):
            hits.append(pid)
    return hits

def ck(name: str):
    p = DATA / name
    if not p.exists():
        return {}
    return json.loads(p.read_text(encoding="utf-8"))

def ck_n(name: str) -> int:
    d = ck(name)
    return int(d.get("done_count", len(d.get("done") or [])))

def straindb_alive() -> bool:
    for pid, cmd in list_python_cmds():
        if "_pw_scrape_strain_database" in cmd:
            return True
    return False

def wait_phase() -> str:
    log("=== py-waiter-v5 start ===")
    while True:
        banks = match_pids(BANK_RES)
        longs = match_pids(LONG_RES)
        past = datetime.now() >= DEADLINE
        ab, sf, ckn, dc = (
            ck_n("dsc_strains_allbud.checkpoint.json"),
            ck_n("dsc_strains_seedfinder.checkpoint.json"),
            ck_n("dsc_strains_cropking.checkpoint.json"),
            ck_n("dsc_strains_dcseedexchange.checkpoint.json"),
        )
        log(f"ab={ab} sf={sf} ck={ckn} dc={dc} banks={banks} longs={longs} past4h={past}")
        if not banks and (not longs or past):
            label = "TIMEOUT-4H-PROCEED" if (past and longs) else "IDLE-READY"
            log(f"=== {label} ===")
            READY.write_text(f"{label}\n{datetime.now().isoformat()}\n", encoding="utf-8")
            return label
        # chunked sleep so heartbeats land
        for _ in range(6):
            time.sleep(30)
            PIDFILE.write_text(str(os.getpid()), encoding="utf-8")

def resume_straindb() -> int:
    sd = ck("dsc_strains_straindatabase.checkpoint.json")
    n0 = int(sd.get("done_count", len(sd.get("done") or [])))
    log(f"StrainDB resume start n0={n0} cursor={sd.get('cursor')}")
    if not straindb_alive():
        script = str(ROOT / "scripts" / "_pw_scrape_strain_database.py")
        args = [sys.executable, "-u", script, f"--delay={DELAY}"]
        log(f"launch: {' '.join(args)}")
        flags = 0x00000200 | 0x00000008  # NEW_GROUP | DETACHED
        with SCRAPE_LOG.open("a", encoding="utf-8") as out, SCRAPE_ERR.open("a", encoding="utf-8") as err:
            out.write(f"\n=== launch {datetime.now().isoformat()} delay={DELAY} ===\n")
            out.flush()
            proc = subprocess.Popen(args, cwd=str(ROOT), stdout=out, stderr=err, creationflags=flags, close_fds=True)
        log(f"StrainDB scrape PID={proc.pid}")
        RESULT.write_text(f"resumed=1\npid={proc.pid}\nn0={n0}\nstarted={datetime.now().isoformat()}\n", encoding="utf-8")
    else:
        log("StrainDB already running")
    deadline = time.time() + 3 * 3600
    last = n0
    while time.time() < deadline:
        time.sleep(45)
        alive = straindb_alive()
        sd2 = ck("dsc_strains_straindatabase.checkpoint.json")
        n1 = int(sd2.get("done_count", len(sd2.get("done") or [])))
        if n1 != last:
            log(f"StrainDB progress n={n1} (+{n1-n0}) alive={alive}")
            last = n1
            RESULT.write_text(f"resumed=1\nn0={n0}\nfinal_n={n1}\ncursor={sd2.get('cursor')}\nupdated={datetime.now().isoformat()}\nalive={alive}\n", encoding="utf-8")
        if n1 >= n0 + WAVE:
            log(f"Wave +{WAVE} reached n={n1}")
            break
        if not alive and n1 >= n0:
            # allow startup grace
            if time.time() > deadline - 3 * 3600 + 120 and n1 == n0:
                log("no progress / not alive")
                break
            if not alive and n1 > n0:
                log(f"ended n={n1}")
                break
    final = ck("dsc_strains_straindatabase.checkpoint.json")
    nf = int(final.get("done_count", len(final.get("done") or [])))
    RESULT.write_text(f"resumed=1\nn0={n0}\nfinal_n={nf}\ncursor={final.get('cursor')}\nfinished_at={datetime.now().isoformat()}\nalive={straindb_alive()}\n", encoding="utf-8")
    log(f"=== RESUME_DONE final_n={nf} ===")
    return nf

def main():
    PIDFILE.write_text(str(os.getpid()), encoding="utf-8")
    log(f"pid={os.getpid()} exe={sys.executable}")
    if READY.exists():
        READY.unlink()
    wait_phase()
    try:
        import sqlite3
        c = sqlite3.connect(str(ROOT / "brain" / "data" / "dsc_brain.sqlite3"), timeout=2)
        c.execute("BEGIN IMMEDIATE"); c.rollback(); c.close()
        log("master_unlocked_ok")
    except Exception as e:
        log(f"master_locked_skip {type(e).__name__}: {e}")
    resume_straindb()
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception:
        CRASH.write_text(traceback.format_exc(), encoding="utf-8")
        log("CRASH see _straindb_py_waiter_crash.txt")
        raise
