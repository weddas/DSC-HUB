import json, time, subprocess
from datetime import datetime
from pathlib import Path
DATA = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB\homeassistant\data")
RESULT = DATA / "_pw_strain_db_final.txt"
CK = DATA / "dsc_strains_straindatabase.checkpoint.json"
HIST = DATA / "_pw_strain_db_watch_hist.txt"
OUT = DATA / "dsc_strains_straindatabase.json"

def n():
    d=json.loads(CK.read_text(encoding="utf-8"))
    return int(d.get("done_count", len(d.get("done") or [])))

def procs():
    ps = (
      "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | "
      "Where-Object { $_.CommandLine -match '_pw_scrape_strain_database|_straindb_shepherd' } | "
      "ForEach-Object { if ($_.CommandLine -match '_pw_scrape_strain_database') {'S:'+$_.ProcessId} else {'H:'+$_.ProcessId} }"
    )
    r=subprocess.run(["powershell","-NoProfile","-Command",ps],capture_output=True,text=True,timeout=90)
    return " ".join((r.stdout or "").split())

last=None
while not RESULT.exists():
    nn=n(); p=procs(); jb=OUT.stat().st_size if OUT.exists() else 0
    line=f"{datetime.now().isoformat()} n={nn} json={jb} procs={p}"
    if nn!=last:
        with HIST.open("a",encoding="utf-8") as f: f.write(line+"\n")
        last=nn
    (DATA/"_pw_strain_db_watch.txt").write_text(line+"\n",encoding="utf-8")
    # ensure processes
    if "S:" not in p:
        # shepherd should restart; give it a moment
        time.sleep(60)
        p2=procs()
        if "S:" not in p2 and "H:" not in p2:
            # emergency restart both
            subprocess.Popen(
                ["C:\\Program Files\\Python314\\python.exe","-u",str(Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")/"_straindb_shepherd.py")],
                cwd=r"y:\Digital Stealth Care\Projects\DSC-HUB",
                creationflags=0x08000000|0x00000008|0x00000200,
                close_fds=True,
            )
    time.sleep(240)
print("RESULT_READY")
print(RESULT.read_text(encoding="utf-8"))
