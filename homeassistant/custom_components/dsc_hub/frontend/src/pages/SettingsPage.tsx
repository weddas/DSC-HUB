import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Icon, PageHeader, StatusChip, type IconName } from "../components/ui";
import { HelpTip } from "../components/HelpTip";
import { DecisionLayer } from "../components/DecisionLayer";
import {
  apply_network,
  backup_export_url,
  backup_import,
  get_catalog_status,
  get_esphome_devices,
  get_esphome_jobs,
  get_fleet_state,
  getGlobalModifiers,
  get_network_status,
  getProbeStations,
  get_settings,
  get_zigbee_devices,
  get_zigbee_health,
  get_zigbee_policies,
  get_zigbee_recipes,
  get_zigbee_roles,
  patch_inventory,
  patchGlobalModifiers,
  patchProbeStation,
  patch_settings,
  permit_join,
  put_zigbee_bindings,
  put_zigbee_policies,
  queue_esphome_job,
  reload_catalogs,
  test_cannalib,
  test_ollama,
  filterZigbeeRecipesForClass,
  filterZigbeeRolesForClass,
  isZigbeeSafetyLeakRole,
  zigbeeBannerTemplate,
  zigbeeFloodBannerTemplate,
  type ClimateZone,
  type GlobalModifiers,
  type ProbeStation,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../lib/fleetApi";
import { parseFleetSnapshot, type FleetSnapshot, type InventoryRow, type SeatSnapshot } from "../lib/fleetModel";
import { parseSettingsSection, type SettingsSectionId } from "../routes";
import { probeLabel } from "../lib/seatModel";

const AP_CHANNELS = ["1", "6", "11"];
const CLIMATE_ZONES: ClimateZone[] = ["room", "clone", "main"];
const ZONE_LABELS: Record<ClimateZone, string> = {
  room: "Room",
  clone: "2×4",
  main: "4×8",
};
const IDLE_POT_OPTIONS = ["", "pot1", "pot2"] as const;
const TENT_OPTIONS = ["2x4", "4x8"] as const;

const SECTION_SUBTITLE: Record<SettingsSectionId, string> = {
  hub: "Appliance backup and restore",
  brain: "Global tuning and catalog",
  device: "Inventory, assignment, probes, Zigbee, ESPHome",
  api: "Ollama and CannaLib integrations",
  network: "SoftAP and DHCP — Apply restarts hub Wi‑Fi",
  server: "ESPHome job queue and host ops",
  general: "Kit language and operator notes",
};

const AP_KEYS = ["ap_ssid", "ap_psk", "ap_channel"] as const;
const INTEGRATION_KEYS = [
  "ollama_base_url",
  "ollama_model",
  "cannalib_api_url",
  "cannalib_api_key",
  "cannalib_use_local_fallback",
] as const;

function pickSettings(settings: Record<string, string>, keys: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    if (settings[key] != null) out[key] = settings[key];
  }
  return out;
}

function inventoryGroup(seatId: string): string {
  const id = seatId.toLowerCase();
  if (id === "hub" || id === "control" || id === "panel") return "Brain & panel";
  if (id === "pot1" || id === "pot2") return "Kit probes";
  if (id === "pot3" || id === "pot4") return "Advanced restore (Probe 3–4)";
  if (id.startsWith("pot")) return "Probes";
  return "Appliances";
}

/** Per-device glyph — seat_id → icon. */
function seatIcon(seatId: string): IconName {
  const id = seatId.toLowerCase();
  if (id === "hub") return "system";
  if (id === "panel" || id.includes("control")) return "dash";
  if (id.startsWith("pot")) return "root";
  if (id.includes("tank")) return "tank";
  if (id.includes("mister") || id.includes("clone")) return "clone";
  if (id.includes("hum") || id.includes("heater") || id.includes("ac")) return "climate";
  if (id.includes("fan") || id.includes("intake") || id.includes("exhaust")) return "fan";
  if (id.includes("light") || id.includes("sf1000")) return "lighting";
  if (id.includes("mat")) return "root";
  return "fleet";
}

/** Zigbee device type → icon. */
function zigbeeIcon(type: string): IconName {
  return type === "Router" ? "system" : "gauge";
}

function parseZigbeePlacements(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (key && value) out[String(key)] = String(value);
    }
    return out;
  } catch {
    return {};
  }
}

const TANK_TASK_ID = "tank_full_appliance";
const FLOOD_TASK_ID = "floor_flood_alert";
const TASK_PARAM_IDS = new Set([TANK_TASK_ID, FLOOD_TASK_ID]);

function effectiveZigbeeClass(inferred: string, override?: string): string {
  return String(override || inferred || "other").toLowerCase();
}

function taskParamDefaults(
  recipeId: string,
  recipe: ZigbeeRecipe | undefined,
): Record<string, unknown> {
  const defaults = recipe?.default_params ?? {};
  if (recipeId === FLOOD_TASK_ID) {
    const problem_when = String(defaults.problem_when ?? "active");
    return {
      problem_when,
      banner: String(defaults.banner ?? zigbeeFloodBannerTemplate(problem_when)),
      banner_tone: String(defaults.banner_tone ?? "critical"),
    };
  }
  return {
    seat_id: String(defaults.seat_id ?? "dehumidifier"),
    problem_when: String(defaults.problem_when ?? "active"),
    force_relay: String(defaults.force_relay ?? "off"),
    banner: String(
      defaults.banner ??
        zigbeeBannerTemplate(
          String(defaults.seat_id ?? "dehumidifier"),
          String(defaults.problem_when ?? "active"),
        ),
    ),
    banner_tone: String(defaults.banner_tone ?? "critical"),
  };
}

function ZigbeeBindRow({
  ieee,
  name,
  model,
  status,
  role,
  zone,
  recipeId,
  policyParams,
  capabilityClass,
  capabilityOverride,
  showAll,
  onToggleShowAll,
  allRoles,
  allRecipes,
  onBindingChange,
  onPolicyChange,
  liveWet,
  liveProblem,
}: {
  ieee: string;
  name: string;
  model: string;
  status: string;
  role: string;
  zone: string;
  recipeId: string;
  policyParams: Record<string, unknown>;
  capabilityClass: string;
  capabilityOverride?: string;
  showAll: boolean;
  onToggleShowAll: () => void;
  allRoles: ZigbeeRole[];
  allRecipes: ZigbeeRecipe[];
  onBindingChange: (
    ieee: string,
    patch: { role: string; zone: string; recipe_id: string; capability_override?: string },
  ) => void;
  onPolicyChange: (ieee: string, patch: { recipe_id: string; params: Record<string, unknown> }) => void;
  liveWet?: boolean | null;
  liveProblem?: boolean | null;
}) {
  const effectiveClass = effectiveZigbeeClass(capabilityClass, capabilityOverride);
  let roleOptions = showAll ? allRoles : filterZigbeeRolesForClass(effectiveClass, allRoles);
  let recipeOptions = showAll ? allRecipes : filterZigbeeRecipesForClass(effectiveClass, allRecipes);
  if (!roleOptions.some((r) => r.id === role)) {
    const current = allRoles.find((r) => r.id === role);
    if (current) roleOptions = [...roleOptions, current];
  }
  if (!recipeOptions.some((r) => r.id === recipeId)) {
    const current = allRecipes.find((r) => r.id === recipeId);
    if (current) recipeOptions = [...recipeOptions, current];
  }
  const showTaskParams = role !== "unbound" && TASK_PARAM_IDS.has(recipeId);
  const isFlood = recipeId === FLOOD_TASK_ID;
  const seatId = String(policyParams.seat_id ?? "dehumidifier");
  const problemWhen = String(policyParams.problem_when ?? "active");
  const banner = String(policyParams.banner ?? "");

  const updateTaskParam = (patch: Partial<{ seat_id: string; problem_when: string; banner: string }>) => {
    const nextPolarity = patch.problem_when ?? problemWhen;
    let nextBanner = patch.banner ?? banner;
    if (isFlood) {
      const prevTemplate = zigbeeFloodBannerTemplate(problemWhen);
      if (patch.problem_when != null) {
        const nextTemplate = zigbeeFloodBannerTemplate(nextPolarity);
        if (banner === prevTemplate || !banner.trim()) {
          nextBanner = nextTemplate;
        }
      }
      onPolicyChange(ieee, {
        recipe_id: recipeId,
        params: {
          ...policyParams,
          problem_when: nextPolarity,
          banner: nextBanner,
          banner_tone: policyParams.banner_tone ?? "critical",
        },
      });
      return;
    }
    const nextSeat = patch.seat_id ?? seatId;
    const prevTemplate = zigbeeBannerTemplate(seatId, problemWhen);
    if (patch.seat_id != null || patch.problem_when != null) {
      const nextTemplate = zigbeeBannerTemplate(nextSeat, nextPolarity);
      if (banner === prevTemplate || !banner.trim()) {
        nextBanner = nextTemplate;
      }
    }
    onPolicyChange(ieee, {
      recipe_id: recipeId,
      params: {
        ...policyParams,
        seat_id: nextSeat,
        problem_when: nextPolarity,
        banner: nextBanner,
        force_relay: policyParams.force_relay ?? "off",
        banner_tone: policyParams.banner_tone ?? "critical",
      },
    });
  };

  return (
    <>
      <tr>
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name={zigbeeIcon("EndDevice")} size={14} color="var(--dsc-gray-5)" />
            {name}
          </div>
          <div className="dsc-muted" style={{ fontSize: 11 }}>
            {ieee || "—"}
            {capabilityOverride ? ` · class ${capabilityOverride}` : capabilityClass ? ` · ${capabilityClass}` : null}
          </div>
        </td>
        <td>{model || "—"}</td>
        <td>
          <div className="dsc-chip-row" style={{ flexWrap: "wrap" }}>
            <StatusChip
              label={status === "bound" ? "BOUND" : status === "conflict" ? "CONFLICT" : "UNBOUND"}
              tone={status === "bound" ? "ok" : status === "conflict" ? "warn" : "muted"}
            />
            {recipeId !== "none" && liveWet != null ? (
              <StatusChip label={liveWet ? "Wet" : "Dry"} tone={liveWet ? "warn" : "ok"} />
            ) : null}
            {recipeId !== "none" && liveProblem != null ? (
              <StatusChip label={liveProblem ? "Problem" : "Clear"} tone={liveProblem ? "warn" : "ok"} />
            ) : null}
          </div>
        </td>
        <td>
          <select
            value={role}
            onChange={(e) => {
              const nextRole = e.target.value;
              let nextOverride = capabilityOverride;
              if (showAll && isZigbeeSafetyLeakRole(nextRole) && (capabilityClass === "motion" || capabilityClass === "other")) {
                nextOverride = "liquid";
              } else if (!isZigbeeSafetyLeakRole(nextRole)) {
                nextOverride = undefined;
              }
              onBindingChange(ieee, {
                role: nextRole,
                zone,
                recipe_id: nextRole === "unbound" ? "none" : recipeId,
                capability_override: nextOverride,
              });
            }}
          >
            {roleOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            value={zone}
            onChange={(e) =>
              onBindingChange(ieee, { role, zone: e.target.value, recipe_id: recipeId, capability_override: capabilityOverride })
            }
          >
            <option value="4x8">4×8</option>
            <option value="2x4">2×4</option>
            <option value="room">Room</option>
            <option value="shared">Shared</option>
          </select>
        </td>
        <td>
          <select
            value={recipeId}
            onChange={(e) => {
              const nextRecipe = e.target.value;
              onBindingChange(ieee, { role, zone, recipe_id: nextRecipe, capability_override: capabilityOverride });
              if (TASK_PARAM_IDS.has(nextRecipe)) {
                onPolicyChange(ieee, {
                  recipe_id: nextRecipe,
                  params: taskParamDefaults(
                    nextRecipe,
                    allRecipes.find((r) => r.id === nextRecipe),
                  ),
                });
              } else if (nextRecipe === "none") {
                onPolicyChange(ieee, { recipe_id: "none", params: {} });
              }
            }}
            disabled={role === "unbound"}
            title={role === "unbound" ? "Bind a Role first" : "Task / recipe when sensor is active"}
          >
            {(recipeOptions.length
              ? recipeOptions
              : [
                  { id: "none", label: "No task" },
                  { id: TANK_TASK_ID, label: "Liquid level → appliance OOS" },
                  { id: FLOOD_TASK_ID, label: "Floor flood → alert" },
                ]
            ).map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </td>
        <td>
          <Button variant="secondary" onClick={onToggleShowAll}>
            {showAll ? "Filtered" : "Show all"}
          </Button>
        </td>
      </tr>
      {showTaskParams ? (
        <tr>
          <td colSpan={7} style={{ background: "var(--dsc-gray-1, rgba(255,255,255,0.03))" }}>
            <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
              {recipeId === TANK_TASK_ID ? (
                <label>
                  Appliance
                  <select value={seatId} onChange={(e) => updateTaskParam({ seat_id: e.target.value })}>
                    <option value="dehumidifier">Dehumidifier</option>
                    <option value="humidifier">Humidifier</option>
                  </select>
                </label>
              ) : null}
              <label>
                Problem when
                <select value={problemWhen} onChange={(e) => updateTaskParam({ problem_when: e.target.value })}>
                  <option value="active">Wet / active = problem</option>
                  <option value="inactive">Dry / inactive = problem</option>
                </select>
              </label>
              <label style={{ flex: "1 1 240px" }}>
                Banner text
                <input
                  type="text"
                  value={banner}
                  onChange={(e) => updateTaskParam({ banner: e.target.value })}
                  placeholder={
                    isFlood
                      ? zigbeeFloodBannerTemplate(problemWhen)
                      : zigbeeBannerTemplate(seatId, problemWhen)
                  }
                />
              </label>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function resolveSeat(fleet: FleetSnapshot, seatId: string): SeatSnapshot | null {
  if (seatId === "hub") return fleet.hub;
  if (seatId === "panel" || seatId === "control") return fleet.panel;
  if (fleet.pots[seatId]) return fleet.pots[seatId];
  if (fleet.sonoffs[seatId]) return fleet.sonoffs[seatId];
  return null;
}

function fmtLastSeen(ts: number | null | undefined): string {
  if (ts == null || !Number.isFinite(ts)) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function extraField(row: Record<string, unknown>, key: string): string {
  const extra = row.extra;
  if (extra && typeof extra === "object") {
    return String((extra as Record<string, unknown>)[key] ?? "");
  }
  if (typeof extra === "string" && extra) {
    try {
      const parsed = JSON.parse(extra) as Record<string, unknown>;
      return String(parsed[key] ?? "");
    } catch {
      return "";
    }
  }
  return "";
}

function DeviceAssignmentRow({
  row,
  onSave,
}: {
  row: Record<string, unknown>;
  onSave: (
    seatId: string,
    row: Record<string, unknown>,
    functionName: string,
    placement: string,
    capabilityMax: string,
  ) => Promise<void>;
}) {
  const seatId = String(row.seat_id ?? "");
  const [fn, setFn] = useState(extraField(row, "function"));
  const [place, setPlace] = useState(extraField(row, "placement"));
  const [cap, setCap] = useState(String(extraField(row, "capability_max_pct") || ""));

  useEffect(() => {
    setFn(extraField(row, "function"));
    setPlace(extraField(row, "placement"));
    setCap(String(extraField(row, "capability_max_pct") || ""));
  }, [row]);

  return (
    <tr>
      <td>{seatId}</td>
      <td>
        <input type="text" value={fn} onChange={(e) => setFn(e.target.value)} placeholder="e.g. intake_temp" />
      </td>
      <td>
        <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. 4x8 intake duct" />
      </td>
      <td>
        <input type="number" min="1" max="100" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="100" />
      </td>
      <td>
        <Button onClick={() => onSave(seatId, row, fn, place, cap)}>Save</Button>
      </td>
    </tr>
  );
}

function DeviceDetailCard({
  row,
  seat,
}: {
  row: InventoryRow & Record<string, unknown>;
  seat: SeatSnapshot | null;
}) {
  const seatId = String(row.seat_id ?? "—");
  const role = String(
    row.role ??
      (row.extra && typeof row.extra === "object"
        ? (row.extra as Record<string, unknown>).role
        : "—"),
  );
  const online = seat?.online ?? false;
  const inService = Boolean(row.in_service);
  const uptime = seat?.values?.uptime;
  const rssi = seat?.values?.wifi_rssi ?? seat?.values?.rssi;
  const calFn = extraField(row, "function");
  const calPlace = extraField(row, "placement");
  return (
    <div className="dsc-card">
      <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name={seatIcon(seatId)} size={16} color="var(--dsc-teal)" />
        {seatId}
        <StatusChip label={online ? "ONLINE" : "OFFLINE"} tone={online ? "ok" : "bad"} />
      </h3>
      <dl className="dsc-detail-list">
        <dt>Role</dt>
        <dd>{role}</dd>
        <dt>IP / host</dt>
        <dd>{String(row.host ?? seat?.values?.host ?? "—")}</dd>
        <dt>MAC</dt>
        <dd>{String(row.mac ?? "—")}</dd>
        <dt>Firmware</dt>
        <dd>{String(seat?.firmware ?? seat?.values?.firmware_version ?? "—")}</dd>
        <dt>Uptime</dt>
        <dd>{typeof uptime === "number" ? `${Math.round(uptime / 60)} min` : "—"}</dd>
        <dt>RSSI</dt>
        <dd>{rssi != null ? `${rssi} dBm` : "—"}</dd>
        <dt>Online</dt>
        <dd>{online ? "yes" : "no"}</dd>
        <dt>In service</dt>
        <dd>{inService ? "yes" : "no"}</dd>
        <dt>Function</dt>
        <dd>{calFn || "—"}</dd>
        <dt>Placement</dt>
        <dd>{calPlace || "—"}</dd>
        <dt>Last seen</dt>
        <dd>{fmtLastSeen(seat?.last_seen ?? null)}</dd>
      </dl>
    </div>
  );
}

export function SettingsPage() {
  const location = useLocation();
  const section = parseSettingsSection(location.pathname);
  const [apDraft, setApDraft] = useState<Record<string, string>>({});
  const [integrationsDraft, setIntegrationsDraft] = useState<Record<string, string>>({});
  const [inventory, setInventory] = useState<Array<Record<string, unknown>>>([]);
  const [fleet, setFleet] = useState<FleetSnapshot | null>(null);
  const [network, setNetwork] = useState<Record<string, unknown> | null>(null);
  const [catalog, setCatalog] = useState<Record<string, unknown> | null>(null);
  const [esphome, setEsphome] = useState<Array<Record<string, unknown>>>([]);
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [zigbeeDevices, setZigbeeDevices] = useState<Array<Record<string, unknown>>>([]);
  const [zigbeeHealth, setZigbeeHealth] = useState<Record<string, unknown> | null>(null);
  const [zigbeeRoles, setZigbeeRoles] = useState<ZigbeeRole[]>([]);
  const [zigbeeRecipes, setZigbeeRecipes] = useState<ZigbeeRecipe[]>([]);
  const [zigbeeBindDraft, setZigbeeBindDraft] = useState<
    Record<
      string,
      { role: string; zone: string; friendly_name: string; enabled: boolean; capability_override?: string }
    >
  >({});
  const [zigbeeShowAll, setZigbeeShowAll] = useState<Record<string, boolean>>({});
  const [zigbeePolicyDraft, setZigbeePolicyDraft] = useState<
    Record<string, { recipe_id: string; enabled: boolean; params: Record<string, unknown> }>
  >({});
  const [zigbeeBindDirty, setZigbeeBindDirty] = useState(false);
  const [ollamaResult, setOllamaResult] = useState<string>("");
  const [cannalibResult, setCannalibResult] = useState<string>("");
  const [networkResult, setNetworkResult] = useState<string>("");
  const [importResult, setImportResult] = useState<string>("");
  const [confirmNetwork, setConfirmNetwork] = useState(false);
  const [pendingInService, setPendingInService] = useState<{ seatId: string; next: boolean } | null>(null);
  const [pendingOta, setPendingOta] = useState<{ seatId: string; action: "ota" | "compile" } | null>(null);
  const [pendingPermitJoin, setPendingPermitJoin] = useState<boolean | null>(null);
  const [confirmReloadCatalogs, setConfirmReloadCatalogs] = useState(false);
  const [pendingImport, setPendingImport] = useState<File | null>(null);
  const [globalModifiers, setGlobalModifiers] = useState<GlobalModifiers | null>(null);
  const [modifiersDirty, setModifiersDirty] = useState(false);
  const [probeStations, setProbeStations] = useState<ProbeStation[]>([]);
  const [probeDrafts, setProbeDrafts] = useState<Record<string, { idle_home_pot_id: string; tent: string }>>({});
  const [probeErr, setProbeErr] = useState<string | null>(null);
  const [pendingClearProbe, setPendingClearProbe] = useState<string | null>(null);

  const refresh = async () => {
    const [
      s,
      net,
      cat,
      esp,
      j,
      fleetRaw,
      zigbee,
      zigbeeHealthRaw,
      modifiers,
      stations,
      rolesRaw,
      recipesRaw,
      policiesRaw,
    ] = await Promise.all([
      get_settings(),
      get_network_status(),
      get_catalog_status(),
      get_esphome_devices(),
      get_esphome_jobs(),
      get_fleet_state().catch(() => null),
      get_zigbee_devices().catch(() => ({ devices: [] as Array<Record<string, unknown>> })),
      get_zigbee_health().catch(() => null),
      getGlobalModifiers().catch(() => null),
      getProbeStations().catch(() => [] as ProbeStation[]),
      get_zigbee_roles().catch(() => ({ roles: [] as ZigbeeRole[] })),
      get_zigbee_recipes().catch(() => ({
        recipes: [] as ZigbeeRecipe[],
      })),
      get_zigbee_policies().catch(() => ({
        policies: {} as Record<
          string,
          { recipe_id: string; enabled?: boolean; params?: Record<string, unknown> }
        >,
      })),
    ]);
    setApDraft(pickSettings(s.settings, AP_KEYS));
    setIntegrationsDraft(pickSettings(s.settings, INTEGRATION_KEYS));
    setInventory(s.inventory);
    setNetwork(net);
    setCatalog(cat);
    setEsphome((esp.devices as Array<Record<string, unknown>>) ?? []);
    setJobs(j);
    setFleet(fleetRaw ? parseFleetSnapshot(fleetRaw) : null);
    setZigbeeDevices(zigbee.devices ?? []);
    setZigbeeHealth(zigbeeHealthRaw);
    setZigbeeRoles(rolesRaw.roles ?? []);
    setZigbeeRecipes(recipesRaw.recipes ?? []);
    if (!zigbeeBindDirty) {
      const draft: Record<
        string,
        { role: string; zone: string; friendly_name: string; enabled: boolean; capability_override?: string }
      > = {};
      const policyDraft: Record<
        string,
        { recipe_id: string; enabled: boolean; params: Record<string, unknown> }
      > = {};
      const policies = policiesRaw.policies ?? {};
      for (const d of zigbee.devices ?? []) {
        if (d.type === "Coordinator") continue;
        const ieee = String(d.ieee_address ?? "");
        if (!ieee) continue;
        const binding = (d.binding as Record<string, unknown> | null) || null;
        draft[ieee] = {
          role: String(binding?.role ?? "unbound"),
          zone: String(binding?.zone ?? "shared"),
          friendly_name: String(d.friendly_name ?? ""),
          enabled: binding?.enabled === false ? false : true,
          capability_override: binding?.capability_override
            ? String(binding.capability_override)
            : undefined,
        };
        const pol = policies[ieee];
        policyDraft[ieee] = {
          recipe_id: String(pol?.recipe_id ?? "none"),
          enabled: pol?.enabled === false ? false : true,
          params: (pol?.params as Record<string, unknown>) ?? {},
        };
      }
      setZigbeeBindDraft(draft);
      setZigbeePolicyDraft(policyDraft);
    }
    if (!modifiersDirty && modifiers) {
      setGlobalModifiers(modifiers);
    }
    setProbeStations(stations);
    setProbeDrafts((prev) => {
      const next: Record<string, { idle_home_pot_id: string; tent: string }> = {};
      for (const st of stations) {
        const existing = prev[st.seat_id];
        // Prefer existing in-progress draft; otherwise seed from server.
        // Empty idle_home is valid — never coerce "" → seat_id.
        next[st.seat_id] = existing ?? {
          idle_home_pot_id: st.idle_home_pot_id ?? "",
          tent: st.tent || "2x4",
        };
      }
      return next;
    });
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  // While permit-join is open, poll Zigbee health/devices so a newly paired end
  // device appears in the Role/Zone/Task table without a hard refresh.
  useEffect(() => {
    if (zigbeeHealth?.permit_join !== true) return;
    const id = window.setInterval(() => {
      void (async () => {
        try {
          const [zigbee, zigbeeHealthRaw, policiesRaw] = await Promise.all([
            get_zigbee_devices().catch(() => ({ devices: [] as Array<Record<string, unknown>> })),
            get_zigbee_health().catch(() => null),
            get_zigbee_policies().catch(() => ({
              policies: {} as Record<
                string,
                { recipe_id: string; enabled?: boolean; params?: Record<string, unknown> }
              >,
            })),
          ]);
          setZigbeeDevices(zigbee.devices ?? []);
          setZigbeeHealth(zigbeeHealthRaw);
          if (!zigbeeBindDirty) {
            const draft: Record<
              string,
              { role: string; zone: string; friendly_name: string; enabled: boolean; capability_override?: string }
            > = {};
            const policyDraft: Record<
              string,
              { recipe_id: string; enabled: boolean; params: Record<string, unknown> }
            > = {};
            const policies = policiesRaw.policies ?? {};
            for (const d of zigbee.devices ?? []) {
              if (d.type === "Coordinator") continue;
              const ieee = String(d.ieee_address ?? "");
              if (!ieee) continue;
              const binding = (d.binding as Record<string, unknown> | null) || null;
              draft[ieee] = {
                role: String(binding?.role ?? "unbound"),
                zone: String(binding?.zone ?? "shared"),
                friendly_name: String(d.friendly_name ?? ""),
                enabled: binding?.enabled === false ? false : true,
                capability_override: binding?.capability_override
                  ? String(binding.capability_override)
                  : undefined,
              };
              const pol = policies[ieee];
              policyDraft[ieee] = {
                recipe_id: String(pol?.recipe_id ?? "none"),
                enabled: pol?.enabled === false ? false : true,
                params: (pol?.params as Record<string, unknown>) ?? {},
              };
            }
            setZigbeeBindDraft(draft);
            setZigbeePolicyDraft(policyDraft);
          }
        } catch {
          /* join poll is best-effort */
        }
      })();
    }, 4000);
    return () => window.clearInterval(id);
  }, [zigbeeHealth?.permit_join, zigbeeBindDirty]);

  const saveIntegrations = async () => {
    await patch_settings(integrationsDraft);
    await refresh();
  };

  const saveNetworkDraft = async () => {
    await patch_settings(apDraft);
  };

  const toggleInService = async (seatId: string, inService: boolean) => {
    await patch_inventory(seatId, { in_service: inService });
    await refresh();
  };

  const saveDeviceMeta = async (
    seatId: string,
    row: Record<string, unknown>,
    functionName: string,
    placement: string,
    capabilityMax: string,
  ) => {
    const extra =
      row.extra && typeof row.extra === "object"
        ? { ...(row.extra as Record<string, unknown>) }
        : {};
    extra.function = functionName;
    extra.placement = placement;
    if (capabilityMax) extra.capability_max_pct = Number(capabilityMax);
    await patch_inventory(seatId, { extra });
    await refresh();
  };

  const inventoryRows = useMemo(
    () =>
      inventory.map((row) => ({
        ...(row as unknown as InventoryRow),
        seat: fleet ? resolveSeat(fleet, String(row.seat_id)) : null,
      })),
    [inventory, fleet],
  );

  const inventoryGroups = useMemo(() => {
    const groups = new Map<string, typeof inventoryRows>();
    for (const row of inventoryRows) {
      const group = inventoryGroup(String(row.seat_id));
      const list = groups.get(group) ?? [];
      list.push(row);
      groups.set(group, list);
    }
    return Array.from(groups.entries());
  }, [inventoryRows]);

  return (
    <div className="dsc-page">
      <PageHeader
        icon="settings"
        title="Settings"
        subtitle={SECTION_SUBTITLE[section]}
        actions={
          <HelpTip title="In service">
            <p>
              <b>In service</b> means the brain treats the probe as live kit. Out of service stays visible but never fakes
              Got — grey quiet, not an alarm flood.
            </p>
            <p>Example: spare probe offline → uncheck In service → Root and cockpits stop counting it.</p>
          </HelpTip>
        }
      />

      <section className="dsc-card" hidden={section !== "device"}>
        <h3>Fleet inventory</h3>
        <p className="dsc-muted">
          Device funnel: discover (ESPHome / Zigbee below) → assign function/placement → In service. Brain only consumes
          in-service kit. <b>Kit probes</b> are Probe 1–2 (Live Root). <b>Advanced restore</b> holds Probe 3–4 hardware
          rows for bring-back — not Live cards.
        </p>
        <p className="dsc-muted">Every device with its address, firmware, online state, and service status.</p>
        {inventoryGroups.map(([group, rows]) => (
          <details
            key={group}
            className="dsc-inventory-group"
            open={
              group.startsWith("Advanced")
                ? false
                : rows.some(({ seat, in_service }) => !(seat?.online ?? false) || !in_service)
            }
          >
            <summary>{group}</summary>
            <div className="dsc-grid">
              {rows.map(({ seat, ...row }) => (
                <div key={String(row.seat_id)} className="dsc-col-4">
                  <DeviceDetailCard row={row} seat={seat} />
                  <label style={{ display: "block", marginTop: 8, fontSize: "0.85rem" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(row.in_service)}
                      onChange={(e) =>
                        setPendingInService({ seatId: String(row.seat_id), next: e.target.checked })
                      }
                    />{" "}
                    In service
                  </label>
                </div>
              ))}
            </div>
          </details>
        ))}
        <DecisionLayer
          open={pendingInService != null}
          onDismiss={() => setPendingInService(null)}
          onConfirm={async () => {
            if (!pendingInService) return;
            const { seatId, next } = pendingInService;
            setPendingInService(null);
            await toggleInService(seatId, next);
          }}
          title={
            pendingInService?.next
              ? `Put ${pendingInService.seatId} in service`
              : `Take ${pendingInService?.seatId ?? "device"} out of service`
          }
          confirmLabel={pendingInService?.next ? "Enable" : "Disable"}
          help={null}
        >
          <p>
            {pendingInService?.next
              ? "The brain will treat this seat as part of the live kit."
              : "Out-of-service seats stay visible but never fake readings."}
          </p>
        </DecisionLayer>
      </section>

      <section className="dsc-card" hidden={section !== "device"}>
        <h3>Device assignment</h3>
        <p className="dsc-muted">
          Function and placement tell the brain what each sensor/fan measures. Capability override caps max fan/light
          output when hardware differs from nameplate.
        </p>
        <div className="dsc-table-scroll">
          <table className="dsc-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Function</th>
              <th>Placement</th>
              <th>Max %</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {inventory.map((row) => (
              <DeviceAssignmentRow key={String(row.seat_id)} row={row} onSave={saveDeviceMeta} />
            ))}
          </tbody>
        </table>
        </div>
      </section>

      <section className="dsc-card" hidden={section !== "brain"}>
        <details className="dsc-inventory-group" open>
          <summary>Global tuning</summary>
          <p className="dsc-muted">
            Fleet-wide fan/light demand scale (0.5–1.5) and per-zone temperature / RH sensor offsets applied before
            control and ingest.
          </p>
          {globalModifiers ? (
            <>
              <label>
                Fan demand scale
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={globalModifiers.fan_demand_scale}
                  onChange={(e) => {
                    setModifiersDirty(true);
                    setGlobalModifiers({
                      ...globalModifiers,
                      fan_demand_scale: Number(e.target.value),
                    });
                  }}
                />
                <span className="dsc-muted">{globalModifiers.fan_demand_scale.toFixed(2)}</span>
              </label>
              <label>
                Light brightness scale
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={globalModifiers.light_brightness_scale}
                  onChange={(e) => {
                    setModifiersDirty(true);
                    setGlobalModifiers({
                      ...globalModifiers,
                      light_brightness_scale: Number(e.target.value),
                    });
                  }}
                />
                <span className="dsc-muted">{globalModifiers.light_brightness_scale.toFixed(2)}</span>
              </label>
              <div className="dsc-table-scroll">
                <table className="dsc-table">
                  <thead>
                    <tr>
                      <th>Zone</th>
                      <th>Temp offset °C</th>
                      <th>RH offset %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLIMATE_ZONES.map((zone) => (
                      <tr key={zone}>
                        <td>{ZONE_LABELS[zone]}</td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            aria-label={`${ZONE_LABELS[zone]} temp offset °C`}
                            value={globalModifiers.temp_offset_c[zone]}
                            onChange={(e) => {
                              setModifiersDirty(true);
                              const n = Number(e.target.value);
                              setGlobalModifiers({
                                ...globalModifiers,
                                temp_offset_c: {
                                  ...globalModifiers.temp_offset_c,
                                  [zone]: Number.isFinite(n) ? n : 0,
                                },
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.5"
                            aria-label={`${ZONE_LABELS[zone]} RH offset %`}
                            value={globalModifiers.rh_offset_pct[zone]}
                            onChange={(e) => {
                              setModifiersDirty(true);
                              const n = Number(e.target.value);
                              setGlobalModifiers({
                                ...globalModifiers,
                                rh_offset_pct: {
                                  ...globalModifiers.rh_offset_pct,
                                  [zone]: Number.isFinite(n) ? n : 0,
                                },
                              });
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={async () => {
                  if (!globalModifiers) return;
                  const saved = await patchGlobalModifiers({
                    fan_demand_scale: globalModifiers.fan_demand_scale,
                    light_brightness_scale: globalModifiers.light_brightness_scale,
                    temp_offset_c: globalModifiers.temp_offset_c,
                    rh_offset_pct: globalModifiers.rh_offset_pct,
                  });
                  setGlobalModifiers(saved);
                  setModifiersDirty(false);
                }}
              >
                Save global tuning
              </Button>
            </>
          ) : (
            <p className="dsc-muted">Loading modifiers…</p>
          )}
        </details>
      </section>

      <section className="dsc-card" hidden={section !== "device"}>
        <details className="dsc-inventory-group" open={probeStations.some((s) => s.reading_mode !== "idle")}>
          <summary>Probe stations</summary>
          <p className="dsc-muted">
            Mobile soil probes idle at a home pot and publish thereabouts readings until a soil test moves them.
            Unassign clears the home pot; Remove probe role demotes the seat so it is no longer a probe station.
          </p>
          {probeStations.length ? (
            <div className="dsc-table-scroll">
              <table className="dsc-table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Mode</th>
                    <th>Idle home pot</th>
                    <th>Tent</th>
                    <th>Thereabouts moisture</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {probeStations.map((st) => {
                    const draft = probeDrafts[st.seat_id] ?? {
                      idle_home_pot_id: st.idle_home_pot_id,
                      tent: st.tent,
                    };
                    const moist = st.thereabouts?.moisture_pct;
                    return (
                      <tr key={st.seat_id}>
                        <td>
                          {st.seat_id}
                          <StatusChip
                            label={st.online ? "ONLINE" : "OFFLINE"}
                            tone={st.online ? "ok" : "bad"}
                          />
                        </td>
                        <td>{st.reading_mode}</td>
                        <td>
                          <select
                            value={draft.idle_home_pot_id}
                            onChange={(e) =>
                              setProbeDrafts((prev) => ({
                                ...prev,
                                [st.seat_id]: { ...draft, idle_home_pot_id: e.target.value },
                              }))
                            }
                          >
                            {IDLE_POT_OPTIONS.map((p) => (
                              <option key={p || "none"} value={p}>
                                {p ? probeLabel(Number(p.replace("pot", ""))) : "— unassigned"}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={draft.tent}
                            onChange={(e) =>
                              setProbeDrafts((prev) => ({
                                ...prev,
                                [st.seat_id]: { ...draft, tent: e.target.value },
                              }))
                            }
                          >
                            {TENT_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{moist != null && Number.isFinite(Number(moist)) ? `${Number(moist).toFixed(1)} %` : "—"}</td>
                        <td>
                          <div className="dsc-row-actions">
                            <Button
                              onClick={async () => {
                                setProbeErr(null);
                                try {
                                  await patchProbeStation(st.seat_id, draft);
                                  await refresh();
                                } catch (exc) {
                                  setProbeErr(exc instanceof Error ? exc.message : "Probe save failed");
                                }
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={async () => {
                                setProbeErr(null);
                                try {
                                  await patchProbeStation(st.seat_id, { idle_home_pot_id: "" });
                                  setProbeDrafts((prev) => ({
                                    ...prev,
                                    [st.seat_id]: { ...draft, idle_home_pot_id: "" },
                                  }));
                                  await refresh();
                                } catch (exc) {
                                  setProbeErr(exc instanceof Error ? exc.message : "Unassign failed");
                                }
                              }}
                            >
                              Unassign home
                            </Button>
                            <Button variant="danger" onClick={() => setPendingClearProbe(st.seat_id)}>
                              Remove probe role
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dsc-honesty">No probe stations — assign role probe_station on a pot in inventory.</p>
          )}
          {probeErr ? (
            <p className="dsc-honesty">
              <StatusChip label="Probe update failed" tone="bad" /> {probeErr}
            </p>
          ) : null}
        </details>
      </section>

      <DecisionLayer
        open={pendingClearProbe != null}
        onDismiss={() => setPendingClearProbe(null)}
        onConfirm={() => {
          const seatId = pendingClearProbe;
          setPendingClearProbe(null);
          if (!seatId) return;
          void (async () => {
            setProbeErr(null);
            try {
              await patchProbeStation(seatId, { clear_role: true });
              setProbeDrafts((prev) => {
                const next = { ...prev };
                delete next[seatId];
                return next;
              });
              await refresh();
            } catch (exc) {
              setProbeErr(exc instanceof Error ? exc.message : "Remove probe role failed");
            }
          })();
        }}
        title={pendingClearProbe ? `Remove probe role from ${pendingClearProbe}?` : "Remove probe role"}
        confirmLabel="Remove probe role"
        help={null}
      >
        <p>
          Demotes this seat so it is no longer a probe station (clears idle home and probe attachment). Does not delete
          plants or soil readings.
        </p>
      </DecisionLayer>

      <section className="dsc-card" hidden={section !== "network"}>
        <h3>Network</h3>
        <p className="dsc-muted">
          Channel is limited to 1, 6, or 11. Applying restarts the hub&apos;s Wi-Fi — devices reconnect on their own.
        </p>
        <label>
          AP SSID
          <input
            type="text"
            value={apDraft.ap_ssid ?? ""}
            onChange={(e) => setApDraft({ ...apDraft, ap_ssid: e.target.value })}
          />
        </label>
        <label>
          AP PSK
          <input
            type="password"
            value={apDraft.ap_psk ?? ""}
            onChange={(e) => setApDraft({ ...apDraft, ap_psk: e.target.value })}
            placeholder={network?.ap_psk_set ? "••••••••" : "set on first save"}
          />
        </label>
        <label>
          Channel
          <select
            value={apDraft.ap_channel ?? "6"}
            onChange={(e) => setApDraft({ ...apDraft, ap_channel: e.target.value })}
          >
            {AP_CHANNELS.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </label>
        {network?.dhcp_map ? (
          <div className="dsc-table-scroll">
            <table className="dsc-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Host</th>
                  <th>MAC</th>
                </tr>
              </thead>
              <tbody>
                {(network.dhcp_map as Array<Record<string, unknown>>).map((row) => (
                  <tr key={String(row.seat_id)}>
                    <td>{String(row.seat_id)}</td>
                    <td>{String(row.host ?? "—")}</td>
                    <td>{String(row.mac ?? "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <Button variant="danger" onClick={() => setConfirmNetwork(true)}>
          Apply network
        </Button>
        {networkResult ? <pre className="dsc-honesty">{networkResult}</pre> : null}
        <DecisionLayer
          open={confirmNetwork}
          onDismiss={() => setConfirmNetwork(false)}
          onConfirm={async () => {
            setConfirmNetwork(false);
            await saveNetworkDraft();
            const r = await apply_network();
            setNetworkResult(JSON.stringify(r, null, 2));
            await refresh();
          }}
          title="Apply network settings"
          confirmLabel="Apply and restart Wi-Fi"
          help={null}
        >
          <p>
            Saves AP SSID, PSK, and channel only — then restarts the hub&apos;s Wi-Fi. Devices drop off briefly and
            reconnect on their own.
          </p>
        </DecisionLayer>
      </section>

      <section className="dsc-card" hidden={section !== "api"}>
        <h3>Integrations</h3>
        <label>
          Ollama URL
          <input
            type="text"
            value={integrationsDraft.ollama_base_url ?? ""}
            onChange={(e) => setIntegrationsDraft({ ...integrationsDraft, ollama_base_url: e.target.value })}
            placeholder="http://192.168.86.2:11434"
          />
        </label>
        <label>
          Ollama model
          <input
            type="text"
            value={integrationsDraft.ollama_model ?? ""}
            onChange={(e) => setIntegrationsDraft({ ...integrationsDraft, ollama_model: e.target.value })}
          />
        </label>
        <Button onClick={async () => setOllamaResult(JSON.stringify(await test_ollama()))}>Test Ollama</Button>
        {ollamaResult ? <pre className="dsc-honesty">{ollamaResult}</pre> : null}

        <label>
          CannaLib API URL
          <input
            type="text"
            value={integrationsDraft.cannalib_api_url ?? ""}
            onChange={(e) => setIntegrationsDraft({ ...integrationsDraft, cannalib_api_url: e.target.value })}
          />
        </label>
        <label>
          CannaLib API key
          <input
            type="password"
            value={integrationsDraft.cannalib_api_key ?? ""}
            onChange={(e) => setIntegrationsDraft({ ...integrationsDraft, cannalib_api_key: e.target.value })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={(integrationsDraft.cannalib_use_local_fallback ?? "true") === "true"}
            onChange={(e) =>
              setIntegrationsDraft({
                ...integrationsDraft,
                cannalib_use_local_fallback: e.target.checked ? "true" : "false",
              })
            }
          />
          Use on-Pi sqlite fallback when remote API is down
        </label>
        <Button onClick={async () => setCannalibResult(JSON.stringify(await test_cannalib()))}>
          Test CannaLib
        </Button>
        {cannalibResult ? <pre className="dsc-honesty">{cannalibResult}</pre> : null}
      </section>

      <section className="dsc-card" hidden={section !== "brain"}>
        <h3>Catalog</h3>
        <p className="dsc-honesty">
          {catalog ? String(catalog.note ?? "—") : "Loading…"} (source:{" "}
          {catalog ? String(catalog.source ?? "unknown") : "—"})
          {catalog?.cannalib_api_url ? (
            <>
              {" "}
              — URL: <code>{String(catalog.cannalib_api_url)}</code>
            </>
          ) : null}
        </p>
        <p className="dsc-muted">
          Chemistry, height, and lineage come straight from the catalog — gaps are never filled with guesses.
        </p>
        <Button onClick={async () => setCatalog(await get_catalog_status())}>Refresh status</Button>
        <Button onClick={() => setConfirmReloadCatalogs(true)}>Reload local catalogs</Button>
        <DecisionLayer
          open={confirmReloadCatalogs}
          onDismiss={() => setConfirmReloadCatalogs(false)}
          onConfirm={async () => {
            setConfirmReloadCatalogs(false);
            await reload_catalogs();
            setCatalog(await get_catalog_status());
          }}
          title="Reload local catalogs"
          confirmLabel="Reload"
          help={null}
        >
          <p>Re-reads on-Pi catalog indexes. Compose and Research pick up changes after reload.</p>
        </DecisionLayer>
      </section>

      <section className="dsc-card" hidden={section !== "device" && section !== "server"}>
        <h3>ESPHome</h3>
        <p className="dsc-muted">
          Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it.
        </p>
        <p className="dsc-muted">Pot 5 and beyond are unavailable until their firmware exists.</p>
        <div className="dsc-table-scroll">
          <table className="dsc-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>YAML</th>
              <th>Expected</th>
              <th>Last seen</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {esphome.map((row) => (
              <tr key={String(row.seat_id)}>
                <td>{String(row.seat_id)}</td>
                <td>{String(row.yaml ?? "—")}</td>
                <td>{String(row.expected_firmware ?? "—")}</td>
                <td>{row.online ? String(row.last_firmware ?? "online") : "offline"}</td>
                <td>
                  <Button onClick={() => setPendingOta({ seatId: String(row.seat_id), action: "ota" })}>
                    Queue OTA
                  </Button>
                  <Button onClick={() => setPendingOta({ seatId: String(row.seat_id), action: "compile" })}>
                    Queue compile
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <DecisionLayer
          open={pendingOta != null}
          onDismiss={() => setPendingOta(null)}
          onConfirm={async () => {
            if (!pendingOta) return;
            const job = pendingOta;
            setPendingOta(null);
            await queue_esphome_job(job.seatId, job.action);
            await refresh();
          }}
          title={pendingOta?.action === "compile" ? "Queue firmware compile" : "Queue OTA flash"}
          confirmLabel={pendingOta?.action === "compile" ? "Queue compile" : "Queue OTA"}
          help={null}
        >
          <p>
            Queues an ESPHome {pendingOta?.action === "compile" ? "compile" : "OTA"} job for{" "}
            <strong>{pendingOta?.seatId ?? "device"}</strong>. Nothing flashes until the build worker runs.
          </p>
        </DecisionLayer>
        {jobs.length ? (
          <pre className="dsc-honesty">{JSON.stringify(jobs.slice(0, 3), null, 2)}</pre>
        ) : null}
      </section>

      <section className="dsc-card" hidden={section !== "device"}>
        <h3>Zigbee (SkyConnect)</h3>
        <p className="dsc-muted">Extra canopy sensors and smart plugs — separate from climate control.</p>
        <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
          <StatusChip
            label={
              zigbeeHealth == null ? "RADIO …" : zigbeeHealth.radio_up === true ? "RADIO UP" : "RADIO DOWN"
            }
            tone={
              zigbeeHealth == null ? "muted" : zigbeeHealth.radio_up === true ? "ok" : "bad"
            }
          />
          {zigbeeHealth?.mqtt_connected === false ? (
            <StatusChip label="MQTT OFFLINE" tone="bad" />
          ) : null}
          {zigbeeHealth?.permit_join === true ? <StatusChip label="JOIN OPEN" tone="warn" /> : null}
          {zigbeeHealth?.radio_note ? (
            <span className="dsc-muted" style={{ fontSize: 12 }}>
              {String(zigbeeHealth.radio_note)}
            </span>
          ) : null}
        </div>
        <div className="dsc-row-actions">
          <Button onClick={() => setPendingPermitJoin(true)} disabled={zigbeeHealth?.radio_up !== true}>
            Permit join (~4 min)
          </Button>
          <Button onClick={() => setPendingPermitJoin(false)}>Stop join</Button>
        </div>
        <DecisionLayer
          open={pendingPermitJoin != null}
          onDismiss={() => setPendingPermitJoin(null)}
          onConfirm={async () => {
            const enable = pendingPermitJoin === true;
            setPendingPermitJoin(null);
            await permit_join(enable);
            await refresh();
          }}
          title={pendingPermitJoin ? "Permit Zigbee join" : "Stop Zigbee join"}
          confirmLabel={pendingPermitJoin ? "Permit join" : "Stop join"}
          help={null}
        >
          <p>
            {pendingPermitJoin
              ? "Opens the coordinator for new devices for about four minutes (z2m max). Factory-reset sensors from the old Thread/Zigbee network before pairing — this coordinator is a new network (channel 11)."
              : "Closes join mode on the SkyConnect coordinator."}
          </p>
        </DecisionLayer>
        {zigbeeDevices.filter((d) => d.type !== "Coordinator").length ? (
          <>
            <p className="dsc-muted" style={{ marginTop: 12 }}>
              New devices appear after permit join. Assign a <strong>Role</strong>, <strong>Zone</strong>, and
              optional <strong>Task</strong> — lists are filtered by device type; use <strong>Show all</strong> for
              mis-fingerprinted sensors (e.g. occupancy-only liquid probes).
            </p>
            <p className="dsc-muted" style={{ marginTop: 8, fontSize: 13 }}>
              Role is where this sensor lives (intake, canopy, tank…). Task is optional — leave <strong>No task</strong>{" "}
              to only report into Live/Climate.
            </p>
            {Object.values(zigbeeBindDraft).filter((b) => b.role === "unbound").length ? (
              <StatusChip
                label={`UNBOUND ${Object.values(zigbeeBindDraft).filter((b) => b.role === "unbound").length}`}
                tone="warn"
              />
            ) : null}
            <div className="dsc-table-scroll">
              <table className="dsc-table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Model</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Zone</th>
                    <th>Task</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {zigbeeDevices
                    .filter((d) => d.type !== "Coordinator")
                    .map((d) => {
                      const ieee = String(d.ieee_address ?? "");
                      const draft = zigbeeBindDraft[ieee] ?? {
                        role: "unbound",
                        zone: "shared",
                        friendly_name: String(d.friendly_name ?? ""),
                        enabled: true,
                      };
                      const policy = zigbeePolicyDraft[ieee] ?? {
                        recipe_id: "none",
                        enabled: true,
                        params: {},
                      };
                      const model = `${String(d.vendor ?? "")}${d.model ? ` ${String(d.model)}` : ""}`.trim();
                      const fallbackRoles: ZigbeeRole[] = [
                        { id: "unbound", label: "Unbound", kind: "none" },
                        { id: "canopy_4x8", label: "Canopy 4×8", kind: "climate" },
                        { id: "canopy_2x4", label: "Canopy 2×4", kind: "climate" },
                        { id: "intake", label: "Intake", kind: "climate" },
                        { id: "exhaust", label: "Exhaust", kind: "climate" },
                        { id: "room", label: "Room", kind: "climate" },
                        { id: "clone_dome", label: "Clone dome", kind: "climate" },
                        { id: "leak_tank", label: "Tank / reservoir leak", kind: "safety" },
                        { id: "leak_floor", label: "Water leak (floor)", kind: "safety" },
                        { id: "leak_floor_room", label: "Water leak (floor · room)", kind: "safety" },
                        { id: "leak_floor_4x8", label: "Water leak (floor · 4×8)", kind: "safety" },
                        { id: "leak_floor_2x4", label: "Water leak (floor · 2×4)", kind: "safety" },
                      ];
                      const fallbackRecipes: ZigbeeRecipe[] = [
                        { id: "none", label: "No task" },
                        {
                          id: TANK_TASK_ID,
                          label: "Liquid level → appliance OOS",
                          device_classes: ["liquid", "safety"],
                          default_params: taskParamDefaults(TANK_TASK_ID, undefined),
                        },
                        {
                          id: FLOOD_TASK_ID,
                          label: "Floor flood → alert",
                          device_classes: ["liquid", "safety"],
                          default_params: taskParamDefaults(FLOOD_TASK_ID, undefined),
                        },
                      ];
                      const zigbeePolicyLive = (fleet?.system?.zigbee_policy_state ?? {}) as Record<
                        string,
                        { problem?: boolean }
                      >;
                      const zigbeeByRoleLive = (fleet?.system?.zigbee_by_role ??
                        fleet?.system?.zigbee_by_placement ??
                        {}) as Record<string, { wet?: boolean; active?: boolean }>;
                      const roleLive = zigbeeByRoleLive[draft.role];
                      const liveWet =
                        typeof roleLive?.wet === "boolean"
                          ? roleLive.wet
                          : typeof roleLive?.active === "boolean"
                            ? roleLive.active
                            : null;
                      const policyLive = zigbeePolicyLive[ieee];
                      const liveProblem =
                        policy.recipe_id !== "none" && policyLive && typeof policyLive.problem === "boolean"
                          ? Boolean(policyLive.problem)
                          : null;
                      return (
                        <ZigbeeBindRow
                          key={ieee || String(d.friendly_name)}
                          ieee={ieee}
                          name={String(d.friendly_name ?? "—")}
                          model={model}
                          status={String(d.status ?? (draft.role === "unbound" ? "unbound" : "bound"))}
                          role={draft.role}
                          zone={draft.zone}
                          recipeId={policy.recipe_id}
                          policyParams={policy.params}
                          capabilityClass={String(d.capability_class ?? "other")}
                          capabilityOverride={draft.capability_override}
                          showAll={Boolean(zigbeeShowAll[ieee])}
                          liveWet={liveWet}
                          liveProblem={liveProblem}
                          onToggleShowAll={() =>
                            setZigbeeShowAll((prev) => ({ ...prev, [ieee]: !prev[ieee] }))
                          }
                          allRoles={zigbeeRoles.length ? zigbeeRoles : fallbackRoles}
                          allRecipes={zigbeeRecipes.length ? zigbeeRecipes : fallbackRecipes}
                          onBindingChange={(id, patch) => {
                            setZigbeeBindDirty(true);
                            setZigbeeBindDraft((prev) => {
                              const base = {
                                role: patch.role,
                                zone: patch.zone,
                                friendly_name: String(d.friendly_name ?? prev[id]?.friendly_name ?? ""),
                                enabled: true,
                              };
                              if (patch.capability_override) {
                                return { ...prev, [id]: { ...base, capability_override: patch.capability_override } };
                              }
                              return { ...prev, [id]: base };
                            });
                            setZigbeePolicyDraft((prev) => ({
                              ...prev,
                              [id]: {
                                recipe_id: patch.role === "unbound" ? "none" : patch.recipe_id,
                                enabled: true,
                                params: patch.role === "unbound" ? {} : (prev[id]?.params ?? {}),
                              },
                            }));
                          }}
                          onPolicyChange={(id, patch) => {
                            setZigbeeBindDirty(true);
                            setZigbeePolicyDraft((prev) => ({
                              ...prev,
                              [id]: {
                                recipe_id: patch.recipe_id,
                                enabled: true,
                                params: patch.params,
                              },
                            }));
                          }}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
            <Button
              onClick={async () => {
                await put_zigbee_bindings(zigbeeBindDraft);
                await put_zigbee_policies(zigbeePolicyDraft);
                setZigbeeBindDirty(false);
                await refresh();
              }}
              disabled={!zigbeeBindDirty}
            >
              Save roles &amp; tasks
            </Button>
          </>
        ) : zigbeeHealth == null ? (
          <p className="dsc-muted" style={{ marginTop: 10 }}>
            Loading Zigbee radio status…
          </p>
        ) : zigbeeHealth.radio_up === true ? (
          <div className="dsc-muted" style={{ marginTop: 10, fontSize: 13, lineHeight: 1.45 }}>
            <p style={{ margin: "0 0 8px" }}>
              Coordinator online — no end devices yet. Role/Zone rows appear here as soon as a sensor joins
              (this page polls while JOIN OPEN).
            </p>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              <li>Confirm JOIN OPEN (or tap Permit join ~4 min). Keep house ZHA pairing closed so the sensor joins this SkyConnect.</li>
              <li>
                Factory-reset a TS0201 (hold reset ~5s until LED blinks). Leaving ZHA alone is not enough —
                hold reset near this Pi. Freed grow sensors: Canopy Middle/Left/Right, Tent Top, Floor, Tent Bottom.
                DSC network is new after Zigbee re-flash (channel 11).
              </li>
              <li>
                When the Unbound row appears, assign Role + Zone → Save roles (or wait for auto-bind). Climate /
                Overview / Twin pick it up immediately.
              </li>
            </ol>
          </div>
        ) : (
          <p className="dsc-muted" style={{ marginTop: 10 }}>
            SkyConnect coordinator is not online — fix USB, power, and <code>dsc-hub-z2m</code> logs before pairing.
            An empty device list here means the radio is down, not that you have a clean network.
          </p>
        )}
      </section>

      <section className="dsc-card" hidden={section !== "hub"}>
        <h3>Backup</h3>
        <p className="dsc-muted">Export ops sqlite, manifest, optional .env and z2m data.</p>
        <a className="dsc-button" href={backup_export_url()} download="dsc-hub-backup.zip">
          Download backup
        </a>
        <label>
          Import backup
          <input
            type="file"
            accept=".zip"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPendingImport(f);
              e.target.value = "";
            }}
          />
        </label>
        <DecisionLayer
          open={pendingImport != null}
          onDismiss={() => setPendingImport(null)}
          onConfirm={async () => {
            const f = pendingImport;
            setPendingImport(null);
            if (!f) return;
            setImportResult(JSON.stringify(await backup_import(f)));
          }}
          title="Import backup"
          confirmLabel="Import"
          help={null}
        >
          <p>
            Restores ops sqlite and related files from <strong>{pendingImport?.name ?? "backup"}</strong>. This
            overwrites live Pi state.
          </p>
        </DecisionLayer>
        {importResult ? <pre className="dsc-honesty">{importResult}</pre> : null}
      </section>

      {section === "api" ? (
        <Button primary onClick={saveIntegrations}>
          Save integrations
        </Button>
      ) : null}

      {section === "general" ? (
        <section className="dsc-card">
          <h3>General</h3>
          <p className="dsc-muted">
            Operator kit is Probe 1–2. Live Root and SoftCal only offer kit probes. Device →{" "}
            <b>Advanced restore</b> is where Probe 3–4 inventory seats live (toggle in-service when hardware returns).
          </p>
          <p className="dsc-honesty">
            Settings are split by blast radius: Hub (backup), Brain (tuning), Device (kit), API, Network, Server
            (ESPHome jobs), General.
          </p>
        </section>
      ) : null}

      {section === "server" ? (
        <p className="dsc-muted" style={{ marginTop: 8 }}>
          ESPHome queue and device table are shared with Device. Prefer Device for day-to-day OTA; use this tab when
          watching job history.
        </p>
      ) : null}
    </div>
  );
}
