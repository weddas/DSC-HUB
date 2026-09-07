import { formatApiError } from "./apiError";

export type ZoneRole = "grow" | "dry" | "cure" | "empty" | "room";

export interface ZoneRecord {
  zone_id: string;
  kind: "tent" | "room" | "container" | "rack" | string;
  name: string;
  size_label: string;
  size_m2: number | null;
  parent: string | null;
  parent_label: string | null;
  role: ZoneRole;
  role_label: string;
  role_since: number | null;
  role_history: Array<{ from: string; to: string; at: number }>;
  notes: string;
  children?: string[];
  updated_at?: number;
}

export interface ZoneEffects {
  does: { all: string[] };
  does_not: { all: string[] };
}

export interface ZonesResponse {
  zones: ZoneRecord[];
  roles: Exclude<ZoneRole, "room">[];
  effects: ZoneEffects;
}

const PREDATES = "the brain on the hub predates zones — hotpatch the brain to name rooms and flip roles";

/** An older brain has no /zones route and its SPA catch-all answers with index.html (HTTP 200). */
async function jsonOrPredates<T>(resp: Response, fallback: string): Promise<T> {
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(PREDATES);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

export async function getZones(): Promise<ZonesResponse> {
  const resp = await fetch("/zones");
  if (resp.status === 404) throw new Error(PREDATES);
  return jsonOrPredates<ZonesResponse>(resp, "zones failed");
}

export interface ZonePatchResult {
  zone: ZoneRecord;
  changed: Record<string, { from: unknown; to: unknown }>;
  journal_entry: { id: number; note: string } | null;
}

export async function patchZone(
  zoneId: string,
  patch: { name?: string; role?: Exclude<ZoneRole, "room">; notes?: string },
): Promise<ZonePatchResult> {
  const resp = await fetch(`/zones/${encodeURIComponent(zoneId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (resp.status === 404) throw new Error(PREDATES);
  return jsonOrPredates<ZonePatchResult>(resp, "zone update failed");
}
