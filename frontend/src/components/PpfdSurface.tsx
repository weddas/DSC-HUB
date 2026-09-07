import { useMemo } from "react";
import { rampColor } from "../lib/lightCatalog";
import type { PpfdLayer } from "../lib/lightCatalog";
import { fieldAtHeight, fieldStats, type Field } from "../lib/ppfdField";

/**
 * Isometric PPFD surface in plain SVG (the dev pane never fires rAF, and a
 * static picture needs no WebGL). The field comes from ppfdField: a measured
 * layer at a measured height, or an inverse-power estimate between/beyond the
 * maker's layers, which the panel labels as such. Z is PPFD from zero to the
 * record's maximum so heights compare on one scale.
 */
export function PpfdSurface({
  layers,
  heightCm,
  onHeight,
  range,
}: {
  layers: PpfdLayer[];
  heightCm: number;
  onHeight: (h: number) => void;
  range: [number, number];
}) {
  const heights = layers.map((l) => l.conditions.height_cm);
  const hMin = Math.max(5, Math.round(Math.min(...heights) * 0.7));
  const hMax = Math.round(Math.max(...heights) * 1.5);
  const field = useMemo(() => fieldAtHeight(layers, heightCm, 20, 20), [layers, heightCm]);
  if (!field) return <p className="dsc-panel-foot">No full-power layer to build a surface from.</p>;
  const st = fieldStats(field);
  return (
    <div className="dsc-ppfd-3d">
      <div className="dsc-ppfd-3d-controls">
        <label className="dsc-ppfd-3d-label">
          Hang height <strong>{Math.round(heightCm)} cm</strong>
          <input
            type="range"
            min={hMin}
            max={hMax}
            step={1}
            value={Math.round(heightCm)}
            onChange={(e) => onHeight(Number(e.target.value))}
            aria-label="Hang height in centimetres"
            list="dsc-ppfd-3d-heights"
          />
          <datalist id="dsc-ppfd-3d-heights">
            {heights.map((h) => (
              <option key={h} value={Math.round(h)} label={`${h} cm measured`} />
            ))}
          </datalist>
        </label>
        <div className="dsc-chip-row">
          {layers.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`dsc-chip${Math.abs(l.conditions.height_cm - heightCm) < 0.05 ? " is-active" : ""}`}
              onClick={() => onHeight(l.conditions.height_cm)}
            >
              {l.conditions.height_cm} cm
            </button>
          ))}
        </div>
      </div>
      <IsoSurface field={field} zMax={range[1]} />
      <div className="dsc-ppfd-stats">
        <span>{field.estimated ? "ESTIMATED" : "MEASURED LAYER"}</span>
        <span>avg {Math.round(st.avg)}</span>
        <span>min {Math.round(st.min)} · max {Math.round(st.max)}</span>
        <span title="min ÷ avg">uniformity {st.uniformity.toFixed(2)}</span>
      </div>
      <p className="dsc-muted dsc-ppfd-3d-note">{field.note}. Dense surface is interpolated from the maker's readings for shape only.</p>
    </div>
  );
}

function IsoSurface({ field, zMax }: { field: Field; zMax: number }) {
  const { nx, ny, values } = field;
  const cell = 22;
  const ax = Math.cos(Math.PI / 6) * cell;
  const ay = Math.sin(Math.PI / 6) * cell;
  const zScale = 150 / Math.max(1, zMax);
  const originX = ny * ax + 30;
  const originY = 190;
  const W = (nx + ny) * ax + 60;
  const H = (nx + ny) * ay + 190 + 30;
  const px = (i: number, j: number, z: number) => [originX + (i - j) * ax, originY + (i + j) * ay - z * zScale] as const;
  const z = (i: number, j: number) => values[Math.min(ny - 1, j) * nx + Math.min(nx - 1, i)];

  const quads: Array<{ d: string; fill: string; order: number }> = [];
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const z00 = z(i, j);
      const z10 = z(i + 1, j);
      const z11 = z(i + 1, j + 1);
      const z01 = z(i, j + 1);
      const avg = (z00 + z10 + z11 + z01) / 4;
      // relief: faces that rise toward the viewer (front-right) catch light
      const slope = (z11 - z00) / Math.max(1, zMax);
      const shade = Math.max(0.55, Math.min(1.15, 0.95 + slope * 2.5));
      const base = rampColor(zMax > 0 ? avg / zMax : 0);
      const m = base.match(/\d+/g)!.map(Number);
      const fill = `rgb(${m.map((c) => Math.round(Math.min(255, c * shade))).join(", ")})`;
      const p = [px(i, j, z00), px(i + 1, j, z10), px(i + 1, j + 1, z11), px(i, j + 1, z01)];
      quads.push({ d: p.map((q, k) => `${k ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ") + " Z", fill, order: i + j });
    }
  }
  quads.sort((a, b) => a.order - b.order);

  const floor = [px(0, 0, 0), px(nx - 1, 0, 0), px(nx - 1, ny - 1, 0), px(0, ny - 1, 0)];
  const axisTop = px(0, ny - 1, zMax);
  const axisBase = px(0, ny - 1, 0);
  const ticks = [0.5, 1].map((f) => ({ f, p: px(0, ny - 1, zMax * f) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dsc-ppfd-svg dsc-ppfd-iso" role="img" aria-label={`PPFD surface at ${field.height_cm} cm`}>
      <path d={floor.map((q, k) => `${k ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ") + " Z"} className="dsc-ppfd-iso-floor" />
      {quads.map((q, k) => (
        <path key={k} d={q.d} fill={q.fill} stroke={q.fill} strokeWidth={0.6} />
      ))}
      <line x1={axisBase[0]} y1={axisBase[1]} x2={axisTop[0]} y2={axisTop[1]} className="dsc-ppfd-grid" />
      {ticks.map((t) => (
        <g key={t.f}>
          <line x1={t.p[0] - 6} y1={t.p[1]} x2={t.p[0]} y2={t.p[1]} className="dsc-ppfd-grid" />
          <text x={t.p[0] - 10} y={t.p[1]} fontSize={12} textAnchor="end" dominantBaseline="central" className="dsc-ppfd-axis">
            {Math.round(zMax * t.f)}
          </text>
        </g>
      ))}
      <text x={axisBase[0] - 10} y={axisBase[1]} fontSize={12} textAnchor="end" dominantBaseline="central" className="dsc-ppfd-axis">
        0
      </text>
      <text x={(floor[2][0] + floor[3][0]) / 2 + 8} y={(floor[2][1] + floor[3][1]) / 2 + 16} fontSize={12} className="dsc-ppfd-axis">
        {field.width_cm} cm
      </text>
      <text x={(floor[1][0] + floor[2][0]) / 2 + 12} y={(floor[1][1] + floor[2][1]) / 2 + 4} fontSize={12} className="dsc-ppfd-axis">
        {field.depth_cm} cm
      </text>
    </svg>
  );
}
