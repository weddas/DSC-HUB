import { useMemo, type CSSProperties, type ReactNode } from "react";

const FIELD_PX = 2000;
const DEFAULT_SPEED = 0.4;

/** Deterministic PRNG so the wash does not reshuffle on remount. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function generateBoxShadows(count: number, seed: number, color: string): string {
  const rand = mulberry32(seed);
  const parts: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = Math.floor(rand() * FIELD_PX);
    const y = Math.floor(rand() * FIELD_PX);
    parts.push(`${x}px ${y}px ${color}`);
  }
  return parts.join(", ");
}

export type ParallaxStarsProps = {
  /** Animation speed multiplier. Higher is faster. */
  speed?: number;
  className?: string;
};

/**
 * Decorative page wash — three box-shadow star layers + token radial atmosphere.
 * Not a live sensor viz. Title/hero overlay is intentionally omitted; operator
 * chrome (PageHeader, gauges) stays the content.
 */
export function ParallaxStars({
  speed = DEFAULT_SPEED,
  className = "",
}: ParallaxStarsProps) {
  const shadowsSmall = useMemo(
    () => generateBoxShadows(220, 0xdc501, "var(--dsc-stars-far)"),
    [],
  );
  const shadowsMedium = useMemo(
    () => generateBoxShadows(70, 0xdc502, "var(--dsc-stars-mid)"),
    [],
  );
  const shadowsBig = useMemo(
    () => generateBoxShadows(28, 0xdc503, "var(--dsc-stars-near)"),
    [],
  );

  const safeSpeed = Number.isFinite(speed) && speed > 0 ? speed : DEFAULT_SPEED;
  const style = { "--dsc-stars-speed": String(safeSpeed) } as CSSProperties;

  return (
    <div
      className={`dsc-stars${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      <div className="dsc-stars-atmosphere" />
      <div className="dsc-stars-layer dsc-stars-layer--sm" style={{ boxShadow: shadowsSmall }}>
        <div className="dsc-stars-echo" style={{ boxShadow: shadowsSmall }} />
      </div>
      <div className="dsc-stars-layer dsc-stars-layer--md" style={{ boxShadow: shadowsMedium }}>
        <div className="dsc-stars-echo" style={{ boxShadow: shadowsMedium }} />
      </div>
      <div className="dsc-stars-layer dsc-stars-layer--lg" style={{ boxShadow: shadowsBig }}>
        <div className="dsc-stars-echo" style={{ boxShadow: shadowsBig }} />
      </div>
    </div>
  );
}

/** Document mount: token wash + parallax stars behind operator chrome. */
export function DscRoot({ children }: { children: ReactNode }) {
  return (
    <div className="dsc-root">
      <ParallaxStars />
      <div className="dsc-root-body">{children}</div>
    </div>
  );
}

export default ParallaxStars;
