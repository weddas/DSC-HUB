import sqlite3, time, sys
from pathlib import Path
sys.path.insert(0, ".")
from brain.dsc_brain.paths import DEFAULT_DB
print("DB", DEFAULT_DB)
for i in range(5):
    try:
        c = sqlite3.connect(str(DEFAULT_DB), timeout=5)
        c.execute("PRAGMA busy_timeout=5000")
        tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1")]
        print("BEFORE_STATS")
        for t in tables:
            try:
                n = c.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
                print(f"  {t}: {n}")
            except Exception as e:
                print(f"  {t}: ERR {e}")
        c.close()
        break
    except Exception as e:
        print(f"attempt {i}: {e}")
        time.sleep(2)
else:
    print("BEFORE_STATS_UNAVAILABLE locked")
print("---JOURNALS---")
for p in Path("brain/data/staging").glob("*journal*"):
    print(p.name)
for p in Path("brain/data/staging").glob("*-wal"):
    print(p.name)
