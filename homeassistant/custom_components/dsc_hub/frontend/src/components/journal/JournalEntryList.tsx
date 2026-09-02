import type { CSSProperties } from "react";
import type { JournalEntry, JournalListVariant } from "../../types/journal";
import { journalRowKey } from "./journalFormat";
import { JournalEntryRow } from "./JournalEntryRow";

export type JournalEntryListProps = {
  entries: JournalEntry[];
  variant?: JournalListVariant;
  /** Embedded: approximate visible rows before scroll (default 3). */
  visibleRows?: number;
  /** Embedded: max rows in scroll container — all fetched entries render (default 10). */
  scrollMaxRows?: number;
  emptyMessage?: string;
};

export function JournalEntryList({
  entries,
  variant = "full",
  visibleRows = 3,
  scrollMaxRows = 10,
  emptyMessage = "No journal rows yet.",
}: JournalEntryListProps) {
  const embedded = variant === "embedded";
  const listClass = embedded
    ? "dsc-journal-list dsc-journal-teaser-scroll"
    : "dsc-journal-list";

  const scrollStyle =
    embedded && scrollMaxRows > 0
      ? ({
          ["--dsc-journal-scroll-max-rows" as string]: String(scrollMaxRows),
          ["--dsc-journal-visible-rows" as string]: String(visibleRows),
        } as CSSProperties)
      : undefined;

  return (
    <ul className={listClass} style={scrollStyle}>
      {entries.map((row) => (
        <JournalEntryRow key={journalRowKey(row)} row={row} />
      ))}
      {!entries.length ? (
        <li className="dsc-muted" style={{ fontSize: 13 }}>
          {emptyMessage}
        </li>
      ) : null}
    </ul>
  );
}
