import { StatusChip } from "./ui";
import { useHass } from "../hooks/useHass";

/** D-05: hub_link + ages/bounces/rf — not uptime as SoT. */
export function HubLinkLine() {
  const { available, state } = useHass();
  const linkOn = state("binary_sensor.dsc_hub_link") === "on";
  const linkKnown = available("binary_sensor.dsc_hub_link");
  const age = state("sensor.dsc_hub_api_down_age", "—");
  const bounce = state("sensor.dsc_hub_link_recovery_bounces", "—");
  const rf = state("sensor.dsc_hub_rf_status", "—");
  const handshake = state("sensor.dsc_hub_ha_handshake_age", "—");
  return (
    <div className="dsc-chip-row">
      <StatusChip
        icon={linkOn ? "ok" : "alert"}
        label={linkKnown ? (linkOn ? "HUB LINK" : "HUB LINK DOWN") : "HUB LINK —"}
        tone={linkOn ? "ok" : "bad"}
      />
      <StatusChip label={`Age ${age}`} tone="muted" />
      <StatusChip label={`Bounces ${bounce}`} tone="muted" />
      <StatusChip label={`RF ${rf}`} tone="muted" />
      <StatusChip label={`Handshake ${handshake}`} tone="muted" />
    </div>
  );
}
