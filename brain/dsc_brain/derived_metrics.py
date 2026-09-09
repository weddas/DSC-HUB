"""Brain-owned derived metrics — the values that DRIVE control, with provenance.

Why this module exists
----------------------
The SPA has a derived-metrics layer (``frontend/src/lib/derived/``) that computes
VPD, dew point, absolute humidity, DLI and friends from the sensors the kit has.
That layer is **display only**. Anything that decides whether an appliance runs has
to be computed here, on the brain, because:

* the SPA can be closed, stale, or running an old bundle,
* a browser-side number cannot be logged, replayed, or tested against the fleet,
* two implementations of the same law drift, and the one the operator can see is
  not necessarily the one that switched the relay.

So: the SPA shows :class:`Derived` values for the human; the brain computes the same
values here for the control path, and the two agree by construction because they use
the same formulas and the same honesty rules.

The honesty rules (identical to the SPA layer)
----------------------------------------------
1. A missing or implausible input yields ``unavailable`` with the missing input
   NAMED. It never yields a number, a default, or a last-known value.
2. A number that rests on an assumption carries the assumption on the value itself.
3. A value a real sensor could measure carries ``possible_with``, so a device-only
   reading shows up as a labelled gap rather than as silence.
4. A control signal whose inputs are missing returns ``action=None``. Callers MUST
   NOT coerce that to "off" — it means *this law has no opinion, fall through to the
   hub's own ladder and failsafe*.

Wiring status
-------------
This module is pure and side-effect free. Nothing calls it yet: the appliance path
runs through ``hub_native.HUB_EMIT_MAP`` / ``computed_ops``, which are owned
elsewhere. See the TODO block at the bottom of the file for what a wiring pass has
to decide first.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any

__all__ = [
    "Derived",
    "ControlSignal",
    "SENSOR_SLOTS",
    "saturation_vapour_pressure_kpa",
    "air_vpd",
    "leaf_vpd",
    "dew_point",
    "absolute_humidity",
    "condensation_margin",
    "vpd_deficit",
    "dli",
    "moisture_load",
    "dehumidify_signal",
    "condensation_guard",
    "vpd_correction_signal",
    "evaluate_zone",
]


# --------------------------------------------------------------------------- #
# Plausibility rails — the same ones climate_math.compute_vpd_kpa enforces, so a
# railed sensor cannot leak a derived number into the control path.
# --------------------------------------------------------------------------- #

TEMP_C_RANGE = (-10.0, 60.0)
RH_PCT_RANGE = (0.0, 100.0)

#: What would upgrade a derived (or absent) value to a measured one.
SENSOR_SLOTS: dict[str, str] = {
    "leaf_ir": "an IR leaf-temperature sensor at the canopy",
    "par": "a PAR sensor at the canopy",
    "co2": "an NDIR CO2 sensor",
    "surface": "a surface-temperature probe on the coldest wall",
    "volume": "the zone's internal volume (not modelled yet)",
}


@dataclass(frozen=True)
class Derived:
    """A computed value, or an honest hole where one would be.

    Exactly one of ``value`` / ``unavailable`` is set. ``provenance`` is non-empty
    if and only if ``value`` is not None.
    """

    key: str
    label: str
    unit: str
    value: float | None
    provenance: str = ""
    assumption: str | None = None
    unavailable: str | None = None
    possible_with: str | None = None
    precision: int = 2

    @property
    def resolved(self) -> bool:
        return self.value is not None

    def to_dict(self) -> dict[str, Any]:
        return {
            "key": self.key,
            "label": self.label,
            "unit": self.unit,
            "value": self.value,
            "provenance": self.provenance,
            "assumption": self.assumption,
            "unavailable": self.unavailable,
            "possible_with": self.possible_with,
        }


@dataclass(frozen=True)
class ControlSignal:
    """A derived opinion about what an appliance should do.

    ``action is None`` means the law could not be evaluated. That is NOT "off":
    the caller must fall through to whatever ladder ran before, and the hub's own
    clamps and failsafe still win either way.
    """

    key: str
    action: str | None
    reason: str
    provenance: str = ""
    unavailable: str | None = None
    inputs: dict[str, float | None] = field(default_factory=dict)
    derived: dict[str, Any] = field(default_factory=dict)

    @property
    def decided(self) -> bool:
        return self.action is not None

    def to_dict(self) -> dict[str, Any]:
        return {
            "key": self.key,
            "action": self.action,
            "reason": self.reason,
            "provenance": self.provenance,
            "unavailable": self.unavailable,
            "inputs": dict(self.inputs),
            "derived": dict(self.derived),
        }


def _unavailable(key: str, label: str, unit: str, reason: str, *, precision: int = 2, possible_with: str | None = None) -> Derived:
    return Derived(
        key=key,
        label=label,
        unit=unit,
        value=None,
        provenance="",
        unavailable=reason,
        possible_with=possible_with,
        precision=precision,
    )


def _num(value: Any) -> float | None:
    """A finite float, or None. Booleans are not numbers here."""
    if value is None or isinstance(value, bool):
        return None
    try:
        out = float(value)
    except (TypeError, ValueError):
        return None
    return out if math.isfinite(out) else None


def _plausible(value: Any, lo: float, hi: float) -> tuple[float | None, str | None]:
    """Return (value, None) or (None, why). A railed reading is rejected, not clamped."""
    num = _num(value)
    if num is None:
        return None, "missing"
    if not (lo <= num <= hi):
        return None, f"reads {num:g}, outside the plausible range {lo:g}..{hi:g}"
    return num, None


def _temp_rh(temp_c: Any, rh_pct: Any) -> tuple[float | None, float | None, str | None]:
    """Validate a T/RH pair and name whichever half is missing or railed."""
    t, t_why = _plausible(temp_c, *TEMP_C_RANGE)
    rh, rh_why = _plausible(rh_pct, *RH_PCT_RANGE)
    if t is None and rh is None:
        if t_why == "missing" and rh_why == "missing":
            return None, None, "needs air temperature and relative humidity"
        return None, None, f"air temperature {t_why}; relative humidity {rh_why}"
    if t is None:
        return None, None, (
            "needs air temperature" if t_why == "missing" else f"air temperature {t_why}"
        )
    if rh is None:
        return None, None, (
            "needs relative humidity" if rh_why == "missing" else f"relative humidity {rh_why}"
        )
    return t, rh, None


# --------------------------------------------------------------------------- #
# Psychrometrics
# --------------------------------------------------------------------------- #


def saturation_vapour_pressure_kpa(temp_c: float) -> float:
    """Tetens saturation vapour pressure over water, kPa."""
    return 0.6108 * math.exp((17.27 * temp_c) / (temp_c + 237.3))


def air_vpd(temp_c: Any, rh_pct: Any) -> Derived:
    """Air VPD (kPa) from dry-bulb temperature and RH."""
    t, rh, why = _temp_rh(temp_c, rh_pct)
    if why:
        return _unavailable("air_vpd", "Air VPD", "kPa", why)
    assert t is not None and rh is not None
    es = saturation_vapour_pressure_kpa(t)
    return Derived(
        key="air_vpd",
        label="Air VPD",
        unit="kPa",
        value=max(0.0, es * (1.0 - rh / 100.0)),
        provenance="from T + RH (Tetens saturation curve)",
    )


def leaf_vpd(
    temp_c: Any,
    rh_pct: Any,
    *,
    leaf_temp_c: Any = None,
    leaf_offset_c: Any = None,
) -> Derived:
    """Leaf VPD (kPa): saturation pressure at LEAF temperature minus the air's actual
    vapour pressure.

    ``leaf_offset_c`` follows the brain's existing convention (see
    ``climate_math.finalize_hub_climate`` and the ``leaf_offset_c`` setting): a
    POSITIVE number means the leaf runs that many degrees COOLER than the air.
    It is only used when no IR leaf sensor value is supplied, and when it is used the
    returned value says so in ``assumption``.

    NOTE (deliberate divergence, flagged rather than silently fixed): the hub's
    published ``leaf_vpd_kpa`` is currently ``compute_vpd_kpa(leaf_t, rh)``, i.e.
    ``es(leaf) * (1 - rh/100)``, which treats RH as if it were measured at leaf
    temperature. The physically correct form used here is ``es(leaf) - es(air)*rh/100``.
    They disagree by roughly the leaf/air saturation ratio. Reconciling them changes a
    published sensor, so it is left to an owner decision -- see the TODO at the bottom.
    """
    t, rh, why = _temp_rh(temp_c, rh_pct)
    if why:
        return _unavailable("leaf_vpd", "Leaf VPD", "kPa", why, possible_with=SENSOR_SLOTS["leaf_ir"])
    assert t is not None and rh is not None

    measured_leaf, leaf_why = _plausible(leaf_temp_c, *TEMP_C_RANGE) if leaf_temp_c is not None else (None, "missing")
    ea = saturation_vapour_pressure_kpa(t) * (rh / 100.0)

    if measured_leaf is not None:
        return Derived(
            key="leaf_vpd",
            label="Leaf VPD",
            unit="kPa",
            value=max(0.0, saturation_vapour_pressure_kpa(measured_leaf) - ea),
            provenance="from leaf T + air T + RH (leaf sensor bound)",
        )

    offset = _num(leaf_offset_c)
    if offset is None:
        offset = _leaf_offset_setting()
    if offset is None:
        return _unavailable(
            "leaf_vpd",
            "Leaf VPD",
            "kPa",
            "needs a leaf temperature or a leaf/air offset assumption",
            possible_with=SENSOR_SLOTS["leaf_ir"],
        )
    note = "" if leaf_why in (None, "missing") else f" (leaf sensor {leaf_why})"
    return Derived(
        key="leaf_vpd",
        label="Leaf VPD",
        unit="kPa",
        value=max(0.0, saturation_vapour_pressure_kpa(t - offset) - ea),
        provenance="from T + RH",
        assumption=f"leaf = air - {offset:.1f} C (assumed - no leaf sensor{note})",
        possible_with=SENSOR_SLOTS["leaf_ir"],
    )


def _leaf_offset_setting() -> float | None:
    """The operator's leaf offset, or None. Never invents a default here: the caller
    decides whether an assumed offset is acceptable for its purpose."""
    try:
        from .settings import get_setting

        return _num(get_setting("leaf_offset_c", "2"))
    except Exception:  # noqa: BLE001 - settings DB may not be initialised in a test
        return None


def dew_point(temp_c: Any, rh_pct: Any) -> Derived:
    """Dew point (C) by the Magnus form."""
    t, rh, why = _temp_rh(temp_c, rh_pct)
    if why:
        return _unavailable("dew_point", "Dew point", "C", why, precision=1)
    assert t is not None and rh is not None
    if rh <= 0.0:
        return _unavailable(
            "dew_point", "Dew point", "C", "RH reads 0 %, the Magnus form has no solution there", precision=1
        )
    a, b = 17.27, 237.3
    gamma = (a * t) / (b + t) + math.log(rh / 100.0)
    return Derived(
        key="dew_point",
        label="Dew point",
        unit="C",
        value=(b * gamma) / (a - gamma),
        provenance="from T + RH (Magnus)",
        precision=1,
    )


def absolute_humidity(temp_c: Any, rh_pct: Any) -> Derived:
    """Absolute humidity (g/m3) — the water a dehumidifier actually has to pull."""
    t, rh, why = _temp_rh(temp_c, rh_pct)
    if why:
        return _unavailable("absolute_humidity", "Absolute humidity", "g/m3", why, precision=1)
    assert t is not None and rh is not None
    e_pa = saturation_vapour_pressure_kpa(t) * 1000.0 * (rh / 100.0)
    return Derived(
        key="absolute_humidity",
        label="Absolute humidity",
        unit="g/m3",
        value=(2.16679 * e_pa) / (t + 273.15),
        provenance="from T + RH (moisture mass per m3 of air)",
        precision=1,
    )


def condensation_margin(temp_c: Any, rh_pct: Any, *, surface_temp_c: Any = None) -> Derived:
    """Degrees of headroom before water forms.

    With no surface probe the coldest surface is ASSUMED to sit at air temperature,
    which makes the answer an upper bound — the real margin is smaller. That caveat
    rides on the value so a guard built on it cannot pretend to more certainty.
    """
    dew = dew_point(temp_c, rh_pct)
    if not dew.resolved:
        return _unavailable(
            "condensation_margin",
            "Condensation margin",
            "C",
            dew.unavailable or "dew point unavailable",
            precision=1,
            possible_with=SENSOR_SLOTS["surface"],
        )
    assert dew.value is not None
    surface, surface_why = _plausible(surface_temp_c, *TEMP_C_RANGE) if surface_temp_c is not None else (None, "missing")
    if surface is not None:
        return Derived(
            key="condensation_margin",
            label="Condensation margin",
            unit="C",
            value=surface - dew.value,
            provenance="from surface T - dew point",
            precision=1,
        )
    t, _rh, _why = _temp_rh(temp_c, rh_pct)
    assert t is not None
    note = "" if surface_why in (None, "missing") else f" (surface probe {surface_why})"
    return Derived(
        key="condensation_margin",
        label="Condensation margin",
        unit="C",
        value=t - dew.value,
        provenance="from air T - dew point",
        assumption=f"coldest surface assumed at air temperature - the true margin is smaller{note}",
        possible_with=SENSOR_SLOTS["surface"],
        precision=1,
    )


def _band(band: Any) -> tuple[float, float] | None:
    if band is None:
        return None
    if isinstance(band, dict):
        lo, hi = _num(band.get("min")), _num(band.get("max"))
    elif isinstance(band, (list, tuple)) and len(band) >= 2:
        lo, hi = _num(band[0]), _num(band[1])
    else:
        return None
    if lo is None or hi is None or lo > hi:
        return None
    return lo, hi


def vpd_deficit(vpd_kpa: Any, band: Any) -> Derived:
    """Signed distance from the live VPD to the nearest edge of the want band.

    Negative = below the band (too humid). Positive = above (too dry). Zero = inside.
    """
    value = _num(vpd_kpa)
    if value is None:
        return _unavailable("vpd_deficit", "VPD vs band", "kPa", "needs a VPD reading")
    rail = _band(band)
    if rail is None:
        return _unavailable(
            "vpd_deficit", "VPD vs band", "kPa", "needs a VPD band - no plant or stage rail for this zone"
        )
    lo, hi = rail
    delta = value - lo if value < lo else value - hi if value > hi else 0.0
    return Derived(
        key="vpd_deficit",
        label="VPD vs band",
        unit="kPa",
        value=delta,
        provenance=f"from VPD - nearest band edge ({lo:.1f}-{hi:.1f})",
    )


def dli(ppfd: Any, photoperiod_hours: Any, *, source: str | None = "calibrated") -> Derived:
    """Daily light integral (mol/m2/d) = PPFD x photoperiod.

    A missing PAR reading and a missing photoperiod are different failures and read
    differently; neither produces a number.
    """
    p = _num(ppfd)
    h = _num(photoperiod_hours)
    if p is None and h is None:
        return _unavailable(
            "dli", "DLI", "mol/m2/d", "needs canopy PPFD and a photoperiod rail", precision=1,
            possible_with=SENSOR_SLOTS["par"],
        )
    if p is None:
        return _unavailable(
            "dli", "DLI", "mol/m2/d", "needs canopy PPFD - no PAR sensor and no fixture calibration",
            precision=1, possible_with=SENSOR_SLOTS["par"],
        )
    if h is None:
        return _unavailable(
            "dli", "DLI", "mol/m2/d", "needs a photoperiod rail - no stage light-hours for this zone", precision=1
        )
    if p <= 0 or h <= 0:
        return _unavailable(
            "dli", "DLI", "mol/m2/d", "PPFD or photoperiod is not a positive number", precision=1,
            possible_with=SENSOR_SLOTS["par"],
        )
    assumption = (
        "PPFD comes from the fixture calibration curve, not a live PAR reading"
        if source == "calibrated"
        else None
    )
    return Derived(
        key="dli",
        label="DLI",
        unit="mol/m2/d",
        value=(p * h * 3600.0) / 1_000_000.0,
        provenance=f"from PPFD {p:.0f} x {h:g} h photoperiod",
        assumption=assumption,
        possible_with=SENSOR_SLOTS["par"] if source == "calibrated" else None,
        precision=1,
    )


def moisture_load(temp_c: Any, rh_pct: Any, *, rh_band: Any = None, temp_band: Any = None) -> Derived:
    """Grams of water per m3 above the band's RH ceiling — the dehumidifier's real job.

    Positive means there is water to remove. Needs an RH ceiling; without a rail there
    is no target, so there is no number.
    """
    now = absolute_humidity(temp_c, rh_pct)
    if not now.resolved:
        return _unavailable(
            "moisture_load", "Moisture to remove", "g/m3", now.unavailable or "absolute humidity unavailable",
            precision=1,
        )
    rh_rail = _band(rh_band)
    if rh_rail is None:
        return _unavailable(
            "moisture_load", "Moisture to remove", "g/m3",
            "needs an RH band - no plant or stage rail for this zone", precision=1,
        )
    ceiling_rh = rh_rail[1]
    t_rail = _band(temp_band)
    if t_rail is not None:
        target_t: float | None = (t_rail[0] + t_rail[1]) / 2.0
        assumption = None
    else:
        target_t = _num(temp_c)
        assumption = "no temperature band - the ceiling is taken at the CURRENT air temperature"
    if target_t is None:
        return _unavailable(
            "moisture_load", "Moisture to remove", "g/m3",
            "needs a temperature target or a live air temperature", precision=1,
        )
    ceiling = absolute_humidity(target_t, ceiling_rh)
    if not ceiling.resolved:
        return _unavailable(
            "moisture_load", "Moisture to remove", "g/m3",
            ceiling.unavailable or "the RH ceiling did not produce a finite target", precision=1,
        )
    assert now.value is not None and ceiling.value is not None
    return Derived(
        key="moisture_load",
        label="Moisture to remove",
        unit="g/m3",
        value=now.value - ceiling.value,
        provenance=f"from absolute humidity now - the {ceiling_rh:.0f} % ceiling at {target_t:.1f} C",
        assumption=assumption,
        possible_with=SENSOR_SLOTS["volume"],
        precision=1,
    )


# --------------------------------------------------------------------------- #
# Control signals — derived values with an opinion. `action is None` means
# "no opinion"; it is never a silent "off".
# --------------------------------------------------------------------------- #


def dehumidify_signal(
    temp_c: Any,
    rh_pct: Any,
    *,
    rh_band: Any = None,
    temp_band: Any = None,
    deadband_gm3: float = 0.3,
) -> ControlSignal:
    """Should the dehumidifier pull?

    Decides on absolute humidity rather than RH, because RH alone tells you nothing
    about how much water is in the air: 60 % at 18 C and 60 % at 28 C are different
    jobs. Inside the deadband the signal deliberately has NO opinion so it cannot
    chatter the relay.
    """
    load = moisture_load(temp_c, rh_pct, rh_band=rh_band, temp_band=temp_band)
    inputs = {"temp_c": _num(temp_c), "rh_pct": _num(rh_pct)}
    if not load.resolved:
        return ControlSignal(
            key="dehumidify",
            action=None,
            reason="cannot decide - fall through to the hub RH ladder",
            unavailable=load.unavailable,
            inputs=inputs,
            derived={"moisture_load": load.to_dict()},
        )
    assert load.value is not None
    band = abs(float(deadband_gm3))
    if load.value > band:
        action, reason = "dehumidify", f"{load.value:.1f} g/m3 above the band ceiling"
    elif load.value < -band:
        action, reason = "idle", f"{abs(load.value):.1f} g/m3 below the band ceiling"
    else:
        action, reason = "hold", f"within {band:.1f} g/m3 of the ceiling - holding to avoid chatter"
    return ControlSignal(
        key="dehumidify",
        action=action,
        reason=reason,
        provenance=load.provenance,
        inputs=inputs,
        derived={"moisture_load": load.to_dict()},
    )


def condensation_guard(
    temp_c: Any,
    rh_pct: Any,
    *,
    surface_temp_c: Any = None,
    min_margin_c: float = 2.0,
) -> ControlSignal:
    """Is the zone close enough to the dew point that water will form?

    With no surface probe the margin is an upper bound, so a "clear" verdict is
    explicitly labelled as resting on that assumption rather than being asserted flat.
    """
    margin = condensation_margin(temp_c, rh_pct, surface_temp_c=surface_temp_c)
    inputs = {"temp_c": _num(temp_c), "rh_pct": _num(rh_pct), "surface_temp_c": _num(surface_temp_c)}
    if not margin.resolved:
        return ControlSignal(
            key="condensation_guard",
            action=None,
            reason="cannot decide - no dew point without T and RH",
            unavailable=margin.unavailable,
            inputs=inputs,
            derived={"condensation_margin": margin.to_dict()},
        )
    assert margin.value is not None
    at_risk = margin.value < float(min_margin_c)
    reason = (
        f"{margin.value:.1f} C of headroom, under the {float(min_margin_c):.1f} C guard"
        if at_risk
        else f"{margin.value:.1f} C of headroom"
    )
    if margin.assumption:
        reason = f"{reason} ({margin.assumption})"
    return ControlSignal(
        key="condensation_guard",
        action="at_risk" if at_risk else "clear",
        reason=reason,
        provenance=margin.provenance,
        inputs=inputs,
        derived={"condensation_margin": margin.to_dict()},
    )


def vpd_correction_signal(vpd_kpa: Any, band: Any, *, deadband_kpa: float = 0.05) -> ControlSignal:
    """Which way the zone has to move to get VPD back into the band."""
    deficit = vpd_deficit(vpd_kpa, band)
    inputs = {"vpd_kpa": _num(vpd_kpa)}
    if not deficit.resolved:
        return ControlSignal(
            key="vpd_correction",
            action=None,
            reason="cannot decide - no VPD reading or no band",
            unavailable=deficit.unavailable,
            inputs=inputs,
            derived={"vpd_deficit": deficit.to_dict()},
        )
    assert deficit.value is not None
    dead = abs(float(deadband_kpa))
    if deficit.value > dead:
        action, reason = "lower_vpd", f"{deficit.value:.2f} kPa above the band - add moisture or cool"
    elif deficit.value < -dead:
        action, reason = "raise_vpd", f"{abs(deficit.value):.2f} kPa below the band - dry or warm"
    else:
        action, reason = "hold", "inside the band"
    return ControlSignal(
        key="vpd_correction",
        action=action,
        reason=reason,
        provenance=deficit.provenance,
        inputs=inputs,
        derived={"vpd_deficit": deficit.to_dict()},
    )


def evaluate_zone(
    *,
    temp_c: Any = None,
    rh_pct: Any = None,
    vpd_kpa: Any = None,
    leaf_temp_c: Any = None,
    leaf_offset_c: Any = None,
    surface_temp_c: Any = None,
    vpd_band: Any = None,
    rh_band: Any = None,
    temp_band: Any = None,
    ppfd: Any = None,
    photoperiod_hours: Any = None,
    ppfd_source: str | None = "calibrated",
) -> dict[str, Any]:
    """Every derived value and control signal for one zone, in one call.

    Shape mirrors the SPA's ``zoneDerived()`` so the two can be diffed in a test or
    an inspector. A zone with no sensors returns a full set of unavailable entries and
    three undecided signals — never a set of zeroes.
    """
    air = air_vpd(temp_c, rh_pct)
    values = [
        air,
        leaf_vpd(temp_c, rh_pct, leaf_temp_c=leaf_temp_c, leaf_offset_c=leaf_offset_c),
        dew_point(temp_c, rh_pct),
        absolute_humidity(temp_c, rh_pct),
        condensation_margin(temp_c, rh_pct, surface_temp_c=surface_temp_c),
        vpd_deficit(vpd_kpa if vpd_kpa is not None else air.value, vpd_band),
        dli(ppfd, photoperiod_hours, source=ppfd_source),
        moisture_load(temp_c, rh_pct, rh_band=rh_band, temp_band=temp_band),
    ]
    signals = [
        dehumidify_signal(temp_c, rh_pct, rh_band=rh_band, temp_band=temp_band),
        condensation_guard(temp_c, rh_pct, surface_temp_c=surface_temp_c),
        vpd_correction_signal(vpd_kpa if vpd_kpa is not None else air.value, vpd_band),
    ]
    return {
        "derived": {d.key: d.to_dict() for d in values},
        "signals": {s.key: s.to_dict() for s in signals},
    }


# --------------------------------------------------------------------------- #
# TODO (deliberately not done in this pass; each needs an owner decision)
#
# 1. Wire `dehumidify_signal` into the appliance path. Today RH high/low drives
#    `switch.dsc_hub_dehumidifier_demand` through `hub_native.HUB_EMIT_MAP`, which
#    this module does not own. Switching that ladder from RH to absolute humidity
#    changes live appliance behaviour on a running grow and must be gated behind a
#    tunable plus a real-device soak, not slipped in with a display change.
#
# 2. Reconcile leaf VPD. `climate_math.finalize_hub_climate` publishes
#    `es(leaf) * (1 - rh/100)`; this module computes `es(leaf) - es(air)*rh/100`.
#    The second is the correct one, but the first is what the hub sensor, the SPA
#    tooltip and any stored history currently mean. Changing it re-bases a recorded
#    series, so it needs an owner call and a migration note.
#
# 3. The brain rule engine has no clock (it only ticks inside request handlers), so
#    a signal computed here is only as fresh as the last request. Anything acting on
#    `condensation_guard` needs a real tick before it can be called a guard.
# --------------------------------------------------------------------------- #
