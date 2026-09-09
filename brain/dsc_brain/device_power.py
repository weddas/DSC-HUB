"""What each device draws, in watts — and who decided.

The energy estimates on the Light and Climate desks are ``watts × hours × tariff``. Until
now only *space devices* (lights, fans) carried a wattage; the appliance seats — heater,
heat mat, humidifier, dehumidifier, AC — had none, so anything they drew was simply missing
from the estimate.

Two sources, and the order between them is the point:

1. **Catalog.** If a device is matched to a product (``extra.catalog_id``) and that product
   carries ``wattage_w``, the catalog wins and the field is READ-ONLY. A matched product's
   nameplate is a fact about the hardware; letting it be typed over would leave the estimate
   disagreeing with the thing it describes, with nothing on screen to say which was meant.
2. **Operator.** Anything unmatched is typed in and stored on the seat.

A value nobody has supplied stays ``None``, never 0 — the honesty rule this project runs on.
Zero watts is a claim that a heater draws nothing; absent is the truth, and the estimate can
say so instead of quietly under-counting.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from .settings import get_setting, list_inventory, set_setting, upsert_inventory

_logger = logging.getLogger(__name__)

# Seats that draw power and are worth estimating. `mister` and `tank` are here because they
# are appliance seats with a pump/element even while F-002 has them out of service — an OOS
# seat still has a nameplate, and the operator may want it recorded before re-enabling.
POWERED_SEATS: tuple[str, ...] = (
    "heater",
    "heatmat",
    "humidifier",
    "dehumidifier",
    "ac",
    "mister",
    "tank",
)

SEAT_LABELS: dict[str, str] = {
    "heater": "Heater",
    "heatmat": "Heat mat",
    "humidifier": "Humidifier",
    "dehumidifier": "Dehumidifier",
    "ac": "Air conditioner",
    "mister": "Mister",
    "tank": "Tank / pump",
}

# A domestic grow tent. Above this is almost certainly a typo (3500 instead of 350), and a
# wrong wattage silently inflates every energy estimate downstream.
MAX_WATTS = 5000.0

# The four hub fans. They are neither inventory seats nor space devices — they are hub
# entities — so their wattage lives in its own settings map, the same shape the per-fan
# demand scales use. Keeping them here means one screen covers everything that draws power.
SETTING_FAN_WATTS = "fan_watts"
FAN_LABELS: dict[str, str] = {
    "fan.dsc_hub_4_inch_intake_fan_main": "4×8 intake · 4″",
    "fan.dsc_hub_4_inch_intake_fan_2x4": "2×4 intake · 4″",
    "fan.dsc_hub_6_inch_exhaust_room": "Room exhaust · 6″",
    "fan.dsc_hub_6_inch_exhaust_outside": "Outside exhaust · 6″",
}


class PowerLockedError(ValueError):
    """Raised when something tries to write a watts value the catalog owns."""


def _extra(row: dict[str, Any]) -> dict[str, Any]:
    raw = row.get("extra")
    if isinstance(raw, dict):
        return dict(raw)
    if isinstance(raw, str) and raw:
        try:
            parsed = json.loads(raw)
            return dict(parsed) if isinstance(parsed, dict) else {}
        except json.JSONDecodeError:
            return {}
    return {}


def coerce_watts(value: Any) -> float | None:
    """A number in range, or None. Empty string and null both mean 'not supplied'."""
    if value is None or value == "":
        return None
    try:
        watts = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError("watts must be a number") from exc
    if watts < 0:
        raise ValueError("watts cannot be negative")
    if watts > MAX_WATTS:
        raise ValueError(f"{watts:g} W is above the {MAX_WATTS:g} W ceiling — check the figure")
    return watts


def resolve(row: dict[str, Any], catalog_watts: float | None) -> dict[str, Any]:
    """Decide the effective watts for one device and say where it came from.

    Pure, so the precedence can be tested without a catalog or a database.
    """
    extra = _extra(row)
    catalog_id = str(extra.get("catalog_id") or "").strip()
    operator = extra.get("watts")
    try:
        operator_watts = coerce_watts(operator)
    except ValueError:
        operator_watts = None  # a corrupt stored value must not break the whole listing

    if catalog_id and catalog_watts is not None:
        return {
            "watts": float(catalog_watts),
            "source": "catalog",
            "locked": True,
            "catalog_id": catalog_id,
            "note": "Set by the product database — this device is matched to a catalogue product, so its nameplate wattage is used.",
            # Kept so nothing the operator typed is destroyed by a later match; it simply
            # stops being the effective value while the match stands.
            "operator_watts": operator_watts,
        }
    if operator_watts is not None:
        return {
            "watts": operator_watts,
            "source": "operator",
            "locked": False,
            "catalog_id": catalog_id or None,
            "note": (
                "Matched to a catalogue product that does not publish a wattage — your value is used."
                if catalog_id
                else ""
            ),
            "operator_watts": operator_watts,
        }
    return {
        "watts": None,
        "source": "unset",
        "locked": False,
        "catalog_id": catalog_id or None,
        "note": "Not set — this device is left out of energy estimates rather than counted as zero.",
        "operator_watts": None,
    }


async def _catalog_watts_for(catalog_id: str) -> float | None:
    """``wattage_w`` for a matched product, or None.

    Both the lights and equipment stores expose the field under this name. An unreachable or
    unmounted catalog returns None rather than raising: a device's power row must still
    render, unlocked, when the catalogue is simply not answering.
    """
    cid = (catalog_id or "").strip()
    if not cid:
        return None
    from .integrations import catalog_equipment_detail, catalog_light_detail

    for lookup in (catalog_light_detail, catalog_equipment_detail):
        try:
            detail = await lookup(cid)
        except Exception as exc:  # noqa: BLE001 — catalogue trouble must not break Settings
            _logger.debug("catalog watts lookup failed for %s: %s", cid, exc)
            continue
        if not isinstance(detail, dict):
            continue
        raw = detail.get("wattage_w")
        if raw is None and isinstance(detail.get("detail"), dict):
            raw = detail["detail"].get("wattage_w")
        if raw is None:
            continue
        try:
            return float(raw)
        except (TypeError, ValueError):
            continue
    return None


def get_fan_watts(db_path=None) -> dict[str, float]:
    raw = get_setting(SETTING_FAN_WATTS, "", db_path)
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    out: dict[str, float] = {}
    if isinstance(parsed, dict):
        for eid, val in parsed.items():
            if eid in FAN_LABELS:
                try:
                    out[eid] = float(val)
                except (TypeError, ValueError):
                    continue
    return out


async def list_device_power(db_path=None) -> list[dict[str, Any]]:
    """Everything that draws power — appliances, lights and fans — in one list.

    Three storage shapes behind one surface: appliance seats on inventory extras, lights as
    space devices (which already had a watts column feeding the energy estimate), and fans in
    their own settings map. The operator should not have to know which is which.
    """
    out: list[dict[str, Any]] = []

    by_seat = {str(r.get("seat_id")): r for r in list_inventory(db_path)}
    for seat in POWERED_SEATS:
        row = by_seat.get(seat) or {"seat_id": seat, "extra": {}}
        extra = _extra(row)
        catalog_watts = await _catalog_watts_for(str(extra.get("catalog_id") or ""))
        out.append({
            "device_id": seat,
            "label": SEAT_LABELS.get(seat, seat),
            "kind": "appliance",
            "in_service": bool(row.get("in_service", True)),
            **resolve(row, catalog_watts),
        })

    # Lights (and anything else on a space) already carry watts — that column is what the
    # energy estimate reads, so it is surfaced here rather than duplicated.
    try:
        from .space_model import list_space_devices, list_spaces

        for space in list_spaces(db_path):
            sid = str(space.get("space_id"))
            for dev in list_space_devices(sid, db_path=db_path):
                extra = _extra(dev)
                catalog_watts = await _catalog_watts_for(str(extra.get("catalog_id") or ""))
                stored = dev.get("watts")
                shim = {"extra": {**extra, "watts": stored if stored else None}}
                out.append({
                    "device_id": f"space:{sid}:{dev.get('device_id')}",
                    "label": f"{sid} · {dev.get('label') or dev.get('device_id')}",
                    "kind": "light",
                    "in_service": bool(dev.get("enabled", True)),
                    **resolve(shim, catalog_watts),
                })
    except Exception as exc:  # noqa: BLE001 — a missing space table must not blank the page
        _logger.debug("space device power skipped: %s", exc)

    fan_watts = get_fan_watts(db_path)
    for eid, label in FAN_LABELS.items():
        shim = {"extra": {"watts": fan_watts.get(eid)}}
        out.append({
            "device_id": eid,
            "label": label,
            "kind": "fan",
            "in_service": True,
            # Fans are hub entities with no catalogue match today, so nothing can lock them.
            **resolve(shim, None),
        })
    return out


def set_device_watts(seat_id: str, watts: Any, *, catalog_watts: float | None = None, db_path=None) -> dict[str, Any]:
    """Store an operator wattage for any of the three device shapes.

    Refuses when the catalog owns the value — that refusal is the feature, not an edge case.
    """
    device = str(seat_id or "").strip()

    # --- a fan: its own settings map -----------------------------------------------------
    if device in FAN_LABELS:
        value = coerce_watts(watts)
        current = get_fan_watts(db_path)
        before = current.get(device)
        if value is None:
            current.pop(device, None)
        else:
            current[device] = value
        set_setting(SETTING_FAN_WATTS, json.dumps(current), db_path)
        _journal_power(FAN_LABELS[device], before, value)
        return resolve({"extra": {"watts": value}}, None)

    # --- a space device (light): the watts column the energy estimate already reads -------
    if device.startswith("space:"):
        try:
            _, space_id, dev_id = device.split(":", 2)
        except ValueError as exc:
            raise ValueError(f"{device!r} is not a valid space device id") from exc
        from .space_model import list_space_devices, upsert_space_device

        row = next(
            (d for d in list_space_devices(space_id, db_path=db_path) if str(d.get("device_id")) == dev_id),
            None,
        )
        if row is None:
            raise ValueError(f"no device {dev_id!r} on space {space_id!r}")
        extra = _extra(row)
        if extra.get("catalog_id") and catalog_watts is not None:
            raise PowerLockedError(
                f"{row.get('label') or dev_id} takes its wattage from the product database "
                f"({extra['catalog_id']}) — unmatch the product to set it by hand."
            )
        value = coerce_watts(watts)
        before = row.get("watts")
        upsert_space_device(
            space_id,
            {**row, "device_id": dev_id, "watts": value if value is not None else 0.0},
            db_path=db_path,
        )
        _journal_power(f"{space_id} · {row.get('label') or dev_id}", before, value)
        return resolve({"extra": {**extra, "watts": value}}, catalog_watts)

    # --- an appliance seat ---------------------------------------------------------------
    seat = device
    if seat not in POWERED_SEATS:
        raise ValueError(f"{seat!r} is not a powered seat")
    by_seat = {str(r.get("seat_id")): r for r in list_inventory(db_path)}
    row = by_seat.get(seat) or {"seat_id": seat, "extra": {}}
    current = resolve(row, catalog_watts)
    if current["locked"]:
        raise PowerLockedError(
            f"{SEAT_LABELS.get(seat, seat)} takes its wattage from the product database "
            f"({current['catalog_id']}) — unmatch the product to set it by hand."
        )

    value = coerce_watts(watts)
    extra = _extra(row)
    if value is None:
        extra.pop("watts", None)
    else:
        extra["watts"] = value
    upsert_inventory(seat, {"extra": extra})

    _journal_power(SEAT_LABELS.get(seat, seat), current.get("operator_watts"), value)
    return resolve({"seat_id": seat, "extra": extra}, catalog_watts)


def _journal_power(label: str, before: Any, after: float | None) -> None:
    """Every power change is written down — the estimate downstream depends on it."""
    try:
        from .settings_journal import journal_setting_change

        def fmt(v: Any) -> str:
            try:
                return f"{float(v):g} W" if v not in (None, "") else "not set"
            except (TypeError, ValueError):
                return "not set"

        journal_setting_change(f"Device power · {label}", fmt(before), fmt(after), domain="devices")
    except Exception:  # noqa: BLE001 — the journal must not fail the write
        pass
