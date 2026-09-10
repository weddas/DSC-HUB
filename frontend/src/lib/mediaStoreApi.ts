import { formatApiError } from "./apiError";

/** One place media could be saved.
 *
 * `writable` is the field the UI must respect. A location the brain cannot write is still
 * listed, with `reason` saying why — "my drive isn't in the list" needs an answer on screen,
 * and silently dropping it leaves the operator guessing whether the drive was seen at all.
 */
export interface MediaLocation {
  path: string;
  label: string;
  fstype: string;
  removable: boolean;
  total_bytes: number;
  free_bytes: number;
  is_current: boolean;
  writable: boolean;
  reason: string;
}

export interface MediaLocations {
  current: string;
  default: string;
  locations: MediaLocation[];
  /** False means the brain cannot see removable mounts AT ALL — a missing bind mount, not
   * a missing drive. The two need different advice, so they are different states. */
  external_visible: boolean;
}

export interface MediaTransfer {
  job_id: string;
  mode: "copy" | "move";
  source: string;
  dest: string;
  state: "running" | "done" | "failed" | "cancelled";
  files_total: number;
  files_done: number;
  bytes_total: number;
  bytes_done: number;
  current: string;
  error: string;
  started_at: number;
  finished_at: number | null;
  deleted: number;
}

export async function fetchMediaLocations(): Promise<MediaLocations> {
  const r = await fetch("/settings/media/locations");
  if (!r.ok) throw new Error(formatApiError(await r.text(), "could not read the save locations"));
  return r.json();
}

export async function setMediaLocation(path: string): Promise<{ media_root: string }> {
  const r = await fetch("/settings/media/location", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!r.ok) throw new Error(formatApiError(await r.text(), "could not change the save location"));
  return r.json();
}

export async function startMediaTransfer(dest: string, mode: "copy" | "move"): Promise<MediaTransfer> {
  const r = await fetch("/settings/media/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dest, mode }),
  });
  if (!r.ok) throw new Error(formatApiError(await r.text(), "could not start the transfer"));
  return r.json();
}

export async function fetchMediaTransfer(jobId: string): Promise<MediaTransfer> {
  const r = await fetch(`/settings/media/transfer/${encodeURIComponent(jobId)}`);
  if (!r.ok) throw new Error(formatApiError(await r.text(), "could not read the transfer"));
  return r.json();
}

export async function cancelMediaTransfer(jobId: string): Promise<void> {
  const r = await fetch(`/settings/media/transfer/${encodeURIComponent(jobId)}/cancel`, { method: "POST" });
  if (!r.ok) throw new Error(formatApiError(await r.text(), "could not cancel the transfer"));
}

export function fmtBytes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}
