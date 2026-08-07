import sqlite3, os, time
from pathlib import Path
p = Path("brain/data/dsc_brain.sqlite3")
j = Path("brain/data/dsc_brain.sqlite3-journal")
print("journal_before", j.exists(), j.stat().st_size if j.exists() else 0)
# open with long timeout — sqlite will rollback hot journal if no other connection
for i in range(10):
    try:
        c = sqlite3.connect(str(p), timeout=60, isolation_level="EXCLUSIVE")
        c.execute("PRAGMA busy_timeout=60000")
        c.execute("BEGIN EXCLUSIVE")
        n = c.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0]
        c.execute("COMMIT")
        print("EXCLUSIVE_OK canonical", n)
        for t in ["strain_variant","chemistry_profile","grow_trait","entity_link","source_record","search_docs"]:
            print(t, c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0])
        c.close()
        break
    except Exception as e:
        print(f"fail {i}: {e}")
        time.sleep(5)
print("journal_after", j.exists(), j.stat().st_size if j.exists() else 0)
