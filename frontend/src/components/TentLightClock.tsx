import { useNavigate } from "react-router-dom";
import { fmtDurationMs } from "../lib/formatDuration";
import type { TentPhotoperiodId } from "../lib/lightSchedule";
import { tentLabel } from "../lib/seatModel";
import { useTentLightSchedule } from "../hooks/useTentLightSchedule";
import { useEntityBus } from "../hooks/useEntityBus";
import { buildCloneLightDesk, headerSfLabel } from "../lib/lightViewModel";
import { Icon, StatusChip } from "./ui";
import type { IconName } from "../icons";

function tentIcon(tent: TentPhotoperiodId): IconName {
  return tent === "main" ? "tent" : "clone";
}

export function TentLightClock({
  tent,
  compact,
}: {
  tent: TentPhotoperiodId;
  compact?: boolean;
}) {
  const schedule = useTentLightSchedule(tent);
  const { state, num, entity } = useEntityBus();
  const cloneDesk = tent === "clone" ? buildCloneLightDesk({ state, num, entity }) : null;
  const windowOpen =
    tent === "main"
      ? state("binary_sensor.dsc_hub_4x8_window_open") === "on"
      : state("binary_sensor.dsc_hub_2x4_window_open") === "on";
  const lampOn = tent === "clone" && (cloneDesk?.sfOn ?? state("light.dsc_hub_sf1000_dimmer") === "on");
  const title = tentLabel(tent);
  const scheduleOk = cloneDesk ? cloneDesk.scheduleValid : schedule.valid;
  const isLit = scheduleOk && schedule.phase === "lit";
  const liveActive = isLit && (windowOpen || lampOn);

  if (!scheduleOk) {
    return (
      <div className={`dsc-light-clocks dsc-light-clocks--${tent}${compact ? " is-compact" : ""}`}>
        <div className="dsc-light-clocks-head">
          <Icon name={tentIcon(tent)} size={compact ? 14 : 18} color="var(--dsc-gray-5)" />
          <span className="dsc-light-clocks-tent">{title}</span>
          <StatusChip icon="alert" label="No schedule" tone="warn" />
        </div>
        <p className="dsc-muted" style={{ margin: 0, fontSize: "var(--dsc-fs-sm)" }}>
          Check lights-on time on the hub.
        </p>
      </div>
    );
  }

  const onClock =
    schedule.phase === "lit" && schedule.sinceOnMs != null
      ? { label: "On for", value: fmtDurationMs(schedule.sinceOnMs), icon: "lighting" as const, live: true }
      : schedule.untilOnMs != null
        ? { label: "On in", value: fmtDurationMs(schedule.untilOnMs), icon: "lighting" as const, live: false }
        : { label: "On in", value: "—", icon: "lighting" as const, live: false };

  const offClock =
    schedule.phase === "lit" && schedule.untilOffMs != null
      ? { label: "Off in", value: fmtDurationMs(schedule.untilOffMs), icon: "lighting" as const, live: true }
      : schedule.sinceOffMs != null
        ? { label: "Dark for", value: fmtDurationMs(schedule.sinceOffMs), icon: "climate" as const, live: false }
        : { label: "Off in", value: "—", icon: "climate" as const, live: false };

  return (
    <div
      className={`dsc-light-clocks dsc-light-clocks--${tent}${compact ? " is-compact" : ""}${liveActive ? " is-live" : ""}${isLit ? " is-lit" : " is-dark"}`}
    >
      <div className="dsc-light-clocks-head">
        <Icon
          name={tentIcon(tent)}
          size={compact ? 14 : 18}
          color={liveActive ? "var(--dsc-teal)" : "var(--dsc-gray-5)"}
          motion={liveActive ? "glow" : undefined}
        />
        <span className="dsc-light-clocks-tent">{title}</span>
        <StatusChip
          icon="lighting"
          motion={liveActive ? "glow" : undefined}
          label={schedule.phase === "lit" ? (windowOpen ? "WINDOW OPEN" : "LIT") : "DARK"}
          tone={schedule.phase === "lit" ? "ok" : "muted"}
        />
        {tent === "clone" && lampOn ? (
          <StatusChip
            icon="lighting"
            motion={schedule.phase === "lit" ? "duty" : "pulse"}
            label={
              cloneDesk?.headerLabel ??
              headerSfLabel({ sfOn: true, sfBrightness: cloneDesk?.sfBrightness ?? null })
            }
            tone={schedule.phase === "lit" ? "ok" : "bad"}
            pulse={schedule.phase !== "lit"}
          />
        ) : null}
        {schedule.followsMain ? (
          <StatusChip icon="tent" label="Follows 4×8" tone="muted" />
        ) : null}
      </div>
      <div className="dsc-light-clock-row">
        <div className={`dsc-light-clock${onClock.live ? " is-live" : ""}`}>
          <span className="dsc-light-clock-label">
            <Icon name={onClock.icon} size={11} motion={onClock.live ? "glow" : undefined} />
            {onClock.label}
          </span>
          <strong className="dsc-light-clock-value">{onClock.value}</strong>
        </div>
        <div className={`dsc-light-clock${offClock.live ? " is-live" : ""}`}>
          <span className="dsc-light-clock-label">
            <Icon name={offClock.icon} size={11} />
            {offClock.label}
          </span>
          <strong className="dsc-light-clock-value">{offClock.value}</strong>
        </div>
      </div>
    </div>
  );
}

export function TentLightClockStrip() {
  return (
    <div className="dsc-light-clock-strip">
      <TentLightClock tent="main" compact />
      <TentLightClock tent="clone" compact />
    </div>
  );
}

/**
 * One-line-per-tent status ("4×8 lit, off in 2h") that links to Light rather than
 * duplicating its full clock widget — Light stays the single owner of the detail
 * (redundancy-map fix). Overview and Dash Legacy should use this, not the full strip.
 */
function TentLightSummaryChip({ tent }: { tent: TentPhotoperiodId }) {
  const navigate = useNavigate();
  const schedule = useTentLightSchedule(tent);
  const title = tentLabel(tent);

  if (!schedule.valid) {
    return (
      <StatusChip
        icon="alert"
        label={`${title} — no schedule`}
        tone="warn"
        onClick={() => navigate("/live/light")}
      />
    );
  }

  const isLit = schedule.phase === "lit";
  const durationMs = isLit ? schedule.untilOffMs : schedule.untilOnMs;
  const durationLabel = durationMs != null ? fmtDurationMs(durationMs) : null;
  const label = isLit
    ? `${title} lit${durationLabel ? `, off in ${durationLabel}` : ""}`
    : `${title} dark${durationLabel ? `, on in ${durationLabel}` : ""}`;

  return (
    <StatusChip
      icon="lighting"
      label={label}
      tone={isLit ? "ok" : "muted"}
      onClick={() => navigate("/live/light")}
    />
  );
}

export function TentLightSummaryLine() {
  return (
    <div className="dsc-chip-row" style={{ marginBottom: 4 }}>
      <TentLightSummaryChip tent="main" />
      <TentLightSummaryChip tent="clone" />
    </div>
  );
}
