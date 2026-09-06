import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { IconButton, OverflowMenu, SlideDrawer } from "../components/chrome";
import { NextRecommendedCard } from "../components/Honesty";
import { useEntityBus } from "../hooks/useEntityBus";
import { useHeldReading, useHubOfflineMs, useBeatOfflineMs, usePanelOfflineMs } from "../hooks/useHeldReading";
import { fmtDurationMs } from "../lib/formatDuration";
import { buildPlantProbe, KIT_PROBE_NUMBERS, isProbeInService } from "../lib/probeModel";
import { HubLinkLine } from "../components/HubLinkLine";
import { HelpTip } from "../components/HelpTip";
import { VesselGlyph } from "../components/VesselGlyph";
import { readProbeVessel } from "../lib/vesselSpec";
import { readProbeTrust } from "../lib/probeTrust";
import { resolveCfm } from "../lib/cfmProvenance";
import { CfmTrustLine } from "../components/CfmBadge";
import { KitPulse } from "../components/KitPulse";
import { buildKitNodesFromFleet, kitInServiceCount, type KitNode } from "../lib/kitInventory";
import { useFleet } from "../hooks/useFleet";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { useInspector } from "../components/InspectorHost";
import { ALERT_ENTITY_IDS } from "../lib/alertPlaybook";

export function LiveMissionPage() {
  const { state, num, available, entity, tick } = useEntityBus();
  const fleet = useFleet();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const settled = useSettledAvailability();
  const { isSnoozed } = useAlertSnooze();
  const inspector = useInspector();
  void tick;

  const hubOnline = fleet.hub.online || settled("sensor.dsc_hub_uptime");
  const offlineMs = useHubOfflineMs();
  const beatOfflineMs = useBeatOfflineMs();
  const panelOfflineMs = usePanelOfflineMs();
  const alerts = num("sensor.dsc_active_alert_count", 0);

  const tentT = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRh = useHeldReading("sensor.dsc_hub_tent_humidity");
  const tentVpd = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const cloneT = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRh = useHeldReading("sensor.dsc_hub_clone_humidity");
  const cloneVpd = useHeldReading("sensor.dsc_hub_clone_vpd_kpa");
  const probeM1 = useHeldReading("sensor.dsc_probe1_got_moisture");
  const probeM2 = useHeldReading("sensor.dsc_probe2_got_moisture");
  const probeM3 = useHeldReading("sensor.dsc_probe3_got_moisture");
  const probeM4 = useHeldReading("sensor.dsc_probe4_got_moisture");
  const probeMoistureHeld = [probeM1, probeM2, probeM3, probeM4];

  const panelLink = fleet.panel.online ? "on" : state("binary_sensor.dsc_hub_panel_link");
  const panelOk = fleet.panel.online || panelLink === "on";
  const heartbeat = fleet.hub.values.heartbeat != null
    ? String(fleet.hub.values.heartbeat)
    : state("sensor.dsc_hub_heartbeat", "NO BEAT");
  const beatOk =
    fleet.hub.online && fleet.hub.values.heartbeat != null
      ? true
      : settled("sensor.dsc_hub_heartbeat");
  const takeover = state("switch.dsc_hub_manual_takeover") === "on";
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const reducedKit = !!fleet.system.reduced_kit;
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");
  const autoDriven = fullAuto && !takeover;
  const fleetStatus = state("sensor.dsc_fleet_version_status", fleet.expected_firmware || "—");
  const fleetLabel = fleet.version === fleet.expected_firmware ? "ok" : fleetStatus === "warn" ? "warn" : "drift";

  const activeFaults = ALERT_ENTITY_IDS.filter((id) => state(id) === "on" && !isSnoozed(id)).map((id) => ({
    id,
    label: id.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || id,
  }));
  const probes = KIT_PROBE_NUMBERS.map((n) => buildPlantProbe(n, { state, entity }));
  const kitNodes: KitNode[] = buildKitNodesFromFleet(fleet);
  const svc = kitInServiceCount(kitNodes);
  const outCfm = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const panelSettled = settled("binary_sensor.dsc_hub_panel_link") || panelOk;
  const panelHaOnly = !panelOk && available("sensor.dsc_control_wifi_rssi");
  const panelOffline = !panelOk && !panelHaOnly && !panelSettled;
  const anyHeld = tentT.stale || tentRh.stale || tentVpd.stale || cloneT.stale || cloneRh.stale || cloneVpd.stale;
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
        icon="mission"
        title="Mission"
        subtitle="Triage glance — Next, faults, probes, lung. Command lives on Climate."
        primaryAction={
          <Button teal onClick={() => navigate("/live/root")}>
            Open Root
          </Button>
        }
        actions={
          <>
            <HelpTip title="Mission triage">
              <p>
                <b>HELD VITALS</b> are last-known readings while the link is soft. <b>PANEL LIMITED LINK</b> means Wi‑Fi
                RSSI without a full panel link — different from <b>NO BEAT</b>.
              </p>
              <p>
                Example: Hub up + NO BEAT → open Fleet for link chips. Command flips still live on Climate; Mission is
                the triage glance.
              </p>
            </HelpTip>
            <Button primary onClick={() => navigate("/live/climate")}>
              Climate Want
            </Button>
            <IconButton label="Search" icon="search" onClick={() => setSearchOpen(true)} />
            <OverflowMenu
              label="Mission settings"
              items={[
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => navigate("/live/climate"),
                },
                { id: "main", label: "4×8 cockpit", onSelect: () => navigate("/live/4x8") },
                { id: "clone", label: "2×4 cockpit", onSelect: () => navigate("/live/2x4") },
                { id: "fleet", label: "Open Fleet", onSelect: () => navigate("/fleet") },
              ]}
            />
          </>
        }
      />

      <div className="dsc-status-strip">
        <StatusChip
          icon={hubOnline ? "ok" : "alert"}
          label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"}
          tone={hubOnline ? "ok" : "bad"}
          onClick={() =>
            inspector.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })
          }
        />
        {!hubOnline ? (
          <StatusChip
            label={`OFF ${offlineMs != null ? fmtDurationMs(offlineMs) : "—"}`}
            tone="bad"
            pulse
          />
        ) : null}
        {anyHeld ? <StatusChip label="HELD VITALS" tone="warn" /> : null}
        <StatusChip
          label={`${svc.inService} of ${svc.total} in service`}
          tone={svc.dark > 0 ? "bad" : "ok"}
          onClick={() => navigate("/fleet")}
        />
        <StatusChip
          label={panelOk ? "PANEL LINKED" : panelHaOnly ? "PANEL LIMITED LINK" : panelOffline ? "PANEL OFFLINE" : "PANEL…"}
          tone={panelOk ? "ok" : panelHaOnly ? "warn" : "bad"}
          onClick={() =>
            inspector.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })
          }
        />
        {panelOffline ? (
          <StatusChip
            label={`PANEL OFF ${panelOfflineMs != null ? fmtDurationMs(panelOfflineMs) : "—"}`}
            tone="bad"
            pulse
          />
        ) : null}
        <StatusChip
          icon={beatOk ? "ok" : "alert"}
          label={beatOk ? `BEAT ${heartbeat}` : "NO BEAT"}
          tone={beatOk ? "ok" : "bad"}
          onClick={() =>
            inspector.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })
          }
        />
        {!beatOk ? (
          <StatusChip label={`BEAT OFF ${beatOfflineMs != null ? fmtDurationMs(beatOfflineMs) : "—"}`} tone="bad" pulse />
        ) : null}
        <StatusChip
          icon={activeFaults.length === 0 ? "ok" : "alert"}
          label={activeFaults.length === 0 ? "All clear" : `${activeFaults.length} alert(s)`}
          tone={activeFaults.length === 0 ? "ok" : "bad"}
          pulse={activeFaults.length > 0}
          onClick={() => {
            const first = activeFaults[0];
            inspector.open({
              entityId: first?.id || "sensor.dsc_active_alert_count",
              label: first?.label || "Alerts",
              kind: "alert",
            });
          }}
        />
        <StatusChip
          label={fleetLabel === "ok" ? "FLEET OK" : fleetLabel === "warn" ? "FLEET WARN" : "FLEET DRIFT"}
          tone={fleetLabel === "ok" ? "ok" : fleetLabel === "warn" ? "warn" : "bad"}
          onClick={() =>
            inspector.open({
              entityId: "sensor.dsc_fleet_version_status",
              label: `Fleet ${fleet.expected_firmware}`,
              kind: "fleet",
            })
          }
        />
        {fullAuto ? <StatusChip icon="ok" label="FULL AUTO" tone="ok" pulse /> : null}
        {autoDriven ? <StatusChip label="AUTO-DRIVEN" tone="ok" /> : null}
        {takeover ? <StatusChip icon="alert" label="MANUAL TAKEOVER" tone="warn" pulse /> : null}
        {fanOverride ? <StatusChip icon="alert" label="FAN OVERRIDE" tone="warn" pulse /> : null}
        {fullAuto && reducedKit ? (
          <StatusChip
            icon="alert"
            label={honesty || "CAPACITY OFFLINE"}
            tone="warn"
            pulse
            onClick={() =>
              inspector.open({
                entityId: "binary_sensor.dsc_reduced_kit",
                label: "Capacity offline",
                kind: "alert",
              })
            }
          />
        ) : null}
      </div>

      <div className="dsc-grid dsc-mission-modern">
        <div className="dsc-col-12">
          <NextRecommendedCard />
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Hub link" icon="fleet">
            <HubLinkLine />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit pulse" icon="ok">
            <KitPulse nodes={kitNodes} onSelect={openNode} />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Lung CFM" icon="climate">
            <CfmTrustLine readings={[outCfm]} />
            <div className="dsc-chip-row">
              <button type="button" className="dsc-chip" onClick={() => navigate("/live/climate")}>
                OUT {Number.isFinite(outCfm.value) ? Math.round(outCfm.value) : "—"} cfm → Climate
              </button>
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant probes" icon="seat">
            <div className="dsc-chip-row">
              {probes.map((s) => {
                const oos = !isProbeInService(s.probe, state);
                const trust = readProbeTrust(s.probe, state);
                const held = probeMoistureHeld[s.probe - 1];
                const glow = !oos && !trust.blockNeedAct && s.need && s.need !== "—" && s.need !== "ok";
                return (
                  <button
                    key={s.probe}
                    type="button"
                    className={`dsc-chip${oos ? "" : " dsc-chip--ok"}${glow ? " dsc-chip--pulse" : ""}`}
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("dsc-dash-select-probe", { detail: { probe: s.probe } }))
                    }
                    title={oos ? "Out of service — no data" : s.need}
                  >
                    <VesselGlyph spec={readProbeVessel(s.probe, state, entity)} size={18} />
                    P{s.probe} {s.plantName !== "—" ? s.plantName : "—"} · Got M{" "}
                    {oos ? "—" : held.stale ? `${Number.isFinite(held.value) ? held.value.toFixed(0) : "—"}*` : s.moisture}
                    {oos ? " · Out of service" : ` · Need ${s.need}`}
                    {held.stale && !oos ? " · HELD" : ""}
                    {trust.labels.length ? ` · ${trust.labels.join("/")}` : ""}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Faults / alerts" icon="alert">
            {activeFaults.length === 0 && alerts === 0 ? (
              <div className="dsc-empty dsc-empty--ok">No active faults — all clear.</div>
            ) : (
              <ul className="dsc-fault-list">
                {activeFaults.map((f) => (
                  <li key={f.id}>
                    <StatusChip
                      label={f.label}
                      tone="bad"
                      pulse
                      icon="alert"
                      onClick={() => inspector.open({ entityId: f.id, label: f.label, kind: "alert" })}
                    />
                  </li>
                ))}
                {alerts > 0 && activeFaults.length === 0 ? (
                  <li>
                    <StatusChip label={`${alerts} system alert(s)`} tone="bad" pulse icon="alert" />
                    <span className="dsc-muted">See Fleet for details</span>
                  </li>
                ) : null}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <SlideDrawer open={searchOpen} onClose={() => setSearchOpen(false)} title="Quick jump">
        <div className="dsc-chip-row">
          {[
            { path: "/live/climate", label: "Climate" },
            { path: "/live/4x8", label: "4×8" },
            { path: "/live/2x4", label: "2×4" },
            { path: "/live/root", label: "Root" },
            { path: "/live/light", label: "Light" },
            { path: "/grow/compose", label: "Compose" },
            { path: "/fleet", label: "Fleet" },
          ].map((l) => (
            <button
              key={l.path}
              type="button"
              className="dsc-btn teal"
              onClick={() => {
                setSearchOpen(false);
                navigate(l.path);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </SlideDrawer>
    </div>
  );
}
