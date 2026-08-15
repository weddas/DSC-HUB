import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { iconSvg, type IconName } from "../icons";
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
      className={`dsc-icon${className ? ` ${className}` : ""}`}
      role="img"
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color,
        flexShrink: 0,
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: iconSvg(name) }}
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
      {icon ? <Icon name={icon} size={22} color="var(--dsc-teal)" className="dsc-demand-icon" /> : null}
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
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(current);

  useEffect(() => {
    if (!open) setDraft(current);
  }, [current, open]);

  const onChange = (value: string) => {
    setDraft(value);
    setOpen(false);
    if (!ok || !value) return;
    if (domain === "select") {
      void callService("select", "select_option", { entity_id: entityId, option: value });
    } else if (domain === "input_select") {
      void callService("input_select", "select_option", { entity_id: entityId, option: value });
    }
  };

  const shown = open ? draft : current;

  return (
    <label className={`dsc-entity-select${!ok ? " is-disabled" : ""}`}>
      <span className="dsc-entity-select-label">
        {icon ? <Icon name={icon} size={13} color="var(--dsc-teal)" /> : null}
        {label}
      </span>
      <select
        value={shown}
        disabled={!ok}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => onChange(e.target.value)}
      >
        {!options.includes(shown) && shown ? (
          <option value={shown}>{shown}</option>
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
  const [dragging, setDragging] = useState(false);
  const [draft, setDraft] = useState(Number.isFinite(pct) ? pct : 0);

  useEffect(() => {
    if (!dragging && Number.isFinite(pct)) setDraft(pct);
  }, [pct, dragging]);

  const commit = (value: number) => {
    if (locked) return;
    void callService("fan", "set_percentage", { entity_id: entityId, percentage: value });
  };

  const shown = dragging ? draft : Number.isFinite(pct) ? pct : 0;

  return (
    <label className={`dsc-fan-slider${locked ? " is-disabled" : ""}`}>
      <span className="dsc-fan-slider-label">
        {label}
        <strong>{ok ? `${Math.round(shown)}%` : "—"}</strong>
        {!isOn && ok ? <em className="dsc-muted">off</em> : null}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={shown}
        disabled={locked}
        onPointerDown={(e) => {
          (e.target as HTMLInputElement).setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        onPointerUp={(e) => {
          setDragging(false);
          commit(Number((e.target as HTMLInputElement).value));
        }}
        onPointerCancel={() => setDragging(false)}
        onLostPointerCapture={() => setDragging(false)}
        onChange={(e) => {
          const value = Number(e.target.value);
          setDraft(value);
          if (!dragging) commit(value);
        }}
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

function liveText(raw: string): string {
  return !raw || raw === "unknown" || raw === "unavailable" ? "" : raw;
}

/** Local draft while focused; commit on blur. Does not fight climate ticks. */
export function EntityText({
  entityId,
  label,
  multiline = false,
  rows = 2,
}: {
  entityId: string;
  label: string;
  multiline?: boolean;
  rows?: number;
}) {
  const { available, callService, state } = useHass();
  const ok = available(entityId);
  const clean = liveText(state(entityId, ""));
  const [draft, setDraft] = useState(clean);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(clean);
  }, [clean]);

  const commit = () => {
    if (!ok) return;
    void callService("input_text", "set_value", { entity_id: entityId, value: draft });
  };

  const bind = {
    value: draft,
    disabled: !ok,
    onFocus: () => {
      focused.current = true;
    },
    onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
    onBlur: () => {
      focused.current = false;
      commit();
    },
    onKeyDown: (e: { key: string; currentTarget: HTMLElement }) => {
      if (e.key === "Enter" && !multiline) e.currentTarget.blur();
    },
  };

  return (
    <label className={`dsc-target-num${!ok ? " is-disabled" : ""}`}>
      <span className="dsc-target-num-label">{label}</span>
      {multiline ? <textarea rows={rows} {...bind} /> : <input type="text" {...bind} />}
    </label>
  );
}

function timeToInput(raw: string): string {
  const s = liveText(raw);
  if (!s) return "";
  return s.slice(0, 5);
}

function timeToService(hhmm: string): string {
  if (!hhmm) return "00:00:00";
  return hhmm.length === 5 ? `${hhmm}:00` : hhmm;
}

/** Local draft for `time.*` helpers. Writes `time.set_value`. */
export function EntityTime({ entityId, label }: { entityId: string; label: string }) {
  const { available, callService, state } = useHass();
  const ok = available(entityId);
  const live = timeToInput(state(entityId, ""));
  const [draft, setDraft] = useState(live);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(live);
  }, [live]);

  const commit = () => {
    if (!ok || !draft) return;
    void callService("time", "set_value", { entity_id: entityId, time: timeToService(draft) });
  };

  return (
    <label className={`dsc-target-num${!ok ? " is-disabled" : ""}`}>
      <span className="dsc-target-num-label">{label}</span>
      <input
        type="time"
        value={draft}
        disabled={!ok}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false;
          commit();
        }}
      />
    </label>
  );
}
