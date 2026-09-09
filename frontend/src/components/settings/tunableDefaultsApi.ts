import { formatApiError } from "../../lib/apiError";
import type { HubTunable, HubTunablesResponse } from "../../lib/hubTunablesApi";

/**
 * Defaults, resets and the brain-held helper tunables (settings restructure, pass S6).
 *
 * The read side rides the existing `GET /settings/hub-tunables` snapshot — the brain adds
 * `default` / `is_default` to every row and a `helpers` list alongside them — so there is
 * one poll and one hook for the whole tier-H + tier-N surface. Only the writes are new
 * routes, and they are PATCH/POST because the SPA catch-all on the Pi answers unknown GETs
 * with index.html; a brain that predates this pass therefore fails loud (content-type
 * guard) instead of parsing a page as JSON.
 */

/** A hub tunable row from a brain new enough to state the firmware default. */
export type HubTunableWithDefault = HubTunable & {
  /** The firmware's own power-on value, or null when it is unknown / the device would reject it. */
  default?: string | null;
  /** null when there is no default to compare against — never a guessed `true`. */
  is_default?: boolean | null;
};

/** A brain-held settings helper (tier N): validated, defaulted, resettable. */
export interface HelperTunable {
  entity_id: string;
  label: string;
  description: string;
  section: string;
  group: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  value: number;
  is_default: boolean;
  /** False when nothing is stored and the consumer's own fallback is what runs. */
  stored: boolean;
}

export const PREDATES_DEFAULTS =
  "this brain predates settings defaults — hotpatch the brain for defaults and resets";

async function json<T>(resp: Response, fallback: string): Promise<T> {
  if (resp.status === 404 || resp.status === 405) throw new Error(PREDATES_DEFAULTS);
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(PREDATES_DEFAULTS);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

/** The helper rows carried by the hub-tunables snapshot; null on a brain that lacks them. */
export function helpersOf(data: HubTunablesResponse | null | undefined): HelperTunable[] | null {
  const rows = (data as unknown as { helpers?: HelperTunable[] } | null | undefined)?.helpers;
  return Array.isArray(rows) ? rows : null;
}

/** `default 25 °C` for the row's meta line, or undefined when the brain states no default. */
export function defaultLabelOf(row: HubTunableWithDefault | undefined): string | undefined {
  const value = row?.default;
  if (row == null || value == null || value === "") return undefined;
  return row.kind === "number" && row.unit ? `${value} ${row.unit}` : value;
}

export async function resetHubTunable(entityId: string): Promise<HubTunableWithDefault> {
  const resp = await fetch(`/settings/hub-tunables/${encodeURIComponent(entityId)}/reset`, { method: "POST" });
  return (await json<{ row: HubTunableWithDefault }>(resp, "reset failed")).row;
}

export async function patchHelperTunable(entityId: string, value: number): Promise<HelperTunable> {
  const resp = await fetch("/settings/helper-tunables", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: entityId, value }),
  });
  return (await json<{ row: HelperTunable }>(resp, "threshold write failed")).row;
}

export async function resetHelperTunable(entityId: string): Promise<HelperTunable> {
  const resp = await fetch(`/settings/helper-tunables/${encodeURIComponent(entityId)}/reset`, { method: "POST" });
  return (await json<{ row: HelperTunable }>(resp, "reset failed")).row;
}
