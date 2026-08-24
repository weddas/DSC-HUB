import { useMemo } from "react";
import { useEntityBus } from "../hooks/useEntityBus";
import { useHistory } from "../hooks/useHistory";
import { stepHoldSeries } from "../lib/seriesHold";

/**
 * 24h on/off strip from binary history. A 40-minute run is a bar, not a stub.
 */
export function DutyStrip({
  entityId,
  hours = 24,
  onClick,
  label = "24h on/off",
}: {
  entityId: string;
  hours?: number;
  onClick?: () => void;
  label?: string;
}) {
  const { state, entity } = useEntityBus();
  const { points, loading } = useHistory(entityId, hours, 720);
  const live = state(entityId, "off") === "on" ? 1 : 0;
  const now = Date.now();
  const t0 = now - hours * 3600 * 1000;
  const held = useMemo(() => {
    const seed = points.filter((p) => Number.isFinite(p.v));
    if (state(entityId, "") === "on" || state(entityId, "") === "off") {
      seed.push({ t: now, v: live });
    }
    return stepHoldSeries(seed, now);
  }, [points, now, live, state, entityId]);

  const windows = useMemo(() => {
    const out: { start: number; end: number }[] = [];
    let start: number | null = null;
    for (let i = 0; i < held.length; i++) {
      const p = held[i];
      const on = p.v >= 0.5;
      if (on && start == null) start = Math.max(p.t, t0);
      if (!on && start != null) {
        out.push({ start, end: p.t });
        start = null;
      }
    }
    if (start != null) out.push({ start, end: now });
    return out.filter((w) => w.end > t0 && w.end > w.start);
  }, [held, now, t0]);

  const onMs = windows.reduce((s, w) => s + (w.end - w.start), 0);
  const lastStart = windows.length ? windows[windows.length - 1].start : null;
  const lastChanged = entity(entityId)?.last_changed;
  const lastRun = lastStart
    ? new Date(lastStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : lastChanged
      ? new Date(lastChanged).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—";

  const body = (
    <div className="dsc-duty-strip">
      <div className="dsc-duty-meta">
        <span>{label}</span>
        <span className="dsc-muted">
          {windows.length} cycle{windows.length === 1 ? "" : "s"} · last {lastRun} ·{" "}
          {loading ? "…" : `${(onMs / 3600000).toFixed(1)}h on`}
        </span>
      </div>
      <svg viewBox={`0 0 ${hours} 18`} className="dsc-duty-svg" preserveAspectRatio="none" aria-hidden>
        <rect x="0" y="5" width={hours} height="8" rx="2" fill="var(--dsc-gray-3)" />
        {windows.map((w) => {
          const x = Math.max(0, (w.start - t0) / 3600000);
          const width = Math.max(0.04, (w.end - w.start) / 3600000);
          return <rect key={w.start} x={x} y="5" width={width} height="8" rx="1.5" fill="var(--dsc-teal)" />;
        })}
      </svg>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" className="dsc-duty-hit" onClick={onClick} title={`History · ${label}`}>
        {body}
      </button>
    );
  }
  return body;
}
