from __future__ import annotations

import os
from pathlib import Path

_REPO_DEFAULT = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(os.environ.get("DSC_REPO_ROOT", str(_REPO_DEFAULT)))
DATA_DIR = REPO_ROOT / "homeassistant" / "data"
_default_brain = Path(__file__).resolve().parents[1] / "data"
BRAIN_DATA = Path(os.environ.get("DSC_DATA", str(_default_brain)))
DEFAULT_DB = BRAIN_DATA / "dsc_ops.sqlite3"
CANNALIB_ROOT = REPO_ROOT.parent / "CannaLib"
CANNALIB_DB = CANNALIB_ROOT / "brain" / "data" / "dsc_brain.sqlite3"
EXPECTED_FIRMWARE = os.environ.get("DSC_EXPECTED_FIRMWARE", "7.0.0.0")
SURFACE_VERSION = os.environ.get("DSC_SURFACE_VERSION", "7.3.0")


def resolve_cannalib_db() -> Path | None:
    """On-Pi corpus sqlite for catalog fallback (read-only)."""
    env = os.environ.get("CANNALIB_DB_PATH", "").strip()
    if env:
        path = Path(env)
        if path.is_file():
            return path
    for candidate in (
        CANNALIB_DB,
        DEFAULT_DB.parent / "cannalib" / "dsc_brain.sqlite3",
        BRAIN_DATA.parent / "cannalib" / "dsc_brain.sqlite3",
        Path("/cannalib/dsc_brain.sqlite3"),
    ):
        if candidate.is_file():
            return candidate
    return None
