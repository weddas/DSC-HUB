#!/usr/bin/env python3
"""Merge per-source staging SQLite DBs into master dsc_brain.sqlite3.

Staging may be multi-GB (FULL raw_record payloads; NAS >1 TB). Master stays
queryable: typed canonical/variant/chem/grow/links + evidence payload_json.

Copies typed projections only.
Does NOT copy attribute_kv (avoids score explosion).
Does NOT copy raw_record by default (full payloads stay in staging; opt-in --include-raw).

Chemistry: INSERT OR IGNORE by id so conflicting chem rows are both kept.
Never deletes/wipes master.

Usage:
  python scripts/merge_staging_to_master.py
  python scripts/merge_staging_to_master.py --only seedcity --only kushy
  python scripts/merge_staging_to_master.py --include-raw
"""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import (  # noqa: E402
    connect,
    corpus_stats,
    init_corpus,
    link_science_to_seed,
    rebuild_search_docs,
)
from brain.dsc_brain.paths import DEFAULT_DB, STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import list_staging_dbs  # noqa: E402

# Tables copied into master (typed + provenance links). No attribute_kv.
COPY_TABLES = (
    "source_record",
    "strain_canonical",
    "strain_variant",
    "chemistry_profile",
    "grow_trait",
    "science_alias",
    "entity_link",
    "light_fixture",
    "nutrient_product",
    "medium_product",
    "media_asset",
    "followup_gap",
    "export_manifest",
)

# Evidence tables: never overwrite existing rows (keep both when conflicting).
INSERT_OR_IGNORE_TABLES = frozenset(
    {"chemistry_profile", "grow_trait", "entity_link", "followup_gap", "raw_record"}
)

RAW_TABLE = "raw_record"


def _table_cols(conn: sqlite3.Connection, table: str) -> list[str]:
    return [r[1] for r in conn.execute(f'PRAGMA table_info("{table}")').fetchall()]


def _merge_canonical(master: sqlite3.Connection, src: sqlite3.Connection) -> int:
    """Match name_norm; soft-merge summary_json without inventing overwrites."""
    n = 0
    for row in src.execute(
        "SELECT name_norm, name, type, summary_json, curated, updated_at FROM strain_canonical"
    ):
        key = row["name_norm"]
        existing = master.execute(
            "SELECT summary_json, type, curated FROM strain_canonical WHERE name_norm=?",
            (key,),
        ).fetchone()
        merged: dict[str, Any] = {}
        if existing:
            try:
                merged = json.loads(existing["summary_json"] or "{}")
            except json.JSONDecodeError:
                merged = {}
        try:
            incoming = json.loads(row["summary_json"] or "{}")
        except json.JSONDecodeError:
            incoming = {}
        for k, v in incoming.items():
            if v in (None, "", [], {}):
                continue
            if k not in merged or merged[k] in (None, "", [], {}):
                merged[k] = v
        type_ = row["type"] or (existing["type"] if existing else None)
        curated = max(int(row["curated"] or 0), int(existing["curated"] if existing else 0))
        now = row["updated_at"] or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        master.execute(
            "INSERT INTO strain_canonical(name_norm, name, type, summary_json, curated, updated_at) "
            "VALUES(?,?,?,?,?,?) "
            "ON CONFLICT(name_norm) DO UPDATE SET "
            "name=excluded.name, "
            "type=COALESCE(excluded.type, strain_canonical.type), "
            "summary_json=excluded.summary_json, "
            "curated=MAX(strain_canonical.curated, excluded.curated), "
            "updated_at=excluded.updated_at",
            (key, row["name"], type_, json.dumps(merged, ensure_ascii=False), curated, now),
        )
        n += 1
    return n


def _merge_table(master: sqlite3.Connection, src: sqlite3.Connection, table: str) -> int:
    if table == "strain_canonical":
        return _merge_canonical(master, src)

    src_cols = _table_cols(src, table)
    dst_cols = _table_cols(master, table)
    if not src_cols or not dst_cols:
        return 0
    cols = [c for c in src_cols if c in dst_cols]
    if not cols:
        return 0
    col_list = ", ".join(cols)
    placeholders = ", ".join("?" for _ in cols)
    pk = None
    for cand in ("id", "name_norm", "alias_norm", "key"):
        if cand in cols:
            pk = cand
            break
    n = 0
    rows = src.execute(f"SELECT {col_list} FROM {table}").fetchall()
    if table in INSERT_OR_IGNORE_TABLES or not pk:
        sql = f"INSERT OR IGNORE INTO {table}({col_list}) VALUES({placeholders})"
    else:
        updates = ", ".join(f"{c}=excluded.{c}" for c in cols if c != pk)
        sql = (
            f"INSERT INTO {table}({col_list}) VALUES({placeholders}) "
            f"ON CONFLICT({pk}) DO UPDATE SET {updates}"
            if updates
            else f"INSERT OR IGNORE INTO {table}({col_list}) VALUES({placeholders})"
        )
    # Batch inserts — row-at-a-time on NAS is too slow and gets killed mid-txn.
    batch = [tuple(row) for row in rows]
    for i in range(0, len(batch), 500):
        master.executemany(sql, batch[i : i + 500])
    return len(batch)


def merge_one(master: sqlite3.Connection, path: Path, *, include_raw: bool) -> dict:
    src = sqlite3.connect(str(path), timeout=120)
    src.row_factory = sqlite3.Row
    family = path.stem
    meta = {r[0]: r[1] for r in src.execute("SELECT key, value FROM meta")}
    counts = {}
    tables = list(COPY_TABLES)
    if include_raw:
        tables.append(RAW_TABLE)
    for table in tables:
        try:
            counts[table] = _merge_table(master, src, table)
        except sqlite3.Error as exc:
            counts[table] = f"ERR {exc}"
    src.close()
    return {
        "family": family,
        "staging_source_id": meta.get("staging_source_id"),
        "counts": counts,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--master", type=Path, default=DEFAULT_DB)
    ap.add_argument("--staging-dir", type=Path, default=STAGING_DIR)
    ap.add_argument("--only", action="append", default=[])
    ap.add_argument(
        "--include-raw",
        action="store_true",
        help="also copy raw_record into master (usually leave full payloads in staging)",
    )
    ap.add_argument("--no-link", action="store_true")
    ap.add_argument("--no-search", action="store_true")
    ap.add_argument(
        "--link-only",
        action="store_true",
        help="skip staging merge; run science↔seed link (+ optional search) only",
    )
    args = ap.parse_args(argv)

    # Live exclusive wrapper may still omit --no-link; honor flag/env for next child.
    force_no_link = (
        os.environ.get("N087_FORCE_NO_LINK", "").strip() in ("1", "true", "yes")
        or (ROOT / "brain" / "data" / "_n087_force_no_link.flag").exists()
    )
    if force_no_link and not args.link_only:
        args.no_link = True
        print("N087_FORCE_NO_LINK: treating as --no-link")

    init_corpus(args.master)
    master = connect(args.master)
    # connect() may leave an open txn (meta upsert); PRAGMA synchronous cannot run inside one.
    if master.in_transaction:
        master.commit()
    master.execute("PRAGMA busy_timeout=120000")
    master.execute("PRAGMA synchronous=NORMAL")
    master.execute("PRAGMA temp_store=MEMORY")
    before = corpus_stats(master)

    results = []
    if not args.link_only:
        dbs = list_staging_dbs(args.staging_dir)
        if args.only:
            dbs = [p for p in dbs if any(f.lower() in p.name.lower() for f in args.only)]

        print(f"Merging {len(dbs)} staging DBs into {args.master} (no wipe; no attribute_kv)")
        for path in dbs:
            try:
                st = merge_one(master, path, include_raw=args.include_raw)
                master.commit()
                results.append(st)
                c = st["counts"]
                print(
                    f"  ok {path.name}: canonical={c.get('strain_canonical')} "
                    f"variant={c.get('strain_variant')} chem={c.get('chemistry_profile')} "
                    f"grow={c.get('grow_trait')} links={c.get('entity_link')}"
                )
            except Exception as exc:  # noqa: BLE001
                master.rollback()
                print(f"  FAIL {path.name}: {exc}")
                results.append({"family": path.stem, "error": str(exc)})
    else:
        print(f"link-only on {args.master} (no staging merge)")

    link_stats = {}
    if not args.no_link:
        link_stats = link_science_to_seed(master)
        print("science<->seed links:", link_stats)
        # N-087-MERGE-NOLINK: --no-search used to skip this commit and drop link writes.
        master.commit()

    docs = 0
    if not args.no_search:
        docs = rebuild_search_docs(master)
        master.commit()

    after = corpus_stats(master)
    master.close()
    print(
        json.dumps(
            {
                "merged": results,
                "links": link_stats,
                "search_docs": docs,
                "before": before,
                "after": after,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
