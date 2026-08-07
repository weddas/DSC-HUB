#!/usr/bin/env python3
"""Simple watch loop for remaining bank scrapes — no thrash restarts."""

from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
LOG = DATA / "_bank_scrape_logs"
CREATE_NO_WINDOW = 0x08000000

WATCH = {
    "truenorth": ("scripts/scrape_bank_sitemaps.py", ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "400"]),
    "cropking": ("scripts/scrape_cropking_dcseed.py", ["--delay", "0.45", "--checkpoint-every", "50", "--stage"]),
    "dcseedexchange": ("scripts/scrape_cropking_dcseed.py", ["--delay", "1.5", "--checkpoint-every", "40", "--stage"]),
    "zamnesia": ("scripts/scrape_seed_banks.py", ["--delay", "0.55", "--checkpoint-every", "40", "--stage-every", "400", "--no-discover"]),
    "herbies": ("scripts/scrape_seed_banks.py", ["--delay", "0.4", "--checkpoint-every", "50", "--stage-every", "500", "--no-discover"]),
    "dutchpassion": ("scripts/scrape_bank_sitemaps.py", ["--delay", "0.6", "--checkpoint-every", "25", "--stage-every", "200"]),
}

HARD_BLOCK = {"pacific"}  # 429 storm


def stats(bank: str) -> dict:
    p, ck, sm = (DATA / f"dsc_strains_{bank}.json", DATA / f"dsc_strains_{bank}.checkpoint.json", DATA / f"dsc_strains_{bank}.sitemap_urls.json")
    out = {"items": 0, "done": 0, "queued": 0, "errs": 0}
    if p.exists():
        out["items"] = int(json.loads(p.read_text(encoding="utf-8")).get("count") or 0)
    if ck.exists():
        c = json.loads(ck.read_text(encoding="utf-8"))
        out["done"] = len(c.get("done") or [])
        out["errs"] = len(c.get("errors") or [])
    if sm.exists():
        out["queued"] = int(json.loads(sm.read_text(encoding="utf-8")).get("count") or 0)
    return out


def live() -> dict[str, list[int]]:
    r = subprocess.run(
        [
            "powershell", "-NoProfile", "-Command",
            "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | "
            "Where-Object { $_.CommandLine -match 'scrape_(wc_seed_banks|bank_sitemaps|cropking|seed_banks)' } | "
            "ForEach-Object { \"$($_.ProcessId)|$($_.CommandLine)\" }",
        ],
        capture_output=True, text=True, cwd=str(ROOT), creationflags=CREATE_NO_WINDOW,
    )
    found: dict[str, list[int]] = {}
    for line in (r.stdout or "").splitlines():
        if "|" not in line:
            continue
        pid_s, cmd = line.split("|", 1)
        m = re.search(r"--bank\s+(\S+)", cmd)
        if not m:
            continue
        found.setdefault(m.group(1), []).append(int(pid_s))
    return found


def start(bank: str) -> None:
    script, args = WATCH[bank]
    LOG.mkdir(parents=True, exist_ok=True)
    out, err = LOG / f"{bank}.out.log", LOG / f"{bank}.err.log"
    with out.open("a", encoding="utf-8") as fo:
        fo.write(f"\n===== WATCH RESUME {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} =====\n")
    fo = open(out, "a", encoding="utf-8")  # noqa: SIM115
    fe = open(err, "a", encoding="utf-8")  # noqa: SIM115
    cmd = [sys.executable, "-u", str(ROOT / script), "--bank", bank, *args]
    p = subprocess.Popen(cmd, cwd=str(ROOT), stdout=fo, stderr=fe, stdin=subprocess.DEVNULL, creationflags=CREATE_NO_WINDOW)
    print(f"started {bank} pid={p.pid}", flush=True)


def dedupe(found: dict[str, list[int]]) -> None:
    for bank, pids in found.items():
        if len(pids) <= 1:
            continue
        keep = max(pids)
        for pid in pids:
            if pid == keep:
                continue
            subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True, creationflags=CREATE_NO_WINDOW)
            print(f"dedupe {bank} kill {pid} keep {keep}", flush=True)


def main() -> int:
    t0 = time.time()
    max_s = 150 * 60  # 2.5h
    last_done: dict[str, int] = {}
    while time.time() - t0 < max_s:
        found = live()
        dedupe(found)
        found = live()
        remaining = []
        for bank in WATCH:
            st = stats(bank)
            done, queued = st["done"], st["queued"]
            if queued and done >= queued:
                print(f"DONE {bank} items={st['items']} done={done}/{queued}", flush=True)
                continue
            remaining.append(bank)
            pids = found.get(bank) or []
            if not pids:
                # only restart if stalled-dead (not hard-block)
                if bank in HARD_BLOCK:
                    print(f"HARD_BLOCK skip {bank}", flush=True)
                    continue
                print(f"dead {bank} at {done}/{queued} — resume", flush=True)
                start(bank)
            else:
                delta = ""
                if bank in last_done:
                    d = done - last_done[bank]
                    delta = f" +{d}" if d else " (stall)"
                print(f"{bank}: {done}/{queued} items={st['items']} errs={st['errs']} pids={pids}{delta}", flush=True)
            last_done[bank] = done
        if not remaining:
            print("ALL WATCH BANKS COMPLETE", flush=True)
            break
        # dutchpassion may finish soon — drop from remaining naturally
        time.sleep(90)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
