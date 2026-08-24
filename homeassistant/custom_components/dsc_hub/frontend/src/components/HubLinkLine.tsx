import { StatusChip } from "./ui";
import { useHubVitals, useFleet } from "../hooks/useFleet";
import { useEntityBus } from "../hooks/useEntityBus";

/** D-05: hub_link + ages/bounces/rf — fleet-native link; HA-only extras from entity bus. */
export function HubLinkLine() {
  const { online, uptime, heartbeat } = useHubVitals();
  const fleet = useFleet();
  const { state, available } = useEntityBus();

  const age = available("sensor.dsc_hub_api_down_age")
    ? state("sensor.dsc_hub_api_down_age", "—")
    : uptime != null
      ? String(uptime)
      : "—";
  const bounce = available("sensor.dsc_hub_link_recovery_bounces")
    ? state("sensor.dsc_hub_link_recovery_bounces", "—")
    : "—";
  const rf = available("sensor.dsc_hub_rf_status") ? state("sensor.dsc_hub_rf_status", "—") : "—";
  const handshake = available("sensor.dsc_hub_ha_handshake_age")
    ? state("sensor.dsc_hub_ha_handshake_age", "—")
    : heartbeat != null
      ? String(heartbeat)
      : "—";

  return (
    <div className="dsc-chip-row">
      <StatusChip
        icon={online ? "ok" : "alert"}
        label={online ? "HUB LINK" : "HUB LINK DOWN"}
        tone={online ? "ok" : "bad"}
      />
      <StatusChip label={`Age ${age}`} tone="muted" />
      <StatusChip label={`Bounces ${bounce}`} tone="muted" />
      <StatusChip label={`RF ${rf}`} tone="muted" />
      <StatusChip label={`Beat ${handshake}`} tone="muted" />
      {fleet.surface ? <StatusChip label={fleet.surface} tone="muted" /> : null}
    </div>
  );
}
