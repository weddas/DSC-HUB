"""Exclusive serialize — hytiva first. Never --reset."""
from __future__ import annotations
import json, sqlite3, subprocess, sys, time, traceback
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT / "brain"))
sys.path.insert(0, str(ROOT / "scripts"))
from dsc_brain.corpus import connect, corpus_stats
from dsc_brain.paths import DEFAULT_DB, STAGING_DIR

PY = r"C:\Program Files\Python314\python.exe"
CREATE_NO_WINDOW = 0x08000000
_SUB_KW = {"creationflags": CREATE_NO_WINDOW} if sys.platform == "win32" else {}
LOG = ROOT / "brain" / "data" / "_serialize_exclusive.log"
OUT = ROOT / "brain" / "data" / "_serialize_exclusive_result.json"
FAMILIES = [
    "hytiva",
    "cannabis_intelligence", "phytochem_smith", "leafly_flat_enrich",
    "replication_labs", "north_atlantic_local", "north_atlantic",
    "medical_effects", "cannia", "pickle_archive", "strains_master",
    "cannaconnection", "cannareviews", "alchimia",
    "forum_420mag", "forum_phenohunter", "forum_mjpassion", "cannlytics_expand",
]

def log(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")

def has_journal(path: Path) -> bool:
    return any(Path(str(path) + s).exists() for s in ("-journal", "-wal", "-shm"))

def raw_count(path: Path):
    if not path.exists():
        return None
    c = sqlite3.connect(str(path), timeout=30)
    try:
        n = c.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0]
    except Exception:
        n = -1
    c.close()
    return n

def merge_family(family: str) -> dict:
    path = STAGING_DIR / f"{family}.sqlite3"
    r = {"family": family, "status": "unknown", "detail": ""}
    if not path.exists():
        r.update(status="skipped", detail="missing_staging"); log(f"SKIP {family}: missing"); return r
    if has_journal(path):
        r.update(status="skipped", detail="active_journal"); log(f"SKIP {family}: journal"); return r
    raw = raw_count(path)
    r["staging_raw"] = raw
    if raw == 0:
        r.update(status="skipped", detail="empty"); log(f"SKIP {family}: empty"); return r
    log(f"MERGE {family} raw={raw}")
    if family == "leafly_flat_enrich":
        p = subprocess.run([PY, "-u", str(ROOT / "scripts" / "enrich_leafly_flat.py"), "--apply-from-staging"],
                           cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8", errors="replace", **_SUB_KW)
        r["enrich_rc"] = p.returncode
        r["stdout_tail"] = (p.stdout or "")[-2500:]
        r["stderr_tail"] = (p.stderr or "")[-2500:]
        if p.returncode == 0:
            r.update(status="merged", detail="enrich_apply"); log(f"OK {family} enrich"); return r
        log(f"enrich fail rc={p.returncode}; fallback merge_staging")
    p = subprocess.run([PY, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"), "--only", family],
                       cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8", errors="replace", **_SUB_KW)
    r["rc"] = p.returncode
    r["stdout_tail"] = (p.stdout or "")[-3000:]
    r["stderr_tail"] = (p.stderr or "")[-3000:]
    if p.returncode == 0:
        out = (p.stdout or "") + (p.stderr or "")
        if "skip" in out.lower() and "already" in out.lower():
            r.update(status="skipped", detail="already_done")
        else:
            r.update(status="merged", detail="merge_staging_to_master")
        log(f"OK {family} status={r['status']}")
    else:
        r.update(status="failed", detail=f"rc={p.returncode}")
        log(f"FAIL {family} rc={p.returncode} err={(p.stderr or '')[:400]}")
    return r

def quick_stats():
    m = connect(DEFAULT_DB, timeout=120.0)
    try:
        return corpus_stats(m)
    finally:
        m.close()

def main():
    LOG.write_text("", encoding="utf-8")
    log("EXCLUSIVE SERIALIZE START v2")
    for i in range(1, 30):
        try:
            c = sqlite3.connect(str(DEFAULT_DB), timeout=20)
            c.execute("PRAGMA busy_timeout=20000")
            c.execute("BEGIN IMMEDIATE"); c.commit(); c.close()
            log(f"unlocked attempt={i}"); break
        except Exception as e:
            log(f"locked {i}: {e}"); time.sleep(3)
    else:
        log("GIVE_UP"); return 2
    before = {}
    try:
        before = quick_stats(); log(f"BEFORE {json.dumps(before, default=str)}")
    except Exception as e:
        log(f"BEFORE_SKIP {e}")
    results = []
    for fam in FAMILIES:
        try:
            r = merge_family(fam)
        except Exception as e:
            r = {"family": fam, "status": "failed", "detail": str(e)}
            log(f"EXC {fam}: {e}"); traceback.print_exc()
        results.append(r)
        if fam == "hytiva":
            (ROOT / "brain" / "data" / "_hytiva_merge_report.json").write_text(json.dumps(r, indent=2), encoding="utf-8")
            log(f"HYTIVA_REPORT {r.get('status')} raw={r.get('staging_raw')} detail={r.get('detail')}")
    log("BUILD indexes")
    p = subprocess.run([PY, "-u", str(ROOT / "scripts" / "build_catalog_search_indexes.py")],
                       cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8", errors="replace", **_SUB_KW)
    log(f"indexes rc={p.returncode}")
    after = {}
    try:
        after = quick_stats(); log(f"AFTER {json.dumps(after, default=str)}")
    except Exception as e:
        log(f"AFTER_SKIP {e}")
    summary = {
        "before": before, "after": after, "results": results,
        "merged": [x["family"] for x in results if x.get("status") == "merged"],
        "skipped": [{"family": x["family"], "detail": x.get("detail")} for x in results if x.get("status") == "skipped"],
        "failed": [{"family": x["family"], "detail": x.get("detail")} for x in results if x.get("status") == "failed"],
        "indexes_rc": p.returncode,
        "finished_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    OUT.write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")
    log(f"MERGED={summary['merged']}")
    log(f"SKIPPED={summary['skipped']}")
    log(f"FAILED={summary['failed']}")
    log("DONE")
    return 0 if not summary["failed"] else 1

if __name__ == "__main__":
    raise SystemExit(main())
