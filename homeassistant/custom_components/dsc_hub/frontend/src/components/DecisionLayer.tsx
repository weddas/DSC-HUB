import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button, Icon } from "./ui";

export function ResultChip({
  label,
  empty = false,
  onClick,
}: {
  label: string;
  empty?: boolean;
  onClick?: () => void;
}) {
  const body = (
    <span className={`dsc-result-chip${empty ? " is-empty" : ""}`}>
      <span>{label}</span>
    </span>
  );
  if (!onClick) return body;
  return (
    <button type="button" className="dsc-result-chip-hit" onClick={onClick}>
      {body}
    </button>
  );
}

/**
 * Fade overlay for decisions. Confirm is required when onConfirm is set.
 * Help slot stays empty until copy exists. z-index above .dsc-drawer-root (80).
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
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("button, input, select, textarea, [href]");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      restoreRef.current?.focus?.();
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="dsc-decision-root is-open" role="presentation">
      <div className="dsc-decision-scrim" onClick={onDismiss} />
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
}
