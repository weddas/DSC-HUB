import { formatApiError } from "./apiError";

/** Alert catalogue preferences (brain-shared) — plan-settings S3. */

export type AlertSeverity = "critical" | "warn" | "info";
export interface AlertPref {
  enabled?: boolean;
  severity?: AlertSeverity;
}
export interface QuietHours {
  start: string;
  end: string;
}
export interface AlertPrefs {
  alerts: Record<string, AlertPref>;
  quiet_hours: QuietHours | null;
  default_severity: Record<string, AlertSeverity>;
  /** Severity for any alert not in default_severity (brain-owned; warn). */
  baseline_severity?: AlertSeverity;
  failsafe_id: string;
}

export const PREDATES_ALERTS = "the brain on the hub predates alert preferences — hotpatch the brain to tune the alert catalogue";

async function json<T>(resp: Response, fallback: string): Promise<T> {
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(PREDATES_ALERTS);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

export async function getAlertPrefs(): Promise<AlertPrefs> {
  const resp = await fetch("/settings/alerts");
  if (resp.status === 404) throw new Error(PREDATES_ALERTS);
  return json<AlertPrefs>(resp, "alert preferences failed");
}

export async function patchAlertPrefs(patch: {
  alerts?: Record<string, AlertPref>;
  quiet_hours?: QuietHours;
  clear_quiet_hours?: boolean;
}): Promise<AlertPrefs> {
  const resp = await fetch("/settings/alerts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return json<AlertPrefs>(resp, "alert preferences write failed");
}

export interface AutomationDefaults {
  debounce_s: number;
  release_s: number;
  window: { start: string; end: string } | null;
}

export async function getAutomationDefaults(): Promise<{ defaults: AutomationDefaults; max_conditions: number }> {
  const resp = await fetch("/settings/automation-defaults");
  if (resp.status === 404) throw new Error("the brain predates automation defaults");
  return json(resp, "automation defaults failed");
}

export async function patchAutomationDefaults(patch: {
  debounce_s?: number;
  release_s?: number;
  window?: { start: string; end: string };
  clear_window?: boolean;
}): Promise<{ defaults: AutomationDefaults; max_conditions: number }> {
  const resp = await fetch("/settings/automation-defaults", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return json(resp, "automation defaults write failed");
}

/** True when `hhmm` (local) falls inside the quiet window (which may wrap midnight). */
export function inQuietHours(q: QuietHours | null | undefined, now: Date = new Date()): boolean {
  if (!q) return false;
  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
  };
  const start = toMin(q.start);
  const end = toMin(q.end);
  const cur = now.getHours() * 60 + now.getMinutes();
  if (start === end) return false;
  return start < end ? cur >= start && cur < end : cur >= start || cur < end;
}
