import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet, useFleetLastUpdated } from "../hooks/useFleet";
import { collectHonestyGapsFromFleet, nextRecommended, type HonestyGap } from "../lib/sensorHonesty";

/** "Updated Xs ago" — real wall-clock elapsed since the last fleet snapshot was
 * actually applied (WS push or poll), never a fabricated/optimistic value. */
function relativeAgeLabel(sinceMs: number | null, nowMs: number): string {
  if (sinceMs == null) return "—";
  const secs = Math.max(0, Math.round((nowMs - sinceMs) / 1000));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  return `${hours}h ago`;
}

export function FleetFreshnessChip() {
  const lastUpdatedAt = useFleetLastUpdated();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <StatusChip
      label={`Updated ${relativeAgeLabel(lastUpdatedAt, now)}`}
      tone="muted"
    />
  );
}

export function useHonestyGaps(): HonestyGap[] {
  const hass = useEntityBus();
  const fleet = useFleet();
  return useMemo(
    () =>
      collectHonestyGapsFromFleet(fleet, {
        state: hass.state,
        available: hass.available,
        entity: hass.entity,
      }),
    [fleet, hass.state, hass.available, hass.entity, hass.tick],
  );
}

export function HonestyRail({ gaps }: { gaps?: HonestyGap[] }) {
  const computed = useHonestyGaps();
  const list = gaps ?? computed;
  const [open, setOpen] = useState<HonestyGap | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const navigate = useNavigate();
  const overflow = list.length > 6 ? list.slice(6) : [];

  if (!list.length) {
    return (
      <div className="dsc-honesty-rail" aria-label="Honesty">
        <StatusChip icon="ok" label="Kit honest" tone="ok" />
        <FleetFreshnessChip />
      </div>
    );
  }
  return (
    <>
      <div className="dsc-honesty-rail" aria-label="Honesty gaps">
        <FleetFreshnessChip />
        {list.slice(0, 6).map((g) => (
          <button
            key={g.id}
            type="button"
            className="dsc-honesty-hit"
            onClick={() => setOpen(g)}
          >
            <StatusChip icon="alert" label={g.label} tone={g.tone === "bad" ? "bad" : "warn"} />
          </button>
        ))}
        {overflow.length ? (
          <button
            type="button"
            className="dsc-honesty-hit"
            onClick={() => setOverflowOpen(true)}
            title={`${overflow.length} more honesty gap(s)`}
            aria-label={`Show ${overflow.length} more honesty gaps`}
          >
            <StatusChip label={`+${overflow.length}`} tone="muted" />
          </button>
        ) : null}
      </div>
      <DecisionLayer
        open={open != null}
        onDismiss={() => setOpen(null)}
        onConfirm={
          open
            ? () => {
                navigate(open.href);
                setOpen(null);
              }
            : undefined
        }
        title={open?.label ?? "Honesty"}
        confirmLabel={open?.cta ?? "Go"}
        help={null}
      >
        <p>{open?.detail}</p>
      </DecisionLayer>
      <DecisionLayer
        open={overflowOpen}
        onDismiss={() => setOverflowOpen(false)}
        title={`${overflow.length} more honesty gap${overflow.length === 1 ? "" : "s"}`}
        help={null}
      >
        <ul className="dsc-honesty-overflow-list">
          {overflow.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                className="dsc-honesty-overflow-item"
                onClick={() => {
                  setOverflowOpen(false);
                  setOpen(g);
                }}
              >
                <StatusChip icon="alert" label={g.label} tone={g.tone === "bad" ? "bad" : "warn"} />
                <span className="dsc-muted">{g.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      </DecisionLayer>
    </>
  );
}

export function NextRecommendedCard({ gaps }: { gaps?: HonestyGap[] }) {
  const computed = useHonestyGaps();
  const list = gaps ?? computed;
  const next = nextRecommended(list);
  const navigate = useNavigate();

  if (!next) {
    return (
      <Card className="dsc-glass dsc-next-rec" title="Next" icon="ok">
        <p className="dsc-muted" style={{ margin: 0 }}>
          No critical gaps — fly Live or open Overview.
        </p>
        <div className="dsc-row-actions">
          <Button primary onClick={() => navigate("/live/overview")}>
            Open Overview
          </Button>
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate Want
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="dsc-glass dsc-next-rec" title="Do this next" icon="alert">
      <p style={{ margin: "0 0 8px" }}>
        <strong>{next.label}</strong> — {next.detail}
      </p>
      <Button primary onClick={() => navigate(next.href)}>
        {next.cta}
      </Button>
    </Card>
  );
}
