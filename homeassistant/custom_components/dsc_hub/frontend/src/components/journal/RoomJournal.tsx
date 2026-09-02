import { JournalScopePanel } from "./JournalScopePanel";

/** @deprecated Use JournalScopePanel directly — thin wrapper for legacy imports. */
export function RoomJournal({ roomId = "grow_room" }: { roomId?: string }) {
  return (
    <JournalScopePanel
      scope={{ kind: "room", id: roomId }}
      variant="embedded"
      fetchLimit={10}
      visibleRows={3}
    />
  );
}
