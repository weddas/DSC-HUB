import { StatusChip } from "./ui";
import { HelpTip } from "./HelpTip";
import { useHubVitals, useFleet } from "../hooks/useFleet";
import { useEntityBus } from "../hooks/useEntityBus";
import { fmtUptimeSeconds } from "../lib/formatDuration";

function asFiniteNumber(raw: unknown): number | null {
  if (raw == null || raw === "—") return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Seconds → human duration; 0 is "0S" (fresh), not a blank dash. */
function durationLabel(seconds: number): string {
  if (seconds <= 0) return "0S";
  return fmtUptimeSeconds(seconds);
}

/** D-05: hub_link + ages/bounces/rf — fleet-native link; HA-only extras from entity bus. */
export function HubLinkLine() {
  const { online, uptime, heartbeat } = useHubVitals();
  const fleet = useFleet();
  const { state, available, entity } = useEntityBus();

  const uptimeSec = asFiniteNumber(uptime);
  const downAge = available("sensor.dsc_hub_api_down_age")
    ? asFiniteNumber(state("sensor.dsc_hub_api_down_age", "—"))
    : null;
  // Never show "Up …" while offline; never show residual "Down …" while online.
  const age = !online
    ? downAge != null && downAge > 0
      ? `Down ${durationLabel(downAge)}`
      : "Down —"
    : uptimeSec != null
      ? `Up ${durationLabel(uptimeSec)}`
      : "—";

  const bounce = available("sensor.dsc_hub_link_recovery_bounces")
    ? state("sensor.dsc_hub_link_recovery_bounces", "—")
    : "—";
  const rf = available("sensor.dsc_hub_rf_status") ? state("sensor.dsc_hub_rf_status", "—") : "—";

  const handshakeSec = available("sensor.dsc_hub_ha_handshake_age")
    ? asFiniteNumber(state("sensor.dsc_hub_ha_handshake_age", "—"))
    : null;
  const beatCount = asFiniteNumber(heartbeat);
  // Distinct labels: handshake age is time; heartbeat is a tick count.
  const beat =
    handshakeSec != null
      ? `HS ${durationLabel(handshakeSec)}`
      : beatCount != null
        ? `HB #${Math.trunc(beatCount)}`
        : "—";

  const overrideActive =
    available("binary_sensor.dsc_brain_hub_override_active") &&
    state("binary_sensor.dsc_brain_hub_override_active") === "on";
  const overrideAttrs = entity("binary_sensor.dsc_brain_hub_override_active")?.attributes || {};
  const pendingReassert = Boolean(overrideAttrs.pending_reassert);

  return (
    <div className="dsc-chip-row">
      <StatusChip
        icon={online ? "ok" : "alert"}
        label={online ? "HUB LINK" : "HUB LINK DOWN"}
        tone={online ? "ok" : "bad"}
      />
      {overrideActive ? (
        <StatusChip icon="alert" label="RECONNECT OVERRIDE" tone="warn" />
      ) : null}
      {pendingReassert && !overrideActive ? (
        <StatusChip icon="alert" label="PENDING REASSERT" tone="warn" />
      ) : null}
      <StatusChip label={age} tone="muted" />
      <StatusChip label={`Bounces ${bounce}`} tone="muted" />
      <StatusChip label={`RF ${rf}`} tone="muted" />
      <StatusChip label={beat} tone="muted" />
      {fleet.surface ? <StatusChip label={fleet.surface} tone="muted" /> : null}
      <HelpTip title="Hub link chips">
        <p>
          <b>Up</b> is hub uptime while the link is healthy. <b>Down</b> appears when the link is offline (or API-down age
          is positive). Never trust an Up chip next to HUB LINK DOWN.
        </p>
        <p>
          <b>HS</b> is handshake age in time. <b>HB #</b> is the heartbeat tick count — not hours. Example: Up 2H 14M with
          HB #1847 means healthy link and a live counter, not 1847 hours.
        </p>
        <p>
          <b>RECONNECT OVERRIDE</b> means the brain recorded a temporary override after hub reconnect with manual
          takeover. It clears after 15 minutes or when master takeover is turned off — then the brain re-asserts Want.
        </p>
        <p>
          <b>PENDING REASSERT</b> means the reconnect TTL already fired while takeover is still on — override binary is
          off, but Want will not re-assert until takeover clears.
        </p>
        <p>Grey RF is not always a fault — inventory out-of-service stays quiet on purpose.</p>
      </HelpTip>
    </div>
  );
}
