import { useEntityBus } from "../hooks/useEntityBus";
import {
  materialStroke,
  type VesselSilhouette,
  type VesselSpec,
} from "../lib/vesselSpec";
import type { SoilLayer } from "./chrome";

const LAYER_FALLBACK = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)",
];

function silhouettePath(kind: VesselSilhouette): string {
  switch (kind) {
    case "bag":
      return "M18 8 Q18 4 32 4 L68 4 Q82 4 82 8 L86 88 Q86 96 50 96 Q14 96 14 88 Z";
    case "taper":
      return "M24 6 L76 6 L88 92 Q88 98 50 98 Q12 98 12 92 Z";
    case "tall":
      return "M28 4 L72 4 L78 94 Q78 98 50 98 Q22 98 22 94 Z";
    case "airpot":
      return "M26 6 L74 6 L84 90 Q84 96 50 96 Q16 96 16 90 Z";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function VesselGlyph({
  spec,
  layers = [],
  size = 56,
  label,
}: {
  spec: VesselSpec;
  layers?: SoilLayer[];
  size?: number;
  label?: boolean;
}) {
  const clipId = `vclip-${spec.id}-${spec.silhouette}`;
  const sum = layers.reduce((a, l) => a + l.pct, 0) || 1;
  let cursor = 0;
  return (
    <span className="dsc-vessel-glyph" title={spec.label}>
      <svg width={size} height={size * 1.15} viewBox="0 0 100 100" aria-hidden>
        <defs>
          <clipPath id={clipId}>
            <path d={silhouettePath(spec.silhouette)} />
          </clipPath>
        </defs>
        <path
          d={silhouettePath(spec.silhouette)}
          fill="rgba(8,12,10,0.85)"
          stroke={materialStroke(spec.material)}
          strokeWidth="2.4"
          strokeDasharray={spec.silhouette === "airpot" ? "5 3" : undefined}
        />
        <g clipPath={`url(#${clipId})`}>
          {layers.map((layer, i) => {
            const h = (layer.pct / sum) * 88;
            const y = 96 - cursor - h;
            cursor += h;
            return (
              <rect
                key={`${layer.name}-${i}`}
                x="12"
                y={y}
                width="76"
                height={h}
                fill={layer.color || LAYER_FALLBACK[i % LAYER_FALLBACK.length]}
              />
            );
          })}
        </g>
      </svg>
      {label ? <span className="dsc-vessel-glyph-label">{spec.volumeL}L</span> : null}
    </span>
  );
}

export function VesselSelect({
  pot,
  onPicked,
}: {
  pot: number;
  onPicked?: () => void;
}) {
  const { available, callService, entity, state } = useEntityBus();
  const id = `input_select.dsc_pot${pot}_vessel`;
  const ok = available(id);
  const options = (entity(id)?.attributes?.options as string[] | undefined) || [];
  const current = state(id, "");
  if (!ok && !options.length) {
    return <span className="dsc-muted">No vessel recorded — showing the default 20 L fabric pot.</span>;
  }
  return (
    <label className="dsc-entity-select">
      <span className="dsc-entity-select-label">Vessel</span>
      <select
        value={current}
        disabled={!ok}
        onChange={(e) => {
          void callService("input_select", "select_option", { entity_id: id, option: e.target.value });
          onPicked?.();
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
