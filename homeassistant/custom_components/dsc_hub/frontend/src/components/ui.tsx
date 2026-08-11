import type { CSSProperties, ReactNode } from "react";
import { iconUrl, type IconName } from "../icons";
import { useHass } from "../hooks/useHass";

export type { IconName };

export function Icon({
  name,
  size = 16,
  className,
  color = "currentColor",
}: {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={className}
      role="img"
      aria-hidden
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${iconUrl(name)})`,
        maskImage: `url(${iconUrl(name)})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        flexShrink: 0,
      }}
    />
  );
}

export function Card({
  title,
  children,
  className = "",
  style,
  icon,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  icon?: IconName;
}) {
  return (
    <section className={`dsc-card ${className}`.trim()} style={style}>
      {title ? (
        <h3 className="dsc-card-title">
          {icon ? <Icon name={icon} size={14} color="var(--dsc-teal)" /> : null}
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  );
}

export function Button({
  children,
  primary,
  teal,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  primary?: boolean;
  teal?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = ["dsc-btn"];
  if (primary) cls.push("primary");
  if (teal) cls.push("teal");
  return (
    <button type={type} className={cls.join(" ")} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Kpi({
  label,
  value,
  unit,
  sub,
  tone = "normal",
  stale,
  onClick,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  tone?: "normal" | "ok" | "bad" | "muted";
  stale?: boolean;
  onClick?: () => void;
}) {
  const toneClass =
    tone === "ok"
      ? "dsc-status-ok"
      : tone === "bad"
        ? "dsc-status-bad"
        : tone === "muted" || stale
          ? "dsc-status-muted"
          : "";
  const body = (
    <>
      <div className={`dsc-kpi-value ${toneClass}`.trim()}>
        {value}
        {unit ? <span className="dsc-kpi-unit">{unit}</span> : null}
        {stale ? <span className="dsc-held-tag">HELD</span> : null}
      </div>
      {sub ? <div className="dsc-kpi-sub">{sub}</div> : null}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className="dsc-kpi-hit" onClick={onClick} title={`History · ${label}`}>
        <Card title={label} className={stale ? "is-stale" : undefined}>
          {body}
        </Card>
      </button>
    );
  }
  return (
    <Card title={label} className={stale ? "is-stale" : undefined}>
      {body}
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon,
  primaryAction,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Primary CTA rendered ahead of overflow/actions. */
  primaryAction?: ReactNode;
  actions?: ReactNode;
}) {
  const trailing = primaryAction || actions ? (
    <div className="dsc-page-header-actions">
      {primaryAction}
      {actions}
    </div>
  ) : null;

  return (
    <header className="dsc-page-header">
      <div className="dsc-page-header-main">
        {icon ? <Icon name={icon} size={22} color="var(--dsc-teal)" /> : null}
        <div>
          <h1 className="dsc-page-title">{title}</h1>
          {subtitle ? <p className="dsc-muted" style={{ margin: 0 }}>{subtitle}</p> : null}
        </div>
      </div>
      {trailing}
    </header>
  );
}

export function StatusChip({
  label,
  tone = "muted",
  pulse,
  icon,
}: {
  label: string;
  tone?: "ok" | "bad" | "warn" | "muted";
  pulse?: boolean;
  icon?: IconName;
}) {
  return (
    <span className={`dsc-chip dsc-chip--${tone}${pulse ? " dsc-chip--pulse" : ""}`}>
      {icon ? <Icon name={icon} size={11} /> : null}
      {label}
    </span>
  );
}

/** Pressable demand / override switch via HA callService. */
export function EntityToggle({
  entityId,
  label,
  warnWhenMissing,
  icon,
  showBrightness,
}: {
  entityId: string;
  label: string;
  warnWhenMissing?: string;
  icon?: IconName;
  showBrightness?: boolean;
}) {
  const { state, available, callService, entity } = useHass();
  const on = state(entityId, "off") === "on";
  const ok = available(entityId);
  const domain = entityId.split(".")[0];

  const toggle = () => {
    if (!ok) return;
    if (domain === "switch" || domain === "input_boolean") {
      void callService("homeassistant", "toggle", { entity_id: entityId });
      return;
    }
    if (domain === "light") {
      void callService("light", on ? "turn_off" : "turn_on", { entity_id: entityId });
    }
  };

  const brightness =
    (showBrightness !== false) && domain === "light" && on
      ? Math.round((Number(entity(entityId)?.attributes?.brightness ?? 0) / 255) * 100)
      : null;

  return (
    <button
      type="button"
      className={`dsc-demand${on ? " is-on" : ""}${!ok ? " is-missing" : ""}`}
      onClick={toggle}
      disabled={!ok && !warnWhenMissing}
      title={ok ? entityId : warnWhenMissing || `${entityId} unavailable`}
    >
      {icon ? <Icon name={icon} size={14} className="dsc-demand-icon" /> : null}
      <span className="dsc-demand-label">{label}</span>
      <span className="dsc-demand-state">
        {!ok ? warnWhenMissing || "—" : brightness != null ? `${brightness}%` : on ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export function EntitySelect({
  entityId,
  label,
  icon,
}: {
  entityId: string;
  label: string;
  icon?: IconName;
}) {
  const { state, available, callService, entity } = useHass();
  const ok = available(entityId);
  const current = state(entityId, "");
  const options = (entity(entityId)?.attributes?.options as string[] | undefined) || [];
  const domain = entityId.split(".")[0];

  const onChange = (value: string) => {
    if (!ok || !value) return;
    if (domain === "select") {
      void callService("select", "select_option", { entity_id: entityId, option: value });
    } else if (domain === "input_select") {
      void callService("input_select", "select_option", { entity_id: entityId, option: value });
    }
  };

  return (
    <label className={`dsc-entity-select${!ok ? " is-disabled" : ""}`}>
      <span className="dsc-entity-select-label">
        {icon ? <Icon name={icon} size={13} color="var(--dsc-teal)" /> : null}
        {label}
      </span>
      <select value={current} disabled={!ok} onChange={(e) => onChange(e.target.value)}>
        {!options.includes(current) && current ? (
          <option value={current}>{current}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EntityFanSlider({
  entityId,
  label,
  disabled,
}: {
  entityId: string;
  label: string;
  disabled?: boolean;
}) {
  const { available, callService, entity, state } = useHass();
  const ok = available(entityId);
  const pct = Number(entity(entityId)?.attributes?.percentage ?? 0);
  const isOn = state(entityId) === "on";
  const locked = disabled || !ok;

  const setPct = (value: number) => {
    if (locked) return;
    void callService("fan", "set_percentage", { entity_id: entityId, percentage: value });
  };

  return (
    <label className={`dsc-fan-slider${locked ? " is-disabled" : ""}`}>
      <span className="dsc-fan-slider-label">
        {label}
        <strong>{ok ? `${Math.round(pct)}%` : "—"}</strong>
        {!isOn && ok ? <em className="dsc-muted">off</em> : null}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Number.isFinite(pct) ? pct : 0}
        disabled={locked}
        onChange={(e) => setPct(Number(e.target.value))}
      />
    </label>
  );
}

export function LinkChip({
  entityId,
  label,
  icon,
}: {
  entityId: string;
  label: string;
  icon?: IconName;
}) {
  const { state, available } = useHass();
  const on = available(entityId) && state(entityId) === "on";
  return (
    <span className={`dsc-chip ${on ? "dsc-chip--ok dsc-chip--pulse" : "dsc-chip--muted"}`}>
      {icon ? <Icon name={icon} size={11} /> : null}
      {label} {on ? "ESP" : "HA"}
    </span>
  );
}
