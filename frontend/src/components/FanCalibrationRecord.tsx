import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { clear_calibration, fan_calibration_summary, type FanCalTarget } from "../lib/fleetApi";

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
          rated {target.nameplate_cfm || "—"} CFM
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

export function FanCalibrationRecord() {
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
            <TargetRow key={t.cal_prefix} target={t} onCleared={() => void load()} />
          ))}
        </>
      ) : null}
    </Card>
  );
}
