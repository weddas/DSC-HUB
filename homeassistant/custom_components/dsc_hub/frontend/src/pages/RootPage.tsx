import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Kpi, PageHeader, StatusChip } from "../components/ui";
import { SlideDrawer } from "../components/chrome";
import { DutyStrip } from "../components/DutyStrip";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useInspector } from "../components/InspectorHost";
import { ArcGauge, Sparkline } from "../viz/charts";
import {
  ALL_POT_NUMBERS,
  buildPlantSeat,
  inServiceCount,
  isPotInService,
  potGotEntity,
  tentLabel,
} from "../lib/seatModel";
import { potWantBand } from "../lib/tentWant";
import { readPotTrust } from "../lib/potTrust";
import { readPotVessel } from "../lib/vesselSpec";
import { VesselGlyph } from "../components/VesselGlyph";
import { PlantSeatPanel } from "./GrowPages";
import { fmtDurationMs } from "../lib/formatDuration";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function LiveRootPage() {
  const { state, entity, tick, num } = useHass();
  const inspector = useInspector();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  void tick;
  const pots = [...ALL_POT_NUMBERS]
    .map((n) => ({ n, seat: buildPlantSeat(n, { state, entity }), oos: !isPotInService(n, state) }))
    .sort((a, b) => Number(a.oos) - Number(b.oos));
  const svc = inServiceCount(state);
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 && isPotInService(raw, state) ? raw : null;
  const matHours = num("sensor.dsc_growmat_runtime_today");
  const matSec = num("sensor.dsc_heatmat_relay_on_time");

  const openPot = (n: number) => {
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
        icon="root"
        title="Root"
        subtitle={`${svc.inService} of ${svc.total} pots in service — OOS labeled, never fake Got.`}
      />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi
            label="Coldest root"
            value={fmt(num("sensor.dsc_coldest_root_zone_temp"))}
            unit="°C"
            onClick={() =>
              inspector.open({
                entityId: "sensor.dsc_coldest_root_zone_temp",
                label: "Coldest root",
                unit: "°C",
              })
            }
          />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="Heat mat today"
            value={Number.isFinite(matHours) ? matHours.toFixed(1) : fmtDurationMs(matSec * 1000)}
            unit={Number.isFinite(matHours) ? "h" : ""}
            sub={Number.isFinite(matSec) ? `session ${fmtDurationMs(matSec * 1000)}` : undefined}
            onClick={() =>
              inspector.open({
                entityId: "switch.dsc_hub_grow_mat_demand",
                label: "Heat mat",
                kind: "binary",
                runtimeToday: "sensor.dsc_growmat_runtime_today",
                demandEntity: "switch.dsc_hub_grow_mat_demand",
              })
            }
          />
        </div>
        <div className="dsc-col-4">
          <Card title="Notes">
            <p className="dsc-muted" style={{ margin: 0 }}>
              Mat loop uses per-pot sense with plausibility filter. Metric click opens inspector; card chrome opens the seat.
            </p>
          </Card>
        </div>

        <div className="dsc-col-12">
          <DutyStrip
            entityId="switch.dsc_hub_grow_mat_demand"
            hours={24}
            label="Heat mat 24h"
            onClick={() =>
              inspector.open({
                entityId: "switch.dsc_hub_grow_mat_demand",
                label: "Heat mat",
                kind: "binary",
                runtimeToday: "sensor.dsc_growmat_runtime_today",
                demandEntity: "switch.dsc_hub_grow_mat_demand",
              })
            }
          />
        </div>

        {pots.map(({ n, seat, oos }) => (
          <div key={n} className="dsc-col-12">
            <RootPotCard pot={n} oos={oos} onOpenSeat={() => (oos ? undefined : openPot(n))} />
            {oos ? null : (
              <button type="button" className="dsc-btn" style={{ marginTop: 6 }} onClick={() => openPot(n)}>
                Open {seat.plantName !== "—" ? seat.plantName : `POT${n}`} seat
              </button>
            )}
          </div>
        ))}
      </div>

      <SlideDrawer
        open={pot != null}
        onClose={closePot}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      >
        {pot != null ? <PlantSeatPanel pot={pot} onSelectPot={openPot} /> : null}
      </SlideDrawer>
      <p className="dsc-muted" style={{ marginTop: 8 }}>
        <button type="button" className="dsc-chip" onClick={() => navigate("/live/climate")}>
          Climate Want
        </button>
      </p>
    </div>
  );
}

function RootPotCard({ pot, oos, onOpenSeat }: { pot: number; oos: boolean; onOpenSeat: () => void }) {
  const { state, entity, available } = useHass();
  const inspector = useInspector();
  const seat = buildPlantSeat(pot, { state, entity });
  const trust = readPotTrust(pot, state);
  const moistId = potGotEntity(pot, "moisture", state);
  const series = useEntitySeries(moistId, { hours: 6, maxPoints: 48 });
  const dry = useHeldReading(`sensor.dsc_pot${pot}_dryback_pct`);
  const soil = useHeldReading(`sensor.dsc_pot${pot}_soil_temperature`);
  const moist = useHeldReading(moistId);
  const ec = useHeldReading(potGotEntity(pot, "ec", state));
  const ph = useHeldReading(potGotEntity(pot, "ph", state));
  const rate = useHeldReading(`sensor.dsc_pot${pot}_soil_moisture_rate`);
  const mBand = potWantBand(pot, "moisture", state);
  const ecBand = potWantBand(pot, "ec", state);
  const phBand = potWantBand(pot, "ph", state);
  const dryBand = mBand && mBand.max !== 45 ? undefined : { min: 0, max: 45 };

  const open = (id: string, label: string, unit?: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    inspector.open({ entityId: id, label, unit });
  };

  return (
    <Card className={`dsc-glass dsc-pot-card${oos ? " is-oos" : ""}`} title={`Pot ${pot}`} icon="root">
      <div className="dsc-pot-card-head" onClick={onOpenSeat} role="presentation">
        <VesselGlyph spec={readPotVessel(pot, state, entity)} size={28} />
        <div>
          <strong>{oos ? "OOS" : seat.plantName}</strong>
          <div className="dsc-chip-row">
            <StatusChip label={tentLabel(seat.tent)} tone={oos || seat.tent === "unassigned" ? "muted" : "ok"} />
            <StatusChip
              label={oos ? "OOS" : trust.blockNeedAct ? `${seat.need} (no act)` : `Need ${seat.need}`}
              tone={oos ? "muted" : seat.need && seat.need !== "ok" && seat.need !== "—" ? "warn" : "ok"}
            />
            {trust.labels.map((l) => (
              <StatusChip key={l} label={l} tone="warn" />
            ))}
          </div>
        </div>
        <Sparkline series={series.series} color="var(--dsc-blue)" width={140} height={36} />
      </div>
      {oos ? (
        <p className="dsc-muted">Parked — no fake Got.</p>
      ) : (
        <div className="dsc-gauge-row">
          <ArcGauge label="Moisture" value={moist.value} min={0} max={100} unit="%" band={mBand} stale={moist.stale} onClick={() => inspector.open({ entityId: moistId, label: `P${pot} moisture`, unit: "%" })} />
          <ArcGauge label="Soil °C" value={soil.value} min={10} max={40} unit="°C" stale={soil.stale} onClick={() => inspector.open({ entityId: `sensor.dsc_pot${pot}_soil_temperature`, label: `P${pot} soil T`, unit: "°C" })} />
          <ArcGauge label="Dryback" value={dry.value} min={0} max={100} unit="%" band={dryBand} stale={dry.stale} onClick={() => inspector.open({ entityId: `sensor.dsc_pot${pot}_dryback_pct`, label: `P${pot} dryback`, unit: "%" })} />
          <ArcGauge label="EC" value={ec.value} min={0} max={3000} unit="" band={ecBand} stale={ec.stale} onClick={() => inspector.open({ entityId: potGotEntity(pot, "ec", state), label: `P${pot} EC` })} />
          <ArcGauge label="pH" value={ph.value} min={4} max={8} unit="" band={phBand} stale={ph.stale} onClick={() => inspector.open({ entityId: potGotEntity(pot, "ph", state), label: `P${pot} pH` })} />
          <button type="button" className="dsc-npk-hit" onClick={open(`sensor.dsc_pot${pot}_soil_nitrogen`, `P${pot} N`)}>
            N {available(`sensor.dsc_pot${pot}_soil_nitrogen`) ? seat.n : "—"}
          </button>
          <button type="button" className="dsc-npk-hit" onClick={open(`sensor.dsc_pot${pot}_soil_phosphorus`, `P${pot} P`)}>
            P {available(`sensor.dsc_pot${pot}_soil_phosphorus`) ? seat.p : "—"}
          </button>
          <button type="button" className="dsc-npk-hit" onClick={open(`sensor.dsc_pot${pot}_soil_potassium`, `P${pot} K`)}>
            K {available(`sensor.dsc_pot${pot}_soil_potassium`) ? seat.k : "—"}
          </button>
          <button
            type="button"
            className="dsc-npk-hit"
            onClick={open(`sensor.dsc_pot${pot}_soil_moisture_rate`, `P${pot} moisture rate`)}
          >
            Rate {Number.isFinite(rate.value) ? rate.value.toFixed(2) : "—"}
            {rate.stale ? " *" : ""}
          </button>
        </div>
      )}
    </Card>
  );
}
