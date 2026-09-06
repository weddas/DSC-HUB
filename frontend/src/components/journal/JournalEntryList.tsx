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
  /** Hide source==="system" rows (schedule slides, re-asserts, etc.). */
  hideSystem?: boolean;
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
  hideSystem = false,
}: JournalEntryListProps) {
  const embedded = variant === "embedded";
  const listClass = embedded
    ? "dsc-journal-list dsc-journal-teaser-scroll"
    : "dsc-journal-list";
  const systemCount = useMemo(
    () => entries.filter((e) => e.source === "system").length,
    [entries],
  );
  const displayEntries = useMemo(() => {
    const src = hideSystem ? entries.filter((e) => e.source !== "system") : entries;
    return collapseConsecutiveSystemDuplicates(src);
  }, [entries, hideSystem]);

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
      {hideSystem && systemCount > 0 ? (
        <li className="dsc-muted" style={{ fontSize: "var(--dsc-fs-xs)" }}>
          {systemCount} system row{systemCount > 1 ? "s" : ""} hidden
        </li>
      ) : null}
      {!entries.length ? (
        <li className="dsc-muted" style={{ fontSize: "var(--dsc-fs-md)" }}>
          {emptyMessage}
        </li>
      ) : null}
    </ul>
  );
}
