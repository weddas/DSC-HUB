import type { CfmReading } from "../lib/cfmProvenance";
import { cfmKindLabel } from "../lib/cfmProvenance";
import { StatusChip } from "./ui";

function fmt(n: number): string {
  return Number.isFinite(n) ? String(Math.round(n)) : "0";
}

function flowWidth(cfm: number, max: number): number {
  if (!Number.isFinite(cfm) || cfm <= 0 || max <= 0) return 2;
  return Math.max(2, Math.min(28, (cfm / max) * 28));
}

type Node = { id: string; label: string; x: number; y: number; w: number; h: number; color: string };

function linkPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

/**
 * Experimental sankey-style CFM flow — widths scale with resolved CFM values.
 */
export function SankeyFlowPrototype({
  intakeClone,
  intakeMain,
  outCfm,
  recircCfm,
}: {
  intakeClone: CfmReading;
  intakeMain: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
}) {
  const cascade = intakeClone;
  const flows = [
    intakeClone.value,
    intakeMain.value,
    cascade.value,
    outCfm.value,
    recircCfm.value,
  ];
  const max = Math.max(...flows.filter(Number.isFinite), 1);

  const nodes: Node[] = [
    { id: "room", label: "Room", x: 24, y: 100, w: 88, h: 56, color: "var(--dsc-gray-3)" },
    { id: "clone", label: "2×4", x: 200, y: 36, w: 88, h: 48, color: "var(--dsc-teal-dim)" },
    { id: "main", label: "4×8", x: 200, y: 148, w: 88, h: 48, color: "var(--dsc-blue-dim)" },
    { id: "out", label: "Outside", x: 400, y: 120, w: 88, h: 48, color: "var(--dsc-orange)" },
    { id: "recirc", label: "Room recirc", x: 200, y: 228, w: 88, h: 40, color: "var(--dsc-purple-dim)" },
  ];

  const links: {
    from: Node;
    to: Node;
    reading: CfmReading;
    label: string;
    y1: number;
    y2: number;
    color: string;
  }[] = [
    {
      from: nodes[0],
      to: nodes[1],
      reading: intakeClone,
      label: "intake 2×4",
      y1: 118,
      y2: 60,
      color: "var(--dsc-teal)",
    },
    {
      from: nodes[0],
      to: nodes[2],
      reading: intakeMain,
      label: "intake 4×8",
      y1: 132,
      y2: 172,
      color: "var(--dsc-blue)",
    },
    {
      from: nodes[1],
      to: nodes[2],
      reading: cascade,
      label: "cascade",
      y1: 84,
      y2: 148,
      color: "var(--dsc-amber)",
    },
    {
      from: nodes[2],
      to: nodes[3],
      reading: outCfm,
      label: "dump",
      y1: 168,
      y2: 144,
      color: "var(--dsc-orange)",
    },
    {
      from: nodes[2],
      to: nodes[4],
      reading: recircCfm,
      label: "recirc",
      y1: 188,
      y2: 248,
      color: "var(--dsc-purple)",
    },
  ];

  return (
    <div className="dsc-sankey-proto">
      <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
        <StatusChip label="EXPERIMENTAL" tone="warn" />
        <span className="dsc-muted" style={{ fontSize: 12 }}>
          Prototype mass-flow view — same CFM provenance as Air path; not yet wired to control.
        </span>
      </div>
      <svg viewBox="0 0 520 290" className="dsc-air-svg" aria-label="CFM sankey prototype">
        {links.map((link) => {
          const w = flowWidth(link.reading.value, max);
          const x1 = link.from.x + link.from.w;
          const x2 = link.to.x;
          return (
            <g key={link.label}>
              <path
                d={linkPath(x1, link.y1, x2, link.y2)}
                fill="none"
                stroke={link.color}
                strokeWidth={w}
                strokeLinecap="round"
                opacity={link.reading.value > 0 ? 0.75 : 0.2}
              />
              <text x={(x1 + x2) / 2} y={(link.y1 + link.y2) / 2 - w / 2 - 4} textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="9">
                {link.label} {fmt(link.reading.value)} ({cfmKindLabel(link.reading.kind)})
              </text>
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill="none" stroke={n.color} strokeWidth="1.6" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle" fill="currentColor" fontSize="12">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
