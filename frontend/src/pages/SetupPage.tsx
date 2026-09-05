import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, PageHeader } from "../components/ui";
import {
  getNetworkStatus,
  getSetupHealth,
  getSetupState,
  getUsbFlashJob,
  getUsbManifest,
  getUsbPorts,
  postSetupCommission,
  postSetupDebt,
  postSetupPhase,
  queueUsbFlash,
  type NetworkStatus,
  type SetupHealth,
  type SetupState,
  type UsbManifest,
  type UsbPort,
} from "../lib/setupApi";

const PHASES = ["welcome", "usb_flash", "fleet_join", "zigbee", "go_live"] as const;
type Phase = (typeof PHASES)[number];

function phaseIndex(p: string): number {
  const i = PHASES.indexOf(p as Phase);
  return i >= 0 ? i : 0;
}

export function SetupPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<SetupState | null>(null);
  const [net, setNet] = useState<NetworkStatus | null>(null);
  const [health, setHealth] = useState<SetupHealth | null>(null);
  const [ports, setPorts] = useState<UsbPort[]>([]);
  const [manifest, setManifest] = useState<UsbManifest | null>(null);
  const [role, setRole] = useState("hub");
  const [port, setPort] = useState("");
  const [jobDetail, setJobDetail] = useState("");
  const [jobOk, setJobOk] = useState<boolean | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [st, n, h] = await Promise.all([getSetupState(), getNetworkStatus(), getSetupHealth()]);
    setState(st);
    setNet(n);
    setHealth(h);
  }, []);

  useEffect(() => {
    void refresh().catch((e: unknown) => setErr(String(e)));
  }, [refresh]);

  useEffect(() => {
    if (state?.phase !== "usb_flash") return;
    void (async () => {
      try {
        const [p, m] = await Promise.all([getUsbPorts(), getUsbManifest()]);
        setPorts(p);
        setManifest(m);
        if (p[0] && !port) setPort(p[0].device);
        if (m.kit_roles?.[0] && role === "hub") setRole(m.kit_roles[0]);
      } catch (e: unknown) {
        setErr(String(e));
      }
    })();
  }, [state?.phase, port, role]);

  const phase = (state?.phase as Phase) || "welcome";
  const idx = phaseIndex(phase);

  async function goPhase(next: Phase) {
    setBusy(true);
    setErr("");
    try {
      const st = await postSetupPhase(next);
      setState(st);
    } catch (e: unknown) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onFlash() {
    if (!port) {
      setErr("Select a USB serial port.");
      return;
    }
    setBusy(true);
    setErr("");
    setJobOk(null);
    setJobDetail("Queuing flash…");
    try {
      const job = await queueUsbFlash(role, port);
      const id = String(job.job_id || "");
      for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const cur = await getUsbFlashJob(id);
        const status = String(cur.status || "");
        setJobDetail(String(cur.detail || status));
        if (status === "done") {
          setJobOk(true);
          break;
        }
        if (status === "failed") {
          setJobOk(false);
          break;
        }
      }
    } catch (e: unknown) {
      setJobOk(false);
      setErr(String(e));
      setJobDetail(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onSkipFlash() {
    setBusy(true);
    try {
      const st = await postSetupDebt(`not_flashed:${role}`);
      setState(st);
      setJobDetail(`Skipped ${role} — debt recorded.`);
      setJobOk(null);
    } catch (e: unknown) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onCommission() {
    setBusy(true);
    setErr("");
    try {
      await postSetupCommission(false);
      navigate("/live/overview");
    } catch (e: unknown) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  if (state?.commissioned) {
    return (
      <div className="dsc-page">
        <PageHeader icon="settings" title="Setup" subtitle="Kit already commissioned" />
        <Button primary onClick={() => navigate("/live/overview")}>
          Open Overview
        </Button>
      </div>
    );
  }

  const bootNote = manifest?.roles?.[role]?.boot_mode_note || "";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="settings"
        title="Kit Setup"
        subtitle={`DSC-HUB 8.0 · step ${idx + 1}/${PHASES.length}: ${phase}`}
      />
      {err ? <p className="dsc-honesty" style={{ color: "var(--dsc-danger, #c44)" }}>{err}</p> : null}

      {phase === "welcome" ? (
        <section className="dsc-card">
          <h2>Welcome</h2>
          <p className="dsc-muted">
            Operator path:{" "}
            <strong>{net?.operator_mode === "ethernet" ? "Ethernet / LAN" : "Pi SoftAP"}</strong>
            {net?.eth_carrier ? " (cable up)" : " (no Ethernet — SoftAP for Setup only)"}.
          </p>
          <p className="dsc-honesty">
            Pi SoftAP is for reaching this wizard. Hub SoftAP (`DSC-Setup-*`) and bridge SoftAP
            (`DSC-Anchor`) are separate fleet networks.
          </p>
          <ul className="dsc-muted">
            {(net?.spa_urls || []).map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          <p className="dsc-muted">Ethernet later enables full Update pulls; offline bring-up stays valid.</p>
          <Button primary disabled={busy} onClick={() => void goPhase("usb_flash")}>
            Next: USB flash
          </Button>
        </section>
      ) : null}

      {phase === "usb_flash" ? (
        <section className="dsc-card">
          <h2>USB flash</h2>
          <p className="dsc-honesty">One device at a time. Never green on fail.</p>
          <label>
            Role{" "}
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {(manifest?.kit_roles || ["hub"]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "block", marginTop: 8 }}>
            Port{" "}
            <select value={port} onChange={(e) => setPort(e.target.value)}>
              <option value="">— select —</option>
              {ports.map((p) => (
                <option key={p.device} value={p.device}>
                  {p.by_id || p.device} {p.chip_hint ? `(${p.chip_hint})` : ""}
                </option>
              ))}
            </select>
          </label>
          {bootNote ? <p className="dsc-honesty">{bootNote}</p> : null}
          {jobDetail ? (
            <pre className="dsc-muted" style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
              {jobOk === true ? "OK — " : jobOk === false ? "FAILED — " : ""}
              {jobDetail}
            </pre>
          ) : null}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <Button primary disabled={busy} onClick={() => void onFlash()}>
              Flash
            </Button>
            <Button disabled={busy} onClick={() => void onSkipFlash()}>
              Skip (record debt)
            </Button>
            <Button disabled={busy} onClick={() => void goPhase("fleet_join")}>
              Next: Fleet join
            </Button>
          </div>
        </section>
      ) : null}

      {phase === "fleet_join" ? (
        <section className="dsc-card">
          <h2>Fleet Wi‑Fi / SoftAP join</h2>
          <ol className="dsc-muted">
            <li>Power hub — join its SoftAP portal and complete kit Wi‑Fi / membership.</li>
            <li>Bridge (ETH01): Ethernet to LAN; SoftAP `DSC-Anchor` is separate from this Pi AP.</li>
            <li>
              Sonoffs need home LAN (via bridge/Ethernet). Local-only Pi SoftAP without Ethernet
              cannot reach Sonoffs on a separate LAN.
            </li>
          </ol>
          <Button primary disabled={busy} onClick={() => void goPhase("zigbee")}>
            Next: Zigbee
          </Button>
        </section>
      ) : null}

      {phase === "zigbee" ? (
        <section className="dsc-card">
          <h2>Zigbee</h2>
          <p className="dsc-muted">
            Radio: {health?.zigbee_up ? "up" : "down / not detected"}. Use Settings → Device for
            permit-join and role/zone/task binding (capability_class + problem_when).
          </p>
          {!health?.zigbee_up ? (
            <p className="dsc-honesty">Plug SkyConnect before expecting devices — no fake devices.</p>
          ) : null}
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => navigate("/settings/device")}>Open Device settings</Button>
            <Button primary disabled={busy} onClick={() => void goPhase("go_live")}>
              Next: Go live
            </Button>
          </div>
        </section>
      ) : null}

      {phase === "go_live" ? (
        <section className="dsc-card">
          <h2>Go live</h2>
          <ul className="dsc-muted">
            <li>Brain: {health?.brain_ok === false ? "fail" : "ok"}</li>
            <li>Mosquitto: {health?.mosquitto_ok === false ? "fail" : "ok"}</li>
            <li>Z2M/radio: {health?.z2m_ok || health?.zigbee_up ? "ok" : "check"}</li>
            <li>Hub online: {health?.fleet_online ? "yes" : "no / not required if skipped"}</li>
            <li>Catalog: thin local (never blocks)</li>
          </ul>
          {(state?.debt?.length ?? 0) > 0 ? (
            <p className="dsc-honesty">Debt: {state?.debt.join(", ")}</p>
          ) : null}
          <Button primary disabled={busy} onClick={() => void onCommission()}>
            Commission kit
          </Button>
        </section>
      ) : null}
    </div>
  );
}
