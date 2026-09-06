import { useMemo, useState, useEffect } from "react";
import { DecisionLayer } from "./DecisionLayer";
import { Button, Icon, StatusChip, flushEntityTextDrafts, peekEntityTextDraft } from "./ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useBrainRefresh } from "../hooks/useBrain";
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
import { resolveVesselSpec, vesselEntityId, VESSEL_CATALOG } from "../lib/vesselSpec";
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
  const refreshBrain = useBrainRefresh();
  const [stepIdx, setStepIdx] = useState(0);
  /** Furthest step the operator has reached — visited steps stay freely navigable via the chips. */
  const [maxStepIdx, setMaxStepIdx] = useState(0);
  const [customBlend, setCustomBlend] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [commitErr, setCommitErr] = useState<string | null>(null);
  const [pickedStrain, setPickedStrain] = useState<CatalogItem | null>(null);
  const [pickedLight, setPickedLight] = useState<CatalogItem | null>(null);
  const [soilPresetId, setSoilPresetId] = useState<string | null>(null);
  const [skippedFeed, setSkippedFeed] = useState(false);
  const [skippedLight, setSkippedLight] = useState(false);
  const [retireConfirm, setRetireConfirm] = useState(false);
  /** Local assign so Next enables immediately (bus round-trip must not deactivate mid-step). */
  const [assignDraft, setAssignDraft] = useState<string | null>(null);
  const [writeErr, setWriteErr] = useState<string | null>(null);

  /** Steps 1-4 fire background writes without awaiting them; this surfaces a failure instead of an unhandled rejection. */
  const guardedCallService: typeof callService = (domain, service, data) => {
    const result = callService(domain, service, data);
    void Promise.resolve(result).catch((exc) => {
      setWriteErr(exc instanceof Error ? exc.message : `${domain}.${service} failed`);
    });
    return result;
  };

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
        // resolveVesselSpec always falls back to DEFAULT_VESSEL (which always has a label),
        // so vessel.label alone never blocks Next — require an actual vessel or medium pick.
        return Boolean(vesselRaw && vesselRaw !== "unknown" && vesselRaw !== "unavailable") || mixLabel !== "Not set";
      default:
        return true;
    }
  }, [step.id, strainLabel, assign, vesselRaw, mixLabel]);

  useEffect(() => {
    // Clear local assign override once the bus catches up (or operator clears elsewhere).
    if (assignDraft != null && assignBus === assignDraft) setAssignDraft(null);
  }, [assignBus, assignDraft]);

  const onPickStrain = (item: CatalogItem) => {
    setPickedStrain(item);
    applyCatalogPick("strain", item, guardedCallService, state);
  };

  const onPickMedium = (item: CatalogItem) => {
    setSoilPresetId(null);
    applyCatalogPick("medium", item, guardedCallService, state);
  };

  const onPickNutrient = (item: CatalogItem) => {
    setSkippedFeed(false);
    applyCatalogPick("nutrient", item, guardedCallService, state);
  };

  const onPickLight = (item: CatalogItem) => {
    setSkippedLight(false);
    setPickedLight(item);
    applyLightPick(item, guardedCallService, fixtureOptions);
  };

  const selectVessel = (spec: (typeof VESSEL_CATALOG)[number]) => {
    const opts = (entity("input_select.dsc_build_vessel")?.attributes?.options as string[]) || [];
    if (opts.includes(spec.id) && available("input_select.dsc_build_vessel")) {
      void guardedCallService("input_select", "select_option", {
        entity_id: "input_select.dsc_build_vessel",
        option: spec.id,
      });
    }
    void guardedCallService("input_number", "set_value", {
      entity_id: "input_number.dsc_blend_total_l",
      value: spec.volumeL,
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = SOIL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSoilPresetId(presetId);
    setCustomBlend(false);
    applyBlendLayers(preset.layers, guardedCallService);
  };

  const copyVesselToPot = (pot: string) => {
    const potN = Number(pot);
    if (!Number.isFinite(potN) || pot === "none") return;
    const id = vesselEntityId(potN);
    if (!available(id)) return;
    void guardedCallService("input_select", "select_option", { entity_id: id, option: vessel.id });
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

  /** Local assign draft must land on the bus before commit (brain reads the helper). */
  const syncAssignToBus = async () => {
    if (assign === assignBus) return;
    await callService("input_select", "select_option", {
      entity_id: "input_select.dsc_build_assign_pot",
      option: assign,
    });
  };

  const commitAssign = async () => {
    setCommitErr(null);
    await syncComposeTextToBus();
    await syncAssignToBus();
    await flushEntityDrafts();
    try {
      if (assign !== "none") {
        copyVesselToPot(assign);
        let result: unknown;
        if (available("script.dsc_build_plant_commit_and_assign")) {
          result = await callService("script", "turn_on", {
            entity_id: "script.dsc_build_plant_commit_and_assign",
            pot: assign,
            variables: { pot: assign },
          });
        } else {
          await callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
          result = await callService("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            pot: assign,
            variables: { pot: assign },
          });
        }
        const assigned =
          result &&
          typeof result === "object" &&
          (("assign" in result && (result as { assign?: { pot?: string } }).assign?.pot === assign) ||
            ("pot" in result && (result as { pot?: string }).pot === assign));
        // Pi brain returns a dict; HA panel callService may return null — only assert when shaped.
        if (result && typeof result === "object" && !assigned) {
          throw new Error(
            `Plant saved but probe ${probeLabel(Number(assign))} was not assigned — try Assign probe only under Advanced, or retry.`,
          );
        }
      } else {
        await callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
      }
      clearComposeDraft(guardedCallService);
      setWriteErr(null);
      setPickedStrain(null);
      setPickedLight(null);
      setStepIdx(0);
      setMaxStepIdx(0);
      await refreshBrain();
    } catch (exc) {
      setCommitErr(exc instanceof Error ? exc.message : "Add plant failed");
      throw exc;
    }
  };

  const goNext = async () => {
    const from = step.id;
    // Local-first: bus writes catch up on their own — a slow/failed sync must never
    // freeze the Next button or leave it feeling inert with no feedback.
    try {
      if (from === "plant") await syncComposeTextToBus();
      await flushEntityDrafts();
    } catch (exc) {
      setWriteErr(exc instanceof Error ? exc.message : "draft sync failed — retry from Review");
    }
    if (from === "feed") setSkippedFeed(nutrients.length === 0);
    if (from === "light") setSkippedLight(!light || light === "unknown");
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIdx((i) => Math.max(i - 1, 0));

  const discardDraft = () => {
    clearComposeDraft(guardedCallService);
    setPickedStrain(null);
    setPickedLight(null);
    setSoilPresetId(null);
    setSkippedFeed(false);
    setSkippedLight(false);
    setAssignDraft(null);
    setWriteErr(null);
    setCommitErr(null);
    setStepIdx(0);
    setMaxStepIdx(0);
  };

  useEffect(() => {
    setMaxStepIdx((m) => Math.max(m, stepIdx));
  }, [stepIdx]);

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
              disabled={i > maxStepIdx && !(i === stepIdx + 1 && canNext)}
              onClick={() => {
                if (i <= maxStepIdx) setStepIdx(i);
                else if (i === stepIdx + 1 && canNext) void goNext();
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
                {"optional" in s && s.optional ? " (optional)" : ""}
              </span>
            </button>
          );
        })}
      </nav>

      {draftOpen ? (
        <div className="dsc-banner dsc-banner--warn" style={{ marginBottom: 12 }}>
          <StatusChip label="Unsaved compose draft" tone="warn" />
          <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-md)", marginLeft: 8 }}>
            Strain or probe is set — this draft is shared across the kit until you add the plant or discard it.
          </span>
          <Button variant="secondary" icon="history" onClick={discardDraft}>
            Discard draft
          </Button>
        </div>
      ) : null}

      {writeErr ? (
        <div className="dsc-banner dsc-banner--bad" style={{ marginBottom: 12 }}>
          <StatusChip label="A write failed" tone="bad" />
          <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-md)", marginLeft: 8 }}>
            {writeErr}
          </span>
          <Button variant="secondary" onClick={() => setWriteErr(null)}>
            Dismiss
          </Button>
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
          callService={guardedCallService}
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
              : "optional" in step && step.optional
                ? "Next (or skip above)"
                : "Next"}
          </Button>
        ) : null}
      </footer>

      <DecisionLayer
        open={confirmAdd}
        onDismiss={() => {
          if (committing) return;
          setConfirmAdd(false);
        }}
        onConfirm={() => {
          if (committing) return;
          setCommitting(true);
          void commitAssign()
            .then(() => {
              setConfirmAdd(false);
            })
            .catch(() => {
              /* Keep modal open so commitErr stays visible next to Confirm */
            })
            .finally(() => {
              setCommitting(false);
            });
        }}
        title="Add plant"
        confirmLabel={`Add to ${potLabel}`}
        busy={committing}
        help={null}
      >
        <p>
          Saves <strong>{plantTitle}</strong> with {vessel.label} and {mixLabel} to the roster, assigns{" "}
          {potLabel} in {tent}, and copies the vessel to that probe.
          {expectedStage ? ` Calendar expected stage will be ${expectedStage}.` : ""}
        </p>
        {commitErr ? (
          <p className="dsc-honesty" style={{ marginTop: 12 }}>
            <StatusChip label="Add failed" tone="bad" /> {commitErr}
          </p>
        ) : null}
      </DecisionLayer>
    </div>
  );
}
