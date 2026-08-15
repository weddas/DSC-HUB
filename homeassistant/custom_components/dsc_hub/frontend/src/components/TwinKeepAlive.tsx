import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHass } from "../hooks/useHass";
import { ensureLocalCard } from "../lib/ensureLocalCards";

type FocusTent = "main" | "clone" | null;

function focusTentFromPath(pathname: string): FocusTent {
  if (pathname === "/live/main") return "main";
  if (pathname === "/live/clone") return "clone";
  return null;
}

/**
 * Persist dsc-the-dash-card across route changes so the Three.js Twin
 * does not cold-dispose on every leave (LegacyCardHost unmount = turd).
 * Active on /live/twin (both tents) and /live/main|/live/clone (single-tent).
 */
export function TwinKeepAlive() {
  const location = useLocation();
  const { hass } = useHass();
  const ref = useRef<HTMLDivElement>(null);
  const elRef = useRef<(HTMLElement & { setConfig?: (c: Record<string, unknown>) => void; hass?: unknown }) | null>(
    null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const focusTent = focusTentFromPath(location.pathname);
  const active =
    location.pathname === "/live/twin" ||
    location.pathname === "/ops/dash" ||
    location.pathname === "/live/main" ||
    location.pathname === "/live/clone";

  useEffect(() => {
    const host = ref.current;
    if (!host || elRef.current) return;
    let cancelled = false;

    (async () => {
      setStatus("loading");
      const ok = await ensureLocalCard("dsc-the-dash-card");
      if (cancelled || !ref.current) return;
      if (!ok) {
        setStatus("missing");
        return;
      }
      const el = document.createElement("dsc-the-dash-card") as HTMLElement & {
        setConfig?: (c: Record<string, unknown>) => void;
        hass?: unknown;
      };
      if (typeof el.setConfig === "function") {
        el.setConfig({ type: "custom:dsc-the-dash-card", focusTent });
      }
      if (hass) el.hass = hass;
      host.appendChild(el);
      elRef.current = el;
      setStatus("ready");
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (elRef.current && hass) elRef.current.hass = hass;
  }, [hass]);

  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof el.setConfig !== "function") return;
    el.setConfig({ type: "custom:dsc-the-dash-card", focusTent });
  }, [focusTent, active]);

  return (
    <div
      className={`dsc-twin-keepalive${active ? " is-active" : ""}`}
      aria-hidden={!active}
      data-status={status}
      data-focus-tent={focusTent || "both"}
    >
      <div className="dsc-twin-keepalive-host" ref={ref} />
      {status === "missing" ? (
        <div className="dsc-empty">
          <strong>dsc-the-dash-card</strong> did not register. Deploy /local/DSC-HUB.js and hard-refresh.
        </div>
      ) : null}
    </div>
  );
}
