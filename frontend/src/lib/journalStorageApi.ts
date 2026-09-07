import { formatApiError } from "./apiError";

/** Journals & storage + grow-record archive (plan-settings S3). */

export interface JournalStorageRow {
  kind: string;
  label: string;
  description: string;
  rows: number;
  oldest_ts: number | null;
  newest_ts: number | null;
  estimated_bytes: number;
  share_bytes: number;
  retention_days: number;
  present: boolean;
  archived_plants?: number | null;
}

export interface JournalStorage {
  db_path: string;
  db_bytes: number;
  free_bytes: number;
  total_bytes: number;
  journals: JournalStorageRow[];
  fleet_history: { rows: number; oldest_ts: number | null; newest_ts: number | null; share_bytes: number; retention_days: number };
  archive: { count: number; share_bytes: number };
  estimate_note: string;
}

export interface RetentionPreview {
  kind: string;
  days: number;
  would_delete: number;
  oldest_ts: number | null;
  cutoff_ts: number | null;
}

export interface RetentionResult {
  stored: boolean;
  would_delete: number;
  previews: RetentionPreview[];
  removed?: Record<string, number>;
  retention: Record<string, number>;
  stats?: JournalStorage;
}

export interface ArchiveHeader {
  id: number;
  plant_id: string;
  archived_at: number;
  reason: string;
  nickname?: string;
  strain?: string;
  sprout_date?: string;
  tent?: string | null;
  pot?: string;
  slot?: number;
  entry_count: number;
  tent_entry_count: number;
}

const PREDATES = "the brain on the hub predates journals & storage — hotpatch the brain to set retention and archive grow records";

async function json<T>(resp: Response, fallback: string): Promise<T> {
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(PREDATES);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

export async function getJournalStorage(): Promise<JournalStorage> {
  const resp = await fetch("/settings/journals");
  if (resp.status === 404) throw new Error(PREDATES);
  return json<JournalStorage>(resp, "journal storage failed");
}

export async function patchJournalRetention(retention: Record<string, number>, confirm: boolean): Promise<RetentionResult> {
  const resp = await fetch("/settings/journals", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ retention, confirm }),
  });
  return json<RetentionResult>(resp, "retention write failed");
}

export function journalExportHref(kind: string, id?: string, format: "json" | "csv" = "json"): string {
  const q = new URLSearchParams({ kind, format });
  if (id) q.set("id", id);
  return `/journals/export?${q.toString()}`;
}

export function journalsBundleHref(kinds?: string[]): string {
  return kinds && kinds.length ? `/journals/export.zip?kinds=${encodeURIComponent(kinds.join(","))}` : "/journals/export.zip";
}

export async function getArchives(): Promise<{ archives: ArchiveHeader[] }> {
  const resp = await fetch("/journals/archive");
  if (resp.status === 404) throw new Error(PREDATES);
  return json(resp, "archive list failed");
}

export async function createArchive(plantId: string, reason = "manual"): Promise<ArchiveHeader> {
  const resp = await fetch("/journals/archive", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plant_id: plantId, reason }),
  });
  return (await json<{ archive: ArchiveHeader }>(resp, "archive failed")).archive;
}

export function archiveExportHref(id: number, format: "zip" | "json" | "csv" = "zip"): string {
  return `/journals/archive/${id}/export?format=${format}`;
}
