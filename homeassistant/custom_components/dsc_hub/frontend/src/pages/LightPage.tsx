import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  EntitySelect,
  EntityTime,
  EntityToggle,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { CropScheduler } from "../components/CropScheduler";
import { DutyStrip } from "../components/DutyStrip";
import { TargetNumber } from "../components/TentTargets";
import { useEntityBus } from "../hooks/useEntityBus";
import { useInspector } from "../components/InspectorHost";
import { ArcGauge } from "../viz/charts";
import { draftTone, tentWantRail } from "../lib/tentWant";
import { fmtDurationMs } from "../lib/formatDuration";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

function nextEventHuman(iso: string, now = Date.now()): string {
  if (!iso || iso === "—" || iso === "unknown" || iso === "unavailable") return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  const delta = t - now;
  const abs = Math.abs(delta);
  const when = fmtDurationMs(abs);
  return delta >= 0 ? `in ${when}` : `${when} ago`;
}

export function LiveLightPage() {
  const { state, num, entity } = useEntityBus();
  const navigate = useNavigate();
  const inspector = useInspector();
  const darkViolation = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const missing = state("binary_sensor.dsc_clone_light_missing_in_window") === "on";
  const catchup = state("binary_sensor.dsc_hub_light_catchup_active") === "on";
  const lightOn = state("light.dsc_hub_sf1000_dimmer") === "on";
  const windowOpen = state("binary_sensor.dsc_hub_4x8_window_open") === "on";
  const window2 = state("binary_sensor.dsc_hub_2x4_window_open") === "on";
  const hours4 = num("sensor.dsc_expected_light_hours");
  const hours2 = num("sensor.dsc_clone_expected_light_hours");
  const got4 = num("sensor.dsc_lights_on_today_4x8");
  const got2 = num("sensor.dsc_lights_on_today_2x4");
  const deviation = num("sensor.dsc_lights_deviation_today");
  const nextIso = state("sensor.dsc_next_light_event", "—");
  const rail4 = tentWantRail("main", { state, entity });
  const rail2 = tentWantRail("clone", { state, entity });
  const minDarkLive = num("number.dsc_hub_min_dark_hours");
  const cloneHoursLive = num("number.dsc_hub_clone_light_hours");
  const [draftDark, setDraftDark] = useState(minDarkLive);
  const [draftCloneHours, setDraftCloneHours] = useState(cloneHoursLive);
  const hoursBand4 =
    rail4.lightHours != null
      ? { min: rail4.lightHours - 0.5, max: rail4.lightHours + 0.5, source: "stage" as const, mixed: rail4.mixed }
      : null;
  const hoursBand2 =
    rail2.lightHours != null
      ? { min: rail2.lightHours - 0.5, max: rail2.lightHours + 0.5, source: "stage" as const, mixed: rail2.mixed }
      : null;
  const darkBand =
    rail4.lightHours != null
      ? {
          min: 24 - rail4.lightHours - 0.5,
          max: 24 - rail4.lightHours + 0.5,
          source: "stage" as const,
          mixed: rail4.mixed,
        }
      : null;
  const impliedHours4 = Number.isFinite(draftDark) ? 24 - draftDark : hours4;
  const hoursDraft4 = draftTone(impliedHours4, hoursBand4);
  const darkDraft = draftTone(Number.isFinite(draftDark) ? draftDark : minDarkLive, darkBand);
  const independent = state("select.dsc_hub_clone_photoperiod") === "Independent";
  const hoursDraft2 = draftTone(
    independent && Number.isFinite(draftCloneHours) ? draftCloneHours : hours2,
    hoursBand2,
  );
  const railTone = (tone: string): "ok" | "warn" | "bad" | "muted" =>
    tone === "critical" ? "bad" : tone === "ok" ? "ok" : tone === "muted" ? "muted" : "warn";
  const heaterOn = state("switch.dsc_hub_heater_demand") === "on";
  const dump = num("sensor.dsc_vent_heat_dump_btu");
  const lightsBuying =
    (lightOn || windowOpen) && (heaterOn || (Number.isFinite(dump) && dump > 0));

  const open = (id: string, label: string, kind?: "alert" | "binary" | "numeric") =>
    inspector.open({ entityId: id, label, kind: kind || "numeric" });

  return (
    <div className="dsc-page">
      <PageHeader
        icon="lighting"
        title="Light"
        subtitle="Photoperiod desk — equal 4×8 / 2×4 cards. 4×8 Got is the window until a GPIO lamp exists."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate Want
          </Button>
        }
      />
      <div className="dsc-status-strip">
        <StatusChip
          icon={darkViolation ? "alert" : "ok"}
          label={darkViolation ? "2×4 DARK VIOLATION" : "Dark period OK"}
          tone={darkViolation ? "bad" : "ok"}
          pulse={darkViolation}
          onClick={() => open("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")}
        />
        {missing ? (
          <StatusChip
            label="Missing in window"
            tone="bad"
            pulse
            onClick={() => open("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")}
          />
        ) : null}
        {catchup ? (
          <StatusChip
            label="Catch-up"
            tone="warn"
            onClick={() => open("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")}
          />
        ) : null}
        <StatusChip
          label={`Next ${nextEventHuman(nextIso)}`}
          tone="muted"
          onClick={() => open("sensor.dsc_next_light_event", "Next light event")}
        />
        {lightsBuying ? (
          <StatusChip label="This window is buying heat" tone="warn" onClick={() => navigate("/live/climate")} />
        ) : null}
      </div>

      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Card className="dsc-glass dsc-light-hero" title="4×8 light" icon="tent">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              4×8 Got is the photoperiod window until a GPIO lamp exists — not a brightness.
            </p>
            <div className="dsc-chip-row">
              <StatusChip
                label={windowOpen ? "WINDOW OPEN" : "DARK"}
                tone={windowOpen ? "ok" : "muted"}
                onClick={() => open("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")}
              />
              <StatusChip
                label={hoursDraft4.label}
                tone={railTone(hoursDraft4.tone)}
                onClick={() => open("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")}
              />
            </div>
            {/* Progress counter, not a live band — teal arc with a target tick, never "out of band" red. */}
            <ArcGauge
              label="Got / Want h"
              value={got4}
              min={0}
              max={24}
              unit="h"
              target={rail4.lightHours ?? hours4}
              onClick={() => open("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")}
            />
            <Kpi label="Want hours" value={fmt(hours4, 0)} unit="h" onClick={() => open("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")} />
            <DutyStrip
              entityId="binary_sensor.dsc_hub_4x8_window_open"
              hours={24}
              label="4×8 window 24h"
              onClick={() => open("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")}
            />
            <div className="dsc-target-grid" style={{ marginTop: 12 }}>
              <EntityTime entityId="time.dsc_hub_lights_on_time" label="4×8 opens" />
              <TargetNumber entityId="number.dsc_hub_sunrise_duration" label="Sunrise min" />
              <TargetNumber entityId="number.dsc_hub_sunset_duration" label="Sunset min" />
              <TargetNumber
                entityId="number.dsc_hub_min_dark_hours"
                label="Min dark h"
                hint={darkDraft.label}
                tone={darkDraft.tone}
                onLive={setDraftDark}
              />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass dsc-light-hero" title="2×4 light" icon="lighting">
            <div className="dsc-chip-row">
              <StatusChip
                label={lightOn ? "SF1000 ON" : "SF1000 OFF"}
                tone={lightOn ? "ok" : "muted"}
                onClick={() => open("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")}
              />
              <StatusChip
                label={window2 ? "WINDOW OPEN" : "DARK"}
                tone={window2 ? "ok" : "muted"}
                onClick={() => open("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")}
              />
              <StatusChip
                label={hoursDraft2.label}
                tone={railTone(hoursDraft2.tone)}
                onClick={() => open("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")}
              />
            </div>
            {/* Progress counter, not a live band — teal arc with a target tick, never "out of band" red. */}
            <ArcGauge
              label="Got / Want h"
              value={got2}
              min={0}
              max={24}
              unit="h"
              target={rail2.lightHours ?? hours2}
              onClick={() => open("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")}
            />
            <Kpi label="Want hours" value={fmt(hours2, 0)} unit="h" onClick={() => open("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")} />
            <DutyStrip
              entityId="light.dsc_hub_sf1000_dimmer"
              hours={24}
              label="SF1000 24h"
              onClick={() => open("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")}
            />
            <div className="dsc-demand-row" style={{ marginTop: 12 }}>
              <EntityToggle entityId="light.dsc_hub_sf1000_dimmer" label="SF1000" icon="lighting" showBrightness />
              <EntityToggle entityId="switch.dsc_hub_auto_photoperiod" label="Auto photoperiod" />
              <EntityToggle entityId="switch.dsc_hub_manual_light_hold" label="Manual light hold" />
            </div>
            <EntitySelect entityId="select.dsc_hub_clone_photoperiod" label="Window source" icon="clone" />
            {independent ? (
              <div className="dsc-target-grid">
                <EntityTime entityId="time.dsc_hub_clone_lights_on_time" label="2×4 lights-on" />
                <TargetNumber
                  entityId="number.dsc_hub_clone_light_hours"
                  label="2×4 hours"
                  hint={hoursDraft2.label}
                  tone={hoursDraft2.tone}
                  onLive={setDraftCloneHours}
                />
              </div>
            ) : (
              <p className="dsc-honesty">
                2×4 follows 4×8 ({state("time.dsc_hub_lights_on_time", "—")}). Switch Window source to Independent
                to unlock start/hours.
              </p>
            )}
          </Card>
        </div>

        <div className="dsc-col-12">
          <Kpi
            label="Deviation today"
            value={fmt(deviation, 2)}
            unit="h"
            sub="Recorded by the hub"
            onClick={() => open("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")}
          />
        </div>

        <div className="dsc-col-12">
          <CropScheduler />
        </div>
      </div>
    </div>
  );
}
