import { StatusChip } from "./ui";

export type KitNodeStatus = "ok" | "missing" | "oos" | "dark" | "held";

export interface KitNode {
  id: string;
  label: string;
  status: KitNodeStatus;
}

const LAYOUT: Record<string, { x: number; y: number }> = {
  hub: { x: 160, y: 88 },
  ac: { x: 48, y: 40 },
  mister: { x: 48, y: 136 },
  tank: { x: 160, y: 168 },
  pot1: { x: 280, y: 36 },
  pot2: { x: 340, y: 36 },
  pot3: { x: 280, y: 140 },
  pot4: { x: 340, y: 140 },
};

function stroke(status: KitNodeStatus): string {
  switch (status) {
    case "ok":
      return "var(--dsc-teal)";
    case "held":
      return "var(--dsc-amber)";
    case "oos":
    case "missing":
    case "dark":
      return "var(--dsc-gray-5)";
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

/** Constellation with holes — missing / OOS / dark are empty rings, not greenwash. */
export function KitPulse({ nodes }: { nodes: KitNode[] }) {
  const hub = nodes.find((n) => n.id === "hub");
  return (
    <div className="dsc-kit-pulse">
      <svg viewBox="0 0 400 210" className="dsc-kit-constellation" aria-label="Kit pulse">
        {nodes.map((n) => {
          const from = LAYOUT.hub;
          const to = LAYOUT[n.id];
          if (!to || n.id === "hub") return null;
          const hole = n.status !== "ok";
          return (
            <line
              key={`edge-${n.id}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={stroke(hub?.status === "ok" && !hole ? "ok" : "dark")}
              strokeWidth="1.2"
              strokeDasharray={hole || hub?.status !== "ok" ? "4 4" : undefined}
              opacity={0.7}
            />
          );
        })}
        {nodes.map((n) => {
          const pos = LAYOUT[n.id] || LAYOUT.hub;
          const hole = n.status !== "ok";
          return (
            <g key={n.id} transform={`translate(${pos.x},${pos.y})`}>
              <circle
                r={n.id === "hub" ? 16 : 11}
                fill={hole ? "none" : "rgba(38,198,218,0.12)"}
                stroke={stroke(n.status)}
                strokeWidth="1.6"
                strokeDasharray={hole ? "3 3" : undefined}
              />
              <text textAnchor="middle" y="4" fill="currentColor" fontSize="8">
                {n.label.replace("Pot ", "P")}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="dsc-chip-row">
        {nodes.map((n) => (
          <StatusChip key={n.id} label={holeLabel(n.status, n.label)} tone={tone(n.status)} />
        ))}
      </div>
    </div>
  );
}
