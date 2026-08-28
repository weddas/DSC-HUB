import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { collectHonestyGapsFromFleet, nextRecommended, type HonestyGap } from "../lib/sensorHonesty";

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
  const navigate = useNavigate();
  if (!list.length) {
    return (
      <div className="dsc-honesty-rail" aria-label="Honesty">
        <StatusChip icon="ok" label="Kit honest" tone="ok" />
      </div>
    );
  }
  return (
    <>
      <div className="dsc-honesty-rail" aria-label="Honesty gaps">
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
        {list.length > 6 ? (
          <button
            type="button"
            className="dsc-honesty-hit"
            onClick={() => setOpen(list[6])}
            title={`${list.length - 6} more honesty gap(s)`}
          >
            <StatusChip label={`+${list.length - 6}`} tone="muted" />
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
          No critical gaps — fly Live or open Twin.
        </p>
        <div className="dsc-row-actions">
          <Button primary onClick={() => navigate("/live/twin")}>
            Open Twin
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
