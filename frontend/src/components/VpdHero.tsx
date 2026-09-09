import { useHistory } from "../hooks/useHistory";
import { useFreshFlag } from "../hooks/useFreshFlag";
import type { ZoneModel } from "../hooks/useZones";
import { fmtFractionOfHours, inBandMetric } from "../lib/derived";
import {
  derivedAria,
  derivedNote,
  derivedTitle,
  fmtDerived,
  isResolved,
  type DerivedValue,
} from "../lib/derived/types";
import { toneCssColor } from "../lib/zoneTone";
import { fmtReading, heldLabel, ReadingTip } from "./Triad";
import { Tooltip, TipRow } from "./Tooltip";
import { Icon } from "./ui";
import type { IconName } from "../iconSvg";

const TRACK = { min: 0.4, max: 1.8 };

function pct(v: number): number {
  return Math.min(100, Math.max(0, ((v - TRACK.min) / (TRACK.max - TRACK.min)) * 100));
}

/**
 * One derived tile. Resolved → the number plus the provenance that made it.
 * Unavailable → a dashed slot with the reason and the sensor that would fill it.
 * There is no branch that prints a number without a provenance line beside it.
 */
export function DerivedMetric({ d, icon }: { d: DerivedValue; icon?: IconName }) {
  const ok = isResolved(d);
  return (
    <div
      className={`dsc-metric${ok ? "" : " is-slot"}`}
      role="note"
      title={derivedTitle(d)}
      aria-label={derivedAria(d)}
    >
      <span className="dsc-metric-label">
        {icon ? <Icon name={icon} size={10} /> : null}
        {d.label}
      </span>
      <span className="dsc-metric-value">
        {fmtDerived(d)}
        {ok && d.unit ? <span className="dsc-metric-unit"> {d.unit}</span> : null}
      </span>
      <span className="dsc-metric-sub">{derivedNote(d)}</span>
    </div>
  );
}

/**
 * VPD · MASTER (frame 1d): the one number, its band on a track, in-band time over 24 h,
 * then temp / RH as its inputs and the derived layer under them — every computed value
 * with the inputs that made it, every device-only value as a labelled slot.
 */
export function VpdHero({
  zone,
  onOpen,
}: {
  zone: ZoneModel;
  onOpen?: (entityId: string, label: string, unit?: string) => void;
}) {
  const { points, tracked } = useHistory(zone.vpd.entityId, 24, 144);
  const inBandD = inBandMetric(points, zone.vpd.band, 24, tracked, "VPD in band");
  const inBand = isResolved(inBandD) ? inBandD.value : null;
  const band = zone.vpd.band;
  const held = heldLabel(zone.vpd);
  const fresh = useFreshFlag(zone.vpd.available ? zone.vpd.value : null);
  const color = toneCssColor(zone.vpd.tone);
  const tempSet = zone.temp.band ? `set ${((zone.temp.band.min + zone.temp.band.max) / 2).toFixed(1)}` : "no rail";
  const rhSet = zone.rh.band ? `set ${Math.round(zone.rh.band.min)}–${Math.round(zone.rh.band.max)}` : "no rail";
  const d = zone.derived;
  const leafVpd = d.leafVpd;
  const deficit = d.vpdDeficit;

  return (
    <div className="dsc-vpd-hero">
      <Tooltip
        content={
          <>
            <ReadingTip label={`${zone.label} VPD`} reading={zone.vpd} />
            <TipRow
              k="leaf VPD"
              v={isResolved(leafVpd) ? `${fmtDerived(leafVpd)} kPa · ${derivedNote(leafVpd)}` : derivedNote(leafVpd)}
              tone="muted"
            />
            <TipRow
              k="vs band"
              v={isResolved(deficit) ? `${deficit.value > 0 ? "+" : ""}${fmtDerived(deficit)} kPa · ${deficit.provenance}` : derivedNote(deficit)}
              tone="muted"
            />
            <TipRow
              k="in band"
              v={inBand != null ? `${fmtFractionOfHours(inBand, 24)} of 24 h · ${inBandD.provenance}` : derivedNote(inBandD)}
              tone="muted"
            />
          </>
        }
      >
        <button
          type="button"
          className={`dsc-vpd-hero-value${fresh ? " is-fresh" : ""}`}
          style={{ color }}
          onClick={() => onOpen?.(zone.vpd.entityId, `${zone.label} VPD`, "kPa")}
          aria-label={`${zone.label} VPD ${fmtReading(zone.vpd)} kilopascal${held ? `, ${held.toLowerCase()}` : ""} — open the VPD inspector`}
        >
          {fmtReading(zone.vpd)}
          <span className="dsc-vpd-hero-unit">kPa</span>
          {held ? <span className="dsc-tag dsc-tag--warn dsc-triad-held"><Icon name="pause-hold" size={10} />{held}</span> : null}
        </button>
      </Tooltip>
      <div className="dsc-vpd-hero-sub">
        {band ? `${zone.stageShort ?? "Want"} band ${band.min.toFixed(1)}–${band.max.toFixed(1)}` : "No band — no plant or stage rail"}
        {isResolved(deficit) && deficit.value !== 0 ? (
          <span title={derivedTitle(deficit)}>
            {" · "}
            {deficit.value > 0 ? "+" : ""}
            {fmtDerived(deficit)} kPa vs band
          </span>
        ) : null}
        {inBand != null ? (
          <>
            {" · "}
            <span className={inBand >= 0.8 ? "is-ok" : inBand >= 0.5 ? "is-warn" : "is-bad"} title={derivedTitle(inBandD)}>
              in band {fmtFractionOfHours(inBand, 24)} of 24 h
            </span>
          </>
        ) : (
          <span title={derivedTitle(inBandD)}>
            {" · "}
            {derivedNote(inBandD)}
          </span>
        )}
        {zone.vpd.derived ? ` · ${zone.vpd.derived}` : null}
      </div>
      <div className="dsc-vpd-track" aria-hidden="true">
        {band ? (
          <span className="dsc-vpd-track-band" style={{ left: `${pct(band.min)}%`, width: `${pct(band.max) - pct(band.min)}%` }} />
        ) : null}
        {zone.vpd.available ? (
          <span className="dsc-vpd-track-marker" style={{ left: `${pct(zone.vpd.value)}%`, background: color }} />
        ) : null}
      </div>
      <div className="dsc-vpd-track-axis" aria-hidden="true">
        <span>0.4</span>
        <span>0.8</span>
        <span>1.2</span>
        <span>1.6</span>
      </div>
      <div className="dsc-vpd-inputs">
        {/* Measured inputs first — these are what the derived tiles below are made of. */}
        <button type="button" className="dsc-metric" onClick={() => onOpen?.(zone.temp.entityId, `${zone.label} T`, "°C")}>
          <span className="dsc-metric-label">Temp</span>
          <span className="dsc-metric-value" style={{ color: toneCssColor(zone.temp.tone) }}>
            {fmtReading(zone.temp)}
            <span className="dsc-metric-unit"> °C</span>
          </span>
          <span className="dsc-metric-sub">{tempSet} · measured</span>
        </button>
        <button type="button" className="dsc-metric" onClick={() => onOpen?.(zone.rh.entityId, `${zone.label} RH`, "%")}>
          <span className="dsc-metric-label">RH</span>
          <span className="dsc-metric-value" style={{ color: toneCssColor(zone.rh.tone) }}>
            {fmtReading(zone.rh)}
            <span className="dsc-metric-unit"> %</span>
          </span>
          <span className="dsc-metric-sub">{rhSet} · measured</span>
        </button>
        {/* Derived from the pair above — each says which inputs, and on what assumption. */}
        <DerivedMetric d={leafVpd} icon="leaf-temperature" />
        <DerivedMetric d={d.dewPoint} icon="dew-point" />
        <DerivedMetric d={d.absoluteHumidity} icon="humidity-gauge" />
        <DerivedMetric d={d.condensationMargin} icon="water-drop" />
        <DerivedMetric d={d.ppfd} icon="par-meter" />
        <DerivedMetric d={d.dli} icon="dli" />
        {/* Device-only: no relationship between the kit's sensors yields these. */}
        <DerivedMetric d={d.co2} icon="co2-sensor" />
        <DerivedMetric d={d.leafTemp} icon="leaf-temperature" />
      </div>
    </div>
  );
}
