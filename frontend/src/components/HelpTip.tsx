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
