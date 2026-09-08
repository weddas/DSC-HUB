import { useEffect, useRef, useState } from "react";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { Button, StatusChip, timeToInput, timeToService } from "./ui";
import type { TentId } from "../lib/probeModel";

type Tent = Exclude<TentId, "unassigned">;

const SCHEDULE_ENTITIES: Record<Tent, { onTime: string; hours: string }> = {
  main: { onTime: "time.dsc_hub_lights_on_time", hours: "sensor.dsc_expected_light_hours" },
  clone: { onTime: "time.dsc_hub_clone_lights_on_time", hours: "number.dsc_hub_clone_light_hours" },
};

function minutesOf(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(min) || h > 23 || min > 59) return null;
  return h * 60 + min;
}

function clockOf(totalMin: number): string {
  const m = ((Math.round(totalMin) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/**
 * Re-anchor a tent's running photoperiod window.
 *
 * The store is (lights-on clock + want hours); lights-off is derived. So an operator who needs
 * "lights off at 03:00" has no field to type it into — they have to do the subtraction in their
 * head and edit the on-time. This edits from either end: whichever end you set, the other is
 * recomputed from the stage's want hours and previewed before anything is written.
 *
 * This is deliberately an immediate re-anchor, not a slide. The gradual path already exists as
 * approve-only shift plans (brain/dsc_brain/schedule_shift.py) which step 15-30 min a day; that
 * is the right tool for moving a flowering room without stressing it, and the wrong tool when
 * you have been running plants on other lights and need the schedule to match reality tonight.
 */
export function ScheduleOverride({
  tent,
  disabled,
  disabledReason,
}: {
  tent: Tent;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const { state, num } = useEntityBus();
  const { callService } = useFleetActions();
  const e = SCHEDULE_ENTITIES[tent];

  const liveOn = timeToInput(state(e.onTime, ""));
  const wantHours = num(e.hours);
  const hasWindow = Boolean(liveOn) && Number.isFinite(wantHours) && wantHours > 0;

  const [draftOn, setDraftOn] = useState(liveOn);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    if (!touched.current) setDraftOn(liveOn);
  }, [liveOn]);

  const onMin = minutesOf(draftOn);
  const offMin = onMin != null && hasWindow ? onMin + wantHours * 60 : null;
  const draftOff = offMin != null ? clockOf(offMin) : "";
  const liveOnMin = minutesOf(liveOn);
  const shifted = onMin != null && liveOnMin != null && onMin !== liveOnMin;

  const setFromOff = (value: string) => {
    const off = minutesOf(value);
    if (off == null || !Number.isFinite(wantHours)) return;
    touched.current = true;
    setDraftOn(clockOf(off - wantHours * 60));
  };

  const apply = async () => {
    if (!draftOn || busy || disabled) return;
    setBusy(true);
    setNote(null);
    try {
      await callService("time", "set_value", {
        entity_id: e.onTime,
        time: timeToService(draftOn),
      });
      touched.current = false;
      setNote(`Window re-anchored to ${draftOn} → ${draftOff}`);
    } catch {
      setNote("Write failed — schedule unchanged");
    } finally {
      setBusy(false);
    }
  };

  const revert = () => {
    touched.current = false;
    setDraftOn(liveOn);
    setNote(null);
  };

  if (disabled) {
    return (
      <div className="dsc-schedule-override is-disabled">
        <StatusChip icon="lighting" label="Window follows 4×8" tone="muted" />
        <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", margin: "6px 0 0" }}>
          {disabledReason ?? "This tent mirrors the 4×8 schedule. Re-anchor the 4×8 window instead."}
        </p>
      </div>
    );
  }

  if (!hasWindow) {
    return (
      <div className="dsc-schedule-override">
        <StatusChip icon="alert" label="No window to re-anchor" tone="warn" />
        <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", margin: "6px 0 0" }}>
          {!liveOn ? "Lights-on time is unset." : "Want hours unset for this tent's stage."} Set both on
          Light before re-syncing.
        </p>
      </div>
    );
  }

  return (
    <div className="dsc-schedule-override">
      <div className="dsc-schedule-override-head">
        <StatusChip icon="lighting" label={`Now ${liveOn} → ${clockOf((liveOnMin ?? 0) + wantHours * 60)}`} tone="muted" />
        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
          {wantHours}h rail — set either end, the other follows.
        </span>
      </div>
      <div className="dsc-target-grid">
        <label className="dsc-target-num">
          <span className="dsc-target-num-label">Lights on</span>
          <input
            type="time"
            value={draftOn}
            onChange={(ev) => {
              touched.current = true;
              setDraftOn(ev.target.value);
            }}
          />
          <span className="dsc-target-hint">start of the lit window</span>
        </label>
        <label className="dsc-target-num">
          <span className="dsc-target-num-label">Lights off</span>
          <input type="time" value={draftOff} onChange={(ev) => setFromOff(ev.target.value)} />
          <span className="dsc-target-hint">derived from {wantHours}h</span>
        </label>
      </div>
      {shifted ? (
        <div className="dsc-chip-row" style={{ marginTop: 8 }}>
          <StatusChip
            icon="alert"
            label={`Pending ${liveOn} → ${draftOn}`}
            tone="warn"
          />
          <Button onClick={apply} disabled={busy}>
            {busy ? "Applying…" : "Apply now"}
          </Button>
          <Button onClick={revert} disabled={busy}>
            Cancel
          </Button>
        </div>
      ) : null}
      {note ? (
        <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", margin: "8px 0 0" }}>
          {note}
        </p>
      ) : null}
      <p className="dsc-honesty" style={{ margin: "8px 0 0" }}>
        Applies immediately and takes effect at the next boundary — the lamp is not forced on or off
        now. To move a flowering room gradually instead, use an approve-only slide plan.
      </p>
    </div>
  );
}
