import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./ui";
import { PHASE_ICON } from "../lib/deviceIcons";
import type { IconName } from "../iconSvg";

export type PanelTone = "muted" | "teal" | "ok" | "warn" | "bad";

/**
 * Bordered rounded-square panel with the legend floating on its top border — the
 * v2 "reveal language" container (`ROOM · UMBRELLA LUNG · …`, `4×8 · EARLY FLOWERING · DAY 34`).
 * Tone colours the border and legend; `dashed` = out of service; `live` = the bad
 * condition is current (slow glow). Never nest glass inside; nest panels inside panels.
 */
export function Panel({
  legend,
  legendRight,
  tone = "muted",
  dashed,
  live,
  className = "",
  style,
  children,
  onLegendClick,
  legendTitle,
  legendIcon,
}: {
  legend?: ReactNode;
  /** Small set icon before the legend text (room, grow-tent, soil-probe, bell…). */
  legendIcon?: IconName;
  legendRight?: ReactNode;
  tone?: PanelTone;
  dashed?: boolean;
  live?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Makes the legend a button (e.g. open the owning desk). */
  onLegendClick?: () => void;
  legendTitle?: string;
}) {
  const cls = `dsc-panel dsc-panel--${tone}${dashed ? " is-dashed" : ""}${live ? " is-live" : ""}${className ? ` ${className}` : ""}`;
  return (
    <section className={cls} style={style}>
      {legend != null ? (
        onLegendClick ? (
          <button
            type="button"
            className="dsc-panel-legend is-clickable"
            onClick={onLegendClick}
            title={legendTitle}
            aria-label={typeof legend === "string" ? `${legend} — ${legendTitle ?? "open"}` : legendTitle}
          >
            {legendIcon ? <Icon name={legendIcon} size={11} className="dsc-panel-legend-icon" /> : null}
            {legend}
            <Icon name="chevron-right" size={10} className="dsc-panel-legend-chevron" />
          </button>
        ) : (
          <span className="dsc-panel-legend">
            {legendIcon ? <Icon name={legendIcon} size={11} className="dsc-panel-legend-icon" /> : null}
            {legend}
          </span>
        )
      ) : null}
      {legendRight != null ? <span className="dsc-panel-legend-right">{legendRight}</span> : null}
      {children}
    </section>
  );
}

export type PhaseKey = "veg" | "gen" | "bulk" | "finish" | "dry" | "cure";

const PHASE_LABEL: Record<PhaseKey, string> = {
  veg: "VEG",
  gen: "GEN",
  bulk: "BULK",
  finish: "FINISH",
  dry: "DRY",
  cure: "CURE",
};

/** One colour per phase, everywhere (frame 1o). */
export function PhaseChip({ phase, label, title }: { phase: PhaseKey; label?: string; title?: string }) {
  return (
    <span className={`dsc-phase dsc-phase--${phase}`} title={title}>
      <Icon name={PHASE_ICON[phase]} size={11} />
      {label ?? PHASE_LABEL[phase]}
    </span>
  );
}

export function phaseLabel(phase: PhaseKey): string {
  return PHASE_LABEL[phase];
}
