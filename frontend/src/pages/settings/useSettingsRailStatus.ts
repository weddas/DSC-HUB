import { useEffect, useState } from "react";
import { useFleetSelector } from "../../hooks/useFleet";
import { useGlobalModifiers } from "../../hooks/useGlobalModifiers";
import { usePreferences } from "../../hooks/usePreference";
import { useSettingsManifest } from "../../hooks/useSettingsManifest";
import { useZoneMeta } from "../../hooks/useZoneMeta";
import { useHubTunables } from "../../hooks/useHubTunables";
import { useAlertPrefs } from "../../hooks/useAlertPrefs";
import { ALERT_ENTITY_IDS } from "../../lib/alertPlaybook";
import { changedPreferenceKeys } from "../../lib/preferences";
import { get_automations } from "../../lib/fleetApi";
import type { SettingsSectionId } from "../../routes";

export type RailStatus = { text: string; tone?: "warn" | "bad" };

/**
 * Live status subtitle per rail entry — the transparency hook at L1: the rail says where
 * something is non-default or unhealthy before you open it. Every source loads on its
 * own and degrades to no subtitle; nothing here blocks the section pages.
 */
export function useSettingsRailStatus(): Partial<Record<SettingsSectionId, RailStatus>> {
  usePreferences(); // re-render on preference change
  const { modifiers } = useGlobalModifiers();
  const manifest = useSettingsManifest();
  const zones = useZoneMeta();
  const hub = useHubTunables();
  const alerts = useAlertPrefs();
  const [rules, setRules] = useState<{ total: number; enabled: number } | null>(null);
  const offline = useFleetSelector((v) => {
    const f = v.fleet;
    const seats = [f.hub, f.panel, ...Object.values(f.pots), ...Object.values(f.sonoffs)];
    const inService = new Set((f.inventory ?? []).filter((r) => r.in_service !== false).map((r) => r.seat_id));
    return seats.filter((s) => s && inService.has(s.seat_id) && !s.online).length;
  });

  useEffect(() => {
    get_automations()
      .then((r) => setRules({ total: r.rules.length, enabled: r.rules.filter((x) => x.enabled !== false).length }))
      .catch(() => setRules(null));
  }, []);

  const out: Partial<Record<SettingsSectionId, RailStatus>> = {};

  const changed = changedPreferenceKeys().length;
  out.preferences = { text: changed ? `${changed} changed` : "defaults" };

  if (!zones.loading && zones.zones.length) {
    const nonGrow = zones.zones.filter((z) => z.role && z.role !== "grow" && z.role !== "room").length;
    out.zones = { text: `${zones.zones.length} zones${nonGrow ? ` · ${nonGrow} not growing` : ""}` };
  } else if (zones.error) {
    out.zones = { text: "brain predates zones", tone: "warn" };
  }

  if (modifiers) {
    const fan = modifiers.fan_demand_scale;
    out.climate = fan !== 1 ? { text: `fans ×${fan.toFixed(2)}`, tone: "warn" } : { text: "fans nameplate" };
    const light = modifiers.light_brightness_scale;
    out.light = light !== 1 ? { text: `lamps ×${light.toFixed(2)}`, tone: "warn" } : { text: "lamps at schedule" };
    out.root = { text: `dry line ${modifiers.moisture_dry_pct}%` };
    const offsets = [
      ...Object.values(modifiers.temp_offset_c ?? {}),
      ...Object.values(modifiers.rh_offset_pct ?? {}),
    ].filter((v) => v !== 0).length;
    const leaf = manifest.values.leaf_offset_c;
    out.sensors = offsets
      ? { text: `${offsets} offset${offsets === 1 ? "" : "s"} set`, tone: "warn" }
      : { text: leaf != null ? `leaf −${String(leaf)} °C` : "no offsets" };
  }

  if (alerts.data) {
    const off = ALERT_ENTITY_IDS.filter((id) => !alerts.isEnabled(id)).length;
    const quiet = alerts.quietHours ? ` · quiet ${alerts.quietHours.start}–${alerts.quietHours.end}` : "";
    out.alerts = off ? { text: `${off} disabled${quiet}`, tone: "warn" } : { text: `all on${quiet}` };
  }

  // Hub-owned rows: a section with a row the hub disagrees on or a queued push says so.
  if (hub.data) {
    for (const section of ["climate", "light", "root"] as const) {
      const rows = hub.data.rows.filter((r) => r.section === section && r.present);
      const differs = rows.filter((r) => r.state === "differs").length;
      const pending = rows.filter((r) => r.state === "pending" || r.state === "held").length;
      if (differs) out[section] = { text: `${differs} hub differ${differs === 1 ? "s" : ""}`, tone: "bad" };
      else if (pending) out[section] = { text: `${pending} queued to hub`, tone: "warn" };
    }
  } else if (hub.state === "error") {
    out.climate = { text: "brain predates hub rows", tone: "warn" };
  }

  if (rules) out.automation = { text: rules.total ? `${rules.enabled}/${rules.total} rules on` : "no rules" };

  out.devices = offline ? { text: `${offline} offline`, tone: "bad" } : { text: "all online" };

  if (manifest.state === "ready") {
    const ollama = String(manifest.values.ollama_base_url ?? "");
    const canna = String(manifest.values.cannalib_api_url ?? "");
    out.integrations = { text: `${ollama ? "ollama" : "no ollama"} · ${canna ? "cannalib" : "local catalog"}` };
    const ch = manifest.values.ap_channel;
    if (ch != null) out.network = { text: `AP ch ${String(ch)}` };
    const days = manifest.values.fleet_history_retention_days;
    if (days != null) out.system = { text: Number(days) === 0 ? "history kept forever" : `${String(days)} d history` };
  } else if (manifest.state === "error") {
    out.system = { text: "old brain", tone: "warn" };
  }

  return out;
}
