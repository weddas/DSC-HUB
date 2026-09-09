import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { call_service, clear_calibration, fan_calibration_summary, type FanCalTarget } from "../lib/fleetApi";
import { useEntityBus } from "../hooks/useEntityBus";

/** Load the per-duct calibration state. Shared by the record card and the fan wizard. */
export function useFanCalSummary() {
  const [targets, setTargets] = useState<FanCalTarget[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await fan_calibration_summary();
      setTargets(data.targets);
      setError("");
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not read calibration state");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { targets, error, reload: load };
}

/**
 * Duct diameter for one target — the number that turns m/s into CFM.
 *
 * It has to be editable next to the wizard: get it wrong and every point scales with the
 * square of the error, silently. These helpers existed in the UI for a long time but had
 * never held a value on any host, so nothing could have converted even if it had tried.
 */
/**
 * Common inline-duct sizes. The trade sells duct by inches; the operator measures in mm.
 * Both are shown because a grower knows their run as "6 inch" and their tape measure does not.
 */
export const COMMON_DUCT_MM = [100, 125, 150, 200, 250, 300] as const;

const INCH_LABEL: Record<number, string> = {
  100: '4"',
  125: '5"',
  150: '6"',
  200: '8"',
  250: '10"',
  300: '12"',
};

export function DuctSizeField({ target, onSaved }: { target: FanCalTarget; onSaved: () => void }) {
  // mm is the operator's unit. The helper behind this is still cm (that is what the m/s to
  // CFM conversion reads), so mm is the UI unit and cm is the wire unit, converted here.
  const storedMm = target.duct_cm ? Math.round(target.duct_cm * 10) : 0;
  const [draft, setDraft] = useState(storedMm ? String(storedMm) : "");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  // The wizard reuses one instance of this field across duct selections, so switching from
  // a 6" duct to a 4" one left 152 sitting in the box — one click from writing it onto
  // the 4" intake and silently doubling every reading. Reset the draft when the target
  // changes (adjusting state during render, rather than an effect that paints stale first).
  const [seenPrefix, setSeenPrefix] = useState(target.cal_prefix);
  if (seenPrefix !== target.cal_prefix) {
    setSeenPrefix(target.cal_prefix);
    setDraft(storedMm ? String(storedMm) : "");
    setNote("");
  }

  const save = async (mmValue: number) => {
    if (!Number.isFinite(mmValue) || mmValue < 40 || mmValue > 600) {
      setNote("Enter a duct diameter in mm — 40 to 600 (100 mm is 4\", 150 mm is 6\").");
      return;
    }
    setBusy(true);
    try {
      await call_service("input_number", "set_value", {
        entity_id: target.duct_entity,
        value: Number((mmValue / 10).toFixed(2)),
      });
      setDraft(String(mmValue));
      setNote(`Saved ${mmValue} mm.`);
      onSaved();
    } catch (exc) {
      setNote(exc instanceof Error ? exc.message : "Could not save duct size");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="dsc-kpi-sub" style={{ margin: "0 0 6px" }}>
        {target.label} duct — pick a common size or enter your own.
      </p>
      <div className="dsc-chip-row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {COMMON_DUCT_MM.map((mm) => (
          <button
            key={mm}
            type="button"
            className={`dsc-chip${storedMm === mm ? " dsc-chip--ok" : ""}`}
            disabled={busy}
            onClick={() => void save(mm)}
          >
            {INCH_LABEL[mm]} · {mm} mm
          </button>
        ))}
      </div>
      <label>
        Custom diameter (mm)
        <input
          type="number"
          step="1"
          min="40"
          max="600"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. 160"
        />
      </label>
      <div className="dsc-row-actions" style={{ marginTop: 6 }}>
        <Button variant="secondary" disabled={busy} onClick={() => void save(Number(draft))}>
          Save duct size
        </Button>
      </div>
      {note ? <p className="dsc-kpi-sub">{note}</p> : null}
      {/* Measure the inside of the duct. Trade sizes name the nominal bore, but a reducer or
          an insulated sleeve can leave the actual airway smaller than the label. */}
      <p className="dsc-kpi-sub" style={{ margin: "4px 0 0" }}>
        Use the internal diameter of the duct the anemometer sits in — a reducer or a liner
        makes the real airway smaller than the size printed on the sleeve.
      </p>
    </div>
  );
}

/**
 * What the last calibration actually was, and whether it is doing anything.
 *
 * The desk used to show only `cfm_curves_status` ("1/4 curves"), which answers neither
 * question an operator has after calibrating: *did mine save*, and *is it being used*. A
 * stored calibration the curve gate rejects is silent — the fan falls back to its nameplate
 * and nothing on screen says so. The live 2x4 intake sat in exactly that state for days.
 *
 * `in_use` is the brain's own verdict, read through the same helpers that compute the
 * airflow numbers, so this card cannot disagree with the CFM figures beside it.
 */
function whenText(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TargetRow({ target, onCleared }: { target: FanCalTarget; onCleared: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const doClear = async () => {
    setBusy(true);
    setError("");
    try {
      await clear_calibration(target.device_id);
      setConfirm(false);
      onCleared();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Clear failed");
    } finally {
      setBusy(false);
    }
  };

  const tone = !target.calibrated ? "muted" : target.in_use ? "ok" : "warn";
  const chip = !target.calibrated ? "Never calibrated" : target.in_use ? "In use" : "Stored · not used";

  return (
    <div className="dsc-cal-record-row" style={{ padding: "10px 0", borderTop: "1px solid var(--dsc-hairline)" }}>
      <div className="dsc-chip-row" style={{ alignItems: "center", gap: 8 }}>
        <strong>{target.label}</strong>
        <StatusChip label={chip} tone={tone} />
        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
          rated {target.nameplate_cfm || "—"} CFM · {target.duct_cm ? `${Math.round(target.duct_cm * 10)} mm` : "—"} duct
        </span>
      </div>

      {target.calibrated ? (
        <>
          <p className="dsc-kpi-sub" style={{ margin: "6px 0 4px" }}>
            {target.last_calibrated_at
              ? `Last calibrated ${whenText(target.last_calibrated_at)}`
              : "Captured before calibrations were timestamped — no date recorded"}
          </p>
          {/* Not .dsc-chip: that uppercases its label, and "M/S" is not a unit. */}
          <div className="dsc-chip-row" style={{ gap: 6, flexWrap: "wrap" }}>
            {target.steps.map((s) => (
              <span key={s.step_pct} className="dsc-cal-point">
                {s.step_pct}% → {s.measured_value}
                {s.unit ? ` ${s.unit}` : ""}
              </span>
            ))}
          </div>
          {target.pct_of_nameplate != null ? (
            <p className="dsc-kpi-sub" style={{ margin: "6px 0 0" }}>
              Top reading {target.measured_top} = {target.pct_of_nameplate}% of the fan's rating.
            </p>
          ) : null}
          {/* The curve is consumed as CFM. A stored unit of anything else is the defect. */}
          {target.stored_unit && target.stored_unit !== "CFM" ? (
            <p className="dsc-honesty" style={{ marginTop: 6 }}>
              Stored as <strong>{target.stored_unit}</strong>, but the airflow model reads this curve as
              CFM — these points are not the same quantity.
            </p>
          ) : null}
          {!target.in_use && target.why_not ? (
            <p className="dsc-honesty" style={{ marginTop: 6 }}>
              <strong>Not used:</strong> {target.why_not}
            </p>
          ) : null}
        </>
      ) : (
        <p className="dsc-kpi-sub" style={{ margin: "6px 0 0" }}>
          No points stored — airflow for this duct comes from the fan's rated capacity.
        </p>
      )}

      {error ? (
        <p className="dsc-honesty" style={{ marginTop: 6 }}>
          {error}
        </p>
      ) : null}

      {target.calibrated ? (
        <div className="dsc-row-actions" style={{ marginTop: 8 }}>
          <Button variant="secondary" disabled={busy} onClick={() => setConfirm(true)}>
            Clear {target.label} calibration
          </Button>
        </div>
      ) : null}

      <DecisionLayer
        open={confirm}
        busy={busy}
        onDismiss={() => setConfirm(false)}
        onConfirm={() => void doClear()}
        title={`Clear ${target.label} calibration`}
        confirmLabel={busy ? "Clearing…" : "Clear calibration"}
        help={null}
      >
        <p>
          Deletes all {target.steps.length} stored point{target.steps.length === 1 ? "" : "s"} for{" "}
          {target.label}. This cannot be undone — you would have to re-run the wizard.
        </p>
        <p>
          Airflow for this duct then comes from its rated {target.nameplate_cfm || "—"} CFM.
          {target.in_use
            ? " That is a change: this curve is currently driving the numbers."
            : " No change to the numbers — this curve is already being ignored."}
        </p>
      </DecisionLayer>
    </div>
  );
}

/**
 * How fast a tent's air is replaced — the one airflow figure that is arithmetic rather than
 * a model, and the thing a calibration is ultimately *for*.
 *
 * Shown next to the curves because it is where a better curve visibly pays off: calibrate a
 * fan and this number stops being a rating and starts being a measurement. It inherits the
 * fans' own honesty, and it separates the tent's air being replaced from air that actually
 * leaves the building — a fan exhausting to the room moves it next door.
 */
function AirExchangeRow({ spaceId, label }: { spaceId: string; label: string }) {
  const { entity, state } = useEntityBus();
  const ach = entity(`sensor.dsc_ach_${spaceId}`);
  const mins = state(`sensor.dsc_air_exchange_minutes_${spaceId}`, "");
  const attrs = (ach?.attributes ?? {}) as Record<string, unknown>;
  const value = Number(ach?.state);

  if (!Number.isFinite(value) || value <= 0) {
    return (
      <div style={{ padding: "8px 0", borderTop: "1px solid var(--dsc-hairline)" }}>
        <strong>{label}</strong>{" "}
        <span className="dsc-muted">— no air being moved, or no fan reporting.</span>
      </div>
    );
  }

  const measured = String(attrs.honesty ?? "") === "measured_curve";
  const outside = Number(attrs.to_outside_cfm ?? 0);
  const flow = Number(attrs.exchange_cfm ?? 0);

  return (
    <div style={{ padding: "8px 0", borderTop: "1px solid var(--dsc-hairline)" }}>
      <div className="dsc-chip-row" style={{ alignItems: "baseline", gap: 8 }}>
        <strong>{label}</strong>
        {/* A number, not a .dsc-chip: chips are uppercased status words here, and "/ HOUR"
            is not a unit. */}
        <span className="dsc-cal-point" style={{ fontSize: "var(--dsc-fs-md)" }}>
          {value}× / hour
        </span>
        {mins && mins !== "unavailable" ? (
          <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
            turns over every {mins} min
          </span>
        ) : null}
      </div>
      <p className="dsc-kpi-sub" style={{ margin: "4px 0 0" }}>
        {flow} CFM through {String(attrs.volume_m3 ?? "—")} m³, driven by the{" "}
        {String(attrs.driven_by ?? "—")} side.{" "}
        {measured ? "From your measured curve." : "From fan ratings — calibrate to make this real."}
      </p>
      {outside < flow ? (
        <p className="dsc-kpi-sub" style={{ margin: "2px 0 0" }}>
          {outside > 0
            ? `${outside} CFM of that leaves the building; the rest moves`
            : "None of that leaves the building — it moves"}{" "}
          the tent's air into the room, so what comes back in is room air.
        </p>
      ) : null}
    </div>
  );
}

export function FanCalibrationRecord() {
  const { targets, error, reload } = useFanCalSummary();

  const usedCount = (targets ?? []).filter((t) => t.in_use).length;
  const storedCount = (targets ?? []).filter((t) => t.calibrated).length;

  return (
    <Card className="dsc-glass" title="Calibration on record" icon="gauge">
      {error ? <p className="dsc-honesty">{error}</p> : null}
      {targets == null && !error ? <p className="dsc-muted">Reading calibration state…</p> : null}

      {targets != null ? (
        <>
          <p className="dsc-kpi-sub" style={{ margin: "0 0 4px" }}>
            {storedCount} of {targets.length} ducts have a calibration stored; {usedCount} of those
            {usedCount === 1 ? " is" : " are"} actually driving the airflow numbers.
          </p>
          {storedCount > usedCount ? (
            <p className="dsc-honesty" style={{ margin: "0 0 4px" }}>
              A stored calibration that fails the plausibility check is ignored, and the fan falls back
              to its rated capacity. Clearing it removes the claim without changing the numbers.
            </p>
          ) : null}
          {targets.map((t) => (
            <TargetRow key={t.cal_prefix} target={t} onCleared={() => void reload()} />
          ))}
          <p className="dsc-kpi-sub" style={{ margin: "14px 0 0", fontWeight: 600 }}>
            Air changes — what the curves are for
          </p>
          <AirExchangeRow spaceId="4x8" label="4×8 tent" />
          <AirExchangeRow spaceId="2x4" label="2×4 tent" />
        </>
      ) : null}
    </Card>
  );
}
