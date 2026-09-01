import { useMemo, useState, useEffect } from "react";
import { DecisionLayer } from "./DecisionLayer";
import { Button, Icon, StatusChip, flushEntityTextDrafts, peekEntityTextDraft } from "./ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useBrainContext } from "../hooks/useBrain";
import {
  activeNutrientNames,
  applyBlendLayers,
  applyCatalogPick,
  applyLightPick,
  blendSummary,
  clearComposeDraft,
  hasComposeDraft,
  SOIL_PRESETS,
} from "../lib/composePlantLogic";
import { DEFAULT_VESSEL, resolveVesselSpec, vesselEntityId, VESSEL_CATALOG } from "../lib/vesselSpec";
import type { CatalogItem } from "../lib/catalog";
import { KIT_PROBE_NUMBERS, probeLabel } from "../lib/seatModel";
import { STEPS, strainOk } from "./plantWizard/plantWizardSteps";
import { PlantWizardPlantStep } from "./plantWizard/PlantWizardPlantStep";
import { PlantWizardSoilStep } from "./plantWizard/PlantWizardSoilStep";
import { PlantWizardFeedStep } from "./plantWizard/PlantWizardFeedStep";
import { PlantWizardLightStep } from "./plantWizard/PlantWizardLightStep";
import { PlantWizardReviewStep } from "./plantWizard/PlantWizardReviewStep";

export function PlantWizard() {
  const { available, entity, num, state } = useEntityBus();
  const { callService } = useFleetActions();
  const { refresh: refreshBrain } = useBrainContext();
  const [stepIdx, setStepIdx] = useState(0);
  const [customBlend, setCustomBlend] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [commitErr, setCommitErr] = useState<string | null>(null);
  const [pickedStrain, setPickedStrain] = useState<CatalogItem | null>(null);
  const [pickedLight, setPickedLight] = useState<CatalogItem | null>(null);
  const [soilPresetId, setSoilPresetId] = useState<string | null>(null);
  const [skippedFeed, setSkippedFeed] = useState(false);
  const [skippedLight, setSkippedLight] = useState(false);
  const [retireConfirm, setRetireConfirm] = useState(false);
  /** Local assign so Next enables immediately (bus round-trip must not deactivate mid-step). */
  const [assignDraft, setAssignDraft] = useState<string | null>(null);

  const step = STEPS[stepIdx];
  const strain = state("input_text.dsc_build_strain", "");
  const nickBus = state("input_text.dsc_build_nickname", "");
  const nick = peekEntityTextDraft("input_text.dsc_build_nickname") ?? nickBus;
  const assignBus = state("input_select.dsc_build_assign_pot", "none");
  const assign = assignDraft ?? assignBus;
  const tent = state("input_select.dsc_build_tent", "4x8");
  const draftOpen = hasComposeDraft(state);
  const expectedStage = state("sensor.dsc_build_expected_stage", "");
  const expectedDays = state("sensor.dsc_build_days_since_sprout", "");
  const volumeL = num("input_number.dsc_blend_total_l", 20);
  const light = state("input_select.dsc_light_fixture", "");
  const vesselRaw = state("input_select.dsc_build_vessel", "");
  const vessel = resolveVesselSpec(vesselRaw || undefined, volumeL);
  const presetLabel = soilPresetId ? SOIL_PRESETS.find((p) => p.id === soilPresetId)?.label : null;
  const mixLabel = presetLabel ?? blendSummary(state);
  const nutrients = activeNutrientNames(state);
  const strainLabel =
    (strainOk(strain) ? strain : "") ||
    (pickedStrain?.name ? String(pickedStrain.name) : "") ||
    "";

  const fixtureOptions = useMemo(
    () => (entity("input_select.dsc_light_fixture")?.attributes?.options as string[]) || [],
    [entity],
  );

  const canNext = useMemo(() => {
    switch (step.id) {
      case "plant":
        // Strain required; probe optional (stock roster when assign is none).
        return Boolean(strainLabel);
      case "soil":
        return Boolean(vessel.label);
      default:
        return true;
    }
  }, [step.id, strainLabel, assign, vessel.label]);

  useEffect(() => {
    // Clear local assign override once the bus catches up (or operator clears elsewhere).
    if (assignDraft != null && assignBus === assignDraft) setAssignDraft(null);
  }, [assignBus, assignDraft]);

  const onPickStrain = (item: CatalogItem) => {
    setPickedStrain(item);
    applyCatalogPick("strain", item, callService, state);
  };

  const onPickMedium = (item: CatalogItem) => {
    setSoilPresetId(null);
    applyCatalogPick("medium", item, callService, state);
  };

  const onPickNutrient = (item: CatalogItem) => {
    setSkippedFeed(false);
    applyCatalogPick("nutrient", item, callService, state);
  };

  const onPickLight = (item: CatalogItem) => {
    setSkippedLight(false);
    setPickedLight(item);
    applyLightPick(item, callService, fixtureOptions);
  };

  const selectVessel = (spec: (typeof VESSEL_CATALOG)[number]) => {
    const opts = (entity("input_select.dsc_build_vessel")?.attributes?.options as string[]) || [];
    if (opts.includes(spec.id) && available("input_select.dsc_build_vessel")) {
      void callService("input_select", "select_option", {
        entity_id: "input_select.dsc_build_vessel",
        option: spec.id,
      });
    }
    void callService("input_number", "set_value", {
      entity_id: "input_number.dsc_blend_total_l",
      value: spec.volumeL,
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = SOIL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSoilPresetId(presetId);
    setCustomBlend(false);
    applyBlendLayers(preset.layers, callService);
  };

  const copyVesselToPot = (pot: string) => {
    const potN = Number(pot);
    if (!Number.isFinite(potN) || pot === "none") return;
    const id = vesselEntityId(potN);
    if (!available(id)) return;
    void callService("input_select", "select_option", { entity_id: id, option: vessel.id });
  };

  const flushEntityDrafts = async () => {
    await flushEntityTextDrafts(callService);
  };

  const syncStrainToBus = async () => {
    const label = strainLabel.trim();
    if (!label) return;
    const bus = strainOk(strain) ? strain.trim() : "";
    if (bus !== label) {
      await callService("input_text", "set_value", {
        entity_id: "input_text.dsc_build_strain",
        value: label,
      });
    }
  };

  const syncComposeTextToBus = async () => {
    await syncStrainToBus();
    const domNick = document
      .querySelector<HTMLInputElement>('input[data-entity-id="input_text.dsc_build_nickname"]')
      ?.value?.trim();
    const n = (domNick || nick).trim();
    if (n && n !== nickBus.trim()) {
      await callService("input_text", "set_value", {
        entity_id: "input_text.dsc_build_nickname",
        value: n,
      });
    }
  };

  const commitAssign = async () => {
    setCommitErr(null);
    await syncComposeTextToBus();
    await flushEntityDrafts();
    try {
      if (assign !== "none") {
        copyVesselToPot(assign);
        if (available("script.dsc_build_plant_commit_and_assign")) {
          await callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
        } else {
          await callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
          await callService("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            pot: assign,
            variables: { pot: assign },
          });
        }
      } else {
        await callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
      }
      clearComposeDraft(callService);
      setPickedStrain(null);
      setPickedLight(null);
      setStepIdx(0);
      await refreshBrain();
    } catch (exc) {
      setCommitErr(exc instanceof Error ? exc.message : "Add plant failed");
      throw exc;
    }
  };

  const goNext = async () => {
    if (step.id === "plant") await syncComposeTextToBus();
    await flushEntityDrafts();
    if (step.id === "feed") setSkippedFeed(nutrients.length === 0);
    if (step.id === "light") setSkippedLight(!light || light === "unknown");
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIdx((i) => Math.max(i - 1, 0));

  useEffect(() => {
    try {
      const remembered = localStorage.getItem("dsc_compose_tent");
      if (remembered && available("input_select.dsc_build_tent")) {
        void callService("input_select", "select_option", {
          entity_id: "input_select.dsc_build_tent",
          option: remembered,
        });
      }
    } catch {
      /* storage blocked */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tent || tent === "unknown") return;
    try {
      localStorage.setItem("dsc_compose_tent", tent);
    } catch {
      /* storage blocked */
    }
  }, [tent]);

  const plantTitle = nick || strainLabel || "New plant";
  const potLabel = assign === "none" ? "Roster stock (no probe)" : probeLabel(Number(assign));

  const assignOptions = useMemo(() => {
    const raw = (entity("input_select.dsc_build_assign_pot")?.attributes?.options as string[]) || [];
    const kit = new Set<string>(["none", ...KIT_PROBE_NUMBERS.map(String)]);
    const filtered = raw.filter((o) => kit.has(o));
    return filtered.length ? filtered : ["none", ...KIT_PROBE_NUMBERS.map(String)];
  }, [entity]);

  useEffect(() => {
    if (assign === "none") return;
    const n = Number(assign);
    if (!(KIT_PROBE_NUMBERS as readonly number[]).includes(n)) {
      void callService("input_select", "select_option", {
        entity_id: "input_select.dsc_build_assign_pot",
        option: "none",
      });
    }
  }, [assign, callService]);

  return (
    <div className="dsc-plant-wizard">
      <nav className="dsc-wizard-steps" aria-label="Add plant steps">
        {STEPS.map((s, i) => {
          const done = i < stepIdx;
          const current = i === stepIdx;
          return (
            <button
              key={s.id}
              type="button"
              className={`dsc-wizard-step${current ? " is-current" : ""}${done ? " is-done" : ""}`}
              disabled={i > stepIdx && !canNext}
              onClick={() => {
                if (i <= stepIdx) setStepIdx(i);
              }}
            >
              <Icon
                name={s.icon}
                size={14}
                motion={current ? "glow" : done ? "pulse" : undefined}
                color={current ? "var(--dsc-teal)" : done ? "var(--dsc-teal)" : "var(--dsc-gray-5)"}
              />
              <span className="dsc-wizard-step-num">{i + 1}</span>
              <span className="dsc-wizard-step-label">
                {s.label}
                {s.optional ? " (optional)" : ""}
              </span>
            </button>
          );
        })}
      </nav>

      {draftOpen ? (
        <div className="dsc-banner dsc-banner--warn" style={{ marginBottom: 12 }}>
          <StatusChip label="Unsaved compose draft" tone="warn" />
          <span className="dsc-muted" style={{ fontSize: 13, marginLeft: 8 }}>
            Strain or probe is set — finish add or retire clears the draft.
          </span>
        </div>
      ) : null}

      {step.id === "plant" ? (
        <PlantWizardPlantStep
          onPickStrain={onPickStrain}
          pickedStrain={pickedStrain}
          strainLabel={strainLabel}
          strain={strain}
          assign={assign}
          assignOptions={assignOptions}
          setAssignDraft={setAssignDraft}
          callService={callService}
          expectedStage={expectedStage}
          expectedDays={expectedDays}
        />
      ) : null}

      {step.id === "soil" ? (
        <PlantWizardSoilStep
          selectVessel={selectVessel}
          vessel={vessel}
          vesselAvailable={available("input_select.dsc_build_vessel")}
          soilPresetId={soilPresetId}
          applyPreset={applyPreset}
          onPickMedium={onPickMedium}
          mixLabel={mixLabel}
          volumeL={volumeL}
          customBlend={customBlend}
          setCustomBlend={setCustomBlend}
        />
      ) : null}

      {step.id === "feed" ? (
        <PlantWizardFeedStep
          goNext={goNext}
          setSkippedFeed={setSkippedFeed}
          onPickNutrient={onPickNutrient}
          nutrients={nutrients}
        />
      ) : null}

      {step.id === "light" ? (
        <PlantWizardLightStep
          goNext={goNext}
          setSkippedLight={setSkippedLight}
          onPickLight={onPickLight}
          pickedLight={pickedLight}
          light={light}
        />
      ) : null}

      {step.id === "review" ? (
        <PlantWizardReviewStep
          plantTitle={plantTitle}
          potLabel={potLabel}
          tent={tent}
          vessel={vessel}
          mixLabel={mixLabel}
          skippedFeed={skippedFeed}
          nutrients={nutrients}
          skippedLight={skippedLight}
          light={light}
          expectedStage={expectedStage}
          expectedDays={expectedDays}
          strainLabel={strainLabel}
          assign={assign}
          setConfirmAdd={setConfirmAdd}
          commitErr={commitErr}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          callService={callService}
          copyVesselToPot={copyVesselToPot}
          retireConfirm={retireConfirm}
          setRetireConfirm={setRetireConfirm}
          refreshBrain={refreshBrain}
          setStepIdx={setStepIdx}
          setPickedStrain={setPickedStrain}
          setPickedLight={setPickedLight}
        />
      ) : null}

      <footer className="dsc-wizard-footer">
        <Button variant="secondary" icon="history" disabled={stepIdx === 0} onClick={goBack}>
          Back
        </Button>
        {step.id !== "review" ? (
          <Button variant="primary" icon="ok" disabled={!canNext} onClick={() => void goNext()}>
            {step.id === "light" && (!light || light === "unknown")
              ? "Skip light"
              : step.optional
                ? "Next (or skip above)"
                : "Next"}
          </Button>
        ) : null}
      </footer>

      <DecisionLayer
        open={confirmAdd}
        onDismiss={() => setConfirmAdd(false)}
        onConfirm={() => {
          void commitAssign().then(() => setConfirmAdd(false));
        }}
        title="Add plant"
        confirmLabel={`Add to ${potLabel}`}
        help={null}
      >
        <p>
          Saves <strong>{plantTitle}</strong> with {vessel.label} and {mixLabel} to the roster, assigns{" "}
          {potLabel} in {tent}, and copies the vessel to that probe.
          {expectedStage ? ` Calendar expected stage will be ${expectedStage}.` : ""}
        </p>
      </DecisionLayer>
    </div>
  );
}
