"""Canonical 2×4 Climate Mode taxonomy (shared with SPA / firmware intent).

Policy select only — not a second growth-stage engine.
Legacy Mother / Clones & Seedlings map via migrator; unknown modes have no idx.
"""

from __future__ import annotations

CLIMATE_MODE_OPTIONS: tuple[str, ...] = (
    "Follow 4x8",
    "Follow Plants",
    "Custom",
    "Off",
)

_LEGACY_CLONE_MODE: dict[str, str] = {
    "Clones & Seedlings": "Follow Plants",
    "Clones": "Follow Plants",
    "Mother": "Custom",
}


def migrate_legacy_clone_mode(raw: str) -> str:
    s = (raw or "").strip()
    if s in CLIMATE_MODE_OPTIONS:
        return s
    return _LEGACY_CLONE_MODE.get(s, s)


def clone_mode_idx(mode: str) -> int | None:
    """Wire idx after protocol remap (0..3). None = unknown / do not stamp."""
    m = migrate_legacy_clone_mode(mode)
    try:
        return CLIMATE_MODE_OPTIONS.index(m)
    except ValueError:
        return None


def is_external_targets_mode(mode: str) -> bool:
    """Targets owned outside ESP presets (main stage or Pi Follow Plants)."""
    return migrate_legacy_clone_mode(mode) in ("Follow 4x8", "Follow Plants")


def is_follow_plants_mode(mode: str) -> bool:
    return migrate_legacy_clone_mode(mode) == "Follow Plants"
