"""N-087 research corpus helpers: upserts, attribute overflow, links."""

from __future__ import annotations

import hashlib
import json
import re
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Any

from .corpus_schema import CORPUS_SCHEMA, SCHEMA_VERSION, SCHEMA_V4_OBSERVATION_REVIEW
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
    "top_effects",
    "top_flavors",
    "height_cm",
    "flowering_days",
    "curated",
    "want",
    "page_text_excerpt",
}

# High-cardinality community score columns → keep summary only, not every score in attribute_kv.
_SKIP_ATTR_RE = re.compile(
    r"(?i)(_score|_votes|_percentile\d*|reviewcount|photocount|totalfollowers|traitscount|energizescore)$"
)


def name_norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()


def connect(db_path: Path | None = None, *, timeout: float = 120.0) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path, timeout=timeout)
    conn.row_factory = sqlite3.Row
    conn.execute(f"PRAGMA busy_timeout={int(max(timeout, 1.0) * 1000)}")
    # Avoid WRITE lock when core tables already exist (critical under concurrent fan-out).
    # Full SCHEMA apply only for brand-new DBs; additive raw_record create is best-effort.
    if _table_exists(conn, "strain_canonical") and _table_exists(conn, "meta"):
        if not _table_exists(conn, "raw_record"):
            try:
                conn.executescript(
                    """
                    CREATE TABLE IF NOT EXISTS raw_record (
                      id TEXT PRIMARY KEY,
                      source_id TEXT NOT NULL,
                      entity_kind TEXT NOT NULL,
                      entity_id TEXT,
                      name_norm TEXT,
                      payload_json TEXT NOT NULL,
                      payload_sha1 TEXT,
                      stored_at TEXT
                    );
                    CREATE INDEX IF NOT EXISTS idx_raw_source ON raw_record(source_id);
                    CREATE INDEX IF NOT EXISTS idx_raw_norm ON raw_record(name_norm);
                    CREATE INDEX IF NOT EXISTS idx_raw_sha ON raw_record(payload_sha1);
                    """
                )
            except sqlite3.OperationalError:
                # Another writer holds the lock; caller can retry. Typed tables still usable.
                pass
        try:
            _migrate_schema(conn)
        except sqlite3.OperationalError:
            pass
        try:
            conn.execute(
                "INSERT INTO meta(key, value) VALUES(?, ?) "
                "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                ("corpus_schema_version", SCHEMA_VERSION),
            )
        except sqlite3.OperationalError:
            pass
        return conn
    conn.executescript(CORPUS_SCHEMA)
    _migrate_schema(conn)
    return conn


def _migrate_schema(conn: sqlite3.Connection) -> None:
    """Additive upgrades for DBs created before SCHEMA_VERSION bumps."""
    # v4: observation + review (CREATE IF NOT EXISTS — safe to re-run).
    if not _table_exists(conn, "observation") or not _table_exists(conn, "review"):
        conn.executescript(SCHEMA_V4_OBSERVATION_REVIEW)
    conn.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        ("corpus_schema_version", SCHEMA_VERSION),
    )


def _table_exists(conn: sqlite3.Connection, name: str) -> bool:
    row = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=? LIMIT 1", (name,)
    ).fetchone()
    return bool(row)


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
        if _SKIP_ATTR_RE.search(key or ""):
            # Still log novel key families once for schema extension, but do not explode kv.
            if key.endswith("_score") or "percentile" in (key or "").lower():
                _note_extension(conn, entity_kind, key.rsplit("_", 1)[0] + "_*")
            continue
        if isinstance(value, (dict, list)):
            text = json.dumps(value, ensure_ascii=False)
            if len(text) > 4000:
                text = text[:4000] + "…"
        else:
            text = str(value)
            if len(text) > 2000:
                text = text[:2000] + "…"
        conn.execute(
            "INSERT INTO attribute_kv(entity_kind, entity_id, key, value, unit, source_id) "
            "VALUES(?,?,?,?,?,?)",
            (entity_kind, entity_id, key, text, None, source_id),
        )
        _note_extension(conn, entity_kind, key)
        n += 1
    return n


def store_raw_record(
    conn: sqlite3.Connection,
    *,
    source_id: str,
    entity_kind: str,
    payload: dict[str, Any] | str,
    entity_id: str | None = None,
    name: str | None = None,
    record_id: str | None = None,
) -> str:
    """Persist a full source row as one blob. Prefer over attribute_kv for fat dumps."""
    if isinstance(payload, str):
        text = payload
    else:
        text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    sha = hashlib.sha1(text.encode("utf-8", errors="replace")).hexdigest()
    existing = conn.execute(
        "SELECT id FROM raw_record WHERE source_id=? AND payload_sha1=? LIMIT 1",
        (source_id, sha),
    ).fetchone()
    if existing:
        return existing["id"]
    rid = record_id or f"{source_id}:{sha[:16]}"
    key = name_norm(name or "") if name else None
    if not key and isinstance(payload, dict):
        key = name_norm(str(payload.get("name") or payload.get("strain") or "")) or None
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    conn.execute(
        "INSERT INTO raw_record(id, source_id, entity_kind, entity_id, name_norm, "
        "payload_json, payload_sha1, stored_at) VALUES(?,?,?,?,?,?,?,?) "
        "ON CONFLICT(id) DO UPDATE SET "
        "payload_json=excluded.payload_json, payload_sha1=excluded.payload_sha1, "
        "stored_at=excluded.stored_at",
        (rid, source_id, entity_kind, entity_id, key, text, sha, now),
    )
    return rid


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

    def _scalar_text(val: Any) -> str | None:
        if val in (None, "", [], {}):
            return None
        if isinstance(val, (list, tuple)):
            parts = [str(x).strip() for x in val if x not in (None, "", [], {})]
            return ", ".join(parts) if parts else None
        if isinstance(val, dict):
            return json.dumps(val, ensure_ascii=False)
        return str(val)

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
            _scalar_text(payload.get("yield_indoor")),
            _scalar_text(payload.get("yield_outdoor")),
            _scalar_text(payload.get("climate")),
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


def _stable_doc_id(*parts: str) -> str:
    blob = "|".join(parts)
    return hashlib.sha1(blob.encode("utf-8", errors="replace")).hexdigest()


def add_observation(
    conn: sqlite3.Connection,
    *,
    name_norm_key: str,
    source_id: str,
    body_text: str,
    kind: str = "grow_note",
    title: str | None = None,
    variant_id: str | None = None,
    observed_at: str | None = None,
    payload: dict[str, Any] | None = None,
    raw_record_id: str | None = None,
    obs_id: str | None = None,
) -> str | None:
    """Append-only observation. Insert-or-ignore by stable id. Returns id or None if empty."""
    body = (body_text or "").strip()
    if not body:
        return None
    key = name_norm(name_norm_key) if name_norm_key else ""
    if not key:
        return None
    payload_json = json.dumps(payload or {}, ensure_ascii=False)
    oid = obs_id or _stable_doc_id(source_id, kind, key, body[:2000], raw_record_id or "")
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    conn.execute(
        "INSERT OR IGNORE INTO observation("
        "id, name_norm, variant_id, source_id, observed_at, kind, title, body_text, "
        "payload_json, raw_record_id, created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
        (
            oid,
            key,
            variant_id,
            source_id,
            observed_at,
            kind,
            title,
            body,
            payload_json,
            raw_record_id,
            now,
        ),
    )
    return oid


def add_review(
    conn: sqlite3.Connection,
    *,
    name_norm_key: str,
    source_id: str,
    body_text: str,
    kind: str = "review",
    title: str | None = None,
    variant_id: str | None = None,
    observed_at: str | None = None,
    rating: float | None = None,
    reviewer: str | None = None,
    payload: dict[str, Any] | None = None,
    raw_record_id: str | None = None,
    review_id: str | None = None,
) -> str | None:
    """Append-only review. Insert-or-ignore by stable id. Returns id or None if empty."""
    body = (body_text or "").strip()
    if not body:
        return None
    key = name_norm(name_norm_key) if name_norm_key else ""
    if not key:
        return None
    payload_json = json.dumps(payload or {}, ensure_ascii=False)
    rid = review_id or _stable_doc_id(source_id, kind, key, body[:2000], raw_record_id or "")
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    conn.execute(
        "INSERT OR IGNORE INTO review("
        "id, name_norm, variant_id, source_id, observed_at, kind, title, body_text, "
        "rating, reviewer, payload_json, raw_record_id, created_at) "
        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (
            rid,
            key,
            variant_id,
            source_id,
            observed_at,
            kind,
            title,
            body,
            rating,
            reviewer,
            payload_json,
            raw_record_id,
            now,
        ),
    )
    return rid


def add_lineage_edge(
    conn: sqlite3.Connection,
    *,
    child_norm: str,
    parent: str,
    source_id: str,
    confidence: float = 1.0,
) -> str | None:
    """SoT lineage: method=parent_of, from=parent → to=child. No inverse insert.

    If parent resolves to an existing strain_canonical.name_norm, from_kind=strain_canonical.
    Otherwise from_kind=name_literal with the raw parent string (unresolved queue).
    Idempotent: skips if an equivalent parent_of edge already exists.
    """
    child = name_norm(child_norm)
    parent_raw = (parent or "").strip()
    if not child or not parent_raw:
        return None
    parent_key = name_norm(parent_raw)
    if not parent_key or parent_key == child:
        return None
    resolved = conn.execute(
        "SELECT 1 FROM strain_canonical WHERE name_norm=? LIMIT 1", (parent_key,)
    ).fetchone()
    if resolved:
        from_kind, from_id = "strain_canonical", parent_key
    else:
        from_kind, from_id = "name_literal", parent_raw
    existing = conn.execute(
        "SELECT id FROM entity_link WHERE method='parent_of' AND from_kind=? AND from_id=? "
        "AND to_kind='strain_canonical' AND to_id=? LIMIT 1",
        (from_kind, from_id, child),
    ).fetchone()
    if existing:
        return existing["id"] if isinstance(existing, sqlite3.Row) else existing[0]
    return add_link(
        conn,
        from_kind,
        from_id,
        "strain_canonical",
        child,
        method="parent_of",
        confidence=confidence,
        source=source_id,
    )


def _iter_parent_names(value: Any) -> list[str]:
    """Extract parent name strings from common payload shapes — never invent."""
    out: list[str] = []
    if value in (None, "", [], {}):
        return out
    if isinstance(value, str):
        # Split common separators; leave mermaid alone (caller should not pass it).
        if "-->" in value or value.strip().lower().startswith("graph"):
            return out
        parts = re.split(r"[,;/]| x | × |\s+x\s+", value)
        for p in parts:
            p = p.strip()
            if p and len(p) < 120:
                out.append(p)
        return out
    if isinstance(value, (list, tuple)):
        for item in value:
            if isinstance(item, str):
                out.extend(_iter_parent_names(item))
            elif isinstance(item, dict):
                name = item.get("name") or item.get("strain") or item.get("slug")
                if name:
                    out.append(str(name).strip())
        return out
    if isinstance(value, dict):
        name = value.get("name") or value.get("strain")
        if name:
            out.append(str(name).strip())
        for k in ("parents", "parent", "mother", "father"):
            if k in value:
                out.extend(_iter_parent_names(value.get(k)))
    return out


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
    store_attrs: bool = True,
    store_raw: bool = False,
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
            for k in (
                "thc",
                "cbd",
                "lineage",
                "lineage_structured",
                "lineage_mermaid",
                "genetic_background",
                "parents",
                "effect",
                "effects",
                "flavor",
                "flavors",
                "top_effects",
                "top_flavors",
                "description",
                "descriptionPlain",
                "grow_difficulty",
                "seed_gender",
                "flowering_behavior",
                "rating",
                "review_count",
                "reviews",
                "terpenes",
                "top_terpenes",
            )
            if row.get(k) not in (None, "", [], {})
        },
    )
    breeder = str(row.get("breeder") or row.get("brand") or row.get("seed_bank") or "").strip()
    entity_kind = "strain_canonical"
    entity_id = key
    if breeder and name_norm(breeder) not in {"", "generic", "unknown", "n a", "na"}:
        vid = upsert_variant(
            conn,
            name,
            breeder,
            source_id=source_id,
            bank_url=row.get("url") or row.get("bank_url") or row.get("product_url"),
            props=row.get("bank_props") if isinstance(row.get("bank_props"), dict) else {},
        )
        entity_kind = "strain_variant"
        entity_id = vid
        if store_attrs:
            store_attributes(conn, "strain_variant", vid, row, source_id=source_id)
    else:
        if store_attrs:
            store_attributes(conn, "strain_canonical", key, row, source_id=source_id)

    if store_raw:
        store_raw_record(
            conn,
            source_id=source_id,
            entity_kind=entity_kind,
            entity_id=entity_id,
            name=name,
            payload=row,
        )

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
        "height_band",
        "height_ordinal",
        "height_source",
        "height_raw",
        "flowering_days",
        "flowering_time",
        "indoor_flowering_time",
        "yield_indoor",
        "yield_outdoor",
        "climate",
        "grow_difficulty",
        "seed_gender",
        "flowering_behavior",
    )
    grow_row = dict(row)
    nested_grow = row.get("grow") if isinstance(row.get("grow"), dict) else None
    if nested_grow:
        for k, v in nested_grow.items():
            if grow_row.get(k) in (None, "", [], {}) and v not in (None, "", [], {}):
                grow_row[k] = v
    if any(grow_row.get(k) not in (None, "", [], {}) for k in grow_keys):
        add_grow(
            conn,
            name,
            {k: grow_row.get(k) for k in grow_keys if grow_row.get(k) not in (None, "", [], {})},
            source_id=source_id,
        )

    gaps = row.get("followup_gap")
    if isinstance(gaps, dict):
        gaps = [gaps]
    if isinstance(gaps, list):
        for g in gaps:
            if not isinstance(g, dict):
                continue
            field = str(g.get("field") or "").strip()
            reason = str(g.get("reason") or "").strip()
            if field and reason:
                add_gap(conn, entity_kind, entity_id, field, reason)

    # Opt-in collation dual-write (additive; never replaces raw/chem/grow).
    note_body = row.get("observation_body") or row.get("grow_note") or row.get("forum_body")
    if isinstance(note_body, str) and note_body.strip():
        add_observation(
            conn,
            name_norm_key=key,
            source_id=source_id,
            body_text=note_body,
            kind=str(row.get("observation_kind") or "grow_note"),
            title=(str(row["observation_title"]).strip() if row.get("observation_title") else None),
            variant_id=entity_id if entity_kind == "strain_variant" else None,
            observed_at=str(row["observed_at"]).strip() if row.get("observed_at") else None,
        )
    review_body = row.get("review_body") or row.get("review_text")
    if isinstance(review_body, str) and review_body.strip():
        rating = row.get("rating")
        try:
            rating_f = float(rating) if rating not in (None, "") else None
        except (TypeError, ValueError):
            rating_f = None
        add_review(
            conn,
            name_norm_key=key,
            source_id=source_id,
            body_text=review_body,
            title=(str(row["review_title"]).strip() if row.get("review_title") else None),
            variant_id=entity_id if entity_kind == "strain_variant" else None,
            rating=rating_f,
            reviewer=(str(row["reviewer"]).strip() if row.get("reviewer") else None),
            observed_at=str(row["observed_at"]).strip() if row.get("observed_at") else None,
        )
    for parent_field in ("parents", "parent_slugs", "lineage_structured"):
        for pname in _iter_parent_names(row.get(parent_field)):
            add_lineage_edge(conn, child_norm=key, parent=pname, source_id=source_id)

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
    """Exact name_norm links from chemistry profiles to canonical/variants.

    Set-based INSERT…SELECT (NAS-safe). Skips edges that already exist.
    Safe to re-run after incremental ingest.
    """
    # chemistry_profile → strain_canonical
    cur = conn.execute(
        """
        INSERT INTO entity_link(id, from_kind, from_id, to_kind, to_id, method, confidence, source)
        SELECT lower(hex(randomblob(16))),
               'chemistry_profile', c.id, 'strain_canonical', c.name_norm,
               'exact_name_norm', 1.0, 'link_science_to_seed'
        FROM chemistry_profile c
        INNER JOIN strain_canonical s ON s.name_norm = c.name_norm
        WHERE c.name_norm IS NOT NULL AND c.name_norm != ''
          AND NOT EXISTS (
            SELECT 1 FROM entity_link e
            WHERE e.from_kind = 'chemistry_profile'
              AND e.from_id = c.id
              AND e.to_kind = 'strain_canonical'
              AND e.to_id = c.name_norm
          )
        """
    )
    to_parent = cur.rowcount if cur.rowcount is not None and cur.rowcount >= 0 else 0

    # chemistry_profile → strain_variant
    cur = conn.execute(
        """
        INSERT INTO entity_link(id, from_kind, from_id, to_kind, to_id, method, confidence, source)
        SELECT lower(hex(randomblob(16))),
               'chemistry_profile', c.id, 'strain_variant', v.id,
               'exact_name_norm', 1.0, 'link_science_to_seed'
        FROM chemistry_profile c
        INNER JOIN strain_variant v ON v.name_norm = c.name_norm
        WHERE c.name_norm IS NOT NULL AND c.name_norm != ''
          AND NOT EXISTS (
            SELECT 1 FROM entity_link e
            WHERE e.from_kind = 'chemistry_profile'
              AND e.from_id = c.id
              AND e.to_kind = 'strain_variant'
              AND e.to_id = v.id
          )
        """
    )
    to_variant = cur.rowcount if cur.rowcount is not None and cur.rowcount >= 0 else 0

    # Gaps: chem rows with name_norm but no canonical and no variant match
    cur = conn.execute(
        """
        INSERT INTO followup_gap(entity_kind, entity_id, field, reason, created_at)
        SELECT 'chemistry_profile', c.id, 'seed_link', 'no_matching_canonical',
               strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
        FROM chemistry_profile c
        WHERE c.name_norm IS NOT NULL AND c.name_norm != ''
          AND NOT EXISTS (
            SELECT 1 FROM strain_canonical s WHERE s.name_norm = c.name_norm
          )
          AND NOT EXISTS (
            SELECT 1 FROM strain_variant v WHERE v.name_norm = c.name_norm
          )
          AND NOT EXISTS (
            SELECT 1 FROM followup_gap g
            WHERE g.entity_kind = 'chemistry_profile'
              AND g.entity_id = c.id
              AND g.field = 'seed_link'
          )
        """
    )
    gaps = cur.rowcount if cur.rowcount is not None and cur.rowcount >= 0 else 0

    return {
        "linked": to_parent + to_variant,
        "to_parent": to_parent,
        "to_variant": to_variant,
        "gaps_added": gaps,
        "skipped_existing": -1,  # set-based; not counted per-row
    }


def corpus_stats(conn: sqlite3.Connection) -> dict[str, int]:
    out = {}
    for table in (
        "strain_canonical",
        "strain_variant",
        "chemistry_profile",
        "grow_trait",
        "entity_link",
        "attribute_kv",
        "raw_record",
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
