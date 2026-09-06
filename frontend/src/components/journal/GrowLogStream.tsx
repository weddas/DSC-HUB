import { useEffect, useState } from "react";
import { Card, StatusChip } from "../ui";
import { get_grow_log } from "../../lib/fleetApi";
import { filterGrowLog, prepareGrowLog, type GrowLogFilter } from "../../lib/growLogFilter";
import { useEntityBus } from "../../hooks/useEntityBus";
import { GrowLogList } from "./GrowLogList";

/** Operational grow log stream — GET-only v1; separate from observation journals. */
export function GrowLogStream() {
  const { state } = useEntityBus();
  const [events, setEvents] = useState<ReturnType<typeof prepareGrowLog>>([]);
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
      <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", margin: "0 0 8px" }}>
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
      {filtered.length ? <GrowLogList events={filtered} timeFormat="full" /> : null}
      {!loading && !filtered.length ? (
        <p className="dsc-muted">No operational events in the last 24 hours.</p>
      ) : null}
      <p className="dsc-muted" style={{ margin: "10px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
        GET-only v1 — no edit or delete on grow log rows.
      </p>
      {loading && events.length ? <StatusChip label="Refreshing…" tone="muted" /> : null}
    </Card>
  );
}
