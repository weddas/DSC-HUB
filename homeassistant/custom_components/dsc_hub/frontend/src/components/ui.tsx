import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { iconSvg, type IconName } from "../icons";
import { useHass } from "../hooks/useHass";
import { useFleetActions } from "../hooks/useFleetActions";
import { useFleetEntity } from "../hooks/useFleetEntity";

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
  tone?: "normal" | "ok" | "warn" | "bad" | "muted";
  stale?: boolean;
  onClick?: () => void;
}) {
  const toneClass = (() => {
    switch (tone) {
      case "ok":
        return "dsc-status-ok";
      case "warn":
        return "dsc-status-warn";
      case "bad":
        return "dsc-status-bad";
      case "muted":
        return "dsc-status-muted";
      case "normal":
        return stale ? "dsc-status-muted" : "";
      default: {
        const _exhaustive: never = tone;
        return _exhaustive;
      }
    }
  })();
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
  onClick,
}: {
  label: string;
  tone?: "ok" | "bad" | "warn" | "muted";
  pulse?: boolean;
  icon?: IconName;
  onClick?: () => void;
}) {
  const cls = `dsc-chip dsc-chip--${tone}${pulse ? " dsc-chip--pulse" : ""}`;
  if (onClick) {
    return (
      <button type="button" className={`${cls} is-clickable`} onClick={onClick}>
        {icon ? <Icon name={icon} size={11} /> : null}
        {label}
      </button>
    );
  }
  return (
    <span className={cls}>
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
  const { state, available, attributes } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const on = state === "on";
  const ok = available;
  const domain = entityId.split(".")[0];

  const toggle = () => {
    if (!ok) return;
    if (domain === "switch" || domain === "input_boolean") {
      void callService(domain, on ? "turn_off" : "turn_on", { entity_id: entityId });
      return;
    }
    if (domain === "light") {
      void callService("light", on ? "turn_off" : "turn_on", { entity_id: entityId });
    }
  };

  const brightness =
    (showBrightness !== false) && domain === "light" && on
      ? Math.round((Number(attributes?.brightness ?? 0) / 255) * 100)
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
  const { state, available, attributes } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const ok = available;
  const current = state;
  const options = (attributes?.options as string[] | undefined) || [];
  const domain = entityId.split(".")[0];
  const [open, setOpen] = useState(false);
  const interacting = useRef(false);
  const [draft, setDraft] = useState(current);

  useEffect(() => {
    if (!interacting.current && !open) setDraft(current);
  }, [current, open, entityId]);

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
        onFocus={() => {
          interacting.current = true;
          setOpen(true);
        }}
        onBlur={() => {
          interacting.current = false;
          setOpen(false);
        }}
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
  const { available, attributes, state: fanState } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const ok = available;
  const pct = Number(attributes?.percentage ?? 0);
  const isOn = fanState === "on";
  const locked = disabled || !ok;
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const [draft, setDraft] = useState(Number.isFinite(pct) ? pct : 0);

  useEffect(() => {
    if (!draggingRef.current && !dragging && Number.isFinite(pct)) setDraft(pct);
  }, [pct, dragging, entityId]);

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
          draggingRef.current = true;
          setDragging(true);
        }}
        onPointerUp={(e) => {
          draggingRef.current = false;
          setDragging(false);
          commit(Number((e.target as HTMLInputElement).value));
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
          setDragging(false);
        }}
        onLostPointerCapture={() => {
          draggingRef.current = false;
          setDragging(false);
        }}
        onChange={(e) => {
          const value = Number(e.target.value);
          setDraft(value);
          if (!draggingRef.current) commit(value);
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
  const { available, state } = useHass();
  const { callService } = useFleetActions();
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
  const { available, state } = useHass();
  const { callService } = useFleetActions();
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

/** Local draft for `input_datetime.*`. Date-only unless the helper has a time. */
export function EntityDatetime({ entityId, label }: { entityId: string; label: string }) {
  const { available, entity, state } = useHass();
  const { callService } = useFleetActions();
  const ok = available(entityId);
  const hasTime = Boolean(entity(entityId)?.attributes?.has_time);
  const live = liveText(state(entityId, ""));
  const toInput = (raw: string) => {
    if (!raw) return "";
    return hasTime ? raw.slice(0, 16).replace(" ", "T") : raw.slice(0, 10);
  };
  const [draft, setDraft] = useState(toInput(live));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(toInput(live));
  }, [live, hasTime]);

  const commit = () => {
    if (!ok || !draft) return;
    const value = hasTime ? draft.replace("T", " ") : draft;
    if (hasTime) {
      void callService("input_datetime", "set_datetime", { entity_id: entityId, datetime: value });
    } else {
      void callService("input_datetime", "set_datetime", { entity_id: entityId, date: draft });
    }
  };

  return (
    <label className={`dsc-target-num${!ok ? " is-disabled" : ""}`}>
      <span className="dsc-target-num-label">{label}</span>
      <input
        type={hasTime ? "datetime-local" : "date"}
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
