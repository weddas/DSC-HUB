#!/usr/bin/env python3
"""Retry Hytiva miss + confirm master merge under lock contention."""
from __future__ import annotations

import json
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.paths import DEFAULT_DB, staging_db_path  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402
from catalog_common import write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from scrape_hytiva import (  # noqa: E402
    NOTE,
    OUT,
    SOURCE_ID,
    SOURCE_URL,
    parse_strain_page,
    polite_get,
)


def retry_miss() -> None:
    url = "https://www.hytiva.com/strains/hybrid/royal-wappa"
    html = polite_get(url, delay=1.0)
    row = parse_strain_page(html, url)
    dump = json.loads(OUT.read_text(encoding="utf-8"))
    items = list(dump.get("items") or [])
    by = {i.get("url"): i for i in items if isinstance(i, dict)}
    by[url] = row
    items = list(by.values())
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE_ID,
        source_url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note=NOTE,
        staging_target=str(staging_db_path("hytiva")),
    )
    Checkpoint(ROOT / "homeassistant" / "data" / "dsc_strains_hytiva.checkpoint.json").mark_done(url)
    print("retried", url, "name=", row.get("name"), "dump=", len(items))
    # additive staging refresh
    st = write_dump_to_staging(OUT, source_id=SOURCE_ID, reset=True)
    print("restaged", st.get("staging_db"), "n=", st.get("count"), "stats=", st.get("stats"))


def check_master() -> None:
    for attempt in range(8):
        try:
            m = sqlite3.connect(str(DEFAULT_DB), timeout=180)
            m.execute("PRAGMA busy_timeout=180000")
            m.row_factory = sqlite3.Row
            print("master_canonical", m.execute("SELECT COUNT(*) AS c FROM strain_canonical").fetchone()["c"])
            print(
                "chem_hytiva",
                m.execute(
                    "SELECT COUNT(*) AS c FROM chemistry_profile WHERE source_id = ?",
                    ("hytiva",),
                ).fetchone()["c"],
            )
            print(
                "grow_hytiva",
                m.execute(
                    "SELECT COUNT(*) AS c FROM grow_trait WHERE source_id = ?",
                    ("hytiva",),
                ).fetchone()["c"],
            )
            print(
                "attr_hytiva",
                m.execute(
                    "SELECT COUNT(*) AS c FROM attribute_kv WHERE source_id = ?",
                    ("hytiva",),
                ).fetchone()["c"],
            )
            src = m.execute(
                "SELECT id, redistributable FROM source_record WHERE id = ?",
                ("hytiva",),
            ).fetchone()
            print("source", dict(src) if src else None)
            m.close()
            return
        except sqlite3.OperationalError as exc:
            print("master locked attempt", attempt, exc)
            time.sleep(15)
    print("master still locked after retries")


def main() -> int:
    try:
        retry_miss()
    except Exception as exc:  # noqa: BLE001
        print("retry_miss failed:", exc)
    check_master()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
