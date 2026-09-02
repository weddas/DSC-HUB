import { StatusChip } from "../ui";
import type { JournalEntry, JournalScope } from "../../types/journal";
import {
  entryHasHighlightTag,
  fmtJournalWhen,
  formatSnapshotValue,
  isJournalEntryEditable,
  provenanceTone,
  snapshotChipLabel,
  snapshotEntries,
} from "./journalFormat";
import type { Ref } from "react";

export type JournalEntryRowProps = {
  row: JournalEntry;
  scope?: JournalScope;
  urlHighlighted?: boolean;
  compareMode?: boolean;
  compareSelected?: boolean;
  onCompareToggle?: (row: JournalEntry) => void;
  onOpen?: (row: JournalEntry) => void;
  rowRef?: Ref<HTMLLIElement>;
};

export function JournalEntryRow({
  row,
  scope,
  urlHighlighted = false,
  compareMode = false,
  compareSelected = false,
  onCompareToggle,
  onOpen,
  rowRef,
}: JournalEntryRowProps) {
  const provenance = String(row.provenance || "operator");
  const highlighted = entryHasHighlightTag(row);
  const snapRows = snapshotEntries(row.snapshot as Record<string, unknown> | undefined);
  const interactive = Boolean(onOpen || (compareMode && onCompareToggle));
  const editable = scope ? isJournalEntryEditable(scope, row) : row.source !== "system";

  const classNames = [
    "dsc-journal-row",
    highlighted ? "dsc-journal-row--highlight" : "",
    urlHighlighted ? "dsc-journal-row--url-highlight" : "",
    compareSelected ? "dsc-journal-row--compare-selected" : "",
    interactive ? "dsc-journal-row--interactive" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const onRowClick = () => {
    if (compareMode && onCompareToggle) {
      onCompareToggle(row);
      return;
    }
    onOpen?.(row);
  };

  return (
    <li
      ref={rowRef}
      className={classNames}
      data-entry-id={row.id}
      onClick={interactive ? onRowClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRowClick();
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
        {compareMode ? (
          <input
            type="checkbox"
            checked={compareSelected}
            readOnly
            aria-label={`Compare entry ${row.id}`}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onCompareToggle?.(row)}
          />
        ) : null}
        <StatusChip label={fmtJournalWhen(row.occurred_at)} tone="muted" />
        <StatusChip
          label={row.source === "system" ? "system" : "operator"}
          tone={row.source === "system" ? "warn" : "ok"}
        />
        {provenance && provenance !== row.source ? (
          <StatusChip label={provenance} tone={provenanceTone(provenance)} />
        ) : null}
        {row.space_id ? <StatusChip label={String(row.space_id)} tone="muted" /> : null}
        {row.plant_id ? <StatusChip label={row.plant_id.slice(0, 18)} tone="muted" /> : null}
        {row.tags
          .filter((t) => t && t.toLowerCase() !== "highlight")
          .map((tag) => (
            <StatusChip key={`${row.id}-${tag}`} label={tag} tone="muted" />
          ))}
        {highlighted ? <StatusChip label="highlight" tone="ok" /> : null}
      </div>
      <div>{row.note || "—"}</div>
      {snapRows.length ? (
        <div className="dsc-chip-row dsc-journal-snapshot-chips" style={{ marginTop: 6 }}>
          {snapRows.map(([key, val]) => (
            <StatusChip
              key={`${row.id}-snap-${key}`}
              label={`${snapshotChipLabel(key)} ${formatSnapshotValue(key, val)}`}
              tone="muted"
            />
          ))}
          <span className="dsc-muted" style={{ fontSize: 11 }}>
            Env captured when saved
          </span>
        </div>
      ) : null}
      {interactive && !compareMode && editable ? (
        <span className="dsc-muted dsc-journal-row-action-hint" style={{ fontSize: 11 }}>
          Click to edit
        </span>
      ) : null}
    </li>
  );
}
