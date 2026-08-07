import sys, traceback, time, json, subprocess
from pathlib import Path
log = Path("brain/data/_cr_merge_live.txt")
def w(msg):
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    with log.open("a", encoding="utf-8") as f:
        f.write(line + "\n"); f.flush()
    print(line, flush=True)

log.write_text("", encoding="utf-8")
w("invoke official merge script via subprocess")
# Retry loop for locked
for attempt in range(1, 8):
    w(f"attempt {attempt}")
    p = subprocess.Popen(
        [sys.executable, "-u", "scripts/merge_staging_to_master.py", "--only", "cannareviews"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        cwd=str(Path(".").resolve()),
        bufsize=1,
    )
    out_lines = []
    assert p.stdout is not None
    for line in p.stdout:
        out_lines.append(line.rstrip("\n"))
        w("OUT " + line.rstrip("\n"))
    rc = p.wait()
    w(f"rc={rc}")
    text = "\n".join(out_lines)
    Path("brain/data/_cr_merge_out.txt").write_text(text + f"\n\nEXIT={rc}\n", encoding="utf-8")
    if rc == 0 and "FAIL" not in text and "database is locked" not in text.lower():
        w("SUCCESS")
        break
    if "locked" in text.lower() or "busy" in text.lower() or rc != 0:
        w("retry sleep 20s")
        time.sleep(20)
        continue
    break
else:
    w("exhausted retries")
    sys.exit(1)
