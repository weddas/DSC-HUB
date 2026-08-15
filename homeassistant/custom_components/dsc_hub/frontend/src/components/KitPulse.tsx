import { StatusChip } from "./ui";

export type KitNodeStatus = "ok" | "missing" | "oos" | "dark" | "held";

export interface KitNode {
  id: string;
  label: string;
  status: KitNodeStatus;
}

function tone(status: KitNodeStatus): "ok" | "warn" | "bad" | "muted" {
  switch (status) {
    case "ok":
      return "ok";
    case "held":
      return "warn";
    case "oos":
    case "missing":
    case "dark":
      return "bad";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function holeLabel(status: KitNodeStatus, label: string): string {
  switch (status) {
    case "ok":
      return label;
    case "held":
      return `${label} HELD`;
    case "oos":
      return `${label} OOS`;
    case "missing":
      return `${label} missing`;
    case "dark":
      return `${label} dark`;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/** Constellation with holes — missing kit / OOS / dark hub, not greenwash. */
export function KitPulse({ nodes }: { nodes: KitNode[] }) {
  return (
    <div className="dsc-kit-pulse">
      <div className="dsc-kit-pulse-grid">
        {nodes.map((n) => (
          <div key={n.id} className={`dsc-kit-node is-${n.status}`}>
            <i />
            <StatusChip label={holeLabel(n.status, n.label)} tone={tone(n.status)} />
          </div>
        ))}
      </div>
    </div>
  );
}
