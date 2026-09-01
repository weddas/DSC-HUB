"""Photoperiod conflict banners + dark-violation system journal — never auto-move."""

from __future__ import annotations

import time
from typing import Any

from .plant_journal import add_plant_entry
from .space_journal import add_space_entry
from .space_occupants import other_kit_space


def space_conflict_banners(
    space_id: str,
    *,
    plant_id: str | None,
    plant_want_hours: float | None,
    space_want_hours: float | None,
    mate_count: int = 0,
) -> list[dict[str, Any]]:
    """Banner when one plant wants a different photoperiod than the space / mates."""
    if plant_want_hours is None or space_want_hours is None:
        return []
    if abs(float(plant_want_hours) - float(space_want_hours)) < 0.25:
        return []
    if mate_count < 1 and not plant_id:
        return []
    move_to = other_kit_space(space_id)
    return [
        {
            "kind": "photoperiod_conflict",
            "space_id": space_id,
            "plant_id": plant_id,
            "plant_want_hours": float(plant_want_hours),
            "space_want_hours": float(space_want_hours),
            "message": (
                f"Plant wants {plant_want_hours:g}h light but space runs {space_want_hours:g}h. "
                "Lighting is space-owned — suggest move, never auto-move."
            ),
            "suggest_move": {
                "to_space_id": move_to,
                "auto_move": False,
                "honesty": "Operator must move the plant — brain will not relocate it",
            },
            "auto_apply": False,
        }
    ]


def record_dark_violation(
    space_id: str,
    note: str,
    *,
    plant_id: str | None = None,
    db_path=None,
) -> dict[str, Any]:
    now = time.time()
    msg = str(note or "Dark-period violation observed").strip()
    space_row = add_space_entry(
        space_id,
        now,
        msg,
        source="system",
        tags=["dark_violation"],
        db_path=db_path,
    )
    plant_row = None
    if plant_id:
        plant_row = add_plant_entry(
            str(plant_id),
            now,
            msg,
            source="system",
            tags=["dark_violation"],
            db_path=db_path,
        )
    return {"space": space_row, "plant": plant_row}
