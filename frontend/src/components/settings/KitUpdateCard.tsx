import { useEffect, useState } from "react";
import { Button, StatusChip } from "../ui";
import { HelpTip } from "../HelpTip";
import { DecisionLayer } from "../DecisionLayer";
import { SettingsTable, SettingsRow } from "./SettingsTable";
import {
  check_kit_updates,
  get_kit_update,
  start_esphome_rollout,
  start_kit_update,
  type KitUpdateStatus,
} from "../../lib/fleetApi";

function fmtWhen(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Version check for the brain code and the ESP fleet firmware. Read side hits
 * the GitHub releases API (Ethernet-gated, offline-safe); the brain self-update
 * runs the operator-configured `brain_update_cmd`, and the fleet reflash reuses
 * the existing ESPHome OTA rollout (serialised, hub last).
 */
export function KitUpdateCard() {
  const [st, setSt] = useState<KitUpdateStatus | null>(null);
  const [busy, setBusy] = useState<"check" | "brain" | "fleet" | null>(null);
  const [msg, setMsg] = useState("");
  const [pendingBrain, setPendingBrain] = useState(false);
  const [pendingFleet, setPendingFleet] = useState(false);

  const load = () => {
    void get_kit_update().then(setSt).catch(() => undefined);
  };
  useEffect(load, []);

  const check = async () => {
    setBusy("check");
    setMsg("");
    try {
      setSt(await check_kit_updates());
    } catch (e) {
      setMsg(String((e as Error).message || e));
    } finally {
      setBusy(null);
    }
  };

  const brainLatest = st?.brain.ok ? st.brain.latest_tag : null;
  const brainBadge = !st
    ? null
    : !st.brain.ok
      ? { label: st.eth_up ? "CHECK FAILED" : "OFFLINE", tone: "muted" as const }
      : st.brain.update_available
        ? { label: "UPDATE AVAILABLE", tone: "warn" as const }
        : { label: "UP TO DATE", tone: "ok" as const };

  return (
    <section className="dsc-card">
      <h3 className="dsc-card-title">
        Updates
        <HelpTip title="DSC-Brain & fleet updates">
          <p>
            <b>Check for updates</b> asks GitHub for the latest DSC-HUB release and compares it to
            the running brain and each ESP device&apos;s firmware. Needs Ethernet — offline kits keep
            the baked version.
          </p>
          <p>
            <b>Update DSC-Brain</b> runs the <code>brain_update_cmd</code> setting on the Pi. If it
            isn&apos;t set, deploy from your workstation instead. <b>Reflash fleet</b> queues one OTA
            per behind device through the existing build worker, hub last.
          </p>
        </HelpTip>
      </h3>

      {!st ? (
        <p className="dsc-muted">Update status unavailable — brain offline.</p>
      ) : (
        <>
          <div className="dsc-honesty" style={{ marginBottom: 12 }}>
            <b>DSC-Brain</b>
            <p className="dsc-muted" style={{ margin: "4px 0" }}>
              Running <b>{st.brain.version}</b>
              {" · "}Latest{" "}
              <b>
                {brainLatest ??
                  (st.brain.ok ? st.brain.version : st.eth_up ? "unknown" : "offline")}
              </b>
              {brainBadge ? (
                <>
                  {" "}
                  <StatusChip label={brainBadge.label} tone={brainBadge.tone} />
                </>
              ) : null}
              {st.brain.latest_url && brainLatest ? (
                <>
                  {" "}
                  <a href={st.brain.latest_url} target="_blank" rel="noreferrer">
                    release notes ↗
                  </a>
                  {fmtWhen(st.brain.published_at) ? ` (${fmtWhen(st.brain.published_at)})` : ""}
                </>
              ) : null}
            </p>
            {st.brain.error && !st.brain.ok ? (
              <p className="dsc-muted" style={{ margin: "4px 0", fontSize: "var(--dsc-fs-sm)" }}>
                {st.brain.error}
              </p>
            ) : null}
            <div className="dsc-row-actions">
              <Button onClick={() => void check()} disabled={busy != null}>
                {busy === "check" ? "Checking…" : "Check for updates"}
              </Button>
              <Button
                primary
                disabled={busy != null || !st.brain.update_available || !st.eth_up}
                onClick={() => setPendingBrain(true)}
              >
                Update DSC-Brain
              </Button>
            </div>
            {st.update_job ? (
              <pre style={{ maxHeight: 160, overflow: "auto", fontSize: "var(--dsc-fs-xs)", whiteSpace: "pre-wrap" }}>
                [{st.update_job.status}]{"\n"}
                {st.update_job.detail}
              </pre>
            ) : null}
          </div>

          <div className="dsc-honesty">
            <b>Fleet firmware</b>
            <p className="dsc-muted" style={{ margin: "4px 0" }}>
              Expected <b>{st.fleet.expected_firmware || "—"}</b>
              {st.fleet.behind_count > 0 ? (
                <>
                  {" "}
                  <StatusChip label={`${st.fleet.behind_count} BEHIND`} tone="warn" />
                </>
              ) : (
                <>
                  {" "}
                  <StatusChip label="ALL CURRENT" tone="ok" />
                </>
              )}
            </p>
            <SettingsTable
              columns={[
                { key: "seat", label: "Device" },
                { key: "run", label: "Running" },
                { key: "status", label: "Status", tight: true },
              ]}
            >
              {st.fleet.devices.map((d) => {
                const tone = !d.in_service
                  ? ("muted" as const)
                  : d.behind
                    ? ("warn" as const)
                    : d.running
                      ? ("ok" as const)
                      : ("muted" as const);
                return (
                  <SettingsRow key={d.seat_id} tone={!d.in_service ? "muted" : undefined}>
                    <td>{d.seat_id}</td>
                    <td>{d.running ?? "—"}</td>
                    <td className={`is-tight is-${tone}`}>
                      {!d.in_service
                        ? "out of service"
                        : d.behind
                          ? "behind"
                          : d.running
                            ? "current"
                            : "unknown"}
                    </td>
                  </SettingsRow>
                );
              })}
            </SettingsTable>
            {st.fleet.behind_count > 0 ? (
              <div className="dsc-row-actions">
                <Button onClick={() => setPendingFleet(true)} disabled={busy != null}>
                  Reflash fleet ({st.fleet.behind_count})
                </Button>
              </div>
            ) : null}
          </div>

          {msg ? <p className="dsc-honesty">{msg}</p> : null}
        </>
      )}

      <DecisionLayer
        open={pendingBrain}
        onDismiss={() => setPendingBrain(false)}
        busy={busy === "brain"}
        onConfirm={async () => {
          setBusy("brain");
          try {
            const r = await start_kit_update();
            setMsg(
              r.status === "manual"
                ? String(r.detail ?? "Run the deploy from your workstation.")
                : `Update started (${String(r.status ?? "")}). Watch the log.`,
            );
            load();
          } catch (e) {
            setMsg(String((e as Error).message || e));
          } finally {
            setBusy(null);
            setPendingBrain(false);
          }
        }}
        title="Update DSC-Brain"
        confirmLabel="Update"
        help={null}
      >
        <p>
          Pulls DSC-Brain <b>{brainLatest ?? "latest"}</b> via the <code>brain_update_cmd</code>{" "}
          setting on the Pi and restarts the service. If that setting isn&apos;t configured you&apos;ll
          get the manual deploy instruction instead — nothing is changed.
        </p>
      </DecisionLayer>

      <DecisionLayer
        open={pendingFleet}
        onDismiss={() => setPendingFleet(false)}
        busy={busy === "fleet"}
        onConfirm={async () => {
          setBusy("fleet");
          try {
            const r = await start_esphome_rollout();
            const q = Array.isArray(r.queued) ? (r.queued as string[]).length : 0;
            setMsg(`Queued ${q} OTA job(s). They run one at a time; the hub is flashed last.`);
            load();
          } catch (e) {
            setMsg(String((e as Error).message || e));
          } finally {
            setBusy(null);
            setPendingFleet(false);
          }
        }}
        title="Reflash the fleet"
        confirmLabel="Queue fleet OTA"
        help={null}
      >
        <p>
          Enqueues one OTA per behind, in-service device ({st?.fleet.behind_count ?? 0}). Jobs run
          serialised through the existing build worker, hub last so a mid-rollout failure doesn&apos;t
          drop everything at once.
        </p>
      </DecisionLayer>
    </section>
  );
}
