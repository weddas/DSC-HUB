"""Emit brain proposals to hub Native API (Pi appliance path)."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from .settings import get_setting, list_inventory

_logger = logging.getLogger(__name__)

# Hub template entities the brain may nudge (hub clamps / failsafe still wins).
HUB_EMIT_MAP: dict[str, tuple[str, str]] = {
    "temp_c_low": ("switch", "heater_demand"),
    "temp_c_high": ("switch", "ac_demand"),
    "rh_pct_low": ("switch", "humidifier_demand"),
    "rh_pct_high": ("switch", "dehumidifier_demand"),
}


async def emit_proposal(commands: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Best-effort hub write. Returns per-command results."""
    hub_row = next((r for r in list_inventory() if r.get("role") == "hub"), None)
    if not hub_row or not hub_row.get("in_service"):
        return [{"ok": False, "detail": "hub not in service"}]
    host = hub_row.get("host") or ""
    api_key = hub_row.get("api_key") or get_setting("dsc_hub_api_key", "")
    if not host:
        return [{"ok": False, "detail": "hub host missing"}]

    try:
        from aioesphomeapi import APIClient
    except ImportError:
        return [{"ok": False, "detail": "aioesphomeapi not installed"}]

    results: list[dict[str, Any]] = []
    client = APIClient(host, 6053, api_key or "")
    try:
        await client.connect(login=True)
        for cmd in commands:
            cmd_type = cmd.get("type", "noop")
            if cmd_type == "noop":
                results.append({"ok": True, "type": "noop", "detail": cmd.get("reason", "")})
                continue
            metric = str(cmd.get("metric", ""))
            mapping = HUB_EMIT_MAP.get(metric)
            if not mapping:
                results.append({"ok": False, "type": cmd_type, "detail": f"no hub map for {metric}"})
                continue
            _domain, object_id = mapping
            try:
                # Proposal only — hub firmware applies guards; we log intent for soak.
                _logger.info("hub emit proposal %s -> %s", metric, object_id)
                results.append({"ok": True, "type": cmd_type, "object_id": object_id, "emitted": "logged"})
            except Exception as exc:  # noqa: BLE001
                results.append({"ok": False, "type": cmd_type, "detail": str(exc)})
    except Exception as exc:  # noqa: BLE001
        return [{"ok": False, "detail": str(exc)}]
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass
    return results


def emit_proposal_sync(commands: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return asyncio.run(emit_proposal(commands))
