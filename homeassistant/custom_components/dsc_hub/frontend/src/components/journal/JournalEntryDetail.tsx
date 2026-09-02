import { useEffect, useState } from "react";
import { SlideDrawer } from "../chrome";
import { DecisionLayer } from "../DecisionLayer";
import { Button, StatusChip } from "../ui";
import { GROWTH_STAGE_FALLBACK } from "../../lib/growthStages";
import type { JournalEntry, JournalPatchBody, JournalScope } from "../../types/journal";
import {
  fmtJournalWhen,
  formatSnapshotValue,
  isJournalEntryEditable,
  snapshotChipLabel,
  snapshotEntries,
  toggleHighlightTag,
} from "./journalFormat";

export type JournalEntryDetailProps = {
  open: boolean;
  entry: JournalEntry | null;
  scope: JournalScope;
  onClose: () => void;
  onSaved?: (entry: JournalEntry) => void;
  onDeleted?: (entryId: number) => void;
  onChartMoment?: (entry: JournalEntry) => void;
  update: (entryId: number, body: JournalPatchBody) => Promise<JournalEntry>;
  remove: (entryId: number) => Promise<void>;
  growthStageOptions?: readonly string[];
};

export function JournalEntryDetail({
  open,
  entry,
  scope,
  onClose,
  onSaved,
  onDeleted,
  onChartMoment,
  update,
  remove,
  growthStageOptions = GROWTH_STAGE_FALLBACK,
}: JournalEntryDetailProps) {
  const editable = entry ? isJournalEntryEditable(scope, entry) : false;
  const [note, setNote] = useState("");
  const [highlighted, setHighlighted] = useState(false);
  const [growthStage, setGrowthStage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!entry) return;
    setNote(entry.note || "");
    setHighlighted(entry.tags.some((t) => t.toLowerCase() === "highlight"));
    const stage = entry.snapshot?.growth_stage;
    setGrowthStage(typeof stage === "string" ? stage : stage != null ? String(stage) : "");
    setErr(null);
    setDeleteOpen(false);
  }, [entry]);

  if (!entry) return null;

  const snapRows = snapshotEntries(entry.snapshot as Record<string, unknown> | undefined);
  const otherTags = entry.tags.filter((t) => t && t.toLowerCase() !== "highlight");

  const onSave = async () => {
    if (!editable || !entry) return;
    setBusy(true);
    setErr(null);
    try {
      const tags = toggleHighlightTag([...otherTags], highlighted);
      const body: JournalPatchBody = {
        note: note.trim(),
        tags,
      };
      if (scope.kind === "plant" && growthStage.trim()) {
        body.growth_stage = growthStage.trim();
      }
      const saved = await update(entry.id, body);
      onSaved?.(saved);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!editable || !entry) return;
    setBusy(true);
    setErr(null);
    try {
      await remove(entry.id);
      onDeleted?.(entry.id);
      setDeleteOpen(false);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SlideDrawer open={open} onClose={onClose} title="Journal entry" wide>
        <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
          <StatusChip label={fmtJournalWhen(entry.occurred_at)} tone="muted" />
          <StatusChip
            label={entry.source === "system" ? "system" : "operator"}
            tone={entry.source === "system" ? "warn" : "ok"}
          />
          {entry.provenance ? (
            <StatusChip label={String(entry.provenance)} tone="muted" />
          ) : null}
        </div>

        {editable ? (
          <>
            <label className="dsc-seat-editors">
              Note
              <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <label className="dsc-seat-editors" style={{ marginTop: 10 }}>
              <span className="dsc-chip-row">
                <input
                  type="checkbox"
                  checked={highlighted}
                  onChange={(e) => setHighlighted(e.target.checked)}
                />
                Highlight row
              </span>
            </label>
            {scope.kind === "plant" ? (
              <label className="dsc-seat-editors" style={{ marginTop: 10 }}>
                Growth stage (snapshot)
                <select value={growthStage} onChange={(e) => setGrowthStage(e.target.value)}>
                  <option value="">—</option>
                  {growthStageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {otherTags.length ? (
              <p className="dsc-muted" style={{ margin: "10px 0 0", fontSize: 12 }}>
                Tags: {otherTags.join(", ")}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p style={{ margin: "0 0 10px", whiteSpace: "pre-wrap" }}>{entry.note || "—"}</p>
            {entry.tags.length ? (
              <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
                {entry.tags.map((tag) => (
                  <StatusChip key={`${entry.id}-${tag}`} label={tag} tone="muted" />
                ))}
              </div>
            ) : null}
            <p className="dsc-muted" style={{ margin: 0, fontSize: 12 }}>
              {entry.source === "system"
                ? "System rows are read-only."
                : "Rolled-up entries from another scope — open that scope to edit."}
            </p>
          </>
        )}

        {snapRows.length ? (
          <div style={{ marginTop: 14 }}>
            <p className="dsc-muted" style={{ margin: "0 0 6px", fontSize: 12 }}>
              Env snapshot (captured when saved)
            </p>
            <div className="dsc-chip-row dsc-journal-snapshot-chips">
              {snapRows.map(([key, val]) => (
                <StatusChip
                  key={`${entry.id}-detail-${key}`}
                  label={`${snapshotChipLabel(key)} ${formatSnapshotValue(key, val)}`}
                  tone="muted"
                />
              ))}
            </div>
          </div>
        ) : null}

        {onChartMoment && scope.kind !== "grow_log" && scope.kind !== "core" ? (
          <div className="dsc-chip-row" style={{ marginTop: 14 }}>
            <Button
              variant="secondary"
              onClick={() => onChartMoment(entry)}
            >
              Chart this moment
            </Button>
            <span className="dsc-muted" style={{ fontSize: 12 }}>
              Opens trends ±6h around this entry
            </span>
          </div>
        ) : null}

        {err ? (
          <div className="dsc-chip-row" style={{ marginTop: 12 }}>
            <StatusChip label={err} tone="bad" />
          </div>
        ) : null}

        {editable ? (
          <div className="dsc-chip-row" style={{ marginTop: 16 }}>
            <Button teal disabled={busy || !note.trim()} onClick={() => void onSave()}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
            <Button variant="danger" disabled={busy} onClick={() => setDeleteOpen(true)}>
              Delete…
            </Button>
          </div>
        ) : null}
      </SlideDrawer>

      <DecisionLayer
        open={deleteOpen}
        onDismiss={() => setDeleteOpen(false)}
        onConfirm={() => void onDelete()}
        title="Delete journal entry?"
        confirmLabel="Delete entry"
      >
        <p style={{ margin: 0 }}>
          Permanently remove this operator note? Snapshot data is discarded with the row.
        </p>
      </DecisionLayer>
    </>
  );
}
