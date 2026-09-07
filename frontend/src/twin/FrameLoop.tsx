import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export const TWIN_FPS_CAP = 30;

export interface FrameReport {
  fps: number | null;
  first: boolean;
  drawCalls: number;
  triangles: number;
}

/**
 * Drives the render loop by hand at a capped rate (plan § 3D twin rule 4: 30 fps cap,
 * pause when hidden or out of view). Mount inside a `<Canvas frameloop="never">`.
 * `useFrame` subscribers still run — `advance` calls them with the elapsed time.
 *
 * Pacing comes from requestAnimationFrame; when a host throttles rAF while the page is
 * still visible (embedded previews, some kiosk shells) a timer takes over at the cap so
 * the twin never freezes with the tab in front.
 */
export function FrameLoop({ active, onFrame }: { active: boolean; onFrame?: (p: FrameReport) => void }) {
  const advance = useThree((s) => s.advance);
  const gl = useThree((s) => s.gl);
  const firstRef = useRef(true);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let timer = 0;
    let last = 0;
    let lastRaf = performance.now();
    let frames = 0;
    let windowStart = performance.now();
    const minGap = 1000 / TWIN_FPS_CAP - 1;
    const tick = (t: number) => {
      if (document.hidden) return;
      if (t - last < minGap) return;
      last = t;
      advance(t);
      frames += 1;
      if (!onFrame) return;
      const first = firstRef.current;
      firstRef.current = false;
      const info = gl.info.render;
      if (first) onFrame({ fps: null, first: true, drawCalls: info.calls, triangles: info.triangles });
      if (t - windowStart >= 2000) {
        onFrame({ fps: (frames * 1000) / (t - windowStart), first: false, drawCalls: info.calls, triangles: info.triangles });
        frames = 0;
        windowStart = t;
      }
    };
    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      lastRaf = t;
      tick(t);
    };
    raf = requestAnimationFrame(step);
    // Fallback pacing: only acts when rAF has been silent for a quarter second.
    timer = window.setInterval(() => {
      const now = performance.now();
      if (now - lastRaf > 250) tick(now);
    }, 1000 / TWIN_FPS_CAP);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
    };
  }, [active, advance, gl, onFrame]);
  return null;
}
