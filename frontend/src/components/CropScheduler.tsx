import { STAGE_ORDER, tentStageRailLabel } from "../lib/tentWant";
import {
  KIT_PROBE_NUMBERS,
  buildPlantProbe,
  daysSinceSproutIso,
  isProbeInService,
  normalizeTent,
  probeLabel,
  rosterSlots,
  tentLabel,
  type TentId,
} from "../lib/probeModel";
import { useEntityBus } from "../hooks/useEntityBus";
import { Card, StatusChip } from "./ui";
import { VesselGlyph } from "./VesselGlyph";
import { TentLightClock } from "./TentLightClock";
import { readProbeVessel } from "../lib/vesselSpec";

type PlantProbe = ReturnType<typeof buildPlantProbe>;
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

function stageTrackForProbes(probes: { plant: PlantProbe }[]) {
  const idxs = probes.map((s) => stageIndex(s.plant.stage)).filter((i) => i >= 0);
  const mixed = new Set(idxs).size > 1;
  const cur = idxs.length ? Math.max(...idxs) : -1;
  return { mixed, cur, live: probes };
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

function daysSinceSprout(sprout: string | undefined): number | null {
  return daysSinceSproutIso(sprout);
}

function TentCropColumn({
  tent,
  probes,
  hass,
  compact,
  stockSlots,
}: {
  tent: Exclude<TentId, "unassigned">;
  probes: { plant: PlantProbe; oos: boolean }[];
  hass: HassBits;
  compact?: boolean;
  stockSlots: { slot: number; nickname?: string; strain?: string; sprout?: string; status?: string; tent?: string }[];
}) {
  const tentProbes = probes.filter(({ plant, oos }) => !oos && plant.tent === tent);
  const stockInTent = stockSlots.filter((s) => normalizeTent(s.tent) === tent);
  const stockAsProbes = stockInTent.map((s) => ({
    plant: {
      probe: 0,
      plantName: s.nickname || s.strain || "Stock plant",
      stage: s.status === "stock" ? "Expected (stock)" : String(s.status || "—"),
      days: String(daysSinceSprout(s.sprout) ?? "—"),
      need: "—",
    } as PlantProbe,
    oos: false,
  }));
  const { mixed, cur, live } = stageTrackForProbes([...tentProbes, ...stockAsProbes]);
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
      ) : live.length === 0 && stockInTent.length === 0 ? (
        <StatusChip icon="seat" label="No plants in tent" tone="muted" />
      ) : null}
      <div className={`dsc-scheduler-lanes${compact ? " is-compact" : ""}`}>
        {tentProbes.map(({ plant }) => {
          const days = Number(plant.days);
          const week = Number.isFinite(days) ? Math.max(1, Math.ceil(days / 7)) : null;
          return (
            <button
              key={plant.probe}
              type="button"
              className="dsc-scheduler-lane"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("dsc-dash-select-probe", { detail: { probe: plant.probe } }))
              }
            >
              <VesselGlyph spec={readProbeVessel(plant.probe, hass.state, hass.entity)} size={16} />
              <strong>{probeLabel(plant.probe)}</strong>
              <span>{plant.plantName}</span>
              <span className="dsc-muted">
                W{week ?? "—"} · {Number.isFinite(days) ? `${days}d` : "—"} · {plant.stage} · Need {plant.need}
              </span>
            </button>
          );
        })}
        {stockInTent.map((s) => {
          const days = daysSinceSprout(s.sprout);
          const week = days != null ? Math.max(1, Math.ceil(days / 7)) : null;
          return (
            <div key={`stock-${s.slot}`} className="dsc-scheduler-lane" style={{ cursor: "default" }}>
              <strong>Roster #{s.slot}</strong>
              <span>{s.nickname || s.strain || "—"}</span>
              <StatusChip label={s.status === "stock" ? "Stock" : String(s.status || "—")} tone="muted" />
              <span className="dsc-muted">
                W{week ?? "—"} · {days != null ? `${days}d` : "—"} · no probe
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CropScheduler({ compact }: { compact?: boolean }) {
  const hass = useEntityBus();
  const probes = KIT_PROBE_NUMBERS.map((n) => ({
    plant: buildPlantProbe(n, hass),
    oos: !isProbeInService(n, hass.state),
  }));
  const stockSlots = rosterSlots(hass.entity).filter((s) => {
    const st = String(s.status || "");
    return st === "stock" || st === "detached";
  });
  const catchup = hass.state("binary_sensor.dsc_hub_light_catchup_active") === "on";
  const darkViol = hass.state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const unassigned = probes.filter(({ plant, oos }) => !oos && plant.tent === "unassigned");

  return (
    <Card className="dsc-glass" title="Crop scheduler" icon="roster">
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Each tent tracks its own stage rail and plants — 4×8 and 2×4 are separate grow environments.
      </p>
      <div className="dsc-scheduler-tents-split">
        <TentCropColumn tent="main" probes={probes} hass={hass} compact={compact} stockSlots={stockSlots} />
        <TentCropColumn tent="clone" probes={probes} hass={hass} compact={compact} stockSlots={stockSlots} />
      </div>
      <div className="dsc-chip-row" style={{ margin: "8px 0" }}>
        {catchup ? <StatusChip icon="lighting" motion="breathe" label="Catch-up" tone="warn" /> : null}
        {darkViol ? <StatusChip icon="alert" label="2×4 dark violation" tone="bad" pulse /> : null}
      </div>
      {unassigned.length ? (
        <>
          <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", margin: "12px 0 6px" }}>
            Unassigned probes
          </p>
          <div className={`dsc-scheduler-lanes${compact ? " is-compact" : ""}`}>
            {unassigned.map(({ plant }) => (
              <button
                key={plant.probe}
                type="button"
                className="dsc-scheduler-lane"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("dsc-dash-select-probe", { detail: { probe: plant.probe } }))
                }
              >
                <VesselGlyph spec={readProbeVessel(plant.probe, hass.state, hass.entity)} size={16} />
                <strong>{probeLabel(plant.probe)}</strong>
                <span>{plant.plantName}</span>
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
