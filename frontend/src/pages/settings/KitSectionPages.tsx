import { useEffect, useState } from "react";
import { Button, StatusChip } from "../../components/ui";
import { DecisionLayer } from "../../components/DecisionLayer";
import { SettingRow, SettingsCard, Stated, Toggle } from "../../components/settings/SettingRow";
import { NetworkExtrasCard } from "../../components/settings/NetworkExtrasCard";
import { SystemDiagnosticsCard } from "../../components/settings/SystemDiagnosticsCard";
import { JournalsStorageCard } from "../../components/settings/JournalsStorageCard";
import { AP_CHANNELS, AP_KEYS, INTEGRATION_KEYS } from "../../components/settings/settingsConstants";
import { pickSettings } from "../../components/settings/settingsHelpers";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { HubTunableRow } from "../../components/settings/HubTunableRow";
import { useHubTunables } from "../../hooks/useHubTunables";
import { manifestDefaultLabel, useSettingsManifest } from "../../hooks/useSettingsManifest";
import { useFleetSelector } from "../../hooks/useFleet";
import {
  apply_network,
  backup_export_url,
  backup_import,
  get_catalog_status,
  get_network_status,
  get_settings,
  patch_settings,
  reload_catalogs,
  test_cannalib,
  test_ollama,
} from "../../lib/fleetApi";
import { paths } from "../../lib/paths";

/** Connectivity-test result as a readable status line + collapsible raw payload. */
function IntegrationTestResult({ raw }: { raw: string }) {
  if (!raw) return null;
  let ok: boolean | null = null;
  let summary = raw;
  try {
    const parsed = JSON.parse(raw) as { ok?: boolean; detail?: string; models?: unknown[] };
    ok = typeof parsed.ok === "boolean" ? parsed.ok : null;
    if (parsed.ok && Array.isArray(parsed.models)) summary = `${parsed.models.length} model(s) available`;
    else if (parsed.ok) summary = "Reachable";
    else summary = parsed.detail ? String(parsed.detail) : "Unreachable";
  } catch {
    /* non-JSON — show as-is */
  }
  return (
    <div className="dsc-chip-row" style={{ margin: "6px 0", flexWrap: "wrap", alignItems: "center" }}>
      <StatusChip label={ok === true ? "Reachable" : ok === false ? "Unreachable" : "Result"} tone={ok === true ? "ok" : ok === false ? "bad" : "muted"} />
      <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", wordBreak: "break-word" }}>{summary}</span>
      <details className="dsc-wizard-details" style={{ width: "100%" }}>
        <summary style={{ fontSize: "var(--dsc-fs-xs)" }}>Raw response</summary>
        <pre className="dsc-honesty" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "auto" }}>
          {raw}
        </pre>
      </details>
    </div>
  );
}

/** A tier-N text row that autosaves on blur. */
function TextSettingRow({
  id,
  settingKey,
  label,
  description,
  value,
  onSaved,
  password,
  placeholder,
  isSet,
  consumers,
}: {
  id: string;
  settingKey: string;
  label: string;
  description?: string;
  value: string;
  onSaved: (next: string) => void;
  password?: boolean;
  placeholder?: string;
  /** For masked secrets: the brain says a value exists even though it never returns it. */
  isSet?: boolean;
  consumers?: { label: string; href: string }[];
}) {
  const manifest = useSettingsManifest();
  const saveState = useSaveState();
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const row = manifest.rows[settingKey];
  const def = row && typeof row.default === "string" ? row.default : "";
  const commit = () => {
    if (draft === value) return;
    void saveState.run(async () => {
      await patch_settings({ [settingKey]: draft });
      onSaved(draft);
    });
  };
  return (
    <SettingRow
      id={id}
      label={label}
      description={description ?? row?.description}
      scope="brain"
      defaultLabel={def ? def : row ? "empty" : undefined}
      isDefault={password ? undefined : value === def}
      onReset={
        password
          ? undefined
          : () =>
              void saveState.run(async () => {
                await patch_settings({ [settingKey]: def });
                onSaved(def);
              })
      }
      state={saveState.state}
      stateText={saveState.text}
      consumers={consumers}
      control={
        <input
          type={password ? "password" : "text"}
          value={draft}
          placeholder={placeholder ?? (password && isSet ? "•••••••• (set)" : undefined)}
          aria-label={label}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />
      }
    />
  );
}

export function IntegrationsSettingsPage() {
  const manifest = useSettingsManifest();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState<"loading" | "ready" | "error">("loading");
  const [catalog, setCatalog] = useState<Record<string, unknown> | null>(null);
  const [ollamaResult, setOllamaResult] = useState("");
  const [cannalibResult, setCannalibResult] = useState("");
  const [confirmReload, setConfirmReload] = useState(false);
  const [ollamaBusy, setOllamaBusy] = useState(false);
  const [cannalibBusy, setCannalibBusy] = useState(false);
  const fallbackSave = useSaveState();

  useEffect(() => {
    get_settings()
      .then((s) => {
        setValues(pickSettings(s.settings, INTEGRATION_KEYS));
        setLoaded("ready");
      })
      .catch(() => setLoaded("error"));
    get_catalog_status().then(setCatalog).catch(() => setCatalog(null));
  }, []);

  const set = (k: string) => (v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const keySet = Boolean(manifest.values.cannalib_api_key_set);
  const fallback = (values.cannalib_use_local_fallback ?? "true") === "true";

  return (
    <>
      <SettingsCard
        id="ollama"
        title="Ollama"
        icon="lab-flask"
        intro="A local language model for SoftCal AI and research helpers. Optional."
        loadState={loaded}
        loadError="Settings unavailable — is the brain up?"
        actions={
          <>
            <Button
              disabled={ollamaBusy}
              onClick={async () => {
                setOllamaBusy(true);
                try {
                  setOllamaResult(JSON.stringify(await test_ollama()));
                } finally {
                  setOllamaBusy(false);
                }
              }}
            >
              Test Ollama
            </Button>
            <IntegrationTestResult raw={ollamaResult} />
          </>
        }
      >
        <TextSettingRow
          id="ollama-url"
          settingKey="ollama_base_url"
          label="Ollama URL"
          value={values.ollama_base_url ?? ""}
          onSaved={set("ollama_base_url")}
          placeholder="http://192.168.86.2:11434"
          consumers={[{ label: "Calibrate", href: `#${paths.calibrate()}` }]}
        />
        <TextSettingRow
          id="ollama-model"
          settingKey="ollama_model"
          label="Ollama model"
          value={values.ollama_model ?? ""}
          onSaved={set("ollama_model")}
        />
      </SettingsCard>

      <SettingsCard
        id="cannalib"
        title="CannaLib"
        icon="dna-strand"
        intro="The strain catalog service. Chemistry, height and lineage come straight from it — gaps are never filled with guesses."
        loadState={loaded}
        loadError="Settings unavailable — is the brain up?"
        actions={
          <>
            <Button
              disabled={cannalibBusy}
              onClick={async () => {
                setCannalibBusy(true);
                try {
                  setCannalibResult(JSON.stringify(await test_cannalib()));
                } finally {
                  setCannalibBusy(false);
                }
              }}
            >
              Test CannaLib
            </Button>
            <IntegrationTestResult raw={cannalibResult} />
          </>
        }
      >
        <TextSettingRow
          id="cannalib-url"
          settingKey="cannalib_api_url"
          label="CannaLib API URL"
          value={values.cannalib_api_url ?? ""}
          onSaved={set("cannalib_api_url")}
          consumers={[{ label: "CannaLib", href: `#${paths.cannalib()}` }]}
        />
        <TextSettingRow
          id="cannalib-key"
          settingKey="cannalib_api_key"
          label="CannaLib API key"
          value={values.cannalib_api_key ?? ""}
          onSaved={set("cannalib_api_key")}
          password
          isSet={keySet}
        />
        <SettingRow
          id="cannalib-fallback"
          label="Local catalog fallback"
          description="Use the on-Pi sqlite catalog when the remote API is down."
          scope="brain"
          defaultLabel={manifestDefaultLabel(manifest.rows.cannalib_use_local_fallback, "on")}
          isDefault={fallback}
          onReset={() =>
            void fallbackSave.run(async () => {
              await patch_settings({ cannalib_use_local_fallback: "true" });
              set("cannalib_use_local_fallback")("true");
            })
          }
          state={fallbackSave.state}
          stateText={fallbackSave.text}
          control={
            <Toggle
              checked={fallback}
              label="Local catalog fallback"
              onChange={(next) =>
                void fallbackSave.run(async () => {
                  await patch_settings({ cannalib_use_local_fallback: next ? "true" : "false" });
                  set("cannalib_use_local_fallback")(next ? "true" : "false");
                })
              }
            />
          }
        />
      </SettingsCard>

      <SettingsCard
        id="catalog"
        title="Catalog"
        icon="journal"
        intro={
          catalog
            ? `${String(catalog.note ?? "—")} (source: ${String(catalog.source ?? "unknown")}${catalog.cannalib_api_url ? ` — ${String(catalog.cannalib_api_url)}` : ""})`
            : "Loading catalog status…"
        }
        actions={
          <>
            <Button onClick={async () => setCatalog(await get_catalog_status())}>Refresh status</Button>
            <Button onClick={() => setConfirmReload(true)}>Reload local catalogs</Button>
          </>
        }
      >
        <SettingRow
          id="ppfd-maps"
          label="PPFD maps"
          description="Fixture PPFD maps are local static assets under /dsc-catalog/ppfd/ — never vendor hotlinks."
          scope="firmware"
          control={<Stated>on-Pi assets</Stated>}
        />
      </SettingsCard>
      <DecisionLayer
        open={confirmReload}
        onDismiss={() => setConfirmReload(false)}
        onConfirm={async () => {
          setConfirmReload(false);
          await reload_catalogs();
          setCatalog(await get_catalog_status());
        }}
        title="Reload local catalogs"
        confirmLabel="Reload"
        help={null}
      >
        <p>Re-reads on-Pi catalog indexes. Compose and Research pick up changes after reload.</p>
      </DecisionLayer>
    </>
  );
}

export function NetworkSettingsPage() {
  const manifest = useSettingsManifest();
  const [apDraft, setApDraft] = useState<Record<string, string>>({});
  const [network, setNetwork] = useState<Record<string, unknown> | null>(null);
  const [loaded, setLoaded] = useState<"loading" | "ready" | "error">("loading");
  const [confirmNetwork, setConfirmNetwork] = useState(false);
  const [networkResult, setNetworkResult] = useState("");
  const [applying, setApplying] = useState(false);

  const refresh = async () => {
    const [s, net] = await Promise.all([get_settings(), get_network_status().catch(() => null)]);
    setApDraft(pickSettings(s.settings, AP_KEYS));
    setNetwork(net);
  };
  useEffect(() => {
    refresh()
      .then(() => setLoaded("ready"))
      .catch(() => setLoaded("error"));
  }, []);

  const ssidRow = manifest.rows.ap_ssid;
  const chRow = manifest.rows.ap_channel;

  return (
    <>
      <SettingsCard
        id="softap"
        title="SoftAP"
        icon="network-ap"
        intro="The three rows apply together — the hub's Wi-Fi restarts and every device reconnects on its own."
        loadState={loaded}
        loadError="Settings unavailable — is the brain up?"
        actions={
          <>
            <Button variant="danger" disabled={applying} onClick={() => setConfirmNetwork(true)}>
              Apply network
            </Button>
            {networkResult ? <pre className="dsc-honesty">{networkResult}</pre> : null}
          </>
        }
      >
        <SettingRow
          id="ap-ssid"
          label="AP SSID"
          description={ssidRow?.description ?? "Name of the hub's own Wi-Fi network."}
          scope="brain"
          defaultLabel={manifestDefaultLabel(ssidRow, "DSC-Brain")}
          isDefault={apDraft.ap_ssid === String(ssidRow?.default ?? "DSC-Brain")}
          onReset={() => setApDraft({ ...apDraft, ap_ssid: String(ssidRow?.default ?? "DSC-Brain") })}
          control={
            <input
              type="text"
              value={apDraft.ap_ssid ?? ""}
              aria-label="AP SSID"
              onChange={(e) => setApDraft({ ...apDraft, ap_ssid: e.target.value })}
            />
          }
        />
        <SettingRow
          id="ap-psk"
          label="AP passphrase"
          description="Never shown back. Leave blank to keep the current one."
          scope="brain"
          control={
            <input
              type="password"
              value={apDraft.ap_psk ?? ""}
              aria-label="AP passphrase"
              placeholder={network?.ap_psk_set ? "•••••••• (set)" : "set on first apply"}
              onChange={(e) => setApDraft({ ...apDraft, ap_psk: e.target.value })}
            />
          }
        />
        <SettingRow
          id="ap-channel"
          label="Channel"
          description={chRow?.description ?? "1, 6 or 11 — the non-overlapping 2.4 GHz channels."}
          scope="brain"
          defaultLabel={manifestDefaultLabel(chRow, "6")}
          isDefault={(apDraft.ap_channel ?? "6") === String(chRow?.default ?? "6")}
          onReset={() => setApDraft({ ...apDraft, ap_channel: String(chRow?.default ?? "6") })}
          control={
            <select
              value={apDraft.ap_channel ?? "6"}
              aria-label="AP channel"
              onChange={(e) => setApDraft({ ...apDraft, ap_channel: e.target.value })}
            >
              {AP_CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          }
        />
        {network?.dhcp_map ? (
          <div className="dsc-table-scroll" style={{ marginTop: 10 }}>
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
      </SettingsCard>
      <DecisionLayer
        open={confirmNetwork}
        onDismiss={() => setConfirmNetwork(false)}
        busy={applying}
        onConfirm={async () => {
          setConfirmNetwork(false);
          setApplying(true);
          try {
            const patch: Record<string, string> = { ...apDraft };
            if (!patch.ap_psk) delete patch.ap_psk;
            await patch_settings(patch);
            const r = await apply_network();
            setNetworkResult(JSON.stringify(r, null, 2));
            await refresh();
          } catch (e) {
            setNetworkResult(String((e as Error).message || e));
          } finally {
            setApplying(false);
          }
        }}
        title="Apply network settings"
        confirmLabel="Apply and restart Wi-Fi"
        help={null}
      >
        <p>
          Saves AP SSID, passphrase and channel — then restarts the hub&apos;s Wi-Fi. Devices drop off briefly and
          reconnect on their own.
        </p>
      </DecisionLayer>
      <HubRadioCard />
      <NetworkExtrasCard />
    </>
  );
}

function HubRadioCard() {
  const t = useHubTunables();
  return (
    <SettingsCard
      id="hub-radio"
      title="Hub radio"
      icon="wifi"
      intro="The hub ESP's own Wi-Fi client behaviour."
      loadState={t.state}
      loadError={t.error}
    >
      <HubTunableRow entityId="switch.dsc_hub_lock_wifi_ap" />
    </SettingsCard>
  );
}

export function SystemSettingsPage() {
  const manifest = useSettingsManifest();
  const [pendingImport, setPendingImport] = useState<File | null>(null);
  const [importResult, setImportResult] = useState("");
  const [importing, setImporting] = useState(false);
  const surface = useFleetSelector((v) => v.fleet.surface);
  const expected = useFleetSelector((v) => v.fleet.expected_firmware);
  const ttl = manifest.rows["hub_failover.DEFAULT_TTL_SEC"];

  return (
    <>
      <SettingsCard
        id="backup"
        title="Backup"
        icon="backup-restore"
        intro="Export ops sqlite, manifest, optional .env and z2m data. Import overwrites live Pi state."
      >
        <SettingRow
          id="backup-export"
          label="Download backup"
          scope="brain"
          control={
            <a className="dsc-btn dsc-btn-secondary" href={backup_export_url()} download="dsc-hub-backup.zip">
              Download backup
            </a>
          }
        />
        <SettingRow
          id="backup-import"
          label="Import backup"
          description="Restores ops sqlite and related files. You confirm before anything is written."
          scope="brain"
          control={
            <input
              type="file"
              accept=".zip"
              aria-label="Import backup zip"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPendingImport(f);
                e.target.value = "";
              }}
            />
          }
        />
        {importResult ? <pre className="dsc-honesty">{importResult}</pre> : null}
      </SettingsCard>
      <DecisionLayer
        open={pendingImport != null}
        onDismiss={() => setPendingImport(null)}
        busy={importing}
        onConfirm={async () => {
          const f = pendingImport;
          setPendingImport(null);
          if (!f) return;
          setImporting(true);
          try {
            setImportResult(JSON.stringify(await backup_import(f)));
          } catch (e) {
            setImportResult(String((e as Error).message || e));
          } finally {
            setImporting(false);
          }
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

      <div id="storage" style={{ scrollMarginTop: 80 }}>
        <SystemDiagnosticsCard />
      </div>
      <JournalsStorageCard />

      <SettingsCard
        id="failover"
        title="Failover"
        icon="pause-hold"
        intro="What happens when the hub and the brain disagree after a reconnect."
      >
        <SettingRow
          id="failover-ttl"
          label="Hub override TTL"
          description={ttl?.description ?? "How long a hub-side manual takeover holds before the brain re-asserts Want→act."}
          scope="firmware"
          control={<Stated>{ttl ? `${String(ttl.default)} ${ttl.unit ?? ""}` : "900 s"}</Stated>}
        />
      </SettingsCard>

      <SettingsCard id="about" title="About" icon="info" intro="Use the SPA bundle stamp to confirm a deploy actually took.">
        <SettingRow id="about-surface" label="Surface" scope="brain" control={<Stated>{surface || "—"}</Stated>} />
        <SettingRow
          id="about-firmware"
          label="Expected firmware"
          scope="brain"
          control={<Stated>{expected || "—"}</Stated>}
          consumers={[{ label: "Devices › Firmware", href: `#${paths.settings("devices", "firmware")}` }]}
        />
        <SettingRow
          id="about-bundle"
          label="SPA bundle"
          description="Git SHA + build time of the JS the Pi is serving right now."
          scope="firmware"
          control={<Stated>{(import.meta.env.VITE_DSC_SPA_BUILD as string | undefined) ?? "dev"}</Stated>}
        />
        <SettingRow
          id="about-manifest"
          label="Settings manifest"
          description="Whether the running brain describes its own settings (defaults, ranges, units)."
          scope="brain"
          control={
            <Stated>
              {manifest.state === "ready"
                ? `${Object.keys(manifest.rows).length} rows`
                : manifest.state === "error"
                  ? "brain predates the manifest"
                  : "…"}
            </Stated>
          }
        />
      </SettingsCard>
    </>
  );
}
