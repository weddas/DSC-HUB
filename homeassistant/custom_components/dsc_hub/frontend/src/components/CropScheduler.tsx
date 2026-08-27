import { STAGE_ORDER } from "../lib/tentWant";
import {
  ALL_POT_NUMBERS,
  buildPlantSeat,
  isPotInService,
  tentLabel,
} from "../lib/seatModel";
import { useEntityBus } from "../hooks/useEntityBus";
import { Card, StatusChip } from "./ui";
import { VesselGlyph } from "./VesselGlyph";
import { TentLightClock } from "./TentLightClock";
import { readPotVessel } from "../lib/vesselSpec";

function stageIndex(stage: string): number {
  if (!stage || stage === "—") return -1;
  const i = STAGE_ORDER.findIndex((s) => stage.indexOf(s) >= 0);
  if (i >= 0) return i;
  if (/flower/i.test(stage)) return 6;
  if (/veg/i.test(stage)) return 3;
  if (/seed/i.test(stage)) return 1;
  return -1;
}

export function CropScheduler({ compact }: { compact?: boolean }) {
  const { state, entity } = useEntityBus();
  const seats = ALL_POT_NUMBERS.map((n) => ({
    seat: buildPlantSeat(n, { state, entity }),
    oos: !isPotInService(n, state),
  }));
  const live = seats.filter((s) => !s.oos);
  const idxs = live.map((s) => stageIndex(s.seat.stage)).filter((i) => i >= 0);
  const mixed = new Set(idxs).size > 1;
  const cur = idxs.length ? Math.max(...idxs) : -1;
  const catchup = state("binary_sensor.dsc_hub_light_catchup_active") === "on";
  const darkViol = state("binary_sensor.dsc_clone_dark_period_violation") === "on";

  return (
    <Card className="dsc-glass" title="Crop scheduler" icon="roster">
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
      {mixed ? <StatusChip icon="alert" label="Mixed stages in tents" tone="warn" /> : null}
      <div className="dsc-scheduler-tents">
        <div className="dsc-scheduler-tent dsc-scheduler-tent--main">
          <TentLightClock tent="main" compact />
        </div>
        <div className="dsc-scheduler-tent dsc-scheduler-tent--clone">
          <TentLightClock tent="clone" compact />
        </div>
      </div>
      <div className="dsc-chip-row" style={{ margin: "8px 0" }}>
        {catchup ? <StatusChip icon="lighting" motion="breathe" label="Catch-up" tone="warn" /> : null}
        {darkViol ? <StatusChip icon="alert" label="2×4 dark violation" tone="bad" pulse /> : null}
      </div>
      <div className={`dsc-scheduler-lanes${compact ? " is-compact" : ""}`}>
        {seats.map(({ seat, oos }) => {
          const days = Number(seat.days);
          const week = Number.isFinite(days) ? Math.max(1, Math.ceil(days / 7)) : null;
          return (
            <button
              key={seat.pot}
              type="button"
              className={`dsc-scheduler-lane${oos ? " is-oos" : ""}`}
              disabled={oos}
              onClick={() =>
                window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: seat.pot } }))
              }
            >
              <VesselGlyph spec={readPotVessel(seat.pot, state, entity)} size={16} />
              <strong>P{seat.pot}</strong>
              <span>{oos ? "Out of service" : seat.plantName}</span>
              <StatusChip
                label={tentLabel(seat.tent)}
                icon={seat.tent === "main" ? "tent" : seat.tent === "clone" ? "clone" : "seat"}
                tone={oos || seat.tent === "unassigned" ? "muted" : "ok"}
              />
              <span className="dsc-muted">
                {oos
                  ? "—"
                  : `W${week ?? "—"} · ${Number.isFinite(days) ? `${days}d` : "—"} · ${seat.stage} · Need ${seat.need}`}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
