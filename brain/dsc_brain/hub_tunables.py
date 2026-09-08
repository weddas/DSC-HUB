"""Hub tunables — brain-owned desired values for the hub ESP's numbers, selects and
policy switches, with the hub's own NVS copy as the built-in fallback.

Operator decision 2026-09-07 (docs/design/plan-settings-2026-09-07.md § Decisions › Hub
tunables). The control loops stay on the hub; only *knowledge of the intended values*
moves here:

* ``hub_tunables`` holds desired per entity. First run adopts whatever the hub reports, so
  an upgrade changes nothing.
* Settings writes go through :func:`set_desired` → validated against the entity's native
  ``min/max/step`` (or ``options``), stored, journaled, pushed through the existing native
  API paths in ``control_ops``.
* The hub's echo (``fleet.hub.values.controls``) gives each row a sync state:
  ``synced`` · ``pending`` (pushed, echo not yet seen) · ``held`` (hub offline, push queued)
  · ``differs`` (the hub reports a value the brain did not write) · ``failed``.
* Reconnect follows the failover rules: nothing is pushed while manual takeover is on or a
  reconnect override is active; queued rows push once the hub is back and the override
  clears. A hub-side change is never silently overwritten — ``differs`` waits for
  :func:`adopt` or :func:`push`.
"""

from __future__ import annotations

import asyncio
import logging
import math
import time
from typing import Any

from .hub_controls import HUB_NUMBER_ENTITY_TO_OID, HUB_SELECT_ENTITY_TO_OID, HUB_SWITCH_ENTITY_TO_OID
from .settings import connect

_logger = logging.getLogger(__name__)

SCHEMA = """
CREATE TABLE IF NOT EXISTS hub_tunables (
  entity_id TEXT PRIMARY KEY,
  desired TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  updated_at REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'operator',
  pending INTEGER NOT NULL DEFAULT 0,
  pushed_at REAL NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT NOT NULL DEFAULT ''
);
"""

PUSH_RETRY_SEC = 60.0
PUSH_MAX_ATTEMPTS = 5
# The echo lags one ingest poll (~5–10 s); a push younger than this with a stale echo is
# still `pending`, not `differs`.
ECHO_GRACE_SEC = 20.0

# Every hub entity the brain holds a desired value for. Fallback metadata mirrors
# firmware/v4/dsc-hub-v4_0.yaml so validation works before the hub has reported attrs.
# `actuates` marks rows whose change can move an appliance or the light at once — the
# SPA confirms those. `section`/`group` place the row in Settings.
TUNABLES: list[dict[str, Any]] = [
    # --- Climate › targets (4×8) ---------------------------------------------------
    {"entity_id": "number.dsc_hub_target_temp", "kind": "number", "label": "4×8 target temperature", "section": "climate", "group": "targets_main", "min": 15, "max": 32, "step": 0.5, "unit": "°C"},
    {"entity_id": "number.dsc_hub_target_temp_min", "kind": "number", "label": "4×8 temp band low", "section": "climate", "group": "targets_main", "min": 15, "max": 32, "step": 0.5, "unit": "°C"},
    {"entity_id": "number.dsc_hub_target_temp_max", "kind": "number", "label": "4×8 temp band high", "section": "climate", "group": "targets_main", "min": 17, "max": 40, "step": 0.5, "unit": "°C"},
    {"entity_id": "number.dsc_hub_rh_target_min", "kind": "number", "label": "4×8 RH minimum", "section": "climate", "group": "targets_main", "min": 20, "max": 90, "step": 1, "unit": "%"},
    {"entity_id": "number.dsc_hub_rh_target_max", "kind": "number", "label": "4×8 RH maximum", "section": "climate", "group": "targets_main", "min": 20, "max": 95, "step": 1, "unit": "%"},
    {"entity_id": "number.dsc_hub_vpd_target_min", "kind": "number", "label": "4×8 VPD minimum", "section": "climate", "group": "targets_main", "min": 0.4, "max": 1.6, "step": 0.1, "unit": "kPa"},
    {"entity_id": "number.dsc_hub_vpd_target_max", "kind": "number", "label": "4×8 VPD maximum", "section": "climate", "group": "targets_main", "min": 0.4, "max": 1.8, "step": 0.1, "unit": "kPa"},
    # --- Climate › targets (2×4) ---------------------------------------------------
    {"entity_id": "number.dsc_hub_clone_target_temp", "kind": "number", "label": "2×4 target temperature", "section": "climate", "group": "targets_clone", "min": 15, "max": 32, "step": 0.5, "unit": "°C"},
    {"entity_id": "number.dsc_hub_clone_target_temp_min", "kind": "number", "label": "2×4 temp band low", "section": "climate", "group": "targets_clone", "min": 15, "max": 32, "step": 0.5, "unit": "°C"},
    {"entity_id": "number.dsc_hub_clone_target_temp_max", "kind": "number", "label": "2×4 temp band high", "section": "climate", "group": "targets_clone", "min": 17, "max": 40, "step": 0.5, "unit": "°C"},
    {"entity_id": "number.dsc_hub_clone_rh_min", "kind": "number", "label": "2×4 RH minimum", "section": "climate", "group": "targets_clone", "min": 20, "max": 90, "step": 1, "unit": "%"},
    {"entity_id": "number.dsc_hub_clone_rh_max", "kind": "number", "label": "2×4 RH maximum", "section": "climate", "group": "targets_clone", "min": 20, "max": 95, "step": 1, "unit": "%"},
    {"entity_id": "number.dsc_hub_clone_vpd_min", "kind": "number", "label": "2×4 VPD minimum", "section": "climate", "group": "targets_clone", "min": 0.2, "max": 1.6, "step": 0.1, "unit": "kPa"},
    {"entity_id": "number.dsc_hub_clone_vpd_max", "kind": "number", "label": "2×4 VPD maximum", "section": "climate", "group": "targets_clone", "min": 0.2, "max": 1.8, "step": 0.1, "unit": "kPa"},
    # --- Climate › control ---------------------------------------------------------
    {"entity_id": "number.dsc_hub_vpd_band_target_hours", "kind": "number", "label": "VPD in-band target", "section": "climate", "group": "control", "min": 0, "max": 24, "step": 0.5, "unit": "h", "description": "Hours per day the hub aims to keep VPD inside the band before it counts the day as missed."},
    {"entity_id": "select.dsc_hub_control_strategy", "kind": "select", "label": "Control strategy", "section": "climate", "group": "control", "actuates": True, "description": "Which reading the climate ladder chases first."},
    {"entity_id": "select.dsc_hub_priority_tent", "kind": "select", "label": "Priority tent", "section": "climate", "group": "control", "actuates": True, "description": "Which tent wins when the room lung cannot satisfy both."},
    {"entity_id": "switch.dsc_hub_humidifier_intake_routing", "kind": "switch", "label": "Humidifier intake routing", "section": "climate", "group": "control", "actuates": True, "description": "Route humidifier output through the intake path instead of the tent directly."},
    # --- Climate › advanced (hysteresis, min-off, ladder, de-strat) -----------------
    {"entity_id": "number.dsc_hub_clone_hum_hysteresis", "kind": "number", "label": "2×4 humidifier hysteresis", "section": "climate", "group": "advanced", "min": 2, "max": 15, "step": 0.5, "unit": "%", "description": "How far RH may overshoot before the clone humidifier releases."},
    {"entity_id": "number.dsc_hub_humidifier_min_off_time", "kind": "number", "label": "Humidifier min off-time", "section": "climate", "group": "advanced", "min": 0, "max": 900, "step": 30, "unit": "s", "description": "Rest the humidifier must take between runs."},
    {"entity_id": "number.dsc_hub_clone_hum_min_off_time", "kind": "number", "label": "2×4 humidifier min off-time", "section": "climate", "group": "advanced", "min": 0, "max": 900, "step": 30, "unit": "s"},
    {"entity_id": "number.dsc_hub_heater_min_off_time", "kind": "number", "label": "Heater min off-time", "section": "climate", "group": "advanced", "min": 0, "max": 900, "step": 30, "unit": "s", "description": "Element protection: the heater may not restart sooner than this."},
    {"entity_id": "number.dsc_hub_ladder_wait_dehum", "kind": "number", "label": "Ladder wait · dehumidifier", "section": "climate", "group": "advanced", "min": 60, "max": 600, "step": 10, "unit": "s", "description": "How long fans get to fix RH before the dehumidifier is asked."},
    {"entity_id": "number.dsc_hub_ladder_wait_hum", "kind": "number", "label": "Ladder wait · humidifier", "section": "climate", "group": "advanced", "min": 60, "max": 600, "step": 10, "unit": "s"},
    {"entity_id": "number.dsc_hub_ladder_wait_heat", "kind": "number", "label": "Ladder wait · heater", "section": "climate", "group": "advanced", "min": 60, "max": 600, "step": 10, "unit": "s"},
    {"entity_id": "number.dsc_hub_ladder_wait_ac", "kind": "number", "label": "Ladder wait · AC", "section": "climate", "group": "advanced", "min": 60, "max": 600, "step": 10, "unit": "s", "oos": "F-001 AC relay on hold"},
    {"entity_id": "switch.dsc_hub_recirc_de_strat_pulse", "kind": "switch", "label": "De-stratification pulse", "section": "climate", "group": "advanced", "actuates": True, "description": "Periodic recirculation burst to mix the room air column."},
    {"entity_id": "number.dsc_hub_de_strat_pulse_period", "kind": "number", "label": "De-strat pulse period", "section": "climate", "group": "advanced", "min": 30, "max": 1800, "step": 30, "unit": "s"},
    {"entity_id": "number.dsc_hub_de_strat_pulse_length", "kind": "number", "label": "De-strat pulse length", "section": "climate", "group": "advanced", "min": 5, "max": 120, "step": 5, "unit": "s"},
    {"entity_id": "number.dsc_hub_de_strat_pulse_level", "kind": "number", "label": "De-strat pulse level", "section": "climate", "group": "advanced", "min": 25, "max": 100, "step": 5, "unit": "%"},
    {"entity_id": "number.dsc_hub_mister_target_hours", "kind": "number", "label": "Mister target hours", "section": "climate", "group": "mister", "min": 0, "max": 24, "step": 0.5, "unit": "h", "oos": "F-002 clone mister on hold"},
    {"entity_id": "number.dsc_hub_mister_min_off_hours", "kind": "number", "label": "Mister min off-hours", "section": "climate", "group": "mister", "min": 0, "max": 24, "step": 0.5, "unit": "h", "oos": "F-002 clone mister on hold"},
    # --- Light -----------------------------------------------------------------------
    {"entity_id": "number.dsc_hub_clone_light_hours", "kind": "number", "label": "2×4 photoperiod hours", "section": "light", "group": "schedule", "min": 0, "max": 24, "step": 1, "unit": "h", "actuates": True},
    {"entity_id": "number.dsc_hub_min_dark_hours", "kind": "number", "label": "Minimum dark hours", "section": "light", "group": "schedule", "min": 2, "max": 12, "step": 0.5, "unit": "h", "description": "Guards the 2×4 dark-violation alert: the clone tent must get at least this much dark."},
    {"entity_id": "number.dsc_hub_sunrise_duration", "kind": "number", "label": "Sunrise ramp", "section": "light", "group": "schedule", "min": 0, "max": 120, "step": 5, "unit": "min"},
    {"entity_id": "number.dsc_hub_sunset_duration", "kind": "number", "label": "Sunset ramp", "section": "light", "group": "schedule", "min": 0, "max": 120, "step": 5, "unit": "min"},
    {"entity_id": "switch.dsc_hub_auto_photoperiod", "kind": "switch", "label": "Automatic photoperiod", "section": "light", "group": "schedule", "actuates": True, "description": "The hub drives the lamp from the schedule. Off leaves the lamp where it is."},
    {"entity_id": "number.dsc_hub_sf1000_target_brightness", "kind": "number", "label": "SF1000 target brightness", "section": "light", "group": "fixtures", "min": 0, "max": 100, "step": 5, "unit": "%", "actuates": True},
    {"entity_id": "number.dsc_hub_sf1000_ramp_floor", "kind": "number", "label": "SF1000 ramp floor", "section": "light", "group": "fixtures", "min": 0, "max": 50, "step": 1, "unit": "%", "description": "Lowest brightness the sunrise/sunset ramp passes through."},
    {"entity_id": "switch.dsc_hub_brain_stage_targets", "kind": "switch", "label": "Brain owns stage presets", "section": "climate", "group": "presets", "description": "When on and the brain is connected, the hub's stage change defers to the brain's preset table below. Off, or with no brain, the hub applies its baked table."},
    # --- Root ------------------------------------------------------------------------
    {"entity_id": "number.dsc_hub_mat_root_zone_low", "kind": "number", "label": "Heat-mat root-zone low", "section": "root", "group": "heatmat", "min": 12, "max": 26, "step": 0.5, "unit": "°C", "description": "Below this the mat is called for."},
    {"entity_id": "number.dsc_hub_mat_root_zone_high", "kind": "number", "label": "Heat-mat root-zone high", "section": "root", "group": "heatmat", "min": 14, "max": 28, "step": 0.5, "unit": "°C", "description": "Above this the mat releases."},
    {"entity_id": "number.dsc_hub_mat_min_off_time", "kind": "number", "label": "Heat-mat min off-time", "section": "root", "group": "heatmat", "min": 0, "max": 1800, "step": 60, "unit": "s"},
    {"entity_id": "number.dsc_hub_ladder_wait_mat", "kind": "number", "label": "Ladder wait · heat mat", "section": "root", "group": "heatmat", "min": 30, "max": 300, "step": 5, "unit": "s"},
    {"entity_id": "switch.dsc_hub_mat_vote_pot_1", "kind": "switch", "label": "Probe 1 may call for the mat", "section": "root", "group": "heatmat", "actuates": True},
    {"entity_id": "switch.dsc_hub_mat_vote_pot_2", "kind": "switch", "label": "Probe 2 may call for the mat", "section": "root", "group": "heatmat", "actuates": True},
    # --- Network ---------------------------------------------------------------------
    {"entity_id": "switch.dsc_hub_lock_wifi_ap", "kind": "switch", "label": "Lock Wi-Fi AP", "section": "network", "group": "hub", "description": "Pin the hub to its preferred access point (BSSID) instead of roaming."},
]

BRAIN_STAGE_SWITCH_ID = "switch.dsc_hub_brain_stage_targets"
TUNABLE_BY_ID: dict[str, dict[str, Any]] = {t["entity_id"]: t for t in TUNABLES}


def _ensure(conn) -> None:
    conn.executescript(SCHEMA)


# ---- fleet access ---------------------------------------------------------------------


def _fleet() -> Any:
    from .fleet_state import get_fleet_state

    return get_fleet_state()


def hub_controls(fleet: Any = None) -> dict[str, dict[str, Any]]:
    f = fleet if fleet is not None else _fleet()
    hub = getattr(f, "hub", None)
    if not hub:
        return {}
    return dict((getattr(hub, "values", None) or {}).get("controls") or {})


def hub_online(fleet: Any = None) -> bool:
    f = fleet if fleet is not None else _fleet()
    hub = getattr(f, "hub", None)
    return bool(hub and getattr(hub, "online", False))


def _takeover_or_override(fleet: Any, controls: dict[str, dict[str, Any]]) -> bool:
    """True while the failover rules say: do not push."""
    try:
        from .hub_failover import get_override

        if get_override().active:
            return True
    except Exception:  # noqa: BLE001
        pass
    ctrl = controls.get("switch.dsc_hub_manual_takeover") or {}
    if str(ctrl.get("state", "")).lower() == "on":
        return True
    try:
        from .compose_store import get_helper

        return str(get_helper("switch.dsc_hub_manual_takeover", "")).lower() == "on"
    except Exception:  # noqa: BLE001
        return False


# ---- metadata + coercion ----------------------------------------------------------------


def metadata(entity_id: str, controls: dict[str, dict[str, Any]] | None = None) -> dict[str, Any]:
    """Native attrs when the hub has reported them, else the firmware fallback table."""
    spec = TUNABLE_BY_ID.get(entity_id) or {"entity_id": entity_id, "kind": entity_id.split(".")[0], "label": entity_id}
    ctrl = (controls or {}).get(entity_id) or {}
    meta = {
        "entity_id": entity_id,
        "kind": spec.get("kind", "number"),
        "label": spec.get("label", entity_id),
        "description": spec.get("description", ""),
        "section": spec.get("section", "climate"),
        "group": spec.get("group", "advanced"),
        "actuates": bool(spec.get("actuates", False)),
        "oos": spec.get("oos"),
    }
    if meta["kind"] == "number":
        meta["min"] = float(ctrl.get("min", spec.get("min", 0)))
        meta["max"] = float(ctrl.get("max", spec.get("max", 100)))
        meta["step"] = float(ctrl.get("step", spec.get("step", 1)))
        meta["unit"] = str(ctrl.get("unit_of_measurement", spec.get("unit", "")))
    elif meta["kind"] == "select":
        meta["options"] = list(ctrl.get("options") or spec.get("options") or [])
    return meta


def coerce(entity_id: str, value: Any, controls: dict[str, dict[str, Any]] | None = None) -> str:
    """Validate + normalise a desired value to its stored string form."""
    meta = metadata(entity_id, controls)
    kind = meta["kind"]
    if kind == "number":
        try:
            v = float(value)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{meta['label']} must be a number") from exc
        if not math.isfinite(v):
            raise ValueError(f"{meta['label']} must be finite")
        lo, hi, step = meta["min"], meta["max"], meta["step"]
        if v < lo or v > hi:
            raise ValueError(f"{meta['label']} must be within {lo:g}–{hi:g} {meta['unit']}".rstrip())
        if step and step > 0:
            v = round(round((v - lo) / step) * step + lo, 6)
        return f"{v:g}"
    if kind == "select":
        s = str(value)
        opts = meta.get("options") or []
        if opts and s not in opts:
            raise ValueError(f"{meta['label']} must be one of {', '.join(opts)}")
        return s
    if kind == "switch":
        if isinstance(value, bool):
            return "on" if value else "off"
        s = str(value).strip().lower()
        if s in ("on", "true", "1", "yes"):
            return "on"
        if s in ("off", "false", "0", "no"):
            return "off"
        raise ValueError(f"{meta['label']} must be on or off")
    raise ValueError(f"unsupported tunable kind {kind}")


def _echo(entity_id: str, controls: dict[str, dict[str, Any]]) -> str | None:
    ctrl = controls.get(entity_id)
    if not ctrl:
        return None
    state = ctrl.get("state")
    if state is None or state == "":
        return None
    kind = metadata(entity_id).get("kind")
    if kind == "number":
        try:
            return f"{float(state):g}"
        except (TypeError, ValueError):
            return str(state)
    if kind == "switch":
        return "on" if str(state).lower() in ("on", "true", "1") else "off"
    return str(state)


def _same(a: str | None, b: str | None, kind: str) -> bool:
    if a is None or b is None:
        return False
    if kind == "number":
        try:
            return abs(float(a) - float(b)) < 1e-6
        except (TypeError, ValueError):
            return a == b
    return a == b


# ---- storage --------------------------------------------------------------------------


def _load(conn) -> dict[str, dict[str, Any]]:
    return {r["entity_id"]: dict(r) for r in conn.execute("SELECT * FROM hub_tunables")}


def _upsert(conn, entity_id: str, **fields: Any) -> None:
    row = conn.execute("SELECT entity_id FROM hub_tunables WHERE entity_id=?", (entity_id,)).fetchone()
    if row is None:
        base = {"desired": "", "unit": "", "updated_at": time.time(), "source": "operator", "pending": 0, "pushed_at": 0, "attempts": 0, "last_error": ""}
        base.update(fields)
        conn.execute(
            "INSERT INTO hub_tunables(entity_id, desired, unit, updated_at, source, pending, pushed_at, attempts, last_error) VALUES(?,?,?,?,?,?,?,?,?)",
            (entity_id, base["desired"], base["unit"], base["updated_at"], base["source"], base["pending"], base["pushed_at"], base["attempts"], base["last_error"]),
        )
    else:
        sets = ", ".join(f"{k}=?" for k in fields)
        conn.execute(f"UPDATE hub_tunables SET {sets} WHERE entity_id=?", (*fields.values(), entity_id))
    conn.commit()


def adopt_missing(controls: dict[str, dict[str, Any]], db_path=None) -> list[str]:
    """First run / new firmware: take the hub's current value as desired for rows we lack."""
    adopted: list[str] = []
    conn = connect(db_path)
    try:
        _ensure(conn)
        have = _load(conn)
        for spec in TUNABLES:
            eid = spec["entity_id"]
            if eid in have:
                continue
            echo = _echo(eid, controls)
            if echo is None:
                continue
            _upsert(conn, eid, desired=echo, unit=metadata(eid, controls).get("unit", ""), updated_at=time.time(), source="adopted", pending=0)
            adopted.append(eid)
    finally:
        conn.close()
    return adopted


def _state_for(row: dict[str, Any] | None, echo: str | None, kind: str, online: bool, now: float) -> str:
    if row is None or not row.get("desired"):
        return "unadopted"
    if not online:
        return "held"
    if _same(row["desired"], echo, kind):
        return "synced"
    if int(row.get("pending") or 0):
        if int(row.get("attempts") or 0) >= PUSH_MAX_ATTEMPTS and row.get("last_error"):
            return "failed"
        return "pending"
    return "differs"


def list_tunables(db_path=None, fleet: Any = None) -> dict[str, Any]:
    f = fleet if fleet is not None else _fleet()
    controls = hub_controls(f)
    online = hub_online(f)
    now = time.time()
    conn = connect(db_path)
    try:
        _ensure(conn)
        rows = _load(conn)
    finally:
        conn.close()
    out: list[dict[str, Any]] = []
    for spec in TUNABLES:
        eid = spec["entity_id"]
        meta = metadata(eid, controls)
        row = rows.get(eid)
        echo = _echo(eid, controls)
        present = eid in controls
        state = _state_for(row, echo, meta["kind"], online, now)
        if not present and online:
            state = "missing"  # the running firmware has no such entity
        out.append(
            {
                **meta,
                "desired": row["desired"] if row else None,
                "hub": echo,
                "state": state,
                "source": row["source"] if row else None,
                "updated_at": row["updated_at"] if row else None,
                "pushed_at": row["pushed_at"] if row else None,
                "last_error": row["last_error"] if row else "",
                "present": present,
            }
        )
    return {
        "hub_online": online,
        "blocked": _takeover_or_override(f, controls) if online else False,
        "brain_owns_stage": brain_owns_stage_targets(controls),
        "rows": out,
    }


def brain_owns_stage_targets(controls: dict[str, dict[str, Any]] | None = None) -> bool:
    """True when the hub runs firmware with the brain-stage switch and it is on."""
    ctrls = controls if controls is not None else hub_controls()
    return _echo(BRAIN_STAGE_SWITCH_ID, ctrls) == "on"


# ---- writes ------------------------------------------------------------------------------


def _journal(note: str) -> None:
    try:
        from .dsc_core_journal import add_core_entry

        add_core_entry(None, note, source="system", tags=["settings", "hub"])
    except Exception:  # noqa: BLE001 — journaling never blocks a write
        _logger.debug("settings journal write failed", exc_info=True)


def set_desired(entity_id: str, value: Any, *, source: str = "operator", db_path=None, journal: bool = True) -> dict[str, Any]:
    """Store a validated desired value and mark it for push. Returns the row view."""
    if entity_id not in TUNABLE_BY_ID:
        raise ValueError(f"{entity_id} is not a hub tunable")
    controls = hub_controls()
    desired = coerce(entity_id, value, controls)
    meta = metadata(entity_id, controls)
    conn = connect(db_path)
    try:
        _ensure(conn)
        prev = _load(conn).get(entity_id)
        _upsert(conn, entity_id, desired=desired, unit=meta.get("unit", ""), updated_at=time.time(), source=source, pending=1, attempts=0, last_error="")
    finally:
        conn.close()
    if journal:
        unit = f" {meta['unit']}" if meta.get("unit") else ""
        was = f"{prev['desired']}{unit}" if prev and prev.get("desired") else "unset"
        _journal(f"Hub setting {meta['label']}: {was} → {desired}{unit} ({source})")
    return _row_view(entity_id, db_path)


def adopt(entity_id: str, db_path=None) -> dict[str, Any]:
    """Take the hub's current value as desired (HUB DIFFERS → SYNCED)."""
    controls = hub_controls()
    echo = _echo(entity_id, controls)
    if echo is None:
        raise ValueError("the hub has not reported this entity")
    conn = connect(db_path)
    try:
        _ensure(conn)
        prev = _load(conn).get(entity_id)
        _upsert(conn, entity_id, desired=echo, unit=metadata(entity_id, controls).get("unit", ""), updated_at=time.time(), source="adopted", pending=0, attempts=0, last_error="")
    finally:
        conn.close()
    meta = metadata(entity_id, controls)
    _journal(f"Hub setting {meta['label']}: adopted the hub's {echo} (was {prev['desired'] if prev else '—'})")
    return _row_view(entity_id, db_path)


def mark_for_push(entity_id: str, db_path=None) -> dict[str, Any]:
    conn = connect(db_path)
    try:
        _ensure(conn)
        if entity_id not in _load(conn):
            raise ValueError("no desired value to push")
        _upsert(conn, entity_id, pending=1, attempts=0, last_error="")
    finally:
        conn.close()
    return _row_view(entity_id, db_path)


def _row_view(entity_id: str, db_path=None) -> dict[str, Any]:
    for row in list_tunables(db_path)["rows"]:
        if row["entity_id"] == entity_id:
            return row
    raise ValueError(f"{entity_id} is not a hub tunable")


# ---- push -----------------------------------------------------------------------------------


async def _push_entity(entity_id: str, desired: str) -> None:
    """Write one desired value through the existing native-API paths."""
    from . import control_ops

    kind = metadata(entity_id).get("kind")
    if kind == "number":
        await control_ops._hub_number(entity_id, float(desired))  # noqa: SLF001
    elif kind == "select":
        await control_ops._hub_select(entity_id, desired)  # noqa: SLF001
    elif kind == "switch":
        await control_ops._hub_switch(entity_id, desired == "on")  # noqa: SLF001
    else:
        raise ValueError(f"unsupported tunable kind {kind}")


async def push_now(entity_id: str, db_path=None, *, force: bool = False) -> dict[str, Any]:
    """Push one pending row immediately (Settings write, or the operator's Push action)."""
    f = _fleet()
    controls = hub_controls(f)
    if not hub_online(f):
        return _row_view(entity_id, db_path)  # stays held; the poll loop pushes on reconnect
    if not force and _takeover_or_override(f, controls):
        return _row_view(entity_id, db_path)
    conn = connect(db_path)
    try:
        _ensure(conn)
        row = _load(conn).get(entity_id)
    finally:
        conn.close()
    if not row or not row.get("desired"):
        raise ValueError("no desired value to push")
    try:
        await _push_entity(entity_id, row["desired"])
        _set_push_result(entity_id, ok=True, db_path=db_path)
    except Exception as exc:  # noqa: BLE001
        _set_push_result(entity_id, ok=False, error=str(exc), db_path=db_path)
    return _row_view(entity_id, db_path)


def _set_push_result(entity_id: str, *, ok: bool, error: str = "", db_path=None) -> None:
    conn = connect(db_path)
    try:
        _ensure(conn)
        row = _load(conn).get(entity_id) or {}
        attempts = int(row.get("attempts") or 0) + 1
        _upsert(conn, entity_id, pushed_at=time.time(), attempts=attempts, last_error="" if ok else error)
    finally:
        conn.close()


# ---- reconcile (called from the ESPHome ingest loop after every poll) ---------------------

_last_stage: str | None = None


async def on_fleet_poll(fleet: Any, db_path=None) -> dict[str, Any]:
    """Adopt new entities, confirm echoes, retry due pushes, and stamp stage presets.

    Never raises — the ingest loop must not die because a push failed.
    """
    global _last_stage
    summary: dict[str, Any] = {"adopted": [], "confirmed": [], "pushed": [], "stage": None}
    try:
        controls = hub_controls(fleet)
        if not hub_online(fleet) or not controls:
            return summary
        summary["adopted"] = adopt_missing(controls, db_path)
        now = time.time()
        conn = connect(db_path)
        try:
            _ensure(conn)
            rows = _load(conn)
            # Echo confirmations.
            for eid, row in rows.items():
                if not int(row.get("pending") or 0):
                    continue
                if _same(row["desired"], _echo(eid, controls), metadata(eid).get("kind", "number")):
                    _upsert(conn, eid, pending=0, attempts=0, last_error="")
                    summary["confirmed"].append(eid)
            rows = _load(conn)
        finally:
            conn.close()

        # Stage change → brain-owned presets (only when the hub defers to us).
        stage = str((controls.get("select.dsc_hub_grow_stage") or {}).get("state") or "")
        if stage and stage != _last_stage:
            if _last_stage is not None and brain_owns_stage_targets(controls):
                summary["stage"] = await apply_stage_targets(stage, db_path=db_path)
            _last_stage = stage

        if _takeover_or_override(fleet, controls):
            return summary
        try:
            from .demo_mode import is_demo_mode

            if is_demo_mode():
                return summary  # software only: no pushes to a simulated hub
        except Exception:  # noqa: BLE001
            pass
        for eid, row in rows.items():
            if not int(row.get("pending") or 0):
                continue
            if int(row.get("attempts") or 0) >= PUSH_MAX_ATTEMPTS:
                continue
            pushed_at = float(row.get("pushed_at") or 0)
            if pushed_at and now - pushed_at < PUSH_RETRY_SEC:
                continue  # pushed recently — waiting on the echo
            if eid not in controls:
                continue  # firmware lacks it; stays pending/missing without burning attempts
            try:
                await _push_entity(eid, row["desired"])
                _set_push_result(eid, ok=True, db_path=db_path)
                summary["pushed"].append(eid)
            except Exception as exc:  # noqa: BLE001
                _set_push_result(eid, ok=False, error=str(exc), db_path=db_path)
    except Exception as exc:  # noqa: BLE001
        _logger.warning("hub tunables reconcile failed: %s", exc)
    return summary


async def apply_stage_targets(stage: str, *, db_path=None, push: bool = True) -> dict[str, Any] | None:
    """Write the brain's preset for `stage` into the five 4×8 target numbers."""
    from .stage_rail import STAGE_TARGET_ENTITIES, targets_for_stage

    targets = targets_for_stage(stage, db_path)
    if targets is None:
        return None
    written: dict[str, str] = {}
    for field, eid in STAGE_TARGET_ENTITIES.items():
        try:
            row = set_desired(eid, targets[field], source=f"stage:{stage}", db_path=db_path, journal=False)
            written[eid] = str(row["desired"])
        except ValueError as exc:
            _logger.warning("stage preset %s → %s rejected: %s", stage, eid, exc)
    parts = ", ".join(f"{k.rsplit('.', 1)[-1]}={v}" for k, v in written.items())
    _journal(f"Stage {stage}: brain preset applied to 4\u00d78 targets ({parts})")
    if push:
        for eid in written:
            try:
                await push_now(eid, db_path=db_path)
            except Exception as exc:  # noqa: BLE001
                _logger.debug("stage preset push %s failed: %s", eid, exc)
    return {"stage": stage, "written": written}


def reset_for_tests() -> None:
    global _last_stage
    _last_stage = None


def run_sync(coro):
    """Helper for synchronous call sites (tests, CLI)."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)
    return loop.create_task(coro)
