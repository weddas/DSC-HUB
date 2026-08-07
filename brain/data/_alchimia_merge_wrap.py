import sys, traceback, time
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
log = ROOT / "brain" / "data" / "_alchimia_merge_live.txt"
def w(msg):
    with log.open("a", encoding="utf-8") as f:
        f.write(msg + "\n")
        f.flush()
    print(msg, flush=True)
log.write_text(f"wrapper start {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}\n", encoding="utf-8")
try:
    w("importing main...")
    # run script main
    import runpy
    sys.argv = ["merge_staging_to_master.py", "--only", "alchimia"]
    runpy.run_path(str(ROOT / "scripts" / "merge_staging_to_master.py"), run_name="__main__")
    w("finished ok")
except SystemExit as e:
    w(f"SystemExit {e.code}")
except Exception:
    w(traceback.format_exc())
