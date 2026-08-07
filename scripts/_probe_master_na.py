import sqlite3, time, traceback
from pathlib import Path

p = Path("brain/data/dsc_brain.sqlite3")
print("master", p, "exists", p.exists(), "size", p.stat().st_size if p.exists() else None, flush=True)
for i in range(3):
    print(f"probe {i}", flush=True)
    try:
        t0 = time.time()
        con = sqlite3.connect(str(p), timeout=8)
        con.execute("PRAGMA busy_timeout=8000")
        n = con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0]
        print(f"canonical={n} elapsed={time.time()-t0:.2f}s", flush=True)
        # find north atlantic in source_record / meta-ish
        info = con.execute("PRAGMA table_info(source_record)").fetchall()
        print("source_record cols", [c[1] for c in info], flush=True)
        rows = con.execute("SELECT * FROM source_record").fetchall()
        print("source_record count", len(rows), flush=True)
        for r in rows:
            s = str(r).lower()
            if "north" in s or "atlantic" in s:
                print("HIT", r, flush=True)
        con.close()
        print("PROBE_OK", flush=True)
        break
    except Exception as e:
        print("PROBE_FAIL", e, flush=True)
        traceback.print_exc()
        time.sleep(2)
