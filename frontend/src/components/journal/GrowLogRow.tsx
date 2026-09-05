import { Link } from "react-router-dom";

import { StatusChip } from "../ui";
import type { DisplayGrowLogEvent } from "../../lib/growLogFilter";
import { growLogSeverity } from "../../lib/growLogFilter";
import { growLogPlaybook } from "../../lib/growLogPlaybook";

export type GrowLogRowProps = {
  event: DisplayGrowLogEvent;
  /** Dash overview uses short time; full stream uses date + time. */
  timeFormat?: "short" | "full";
};

function formatGrowLogTime(ts: number, timeFormat: "short" | "full"): string {
  const d = new Date(ts * 1000);
  if (timeFormat === "short") {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GrowLogRow({ event, timeFormat = "full" }: GrowLogRowProps) {
  const playbook = growLogPlaybook(event.message);
  const isAlert = growLogSeverity(event.message) === "alert";
  const repeatBadge =
    event.repeatCount != null && event.repeatCount > 1 ? (
      <span className="dsc-grow-log-repeat" aria-label={`${event.repeatCount} similar events`}>
        ×{event.repeatCount}
      </span>
    ) : null;
  const ctaChip =
    isAlert && playbook ? (
      <StatusChip label={playbook.cta} tone="warn" />
    ) : null;

  const body = (
    <>
      <time className="dsc-muted" dateTime={new Date(event.ts * 1000).toISOString()}>
        {formatGrowLogTime(event.ts, timeFormat)}
      </time>{" "}
      <span className="dsc-grow-log-msg">{event.message}</span>
      {repeatBadge}
      {ctaChip}
    </>
  );

  const className = isAlert ? "dsc-grow-log--alert" : undefined;

  if (playbook) {
    return (
      <li className={className}>
        <Link to={playbook.href} className="dsc-grow-log-link">
          {body}
        </Link>
      </li>
    );
  }

  return <li className={className}>{body}</li>;
}
