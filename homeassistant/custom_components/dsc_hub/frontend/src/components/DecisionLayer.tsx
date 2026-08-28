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
