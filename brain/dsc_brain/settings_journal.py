"""Settings-change journal (plan-settings S3): every brain-side setting write leaves a
system entry on the core journal, tagged ``settings`` (plus a domain tag), so Logs can
answer "what changed, when, from what" for hub, brain and journal settings alike.
Secrets are masked; a write that changes nothing writes nothing.
"""

from __future__ import annotations

import logging
from typing import Any

_logger = logging.getLogger(__name__)

SECRET_KEYS = frozenset({"ap_psk", "cannalib_api_key", "ollama_api_key"})

# Human labels for tier-N keys (settings_manifest carries the same wording).
KEY_LABELS: dict[str, str] = {
    "ap_ssid": "AP SSID",
    "ap_psk": "AP passphrase",
    "ap_channel": "AP channel",
    "ollama_base_url": "Ollama URL",
    "ollama_model": "Ollama model",
    "cannalib_api_url": "CannaLib API URL",
    "cannalib_api_key": "CannaLib API key",
    "cannalib_use_local_fallback": "Local catalog fallback",
    "leaf_offset_c": "Leaf-to-air offset",
    "fleet_history_retention_days": "Fleet history retention",
    "esphome_dashboard_url": "ESPHome dashboard URL",
    "esphome_fleet_ota_prompt": "Fleet OTA prompt",
    "root_steering_override": "Root steering manual override",
}


def _fmt(value: Any, key: str | None = None) -> str:
    if key in SECRET_KEYS:
        return "(set)" if value not in (None, "") else "(cleared)"
    if value is None or value == "":
        return "unset"
    if isinstance(value, bool):
        return "on" if value else "off"
    if isinstance(value, float):
        return f"{value:g}"
    if isinstance(value, (dict, list)):
        import json

        text = json.dumps(value, separators=(",", ":"), sort_keys=True)
        return text if len(text) <= 80 else text[:77] + "…"
    return str(value)


def journal_setting_change(
    label: str,
    old: Any,
    new: Any,
    *,
    key: str | None = None,
    source: str = "operator",
    domain: str = "brain",
    tags: list[str] | None = None,
) -> dict[str, Any] | None:
    """Write `label: old → new (source)` to the core journal. Returns the entry or None."""
    if _fmt(old, key) == _fmt(new, key):
        return None
    note = f"Setting {label}: {_fmt(old, key)} → {_fmt(new, key)} ({source})"
    try:
        from .dsc_core_journal import add_core_entry

        return add_core_entry(None, note, source="system", tags=["settings", domain, *(tags or [])])
    except Exception:  # noqa: BLE001 — journaling never blocks a write
        _logger.debug("settings journal write failed", exc_info=True)
        return None


def journal_kv_patch(before: dict[str, Any], patch: dict[str, Any], *, source: str = "operator") -> int:
    """Journal each tier-N key in `patch` whose value actually changed. Returns count."""
    n = 0
    for key, new in patch.items():
        old = before.get(key)
        if journal_setting_change(KEY_LABELS.get(key, key), old, new, key=key, source=source, domain="brain"):
            n += 1
    return n
