import { useMemo } from "react";

import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../HistoryDrawer";
import { Card } from "../ui";
import { useEntityBus } from "../../hooks/useEntityBus";
import { useFleet } from "../../hooks/useFleet";
import { useChartHours } from "../../hooks/useChartHours";
import {
  trendsWindowAround,
  trendsWindowForAnchors,
  useTrendsSeries,
  TRENDS_HALF_WINDOW_H,
} from "../../hooks/useTrendsSeries";
import { trendChartGroupsForScope, type TrendChartGroup } from "../../lib/logsTrendEntities";
import type { JournalScope } from "../../types/journal";
import { MultiLineChart, type ChartTimeMarker } from "../../viz/charts";
import { fmtJournalWhen } from "./journalFormat";

export type LogsTrendsPanelProps = {
  scope: JournalScope;
  /** Single anchor (entry detail “Chart this moment”) — seconds since epoch */
  anchorSec?: number | null;
  /** Compare mode — two vertical markers; window spans both ±6h */
  compareAnchorsSec?: [number, number] | null;
  compact?: boolean;
};

function TrendGroupCard({
  group,
  hours,
  maxPoints,
  window,
  timeMarkers,
  chartHours,
  compact,
}: {
  group: TrendChartGroup;
  hours: number;
  maxPoints: number;
  window: ReturnType<typeof trendsWindowAround> | null;
  timeMarkers: ChartTimeMarker[];
  chartHours: number;
  compact: boolean;
}) {
  const s0 = useTrendsSeries(group.series[0]?.entityId ?? "", { hours, maxPoints, window });
  const s1 = useTrendsSeries(group.series[1]?.entityId ?? "", { hours, maxPoints, window });
  const s2 = useTrendsSeries(group.series[2]?.entityId ?? "", { hours, maxPoints, window });
  const s3 = useTrendsSeries(group.series[3]?.entityId ?? "", { hours, maxPoints, window });
  const hookSlots = [s0, s1, s2, s3];

  const chartSeries = group.series
    .map((def, i) => {
      const hook = hookSlots[i];
      if (!def.entityId || !hook?.series.length) return null;
      return {
        id: def.id,
        label: def.label,
        series: hook.series,
        color: def.color,
        axis: def.axis,
        unit: def.unit,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    label: string;
    series: { t: number; v: number }[];
    color?: string;
    axis?: "left" | "right";
    unit?: string;
  }>;

  const lastSyncAt = Math.max(...hookSlots.map((h) => h.lastSyncAt ?? 0)) || undefined;
  const live = window ? false : hookSlots.some((h) => h.live);

  return (
    <Card className="dsc-glass" title={group.title} icon={group.icon as never}>
      {group.honesty ? (
        <p className="dsc-honesty" style={{ marginTop: 0 }}>
          {group.honesty}
        </p>
      ) : null}
      {!chartSeries.length ? (
        <p className="dsc-muted" style={{ margin: 0, fontSize: 13 }}>
          No recorder data for this window.
        </p>
      ) : (
        <MultiLineChart
          live={!window && live}
          unit={group.unit ?? ""}
          lastSyncAt={lastSyncAt}
          chartHours={chartHours}
          series={chartSeries}
          timeMarkers={timeMarkers}
          xDomain={window ?? undefined}
          height={compact ? 140 : 180}
        />
      )}
    </Card>
  );
}

export function LogsTrendsPanel({
  scope,
  anchorSec,
  compareAnchorsSec,
  compact = false,
}: LogsTrendsPanelProps) {
  const { state } = useEntityBus();
  const fleet = useFleet();
  const { hours, setHours, maxPoints } = useChartHours(6);

  const groups = useMemo(
    () => trendChartGroupsForScope(scope, state, fleet),
    [scope, state, fleet],
  );

  const window = useMemo(() => {
    if (compareAnchorsSec) {
      return trendsWindowForAnchors(compareAnchorsSec, TRENDS_HALF_WINDOW_H);
    }
    if (anchorSec != null && Number.isFinite(anchorSec) && anchorSec > 0) {
      return trendsWindowAround(anchorSec, TRENDS_HALF_WINDOW_H);
    }
    return null;
  }, [anchorSec, compareAnchorsSec]);

  const timeMarkers = useMemo((): ChartTimeMarker[] => {
    if (compareAnchorsSec) {
      const [a, b] = compareAnchorsSec;
      return [
        { t: a * 1000, label: "Entry A", color: "var(--dsc-teal)" },
        { t: b * 1000, label: "Entry B", color: "var(--dsc-amber)" },
      ];
    }
    if (anchorSec != null && Number.isFinite(anchorSec) && anchorSec > 0) {
      return [{ t: anchorSec * 1000, label: "Entry", color: "var(--dsc-teal)" }];
    }
    return [];
  }, [anchorSec, compareAnchorsSec]);

  const chartHours = window ? (window.max - window.min) / (3600 * 1000) : hours;
  const anchored = window != null;

  if (!groups.length) {
    return (
      <Card className="dsc-glass" title="Trends">
        <p className="dsc-muted" style={{ margin: 0, fontSize: 13 }}>
          {scope.kind === "core"
            ? "Core scope has facility rollup only — no sensor trends to chart."
            : scope.kind === "grow_log"
              ? "Grow log is operational messages only — switch scope for sensor history."
              : "No chart entities for this scope (assign a probe or enable in-service pots)."}
        </p>
      </Card>
    );
  }

  return (
    <div className={`dsc-logs-trends${compact ? " dsc-logs-trends--compact" : ""}`}>
      {anchored ? (
        <p className="dsc-honesty" style={{ margin: "0 0 10px" }}>
          {compareAnchorsSec
            ? `±${TRENDS_HALF_WINDOW_H}h window spanning both entries — markers at ${fmtJournalWhen(
                compareAnchorsSec[0],
              )} and ${fmtJournalWhen(compareAnchorsSec[1])}.`
            : `±${TRENDS_HALF_WINDOW_H}h around ${fmtJournalWhen(anchorSec!)} — historical recorder only.`}
        </p>
      ) : (
        <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
          <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
        </div>
      )}

      <div className="dsc-grid">
        {groups.map((group) => (
          <div key={group.id} className="dsc-col-12">
            <TrendGroupCard
              group={group}
              hours={hours}
              maxPoints={maxPoints}
              window={window}
              timeMarkers={timeMarkers}
              chartHours={chartHours}
              compact={compact}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
