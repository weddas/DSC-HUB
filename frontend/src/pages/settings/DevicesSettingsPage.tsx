import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Icon, StatusChip } from "../../components/ui";
import { DecisionLayer } from "../../components/DecisionLayer";
import { DeviceAssignmentRow } from "../../components/settings/DeviceAssignmentRow";
import { DeviceSeatDrawer, type SeatMetaDraft } from "../../components/settings/DeviceSeatDrawer";
import { ZigbeeBindDrawer, type ZigbeeBindValue } from "../../components/settings/ZigbeeBindDrawer";
import { SettingRow, SettingsCard, Stated, Toggle } from "../../components/settings/SettingRow";
import { TextSettingRow } from "../../components/settings/TextSettingRow";
import { FLOOD_TASK_ID, IDLE_PROBE_OPTIONS, TANK_TASK_ID, TENT_OPTIONS } from "../../components/settings/settingsConstants";
import { inventoryGroup, resolveSeat, seatIcon, taskParamDefaults } from "../../components/settings/settingsHelpers";
import { ActionsCell, HealthCell, SettingsTable, SettingsRow } from "../../components/settings/SettingsTable";
import { ZigbeeCatalogCard } from "../../components/settings/ZigbeeCatalogCard";
import { TuyaLocalCard } from "../../components/settings/TuyaLocalCard";
import { KitUpdateCard } from "../../components/settings/KitUpdateCard";
import { CamerasCard } from "../../components/settings/CamerasCard";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { manifestDefaultLabel, useSettingsManifest } from "../../hooks/useSettingsManifest";
import {
  create_extra_seat,
  get_esphome_devices,
  get_esphome_jobs,
  get_esphome_rollout,
  get_esphome_toolchain,
  get_fleet_state,
  getProbeStations,
  get_settings,
  get_zigbee_devices,
  get_zigbee_health,
  get_zigbee_policies,
  get_zigbee_recipes,
  get_zigbee_roles,
  patch_inventory,
  patch_settings,
  patchProbeStation,
  permit_join,
  put_zigbee_bindings,
  put_zigbee_policies,
  queue_esphome_job,
  rollback_esphome_toolchain,
  start_esphome_rollout,
  update_esphome_toolchain,
  type EsphomeRolloutMode,
  type ProbeStation,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../../lib/fleetApi";
import { parseFleetSnapshot, type FleetSnapshot, type InventoryRow } from "../../lib/fleetModel";
import { probeLabel } from "../../lib/probeModel";
import { formatStamp } from "../../lib/units";
import { paths } from "../../lib/paths";

/**
 * Settings › Devices (plan-settings S5) — five sub-tabs, one list each, depth capped at a
 * drawer: Inventory (seat rows → seat drawer), Assignment (bulk table + probe stations),
 * Zigbee (catalogue, join, bindings → bind drawer, Tuya lane), Cameras (S7), Firmware
 * (ESPHome toolchain + jobs, kit update, advanced rows). The sub-tab is the URL anchor
 * (`#/settings/devices#zigbee`), so every old deep link still lands.
 */

type SubTab = "inventory" | "assignment" | "zigbee" | "cameras" | "firmware";
const SUB_TABS: { id: SubTab; label: string; anchors: string[] }[] = [
  { id: "inventory", label: "Inventory", anchors: ["inventory", "add-seat"] },
  { id: "assignment", label: "Assignment", anchors: ["assignment", "probe-stations"] },
  { id: "zigbee", label: "Zigbee", anchors: ["zigbee", "zigbee-catalog", "tuya"] },
  { id: "cameras", label: "Cameras", anchors: ["cameras"] },
  { id: "firmware", label: "Firmware", anchors: ["firmware", "toolchain", "jobs", "kit-update", "firmware-advanced"] },
];
function tabForAnchor(hash: string): SubTab {
  const a = hash.replace(/^#/, "").toLowerCase();
  if (!a) return "inventory";
  for (const t of SUB_TABS) if (t.anchors.some((x) => a === x || a.startsWith(`${x}-`))) return t.id;
  return "inventory";
}

type BindDraft = {
  role: string;
  zone: string;
  friendly_name: string;
  alias?: string;
  enabled: boolean;
  capability_override?: string;
};
type PolicyDraft = { recipe_id: string; enabled: boolean; params: Record<string, unknown> };
type PoliciesRaw = {
  policies: Record<string, { recipe_id: string; enabled?: boolean; params?: Record<string, unknown> }>;
};

function buildZigbeeDrafts(
  devices: Array<Record<string, unknown>>,
  policies: PoliciesRaw["policies"],
): { bind: Record<string, BindDraft>; policy: Record<string, PolicyDraft> } {
  const bind: Record<string, BindDraft> = {};
  const policy: Record<string, PolicyDraft> = {};
  for (const d of devices) {
    if (d.type === "Coordinator") continue;
    const ieee = String(d.ieee_address ?? "");
    if (!ieee) continue;
    const binding = (d.binding as Record<string, unknown> | null) || null;
    bind[ieee] = {
      role: String(binding?.role ?? "unbound"),
      zone: String(binding?.zone ?? "shared"),
      friendly_name: String(d.friendly_name ?? ""),
      alias: binding?.alias ? String(binding.alias) : undefined,
      enabled: binding?.enabled === false ? false : true,
      capability_override: binding?.capability_override ? String(binding.capability_override) : undefined,
    };
    const pol = policies[ieee];
    policy[ieee] = {
      recipe_id: String(pol?.recipe_id ?? "none"),
      enabled: pol?.enabled === false ? false : true,
      params: (pol?.params as Record<string, unknown>) ?? {},
    };
  }
  return { bind, policy };
}

const EMPTY_POLICIES: PoliciesRaw = { policies: {} };

const FALLBACK_ROLES: ZigbeeRole[] = [
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
const FALLBACK_RECIPES: ZigbeeRecipe[] = [
  { id: "none", label: "No task" },
  { id: TANK_TASK_ID, label: "Liquid level → appliance OOS", device_classes: ["liquid", "safety"], default_params: taskParamDefaults(TANK_TASK_ID, undefined) },
  { id: FLOOD_TASK_ID, label: "Floor flood → alert", device_classes: ["liquid", "safety"], default_params: taskParamDefaults(FLOOD_TASK_ID, undefined) },
];

export function DevicesSettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = tabForAnchor(location.hash);
  const [inventory, setInventory] = useState<Array<Record<string, unknown>>>([]);
  const [fleet, setFleet] = useState<FleetSnapshot | null>(null);
  const [esphome, setEsphome] = useState<Array<Record<string, unknown>>>([]);
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [toolchain, setToolchain] = useState<Record<string, unknown> | null>(null);
  const [rollout, setRollout] = useState<Record<string, unknown> | null>(null);
  const [toolchainMsg, setToolchainMsg] = useState<string>("");
  const [pendingToolchain, setPendingToolchain] = useState(false);
  const [pendingRollout, setPendingRollout] = useState<EsphomeRolloutMode | null>(null);
  const [pendingRollback, setPendingRollback] = useState(false);
  const [zigbeeDevices, setZigbeeDevices] = useState<Array<Record<string, unknown>>>([]);
  const [zigbeeHealth, setZigbeeHealth] = useState<Record<string, unknown> | null>(null);
  const [zigbeeRoles, setZigbeeRoles] = useState<ZigbeeRole[]>([]);
  const [zigbeeRecipes, setZigbeeRecipes] = useState<ZigbeeRecipe[]>([]);
  const [zigbeeBind, setZigbeeBind] = useState<Record<string, BindDraft>>({});
  const [zigbeePolicy, setZigbeePolicy] = useState<Record<string, PolicyDraft>>({});
  const [editingIeee, setEditingIeee] = useState<string | null>(null);
  const [pendingInService, setPendingInService] = useState<{ seatId: string; next: boolean } | null>(null);
  const [pendingOta, setPendingOta] = useState<{ seatId: string; action: "ota" | "compile" } | null>(null);
  const [pendingPermitJoin, setPendingPermitJoin] = useState<boolean | null>(null);
  const [probeStations, setProbeStations] = useState<ProbeStation[]>([]);
  const [probeDrafts, setProbeDrafts] = useState<Record<string, { idle_home_pot_id: string; tent: string }>>({});
  const [probeErr, setProbeErr] = useState<string | null>(null);
  const [pendingClearProbe, setPendingClearProbe] = useState<string | null>(null);
  const [openSeat, setOpenSeat] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [addSeatDraft, setAddSeatDraft] = useState<{ seat_id: string; name: string; placement: string; kind: "sensor" | "appliance" }>({
    seat_id: "",
    name: "",
    placement: "shared",
    kind: "sensor",
  });
  const [pendingAddSeat, setPendingAddSeat] = useState(false);
  const [addSeatMsg, setAddSeatMsg] = useState<string>("");

  const refresh = async () => {
    const [s, esp, j, fleetRaw, zigbee, zigbeeHealthRaw, stations, rolesRaw, recipesRaw, policiesRaw] = await Promise.all([
      get_settings(),
      get_esphome_devices().catch(() => ({ devices: [] as Array<Record<string, unknown>> })),
      get_esphome_jobs().catch(() => [] as Array<Record<string, unknown>>),
      get_fleet_state().catch(() => null),
      get_zigbee_devices().catch(() => ({ devices: [] as Array<Record<string, unknown>> })),
      get_zigbee_health().catch(() => null),
      getProbeStations().catch(() => [] as ProbeStation[]),
      get_zigbee_roles().catch(() => ({ roles: [] as ZigbeeRole[] })),
      get_zigbee_recipes().catch(() => ({ recipes: [] as ZigbeeRecipe[] })),
      get_zigbee_policies().catch(() => EMPTY_POLICIES),
    ]);
    setInventory(s.inventory);
    setSettings((s.settings as Record<string, string>) ?? {});
    setEsphome((esp.devices as Array<Record<string, unknown>>) ?? []);
    setJobs(j);
    void get_esphome_toolchain().then(setToolchain).catch(() => setToolchain(null));
    void get_esphome_rollout().then(setRollout).catch(() => setRollout(null));
    setFleet(fleetRaw ? parseFleetSnapshot(fleetRaw) : null);
    setZigbeeDevices(zigbee.devices ?? []);
    setZigbeeHealth(zigbeeHealthRaw);
    setZigbeeRoles(rolesRaw.roles ?? []);
    setZigbeeRecipes(recipesRaw.recipes ?? []);
    const drafts = buildZigbeeDrafts(zigbee.devices ?? [], (policiesRaw as PoliciesRaw).policies ?? {});
    setZigbeeBind(drafts.bind);
    setZigbeePolicy(drafts.policy);
    setProbeStations(stations);
    setProbeDrafts((prev) => {
      const next: Record<string, { idle_home_pot_id: string; tent: string }> = {};
      for (const st of stations) {
        next[st.seat_id] = prev[st.seat_id] ?? { idle_home_pot_id: st.idle_home_pot_id ?? "", tent: st.tent || "2x4" };
      }
      return next;
    });
  };

  useEffect(() => {
    refresh().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While permit-join is open, poll so a newly paired device appears without a hard refresh.
  useEffect(() => {
    if (zigbeeHealth?.permit_join !== true) return;
    const id = window.setInterval(() => {
      void (async () => {
        try {
          const [zigbee, zigbeeHealthRaw, policiesRaw] = await Promise.all([
            get_zigbee_devices().catch(() => ({ devices: [] as Array<Record<string, unknown>> })),
            get_zigbee_health().catch(() => null),
            get_zigbee_policies().catch(() => EMPTY_POLICIES),
          ]);
          setZigbeeDevices(zigbee.devices ?? []);
          setZigbeeHealth(zigbeeHealthRaw);
          if (editingIeee == null) {
            const drafts = buildZigbeeDrafts(zigbee.devices ?? [], (policiesRaw as PoliciesRaw).policies ?? {});
            setZigbeeBind(drafts.bind);
            setZigbeePolicy(drafts.policy);
          }
        } catch {
          /* join poll is best-effort */
        }
      })();
    }, 4000);
    return () => window.clearInterval(id);
  }, [zigbeeHealth?.permit_join, editingIeee]);

  const toggleInService = async (seatId: string, inService: boolean) => {
    await patch_inventory(seatId, { in_service: inService });
    await refresh();
  };

  const saveDeviceMeta = async (seatId: string, row: Record<string, unknown>, functionName: string, placement: string, capabilityMax: string) => {
    const extra = row.extra && typeof row.extra === "object" ? { ...(row.extra as Record<string, unknown>) } : {};
    extra.function = functionName;
    extra.placement = placement;
    if (capabilityMax) extra.capability_max_pct = Number(capabilityMax);
    else delete extra.capability_max_pct;
    await patch_inventory(seatId, { extra });
    await refresh();
  };

  const inventoryRows = useMemo(
    () => inventory.map((row) => ({ ...(row as unknown as InventoryRow & Record<string, unknown>), seat: fleet ? resolveSeat(fleet, String(row.seat_id)) : null })),
    [inventory, fleet],
  );
  const inventoryGroups = useMemo(() => {
    const groups = new Map<string, typeof inventoryRows>();
    for (const row of inventoryRows) {
      const group = inventoryGroup(String(row.seat_id));
      groups.set(group, [...(groups.get(group) ?? []), row]);
    }
    return Array.from(groups.entries());
  }, [inventoryRows]);
  const openRow = inventoryRows.find((r) => String(r.seat_id) === openSeat) ?? null;

  const zigbeeEnd = zigbeeDevices.filter((d) => d.type !== "Coordinator");
  const unbound = Object.values(zigbeeBind).filter((b) => b.role === "unbound").length;
  const editingDevice = editingIeee ? zigbeeEnd.find((d) => String(d.ieee_address ?? "") === editingIeee) ?? null : null;
  const editingValue: ZigbeeBindValue | null =
    editingIeee && zigbeeBind[editingIeee]
      ? {
          alias: zigbeeBind[editingIeee].alias ?? "",
          role: zigbeeBind[editingIeee].role,
          zone: zigbeeBind[editingIeee].zone,
          recipe_id: zigbeePolicy[editingIeee]?.recipe_id ?? "none",
          params: zigbeePolicy[editingIeee]?.params ?? {},
          capability_override: zigbeeBind[editingIeee].capability_override,
        }
      : null;

  const saveBinding = async (ieee: string, next: ZigbeeBindValue) => {
    const bind: Record<string, BindDraft> = {
      ...zigbeeBind,
      [ieee]: {
        ...(zigbeeBind[ieee] ?? { friendly_name: String(editingDevice?.friendly_name ?? ""), enabled: true }),
        role: next.role,
        zone: next.zone,
        alias: next.alias.trim() || undefined,
        capability_override: next.capability_override,
        enabled: true,
      },
    };
    const policy: Record<string, PolicyDraft> = {
      ...zigbeePolicy,
      [ieee]: { recipe_id: next.role === "unbound" ? "none" : next.recipe_id, enabled: true, params: next.role === "unbound" ? {} : next.params },
    };
    await put_zigbee_bindings(bind);
    await put_zigbee_policies(policy);
    await refresh();
  };

  const zigbeePolicyLive = (fleet?.system?.zigbee_policy_state ?? {}) as Record<string, { problem?: boolean }>;
  const zigbeeByRoleLive = (fleet?.system?.zigbee_by_role ?? fleet?.system?.zigbee_by_placement ?? {}) as Record<string, { wet?: boolean; active?: boolean }>;
  const roleLabel = (id: string) => (zigbeeRoles.length ? zigbeeRoles : FALLBACK_ROLES).find((r) => r.id === id)?.label ?? id;
  const recipeLabel = (id: string) => (zigbeeRecipes.length ? zigbeeRecipes : FALLBACK_RECIPES).find((r) => r.id === id)?.label ?? id;

  const offline = inventoryRows.filter((r) => r.in_service && !(r.seat?.online ?? false)).length;
  const oos = inventoryRows.filter((r) => !r.in_service).length;
  const subCounts: Record<SubTab, string> = {
    inventory: offline ? `${offline} offline` : `${inventoryRows.length} seats`,
    assignment: `${probeStations.length} station${probeStations.length === 1 ? "" : "s"}`,
    zigbee: zigbeeHealth?.radio_up === true ? (unbound ? `${unbound} unbound` : `${zigbeeEnd.length} devices`) : zigbeeHealth ? "radio down" : "…",
    cameras: "",
    firmware: jobs.some((j) => j.status === "running" || j.status === "queued") ? "job running" : String(toolchain?.installed ?? ""),
  };

  return (
    <>
      <nav className="dsc-subtabs" aria-label="Devices sections">
        {SUB_TABS.map((t) => (
          <a
            key={t.id}
            href={`#${paths.settings("devices", t.id)}`}
            className={`dsc-subtab${tab === t.id ? " active" : ""}`}
            aria-current={tab === t.id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              navigate(paths.settings("devices", t.id));
            }}
          >
            {t.label}
            {subCounts[t.id] ? <span className="dsc-subtab-sub">{subCounts[t.id]}</span> : null}
          </a>
        ))}
      </nav>

      {tab === "inventory" ? (
        <>
          <SettingsCard
            id="inventory"
            title="Fleet inventory"
            icon="smart-outlet"
            intro="Discover (ESPHome / Zigbee) → assign function and placement → In service. The brain only consumes in-service kit; out-of-service seats stay visible but never fake a reading. Groups with an offline or out-of-service seat open by themselves."
            actions={
              <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                {inventoryRows.length} seats · {offline} offline · {oos} out of service
              </span>
            }
          >
            <details className="dsc-inventory-group" id="add-seat">
              <summary>Add device / seat</summary>
              <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-md)", marginTop: 4 }}>
                Register a Zigbee sensor or extra appliance the firmware doesn&apos;t define. It lands <b>out of service</b> — bind its role on the Zigbee tab, then enable it once it&apos;s wired.
              </p>
              <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
                <label>
                  Seat ID
                  <input
                    type="text"
                    value={addSeatDraft.seat_id}
                    placeholder="e.g. fan_wall_2x4"
                    onChange={(e) => setAddSeatDraft((d) => ({ ...d, seat_id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") }))}
                  />
                </label>
                <label>
                  Name
                  <input type="text" value={addSeatDraft.name} placeholder="Wall fan (2×4)" onChange={(e) => setAddSeatDraft((d) => ({ ...d, name: e.target.value }))} />
                </label>
                <label>
                  Placement
                  <select value={addSeatDraft.placement} onChange={(e) => setAddSeatDraft((d) => ({ ...d, placement: e.target.value }))}>
                    <option value="4x8">4×8</option>
                    <option value="2x4">2×4</option>
                    <option value="room">Room</option>
                    <option value="shared">Shared</option>
                  </select>
                </label>
                <label>
                  Kind
                  <select value={addSeatDraft.kind} onChange={(e) => setAddSeatDraft((d) => ({ ...d, kind: e.target.value as "sensor" | "appliance" }))}>
                    <option value="sensor">Sensor</option>
                    <option value="appliance">Appliance</option>
                  </select>
                </label>
                <Button primary disabled={!/^[a-z][a-z0-9_]{1,63}$/.test(addSeatDraft.seat_id) || !addSeatDraft.name.trim()} onClick={() => setPendingAddSeat(true)}>
                  Add seat
                </Button>
              </div>
              {addSeatMsg ? <p className="dsc-honesty">{addSeatMsg}</p> : null}
            </details>

            {inventoryGroups.map(([group, rows]) => (
              <details
                key={group}
                className="dsc-inventory-group"
                open={group.startsWith("Advanced") ? false : rows.some(({ seat, in_service }) => !(seat?.online ?? false) || !in_service)}
              >
                <summary>
                  {group} <span className="dsc-muted">· {rows.length}</span>
                </summary>
                <div className="dsc-device-list">
                  {rows.map(({ seat, ...row }) => {
                    const seatId = String(row.seat_id);
                    const online = seat?.online ?? false;
                    const fn = row.extra && typeof row.extra === "object" ? String((row.extra as Record<string, unknown>).function ?? "") : "";
                    const place = row.extra && typeof row.extra === "object" ? String((row.extra as Record<string, unknown>).placement ?? "") : "";
                    return (
                      <div key={seatId} className={`dsc-device-row${!row.in_service ? " is-oos" : !online ? " is-offline" : ""}`}>
                        <Icon name={seatIcon(seatId)} size={16} className="dsc-device-row-icon" />
                        <button type="button" className="dsc-device-row-main" onClick={() => setOpenSeat(seatId)} aria-label={`Open ${seatId}`}>
                          <span className="dsc-device-row-name">{seatId}</span>
                          <span className="dsc-device-row-sub">{[fn, place].filter(Boolean).join(" · ") || String((row as Record<string, unknown>).role ?? "")}</span>
                        </button>
                        <StatusChip label={online ? "ONLINE" : "OFFLINE"} tone={online ? "ok" : row.in_service ? "bad" : "muted"} />
                        <Toggle checked={Boolean(row.in_service)} label={`${seatId} in service`} onChange={(next) => setPendingInService({ seatId, next })} />
                        <button type="button" className="dsc-device-row-open" onClick={() => setOpenSeat(seatId)} aria-label={`Details for ${seatId}`}>
                          ›
                        </button>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </SettingsCard>
          <DeviceSeatDrawer
            open={openRow != null}
            onClose={() => setOpenSeat(null)}
            row={openRow ? (({ seat: _s, ...r }) => r as InventoryRow & Record<string, unknown>)(openRow) : null}
            seat={openRow?.seat ?? null}
            onSave={(seatId, row, d: SeatMetaDraft) => saveDeviceMeta(seatId, row, d.functionName, d.placement, d.capabilityMax)}
          />
          <DecisionLayer
            open={pendingAddSeat}
            onDismiss={() => setPendingAddSeat(false)}
            onConfirm={async () => {
              setPendingAddSeat(false);
              try {
                await create_extra_seat({
                  seat_id: addSeatDraft.seat_id,
                  role: addSeatDraft.kind === "appliance" ? "appliance" : "sensor",
                  in_service: false,
                  extra: { function: addSeatDraft.name.trim(), placement: addSeatDraft.placement },
                });
                setAddSeatMsg(`Added ${addSeatDraft.seat_id} — out of service. Bind it on the Zigbee tab, then enable.`);
                setAddSeatDraft({ seat_id: "", name: "", placement: "shared", kind: "sensor" });
                await refresh();
              } catch (e) {
                setAddSeatMsg(String((e as Error).message || e));
              }
            }}
            title={`Add seat "${addSeatDraft.seat_id}"`}
            confirmLabel="Add seat"
            help={null}
          >
            <p>
              Creates an inventory row for <strong>{addSeatDraft.name || addSeatDraft.seat_id}</strong> ({addSeatDraft.kind}, {addSeatDraft.placement}). It starts <b>out of service</b> and fakes no readings until you enable it.
            </p>
          </DecisionLayer>
          <DecisionLayer
            open={pendingInService != null}
            onDismiss={() => setPendingInService(null)}
            onConfirm={async () => {
              if (!pendingInService) return;
              const { seatId, next } = pendingInService;
              setPendingInService(null);
              await toggleInService(seatId, next);
            }}
            title={pendingInService?.next ? `Put ${pendingInService.seatId} in service` : `Take ${pendingInService?.seatId ?? "device"} out of service`}
            confirmLabel={pendingInService?.next ? "Enable" : "Disable"}
            help={null}
          >
            <p>{pendingInService?.next ? "The brain will treat this seat as part of the live kit." : "Out-of-service seats stay visible but never fake readings."}</p>
          </DecisionLayer>
        </>
      ) : null}

      {tab === "assignment" ? (
        <>
          <section className="dsc-card" id="assignment" style={{ scrollMarginTop: 80 }}>
            <h3>Device assignment</h3>
            <p className="dsc-muted">
              Function and placement tell the brain what each sensor or fan measures. Capability override caps max fan/light output when hardware differs from nameplate. One seat at a time lives in the Inventory drawer; this table is for doing the lot.
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

          <section className="dsc-card" id="probe-stations" style={{ scrollMarginTop: 80 }}>
            <h3>Probe stations</h3>
            <p className="dsc-muted">
              Mobile soil probes idle at a home probe slot and publish thereabouts readings until a soil test moves them. Unassign clears the home slot; Remove probe role demotes the seat.
            </p>
            {probeStations.length ? (
              <div className="dsc-table-scroll">
                <table className="dsc-table">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Mode</th>
                      <th>Idle home probe</th>
                      <th>Tent</th>
                      <th>Thereabouts moisture</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {probeStations.map((st) => {
                      const draft = probeDrafts[st.seat_id] ?? { idle_home_pot_id: st.idle_home_pot_id, tent: st.tent };
                      // Same guard RootPage applies to the same field: an untrustworthy home has no
                      // "thereabouts" worth printing, whatever the payload happens to carry.
                      const moist = st.home_trustworthy === false ? null : st.thereabouts?.moisture_pct;
                      return (
                        <tr key={st.seat_id}>
                          <td>
                            {st.seat_id} <StatusChip label={st.online ? "ONLINE" : "OFFLINE"} tone={st.online ? "ok" : "bad"} />
                          </td>
                          <td>{st.reading_mode}</td>
                          <td>
                            <select value={draft.idle_home_pot_id} onChange={(e) => setProbeDrafts((prev) => ({ ...prev, [st.seat_id]: { ...draft, idle_home_pot_id: e.target.value } }))}>
                              {IDLE_PROBE_OPTIONS.map((p) => (
                                <option key={p || "none"} value={p}>
                                  {p ? probeLabel(Number(p.replace("pot", ""))) : "— unassigned"}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select value={draft.tent} onChange={(e) => setProbeDrafts((prev) => ({ ...prev, [st.seat_id]: { ...draft, tent: e.target.value } }))}>
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
                                    setProbeDrafts((prev) => ({ ...prev, [st.seat_id]: { ...draft, idle_home_pot_id: "" } }));
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
              <p className="dsc-honesty">No probe stations — assign role probe_station on a probe in inventory.</p>
            )}
            {probeErr ? (
              <p className="dsc-honesty">
                <StatusChip label="Probe update failed" tone="bad" /> {probeErr}
              </p>
            ) : null}
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
            <p>Demotes this seat so it is no longer a probe station (clears idle home and probe attachment). Does not delete plants or soil readings.</p>
          </DecisionLayer>
        </>
      ) : null}

      {tab === "zigbee" ? (
        <>
          <div id="zigbee-catalog" style={{ scrollMarginTop: 80 }}>
            <ZigbeeCatalogCard onSaved={() => void refresh()} />
          </div>
          <section className="dsc-card" id="zigbee" style={{ scrollMarginTop: 80 }}>
            <h3>Zigbee (SkyConnect)</h3>
            <p className="dsc-muted">Extra canopy sensors and smart plugs — separate from climate control. Each device's role, zone and task live in its drawer.</p>
            <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
              <StatusChip
                label={zigbeeHealth == null ? "RADIO …" : zigbeeHealth.radio_up === true ? "RADIO UP" : "RADIO DOWN"}
                tone={zigbeeHealth == null ? "muted" : zigbeeHealth.radio_up === true ? "ok" : "bad"}
              />
              {zigbeeHealth?.mqtt_connected === false ? <StatusChip label="MQTT OFFLINE" tone="bad" /> : null}
              {zigbeeHealth?.permit_join === true ? <StatusChip label="JOIN OPEN" tone="warn" /> : null}
              {unbound ? <StatusChip label={`UNBOUND ${unbound}`} tone="warn" /> : null}
              {zigbeeHealth?.radio_note ? <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>{String(zigbeeHealth.radio_note)}</span> : null}
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
            {zigbeeEnd.length ? (
              <SettingsTable
                columns={[
                  { key: "device", label: "Device" },
                  { key: "model", label: "Model" },
                  { key: "health", label: "Health", tight: true },
                  { key: "status", label: "Status" },
                  { key: "role", label: "Role" },
                  { key: "zone", label: "Zone" },
                  { key: "task", label: "Task" },
                  { key: "act", label: "", tight: true },
                ]}
                help={{
                  title: "Bind",
                  body: (
                    <>
                      <p>Open a device to rename it and set its role (where it lives), zone and optional task. Lists are filtered by device type; the drawer's Show all reveals the rest for mis-fingerprinted sensors.</p>
                      <p>
                        <b>Health</b> is battery, link quality (LQI) and last-seen from the device&apos;s own reports; amber means low battery, weak link, or silent for over an hour.
                      </p>
                    </>
                  ),
                }}
              >
                {zigbeeEnd.map((d) => {
                  const ieee = String(d.ieee_address ?? "");
                  const b = zigbeeBind[ieee];
                  const p = zigbeePolicy[ieee];
                  const model = `${String(d.vendor ?? "")}${d.model ? ` ${String(d.model)}` : ""}`.trim();
                  const status = String(d.status ?? (b?.role === "unbound" ? "unbound" : "bound"));
                  const roleLive = b ? zigbeeByRoleLive[b.role] : undefined;
                  const liveWet = typeof roleLive?.wet === "boolean" ? roleLive.wet : typeof roleLive?.active === "boolean" ? roleLive.active : null;
                  const policyLive = zigbeePolicyLive[ieee];
                  const liveProblem = p && p.recipe_id !== "none" && policyLive && typeof policyLive.problem === "boolean" ? Boolean(policyLive.problem) : null;
                  return (
                    <SettingsRow key={ieee || String(d.friendly_name)}>
                      <td>
                        <button type="button" className="dsc-link-btn" onClick={() => setEditingIeee(ieee)} aria-label={`Open binding for ${b?.alias || String(d.friendly_name ?? ieee)}`}>
                          {b?.alias || String(d.friendly_name ?? "—")}
                        </button>
                        <div className="dsc-muted" style={{ fontSize: "var(--dsc-fs-xs)" }}>
                          {ieee || "—"}
                          {b?.capability_override ? ` · class ${b.capability_override}` : d.capability_class ? ` · ${String(d.capability_class)}` : ""}
                        </div>
                      </td>
                      <td>{model || "—"}</td>
                      <HealthCell
                        battery={typeof d.battery === "number" ? d.battery : null}
                        linkquality={typeof d.linkquality === "number" ? d.linkquality : null}
                        lastSeen={typeof d.last_seen === "number" ? d.last_seen : null}
                      />
                      <td>
                        <div className="dsc-chip-row" style={{ flexWrap: "wrap" }}>
                          <StatusChip label={status === "bound" ? "BOUND" : status === "conflict" ? "CONFLICT" : "UNBOUND"} tone={status === "bound" ? "ok" : status === "conflict" ? "warn" : "muted"} />
                          {p && p.recipe_id !== "none" && liveWet != null ? <StatusChip label={liveWet ? "Wet" : "Dry"} tone={liveWet ? "warn" : "ok"} /> : null}
                          {liveProblem != null ? <StatusChip label={liveProblem ? "Problem" : "Clear"} tone={liveProblem ? "warn" : "ok"} /> : null}
                        </div>
                      </td>
                      <td>{b ? roleLabel(b.role) : "—"}</td>
                      <td>{b?.zone ?? "—"}</td>
                      <td>{p ? recipeLabel(p.recipe_id) : "—"}</td>
                      <ActionsCell>
                        <Button variant="secondary" onClick={() => setEditingIeee(ieee)}>
                          Edit
                        </Button>
                      </ActionsCell>
                    </SettingsRow>
                  );
                })}
              </SettingsTable>
            ) : zigbeeHealth == null ? (
              <p className="dsc-muted" style={{ marginTop: 10 }}>
                Loading Zigbee radio status…
              </p>
            ) : zigbeeHealth.radio_up === true ? (
              <div className="dsc-muted" style={{ marginTop: 10, fontSize: "var(--dsc-fs-md)", lineHeight: 1.45 }}>
                <p style={{ margin: "0 0 8px" }}>Coordinator online — no end devices yet. Rows appear here as soon as a sensor joins (this page polls while JOIN OPEN).</p>
                <ol style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Confirm JOIN OPEN (or tap Permit join ~4 min). Keep house ZHA pairing closed so the sensor joins this SkyConnect.</li>
                  <li>Factory-reset a TS0201 (hold reset ~5 s until the LED blinks) near this Pi. The DSC network is new after the Zigbee re-flash (channel 11).</li>
                  <li>When the Unbound row appears, open it and set Role + Zone → Save. Climate / Overview pick it up immediately.</li>
                </ol>
              </div>
            ) : (
              <p className="dsc-muted" style={{ marginTop: 10 }}>
                SkyConnect coordinator is not online — fix USB, power, and <code>dsc-hub-z2m</code> logs before pairing. An empty device list here means the radio is down, not that you have a clean network.
              </p>
            )}
          </section>
          <ZigbeeBindDrawer
            open={editingIeee != null && editingValue != null}
            onClose={() => setEditingIeee(null)}
            ieee={editingIeee ?? ""}
            name={String(editingDevice?.friendly_name ?? "")}
            model={`${String(editingDevice?.vendor ?? "")}${editingDevice?.model ? ` ${String(editingDevice.model)}` : ""}`.trim()}
            capabilityClass={String(editingDevice?.capability_class ?? "other")}
            value={editingValue}
            allRoles={zigbeeRoles.length ? zigbeeRoles : FALLBACK_ROLES}
            allRecipes={zigbeeRecipes.length ? zigbeeRecipes : FALLBACK_RECIPES}
            onSave={saveBinding}
          />
          <div id="tuya" style={{ scrollMarginTop: 80 }}>
            <TuyaLocalCard fleet={fleet} onSaved={() => void refresh()} />
          </div>
        </>
      ) : null}

      {tab === "cameras" ? <CamerasCard /> : null}

      {tab === "firmware" ? (
        <>
          <section className="dsc-card" id="firmware" style={{ scrollMarginTop: 80 }}>
            <h3>Firmware (ESPHome)</h3>
            <p className="dsc-muted">Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it. Probe 5 and beyond are unavailable until their firmware exists.</p>
            <div className="dsc-honesty" style={{ marginBottom: 12 }} id="toolchain">
              <b>Build toolchain</b>
              {toolchain ? (
                <>
                  <p className="dsc-muted" style={{ margin: "4px 0" }}>
                    Installed <b>{String(toolchain.installed ?? "—")}</b>
                    {" · "}Latest{" "}
                    <b>{toolchain.latest_ok ? String(toolchain.latest_supported ?? toolchain.latest ?? "—") : "offline"}</b>
                    {toolchain.latest_ok && toolchain.latest_blocked_reason ? ` (PyPI has ${String(toolchain.latest)})` : ""}
                    {" · "}Pinned min <b>{String(toolchain.min_version ?? "—")}</b>{" "}
                    {toolchain.meets_min === false ? <StatusChip label="BELOW PINNED MIN" tone="bad" /> : null}
                  </p>
                  {toolchain.latest_blocked_reason ? (
                    <p className="dsc-muted" style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                      <StatusChip label="Newer ESPHome held back" tone="muted" /> {String(toolchain.latest_blocked_reason)}.
                    </p>
                  ) : null}
                  {toolchain.latest_ok === false ? (
                    <p
                      className="dsc-muted"
                      style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}
                      title={toolchain.latest_error ? String(toolchain.latest_error) : undefined}
                    >
                      {toolchain.eth_up === false
                        ? "Can't check for a newer ESPHome — the Pi has no network uplink."
                        : "Can't reach PyPI to check for a newer ESPHome (no internet / DNS). Installed + pinned checks still work."}
                    </p>
                  ) : null}
                  <p style={{ margin: "6px 0", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Button
                      onClick={() => setPendingToolchain(true)}
                      disabled={
                        toolchain.update_available !== true || toolchain.eth_up !== true || toolchain.disk_free_ok === false
                      }
                    >
                      {toolchain.update_available === true
                        ? `Update ESPHome → ${String(toolchain.latest_supported ?? toolchain.latest)}`
                        : toolchain.installed == null
                          ? "ESPHome not installed"
                          : toolchain.meets_min === false
                            ? "ESPHome below pinned minimum"
                            : "ESPHome up to date"}
                    </Button>
                    {toolchain.rollback_target ? (
                      <Button onClick={() => setPendingRollback(true)} disabled={toolchain.eth_up !== true}>
                        Roll back to {String(toolchain.rollback_target)}
                      </Button>
                    ) : null}
                    <a href={String(toolchain.dashboard_url ?? "http://dsc-brain.local:6052")} target="_blank" rel="noreferrer">
                      Open ESPHome Dashboard ↗
                    </a>
                  </p>
                  <p className="dsc-muted" style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                    Build backend:{" "}
                    {toolchain.build_backend === "venv-host"
                      ? toolchain.dashboard_up === false
                        ? `host ESPHome venv — dashboard DOWN on ${String(toolchain.dashboard_api ?? "")} (compile/OTA unavailable; update / roll back still work)`
                        : `host ESPHome venv via dsc-esphome-dashboard (${String(toolchain.dashboard_api ?? "")})`
                      : toolchain.build_backend === "dashboard"
                        ? toolchain.dashboard_legacy === true
                          ? `legacy dsc-hub-esphome container (${String(toolchain.dashboard_api ?? "")})`
                          : `host ESPHome dashboard, update helper not installed (${String(toolchain.dashboard_api ?? "")})`
                        : toolchain.build_backend === "venv"
                          ? `local venv (${String(toolchain.esphome_bin ?? "")})`
                          : "none — compile/OTA unavailable; use pi/flash-fleet-remote.sh"}
                    {typeof toolchain.disk_free_gb === "number" ? ` · ${String(toolchain.disk_free_gb)} GB free` : ""}
                  </p>
                  {toolchain.dashboard_legacy === true ? (
                    <p style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                      <StatusChip label="Deprecated backend" tone="warn" /> The <code>dsc-hub-esphome</code> container backend
                      is being retired in 8.x — the host ESPHome venv is the supported path. Re-run the deploy or bake to
                      switch.
                    </p>
                  ) : null}
                  {toolchain.build_backend === "venv-host" && toolchain.dashboard_up === false ? (
                    <p style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                      <StatusChip label="Dashboard down" tone="bad" /> The build service is not answering on :6052. If this
                      followed an ESPHome update, <b>Roll back</b>; otherwise check{" "}
                      <code>journalctl -u dsc-esphome-dashboard</code> on the Pi.
                    </p>
                  ) : null}
                  {toolchain.build_backend === "dashboard" && toolchain.dashboard_legacy !== true ? (
                    <p style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                      <StatusChip label="Helper missing" tone="warn" /> Compile and OTA work, but Update ESPHome can&apos;t
                      reach the host venv. On the Pi: <code>sudo systemctl enable --now dsc-esphome-update.path</code> (or
                      re-run the deploy).
                    </p>
                  ) : null}
                  {toolchain.secrets_present === false ? (
                    <p style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                      <StatusChip label="No firmware secrets" tone="bad" /> <code>secrets.yaml</code> is missing from{" "}
                      <code>{String(toolchain.project_dir ?? "firmware/v4")}</code> — every compile and OTA will fail. A baked
                      kit ships it; otherwise run <code>generate-secrets.sh</code> there.
                    </p>
                  ) : null}
                  {toolchain.disk_free_ok === false ? (
                    <p style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                      <StatusChip label="Low disk" tone="warn" /> Under 1.5 GB free — the toolchain update is blocked until
                      the SD card has room (the PlatformIO cache lives under /var/lib/dsc-hub).
                    </p>
                  ) : null}
                  {Array.isArray(toolchain.devices_behind) && (toolchain.devices_behind as string[]).length > 0 ? (
                    <p className="dsc-muted" style={{ margin: "4px 0" }}>
                      Running an ESPHome other than {String(toolchain.installed ?? "installed")}:{" "}
                      {(toolchain.devices_behind as string[]).join(", ")}
                    </p>
                  ) : null}
                  {toolchain.update_job ? (
                    <pre style={{ maxHeight: 160, overflow: "auto", fontSize: "var(--dsc-fs-xs)", whiteSpace: "pre-wrap" }}>
                      [{String((toolchain.update_job as Record<string, unknown>).status ?? "")}]{"\n"}
                      {String((toolchain.update_job as Record<string, unknown>).detail ?? "")}
                    </pre>
                  ) : null}
                  {rollout && rollout.needed === true && Array.isArray(rollout.seats) && (rollout.seats as unknown[]).length > 0
                    ? (() => {
                        const canary = (rollout.canary as Record<string, unknown> | null) ?? null;
                        const canarySeat = rollout.canary_seat ? String(rollout.canary_seat) : null;
                        const restCount = Array.isArray(rollout.rest) ? (rollout.rest as unknown[]).length : 0;
                        const allCount = (rollout.seats as unknown[]).length;
                        if (!canary) {
                          return (
                            <p className="dsc-honesty" style={{ margin: "6px 0" }}>
                              Toolchain changed — {allCount} device(s) can be reflashed on ESPHome{" "}
                              {String(rollout.installed ?? "")} (serialised, hub last).{" "}
                              {canarySeat ? (
                                <Button onClick={() => setPendingRollout("canary")}>
                                  Canary {probeLabel(Number(canarySeat.replace("pot", "")))} first
                                </Button>
                              ) : null}{" "}
                              <Button onClick={() => setPendingRollout("all")}>Reflash whole fleet</Button>
                            </p>
                          );
                        }
                        const st = String(canary.job_status ?? "");
                        const seatName = probeLabel(Number(String(canary.seat).replace("pot", "")));
                        if (st === "queued" || st === "running") {
                          return (
                            <p className="dsc-honesty" style={{ margin: "6px 0" }}>
                              <StatusChip label={`Canary ${st}`} tone="muted" /> {seatName} is being flashed on ESPHome{" "}
                              {String(rollout.installed ?? "")}. The rest waits until it rejoins.
                            </p>
                          );
                        }
                        if (st === "failed") {
                          return (
                            <p className="dsc-honesty" style={{ margin: "6px 0" }}>
                              <StatusChip label="Canary failed" tone="bad" /> {seatName} OTA failed — see the job log below.
                              Fix and <Button onClick={() => setPendingRollout("canary")}>re-run the canary</Button> before
                              releasing the fleet.
                            </p>
                          );
                        }
                        return (
                          <p className="dsc-honesty" style={{ margin: "6px 0" }}>
                            {canary.ok === true ? (
                              <>
                                <StatusChip label="Canary OK" tone="ok" /> {seatName} rejoined on ESPHome{" "}
                                {String(canary.running ?? "")}.{" "}
                              </>
                            ) : (
                              <>
                                <StatusChip label="Canary unconfirmed" tone="warn" /> {seatName} flashed but reports{" "}
                                {canary.running ? String(canary.running) : canary.online ? "no version yet" : "offline"} —
                                check it before releasing.{" "}
                              </>
                            )}
                            <Button onClick={() => setPendingRollout("rest")}>Release the rest ({restCount}, hub last)</Button>
                          </p>
                        );
                      })()
                    : null}
                </>
              ) : (
                <p className="dsc-muted" style={{ margin: "4px 0" }}>
                  Toolchain status unavailable — brain offline, or neither the ESPHome dashboard (:6052) nor a local venv is reachable.
                </p>
              )}
              {toolchainMsg ? <p className="dsc-muted">{toolchainMsg}</p> : null}
            </div>

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
                        <Button onClick={() => setPendingOta({ seatId: String(row.seat_id), action: "ota" })}>Queue OTA</Button>
                        <Button onClick={() => setPendingOta({ seatId: String(row.seat_id), action: "compile" })}>Queue compile</Button>
                        {row.yaml ? (
                          <a
                            className="dsc-chip"
                            href={`${String(toolchain?.dashboard_url ?? "http://dsc-brain.local:6052").replace(/\/$/, "")}/?configuration=${encodeURIComponent(String(row.yaml))}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Open this device in the ESPHome dashboard (Logs button there streams serial/OTA logs)"
                          >
                            Logs ↗
                          </a>
                        ) : null}
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
                Queues an ESPHome {pendingOta?.action === "compile" ? "compile" : "OTA"} job for <strong>{pendingOta?.seatId ?? "device"}</strong>. Nothing flashes until the build worker runs.
              </p>
            </DecisionLayer>
            <DecisionLayer
              open={pendingToolchain}
              onDismiss={() => setPendingToolchain(false)}
              onConfirm={async () => {
                setPendingToolchain(false);
                setToolchainMsg(
                  toolchain?.build_backend === "dashboard"
                    ? "Bumping the ESPHome container image…"
                    : toolchain?.build_backend === "venv-host"
                      ? "Handing the update to the Pi host helper…"
                      : "Updating ESPHome venv…",
                );
                try {
                  const r = await update_esphome_toolchain();
                  if (r && r.status === "manual") {
                    setToolchainMsg(String(r.detail ?? "Redeploy the ESPHome container on the Pi."));
                  } else {
                    setToolchainMsg(`Update started → ${String(r.target ?? "latest")}. Watch the log below.`);
                  }
                } catch (e) {
                  setToolchainMsg(String((e as Error).message || e));
                }
                await refresh();
              }}
              title="Update the ESPHome build toolchain"
              confirmLabel="Update ESPHome"
              help={null}
            >
              {toolchain?.build_backend === "dashboard" ? (
                <p>
                  Bumps <code>image: esphome/esphome</code> to <b>{String(toolchain?.latest ?? "latest")}</b> in{" "}
                  <code>{String(toolchain?.compose_file ?? "docker-compose.yml")}</code> and redeploys the <code>esphome</code>{" "}
                  service (<code>docker compose up -d esphome</code>). If this host can&apos;t run <code>docker</code>,
                  you&apos;ll get the exact steps to run on the Pi. No devices are touched. After it finishes you&apos;ll be
                  offered a fleet reflash.
                </p>
              ) : toolchain?.build_backend === "venv-host" ? (
                <p>
                  Asks the Pi host helper to run{" "}
                  <code>pip install esphome=={String(toolchain?.latest_supported ?? toolchain?.latest ?? "latest")}</code> in{" "}
                  <code>/opt/dsc-esphome-venv</code> and restart the dashboard service; the log streams below. No devices are
                  touched. After it finishes you&apos;ll be offered a canary, then a fleet reflash.
                </p>
              ) : (
                <p>
                  Runs <code>pip install -U esphome</code> in the Pi venv, then restarts the dashboard service. No devices are
                  touched. After it finishes you&apos;ll be offered a fleet reflash.
                </p>
              )}
            </DecisionLayer>
            <DecisionLayer
              open={pendingRollback}
              onDismiss={() => setPendingRollback(false)}
              onConfirm={async () => {
                setPendingRollback(false);
                setToolchainMsg(`Rolling ESPHome back to ${String(toolchain?.rollback_target ?? "")}…`);
                try {
                  const r = await rollback_esphome_toolchain();
                  setToolchainMsg(`Rollback started → ${String(r.target ?? "")}. Watch the log below.`);
                } catch (e) {
                  setToolchainMsg(String((e as Error).message || e));
                }
                await refresh();
              }}
              title="Roll the ESPHome toolchain back"
              confirmLabel={`Roll back to ${String(toolchain?.rollback_target ?? "")}`}
              help={null}
            >
              <p>
                Reinstalls <code>esphome=={String(toolchain?.rollback_target ?? "")}</code> — the version the last successful
                change came from — and restarts the dashboard. Devices already flashed on the newer build keep running it
                until you reflash them.
              </p>
            </DecisionLayer>
            <DecisionLayer
              open={pendingRollout != null}
              onDismiss={() => setPendingRollout(null)}
              onConfirm={async () => {
                const mode = pendingRollout ?? "all";
                setPendingRollout(null);
                try {
                  const r = await start_esphome_rollout(mode);
                  const queued = Array.isArray(r.queued) ? (r.queued as string[]) : [];
                  setToolchainMsg(
                    mode === "canary"
                      ? `Canary OTA queued for ${queued[0] ?? "the probe"}. Release the rest once it rejoins.`
                      : `Queued ${queued.length} OTA job(s). They run one at a time; the hub is flashed last.`,
                  );
                } catch (e) {
                  setToolchainMsg(String((e as Error).message || e));
                }
                await refresh();
              }}
              title={
                pendingRollout === "canary"
                  ? "Flash the canary probe first"
                  : pendingRollout === "rest"
                    ? "Release the rest of the fleet"
                    : "Reflash the fleet on the new ESPHome"
              }
              confirmLabel={
                pendingRollout === "canary" ? "Queue canary OTA" : pendingRollout === "rest" ? "Queue remaining OTAs" : "Queue fleet OTA"
              }
              help={null}
            >
              {pendingRollout === "canary" ? (
                <p>
                  Flashes only{" "}
                  <strong>
                    {rollout?.canary_seat ? probeLabel(Number(String(rollout.canary_seat).replace("pot", ""))) : "one probe"}
                  </strong>{" "}
                  on ESPHome {String(rollout?.installed ?? "")}. Nothing else is touched until you confirm it rejoined and
                  release the rest.
                </p>
              ) : pendingRollout === "rest" ? (
                <p>
                  Enqueues one OTA per remaining in-service device
                  {Array.isArray(rollout?.rest) ? ` (${(rollout!.rest as unknown[]).length})` : ""}, hub last. The canary
                  probe is skipped — it is already on the new build.
                </p>
              ) : (
                <p>
                  Enqueues one OTA per in-service device
                  {Array.isArray(rollout?.seats) ? ` (${(rollout!.seats as unknown[]).length})` : ""}. Jobs run serialised
                  through the existing build worker, with the hub flashed last so a mid-rollout failure doesn&apos;t drop
                  everything at once.
                </p>
              )}
            </DecisionLayer>

            <h4 style={{ marginTop: 16 }} id="jobs">
              Job history
            </h4>
            {jobs.length ? (
              <SettingsTable
                columns={[
                  { key: "seat", label: "Device" },
                  { key: "action", label: "Action" },
                  { key: "status", label: "Status" },
                  { key: "when", label: "Updated", numeric: true },
                  { key: "detail", label: "Detail" },
                ]}
                caption={`${jobs.length} job${jobs.length === 1 ? "" : "s"} — newest first`}
                help={{ title: "Job history", body: <p>Every ESPHome compile / OTA the build worker has run. Queue new jobs above; this is the record of what happened.</p> }}
              >
                {[...jobs]
                  .sort((a, b) => Number(b.updated_at ?? 0) - Number(a.updated_at ?? 0))
                  .map((j, i) => {
                    const status = String(j.status ?? "—");
                    const tone: "ok" | "warn" | "bad" | "muted" | undefined = status === "done" ? "ok" : status === "failed" ? "bad" : status === "running" || status === "queued" ? "warn" : "muted";
                    const when = Number(j.updated_at);
                    return (
                      <SettingsRow key={String(j.job_id ?? i)}>
                        <td>{String(j.seat_id ?? "—")}</td>
                        <td>{String(j.action ?? "—")}</td>
                        <td className={tone ? `is-${tone}` : undefined}>{status}</td>
                        <td className="is-numeric">{Number.isFinite(when) ? formatStamp(when * 1000) : "—"}</td>
                        <td>
                          <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", whiteSpace: "pre-wrap" }}>
                            {String(j.detail ?? "").slice(0, 160)}
                          </span>
                        </td>
                      </SettingsRow>
                    );
                  })}
              </SettingsTable>
            ) : (
              <p className="dsc-muted" style={{ marginTop: 10 }}>
                No ESPHome jobs yet. Queue a compile or OTA above.
              </p>
            )}
            <p className="dsc-honesty" style={{ marginTop: 10 }}>
              Full Update pull requires Ethernet. Offline kits stay on the baked card version — no silent &ldquo;updated&rdquo; without matching digests. Kit USB flash + commission live under <a href={`#${paths.setup()}`}>Setup</a>.
            </p>
          </section>

          <div id="kit-update" style={{ scrollMarginTop: 80 }}>
            <KitUpdateCard />
          </div>

          <div id="kit-update" style={{ scrollMarginTop: 80 }}>
            <KitUpdateCard />
          </div>

          <FirmwareAdvancedCard settings={settings} onSaved={(k, v) => setSettings((s) => ({ ...s, [k]: v }))} />

          <section className="dsc-card" aria-label="Host and network shortcuts">
            <h3>Host &amp; network</h3>
            <p className="dsc-muted">Power and uplink controls live on their own sections — quick links from here since firmware work usually needs them.</p>
            <div className="dsc-chip-row">
              <a className="dsc-chip" href={`#${paths.settings("system", "storage")}`}>
                Power — restart Brain / network / reboot Pi ↗
              </a>
              <a className="dsc-chip" href={`#${paths.settings("system", "storage")}`}>
                Logs &amp; verbosity ↗
              </a>
              <a className="dsc-chip" href={`#${paths.settings("network")}`}>
                Ethernet (LAN) — DHCP / static ↗
              </a>
              <a className="dsc-chip" href={`#${paths.settings("system", "time")}`}>
                Time — hub vs brain clock ↗
              </a>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}

/** Firmware › Advanced: the tier-N ESPHome toolchain rows + the read-only Sonoff driver constants (plan § 3.11). */
function FirmwareAdvancedCard({ settings, onSaved }: { settings: Record<string, string>; onSaved: (key: string, value: string) => void }) {
  const manifest = useSettingsManifest();
  const save = useSaveState();
  const prompt = (settings.esphome_fleet_ota_prompt ?? "true") === "true";
  return (
    <SettingsCard
      id="firmware-advanced"
      title="Toolchain & drivers"
      icon="research"
      intro="Where the build worker finds ESPHome, and the appliance driver's fixed timings. Blank paths resolve to the brain's defaults."
    >
      <SettingRow
        id="fleet-ota-prompt"
        label="Offer fleet OTA after a toolchain update"
        description={manifest.rows.esphome_fleet_ota_prompt?.description ?? "After the ESPHome toolchain updates, offer to reflash the fleet."}
        scope="brain"
        defaultLabel={manifestDefaultLabel(manifest.rows.esphome_fleet_ota_prompt, "on")}
        isDefault={prompt}
        onReset={() =>
          void save.run(async () => {
            await patch_settings({ esphome_fleet_ota_prompt: "true" });
            onSaved("esphome_fleet_ota_prompt", "true");
          })
        }
        state={save.state}
        stateText={save.text}
        control={
          <Toggle
            checked={prompt}
            label="Offer fleet OTA after a toolchain update"
            onChange={(next) =>
              void save.run(async () => {
                await patch_settings({ esphome_fleet_ota_prompt: next ? "true" : "false" });
                onSaved("esphome_fleet_ota_prompt", next ? "true" : "false");
              })
            }
          />
        }
      />
      <TextSettingRow id="esphome-dashboard-url" settingKey="esphome_dashboard_url" label="ESPHome dashboard URL" value={settings.esphome_dashboard_url ?? ""} onSaved={(v) => onSaved("esphome_dashboard_url", v)} />
      <TextSettingRow id="esphome-dashboard-api" settingKey="esphome_dashboard_api" label="Dashboard API base" value={settings.esphome_dashboard_api ?? ""} onSaved={(v) => onSaved("esphome_dashboard_api", v)} advanced />
      <TextSettingRow id="esphome-bin" settingKey="esphome_bin" label="ESPHome binary" value={settings.esphome_bin ?? ""} onSaved={(v) => onSaved("esphome_bin", v)} advanced />
      <TextSettingRow id="esphome-project-dir" settingKey="esphome_project_dir" label="ESPHome project dir" value={settings.esphome_project_dir ?? ""} onSaved={(v) => onSaved("esphome_project_dir", v)} advanced />
      <SettingRow
        id="sonoff-driver"
        label="Sonoff relay driver"
        description="The brain polls each Sonoff relay's state and marks it stale when a poll is missed for the stale window. Fixed in appliance_driver.py."
        scope="firmware"
        advanced
        control={<Stated>poll 2 s · stale 45 s</Stated>}
      />
    </SettingsCard>
  );
}
