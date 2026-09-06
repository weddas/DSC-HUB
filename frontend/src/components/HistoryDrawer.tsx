import { useMemo } from "react";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours, type ChartHours, CHART_HOUR_OPTIONS } from "../hooks/useChartHours";
import { SlideDrawer } from "./chrome";
import { MultiLineChart } from "../viz/charts";
import { StatusChip } from "./ui";

/** Presets: 12h ≈ one photoperiod cycle, 18h ≈ veg/clone window. Not invented sensor data. */
export const CYCLE_TIMESPAN_EXTRAS: { label: string; hours: number }[] = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 },
];

export function TimespanControl({
  hours,
  setHours,
  extras,
}: {
  hours: ChartHours;
  setHours: (h: ChartHours) => void;
  extras?: { label: string; hours: number }[];
}) {
  return (
    <div className="dsc-timespan" role="group" aria-label="Chart timespan">
      {CHART_HOUR_OPTIONS.map((h) => (
        <button
          key={h}
          type="button"
          className={`dsc-chip${hours === h ? " dsc-chip--ok" : ""}`}
          onClick={() => setHours(h)}
        >
          {h}h
        </button>
      ))}
      {(extras || []).map((ex) => (
        <button
          key={ex.label}
          type="button"
          className={`dsc-chip${hours === ex.hours ? " dsc-chip--ok" : ""}`}
          onClick={() => setHours(ex.hours)}
        >
          {ex.label}
        </button>
      ))}
    </div>
  );
}

export function HistoryDrawer({
  open,
  onClose,
  entityId,
  label,
  unit = "",
  color = "var(--dsc-blue)",
}: {
  open: boolean;
  onClose: () => void;
  entityId: string | null;
  label: string;
  unit?: string;
  color?: string;
}) {
  const { hours, setHours, maxPoints } = useChartHours(6);
  const series = useEntitySeries(entityId || "", { hours, maxPoints });
  const ghostSpan = hours <= 18 ? hours * 2 : Math.min(hours + 24, 48);
  const ghostSrc = useEntitySeries(entityId || "", { hours: ghostSpan, maxPoints });
  const ghost = useMemo(() => {
    const windowMs = hours * 3600 * 1000;
    const cutoff = Date.now() - windowMs;
    return ghostSrc.series
      .filter((p) => p.t < cutoff)
      .map((p) => ({ t: p.t + windowMs, v: p.v }));
  }, [ghostSrc.series, hours]);
  const thin = !entityId || series.series.length < 2;

  return (
    <SlideDrawer
      open={open && !!entityId}
      onClose={onClose}
      title={label ? `History · ${label}` : "History"}
    >
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
        {thin ? <StatusChip label="Thin recorder" tone="warn" /> : null}
        {ghost.length > 1 ? <StatusChip label="Prior window ghost" tone="muted" /> : null}
      </div>
      {entityId ? (
        <MultiLineChart
          live
          unit={unit}
          lastSyncAt={series.lastSyncAt}
          series={[
            {
              id: entityId,
              label,
              series: series.series,
              color,
              unit,
            },
            ...(ghost.length > 1
              ? [
                  {
                    id: `${entityId}-ghost`,
                    label: `${label} prior`,
                    series: ghost,
                    color,
                    unit,
                    ghost: true,
                  },
                ]
              : []),
          ]}
        />
      ) : null}
      <p className="dsc-muted" style={{ marginTop: 10, fontSize: "var(--dsc-fs-sm)" }}>
        {entityId}
      </p>
    </SlideDrawer>
  );
}
