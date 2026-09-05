import { useCallback, useEffect, useState } from "react";
import {
  deleteJournalEntry,
  fetchJournalScope,
  patchJournalEntry,
  postJournalEntry,
} from "../lib/journalApi";
import type { JournalEntry, JournalPatchBody, JournalPostBody, JournalScope } from "../types/journal";

export type UseJournalScopeOptions = {
  limit?: number;
  offset?: number;
  /** When false, skip fetch (e.g. plant scope without assigned plant). */
  enabled?: boolean;
};

export type UseJournalScopeResult = {
  entries: JournalEntry[];
  total: number;
  limit: number;
  offset: number;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  save: (body: JournalPostBody) => Promise<JournalEntry>;
  update: (entryId: number, body: JournalPatchBody) => Promise<JournalEntry>;
  remove: (entryId: number) => Promise<void>;
};

function scopeFetchable(scope: JournalScope): boolean {
  if (scope.kind === "grow_log") return false;
  if (scope.kind === "plant" || scope.kind === "space") {
    return Boolean(String(scope.id || "").trim());
  }
  return true;
}

export function useJournalScope(
  scope: JournalScope,
  options: UseJournalScopeOptions = {},
): UseJournalScopeResult {
  const { limit = 50, offset = 0, enabled = true } = options;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled || !scopeFetchable(scope)) {
      setEntries([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchJournalScope(scope, limit, offset);
      setEntries(data.entries);
      setTotal(data.total);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Journal load failed");
    } finally {
      setLoading(false);
    }
    // scope is a freshly-constructed object literal at nearly every call site
    // (parseLogsScopeFromSearchParams, inline `{ kind, id }` props, etc.) — key
    // on its primitive fields, not identity, or every unrelated re-render of a
    // parent (e.g. an entity-bus tick) refetches the journal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.kind, scope.id, limit, offset, enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (body: JournalPostBody) => {
      const entry = await postJournalEntry(scope, body);
      await reload();
      return entry;
    },
    [scope, reload],
  );

  const update = useCallback(
    async (entryId: number, body: JournalPatchBody) => {
      const entry = await patchJournalEntry(scope, entryId, body);
      const data = await fetchJournalScope(scope, limit, 0);
      setEntries(data.entries);
      setTotal(data.total);
      setError(null);
      return entry;
    },
    [scope, limit],
  );

  const remove = useCallback(
    async (entryId: number) => {
      await deleteJournalEntry(scope, entryId);
      const data = await fetchJournalScope(scope, limit, 0);
      setEntries(data.entries);
      setTotal(data.total);
      setError(null);
    },
    [scope, limit],
  );

  return { entries, total, limit, offset, loading, error, reload, save, update, remove };
}
