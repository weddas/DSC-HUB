import sqlite3
from pathlib import Path
p = Path("brain/data/dsc_brain.sqlite3")
print("journal", Path(str(p)+"-journal").exists(), "size", p.stat().st_size)
con = sqlite3.connect(str(p), timeout=60)
con.execute("PRAGMA busy_timeout=60000")
# source_record schema
cols = [c[1] for c in con.execute("PRAGMA table_info(source_record)").fetchall()]
print("source_record cols", cols)
rows = con.execute("SELECT * FROM source_record").fetchall()
print("sources", len(rows))
for r in rows:
    s = " ".join(str(x) for x in r).lower()
    if "north" in s or "atlantic" in s:
        print("SOURCE_HIT", r)
# try variants by source
# discover fk-ish
try:
    q = con.execute("SELECT source_id, COUNT(*) FROM strain_variant GROUP BY source_id HAVING source_id LIKE '%north%' OR source_id LIKE '%atlantic%'").fetchall()
    print("variant by source", q)
except Exception as e:
    print("variant query err", e)
    # dump distinct source_ids sample
    try:
        ids = con.execute("SELECT DISTINCT source_id FROM strain_variant LIMIT 50").fetchall()
        print("sample source_ids", ids[:50])
    except Exception as e2:
        print(e2)
# attribute / meta
try:
    m = con.execute("SELECT key, value FROM meta WHERE key LIKE '%north%' OR value LIKE '%north%' OR value LIKE '%atlantic%'").fetchall()
    print("meta", m)
except Exception as e:
    print("meta err", e)
print("canonical", con.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0])
con.close()
print("PROBE_DONE")
