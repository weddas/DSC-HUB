import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import { getPlantJournal, postPlantJournal, type JournalEntry } from "../../lib/fleetApi";

function toLocalInputValue(tsSec: number): string {
  const d = new Date(tsSec * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(v: string): number {
  const t = Date.parse(v);
  return Number.isFinite(t) ? t / 1000 : Date.now() / 1000;
}

function fmtWhen(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "—";
  }
}

/** Mini plant journal — observations only; no lighting controls. */
export function PlantMiniJournal({ plantId }: { plantId: string }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [when, setWhen] = useState(() => toLocalInputValue(Date.now() / 1000));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!plantId) return;
    try {
      setEntries(await getPlantJournal(plantId, 40));
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Journal load failed");
    }
  }, [plantId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!note.trim() || !plantId) return;
    setBusy(true);
    setErr(null);
    try {
      await postPlantJournal(plantId, {
        note: note.trim(),
        occurred_at: fromLocalInputValue(when),
        tags: ["observation"],
      });
      setNote("");
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (!plantId) {
    return (
      <Card className="dsc-glass" title="Plant journal">
        <p className="dsc-muted" style={{ margin: 0, fontSize: 13 }}>
          Assign a plant to this probe to keep a mini journal that follows the plant.
        </p>
      </Card>
    );
  }

  return (
    <Card className="dsc-glass" title="Plant journal">
      <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
        Operator observations only — not diagnoses. Lighting stays on the tent, not this plant card.
      </p>
      <label className="dsc-seat-editors">
        When
        <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
      </label>
      <label className="dsc-seat-editors" style={{ marginTop: 8 }}>
        Note
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What you saw (observation, not a diagnosis)"
        />
      </label>
      <div className="dsc-chip-row" style={{ marginTop: 8 }}>
        <Button teal disabled={busy || !note.trim()} onClick={() => void save()}>
          Save
        </Button>
        {err ? <StatusChip label={err} tone="bad" /> : null}
      </div>
      <ul className="dsc-journal-list">
        {entries.map((row) => (
          <li key={row.id} className="dsc-journal-row">
            <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
              <StatusChip label={fmtWhen(row.occurred_at)} tone="muted" />
              <StatusChip label={row.source} tone={row.source === "system" ? "warn" : "ok"} />
            </div>
            <div>{row.note || "—"}</div>
          </li>
        ))}
        {!entries.length ? (
          <li className="dsc-muted" style={{ fontSize: 13 }}>
            No journal rows yet.
          </li>
        ) : null}
      </ul>
    </Card>
  );
}
