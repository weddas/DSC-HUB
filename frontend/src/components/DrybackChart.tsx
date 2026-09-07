import { useMemo, useState } from "react";
import { Icon } from "./ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { darkIntervals } from "../lib/lightsOffShades";
import { readTentPhotoperiodInput } from "../lib/lightSchedule";
import { probeGotEntity, type TentId } from "../lib/probeModel";
import { MultiLineChart, type ChartShade, type NamedSeries } from "../viz/charts";

const RANGES: { hours: 24 | 48 | 168; label: string }[] = [
  { hours: 24, label: "24 h" },
  { hours: 48, label: "48 h" },
  { hours: 168, label: "7 d" },
];

/**
 * Dry-back sawtooth (frame 1e): the probe's moisture with its EC on the right axis and the
 * tent's lights-off windows shaded. Shot ticks are not drawn — the kit has no pump bound, so
 * there are no shots to draw; the sawtooth is whatever the plant and the operator did.
 */
export function DrybackChart({
  probe,
  tent,
  moistureBand,
  height = 180,
}: {
  probe: number;
  tent: TentId;
  moistureBand?: { min: number; max: number };
  height?: number;
}) {
  const { state, num } = useEntityBus();
  const [hours, setHours] = useState<24 | 48 | 168>(48);
  const maxPoints = hours >= 168 ? 336 : hours >= 48 ? 192 : 144;
  const moistId = probeGotEntity(probe, "moisture", state);
  const ecId = probeGotEntity(probe, "ec", state);
  const moist = useEntitySeries(moistId, { hours, maxPoints });
  const ec = useEntitySeries(ecId, { hours, maxPoints });
  const now = Date.now();
  const fromMs = now - hours * 3600 * 1000;

  const shades = useMemo<ChartShade[]>(() => {
    if (tent !== "main" && tent !== "clone") return [];
    const input = readTentPhotoperiodInput(tent, state, num);
    return darkIntervals(input, fromMs, now).map((d) => ({ ...d, color: "var(--dsc-black)", opacity: 0.45 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tent, hours, Math.floor(now / 60000)]);

  const series: NamedSeries[] = [
    { id: "m", label: "moisture", series: moist.series, color: "var(--dsc-teal)", unit: "%", axis: "left", band: moistureBand },
  ];
  if (ec.series.length > 1) {
    series.push({ id: "ec", label: "EC", series: ec.series, color: "var(--dsc-purple)", unit: "", axis: "right", ghost: true });
  }
  const ecMax = ec.series.length ? Math.max(500, ...ec.series.map((p) => p.v)) * 1.15 : 3000;

  return (
    <div className="dsc-zvc">
      <div className="dsc-zvc-controls">
        <span className="dsc-legend"><Icon name="dry-back" size={11} className="dsc-legend-icon" /> Substrate · moisture (sawtooth) · EC (right axis)</span>
        <div className="dsc-zvc-ranges" role="group" aria-label="Chart range">
          {RANGES.map((r) => (
            <button
              key={r.hours}
              type="button"
              className={`dsc-seg${hours === r.hours ? " is-active" : ""}`}
              aria-pressed={hours === r.hours}
              onClick={() => setHours(r.hours)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <MultiLineChart
        unit="%"
        height={height}
        chartHours={hours}
        lastSyncAt={Math.max(moist.lastSyncAt ?? 0, ec.lastSyncAt ?? 0) || undefined}
        yDomain={{ left: { min: 0, max: 100 }, right: { min: 0, max: ecMax } }}
        series={series}
        targets={moistureBand ? [{ axis: "left", min: moistureBand.min, max: moistureBand.max, color: "var(--dsc-teal)" }] : []}
        shades={shades}
        xDomain={{ min: fromMs, max: now }}
        emptyLabel="no moisture history yet"
      />
      <div className="dsc-zvc-key">
        <span><i className="dsc-key-band" /> {moistureBand ? `want ${Math.round(moistureBand.min)}–${Math.round(moistureBand.max)} %` : "no moisture band"}</span>
        <span><i className="dsc-key-leaf" style={{ borderTopColor: "var(--dsc-purple)" }} /> EC, dashed, right axis</span>
        {tent === "main" || tent === "clone" ? <span><i className="dsc-key-dark" /> lights off</span> : null}
        <span>no shot ticks — no pump is bound</span>
      </div>
    </div>
  );
}
