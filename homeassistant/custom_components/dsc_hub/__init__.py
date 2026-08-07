"""DSC-HUB custom panel — product UI hosted inside Home Assistant."""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, SURFACE_VERSION
from .frontend import async_register_panel

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up DSC-HUB panel from configuration.yaml (`dsc_hub:`)."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["surface_version"] = SURFACE_VERSION
    ok = await async_register_panel(hass)
    if not ok:
        _LOGGER.error(
            "DSC-HUB panel did not register — ensure www/%s is built and synced",
            "dsc-hub-panel.js",
        )
    return True
