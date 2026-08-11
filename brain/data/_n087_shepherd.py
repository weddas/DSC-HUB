"""Shepherd N-087 exclusive merge to completion. Resume only if dead. CREATE_NO_WINDOW only."""
from __future__ import annotations

import json
import os
import sqlite3
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "brain" / "data"
LOG = DATA / "_n087_exclusive_merge.log"
OUT = DATA / "_n087_exclusive_merge_results.jsonl"
SUMMARY = DATA / "_n087_exclusive_merge_summary.json"
PIDFILE = DATA / "_n087_exclusive_merge.pid"
SHEPHERD_LOG = DATA / "_n087_shepherd.log"
RESUME = DATA / "_n087_exclusive_merge_resume.py"
WRAPPER = DATA / "_n087_exclusive_merge.py"
RUN_CMD = DATA / "_n087_exclusive_merge_run.cmd"
MASTER = DATA / "dsc_brain.sqlite3"
PLAN = DATA / "_n087_merge_plan.txt"
PY = sys.executable
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0
POLL_S = 60
STALL_WAL_CHECKS = 30  # ~30 min no WAL growth while merge child alive -> note only
SHEPHERD_PID = DATA / "_n087_shepherd.pid"


def slog(msg: str) -> None:
    line = f"{datetime.now().astimezone().isoformat()} {msg}"
    print(line, flush=True)
    with SHEPHERD_LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def log_append(msg: str) -> None:
    line = f"{datetime.now(timezone.utc).isoformat()} {msg}"
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def plan_families() -> list[str]:
    return [ln.strip() for ln in PLAN.read_text(encoding="utf-8").splitlines() if ln.strip()]


def load_done_ok() -> set[str]:
    done: set[str] = set()
    if not OUT.exists():
        return done
    for line in OUT.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if rec.get("ok") and rec.get("family"):
            done.add(str(rec["family"]))
    return done


def wmic_cmdlines() -> list[tuple[int, str]]:
    try:
        r = subprocess.run(
            ["powershell", "-NoProfile", "-Command",
             "Get-CimInstance Win32_Process -Filter \"name='python.exe' OR name='pythonw.exe' OR name='cmd.exe'\" | "
             "Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress"],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
            creationflags=CREATE_NO_WINDOW, timeout=60,
        )
    except Exception as e:
        slog(f"wmic fail {e}")
        return []
    raw = (r.stdout or "").strip()
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if isinstance(data, dict):
        data = [data]
    out = []
    for row in data:
        cl = row.get("CommandLine") or ""
        pid = int(row.get("ProcessId") or 0)
        if pid:
            out.append((pid, cl))
    return out


def merge_alive() -> dict:
    """Detect exclusive merge wrapper or active merge_staging_to_master child."""
    hits = {"wrapper": [], "child": [], "resume": [], "cmd": []}
    for pid, cl in wmic_cmdlines():
        cl_l = cl.lower().replace("/", "\\")
        if "_n087_exclusive_merge_resume.py" in cl_l:
            hits["resume"].append(pid)
        elif "_n087_exclusive_merge.py" in cl_l and "resume" not in cl_l:
            hits["wrapper"].append(pid)
        elif "merge_staging_to_master.py" in cl_l and "--only" in cl_l:
            hits["child"].append(pid)
        elif "_n087_exclusive_merge_run.cmd" in cl_l:
            hits["cmd"].append(pid)
    alive = bool(hits["wrapper"] or hits["child"] or hits["resume"] or hits["cmd"])
    return {"alive": alive, **hits}


def wal_size() -> int:
    p = Path(str(MASTER) + "-wal")
    try:
        return p.stat().st_size if p.exists() else 0
    except OSError:
        return 0


def launch_resume() -> int | None:
    # Prefer resume script (skips OK families)
    script = RESUME if RESUME.exists() else WRAPPER
    slog(f"LAUNCH resume via {script.name}")
    log_append(f"SHEPHERD launching {script.name} (prior writer dead)")
    # Update pidfile with new cmd pid after start
    creationflags = CREATE_NO_WINDOW | getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
    # Use python -u directly CREATE_NO_WINDOW (no console)
    proc = subprocess.Popen(
        [PY, "-u", str(script)],
        cwd=str(ROOT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=CREATE_NO_WINDOW,
    )
    PIDFILE.write_text(str(proc.pid), encoding="utf-8")
    slog(f"resume pid={proc.pid}")
    return proc.pid


def summary_done() -> bool:
    if not SUMMARY.exists():
        return False
    try:
        s = json.loads(SUMMARY.read_text(encoding="utf-8"))
    except Exception:
        return False
    # original wrapper writes ok/fail/total; resume writes done_ok_total
    if "DONE" in (LOG.read_text(encoding="utf-8") if LOG.exists() else ""):
        # check last DONE line
        for line in reversed(LOG.read_text(encoding="utf-8").splitlines()):
            if " DONE " in line or line.endswith("DONE") or " DONE {" in line or line.strip().endswith("}") and "DONE" in line:
                if "DONE" in line:
                    return True
    if s.get("total") and s.get("ok", 0) + s.get("fail", 0) >= s.get("total", 0):
        return True
    if s.get("done_ok_total") is not None and s.get("index_rc") is not None:
        return True
    return False


def master_counts() -> dict:
    out = {}
    try:
        c = sqlite3.connect(f"file:{MASTER.as_posix()}?mode=ro", uri=True, timeout=120)
        c.execute("PRAGMA busy_timeout=120000")
        for t in [
            "strain_canonical", "strain_variant", "chemistry_profile", "grow_trait",
            "entity_link", "attribute_kv", "raw_record", "source_record",
        ]:
            try:
                out[t] = c.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
            except Exception as e:
                out[t] = f"ERR:{e}"
        c.close()
    except Exception as e:
        out["_error"] = str(e)
    return out


def main() -> int:
    SHEPHERD_PID.write_text(str(os.getpid()), encoding="utf-8")
    families = plan_families()
    slog(f"SHEPHERD start plan={len(families)} poll={POLL_S}s pid={os.getpid()}")
    last_wal = wal_size()
    stall = 0
    last_status = 0.0

    while True:
        if summary_done():
            slog("summary indicates complete")
            break

        st = merge_alive()
        done = load_done_ok()
        wal = wal_size()
        now = time.time()

        if now - last_status >= 300:
            slog(
                f"status alive={st['alive']} wrapper={st['wrapper']} child={st['child']} "
                f"resume={st['resume']} done_ok={len(done)}/{len(families)} wal_mb={wal/1e6:.1f}"
            )
            last_status = now

        if st["alive"]:
            if wal > last_wal:
                stall = 0
                last_wal = wal
            elif st["child"] or st["wrapper"] or st["resume"]:
                stall += 1
                if stall == STALL_WAL_CHECKS:
                    slog(f"NOTE wal stalled ~{STALL_WAL_CHECKS*POLL_S//60}min but process still alive; not restarting")
            time.sleep(POLL_S)
            continue

        # Dead — if all OK in results and indexes not done, resume will build indexes
        slog(f"writer DEAD done_ok={len(done)}/{len(families)} — launching resume")
        # Clear stale summary if incomplete
        if SUMMARY.exists() and not summary_done():
            try:
                SUMMARY.unlink()
            except OSError:
                pass
        launch_resume()
        # give it time to spawn child
        time.sleep(15)
        st2 = merge_alive()
        if not st2["alive"]:
            slog("ERROR resume failed to stay alive; retry in 60s")
            time.sleep(60)
            continue
        last_wal = wal_size()
        stall = 0
        time.sleep(POLL_S)

    # Final report
    done = load_done_ok()
    counts = master_counts()
    summary = {}
    if SUMMARY.exists():
        try:
            summary = json.loads(SUMMARY.read_text(encoding="utf-8"))
        except Exception:
            pass
    fail_families = []
    if OUT.exists():
        last_by_fam = {}
        for line in OUT.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get("family"):
                last_by_fam[rec["family"]] = rec
        for fam in families:
            rec = last_by_fam.get(fam)
            if not rec or not rec.get("ok"):
                fail_families.append(fam)

    ok = len(done) == len(families) and not fail_families and summary.get("index_rc", 1) == 0
    # looser: if summary says fail_n
    report = {
        "shepherd_verdict": "OK" if ok else "FAIL",
        "done_ok": len(done),
        "plan_total": len(families),
        "fail_or_missing": fail_families,
        "index_rc": summary.get("index_rc"),
        "summary": {k: summary[k] for k in summary if k != "master_counts"} if summary else {},
        "master_counts": counts,
        "ts": datetime.now().astimezone().isoformat(),
    }
    report_path = DATA / "_n087_shepherd_final.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    slog(f"FINAL {json.dumps(report)}")
    return 0 if report["shepherd_verdict"] == "OK" else 1


if __name__ == "__main__":
    raise SystemExit(main())
