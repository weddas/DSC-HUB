/** Script sources that register DSC Lovelace custom elements. */
/** Cache-bust: HA /local max-age ~31d; bump when Dash/Twin IIFE changes. */
const BUNDLE_V = "7.1.5-bar-raise";

/** Fat umbrella bundle (may contain several cards depending on build). */
const UMBRELLA = [
  `/local/DSC-HUB.js?v=${BUNDLE_V}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${BUNDLE_V}`,
];

/**
 * Prefer the dedicated IIFE for each tag. The umbrella alone is not enough:
 * HA often has a stale DSC-HUB.js while /local/dsc-*-card.js is current.
 */
const TAG_SCRIPTS: Record<string, string[]> = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${BUNDLE_V}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${BUNDLE_V}`],
  "dsc-the-dash-card": [`/local/dsc-the-dash-card.js?v=${BUNDLE_V}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${BUNDLE_V}`],
  "dsc-system-map-card": [
    `/local/dsc-system-map-card.js?v=${BUNDLE_V}`,
    ...UMBRELLA,
  ],
};

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
  // Always try dedicated first, then umbrella (covers tags only in the fat build).
  const out: string[] = [];
  for (const src of [...specific, ...UMBRELLA]) {
    if (!out.includes(src)) out.push(src);
  }
  return out;
}

/**
 * Ensure a legacy custom element is defined. Always injects dedicated
 * /local/dsc-*-card.js first (even if the tag already exists from a stale
 * DSC-HUB.js Lovlace resource) so the card IIFE can upgrade the prototype.
 */
export async function ensureLocalCard(tag: string, timeoutMs = 12000): Promise<boolean> {
  const dedicated = TAG_SCRIPTS[tag] ?? [];
  for (const src of dedicated) {
    try {
      await injectScript(src);
    } catch {
      /* try next */
    }
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
