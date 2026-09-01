"""Resolve roster plants currently in a kit space."""

from __future__ import annotations

from .compose_store import get_roster_slots
from .plant_probe import plant_id_for_slot
from .stage_model import tent_id


def occupant_plant_ids_for_space(space_id: str) -> list[str]:
    """Plant UUIDs for non-empty roster slots whose tent matches space_id (4x8|2x4)."""
    target = tent_id(str(space_id or ""))
    if target == "unassigned":
        return []
    out: list[str] = []
    for slot in get_roster_slots():
        status = str(slot.get("status") or "").strip().lower()
        if status in ("empty", "", "unknown", "unavailable"):
            continue
        slot_tent = tent_id(str(slot.get("tent") or ""))
        if slot_tent != target:
            continue
        sn = int(slot.get("slot") or 0)
        if sn < 1:
            continue
        try:
            out.append(plant_id_for_slot(sn))
        except ValueError:
            continue
    return out


def other_kit_space(space_id: str) -> str:
    tid = tent_id(str(space_id or ""))
    if tid == "main":
        return "2x4"
    if tid == "clone":
        return "4x8"
    return "4x8"
