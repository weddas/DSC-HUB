import { useEffect, useRef, type ReactNode } from "react";

/** Inline ? help callout — native details, works without JS. */
export function HelpTip({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = ref.current;
      if (el?.open) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
