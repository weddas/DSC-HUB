import sys, time, traceback, json, sqlite3
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT/"scripts"))
log = ROOT/"brain/data/_cr_lean.txt"
def w(m):
    with log.open("a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {m}\n"); f.flush()
log.write_text("", encoding="utf-8")
w("lean start pid=%s" % __import__("os").getpid())
try:
    while (ROOT/"brain/data/dsc_brain.sqlite3-journal").exists():
        w("wait journal"); time.sleep(10)
    w("imports")
    from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR
    from brain.dsc_brain.corpus import connect, init_corpus
    from merge_staging_to_master import merge_one
    staging = ROOT/"brain/data/staging/cannareviews.sqlite3"
    w(f"master={DEFAULT_DB} staging={staging} size={staging.stat().st_size}")
    w("init_corpus")
    init_corpus(DEFAULT_DB)
    w("connect")
    master = connect(DEFAULT_DB, timeout=120.0)
    master.execute("PRAGMA busy_timeout=300000")
    w("BEGIN IMMEDIATE smoke")
    master.execute("BEGIN IMMEDIATE")
    master.execute("COMMIT")
    w("merge_one begin")
    st = merge_one(master, staging, include_raw=False)
    w(f"merge_one done {st}")
    master.commit()
    w("committed")
    # quick verify counts by source
    src = sqlite3.connect(str(staging)); src.row_factory=sqlite3.Row
    sids = [r[0] for r in src.execute("SELECT id FROM source_record").fetchall()]
    w(f"staging source_ids={sids}")
    counts = {}
    for sid in sids:
        counts[sid] = {
            "variant": master.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (sid,)).fetchone()[0],
            "chem": master.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (sid,)).fetchone()[0],
            "grow": master.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id=?", (sid,)).fetchone()[0],
            "links": master.execute("SELECT COUNT(*) FROM entity_link WHERE source_id=?", (sid,)).fetchone()[0],
            "source": master.execute("SELECT id,name FROM source_record WHERE id=?", (sid,)).fetchone(),
        }
    out = {"merge_one": st, "by_source": counts, "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    (ROOT/"brain/data/_cr_merge_result.json").write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
    master.close(); src.close()
    w("SUCCESS lean")
except BaseException:
    w(traceback.format_exc()); raise
