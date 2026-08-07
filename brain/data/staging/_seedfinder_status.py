#!/usr/bin/env python3
"""Quick SeedFinder scrape status (staging + checkpoint)."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CK = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.checkpoint.json"
URLS = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.urls.json"
DUMP = ROOT / "homeassistant" / "data" / "dsc_strains_seedfinder.json"
DB = ROOT / "brain" / "data" / "staging" / "seedfinder.sqlite3"


def main() -> None:
    ck = json.loads(CK.read_text(encoding="utf-8")) if CK.exists() else {}
    done = ck.get("done") or []
    errs = ck.get("errors") or []
    urls_doc = json.loads(URLS.read_text(encoding="utf-8")) if URLS.exists() else {}
    url_n = int(urls_doc.get("count") or len(urls_doc.get("urls") or []))
    dump_n = 0
    if DUMP.exists():
        try:
            dump_n = len(json.loads(DUMP.read_text(encoding="utf-8")).get("items") or [])
        except json.JSONDecodeError:
            dump_n = -1
    tables: dict[str, int] = {}
    if DB.exists():
        con = sqlite3.connect(str(DB))
        names = [
            r[0]
            for r in con.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1"
            )
        ]
        for t in names:
            tables[t] = con.execute(f"SELECT COUNT(*) FROM [{t}]").fetchone()[0]
        con.close()
    out = {
        "checkpoint_done": len(done),
        "urls_total": url_n,
        "todo_approx": max(0, url_n - len(done)),
        "dump_items": dump_n,
        "errors": len(errs),
        "recent_errors": errs[-5:],
        "staging_db": str(DB),
        "staging_tables": tables,
        "db_bytes": DB.stat().st_size if DB.exists() else 0,
    }
    print(json.dumps(out, indent=2, default=str))


if __name__ == "__main__":
    main()
