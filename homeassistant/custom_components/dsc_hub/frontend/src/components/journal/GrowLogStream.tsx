import { useEffect, useState } from "react";
import { Card, StatusChip } from "../ui";
import { get_grow_log, type GrowLogEvent } from "../../lib/fleetApi";
import { filterGrowLog, growLogSeverity, prepareGrowLog, type GrowLogFilter } from "../../lib/growLogFilter";
import { useEntityBus } from "../../hooks/useEntityBus";

/** Operational grow log stream — GET-only v1; separate from observation journals. */
export function GrowLogStream() {
  const { state } = useEntityBus();
  const [events, setEvents] = useState<GrowLogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GrowLogFilter>("all");

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      void get_grow_log(24, 100).then((rows) => {
        if (!cancelled) {
          setEvents(prepareGrowLog(rows));
          setLoading(false);
        }
      });
    };

    load();
    const timer = window.setInterval(load, 45_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [state("select.dsc_hub_grow_stage"), state("switch.dsc_hub_dehumidifier_demand")]);

  const filtered = filterGrowLog(events, filter);

  return (
    <Card className="dsc-glass" title="Grow log" icon="roster">
      <p className="dsc-muted" style={{ fontSize: 12, margin: "0 0 8px" }}>
        Operational stage and duty events — read-only. Amber rows are past notables, not live critical banners.
      </p>
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        {(["all", "alerts", "stage"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            className={`dsc-chip${filter === mode ? " dsc-chip--ok" : ""}`}
            onClick={() => setFilter(mode)}
          >
            {mode === "all" ? "All" : mode === "alerts" ? "Alerts" : "Stage changes"}
          </button>
        ))}
      </div>
      {loading && !events.length ? <p className="dsc-muted">Loading grow log…</p> : null}
      {filtered.length ? (
        <ul className="dsc-grow-log">
          {filtered.map((ev) => (
            <li
              key={ev.id}
              className={growLogSeverity(ev.message) === "alert" ? "dsc-grow-log--alert" : undefined}
            >
              <time className="dsc-muted" dateTime={new Date(ev.ts * 1000).toISOString()}>
                {new Date(ev.ts * 1000).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>{" "}
              {ev.message}
            </li>
          ))}
        </ul>
      ) : !loading ? (
        <p className="dsc-muted">No operational events in the last 24 hours.</p>
      ) : null}
      <p className="dsc-muted" style={{ margin: "10px 0 0", fontSize: 12 }}>
        GET-only v1 — no edit or delete on grow log rows.
      </p>
      {loading && events.length ? <StatusChip label="Refreshing…" tone="muted" /> : null}
    </Card>
  );
}
