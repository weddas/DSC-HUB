from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "homeassistant" / "data"
BRAIN_DATA = Path(__file__).resolve().parents[1] / "data"
DEFAULT_DB = BRAIN_DATA / "dsc_brain.sqlite3"
# Alias kept for docs / optional rename; master remains dsc_brain.sqlite3.
MASTER_STRAINS_DB = DEFAULT_DB
STAGING_DIR = BRAIN_DATA / "staging"


def sanitize_source_slug(source_id: str) -> str:
    """Filesystem-safe staging DB stem from a source id."""
    slug = re.sub(r"[^a-z0-9]+", "_", (source_id or "").lower()).strip("_")
    return slug[:80] or "unknown"


def staging_db_path(source_id: str, *, staging_dir: Path | None = None) -> Path:
    """Return `brain/data/staging/<family>.sqlite3` for a source id / family."""
    root = staging_dir or STAGING_DIR
    return root / f"{sanitize_source_slug(source_id)}.sqlite3"
