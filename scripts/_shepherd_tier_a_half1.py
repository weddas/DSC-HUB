#!/usr/bin/env python3
"""Shepherd Tier A first-half scrape: resume if dead, print progress."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
PID_FILE = DATA / "_tier_a_half1_run.pid"
LOG = DATA / "_tier_a_half1_run.log"
ERR = DATA / "_tier_a_half1_run.err"
RESULTS = DATA / "_tier_a_half1_results.json"
CLAIM = DATA / "_tier_a_half1_claim.json"
LAUNCHER = ROOT / "scripts" / "_launch_tier_a_half1.py"
STATUS = ROOT / "scripts" / "_tier_a_half1_status.py"
CREATE_NO_WINDOW = 0x08000000


def pid_alive(pid: int) -> bool:
    if pid <= 0:
        return False
    if sys.platform == "win32":
        try:
            import ctypes

            SYNCHRONIZE = 0x00100000
            handle = ctypes.windll.kernel32.OpenProcess(SYNCHRONIZE, False, pid)
            if handle:
                ctypes.windll.kernel32.CloseHandle(handle)
                return True
            return False
        except Exception:
            return False
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def current_pid() -> int | None:
    if not PID_FILE.exists():
        return None
    try:
        return int(PID_FILE.read_text(encoding="utf-8").strip())
    except ValueError:
        return None


def freedom_progress() -> dict:
    out: dict = {}
    dump = DATA / "dsc_strains_freedom-of-seeds.json"
    ck = DATA / "dsc_strains_freedom-of-seeds.checkpoint.json"
    sm = DATA / "dsc_strains_freedom-of-seeds.sitemap_urls.json"
    if sm.exists():
        try:
            out["queued"] = json.loads(sm.read_text(encoding="utf-8")).get("count")
        except Exception:
            pass
    if dump.exists():
        try:
            out["dump"] = json.loads(dump.read_text(encoding="utf-8")).get("count")
            out["dump_mtime"] = dump.stat().st_mtime
        except Exception:
            pass
    if ck.exists():
        try:
            d = json.loads(ck.read_text(encoding="utf-8"))
            out["done"] = len(d.get("done") or [])
            out["skipped"] = len(d.get("skipped") or [])
            out["ck_mtime"] = ck.stat().st_mtime
        except Exception:
            pass
    return out


def resume() -> int:
    env = dict(os.environ)
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"
    # Do NOT pass --refresh-urls so Freedom resumes from cache/checkpoint
    args = [sys.executable, str(LAUNCHER)]
    kw: dict = {
        "cwd": str(ROOT),
        "stdin": subprocess.DEVNULL,
        "env": env,
    }
    if sys.platform == "win32":
        kw["creationflags"] = CREATE_NO_WINDOW
    proc = subprocess.Popen(args, **kw)
    print(f"resumed via launcher wrapper pid={proc.pid}", flush=True)
    time.sleep(2)
    return current_pid() or proc.pid


def results_progress() -> dict:
    if not RESULTS.exists():
        return {}
    try:
        return json.loads(RESULTS.read_text(encoding="utf-8"))
    except Exception:
        return {}


def log_tail_bank() -> str:
    if not LOG.exists():
        return ""
    try:
        lines = LOG.read_text(encoding="utf-8", errors="replace").splitlines()
        for line in reversed(lines[-80:]):
            if line.startswith("===") or "checkpoint items=" in line or line.startswith("wrote "):
                return line[:160]
    except Exception:
        pass
    return ""


def main() -> int:
    polls = int(sys.argv[1]) if len(sys.argv) > 1 else 40
    interval = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
    stale_limit = float(sys.argv[3]) if len(sys.argv) > 3 else 900.0

    claim_n = 96
    if CLAIM.exists():
        claim_n = json.loads(CLAIM.read_text(encoding="utf-8")).get("claimed_count") or 96

    last_sig = ""
    last_change = time.time()

    for i in range(polls):
        pid = current_pid()
        alive = bool(pid and pid_alive(pid))
        if not alive:
            print(f"[{i}] DEAD — resuming launcher", flush=True)
            pid = resume()
            alive = bool(pid and pid_alive(pid))
            last_change = time.time()

        fo = freedom_progress()
        rs = results_progress()
        attempted = int(rs.get("attempted") or 0)
        ok_n = int(rs.get("succeeded") or 0)
        items = int(rs.get("total_items") or 0)
        fo_done = int(fo.get("done") or 0)
        fo_dump = int(fo.get("dump") or 0)
        fo_q = int(fo.get("queued") or 0)
        tip = log_tail_bank()
        sig = f"{attempted}:{ok_n}:{items}:{fo_done}:{tip}"
        if sig != last_sig:
            last_sig = sig
            last_change = time.time()
        stale = time.time() - last_change

        print(
            f"[{i}] pid={pid} alive={alive} "
            f"partition attempted={attempted} ok={ok_n} items={items}/{claim_n} "
            f"freedom={fo_dump}/{fo_q} stale={stale:.0f}s | {tip}",
            flush=True,
        )

        if attempted >= claim_n:
            print("PARTITION COMPLETE", flush=True)
            subprocess.call([sys.executable, str(STATUS)], cwd=str(ROOT))
            return 0

        # Hang detection: no results/log movement for stale_limit
        if alive and stale >= stale_limit and attempted < claim_n:
            print(f"[{i}] STALE {stale:.0f}s — killing {pid} and resuming", flush=True)
            try:
                if sys.platform == "win32":
                    subprocess.call(
                        ["taskkill", "/PID", str(pid), "/F"],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                else:
                    os.kill(pid, 9)
            except Exception as exc:
                print(f"kill failed: {exc}", flush=True)
            time.sleep(2)
            resume()
            last_change = time.time()

        time.sleep(interval)

    print("--- final status ---", flush=True)
    subprocess.call([sys.executable, str(STATUS)], cwd=str(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
