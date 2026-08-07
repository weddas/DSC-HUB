"""N-087 per-source staging SQLite helpers.

Architecture:
  Wave/source importers write typed projections + FULL source payloads into
  `brain/data/staging/<family>.sqlite3` via `raw_record` (multi-GB OK on lab NAS
  with >1 TB free). Never explode Leafly-style score columns into attribute_kv.

  Master (`brain/data/dsc_brain.sqlite3`) receives matched typed projections
  (canonical + variant + chem + grow + entity_link + slim payload_json) via
  `scripts/merge_staging_to_master.py`. Merge does not wipe master; raw_record
  stays in staging by default (--include-raw opt-in).

Fat JSON/CSV dumps also remain under `homeassistant/data/` and `Projects/DB DUMP`
(gitignored). Staging SQLite is the durable per-source archive so we never lose
source info again (attribute_kv NAS blow-up lesson).
"""

from __future__ import annotations

import json
import re
import sqlite3
import time
from pathlib import Path
from typing import Any, Callable

from .corpus import (
    add_chemistry,
    add_gap,
    add_link,
    connect,
    corpus_stats,
    ensure_source,
    ingest_strain_row,
    init_corpus,
    name_norm,
    store_attributes,
    store_raw_record,
    upsert_canonical,
)
from .paths import STAGING_DIR, sanitize_source_slug, staging_db_path

# Map dump stem / source id fragments -> stable staging family filename stem.
SOURCE_FAMILY_MAP: dict[str, str] = {
    "seedcity": "seedcity",
    "seedcity_local": "seedcity",
    "openthc": "openthc",
    "wikileaf": "wikileaf",
    "leafly": "leafly_flat",
    "leafly_flat": "leafly_flat",
    "leafly_flat_enrich": "leafly_flat_enrich",
    "leafly_features": "leafly_features",
    "leafly_github": "leafly_flat",
    "kushy": "kushy",
    "lynch": "lynch_figshare",
    "lynch_figshare": "lynch_figshare",
    "replication": "replication_labs",
    "replication_lab": "replication_labs",
    "replication_wa": "replication_labs",
    "lab_replication": "replication_labs",
    "cannlytics": "cannlytics",
    "cannlytics_expand": "cannlytics_expand",
    "cannlytics_hf": "cannlytics",
    "maxvalue": "maxvalue_terpenes",
    "maxvalue_terpenes": "maxvalue_terpenes",
    "budprofiles": "budprofiles",
    "pickle": "pickle_archive",
    "pickle_archive": "pickle_archive",
    "mj_simple": "mj_simple",
    "project_lists": "project_lists",
    "herbies": "bank_herbies",
    "royal_queen": "bank_royal_queen",
    "rqs": "bank_royal_queen",
    "ilgm": "bank_ilgm",
    "seedsman": "seedsman",
    "bank_seedsman": "seedsman",
    "seed_supreme": "bank_seed_supreme",
    "seedsupreme": "bank_seed_supreme",
    "bank_seed_supreme": "bank_seed_supreme",
    "crop_king": "cropking",
    "cropking": "cropking",
    "bank_crop_king": "cropking",
    "seedfinder": "seedfinder",
    "bank_seedfinder": "seedfinder",
    "zamnesia": "bank_zamnesia",
    "hytiva": "hytiva",
    "bank_hytiva": "hytiva",
    "cannaconnection": "cannaconnection",
    "bank_cannaconnection": "cannaconnection",
    "multiverse": "bank_multiverse",
    "bank_multiverse": "bank_multiverse",
    "weedseedsexpress": "bank_weedseedsexpress",
    "weed_seeds_express": "bank_weedseedsexpress",
    "bank_weedseedsexpress": "bank_weedseedsexpress",
    "dcseed": "dcseedexchange",
    "dcseedexchange": "dcseedexchange",
    "dc_seed": "dcseedexchange",
    "bank_dcseedexchange": "dcseedexchange",
    "pacific": "bank_pacific",
    "pacificseedbank": "bank_pacific",
    "bank_pacific": "bank_pacific",
    "truenorth": "bank_truenorth",
    "true_north": "bank_truenorth",
    "bank_truenorth": "bank_truenorth",
    "fastbuds": "bank_fastbuds",
    "fast_buds": "bank_fastbuds",
    "bank_fastbuds": "bank_fastbuds",
    "barneys": "bank_barneys",
    "barneys_farm": "bank_barneys",
    "bank_barneys": "bank_barneys",
    "greenhouse": "bank_greenhouse",
    "green_house": "bank_greenhouse",
    "bank_greenhouse": "bank_greenhouse",
    "mephisto": "bank_mephisto",
    "mephisto_genetics": "bank_mephisto",
    "bank_mephisto": "bank_mephisto",
    "dna": "bank_dna",
    "dna_genetics": "bank_dna",
    "bank_dna": "bank_dna",
    "dutchpassion": "bank_dutchpassion",
    "dutch_passion": "bank_dutchpassion",
    "bank_dutchpassion": "bank_dutchpassion",
    # DB DUMP deep sources
    "cannabis_intelligence": "cannabis_intelligence",
    "intelligence_db": "intelligence_db",
    "northatlantic": "north_atlantic",
    "north_atlantic": "north_atlantic",
    "north_atlantic_local": "north_atlantic",
    "dsc_strains_northatlantic": "north_atlantic",
    "phytochem_smith": "phytochem_smith",
    "phytochemical_diversity": "phytochem_smith",
    "phytochem": "phytochem_lab",
    "phytochem_lab": "phytochem_lab",
    "cannia": "cannia",
    "strains_master": "strains_master",
    "medical_effects": "medical_effects",
    "kushy_crosses": "kushy_crosses_local",
    "kushy_crosses_local": "kushy_crosses_local",
    "parquet_train": "parquet_train_images",
    "parquet_train_images": "parquet_train_images",
    "session_adk": "session_adk",
    "allbud": "allbud",
    "alchimia": "alchimia",
    "bank_alchimia": "alchimia",
    "strain_database": "strain_database",
    "straindatabase": "strain_database",
    "dsc_strains_straindatabase": "strain_database",
    "forum_420mag": "forum_420mag",
    "420mag": "forum_420mag",
    "forum_phenohunter": "forum_phenohunter",
    "phenohunter": "forum_phenohunter",
    "forum_mjpassion": "forum_mjpassion",
    "mjpassion": "forum_mjpassion",
    "forum_rollitup": "forum_rollitup",
    "rollitup": "forum_rollitup",
    "forum_ozstoners": "forum_ozstoners",
    "ozstoners": "forum_ozstoners",
    "ma_ccc": "ma_ccc_labs",
    "ma_ccc_labs": "ma_ccc_labs",
    "ccc_testing": "ma_ccc_labs",
    "cannareviews": "cannareviews",
    "cannareviews_health": "cannareviews",
    # Wave C lights
    "spider_farmer": "lights_spider_farmer",
    "mars_hydro_au": "lights_mars_hydro_au",
    "mars_hydro": "lights_mars_hydro_au",
    "viparspectra": "lights_viparspectra",
    "treegers": "lights_treegers",
    "growkings": "lights_growkings",
    "vivosun": "lights_vivosun",
    "digi_lumen": "lights_digi_lumen",
    "digilumen": "lights_digi_lumen",
    "ppfd_maps": "ppfd_maps",
}


def resolve_source_family(source_id: str | None = None, path: Path | None = None) -> str:
    """Pick a stable staging DB family slug from source id and/or dump path."""
    hay = " ".join(
        x for x in ((source_id or ""), (path.name if path else ""), (path.stem if path else "")) if x
    ).lower()
    # Prefer longer / more specific keys first.
    for key in sorted(SOURCE_FAMILY_MAP.keys(), key=len, reverse=True):
        if key in hay.replace("-", "_") or key.replace("_", "") in hay.replace("-", "").replace("_", ""):
            return SOURCE_FAMILY_MAP[key]
    if source_id:
        return sanitize_source_slug(source_id)
    if path:
        return sanitize_source_slug(path.stem.replace("dsc_strains_", "").replace("dsc_lab_", ""))
    return "unknown"


def init_staging(
    source_id: str,
    *,
    staging_dir: Path | None = None,
    note: str | None = None,
) -> Path:
    """Create/open a per-source staging DB and stamp meta."""
    family = resolve_source_family(source_id)
    path = staging_db_path(family, staging_dir=staging_dir)
    path.parent.mkdir(parents=True, exist_ok=True)
    init_corpus(path)
    conn = connect(path)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    for key, value in (
        ("staging_source_family", family),
        ("staging_source_id", source_id),
        ("staging_role", "staging"),
        ("staging_updated_at", now),
    ):
        conn.execute(
            "INSERT INTO meta(key, value) VALUES(?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            (key, value),
        )
    if note:
        conn.execute(
            "INSERT INTO meta(key, value) VALUES(?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            ("staging_note", note),
        )
    conn.commit()
    conn.close()
    return path


def connect_staging(source_id: str, *, staging_dir: Path | None = None) -> sqlite3.Connection:
    path = init_staging(source_id, staging_dir=staging_dir)
    return connect(path)


def list_staging_dbs(staging_dir: Path | None = None) -> list[Path]:
    root = staging_dir or STAGING_DIR
    if not root.is_dir():
        return []
    return sorted(p for p in root.glob("*.sqlite3") if p.is_file())


def _is_bulk_dump(path: Path, source_id: str) -> bool:
    hay = f"{path.name} {source_id}".lower()
    markers = (
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
        "replication",
        "maxvalue",
        "cannabis_intelligence",
        "intelligence",
        "northatlantic",
        "north_atlantic",
        "allbud",
        "hytiva",
        "cannaconnection",
        "multiverse",
        "weedseedsexpress",
        "weed_seeds",
        "dcseed",
        "cropking",
        "crop_king",
        "seedsman",
        "strain_database",
        "straindatabase",
        "bank_",
    )
    return any(m in hay for m in markers)


def ingest_json_dump_to_conn(
    conn: sqlite3.Connection,
    path: Path,
    *,
    source_id: str | None = None,
    store_raw: bool | None = None,
) -> dict[str, Any]:
    """Ingest one catalog JSON dump into an open corpus connection (staging or master)."""
    doc = json.loads(path.read_text(encoding="utf-8"))
    sid = str(source_id or doc.get("source") or path.stem)
    license_ = doc.get("license")
    redist = bool(doc.get("redistributable", False))
    if re.search(
        r"herbies|royal.?queen|seed.?supreme|seedsman|ilgm|crop.?king|cropking|"
        r"seedfinder|multiverse|weedseeds?express|dcseed|zamnesia|alchimia|"
        r"pacific|truenorth|true.?north|fastbuds|barneys|greenhouse|mephisto|"
        r"dutchpassion|dutch.?passion|\bdna\b|bank_",
        sid,
        re.I,
    ):
        redist = False
    ensure_source(
        conn,
        sid,
        sid,
        url=str(doc.get("source_url") or "") or None,
        license=license_,
        redistributable=redist,
        note=f"staging ingest from {path.name}",
    )
    bulk = _is_bulk_dump(path, sid)
    # Staging default: always keep FULL row payloads in raw_record (NAS has room).
    # attribute_kv stays off for bulk dumps (score-column blow-up).
    use_raw = True if store_raw is None else store_raw
    kind = str(doc.get("kind") or "").lower()
    name_l = path.name.lower()
    n = 0

    if "lab" in name_l or kind in {"lab", "chemistry", "labs"}:
        n = _ingest_lab_rows(conn, doc, sid, store_raw=use_raw)
        label = "lab"
    elif "light" in name_l or kind == "lights":
        n = _ingest_product_rows(conn, doc, sid, table="light", store_raw=use_raw)
        label = "lights"
    elif "nutrient" in name_l or kind == "nutrients":
        n = _ingest_product_rows(conn, doc, sid, table="nutrient", store_raw=use_raw)
        label = "nutrients"
    elif "medium" in name_l or kind == "mediums":
        n = _ingest_product_rows(conn, doc, sid, table="medium", store_raw=use_raw)
        label = "mediums"
    else:
        for row in doc.get("items") or doc.get("strains") or doc.get("seeds") or []:
            if not isinstance(row, dict):
                continue
            if ingest_strain_row(
                conn,
                row,
                source_id=sid,
                store_attrs=not bulk,
                store_raw=use_raw,
            ):
                n += 1
        label = "strains"

    return {"source_id": sid, "kind": label, "count": n, "bulk": bulk, "store_raw": use_raw}


def _ingest_lab_rows(
    conn: sqlite3.Connection,
    doc: dict,
    sid: str,
    *,
    store_raw: bool,
) -> int:
    n = 0
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
        # Full COA / lab row in payload_json (NAS has room). Typed chem keys
        # overlaid for add_chemistry. Never explode pesticide columns to attribute_kv.
        payload = {k: v for k, v in row.items() if v not in (None, "", [], {})}
        if chem:
            payload["chemistry"] = chem
            payload.update({k: chem[k] for k in chem})
        cid = add_chemistry(
            conn,
            name,
            payload if isinstance(payload, dict) else {"raw": payload},
            source_id=sid,
        )
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


def _ingest_product_rows(
    conn: sqlite3.Connection,
    doc: dict,
    sid: str,
    *,
    table: str,
    store_raw: bool = True,
) -> int:
    n = 0
    for row in doc.get("items") or doc.get("products") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        pid = str(row.get("id") or f"{sid}:{name_norm(name)}")
        if table == "light":
            conn.execute(
                "INSERT INTO light_fixture(id, name, brand, source_id, wattage_w, ppf_umol_s, "
                "efficacy_umol_j, payload_json) VALUES(?,?,?,?,?,?,?,?) "
                "ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json",
                (
                    pid,
                    name,
                    row.get("brand"),
                    sid,
                    row.get("wattage_w"),
                    row.get("ppf_umol_s"),
                    row.get("efficacy_umol_j"),
                    json.dumps(row, ensure_ascii=False),
                ),
            )
            # Product packs are small; attrs OK. Still store full raw when requested.
            store_attributes(conn, "light_fixture", pid, row, source_id=sid)
            if not row.get("ppfd_maps") and not row.get("ppfd_map_urls"):
                add_gap(conn, "light_fixture", pid, "ppfd_map", "no_ppfd_map_in_dump")
            entity_kind = "light_fixture"
        elif table == "nutrient":
            conn.execute(
                "INSERT INTO nutrient_product(id, name, brand, category, source_id, dose_ml_l, "
                "stage, npk, payload_json) VALUES(?,?,?,?,?,?,?,?,?) "
                "ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json",
                (
                    pid,
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
            store_attributes(conn, "nutrient_product", pid, row, source_id=sid)
            entity_kind = "nutrient_product"
        else:
            conn.execute(
                "INSERT INTO medium_product(id, name, brand, category, source_id, composition, "
                "payload_json) VALUES(?,?,?,?,?,?,?) "
                "ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json",
                (
                    pid,
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
            store_attributes(conn, "medium_product", pid, row, source_id=sid)
            entity_kind = "medium_product"
        if store_raw:
            store_raw_record(
                conn,
                source_id=sid,
                entity_kind=entity_kind,
                entity_id=pid,
                name=name,
                payload=row,
            )
        n += 1
    return n


def write_dump_to_staging(
    path: Path,
    *,
    source_id: str | None = None,
    staging_dir: Path | None = None,
    reset: bool = False,
) -> dict[str, Any]:
    """Route one JSON dump into its per-source staging SQLite."""
    doc_source = None
    try:
        peek = json.loads(path.read_text(encoding="utf-8"))
        doc_source = peek.get("source") if isinstance(peek, dict) else None
    except (OSError, json.JSONDecodeError):
        peek = {}
    sid = str(source_id or doc_source or path.stem)
    family = resolve_source_family(sid, path)
    db_path = staging_db_path(family, staging_dir=staging_dir)
    if reset and db_path.exists():
        db_path.unlink()
    init_staging(sid, staging_dir=staging_dir, note=f"from {path.name}")
    conn = connect(db_path)
    try:
        result = ingest_json_dump_to_conn(conn, path, source_id=sid)
        conn.commit()
        stats = corpus_stats(conn)
    finally:
        conn.close()
    result["family"] = family
    result["staging_db"] = str(db_path)
    result["stats"] = stats
    return result


def write_dumps_to_staging(
    paths: list[Path],
    *,
    staging_dir: Path | None = None,
    on_each: Callable[[dict[str, Any]], None] | None = None,
) -> list[dict[str, Any]]:
    """Ingest many dumps; each source family gets its own staging file (additive)."""
    out: list[dict[str, Any]] = []
    for path in paths:
        if not path or not Path(path).is_file():
            continue
        try:
            result = write_dump_to_staging(Path(path), staging_dir=staging_dir, reset=False)
            out.append(result)
            if on_each:
                on_each(result)
            print(
                f"  staging: {path.name} -> {result['family']}.sqlite3 "
                f"n={result['count']} kind={result['kind']}"
            )
        except Exception as exc:  # noqa: BLE001
            err = {"path": str(path), "error": str(exc)}
            out.append(err)
            print(f"  staging: {path.name} FAIL {exc}")
    return out
