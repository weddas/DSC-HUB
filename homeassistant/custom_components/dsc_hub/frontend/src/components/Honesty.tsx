import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { collectHonestyGaps, nextRecommended, type HonestyGap } from "../lib/sensorHonesty";

export function useHonestyGaps(): HonestyGap[] {
  const hass = useHass();
  return useMemo(
    () =>
      collectHonestyGaps({
        state: hass.state,
        available: hass.available,
        entity: hass.entity,
      }),
    [hass.state, hass.available, hass.entity, hass.tick],
  );
}

export function HonestyRail({ gaps }: { gaps?: HonestyGap[] }) {
  const computed = useHonestyGaps();
  const list = gaps ?? computed;
  if (!list.length) {
    return (
      <div className="dsc-honesty-rail" aria-label="Honesty">
        <StatusChip icon="ok" label="Kit honest" tone="ok" />
      </div>
    );
  }
  return (
    <div className="dsc-honesty-rail" aria-label="Honesty gaps">
      {list.slice(0, 6).map((g) => (
        <StatusChip key={g.id} icon="alert" label={g.label} tone={g.tone === "bad" ? "bad" : "warn"} />
      ))}
    </div>
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
