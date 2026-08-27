"""Sensor trust mirrors — stuck pots, peer MAD, DHT disagree (N-020..N-023).

Soak-chosen thresholds (7.3 pass):
  N-020 stuck: |rate| <= 0.02 %/h for 45 min
  N-021 peer MAD: divergence > helper mad_pct for 20 min (probe stations excluded)
  N-022 DHT disagree: tent vs room delta > helper for 15 min, clear after 5 min agreement
  N-023 tank bias: handled in Calibrate tank tab (EC/pH bias entities)
"""

from __future__ import annotations

import statistics
import time
from typing import Any

from .compose_store import get_helper
from .event_log import record_grow_log
from .settings import list_history

_STUCK_RATE_MAX = 0.02  # %/h — matches HA dsc_v4_sensor_trust
_STUCK_ON_SEC = 45 * 60
_MAD_ON_SEC = 20 * 60
_DHT_ON_SEC = 15 * 60
_DHT_OFF_SEC = 5 * 60

_prev_alert: dict[str, bool] = {}
_stuck_since: dict[int, float] = {}
_mad_since: float | None = None
_dht_raw_since: float | None = None
_dht_clear_since: float | None = None


def _helper_float(key: str, default: float) -> float:
    raw = get_helper(key, str(default))
    try:
        return float(raw)
    except (TypeError, ValueError):
        return default


def _pot_in_service(inventory: list[dict[str, Any]] | None, pot_n: int) -> bool:
    row = next((r for r in (inventory or []) if r.get("seat_id") == f"pot{pot_n}"), None)
    if row is not None:
        return bool(row.get("in_service", True))
    return get_helper(f"input_boolean.dsc_pot{pot_n}_in_service", "on") == "on"


def _is_probe_station(inventory: list[dict[str, Any]] | None, pot_n: int) -> bool:
    row = next((r for r in (inventory or []) if r.get("seat_id") == f"pot{pot_n}"), None)
    if not row:
        return False
    extra = row.get("extra") or {}
    if isinstance(extra, str):
        import json

        try:
            extra = json.loads(extra)
        except json.JSONDecodeError:
            extra = {}
    return extra.get("role") == "probe_station"


def _moisture_rate_per_hour(pot_n: int) -> float | None:
    since = time.time() - 6 * 3600
    rows = sorted(list_history(f"pot{pot_n}", "moisture_pct", since, limit=500), key=lambda r: r["ts"])
    if len(rows) < 2:
        return None
    first, last = rows[0], rows[-1]
    dt_h = max((last["ts"] - first["ts"]) / 3600.0, 1 / 60)
    return (float(last["value"]) - float(first["value"])) / dt_h


def _max_peer_divergence(values: list[float]) -> float | None:
    if len(values) < 2:
        return None
    med = statistics.median(values)
    return max(abs(v - med) for v in values)


def _hub_climate(fleet: Any) -> dict[str, float | None]:
    hub = fleet.hub.values if fleet.hub else {}
    out: dict[str, float | None] = {}
    for key, field in (
        ("tent_t", "temp_c"),
        ("room_t", "room_temp_c"),
        ("clone_t", "clone_temp_c"),
        ("tent_rh", "rh_pct"),
        ("room_rh", "room_rh_pct"),
        ("clone_rh", "clone_rh_pct"),
    ):
        raw = hub.get(field)
        try:
            out[key] = float(raw) if raw is not None else None
        except (TypeError, ValueError):
            out[key] = None
    return out


def _dht_disagree_raw(climate: dict[str, float | None]) -> bool:
    dt = _helper_float("input_number.dsc_dht_delta_t_c", 4.0)
    dr = _helper_float("input_number.dsc_dht_delta_rh", 15.0)
    temps = [v for k, v in climate.items() if k.endswith("_t") and v is not None]
    rhs = [v for k, v in climate.items() if k.endswith("_rh") and v is not None]
    tspan = max(temps) - min(temps) if len(temps) >= 2 else 0.0
    rspan = max(rhs) - min(rhs) if len(rhs) >= 2 else 0.0
    return tspan >= dt or rspan >= dr


def _hysteresis_on(
    *,
    key: str,
    raw: bool,
    on_sec: float,
    off_sec: float,
) -> bool:
    global _dht_raw_since, _dht_clear_since
    if key != "dht_disagreement":
        return raw

    now = time.time()
    prev = _prev_alert.get(key, False)
    if raw:
        _dht_clear_since = None
        if _dht_raw_since is None:
            _dht_raw_since = now
        return (now - _dht_raw_since) >= on_sec

    _dht_raw_since = None
    if prev:
        if _dht_clear_since is None:
            _dht_clear_since = now
        return (now - _dht_clear_since) < off_sec

    _dht_clear_since = None
    return False


def _edge_log(key: str, active: bool, message: str) -> None:
    prev = _prev_alert.get(key, False)
    if active and not prev:
        record_grow_log(message)
    _prev_alert[key] = active


def emit_sensor_trust(
    states: dict[str, dict[str, Any]],
    fleet: Any,
    *,
    set_entity: Any,
    inventory: list[dict[str, Any]] | None = None,
) -> None:
    """Pi-native trust binaries + grow-log edges (mirrors dsc_v4_sensor_trust.yaml)."""
    global _mad_since

    now = time.time()
    ph_vals: list[float] = []
    ec_vals: list[float] = []
    moist_vals: list[float] = []

    for n in range(1, 5):
        if not _pot_in_service(inventory, n):
            set_entity(states, f"binary_sensor.dsc_pot{n}_sensor_stuck", False)
            set_entity(states, f"binary_sensor.dsc_pot{n}_untrusted", False)
            _stuck_since.pop(n, None)
            continue

        probe_station = _is_probe_station(inventory, n)

        pot = (fleet.pots or {}).get(f"pot{n}")
        moisture = pot.values.get("moisture_pct") if pot and pot.online else None
        rate = _moisture_rate_per_hour(n) if moisture is not None and not probe_station else None
        stuck_raw = (
            rate is not None
            and abs(rate) < _STUCK_RATE_MAX
            and moisture is not None
        )
        if stuck_raw:
            if n not in _stuck_since:
                _stuck_since[n] = now
            stuck = (now - _stuck_since[n]) >= _STUCK_ON_SEC
        else:
            _stuck_since.pop(n, None)
            stuck = False

        set_entity(states, f"binary_sensor.dsc_pot{n}_sensor_stuck", stuck)
        set_entity(states, f"binary_sensor.dsc_pot{n}_untrusted", stuck)
        _edge_log(
            f"pot{n}_stuck",
            stuck,
            f"⚠ Pot {n} soil moisture flatline — probe may be stuck",
        )

        if pot and pot.online and not probe_station:
            for field, bucket in (("ph", ph_vals), ("ec_us", ec_vals), ("moisture_pct", moist_vals)):
                raw = pot.values.get(field)
                if raw is None:
                    continue
                try:
                    bucket.append(float(raw))
                except (TypeError, ValueError):
                    pass

    ph_div = _max_peer_divergence(ph_vals)
    ec_div = _max_peer_divergence(ec_vals)
    moist_div = _max_peer_divergence(moist_vals)

    if ph_div is not None:
        set_entity(states, "sensor.dsc_peer_divergence_ph", round(ph_div, 2), attributes={"unit_of_measurement": "pH"})
    if ec_div is not None:
        set_entity(states, "sensor.dsc_peer_divergence_ec", round(ec_div, 0), attributes={"unit_of_measurement": "µS/cm"})
    if moist_div is not None:
        set_entity(states, "sensor.dsc_peer_divergence_moisture", round(moist_div, 1), attributes={"unit_of_measurement": "%"})

    mad_ph = _helper_float("input_number.dsc_trust_mad_ph", 0.6)
    mad_ec = _helper_float("input_number.dsc_trust_mad_ec", 250.0)
    mad_m = _helper_float("input_number.dsc_trust_mad_moisture", 12.0)
    mad_raw = (
        (ph_div is not None and ph_div >= mad_ph)
        or (ec_div is not None and ec_div >= mad_ec)
        or (moist_div is not None and moist_div >= mad_m)
    )
    if mad_raw:
        if _mad_since is None:
            _mad_since = now
        mad_alert = (now - _mad_since) >= _MAD_ON_SEC
    else:
        _mad_since = None
        mad_alert = False

    summary = (
        f"ΔpH {ph_div} · ΔEC {ec_div} · ΔM {moist_div}%"
        if ph_div is not None and ec_div is not None and moist_div is not None
        else "Need ≥2 in-service pots with readings"
    )
    set_entity(states, "sensor.dsc_peer_divergence_summary", summary)
    set_entity(states, "binary_sensor.dsc_peer_mad_alert", mad_alert)
    _edge_log(
        "peer_mad",
        mad_alert,
        f"⚠ Peer probe divergence — {summary}",
    )

    climate = _hub_climate(fleet)
    dht_raw = _dht_disagree_raw(climate)
    dht_alert = _hysteresis_on(
        key="dht_disagreement",
        raw=dht_raw,
        on_sec=_DHT_ON_SEC,
        off_sec=_DHT_OFF_SEC,
    )
    set_entity(
        states,
        "binary_sensor.dsc_dht_disagreement",
        dht_alert,
        attributes={"note": "Cue only — does not trip failsafe. Check Tent/Room/Clone DHT placement."},
    )
    _edge_log(
        "dht_disagreement",
        dht_alert,
        "⚠ DHT disagreement — Tent/Room/Clone ΔT or ΔRH exceeded threshold (climate cue only)",
    )
