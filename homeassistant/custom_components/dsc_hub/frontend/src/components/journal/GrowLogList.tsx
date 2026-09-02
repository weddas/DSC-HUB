import type { DisplayGrowLogEvent } from "../../lib/growLogFilter";
import { GrowLogRow } from "./GrowLogRow";

export type GrowLogListProps = {
  events: DisplayGrowLogEvent[];
  timeFormat?: "short" | "full";
  className?: string;
};

/** Shared grow-log row renderer for DashGrowLog and GrowLogStream. */
export function GrowLogList({ events, timeFormat = "full", className }: GrowLogListProps) {
  if (!events.length) return null;

  return (
    <ul className={className ?? "dsc-grow-log"}>
      {events.map((ev) => (
        <GrowLogRow key={`${ev.id}-${ev.repeatCount ?? 1}`} event={ev} timeFormat={timeFormat} />
      ))}
    </ul>
  );
}
