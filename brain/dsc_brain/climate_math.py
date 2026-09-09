"""Climate calculations — Pi-native mirrors of ESPHome template sensors."""

from __future__ import annotations

import math


def compute_vpd_kpa(temp_c: float | None, rh_pct: float | None) -> float | None:
    """Magnus-style VPD (kPa) from air temp (°C) and RH (%)."""
    if temp_c is None or rh_pct is None:
        return None
    try:
        t = float(temp_c)
        rh = float(rh_pct)
    except (TypeError, ValueError):
        return None
    if not (-10.0 < t < 60.0) or not (0.0 < rh <= 100.0):
        return None
    svp = 0.6108 * math.exp((17.27 * t) / (t + 237.3))
    avp = svp * (rh / 100.0)
    return round(max(0.0, svp - avp), 3)


_LEAF_VPD_REBASE_NOTED = False
_LEAF_VPD_REBASE_MSG = (
    "Advisory: leaf VPD definition corrected to es(leaf) - es(air)*rh/100 "
    "(was es(leaf)*(1-rh/100)). sensor.dsc_leaf_vpd_kpa history before this point is "
    "NOT comparable with points after it."
)
# Persisted marker so the advisory is written once per DATABASE, not once per process.
# The in-memory guard below and ``record_grow_log``'s dedupe are both process-scoped, so
# before this key existed every brain restart re-stamped the journal — observed 5 times in
# 30 minutes on 2026-09-09, each one tagged ALERT and sorted to the top of the 24 h desk.
_LEAF_VPD_REBASE_KEY = "advisory.leaf_vpd_rebase.announced"


def _note_leaf_vpd_rebase() -> None:
    """Stamp the journal ONCE, ever, that the leaf-VPD series changed definition.

    A recorded series that silently changes meaning is the thing this project exists to
    avoid, so the discontinuity is written down where a chart reader will meet it. It is a
    one-time migration note, not a condition: announcing it again on every restart is noise
    that buries real alerts.
    """
    global _LEAF_VPD_REBASE_NOTED
    if _LEAF_VPD_REBASE_NOTED:
        return
    _LEAF_VPD_REBASE_NOTED = True
    try:
        from .settings import get_setting, set_setting

        if get_setting(_LEAF_VPD_REBASE_KEY):
            return

        from .event_log import record_grow_log

        # dedupe=False on purpose: the persisted key above IS the deduplication, and it is
        # permanent. record_grow_log's own dedupe is a 90 s in-process window, so leaving it
        # on would let a recent identical line swallow the write while the key still marked
        # the advisory announced — the note would then be lost for good.
        record_grow_log(_LEAF_VPD_REBASE_MSG, dedupe=False)
        set_setting(_LEAF_VPD_REBASE_KEY, "1")
    except Exception:  # noqa: BLE001 — a journal note must never break the climate path
        pass


def _svp_kpa(t: float) -> float:
    """Saturation vapour pressure (kPa) at ``t`` °C — Magnus."""
    return 0.6108 * math.exp((17.27 * t) / (t + 237.3))


def compute_leaf_vpd_kpa(
    air_temp_c: float | None,
    rh_pct: float | None,
    leaf_temp_c: float | None,
) -> float | None:
    """Leaf VPD (kPa): saturation pressure at the LEAF minus the ACTUAL air vapour pressure.

    ``es(leaf) - es(air) * rh/100``.

    This is not ``compute_vpd_kpa(leaf_t, rh)``. That form expands to
    ``es(leaf) * (1 - rh/100)``, which treats the measured RH as if it had been measured at
    leaf temperature — but RH is measured in the AIR, so the vapour pressure to subtract is
    the air's. The two disagree by roughly the leaf/air saturation ratio and the gap widens
    with the leaf-air offset. Both spellings shipped at once (the hub published the first,
    the SPA's derived layer the second) so one label meant two quantities; corrected
    2026-09-09 in favour of the physically correct form.
    """
    if air_temp_c is None or rh_pct is None or leaf_temp_c is None:
        return None
    try:
        air_t = float(air_temp_c)
        leaf_t = float(leaf_temp_c)
        rh = float(rh_pct)
    except (TypeError, ValueError):
        return None
    # Same rails as compute_vpd_kpa, applied to BOTH temperatures: a railed air reading must
    # not silently produce a plausible-looking leaf number.
    if not (-10.0 < air_t < 60.0) or not (-10.0 < leaf_t < 60.0):
        return None
    if not (0.0 < rh <= 100.0):
        return None
    avp_air = _svp_kpa(air_t) * (rh / 100.0)
    return round(max(0.0, _svp_kpa(leaf_t) - avp_air), 3)


def plausible_vpd_kpa(value: float | None) -> bool:
    if value is None:
        return False
    try:
        v = float(value)
    except (TypeError, ValueError):
        return False
    return 0.0 <= v <= 3.5


def finalize_hub_climate(values: dict) -> None:
    """Normalize VPD from live T/RH — hub template can be stomped by number-entity ingest."""
    # plausible_vpd_kpa was defined with zero callers; an implausible recompute now drops
    # the value instead of publishing it.
    tent_vpd = compute_vpd_kpa(values.get("temp_c"), values.get("rh_pct"))
    if tent_vpd is not None:
        values["vpd_kpa"] = tent_vpd if plausible_vpd_kpa(tent_vpd) else None
    clone_vpd = compute_vpd_kpa(values.get("clone_temp_c"), values.get("clone_rh_pct"))
    if clone_vpd is not None:
        values["clone_vpd_kpa"] = clone_vpd if plausible_vpd_kpa(clone_vpd) else None
    room_vpd = compute_vpd_kpa(values.get("room_temp_c"), values.get("room_rh_pct"))
    if room_vpd is not None:
        values["room_vpd_kpa"] = room_vpd if plausible_vpd_kpa(room_vpd) else None
    leaf_offset = values.get("leaf_offset_c")
    if leaf_offset is None:
        try:
            from .settings import get_setting

            leaf_offset = float(get_setting("leaf_offset_c", "2") or 2)
        except (TypeError, ValueError):
            leaf_offset = 2.0
    # NOTE (2026-09-09): these use compute_LEAF_vpd_kpa, not compute_vpd_kpa(leaf_t, rh).
    # RH is measured in the air, so the vapour pressure subtracted must be the air's. The
    # old form published a different quantity under the same name than the SPA's derived
    # layer did; see compute_leaf_vpd_kpa. This RE-BASES the recorded
    # sensor.dsc_leaf_vpd_kpa series — points before and after the change are not
    # comparable, and _note_leaf_vpd_rebase() stamps the journal once so a chart cannot
    # splice the two definitions silently.
    if values.get("temp_c") is not None and values.get("rh_pct") is not None:
        leaf_t = float(values["temp_c"]) - float(leaf_offset)
        leaf_vpd = compute_leaf_vpd_kpa(values.get("temp_c"), values.get("rh_pct"), leaf_t)
        if leaf_vpd is not None:
            values["leaf_vpd_kpa"] = leaf_vpd
            _note_leaf_vpd_rebase()
    if values.get("clone_temp_c") is not None and values.get("clone_rh_pct") is not None:
        clone_leaf_t = float(values["clone_temp_c"]) - float(leaf_offset)
        clone_leaf_vpd = compute_leaf_vpd_kpa(
            values.get("clone_temp_c"), values.get("clone_rh_pct"), clone_leaf_t
        )
        if clone_leaf_vpd is not None:
            values["clone_leaf_vpd_kpa"] = clone_leaf_vpd
            _note_leaf_vpd_rebase()
