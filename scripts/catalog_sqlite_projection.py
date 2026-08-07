#!/usr/bin/env python3
"""Project research SQLite strains into the slim HA search-index shape."""

from __future__ import annotations

import json
import re
import sqlite3
import time
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
STRAIN_CAP = 2500


def _slug(*parts: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", "_".join(parts).lower()).strip("_")
    return s[:80] or "unknown"


def _height(row: dict):
    for k in ("height_cm", "height", "grow_height_cm", "plant_height_cm"):
        v = row.get(k)
        if v is None:
            continue
        if isinstance(v, (list, tuple)) and len(v) >= 2:
            try:
                return [float(v[0]), float(v[1])]
            except (TypeError, ValueError):
                continue
        if isinstance(v, (int, float)):
            return float(v)
    return None


def _flowering(row: dict):
    for k in ("flowering_days", "flower_days", "flowering_time_days"):
        v = row.get(k)
        if isinstance(v, (int, float)):
            return int(v)
        if isinstance(v, (list, tuple)) and len(v) >= 2:
            try:
                return [int(v[0]), int(v[1])]
            except (TypeError, ValueError):
                continue
    return None


def build_strains_from_sqlite(db_path: Path, *, cap: int = STRAIN_CAP) -> dict | None:
    if not db_path.exists():
        return None
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    rows: list[dict] = []
    seen: dict[str, int] = {}

    def add(item: dict) -> None:
        key = (item.get("name") or "").lower().strip()
        if not key:
            return
        if key in seen:
            cur = rows[seen[key]]
            for field in (
                "type",
                "breeder",
                "source",
                "thc_range",
                "cbd_range",
                "want",
                "height_cm",
                "flowering_days",
            ):
                if item.get(field) not in (None, "", [], {}) and (
                    cur.get(field) in (None, "", [], {}) or field == "want"
                ):
                    cur[field] = item[field]
            if item.get("top_terpenes") and not cur.get("top_terpenes"):
                cur["top_terpenes"] = item["top_terpenes"]
            cur["has_chemistry"] = bool(
                cur.get("top_terpenes") or cur.get("thc_range") or cur.get("cbd_range")
            )
            if item.get("curated"):
                cur["curated"] = True
            return
        if len(rows) >= cap:
            return
        seen[key] = len(rows)
        rows.append(item)

    yaml_path = DATA / "dsc_strain_catalog.yaml"
    if yaml_path.exists() and yaml:
        try:
            doc = yaml.safe_load(yaml_path.read_text(encoding="utf-8")) or {}
            for s in doc.get("strains") or doc.get("seeds") or []:
                if not isinstance(s, dict):
                    continue
                chem = s.get("chem_summary") or s.get("chemistry") or {}
                if not isinstance(chem, dict):
                    chem = {}
                tops = chem.get("top_terpenes") or []
                if not isinstance(tops, list):
                    tops = []
                add(
                    {
                        "id": s.get("id") or _slug("strain", s.get("name") or ""),
                        "name": s.get("name") or s.get("id"),
                        "type": s.get("type") or s.get("lineage"),
                        "breeder": s.get("breeder") or s.get("bank"),
                        "source": "yaml",
                        "has_chemistry": bool(
                            tops or chem.get("thc_range") or chem.get("cbd_range")
                        ),
                        "top_terpenes": tops[:3],
                        "thc_range": chem.get("thc_range"),
                        "cbd_range": chem.get("cbd_range"),
                        "want": s.get("want") if isinstance(s.get("want"), dict) else None,
                        "height_cm": _height(s),
                        "flowering_days": _flowering(s),
                        "curated": bool(s.get("curated")),
                    }
                )
        except Exception as exc:  # noqa: BLE001
            print("yaml skip", exc)

    for row in conn.execute(
        "SELECT name_norm, name, type, summary_json, curated FROM strain_canonical "
        "ORDER BY curated DESC, name"
    ):
        summary = {}
        try:
            summary = json.loads(row["summary_json"] or "{}")
        except json.JSONDecodeError:
            summary = {}
        chem = conn.execute(
            "SELECT thc_min, thc_max, cbd_min, cbd_max, top_terpenes_json FROM chemistry_profile "
            "WHERE name_norm=? ORDER BY (top_terpenes_json IS NOT NULL) DESC LIMIT 1",
            (row["name_norm"],),
        ).fetchone()
        thc_range = cbd_range = None
        tops: list = []
        if chem:
            if chem["thc_min"] is not None and chem["thc_max"] is not None:
                thc_range = [chem["thc_min"], chem["thc_max"]]
            if chem["cbd_min"] is not None and chem["cbd_max"] is not None:
                cbd_range = [chem["cbd_min"], chem["cbd_max"]]
            if chem["top_terpenes_json"]:
                try:
                    tops = json.loads(chem["top_terpenes_json"]) or []
                except json.JSONDecodeError:
                    tops = []
        grow = conn.execute(
            "SELECT height_cm_min, height_cm_max, flowering_days_min, flowering_days_max "
            "FROM grow_trait WHERE name_norm=? LIMIT 1",
            (row["name_norm"],),
        ).fetchone()
        height_cm = flowering_days = None
        if grow:
            if grow["height_cm_min"] is not None:
                if (
                    grow["height_cm_max"] is not None
                    and grow["height_cm_max"] != grow["height_cm_min"]
                ):
                    height_cm = [grow["height_cm_min"], grow["height_cm_max"]]
                else:
                    height_cm = grow["height_cm_min"]
            if grow["flowering_days_min"] is not None:
                if (
                    grow["flowering_days_max"] is not None
                    and grow["flowering_days_max"] != grow["flowering_days_min"]
                ):
                    flowering_days = [
                        int(grow["flowering_days_min"]),
                        int(grow["flowering_days_max"]),
                    ]
                else:
                    flowering_days = int(grow["flowering_days_min"])
        variant = conn.execute(
            "SELECT breeder FROM strain_variant WHERE name_norm=? LIMIT 1",
            (row["name_norm"],),
        ).fetchone()
        add(
            {
                "id": _slug("strain", row["name"]),
                "name": row["name"],
                "type": row["type"] or summary.get("type"),
                "breeder": variant["breeder"] if variant else None,
                "source": "sqlite",
                "has_chemistry": bool(tops or thc_range or cbd_range),
                "top_terpenes": tops[:3] if isinstance(tops, list) else [],
                "thc_range": thc_range,
                "cbd_range": cbd_range,
                "want": summary.get("want") if isinstance(summary.get("want"), dict) else None,
                "height_cm": height_cm,
                "flowering_days": flowering_days,
                "curated": bool(row["curated"]),
            }
        )

    conn.close()
    return {
        "schema_version": 2,
        "kind": "strains",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(rows),
        "with_want": sum(1 for r in rows if r.get("want")),
        "with_height": sum(1 for r in rows if r.get("height_cm") is not None),
        "note": (
            "Browse index v2 from research SQLite projection + curated Want; "
            "height/flowering/chem only when corpus states them (never invented)."
        ),
        "items": rows,
    }
