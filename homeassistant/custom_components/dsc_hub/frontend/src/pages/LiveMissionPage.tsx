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
import { useHass } from "../hooks/useHass";
import { useHeldReading, useHubOfflineMs, useBeatOfflineMs, usePanelOfflineMs } from "../hooks/useHeldReading";
import { fmtDurationMs } from "../lib/formatDuration";
import { buildPlantSeat, ALL_POT_NUMBERS, inServiceCount, isPotInService } from "../lib/seatModel";
import { HubLinkLine } from "../components/HubLinkLine";
import { VesselGlyph } from "../components/VesselGlyph";
import { readPotVessel } from "../lib/vesselSpec";
import { readPotTrust } from "../lib/potTrust";
import { resolveCfm } from "../lib/cfmProvenance";
import { CfmProvenanceBadge } from "../components/CfmBadge";
import { KitPulse, type KitNode } from "../components/KitPulse";

const FAULTS: { id: string; label: string }[] = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" },
];

export function LiveMissionPage() {
  const { state, num, available, entity, tick } = useHass();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  void tick;

  const hubOnline = available("sensor.dsc_hub_uptime");
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
  const potM1 = useHeldReading("sensor.dsc_pot1_got_moisture");
  const potM2 = useHeldReading("sensor.dsc_pot2_got_moisture");
  const potM3 = useHeldReading("sensor.dsc_pot3_got_moisture");
  const potM4 = useHeldReading("sensor.dsc_pot4_got_moisture");
  const potMoistureHeld = [potM1, potM2, potM3, potM4];

  const panelLink = state("binary_sensor.dsc_hub_panel_link");
  const panelOk = panelLink === "on";
  const heartbeat = state("sensor.dsc_hub_heartbeat", "NO BEAT");
  const beatOk = available("sensor.dsc_hub_heartbeat");
  const takeover = state("switch.dsc_hub_manual_takeover") === "on";
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const reducedKit = state("binary_sensor.dsc_reduced_kit") === "on";
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");
  const autoDriven = fullAuto && !takeover;
  const fleet = state("sensor.dsc_fleet_version_status", "—");

  const activeFaults = FAULTS.filter((f) => state(f.id) === "on");
  const seats = ALL_POT_NUMBERS.map((n) => buildPlantSeat(n, { state, entity }));
  const svc = inServiceCount(state);
  const outCfm = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const kitHole = (on: boolean, known: boolean): KitNode["status"] => {
    if (!known) return "missing";
    return on ? "ok" : "oos";
  };
  const kitNodes: KitNode[] = [
    { id: "hub", label: "Hub", status: available("binary_sensor.dsc_hub_link") ? (state("binary_sensor.dsc_hub_link") === "on" ? "ok" : "dark") : "missing" },
    {
      id: "ac",
      label: "AC",
      status: kitHole(state("input_boolean.dsc_ac_in_service") === "on", available("input_boolean.dsc_ac_in_service")),
    },
    {
      id: "mister",
      label: "Mister",
      status: kitHole(
        state("input_boolean.dsc_clone_humidifier_in_service") === "on",
        available("input_boolean.dsc_clone_humidifier_in_service"),
      ),
    },
    ...ALL_POT_NUMBERS.map((n) => ({
      id: `pot${n}`,
      label: `Pot ${n}`,
      status: kitHole(isPotInService(n, state), available(`input_boolean.dsc_pot${n}_in_service`)),
    })),
    {
      id: "tank",
      label: "Tank",
      status: kitHole(state("input_boolean.dsc_tank_in_service") === "on", available("input_boolean.dsc_tank_in_service")),
    },
  ];
  const anyHeld = tentT.stale || tentRh.stale || tentVpd.stale || cloneT.stale || cloneRh.stale || cloneVpd.stale;

  return (
    <div className="dsc-page">
      <PageHeader
        icon="mission"
        title="Mission"
        subtitle="Triage glance — Next, faults, seats, lung. Command lives on Climate."
        primaryAction={
          <Button teal onClick={() => navigate("/live/twin")}>
            Open Twin
          </Button>
        }
        actions={
          <>
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
                { id: "main", label: "Main cockpit", onSelect: () => navigate("/live/main") },
                { id: "clone", label: "Clone cockpit", onSelect: () => navigate("/live/clone") },
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
        />
        {!hubOnline ? (
          <StatusChip
            label={`OFF ${offlineMs != null ? fmtDurationMs(offlineMs) : "—"}`}
            tone="bad"
            pulse
          />
        ) : null}
        {anyHeld ? <StatusChip label="HELD VITALS" tone="warn" /> : null}
        <StatusChip label={`${svc.inService} of ${svc.total} in service`} tone={svc.inService === svc.total ? "ok" : "warn"} />
        <StatusChip
          label={
            panelOk
              ? "PANEL ESP-NOW"
              : available("sensor.dsc_control_wifi_rssi")
                ? "PANEL HA-ONLY"
                : "PANEL OFFLINE"
          }
          tone={panelOk ? "ok" : available("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"}
        />
        {!panelOk && !available("sensor.dsc_control_wifi_rssi") ? (
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
        />
        {!beatOk ? (
          <StatusChip label={`BEAT OFF ${beatOfflineMs != null ? fmtDurationMs(beatOfflineMs) : "—"}`} tone="bad" pulse />
        ) : null}
        <StatusChip
          icon={alerts === 0 ? "ok" : "alert"}
          label={alerts === 0 ? "All clear" : `${alerts} alert(s)`}
          tone={alerts === 0 ? "ok" : "bad"}
          pulse={alerts > 0}
        />
        <StatusChip
          label={fleet === "ok" ? "FLEET OK" : fleet === "warn" ? "FLEET WARN" : "FLEET DRIFT"}
          tone={fleet === "ok" ? "ok" : fleet === "warn" ? "warn" : "bad"}
        />
        {fullAuto ? <StatusChip icon="ok" label="FULL AUTO" tone="ok" pulse /> : null}
        {autoDriven ? <StatusChip label="AUTO-DRIVEN" tone="ok" /> : null}
        {takeover ? <StatusChip icon="alert" label="MANUAL TAKEOVER" tone="warn" pulse /> : null}
        {fanOverride ? <StatusChip icon="alert" label="FAN OVERRIDE" tone="warn" pulse /> : null}
        {fullAuto && reducedKit ? (
          <StatusChip icon="alert" label={honesty || "REDUCED KIT"} tone="warn" pulse />
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
            <KitPulse nodes={kitNodes} />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Lung CFM" icon="climate">
            <div className="dsc-chip-row">
              <CfmProvenanceBadge reading={outCfm} />
              <button type="button" className="dsc-chip" onClick={() => navigate("/live/climate")}>
                OUT {Number.isFinite(outCfm.value) ? Math.round(outCfm.value) : "—"} cfm → Climate
              </button>
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant seats" icon="seat">
            <div className="dsc-chip-row">
              {seats.map((s) => {
                const oos = !isPotInService(s.pot, state);
                const trust = readPotTrust(s.pot, state);
                const held = potMoistureHeld[s.pot - 1];
                const glow = !oos && !trust.blockNeedAct && s.need && s.need !== "—" && s.need !== "ok";
                return (
                  <button
                    key={s.pot}
                    type="button"
                    className={`dsc-chip${oos ? "" : " dsc-chip--ok"}${glow ? " dsc-chip--pulse" : ""}`}
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: s.pot } }))
                    }
                    title={oos ? "OOS — no fake Got" : s.need}
                  >
                    <VesselGlyph spec={readPotVessel(s.pot, state, entity)} size={18} />
                    P{s.pot} {s.plantName !== "—" ? s.plantName : "—"} · Got M{" "}
                    {oos ? "—" : held.stale ? `${Number.isFinite(held.value) ? held.value.toFixed(0) : "—"}*` : s.moisture}
                    {oos ? " · OOS" : ` · Need ${s.need}`}
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
                    <StatusChip label={f.label} tone="bad" pulse icon="alert" />
                    <span className="dsc-muted">{f.id}</span>
                  </li>
                ))}
                {alerts > 0 && activeFaults.length === 0 ? (
                  <li>
                    <StatusChip label={`${alerts} system alert(s)`} tone="bad" pulse icon="alert" />
                    <span className="dsc-muted">See Fleet for entity detail</span>
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
            { path: "/live/twin", label: "Twin" },
            { path: "/live/main", label: "Main" },
            { path: "/live/clone", label: "Clone" },
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
