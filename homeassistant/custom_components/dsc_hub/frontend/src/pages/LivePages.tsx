import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  EntityFanSlider,
  EntityToggle,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { SlideDrawer } from "../components/chrome";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../components/HistoryDrawer";
import { AirPathMap } from "../components/AirPathMap";
import { CropScheduler } from "../components/CropScheduler";
import { TentLightClock } from "../components/TentLightClock";
import { TwinViewport } from "../components/TwinViewport";
import { TentTargetPanel } from "../components/TentTargets";
import { resolveCfm } from "../lib/cfmProvenance";
import { readPotTrust } from "../lib/potTrust";
import { VesselGlyph } from "../components/VesselGlyph";
import { readPotVessel } from "../lib/vesselSpec";
import { useEntityBus } from "../hooks/useEntityBus";
import { useTentVitals } from "../hooks/useFleet";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useChartHours } from "../hooks/useChartHours";
import { useZoneFocus } from "../hooks/useZoneFocus";
import { useInspector } from "../components/InspectorHost";
import { MultiLineChart } from "../viz/charts";
import { potsInTent, isPotInService, type TentId } from "../lib/seatModel";
import { PlantSeatPanel } from "./GrowPages";

export { LiveClimatePage } from "./ClimatePage";
export { LiveRootPage } from "./RootPage";
export { LiveLightPage } from "./LightPage";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function LiveTwinPage() {
  const navigate = useNavigate();
  const { available, num } = useEntityBus();
  const inMain = resolveCfm("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available,
    num,
  });
  const inClone = resolveCfm("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available,
    num,
  });
  const outCfm = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const recCfm = resolveCfm(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available, num },
  );
  return (
    <div className="dsc-page dsc-page--twin-chrome">
      <PageHeader
        icon="twin"
        title="Twin"
        subtitle="Cinematic digital twin — pick a pot to open Root seat."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Set Climate Want
          </Button>
        }
        actions={
          <>
            <Button onClick={() => navigate("/live/4x8")}>4×8 cockpit</Button>
            <Button onClick={() => navigate("/live/2x4")}>2×4 cockpit</Button>
            <Button primary onClick={() => navigate("/grow/compose")}>
              Compose plant
            </Button>
          </>
        }
      />
      <TwinViewport />
      <p className="dsc-honesty dsc-muted" style={{ marginTop: 0 }}>
        Pick a pot in the twin to open its seat. Twin stays warm across Twin / 4×8 / 2×4.
        Orbit the scene — it no longer snaps home on hass ticks. 4×8 fixture glow follows the
        photoperiod window until a main lamp is wired.
      </p>
      <div className="dsc-grid" style={{ marginTop: 12 }}>
        <div className="dsc-col-12">
          <CropScheduler />
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Air path" icon="climate">
            <AirPathMap intakeClone={inClone} intakeMain={inMain} outCfm={outCfm} recircCfm={recCfm} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function TentCockpitPage({ tent }: { tent: Exclude<TentId, "unassigned"> }) {
  const { state, entity, num, tick, callWS, available } = useEntityBus();
  const tentVitals = useTentVitals(tent);
  const navigate = useNavigate();
  const inspector = useInspector();
  const { setFocus } = useZoneFocus();
  const [params, setParams] = useSearchParams();
  const [log, setLog] = useState<string[]>([]);
  const { hours, setHours, maxPoints } = useChartHours(6);
  void tick;

  useEffect(() => {
    setFocus(tent);
  }, [tent, setFocus]);

  const seats = potsInTent(tent, state, entity);
  const seatKey = seats.map((s) => s.pot).join(",");
  const raw = Number(params.get("pot") || 0);
  const pot =
    raw >= 1 && raw <= 4 && isPotInService(raw, state) && seats.some((s) => s.pot === raw)
      ? raw
      : null;

  const tId =
    tent === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature";
  const rhId = tent === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity";
  const vpdId = tent === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa";
  const tSeries = useEntitySeries(tId, { hours, maxPoints });
  const rhSeries = useEntitySeries(rhId, { hours, maxPoints });
  const vpdSeries = useEntitySeries(vpdId, { hours, maxPoints });
  const tHeld = useHeldReading(tId);
  const rhHeld = useHeldReading(rhId);
  const vpdHeld = useHeldReading(vpdId);
  const tDisplay = Number.isFinite(tHeld.value) ? tHeld.value : tentVitals.temp_c;
  const rhDisplay = Number.isFinite(rhHeld.value) ? rhHeld.value : tentVitals.rh_pct;
  const vpdDisplay = Number.isFinite(vpdHeld.value) ? vpdHeld.value : tentVitals.vpd_kpa;
  const windowOpen =
    state(
      tent === "main"
        ? "binary_sensor.dsc_hub_4x8_window_open"
        : "binary_sensor.dsc_hub_2x4_window_open",
    ) === "on";
  const cloneLampOn = state("light.dsc_hub_sf1000_dimmer") === "on";
  const lit = tent === "clone" ? cloneLampOn : windowOpen;
  const intakeReading =
    tent === "main"
      ? resolveCfm("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available, num })
      : resolveCfm("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available, num });
  const outReadingCockpit = resolveCfm(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available, num },
  );
  const recircReadingCockpit = resolveCfm(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available, num },
  );
  const inClone = resolveCfm("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available,
    num,
  });
  const inMain = resolveCfm("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available,
    num,
  });
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const title = tent === "main" ? "4×8 tent" : "2×4 tent";
  const pathNote =
    tent === "main"
      ? "Only the 4×8 house in Twin. Cascade-in is a port stub from 2×4, not a second tent."
      : "Only the 2×4 house in Twin. Cascade-out is a port stub to 4×8.";

  useEffect(() => {
    let cancelled = false;
    async function loadLog() {
      const pots = seatKey
        ? seatKey
            .split(",")
            .map((p) => Number(p))
            .filter((n) => Number.isFinite(n) && n > 0)
        : [];
      if (!callWS || pots.length === 0) {
        setLog([]);
        return;
      }
      const ids = pots.flatMap((n) => [
        `text.dsc_pot${n}_plant_name`,
        `input_select.dsc_pot${n}_tent`,
        `select.dsc_pot${n}_growth_stage`,
      ]);
      const end = new Date();
      const start = new Date(end.getTime() - 48 * 3600 * 1000);
      try {
        const rawHist = await callWS<
          Record<string, { s?: string; state?: string; lu?: number; last_changed?: string }[]>
        >({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          significant_changes_only: true,
          minimal_response: true,
          no_attributes: true,
          entity_ids: ids,
        });
        if (cancelled || !rawHist) return;
        const lines: { t: number; text: string }[] = [];
        for (const [eid, rows] of Object.entries(rawHist)) {
          for (const row of rows || []) {
            const t =
              typeof row.lu === "number"
                ? row.lu * 1000
                : row.last_changed
                  ? Date.parse(row.last_changed)
                  : NaN;
            const v = String(row.s ?? row.state ?? "");
            if (!Number.isFinite(t) || !v || v === "unavailable") continue;
            lines.push({ t, text: `${new Date(t).toLocaleString()} · ${eid.split(".").pop()} → ${v}` });
          }
        }
        lines.sort((a, b) => b.t - a.t);
        setLog(lines.map((l) => l.text));
      } catch {
        if (!cancelled) setLog([]);
      }
    }
    void loadLog();
    return () => {
      cancelled = true;
    };
  }, [callWS, seatKey, tent]);

  const wantT = tent === "main" ? num("number.dsc_hub_target_temp") : num("number.dsc_hub_clone_target_temp");
  const rhMin = tent === "main" ? num("number.dsc_hub_rh_target_min") : num("number.dsc_hub_clone_rh_min");
  const rhMax = tent === "main" ? num("number.dsc_hub_rh_target_max") : num("number.dsc_hub_clone_rh_max");

  return (
    <div className="dsc-page">
      <PageHeader
        icon={tent === "main" ? "tent" : "clone"}
        title={title}
        subtitle={`Tent cockpit — ${seats.length} seat(s). ${pathNote}`}
        primaryAction={
          <Button teal onClick={() => navigate("/live/twin")}>
            Both tents
          </Button>
        }
        actions={
          <Button primary onClick={() => navigate(`/live/climate?tent=${tent}`)}>
            Climate Want
          </Button>
        }
      />

      <div className="dsc-tent-cockpit-strip">
        <StatusChip label={`${seats.length} plants`} tone="ok" icon="roster" />
        <StatusChip
          icon="climate"
          label={`T ${fmt(tDisplay ?? NaN)}°C`}
          tone={tHeld.stale && !tentVitals.online ? "warn" : "ok"}
          onClick={() => inspector.open({ entityId: tId, label: `${title} T`, unit: "°C" })}
        />
        <StatusChip
          icon="tank"
          label={`RH ${fmt(rhDisplay ?? NaN, 0)}%`}
          tone={rhHeld.stale && !tentVitals.online ? "warn" : "ok"}
          onClick={() => inspector.open({ entityId: rhId, label: `${title} RH`, unit: "%" })}
        />
        <StatusChip
          icon="gauge"
          label={`VPD ${fmt(vpdDisplay ?? NaN, 2)}`}
          tone={vpdHeld.stale && !tentVitals.online ? "warn" : "ok"}
          onClick={() => inspector.open({ entityId: vpdId, label: `${title} VPD`, unit: "kPa" })}
        />
        <StatusChip
          icon="lighting"
          motion={lit ? "glow" : undefined}
          label={
            tent === "clone" ? (lit ? "SF1000 ON" : "SF1000 OFF") : windowOpen ? "PHOTO ON" : "PHOTO OFF"
          }
          tone={lit ? "ok" : "muted"}
          onClick={() =>
            inspector.open({
              entityId:
                tent === "clone" ? "light.dsc_hub_sf1000_dimmer" : "binary_sensor.dsc_hub_4x8_window_open",
              label: tent === "clone" ? "SF1000" : "4×8 window",
              kind: "binary",
            })
          }
        />
        <StatusChip
          icon="fan"
          motion={Number.isFinite(intakeReading.value) && intakeReading.value > 0 ? "fan" : undefined}
          label={`IN ${fmt(intakeReading.value, 0)} cfm`}
          tone="muted"
          onClick={() =>
            inspector.open({
              entityId: intakeReading.entityId,
              label: `${title} intake CFM`,
              unit: "cfm",
            })
          }
        />
      </div>

      <TentLightClock tent={tent} compact />

      <div className="dsc-grid">
        <div className="dsc-col-12">
          <TentTargetPanel only={tent} hero />
        </div>

        <div className="dsc-col-12">
          <CropScheduler compact />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Air path" icon="climate">
            <AirPathMap
              compact
              focus={tent}
              intakeClone={inClone}
              intakeMain={inMain}
              outCfm={outReadingCockpit}
              recircCfm={recircReadingCockpit}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Seat strip" icon="seat">
            <div className="dsc-chip-row">
              {seats.length === 0 ? (
                <div className="dsc-empty">No pots assigned — Apply to tent from a seat.</div>
              ) : (
                seats.map((s) => {
                  const db = Number(state(`sensor.dsc_pot${s.pot}_dryback_pct`));
                  const drybackWarn = Number.isFinite(db) && db > 45;
                  const trust = readPotTrust(s.pot, state);
                  const glow = !trust.blockNeedAct && drybackWarn;
                  return (
                    <button
                      key={s.pot}
                      type="button"
                      className={`dsc-chip dsc-chip--ok${glow ? " dsc-chip--pulse" : ""}`}
                      onClick={() => {
                        const next = new URLSearchParams(params);
                        next.set("pot", String(s.pot));
                        setParams(next, { replace: true });
                      }}
                    >
                      <VesselGlyph spec={readPotVessel(s.pot, state, entity)} size={16} /> P{s.pot}{" "}
                      {s.plantName} · M {s.moisture} · Need{" "}
                      {trust.blockNeedAct ? `${s.need} (no act)` : s.need}
                      {drybackWarn ? " · dryback warn" : ""}
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Tent history" icon="climate">
            <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
            <MultiLineChart
              live
              lastSyncAt={
                Math.max(tSeries.lastSyncAt ?? 0, rhSeries.lastSyncAt ?? 0, vpdSeries.lastSyncAt ?? 0) ||
                undefined
              }
              series={[
                {
                  id: "t",
                  label: "Temp",
                  series: tSeries.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "°C",
                  band: Number.isFinite(wantT) ? { min: wantT - 1.5, max: wantT + 1.5 } : undefined,
                },
                {
                  id: "rh",
                  label: "RH",
                  series: rhSeries.series,
                  color: "var(--dsc-teal)",
                  axis: "right",
                  unit: "%",
                  band: { min: rhMin, max: rhMax },
                },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Fans (this tent)" icon="climate">
            {!fanOverride ? (
              <p className="dsc-honesty" style={{ marginTop: 0 }}>
                Fan sliders locked until Fan override is on (Climate → Command).
              </p>
            ) : null}
            <div className="dsc-fan-stack">
              {tent === "main" ? (
                <>
                  <EntityFanSlider
                    entityId="fan.dsc_hub_4_inch_intake_fan_main"
                    label="Intake 4×8"
                    disabled={!fanOverride}
                  />
                  <EntityFanSlider
                    entityId="fan.dsc_hub_6_inch_exhaust_room"
                    label="Exhaust room (RECIRC)"
                    disabled={!fanOverride}
                  />
                  <EntityFanSlider
                    entityId="fan.dsc_hub_6_inch_exhaust_outside"
                    label="Exhaust outside (OUT)"
                    disabled={!fanOverride}
                  />
                </>
              ) : (
                <>
                  <EntityFanSlider
                    entityId="fan.dsc_hub_4_inch_intake_fan_2x4"
                    label="Intake 2×4"
                    disabled={!fanOverride}
                  />
                  <EntityToggle entityId="light.dsc_hub_sf1000_dimmer" label="SF1000" icon="lighting" />
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant log (48h)" icon="roster">
            {log.length === 0 ? (
              <p className="dsc-muted" style={{ margin: 0 }}>
                Nothing logged in the last 48 hours.
              </p>
            ) : (
              <ul className="dsc-fault-list">
                {log.slice(0, 40).map((line) => (
                  <li key={line}>
                    <span className="dsc-muted" style={{ fontFamily: "var(--dsc-mono)", fontSize: 12 }}>
                      {line}
                    </span>
                  </li>
                ))}
                {log.length > 40 ? (
                  <li>
                    <span className="dsc-muted" style={{ fontFamily: "var(--dsc-mono)", fontSize: 12 }}>
                      +{log.length - 40} more
                    </span>
                  </li>
                ) : null}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <SlideDrawer
        open={pot != null}
        onClose={() => {
          const next = new URLSearchParams(params);
          next.delete("pot");
          setParams(next, { replace: true });
        }}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      >
        {pot != null ? (
          <PlantSeatPanel
            pot={pot}
            onSelectPot={(n) => {
              const next = new URLSearchParams(params);
              next.set("pot", String(n));
              setParams(next, { replace: true });
            }}
          />
        ) : null}
      </SlideDrawer>
    </div>
  );
}

export function LiveMainPage() {
  return <TentCockpitPage tent="main" />;
}

export function LiveClonePage() {
  return <TentCockpitPage tent="clone" />;
}
