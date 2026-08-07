import sqlite3, sys
from pathlib import Path
db = Path(r"brain/data/dsc_brain.sqlite3")
try:
    c = sqlite3.connect(str(db), timeout=2)
    c.execute("BEGIN IMMEDIATE")
    c.rollback()
    c.close()
    print("FREE")
    sys.exit(0)
except Exception as e:
    print("BUSY", type(e).__name__, e)
    sys.exit(2)
