import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntityBus } from "../hooks/useEntityBus";
import { useTentLightSchedule } from "../hooks/useTentLightSchedule";
import { dayScheduleSegments, readTentPhotoperiodInput, tentWindowEntity, type TentPhotoperiodId } from "../lib/lightSchedule";
import { fmtDurationMs } from "../lib/formatDuration";
import { getEnergyEstimate, type EnergyEstimate } from "../lib/fleetApi";
import { paths } from "../lib/paths";
import { buildCloneLightDesk } from "../lib/lightViewModel";
import { Icon, StatusTag } from "./ui";
import { Tooltip, TipRow } from "./Tooltip";

function ClockRail({ tent }: { tent: TentPhotoperiodId }) {
  const { state, num } = useEntityBus();
  const input = readTentPhotoperiodInput(tent, state, num);
  const day = dayScheduleSegments(input);
  return (
    <div className="dsc-clock-rail" aria-hidden="true">
      {day.segments
        .filter((s) => s.kind === "lit")
        .map((s) => (
          <span
            key={`${s.startMin}-${s.endMin}`}
            className="dsc-clock-lit"
            style={{ left: `${(s.startMin / 1440) * 100}%`, width: `${((s.endMin - s.startMin) / 1440) * 100}%` }}
          />
        ))}
      <span className="dsc-clock-now" style={{ left: `${(day.nowMin / 1440) * 100}%` }} />
    </div>
  );
}

function useEnergy(spaceId: "4x8" | "2x4", lightsOn: string, hours: number): EnergyEstimate | null {
  const [est, setEst] = useState<EnergyEstimate | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!lightsOn || !Number.isFinite(hours) || hours <= 0) {
      setEst(null);
      return;
    }
    getEnergyEstimate(spaceId, lightsOn, hours)
      .then((e) => {
        if (!cancelled) setEst(e);
      })
      .catch(() => {
        if (!cancelled) setEst(null);
      });
    return () => {
      cancelled = true;
    };
  }, [spaceId, lightsOn, hours]);
  return est;
}

export function TentClock({ tent, showEyebrow = true }: { tent: TentPhotoperiodId; showEyebrow?: boolean }) {
  const schedule = useTentLightSchedule(tent);
  const { state, num, entity } = useEntityBus();
  const input = readTentPhotoperiodInput(tent, state, num);
  const energy = useEnergy(tent === "main" ? "4x8" : "2x4", input.lightsOnTime, input.expectedHours);
  const label = tent === "main" ? "4×8" : "2×4";
  const stage = tent === "main" ? state("select.dsc_hub_grow_stage", "") : "";
  const railName = `${Math.round(input.expectedHours)}H RAIL`;
  const eyebrow =
    tent === "main"
      ? `${label} · ${stage && stage !== "—" ? stage : "photoperiod"} · ${railName}`
      : `${label} · ${schedule.followsMain ? "FOLLOWS 4×8" : "INDEPENDENT"} · ${railName}`;

  const lit = schedule.valid && schedule.phase === "lit";
  // The hub's own window flag is the truth for LIT/DARK; the computed clock only adds
  // on-in / off-in. When they disagree, say so — never show a calm DARK over a lit tent.
  const windowId = tentWindowEntity(tent);
  const hubWindow = state(windowId, "");
  const hubLit = hubWindow === "on" || hubWindow === "true" ? true : hubWindow === "off" || hubWindow === "false" ? false : null;
  const conflict = schedule.valid && hubLit != null && hubLit !== lit;
  const shownLit = hubLit ?? lit;
  const clock = !schedule.valid
    ? { key: "NO SCHEDULE", value: "—" }
    : lit
      ? { key: "OFF IN", value: schedule.untilOffMs != null ? fmtDurationMs(schedule.untilOffMs) : "—" }
      : { key: "ON IN", value: schedule.untilOnMs != null ? fmtDurationMs(schedule.untilOnMs) : "—" };

  let lampText: string;
  if (tent === "clone") {
    const desk = buildCloneLightDesk({ state, num, entity });
    lampText = desk.sfOn ? `SF1000 ON${desk.sfBrightness != null ? ` · ${desk.sfBrightness}%` : ""}` : "SF1000 OFF";
  } else {
    const twin = state("light.dsc_hub_twin_sf1000", "");
    lampText = twin === "on" ? "TWIN SF1000 ON" : twin === "off" ? "TWIN SF1000 OFF" : "TWIN NOT WIRED";
  }

  const kwh = energy?.total_kwh;
  const cost = energy?.total_cost;
  const energyText =
    energy?.ok && kwh != null && Number.isFinite(kwh)
      ? `draw ${kwh.toFixed(2)} kWh/d${cost != null && Number.isFinite(cost) ? ` · $${cost.toFixed(2)}` : ""} · tariff × local watts, not a bill`
      : "energy estimate unavailable";

  return (
    <div className="dsc-clock">
      {showEyebrow ? <div className="dsc-legend">{eyebrow}</div> : null}
      <Tooltip
        content={
          <>
            <TipRow k={`${label} lamp`} v={hubLit != null ? (hubLit ? "LIT · hub window open" : "DARK · hub window closed") : schedule.valid ? (lit ? "LIT" : "DARK") : "no schedule"} tone={shownLit ? "ok" : undefined} />
            {schedule.valid ? <TipRow k={clock.key.toLowerCase()} v={clock.value} tone={conflict ? "bad" : undefined} /> : null}
            {conflict ? <TipRow k="conflict" v={`schedule says ${lit ? "LIT" : "DARK"} — the hub's lights-on time differs from the SPA's ${String(input.lightsOnTime ?? "—")}`} tone="bad" /> : null}
            <TipRow k="window" v={`${String(input.lightsOnTime ?? "—")} + ${Math.round(input.expectedHours)} h${tent === "clone" && schedule.followsMain ? " · follows 4×8" : ""}`} tone="muted" />
            <TipRow k="fixture" v={lampText} tone={lampText.includes("NOT WIRED") ? "muted" : undefined} />
            <TipRow k="energy" v={energyText} tone="muted" />
          </>
        }
      >
        <div className={`dsc-clock-state${conflict ? " is-conflict" : ""}`} tabIndex={0} aria-label={`${label} lamp ${hubLit != null ? (hubLit ? "lit" : "dark") : schedule.valid ? (lit ? "lit" : "dark") : "no schedule"}${conflict ? ", hub and schedule disagree" : ""}, ${clock.key.toLowerCase()} ${clock.value}`}>
          <span className="dsc-clock-key">STATE</span>
          <span className={`dsc-clock-big${shownLit ? " is-lit" : ""}`}>
            <Icon name={shownLit ? "photoperiod-day" : "photoperiod-night"} size={14} className={shownLit ? "dsc-icon--lamp" : "dsc-icon--muted"} />
            {hubLit != null || schedule.valid ? (shownLit ? "LIT" : "DARK") : "—"}
          </span>
          <span className="dsc-clock-key">{clock.key}</span>
          <span className={`dsc-clock-big${conflict ? " is-conflict" : ""}`}>{clock.value}</span>
          {conflict ? <StatusTag label={`HUB ${hubLit ? "LIT" : "DARK"} · SCHEDULE ${lit ? "LIT" : "DARK"}`} tone="bad" live title={`${windowId} disagrees with the clock computed from the SPA's lights-on time — one of them is wrong`} /> : null}
        </div>
      </Tooltip>
      <ClockRail tent={tent} />
      <div className="dsc-clock-axis" aria-hidden="true">
        <span>12a</span>
        <span>6a</span>
        <span>12p</span>
        <span>6p</span>
        <span>12a</span>
      </div>
      <p className="dsc-panel-foot">
        {lampText} · <Icon name="tariff-cost" size={11} /> {energyText}
      </p>
    </div>
  );
}

/** Two desks, two clocks — the 2×4 follows the 4×8 unless set independent. */
export function TwoClocks() {
  const { state } = useEntityBus();
  const navigate = useNavigate();
  const darkViolation = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  return (
    <div className="dsc-two-clocks">
      <div className="dsc-two-clocks-head">
        <StatusTag
          label={darkViolation ? "DARK PERIOD BROKEN" : "DARK PERIOD OK"}
          tone={darkViolation ? "bad" : "ok"}
          live={darkViolation}
          onClick={() => navigate(paths.light())}
          title="Open the Light desk"
        />
      </div>
      <TentClock tent="main" />
      <TentClock tent="clone" />
    </div>
  );
}
