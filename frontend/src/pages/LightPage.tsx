import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  EntitySelect,
  EntityTime,
  EntityToggle,
  Kpi,
  StatusTag,
} from "../components/ui";
import { Panel } from "../components/Panel";
import { TentClock } from "../components/TwoClocks";
import { getSpaces, type SpaceDevice } from "../lib/fleetApi";
import { paths } from "../lib/paths";
import { CropScheduler, tentStageRailLabel } from "../components/CropScheduler";
import { DutyStrip } from "../components/DutyStrip";
import { PhotoperiodTimeline } from "../components/PhotoperiodTimeline";
import { TargetNumber } from "../components/TentTargets";
import { useEntityBus } from "../hooks/useEntityBus";
import { projectCatchup, fmtHours, holdReleaseWarning } from "../lib/lightCatchup";
import { fmtDurationMs } from "../lib/formatDuration";
import { useTentLightSchedule } from "../hooks/useTentLightSchedule";
import { useInspector } from "../components/InspectorHost";
import { ArcGauge } from "../viz/charts";
import { draftTone, tentWantRail } from "../lib/tentWant";
import { readTentPhotoperiodInput } from "../lib/lightSchedule";
import { dliFromPpfdHours, fmtDli, readCalibratedPpfd } from "../lib/dliEstimate";
import { buildCloneLightDesk } from "../lib/lightViewModel";
import { LightEnergyPanel } from "../components/energy/LightEnergyPanel";
import { JournalScopePanel } from "../components/journal/JournalScopePanel";
import { PpfdMapCard } from "../components/PpfdMapCard";
import { catalogIdForDevice } from "../lib/lightCatalog";

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
  // Catch-up projection. The debt is the hub's own (sensor.dsc_hub_light_debt_hours), NOT
  // the deviation shown lower down — deviation is elapsed-vs-expected and does not steer
  // catch-up, so projecting an end time from it would put a confident wrong time on screen.
  const cloneSchedule = useTentLightSchedule("clone");
  const catchupPlan = catchup
    ? projectCatchup({
        debtH: num("sensor.dsc_hub_light_debt_hours"),
        darkRemainingH: cloneSchedule.untilOnMs != null ? cloneSchedule.untilOnMs / 3_600_000 : null,
        minDarkH: num("number.dsc_hub_min_dark_hours"),
      })
    : null;
  // The cancel lives in hub firmware (it forgives this cycle's debt). Until the hub is
  // flashed the entity does not exist — render the affordance as an honest "possible with"
  // row rather than a dead button, the same convention the INVENTED settings rows use.
  const cancelEntity = "switch.dsc_hub_light_catchup_cancel";
  const canCancelCatchup = available(cancelEntity);
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
  const got4Source = String(entity("sensor.dsc_lights_on_today_4x8")?.attributes?.got_source ?? "");
  const got4Honesty = String(entity("sensor.dsc_lights_on_today_4x8")?.attributes?.honesty ?? "");
  const duty4Entity = twinAvailable ? twinEntity : "binary_sensor.dsc_hub_4x8_window_open";
  const duty4Label = twinAvailable ? "Twin SF1000 24h" : "4×8 window 24h";
  // 2×4 Got is window photoperiod SoT — Actual strip follows Got, not lamp-only hours.
  const duty2Entity = "binary_sensor.dsc_hub_2x4_window_open";
  const duty2Label = "2×4 window 24h";
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
  // Was sensor.dsc_vent_heat_dump_btu, which nothing ever produced — the tag could only ever
  // fire on heaterOn. Lung transfer is measured, so the "buying heat" half is now real.
  const transferBtu = num("sensor.dsc_vent_heat_transfer_btu");
  const lightsBuying =
    (lightOn || mainLit) && (heaterOn || (Number.isFinite(transferBtu) && transferBtu > 0));

  const open = (id: string, label: string, kind?: "alert" | "binary" | "numeric") =>
    inspector.open({ entityId: id, label, kind: kind || "numeric" });

  // Fixtures per space — the brain's nameplate/duty table (Settings › Brain edits it).
  const [fixtures, setFixtures] = useState<Array<{ space_id: string; devices: SpaceDevice[] }> | null>(null);
  useEffect(() => {
    let cancelled = false;
    getSpaces()
      .then((sp) => {
        if (!cancelled) setFixtures(sp.map((x) => ({ space_id: x.space_id, devices: x.devices })));
      })
      .catch(() => {
        if (!cancelled) setFixtures([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  // SF1000 calibration curve — the only PPFD the kit can honestly claim.
  const calSteps = [25, 50, 75, 100].map((step) => ({ step, ppfd: num(`input_number.dsc_cal_ppfd_${step}`, NaN) }));
  const calibrated = calSteps.some((c) => Number.isFinite(c.ppfd) && c.ppfd > 0);
  const tone4 = mainScheduleMissing ? "warn" : mainLit ? "ok" : "muted";
  const tone2 = darkViolation || missing ? "bad" : lightOn ? "ok" : "muted";

  return (
    <div className="dsc-page">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Live · Light</div>
          <h1 className="dsc-headline">Two desks, two clocks.</h1>
          <p className="dsc-subline">Each tent keeps its own window and dark floor. The 2×4 follows the 4×8 unless set independent.</p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag
            label={darkViolation ? "2×4 DARK PERIOD BROKEN" : "DARK PERIOD OK"}
            tone={darkViolation ? "bad" : "ok"}
            live={darkViolation}
            onClick={() => open("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")}
          />
          {missing ? (
            <StatusTag label="2×4 MISSING IN WINDOW" tone="bad" live onClick={() => open("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")} />
          ) : null}
          {catchup ? <StatusTag icon="stopwatch" label="CATCH-UP ACTIVE" tone="warn" onClick={() => open("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")} /> : null}
          <StatusTag label={autoPhoto ? "AUTO PHOTOPERIOD ON" : "AUTO PHOTOPERIOD OFF"} tone={autoPhoto ? "ok" : "warn"} onClick={() => open("switch.dsc_hub_auto_photoperiod", "Auto photoperiod", "binary")} />
          {manualHold ? <StatusTag icon="pause-hold" label="MANUAL HOLD ON" tone="warn" onClick={() => open("switch.dsc_hub_manual_light_hold", "Manual light hold", "binary")} /> : null}
          {lightsBuying ? <StatusTag label="LIT WINDOW BUYING HEAT" tone="warn" onClick={() => navigate(paths.climate())} title="The lamp is on while heat is being bought or dumped — see Climate" /> : null}
        </div>
      </header>

      {mainScheduleMissing ? (
        <div className="dsc-mission dsc-mission--bad" role="alert">
          <span className="dsc-mission-dot" aria-hidden="true" />
          <span className="dsc-mission-title">4×8 lights-on time is not set</span>
          <span className="dsc-mission-detail">— both tent schedules are dead until you set it. Set Lights on below; the 2×4 mirrors that window or runs independent hours.</span>
        </div>
      ) : null}

      {(manualHold || !autoPhoto) && (darkViolation || catchup || missing) ? (
        <div className="dsc-mission dsc-mission--warn" role="status">
          <span className="dsc-mission-dot" aria-hidden="true" />
          <span className="dsc-mission-title">Manual photoperiod override active</span>
          <span className="dsc-mission-detail">
            — {manualHold ? "manual light hold is on. " : ""}{!autoPhoto ? "auto photoperiod is off. " : ""}Catch-up and dark alerts may reflect operator intent; confirm before clearing holds.
            {/* The concrete consequence, not "confirm before clearing". Releasing a hold
                while catch-up wants the lamp does not leave it where it is — the firmware
                self-heals the hold only when want_on goes false, and during catch-up it is
                true, so the fixture is driven straight to target. */}
            {manualHold && catchupPlan ? (
              <strong className="dsc-light-holdwarn"> {holdReleaseWarning(catchupPlan)}</strong>
            ) : null}
          </span>
        </div>
      ) : null}

      {/* Catch-up, said out loud: what it is doing, when it is expected to stop, what the
          next scheduled change is, and how to call it off. Previously the only signal was a
          CATCH-UP ACTIVE tag, and the clock chip counted the NOMINAL window — which reads
          OFF IN while the lamp is going to keep running past it. */}
      {catchupPlan ? (
        <div className="dsc-mission dsc-mission--warn dsc-catchup" role="status">
          <span className="dsc-mission-dot" aria-hidden="true" />
          <div className="dsc-catchup-body">
            <div className="dsc-mission-title">
              Catch-up is repaying {fmtHours(catchupPlan.debtH)} of light
            </div>
            <div className="dsc-mission-detail">
              {catchupPlan.runsForH == null ? (
                <>The lamp runs at its target brightness until the debt is repaid or the minimum dark period is reached. The end time is not shown because the hub has not reported the dark floor or the next lights-on.</>
              ) : catchupPlan.cutShort ? (
                <>
                  Expected to run about <strong>{fmtHours(catchupPlan.runsForH)}</strong>, then stop at the{" "}
                  {fmtHours(catchupPlan.minDarkH ?? 0)} minimum dark floor with{" "}
                  <strong>{fmtHours(catchupPlan.carriesH)}</strong> still owed — that carries into the next cycle.
                </>
              ) : (
                <>
                  Expected to run about <strong>{fmtHours(catchupPlan.runsForH)}</strong>, until the debt is repaid.
                </>
              )}
              {cloneSchedule.untilOnMs != null ? (
                <> Next scheduled lights-on is in {fmtDurationMs(cloneSchedule.untilOnMs)}.</>
              ) : null}{" "}
              These are projections from the hub&apos;s own debt — it re-evaluates every tick.
            </div>
            <div className="dsc-chip-row" style={{ marginTop: 6 }}>
              {canCancelCatchup ? (
                <EntityToggle
                  confirm={{
                    body:
                      `Cancel this catch-up? The ${fmtHours(catchupPlan.debtH)} still owed is written off for this cycle only — ` +
                      `the lamp returns to the normal window and tomorrow's schedule is unchanged. This does not turn the lamp off by itself if the nominal window is open.`,
                    confirmLabel: "Cancel catch-up",
                  }}
                  entityId={cancelEntity}
                  label="Cancel catch-up"
                  icon="stopwatch"
                />
              ) : (
                <span className="dsc-muted dsc-catchup-invented">
                  Cancelling a catch-up needs a hub control that this firmware does not carry yet —
                  possible after the next hub flash. Turning Auto photoperiod off stops the lamp but
                  keeps the debt, so it resumes when you turn it back on.
                </span>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Panel
            tone={tone4}
            legendIcon="grow-light"
            legend={`4×8 · ${tentStageRailLabel(rail4, "main").toUpperCase()}`}
            legendRight={mainLit ? (twinAvailable ? "TWIN ON" : "WINDOW OPEN") : "DARK"}
            className="dsc-light-panel"
          >
            <TentClock tent="main" showEyebrow={false} />
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              {twinAvailable ? (
                <>
                  Main tent — Twin SF1000 is the live 4×8 actuator (on/off + brightness). Hub GPIO5 is{" "}
                  <strong>reserved</strong> for Twin PWM — not physically wired yet. Got prefers Twin on-hours when
                  history is healthy; otherwise the photoperiod window
                  {got4Source === "window" && got4Honesty ? ` (${got4Honesty})` : got4Source === "twin" ? " (Got · Twin)" : ""}.
                </>
              ) : (
                "Main tent schedule — Got tracks the photoperiod window until a Twin lamp entity exists."
              )}
            </p>
            <div className="dsc-chip-row">
              {twinAvailable ? (
                <StatusTag
                  icon="lighting"
                  label={twinOn ? "TWIN SF1000 ON" : "TWIN SF1000 OFF"}
                  tone={twinOn ? "ok" : "muted"}
                  onClick={() => open(twinEntity, "Twin SF1000", "binary")}
                />
              ) : null}
              {twinAvailable && got4Source ? (
                <StatusTag
                  icon="analytics"
                  label={got4Source === "twin" ? "Got · Twin" : "Got · Window"}
                  tone={got4Source === "twin" ? "ok" : "warn"}
                  onClick={() => open("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")}
                />
              ) : null}
              <StatusTag
                icon="tent"
                label={windowOpen ? "WINDOW OPEN" : "DARK"}
                tone={windowOpen ? "ok" : "muted"}
                onClick={() => open("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")}
              />
              <StatusTag
                icon="lighting"
                label={hoursDraft4.label}
                tone={railTone(hoursDraft4.tone)}
                onClick={() => open("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")}
              />
              <StatusTag icon="roster" label={tentStageRailLabel(rail4, "main")} tone={rail4.mixed ? "warn" : "muted"} />
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
              entityId={duty4Entity}
              hours={24}
              label={duty4Label}
              actualWhenHistory
              onClick={() =>
                open(
                  duty4Entity,
                  twinAvailable ? "Twin SF1000" : "4×8 window",
                  "binary",
                )
              }
            />
            {twinAvailable ? (
              <div className="dsc-demand-row" style={{ marginTop: 10 }}>
                <EntityToggle
                  entityId={twinEntity}
                  label="Twin SF1000"
                  icon="lighting"
                  showBrightness
                />
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
              <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginBottom: 0 }}>
                DLI estimate needs SF1000 PPFD calibration — Fleet → Calibrate.
              </p>
            )}
          </Panel>
        </div>

        <div className="dsc-col-6">
          <Panel
            tone={tone2}
            legendIcon="grow-light"
            legend={`2×4 · ${followsMain ? "FOLLOWS 4×8" : "INDEPENDENT"} · ${Number.isFinite(hours2) ? `${Math.round(hours2)}H RAIL` : "NO RAIL"}`}
            legendRight={lightOn ? cloneDesk.headerLabel.toUpperCase() : "SF1000 OFF"}
            className="dsc-light-panel"
          >
            <TentClock tent="clone" showEyebrow={false} />
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              Clone tent — SF1000 is the live lamp. <strong>Schedule follow</strong> is below; climate follow is on the
              Climate desk ({cloneClimateMode}).
            </p>
            <div className="dsc-chip-row">
              <StatusTag icon="clone" label={`Climate · ${cloneClimateMode}`} tone="muted" onClick={() => navigate("/climate")} />
              <StatusTag
                icon="lighting"
                label={followsMain ? "Schedule · Follow 4×8" : "Schedule · Independent"}
                tone={followsMain ? "ok" : "warn"}
              />
            </div>
            <div className="dsc-chip-row">
              <StatusTag
                icon="lighting"
                label={cloneDesk.headerLabel}
                tone={lightOn ? "ok" : "muted"}
                onClick={() => open("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")}
              />
              <StatusTag
                icon="lighting"
                label={hoursDraft2.label}
                tone={railTone(hoursDraft2.tone)}
                onClick={() => open("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")}
              />
              <StatusTag icon="roster" label={tentStageRailLabel(rail2, "clone")} tone={rail2.mixed ? "warn" : "muted"} />
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
              onClick={() => open("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")}
            />
            <DutyStrip
              entityId={duty2Entity}
              hours={24}
              label={duty2Label}
              actualWhenHistory
              onClick={() => open(duty2Entity, "2×4 window", "binary")}
            />
            <DutyStrip
              entityId="light.dsc_hub_sf1000_dimmer"
              hours={24}
              label="SF1000 lamp 24h"
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
              <EntityToggle
                confirm={{
                  // The old copy described only what the hold DOES, which left the release
                  // unexplained — and the release is the surprising half during catch-up.
                  body:
                    "Manual light hold freezes the SF1000 at its current on/off + brightness and stops the photoperiod schedule (and any active catch-up) from moving it until you clear the hold." +
                    (manualHold && catchupPlan ? ` ${holdReleaseWarning(catchupPlan)}` : ""),
                }}
                entityId="switch.dsc_hub_manual_light_hold"
                label="Manual light hold"
                icon="settings"
              />
            </div>
            <EntitySelect entityId="select.dsc_hub_clone_photoperiod" label="Schedule source" icon="clone" />
            {followsMain ? (
              <div className="dsc-tent-follow-banner">
                <StatusTag icon="tent" label="Schedule follows 4×8" tone="ok" />
                <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: "var(--dsc-fs-md)" }}>
                  Opens at <strong>{mainOnTime}</strong> · <strong>{fmt(hours2, 0)} h</strong> window (mirrored from
                  4×8). Edit the 4×8 card to change timing, or switch Schedule source to Independent.
                </p>
                <Button onClick={() => navigate("/climate")} style={{ marginTop: 8 }}>
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
            ) : (
              <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginBottom: 0 }}>
                DLI estimate needs SF1000 PPFD calibration — Fleet → Calibrate.
              </p>
            )}
            {independent ? (
              <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginBottom: 0 }}>
                Independent — 2×4 schedule does not track 4×8.
              </p>
            ) : null}
          </Panel>
        </div>

        <div className="dsc-col-6">
          <Panel legendIcon="light-hanger" legend="FIXTURES · NAMEPLATE WATTS · DUTY SOURCE">
            {fixtures == null ? (
              <p className="dsc-panel-foot">Loading fixtures…</p>
            ) : fixtures.length === 0 ? (
              <p className="dsc-panel-foot">Fixture table unavailable from this brain.</p>
            ) : (
              <div className="dsc-fixture-grid">
                {fixtures.flatMap((sp) =>
                  sp.devices.map((d) => (
                    <div key={`${sp.space_id}-${d.device_id}`} className={`dsc-fixture-row${d.enabled === false ? " is-off" : ""}`}>
                      <span className="dsc-fixture-space">{sp.space_id === "4x8" ? "4×8" : sp.space_id === "2x4" ? "2×4" : sp.space_id}</span>
                      <span className="dsc-fixture-label">{d.label || d.device_id}</span>
                      <span className="dsc-fixture-watts">{Number.isFinite(Number(d.watts)) ? `${Math.round(Number(d.watts))} W` : "— W"}</span>
                      <span className="dsc-fixture-duty">{String(d.duty_source || "photoperiod")}{d.enabled === false ? " · off" : ""}</span>
                      <span className="dsc-fixture-catalog" title="CannaLib lights-catalog record (extra.catalog_id on the fixture)">
                        {catalogIdForDevice(d) ? `cannalib · ${catalogIdForDevice(d)}` : "no catalog record"}
                      </span>
                    </div>
                  )),
                )}
              </div>
            )}
            <p className="dsc-panel-foot">
              Nameplate watts × photoperiod hours × tariff is the energy estimate below — not a meter, not a bill. Edit in Settings › Brain.
              {twinAvailable ? "" : " The 4×8 fixture is not a driven lamp yet; its watts ride on the schedule window."}
            </p>
          </Panel>
        </div>

        <div className="dsc-col-6">
          <Panel legendIcon="par-meter" legend="PPFD AT CANOPY · SF1000 CALIBRATION CURVE">
            {calibrated ? (
              <>
                <div className="dsc-cal-strip">
                  {calSteps.map((c) => (
                    <div key={c.step} className={`dsc-cal-cell${Number.isFinite(c.ppfd) && c.ppfd > 0 ? "" : " is-empty"}`}>
                      <span className="dsc-cal-step">{c.step} %</span>
                      <span className="dsc-cal-val">{Number.isFinite(c.ppfd) && c.ppfd > 0 ? Math.round(c.ppfd) : "—"}</span>
                      <span className="dsc-cal-unit">µmol</span>
                    </div>
                  ))}
                </div>
                <p className="dsc-panel-foot">
                  Operator-measured at the dimmer steps · live estimate {ppfd != null ? `${Math.round(ppfd)} µmol at the current level` : "needs the lamp on"}
                  {dli2 != null ? ` · DLI ≈ ${fmtDli(dli2)} mol/m²/d over ${fmt(hours2, 0)} h` : ""}. Interpolated between steps, never extrapolated to a fixture without a curve.
                </p>
              </>
            ) : (
              <p className="dsc-panel-foot">
                No calibration yet — PPFD shows as — until you measure the SF1000 at 25 / 50 / 75 / 100 % on Kit › Calibrate. A PAR sensor at the canopy would make this live.
              </p>
            )}
            <div className="dsc-row-actions">
              <Button onClick={() => navigate(paths.calibrate())}>Kit › Calibrate</Button>
            </div>
          </Panel>
        </div>

        {(fixtures ?? [])
          .flatMap((sp) => sp.devices.map((d) => ({ sp, d, catalogId: catalogIdForDevice(d) })))
          .filter((x) => x.catalogId && x.d.enabled !== false)
          .map(({ sp, d, catalogId }) => (
            <div key={`ppfd-${sp.space_id}-${d.device_id}`} className="dsc-col-6">
              <PpfdMapCard
                catalogId={catalogId as string}
                legend={`${sp.space_id === "4x8" ? "4×8" : sp.space_id === "2x4" ? "2×4" : sp.space_id} · ${(d.label || d.device_id).toUpperCase()} · MAKER PPFD MAP`}
              />
            </div>
          ))}

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
          <JournalScopePanel
            scope={{ kind: "space", id: "4x8" }}
            variant="embedded"
            fetchLimit={10}
            visibleRows={3}
          />
        </div>
        <div className="dsc-col-6">
          <JournalScopePanel
            scope={{ kind: "space", id: "2x4" }}
            variant="embedded"
            fetchLimit={10}
            visibleRows={3}
          />
        </div>
      </div>
    </div>
  );
}
