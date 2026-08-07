#!/usr/bin/env python3
"""Ingest local catalog dumps (schema v2) into the research SQLite corpus."""

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
    upsert_canonical,
)
from brain.dsc_brain.paths import DATA_DIR, DEFAULT_DB  # noqa: E402

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


def ingest_strains(conn, path: Path) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    n = 0
    for row in doc.get("items") or doc.get("strains") or doc.get("seeds") or []:
        if not isinstance(row, dict):
            continue
        if ingest_strain_row(conn, row, source_id=sid):
            n += 1
    return n


def ingest_lab(conn, path: Path) -> int:
    doc = _load(path)
    sid, url, redist, lic = _source_meta(path, doc)
    ensure_source(conn, sid, sid, url=url or None, license=lic, redistributable=redist)
    n = 0
    for row in doc.get("items") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        chem = row.get("chemistry") if isinstance(row.get("chemistry"), dict) else row
        cid = add_chemistry(conn, name, chem if isinstance(chem, dict) else {"raw": chem}, source_id=sid)
        key = name_norm(name)
        # Ensure parent shell exists for linking even without seed row yet
        if key:
            upsert_canonical(conn, name)
            add_link(conn, "chemistry_profile", cid, "strain_canonical", key, source=sid)
        # Full evidence stays in chemistry_profile.payload_json (avoid attribute_kv explosion).
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
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--reset", action="store_true", help="Delete DB first")
    ap.add_argument("--link", action="store_true", default=True)
    ap.add_argument("--no-link", action="store_false", dest="link")
    args = ap.parse_args()

    if args.reset and args.db.exists():
        args.db.unlink()
    init_corpus(args.db)
    conn = connect(args.db)

    summary: dict[str, int] = {}

    def run(globs, fn, label):
        total = 0
        for pattern in globs:
            for path in sorted(DATA_DIR.glob(pattern)):
                if "checkpoint" in path.name or "merged" in path.name:
                    continue
                try:
                    n = fn(conn, path)
                    total += n
                    conn.commit()
                    print(f"  {label}: {path.name} ok n={n}")
                except Exception as exc:  # noqa: BLE001
                    conn.rollback()
                    print(f"  {label}: {path.name} FAIL {exc}")
        summary[label] = total

    print("Ingesting corpus dumps…")
    run(STRAIN_GLOBS, ingest_strains, "strains")
    run(LAB_GLOBS, ingest_lab, "lab")
    run(LIGHT_GLOBS, ingest_lights, "lights")
    run(NUTE_GLOBS, ingest_nutrients, "nutrients")
    run(MEDIUM_GLOBS, ingest_mediums, "mediums")

    link_stats = {}
    if args.link:
        link_stats = link_science_to_seed(conn)
        print("science<->seed links:", link_stats)

    docs = rebuild_search_docs(conn)
    conn.commit()
    stats = corpus_stats(conn)
    conn.close()
    print(json.dumps({"ingested": summary, "links": link_stats, "search_docs": docs, "stats": stats}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
