import type { FleetSnapshot } from "./fleetModel";

export type EntityFleetRef = { seatId: string; metric: string; binary?: boolean };

/** Maps HA entity_id → fleet seat metric (Pi history + held readings). */
export const ENTITY_FLEET_MAP: Record<string, EntityFleetRef> = {
  "sensor.dsc_hub_tent_temperature": { seatId: "hub", metric: "temp_c" },
  "sensor.dsc_hub_temperature": { seatId: "hub", metric: "temp_c" },
  "sensor.dsc_hub_tent_humidity": { seatId: "hub", metric: "rh_pct" },
  "sensor.dsc_hub_humidity": { seatId: "hub", metric: "rh_pct" },
  "sensor.dsc_hub_vpd_kpa": { seatId: "hub", metric: "vpd_kpa" },
  "sensor.dsc_hub_vpd": { seatId: "hub", metric: "vpd_kpa" },
  "sensor.dsc_hub_heartbeat": { seatId: "hub", metric: "heartbeat" },
  "sensor.dsc_hub_uptime": { seatId: "hub", metric: "uptime" },
  "sensor.dsc_hub_room_temperature": { seatId: "hub", metric: "room_temp_c" },
  "sensor.dsc_hub_room_humidity": { seatId: "hub", metric: "room_rh_pct" },
  "sensor.dsc_hub_room_vpd_kpa": { seatId: "hub", metric: "room_vpd_kpa" },
  "sensor.dsc_hub_room_vpd": { seatId: "hub", metric: "room_vpd_kpa" },
  "sensor.dsc_hub_clone_temperature": { seatId: "hub", metric: "clone_temp_c" },
  "sensor.dsc_hub_clone_humidity": { seatId: "hub", metric: "clone_rh_pct" },
  "sensor.dsc_hub_clone_vpd_kpa": { seatId: "hub", metric: "clone_vpd_kpa" },
  "sensor.dsc_hub_clone_vpd": { seatId: "hub", metric: "clone_vpd_kpa" },
  "sensor.dsc_coldest_root_zone_temp": { seatId: "hub", metric: "coldest_root_c" },
  "sensor.dsc_hub_humidifier_fire_countdown": { seatId: "hub", metric: "humidifier_fire_countdown" },
  "sensor.dsc_hub_dehumidifier_fire_countdown": { seatId: "hub", metric: "dehumidifier_fire_countdown" },
  "sensor.dsc_hub_heater_fire_countdown": { seatId: "hub", metric: "heater_fire_countdown" },
  "sensor.dsc_hub_ac_fire_countdown": { seatId: "hub", metric: "ac_fire_countdown" },
  "sensor.dsc_hub_grow_mat_fire_countdown": { seatId: "hub", metric: "grow_mat_fire_countdown" },
  "sensor.dsc_hub_clone_humidifier_fire_countdown": { seatId: "hub", metric: "clone_humidifier_fire_countdown" },
  "sensor.dsc_hub_firmware_version": { seatId: "hub", metric: "firmware_version" },
  "sensor.dsc_probe1_got_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_probe1_soil_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_probe2_soil_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_probe2_got_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_probe3_soil_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_probe3_got_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_probe4_soil_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_probe4_got_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_probe1_soil_temperature": { seatId: "pot1", metric: "soil_temp_c" },
  "sensor.dsc_probe2_soil_temperature": { seatId: "pot2", metric: "soil_temp_c" },
  "sensor.dsc_probe3_soil_temperature": { seatId: "pot3", metric: "soil_temp_c" },
  "sensor.dsc_probe4_soil_temperature": { seatId: "pot4", metric: "soil_temp_c" },
  "sensor.dsc_probe1_soil_ec": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_probe2_soil_ec": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_probe3_soil_ec": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_probe4_soil_ec": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_probe1_got_ec": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_probe2_got_ec": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_probe3_got_ec": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_probe4_got_ec": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_probe1_soil_conductivity": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_probe2_soil_conductivity": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_probe3_soil_conductivity": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_probe4_soil_conductivity": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_probe1_soil_ph": { seatId: "pot1", metric: "ph" },
  "sensor.dsc_probe2_soil_ph": { seatId: "pot2", metric: "ph" },
  "sensor.dsc_probe3_soil_ph": { seatId: "pot3", metric: "ph" },
  "sensor.dsc_probe4_soil_ph": { seatId: "pot4", metric: "ph" },
  "sensor.dsc_probe1_got_ph": { seatId: "pot1", metric: "ph" },
  "sensor.dsc_probe2_got_ph": { seatId: "pot2", metric: "ph" },
  "sensor.dsc_probe3_got_ph": { seatId: "pot3", metric: "ph" },
  "sensor.dsc_probe4_got_ph": { seatId: "pot4", metric: "ph" },
  "sensor.dsc_probe1_dryback_pct": { seatId: "pot1", metric: "dryback_pct" },
  "sensor.dsc_probe2_dryback_pct": { seatId: "pot2", metric: "dryback_pct" },
  "sensor.dsc_probe3_dryback_pct": { seatId: "pot3", metric: "dryback_pct" },
  "sensor.dsc_probe4_dryback_pct": { seatId: "pot4", metric: "dryback_pct" },
  "sensor.dsc_probe1_soil_moisture_rate": { seatId: "pot1", metric: "moisture_rate" },
  "sensor.dsc_probe2_soil_moisture_rate": { seatId: "pot2", metric: "moisture_rate" },
  "sensor.dsc_probe3_soil_moisture_rate": { seatId: "pot3", metric: "moisture_rate" },
  "sensor.dsc_probe4_soil_moisture_rate": { seatId: "pot4", metric: "moisture_rate" },
  // Match brain / ESPHome pot values keys (nitrogen|phosphorus|potassium), not short n|p|k.
  "sensor.dsc_probe1_soil_nitrogen": { seatId: "pot1", metric: "nitrogen" },
  "sensor.dsc_probe2_soil_nitrogen": { seatId: "pot2", metric: "nitrogen" },
  "sensor.dsc_probe3_soil_nitrogen": { seatId: "pot3", metric: "nitrogen" },
  "sensor.dsc_probe4_soil_nitrogen": { seatId: "pot4", metric: "nitrogen" },
  "sensor.dsc_probe1_soil_phosphorus": { seatId: "pot1", metric: "phosphorus" },
  "sensor.dsc_probe2_soil_phosphorus": { seatId: "pot2", metric: "phosphorus" },
  "sensor.dsc_probe3_soil_phosphorus": { seatId: "pot3", metric: "phosphorus" },
  "sensor.dsc_probe4_soil_phosphorus": { seatId: "pot4", metric: "phosphorus" },
  "sensor.dsc_probe1_soil_potassium": { seatId: "pot1", metric: "potassium" },
  "sensor.dsc_probe2_soil_potassium": { seatId: "pot2", metric: "potassium" },
  "sensor.dsc_probe3_soil_potassium": { seatId: "pot3", metric: "potassium" },
  "sensor.dsc_probe4_soil_potassium": { seatId: "pot4", metric: "potassium" },
  "binary_sensor.dsc_probe1_clock_valid": { seatId: "pot1", metric: "clock_valid", binary: true },
  "binary_sensor.dsc_probe2_clock_valid": { seatId: "pot2", metric: "clock_valid", binary: true },
  "binary_sensor.dsc_probe3_clock_valid": { seatId: "pot3", metric: "clock_valid", binary: true },
  "binary_sensor.dsc_probe4_clock_valid": { seatId: "pot4", metric: "clock_valid", binary: true },
  "binary_sensor.dsc_probe1_modbus_probe_online": { seatId: "pot1", metric: "modbus_probe_online", binary: true },
  "binary_sensor.dsc_probe2_modbus_probe_online": { seatId: "pot2", metric: "modbus_probe_online", binary: true },
  "binary_sensor.dsc_probe3_modbus_probe_online": { seatId: "pot3", metric: "modbus_probe_online", binary: true },
  "binary_sensor.dsc_probe4_modbus_probe_online": { seatId: "pot4", metric: "modbus_probe_online", binary: true },
  "binary_sensor.dsc_probe1_sensor_fault": { seatId: "pot1", metric: "sensor_fault", binary: true },
  "binary_sensor.dsc_probe2_sensor_fault": { seatId: "pot2", metric: "sensor_fault", binary: true },
  "binary_sensor.dsc_probe3_sensor_fault": { seatId: "pot3", metric: "sensor_fault", binary: true },
  "binary_sensor.dsc_probe4_sensor_fault": { seatId: "pot4", metric: "sensor_fault", binary: true },
  "switch.dsc_heater_main_relay": { seatId: "heater", metric: "relay_on", binary: true },
  "switch.dsc_heatmat_main_relay": { seatId: "heatmat", metric: "relay_on", binary: true },
  "switch.dsc_humidifier_main_relay": { seatId: "humidifier", metric: "relay_on", binary: true },
  "switch.dsc_de_humidifier_main_relay": { seatId: "dehumidifier", metric: "relay_on", binary: true },
};

function seatValues(fleet: FleetSnapshot, seatId: string): Record<string, unknown> | undefined {
  if (seatId === "hub") return fleet.hub.values;
  if (seatId === "panel") return fleet.panel.values;
  if (seatId.startsWith("pot")) return fleet.pots[seatId]?.values;
  return fleet.sonoffs[seatId]?.values;
}

export function fleetLiveNumber(entityId: string, fleet: FleetSnapshot): number | null {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return null;
  const values = seatValues(fleet, ref.seatId);
  if (!values) return null;
  let raw: unknown = values[ref.metric];
  if (ref.binary && ref.seatId.startsWith("pot") && raw == null) {
    const bins = values.binaries as Record<string, boolean> | undefined;
    raw = bins?.[ref.metric];
  }
  if (raw == null) return null;
  if (ref.binary) return raw === true || raw === "on" || raw === 1 || raw === "1" ? 1 : 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** HA-shaped state string for fleet-mapped entities (binaries → on/off, not 1/0). */
export function fleetLiveState(entityId: string, fleet: FleetSnapshot): string | null {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return null;
  const live = fleetLiveNumber(entityId, fleet);
  if (live == null || !Number.isFinite(live)) return null;
  if (ref.binary) return live > 0 ? "on" : "off";
  return String(live);
}

/** True when the mapped metric is present (finite / binary), not merely seat online. */
export function fleetMetricPresent(entityId: string, fleet: FleetSnapshot): boolean {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return false;
  if (ref.binary) {
    const values = seatValues(fleet, ref.seatId);
    if (!values) return false;
    let raw: unknown = values[ref.metric];
    if (raw == null && ref.seatId.startsWith("pot")) {
      const bins = values.binaries as Record<string, boolean> | undefined;
      raw = bins?.[ref.metric];
    }
    return raw != null;
  }
  return fleetLiveNumber(entityId, fleet) != null;
}

export function fleetEntityAvailable(entityId: string, fleet: FleetSnapshot): boolean {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return false;
  if (ref.seatId === "hub") return fleet.hub.online;
  if (ref.seatId === "panel") return fleet.panel.online;
  if (ref.seatId.startsWith("pot")) {
    const online = !!fleet.pots[ref.seatId]?.online;
    // Derived soil metrics: available only when produced (avoids lying empty dials).
    if (
      ref.metric === "dryback_pct" ||
      ref.metric === "moisture_rate" ||
      ref.metric === "nitrogen" ||
      ref.metric === "phosphorus" ||
      ref.metric === "potassium"
    ) {
      return online && fleetMetricPresent(entityId, fleet);
    }
    return online;
  }
  return !!fleet.sonoffs[ref.seatId]?.online;
}

export function hubFleetDark(fleet: FleetSnapshot): boolean {
  return !fleet.hub.online;
}
