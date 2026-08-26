"""Emit brain proposals to hub Native API (Pi appliance path)."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from .api_lock import host_lock
from .hub_controls import HUB_SWITCH_OID_TO_ENTITY
from .native_api import make_api_client
from .settings import get_setting, list_inventory

_logger = logging.getLogger(__name__)

# Inventory seat → hub switch object_id (slug + legacy internal-id variants).
_SEAT_TO_IN_SERVICE_OIDS: dict[str, tuple[str, ...]] = {
    "pot1": ("pot1_in_service", "pot1_in_service_switch"),
    "pot2": ("pot2_in_service", "pot2_in_service_switch"),
    "pot3": ("pot3_in_service", "pot3_in_service_switch"),
    "pot4": ("pot4_in_service", "pot4_in_service_switch"),
    "ac": ("ac_in_service", "ac_in_service_switch"),
    "mister": ("clone_humidifier_in_service", "clone_hum_in_service_switch"),
}

# Hub template entities the brain may nudge (hub clamps / failsafe still wins).
HUB_EMIT_MAP: dict[str, tuple[str, str]] = {
    "temp_c_low": ("switch", "heater_demand"),
    "temp_c_high": ("switch", "ac_demand"),
    "rh_pct_low": ("switch", "humidifier_demand"),
    "rh_pct_high": ("switch", "dehumidifier_demand"),
}


async def sync_hub_in_service(seat_id: str, in_service: bool) -> dict[str, Any]:
    """Mirror inventory in_service onto hub switch.dsc_hub_*_in_service (WR-P1-1)."""
    oids = _SEAT_TO_IN_SERVICE_OIDS.get(seat_id)
    if not oids:
        return {"ok": False, "detail": f"no hub in_service map for {seat_id}"}
    hub_row = next((r for r in list_inventory() if r.get("role") == "hub"), None)
    if not hub_row or not hub_row.get("in_service"):
        return {"ok": False, "detail": "hub not in service"}
    host = hub_row.get("host") or ""
    api_key = hub_row.get("api_key") or get_setting("dsc_hub_api_key", "")
    if not host:
        return {"ok": False, "detail": "hub host missing"}

    try:
        import aioesphomeapi  # noqa: F401
    except ImportError:
        return {"ok": False, "detail": "aioesphomeapi not installed"}

    client = make_api_client(host, api_key or "")
    async with host_lock(host):
        try:
            await client.connect(login=True)
            entities, _services = await client.list_entities_services()
            key: int | None = None
            matched_oid = ""
            for ent in entities:
                oid = str(getattr(ent, "object_id", ""))
                if oid in oids and hasattr(ent, "key"):
                    key = int(ent.key)
                    matched_oid = oid
                    break
            if key is None:
                return {"ok": False, "detail": f"hub in_service switch not found for {seat_id}"}
            client.switch_command(key, in_service)
            entity_id = HUB_SWITCH_OID_TO_ENTITY.get(matched_oid, f"switch.dsc_hub_{seat_id}_in_service")
            return {
                "ok": True,
                "seat_id": seat_id,
                "entity_id": entity_id,
                "state": "on" if in_service else "off",
            }
        except Exception as exc:  # noqa: BLE001
            _logger.warning("hub in_service sync failed for %s: %s", seat_id, exc)
            return {"ok": False, "detail": str(exc)}
        finally:
            try:
                await client.disconnect()
            except Exception:  # noqa: BLE001
                pass


def sync_hub_in_service_sync(seat_id: str, in_service: bool) -> dict[str, Any]:
    return asyncio.run(sync_hub_in_service(seat_id, in_service))


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
        import aioesphomeapi  # noqa: F401
    except ImportError:
        return [{"ok": False, "detail": "aioesphomeapi not installed"}]

    results: list[dict[str, Any]] = []
    client = make_api_client(host, api_key or "")
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
