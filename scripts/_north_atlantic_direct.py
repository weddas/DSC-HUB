import sys, time, traceback
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT/"scripts"))
LOG = ROOT/"brain"/"data"/"_na_direct_merge.log"

def log(m):
    line=f"{time.strftime('%H:%M:%S')} {m}\n"
    print(line,end="",flush=True)
    with LOG.open("a",encoding="utf-8") as f: f.write(line)

LOG.write_text("",encoding="utf-8")
log("START direct NA merge")
from merge_staging_to_master import main
for only in ["north_atlantic.sqlite3", "north_atlantic_local.sqlite3"]:
    path = ROOT/"brain"/"data"/"staging"/only
    if not path.exists():
        log(f"skip missing {only}"); continue
    for attempt in range(1,11):
        log(f"attempt {attempt}/10 {only}")
        try:
            rc = main(["--only", only, "--no-search", "--no-link"])
            log(f"rc={rc}")
            if rc == 0:
                log(f"MERGE_OK {only}")
                break
        except Exception as e:
            log(f"exc {e}")
            traceback.print_exc()
        time.sleep(15)
    else:
        log(f"FAILED {only}")
        raise SystemExit(1)
log("DONE")
