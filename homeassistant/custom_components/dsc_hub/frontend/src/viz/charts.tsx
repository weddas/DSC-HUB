import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { defaultBandMargin, isValidBand, toneClass, toneCssColor, zoneTone } from "../lib/zoneTone";
import { type GaugeSegment } from "./gaugeTheme";

export interface SeriesPoint {
  t: number;
  v: number;
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

const DEFAULT_PALETTE = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)",
];

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

function xyFor(
  p: SeriesPoint,
  width: number,
  height: number,
  pad: { l: number; r: number; t: number; b: number },
  min: number,
  max: number,
  t0: number,
  t1: number,
): { x: number; y: number } {
  const span = Math.max(max - min, 1e-6);
  const tSpan = Math.max(t1 - t0, 1);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  return {
    x: pad.l + ((p.t - t0) / tSpan) * innerW,
    y: pad.t + (1 - (p.v - min) / span) * innerH,
  };
}

function buildPath(
  series: SeriesPoint[],
  width: number,
  height: number,
  pad: { l: number; r: number; t: number; b: number },
  min: number,
  max: number,
  t0: number,
  t1: number,
  step = false,
): string {
  if (!series.length) return "";
  return series
    .map((p, i) => {
      const { x, y } = xyFor(p, width, height, pad, min, max, t0, t1);
      if (i === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;
      if (!step) return `L${x.toFixed(1)} ${y.toFixed(1)}`;
      const prev = xyFor(series[i - 1], width, height, pad, min, max, t0, t1);
      return `L${x.toFixed(1)} ${prev.y.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Same thresholds as zoneTone: in band ±m = base, drifting ≤3m out = amber, beyond = red. */
function severityColor(v: number, band: { min: number; max: number } | undefined, base: string): string {
  if (!band || !Number.isFinite(v)) return base;
  const span = Math.max(band.max - band.min, 1e-6);
  const m = Math.max(span * 0.12, 0.05);
  if (v < band.min - 3 * m || v > band.max + 3 * m) return "var(--dsc-bad)";
  if (v < band.min - m || v > band.max + m) return "var(--dsc-amber)";
  return base;
}

function buildColoredSegments(
  series: SeriesPoint[],
  width: number,
  height: number,
  pad: { l: number; r: number; t: number; b: number },
  min: number,
  max: number,
  t0: number,
  t1: number,
  band: { min: number; max: number } | undefined,
  base: string,
  step = false,
): { d: string; color: string }[] {
  if (series.length < 2) return [];
  const segs: { d: string; color: string }[] = [];
  for (let i = 1; i < series.length; i++) {
    const a = series[i - 1];
    const b = series[i];
    const pa = xyFor(a, width, height, pad, min, max, t0, t1);
    const pb = xyFor(b, width, height, pad, min, max, t0, t1);
    const color = severityColor(b.v, band, base);
    const d = step
      ? `M${pa.x.toFixed(1)} ${pa.y.toFixed(1)} L${pb.x.toFixed(1)} ${pa.y.toFixed(1)} L${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`
      : `M${pa.x.toFixed(1)} ${pa.y.toFixed(1)} L${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`;
    const last = segs[segs.length - 1];
    if (last && last.color === color) last.d += d.slice(1);
    else segs.push({ d, color });
  }
  return segs;
}

function fmtTime(t: number): string {
  const d = new Date(t);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function yFor(
  v: number,
  min: number,
  max: number,
  height: number,
  pad: { t: number; b: number },
): number {
  const span = Math.max(max - min, 1e-6);
  return pad.t + (1 - (v - min) / span) * (height - pad.t - pad.b);
}

function domainForAxis(
  series: NamedSeries[],
  axis: "left" | "right",
  fixed?: { min?: number; max?: number },
): { min: number; max: number } {
  if (fixed?.min != null && fixed?.max != null) return { min: fixed.min, max: fixed.max };
  const vals = series.filter((s) => (s.axis || "left") === axis).flatMap((s) => s.series.map((p) => p.v));
  if (!vals.length) {
    if (axis === "right") return { min: 0, max: 100 };
    return { min: 0, max: 1 };
  }
  if (axis === "right") {
    const lo = Math.min(...vals, 0);
    const hi = Math.max(...vals, 100);
    if (hi <= 100 && lo >= 0) return { min: 0, max: 100 };
    return padDomain(niceMin(vals, true), niceMax(vals));
  }
  return padDomain(niceMin(vals), niceMax(vals));
}

export function MultiLineChart({
  series: named,
  height = 180,
  unit = "",
  live = true,
  emptyLabel = "thin recorder",
  lastSyncAt,
  targets = [],
  yDomain,
}: {
  series: NamedSeries[];
  height?: number;
  unit?: string;
  live?: boolean;
  emptyLabel?: string;
  lastSyncAt?: number;
  targets?: ChartTarget[];
  yDomain?: { left?: { min: number; max: number }; right?: { min: number; max: number } };
}) {
  const gid = useId().replace(/:/g, "");
  const width = 640;
  const hasRight = named.some((s) => s.axis === "right");
  const pad = { l: 40, r: hasRight ? 40 : 14, t: 16, b: 28 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<{ t: number; x: number } | null>(null);
  const [pinned, setPinned] = useState(false);

  void lastSyncAt;

  const model = useMemo(() => {
    const all = named.flatMap((s) => s.series);
    if (!all.length) return null;
    const left = domainForAxis(named, "left", yDomain?.left);
    const right = domainForAxis(named, "right", yDomain?.right);
    const t0 = Math.min(...all.map((p) => p.t));
    const t1 = Math.max(...all.map((p) => p.t), Date.now());
    const paths = named.map((s, i) => {
      const axis = s.axis || "left";
      const dom = axis === "right" ? right : left;
      const color = s.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];
      return {
        ...s,
        axis,
        color,
        d: buildPath(s.series, width, height, pad, dom.min, dom.max, t0, t1, s.step),
        segs: s.ghost
          ? []
          : buildColoredSegments(s.series, width, height, pad, dom.min, dom.max, t0, t1, s.band, color, s.step),
        last: s.series.length ? s.series[s.series.length - 1] : null,
        ext: seriesExtrema(s.series),
        dom,
      };
    });
    return { left, right, t0, t1, paths };
  }, [named, height, hasRight, yDomain]);

  const gridLeft = useMemo(() => {
    if (!model) return [];
    const ticks = 4;
    const out: { y: number; label: string }[] = [];
    for (let i = 0; i <= ticks; i++) {
      const frac = i / ticks;
      const v = model.left.max - frac * (model.left.max - model.left.min);
      const y = pad.t + frac * (height - pad.t - pad.b);
      out.push({ y, label: v.toFixed(Math.abs(v) >= 100 ? 0 : 1) });
    }
    return out;
  }, [model, height]);

  const gridRight = useMemo(() => {
    if (!model || !hasRight) return [];
    const ticks = 4;
    const out: { y: number; label: string }[] = [];
    for (let i = 0; i <= ticks; i++) {
      const frac = i / ticks;
      const v = model.right.max - frac * (model.right.max - model.right.min);
      const y = pad.t + frac * (height - pad.t - pad.b);
      out.push({ y, label: v.toFixed(Math.abs(v) >= 100 ? 0 : 1) });
    }
    return out;
  }, [model, height, hasRight]);

  const timeTicks = useMemo(() => {
    if (!model) return [];
    const n = 5;
    const out: { x: number; label: string }[] = [];
    const span = Math.max(model.t1 - model.t0, 1);
    const innerW = width - pad.l - pad.r;
    for (let i = 0; i < n; i++) {
      const frac = i / (n - 1);
      const t = model.t0 + frac * span;
      out.push({ x: pad.l + frac * innerW, label: fmtTime(t) });
    }
    return out;
  }, [model]);

  const clientToChartX = useCallback(
    (clientX: number) => {
      const el = svgRef.current;
      if (!el || !model) return null;
      const rect = el.getBoundingClientRect();
      const sx = ((clientX - rect.left) / Math.max(rect.width, 1)) * width;
      const innerW = width - pad.l - pad.r;
      const clamped = Math.min(width - pad.r, Math.max(pad.l, sx));
      const frac = (clamped - pad.l) / Math.max(innerW, 1);
      const t = model.t0 + frac * Math.max(model.t1 - model.t0, 1);
      return { t, x: clamped };
    },
    [model],
  );

  const onPointerMove = (e: ReactPointerEvent) => {
    if (pinned) return;
    const hit = clientToChartX(e.clientX);
    if (hit) setHover(hit);
  };

  const onPointerLeave = () => {
    if (!pinned) setHover(null);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    const hit = clientToChartX(e.clientX);
    if (!hit) return;
    if (pinned && hover && Math.abs(hover.x - hit.x) < 8) {
      setPinned(false);
      setHover(null);
      return;
    }
    setPinned(true);
    setHover(hit);
  };

  const hoverSamples = useMemo(() => {
    if (!model || !hover) return [];
    return model.paths.map((p) => {
      if (!p.series.length) return { id: p.id, label: p.label, color: p.color, v: null as number | null, unit: p.unit || "" };
      let best = p.series[0];
      let bestD = Math.abs(best.t - hover.t);
      for (const pt of p.series) {
        const d = Math.abs(pt.t - hover.t);
        if (d < bestD) {
          best = pt;
          bestD = d;
        }
      }
      const y = yFor(best.v, p.dom.min, p.dom.max, height, pad);
      return {
        id: p.id,
        label: p.label,
        color: p.color,
        v: best.v,
        unit: p.unit || "",
        y,
        x: pad.l + ((best.t - model.t0) / Math.max(model.t1 - model.t0, 1)) * (width - pad.l - pad.r),
      };
    });
  }, [model, hover, height]);

  const drawKey = model
    ? `${model.t0}-${model.t1}-${model.paths.map((p) => p.d).join("|")}`
    : "empty";
  const drawProgress = useAnimProgress(drawKey);
  const pathLen = width * 1.4;
  const dash = animatedDash(pathLen, drawProgress);

  const lastPrimary = model?.paths[0]?.last?.v ?? null;

  return (
    <div className="dsc-chart" style={{ position: "relative", width: "100%" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Live chart"
        className="dsc-chart-svg"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <defs>
          {model?.paths.map((p) => (
            <linearGradient key={p.id} id={`fill-${gid}-${p.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </linearGradient>
          ))}
          <filter id={`glow-${gid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`glow-soft-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
            </feMerge>
          </filter>
        </defs>

        {gridLeft.map((g) => (
          <g key={`L${g.y}`}>
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={g.y}
              y2={g.y}
              stroke="var(--dsc-gray-3)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text
              x={pad.l - 6}
              y={g.y + 3}
              textAnchor="end"
              fill="var(--dsc-gray-5)"
              fontSize="9"
              fontFamily="var(--dsc-mono)"
            >
              {g.label}
            </text>
          </g>
        ))}

        {gridRight.map((g) => (
          <text
            key={`R${g.y}`}
            x={width - pad.r + 6}
            y={g.y + 3}
            textAnchor="start"
            fill="var(--dsc-teal)"
            fontSize="9"
            fontFamily="var(--dsc-mono)"
            opacity={0.85}
          >
            {g.label}
          </text>
        ))}

        {timeTicks.map((t) => (
          <text
            key={t.x}
            x={t.x}
            y={height - 8}
            textAnchor="middle"
            fill="var(--dsc-gray-5)"
            fontSize="9"
            fontFamily="var(--dsc-mono)"
          >
            {t.label}
          </text>
        ))}

        {!model ? (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fill="var(--dsc-gray-5)"
            fontSize="12"
          >
            {emptyLabel}
          </text>
        ) : (
          <>
            {targets.map((tg, i) => {
              const axis = tg.axis || "left";
              const dom = axis === "right" ? model.right : model.left;
              const color = tg.color || (axis === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (tg.min != null && tg.max != null) {
                const y1 = yFor(tg.max, dom.min, dom.max, height, pad);
                const y2 = yFor(tg.min, dom.min, dom.max, height, pad);
                return (
                  <g key={`tg-${i}`}>
                    <rect
                      x={pad.l}
                      y={Math.min(y1, y2)}
                      width={width - pad.l - pad.r}
                      height={Math.abs(y2 - y1)}
                      fill={color}
                      opacity={0.08}
                    />
                    <line
                      x1={pad.l}
                      x2={width - pad.r}
                      y1={y1}
                      y2={y1}
                      stroke={color}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity={0.7}
                    />
                    <line
                      x1={pad.l}
                      x2={width - pad.r}
                      y1={y2}
                      y2={y2}
                      stroke={color}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity={0.7}
                    />
                  </g>
                );
              }
              if (tg.value == null || !Number.isFinite(tg.value)) return null;
              const y = yFor(tg.value, dom.min, dom.max, height, pad);
              return (
                <g key={`tg-${i}`}>
                  <line
                    x1={pad.l}
                    x2={width - pad.r}
                    y1={y}
                    y2={y}
                    stroke={color}
                    strokeWidth="1.2"
                    strokeDasharray="5 4"
                    opacity={0.85}
                  />
                  {tg.label ? (
                    <text
                      x={width - pad.r - 2}
                      y={y - 4}
                      textAnchor="end"
                      fill={color}
                      fontSize="8"
                      fontFamily="var(--dsc-mono)"
                    >
                      {tg.label}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {model.paths.map((p) => {
              if (!p.d || p.series.length === 0) return null;
              const lastPt = p.last;
              const tipX =
                lastPt && model
                  ? pad.l +
                    ((lastPt.t - model.t0) / Math.max(model.t1 - model.t0, 1)) * (width - pad.l - pad.r)
                  : 0;
              const tipY = lastPt ? yFor(lastPt.v, p.dom.min, p.dom.max, height, pad) : 0;
              const segs = p.segs.length ? p.segs : [{ d: p.d, color: p.color }];
              return (
                <g key={p.id} className="dsc-chart-series">
                  {p.ghost ? (
                    <path
                      d={p.d}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={1.6}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeDasharray={dash.dasharray}
                      strokeDashoffset={dash.dashoffset}
                      opacity={0.55}
                      className="dsc-chart-core"
                    />
                  ) : (
                    segs.map((seg, si) => (
                      <path
                        key={`${p.id}-seg-${si}`}
                        d={seg.d}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={2.2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeDasharray={dash.dasharray}
                        strokeDashoffset={dash.dashoffset}
                        filter={`url(#glow-${gid})`}
                        opacity={0.95}
                        className="dsc-chart-core"
                      />
                    ))
                  )}
                  {live && lastPt ? (
                    <circle cx={tipX} cy={tipY} r={3} fill={p.color} opacity={0.9} className="dsc-chart-tip" />
                  ) : null}
                  {p.ext.min != null ? (
                    <text
                      x={pad.l + 2}
                      y={yFor(p.ext.min, p.dom.min, p.dom.max, height, pad) + 8}
                      fill={p.color}
                      fontSize="8"
                      opacity={0.7}
                    >
                      min {p.ext.min.toFixed(p.ext.min >= 100 ? 0 : 1)}
                    </text>
                  ) : null}
                  {p.ext.max != null ? (
                    <text
                      x={pad.l + 2}
                      y={yFor(p.ext.max, p.dom.min, p.dom.max, height, pad) - 3}
                      fill={p.color}
                      fontSize="8"
                      opacity={0.7}
                    >
                      max {p.ext.max.toFixed(p.ext.max >= 100 ? 0 : 1)}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {hover ? (
              <g className="dsc-chart-crosshair">
                <line
                  x1={hover.x}
                  x2={hover.x}
                  y1={pad.t}
                  y2={height - pad.b}
                  stroke="var(--dsc-white)"
                  strokeOpacity={0.35}
                  strokeWidth="1"
                />
                {hoverSamples.map((s) =>
                  s.v == null || s.y == null ? null : (
                    <circle
                      key={s.id}
                      cx={s.x ?? hover.x}
                      cy={s.y}
                      r={4}
                      fill={s.color}
                      stroke="var(--dsc-black)"
                      strokeWidth="1"
                    />
                  ),
                )}
              </g>
            ) : null}
          </>
        )}
      </svg>

      {hover && model ? (
        <div
          className="dsc-chart-tooltip"
          style={{
            left: `${Math.min(92, Math.max(8, (hover.x / width) * 100))}%`,
          }}
        >
          <div className="dsc-chart-tooltip-time">{fmtTime(hover.t)}</div>
          {hoverSamples.map((s) =>
            s.v == null ? null : (
              <div key={s.id} className="dsc-chart-tooltip-row">
                <i style={{ background: s.color }} />
                <span>
                  {s.label || s.id} {s.v.toFixed(s.v >= 100 ? 0 : 1)}
                  {s.unit ? ` ${s.unit}` : ""}
                </span>
              </div>
            ),
          )}
        </div>
      ) : null}

      <div className="dsc-chart-legend">
        {named
          .filter((s) => s.label)
          .map((s, i) => (
            <span key={s.id} className="dsc-chart-legend-item">
              <i style={{ background: s.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length] }} />
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

/** Draw-in progress 0→1 on mount / data change (rAF eased). */
function useAnimProgress(resetKey: unknown, duration = 520): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    setProgress(0);
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [resetKey, duration]);
  return progress;
}

function animatedDash(pathLen: number, progress: number): { dasharray: string; dashoffset: number } {
  const len = Math.max(pathLen, 1);
  return { dasharray: `${len}`, dashoffset: len * (1 - progress) };
}

/** SVG y grows downward — subtract the sine so the semicircle renders on top. */
function arcPoint(cx: number, cy: number, r: number, angleRad: number): { x: number; y: number } {
  return { x: cx + r * Math.cos(angleRad), y: cy - r * Math.sin(angleRad) };
}

function gaugeAngle(v: number, min: number, max: number): number {
  const p = Math.min(1, Math.max(0, (v - min) / Math.max(max - min, 1e-6)));
  return Math.PI - p * Math.PI;
}

function arcSlicePath(
  vStart: number,
  vEnd: number,
  min: number,
  max: number,
  cx: number,
  cy: number,
  r: number,
): string {
  const p0 = arcPoint(cx, cy, r, gaugeAngle(vStart, min, max));
  const p1 = arcPoint(cx, cy, r, gaugeAngle(vEnd, min, max));
  // sweep=0 (SVG CCW) stays on the top semicircle after the y-up arcPoint flip.
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 0 0 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

/** Hex palette — SVG presentation attrs cannot use CSS var(); must match dsc.css tokens. */
const GAUGE_PALETTE = {
  track: "#243044",
  teal: "#26c6da",
  ok: "#66bb6a",
  amber: "#ffb74d",
  bad: "#ef5350",
  gray4: "#8b95a8",
  gray5: "#8b95a8",
  white: "#e8eef8",
} as const;

export function ArcGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "",
  target,
  band,
  extrema,
  stale,
  onClick,
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
}) {
  // Hold needle at last good when stale/unavailable — never ease to min.
  const display = Number.isFinite(value) ? value : NaN;
  const hasData = Number.isFinite(display);
  const eased = useEased(hasData ? display : min);
  const needle = hasData ? eased : min;
  const clamped = Math.min(max, Math.max(min, needle));
  const span = Math.max(max - min, 1e-6);
  const pct = hasData ? (clamped - min) / span : 0;
  const r = 46;
  const c = 2 * Math.PI * r * 0.75;
  const dash = c * pct;
  const angAt = (v: number) => gaugeAngle(v, min, max);
  const validBand = isValidBand(band) ? band : undefined;
  const holding = !!(hasData && stale);
  const tone = zoneTone({
    value: display,
    band: validBand,
    margin: defaultBandMargin(validBand, unit),
    stale: holding,
    available: hasData,
  });
  const toneCls = toneClass(tone);
  // Grey track + one in-band highlight. Rainbow fragments were unlabeled noise.
  const bandArc =
    hasData && validBand ? arcSlicePath(validBand.min, validBand.max, min, max, 60, 72, r) : "";
  // Unified semantics: grey = no data, amber = held/drifting, red = out of band, green = in band.
  // Teal only when no band is configured (neutral live reading).
  const stroke = !hasData
    ? GAUGE_PALETTE.gray4
    : holding
      ? GAUGE_PALETTE.amber
      : tone === "critical"
        ? GAUGE_PALETTE.bad
        : tone === "warn"
          ? GAUGE_PALETTE.amber
          : validBand
            ? GAUGE_PALETTE.ok
            : GAUGE_PALETTE.teal;
  const filterId = `dsc-gauge-glow-${useId().replace(/:/g, "")}`;

  const tickMarks: { v: number; kind: "band" | "ext" | "target" }[] = [];
  if (hasData) {
    if (validBand) {
      tickMarks.push({ v: validBand.min, kind: "band" }, { v: validBand.max, kind: "band" });
    }
    if (extrema?.min != null) tickMarks.push({ v: extrema.min, kind: "ext" });
    if (extrema?.max != null) tickMarks.push({ v: extrema.max, kind: "ext" });
    if (target != null && Number.isFinite(target)) tickMarks.push({ v: target, kind: "target" });
  }

  const gauge = (
    <div
      className={`dsc-gauge ${toneCls}${holding ? " is-stale" : ""}${onClick ? " is-clickable" : ""}`}
    >
      <svg viewBox="0 0 120 90" width="140" height="105" aria-label={label}>
        <defs>
          <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M18 72 A46 46 0 1 1 102 72"
          fill="none"
          stroke={GAUGE_PALETTE.track}
          strokeWidth="10"
          strokeLinecap="butt"
        />
        {bandArc ? (
          <path
            d={bandArc}
            fill="none"
            stroke={GAUGE_PALETTE.ok}
            strokeWidth="10"
            strokeLinecap="butt"
            opacity={0.38}
          >
            <title>In-band range</title>
          </path>
        ) : null}
        {hasData ? (
          <path
            className="dsc-gauge-value"
            d="M18 72 A46 46 0 1 1 102 72"
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            filter={`url(#${filterId})`}
            style={{ transition: "stroke-dasharray 280ms ease, stroke 280ms ease" }}
          />
        ) : null}
        {tickMarks.map((tm, i) => {
          const ang = angAt(tm.v);
          const o = arcPoint(60, 72, tm.kind === "ext" ? r - 2 : r + 1, ang);
          const inn = arcPoint(60, 72, r - (tm.kind === "target" ? 14 : 10), ang);
          const col =
            tm.kind === "target"
              ? GAUGE_PALETTE.teal
              : tm.kind === "band"
                ? GAUGE_PALETTE.amber
                : GAUGE_PALETTE.gray5;
          const tickTitle =
            tm.kind === "target" ? "Target" : tm.kind === "band" ? "Want edge" : "Session extreme";
          return (
            <line
              key={`${tm.kind}-${i}`}
              x1={inn.x}
              y1={inn.y}
              x2={o.x}
              y2={o.y}
              stroke={col}
              strokeWidth={tm.kind === "target" ? 2.4 : 1.6}
              strokeLinecap="round"
              opacity={tm.kind === "ext" ? 0.65 : 0.95}
            >
              <title>{tickTitle}</title>
            </line>
          );
        })}
        <text
          x="60"
          y="58"
          textAnchor="middle"
          fill={GAUGE_PALETTE.white}
          fontSize="20"
          fontWeight="700"
          fontFamily="var(--dsc-mono)"
        >
          {Number.isFinite(display)
            ? display.toFixed(display >= 100 ? 0 : display < 10 ? 2 : 1)
            : "—"}
        </text>
        <text x="60" y="74" textAnchor="middle" fill={holding ? GAUGE_PALETTE.amber : GAUGE_PALETTE.gray5} fontSize="10">
          {holding ? "HELD" : hasData ? unit : "no data"}
        </text>
      </svg>
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

/** Compact sparkline for Mission / Root / Overview. */
export function Sparkline({
  series,
  color = "var(--dsc-teal)",
  width = 120,
  height = 28,
}: {
  series: SeriesPoint[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const drawKey = series.length ? `${series[0].t}-${series[series.length - 1].t}-${series.length}` : "empty";
  const drawProgress = useAnimProgress(drawKey, 420);

  if (series.length < 2) {
    return <div className="dsc-sparkline dsc-muted" style={{ width, height }} />;
  }
  const vals = series.map((p) => p.v);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = Math.max(hi - lo, 1e-6);
  const t0 = series[0].t;
  const t1 = series[series.length - 1].t;
  const tSpan = Math.max(t1 - t0, 1);
  const d = series
    .map((p, i) => {
      const x = ((p.t - t0) / tSpan) * width;
      const y = height - ((p.v - lo) / span) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const pathLen = width * 1.25;
  const dash = animatedDash(pathLen, drawProgress);
  return (
    <svg className="dsc-sparkline" width={width} height={height} aria-hidden>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray={dash.dasharray}
        strokeDashoffset={dash.dashoffset}
      />
    </svg>
  );
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
