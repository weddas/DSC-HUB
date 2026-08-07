import sqlite3, time, subprocess, sys
from pathlib import Path

CREATE_NO_WINDOW = 0x08000000

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
master = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
log = ROOT / "brain" / "data" / "staging" / "leafly_flat_waiter.log"
pid_path = ROOT / "brain" / "data" / "staging" / "leafly_flat_enrich_apply.pid"
out_path = ROOT / "brain" / "data" / "staging" / "leafly_flat_enrich_apply_run.log"
err_path = ROOT / "brain" / "data" / "staging" / "leafly_flat_enrich_apply_stderr.txt"

def w(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    print(line, flush=True)
    with log.open("a", encoding="utf-8") as f:
        f.write(line + "\n")

w(f"waiter start master={master} size={master.stat().st_size}")
unlocked = False
for i in range(1, 361):
    try:
        c = sqlite3.connect(str(master), timeout=1.0)
        c.execute("PRAGMA busy_timeout=1000")
        c.execute("BEGIN IMMEDIATE")
        n = c.execute(
            "SELECT COUNT(1) FROM chemistry_profile WHERE source_id=?",
            ("leafly_flat_enrich",),
        ).fetchone()[0]
        c.execute("COMMIT")
        c.close()
        w(f"UNLOCKED attempt={i} preexisting_leafly_chem={n}")
        unlocked = True
        break
    except Exception as e:
        if i == 1 or i % 12 == 0:
            w(f"locked attempt={i}/360 {type(e).__name__}: {e}")
        time.sleep(5)

if not unlocked:
    w("FAILED still locked")
    sys.exit(2)

# Prefer enrich apply; fallback merge
cmds = [
    [sys.executable, "-u", str(ROOT / "scripts" / "enrich_leafly_flat.py"), "--apply-from-staging"],
    [sys.executable, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"), "--only", "leafly_flat_enrich"],
]

for idx, cmd in enumerate(cmds):
    w(f"running cmd[{idx}]: {' '.join(cmd)}")
    with out_path.open("a", encoding="utf-8") as out, err_path.open("a", encoding="utf-8") as err:
        out.write(f"\n===== cmd[{idx}] start =====\n")
        err.write(f"\n===== cmd[{idx}] start =====\n")
        _kw = {"cwd": str(ROOT), "stdout": out, "stderr": err, "stdin": subprocess.DEVNULL}
        if sys.platform == "win32":
            _kw["creationflags"] = CREATE_NO_WINDOW
            _si = subprocess.STARTUPINFO(); _si.dwFlags |= subprocess.STARTF_USESHOWWINDOW; _si.wShowWindow = 0
            _kw["startupinfo"] = _si
        p = subprocess.Popen(cmd, **_kw)
        pid_path.write_text(str(p.pid), encoding="ascii")
        w(f"spawned pid={p.pid}")
        rc = p.wait()
        w(f"cmd[{idx}] exit={rc}")
    if rc == 0:
        w("SUCCESS")
        sys.exit(0)
    w(f"cmd[{idx}] failed; trying next if any")

w("ALL COMMANDS FAILED")
sys.exit(1)
