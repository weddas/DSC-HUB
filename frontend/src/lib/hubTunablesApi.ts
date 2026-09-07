import { formatApiError } from "./apiError";

/**
 * Brain-owned hub tunables + stage presets + root steering targets (plan-settings S2).
 * Every call guards the content type: the Pi's SPA catch-all answers unknown routes with
 * index.html (HTTP 200), so an old brain must fail loud, not with a JSON parse error.
 */

export type TunableKind = "number" | "select" | "switch";
export type TunableState = "synced" | "pending" | "held" | "differs" | "failed" | "missing" | "unadopted";

export interface HubTunable {
  entity_id: string;
  kind: TunableKind;
  label: string;
  description: string;
  section: string;
  group: string;
  actuates: boolean;
  oos?: string | null;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  desired: string | null;
  hub: string | null;
  state: TunableState;
  source: string | null;
  updated_at: number | null;
  pushed_at: number | null;
  last_error: string;
  present: boolean;
}

export interface HubTunablesResponse {
  hub_online: boolean;
  blocked: boolean;
  brain_owns_stage: boolean;
  rows: HubTunable[];
}

export interface StageRailRow {
  stage: string;
  short: string;
  temp: number;
  vpd_min: number;
  vpd_max: number;
  rh_min: number;
  rh_max: number;
  light_hours: number;
  updated_at: number;
  default: Record<string, number> | null;
  changed: boolean;
}

export interface StageRailResponse {
  rows: StageRailRow[];
  brain_owns: boolean;
  targets: Record<string, string>;
}

export interface RootSteeringTargets {
  targets: Record<string, number>;
  defaults: Record<string, number>;
}

export const PREDATES_TUNABLES = "the brain on the hub predates hub tunables — hotpatch the brain to own hub settings";

async function json<T>(resp: Response, fallback: string): Promise<T> {
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(PREDATES_TUNABLES);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

export async function getHubTunables(): Promise<HubTunablesResponse> {
  const resp = await fetch("/settings/hub-tunables");
  if (resp.status === 404) throw new Error(PREDATES_TUNABLES);
  return json<HubTunablesResponse>(resp, "hub tunables failed");
}

export async function patchHubTunable(entityId: string, value: string | number | boolean): Promise<HubTunable> {
  const resp = await fetch("/settings/hub-tunables", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: entityId, value }),
  });
  return (await json<{ row: HubTunable }>(resp, "hub tunable write failed")).row;
}

export async function adoptHubTunable(entityId: string): Promise<HubTunable> {
  const resp = await fetch(`/settings/hub-tunables/${encodeURIComponent(entityId)}/adopt`, { method: "POST" });
  return (await json<{ row: HubTunable }>(resp, "adopt failed")).row;
}

export async function pushHubTunable(entityId: string): Promise<HubTunable> {
  const resp = await fetch(`/settings/hub-tunables/${encodeURIComponent(entityId)}/push`, { method: "POST" });
  return (await json<{ row: HubTunable }>(resp, "push failed")).row;
}

export async function getStageRail(): Promise<StageRailResponse> {
  const resp = await fetch("/settings/stage-rail");
  if (resp.status === 404) throw new Error(PREDATES_TUNABLES);
  return json<StageRailResponse>(resp, "stage rail failed");
}

export async function patchStageRail(stage: string, fields: Record<string, number>): Promise<StageRailRow> {
  const resp = await fetch("/settings/stage-rail", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage, fields }),
  });
  return (await json<{ row: StageRailRow }>(resp, "stage rail write failed")).row;
}

export async function resetStageRail(stage?: string): Promise<StageRailRow[]> {
  const resp = await fetch(`/settings/stage-rail/reset${stage ? `?stage=${encodeURIComponent(stage)}` : ""}`, { method: "POST" });
  return (await json<{ rows: StageRailRow[] }>(resp, "stage rail reset failed")).rows;
}

export async function applyStageRail(stage: string): Promise<{ stage: string; written: Record<string, string> }> {
  const resp = await fetch(`/settings/stage-rail/apply?stage=${encodeURIComponent(stage)}`, { method: "POST" });
  return json(resp, "stage apply failed");
}

export async function getRootSteeringTargets(): Promise<RootSteeringTargets> {
  const resp = await fetch("/settings/root-steering-targets");
  if (resp.status === 404) throw new Error(PREDATES_TUNABLES);
  return json<RootSteeringTargets>(resp, "root steering targets failed");
}

export async function patchRootSteeringTargets(targets: Record<string, number>): Promise<RootSteeringTargets> {
  const resp = await fetch("/settings/root-steering-targets", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targets }),
  });
  return json<RootSteeringTargets>(resp, "root steering targets write failed");
}
