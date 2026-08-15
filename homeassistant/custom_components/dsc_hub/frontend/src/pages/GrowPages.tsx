import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { OverflowMenu, SoilCrossSection, SlideDrawer } from "../components/chrome";
import { HistoryDrawer } from "../components/HistoryDrawer";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { ArcGauge, MultiLineChart } from "../viz/charts";
import {
  activePotNumbers,
  buildPlantSeat,
  isPotInService,
  potGotEntity,
  readTent,
  rosterSlots,
  tentLabel,
  type TentId,
} from "../lib/seatModel";

/** Shared seat body for Root / Roster drawers (Surface 7.1). */
export function PlantSeatPanel({
  pot,
  onSelectPot,
}: {
  pot: number;
  onSelectPot?: (n: number) => void;
}) {
  const { state, entity, callService, available, tick, num } = useHass();
  const navigate = useNavigate();
  void tick;
  const seat = buildPlantSeat(pot, { state, entity });
  const [nameDraft, setNameDraft] = useState(seat.plantName === "—" ? "" : seat.plantName);
  const [sproutDraft, setSproutDraft] = useState(seat.sprout === "—" ? "" : seat.sprout);
  const [stageDraft, setStageDraft] = useState(seat.growthStage === "—" ? "" : seat.growthStage);
  const [notesDraft, setNotesDraft] = useState(seat.notes === "—" ? "" : seat.notes);
  const [applyErr, setApplyErr] = useState<string | null>(null);
  const [hist, setHist] = useState<{ id: string; label: string; unit: string } | null>(null);

  useEffect(() => {
    setNameDraft(seat.plantName === "—" ? "" : seat.plantName);
    setSproutDraft(seat.sprout === "—" ? "" : seat.sprout);
    setStageDraft(seat.growthStage === "—" ? "" : seat.growthStage);
    setNotesDraft(seat.notes === "—" ? "" : seat.notes);
  }, [pot, seat.plantName, seat.sprout, seat.growthStage, seat.notes]);

  const moistId = potGotEntity(pot, "moisture", state);
  const ecId = potGotEntity(pot, "ec", state);
  const phId = potGotEntity(pot, "ph", state);
  const drybackId = `sensor.dsc_pot${pot}_dryback_pct`;
  const moistHeld = useHeldReading(moistId);
  const drybackHeld = useHeldReading(drybackId);
  const moistSeries = useEntitySeries(moistId, { hours: 6, maxPoints: 72 });
  const ecSeries = useEntitySeries(ecId, { hours: 6, maxPoints: 72 });
  const learnedEcRaw = num(`input_number.dsc_pot${pot}_learned_ec_per_moisture`);
  const learnedEc =
    available(`input_number.dsc_pot${pot}_learned_ec_per_moisture`) &&
    Number.isFinite(learnedEcRaw) &&
    learnedEcRaw !== 0
      ? learnedEcRaw
      : NaN;

  const wantMoistMin = num(`number.dsc_pot${pot}_want_moisture_min`);
  const wantMoistMax = num(`number.dsc_pot${pot}_want_moisture_max`);
  const hasWant =
    Number.isFinite(wantMoistMin) &&
    Number.isFinite(wantMoistMax) &&
    available(`number.dsc_pot${pot}_want_moisture_min`);
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
        const now = state(`input_select.dsc_pot${pot}_tent`, "");
        if (now !== tent) {
          setApplyErr("Tent apply failed — check helper options (clone|main|unassigned).");
        }
      }, 400);
    } catch {
      setApplyErr("Tent apply failed — check helper options (clone|main|unassigned).");
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

  const saveStage = () => {
    const id = `select.dsc_pot${pot}_growth_stage`;
    if (!available(id) || !stageDraft) return;
    void callService("select", "select_option", { entity_id: id, option: stageDraft });
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
            P{n}
          </button>
        ))}
        <StatusChip label={tentLabel(seat.tent)} tone={seat.tent === "unassigned" ? "muted" : "ok"} />
        {seat.rosterSlot != null ? (
          <StatusChip label={`Roster #${seat.rosterSlot}`} tone="muted" />
        ) : (
          <StatusChip label="No roster join" tone="warn" />
        )}
        {moistHeld.stale ? <StatusChip label="HELD Got" tone="warn" /> : null}
      </div>

      <div className="dsc-seat-layout">
        <Card className="dsc-glass dsc-glass--glow" title="Medium">
          <SoilCrossSection layers={seat.layers} />
          <p className="dsc-muted" style={{ marginTop: 10, fontSize: 12 }}>
            {seat.blend || "Blend lives on roster after commit — not invented here."}
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
                      setStageDraft(e.target.value);
                    }}
                    onBlur={saveStage}
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
                <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
                  Want moisture {wantMoistMin}–{wantMoistMax}%
                </p>
              ) : (
                <p className="dsc-honesty" style={{ margin: "8px 0 0" }}>
                  <StatusChip label="No catalog Want" tone="warn" />{" "}
                  {genericStrain
                    ? "Generic / empty strain — Want bands not invented."
                    : "Custom Want helpers missing — Got + Need only."}
                </p>
              )}
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
                  ? `EC consumption honesty: learned ${learnedEc.toFixed(3)} EC per moisture (not feed invent).`
                  : "EC over time shown — no learned_ec_per_moisture yet (not invented)."}
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
                {seat.recipe || "No roster recipe — catalog doses only, never invented."}
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
                <Button primary={seat.tent === "clone"} onClick={() => void applyTent("clone")}>
                  Clone 2×4
                </Button>
                <Button primary={seat.tent === "main"} onClick={() => void applyTent("main")}>
                  Main 4×8
                </Button>
                <Button onClick={() => void applyTent("unassigned")}>Unassigned</Button>
                <Link to="/live/twin">
                  <Button>Open Twin</Button>
                </Link>
              </div>
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
        Densified catalog traits (height / flowering / chem) show when the index has them.
        Empty catalog fields stay empty — Compose does not invent Want bands or strain genetics. After
        commit, open Roster to assign a seat.
      </p>
      <LegacyCardHost tag="dsc-build-plant-card" config={{}} />
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
        subtitle="Catalog browser over /local/dsc-catalog indexes."
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
        Catalog gaps are honesty, not placeholders. Height / flowering / chem chips come from densified
        indexes when present. Use in Compose to draft a plant; Open Seat to assign
        an existing roster row — neither invents missing Want/Got.
      </p>
      <LegacyCardHost tag="dsc-catalog-browse-card" config={{}} />
    </div>
  );
}

export function GrowRosterPage() {
  const { entity, state, tick } = useHass();
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
                <th>Tent</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => {
                const p = Number(s.pot);
                const potLive = p >= 1 && p <= 4 && isPotInService(p, state);
                const tent = potLive ? tentLabel(readTent(state, p)) : "—";
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
                    <td>{potLive ? `P${p}` : "—"}</td>
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
