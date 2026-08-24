"""FleetState snapshot — product SoT for live UI (not HA entity_id)."""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any

from .appliance_driver import get_appliance_status
from .paths import EXPECTED_FIRMWARE, SURFACE_VERSION

# Kit Pulse / Fleet page entity contracts (mirrors frontend kitInventory.ts)
_SONOFF_RELAY: dict[str, str] = {
    "heater": "switch.dsc_heater_main_relay",
    "heatmat": "switch.dsc_heatmat_main_relay",
    "humidifier": "switch.dsc_humidifier_main_relay",
    "dehumidifier": "switch.dsc_de_humidifier_main_relay",
}
_SONOFF_FW: dict[str, str] = {
    "heater": "sensor.dsc_heater_firmware_version",
    "heatmat": "sensor.dsc_heatmat_firmware_version",
    "humidifier": "sensor.dsc_humidifier_firmware_version",
    "dehumidifier": "sensor.dsc_dehumidifier_firmware_version",
}
_IN_SERVICE_ENTITIES: dict[str, str] = {
    "ac": "input_boolean.dsc_ac_in_service",
    "mister": "input_boolean.dsc_clone_humidifier_in_service",
    "pot1": "input_boolean.dsc_pot1_in_service",
    "pot2": "input_boolean.dsc_pot2_in_service",
    "pot3": "input_boolean.dsc_pot3_in_service",
    "pot4": "input_boolean.dsc_pot4_in_service",
    "tank": "input_boolean.dsc_tank_in_service",
}

# HA entity_id → FleetState path (compatibility for BrainProvider)
ENTITY_MAP: dict[str, tuple[str, str]] = {
    "sensor.dsc_hub_temperature": ("hub", "temp_c"),
    "sensor.dsc_hub_humidity": ("hub", "rh_pct"),
    "sensor.dsc_hub_vpd": ("hub", "vpd_kpa"),
    "binary_sensor.dsc_hub_link": ("hub", "link"),
    "binary_sensor.dsc_hub_panel_link": ("panel", "link"),
    "sensor.dsc_hub_heartbeat": ("hub", "heartbeat"),
    "sensor.dsc_hub_uptime": ("hub", "uptime"),
    "binary_sensor.dsc_reduced_kit": ("system", "reduced_kit"),
    "binary_sensor.dsc_pi_appliance_link": ("system", "appliance_link"),
}


@dataclass
class SeatState:
    seat_id: str
    online: bool = False
    firmware: str | None = None
    values: dict[str, Any] = field(default_factory=dict)
    last_seen: float | None = None


@dataclass
class FleetState:
    version: str = EXPECTED_FIRMWARE
    surface: str = "7.0.0-dev"
    hub: SeatState = field(default_factory=lambda: SeatState("hub"))
    panel: SeatState = field(default_factory=lambda: SeatState("panel"))
    pots: dict[str, SeatState] = field(default_factory=dict)
    sonoffs: dict[str, SeatState] = field(default_factory=dict)
    canopy: dict[str, Any] = field(default_factory=dict)
    system: dict[str, Any] = field(default_factory=dict)
    updated_at: float = field(default_factory=time.time)

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": self.version,
            "surface": self.surface,
            "expected_firmware": EXPECTED_FIRMWARE,
            "hub": _seat_dict(self.hub),
            "panel": _seat_dict(self.panel),
            "pots": {k: _seat_dict(v) for k, v in self.pots.items()},
            "sonoffs": {k: _seat_dict(v) for k, v in self.sonoffs.items()},
            "canopy": self.canopy,
            "system": self.system,
            "updated_at": self.updated_at,
        }

    def to_hass_states(
        self,
        inventory: list[dict[str, Any]] | None = None,
    ) -> dict[str, dict[str, Any]]:
        """Synthetic HA-shaped states for Pi SPA (Fleet / Kit Pulse)."""
        states: dict[str, dict[str, Any]] = {}
        inv_by_id = {str(row.get("seat_id", "")): row for row in (inventory or [])}

        def set_entity(eid: str, value: Any, available: bool = True) -> None:
            st = "unavailable" if not available else _stringify(value)
            states[eid] = {
                "entity_id": eid,
                "state": st,
                "attributes": {},
            }

        surface = self.surface or SURFACE_VERSION
        set_entity("sensor.dsc_ha_surface_version", surface)
        set_entity("sensor.dsc_active_alert_count", 0)

        if self.hub.values.get("temp_c") is not None:
            set_entity("sensor.dsc_hub_temperature", self.hub.values["temp_c"])
            set_entity("sensor.dsc_hub_tent_temperature", self.hub.values["temp_c"])
        if self.hub.values.get("rh_pct") is not None:
            set_entity("sensor.dsc_hub_humidity", self.hub.values["rh_pct"])
            set_entity("sensor.dsc_hub_tent_humidity", self.hub.values["rh_pct"])
        if self.hub.values.get("vpd_kpa") is not None:
            set_entity(
                "sensor.dsc_hub_vpd",
                self.hub.values["vd_kpa"]
                if "vd_kpa" in self.hub.values
                else self.hub.values["vpd_kpa"],
            )
            set_entity(
                "sensor.dsc_hub_vpd_kpa",
                self.hub.values["vd_kpa"]
                if "vd_kpa" in self.hub.values
                else self.hub.values["vpd_kpa"],
            )
        # Always expose link helpers so Fleet shows dark/offline, not missing holes.
        set_entity("binary_sensor.dsc_hub_link", "on" if self.hub.online else "off")
        set_entity("binary_sensor.dsc_hub_panel_link", "on" if self.panel.online else "off")
        appliance = get_appliance_status()
        set_entity("binary_sensor.dsc_pi_appliance_link", "on" if appliance.get("hub_ok") else "off")
        set_entity("binary_sensor.dsc_reduced_kit", "off")
        set_entity(
            "sensor.dsc_hub_heartbeat",
            self.hub.values.get("heartbeat", "—"),
            self.hub.online,
        )
        set_entity(
            "sensor.dsc_hub_uptime",
            self.hub.values.get("uptime", "—"),
            self.hub.online,
        )
        if self.hub.values.get("clone_temp_c") is not None:
            set_entity("sensor.dsc_hub_clone_temperature", self.hub.values["clone_temp_c"])
        if self.hub.values.get("clone_rh_pct") is not None:
            set_entity("sensor.dsc_hub_clone_humidity", self.hub.values["clone_rh_pct"])
        if self.hub.values.get("clone_vpd_kpa") is not None:
            set_entity("sensor.dsc_hub_clone_vpd_kpa", self.hub.values["clone_vpd_kpa"])
        if self.hub.values.get("room_temp_c") is not None:
            set_entity("sensor.dsc_hub_room_temperature", self.hub.values["room_temp_c"])
        if self.hub.values.get("room_rh_pct") is not None:
            set_entity("sensor.dsc_hub_room_humidity", self.hub.values["room_rh_pct"])

        if self.hub.firmware:
            set_entity("sensor.dsc_hub_firmware_version", self.hub.firmware, self.hub.online)
        if self.panel.firmware:
            set_entity(
                "sensor.dsc_control_firmware_version",
                self.panel.firmware,
                self.panel.online,
            )

        for seat_id, entity_id in _IN_SERVICE_ENTITIES.items():
            row = inv_by_id.get(seat_id, {})
            if seat_id in ("ac", "mister", "tank") and not row:
                in_svc = False
            else:
                in_svc = bool(row.get("in_service", 1))
            set_entity(entity_id, "on" if in_svc else "off")

        for pot_id, seat in self.pots.items():
            n = pot_id.replace("pot", "")
            for metric, key in (
                ("soil_moisture", "moisture_pct"),
                ("soil_temperature", "soil_temp_c"),
                ("soil_ec", "ec_us"),
                ("soil_ph", "ph"),
            ):
                val = seat.values.get(key)
                if val is not None:
                    set_entity(f"sensor.dsc_pot{n}_{metric}", val, seat.online)
            if seat.firmware:
                set_entity(
                    f"sensor.dsc_pot{n}_firmware_version",
                    seat.firmware,
                    seat.online,
                )

        for seat_id, seat in self.sonoffs.items():
            relay = _SONOFF_RELAY.get(seat_id)
            fw_entity = _SONOFF_FW.get(seat_id)
            relay_on = appliance.get("relays", {}).get(seat_id)
            if relay:
                if relay_on is not None:
                    set_entity(relay, "on" if relay_on else "off", seat.online or appliance.get("hub_ok", False))
                else:
                    set_entity(relay, "off", seat.online)
            if fw_entity and seat.firmware:
                set_entity(fw_entity, seat.firmware, seat.online)

        if self.canopy.get("temp_c") is not None:
            set_entity("sensor.dsc_canopy_temperature", self.canopy["temp_c"])
        if self.canopy.get("rh_pct") is not None:
            set_entity("sensor.dsc_canopy_humidity", self.canopy["rh_pct"])

        from .computed_ops import build_computed_hass_states

        computed = build_computed_hass_states(self, inventory)
        for eid, ent in computed.items():
            states[eid] = ent

        return states


def _seat_dict(seat: SeatState) -> dict[str, Any]:
    return {
        "seat_id": seat.seat_id,
        "online": seat.online,
        "firmware": seat.firmware,
        "values": seat.values,
        "last_seen": seat.last_seen,
    }


def _stringify(value: Any) -> str:
    if isinstance(value, bool):
        return "on" if value else "off"
    if value is None:
        return "unavailable"
    return str(value)


# Module-level cache updated by ingest loop
_fleet = FleetState()


def get_fleet_state() -> FleetState:
    return _fleet


def update_fleet_state(state: FleetState) -> None:
    global _fleet
    state.updated_at = time.time()
    _fleet = state
