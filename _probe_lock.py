import sqlite3, time, sys
from pathlib import Path
p = Path("brain/data/dsc_brain.sqlite3").resolve()
print("path", p, flush=True)
t0 = time.time()
try:
    c = sqlite3.connect(str(p), timeout=30)
    print("connected", round(time.time()-t0,2), flush=True)
    c.execute("PRAGMA busy_timeout=30000")
    c.execute("BEGIN IMMEDIATE")
    print("BEGIN IMMEDIATE ok", round(time.time()-t0,2), flush=True)
    n = c.execute("SELECT count(*) FROM sqlite_master").fetchone()[0]
    print("sqlite_master", n, flush=True)
    c.commit()
    c.close()
    print("OK", flush=True)
except Exception as e:
    print("ERR", type(e).__name__, e, "after", round(time.time()-t0,2), flush=True)
    sys.exit(1)
