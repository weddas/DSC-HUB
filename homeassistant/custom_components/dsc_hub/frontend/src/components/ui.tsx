import type { CSSProperties, ReactNode } from "react";
import { iconUrl, type IconName } from "../icons";
import { useHass } from "../hooks/useHass";

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
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`dsc-card ${className}`.trim()} style={style}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

export function Button({
  children,
  primary,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className={`dsc-btn${primary ? " primary" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
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
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  tone?: "normal" | "ok" | "bad" | "muted";
}) {
  const toneClass =
    tone === "ok"
      ? "dsc-status-ok"
      : tone === "bad"
        ? "dsc-status-bad"
        : tone === "muted"
          ? "dsc-status-muted"
          : "";
  return (
    <Card title={label}>
      <div className={`dsc-kpi-value ${toneClass}`.trim()}>
        {value}
        {unit ? <span className="dsc-kpi-unit">{unit}</span> : null}
      </div>
      {sub ? <div className="dsc-kpi-sub">{sub}</div> : null}
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header style={{ marginBottom: 14 }}>
      <h1 className="dsc-page-title">{title}</h1>
      {subtitle ? <p className="dsc-muted" style={{ margin: 0 }}>{subtitle}</p> : null}
    </header>
  );
}

export function StatusChip({
  label,
  tone = "muted",
  pulse,
}: {
  label: string;
  tone?: "ok" | "bad" | "warn" | "muted";
  pulse?: boolean;
}) {
  return (
    <span className={`dsc-chip dsc-chip--${tone}${pulse ? " dsc-chip--pulse" : ""}`}>
      {label}
    </span>
  );
}

/** Pressable demand / override switch via HA callService. */
export function EntityToggle({
  entityId,
  label,
  warnWhenMissing,
}: {
  entityId: string;
  label: string;
  warnWhenMissing?: string;
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
    domain === "light" && on
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
      <span className="dsc-demand-label">{label}</span>
      <span className="dsc-demand-state">
        {!ok ? warnWhenMissing || "—" : brightness != null ? `${brightness}%` : on ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export function LinkChip({
  entityId,
  label,
}: {
  entityId: string;
  label: string;
}) {
  const { state, available } = useHass();
  const on = available(entityId) && state(entityId) === "on";
  return (
    <span className={`dsc-chip ${on ? "dsc-chip--ok dsc-chip--pulse" : "dsc-chip--muted"}`}>
      {label} {on ? "ESP" : "HA"}
    </span>
  );
}
