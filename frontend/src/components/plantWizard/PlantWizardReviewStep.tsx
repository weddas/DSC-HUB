import { DecisionLayer } from "../DecisionLayer";
import { Button, Card, EntitySelect, StatusChip } from "../ui";
import { clearComposeDraft } from "../../lib/composePlantLogic";
import { DEFAULT_VESSEL } from "../../lib/vesselSpec";
import { KIT_PROBE_NUMBERS } from "../../lib/seatModel";
import type { VesselSpec } from "../../lib/vesselSpec";
import type { CallService } from "./plantWizardSteps";

export type PlantWizardReviewStepProps = {
  plantTitle: string;
  potLabel: string;
  tent: string;
  vessel: VesselSpec;
  mixLabel: string;
  skippedFeed: boolean;
  nutrients: string[];
  skippedLight: boolean;
  light: string;
  expectedStage: string;
  expectedDays: string;
  strainLabel: string;
  assign: string;
  setConfirmAdd: (open: boolean) => void;
  commitErr: string | null;
  showAdvanced: boolean;
  setShowAdvanced: (open: boolean) => void;
  callService: CallService;
  copyVesselToPot: (pot: string) => void;
  retireConfirm: boolean;
  setRetireConfirm: (open: boolean) => void;
  refreshBrain: () => Promise<void>;
  setStepIdx: (idx: number | ((i: number) => number)) => void;
  setPickedStrain: (item: null) => void;
  setPickedLight: (item: null) => void;
};

export function PlantWizardReviewStep({
  plantTitle,
  potLabel,
  tent,
  vessel,
  mixLabel,
  skippedFeed,
  nutrients,
  skippedLight,
  light,
  expectedStage,
  expectedDays,
  strainLabel,
  assign,
  setConfirmAdd,
  commitErr,
  showAdvanced,
  setShowAdvanced,
  callService,
  copyVesselToPot,
  retireConfirm,
  setRetireConfirm,
  refreshBrain,
  setStepIdx,
  setPickedStrain,
  setPickedLight,
}: PlantWizardReviewStepProps) {
  return (
    <Card className="dsc-glass dsc-wizard-panel" title="5 · Review & add" icon="compose">
      <dl className="dsc-wizard-summary">
        <div>
          <dt>Plant</dt>
          <dd>{plantTitle}</dd>
        </div>
        <div>
          <dt>Probe</dt>
          <dd>
            {potLabel}
            {tent && tent !== "unknown" && tent !== "unavailable" ? ` · ${tent}` : ""}
          </dd>
        </div>
        <div>
          <dt>Vessel</dt>
          <dd>{vessel.label}</dd>
        </div>
        <div>
          <dt>Medium</dt>
          <dd>{mixLabel}</dd>
        </div>
        <div>
          <dt>Feed</dt>
          <dd>{skippedFeed || !nutrients.length ? "Skipped" : nutrients.join(", ")}</dd>
        </div>
        <div>
          <dt>Light</dt>
          <dd>{skippedLight || !light || light === "unknown" ? "Skipped / tent default" : light}</dd>
        </div>
        {expectedStage ? (
          <div>
            <dt>Expected stage (from sprout)</dt>
            <dd>
              {expectedStage}
              {expectedDays ? ` · day ${expectedDays}` : ""}
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="dsc-row-actions">
        <Button variant="primary" disabled={!strainLabel} icon="compose" iconMotion="glow" onClick={() => setConfirmAdd(true)}>
          {assign === "none" ? "Add to roster (stock)" : `Add plant to ${potLabel}`}
        </Button>
      </div>
      {commitErr ? (
        <p className="dsc-honesty" style={{ marginTop: 10 }}>
          <StatusChip label="Add failed" tone="bad" /> {commitErr}
        </p>
      ) : null}
      <details
        className="dsc-wizard-details"
        open={showAdvanced}
        onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}
      >
        <summary>Advanced actions</summary>
        <div className="dsc-row-actions dsc-wizard-advanced-actions">
          <Button
            variant="secondary"
            onClick={() => {
              void callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
            }}
          >
            Roster only (no assign)
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              copyVesselToPot(assign);
              void callService("script", "turn_on", {
                entity_id: "script.dsc_plant_assign_to_pot",
                pot: assign,
                variables: { pot: assign },
              });
            }}
          >
            Assign probe only
          </Button>
          <Button
            variant="secondary"
            onClick={() => void callService("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" })}
          >
            Apply climate Want
          </Button>
          <Button variant="danger" onClick={() => setRetireConfirm(true)}>
            Retire plant
          </Button>
        </div>
        <DecisionLayer
          open={retireConfirm}
          onDismiss={() => setRetireConfirm(false)}
          onConfirm={() => {
            void (async () => {
              setRetireConfirm(false);
              await callService("script", "turn_on", {
                entity_id: "script.dsc_plant_retire",
                pot: assign,
                variables: { pot: assign },
              });
              clearComposeDraft(callService);
              await refreshBrain();
              setStepIdx(0);
              setPickedStrain(null);
              setPickedLight(null);
            })();
          }}
          title="Retire plant and clear draft?"
          confirmLabel="Retire"
          help={null}
        >
          <p>
            Retires {potLabel} on the hub and clears the compose draft (strain, nickname, assign probe).
          </p>
        </DecisionLayer>
        <EntitySelect
          entityId="input_select.dsc_build_climate_pot"
          label="Climate apply probe"
          icon="climate"
          filterOptions={(opts) =>
            opts.filter((o) => {
              const n = Number(o);
              return o === "Fleet" || (KIT_PROBE_NUMBERS as readonly number[]).includes(n);
            })
          }
        />
      </details>
      <p className="dsc-muted" style={{ fontSize: 12, marginBottom: 0 }}>
        Default vessel if unset: {DEFAULT_VESSEL.label}.
      </p>
    </Card>
  );
}
