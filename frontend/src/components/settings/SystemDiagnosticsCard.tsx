import { useEffect, useState } from "react";
import { Button, StatusChip } from "../ui";
import { HelpTip } from "../HelpTip";
import { DecisionLayer } from "../DecisionLayer";
import {
  get_history_stats,
  get_system_logs,
  power_action,
  set_history_retention,
  set_log_verbosity,
  system_log_download_url,
  type FleetHistoryStats,
  type SystemLogResult,
} from "../../lib/fleetApi";

const SOURCES: Array<{ id: string; label: string }> = [
  { id: "brain", label: "DSC-Brain" },
  { id: "system", label: "OS / journal" },
  { id: "docker", label: "Docker" },
];

const POWER: Array<{
  id: "restart-brain" | "restart-network" | "reboot";
  label: string;
  danger: boolean;
  body: string;
}> = [
  {
    id: "restart-brain",
    label: "Restart DSC-Brain",
    danger: false,
    body: "Restarts the brain service. The SPA drops for ~10–20 s and reconnects. Climate/root keep running on the hub meanwhile.",
  },
  {
    id: "restart-network",
    label: "Restart network stack",
    danger: true,
    body: "Restarts the Pi networking / SoftAP policy. You may lose the SPA connection; if you're on the Pi SoftAP it will bounce. Reconnect after ~30 s.",
  },
  {
    id: "reboot",
    label: "Reboot Pi",
    danger: true,
    body: "Full reboot. Everything drops for ~60–90 s. Only the hub's own climate/light ladder keeps the room safe during the reboot.",
  },
];

export function SystemDiagnosticsCard() {
  const [source, setSource] = useState("brain");
  const [lines, setLines] = useState(200);
  const [log, setLog] = useState<SystemLogResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [pendingPower, setPendingPower] = useState<(typeof POWER)[number] | null>(null);
  const [powerBusy, setPowerBusy] = useState(false);
  const [hist, setHist] = useState<FleetHistoryStats | null>(null);
  const [histDays, setHistDays] = useState("");
  const [histBusy, setHistBusy] = useState(false);

  useEffect(() => {
    void get_history_stats()
      .then((s) => {
        setHist(s);
        setHistDays(String(s.retention_days));
      })
      .catch(() => {});
  }, []);

  const load = (src = source, n = lines) => {
    setLoading(true);
    void get_system_logs(src, n)
      .then(setLog)
      .catch((e) => setMsg(String((e as Error).message || e)))
      .finally(() => setLoading(false));
  };
  useEffect(() => load(source, lines), [source, lines]);

  const level = log?.verbosity.level ?? "INFO";

  return (
    <section className="dsc-card">
      <h3 className="dsc-card-title">
        System
        <HelpTip title="Logs, verbosity & power">
          <p>
            Tail the brain / OS / Docker logs. <b>Verbosity</b> sets the brain&apos;s own log level
            (persists across restarts) — bump to <code>DEBUG</code> to troubleshoot, drop back after.
          </p>
          <p>
            Power actions run a configured command on the Pi (or return a manual instruction if it
            can&apos;t). The hub&apos;s climate/light ladder keeps the room safe while the brain is
            down.
          </p>
        </HelpTip>
      </h3>

      <div className="dsc-honesty" style={{ marginBottom: 12 }}>
        <b>Log verbosity</b>
        <div className="dsc-mode-selects" style={{ marginTop: 6 }}>
          <label className="dsc-entity-select">
            <span className="dsc-entity-select-label">Brain log level</span>
            <select
              value={level}
              onChange={async (e) => {
                try {
                  await set_log_verbosity(e.target.value);
                  load();
                } catch (err) {
                  setMsg(String((err as Error).message || err));
                }
              }}
            >
              {(log?.verbosity.options ?? ["DEBUG", "INFO", "WARNING", "ERROR"]).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="dsc-honesty" style={{ marginBottom: 12 }}>
        <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`dsc-chip${source === s.id ? " dsc-chip--ok" : ""}`}
              onClick={() => setSource(s.id)}
            >
              {s.label}
            </button>
          ))}
          <select value={lines} onChange={(e) => setLines(Number(e.target.value))}>
            {[100, 200, 500, 1000].map((n) => (
              <option key={n} value={n}>
                {n} lines
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => load()} disabled={loading}>
            {loading ? "…" : "Refresh"}
          </Button>
          <a className="dsc-chip" href={system_log_download_url(source)} download>
            Download ↓
          </a>
        </div>
        {log && !log.ok ? (
          <p className="dsc-muted" style={{ fontSize: 12 }}>
            {log.hint} <code>{log.cmd}</code>
          </p>
        ) : null}
        <pre
          style={{
            maxHeight: 320,
            overflow: "auto",
            fontSize: 11,
            whiteSpace: "pre-wrap",
            background: "var(--dsc-black)",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {log?.lines.length ? log.lines.join("\n") : loading ? "loading…" : "— no output —"}
        </pre>
      </div>

      <div className="dsc-honesty" style={{ marginBottom: 12 }}>
        <b>Fleet history</b>
        <p className="dsc-muted" style={{ fontSize: 12, margin: "4px 0 8px" }}>
          {hist
            ? `${hist.rows.toLocaleString()} rows${
                hist.oldest_ts && hist.newest_ts
                  ? ` · spans ${Math.max(
                      1,
                      Math.round((hist.newest_ts - hist.oldest_ts) / 86400),
                    )} d`
                  : ""
              }. Rows past the retention window are pruned hourly (and on boot).`
            : "…"}
        </p>
        <div className="dsc-mode-selects">
          <label className="dsc-entity-select">
            <span className="dsc-entity-select-label">Retention (days, 0 = keep forever)</span>
            <input
              type="number"
              min={0}
              max={3650}
              value={histDays}
              onChange={(e) => setHistDays(e.target.value)}
              style={{ width: 90 }}
            />
          </label>
          <Button
            variant="secondary"
            disabled={histBusy || histDays === "" || Number(histDays) === hist?.retention_days}
            onClick={async () => {
              setHistBusy(true);
              try {
                const s = await set_history_retention(Math.max(0, Math.trunc(Number(histDays))));
                setHist(s);
                setHistDays(String(s.retention_days));
                setMsg(
                  s.pruned != null
                    ? `Retention ${s.retention_days} d — pruned ${s.pruned.toLocaleString()} rows.`
                    : `Retention set to ${s.retention_days} d.`,
                );
              } catch (e) {
                setMsg(String((e as Error).message || e));
              } finally {
                setHistBusy(false);
              }
            }}
          >
            {histBusy ? "…" : "Apply & prune"}
          </Button>
        </div>
      </div>

      <div className="dsc-honesty">
        <b>Power</b>
        <div className="dsc-row-actions">
          {POWER.map((p) => (
            <Button
              key={p.id}
              variant={p.danger ? "danger" : "secondary"}
              disabled={powerBusy}
              onClick={() => setPendingPower(p)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {msg ? <p className="dsc-honesty">{msg}</p> : null}

      <DecisionLayer
        open={pendingPower != null}
        onDismiss={() => setPendingPower(null)}
        busy={powerBusy}
        onConfirm={async () => {
          const p = pendingPower;
          if (!p) return;
          setPowerBusy(true);
          try {
            const r = await power_action(p.id);
            setMsg(
              r.status === "manual"
                ? String(r.detail ?? "Run it on the Pi.")
                : `${p.label}: ${String(r.status ?? "")}. ${
                    p.id === "reboot" ? "The SPA will disconnect now." : "Reconnecting shortly…"
                  }`,
            );
          } catch (e) {
            setMsg(String((e as Error).message || e));
          } finally {
            setPowerBusy(false);
            setPendingPower(null);
          }
        }}
        title={pendingPower?.label ?? "Power"}
        confirmLabel={pendingPower?.label ?? "Confirm"}
        help={null}
      >
        <p>{pendingPower?.body}</p>
        {pendingPower?.danger ? (
          <p className="dsc-honesty" style={{ marginTop: 8 }}>
            <StatusChip label="Disruptive" tone="bad" /> Make sure you can get back to the Pi.
          </p>
        ) : null}
      </DecisionLayer>
    </section>
  );
}
