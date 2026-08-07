import sys, time, traceback, json, sqlite3
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT/"scripts"))
LOG = ROOT/"brain/data/_cr_durable.txt"
OUT = ROOT/"brain/data/_cr_merge_result.json"
STAGING = ROOT/"brain/data/staging/cannareviews.sqlite3"
MASTER = ROOT/"brain/data/dsc_brain.sqlite3"

def w(m):
    line = f"{time.strftime('%H:%M:%S')} {m}"
    print(line, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line+"\n"); f.flush()

LOG.write_text("", encoding="utf-8")
w("durable cannareviews merge start")

def journal():
    j = MASTER.with_name(MASTER.name + "-journal")
    return j.exists() and j.stat().st_size > 0

for attempt in range(1, 120):
    try:
        if journal():
            w(f"a{attempt} journal present sleep 25")
            time.sleep(25)
            continue
        # other known merge holders?
        w(f"a{attempt} try open")
        from brain.dsc_brain.corpus import connect, init_corpus, link_science_to_seed, rebuild_search_docs
        from merge_staging_to_master import merge_one
        # prefer raw open with long timeout then init
        try:
            init_corpus(MASTER)
        except sqlite3.OperationalError as e:
            if "locked" in str(e).lower():
                w(f"a{attempt} init locked: {e}"); time.sleep(25); continue
            raise
        m = connect(MASTER, timeout=300.0)
        m.execute("PRAGMA busy_timeout=600000")
        try:
            m.execute("BEGIN IMMEDIATE")
            m.execute("COMMIT")
        except sqlite3.OperationalError as e:
            w(f"a{attempt} begin locked: {e}")
            try: m.close()
            except Exception: pass
            time.sleep(25)
            continue
        w(f"a{attempt} merge_one")
        st = merge_one(m, STAGING, include_raw=False)
        m.commit()
        w(f"a{attempt} merge ok {st.get('counts')}")
        # verify
        src = sqlite3.connect(str(STAGING)); src.row_factory = sqlite3.Row
        sids = [r[0] for r in src.execute("SELECT id FROM source_record")]
        by = {}
        for sid in sids:
            by[sid] = {
                "source": list(m.execute("SELECT id,name FROM source_record WHERE id=?", (sid,)).fetchone() or []),
                "variant": m.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (sid,)).fetchone()[0],
                "chem": m.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (sid,)).fetchone()[0],
                "grow": m.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id=?", (sid,)).fetchone()[0],
                "links": m.execute("SELECT COUNT(*) FROM entity_link WHERE source_id=?", (sid,)).fetchone()[0],
            }
        src.close()
        links = {}
        docs = None
        try:
            w("link_science_to_seed")
            links = link_science_to_seed(m)
            m.commit()
            w(f"links={links}")
        except Exception as e:
            w(f"link skip/fail: {e}")
            try: m.rollback()
            except Exception: pass
        try:
            w("rebuild_search_docs")
            docs = rebuild_search_docs(m)
            m.commit()
            w(f"search_docs={docs}")
        except Exception as e:
            w(f"search skip/fail: {e}")
            try: m.rollback()
            except Exception: pass
        m.close()
        out = {
            "family": "cannareviews",
            "merged": [st],
            "by_source": by,
            "links": links,
            "search_docs": docs,
            "attempt": attempt,
            "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "note": "full review text still pending medauth; not blocking",
        }
        OUT.write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
        (ROOT/"brain/data/_cr_merge_out.txt").write_text(json.dumps(out, indent=2, default=str), encoding="utf-8")
        w("SUCCESS")
        sys.exit(0)
    except Exception as e:
        w(f"a{attempt} EXC {type(e).__name__}: {e}")
        if "locked" in str(e).lower() or "busy" in str(e).lower():
            time.sleep(25); continue
        w(traceback.format_exc())
        time.sleep(25); continue
w("exhausted")
sys.exit(1)
