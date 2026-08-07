import sqlite3, json, time
from pathlib import Path
p = Path("brain/data/dsc_brain.sqlite3")
for i in range(15):
    try:
        c = sqlite3.connect(str(p), timeout=30)
        c.execute("PRAGMA busy_timeout=30000")
        tables = ["strain_canonical","strain_variant","chemistry_profile","grow_trait","entity_link","source_record","search_docs"]
        out = {t: c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0] for t in tables}
        print("AFTER", json.dumps(out))
        # sample sources
        rows = c.execute("SELECT source_id, COUNT(*) c FROM chemistry_profile GROUP BY 1 ORDER BY c DESC LIMIT 25").fetchall()
        print("TOP_CHEM_SOURCES")
        for r in rows: print(f"  {r[0]}: {r[1]}")
        c.close(); break
    except Exception as e:
        print(f"wait {i}: {e}"); time.sleep(10)
else:
    print("STATS_FAIL")
