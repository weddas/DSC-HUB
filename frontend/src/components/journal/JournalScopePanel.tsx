import { useCallback, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { Button, Card, StatusChip } from "../ui";

import { useJournalScope } from "../../hooks/useJournalScope";

import type { JournalEntry } from "../../types/journal";

import { journalScopeToLogsHref } from "../../lib/journalApi";

import type { JournalScope } from "../../types/journal";

import { JournalEntryDetail } from "./JournalEntryDetail";

import { JournalEntryList } from "./JournalEntryList";

import { fromLocalInputValue, toLocalInputValue } from "./journalFormat";



export type JournalFullBrowserProps = {

  highlightEntryId?: number | null;

  compareMode?: boolean;

  compareIds?: number[];

  onCompareIdsChange?: (ids: number[]) => void;

  onCompareEntry?: (entry: JournalEntry) => void;

  onEntriesChange?: (entries: JournalEntry[]) => void;

  detailEntry?: JournalEntry | null;

  onDetailEntryChange?: (entry: JournalEntry | null) => void;

  onChartMoment?: (entry: JournalEntry) => void;

};



export type JournalScopePanelProps = {

  scope: JournalScope;

  variant: "embedded" | "full";

  fetchLimit?: number;

  visibleRows?: number;

  scrollMaxRows?: number;

  showCompose?: boolean;

  footerHref?: string;

  title?: string;

  help?: string;

  fullBrowser?: JournalFullBrowserProps;

};



type ScopeCopy = { title: string; help: string; composeLabel: string; saveLabel: string; defaultTags: string[] };



function scopeCopy(scope: JournalScope): ScopeCopy {

  switch (scope.kind) {

    case "plant":

      return {

        title: "Plant journal",

        help: "Operator observations only — not diagnoses. Lighting stays on the tent, not this plant card.",

        composeLabel: "Note",

        saveLabel: "Save",

        defaultTags: ["observation"],

      };

    case "space": {

      const label = scope.id === "2x4" ? "2×4" : scope.id === "4x8" ? "4×8" : scope.id || "Tent";

      return {

        title: `${label} occupancy journal`,

        help: "Space-native notes plus rolled-up plant journal rows. Provenance chips mark plant vs tent.",

        composeLabel: "Tent note",

        saveLabel: "Save tent note",

        defaultTags: ["space"],

      };

    }

    case "room":

      return {

        title: "Grow room journal",

        help: "Room-native notes plus rollup of child tents and plants. Provenance chips mark room vs tent vs plant — observations only, not diagnoses.",

        composeLabel: "Room note",

        saveLabel: "Save room note",

        defaultTags: ["room"],

      };

    case "core":

      return {

        title: "DSC-Core journal",

        help: "Facility / system layer — Core-native notes plus rollup of rooms, tents, and plants.",

        composeLabel: "Core note",

        saveLabel: "Save Core note",

        defaultTags: ["facility"],

      };

    default:

      return {

        title: "Journal",

        help: "Operator observations only.",

        composeLabel: "Note",

        saveLabel: "Save",

        defaultTags: [],

      };

  }

}



function toggleCompareId(ids: number[], entryId: number): number[] {

  if (ids.includes(entryId)) return ids.filter((id) => id !== entryId);

  if (ids.length >= 2) return [ids[1], entryId];

  return [...ids, entryId];

}



export function JournalScopePanel({

  scope,

  variant,

  fetchLimit,

  visibleRows = 3,

  scrollMaxRows = 10,

  showCompose = true,

  footerHref,

  title,

  help,

  fullBrowser,

}: JournalScopePanelProps) {

  const embedded = variant === "embedded";

  const pageSize = fetchLimit ?? (embedded ? 10 : 50);

  const copy = scopeCopy(scope);

  const plantReady = scope.kind !== "plant" || Boolean(scope.id?.trim());

  const enabled = scope.kind !== "grow_log" && plantReady;



  const [pageOffset, setPageOffset] = useState(0);

  const [mergedEntries, setMergedEntries] = useState<JournalEntry[]>([]);

  const highlightRowRef = useRef<HTMLLIElement | null>(null);



  useEffect(() => {

    setPageOffset(0);

    setMergedEntries([]);

  }, [scope.kind, scope.id]);



  const { entries, total, loading, error, save, update, remove } = useJournalScope(scope, {

    limit: pageSize,

    offset: pageOffset,

    enabled,

  });



  useEffect(() => {

    if (embedded) return;

    if (pageOffset === 0) {

      setMergedEntries(entries);

      return;

    }

    if (!entries.length) return;

    setMergedEntries((prev) => {

      const seen = new Set(prev.map((row) => row.id));

      return [...prev, ...entries.filter((row) => !seen.has(row.id))];

    });

  }, [embedded, entries, pageOffset]);



  const listEntries = embedded ? entries : mergedEntries;

  const hasMore = !embedded && enabled && listEntries.length < total;



  const resetPagination = useCallback(() => {

    setPageOffset(0);

    setMergedEntries([]);

  }, []);



  const wrappedUpdate = useCallback(

    async (entryId: number, body: Parameters<typeof update>[1]) => {

      resetPagination();

      return update(entryId, body);

    },

    [update, resetPagination],

  );



  const wrappedRemove = useCallback(

    async (entryId: number) => {

      resetPagination();

      await remove(entryId);

    },

    [remove, resetPagination],

  );



  const [note, setNote] = useState("");

  const [when, setWhen] = useState(() => toLocalInputValue(Date.now() / 1000));

  const [busy, setBusy] = useState(false);

  const [saveErr, setSaveErr] = useState<string | null>(null);



  const logsHref = footerHref ?? journalScopeToLogsHref(scope);



  const highlightEntryId = fullBrowser?.highlightEntryId ?? null;

  const compareMode = fullBrowser?.compareMode ?? false;

  const compareIds = fullBrowser?.compareIds ?? [];

  const detailEntry = fullBrowser?.detailEntry ?? null;

  const onDetailEntryChange = fullBrowser?.onDetailEntryChange;

  const onCompareIdsChange = fullBrowser?.onCompareIdsChange;
  const onCompareEntry = fullBrowser?.onCompareEntry;
  const onEntriesChange = fullBrowser?.onEntriesChange;
  const onChartMoment = fullBrowser?.onChartMoment;

  useEffect(() => {
    if (!embedded && onEntriesChange) {
      onEntriesChange(listEntries);
    }
  }, [embedded, listEntries, onEntriesChange]);



  useEffect(() => {

    if (embedded || highlightEntryId == null) return;

    const t = window.setTimeout(() => {

      highlightRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    }, 120);

    return () => window.clearTimeout(t);

  }, [embedded, highlightEntryId, listEntries.length]);



  const onCompareToggle = (row: JournalEntry) => {

    onCompareEntry?.(row);

    if (!onCompareIdsChange) return;

    onCompareIdsChange(toggleCompareId(compareIds, row.id));

  };



  const onEntryOpen = (row: JournalEntry) => {

    onDetailEntryChange?.(row);

  };



  const onSave = async () => {

    if (!note.trim() || !enabled) return;

    setBusy(true);

    setSaveErr(null);

    try {

      await save({

        note: note.trim(),

        occurred_at: scope.kind === "plant" ? fromLocalInputValue(when) : undefined,

        tags: copy.defaultTags,

      });

      setNote("");

      resetPagination();

    } catch (e) {

      setSaveErr(e instanceof Error ? e.message : "Save failed");

    } finally {

      setBusy(false);

    }

  };



  if (scope.kind === "plant" && !scope.id?.trim()) {

    return (

      <Card className="dsc-glass" title={title ?? copy.title}>

        <p className="dsc-muted" style={{ margin: 0, fontSize: 13 }}>

          Assign a plant to this probe to keep a mini journal that follows the plant.

        </p>

      </Card>

    );

  }



  if (scope.kind === "grow_log") {

    return (

      <Card className="dsc-glass" title="Grow log">

        <p className="dsc-muted" style={{ margin: 0, fontSize: 13 }}>

          Operational messages — opens on Grow → Logs grow log tab.

        </p>

      </Card>

    );

  }



  return (

    <>

      <Card className="dsc-glass" title={title ?? copy.title}>

        <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>

          {help ?? copy.help}

        </p>



        {showCompose ? (

          <>

            {scope.kind === "plant" ? (

              <label className="dsc-seat-editors">

                When

                <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />

              </label>

            ) : null}

            <label className="dsc-seat-editors" style={{ marginTop: scope.kind === "plant" ? 8 : 0 }}>

              {copy.composeLabel}

              <textarea

                rows={2}

                value={note}

                onChange={(e) => setNote(e.target.value)}

                placeholder={

                  scope.kind === "plant"

                    ? "What you saw (observation, not a diagnosis)"

                    : `${copy.composeLabel} observation`

                }

              />

            </label>

            <div className="dsc-chip-row" style={{ marginTop: 8 }}>

              <Button teal disabled={!note.trim()} busy={busy} onClick={() => void onSave()}>

                {copy.saveLabel}

              </Button>

              {!note.trim() && !busy ? (

                <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>

                  Add text to enable Save

                </span>

              ) : null}

              {saveErr ? <StatusChip label={saveErr} tone="bad" /> : null}

            </div>

          </>

        ) : null}



        {loading && !listEntries.length ? (

          <p className="dsc-muted" style={{ margin: "12px 0 0", fontSize: 13 }}>

            Loading journal…

          </p>

        ) : null}

        {error ? <StatusChip label={error} tone="bad" /> : null}



        <JournalEntryList

          entries={listEntries}

          variant={variant}

          scope={scope}

          visibleRows={visibleRows}

          scrollMaxRows={scrollMaxRows}

          emptyMessage={loading ? " " : "No journal rows yet."}

          highlightEntryId={!embedded ? highlightEntryId : null}

          compareMode={!embedded && compareMode}

          compareIds={compareIds}

          onCompareToggle={!embedded && compareMode ? onCompareToggle : undefined}

          onEntryOpen={!embedded && !compareMode ? onEntryOpen : undefined}

          highlightRowRef={highlightRowRef}

        />



        {hasMore ? (

          <div className="dsc-chip-row" style={{ marginTop: 10 }}>

            <Button busy={loading} onClick={() => setPageOffset((o) => o + pageSize)}>

              Load more

            </Button>

            <span className="dsc-muted" style={{ fontSize: 12 }}>

              {listEntries.length} of {total}

            </span>

          </div>

        ) : null}



        {embedded ? (

          <p style={{ margin: "10px 0 0", fontSize: 13 }}>

            <Link to={logsHref}>Open full journal</Link>

          </p>

        ) : null}

      </Card>



      {!embedded && detailEntry ? (

        <JournalEntryDetail

          open={Boolean(detailEntry)}

          entry={detailEntry}

          scope={scope}

          onClose={() => onDetailEntryChange?.(null)}

          onDeleted={() => onDetailEntryChange?.(null)}

          onChartMoment={onChartMoment}

          update={wrappedUpdate}

          remove={wrappedRemove}

        />

      ) : null}

    </>

  );

}

