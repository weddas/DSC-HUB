import type { GrowLogEvent } from "./fleetApi";

const STAGE_OFF_CLONE_CUSTOM = /Stage\s*-\s*Off\s*;\s*Clone\s*-\s*Custom/i;
const BOOT_STAGE_CLONE = /^Stage\s*-\s*.+;\s*Clone\s*-\s*.+$/;
const DARK_PERIOD = /dark[- ]period/i;

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

  const alerts = filtered.filter((ev) => DARK_PERIOD.test(ev.message));
  const rest = filtered.filter((ev) => !DARK_PERIOD.test(ev.message));
  return [...alerts, ...rest];
}

export function growLogSeverity(message: string): "alert" | "normal" {
  return DARK_PERIOD.test(message) ? "alert" : "normal";
}
