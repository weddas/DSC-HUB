import os, subprocess, sys, time
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
LOG = ROOT / "brain" / "data" / "staging" / "leafly_flat_unlock_apply.log"
HB = ROOT / "brain" / "data" / "staging" / "leafly_flat_unlock_apply.heartbeat"
OUT = ROOT / "brain" / "data" / "staging" / "leafly_flat_enrich_apply_run.log"
ERR = ROOT / "brain" / "data" / "staging" / "leafly_flat_enrich_apply_stderr.txt"
RESULT = ROOT / "brain" / "data" / "staging" / "leafly_flat_enrich_apply_result.txt"
PROBE = ROOT / "brain" / "data" / "staging" / "_leafly_lock_probe.py"
PY = r"C:\Program Files\Python314\python.exe"

PROBE.write_text(
    "import sqlite3,sys\n"
    f"p=r'{MASTER.as_posix()}'\n"
    "c=sqlite3.connect(p, timeout=1.0)\n"
    "c.execute('PRAGMA busy_timeout=1000')\n"
    "c.execute('BEGIN IMMEDIATE')\n"
    "c.execute('SELECT 1')\n"
    "c.execute('COMMIT')\n"
    "c.close()\n"
    "print('OK')\n",
    encoding="utf-8",
)

logf = open(LOG, "a", encoding="utf-8", buffering=1)
sys.stdout = logf
sys.stderr = logf

def log(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    logf.write(line + "\n"); logf.flush()
    HB.write_text(line + "\n", encoding="utf-8")

log(f"start pid={os.getpid()} child-probe waiter")

unlocked = False
for i in range(1, 721):
    HB.write_text(f"attempt={i} child-probe\n", encoding="utf-8")
    try:
        p = subprocess.run(
            [PY, "-u", str(PROBE)],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            timeout=20,
        )
        if p.returncode == 0 and "OK" in (p.stdout or ""):
            log(f"UNLOCKED attempt={i}")
            unlocked = True
            break
        err = ((p.stderr or "") + (p.stdout or "")).strip().replace("\n", " ")[:200]
        if i == 1 or i % 6 == 0:
            log(f"locked attempt={i}/720 rc={p.returncode} {err}")
    except subprocess.TimeoutExpired:
        if i == 1 or i % 6 == 0:
            log(f"locked attempt={i}/720 probe_timeout")
    except Exception as e:
        log(f"probe_err attempt={i} {type(e).__name__}: {e}")
    time.sleep(5)

if not unlocked:
    log("GIVE_UP still locked")
    RESULT.write_text("FAILED still_locked\n", encoding="utf-8")
    raise SystemExit(2)

cmds = [
    [PY, "-u", str(ROOT / "scripts" / "enrich_leafly_flat.py"), "--apply-from-staging"],
    [PY, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"), "--only", "leafly_flat_enrich"],
]

for idx, cmd in enumerate(cmds):
    log(f"RUN[{idx}] {' '.join(cmd)}")
    with OUT.open("a", encoding="utf-8") as out, ERR.open("a", encoding="utf-8") as err:
        out.write(f"\n===== RUN[{idx}] {time.strftime('%H:%M:%S')} =====\n"); out.flush()
        err.write(f"\n===== RUN[{idx}] {time.strftime('%H:%M:%S')} =====\n"); err.flush()
        p = subprocess.run(cmd, cwd=str(ROOT), stdout=out, stderr=err)
    log(f"RUN[{idx}] rc={p.returncode}")
    if p.returncode == 0:
        # verify in child too
        v = subprocess.run(
            [PY, "-u", "-c",
             "import sqlite3; c=sqlite3.connect(r'%s', timeout=120); c.execute('PRAGMA busy_timeout=120000'); "
             "print(c.execute(\"SELECT COUNT(1) FROM chemistry_profile WHERE source_id='leafly_flat_enrich'\").fetchone()[0])"
             % MASTER.as_posix()],
            cwd=str(ROOT), capture_output=True, text=True, timeout=300,
        )
        n = (v.stdout or "").strip()
        msg = f"SUCCESS via cmd[{idx}] leafly_chem={n} verify_rc={v.returncode}"
        log(msg)
        RESULT.write_text(msg + "\n", encoding="utf-8")
        raise SystemExit(0)
    log(f"cmd[{idx}] failed; trying fallback if any")

log("ALL FAILED")
RESULT.write_text("FAILED all_commands\n", encoding="utf-8")
raise SystemExit(1)
