export type HonestyTone = "ok" | "warn" | "bad" | "muted";

export type HonestyGap = {
  id: string;
  label: string;
  detail: string;
  tone: HonestyTone;
  /** Outcome CTA path inside the panel */
  href: string;
  cta: string;
  priority: number;
};

type HassLike = {
  state: (entityId: string, fallback?: string) => string;
  available?: (entityId: string) => boolean;
  entity?: (entityId: string) => { attributes?: Record<string, unknown> } | undefined;
};

export function collectHonestyGaps(hass: HassLike): HonestyGap[] {
  const gaps: HonestyGap[] = [];
  const st = (id: string, fb = "unknown") => hass.state(id, fb);
  const on = (id: string) => st(id) === "on";
  const attrs = hass.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {};
  const honesty = String(attrs.full_auto_honesty ?? "").trim();

  if (hass.available && !hass.available("sensor.dsc_hub_uptime")) {
    gaps.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: "Hub sensors unavailable — Live vitals may be stale.",
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10,
    });
  }

  if (on("binary_sensor.dsc_reduced_kit")) {
    gaps.push({
      id: "reduced-kit",
      label: "Reduced kit",
      detail: "Full Auto keep-up is honesty-limited while kit is reduced.",
      tone: "warn",
      href: "/fleet",
      cta: "Review kit",
      priority: 20,
    });
  }

  if (honesty && on("switch.dsc_hub_tent_full_auto_mode")) {
    gaps.push({
      id: "keepup",
      label: "Keep-up gaps",
      detail: honesty,
      tone: "warn",
      href: "/live/climate",
      cta: "Fix Climate",
      priority: 30,
    });
  }

  if (st("input_boolean.dsc_pot3_in_service") === "off") {
    gaps.push({
      id: "pot3-oos",
      label: "POT3 out of service",
      detail: "Probe fault path — mat vote excluded while OOS.",
      tone: "warn",
      href: "/live/root?pot=3",
      cta: "Inspect Root",
      priority: 40,
    });
  }

  if (on("binary_sensor.dsc_clone_dark_period_violation")) {
    gaps.push({
      id: "dark-viol",
      label: "Clone dark violation",
      detail: "Photoperiod honesty — check Light Cycle.",
      tone: "bad",
      href: "/live/light",
      cta: "Open Light",
      priority: 25,
    });
  }

  if (on("binary_sensor.dsc_hub_climate_sensor_fault")) {
    gaps.push({
      id: "climate-fault",
      label: "Climate sensor fault",
      detail: "Trust the honesty rail — do not invent Got.",
      tone: "bad",
      href: "/live/climate",
      cta: "Open Climate",
      priority: 15,
    });
  }

  if (on("binary_sensor.dsc_hub_emergency_failsafe")) {
    gaps.push({
      id: "failsafe",
      label: "Emergency failsafe",
      detail: "Hub failsafe active.",
      tone: "bad",
      href: "/live/mission",
      cta: "Mission",
      priority: 5,
    });
  }

  return gaps.sort((a, b) => a.priority - b.priority);
}

export function nextRecommended(gaps: HonestyGap[]): HonestyGap | null {
  return gaps[0] ?? null;
}
