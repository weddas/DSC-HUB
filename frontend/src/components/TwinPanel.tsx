import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { findModel, type TwinModel } from "../twin/manifest";
import type { TwinPerf } from "../twin/TwinViewport";
import { readTwinPalette as readPalette } from "./TwinStagePanel";

/** Chunk timing for the lazy `twin-three` import — read by the HUD once the model reports. */
const chunk = { start: 0, ms: null as number | null };
const TwinViewport = lazy(() => {
  chunk.start = performance.now();
  return import("../twin/TwinViewport").then((m) => {
    chunk.ms = Math.round(performance.now() - chunk.start);
    return m;
  });
});

export interface TwinPanelPerf extends TwinPerf {
  chunkMs: number | null;
  bytes: number | null;
}

function canRender3d(): { ok: boolean; why: string } {
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
 * Mounts the 3D twin only when it scrolls into view, pauses it when it leaves or the
 * tab hides, and falls back to an honest dashed still on phones / reduced motion /
 * no WebGL (plan § 3D twin rule 4). Nothing here is a data source — the twin shows
 * *where* a number is, never the number.
 */
export function TwinPanel({
  slug,
  height = 320,
  onPerf,
  force = false,
}: {
  slug: string;
  height?: number;
  onPerf?: (p: TwinPanelPerf) => void;
  /** Spike only: render the live twin even on a phone / reduced motion, to measure it there. */
  force?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<TwinModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(() => (typeof document === "undefined" ? true : !document.hidden));
  // The gate re-evaluates when the viewport or motion preference changes — a page that
  // mounts mid-resize (the in-app preview pane, a phone rotating) must not stay on the still.
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
  const gate = useMemo(() => {
    const g = canRender3d();
    return force && g.why !== "no WebGL" && g.why !== "no window" ? { ok: true, why: "" } : g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [force, gateTick]);
  const palette = useMemo(() => (hostRef.current ? readPalette(hostRef.current) : null), [seen]);

  useEffect(() => {
    let alive = true;
    findModel(slug)
      .then((m) => {
        if (!alive) return;
        if (!m) setError(`no model "${slug}" in the manifest`);
        else setModel(m);
      })
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      alive = false;
    };
  }, [slug]);

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
      { threshold: 0.15 },
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
  const report = useMemo(
    () => (p: TwinPerf) => onPerf?.({ ...p, chunkMs: chunk.ms, bytes: model?.bytes ?? null }),
    [onPerf, model],
  );

  const still = !gate.ok;
  return (
    <div ref={hostRef} className={`dsc-twin${still ? " is-still" : ""}`} style={{ height }} aria-label={model ? `3D twin of ${model.slug}` : "3D twin"}>
      {error ? (
        <div className="dsc-twin-fallback">
          <span className="dsc-legend">3D TWIN</span>
          <p>{error}</p>
        </div>
      ) : still ? (
        <div className="dsc-twin-fallback">
          <span className="dsc-legend">3D TWIN · STILL</span>
          <p>
            The live twin renders on desktop{gate.why === "phone" ? "; phones get a still once one is rendered" : gate.why === "reduced motion" ? "; reduced motion shows a still" : ` (${gate.why})`}.
            Every number it would show is already on the cards.
          </p>
        </div>
      ) : model && seen && palette ? (
        <Suspense fallback={<div className="dsc-twin-fallback"><span className="dsc-legend">3D TWIN · LOADING MODEL</span></div>}>
          <TwinViewport model={model} palette={palette} active={active} onPerf={report} />
        </Suspense>
      ) : (
        <div className="dsc-twin-fallback">
          <span className="dsc-legend">3D TWIN</span>
        </div>
      )}
    </div>
  );
}
