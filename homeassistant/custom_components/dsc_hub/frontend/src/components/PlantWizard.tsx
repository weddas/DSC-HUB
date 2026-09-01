import { useMemo, useState, useEffect } from "react";
import { CatalogPicker } from "./CatalogPicker";
import { CoupledMix } from "./CoupledMix";
import { DecisionLayer } from "./DecisionLayer";
import { VesselGlyph } from "./VesselGlyph";
import { Button, Card, EntitySelect, EntityText, EntityDatetime, Icon, StatusChip, flushEntityTextDrafts, peekEntityTextDraft } from "./ui";
import { TargetNumber } from "./TentTargets";
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
  NUTRIENT_SLOTS,
  SOIL_PRESETS,
} from "../lib/composePlantLogic";
import { DEFAULT_VESSEL, resolveVesselSpec, vesselEntityId, VESSEL_CATALOG } from "../lib/vesselSpec";
import type { CatalogItem } from "../lib/catalog";
import { KIT_PROBE_NUMBERS, probeLabel } from "../lib/seatModel";

const STEPS = [
  { id: "plant", label: "Plant", icon: "roster" as const },
  { id: "soil", label: "Probe & soil", icon: "root" as const },
  { id: "feed", label: "Feed", icon: "nutrient" as const, optional: true },
  { id: "light", label: "Light", icon: "lighting" as const, optional: true },
  { id: "review", label: "Review", icon: "ok" as const },
] as const;

function strainOk(strain: string): boolean {
  return Boolean(strain && strain !== "unknown" && strain !== "unavailable");
}

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
  const mixLabel = blendSummary(state);
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

  /** Catalog pick writes strain async; commit reads helpers — sync picked label first. */
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
    // Prefer live DOM over draft map — native setters / mid-blur races can leave the map empty.
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
    if (step.id === "light") {
      // Footer Next is skip-equivalent when no fixture is chosen — don't strand on the light catalog.
      setSkippedLight(!light || light === "unknown");
    }
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
        <Card className="dsc-glass dsc-wizard-panel" title="1 · Which plant, which probe?" icon="roster">
          <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
            Search the catalog, give it a nickname, pick an empty kit probe, and set sprout date if you know it.
          </p>
          <CatalogPicker kind="strain" onPick={onPickStrain} placeholder="Search strains…" />
          {pickedStrain || strainOk(strain) ? (
            <div className="dsc-chip-row" style={{ margin: "10px 0" }}>
              <StatusChip icon="roster" label={strainLabel || strain} tone="ok" />
              {pickedStrain?.type ? <StatusChip icon="research" label={String(pickedStrain.type)} tone="muted" /> : null}
              {pickedStrain?.height_cm_min != null ? (
                <StatusChip
                  label={`${pickedStrain.height_cm_min}${pickedStrain.height_cm_max != null ? `–${pickedStrain.height_cm_max}` : ""} cm`}
                  tone="muted"
                />
              ) : null}
            </div>
          ) : (
            <p className="dsc-honesty">Pick a strain to continue.</p>
          )}
          <div className="dsc-wizard-fields">
            <EntityText entityId="input_text.dsc_build_nickname" label="Nickname (optional)" />
            <EntityDatetime entityId="input_datetime.dsc_build_sprout_date" label="Sprout date" />
            <label className="dsc-field">
              <span className="dsc-field-label">
                <Icon name="root" size={14} /> Assign to probe
              </span>
              <select
                className="dsc-input"
                value={assignOptions.includes(assign) ? assign : "none"}
                onChange={(e) => {
                  const next = e.target.value;
                  setAssignDraft(next);
                  void callService("input_select", "select_option", {
                    entity_id: "input_select.dsc_build_assign_pot",
                    option: next,
                  });
                }}
              >
                {assignOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "none" ? "— none —" : probeLabel(Number(opt))}
                  </option>
                ))}
              </select>
            </label>
            <EntitySelect entityId="input_select.dsc_build_tent" label="Tent" icon="tent" />
          </div>
          {expectedStage ? (
            <div className="dsc-chip-row" style={{ marginTop: 8 }}>
              <StatusChip icon="grow" label={`Expected · ${expectedStage}`} tone="muted" />
              {expectedDays ? <StatusChip icon="history" label={`Day ${expectedDays}`} tone="muted" /> : null}
            </div>
          ) : (
            <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
              Sprout date auto-calculates growth stage after commit.
            </p>
          )}
        </Card>
      ) : null}

      {step.id === "soil" ? (
        <Card className="dsc-glass dsc-wizard-panel" title="2 · Pot size & growing medium" icon="compose">
          <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
            Tap a pot size, then pick a common mix or search the medium catalog. Custom blends are tucked away unless
            you need them.
          </p>
          <div className="dsc-vessel-grid">
            {VESSEL_CATALOG.map((spec) => (
              <button
                key={spec.id}
                type="button"
                className={`dsc-vessel-tile${spec.id === vessel.id ? " is-selected" : ""}`}
                onClick={() => selectVessel(spec)}
              >
                <VesselGlyph spec={spec} size={36} />
                <span>{spec.label}</span>
              </button>
            ))}
          </div>
          {!available("input_select.dsc_build_vessel") ? (
            <StatusChip label="Volume only — vessel presets unavailable on hub" tone="warn" />
          ) : null}

          <h4 className="dsc-wizard-subhead">Quick mixes</h4>
          <div className="dsc-soil-presets">
            {SOIL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`dsc-chip dsc-soil-preset${soilPresetId === preset.id ? " dsc-chip--ok" : ""}`}
                onClick={() => applyPreset(preset.id)}
              >
                <Icon name="root" size={12} /> {preset.label}
              </button>
            ))}
          </div>

          <h4 className="dsc-wizard-subhead">Or search catalog</h4>
          <CatalogPicker kind="medium" onPick={onPickMedium} placeholder="Search mediums…" />
          <div className="dsc-chip-row" style={{ marginTop: 8 }}>
            <StatusChip label={mixLabel} tone={mixLabel === "Not set" ? "warn" : "ok"} icon="compose" />
            <StatusChip label={`${vessel.volumeL || volumeL} L`} tone="muted" icon="tank" />
          </div>

          <div className="dsc-wizard-advanced-toggle">
            <Button variant="secondary" icon="advanced" onClick={() => setCustomBlend((v) => !v)}>
              {customBlend ? "Hide custom blend" : "Custom 3-layer blend"}
            </Button>
          </div>
          {customBlend ? <CoupledMix volumeL={vessel.volumeL || volumeL} /> : null}
        </Card>
      ) : null}

      {step.id === "feed" ? (
        <Card className="dsc-glass dsc-wizard-panel" title="3 · Feed recipe (optional)" icon="nutrient">
          <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
            Skip if you are not mixing nutrients yet. Search to add bottles — defaults fill dose from the catalog when
            available.
          </p>
          <div className="dsc-row-actions" style={{ marginBottom: 12 }}>
            <Button
              variant="secondary"
              icon="nutrient"
              onClick={() => {
                setSkippedFeed(true);
                goNext();
              }}
            >
              Skip feed for now
            </Button>
          </div>
          <CatalogPicker kind="nutrient" onPick={onPickNutrient} placeholder="Search nutrients…" />
          {nutrients.length ? (
            <div className="dsc-chip-row" style={{ margin: "10px 0" }}>
              {nutrients.map((name) => (
                <StatusChip key={name} label={name} tone="ok" icon="nutrient" />
              ))}
            </div>
          ) : (
            <p className="dsc-muted" style={{ fontSize: 12 }}>No nutrients added yet.</p>
          )}
          <details className="dsc-wizard-details">
            <summary>Advanced — tank size & all slots</summary>
            <div className="dsc-target-grid">
              <TargetNumber entityId="input_number.dsc_mix_tank_liters" label="Tank L" step={0.5} />
              <TargetNumber entityId="input_number.dsc_mix_strength_pct" label="Strength %" step={1} />
            </div>
            {NUTRIENT_SLOTS.map((n) => (
              <div key={n} className="dsc-nutrient-slot">
                <EntityText entityId={`input_text.dsc_nutrient_${n}_name`} label={`Slot ${n}`} />
                <TargetNumber entityId={`input_number.dsc_nutrient_${n}_dose_ml_l`} label="ml/L" step={0.1} />
              </div>
            ))}
            <EntityText entityId="input_text.dsc_build_recipe_note" label="Recipe note" multiline />
          </details>
        </Card>
      ) : null}

      {step.id === "light" ? (
        <Card className="dsc-glass dsc-wizard-panel" title="4 · Light fixture (optional)" icon="lighting">
          <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
            Match a catalog fixture or pick from hub presets. Skip if the tent light is already configured.
          </p>
          <div className="dsc-row-actions" style={{ marginBottom: 12 }}>
            <Button
              variant="secondary"
              icon="lighting"
              onClick={() => {
                setSkippedLight(true);
                goNext();
              }}
            >
              Skip light
            </Button>
          </div>
          <CatalogPicker kind="light" onPick={onPickLight} placeholder="Search lights…" />
          <EntitySelect entityId="input_select.dsc_light_fixture" label="Hub fixture preset" />
          {pickedLight || (light && light !== "unknown") ? (
            <div className="dsc-chip-row" style={{ marginTop: 8 }}>
              <StatusChip label={light && light !== "unknown" ? light : pickedLight?.name || "—"} tone="ok" icon="lighting" motion="glow" />
              {pickedLight?.wattage_w != null ? (
                <StatusChip label={`${pickedLight.wattage_w} W`} tone="muted" />
              ) : null}
            </div>
          ) : null}
        </Card>
      ) : null}

      {step.id === "review" ? (
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
              <Button
                variant="danger"
                onClick={() => setRetireConfirm(true)}
              >
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
