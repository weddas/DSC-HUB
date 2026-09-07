import type { CSSProperties } from "react";
import { useFreshFlag } from "../hooks/useFreshFlag";
import { usePreferences } from "../hooks/usePreference";
import { fmtDurationMs } from "../lib/formatDuration";
import { toneCssColor, type ZoneTone } from "../lib/zoneTone";
import type { ZoneReading } from "../hooks/useZones";
import { useFleetLastUpdated } from "../hooks/useFleet";
import { useHistory } from "../hooks/useHistory";
import { Tooltip, TipRow } from "./Tooltip";
import { Icon } from "./ui";
import type { IconName } from "../iconSvg";

/** 270° arc, r=18 in a 46px box — the reveal-frame gauge. Plain SVG, no chart library. */
export function MiniArc({
  fraction,
  tone,
  size = 46,
  className = "",
}: {
  fraction: number | null;
  tone: ZoneTone;
  size?: number;
  className?: string;
}) {
  const r = 18;
  const circ = 2 * Math.PI * r; // ≈113.1
  const arc = circ * 0.75; // 270°
  const f = fraction == null || !Number.isFinite(fraction) ? 0 : Math.min(1, Math.max(0, fraction));
  const fill = tone === "muted" ? 0 : arc * f;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 46"
      className={`dsc-arc dsc-arc--${tone}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <circle
        cx="23"
        cy="23"
        r={r}
        fill="none"
        stroke="var(--dsc-gray-2)"
        strokeWidth="4"
        strokeDasharray={`${arc} ${circ - arc}`}
        transform="rotate(135 23 23)"
      />
      {fill > 0 ? (
        <circle
          cx="23"
          cy="23"
          r={r}
          fill="none"
          stroke={toneCssColor(tone)}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ - fill}`}
          transform="rotate(135 23 23)"
          className="dsc-arc-fill"
          style={{ strokeDasharray: `${fill} ${circ - fill}` } as CSSProperties}
        />
      ) : null}
    </svg>
  );
}

const SCALE: Record<string, { min: number; max: number }> = {
  "°C": { min: 10, max: 40 },
  "%": { min: 0, max: 100 },
  kPa: { min: 0, max: 2.5 },
};

function digitsFor(unit: string): number {
  return unit === "kPa" ? 2 : unit === "%" ? 1 : 1;
}

export function fmtReading(r: ZoneReading): string {
  return r.available ? r.value.toFixed(digitsFor(r.unit)) : "—";
}

export function heldLabel(r: ZoneReading): string | null {
  if (!r.stale || !r.available) return null;
  const age = r.heldAt != null ? Date.now() - r.heldAt : null;
  return age != null && age > 0 ? `HELD ${fmtDurationMs(age)}` : "HELD";
}

const DEADBAND: Record<string, number> = { "°C": 0.1, "%": 0.5, kPa: 0.02 };

function hhmm(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function ageLabel(ms: number, now: number): string {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 90) return `${s} s ago`;
  const m = Math.round(s / 60);
  if (m < 90) return `${m} min ago`;
  return `${Math.round(m / 60)} h ago`;
}

/**
 * Tooltip body for one reading: exact value, when the fleet was last polled, the last
 * different value from history ("was 64 % at 02:51"), the want band, and provenance
 * (measured entity, or the formula for a derived value). Mounted only while the
 * tooltip is open, so the history fetch happens on hover, not on every render.
 */
export function ReadingTip({ label, reading }: { label: string; reading: ZoneReading }) {
  const polledAt = useFleetLastUpdated();
  const { points } = useHistory(reading.available ? reading.entityId : "", 6, 72);
  const now = Date.now();
  const dead = DEADBAND[reading.unit] ?? 0;
  let was: { t: number; v: number } | null = null;
  if (reading.available) {
    for (let i = points.length - 1; i >= 0; i--) {
      if (Math.abs(points[i].v - reading.value) > dead) {
        was = points[i];
        break;
      }
    }
  }
  const exact = reading.available ? `${reading.value.toFixed(reading.unit === "kPa" ? 3 : 2)} ${reading.unit}` : "no data";
  return (
    <>
      <TipRow k={label} v={exact} tone={reading.tone === "critical" ? "bad" : reading.tone === "warn" || reading.tone === "stale" ? "warn" : undefined} />
      {polledAt ? <TipRow k="polled" v={`${hhmm(polledAt)} · ${ageLabel(polledAt, now)}`} /> : null}
      {reading.stale && reading.heldAt ? <TipRow k="held since" v={`${hhmm(reading.heldAt)} · ${ageLabel(reading.heldAt, now)}`} tone="warn" /> : null}
      {was ? <TipRow k="was" v={`${was.v.toFixed(reading.unit === "kPa" ? 2 : 1)} ${reading.unit} at ${hhmm(was.t)}`} /> : null}
      {reading.band ? <TipRow k="want" v={`${reading.band.min}–${reading.band.max} ${reading.unit}`} /> : null}
      <TipRow k={reading.derived ? "derived" : "measured"} v={reading.derived ?? reading.entityId} tone="muted" />
    </>
  );
}

/** One cell: arc · label · value+unit · optional sub-line. */
export function TriadCell({
  label,
  reading,
  sub,
  onClick,
  title,
  icon,
}: {
  label: string;
  reading: ZoneReading;
  sub?: string | null;
  onClick?: () => void;
  title?: string;
  icon?: IconName;
}) {
  const scale = SCALE[reading.unit] ?? { min: 0, max: 100 };
  const fraction = reading.available ? (reading.value - scale.min) / (scale.max - scale.min) : null;
  const held = heldLabel(reading);
  const fresh = useFreshFlag(reading.available ? reading.value : null);
  const cls = `dsc-triad-cell dsc-triad-cell--${reading.tone}${onClick ? " is-clickable" : ""}`;
  const body = (
    <>
      <MiniArc fraction={fraction} tone={reading.tone} />
      <div className="dsc-triad-text">
        <div className="dsc-triad-label">
          {icon ? <Icon name={icon} size={11} className="dsc-triad-icon" /> : null}
          {label}
        </div>
        <div className={`dsc-triad-value${fresh ? " is-fresh" : ""}`} style={{ color: toneCssColor(reading.tone) }}>
          {fmtReading(reading)}
          <span className="dsc-triad-unit"> {reading.unit}</span>
          {held ? <span className="dsc-tag dsc-tag--warn dsc-triad-held"><Icon name="pause-hold" size={10} />{held}</span> : null}
        </div>
        {sub ? <div className="dsc-triad-sub">{sub}</div> : null}
      </div>
    </>
  );
  const tip = <ReadingTip label={label} reading={reading} />;
  if (onClick) {
    return (
      <Tooltip content={tip}>
        <button
          type="button"
          className={cls}
          onClick={onClick}
          aria-label={`${label} ${fmtReading(reading)} ${reading.unit}${held ? `, ${held.toLowerCase()}` : ""} — ${title ?? "open chart"}`}
        >
          {body}
        </button>
      </Tooltip>
    );
  }
  return (
    <Tooltip content={tip}>
      <div className={cls} tabIndex={0} aria-label={`${label} ${fmtReading(reading)} ${reading.unit}`}>
        {body}
      </div>
    </Tooltip>
  );
}

/**
 * T, RH and VPD — only together, one scale. `leafVpd` (derived) rides under the VPD
 * value with its provenance; band text rides under T and RH.
 */
export function Triad({
  temp,
  rh,
  vpd,
  leafVpd,
  onOpen,
}: {
  temp: ZoneReading;
  rh: ZoneReading;
  vpd: ZoneReading;
  leafVpd?: number | null;
  onOpen?: (kind: "temp" | "rh" | "vpd") => void;
}) {
  const { provenanceMode, showEntityIds } = usePreferences();
  const bandText = (r: ZoneReading) =>
    r.band ? `want ${r.band.min.toFixed(digitsFor(r.unit) === 2 ? 1 : 0)}–${r.band.max.toFixed(digitsFor(r.unit) === 2 ? 1 : 0)}` : null;
  // Developer switches (System › Developer): provenance mode puts the formula / measured
  // entity on the cell itself; show-entity-ids appends the id the cell reads.
  const trace = (r: ZoneReading, base: string | null) =>
    [base, provenanceMode && r.derived ? r.derived : null, showEntityIds ? r.entityId : provenanceMode && !r.derived ? `measured ${r.entityId}` : null]
      .filter(Boolean)
      .join(" · ") || null;
  const vpdSub =
    vpd.derived
      ? vpd.derived
      : leafVpd != null && Number.isFinite(leafVpd)
        ? `leaf ≈ ${leafVpd.toFixed(2)} · ${bandText(vpd) ?? "no rail"}`
        : bandText(vpd);
  return (
    <div className="dsc-triad">
      <TriadCell
        label="Temperature"
        icon="temp-gauge"
        reading={temp}
        sub={trace(temp, bandText(temp))}
        onClick={onOpen ? () => onOpen("temp") : undefined}
        title="Open the temperature chart"
      />
      <TriadCell
        label="Relative humidity"
        icon="humidity-gauge"
        reading={rh}
        sub={trace(rh, bandText(rh))}
        onClick={onOpen ? () => onOpen("rh") : undefined}
        title="Open the humidity chart"
      />
      <TriadCell
        label="Vapour pressure deficit"
        icon="vpd-gauge"
        reading={vpd}
        sub={showEntityIds ? [vpdSub, vpd.entityId].filter(Boolean).join(" · ") : vpdSub}
        onClick={onOpen ? () => onOpen("vpd") : undefined}
        title={vpd.derived ? `Derived ${vpd.derived}` : "Open the VPD chart"}
      />
    </div>
  );
}
