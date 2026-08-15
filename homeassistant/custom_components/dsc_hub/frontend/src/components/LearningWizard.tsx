import { useState } from "react";
import { Button, Card, EntitySelect, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { CfmProvenanceBadge } from "./CfmBadge";
import { TargetNumber } from "./TentTargets";
import { useHass } from "../hooks/useHass";
import { resolveCfm } from "../lib/cfmProvenance";

export function LearningWizard() {
  const { callService, entity, num, state, available } = useHass();
  const [step, setStep] = useState<"gate" | "sample" | "accept" | null>(null);
  const out = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const rec = resolveCfm("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", {
    available,
    num,
  });
  const learnStatus = state("sensor.dsc_learn_status", "—");
  const learnGate = state("binary_sensor.dsc_learn_gate", state("sensor.dsc_learn_gate", "—"));
  const curves = String(entity("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? "");
  const curveStatus = state("sensor.dsc_cfm_curves_status", "—");

  return (
    <>
      <Card className="dsc-glass" title="Learn wizard" icon="learning">
        <div className="dsc-chip-row">
          <StatusChip label={`Status ${learnStatus}`} tone={learnStatus === "—" ? "muted" : "ok"} />
          <StatusChip label={`Gate ${learnGate}`} tone="muted" />
          <StatusChip label={`Curves ${curveStatus}`} tone={curveStatus === "—" ? "muted" : "ok"} />
          <CfmProvenanceBadge reading={out} />
          <CfmProvenanceBadge reading={rec} />
        </div>
        <p className="dsc-honesty">
          Nameplate CFM stays % × capacity until ≥2 anemometer points. Do not invent points.
          {curves ? ` Curve: ${curves}` : ""}
        </p>
        <div className="dsc-row-actions">
          <Button onClick={() => setStep("gate")}>Open gate</Button>
          <Button onClick={() => setStep("sample")}>Sample points</Button>
          <Button teal onClick={() => setStep("accept")}>
            Finish session
          </Button>
        </div>
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
    </>
  );
}
