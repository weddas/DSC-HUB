"""Settings manifest — the brain's own description of every operator-facing setting it
owns (tier N key-value + global modifiers), so the SPA never hardcodes a default,
range, unit or owner again. See docs/design/plan-settings-2026-09-07.md § Part 2.

Tiers: ``brain`` (settings table / JSON blobs), ``firmware`` (module constants shown
read-only). Hub entities (tier ``hub``) are described by the native API attributes the
fleet snapshot already carries and are not repeated here.
"""

from __future__ import annotations

from typing import Any

from .global_modifiers import DEFAULT_MODIFIERS
from .settings import DEFAULT_SETTINGS, get_all_settings


def _row(
    key: str,
    *,
    tier: str,
    kind: str,
    default: Any,
    section: str,
    label: str,
    description: str,
    unit: str | None = None,
    minimum: float | None = None,
    maximum: float | None = None,
    step: float | None = None,
    secret: bool = False,
    consumers: list[str] | None = None,
    source: str | None = None,
) -> dict[str, Any]:
    out: dict[str, Any] = {
        "key": key,
        "tier": tier,
        "kind": kind,
        "default": default,
        "section": section,
        "label": label,
        "description": description,
        "consumers": consumers or [],
    }
    if unit is not None:
        out["unit"] = unit
    if minimum is not None:
        out["min"] = minimum
    if maximum is not None:
        out["max"] = maximum
    if step is not None:
        out["step"] = step
    if secret:
        out["secret"] = True
    if source:
        out["source"] = source
    return out


def _kv(key: str, **kw: Any) -> dict[str, Any]:
    return _row(key, tier="brain", default=DEFAULT_SETTINGS[key], **kw)


def build_manifest() -> list[dict[str, Any]]:
    mods = DEFAULT_MODIFIERS
    rows: list[dict[str, Any]] = [
        # --- network ------------------------------------------------------------
        _kv("ap_ssid", kind="text", section="network", label="AP SSID",
            description="Name of the hub's own Wi-Fi network. Apply restarts hub Wi-Fi.",
            consumers=["kit"]),
        _kv("ap_psk", kind="password", section="network", label="AP passphrase",
            description="Passphrase for the hub's Wi-Fi network.", secret=True, consumers=["kit"]),
        _kv("ap_channel", kind="select", section="network", label="AP channel",
            description="1, 6 or 11 — the non-overlapping 2.4 GHz channels.", consumers=["kit"]),
        # --- integrations -------------------------------------------------------
        _kv("ollama_base_url", kind="text", section="integrations", label="Ollama URL",
            description="Base URL of an Ollama server for SoftCal AI and research helpers.",
            consumers=["calibrate", "cannalib"]),
        _kv("ollama_model", kind="text", section="integrations", label="Ollama model",
            description="Model name Ollama should run.", consumers=["calibrate", "cannalib"]),
        _kv("cannalib_api_url", kind="text", section="integrations", label="CannaLib API URL",
            description="Strain catalog service. Empty falls back to the on-Pi catalog.",
            consumers=["cannalib", "plants"]),
        _kv("cannalib_api_key", kind="password", section="integrations", label="CannaLib API key",
            description="Optional key for the catalog service.", secret=True, consumers=["cannalib"]),
        _kv("cannalib_use_local_fallback", kind="bool", section="integrations",
            label="Local catalog fallback",
            description="Use the on-Pi sqlite catalog when the remote API is down.",
            consumers=["cannalib", "plants"]),
        # --- sensors ------------------------------------------------------------
        _kv("leaf_offset_c", kind="number", section="sensors", label="Leaf-to-air offset",
            description="Subtracted from air temperature to estimate leaf temperature for leaf VPD "
                        "(4×8 and 2×4) until an IR leaf sensor exists.",
            unit="°C", minimum=-5, maximum=5, step=0.1, consumers=["climate", "overview"]),
        # --- system -------------------------------------------------------------
        _kv("fleet_history_retention_days", kind="number", section="system",
            label="Fleet history retention",
            description="Rows older than this are pruned from fleet_history. 0 keeps everything.",
            unit="days", minimum=0, maximum=3650, step=1, consumers=["charts", "logs"]),
        _kv("esphome_dashboard_url", kind="text", section="devices", label="ESPHome dashboard URL",
            description="Browser link shown on the Firmware card.", consumers=["devices"]),
        _kv("esphome_fleet_ota_prompt", kind="bool", section="devices", label="Offer fleet OTA after toolchain update",
            description="After the ESPHome toolchain updates, offer to reflash the fleet.", consumers=["devices"]),
        # --- global modifiers (JSON blob, exposed per field) --------------------
        _row("global_modifiers.fan_demand_scale", tier="brain", kind="number", section="climate",
             default=mods["fan_demand_scale"], label="Fan demand scale",
             description="Multiplies every fan demand the brain sends. 1.0 is nameplate.",
             minimum=0.5, maximum=1.5, step=0.05, consumers=["climate", "overview"]),
        _row("global_modifiers.light_brightness_scale", tier="brain", kind="number", section="light",
             default=mods["light_brightness_scale"], label="Light brightness scale",
             description="Multiplies lamp brightness targets. 1.0 is the schedule's own value.",
             minimum=0.5, maximum=1.5, step=0.05, consumers=["light"]),
        _row("global_modifiers.moisture_dry_pct", tier="brain", kind="number", section="root",
             default=mods["moisture_dry_pct"], label="Probe dry reference line",
             description="The red reference line on Root probe-moisture charts.",
             unit="%", minimum=5, maximum=80, step=1, consumers=["root"]),
        _row("global_modifiers.temp_offset_c", tier="brain", kind="per-zone-number", section="sensors",
             default=mods["temp_offset_c"], label="Temperature offset per zone",
             description="Added to the zone's air temperature before control and ingest.",
             unit="°C", minimum=-5, maximum=5, step=0.1, consumers=["climate", "overview"]),
        _row("global_modifiers.rh_offset_pct", tier="brain", kind="per-zone-number", section="sensors",
             default=mods["rh_offset_pct"], label="Humidity offset per zone",
             description="Added to the zone's RH before control and ingest.",
             unit="%", minimum=-15, maximum=15, step=0.5, consumers=["climate", "overview"]),
        _row("global_modifiers.sensor_clamp", tier="brain", kind="clamp", section="sensors",
             default=mods["sensor_clamp"], label="Sensor clamps",
             description="Readings outside these bounds are clamped and flagged. Read-only until the "
                         "patch route accepts clamps (tracker: set_global_modifiers ignores sensor_clamp).",
             consumers=["climate"]),
        # --- firmware / code constants shown for transparency -------------------
        _row("appliance_driver.STALE_SEC", tier="firmware", kind="number", section="sensors", default=45.0,
             label="Control-side stale horizon", unit="s",
             description="A seat silent for longer is treated as stale by the appliance driver.",
             source="brain/dsc_brain/appliance_driver.py"),
        _row("hub_failover.DEFAULT_TTL_SEC", tier="firmware", kind="number", section="system", default=900.0,
             label="Hub override TTL", unit="s",
             description="How long a hub-side manual takeover holds before the brain re-asserts Want→act.",
             source="brain/dsc_brain/hub_failover.py"),
        _row("automation_rules.MAX_CONDITIONS", tier="firmware", kind="number", section="automation", default=8,
             label="Max conditions per rule",
             description="Upper bound on conditions in one automation rule.",
             source="brain/dsc_brain/automation_rules.py"),
    ]
    return rows


def settings_manifest() -> dict[str, Any]:
    """Manifest rows plus the live values for tier-N keys (secrets masked)."""
    live = get_all_settings()
    values: dict[str, Any] = {}
    for row in build_manifest():
        key = row["key"]
        if row["tier"] != "brain" or "." in key:
            continue
        if row.get("secret"):
            values[key] = ""
            values[f"{key}_set"] = bool(live.get(key))
        else:
            values[key] = live.get(key, row["default"])
    return {"rows": build_manifest(), "values": values}
