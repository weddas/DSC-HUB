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
