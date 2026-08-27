import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEntityBus } from "../hooks/useEntityBus";
import { ensureLocalCard } from "../lib/ensureLocalCards";
import type { TwinCardEl, TwinFocusTent, VesselLive } from "../lib/dsc-twin-api";
import { ALL_POT_NUMBERS, buildPlantSeat, isPotInService, readTent } from "../lib/seatModel";
import { readPotVessel } from "../lib/vesselSpec";
import { readPotTrust } from "../lib/potTrust";

const DscTwinCanvas = lazy(() =>
  import("../twin/DscTwinCanvas").then((m) => ({ default: m.DscTwinCanvas })),
);

const USE_R3F_TWIN = import.meta.env.VITE_DSC_PI === "1";

function focusTentFromPath(pathname: string): TwinFocusTent {
  if (pathname === "/live/main" || pathname === "/live/4x8") return "main";
  if (pathname === "/live/clone" || pathname === "/live/2x4") return "clone";
  return null;
}

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

function buildPots(
  state: ReturnType<typeof useEntityBus>["state"],
  entity: ReturnType<typeof useEntityBus>["entity"],
  num: ReturnType<typeof useEntityBus>["num"],
  hubHeld: boolean,
): VesselLive[] {
  const tentSlots: Record<"clone" | "main", number[]> = { clone: [], main: [] };
  ALL_POT_NUMBERS.forEach((n) => {
    const tent = readTent(state, n);
    if (tent === "clone" || tent === "main") tentSlots[tent].push(n);
  });
  return ALL_POT_NUMBERS.map((n) => {
    const seat = buildPlantSeat(n, { state, entity });
    const vessel = readPotVessel(n, state, entity);
    const trust = readPotTrust(n, state);
    const inService = isPotInService(n, state);
    const tent = readTent(state, n);
    const slot = tent === "clone" || tent === "main" ? Math.max(0, tentSlots[tent].indexOf(n)) : 0;
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
}

/** Persist Twin across routes — R3F on Pi SPA, legacy IIFE elsewhere. */
export function TwinKeepAlive() {
  const location = useLocation();
  const { hass, available, num, state, entity, tick } = useEntityBus();
  const ref = useRef<HTMLDivElement>(null);
  const elRef = useRef<TwinCardEl | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const focusTent = focusTentFromPath(location.pathname);
  const twinVisible = location.pathname === "/live/twin" || location.pathname === "/ops/dash";
  const twinDataActive =
    twinVisible ||
    location.pathname === "/live/main" ||
    location.pathname === "/live/clone" ||
    location.pathname === "/live/4x8" ||
    location.pathname === "/live/2x4";
  const hubHeld = available("binary_sensor.dsc_hub_link")
    ? state("binary_sensor.dsc_hub_link") !== "on"
    : !available("sensor.dsc_hub_uptime");

  const pots = useMemo(
    () => buildPots(state, entity, num, hubHeld),
    [state, entity, num, hubHeld, tick],
  );

  useEffect(() => {
    if (USE_R3F_TWIN) {
      setStatus("ready");
      return;
    }
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
    if (USE_R3F_TWIN) return;
    if (elRef.current && hass) elRef.current.hass = hass;
  }, [hass, tick]);

  useEffect(() => {
    if (USE_R3F_TWIN) return;
    const el = elRef.current;
    if (!el) return;
    el.setFocusTent?.(focusTent);
    el.setUiChrome?.({ hideHud: cockpitHidesHud(location.pathname) });
  }, [focusTent, location.pathname, status]);

  useEffect(() => {
    if (USE_R3F_TWIN) return;
    const el = elRef.current;
    const sync = () => {
      const pause = !twinDataActive || document.hidden;
      el?.pause?.(pause);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [twinDataActive, status]);

  useEffect(() => {
    if (USE_R3F_TWIN) return;
    elRef.current?.setHeld?.(hubHeld);
  }, [hubHeld, status]);

  useEffect(() => {
    if (USE_R3F_TWIN) return;
    const el = elRef.current;
    if (!el?.setPots) return;
    el.setPots(pots);
  }, [pots, status]);

  return (
    <div
      className={`dsc-twin-keepalive${twinVisible ? " is-active" : ""}`}
      aria-hidden={!twinVisible}
      inert={!twinVisible ? true : undefined}
      data-status={status}
      data-focus-tent={focusTent || "both"}
      data-engine={USE_R3F_TWIN ? "r3f" : "iife"}
      style={
        twinVisible
          ? { minHeight: twinVisible ? "min(70vh, 520px)" : undefined }
          : {
              pointerEvents: "none",
              position: "fixed",
              visibility: "hidden",
              inset: 0,
              zIndex: -1,
              overflow: "hidden",
            }
      }
    >
      <div className="dsc-twin-keepalive-host" ref={ref} style={{ width: "100%", height: "100%" }}>
        {USE_R3F_TWIN ? (
          <Suspense fallback={<div className="dsc-empty">Loading twin…</div>}>
            <DscTwinCanvas pots={pots} focusTent={focusTent} held={hubHeld} visible={twinVisible} />
          </Suspense>
        ) : null}
      </div>
      {!USE_R3F_TWIN && status === "missing" ? (
        <div className="dsc-empty">
          <strong>dsc-the-dash-card</strong> did not register. Deploy{" "}
          <code>/local/dsc-the-dash-card.js</code> and hard-refresh.
        </div>
      ) : null}
    </div>
  );
}
