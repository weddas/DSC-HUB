import { DecisionLayer } from "../DecisionLayer";
import { probeLabel } from "../../lib/probeModel";

export type RosterLifecycleDialogsProps = {
  detachProbe: number | null;
  onDismissDetach: () => void;
  onConfirmDetach: () => void;
  assignSlot: number | null;
  assignProbe: number;
  onAssignProbeChange: (probe: number) => void;
  vacantProbes: number[];
  onDismissAssign: () => void;
  onConfirmAssign: () => void;
  retireSlot: number | null;
  retireProbe: number | null;
  onDismissRetire: () => void;
  onConfirmRetire: () => void;
};

export function RosterLifecycleDialogs({
  detachProbe,
  onDismissDetach,
  onConfirmDetach,
  assignSlot,
  assignProbe,
  onAssignProbeChange,
  vacantProbes,
  onDismissAssign,
  onConfirmAssign,
  retireSlot,
  retireProbe,
  onDismissRetire,
  onConfirmRetire,
}: RosterLifecycleDialogsProps) {
  return (
    <>
      <DecisionLayer
        open={detachProbe != null}
        onDismiss={onDismissDetach}
        onConfirm={onConfirmDetach}
        title={detachProbe != null ? `Detach plant from ${probeLabel(detachProbe)}?` : "Detach"}
        confirmLabel="Detach"
        help={null}
      >
        <p>
          Frees {detachProbe != null ? probeLabel(detachProbe) : "this probe"} and keeps the plant on the roster with no
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
            value={assignProbe}
            onChange={(e) => onAssignProbeChange(Number(e.target.value))}
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
          {retireProbe != null
            ? `Destroys the plant on ${probeLabel(retireProbe)} and clears roster slot #${retireSlot}. Use Detach if you only want to free the probe.`
            : `Removes roster slot #${retireSlot} (stock or detached). This cannot be undone.`}
        </p>
      </DecisionLayer>
    </>
  );
}
