"""N-087 local-SSD exclusive merge (NAS I/O bypass).

Copies master (+WAL) to %TEMP%, merges remaining plan families with --no-link,
runs one end-link + HA indexes from local DB, copies master back to NAS.
CREATE_NO_WINDOW only. Sole writer assumed (caller must stop NAS writers first).
"""
from __future__ import annotations

import json
import os
import shutil
import sqlite3
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "brain" / "data"
PLAN = DATA / "_n087_merge_plan.txt"
OUT = DATA / "_n087_exclusive_merge_results.jsonl"
LOG = DATA / "_n087_exclusive_merge.log"
SUMMARY = DATA / "_n087_exclusive_merge_summary.json"
NAS_MASTER = DATA / "dsc_brain.sqlite3"
MERGE = ROOT / "scripts" / "merge_staging_to_master.py"
INDEX = ROOT / "scripts" / "build_catalog_search_indexes.py"
FORCE_NO_LINK = DATA / "_n087_force_no_link.flag"
PY = sys.executable
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0
LOCAL_DIR = Path(os.environ.get("TEMP", r"C:\Temp")) / "dsc_n087_merge_work"
LOCAL_MASTER = LOCAL_DIR / "dsc_brain.sqlite3"


def log(msg: str) -> None:
    line = f"{datetime.now(timezone.utc).isoformat()} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


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


def append_rec(rec: dict) -> None:
    with OUT.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def copy_master_to_local() -> None:
    LOCAL_DIR.mkdir(parents=True, exist_ok=True)
    for p in LOCAL_DIR.glob("dsc_brain.sqlite3*"):
        p.unlink(missing_ok=True)
    log(f"COPY_NAS_TO_LOCAL {NAS_MASTER} -> {LOCAL_MASTER}")
    t0 = time.time()
    shutil.copy2(NAS_MASTER, LOCAL_MASTER)
    for suf in ("-wal", "-shm"):
        src = Path(str(NAS_MASTER) + suf)
        if src.exists():
            shutil.copy2(src, Path(str(LOCAL_MASTER) + suf))
            log(f"  copied {src.name} ({src.stat().st_size} bytes)")
    # Open to apply/rollback WAL onto local main
    conn = sqlite3.connect(str(LOCAL_MASTER), timeout=600)
    conn.execute("PRAGMA busy_timeout=600000")
    try:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    except sqlite3.Error as e:
        log(f"  checkpoint note: {e}")
    conn.execute("PRAGMA quick_check").fetchone()
    n_chem = conn.execute("SELECT COUNT(*) FROM chemistry_profile").fetchone()[0]
    n_can = conn.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0]
    conn.close()
    # Drop leftover wal/shm after truncate if present
    for suf in ("-wal", "-shm"):
        Path(str(LOCAL_MASTER) + suf).unlink(missing_ok=True)
    log(
        f"  local ready elapsed={time.time()-t0:.1f}s canonical={n_can} chem={n_chem} "
        f"size={LOCAL_MASTER.stat().st_size}"
    )


def copy_master_to_nas() -> None:
    log(f"COPY_LOCAL_TO_NAS {LOCAL_MASTER} -> {NAS_MASTER}")
    t0 = time.time()
    # Checkpoint local first
    conn = sqlite3.connect(str(LOCAL_MASTER), timeout=600)
    try:
        conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    except sqlite3.Error:
        pass
    conn.close()
    for suf in ("-wal", "-shm"):
        Path(str(LOCAL_MASTER) + suf).unlink(missing_ok=True)
        Path(str(NAS_MASTER) + suf).unlink(missing_ok=True)
    tmp = Path(str(NAS_MASTER) + ".n087_new")
    tmp.unlink(missing_ok=True)
    shutil.copy2(LOCAL_MASTER, tmp)
    # Replace NAS master
    bak = Path(str(NAS_MASTER) + ".pre_local_ssd")
    if NAS_MASTER.exists():
        if bak.exists():
            bak.unlink()
        NAS_MASTER.replace(bak)
    tmp.replace(NAS_MASTER)
    log(f"  NAS master replaced elapsed={time.time()-t0:.1f}s bak={bak.name}")


def run_merge(family: str) -> dict:
    t0 = time.time()
    cmd = [
        PY,
        str(MERGE),
        "--master",
        str(LOCAL_MASTER),
        "--only",
        family,
        "--no-link",
        "--no-search",
    ]
    p = subprocess.run(
        cmd,
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        creationflags=CREATE_NO_WINDOW,
    )
    rec = {
        "family": family,
        "rc": p.returncode,
        "elapsed_s": round(time.time() - t0, 1),
        "stdout_tail": (p.stdout or "")[-2000:],
        "stderr_tail": (p.stderr or "")[-1500:],
        "ok": p.returncode == 0,
        "ts": datetime.now(timezone.utc).isoformat(),
        "flags": ["--no-link", "--no-search", "--master=local_ssd"],
    }
    append_rec(rec)
    return rec


def run_end_link() -> dict:
    FORCE_NO_LINK.unlink(missing_ok=True)
    t0 = time.time()
    cmd = [PY, str(MERGE), "--master", str(LOCAL_MASTER), "--link-only", "--no-search"]
    log(f"END_LINK {' '.join(cmd[1:])}")
    p = subprocess.run(
        cmd,
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        creationflags=CREATE_NO_WINDOW,
    )
    rec = {
        "family": "_end_link",
        "rc": p.returncode,
        "elapsed_s": round(time.time() - t0, 1),
        "stdout_tail": (p.stdout or "")[-2000:],
        "stderr_tail": (p.stderr or "")[-1500:],
        "ok": p.returncode == 0,
        "ts": datetime.now(timezone.utc).isoformat(),
        "flags": ["--link-only", "--master=local_ssd"],
    }
    append_rec(rec)
    if rec["ok"]:
        log(f"  OK end_link {rec['elapsed_s']}s out={rec['stdout_tail'][-400:]}")
    else:
        log(f"  FAIL end_link rc={rec['rc']} err={rec['stderr_tail'][:400]!r}")
    return rec


def phytochem_count() -> int:
    conn = sqlite3.connect(str(LOCAL_MASTER), timeout=120)
    try:
        # phytochem source ids vary; count chem rows whose id/source mentions phytochem/smith
        n = conn.execute(
            """
            SELECT COUNT(*) FROM chemistry_profile
            WHERE source_id LIKE '%phytochem%'
               OR id LIKE '%phytochem%'
               OR id LIKE '%smith%'
            """
        ).fetchone()[0]
        # also try staging_source style
        n2 = conn.execute(
            """
            SELECT COUNT(*) FROM chemistry_profile c
            JOIN source_record s ON s.id = c.source_id
            WHERE s.id LIKE '%phytochem%' OR s.name LIKE '%Phytochem%' OR s.name LIKE '%Smith%'
            """
        ).fetchone()[0]
        return max(int(n), int(n2))
    finally:
        conn.close()


def main() -> int:
    FORCE_NO_LINK.write_text("1\n", encoding="utf-8")
    families = [ln.strip() for ln in PLAN.read_text(encoding="utf-8").splitlines() if ln.strip()]
    done = load_done_ok()
    log(
        f"LOCAL_SSD_START families={len(families)} already_ok={len(done)} "
        f"local={LOCAL_MASTER}"
    )
    copy_master_to_local()
    phyto_before = phytochem_count()
    log(f"phytochem_chem_before={phyto_before}")

    ok_n = fail_n = skip_n = 0
    for i, fam in enumerate(families, 1):
        if fam in done:
            skip_n += 1
            log(f"[{i}/{len(families)}] SKIP already OK {fam}")
            continue
        staging = DATA / "staging" / f"{fam}.sqlite3"
        if not staging.exists():
            fail_n += 1
            log(f"[{i}/{len(families)}] MISS staging {fam}")
            append_rec(
                {
                    "family": fam,
                    "rc": 2,
                    "ok": False,
                    "elapsed_s": 0,
                    "stderr_tail": "staging missing",
                    "ts": datetime.now(timezone.utc).isoformat(),
                }
            )
            continue
        log(f"[{i}/{len(families)}] merge --only {fam} --no-link (local)")
        rec = run_merge(fam)
        if rec["ok"]:
            ok_n += 1
            done.add(fam)
            log(f"  OK {fam} {rec['elapsed_s']}s")
        else:
            fail_n += 1
            log(f"  FAIL {fam} rc={rec['rc']} err={rec['stderr_tail'][:300]!r}")

    phyto_after = phytochem_count()
    log(f"phytochem_chem_after={phyto_after}")
    link_rec = run_end_link()

    log("building catalog search indexes from local master")
    p = subprocess.run(
        [PY, str(INDEX), "--db", str(LOCAL_MASTER)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        creationflags=CREATE_NO_WINDOW,
    )
    log(f"indexes rc={p.returncode} out={(p.stdout or '')[-800:]}")

    copy_master_to_nas()
    summary = {
        "mode": "local_ssd",
        "ok": ok_n,
        "fail": fail_n,
        "skipped_already_ok": skip_n,
        "total": len(families),
        "done_ok_total": len(load_done_ok()),
        "phytochem_chem_before": phyto_before,
        "phytochem_chem_after": phyto_after,
        "end_link_rc": link_rec["rc"],
        "index_rc": p.returncode,
        "local_master": str(LOCAL_MASTER),
        "ts": datetime.now(timezone.utc).isoformat(),
    }
    SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    log(f"DONE {summary}")
    return 0 if fail_n == 0 and link_rec["ok"] and p.returncode == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
