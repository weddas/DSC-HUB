#!/usr/bin/env python3
"""Ingest local catalog dumps into staging and/or the master research corpus.

Preferred N-087 path (NAS has room for full staging payloads):
  1) python scripts/ingest_corpus_dumps.py --per-source-staging
     -> brain/data/staging/<family>.sqlite3 (typed + full raw_record)
  2) python scripts/merge_staging_to_master.py
     -> brain/data/dsc_brain.sqlite3 (matchable typed+chem+grow+links)
  3) python scripts/build_catalog_search_indexes.py
     -> HA browse indexes from master

Direct --db still works for small/debug ingests. Prefer staging for waves.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import (  # noqa: E402
    add_chemistry,
    add_gap,
    add_link,
    connect,
    corpus_stats,
    ensure_source,
    ingest_strain_row,
    init_corpus,
    link_science_to_seed,
    name_norm,
    rebuild_search_docs,
    store_attributes,
    store_raw_record,
    upsert_canonical,
)
from brain.dsc_brain.paths import DATA_DIR, DEFAULT_DB, STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import (  # noqa: E402
    resolve_source_family,
    write_dump_to_staging,
)

STRAIN_GLOBS = [
    "dsc_strains_*.json",
]
LAB_GLOBS = [
    "dsc_lab_*.json",
]
LIGHT_GLOBS = ["dsc_lights_*.json"]
NUTE_GLOBS = ["dsc_nutrients_*.json"]
MEDIUM_GLOBS = ["dsc_mediums_*.json"]


def _load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _source_meta(path: Path, doc: dict) -> tuple[str, str, bool, str | None]:
    sid = str(doc.get("source") or path.stem)
    license_ = doc.get("license")
    redist = bool(doc.get("redistributable", False))
    # Bank HTML scrapes default research-only
    if re.search(r"herbies|royal.?queen|seed.?supreme|seedsman|ilgm|crop.?king|seedfinder", sid, re.I):
        redist = False
    return sid, str(doc.get("source_url") or ""), redist, license_


def ingest_strains(conn, path: Path, *, store_raw: bool = False) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    # Bulk dumps: typed columns + optional raw_record; never explode attribute_kv scores.
    bulk = any(
        x in path.name.lower()
        for x in (
            "openthc",
            "seedcity",
            "wikileaf",
            "leafly",
            "kushy",
            "pickle",
            "parquet",
            "lynch",
            "mj_simple",
            "project",
            "cannlytics",
            "cannabis_intelligence",
            "intelligence",
            "allbud",
            "hytiva",
        )
    )
    n = 0
    for row in doc.get("items") or doc.get("strains") or doc.get("seeds") or []:
        if not isinstance(row, dict):
            continue
        if ingest_strain_row(
            conn,
            row,
            source_id=sid,
            store_attrs=not bulk,
            store_raw=store_raw,
        ):
            n += 1
    return n


def ingest_lab(conn, path: Path, *, store_raw: bool = False) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    n = 0
    slim = True  # typed chem payload stays slim; full row goes to raw_record when store_raw
    for row in doc.get("items") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        chem = row.get("chemistry") if isinstance(row.get("chemistry"), dict) else None
        if not chem:
            chem = {
                k: row[k]
                for k in (
                    "thc_range",
                    "cbd_range",
                    "top_terpenes",
                    "terpene_values",
                    "chemotype",
                    "thc",
                    "cbd",
                )
                if row.get(k) not in (None, "", [], {})
            }
        if slim:
            payload = {
                "name": name,
                "chemistry": chem,
                "lab_name": row.get("lab_name") or row.get("Provider") or row.get("Database Name"),
                "sample_type": row.get("inventory_type") or row.get("Sample Type"),
                "test_id": row.get("test_id") or row.get("Test Result UID"),
                "date_test": row.get("date_test") or row.get("Post Time") or row.get("Test Time"),
                "source": row.get("source"),
            }
            payload = {k: v for k, v in payload.items() if v not in (None, "", [], {})}
            if chem:
                payload.update({k: chem[k] for k in chem})
            chem = payload
        cid = add_chemistry(conn, name, chem if isinstance(chem, dict) else {"raw": chem}, source_id=sid)
        key = name_norm(name)
        if key:
            upsert_canonical(conn, name)
            add_link(conn, "chemistry_profile", cid, "strain_canonical", key, source=sid)
        if store_raw:
            store_raw_record(
                conn,
                source_id=sid,
                entity_kind="chemistry_profile",
                entity_id=cid,
                name=name,
                payload=row,
            )
        n += 1
    return n


def ingest_lights(conn, path: Path) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    n = 0
    for row in doc.get("items") or doc.get("products") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        lid = str(row.get("id") or f"{sid}:{name_norm(name)}")
        conn.execute(
            "INSERT INTO light_fixture(id, name, brand, source_id, wattage_w, ppf_umol_s, efficacy_umol_j, payload_json) "
            "VALUES(?,?,?,?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json",
            (
                lid,
                name,
                row.get("brand"),
                sid,
                row.get("wattage_w"),
                row.get("ppf_umol_s"),
                row.get("efficacy_umol_j"),
                json.dumps(row, ensure_ascii=False),
            ),
        )
        store_attributes(conn, "light_fixture", lid, row, source_id=sid)
        if not row.get("ppfd_maps") and not row.get("ppfd_map_urls"):
            add_gap(conn, "light_fixture", lid, "ppfd_map", "no_ppfd_map_in_dump")
        n += 1
    return n


def ingest_nutrients(conn, path: Path) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    n = 0
    for row in doc.get("items") or doc.get("products") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        nid = str(row.get("id") or f"{sid}:{name_norm(name)}")
        conn.execute(
            "INSERT INTO nutrient_product(id, name, brand, category, source_id, dose_ml_l, stage, npk, payload_json) "
            "VALUES(?,?,?,?,?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json",
            (
                nid,
                name,
                row.get("brand"),
                row.get("category"),
                sid,
                row.get("dose_ml_l"),
                str(row.get("stage") or "") or None,
                row.get("npk"),
                json.dumps(row, ensure_ascii=False),
            ),
        )
        store_attributes(conn, "nutrient_product", nid, row, source_id=sid)
        n += 1
    return n


def ingest_mediums(conn, path: Path) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    n = 0
    for row in doc.get("items") or doc.get("products") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        mid = str(row.get("id") or f"{sid}:{name_norm(name)}")
        conn.execute(
            "INSERT INTO medium_product(id, name, brand, category, source_id, composition, payload_json) "
            "VALUES(?,?,?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json",
            (
                mid,
                name,
                row.get("brand"),
                row.get("category"),
                sid,
                json.dumps(row.get("composition"), ensure_ascii=False)
                if isinstance(row.get("composition"), (dict, list))
                else row.get("composition"),
                json.dumps(row, ensure_ascii=False),
            ),
        )
        store_attributes(conn, "medium_product", mid, row, source_id=sid)
        n += 1
    return n


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, default=DEFAULT_DB, help="Target DB (master or single staging)")
    ap.add_argument(
        "--staging-db",
        type=Path,
        default=None,
        help="Write this ingest into one staging SQLite (implies full raw_record)",
    )
    ap.add_argument(
        "--source-id",
        type=str,
        default=None,
        help="Override source id / staging family hint (with --staging-db or --per-source-staging)",
    )
    ap.add_argument(
        "--per-source-staging",
        action="store_true",
        help="Route each dump into brain/data/staging/<family>.sqlite3 with FULL raw_record",
    )
    ap.add_argument(
        "--staging-dir",
        type=Path,
        default=STAGING_DIR,
        help="Directory for --per-source-staging files",
    )
    ap.add_argument(
        "--store-raw",
        action="store_true",
        help="Also store full raw_record when writing directly to --db (default on for staging)",
    )
    ap.add_argument("--reset", action="store_true", help="Delete target DB first (never use on master casually)")
    ap.add_argument("--link", action="store_true", default=True)
    ap.add_argument("--no-link", action="store_false", dest="link")
    ap.add_argument(
        "--only",
        action="append",
        default=[],
        help="Substring filter on dump filenames (repeatable). Example: --only leafly --only replication",
    )
    args = ap.parse_args()

    filters = [f.lower() for f in (args.only or [])]

    def allowed(path: Path) -> bool:
        if "checkpoint" in path.name or "merged" in path.name:
            return False
        # Skip known non-useful / duplicate mega dumps unless explicitly requested
        skip_default = {
            "dsc_strains_parquet_train.json",  # image/label shard, not strain chem
            "dsc_lab_replication.json",  # 215k raw; prefer dsc_lab_replication_wa.json
            "dsc_lab_dolthub_wa_pointer.json",  # pointer only
        }
        if not filters and path.name.lower() in skip_default:
            print(f"  skip default: {path.name}")
            return False
        if not filters:
            return True
        name = path.name.lower()
        return any(f in name for f in filters)

    dump_paths: list[Path] = []
    for pattern in STRAIN_GLOBS + LAB_GLOBS + LIGHT_GLOBS + NUTE_GLOBS + MEDIUM_GLOBS:
        for path in sorted(DATA_DIR.glob(pattern)):
            if allowed(path):
                dump_paths.append(path)

    # --- Preferred path: per-source staging (full payloads) ---
    if args.per_source_staging:
        print(f"Per-source staging into {args.staging_dir} (full raw_record)...")
        summary: dict[str, int] = {}
        results = []
        for path in dump_paths:
            try:
                sid = args.source_id
                if not sid:
                    peek = _load(path)
                    sid = str(peek.get("source") or path.stem)
                family = resolve_source_family(sid, path)
                result = write_dump_to_staging(
                    path,
                    source_id=sid,
                    staging_dir=args.staging_dir,
                    reset=False,
                )
                results.append(result)
                summary[family] = summary.get(family, 0) + int(result.get("count") or 0)
                print(
                    f"  staging: {path.name} -> {family}.sqlite3 "
                    f"n={result.get('count')} kind={result.get('kind')}"
                )
            except Exception as exc:  # noqa: BLE001
                print(f"  staging: {path.name} FAIL {exc}")
                results.append({"path": str(path), "error": str(exc)})
        print(
            json.dumps(
                {
                    "mode": "per_source_staging",
                    "staging_dir": str(args.staging_dir),
                    "by_family": summary,
                    "results": [
                        {k: r[k] for k in ("family", "staging_db", "count", "kind", "error") if k in r}
                        for r in results
                    ],
                    "next": "python scripts/merge_staging_to_master.py",
                },
                indent=2,
            )
        )
        return 0

    # --- Single staging DB or direct master/debug DB ---
    target = args.staging_db or args.db
    store_raw = bool(args.store_raw or args.staging_db)
    if args.reset and target.exists():
        target.unlink()
    init_corpus(target)
    conn = connect(target)

    if args.source_id:
        ensure_source(conn, args.source_id, args.source_id, note="cli --source-id")

    summary_counts: dict[str, int] = {}

    def run(globs, fn, label):
        total = 0
        for pattern in globs:
            for path in sorted(DATA_DIR.glob(pattern)):
                if not allowed(path):
                    continue
                try:
                    n = fn(conn, path, store_raw=store_raw) if label in {"strains", "lab"} else fn(conn, path)
                    total += n
                    conn.commit()
                    print(f"  {label}: {path.name} ok n={n}")
                except Exception as exc:  # noqa: BLE001
                    conn.rollback()
                    print(f"  {label}: {path.name} FAIL {exc}")
        summary_counts[label] = total

    mode = "staging_db" if args.staging_db else "direct_db"
    print(f"Ingesting corpus dumps into {target} (mode={mode}, store_raw={store_raw})...")
    run(STRAIN_GLOBS, ingest_strains, "strains")
    run(LAB_GLOBS, ingest_lab, "lab")
    run(LIGHT_GLOBS, ingest_lights, "lights")
    run(NUTE_GLOBS, ingest_nutrients, "nutrients")
    run(MEDIUM_GLOBS, ingest_mediums, "mediums")

    link_stats = {}
    # Linking is for master; skip by default on single-source staging unless requested.
    do_link = args.link and not args.staging_db
    if args.staging_db and args.link:
        do_link = True
    if do_link:
        link_stats = link_science_to_seed(conn)
        print("science<->seed links:", link_stats)

    docs = rebuild_search_docs(conn)
    conn.commit()
    stats = corpus_stats(conn)
    conn.close()
    print(
        json.dumps(
            {
                "mode": mode,
                "db": str(target),
                "ingested": summary_counts,
                "links": link_stats,
                "search_docs": docs,
                "stats": stats,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
