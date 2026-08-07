import { useId, useMemo } from "react";

export interface SeriesPoint {
  t: number;
  v: number;
}

function niceMax(values: number[]): number {
  const m = Math.max(...values, 1);
  const pow = 10 ** Math.floor(Math.log10(m));
  return Math.ceil(m / pow) * pow;
}

export function LiveLineChart({
  series,
  height = 160,
  unit = "",
  live = true,
  color = "var(--dsc-neon)",
}: {
  series: SeriesPoint[];
  height?: number;
  unit?: string;
  live?: boolean;
  color?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const width = 640;
  const pad = { l: 8, r: 8, t: 12, b: 18 };

  const path = useMemo(() => {
    if (!series.length) return "";
    const vals = series.map((p) => p.v);
    const max = niceMax(vals);
    const min = Math.min(0, ...vals);
    const span = Math.max(max - min, 1e-6);
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;
    return series
      .map((p, i) => {
        const x = pad.l + (i / Math.max(series.length - 1, 1)) * innerW;
        const y = pad.t + (1 - (p.v - min) / span) * innerH;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [series, height]);

  const area = path
    ? `${path} L${width - pad.r} ${height - pad.b} L${pad.l} ${height - pad.b} Z`
    : "";

  const last = series.length ? series[series.length - 1].v : null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Live chart"
      >
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${gid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {area ? <path d={area} fill={`url(#fill-${gid})`} /> : null}
        {path ? (
          <path
            className={live ? "dsc-live-pulse" : undefined}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={`url(#glow-${gid})`}
            style={
              live
                ? {
                    animation: "dsc-line-pulse 2.4s ease-in-out infinite",
                  }
                : undefined
            }
          />
        ) : (
          <text x={width / 2} y={height / 2} textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="12">
            Waiting for data
          </text>
        )}
      </svg>
      {last != null ? (
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 4,
            fontVariantNumeric: "tabular-nums",
            color: "var(--dsc-neon)",
            fontSize: 13,
            fontWeight: 650,
          }}
        >
          {last.toFixed(1)}
          {unit ? ` ${unit}` : ""}
        </div>
      ) : null}
      <style>{`
        @keyframes dsc-line-pulse {
          0%, 100% { opacity: 0.82; filter: url(#glow-${gid}) brightness(1); }
          50% { opacity: 1; filter: url(#glow-${gid}) brightness(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsc-live-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
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
  const clamped = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  const pct = (clamped - min) / Math.max(max - min, 1e-6);
  const r = 46;
  const c = 2 * Math.PI * r * 0.75;
  const dash = c * pct;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 120 90" width="140" height="105" aria-label={label}>
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
          filter="drop-shadow(0 0 6px rgba(57,255,20,0.55))"
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
      <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dsc-gray-5)" }}>
        {label}
      </div>
    </div>
  );
}
