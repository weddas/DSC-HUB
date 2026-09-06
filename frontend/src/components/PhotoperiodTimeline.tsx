import type { TentPhotoperiodId } from "../lib/lightSchedule";
import {
  dayScheduleSegments,
  fmtMinutesClock,
  readTentPhotoperiodInput,
} from "../lib/lightSchedule";
import { railForStage } from "../lib/tentWant";
import { potsInTent, isPotInService } from "../lib/seatModel";
import { useEntityBus } from "../hooks/useEntityBus";

/**
 * 24h scheduled on/off strip for one tent (calendar day, local midnight).
 * Actual lamp/window history lives in DutyStrip below — different axis.
 */
export function PhotoperiodTimeline({
  tent,
  onClick,
  label,
  scheduleValid: scheduleValidProp,
}: {
  tent: TentPhotoperiodId;
  onClick?: () => void;
  label?: string;
  /** When set, overrides local parse for NO SCHEDULE (clone desk SoT). */
  scheduleValid?: boolean;
}) {
  const { state, num, entity } = useEntityBus();
  const input = readTentPhotoperiodInput(tent, state, num);
  const schedule = dayScheduleSegments(input);
  const scheduleValid = scheduleValidProp ?? schedule.valid;
  const sunriseMin = num("number.dsc_hub_sunrise_duration", 0);
  const sunsetMin = num("number.dsc_hub_sunset_duration", 0);
  const seats = potsInTent(tent, state, entity).filter((s) => isPotInService(s.pot, state));
  const stageHours = seats.reduce<number | null>((acc, s) => {
    const rail = railForStage(s.stage);
    if (!rail) return acc;
    return acc == null ? rail.lightHours : Math.min(acc, rail.lightHours);
  }, null);
  const scheduleHours = scheduleValid ? schedule.hours : null;
  const flipAhead =
    stageHours != null && scheduleHours != null && stageHours < scheduleHours - 0.5
      ? `Stage wants ${stageHours}h · schedule ${scheduleHours.toFixed(0)}h — flip countdown when you shorten the window`
      : null;

  const title =
    label ??
    (tent === "main" ? "4×8 schedule 24h" : "2×4 schedule 24h");

  const onLabel =
    scheduleValid && schedule.onMin != null
      ? fmtMinutesClock(schedule.onMin)
      : "—";
  const offLabel =
    scheduleValid && schedule.offMin != null
      ? fmtMinutesClock(schedule.offMin)
      : "—";

  const body = (
    <div className="dsc-photo-timeline">
      <div className="dsc-duty-meta">
        <span>{title}</span>
        <span className="dsc-muted">
          {scheduleValid
            ? `On ${onLabel} · Off ${offLabel} · ${schedule.hours.toFixed(0)}h lit`
            : "No schedule — set lights-on time"}
          {scheduleValid && (sunriseMin > 0 || sunsetMin > 0)
            ? ` · ramp ${Math.round(sunriseMin + sunsetMin)}m`
            : ""}
        </span>
      </div>
      {flipAhead ? (
        <p className="dsc-muted" style={{ margin: "4px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
          {flipAhead}
        </p>
      ) : null}
      <svg viewBox="0 0 1440 22" className="dsc-photo-timeline-svg" preserveAspectRatio="none" aria-hidden>
        <rect x="0" y="6" width={1440} height="10" rx="2" fill="var(--dsc-gray-3)" />
        {scheduleValid
          ? schedule.segments.map((seg, i) =>
              seg.kind === "lit" ? (
                <g key={`${seg.startMin}-${i}`}>
                  <rect
                    x={seg.startMin}
                    y="6"
                    width={Math.max(2, seg.endMin - seg.startMin)}
                    height="10"
                    rx="2"
                    fill={
                      tent === "main"
                        ? "color-mix(in srgb, var(--dsc-teal) 72%, transparent)"
                        : "color-mix(in srgb, var(--dsc-teal) 55%, var(--dsc-blue) 45%)"
                    }
                    opacity={0.95}
                  />
                  {sunriseMin > 0 && i === 0 ? (
                    <rect
                      x={seg.startMin}
                      y="6"
                      width={Math.min(seg.endMin - seg.startMin, sunriseMin)}
                      height="10"
                      fill="color-mix(in srgb, var(--dsc-amber) 35%, transparent)"
                      opacity={0.85}
                    />
                  ) : null}
                  {sunsetMin > 0 ? (
                    <rect
                      x={Math.max(seg.startMin, seg.endMin - sunsetMin)}
                      y="6"
                      width={Math.min(seg.endMin - seg.startMin, sunsetMin)}
                      height="10"
                      fill="color-mix(in srgb, var(--dsc-amber) 35%, transparent)"
                      opacity={0.85}
                    />
                  ) : null}
                </g>
              ) : null,
            )
          : null}
        {scheduleValid ? (
          <line
            x1={schedule.nowMin}
            x2={schedule.nowMin}
            y1="2"
            y2="20"
            stroke="var(--dsc-amber)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      <div className="dsc-photo-timeline-axis" aria-hidden>
        <span>12a</span>
        <span>6a</span>
        <span>12p</span>
        <span>6p</span>
        <span>12a</span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" className="dsc-duty-hit" onClick={onClick} title={`Schedule · ${title}`}>
        {body}
      </button>
    );
  }
  return body;
}
