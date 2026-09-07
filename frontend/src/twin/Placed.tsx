import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getAnchor, registerAnchors, unregisterAnchors, useAnchorSet } from "./anchors";
import { useTwin, type TwinPick } from "./context";
import { disposeWire, toWire, type WireBuild, type WirePart } from "./wire";
import { fanPeriodSec } from "../lib/twinState";

export type Vec3 = [number, number, number];

/** Where a model stands: snapped to a parent instance's anchor, or at a world position. */
export type PlaceAt = { parent: string; anchor: string; offset?: Vec3 } | { position: Vec3 };

export type EmissiveTone = "lamp" | "heat" | "ok" | "warn" | "bad" | "teal" | "dim";

export interface Binding {
  /** Rotate the named node about its local Y (the blade axis by construction) at the duty's period. */
  spin?: Array<{ node: string | RegExp; pct: number }>;
  /** Light a part by state: fill brightens, edges go full, colour by tone. `level` 0–1 scales the glow. */
  emissive?: Array<{ node: string | RegExp; on: boolean; level?: number; tone?: EmissiveTone }>;
  /** Show or hide a part (mist plume, bubbles, water plane). */
  show?: Array<{ node: string | RegExp; visible: boolean }>;
  /** Recolour parts without the glow — by node name (leaf tone by VPD band) or by material (tent trim by zone tone). */
  tint?: Array<{ node?: string | RegExp; material?: string; tone: EmissiveTone }>;
  /** The bad condition is current: edges pulse in the bad tone. */
  errorPulse?: boolean;
  /** Out of service / offline: everything grey and faint (the honest dashed look). */
  offline?: boolean;
}

export interface PlacedProps {
  id: string;
  slug: string;
  at: PlaceAt;
  /** Euler rotation of the instance (radians). */
  rotation?: Vec3;
  /** Local anchor (or the midpoint of two) that lands on the target point. Default: the model origin. */
  self?: string | [string, string];
  scale?: number | Vec3;
  bind?: Binding;
  pick?: TwinPick;
  /** Post-build hook: per-node scaling and the like. Runs once per build. */
  tweak?: (b: WireBuild) => void;
  visible?: boolean;
  children?: ReactNode;
}

function matches(name: string, pat: string | RegExp): boolean {
  return typeof pat === "string" ? name === pat : pat.test(name);
}

/** Stable key for props that callers write inline (arrays, RegExps) — effects key on values, not identity. */
function keyOf(v: unknown): string {
  return JSON.stringify(v, (_k, x) => (x instanceof RegExp ? `re:${x.source}` : x)) ?? "";
}

function partsFor(b: WireBuild, pat: string | RegExp): WirePart[] {
  const out: WirePart[] = [];
  for (const [name, p] of b.parts) if (matches(name, pat)) out.push(p);
  return out;
}

function toneColor(t: EmissiveTone | undefined, palette: ReturnType<typeof useTwin>["palette"]): string {
  switch (t) {
    case "lamp":
      return palette.lamp;
    case "heat":
      return palette.warn;
    case "warn":
      return palette.warn;
    case "bad":
      return palette.bad;
    case "teal":
      return palette.teal;
    case "dim":
      return palette.dim;
    default:
      return palette.accent;
  }
}

/**
 * One model in the scene: loads its GLB, restyles it into the wire look, snaps to its
 * parent's anchor, publishes its own anchors, and applies the live bindings each frame.
 * Children render only once this instance has settled, so `<Placed at={{parent: id}}>`
 * inside it always finds its anchor.
 */
export function Placed({ id, slug, at, rotation, self, scale, bind, pick, tweak, visible = true, children }: PlacedProps) {
  const ctx = useTwin();
  const model = ctx.models[slug];
  if (!model) {
    if (import.meta.env.DEV) console.warn(`[twin] no model "${slug}" in the manifest`);
    return null;
  }
  // Own boundary: a model still downloading must never hide its siblings (a Suspense
  // reveal re-runs every layout effect under the boundary — see anchors.ts `emit`).
  return (
    <Suspense fallback={null}>
      <Loaded id={id} model={model} at={at} rotation={rotation} self={self} scale={scale} bind={bind} pick={pick} tweak={tweak} visible={visible}>
        {children}
      </Loaded>
    </Suspense>
  );
}

function Loaded({
  id,
  model,
  at,
  rotation,
  self,
  scale,
  bind,
  pick,
  tweak,
  visible,
  children,
}: Omit<PlacedProps, "slug"> & { model: NonNullable<ReturnType<typeof useTwin>["models"][string]> }) {
  const ctx = useTwin();
  const gltf = useGLTF(model.file);
  const build = useMemo(() => {
    const b = toWire(gltf.scene, model, ctx.palette);
    tweak?.(b);
    return b;
    // palette changes rebuild; tweak is assumed stable per instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf, model, ctx.palette]);
  useEffect(() => () => disposeWire(build), [build]);

  const parentId = "parent" in at ? at.parent : null;
  const parentSet = useAnchorSet(parentId);
  const atKey = keyOf(at);
  const poseKey = keyOf([rotation ?? null, scale ?? null, self ?? null]);
  const target = useMemo<THREE.Vector3 | null>(() => {
    if ("position" in at) return new THREE.Vector3(...at.position);
    if (!parentSet) return null;
    // "" = the parent's own origin (its floor-contact centre) — for "stands in the tent at an offset".
    const a = at.anchor === "" ? new THREE.Vector3().setFromMatrixPosition(parentSet.matrix) : getAnchor(at.parent, at.anchor);
    if (!a) {
      if (import.meta.env.DEV) console.warn(`[twin] ${id}: parent "${at.parent}" has no anchor "${at.anchor}"`);
      return null;
    }
    const t = a.clone();
    if (at.offset) t.add(new THREE.Vector3(...at.offset));
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atKey, parentSet, id]);

  const [settled, setSettled] = useState(false);
  const root = build.root;

  // Place + publish anchors. Layout effect so children mounting in the same commit find them.
  // Keyed on the pose *values*: callers write rotation/offset arrays inline.
  useLayoutEffect(() => {
    if (!target) return;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...(rotation ?? [0, 0, 0])));
    const s = typeof scale === "number" ? new THREE.Vector3(scale, scale, scale) : scale ? new THREE.Vector3(...scale) : new THREE.Vector3(1, 1, 1);
    let selfLocal = new THREE.Vector3();
    if (self) {
      const names = Array.isArray(self) ? self : [self];
      const pts = names.map((n) => build.anchors.get(n)).filter((v): v is THREE.Vector3 => !!v);
      if (pts.length) selfLocal = pts.reduce((acc, p) => acc.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
      else if (import.meta.env.DEV) console.warn(`[twin] ${id}: self anchor ${names.join("/")} not in ${model.slug}`);
    }
    const off = selfLocal.clone().multiply(s).applyQuaternion(q);
    root.position.copy(target).sub(off);
    root.quaternion.copy(q);
    root.scale.copy(s);
    root.updateMatrixWorld(true);
    const pos = new Map<string, THREE.Vector3>();
    for (const [name, p] of build.anchors) pos.set(name, root.localToWorld(p.clone()));
    registerAnchors(id, { pos, matrix: root.matrixWorld.clone(), bounds: new THREE.Box3().setFromObject(root) });
    setSettled(true);
    return () => {
      unregisterAnchors(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build, target, poseKey, id, root, model.slug]);

  // Static bindings: emissive, show, tint, offline — applied when they change, not per frame.
  // `restoreTick` re-runs the pass after a hover lift so the rest state comes back exactly.
  const [restoreTick, setRestore] = useState(0);
  const bindKey = keyOf(bind ?? null);
  useEffect(() => {
    void restoreTick;
    const P = ctx.palette;
    for (const p of build.parts.values()) {
      p.fill.color.copy(p.restColor);
      p.edgeMat.color.copy(p.restColor);
      p.fill.opacity = p.restFill;
      p.fill.visible = p.restFill > 0;
      p.edgeMat.opacity = p.restEdge;
      p.mesh.visible = true;
    }
    if (bind?.offline) {
      for (const p of build.parts.values()) {
        p.fill.color.set(P.dim);
        p.edgeMat.color.set(P.dim);
        p.fill.opacity = Math.min(p.restFill, 0.03);
        p.edgeMat.opacity = Math.min(p.restEdge, 0.22);
      }
    }
    for (const t of bind?.tint ?? []) {
      const c = toneColor(t.tone, P);
      const targets = t.node ? partsFor(build, t.node) : [...build.parts.values()].filter((p) => p.materialName === t.material);
      for (const p of targets) {
        p.fill.color.set(c);
        p.edgeMat.color.set(c);
      }
    }
    for (const e of bind?.emissive ?? []) {
      const c = toneColor(e.tone, P);
      const lvl = Math.max(0, Math.min(1, e.level ?? 1));
      for (const p of partsFor(build, e.node)) {
        if (e.on) {
          p.fill.color.set(c);
          p.edgeMat.color.set(c);
          p.fill.opacity = 0.3 + 0.55 * lvl;
          p.fill.visible = true;
          p.edgeMat.opacity = 1;
        } else {
          p.fill.color.set(P.dim);
          p.edgeMat.color.set(P.dim);
          p.fill.opacity = 0.04;
          p.edgeMat.opacity = 0.35;
        }
      }
    }
    for (const s of bind?.show ?? []) for (const p of partsFor(build, s.node)) p.mesh.visible = s.visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build, bindKey, ctx.palette, restoreTick]);

  // Per-frame bindings: spin, error pulse, hover lift.
  const spinTargets = useMemo(
    () => (bind?.spin ?? []).flatMap((s) => partsFor(build, s.node).map((p) => ({ obj: p.mesh, period: fanPeriodSec(s.pct) }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [build, bindKey],
  );
  const hovered = useRef(false);
  const lastPulse = useRef(0);
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    if (!ctx.calm) for (const t of spinTargets) if (t.period) t.obj.rotateY((Math.PI * 2 * d) / t.period);
    if (bind?.errorPulse) {
      lastPulse.current += d;
      const k = 0.5 + 0.5 * Math.sin((lastPulse.current / 2.4) * Math.PI * 2);
      for (const p of build.parts.values()) {
        p.edgeMat.color.set(ctx.palette.bad);
        p.edgeMat.opacity = 0.35 + 0.65 * k;
      }
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    if (!pick && !ctx.layers.labels) return;
    e.stopPropagation();
    if (!hovered.current) {
      hovered.current = true;
      for (const p of build.parts.values()) {
        p.edgeMat.opacity = Math.min(1, p.edgeMat.opacity * 1.6 + 0.15);
        p.fill.opacity = Math.min(0.9, p.fill.opacity * 1.5 + 0.03);
      }
    }
    if (ctx.hover?.id !== id) {
      const set = build.bounds;
      const top = new THREE.Vector3((set.min.x + set.max.x) / 2, set.max.y, (set.min.z + set.max.z) / 2);
      root.localToWorld(top);
      ctx.setHover({ id, label: pick?.label ?? model.slug, sub: pick?.entityId, entityId: pick?.entityId, pos: top });
    }
    document.body.style.cursor = pick ? "pointer" : "default";
  };
  const out = () => {
    if (hovered.current) {
      hovered.current = false;
      // Restore by re-running the static pass: cheapest is to nudge the effect via a state tick.
      setRestore((n) => n + 1);
    }
    if (ctx.hover?.id === id) ctx.setHover(null);
    document.body.style.cursor = "default";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    if (!pick) return;
    e.stopPropagation();
    ctx.onPick?.(pick);
  };

  return (
    <>
      <primitive object={root} visible={visible} onPointerOver={over} onPointerOut={out} onClick={click} />
      {settled ? children : null}
    </>
  );
}
