import type { ZoneModel } from "../hooks/useZones";
import { phaseFromStage } from "../hooks/useZones";
import { railForStage, STAGE_ORDER } from "../lib/tentWant";
import { PhaseChip } from "./Panel";

/**
 * Setpoints by phase (frame 1d): the stage presets around the current one, with the
 * current row marked. Bands follow the hub's stage preset; plant rails narrow them.
 */
export function SetpointsByPhase({ zone }: { zone: ZoneModel }) {
  if (zone.role !== "grow") {
    return <p className="dsc-panel-foot">The room has no phase — it follows the tents.</p>;
  }
  const current = zone.stage ?? "";
  const idx = STAGE_ORDER.findIndex((s) => s === current);
  const rows =
    idx >= 0
      ? STAGE_ORDER.slice(Math.max(0, idx - 1), Math.min(STAGE_ORDER.length, idx + 2))
      : zone.id === "clone"
        ? (["Seedling", "Early Vegetative", "Vegetative"] as const)
        : STAGE_ORDER.slice(0, 3);
  return (
    <div className="dsc-setpoints">
      <div className="dsc-setpoints-grid">
        <span />
        <span className="dsc-legend">VPD</span>
        <span className="dsc-legend">Temp</span>
        <span className="dsc-legend">RH</span>
        {rows.map((stage) => {
          const rail = railForStage(stage);
          const isNow = stage === current;
          const phase = phaseFromStage(stage);
          return (
            <div key={stage} className={`dsc-setpoints-row${isNow ? " is-now" : ""}`} role="row">
              <span className="dsc-setpoints-stage">
                {phase ? <PhaseChip phase={phase} /> : null}
                <span>{rail?.short ?? stage}</span>
                {isNow ? <span className="dsc-setpoints-now" aria-label="current stage">●</span> : null}
              </span>
              <span>{rail ? `${rail.vpdMin.toFixed(1)}–${rail.vpdMax.toFixed(1)}` : "—"}</span>
              <span>{rail ? `${rail.temp - 1.5}–${rail.temp + 1.5}` : "—"}</span>
              <span>{rail ? `${rail.rhMin}–${rail.rhMax}` : "—"}</span>
            </div>
          );
        })}
      </div>
      {zone.vpd.band && zone.stage ? (
        <p className="dsc-panel-foot">
          Live want {zone.vpd.band.min.toFixed(1)}–{zone.vpd.band.max.toFixed(1)} kPa
          {zone.rh.band ? ` · RH ${Math.round(zone.rh.band.min)}–${Math.round(zone.rh.band.max)} %` : ""}
          {" — "}the stage preset, narrowed by any plant rail. Bands shift when the stage changes · edit Want in Targets.
        </p>
      ) : (
        <p className="dsc-panel-foot">No stage preset is set for this zone — pick one in Command, or assign a plant.</p>
      )}
    </div>
  );
}
