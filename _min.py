#!/usr/bin/env python3
import faulthandler
faulthandler.enable()
print("boot", flush=True)
import importlib.util, json, sqlite3, sys, time, traceback
from pathlib import Path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
LOG = ROOT / "_forum_progress.log"
OUT = ROOT / "_forum_merge_results.json"
MASTER = ROOT / "brain" / "data" / "dsc_brain.sqlite3"
STAGING = ROOT / "brain" 