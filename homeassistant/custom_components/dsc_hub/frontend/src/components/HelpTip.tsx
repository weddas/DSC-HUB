import type { ReactNode } from "react";

/** Inline ? help callout — native details, works without JS. */
export function HelpTip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="dsc-help-tip">
      <summary aria-label={`Help: ${title}`}>?</summary>
      <div className="dsc-help-tip-body">
        <strong>{title}</strong>
        {children}
      </div>
    </details>
  );
}
