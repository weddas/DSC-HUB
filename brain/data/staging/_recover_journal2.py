import sqlite3, time, os
from pathlib import Path
p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\dsc_brain.sqlite3")
j = Path(str(p) + "-journal")
print("journal_before", j.exists(), j.stat().st_size if j.exists() else None, flush=True)
# list who might lock - try delete after unlock
c = sqlite3.connect(str(p), timeout=30)
c.execute("PRAGMA busy_timeout=30000")
c.execute("PRAGMA journal_mode")
print("journal_mode", c.execute("PRAGMA journal_mode").fetchone(), flush=True)
c.execute("BEGIN IMMEDIATE")
c.execute("SELECT COUNT(*) FROM sqlite_master")
print("sqlite_master_ok", flush=True)
c.execute("COMMIT")
c.close()
time.sleep(0.5)
print("journal_after", j.exists(), flush=True)
if j.exists():
    try:
        j.unlink()
        print("unlinked_stale_journal", flush=True)
    except Exception as e:
        print("unlink_fail", type(e).__name__, e, flush=True)
