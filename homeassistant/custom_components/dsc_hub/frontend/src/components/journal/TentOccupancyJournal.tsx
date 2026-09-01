import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import { getSpaceJournal, postSpaceJournal, type JournalEntry } from "../../lib/fleetApi";

function fmtWhen(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "—";
  }
}

export function TentOccupancyJournal({ spaceId }: { spaceId: "4x8" | "2x4" }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setEntries(await getSpaceJournal(spaceId, 50));
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Journal load failed");
    }
  }, [spaceId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await postSpaceJournal(spaceId, { note: note.trim(), tags: ["space"] });
      setNote("");
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const label = spaceId === "4x8" ? "4×8" : "2×4";

  return (
    <Card className="dsc-glass" title={`${label} occupancy journal`}>
      <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
        Space-native notes plus rolled-up plant journal rows. Provenance chips mark plant vs tent.
      </p>
      <label className="dsc-seat-editors">
        Tent note
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Space observation" />
      </label>
      <div className="dsc-chip-row" style={{ marginTop: 8 }}>
        <Button teal disabled={busy || !note.trim()} onClick={() => void save()}>
          Save tent note
        </Button>
        {err ? <StatusChip label={err} tone="bad" /> : null}
      </div>
      <ul className="dsc-journal-list">
        {entries.map((row) => (
          <li key={`${row.provenance}-${row.id}-${row.plant_id ?? ""}`} className="dsc-journal-row">
            <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
              <StatusChip label={fmtWhen(row.occurred_at)} tone="muted" />
              <StatusChip
                label={row.provenance === "plant" ? "plant" : "space"}
                tone={row.provenance === "plant" ? "ok" : "warn"}
              />
              {row.plant_id ? <StatusChip label={row.plant_id.slice(0, 18)} tone="muted" /> : null}
            </div>
            <div>{row.note || "—"}</div>
          </li>
        ))}
        {!entries.length ? (
          <li className="dsc-muted" style={{ fontSize: 13 }}>
            No occupancy journal rows yet.
          </li>
        ) : null}
      </ul>
    </Card>
  );
}
