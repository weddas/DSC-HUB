import { STAGE_ORDER, tentStageRailLabel } from "../lib/tentWant";
import {
  KIT_PROBE_NUMBERS,
  buildPlantSeat,
  isPotInService,
  probeLabel,
  tentLabel,
  type TentId,
} from "../lib/seatModel";
import { useEntityBus } from "../hooks/useEntityBus";
import { Card, StatusChip } from "./ui";
import { VesselGlyph } from "./VesselGlyph";
import { TentLightClock } from "./TentLightClock";
import { readPotVessel } from "../lib/vesselSpec";

type PlantSeat = ReturnType<typeof buildPlantSeat>;
type HassBits = {
  state: (id: string, fallback?: string) => string;
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined;
};

function stageIndex(stage: string): number {
  if (!stage || stage === "—") return -1;
  const exact = STAGE_ORDER.findIndex((s) => s === stage);
  if (exact >= 0) return exact;
  for (let i = STAGE_ORDER.length - 1; i >= 0; i--) {
    if (stage.indexOf(STAGE_ORDER[i]) >= 0) return i;
  }
  if (/flower/i.test(stage)) return 6;
  if (/veg/i.test(stage)) return 3;
  if (/seed/i.test(stage)) return 1;
  return -1;
}

function stageTrackForSeats(seats: { seat: PlantSeat }[]) {
  const idxs = seats.map((s) => stageIndex(s.seat.stage)).filter((i) => i >= 0);
  const mixed = new Set(idxs).size > 1;
  const cur = idxs.length ? Math.max(...idxs) : -1;
  return { mixed, cur, live: seats };
}

function StageTrack({ cur }: { cur: number }) {
  return (
    <div className="dsc-stage-track" aria-label="Stage track">
      {STAGE_ORDER.map((st, i) => (
        <span
          key={st}
          className={`dsc-stage-pill${i === cur ? " is-on" : ""}${i === cur + 1 ? " is-next" : ""}`}
        >
          {st.replace("Late (Push) Vegetative", "Push Veg")
            .replace("Final 48-72h Flowering", "Finish")
            .replace("Early Vegetative", "Early Veg")
            .replace("Early Flowering", "Early Flwr")
            .replace("Late Flowering", "Late Flwr")}
        </span>
      ))}
    </div>
  );
}

function TentCropColumn({
  tent,
  seats,
  hass,
  compact,
}: {
  tent: Exclude<TentId, "unassigned">;
  seats: { seat: PlantSeat; oos: boolean }[];
  hass: HassBits;
  compact?: boolean;
}) {
  const tentSeats = seats.filter(({ seat, oos }) => !oos && seat.tent === tent);
  const { mixed, cur, live } = stageTrackForSeats(tentSeats);
  const title = tentLabel(tent);

  return (
    <div className={`dsc-scheduler-tent-col dsc-scheduler-tent-col--${tent}`}>
      <div className="dsc-scheduler-tent-head">
        <strong>{title}</strong>
        <TentLightClock tent={tent} compact />
      </div>
      <StageTrack cur={cur} />
      {mixed ? (
        <StatusChip icon="alert" label={`Mixed stages in ${title}`} tone="warn" />
      ) : live.length === 0 ? (
        <StatusChip icon="seat" label="No plants in tent" tone="muted" />
      ) : null}
      <div className={`dsc-scheduler-lanes${compact ? " is-compact" : ""}`}>
        {tentSeats.map(({ seat }) => {
          const days = Number(seat.days);
          const week = Number.isFinite(days) ? Math.max(1, Math.ceil(days / 7)) : null;
          return (
            <button
              key={seat.pot}
              type="button"
              className="dsc-scheduler-lane"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: seat.pot } }))
              }
            >
              <VesselGlyph spec={readPotVessel(seat.pot, hass.state, hass.entity)} size={16} />
              <strong>{probeLabel(seat.pot)}</strong>
              <span>{seat.plantName}</span>
              <span className="dsc-muted">
                W{week ?? "—"} · {Number.isFinite(days) ? `${days}d` : "—"} · {seat.stage} · Need {seat.need}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CropScheduler({ compact }: { compact?: boolean }) {
  const hass = useEntityBus();
  const seats = KIT_PROBE_NUMBERS.map((n) => ({
    seat: buildPlantSeat(n, hass),
    oos: !isPotInService(n, hass.state),
  }));
  const catchup = hass.state("binary_sensor.dsc_hub_light_catchup_active") === "on";
  const darkViol = hass.state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const unassigned = seats.filter(({ seat, oos }) => !oos && seat.tent === "unassigned");

  return (
    <Card className="dsc-glass" title="Crop scheduler" icon="roster">
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Each tent tracks its own stage rail and pots — 4×8 and 2×4 are separate grow environments.
      </p>
      <div className="dsc-scheduler-tents-split">
        <TentCropColumn tent="main" seats={seats} hass={hass} compact={compact} />
        <TentCropColumn tent="clone" seats={seats} hass={hass} compact={compact} />
      </div>
      <div className="dsc-chip-row" style={{ margin: "8px 0" }}>
        {catchup ? <StatusChip icon="lighting" motion="breathe" label="Catch-up" tone="warn" /> : null}
        {darkViol ? <StatusChip icon="alert" label="2×4 dark violation" tone="bad" pulse /> : null}
      </div>
      {unassigned.length ? (
        <>
          <p className="dsc-muted" style={{ fontSize: 12, margin: "12px 0 6px" }}>
            Unassigned probes
          </p>
          <div className={`dsc-scheduler-lanes${compact ? " is-compact" : ""}`}>
            {unassigned.map(({ seat }) => (
              <button
                key={seat.pot}
                type="button"
                className="dsc-scheduler-lane"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: seat.pot } }))
                }
              >
                <VesselGlyph spec={readPotVessel(seat.pot, hass.state, hass.entity)} size={16} />
                <strong>{probeLabel(seat.pot)}</strong>
                <span>{seat.plantName}</span>
                <StatusChip label="Unassigned" icon="seat" tone="muted" />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </Card>
  );
}

export { tentStageRailLabel };
