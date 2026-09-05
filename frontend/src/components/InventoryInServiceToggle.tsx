import { useState } from "react";
import { Link } from "react-router-dom";
import { DecisionLayer } from "./DecisionLayer";
import { Icon, type IconName } from "./ui";
import { useFleet } from "../hooks/useFleet";
import { useBrainRefresh } from "../hooks/useBrain";
import { patch_inventory } from "../lib/fleetApi";
import { inventoryInService } from "../lib/fleetModel";

/**
 * In-service gate wired to inventory PATCH — hides when seat is not in fleet inventory.
 * Settings → Device is the single owner of the live toggle (redundancy-map fix). Every
 * other surface passes `readOnly` and gets a status badge that links back to Settings.
 */
export function InventoryInServiceToggle({
  seatId,
  label,
  icon,
  onPatched,
  readOnly = false,
}: {
  seatId: string;
  label: string;
  icon?: IconName;
  onPatched?: () => void;
  readOnly?: boolean;
}) {
  const fleet = useFleet();
  const refreshBrain = useBrainRefresh();
  const row = fleet.inventory?.find((r) => r.seat_id === seatId);
  const [confirm, setConfirm] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  if (!row) return null;

  const inService = inventoryInService(fleet, seatId, Boolean(row.in_service));
  const next = confirm ?? !inService;

  const apply = async () => {
    setBusy(true);
    try {
      await patch_inventory(seatId, { in_service: next });
      await refreshBrain();
      onPatched?.();
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  if (readOnly) {
    return (
      <Link
        to="/settings/device"
        className={`dsc-demand dsc-demand--readonly${inService ? " is-on" : ""}`}
        title={`${seatId} in service — change in Settings → Device`}
      >
        {icon ? <Icon name={icon} size={22} color="var(--dsc-teal)" className="dsc-demand-icon" /> : null}
        <span className="dsc-demand-label">{label}</span>
        <span className="dsc-demand-state">{inService ? "IN" : "OUT"}</span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={`dsc-demand${inService ? " is-on" : ""}`}
        onClick={() => setConfirm(!inService)}
        disabled={busy}
        title={`${seatId} in service`}
      >
        {icon ? <Icon name={icon} size={22} color="var(--dsc-teal)" className="dsc-demand-icon" /> : null}
        <span className="dsc-demand-label">{label}</span>
        <span className="dsc-demand-state">{inService ? "IN" : "OUT"}</span>
      </button>
      <DecisionLayer
        open={confirm !== null}
        onDismiss={() => setConfirm(null)}
        onConfirm={() => void apply()}
        title={next ? `Put ${label} in service` : `Take ${label} out of service`}
        confirmLabel={next ? "Enable" : "Disable"}
        help={null}
      >
        <p>
          {next
            ? `${label} will count toward kit gates and alerts.`
            : `${label} will be marked out of service — no fake readings.`}
        </p>
      </DecisionLayer>
    </>
  );
}
