#!/usr/bin/env python3
"""Shepherd priority bank scrapes to completion (CREATE_NO_WINDOW, no master merge).

Resumes dead scrapers from checkpoints. Stages dumps when a bank finishes.
Does NOT wipe staging. Does NOT merge master.
"""

from __future__ import annotations

import json
import os
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
STAGING = ROOT / "brain" / "data" / "staging"
LOG_DIR = DATA / "_bank_scrape_logs"
CREATE_NO_WINDOW = 0x08000000

# bank -> (script, extra_args, staging_family, expected_queue_key)
BANKS: dict[str, dict] = {
    "ilgm": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_ilgm",
    },
    "seedsupreme": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "250"],
        "family": "bank_seed_supreme",
    },
    "pacific": {
        "script": "scripts/scrape_wc_seed_banks.py",
        "args": ["--delay", "1.25", "--checkpoint-every", "25", "--stage-every", "300"],
        "family": "bank_pacific",
    },
    "truenorth": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "400"],
        "family": "bank_truenorth",
    },
    "cropking": {
        "script": "scripts/scrape_cropking_dcseed.py",
        "args": ["--delay", "0.45", "--checkpoint-every", "50", "--stage"],
        "family": "cropking",
        "stage_flag": "--stage-only",
    },
    "dcseedexchange": {
        "script": "scripts/scrape_cropking_dcseed.py",
        "args": ["--delay", "1.5", "--checkpoint-every", "40", "--stage"],
        "family": "dcseedexchange",
        "stage_flag": "--stage-only",
    },
    "zamnesia": {
        "script": "scripts/scrape_seed_banks.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "40", "--stage-every", "400", "--no-discover"],
        "family": "bank_zamnesia",
    },
    "herbies": {
        "script": "scripts/scrape_seed_banks.py",
        "args": ["--delay", "0.4", "--checkpoint-every", "50", "--stage-every", "500", "--no-discover"],
        "family": "bank_herbies",
    },
    "fastbuds": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_fastbuds",
    },
    "barneys": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_barneys",
    },
    "greenhouse": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_greenhouse",
    },
    "mephisto": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_mephisto",
    },
    "dna": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_dna",
    },
    "dutchpassion": {
        "script": "scripts/scrape_bank_sitemaps.py",
        "args": ["--delay", "0.6", "--checkpoint-every", "25", "--stage-every", "200"],
        "family": "bank_dutchpassion",
    },
    "rqs": {
        "script": "scripts/scrape_seed_banks.py",
        "args": ["--delay", "0.55", "--checkpoint-every", "40", "--stage-every", "400", "--no-discover"],
        "family": "bank_royal_queen",
    },
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def dump_stats(bank: str) -> dict:
    p = DATA / f"dsc_strains_{bank}.json"
    ck = DATA / f"dsc_strains_{bank}.checkpoint.json"
    sm = DATA / f"dsc_strains_{bank}.sitemap_urls.json"
    out = {"bank": bank, "items": 0, "done": 0, "queued": 0, "errs": 0, "complete": False}
    if p.exists():
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
            out["items"] = int(d.get("count") or 0)
            note = str(d.get("note") or "")
            if "complete" in note.lower():
                out["complete"] = True
        except (OSError, json.JSONDecodeError):
            pass
    if ck.exists():
        try:
            c = json.loads(ck.read_text(encoding="utf-8"))
            out["done"] = len(c.get("done") or [])
            out["errs"] = len(c.get("errors") or [])
            # recent 429 storm?
            recent = (c.get("errors") or [])[-30:]
            out["recent_429"] = sum(1 for e in recent if "429" in str(e))
            out["recent_503"] = sum(1 for e in recent if "503" in str(e))
        except (OSError, json.JSONDecodeError):
            pass
    if sm.exists():
        try:
            out["queued"] = int(json.loads(sm.read_text(encoding="utf-8")).get("count") or 0)
        except (OSError, json.JSONDecodeError):
            pass
    if out["queued"] and out["done"] >= out["queued"]:
        out["complete"] = True
    return out


def staging_count(family: str) -> int | None:
    db = STAGING / f"{family}.sqlite3"
    if not db.exists():
        return None
    try:
        con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
        n = con.execute("select count(*) from strain_canonical").fetchone()[0]
        con.close()
        return int(n)
    except Exception:  # noqa: BLE001
        return None


def running_banks() -> dict[str, list[int]]:
    """Map bank -> list of PIDs currently scraping it."""
    found: dict[str, list[int]] = {}
    try:
        r = subprocess.run(
            [
                "powershell",
                "-NoProfile",
                "-Command",
                "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | "
                "Where-Object { $_.CommandLine -match 'scrape_(wc_seed_banks|bank_sitemaps|cropking|seed_banks)' } | "
                "ForEach-Object { Write-Output ($_.ProcessId.ToString() + '|' + $_.CommandLine) }",
            ],
            capture_output=True,
            text=True,
            cwd=str(ROOT),
            creationflags=CREATE_NO_WINDOW,
        )
    except Exception as exc:  # noqa: BLE001
        log(f"process list fail: {exc}")
        return found
    for line in (r.stdout or "").splitlines():
        if "|" not in line:
            continue
        pid_s, cmd = line.split("|", 1)
        try:
            pid = int(pid_s.strip())
        except ValueError:
            continue
        bank = None
        for b in BANKS:
            if f"--bank {b}" in cmd or f"--bank {b} " in cmd or f"--bank','{b}'" in cmd:
                # crude: look for --bank <name>
                pass
        import re

        m = re.search(r"--bank\s+(\S+)", cmd)
        if m:
            bank = m.group(1).strip()
        if not bank:
            continue
        found.setdefault(bank, []).append(pid)
    return found


def kill_pid(pid: int) -> None:
    subprocess.run(
        ["taskkill", "/PID", str(pid), "/F"],
        capture_output=True,
        creationflags=CREATE_NO_WINDOW,
    )


def start_bank(bank: str) -> int | None:
    cfg = BANKS[bank]
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    out = LOG_DIR / f"{bank}.out.log"
    err = LOG_DIR / f"{bank}.err.log"
    with out.open("a", encoding="utf-8") as fo:
        fo.write(f"\n===== SHEPHERD RESUME {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} =====\n")
    cmd = [sys.executable, "-u", str(ROOT / cfg["script"]), "--bank", bank, *cfg["args"]]
    fo = open(out, "a", encoding="utf-8")  # noqa: SIM115
    fe = open(err, "a", encoding="utf-8")  # noqa: SIM115
    p = subprocess.Popen(
        cmd,
        cwd=str(ROOT),
        stdout=fo,
        stderr=fe,
        stdin=subprocess.DEVNULL,
        creationflags=CREATE_NO_WINDOW,
    )
    (LOG_DIR / f"{bank}.pid").write_text(str(p.pid), encoding="utf-8")
    log(f"started {bank} pid={p.pid}")
    return p.pid


def stage_bank(bank: str) -> None:
    cfg = BANKS[bank]
    flag = cfg.get("stage_flag")
    if flag:
        cmd = [sys.executable, "-u", str(ROOT / cfg["script"]), "--bank", bank, flag]
    elif "scrape_wc_seed_banks" in cfg["script"] or "scrape_bank_sitemaps" in cfg["script"] or "scrape_seed_banks" in cfg["script"]:
        cmd = [sys.executable, "-u", str(ROOT / cfg["script"]), "--bank", bank, "--stage-only"]
    else:
        return
    log(f"staging {bank}")
    r = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, creationflags=CREATE_NO_WINDOW)
    if r.returncode != 0:
        log(f"stage fail {bank}: {(r.stderr or r.stdout or '')[-300:]}")
    else:
        n = staging_count(cfg["family"])
        log(f"staged {bank} family={cfg['family']} canonical={n}")


def dedupe(running: dict[str, list[int]]) -> dict[str, list[int]]:
    for bank, pids in list(running.items()):
        if len(pids) <= 1:
            continue
        keep = max(pids)
        for pid in pids:
            if pid != keep:
                log(f"dedupe kill {bank} pid={pid} keep={keep}")
                kill_pid(pid)
        running[bank] = [keep]
    return running


def main() -> int:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    poll = float(os.environ.get("SHEPHERD_POLL", "45"))
    max_hours = float(os.environ.get("SHEPHERD_MAX_HOURS", "3.5"))
    t0 = time.time()
    stalled: dict[str, tuple[int, float]] = {}  # bank -> (done, since)
    finished: set[str] = set()
    hard_block: set[str] = set()

    # Already-complete banks
    for bank in BANKS:
        st = dump_stats(bank)
        if st["complete"]:
            finished.add(bank)
            log(f"already complete {bank} items={st['items']} done={st['done']}/{st['queued']}")
            stage_bank(bank)

    # Honor manual hard-block sidecars (e.g. pacific HTTP 429 storm)
    for bank in list(BANKS):
        hb = LOG_DIR / f"{bank}.hard_block.json"
        if hb.exists() and bank not in finished:
            hard_block.add(bank)
            log(f"hard-block sidecar {bank}: {hb.name}")
            stage_bank(bank)

    while True:
        elapsed_h = (time.time() - t0) / 3600.0
        if elapsed_h >= max_hours:
            log(f"max hours {max_hours} reached — stopping shepherd")
            break

        running = dedupe(running_banks())
        all_done = True
        for bank in BANKS:
            if bank in finished or bank in hard_block:
                continue
            st = dump_stats(bank)
            if st["complete"]:
                log(f"COMPLETE {bank} items={st['items']} done={st['done']}/{st['queued']} errs={st['errs']}")
                finished.add(bank)
                # stop any leftover process
                for pid in running.get(bank) or []:
                    kill_pid(pid)
                stage_bank(bank)
                continue

            all_done = False
            pids = running.get(bank) or []

            # Stall / 429 detection for pacific
            prev = stalled.get(bank)
            if prev and prev[0] == st["done"]:
                stalled_for = time.time() - prev[1]
            else:
                stalled[bank] = (st["done"], time.time())
                stalled_for = 0.0

            if not pids:
                # Hard block: pacific 429 storm with no progress for 10+ min
                if bank == "pacific" and st.get("recent_429", 0) >= 20 and stalled_for > 600:
                    log(f"HARD BLOCK {bank}: 429 storm + stall {stalled_for:.0f}s — leave checkpoint")
                    hard_block.add(bank)
                    stage_bank(bank)
                    continue
                if bank == "dcseedexchange" and st.get("recent_503", 0) >= 20 and stalled_for > 900:
                    log(f"HARD BLOCK {bank}: 503 storm + stall — leave checkpoint")
                    hard_block.add(bank)
                    stage_bank(bank)
                    continue
                log(f"dead {bank} at {st['done']}/{st['queued']} — resume")
                start_bank(bank)
            else:
                log(
                    f"{bank}: done={st['done']}/{st['queued']} items={st['items']} "
                    f"errs={st['errs']} pids={pids} stall={stalled_for:.0f}s"
                )

        if all_done and not (set(BANKS) - finished - hard_block):
            log("all banks finished or hard-blocked")
            break
        if all_done:
            # only hard-blocked remaining
            if set(BANKS) <= (finished | hard_block):
                break

        time.sleep(poll)

    # Final report
    print("\n=== FINAL REPORT ===", flush=True)
    report = []
    for bank, cfg in BANKS.items():
        st = dump_stats(bank)
        can = staging_count(cfg["family"])
        # ensure staged once more
        if st["items"] >= 20:
            try:
                stage_bank(bank)
                can = staging_count(cfg["family"])
            except Exception as exc:  # noqa: BLE001
                log(f"final stage warn {bank}: {exc}")
        state = "DONE" if bank in finished or st["complete"] else ("HARD_BLOCK" if bank in hard_block else "PARTIAL")
        row = {
            "bank": bank,
            "state": state,
            "dump_items": st["items"],
            "done": st["done"],
            "queued": st["queued"],
            "errs": st["errs"],
            "staging_family": cfg["family"],
            "staging_canonical": can,
            "staging_db": str(STAGING / f"{cfg['family']}.sqlite3"),
        }
        report.append(row)
        print(
            f"{bank:16} {state:10} dump={st['items']:5} done={st['done']}/{st['queued'] or '?'} "
            f"errs={st['errs']} staging_canonical={can}",
            flush=True,
        )

    out_path = LOG_DIR / "shepherd_final.json"
    out_path.write_text(json.dumps({"built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "banks": report}, indent=2), encoding="utf-8")
    log(f"wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
