#!/usr/bin/env python3
"""Windows-safe subprocess kwargs: no console flash (CREATE_NO_WINDOW + SW_HIDE)."""
from __future__ import annotations

import subprocess
import sys
from typing import Any


CREATE_NO_WINDOW = 0x08000000


def hidden_popen_kwargs(**extra: Any) -> dict[str, Any]:
    """Return kwargs for subprocess.Popen/run that avoid a visible console on Windows."""
    kwargs: dict[str, Any] = dict(extra)
    if sys.platform == "win32":
        kwargs["creationflags"] = int(kwargs.get("creationflags", 0)) | CREATE_NO_WINDOW
        si = kwargs.get("startupinfo") or subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        si.wShowWindow = 0  # SW_HIDE
        kwargs["startupinfo"] = si
        # Prefer no inherited console flash when parent has none
        kwargs.setdefault("stdin", subprocess.DEVNULL)
    return kwargs
