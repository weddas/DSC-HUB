import { useEntityBus } from "../hooks/useEntityBus";
import { StatusChip } from "./ui";

/** Generic neon plant extra — stage, days, Need/stress, awake/asleep. No cultivar mesh; no narrator. */
export function PlantExtra({ pot }: { pot: number }) {
  const { available, state, num } = useEntityBus();
  const stage = state(`sensor.dsc_probe${pot}_expected_stage`, "—");
  const days = state(`sensor.dsc_probe${pot}_days_since_sprout`, "—");
  const need = state(`sensor.dsc_probe${pot}_need_summary`, "—");
  const untrusted = state(`binary_sensor.dsc_probe${pot}_untrusted`) === "on";
  const dry = num(`sensor.dsc_probe${pot}_dryback_pct`);
  const tent = state(`input_select.dsc_probe${pot}_tent`, "unassigned");
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
        {/* Calendar age model only — not live plant state; Growth stage select is SoT. */}
        <StatusChip
          label={
            stage === "—" || !stage
              ? days !== "—" && days !== ""
                ? `Expected (day ${days})`
                : "No expected stage"
              : `Expected · ${stage}`
          }
          tone="muted"
        />
        <StatusChip
          label={untrusted ? "Need blocked (untrusted)" : stress}
          tone={untrusted ? "warn" : stress === "calm" ? "ok" : "warn"}
        />
      </div>
      {!available(`sensor.dsc_probe${pot}_expected_stage`) ? (
        <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
          No cultivar mesh. Missing fields stay empty.
        </p>
      ) : null}
    </div>
  );
}
