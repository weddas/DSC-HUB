import sqlite3, time
from pathlib import Path
p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\dsc_brain.sqlite3")
j = Path(str(p) + "-journal")
print("journal_before", j.exists(), j.stat().st_size if j.exists() else None, flush=True)
t0 = time.time()
try:
    c = sqlite3.connect(str(p), timeout=60)
    print("connected", round(time.time()-t0,2), flush=True)
    c.execute("PRAGMA busy_timeout=60000")
    c.execute("BEGIN IMMEDIATE")
    print("BEGIN ok", round(time.time()-t0,2), flush=True)
    n = c.execute("SELECT COUNT(1) FROM chemistry_profile WHERE source_id=?", ("leafly_flat_enrich",)).fetchone()[0]
    print("leafly_chem", n, flush=True)
    c.execute("COMMIT")
    c.close()
    print("journal_after", j.exists(), flush=True)
    print("OK", flush=True)
except Exception as e:
    print("ERR", type(e).__name__, e, "after", round(time.time()-t0,2), flush=True)
