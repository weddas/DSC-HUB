import sqlite3, sys, time, traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))
LOG = ROOT / "brain" / "data" / "_na_direct_merge.log"
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
JOURNAL = Path(str(MASTER) + "-journal")
APPLY_LOCK = ROOT / "scripts" / "_n087_apply_staging.lock"

def log(m: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {m}\n"
    print(line, end="", flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line)

def wait_clear(timeout_s: float = 120.0) -> bool:
    t0 = time.time()
    while time.time() - t0 < timeout_s:
        if JOURNAL.exists() or APPLY_LOCK.exists():
            log(f"waiting clear journal={JOURNAL.exists()} apply_lock={APPLY_LOCK.exists()}")
            time.sleep(10)
            continue
        try:
            con = sqlite3.connect(str(MASTER), timeout=10)
            con.execute("PRAGMA busy_timeout=10000")
            con.execute("BEGIN IMMEDIATE")
            con.execute("ROLLBACK")
            con.close()
            log("writable")
            return True
        except Exception as e:
            log(f"busy {e}")
            time.sleep(10)
    return False

def main() -> int:
    # append mode continuity
    log("START resilient NA merge")
    from merge_staging_to_master import main as merge_main
    for only in ["north_atlantic.sqlite3", "north_atlantic_local.sqlite3"]:
        if not (ROOT / "brain" / "data" / "staging" / only).exists():
            log(f"missing {only}")
            continue
        ok = False
        for attempt in range(1, 11):
            log(f"attempt {attempt}/10 {only}")
            if not wait_clear(150):
                log("clear-timeout; retry")
                continue
            try:
                rc = merge_main(["--only", only, "--no-search", "--no-link"])
                log(f"rc={rc}")
                if rc == 0:
                    log(f"MERGE_OK {only}")
                    ok = True
                    break
            except Exception as e:
                log(f"exc {e}")
                traceback.print_exc()
            time.sleep(10)
        if not ok:
            log(f"FAILED {only}")
            return 1
    log("DONE")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
