import re, time, subprocess
from pathlib import Path

p = Path("scripts/_n087_apply_staging_out.txt")
out = Path("brain/data/_na_apply_watch.txt")
stdout = Path("brain/data/_na_apply_watch_stdout.txt")

def read_text(path: Path) -> str:
    raw = path.read_bytes() if path.exists() else b""
    if not raw:
        return ""
    if raw.startswith(b"\xff\xfe") or (len(raw) > 3 and raw[1] == 0 and raw[3] == 0):
        return raw.decode("utf-16-le", errors="replace")
    if raw.startswith(b"\xfe\xff"):
        return raw.decode("utf-16-be", errors="replace")
    return raw.decode("utf-8", errors="replace")

def log(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    print(line, flush=True)
    with stdout.open("a", encoding="utf-8") as f:
        f.write(line + "\n")
    out.write_text(line + "\n", encoding="utf-8")

stdout.write_text("", encoding="utf-8")
log("watch start utf16-aware")
while True:
    t = read_text(p)
    if re.search(r"OK north_atlantic\b", t) or re.search(r"OK north_atlantic ", t):
        out.write_text("NA_OK\n" + t[-4000:], encoding="utf-8")
        log("NA_OK")
        break
    if re.search(r"^MERGED\b", t, re.M) or "\nMERGED " in t or t.strip().startswith("MERGED"):
        # also match MERGED at end
        if "MERGED" in t and ("SKIPPED" in t or "FAILED" in t):
            out.write_text("APPLY_DONE\n" + t[-4500:], encoding="utf-8")
            log("APPLY_DONE")
            break
    try:
        r = subprocess.check_output(
            [
                "powershell",
                "-NoProfile",
                "-Command",
                "@(Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | Where-Object { $_.CommandLine -match '_n087_apply_staging\\.py' }).Count",
            ],
            text=True,
            timeout=30,
        ).strip()
    except Exception as e:
        r = f"err"
    # last non-empty lines
    lines = [ln for ln in t.splitlines() if ln.strip()]
    tail = " || ".join(lines[-3:])
    log(f"alive={r} | {tail}")
    if r == "0":
        time.sleep(8)
        t2 = read_text(p)
        out.write_text("APPLY_GONE\n" + t2[-4500:], encoding="utf-8")
        log("APPLY_GONE")
        break
    time.sleep(45)
