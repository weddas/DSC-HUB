import { useMemo } from "react";
import type { EChartsCoreOption } from "echarts/core";
import type { CfmReading } from "../lib/cfmProvenance";
import { cfmKindLabel } from "../lib/cfmProvenance";
import { EChart } from "../viz/EChart";
import { hexColor } from "../viz/charts";
import { StatusChip } from "./ui";

type FlowReading = { value: number; label: string; kind: string };

type FlowNode = { id: string; label: string; color: string };

type FlowLink = {
  from: FlowNode;
  to: FlowNode;
  reading: FlowReading;
  label: string;
  color: string;
};

function toFlow(r: CfmReading): FlowReading {
  return { value: r.value, label: "", kind: cfmKindLabel(r.kind) };
}

function airModel(
  intakeClone: CfmReading,
  intakeMain: CfmReading,
  cascade: CfmReading,
  outCfm: CfmReading,
  recircCfm: CfmReading,
): { nodes: FlowNode[]; links: FlowLink[]; unit: string } {
  const room: FlowNode = { id: "room", label: "Room", color: "var(--dsc-gray-3)" };
  const clone: FlowNode = { id: "clone", label: "2×4", color: "var(--dsc-teal-dim)" };
  const main: FlowNode = { id: "main", label: "4×8", color: "var(--dsc-blue-dim)" };
  const out: FlowNode = { id: "out", label: "Outside", color: "var(--dsc-orange)" };
  const recirc: FlowNode = { id: "recirc", label: "Room recirc", color: "var(--dsc-purple-dim)" };
  return {
    unit: "CFM",
    nodes: [room, clone, main, out, recirc],
    links: [
      { from: room, to: clone, reading: toFlow(intakeClone), label: "intake 2×4", color: "var(--dsc-teal)" },
      { from: room, to: main, reading: toFlow(intakeMain), label: "intake 4×8", color: "var(--dsc-blue)" },
      { from: clone, to: main, reading: toFlow(cascade), label: "cascade", color: "var(--dsc-amber)" },
      { from: main, to: out, reading: toFlow(outCfm), label: "dump", color: "var(--dsc-orange)" },
      { from: main, to: recirc, reading: toFlow(recircCfm), label: "recirc", color: "var(--dsc-purple)" },
    ],
  };
}

/** Air CFM Sankey only — heat/humidity estimated splits removed (honesty). */
export function FlowSankey({
  intakeClone,
  intakeMain,
  cascade,
  outCfm,
  recircCfm,
  massBalanceOk = null,
}: {
  intakeClone: CfmReading;
  intakeMain: CfmReading;
  cascade: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
  /** Always null from Climate — MASS IMBALANCE chip stays gated. */
  massBalanceOk?: boolean | null;
  /** @deprecated ignored — heat/humidity modes removed */
  heatTentW?: number;
  heatMatW?: number;
  humidifyGh?: number;
  dehumidifyGh?: number;
}) {
  const model = airModel(intakeClone, intakeMain, cascade, outCfm, recircCfm);

  const option = useMemo<EChartsCoreOption>(() => {
    const liveLinks = model.links.filter((l) => Number.isFinite(l.reading.value) && l.reading.value > 0);
    const usedNames = new Set(liveLinks.flatMap((l) => [l.from.label, l.to.label]));
    if (!liveLinks.length) {
      return {
        backgroundColor: "transparent",
        graphic: {
          type: "text",
          left: "center",
          top: "middle",
          style: {
            text: "No measured air CFM — zero / missing links omitted",
            fill: "#8b95a8",
            fontSize: 12,
          },
        },
      };
    }
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#243044",
        textStyle: { color: "#e8eef8", fontSize: 11 },
        formatter: (raw: unknown) => {
          const p = raw as { data?: { source?: string; target?: string; value?: number; name?: string } };
          if (p.data?.source && p.data.target != null) {
            const link = liveLinks.find((l) => l.from.label === p.data?.source && l.to.label === p.data?.target);
            const kind = link?.reading.kind ? ` (${link.reading.kind})` : "";
            return `${link?.label ?? ""} ${p.data.value ?? ""} ${model.unit}${kind}`;
          }
          return p.data?.name ?? "";
        },
      },
      series: [
        {
          type: "sankey",
          left: 8,
          right: 8,
          top: 12,
          bottom: 12,
          nodeWidth: 16,
          nodeGap: 14,
          data: model.nodes.filter((n) => usedNames.has(n.label)).map((n) => ({
            name: n.label,
            itemStyle: { color: hexColor(n.color, "#26c6da"), borderColor: hexColor(n.color, "#26c6da") },
          })),
          links: liveLinks.map((l) => ({
            source: l.from.label,
            target: l.to.label,
            value: l.reading.value,
            lineStyle: { color: hexColor(l.color, "#26c6da"), opacity: 0.45 },
          })),
          label: { color: "#e8eef8", fontSize: 11 },
          lineStyle: { curveness: 0.45 },
        },
      ],
    };
  }, [model]);

  return (
    <div className="dsc-sankey-proto">
      <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
        <StatusChip label="Air CFM" tone="ok" />
        {massBalanceOk != null ? (
          <StatusChip
            label={massBalanceOk ? "Mass balance OK" : "Mass imbalance"}
            tone={massBalanceOk ? "ok" : "warn"}
          />
        ) : (
          <StatusChip label="Mass chip gated" tone="muted" />
        )}
        <span className="dsc-muted" style={{ fontSize: 12 }}>
          CFM provenance per link (Allocated / Nameplate). Heat/humidity estimated splits removed. Zero links
          omitted.
        </span>
      </div>
      <EChart option={option} style={{ width: "100%", height: 290 }} ariaLabel="Air flow sankey" />
    </div>
  );
}
