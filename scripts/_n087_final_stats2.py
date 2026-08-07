import sqlite3, json
from pathlib import Path
c = sqlite3.connect(r"brain/data/dsc_brain.sqlite3", timeout=60)
c.execute("PRAGMA busy_timeout=60000")
out = {}
for t in ["strain_canonical","strain_variant","chemistry_profile","grow_trait","entity_link","source_record","search_docs"]:
    out[t] = c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
print("FINAL", json.dumps(out, indent=2))
print("TOP_CHEM")
for r in c.execute("SELECT source_id, COUNT(*) c FROM chemistry_profile GROUP BY 1 ORDER BY c DESC LIMIT 20"):
    print(f"  {r[0]}: {r[1]}")
print("TOP_VARIANT")
for r in c.execute("SELECT source_id, COUNT(*) c FROM strain_variant GROUP BY 1 ORDER BY c DESC LIMIT 20"):
    print(f"  {r[0]}: {r[1]}")
c.close()
Path("scripts/_n087_final_stats_out.txt").write_text(json.dumps(out, indent=2), encoding="utf-8")
