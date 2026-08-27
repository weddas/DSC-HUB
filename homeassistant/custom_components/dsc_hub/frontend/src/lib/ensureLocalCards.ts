/** Script sources that register DSC Lovelace custom elements. */
/** Cache-bust: HA /local max-age ~31d; bump when Dash/Twin IIFE changes. */
const BUNDLE_V = "7.3.0";

const PI_MODE = import.meta.env.VITE_DSC_PI === "1";

/** Fat umbrella bundle (may contain several cards depending on build). */
const UMBRELLA = PI_MODE
  ? []
  : [
      `/local/DSC-HUB.js?v=${BUNDLE_V}`,
      `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${BUNDLE_V}`,
    ];

const THREE_JS = PI_MODE
  ? `/vendor/three.min.js?v=${BUNDLE_V}`
  : `/local/vendor/three.min.js?v=${BUNDLE_V}`;
const DASH_FX = PI_MODE
  ? `/vendor/dsc-dash-fx.js?v=${BUNDLE_V}`
  : `/local/vendor/dsc-dash-fx.js?v=${BUNDLE_V}`;

/**
 * Prefer the dedicated IIFE for each tag. The umbrella alone is not enough:
 * HA often has a stale DSC-HUB.js while /local/dsc-*-card.js is current.
 *
 * dsc-the-dash-card is not self-contained: it reads the THREE global at
 * render time. Load vendor/three.min.js (then dash-fx) before the card IIFE.
 */
const TAG_SCRIPTS: Record<string, string[]> = {
  "dsc-catalog-browse-card": PI_MODE
    ? []
    : [`/local/dsc-catalog-browse-card.js?v=${BUNDLE_V}`],
  "dsc-build-plant-card": PI_MODE ? [] : [`/local/dsc-build-plant-card.js?v=${BUNDLE_V}`],
  "dsc-the-dash-card": PI_MODE
    ? [THREE_JS, DASH_FX, `/dsc-the-dash-card.js?v=${BUNDLE_V}`]
    : [THREE_JS, DASH_FX, `/local/dsc-the-dash-card.js?v=${BUNDLE_V}`],
  "dsc-airflow-map-card": PI_MODE
    ? [`/dsc-airflow-map-card.js?v=${BUNDLE_V}`]
    : [`/local/dsc-airflow-map-card.js?v=${BUNDLE_V}`],
  "dsc-system-map-card": PI_MODE
    ? [`/dsc-system-map-card.js?v=${BUNDLE_V}`]
    : [`/local/dsc-system-map-card.js?v=${BUNDLE_V}`, ...UMBRELLA],
};

type ThreeHolder = { THREE?: unknown };

function hasThree(): boolean {
  return typeof (globalThis as ThreeHolder).THREE !== "undefined";
}

const loading = new Map<string, Promise<void>>();

function injectScript(src: string): Promise<void> {
  const existing = document.querySelector(`script[data-dsc-autoload="${src}"]`);
  if (existing) {
    return loading.get(src) ?? Promise.resolve();
  }
  if (loading.has(src)) return loading.get(src)!;

  const p = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.dataset.dscAutoload = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
  loading.set(src, p);
  return p;
}

function candidatesFor(tag: string): string[] {
  const specific = TAG_SCRIPTS[tag] ?? [];
  const out: string[] = [];
  for (const src of [...specific, ...UMBRELLA]) {
    if (!out.includes(src)) out.push(src);
  }
  return out;
}

/** THREE global from vendor/three.min.js, or the concatenated umbrella. */
async function ensureThree(): Promise<boolean> {
  if (hasThree()) return true;
  for (const src of [THREE_JS, ...UMBRELLA]) {
    if (!src) continue;
    try {
      await injectScript(src);
    } catch {
      /* try next */
    }
    if (hasThree()) return true;
  }
  return hasThree();
}

/**
 * Ensure a legacy custom element is defined. Always injects dedicated
 * /local/dsc-*-card.js first (even if the tag already exists from a stale
 * DSC-HUB.js Lovlace resource) so the card IIFE can upgrade the prototype.
 *
 * For The Dash / Twin: THREE must be on globalThis before the card renders,
 * or the IIFE paints "THREE.js not loaded — redeploy DSC-HUB bundle."
 */
export async function ensureLocalCard(tag: string, timeoutMs = 12000): Promise<boolean> {
  if (tag === "dsc-the-dash-card") {
    await ensureThree();
    if (hasThree()) {
      try {
        await injectScript(DASH_FX);
      } catch {
        /* cinematic FX is optional; the scene still needs THREE */
      }
    }
  }

  const dedicated = TAG_SCRIPTS[tag] ?? [];
  for (const src of dedicated) {
    if (!src) continue;
    try {
      await injectScript(src);
    } catch {
      /* try next */
    }
  }

  if (tag === "dsc-the-dash-card" && !hasThree()) {
    await ensureThree();
  }

  if (customElements.get(tag)) return true;

  for (const src of UMBRELLA) {
    try {
      await injectScript(src);
    } catch {
      /* try next */
    }
    if (customElements.get(tag)) return true;
  }

  try {
    await Promise.race([
      customElements.whenDefined(tag),
      new Promise<void>((_, reject) =>
        window.setTimeout(() => reject(new Error("timeout")), timeoutMs),
      ),
    ]);
    return !!customElements.get(tag);
  } catch {
    return !!customElements.get(tag);
  }
}

/** Paths tried for a tag — used in missing-card UI copy. */
export function localCardScriptHints(tag: string): string[] {
  return candidatesFor(tag).map((s) => s.split("?")[0]!);
}

/** Pi SPA: warm THREE + Dash card on twin/cockpit routes (TwinKeepAlive also loads on demand). */
const PI_TWIN_ROUTE = /^\/(live\/(twin|4x8|2x4|main|clone)|ops\/dash)(\/|$)/;

export function piTwinRouteNeedsAssets(pathname: string): boolean {
  return PI_MODE && PI_TWIN_ROUTE.test(pathname);
}

export async function preloadPiTwinAssets(): Promise<void> {
  if (!PI_MODE) return;
  await ensureLocalCard("dsc-the-dash-card");
}

/*
 * DSC-HUB.js drift: homeassistant/www/DSC-HUB.js may lag dist/ until ha-sync rebuilds
 * the fat concat bundle. This loader always prefers dedicated /dsc-*-card.js IIFEs.
 */
