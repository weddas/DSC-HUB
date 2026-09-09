"""What an operator can log in a grow journal, and what each action asks for.

Pass S6. Until now a journal entry was free text plus a frozen sensor snapshot, which
records *that* something happened but not *what*, so nothing downstream could count
waterings or chart feed EC against runoff.

The catalogue below is the settings row the plan calls for: a type list with per-type
fields and a per-type "freeze a snapshot?" flag. Types are data, not code branches — the
operator can add their own, and a custom type behaves exactly like a built-in one.

Design notes worth keeping:

* **Fields are declared, not free-form.** Each field has an id, a label, a kind and a unit,
  so the SPA renders the composer from this list and the values land in a shape charts can
  read later. A journal of prose cannot be plotted.
* **Snapshot-on-log is per type, and every BUILT-IN type opts in.** "Every entry is backed
  by the kit's sensors" is the promise that separates this from a paper notebook, and the
  journal has always frozen one — flipping notes to no-snapshot would quietly drop data a
  live rig is already collecting. The flag exists so operator-defined types CAN opt out
  (a reminder-tick or a shopping note has no room state worth keeping), not to trim the
  built-ins.
* **Nothing here actuates.** Logging a watering records that the operator watered. It does
  not run a pump — the irrigation loop is a separate, safety-gated path.
"""

from __future__ import annotations

import json
from typing import Any

from .settings import get_setting, set_setting

SETTING_CUSTOM_ACTIONS = "journal_custom_actions"

# kind: number | text | choice — what the composer renders and what the value must parse as.
FieldSpec = dict[str, Any]


def _f(fid: str, label: str, kind: str = "number", unit: str = "", **extra: Any) -> FieldSpec:
    return {"id": fid, "label": label, "kind": kind, "unit": unit, **extra}


# Amount/EC/pH recur because they are what a grower actually writes down; runoff EC/pH are
# the pair that make a feed entry diagnostic rather than decorative.
_AMOUNT = _f("amount_l", "Amount", unit="L", step=0.1, min=0)
_EC = _f("ec", "EC", unit="mS/cm", step=0.1, min=0)
_PH = _f("ph", "pH", step=0.1, min=0, max=14)
_RUNOFF_EC = _f("runoff_ec", "Runoff EC", unit="mS/cm", step=0.1, min=0)
_RUNOFF_PH = _f("runoff_ph", "Runoff pH", step=0.1, min=0, max=14)

BUILTIN_ACTIONS: list[dict[str, Any]] = [
    {"id": "note", "label": "Note", "icon": "journal", "snapshot": True, "fields": []},
    {"id": "water", "label": "Water", "icon": "water-drop", "snapshot": True,
     "fields": [_AMOUNT, _PH, _RUNOFF_PH]},
    {"id": "feed", "label": "Feed", "icon": "nutrient", "snapshot": True,
     "fields": [_AMOUNT, _EC, _PH, _RUNOFF_EC, _RUNOFF_PH,
                _f("mix", "Mix / product", kind="text")]},
    {"id": "flush", "label": "Flush", "icon": "water-drop", "snapshot": True,
     "fields": [_AMOUNT, _RUNOFF_EC]},
    {"id": "transplant", "label": "Transplant", "icon": "plant", "snapshot": True,
     "fields": [_f("pot_size_l", "New pot size", unit="L", step=0.5, min=0),
                _f("medium", "Medium", kind="text")]},
    {"id": "defoliate", "label": "Defoliate", "icon": "leaf", "snapshot": True,
     "fields": [_f("leaves_removed", "Leaves removed", step=1, min=0)]},
    {"id": "train", "label": "Train", "icon": "plant", "snapshot": True,
     "fields": [_f("method", "Method", kind="choice",
                   choices=["LST", "HST", "SCROG", "SOG", "supercrop", "tie-down"])]},
    {"id": "top", "label": "Top / prune", "icon": "leaf", "snapshot": True,
     "fields": [_f("nodes", "Nodes topped", step=1, min=0)]},
    {"id": "flip", "label": "Flip to flower", "icon": "photoperiod-night", "snapshot": True,
     "fields": [_f("photoperiod_h", "New photoperiod", unit="h", step=0.5, min=0, max=24)]},
    {"id": "pest", "label": "Pest / issue", "icon": "alert", "snapshot": True,
     "fields": [_f("what", "What was seen", kind="text"),
                _f("treatment", "Treatment", kind="text")]},
    {"id": "harvest", "label": "Harvest", "icon": "harvest", "snapshot": True,
     "fields": [_f("wet_g", "Wet weight", unit="g", step=1, min=0),
                _f("dry_g", "Dry weight", unit="g", step=1, min=0)]},
]

BUILTIN_IDS = frozenset(a["id"] for a in BUILTIN_ACTIONS)

_VALID_KINDS = frozenset({"number", "text", "choice"})


def load_custom_actions() -> list[dict[str, Any]]:
    raw = get_setting(SETTING_CUSTOM_ACTIONS, "")
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if not isinstance(parsed, list):
        return []
    out: list[dict[str, Any]] = []
    for row in parsed:
        if not isinstance(row, dict):
            continue
        aid = str(row.get("id") or "").strip().lower()
        if not aid or aid in BUILTIN_IDS:
            continue
        out.append({
            "id": aid,
            "label": str(row.get("label") or aid),
            "icon": str(row.get("icon") or "journal"),
            "snapshot": bool(row.get("snapshot", False)),
            "fields": [f for f in (row.get("fields") or []) if isinstance(f, dict)],
            "custom": True,
        })
    return out


def save_custom_actions(actions: Any) -> list[dict[str, Any]]:
    if not isinstance(actions, list):
        raise ValueError("actions must be a list")
    cleaned: list[dict[str, Any]] = []
    seen: set[str] = set()
    for row in actions:
        if not isinstance(row, dict):
            raise ValueError("each action must be an object")
        aid = str(row.get("id") or "").strip().lower()
        if not aid or not all(ch.isalnum() or ch == "_" for ch in aid):
            raise ValueError(f"invalid action id {aid!r} — lowercase letters, digits, underscore")
        if aid in BUILTIN_IDS:
            raise ValueError(f"'{aid}' is a built-in action")
        if aid in seen:
            raise ValueError(f"duplicate action id: {aid}")
        seen.add(aid)
        fields = []
        for f in row.get("fields") or []:
            if not isinstance(f, dict):
                raise ValueError("each field must be an object")
            kind = str(f.get("kind") or "number")
            if kind not in _VALID_KINDS:
                raise ValueError(f"field kind must be one of {sorted(_VALID_KINDS)}")
            fields.append({
                "id": str(f.get("id") or "").strip().lower(),
                "label": str(f.get("label") or ""),
                "kind": kind,
                "unit": str(f.get("unit") or ""),
            })
        cleaned.append({
            "id": aid,
            "label": (str(row.get("label") or aid).strip() or aid)[:60],
            "icon": str(row.get("icon") or "journal"),
            "snapshot": bool(row.get("snapshot", False)),
            "fields": fields,
        })
    set_setting(SETTING_CUSTOM_ACTIONS, json.dumps(cleaned))
    return cleaned


def action_catalogue() -> list[dict[str, Any]]:
    return [*BUILTIN_ACTIONS, *load_custom_actions()]


def get_action(action_id: str) -> dict[str, Any] | None:
    aid = str(action_id or "").strip().lower()
    for row in action_catalogue():
        if row["id"] == aid:
            return row
    return None


def wants_snapshot(action_id: str) -> bool:
    """Whether logging this action should freeze the room's state.

    Unknown actions get a snapshot: an entry whose type we do not recognise is exactly the
    case where the surrounding conditions are worth keeping.
    """
    action = get_action(action_id)
    return True if action is None else bool(action.get("snapshot"))


def clean_fields(action_id: str, values: Any) -> dict[str, Any]:
    """Keep only fields the action declares, coerced to their declared kind.

    Silently dropping unknown keys rather than erroring: the composer and the catalogue can
    be a version apart (a phone with a cached bundle), and losing one field beats refusing
    the whole entry the operator just typed.
    """
    if not isinstance(values, dict):
        return {}
    action = get_action(action_id)
    if not action:
        return {}
    declared = {str(f.get("id")): f for f in action.get("fields") or []}
    out: dict[str, Any] = {}
    for key, raw in values.items():
        spec = declared.get(str(key))
        if not spec or raw is None or raw == "":
            continue
        if spec.get("kind") == "number":
            try:
                out[str(key)] = float(raw)
            except (TypeError, ValueError):
                continue  # a number field that did not parse is not worth storing as prose
        else:
            out[str(key)] = str(raw)[:500]
    return out


def summarise(action_id: str, fields: dict[str, Any]) -> str:
    """One-line human summary, e.g. "Water · 2.0 L · pH 6.2" — what the journal row shows."""
    action = get_action(action_id)
    if not action:
        return str(action_id or "").replace("_", " ").strip() or "Entry"
    parts = [str(action["label"])]
    for spec in action.get("fields") or []:
        fid = str(spec.get("id"))
        if fid not in fields:
            continue
        value = fields[fid]
        unit = str(spec.get("unit") or "")
        if isinstance(value, float):
            text = f"{value:g}{(' ' + unit) if unit else ''}"
        else:
            text = str(value)
        label = str(spec.get("label") or fid)
        # pH reads as "pH 6.2"; a unit-carrying number reads as "2 L" without its label.
        parts.append(text if unit else f"{label} {text}")
    return " · ".join(parts)
