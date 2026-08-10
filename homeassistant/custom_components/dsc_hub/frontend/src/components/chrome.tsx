import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./ui";
import type { IconName } from "../icons";

export function IconButton({
  label,
  icon,
  onClick,
  className = "",
}: {
  label: string;
  icon: IconName;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`dsc-icon-btn ${className}`.trim()}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
    </button>
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
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="dsc-overflow" ref={rootRef}>
      <IconButton label={label} icon="more" onClick={() => setOpen((v) => !v)} />
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

export function SlideDrawer({
  open,
  onClose,
  title,
  side = "right",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`dsc-drawer-root${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="dsc-drawer-scrim" onClick={onClose} />
      <aside
        className={`dsc-drawer-panel ${side}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="dsc-drawer-rail"
          aria-label="Close panel"
          onClick={onClose}
        >
          {side === "right" ? ">" : "<"}
        </button>
        <div className="dsc-drawer-head">
          <h2 id={titleId}>{title}</h2>
          <IconButton label="Close" icon="more" onClick={onClose} />
        </div>
        <div className="dsc-drawer-body">{children}</div>
      </aside>
    </div>
  );
}

export type SoilLayer = { name: string; pct: number; color?: string };

const LAYER_COLORS = ["#5b9f6b", "#4a8f9f", "#c4a35a", "#8d6e63"];

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
}: {
  layers: SoilLayer[];
  valid?: boolean;
  emptyLabel?: string;
}) {
  const sum = layers.reduce((a, l) => a + l.pct, 0);
  const isValid = valid ?? (layers.length > 0 && Math.round(sum) === 100);
  let cursor = 0;
  return (
    <div className="dsc-soil">
      <div className={`dsc-soil-pot${isValid && layers.length ? " is-valid" : ""}`}>
        {!layers.length ? (
          <div className="dsc-soil-empty">{emptyLabel}</div>
        ) : (
          layers.map((layer, i) => {
            const bottom = cursor;
            cursor += layer.pct;
            return (
              <div
                key={`${layer.name}-${i}`}
                className="dsc-soil-layer"
                style={{
                  bottom: `${bottom}%`,
                  height: `${layer.pct}%`,
                  background: layer.color || LAYER_COLORS[i % LAYER_COLORS.length],
                }}
                title={`${layer.name} ${layer.pct}%`}
              >
                {layer.pct >= 12 ? `${layer.name} ${Math.round(layer.pct)}%` : ""}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
