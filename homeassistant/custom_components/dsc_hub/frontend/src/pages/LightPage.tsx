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
import { CropScheduler, tentStageRailLabel } from "../components/CropScheduler";
import { DutyStrip } from "../components/DutyStrip";
import { PhotoperiodTimeline } from "../components/PhotoperiodTimeline";
import { TentLightClock } from "../components/TentLightClock";
import { TargetNumber } from "../components/TentTargets";
import { useEntityBus } from "../hooks/useEntityBus";
import { useInspector } from "../components/InspectorHost";
import { HelpTip } from "../components/HelpTip";
import { ArcGauge } from "../viz/charts";
import { draftTone, tentWantRail } from "../lib/tentWant";
import { readTentPhotoperiodInput } from "../lib/lightSchedule";
import { dliFromPpfdHours, fmtDli, readCalibratedPpfd } from "../lib/dliEstimate";
import { buildCloneLightDesk } from "../lib/lightViewModel";
import { LightEnergyPanel } from "../components/energy/LightEnergyPanel";
import { TentOccupancyJournal } from "../components/journal/TentOccupancyJournal";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

function railTone(tone: string): "ok" | "warn" | "bad" | "muted" {
  if (tone === "critical") return "bad";
  if (tone === "ok") return "ok";
  if (tone === "muted") return "muted";
  return "warn";
}

export function LiveLightPage() {
  const { state, num, entity, available } = useEntityBus();
  const navigate = useNavigate();
  const inspector = useInspector();
  const darkViolation = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const missing = state("binary_sensor.dsc_clone_light_missing_in_window") === "on";
  const catchup = state("binary_sensor.dsc_hub_light_catchup_active") === "on";
  const cloneDesk = buildCloneLightDesk({ state, num, entity });
  const lightOn = cloneDesk.sfOn;
  const windowOpen = state("binary_sensor.dsc_hub_4x8_window_open") === "on";
  const twinEntity = "light.dsc_hub_twin_sf1000";
  const twinAvailable = available(twinEntity);
  const twinOn = twinAvailable && state(twinEntity) === "on";
  const mainLit = twinAvailable ? twinOn : windowOpen;
  const hours4 = num("sensor.dsc_expected_light_hours");
  const hours2 = cloneDesk.wantHours ?? num("sensor.dsc_clone_expected_light_hours");
  const got4 = num("sensor.dsc_lights_on_today_4x8");
  const got2 = cloneDesk.gotHours ?? num("sensor.dsc_lights_on_today_2x4");
  const deviation = cloneDesk.deviationHours ?? num("sensor.dsc_lights_deviation_today");
  const rail4 = tentWantRail("main", { state, entity });
  const rail2 = tentWantRail("clone", { state, entity });
  const minDarkLive = num("number.dsc_hub_min_dark_hours");
  const cloneHoursLive = num("number.dsc_hub_clone_light_hours");
  const [draftDark, setDraftDark] = useState(minDarkLive);
  const [draftCloneHours, setDraftCloneHours] = useState(cloneHoursLive);
  const followsMain = cloneDesk.followsMain;
  const independent = !followsMain;
  const cloneClimateMode = state("select.dsc_hub_clone_mode", "—");
  const mainOnTime = state("time.dsc_hub_lights_on_time", "—");
  const mainScheduleInput = readTentPhotoperiodInput("main", state, num);
  const mainScheduleMissing = !mainScheduleInput.lightsOnTime || mainOnTime === "—" || mainOnTime === "unknown";
  const manualHold = cloneDesk.manualHold;
  const autoPhoto = cloneDesk.autoPhotoperiod;
  const ppfd = readCalibratedPpfd(num, entity);
  const dli4 = dliFromPpfdHours(ppfd ?? NaN, rail4.lightHours ?? hours4);
  const dli2 = dliFromPpfdHours(ppfd ?? NaN, rail2.lightHours ?? hours2);
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
  const hoursDraft4 = draftTone(impliedHours4, hoursBand4, false, rail4);
  const darkDraft = draftTone(Number.isFinite(draftDark) ? draftDark : minDarkLive, darkBand, false, rail4);
  const hoursDraft2 = draftTone(
    independent && Number.isFinite(draftCloneHours) ? draftCloneHours : hours2,
    hoursBand2,
    false,
    rail2,
  );
  const heaterOn = state("switch.dsc_hub_heater_demand") === "on";
  const dump = num("sensor.dsc_vent_heat_dump_btu");
  const lightsBuying =
    (lightOn || mainLit) && (heaterOn || (Number.isFinite(dump) && dump > 0));

  const open = (id: string, label: string, kind?: "alert" | "binary" | "numeric") =>
    inspector.open({ entityId: id, label, kind: kind || "numeric" });

  return (
    <div className="dsc-page">
      <PageHeader
        icon="lighting"
        title="Light"
        subtitle="Separate 4×8 and 2×4 desks — each tent has its own schedule and clocks."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate Want
          </Button>
        }
      />
      <div className="dsc-status-strip">
        <HelpTip title="Photoperiod Want">
          <p>
            Each tent keeps its own on-window and dark floor. Stage rails tint the hour drafts — amber means the draft
            fights the crop stage, not that the lamp failed.
          </p>
          <p>
            Example: flower Want 12/12 → set min dark near 12h; a 18h clone draft on the 4×8 rail should look wrong on
            purpose.
          </p>
        </HelpTip>
        {darkViolation ? (
          <StatusChip
            icon="alert"
            label="2×4 DARK VIOLATION"
            tone="bad"
            pulse
            onClick={() => open("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")}
          />
        ) : (
          <StatusChip icon="ok" label="Dark period OK" tone="ok" />
        )}
        {missing ? (
          <StatusChip
            icon="alert"
            label="2×4 missing in window"
            tone="bad"
            pulse
            onClick={() => open("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")}
          />
        ) : null}
        {catchup ? (
          <StatusChip
            icon="lighting"
            motion="breathe"
            label="Catch-up active"
            tone="warn"
            onClick={() => open("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")}
          />
        ) : null}
        {lightsBuying ? (
          <StatusChip icon="climate" motion="breathe" label="Lit window buying heat" tone="warn" onClick={() => navigate("/live/climate")} />
        ) : null}
      </div>

      {mainScheduleMissing ? (
        <div className="dsc-banner dsc-banner--warn" style={{ marginBottom: 12 }}>
          <strong>4×8 lights-on time is not set — both tent schedules are dead until you set it.</strong>
          <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
            Set <strong>Lights on</strong> on the 4×8 card below. 2×4 can mirror that window or run independent hours.
          </p>
        </div>
      ) : null}

      {(manualHold || !autoPhoto) && (darkViolation || catchup || missing) ? (
        <div className="dsc-banner dsc-banner--warn" style={{ marginBottom: 12 }}>
          <strong>Manual photoperiod override active</strong>
          <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
            {manualHold ? "Manual light hold is on. " : ""}
            {!autoPhoto ? "Auto photoperiod is off. " : ""}
            Catch-up and dark alerts may reflect operator intent — confirm before clearing holds.
          </p>
        </div>
      ) : null}

      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Card className="dsc-glass dsc-light-hero dsc-tent-card dsc-tent-card--main" title="4×8 photoperiod" icon="tent">
            <TentLightClock tent="main" />
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              {twinAvailable
                ? "Main tent — Twin SF1000 (GPIO5) is the live lamp when available; window remains photoperiod SoT for Got hours."
                : "Main tent schedule — Got tracks the photoperiod window until a GPIO lamp exists."}
            </p>
            <div className="dsc-chip-row">
              {twinAvailable ? (
                <StatusChip
                  icon="lighting"
                  motion={twinOn ? "glow" : undefined}
                  label={twinOn ? "TWIN SF1000 ON" : "TWIN SF1000 OFF"}
                  tone={twinOn ? "ok" : "muted"}
                  onClick={() => open(twinEntity, "Twin SF1000", "binary")}
                />
              ) : null}
              <StatusChip
                icon="tent"
                motion={windowOpen ? "glow" : undefined}
                label={windowOpen ? "WINDOW OPEN" : "DARK"}
                tone={windowOpen ? "ok" : "muted"}
                onClick={() => open("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")}
              />
              <StatusChip
                icon="lighting"
                label={hoursDraft4.label}
                tone={railTone(hoursDraft4.tone)}
                onClick={() => open("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")}
              />
              <StatusChip icon="roster" label={tentStageRailLabel(rail4, "main")} tone={rail4.mixed ? "warn" : "muted"} />
            </div>
            <ArcGauge
              label="Got / Want h"
              value={got4}
              min={0}
              max={24}
              unit="h"
              target={rail4.lightHours ?? hours4}
              progress
              onClick={() => open("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")}
            />
            <Kpi
              label="Want hours"
              value={fmt(hours4, 0)}
              unit="h"
              icon="lighting"
              onClick={() => open("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")}
            />
            <PhotoperiodTimeline
              tent="main"
              onClick={() => open("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")}
            />
            <DutyStrip
              entityId="binary_sensor.dsc_hub_4x8_window_open"
              hours={24}
              label="4×8 24h"
              actualWhenHistory
              onClick={() => open("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")}
            />
            {twinAvailable ? (
              <div className="dsc-chip-row" style={{ marginTop: 10 }}>
                <EntityToggle entityId={twinEntity} label="Twin SF1000" />
              </div>
            ) : null}
            <div className="dsc-target-grid" style={{ marginTop: 12 }}>
              <EntityTime
                entityId="time.dsc_hub_lights_on_time"
                label="Lights on"
                hint={mainScheduleMissing ? "Required — schedules empty without this" : undefined}
              />
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
            {ppfd != null ? (
              <Kpi
                label="DLI estimate"
                value={fmtDli(dli4)}
                unit="mol/m²/d"
                sub={ppfd ? `@ ${Math.round(ppfd)} PPFD · ${fmt(hours4, 0)}h window` : "Calibrate PPFD on Fleet"}
                icon="analytics"
                onClick={() => open("input_number.dsc_cal_ppfd_100", "Calibrated PPFD", "numeric")}
              />
            ) : (
              <p className="dsc-muted" style={{ fontSize: 12, marginBottom: 0 }}>
                DLI estimate needs SF1000 PPFD calibration — Fleet → Calibrate.
              </p>
            )}
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass dsc-light-hero dsc-tent-card dsc-tent-card--clone" title="2×4 photoperiod" icon="lighting">
            <TentLightClock tent="clone" />
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              Clone tent — SF1000 is the live lamp. <strong>Schedule follow</strong> is below; climate follow is on the
              Climate desk ({cloneClimateMode}).
            </p>
            <div className="dsc-chip-row">
              <StatusChip icon="clone" label={`Climate · ${cloneClimateMode}`} tone="muted" onClick={() => navigate("/live/climate")} />
              <StatusChip
                icon="lighting"
                label={followsMain ? "Schedule · Follow 4×8" : "Schedule · Independent"}
                tone={followsMain ? "ok" : "warn"}
              />
            </div>
            <div className="dsc-chip-row">
              <StatusChip
                icon="lighting"
                motion={lightOn ? "glow" : undefined}
                label={cloneDesk.headerLabel}
                tone={lightOn ? "ok" : "muted"}
                onClick={() => open("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")}
              />
              <StatusChip
                icon="lighting"
                label={hoursDraft2.label}
                tone={railTone(hoursDraft2.tone)}
                onClick={() => open("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")}
              />
              <StatusChip icon="roster" label={tentStageRailLabel(rail2, "clone")} tone={rail2.mixed ? "warn" : "muted"} />
            </div>
            <ArcGauge
              label="Got / Want h"
              value={got2}
              min={0}
              max={24}
              unit="h"
              target={rail2.lightHours ?? hours2}
              progress
              onClick={() => open("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")}
            />
            <Kpi
              label="Want hours"
              value={fmt(hours2, 0)}
              unit="h"
              icon="lighting"
              onClick={() => open("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")}
            />
            <Kpi
              label="Deviation today"
              value={fmt(deviation, 2)}
              unit="h"
              sub="2×4 only"
              icon="analytics"
              onClick={() => open("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")}
            />
            <PhotoperiodTimeline
              tent="clone"
              scheduleValid={cloneDesk.scheduleValid}
              onClick={() => open("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")}
            />
            <DutyStrip
              entityId="light.dsc_hub_sf1000_dimmer"
              hours={24}
              label="SF1000 24h"
              actualWhenHistory
              onClick={() => open("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")}
            />
            <div className="dsc-demand-row" style={{ marginTop: 12 }}>
              <EntityToggle
                confirm={{
                  title: lightOn ? "Turn off SF1000" : "Turn on SF1000",
                  body: "Manual lamp control during dark period can stress clones. Confirm only if you mean it.",
                  confirmLabel: lightOn ? "Turn off" : "Turn on",
                }}
                entityId="light.dsc_hub_sf1000_dimmer"
                label="SF1000"
                icon="lighting"
                showBrightness
              />
              <EntityToggle confirm entityId="switch.dsc_hub_auto_photoperiod" label="Auto photoperiod" icon="lighting" />
              <EntityToggle confirm entityId="switch.dsc_hub_manual_light_hold" label="Manual light hold" icon="settings" />
            </div>
            <EntitySelect entityId="select.dsc_hub_clone_photoperiod" label="Schedule source" icon="clone" />
            {followsMain ? (
              <div className="dsc-tent-follow-banner">
                <StatusChip icon="tent" label="Schedule follows 4×8" tone="ok" />
                <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
                  Opens at <strong>{mainOnTime}</strong> · <strong>{fmt(hours2, 0)} h</strong> window (mirrored from
                  4×8). Edit the 4×8 card to change timing, or switch Schedule source to Independent.
                </p>
                <Button onClick={() => navigate("/live/climate")} style={{ marginTop: 8 }}>
                  Climate mode ({cloneClimateMode}) →
                </Button>
              </div>
            ) : (
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
            )}
            {ppfd != null ? (
              <Kpi
                label="DLI estimate (2×4)"
                value={fmtDli(dli2)}
                unit="mol/m²/d"
                sub={`@ ${Math.round(ppfd)} PPFD · SF1000`}
                icon="analytics"
              />
            ) : null}
            {independent ? (
              <p className="dsc-muted" style={{ fontSize: 12, marginBottom: 0 }}>
                Independent — 2×4 schedule does not track 4×8.
              </p>
            ) : null}
          </Card>
        </div>

        <div className="dsc-col-12">
          <CropScheduler />
        </div>

        <div className="dsc-col-6">
          <LightEnergyPanel
            spaceId="4x8"
            lightsOn={mainOnTime !== "—" && mainOnTime !== "unknown" ? mainOnTime : ""}
            wantHours={Number.isFinite(hours4) ? hours4 : 12}
          />
        </div>
        <div className="dsc-col-6">
          <LightEnergyPanel
            spaceId="2x4"
            lightsOn={
              independent
                ? state("time.dsc_hub_clone_lights_on_time", "")
                : mainOnTime !== "—" && mainOnTime !== "unknown"
                  ? mainOnTime
                  : ""
            }
            wantHours={Number.isFinite(hours2) ? hours2 : 18}
          />
        </div>
        <div className="dsc-col-6">
          <TentOccupancyJournal spaceId="4x8" />
        </div>
        <div className="dsc-col-6">
          <TentOccupancyJournal spaceId="2x4" />
        </div>
      </div>
    </div>
  );
}
