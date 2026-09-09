import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Icon, StatusChip } from "../ui";
import { fetchJournalActions, formatMediaBytes, uploadJournalMedia } from "../../lib/journalMediaApi";
import type { JournalAction, JournalPostBody } from "../../types/journal";

/** Pass S6 — the grow-journal entry composer: what happened, the numbers, and a photo.
 *
 * Three things the old note-only box could not do, in the order a grower needs them:
 *
 * 1. **Say what the entry IS.** A journal of prose cannot be counted or charted; "Water ·
 *    2 L · pH 6.2" can. The action list comes from the brain so an operator-defined type
 *    shows up here without a rebuild.
 * 2. **Carry the numbers as numbers.** Fields are declared by the action, so runoff pH
 *    lands in a field a chart can read later rather than inside a sentence.
 * 3. **Attach a photo.** Every entry is already sensor-backed; the picture is the one thing
 *    the kit cannot record for itself.
 *
 * The photo is uploaded AFTER the entry is saved, because media rows hang off an entry id.
 * That ordering is why a failed upload leaves the written entry intact and says so, rather
 * than throwing away what the operator typed.
 */

const NOTE_ONLY_ACTION = "note";

export function EntryComposer({
  scopeKind,
  scopeId,
  enabled,
  busy,
  onSave,
  composeLabel,
  saveLabel,
  placeholder,
  defaultTags,
  occurredAt,
  onComplete,
}: {
  scopeKind: string;
  scopeId?: string;
  enabled: boolean;
  busy: boolean;
  /** Saves the entry and resolves with its new id so a photo can be attached to it. */
  onSave: (body: JournalPostBody) => Promise<number | null>;
  composeLabel: string;
  saveLabel: string;
  placeholder: string;
  defaultTags: string[];
  /** Epoch seconds for a back-dated entry; undefined means "now". */
  occurredAt?: number;
  /** Fired once the entry AND its photo have landed, so the list can re-read with media. */
  onComplete?: () => void;
}) {
  // Typed actions are a PLANT concept — watering, feeding, transplanting happen to a plant.
  // Tent/room/core journals are observations about a space, and their brain routes store no
  // action, so offering the picker there would have silently dropped the numbers the
  // operator typed (a Room "Water · 2.5 L" saved as an empty note — caught in review).
  // Photos work on every scope, so the attachment stays.
  const typedActions = scopeKind === "plant";
  const [actions, setActions] = useState<JournalAction[]>([]);
  const [actionId, setActionId] = useState(NOTE_ONLY_ACTION);
  const [note, setNote] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoErr, setPhotoErr] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!typedActions) return undefined;
    let alive = true;
    fetchJournalActions()
      .then((rows) => {
        if (alive) setActions(rows);
      })
      // An unreachable catalogue is not a reason to block writing a note — the composer
      // falls back to note-only, which is exactly what it was before this pass.
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [typedActions]);

  const action = useMemo(
    () => actions.find((a) => a.id === actionId) ?? null,
    [actions, actionId],
  );
  const fields = action?.fields ?? [];

  // A note needs text. A typed action is meaningful with only its numbers filled in — a
  // watering with an amount and no prose is a complete entry.
  const hasContent =
    note.trim().length > 0 ||
    (actionId !== NOTE_ONLY_ACTION && fields.some((f) => String(values[f.id] ?? "").trim()));

  const reset = () => {
    setNote("");
    setValues({});
    setPhoto(null);
    setPhotoErr(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async () => {
    if (!hasContent || !enabled || saving) return;
    setSaving(true);
    setSaveErr(null);
    setPhotoErr(null);
    try {
      const numeric: Record<string, string | number> = {};
      for (const f of fields) {
        const raw = String(values[f.id] ?? "").trim();
        if (!raw) continue;
        numeric[f.id] = f.kind === "number" ? Number(raw) : raw;
      }
      const entryId = await onSave({
        note: note.trim(),
        occurred_at: occurredAt,
        tags: defaultTags,
        action: actionId,
        fields: numeric,
      });

      if (photo && entryId != null) {
        try {
          await uploadJournalMedia(scopeKind, entryId, photo, { scopeId });
        } catch (e) {
          // The entry is already written. Say the photo failed and keep the rest — losing
          // a saved entry because its picture bounced would be the worse outcome.
          setPhotoErr(
            `${e instanceof Error ? e.message : "the photo could not be attached"} — the entry itself was saved.`,
          );
          setPhoto(null);
          if (fileRef.current) fileRef.current.value = "";
          return;
        }
      }
      reset();
      // The save path already reloaded the list, but that happened BEFORE the photo was
      // uploaded — without this the new entry would render without its picture until
      // something else refreshed.
      onComplete?.();
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const working = busy || saving;

  return (
    <div className="dsc-composer">
      {actions.length ? (
        <div className="dsc-composer-actions" role="group" aria-label="Entry type">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`dsc-composer-action${a.id === actionId ? " is-active" : ""}`}
              aria-pressed={a.id === actionId}
              onClick={() => {
                setActionId(a.id);
                setValues({});
              }}
              title={a.snapshot ? `${a.label} — freezes the room's readings` : a.label}
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : null}

      {fields.length ? (
        <div className="dsc-composer-fields">
          {fields.map((f) => (
            <label key={f.id} className="dsc-composer-field">
              <span>
                {f.label}
                {f.unit ? <em className="dsc-muted"> {f.unit}</em> : null}
              </span>
              {f.kind === "choice" ? (
                <select
                  value={values[f.id] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                >
                  <option value="">—</option>
                  {(f.choices ?? []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.kind === "number" ? "number" : "text"}
                  inputMode={f.kind === "number" ? "decimal" : undefined}
                  step={f.step}
                  min={f.min}
                  max={f.max}
                  value={values[f.id] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                  placeholder="—"
                />
              )}
            </label>
          ))}
        </div>
      ) : null}

      <label className="dsc-seat-editors">
        {composeLabel}
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            // Enter submits, Shift+Enter keeps its newline — unchanged from the note-only box.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (hasContent && !working) void submit();
            }
          }}
          placeholder={placeholder}
        />
      </label>

      <div className="dsc-chip-row" style={{ marginTop: 8 }}>
        <Button teal disabled={!hasContent || !enabled} busy={working} onClick={() => void submit()}>
          {saveLabel}
        </Button>

        {/* capture="environment" opens the rear camera straight from a phone, which is
            where most grow-journal photos are actually taken. */}
        <input
          ref={fileRef}
          id="dsc-journal-photo"
          className="dsc-visually-hidden"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            setPhotoErr(null);
            setPhoto(e.target.files?.[0] ?? null);
          }}
        />
        <label htmlFor="dsc-journal-photo" className="dsc-composer-photo">
          <Icon name="camera-monitor" size={14} />
          {photo ? "Change photo" : "Add photo"}
        </label>

        {photo ? (
          <>
            <StatusChip
              label={`${photo.name.slice(0, 28)} · ${formatMediaBytes(photo.size)}`}
              tone="muted"
              title="Attached after the entry saves"
            />
            <button
              type="button"
              className="dsc-linkish"
              onClick={() => {
                setPhoto(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              Remove
            </button>
          </>
        ) : null}

        {action?.snapshot ? (
          <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
            Freezes the room&apos;s readings with this entry.
          </span>
        ) : null}

        {!hasContent && !working ? (
          <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
            {actionId === NOTE_ONLY_ACTION ? "Add text to enable Save" : "Add a number or a note to enable Save"}
          </span>
        ) : null}
      </div>

      {saveErr ? <p className="dsc-honesty">{saveErr}</p> : null}
      {photoErr ? <p className="dsc-honesty">{photoErr}</p> : null}
    </div>
  );
}
