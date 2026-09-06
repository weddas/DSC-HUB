"""Host diagnostics — log tails, log verbosity, and power actions.

Everything host-touching here runs a **configurable command** (settings keys with
sensible Pi defaults) so it adapts to the deploy topology and degrades to a
"manual" instruction off a Pi. Power actions are demo-guarded and always confirm
on the SPA side.
"""

from __future__ import annotations

import logging
import shlex
import shutil
import subprocess
from typing import Any

from .settings import get_setting, set_setting

_logger = logging.getLogger("dsc_brain")

LOG_SOURCES = ("brain", "system", "docker")

_DEFAULT_LOG_CMD = {
    "brain": "journalctl -u dsc-hub-compose.service -n {lines} --no-pager",
    "system": "journalctl -n {lines} --no-pager",
    "docker": "bash -c \"docker logs --tail {lines} $(docker ps -qf name=dsc-brain | head -1 || echo dsc-brain) 2>&1\"",
}
_DEFAULT_POWER_CMD = {
    "restart-brain": "sudo systemctl restart dsc-hub-compose.service",
    "restart-network": "sudo systemctl restart dsc-hub-net-policy.service",
    "reboot": "sudo systemctl reboot",
}

VALID_LEVELS = ("DEBUG", "INFO", "WARNING", "ERROR")


# ---------------------------------------------------------------- log verbosity


def apply_log_level_from_settings() -> str:
    """Call once at startup — restore the persisted brain log level."""
    level = str(get_setting("log_level", "INFO")).strip().upper()
    if level not in VALID_LEVELS:
        level = "INFO"
    logging.getLogger("dsc_brain").setLevel(getattr(logging, level))
    return level


def log_verbosity() -> dict[str, Any]:
    lvl = logging.getLevelName(logging.getLogger("dsc_brain").level)
    return {"level": lvl if lvl in VALID_LEVELS else "INFO", "options": list(VALID_LEVELS)}


def set_log_verbosity(level: str) -> dict[str, Any]:
    lv = str(level).strip().upper()
    if lv not in VALID_LEVELS:
        raise ValueError(f"level must be one of {VALID_LEVELS}")
    logging.getLogger("dsc_brain").setLevel(getattr(logging, lv))
    set_setting("log_level", lv)
    _logger.info("log verbosity set to %s", lv)
    return log_verbosity()


# ------------------------------------------------------------------- log tails


def _run(cmd: str, timeout: float = 8.0) -> tuple[int, str]:
    try:
        proc = subprocess.run(  # noqa: S603
            shlex.split(cmd), capture_output=True, text=True, timeout=timeout
        )
        out = (proc.stdout or "") + (("\n" + proc.stderr) if proc.stderr else "")
        return proc.returncode, out
    except FileNotFoundError as exc:
        return 127, f"{exc}"
    except subprocess.TimeoutExpired:
        return 124, "command timed out"
    except Exception as exc:  # noqa: BLE001
        return 1, f"{type(exc).__name__}: {exc}"


def tail_log(source: str, lines: int = 200) -> dict[str, Any]:
    src = str(source).strip().lower()
    if src not in LOG_SOURCES:
        raise ValueError(f"source must be one of {LOG_SOURCES}")
    n = max(10, min(int(lines), 2000))
    cmd = str(get_setting(f"log_cmd_{src}", "")).strip() or _DEFAULT_LOG_CMD[src]
    cmd = cmd.replace("{lines}", str(n))
    code, out = _run(cmd)
    body = out.strip().splitlines()
    ok = code == 0 and bool(body)
    if ok:
        hint = None
    else:
        base = (
            "This host doesn't expose that log (not a Pi, or the command needs adjusting via the "
            f"log_cmd_{src} setting)."
        )
        # Fold the raw subprocess error into the hint rather than leaking a bare
        # "[Errno 2] ... 'journalctl'" into the log pane as if it were log output.
        if code == 127:
            hint = f"'{shlex.split(cmd)[0] if cmd.strip() else cmd}' is not installed on this host. {base}"
        elif code == 124:
            hint = f"Log command timed out. {base}"
        else:
            hint = base
    return {
        "source": src,
        "cmd": cmd,
        "ok": ok,
        # Only real log content here — failures speak through `hint`.
        "lines": body[-n:] if ok else [],
        "exit": code,
        "hint": hint,
    }


def log_download_text(source: str, lines: int = 2000) -> tuple[str, str]:
    """Return (filename, text) for a plain-text download."""
    res = tail_log(source, lines)
    fname = f"dsc-{res['source']}-log.txt"
    text = "\n".join(res["lines"]) if res["ok"] else (res.get("hint") or "no log")
    return fname, text


# ---------------------------------------------------------------- power actions

POWER_ACTIONS = tuple(_DEFAULT_POWER_CMD)


def power_action(action: str) -> dict[str, Any]:
    act = str(action).strip().lower()
    if act not in _DEFAULT_POWER_CMD:
        raise ValueError(f"action must be one of {tuple(_DEFAULT_POWER_CMD)}")
    key = {"restart-brain": "brain_restart_cmd", "restart-network": "network_restart_cmd", "reboot": "reboot_cmd"}[act]
    cmd = str(get_setting(key, "")).strip() or _DEFAULT_POWER_CMD[act]
    parts = shlex.split(cmd)
    manual = {
        "status": "manual",
        "action": act,
        "cmd": cmd,
        "detail": f"'{parts[0] if parts else cmd}' isn't runnable here — run `{cmd}` on the Pi, "
        f"or set the {key} setting to a command this host can exec.",
    }
    if not parts or shutil.which(parts[0]) is None:
        return manual
    # Fire and forget — restart/reboot kills this process before it could reply.
    try:
        subprocess.Popen(  # noqa: S603
            parts, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL
        )
        _logger.warning("power action %s -> %s", act, cmd)
        return {"status": "started", "action": act, "cmd": cmd}
    except OSError:
        return manual
    except Exception as exc:  # noqa: BLE001
        return {"status": "failed", "action": act, "cmd": cmd, "detail": f"{type(exc).__name__}: {exc}"}
