import sqlite3, json, sys
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
DB = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
conn = sqlite3.connect(str(DB), timeout=60)
conn.row_factory = sqlite3.Row
conn.execute("PRAGMA busy_timeout=60000")
from brain.dsc_brain.corpus import corpus_stats
print("=== BEFORE ===")
print(json.dumps(corpus_stats(conn), indent=2))
print("--- variants by source (top) ---")
for r in conn.execute("SELECT source_id, COUNT(*) c FROM strain_variant GROUP BY 1 ORDER BY c DESC LIMIT 40"):
    print(f"{r['source_id']}: {r['c']}")
conn.close()
print("=== STAGING raw/variant counts ===")
st = ROOT / "brain" / "data" / "staging"
for name in ["allbud","seedcity","kushy_crosses_local","cannabis_intelligence","phytochem_smith","phytochem_lab","leafly_flat_enrich","leafly_flat","replication_labs","north_atlantic","north_atlantic_local","medical_effects","cannia","pickle_archive","strains_master","cannaconnection","seedfinder","cannlytics_expand","seedsman"]:
    p = st / f"{name}.sqlite3"
    j = st / f"{name}.sqlite3-journal"
    if j.exists() and j.stat().st_size > 0:
        print(f"{name}: SKIP journal lock ({j.stat().st_size} bytes)")
        continue
    if not p.exists():
        print(f"{name}: MISSING")
        continue
    try:
        c = sqlite3.connect(f"file:{p.as_posix()}?mode=ro", uri=True, timeout=10)
        tables = {r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        raw = c.execute("SELECT COUNT(*) FROM raw_record").fetchone()[0] if "raw_record" in tables else -1
        var = c.execute("SELECT COUNT(*) FROM strain_variant").fetchone()[0] if "strain_variant" in tables else -1
        can = c.execute("SELECT COUNT(*) FROM strain_canonical").fetchone()[0] if "strain_canonical" in tables else -1
        print(f"{name}: canonical={can} variants={var} raw={raw} sizeMB={p.stat().st_size/1024/1024:.1f}")
        c.close()
    except Exception as e:
        print(f"{name}: ERR {e}")
