import { useState } from "react";
import type { CfmReading } from "../lib/cfmProvenance";
import { cfmKindLabel } from "../lib/cfmProvenance";
import { StatusChip } from "./ui";

type FlowMode = "air" | "heat" | "humidity";

type FlowReading = { value: number; label: string; kind: string };

function fmt(n: number, digits = 0): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "0";
}

function flowWidth(value: number, max: number): number {
  if (!Number.isFinite(value) || value <= 0 || max <= 0) return 2;
  return Math.max(2, Math.min(28, (value / max) * 28));
}

type Node = { id: string; label: string; x: number; y: number; w: number; h: number; color: string };

function linkPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function SankeySvg({
  nodes,
  links,
  max,
  unit,
}: {
  nodes: Node[];
  links: { from: Node; to: Node; reading: FlowReading; label: string; y1: number; y2: number; color: string }[];
  max: number;
  unit: string;
}) {
  return (
    <svg viewBox="0 0 520 290" className="dsc-air-svg" aria-label="Flow sankey">
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
            <text
              x={(x1 + x2) / 2}
              y={(link.y1 + link.y2) / 2 - w / 2 - 4}
              textAnchor="middle"
              fill="var(--dsc-gray-5)"
              fontSize="9"
            >
              {link.label} {fmt(link.reading.value, link.reading.kind === "g/h" ? 1 : 0)} {unit}
              {link.reading.kind ? ` (${link.reading.kind})` : ""}
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
  );
}

function airModel(
  intakeClone: CfmReading,
  intakeMain: CfmReading,
  cascade: CfmReading,
  outCfm: CfmReading,
  recircCfm: CfmReading,
) {
  const nodes: Node[] = [
    { id: "room", label: "Room", x: 24, y: 100, w: 88, h: 56, color: "var(--dsc-gray-3)" },
    { id: "clone", label: "2×4", x: 200, y: 36, w: 88, h: 48, color: "var(--dsc-teal-dim)" },
    { id: "main", label: "4×8", x: 200, y: 148, w: 88, h: 48, color: "var(--dsc-blue-dim)" },
    { id: "out", label: "Outside", x: 400, y: 120, w: 88, h: 48, color: "var(--dsc-orange)" },
    { id: "recirc", label: "Room recirc", x: 200, y: 228, w: 88, h: 40, color: "var(--dsc-purple-dim)" },
  ];
  const toFlow = (r: CfmReading): FlowReading => ({
    value: r.value,
    label: "",
    kind: cfmKindLabel(r.kind),
  });
  const links = [
    { from: nodes[0], to: nodes[1], reading: toFlow(intakeClone), label: "intake 2×4", y1: 118, y2: 60, color: "var(--dsc-teal)" },
    { from: nodes[0], to: nodes[2], reading: toFlow(intakeMain), label: "intake 4×8", y1: 132, y2: 172, color: "var(--dsc-blue)" },
    { from: nodes[1], to: nodes[2], reading: toFlow(cascade), label: "cascade", y1: 84, y2: 148, color: "var(--dsc-amber)" },
    { from: nodes[2], to: nodes[3], reading: toFlow(outCfm), label: "dump", y1: 168, y2: 144, color: "var(--dsc-orange)" },
    { from: nodes[2], to: nodes[4], reading: toFlow(recircCfm), label: "recirc", y1: 188, y2: 248, color: "var(--dsc-purple)" },
  ];
  const max = Math.max(...links.map((l) => l.reading.value).filter(Number.isFinite), 1);
  return { nodes, links, max, unit: "CFM" };
}

function heatModel(heatTentW: number, heatMatW: number) {
  const nodes: Node[] = [
    { id: "room", label: "Room", x: 24, y: 110, w: 88, h: 56, color: "var(--dsc-gray-3)" },
    { id: "main", label: "4×8", x: 200, y: 80, w: 88, h: 48, color: "var(--dsc-orange-dim)" },
    { id: "mat", label: "Heat mat", x: 200, y: 180, w: 88, h: 48, color: "var(--dsc-amber-dim)" },
    { id: "clone", label: "2×4", x: 400, y: 110, w: 88, h: 48, color: "var(--dsc-teal-dim)" },
  ];
  const links = [
    {
      from: nodes[0],
      to: nodes[1],
      reading: { value: heatTentW, label: "heater", kind: "estimated" },
      label: "heater",
      y1: 120,
      y2: 104,
      color: "var(--dsc-orange)",
    },
    {
      from: nodes[0],
      to: nodes[2],
      reading: { value: heatMatW, label: "mat", kind: "estimated" },
      label: "mat",
      y1: 140,
      y2: 204,
      color: "var(--dsc-amber)",
    },
  ];
  const max = Math.max(heatTentW, heatMatW, 1);
  return { nodes, links, max, unit: "W" };
}

function humidityModel(humidify: number, dehumidify: number) {
  const nodes: Node[] = [
    { id: "room", label: "Room", x: 24, y: 110, w: 88, h: 56, color: "var(--dsc-gray-3)" },
    { id: "main", label: "4×8", x: 200, y: 70, w: 88, h: 48, color: "var(--dsc-blue-dim)" },
    { id: "clone", label: "2×4", x: 200, y: 170, w: 88, h: 48, color: "var(--dsc-teal-dim)" },
    { id: "out", label: "Dehum", x: 400, y: 110, w: 88, h: 48, color: "var(--dsc-purple-dim)" },
  ];
  const halfHum = humidify * 0.55;
  const links = [
    {
      from: nodes[0],
      to: nodes[1],
      reading: { value: halfHum, label: "humidify", kind: "estimated" },
      label: "hum → 4×8",
      y1: 118,
      y2: 94,
      color: "var(--dsc-blue)",
    },
    {
      from: nodes[0],
      to: nodes[2],
      reading: { value: humidify - halfHum, label: "humidify", kind: "estimated" },
      label: "hum → 2×4",
      y1: 128,
      y2: 194,
      color: "var(--dsc-teal)",
    },
    {
      from: nodes[1],
      to: nodes[3],
      reading: { value: dehumidify, label: "dehum", kind: "estimated" },
      label: "dehum",
      y1: 94,
      y2: 134,
      color: "var(--dsc-purple)",
    },
  ];
  const max = Math.max(humidify, dehumidify, 1);
  return { nodes, links, max, unit: "g/h" };
}

export function FlowSankey({
  intakeClone,
  intakeMain,
  cascade,
  outCfm,
  recircCfm,
  heatTentW,
  heatMatW,
  humidifyGh,
  dehumidifyGh,
  massBalanceOk,
}: {
  intakeClone: CfmReading;
  intakeMain: CfmReading;
  cascade: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
  heatTentW: number;
  heatMatW: number;
  humidifyGh: number;
  dehumidifyGh: number;
  massBalanceOk: boolean | null;
}) {
  const [mode, setMode] = useState<FlowMode>("air");
  const model =
    mode === "air"
      ? airModel(intakeClone, intakeMain, cascade, outCfm, recircCfm)
      : mode === "heat"
        ? heatModel(heatTentW, heatMatW)
        : humidityModel(humidifyGh, dehumidifyGh);

  return (
    <div className="dsc-sankey-proto">
      <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
        <StatusChip label="EXPERIMENTAL" tone="warn" />
        {(["air", "heat", "humidity"] as FlowMode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`dsc-chip${mode === m ? " dsc-chip--ok" : ""}`}
            onClick={() => setMode(m)}
          >
            {m === "air" ? "Air" : m === "heat" ? "Heat" : "Humidity"}
          </button>
        ))}
        {mode === "air" && massBalanceOk != null ? (
          <StatusChip
            label={massBalanceOk ? "Mass balance OK" : "Mass imbalance"}
            tone={massBalanceOk ? "ok" : "warn"}
          />
        ) : null}
        <span className="dsc-muted" style={{ fontSize: 12 }}>
          Estimated flow proxies — informational only, not control inputs.
        </span>
      </div>
      <SankeySvg nodes={model.nodes} links={model.links} max={model.max} unit={model.unit} />
    </div>
  );
}

/** @deprecated Use FlowSankey */
export { FlowSankey as SankeyFlowPrototype };
