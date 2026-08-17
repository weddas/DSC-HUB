import { useEffect, useRef, useState } from "react";
import { useHass } from "../hooks/useHass";
import { ensureLocalCard, localCardScriptHints } from "../lib/ensureLocalCards";

/**
 * Mount a legacy Lovelace custom element (IIFE) into a React host.
 * Auto-injects /local DSC-HUB bundles when the tag is not yet registered.
 * Remount only when `tag` changes — config object identity is not a dep.
 */
export function LegacyCardHost({
  tag,
  config,
}: {
  tag: string;
  config?: Record<string, unknown>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { hass, tick } = useHass();
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const elRef = useRef<(HTMLElement & { setConfig?: (c: Record<string, unknown>) => void; hass?: unknown }) | null>(
    null,
  );
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    const cfg = configRef.current ?? {};

    (async () => {
      setStatus("loading");
      host.innerHTML = "";
      const ok = await ensureLocalCard(tag);
      if (cancelled || !ref.current) return;
      if (!ok) {
        setStatus("missing");
        const msg = document.createElement("div");
        msg.className = "dsc-empty";
        const tried = localCardScriptHints(tag).join(", ");
        msg.innerHTML = `<strong>${tag}</strong> did not register.<br/>Tried ${tried}. Deploy the card IIFE under /config/www (or add a Lovelace resource), then hard-refresh.`;
        host.appendChild(msg);
        return;
      }

      const el = document.createElement(tag) as HTMLElement & {
        setConfig?: (c: Record<string, unknown>) => void;
        hass?: unknown;
      };
      if (typeof el.setConfig === "function") {
        el.setConfig({ type: `custom:${tag}`, ...cfg });
      }
      if (hass) el.hass = hass;
      host.appendChild(el);
      elRef.current = el;
      setStatus("ready");
    })();

    return () => {
      cancelled = true;
      elRef.current = null;
      host.innerHTML = "";
    };
    // hass synced in separate effect; remount only when the custom element tag changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  useEffect(() => {
    if (elRef.current && hass) {
      elRef.current.hass = hass;
    }
  }, [hass, tick]);

  return (
    <div
      className={`dsc-legacy-host${status === "missing" ? " dsc-legacy-host--empty" : ""}`}
      ref={ref}
      data-status={status}
    />
  );
}
