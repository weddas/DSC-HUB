"""Load curated catalog packs into SQLite (HA not required)."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError as exc:  # pragma: no cover
    raise SystemExit("PyYAML required: pip install pyyaml") from exc

from .paths import DATA_DIR, DEFAULT_DB

SCHEMA = """
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS strains (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  curated INTEGER NOT NULL DEFAULT 0,
  want_json TEXT NOT NULL,
  raw_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS nutrients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  raw_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS mediums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  raw_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS lights (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  raw_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS search_docs (
  kind TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  haystack TEXT NOT NULL,
  PRIMARY KEY (kind, id)
);
"""


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def _load_yaml(path: Path) -> Any:
    if not path.exists():
        return None
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def _load_json(path: Path) -> Any:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def init_db(db_path: Path | None = None) -> Path:
    path = db_path or DEFAULT_DB
    conn = connect(path)
    conn.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        ("schema_version", "1"),
    )
    conn.commit()
    conn.close()
    return path


def reload_catalogs(db_path: Path | None = None, data_dir: Path | None = None) -> dict[str, int]:
    """Import curated packs from repo-root data/ into SQLite."""
    data = data_dir or DATA_DIR
    conn = connect(db_path)
    counts = {"strains": 0, "nutrients": 0, "mediums": 0, "lights": 0}

    conn.execute("DELETE FROM strains")
    conn.execute("DELETE FROM nutrients")
    conn.execute("DELETE FROM mediums")
    conn.execute("DELETE FROM lights")
    conn.execute("DELETE FROM search_docs")

    strain_doc = _load_yaml(data / "dsc_strain_catalog.yaml") or {}
    for row in strain_doc.get("seeds") or strain_doc.get("strains") or []:
        if not isinstance(row, dict):
            continue
        sid = str(row.get("id") or "").strip()
        name = str(row.get("name") or "").strip()
        want = row.get("want") if isinstance(row.get("want"), dict) else {}
        if not sid or not name:
            continue
        conn.execute(
            "INSERT INTO strains(id, name, type, curated, want_json, raw_json) VALUES(?,?,?,?,?,?)",
            (
                sid,
                name,
                row.get("type"),
                1 if row.get("curated") else 0,
                json.dumps(want, ensure_ascii=False),
                json.dumps(row, ensure_ascii=False),
            ),
        )
        conn.execute(
            "INSERT INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("strain", sid, name, f"{name} {sid} {row.get('type') or ''} {row.get('lineage') or ''}".lower()),
        )
        counts["strains"] += 1

    # Prefer curated YAML packs; fall back to JSON dumps when present.
    nute_yaml = _load_yaml(data / "dsc_nutrient_pack_canna_coco.yaml")
    nute_rows: list[dict] = []
    if isinstance(nute_yaml, dict):
        nute_rows = list(nute_yaml.get("products") or nute_yaml.get("items") or [])
        if not nute_rows and "name" in nute_yaml:
            nute_rows = [nute_yaml]
    if not nute_rows:
        nute_json = _load_json(data / "dsc_nutrients_canna.json") or {}
        if isinstance(nute_json, dict):
            nute_rows = list(nute_json.get("products") or [])
        elif isinstance(nute_json, list):
            nute_rows = nute_json
    for i, row in enumerate(nute_rows):
        if not isinstance(row, dict):
            continue
        nid = str(row.get("id") or row.get("slug") or f"nute_{i}").strip()
        name = str(row.get("name") or nid).strip()
        conn.execute(
            "INSERT OR REPLACE INTO nutrients(id, name, raw_json) VALUES(?,?,?)",
            (nid, name, json.dumps(row, ensure_ascii=False)),
        )
        conn.execute(
            "INSERT OR REPLACE INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("nutrient", nid, name, name.lower()),
        )
        counts["nutrients"] += 1

    med_yaml = _load_yaml(data / "dsc_medium_pack_canna_coco.yaml")
    med_rows: list[dict] = []
    if isinstance(med_yaml, dict):
        med_rows = list(med_yaml.get("products") or med_yaml.get("items") or [])
        if not med_rows and "name" in med_yaml:
            med_rows = [med_yaml]
    if not med_rows:
        med_json = _load_json(data / "dsc_mediums_canna.json") or {}
        if isinstance(med_json, dict):
            med_rows = list(med_json.get("products") or [])
        elif isinstance(med_json, list):
            med_rows = med_json
    for i, row in enumerate(med_rows):
        if not isinstance(row, dict):
            continue
        mid = str(row.get("id") or row.get("slug") or f"medium_{i}").strip()
        name = str(row.get("name") or mid).strip()
        conn.execute(
            "INSERT OR REPLACE INTO mediums(id, name, raw_json) VALUES(?,?,?)",
            (mid, name, json.dumps(row, ensure_ascii=False)),
        )
        conn.execute(
            "INSERT OR REPLACE INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("medium", mid, name, name.lower()),
        )
        counts["mediums"] += 1

    light_yaml = _load_yaml(data / "dsc_light_pack_photometrics.yaml")
    light_rows: list[dict] = []
    if isinstance(light_yaml, dict):
        light_rows = list(
            light_yaml.get("fixtures")
            or light_yaml.get("products")
            or light_yaml.get("lights")
            or light_yaml.get("items")
            or []
        )
    for i, row in enumerate(light_rows):
        if not isinstance(row, dict):
            continue
        lid = str(row.get("id") or row.get("slug") or f"light_{i}").strip()
        name = str(row.get("name") or lid).strip()
        conn.execute(
            "INSERT OR REPLACE INTO lights(id, name, raw_json) VALUES(?,?,?)",
            (lid, name, json.dumps(row, ensure_ascii=False)),
        )
        conn.execute(
            "INSERT OR REPLACE INTO search_docs(kind, id, name, haystack) VALUES(?,?,?,?)",
            ("light", lid, name, name.lower()),
        )
        counts["lights"] += 1

    conn.execute(
        "INSERT INTO meta(key, value) VALUES(?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        ("last_reload", json.dumps(counts)),
    )
    conn.commit()
    conn.close()
    return counts


def search(kind: str, query: str, limit: int = 20, db_path: Path | None = None) -> list[dict]:
    q = (query or "").strip().lower()
    conn = connect(db_path)
    if q:
        rows = conn.execute(
            "SELECT id, name FROM search_docs WHERE kind=? AND haystack LIKE ? ORDER BY name LIMIT ?",
            (kind, f"%{q}%", limit),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT id, name FROM search_docs WHERE kind=? ORDER BY name LIMIT ?",
            (kind, limit),
        ).fetchall()
    conn.close()
    return [{"id": r["id"], "name": r["name"]} for r in rows]


def get_strain(strain_id: str, db_path: Path | None = None) -> dict | None:
    conn = connect(db_path)
    row = conn.execute("SELECT * FROM strains WHERE id=?", (strain_id,)).fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row["id"],
        "name": row["name"],
        "type": row["type"],
        "curated": bool(row["curated"]),
        "want": json.loads(row["want_json"] or "{}"),
        "raw": json.loads(row["raw_json"] or "{}"),
    }
