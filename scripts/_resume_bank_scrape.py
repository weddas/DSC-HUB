#!/usr/bin/env python3
"""In-process batched resume loop for Crop King / DC Seed Exchange.

Calls scrape_bank(limit=batch) in-process so progress persists via checkpoint
even when the host kills long-lived processes (~15 min). Each round scrapes
only --batch-limit pending PDPs (~3–5 min), then loops until coverage.

Does NOT merge master. Stages when coverage is met (--stage).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from scrape_cropking_dcseed import scrape_bank, stage_dump  # noqa: E402


def counts(bank: str) -> tuple[int, int, int]:
    sm = DATA / f"dsc_strains_{bank}.sitemap_urls.json"
    ck = DATA / f"dsc_strains_{bank}.checkpoint.json"
    dump = DATA / f"dsc_strains_{bank}.json"
    n = 0
    if sm.exists():
        n = int(json.loads(sm.read_text(encoding="utf-8")).get("count") or 0)
    done = 0
    if ck.exists():
        done = len(json.loads(ck.read_text(encoding="utf-8")).get("done") or [])
    items = 0
    if dump.exists():
        doc = json.loads(dump.read_text(encoding="utf-8"))
        items = int(doc.get("count") or 0) or len(doc.get("items") or [])
    return n, done, items


def coverage_met(bank: str) -> bool:
    n, done, items = counts(bank)
    if n <= 0:
        return False
    need = max(1, int(n * 0.98))
    return done >= need and items >= need


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bank", choices=["cropking", "dcseedexchange"], required=True)
    ap.add_argument("--delay", type=float, default=0.4)
    ap.add_argument("--checkpoint-every", type=int, default=15)
    ap.add_argument("--batch-limit", type=int, default=60, help="pending PDPs per round")
    ap.add_argument("--stage", action="store_true")
    ap.add_argument("--max-rounds", type=int, default=200)
    ap.add_argument("--stall-rounds", type=int, default=5)
    args = ap.parse_args()

    bank = args.bank
    DATA.mkdir(parents=True, exist_ok=True)
    me = os.getpid()
    pid_path = DATA / f"_resume_{bank}.pid"
    log_path = DATA / f"_resume_{bank}.log"
    lock_path = DATA / f"_resume_{bank}.lock"
    pid_path.write_text(str(me), encoding="ascii")

    if lock_path.exists():
        try:
            meta = json.loads(lock_path.read_text(encoding="utf-8"))
            age = time.time() - float(meta.get("ts") or 0)
            other = int(meta.get("pid") or 0)
            if other and other != me and age < 180:
                try:
                    os.kill(other, 0)
                    print(f"another resume owns {bank} pid={other} age={age:.0f}s; exiting", flush=True)
                    return 0
                except OSError:
                    pass
        except (OSError, json.JSONDecodeError, ValueError, TypeError):
            pass

    def beat(msg: str) -> None:
        line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} {msg}"
        print(line, flush=True)
        with log_path.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
        lock_path.write_text(
            json.dumps({"pid": me, "ts": time.time(), "msg": msg, "bank": bank}),
            encoding="utf-8",
        )

    beat(f"batched resume start pid={me} bank={bank} batch={args.batch_limit}")
    prev_done = -1
    stall = 0

    for rnd in range(1, args.max_rounds + 1):
        n, done, items = counts(bank)
        beat(f"round {rnd} sitemap={n} done={done} dump={items}")
        if coverage_met(bank):
            beat(f"{bank}: coverage met")
            break
        if done == prev_done and prev_done >= 0:
            stall += 1
            if stall >= args.stall_rounds:
                beat(f"{bank}: stalled at done={done}")
                break
        else:
            stall = 0
        prev_done = done

        try:
            scrape_bank(
                bank,
                delay=args.delay,
                limit=args.batch_limit,
                refresh_sitemap=False,
                checkpoint_every=max(5, args.checkpoint_every),
            )
        except KeyboardInterrupt:
            beat("interrupted")
            raise
        except Exception as exc:  # noqa: BLE001
            beat(f"scrape exception: {exc!r}")
            time.sleep(5)

        n2, done2, items2 = counts(bank)
        beat(f"round {rnd} end done={done2} dump={items2} delta={done2 - done}")
        time.sleep(1)

    n, done, items = counts(bank)
    beat(f"FINAL sitemap={n} done={done} dump={items}")

    if args.stage and items > 0:
        try:
            st = stage_dump(bank, reset=True)
            beat(f"staged count={st.get('count')} db={st.get('staging_db')}")
        except Exception as exc:  # noqa: BLE001
            beat(f"stage failed: {exc!r}")
            return 1

    try:
        lock_path.unlink(missing_ok=True)
    except OSError:
        pass

    return 0 if coverage_met(bank) else 1


if __name__ == "__main__":
    raise SystemExit(main())
