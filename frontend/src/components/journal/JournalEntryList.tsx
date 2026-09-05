import { useMemo, type CSSProperties, type Ref } from "react";
import type { JournalEntry, JournalListVariant, JournalScope } from "../../types/journal";
import { collapseConsecutiveSystemDuplicates, journalRowKey } from "./journalFormat";
import { JournalEntryRow } from "./JournalEntryRow";

export type JournalEntryListProps = {
  entries: JournalEntry[];
  variant?: JournalListVariant;
  scope?: JournalScope;
  /** Embedded: approximate visible rows before scroll (default 3). */
  visibleRows?: number;
  /** Embedded: max rows in scroll container — all fetched entries render (default 10). */
  scrollMaxRows?: number;
  emptyMessage?: string;
  highlightEntryId?: number | null;
  compareMode?: boolean;
  compareIds?: number[];
  onCompareToggle?: (row: JournalEntry) => void;
  onEntryOpen?: (row: JournalEntry) => void;
  highlightRowRef?: Ref<HTMLLIElement>;
};

export function JournalEntryList({
  entries,
  variant = "full",
  scope,
  visibleRows = 3,
  scrollMaxRows = 10,
  emptyMessage = "No journal rows yet.",
  highlightEntryId = null,
  compareMode = false,
  compareIds = [],
  onCompareToggle,
  onEntryOpen,
  highlightRowRef,
}: JournalEntryListProps) {
  const embedded = variant === "embedded";
  const listClass = embedded
    ? "dsc-journal-list dsc-journal-teaser-scroll"
    : "dsc-journal-list";
  const displayEntries = useMemo(() => collapseConsecutiveSystemDuplicates(entries), [entries]);

  const scrollStyle =
    embedded && scrollMaxRows > 0
      ? ({
          ["--dsc-journal-scroll-max-rows" as string]: String(scrollMaxRows),
          ["--dsc-journal-visible-rows" as string]: String(visibleRows),
        } as CSSProperties)
      : undefined;

  return (
    <ul className={listClass} style={scrollStyle}>
      {displayEntries.map((row) => {
        const isUrlHighlight = highlightEntryId != null && row.id === highlightEntryId;
        return (
          <JournalEntryRow
            key={journalRowKey(row)}
            row={row}
            scope={scope}
            urlHighlighted={isUrlHighlight}
            compareMode={compareMode}
            compareSelected={compareIds.includes(row.id)}
            onCompareToggle={onCompareToggle}
            onOpen={onEntryOpen}
            rowRef={isUrlHighlight ? highlightRowRef : undefined}
          />
        );
      })}
      {!entries.length ? (
        <li className="dsc-muted" style={{ fontSize: 13 }}>
          {emptyMessage}
        </li>
      ) : null}
    </ul>
  );
}
