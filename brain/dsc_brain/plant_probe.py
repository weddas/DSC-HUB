"""Plant ↔ probe assignment SoT (Bar 2).

Probe = hardware potN. Plant = durable UUID (migrated from legacy slot:N).
Assignment = inventory extra.assigned_plant_id plus pot-keyed roster row while live.
idle_home remains Soil Test dock only — never use it as plant assignment.
"""

from __future__ import annotations

import json
import uuid
from typing import Any

from .compose_store import get_helper, get_roster_slots, save_roster_slots, set_helper, update_roster_slot
from .settings import delete_roster, list_inventory, list_roster, upsert_inventory, upsert_roster
from .stage_model import stage_family, tent_id

STASH_KEY = "plant_stash"


def plant_id_for_slot(slot_num: int) -> str:
    """Legacy helper — prefer ensure_plant_uuid(slot_num) for new writes."""
    return ensure_plant_uuid(int(slot_num))


def ensure_plant_uuid(slot_num: int) -> str:
    """Stable plant UUID for a roster slot; persists plant_uuid on the slot row."""
    slots = get_roster_slots()
    changed = False
    found: dict[str, Any] | None = None
    for slot in slots:
        if int(slot.get("slot") or 0) != int(slot_num):
            continue
        found = slot
        existing = str(slot.get("plant_uuid") or "").strip()
        if existing:
            return existing
        new_id = f"plant:{uuid.uuid4()}"
        slot["plant_uuid"] = new_id
        changed = True
        break
    if found is None:
        raise ValueError(f"invalid roster slot {slot_num}")
    if changed:
        save_roster_slots(slots)
    return str(found.get("plant_uuid") or "")


def parse_slot_plant_id(plant_id: str) -> int | None:
    """Resolve plant id to roster slot number (legacy slot:N or plant:UUID)."""
    raw = str(plant_id or "").strip()
    if raw.startswith("slot:"):
        try:
            n = int(raw.split(":", 1)[1])
        except ValueError:
            return None
        return n if 1 <= n <= 8 else None
    if raw.startswith("plant:"):
        for slot in get_roster_slots():
            if str(slot.get("plant_uuid") or "") == raw:
                return int(slot.get("slot") or 0) or None
        return None
    return None


def migrate_legacy_plant_ids() -> int:
    """Ensure every non-empty slot has plant_uuid; rewrite inventory assigned_plant_id from slot:N."""
    slots = get_roster_slots()
    changed = False
    for slot in slots:
        status = str(slot.get("status") or "")
        if status in ("empty", "", "unknown", "unavailable"):
            continue
        if not str(slot.get("plant_uuid") or "").strip():
            slot["plant_uuid"] = f"plant:{uuid.uuid4()}"
            changed = True
    if changed:
        save_roster_slots(slots)
    rewritten = 0
    for row in list_inventory():
        if not str(row.get("seat_id") or "").startswith("pot"):
            continue
        extra = dict(row.get("extra") or {})
        aid = str(extra.get("assigned_plant_id") or "")
        slot_n = parse_slot_plant_id(aid) if aid.startswith("slot:") else None
        if slot_n:
            new_id = ensure_plant_uuid(slot_n)
            if new_id != aid:
                extra["assigned_plant_id"] = new_id
                upsert_inventory(str(row["seat_id"]), {"extra": extra})
                pot_n = int(str(row["seat_id"]).replace("pot", "") or "0")
                if 1 <= pot_n <= 4:
                    set_helper(f"text.dsc_probe{pot_n}_assigned_plant_id", new_id)
                rewritten += 1
    return rewritten


def _clear_probe_helpers(pot_n: int) -> None:
    set_helper(f"text.dsc_probe{pot_n}_plant_name", "")
    set_helper(f"select.dsc_probe{pot_n}_growth_stage", "")
    set_helper(f"input_select.dsc_probe{pot_n}_tent", "unassigned")
    set_helper(f"datetime.dsc_probe{pot_n}_sprout_date", "")
    set_helper(f"text.dsc_probe{pot_n}_assigned_plant_id", "")


def _apply_probe_helpers(pot_n: int, recipe: dict[str, Any], plant_id: str) -> None:
    set_helper(f"text.dsc_probe{pot_n}_plant_name", str(recipe.get("plant_name") or recipe.get("nickname") or ""))
    stage = str(recipe.get("growth_stage") or "")
    if stage:
        set_helper(f"select.dsc_probe{pot_n}_growth_stage", stage)
    tent = tent_id(str(recipe.get("tent") or "unassigned"))
    set_helper(f"input_select.dsc_probe{pot_n}_tent", tent)
    sprout = str(recipe.get("sprout_date") or "")[:10]
    if sprout:
        set_helper(f"datetime.dsc_probe{pot_n}_sprout_date", sprout)
    set_helper(f"text.dsc_probe{pot_n}_assigned_plant_id", plant_id)


def _set_assigned_plant_id(pot_n: int, plant_id: str) -> None:
    seat_id = f"pot{pot_n}"
    row = next((r for r in list_inventory() if r.get("seat_id") == seat_id), None)
    extra = dict((row or {}).get("extra") or {})
    extra["assigned_plant_id"] = str(plant_id or "")
    if row is None:
        upsert_inventory(seat_id, {"role": "pot", "extra": extra}, create=True)
    else:
        upsert_inventory(seat_id, {"extra": extra})
    set_helper(f"text.dsc_probe{pot_n}_assigned_plant_id", str(plant_id or ""))


def _slot_by_num(slot_num: int) -> dict[str, Any]:
    for slot in get_roster_slots():
        if int(slot.get("slot") or 0) == int(slot_num):
            return slot
    raise ValueError(f"invalid roster slot {slot_num}")


def _find_slot_for_pot(pot_n: int) -> int:
    for slot in get_roster_slots():
        if str(slot.get("pot") or "") == str(pot_n):
            return int(slot["slot"])
    row = next((r for r in list_roster() if r.get("seat_id") == f"pot{pot_n}"), None)
    if not row:
        return 0
    recipe = row.get("recipe") or {}
    from .compose_store import find_roster_slot_for_strain

    return find_roster_slot_for_strain(
        str(recipe.get("strain_display") or ""),
        str(recipe.get("nickname") or recipe.get("plant_name") or ""),
    )


def _pot_occupied(pot_n: int) -> bool:
    return any(r.get("seat_id") == f"pot{pot_n}" for r in list_roster())


def detach_plant_from_probe(pot_n: int) -> dict[str, Any]:
    """Free probe without destroying the plant (slot keeps identity + stash)."""
    n = int(pot_n)
    if n < 1 or n > 4:
        raise ValueError("pot must be 1-4")
    seat_id = f"pot{n}"
    row = next((r for r in list_roster() if r.get("seat_id") == seat_id), None)
    if not row:
        raise ValueError(f"No plant assigned to probe {n}")
    slot_num = _find_slot_for_pot(n)
    if slot_num <= 0:
        raise ValueError(f"No roster slot for probe {n} — cannot detach without losing plant")
    recipe = dict(row.get("recipe") or {})
    stash = {
        "strain_id": row.get("strain_id"),
        "stage": row.get("stage") or stage_family(str(recipe.get("growth_stage") or "")) or "veg",
        "recipe": recipe,
    }
    nickname = str(recipe.get("nickname") or recipe.get("plant_name") or "")
    update_roster_slot(
        slot_num,
        {
            "status": "detached",
            "pot": "none",
            "nickname": nickname,
            "strain": str(recipe.get("strain_display") or ""),
            "blend": str(recipe.get("blend") or ""),
            "sprout": str(recipe.get("sprout_date") or "")[:10],
            "tent": str(recipe.get("tent") or ""),
            "notes": str(recipe.get("notes") or ""),
            STASH_KEY: json.dumps(stash),
        },
    )
    delete_roster(seat_id)
    _clear_probe_helpers(n)
    _set_assigned_plant_id(n, "")
    return {
        "pot": n,
        "slot": slot_num,
        "plant_id": plant_id_for_slot(slot_num),
        "nickname": nickname,
        "detached": True,
    }


def assign_plant_to_probe(slot_num: int, pot_n: int) -> dict[str, Any]:
    """Bind a detached (or unassigned) roster slot onto a vacant probe."""
    slot_n = int(slot_num)
    n = int(pot_n)
    if slot_n < 1 or slot_n > 8:
        raise ValueError("slot must be 1-8")
    if n < 1 or n > 4:
        raise ValueError("pot must be 1-4")
    if _pot_occupied(n):
        raise ValueError(f"Probe {n} already has a plant — detach or move first")
    slot = _slot_by_num(slot_n)
    status = str(slot.get("status") or "")
    if status in ("empty", "", "unknown", "unavailable"):
        raise ValueError(f"Slot {slot_n} is empty — nothing to assign")
    raw_pot = str(slot.get("pot") or "none")
    if raw_pot not in ("none", "", str(n)) and _pot_occupied(int(raw_pot) if raw_pot.isdigit() else -1):
        raise ValueError(f"Slot {slot_n} still on probe {raw_pot} — detach or move first")

    stash_raw = slot.get(STASH_KEY) or ""
    stash: dict[str, Any] = {}
    if stash_raw:
        try:
            stash = json.loads(str(stash_raw))
        except json.JSONDecodeError:
            stash = {}
    recipe = dict(stash.get("recipe") or {})
    if not recipe:
        recipe = {
            "plant_name": str(slot.get("nickname") or ""),
            "nickname": str(slot.get("nickname") or ""),
            "strain_display": str(slot.get("strain") or ""),
            "blend": str(slot.get("blend") or ""),
            "sprout_date": str(slot.get("sprout") or "")[:10],
            "tent": tent_id(str(slot.get("tent") or "unassigned")),
            "notes": str(slot.get("notes") or ""),
            "growth_stage": "",
        }
    plant_id = plant_id_for_slot(slot_n)
    strain_id = stash.get("strain_id") or str(recipe.get("strain_display") or "generic").replace(" ", "_").lower()[:64]
    stage = stash.get("stage") or stage_family(str(recipe.get("growth_stage") or "")) or "veg"
    upsert_roster(
        f"pot{n}",
        {"strain_id": strain_id, "stage": stage, "recipe": recipe},
    )
    _apply_probe_helpers(n, recipe, plant_id)
    _set_assigned_plant_id(n, plant_id)
    update_roster_slot(
        slot_n,
        {
            "status": "active",
            "pot": str(n),
            "nickname": str(recipe.get("nickname") or recipe.get("plant_name") or slot.get("nickname") or ""),
            "strain": str(recipe.get("strain_display") or slot.get("strain") or ""),
            STASH_KEY: json.dumps(stash) if stash else str(stash_raw or ""),
        },
    )
    return {
        "pot": n,
        "slot": slot_n,
        "plant_id": plant_id,
        "tent": recipe.get("tent"),
        "assigned": True,
    }


def move_plant(from_pot: int, to_pot: int) -> dict[str, Any]:
    """Atomic reassign from one probe to another."""
    src = int(from_pot)
    dst = int(to_pot)
    if src == dst:
        raise ValueError("from and to probes must differ")
    if _pot_occupied(dst):
        raise ValueError(f"Probe {dst} already has a plant — detach it first")
    detached = detach_plant_from_probe(src)
    assigned = assign_plant_to_probe(int(detached["slot"]), dst)
    return {"from_pot": src, "to_pot": dst, "slot": detached["slot"], "plant_id": assigned["plant_id"], "moved": True}


def sync_assignment_on_compose_assign(pot_n: int, slot_num: int) -> None:
    """Call from assign_to_pot so compose path writes Assignment SoT."""
    _set_assigned_plant_id(int(pot_n), plant_id_for_slot(int(slot_num)) if slot_num > 0 else "")
