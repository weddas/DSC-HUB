import time
from pathlib import Path
from datetime import datetime
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "homeassistant" / "data"
RESULT = DATA / "_pw_strain_db_final.txt"
STATUS = DATA / "_pw_strain_db_watch.txt"
CK = DATA / "dsc_strains_straindatabase.checkpoint.json"
import json, subprocess

def n():
    d=json.loads(CK.read_text(encoding="utf-8"))
    return int(d.get("done_count", len(d.get("done") or [])))

def alive():
    ps = "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | Where-Object { $_.CommandLine -match '_pw_scrape_strain_database' } | Measure-Object | Select-Object -ExpandProperty Count"
    r=subprocess.run(["powershell","-NoProfile","-Command",ps],capture_output=True,text=True,timeout=60)
    try: return int((r.stdout or "0").strip() or 0)>0
    except: return False

while True:
    nn=n(); a=alive(); line=f"{datetime.now().isoformat()} n={nn} scrape_alive={a} final={RESULT.exists()}"
    STATUS.write_text(line+"\n", encoding="utf-8")
    with (DATA/"_pw_strain_db_watch_hist.txt").open("a",encoding="utf-8") as f: f.write(line+"\n")
    if RESULT.exists():
        break
    time.sleep(300)
