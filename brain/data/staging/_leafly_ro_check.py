import sqlite3, time
from pathlib import Path
p = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\dsc_brain.sqlite3")
j = Path(str(p)+"-journal")
print("journal", j.exists(), flush=True)
t0=time.time()
try:
    c=sqlite3.connect(f"file:{p.as_posix()}?mode=ro", uri=True, timeout=30)
    c.execute("PRAGMA busy_timeout=30000")
    print("ro_connected", round(time.time()-t0,2), flush=True)
    n=c.execute("SELECT COUNT(1) FROM chemistry_profile WHERE source_id=?", ("leafly_flat_enrich",)).fetchone()[0]
    print("leafly_chem", n, "elapsed", round(time.time()-t0,2), flush=True)
    # also check source_record
    try:
        s=c.execute("SELECT id,name FROM source_record WHERE id=?", ("leafly_flat_enrich",)).fetchone()
        print("source_record", s, flush=True)
    except Exception as e:
        print("source_err", e, flush=True)
    c.close()
except Exception as e:
    print("ERR", type(e).__name__, e, "after", round(time.time()-t0,2), flush=True)
