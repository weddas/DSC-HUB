from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "homeassistant" / "data"
BRAIN_DATA = Path(__file__).resolve().parents[1] / "data"
# Slim operational catalog (Want / tick). Research corpus lives in sibling CannaLib.
DEFAULT_DB = BRAIN_DATA / "dsc_ops.sqlite3"
CANNALIB_ROOT = REPO_ROOT.parent / "CannaLib"
CANNALIB_DB = CANNALIB_ROOT / "brain" / "data" / "dsc_brain.sqlite3"
