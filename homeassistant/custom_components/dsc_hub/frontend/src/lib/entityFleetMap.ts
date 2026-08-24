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
  "sensor.dsc_hub_clone_temperature": { seatId: "hub", metric: "clone_temp_c" },
  "sensor.dsc_hub_clone_humidity": { seatId: "hub", metric: "clone_rh_pct" },
  "sensor.dsc_hub_clone_vpd_kpa": { seatId: "hub", metric: "clone_vpd_kpa" },
  "sensor.dsc_hub_clone_vpd": { seatId: "hub", metric: "clone_vpd_kpa" },
  "sensor.dsc_coldest_root_zone_temp": { seatId: "hub", metric: "coldest_root_c" },
  "sensor.dsc_pot1_got_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_pot2_soil_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_pot2_got_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_pot3_soil_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_pot3_got_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_pot4_soil_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_pot4_got_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_pot1_soil_temperature": { seatId: "pot1", metric: "soil_temp_c" },
  "sensor.dsc_pot2_soil_temperature": { seatId: "pot2", metric: "soil_temp_c" },
  "sensor.dsc_pot3_soil_temperature": { seatId: "pot3", metric: "soil_temp_c" },
  "sensor.dsc_pot4_soil_temperature": { seatId: "pot4", metric: "soil_temp_c" },
  "sensor.dsc_pot1_soil_ec": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_pot2_soil_ec": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_pot3_soil_ec": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_pot4_soil_ec": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_pot1_soil_ph": { seatId: "pot1", metric: "ph" },
  "sensor.dsc_pot2_soil_ph": { seatId: "pot2", metric: "ph" },
  "sensor.dsc_pot3_soil_ph": { seatId: "pot3", metric: "ph" },
  "sensor.dsc_pot4_soil_ph": { seatId: "pot4", metric: "ph" },
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
  const raw = values[ref.metric];
  if (raw == null) return null;
  if (ref.binary) return raw === true || raw === "on" || raw === 1 || raw === "1" ? 1 : 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function fleetEntityAvailable(entityId: string, fleet: FleetSnapshot): boolean {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return false;
  if (ref.seatId === "hub") return fleet.hub.online;
  if (ref.seatId === "panel") return fleet.panel.online;
  if (ref.seatId.startsWith("pot")) return !!fleet.pots[ref.seatId]?.online;
  return !!fleet.sonoffs[ref.seatId]?.online;
}

export function hubFleetDark(fleet: FleetSnapshot): boolean {
  return !fleet.hub.online;
}
