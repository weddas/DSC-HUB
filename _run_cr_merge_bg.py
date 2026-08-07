import sys, time, traceback, faulthandler
from pathlib import Path
faulthandler.enable()
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
err = open(ROOT / "brain" / "data" / "_cr_merge_stderr.txt", "w", encoding="utf-8", buffering=1)
sys.stderr = err
logp = ROOT / "brain" / "data" / "_cr_merge_live.txt"

def w(msg):
    line = f"{time.strftime('%H:%M:%S')} {msg}\n"
    with logp.open("a", encoding="utf-8") as f:
        f.write(line); f.flush()
    print(line, end="", flush=True)

logp.write_text("", encoding="utf-8")
w("pid=%s start" % (__import__("os").getpid()))
try:
    while (ROOT / "brain" / "data" / "dsc_brain.sqlite3-journal").exists():
        w("wait journal")
        time.sleep(15)
    w("import main")
    from scripts.merge_staging_to_master import main
    w("run main")
    rc = main(["--only", "cannareviews"])
    w("rc=%s" % rc)
    open(ROOT / "brain" / "data" / "_cr_merge_rc.txt", "w").write(str(rc))
except BaseException:
    w(traceback.format_exc())
    raise
