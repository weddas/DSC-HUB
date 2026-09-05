/**
 * Optional script tags for residual Twin / map IIFEs on the Pi SPA.
 * HA /local and HACS paths were retired with the HA lab shell (2026-09).
 */
const BUNDLE_V = "7.4.0";

const THREE_JS = `/vendor/three.min.js?v=${BUNDLE_V}`;
const DASH_FX = `/vendor/dsc-dash-fx.js?v=${BUNDLE_V}`;

/**
 * Prefer dedicated IIFEs when present under brain static.
 * dsc-the-dash-card needs THREE (+ dash-fx) before the card script.
 * Primary Twin path is R3F (`DscTwinCanvas`); these scripts are optional warmups.
 */
const TAG_SCRIPTS: Record<string, string[]> = {
  "dsc-catalog-browse-card": [],
  "dsc-build-plant-card": [],
  "dsc-the-dash-card": [THREE_JS, DASH_FX, `/dsc-the-dash-card.js?v=${BUNDLE_V}`],
  "dsc-airflow-map-card": [`/dsc-airflow-map-card.js?v=${BUNDLE_V}`],
  "dsc-system-map-card": [`/dsc-system-map-card.js?v=${BUNDLE_V}`],
};

type ThreeHolder = { THREE?: unknown };

function hasThree(): boolean {
  return typeof (globalThis as ThreeHolder).THREE !== "undefined";
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed ${src}`)), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed ${src}`));
    document.head.appendChild(s);
  });
}

export async function ensureLocalCard(tag: string): Promise<boolean> {
  if (customElements.get(tag)) return true;
  const scripts = TAG_SCRIPTS[tag];
  if (!scripts?.length) return false;

  if (tag === "dsc-the-dash-card" && !hasThree()) {
    for (const src of scripts) {
      try {
        await loadScript(src);
      } catch {
        /* optional assets may be absent after HA lab retirement */
      }
      if (hasThree() && customElements.get(tag)) return true;
    }
    return !!customElements.get(tag);
  }

  for (const src of scripts) {
    try {
      await loadScript(src);
    } catch {
      /* ignore missing optional IIFE */
    }
    if (customElements.get(tag)) return true;
  }
  return !!customElements.get(tag);
}

/** Pi SPA: warm Twin assets on cockpit routes (TwinKeepAlive also loads on demand). */
const PI_TWIN_ROUTE = /^\/(live\/(twin|4x8|2x4|main|clone)|ops\/dash)(\/|$)/;

export function piTwinRouteNeedsAssets(pathname: string): boolean {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return PI_TWIN_ROUTE.test(path);
}

export async function preloadPiTwinAssets(): Promise<void> {
  await ensureLocalCard("dsc-the-dash-card");
}
