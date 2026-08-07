import sys, time
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT/"scripts"))
hb = ROOT/"brain/data/_alc_import_hb.txt"
def w(m):
    line=f"{time.strftime('%H:%M:%S')} {m}\n"
    print(line,end="",flush=True)
    hb.open("a",encoding="utf-8").write(line)
hb.write_text("",encoding="utf-8")
w("start")
w("importing merge_staging_to_master")
import merge_staging_to_master
w("imported ok")
w("done")
