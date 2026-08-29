import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Kpi, PageHeader, StatusChip } from "../components/ui";
import { SlideDrawer } from "../components/chrome";
import { DutyStrip } from "../components/DutyStrip";
import { SoilTestWizard } from "../components/SoilTestWizard";
import { HelpTip } from "../components/HelpTip";
import { useEntityBus } from "../hooks/useEntityBus";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useFleet } from "../hooks/useFleet";
import { useInspector } from "../components/InspectorHost";
import { ArcGauge, Sparkline } from "../viz/charts";
import { defaultBandMargin, toneCssColor, zoneTone } from "../lib/zoneTone";
import {
  KIT_PROBE_NUMBERS,
  buildPlantSeat,
  inServiceCount,
  isPotInServiceWithFleet,
  potGotEntity,
  probeLabel,
  tentLabel,
} from "../lib/seatModel";
import { potWantBand } from "../lib/tentWant";
import { readPotTrust } from "../lib/potTrust";
import { readPotVessel } from "../lib/vesselSpec";
import { VesselGlyph } from "../components/VesselGlyph";
import { PlantSeatPanel } from "./GrowPages";
import { fmtDurationMs } from "../lib/formatDuration";
import { getProbeStations, type ProbeStation } from "../lib/fleetApi";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function LiveRootPage() {
  const { state, entity, tick, num } = useEntityBus();
  const fleet = useFleet();
  const inspector = useInspector();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  void tick;
  const pots = [...KIT_PROBE_NUMBERS]
    .map((n) => ({
      n,
      seat: buildPlantSeat(n, { state, entity }),
      oos: !isPotInServiceWithFleet(n, state, fleet),
    }))
    .sort((a, b) => Number(a.oos) - Number(b.oos));
  const svc = inServiceCount(state, [...KIT_PROBE_NUMBERS]);
  const raw = Number(params.get("pot") || 0);
  const pot =
    (KIT_PROBE_NUMBERS as readonly number[]).includes(raw) &&
    isPotInServiceWithFleet(raw, state, fleet)
      ? raw
      : null;
  const matHours = num("sensor.dsc_growmat_runtime_today");
  const matSec = num("sensor.dsc_heatmat_relay_on_time");
  const [probeStations, setProbeStations] = useState<ProbeStation[]>([]);
  const [soilWizardOpen, setSoilWizardOpen] = useState(false);

  useEffect(() => {
    getProbeStations()
      .then((list) =>
        setProbeStations(
          list.filter((st) => {
            const m = /^pot(\d+)$/i.exec(st.seat_id);
            return m != null && (KIT_PROBE_NUMBERS as readonly number[]).includes(Number(m[1]));
          }),
        ),
      )
      .catch(() => setProbeStations([]));
  }, [soilWizardOpen]);

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
        subtitle={`${svc.inService} of ${svc.total} probes in service. Probes without sensors show no data.`}
        actions={
          <HelpTip title="Got vs idle probe">
            <p>
              Probe cards show <b>Got</b> soil from the assigned plant&apos;s probe (or soft-cal offset). Idle mobile
              probes on the thereabouts strip report their <em>home probe</em> last-known — not the plant you are
              testing.
            </p>
            <p>
              Example: a mobile probe parked at Probe 2 home while you soil-test another vessel → thereabouts still
              reads Probe 2 moisture.
            </p>
          </HelpTip>
        }
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
              Mat loop uses per-probe sense with a plausibility filter. Metric click opens inspector; card opens the
              plant panel.
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

        {probeStations.length ? (
          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Probe stations · thereabouts" icon="root">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Idle mobile probes report last-known soil at their home probe — not the plant under test.
              </p>
              <div className="dsc-grid">
                {probeStations.map((st) => {
                  const moist = st.thereabouts?.moisture_pct;
                  const soilT = st.thereabouts?.soil_temp_c;
                  const seatProbe = /^pot(\d+)$/i.exec(st.seat_id);
                  const seatTitle = seatProbe ? probeLabel(Number(seatProbe[1])) : st.seat_id;
                  const homeProbe = /^pot(\d+)$/i.exec(st.idle_home_pot_id || "");
                  const homeLabel = homeProbe
                    ? probeLabel(Number(homeProbe[1]))
                    : st.idle_home_pot_id || "—";
                  return (
                    <div key={st.seat_id} className="dsc-col-6">
                      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
                        <strong>{seatTitle}</strong>
                        <StatusChip label={st.tent} tone="muted" />
                        <StatusChip
                          label={st.reading_mode === "idle" ? "IDLE" : st.reading_mode.toUpperCase()}
                          tone={st.reading_mode === "idle" ? "ok" : "warn"}
                        />
                        <StatusChip label={st.online ? "ONLINE" : "OFFLINE"} tone={st.online ? "ok" : "bad"} />
                      </div>
                      <p className="dsc-muted" style={{ margin: 0, fontSize: 12 }}>
                        Home {homeLabel} · moisture{" "}
                        {moist != null && Number.isFinite(Number(moist)) ? `${Number(moist).toFixed(1)} %` : "—"} · soil{" "}
                        {soilT != null && Number.isFinite(Number(soilT)) ? `${Number(soilT).toFixed(1)} °C` : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="dsc-row-actions" style={{ marginTop: 12 }}>
                <Button variant="primary" onClick={() => setSoilWizardOpen(true)}>
                  Run soil test
                </Button>
                <Button variant="secondary" onClick={() => navigate("/fleet/calibrate")}>
                  Soil cal
                </Button>
              </div>
            </Card>
          </div>
        ) : null}

        {pots.map(({ n, oos }) => (
          <div key={n} className="dsc-col-12">
            <RootProbeCard pot={n} oos={oos} onOpen={() => (oos ? undefined : openPot(n))} />
          </div>
        ))}
      </div>

      <SlideDrawer
        open={pot != null}
        onClose={closePot}
        title={
          pot != null
            ? `${probeLabel(pot)}${
                (() => {
                  const name = pots.find((p) => p.n === pot)?.seat.plantName;
                  return name && name !== "—" ? ` · ${name}` : "";
                })()
              }`
            : "Probe"
        }
        wide
      >
        {pot != null ? (
          <PlantSeatPanel pot={pot} onSelectPot={openPot} onRetired={closePot} />
        ) : null}
      </SlideDrawer>

      <SlideDrawer open={soilWizardOpen} onClose={() => setSoilWizardOpen(false)} title="Soil test">
        <SoilTestWizard onClose={() => setSoilWizardOpen(false)} />
      </SlideDrawer>

      <p className="dsc-muted" style={{ marginTop: 8 }}>
        <button type="button" className="dsc-chip" onClick={() => navigate("/live/climate")}>
          Climate Want
        </button>
      </p>
    </div>
  );
}

function RootProbeCard({ pot, oos, onOpen }: { pot: number; oos: boolean; onOpen: () => void }) {
  const { state, entity } = useEntityBus();
  const inspector = useInspector();
  const seat = buildPlantSeat(pot, { state, entity });
  const trust = readPotTrust(pot, state);
  const moistId = potGotEntity(pot, "moisture", state);
  const ecId = potGotEntity(pot, "ec", state);
  const phId = potGotEntity(pot, "ph", state);
  const nId = `sensor.dsc_probe${pot}_soil_nitrogen`;
  const pId = `sensor.dsc_probe${pot}_soil_phosphorus`;
  const kId = `sensor.dsc_probe${pot}_soil_potassium`;
  const dryId = `sensor.dsc_probe${pot}_dryback_pct`;
  const rateId = `sensor.dsc_probe${pot}_soil_moisture_rate`;
  const series = useEntitySeries(moistId, { hours: 6, maxPoints: 48 });
  const dry = useHeldReading(dryId);
  const soil = useHeldReading(`sensor.dsc_probe${pot}_soil_temperature`);
  const moist = useHeldReading(moistId);
  const ec = useHeldReading(ecId);
  const ph = useHeldReading(phId);
  const rate = useHeldReading(rateId);
  const nHeld = useHeldReading(nId);
  const pHeld = useHeldReading(pId);
  const kHeld = useHeldReading(kId);
  const mBand = potWantBand(pot, "moisture", state);
  const ecBand = potWantBand(pot, "ec", state);
  const phBand = potWantBand(pot, "ph", state);
  const dryBand = { min: 0, max: 45 };
  const showDryback = Number.isFinite(dry.value);
  const fmtChip = (v: number, digits = 0) => (Number.isFinite(v) ? v.toFixed(digits) : "—");

  const open = (id: string, label: string, unit?: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    inspector.open({ entityId: id, label, unit });
  };

  return (
    <Card className={`dsc-glass dsc-pot-card${oos ? " is-oos" : ""}`} title={probeLabel(pot)} icon="root">
      <div className="dsc-pot-card-head" onClick={onOpen} role="presentation">
        <VesselGlyph spec={readPotVessel(pot, state, entity)} size={28} />
        <div>
          <strong>{oos ? "Out of service" : seat.plantName}</strong>
          <div className="dsc-chip-row">
            <StatusChip label={tentLabel(seat.tent)} tone={oos || seat.tent === "unassigned" ? "muted" : "ok"} />
            <StatusChip
              label={oos ? "No data" : trust.blockNeedAct ? `${seat.need} (no act)` : `Need ${seat.need}`}
              tone={oos ? "muted" : seat.need && seat.need !== "ok" && seat.need !== "—" ? "warn" : "ok"}
            />
            {trust.labels.map((l) => (
              <StatusChip key={l} label={l} tone="warn" />
            ))}
          </div>
        </div>
        <Sparkline
          series={series.series}
          color={toneCssColor(
            zoneTone({
              value: moist.value,
              band: mBand,
              margin: defaultBandMargin(mBand),
              stale: moist.stale,
              available: Number.isFinite(moist.value),
            }),
          )}
          width={140}
          height={36}
        />
      </div>
      {oos ? (
        <p className="dsc-muted">Out of service — not measuring.</p>
      ) : (
        <>
          <div className="dsc-gauge-row dsc-gauge-row--root">
            <ArcGauge
              label="Moisture"
              value={moist.value}
              min={0}
              max={100}
              unit="%"
              band={mBand}
              stale={moist.stale}
              onClick={() =>
                inspector.open({ entityId: moistId, label: `${probeLabel(pot)} moisture`, unit: "%" })
              }
            />
            <ArcGauge
              label="Soil °C"
              value={soil.value}
              min={10}
              max={40}
              unit="°C"
              stale={soil.stale}
              onClick={() =>
                inspector.open({
                  entityId: `sensor.dsc_probe${pot}_soil_temperature`,
                  label: `${probeLabel(pot)} soil T`,
                  unit: "°C",
                })
              }
            />
            {showDryback ? (
              <ArcGauge
                label="Dryback"
                value={dry.value}
                min={0}
                max={60}
                unit="%"
                band={dryBand}
                stale={dry.stale}
                onClick={() =>
                  inspector.open({ entityId: dryId, label: `${probeLabel(pot)} dryback`, unit: "%" })
                }
              />
            ) : null}
            <ArcGauge
              label="EC"
              value={ec.value}
              min={0}
              max={3000}
              unit=""
              band={ecBand}
              stale={ec.stale}
              onClick={() => inspector.open({ entityId: ecId, label: `${probeLabel(pot)} EC` })}
            />
            <ArcGauge
              label="pH"
              value={ph.value}
              min={4}
              max={8}
              unit=""
              band={phBand}
              stale={ph.stale}
              onClick={() => inspector.open({ entityId: phId, label: `${probeLabel(pot)} pH` })}
            />
          </div>
          <div className="dsc-npk-row">
            <button type="button" className="dsc-npk-hit" onClick={open(nId, `${probeLabel(pot)} N (from EC)`)}>
              N {fmtChip(nHeld.value, 0)}
              {nHeld.stale ? " *" : ""}
              <span className="dsc-npk-hint">from EC</span>
            </button>
            <button type="button" className="dsc-npk-hit" onClick={open(pId, `${probeLabel(pot)} P (from EC)`)}>
              P {fmtChip(pHeld.value, 0)}
              {pHeld.stale ? " *" : ""}
              <span className="dsc-npk-hint">from EC</span>
            </button>
            <button type="button" className="dsc-npk-hit" onClick={open(kId, `${probeLabel(pot)} K (from EC)`)}>
              K {fmtChip(kHeld.value, 0)}
              {kHeld.stale ? " *" : ""}
              <span className="dsc-npk-hint">from EC</span>
            </button>
            {!Number.isFinite(rate.value) ? (
              <span className="dsc-npk-hit dsc-npk-hit--static" title="No moisture-rate entity on this bus">
                Rate · no channel
              </span>
            ) : (
              <button type="button" className="dsc-npk-hit" onClick={open(rateId, `${probeLabel(pot)} moisture rate`)}>
                Rate {rate.value.toFixed(2)}
                {rate.stale ? " *" : ""}
              </button>
            )}
            {!showDryback ? (
              <span className="dsc-npk-hit dsc-npk-hit--static" title="No dryback entity on this bus">
                Dryback · no channel
              </span>
            ) : null}
          </div>
        </>
      )}
    </Card>
  );
}
