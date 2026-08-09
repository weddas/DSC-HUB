import { useEffect, useId, useMemo, useState } from "react";

export interface SeriesPoint {
  t: number;
  v: number;
}

export interface NamedSeries {
  id: string;
  label: string;
  series: SeriesPoint[];
  color?: string;
}

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

function buildPath(
  series: SeriesPoint[],
  width: number,
  height: number,
  pad: { l: number; r: number; t: number; b: number },
  min: number,
  max: number,
  t0: number,
  t1: number,
): string {
  if (!series.length) return "";
  const span = Math.max(max - min, 1e-6);
  const tSpan = Math.max(t1 - t0, 1);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  return series
    .map((p, i) => {
      const x = pad.l + ((p.t - t0) / tSpan) * innerW;
      const y = pad.t + (1 - (p.v - min) / span) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function LiveLineChart({
  series,
  height = 160,
  unit = "",
  live = true,
  color = "var(--dsc-neon)",
  emptyLabel = "No history yet",
}: {
  series: SeriesPoint[];
  height?: number;
  unit?: string;
  live?: boolean;
  color?: string;
  emptyLabel?: string;
}) {
  return (
    <MultiLineChart
      series={[{ id: "main", label: "", series, color }]}
      height={height}
      unit={unit}
      live={live}
      emptyLabel={emptyLabel}
    />
  );
}

export function MultiLineChart({
  series: named,
  height = 180,
  unit = "",
  live = true,
  emptyLabel = "No history yet",
}: {
  series: NamedSeries[];
  height?: number;
  unit?: string;
  live?: boolean;
  emptyLabel?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const width = 640;
  const pad = { l: 36, r: 12, t: 16, b: 22 };
  const palette = ["var(--dsc-neon)", "#7dd3fc", "#fbbf24", "#f472b6"];

  const model = useMemo(() => {
    const all = named.flatMap((s) => s.series);
    if (!all.length) return null;
    const vals = all.map((p) => p.v);
    const max = niceMax(vals);
    const min = niceMin(vals, true);
    const t0 = Math.min(...all.map((p) => p.t));
    const t1 = Math.max(...all.map((p) => p.t));
    const paths = named.map((s, i) => ({
      ...s,
      color: s.color || palette[i % palette.length],
      d: buildPath(s.series, width, height, pad, min, max, t0, t1),
      last: s.series.length ? s.series[s.series.length - 1] : null,
    }));
    return { min, max, t0, t1, paths };
  }, [named, height]);

  const lastPrimary = model?.paths[0]?.last?.v ?? null;

  const gridYs = useMemo(() => {
    if (!model) return [];
    const ticks = 4;
    const out: { y: number; label: string }[] = [];
    for (let i = 0; i <= ticks; i++) {
      const frac = i / ticks;
      const v = model.max - frac * (model.max - model.min);
      const y = pad.t + frac * (height - pad.t - pad.b);
      out.push({ y, label: v.toFixed(v >= 100 ? 0 : 1) });
    }
    return out;
  }, [model, height]);

  return (
    <div className="dsc-chart" style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Live chart"
      >
        <defs>
          {model?.paths.map((p) => (
            <linearGradient key={p.id} id={`fill-${gid}-${p.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </linearGradient>
          ))}
          <filter id={`glow-${gid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* grid */}
        {gridYs.map((g) => (
          <g key={g.y}>
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
          model.paths.map((p) => {
            if (!p.d) return null;
            const area = `${p.d} L${width - pad.r} ${height - pad.b} L${pad.l} ${height - pad.b} Z`;
            const pts = p.series;
            const liveTail =
              live && pts.length >= 2
                ? buildPath(pts.slice(-2), width, height, pad, model.min, model.max, model.t0, model.t1)
                : "";
            const body =
              live && pts.length >= 2
                ? buildPath(pts.slice(0, -1), width, height, pad, model.min, model.max, model.t0, model.t1)
                : p.d;
            return (
              <g key={p.id}>
                <path d={area} fill={`url(#fill-${gid}-${p.id})`} opacity={0.9} />
                <path
                  d={body || p.d}
                  fill="none"
                  stroke={p.color}
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={`url(#glow-${gid})`}
                  opacity={0.9}
                />
                {liveTail ? (
                  <path
                    className="dsc-live-pulse"
                    d={liveTail}
                    fill="none"
                    stroke={p.color}
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter={`url(#glow-${gid})`}
                    style={{ animation: "dsc-line-pulse 2.2s ease-in-out infinite" }}
                  />
                ) : null}
              </g>
            );
          })
        )}
      </svg>

      <div className="dsc-chart-legend">
        {named
          .filter((s) => s.label)
          .map((s, i) => (
            <span key={s.id} className="dsc-chart-legend-item">
              <i style={{ background: s.color || palette[i % palette.length] }} />
              {s.label}
            </span>
          ))}
        {lastPrimary != null ? (
          <span className="dsc-chart-last">
            {lastPrimary.toFixed(1)}
            {unit ? ` ${unit}` : ""}
          </span>
        ) : null}
      </div>

      <style>{`
        @keyframes dsc-line-pulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsc-live-pulse { animation: none !important; }
        }
      `}</style>
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

export function ArcGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "",
}: {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
}) {
  const eased = useEased(Number.isFinite(value) ? value : min);
  const clamped = Math.min(max, Math.max(min, Number.isFinite(eased) ? eased : min));
  const pct = (clamped - min) / Math.max(max - min, 1e-6);
  const r = 46;
  const c = 2 * Math.PI * r * 0.75;
  const dash = c * pct;

  return (
    <div className="dsc-gauge">
      <svg viewBox="0 0 120 90" width="140" height="105" aria-label={label}>
        <defs>
          <filter id="dsc-gauge-glow" x="-40%" y="-40%" width="180%" height="180%">
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
          stroke="var(--dsc-gray-3)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M18 72 A46 46 0 1 1 102 72"
          fill="none"
          stroke="var(--dsc-neon)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          filter="url(#dsc-gauge-glow)"
          style={{ transition: "stroke-dasharray 220ms ease" }}
        />
        <text
          x="60"
          y="58"
          textAnchor="middle"
          fill="var(--dsc-white)"
          fontSize="20"
          fontWeight="700"
          fontFamily="var(--dsc-mono)"
        >
          {Number.isFinite(value) ? value.toFixed(value >= 100 ? 0 : 1) : "—"}
        </text>
        <text x="60" y="74" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          {unit}
        </text>
      </svg>
      <div className="dsc-gauge-label">{label}</div>
    </div>
  );
}
