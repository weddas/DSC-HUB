/**
 * CannaLib lights catalog — the structured records behind the PPFD map card.
 *
 * Shape mirrors CannaLib `schemas/catalogs/light.schema.json`. Coordinates:
 * origin top-left of the footprint, x right, y down; grid rows top→bottom,
 * columns left→right; point positions are fractions of the footprint.
 * Everything here is maker-published data transcribed into the catalog, never a
 * measurement from this tent — the card says so.
 */

export type Provenance = {
  method: "text" | "pdf_text" | "vision_lmstudio" | "curve_trace" | "manual" | "derived";
  status: "unverified" | "verified" | "rejected";
  confidence?: number;
  model?: string | null;
  source_url?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  note?: string | null;
};

export type PpfdLayer = {
  id: string;
  conditions: {
    height_cm: number;
    footprint: { width_cm: number | null; depth_cm: number | null };
    dim_pct?: number;
    mode?: string | null;
  };
  unit: "umol_m2_s";
  layout: "grid" | "points" | "grid_and_points";
  grid?: { rows: number; cols: number; values: Array<Array<number | null>> };
  points?: Array<{ x_frac: number; y_frac: number; value: number; role?: string | null }>;
  stats?: { min: number; max: number; avg: number; uniformity: number; n: number };
  provenance: Provenance;
};

export type Spectrum = {
  kind: "emission" | "par_response";
  mode: string;
  label?: string | null;
  points: Array<{ nm: number; rel: number }>;
  range_nm?: [number, number];
  peaks_nm?: number[];
  bands?: Partial<Record<BandKey, number>>;
  metrics?: { r_b_ratio?: number | null; r_fr_ratio?: number | null; par_fraction?: number | null };
  provenance: Provenance;
};

export type LightRecord = {
  id: string;
  name: string;
  brand: string;
  model?: string | null;
  power?: { wattage_w?: number | null; ppf_umol_s?: number | null; efficacy_umol_j?: number | null };
  control?: {
    dsc_path?: string | null;
    paths?: Array<{ kind: string; name?: string | null; overrides_dsc: boolean; note?: string | null }>;
  };
  ppfd_maps?: PpfdLayer[];
  spectra?: Spectrum[];
  provenance: Provenance;
};

export type BandKey = "uv_380_400" | "blue_400_500" | "green_500_600" | "red_600_700" | "far_red_700_780";

export const BANDS: Array<{ key: BandKey; label: string; nm: [number, number] }> = [
  { key: "uv_380_400", label: "UV", nm: [380, 400] },
  { key: "blue_400_500", label: "Blue", nm: [400, 500] },
  { key: "green_500_600", label: "Green", nm: [500, 600] },
  { key: "red_600_700", label: "Red", nm: [600, 700] },
  { key: "far_red_700_780", label: "Far red", nm: [700, 780] },
];

export type LightDetailResult =
  | { status: "ok"; record: LightRecord }
  | { status: "missing" }
  | { status: "unavailable"; detail: string };

/** Same-origin on the Pi SPA: the brain proxies to CannaLib's lights store. */
export async function fetchLightDetail(catalogId: string): Promise<LightDetailResult> {
  const id = encodeURIComponent(catalogId.trim());
  if (!id) return { status: "missing" };
  try {
    const r = await fetch(`/v1/catalogs/lights/${id}`, { cache: "no-store" });
    if (r.status === 404) return { status: "missing" };
    if (!r.ok) {
      let detail = `${r.status}`;
      try {
        const body = (await r.json()) as { detail?: string };
        if (body?.detail) detail = String(body.detail);
      } catch {
        /* keep status */
      }
      return { status: "unavailable", detail };
    }
    const record = (await r.json()) as LightRecord;
    if (!record || !record.id) return { status: "missing" };
    return { status: "ok", record };
  } catch (err) {
    return { status: "unavailable", detail: err instanceof Error ? err.message : "fetch failed" };
  }
}

/** Fixed per-light range so toggling heights stays comparable (plan rule). */
export function recordRange(rec: LightRecord): [number, number] {
  const vals: number[] = [];
  for (const layer of rec.ppfd_maps ?? []) {
    for (const row of layer.grid?.values ?? []) for (const v of row) if (v != null) vals.push(v);
    for (const p of layer.points ?? []) vals.push(p.value);
  }
  if (!vals.length) return [0, 1];
  return [Math.min(...vals), Math.max(...vals)];
}

/** Navy → purple → magenta → orange → yellow, matching the makers' own maps. */
const RAMP: Array<[number, number, number]> = [
  [15, 10, 60],
  [80, 20, 120],
  [170, 40, 110],
  [230, 90, 60],
  [250, 170, 40],
  [255, 240, 120],
];

export function rampColor(t: number): string {
  const c = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const pos = c * (RAMP.length - 1);
  const i = Math.min(Math.floor(pos), RAMP.length - 2);
  const f = pos - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  const mix = (k: number) => Math.round(a[k] + (b[k] - a[k]) * f);
  return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`;
}

export function textOn(bg: string): string {
  const m = bg.match(/\d+/g);
  if (!m) return "var(--dsc-white)";
  const [r, g, b] = m.map(Number);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? "var(--dsc-gray-1)" : "var(--dsc-white)";
}

export type HeatCell = { x: number; y: number; w: number; h: number; value: number | null; role?: string | null };

/** Cluster positions within `gap` into levels (same rule as CannaLib's snap). */
function levels(vals: number[], gap = 0.06): number[] {
  const sorted = [...vals].sort((a, b) => a - b);
  const groups: number[][] = [];
  for (const v of sorted) {
    const g = groups[groups.length - 1];
    if (g && v - g[g.length - 1] <= gap) g.push(v);
    else groups.push([v]);
  }
  return groups.map((g) => g.reduce((a, b) => a + b, 0) / g.length);
}

/**
 * Cells to paint for a layer. Grids map 1:1. Point layers whose points sit on a
 * regular lattice (corners / edge midpoints / inner square / centre, like the
 * Spider Farmer maps) become cells centred on the lattice; irregular point
 * layers return null so the caller draws dots instead.
 */
export function layerCells(layer: PpfdLayer): HeatCell[] | null {
  if (layer.grid) {
    const { rows, cols, values } = layer.grid;
    const out: HeatCell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({ x: c / cols, y: r / rows, w: 1 / cols, h: 1 / rows, value: values[r]?.[c] ?? null });
      }
    }
    return out;
  }
  const pts = layer.points ?? [];
  if (pts.length < 4) return null;
  const xl = levels(pts.map((p) => p.x_frac));
  const yl = levels(pts.map((p) => p.y_frac));
  if (xl.length < 2 || yl.length < 2 || xl.length > 9 || yl.length > 9) return null;
  const onLattice = pts.every(
    (p) => xl.some((x) => Math.abs(x - p.x_frac) <= 0.06) && yl.some((y) => Math.abs(y - p.y_frac) <= 0.06),
  );
  if (!onLattice) return null;
  const cw = 1 / (xl.length - 1);
  const ch = 1 / (yl.length - 1);
  return pts.map((p) => {
    const x0 = Math.max(0, p.x_frac - cw / 2);
    const y0 = Math.max(0, p.y_frac - ch / 2);
    return {
      x: x0,
      y: y0,
      w: Math.min(1, p.x_frac + cw / 2) - x0,
      h: Math.min(1, p.y_frac + ch / 2) - y0,
      value: p.value,
      role: p.role,
    };
  });
}

/** Approximate visible-spectrum colour for a wavelength (chart fill only). */
export function wavelengthColor(nm: number): string {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 380) {
    r = 0.4;
    b = 0.6;
  } else if (nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else if (nm <= 780) {
    r = 1;
  } else {
    r = 0.6;
  }
  const fade = nm > 700 ? Math.max(0.3, 1 - (nm - 700) / 120) : nm < 420 ? Math.max(0.3, 0.3 + (nm - 380) / 60) : 1;
  const ch = (v: number) => Math.round(255 * Math.max(0, Math.min(1, v)) * fade);
  return `rgb(${ch(r)}, ${ch(g)}, ${ch(b)})`;
}

export function layerLabel(layer: PpfdLayer): string {
  const c = layer.conditions;
  const bits = [`${c.height_cm} cm`];
  if (c.dim_pct != null && c.dim_pct !== 100) bits.push(`${c.dim_pct}%`);
  if (c.mode) bits.push(c.mode);
  return bits.join(" · ");
}

export function provenanceLabel(p: Provenance | undefined): { label: string; tone: "ok" | "warn" | "bad" | "muted" } {
  if (!p) return { label: "NO PROVENANCE", tone: "bad" };
  const method =
    p.method === "vision_lmstudio" ? "vision read" : p.method === "curve_trace" ? "curve trace" : p.method === "manual" ? "hand transcribed" : p.method;
  if (p.status === "verified") return { label: `VERIFIED · ${method}${p.verified_by ? ` · ${p.verified_by}` : ""}`, tone: "ok" };
  if (p.status === "rejected") return { label: `REJECTED · ${method}`, tone: "bad" };
  return { label: `UNVERIFIED · ${method}`, tone: "warn" };
}
