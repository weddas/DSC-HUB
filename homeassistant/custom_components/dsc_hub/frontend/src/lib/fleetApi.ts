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
