import { useState } from "react";
import { Button, Card, EntitySelect, EntityToggle, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { TargetNumber } from "./TentTargets";
import { useHass } from "../hooks/useHass";

const CAL_CURVES: { label: string; prefix: string; reset: string }[] = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" },
];
const PPFD_STEPS = [25, 50, 75, 100] as const;

export function LearningWizard() {
  const { callService, entity, state } = useHass();
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
      <Card className="dsc-glass" title="Anemometer / PPFD cal" icon="learning">
        <div className="dsc-chip-row">
          <StatusChip label={`Curves ${curveStatus}`} tone={curveStatus === "—" ? "muted" : "ok"} />
          <StatusChip label={calActive ? "SESSION ON" : "Session idle"} tone={calActive ? "ok" : "muted"} />
        </div>
        <p className="dsc-honesty">
          CFM live numbers live on Climate. This wizard writes cal points only — do not invent them.
          {curves ? ` Curve: ${curves}` : ""}
        </p>
        <div className="dsc-row-actions">
          <Button onClick={() => setStep("gate")}>Open gate</Button>
          <Button onClick={() => setStep("sample")}>Sample points</Button>
          <Button teal onClick={() => setStep("accept")}>
            Finish session
          </Button>
          <Button onClick={() => setStep("curves")}>Stored curves</Button>
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
          One air appliance at a time. Fans/mat may stay on. Activity is SoT — gate open ≠ measuring. Phase B stays
          off until Activity shows samples climbing.
        </p>
        <Button onClick={() => setStep("climate")}>Learn enable</Button>
      </Card>

      <DecisionLayer open={step === "gate"} onDismiss={() => setStep(null)} title="Learn gate" help={null}>
        <p className="dsc-muted">Target + session. Scripts own hold math.</p>
        <EntitySelect entityId="input_select.dsc_cal_target" label="Cal target" />
        <p className="dsc-kpi-sub">{state("input_text.dsc_cal_status", "")}</p>
        <Button
          primary
          onClick={() => {
            void callService("script", "turn_on", { entity_id: "script.dsc_cal_start" });
            setStep("sample");
          }}
        >
          Start session
        </Button>
      </DecisionLayer>

      <DecisionLayer open={step === "sample"} onDismiss={() => setStep(null)} title="Sample" help={null}>
        <p className="dsc-muted">Enter anemometer m/s or CFM. Skip rather than invent. Drafts hold until blur.</p>
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
          <Button onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" })}>
            Re-hold
          </Button>
          <Button primary onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_save_point" })}>
            Save point
          </Button>
          <Button onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" })}>
            Skip
          </Button>
          <Button onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_abort" })}>
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
          Curve status {curveStatus}. Finish restores snapped fans/light. Points already saved at 25/50/75/100 stay;
          this does not invent a fit.
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
        <p className="dsc-muted">Toggles HA helpers. No invented samples. Blocked while failsafe/takeover/fault.</p>
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
          0 = unset → linear % × nameplate. Do not invent points. Reset scripts wipe a curve; they do not guess a fit.
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
          onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" })}
        >
          Reset PPFD
        </Button>
      </DecisionLayer>
    </>
  );
}
