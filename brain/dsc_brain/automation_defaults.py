"""Defaults applied to a *new* automation rule (plan-settings S3): debounce, release and
an optional time window. Existing rules keep their own values; the editor seeds these.
"""

from __future__ import annotations

import json
import re
from typing import Any

from .settings import get_setting, set_setting

SETTING_KEY = "automation_defaults_json"
_HHMM = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")

DEFAULTS: dict[str, Any] = {"debounce_s": 0, "release_s": 0, "window": None}


def get_automation_defaults() -> dict[str, Any]:
    raw = get_setting(SETTING_KEY, "")
    out = dict(DEFAULTS)
    if not raw:
        return out
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return out
    if not isinstance(parsed, dict):
        return out
    for key in ("debounce_s", "release_s"):
        try:
            out[key] = max(0, int(float(parsed.get(key, 0) or 0)))
        except (TypeError, ValueError):
            pass
    win = parsed.get("window")
    if isinstance(win, dict) and _HHMM.match(str(win.get("start", ""))) and _HHMM.match(str(win.get("end", ""))):
        out["window"] = {"start": str(win["start"]), "end": str(win["end"])}
    return out


def patch_automation_defaults(patch: dict[str, Any]) -> dict[str, Any]:
    current = get_automation_defaults()
    for key in ("debounce_s", "release_s"):
        if key in patch:
            try:
                val = int(float(patch[key]))
            except (TypeError, ValueError) as exc:
                raise ValueError(f"{key} must be a whole number of seconds") from exc
            if val < 0 or val > 86400:
                raise ValueError(f"{key} must be within 0–86400 s")
            current[key] = val
    if "window" in patch:
        win = patch["window"]
        if win is None:
            current["window"] = None
        else:
            if not isinstance(win, dict):
                raise ValueError("window must be {start, end} or null")
            start, end = str(win.get("start", "")), str(win.get("end", ""))
            if not (_HHMM.match(start) and _HHMM.match(end)):
                raise ValueError("window start/end must be HH:MM")
            if start == end:
                raise ValueError("window start and end must differ")
            current["window"] = {"start": start, "end": end}
    set_setting(SETTING_KEY, json.dumps(current, separators=(",", ":"), sort_keys=True))
    return current
