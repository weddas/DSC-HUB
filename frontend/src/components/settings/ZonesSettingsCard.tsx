import { useState } from "react";
import { DecisionLayer } from "../DecisionLayer";
import { Panel, PhaseChip, type PhaseKey } from "../Panel";
import { Button, StatusTag } from "../ui";
import { useZoneMeta } from "../../hooks/useZoneMeta";
import { useZones, type ZoneModel } from "../../hooks/useZones";
import { railForStage } from "../../lib/tentWant";
import { patchZone, type ZoneRecord, type ZoneRole } from "../../lib/zonesApi";

type FlipRole = Exclude<ZoneRole, "room">;

const ROLE_ORDER: FlipRole[] = ["grow", "dry", "cure", "empty"];
const ROLE_PHASE: Record<FlipRole, PhaseKey | null> = { grow: null, dry: "dry", cure: "cure", empty: null };
const ROLE_TONE: Record<FlipRole, "ok" | "warn" | "muted" | "teal"> = { grow: "ok", dry: "warn", cure: "muted", empty: "muted" };

function fmtSince(ts: number | null): string {
  if (!ts) return "";
  const days = Math.floor((Date.now() / 1000 - ts) / 86400);
  return days <= 0 ? "since today" : `day ${days + 1}`;
}

function bandsForRole(role: FlipRole, live: ZoneModel | undefined): { temp: string; rh: string; vpd: string; light: string } {
  if (role === "dry") {
    const rail = railForStage("Dry Mode");
    return rail
      ? { temp: `${rail.temp - 1.5}–${rail.temp + 1.5} °C`, rh: `${rail.rhMin}–${rail.rhMax} % · master`, vpd: `${rail.vpdMin.toFixed(1)}–${rail.vpdMax.toFixed(1)} kPa`, light: "dark · not enforced" }
      : { temp: "—", rh: "—", vpd: "—", light: "dark · not enforced" };
  }
  if (role === "cure" || role === "empty") {
    return { temp: "no band", rh: "no band", vpd: "no band", light: "as scheduled" };
  }
  return {
    temp: live?.temp.band ? `${live.temp.band.min.toFixed(1)}–${live.temp.band.max.toFixed(1)} °C` : "plant / stage rail",
    rh: live?.rh.band ? `${Math.round(live.rh.band.min)}–${Math.round(live.rh.band.max)} %` : "plant / stage rail",
    vpd: live?.vpd.band ? `${live.vpd.band.min.toFixed(1)}–${live.vpd.band.max.toFixed(1)} kPa` : "plant / stage rail",
    light: live?.lightHours != null ? `${live.lightHours} h rail` : "as scheduled",
  };
}

/**
 * Settings › Zones (frames 1k + 3b): every room and tent as a zone, rename in place, and a
 * role switcher whose confirm shows the before/after bands and exactly what the flip does
 * and does not do (the brain's own effects list — nothing is claimed that is not enforced).
 */
export function ZonesSettingsCard() {
  const meta = useZoneMeta();
  const live = useZones();
  const liveById: Record<string, ZoneModel> = { "4x8": live.main, "2x4": live.clone, grow_room: live.room };
  const [pending, setPending] = useState<{ zone: ZoneRecord; role: FlipRole } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const rooms = meta.zones.filter((z) => z.kind === "room");
  const tents = meta.zones.filter((z) => z.kind !== "room");

  const saveName = async (zone: ZoneRecord) => {
    const name = (drafts[zone.zone_id] ?? zone.name).trim();
    if (!name || name === zone.name) return;
    setBusyId(zone.zone_id);
    setErr(null);
    try {
      await patchZone(zone.zone_id, { name });
      await meta.refresh();
      setDrafts((d) => {
        const next = { ...d };
        delete next[zone.zone_id];
        return next;
      });
      setMsg(`${zone.name} renamed to ${name}.`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "rename failed");
    } finally {
      setBusyId(null);
    }
  };

  const confirmFlip = async () => {
    if (!pending) return;
    const { zone, role } = pending;
    setBusyId(zone.zone_id);
    setErr(null);
    try {
      const res = await patchZone(zone.zone_id, { role });
      await meta.refresh();
      setPending(null);
      setMsg(
        res.journal_entry
          ? `${zone.name} is now ${res.zone.role_label}. Journal entry written on the ${zone.size_label || zone.name} space.`
          : `${zone.name} was already ${res.zone.role_label}.`,
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "role flip failed");
    } finally {
      setBusyId(null);
    }
  };

  const before = pending ? bandsForRole(pending.zone.role === "room" ? "grow" : pending.zone.role, liveById[pending.zone.zone_id]) : null;
  const after = pending ? bandsForRole(pending.role, liveById[pending.zone.zone_id]) : null;

  return (
    <Panel legendIcon="site" legend="ZONES · SITE › ROOM › ZONE › PLANT" className="dsc-zones">
      <p className="dsc-panel-foot" style={{ marginTop: 0 }}>
        A zone is a tent, a room or a container. Its role flips in place — the same tent goes Grow → Dry → Cure → Empty
        without being re-created. Density on Overview comes from how many zones exist, never from a mode.
      </p>
      {meta.error ? <p className="dsc-honesty">Zones unavailable: {meta.error}</p> : null}
      {msg ? <p className="dsc-zones-msg">{msg}</p> : null}
      {err ? <p className="dsc-honesty">{err}</p> : null}

      {rooms.map((room) => (
        <div key={room.zone_id} className="dsc-zone-tree">
          <div className="dsc-zone-row dsc-zone-row--room">
            <div className="dsc-zone-ident">
              <span className="dsc-legend">Room · lung</span>
              <input
                className="dsc-zone-name"
                value={drafts[room.zone_id] ?? room.name}
                onChange={(e) => setDrafts((d) => ({ ...d, [room.zone_id]: e.target.value }))}
                onBlur={() => void saveName(room)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                aria-label={`Rename ${room.name}`}
                maxLength={40}
              />
              <span className="dsc-zone-sub">{(room.children ?? []).length} zones inside · intake and exhaust belong here</span>
            </div>
            <StatusTag label="ROOM" tone="teal" />
          </div>

          {tents
            .filter((t) => t.parent === room.zone_id)
            .map((zone) => {
              const lv = liveById[zone.zone_id];
              const role = (zone.role === "room" ? "grow" : zone.role) as FlipRole;
              const phase = ROLE_PHASE[role] ?? lv?.phase ?? null;
              return (
                <div key={zone.zone_id} className="dsc-zone-row">
                  <div className="dsc-zone-ident">
                    <span className="dsc-legend">
                      {zone.kind} · {zone.size_label || zone.zone_id}
                      {zone.size_m2 ? ` · ${zone.size_m2} m²` : ""}
                    </span>
                    <input
                      className="dsc-zone-name"
                      value={drafts[zone.zone_id] ?? zone.name}
                      onChange={(e) => setDrafts((d) => ({ ...d, [zone.zone_id]: e.target.value }))}
                      onBlur={() => void saveName(zone)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                      aria-label={`Rename ${zone.name}`}
                      maxLength={40}
                      disabled={busyId === zone.zone_id}
                    />
                    <span className="dsc-zone-sub">
                      {phase ? <PhaseChip phase={phase} /> : null}{" "}
                      {role === "grow"
                        ? lv?.stage
                          ? `${lv.stage}${lv.day != null ? ` · day ${lv.day}` : ""}${lv.cultivar ? ` · ${lv.cultivar}` : ""}`
                          : "no stage or plant yet"
                        : `${zone.role_label} ${fmtSince(zone.role_since)}`}
                      {zone.role_history.length ? (
                        <span className="dsc-zone-history">
                          {" · "}
                          {zone.role_history
                            .slice(-3)
                            .map((h) => `${h.from} → ${h.to}`)
                            .join(", ")}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <div className="dsc-zone-roles" role="group" aria-label={`${zone.name} role`}>
                    {ROLE_ORDER.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`dsc-seg dsc-seg--${ROLE_TONE[r]}${role === r ? " is-active" : ""}`}
                        aria-pressed={role === r}
                        disabled={busyId === zone.zone_id}
                        onClick={() => {
                          if (r !== role) setPending({ zone, role: r });
                        }}
                      >
                        {r.toUpperCase()}
                        {role === r ? " ●" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ))}

      <p className="dsc-panel-foot">
        Roles are recorded on the brain and written to the zone's journal. The lamp, fans, appliances and rules are{" "}
        <b>not</b> changed by a flip yet — that lands with the control pass, and the SPA says so on the zone card.
      </p>

      <DecisionLayer
        open={pending != null}
        onDismiss={() => setPending(null)}
        onConfirm={confirmFlip}
        title={pending ? `${pending.zone.name}: ${pending.zone.role_label} → ${pending.role[0].toUpperCase()}${pending.role.slice(1)}` : "Flip role"}
        confirmLabel={pending ? `Flip to ${pending.role}` : "Flip"}
        busy={busyId != null}
        help={null}
      >
        {pending && before && after ? (
          <div className="dsc-flip">
            <div className="dsc-flip-cols">
              <div className="dsc-flip-col">
                <span className="dsc-legend">Before · {pending.zone.role_label}</span>
                <dl>
                  <dt>Temp</dt>
                  <dd>{before.temp}</dd>
                  <dt>RH</dt>
                  <dd>{before.rh}</dd>
                  <dt>VPD</dt>
                  <dd>{before.vpd}</dd>
                  <dt>Light</dt>
                  <dd>{before.light}</dd>
                </dl>
              </div>
              <span className="dsc-flip-arrow" aria-hidden="true">
                →
              </span>
              <div className="dsc-flip-col is-after">
                <span className="dsc-legend">After · {pending.role}</span>
                <dl>
                  <dt>Temp</dt>
                  <dd>{after.temp}</dd>
                  <dt>RH</dt>
                  <dd>{after.rh}</dd>
                  <dt>VPD</dt>
                  <dd>{after.vpd}</dd>
                  <dt>Light</dt>
                  <dd>{after.light}</dd>
                </dl>
              </div>
            </div>
            <div className="dsc-flip-effects">
              <div>
                <span className="dsc-legend">What the flip does</span>
                <ul>{(meta.effects?.does.all ?? []).map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div>
                <span className="dsc-legend">What it won't do</span>
                <ul>{(meta.effects?.does_not.all ?? []).map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
          </div>
        ) : null}
      </DecisionLayer>
      <div className="dsc-row-actions">
        <Button icon="refresh" onClick={() => void meta.refresh()} busy={meta.loading}>
          Refresh zones
        </Button>
      </div>
    </Panel>
  );
}
