import { resolveCfm } from "./cfmProvenance";
import { ALL_POT_NUMBERS, isPotInService } from "./seatModel";

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
      detail: "The hub link is down — readings are held at their last known values.",
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
      label: "Heartbeat missing",
      detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 12,
    });
  }

  if (hass.available && !hass.available("binary_sensor.dsc_hub_panel_link")) {
    const panelLimited = hass.available("sensor.dsc_control_wifi_rssi");
    gaps.push({
      id: "panel-dark",
      label: panelLimited ? "Panel limited link" : "Panel link down",
      detail: panelLimited
        ? "Panel Wi‑Fi RSSI is present but panel link is off — treat as limited, not a full outage."
        : "The control panel link is down — check Fleet link chips for how long.",
      tone: "warn",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 14,
    });
  }

  if (on("binary_sensor.dsc_reduced_kit")) {
    const reduced = hass.entity?.("binary_sensor.dsc_reduced_kit")?.attributes ?? {};
    const off = String(reduced.offline ?? "").trim();
    gaps.push({
      id: "reduced-kit",
      label: "Capacity offline",
      detail: off || "A device that should be running is temporarily out of service or locked out.",
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

  // Live omits OOS pots (no fake Got) — still surface a count so fleet holes are visible.
  const oosPots = ALL_POT_NUMBERS.filter((n) => !isPotInService(n, st));
  if (oosPots.length) {
    gaps.push({
      id: "oos-pots",
      label: oosPots.length === 1 ? `Pot ${oosPots[0]} OOS` : `${oosPots.length} pots OOS`,
      detail: `Pot${oosPots.length === 1 ? "" : "s"} ${oosPots.join(", ")} out of service — omitted from Live on purpose. Open Root or Settings to put back in service.`,
      tone: "muted",
      href: "/live/root",
      cta: "Open Root",
      priority: 50,
    });
  }

  if (on("binary_sensor.dsc_clone_dark_period_violation")) {
    gaps.push({
      id: "dark-viol",
      label: "2×4 dark violation",
      detail: "The lamp is on during the dark period — check Light.",
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
      detail: "The lamp did not deliver its hours in the open window.",
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
      detail: "Light catch-up is running — the hours gauge shows what was actually delivered.",
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
      detail: "A climate sensor cannot be trusted right now — its readings are held.",
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
      detail: "Hub failsafe active — Overview shows Next Recommended; Climate owns command.",
      tone: "bad",
      href: "/live/overview",
      cta: "Open Overview",
      priority: 5,
    });
  }

  // Nameplate CFM is still a Learning gap even when kit link health is clean.
  if (hass.available) {
    const available = hass.available.bind(hass);
    const num = (id: string, fallback = NaN) => {
      const n = Number(hass.state(id, "nan"));
      return Number.isFinite(n) ? n : fallback;
    };
    const ducts: [string, string][] = [
      ["sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main"],
      ["sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4"],
      ["sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out"],
      ["sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc"],
    ];
    const anyNameplate = ducts.some(
      ([alloc, plate]) => resolveCfm(alloc, plate, { available, num }).kind === "nameplate",
    );
    if (anyNameplate) {
      gaps.push({
        id: "cfm-nameplate",
        label: "CFM nameplate",
        detail: "One or more ducts still guess CFM from fan % × nameplate — Learning measures real flow.",
        tone: "warn",
        href: "/tune/learning",
        cta: "Open Learning",
        priority: 40,
      });
    }
  }

  return gaps.sort((a, b) => a.priority - b.priority);
}

export function collectHonestyGapsFromFleet(
  fleet: import("./fleetModel").FleetSnapshot,
  hass?: HassLike,
): HonestyGap[] {
  const gaps: HonestyGap[] = [];

  if (!fleet.hub.online) {
    gaps.push({
      id: "hub-link",
      label: "Hub offline",
      detail: "The hub is offline — readings are held at their last known values. Reconnect snaps to live.",
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 9,
    });
  }

  if (fleet.hub.online && fleet.hub.values.heartbeat == null) {
    gaps.push({
      id: "beat-dark",
      label: "Heartbeat missing",
      detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 12,
    });
  }

  if (!fleet.panel.online) {
    const panelLimited = hass?.available?.("sensor.dsc_control_wifi_rssi") === true;
    gaps.push({
      id: "panel-dark",
      label: panelLimited ? "Panel limited link" : "Panel link down",
      detail: panelLimited
        ? "Panel Wi‑Fi is up but the panel link binary is off — treat as limited, not a full outage."
        : "The control panel link is down — check Fleet link chips for how long.",
      tone: "warn",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 14,
    });
  }

  if (fleet.system.reduced_kit) {
    gaps.push({
      id: "reduced-kit",
      label: "Capacity offline",
      detail: "A device that should be running is temporarily out of service or locked out.",
      tone: "warn",
      href: "/fleet",
      cta: "Review kit",
      priority: 20,
    });
  }

  if (hass) {
    gaps.push(...collectHonestyGaps(hass).filter((g) =>
      !["hub-link", "hub-dark", "beat-dark", "panel-dark", "reduced-kit"].includes(g.id),
    ));
  }

  return gaps.sort((a, b) => a.priority - b.priority);
}

export function nextRecommended(gaps: HonestyGap[]): HonestyGap | null {
  return gaps[0] ?? null;
}
