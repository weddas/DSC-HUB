#!/usr/bin/env python3
from __future__ import annotations
import json, subprocess, sys, time
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from brain.dsc_brain.corpus import connect, corpus_stats
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
ORDER = ["seedcity","kushy_crosses_local","cannabis_intelligence","phytochem_smith","leafly_flat_enrich","replication_labs","north_atlantic_local","medical_effects","cannia","pickle_archive","strains_master","cannaconnection","seedfinder"]
SKIP = {"allbud":"tiny/in-progress raw=6","cannlytics_expand":"journal lock / skip","leafly_flat":"prefer leafly_flat_enrich","phytochem_lab":"prefer phytochem_smith","north_atlantic":"prefer north_atlantic_local"}
PROGRESS = ROOT / "scripts" / "_fam_loop_progress.json"
LOG = ROOT / "scripts" / "_fam_loop.log"

def log(msg):
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")

def get_stats():
    for i in range(40):
        try:
            c = connect(DEFAULT_DB)
            c.execute("PRAGMA busy_timeout=180000")
            s = corpus_stats(c)
            c.close()
            return s
        except Exception as exc:
            log(f"STATS_WAIT {i}: {exc}")
            time.sleep(5)
    raise SystemExit("stats failed")

def journal_locked(family):
    j = STAGING_DIR / f"{family}.sqlite3-journal"
    return j.exists() and j.stat().st_size > 0

def save(progress):
    PROGRESS.write_text(json.dumps(progress, indent=2), encoding="utf-8")

def merge_family(family):
    cmd = [sys.executable, "-u", str(ROOT / "scripts" / "merge_staging_to_master.py"), "--only", family, "--no-search", "--no-link"]
    log(f"MERGE_START {family}")
    t0 = time.time()
    p = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
    elapsed = round(time.time() - t0, 1)
    out = (p.stdout or "") + (p.stderr or "")
    for line in out.splitlines()[-25:]:
        log("  | " + line)
    status = "merged" if p.returncode == 0 and "FAIL" not in out else "failed"
    if p.returncode != 0:
        status = "failed"
    log(f"MERGE_DONE {family} status={status} rc={p.returncode} s={elapsed}")
    return {"family": family, "status": status, "rc": p.returncode, "seconds": elapsed, "out_tail": out[-1500:]}

def main():
    LOG.write_text("", encoding="utf-8")
    results = []
    for fam, reason in SKIP.items():
        results.append({"family": fam, "status": "skipped", "reason": reason})
        log(f"SKIP {fam}: {reason}")
    before = get_stats()
    log("BEFORE " + json.dumps(before))
    progress = {"before": before, "results": results}
    save(progress)
    for family in ORDER:
        path = STAGING_DIR / f"{family}.sqlite3"
        if not path.exists():
            results.append({"family": family, "status": "skipped", "reason": "missing"})
            log(f"SKIP {family}: missing"); save(progress); continue
        if journal_locked(family):
            results.append({"family": family, "status": "skipped", "reason": "journal lock"})
            log(f"SKIP {family}: journal lock"); save(progress); continue
        last = None
        for attempt in range(3):
            last = merge_family(family)
            if last["status"] == "merged":
                break
            log(f"RETRY {family} attempt={attempt}")
            time.sleep(15)
        results.append(last)
        save(progress)
    log("BUILD_INDEXES")
    p = subprocess.run([sys.executable, "-u", str(ROOT / "scripts" / "build_catalog_search_indexes.py")], cwd=str(ROOT), capture_output=True, text=True)
    log((p.stdout or "")[-2000:])
    log(f"INDEX_RC {p.returncode}")
    after = get_stats()
    log("AFTER " + json.dumps(after))
    progress["after"] = after
    progress["index_rc"] = p.returncode
    save(progress)
    (ROOT / "scripts" / "_merge_serial_summary.json").write_text(json.dumps(progress, indent=2), encoding="utf-8")
    log("DONE")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())