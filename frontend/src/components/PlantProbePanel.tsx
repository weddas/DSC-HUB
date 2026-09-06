import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DecisionLayer } from "./DecisionLayer";
import { OverflowMenu, SoilCrossSection } from "./chrome";
import { HistoryDrawer } from "./HistoryDrawer";
import { Button, Card, StatusChip } from "./ui";
import { RehomeChecklist } from "./RehomeChecklist";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { patchProbePlant, detachPlantFromProbe, movePlantBetweenProbes } from "../lib/fleetApi";
import { GROWTH_STAGE_FALLBACK } from "../lib/growthStages";
import { ArcGauge, GotWantBars, MultiLineChart } from "../viz/charts";
import {
  activeProbeNumbers,
  buildPlantProbe,
  fmtReading,
  probeGotEntity,
  probeLabel,
  tentLabel,
  type TentId,
} from "../lib/probeModel";
import { readProbeVessel } from "../lib/vesselSpec";
import { PlantExtra } from "./PlantExtra";
import { VesselGlyph } from "./VesselGlyph";
import { useBrainRefresh } from "../hooks/useBrain";
import { useFleet } from "../hooks/useFleet";
import { phaseLabel, probeSteering, type RootSteeringSnapshot } from "../lib/rootSteering";
import { probeAssignedPlantId } from "../lib/probeAssignment";
import { JournalScopePanel } from "./journal/JournalScopePanel";

type FieldBaseline = {
  name: string;
  strain: string;
  blend: string;
  sprout: string;
  stage: string;
  notes: string;
};

function plantToBaseline(plant: ReturnType<typeof buildPlantProbe>): FieldBaseline {
  return {
    name: plant.plantName === "—" ? "" : plant.plantName,
    strain: plant.strainDisplay === "—" ? "" : plant.strainDisplay,
    blend: plant.blend || "",
    sprout: plant.sprout === "—" ? "" : plant.sprout.slice(0, 10),
    stage: plant.growthStage === "—" ? "" : plant.growthStage,
    notes: plant.notes === "—" ? "" : plant.notes,
  };
}

function emptyBaseline(): FieldBaseline {
  return { name: "", strain: "", blend: "", sprout: "", stage: "", notes: "" };
}

function recipeGrowthStage(result: Record<string, unknown>): string | undefined {
  const recipe = result.recipe;
  if (recipe && typeof recipe === "object" && recipe !== null) {
    const stage = (recipe as { growth_stage?: unknown }).growth_stage;
    if (typeof stage === "string" && stage.trim()) return stage.trim();
  }
  const top = result.growth_stage;
  if (typeof top === "string" && top.trim()) return top.trim();
  return undefined;
}

/** Shared plant body for Root / Roster drawers (Surface 7.1). */
export function PlantProbePanel({
  probe,
  onSelectProbe,
  onRetired,
}: {
  probe: number;
  onSelectProbe?: (n: number) => void;
  /** Called after successful retire so parents can close drawers/overlays */
  onRetired?: () => void;
}) {
  const { state, entity, available, tick, num } = useEntityBus();
  const { callService } = useFleetActions();
  const refreshBrain = useBrainRefresh();
  const fleet = useFleet();
  const steering = probeSteering(
    fleet.root_steering as RootSteeringSnapshot | undefined,
    `pot${probe}`,
  );
  const navigate = useNavigate();
  void tick;
  const plant = buildPlantProbe(probe, { state, entity });
  const baselineRef = useRef<FieldBaseline>(plantToBaseline(plant));
  const [nameDraft, setNameDraft] = useState(baselineRef.current.name);
  const [strainDraft, setStrainDraft] = useState(baselineRef.current.strain);
  const [sproutDraft, setSproutDraft] = useState(baselineRef.current.sprout);
  const [stageDraft, setStageDraft] = useState(baselineRef.current.stage);
  const [notesDraft, setNotesDraft] = useState(baselineRef.current.notes);
  const [blendDraft, setBlendDraft] = useState(baselineRef.current.blend);
  const [applyErr, setApplyErr] = useState<string | null>(null);
  const [editErr, setEditErr] = useState<string | null>(null);
  const [retireErr, setRetireErr] = useState<string | null>(null);
  const [lifecycleErr, setLifecycleErr] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string | null>(null);
  const [pendingTent, setPendingTent] = useState<TentId | null>(null);
  const [applyPhotoTemplate, setApplyPhotoTemplate] = useState(true);
  const [detachConfirm, setDetachConfirm] = useState(false);
  const [moveTo, setMoveTo] = useState<number | null>(null);
  const [retireConfirm, setRetireConfirm] = useState(false);
  const [hist, setHist] = useState<{ id: string; label: string; unit: string } | null>(null);

  useEffect(() => {
    const baseline = plantToBaseline(plant);
    baselineRef.current = baseline;
    setNameDraft(baseline.name);
    setStrainDraft(baseline.strain);
    setSproutDraft(baseline.sprout);
    setStageDraft(baseline.stage);
    setNotesDraft(baseline.notes);
    setBlendDraft(baseline.blend);
    setApplyErr(null);
    setEditErr(null);
    setRetireErr(null);
    setEditStatus(null);
  }, [probe]);

  useEffect(() => {
    if (!editStatus) return;
    const t = window.setTimeout(() => setEditStatus(null), 2500);
    return () => window.clearTimeout(t);
  }, [editStatus]);

  const moistId = probeGotEntity(probe, "moisture", state);
  const ecId = probeGotEntity(probe, "ec", state);
  const phId = probeGotEntity(probe, "ph", state);
  const drybackId = `sensor.dsc_probe${probe}_dryback_pct`;
  const moistHeld = useHeldReading(moistId);
  const drybackHeld = useHeldReading(drybackId);
  const ecHeld = useHeldReading(ecId);
  const phHeld = useHeldReading(phId);
  const moistSeries = useEntitySeries(moistId, { hours: 6, maxPoints: 72 });
  const ecSeries = useEntitySeries(ecId, { hours: 6, maxPoints: 72 });
  const learnedEcRaw = num(`input_number.dsc_probe${probe}_learned_ec_per_moisture`);
  const learnedEc =
    available(`input_number.dsc_probe${probe}_learned_ec_per_moisture`) &&
    Number.isFinite(learnedEcRaw) &&
    learnedEcRaw !== 0
      ? learnedEcRaw
      : NaN;

  const wantMoistMin = available(`sensor.dsc_probe${probe}_want_moisture_min`)
    ? num(`sensor.dsc_probe${probe}_want_moisture_min`)
    : num(`number.dsc_probe${probe}_want_moisture_min`);
  const wantMoistMax = available(`sensor.dsc_probe${probe}_want_moisture_max`)
    ? num(`sensor.dsc_probe${probe}_want_moisture_max`)
    : num(`number.dsc_probe${probe}_want_moisture_max`);
  const wantEcMin = num(`sensor.dsc_probe${probe}_want_ec_min`);
  const wantEcMax = num(`sensor.dsc_probe${probe}_want_ec_max`);
  const wantPhMin = num(`sensor.dsc_probe${probe}_want_ph_min`);
  const wantPhMax = num(`sensor.dsc_probe${probe}_want_ph_max`);
  const hasWant =
    Number.isFinite(wantMoistMin) &&
    Number.isFinite(wantMoistMax) &&
    (available(`sensor.dsc_probe${probe}_want_moisture_min`) ||
      available(`number.dsc_probe${probe}_want_moisture_min`));
  const hasWantEc = Number.isFinite(wantEcMin) && Number.isFinite(wantEcMax);
  const hasWantPh = Number.isFinite(wantPhMin) && Number.isFinite(wantPhMax);
  const genericStrain =
    !plant.strainDisplay ||
    plant.strainDisplay === "—" ||
    /generic/i.test(plant.strainDisplay);
  const hasRosterSlot = plant.rosterSlot != null;
  const plantId = probeAssignedPlantId(probe, fleet, state);

  const applyTent = async (tent: TentId, photoTemplate?: boolean) => {
    setApplyErr(null);
    try {
      await callService("input_select", "select_option", {
        entity_id: `input_select.dsc_probe${probe}_tent`,
        option: tent,
      });
      if (photoTemplate && tent !== "unassigned") {
        if (tent === "clone") {
          await callService("select", "select_option", {
            entity_id: "select.dsc_hub_clone_photoperiod",
            option: "Independent",
          });
          await callService("number", "set_value", {
            entity_id: "number.dsc_hub_clone_light_hours",
            value: 18,
          });
        } else if (tent === "main") {
          await callService("number", "set_value", {
            entity_id: "number.dsc_hub_min_dark_hours",
            value: 12,
          });
        }
      }
      window.setTimeout(() => {
        const now = state(`input_select.dsc_probe${probe}_tent`, "");
        if (now !== tent) {
          setApplyErr("Tent change did not stick — the hub rejected it. Try again.");
        }
      }, 400);
    } catch {
      setApplyErr("Tent change did not stick — the hub rejected it. Try again.");
    }
  };

  const persistPlant = async (patch: Parameters<typeof patchProbePlant>[1]) => {
    setEditStatus(null);
    setEditErr(null);
    try {
      const result = await patchProbePlant(probe, patch);
      setEditStatus("Saved");
      return result;
    } catch (exc) {
      setEditErr(exc instanceof Error ? exc.message : "Plant edit failed");
      return null;
    }
  };

  const saveName = () => {
    if (nameDraft === baselineRef.current.name) return;
    void persistPlant({ plant_name: nameDraft }).then((result) => {
      if (result) baselineRef.current.name = nameDraft;
    });
  };

  const saveStrain = () => {
    if (strainDraft === baselineRef.current.strain) return;
    void persistPlant({ strain_display: strainDraft }).then((result) => {
      if (result) baselineRef.current.strain = strainDraft;
    });
  };

  const saveSprout = () => {
    const sprout = sproutDraft.slice(0, 10);
    if (!sprout || sprout === baselineRef.current.sprout) return;
    void persistPlant({ sprout_date: sprout }).then((result) => {
      if (!result) return;
      baselineRef.current.sprout = sprout;
      const stage = recipeGrowthStage(result);
      if (stage) {
        setStageDraft(stage);
        baselineRef.current.stage = stage;
      }
    });
  };

  const saveNotes = () => {
    if (!hasRosterSlot) return;
    if (notesDraft === baselineRef.current.notes) return;
    void persistPlant({ notes: notesDraft }).then((result) => {
      if (result) baselineRef.current.notes = notesDraft;
    });
  };

  const saveBlend = () => {
    if (blendDraft === baselineRef.current.blend) return;
    void persistPlant({ blend: blendDraft }).then((result) => {
      if (result) baselineRef.current.blend = blendDraft;
    });
  };

  const clearDraftsAfterRetire = () => {
    const empty = emptyBaseline();
    baselineRef.current = empty;
    setNameDraft("");
    setStrainDraft("");
    setSproutDraft("");
    setStageDraft("");
    setNotesDraft("");
    setBlendDraft("");
  };

  const retirePlant = async () => {
    setRetireErr(null);
    try {
      await callService("script", "turn_on", {
        entity_id: "script.dsc_plant_retire",
        pot: String(probe),
        variables: { pot: String(probe) },
      });
      setRetireConfirm(false);
      clearDraftsAfterRetire();
      await refreshBrain();
      onRetired?.();
    } catch (exc) {
      setRetireErr(exc instanceof Error ? exc.message : "Retire failed");
    }
  };

  const detachPlant = async () => {
    setLifecycleErr(null);
    try {
      await detachPlantFromProbe(probe);
      setDetachConfirm(false);
      clearDraftsAfterRetire();
      await refreshBrain();
      onRetired?.();
    } catch (exc) {
      setLifecycleErr(exc instanceof Error ? exc.message : "Detach failed");
    }
  };

  const movePlant = async () => {
    if (moveTo == null) return;
    setLifecycleErr(null);
    try {
      await movePlantBetweenProbes(probe, moveTo);
      setMoveTo(null);
      await refreshBrain();
      onSelectProbe?.(moveTo);
    } catch (exc) {
      setLifecycleErr(exc instanceof Error ? exc.message : "Move failed");
    }
  };

  const vacantTargets = activeProbeNumbers(state).filter((n) => {
    if (n === probe) return false;
    return !state(`text.dsc_probe${n}_plant_name`, "").trim();
  });

  const stageOpts =
    (entity(`select.dsc_probe${probe}_growth_stage`)?.attributes?.options as string[] | undefined) ||
    [...GROWTH_STAGE_FALLBACK];

  const setStage = (v: string) => {
    setStageDraft(v);
    if (!v || v === baselineRef.current.stage) return;
    void persistPlant({ growth_stage: v }).then((result) => {
      if (result) baselineRef.current.stage = v;
    });
  };

  const liveGotMoist = moistHeld.stale
    ? `${fmtReading(moistHeld.value, 0)}*`
    : plant.moisture;
  const liveGotEc = ecHeld.stale ? `${fmtReading(ecHeld.value, 0)}*` : plant.ec;
  const liveGotPh = phHeld.stale ? `${fmtReading(phHeld.value, 0)}*` : plant.ph;

  return (
    <div className="dsc-seat-panel">
      <div className="dsc-chip-row" style={{ marginBottom: 14 }}>
        {activeProbeNumbers(state).map((n) => (
          <button
            key={n}
            type="button"
            className={`dsc-chip${n === probe ? " dsc-chip--ok" : ""}`}
            onClick={() => onSelectProbe?.(n)}
          >
            <VesselGlyph spec={readProbeVessel(n, state, entity)} size={16} /> P{n}
          </button>
        ))}
        <StatusChip label={tentLabel(plant.tent)} tone={plant.tent === "unassigned" ? "muted" : "ok"} />
        {plant.rosterSlot != null ? (
          <StatusChip label={`Roster #${plant.rosterSlot}`} tone="muted" />
        ) : (
          <StatusChip label="Not on roster" tone="warn" />
        )}
        {moistHeld.stale ? <StatusChip label="Reading held" tone="warn" /> : null}
      </div>

      <div className="dsc-seat-layout">
        <Card className="dsc-glass dsc-glass--glow" title="Medium">
          <SoilCrossSection
            layers={plant.layers}
            spec={readProbeVessel(probe, state, entity)}
            emptyLabel="No blend on this plant yet"
          />
          <PlantExtra probe={probe} />
          {plant.blend ? (
            <p className="dsc-muted" style={{ marginTop: 10, fontSize: "var(--dsc-fs-sm)" }}>
              {plant.blend}
            </p>
          ) : null}
        </Card>

        <div className="dsc-grid" style={{ gap: 14 }}>
          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Identity">
              <div className="dsc-seat-editors">
                <label>
                  Nickname
                  <input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onBlur={saveName}
                    placeholder="Plant nickname"
                    autoComplete="off"
                  />
                </label>
                <label>
                  Strain
                  <input
                    value={strainDraft}
                    onChange={(e) => setStrainDraft(e.target.value)}
                    onBlur={saveStrain}
                    placeholder="e.g. Gelato 33"
                    autoComplete="off"
                  />
                </label>
                <label>
                  Blend / media
                  <input
                    value={blendDraft}
                    onChange={(e) => setBlendDraft(e.target.value)}
                    onBlur={saveBlend}
                    placeholder="e.g. living soil / coco"
                    autoComplete="off"
                  />
                </label>
                <label>
                  Sprout date
                  <input
                    type="date"
                    value={sproutDraft.slice(0, 10)}
                    onChange={(e) => setSproutDraft(e.target.value)}
                    onBlur={saveSprout}
                  />
                </label>
                <label>
                  Growth stage
                  <select value={stageDraft} onChange={(e) => setStage(e.target.value)}>
                    <option value="">—</option>
                    {stageOpts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="dsc-chip-row">
                  <StatusChip label={`Day ${plant.days || "—"}`} tone="muted" />
                  <StatusChip
                    label={
                      plant.stage && plant.stage !== "—"
                        ? `Expected · ${plant.stage}`
                        : plant.days && plant.days !== "—"
                          ? `Expected (day ${plant.days})`
                          : "No expected stage"
                    }
                    tone="muted"
                  />
                  {editStatus ? <StatusChip label={editStatus} tone="ok" /> : null}
                </div>
                {editErr ? (
                  <p className="dsc-honesty">
                    <StatusChip label="Edit failed" tone="bad" /> {editErr}
                  </p>
                ) : null}
                <OverflowMenu
                  items={[
                    {
                      id: "compose",
                      label: "Open Compose (strain/catalog)",
                      onSelect: () => navigate("/grow/compose"),
                    },
                    {
                      id: "root",
                      label: "Root zone",
                      onSelect: () => navigate("/live/root"),
                    },
                    {
                      id: "delete",
                      label: "Delete plant…",
                      onSelect: () => setRetireConfirm(true),
                    },
                  ]}
                />
              </div>
            </Card>
          </div>

          <div className="dsc-col-6">
            <Card className="dsc-glass" title="Want · Got · Need">
              <div className="dsc-chip-row">
                <StatusChip
                  label={`Got M ${
                    moistHeld.stale
                      ? `${fmtReading(moistHeld.value, 0)}*`
                      : plant.moisture
                  }`}
                  tone={moistHeld.stale ? "warn" : "ok"}
                />
                <StatusChip label={`EC ${plant.ec}`} tone="muted" />
                <StatusChip label={`pH ${plant.ph}`} tone="muted" />
                <StatusChip
                  label={plant.need}
                  tone={plant.need !== "—" && plant.need !== "OK" ? "warn" : "ok"}
                />
              </div>
              {hasWant && !genericStrain ? (
                <GotWantBars
                  rows={[
                    {
                      label: "Moisture",
                      got: moistHeld.value,
                      stale: moistHeld.stale,
                      wantMin: wantMoistMin,
                      wantMax: wantMoistMax,
                      unit: "%",
                    },
                    {
                      label: "EC",
                      got: ecHeld.value,
                      stale: ecHeld.stale,
                      wantMin: hasWantEc ? wantEcMin : undefined,
                      wantMax: hasWantEc ? wantEcMax : undefined,
                    },
                    {
                      label: "pH",
                      got: phHeld.value,
                      stale: phHeld.stale,
                      wantMin: hasWantPh ? wantPhMin : undefined,
                      wantMax: hasWantPh ? wantPhMax : undefined,
                    },
                  ]}
                />
              ) : (
                <p className="dsc-honesty" style={{ margin: "8px 0 0" }}>
                  <StatusChip label="No target bands" tone="warn" />{" "}
                  {genericStrain
                    ? "No strain selected — target bands are unknown."
                    : "Custom targets not set — showing measurements only."}
                </p>
              )}
              <p className="dsc-kpi-sub">Need compares the catalog targets against what was measured.</p>
            </Card>
          </div>

          <div className="dsc-col-6">
            <Card className="dsc-glass" title="Dryback">
              {steering ? (
                <div style={{ marginBottom: 8 }}>
                  <StatusChip
                    label={phaseLabel(steering.phase ?? null)}
                    tone={steering.act_allowed ? "ok" : "muted"}
                  />
                </div>
              ) : null}
              <ArcGauge
                label="Dryback"
                value={drybackHeld.value}
                min={0}
                max={100}
                unit="%"
                stale={drybackHeld.stale}
                band={{ min: 0, max: 45 }}
                onClick={() => setHist({ id: drybackId, label: "Dryback", unit: "%" })}
              />
            </Card>
          </div>

          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Got history">
              <MultiLineChart
                live
                lastSyncAt={
                  Math.max(moistSeries.lastSyncAt ?? 0, ecSeries.lastSyncAt ?? 0) || undefined
                }
                series={[
                  {
                    id: "m",
                    label: "Moisture",
                    series: moistSeries.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "%",
                  },
                  {
                    id: "ec",
                    label: "EC",
                    series: ecSeries.series,
                    color: "var(--dsc-amber)",
                    axis: "right",
                    unit: "",
                  },
                ]}
              />
              <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
                {Number.isFinite(learnedEc)
                  ? `Learned nutrient use: ${learnedEc.toFixed(3)} EC per moisture point, from this probe's own history.`
                  : "EC over time shown — not enough history yet to learn this probe's nutrient use."}
              </p>
              <div className="dsc-chip-row" style={{ marginTop: 8 }}>
                <Button onClick={() => setHist({ id: moistId, label: "Moisture", unit: "%" })}>
                  Moisture hist
                </Button>
                <Button onClick={() => setHist({ id: ecId, label: "EC", unit: "" })}>EC hist</Button>
                <Button onClick={() => setHist({ id: phId, label: "pH", unit: "" })}>pH hist</Button>
              </div>
            </Card>
          </div>

          <div className="dsc-col-6">
            <Card className="dsc-glass" title="Nutrition">
              <p style={{ margin: "0 0 6px" }}>
                {plant.recipe || "No recipe recorded for this plant — catalog doses shown only."}
              </p>
              <label className="dsc-seat-editors">
                Notes
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  onBlur={saveNotes}
                  disabled={!hasRosterSlot}
                  placeholder={
                    hasRosterSlot
                      ? "Plant / roster notes"
                      : "Notes need a roster slot — assign from Compose."
                  }
                />
              </label>
              <div style={{ marginTop: 10 }}>
                <Link to="/grow/compose">
                  <Button teal>Mix in Compose</Button>
                </Link>
              </div>
            </Card>
            <div style={{ marginTop: 12 }}>
              <JournalScopePanel
                scope={{ kind: "plant", id: plantId }}
                variant="embedded"
                fetchLimit={10}
                visibleRows={3}
              />
            </div>
          </div>

          <div className="dsc-col-6">
            <Card className="dsc-glass" title="Live Got chips">
              <div className="dsc-chip-row">
                <StatusChip
                  label={`M ${liveGotMoist}`}
                  tone={moistHeld.stale ? "warn" : "muted"}
                />
                <StatusChip label={`T ${plant.soilTemp}`} tone="muted" />
                <StatusChip
                  label={`EC ${liveGotEc}`}
                  tone={ecHeld.stale ? "warn" : "muted"}
                />
                <StatusChip
                  label={`pH ${liveGotPh}`}
                  tone={phHeld.stale ? "warn" : "muted"}
                />
                <StatusChip label={`N ${plant.n}`} tone="muted" />
                <StatusChip label={`P ${plant.p}`} tone="muted" />
                <StatusChip label={`K ${plant.k}`} tone="muted" />
              </div>
              <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
                NPK = trend indicators. Unavailable stays —. Held shows last good on blip.
              </p>
            </Card>
          </div>

          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Apply to tent">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Tent placement. Moves this plant's probe between tents; does not rewrite climate Want.
              </p>
              <div className="dsc-seat-actions">
                <Button primary={plant.tent === "clone"} onClick={() => setPendingTent("clone")}>
                  2×4
                </Button>
                <Button primary={plant.tent === "main"} onClick={() => setPendingTent("main")}>
                  4×8
                </Button>
                <Button onClick={() => setPendingTent("unassigned")}>Unassigned</Button>
                <Link to="/live/root">
                  <Button>Open Root</Button>
                </Link>
              </div>
              <DecisionLayer
                open={pendingTent != null}
                onDismiss={() => setPendingTent(null)}
                onConfirm={() => {
                  const tent = pendingTent;
                  setPendingTent(null);
                  if (tent) void applyTent(tent, applyPhotoTemplate);
                }}
                title={
                  pendingTent === "clone"
                    ? "Move plant to 2×4"
                    : pendingTent === "main"
                      ? "Move plant to 4×8"
                      : "Unassign tent"
                }
                confirmLabel="Apply tent"
                help={null}
              >
                {pendingTent && pendingTent !== "unassigned" ? (
                  <RehomeChecklist from={plant.tent} to={pendingTent} />
                ) : null}
                <p>
                  Updates {probeLabel(probe)} tent placement on Overview and Root. Climate Want is unchanged — use Climate or Compose for
                  targets.
                </p>
                {pendingTent === "clone" || pendingTent === "main" ? (
                  <label className="dsc-check-row" style={{ display: "block", marginTop: 10 }}>
                    <input
                      type="checkbox"
                      checked={applyPhotoTemplate}
                      onChange={(e) => setApplyPhotoTemplate(e.target.checked)}
                    />{" "}
                    Apply photoperiod template ({pendingTent === "clone" ? "18h veg · independent 2×4" : "12h dark · 4×8"})
                  </label>
                ) : null}
              </DecisionLayer>
              {applyErr ? (
                <p className="dsc-honesty">
                  <StatusChip label="Apply failed" tone="bad" /> {applyErr}
                </p>
              ) : null}
            </Card>
          </div>

          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Probe assignment">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Detach keeps the plant on the roster with no probe. Move reassigns to another vacant kit probe. Delete
                destroys the plant.
              </p>
              <div className="dsc-chip-row" style={{ gap: 8, flexWrap: "wrap" }}>
                <Button onClick={() => setDetachConfirm(true)}>Detach from probe</Button>
                {vacantTargets.map((n) => (
                  <Button key={n} onClick={() => setMoveTo(n)}>
                    Move to {probeLabel(n)}
                  </Button>
                ))}
              </div>
              <DecisionLayer
                open={detachConfirm}
                onDismiss={() => setDetachConfirm(false)}
                onConfirm={() => {
                  void detachPlant();
                }}
                title={`Detach plant from ${probeLabel(probe)}?`}
                confirmLabel="Detach"
                help={null}
              >
                <p>
                  Frees this probe. The plant stays on the roster as detached. SoftCal and probe-station home are
                  unchanged.
                </p>
              </DecisionLayer>
              <DecisionLayer
                open={moveTo != null}
                onDismiss={() => setMoveTo(null)}
                onConfirm={() => {
                  void movePlant();
                }}
                title={moveTo != null ? `Move plant to ${probeLabel(moveTo)}?` : "Move"}
                confirmLabel="Move"
                help={null}
              >
                <p>
                  Leaves {probeLabel(probe)} vacant and places this plant on{" "}
                  {moveTo != null ? probeLabel(moveTo) : "the target probe"}.
                </p>
              </DecisionLayer>
              {lifecycleErr ? (
                <p className="dsc-honesty">
                  <StatusChip label="Lifecycle failed" tone="bad" /> {lifecycleErr}
                </p>
              ) : null}
            </Card>
          </div>

          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Delete plant">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Destroys this plant and empties its roster slot. Prefer Detach if you only need to free the probe.
              </p>
              <Button variant="danger" onClick={() => setRetireConfirm(true)}>
                Delete plant from {probeLabel(probe)}
              </Button>
              <DecisionLayer
                open={retireConfirm}
                onDismiss={() => setRetireConfirm(false)}
                onConfirm={() => {
                  void retirePlant();
                }}
                title={`Delete plant on ${probeLabel(probe)}?`}
                confirmLabel="Delete plant"
                help={null}
              >
                <p>
                  Removes the plant from {probeLabel(probe)} and its roster slot. Soil readings and probe stations stay; you can
                  compose a new plant onto this probe afterward.
                </p>
              </DecisionLayer>
              {retireErr ? (
                <p className="dsc-honesty">
                  <StatusChip label="Delete failed" tone="bad" /> {retireErr}
                </p>
              ) : null}
            </Card>
          </div>
        </div>
      </div>

      <HistoryDrawer
        open={hist != null}
        onClose={() => setHist(null)}
        entityId={hist?.id ?? null}
        label={hist?.label ?? ""}
        unit={hist?.unit}
      />
    </div>
  );
}
