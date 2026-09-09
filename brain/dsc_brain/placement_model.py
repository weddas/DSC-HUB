"""Where a thing physically stands in the rig.

`plan-spatial-layout-2026-09-10.md` S4. The rig's layout was source code: 36 hand-written
`<Placed>` calls in RigScene.tsx with literal offsets and rotations, so nothing could be
moved without an edit and a rebuild.

The shape stored here is deliberately **the same shape `Placed` already consumes** — an
`at` that is either a parent's anchor or a world position, plus rotation, plus which of the
model's own anchors lands on the target. Persisted and rendered forms being identical is
what makes this a swap rather than a translation layer.

Only OVERRIDES live here. A rig with no rows renders exactly as it always did, from the
literals in the scene, so porting a placement is opt-in per instance and reversible by
deleting a row.
"""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .db import open_db, schema_once
from .paths import default_db


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    return open_db(db_path or default_db())


def init_placement_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        if not schema_once(conn, "placement_model"):
            return
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS instance_placement (
              instance_id TEXT PRIMARY KEY,
              space_id TEXT NOT NULL DEFAULT '',
              placement_json TEXT NOT NULL,
              updated_at REAL NOT NULL
            );
            """
        )
        conn.commit()


def _vec3(value: Any, field: str) -> list[float]:
    if not isinstance(value, (list, tuple)) or len(value) != 3:
        raise ValueError(f"{field} must be three numbers")
    try:
        return [float(v) for v in value]
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{field} must be three numbers") from exc


def normalise_placement(placement: dict[str, Any]) -> dict[str, Any]:
    """Validate a placement, or say exactly which part of it is wrong.

    The two `at` shapes are mutually exclusive on purpose: snapped to a parent's anchor, or
    at a world position. A record carrying both would render one and silently ignore the
    other, and the operator would have no way to tell which.
    """
    if not isinstance(placement, dict):
        raise ValueError("placement must be an object")
    at = placement.get("at")
    if not isinstance(at, dict):
        raise ValueError("placement needs an `at`")

    has_parent = bool(str(at.get("parent") or "").strip())
    has_position = "position" in at

    if has_parent and has_position:
        raise ValueError("`at` is either a parent+anchor or a position, not both")
    if not has_parent and not has_position:
        raise ValueError("`at` needs either a parent (with an anchor) or a position")

    out_at: dict[str, Any] = {}
    if has_parent:
        out_at["parent"] = str(at["parent"]).strip()
        # An empty anchor is legal and meaningful: it means the parent's own origin, which
        # is how the free-standing pieces (heater, camera) are placed today.
        out_at["anchor"] = str(at.get("anchor") or "")
        if at.get("offset") is not None:
            out_at["offset"] = _vec3(at["offset"], "offset")
    else:
        out_at["position"] = _vec3(at["position"], "position")

    out: dict[str, Any] = {"at": out_at}
    if placement.get("rotation") is not None:
        out["rotation"] = _vec3(placement["rotation"], "rotation")
    if placement.get("self") is not None:
        selfv = placement["self"]
        if isinstance(selfv, str):
            out["self"] = selfv
        elif isinstance(selfv, (list, tuple)) and len(selfv) == 2:
            out["self"] = [str(selfv[0]), str(selfv[1])]
        else:
            raise ValueError("`self` is an anchor name, or two to take their midpoint")
    if placement.get("scale") is not None:
        scale = placement["scale"]
        if isinstance(scale, (int, float)):
            out["scale"] = float(scale)
        else:
            out["scale"] = _vec3(scale, "scale")
    return out


def set_placement(
    instance_id: str,
    placement: dict[str, Any],
    *,
    space_id: str = "",
    db_path: Path | None = None,
) -> dict[str, Any]:
    iid = str(instance_id or "").strip()
    if not iid:
        raise ValueError("instance_id required")
    clean = normalise_placement(placement)
    init_placement_tables(db_path)
    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO instance_placement(instance_id, space_id, placement_json, updated_at)
            VALUES(?, ?, ?, ?)
            ON CONFLICT(instance_id) DO UPDATE SET
              space_id=excluded.space_id,
              placement_json=excluded.placement_json,
              updated_at=excluded.updated_at
            """,
            (iid, str(space_id or ""), json.dumps(clean, separators=(",", ":")), time.time()),
        )
        conn.commit()
    return {"instance_id": iid, "space_id": space_id, "placement": clean}


def get_placement(instance_id: str, db_path: Path | None = None) -> dict[str, Any] | None:
    init_placement_tables(db_path)
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT placement_json FROM instance_placement WHERE instance_id=?",
            (str(instance_id),),
        ).fetchone()
    if not row:
        return None
    try:
        return json.loads(row["placement_json"])
    except (TypeError, ValueError, json.JSONDecodeError):
        return None


def clear_placement(instance_id: str, db_path: Path | None = None) -> bool:
    """Forget an override. The instance falls back to where the scene puts it."""
    init_placement_tables(db_path)
    with _connect(db_path) as conn:
        cur = conn.execute(
            "DELETE FROM instance_placement WHERE instance_id=?", (str(instance_id),)
        )
        conn.commit()
        return bool(cur.rowcount)


def list_placements(db_path: Path | None = None) -> dict[str, dict[str, Any]]:
    """Every override, keyed by instance id — the whole map the twin needs in one read."""
    init_placement_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT instance_id, space_id, placement_json FROM instance_placement"
        ).fetchall()
    out: dict[str, dict[str, Any]] = {}
    for r in rows:
        try:
            out[r["instance_id"]] = {
                "space_id": r["space_id"],
                "placement": json.loads(r["placement_json"]),
            }
        except (TypeError, ValueError, json.JSONDecodeError):
            continue
    return out
