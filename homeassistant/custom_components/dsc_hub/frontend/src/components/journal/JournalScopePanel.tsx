import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, StatusChip } from "../ui";
import { useJournalScope } from "../../hooks/useJournalScope";
import { journalScopeToLogsHref } from "../../lib/journalApi";
import type { JournalScope } from "../../types/journal";
import { JournalEntryList } from "./JournalEntryList";
import { fromLocalInputValue, toLocalInputValue } from "./journalFormat";

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
}: JournalScopePanelProps) {
  const embedded = variant === "embedded";
  const limit = fetchLimit ?? (embedded ? 10 : 50);
  const copy = scopeCopy(scope);
  const plantReady = scope.kind !== "plant" || Boolean(scope.id?.trim());
  const enabled = scope.kind !== "grow_log" && plantReady;

  const { entries, loading, error, save } = useJournalScope(scope, { limit, offset: 0, enabled });

  const [note, setNote] = useState("");
  const [when, setWhen] = useState(() => toLocalInputValue(Date.now() / 1000));
  const [busy, setBusy] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const logsHref = footerHref ?? journalScopeToLogsHref(scope);

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
            <Button teal disabled={busy || !note.trim()} onClick={() => void onSave()}>
              {copy.saveLabel}
            </Button>
            {!note.trim() && !busy ? (
              <span className="dsc-muted" style={{ fontSize: 12 }}>
                Add text to enable Save
              </span>
            ) : null}
            {busy ? (
              <span className="dsc-muted" style={{ fontSize: 12 }}>
                Saving…
              </span>
            ) : null}
            {saveErr ? <StatusChip label={saveErr} tone="bad" /> : null}
          </div>
        </>
      ) : null}

      {loading && !entries.length ? (
        <p className="dsc-muted" style={{ margin: "12px 0 0", fontSize: 13 }}>
          Loading journal…
        </p>
      ) : null}
      {error ? <StatusChip label={error} tone="bad" /> : null}

      <JournalEntryList
        entries={entries}
        variant={variant}
        visibleRows={visibleRows}
        scrollMaxRows={scrollMaxRows}
        emptyMessage={loading ? " " : "No journal rows yet."}
      />

      {embedded ? (
        <p style={{ margin: "10px 0 0", fontSize: 13 }}>
          <Link to={logsHref}>Open full journal</Link>
        </p>
      ) : null}
    </Card>
  );
}
