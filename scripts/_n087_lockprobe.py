import sqlite3, time
from pathlib import Path
p = Path("brain/data/dsc_brain.sqlite3")
print("size", p.stat().st_size)
for i in range(10):
    try:
        c = sqlite3.connect(str(p), timeout=30)
        c.execute("PRAGMA busy_timeout=30000")
        c.execute("BEGIN IMMEDIATE")
        c.execute("COMMIT")
        print("UNLOCKED", i)
        n = c.execute("select count(*) from strain_canonical").fetchone()[0]
        print("canonical", n)
        c.close()
        break
    except Exception as e:
        print(f"busy {i}: {e}")
        time.sleep(5)
else:
    print("STILL_LOCKED")
