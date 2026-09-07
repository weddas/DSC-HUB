import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { TwinModel } from "./manifest";

/** Palette handed in from CSS tokens — the scene never hard-codes a colour. */
export interface TwinPalette {
  accent: string;
  teal: string;
  dim: string;
  bad: string;
  background: string;
}

export interface TwinPerf {
  /** GLB fetch + parse, from viewport mount to the model's first render. */
  loadMs: number | null;
  /** From viewport mount to the first advanced frame. */
  firstFrameMs: number | null;
  /** Rolling frames-per-second over the last two-second window. */
  fps: number | null;
  meshes: number;
  triangles: number;
  drawCalls: number;
  /** Triangles the renderer actually drew last frame (after culling). */
  renderedTriangles: number;
}

interface WireStats {
  meshes: number;
  triangles: number;
}

/** Result of a synchronous frame bench — works even when the tab is hidden (no rAF). */
export interface TwinBench {
  frames: number;
  msPerFrame: number;
  fpsUncapped: number;
  drawCalls: number;
  triangles: number;
}

declare global {
  interface Window {
    __twinBench?: (frames?: number) => TwinBench;
  }
}

/**
 * Renders N frames back to back with `gl.finish()` after each, so the number includes
 * GPU completion, not just JS submission. Exposed on `window.__twinBench` for the spike
 * page and for reading from a remote tab; costs nothing until called.
 */
function Bench() {
  const advance = useThree((s) => s.advance);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    window.__twinBench = (frames = 60) => {
      const ctx = gl.getContext() as WebGLRenderingContext;
      const t0 = performance.now();
      for (let i = 0; i < frames; i++) {
        advance(performance.now());
        ctx.finish();
      }
      const ms = (performance.now() - t0) / frames;
      return {
        frames,
        msPerFrame: Math.round(ms * 100) / 100,
        fpsUncapped: Math.round(1000 / ms),
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
      };
    };
    return () => {
      delete window.__twinBench;
    };
  }, [advance, gl]);
  return null;
}

const FPS_CAP = 30;

/**
 * Restyle a loaded GLB into the holographic wire look (plan § 3D twin rule 3): a faint
 * translucent fill per material role plus edge lines in the same tone. Materials are
 * mapped through the manifest, so a model never carries its own colours.
 */
function toWire(scene: THREE.Group, model: TwinModel, palette: TwinPalette): { root: THREE.Group; stats: WireStats } {
  const root = scene.clone(true);
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  let triangles = 0;
  for (const m of meshes) {
    const g = m.geometry as THREE.BufferGeometry;
    triangles += Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
    const mat = Array.isArray(m.material) ? m.material[0] : m.material;
    const role = model.materials[mat?.name ?? ""] ?? "shell";
    const color =
      role === "accent" ? palette.accent : role === "glass" ? palette.teal : role === "frame" ? palette.dim : palette.dim;
    const fillOpacity = role === "glass" ? 0.14 : role === "accent" ? 0.16 : role === "shell" ? 0.05 : 0.08;
    const edgeOpacity = role === "accent" ? 0.9 : role === "glass" ? 0.7 : role === "shell" ? 0.28 : 0.55;
    m.material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: fillOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(g, 25),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: edgeOpacity }),
    );
    edges.name = `${m.name}__edges`;
    m.add(edges);
  }
  // Normalise: 1 unit = 1 m, model standing on y = 0, centred on x/z.
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const targetH = model.dims_cm[2] / 100;
  const s = size.y > 0 ? targetH / size.y : 1;
  root.scale.setScalar(s);
  const box2 = new THREE.Box3().setFromObject(root);
  const c = new THREE.Vector3();
  box2.getCenter(c);
  root.position.set(-c.x, -box2.min.y, -c.z);
  return { root, stats: { meshes: meshes.length, triangles } };
}

function WireModel({
  model,
  palette,
  onStats,
}: {
  model: TwinModel;
  palette: TwinPalette;
  onStats: (s: WireStats) => void;
}) {
  const gltf = useGLTF(model.file);
  const built = useMemo(() => toWire(gltf.scene, model, palette), [gltf, model, palette]);
  useEffect(() => {
    onStats(built.stats);
  }, [built, onStats]);
  return <primitive object={built.root} />;
}

/**
 * Drives the render loop by hand at a capped rate (rule 4: 30 fps cap, pause when
 * hidden or out of view). `frameloop="never"` on the Canvas hands us `advance`.
 */
function FrameCap({ active, onFrame }: { active: boolean; onFrame: (p: { fps: number | null; first: boolean; drawCalls: number; triangles: number }) => void }) {
  const advance = useThree((s) => s.advance);
  const gl = useThree((s) => s.gl);
  const firstRef = useRef(true);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    let frames = 0;
    let windowStart = performance.now();
    const minGap = 1000 / FPS_CAP - 1;
    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      if (document.hidden) return;
      if (t - last < minGap) return;
      last = t;
      advance(t);
      frames += 1;
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
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, advance, gl, onFrame]);
  return null;
}

/**
 * The twin viewport: one model in the wire look over a transparent canvas so the
 * grid wash reads through. Loaded as the lazy `twin-three` chunk; the wrapper
 * (`components/TwinPanel.tsx`) decides when to mount it and when to pause it.
 */
export default function TwinViewport({
  model,
  palette,
  active,
  onPerf,
}: {
  model: TwinModel;
  palette: TwinPalette;
  /** In view and tab visible — the loop stops when false. */
  active: boolean;
  onPerf: (p: TwinPerf) => void;
}) {
  const t0 = useRef(performance.now());
  const perf = useRef<TwinPerf>({
    loadMs: null,
    firstFrameMs: null,
    fps: null,
    meshes: 0,
    triangles: 0,
    drawCalls: 0,
    renderedTriangles: 0,
  });
  const emit = () => onPerf({ ...perf.current });
  const onStats = useMemo(
    () => (s: WireStats) => {
      perf.current.meshes = s.meshes;
      perf.current.triangles = s.triangles;
      if (perf.current.loadMs == null) perf.current.loadMs = Math.round(performance.now() - t0.current);
      emit();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const onFrame = useMemo(
    () => (p: { fps: number | null; first: boolean; drawCalls: number; triangles: number }) => {
      if (p.first) perf.current.firstFrameMs = Math.round(performance.now() - t0.current);
      if (p.fps != null) perf.current.fps = Math.round(p.fps * 10) / 10;
      perf.current.drawCalls = p.drawCalls;
      perf.current.renderedTriangles = p.triangles;
      emit();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const h = model.dims_cm[2] / 100;
  return (
    <Canvas
      frameloop="never"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [h * 1.45, h * 0.8, h * 1.7], fov: 36, near: 0.05, far: 50 }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={[palette.background]} />
      <Suspense fallback={null}>
        <WireModel model={model} palette={palette} onStats={onStats} />
      </Suspense>
      <gridHelper args={[4, 16, palette.dim, palette.dim]} position={[0, 0, 0]}>
        <lineBasicMaterial attach="material" color={palette.dim} transparent opacity={0.18} />
      </gridHelper>
      <OrbitControls target={[0, h / 2, 0]} enablePan={false} minDistance={h} maxDistance={h * 4} makeDefault />
      <FrameCap active={active} onFrame={onFrame} />
      <Bench />
    </Canvas>
  );
}
