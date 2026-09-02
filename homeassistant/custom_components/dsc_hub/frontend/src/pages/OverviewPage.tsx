import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import {
  activeAlertIds,
  DashBandsGrid,
  DashConditionalBanners,
  DashFanChips,
  DashGrowLog,
  DashRootTankSection,
  DashRunningChips,
} from "../components/DashHomeSections";
import { TentLightClockStrip } from "../components/TentLightClock";
import { JournalScopePanel } from "../components/journal/JournalScopePanel";
import { BAND_CHART_TITLES, useBandChart, type BandChartKind } from "../components/BandChartHost";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { useHeldReading } from "../hooks/useHeldReading";
import { HelpTip } from "../components/HelpTip";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { alertRoute, playbookFor } from "../lib/alertPlaybook";
import type { RosterSlot } from "../lib/seatModel";
import { fmtUptimeSeconds } from "../lib/formatDuration";

/** Operational overview — critical alerts, area vitals, duties, root strip, grow log. */
export function OverviewPage() {
  const bus = useEntityBus();
  const { num, state, entity, tick } = bus;
  const fleet = useFleet();
  const settled = useSettledAvailability();
  const navigate = useNavigate();
  const { isSnoozed } = useAlertSnooze();
  const bandChart = useBandChart();
  void tick;

  const openBandChart = (kind: BandChartKind) =>
    bandChart.open({ kind, title: BAND_CHART_TITLES[kind] });

  const alerts = num("sensor.dsc_active_alert_count", 0);
  const faultIds = activeAlertIds(state, isSnoozed);

  const tentT = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRh = useHeldReading("sensor.dsc_hub_tent_humidity");
  const tentVpd = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const cloneT = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRh = useHeldReading("sensor.dsc_hub_clone_humidity");
  const cloneVpd = useHeldReading("sensor.dsc_hub_clone_vpd_kpa");
  const roomT = useHeldReading("sensor.dsc_hub_room_temperature");
  const roomRh = useHeldReading("sensor.dsc_hub_room_humidity");
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

  const rosterSlots = (entity("sensor.dsc_plant_roster_summary")?.attributes?.slots || []) as RosterSlot[];

  const hubOnline = fleet.hub.online || settled("sensor.dsc_hub_uptime");
  const uptimeSec = num("sensor.dsc_hub_uptime", Number(fleet.hub.values.uptime) || 0);
  const canopyRole =
    typeof fleet.canopy?.role === "string" ? String(fleet.canopy.role) : null;
  const canopyDevice =
    typeof fleet.canopy?.friendly_name === "string" ? String(fleet.canopy.friendly_name) : null;
  const canopyTemp =
    fleet.canopy?.temp_c != null && Number.isFinite(Number(fleet.canopy.temp_c))
      ? Number(fleet.canopy.temp_c)
      : null;
  const canopyRh =
    fleet.canopy?.rh_pct != null && Number.isFinite(Number(fleet.canopy.rh_pct))
      ? Number(fleet.canopy.rh_pct)
      : null;

  const criticalBanners = Array.isArray(fleet.system?.critical_banners)
    ? (fleet.system.critical_banners as Array<Record<string, unknown>>)
    : [];

  const openPot = (n: number) => {
    // Stay on Overview — SeatOverlayHost opens the seat. Navigating to /live/root without
    // ?pot= drops the selection when the overlay closes (U-09 stay/overlay).
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: n } }));
  };

  return (
    <div className="dsc-page dsc-dash-home">
      <PageHeader
        icon="home"
        title="Overview"
        subtitle="Operational glance — alerts, area vitals, duties, root strip, grow log."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate
          </Button>
        }
        actions={
          <Button onClick={() => navigate("/live/mission")}>Mission</Button>
        }
      />

      <div className="dsc-status-strip">
        <StatusChip
          icon={hubOnline ? "ok" : "alert"}
          label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"}
          tone={hubOnline ? "ok" : "bad"}
          onClick={() => navigate("/fleet")}
        />
        <StatusChip
          label={
            Number.isFinite(uptimeSec) && uptimeSec > 0
              ? `Up ${fmtUptimeSeconds(uptimeSec)}`
              : "Hub uptime"
          }
          tone={hubOnline ? "muted" : "bad"}
        />
        {canopyRole ? (
          <StatusChip
            label={
              canopyTemp != null
                ? `Canopy ${canopyTemp.toFixed(1)}°C${
                    canopyRh != null ? ` / ${canopyRh.toFixed(0)}%` : ""
                  } ← ${canopyRole}${canopyDevice ? ` (${canopyDevice})` : ""}`
                : `Canopy ← ${canopyRole}${canopyDevice ? ` (${canopyDevice})` : ""}`
            }
            tone="ok"
            onClick={() => navigate("/live/climate")}
          />
        ) : (
          <StatusChip
            label="Canopy unbound"
            tone="muted"
            onClick={() => navigate("/settings/device")}
          />
        )}
      </div>

      {criticalBanners.length > 0
        ? criticalBanners.map((b) => {
            const text = String(b.text ?? "").trim();
            if (!text) return null;
            const isCritical = String(b.tone ?? "critical") !== "warn";
            return (
              <div
                key={String(b.id ?? text)}
                className={
                  isCritical ? "dsc-banner dsc-banner--critical-live" : "dsc-banner dsc-banner--warn"
                }
                role="alert"
                aria-live="assertive"
              >
                {text}
              </div>
            );
          })
        : null}

      {faultIds.length > 0 || alerts > 0 ? (
        <div className="dsc-banner dsc-banner--bad" style={{ marginBottom: 12 }}>
          <strong>
            {faultIds.length > 0
              ? `${faultIds.length} critical alert(s) active`
              : `${alerts} system alert(s)`}
          </strong>
          <ul className="dsc-fault-list" style={{ marginTop: 8 }}>
            {faultIds.slice(0, 6).map((id) => {
              const route = alertRoute(id);
              const label = playbookFor(id, "alert").title;
              return (
                <li key={id}>
                  <StatusChip
                    label={label}
                    tone="bad"
                    pulse
                    icon="alert"
                    onClick={() => navigate(route.href)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <DashConditionalBanners bus={bus} onNavigate={navigate} />

      <Card className="dsc-glass" title="Photoperiod" icon="lighting">
        <p className="dsc-muted" style={{ fontSize: 12, margin: "0 0 8px" }}>
          Glance only — same schedule SoT as Light (including Follow 4×8). Edit on the Light desk.
        </p>
        <TentLightClockStrip />
        <div className="dsc-row-actions" style={{ marginTop: 10 }}>
          <Button teal icon="lighting" onClick={() => navigate("/live/light")}>
            Open Light desk
          </Button>
        </div>
      </Card>

      <div className="dsc-grid" style={{ marginTop: 12 }}>
        <div className="dsc-col-6">
          <JournalScopePanel
            scope={{ kind: "room", id: "grow_room" }}
            variant="embedded"
            fetchLimit={10}
            visibleRows={3}
          />
        </div>
        <div className="dsc-col-6">
          <JournalScopePanel scope={{ kind: "core" }} variant="embedded" fetchLimit={10} visibleRows={3} />
        </div>
      </div>

      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <span className="dsc-muted" style={{ fontSize: 12, alignSelf: "center" }}>
          Climate bands
        </span>
        <HelpTip title="Want · Got · Need">
          <p>
            <b>Want</b> is the target. <b>Got</b> is measured. <b>Need</b> is the gap the brain proposes.
          </p>
          <p>Example: Want 55% RH, Got 62% → Need a drier path — not a guessed setpoint rewrite.</p>
        </HelpTip>
        <HelpTip title="Colour honesty">
          <p>Teal/green = in band. Amber = drifting. Red = out of band. Grey = no data or out of service.</p>
          <p>Out of service kit stays quiet on purpose — missing hardware is not an alarm.</p>
        </HelpTip>
      </div>

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

      <Card className="dsc-glass" title="Fan duties" icon="fan">
        <DashFanChips bus={bus} onNavigate={navigate} />
      </Card>

      <DashRunningChips bus={bus} />

      <DashRootTankSection
        bus={bus}
        rosterSlots={rosterSlots}
        onNavigate={navigate}
        onPot={openPot}
        onPotChart={openBandChart}
      />

      <DashGrowLog bus={bus} />

      <p className="dsc-muted" style={{ fontSize: 12, marginTop: 8 }}>
        Fleet {fleet.version} · expected {fleet.expected_firmware}
      </p>
    </div>
  );
}
