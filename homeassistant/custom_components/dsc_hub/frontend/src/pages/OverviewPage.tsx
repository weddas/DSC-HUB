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
import { BAND_CHART_TITLES, useBandChart, type BandChartKind } from "../components/BandChartHost";
import { useEntityBus } from "../hooks/useEntityBus";
import { useHeldReading } from "../hooks/useHeldReading";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { alertRoute, playbookFor } from "../lib/alertPlaybook";
import type { RosterSlot } from "../lib/seatModel";

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

  const openPot = (n: number) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: n } }));
    navigate("/live/root");
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
          label={Number.isFinite(uptimeSec) && uptimeSec > 0 ? `Up ${Math.round(uptimeSec / 3600)}h` : "Hub uptime"}
          tone={hubOnline ? "muted" : "bad"}
        />
      </div>

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
        <TentLightClockStrip />
        <div className="dsc-row-actions" style={{ marginTop: 10 }}>
          <Button teal icon="lighting" onClick={() => navigate("/live/light")}>
            Open Light desk
          </Button>
        </div>
      </Card>

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
