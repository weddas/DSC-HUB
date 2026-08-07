import json, sys, time, traceback
from pathlib import Path
sys.path.insert(0, "brain")
from dsc_brain.paths import DEFAULT_DB, STAGING_DIR
from dsc_brain.corpus import connect, corpus_stats, init_corpus
from dsc_brain.staging import list_staging_dbs

log = Path("brain/data/_cc_merge_direct.log")

def L(msg):
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    with log.open("a", encoding="utf-8") as f:
        f.write(line + "\n")

log.write_text("", encoding="utf-8")
L("boot")
try:
    L(f"DEFAULT_DB={DEFAULT_DB}")
    L("init_corpus...")
    init_corpus(DEFAULT_DB)
    L("init_corpus done")
    L("connect...")
    master = connect(DEFAULT_DB)
    L("connected")
    master.execute("PRAGMA busy_timeout=120000")
    before = corpus_stats(master)
    L(f"before={before}")
    dbs = [p for p in list_staging_dbs(STAGING_DIR) if "cannaconnection" in p.name.lower()]
    L(f"dbs={dbs}")
    master.close()
    L("probe ok")
except Exception:
    L("FAIL")
    with log.open("a", encoding="utf-8") as f:
        f.write(traceback.format_exc())
    traceback.print_exc()
    sys.exit(2)
