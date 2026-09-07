import { useNavigate } from "react-router-dom";
import { paths } from "../lib/paths";
import type { DisplayGrowLogEvent } from "../lib/growLogFilter";

function shortTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export type MissionStory =
  | { tone: "bad"; time?: string; title: string; detail?: string }
  | { tone: "warn"; time?: string; title: string; detail?: string }
  | { tone: "ok"; title: string; detail?: string };

/**
 * Pick the one line that matters: live critical banners → active alerts → the latest
 * alert-class grow-log event in the last 24 h → "nothing needed from you".
 */
export function buildMissionStory(opts: {
  criticalBanners: string[];
  activeAlertTitles: string[];
  /** Enabled alerts the operator downgraded to warn / info — mentioned, never red. */
  warnAlertTitles?: string[];
  recentAlert: DisplayGrowLogEvent | null;
}): MissionStory {
  if (opts.criticalBanners.length) {
    return { tone: "bad", title: opts.criticalBanners[0], detail: opts.criticalBanners.slice(1).join(" · ") || undefined };
  }
  if (opts.activeAlertTitles.length) {
    const n = opts.activeAlertTitles.length;
    return {
      tone: "bad",
      title: `${n} critical alert${n === 1 ? "" : "s"} active`,
      detail: opts.activeAlertTitles.slice(0, 4).join(" · "),
    };
  }
  if (opts.warnAlertTitles && opts.warnAlertTitles.length) {
    const n = opts.warnAlertTitles.length;
    return {
      tone: "warn",
      title: `${n} alert${n === 1 ? "" : "s"} to look at`,
      detail: opts.warnAlertTitles.slice(0, 4).join(" · "),
    };
  }
  if (opts.recentAlert) {
    return {
      tone: "warn",
      time: shortTime(opts.recentAlert.ts),
      title: opts.recentAlert.message.replace(/^[▶■▲◆●○•]\s*/, ""),
      detail: "Past notable — not a live alert. Nothing needed from you unless it repeats.",
    };
  }
  return { tone: "ok", title: "All in band.", detail: "Nothing needed from you." };
}

/** The quiet one-line alert story with a single `OPEN ALERTS →` affordance. */
export function MissionLine({ story }: { story: MissionStory }) {
  const navigate = useNavigate();
  return (
    <div className={`dsc-mission dsc-mission--${story.tone}`} role={story.tone === "bad" ? "alert" : "status"}>
      <span className="dsc-mission-dot" aria-hidden="true" />
      {"time" in story && story.time ? <span className="dsc-mission-time">{story.time}</span> : null}
      <span className="dsc-mission-title">{story.title}</span>
      {story.detail ? <span className="dsc-mission-detail">— {story.detail}</span> : null}
      <button type="button" className="dsc-mission-cta" onClick={() => navigate(paths.alerts())}>
        OPEN ALERTS →
      </button>
    </div>
  );
}
