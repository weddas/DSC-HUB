import { useEffect, useRef, useState } from "react";
import { useHass } from "../hooks/useHass";
import type { SeriesPoint } from "../viz/charts";

/** Rolling sample of an entity numeric state for live charts. */
export function useEntitySeries(entityId: string, maxPoints = 48): SeriesPoint[] {
  const { num, available, tick } = useHass();
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!available(entityId)) return;
    const v = num(entityId);
    if (!Number.isFinite(v)) return;
    if (last.current === v && series.length > 0) return;
    last.current = v;
    setSeries((prev) => {
      const next = [...prev, { t: Date.now(), v }];
      return next.slice(-maxPoints);
    });
    // tick drives resampling while value may be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, tick, available, num, maxPoints]);

  return series;
}
