import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityToggle,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { OverflowMenu, SlideDrawer } from "../components/chrome";
import { HistoryDrawer, TimespanControl } from "../components/HistoryDrawer";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { TentTargetPanel } from "../components/TentTargets";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useChartHours } from "../hooks/useChartHours";
import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { ArcGauge, MultiLineChart, Sparkline, seriesExtrema } from "../viz/charts";
import {
  buildPlantSeat,
  potsInTent,
  activePotNumbers,
  isPotInService,
  potGotEntity,
  tentLabel,
  type TentId,
} from "../lib/seatModel";
import { PlantSeatPanel } from "./GrowPages";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

const FOCUS_OPTIONS: { id: ZoneFocus; label: string }[] = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "compare", label: "Compare" },
];

export function LiveTwinPage() {
  const navigate = useNavigate();
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
            <Button onClick={() => navigate("/live/main")}>Main cockpit</Button>
            <Button onClick={() => navigate("/live/clone")}>Clone cockpit</Button>
          </>
        }
      />
      <p className="dsc-honesty dsc-muted" style={{ marginTop: 0 }}>
        Pick a pot in the twin to open its seat. Twin stays warm across Twin / Main / Clone.
        4×8 fixture glow follows photoperiod window until a main lamp is wired.
      </p>
    </div>
  );
}

export function LiveClimatePage() {
  const { num, state, entity, available } = useHass();
  const navigate = useNavigate();
  const { focus, setFocus } = useZoneFocus();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const [hist, setHist] = useState<{ id: string; label: string; unit: string } | null>(null);
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");

  const tentTHeld = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRhHeld = useHeldReading("sensor.dsc_hub_tent_humidity");
  const cloneTHeld = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRhHeld = useHeldReading("sensor.dsc_hub_clone_humidity");
  const vpdHeld = useHeldReading("sensor.dsc_hub_vpd_kpa");

  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints });
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints });
  const cloneT = useEntitySeries("sensor.dsc_hub_clone_temperature", { hours, maxPoints });
  const cloneRh = useEntitySeries("sensor.dsc_hub_clone_humidity", { hours, maxPoints });

  const outAllocId = available("sensor.dsc_cfm_exhaust_out_allocated")
    ? "sensor.dsc_cfm_exhaust_out_allocated"
    : "sensor.dsc_cfm_exhaust_out";
  const recircAllocId = available("sensor.dsc_cfm_exhaust_recirc_allocated")
    ? "sensor.dsc_cfm_exhaust_recirc_allocated"
    : "sensor.dsc_cfm_exhaust_recirc";
  const outCfm = useEntitySeries(outAllocId, { hours, maxPoints });
  const recircCfm = useEntitySeries(recircAllocId, { hours, maxPoints });
  const fanOut = useEntitySeries("sensor.dsc_fan_exhaust_outside_pct", { hours, maxPoints });
  const fanRecirc = useEntitySeries("sensor.dsc_fan_exhaust_room_pct", { hours, maxPoints });

  const outNameplate = num("sensor.dsc_cfm_exhaust_out");
  const outAlloc = num(outAllocId);
  const recircNameplate = num("sensor.dsc_cfm_exhaust_recirc");
  const recircAlloc = num(recircAllocId);

  const targetTemp = num("number.dsc_hub_target_temp");
  const rhMin = num("number.dsc_hub_rh_target_min");
  const rhMax = num("number.dsc_hub_rh_target_max");
  const vpdMin = num("number.dsc_hub_vpd_target_min");
  const vpdMax = num("number.dsc_hub_vpd_target_max");
  const cloneTargetTemp = num("number.dsc_hub_clone_target_temp");
  const cloneRhMin = num("number.dsc_hub_clone_rh_min");
  const cloneRhMax = num("number.dsc_hub_clone_rh_max");
  const cloneVpdMin = num("number.dsc_hub_clone_vpd_min");
  const cloneVpdMax = num("number.dsc_hub_clone_vpd_max");

  const tentTempExt = useMemo(() => seriesExtrema(tentT.series), [tentT.series]);
  const tentRhExt = useMemo(() => seriesExtrema(tentRh.series), [tentRh.series]);

  const showMain = focus === "main" || focus === "compare" || focus === "room";
  const showClone = focus === "clone" || focus === "compare";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="climate"
        title="Climate"
        subtitle="Command, Want targets, zone traces, VPD, airflow honesty."
        actions={
          <OverflowMenu
            label="Climate settings"
            items={[
              { id: "mission", label: "Mission", onSelect: () => navigate("/live/mission") },
              { id: "main", label: "Main cockpit", onSelect: () => navigate("/live/main") },
              { id: "clone", label: "Clone cockpit", onSelect: () => navigate("/live/clone") },
              { id: "fleet", label: "Fleet kit", onSelect: () => navigate("/fleet") },
            ]}
          />
        }
      />

      <div className="dsc-chip-row" style={{ marginBottom: 14 }} role="group" aria-label="Tent focus">
        {FOCUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`dsc-chip${focus === opt.id ? " dsc-chip--ok" : ""}`}
            onClick={() => setFocus(opt.id)}
          >
            {opt.label}
          </button>
        ))}
        <TimespanControl hours={hours} setHours={setHours} />
        <Button teal onClick={() => navigate("/fleet")}>
          Kit / Fleet
        </Button>
      </div>

      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Command" icon="climate">
            <div className="dsc-mode-row">
              <EntityToggle entityId="switch.dsc_hub_tent_full_auto_mode" label="Full Auto" icon="ok" />
              <EntityToggle entityId="switch.dsc_hub_manual_takeover" label="Master takeover" icon="alert" />
              <EntityToggle entityId="switch.dsc_hub_tent_manual_override" label="Fan override" icon="climate" />
              <EntityToggle
                entityId="switch.dsc_hub_humidifier_intake_routing"
                label="Hum intake routing"
                icon="climate"
              />
              <EntityToggle
                entityId="switch.dsc_hub_recirc_de_strat_pulse"
                label="RECIRC de-strat"
                icon="climate"
              />
            </div>
            <div className="dsc-mode-selects">
              <EntitySelect entityId="select.dsc_hub_control_strategy" label="Strategy" icon="climate" />
              <EntitySelect entityId="select.dsc_hub_priority_tent" label="Priority tent" icon="tent" />
            </div>
            {fullAuto ? (
              <p className="dsc-honesty">
                <StatusChip
                  icon="alert"
                  label={state("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto"}
                  tone={state("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"}
                />{" "}
                {honesty || "Hub owns fans + appliance Autos when Full Auto is on."}
              </p>
            ) : null}
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Targets" icon="gauge">
            <TentTargetPanel emphasize={focus === "clone" ? "clone" : "main"} />
          </Card>
        </div>

        {showMain ? (
          <>
            <div className="dsc-col-3">
              <Kpi
                label="Tent °C"
                value={fmt(tentTHeld.value)}
                unit="°C"
                stale={tentTHeld.stale}
                onClick={() =>
                  setHist({ id: "sensor.dsc_hub_tent_temperature", label: "Tent T", unit: "°C" })
                }
              />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="Tent RH"
                value={fmt(tentRhHeld.value, 0)}
                unit="%"
                stale={tentRhHeld.stale}
                onClick={() =>
                  setHist({ id: "sensor.dsc_hub_tent_humidity", label: "Tent RH", unit: "%" })
                }
              />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="VPD"
                value={fmt(vpdHeld.value, 2)}
                unit="kPa"
                stale={vpdHeld.stale}
                onClick={() =>
                  setHist({ id: "sensor.dsc_hub_vpd_kpa", label: "VPD", unit: "kPa" })
                }
              />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
            </div>
          </>
        ) : null}

        {showClone ? (
          <>
            <div className="dsc-col-3">
              <Kpi
                label="Clone °C"
                value={fmt(cloneTHeld.value)}
                unit="°C"
                stale={cloneTHeld.stale}
              />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="Clone RH"
                value={fmt(cloneRhHeld.value, 0)}
                unit="%"
                stale={cloneRhHeld.stale}
              />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Clone VPD" value={fmt(num("sensor.dsc_hub_clone_vpd_kpa"), 2)} unit="kPa" />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
            </div>
          </>
        ) : null}

        {showMain ? (
          <div className={showClone ? "dsc-col-6" : "dsc-col-12"}>
            <Card className="dsc-glass" title="Main tent T + RH" icon="tent">
              <MultiLineChart
                lastSyncAt={Math.max(tentT.lastSyncAt ?? 0, tentRh.lastSyncAt ?? 0) || undefined}
                series={[
                  {
                    id: "t",
                    label: "Temp °C",
                    series: tentT.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "°C",
                  },
                  {
                    id: "rh",
                    label: "RH %",
                    series: tentRh.series,
                    color: "var(--dsc-teal)",
                    axis: "right",
                    unit: "%",
                  },
                ]}
                targets={[
                  { axis: "left", value: targetTemp, color: "var(--dsc-amber)", label: "Want T" },
                  { axis: "right", min: rhMin, max: rhMax, color: "var(--dsc-teal)" },
                ]}
              />
            </Card>
          </div>
        ) : null}

        {showClone ? (
          <div className={showMain ? "dsc-col-6" : "dsc-col-12"}>
            <Card className="dsc-glass" title="Clone tent T + RH" icon="clone">
              <MultiLineChart
                lastSyncAt={Math.max(cloneT.lastSyncAt ?? 0, cloneRh.lastSyncAt ?? 0) || undefined}
                series={[
                  {
                    id: "t",
                    label: "Temp °C",
                    series: cloneT.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "°C",
                  },
                  {
                    id: "rh",
                    label: "RH %",
                    series: cloneRh.series,
                    color: "var(--dsc-teal)",
                    axis: "right",
                    unit: "%",
                  },
                ]}
                targets={[
                  {
                    axis: "left",
                    value: cloneTargetTemp,
                    color: "var(--dsc-amber)",
                    label: "Want T",
                  },
                  { axis: "right", min: cloneRhMin, max: cloneRhMax, color: "var(--dsc-teal)" },
                ]}
              />
            </Card>
          </div>
        ) : null}

        <div className="dsc-col-3">
          <Kpi
            label="CFM OUT"
            value={fmt(outAlloc, 0)}
            unit="cfm"
            sub={`Alloc · nameplate ${fmt(outNameplate, 0)}`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="CFM RECIRC"
            value={fmt(recircAlloc, 0)}
            unit="cfm"
            sub={`Alloc · nameplate ${fmt(recircNameplate, 0)}`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake main" value={fmt(num("sensor.dsc_cfm_intake_main"), 0)} unit="cfm" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake 2×4" value={fmt(num("sensor.dsc_cfm_intake_2x4"), 0)} unit="cfm" />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Airflow honesty" icon="climate">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              <StatusChip label="Allocated" tone="ok" /> Prefer allocated CFM over nameplate capacity.
              Blend OUT/RECIRC is normal — map shows topology. 4×8 LIGHT mark tracks photoperiod
              window (no main lamp entity yet); 2×4 tracks SF1000.
            </p>
            <LegacyCardHost tag="dsc-airflow-map-card" config={{}} />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Exhaust CFM (allocated)" icon="climate">
            <MultiLineChart
              unit="cfm"
              lastSyncAt={Math.max(outCfm.lastSyncAt ?? 0, recircCfm.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "out",
                  label: "OUT",
                  series: outCfm.series,
                  color: "var(--dsc-blue)",
                  unit: "cfm",
                },
                {
                  id: "recirc",
                  label: "RECIRC",
                  series: recircCfm.series,
                  color: "var(--dsc-purple)",
                  unit: "cfm",
                },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Fan duty %" icon="climate">
            <MultiLineChart
              unit="%"
              lastSyncAt={Math.max(fanOut.lastSyncAt ?? 0, fanRecirc.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "fout",
                  label: "OUT %",
                  series: fanOut.series,
                  color: "var(--dsc-teal)",
                  unit: "%",
                },
                {
                  id: "frec",
                  label: "RECIRC %",
                  series: fanRecirc.series,
                  color: "var(--dsc-amber)",
                  unit: "%",
                },
              ]}
            />
            <div className="dsc-fan-stack" style={{ marginTop: 12 }}>
              <EntityFanSlider
                entityId="fan.dsc_hub_4_inch_intake_fan_main"
                label="Intake Main"
                disabled={!fanOverride}
              />
              <EntityFanSlider
                entityId="fan.dsc_hub_4_inch_intake_fan_2x4"
                label="Intake 2×4"
                disabled={!fanOverride}
              />
              <EntityFanSlider
                entityId="fan.dsc_hub_6_inch_exhaust_room"
                label="Exhaust room"
                disabled={!fanOverride}
              />
              <EntityFanSlider
                entityId="fan.dsc_hub_6_inch_exhaust_outside"
                label="Exhaust outside"
                disabled={!fanOverride}
              />
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Zone gauges" icon="gauge">
            <div className="dsc-gauge-row">
              {showMain ? (
                <>
                  <ArcGauge
                    label="Tent T"
                    value={tentTHeld.value}
                    min={15}
                    max={35}
                    unit="°C"
                    target={targetTemp}
                    extrema={tentTempExt}
                    stale={tentTHeld.stale}
                    onClick={() =>
                      setHist({
                        id: "sensor.dsc_hub_tent_temperature",
                        label: "Tent T",
                        unit: "°C",
                      })
                    }
                  />
                  <ArcGauge
                    label="Tent RH"
                    value={tentRhHeld.value}
                    min={0}
                    max={100}
                    unit="%"
                    band={{ min: rhMin, max: rhMax }}
                    extrema={tentRhExt}
                    stale={tentRhHeld.stale}
                  />
                  <ArcGauge
                    label="VPD"
                    value={vpdHeld.value}
                    min={0}
                    max={2.5}
                    unit="kPa"
                    band={{ min: vpdMin, max: vpdMax }}
                    stale={vpdHeld.stale}
                  />
                </>
              ) : null}
              {showClone ? (
                <>
                  <ArcGauge
                    label="Clone T"
                    value={cloneTHeld.value}
                    min={15}
                    max={35}
                    unit="°C"
                    target={cloneTargetTemp}
                    stale={cloneTHeld.stale}
                  />
                  <ArcGauge
                    label="Clone RH"
                    value={cloneRhHeld.value}
                    min={0}
                    max={100}
                    unit="%"
                    band={{ min: cloneRhMin, max: cloneRhMax }}
                    stale={cloneRhHeld.stale}
                  />
                  <ArcGauge
                    label="Clone VPD"
                    value={num("sensor.dsc_hub_clone_vpd_kpa")}
                    min={0}
                    max={2.5}
                    unit="kPa"
                    band={{ min: cloneVpdMin, max: cloneVpdMax }}
                  />
                </>
              ) : null}
            </div>
          </Card>
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

function TentCockpitPage({ tent }: { tent: Exclude<TentId, "unassigned"> }) {
  const { state, entity, num, tick, callWS } = useHass();
  const navigate = useNavigate();
  const { setFocus } = useZoneFocus();
  const [params, setParams] = useSearchParams();
  const [log, setLog] = useState<string[]>([]);
  void tick;

  useEffect(() => {
    setFocus(tent);
  }, [tent, setFocus]);

  const seats = potsInTent(tent, state, entity);
  const raw = Number(params.get("pot") || 0);
  const pot =
    raw >= 1 && raw <= 4 && isPotInService(raw, state) && seats.some((s) => s.pot === raw)
      ? raw
      : null;

  const tId =
    tent === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature";
  const rhId = tent === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity";
  const vpdId = tent === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa";
  const tSeries = useEntitySeries(tId, { hours: 6 });
  const rhSeries = useEntitySeries(rhId, { hours: 6 });
  const tHeld = useHeldReading(tId);
  const rhHeld = useHeldReading(rhId);
  const vpdHeld = useHeldReading(vpdId);
  const windowOpen =
    state(
      tent === "main"
        ? "binary_sensor.dsc_hub_4x8_window_open"
        : "binary_sensor.dsc_hub_2x4_window_open",
    ) === "on";
  const cloneLampOn = state("light.dsc_hub_sf1000_dimmer") === "on";
  const lit = tent === "clone" ? cloneLampOn : windowOpen;
  const intakeCfm =
    tent === "main" ? num("sensor.dsc_cfm_intake_main") : num("sensor.dsc_cfm_intake_2x4");
  const outCfm =
    num("sensor.dsc_cfm_exhaust_out_allocated") || num("sensor.dsc_cfm_exhaust_out");
  const recircCfm =
    num("sensor.dsc_cfm_exhaust_recirc_allocated") || num("sensor.dsc_cfm_exhaust_recirc");
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";

  useEffect(() => {
    let cancelled = false;
    async function loadLog() {
      if (!callWS || seats.length === 0) {
        setLog([]);
        return;
      }
      const ids = seats.flatMap((s) => [
        `text.dsc_pot${s.pot}_plant_name`,
        `input_select.dsc_pot${s.pot}_tent`,
        `select.dsc_pot${s.pot}_growth_stage`,
      ]);
      const end = new Date();
      const start = new Date(end.getTime() - 48 * 3600 * 1000);
      try {
        const rawHist = await callWS<Record<string, { s?: string; state?: string; lu?: number; last_changed?: string }[]>>({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          significant_changes_only: true,
          minimal_response: true,
          no_attributes: true,
          entity_ids: ids.slice(0, 8),
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
        setLog(lines.slice(0, 40).map((l) => l.text));
      } catch {
        if (!cancelled) setLog([]);
      }
    }
    void loadLog();
    return () => {
      cancelled = true;
    };
  }, [callWS, seats, tent]);

  const title = tent === "main" ? "Main 4×8" : "Clone 2×4";
  const pathNote =
    tent === "main"
      ? "Intake main + cascade in · OUT / RECIRC"
      : "Intake 2×4 + cascade out · clone mister path";

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
        <StatusChip label={`${seats.length} plants`} tone="ok" />
        <StatusChip
          label={`T ${fmt(tHeld.value)}°C`}
          tone={tHeld.stale ? "warn" : "ok"}
        />
        <StatusChip
          label={`RH ${fmt(rhHeld.value, 0)}%`}
          tone={rhHeld.stale ? "warn" : "ok"}
        />
        <StatusChip
          label={`VPD ${fmt(vpdHeld.value, 2)}`}
          tone={vpdHeld.stale ? "warn" : "ok"}
        />
        <StatusChip
          label={
            tent === "clone"
              ? lit
                ? "SF1000 ON"
                : "SF1000 OFF"
              : windowOpen
                ? "PHOTO ON"
                : "PHOTO OFF"
          }
          tone={lit ? "ok" : "muted"}
        />
        <StatusChip label={`IN ${fmt(intakeCfm, 0)} cfm`} tone="muted" />
        {tent === "main" ? (
          <>
            <StatusChip label={`OUT ${fmt(outCfm, 0)}`} tone="muted" />
            <StatusChip label={`RECIRC ${fmt(recircCfm, 0)}`} tone="muted" />
          </>
        ) : (
          <StatusChip label={`CFM OUT ${fmt(outCfm, 0)}`} tone="muted" />
        )}
      </div>

      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Want targets" icon="climate">
            <TentTargetPanel only={tent} compact />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Seat strip" icon="seat">
            <div className="dsc-chip-row">
              {seats.length === 0 ? (
                <div className="dsc-empty">No pots assigned — Apply to tent from a seat.</div>
              ) : (
                seats.map((s) => (
                  <button
                    key={s.pot}
                    type="button"
                    className="dsc-chip dsc-chip--ok"
                    onClick={() => {
                      const next = new URLSearchParams(params);
                      next.set("pot", String(s.pot));
                      setParams(next, { replace: true });
                    }}
                  >
                    P{s.pot} {s.plantName} · M {s.moisture} · EC {s.ec}
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Tent history" icon="climate">
            <MultiLineChart
              live
              lastSyncAt={Math.max(tSeries.lastSyncAt ?? 0, rhSeries.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp",
                  series: tSeries.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "°C",
                },
                {
                  id: "rh",
                  label: "RH",
                  series: rhSeries.series,
                  color: "var(--dsc-teal)",
                  axis: "right",
                  unit: "%",
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
                    label="Intake Main"
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
                  <EntityToggle
                    entityId="light.dsc_hub_sf1000_dimmer"
                    label="SF1000"
                    icon="lighting"
                  />
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant log (48h)" icon="roster">
            {log.length === 0 ? (
              <p className="dsc-muted" style={{ margin: 0 }}>
                Thin recorder / no recent identity changes — honesty empty, not invented.
              </p>
            ) : (
              <ul className="dsc-fault-list">
                {log.map((line) => (
                  <li key={line}>
                    <span className="dsc-muted" style={{ fontFamily: "var(--dsc-mono)", fontSize: 12 }}>
                      {line}
                    </span>
                  </li>
                ))}
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

export function LiveRootPage() {
  const { state, entity, tick, num } = useHass();
  const [params, setParams] = useSearchParams();
  void tick;
  const pots = activePotNumbers(state).map((n) => buildPlantSeat(n, { state, entity }));
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 && isPotInService(raw, state) ? raw : null;

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
        subtitle="Fleet glance — dryback / nutrition / Need. Click a row for seat + history."
      />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi label="Coldest root" value={fmt(num("sensor.dsc_coldest_root_zone_temp"))} unit="°C" />
        </div>
        <div className="dsc-col-4">
          <Kpi label="Heat mat on time" value={fmt(num("sensor.dsc_heatmat_relay_on_time"), 0)} unit="s" />
        </div>
        <div className="dsc-col-4">
          <Card title="Notes">
            <p className="dsc-muted" style={{ margin: 0 }}>
              Mat loop uses per-pot sense with plausibility filter.
            </p>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Dryback strip" icon="gauge">
            <div className="dsc-gauge-row">
              {activePotNumbers(state).map((n) => (
                <RootDrybackGauge key={n} pot={n} onOpen={() => openPot(n)} />
              ))}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass dsc-root-matrix" title="Fleet matrix" icon="root">
            <table className="dsc-table">
              <thead>
                <tr>
                  <th>Pot</th>
                  <th>Name</th>
                  <th>Tent</th>
                  <th>M%</th>
                  <th>Dryback</th>
                  <th>EC</th>
                  <th>pH</th>
                  <th>Need</th>
                  <th>Rate</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {pots.map((p) => (
                  <RootMatrixRow key={p.pot} pot={p.pot} onOpen={() => openPot(p.pot)} />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

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

function RootDrybackGauge({ pot, onOpen }: { pot: number; onOpen: () => void }) {
  const held = useHeldReading(`sensor.dsc_pot${pot}_dryback_pct`);
  return (
    <ArcGauge
      label={`P${pot}`}
      value={held.value}
      min={0}
      max={100}
      unit="%"
      stale={held.stale}
      band={{ min: 0, max: 45 }}
      onClick={onOpen}
    />
  );
}

function RootMatrixRow({ pot, onOpen }: { pot: number; onOpen: () => void }) {
  const { state, entity, available } = useHass();
  const seat = buildPlantSeat(pot, { state, entity });
  const moistId = potGotEntity(pot, "moisture", state);
  const series = useEntitySeries(moistId, { hours: 6, maxPoints: 48 });
  const dry = useHeldReading(`sensor.dsc_pot${pot}_dryback_pct`);
  const rateId = `sensor.dsc_pot${pot}_soil_moisture_rate`;
  const rateHeld = useHeldReading(rateId);
  const rate = available(rateId) || rateHeld.stale ? rateHeld.value : NaN;
  const tone =
    dry.stale
      ? "dsc-tone-stale"
      : Number.isFinite(dry.value) && dry.value > 55
        ? "dsc-tone-bad"
        : Number.isFinite(dry.value) && dry.value > 40
          ? "dsc-tone-warn"
          : "dsc-tone-ok";

  return (
    <tr onClick={onOpen} style={{ cursor: "pointer" }}>
      <td>P{pot}</td>
      <td>{seat.plantName}</td>
      <td>
        <StatusChip label={tentLabel(seat.tent)} tone={seat.tent === "unassigned" ? "muted" : "ok"} />
      </td>
      <td>{seat.moisture}</td>
      <td className={tone}>{fmt(dry.value, 0)}</td>
      <td>{seat.ec}</td>
      <td>{seat.ph}</td>
      <td>{seat.need}</td>
      <td className={rateHeld.stale ? "dsc-tone-stale" : undefined}>
        {Number.isFinite(rate) ? rate.toFixed(2) : "—"}
      </td>
      <td>
        <Sparkline series={series.series} color="var(--dsc-blue)" width={90} height={24} />
      </td>
    </tr>
  );
}

export function LiveLightPage() {
  const { state, num } = useHass();
  const navigate = useNavigate();
  const darkViolation = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const lightOn = state("light.dsc_hub_sf1000_dimmer") === "on";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="lighting"
        title="Light"
        subtitle="Photoperiod, SF1000, expected hours — Want stays on Climate."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate Want
          </Button>
        }
      />
      <div className="dsc-status-strip">
        <StatusChip
          icon={darkViolation ? "alert" : "ok"}
          label={darkViolation ? "CLONE DARK VIOLATION" : "Dark period OK"}
          tone={darkViolation ? "bad" : "ok"}
          pulse={darkViolation}
        />
        <StatusChip label={lightOn ? "SF1000 ON" : "SF1000 OFF"} tone={lightOn ? "ok" : "muted"} />
      </div>
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi
            label="Expected light hours"
            value={fmt(num("sensor.dsc_expected_light_hours"), 1)}
            unit="h"
          />
        </div>
        <div className="dsc-col-8">
          <Card className="dsc-glass" title="SF1000" icon="lighting">
            <div className="dsc-demand-row">
              <EntityToggle
                entityId="light.dsc_hub_sf1000_dimmer"
                label="SF1000"
                icon="lighting"
                showBrightness
              />
            </div>
            <p className="dsc-muted" style={{ margin: "8px 0 0" }}>
              Expected: {state("sensor.dsc_expected_light_hours", "—")}. Clone dark violation is binary
              — schedule edits belong on Climate / packages, not invented here.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
