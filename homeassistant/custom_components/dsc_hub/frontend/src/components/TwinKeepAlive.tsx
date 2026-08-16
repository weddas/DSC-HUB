import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHass } from "../hooks/useHass";
import { ensureLocalCard } from "../lib/ensureLocalCards";
import type { TwinCardEl, TwinFocusTent, VesselLive } from "../lib/dsc-twin-api";
import { ALL_POT_NUMBERS, buildPlantSeat, isPotInService, readTent } from "../lib/seatModel";
import { readPotVessel } from "../lib/vesselSpec";
import { readPotTrust } from "../lib/potTrust";

function focusTentFromPath(pathname: string): TwinFocusTent {
  if (pathname === "/live/main" || pathname === "/live/4x8") return "main";
  if (pathname === "/live/clone" || pathname === "/live/2x4") return "clone";
  return null;
}

/** Panel owns chrome. IIFE HUD/charts/rail stay off on every Twin host route. */
function cockpitHidesHud(pathname: string): boolean {
  return (
    pathname === "/live/twin" ||
    pathname === "/ops/dash" ||
    pathname === "/live/main" ||
    pathname === "/live/clone" ||
    pathname === "/live/4x8" ||
    pathname === "/live/2x4"
  );
}

/**
 * Persist dsc-the-dash-card across route changes so the Three.js Twin
 * does not cold-dispose on every leave.
 * Focus tent via setFocusTent — never setConfig for focus (I-11).
 * Pause rAF when not .is-active or document.hidden (I-12).
 */
export function TwinKeepAlive() {
  const location = useLocation();
  const { hass, available, num, state, entity } = useHass();
  const ref = useRef<HTMLDivElement>(null);
  const elRef = useRef<TwinCardEl | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const focusTent = focusTentFromPath(location.pathname);
  const active =
    location.pathname === "/live/twin" ||
    location.pathname === "/ops/dash" ||
    location.pathname === "/live/main" ||
    location.pathname === "/live/clone" ||
    location.pathname === "/live/4x8" ||
    location.pathname === "/live/2x4";
  const hubHeld = available("binary_sensor.dsc_hub_link")
    ? state("binary_sensor.dsc_hub_link") !== "on"
    : !available("sensor.dsc_hub_uptime");

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
      const el = document.createElement("dsc-the-dash-card") as TwinCardEl;
      if (typeof el.setConfig === "function") {
        el.setConfig({ type: "custom:dsc-the-dash-card" });
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
    if (!el) return;
    el.setFocusTent?.(focusTent);
    el.setUiChrome?.({ hideHud: cockpitHidesHud(location.pathname) });
  }, [focusTent, location.pathname, status]);

  useEffect(() => {
    const el = elRef.current;
    const sync = () => {
      const pause = !active || document.hidden;
      el?.pause?.(pause);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active, status]);

  useEffect(() => {
    elRef.current?.setHeld?.(hubHeld);
  }, [hubHeld, status]);

  useEffect(() => {
    const el = elRef.current;
    if (!el?.setPots) return;
    const tentSlots: Record<"clone" | "main", number[]> = { clone: [], main: [] };
    ALL_POT_NUMBERS.forEach((n) => {
      const tent = readTent(state, n);
      if (tent === "clone" || tent === "main") tentSlots[tent].push(n);
    });
    const pots: VesselLive[] = ALL_POT_NUMBERS.map((n) => {
      const seat = buildPlantSeat(n, { state, entity });
      const vessel = readPotVessel(n, state, entity);
      const trust = readPotTrust(n, state);
      const inService = isPotInService(n, state);
      const tent = readTent(state, n);
      const slot =
        tent === "clone" || tent === "main" ? Math.max(0, tentSlots[tent].indexOf(n)) : 0;
      return {
        id: `pot${n}`,
        pot: n,
        tent,
        slot,
        inService,
        silhouette: vessel.silhouette,
        moisture: Number(seat.moisture),
        ec: Number(seat.ec),
        ph: Number(seat.ph),
        soilT: Number(seat.soilTemp),
        dryback: num(`sensor.dsc_pot${n}_dryback_pct`),
        need: seat.need,
        held: hubHeld,
        untrusted: trust.untrusted,
      };
    });
    el.setPots(pots);
  }, [state, entity, num, hubHeld, status]);

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
          <strong>dsc-the-dash-card</strong> did not register. Deploy{" "}
          <code>/local/dsc-the-dash-card.js</code> and hard-refresh.
        </div>
      ) : null}
    </div>
  );
}
