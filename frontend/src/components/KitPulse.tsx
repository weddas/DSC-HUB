import { kitHoleLabel, kitTone, type KitNode } from "../lib/kitInventory";
import { StatusChip } from "./ui";

const VIEW = { w: 720, h: 400 };
const HUB = { x: 360, y: 188 };

/** Appliance seats where "ok" means the relay is actually on right now. */
const APPLIANCE_IDS = new Set(["heater", "heatmat", "humidifier", "dehumidifier", "ac", "mister"]);

function isRunningAppliance(n: KitNode): boolean {
  return APPLIANCE_IDS.has(n.id) && n.status === "ok";
}

function layoutFor(id: string, index: number, spokeCount: number): { x: number; y: number } {
  if (id === "hub") return HUB;
  const r = 148;
  const a = (index / Math.max(spokeCount, 1)) * Math.PI * 2 - Math.PI / 2;
  return { x: HUB.x + Math.cos(a) * r, y: HUB.y + Math.sin(a) * r };
}

function stroke(status: KitNode["status"]): string {
  switch (status) {
    case "ok":
      return "var(--dsc-teal)";
    case "idle":
      return "var(--dsc-gray-5)";
    case "held":
      return "var(--dsc-amber)";
    case "oos":
    case "missing":
      return "var(--dsc-gray-4)";
    case "dark":
      return "var(--dsc-bad)";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/** Clickable constellation. OOS = dashed muted ring, not a red hole. */
export function KitPulse({
  nodes,
  onSelect,
}: {
  nodes: KitNode[];
  onSelect?: (node: KitNode) => void;
}) {
  const hub = nodes.find((n) => n.id === "hub");
  const spokes = nodes.filter((n) => n.id !== "hub");
  return (
    <div className="dsc-kit-pulse">
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="dsc-kit-constellation" aria-label="Kit pulse">
        {spokes.map((n, i) => {
          const to = layoutFor(n.id, i, spokes.length);
          const hole = n.status === "oos" || n.status === "missing" || n.status === "dark";
          return (
            <line
              key={`edge-${n.id}`}
              x1={HUB.x}
              y1={HUB.y}
              x2={to.x}
              y2={to.y}
              stroke={stroke(hub?.status === "ok" && !hole ? "ok" : n.status)}
              strokeWidth="1.2"
              strokeDasharray={hole || hub?.status !== "ok" ? "4 4" : undefined}
              opacity={0.7}
            />
          );
        })}
        {nodes.map((n) => {
          const pos = n.id === "hub" ? HUB : layoutFor(n.id, spokes.findIndex((s) => s.id === n.id), spokes.length);
          const hole = n.status === "oos" || n.status === "missing" || n.status === "dark";
          const idle = n.status === "idle";
          const short = n.label.replace("Probe ", "P").replace("Clone mister", "Mister").replace("Dehumidifier", "Dehum").replace("Humidifier", "Hum");
          return (
            <g
              key={n.id}
              transform={`translate(${pos.x},${pos.y})`}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              style={{ cursor: onSelect ? "pointer" : undefined }}
              onClick={() => onSelect?.(n)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(n);
                }
              }}
            >
              <circle
                r={n.id === "hub" ? 22 : 16}
                className={isRunningAppliance(n) ? "dsc-kit-node-running" : undefined}
                fill={hole || idle ? "none" : "rgba(38,198,218,0.12)"}
                stroke={stroke(n.status)}
                strokeWidth="1.8"
                strokeDasharray={hole ? "4 3" : undefined}
              />
              <text textAnchor="middle" y="4" fill="currentColor" fontSize="9">
                {short}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="dsc-chip-row">
        {nodes.map((n) => (
          <StatusChip
            key={n.id}
            label={kitHoleLabel(n.status, n.label)}
            tone={kitTone(n.status)}
            motion={isRunningAppliance(n) ? "duty" : undefined}
            onClick={onSelect ? () => onSelect(n) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
