"""N-087 exclusive sole-writer merge: one family at a time, no popups.

Collation: merge_staging_to_master uses INSERT OR IGNORE + entity_link + no attribute_kv.
N-087-MERGE-NOLINK: per-family --no-link --no-search; one link pass + indexes at end.
Skips families already OK in results jsonl (safe resume).
"""
from __future__ import annotations

import json
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
FORCE_NO_LINK = ROOT / "brain" / "data" / "_n087_force_no_link.flag"
PY = sys.executable
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0


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
    with OUT.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    return rec


def run_end_link() -> dict:
    """One science↔seed link pass after all typed family merges."""
    t0 = time.time()
    # Clear force flag so --link-only is not coerced to no-link.
    if FORCE_NO_LINK.exists():
        FORCE_NO_LINK.unlink(missing_ok=True)
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
    with OUT.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    if rec["ok"]:
        log(f"  OK end_link {rec['elapsed_s']}s")
    else:
        log(f"  FAIL end_link rc={rec['rc']} err={rec['stderr_tail'][:300]!r}")
    return rec


def main() -> int:
    FORCE_NO_LINK.write_text("1\n", encoding="utf-8")
    families = [ln.strip() for ln in PLAN.read_text(encoding="utf-8").splitlines() if ln.strip()]
    done = load_done_ok()
    log(
        f"START exclusive merge families={len(families)} already_ok={len(done)} "
        f"contract=INSERT_OR_IGNORE+entity_link+no_attribute_kv+no_link_per_family"
    )
    ok_n = fail_n = skip_n = 0
    for i, fam in enumerate(families, 1):
        if fam in done:
            skip_n += 1
            log(f"[{i}/{len(families)}] SKIP already OK {fam}")
            continue
        log(f"[{i}/{len(families)}] merge --only {fam} --no-link --no-search")
        rec = run_merge(fam)
        if rec["ok"]:
            ok_n += 1
            done.add(fam)
            log(f"  OK {fam} {rec['elapsed_s']}s")
        else:
            fail_n += 1
            log(f"  FAIL {fam} rc={rec['rc']} err={rec['stderr_tail'][:300]!r}")

    link_rec = run_end_link()
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
    summary = {
        "ok": ok_n,
        "fail": fail_n,
        "skipped_already_ok": skip_n,
        "total": len(families),
        "done_ok_total": len(load_done_ok()),
        "end_link_rc": link_rec["rc"],
        "index_rc": p.returncode,
    }
    SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    log(f"DONE {summary}")
    return 0 if fail_n == 0 and link_rec["ok"] and p.returncode == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
