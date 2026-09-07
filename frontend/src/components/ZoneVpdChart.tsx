import { useMemo, useState } from "react";
import { usePreferences } from "../hooks/usePreference";
import { useEntityBus } from "../hooks/useEntityBus";
import { useEntitySeries } from "../hooks/useEntitySeries";
import type { ZoneModel } from "../hooks/useZones";
import { darkIntervals } from "../lib/lightsOffShades";
import { readTentPhotoperiodInput } from "../lib/lightSchedule";
import { growLogSeverity, type DisplayGrowLogEvent } from "../lib/growLogFilter";
import { StatusTag } from "./ui";
import { MultiLineChart, type ChartShade, type ChartTimeMarker, type NamedSeries } from "../viz/charts";

export type VpdRange = 24 | 48 | 168 | 720 | 12 | 18;

const RANGES: { hours: VpdRange; label: string; hint: string }[] = [
  { hours: 24, label: "24 h", hint: "Last day" },
  { hours: 48, label: "48 h", hint: "Last two days" },
  { hours: 168, label: "7 d", hint: "Last week, bucketed by the brain" },
  { hours: 720, label: "30 d", hint: "Last thirty days — the recorder keeps 45" },
  { hours: 12, label: "Cycle", hint: "One 12 h photoperiod" },
  { hours: 18, label: "Photo", hint: "One 18 h veg window" },
];

function pointsFor(hours: number): number {
  if (hours >= 720) return 720;
  if (hours >= 168) return 336;
  if (hours >= 48) return 192;
  return 144;
}

const LEAF_ENTITY: Record<string, string> = {
  main: "sensor.dsc_leaf_vpd_kpa",
  clone: "sensor.dsc_clone_leaf_vpd_kpa",
};

/**
 * Per-zone VPD chart with history (operator ask): the zone's own VPD trace, its leaf VPD
 * dashed, THIS zone's band shaded, lights-off windows shaded from its schedule, stage-change
 * and alert markers from the grow log, a T or RH companion on the right axis, and the
 * other zones ghosted when `compare` is on. Ranges 24 h / 48 h / 7 d / cycle / photo.
 */
export function ZoneVpdChart({
  zone,
  others = [],
  events = [],
  compare = false,
  height = 220,
}: {
  zone: ZoneModel;
  /** Other zones to ghost when `compare` is set. */
  others?: ZoneModel[];
  /** Grow-log events (newest first) — stage changes become phase markers, alerts amber ticks. */
  events?: DisplayGrowLogEvent[];
  compare?: boolean;
  height?: number;
}) {
  const { state, num } = useEntityBus();
  const [hours, setHours] = useState<VpdRange>(24);
  const [companion, setCompanion] = useState<"rh" | "temp">("rh");
  const maxPoints = pointsFor(hours);

  const vpd = useEntitySeries(zone.vpd.entityId, { hours, maxPoints });
  const leaf = useEntitySeries(zone.role === "grow" ? LEAF_ENTITY[zone.id] ?? "" : "", { hours, maxPoints });
  const side = useEntitySeries(companion === "rh" ? zone.rh.entityId : zone.temp.entityId, { hours, maxPoints });
  const ghostA = useEntitySeries(compare && others[0] ? others[0].vpd.entityId : "", { hours, maxPoints });
  const ghostB = useEntitySeries(compare && others[1] ? others[1].vpd.entityId : "", { hours, maxPoints });

  const now = Date.now();
  const fromMs = now - hours * 3600 * 1000;
  const prefs = usePreferences();

  const shades = useMemo<ChartShade[]>(() => {
    if (zone.role !== "grow" || !prefs.chartLightsOff) return [];
    const input = readTentPhotoperiodInput(zone.id === "clone" ? "clone" : "main", state, num);
    return darkIntervals(input, fromMs, now).map((d) => ({ ...d, color: "var(--dsc-black)", opacity: 0.45 }));
    // `state`/`num` are stable bus accessors; the schedule only changes with the bus tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone.id, zone.role, hours, prefs.chartLightsOff, Math.floor(now / 60000)]);

  const markers = useMemo<ChartTimeMarker[]>(() => {
    const out: ChartTimeMarker[] = [];
    if (!prefs.chartMarkers) return out;
    for (const ev of events) {
      const t = ev.ts * 1000;
      if (t < fromMs) continue;
      if (/\bstage\b/i.test(ev.message)) {
        out.push({ t, label: ev.message.replace(/^[▶■▲◆●○•]\s*/, "").slice(0, 28), color: "var(--dsc-purple)" });
      } else if (growLogSeverity(ev.message) === "alert") {
        out.push({ t, color: "var(--dsc-amber)" });
      }
    }
    return out.slice(0, 12);
  }, [events, fromMs, prefs.chartMarkers]);

  const series: NamedSeries[] = [
    {
      id: "vpd",
      label: `${zone.label} VPD`,
      series: vpd.series,
      color: zone.id === "clone" ? "var(--dsc-teal)" : zone.id === "room" ? "var(--dsc-gray-5)" : "var(--dsc-neon)",
      unit: "kPa",
      axis: "left",
      band: zone.vpd.band,
    },
  ];
  if (leaf.series.length > 1) {
    series.push({ id: "leaf", label: "leaf VPD", series: leaf.series, color: "var(--dsc-white)", unit: "kPa", axis: "left", ghost: true });
  }
  if (side.series.length > 1) {
    series.push({
      id: "side",
      label: companion === "rh" ? "RH" : "temp",
      series: side.series,
      color: companion === "rh" ? "var(--dsc-blue)" : "var(--dsc-orange)",
      unit: companion === "rh" ? "%" : "°C",
      axis: "right",
    });
  }
  if (compare) {
    if (ghostA.series.length > 1 && others[0]) {
      series.push({ id: "ga", label: `${others[0].label} VPD`, series: ghostA.series, color: "var(--dsc-gray-5)", unit: "kPa", ghost: true });
    }
    if (ghostB.series.length > 1 && others[1]) {
      series.push({ id: "gb", label: `${others[1].label} VPD`, series: ghostB.series, color: "var(--dsc-purple)", unit: "kPa", ghost: true });
    }
  }

  const lastSync = Math.max(vpd.lastSyncAt ?? 0, side.lastSyncAt ?? 0, leaf.lastSyncAt ?? 0) || undefined;

  return (
    <div className="dsc-zvc">
      <div className="dsc-zvc-controls">
        <div className="dsc-zvc-ranges" role="group" aria-label="Chart range">
          {RANGES.map((r) => (
            <button
              key={r.hours}
              type="button"
              className={`dsc-seg${hours === r.hours ? " is-active" : ""}`}
              aria-pressed={hours === r.hours}
              title={r.hint}
              onClick={() => setHours(r.hours)}
            >
              {r.label}
            </button>
          ))}
        </div>
        {vpd.tracked === false ? <StatusTag label="NOT RECORDED BY THE BRAIN" tone="warn" dashed title={`${zone.vpd.entityId} is not in the brain's recorder — nothing to chart`} /> : null}
        <div className="dsc-zvc-ranges" role="group" aria-label="Right axis">
          {(["rh", "temp"] as const).map((c) => (
            <button
              key={c}
              type="button"
              className={`dsc-seg${companion === c ? " is-active" : ""}`}
              aria-pressed={companion === c}
              onClick={() => setCompanion(c)}
              title={c === "rh" ? "Relative humidity on the right axis" : "Temperature on the right axis"}
            >
              {c === "rh" ? "+RH" : "+T"}
            </button>
          ))}
        </div>
      </div>
      <MultiLineChart
        unit="kPa"
        height={height}
        chartHours={hours}
        lastSyncAt={lastSync}
        yDomain={{
          left: { min: 0, max: 2.5 },
          right: companion === "rh" ? { min: 0, max: 100 } : { min: 10, max: 40 },
        }}
        series={series}
        targets={zone.vpd.band && prefs.chartBands ? [{ axis: "left", min: zone.vpd.band.min, max: zone.vpd.band.max, color: "var(--dsc-neon)" }] : []}
        shades={shades}
        timeMarkers={markers}
        xDomain={{ min: fromMs, max: now }}
      />
      <div className="dsc-zvc-key">
        <span><i className="dsc-key-band" /> {zone.vpd.band ? `band ${zone.vpd.band.min.toFixed(1)}–${zone.vpd.band.max.toFixed(1)}` : "no band"}</span>
        {zone.role === "grow" ? <span><i className="dsc-key-dark" /> lights off</span> : null}
        <span><i className="dsc-key-stage" /> stage change</span>
        <span><i className="dsc-key-alert" /> alert</span>
        {leaf.series.length > 1 ? <span><i className="dsc-key-leaf" /> leaf VPD</span> : null}
        {hours === 168 && vpd.series.length < 20 ? <span className="dsc-zvc-thin">recorder holds less than a week — showing what it has</span> : null}
      </div>
    </div>
  );
}
