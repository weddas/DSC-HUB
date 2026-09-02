import { Card, StatusChip, Button } from "../ui";
import type { JournalEntry } from "../../types/journal";
import {
  fmtJournalWhen,
  formatSnapshotValue,
  snapshotChipLabel,
  snapshotEntries,
} from "./journalFormat";

export type JournalComparePaneProps = {
  left: JournalEntry;
  right: JournalEntry;
  onClear?: () => void;
};

function compareSnapshotKeys(
  left: Record<string, unknown> | undefined,
  right: Record<string, unknown> | undefined,
): Array<{ key: string; leftVal: unknown; rightVal: unknown; changed: boolean }> {
  const keys = new Set([
    ...snapshotEntries(left).map(([k]) => k),
    ...snapshotEntries(right).map(([k]) => k),
  ]);
  return Array.from(keys).map((key) => {
    const leftVal = left?.[key];
    const rightVal = right?.[key];
    const changed = String(leftVal ?? "") !== String(rightVal ?? "");
    return { key, leftVal, rightVal, changed };
  });
}

function EntryColumn({ entry, side }: { entry: JournalEntry; side: "A" | "B" }) {
  const snapRows = snapshotEntries(entry.snapshot as Record<string, unknown> | undefined);
  return (
    <div className="dsc-journal-compare-col">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <StatusChip label={`Entry ${side}`} tone="ok" />
        <StatusChip label={fmtJournalWhen(entry.occurred_at)} tone="muted" />
        <StatusChip label={entry.source} tone={entry.source === "system" ? "warn" : "muted"} />
      </div>
      <p className="dsc-journal-compare-note">{entry.note || "—"}</p>
      {entry.tags.length ? (
        <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
          {entry.tags.map((tag) => (
            <StatusChip key={`${side}-${entry.id}-${tag}`} label={tag} tone="muted" />
          ))}
        </div>
      ) : null}
      {snapRows.length ? (
        <div className="dsc-chip-row dsc-journal-snapshot-chips">
          {snapRows.map(([key, val]) => (
            <StatusChip
              key={`${side}-${entry.id}-${key}`}
              label={`${snapshotChipLabel(key)} ${formatSnapshotValue(key, val)}`}
              tone="muted"
            />
          ))}
        </div>
      ) : (
        <p className="dsc-muted" style={{ margin: 0, fontSize: 12 }}>
          No snapshot on this row.
        </p>
      )}
    </div>
  );
}

export function JournalComparePane({ left, right, onClear }: JournalComparePaneProps) {
  const diffRows = compareSnapshotKeys(
    left.snapshot as Record<string, unknown> | undefined,
    right.snapshot as Record<string, unknown> | undefined,
  );
  const hasDiff = diffRows.some((row) => row.changed);

  return (
    <Card className="dsc-glass dsc-journal-compare-pane" title="Compare entries">
      <div className="dsc-journal-compare-grid">
        <EntryColumn entry={left} side="A" />
        <EntryColumn entry={right} side="B" />
      </div>

      {diffRows.length ? (
        <div className="dsc-journal-compare-diff" style={{ marginTop: 14 }}>
          <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
            Snapshot diff{hasDiff ? "" : " — values match"}
          </p>
          <ul className="dsc-journal-compare-diff-list">
            {diffRows.map(({ key, leftVal, rightVal, changed }) => (
              <li
                key={key}
                className={changed ? "dsc-journal-compare-diff-row--changed" : undefined}
              >
                <strong>{snapshotChipLabel(key)}</strong>
                <span>{formatSnapshotValue(key, leftVal)}</span>
                <span aria-hidden="true">→</span>
                <span>{formatSnapshotValue(key, rightVal)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        className="dsc-journal-compare-chart-placeholder"
        style={{ marginTop: 14 }}
        aria-label="Chart markers placeholder"
      >
        <p className="dsc-muted" style={{ margin: 0, fontSize: 12 }}>
          Dual chart markers at {fmtJournalWhen(left.occurred_at)} and{" "}
          {fmtJournalWhen(right.occurred_at)} — wired in Task 7 trends panel.
        </p>
      </div>

      {onClear ? (
        <p style={{ margin: "12px 0 0", fontSize: 13 }}>
          <Button variant="secondary" onClick={onClear}>
            Clear compare selection
          </Button>
        </p>
      ) : null}
    </Card>
  );
}
