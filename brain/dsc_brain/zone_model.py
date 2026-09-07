"""Zones — every space and room as one object with a *role* that flips in place.

Design turn 3 (docs/design/plan-v2-dashboard-2026-09-06.md § Pass C): Site › Room (lung) ›
Zone › Plant. A zone's role (grow · dry · cure · empty) decides which bands apply and what
the SPA counts; it is recorded here and written to the space journal. Roles live in the
existing ``space.extra_json`` so no schema migration is needed.

What a role flip does today: records ``role`` + ``role_since`` + history, writes a system
entry on the space journal, and the SPA switches the zone's bands/phase. What it does
**not** do yet: touch the lamp, fans, appliances or automation rules — those stay as
configured (tracked as the control-pass follow-up). The API says so in ``effects``.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any

from .room_model import ensure_kit_rooms
from .space_model import _connect, ensure_kit_spaces, init_space_tables
from .space_journal import add_space_entry

ZONE_ROLES: tuple[str, ...] = ("grow", "dry", "cure", "empty")

ROLE_LABEL: dict[str, str] = {
    "grow": "Grow",
    "dry": "Dry",
    "cure": "Cure",
    "empty": "Empty",
    "room": "Room",
}

_MAX_NAME = 40
_MAX_NOTES = 400
_HISTORY_KEEP = 12

# Honest effect list — the SPA shows exactly this before the operator confirms.
ROLE_EFFECTS: dict[str, dict[str, list[str]]] = {
    "does": {
        "all": [
            "Records the new role and when it started on this zone.",
            "Writes a system entry on the zone's journal with a snapshot.",
            "Switches the zone's bands and phase chip in the SPA (Dry uses the Dry Mode rail; Cure and Empty have no climate band).",
        ],
    },
    "does_not": {
        "all": [
            "Does not turn the lamp, fans, mat or any appliance on or off — they keep their current schedule and demand.",
            "Does not change automation rules, photoperiod or Want setpoints on the hub.",
            "Does not delete history, journals or plants; reverting to Grow restores the previous bands.",
        ],
    },
}


def _space_extra(conn, space_id: str) -> dict[str, Any]:
    row = conn.execute("SELECT extra_json FROM space WHERE space_id=?", (space_id,)).fetchone()
    if not row:
        raise KeyError(space_id)
    try:
        extra = json.loads(row["extra_json"] or "{}")
    except json.JSONDecodeError:
        extra = {}
    return extra if isinstance(extra, dict) else {}


def set_space_extra(space_id: str, patch: dict[str, Any], *, db_path: Path | None = None) -> dict[str, Any]:
    """Merge ``patch`` into ``space.extra_json`` and return the merged dict."""
    init_space_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        extra = _space_extra(conn, str(space_id))
        extra.update(patch)
        conn.execute(
            "UPDATE space SET extra_json=?, updated_at=? WHERE space_id=?",
            (json.dumps(extra, separators=(",", ":")), now, str(space_id)),
        )
        conn.commit()
    return extra


def _room_extra(conn, room_id: str) -> dict[str, Any]:
    row = conn.execute("SELECT extra_json FROM room WHERE room_id=?", (room_id,)).fetchone()
    if not row:
        raise KeyError(room_id)
    try:
        extra = json.loads(row["extra_json"] or "{}")
    except json.JSONDecodeError:
        extra = {}
    return extra if isinstance(extra, dict) else {}


def set_room_extra(room_id: str, patch: dict[str, Any], *, db_path: Path | None = None) -> dict[str, Any]:
    """Merge ``patch`` into ``room.extra_json`` — the kit-defaults upsert rewrites ``label``
    on every boot, so the operator's name lives here."""
    now = time.time()
    with _connect(db_path) as conn:
        extra = _room_extra(conn, str(room_id))
        extra.update(patch)
        conn.execute(
            "UPDATE room SET extra_json=?, updated_at=? WHERE room_id=?",
            (json.dumps(extra, separators=(",", ":")), now, str(room_id)),
        )
        conn.commit()
    return extra


def _room_names(db_path: Path | None, rooms: list[dict[str, Any]]) -> dict[str, str]:
    names: dict[str, str] = {}
    with _connect(db_path) as conn:
        for r in rooms:
            rid = str(r["room_id"])
            try:
                extra = _room_extra(conn, rid)
            except KeyError:
                extra = {}
            names[rid] = str(extra.get("name") or r.get("label") or rid)
    return names


def _zone_from_space(space: dict[str, Any], room_label: dict[str, str]) -> dict[str, Any]:
    extra = space.get("extra") if isinstance(space.get("extra"), dict) else {}
    role = str(extra.get("role") or "grow")
    if role not in ZONE_ROLES:
        role = "grow"
    history = extra.get("role_history")
    if not isinstance(history, list):
        history = []
    parent = space.get("room_id")
    return {
        "zone_id": space["space_id"],
        "kind": space.get("kind") or "tent",
        "name": str(extra.get("name") or space.get("size_label") or space["space_id"]),
        "size_label": space.get("size_label") or "",
        "size_m2": space.get("size_m2"),
        "parent": parent,
        "parent_label": room_label.get(str(parent), None) if parent else None,
        "role": role,
        "role_label": ROLE_LABEL[role],
        "role_since": extra.get("role_since"),
        "role_history": history[-_HISTORY_KEEP:],
        "notes": str(extra.get("notes") or ""),
        "updated_at": space.get("updated_at"),
    }


def list_zones(db_path: Path | None = None) -> list[dict[str, Any]]:
    """Rooms first (role ``room``, with their children), then every space with its role."""
    rooms = ensure_kit_rooms(db_path)
    spaces = ensure_kit_spaces(db_path)
    room_label = _room_names(db_path, rooms)
    out: list[dict[str, Any]] = []
    for r in rooms:
        out.append(
            {
                "zone_id": r["room_id"],
                "kind": "room",
                "name": room_label[str(r["room_id"])],
                "size_label": "",
                "size_m2": None,
                "parent": None,
                "parent_label": None,
                "role": "room",
                "role_label": ROLE_LABEL["room"],
                "role_since": None,
                "role_history": [],
                "notes": "",
                "children": list(r.get("spaces") or []),
                "updated_at": r.get("updated_at"),
            }
        )
    for s in spaces:
        out.append(_zone_from_space(s, room_label))
    return out


def get_zone(zone_id: str, db_path: Path | None = None) -> dict[str, Any]:
    for z in list_zones(db_path):
        if z["zone_id"] == zone_id:
            return z
    raise KeyError(zone_id)


def patch_zone(
    zone_id: str,
    patch: dict[str, Any],
    *,
    db_path: Path | None = None,
    fleet: dict[str, Any] | None = None,
    now: float | None = None,
) -> dict[str, Any]:
    """Rename a zone, edit its notes, or flip its role. Returns the zone, what changed, and
    the journal entry written for a role flip (``None`` otherwise)."""
    zone = get_zone(zone_id, db_path)
    ts = float(now) if now is not None else time.time()
    changed: dict[str, Any] = {}
    entry: dict[str, Any] | None = None

    if zone["kind"] == "room":
        name = patch.get("name")
        if patch.get("role") not in (None, "room"):
            raise ValueError("a room has no role to flip — flip the tents inside it")
        if name is not None:
            label = str(name).strip()[:_MAX_NAME]
            if not label:
                raise ValueError("name required")
            set_room_extra(zone_id, {"name": label}, db_path=db_path)
            changed["name"] = {"from": zone["name"], "to": label}
        return {"zone": get_zone(zone_id, db_path), "changed": changed, "journal_entry": None}

    extra_patch: dict[str, Any] = {}
    if patch.get("name") is not None:
        label = str(patch["name"]).strip()[:_MAX_NAME]
        if not label:
            raise ValueError("name required")
        if label != zone["name"]:
            extra_patch["name"] = label
            changed["name"] = {"from": zone["name"], "to": label}
    if patch.get("notes") is not None:
        notes = str(patch["notes"]).strip()[:_MAX_NOTES]
        if notes != zone["notes"]:
            extra_patch["notes"] = notes
            changed["notes"] = {"from": zone["notes"], "to": notes}
    role = patch.get("role")
    if role is not None:
        role = str(role).strip().lower()
        if role not in ZONE_ROLES:
            raise ValueError(f"role must be one of {', '.join(ZONE_ROLES)}")
        if role != zone["role"]:
            history = list(zone.get("role_history") or [])
            history.append({"from": zone["role"], "to": role, "at": ts})
            extra_patch.update({"role": role, "role_since": ts, "role_history": history[-_HISTORY_KEEP:]})
            changed["role"] = {"from": zone["role"], "to": role}

    if extra_patch:
        set_space_extra(zone_id, extra_patch, db_path=db_path)

    if "role" in changed:
        old, new = changed["role"]["from"], changed["role"]["to"]
        note = f"Role {ROLE_LABEL[old]} → {ROLE_LABEL[new]} — {ROLE_EFFECTS['does']['all'][2]}"
        entry = add_space_entry(
            zone_id,
            ts,
            note,
            source="system",
            tags=["role", new],
            db_path=db_path,
            fleet=fleet,
        )

    return {"zone": get_zone(zone_id, db_path), "changed": changed, "journal_entry": entry}
