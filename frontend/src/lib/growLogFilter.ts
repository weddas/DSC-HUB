import type { GrowLogEvent } from "./fleetApi";

const STAGE_OFF_CLONE_CUSTOM = /Stage\s*-\s*Off\s*;\s*Clone\s*-\s*Custom/i;
const BOOT_STAGE_CLONE = /^Stage\s*-\s*.+;\s*Clone\s*-\s*.+$/;
const DARK_PERIOD = /dark[- ]period/i;
const STAGE_CHANGE = /\bstage\b/i;
const VPD = /\bvpd\b/i;

const DUPLICATE_WINDOW_SEC = 5 * 60;
const FLICKER_WINDOW_SEC = 30 * 60;
const DEMAND_FLICKER_RE = /^[▶■]\s+(.+?)\s+demand\s+(on|off)$/i;

export type GrowLogFilter = "all" | "alerts" | "stage";

export type DisplayGrowLogEvent = GrowLogEvent & {
  /** Collapsed repeat count (duplicates or demand flicker). */
  repeatCount?: number;
};

export function normalizeGrowLogText(message: string): string {
  return message.replace(/\s+/g, " ").trim().toLowerCase();
}

function demandFlickerKey(message: string): string | null {
  const match = DEMAND_FLICKER_RE.exec(message.trim());
  if (!match) return null;
  return `${match[1].trim().toLowerCase()} demand`;
}

/** Collapse rapid humidifier/dehumidifier demand on/off bursts (newest-first feed). */
export function collapseDemandFlicker(events: GrowLogEvent[]): DisplayGrowLogEvent[] {
  const out: DisplayGrowLogEvent[] = [];
  let i = 0;

  while (i < events.length) {
    const ev = events[i];
    const key = demandFlickerKey(ev.message);
    if (!key) {
      out.push({ ...ev });
      i += 1;
      continue;
    }

    let count = 1;
    let j = i + 1;
    while (j < events.length) {
      const next = events[j];
      if (demandFlickerKey(next.message) !== key) break;
      if (ev.ts - next.ts > FLICKER_WINDOW_SEC) break;
      count += 1;
      j += 1;
    }

    if (count >= 2) {
      out.push({ ...ev, repeatCount: count });
      i = j;
    } else {
      out.push({ ...ev });
      i += 1;
    }
  }

  return out;
}

/** Collapse consecutive duplicate/near-duplicate lines within five minutes. */
export function collapseConsecutiveDuplicates(events: DisplayGrowLogEvent[]): DisplayGrowLogEvent[] {
  const out: DisplayGrowLogEvent[] = [];

  for (const ev of events) {
    const norm = normalizeGrowLogText(ev.message);
    const prev = out[out.length - 1];
    if (
      prev &&
      normalizeGrowLogText(prev.message) === norm &&
      prev.ts - ev.ts <= DUPLICATE_WINDOW_SEC
    ) {
      prev.repeatCount = (prev.repeatCount ?? 1) + 1;
      continue;
    }
    out.push({ ...ev });
  }

  return out;
}

/** Suppress noisy boot lines; collapse repeats; elevate dark-period violations to the top. */
export function prepareGrowLog(events: GrowLogEvent[]): DisplayGrowLogEvent[] {
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

  const collapsed = collapseConsecutiveDuplicates(collapseDemandFlicker(filtered));

  const alerts = collapsed.filter((ev) => DARK_PERIOD.test(ev.message) || VPD.test(ev.message));
  const rest = collapsed.filter((ev) => !DARK_PERIOD.test(ev.message) && !VPD.test(ev.message));
  return [...alerts, ...rest];
}

export function filterGrowLog(events: DisplayGrowLogEvent[], mode: GrowLogFilter): DisplayGrowLogEvent[] {
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
