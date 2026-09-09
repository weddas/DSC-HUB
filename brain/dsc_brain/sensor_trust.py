"""Sensor trust mirrors — stuck pots, peer MAD, DHT disagree (N-020..N-023).

Soak-chosen thresholds (7.3 pass):
  N-020 stuck: |rate| <= 0.02 %/h for 45 min
  N-021 peer MAD: divergence > helper mad_pct for 20 min (probe stations excluded)
  N-022 DHT disagree: tent vs room delta > helper for 15 min, clear after 5 min agreement
  N-023 tank bias: handled in Calibrate tank tab (EC/pH bias entities)
"""

from __future__ import annotations

import statistics
import math
import time
from typing import Any

from .compose_store import get_helper
from .event_log import record_grow_log
from .settings import last_change_ts, last_reading_ts, list_history

_STUCK_RATE_MAX = 0.02  # %/h — legacy slope test, kept for the rate sensor only
_STUCK_ON_SEC = 45 * 60
# Flatline detection: over the window the probe must have moved less than this span with
# at least this many samples spanning at least this many hours. A dead Modbus probe that
# republishes its last read (with a few jitter values) is FLAT; the old first-minus-last
# slope test needed the endpoints to agree within 0.12 % over 6 h, so jitter of a few
# tenths hid a 24 h flatline entirely, and the flag only fired once the values went null.
_FLAT_SPAN_MAX_PCT = 0.6
_FLAT_MIN_SAMPLES = 20
_FLAT_MIN_HOURS = 3.0
_FLAT_WINDOW_H = 6.0
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
    return get_helper(f"input_boolean.dsc_probe{pot_n}_in_service", "on") == "on"


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


def _assigned_plant_id(inventory: list[dict[str, Any]] | None, pot_n: int) -> str:
    """Roster plant id for this probe; empty = vacant (exclude from peer MAD)."""
    row = next((r for r in (inventory or []) if r.get("seat_id") == f"pot{pot_n}"), None)
    if row:
        extra = row.get("extra") or {}
        if isinstance(extra, str):
            import json

            try:
                extra = json.loads(extra)
            except json.JSONDecodeError:
                extra = {}
        aid = str(extra.get("assigned_plant_id") or "").strip()
        if aid:
            return aid
    return str(get_helper(f"text.dsc_probe{pot_n}_assigned_plant_id", "") or "").strip()


def _exclude_from_peer_mad(inventory: list[dict[str, Any]] | None, pot_n: int) -> bool:
    return _is_probe_station(inventory, pot_n) or not _assigned_plant_id(inventory, pot_n)


def _moisture_rate_per_hour(pot_n: int) -> float | None:
    since = time.time() - 6 * 3600
    rows = sorted(list_history(f"pot{pot_n}", "moisture_pct", since, limit=500), key=lambda r: r["ts"])
    usable = [r for r in rows if r.get("value") is not None]
    if len(usable) < 2:
        return None
    first, last = usable[0], usable[-1]
    try:
        dt_h = max((float(last["ts"]) - float(first["ts"])) / 3600.0, 1 / 60)
        return (float(last["value"]) - float(first["value"])) / dt_h
    except (TypeError, ValueError):
        return None


def _moisture_flatline(pot_n: int) -> tuple[float, float, int] | None:
    """(span_pct, hours_covered, samples) over the flatline window, or None if too sparse."""
    since = time.time() - _FLAT_WINDOW_H * 3600
    rows = list_history(f"pot{pot_n}", "moisture_pct", since, limit=2000)
    vals: list[tuple[float, float]] = []
    for r in rows:
        v = r.get("value")
        if v is None:
            continue
        try:
            fv = float(v)
        except (TypeError, ValueError):
            continue
        if fv != fv:  # NaN
            continue
        vals.append((float(r["ts"]), fv))
    if len(vals) < _FLAT_MIN_SAMPLES:
        return None
    vals.sort(key=lambda t: t[0])
    hours = (vals[-1][0] - vals[0][0]) / 3600.0
    if hours < _FLAT_MIN_HOURS:
        return None
    ys = [v for _, v in vals]
    return max(ys) - min(ys), hours, len(vals)


_DARK_FLATLINE_SEC = 45 * 60  # a reading frozen this long is dark (matches the stuck window)


def _reading_dark_since(pot_n: int, moisture_now: float | None, now: float) -> tuple[float | None, str | None]:
    """When this probe's moisture reading went dark, and why — or (None, None) if it is
    producing live, changing readings.

    Two dark modes:
      * "no_reading": the current value is None -> dark since the last real reading.
      * "flatline":   the value is frozen (a dead Modbus probe republishing its last read)
                      -> dark since it last moved, once frozen past _DARK_FLATLINE_SEC.

    Derived from history so the timer survives a brain restart (an in-memory 'since' resets
    on every deploy). Deliberately independent of the firmware sensor_fault / modbus_online
    flags: those have been seen both false-positive (a working probe flagged dark — pot2
    tracked a live watering with both flags raised) and false-negative. A changing reading
    is the ground truth that a probe is alive.
    """
    seat = f"pot{pot_n}"
    if moisture_now is None:
        last = last_reading_ts(seat, "moisture_pct")
        return (last, "no_reading") if last is not None else (None, None)
    changed = last_change_ts(seat, "moisture_pct", float(moisture_now))
    if changed is None:
        return (None, None)  # only ever held this value — cannot date the freeze
    if (now - changed) >= _DARK_FLATLINE_SEC:
        return (changed, "flatline")
    return (None, None)  # moved recently -> live


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


def _moisture_daily_peak(pot_n: int) -> float | None:
    from .runtime_history import midnight_ts

    since = midnight_ts()
    rows = list_history(f"pot{pot_n}", "moisture_pct", since, limit=2000)
    if not rows:
        return None
    try:
        return max(float(r["value"]) for r in rows if r.get("value") is not None)
    except (TypeError, ValueError):
        return None


def _dryback_pct(pot_n: int, moisture: float | None, rate: float | None) -> float | None:
    """Relative dryback: (peak_today - now) / peak * 100. Mirrors HA template."""
    if moisture is None:
        return None
    peak = _moisture_daily_peak(pot_n)
    if peak is None or peak <= 0:
        return None
    if rate is not None and rate > 0.5:
        return 0.0
    if not math.isfinite(peak) or not math.isfinite(float(moisture)):
        return None
    val = round((peak - float(moisture)) / peak * 100.0, 1)
    return val if math.isfinite(val) else None


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
            set_entity(states, f"binary_sensor.dsc_probe{n}_sensor_stuck", False)
            set_entity(states, f"binary_sensor.dsc_probe{n}_untrusted", False)
            _stuck_since.pop(n, None)
            continue

        probe_station = _is_probe_station(inventory, n)

        pot = (fleet.pots or {}).get(f"pot{n}")
        moisture = pot.values.get("moisture_pct") if pot and pot.online else None
        try:
            moisture_f = float(moisture) if moisture is not None else None
        except (TypeError, ValueError):
            moisture_f = None
        if moisture_f is not None and not math.isfinite(moisture_f):
            moisture_f = None  # a NaN reading is no reading — it must never become "nan %"
        # Stations still get rate/dryback when moisture is live — Root should not say "no channel".
        # Stuck/untrusted stay plant-only so idle park flats do not trip trust.
        rate = _moisture_rate_per_hour(n) if moisture_f is not None else None
        if rate is not None:
            set_entity(
                states,
                f"sensor.dsc_probe{n}_soil_moisture_rate",
                round(rate, 4),
                available=True,
                attributes={"unit_of_measurement": "%/h", "honesty": "history_slope_6h"},
            )
            if pot is not None:
                pot.values["moisture_rate"] = round(rate, 4)
        dryback = _dryback_pct(n, moisture_f, rate) if moisture_f is not None else None
        if dryback is not None:
            set_entity(
                states,
                f"sensor.dsc_probe{n}_dryback_pct",
                dryback,
                available=True,
                attributes={"unit_of_measurement": "%", "honesty": "peak_today_to_now"},
            )
            if pot is not None:
                pot.values["dryback_pct"] = dryback
        else:
            # House convention (see coldest_root_zone_temp): no computation means
            # `unavailable` + a reason, never a leaked float repr and never a stale model claim.
            set_entity(
                states,
                f"sensor.dsc_probe{n}_dryback_pct",
                "unavailable",
                available=False,
                attributes={
                    "unit_of_measurement": "%",
                    "reason": "no trusted moisture" if moisture_f is None else "no daily peak yet",
                },
            )
            if pot is not None:
                pot.values.pop("dryback_pct", None)
        flat = _moisture_flatline(n) if (moisture_f is not None and not probe_station) else None
        stuck_raw = flat is not None and flat[0] <= _FLAT_SPAN_MAX_PCT
        if stuck_raw:
            if n not in _stuck_since:
                _stuck_since[n] = now
            stuck = (now - _stuck_since[n]) >= _STUCK_ON_SEC
        else:
            _stuck_since.pop(n, None)
            stuck = False

        stuck_attrs = (
            {"span_pct": round(flat[0], 2), "hours": round(flat[1], 1), "samples": flat[2], "basis": "flatline_span"}
            if flat is not None
            else {"basis": "flatline_span", "reason": "insufficient history" if moisture_f is not None else "no reading"}
        )
        set_entity(states, f"binary_sensor.dsc_probe{n}_sensor_stuck", stuck, attributes=stuck_attrs)
        set_entity(states, f"binary_sensor.dsc_probe{n}_untrusted", stuck)

        # "Went dark" timer: when did this probe stop giving live readings, and for how long.
        # Reading-based (freeze or null), not the unreliable firmware fault flags.
        dark_since, dark_basis = _reading_dark_since(n, moisture_f, now)
        dark_attrs: dict[str, Any] = {"basis": dark_basis or "live"}
        if dark_since is not None:
            dark_attrs["dark_since"] = round(dark_since, 3)
            dark_attrs["dark_for_s"] = round(now - dark_since, 1)
        set_entity(states, f"binary_sensor.dsc_probe{n}_reading_dark", dark_since is not None, attributes=dark_attrs)
        if pot is not None:
            if dark_since is not None:
                pot.values["reading_dark_since"] = round(dark_since, 3)
                pot.values["reading_dark_for_s"] = round(now - dark_since, 1)
                pot.values["reading_dark_basis"] = dark_basis
            else:
                for _k in ("reading_dark_since", "reading_dark_for_s", "reading_dark_basis"):
                    pot.values.pop(_k, None)
        _edge_log(
            f"pot{n}_stuck",
            stuck,
            f"⚠ Pot {n} soil moisture flatline — probe may be stuck",
        )

        if pot and pot.online and not _exclude_from_peer_mad(inventory, n):
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
