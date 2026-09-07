import { formatApiError } from "./apiError";

/** System transparency (plan-settings S4): time, failover, route health, setup profile, reset. */

export const PREDATES_SYSTEM = "the brain on the hub predates the system cards — hotpatch the brain to see time, failover and route health";

async function json<T>(resp: Response, fallback: string): Promise<T> {
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(PREDATES_SYSTEM);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

export interface SystemTime {
  now: number;
  brain: { timezone: string; utc_offset_min: number; local_iso: string; host_tz_env: string | null; monotonic_uptime_s: number };
  ntp: { synced: boolean | null; source: string | null; detail: string; host_timezone?: string };
  hub: {
    epoch: number | null;
    valid: boolean | null;
    timezone: string;
    raw: unknown;
    online: boolean;
    uptime_s: unknown;
    drift_s: number | null;
    reported_age_s: number | null;
    note: string | null;
  };
  photoperiod_note: string;
}

export interface FailoverState {
  ttl_sec: number;
  active: boolean;
  since: number | null;
  remaining_s: number | null;
  forced: Record<string, string>;
  pending_reassert: boolean;
  manual_takeover: boolean | null;
  hub_online: boolean;
}

export interface RouteHealth {
  count: number;
  routes: { path: string; methods: string[] }[];
  optional: { path: string; label: string; since: string; served: boolean }[];
}

export interface SetupProfile {
  kind: "dsc-hub-setup-profile";
  version: number;
  exported_at: number;
  brain_version: string;
  ap_ssid: string;
  sections: Record<string, unknown>;
  excluded: string[];
  /** Added by the SPA: this browser's non-internal preferences. */
  preferences?: Record<string, unknown>;
}

export interface ProfileDiff {
  total: number;
  [section: string]: { present: boolean; changes: { key: string; from: unknown; to: unknown }[] } | number;
}

export interface ProfileImportResult {
  applied: boolean;
  diff: ProfileDiff;
  results?: Record<string, unknown>;
}

export async function getSystemTime(): Promise<SystemTime> {
  const resp = await fetch("/system/time");
  if (resp.status === 404) throw new Error(PREDATES_SYSTEM);
  return json(resp, "system time failed");
}

export async function getFailover(): Promise<FailoverState> {
  const resp = await fetch("/system/failover");
  if (resp.status === 404) throw new Error(PREDATES_SYSTEM);
  return json(resp, "failover state failed");
}

export async function getRouteHealth(): Promise<RouteHealth> {
  const resp = await fetch("/system/routes");
  if (resp.status === 404) throw new Error(PREDATES_SYSTEM);
  return json(resp, "route health failed");
}

export async function getSetupProfile(): Promise<SetupProfile> {
  const resp = await fetch("/settings/profile");
  if (resp.status === 404) throw new Error(PREDATES_SYSTEM);
  return json(resp, "profile export failed");
}

export async function importSetupProfile(profile: SetupProfile, confirm: boolean): Promise<ProfileImportResult> {
  const resp = await fetch("/settings/profile/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, confirm }),
  });
  return json(resp, "profile import failed");
}

export async function getFactoryResetInfo(): Promise<{ confirm_text: string; backup_first: boolean }> {
  const resp = await fetch("/settings/system/factory-reset");
  if (resp.status === 404) throw new Error(PREDATES_SYSTEM);
  return json(resp, "factory reset info failed");
}

export async function factoryReset(confirmText: string): Promise<Record<string, unknown>> {
  const resp = await fetch("/settings/system/factory-reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ confirm_text: confirmText, restart: true }),
  });
  return json(resp, "factory reset failed");
}

export async function getSetupState(): Promise<{ commissioned: boolean; phase: string; debt: unknown[]; version: string; surface: string }> {
  const resp = await fetch("/setup/state");
  return json(resp, "setup state failed");
}

export async function getHealth(): Promise<{ status: string; version: string; surface: string; expected_firmware: string; mode: "demo" | "live"; detail?: string }> {
  const resp = await fetch("/health");
  return json(resp, "health failed");
}

export async function getRawFleet(): Promise<unknown> {
  const resp = await fetch("/fleet");
  return json(resp, "fleet snapshot failed");
}
