#!/usr/bin/env python3
"""Backfill exact science_alias rows from durable external ids already on master/staging.

Keys (exact only, unique alias_norm → one canonical):
  - Leafly slug from strain_canonical.summary_json / chemistry payload
  - SeedFinder strain_slug (+ optional breeder_slug compound)
  - OpenTHC stub + ULID id from staging raw
  - Retail SKU / external_id when unique within corpus

Never fuzzy-matches names. Colliding alias_norm values are skipped.

Usage:
  python scripts/project_external_id_aliases.py --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import connect, name_norm  # noqa: E402


def _slug_to_alias(slug: str) -> str:
    s = (slug or "").strip().lower().replace("_", "-")
    return s


def _try_insert(
    con: sqlite3.Connection,
    *,
    alias: str,
    alias_norm: str,
    name: str,
    source_id: str,
    dry_run: bool,
    stats: dict,
    bucket: str,
) -> None:
    if not alias_norm or not name:
        return
    existing = con.execute(
        "SELECT name_norm FROM science_alias WHERE alias_norm=?", (alias_norm,)
    ).fetchone()
    if existing:
        if existing[0] != name:
            stats["skipped_collision"] += 1
            stats[f"collision_{bucket}"] = stats.get(f"collision_{bucket}", 0) + 1
        else:
            stats["already"] += 1
        return
    # also skip if alias_norm already is another canonical's name_norm pointing elsewhere
    if not dry_run:
        con.execute(
            "INSERT OR IGNORE INTO science_alias(alias_norm, alias, name_norm, source_id) VALUES(?,?,?,?)",
            (alias_norm, alias, name, source_id),
        )
    stats["promoted"] += 1
    stats[f"promoted_{bucket}"] = stats.get(f"promoted_{bucket}", 0) + 1


def from_leafly_master(con: sqlite3.Connection, *, dry_run: bool, stats: dict) -> None:
    for nn, summary_blob, in con.execute(
        "SELECT name_norm, summary_json FROM strain_canonical WHERE summary_json LIKE '%leafly_slug%'"
    ):
        try:
            summary = json.loads(summary_blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(summary, dict):
            continue
        slug = summary.get("leafly_slug") or summary.get("slug")
        if not isinstance(slug, str) or not slug.strip():
            continue
        alias = _slug_to_alias(slug)
        alias_n = name_norm(alias.replace("-", " "))
        # keep hyphenated slug form as alias_norm too when distinct
        _try_insert(
            con,
            alias=alias,
            alias_norm=name_norm(alias),
            name=nn,
            source_id="leafly_slug_alias",
            dry_run=dry_run,
            stats=stats,
            bucket="leafly_slug",
        )
        if alias_n != name_norm(alias):
            _try_insert(
                con,
                alias=alias.replace("-", " "),
                alias_norm=alias_n,
                name=nn,
                source_id="leafly_slug_alias",
                dry_run=dry_run,
                stats=stats,
                bucket="leafly_slug_spaced",
            )


def from_seedfinder_variants(con: sqlite3.Connection, *, dry_run: bool, stats: dict) -> None:
    for nn, props_blob in con.execute(
        "SELECT name_norm, props_json FROM strain_variant "
        "WHERE props_json LIKE '%strain_slug%' AND name_norm IS NOT NULL"
    ):
        try:
            props = json.loads(props_blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(props, dict):
            continue
        slug = props.get("strain_slug")
        breeder = props.get("breeder_slug")
        if not isinstance(slug, str) or not slug.strip():
            continue
        alias = _slug_to_alias(slug)
        _try_insert(
            con,
            alias=alias,
            alias_norm=name_norm(alias),
            name=nn,
            source_id="seedfinder_strain_slug",
            dry_run=dry_run,
            stats=stats,
            bucket="sf_strain_slug",
        )
        if isinstance(breeder, str) and breeder.strip():
            compound = f"{_slug_to_alias(breeder)}/{alias}"
            _try_insert(
                con,
                alias=compound,
                alias_norm=name_norm(compound),
                name=nn,
                source_id="seedfinder_breeder_strain_slug",
                dry_run=dry_run,
                stats=stats,
                bucket="sf_breeder_strain",
            )


def from_variant_skus(con: sqlite3.Connection, *, dry_run: bool, stats: dict) -> None:
    # Collect SKU → set(name_norm); only promote unique.
    sku_map: dict[str, set[str]] = {}
    for nn, props_blob in con.execute(
        "SELECT name_norm, props_json FROM strain_variant "
        "WHERE name_norm IS NOT NULL AND ("
        "props_json LIKE '%\"sku\"%' OR props_json LIKE '%external_id%' OR props_json LIKE '%product_id%')"
    ):
        try:
            props = json.loads(props_blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(props, dict):
            continue
        for key in ("sku", "external_id", "product_id", "productId"):
            val = props.get(key)
            if val in (None, ""):
                continue
            sku = str(val).strip()
            if len(sku) < 3 or len(sku) > 64:
                continue
            sku_map.setdefault(name_norm(sku), set()).add(nn)
    for alias_n, names in sku_map.items():
        if len(names) != 1:
            stats["skipped_collision"] += 1
            stats["collision_sku"] = stats.get("collision_sku", 0) + 1
            continue
        nn = next(iter(names))
        _try_insert(
            con,
            alias=alias_n,
            alias_norm=alias_n,
            name=nn,
            source_id="retail_sku_alias",
            dry_run=dry_run,
            stats=stats,
            bucket="sku",
        )


def from_openthc_staging(
    con: sqlite3.Connection, staging_dir: Path, *, dry_run: bool, stats: dict
) -> None:
    path = staging_dir / "openthc.sqlite3"
    if not path.exists():
        stats["openthc_missing"] = 1
        return
    try:
        src = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    except sqlite3.Error:
        return
    canonical = {r[0] for r in con.execute("SELECT name_norm FROM strain_canonical")}
    try:
        rows = src.execute("SELECT name_norm, payload_json FROM raw_record")
    except sqlite3.Error:
        src.close()
        return
    for nn_raw, blob in rows:
        key = name_norm(nn_raw or "")
        if not key or key not in canonical:
            stats["openthc_no_canonical"] = stats.get("openthc_no_canonical", 0) + 1
            continue
        try:
            payload = json.loads(blob or "{}")
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        stub = payload.get("stub")
        oid = payload.get("id")
        if isinstance(stub, str) and stub.strip():
            alias = _slug_to_alias(stub)
            _try_insert(
                con,
                alias=alias,
                alias_norm=name_norm(alias),
                name=key,
                source_id="openthc_stub",
                dry_run=dry_run,
                stats=stats,
                bucket="openthc_stub",
            )
        if isinstance(oid, str) and len(oid) >= 8:
            _try_insert(
                con,
                alias=oid,
                alias_norm=name_norm(oid),
                name=key,
                source_id="openthc_ulid",
                dry_run=dry_run,
                stats=stats,
                bucket="openthc_ulid",
            )
    src.close()


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument("--staging-dir", type=Path, default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    con = connect(args.db)
    before = con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0]
    stats = {
        "promoted": 0,
        "already": 0,
        "skipped_collision": 0,
    }
    from_leafly_master(con, dry_run=args.dry_run, stats=stats)
    from_seedfinder_variants(con, dry_run=args.dry_run, stats=stats)
    from_variant_skus(con, dry_run=args.dry_run, stats=stats)
    if args.staging_dir and args.staging_dir.exists():
        from_openthc_staging(con, args.staging_dir, dry_run=args.dry_run, stats=stats)
    if not args.dry_run:
        con.commit()
    after = con.execute("SELECT COUNT(*) FROM science_alias").fetchone()[0]
    con.close()
    print(
        json.dumps(
            {
                "science_alias_before": before,
                "science_alias_after": after,
                "promoted": stats["promoted"],
                "already": stats["already"],
                "skipped_collision": stats["skipped_collision"],
                "detail": {
                    k: v
                    for k, v in stats.items()
                    if k.startswith("promoted_") or k.startswith("collision_") or k.startswith("openthc")
                },
                "dry_run": args.dry_run,
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
