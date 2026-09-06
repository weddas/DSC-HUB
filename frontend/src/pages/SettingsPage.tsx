import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, PageHeader, StatusChip } from "../components/ui";
import { HelpTip } from "../components/HelpTip";
import { DecisionLayer } from "../components/DecisionLayer";
import { DeviceAssignmentRow } from "../components/settings/DeviceAssignmentRow";
import { DeviceDetailCard } from "../components/settings/DeviceDetailCard";
import {
  AP_CHANNELS,
  AP_KEYS,
  BRAIN_KEYS,
  CLIMATE_ZONES,
  FLOOD_TASK_ID,
  IDLE_POT_OPTIONS,
  INTEGRATION_KEYS,
  SECTION_SUBTITLE,
  TANK_TASK_ID,
  TENT_OPTIONS,
  ZONE_LABELS,
} from "../components/settings/settingsConstants";
import { inventoryGroup, pickSettings, resolveSeat, taskParamDefaults } from "../components/settings/settingsHelpers";
import { ZigbeeBindRow } from "../components/settings/ZigbeeBindRow";
import { SettingsTable, SettingsRow } from "../components/settings/SettingsTable";
import { ZigbeeCatalogCard } from "../components/settings/ZigbeeCatalogCard";
import { AutomationRulesCard } from "../components/settings/AutomationRulesCard";
import { KitUpdateCard } from "../components/settings/KitUpdateCard";
import { SpaceEnergySettingsCard } from "../components/settings/SpaceEnergySettingsCard";
import {
  apply_network,
  backup_export_url,
  backup_import,
  create_extra_seat,
  get_catalog_status,
  get_esphome_devices,
  get_esphome_jobs,
  get_esphome_rollout,
  get_esphome_toolchain,
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
  start_esphome_rollout,
  test_cannalib,
  test_ollama,
  update_esphome_toolchain,
  type GlobalModifiers,
  type ProbeStation,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../lib/fleetApi";
import { parseFleetSnapshot, type FleetSnapshot, type InventoryRow } from "../lib/fleetModel";
import { parseSettingsSection } from "../routes";
import { probeLabel } from "../lib/seatModel";

export function SettingsPage() {
  const location = useLocation();
  const section = parseSettingsSection(location.pathname);
  const [apDraft, setApDraft] = useState<Record<string, string>>({});
  const [integrationsDraft, setIntegrationsDraft] = useState<Record<string, string>>({});
  const [brainDraft, setBrainDraft] = useState<Record<string, string>>({});
  const [inventory, setInventory] = useState<Array<Record<string, unknown>>>([]);
  const [fleet, setFleet] = useState<FleetSnapshot | null>(null);
  const [network, setNetwork] = useState<Record<string, unknown> | null>(null);
  const [catalog, setCatalog] = useState<Record<string, unknown> | null>(null);
  const [esphome, setEsphome] = useState<Array<Record<string, unknown>>>([]);
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [toolchain, setToolchain] = useState<Record<string, unknown> | null>(null);
  const [rollout, setRollout] = useState<Record<string, unknown> | null>(null);
  const [toolchainMsg, setToolchainMsg] = useState<string>("");
  const [pendingToolchain, setPendingToolchain] = useState(false);
  const [pendingRollout, setPendingRollout] = useState(false);
  const [zigbeeDevices, setZigbeeDevices] = useState<Array<Record<string, unknown>>>([]);
  const [zigbeeHealth, setZigbeeHealth] = useState<Record<string, unknown> | null>(null);
  const [zigbeeRoles, setZigbeeRoles] = useState<ZigbeeRole[]>([]);
  const [zigbeeRecipes, setZigbeeRecipes] = useState<ZigbeeRecipe[]>([]);
  const [zigbeeBindDraft, setZigbeeBindDraft] = useState<
    Record<
      string,
      {
        role: string;
        zone: string;
        friendly_name: string;
        alias?: string;
        enabled: boolean;
        capability_override?: string;
      }
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
  const [addSeatDraft, setAddSeatDraft] = useState<{
    seat_id: string;
    name: string;
    placement: string;
    kind: "sensor" | "appliance";
  }>({ seat_id: "", name: "", placement: "shared", kind: "sensor" });
  const [pendingAddSeat, setPendingAddSeat] = useState(false);
  const [addSeatMsg, setAddSeatMsg] = useState<string>("");

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
    setBrainDraft(pickSettings(s.settings, BRAIN_KEYS));
    setInventory(s.inventory);
    setNetwork(net);
    setCatalog(cat);
    setEsphome((esp.devices as Array<Record<string, unknown>>) ?? []);
    setJobs(j);
    void get_esphome_toolchain()
      .then(setToolchain)
      .catch(() => setToolchain(null));
    void get_esphome_rollout()
      .then(setRollout)
      .catch(() => setRollout(null));
    setFleet(fleetRaw ? parseFleetSnapshot(fleetRaw) : null);
    setZigbeeDevices(zigbee.devices ?? []);
    setZigbeeHealth(zigbeeHealthRaw);
    setZigbeeRoles(rolesRaw.roles ?? []);
    setZigbeeRecipes(recipesRaw.recipes ?? []);
    if (!zigbeeBindDirty) {
      const draft: Record<
        string,
        {
          role: string;
          zone: string;
          friendly_name: string;
          alias?: string;
          enabled: boolean;
          capability_override?: string;
        }
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
          alias: binding?.alias ? String(binding.alias) : undefined,
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
              {
                role: string;
                zone: string;
                friendly_name: string;
                alias?: string;
                enabled: boolean;
                capability_override?: string;
              }
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
                alias: binding?.alias ? String(binding.alias) : undefined,
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

        <details className="dsc-inventory-group">
          <summary>Add device / seat</summary>
          <p className="dsc-muted" style={{ fontSize: 13, marginTop: 4 }}>
            Register a Zigbee sensor or extra appliance the firmware doesn&apos;t define. It lands{" "}
            <b>out of service</b> — bind its Role/Zone/Task below, then enable it once it&apos;s wired.
          </p>
          <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            <label>
              Seat ID
              <input
                type="text"
                value={addSeatDraft.seat_id}
                placeholder="e.g. fan_wall_2x4"
                onChange={(e) =>
                  setAddSeatDraft((d) => ({
                    ...d,
                    seat_id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                  }))
                }
              />
            </label>
            <label>
              Name
              <input
                type="text"
                value={addSeatDraft.name}
                placeholder="Wall fan (2×4)"
                onChange={(e) => setAddSeatDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </label>
            <label>
              Placement
              <select
                value={addSeatDraft.placement}
                onChange={(e) => setAddSeatDraft((d) => ({ ...d, placement: e.target.value }))}
              >
                <option value="4x8">4×8</option>
                <option value="2x4">2×4</option>
                <option value="room">Room</option>
                <option value="shared">Shared</option>
              </select>
            </label>
            <label>
              Kind
              <select
                value={addSeatDraft.kind}
                onChange={(e) =>
                  setAddSeatDraft((d) => ({ ...d, kind: e.target.value as "sensor" | "appliance" }))
                }
              >
                <option value="sensor">Sensor</option>
                <option value="appliance">Appliance</option>
              </select>
            </label>
            <Button
              primary
              disabled={!/^[a-z][a-z0-9_]{1,63}$/.test(addSeatDraft.seat_id) || !addSeatDraft.name.trim()}
              onClick={() => setPendingAddSeat(true)}
            >
              Add seat
            </Button>
          </div>
          {addSeatMsg ? <p className="dsc-honesty">{addSeatMsg}</p> : null}
        </details>
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
              setAddSeatMsg(`Added ${addSeatDraft.seat_id} — out of service. Bind it below, then enable.`);
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
            Creates an inventory row for <strong>{addSeatDraft.name || addSeatDraft.seat_id}</strong> (
            {addSeatDraft.kind}, {addSeatDraft.placement}). It starts <b>out of service</b> and fakes no
            readings until you enable it.
          </p>
        </DecisionLayer>

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
              <label>
                Leaf temp offset °C
                <input
                  type="number"
                  step="0.1"
                  value={brainDraft.leaf_offset_c ?? "2"}
                  onChange={(e) => setBrainDraft({ ...brainDraft, leaf_offset_c: e.target.value })}
                />
              </label>
              <p className="dsc-muted" style={{ marginTop: -6, fontSize: 12 }}>
                Subtracted from air temp to estimate leaf temp for VPD (main + clone). Default 2°C.
              </p>
              <Button
                onClick={async () => {
                  await patch_settings(brainDraft);
                }}
              >
                Save leaf offset
              </Button>
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

      <section hidden={section !== "brain"}>
        <SpaceEnergySettingsCard />
      </section>

      {section === "brain" ? (
        <AutomationRulesCard seats={inventory.map((r) => String(r.seat_id)).filter(Boolean)} />
      ) : null}

      <section className="dsc-card" hidden={section !== "device" && section !== "server"}>
        <h3>ESPHome</h3>
        <p className="dsc-muted">
          Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it.
        </p>
        <p className="dsc-muted">Pot 5 and beyond are unavailable until their firmware exists.</p>

        <div className="dsc-honesty" style={{ marginBottom: 12 }}>
          <b>Build toolchain</b>
          {toolchain ? (
            <>
              <p className="dsc-muted" style={{ margin: "4px 0" }}>
                Installed <b>{String(toolchain.installed ?? "—")}</b>
                {" · "}Latest{" "}
                <b>{toolchain.latest_ok ? String(toolchain.latest ?? "—") : "offline"}</b>
                {" · "}Pinned min <b>{String(toolchain.min_version ?? "—")}</b>{" "}
                {toolchain.meets_min === false ? (
                  <StatusChip label="BELOW PINNED MIN" tone="bad" />
                ) : null}
              </p>
              {toolchain.latest_ok === false ? (
                <p
                  className="dsc-muted"
                  style={{ margin: "4px 0", fontSize: 12 }}
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
                  disabled={toolchain.update_available !== true || toolchain.eth_up !== true}
                >
                  {toolchain.update_available === true
                    ? `Update ESPHome → ${String(toolchain.latest)}`
                    : "ESPHome up to date"}
                </Button>
                <a
                  href={String(toolchain.dashboard_url ?? "http://dsc-brain.local:6052")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open ESPHome Dashboard ↗
                </a>
              </p>
              <p className="dsc-muted" style={{ margin: "4px 0", fontSize: 12 }}>
                Build backend:{" "}
                {toolchain.build_backend === "dashboard"
                  ? `ESPHome dashboard (${String(toolchain.dashboard_api ?? "")})`
                  : toolchain.build_backend === "venv"
                    ? `local venv (${String(toolchain.esphome_bin ?? "")})`
                    : "none — compile/OTA unavailable; use pi/flash-*-remote.sh"}
              </p>
              {Array.isArray(toolchain.devices_behind) && (toolchain.devices_behind as string[]).length > 0 ? (
                <p className="dsc-muted" style={{ margin: "4px 0" }}>
                  Running an ESPHome other than {String(toolchain.installed ?? "installed")}:{" "}
                  {(toolchain.devices_behind as string[]).join(", ")}
                </p>
              ) : null}
              {toolchain.update_job ? (
                <pre style={{ maxHeight: 160, overflow: "auto", fontSize: 11, whiteSpace: "pre-wrap" }}>
                  [{String((toolchain.update_job as Record<string, unknown>).status ?? "")}]{"\n"}
                  {String((toolchain.update_job as Record<string, unknown>).detail ?? "")}
                </pre>
              ) : null}
              {rollout &&
              rollout.needed === true &&
              Array.isArray(rollout.seats) &&
              (rollout.seats as unknown[]).length > 0 ? (
                <p className="dsc-honesty" style={{ margin: "6px 0" }}>
                  Toolchain changed — {(rollout.seats as unknown[]).length} device(s) can be reflashed on the new
                  ESPHome (serialised, hub last).{" "}
                  <Button onClick={() => setPendingRollout(true)}>Reflash fleet</Button>
                </p>
              ) : null}
            </>
          ) : (
            <p className="dsc-muted" style={{ margin: "4px 0" }}>
              Toolchain status unavailable — brain offline, or neither the ESPHome dashboard (:6052) nor a
              local venv is reachable.
            </p>
          )}
          {toolchainMsg ? <p className="dsc-muted">{toolchainMsg}</p> : null}
        </div>

        {section === "device" ? (
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
        ) : null}
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
        <DecisionLayer
          open={pendingToolchain}
          onDismiss={() => setPendingToolchain(false)}
          onConfirm={async () => {
            setPendingToolchain(false);
            setToolchainMsg("Updating ESPHome venv…");
            try {
              const r = await update_esphome_toolchain();
              setToolchainMsg(`Update started → ${String(r.target ?? "latest")}. Watch the log below.`);
            } catch (e) {
              setToolchainMsg(String((e as Error).message || e));
            }
            await refresh();
          }}
          title="Update the ESPHome build toolchain"
          confirmLabel="Update ESPHome"
          help={null}
        >
          <p>
            Runs <code>pip install -U esphome</code> in the Pi venv, then restarts the dashboard service.
            No devices are touched. After it finishes you&apos;ll be offered a fleet reflash.
          </p>
        </DecisionLayer>
        <DecisionLayer
          open={pendingRollout}
          onDismiss={() => setPendingRollout(false)}
          onConfirm={async () => {
            setPendingRollout(false);
            try {
              const r = await start_esphome_rollout();
              const q = Array.isArray(r.queued) ? (r.queued as string[]).length : 0;
              setToolchainMsg(`Queued ${q} OTA job(s). They run one at a time; the hub is flashed last.`);
            } catch (e) {
              setToolchainMsg(String((e as Error).message || e));
            }
            await refresh();
          }}
          title="Reflash the fleet on the new ESPHome"
          confirmLabel="Queue fleet OTA"
          help={null}
        >
          <p>
            Enqueues one OTA per in-service device
            {Array.isArray(rollout?.seats) ? ` (${(rollout!.seats as unknown[]).length})` : ""}. Jobs run
            serialised through the existing build worker, with the hub flashed last so a mid-rollout failure
            doesn&apos;t drop everything at once.
          </p>
        </DecisionLayer>
        {section === "device" && jobs.length ? (
          <pre className="dsc-honesty">{JSON.stringify(jobs.slice(0, 3), null, 2)}</pre>
        ) : null}
        {section === "server" ? (
          jobs.length ? (
            <SettingsTable
              columns={[
                { key: "seat", label: "Device" },
                { key: "action", label: "Action" },
                { key: "status", label: "Status" },
                { key: "when", label: "Updated", numeric: true },
                { key: "detail", label: "Detail" },
              ]}
              caption={`${jobs.length} job${jobs.length === 1 ? "" : "s"} — newest first`}
              help={{
                title: "Job history",
                body: (
                  <p>
                    Every ESPHome compile / OTA the build worker has run. Queue new jobs from the
                    Device tab; this tab is the record of what happened.
                  </p>
                ),
              }}
            >
              {[...jobs]
                .sort((a, b) => Number(b.updated_at ?? 0) - Number(a.updated_at ?? 0))
                .map((j, i) => {
                  const status = String(j.status ?? "—");
                  const tone: "ok" | "warn" | "bad" | "muted" | undefined =
                    status === "done"
                      ? "ok"
                      : status === "failed"
                        ? "bad"
                        : status === "running" || status === "queued"
                          ? "warn"
                          : "muted";
                  const when = Number(j.updated_at);
                  return (
                    <SettingsRow key={String(j.job_id ?? i)}>
                      <td>{String(j.seat_id ?? "—")}</td>
                      <td>{String(j.action ?? "—")}</td>
                      <td className={tone ? `is-${tone}` : undefined}>{status}</td>
                      <td className="is-numeric">
                        {Number.isFinite(when)
                          ? new Date(when * 1000).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td>
                        <span className="dsc-muted" style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
                          {String(j.detail ?? "").slice(0, 160)}
                        </span>
                      </td>
                    </SettingsRow>
                  );
                })}
            </SettingsTable>
          ) : (
            <p className="dsc-muted" style={{ marginTop: 10 }}>
              No ESPHome jobs yet. Queue a compile or OTA from the Device tab.
            </p>
          )
        ) : null}
      </section>

      {section === "device" ? <ZigbeeCatalogCard onSaved={() => void refresh()} /> : null}

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
                title: "Rename & bind",
                body: (
                  <>
                    <p>
                      Click a device name to rename it — the alias is what Climate, Overview and
                      the Twin show. Clearing it falls back to the raw Zigbee name.
                    </p>
                    <p>
                      <b>Health</b> is battery, link quality (LQI) and last-seen straight from the
                      device&apos;s own reports; amber means low battery, weak link, or silent for
                      over an hour.
                    </p>
                  </>
                ),
              }}
            >
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
                          alias={draft.alias}
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
                          battery={typeof d.battery === "number" ? d.battery : null}
                          linkquality={typeof d.linkquality === "number" ? d.linkquality : null}
                          lastSeen={typeof d.last_seen === "number" ? d.last_seen : null}
                          onToggleShowAll={() =>
                            setZigbeeShowAll((prev) => ({ ...prev, [ieee]: !prev[ieee] }))
                          }
                          allRoles={zigbeeRoles.length ? zigbeeRoles : fallbackRoles}
                          allRecipes={zigbeeRecipes.length ? zigbeeRecipes : fallbackRecipes}
                          onRename={(id, nextAlias) => {
                            setZigbeeBindDirty(true);
                            setZigbeeBindDraft((prev) => {
                              const cur = prev[id] ?? {
                                role: "unbound",
                                zone: "shared",
                                friendly_name: String(d.friendly_name ?? ""),
                                enabled: true,
                              };
                              return { ...prev, [id]: { ...cur, alias: nextAlias || undefined } };
                            });
                          }}
                          onBindingChange={(id, patch) => {
                            setZigbeeBindDirty(true);
                            setZigbeeBindDraft((prev) => {
                              const base = {
                                role: patch.role,
                                zone: patch.zone,
                                friendly_name: String(d.friendly_name ?? prev[id]?.friendly_name ?? ""),
                                alias: prev[id]?.alias,
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
            </SettingsTable>
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

      {section === "server" ? <KitUpdateCard /> : null}

      {section === "server" ? (
        <div style={{ marginTop: 8 }}>
          <p className="dsc-muted">
            Server is the ESPHome build record — toolchain status and full job history above. Queue compiles and OTA
            from <a href="#/settings/device">Device</a>; kit USB flash + commission live under <a href="#/setup">Setup</a>.
          </p>
          <p className="dsc-honesty">
            Full Update pull requires Ethernet (`GET/POST /settings/update`). Offline kits stay on the baked card
            version — no silent “updated” without matching digests.
          </p>
        </div>
      ) : null}
    </div>
  );
}
