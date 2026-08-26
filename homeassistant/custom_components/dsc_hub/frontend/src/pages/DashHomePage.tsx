import { useNavigate } from "react-router-dom";
import { Button, Card, Kpi, PageHeader } from "../components/ui";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { HubLinkLine } from "../components/HubLinkLine";
import { KitPulse } from "../components/KitPulse";
import { CfmTrustLine } from "../components/CfmBadge";
import {
  activeAlertIds,
  DashBandsGrid,
  DashCannalibTiles,
  DashConditionalBanners,
  DashEspLinkChips,
  DashFanChips,
  DashGrowLog,
  DashNowStrip,
  DashOperationalNow,
  DashRootTankSection,
  DashRunningChips,
  DashTodaySection,
  fmtUptime,
} from "../components/DashHomeSections";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { useHeldReading, useHubOfflineMs, useBeatOfflineMs, usePanelOfflineMs } from "../hooks/useHeldReading";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { useInspector } from "../components/InspectorHost";
import { BAND_CHART_TITLES, useBandChart, type BandChartKind } from "../components/BandChartHost";
import { resolveCfm } from "../lib/cfmProvenance";
import { buildKitNodesFromFleet, kitInServiceCount, type KitNode } from "../lib/kitInventory";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import type { RosterSlot } from "../lib/seatModel";

function fmtCfm(reading: ReturnType<typeof resolveCfm>): string {
  return Number.isFinite(reading.value) ? `${Math.round(reading.value)} CFM` : "—";
}

function resolveRoomVpdId(entity: (id: string) => unknown): string {
  if (entity("sensor.dsc_hub_room_vpd_kpa")) return "sensor.dsc_hub_room_vpd_kpa";
  if (entity("sensor.dsc_hub_room_vpd")) return "sensor.dsc_hub_room_vpd";
  return "sensor.dsc_hub_room_vpd_kpa";
}

/** React rebuild of Lovelace view_home — full section parity with HA Home dash. */
export function DashHomePage() {
  const bus = useEntityBus();
  const { available, num, state, entity, tick } = bus;
  const fleet = useFleet();
  const navigate = useNavigate();
  const settled = useSettledAvailability();
  const { isSnoozed } = useAlertSnooze();
  const inspector = useInspector();
  const bandChart = useBandChart();

  const openBandChart = (kind: BandChartKind) =>
    bandChart.open({ kind, title: BAND_CHART_TITLES[kind] });
  void tick;
  void useHubOfflineMs();
  void useBeatOfflineMs();
  void usePanelOfflineMs();

  const hubOnline = fleet.hub.online || settled("sensor.dsc_hub_uptime");
  const uptimeSec = num("sensor.dsc_hub_uptime", fleet.hub.values.uptime != null ? Number(fleet.hub.values.uptime) : 0);
  const alerts = num("sensor.dsc_active_alert_count", 0);
  const fleetStatus = state("sensor.dsc_fleet_version_status", "ok");
  const fleetExpected = String(entity("sensor.dsc_fleet_version_status")?.attributes?.expected || fleet.expected_firmware || "7.0.0");
  const cannalibOnline = state("binary_sensor.dsc_cannalib_api_online") === "on";
  const cannalibHits = num("sensor.dsc_cannalib_api_hits", 0);
  const cannalibSummary = state("sensor.dsc_cannalib_bandwidth_summary", "— MB");

  const panelLink = fleet.panel.online ? "on" : state("binary_sensor.dsc_hub_panel_link");
  const panelOk = fleet.panel.online || panelLink === "on";
  const panelSettled = settled("binary_sensor.dsc_hub_panel_link") || panelOk;
  const panelHaOnly = !panelOk && available("sensor.dsc_control_wifi_rssi");
  const panelOffline = !panelOk && !panelHaOnly && !panelSettled;
  const heartbeat =
    fleet.hub.values.heartbeat != null ? String(fleet.hub.values.heartbeat) : state("sensor.dsc_hub_heartbeat", "NO BEAT");
  const beatOk = fleet.hub.online && fleet.hub.values.heartbeat != null ? true : settled("sensor.dsc_hub_heartbeat");

  const tentT = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRh = useHeldReading("sensor.dsc_hub_tent_humidity");
  const tentVpd = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const cloneT = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRh = useHeldReading("sensor.dsc_hub_clone_humidity");
  const cloneVpd = useHeldReading("sensor.dsc_hub_clone_vpd_kpa");
  const roomT = useHeldReading("sensor.dsc_hub_room_temperature");
  const roomRh = useHeldReading("sensor.dsc_hub_room_humidity");
  const roomVpdId = resolveRoomVpdId(entity);
  void useHeldReading(roomVpdId);
  const rootT = useHeldReading("sensor.dsc_coldest_root_zone_temp");

  const targetTemp = num("number.dsc_hub_target_temp", 25);
  const rhMin = num("number.dsc_hub_rh_target_min", 45);
  const rhMax = num("number.dsc_hub_rh_target_max", 70);
  const vpdMin = num("number.dsc_hub_vpd_target_min", 0.8);
  const vpdMax = num("number.dsc_hub_vpd_target_max", 1.4);
  const cloneTargetTemp = num("number.dsc_hub_clone_target_temp", 24);
  const cloneRhMin = num("number.dsc_hub_clone_rh_min", 55);
  const cloneRhMax = num("number.dsc_hub_clone_rh_max", 75);
  const cloneVpdMin = num("number.dsc_hub_clone_vpd_min", 0.6);
  const cloneVpdMax = num("number.dsc_hub_clone_vpd_max", 1.2);
  const matLo = num("number.dsc_hub_mat_root_zone_low", 20);
  const matHi = num("number.dsc_hub_mat_root_zone_high", 24);

  const outCfm = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", { available, num });
  const recircCfm = resolveCfm("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", { available, num });
  const inMain = resolveCfm("sensor.dsc_cfm_intake_main", "sensor.dsc_cfm_intake_main", { available, num });
  const inClone = resolveCfm("sensor.dsc_cfm_intake_2x4", "sensor.dsc_cfm_intake_2x4", { available, num });
  const cfmReadings = [outCfm, recircCfm, inMain, inClone];

  const kitNodes: KitNode[] = buildKitNodesFromFleet(fleet);
  const svc = kitInServiceCount(kitNodes);
  const rosterSlots = (entity("sensor.dsc_plant_roster_summary")?.attributes?.slots || []) as RosterSlot[];
  const rosterLabel = state("sensor.dsc_plant_roster_summary", "—");
  const faultIds = activeAlertIds(state, isSnoozed);

  const openNode = (node: KitNode) =>
    inspector.open({
      entityId: node.entityId,
      label: node.label,
      kind: "kit",
      runtimeToday: node.runtimeToday,
      cyclesToday: node.cyclesToday,
      demandEntity: node.demandEntity,
    });

  const openPot = (n: number) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: n } }));
    navigate("/live/root");
  };

  return (
    <div className="dsc-page dsc-dash-home">
      <PageHeader
        icon="home"
        title="Home"
        subtitle="Everything running right now, at a glance."
        primaryAction={
          <Button teal onClick={() => navigate("/live/twin")}>
            Open Twin
          </Button>
        }
        actions={<Button onClick={() => navigate("/live/climate")}>Climate</Button>}
      />

      <DashNowStrip
        hubOnline={hubOnline}
        panelOk={panelOk}
        panelHaOnly={panelHaOnly}
        panelOffline={panelOffline}
        heartbeat={heartbeat}
        beatOk={beatOk}
        uptimeSec={uptimeSec}
        alerts={alerts}
        fleetStatus={fleetStatus}
        fleetExpected={fleetExpected}
        cannalibOnline={cannalibOnline}
        cannalibHits={cannalibHits}
        cannalibSummary={cannalibSummary}
        inServiceLabel={`${svc.inService} of ${svc.total} in service`}
        activeFaultCount={faultIds.length}
        onChip={(id, label) => inspector.open({ entityId: id, label, kind: id.includes("alert") ? "alert" : "kit" })}
      />

      <DashCannalibTiles bus={bus} />
      <DashConditionalBanners bus={bus} onNavigate={navigate} />
      {faultIds.length > 0 ? (
        <Card className="dsc-glass" title="Active system alerts" icon="alert">
          <ul className="dsc-fault-list">
            {faultIds.map((id) => (
              <li key={id}>
                <Button onClick={() => inspector.open({ entityId: id, label: id, kind: "alert" })}>
                  {id.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ")}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <DashEspLinkChips bus={bus} onNavigate={navigate} />

      <HubLinkLine />

      <Card className="dsc-glass" title="System map" icon="fleet">
        <LegacyCardHost tag="dsc-system-map-card" />
      </Card>

      <DashRunningChips bus={bus} />
      <DashFanChips bus={bus} onNavigate={navigate} />

      <div className="dsc-grid dsc-grid--2">
        <DashGrowLog bus={bus} />
        <details className="dsc-narrator">
          <summary>System narrator</summary>
          <div className="dsc-muted" style={{ fontSize: 13, lineHeight: 1.55, padding: "8px 0" }}>
            <p>
              <strong>Hub:</strong> {hubOnline ? "online" : "offline"} · uptime {fmtUptime(uptimeSec)} · beat {heartbeat}
            </p>
            <p>
              <strong>Climate:</strong> 4×8 {Number.isFinite(tentT.value) ? `${tentT.value.toFixed(1)}°C` : "—"} /{" "}
              {Number.isFinite(tentRh.value) ? `${tentRh.value.toFixed(0)}%` : "—"} RH · 2×4{" "}
              {Number.isFinite(cloneT.value) ? `${cloneT.value.toFixed(1)}°C` : "—"} /{" "}
              {Number.isFinite(cloneRh.value) ? `${cloneRh.value.toFixed(0)}%` : "—"} RH
            </p>
            <p>
              <strong>Airflow:</strong> OUT {Math.round(num("sensor.dsc_fan_exhaust_outside_pct", 0))}% · RECIRC{" "}
              {Math.round(num("sensor.dsc_fan_exhaust_room_pct", 0))}% · intakes{" "}
              {Math.round(num("sensor.dsc_fan_intake_main_pct", 0))}/{Math.round(num("sensor.dsc_fan_intake_2x4_pct", 0))}%
            </p>
            {faultIds.length > 0 ? <p><strong>Watchlist:</strong> {faultIds.length} active alert(s).</p> : null}
          </div>
        </details>
      </div>

      <DashOperationalNow bus={bus} onNavigate={navigate} />

      <DashBandsGrid
        readings={{
          tentT: tentT.value,
          tentRh: tentRh.value,
          tentVpd: tentVpd.value,
          cloneT: cloneT.value,
          cloneRh: cloneRh.value,
          cloneVpd: cloneVpd.value,
          roomT: roomT.value,
          roomRh: roomRh.value,
          rootT: rootT.value,
          targetTemp,
          rhMin,
          rhMax,
          vpdMin,
          vpdMax,
          cloneTargetTemp,
          cloneRhMin,
          cloneRhMax,
          cloneVpdMin,
          cloneVpdMax,
          matLo,
          matHi,
          stale: {
            tentT: tentT.stale,
            tentRh: tentRh.stale,
            tentVpd: tentVpd.stale,
            cloneT: cloneT.stale,
            cloneRh: cloneRh.stale,
            cloneVpd: cloneVpd.stale,
            roomT: roomT.stale,
            roomRh: roomRh.stale,
            rootT: rootT.stale,
          },
        }}
        onChartOpen={openBandChart}
      />

      <Card className="dsc-glass" title="Lung · CFM" icon="climate">
        <CfmTrustLine readings={cfmReadings} />
        <div className="dsc-chip-row">
          <Kpi label="Out alloc" value={fmtCfm(outCfm).replace(" CFM", "")} unit="CFM" />
          <Kpi label="Recirc alloc" value={fmtCfm(recircCfm).replace(" CFM", "")} unit="CFM" />
          <Kpi label="Intake 4×8" value={fmtCfm(inMain).replace(" CFM", "")} unit="CFM" />
          <Kpi label="Intake 2×4" value={fmtCfm(inClone).replace(" CFM", "")} unit="CFM" />
        </div>
        <LegacyCardHost tag="dsc-airflow-map-card" />
      </Card>

      <DashTodaySection bus={bus} />

      <div className="dsc-grid dsc-grid--2">
        <Card className="dsc-glass" title="Plant roster" icon="roster">
          <p className="dsc-muted">{rosterLabel}</p>
          {Array.isArray(rosterSlots) && rosterSlots.length > 0 ? (
            <ul className="dsc-roster-list">
              {rosterSlots.slice(0, 8).map((slot) => (
                <li key={slot.slot}>
                  <strong>{slot.nickname || slot.strain || `Slot ${slot.slot}`}</strong>
                  <span className="dsc-muted">
                    {" "}
                    · {slot.pot && slot.pot !== "none" ? `P${slot.pot}` : "stock"} · {slot.status || "—"}
                    {slot.blend ? ` · ${slot.blend}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dsc-honesty">No occupied roster slots.</p>
          )}
        </Card>
        <Card className="dsc-glass" title="Kit pulse" icon="fleet">
          <KitPulse nodes={kitNodes} onSelect={openNode} />
        </Card>
      </div>

      <DashRootTankSection bus={bus} rosterSlots={rosterSlots} onNavigate={navigate} onPot={openPot} onPotChart={openBandChart} />
    </div>
  );
}
