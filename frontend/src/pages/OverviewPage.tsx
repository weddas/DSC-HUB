import { useNavigate } from "react-router-dom";
import { StatusTag } from "../components/ui";
import { Panel } from "../components/Panel";
import { ZoneCard } from "../components/ZoneCard";
import { DutyBars } from "../components/DutyBars";
import { TwoClocks } from "../components/TwoClocks";
import { MissionLine, buildMissionStory } from "../components/MissionLine";
import { GrowLogCompact, useRecentGrowLog } from "../components/GrowLogCompact";
import { BAND_CHART_TITLES, useBandChart, type BandChartKind } from "../components/BandChartHost";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { useZones } from "../hooks/useZones";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { activeAlertIds, playbookFor } from "../lib/alertPlaybook";
import { growLogSeverity } from "../lib/growLogFilter";
import { fmtUptimeSeconds } from "../lib/formatDuration";
import { scaleRung } from "../lib/scaleLadder";
import { fmtReading } from "../components/Triad";
import { paths } from "../lib/paths";

/**
 * Overview — frame 2a: one room breathes for every tent.
 * Mission line → room lung panel wrapping the tents (triad each) → duties · two clocks · grow log.
 * Journals live on Logs. Every value is live, held (labelled), or derived (labelled).
 */
export function OverviewPage() {
  const bus = useEntityBus();
  const { state, num } = bus;
  const fleet = useFleet();
  const settled = useSettledAvailability();
  const navigate = useNavigate();
  const { isSnoozed } = useAlertSnooze();
  const bandChart = useBandChart();
  const zones = useZones();
  const log = useRecentGrowLog(24, 60);

  const openChart = (kind: BandChartKind) => bandChart.open({ kind, title: BAND_CHART_TITLES[kind] });

  const faultIds = activeAlertIds(state, isSnoozed);
  const alertCount = num("sensor.dsc_active_alert_count", 0);
  const criticalBanners = (Array.isArray(fleet.system?.critical_banners)
    ? (fleet.system.critical_banners as Array<Record<string, unknown>>)
    : []
  )
    .map((b) => String(b.text ?? "").trim())
    .filter(Boolean);
  const recentAlert = log.events.find((ev) => growLogSeverity(ev.message) === "alert") ?? null;
  const story = buildMissionStory({
    criticalBanners,
    activeAlertTitles: faultIds.map((id) => playbookFor(id, "alert").title),
    recentAlert,
  });

  const hubOnline = fleet.hub.online || settled("sensor.dsc_hub_uptime");
  const uptimeSec = num("sensor.dsc_hub_uptime", Number(fleet.hub.values.uptime) || 0);
  const beat = state("sensor.dsc_hub_heartbeat", "");
  const beatOk = hubOnline && beat !== "" && beat !== "unavailable" && beat !== "unknown";
  const heldZones = [zones.main, zones.clone, zones.room].filter(
    (z) => z.temp.stale || z.rh.stale || z.vpd.stale,
  );

  const canopyRole = typeof fleet.canopy?.role === "string" ? String(fleet.canopy.role) : null;
  const canopyUpdatedAt = Number(fleet.canopy?.updated_at);
  const canopyStale =
    Boolean(canopyRole) && Number.isFinite(canopyUpdatedAt) && Date.now() / 1000 - canopyUpdatedAt > 600;

  const rung = scaleRung(2);
  void rung; // two grow zones → the tents rung; compact/strip rungs land with Pass C.

  const room = zones.room;
  const roomLegend = [
    "ROOM · UMBRELLA LUNG",
    room.temp.available ? `${fmtReading(room.temp)} °C` : "T —",
    room.rh.available ? `${fmtReading(room.rh)} %` : "RH —",
    room.vpd.available ? `${fmtReading(room.vpd)} kPa${room.vpd.derived ? "*" : ""}` : "VPD —",
  ].join(" · ");

  return (
    <div className="dsc-page dsc-overview">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Live · Overview</div>
          <h1 className="dsc-headline">One room breathes for every tent.</h1>
          <p className="dsc-subline">This rig runs two. Tents and rooms are unlimited.</p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag
            label={beatOk ? `BEAT #${beat}` : hubOnline ? "NO BEAT" : "HUB OFFLINE"}
            tone={beatOk ? "ok" : "bad"}
            live={!beatOk}
            onClick={() => navigate(paths.kit())}
            title="Hub heartbeat — open Kit"
          />
          <StatusTag
            label={Number.isFinite(uptimeSec) && uptimeSec > 0 ? `UP ${fmtUptimeSeconds(uptimeSec)}` : "UPTIME —"}
            tone={hubOnline ? "muted" : "bad"}
          />
          {heldZones.map((z) => (
            <StatusTag key={z.id} label={`${z.label} HELD`} tone="warn" title="A reading in this zone is held at its last good value" />
          ))}
          {canopyRole ? (
            <StatusTag
              label={`CANOPY ← ${canopyRole}${canopyStale ? " · STALE" : ""}`}
              tone={canopyStale ? "warn" : "ok"}
              onClick={() => navigate(paths.climate())}
            />
          ) : (
            <StatusTag label="CANOPY UNBOUND" tone="muted" onClick={() => navigate(paths.settings("device"))} />
          )}
          {alertCount > 0 || faultIds.length > 0 ? (
            <StatusTag
              label={`${Math.max(alertCount, faultIds.length)} CRITICAL`}
              tone="bad"
              live
              onClick={() => navigate(paths.alerts())}
            />
          ) : null}
        </div>
      </header>

      <MissionLine story={story} />

      <Panel
        tone="teal"
        legendIcon="room"
        legend={roomLegend}
        legendRight={room.vpd.derived ? "* VPD FROM T + RH" : undefined}
        className="dsc-room-panel"
      >
        <div className="dsc-room-grid">
          <ZoneCard zone={zones.main} onChart={openChart} />
          <ZoneCard zone={zones.clone} onChart={openChart} />
        </div>
      </Panel>

      <div className="dsc-ov-row">
        <Panel legendIcon="airflow" legend="FAN DUTIES · THE LUNG, IN PERCENTAGES">
          <DutyBars />
        </Panel>
        <Panel legendIcon="light-schedule" legend="TWO DESKS, TWO CLOCKS">
          <TwoClocks />
        </Panel>
        <Panel legendIcon="journal" legend="GROW LOG">
          <GrowLogCompact events={log.events} loading={log.loading} />
        </Panel>
      </div>

      <p className="dsc-panel-foot dsc-ov-foot">
        Fleet {fleet.version} · expected {fleet.expected_firmware}
      </p>
    </div>
  );
}
