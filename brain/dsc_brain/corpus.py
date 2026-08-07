"""N-087 research corpus helpers: upserts, attribute overflow, links."""

from __future__ import annotations

import json
import re
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Any

from .corpus_schema import CORPUS_SCHEMA, SCHEMA_VERSION
from .paths import DEFAULT_DB

KNOWN_CANONICAL = {
    "name",
    "name_norm",
    "type",
    "breeder",
    "id",
    "source",
    "sources",
    "bank_props",
    "chemistry",
    "thc_range",
    "cbd_range",
    "top_terpenes",
    "height_cm",
    "flowering_days",
    "curated",
    "want",
}


def name_norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(CORPUS_SCHEMA)
    return conn


def init_corpus(db_path: Path | None = None) -> Path:
    path = db_path or DEFAULT_DB
    conn = connect(path)
    conn.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        ("corpus_schema_version", SCHEMA_VERSION),
    )
    conn.commit()
    conn.close()
    return path


def ensure_source(
    conn: sqlite3.Connection,
    source_id: str,
    name: str,
    *,
    url: str | None = None,
    license: str | None = None,
    redistributable: bool = False,
    note: str | None = None,
) -> None:
    conn.execute(
        "INSERT INTO source_record(id, name, url, license, redistributable, fetched_at, note) "
        "VALUES(?,?,?,?,?,?,?) "
        "ON CONFLICT(id) DO UPDATE SET "
        "name=excluded.name, url=COALESCE(excluded.url, source_record.url), "
        "license=COALESCE(excluded.license, source_record.license), "
        "fetched_at=excluded.fetched_at, note=COALESCE(excluded.note, source_record.note)",
        (
            source_id,
            name,
            url,
            license,
            1 if redistributable else 0,
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            note,
        ),
    )


def _note_extension(conn: sqlite3.Connection, entity_kind: str, key: str) -> None:
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    row = conn.execute(
        "SELECT hit_count FROM schema_extension_log WHERE key=?", (f"{entity_kind}:{key}",)
    ).fetchone()
    if row:
        conn.execute(
            "UPDATE schema_extension_log SET hit_count=hit_count+1, last_seen_at=? WHERE key=?",
            (now, f"{entity_kind}:{key}"),
        )
    else:
        conn.execute(
            "INSERT INTO schema_extension_log(key, entity_kind, hit_count, suggested_table, status, first_seen_at, last_seen_at) "
            "VALUES(?,?,?,?,?,?,?)",
            (f"{entity_kind}:{key}", entity_kind, 1, "attribute_kv", "seen", now, now),
        )


def store_attributes(
    conn: sqlite3.Connection,
    entity_kind: str,
    entity_id: str,
    row: dict[str, Any],
    *,
    known: set[str] | None = None,
    source_id: str | None = None,
) -> int:
    """Persist unmapped keys into attribute_kv. Returns count stored."""
    skip = known or KNOWN_CANONICAL
    n = 0
    for key, value in row.items():
        if key in skip or value in (None, "", [], {}):
            continue
        if isinstance(value, (dict, list)):
            text = json.dumps(value, ensure_ascii=False)
        else:
            text = str(value)
        conn.execute(
            "INSERT INTO attribute_kv(entity_kind, entity_id, key, value, unit, source_id) "
            "VALUES(?,?,?,?,?,?)",
            (entity_kind, entity_id, key, text, None, source_id),
        )
        _note_extension(conn, entity_kind, key)
        n += 1
    return n


def upsert_canonical(
    conn: sqlite3.Connection,
    name: str,
    *,
    type_: str | None = None,
    summary: dict | None = None,
    curated: bool = False,
) -> str:
    key = name_norm(name)
    if not key:
        raise ValueError("empty name")
    existing = conn.execute(
        "SELECT summary_json FROM strain_canonical WHERE name_norm=?", (key,)
    ).fetchone()
    merged = {}
    if existing:
        try:
            merged = json.loads(existing["summary_json"] or "{}")
        except json.JSONDecodeError:
            merged = {}
    if summary:
        for k, v in summary.items():
            if v in (None, "", [], {}):
                continue
            if k not in merged or merged[k] in (None, "", [], {}):
                merged[k] = v
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    conn.execute(
        "INSERT INTO strain_canonical(name_norm, name, type, summary_json, curated, updated_at) "
        "VALUES(?,?,?,?,?,?) "
        "ON CONFLICT(name_norm) DO UPDATE SET "
        "name=excluded.name, "
        "type=COALESCE(excluded.type, strain_canonical.type), "
        "summary_json=excluded.summary_json, "
        "curated=MAX(strain_canonical.curated, excluded.curated), "
        "updated_at=excluded.updated_at",
        (key, name, type_, json.dumps(merged, ensure_ascii=False), 1 if curated else 0, now),
    )
    return key


def upsert_variant(
    conn: sqlite3.Connection,
    name: str,
    breeder: str,
    *,
    source_id: str | None = None,
    bank_url: str | None = None,
    props: dict | None = None,
) -> str:
    key = name_norm(name)
    upsert_canonical(conn, name)
    breeder_s = (breeder or "Generic").strip()
    vid = f"{key}::{name_norm(breeder_s)}"
    conn.execute(
        "INSERT INTO strain_variant(id, name_norm, name, breeder, source_id, bank_url, props_json) "
        "VALUES(?,?,?,?,?,?,?) "
        "ON CONFLICT(id) DO UPDATE SET "
        "props_json=excluded.props_json, bank_url=COALESCE(excluded.bank_url, strain_variant.bank_url), "
        "source_id=COALESCE(excluded.source_id, strain_variant.source_id)",
        (
            vid,
            key,
            name,
            breeder_s,
            source_id,
            bank_url,
            json.dumps(props or {}, ensure_ascii=False),
        ),
    )
    return vid


def add_chemistry(
    conn: sqlite3.Connection,
    name: str,
    payload: dict[str, Any],
    *,
    source_id: str | None = None,
) -> str:
    key = name_norm(name)
    cid = str(uuid.uuid4())
    thc = payload.get("thc_range") or payload.get("thc")
    cbd = payload.get("cbd_range") or payload.get("cbd")
    thc_min = thc_max = cbd_min = cbd_max = None
    if isinstance(thc, (list, tuple)) and len(thc) >= 2:
        try:
            thc_min, thc_max = float(thc[0]), float(thc[1])
        except (TypeError, ValueError):
            pass
    if isinstance(cbd, (list, tuple)) and len(cbd) >= 2:
        try:
            cbd_min, cbd_max = float(cbd[0]), float(cbd[1])
        except (TypeError, ValueError):
            pass
    tops = payload.get("top_terpenes") or payload.get("terpenes")
    conn.execute(
        "INSERT INTO chemistry_profile(id, name_norm, name, source_id, thc_min, thc_max, cbd_min, cbd_max, top_terpenes_json, payload_json) "
        "VALUES(?,?,?,?,?,?,?,?,?,?)",
        (
            cid,
            key or None,
            name,
            source_id,
            thc_min,
            thc_max,
            cbd_min,
            cbd_max,
            json.dumps(tops, ensure_ascii=False) if tops is not None else None,
            json.dumps(payload, ensure_ascii=False),
        ),
    )
    return cid


def add_grow(
    conn: sqlite3.Connection,
    name: str,
    payload: dict[str, Any],
    *,
    source_id: str | None = None,
) -> str:
    key = name_norm(name)
    upsert_canonical(conn, name)
    gid = str(uuid.uuid4())

    def _pair(val: Any) -> tuple[float | None, float | None]:
        if isinstance(val, (list, tuple)) and len(val) >= 2:
            try:
                return float(val[0]), float(val[1])
            except (TypeError, ValueError):
                return None, None
        if isinstance(val, (int, float)):
            return float(val), float(val)
        return None, None

    h0, h1 = _pair(payload.get("height_cm") or payload.get("height"))
    f0, f1 = _pair(payload.get("flowering_days") or payload.get("flowering"))
    conn.execute(
        "INSERT INTO grow_trait(id, name_norm, source_id, height_cm_min, height_cm_max, "
        "flowering_days_min, flowering_days_max, yield_indoor, yield_outdoor, climate, payload_json) "
        "VALUES(?,?,?,?,?,?,?,?,?,?,?)",
        (
            gid,
            key,
            source_id,
            h0,
            h1,
            f0,
            f1,
            payload.get("yield_indoor"),
            payload.get("yield_outdoor"),
            payload.get("climate"),
            json.dumps(payload, ensure_ascii=False),
        ),
    )
    return gid


def add_link(
    conn: sqlite3.Connection,
    from_kind: str,
    from_id: str,
    to_kind: str,
    to_id: str,
    *,
    method: str = "exact_name_norm",
    confidence: float = 1.0,
    source: str | None = None,
) -> str:
    lid = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO entity_link(id, from_kind, from_id, to_kind, to_id, method, confidence, source) "
        "VALUES(?,?,?,?,?,?,?,?)",
        (lid, from_kind, from_id, to_kind, to_id, method, confidence, source),
    )
    return lid


def add_gap(
    conn: sqlite3.Connection,
    entity_kind: str,
    entity_id: str,
    field: str,
    reason: str,
) -> None:
    conn.execute(
        "INSERT INTO followup_gap(entity_kind, entity_id, field, reason, created_at) VALUES(?,?,?,?,?)",
        (
            entity_kind,
            entity_id,
            field,
            reason,
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        ),
    )


def ingest_strain_row(
    conn: sqlite3.Connection,
    row: dict[str, Any],
    *,
    source_id: str,
) -> str | None:
    """Parent/child upsert + overflow attrs. Returns name_norm."""
    name = str(row.get("name") or row.get("strain") or "").strip()
    if not name:
        return None
    key = upsert_canonical(
        conn,
        name,
        type_=str(row.get("type") or row.get("indica_sativa") or "") or None,
        summary={
            k: row[k]
            for k in ("thc", "cbd", "lineage", "genetic_background", "effect", "flavor")
            if row.get(k) not in (None, "", [], {})
        },
    )
    breeder = str(row.get("breeder") or row.get("brand") or row.get("seed_bank") or "").strip()
    if breeder and name_norm(breeder) not in {"", "generic", "unknown", "n a", "na"}:
        vid = upsert_variant(
            conn,
            name,
            breeder,
            source_id=source_id,
            bank_url=row.get("url") or row.get("bank_url"),
            props=row.get("bank_props") if isinstance(row.get("bank_props"), dict) else {},
        )
        store_attributes(conn, "strain_variant", vid, row, source_id=source_id)
    else:
        store_attributes(conn, "strain_canonical", key, row, source_id=source_id)

    chem = row.get("chemistry") if isinstance(row.get("chemistry"), dict) else None
    if not chem and (row.get("thc_range") or row.get("top_terpenes") or row.get("thc")):
        chem = {
            "thc_range": row.get("thc_range"),
            "cbd_range": row.get("cbd_range"),
            "top_terpenes": row.get("top_terpenes"),
            "thc": row.get("thc"),
            "cbd": row.get("cbd"),
        }
    if chem:
        cid = add_chemistry(conn, name, chem, source_id=source_id)
        add_link(conn, "chemistry_profile", cid, "strain_canonical", key, source=source_id)

    grow_keys = (
        "height_cm",
        "height",
        "height_indoor",
        "height_outdoor",
        "flowering_days",
        "flowering_time",
        "indoor_flowering_time",
        "yield_indoor",
        "yield_outdoor",
        "climate",
    )
    if any(row.get(k) not in (None, "", [], {}) for k in grow_keys):
        add_grow(conn, name, row, source_id=source_id)

    return key


def rebuild_search_docs(conn: sqlite3.Connection) -> int:
    conn.execute("DELETE FROM search_docs")
    n = 0
    for row in conn.execute("SELECT name_norm, name, type, summary_json FROM strain_canonical"):
        hay = f"{row['name']} {row['type'] or ''} {row['summary_json'] or ''}".lower()
        conn.execute(
            "INSERT INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("strain", row["name_norm"], row["name"], hay),
        )
        n += 1
    for row in conn.execute("SELECT id, name, brand, payload_json FROM light_fixture"):
        conn.execute(
            "INSERT INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("light", row["id"], row["name"], f"{row['name']} {row['brand'] or ''}".lower()),
        )
        n += 1
    for row in conn.execute("SELECT id, name, brand FROM nutrient_product"):
        conn.execute(
            "INSERT INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("nutrient", row["id"], row["name"], f"{row['name']} {row['brand'] or ''}".lower()),
        )
        n += 1
    for row in conn.execute("SELECT id, name, brand FROM medium_product"):
        conn.execute(
            "INSERT INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("medium", row["id"], row["name"], f"{row['name']} {row['brand'] or ''}".lower()),
        )
        n += 1
    return n


def link_science_to_seed(conn: sqlite3.Connection) -> dict[str, int]:
    """Exact name_norm links from chemistry profiles to canonical/variants."""
    linked = 0
    to_parent = 0
    to_variant = 0
    for row in conn.execute(
        "SELECT id, name_norm, name FROM chemistry_profile WHERE name_norm IS NOT NULL AND name_norm != ''"
    ):
        key = row["name_norm"]
        parent = conn.execute(
            "SELECT name_norm FROM strain_canonical WHERE name_norm=?", (key,)
        ).fetchone()
        if parent:
            add_link(
                conn,
                "chemistry_profile",
                row["id"],
                "strain_canonical",
                key,
                method="exact_name_norm",
                confidence=1.0,
                source="link_science_to_seed",
            )
            linked += 1
            to_parent += 1
        variants = conn.execute(
            "SELECT id FROM strain_variant WHERE name_norm=?", (key,)
        ).fetchall()
        for v in variants:
            add_link(
                conn,
                "chemistry_profile",
                row["id"],
                "strain_variant",
                v["id"],
                method="exact_name_norm",
                confidence=1.0,
                source="link_science_to_seed",
            )
            linked += 1
            to_variant += 1
        if not parent and not variants:
            add_gap(conn, "chemistry_profile", row["id"], "seed_link", "no_matching_canonical")
    return {"linked": linked, "to_parent": to_parent, "to_variant": to_variant}


def corpus_stats(conn: sqlite3.Connection) -> dict[str, int]:
    out = {}
    for table in (
        "strain_canonical",
        "strain_variant",
        "chemistry_profile",
        "grow_trait",
        "entity_link",
        "attribute_kv",
        "light_fixture",
        "nutrient_product",
        "medium_product",
        "media_asset",
        "followup_gap",
        "schema_extension_log",
        "source_record",
    ):
        out[table] = conn.execute(f"SELECT COUNT(*) AS c FROM {table}").fetchone()["c"]
    return out
