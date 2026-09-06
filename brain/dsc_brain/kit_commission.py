"""Kit setup / commission — SD installer 8.0.0."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Literal

from . import __version__
from .fleet_state import get_fleet_state
from .network_apply import eth_carrier_up
from .paths import SURFACE_VERSION
from .settings import get_setting, set_setting
from .zigbee_mqtt import get_zigbee_health

SetupPhase = Literal["welcome", "usb_flash", "fleet_join", "zigbee", "go_live"]

VALID_PHASES: tuple[SetupPhase, ...] = (
    "welcome",
    "usb_flash",
    "fleet_join",
    "zigbee",
    "go_live",
)

KEY_COMMISSIONED = "kit_commissioned"
KEY_PHASE = "kit_setup_phase"
KEY_DEBT = "kit_setup_debt"


def setup_health(
    *,
    fleet_online: bool | None = None,
    zigbee_up: bool | None = None,
    eth_up: bool | None = None,
    cannalib_remote_ok: bool = False,
    brain_ok: bool = True,
    mosquitto_ok: bool = True,
    z2m_ok: bool | None = None,
) -> dict[str, Any]:
    """Setup health snapshot. Catalog is always thin-local and never blocking."""
    if fleet_online is None:
        try:
            hub = get_fleet_state().to_dict().get("hub") or {}
            fleet_online = bool(hub.get("online"))
        except Exception:  # noqa: BLE001
            fleet_online = False
    if zigbee_up is None:
        try:
            zigbee_up = bool((get_zigbee_health() or {}).get("radio_up"))
        except Exception:  # noqa: BLE001
            zigbee_up = False
    if eth_up is None:
        eth_up = eth_carrier_up()
    if z2m_ok is None:
        z2m_ok = bool(zigbee_up)

    return {
        "brain_ok": bool(brain_ok),
        "version": __version__,
        "surface": SURFACE_VERSION,
        "mosquitto_ok": bool(mosquitto_ok),
        "z2m_ok": bool(z2m_ok),
        "fleet_online": bool(fleet_online),
        "zigbee_up": bool(zigbee_up),
        "eth_up": bool(eth_up),
        "catalog": {
            "mode": "thin_local",
            "blocking": False,
            "remote_ok": bool(cannalib_remote_ok),
        },
    }


def _debt_list(db_path: Path | None = None) -> list[str]:
    raw = get_setting(KEY_DEBT, "[]", db_path)
    try:
        data = json.loads(raw or "[]")
    except json.JSONDecodeError:
        return []
    if not isinstance(data, list):
        return []
    return [str(x) for x in data]


def _reconcile_flash_debt(debt: list[str], db_path: Path | None) -> list[str]:
    """Drop ``not_flashed:<seat>`` items for seats that are actually online at the
    expected firmware — a device flashed outside the wizard (or a resumed setup)
    should not leave a stale debt that makes a live fleet look half-commissioned.
    """
    flash_debt = [d for d in debt if d.startswith("not_flashed:")]
    if not flash_debt:
        return debt
    try:
        from .kit_update import fleet_firmware_status

        fw = {d["seat_id"]: d for d in fleet_firmware_status().get("devices", [])}
    except Exception:  # noqa: BLE001 — never let reconciliation break the endpoint
        return debt
    cleared = {
        d
        for d in flash_debt
        if (row := fw.get(d.split(":", 1)[1])) is not None
        and row.get("online")
        and row.get("running")
        and row.get("running") == row.get("expected")
    }
    if not cleared:
        return debt
    pruned = [d for d in debt if d not in cleared]
    set_setting(KEY_DEBT, json.dumps(pruned), db_path)
    return pruned


def get_setup_state(db_path: Path | None = None) -> dict[str, Any]:
    commissioned = get_setting(KEY_COMMISSIONED, "false", db_path).lower() == "true"
    phase_raw = get_setting(KEY_PHASE, "welcome", db_path) or "welcome"
    phase: str = phase_raw if phase_raw in VALID_PHASES else "welcome"
    return {
        "commissioned": commissioned,
        "phase": phase,
        "debt": _reconcile_flash_debt(_debt_list(db_path), db_path),
        "version": __version__,
        "surface": SURFACE_VERSION,
    }


def set_setup_phase(phase: str, db_path: Path | None = None) -> dict[str, Any]:
    if phase not in VALID_PHASES:
        raise ValueError(f"invalid phase {phase!r}; expected one of {VALID_PHASES}")
    set_setting(KEY_PHASE, phase, db_path)
    return get_setup_state(db_path)


def add_setup_debt(item: str, db_path: Path | None = None) -> dict[str, Any]:
    debt = _debt_list(db_path)
    if item and item not in debt:
        debt.append(item)
        set_setting(KEY_DEBT, json.dumps(debt), db_path)
    return get_setup_state(db_path)


def mark_commissioned(
    *,
    require_hub_online: bool = False,
    health: dict[str, Any] | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Validate go-live gates then set commissioned.

    Always requires brain_ok + mosquitto_ok + z2m_ok.
    Hub online required only when require_hub_online (hub flashed / not skipped).
    Catalog never blocks.
    """
    h = health if health is not None else setup_health()
    if not h.get("brain_ok"):
        raise ValueError("brain health failed — cannot commission")
    if not h.get("mosquitto_ok"):
        raise ValueError("mosquitto not ok — cannot commission")
    if not h.get("z2m_ok"):
        raise ValueError("zigbee2mqtt / radio not ok — cannot commission")
    if require_hub_online and not h.get("fleet_online"):
        raise ValueError("hub offline — cannot commission while hub is expected")
    set_setting(KEY_COMMISSIONED, "true", db_path)
    set_setting(KEY_PHASE, "go_live", db_path)
    return get_setup_state(db_path)
