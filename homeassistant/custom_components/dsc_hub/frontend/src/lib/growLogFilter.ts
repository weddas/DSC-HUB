import type { GrowLogEvent } from "./fleetApi";

const STAGE_OFF_CLONE_CUSTOM = /Stage\s*-\s*Off\s*;\s*Clone\s*-\s*Custom/i;
const BOOT_STAGE_CLONE = /^Stage\s*-\s*.+;\s*Clone\s*-\s*.+$/;
const DARK_PERIOD = /dark[- ]period/i;
const STAGE_CHANGE = /\bstage\b/i;
const VPD = /\bvpd\b/i;

export type GrowLogFilter = "all" | "alerts" | "stage";

/** Suppress noisy boot lines; elevate dark-period violations to the top. */
export function prepareGrowLog(events: GrowLogEvent[]): GrowLogEvent[] {
  let sawBootStage = false;
  const filtered: GrowLogEvent[] = [];

  for (const ev of events) {
    if (STAGE_OFF_CLONE_CUSTOM.test(ev.message)) continue;
    if (BOOT_STAGE_CLONE.test(ev.message)) {
      if (sawBootStage) continue;
      sawBootStage = true;
    }
    filtered.push(ev);
  }

  const alerts = filtered.filter((ev) => DARK_PERIOD.test(ev.message) || VPD.test(ev.message));
  const rest = filtered.filter((ev) => !DARK_PERIOD.test(ev.message) && !VPD.test(ev.message));
  return [...alerts, ...rest];
}

export function filterGrowLog(events: GrowLogEvent[], mode: GrowLogFilter): GrowLogEvent[] {
  if (mode === "all") return events;
  if (mode === "alerts") {
    return events.filter((ev) => growLogSeverity(ev.message) === "alert" || VPD.test(ev.message));
  }
  return events.filter((ev) => STAGE_CHANGE.test(ev.message));
}

export function growLogSeverity(message: string): "alert" | "normal" {
  if (DARK_PERIOD.test(message) || VPD.test(message)) return "alert";
  return "normal";
}
