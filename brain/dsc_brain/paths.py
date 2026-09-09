from __future__ import annotations

import os
from pathlib import Path

_REPO_DEFAULT = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(os.environ.get("DSC_REPO_ROOT", str(_REPO_DEFAULT)))
DATA_DIR = REPO_ROOT / "data"
_default_brain = Path(__file__).resolve().parents[1] / "data"
BRAIN_DATA = Path(os.environ.get("DSC_DATA", str(_default_brain)))
DEFAULT_DB = BRAIN_DATA / "dsc_ops.sqlite3"


def default_db() -> Path:
    """The ops database, resolved at CALL time.

    ``DEFAULT_DB`` below is computed when this module is first imported, so a module that
    binds it opens whatever ``DSC_DATA`` said at import. In the brain process that is the
    same thing — the environment is set before anything imports — but under pytest the
    fixtures point ``DSC_DATA`` at a scratch dir AFTER import, so import-time binders kept
    reading and WRITING the developer's real ``brain/data`` database (proven 2026-09-10:
    plant_journal rows and journal_media rows from test runs were sitting in it).

    Call this instead of ``db_path or DEFAULT_DB``.
    """
    return Path(os.environ.get("DSC_DATA", str(_default_brain))) / "dsc_ops.sqlite3"


def media_root() -> Path:
    """``DSC_DATA/media`` resolved at CALL time, not import time.

    Media (camera frames, journal photos) lives on disk rather than in SQLite because it
    dwarfs the journals. Resolved per call so tests can point ``DSC_DATA`` at a scratch dir
    after this module is imported.
    """
    return Path(os.environ.get("DSC_DATA", str(_default_brain))) / "media"
CANNALIB_ROOT = REPO_ROOT.parent / "CannaLib"
CANNALIB_DB = CANNALIB_ROOT / "brain" / "data" / "dsc_brain.sqlite3"
EXPECTED_FIRMWARE = os.environ.get("DSC_EXPECTED_FIRMWARE", "8.1.0.0")

# The served UI/API "surface" version IS the brain version. Only an explicit
# non-empty DSC_SURFACE_VERSION overrides it — otherwise it can never drift from
# __version__ (a stale .env pinned it to 7.3.0 while the brain was on 8.0.0).
from . import __version__ as _brain_version  # noqa: E402

SURFACE_VERSION = os.environ.get("DSC_SURFACE_VERSION", "").strip() or _brain_version


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
