#!/usr/bin/env python3
"""Quick AllBud dump / checkpoint / staging counts."""
from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
STAGING = ROOT / "brain" / "data" / "staging"


def main() -> int:
    out: dict = {}
    ck_path = DATA / "dsc_strains_allbud.checkpoint.json"
    dump_path = DATA / "dsc_strains_allbud.json"
    sm_path = DATA / "dsc_strains_allbud.sitemap_urls.json"
    db_path = STAGING / "allbud.sqlite3"

    if ck_path.exists():
        ck = json.loads(ck_path.read_text(encoding="utf-8"))
        done = ck.get("done") or []
        out["checkpoint_done"] = len(done)
        out["checkpoint_done_count"] = ck.get("done_count")
        out["cursor"] = ck.get("cursor")
        errs = ck.get("errors") or []
        out["errors"] = len(errs)
        if errs:
            e0 = errs[-1]
            out["last_error"] = e0 if isinstance(e0, str) else json.dumps(e0)[:240]
    if dump_path.exists():
        dump = json.loads(dump_path.read_text(encoding="utf-8"))
        items = dump.get("items") or []
        out["dump_items"] = len(items)
        out["dump_bytes"] = dump_path.stat().st_size
        out["dump_mtime"] = dump_path.stat().st_mtime
    if sm_path.exists():
        sm = json.loads(sm_path.read_text(encoding="utf-8"))
        urls = sm.get("urls") or []
        out["sitemap_count"] = sm.get("count") or len(urls)
        out["sitemap_urls"] = len(urls)
    out["staging_exists"] = db_path.exists()
    if db_path.exists():
        out["staging_bytes"] = db_path.stat().st_size
        out["staging_mtime"] = db_path.stat().st_mtime
        con = sqlite3.connect(str(db_path))
        tables = {
            r[0]: con.execute(f'SELECT COUNT(*) FROM "{r[0]}"').fetchone()[0]
            for r in con.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )
        }
        con.close()
        out["staging_tables"] = tables
        # Prefer cannabis_strains / strains style count
        for key in ("cannabis_strains", "strains", "items", "records"):
            if key in tables:
                out["staging_count"] = tables[key]
                break
        else:
            out["staging_count"] = max(tables.values()) if tables else 0
    print(json.dumps(out, indent=2, default=str))
    return 0


if __name__ == "__main__":
    sys.exit(main())
