import { DecisionLayer } from "../DecisionLayer";
import { probeLabel } from "../../lib/seatModel";

export type RosterLifecycleDialogsProps = {
  detachPot: number | null;
  onDismissDetach: () => void;
  onConfirmDetach: () => void;
  assignSlot: number | null;
  assignPot: number;
  onAssignPotChange: (pot: number) => void;
  vacantProbes: number[];
  onDismissAssign: () => void;
  onConfirmAssign: () => void;
  retireSlot: number | null;
  retirePot: number | null;
  onDismissRetire: () => void;
  onConfirmRetire: () => void;
};

export function RosterLifecycleDialogs({
  detachPot,
  onDismissDetach,
  onConfirmDetach,
  assignSlot,
  assignPot,
  onAssignPotChange,
  vacantProbes,
  onDismissAssign,
  onConfirmAssign,
  retireSlot,
  retirePot,
  onDismissRetire,
  onConfirmRetire,
}: RosterLifecycleDialogsProps) {
  return (
    <>
      <DecisionLayer
        open={detachPot != null}
        onDismiss={onDismissDetach}
        onConfirm={onConfirmDetach}
        title={detachPot != null ? `Detach plant from ${probeLabel(detachPot)}?` : "Detach"}
        confirmLabel="Detach"
        help={null}
      >
        <p>
          Frees {detachPot != null ? probeLabel(detachPot) : "this probe"} and keeps the plant on the roster with no
          probe. SoftCal and probe-station home are unchanged. Delete if you mean to destroy the plant.
        </p>
      </DecisionLayer>

      <DecisionLayer
        open={assignSlot != null}
        onDismiss={onDismissAssign}
        onConfirm={onConfirmAssign}
        title={assignSlot != null ? `Assign roster #${assignSlot} to a probe?` : "Assign"}
        confirmLabel="Assign"
        help={null}
      >
        <p>Pick a vacant kit probe for this detached plant.</p>
        <label>
          Probe
          <select
            value={assignPot}
            onChange={(e) => onAssignPotChange(Number(e.target.value))}
            style={{ display: "block", marginTop: 8 }}
          >
            {vacantProbes.map((n) => (
              <option key={n} value={n}>
                {probeLabel(n)}
              </option>
            ))}
          </select>
        </label>
      </DecisionLayer>

      <DecisionLayer
        open={retireSlot != null}
        onDismiss={onDismissRetire}
        onConfirm={onConfirmRetire}
        title={retireSlot != null ? `Delete roster #${retireSlot}?` : "Delete plant"}
        confirmLabel="Delete plant"
        help={null}
      >
        <p>
          {retirePot != null
            ? `Destroys the plant on ${probeLabel(retirePot)} and clears roster slot #${retireSlot}. Use Detach if you only want to free the probe.`
            : `Removes roster slot #${retireSlot} (stock or detached). This cannot be undone.`}
        </p>
      </DecisionLayer>
    </>
  );
}
