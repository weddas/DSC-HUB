"""Stage-from-age model + tent vocabulary (port of the retired HA template pack).

Thresholds match homeassistant/packages/dsc_v4_strain_catalog.yaml
(dsc_potN_expected_stage) so the Pi brain derives the same stage the HA
stack did. Labels match the hub firmware grow-stage presets.
"""

from __future__ import annotations

# UI/tent vocabulary: the grow space has two tents — 4x8 (main) and 2x4 (clone).
# Internally (hub firmware, pot helpers) tents are "main"/"clone"; the UI and
# roster API speak "4x8"/"2x4".
TENT_LABEL_BY_ID: dict[str, str] = {"main": "4x8", "clone": "2x4", "unassigned": "unassigned"}
TENT_ID_BY_LABEL: dict[str, str] = {
    "4x8": "main",
    "2x4": "clone",
    "main": "main",
    "clone": "clone",
    "unassigned": "unassigned",
}


def tent_id(value: str) -> str:
    """Normalize any tent spelling ("4x8", "2x4", "main", "clone") to the internal id."""
    return TENT_ID_BY_LABEL.get(str(value or "").strip().lower(), "main")


def expected_stage(days: int, auto: bool = False) -> str:
    """Derive the grow stage from days since sprout (photoperiod vs autoflower)."""
    if days < 0:
        return "unknown"
    if days <= 3:
        return "Germination"
    if days <= 14:
        return "Seedling"
    if days <= 28:
        return "Early Vegetative"
    if not auto and days <= 42:
        return "Vegetative"
    if not auto and days <= 49:
        return "Late (Push) Vegetative"
    if auto and days <= 21:
        return "Vegetative"
    if auto and days <= 28:
        return "Early Flowering"
    if auto and days <= 49:
        return "Flowering"
    if auto and days <= 63:
        return "Late Flowering"
    if not auto and days <= 56:
        return "Early Flowering"
    if not auto and days <= 77:
        return "Flowering"
    if not auto and days <= 91:
        return "Late Flowering"
    return "Final 48-72h Flowering"


def stage_family(stage: str) -> str:
    """Collapse a stage label into the want-band family (seedling/veg/flower)."""
    s = (stage or "").strip().lower()
    if not s or s in ("unknown", "—"):
        return ""
    if "germ" in s or "seedling" in s:
        return "seedling"
    if "flower" in s or "flush" in s or "final" in s:
        return "flower"
    if "veg" in s:
        return "veg"
    if "dry" in s:
        return "flower"
    return "veg"


# Ordered for age-model advance (must match select.dsc_probeN_growth_stage options).
STAGE_RANK: dict[str, int] = {
    "Germination": 0,
    "Seedling": 1,
    "Early Vegetative": 2,
    "Vegetative": 3,
    "Late (Push) Vegetative": 4,
    "Early Flowering": 5,
    "Flowering": 6,
    "Late Flowering": 7,
    "Final 48-72h Flowering": 8,
}


def stage_rank(stage: str) -> int:
    """Rank for calendar advance; unknown labels sort as -1."""
    return STAGE_RANK.get((stage or "").strip(), -1)


# Hub 2x4 Climate Mode by stage family (policy taxonomy — not Mother/Clones stamps).
CLONE_MODE_BY_FAMILY: dict[str, str] = {
    "seedling": "Follow Plants",
    "veg": "Follow Plants",
    "flower": "Follow 4x8",
}


def clone_mode_for_stage(stage: str) -> str | None:
    """Map a derived stage to the hub's 2x4 clone-tent mode. None = leave alone."""
    return CLONE_MODE_BY_FAMILY.get(stage_family(stage))
