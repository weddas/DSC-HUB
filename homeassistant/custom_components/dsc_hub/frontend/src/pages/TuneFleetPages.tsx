import { Card, Kpi, PageHeader } from "../components/ui";
import { HelpTip } from "../components/HelpTip";
import { InventoryInServiceToggle } from "../components/InventoryInServiceToggle";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../components/HistoryDrawer";
import { LearningWizard } from "../components/LearningWizard";
import { TankCutaway } from "../components/TankCutaway";
import { KitPulse } from "../components/KitPulse";
import { HubLinkLine } from "../components/HubLinkLine";
import { CfmTrustLine } from "../components/CfmBadge";
import { useEntityBus } from "../hooks/useEntityBus";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { MultiLineChart } from "../viz/charts";
import { KIT_PROBE_NUMBERS, isPotInService, potGotEntity, probeLabel } from "../lib/seatModel";
import { resolveCfm } from "../lib/cfmProvenance";
import { buildKitNodesFromFleet, kitInServiceCount, type KitNode } from "../lib/kitInventory";
import { useFleet } from "../hooks/useFleet";
import { useInspector } from "../components/InspectorHost";

const POT_COLORS = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];

export function TuneLearningPage() {
  return (
    <div className="dsc-page">
      <PageHeader
        icon="learning"
        title="Learning"
        subtitle="Measure fan output, review the sample, then accept it into the curve."
        actions={
          <HelpTip title="Learning samples">
            <p>
              Learning writes measured fan CFM into the curve the brain trusts. Skip or reject a bad sample — a guessed
              point is worse than a gap.
            </p>
            <p>Example: run exhaust at a known %, capture anemometer CFM, accept only if the reading was steady.</p>
          </HelpTip>
        }
      />
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <LearningWizard />
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit / In service" icon="settings">
            <div className="dsc-mode-row">
              <InventoryInServiceToggle seatId="pot1" label="Probe 1" icon="root" />
              <InventoryInServiceToggle seatId="pot2" label="Probe 2" icon="root" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TuneAnalyticsPage() {
  const { state } = useEntityBus();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const tSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { maxPoints, hours });
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { maxPoints, hours });
  const p1m = useEntitySeries(potGotEntity(1, "moisture", state), { maxPoints, hours });
  const p2m = useEntitySeries(potGotEntity(2, "moisture", state), { maxPoints, hours });
  const byPot = [
    { n: 1 as const, series: p1m },
    { n: 2 as const, series: p2m },
  ];
  const moistSeries = byPot.filter((p) => isPotInService(p.n, state));
  const worstNeed = [...KIT_PROBE_NUMBERS]
    .filter((n) => isPotInService(n, state))
    .map((n) => ({ n, need: state(`sensor.dsc_probe${n}_need_summary`, "—") }))
    .find((row) => row.need && row.need !== "—" && !/^ok$/i.test(row.need));

  return (
    <div className="dsc-page">
      <PageHeader
        icon="analytics"
        title="Analytics"
        subtitle="In-service probes. Climate charts live on Climate; this is the root pack."
        actions={
          <HelpTip title="Analytics pack">
            <p>
              Analytics is the root moisture pack and a secondary tent T/RH glance — not the Climate Want desk. Worst Need
              points at the probe that needs Root attention first.
            </p>
            <p>Example: Probe 1 Need “dry” → open Root for Probe 1, not another Climate setpoint rewrite.</p>
          </HelpTip>
        }
      />
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <TimespanControl
          hours={hours}
          setHours={setHours}
          extras={CYCLE_TIMESPAN_EXTRAS}
        />
      </div>
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Tent T + RH (secondary)" icon="climate">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              The full climate charts live on the Climate page.
            </p>
            <MultiLineChart
              live
              lastSyncAt={Math.max(tSeries.lastSyncAt ?? 0, rhSeries.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp °C",
                  series: tSeries.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "°C",
                },
                {
                  id: "rh",
                  label: "RH %",
                  series: rhSeries.series,
                  color: "var(--dsc-teal)",
                  axis: "right",
                  unit: "%",
                },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Root pack — moisture (in service)" icon="root">
            {!moistSeries.length ? (
              <p className="dsc-muted">No in-service pots.</p>
            ) : (
              <MultiLineChart
                live
                unit="%"
                lastSyncAt={Math.max(...moistSeries.map((p) => p.series.lastSyncAt ?? 0)) || undefined}
                series={moistSeries.map((p, i) => ({
                  id: `p${p.n}`,
                  label: worstNeed?.n === p.n ? `${probeLabel(p.n)} Need` : probeLabel(p.n),
                  series: p.series.series,
                  color: POT_COLORS[i % POT_COLORS.length],
                  unit: "%",
                }))}
              />
            )}
            {worstNeed ? (
              <p className="dsc-kpi-sub">
                Worst Need {probeLabel(worstNeed.n)}: {worstNeed.need}
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

export function FleetOverviewPage() {
  const { state, available, num } = useEntityBus();
  const fleet = useFleet();
  const inspector = useInspector();
  const kit: KitNode[] = buildKitNodesFromFleet(fleet);
  const svc = kitInServiceCount(kit);
  const out = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const openNode = (node: KitNode) =>
    inspector.open({
      entityId: node.entityId,
      label: node.label,
      kind: "kit",
      runtimeToday: node.runtimeToday,
      cyclesToday: node.cyclesToday,
      demandEntity: node.demandEntity,
    });
  return (
    <div className="dsc-page">
      <PageHeader
        icon="fleet"
        title="Fleet"
        subtitle={`${svc.inService} of ${svc.total} devices in service. Device health, tank, and service toggles.`}
        actions={
          <HelpTip title="Kit pulse">
            <p>
              Fleet is the kit desk — online/offline and In service, not climate Want. Grey quiet means out of service or
              no data, not a silent alarm.
            </p>
            <p>Hub link chips (Up/Down/Beat) tell link honesty; open Settings to change In service for a seat.</p>
          </HelpTip>
        }
      />
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <HubLinkLine />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="In service"
            value={`${svc.inService}/${svc.total}`}
            tone={svc.dark > 0 ? "bad" : "ok"}
          />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="Surface"
            value={fleet.surface || state("sensor.dsc_ha_surface_version", "7.4.0")}
            sub="Panel product shell"
          />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="Alerts"
            value={
              Number.isFinite(num("sensor.dsc_active_alert_count"))
                ? num("sensor.dsc_active_alert_count")
                : "—"
            }
            tone={num("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"}
          />
          <CfmTrustLine readings={[out]} />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit Pulse" icon="system">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              Grey = offline or out of service. Every device shows its real state.
            </p>
            <KitPulse nodes={kit} onSelect={openNode} />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit / In service" icon="settings">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Inventory gates only — wired to Settings inventory PATCH, not dead input_boolean helpers.
            </p>
            <div className="dsc-mode-row">
              <InventoryInServiceToggle seatId="pot1" label="Probe 1" icon="root" />
              <InventoryInServiceToggle seatId="pot2" label="Probe 2" icon="root" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Tank" icon="tank">
            <TankCutaway />
            <p className="dsc-kpi-sub">
              Stage {state("input_select.dsc_tank_stage", "—")} · Type{" "}
              {state("input_select.dsc_tank_plant_type", "—")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
