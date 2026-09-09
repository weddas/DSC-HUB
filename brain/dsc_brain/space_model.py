"""Space (tent) + attached equipment — local SoT for photoperiod/energy."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import default_db, DEFAULT_DB
from .db import open_db, schema_once

# height_cm is what turns a footprint into a volume, and a volume is what turns airflow
# into air changes per hour. 210 cm is the height of both tent models in the twin
# (grow-tent-240x120x210, grow-tent-120x60x210) and the common size for both footprints —
# a DEFAULT the operator can correct, not a measurement. The ACH sensors say which height
# they used so a wrong one is visible rather than silently scaling every number.
DEFAULT_TENT_HEIGHT_CM = 210.0

KIT_SPACES: tuple[dict[str, Any], ...] = (
    {
        "space_id": "4x8",
        "kind": "tent",
        "size_label": "4×8",
        "size_m2": 2.97,
        "extra": {"height_cm": DEFAULT_TENT_HEIGHT_CM},
    },
    {
        "space_id": "2x4",
        "kind": "tent",
        "size_label": "2×4",
        "size_m2": 0.74,
        "extra": {"height_cm": DEFAULT_TENT_HEIGHT_CM},
    },
)


def space_volume_m3(space: dict[str, Any]) -> float:
    """Footprint x height. 0 when either is unknown — never a guessed volume."""
    try:
        area = float(space.get("size_m2") or 0)
    except (TypeError, ValueError):
        return 0.0
    extra = space.get("extra") or {}
    try:
        height_cm = float(extra.get("height_cm") or 0)
    except (TypeError, ValueError):
        height_cm = 0.0
    if height_cm <= 0:
        height_cm = DEFAULT_TENT_HEIGHT_CM
    if area <= 0:
        return 0.0
    return round(area * (height_cm / 100.0), 3)

# ---- Device tiers ----------------------------------------------------------------------
# plan-spatial-layout §2. A device the brain can PLACE is not necessarily one it can DRIVE:
# the hub has a fixed number of PWM channels and relays, and beyond those a fan is either on
# a smart plug (on/off, often with real power metering) or simply present. All three cost
# money and move air; only one has a control. Blurring them is how a UI ends up offering a
# button that does nothing.
DEVICE_TIERS: tuple[str, ...] = ("driven", "switched", "known")

TIER_NOTE: dict[str, str] = {
    "driven": "Brain sets its level and reads its state back.",
    "switched": "On/off only, through a smart plug. The brain cannot set its level.",
    "known": "Not controlled at all — it still draws power and moves air.",
}

DEVICE_KINDS: tuple[str, ...] = (
    "fan",
    "light",
    "filter",
    "heater",
    "humidifier",
    "dehumidifier",
    "pump",
    "sensor",
    "camera",
    "other",
)


def normalise_device(device: dict[str, Any]) -> dict[str, Any]:
    """Validate the tier/binding pair, which is the part that must not be fudged.

    A `driven` or `switched` device is defined by having something to drive; a `known` one is
    defined by having nothing. Storing a binding on a `known` device (or none on a driven
    one) produces a row that claims a control it does not have, which is exactly what the
    tier exists to prevent.
    """
    out = dict(device)
    kind = str(out.get("kind") or "").strip().lower()
    if kind and kind not in DEVICE_KINDS:
        raise ValueError(f"unknown device kind {kind!r}")
    tier = str(out.get("tier") or "").strip().lower()
    if tier and tier not in DEVICE_TIERS:
        raise ValueError(f"unknown device tier {tier!r} (expected one of {', '.join(DEVICE_TIERS)})")
    binding = str(out.get("binding") or "").strip()

    if tier in ("driven", "switched") and not binding:
        raise ValueError(f"a {tier} device needs a binding — the entity or plug the brain talks to")
    if tier == "known" and binding:
        raise ValueError("a known device has no binding: it is not controlled by anything")

    out["kind"] = kind
    out["tier"] = tier
    out["binding"] = binding
    out["role"] = str(out.get("role") or "").strip()
    return out


def device_controllable(device: dict[str, Any]) -> bool:
    """True only when the brain has something to press. Unknown tier is NOT controllable.

    The safe direction: a row that has not said what it is gets no control rendered, rather
    than a control that silently does nothing.
    """
    extra = device.get("extra") or {}
    tier = str(extra.get("tier") or "").strip().lower()
    return tier in ("driven", "switched") and bool(str(extra.get("binding") or "").strip())


# Researched / kit nameplate defaults — operator Update in Settings.
KIT_DEVICE_DEFAULTS: tuple[dict[str, Any], ...] = (
    {
        "space_id": "2x4",
        "device_id": "sf1000",
        "label": "SF1000",
        "watts": 100.0,
        "duty_source": "photoperiod",
        "enabled": True,
        # CannaLib lights-catalog record this lamp is; the Light page's maker PPFD card keys off it.
        "extra": {
            "catalog_id": "spider_farmer_sf1000",
            "kind": "light",
            "role": "canopy_light",
            "tier": "driven",
            "binding": "light.dsc_hub_sf1000_dimmer",
        },
    },
    {
        "space_id": "4x8",
        "device_id": "main_fixture",
        "label": "4×8 fixture (nameplate)",
        "watts": 480.0,
        "duty_source": "photoperiod",
        "enabled": True,
        # A nameplate entry: it lights the 4x8 and costs 480 W, and the brain drives no part
        # of it. Exactly the case the "known" tier exists for.
        "extra": {"kind": "light", "role": "canopy_light", "tier": "known", "binding": ""},
    },
)


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or default_db()
    return open_db(path)


def init_space_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        if not schema_once(conn, "space_model"):
            return
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS space (
              space_id TEXT PRIMARY KEY,
              kind TEXT NOT NULL DEFAULT 'tent',
              size_label TEXT NOT NULL DEFAULT '',
              size_m2 REAL,
              extra_json TEXT NOT NULL DEFAULT '{}',
              updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS space_device (
              space_id TEXT NOT NULL,
              device_id TEXT NOT NULL,
              label TEXT NOT NULL DEFAULT '',
              watts REAL NOT NULL DEFAULT 0,
              duty_source TEXT NOT NULL DEFAULT 'photoperiod',
              enabled INTEGER NOT NULL DEFAULT 1,
              extra_json TEXT NOT NULL DEFAULT '{}',
              updated_at REAL NOT NULL,
              PRIMARY KEY (space_id, device_id)
            );
            """
        )
        conn.commit()


def list_spaces(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_space_tables(db_path)
    with _connect(db_path) as conn:
        cols = {r[1] for r in conn.execute("PRAGMA table_info(space)").fetchall()}
        has_room = "room_id" in cols
        if has_room:
            rows = conn.execute(
                "SELECT space_id, kind, size_label, size_m2, extra_json, updated_at, room_id FROM space ORDER BY space_id"
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT space_id, kind, size_label, size_m2, extra_json, updated_at FROM space ORDER BY space_id"
            ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        try:
            extra = json.loads(r["extra_json"] or "{}")
        except json.JSONDecodeError:
            extra = {}
        item = {
            "space_id": r["space_id"],
            "kind": r["kind"],
            "size_label": r["size_label"],
            "size_m2": r["size_m2"],
            "extra": extra,
            "updated_at": r["updated_at"],
        }
        if has_room:
            item["room_id"] = r["room_id"]
        out.append(item)
    return out


def ensure_kit_spaces(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_space_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        for spec in KIT_SPACES:
            conn.execute(
                """
                INSERT INTO space(space_id, kind, size_label, size_m2, extra_json, updated_at)
                VALUES(?, ?, ?, ?, ?, ?)
                ON CONFLICT(space_id) DO UPDATE SET
                  kind=excluded.kind,
                  size_label=excluded.size_label,
                  size_m2=excluded.size_m2
                """,
                (
                    spec["space_id"],
                    spec["kind"],
                    spec["size_label"],
                    spec["size_m2"],
                    json.dumps(spec.get("extra") or {}, separators=(",", ":")),
                    now,
                ),
            )
        for dev in KIT_DEVICE_DEFAULTS:
            existing = conn.execute(
                "SELECT extra_json FROM space_device WHERE space_id=? AND device_id=?",
                (dev["space_id"], dev["device_id"]),
            ).fetchone()
            if existing:
                # The kit devices predate kind/role/tier/binding, so on any existing install
                # they carry none and the device list would show two "tier not set" rows for
                # kit we already know the answer for. Fill in ONLY the keys that are absent:
                # watts, label and any operator-set field are never touched, and a tier the
                # operator has already chosen wins over ours.
                try:
                    have = json.loads(existing["extra_json"] or "{}")
                except (TypeError, ValueError, json.JSONDecodeError):
                    have = {}
                missing = {k: v for k, v in (dev.get("extra") or {}).items() if k not in have}
                if missing:
                    conn.execute(
                        "UPDATE space_device SET extra_json=?, updated_at=? WHERE space_id=? AND device_id=?",
                        (
                            json.dumps({**have, **missing}, separators=(",", ":")),
                            now,
                            dev["space_id"],
                            dev["device_id"],
                        ),
                    )
                continue
            conn.execute(
                """
                INSERT INTO space_device(space_id, device_id, label, watts, duty_source, enabled, extra_json, updated_at)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    dev["space_id"],
                    dev["device_id"],
                    dev["label"],
                    float(dev["watts"]),
                    dev["duty_source"],
                    1 if dev.get("enabled", True) else 0,
                    json.dumps(dev.get("extra") or {}, separators=(",", ":")),
                    now,
                ),
            )
        conn.commit()
    return list_spaces(db_path)


def delete_space_device(space_id: str, device_id: str, *, db_path: Path | None = None) -> bool:
    """Forget a device. Returns False when there was nothing to forget.

    This removes the brain's *record* of the device, not the device: a driven fan keeps
    running on whatever the hub told it. What stops is counting its power and its airflow.
    """
    init_space_tables(db_path)
    with _connect(db_path) as conn:
        cur = conn.execute(
            "DELETE FROM space_device WHERE space_id=? AND device_id=?",
            (str(space_id), str(device_id)),
        )
        conn.commit()
        return bool(cur.rowcount)


def list_space_devices(space_id: str, *, db_path: Path | None = None) -> list[dict[str, Any]]:
    init_space_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT space_id, device_id, label, watts, duty_source, enabled, extra_json, updated_at
            FROM space_device WHERE space_id=? ORDER BY device_id
            """,
            (str(space_id),),
        ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        try:
            extra = json.loads(r["extra_json"] or "{}")
        except json.JSONDecodeError:
            extra = {}
        out.append(
            {
                "space_id": r["space_id"],
                "device_id": r["device_id"],
                "label": r["label"],
                "watts": float(r["watts"]),
                "duty_source": r["duty_source"],
                "enabled": bool(r["enabled"]),
                "extra": extra,
                "updated_at": r["updated_at"],
            }
        )
    return out


def upsert_space_device(
    space_id: str,
    device: dict[str, Any],
    *,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_space_tables(db_path)
    ensure_kit_spaces(db_path)
    device_id = str(device.get("device_id") or "").strip()
    if not device_id:
        raise ValueError("device_id required")
    now = time.time()
    # Absent keys keep whatever the row already holds. This is reached as a PATCH — the
    # device editor sends only the field it is changing — and defaulting to zero instead
    # silently wiped a device's wattage every time its tier was changed.
    prior = next(
        (d for d in list_space_devices(space_id, db_path=db_path) if d["device_id"] == device_id),
        None,
    ) or {}
    label = str(device.get("label") or prior.get("label") or device_id)
    watts = float(device["watts"] if device.get("watts") is not None else prior.get("watts") or 0.0)
    duty_source = str(device.get("duty_source") or prior.get("duty_source") or "photoperiod")
    enabled_in = device.get("enabled", prior.get("enabled", True))
    enabled = 1 if enabled_in else 0
    extra = dict(device.get("extra")) if isinstance(device.get("extra"), dict) else dict(prior.get("extra") or {})
    # kind/role/tier/binding live in extra alongside catalog_id, the pattern the SF1000 lamp
    # already set. Validated here so a bad tier/binding pair can never reach the store.
    if any(k in extra for k in ("kind", "role", "tier", "binding")):
        extra.update(normalise_device(extra))
    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO space_device(space_id, device_id, label, watts, duty_source, enabled, extra_json, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(space_id, device_id) DO UPDATE SET
              label=excluded.label,
              watts=excluded.watts,
              duty_source=excluded.duty_source,
              enabled=excluded.enabled,
              extra_json=excluded.extra_json,
              updated_at=excluded.updated_at
            """,
            (
                str(space_id),
                device_id,
                label,
                watts,
                duty_source,
                enabled,
                json.dumps(extra, separators=(",", ":")),
                now,
            ),
        )
        conn.commit()
    devices = list_space_devices(space_id, db_path=db_path)
    return next(d for d in devices if d["device_id"] == device_id)
