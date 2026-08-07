import type { CSSProperties, ReactNode } from "react";
import { iconUrl, type IconName } from "../icons";

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
}: {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={`dsc-btn${primary ? " primary" : ""}`}
      onClick={onClick}
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
