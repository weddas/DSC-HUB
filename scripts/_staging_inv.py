import sqlite3
from pathlib import Path
st = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging")
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
