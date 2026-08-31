# Shared UI primitives

Operator SPA shared primitives (not page-specific). Paths under `homeassistant/custom_components/dsc_hub/frontend/`.

Included: `ui.tsx`, `chrome.tsx`, `HelpTip.tsx` (shared primitive), `DecisionLayer.tsx` (shared modal primitive).

---

## ui.tsx

- **path:** `src/components/ui.tsx`
- **name:** Icon, Card, Button, Kpi, PageHeader, StatusChip, EntityToggle, EntitySelect, EntityFanSlider, LinkChip, EntityText, EntityTime, EntityDatetime
- **description:** Shared display primitives and HA-bound entity controls used across Live/Grow/Tune/Fleet/Settings.
- **key props:** Icon(`name`,`size`,`color`,`motion`); Card(`title`,`icon`,`children`,`className`,`style`); Button(`children`,`primary`,`teal`,`variant`,`onClick`,`disabled`,`icon`,`iconMotion`); Kpi(`label`,`value`,`unit`,`sub`,`tone`,`stale`,`onClick`,`icon`); PageHeader(`title`,`subtitle`,`icon`,`primaryAction`,`actions`); StatusChip(`label`,`tone`,`pulse`,`motion`,`icon`,`onClick`,`title`); EntityToggle(`entityId`,`label`,`warnWhenMissing`,`icon`,`showBrightness`,`confirm`); EntitySelect(`entityId`,`label`,`icon`,`disabled`,`filterOptions`); EntityFanSlider(`entityId`,`label`,`disabled`); LinkChip(`entityId`,`label`,`icon`); EntityText(`entityId`,`label`,`multiline`,`rows`); EntityTime(`entityId`,`label`,`disabled`,`hint`); EntityDatetime(`entityId`,`label`)

```tsx
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DecisionLayer } from "./DecisionLayer";
import { iconSvg, type IconName } from "../icons";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useFleetEntity } from "../hooks/useFleetEntity";

export type { IconName };

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
  icon,
  iconMotion,
}: {
  children: ReactNode;
  primary?: boolean;
  teal?: boolean;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: IconName;
  iconMotion?: "pulse" | "spin" | "glow" | "breathe" | "duty";
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
    <button type={type} className={cls.join(" ")} onClick={onClick} disabled={disabled}>
      {icon ? <Icon name={icon} size={14} motion={iconMotion} /> : null}
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
}: {
  entityId: string;
  label: string;
  warnWhenMissing?: string;
  icon?: IconName;
  showBrightness?: boolean;
  /** When set, opens DecisionLayer before calling the hub. */
  confirm?: EntityToggleConfirm;
}) {
  const { state, available, attributes } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const [layerOpen, setLayerOpen] = useState(false);
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

  const onPress = () => {
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
        className={`dsc-demand${on ? " is-on" : ""}${!ok ? " is-missing" : ""}`}
        onClick={onPress}
        disabled={!ok && !warnWhenMissing}
        title={ok ? entityId : warnWhenMissing || `${entityId} unavailable`}
      >
        {icon ? (
          <Icon
            name={icon}
            size={22}
            color="var(--dsc-teal)"
            className="dsc-demand-icon"
            motion={on ? (domain === "light" ? "glow" : "duty") : undefined}
          />
        ) : null}
        <span className="dsc-demand-label">{label}</span>
        <span className="dsc-demand-state">
          {!ok ? warnWhenMissing || "—" : brightness != null ? `${brightness}%` : on ? "ON" : "OFF"}
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
```

---

## chrome.tsx

- **path:** `src/components/chrome.tsx`
- **name:** IconButton, OverflowMenu, SlideDrawer, SoilCrossSection (`parseBlendLayers` helper)
- **description:** Operator chrome: icon buttons, overflow menus, focus-trapped slide drawer, soil-blend vessel cross-section.
- **key props:** IconButton(`label`,`icon`,`onClick`,`className`,`expanded`); OverflowMenu(`items:{id,label,onSelect}[]`,`label`); SlideDrawer(`open`,`onClose`,`title`,`side`,`wide`,`children`); SoilCrossSection(`layers`,`valid`,`emptyLabel`,`spec`)

```tsx
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./ui";
import type { IconName } from "../icons";
import { VesselGlyph } from "./VesselGlyph";
import { DEFAULT_VESSEL, type VesselSpec } from "../lib/vesselSpec";
import { isTopModalLayer, popModalLayer, pushModalLayer } from "../lib/modalLayer";

export function IconButton({
  label,
  icon,
  onClick,
  className = "",
  expanded,
}: {
  label: string;
  icon: IconName;
  onClick?: () => void;
  className?: string;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      className={`dsc-icon-btn ${className}`.trim()}
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

function isMoreInfoTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog",
  );
}

export function OverflowMenu({
  items,
  label = "More actions",
}: {
  items: { id: string; label: string; onSelect: () => void }[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (isMoreInfoTarget(e.target)) return;
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="dsc-overflow" ref={rootRef}>
      <IconButton
        label={label}
        icon="more"
        expanded={open}
        onClick={() => setOpen((v) => !v)}
      />
      {open ? (
        <div className="dsc-overflow-menu" role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

export function SlideDrawer({
  open,
  onClose,
  title,
  side = "right",
  wide = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  /** Wider panel for plant seats (~520px). History/inspector stay default. */
  wide?: boolean;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // Do NOT set .dsc-shell inert — SlideDrawer lives inside the shell (unlike DecisionLayer portal).
    const panel = panelRef.current;
    const first = panel ? focusables(panel)[0] : null;
    first?.focus();

    const layerId = pushModalLayer();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isTopModalLayer(layerId)) return;
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      if (!isTopModalLayer(layerId)) return;
      const list = focusables(panel);
      if (!list.length) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      popModalLayer(layerId);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className={`dsc-drawer-root${open ? " is-open" : ""}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="dsc-drawer-scrim" aria-hidden="true" onClick={onClose} />
      <aside
        ref={panelRef}
        className={`dsc-drawer-panel ${side}${wide ? " dsc-drawer-panel--wide" : ""}`}
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-labelledby={titleId}
        aria-hidden={!open}
        inert={!open ? true : undefined}
        hidden={!open ? true : undefined}
      >
        {open ? (
          <button
            type="button"
            className="dsc-drawer-rail"
            aria-label="Close"
            title="Close"
            onClick={onClose}
          >
            Close
          </button>
        ) : null}
        <div className="dsc-drawer-head">
          <h2 id={titleId}>{title}</h2>
          <IconButton label="Close" icon="close" onClick={onClose} />
        </div>
        <div className="dsc-drawer-body">{children}</div>
      </aside>
    </div>
  );
}

export type SoilLayer = { name: string; pct: number; color?: string };

/** Parse roster blend strings into soil layers. */
export function parseBlendLayers(blend: string | undefined | null): SoilLayer[] {
  if (!blend || !blend.trim()) return [];
  const parts = blend.split(/[|/·]/).map((s) => s.trim()).filter(Boolean);
  const layers: SoilLayer[] = [];
  for (const part of parts) {
    const m = part.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (m) {
      layers.push({ name: m[1].trim(), pct: Number(m[2]) });
      continue;
    }
    const m2 = part.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (m2) {
      layers.push({ name: m2[2].trim(), pct: Number(m2[1]) });
      continue;
    }
    if (part) layers.push({ name: part, pct: 0 });
  }
  if (layers.length && layers.every((l) => l.pct === 0)) {
    const even = 100 / layers.length;
    return layers.map((l) => ({ ...l, pct: even }));
  }
  return layers.filter((l) => l.pct > 0);
}

export function SoilCrossSection({
  layers,
  valid,
  emptyLabel = "No blend on roster seat",
  spec,
}: {
  layers: SoilLayer[];
  valid?: boolean;
  emptyLabel?: string;
  spec?: VesselSpec;
}) {
  const vessel = spec ?? DEFAULT_VESSEL;
  const sum = layers.reduce((a, l) => a + l.pct, 0);
  const isValid = valid ?? (layers.length > 0 && Math.round(sum) === 100);
  if (!layers.length) {
    return (
      <div className="dsc-soil dsc-soil--empty">
        <VesselGlyph spec={vessel} size={140} />
        <p className="dsc-soil-empty-caption">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className={`dsc-soil${isValid ? " is-valid" : ""}`}>
      <VesselGlyph spec={vessel} layers={layers} size={180} label />
    </div>
  );
}
```

---

## HelpTip.tsx

- **path:** `src/components/HelpTip.tsx`
- **name:** HelpTip
- **description:** Inline `?` help callout using native `<details>`; registers a modal layer so Escape closes the top tip.
- **key props:** `title` (string); `children` (ReactNode)

```tsx
import { useEffect, useRef, type ReactNode } from "react";
import { isTopModalLayer, popModalLayer, pushModalLayer } from "../lib/modalLayer";

type DetailsWithLayer = HTMLDetailsElement & { _dscLayer?: symbol };

/** Inline ? help callout — native details, works without JS. */
export function HelpTip({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clearLayer = () => {
      const tip = el as DetailsWithLayer;
      if (tip._dscLayer) {
        popModalLayer(tip._dscLayer);
        delete tip._dscLayer;
      }
    };

    const ensureLayer = () => {
      const tip = el as DetailsWithLayer;
      if (!el.open) {
        clearLayer();
        return;
      }
      if (!tip._dscLayer) tip._dscLayer = pushModalLayer();
    };

    // Remount / Strict Mode: re-register if already open.
    ensureLayer();

    const onToggle = () => ensureLayer();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !el.open) return;
      const tip = el as DetailsWithLayer;
      if (tip._dscLayer == null || !isTopModalLayer(tip._dscLayer)) return;
      e.preventDefault();
      e.stopPropagation();
      el.open = false;
    };

    el.addEventListener("toggle", onToggle);
    document.addEventListener("keydown", onKey, true);
    return () => {
      el.removeEventListener("toggle", onToggle);
      document.removeEventListener("keydown", onKey, true);
      clearLayer();
    };
  }, []);

  return (
    <details ref={ref} className="dsc-help-tip">
      <summary aria-label={`Help: ${title}`}>?</summary>
      <div className="dsc-help-tip-body" role="note">
        <strong>{title}</strong>
        {children}
      </div>
    </details>
  );
}
```

---

## DecisionLayer.tsx

- **path:** `src/components/DecisionLayer.tsx`
- **name:** DecisionLayer
- **description:** Portaled fade overlay for confirm/dismiss decisions. Traps Tab, marks `.dsc-shell` inert, z-index above drawers.
- **key props:** `open`; `onDismiss`; `onConfirm?`; `title`; `confirmLabel?` (default Confirm); `help?`; `children`

```tsx
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button, Icon } from "./ui";
import { isTopModalLayer, popModalLayer, pushModalLayer } from "../lib/modalLayer";

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

/**
 * Fade overlay for decisions. Confirm is required when onConfirm is set.
 * Help slot stays empty until copy exists. z-index above .dsc-drawer-root (80).
 * Portals to document.body; traps Tab and marks the shell inert while open.
 */
export function DecisionLayer({
  open,
  onDismiss,
  onConfirm,
  title,
  confirmLabel = "Confirm",
  help,
  children,
}: {
  open: boolean;
  onDismiss: () => void;
  onConfirm?: () => void;
  title: string;
  confirmLabel?: string;
  help?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const shell = document.querySelector(".dsc-shell");
    if (shell instanceof HTMLElement) shell.inert = true;

    const panel = panelRef.current;
    const first = panel ? focusables(panel)[0] : null;
    first?.focus();

    const layerId = pushModalLayer();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isTopModalLayer(layerId)) return;
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      if (!isTopModalLayer(layerId)) return;
      const list = focusables(panel);
      if (!list.length) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      popModalLayer(layerId);
      if (shell instanceof HTMLElement) shell.inert = false;
      restoreRef.current?.focus?.();
    };
  }, [open, onDismiss]);

  if (!open) return null;

  const layer = (
    <div className="dsc-decision-root is-open" role="presentation">
      <div className="dsc-decision-scrim" aria-hidden="true" onClick={onDismiss} />
      <aside
        ref={panelRef}
        className="dsc-decision-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="dsc-decision-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="dsc-icon-btn" aria-label="Dismiss" onClick={onDismiss}>
            <Icon name="close" size={16} />
          </button>
        </header>
        <div className="dsc-decision-body">{children}</div>
        {help ? <div className="dsc-decision-help">{help}</div> : <div className="dsc-decision-help is-empty" />}
        <footer className="dsc-decision-foot">
          <Button onClick={onDismiss}>Dismiss</Button>
          {onConfirm ? (
            <Button primary onClick={onConfirm}>
              {confirmLabel}
            </Button>
          ) : null}
        </footer>
      </aside>
    </div>
  );

  return createPortal(layer, document.body);
}
```
