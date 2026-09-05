import { useEffect, useMemo, useState } from "react";
import type { EChartsCoreOption } from "echarts/core";
import { defaultBandMargin, isValidBand, toneClass, toneCssColor, zoneTone } from "../lib/zoneTone";
import { EChart } from "./EChart";
import { type GaugeSegment } from "./gaugeTheme";

export interface SeriesPoint {
  t: number;
  v: number;
}

const HOLD_GAP_MS = 2000;
const MAX_HOLD_TO_NOW_MS = 5 * 60 * 1000;

/** Recorder stores on change. Hold last good across short gaps; stop at now unless stale-marked. */
export function stepHoldSeries(
  points: SeriesPoint[],
  now = Date.now(),
  opts?: { markStale?: boolean },
): SeriesPoint[] {
  if (!points.length) return [];
  const sorted = [...points].sort((a, b) => a.t - b.t);
  const out: SeriesPoint[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    if (!Number.isFinite(p.v)) continue;
    const prev = out[out.length - 1];
    if (prev && p.t - prev.t > HOLD_GAP_MS) {
      out.push({ t: p.t - 1, v: prev.v });
    }
    out.push(p);
  }
  const last = out[out.length - 1];
  if (last && now - last.t > HOLD_GAP_MS) {
    const age = now - last.t;
    if (opts?.markStale || age <= MAX_HOLD_TO_NOW_MS) {
      out.push({ t: now, v: last.v });
    }
  }
  return out;
}

export interface NamedSeries {
  id: string;
  label: string;
  series: SeriesPoint[];
  color?: string;
  axis?: "left" | "right";
  unit?: string;
  /** Ghost compare series (last cycle / sibling) — dashed, no fill. */
  ghost?: boolean;
  /** Want / in-band — stroke turns amber then bad when leaving. */
  band?: { min: number; max: number };
  /** Step-after (duty / binary). Default is a diagonal between points. */
  step?: boolean;
}

export interface ChartTarget {
  axis?: "left" | "right";
  value?: number;
  min?: number;
  max?: number;
  color?: string;
  label?: string;
}

export interface ChartTimeMarker {
  t: number;
  label?: string;
  color?: string;
}

const HEX = {
  neon: "#66bb6a",
  teal: "#26c6da",
  amber: "#ffb74d",
  bad: "#ef5350",
  gray3: "#243044",
  gray5: "#8b95a8",
  white: "#e8eef8",
  orange: "#ff8a65",
  purple: "#a78bfa",
} as const;

const DEFAULT_PALETTE = [HEX.neon, HEX.teal, HEX.amber, HEX.gray5];

const TOKEN_HEX: Record<string, string> = {
  "var(--dsc-neon)": HEX.neon,
  "var(--dsc-teal)": HEX.teal,
  "var(--dsc-amber)": HEX.amber,
  "var(--dsc-bad)": HEX.bad,
  "var(--dsc-gray-3)": HEX.gray3,
  "var(--dsc-gray-5)": HEX.gray5,
  "var(--dsc-white)": HEX.white,
  "var(--dsc-orange)": HEX.orange,
  "var(--dsc-purple)": HEX.purple,
  "var(--dsc-blue)": HEX.teal,
  "var(--dsc-teal-dim)": "rgba(38, 198, 218, 0.45)",
  "var(--dsc-blue-dim)": "rgba(38, 198, 218, 0.4)",
  "var(--dsc-purple-dim)": "rgba(167, 139, 250, 0.35)",
};

export function hexColor(c?: string, fallback: string = HEX.teal): string {
  if (!c) return fallback;
  if (c.startsWith("#") || c.startsWith("rgb")) return c;
  return TOKEN_HEX[c] ?? fallback;
}

const METRIC_AXIS_PRESETS: Record<string, { min: number; max: number }> = {
  kpa: { min: 0, max: 2.5 },
  "°c": { min: 15, max: 35 },
  c: { min: 15, max: 35 },
  "%": { min: 0, max: 100 },
};

function niceMax(values: number[]): number {
  const m = Math.max(...values, 1);
  const pow = 10 ** Math.floor(Math.log10(m));
  return Math.ceil(m / pow) * pow;
}

function niceMin(values: number[], floorZero = false): number {
  const m = Math.min(...values);
  if (floorZero && m >= 0) return 0;
  const span = Math.abs(m) || 1;
  const pow = 10 ** Math.floor(Math.log10(span));
  return Math.floor(m / pow) * pow;
}

function padDomain(min: number, max: number, padFrac = 0.08): { min: number; max: number } {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 1 };
  if (max <= min) return { min: min - 1, max: max + 1 };
  const span = max - min;
  const pad = span * padFrac || 1;
  return { min: min - pad, max: max + pad };
}

function fmtTime(t: number, chartHours?: number): string {
  const d = new Date(t);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (chartHours != null && chartHours >= 24) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[d.getDay()]} ${hh}:${mm}`;
  }
  return `${hh}:${mm}`;
}

function domainForAxis(
  series: NamedSeries[],
  axis: "left" | "right",
  fixed?: { min?: number; max?: number },
  unitHintOverride?: string,
  hasTargets?: boolean,
): { min: number; max: number } {
  const vals = series.filter((s) => (s.axis || "left") === axis).flatMap((s) => s.series.map((p) => p.v));
  if (fixed?.min != null && fixed?.max != null) {
    // Honor the configured band, but never let a genuine out-of-range reading (heater runaway,
    // failed dehumidifier) get silently clipped off the chart — expand outward only when data
    // actually exceeds the fixed bounds.
    if (!vals.length) return { min: fixed.min, max: fixed.max };
    const dataMin = Math.min(...vals);
    const dataMax = Math.max(...vals);
    if (dataMin >= fixed.min && dataMax <= fixed.max) return { min: fixed.min, max: fixed.max };
    const expanded = padDomain(Math.min(fixed.min, dataMin), Math.max(fixed.max, dataMax));
    return { min: Math.min(fixed.min, expanded.min), max: Math.max(fixed.max, expanded.max) };
  }
  const unitHint =
    unitHintOverride?.toLowerCase() ??
    series.find((s) => (s.axis || "left") === axis)?.unit?.toLowerCase() ??
    "";
  const preset = METRIC_AXIS_PRESETS[unitHint.replace(/\s/g, "")] ?? METRIC_AXIS_PRESETS[unitHint];
  if (!vals.length) {
    if (preset) return preset;
    if (unitHint.includes("kpa")) return { min: 0, max: 2 };
    if (unitHint.includes("%")) return { min: 0, max: 100 };
    if (axis === "right") return { min: 0, max: 100 };
    return { min: 0, max: 1 };
  }
  if (preset && hasTargets) {
    const lo = Math.min(...vals, preset.min);
    const hi = Math.max(...vals, preset.max);
    return padDomain(Math.min(lo, preset.min), Math.max(hi, preset.max));
  }
  if (axis === "right") {
    const lo = Math.min(...vals, 0);
    const hi = Math.max(...vals, 100);
    if (hi <= 100 && lo >= 0) return { min: 0, max: 100 };
    return padDomain(niceMin(vals, true), niceMax(vals));
  }
  return padDomain(niceMin(vals), niceMax(vals));
}

function visualPieces(
  band: { min: number; max: number } | undefined,
  base: string,
): { lte?: number; gt?: number; color: string }[] | undefined {
  if (!band) return undefined;
  const span = Math.max(band.max - band.min, 1e-6);
  const m = Math.max(span * 0.12, 0.05);
  return [
    { lte: band.min - 3 * m, color: HEX.bad },
    { gt: band.min - 3 * m, lte: band.min - m, color: HEX.amber },
    { gt: band.min - m, lte: band.max + m, color: base },
    { gt: band.max + m, lte: band.max + 3 * m, color: HEX.amber },
    { gt: band.max + 3 * m, color: HEX.bad },
  ];
}

export function MultiLineChart({
  series: named,
  height = 180,
  unit = "",
  live = true,
  emptyLabel = "thin recorder",
  lastSyncAt,
  targets = [],
  timeMarkers = [],
  xDomain,
  yDomain,
  chartHours,
}: {
  series: NamedSeries[];
  height?: number;
  unit?: string;
  live?: boolean;
  emptyLabel?: string;
  lastSyncAt?: number;
  targets?: ChartTarget[];
  timeMarkers?: ChartTimeMarker[];
  xDomain?: { min: number; max: number };
  yDomain?: { left?: { min: number; max: number }; right?: { min: number; max: number } };
  chartHours?: number;
}) {
  const hasRight = named.some((s) => s.axis === "right");

  const chartStale = useMemo(() => {
    if (!named.length) return false;
    const all = named.flatMap((s) => s.series);
    if (!all.length) return false;
    const lastDataT = Math.max(...all.map((p) => p.t));
    const syncAge = lastSyncAt != null ? Date.now() - lastSyncAt : Date.now() - lastDataT;
    return syncAge > MAX_HOLD_TO_NOW_MS;
  }, [named, lastSyncAt]);

  const option = useMemo<EChartsCoreOption>(() => {
    const all = named.flatMap((s) => s.series);
    if (!all.length) {
      return {
        backgroundColor: "transparent",
        graphic: {
          type: "text",
          left: "center",
          top: "middle",
          style: { text: emptyLabel, fill: HEX.gray5, fontSize: 12 },
        },
      };
    }
    const left = domainForAxis(named, "left", yDomain?.left, unit, targets.length > 0);
    const right = domainForAxis(named, "right", yDomain?.right, unit, targets.length > 0);
    const visualMap = named.flatMap((s, i) => {
      const pieces = s.ghost ? undefined : visualPieces(s.band, hexColor(s.color, DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]));
      if (!pieces) return [];
      return [{ show: false, seriesIndex: i, pieces, dimension: 1 }];
    });

    const leftMarks: { markLine?: object; markArea?: object } = { markLine: { silent: true, symbol: "none", data: [] as object[] }, markArea: { silent: true, data: [] as object[][] } };
    const rightMarks: { markLine?: object; markArea?: object } = { markLine: { silent: true, symbol: "none", data: [] as object[] }, markArea: { silent: true, data: [] as object[][] } };
    for (const tg of targets) {
      const bucket = (tg.axis || "left") === "right" ? rightMarks : leftMarks;
      const color = hexColor(tg.color, (tg.axis || "left") === "right" ? HEX.teal : HEX.amber);
      const lineData = bucket.markLine as { data: object[] };
      const areaData = bucket.markArea as { data: object[][] };
      if (tg.min != null && tg.max != null) {
        areaData.data.push([
          { yAxis: tg.min, itemStyle: { color, opacity: 0.08 } },
          { yAxis: tg.max },
        ]);
        lineData.data.push(
          { yAxis: tg.min, lineStyle: { color, type: "dashed", width: 1 } },
          { yAxis: tg.max, lineStyle: { color, type: "dashed", width: 1 } },
        );
      } else if (tg.value != null && Number.isFinite(tg.value)) {
        lineData.data.push({
          yAxis: tg.value,
          name: tg.label,
          label: { formatter: tg.label || "", color, fontSize: 9 },
          lineStyle: { color, type: "dashed", width: 1.2 },
        });
      }
    }

    for (const mk of timeMarkers) {
      if (!Number.isFinite(mk.t)) continue;
      const color = hexColor(mk.color, HEX.amber);
      (leftMarks.markLine as { data: object[] }).data.push({
        xAxis: mk.t,
        name: mk.label,
        label: { formatter: mk.label || "", color, fontSize: 9 },
        lineStyle: { color, type: "solid", width: 1.5 },
      });
    }

    const firstLeft = named.findIndex((s) => (s.axis || "left") === "left");
    const firstRight = named.findIndex((s) => s.axis === "right");

    return {
      backgroundColor: "transparent",
      animation: !chartStale,
      grid: { left: 44, right: hasRight ? 44 : 16, top: 16, bottom: 28 },
      tooltip: {
        trigger: "axis",
        backgroundColor: HEX.gray3,
        borderColor: HEX.gray5,
        textStyle: { color: HEX.white, fontSize: 11 },
        formatter: (params: unknown) => {
          const rows = Array.isArray(params) ? params : [params];
          const first = rows[0] as { axisValue?: number } | undefined;
          const t = first?.axisValue;
          const head = typeof t === "number" ? `<div>${fmtTime(t, chartHours)}</div>` : "";
          const body = rows
            .map((raw) => {
              const p = raw as { seriesName?: string; value?: [number, number]; color?: string };
              const v = Array.isArray(p.value) ? p.value[1] : undefined;
              if (v == null || !Number.isFinite(v)) return "";
              return `<div>${p.seriesName ?? ""} ${v.toFixed(v >= 100 ? 0 : 1)}</div>`;
            })
            .join("");
          return head + body;
        },
      },
      xAxis: {
        type: "time",
        min: xDomain?.min,
        max: xDomain?.max,
        axisLine: { lineStyle: { color: HEX.gray5 } },
        axisLabel: {
          color: HEX.gray5,
          fontSize: 9,
          formatter: (v: number) => fmtTime(v, chartHours),
        },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: "value",
          min: left.min,
          max: left.max,
          axisLabel: { color: HEX.gray5, fontSize: 9 },
          splitLine: { lineStyle: { color: HEX.gray3, type: "dashed" } },
        },
        {
          type: "value",
          min: right.min,
          max: right.max,
          show: hasRight,
          axisLabel: { color: HEX.teal, fontSize: 9 },
          splitLine: { show: false },
        },
      ],
      visualMap: visualMap.length ? visualMap : undefined,
      series: named.map((s, i) => {
        const color = hexColor(s.color, DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]);
        const yAxisIndex = s.axis === "right" ? 1 : 0;
        const attachMarks = i === firstLeft || i === firstRight;
        const marks = s.axis === "right" ? rightMarks : leftMarks;
        return {
          id: s.id,
          name: s.label || s.id,
          type: "line" as const,
          yAxisIndex,
          showSymbol: live && !chartStale && !s.ghost,
          symbolSize: 4,
          step: s.step ? ("end" as const) : undefined,
          data: s.series.map((p) => [p.t, p.v]),
          lineStyle: {
            color,
            width: s.ghost ? 1.6 : 2.2,
            type: s.ghost ? ("dashed" as const) : ("solid" as const),
            opacity: s.ghost ? 0.55 : chartStale ? 0.7 : 0.95,
          },
          itemStyle: { color },
          areaStyle: s.ghost
            ? undefined
            : { color, opacity: 0.12 },
          ...(attachMarks ? marks : {}),
        };
      }),
    };
  }, [named, height, unit, live, emptyLabel, lastSyncAt, targets, timeMarkers, xDomain, yDomain, chartHours, hasRight, chartStale]);

  const lastPrimary = named[0]?.series.length
    ? named[0].series[named[0].series.length - 1]?.v
    : null;

  return (
    <div className={`dsc-chart${chartStale ? " is-stale" : ""}`} style={{ position: "relative", width: "100%" }}>
      <EChart option={option} style={{ width: "100%", height }} ariaLabel="Live chart" />
      <div className="dsc-chart-legend">
        {named
          .filter((s) => s.label)
          .map((s, i) => (
            <span key={s.id} className="dsc-chart-legend-item">
              <i style={{ background: hexColor(s.color, DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]) }} />
              {s.label}
            </span>
          ))}
        {lastPrimary != null ? (
          <span className="dsc-chart-last">
            {lastPrimary.toFixed(1)}
            {unit ? ` ${unit}` : named[0]?.unit ? ` ${named[0].unit}` : ""}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** GaugeSegment breakpoints (value-space) -> ECharts axisLine color stops (cumulative percent-space). */
function segmentsToAxisColor(segments: GaugeSegment[], min: number, max: number): [number, string][] {
  const span = Math.max(max - min, 1e-6);
  const out: [number, string][] = segments.map((seg, i) => {
    const nextFrom = i + 1 < segments.length ? segments[i + 1].from : max;
    const pct = Math.min(1, Math.max(0, (nextFrom - min) / span));
    return [pct, seg.color];
  });
  if (out.length && out[out.length - 1][0] < 1) out[out.length - 1] = [1, out[out.length - 1][1]];
  return out;
}

export function ArcGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "",
  target,
  band,
  segments,
  extrema,
  stale,
  onClick,
  progress,
}: {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  target?: number;
  band?: { min: number; max: number };
  segments?: GaugeSegment[];
  extrema?: { min?: number; max?: number };
  stale?: boolean;
  onClick?: () => void;
  progress?: boolean;
}) {
  const display = Number.isFinite(value) ? value : NaN;
  const hasData = Number.isFinite(display);
  const validBand = !progress && isValidBand(band) ? band : undefined;
  const holding = !!(hasData && stale);
  const tone = progress
    ? ("muted" as const)
    : zoneTone({
        value: display,
        band: validBand,
        margin: defaultBandMargin(validBand, unit),
        stale: holding,
        available: hasData,
      });
  const toneCls = progress ? "is-progress" : toneClass(tone);
  const stroke = !hasData
    ? HEX.gray5
    : progress
      ? HEX.teal
      : holding
        ? HEX.amber
        : tone === "critical"
          ? HEX.bad
          : tone === "warn"
            ? HEX.amber
            : validBand
              ? HEX.neon
              : HEX.teal;

  const valueText = !hasData
    ? "No data"
    : holding
      ? `${display.toFixed(display >= 100 ? 0 : display < 10 ? 2 : 1)} ${unit} held`
      : `${display.toFixed(display >= 100 ? 0 : display < 10 ? 2 : 1)} ${unit}`;

  const option = useMemo<EChartsCoreOption>(() => {
    const span = Math.max(max - min, 1e-6);
    let axisColor: [number, string][] = [];
    if (hasData && segments && segments.length) {
      // 5-zone red/amber/green/amber/red — the richer "drifting toward the edge" treatment.
      axisColor = segmentsToAxisColor(segments, min, max);
    } else if (hasData && validBand) {
      const a = Math.min(1, Math.max(0, (validBand.min - min) / span));
      const b = Math.min(1, Math.max(a, (validBand.max - min) / span));
      if (a > 0) axisColor.push([a, HEX.gray3]);
      axisColor.push([b, "rgba(102, 187, 106, 0.38)"]);
      if (b < 1) axisColor.push([1, HEX.gray3]);
    } else {
      axisColor.push([1, HEX.gray3]);
    }

    const pointers: { value: number; name: string; itemStyle: { color: string }; needle?: boolean }[] = [];
    if (hasData && target != null && Number.isFinite(target)) {
      // Needle so the exact Want value has a visible marker on the dial, not just an
      // inert data point the series' pointer:{show:false} silently swallows.
      pointers.push({ value: target, name: "Want", itemStyle: { color: HEX.white }, needle: true });
    }
    if (hasData && extrema?.min != null) {
      pointers.push({ value: extrema.min, name: "min", itemStyle: { color: HEX.gray5 } });
    }
    if (hasData && extrema?.max != null) {
      pointers.push({ value: extrema.max, name: "max", itemStyle: { color: HEX.gray5 } });
    }

    return {
      backgroundColor: "transparent",
      animationDuration: 280,
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min,
          max,
          center: ["50%", "68%"],
          radius: "96%",
          pointer: { show: false },
          progress: {
            show: hasData,
            width: 10,
            roundCap: true,
            itemStyle: { color: stroke },
          },
          axisLine: { lineStyle: { width: 10, color: axisColor } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            color: HEX.gray5,
            fontSize: 9,
            distance: -6,
            formatter: (v: number) =>
              Math.abs(v - min) < span * 0.02 || Math.abs(v - max) < span * 0.02
                ? (Number.isInteger(v) || Math.abs(v) >= 100 ? String(Math.round(v)) : v.toFixed(1))
                : "",
          },
          anchor: { show: false },
          title: {
            show: true,
            offsetCenter: [0, "28%"],
            color: holding ? HEX.amber : HEX.gray5,
            fontSize: 10,
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "-8%"],
            color: HEX.white,
            fontSize: 18,
            fontWeight: 700,
            formatter: () =>
              hasData ? display.toFixed(display >= 100 ? 0 : display < 10 ? 2 : 1) : "—",
          },
          data: [
            { value: hasData ? display : min, name: holding ? "HELD" : hasData ? unit : "no data" },
            ...pointers.map((p) =>
              p.needle
                ? {
                    value: p.value,
                    name: "",
                    pointer: { show: true, showAbove: true, length: "72%", width: 3, itemStyle: p.itemStyle },
                    progress: { show: false },
                    detail: { show: false },
                    title: { show: false },
                    anchor: { show: false },
                  }
                : { value: p.value, name: "", itemStyle: p.itemStyle },
            ),
          ],
        },
      ],
    };
  }, [display, hasData, holding, max, min, stroke, unit, validBand, segments, extrema, target]);

  const gauge = (
    <div
      className={`dsc-gauge ${toneCls}${holding ? " is-stale" : ""}${onClick ? " is-clickable" : ""}`}
      role="img"
      aria-label={label}
      aria-valuetext={valueText}
    >
      <EChart option={option} className="dsc-gauge-chart" ariaLabel={label} />
      <div className="dsc-gauge-label">{label}</div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" className="dsc-gauge-hit" onClick={onClick} title={`History · ${label}`}>
        {gauge}
      </button>
    );
  }
  return gauge;
}

export function Sparkline({
  series,
  color = HEX.teal,
  width = 120,
  height = 28,
}: {
  series: SeriesPoint[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const option = useMemo<EChartsCoreOption>(() => {
    if (series.length < 2) {
      return { backgroundColor: "transparent" };
    }
    return {
      backgroundColor: "transparent",
      animationDuration: 420,
      grid: { left: 0, right: 0, top: 2, bottom: 2 },
      xAxis: { type: "time", show: false },
      yAxis: { type: "value", show: false, scale: true },
      series: [
        {
          type: "line",
          showSymbol: false,
          data: series.map((p) => [p.t, p.v]),
          lineStyle: { color: hexColor(color, HEX.teal), width: 1.6 },
        },
      ],
    };
  }, [series, color]);

  if (series.length < 2) {
    return <div className="dsc-sparkline dsc-muted" style={{ width, height }} />;
  }
  return <EChart option={option} className="dsc-sparkline" style={{ width, height }} ariaLabel="sparkline" />;
}

function useEased(value: number, ms = 280): number {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!Number.isFinite(value)) {
      setShown(value);
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const from = Number.isFinite(shown) ? shown : value;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - (1 - t) ** 3;
      setShown(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ms]);
  return shown;
}

function GotWantBarRow({
  row,
}: {
  row: {
    label: string;
    got: number;
    wantMin?: number;
    wantMax?: number;
    want?: number;
    unit?: string;
    stale?: boolean;
  };
}) {
  const want =
    row.want != null
      ? row.want
      : row.wantMin != null && row.wantMax != null && row.wantMax > row.wantMin
        ? (row.wantMin + row.wantMax) / 2
        : NaN;
  const gotMissing = !Number.isFinite(row.got);
  const holding = !!(!gotMissing && row.stale);
  const band =
    row.wantMin != null &&
    row.wantMax != null &&
    Number.isFinite(row.wantMin) &&
    Number.isFinite(row.wantMax) &&
    row.wantMax > row.wantMin
      ? { min: row.wantMin, max: row.wantMax }
      : undefined;
  const gotTone = zoneTone({
    value: row.got,
    band,
    margin: defaultBandMargin(band, row.unit),
    stale: holding,
    available: !gotMissing,
  });
  const max = Math.max(
    gotMissing ? 0 : row.got,
    Number.isFinite(want) ? want : 0,
    row.wantMax ?? 0,
    1,
  );
  const gotPct = gotMissing ? 0 : (row.got / max) * 100;
  const wantPct = Number.isFinite(want) ? (want / max) * 100 : 0;
  const easedGot = useEased(gotPct);
  const easedWant = useEased(wantPct);

  return (
    <div className={`dsc-gotwant-row${holding ? " is-stale" : gotMissing ? " is-muted" : ""}`}>
      <div className="dsc-gotwant-label">{row.label}</div>
      <div className="dsc-gotwant-track">
        {Number.isFinite(want) ? (
          <div className="dsc-gotwant-want" style={{ width: `${easedWant}%` }} />
        ) : null}
        {gotMissing ? null : (
          <div
            className="dsc-gotwant-got"
            style={{ width: `${easedGot}%`, background: toneCssColor(gotTone) }}
          />
        )}
      </div>
      <div className="dsc-gotwant-vals">
        <span>
          Got {gotMissing ? "—" : row.got.toFixed(1)}
          {gotMissing ? "" : row.unit || ""}
        </span>
        <span className="dsc-muted">
          Want{" "}
          {row.wantMin != null && row.wantMax != null
            ? `${row.wantMin}–${row.wantMax}`
            : Number.isFinite(want)
              ? want.toFixed(1)
              : "—"}
        </span>
      </div>
    </div>
  );
}

export function GotWantBars({
  rows,
}: {
  rows: {
    label: string;
    got: number;
    wantMin?: number;
    wantMax?: number;
    want?: number;
    unit?: string;
    stale?: boolean;
  }[];
}) {
  return (
    <div className="dsc-gotwant">
      {rows.map((row) => (
        <GotWantBarRow key={row.label} row={row} />
      ))}
    </div>
  );
}

/** Session extrema from a series window. */
export function seriesExtrema(series: SeriesPoint[]): { min?: number; max?: number } {
  if (!series.length) return {};
  let min = series[0].v;
  let max = series[0].v;
  for (const p of series) {
    if (p.v < min) min = p.v;
    if (p.v > max) max = p.v;
  }
  return { min, max };
}
