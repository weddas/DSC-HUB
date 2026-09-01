import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import { getRoomJournal, postRoomJournal, type JournalEntry } from "../../lib/fleetApi";

function fmtWhen(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "—";
  }
}

function provenanceTone(provenance: string | undefined): "ok" | "warn" | "muted" {
  const p = String(provenance || "room").toLowerCase();
  if (p === "room") return "ok";
  if (p === "space") return "warn";
  if (p === "plant") return "muted";
  return "muted";
}

export function RoomJournal({ roomId = "grow_room" }: { roomId?: string }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setEntries(await getRoomJournal(roomId, 60));
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
    }
  }, [roomId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await postRoomJournal(roomId, { note: note.trim(), tags: ["room"] });
      setNote("");
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="dsc-glass" title="Grow room journal">
      <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
        Room-native notes plus rollup of child tents and plants. Provenance chips mark room vs tent vs plant —
        observations only, not diagnoses.
      </p>
      <label className="dsc-seat-editors">
        Room note
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Room observation" />
      </label>
      <div className="dsc-chip-row" style={{ marginTop: 8 }}>
        <Button teal disabled={busy || !note.trim()} onClick={() => void save()}>
          Save room note
        </Button>
        {!note.trim() && !busy ? (
          <span className="dsc-muted" style={{ fontSize: 12 }}>
            Add text to enable Save
          </span>
        ) : null}
        {busy ? (
          <span className="dsc-muted" style={{ fontSize: 12 }}>
            Saving…
          </span>
        ) : null}
        {err ? <StatusChip label={err} tone="bad" /> : null}
      </div>
      <ul className="dsc-journal-list">
        {entries.map((row) => {
          const provenance = String(row.provenance || "room");
          return (
            <li
              key={`${provenance}-${row.id}-${row.space_id ?? ""}-${row.plant_id ?? ""}`}
              className="dsc-journal-row"
            >
              <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
                <StatusChip label={fmtWhen(row.occurred_at)} tone="muted" />
                <StatusChip label={provenance} tone={provenanceTone(provenance)} />
                {row.space_id ? <StatusChip label={String(row.space_id)} tone="muted" /> : null}
                {row.plant_id ? <StatusChip label={row.plant_id.slice(0, 18)} tone="muted" /> : null}
              </div>
              <div>{row.note || "—"}</div>
            </li>
          );
        })}
        {!entries.length ? (
          <li className="dsc-muted" style={{ fontSize: 13 }}>
            No room journal rows yet.
          </li>
        ) : null}
      </ul>
    </Card>
  );
}
