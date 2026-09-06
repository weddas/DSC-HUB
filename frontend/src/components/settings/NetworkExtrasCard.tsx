import { useEffect, useState } from "react";
import { Button, StatusChip } from "../ui";
import { HelpTip } from "../HelpTip";
import { DecisionLayer } from "../DecisionLayer";
import {
  check_internet,
  get_network_status,
  set_ethernet,
  type EthConfigBody,
  type InternetStatus,
} from "../../lib/fleetApi";

type EthState = {
  iface: string;
  mode: "auto" | "static";
  static_ip: string;
  gateway: string;
  dns: string;
  carrier: boolean;
  current_ip: string | null;
};

/**
 * Internet reachability + LAN (Ethernet) config. The ethernet apply only renders
 * a dhcpcd drop-in and persists the setting — it never restarts networking, so a
 * bad static config can't lock out a headless Pi from here.
 */
export function NetworkExtrasCard() {
  const [inet, setInet] = useState<InternetStatus | null>(null);
  const [eth, setEth] = useState<EthState | null>(null);
  const [draft, setDraft] = useState<EthConfigBody>({ mode: "auto" });
  const [checking, setChecking] = useState(false);
  const [pendingEth, setPendingEth] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    void get_network_status()
      .then((s) => {
        setInet((s.internet as InternetStatus) ?? null);
        const e = s.eth as EthState | undefined;
        if (e) {
          setEth(e);
          setDraft({ mode: e.mode, static_ip: e.static_ip, gateway: e.gateway, dns: e.dns });
        }
      })
      .catch(() => undefined);
  };
  useEffect(load, []);

  const doCheck = async () => {
    setChecking(true);
    try {
      setInet(await check_internet());
    } catch (e) {
      setMsg(String((e as Error).message || e));
    } finally {
      setChecking(false);
    }
  };

  const online = Boolean(inet?.reachable && inet?.dns_ok);

  return (
    <section className="dsc-card">
      <h3 className="dsc-card-title">
        Connectivity
        <HelpTip title="Internet & LAN">
          <p>
            <b>Internet</b> is a TCP reach + DNS check against{" "}
            <code>{inet?.host ?? "1.1.1.1:443"}</code> — it gates GitHub / PyPI update checks.
          </p>
          <p>
            <b>Ethernet</b> apply only writes a dhcpcd drop-in and saves the setting; it does not
            restart networking. Apply it on the Pi (<code>sudo systemctl restart dhcpcd</code>) and
            confirm you can still reach the Pi before disconnecting.
          </p>
        </HelpTip>
      </h3>

      <div className="dsc-honesty" style={{ marginBottom: 12 }}>
        <b>Internet</b>{" "}
        <StatusChip label={online ? "ONLINE" : "OFFLINE"} tone={online ? "ok" : "warn"} />
        {inet && !online ? (
          <span className="dsc-muted" style={{ fontSize: 12, marginLeft: 8 }}>
            {inet.reachable ? "TCP ok, DNS failing" : inet.dns_ok ? "DNS ok, no route" : "no route, no DNS"}
            {inet.error ? ` — ${inet.error}` : ""}
          </span>
        ) : null}
        <div className="dsc-row-actions">
          <Button onClick={() => void doCheck()} disabled={checking}>
            {checking ? "Checking…" : "Check now"}
          </Button>
        </div>
      </div>

      <div className="dsc-honesty">
        <b>Ethernet (LAN)</b>{" "}
        <StatusChip
          label={eth?.carrier ? "LINK UP" : "NO LINK"}
          tone={eth?.carrier ? "ok" : "muted"}
        />
        {eth?.current_ip ? (
          <span className="dsc-muted" style={{ fontSize: 12, marginLeft: 8 }}>
            {eth.current_ip}
          </span>
        ) : null}
        <div className="dsc-mode-selects" style={{ marginTop: 8 }}>
          <label className="dsc-entity-select">
            <span className="dsc-entity-select-label">Addressing</span>
            <select
              value={draft.mode}
              onChange={(e) => setDraft((d) => ({ ...d, mode: e.target.value as "auto" | "static" }))}
            >
              <option value="auto">Auto (DHCP)</option>
              <option value="static">Static</option>
            </select>
          </label>
          {draft.mode === "static" ? (
            <>
              <label className="dsc-entity-select">
                <span className="dsc-entity-select-label">IP / CIDR</span>
                <input
                  type="text"
                  placeholder="192.168.1.50/24"
                  value={draft.static_ip ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, static_ip: e.target.value }))}
                />
              </label>
              <label className="dsc-entity-select">
                <span className="dsc-entity-select-label">Gateway</span>
                <input
                  type="text"
                  placeholder="192.168.1.1"
                  value={draft.gateway ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, gateway: e.target.value }))}
                />
              </label>
              <label className="dsc-entity-select">
                <span className="dsc-entity-select-label">DNS</span>
                <input
                  type="text"
                  placeholder="1.1.1.1 9.9.9.9"
                  value={draft.dns ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, dns: e.target.value }))}
                />
              </label>
            </>
          ) : null}
        </div>
        <div className="dsc-row-actions">
          <Button
            variant="danger"
            disabled={draft.mode === "static" && !String(draft.static_ip ?? "").trim()}
            onClick={() => setPendingEth(true)}
          >
            Save ethernet config
          </Button>
        </div>
      </div>

      {msg ? <pre className="dsc-honesty">{msg}</pre> : null}

      <DecisionLayer
        open={pendingEth}
        onDismiss={() => setPendingEth(false)}
        onConfirm={async () => {
          setPendingEth(false);
          try {
            const r = await set_ethernet(draft);
            setMsg(
              `Saved. ${String((r as { apply?: string }).apply ?? "")}\nRendered: ${String(
                (r as { rendered?: string }).rendered ?? "",
              )}`,
            );
            load();
          } catch (e) {
            setMsg(String((e as Error).message || e));
          }
        }}
        title={draft.mode === "static" ? "Save static ethernet config" : "Switch ethernet to DHCP"}
        confirmLabel="Save config"
        help={null}
      >
        <p>
          Writes a dhcpcd drop-in and saves the setting. <b>Networking is not restarted.</b> Apply it
          on the Pi with <code>sudo systemctl restart dhcpcd</code> (or a reboot), and confirm the Pi
          is still reachable before disconnecting.
        </p>
      </DecisionLayer>
    </section>
  );
}
