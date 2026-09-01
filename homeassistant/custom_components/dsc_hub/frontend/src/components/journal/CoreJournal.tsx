import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import { getCoreJournal, postCoreJournal, type JournalEntry } from "../../lib/fleetApi";

function fmtWhen(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "—";
  }
}

/** DSC-Core facility journal — above rooms. */
export function CoreJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setEntries(await getCoreJournal(80));
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await postCoreJournal({ note: note.trim(), tags: ["facility"] });
      setNote("");
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="dsc-glass" title="DSC-Core journal">
      <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
        Facility / system layer — Core-native notes plus rollup of all rooms (tents and plants).
      </p>
      <label className="dsc-seat-editors">
        Core note
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="dsc-chip-row" style={{ marginTop: 8 }}>
        <Button teal disabled={busy || !note.trim()} onClick={() => void save()}>
          Save Core note
        </Button>
        {err ? <StatusChip label={err} tone="bad" /> : null}
      </div>
      <ul className="dsc-journal-list">
        {entries.map((row) => (
          <li
            key={`${row.provenance}-${row.id}-${row.room_id ?? ""}-${row.space_id ?? ""}-${row.plant_id ?? ""}`}
            className="dsc-journal-row"
          >
            <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
              <StatusChip label={fmtWhen(row.occurred_at)} tone="muted" />
              <StatusChip label={String(row.provenance || "core")} tone="warn" />
            </div>
            <div>{row.note || "—"}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
