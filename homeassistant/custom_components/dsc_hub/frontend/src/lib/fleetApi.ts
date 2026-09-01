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
  const resp = await fetch(`/fleet/computed?_=${Date.now()}`);
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

/** z2m max useful window is 254s; keep open long enough for factory-reset + LED blink. */
export async function permit_join(enabled: boolean, duration_s = 254): Promise<void> {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled, duration_s: enabled ? duration_s : 0 }),
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

export type ZigbeeRoleKind = "none" | "climate" | "safety" | "plug" | "meter" | "button" | "gas" | "light";

export type ZigbeeRole = {
  id: string;
  label: string;
  consume?: boolean;
  kind?: ZigbeeRoleKind | string;
};

export type ZigbeeParamSchemaField = {
  type: string;
  values?: string[];
};

export type ZigbeeRecipe = {
  id: string;
  label: string;
  description?: string;
  suggested_roles?: string[];
  device_classes?: string[];
  param_schema?: Record<string, ZigbeeParamSchemaField>;
  default_params?: Record<string, unknown>;
};

export type ZigbeeCapabilityClass = "climate" | "liquid" | "plug" | "motion" | "other" | "safety";

const CLASS_ROLE_KINDS: Record<string, ReadonlySet<string>> = {
  climate: new Set(["climate"]),
  liquid: new Set(["safety"]),
  safety: new Set(["safety"]),
  plug: new Set(["plug"]),
  motion: new Set(),
  other: new Set(),
};

/** Mirror brain `banner_template` for SPA param defaults. */
export function zigbeeBannerTemplate(seatId: string, problemWhen: string): string {
  const seat = String(seatId || "").trim().toLowerCase();
  const polarity = String(problemWhen || "active").trim().toLowerCase();
  if (seat === "humidifier") {
    if (polarity === "inactive") return "Humidifier EMPTY - refill";
    return "Humidifier tank FULL - empty tank";
  }
  if (polarity === "inactive") return "Dehumidifier tank EMPTY - refill";
  return "Dehumidifier tank FULL - empty tank";
}

export function filterZigbeeRolesForClass(
  capabilityClass: string,
  roles: ZigbeeRole[],
): ZigbeeRole[] {
  const allowed = CLASS_ROLE_KINDS[String(capabilityClass).toLowerCase()] ?? new Set<string>();
  return roles.filter((role) => {
    const kind = String(role.kind ?? "none");
    const id = String(role.id ?? "");
    return id === "unbound" || allowed.has(kind);
  });
}

export function filterZigbeeRecipesForClass(
  capabilityClass: string,
  recipes: ZigbeeRecipe[],
): ZigbeeRecipe[] {
  const cap = String(capabilityClass).toLowerCase();
  return recipes.filter((recipe) => {
    const id = String(recipe.id ?? "");
    if (id === "none") return true;
    const classes = recipe.device_classes;
    if (!Array.isArray(classes)) return false;
    return classes.some((c) => String(c).toLowerCase() === cap);
  });
}

export function isZigbeeSafetyLeakRole(roleId: string): boolean {
  const id = String(roleId || "");
  return id === "leak_tank" || id === "leak_floor" || id.startsWith("leak_floor_");
}

export function zigbeeFloodBannerTemplate(problemWhen: string): string {
  const polarity = String(problemWhen || "active").toLowerCase();
  if (polarity === "inactive") return "Floor dry alarm — check sensor";
  return "Floor water detected";
}

export async function get_zigbee_roles(): Promise<{ roles: ZigbeeRole[] }> {
  const resp = await fetch("/settings/zigbee/roles");
  if (!resp.ok) throw new Error("zigbee roles failed");
  return resp.json();
}

export async function put_zigbee_bindings(
  bindings: Record<string, Record<string, unknown>>,
): Promise<{ bindings: Record<string, Record<string, unknown>> }> {
  const resp = await fetch("/settings/zigbee/bindings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bindings }),
  });
  if (!resp.ok) throw new Error("zigbee bindings save failed");
  return resp.json();
}

export async function get_zigbee_recipes(): Promise<{ recipes: ZigbeeRecipe[] }> {
  const resp = await fetch("/settings/zigbee/recipes");
  if (!resp.ok) throw new Error("zigbee recipes failed");
  return resp.json();
}

export async function get_zigbee_policies(): Promise<{
  policies: Record<string, { recipe_id: string; enabled?: boolean; params?: Record<string, unknown> }>;
}> {
  const resp = await fetch("/settings/zigbee/policies");
  if (!resp.ok) throw new Error("zigbee policies failed");
  return resp.json();
}

export async function put_zigbee_policies(
  policies: Record<string, Record<string, unknown>>,
): Promise<{ policies: Record<string, Record<string, unknown>> }> {
  const resp = await fetch("/settings/zigbee/policies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policies }),
  });
  if (!resp.ok) throw new Error("zigbee policies save failed");
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
  thereabouts_source?: string | null;
  home_online?: boolean;
  home_trustworthy?: boolean;
  home_sensor_fault?: boolean;
  home_modbus_ok?: boolean;
  seat_online?: boolean;
  seat_sensor_fault?: boolean;
  seat_modbus_ok?: boolean;
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

export async function getSoftCalAdvice(body: {
  seat?: string;
  strain_id?: string | null;
  stage?: string;
  got?: Record<string, number | null>;
  soft_cal?: Record<string, unknown>;
  manual_takeover?: boolean;
}): Promise<{
  ok: boolean;
  narrative?: string;
  advisories?: string[];
  actions?: Array<{ type: string; detail?: string }>;
  ollama?: boolean;
  guardrail?: string;
}> {
  const resp = await fetch("/ai/soft-cal-advice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error("soft-cal advice failed");
  return resp.json();
}

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

export async function retireRosterSlot(slot: number): Promise<Record<string, unknown>> {
  const resp = await fetch(`/roster/slots/${slot}/retire`, { method: "POST" });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "retire failed"));
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

/* --- Space energy / journals --- */

export type JournalEntry = {
  id: number;
  plant_id?: string;
  space_id?: string;
  occurred_at: number;
  note: string;
  source: string;
  tags: string[];
  provenance?: "plant" | "space";
  created_at?: number;
};

export async function getPlantJournal(plantId: string, limit = 100): Promise<JournalEntry[]> {
  const resp = await fetch(`/journal/plant/${encodeURIComponent(plantId)}?limit=${limit}`);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "plant journal failed"));
  const data = (await resp.json()) as { entries?: JournalEntry[] };
  return data.entries ?? [];
}

export async function postPlantJournal(
  plantId: string,
  body: { note: string; occurred_at?: number; tags?: string[] },
): Promise<JournalEntry> {
  const resp = await fetch(`/journal/plant/${encodeURIComponent(plantId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "plant journal save failed"));
  return resp.json();
}

export async function getSpaceJournal(spaceId: string, limit = 100): Promise<JournalEntry[]> {
  const resp = await fetch(`/journal/space/${encodeURIComponent(spaceId)}?limit=${limit}`);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "space journal failed"));
  const data = (await resp.json()) as { entries?: JournalEntry[] };
  return data.entries ?? [];
}

export async function postSpaceJournal(
  spaceId: string,
  body: { note: string; occurred_at?: number; tags?: string[] },
): Promise<JournalEntry> {
  const resp = await fetch(`/journal/space/${encodeURIComponent(spaceId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "space journal save failed"));
  return resp.json();
}

export type SpaceDevice = {
  space_id: string;
  device_id: string;
  label: string;
  watts: number;
  duty_source: string;
  enabled: boolean;
};

export async function getSpaces(): Promise<
  Array<{ space_id: string; size_label?: string; devices: SpaceDevice[] }>
> {
  const resp = await fetch("/spaces");
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "spaces failed"));
  const data = (await resp.json()) as { spaces?: Array<{ space_id: string; devices: SpaceDevice[] }> };
  return data.spaces ?? [];
}

export async function putSpaceDevice(
  spaceId: string,
  deviceId: string,
  patch: Partial<SpaceDevice>,
): Promise<SpaceDevice> {
  const resp = await fetch(`/spaces/${encodeURIComponent(spaceId)}/devices/${encodeURIComponent(deviceId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "space device update failed"));
  return resp.json();
}

export type EnergyEstimate = {
  ok: boolean;
  honesty?: string;
  estimate_label?: string;
  total_kwh?: number;
  total_cost?: number;
  by_band?: Record<string, number>;
  devices?: Array<{ device_id: string; label: string; watts: number; kwh: number; cost: number }>;
};

export async function getEnergyEstimate(
  spaceId: string,
  lightsOn: string,
  wantHours: number,
): Promise<EnergyEstimate> {
  const q = new URLSearchParams({
    space_id: spaceId,
    lights_on: lightsOn,
    want_hours: String(wantHours),
  });
  const resp = await fetch(`/energy/estimate?${q}`);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "energy estimate failed"));
  return resp.json();
}

export type EnergySuggestion = {
  id: string;
  label: string;
  lights_on: string;
  want_hours: number;
  total_cost: number;
  delta_vs_current: number;
  apply: boolean;
  learning?: { planning_signal?: boolean; reason?: string; apply?: boolean };
};

export async function getEnergySuggestions(
  spaceId: string,
  lightsOn: string,
  wantHours: number,
): Promise<EnergySuggestion[]> {
  const q = new URLSearchParams({
    space_id: spaceId,
    lights_on: lightsOn,
    want_hours: String(wantHours),
  });
  const resp = await fetch(`/energy/suggestions?${q}`);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "energy suggestions failed"));
  const data = (await resp.json()) as { suggestions?: EnergySuggestion[] };
  return data.suggestions ?? [];
}

export async function getEnergyTariff(): Promise<
  Array<{ band_id: string; label: string; start_min: number; end_min: number; rate_per_kwh: number }>
> {
  const resp = await fetch("/energy/tariff");
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "tariff failed"));
  const data = (await resp.json()) as { bands?: Array<{ band_id: string; label: string; start_min: number; end_min: number; rate_per_kwh: number }> };
  return data.bands ?? [];
}

export async function putEnergyTariffBand(band: {
  band_id: string;
  label?: string;
  start_min?: number;
  end_min?: number;
  rate_per_kwh?: number;
}): Promise<unknown> {
  const resp = await fetch("/energy/tariff", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(band),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "tariff update failed"));
  return resp.json();
}

export type EnergyLearningSettings = {
  enabled: boolean;
  prefer_growth_outliers: boolean;
  outlier_days: number;
  norm_days: number;
};

export async function getEnergyLearning(): Promise<EnergyLearningSettings> {
  const resp = await fetch("/energy/learning");
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "learning settings failed"));
  return resp.json();
}

export async function patchEnergyLearning(
  patch: Partial<EnergyLearningSettings>,
): Promise<EnergyLearningSettings> {
  const resp = await fetch("/energy/learning", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "learning patch failed"));
  return resp.json();
}

export async function postShiftPlan(body: {
  space_id: string;
  from_on: string;
  to_on: string;
  want_hours: number;
  policy: "pause" | "flower_strict" | "veg_style";
  confirm: boolean;
}): Promise<Record<string, unknown>> {
  const resp = await fetch("/energy/shift/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "shift plan failed"));
  return resp.json();
}

export async function cancelShiftPlan(planId: number): Promise<Record<string, unknown>> {
  const resp = await fetch(`/energy/shift/${planId}/cancel`, { method: "POST" });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "cancel shift failed"));
  return resp.json();
}

export type PendingFlip = {
  id: number;
  space_id: string;
  plant_id?: string | null;
  from_hours?: number;
  to_hours?: number;
  status: string;
  note?: string;
};

export async function getPendingFlips(): Promise<PendingFlip[]> {
  const resp = await fetch("/energy/shift/pending-flips");
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "pending flips failed"));
  const data = (await resp.json()) as { flips?: PendingFlip[] };
  return data.flips ?? [];
}

export async function resolveFlip(reqId: number, approve: boolean): Promise<PendingFlip> {
  const resp = await fetch(`/energy/flip/${reqId}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approve }),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "flip resolve failed"));
  return resp.json();
}

export async function getEnergyConflicts(params: {
  space_id: string;
  plant_id?: string;
  plant_want_hours?: number;
  space_want_hours?: number;
}): Promise<{ banners: Array<Record<string, unknown>>; pending_flips: PendingFlip[]; auto_apply: boolean }> {
  const q = new URLSearchParams({ space_id: params.space_id });
  if (params.plant_id) q.set("plant_id", params.plant_id);
  if (params.plant_want_hours != null) q.set("plant_want_hours", String(params.plant_want_hours));
  if (params.space_want_hours != null) q.set("space_want_hours", String(params.space_want_hours));
  const resp = await fetch(`/energy/conflicts?${q}`);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "conflicts failed"));
  return resp.json();
}
