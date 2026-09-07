import { useEffect } from "react";
import { usePreferences } from "../hooks/usePreference";

/**
 * Applies the appearance preferences to the document root as data attributes so the
 * token layer (dsc.css) can react: grid wash, motion, depth, contrast, state colours,
 * density, and text scale. Renders nothing.
 */
export function PreferencesRoot() {
  const p = usePreferences();
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.dscWash = p.gridWash ? "on" : "off";
    el.dataset.dscMotion = p.motion;
    el.dataset.dscDepth = p.depth ? "glass" : "flat";
    el.dataset.dscContrast = p.highContrast ? "high" : "normal";
    el.dataset.dscColors = p.stateColors;
    el.dataset.dscDensity = p.density;
    el.dataset.dscText = String(p.textScale);
    el.dataset.dscFresh = p.freshPulse ? "on" : "off";
  }, [p.gridWash, p.motion, p.depth, p.highContrast, p.stateColors, p.density, p.textScale, p.freshPulse]);
  return null;
}
