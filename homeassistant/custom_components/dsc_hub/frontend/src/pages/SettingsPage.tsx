import { useEffect, useMemo, useState } from "react";
import { Button, Icon, PageHeader, StatusChip, type IconName } from "../components/ui";
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
  patch_inventory,
  patchGlobalModifiers,
  patchProbeStation,
  patch_settings,
  permit_join,
  queue_esphome_job,
  reload_catalogs,
  test_cannalib,
  test_ollama,
  type ClimateZone,
  type GlobalModifiers,
  type ProbeStation,
} from "../lib/fleetApi";
import { parseFleetSnapshot, type FleetSnapshot, type InventoryRow, type SeatSnapshot } from "../lib/fleetModel";

const AP_CHANNELS = ["1", "6", "11"];
const CLIMATE_ZONES: ClimateZone[] = ["room", "clone", "main"];
const ZONE_LABELS: Record<ClimateZone, string> = {
  room: "Room",
  clone: "2×4",
  main: "4×8",
};
const IDLE_POT_OPTIONS = ["pot1", "pot2", "pot3", "pot4"] as const;
const TENT_OPTIONS = ["2x4", "4x8"] as const;

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
  if (id.startsWith("pot")) return "Pots";
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

function ZigbeePlacementRow({
  friendlyName,
  placement,
  onChange,
}: {
  friendlyName: string;
  placement: string;
  onChange: (friendlyName: string, placement: string) => void;
}) {
  return (
    <tr>
      <td>{friendlyName}</td>
      <td>
        <input
          type="text"
          value={placement}
          onChange={(e) => onChange(friendlyName, e.target.value)}
          placeholder="e.g. canopy center, 4x8 intake duct"
        />
      </td>
    </tr>
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
  const [zigbeePlacementsDraft, setZigbeePlacementsDraft] = useState<Record<string, string>>({});
  const [zigbeePlacementsDirty, setZigbeePlacementsDirty] = useState(false);
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

  const refresh = async () => {
    const [s, net, cat, esp, j, fleetRaw, zigbee, zigbeeHealthRaw, modifiers, stations] = await Promise.all([
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
    if (!zigbeePlacementsDirty) {
      setZigbeePlacementsDraft(parseZigbeePlacements(s.settings.zigbee_placements));
    }
    if (!modifiersDirty && modifiers) {
      setGlobalModifiers(modifiers);
    }
    setProbeStations(stations);
    setProbeDrafts((prev) => {
      const next = { ...prev };
      for (const st of stations) {
        if (!next[st.seat_id]) {
          next[st.seat_id] = {
            idle_home_pot_id: st.idle_home_pot_id || st.seat_id,
            tent: st.tent || "2x4",
          };
        }
      }
      return next;
    });
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

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
      <PageHeader icon="settings" title="Settings" subtitle="DSC-HUB 7.1.0 — Pi appliance" />

      <section className="dsc-card">
        <h3>Fleet inventory</h3>
        <p className="dsc-muted">Every device with its address, firmware, online state, and service status.</p>
        {inventoryGroups.map(([group, rows]) => (
          <details
            key={group}
            className="dsc-inventory-group"
            open={rows.some(({ seat, in_service }) => !(seat?.online ?? false) || !in_service)}
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

      <section className="dsc-card">
        <h3>Device assignment</h3>
        <p className="dsc-muted">
          Function and placement tell the brain what each sensor/fan measures. Capability override caps max fan/light
          output when hardware differs from nameplate.
        </p>
        <div className="dsc-table-scroll">
          <table className="dsc-table">
          <thead>
            <tr>
              <th>Seat</th>
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

      <section className="dsc-card">
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
                            value={globalModifiers.temp_offset_c[zone]}
                            onChange={(e) => {
                              setModifiersDirty(true);
                              setGlobalModifiers({
                                ...globalModifiers,
                                temp_offset_c: {
                                  ...globalModifiers.temp_offset_c,
                                  [zone]: Number(e.target.value),
                                },
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.5"
                            value={globalModifiers.rh_offset_pct[zone]}
                            onChange={(e) => {
                              setModifiersDirty(true);
                              setGlobalModifiers({
                                ...globalModifiers,
                                rh_offset_pct: {
                                  ...globalModifiers.rh_offset_pct,
                                  [zone]: Number(e.target.value),
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

      <section className="dsc-card">
        <details className="dsc-inventory-group" open={probeStations.some((s) => s.reading_mode !== "idle")}>
          <summary>Probe stations</summary>
          <p className="dsc-muted">
            Mobile soil probes idle at a home pot and publish thereabouts readings until a soil test moves them.
          </p>
          {probeStations.length ? (
            <div className="dsc-table-scroll">
              <table className="dsc-table">
                <thead>
                  <tr>
                    <th>Seat</th>
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
                              <option key={p} value={p}>
                                {p}
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
                          <Button
                            onClick={async () => {
                              await patchProbeStation(st.seat_id, draft);
                              await refresh();
                            }}
                          >
                            Save
                          </Button>
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
        </details>
      </section>

      <section className="dsc-card">
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
                  <th>Seat</th>
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

      <section className="dsc-card">
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

      <section className="dsc-card">
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

      <section className="dsc-card">
        <h3>ESPHome</h3>
        <p className="dsc-muted">
          Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it.
        </p>
        <p className="dsc-muted">Pot 5 and beyond are unavailable until their firmware exists.</p>
        <div className="dsc-table-scroll">
          <table className="dsc-table">
          <thead>
            <tr>
              <th>Seat</th>
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

      <section className="dsc-card">
        <h3>Zigbee (SkyConnect)</h3>
        <p className="dsc-muted">Extra canopy sensors and smart plugs — separate from climate control.</p>
        <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
          <StatusChip
            label={zigbeeHealth?.radio_up === true ? "RADIO UP" : "RADIO DOWN"}
            tone={zigbeeHealth?.radio_up === true ? "ok" : "bad"}
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
            Permit join (2 min)
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
              ? "Opens the coordinator for new devices for about two minutes."
              : "Closes join mode on the SkyConnect coordinator."}
          </p>
        </DecisionLayer>
        {zigbeeDevices.filter((d) => d.type !== "Coordinator").length ? (
          <>
            <div className="dsc-table-scroll">
              <table className="dsc-table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>IEEE</th>
                    <th>Type</th>
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                  {zigbeeDevices
                    .filter((d) => d.type !== "Coordinator")
                    .map((d) => (
                      <tr key={String(d.ieee_address ?? d.friendly_name)}>
                        <td style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Icon name={zigbeeIcon(String(d.type ?? ""))} size={14} color="var(--dsc-gray-5)" />
                          {String(d.friendly_name ?? "—")}
                        </td>
                        <td>{String(d.ieee_address ?? "—")}</td>
                        <td>{String(d.type ?? "—")}</td>
                        <td>
                          {String(d.vendor ?? "")}
                          {d.model ? ` ${String(d.model)}` : ""}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <h4 style={{ marginTop: 16 }}>Placements</h4>
            <p className="dsc-muted">
              Map each Zigbee friendly name to a tent placement label (e.g. canopy, intake). Climate and canopy
              ingest use these labels.
            </p>
            <div className="dsc-table-scroll">
              <table className="dsc-table">
                <thead>
                  <tr>
                    <th>Friendly name</th>
                    <th>Placement label</th>
                  </tr>
                </thead>
                <tbody>
                  {zigbeeDevices
                    .filter((d) => d.type !== "Coordinator")
                    .map((d) => {
                      const fname = String(d.friendly_name ?? "");
                      return (
                        <ZigbeePlacementRow
                          key={fname}
                          friendlyName={fname}
                          placement={zigbeePlacementsDraft[fname] ?? ""}
                          onChange={(name, placement) => {
                            setZigbeePlacementsDirty(true);
                            setZigbeePlacementsDraft((prev) => ({ ...prev, [name]: placement }));
                          }}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
            <Button
              onClick={async () => {
                const trimmed: Record<string, string> = {};
                for (const [key, value] of Object.entries(zigbeePlacementsDraft)) {
                  if (key && value.trim()) trimmed[key] = value.trim();
                }
                await patch_settings({ zigbee_placements: JSON.stringify(trimmed) });
                setZigbeePlacementsDirty(false);
                await refresh();
              }}
            >
              Save placements
            </Button>
          </>
        ) : zigbeeHealth?.radio_up === true ? (
          <p className="dsc-muted" style={{ marginTop: 10 }}>
            Coordinator is online but no end devices are paired yet — permit join when you are ready to add sensors
            or plugs.
          </p>
        ) : (
          <p className="dsc-muted" style={{ marginTop: 10 }}>
            SkyConnect coordinator is not online — fix USB, power, and <code>dsc-hub-z2m</code> logs before pairing.
            An empty device list here means the radio is down, not that you have a clean network.
          </p>
        )}
      </section>

      <section className="dsc-card">
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

      <Button primary onClick={saveIntegrations}>
        Save integrations
      </Button>
    </div>
  );
}
