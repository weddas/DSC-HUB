import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, EntitySelect, EntityToggle, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { TargetNumber } from "./TentTargets";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";

const CAL_CURVES: { label: string; prefix: string; reset: string }[] = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" },
];
const PPFD_STEPS = [25, 50, 75, 100] as const;

export function LearningWizard() {
  const { entity, state } = useEntityBus();
  const { callService } = useFleetActions();
  const [step, setStep] = useState<"gate" | "sample" | "accept" | "climate" | "curves" | null>(null);
  const learnStatus = state("sensor.dsc_learn_status", "—");
  const gateOpen = state("binary_sensor.dsc_learn_gate_open") === "on";
  const learnActivity = state("sensor.dsc_learn_activity", "—");
  const curves = String(entity("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? "");
  const curveStatus = state("sensor.dsc_cfm_curves_status", "—");
  const phaseB = state("sensor.dsc_learn_phase_b_status", "—");
  const calActive = state("input_boolean.dsc_cal_active") === "on";
  const trusted = String(entity("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");

  return (
    <>
      <Card className="dsc-glass" title="CFM cal ownership" icon="learning">
        <p className="dsc-honesty">
          <Link to="/fleet/calibrate">Fleet → Calibrate</Link> owns the guided fan CFM session (
          <code>input_number.dsc_cal_*</code>, <code>script.dsc_cal_save_point</code>). This wizard uses the same
          entities — blur-commit here vs save-point flow there. Pick one surface per session.
        </p>
      </Card>

      <Card className="dsc-glass" title="Anemometer / PPFD cal" icon="learning">
        <div className="dsc-chip-row">
          <StatusChip label={`Curves ${curveStatus}`} tone={curveStatus === "—" ? "muted" : "ok"} />
          <StatusChip label={calActive ? "SESSION ON" : "Session idle"} tone={calActive ? "ok" : "muted"} />
        </div>
        <p className="dsc-honesty">
          Live airflow numbers are on the Climate page. This wizard records only the readings you enter.
          {curves ? ` Curve: ${curves}` : ""}
        </p>
        <div className="dsc-row-actions">
          <Button variant="primary" onClick={() => setStep("gate")}>Open gate</Button>
          <Button variant="secondary" onClick={() => setStep("sample")}>Sample points</Button>
          <Button variant="secondary" onClick={() => setStep("accept")}>
            Finish session
          </Button>
          <Button variant="secondary" onClick={() => setStep("curves")}>Stored curves</Button>
        </div>
      </Card>

      <Card className="dsc-glass" title="Climate learn (Phase A/B)" icon="learning">
        <div className="dsc-chip-row">
          <StatusChip label={`Status ${learnStatus}`} tone={learnStatus === "—" ? "muted" : "ok"} />
          <StatusChip label={gateOpen ? "GATE OPEN" : "GATE CLOSED"} tone={gateOpen ? "ok" : "warn"} />
          <StatusChip label={`Activity ${learnActivity}`} tone="muted" />
          <StatusChip label={`B ${phaseB}`} tone={phaseB === "off" || phaseB === "—" ? "muted" : "ok"} />
          <StatusChip label={`Trusted ${trusted}`} tone="muted" />
        </div>
        <p className="dsc-honesty">
          One air appliance runs at a time; fans and the heat mat may stay on. Watch the Activity chip — an open gate
          does not mean it is measuring yet. Phase B stays off until samples start climbing.
        </p>
        <Button variant="secondary" onClick={() => setStep("climate")}>Learn enable</Button>
      </Card>

      <DecisionLayer
        open={step === "gate"}
        onDismiss={() => setStep(null)}
        onConfirm={() => {
          void callService("script", "turn_on", { entity_id: "script.dsc_cal_start" });
          setStep("sample");
        }}
        title="Learn gate"
        confirmLabel="Start session"
        help={null}
      >
        <p className="dsc-muted">
          Pick what to calibrate, then start the session. The hub holds each step steady while you measure.
        </p>
        <EntitySelect entityId="input_select.dsc_cal_target" label="Cal target" />
        <p className="dsc-kpi-sub">{state("input_text.dsc_cal_status", "")}</p>
      </DecisionLayer>

      <DecisionLayer open={step === "sample"} onDismiss={() => setStep(null)} title="Sample" help={null}>
        <p className="dsc-muted">
          Enter the anemometer reading in m/s or CFM. If you could not measure a step, skip it. Values save when you
          leave the field.
        </p>
        <div className="dsc-target-grid">
          <TargetNumber entityId="input_number.dsc_cal_reading_ms" label="m/s" />
          <TargetNumber entityId="input_number.dsc_cal_reading_cfm" label="CFM" />
          <TargetNumber entityId="input_number.dsc_cal_reading_ppfd" label="PPFD" />
          <TargetNumber entityId="input_number.dsc_cal_step_pct" label="Step %" />
          <TargetNumber entityId="input_number.dsc_duct_out_cm" label="OUT duct cm" />
          <TargetNumber entityId="input_number.dsc_duct_recirc_cm" label="RECIRC cm" />
          <TargetNumber entityId="input_number.dsc_duct_intake_main_cm" label="Intake main cm" />
          <TargetNumber entityId="input_number.dsc_duct_intake_clone_cm" label="Intake 2×4 cm" />
        </div>
        <div className="dsc-row-actions">
          <Button variant="secondary" onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" })}>
            Re-hold
          </Button>
          <Button variant="primary" onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_save_point" })}>
            Save point
          </Button>
          <Button variant="secondary" onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" })}>
            Skip
          </Button>
          <Button variant="danger" onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_abort" })}>
            Abort
          </Button>
        </div>
      </DecisionLayer>

      <DecisionLayer
        open={step === "accept"}
        onDismiss={() => setStep(null)}
        onConfirm={() => {
          void callService("script", "turn_on", { entity_id: "script.dsc_cal_finish" });
          setStep(null);
        }}
        title="Finish session"
        confirmLabel="Finish"
        help={null}
      >
        <p>
          Curve status {curveStatus}. Finishing returns fans and light to their previous settings. Points already
          saved at 25/50/75/100% are kept.
        </p>
      </DecisionLayer>

      <DecisionLayer
        open={step === "climate"}
        onDismiss={() => setStep(null)}
        onConfirm={() => setStep(null)}
        title="Climate learn enable"
        confirmLabel="Done"
        help={null}
      >
        <p className="dsc-muted">
          Turns learning on or off. Learning pauses automatically during failsafe, manual takeover, or a fault.
        </p>
        <EntityToggle entityId="input_boolean.dsc_climate_learn_enabled" label="Phase A enabled" />
        <EntityToggle entityId="input_boolean.dsc_climate_learn_phase_b_enabled" label="Phase B enabled" />
        <EntityToggle entityId="input_boolean.dsc_learn_phase_b_locked" label="Phase B lock" />
        <div className="dsc-target-grid">
          <TargetNumber entityId="input_number.dsc_learn_alpha" label="EMA α" />
          <TargetNumber entityId="input_number.dsc_learn_min_samples" label="Min samples" />
        </div>
        <p className="dsc-kpi-sub">
          Gate {gateOpen ? "open" : "closed"} · {learnActivity} · trusted {trusted}
        </p>
      </DecisionLayer>

      <DecisionLayer open={step === "curves"} onDismiss={() => setStep(null)} title="Stored curves" help={null}>
        <p className="dsc-honesty">
          0 means not measured — the hub then estimates from the fan&apos;s rated output. Reset clears a curve back to
          not-measured; it never guesses.
        </p>
        {CAL_CURVES.map((c) => (
          <div key={c.prefix} className="dsc-cal-curve">
            <strong>{c.label}</strong>
            <div className="dsc-target-grid">
              {PPFD_STEPS.map((pct) => (
                <TargetNumber
                  key={`${c.prefix}_${pct}`}
                  entityId={`input_number.${c.prefix}_${pct}`}
                  label={`@${pct}%`}
                />
              ))}
            </div>
            <Button
              variant="danger"
              onClick={() => void callService("script", "turn_on", { entity_id: c.reset })}
            >
              Reset {c.label}
            </Button>
          </div>
        ))}
        <strong>SF1000 PPFD</strong>
        <div className="dsc-target-grid">
          {PPFD_STEPS.map((pct) => (
            <TargetNumber key={`ppfd_${pct}`} entityId={`input_number.dsc_cal_ppfd_${pct}`} label={`@${pct}%`} />
          ))}
        </div>
        <Button
          variant="danger"
          onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" })}
        >
          Reset PPFD
        </Button>
      </DecisionLayer>
    </>
  );
}
