import { growLogSeverity } from "./growLogFilter";

export type GrowLogPlaybookLink = { href: string; cta: string };

const LIGHT = /dark[- ]?period|catch[- ]?up|\blight\b|photo|sf1000|window/i;
const CLIMATE = /\bvpd\b|climate|humidifier|dehumidifier|heater|vent|\bdht\b/i;
const ROOT = /\broot\b|tank|moisture|probe|\bpot\b|mat\b/i;
const STAGE = /\bstage\b|\bclone\b/i;

/** Map grow-log message text to cockpit deep links (mirrors alertRoute themes). */
export function growLogPlaybook(message: string): GrowLogPlaybookLink | null {
  const lower = message.toLowerCase();

  if (LIGHT.test(message)) {
    return { href: "/live/light", cta: "Open Light" };
  }
  if (CLIMATE.test(lower)) {
    return { href: "/live/climate", cta: "Open Climate" };
  }
  if (ROOT.test(lower)) {
    return { href: "/live/root", cta: "Open Root" };
  }
  if (STAGE.test(lower)) {
    return { href: "/live/overview", cta: "Overview" };
  }
  if (growLogSeverity(message) === "alert") {
    return { href: "/live/overview", cta: "Overview" };
  }
  return null;
}
