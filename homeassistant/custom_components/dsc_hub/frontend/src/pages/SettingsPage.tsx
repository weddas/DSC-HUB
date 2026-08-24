import { useEffect, useState } from "react";
import { Button, PageHeader } from "../components/ui";
import {
  apply_network,
  backup_export_url,
  backup_import,
  get_catalog_status,
  get_esphome_devices,
  get_esphome_jobs,
  get_network_status,
  get_settings,
  patch_inventory,
  patch_settings,
  permit_join,
  queue_esphome_job,
  reload_catalogs,
  test_cannalib,
  test_ollama,
} from "../lib/fleetApi";

const AP_CHANNELS = ["1", "6", "11"];

export function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [inventory, setInventory] = useState<Array<Record<string, unknown>>>([]);
  const [network, setNetwork] = useState<Record<string, unknown> | null>(null);
  const [catalog, setCatalog] = useState<Record<string, unknown> | null>(null);
  const [esphome, setEsphome] = useState<Array<Record<string, unknown>>>([]);
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [ollamaResult, setOllamaResult] = useState<string>("");
  const [cannalibResult, setCannalibResult] = useState<string>("");
  const [networkResult, setNetworkResult] = useState<string>("");
  const [importResult, setImportResult] = useState<string>("");

  const refresh = async () => {
    const [s, net, cat, esp, j] = await Promise.all([
      get_settings(),
      get_network_status(),
      get_catalog_status(),
      get_esphome_devices(),
      get_esphome_jobs(),
    ]);
    setSettings(s.settings);
    setInventory(s.inventory);
    setNetwork(net);
    setCatalog(cat);
    setEsphome((esp.devices as Array<Record<string, unknown>>) ?? []);
    setJobs(j);
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

  return (
    <div className="dsc-page">
      <PageHeader icon="settings" title="Settings" subtitle="DSC-HUB 7.0.0 — Pi appliance" />

      <section className="dsc-card">
        <h3>Network</h3>
        <p className="dsc-muted">AP channel locked to 1 / 6 / 11. Apply restarts AP — fleet reconnects.</p>
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
        <Button
          onClick={async () => {
            await save();
            const r = await apply_network();
            setNetworkResult(JSON.stringify(r, null, 2));
          }}
        >
          Apply network
        </Button>
        {networkResult ? <pre className="dsc-honesty">{networkResult}</pre> : null}
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
        <p className="dsc-muted">Chem / height / lineage stay CannaLib-honest — LLM does not invent.</p>
        <Button onClick={async () => setCatalog(await get_catalog_status())}>Refresh status</Button>
        <Button onClick={async () => reload_catalogs()}>Reload local catalogs</Button>
      </section>

      <section className="dsc-card">
        <h3>ESPHome</h3>
        <p className="dsc-muted">
          OTA preferred. Compile on Pi is one job at a time — swap warning applies. No silent auto-flash.
        </p>
        <p className="dsc-muted">Pot 5+ is out until firmware exists.</p>
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
        <p className="dsc-muted">Additive canopy / plugs — not climate ladder legs.</p>
        <Button onClick={() => permit_join(true)}>Permit join (2 min)</Button>
        <Button onClick={() => permit_join(false)}>Stop join</Button>
      </section>

      <section className="dsc-card">
        <h3>Fleet inventory</h3>
        <table className="dsc-table">
          <thead>
            <tr>
              <th>Seat</th>
              <th>Role</th>
              <th>Host</th>
              <th>In service</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((row) => (
              <tr key={String(row.seat_id)}>
                <td>{String(row.seat_id)}</td>
                <td>{String(row.role)}</td>
                <td>{String(row.host ?? "—")}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={Boolean(row.in_service)}
                    onChange={(e) => toggleInService(String(row.seat_id), e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
