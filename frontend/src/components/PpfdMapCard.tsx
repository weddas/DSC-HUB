import { useEffect, useMemo, useState } from "react";
import { Panel } from "./Panel";
import { StatusTag } from "./ui";
import {
  BANDS,
  fetchLightDetail,
  layerCells,
  layerLabel,
  provenanceLabel,
  rampColor,
  recordRange,
  textOn,
  wavelengthColor,
  type LightDetailResult,
  type LightRecord,
  type PpfdLayer,
  type Spectrum,
} from "../lib/lightCatalog";

type Tab = "map" | "spectrum" | "bands";

/**
 * Maker-published PPFD map, spectrum, and band shares for one catalog light,
 * read from the CannaLib lights store via the brain. Height / dimmer / mode
 * layers toggle on one fixed colour scale so they compare. Everything shown is
 * transcribed maker data with its provenance on the card — never a reading
 * from this tent (that is the calibration curve next door).
 */
export function PpfdMapCard({ catalogId, legend }: { catalogId: string; legend?: string }) {
  const [result, setResult] = useState<LightDetailResult | null>(null);
  const [tab, setTab] = useState<Tab>("map");
  const [layerId, setLayerId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    void fetchLightDetail(catalogId).then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [catalogId]);

  const record = result?.status === "ok" ? result.record : null;
  const layers = useMemo(() => (record?.ppfd_maps ?? []).filter((l) => l.provenance?.status !== "rejected"), [record]);
  const spectra = useMemo(() => (record?.spectra ?? []).filter((s) => s.provenance?.status !== "rejected"), [record]);
  const layer = layers.find((l) => l.id === layerId) ?? layers[0] ?? null;
  const range = useMemo(() => (record ? recordRange(record) : ([0, 1] as [number, number])), [record]);

  const title = legend ?? (record ? `${record.name.toUpperCase()} · MAKER PPFD MAP` : "MAKER PPFD MAP");

  return (
    <Panel legendIcon="par-meter" legend={title} className="dsc-ppfd-card">
      {result == null ? (
        <p className="dsc-panel-foot">Loading catalog record…</p>
      ) : result.status === "missing" ? (
        <p className="dsc-panel-foot">
          No CannaLib record for <code>{catalogId}</code> yet. Import the light in Kit › CannaLib and transcribe its map before this card can draw it.
        </p>
      ) : result.status === "unavailable" ? (
        <p className="dsc-panel-foot">CannaLib lights catalog unavailable — {result.detail}. Nothing is drawn from memory.</p>
      ) : !record ? null : (
        <>
          <div className="dsc-ppfd-head">
            <div className="dsc-chip-row dsc-ppfd-tabs" role="tablist" aria-label="Catalog views: map, spectrum, bands">
              {(
                [
                  ["map", `Map${layers.length ? ` · ${layers.length}` : ""}`],
                  ["spectrum", `Spectrum${spectra.length ? ` · ${spectra.length}` : ""}`],
                  ["bands", "Bands"],
                ] as Array<[Tab, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  className={`dsc-chip${tab === key ? " is-active" : ""}`}
                  onClick={() => setTab(key)}
                  disabled={(key === "map" && !layers.length) || (key !== "map" && !spectra.length)}
                >
                  {label}
                </button>
              ))}
            </div>
            <StatusTag {...provenanceLabel(tab === "map" ? layer?.provenance : spectra[0]?.provenance)} />
          </div>

          {tab === "map" && layer ? (
            <>
              {layers.length > 1 ? (
                <div className="dsc-chip-row dsc-ppfd-layers">
                  {layers.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className={`dsc-chip${l.id === layer.id ? " is-active" : ""}`}
                      onClick={() => setLayerId(l.id)}
                      title={l.provenance?.note ?? undefined}
                    >
                      {layerLabel(l)}
                    </button>
                  ))}
                </div>
              ) : null}
              <Heatmap layer={layer} range={range} />
              <LayerStats layer={layer} record={record} />
            </>
          ) : null}

          {tab === "spectrum" && spectra.length ? <SpectrumChart spectra={spectra} /> : null}
          {tab === "bands" && spectra.length ? <BandsRadar spectra={spectra} /> : null}

          <p className="dsc-panel-foot">
            Maker-published figures transcribed into the CannaLib lights catalog
            {record.provenance?.source_url ? " from the product page" : ""}. Not measured in this tent — the calibration curve is what the canopy actually gets.
            {layer?.provenance?.note ? ` ${layer.provenance.note}` : ""}
          </p>
        </>
      )}
    </Panel>
  );
}

function Heatmap({ layer, range }: { layer: PpfdLayer; range: [number, number] }) {
  const fp = layer.conditions.footprint;
  const w = fp.width_cm ?? 100;
  const d = fp.depth_cm ?? 100;
  const W = 1000;
  const H = Math.round((W * d) / w);
  const [lo, hi] = range;
  const t = (v: number) => (hi > lo ? (v - lo) / (hi - lo) : 0.5);
  const cells = layerCells(layer);
  const overlays = layer.grid ? layer.points ?? [] : [];
  const cols = layer.grid?.cols ?? Math.round(Math.sqrt(cells?.length ?? 16));
  const fontPx = Math.max(22, Math.min(46, Math.round(W / cols / 3.2)));

  return (
    <div className="dsc-ppfd-map">
      <svg viewBox={`0 0 ${W} ${H}`} className="dsc-ppfd-svg" role="img" aria-label={`PPFD map at ${layer.conditions.height_cm} cm`}>
        <rect x={0} y={0} width={W} height={H} className="dsc-ppfd-floor" />
        {cells
          ? cells.map((c, i) => {
              const fill = c.value == null ? "var(--dsc-gray-2)" : rampColor(t(c.value));
              return (
                <g key={i}>
                  <rect x={c.x * W + 2} y={c.y * H + 2} width={c.w * W - 4} height={c.h * H - 4} rx={8} fill={fill} />
                  <text
                    x={(c.x + c.w / 2) * W}
                    y={(c.y + c.h / 2) * H}
                    fontSize={fontPx}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={c.value == null ? "var(--dsc-gray-5)" : textOn(fill)}
                    className="dsc-ppfd-val"
                  >
                    {c.value == null ? "?" : Math.round(c.value)}
                  </text>
                </g>
              );
            })
          : (layer.points ?? []).map((p, i) => {
              const fill = rampColor(t(p.value));
              return (
                <g key={i}>
                  <circle cx={p.x_frac * W} cy={p.y_frac * H} r={p.role === "center" ? 34 : 26} fill={fill} stroke="var(--dsc-white)" strokeWidth={3} />
                  <text
                    x={Math.min(Math.max(p.x_frac * W, 60), W - 60)}
                    y={Math.min(Math.max(p.y_frac * H, 40), H - 40)}
                    fontSize={fontPx}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--dsc-white)"
                    className="dsc-ppfd-val dsc-ppfd-val--dot"
                  >
                    {Math.round(p.value)}
                  </text>
                </g>
              );
            })}
        {overlays.map((p, i) => {
          const fill = rampColor(t(p.value));
          return (
            <g key={`o${i}`}>
              <circle cx={p.x_frac * W} cy={p.y_frac * H} r={fontPx * 1.1} fill="var(--dsc-gray-1)" stroke={fill} strokeWidth={4} />
              <text x={p.x_frac * W} y={p.y_frac * H} fontSize={fontPx * 0.9} textAnchor="middle" dominantBaseline="central" fill="var(--dsc-white)" className="dsc-ppfd-val">
                {Math.round(p.value)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="dsc-ppfd-scale" aria-hidden="true">
        <span>{Math.round(lo)}</span>
        <div className="dsc-ppfd-scale-bar" style={{ background: `linear-gradient(90deg, ${[0, 0.2, 0.4, 0.6, 0.8, 1].map((x) => rampColor(x)).join(", ")})` }} />
        <span>{Math.round(hi)} µmol/m²/s</span>
      </div>
    </div>
  );
}

function LayerStats({ layer, record }: { layer: PpfdLayer; record: LightRecord }) {
  const st = layer.stats;
  const fp = layer.conditions.footprint;
  const watts = record.power?.wattage_w;
  return (
    <div className="dsc-ppfd-stats">
      <span>
        {fp.width_cm && fp.depth_cm ? `${fp.width_cm}×${fp.depth_cm} cm` : "footprint n/a"} at {layer.conditions.height_cm} cm
      </span>
      {st ? (
        <>
          <span>avg {Math.round(st.avg)}</span>
          <span>min {Math.round(st.min)} · max {Math.round(st.max)}</span>
          <span title="min ÷ avg">uniformity {st.uniformity.toFixed(2)}</span>
          <span>{st.n} readings</span>
        </>
      ) : null}
      {watts ? <span>{watts} W nameplate</span> : null}
    </div>
  );
}

function SpectrumChart({ spectra }: { spectra: Spectrum[] }) {
  const W = 1000;
  const H = 360;
  const padL = 40;
  const padB = 40;
  const nmLo = 380;
  const nmHi = 780;
  const x = (nm: number) => padL + ((nm - nmLo) / (nmHi - nmLo)) * (W - padL - 10);
  const y = (rel: number) => 10 + (1 - Math.max(0, Math.min(1, rel))) * (H - padB - 10);
  const stops = useMemo(() => [380, 420, 450, 480, 500, 530, 560, 590, 620, 650, 680, 720, 780].map((nm) => ({ nm, c: wavelengthColor(nm) })), []);
  return (
    <div className="dsc-ppfd-spectrum">
      <svg viewBox={`0 0 ${W} ${H}`} className="dsc-ppfd-svg" role="img" aria-label="Spectral power distribution">
        <defs>
          <linearGradient id="dsc-spd-grad" x1="0" x2="1" y1="0" y2="0">
            {stops.map((s) => (
              <stop key={s.nm} offset={`${((s.nm - nmLo) / (nmHi - nmLo)) * 100}%`} stopColor={s.c} />
            ))}
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={padL} x2={W - 10} y1={y(g)} y2={y(g)} className="dsc-ppfd-grid" />
        ))}
        {spectra.map((s, i) => {
          const pts = [...s.points].sort((a, b) => a.nm - b.nm).filter((p) => p.nm >= nmLo && p.nm <= nmHi);
          if (pts.length < 2) return null;
          const path = pts.map((p, k) => `${k ? "L" : "M"}${x(p.nm).toFixed(1)},${y(p.rel).toFixed(1)}`).join(" ");
          const area = `${path} L${x(pts[pts.length - 1].nm).toFixed(1)},${y(0)} L${x(pts[0].nm).toFixed(1)},${y(0)} Z`;
          return (
            <g key={s.mode + i}>
              {i === 0 ? <path d={area} fill="url(#dsc-spd-grad)" opacity={0.85} /> : null}
              <path d={path} fill="none" stroke={i === 0 ? "var(--dsc-white)" : "var(--dsc-teal)"} strokeWidth={i === 0 ? 3 : 2.5} strokeDasharray={i === 0 ? undefined : "8 6"} />
            </g>
          );
        })}
        {[400, 500, 600, 700, 780].map((nm) => (
          <g key={nm}>
            <line x1={x(nm)} x2={x(nm)} y1={y(0)} y2={y(0) + 8} className="dsc-ppfd-grid" />
            <text x={x(nm)} y={H - 10} fontSize={24} textAnchor="middle" className="dsc-ppfd-axis">
              {nm}
            </text>
          </g>
        ))}
        <text x={padL - 8} y={y(1)} fontSize={22} textAnchor="end" dominantBaseline="central" className="dsc-ppfd-axis">
          1.0
        </text>
        <text x={padL - 8} y={y(0.5)} fontSize={22} textAnchor="end" dominantBaseline="central" className="dsc-ppfd-axis">
          0.5
        </text>
      </svg>
      <div className="dsc-ppfd-stats">
        {spectra.map((s) => (
          <span key={s.mode}>
            {s.mode}
            {s.peaks_nm?.length ? ` · peaks ${s.peaks_nm.map((p) => Math.round(p)).join(" / ")} nm` : ""}
            {s.label ? ` · ${s.label}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function BandsRadar({ spectra }: { spectra: Spectrum[] }) {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const R = 150;
  const maxShare = Math.max(0.05, ...spectra.flatMap((s) => BANDS.map((b) => s.bands?.[b.key] ?? 0)));
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / BANDS.length;
  const pt = (i: number, r: number) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  const colors = ["var(--dsc-lamp, #ffb74d)", "var(--dsc-teal)", "var(--dsc-blue)"];
  return (
    <div className="dsc-ppfd-bands">
      <svg viewBox={`0 0 ${size} ${size}`} className="dsc-ppfd-svg dsc-ppfd-radar" role="img" aria-label="Spectral band shares">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f} points={BANDS.map((_, i) => pt(i, R * f).join(",")).join(" ")} className="dsc-ppfd-grid-poly" />
        ))}
        {BANDS.map((b, i) => {
          const [px, py] = pt(i, R);
          const [lx, ly] = pt(i, R + 26);
          return (
            <g key={b.key}>
              <line x1={cx} y1={cy} x2={px} y2={py} className="dsc-ppfd-grid" />
              <text x={lx} y={ly} fontSize={15} textAnchor="middle" dominantBaseline="central" className="dsc-ppfd-axis">
                {b.label}
              </text>
            </g>
          );
        })}
        {spectra.map((s, k) => (
          <polygon
            key={s.mode}
            points={BANDS.map((b, i) => pt(i, (R * (s.bands?.[b.key] ?? 0)) / maxShare).join(",")).join(" ")}
            fill={colors[k % colors.length]}
            fillOpacity={0.22}
            stroke={colors[k % colors.length]}
            strokeWidth={2.5}
          />
        ))}
      </svg>
      <div className="dsc-ppfd-stats dsc-ppfd-stats--col">
        {spectra.map((s) => (
          <span key={s.mode}>
            <strong>{s.mode}</strong>
            {BANDS.map((b) => ` · ${b.label} ${Math.round((s.bands?.[b.key] ?? 0) * 100)}%`).join("")}
            {s.metrics?.r_b_ratio != null ? ` · R:B ${s.metrics.r_b_ratio.toFixed(2)}` : ""}
            {s.metrics?.r_fr_ratio != null ? ` · R:FR ${s.metrics.r_fr_ratio.toFixed(1)}` : ""}
          </span>
        ))}
        <span className="dsc-muted">Share of the maker's curve in each band. Higher red-to-blue leans bloom; far red drives stretch and end-of-day; UV is resin-side.</span>
      </div>
    </div>
  );
}
