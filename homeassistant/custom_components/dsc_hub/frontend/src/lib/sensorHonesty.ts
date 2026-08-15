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
  entity?: (
    entityId: string,
  ) => { attributes?: Record<string, unknown>; last_changed?: string } | undefined;
};

export function collectHonestyGaps(hass: HassLike): HonestyGap[] {
  const gaps: HonestyGap[] = [];
  const st = (id: string, fb = "unknown") => hass.state(id, fb);
  const on = (id: string) => st(id) === "on";
  const attrs = hass.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {};
  const honesty = String(attrs.full_auto_honesty ?? "").trim();

  if (hass.available && hass.available("binary_sensor.dsc_hub_link") && !on("binary_sensor.dsc_hub_link")) {
    gaps.push({
      id: "hub-link",
      label: "Hub link down",
      detail: "binary_sensor.dsc_hub_link is off — Mission/Fleet show HELD, not last-good animation.",
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 9,
    });
  }

  if (hass.available && !hass.available("sensor.dsc_hub_uptime")) {
    const lc = hass.entity?.("sensor.dsc_hub_uptime")?.last_changed as string | undefined;
    let off = "";
    if (lc) {
      const ms = Date.now() - Date.parse(lc);
      if (Number.isFinite(ms) && ms >= 0) {
        const min = Math.floor(ms / 60000);
        off = min < 60 ? ` · offline ${Math.max(1, min)}m` : ` · offline ${(min / 60).toFixed(1)}h`;
      }
    }
    gaps.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${off}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10,
    });
  }

  if (hass.available && !hass.available("sensor.dsc_hub_heartbeat")) {
    gaps.push({
      id: "beat-dark",
      label: "Beat dark",
      detail: "Hub heartbeat unavailable — Mission shows BEAT OFF duration; vitals stay held.",
      tone: "bad",
      href: "/live/mission",
      cta: "Mission",
      priority: 12,
    });
  }

  if (hass.available && !hass.available("binary_sensor.dsc_hub_panel_link")) {
    gaps.push({
      id: "panel-dark",
      label: "Panel link dark",
      detail: "Panel link dark — Mission shows PANEL OFF duration; do not invent Got.",
      tone: "warn",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 14,
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

  // OOS pots are fully omitted from Live surfaces — no honesty chips naming them.

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

  if (on("binary_sensor.dsc_clone_light_missing_in_window")) {
    gaps.push({
      id: "photo-missing",
      label: "Light missing in window",
      detail: "Photoperiod integrity — fixture did not deliver in the open window.",
      tone: "bad",
      href: "/live/light",
      cta: "Open Light",
      priority: 24,
    });
  }

  if (on("binary_sensor.dsc_hub_light_catchup_active")) {
    gaps.push({
      id: "photo-catchup",
      label: "Light catch-up",
      detail: "Catch-up photoperiod is active — hours gauge is the Got, not invented.",
      tone: "warn",
      href: "/live/light",
      cta: "Open Light",
      priority: 28,
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
