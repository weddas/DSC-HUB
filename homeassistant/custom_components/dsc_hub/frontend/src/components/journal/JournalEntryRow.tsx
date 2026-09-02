import { StatusChip } from "../ui";
import type { JournalEntry } from "../../types/journal";
import {
  fmtJournalWhen,
  formatSnapshotValue,
  provenanceTone,
  snapshotChipLabel,
  snapshotEntries,
} from "./journalFormat";

export function JournalEntryRow({ row }: { row: JournalEntry }) {
  const provenance = String(row.provenance || "operator");
  const highlighted = row.tags.some((t) => t.toLowerCase() === "highlight");
  const snapRows = snapshotEntries(row.snapshot as Record<string, unknown> | undefined);

  return (
    <li className={`dsc-journal-row${highlighted ? " dsc-journal-row--highlight" : ""}`}>
      <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
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
    </li>
  );
}
