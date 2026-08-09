/** Script sources that register DSC Lovelace custom elements. */
const SCRIPT_CANDIDATES = [
  "/local/DSC-HUB.js",
  "/local/dsc-system-map-card.js",
  "/hacsfiles/DSC-HUB/DSC-HUB.js",
];

const loading = new Map<string, Promise<void>>();
let attempted = false;

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

/**
 * Ensure a legacy custom element is defined. Injects /local (or HACS) IIFE
 * bundles once when missing.
 */
export async function ensureLocalCard(tag: string, timeoutMs = 12000): Promise<boolean> {
  if (customElements.get(tag)) return true;

  if (!attempted) {
    attempted = true;
    for (const src of SCRIPT_CANDIDATES) {
      try {
        await injectScript(src);
        if (customElements.get(tag)) return true;
      } catch {
        /* try next candidate */
      }
    }
  } else {
    // Scripts already requested — wait for definition / settle.
    await Promise.allSettled([...loading.values()]);
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
