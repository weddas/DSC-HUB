import sqlite3, time, sys
from pathlib import Path

p = Path("brain/data/dsc_brain.sqlite3").resolve()
# Wait until we can get a write lock briefly, then release (probe only)
deadline = time.time() + 600  # 10 min probe loop max for this run
attempt = 0
while time.time() < deadline:
    attempt += 1
    t0 = time.time()
    try:
        c = sqlite3.connect(str(p), timeout=5)
        c.execute("PRAGMA busy_timeout=5000")
        c.execute("BEGIN IMMEDIATE")
        c.execute("SELECT 1")
        c.rollback()
        c.close()
        print(f"UNLOCKED attempt={attempt} waited={round(time.time()-t0,2)}s", flush=True)
        sys.exit(0)
    except Exception as e:
        print(f"locked attempt={attempt} {type(e).__name__}: {e} ({round(time.time()-t0,2)}s)", flush=True)
        time.sleep(15)

print("STILL_LOCKED", flush=True)
sys.exit(2)
