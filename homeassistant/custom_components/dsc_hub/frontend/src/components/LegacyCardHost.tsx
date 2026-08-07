import { useEffect, useRef } from "react";

/**
 * Mount a legacy Lovelace custom element (IIFE) into a React host when the
 * global customElements registry already has it (e.g. /local bundle).
 */
export function LegacyCardHost({
  tag,
  config,
}: {
  tag: string;
  config?: Record<string, unknown>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = "";
    if (!customElements.get(tag)) {
      const msg = document.createElement("div");
      msg.className = "dsc-muted";
      msg.style.padding = "24px";
      msg.textContent = `${tag} not loaded yet — open once from Lovelace or ensure /local bundle is registered.`;
      host.appendChild(msg);
      return;
    }
    const el = document.createElement(tag) as HTMLElement & {
      setConfig?: (c: Record<string, unknown>) => void;
      hass?: unknown;
    };
    if (config && typeof el.setConfig === "function") {
      el.setConfig({ type: `custom:${tag}`, ...config });
    }
    host.appendChild(el);

    const hassRoot = document.querySelector("home-assistant") as
      | (HTMLElement & { hass?: unknown })
      | null;
    const sync = () => {
      if (hassRoot?.hass) el.hass = hassRoot.hass;
    };
    sync();
    const id = window.setInterval(sync, 1000);
    return () => {
      window.clearInterval(id);
      host.innerHTML = "";
    };
  }, [tag, config]);

  return <div className="dsc-legacy-host" ref={ref} />;
}
