#!/usr/bin/env python3
"""Alchimia merge_one with short lock probes (avoid long C-level waits). Never --reset."""
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


def try_begin(conn: sqlite3.Connection) -> bool:
    try:
        conn.execute("BEGIN IMMEDIATE")
        return True
    except sqlite3.OperationalError:
        return False


def main() -> int:
    LOG.write_text("", encoding="utf-8")
    NAS_LOG.write_text("", encoding="utf-8")
    log("alchimia short-probe start")

    # Pre-import while not holding lock
    log("pre-import merge_one")
    from merge_staging_to_master import merge_one
    log("imported")

    for attempt in range(1, 360):
        m = sqlite3.connect(str(MASTER), timeout=1.0)
        m.row_factory = sqlite3.Row
        m.execute("PRAGMA busy_timeout=1000")
        if not try_begin(m):
            m.close()
            if attempt == 1 or attempt % 6 == 0:
                log(f"busy attempt={attempt}")
            time.sleep(5)
            continue

        log(f"GOT LOCK attempt={attempt}; merging")
        try:
            st = merge_one(m, STAGING, include_raw=False)
            m.commit()
            log(f"committed merge_one={st}")
        except Exception:
            try:
                m.rollback()
            except Exception:
                pass
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
            "note": "typed merge via merge_one; search/link not rebuilt here",
        }
        text = json.dumps(result, indent=2, default=str)
        RESULT.write_text(text, encoding="utf-8")
        Path(r"C:\Users\cmgwe\AppData\Local\Temp\_alchimia_merge_result.json").write_text(text, encoding="utf-8")
        log("SUCCESS " + json.dumps(by))
        print(text, flush=True)
        return 0

    log("GIVE_UP")
    RESULT.write_text(json.dumps({"ok": False, "error": "timeout"}), encoding="utf-8")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
