#!/usr/bin/env python3
"""Wait for exclusive owner DONE (file watch), then merge_one alchimia. Never --reset."""
from __future__ import annotations

import json
import sqlite3
import sys
import time
import traceback
from pathlib import Path

ROOT = Path(r"y:\Digital Stealth Care\Projects\DSC-HUB")
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
STAGING = ROOT / "brain" / "data" / "staging" / "alchimia.sqlite3"
EXCL_LOG = ROOT / "brain" / "data" / "_excl_owner.log"
LOG = Path(r"C:\Users\cmgwe\AppData\Local\Temp\_alchimia_now.log")
NAS_LOG = ROOT / "brain" / "data" / "_alchimia_merge_live.txt"
RESULT = ROOT / "brain" / "data" / "_alchimia_merge_result.json"
SID = "alchimia"


def log(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    print(line, flush=True)
    for p in (LOG, NAS_LOG):
        with p.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
            f.flush()


def excl_done() -> bool:
    if not EXCL_LOG.exists():
        return True  # no exclusive owner
    text = EXCL_LOG.read_text(encoding="utf-8", errors="replace")
    if "EXCLUSIVE OWNER START" not in text:
        return True
    # done if DONE after last START
    last_start = text.rfind("EXCLUSIVE OWNER START")
    tail = text[last_start:]
    return "\nDONE" in tail or tail.strip().endswith("DONE")


def excl_running_proc() -> bool:
    # soft check via log freshness + lack of DONE
    return not excl_done()


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    NAS_LOG.write_text("", encoding="utf-8")
    log("alchimia after-excl waiter start")

    for i in range(1, 720):  # up to ~2h at 10s
        done = excl_done()
        if i == 1 or i % 6 == 0 or done:
            log(f"poll {i} excl_done={done}")
        if done:
            # also ensure no merge_staging child still listed — best effort sleep
            time.sleep(3)
            if excl_done():
                break
        time.sleep(10)
    else:
        log("timeout waiting excl; will still try")

    log("pre-import")
    from merge_staging_to_master import merge_one
    log("imported; acquiring lock")

    for attempt in range(1, 120):
        m = sqlite3.connect(str(MASTER), timeout=1.0)
        m.row_factory = sqlite3.Row
        m.execute("PRAGMA busy_timeout=1000")
        try:
            m.execute("BEGIN IMMEDIATE")
        except sqlite3.OperationalError as e:
            m.close()
            if attempt == 1 or attempt % 6 == 0:
                log(f"busy {attempt}: {e}")
            time.sleep(5)
            continue

        log(f"LOCK acquired attempt={attempt}")
        try:
            st = merge_one(m, STAGING, include_raw=False)
            m.commit()
            log(f"committed {st}")
        except Exception:
            m.rollback()
            log(traceback.format_exc())
            RESULT.write_text(json.dumps({"ok": False, "tb": traceback.format_exc()}, indent=2), encoding="utf-8")
            m.close()
            return 1

        by = {
            "source": list(m.execute("SELECT id,name FROM source_record WHERE id=?", (SID,)).fetchone() or []),
            "variant": m.execute("SELECT COUNT(*) FROM strain_variant WHERE source_id=?", (SID,)).fetchone()[0],
            "chem": m.execute("SELECT COUNT(*) FROM chemistry_profile WHERE source_id=?", (SID,)).fetchone()[0],
            "grow": m.execute("SELECT COUNT(*) FROM grow_trait WHERE source_id=?", (SID,)).fetchone()[0],
            "links": m.execute("SELECT COUNT(*) FROM entity_link WHERE source_id=?", (SID,)).fetchone()[0],
        }
        m.close()
        result = {
            "ok": True,
            "family": SID,
            "status": "ok",
            "merged": st,
            "by_source": {SID: by},
            "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        text = json.dumps(result, indent=2, default=str)
        RESULT.write_text(text, encoding="utf-8")
        Path(r"C:\Users\cmgwe\AppData\Local\Temp\_alchimia_merge_result.json").write_text(text, encoding="utf-8")
        log("SUCCESS " + json.dumps(by))
        print(text, flush=True)
        return 0

    log("GIVE_UP lock")
    RESULT.write_text(json.dumps({"ok": False, "error": "lock_timeout"}), encoding="utf-8")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
