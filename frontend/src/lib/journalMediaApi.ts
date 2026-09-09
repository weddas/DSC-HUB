import { formatApiError } from "./apiError";
import type { JournalAction, JournalMedia } from "../types/journal";

/** Pass S6 — the action catalogue and entry photos.
 *
 * The catalogue is served by the brain rather than hard-coded here so an operator-defined
 * action type appears in the composer without a rebuild, and so the SPA and the brain can
 * never disagree about which fields an action has.
 */

export async function fetchJournalActions(): Promise<JournalAction[]> {
  const resp = await fetch("/journals/actions");
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "could not load journal actions"));
  }
  const data = (await resp.json()) as { actions?: JournalAction[] };
  return data.actions ?? [];
}

/** The URL an <img> reads. Immutable server-side: the filename is a content hash. */
export function journalMediaSrc(mediaId: number): string {
  return `/journals/media/${mediaId}`;
}

export async function uploadJournalMedia(
  journalKind: string,
  entryId: number,
  file: File,
  opts: { scopeId?: string; caption?: string } = {},
): Promise<JournalMedia & { note?: string }> {
  const form = new FormData();
  form.append("file", file);
  const q = new URLSearchParams();
  if (opts.scopeId) q.set("scope_id", opts.scopeId);
  if (opts.caption) q.set("caption", opts.caption);
  const resp = await fetch(
    `/journals/${encodeURIComponent(journalKind)}/${entryId}/media?${q}`,
    { method: "POST", body: form },
  );
  if (!resp.ok) {
    // The brain's messages here are written for the operator ("image is 7.2 MB — the limit
    // is 4 MB…"), so surface them rather than a generic failure.
    throw new Error(formatApiError(await resp.text(), "photo upload failed"));
  }
  const data = (await resp.json()) as { media: JournalMedia & { note?: string } };
  return data.media;
}

export async function deleteJournalMedia(mediaId: number): Promise<void> {
  const resp = await fetch(`/journals/media/${mediaId}`, { method: "DELETE" });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "could not delete the photo"));
  }
}

/** Bytes as the storage card writes them — "1.4 MB", "812 kB". */
export function formatMediaBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
