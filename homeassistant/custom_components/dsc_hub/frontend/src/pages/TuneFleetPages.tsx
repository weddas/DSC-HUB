import { Card, EntityToggle, Kpi, PageHeader, StatusChip } from "../components/ui";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../components/HistoryDrawer";
import { LearningWizard } from "../components/LearningWizard";
import { TankCutaway } from "../components/TankCutaway";
import { KitPulse } from "../components/KitPulse";
import { HubLinkLine } from "../components/HubLinkLine";
import { CfmTrustLine } from "../components/CfmBadge";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { MultiLineChart } from "../viz/charts";
import { ALL_POT_NUMBERS, isPotInService, potGotEntity } from "../lib/seatModel";
import { resolveCfm } from "../lib/cfmProvenance";
import { buildKitNodesFromFleet, kitInServiceCount, type KitNode } from "../lib/kitInventory";
import { useFleet } from "../hooks/useFleet";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { useInspector } from "../components/InspectorHost";

const POT_COLORS = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];

export function TuneLearningPage() {
  return (
    <div className="dsc-page">
      <PageHeader
        icon="learning"
        title="Learning"
        subtitle="Anemometer gate, sample, accept — scripts own the math. No dsc-hub-pro."
      />
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <LearningWizard />
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit / In service" icon="settings">
            <div className="dsc-mode-row">
              <EntityToggle entityId="input_boolean.dsc_ac_in_service" label="AC in service" icon="climate" />
              <EntityToggle
                entityId="input_boolean.dsc_clone_humidifier_in_service"
                label="Clone mister"
                icon="clone"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TuneAnalyticsPage() {
  const { state } = useHass();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const tSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { maxPoints, hours });
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { maxPoints, hours });
  const p1m = useEntitySeries(potGotEntity(1, "moisture", state), { maxPoints, hours });
  const p2m = useEntitySeries(potGotEntity(2, "moisture", state), { maxPoints, hours });
  const p3m = useEntitySeries(potGotEntity(3, "moisture", state), { maxPoints, hours });
  const p4m = useEntitySeries(potGotEntity(4, "moisture", state), { maxPoints, hours });
  const byPot = [
    { n: 1 as const, series: p1m },
    { n: 2 as const, series: p2m },
    { n: 3 as const, series: p3m },
    { n: 4 as const, series: p4m },
  ];
  const moistSeries = byPot.filter((p) => isPotInService(p.n, state));
  const worstNeed = ALL_POT_NUMBERS.filter((n) => isPotInService(n, state))
    .map((n) => ({ n, need: state(`sensor.dsc_pot${n}_need_summary`, "—") }))
    .find((row) => row.need && row.need !== "—" && !/^ok$/i.test(row.need));

  return (
    <div className="dsc-page">
      <PageHeader
        icon="analytics"
        title="Analytics"
        subtitle="In-service pots. Climate charts live on Climate; this is the root pack."
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
              Primary traces sit on Climate. Ghost/compare there, not a second dashboard.
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
                  label: worstNeed?.n === p.n ? `P${p.n} Need` : `P${p.n}`,
                  series: p.series.series,
                  color: POT_COLORS[i % POT_COLORS.length],
                  unit: "%",
                }))}
              />
            )}
            {worstNeed ? (
              <p className="dsc-kpi-sub">
                Worst Need P{worstNeed.n}: {worstNeed.need}
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

export function FleetOverviewPage() {
  const { state, available, num } = useHass();
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
  const rows: { label: string; id: string }[] = [
    { label: "Pi appliance link", id: "binary_sensor.dsc_pi_appliance_link" },
    { label: "Hub firmware", id: "sensor.dsc_hub_firmware_version" },
    { label: "Control firmware", id: "sensor.dsc_control_firmware_version" },
    { label: "Pot1 firmware", id: "sensor.dsc_pot1_firmware_version" },
    { label: "Pot2 firmware", id: "sensor.dsc_pot2_firmware_version" },
    { label: "Pot3 firmware", id: "sensor.dsc_pot3_firmware_version" },
    { label: "Pot4 firmware", id: "sensor.dsc_pot4_firmware_version" },
    { label: "Nest / SoftAP channel", id: "sensor.dsc_hub_wifi_channel" },
  ];

  return (
    <div className="dsc-page">
      <PageHeader
        icon="fleet"
        title="Fleet"
        subtitle={`${svc.inService} of ${svc.total} in service. Kit Pulse holes, tank tester, fleet table.`}
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
            value={fleet.surface || state("sensor.dsc_ha_surface_version", "7.2.0")}
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
              Holes are missing / planned OOS / dark after cooldown — not a greenwashed map.
            </p>
            <KitPulse nodes={kit} onSelect={openNode} />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit / In service" icon="settings">
            <div className="dsc-mode-row">
              <EntityToggle entityId="input_boolean.dsc_ac_in_service" label="AC in service" icon="climate" />
              <EntityToggle
                entityId="input_boolean.dsc_clone_humidifier_in_service"
                label="Clone mister"
                icon="clone"
              />
              <EntityToggle entityId="input_boolean.dsc_pot1_in_service" label="Pot 1" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_pot2_in_service" label="Pot 2" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_pot3_in_service" label="Pot 3" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_pot4_in_service" label="Pot 4" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_tank_in_service" label="Tank" icon="tank" />
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
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Bridge / firmware" icon="fleet">
            <table className="dsc-table">
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    <td>
                      {available(row.id) ? (
                        state(row.id, "—")
                      ) : (
                        <StatusChip label="hole" tone="warn" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
