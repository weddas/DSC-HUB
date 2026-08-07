"""StrainDB-only shepherd until complete or hard CF-block. Stages on finish. No master merge."""
from __future__ import annotations
import json, subprocess, sys, time
from datetime import datetime
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
DATA = ROOT / "homeassistant" / "data"
PIDFILE = DATA / "_pw_strain_db_scrape.pid"
LOG = DATA / "_pw_strain_db_shepherd.log"
RESULT = DATA / "_pw_strain_db_final.txt"
CK = DATA / "dsc_strains_straindatabase.checkpoint.json"
OUT = DATA / "dsc_strains_straindatabase.json"
SCRIPT = ROOT / "scripts" / "_pw_scrape_strain_database.py"
PY = sys.executable
ARGS = [PY, "-u", str(SCRIPT), "--headed", "--delay-min=8", "--delay-max=20"]
sys.path.insert(0, str(ROOT / "scripts"))

def log(msg: str) -> None:
    line = f"{datetime.now().isoformat()} {msg}"
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n"); f.flush()
    print(line, flush=True)

def ck() -> dict:
    if not CK.exists():
        return {}
    return json.loads(CK.read_text(encoding="utf-8"))

def ck_n() -> int:
    d = ck()
    return int(d.get("done_count", len(d.get("done") or [])))

def list_sdb() -> list[int]:
    ps = (
        "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | "
        "Where-Object { $_.CommandLine -match '_pw_scrape_strain_database' } | "
        "ForEach-Object { $_.ProcessId }"
    )
    r = subprocess.run(["powershell","-NoProfile","-Command",ps], capture_output=True, text=True, timeout=90)
    return [int(x) for x in (r.stdout or "").split() if x.isdigit()]

def scrape_log() -> Path | None:
    if PIDFILE.exists():
        lines = PIDFILE.read_text(encoding="utf-8").splitlines()
        if len(lines) >= 2 and Path(lines[1].strip()).exists():
            return Path(lines[1].strip())
    cands = sorted(DATA.glob("_pw_strain_db_scrape_*.log"), key=lambda p: p.stat().st_mtime, reverse=True)
    return cands[0] if cands else None

def tail_text(p: Path | None, n: int = 16000) -> str:
    if not p or not p.exists():
        return ""
    try:
        return p.read_text(encoding="utf-8", errors="replace")[-n:]
    except OSError:
        return ""

def offscreen() -> int:
    ps = r'''
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W {
  public delegate bool Cb(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(Cb f, IntPtr l);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int ht, bool r);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
}
"@
$roots = Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -match '_pw_scrape_strain_database' }
$pids = New-Object 'System.Collections.Generic.HashSet[int]'
foreach ($r in $roots) { [void]$pids.Add([int]$r.ProcessId); Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $r.ProcessId } | ForEach-Object { [void]$pids.Add([int]$_.ProcessId) } }
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'dsc-pw-chromium-sdb' } | ForEach-Object { [void]$pids.Add([int]$_.ProcessId) }
$script:n=0
$cb=[W+Cb]{ param($h,$l) $p=0; [void][W]::GetWindowThreadProcessId($h,[ref]$p); if ($pids.Contains([int]$p) -and [W]::IsWindowVisible($h)) { [void][W]::ShowWindow($h,6); [void][W]::MoveWindow($h,-2400,-200,1100,800,$true); $script:n++ }; $true }
[void][W]::EnumWindows($cb,[IntPtr]::Zero); Write-Output $script:n
'''
    r = subprocess.run(["powershell","-NoProfile","-Command",ps], capture_output=True, text=True, timeout=90)
    try:
        return int((r.stdout or "0").strip().splitlines()[-1])
    except Exception:
        return 0

def start_scrape() -> int:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = DATA / f"_pw_strain_db_scrape_{stamp}.log"
    err = DATA / f"_pw_strain_db_scrape_{stamp}.err"
    flags = 0x08000000 | 0x00000008 | 0x00000200
    with out.open("a", encoding="utf-8") as o, err.open("a", encoding="utf-8") as e:
        o.write(f"\n=== shepherd relaunch {datetime.now().isoformat()} ===\n")
        o.flush()
        proc = subprocess.Popen(ARGS, cwd=str(ROOT), stdout=o, stderr=e, creationflags=flags, close_fds=True)
    PIDFILE.write_text(f"{proc.pid}\n{out}\n", encoding="utf-8")
    log(f"started scrape pid={proc.pid} log={out.name}")
    return proc.pid

def stage_now() -> dict:
    from scrape_strain_database import stage_dump
    st = stage_dump(reset=True)
    log(f"staged {st}")
    return st if isinstance(st, dict) else {"raw": st}

def finish(reason: str) -> int:
    d = ck()
    n = int(d.get("done_count", len(d.get("done") or [])))
    items = 0
    if OUT.exists():
        try:
            items = len(json.loads(OUT.read_text(encoding="utf-8")).get("items") or [])
        except Exception:
            items = -1
    st: dict = {}
    try:
        # scrape already stages on clean complete; call again only if needed
        if reason.startswith("cf_") or "staging_count=" not in tail_text(scrape_log()):
            st = stage_now()
        else:
            st = {"note": "already_staged_by_scrape"}
            # still ensure stage once more for safety
            st = stage_now()
    except Exception as e:
        log(f"stage_err {type(e).__name__}: {e}")
    mermaid = 0
    if OUT.exists():
        try:
            mermaid = sum(1 for i in (json.loads(OUT.read_text(encoding="utf-8")).get("items") or []) if i.get("lineage_mermaid"))
        except Exception:
            mermaid = -1
    body = (
        f"reason={reason}\nfinal_n={n}\ndump_items={items}\nmermaid={mermaid}\n"
        f"cursor={d.get('cursor')}\nblocked={d.get('blocked_url')}\n"
        f"stage={json.dumps(st, default=str)}\nfinished_at={datetime.now().isoformat()}\n"
    )
    RESULT.write_text(body, encoding="utf-8")
    log(f"FINAL {body.replace(chr(10), ' | ')}")
    return 0

def completed_in_log(t: str) -> bool:
    return ("pw scrape complete" in t) or ("staging_count=" in t and "wrote " in t and "count=" in t)

def blocked_in_log(t: str) -> str | None:
    for m in ("SOFT_STOP RATE_LIMIT", "STOP CF ", "CF_ON_WARM", "OPEN_FAIL"):
        if m in t:
            for ln in t.splitlines()[::-1]:
                if m.strip() in ln or m in ln:
                    return ln[:200]
    return None

def main() -> int:
    log("=== shepherd v2 start (run-to-completion) ===")
    last_n = ck_n()
    log(f"initial n={last_n} scrape_alive={list_sdb()}")
    block_resumes = 0
    while True:
        pids = list_sdb()
        n = ck_n()
        d = ck()
        t = tail_text(scrape_log())
        if n != last_n:
            log(f"progress n={n} cursor={str(d.get('cursor'))[:80]}")
            last_n = n
        moved = offscreen()
        if moved:
            log(f"offscreen_moved={moved}")

        if pids:
            time.sleep(180)
            continue

        # process gone
        if completed_in_log(t):
            return finish("completed")

        blk = blocked_in_log(t)
        if blk:
            log(f"hard_block {blk}")
            block_resumes += 1
            if block_resumes > 2:
                return finish("cf_blocked")
            log("cool-off 600s then resume")
            time.sleep(600)
            if not list_sdb():
                start_scrape()
            time.sleep(120)
            continue

        log("scrape dead — resume from checkpoint")
        start_scrape()
        time.sleep(120)

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        log(f"CRASH {type(e).__name__}: {e}")
        raise
