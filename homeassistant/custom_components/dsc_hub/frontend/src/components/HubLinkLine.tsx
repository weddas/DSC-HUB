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
  const { state, available } = useEntityBus();

  const uptimeSec = asFiniteNumber(uptime);
  const downAge = available("sensor.dsc_hub_api_down_age")
    ? asFiniteNumber(state("sensor.dsc_hub_api_down_age", "—"))
    : null;
  // Prefer honest labels: "Up …" from uptime; only show "Down …" when API-down age is positive.
  const age =
    downAge != null && downAge > 0
      ? `Down ${durationLabel(downAge)}`
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
  // Handshake age is seconds; hub_heartbeat is a tick counter — never format the counter as duration.
  const beat =
    handshakeSec != null
      ? durationLabel(handshakeSec)
      : beatCount != null
        ? String(Math.trunc(beatCount))
        : "—";

  return (
    <div className="dsc-chip-row">
      <StatusChip
        icon={online ? "ok" : "alert"}
        label={online ? "HUB LINK" : "HUB LINK DOWN"}
        tone={online ? "ok" : "bad"}
      />
      <StatusChip label={age} tone="muted" />
      <StatusChip label={`Bounces ${bounce}`} tone="muted" />
      <StatusChip label={`RF ${rf}`} tone="muted" />
      <StatusChip label={`Beat ${beat}`} tone="muted" />
      {fleet.surface ? <StatusChip label={fleet.surface} tone="muted" /> : null}
      <HelpTip title="Hub link chips">
        <p>
          <b>Up</b> is hub uptime while the link is healthy. <b>Down</b> appears only when API-down age is positive.
          <b> Beat</b> is handshake age in time when HA exposes it; otherwise it is the hub heartbeat <em>count</em>, not hours.
        </p>
        <p>Grey RF is not always a fault — inventory out-of-service stays quiet on purpose.</p>
      </HelpTip>
    </div>
  );
}
