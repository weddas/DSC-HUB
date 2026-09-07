import { useCallback, useState, type ReactNode } from "react";
import { Button } from "../ui";
import { SlideDrawer } from "../chrome";
import { DecisionLayer } from "../DecisionLayer";

/**
 * Settings drawer (plan-settings § Part 4, L3): a right sheet on desktop, a full page on
 * the phone (the SlideDrawer CSS already does that), with its own Save and a dirty guard —
 * closing with unsaved changes asks first. Rule editors, seat detail, Zigbee bindings and
 * fixture editors all use it so the section pages stay one list each.
 */
export function SettingsDrawer({
  open,
  title,
  onClose,
  dirty = false,
  onSave,
  saving = false,
  saveLabel = "Save",
  error,
  wide,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  /** True when the draft differs from what was loaded; closing then asks. */
  dirty?: boolean;
  /** Absent → read-only drawer without a Save button. */
  onSave?: () => void | Promise<void>;
  saving?: boolean;
  saveLabel?: string;
  /** Last save error, rendered above the footer. */
  error?: string | null;
  wide?: boolean;
  /** Extra footer content (left side), e.g. a Remove button. */
  footer?: ReactNode;
  children: ReactNode;
}) {
  const [askDiscard, setAskDiscard] = useState(false);
  const requestClose = useCallback(() => {
    if (dirty && !saving) setAskDiscard(true);
    else onClose();
  }, [dirty, saving, onClose]);

  return (
    <>
      <SlideDrawer open={open} onClose={requestClose} title={title} wide={wide}>
        <div className="dsc-settings-drawer">
          <div className="dsc-settings-drawer-body">{children}</div>
          {error ? (
            <p className="dsc-honesty" role="alert">
              {error}
            </p>
          ) : null}
          <div className="dsc-settings-drawer-foot">
            <span className="dsc-row-actions">{footer}</span>
            <span className="dsc-row-actions">
              <Button variant="secondary" onClick={requestClose} disabled={saving}>
                {onSave ? "Cancel" : "Close"}
              </Button>
              {onSave ? (
                <Button primary onClick={() => void onSave()} disabled={saving || !dirty}>
                  {saving ? "Saving…" : saveLabel}
                </Button>
              ) : null}
            </span>
          </div>
        </div>
      </SlideDrawer>
      <DecisionLayer
        open={askDiscard}
        onDismiss={() => setAskDiscard(false)}
        onConfirm={() => {
          setAskDiscard(false);
          onClose();
        }}
        title="Discard unsaved changes?"
        confirmLabel="Discard"
        help={null}
      >
        <p>This drawer has edits that were not saved. Discard them, or go back and Save.</p>
      </DecisionLayer>
    </>
  );
}

/** A labelled field inside a drawer — stacked label, control, optional hint. */
export function DrawerField({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="dsc-drawer-field">
      <span className="dsc-drawer-field-label">{label}</span>
      {children}
      {hint ? <span className="dsc-drawer-field-hint">{hint}</span> : null}
    </label>
  );
}
