import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, StatusTag } from "../components/ui";
import { Panel, PhaseChip } from "../components/Panel";
import { DrybackChart } from "../components/DrybackChart";
import { HeatLines } from "../components/EquipmentTiles";
import { paths } from "../lib/paths";
import { phaseLabel, probeSteering, type RootSteeringSnapshot } from "../lib/rootSteering";
import { phaseFromStage } from "../hooks/useZones";
import { DecisionLayer } from "../components/DecisionLayer";
import { useBrainRefresh } from "../hooks/useBrain";
import { SlideDrawer } from "../components/chrome";
import { DutyStrip } from "../components/DutyStrip";
import { SoilTestWizard } from "../components/SoilTestWizard";
import { useEntityBus } from "../hooks/useEntityBus";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useFleet } from "../hooks/useFleet";
import { useInspector } from "../components/InspectorHost";
import { ArcGauge, Sparkline } from "../viz/charts";
import { defaultBandMargin, toneCssColor, zoneTone } from "../lib/zoneTone";
import {
  KIT_PROBE_NUMBERS,
  buildPlantProbe,
  inServiceCountWithFleet,
  isProbeInServiceWithFleet,
  probeGotEntity,
  probeLabel,
  tentLabel,
} from "../lib/probeModel";
import { probeWantBand } from "../lib/tentWant";
import { readProbeTrust } from "../lib/probeTrust";
import { readProbeVessel } from "../lib/vesselSpec";
import { VesselGlyph } from "../components/VesselGlyph";
import { PlantProbePanel } from "./GrowPages";
import { fmtDurationMs } from "../lib/formatDuration";
import { getProbeStations, post_irrigation_shot, set_root_steering_override, type ProbeStation } from "../lib/fleetApi";

export function LiveRootPage() {
  const { state, entity, tick, num } = useEntityBus();
  const fleet = useFleet();
  const inspector = useInspector();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const probes = [...KIT_PROBE_NUMBERS]
    .map((n) => ({
      n,
      plant: buildPlantProbe(n, { state, entity }),
      oos: !isProbeInServiceWithFleet(n, state, fleet),
    }))
    .sort((a, b) => Number(a.oos) - Number(b.oos));
  const svc = inServiceCountWithFleet(state, fleet, [...KIT_PROBE_NUMBERS]);
  const raw = Number(params.get("pot") || 0);
  const probe =
    (KIT_PROBE_NUMBERS as readonly number[]).includes(raw) &&
    isProbeInServiceWithFleet(raw, state, fleet)
      ? raw
      : null;
  const matHours = num("sensor.dsc_growmat_runtime_today");
  const matSec = num("sensor.dsc_heatmat_relay_on_time");
  const [probeStations, setProbeStations] = useState<ProbeStation[]>([]);
  const [soilWizardOpen, setSoilWizardOpen] = useState(false);
  const refreshBrain = useBrainRefresh();
  const steering = (fleet.root_steering ?? null) as RootSteeringSnapshot | null;
  const steerOverride = Boolean(steering?.override);
  const bindings = (fleet.system.zigbee_device_bindings ?? {}) as Record<string, { role?: string; zone?: string }>;
  const pumpBound = Object.values(bindings).some((b) => String(b?.role ?? "") === "plug_pump");
  const matOn = state("switch.dsc_hub_grow_mat_demand") === "on";
  const coldest = num("sensor.dsc_coldest_root_zone_temp");
  const matLo = num("number.dsc_hub_mat_root_zone_low", NaN);
  const matHi = num("number.dsc_hub_mat_root_zone_high", NaN);
  const rootFault = state("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on";
  const [shotBusy, setShotBusy] = useState<number | null>(null);
  const [shotMsg, setShotMsg] = useState<string | null>(null);
  const fireShot = async (n: number) => {
    setShotBusy(n);
    setShotMsg(null);
    try {
      const res = await post_irrigation_shot(`pot${n}`, 2);
      setShotMsg(res.ok ? `Shot sent to ${probeLabel(n)} · 2 s.` : `Shot withheld: ${res.detail ?? "no pump bound"}`);
    } catch (e) {
      setShotMsg(e instanceof Error ? e.message : "shot failed");
    } finally {
      setShotBusy(null);
    }
  };
  const [pendingSteer, setPendingSteer] = useState(false);
  const [steerBusy, setSteerBusy] = useState(false);
  const [steerMsg, setSteerMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    getProbeStations()
      .then((list) => {
        if (cancelled) return;
        setProbeStations(
          list.filter((st) => {
            const m = /^pot(\d+)$/i.exec(st.seat_id);
            return m != null && (KIT_PROBE_NUMBERS as readonly number[]).includes(Number(m[1]));
          }),
        );
      })
      .catch(() => {
        if (!cancelled) setProbeStations([]);
      });
    return () => {
      cancelled = true;
    };
    // tick: Settings dock patches must reach Root without opening Soil test
  }, [soilWizardOpen, tick]);

  const openProbe = (n: number) => {
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };
  const closeProbe = () => {
    const next = new URLSearchParams(params);
    next.delete("pot");
    setParams(next, { replace: true });
  };

  return (
    <div className="dsc-page">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Live · Root</div>
          <h1 className="dsc-headline">Grey means no data.</h1>
          <p className="dsc-subline">
            {svc.inService} of {svc.total} probes in service. Dry-back and EC stacking come from the probes; shots need a pump.
          </p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag
            label={rootFault ? "ROOT PROBE FAULT" : Number.isFinite(coldest) ? `COLDEST ROOT ${coldest.toFixed(1)} °C` : "COLDEST ROOT —"}
            tone={rootFault ? "bad" : Number.isFinite(coldest) && Number.isFinite(matLo) && coldest < matLo ? "warn" : "muted"}
            live={rootFault}
            onClick={() => inspector.open({ entityId: "sensor.dsc_coldest_root_zone_temp", label: "Coldest root", unit: "°C" })}
          />
          <StatusTag
            label={`MAT ${matOn ? "ON" : "OFF"}${Number.isFinite(matHours) ? ` · ${matHours.toFixed(1)} H TODAY` : ""}`}
            tone={matOn ? "ok" : "muted"}
            live={matOn}
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
          <StatusTag
            label={steerOverride ? "STEERING MANUAL" : "STEERING AUTO · P1–P3"}
            tone={steerOverride ? "warn" : "ok"}
            onClick={() => setPendingSteer(true)}
            title="Auto: the brain reads dry-back and gates act windows. Manual: timing is yours."
          />
          <StatusTag label={pumpBound ? "PUMP BOUND" : "NO PUMP · SHOTS WITHHELD"} tone={pumpBound ? "ok" : "muted"} dashed={!pumpBound} title={pumpBound ? "A Zigbee plug_pump is bound" : "Bind a Zigbee plug as plug_pump in Settings › Device to enable shots"} />
        </div>
      </header>

      <div className="dsc-root-grid">
        <Panel legendIcon="heater-mat" legend="ROOT ZONE · HEAT MAT" tone={rootFault ? "bad" : matOn ? "ok" : "muted"} live={rootFault}>
          <div className="dsc-root-mat">
            <div className="dsc-root-mat-head">
              <HeatLines on={matOn} size={22} />
              <span className="dsc-metric-value" style={{ color: rootFault ? "var(--dsc-bad)" : Number.isFinite(coldest) ? "var(--dsc-white)" : "var(--dsc-gray-5)" }}>
                {Number.isFinite(coldest) && !rootFault ? coldest.toFixed(1) : "—"}
                <span className="dsc-metric-unit"> °C coldest root</span>
              </span>
            </div>
            <p className="dsc-panel-foot" style={{ marginTop: 4 }}>
              {rootFault
                ? "Root probe fault — the mat loop withholds its reading rather than guessing."
                : Number.isFinite(matLo) && Number.isFinite(matHi)
                  ? `Mat ${matOn ? "warming toward" : "arms below"} ${matLo.toFixed(0)}–${matHi.toFixed(0)} °C · per-probe sense with a plausibility filter`
                  : "Mat loop uses per-probe sense with a plausibility filter."}
              {Number.isFinite(matSec) ? ` · session ${fmtDurationMs(matSec * 1000)}` : ""}
            </p>
          </div>
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
        </Panel>

        <Panel legendIcon="drip-irrigation" legend="SHOTS · IRRIGATION" tone={pumpBound ? "teal" : "muted"} dashed={!pumpBound}>
          {pumpBound ? (
            <>
              <p className="dsc-panel-foot" style={{ marginTop: 0 }}>
                A Zigbee plug_pump is bound. Manual shots are 2 s; P1–P3 act windows come from steering.
              </p>
              <div className="dsc-tagrow">
                {probes
                  .filter((p) => !p.oos)
                  .map((p) => (
                    <Button key={p.n} onClick={() => void fireShot(p.n)} busy={shotBusy === p.n} disabled={shotBusy != null && shotBusy !== p.n}>
                      Shot {probeLabel(p.n)} · 2 s
                    </Button>
                  ))}
              </div>
            </>
          ) : (
            <p className="dsc-panel-foot" style={{ marginTop: 0 }}>
              No pump is bound, so there is no shot editor to show — the brain withholds irrigation acts rather than
              pretending. Bind a Zigbee plug as <b>plug_pump</b> in Settings › Device and the P1 / P2 shot controls
              appear here. Steering still reads dry-back and reports the phase per probe below.
            </p>
          )}
          {shotMsg ? <p className="dsc-honesty">{shotMsg}</p> : null}
          <div className="dsc-row-actions">
            <Button variant={steerOverride ? "primary" : "secondary"} disabled={steerBusy} onClick={() => setPendingSteer(true)}>
              {steerOverride ? "Resume auto steering" : "Take manual control"}
            </Button>
            {!pumpBound ? <Button onClick={() => navigate(paths.settings("device"))}>Settings › Device</Button> : null}
          </div>
        </Panel>
      </div>

      <div className="dsc-grid">
        {probeStations.length ? (
          <div className="dsc-col-12">
            <Panel legendIcon="soil-probe" legend="PROBE STATIONS · THEREABOUTS">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Idle mobile probes report last-known soil at their home probe — not the plant under test.
              </p>
              <div className="dsc-grid">
                {probeStations.map((st) => {
                  const moist = st.home_trustworthy === false ? null : st.thereabouts?.moisture_pct;
                  const soilT = st.home_trustworthy === false ? null : st.thereabouts?.soil_temp_c;
                  const stationMatch = /^pot(\d+)$/i.exec(st.seat_id);
                  const stationTitle = stationMatch ? probeLabel(Number(stationMatch[1])) : st.seat_id;
                  const homeProbe = /^pot(\d+)$/i.exec(st.idle_home_pot_id || "");
                  const homeLabel = homeProbe
                    ? probeLabel(Number(homeProbe[1]))
                    : st.idle_home_pot_id || "—";
                  const homeOnline = st.home_online ?? st.online;
                  const homeOk = st.home_trustworthy !== false && homeOnline;
                  return (
                    <div key={st.seat_id} className="dsc-col-6">
                      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
                        <strong>{stationTitle}</strong>
                        <StatusTag label={st.tent} tone="muted" />
                        <StatusTag
                          label={st.reading_mode === "idle" ? "IDLE" : st.reading_mode.toUpperCase()}
                          tone={st.reading_mode === "idle" ? "ok" : "warn"}
                        />
                        <StatusTag
                          label={homeOk ? "HOME ONLINE" : "HOME DARK"}
                          tone={homeOk ? "ok" : "bad"}
                        />
                        {st.home_sensor_fault ? <StatusTag label="HOME FAULT" tone="bad" /> : null}
                        {st.home_modbus_ok === false ? <StatusTag label="HOME PROBE DARK" tone="warn" /> : null}
                        {st.thereabouts_stale ? <StatusTag label="READING STALE" tone="warn" /> : null}
                      </div>
                      <p className="dsc-muted" style={{ margin: 0, fontSize: "var(--dsc-fs-sm)" }}>
                        Home {homeLabel} · moisture{" "}
                        {moist != null && Number.isFinite(Number(moist)) ? `${Number(moist).toFixed(1)} %` : "—"} · soil{" "}
                        {soilT != null && Number.isFinite(Number(soilT)) ? `${Number(soilT).toFixed(1)} °C` : "—"}
                        {st.thereabouts_stale ? " · last seen >15 min ago" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="dsc-row-actions" style={{ marginTop: 12 }}>
                <Button variant="primary" onClick={() => setSoilWizardOpen(true)}>
                  Run soil test
                </Button>
                <Button variant="secondary" onClick={() => navigate(paths.calibrate())}>
                  Soil cal
                </Button>
              </div>
            </Panel>
          </div>
        ) : null}

        {probes.map(({ n, oos }) => (
          <div key={n} className="dsc-col-12">
            <RootProbeCard
              probe={n}
              oos={oos}
              station={probeStations.some((st) => st.seat_id === `pot${n}`)}
              steering={probeSteering(steering, `pot${n}`)}
              onOpen={() => (oos ? undefined : openProbe(n))}
            />
          </div>
        ))}
      </div>

      <SlideDrawer
        open={probe != null}
        onClose={closeProbe}
        title={
          probe != null
            ? `${probeLabel(probe)}${
                (() => {
                  const name = probes.find((p) => p.n === probe)?.plant.plantName;
                  return name && name !== "—" ? ` · ${name}` : "";
                })()
              }`
            : "Probe"
        }
        wide
      >
        {probe != null ? (
          <PlantProbePanel probe={probe} onSelectProbe={openProbe} onRetired={closeProbe} />
        ) : null}
      </SlideDrawer>

      <SlideDrawer open={soilWizardOpen} onClose={() => setSoilWizardOpen(false)} title="Soil test">
        <SoilTestWizard onClose={() => setSoilWizardOpen(false)} />
      </SlideDrawer>

      <DecisionLayer
        open={pendingSteer}
        onDismiss={() => setPendingSteer(false)}
        busy={steerBusy}
        onConfirm={async () => {
          setSteerBusy(true);
          setSteerMsg("");
          try {
            await set_root_steering_override(!steerOverride);
            await refreshBrain();
          } catch (exc) {
            // Surface the failure — the chip alone would silently keep the old state.
            setSteerMsg(
              `Root-steering change failed: ${exc instanceof Error ? exc.message : String(exc)}. Chip shows the brain's current mode.`,
            );
          } finally {
            setSteerBusy(false);
            setPendingSteer(false);
          }
        }}
        title={steerOverride ? "Resume auto root-steering" : "Take manual irrigation control"}
        confirmLabel={steerOverride ? "Resume auto" : "Go manual"}
        help={null}
      >
        <p>
          {steerOverride
            ? "The brain resumes reading dryback and gating irrigation act windows by phase (P1–P3)."
            : "The brain stops emitting phase act windows. Irrigation timing is entirely yours until you resume auto."}
        </p>
      </DecisionLayer>
      {steerMsg ? (
        <p className="dsc-honesty" role="alert">
          {steerMsg}
        </p>
      ) : null}

      <p className="dsc-panel-foot">
        <button type="button" className="dsc-alert-cta" onClick={() => navigate(paths.climate())}>
          CLIMATE WANT →
        </button>
      </p>
    </div>
  );
}

function RootProbeCard({
  probe,
  oos,
  station,
  steering,
  onOpen,
}: {
  probe: number;
  oos: boolean;
  station: boolean;
  steering: ReturnType<typeof probeSteering>;
  onOpen: (() => void) | undefined;
}) {
  const { state, entity } = useEntityBus();
  const inspector = useInspector();
  const plant = buildPlantProbe(probe, { state, entity });
  const trust = readProbeTrust(probe, state);
  const moistId = probeGotEntity(probe, "moisture", state);
  const ecId = probeGotEntity(probe, "ec", state);
  const phId = probeGotEntity(probe, "ph", state);
  const nId = `sensor.dsc_probe${probe}_soil_nitrogen`;
  const pId = `sensor.dsc_probe${probe}_soil_phosphorus`;
  const kId = `sensor.dsc_probe${probe}_soil_potassium`;
  const dryId = `sensor.dsc_probe${probe}_dryback_pct`;
  const rateId = `sensor.dsc_probe${probe}_soil_moisture_rate`;
  const series = useEntitySeries(moistId, { hours: 6, maxPoints: 48 });
  const dry = useHeldReading(dryId);
  const soil = useHeldReading(`sensor.dsc_probe${probe}_soil_temperature`);
  const moist = useHeldReading(moistId);
  const ec = useHeldReading(ecId);
  const ph = useHeldReading(phId);
  const rate = useHeldReading(rateId);
  const nHeld = useHeldReading(nId);
  const pHeld = useHeldReading(pId);
  const kHeld = useHeldReading(kId);
  const mBand = probeWantBand(probe, "moisture", state);
  const ecBand = probeWantBand(probe, "ec", state);
  const phBand = probeWantBand(probe, "ph", state);
  const dryBand = { min: 0, max: 45 };
  const showDryback = Number.isFinite(dry.value);
  const fmtChip = (v: number, digits = 0) => (Number.isFinite(v) ? v.toFixed(digits) : "—");
  const readingOk = !trust.labels.includes("sensor fault") && !trust.labels.includes("probe dark");
  const moistV = readingOk ? moist.value : Number.NaN;
  const soilV = readingOk ? soil.value : Number.NaN;
  const dryV = readingOk ? dry.value : Number.NaN;
  const ecV = readingOk ? ec.value : Number.NaN;
  const phV = readingOk ? ph.value : Number.NaN;
  const nV = readingOk ? nHeld.value : Number.NaN;
  const pV = readingOk ? pHeld.value : Number.NaN;
  const kV = readingOk ? kHeld.value : Number.NaN;
  const rateV = readingOk ? rate.value : Number.NaN;
  const unassigned = !oos && (plant.plantName === "—" || plant.plantName.trim() === "");
  const headName = oos ? "Out of service" : unassigned ? (station ? "Probe station" : "Unassigned") : plant.plantName;
  const needLabel = oos
    ? "No data"
    : unassigned
      ? "No targets"
      : trust.blockNeedAct
        ? `${plant.need} (no act)`
        : `Need ${plant.need}`;
  const needTone =
    oos || unassigned || plant.need === "ok" || plant.need === "—"
      ? "muted"
      : plant.need
        ? "warn"
        : "ok";

  const open = (id: string, label: string, unit?: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    inspector.open({ entityId: id, label, unit });
  };

  const moistTone = zoneTone({
    value: moistV,
    band: mBand,
    margin: defaultBandMargin(mBand),
    stale: moist.stale || !readingOk,
    available: readingOk && Number.isFinite(moistV),
  });
  const panelTone = oos ? "muted" : moistTone === "critical" ? "bad" : moistTone === "warn" || moistTone === "stale" ? "warn" : moistTone === "ok" ? "ok" : "muted";
  const legendBits = [probeLabel(probe).toUpperCase()];
  if (!oos && !unassigned) legendBits.push(plant.plantName.toUpperCase());
  if (!oos && plant.tent !== "unassigned") legendBits.push(tentLabel(plant.tent));
  if (!oos && plant.days && plant.days !== "—") legendBits.push(`D${plant.days}`);
  const phase = !oos && plant.stage && plant.stage !== "—" ? phaseFromStage(plant.stage) : null;
  const steerText = steering?.phase
    ? `${phaseLabel(steering.phase).toUpperCase()}${steering.act_allowed ? " · ACT WINDOW OPEN" : " · NO ACT WINDOW"}`
    : null;
  return (
    <Panel
      tone={panelTone}
      dashed={oos}
      legendIcon="soil-probe"
      legend={legendBits.join(" · ")}
      legendRight={oos ? "OUT OF SERVICE" : steerText ?? undefined}
      className={`dsc-pot-card dsc-probe-panel${oos ? " is-oos" : ""}`}
    >
      <div
        className="dsc-pot-card-head"
        onClick={onOpen}
        role={onOpen ? "button" : undefined}
        tabIndex={onOpen ? 0 : undefined}
        aria-label={onOpen ? `Open ${probeLabel(probe)}` : undefined}
        onKeyDown={(e) => {
          if (!onOpen) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <VesselGlyph spec={readProbeVessel(probe, state, entity)} size={28} />
        <div>
          <strong>{headName}</strong>
          <div className="dsc-chip-row">
            <StatusTag label={tentLabel(plant.tent)} tone={oos || plant.tent === "unassigned" ? "muted" : "ok"} />
            <StatusTag label={needLabel} tone={needTone} />
            {trust.labels.map((l) => (
              <StatusTag key={l} label={l} tone="warn" />
            ))}
          </div>
        </div>
        <Sparkline
          series={series.series}
          color={toneCssColor(
            zoneTone({
              value: moistV,
              band: mBand,
              margin: defaultBandMargin(mBand),
              stale: moist.stale || !readingOk,
              available: readingOk && Number.isFinite(moistV),
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
              value={moistV}
              min={0}
              max={100}
              unit="%"
              band={mBand}
              stale={moist.stale || !readingOk}
              onClick={() =>
                inspector.open({ entityId: moistId, label: `${probeLabel(probe)} moisture`, unit: "%" })
              }
            />
            <ArcGauge
              label="Soil °C"
              value={soilV}
              min={10}
              max={40}
              unit="°C"
              stale={soil.stale || !readingOk}
              onClick={() =>
                inspector.open({
                  entityId: `sensor.dsc_probe${probe}_soil_temperature`,
                  label: `${probeLabel(probe)} soil T`,
                  unit: "°C",
                })
              }
            />
            {showDryback ? (
              <ArcGauge
                label="Dryback"
                value={dryV}
                min={0}
                max={60}
                unit="%"
                band={dryBand}
                stale={dry.stale || !readingOk}
                onClick={() =>
                  inspector.open({ entityId: dryId, label: `${probeLabel(probe)} dryback`, unit: "%" })
                }
              />
            ) : null}
            <ArcGauge
              label="EC"
              value={ecV}
              min={0}
              max={3000}
              unit=""
              band={ecBand}
              stale={ec.stale || !readingOk}
              onClick={() => inspector.open({ entityId: ecId, label: `${probeLabel(probe)} EC` })}
            />
            <ArcGauge
              label="pH"
              value={phV}
              min={4}
              max={8}
              unit=""
              band={phBand}
              stale={ph.stale || !readingOk}
              onClick={() => inspector.open({ entityId: phId, label: `${probeLabel(probe)} pH` })}
            />
          </div>
          <div className="dsc-npk-row">
            <button type="button" className="dsc-npk-hit" onClick={open(nId, `${probeLabel(probe)} N (from EC)`)}>
              N {fmtChip(nV, 0)}
              {readingOk && nHeld.stale ? " *" : ""}
              <span className="dsc-npk-hint">from EC</span>
            </button>
            <button type="button" className="dsc-npk-hit" onClick={open(pId, `${probeLabel(probe)} P (from EC)`)}>
              P {fmtChip(pV, 0)}
              {readingOk && pHeld.stale ? " *" : ""}
              <span className="dsc-npk-hint">from EC</span>
            </button>
            <button type="button" className="dsc-npk-hit" onClick={open(kId, `${probeLabel(probe)} K (from EC)`)}>
              K {fmtChip(kV, 0)}
              {readingOk && kHeld.stale ? " *" : ""}
              <span className="dsc-npk-hint">from EC</span>
            </button>
            {!readingOk ? (
              <span className="dsc-npk-hit dsc-npk-hit--static" title="Probe dark or fault — rate withheld">
                Rate —
              </span>
            ) : !Number.isFinite(rateV) ? (
              <span
                className="dsc-npk-hit dsc-npk-hit--static"
                title={station ? "Station moisture history not yet long enough for rate" : "No moisture-rate entity on this bus"}
              >
                {station ? "Rate · waiting" : "Rate · no channel"}
              </span>
            ) : (
              <button type="button" className="dsc-npk-hit" onClick={open(rateId, `${probeLabel(probe)} moisture rate`)}>
                Rate {rateV.toFixed(2)}
                {rate.stale ? " *" : ""}
              </button>
            )}
            {!showDryback ? (
              <span
                className="dsc-npk-hit dsc-npk-hit--static"
                title={station ? "Station dryback waits on moisture history" : "No dryback entity on this bus"}
              >
                {station ? "Dryback · waiting" : "Dryback · no channel"}
              </span>
            ) : null}
          </div>
          <p className="dsc-panel-foot">
            {phase ? <PhaseChip phase={phase} /> : null}{" "}
            {showDryback ? `dry-back −${fmtChip(dryV, 0)} % since the last wet point (sensor)` : "dry-back not available"}
            {Number.isFinite(rateV) ? ` · ${rateV.toFixed(2)} %/h` : ""}
            {" · last shot — (no pump bound) · next feed —"}
            {steering?.reason ? ` · steering: ${steering.reason}` : ""}
          </p>
          <DrybackChart probe={probe} tent={plant.tent} moistureBand={mBand} />
        </>
      )}
    </Panel>
  );
}
