import sqlite3
from pathlib import Path
p = Path("brain/data/dsc_brain.sqlite3")
print("journal", Path(str(p)+"-journal").exists(), "size", p.stat().st_size)
con = sqlite3.connect(str(p), timeout=30)
con.execute("PRAGMA busy_timeout=30000")
try:
    print("northatlantic variants", con.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id='northatlantic'").fetchone()[0])
    print("northatlantic grow", con.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id='northatlantic'").fetchone()[0])
    print("source hit", con.execute("SELECT id,name FROM source_record WHERE id LIKE '%north%' OR id LIKE '%atlantic%'").fetchall())
    print("canonical total", con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0])
except Exception as e:
    print("ERR", e)
con.close()
s = sqlite3.connect("brain/data/staging/north_atlantic.sqlite3")
print("staging NA", s.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0])
s.close()
sl = sqlite3.connect("brain/data/staging/north_atlantic_local.sqlite3")
print("staging NA local", sl.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0])
sl.close()
