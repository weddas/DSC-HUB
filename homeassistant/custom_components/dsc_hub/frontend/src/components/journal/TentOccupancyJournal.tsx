import { JournalScopePanel } from "./JournalScopePanel";

/** @deprecated Use JournalScopePanel directly — thin wrapper for legacy imports. */
export function TentOccupancyJournal({ spaceId }: { spaceId: "4x8" | "2x4" }) {
  return (
    <JournalScopePanel
      scope={{ kind: "space", id: spaceId }}
      variant="embedded"
      fetchLimit={10}
      visibleRows={3}
    />
  );
}
