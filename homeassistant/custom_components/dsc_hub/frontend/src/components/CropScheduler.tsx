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
  const window4 = state("binary_sensor.dsc_hub_4x8_window_open") === "on";
  const window2 = state("binary_sensor.dsc_hub_2x4_window_open") === "on";
  const catchup = state("binary_sensor.dsc_hub_light_catchup_active") === "on";
  const darkViol = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const hours4 = state("sensor.dsc_expected_light_hours", "—");
  const hours2 = state("sensor.dsc_clone_expected_light_hours", "—");

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
      {mixed ? <StatusChip label="Mixed stages in tents" tone="warn" /> : null}
      <div className="dsc-chip-row" style={{ margin: "8px 0" }}>
        <StatusChip label={`4×8 ${window4 ? "window open" : "dark"} · Want ${hours4}h`} tone={window4 ? "ok" : "muted"} />
        <StatusChip label={`2×4 ${window2 ? "window open" : "dark"} · Want ${hours2}h`} tone={window2 ? "ok" : "muted"} />
        {catchup ? <StatusChip label="Catch-up" tone="warn" /> : null}
        {darkViol ? <StatusChip label="2×4 dark violation" tone="bad" pulse /> : null}
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
              <StatusChip label={tentLabel(seat.tent)} tone={oos || seat.tent === "unassigned" ? "muted" : "ok"} />
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
