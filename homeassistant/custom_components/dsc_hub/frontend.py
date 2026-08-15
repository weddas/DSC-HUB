"""Frontend panel registration for DSC-HUB."""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any, cast

from homeassistant.core import HomeAssistant

from .const import (
    ASSETS_URL,
    DOMAIN,
    PANEL_ELEMENT,
    PANEL_JS_NAME,
    PANEL_JS_URL,
    PANEL_REGISTERED_KEY,
    PANEL_URL_PATH,
)

_LOGGER = logging.getLogger(__name__)


def get_cache_buster(filename: str = PANEL_JS_NAME) -> str:
    """Stable cache buster from panel bundle mtime."""
    try:
        path = Path(__file__).parent / "www" / filename
        return str(int(os.path.getmtime(path)))
    except OSError:
        return "1"


async def _async_register_path(hass: HomeAssistant, url_path: str, path: str) -> None:
    """Register a static HTTP path (HA version tolerant)."""
    try:
        from homeassistant.components.http import StaticPathConfig

        if hasattr(hass.http, "async_register_static_paths"):
            try:
                await hass.http.async_register_static_paths(
                    [StaticPathConfig(url_path, path, cache_headers=True)]
                )
                return
            except Exception as exc:  # pylint: disable=broad-exception-caught
                if "already" in str(exc).lower():
                    return
                raise
    except ImportError:
        pass

    http_obj = cast(Any, hass.http)
    register_static_path = getattr(http_obj, "register_static_path", None)
    if callable(register_static_path):
        try:
            register_static_path(url_path, path, cache_headers=True)
        except Exception as exc:  # pylint: disable=broad-exception-caught
            if "already" not in str(exc).lower():
                _LOGGER.debug("Static path register failed %s: %s", url_path, exc)


async def async_register_panel(hass: HomeAssistant) -> bool:
    """Serve panel assets and register the sidebar panel."""
    if hass.data.get(PANEL_REGISTERED_KEY):
        return True

    www = Path(__file__).parent / "www"
    panel_js = www / PANEL_JS_NAME
    assets = www / "assets"

    if not await hass.async_add_executor_job(panel_js.exists):
        _LOGGER.warning("DSC-HUB panel JS missing at %s", panel_js)
        return False

    try:
        # Mount the whole www tree at /dsc_hub so panel JS + assets share one path.
        # (Separate /dsc_hub/assets mounts often 404 when only the panel JS was synced.)
        await _async_register_path(hass, f"/{DOMAIN}", str(www))
        # Keep explicit file registration for older HA / cache-busted module_url loads.
        await _async_register_path(hass, PANEL_JS_URL, str(panel_js))
        if await hass.async_add_executor_job(assets.is_dir):
            await _async_register_path(hass, ASSETS_URL, str(assets))
    except Exception as exc:  # pylint: disable=broad-exception-caught
        _LOGGER.warning("DSC-HUB static path registration failed: %s", exc)
        return False

    try:
        from homeassistant.components import frontend

        version = await hass.async_add_executor_job(get_cache_buster, PANEL_JS_NAME)
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="DSC-HUB",
            sidebar_icon="mdi:sprout",
            frontend_url_path=PANEL_URL_PATH,
            config={
                "_panel_custom": {
                    "name": PANEL_ELEMENT,
                    "module_url": f"{PANEL_JS_URL}?v={version}",
                    "embed_iframe": False,
                    "trust_external": False,
                }
            },
            require_admin=False,
        )
        hass.data[PANEL_REGISTERED_KEY] = True
        hass.data.setdefault(DOMAIN, {})["assets_url"] = ASSETS_URL
        _LOGGER.info("DSC-HUB panel registered at /%s", PANEL_URL_PATH)
        return True
    except Exception as exc:  # pylint: disable=broad-exception-caught
        _LOGGER.warning("Failed to register DSC-HUB panel: %s", exc)
        return False


async def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove sidebar panel if registered."""
    if not hass.data.get(PANEL_REGISTERED_KEY):
        return
    try:
        from homeassistant.components import frontend

        frontend.async_remove_panel(hass, PANEL_URL_PATH)
    except Exception as exc:  # pylint: disable=broad-exception-caught
        _LOGGER.debug("Failed to remove DSC-HUB panel: %s", exc)
    hass.data.pop(PANEL_REGISTERED_KEY, None)
