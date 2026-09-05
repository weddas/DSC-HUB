import { JournalScopePanel } from "./JournalScopePanel";

/** @deprecated Use JournalScopePanel directly — thin wrapper for legacy imports. */
export function CoreJournal() {
  return (
    <JournalScopePanel scope={{ kind: "core" }} variant="embedded" fetchLimit={10} visibleRows={3} />
  );
}
