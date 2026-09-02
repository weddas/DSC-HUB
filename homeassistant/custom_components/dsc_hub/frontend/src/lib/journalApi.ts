import { formatApiError } from "./apiError";
import type {
  JournalEntry,
  JournalPaginatedResponse,
  JournalPatchBody,
  JournalPostBody,
  JournalScope,
} from "../types/journal";

function journalBasePath(scope: JournalScope): string {
  switch (scope.kind) {
    case "plant": {
      const id = String(scope.id || "").trim();
      if (!id) throw new Error("plant scope requires id");
      return `/journal/plant/${encodeURIComponent(id)}`;
    }
    case "space": {
      const id = String(scope.id || "").trim();
      if (!id) throw new Error("space scope requires id");
      return `/journal/space/${encodeURIComponent(id)}`;
    }
    case "room":
      return `/journal/room/${encodeURIComponent(scope.id || "grow_room")}`;
    case "core":
      return "/journal/core";
    default:
      throw new Error(`unsupported journal scope: ${scope.kind}`);
  }
}

/** Deep-link href for Grow → Logs (Task 5 page; footer uses this in Task 3). */
export function journalScopeToLogsHref(scope: JournalScope, view?: "list" | "trends"): string {
  return `/grow/logs?${buildLogsSearchParams(scope, view).toString()}`;
}

export type LogsView = "list" | "trends";

export function buildLogsSearchParams(scope: JournalScope, view: LogsView = "list"): URLSearchParams {
  const params = new URLSearchParams();
  params.set("scope", scope.kind);
  if (scope.id) params.set("id", scope.id);
  if (view === "trends") params.set("view", "trends");
  return params;
}

/** Parse Grow → Logs URL query into scope + view (defaults room list). */
export function parseLogsScopeFromSearchParams(params: URLSearchParams): {
  scope: JournalScope;
  view: LogsView;
} {
  const view: LogsView = params.get("view") === "trends" ? "trends" : "list";
  const kind = params.get("scope");
  const id = params.get("id") ?? undefined;

  switch (kind) {
    case "plant":
      return { scope: { kind: "plant", id: id ?? "" }, view };
    case "space":
      return { scope: { kind: "space", id: id === "2x4" ? "2x4" : "4x8" }, view };
    case "room":
      return { scope: { kind: "room", id: id || "grow_room" }, view };
    case "core":
      return { scope: { kind: "core" }, view };
    case "grow_log":
      return { scope: { kind: "grow_log" }, view };
    default:
      return { scope: { kind: "room", id: "grow_room" }, view };
  }
}

export async function fetchJournalScope(
  scope: JournalScope,
  limit = 50,
  offset = 0,
): Promise<JournalPaginatedResponse> {
  const base = journalBasePath(scope);
  const q = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const resp = await fetch(`${base}?${q}`);
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "journal fetch failed"));
  }
  const data = (await resp.json()) as JournalPaginatedResponse;
  return {
    entries: data.entries ?? [],
    total: data.total ?? 0,
    limit: data.limit ?? limit,
    offset: data.offset ?? offset,
    plant_id: data.plant_id,
    space_id: data.space_id,
    room_id: data.room_id,
  };
}

export async function postJournalEntry(scope: JournalScope, body: JournalPostBody): Promise<JournalEntry> {
  const resp = await fetch(journalBasePath(scope), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "journal save failed"));
  }
  return resp.json() as Promise<JournalEntry>;
}

export async function patchJournalEntry(
  scope: JournalScope,
  entryId: number,
  body: JournalPatchBody,
): Promise<JournalEntry> {
  const resp = await fetch(`${journalBasePath(scope)}/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "journal update failed"));
  }
  return resp.json() as Promise<JournalEntry>;
}

export async function deleteJournalEntry(scope: JournalScope, entryId: number): Promise<void> {
  const resp = await fetch(`${journalBasePath(scope)}/${entryId}`, { method: "DELETE" });
  if (!resp.ok) {
    throw new Error(formatApiError(await resp.text(), "journal delete failed"));
  }
}
