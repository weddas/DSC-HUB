import sys, time, json
from pathlib import Path
ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
log = ROOT / "brain" / "data" / "_cr_wait_n087.txt"
def w(m):
    with log.open("a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {m}\n"); f.flush()
log.write_text("", encoding="utf-8")
w("watch start")
# Wait for _n087_apply_staging to exit, then ensure cannareviews merged
import subprocess, os
while True:
    # is apply running?
    out = subprocess.check_output(["powershell","-NoProfile","-Command",
        "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | Where-Object { $_.CommandLine -match '_n087_apply_staging' } | Select-Object -ExpandProperty ProcessId"],
        text=True, stderr=subprocess.DEVNULL)
    pids = [x.strip() for x in out.splitlines() if x.strip()]
    j = (ROOT/"brain/data/dsc_brain.sqlite3-journal").exists()
    w(f"n087_pids={pids} journal={j}")
    if not pids and not j:
        w("n087 gone + no journal")
        break
    time.sleep(30)

# Check if cannareviews already in merge result
res_path = ROOT/"scripts"/"_n087_merge_result.json"
if res_path.exists():
    try:
        res = json.loads(res_path.read_text(encoding="utf-8"))
        w(f"n087 result merged includes cannareviews={('cannareviews' in (res.get('merged') or []))}")
        w(f"merged={res.get('merged')}")
        w(f"failed={res.get('failed')}")
        w(f"skipped={res.get('skipped')}")
        if "cannareviews" in (res.get("merged") or []):
            # still run official command for search rebuild / confirm, or verify counts
            w("already merged by n087; verifying via official --only cannareviews")
    except Exception as e:
        w(f"result parse {e}")

# Now run official merge (idempotent typed merge)
w("running official merge --only cannareviews")
# retry loop
for attempt in range(1, 25):
    j = (ROOT/"brain/data/dsc_brain.sqlite3-journal").exists()
    if j:
        w(f"attempt {attempt} journal, sleep")
        time.sleep(20)
        continue
    p = subprocess.run(
        [sys.executable, "-u", str(ROOT/"scripts"/"merge_staging_to_master.py"), "--only", "cannareviews"],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    (ROOT/"brain/data/_cr_merge_out.txt").write_text((p.stdout or "") + "\n---STDERR---\n" + (p.stderr or "") + f"\nEXIT={p.returncode}\n", encoding="utf-8")
    w(f"attempt {attempt} rc={p.returncode} out_len={len(p.stdout or '')}")
    if p.stdout:
        for line in p.stdout.splitlines()[:30]:
            w("OUT "+line)
    if p.stderr:
        for line in p.stderr.splitlines()[:30]:
            w("ERR "+line)
    text = (p.stdout or "") + (p.stderr or "")
    if p.returncode == 0 and "database is locked" not in text.lower() and "FAIL cannareviews" not in text:
        # extract json
        idx = text.find('{\n  "merged"')
        if idx < 0:
            idx = text.find('{"merged"')
        if idx >= 0:
            (ROOT/"brain/data/_cr_merge_result.json").write_text(text[idx:], encoding="utf-8")
        w("SUCCESS")
        sys.exit(0)
    time.sleep(20)
w("FAILED exhausted")
sys.exit(1)
