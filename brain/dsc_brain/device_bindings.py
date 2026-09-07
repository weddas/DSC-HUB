"""Device bindings shared by every local device lane (Zigbee, Tuya, …).

A binding is *where a device lives and what it is for*: role → zone → optional
task. The Zigbee track built the vocabulary; this module holds the parts that are
not radio-specific so a second lane reuses one implementation instead of
copying it (plan-tuya-local § 2.1).
"""

from __future__ import annotations

from typing import Any

VALID_ZONES: frozenset[str] = frozenset({"4x8", "2x4", "room", "shared"})

# capability_class → role kinds it may bind to. "motion"/"other" bind nothing
# unless the operator overrides the class ("Show all" in the bind row).
CLASS_ROLE_KINDS: dict[str, frozenset[str]] = {
    "climate": frozenset({"climate"}),
    "liquid": frozenset({"safety"}),
    "plug": frozenset({"plug"}),
    "meter": frozenset({"meter"}),
    "water": frozenset({"water"}),
    "motion": frozenset(),
    "other": frozenset(),
}

BINDING_KEYS = ("role", "zone", "alias", "enabled", "friendly_name", "capability_override")


def normalize_binding(
    row: Any,
    valid_roles: frozenset[str],
    *,
    strict: bool,
) -> dict[str, Any] | None:
    """One binding row → the canonical shape, or None when the row is not an object.

    ``strict`` raises ValueError on an unknown role / zone / class (operator PUT);
    otherwise unknown values degrade to ``unbound`` / ``shared`` (loading old rows).
    """
    if not isinstance(row, dict):
        return None
    role = str(row.get("role") or "unbound")
    if role not in valid_roles:
        if strict:
            raise ValueError(f"invalid role: {role}")
        role = "unbound"
    zone = str(row.get("zone") or "shared")
    if zone not in VALID_ZONES:
        if strict:
            raise ValueError(f"invalid zone: {zone}")
        zone = "shared"
    binding: dict[str, Any] = {
        "role": role,
        "zone": zone,
        "alias": str(row.get("alias") or ""),
        "enabled": bool(row.get("enabled", True)),
        "friendly_name": str(row.get("friendly_name") or ""),
    }
    override = row.get("capability_override")
    if override is not None and override != "":
        cap = str(override).lower()
        if cap in CLASS_ROLE_KINDS:
            binding["capability_override"] = cap
        elif strict:
            raise ValueError(f"invalid capability_override: {override}")
    return binding


def role_conflicts(*binding_maps: dict[str, dict[str, Any]]) -> dict[str, list[str]]:
    """role → device ids claiming it, across every lane handed in (only roles with > 1 claim).

    One role, one device, regardless of radio: a Tuya plug and a Zigbee plug cannot
    both be ``plug_pump``.
    """
    claimed: dict[str, list[str]] = {}
    for bindings in binding_maps:
        for device_id, row in bindings.items():
            if not isinstance(row, dict):
                continue
            role = str(row.get("role") or "unbound")
            if role == "unbound" or not row.get("enabled", True):
                continue
            claimed.setdefault(role, []).append(str(device_id))
    return {role: ids for role, ids in claimed.items() if len(ids) > 1}
