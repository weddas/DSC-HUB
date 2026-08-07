import sys, time, sqlite3, traceback
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
LOG = ROOT / "brain" / "data" / "_alchimia_merge_live.txt"

def w(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")
        f.flush()
    print(line, flush=True)

LOG.write_text("", encoding="utf-8")
w("waiter start; polling master unlock")
attempt = 0
while True:
    attempt += 1
    try:
        c = sqlite3.connect(str(MASTER), timeout=5)
        c.execute("BEGIN IMMEDIATE")
        c.rollback()
        c.close()
        w(f"master unlocked after {attempt} polls")
        break
    except sqlite3.OperationalError as e:
        if attempt == 1 or attempt % 12 == 0:
            w(f"still locked ({attempt}): {e}")
        time.sleep(5)
    except Exception as e:
        w(f"probe error: {type(e).__name__}: {e}")
        time.sleep(5)

w("launching merge --only alchimia")
try:
    import runpy
    sys.argv = ["merge_staging_to_master.py", "--only", "alchimia"]
    runpy.run_path(str(ROOT / "scripts" / "merge_staging_to_master.py"), run_name="__main__")
    w("merge finished ok")
except SystemExit as e:
    w(f"SystemExit {e.code}")
except Exception:
    w(traceback.format_exc())
