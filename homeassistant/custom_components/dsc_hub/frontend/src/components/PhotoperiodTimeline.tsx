import type { TentPhotoperiodId } from "../lib/lightSchedule";
import {
  dayScheduleSegments,
  fmtMinutesClock,
  readTentPhotoperiodInput,
} from "../lib/lightSchedule";
import { useEntityBus } from "../hooks/useEntityBus";

/**
 * 24h scheduled on/off strip for one tent (calendar day, local midnight).
 * Actual lamp/window history lives in DutyStrip below — different axis.
 */
export function PhotoperiodTimeline({
  tent,
  onClick,
  label,
}: {
  tent: TentPhotoperiodId;
  onClick?: () => void;
  label?: string;
}) {
  const { state, num } = useEntityBus();
  const input = readTentPhotoperiodInput(tent, state, num);
  const schedule = dayScheduleSegments(input);

  const title =
    label ??
    (tent === "main" ? "4×8 schedule 24h" : "2×4 schedule 24h");

  const onLabel =
    schedule.valid && schedule.onMin != null
      ? fmtMinutesClock(schedule.onMin)
      : "—";
  const offLabel =
    schedule.valid && schedule.offMin != null
      ? fmtMinutesClock(schedule.offMin)
      : "—";

  const body = (
    <div className="dsc-photo-timeline">
      <div className="dsc-duty-meta">
        <span>{title}</span>
        <span className="dsc-muted">
          {schedule.valid
            ? `On ${onLabel} · Off ${offLabel} · ${schedule.hours.toFixed(0)}h lit`
            : "No schedule — set lights-on time"}
        </span>
      </div>
      <svg viewBox="0 0 1440 22" className="dsc-photo-timeline-svg" preserveAspectRatio="none" aria-hidden>
        <rect x="0" y="6" width={1440} height="10" rx="2" fill="var(--dsc-gray-3)" />
        {schedule.valid
          ? schedule.segments.map((seg, i) =>
              seg.kind === "lit" ? (
                <rect
                  key={`${seg.startMin}-${i}`}
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
              ) : null,
            )
          : null}
        {schedule.valid ? (
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
