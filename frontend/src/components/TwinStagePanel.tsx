import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { loadManifest, type TwinModel } from "../twin/manifest";
import type { TwinPalette } from "../twin/wire";
import type { TwinLayers, TwinPick } from "../twin/context";
// Types only, and from the three-free `presets` module: nothing on this page may pull a
// scene module (and with it three.js) into the main bundle.
import type { CameraPreset, TwinStyle } from "../twin/presets";
import type { FrameReport } from "../twin/FrameLoop";
import type { TwinState } from "../lib/twinState";

const TwinStage = lazy(() => import("../twin/TwinStage"));

export function readTwinPalette(el: HTMLElement): TwinPalette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    accent: v("--dsc-neon", "#66bb6a"),
    teal: v("--dsc-teal", "#26c6da"),
    dim: v("--dsc-gray-5", "#8b95a8"),
    bad: v("--dsc-bad", "#ef5350"),
    warn: v("--dsc-amber", "#ffb74d"),
    lamp: v("--dsc-lamp", "#f5c26b"),
    blue: v("--dsc-blue", "#4f9dff"),
    purple: v("--dsc-purple", "#a78bfa"),
    white: v("--dsc-white", "#e8eef8"),
    background: v("--dsc-black", "#0b0e13"),
  };
}

export type TwinGate = { ok: boolean; why: "" | "phone" | "reduced motion" | "no WebGL" | "no window" };

export function twinGate(): TwinGate {
  if (typeof window === "undefined") return { ok: false, why: "no window" };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return { ok: false, why: "reduced motion" };
  if (window.matchMedia("(max-width: 640px)").matches) return { ok: false, why: "phone" };
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return { ok: false, why: "no WebGL" };
  } catch {
    return { ok: false, why: "no WebGL" };
  }
  return { ok: true, why: "" };
}

/**
 * Hosts the twin stage under the plan's rules (§ 3D twin rule 4): mount when in view,
 * pause when hidden, honest still on phones / reduced motion / no WebGL. `force` lets
 * the operator override the phone and reduced-motion gates (the reduced-motion case
 * then renders "calm": no spin, no camera glide).
 */
export function TwinStagePanel({
  state,
  layers,
  style = "wire",
  preset,
  cinematic,
  height = 520,
  force = false,
  onPerf,
  onPick,
  onGate,
}: {
  state: TwinState;
  layers: TwinLayers;
  style?: TwinStyle;
  preset: CameraPreset;
  cinematic: boolean;
  height?: number | string;
  force?: boolean;
  onPerf?: (p: FrameReport) => void;
  onPick?: (p: TwinPick) => void;
  onGate?: (g: TwinGate) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [models, setModels] = useState<TwinModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(() => (typeof document === "undefined" ? true : !document.hidden));
  const [gateTick, setGateTick] = useState(0);

  useEffect(() => {
    const mqs = [window.matchMedia("(max-width: 640px)"), window.matchMedia("(prefers-reduced-motion: reduce)")];
    const bump = () => setGateTick((t) => t + 1);
    mqs.forEach((mq) => mq.addEventListener("change", bump));
    window.addEventListener("resize", bump);
    return () => {
      mqs.forEach((mq) => mq.removeEventListener("change", bump));
      window.removeEventListener("resize", bump);
    };
  }, []);
  const gate = useMemo<TwinGate>(() => {
    const g = twinGate();
    if (force && g.why !== "no WebGL" && g.why !== "no window") return { ok: true, why: g.why };
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [force, gateTick]);
  useEffect(() => {
    onGate?.(gate);
  }, [gate, onGate]);
  const palette = useMemo(() => (hostRef.current ? readTwinPalette(hostRef.current) : null), [seen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    loadManifest()
      .then((m) => alive && setModels(m.models))
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        setInView(hit);
        if (hit) setSeen(true);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const active = seen && inView && visible;
  const still = !gate.ok;
  const calm = gate.ok && gate.why === "reduced motion";
  return (
    <div ref={hostRef} className={`dsc-twin dsc-twin--stage${still ? " is-still" : ""}`} style={{ height }} aria-label="3D twin of the grow room">
      {error ? (
        <div className="dsc-twin-fallback">
          <span className="dsc-legend">3D TWIN</span>
          <p>{error}</p>
        </div>
      ) : still ? (
        <div className="dsc-twin-fallback">
          <span className="dsc-legend">3D TWIN · STILL</span>
          <p>
            The live twin renders on desktop
            {gate.why === "phone" ? "; phones get a still once one is rendered" : gate.why === "reduced motion" ? "; reduced motion shows a still" : ` (${gate.why})`}. Every number it
            would show is already on the cards.
          </p>
        </div>
      ) : models && seen && palette ? (
        <Suspense
          fallback={
            <div className="dsc-twin-fallback">
              <span className="dsc-legend">3D TWIN · LOADING THE RIG</span>
            </div>
          }
        >
          <TwinStage models={models} state={state} palette={palette} layers={layers} style={style} preset={preset} cinematic={cinematic} active={active} calm={calm} onPerf={onPerf} onPick={onPick} />
        </Suspense>
      ) : (
        <div className="dsc-twin-fallback">
          <span className="dsc-legend">3D TWIN</span>
        </div>
      )}
    </div>
  );
}
