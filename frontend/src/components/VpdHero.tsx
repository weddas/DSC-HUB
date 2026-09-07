import { useHistory } from "../hooks/useHistory";
import { useFreshFlag } from "../hooks/useFreshFlag";
import type { ZoneModel } from "../hooks/useZones";
import { fmtFractionOfHours, inBandFraction } from "../lib/derived/climate";
import { toneCssColor } from "../lib/zoneTone";
import { fmtReading, heldLabel, ReadingTip } from "./Triad";
import { Tooltip, TipRow } from "./Tooltip";
import { Icon } from "./ui";

const TRACK = { min: 0.4, max: 1.8 };

function pct(v: number): number {
  return Math.min(100, Math.max(0, ((v - TRACK.min) / (TRACK.max - TRACK.min)) * 100));
}

/**
 * VPD · MASTER (frame 1d): the one number, its band on a track, in-band time over 24 h,
 * then temp / RH as its inputs and the device-dependent slots that stay honest.
 */
export function VpdHero({
  zone,
  onOpen,
}: {
  zone: ZoneModel;
  onOpen?: (entityId: string, label: string, unit?: string) => void;
}) {
  const { points } = useHistory(zone.vpd.entityId, 24, 144);
  const inBand = inBandFraction(points, zone.vpd.band);
  const band = zone.vpd.band;
  const held = heldLabel(zone.vpd);
  const fresh = useFreshFlag(zone.vpd.available ? zone.vpd.value : null);
  const color = toneCssColor(zone.vpd.tone);
  const tempSet = zone.temp.band ? `set ${((zone.temp.band.min + zone.temp.band.max) / 2).toFixed(1)}` : "no rail";
  const rhSet = zone.rh.band ? `set ${Math.round(zone.rh.band.min)}–${Math.round(zone.rh.band.max)}` : "no rail";
  const leafText = zone.leafVpd != null ? ` · leaf ≈ ${zone.leafVpd.toFixed(2)}` : "";

  return (
    <div className="dsc-vpd-hero">
      <Tooltip
        content={
          <>
            <ReadingTip label={`${zone.label} VPD`} reading={zone.vpd} />
            {zone.leafVpd != null ? <TipRow k="leaf VPD" v={`${zone.leafVpd.toFixed(2)} kPa · leaf = air − 1.5 °C`} tone="muted" /> : null}
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
        {inBand != null ? (
          <>
            {" · "}
            <span className={inBand >= 0.8 ? "is-ok" : inBand >= 0.5 ? "is-warn" : "is-bad"}>
              in band {fmtFractionOfHours(inBand, 24)} of 24 h
            </span>
          </>
        ) : null}
        {zone.vpd.derived ? ` · ${zone.vpd.derived}` : leafText ? <> · <Icon name="leaf-temperature" size={11} />{leafText.replace(/^ · /, " ")}</> : null}
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
        <button type="button" className="dsc-metric" onClick={() => onOpen?.(zone.temp.entityId, `${zone.label} T`, "°C")}>
          <span className="dsc-metric-label">Temp</span>
          <span className="dsc-metric-value" style={{ color: toneCssColor(zone.temp.tone) }}>
            {fmtReading(zone.temp)}
            <span className="dsc-metric-unit"> °C</span>
          </span>
          <span className="dsc-metric-sub">{tempSet}{zone.leafVpd != null && zone.temp.available ? " · leaf −1.5" : ""}</span>
        </button>
        <button type="button" className="dsc-metric" onClick={() => onOpen?.(zone.rh.entityId, `${zone.label} RH`, "%")}>
          <span className="dsc-metric-label">RH</span>
          <span className="dsc-metric-value" style={{ color: toneCssColor(zone.rh.tone) }}>
            {fmtReading(zone.rh)}
            <span className="dsc-metric-unit"> %</span>
          </span>
          <span className="dsc-metric-sub">{rhSet}</span>
        </button>
        <div className="dsc-metric is-slot" role="note" aria-label="CO₂ not measured — possible with an NDIR CO₂ sensor" title="No CO₂ sensor is bound to this zone">
          <span className="dsc-metric-label">CO₂</span>
          <span className="dsc-metric-value">—</span>
          <span className="dsc-metric-sub">possible with an NDIR CO₂ sensor</span>
        </div>
        {zone.lamp?.ppfd != null ? (
          <div className="dsc-metric" title="PPFD from the SF1000 calibration curve at the current dimmer level">
            <span className="dsc-metric-label">PPFD</span>
            <span className="dsc-metric-value" style={{ color: "var(--dsc-lamp)" }}>
              {Math.round(zone.lamp.ppfd)}
              <span className="dsc-metric-unit"> µmol</span>
            </span>
            <span className="dsc-metric-sub">from the calibration curve{zone.lamp.dli != null ? ` · DLI ${zone.lamp.dli.toFixed(1)}` : ""}</span>
          </div>
        ) : (
          <div className="dsc-metric is-slot" role="note" aria-label="PPFD not measured — possible with a PAR sensor at the canopy" title="No PAR sensor at the canopy">
            <span className="dsc-metric-label">PPFD</span>
            <span className="dsc-metric-value">—</span>
            <span className="dsc-metric-sub">possible with a PAR sensor at the canopy</span>
          </div>
        )}
      </div>
    </div>
  );
}
