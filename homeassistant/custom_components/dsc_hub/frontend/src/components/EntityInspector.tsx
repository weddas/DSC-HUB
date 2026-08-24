import { useMemo } from "react";
import { SlideDrawer } from "./chrome";
import { Button, StatusChip } from "./ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { MultiLineChart } from "../viz/charts";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "./HistoryDrawer";
import { DutyStrip } from "./DutyStrip";
import { playbookFor } from "../lib/alertPlaybook";
import { fmtDurationMs } from "../lib/formatDuration";

export type InspectorKind = "binary" | "numeric" | "alert" | "kit" | "fleet";

export type InspectorTarget = {
  entityId: string;
  label: string;
  unit?: string;
  color?: string;
  kind?: InspectorKind;
  runtimeToday?: string;
  cyclesToday?: string;
  demandEntity?: string;
};

function isBinaryEntity(entityId: string, kind?: InspectorKind, state?: string): boolean {
  if (kind === "binary" || kind === "alert") return true;
  if (entityId.startsWith("binary_sensor.") || entityId.startsWith("switch.") || entityId.startsWith("light.")) {
    return true;
  }
  const s = (state || "").toLowerCase();
  return s === "on" || s === "off";
}

export function EntityInspector({
  target,
  onClose,
}: {
  target: InspectorTarget | null;
  onClose: () => void;
}) {
  const { state, num, available, entity } = useEntityBus();
  const { callService } = useFleetActions();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const { isSnoozed, snooze, unsnooze } = useAlertSnooze();
  const entityId = target?.entityId ?? "";
  const liveState = entityId ? state(entityId, "") : "";
  const binary = target ? isBinaryEntity(entityId, target.kind, liveState) : false;
  const series = useEntitySeries(entityId, { hours: binary ? 24 : hours, maxPoints: binary ? 288 : maxPoints });
  const ghostSpan = hours <= 18 ? hours * 2 : Math.min(hours + 24, 48);
  const ghostSrc = useEntitySeries(entityId, { hours: ghostSpan, maxPoints });
  const ghost = useMemo(() => {
    const windowMs = hours * 3600 * 1000;
    const cutoff = Date.now() - windowMs;
    return ghostSrc.series
      .filter((p) => p.t < cutoff)
      .map((p) => ({ t: p.t + windowMs, v: p.v }));
  }, [ghostSrc.series, hours]);

  if (!target) return null;
  const playbook = playbookFor(target.entityId, target.kind);
  const ent = entity(target.entityId);
  const lastChanged = ent?.last_changed ? Date.parse(ent.last_changed) : NaN;
  const lastLabel = Number.isFinite(lastChanged) ? fmtDurationMs(Date.now() - lastChanged) + " ago" : "—";
  const thin = series.series.length < 2;
  const snoozed = isSnoozed(target.entityId);
  const runtimeVal = target.runtimeToday ? num(target.runtimeToday) : NaN;
  const cyclesVal = target.cyclesToday ? num(target.cyclesToday) : NaN;
  const demandId = target.demandEntity;
  const domain = target.entityId.split(".")[0];
  const toggleable = domain === "switch" || domain === "light" || domain === "input_boolean";

  return (
    <SlideDrawer open={!!target.entityId} onClose={onClose} title={target.label}>
      <p className="dsc-muted" style={{ marginTop: 0, fontFamily: "var(--dsc-mono)", fontSize: 12 }}>
        {target.entityId}
        {!available(target.entityId) ? " · unavailable" : ""}
      </p>
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <StatusChip label={`Last ${lastLabel}`} tone="muted" />
        {Number.isFinite(runtimeVal) ? (
          <StatusChip label={`Today ${runtimeVal.toFixed(2)}h`} tone="ok" />
        ) : null}
        {Number.isFinite(cyclesVal) ? (
          <StatusChip label={`${Math.round(cyclesVal)} cycles`} tone="muted" />
        ) : null}
        <StatusChip
          label={liveState && liveState !== "—" ? String(liveState) : "no state"}
          tone={liveState === "on" ? "ok" : liveState === "off" ? "muted" : "warn"}
        />
      </div>

      <div className="dsc-inspector-playbook">
        <strong>{playbook.title}</strong>
        <p>{playbook.what}</p>
        <p className="dsc-muted">{playbook.fix}</p>
      </div>

      {target.kind === "alert" || target.entityId.startsWith("binary_sensor.") ? (
        <div className="dsc-chip-row" style={{ margin: "10px 0" }}>
          {snoozed ? (
            <Button onClick={() => unsnooze(target.entityId)}>Unsnooze</Button>
          ) : (
            <Button onClick={() => snooze(target.entityId)}>Acknowledge until hub reboot</Button>
          )}
          {snoozed ? <StatusChip label="Snoozed this boot" tone="warn" /> : null}
        </div>
      ) : null}

      {toggleable ? (
        <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
          <Button
            primary
            onClick={() =>
              void callService(domain, liveState === "on" ? "turn_off" : "turn_on", {
                entity_id: target.entityId,
              })
            }
          >
            {liveState === "on" ? "Turn off" : "Turn on"}
          </Button>
        </div>
      ) : null}

      {binary || demandId ? (
        <DutyStrip entityId={demandId || target.entityId} hours={24} />
      ) : null}

      <div className="dsc-chip-row" style={{ margin: "12px 0" }}>
        <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
        {thin ? <StatusChip label="Thin recorder" tone="warn" /> : null}
        {ghost.length > 1 ? <StatusChip label="Prior window ghost" tone="muted" /> : null}
      </div>

      <MultiLineChart
        live
        unit={binary ? "" : target.unit || ""}
        lastSyncAt={series.lastSyncAt}
        yDomain={binary ? { left: { min: 0, max: 1 } } : undefined}
        emptyLabel="thin recorder"
        series={[
          {
            id: target.entityId,
            label: target.label,
            series: series.series,
            color: target.color || "var(--dsc-teal)",
            unit: binary ? "" : target.unit,
            step: binary,
          },
          ...(ghost.length > 1
            ? [
                {
                  id: `${target.entityId}-ghost`,
                  label: `${target.label} prior`,
                  series: ghost,
                  color: target.color || "var(--dsc-teal)",
                  unit: target.unit,
                  ghost: true,
                },
              ]
            : []),
        ]}
      />
    </SlideDrawer>
  );
}
