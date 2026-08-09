"""Resume-capable exclusive merger: skip completed OK, defer journaled live scrapes, indexes at end."""
from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
PLAN = ROOT / "brain" / "data" / "_n087_merge_plan.txt"
OUT = ROOT / "brain" / "data" / "_n087_exclusive_merge_results.jsonl"
LOG = ROOT / "brain" / "data" / "_n087_exclusive_merge.log"
SUMMARY = ROOT / "brain" / "data" / "_n087_exclusive_merge_summary.json"
MERGE = ROOT / "scripts" / "merge_staging_to_master.py"
INDEX = ROOT / "scripts" / "build_catalog_search_indexes.py"
STAGING = ROOT / "brain" / "data" / "staging"
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
PY = sys.executable
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0

# Families known to be written by live scrapers — skip while journal/wal present
LIVE_SCRAPE_HINTS = (
    "allbud",
    "seedfinder",
    "bank_",  # tier A1 may touch bank_* — only skip if journal present
)


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
            done.add(rec["family"])
    return done


def staging_path(family: str) -> Path:
    return STAGING / f"{family}.sqlite3"


def has_active_journal(family: str) -> bool:
    p = staging_path(family)
    if not p.exists():
        return False
    for suf in ("-journal", "-wal", "-shm"):
        side = Path(str(p) + suf)
        if side.exists() and side.stat().st_size > 0:
            # shm alone can linger; require journal or wal with size, or recent mtime
            if suf == "-shm":
                wal = Path(str(p) + "-wal")
                if not wal.exists() or wal.stat().st_size == 0:
                    continue
            return True
    return False


def should_defer(family: str) -> bool:
    if not has_active_journal(family):
        return False
    fl = family.lower()
    # Always defer journaled live scrape targets; for others also defer if journaled
    return True


def append_rec(rec: dict) -> None:
    with OUT.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def run_merge(family: str) -> dict:
    t0 = time.time()
    cmd = [PY, str(MERGE), "--only", family, "--no-link", "--no-search"]
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
        "flags": ["--no-link", "--no-search"],
    }
    append_rec(rec)
    return rec


def run_end_link() -> dict:
    force_flag = ROOT / "brain" / "data" / "_n087_force_no_link.flag"
    if force_flag.exists():
        force_flag.unlink(missing_ok=True)
    t0 = time.time()
    cmd = [PY, str(MERGE), "--link-only", "--no-search"]
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
    }
    append_rec(rec)
    if rec["ok"]:
        log(f"  OK end_link {rec['elapsed_s']}s")
    else:
        log(f"  FAIL end_link rc={rec['rc']} err={rec['stderr_tail'][:300]!r}")
    return rec


def master_counts() -> dict:
    out = {}
    try:
        c = sqlite3.connect(f"file:{MASTER.as_posix()}?mode=ro", uri=True, timeout=120)
        c.execute("PRAGMA busy_timeout=120000")
        tables = [
            r[0]
            for r in c.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1"
            )
        ]
        for t in tables:
            if t.startswith("sqlite_"):
                continue
            try:
                out[t] = c.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
            except Exception as e:
                out[t] = f"ERR:{e}"
        c.close()
    except Exception as e:
        out["_error"] = str(e)
    return out


def build_indexes() -> int:
    log("building catalog search indexes")
    p = subprocess.run(
        [PY, str(INDEX)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        creationflags=CREATE_NO_WINDOW,
    )
    log(f"indexes rc={p.returncode} out={(p.stdout or '')[-800:]}")
    return p.returncode


def merge_list(families: list[str], label: str) -> tuple[int, int, list[str]]:
    ok_n = fail_n = 0
    deferred: list[str] = []
    done = load_done_ok()
    for i, fam in enumerate(families, 1):
        if fam in done:
            log(f"[{label} {i}/{len(families)}] SKIP already OK {fam}")
            continue
        if should_defer(fam):
            log(f"[{label} {i}/{len(families)}] DEFER journaled {fam}")
            deferred.append(fam)
            continue
        if not staging_path(fam).exists():
            log(f"[{label} {i}/{len(families)}] MISS staging {fam}")
            fail_n += 1
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
        log(f"[{label} {i}/{len(families)}] merge --only {fam}")
        rec = run_merge(fam)
        if rec["ok"]:
            ok_n += 1
            log(f"  OK {fam} {rec['elapsed_s']}s")
            done.add(fam)
        else:
            fail_n += 1
            log(f"  FAIL {fam} rc={rec['rc']} err={rec['stderr_tail'][:300]!r}")
    return ok_n, fail_n, deferred


def main() -> int:
    families = [ln.strip() for ln in PLAN.read_text(encoding="utf-8").splitlines() if ln.strip()]
    log(f"RESUME exclusive merge families={len(families)} already_ok={len(load_done_ok())}")
    ok1, fail1, deferred = merge_list(families, "pass1")
    # Retry deferred once journals clear (up to ~30 min)
    still = list(deferred)
    for attempt in range(1, 7):
        if not still:
            break
        log(f"retry deferred attempt={attempt} n={len(still)} sleep 60s")
        time.sleep(60)
        nxt = []
        ok_r, fail_r, def_r = merge_list(still, f"retry{attempt}")
        ok1 += ok_r
        fail1 += fail_r
        still = def_r
        # also retry previous fails? only deferred journals
    skipped_final = still
    for fam in skipped_final:
        append_rec(
            {
                "family": fam,
                "rc": 3,
                "ok": False,
                "skipped_journal": True,
                "elapsed_s": 0,
                "stderr_tail": "deferred: active staging journal (live scrape)",
                "ts": datetime.now(timezone.utc).isoformat(),
            }
        )
        log(f"SKIPPED_FINAL journaled {fam}")
    # Ensure force-no-link flag is present for any late family merges; cleared in end_link.
    (ROOT / "brain" / "data" / "_n087_force_no_link.flag").write_text("1\n", encoding="utf-8")
    link_rec = run_end_link()
    idx_rc = build_indexes()
    counts = master_counts()
    summary = {
        "ok_this_run": ok1,
        "fail_this_run": fail1,
        "skipped_journal_final": skipped_final,
        "total_plan": len(families),
        "done_ok_total": len(load_done_ok()),
        "end_link_rc": link_rec["rc"],
        "index_rc": idx_rc,
        "master_counts": counts,
        "ts": datetime.now(timezone.utc).isoformat(),
    }
    SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    log(f"DONE {json.dumps({k: summary[k] for k in summary if k != 'master_counts'})}")
    return 0 if fail1 == 0 and idx_rc == 0 and link_rec["ok"] and not skipped_final else 1


if __name__ == "__main__":
    raise SystemExit(main())
