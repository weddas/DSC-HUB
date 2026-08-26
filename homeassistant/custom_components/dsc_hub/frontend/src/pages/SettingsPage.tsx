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
  get_network_status,
  get_settings,
  get_zigbee_devices,
  patch_inventory,
  patch_settings,
  permit_join,
  queue_esphome_job,
  reload_catalogs,
  test_cannalib,
  test_ollama,
} from "../lib/fleetApi";
import { parseFleetSnapshot, type FleetSnapshot, type InventoryRow, type SeatSnapshot } from "../lib/fleetModel";

const AP_CHANNELS = ["1", "6", "11"];

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

function resolveSeat(fleet: FleetSnapshot, seatId: string): SeatSnapshot | null {
  if (seatId === "hub") return fleet.hub;
  if (seatId === "panel") return fleet.panel;
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
        <input value={fn} onChange={(e) => setFn(e.target.value)} placeholder="e.g. intake_temp" />
      </td>
      <td>
        <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. 4x8 intake duct" />
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
        <dd>{seat?.firmware ?? seat?.values?.firmware_version ?? "—"}</dd>
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
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [inventory, setInventory] = useState<Array<Record<string, unknown>>>([]);
  const [fleet, setFleet] = useState<FleetSnapshot | null>(null);
  const [network, setNetwork] = useState<Record<string, unknown> | null>(null);
  const [catalog, setCatalog] = useState<Record<string, unknown> | null>(null);
  const [esphome, setEsphome] = useState<Array<Record<string, unknown>>>([]);
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [zigbeeDevices, setZigbeeDevices] = useState<Array<Record<string, unknown>>>([]);
  const [ollamaResult, setOllamaResult] = useState<string>("");
  const [cannalibResult, setCannalibResult] = useState<string>("");
  const [networkResult, setNetworkResult] = useState<string>("");
  const [importResult, setImportResult] = useState<string>("");
  const [confirmNetwork, setConfirmNetwork] = useState(false);

  const refresh = async () => {
    const [s, net, cat, esp, j, fleetRaw, zigbee] = await Promise.all([
      get_settings(),
      get_network_status(),
      get_catalog_status(),
      get_esphome_devices(),
      get_esphome_jobs(),
      get_fleet_state().catch(() => null),
      get_zigbee_devices().catch(() => ({ devices: [] as Array<Record<string, unknown>> })),
    ]);
    setSettings(s.settings);
    setInventory(s.inventory);
    setNetwork(net);
    setCatalog(cat);
    setEsphome((esp.devices as Array<Record<string, unknown>>) ?? []);
    setJobs(j);
    setFleet(fleetRaw ? parseFleetSnapshot(fleetRaw) : null);
    setZigbeeDevices(zigbee.devices ?? []);
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  const save = async () => {
    await patch_settings(settings);
    await refresh();
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
        ...(row as InventoryRow),
        seat: fleet ? resolveSeat(fleet, String(row.seat_id)) : null,
      })),
    [inventory, fleet],
  );

  return (
    <div className="dsc-page">
      <PageHeader icon="settings" title="Settings" subtitle="DSC-HUB 7.1.0 — Pi appliance" />

      <section className="dsc-card">
        <h3>Fleet inventory</h3>
        <p className="dsc-muted">Every device with its address, firmware, online state, and service status.</p>
        <div className="dsc-grid">
          {inventoryRows.map(({ seat, ...row }) => (
            <div key={String(row.seat_id)} className="dsc-col-4">
              <DeviceDetailCard row={row} seat={seat} />
              <label style={{ display: "block", marginTop: 8, fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={Boolean(row.in_service)}
                  onChange={(e) => toggleInService(String(row.seat_id), e.target.checked)}
                />{" "}
                In service
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="dsc-card">
        <h3>Device assignment</h3>
        <p className="dsc-muted">
          Function and placement tell the brain what each sensor/fan measures. Capability override caps max fan/light
          output when hardware differs from nameplate.
        </p>
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
      </section>

      <section className="dsc-card">
        <h3>Network</h3>
        <p className="dsc-muted">
          Channel is limited to 1, 6, or 11. Applying restarts the hub&apos;s Wi-Fi — devices reconnect on their own.
        </p>
        <label>
          AP SSID
          <input
            value={settings.ap_ssid ?? ""}
            onChange={(e) => setSettings({ ...settings, ap_ssid: e.target.value })}
          />
        </label>
        <label>
          AP PSK
          <input
            type="password"
            value={settings.ap_psk ?? ""}
            onChange={(e) => setSettings({ ...settings, ap_psk: e.target.value })}
            placeholder={network?.ap_psk_set ? "••••••••" : "set on first save"}
          />
        </label>
        <label>
          Channel
          <select
            value={settings.ap_channel ?? "6"}
            onChange={(e) => setSettings({ ...settings, ap_channel: e.target.value })}
          >
            {AP_CHANNELS.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </label>
        {network?.dhcp_map ? (
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
            await save();
            const r = await apply_network();
            setNetworkResult(JSON.stringify(r, null, 2));
          }}
          title="Apply network settings"
          confirmLabel="Apply and restart Wi-Fi"
          help={null}
        >
          <p>
            Saves the network settings and restarts the hub&apos;s Wi-Fi. Devices drop off briefly and reconnect on
            their own.
          </p>
        </DecisionLayer>
      </section>

      <section className="dsc-card">
        <h3>Integrations</h3>
        <label>
          Ollama URL
          <input
            value={settings.ollama_base_url ?? ""}
            onChange={(e) => setSettings({ ...settings, ollama_base_url: e.target.value })}
            placeholder="http://192.168.86.2:11434"
          />
        </label>
        <label>
          Ollama model
          <input
            value={settings.ollama_model ?? ""}
            onChange={(e) => setSettings({ ...settings, ollama_model: e.target.value })}
          />
        </label>
        <Button onClick={async () => setOllamaResult(JSON.stringify(await test_ollama()))}>Test Ollama</Button>
        {ollamaResult ? <pre className="dsc-honesty">{ollamaResult}</pre> : null}

        <label>
          CannaLib API URL
          <input
            value={settings.cannalib_api_url ?? ""}
            onChange={(e) => setSettings({ ...settings, cannalib_api_url: e.target.value })}
          />
        </label>
        <label>
          CannaLib API key
          <input
            type="password"
            value={settings.cannalib_api_key ?? ""}
            onChange={(e) => setSettings({ ...settings, cannalib_api_key: e.target.value })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={(settings.cannalib_use_local_fallback ?? "true") === "true"}
            onChange={(e) =>
              setSettings({
                ...settings,
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
        </p>
        <p className="dsc-muted">
          Chemistry, height, and lineage come straight from the catalog — gaps are never filled with guesses.
        </p>
        <Button onClick={async () => setCatalog(await get_catalog_status())}>Refresh status</Button>
        <Button onClick={async () => reload_catalogs()}>Reload local catalogs</Button>
      </section>

      <section className="dsc-card">
        <h3>ESPHome</h3>
        <p className="dsc-muted">
          Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it.
        </p>
        <p className="dsc-muted">Pot 5 and beyond are unavailable until their firmware exists.</p>
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
                  <Button onClick={() => queue_esphome_job(String(row.seat_id), "ota").then(refresh)}>
                    Queue OTA
                  </Button>
                  <Button onClick={() => queue_esphome_job(String(row.seat_id), "compile").then(refresh)}>
                    Queue compile
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length ? (
          <pre className="dsc-honesty">{JSON.stringify(jobs.slice(0, 3), null, 2)}</pre>
        ) : null}
      </section>

      <section className="dsc-card">
        <h3>Zigbee (SkyConnect)</h3>
        <p className="dsc-muted">Extra canopy sensors and smart plugs — separate from climate control.</p>
        <div className="dsc-row-actions">
          <Button onClick={() => permit_join(true).then(refresh)}>Permit join (2 min)</Button>
          <Button onClick={() => permit_join(false).then(refresh)}>Stop join</Button>
        </div>
        {zigbeeDevices.length ? (
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
        ) : (
          <p className="dsc-muted" style={{ marginTop: 10 }}>
            No Zigbee devices reported yet — enable permit join, then refresh.
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
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setImportResult(JSON.stringify(await backup_import(f)));
            }}
          />
        </label>
        {importResult ? <pre className="dsc-honesty">{importResult}</pre> : null}
      </section>

      <Button primary onClick={save}>
        Save settings
      </Button>
    </div>
  );
}
