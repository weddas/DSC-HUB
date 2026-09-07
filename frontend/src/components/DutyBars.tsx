import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useEntityBus } from "../hooks/useEntityBus";
import { resolveCfm } from "../lib/cfmProvenance";
import { paths } from "../lib/paths";
import { Icon } from "./ui";
import { Tooltip, TipRow } from "./Tooltip";
import { fanPctChip, SHARED_AIR_FAN_PCT } from "../lib/fanPlant";

/** Spin period from duty: 10 % → slow, 100 % → 0.3 s. Stopped at 0 / offline. */
export function fanSpinSeconds(pct: number): number | null {
  if (!Number.isFinite(pct) || pct <= 0) return null;
  return Math.max(0.3, 2.2 - (Math.min(100, pct) / 100) * 1.9);
}

export function FanGlyph({ pct, size = 14 }: { pct: number; size?: number }) {
  const secs = fanSpinSeconds(pct);
  return (
    <span
      className={`dsc-fan-glyph${secs != null ? " is-spinning" : ""}`}
      style={secs != null ? ({ "--dsc-fan-dur": `${secs.toFixed(2)}s` } as CSSProperties) : undefined}
      aria-hidden="true"
    >
      <Icon name="fan" size={size} />
    </span>
  );
}

/**
 * The lung, in percentages — intake and exhaust duties per tent and per room as 4px
 * bars with a fan glyph spinning at duty. Footer carries the learned exhaust CFM.
 */
export function DutyBars() {
  const bus = useEntityBus();
  const navigate = useNavigate();
  const out = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: bus.available,
    num: bus.num,
  });
  const cfmText = Number.isFinite(out.value)
    ? `${Math.round(out.value)} CFM ${out.kind === "allocated" ? "learned" : out.kind}`
    : "CFM not learned yet";
  return (
    <div className="dsc-duty-bars">
      <div className="dsc-duty-grid">
        {SHARED_AIR_FAN_PCT.map(({ label, id }) => {
          const { live, pct } = fanPctChip(bus, id);
          const width = live ? Math.max(0, Math.min(100, pct)) : 0;
          const isOut = id.includes("exhaust_outside");
          return (
            <Tooltip
              key={id}
              content={
                <>
                  <TipRow k={label} v={live ? `${pct} % duty` : "no reading"} tone={live ? undefined : "muted"} />
                  {isOut ? <TipRow k="exhaust" v={cfmText} tone={Number.isFinite(out.value) ? undefined : "muted"} /> : null}
                  <TipRow k="spin" v={live && pct > 0 && fanSpinSeconds(pct) != null ? `${fanSpinSeconds(pct)!.toFixed(2)} s / rev · by duty` : "stopped"} tone="muted" />
                  <TipRow k="measured" v={id} tone="muted" />
                </>
              }
            >
            <button
              type="button"
              className={`dsc-duty-row${live ? "" : " is-muted"}`}
              onClick={() => navigate(paths.climate())}
              aria-label={`${label} ${live ? `${pct} percent duty` : "no reading"} — open Climate`}
            >
              <span className="dsc-duty-label">
                <FanGlyph pct={live ? pct : NaN} />
                {label}
              </span>
              <span className="dsc-duty-track">
                <span className="dsc-duty-fill" style={{ width: `${width}%` }} />
              </span>
              <span className="dsc-duty-pct">{live ? `${pct}%` : "—"}</span>
            </button>
            </Tooltip>
          );
        })}
      </div>
      <p className="dsc-panel-foot">Intake and exhaust, per tent and per room · {cfmText}</p>
    </div>
  );
}
