import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useEntityBus } from "../hooks/useEntityBus";
import type { TwinFocusTent, VesselLive } from "../lib/dsc-twin-api";
import { KIT_PROBE_NUMBERS, buildPlantSeat, isPotInService, readTent } from "../lib/seatModel";
import { readPotVessel } from "../lib/vesselSpec";
import { readPotTrust } from "../lib/potTrust";
import { TWIN_SLOT_ID } from "./TwinViewport";

const DscTwinCanvas = lazy(() =>
  import("../twin/DscTwinCanvas").then((m) => ({ default: m.DscTwinCanvas })),
);

function focusTentFromPath(pathname: string): TwinFocusTent {
  if (pathname === "/live/main" || pathname === "/live/4x8") return "main";
  if (pathname === "/live/clone" || pathname === "/live/2x4") return "clone";
  return null;
}

function buildPots(
  state: ReturnType<typeof useEntityBus>["state"],
  entity: ReturnType<typeof useEntityBus>["entity"],
  num: ReturnType<typeof useEntityBus>["num"],
  hubHeld: boolean,
): VesselLive[] {
  const tentSlots: Record<"clone" | "main", number[]> = { clone: [], main: [] };
  KIT_PROBE_NUMBERS.forEach((n) => {
    const tent = readTent(state, n);
    if (tent === "clone" || tent === "main") tentSlots[tent].push(n);
  });
  return KIT_PROBE_NUMBERS.map((n) => {
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
      dryback: num(`sensor.dsc_probe${n}_dryback_pct`),
      need: seat.need,
      held: hubHeld,
      untrusted: trust.untrusted,
    };
  });
}

/** Persist the R3F Twin across routes so WebGL context / camera survive navigation. */
export function TwinKeepAlive() {
  const location = useLocation();
  const { available, num, state, entity, tick } = useEntityBus();
  const ref = useRef<HTMLDivElement>(null);
  const [slotEl, setSlotEl] = useState<HTMLElement | null>(null);
  const focusTent = focusTentFromPath(location.pathname);
  const twinVisible = location.pathname === "/live/twin" || location.pathname === "/ops/dash";

  const hubHeld = available("binary_sensor.dsc_hub_link")
    ? state("binary_sensor.dsc_hub_link") !== "on"
    : !available("sensor.dsc_hub_uptime");

  const pots = useMemo(
    () => buildPots(state, entity, num, hubHeld),
    [state, entity, num, hubHeld, tick],
  );

  useLayoutEffect(() => {
    if (!twinVisible) {
      setSlotEl(null);
      return;
    }
    setSlotEl(document.getElementById(TWIN_SLOT_ID));
  }, [twinVisible, location.pathname]);

  const twinBody = (
    <div
      className={`dsc-twin-keepalive${twinVisible ? " is-active" : ""}`}
      aria-hidden={!twinVisible}
      inert={!twinVisible ? true : undefined}
      data-focus-tent={focusTent || "both"}
      data-engine="r3f"
      style={
        twinVisible && slotEl
          ? undefined
          : twinVisible
            ? { minHeight: "min(70vh, 520px)" }
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
        <Suspense fallback={<div className="dsc-empty">Loading twin…</div>}>
          <DscTwinCanvas pots={pots} focusTent={focusTent} held={hubHeld} visible={twinVisible} />
        </Suspense>
      </div>
    </div>
  );

  if (twinVisible && slotEl) {
    return createPortal(twinBody, slotEl);
  }
  return twinBody;
}
