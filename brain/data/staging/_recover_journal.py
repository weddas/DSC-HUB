import sqlite3, time
from pathlib import Path
p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\dsc_brain.sqlite3")
j = Path(str(p) + "-journal")
print("journal_before", j.exists(), flush=True)
t0 = time.time()
c = sqlite3.connect(str(p), timeout=120)
print("connected", round(time.time()-t0,2), flush=True)
c.execute("PRAGMA busy_timeout=120000")
# touch schema only - force journal recovery without long scan
c.execute("SELECT 1")
print("select1", round(time.time()-t0,2), flush=True)
c.close()
print("journal_after", j.exists(), "elapsed", round(time.time()-t0,2), flush=True)
