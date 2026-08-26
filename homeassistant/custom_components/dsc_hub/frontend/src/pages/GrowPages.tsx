import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ComposePlant } from "../components/ComposePlant";
import { CatalogResearch } from "../components/CatalogResearch";
import { DecisionLayer } from "../components/DecisionLayer";
import { OverflowMenu, SoilCrossSection, SlideDrawer } from "../components/chrome";
import { HistoryDrawer } from "../components/HistoryDrawer";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { ArcGauge, GotWantBars, MultiLineChart } from "../viz/charts";
import {
  activePotNumbers,
  buildPlantSeat,
  isPotInService,
  potGotEntity,
  readTent,
  rosterSlots,
  tentLabel,
  normalizeTent,
  type TentId,
} from "../lib/seatModel";
import { readPotVessel } from "../lib/vesselSpec";
import { PlantExtra } from "../components/PlantExtra";
import { VesselGlyph } from "../components/VesselGlyph";
import { CropScheduler } from "../components/CropScheduler";

/** Shared seat body for Root / Roster drawers (Surface 7.1). */
export function PlantSeatPanel({
  pot,
  onSelectPot,
}: {
  pot: number;
  onSelectPot?: (n: number) => void;
}) {
  const { hass, state, entity, available, tick, num } = useEntityBus();
  const { callService } = useFleetActions();
  const navigate = useNavigate();
  void tick;
  const seat = buildPlantSeat(pot, { state, entity });
  const [nameDraft, setNameDraft] = useState(seat.plantName === "—" ? "" : seat.plantName);
  const [sproutDraft, setSproutDraft] = useState(seat.sprout === "—" ? "" : seat.sprout);
  const [stageDraft, setStageDraft] = useState(seat.growthStage === "—" ? "" : seat.growthStage);
  const [notesDraft, setNotesDraft] = useState(seat.notes === "—" ? "" : seat.notes);
  const [applyErr, setApplyErr] = useState<string | null>(null);
  const [pendingTent, setPendingTent] = useState<TentId | null>(null);
  const [hist, setHist] = useState<{ id: string; label: string; unit: string } | null>(null);

  useEffect(() => {
    setNameDraft(seat.plantName === "—" ? "" : seat.plantName);
    setSproutDraft(seat.sprout === "—" ? "" : seat.sprout);
    setStageDraft(seat.growthStage === "—" ? "" : seat.growthStage);
    setNotesDraft(seat.notes === "—" ? "" : seat.notes);
    setApplyErr(null);
  }, [pot]);

  const moistId = potGotEntity(pot, "moisture", state);
  const ecId = potGotEntity(pot, "ec", state);
  const phId = potGotEntity(pot, "ph", state);
  const drybackId = `sensor.dsc_pot${pot}_dryback_pct`;
  const moistHeld = useHeldReading(moistId);
  const drybackHeld = useHeldReading(drybackId);
  const ecHeld = useHeldReading(ecId);
  const phHeld = useHeldReading(phId);
  const moistSeries = useEntitySeries(moistId, { hours: 6, maxPoints: 72 });
  const ecSeries = useEntitySeries(ecId, { hours: 6, maxPoints: 72 });
  const learnedEcRaw = num(`input_number.dsc_pot${pot}_learned_ec_per_moisture`);
  const learnedEc =
    available(`input_number.dsc_pot${pot}_learned_ec_per_moisture`) &&
    Number.isFinite(learnedEcRaw) &&
    learnedEcRaw !== 0
      ? learnedEcRaw
      : NaN;

  const wantMoistMin = available(`sensor.dsc_pot${pot}_want_moisture_min`)
    ? num(`sensor.dsc_pot${pot}_want_moisture_min`)
    : num(`number.dsc_pot${pot}_want_moisture_min`);
  const wantMoistMax = available(`sensor.dsc_pot${pot}_want_moisture_max`)
    ? num(`sensor.dsc_pot${pot}_want_moisture_max`)
    : num(`number.dsc_pot${pot}_want_moisture_max`);
  const wantEcMin = num(`sensor.dsc_pot${pot}_want_ec_min`);
  const wantEcMax = num(`sensor.dsc_pot${pot}_want_ec_max`);
  const wantPhMin = num(`sensor.dsc_pot${pot}_want_ph_min`);
  const wantPhMax = num(`sensor.dsc_pot${pot}_want_ph_max`);
  const hasWant =
    Number.isFinite(wantMoistMin) &&
    Number.isFinite(wantMoistMax) &&
    (available(`sensor.dsc_pot${pot}_want_moisture_min`) ||
      available(`number.dsc_pot${pot}_want_moisture_min`));
  const hasWantEc = Number.isFinite(wantEcMin) && Number.isFinite(wantEcMax);
  const hasWantPh = Number.isFinite(wantPhMin) && Number.isFinite(wantPhMax);
  const genericStrain =
    !seat.strainDisplay ||
    seat.strainDisplay === "—" ||
    /generic/i.test(seat.strainDisplay);

  const applyTent = async (tent: TentId) => {
    setApplyErr(null);
    try {
      await callService("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${pot}_tent`,
        option: tent,
      });
      // Confirm option stuck (HA may resolve without throwing on invalid option).
      window.setTimeout(() => {
        const now = hass?.states?.[`input_select.dsc_pot${pot}_tent`]?.state || "";
        if (now !== tent) {
          setApplyErr("Tent change did not stick — the hub rejected it. Try again.");
        }
      }, 400);
    } catch {
      setApplyErr("Tent change did not stick — the hub rejected it. Try again.");
    }
  };

  const saveName = () => {
    if (!available(`text.dsc_pot${pot}_plant_name`)) return;
    void callService("text", "set_value", {
      entity_id: `text.dsc_pot${pot}_plant_name`,
      value: nameDraft,
    });
  };

  const saveSprout = () => {
    const id = `datetime.dsc_pot${pot}_sprout_date`;
    if (!available(id) || !sproutDraft) return;
    const iso = sproutDraft.length === 10 ? `${sproutDraft}T00:00:00` : sproutDraft;
    void callService("datetime", "set_value", { entity_id: id, datetime: iso });
  };

  const saveNotes = () => {
    if (seat.rosterSlot == null) return;
    const id = `input_text.dsc_plant_roster_${seat.rosterSlot}_notes`;
    if (!available(id) && !entity(id)) {
      // try anyway for helpers that report briefly unavailable
    }
    void callService("input_text", "set_value", { entity_id: id, value: notesDraft });
  };

  const stageOpts =
    (entity(`select.dsc_pot${pot}_growth_stage`)?.attributes?.options as string[] | undefined) ||
    [];

  return (
    <div className="dsc-seat-panel">
      <div className="dsc-chip-row" style={{ marginBottom: 14 }}>
        {activePotNumbers(state).map((n) => (
          <button
            key={n}
            type="button"
            className={`dsc-chip${n === pot ? " dsc-chip--ok" : ""}`}
            onClick={() => onSelectPot?.(n)}
          >
            <VesselGlyph spec={readPotVessel(n, state, entity)} size={16} /> P{n}
          </button>
        ))}
        <StatusChip label={tentLabel(seat.tent)} tone={seat.tent === "unassigned" ? "muted" : "ok"} />
        {seat.rosterSlot != null ? (
          <StatusChip label={`Roster #${seat.rosterSlot}`} tone="muted" />
        ) : (
          <StatusChip label="Not on roster" tone="warn" />
        )}
        {moistHeld.stale ? <StatusChip label="Reading held" tone="warn" /> : null}
      </div>

      <div className="dsc-seat-layout">
        <Card className="dsc-glass dsc-glass--glow" title="Medium">
          <SoilCrossSection layers={seat.layers} spec={readPotVessel(pot, state, entity)} />
          <PlantExtra pot={pot} />
          <p className="dsc-muted" style={{ marginTop: 10, fontSize: 12 }}>
            {seat.blend || "No blend recorded yet — it appears here after you commit the plant."}
          </p>
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
                    disabled={!available(`text.dsc_pot${pot}_plant_name`)}
                  />
                </label>
                <label>
                  Sprout date
                  <input
                    type="date"
                    value={sproutDraft.slice(0, 10)}
                    onChange={(e) => setSproutDraft(e.target.value)}
                    onBlur={saveSprout}
                    disabled={!available(`datetime.dsc_pot${pot}_sprout_date`)}
                  />
                </label>
                <label>
                  Growth stage
                  <select
                    value={stageDraft}
                    onChange={(e) => {
                      const v = e.target.value;
                      setStageDraft(v);
                      if (!v) return;
                      const id = `select.dsc_pot${pot}_growth_stage`;
                      if (!available(id)) return;
                      void callService("select", "select_option", { entity_id: id, option: v });
                    }}
                    disabled={!available(`select.dsc_pot${pot}_growth_stage`)}
                  >
                    <option value="">—</option>
                    {stageOpts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="dsc-chip-row">
                  <StatusChip label={`Day ${seat.days}`} tone="ok" />
                  <StatusChip label={seat.stage} tone="muted" />
                  <StatusChip label={seat.strainDisplay} tone="muted" />
                </div>
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
                      id: "twin",
                      label: "Open Twin",
                      onSelect: () => navigate("/live/twin"),
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
                  label={`Got M ${moistHeld.stale ? `${Number.isFinite(moistHeld.value) ? moistHeld.value.toFixed(0) : "—"}*` : seat.moisture}`}
                  tone={moistHeld.stale ? "warn" : "ok"}
                />
                <StatusChip label={`EC ${seat.ec}`} tone="muted" />
                <StatusChip label={`pH ${seat.ph}`} tone="muted" />
                <StatusChip
                  label={seat.need}
                  tone={seat.need !== "—" && seat.need !== "OK" ? "warn" : "ok"}
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
              <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
                {Number.isFinite(learnedEc)
                  ? `Learned nutrient use: ${learnedEc.toFixed(3)} EC per moisture point, from this pot's own history.`
                  : "EC over time shown — not enough history yet to learn this pot's nutrient use."}
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
                {seat.recipe || "No recipe recorded for this plant — catalog doses shown only."}
              </p>
              <label className="dsc-seat-editors">
                Roster notes
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  onBlur={saveNotes}
                  disabled={seat.rosterSlot == null}
                />
              </label>
              <div style={{ marginTop: 10 }}>
                <Link to="/grow/compose">
                  <Button teal>Mix in Compose</Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="dsc-col-6">
            <Card className="dsc-glass" title="Live Got chips">
              <div className="dsc-chip-row">
                <StatusChip label={`M ${seat.moisture}`} tone="muted" />
                <StatusChip label={`T ${seat.soilTemp}`} tone="muted" />
                <StatusChip label={`EC ${seat.ec}`} tone="muted" />
                <StatusChip label={`pH ${seat.ph}`} tone="muted" />
                <StatusChip label={`N ${seat.n}`} tone="muted" />
                <StatusChip label={`P ${seat.p}`} tone="muted" />
                <StatusChip label={`K ${seat.k}`} tone="muted" />
              </div>
              <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
                NPK = trend indicators. Unavailable stays —. Held shows last good on blip.
              </p>
            </Card>
          </div>

          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Apply to tent">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want.
              </p>
              <div className="dsc-seat-actions">
                <Button primary={seat.tent === "clone"} onClick={() => setPendingTent("clone")}>
                  2×4
                </Button>
                <Button primary={seat.tent === "main"} onClick={() => setPendingTent("main")}>
                  4×8
                </Button>
                <Button onClick={() => setPendingTent("unassigned")}>Unassigned</Button>
                <Link to="/live/twin">
                  <Button>Open Twin</Button>
                </Link>
              </div>
              <DecisionLayer
                open={pendingTent != null}
                onDismiss={() => setPendingTent(null)}
                onConfirm={() => {
                  const tent = pendingTent;
                  setPendingTent(null);
                  if (tent) void applyTent(tent);
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
                <p>
                  Updates pot {pot} placement on the Twin. Climate Want is unchanged — use Climate or Compose for
                  targets.
                </p>
              </DecisionLayer>
              {applyErr ? (
                <p className="dsc-honesty">
                  <StatusChip label="Tent apply failed" tone="bad" /> {applyErr}
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

export function GrowComposePage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="compose"
        title="Compose"
        subtitle="Build soil blend, roster commit, and Want handoff."
        primaryAction={
          <Button teal onClick={() => navigate("/grow/roster")}>
            Open Roster / Seat
          </Button>
        }
        actions={
          <Button primary onClick={() => navigate("/grow/research")}>
            Browse Catalog
          </Button>
        }
      />
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Catalog traits (height, flowering, chemistry) appear when the catalog has real data — empty fields stay
        empty. After committing, open Roster to assign a seat.
      </p>
      <ComposePlant />
    </div>
  );
}

export function GrowResearchPage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="research"
        title="Research"
        subtitle="Live CannaLib catalog — strains, mediums, nutrients, and lights."
        actions={
          <>
            <Button primary onClick={() => navigate("/grow/compose")}>
              Use in Compose
            </Button>
            <Button teal onClick={() => navigate("/grow/roster")}>
              Open Seat
            </Button>
          </>
        }
      />
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Height, flowering, and chemistry chips appear only when the catalog has real data — gaps are shown as gaps.
        Use in Compose to draft a plant, or Open Seat to work with a plant already on the roster.
      </p>
      <CatalogResearch />
    </div>
  );
}

export function GrowRosterPage() {
  const { entity, state, tick } = useEntityBus();
  const [params, setParams] = useSearchParams();
  void tick;
  const slots = rosterSlots(entity);
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 && isPotInService(raw, state) ? raw : null;

  const openPot = (n: number) => {
    if (!isPotInService(n, state)) return;
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };

  const closePot = () => {
    const next = new URLSearchParams(params);
    next.delete("pot");
    setParams(next, { replace: true });
  };

  return (
    <div className="dsc-page">
      <PageHeader
        icon="roster"
        title="Roster"
        subtitle="Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose."
        primaryAction={
          <Link to="/grow/compose">
            <Button primary>Use in Compose</Button>
          </Link>
        }
      />
      <div style={{ marginBottom: 14 }}>
        <CropScheduler compact />
      </div>
      <Card className="dsc-glass" title="Roster" icon="roster">
        {!slots.length ? (
          <p className="dsc-muted" style={{ marginTop: 0 }}>
            No plants in roster yet. Commit from Compose, then assign a pot.
          </p>
        ) : (
          <table className="dsc-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Name</th>
                <th>Strain</th>
                <th>Status</th>
                <th>Pot</th>
                <th>Need</th>
                <th>Tent</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => {
                const p = Number(s.pot);
                const joined = p >= 1 && p <= 4;
                const potLive = joined && isPotInService(p, state);
                const potTent = joined ? readTent(state, p) : "unassigned";
                const tent = tentLabel(potTent !== "unassigned" ? potTent : normalizeTent(s.tent));
                const need = joined ? state(`sensor.dsc_pot${p}_need_summary`, "—") : "—";
                const vessel = joined ? readPotVessel(p, state, entity) : null;
                return (
                  <tr
                    key={s.slot}
                    onClick={() => {
                      if (potLive) openPot(p);
                    }}
                    style={potLive ? { cursor: "pointer" } : undefined}
                  >
                    <td>#{s.slot}</td>
                    <td>{s.nickname || "—"}</td>
                    <td>{s.strain || "—"}</td>
                    <td>{s.status || "—"}</td>
                    <td>
                      {joined ? (
                        <span className="dsc-chip-row">
                          {vessel ? <VesselGlyph spec={vessel} size={22} /> : null}
                          P{p}
                          {!potLive ? <StatusChip label="Out of service" tone="warn" /> : null}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{need}</td>
                    <td>
                      <StatusChip label={tent} tone="muted" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <SlideDrawer
        open={pot != null}
        onClose={closePot}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      >
        {pot != null ? <PlantSeatPanel pot={pot} onSelectPot={openPot} /> : null}
      </SlideDrawer>
    </div>
  );
}
