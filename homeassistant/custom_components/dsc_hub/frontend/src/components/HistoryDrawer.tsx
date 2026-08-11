import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours, type ChartHours, CHART_HOUR_OPTIONS } from "../hooks/useChartHours";
import { SlideDrawer } from "./chrome";
import { MultiLineChart } from "../viz/charts";
import { StatusChip } from "./ui";

export function TimespanControl({
  hours,
  setHours,
}: {
  hours: ChartHours;
  setHours: (h: ChartHours) => void;
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
  const thin = !entityId || series.series.length < 2;

  return (
    <SlideDrawer
      open={open && !!entityId}
      onClose={onClose}
      title={label ? `History · ${label}` : "History"}
    >
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <TimespanControl hours={hours} setHours={setHours} />
        {thin ? <StatusChip label="Thin recorder" tone="warn" /> : null}
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
          ]}
        />
      ) : null}
      <p className="dsc-muted" style={{ marginTop: 10, fontSize: 12 }}>
        {entityId}
      </p>
    </SlideDrawer>
  );
}
