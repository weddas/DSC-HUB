/**
 * PPFD fields: dense canopy grids derived from maker layers, for the 3D surface
 * and for placing fixtures in the twin.
 *
 * Rules (CannaLib plan, "3D twin placement"):
 * - A measured grid layer resamples bilinearly; a sparse point layer is filled by
 *   inverse-distance weighting. Either way the dense field is marked `derived`.
 * - Between two measured heights, each cell follows an inverse-power fit anchored
 *   on those layers (v ∝ h^-k with k fitted per cell). Outside the measured
 *   range the nearest layer is scaled with max(fitted k, 2): never gentler than
 *   inverse square, because a footprint-average fit says nothing about light that
 *   has left the footprint. Both are `estimated` and say so.
 * - Dimming scales linearly unless the maker gave a dimmed layer.
 * - Fixtures add. Outside a fixture's footprint the maker map says nothing, so
 *   that fixture contributes 0 there and the gap is flagged, not filled.
 * Nothing here is a measurement; the card and the twin label every field.
 */
import type { PpfdLayer } from "./lightCatalog";

export type Field = {
  nx: number;
  ny: number;
  width_cm: number;
  depth_cm: number;
  /** Row-major, ny rows of nx values, origin top-left. */
  values: Float64Array;
  /** Dense values interpolated from the maker's readings (always true here). */
  derived: "bilinear" | "idw" | "sum";
  /** Height or dim differs from any measured layer, or extrapolated. */
  estimated: boolean;
  height_cm: number;
  dim_pct: number;
  note: string;
};

export type FieldStats = { min: number; max: number; avg: number; uniformity: number; n: number };

function layerFootprint(layer: PpfdLayer): { w: number; d: number } {
  const fp = layer.conditions.footprint;
  return { w: fp.width_cm ?? 100, d: fp.depth_cm ?? 100 };
}

/**
 * Unreadable (null) cells take the mean of their readable orthogonal
 * neighbours, so a hole in a maker map never reads as zero and never borrows
 * from across the map. Returns a dense copy; the source is untouched.
 */
function fillHoles(grid: NonNullable<PpfdLayer["grid"]>): number[][] {
  const { rows, cols, values } = grid;
  const out: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const v = values[r]?.[c];
      if (v != null) {
        row.push(v);
        continue;
      }
      const nb = [values[r - 1]?.[c], values[r + 1]?.[c], values[r]?.[c - 1], values[r]?.[c + 1]].filter((x): x is number => x != null);
      row.push(nb.length ? nb.reduce((a, b) => a + b, 0) / nb.length : 0);
    }
    out.push(row);
  }
  return out;
}

/** Bilinear sample of a grid whose cell centres sit at (c+0.5)/cols, (r+0.5)/rows; clamps at the edges. */
function sampleGrid(grid: { rows: number; cols: number; values: number[][] }, u: number, v: number): number {
  const { rows, cols, values } = grid;
  const gx = Math.min(cols - 1, Math.max(0, u * cols - 0.5));
  const gy = Math.min(rows - 1, Math.max(0, v * rows - 0.5));
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const x1 = Math.min(cols - 1, x0 + 1);
  const y1 = Math.min(rows - 1, y0 + 1);
  const fx = gx - x0;
  const fy = gy - y0;
  const A = values[y0][x0];
  const B = values[y0][x1];
  const C = values[y1][x0];
  const D = values[y1][x1];
  return (A * (1 - fx) + B * fx) * (1 - fy) + (C * (1 - fx) + D * fx) * fy;
}

/** Inverse-distance weighting (power 2) over sparse points in footprint fractions. */
function sampleIdw(points: NonNullable<PpfdLayer["points"]>, u: number, v: number): number {
  let num = 0;
  let den = 0;
  for (const p of points) {
    const dx = u - p.x_frac;
    const dy = v - p.y_frac;
    const d2 = dx * dx + dy * dy;
    if (d2 < 1e-8) return p.value;
    const w = 1 / (d2 * d2);
    num += w * p.value;
    den += w;
  }
  return den > 0 ? num / den : 0;
}

export function resampleLayer(layer: PpfdLayer, nx = 24, ny = 24): Field {
  const { w, d } = layerFootprint(layer);
  const values = new Float64Array(nx * ny);
  const useGrid = !!layer.grid;
  const dense = useGrid ? { rows: layer.grid!.rows, cols: layer.grid!.cols, values: fillHoles(layer.grid!) } : null;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const u = (i + 0.5) / nx;
      const v = (j + 0.5) / ny;
      values[j * nx + i] = dense ? sampleGrid(dense, u, v) : layer.points?.length ? sampleIdw(layer.points, u, v) : 0;
    }
  }
  return {
    nx,
    ny,
    width_cm: w,
    depth_cm: d,
    values,
    derived: useGrid ? "bilinear" : "idw",
    estimated: false,
    height_cm: layer.conditions.height_cm,
    dim_pct: layer.conditions.dim_pct ?? 100,
    note: useGrid
      ? `${layer.grid!.rows}×${layer.grid!.cols} maker cells, bilinear between cell centres`
      : `${layer.points?.length ?? 0} maker readings, inverse-distance filled`,
  };
}

export function fieldStats(f: Field): FieldStats {
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  for (const v of f.values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  const n = f.values.length;
  const avg = n ? sum / n : 0;
  return { min: n ? min : 0, max: n ? max : 0, avg, uniformity: avg > 0 ? min / avg : 0, n };
}

function layerAvg(layer: PpfdLayer): number {
  if (layer.stats?.avg) return layer.stats.avg;
  const vals: number[] = [];
  for (const row of layer.grid?.values ?? []) for (const v of row) if (v != null) vals.push(v);
  for (const p of layer.points ?? []) vals.push(p.value);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

/**
 * Exponent k in v ∝ h^-k fitted across a record's measured heights (least
 * squares in log space). 2 = inverse square. With one layer there is nothing
 * to fit and 2 is returned with `fitted: false`.
 */
export function fitHeightExponent(layers: PpfdLayer[]): { k: number; fitted: boolean } {
  const pts = layers
    .filter((l) => l.conditions.height_cm > 0 && (l.conditions.dim_pct ?? 100) === 100)
    .map((l) => ({ x: Math.log(l.conditions.height_cm), y: Math.log(Math.max(1e-6, layerAvg(l))) }));
  const heights = new Set(pts.map((p) => p.x.toFixed(6)));
  if (heights.size < 2) return { k: 2, fitted: false };
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  let sxy = 0;
  let sxx = 0;
  for (const p of pts) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) * (p.x - mx);
  }
  const slope = sxx > 0 ? sxy / sxx : -2;
  const k = Math.max(0.2, Math.min(4, -slope));
  return { k, fitted: true };
}

/**
 * Field at an arbitrary hang height from a record's full-power layers. Exact
 * height → that layer. Between two layers → per-cell inverse-power blend.
 * Outside → nearest layer scaled by the fitted exponent (extrapolated).
 */
export function fieldAtHeight(layers: PpfdLayer[], height_cm: number, nx = 24, ny = 24): Field | null {
  const full = layers
    .filter((l) => (l.conditions.dim_pct ?? 100) === 100 && !l.conditions.mode && l.provenance?.status !== "rejected")
    .sort((a, b) => a.conditions.height_cm - b.conditions.height_cm);
  if (!full.length) return null;
  const exact = full.find((l) => Math.abs(l.conditions.height_cm - height_cm) < 0.05);
  if (exact) return resampleLayer(exact, nx, ny);
  const { k, fitted } = fitHeightExponent(full);
  const below = [...full].reverse().find((l) => l.conditions.height_cm < height_cm);
  const above = full.find((l) => l.conditions.height_cm > height_cm);

  if (below && above) {
    const fa = resampleLayer(below, nx, ny);
    const fb = resampleLayer(above, nx, ny);
    const ha = below.conditions.height_cm;
    const hb = above.conditions.height_cm;
    const out = new Float64Array(nx * ny);
    for (let i = 0; i < out.length; i++) {
      const va = fa.values[i];
      const vb = fb.values[i];
      if (va > 0 && vb > 0) {
        const kc = Math.log(va / vb) / Math.log(hb / ha);
        out[i] = va * Math.pow(ha / height_cm, kc);
      } else {
        const t = (height_cm - ha) / (hb - ha);
        out[i] = va + (vb - va) * t;
      }
    }
    return {
      ...fa,
      values: out,
      estimated: true,
      height_cm,
      note: `estimated: inverse-power blend between the maker's ${ha} cm and ${hb} cm layers`,
    };
  }
  // Beyond the measured range the footprint-average fit is not trustworthy: within
  // a small map the average falls slowly as light spreads, which cannot continue
  // once light leaves the footprint. Extrapolate with at least inverse square.
  const src = below ?? above!;
  const f = resampleLayer(src, nx, ny);
  const kx = Math.max(k, 2);
  const ratio = Math.pow(src.conditions.height_cm / height_cm, kx);
  const out = f.values.map((v) => v * ratio);
  return {
    ...f,
    values: out,
    estimated: true,
    height_cm,
    note: `estimated: extrapolated from the maker's ${src.conditions.height_cm} cm layer with h^-${kx.toFixed(2)}${fitted && k >= 2 ? " (fitted)" : " (inverse-square floor)"}`,
  };
}

export function scaleDim(field: Field, dim_pct: number): Field {
  const f = Math.max(0, Math.min(100, dim_pct)) / 100;
  if (f === 1) return field;
  return { ...field, values: field.values.map((v) => v * f), dim_pct, estimated: true, note: `${field.note}; dimmed to ${dim_pct}% linearly` };
}

export type Placement = { field: Field; x_cm: number; y_cm: number; label?: string };

/**
 * Sum fixture fields onto one canopy grid. `x_cm, y_cm` is where each fixture's
 * footprint centre sits in tent coordinates (origin top-left). Cells no fixture
 * covers stay 0 and are counted in `gapCells`.
 */
export function superpose(
  canopy: { width_cm: number; depth_cm: number; nx?: number; ny?: number },
  placements: Placement[],
): Field & { gapCells: number; coveredFraction: number } {
  const nx = canopy.nx ?? 32;
  const ny = canopy.ny ?? 32;
  const values = new Float64Array(nx * ny);
  const covered = new Uint8Array(nx * ny);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const cx = ((i + 0.5) / nx) * canopy.width_cm;
      const cy = ((j + 0.5) / ny) * canopy.depth_cm;
      for (const p of placements) {
        const u = (cx - (p.x_cm - p.field.width_cm / 2)) / p.field.width_cm;
        const v = (cy - (p.y_cm - p.field.depth_cm / 2)) / p.field.depth_cm;
        if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
        const fi = Math.min(p.field.nx - 1, Math.floor(u * p.field.nx));
        const fj = Math.min(p.field.ny - 1, Math.floor(v * p.field.ny));
        values[j * nx + i] += p.field.values[fj * p.field.nx + fi];
        covered[j * nx + i] = 1;
      }
    }
  }
  let gap = 0;
  for (const c of covered) if (!c) gap++;
  return {
    nx,
    ny,
    width_cm: canopy.width_cm,
    depth_cm: canopy.depth_cm,
    values,
    derived: "sum",
    estimated: placements.some((p) => p.field.estimated) || gap > 0,
    height_cm: placements[0]?.field.height_cm ?? 0,
    dim_pct: 100,
    note: `${placements.length} fixture(s) summed; ${gap} of ${nx * ny} canopy cells outside every maker map`,
    gapCells: gap,
    coveredFraction: 1 - gap / (nx * ny),
  };
}

/** Daily light integral, mol/m²/d, from a steady PPFD over the photoperiod. */
export function dliFromPpfd(ppfd: number, hours: number): number {
  return (ppfd * hours * 3600) / 1e6;
}
