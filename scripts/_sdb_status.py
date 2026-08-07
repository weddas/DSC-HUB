#!/usr/bin/env python3
"""Quick strain-database scrape/staging status."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
CK = DATA / "dsc_strains_straindatabase.checkpoint.json"
OUT = DATA / "dsc_strains_straindatabase.json"
SM = DATA / "dsc_strains_straindatabase.sitemap_urls.json"
DB = ROOT / "brain" / "data" / "staging" / "strain_database.sqlite3"
UD = Path.home() / "AppData" / "Local" / "Temp" / "dsc-chrome-fresh-pw"


def main() -> None:
    ck = json.loads(CK.read_text(encoding="utf-8")) if CK.exists() else {}
    done = ck.get("done") or []
    print(f"done={len(done)} cursor={ck.get('cursor')} blocked={ck.get('blocked_url')}")
    if OUT.exists():
        d = json.loads(OUT.read_text(encoding="utf-8"))
        items = d.get("items") or []
        mer = sum(1 for i in items if isinstance(i, dict) and i.get("lineage_mermaid"))
        print(f"dump_items={len(items)} mermaid={mer} note={d.get('note')!r}")
    if SM.exists():
        sm = json.loads(SM.read_text(encoding="utf-8"))
        urls = sm.get("urls") if isinstance(sm, dict) else sm
        print(f"sitemap={len(urls or [])}")
        remaining = [u for u in (urls or []) if u not in set(done)]
        print(f"remaining={len(remaining)}")
    if DB.exists():
        con = sqlite3.connect(str(DB))
        for (name,) in con.execute("SELECT name FROM sqlite_master WHERE type='table'"):
            n = con.execute(f"SELECT COUNT(*) FROM [{name}]").fetchone()[0]
            print(f"staging.{name}={n}")
        con.close()
    else:
        print("staging=missing")
    print(f"userdata={UD.exists()} {UD}")


if __name__ == "__main__":
    main()
