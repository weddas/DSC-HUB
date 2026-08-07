from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "homeassistant" / "data"
DEFAULT_DB = Path(__file__).resolve().parents[1] / "data" / "dsc_brain.sqlite3"
