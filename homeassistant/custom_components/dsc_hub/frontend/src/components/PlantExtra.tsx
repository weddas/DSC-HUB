import { useEntityBus } from "../hooks/useEntityBus";
import { StatusChip } from "./ui";

/** Generic neon plant extra — stage, days, Need/stress, awake/asleep. No cultivar mesh; no narrator. */
export function PlantExtra({ pot }: { pot: number }) {
  const { available, state, num } = useEntityBus();
  const stage = state(`sensor.dsc_pot${pot}_expected_stage`, "—");
  const days = state(`sensor.dsc_pot${pot}_days_since_sprout`, "—");
  const need = state(`sensor.dsc_pot${pot}_need_summary`, "—");
  const untrusted = state(`binary_sensor.dsc_pot${pot}_untrusted`) === "on";
  const dry = num(`sensor.dsc_pot${pot}_dryback_pct`);
  const tent = state(`input_select.dsc_pot${pot}_tent`, "unassigned");
  const windowOpen =
    tent === "clone"
      ? state("light.dsc_hub_sf1000_dimmer") === "on"
      : state("binary_sensor.dsc_hub_4x8_window_open") === "on";
  const photoperiodOn = tent === "clone" || tent === "main" ? windowOpen : false;
  const stress =
    Number.isFinite(dry) && dry > 55 ? "dryback stress" : need !== "—" && need !== "ok" ? "Need" : "calm";

  return (
    <div className="dsc-plant-extra">
      <div className="dsc-chip-row">
        <StatusChip label={photoperiodOn ? "Awake" : "Asleep"} tone={photoperiodOn ? "ok" : "muted"} />
        <StatusChip label={`Day ${days}`} tone="muted" />
        <StatusChip label={stage === "—" ? "No stage Got" : stage} tone={stage === "—" ? "muted" : "ok"} />
        <StatusChip
          label={untrusted ? "Need blocked (untrusted)" : stress}
          tone={untrusted ? "warn" : stress === "calm" ? "ok" : "warn"}
        />
      </div>
      {!available(`sensor.dsc_pot${pot}_expected_stage`) ? (
        <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
          No cultivar mesh. Missing fields stay empty.
        </p>
      ) : null}
    </div>
  );
}
