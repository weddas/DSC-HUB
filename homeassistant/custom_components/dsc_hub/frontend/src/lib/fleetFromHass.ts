import type { HassEntity, HomeAssistant } from "../vite-env";
import type { FleetSnapshot, InventoryRow, SeatSnapshot } from "./fleetModel";
import { EMPTY_FLEET, EMPTY_SEAT } from "./fleetModel";

const IN_SERVICE_ENTITIES: Record<string, string> = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_pot1_in_service",
  pot2: "input_boolean.dsc_pot2_in_service",
  pot3: "input_boolean.dsc_pot3_in_service",
  pot4: "input_boolean.dsc_pot4_in_service",
  tank: "input_boolean.dsc_tank_in_service",
};

const SONOFF_FW: Record<string, string> = {
  heater: "sensor.dsc_heater_firmware_version",
  heatmat: "sensor.dsc_heatmat_firmware_version",
  humidifier: "sensor.dsc_humidifier_firmware_version",
  dehumidifier: "sensor.dsc_dehumidifier_firmware_version",
};

function st(hass: HomeAssistant, id: string): string {
  return hass.states[id]?.state ?? "unavailable";
}

function avail(hass: HomeAssistant, id: string): boolean {
  const s = hass.states[id]?.state;
  return s != null && s !== "unavailable" && s !== "unknown";
}

function numVal(hass: HomeAssistant, id: string): number | null {
  const v = Number(st(hass, id));
  return Number.isFinite(v) ? v : null;
}

function seatFromEntities(
  seat_id: string,
  linkEntity: string | undefined,
  fwEntity: string | undefined,
  valueEntities: Record<string, string>,
  hass: HomeAssistant,
): SeatSnapshot {
  const online = linkEntity ? avail(hass, linkEntity) && st(hass, linkEntity) === "on" : false;
  const live = linkEntity ? avail(hass, linkEntity) : fwEntity ? avail(hass, fwEntity) : false;
  const values: Record<string, unknown> = {};
  for (const [key, eid] of Object.entries(valueEntities)) {
    if (avail(hass, eid)) {
      const raw = st(hass, eid);
      const n = Number(raw);
      values[key] = Number.isFinite(n) && raw !== "" ? n : raw;
    }
  }
  return {
    seat_id,
    online: live && (linkEntity ? online : true),
    firmware: fwEntity && avail(hass, fwEntity) ? st(hass, fwEntity) : null,
    values,
    last_seen: live ? Date.now() / 1000 : null,
  };
}

/** Build native FleetSnapshot from HA entity bus (panel mode). */
export function fleetFromHass(
  hass: HomeAssistant | null,
  inventory?: InventoryRow[],
): FleetSnapshot {
  if (!hass) return { ...EMPTY_FLEET, inventory };

  const hubLink = avail(hass, "binary_sensor.dsc_hub_link");
  const hubOnline = hubLink && st(hass, "binary_sensor.dsc_hub_link") === "on";
  const hub: SeatSnapshot = {
    seat_id: "hub",
    online: hubOnline,
    firmware: avail(hass, "sensor.dsc_hub_firmware_version")
      ? st(hass, "sensor.dsc_hub_firmware_version")
      : null,
    values: {
      temp_c: numVal(hass, "sensor.dsc_hub_tent_temperature") ?? numVal(hass, "sensor.dsc_hub_temperature"),
      rh_pct: numVal(hass, "sensor.dsc_hub_tent_humidity") ?? numVal(hass, "sensor.dsc_hub_humidity"),
      vpd_kpa: numVal(hass, "sensor.dsc_hub_vpd_kpa") ?? numVal(hass, "sensor.dsc_hub_vpd"),
      heartbeat: avail(hass, "sensor.dsc_hub_heartbeat") ? st(hass, "sensor.dsc_hub_heartbeat") : null,
      uptime: avail(hass, "sensor.dsc_hub_uptime") ? st(hass, "sensor.dsc_hub_uptime") : null,
    },
    last_seen: hubOnline ? Date.now() / 1000 : null,
  };

  const panelOnline =
    avail(hass, "binary_sensor.dsc_hub_panel_link") &&
    st(hass, "binary_sensor.dsc_hub_panel_link") === "on";
  const panel: SeatSnapshot = {
    seat_id: "panel",
    online: panelOnline,
    firmware: avail(hass, "sensor.dsc_control_firmware_version")
      ? st(hass, "sensor.dsc_control_firmware_version")
      : null,
    values: {},
    last_seen: panelOnline ? Date.now() / 1000 : null,
  };

  const pots: Record<string, SeatSnapshot> = {};
  for (const n of [1, 2, 3, 4]) {
    const id = `pot${n}`;
    const fw = `sensor.dsc_pot${n}_firmware_version`;
    const live = avail(hass, fw);
    pots[id] = {
      seat_id: id,
      online: live,
      firmware: live ? st(hass, fw) : null,
      values: {
        moisture_pct: numVal(hass, `sensor.dsc_pot${n}_soil_moisture`),
        soil_temp_c: numVal(hass, `sensor.dsc_pot${n}_soil_temperature`),
        ec_us: numVal(hass, `sensor.dsc_pot${n}_soil_ec`),
        ph: numVal(hass, `sensor.dsc_pot${n}_soil_ph`),
      },
      last_seen: live ? Date.now() / 1000 : null,
    };
  }

  const sonoffs: Record<string, SeatSnapshot> = {};
  const relayMap: Record<string, string> = {
    heater: "switch.dsc_heater_main_relay",
    heatmat: "switch.dsc_heatmat_main_relay",
    humidifier: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_de_humidifier_main_relay",
  };
  for (const [id, relay] of Object.entries(relayMap)) {
    const fw = SONOFF_FW[id];
    const live = avail(hass, relay) || avail(hass, fw);
    sonoffs[id] = {
      seat_id: id,
      online: live,
      firmware: fw && avail(hass, fw) ? st(hass, fw) : null,
      values: {
        relay_on: avail(hass, relay) ? st(hass, relay) === "on" : null,
      },
      last_seen: live ? Date.now() / 1000 : null,
    };
  }

  const inv: InventoryRow[] =
    inventory ??
    Object.entries(IN_SERVICE_ENTITIES).map(([seat_id, eid]) => ({
      seat_id,
      in_service: avail(hass, eid) ? st(hass, eid) === "on" : seat_id.startsWith("pot") && seat_id !== "pot3",
    }));

  const canopy: Record<string, unknown> = {};
  if (avail(hass, "sensor.dsc_canopy_temperature")) {
    canopy.temp_c = numVal(hass, "sensor.dsc_canopy_temperature");
  }
  if (avail(hass, "sensor.dsc_canopy_humidity")) {
    canopy.rh_pct = numVal(hass, "sensor.dsc_canopy_humidity");
  }

  return {
    version: st(hass, "sensor.dsc_fleet_version_status") || EMPTY_FLEET.version,
    surface: st(hass, "sensor.dsc_ha_surface_version") || EMPTY_FLEET.surface,
    expected_firmware: EMPTY_FLEET.expected_firmware,
    hub,
    panel,
    pots,
    sonoffs,
    canopy,
    system: {
      appliance_link:
        avail(hass, "binary_sensor.dsc_pi_appliance_link") &&
        st(hass, "binary_sensor.dsc_pi_appliance_link") === "on",
      reduced_kit:
        avail(hass, "binary_sensor.dsc_reduced_kit") &&
        st(hass, "binary_sensor.dsc_reduced_kit") === "on",
    },
    updated_at: Date.now() / 1000,
    inventory: inv,
  };
}

/** Minimal hass shim for components not yet migrated (history, helpers). */
export function fleetToHassCompat(fleet: FleetSnapshot): Record<string, HassEntity> {
  const states: Record<string, HassEntity> = {};
  const set = (id: string, value: string, available = true) => {
    states[id] = {
      entity_id: id,
      state: available ? value : "unavailable",
      attributes: {},
      last_changed: new Date().toISOString(),
    };
  };

  const v = fleet.hub.values;
  set("binary_sensor.dsc_hub_link", fleet.hub.online ? "on" : "off", true);
  set("binary_sensor.dsc_hub_panel_link", fleet.panel.online ? "on" : "off", true);
  if (v.temp_c != null) {
    set("sensor.dsc_hub_tent_temperature", String(v.temp_c), fleet.hub.online);
    set("sensor.dsc_hub_temperature", String(v.temp_c), fleet.hub.online);
  }
  if (v.rh_pct != null) {
    set("sensor.dsc_hub_tent_humidity", String(v.rh_pct), fleet.hub.online);
    set("sensor.dsc_hub_humidity", String(v.rh_pct), fleet.hub.online);
  }
  if (v.vpd_kpa != null) {
    set("sensor.dsc_hub_vpd_kpa", String(v.vpd_kpa), fleet.hub.online);
    set("sensor.dsc_hub_vpd", String(v.vpd_kpa), fleet.hub.online);
  }
  if (v.heartbeat != null) {
    set("sensor.dsc_hub_heartbeat", String(v.heartbeat), fleet.hub.online);
  }
  if (v.uptime != null) {
    set("sensor.dsc_hub_uptime", String(v.uptime), fleet.hub.online);
  }
  if (fleet.hub.firmware) {
    set("sensor.dsc_hub_firmware_version", fleet.hub.firmware, fleet.hub.online);
  }
  set("sensor.dsc_ha_surface_version", fleet.surface);
  set("binary_sensor.dsc_pi_appliance_link", fleet.system.appliance_link ? "on" : "off");
  set("binary_sensor.dsc_reduced_kit", fleet.system.reduced_kit ? "on" : "off");

  for (const [seatId, row] of Object.entries(IN_SERVICE_ENTITIES)) {
    const inSvc = inventoryInServiceFromFleet(fleet, seatId);
    set(row, inSvc ? "on" : "off");
  }

  for (const [potId, seat] of Object.entries(fleet.pots)) {
    const n = potId.replace("pot", "");
    if (seat.values.moisture_pct != null) {
      set(`sensor.dsc_pot${n}_soil_moisture`, String(seat.values.moisture_pct), seat.online);
    }
    if (seat.firmware) {
      set(`sensor.dsc_pot${n}_firmware_version`, seat.firmware, seat.online);
    }
  }

  for (const [id, seat] of Object.entries(fleet.sonoffs)) {
    const relayMap: Record<string, string> = {
      heater: "switch.dsc_heater_main_relay",
      heatmat: "switch.dsc_heatmat_main_relay",
      humidifier: "switch.dsc_humidifier_main_relay",
      dehumidifier: "switch.dsc_de_humidifier_main_relay",
    };
    const relay = relayMap[id];
    if (relay && seat.values.relay_on != null) {
      set(relay, seat.values.relay_on ? "on" : "off", seat.online);
    }
    const fw = SONOFF_FW[id];
    if (fw && seat.firmware) set(fw, seat.firmware, seat.online);
  }

  return states;
}

function inventoryInServiceFromFleet(fleet: FleetSnapshot, seatId: string): boolean {
  const row = fleet.inventory?.find((r) => r.seat_id === seatId);
  if (row && row.in_service != null) return !!row.in_service;
  if (seatId === "ac" || seatId === "mister" || seatId === "tank") return false;
  if (seatId === "pot3") return false;
  return true;
}
