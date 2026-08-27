"""Demo mode flags — fully isolated software simulation (no LAN/hardware)."""

from __future__ import annotations

import ipaddress
import os
import re
from typing import Any

_PRIVATE_HOST = re.compile(
    r"^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.|localhost|dsc-brain\.local)",
    re.I,
)


def is_demo_mode() -> bool:
    return os.environ.get("DSC_DEMO_MODE", "").strip().lower() in ("1", "true", "yes", "on")


def _is_private_host(value: str) -> bool:
    v = (value or "").strip()
    if not v:
        return False
    if _PRIVATE_HOST.match(v):
        return True
    try:
        ip = ipaddress.ip_address(v.split(":")[0])
        return ip.is_private or ip.is_loopback
    except ValueError:
        return v.endswith(".local")


def assert_demo_safe_config(inventory: list[dict[str, Any]] | None = None) -> None:
    """Fail closed if demo mode would reach production/LAN endpoints."""
    if not is_demo_mode():
        return
    problems: list[str] = []
    for key, val in os.environ.items():
        if not key.startswith("DSC_") or not key.endswith("_API_KEY"):
            continue
        if val.strip():
            problems.append(f"env {key} must be empty in demo mode")
    from .settings import get_all_settings, list_inventory

    settings = get_all_settings()
    for sk in ("cannalib_api_url", "ollama_base_url"):
        url = (settings.get(sk) or "").strip()
        if url and _is_private_host(url.replace("http://", "").replace("https://", "").split("/")[0]):
            problems.append(f"setting {sk} points at private host")
    rows = inventory if inventory is not None else list_inventory()
    for row in rows:
        host = str(row.get("host") or "").strip()
        if host and _is_private_host(host):
            problems.append(f"inventory {row.get('seat_id')} host {host!r}")
        if row.get("api_key"):
            problems.append(f"inventory {row.get('seat_id')} has api_key")
    if problems:
        raise RuntimeError("demo mode unsafe config: " + "; ".join(problems))


def prepare_demo_settings() -> None:
    """Scrub settings/inventory so demo cannot dial LAN."""
    from .settings import connect, list_inventory, set_setting, upsert_inventory

    set_setting("cannalib_api_url", "")
    set_setting("ollama_base_url", "")
    set_setting("cannalib_use_local_fallback", "true")
    for row in list_inventory():
        seat_id = str(row["seat_id"])
        upsert_inventory(seat_id, {"host": "", "mac": None, "api_key": None})
    conn = connect()
    conn.execute("UPDATE fleet_inventory SET host = NULL, mac = NULL, api_key = NULL")
    conn.commit()
    conn.close()
