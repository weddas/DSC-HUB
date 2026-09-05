import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "../ui";
import { HelpTip } from "../HelpTip";

/**
 * New-UX settings table primitives. Thin, opinionated layer over the existing
 * `.dsc-table` — see docs/frontend/DESIGN-TOKENS.md §5. Phases 1–4 of the Zigbee
 * rollout migrate dense settings surfaces onto these; the primitives themselves
 * land with no visible change.
 */

export type CellTone = "ok" | "warn" | "bad" | "muted";

function toneClass(tone?: CellTone): string {
  return tone ? ` is-${tone}` : "";
}

export type SettingsColumn = {
  key: string;
  label: ReactNode;
  /** Right-align numeric columns. */
  numeric?: boolean;
  /** Rendered narrow — health / actions. */
  tight?: boolean;
};

export function SettingsTable({
  columns,
  caption,
  help,
  children,
  className = "",
  style,
}: {
  columns: SettingsColumn[];
  /** Short line above the table, left of the help disc. */
  caption?: ReactNode;
  /** HelpTip content — rendered trailing the caption (DESIGN-TOKENS §4). */
  help?: { title: string; body: ReactNode };
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="dsc-settings-table-block" style={style}>
      {caption || help ? (
        <div className="dsc-settings-table-caption">
          {caption ? <span>{caption}</span> : <span />}
          {help ? <HelpTip title={help.title}>{help.body}</HelpTip> : null}
        </div>
      ) : null}
      <div className="dsc-table-scroll">
        <table className={`dsc-table dsc-table--settings ${className}`.trim()}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`${c.numeric ? "is-numeric" : ""}${c.tight ? " is-tight" : ""}`.trim() || undefined}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

/** Passthrough `<tr>`; `tone` tints the whole row's text. */
export function SettingsRow({
  tone,
  children,
}: {
  tone?: CellTone;
  children: ReactNode;
}) {
  return <tr className={`dsc-settings-row${toneClass(tone)}`}>{children}</tr>;
}

/** Secondary detail row (task params etc.) spanning the full width. */
export function SettingsSubRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr className="dsc-settings-subrow">
      <td colSpan={colSpan}>{children}</td>
    </tr>
  );
}

/** Name / label cell: bold primary line + optional dim secondary + optional icon. */
export function TextCell({
  primary,
  secondary,
  icon,
  tone,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  icon?: IconName;
  tone?: CellTone;
}) {
  return (
    <td className={`dsc-cell-text${toneClass(tone)}`}>
      <div className="dsc-cell-text-primary">
        {icon ? <Icon name={icon} size={14} color="var(--dsc-gray-5)" /> : null}
        {primary}
      </div>
      {secondary != null && secondary !== "" ? (
        <div className="dsc-cell-text-secondary">{secondary}</div>
      ) : null}
    </td>
  );
}

function relAge(sec: number): string {
  const min = Math.max(0, Math.round((Date.now() - sec * 1000) / 60000));
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 48) return `${hr}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

/**
 * Battery % / link quality / last-seen as compact stacked bits, each toned per
 * DESIGN-TOKENS §3. Absent fields render nothing; an all-absent cell shows "—".
 */
export function HealthCell({
  battery,
  linkquality,
  lastSeen,
  staleAfterMin = 60,
}: {
  battery?: number | null;
  linkquality?: number | null;
  lastSeen?: number | null;
  /** last-seen older than this reads `warn`. */
  staleAfterMin?: number;
}) {
  const bits: Array<{ text: string; tone: CellTone }> = [];
  if (typeof battery === "number" && Number.isFinite(battery)) {
    bits.push({
      text: `${Math.round(battery)}%`,
      tone: battery <= 20 ? "warn" : "muted",
    });
  }
  if (typeof linkquality === "number" && Number.isFinite(linkquality)) {
    bits.push({
      text: `LQI ${Math.round(linkquality)}`,
      tone: linkquality < 40 ? "warn" : "muted",
    });
  }
  if (typeof lastSeen === "number" && Number.isFinite(lastSeen)) {
    const ageMin = (Date.now() - lastSeen * 1000) / 60000;
    bits.push({
      text: relAge(lastSeen),
      tone: ageMin > staleAfterMin ? "warn" : "muted",
    });
  }
  return (
    <td className="dsc-cell-health is-tight">
      {bits.length ? (
        bits.map((b, i) => (
          <span key={i} className={`dsc-health-bit${toneClass(b.tone)}`}>
            {b.text}
          </span>
        ))
      ) : (
        <span className="dsc-health-bit is-muted">—</span>
      )}
    </td>
  );
}

/**
 * A number + unit. When `stale`, renders the last value in `muted` with a `⏸`
 * marker (and age, if `heldSinceSec` given) — never a confident live-looking
 * number. See DESIGN-TOKENS §3.1.
 */
export function StaleValueCell({
  value,
  unit,
  stale,
  digits = 1,
  heldSinceSec,
}: {
  value: number | null | undefined;
  unit?: string;
  stale?: boolean;
  digits?: number;
  heldSinceSec?: number | null;
}) {
  const has = typeof value === "number" && Number.isFinite(value);
  if (!has) {
    return (
      <td className="dsc-cell-value is-numeric is-muted">
        <span className="dsc-cell-value-num">—</span>
      </td>
    );
  }
  return (
    <td className={`dsc-cell-value is-numeric${stale ? " is-muted is-stale" : ""}`}>
      <span className="dsc-cell-value-num">
        {value!.toFixed(digits)}
        {unit ? <span className="dsc-cell-value-unit">{unit}</span> : null}
      </span>
      {stale ? (
        <span className="dsc-cell-value-held" title="Last known — sensor has gone quiet">
          {"⏸"}
          {typeof heldSinceSec === "number" && Number.isFinite(heldSinceSec) ? ` ${relAge(heldSinceSec)}` : ""}
        </span>
      ) : null}
    </td>
  );
}

/**
 * Click-to-edit text (device rename). Draft-local; commits on blur / Enter,
 * reverts on Escape. Never fires per-keystroke — the row is not gated on a
 * round-trip.
 */
export function InlineEditCell({
  value,
  onCommit,
  placeholder,
  ariaLabel,
  disabled,
  secondary,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  /** Dim line under the name — ieee / class / etc. */
  secondary?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== value) onCommit(next);
    else setDraft(value);
  };

  if (disabled) {
    return (
      <td className="dsc-cell-inline-edit">
        <span className="dsc-inline-edit-static">{value || placeholder || "—"}</span>
        {secondary != null && secondary !== "" ? (
          <div className="dsc-cell-text-secondary">{secondary}</div>
        ) : null}
      </td>
    );
  }

  return (
    <td className="dsc-cell-inline-edit">
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          className="dsc-inline-edit-input"
          value={draft}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              setDraft(value);
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="dsc-inline-edit-trigger"
          onClick={() => setEditing(true)}
          title="Rename"
        >
          <span>{value || placeholder || "—"}</span>
          <Icon name="settings" size={11} color="var(--dsc-gray-5)" />
        </button>
      )}
      {secondary != null && secondary !== "" ? (
        <div className="dsc-cell-text-secondary">{secondary}</div>
      ) : null}
    </td>
  );
}

/** Bare `<select>` sized for a dense row. */
export function SelectCell({
  value,
  onChange,
  disabled,
  title,
  tone,
  children,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  title?: string;
  tone?: CellTone;
  children: ReactNode;
}) {
  return (
    <td className={`dsc-cell-select${toneClass(tone)}`}>
      <select value={value} disabled={disabled} title={title} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </td>
  );
}

/** Trailing actions cell (buttons). */
export function ActionsCell({ children }: { children: ReactNode }) {
  return <td className="dsc-cell-actions is-tight">{children}</td>;
}
