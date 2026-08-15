"""Read-only SQLite access to the full research corpus (no STRAIN_CAP).

Typeahead stays light (name/alias only); hydrate joins chem/grow for hit IDs.
"""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from .bots import slug
from .config import settings

_conn: sqlite3.Connection | None = None


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    global _conn
    path = Path(db_path or settings.db_path)
    if _conn is not None:
        return _conn
    if not path.exists():
        raise FileNotFoundError(f"cannalib DB missing: {path}")
    conn = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA busy_timeout=30000")
    _conn = conn
    return conn


def close() -> None:
    global _conn
    if _conn is not None:
        _conn.close()
        _conn = None


_counts_cache: dict[str, int] | None = None


def corpus_counts(*, force: bool = False) -> dict[str, int]:
    global _counts_cache
    if _counts_cache is not None and not force:
        return dict(_counts_cache)
    c = connect()
    out: dict[str, int] = {}
    for table, key in (
        ("strain_canonical", "strains"),
        ("strain_variant", "variants"),
        ("science_alias", "aliases"),
        ("chemistry_profile", "chemistry"),
        ("grow_trait", "grow_traits"),
        ("nutrient_product", "nutrients"),
        ("medium_product", "mediums"),
        ("light_fixture", "lights"),
    ):
        try:
            out[key] = int(c.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
        except sqlite3.Error:
            out[key] = 0
    _counts_cache = dict(out)
    return out


def warm_counts() -> None:
    """Call once at startup so /v1/metrics does not pay full COUNT cost on first hit."""
    try:
        corpus_counts(force=True)
    except Exception:  # noqa: BLE001
        pass


def _norm_q(q: str) -> str:
    return " ".join((q or "").strip().lower().split())


def _escape_like(s: str) -> str:
    return s.replace("\\", "\\\\").replace("%", "").replace("_", "")


def _hydrate_norms(name_norms: list[str], *, matched: dict[str, str]) -> list[dict[str, Any]]:
    if not name_norms:
        return []
    c = connect()
    placeholders = ",".join("?" * len(name_norms))
    sql = f"""
    WITH chem AS (
      SELECT name_norm, thc_min, thc_max, cbd_min, cbd_max, top_terpenes_json,
             ROW_NUMBER() OVER (
               PARTITION BY name_norm
               ORDER BY (top_terpenes_json IS NOT NULL) DESC, id
             ) AS rn
      FROM chemistry_profile
      WHERE name_norm IN ({placeholders})
    ),
    grow AS (
      SELECT name_norm, height_cm_min, height_cm_max, flowering_days_min, flowering_days_max,
             payload_json,
             ROW_NUMBER() OVER (PARTITION BY name_norm ORDER BY id) AS rn
      FROM grow_trait
      WHERE name_norm IN ({placeholders})
    ),
    variant AS (
      SELECT name_norm, breeder,
             ROW_NUMBER() OVER (PARTITION BY name_norm ORDER BY id) AS rn
      FROM strain_variant
      WHERE name_norm IN ({placeholders})
    )
    SELECT c.name_norm, c.name, c.type, c.summary_json, c.curated,
           ch.thc_min, ch.thc_max, ch.cbd_min, ch.cbd_max, ch.top_terpenes_json,
           g.height_cm_min, g.height_cm_max, g.flowering_days_min, g.flowering_days_max,
           g.payload_json AS grow_payload_json,
           v.breeder
    FROM strain_canonical c
    LEFT JOIN chem ch ON ch.name_norm = c.name_norm AND ch.rn = 1
    LEFT JOIN grow g ON g.name_norm = c.name_norm AND g.rn = 1
    LEFT JOIN variant v ON v.name_norm = c.name_norm AND v.rn = 1
    WHERE c.name_norm IN ({placeholders})
    """
    args = (*name_norms, *name_norms, *name_norms, *name_norms)
    by_norm = {r["name_norm"]: r for r in c.execute(sql, args)}
    out: list[dict[str, Any]] = []
    for nn in name_norms:
        row = by_norm.get(nn)
        if not row:
            continue
        out.append(_row_to_strain_hit(row, matched_via=matched.get(nn, "name")))
    return out


def _row_to_strain_hit(row: sqlite3.Row, *, matched_via: str = "name") -> dict[str, Any]:
    summary: dict[str, Any] = {}
    try:
        summary = json.loads(row["summary_json"] or "{}")
    except json.JSONDecodeError:
        summary = {}
    thc_range = cbd_range = None
    tops: list = []
    if row["thc_min"] is not None and row["thc_max"] is not None:
        thc_range = [row["thc_min"], row["thc_max"]]
    if row["cbd_min"] is not None and row["cbd_max"] is not None:
        cbd_range = [row["cbd_min"], row["cbd_max"]]
    if row["top_terpenes_json"]:
        try:
            tops = json.loads(row["top_terpenes_json"]) or []
        except json.JSONDecodeError:
            tops = []
    height_cm = flowering_days = height_band = None
    if row["height_cm_min"] is not None:
        if row["height_cm_max"] is not None and row["height_cm_max"] != row["height_cm_min"]:
            height_cm = [row["height_cm_min"], row["height_cm_max"]]
        else:
            height_cm = row["height_cm_min"]
    grow_payload: dict[str, Any] = {}
    if row["grow_payload_json"]:
        try:
            grow_payload = json.loads(row["grow_payload_json"]) or {}
        except json.JSONDecodeError:
            grow_payload = {}
    if isinstance(grow_payload, dict):
        band = grow_payload.get("height_band")
        if not band and isinstance(grow_payload.get("grow"), dict):
            band = grow_payload["grow"].get("height_band")
        if isinstance(band, str) and band.strip():
            height_band = band.strip()
    if row["flowering_days_min"] is not None:
        if (
            row["flowering_days_max"] is not None
            and row["flowering_days_max"] != row["flowering_days_min"]
        ):
            flowering_days = [int(row["flowering_days_min"]), int(row["flowering_days_max"])]
        else:
            flowering_days = int(row["flowering_days_min"])
    name = row["name"]
    return {
        "id": slug("strain", name),
        "name_norm": row["name_norm"],
        "name": name,
        "type": row["type"] or summary.get("type"),
        "breeder": row["breeder"],
        "source": "sqlite",
        "has_chemistry": bool(tops or thc_range or cbd_range),
        "top_terpenes": tops[:3] if isinstance(tops, list) else [],
        "thc_range": thc_range,
        "cbd_range": cbd_range,
        "want": summary.get("want") if isinstance(summary.get("want"), dict) else None,
        "height_cm": height_cm,
        "height_band": height_band,
        "flowering_days": flowering_days,
        "curated": bool(row["curated"]),
        "matched_via": matched_via,
    }


def search_strains(q: str, *, limit: int = 20) -> list[dict[str, Any]]:
    """Typeahead across the FULL canonical set (+ aliases). No corpus cap.

    N-087-CANNALIB-FTS: still LIKE/prefix, not FTS5. Optional sqlite FTS5
    index for sub-100ms typeahead lives in CannaLib follow-ups — not this panel.
    """
    c = connect()
    limit = max(1, min(int(limit), 100))
    needle = _norm_q(q)
    matched: dict[str, str] = {}
    norms: list[str] = []

    def add(nn: str, via: str) -> bool:
        if not nn or nn in matched:
            return False
        matched[nn] = via
        norms.append(nn)
        return len(norms) >= limit

    if not needle:
        for r in c.execute(
            """
            SELECT name_norm FROM strain_canonical
            ORDER BY curated DESC, name
            LIMIT ?
            """,
            (limit,),
        ):
            add(r["name_norm"], "curated")
        return _hydrate_norms(norms, matched=matched)

    safe = _escape_like(needle)
    like = f"%{safe}%"
    prefix = f"{safe}%"
    norm_prefix = prefix.replace(" ", "_")
    norm_eq = safe.replace(" ", "_")

    # Prefer exact / prefix name hits so "blue dream" surfaces Blue Dream first.
    for r in c.execute(
        """
        SELECT name_norm FROM strain_canonical
        WHERE name_norm = ? OR name_norm LIKE ? OR lower(name) LIKE ?
        ORDER BY
          CASE
            WHEN name_norm = ? OR lower(name) = ? THEN 0
            WHEN name_norm LIKE ? OR lower(name) LIKE ? THEN 1
            ELSE 2
          END,
          curated DESC,
          length(name),
          name
        LIMIT ?
        """,
        (norm_eq, norm_prefix, prefix, norm_eq, safe, norm_prefix, prefix, limit),
    ):
        if add(r["name_norm"], "name"):
            return _hydrate_norms(norms, matched=matched)

    # Exact / prefix aliases next.
    for r in c.execute(
        """
        SELECT DISTINCT name_norm FROM science_alias
        WHERE name_norm IS NOT NULL AND name_norm != ''
          AND (alias_norm = ? OR alias_norm LIKE ? OR lower(alias) = ? OR lower(alias) LIKE ?)
        LIMIT ?
        """,
        (norm_eq, norm_prefix, safe, prefix, limit),
    ):
        if add(r["name_norm"], "alias"):
            return _hydrate_norms(norms, matched=matched)

    # Substring fallback across the full corpus (still uncapped source).
    remain = limit - len(norms)
    if remain > 0:
        for r in c.execute(
            """
            SELECT name_norm FROM strain_canonical
            WHERE lower(name) LIKE ? OR name_norm LIKE ?
            ORDER BY curated DESC, length(name), name
            LIMIT ?
            """,
            (like, f"%{norm_eq}%", remain + 30),
        ):
            if add(r["name_norm"], "name"):
                break
    remain = limit - len(norms)
    if remain > 0:
        for r in c.execute(
            """
            SELECT DISTINCT name_norm FROM science_alias
            WHERE name_norm IS NOT NULL AND name_norm != ''
              AND (alias_norm LIKE ? OR lower(alias) LIKE ?)
            LIMIT ?
            """,
            (f"%{norm_eq}%", like, remain + 30),
        ):
            if add(r["name_norm"], "alias"):
                break
    return _hydrate_norms(norms[:limit], matched=matched)


def get_strain_by_id(strain_id: str) -> dict[str, Any] | None:
    """Hydrate one strain. id is slug('strain', name) or raw name_norm."""
    c = connect()
    sid = (strain_id or "").strip()
    if not sid:
        return None
    row = c.execute(
        "SELECT name_norm FROM strain_canonical WHERE name_norm = ? LIMIT 1",
        (sid,),
    ).fetchone()
    if row:
        items = _hydrate_norms([row["name_norm"]], matched={row["name_norm"]: "id"})
        return items[0] if items else None

    needle = sid
    if needle.startswith("strain_"):
        needle = needle[len("strain_") :]
    needle = needle.replace("_", " ")
    safe = _escape_like(needle)
    like = f"%{safe}%"
    for r in c.execute(
        """
        SELECT name_norm, name FROM strain_canonical
        WHERE lower(name) LIKE ? OR name_norm LIKE ?
        LIMIT 80
        """,
        (like, f"%{safe.replace(' ', '_')}%"),
    ):
        if slug("strain", r["name"]) == sid or r["name_norm"] == sid:
            items = _hydrate_norms([r["name_norm"]], matched={r["name_norm"]: "id"})
            return items[0] if items else None
    return None


def search_products(kind: str, q: str, *, limit: int = 20) -> list[dict[str, Any]]:
    """Nutrients / mediums / lights — full tables, no HA index cap."""
    table = {
        "nutrients": "nutrient_product",
        "nutrient": "nutrient_product",
        "mediums": "medium_product",
        "medium": "medium_product",
        "lights": "light_fixture",
        "light": "light_fixture",
    }.get(kind)
    if not table:
        raise ValueError(f"unknown product kind {kind}")
    c = connect()
    limit = max(1, min(int(limit), 100))
    needle = _norm_q(q)
    if not needle:
        rows = c.execute(
            f"SELECT id, name, brand FROM {table} ORDER BY name LIMIT ?",
            (limit,),
        ).fetchall()
    else:
        like = f"%{_escape_like(needle)}%"
        rows = c.execute(
            f"""
            SELECT id, name, brand FROM {table}
            WHERE lower(name) LIKE ? OR lower(COALESCE(brand,'')) LIKE ?
            ORDER BY name LIMIT ?
            """,
            (like, like, limit),
        ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        out.append(
            {
                "id": r["id"] or slug(kind, r["name"] or ""),
                "name": r["name"],
                "brand": r["brand"],
                "breeder": r["brand"],
                "source": "sqlite",
            }
        )
    return out
