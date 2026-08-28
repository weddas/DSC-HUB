import { StatusChip } from "./ui";
import { HelpTip } from "./HelpTip";
import { useHubVitals, useFleet } from "../hooks/useFleet";
import { useEntityBus } from "../hooks/useEntityBus";
import { fmtUptimeSeconds } from "../lib/formatDuration";

function ageLabel(raw: unknown): string {
  if (raw == null || raw === "—") return "—";
  const n = typeof raw === "number" ? raw : Number(raw);
  if (Number.isFinite(n)) return fmtUptimeSeconds(n);
  return String(raw);
}

/** D-05: hub_link + ages/bounces/rf — fleet-native link; HA-only extras from entity bus. */
export function HubLinkLine() {
  const { online, uptime, heartbeat } = useHubVitals();
  const fleet = useFleet();
  const { state, available } = useEntityBus();

  const age = available("sensor.dsc_hub_api_down_age")
    ? ageLabel(state("sensor.dsc_hub_api_down_age", "—"))
    : ageLabel(uptime);
  const bounce = available("sensor.dsc_hub_link_recovery_bounces")
    ? state("sensor.dsc_hub_link_recovery_bounces", "—")
    : "—";
  const rf = available("sensor.dsc_hub_rf_status") ? state("sensor.dsc_hub_rf_status", "—") : "—";
  const handshake = available("sensor.dsc_hub_ha_handshake_age")
    ? ageLabel(state("sensor.dsc_hub_ha_handshake_age", "—"))
    : ageLabel(heartbeat);

  return (
    <div className="dsc-chip-row">
      <StatusChip
        icon={online ? "ok" : "alert"}
        label={online ? "HUB LINK" : "HUB LINK DOWN"}
        tone={online ? "ok" : "bad"}
      />
        <StatusChip label={`Age ${age}`} tone="muted" />
      <HelpTip title="Hub link chips">
        <p>
          <b>Age</b> / <b>Beat</b> are link freshness in human time (not raw floats). Grey RF is not always a fault —
          inventory out-of-service stays quiet on purpose.
        </p>
        <p>Example: Age 2H 14M means the link has been healthy for just over two hours.</p>
      </HelpTip>
      <StatusChip label={`Bounces ${bounce}`} tone="muted" />
      <StatusChip label={`RF ${rf}`} tone="muted" />
      <StatusChip label={`Beat ${handshake}`} tone="muted" />
      {fleet.surface ? <StatusChip label={fleet.surface} tone="muted" /> : null}
    </div>
  );
}
