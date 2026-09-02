import { JournalScopePanel } from "./JournalScopePanel";

/** @deprecated Use JournalScopePanel directly — thin wrapper for legacy imports. */
export function PlantMiniJournal({ plantId }: { plantId: string }) {
  return (
    <JournalScopePanel
      scope={{ kind: "plant", id: plantId }}
      variant="embedded"
      fetchLimit={10}
      visibleRows={3}
    />
  );
}
