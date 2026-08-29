import { formatApiError } from "./apiError";

export async function get_entity_history(
  entityId: string,
  hours = 6,
): Promise<Array<{ t: number; v: number }>> {
  const resp = await fetch(`/history?entity_id=${encodeURIComponent(entityId)}&hours=${hours}`);
  if (!resp.ok) return [];
  const data = (await resp.json()) as { points?: Array<{ t: number; v: number }> };
  return data.points ?? [];
}

export type GrowLogEvent = { id: number; message: string; ts: number };

export async function get_grow_log(hours = 24, limit = 100): Promise<GrowLogEvent[]> {
  const resp = await fetch(`/grow-log?hours=${hours}&limit=${limit}`);
  if (!resp.ok) return [];
  const data = (await resp.json()) as { events?: GrowLogEvent[] };
  return data.events ?? [];
}

export async function call_service(
  domain: string,
  service: string,
  data: Record<string, unknown> = {},
): Promise<unknown> {
  const resp = await fetch("/control/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, service, data }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "service call failed");
  }
  return resp.json();
}

export type DemandSeat =
  | "heater"
  | "heatmat"
  | "humidifier"
  | "dehumidifier"
  | "ac"
  | "clone_humidifier";

export async function post_demand(seat: DemandSeat, on: boolean): Promise<unknown> {
  const resp = await fetch("/control/demand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat, on }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "demand call failed");
  }
  return resp.json();
}

export async function get_fleet_state(): Promise<Record<string, unknown>> {
  const resp = await fetch("/fleet");
  if (!resp.ok) throw new Error("fleet fetch failed");
  return resp.json();
}

export async function get_fleet_computed(): Promise<Record<string, unknown>> {
  const resp = await fetch("/fleet/computed");
  if (!resp.ok) throw new Error("fleet computed fetch failed");
  return resp.json();
}

export async function get_settings(): Promise<{
  settings: Record<string, string>;
  inventory: Array<Record<string, unknown>>;
}> {
  const resp = await fetch("/settings");
  if (!resp.ok) throw new Error("settings fetch failed");
  return resp.json();
}

export async function patch_settings(settings: Record<string, string>): Promise<void> {
  const resp = await fetch("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings }),
  });
  if (!resp.ok) throw new Error("settings patch failed");
}

export async function patch_inventory(
  seatId: string,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const resp = await fetch(`/settings/inventory/${seatId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) throw new Error("inventory patch failed");
  return resp.json();
}

export async function get_network_status(): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/network");
  if (!resp.ok) throw new Error("network status failed");
  return resp.json();
}

export async function apply_network(): Promise<Record<string, string>> {
  const resp = await fetch("/settings/network/apply", { method: "POST" });
  if (!resp.ok) throw new Error("network apply failed");
  return resp.json();
}

export async function get_catalog_status(): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/catalog/status");
  if (!resp.ok) throw new Error("catalog status failed");
  return resp.json();
}

export async function reload_catalogs(): Promise<Record<string, unknown>> {
  const resp = await fetch("/admin/reload-catalogs", { method: "POST" });
  if (!resp.ok) throw new Error("catalog reload failed");
  return resp.json();
}

export async function get_esphome_devices(): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/esphome/devices");
  if (!resp.ok) throw new Error("esphome devices failed");
  return resp.json();
}

export async function queue_esphome_job(seatId: string, action: "ota" | "compile"): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/esphome/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat_id: seatId, action }),
  });
  if (!resp.ok) throw new Error("esphome job failed");
  return resp.json();
}

export async function get_esphome_jobs(): Promise<Array<Record<string, unknown>>> {
  const resp = await fetch("/settings/esphome/jobs");
  if (!resp.ok) throw new Error("esphome jobs failed");
  const data = await resp.json();
  return data.jobs as Array<Record<string, unknown>>;
}

export async function test_ollama(): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/integrations/test-ollama", { method: "POST" });
  return resp.json();
}

export async function test_cannalib(): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/integrations/test-cannalib", { method: "POST" });
  return resp.json();
}

export async function permit_join(enabled: boolean): Promise<void> {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
}

export async function get_zigbee_devices(): Promise<{ devices: Array<Record<string, unknown>> }> {
  const resp = await fetch("/settings/zigbee/devices");
  if (!resp.ok) throw new Error("zigbee devices failed");
  return resp.json();
}

export async function get_zigbee_health(): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/zigbee/health");
  if (!resp.ok) throw new Error("zigbee health failed");
  return resp.json();
}

export async function get_calibration(
  deviceId: string,
  calType?: string,
): Promise<{ device_id: string; calibrations: Array<Record<string, unknown>> }> {
  const q = calType ? `?cal_type=${encodeURIComponent(calType)}` : "";
  const resp = await fetch(`/settings/calibration/${encodeURIComponent(deviceId)}${q}`);
  if (!resp.ok) throw new Error("calibration fetch failed");
  return resp.json();
}

export async function save_calibration(
  deviceId: string,
  calType: string,
  steps: Array<{ step_key: string; measured_value: number; unit?: string }>,
): Promise<Record<string, unknown>> {
  const resp = await fetch(`/settings/calibration/${encodeURIComponent(deviceId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cal_type: calType, steps }),
  });
  if (!resp.ok) throw new Error("calibration save failed");
  return resp.json();
}

export function backup_export_url(): string {
  return "/settings/backup/export";
}

export async function backup_import(file: File): Promise<Record<string, string>> {
  const form = new FormData();
  form.append("file", file);
  const resp = await fetch("/settings/backup/import", { method: "POST", body: form });
  if (!resp.ok) throw new Error("backup import failed");
  return resp.json();
}

export type ClimateZone = "room" | "clone" | "main";

export type GlobalModifiers = {
  fan_demand_scale: number;
  light_brightness_scale: number;
  temp_offset_c: Record<ClimateZone, number>;
  rh_offset_pct: Record<ClimateZone, number>;
  sensor_clamp?: Record<string, { min: number; max: number }>;
};

export type GlobalModifiersPatch = {
  fan_demand_scale?: number;
  light_brightness_scale?: number;
  temp_offset_c?: Partial<Record<ClimateZone, number>>;
  rh_offset_pct?: Partial<Record<ClimateZone, number>>;
};

export async function getGlobalModifiers(): Promise<GlobalModifiers> {
  const resp = await fetch("/settings/global-modifiers");
  if (!resp.ok) throw new Error("global modifiers fetch failed");
  const data = (await resp.json()) as { modifiers?: GlobalModifiers };
  return data.modifiers as GlobalModifiers;
}

export async function patchGlobalModifiers(patch: GlobalModifiersPatch): Promise<GlobalModifiers> {
  const resp = await fetch("/settings/global-modifiers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) throw new Error("global modifiers patch failed");
  const data = (await resp.json()) as { modifiers?: GlobalModifiers };
  return data.modifiers as GlobalModifiers;
}

export type ProbeStation = {
  seat_id: string;
  tent: string;
  idle_home_pot_id: string;
  reading_mode: string;
  thereabouts: Record<string, unknown>;
  online: boolean;
};

export type ProbeStationPatch = {
  idle_home_pot_id?: string;
  tent?: string;
  clear_role?: boolean;
};

export type PotPlantPatch = {
  plant_name?: string;
  strain_display?: string;
  sprout_date?: string;
  growth_stage?: string;
  tent?: string;
  notes?: string;
  blend?: string;
};

export async function getProbeStations(): Promise<ProbeStation[]> {
  const resp = await fetch("/settings/probe-stations");
  if (!resp.ok) throw new Error("probe stations fetch failed");
  const data = (await resp.json()) as { stations?: ProbeStation[] };
  return data.stations ?? [];
}

export async function patchProbeStation(
  seatId: string,
  patch: ProbeStationPatch,
): Promise<Record<string, unknown>> {
  const resp = await fetch(`/settings/probe-stations/${encodeURIComponent(seatId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "probe station patch failed"));
  }
  return resp.json();
}

export async function patchPotPlant(
  pot: number,
  patch: PotPlantPatch,
): Promise<Record<string, unknown>> {
  const resp = await fetch(`/roster/pots/${pot}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "plant edit failed"));
  }
  return resp.json();
}

export async function detachPlantFromProbe(pot: number): Promise<Record<string, unknown>> {
  const resp = await fetch(`/roster/detach/${pot}`, { method: "POST" });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "detach failed"));
  }
  return resp.json();
}

export async function assignPlantToProbe(slot: number, pot: number): Promise<Record<string, unknown>> {
  const resp = await fetch(`/roster/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slot, pot }),
  });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "assign failed"));
  }
  return resp.json();
}

export async function movePlantBetweenProbes(
  fromPot: number,
  toPot: number,
): Promise<Record<string, unknown>> {
  const resp = await fetch(`/roster/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from_pot: fromPot, to_pot: toPot }),
  });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "move failed"));
  }
  return resp.json();
}

export type SoilTestStartBody = {
  probe_seat_id: string;
  target_pot_id: string;
  roster_seat_id?: string | null;
  plant_label?: string;
  mode?: "roster" | "adhoc";
  timing_note?: string;
  notes?: string;
  tent?: string | null;
};

export type SoilTestPoll = {
  id: string;
  status: "capturing" | "stable" | "confirmed";
  stable?: boolean;
  variance?: number;
  elapsed_s?: number;
  current?: Record<string, number | null>;
  average?: Record<string, number | null>;
  sample_count?: number;
  test?: SoilTestRecord;
};

export type SoilTestRecord = {
  id: string;
  ts: number;
  probe_seat_id: string;
  tent: string;
  target_pot_id: string;
  roster_seat_id?: string | null;
  plant_label: string;
  mode: string;
  timing_note: string;
  notes: string;
  readings: Record<string, number | null>;
  stable_seconds?: number;
  quality_score?: number;
  confirmed: boolean;
};

export async function startSoilTest(body: SoilTestStartBody): Promise<{ id: string; status: string }> {
  const resp = await fetch("/soil-tests/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "soil test start failed");
  }
  return resp.json();
}

export async function pollSoilTest(testId: string): Promise<SoilTestPoll> {
  const resp = await fetch(`/soil-tests/${encodeURIComponent(testId)}`);
  if (!resp.ok) throw new Error("soil test poll failed");
  return resp.json();
}

export async function confirmSoilTest(testId: string): Promise<{
  test: SoilTestRecord;
  return_home_pot_id?: string;
  message?: string;
}> {
  const resp = await fetch(`/soil-tests/${encodeURIComponent(testId)}/confirm`, { method: "POST" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "soil test confirm failed");
  }
  return resp.json();
}

export async function cancelSoilTest(testId: string): Promise<{ cancelled: boolean; id?: string }> {
  const resp = await fetch(`/soil-tests/${encodeURIComponent(testId)}/cancel`, { method: "POST" });
  if (!resp.ok) throw new Error("soil test cancel failed");
  return resp.json();
}

export async function listSoilTests(
  rosterSeatId?: string,
  limit = 50,
): Promise<SoilTestRecord[]> {
  const q = new URLSearchParams({ limit: String(limit) });
  if (rosterSeatId) q.set("roster_seat_id", rosterSeatId);
  const resp = await fetch(`/soil-tests?${q}`);
  if (!resp.ok) throw new Error("soil tests list failed");
  const data = (await resp.json()) as { tests?: SoilTestRecord[] };
  return data.tests ?? [];
}
