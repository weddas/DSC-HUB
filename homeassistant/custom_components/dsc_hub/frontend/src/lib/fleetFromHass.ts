import type { HassEntity, HomeAssistant } from "../vite-env";
import type { FleetSnapshot, InventoryRow, SeatSnapshot } from "./fleetModel";
import { EMPTY_FLEET, inventoryInService } from "./fleetModel";
import { ENTITY_FLEET_MAP } from "./entityFleetMap";

const IN_SERVICE_ENTITIES: Record<string, string> = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_probe1_in_service",
  pot2: "input_boolean.dsc_probe2_in_service",
  pot3: "input_boolean.dsc_probe3_in_service",
  pot4: "input_boolean.dsc_probe4_in_service",
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
    const fw = `sensor.dsc_probe${n}_firmware_version`;
    const live = avail(hass, fw);
    pots[id] = {
      seat_id: id,
      online: live,
      firmware: live ? st(hass, fw) : null,
      values: {
        moisture_pct:
          numVal(hass, `sensor.dsc_probe${n}_got_moisture`) ??
          numVal(hass, `sensor.dsc_probe${n}_soil_moisture`),
        soil_temp_c: numVal(hass, `sensor.dsc_probe${n}_soil_temperature`),
        ec_us:
          numVal(hass, `sensor.dsc_probe${n}_got_ec`) ??
          numVal(hass, `sensor.dsc_probe${n}_soil_conductivity`) ??
          numVal(hass, `sensor.dsc_probe${n}_soil_ec`),
        ph:
          numVal(hass, `sensor.dsc_probe${n}_got_ph`) ?? numVal(hass, `sensor.dsc_probe${n}_soil_ph`),
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
      in_service: avail(hass, eid) ? st(hass, eid) === "on" : false,
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
  if (fleet.panel.firmware) {
    set("sensor.dsc_control_firmware_version", fleet.panel.firmware, fleet.panel.online);
  }
  set("sensor.dsc_ha_surface_version", fleet.surface);
  set("sensor.dsc_fleet_version_status", fleet.version);
  set("sensor.dsc_active_alert_count", "0");
  set("binary_sensor.dsc_pi_appliance_link", fleet.system.appliance_link ? "on" : "off", true);
  set("binary_sensor.dsc_reduced_kit", fleet.system.reduced_kit ? "on" : "off", true);

  const hubLive = fleet.hub.online;
  if (v.room_temp_c != null) {
    set("sensor.dsc_hub_room_temperature", String(v.room_temp_c), hubLive);
  }
  if (v.room_rh_pct != null) {
    set("sensor.dsc_hub_room_humidity", String(v.room_rh_pct), hubLive);
  }
  if (v.room_temp_c != null && v.room_rh_pct != null) {
    const roomVpd = computeVpd(Number(v.room_temp_c), Number(v.room_rh_pct));
    if (Number.isFinite(roomVpd)) {
      set("sensor.dsc_hub_room_vpd_kpa", roomVpd.toFixed(2), hubLive);
      set("sensor.dsc_hub_room_vpd", roomVpd.toFixed(2), hubLive);
    }
  }
  if (v.clone_temp_c != null) {
    set("sensor.dsc_hub_clone_temperature", String(v.clone_temp_c), hubLive);
  }
  if (v.clone_rh_pct != null) {
    set("sensor.dsc_hub_clone_humidity", String(v.clone_rh_pct), hubLive);
  }
  if (v.clone_vpd_kpa != null) {
    set("sensor.dsc_hub_clone_vpd_kpa", String(v.clone_vpd_kpa), hubLive);
    set("sensor.dsc_hub_clone_vpd", String(v.clone_vpd_kpa), hubLive);
  }
  if (v.leaf_vpd_kpa != null) {
    set("sensor.dsc_leaf_vpd_kpa", String(v.leaf_vpd_kpa), hubLive);
  }
  if (v.clone_leaf_vpd_kpa != null) {
    set("sensor.dsc_clone_leaf_vpd_kpa", String(v.clone_leaf_vpd_kpa), hubLive);
  }

  const binaries = v.binaries as Record<string, boolean> | undefined;
  if (binaries) {
    for (const [eid, on] of Object.entries(binaries)) {
      set(eid, on ? "on" : "off", hubLive);
    }
  }

  for (const [seatId, row] of Object.entries(IN_SERVICE_ENTITIES)) {
    const inSvc = inventoryInServiceFromFleet(fleet, seatId);
    set(row, inSvc ? "on" : "off");
  }

  for (const [potId, seat] of Object.entries(fleet.pots)) {
    const n = potId.replace("pot", "");
    const live = seat.online;
    const moisture = seat.values.moisture_pct;
    if (moisture != null) {
      const s = String(moisture);
      set(`sensor.dsc_probe${n}_soil_moisture`, s, live);
      set(`sensor.dsc_probe${n}_got_moisture`, s, live);
    }
    const soilT = seat.values.soil_temp_c;
    if (soilT != null) {
      set(`sensor.dsc_probe${n}_soil_temperature`, String(soilT), live);
    }
    const ec = seat.values.ec_us;
    if (ec != null) {
      set(`sensor.dsc_probe${n}_soil_ec`, String(ec), live);
      set(`sensor.dsc_probe${n}_soil_conductivity`, String(ec), live);
      set(`sensor.dsc_probe${n}_got_ec`, String(ec), live);
    }
    const ph = seat.values.ph;
    if (ph != null) {
      set(`sensor.dsc_probe${n}_soil_ph`, String(ph), live);
      set(`sensor.dsc_probe${n}_got_ph`, String(ph), live);
    }
    if (seat.firmware) {
      set(`sensor.dsc_probe${n}_firmware_version`, seat.firmware, live);
    }
    const potBins = seat.values.binaries as Record<string, boolean> | undefined;
    if (potBins) {
      if (potBins.clock_valid != null) {
        set(`binary_sensor.dsc_probe${n}_clock_valid`, potBins.clock_valid ? "on" : "off", live);
      }
      if (potBins.modbus_probe_online != null) {
        set(
          `binary_sensor.dsc_probe${n}_modbus_probe_online`,
          potBins.modbus_probe_online ? "on" : "off",
          live,
        );
      }
      if (potBins.sensor_fault != null) {
        set(`binary_sensor.dsc_probe${n}_sensor_fault`, potBins.sensor_fault ? "on" : "off", live);
      }
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

  const controls = fleet.hub.values.controls as
    | Record<string, { state: string; options?: string[]; percentage?: number; brightness?: number }>
    | undefined;
  if (controls) {
    for (const [eid, ctrl] of Object.entries(controls)) {
      const attrs: Record<string, unknown> = {};
      if (ctrl.options?.length) attrs.options = ctrl.options;
      if (ctrl.percentage != null) attrs.percentage = ctrl.percentage;
      if (ctrl.brightness != null) attrs.brightness = ctrl.brightness;
      states[eid] = {
        entity_id: eid,
        state: fleet.hub.online ? ctrl.state : "unavailable",
        attributes: attrs,
        last_changed: new Date().toISOString(),
      };
    }
  }

  return states;
}

function computeVpd(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct) || rhPct <= 0) return NaN;
  const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const avp = svp * (rhPct / 100);
  return svp - avp;
}

function inventoryInServiceFromFleet(fleet: FleetSnapshot, seatId: string): boolean {
  return inventoryInService(fleet, seatId, false);
}

/** Fill hub/pot seat metrics from Pi `hass_states` when fleet JSON omits them. */
export function enrichFleetFromHassStates(
  fleet: FleetSnapshot,
  hassStates?: Record<string, HassEntity> | null,
): FleetSnapshot {
  if (!hassStates) return fleet;

  const hubValues = { ...fleet.hub.values };
  const pots = { ...fleet.pots };

  for (const [entityId, ref] of Object.entries(ENTITY_FLEET_MAP)) {
    const ent = hassStates[entityId];
    if (!ent || ent.state === "unavailable" || ent.state === "unknown") continue;
    const raw = ent.state;
    const n = Number(raw);
    if (!Number.isFinite(n) && ref.binary !== true) continue;
    const value = ref.binary ? raw === "on" || raw === "1" || raw === "true" : n;

    if (ref.seatId === "hub") {
      if (hubValues[ref.metric] == null) hubValues[ref.metric] = value;
      continue;
    }
    if (ref.seatId.startsWith("pot")) {
      const seat = pots[ref.seatId];
      if (!seat || seat.values[ref.metric] != null) continue;
      pots[ref.seatId] = {
        ...seat,
        values: { ...seat.values, [ref.metric]: value },
      };
    }
  }

  return {
    ...fleet,
    hub: { ...fleet.hub, values: hubValues },
    pots,
  };
}
