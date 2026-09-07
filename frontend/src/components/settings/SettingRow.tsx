import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "../ui";
import { usePreference } from "../../hooks/usePreference";

/**
 * Settings primitives (plan-settings-2026-09-07 § Primitives).
 *
 * `SettingRow` is the one shape every setting takes: label, description, control,
 * scope badge (who owns the value), default + reset, last change, consumers, and a
 * deep-link anchor (`#/settings/light#tariff`). `SettingsCard` groups rows in a card
 * with an Advanced disclosure. Rows never invent state: `state` is only what the
 * caller knows (saved / pending / failed / held).
 */

export type SettingScope = "browser" | "brain" | "hub" | "firmware";
export type SettingState = "saved" | "pending" | "failed" | "held" | null;

const SCOPE_LABEL: Record<SettingScope, string> = {
  browser: "this browser",
  brain: "brain",
  hub: "hub",
  firmware: "firmware",
};

const SCOPE_TITLE: Record<SettingScope, string> = {
  browser: "Stored in this browser only — a phone and a laptop can differ.",
  brain: "Stored by the brain on the Pi — shared by every browser.",
  hub: "Lives on the hub ESP (NVS); the brain holds the intended value.",
  firmware: "Compiled constant — shown for transparency, not editable here.",
};

export function ScopeBadge({ scope }: { scope: SettingScope }) {
  return (
    <span className={`dsc-scope dsc-scope--${scope}`} title={SCOPE_TITLE[scope]}>
      {SCOPE_LABEL[scope]}
    </span>
  );
}

export function SettingRow({
  id,
  label,
  description,
  scope,
  control,
  defaultLabel,
  isDefault,
  onReset,
  changedAt,
  consumers,
  state,
  stateText,
  advanced = false,
  forceShow = false,
}: {
  /** Anchor id — unique across Settings; used by search and desk deep links. */
  id: string;
  label: ReactNode;
  description?: ReactNode;
  scope: SettingScope;
  control: ReactNode;
  /** Human default, e.g. `2 °C`. Omit for stated (read-only) rows. */
  defaultLabel?: string;
  /** When false and `onReset` is given, a Reset action appears. */
  isDefault?: boolean;
  onReset?: () => void;
  /** Free text such as `changed 2 h ago · was 1.2`. */
  changedAt?: string;
  /** Where the value shows up, as links: `[{ label: "Light desk", href: "#/light" }]`. */
  consumers?: { label: string; href: string }[];
  state?: SettingState;
  stateText?: string;
  /** Hidden unless the card's Advanced disclosure is open or the operator shows advanced rows. */
  advanced?: boolean;
  forceShow?: boolean;
}) {
  const location = useLocation();
  const ref = useRef<HTMLDivElement | null>(null);
  const isTarget = location.hash === `#${id}`;
  const [showAdvanced] = usePreference("showAdvanced");

  useEffect(() => {
    if (!isTarget) return;
    const el = ref.current;
    if (!el) return;
    // Instant, not smooth: smooth scrolls are dropped in hidden documents (the in-app pane).
    const t = window.setTimeout(() => el.scrollIntoView({ block: "center" }), 150);
    return () => window.clearTimeout(t);
  }, [isTarget]);

  if (advanced && !forceShow && !showAdvanced && !isTarget) return null;

  return (
    <div
      ref={ref}
      id={id}
      className={`dsc-setting-row${isTarget ? " is-target" : ""}${advanced ? " is-advanced" : ""}`}
      data-setting={id}
    >
      <div className="dsc-setting-main">
        <div className="dsc-setting-label">
          <span>{label}</span>
          <ScopeBadge scope={scope} />
          {state ? (
            <span
              className={`dsc-setting-state dsc-setting-state--${state}`}
              role={state === "failed" ? "alert" : "status"}
              aria-live={state === "failed" ? "assertive" : "polite"}
            >
              {stateText ?? state}
            </span>
          ) : null}
        </div>
        {description ? <p className="dsc-setting-desc">{description}</p> : null}
        {defaultLabel || changedAt || (consumers && consumers.length) ? (
          <div className="dsc-setting-meta">
            {defaultLabel ? <span>default {defaultLabel}</span> : null}
            {onReset && isDefault === false ? (
              <button type="button" onClick={onReset}>
                reset
              </button>
            ) : null}
            {changedAt ? <span>{changedAt}</span> : null}
            {consumers && consumers.length ? (
              <span>
                used by{" "}
                {consumers.map((c, i) => (
                  <span key={c.href}>
                    {i ? " · " : ""}
                    <a href={c.href}>{c.label}</a>
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="dsc-setting-control">{control}</div>
    </div>
  );
}

/** A value that is stated, not chosen (metric units, firmware constants). */
export function Stated({ children }: { children: ReactNode }) {
  return <span className="dsc-setting-stated">{children}</span>;
}

export function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="dsc-toggle"
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  );
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string; title?: string }[];
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div className="dsc-segment" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          title={o.title}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Card of rows. `loadState` lets each card degrade on its own (an old brain that lacks a
 * route says so inside this card only — Pass D rule).
 */
export function SettingsCard({
  id,
  title,
  icon,
  intro,
  children,
  advanced,
  advancedLabel = "Advanced",
  loadState,
  loadError,
  actions,
}: {
  id?: string;
  title: ReactNode;
  icon?: Parameters<typeof Icon>[0]["name"];
  intro?: ReactNode;
  children?: ReactNode;
  /** Rows shown under an Advanced disclosure (open when the operator shows advanced rows). */
  advanced?: ReactNode;
  advancedLabel?: string;
  loadState?: "loading" | "ready" | "error";
  loadError?: string;
  actions?: ReactNode;
}) {
  const location = useLocation();
  const [showAdvanced] = usePreference("showAdvanced");
  const [open, setOpen] = useState<boolean>(showAdvanced);
  useEffect(() => {
    if (showAdvanced) setOpen(true);
  }, [showAdvanced]);
  // A deep link to an advanced row opens the disclosure.
  useEffect(() => {
    if (location.hash && !open) {
      const target = document.getElementById(location.hash.slice(1));
      if (target && target.closest(`[data-card="${id ?? ""}"]`)) setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  return (
    <section className="dsc-card dsc-settings-card" id={id} data-card={id} style={{ scrollMarginTop: 80 }}>
      <h3 className="dsc-card-title">
        {icon ? <Icon name={icon} size={14} color="var(--dsc-teal)" /> : null}
        {title}
      </h3>
      {intro ? <p className="dsc-muted">{intro}</p> : null}
      {loadState === "loading" ? <p className="dsc-muted">Loading…</p> : null}
      {loadState === "error" ? <p className="dsc-honesty">{loadError ?? "Unavailable."}</p> : null}
      {loadState !== "loading" && loadState !== "error" ? (
        <>
          <div className="dsc-setting-rows">{children}</div>
          {advanced ? (
            <details
              className="dsc-settings-advanced"
              open={open}
              onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary>{advancedLabel}</summary>
              <div className="dsc-setting-rows">{advanced}</div>
            </details>
          ) : null}
          {actions ? <div className="dsc-row-actions" style={{ marginTop: 10 }}>{actions}</div> : null}
        </>
      ) : null}
    </section>
  );
}
