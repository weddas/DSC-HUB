import { useEffect, useMemo, useState } from "react";
import { Button, StatusChip } from "../ui";
import { SlideDrawer } from "../chrome";
import { DecisionLayer } from "../DecisionLayer";
import { SettingRow, SettingsCard, Stated, Toggle } from "./SettingRow";
import { useHubTunables } from "../../hooks/useHubTunables";
import { usePreference } from "../../hooks/usePreference";
import { useSettingsManifest } from "../../hooks/useSettingsManifest";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { useFleetSelector } from "../../hooks/useFleet";
import { formatClock, formatStamp } from "../../lib/units";
import { paths } from "../../lib/paths";
import {
  INTERNAL_PREFERENCE_KEYS,
  PREFERENCE_DEFAULTS,
  getPreferences,
  isPreferenceDefault,
  resetAllPreferences,
  resetPreference,
  setPreferences,
  type PreferenceKey,
  type Preferences,
} from "../../lib/preferences";
import {
  factoryReset,
  getFactoryResetInfo,
  getFailover,
  getRawFleet,
  getRouteHealth,
  getSetupProfile,
  getSetupState,
  getSystemTime,
  importSetupProfile,
  type FailoverState,
  type ProfileImportResult,
  type RouteHealth,
  type SetupProfile,
  type SystemTime,
} from "../../lib/systemApi";

type Load<T> = { data: T | null; state: "loading" | "ready" | "error"; error?: string };

function useLoad<T>(fn: () => Promise<T>, everyMs = 0): Load<T> & { reload: () => void } {
  const [v, setV] = useState<Load<T>>({ data: null, state: "loading" });
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    const run = () =>
      fn()
        .then((data) => alive && setV({ data, state: "ready" }))
        .catch((e: unknown) => alive && setV((cur) => ({ data: cur.data, state: "error", error: e instanceof Error ? e.message : String(e) })));
    void run();
    const id = everyMs ? window.setInterval(() => void run(), everyMs) : 0;
    return () => {
      alive = false;
      if (id) window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);
  return { ...v, reload: () => setN((x) => x + 1) };
}

const fmtDur = (s: unknown) => {
  const n = Number(s);
  if (!Number.isFinite(n)) return "—";
  if (n < 90) return `${Math.round(n)} s`;
  if (n < 5400) return `${Math.round(n / 60)} min`;
  if (n < 172800) return `${(n / 3600).toFixed(1)} h`;
  return `${(n / 86400).toFixed(1)} d`;
};

/* ---- Time --------------------------------------------------------------------------- */

export function TimeCard() {
  const t = useLoad<SystemTime>(getSystemTime, 15000);
  const d = t.data;
  const drift = d?.hub.drift_s;
  const driftTone: "ok" | "warn" | "bad" | undefined = drift == null ? undefined : Math.abs(drift) < 5 ? "ok" : Math.abs(drift) < 60 ? "warn" : "bad";
  return (
    <SettingsCard
      id="time"
      title="Time"
      icon="timer"
      intro={d?.photoperiod_note ?? "Which clock the photoperiods run on, and whether the hub and the brain agree."}
      loadState={t.state}
      loadError={t.error}
    >
      {d ? (
        <>
          <SettingRow
            id="time-brain"
            label="Brain clock"
            description={`Pi local time in ${d.brain.timezone} (UTC${d.brain.utc_offset_min >= 0 ? "+" : "−"}${Math.abs(d.brain.utc_offset_min) / 60}). Process up ${fmtDur(d.brain.monotonic_uptime_s)}.`}
            scope="brain"
            control={<Stated>{formatClock(d.now * 1000)} · {d.brain.timezone}</Stated>}
          />
          <SettingRow
            id="time-ntp"
            label="NTP"
            description={d.ntp.detail}
            scope="brain"
            control={
              <Stated>
                {d.ntp.synced === true ? "synced" : d.ntp.synced === false ? "not synced" : "unknown on this host"}
                {d.ntp.source ? ` · ${d.ntp.source}` : ""}
              </Stated>
            }
          />
          <SettingRow
            id="time-hub"
            label="Hub clock"
            description={
              d.hub.note ??
              `The hub's sntp clock in ${d.hub.timezone}, reported ${d.hub.reported_age_s != null ? `${fmtDur(d.hub.reported_age_s)} ago` : "with the last poll"}. Light windows and stage clocks run on it.`
            }
            scope="firmware"
            state={driftTone === "bad" ? "failed" : undefined}
            stateText={driftTone === "bad" ? `drift ${drift} s — check the hub's NTP reach` : undefined}
            control={
              <span className="dsc-row-actions" style={{ alignItems: "center" }}>
                <Stated>{d.hub.epoch != null ? formatClock(d.hub.epoch * 1000) : d.hub.online ? "not published" : "hub offline"}</Stated>
                {drift != null ? <StatusChip label={`${drift > 0 ? "+" : ""}${drift} s`} tone={driftTone} /> : null}
                {d.hub.valid === false ? <StatusChip label="CLOCK INVALID" tone="warn" /> : null}
              </span>
            }
            consumers={[{ label: "Light › Schedule", href: `#${paths.settings("light")}` }]}
          />
          <SettingRow
            id="time-hub-uptime"
            label="Hub uptime"
            scope="firmware"
            control={<Stated>{d.hub.uptime_s != null ? fmtDur(d.hub.uptime_s) : "—"}</Stated>}
          />
        </>
      ) : null}
    </SettingsCard>
  );
}

/* ---- Failover ----------------------------------------------------------------------- */

export function FailoverCard() {
  const manifest = useSettingsManifest();
  const ttl = manifest.rows["hub_failover.DEFAULT_TTL_SEC"];
  const f = useLoad<FailoverState>(getFailover, 10000);
  const d = f.data;
  return (
    <SettingsCard
      id="failover"
      title="Failover"
      icon="pause-hold"
      intro="What happens when the hub and the brain disagree after a reconnect: the hub's manual state is honoured for the TTL, then the brain re-asserts Want → act."
      loadState={f.state === "error" ? "ready" : f.state}
    >
      <SettingRow
        id="failover-ttl"
        label="Hub override TTL"
        description={ttl?.description ?? "How long a hub-side manual takeover holds before the brain re-asserts Want→act."}
        scope="firmware"
        control={<Stated>{d ? `${d.ttl_sec} s` : ttl ? `${String(ttl.default)} ${ttl.unit ?? ""}` : "900 s"}</Stated>}
      />
      <SettingRow
        id="failover-state"
        label="Override now"
        description={
          d
            ? d.active
              ? `Active since ${formatStamp((d.since ?? 0) * 1000)} — ${d.remaining_s != null ? `${fmtDur(d.remaining_s)} left` : "until cleared"}; forced: ${Object.keys(d.forced).length ? Object.entries(d.forced).map(([k, v]) => `${k}=${v}`).join(", ") : "none"}.`
              : "No temporary override — the brain is driving."
            : f.error ?? "…"
        }
        scope="brain"
        control={
          d ? (
            <span className="dsc-chip-row">
              <StatusChip label={d.active ? "OVERRIDE ACTIVE" : "BRAIN DRIVING"} tone={d.active ? "warn" : "ok"} />
              {d.pending_reassert ? <StatusChip label="PENDING RE-ASSERT" tone="warn" /> : null}
              {d.manual_takeover ? <StatusChip label="MANUAL TAKEOVER" tone="bad" /> : null}
              {!d.hub_online ? <StatusChip label="HUB OFFLINE" tone="muted" /> : null}
            </span>
          ) : (
            <Stated>{f.error ? "brain predates failover state" : "…"}</Stated>
          )
        }
        consumers={[{ label: "Overview", href: `#${paths.overview()}` }]}
      />
    </SettingsCard>
  );
}

/* ---- About + route health ------------------------------------------------------------ */

export function AboutCard() {
  const manifest = useSettingsManifest();
  const surface = useFleetSelector((v) => v.fleet.surface);
  const expected = useFleetSelector((v) => v.fleet.expected_firmware);
  const routes = useLoad<RouteHealth>(getRouteHealth);
  const setup = useLoad(getSetupState);
  const served = routes.data?.optional.filter((o) => o.served).length ?? 0;
  const total = routes.data?.optional.length ?? 0;
  return (
    <SettingsCard id="about" title="About" icon="info" intro="Use the SPA bundle stamp to confirm a deploy actually took; the route list says which optional brain features this build serves.">
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
        control={<Stated>{manifest.state === "ready" ? `${Object.keys(manifest.rows).length} rows` : manifest.state === "error" ? "brain predates the manifest" : "…"}</Stated>}
      />
      <SettingRow
        id="about-setup"
        label="Kit setup"
        description={setup.data ? `Phase ${setup.data.phase}${setup.data.debt.length ? ` · ${setup.data.debt.length} flash debt item(s)` : ""}.` : setup.error ?? "…"}
        scope="brain"
        control={
          <span className="dsc-row-actions" style={{ alignItems: "center" }}>
            <Stated>{setup.data ? (setup.data.commissioned ? "commissioned" : "not commissioned") : "…"}</Stated>
            <a className="dsc-chip" href={`#${paths.setup()}`}>
              Re-run setup ↗
            </a>
          </span>
        }
      />
      <SettingRow
        id="about-routes"
        label="Brain routes"
        description={
          routes.data
            ? `${routes.data.count} routes served. Optional features: ${served} of ${total}. A missing one shows as "brain predates …" on its page until the brain is hotpatched.`
            : routes.error ?? "…"
        }
        scope="brain"
        control={
          routes.data ? (
            <ul className="dsc-routes-list" aria-label="Optional brain routes">
              {routes.data.optional.map((o) => (
                <li key={o.path} className={o.served ? "is-ok" : "is-missing"}>
                  <span>{o.label}</span>
                  <code>{o.path}</code>
                  <StatusChip label={o.served ? "SERVED" : "MISSING"} tone={o.served ? "ok" : "warn"} />
                </li>
              ))}
            </ul>
          ) : (
            <Stated>{routes.error ? "brain predates route health" : "…"}</Stated>
          )
        }
      />
    </SettingsCard>
  );
}

/* ---- Developer ----------------------------------------------------------------------- */

function PrefToggleRow({ k, label, description }: { k: "showEntityIds" | "provenanceMode" | "showInvented" | "force3d"; label: string; description: string }) {
  const [v, set] = usePreference(k);
  return (
    <SettingRow
      id={`pref-${k}`}
      label={label}
      description={description}
      scope="browser"
      defaultLabel={PREFERENCE_DEFAULTS[k] ? "on" : "off"}
      isDefault={isPreferenceDefault(k)}
      onReset={() => resetPreference(k)}
      control={<Toggle checked={v} label={label} onChange={set} />}
    />
  );
}

function RawSnapshotDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [raw, setRaw] = useState<unknown>(null);
  const [filter, setFilter] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!open) return;
    setErr("");
    getRawFleet()
      .then(setRaw)
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : String(e)));
  }, [open]);
  const text = useMemo(() => {
    if (raw == null) return "";
    const full = JSON.stringify(raw, null, 2);
    if (!filter.trim()) return full;
    const q = filter.toLowerCase();
    return full
      .split("\n")
      .filter((l) => l.toLowerCase().includes(q))
      .join("\n");
  }, [raw, filter]);
  return (
    <SlideDrawer open={open} onClose={onClose} title="Raw /fleet snapshot" wide>
      <input type="search" value={filter} placeholder="filter lines" aria-label="Filter snapshot lines" onChange={(e) => setFilter(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
      {err ? <p className="dsc-honesty">{err}</p> : null}
      <pre className="dsc-honesty" style={{ maxHeight: "70vh", overflow: "auto", fontSize: "var(--dsc-fs-xs)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {text || "…"}
      </pre>
    </SlideDrawer>
  );
}

function TunablesSyncTable() {
  const t = useHubTunables();
  const rows = t.data?.rows ?? [];
  if (t.state === "error") return <p className="dsc-muted">{t.error}</p>;
  return (
    <div className="dsc-table-scroll">
      <table className="dsc-table">
        <thead>
          <tr>
            <th>Entity</th>
            <th>Desired</th>
            <th>Hub</th>
            <th>State</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.entity_id}>
              <td>
                <code>{r.entity_id}</code>
              </td>
              <td>{r.desired ?? "—"}</td>
              <td>{r.hub ?? "—"}</td>
              <td className={r.state === "synced" ? "is-ok" : r.state === "failed" || r.state === "differs" ? "is-bad" : r.state === "pending" || r.state === "held" ? "is-warn" : undefined}>{r.state}</td>
              <td className="dsc-muted">{r.source ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type CoreEntry = { id: number; occurred_at: number; note: string; tags?: string[] };

function SettingsChangeLog() {
  const [entries, setEntries] = useState<CoreEntry[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    fetch("/journal/core?tag=settings&limit=8")
      .then(async (r) => {
        if (!(r.headers.get("content-type") || "").includes("json")) throw new Error("brain predates the settings journal");
        const d = (await r.json()) as { entries: CoreEntry[] };
        setEntries(d.entries ?? []);
      })
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : String(e)));
  }, []);
  if (err) return <p className="dsc-muted">{err}</p>;
  if (!entries) return <p className="dsc-muted">…</p>;
  if (!entries.length) return <p className="dsc-muted">No settings changes journaled yet.</p>;
  return (
    <ul className="dsc-change-log">
      {entries.map((e) => (
        <li key={e.id}>
          <span className="dsc-muted">{formatStamp(e.occurred_at * 1000)}</span> {e.note}
        </li>
      ))}
    </ul>
  );
}

export function DeveloperCard() {
  const [rawOpen, setRawOpen] = useState(false);
  return (
    <>
      <SettingsCard
        id="developer"
        title="Developer"
        icon="research"
        intro="Transparency switches for this browser, the raw snapshot, and the brain's hub-tunable sync table. Nothing here changes what the hub does."
        actions={
          <Button variant="secondary" onClick={() => setRawOpen(true)}>
            Raw /fleet snapshot
          </Button>
        }
        advanced={
          <>
            <SettingRow
              id="dev-tunables"
              label="Hub tunables sync table"
              description="Every brain-owned hub value: desired · what the hub echoes · sync state · who set it."
              scope="brain"
              forceShow
              control={<TunablesSyncTable />}
              consumers={[{ label: "Climate", href: `#${paths.settings("climate")}` }]}
            />
            <SettingRow
              id="dev-changelog"
              label="Settings change log"
              description="The last eight settings changes the brain journaled."
              scope="brain"
              forceShow
              control={<SettingsChangeLog />}
              consumers={[{ label: "Logs › Settings changes", href: "#/logs?scope=core&id=settings" }]}
            />
          </>
        }
      >
        <PrefToggleRow k="showEntityIds" label="Show entity ids" description="Every triad cell shows the entity id it reads, so a value can be traced to the hub without the inspector." />
        <PrefToggleRow k="provenanceMode" label="Provenance mode" description="Derived numbers show their formula in place, not only in the tooltip." />
        <PrefToggleRow k="showInvented" label="Show INVENTED rows" description="Rows for features that are possible but not built (push to phone, …) stay visible as dashed hints." />
        <PrefToggleRow k="force3d" label="Force the 3D twin" description="Render the twin even when the device gate says still — same as ?force3d=1." />
      </SettingsCard>
      <RawSnapshotDrawer open={rawOpen} onClose={() => setRawOpen(false)} />
    </>
  );
}

/* ---- Setup profile ---------------------------------------------------------------- */

const fmtVal = (v: unknown): string => (v == null ? "unset" : typeof v === "object" ? JSON.stringify(v) : String(v));

function exportablePreferences(): Partial<Preferences> {
  const all = getPreferences();
  const out: Partial<Preferences> = {};
  for (const k of Object.keys(all) as PreferenceKey[]) {
    if (INTERNAL_PREFERENCE_KEYS.has(k)) continue;
    (out as Record<string, unknown>)[k] = all[k];
  }
  return out;
}

function diffPreferences(incoming: Record<string, unknown> | undefined): { key: string; from: unknown; to: unknown }[] {
  if (!incoming) return [];
  const cur = getPreferences() as unknown as Record<string, unknown>;
  const out: { key: string; from: unknown; to: unknown }[] = [];
  for (const [k, v] of Object.entries(incoming)) {
    if (!(k in PREFERENCE_DEFAULTS) || INTERNAL_PREFERENCE_KEYS.has(k as PreferenceKey)) continue;
    if (JSON.stringify(cur[k]) !== JSON.stringify(v)) out.push({ key: k, from: cur[k], to: v });
  }
  return out;
}

export function SetupProfileCard() {
  const save = useSaveState();
  const [pending, setPending] = useState<{ profile: SetupProfile; brain: ProfileImportResult; prefs: { key: string; from: unknown; to: unknown }[] } | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const exportNow = async () => {
    setErr("");
    try {
      const p = await getSetupProfile();
      p.preferences = exportablePreferences() as Record<string, unknown>;
      const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dsc-hub-profile-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      setMsg(`Exported ${Object.keys(p.sections).length} brain sections + ${Object.keys(p.preferences).length} preferences.`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  const pick = async (f: File) => {
    setErr("");
    setMsg("");
    try {
      const profile = JSON.parse(await f.text()) as SetupProfile;
      const brain = await importSetupProfile(profile, false);
      setPending({ profile, brain, prefs: diffPreferences(profile.preferences) });
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  const diff = pending?.brain.diff;
  const sections = diff ? Object.entries(diff).filter(([k, v]) => k !== "total" && typeof v === "object") : [];
  return (
    <>
      <SettingsCard
        id="profile"
        title="Setup profile"
        icon="backup-restore"
        intro="One JSON of the grow configuration — this browser's preferences plus the brain's presets, alert catalogue, automation defaults, journal retention and hub-tunable values — for a second device or for sharing. Never carries network, inventory, credentials, cameras or journals."
        actions={
          <>
            <Button variant="secondary" onClick={() => void exportNow()}>
              Export profile
            </Button>
            <label className="dsc-btn dsc-btn-secondary" style={{ cursor: "pointer" }}>
              Import profile…
              <input
                type="file"
                accept="application/json,.json"
                style={{ display: "none" }}
                aria-label="Import setup profile"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void pick(f);
                  e.target.value = "";
                }}
              />
            </label>
            {msg ? <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>{msg}</span> : null}
            {err ? <span className="dsc-honesty">{err}</span> : null}
          </>
        }
      >
        <SettingRow
          id="profile-scope"
          label="What a profile carries"
          description="Brain: global modifiers, stage presets, root steering, alert catalogue, automation defaults, journal retention, hub tunables the operator set. Browser: every preference except desk memory. Import shows the diff and changes nothing until you confirm."
          scope="brain"
          control={<Stated>diff first, then apply</Stated>}
        />
      </SettingsCard>
      <DecisionLayer
        open={pending != null}
        busy={save.state === "pending"}
        onDismiss={() => setPending(null)}
        onConfirm={() => {
          const p = pending;
          if (!p) return;
          void save.run(async () => {
            const r = p.brain.diff.total ? await importSetupProfile(p.profile, true) : null;
            if (p.prefs.length) setPreferences(Object.fromEntries(p.prefs.map((c) => [c.key, c.to])) as Partial<Preferences>);
            setPending(null);
            setMsg(`Applied ${r ? r.diff.total : 0} brain change(s) and ${p.prefs.length} preference(s).${r?.results && (r.results as Record<string, unknown>).hub_tunables_errors ? " Some hub values were refused — see the row states." : ""}`);
          });
        }}
        title="Apply this setup profile?"
        confirmLabel={`Apply ${(diff?.total ?? 0) + (pending?.prefs.length ?? 0)} change(s)`}
        help={null}
      >
        {pending ? (
          <>
            <p className="dsc-muted">
              From <b>{pending.profile.ap_ssid || "unknown kit"}</b>, brain {pending.profile.brain_version}, exported {formatStamp(pending.profile.exported_at * 1000)}. Network, inventory and credentials are not part of a profile and stay as they are.
            </p>
            <ul className="dsc-change-log">
              {sections.map(([k, v]) => {
                const sec = v as { present: boolean; changes: { key: string; from: unknown; to: unknown }[] };
                return (
                  <li key={k}>
                    <b>{k.replace(/_/g, " ")}</b>: {sec.present ? `${sec.changes.length} change(s)` : "not in file"}
                    {sec.changes.slice(0, 4).map((c) => (
                      <span key={c.key} className="dsc-muted">
                        {" "}
                        · {c.key} {fmtVal(c.from)} → {fmtVal(c.to)}
                      </span>
                    ))}
                    {sec.changes.length > 4 ? <span className="dsc-muted"> · …</span> : null}
                  </li>
                );
              })}
              <li>
                <b>browser preferences</b>: {pending.prefs.length} change(s)
                {pending.prefs.slice(0, 4).map((c) => (
                  <span key={c.key} className="dsc-muted">
                    {" "}
                    · {c.key} {JSON.stringify(c.from)} → {JSON.stringify(c.to)}
                  </span>
                ))}
              </li>
            </ul>
            {save.state === "failed" ? <p className="dsc-honesty">{save.text}</p> : null}
          </>
        ) : null}
      </DecisionLayer>
    </>
  );
}

/* ---- Reset ---------------------------------------------------------------------------- */

export function ResetCard() {
  const [askPrefs, setAskPrefs] = useState(false);
  const [askFactory, setAskFactory] = useState(false);
  const [info, setInfo] = useState<{ confirm_text: string } | null>(null);
  const [typed, setTyped] = useState("");
  const [ack, setAck] = useState(false);
  const [result, setResult] = useState("");
  const save = useSaveState();
  useEffect(() => {
    if (!askFactory) return;
    setTyped("");
    setAck(false);
    getFactoryResetInfo()
      .then(setInfo)
      .catch((e: unknown) => setResult(e instanceof Error ? e.message : String(e)));
  }, [askFactory]);
  const can = ack && info != null && typed.trim() === info.confirm_text;
  return (
    <>
      <SettingsCard id="reset" title="Reset" icon="alert-triangle" intro="Two very different resets. Both ask first; the brain one also backs itself up.">
        <SettingRow
          id="reset-prefs"
          label="Reset this browser's preferences"
          description="Every row under Preferences and the Developer switches go back to default. The brain is untouched."
          scope="browser"
          control={
            <Button variant="secondary" onClick={() => setAskPrefs(true)}>
              Reset preferences
            </Button>
          }
        />
        <SettingRow
          id="reset-factory"
          label="Factory-reset brain data"
          description="Writes a backup zip and a copy of the ops database first, wipes every table, re-creates defaults, and restarts the brain. Zones, roster, journals, presets, Zigbee bindings and settings all go back to first boot. Firmware on the hub is not touched."
          scope="brain"
          state={save.state === "failed" ? "failed" : undefined}
          stateText={save.state === "failed" ? save.text : undefined}
          control={
            <Button variant="danger" onClick={() => setAskFactory(true)}>
              Factory reset…
            </Button>
          }
        />
        {result ? <pre className="dsc-honesty" style={{ whiteSpace: "pre-wrap" }}>{result}</pre> : null}
      </SettingsCard>
      <DecisionLayer open={askPrefs} onDismiss={() => setAskPrefs(false)} onConfirm={() => { resetAllPreferences(); setAskPrefs(false); }} title="Reset this browser's preferences?" confirmLabel="Reset preferences" help={null}>
        <p>Appearance, units, home, charts, alerts delivery and developer switches return to their defaults on this browser only.</p>
      </DecisionLayer>
      <DecisionLayer
        open={askFactory}
        busy={save.state === "pending"}
        onDismiss={() => setAskFactory(false)}
        onConfirm={() => {
          if (!can) return;
          void save.run(async () => {
            const r = await factoryReset(typed.trim());
            setResult(JSON.stringify(r, null, 2));
            setAskFactory(false);
          });
        }}
        title="Factory-reset the brain?"
        confirmLabel={can ? "Erase and restart" : "Type the AP SSID to enable"}
        help={null}
      >
        <p>
          A backup zip is written under the data folder first, then every table is wiped (the copy stays next to the zip) and the brain restarts with defaults. To confirm, tick the box and type the kit&apos;s AP SSID <b>{info?.confirm_text ?? "…"}</b> exactly.
        </p>
        <label style={{ display: "block", margin: "8px 0" }}>
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> I understand every zone, plant, journal and setting on the brain goes back to first boot.
        </label>
        <input type="text" value={typed} aria-label="Type the AP SSID to confirm" placeholder={info?.confirm_text ?? ""} onChange={(e) => setTyped(e.target.value)} style={{ width: "100%" }} />
        {save.state === "failed" ? <p className="dsc-honesty">{save.text}</p> : null}
      </DecisionLayer>
    </>
  );
}
