import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DecisionLayer } from "./DecisionLayer";
import { iconSvg, type IconName } from "../icons";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useFleetEntity } from "../hooks/useFleetEntity";

export type { IconName };

/**
 * "Dim dash" loading indicator — three muted dashes pulsing in sequence.
 * Use inline for a route/panel that is still fetching, or let `<Button busy>`
 * render it, so an async action reads as "working" rather than a dead hang.
 */
function SpinnerDots() {
  return (
    <span className="dsc-spinner-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function Spinner({ label, className }: { label?: string; className?: string }) {
  return (
    <span className={`dsc-spinner${className ? ` ${className}` : ""}`} role="status">
      <SpinnerDots />
      {label ? <span>{label}…</span> : <span className="dsc-sr-only">Loading…</span>}
    </span>
  );
}

export function Icon({
  name,
  size = 16,
  className,
  color = "currentColor",
  motion,
}: {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
  motion?: "pulse" | "spin" | "glow" | "breathe" | "duty";
}) {
  const motionClass = motion ? ` dsc-icon--${motion}` : "";
  return (
    <span
      className={`dsc-icon${motionClass}${className ? ` ${className}` : ""}`}
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

export type ButtonVariant = "primary" | "secondary" | "danger";

export function Button({
  children,
  primary,
  teal,
  variant,
  onClick,
  type = "button",
  disabled,
  busy,
  icon,
  iconMotion,
  style,
}: {
  children: ReactNode;
  primary?: boolean;
  teal?: boolean;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** In-flight: disables the button and swaps the icon for the dim-dash spinner. */
  busy?: boolean;
  icon?: IconName;
  iconMotion?: "pulse" | "spin" | "glow" | "breathe" | "duty";
  style?: CSSProperties;
}) {
  const cls = ["dsc-btn"];
  if (primary) cls.push("primary");
  if (teal) cls.push("teal");
  if (variant) {
    switch (variant) {
      case "primary":
        cls.push("dsc-btn-primary");
        break;
      case "secondary":
        cls.push("dsc-btn-secondary");
        break;
      case "danger":
        cls.push("dsc-btn-danger");
        break;
      default: {
        const _exhaustive: never = variant;
        void _exhaustive;
      }
    }
  }
  return (
    <button
      type={type}
      className={cls.join(" ")}
      onClick={onClick}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      style={style}
    >
      {busy ? <SpinnerDots /> : icon ? <Icon name={icon} size={14} motion={iconMotion} /> : null}
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
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  tone?: "normal" | "ok" | "warn" | "bad" | "muted";
  stale?: boolean;
  onClick?: () => void;
  icon?: IconName;
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
        <Card title={label} className={stale ? "is-stale" : undefined} icon={icon}>
          {body}
        </Card>
      </button>
    );
  }
  return (
    <Card title={label} className={stale ? "is-stale" : undefined} icon={icon}>
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
  motion,
  icon,
  onClick,
  title,
}: {
  label: string;
  tone?: "ok" | "bad" | "warn" | "muted";
  pulse?: boolean;
  motion?: "pulse" | "duty" | "breathe" | "fan" | "glow";
  icon?: IconName;
  onClick?: () => void;
  title?: string;
}) {
  const anim = motion ?? (pulse ? "pulse" : undefined);
  const cls = `dsc-chip dsc-chip--${tone}${anim ? ` dsc-chip--${anim}` : ""}`;
  const leading =
    motion === "fan" ? (
      <Icon name="fan" size={11} className="dsc-fan-spin" />
    ) : icon ? (
      <Icon
        name={icon}
        size={11}
        motion={motion === "glow" || motion === "duty" || motion === "breathe" ? motion : pulse ? "pulse" : undefined}
      />
    ) : null;
  if (onClick) {
    return (
      <button type="button" className={`${cls} is-clickable`} title={title} onClick={onClick}>
        {leading}
        {label}
      </button>
    );
  }
  return (
    <span className={cls} title={title}>
      {leading}
      {label}
    </span>
  );
}

export type EntityToggleConfirm = boolean | { title?: string; body?: string; confirmLabel?: string };

/** Pressable demand / override switch via HA callService. */
export function EntityToggle({
  entityId,
  label,
  warnWhenMissing,
  icon,
  showBrightness,
  confirm,
  oos,
  oosLabel = "On hold",
}: {
  entityId: string;
  label: string;
  warnWhenMissing?: string;
  icon?: IconName;
  showBrightness?: boolean;
  /** When set, opens DecisionLayer before calling the hub. */
  confirm?: EntityToggleConfirm;
  /** Device is on hold indefinitely (e.g. F-001/F-002) — render as honestly out of
   *  service, not a live control, regardless of the underlying entity state. */
  oos?: boolean;
  oosLabel?: string;
}) {
  const { state, available, attributes } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const [layerOpen, setLayerOpen] = useState(false);
  const busOn = state === "on";
  const ok = available;
  const domain = entityId.split(".")[0];

  // Optimistic local draft — show the flip instantly instead of waiting on the
  // callService round trip + entity-bus push (matches the EntityText/EntityTime
  // local-draft pattern). Cleared once the bus confirms, or after a timeout so a
  // failed/lost write never leaves the button stuck showing the wrong state.
  const [pendingOn, setPendingOn] = useState<boolean | null>(null);
  const on = pendingOn ?? busOn;

  useEffect(() => {
    if (pendingOn != null && busOn === pendingOn) setPendingOn(null);
  }, [busOn, pendingOn]);

  useEffect(() => {
    if (pendingOn == null) return;
    const t = window.setTimeout(() => setPendingOn(null), 8000);
    return () => window.clearTimeout(t);
  }, [pendingOn]);

  useEffect(() => {
    setPendingOn(null);
  }, [entityId]);

  const toggle = () => {
    if (oos) return;
    if (!ok) return;
    const nextOn = !on;
    setPendingOn(nextOn);
    if (domain === "switch" || domain === "input_boolean") {
      void callService(domain, nextOn ? "turn_on" : "turn_off", { entity_id: entityId });
      return;
    }
    if (domain === "light") {
      void callService("light", nextOn ? "turn_on" : "turn_off", { entity_id: entityId });
    }
  };

  const onPress = () => {
    if (oos) return;
    if (!ok && !warnWhenMissing) return;
    if (confirm) {
      setLayerOpen(true);
      return;
    }
    toggle();
  };

  const confirmCopy =
    confirm === true
      ? {
          title: on ? `Turn off ${label}` : `Turn on ${label}`,
          body: `This writes ${entityId} on the hub immediately.`,
          confirmLabel: on ? "Turn off" : "Turn on",
        }
      : confirm
        ? {
            title: confirm.title ?? (on ? `Turn off ${label}` : `Turn on ${label}`),
            body: confirm.body ?? `This writes ${entityId} on the hub immediately.`,
            confirmLabel: confirm.confirmLabel ?? (on ? "Turn off" : "Turn on"),
          }
        : null;

  const brightness =
    showBrightness !== false && domain === "light" && on
      ? Math.round((Number(attributes?.brightness ?? 0) / 255) * 100)
      : null;

  return (
    <>
      <button
        type="button"
        className={`dsc-demand${on && !oos ? " is-on" : ""}${!ok && !oos ? " is-missing" : ""}${oos ? " is-oos" : ""}`}
        onClick={onPress}
        disabled={oos || (!ok && !warnWhenMissing)}
        title={oos ? `${label} is on hold — honest OOS, not live` : ok ? entityId : warnWhenMissing || `${entityId} unavailable`}
      >
        {icon ? (
          <Icon
            name={icon}
            size={22}
            color="var(--dsc-teal)"
            className="dsc-demand-icon"
            motion={on && !oos ? (domain === "light" ? "glow" : "duty") : undefined}
          />
        ) : null}
        <span className="dsc-demand-label">{label}</span>
        <span className="dsc-demand-state">
          {oos ? oosLabel : !ok ? warnWhenMissing || "—" : brightness != null ? `${brightness}%` : on ? "ON" : "OFF"}
        </span>
      </button>
      {confirmCopy ? (
        <DecisionLayer
          open={layerOpen}
          onDismiss={() => setLayerOpen(false)}
          onConfirm={() => {
            setLayerOpen(false);
            toggle();
          }}
          title={confirmCopy.title}
          confirmLabel={confirmCopy.confirmLabel}
          help={null}
        >
          <p>{confirmCopy.body}</p>
        </DecisionLayer>
      ) : null}
    </>
  );
}

export function EntitySelect({
  entityId,
  label,
  icon,
  disabled,
  filterOptions,
}: {
  entityId: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  /** Narrow HA option list for kit surfaces (e.g. Probe 1–2 only). */
  filterOptions?: (options: string[]) => string[];
}) {
  const { state, available, attributes } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const ok = available && !disabled;
  const current = state;
  const rawOptions = (attributes?.options as string[] | undefined) || [];
  const options = filterOptions ? filterOptions(rawOptions) : rawOptions;
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
  const { state, available } = useEntityBus();
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

/** In-flight EntityText drafts keyed by entity_id — flushed on Next/commit before hub ticks. */
const entityTextDrafts = new Map<string, string>();

export function peekEntityTextDraft(entityId: string): string | undefined {
  return entityTextDrafts.has(entityId) ? entityTextDrafts.get(entityId) : undefined;
}

export async function flushEntityTextDrafts(
  callService: (domain: string, service: string, data: Record<string, unknown>) => Promise<unknown> | unknown,
): Promise<void> {
  // Prefer live DOM values (covers mid-typing when React onChange lagged or focus moved).
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-entity-id]").forEach((el) => {
    const entityId = el.getAttribute("data-entity-id");
    if (!entityId) return;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      entityTextDrafts.set(entityId, el.value);
    }
  });
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
  const entries = [...entityTextDrafts.entries()];
  for (const [entityId, value] of entries) {
    if (!String(value || "").trim()) continue;
    if (entityId.startsWith("input_datetime.")) {
      const payload: Record<string, unknown> = { entity_id: entityId };
      if (value.includes("T")) {
        payload.datetime = value.replace("T", " ");
      } else {
        payload.date = value;
      }
      await callService("input_datetime", "set_datetime", payload);
    } else {
      await callService("input_text", "set_value", { entity_id: entityId, value });
    }
  }
  await Promise.resolve();
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
  const { available, state } = useEntityBus();
  const { callService } = useFleetActions();
  const ok = available(entityId);
  const clean = liveText(state(entityId, ""));
  const [draft, setDraft] = useState(clean);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setDraft(clean);
      entityTextDrafts.set(entityId, clean);
    }
  }, [clean, entityId]);

  const commit = () => {
    if (!ok) return;
    entityTextDrafts.set(entityId, draft);
    void callService("input_text", "set_value", { entity_id: entityId, value: draft });
  };

  const bind = {
    value: draft,
    disabled: !ok,
    onFocus: () => {
      focused.current = true;
    },
    onChange: (e: { target: { value: string } }) => {
      setDraft(e.target.value);
      entityTextDrafts.set(entityId, e.target.value);
    },
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
      {multiline ? (
        <textarea rows={rows} data-entity-id={entityId} {...bind} />
      ) : (
        <input type="text" data-entity-id={entityId} {...bind} />
      )}
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
export function EntityTime({
  entityId,
  label,
  disabled,
  hint,
}: {
  entityId: string;
  label: string;
  disabled?: boolean;
  hint?: string;
}) {
  const { entity } = useEntityBus();
  const { state, available } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const registered = Boolean(entity(entityId)) || available;
  const ok = registered && !disabled;
  const live = timeToInput(state === "unavailable" || state === "unknown" ? "" : state);
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
      {hint ? <span className="dsc-target-hint">{hint}</span> : null}
    </label>
  );
}

/** Local draft for `input_datetime.*`. Date-only unless the helper has a time. */
export function EntityDatetime({ entityId, label }: { entityId: string; label: string }) {
  const { available, entity, state } = useEntityBus();
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
    if (!focused.current) {
      const next = toInput(live);
      setDraft(next);
      entityTextDrafts.set(entityId, next);
    }
  }, [live, hasTime, entityId]);

  const commit = () => {
    if (!ok || !draft) return;
    entityTextDrafts.set(entityId, draft);
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
        data-entity-id={entityId}
        value={draft}
        disabled={!ok}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => {
          setDraft(e.target.value);
          entityTextDrafts.set(entityId, e.target.value);
        }}
        onBlur={() => {
          focused.current = false;
          commit();
        }}
      />
    </label>
  );
}
