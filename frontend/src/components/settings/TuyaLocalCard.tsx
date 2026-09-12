import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, StatusChip } from "../ui";
import { DecisionLayer } from "../DecisionLayer";
import { SlideDrawer } from "../chrome";
import { HelpTip } from "../HelpTip";
import { ZigbeeBindRow, ZIGBEE_BIND_COLS } from "./ZigbeeBindRow";
import { SettingsTable, SettingsSubRow } from "./SettingsTable";
import {
  delete_tuya_device,
  get_tuya_device_types,
  get_tuya_devices,
  get_zigbee_policies,
  get_zigbee_recipes,
  get_zigbee_roles,
  post_tuya_import,
  post_tuya_probe,
  post_tuya_set,
  put_tuya_bindings,
  put_tuya_device,
  put_zigbee_policies,
  type TuyaDevice,
  type TuyaDeviceType,
  type TuyaHealth,
  type TuyaProbeResult,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../../lib/fleetApi";
import type { FleetSnapshot } from "../../lib/fleetModel";
import { TASK_PARAM_IDS } from "./settingsConstants";
import { taskParamDefaults } from "./settingsHelpers";

/**
 * Settings › Devices › Tuya (local) — SmartLife Wi-Fi devices over the LAN protocol
 * (plan-tuya-local § 2.6). Same add → role/zone/task → integrate path as Zigbee:
 * the bind row is shared; this card adds the key import, the per-device probe and
 * the honesty line (LIVE / STALE / OFFLINE · PENDING / SYNCED / DIFFERS).
 *
 * Tuya plugs keep their last state if the brain stops — they serve the auxiliary
 * plug roles, never the hub-driven heater / humidifier / dehumidifier / heat-mat path.
 * The lamp roles (plug_light_4x8 / _2x4) are the one load-bearing exception: a tent
 * with no hub light output drives its lamp from here, following the hub's window
 * (brain/dsc_brain/light_plug.py). That path needs an off-only schedule left on the
 * plug as its failsafe, which is why the help tip spells it out.
 */

type BindDraft = {
  role: string;
  zone: string;
  friendly_name: string;
  alias?: string;
  enabled: boolean;
  capability_override?: string;
};
type PolicyDraft = { recipe_id: string; enabled: boolean; params: Record<string, unknown> };

type EditDraft = {
  id: string;
  name: string;
  ip: string;
  version: string;
  type: string;
  enabled: boolean;
  local_key: string;
  dps_map_text: string;
  scales_text: string;
};

const VERSIONS = ["3.1", "3.3", "3.4", "3.5"] as const;
const POLL_MS = 5000;

const LINK_TONE: Record<string, "ok" | "warn" | "bad" | "muted"> = {
  live: "ok",
  stale: "warn",
  offline: "bad",
  key_changed: "bad",
};
const LINK_LABEL: Record<string, string> = {
  live: "LIVE",
  stale: "STALE",
  offline: "OFFLINE",
  key_changed: "KEY CHANGED",
};
const WRITE_TONE: Record<string, "ok" | "warn" | "bad" | "muted"> = {
  pending: "warn",
  synced: "ok",
  differs: "warn",
  failed: "bad",
};

function buildDrafts(devices: TuyaDevice[], policies: Record<string, { recipe_id: string; enabled?: boolean; params?: Record<string, unknown> }>) {
  const bind: Record<string, BindDraft> = {};
  const policy: Record<string, PolicyDraft> = {};
  for (const d of devices) {
    bind[d.id] = {
      role: String(d.binding?.role ?? "unbound"),
      zone: String(d.binding?.zone ?? "shared"),
      friendly_name: d.name,
      alias: d.binding?.alias ? String(d.binding.alias) : undefined,
      enabled: d.binding?.enabled === false ? false : true,
      capability_override: d.binding?.capability_override ? String(d.binding.capability_override) : undefined,
    };
    const pol = policies[d.id];
    policy[d.id] = {
      recipe_id: String(pol?.recipe_id ?? "none"),
      enabled: pol?.enabled === false ? false : true,
      params: (pol?.params as Record<string, unknown>) ?? {},
    };
  }
  return { bind, policy };
}

function parseDevicesJson(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Paste the contents of devices.json first.");
  const parsed = JSON.parse(trimmed) as unknown;
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object" && Array.isArray((parsed as { devices?: unknown }).devices)) return parsed;
  throw new Error("devices.json should be a list of devices (what `python -m tinytuya wizard` writes).");
}

function parseNumberMap(text: string, label: string): Record<string, number> | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = JSON.parse(trimmed) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`${label} must be a JSON object like {"state": 1}`);
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error(`${label}: ${k} is not a number`);
    out[k] = n;
  }
  return out;
}

function formatDatapoint(key: string, value: unknown, types: TuyaDeviceType[], typeId: string): string {
  const dp = types.find((t) => t.id === typeId)?.datapoints.find((p) => p.key === key);
  if (typeof value === "boolean") return `${key} ${value ? "ON" : "OFF"}`;
  if (typeof value === "number") return `${key} ${Number.isInteger(value) ? value : value.toFixed(2)}${dp?.unit ? ` ${dp.unit}` : ""}`;
  return `${key} ${String(value)}`;
}

const META_KEYS = new Set([
  "friendly_name",
  "device_id",
  "lane",
  "updated_at",
  "link",
  "link_reason",
  "write_state",
  "write_error",
  "commanded",
  "role",
  "zone",
  "kind",
  "bound_stub",
]);

export function TuyaLocalCard({ fleet, onSaved }: { fleet: FleetSnapshot | null; onSaved?: () => void }) {
  const [devices, setDevices] = useState<TuyaDevice[]>([]);
  const [health, setHealth] = useState<TuyaHealth | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [types, setTypes] = useState<TuyaDeviceType[]>([]);
  const [roles, setRoles] = useState<ZigbeeRole[]>([]);
  const [recipes, setRecipes] = useState<ZigbeeRecipe[]>([]);
  const [bindDraft, setBindDraft] = useState<Record<string, BindDraft>>({});
  const [policyDraft, setPolicyDraft] = useState<Record<string, PolicyDraft>>({});
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [bindDirty, setBindDirty] = useState(false);
  const [savingBindings, setSavingBindings] = useState(false);
  const [bindMsg, setBindMsg] = useState("");
  // Per-action in-flight flags (AGENTS.md: never one shared busy flag).
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [probing, setProbing] = useState<Record<string, boolean>>({});
  const [probeResult, setProbeResult] = useState<Record<string, TuyaProbeResult>>({});
  const [importing, setImporting] = useState(false);
  const [savingDevice, setSavingDevice] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [drawer, setDrawer] = useState<"add" | "edit" | null>(null);
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [pasteText, setPasteText] = useState("");
  const [importMsg, setImportMsg] = useState<string>("");
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [addRows, setAddRows] = useState<Record<string, { ip: string; version: string; type: string }>>({});
  const [edit, setEdit] = useState<EditDraft | null>(null);
  const [editMsg, setEditMsg] = useState("");
  const [pendingDelete, setPendingDelete] = useState<TuyaDevice | null>(null);
  const [deleteErr, setDeleteErr] = useState("");

  const load = useCallback(
    async (opts?: { keepDrafts?: boolean }) => {
      try {
        const [d, pol] = await Promise.all([get_tuya_devices(), get_zigbee_policies().catch(() => ({ policies: {} }))]);
        setDevices(d.devices ?? []);
        setHealth(d.health ?? null);
        setLoadErr(null);
        if (!(opts?.keepDrafts && bindDirty)) {
          const drafts = buildDrafts(d.devices ?? [], pol.policies ?? {});
          setBindDraft(drafts.bind);
          setPolicyDraft(drafts.policy);
        }
      } catch (e) {
        setLoadErr(e instanceof Error ? e.message : String(e));
      }
    },
    [bindDirty],
  );

  useEffect(() => {
    void load();
    void get_tuya_device_types()
      .then((r) => setTypes(r.device_types ?? []))
      .catch(() => undefined);
    void get_zigbee_roles()
      .then((r) => setRoles(r.roles ?? []))
      .catch(() => undefined);
    void get_zigbee_recipes()
      .then((r) => setRecipes(r.recipes ?? []))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live rows: link / write state / datapoints move without a page refresh.
  useEffect(() => {
    if (!devices.length) return;
    const t = window.setInterval(() => void load({ keepDrafts: true }), POLL_MS);
    return () => window.clearInterval(t);
  }, [devices.length, load]);

  const unboundCount = useMemo(() => Object.values(bindDraft).filter((b) => b.role === "unbound").length, [bindDraft]);
  const policyLive = (fleet?.system?.zigbee_policy_state ?? {}) as Record<string, { problem?: boolean }>;

  const openAdd = () => {
    setAddStep(1);
    setPasteText("");
    setImportMsg("");
    setImportedIds([]);
    setAddRows({});
    setDrawer("add");
  };

  const doImport = async () => {
    setImporting(true);
    setImportMsg("");
    try {
      const body = parseDevicesJson(pasteText);
      const r = await post_tuya_import(body);
      const rows: Record<string, { ip: string; version: string; type: string }> = {};
      for (const d of r.devices) rows[d.id] = { ip: d.ip, version: d.version, type: d.type };
      setAddRows(rows);
      setImportedIds(r.imported);
      const bits = [`${r.imported.length} device${r.imported.length === 1 ? "" : "s"} imported`];
      if (r.missing_ip.length) bits.push(`${r.missing_ip.length} without an IP`);
      if (r.skipped.length) bits.push(`${r.skipped.length} skipped (${r.skipped.map((s) => s.reason).join("; ")})`);
      setImportMsg(bits.join(" · "));
      if (r.imported.length) setAddStep(2);
      await load();
      onSaved?.();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setImporting(false);
    }
  };

  const saveAddRow = async (id: string) => {
    const row = addRows[id];
    if (!row) return;
    setSavingDevice(true);
    try {
      await put_tuya_device(id, { ip: row.ip, version: row.version, type: row.type });
      await load();
      onSaved?.();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingDevice(false);
    }
  };

  const probe = async (id: string, override?: { ip?: string; version?: string }) => {
    setProbing((p) => ({ ...p, [id]: true }));
    try {
      const r = await post_tuya_probe(id, override);
      setProbeResult((p) => ({ ...p, [id]: r }));
      if (r.ok && r.guess_type && addRows[id] && !addRows[id].type) {
        setAddRows((rows) => ({ ...rows, [id]: { ...rows[id], type: r.guess_type ?? "" } }));
      }
    } catch (e) {
      setProbeResult((p) => ({ ...p, [id]: { ok: false, error: e instanceof Error ? e.message : String(e) } }));
    } finally {
      setProbing((p) => ({ ...p, [id]: false }));
    }
  };

  const toggle = async (d: TuyaDevice, on: boolean) => {
    setToggling((t) => ({ ...t, [d.id]: true }));
    try {
      await post_tuya_set(d.id, on);
      await load({ keepDrafts: true });
    } catch (e) {
      setBindMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setToggling((t) => ({ ...t, [d.id]: false }));
    }
  };

  const openEdit = (d: TuyaDevice) => {
    setEdit({
      id: d.id,
      name: d.name,
      ip: d.ip,
      version: d.version,
      type: d.type,
      enabled: d.enabled,
      local_key: "",
      dps_map_text: Object.keys(d.dps_map ?? {}).length ? JSON.stringify(d.dps_map) : "",
      scales_text: Object.keys(d.scales ?? {}).length ? JSON.stringify(d.scales) : "",
    });
    setEditMsg("");
    setDrawer("edit");
  };

  const saveEdit = async () => {
    if (!edit) return;
    setSavingDevice(true);
    setEditMsg("");
    try {
      const patch: Parameters<typeof put_tuya_device>[1] = {
        name: edit.name,
        ip: edit.ip,
        version: edit.version,
        type: edit.type,
        enabled: edit.enabled,
      };
      if (edit.local_key.trim()) patch.local_key = edit.local_key.trim();
      const dps = parseNumberMap(edit.dps_map_text, "DPS map");
      if (dps) patch.dps_map = dps;
      const scales = parseNumberMap(edit.scales_text, "Scales");
      if (scales) patch.scales = scales;
      await put_tuya_device(edit.id, patch);
      setDrawer(null);
      setEdit(null);
      await load();
      onSaved?.();
    } catch (e) {
      setEditMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingDevice(false);
    }
  };

  const doDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteErr("");
    try {
      await delete_tuya_device(pendingDelete.id);
      setPendingDelete(null);
      await load();
      onSaved?.();
    } catch (e) {
      setDeleteErr(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  };

  const saveBindings = async () => {
    setSavingBindings(true);
    setBindMsg("");
    try {
      await put_tuya_bindings(bindDraft);
      // Policies live in the shared recipe store keyed by device id: overlay ours only.
      const current = await get_zigbee_policies().catch(() => ({ policies: {} }));
      const merged: Record<string, Record<string, unknown>> = { ...(current.policies as Record<string, Record<string, unknown>>) };
      for (const [id, p] of Object.entries(policyDraft)) merged[id] = p;
      await put_zigbee_policies(merged);
      setBindDirty(false);
      await load();
      onSaved?.();
    } catch (e) {
      setBindMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingBindings(false);
    }
  };

  const healthChips = health ? (
    <div className="dsc-chip-row" style={{ marginBottom: 10, flexWrap: "wrap" }}>
      <StatusChip
        label={!health.available ? "TINYTUYA MISSING" : health.enabled_count === 0 ? "NO DEVICES" : `${health.live} LIVE`}
        tone={!health.available ? "bad" : health.enabled_count === 0 ? "muted" : health.live === health.enabled_count ? "ok" : "warn"}
      />
      {health.stale ? <StatusChip label={`${health.stale} STALE`} tone="warn" /> : null}
      {health.offline ? <StatusChip label={`${health.offline} OFFLINE`} tone="bad" /> : null}
      {health.key_changed ? <StatusChip label={`${health.key_changed} KEY CHANGED`} tone="bad" /> : null}
      <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
        {health.note}
      </span>
    </div>
  ) : null;

  return (
    <section className="dsc-card" id="tuya" style={{ scrollMarginTop: 80 }}>
      <h3>Tuya / SmartLife (Wi-Fi, local)</h3>
      <p className="dsc-muted">
        SmartLife plugs and testers driven over your LAN — no Tuya cloud once each device&apos;s local key is on the Pi.
        Same Role · Zone · Task binding as Zigbee.
      </p>
      {healthChips}
      {loadErr ? <p className="dsc-muted">Could not load Tuya devices: {loadErr}</p> : null}
      <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 8 }}>
        <Button primary onClick={openAdd}>
          Add devices (import keys)
        </Button>
        <HelpTip title="What a Tuya plug can and cannot do">
          <p>
            A Tuya plug keeps its last state if the brain stops — there is no hub cut-out behind it. Use these for pumps,
            dosing and aux fans (the <b>plug_*</b> roles). The heater, humidifier, dehumidifier and heat mat stay on the
            hub-driven relays, which fail safe.
          </p>
          <p>
            <b>Lamp plugs are the exception worth reading twice.</b> A tent whose light is not on a hub output — the 4×8
            today — can bind a plug to <b>Lamp plug · 4×8</b> or <b>· 2×4</b>, and the brain then follows the hub's own
            photoperiod window, so the tent keeps the hub's clock instead of the plug's schedule. It is on/off only: no
            sunrise or sunset ramp. And because the plug holds its last state, leave an <b>off-only</b> schedule on the
            plug itself (a few minutes after lights-off) so a brain outage can never strand the lamp on through the dark
            period. Do not leave an <i>on</i> schedule there — that is the only way the two can fight.
          </p>
          <p>
            Tuya firmware accepts one local connection at a time: while the brain holds it the SmartLife app falls back
            to the cloud (or stops working for that device once you block its internet access — which is the goal).
          </p>
        </HelpTip>
      </div>

      {devices.length ? (
        <>
          <p className="dsc-muted" style={{ marginTop: 12 }}>
            Assign a <strong>Role</strong>, <strong>Zone</strong> and optional <strong>Task</strong>, then{" "}
            <strong>Save roles &amp; tasks</strong>. The line under each device is its honesty state: link, what the
            brain last commanded and whether the device agrees.
          </p>
          {unboundCount ? <StatusChip label={`UNBOUND ${unboundCount}`} tone="warn" /> : null}
          <SettingsTable
            columns={[
              { key: "device", label: "Device" },
              { key: "type", label: "Type" },
              { key: "health", label: "Seen", tight: true },
              { key: "status", label: "Status" },
              { key: "role", label: "Role" },
              { key: "zone", label: "Zone" },
              { key: "task", label: "Task" },
              { key: "act", label: "", tight: true },
            ]}
            help={{
              title: "Link and write states",
              body: (
                <>
                  <p>
                    <b>LIVE</b> a report within 30 s · <b>STALE</b> older · <b>OFFLINE</b> unreachable · <b>KEY CHANGED</b>{" "}
                    the device was re-paired in SmartLife and needs a fresh key import.
                  </p>
                  <p>
                    <b>PENDING</b> commanded, not yet echoed · <b>SYNCED</b> device agrees · <b>DIFFERS</b> someone
                    changed it elsewhere · <b>FAILED</b> the write did not land.
                  </p>
                </>
              ),
            }}
          >
            {devices.map((d) => {
              const draft = bindDraft[d.id] ?? { role: "unbound", zone: "shared", friendly_name: d.name, enabled: true };
              const policy = policyDraft[d.id] ?? { recipe_id: "none", enabled: true, params: {} };
              const live = policyLive[d.id];
              const liveProblem = policy.recipe_id !== "none" && live && typeof live.problem === "boolean" ? Boolean(live.problem) : null;
              const st = d.state;
              const link = String(st.link ?? "offline");
              const write = st.write_state ? String(st.write_state) : null;
              const datapoints = Object.entries(st).filter(([k, v]) => !META_KEYS.has(k) && v != null && typeof v !== "object");
              const isOn = typeof st.state === "boolean" ? st.state : null;
              const probeRes = probeResult[d.id];
              return (
                <ZigbeeBindRowWithLine
                  key={d.id}
                  d={d}
                  draft={draft}
                  policy={policy}
                  liveProblem={liveProblem}
                  showAll={Boolean(showAll[d.id])}
                  roles={roles}
                  recipes={recipes}
                  onToggleShowAll={() => setShowAll((p) => ({ ...p, [d.id]: !p[d.id] }))}
                  onRename={(id, alias) => {
                    setBindDirty(true);
                    setBindDraft((prev) => ({ ...prev, [id]: { ...(prev[id] ?? draft), alias: alias || undefined } }));
                  }}
                  onBindingChange={(id, patch) => {
                    setBindDirty(true);
                    setBindDraft((prev) => {
                      const base: BindDraft = {
                        role: patch.role,
                        zone: patch.zone,
                        friendly_name: d.name,
                        alias: prev[id]?.alias,
                        enabled: true,
                      };
                      return { ...prev, [id]: patch.capability_override ? { ...base, capability_override: patch.capability_override } : base };
                    });
                    setPolicyDraft((prev) => ({
                      ...prev,
                      [id]: {
                        recipe_id: patch.role === "unbound" ? "none" : patch.recipe_id,
                        enabled: true,
                        params: patch.role === "unbound" ? {} : (prev[id]?.params ?? {}),
                      },
                    }));
                  }}
                  onPolicyChange={(id, patch) => {
                    setBindDirty(true);
                    setPolicyDraft((prev) => ({ ...prev, [id]: { recipe_id: patch.recipe_id, enabled: true, params: patch.params } }));
                  }}
                  line={
                    <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <StatusChip label={LINK_LABEL[link] ?? link.toUpperCase()} tone={LINK_TONE[link] ?? "muted"} />
                      {!d.runnable ? (
                        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                          {!d.enabled ? "disabled" : !d.ip ? "no IP — edit and set one" : !d.type ? "no type — probe, then pick one" : "no key"}
                        </span>
                      ) : null}
                      {st.link_reason && link !== "live" ? (
                        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                          {String(st.link_reason)}
                        </span>
                      ) : null}
                      {d.can_actuate && isOn != null ? <StatusChip label={isOn ? "ON" : "OFF"} tone={isOn ? "ok" : "muted"} /> : null}
                      {write ? <StatusChip label={write.toUpperCase()} tone={WRITE_TONE[write] ?? "muted"} /> : null}
                      {st.write_error ? (
                        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                          {String(st.write_error)}
                        </span>
                      ) : null}
                      {datapoints.length ? (
                        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                          {datapoints
                            .filter(([k]) => k !== "state")
                            .map(([k, v]) => formatDatapoint(k, v, types, d.type))
                            .join(" · ")}
                        </span>
                      ) : link === "live" ? null : (
                        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                          no report yet
                        </span>
                      )}
                      <span style={{ flex: "1 1 auto" }} />
                      {d.can_actuate ? (
                        <>
                          <Button variant="secondary" busy={Boolean(toggling[d.id])} disabled={!d.runnable} onClick={() => void toggle(d, true)}>
                            On
                          </Button>
                          <Button variant="secondary" busy={Boolean(toggling[d.id])} disabled={!d.runnable} onClick={() => void toggle(d, false)}>
                            Off
                          </Button>
                        </>
                      ) : null}
                      <Button variant="secondary" busy={Boolean(probing[d.id])} disabled={!d.ip} onClick={() => void probe(d.id)}>
                        Probe
                      </Button>
                      <Button variant="secondary" onClick={() => openEdit(d)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => setPendingDelete(d)}>
                        Remove
                      </Button>
                      {probeRes ? (
                        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", flexBasis: "100%" }}>
                          {probeRes.ok
                            ? `Probe OK (${probeRes.source}) · raw DPS ${JSON.stringify(probeRes.dps ?? {})}${
                                probeRes.guess_type ? ` · looks like ${types.find((t) => t.id === probeRes.guess_type)?.label ?? probeRes.guess_type}` : ""
                              }`
                            : `Probe failed: ${probeRes.error ?? "?"}${probeRes.hint ? ` — ${probeRes.hint}` : ""}`}
                        </span>
                      ) : null}
                    </div>
                  }
                />
              );
            })}
          </SettingsTable>
          <div className="dsc-row-actions" style={{ alignItems: "center", gap: 10 }}>
            <Button onClick={() => void saveBindings()} disabled={!bindDirty} busy={savingBindings}>
              Save roles &amp; tasks
            </Button>
            {bindMsg ? <span className="dsc-muted">{bindMsg}</span> : null}
          </div>
        </>
      ) : health && !health.available ? (
        <p className="dsc-muted" style={{ marginTop: 10 }}>
          The brain image does not have <code>tinytuya</code> installed, so no Tuya device can connect. Update the brain
          (Firmware › Kit update) and come back.
        </p>
      ) : (
        <p className="dsc-muted" style={{ marginTop: 10 }}>
          No Tuya devices yet. <strong>Add devices</strong> walks through the one-time key export from your Tuya account
          and the LAN check for each device.
        </p>
      )}

      <SlideDrawer open={drawer === "add"} onClose={() => setDrawer(null)} title={addStep === 1 ? "Add Tuya devices · 1 of 2 · Get the keys" : "Add Tuya devices · 2 of 2 · Reach each device"} wide>
        {addStep === 1 ? (
          <div className="dsc-cam-form">
            <p className="dsc-muted" style={{ margin: 0 }}>
              <b>What:</b> every SmartLife Wi-Fi device has a secret <i>local key</i>. With it the Pi talks to the device
              directly on your network; without it nothing but the Tuya cloud can. <b>Process:</b> a one-time export on
              any PC. <b>Expected:</b> a small <code>devices.json</code> file you paste below. The brain never contacts
              Tuya.
            </p>
            <ol style={{ margin: "4px 0 0", paddingLeft: 18, lineHeight: 1.5 }}>
              <li>
                Create a free developer account at <code>iot.tuya.com</code> → Cloud → Create Cloud Project (data centre:
                the region your SmartLife app uses, e.g. <i>Central Europe</i> or <i>Western America</i>; industry
                Smart Home; development method Smart Home). Subscribe the free <i>IoT Core</i> trial when asked.
              </li>
              <li>
                In the project open <b>Devices → Link Tuya App Account → Add App Account</b> and scan the QR code from
                the SmartLife app (Me → ⚙ → Developer/Link… or just scan with the app&apos;s scanner). Your devices
                appear under the project.
              </li>
              <li>
                Note the project&apos;s <b>Access ID</b> and <b>Access Secret</b> (Overview tab).
              </li>
              <li>
                On any PC with Python:
                <pre style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>{`python -m pip install tinytuya
python -m tinytuya wizard`}</pre>
                Answer with the Access ID, Access Secret, the id of <i>any one</i> of your devices (shown in SmartLife →
                device → ⚙ → Device information) and the region. Say <b>yes</b> to <i>download all device data</i> and{" "}
                <b>yes</b> to <i>poll local devices</i> — that fills in each device&apos;s IP.
              </li>
              <li>
                Open the <code>devices.json</code> the wizard wrote (next to where you ran it) and paste it here.
              </li>
            </ol>
            <p className="dsc-muted" style={{ margin: 0, fontSize: "var(--dsc-fs-sm)" }}>
              Keys rotate when a device is re-paired in SmartLife — repeat this export and import again if a device
              shows <b>KEY CHANGED</b>. The trial cloud subscription can lapse later; the keys you already exported keep
              working.
            </p>
            <label>
              <span>devices.json</span>
              <textarea
                rows={8}
                aria-label="devices.json contents"
                value={pasteText}
                placeholder='[{"name": "Tent pump plug", "id": "bf…", "key": "…", "ip": "192.168.1.61", "version": "3.4"}, …]'
                onChange={(e) => setPasteText(e.target.value)}
                style={{ fontFamily: "var(--dsc-mono)", fontSize: "var(--dsc-fs-sm)" }}
              />
            </label>
            {importMsg ? <p className="dsc-muted" style={{ margin: 0 }}>{importMsg}</p> : null}
            <div className="dsc-row-actions">
              <Button primary onClick={() => void doImport()} busy={importing} disabled={!pasteText.trim()}>
                Import
              </Button>
              <Button onClick={() => setDrawer(null)} disabled={importing}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="dsc-cam-form">
            <p className="dsc-muted" style={{ margin: 0 }}>
              <b>What:</b> the Pi must reach each device on TCP 6668. <b>Process:</b> give each a fixed IP (a DHCP
              reservation on your router — the brain cannot discover Tuya broadcasts from its container), then{" "}
              <b>Probe</b>. <b>Expected:</b> raw datapoints back, and a suggested device type. Close the SmartLife app
              while probing — Tuya devices accept one local connection at a time.
            </p>
            {importMsg ? <p className="dsc-muted" style={{ margin: 0 }}>{importMsg}</p> : null}
            {importedIds.map((id) => {
              const d = devices.find((x) => x.id === id);
              const row = addRows[id] ?? { ip: d?.ip ?? "", version: d?.version ?? "3.3", type: d?.type ?? "" };
              const res = probeResult[id];
              return (
                <div key={id} style={{ border: "1px solid var(--dsc-line, #333)", borderRadius: 6, padding: 10 }}>
                  <div style={{ fontWeight: 600 }}>
                    {d?.name ?? id} <span className="dsc-muted" style={{ fontWeight: 400, fontFamily: "var(--dsc-mono)", fontSize: "var(--dsc-fs-sm)" }}>{id}</span>
                  </div>
                  <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 8, marginTop: 6, alignItems: "flex-end" }}>
                    <label>
                      <span>IP</span>
                      <input
                        type="text"
                        aria-label={`IP address for ${d?.name ?? id}`}
                        value={row.ip}
                        placeholder="192.168.1.61"
                        style={{ width: 140 }}
                        onChange={(e) => setAddRows((rows) => ({ ...rows, [id]: { ...row, ip: e.target.value } }))}
                      />
                    </label>
                    <label>
                      <span>Version</span>
                      <select
                        aria-label={`Protocol version for ${d?.name ?? id}`}
                        value={row.version}
                        onChange={(e) => setAddRows((rows) => ({ ...rows, [id]: { ...row, version: e.target.value } }))}
                      >
                        {VERSIONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button
                      variant="secondary"
                      busy={Boolean(probing[id])}
                      disabled={!row.ip.trim()}
                      onClick={() => void probe(id, { ip: row.ip.trim(), version: row.version })}
                    >
                      Probe
                    </Button>
                    <label>
                      <span>Type</span>
                      <select
                        aria-label={`Device type for ${d?.name ?? id}`}
                        value={row.type}
                        onChange={(e) => setAddRows((rows) => ({ ...rows, [id]: { ...row, type: e.target.value } }))}
                      >
                        <option value="">— pick after probing —</option>
                        {types.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button primary busy={savingDevice} disabled={!row.ip.trim() || !row.type} onClick={() => void saveAddRow(id)}>
                      Save
                    </Button>
                  </div>
                  {res ? (
                    <p className="dsc-muted" style={{ margin: "6px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
                      {res.ok
                        ? `Reached · raw DPS ${JSON.stringify(res.dps ?? {})}${res.guess_type ? ` · looks like ${types.find((t) => t.id === res.guess_type)?.label ?? res.guess_type}` : " · no known type matched — pick one and adjust its DPS map under Edit"}`
                        : `Not reached: ${res.error ?? "?"}${res.hint ? ` — ${res.hint}` : ""}`}
                    </p>
                  ) : null}
                  {d?.type ? (
                    <p className="dsc-muted" style={{ margin: "6px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
                      Saved as {d.type_label}. Bind its Role and Zone in the table behind this drawer.
                    </p>
                  ) : null}
                </div>
              );
            })}
            <div className="dsc-row-actions">
              <Button onClick={() => setAddStep(1)}>Back</Button>
              <Button primary onClick={() => setDrawer(null)}>
                Done — bind roles
              </Button>
            </div>
          </div>
        )}
      </SlideDrawer>

      <SlideDrawer open={drawer === "edit" && edit != null} onClose={() => setDrawer(null)} title={`Tuya device · ${edit?.name ?? ""}`} wide>
        {edit ? (
          <form
            className="dsc-cam-form"
            onSubmit={(e) => {
              e.preventDefault();
              void saveEdit();
            }}
          >
            <label>
              <span>Name</span>
              <input type="text" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </label>
            <label>
              <span>Device id</span>
              <input type="text" value={edit.id} disabled />
            </label>
            <label>
              <span>IP</span>
              <input type="text" value={edit.ip} placeholder="192.168.1.61 (DHCP reservation)" onChange={(e) => setEdit({ ...edit, ip: e.target.value })} />
            </label>
            <label>
              <span>Protocol</span>
              <select value={edit.version} onChange={(e) => setEdit({ ...edit, version: e.target.value })}>
                {VERSIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Type</span>
              <select value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value, dps_map_text: "", scales_text: "" })}>
                <option value="">— none —</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            {edit.type ? (
              <p className="dsc-muted dsc-cam-form-help">{types.find((t) => t.id === edit.type)?.note ?? ""}</p>
            ) : null}
            <label>
              <span>Enabled</span>
              <input type="checkbox" checked={edit.enabled} onChange={(e) => setEdit({ ...edit, enabled: e.target.checked })} />
            </label>
            <label>
              <span>New local key</span>
              <input
                type="password"
                value={edit.local_key}
                placeholder="leave blank to keep the stored key"
                autoComplete="off"
                onChange={(e) => setEdit({ ...edit, local_key: e.target.value })}
              />
            </label>
            <details>
              <summary className="dsc-muted">Advanced — DPS map and scales</summary>
              <p className="dsc-muted dsc-cam-form-help">
                Which numbered Tuya datapoint carries each reading, and the multiplier that turns the raw integer into
                the unit shown (a plug reporting 1234 for 123.4 W has power scale 0.1). Blank = the type&apos;s defaults
                ({edit.type ? JSON.stringify(types.find((t) => t.id === edit.type)?.dps_map ?? {}) : "pick a type"}). Probe
                first to see the raw DPS.
              </p>
              <label>
                <span>DPS map</span>
                <input
                  type="text"
                  value={edit.dps_map_text}
                  placeholder='{"state": 1, "power": 19}'
                  style={{ fontFamily: "var(--dsc-mono)" }}
                  onChange={(e) => setEdit({ ...edit, dps_map_text: e.target.value })}
                />
              </label>
              <label>
                <span>Scales</span>
                <input
                  type="text"
                  value={edit.scales_text}
                  placeholder='{"power": 0.1}'
                  style={{ fontFamily: "var(--dsc-mono)" }}
                  onChange={(e) => setEdit({ ...edit, scales_text: e.target.value })}
                />
              </label>
            </details>
            {editMsg ? <p className="dsc-muted" style={{ margin: 0 }}>{editMsg}</p> : null}
            <div className="dsc-row-actions">
              <Button primary type="submit" busy={savingDevice}>
                Save
              </Button>
              <Button onClick={() => setDrawer(null)} disabled={savingDevice}>
                Cancel
              </Button>
            </div>
          </form>
        ) : null}
      </SlideDrawer>

      <DecisionLayer
        open={pendingDelete != null}
        onDismiss={() => {
          if (!deleting) {
            setPendingDelete(null);
            setDeleteErr("");
          }
        }}
        onConfirm={() => void doDelete()}
        title={`Remove ${pendingDelete?.name ?? "device"}?`}
        confirmLabel="Remove"
        busy={deleting}
        help={null}
      >
        <p>
          Forgets this device, its role binding and its task. The plug itself is untouched (and keeps its current
          state). A rule that targets it must be changed first — the brain refuses the removal otherwise.
        </p>
        {deleteErr ? <p className="dsc-muted">{deleteErr}</p> : null}
      </DecisionLayer>
    </section>
  );
}

/** The shared bind row plus the Tuya honesty / actions line beneath it. */
function ZigbeeBindRowWithLine({
  d,
  draft,
  policy,
  liveProblem,
  showAll,
  roles,
  recipes,
  line,
  onToggleShowAll,
  onRename,
  onBindingChange,
  onPolicyChange,
}: {
  d: TuyaDevice;
  draft: BindDraft;
  policy: PolicyDraft;
  liveProblem: boolean | null;
  showAll: boolean;
  roles: ZigbeeRole[];
  recipes: ZigbeeRecipe[];
  line: React.ReactNode;
  onToggleShowAll: () => void;
  onRename: (id: string, alias: string) => void;
  onBindingChange: (id: string, patch: { role: string; zone: string; recipe_id: string; capability_override?: string }) => void;
  onPolicyChange: (id: string, patch: { recipe_id: string; params: Record<string, unknown> }) => void;
}) {
  return (
    <>
      <ZigbeeBindRow
        ieee={d.id}
        name={d.name}
        alias={draft.alias}
        model={d.type_label || "type not set"}
        status={d.status}
        role={draft.role}
        zone={draft.zone}
        recipeId={policy.recipe_id}
        policyParams={policy.params}
        capabilityClass={d.capability_class}
        capabilityOverride={draft.capability_override}
        showAll={showAll}
        liveProblem={liveProblem}
        lastSeen={typeof d.state.updated_at === "number" ? d.state.updated_at : null}
        onToggleShowAll={onToggleShowAll}
        allRoles={roles}
        allRecipes={recipes}
        onRename={onRename}
        onBindingChange={(id, patch) => {
          onBindingChange(id, patch);
          if (TASK_PARAM_IDS.has(patch.recipe_id) && policy.recipe_id !== patch.recipe_id) {
            onPolicyChange(id, { recipe_id: patch.recipe_id, params: taskParamDefaults(patch.recipe_id, recipes.find((r) => r.id === patch.recipe_id)) });
          }
        }}
        onPolicyChange={onPolicyChange}
      />
      <SettingsSubRow colSpan={ZIGBEE_BIND_COLS}>{line}</SettingsSubRow>
    </>
  );
}
