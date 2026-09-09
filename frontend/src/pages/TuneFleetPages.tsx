import { Card, Kpi, PageHeader } from "../components/ui";
import { HelpTip } from "../components/HelpTip";
import { InventoryInServiceToggle } from "../components/InventoryInServiceToggle";
import { LearningWizard } from "../components/LearningWizard";
import { TankCutaway } from "../components/TankCutaway";
import { KitPulse } from "../components/KitPulse";
import { Skeleton } from "../components/Skeleton";
import { HubLinkLine } from "../components/HubLinkLine";
import { useEntityBus } from "../hooks/useEntityBus";
import { buildKitNodesFromFleet, kitInServiceCount, type KitNode } from "../lib/kitInventory";
import { useFleet, useFleetLastUpdated } from "../hooks/useFleet";
import { useInspector } from "../components/InspectorHost";

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
          <Card className="dsc-glass" title="Kit & in service" icon="settings">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Status only — change In service on Settings → Device.
            </p>
            <div className="dsc-mode-row">
              <InventoryInServiceToggle seatId="pot1" label="Probe 1" icon="root" readOnly />
              <InventoryInServiceToggle seatId="pot2" label="Probe 2" icon="root" readOnly />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function FleetOverviewPage() {
  const { state, num } = useEntityBus();
  const fleet = useFleet();
  const fleetReady = useFleetLastUpdated() != null;
  const inspector = useInspector();
  const kit: KitNode[] = buildKitNodesFromFleet(fleet);
  const svc = kitInServiceCount(kit);
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
        title="Kit"
        subtitle={`${svc.inService} of ${svc.total} devices in service. Device health, tank, and service toggles.`}
        actions={
          <HelpTip title="Kit pulse">
            <p>
              Fleet is the kit desk — online/offline and In service, not climate Want. Grey quiet means out of service or
              no data, not a silent alarm.
            </p>
            <p>
              Hub link chips (Up/Down/Beat) tell link honesty. Kit probes 1–2 have their In service toggle right below
              on this page; open Settings → Device for Probe 3–4 and other inventory seats.
            </p>
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
            value={fleet.surface || state("sensor.dsc_ha_surface_version", "—")}
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
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit pulse" icon="system">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              Grey = offline or out of service. Every device shows its real state.
            </p>
            {/* Until the first fleet snapshot lands, `kit` is empty and the radial drew
                nothing — about a second of blank that looked like "no devices". */}
            {fleetReady ? <KitPulse nodes={kit} onSelect={openNode} /> : <Skeleton rows={4} label="Waiting for the first fleet snapshot" />}
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit & in service" icon="settings">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Status only — change In service on Settings → Device.
            </p>
            <div className="dsc-mode-row">
              <InventoryInServiceToggle seatId="pot1" label="Probe 1" icon="root" readOnly />
              <InventoryInServiceToggle seatId="pot2" label="Probe 2" icon="root" readOnly />
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
