import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getAnchor, registerAnchors, unregisterAnchors, useAnchorSet } from "./anchors";
import { useTwin, type TwinPick } from "./context";
import { resolvePlacement, usePlacementOverride } from "./placements";
import { applyStyle, disposeWire, toWire, type WireBuild, type WirePart } from "./wire";
import { bindingIsLive, fanPeriodSec, type TwinBinding } from "../lib/twinState";

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
  /**
   * Which binding declaration answers for this instance. Defaults to `id`; set it when
   * one declaration covers several placed pieces (a filter riding on its fan). An
   * instance with no declaration at all is drawn — and reported — as unbound.
   */
  bindingId?: string;
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

/** DEV only: an undeclared instance is worth saying once, not once per frame. */
const warnedUndeclared = new Set<string>();

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
export function Placed({ id, slug, bindingId, at: atProp, rotation: rotationProp, self: selfProp, scale: scaleProp, bind, pick, tweak, visible = true, children }: PlacedProps) {
  // plan-spatial-layout S4: where a thing stands is data. The props below are the scene's
  // own literals — they stay the default, and an operator's move overrides them. Doing the
  // lookup here rather than at 36 call sites keeps the parent/child nesting the JSX tree
  // already expresses, and means every placement in the rig is movable for one change.
  const override = usePlacementOverride(id);
  const { at, rotation, self, scale } = resolvePlacement(override, {
    at: atProp,
    rotation: rotationProp,
    self: selfProp,
    scale: scaleProp,
  });

  const ctx = useTwin();
  const model = ctx.models[slug];
  if (!model) {
    // Honest degradation: an unbuilt model leaves a labelled marker where it would stand,
    // never a silent hole and never a stand-in that could be mistaken for the real thing.
    if (import.meta.env.DEV) console.warn(`[twin] no model "${slug}" in the manifest — drawing a "model pending" marker`);
    return <PendingModel id={id} slug={slug} at={at} visible={visible} />;
  }
  // Own boundary: a model still downloading must never hide its siblings (a Suspense
  // reveal re-runs every layout effect under the boundary — see anchors.ts `emit`).
  return (
    <Suspense fallback={null}>
      <Loaded id={id} model={model} bindingId={bindingId} at={at} rotation={rotation} self={self} scale={scale} bind={bind} pick={pick} tweak={tweak} visible={visible}>
        {children}
      </Loaded>
    </Suspense>
  );
}

/** Where a model the library has not built yet would stand: a dim cage plus its slug. */
function PendingModel({ id, slug, at, visible }: { id: string; slug: string; at: PlaceAt; visible: boolean }) {
  const { palette, layers } = useTwin();
  const parentId = "parent" in at ? at.parent : null;
  const parentSet = useAnchorSet(parentId);
  const atKey = keyOf(at);
  const pos = useMemo<THREE.Vector3 | null>(() => {
    if ("position" in at) return new THREE.Vector3(...at.position);
    if (!parentSet) return null;
    const a = at.anchor === "" ? new THREE.Vector3().setFromMatrixPosition(parentSet.matrix) : getAnchor(at.parent, at.anchor);
    if (!a) return null;
    const t = a.clone();
    if (at.offset) t.add(new THREE.Vector3(...at.offset));
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atKey, parentSet]);
  if (!pos || !visible) return null;
  return (
    <group name={`${id}__pending`} position={[pos.x, pos.y + 0.09, pos.z]}>
      <mesh raycast={() => undefined}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshBasicMaterial color={palette.dim} wireframe transparent opacity={0.5} />
      </mesh>
      {layers.labels || layers.bindings ? (
        <Html position={[0, 0.14, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="dsc-twin-plant-label is-muted">
            <b>MODEL PENDING</b>
            <span>{slug}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Loaded({
  id,
  model,
  bindingId,
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
    const b = toWire(gltf.scene, model, ctx.palette, { style: ctx.style });
    tweak?.(b);
    return b;
    // palette changes rebuild; a style change is re-applied in place (applyStyle) and
    // tweak is assumed stable per instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf, model, ctx.palette]);

  // What drives this instance — and whether anything does. An instance the declaration
  // list does not know is treated as unbound: the scene never colours or moves a part on
  // a value it cannot name.
  const binding: TwinBinding | undefined = ctx.state.bindings[bindingId ?? id];
  if (import.meta.env.DEV && !binding && !warnedUndeclared.has(id)) {
    warnedUndeclared.add(id);
    console.warn(`[twin] instance "${id}" (${model.slug}) has no binding declaration in SCENE_NODES — drawn unbound`);
  }
  const live = binding ? bindingIsLive(binding.status) : false;
  // "Dead" = nothing live behind it: out of service, no reading, or nothing declared.
  const dead = !!bind?.offline || !live;
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
    // Style first: it sets the rest colours and opacities every binding then works from.
    applyStyle(build, P, ctx.style);
    for (const p of build.parts.values()) {
      p.fill.color.copy(p.restColor);
      p.edgeMat.color.copy(p.restColor);
      p.fill.opacity = p.restFill;
      p.fill.visible = p.restFill > 0;
      p.edgeMat.opacity = p.restEdge;
      p.mesh.visible = true;
    }
    if (dead) {
      // Two flavours of dead, both grey — an out-of-service device is faded almost out,
      // while unbound scenery (a carbon filter, a passive vent) keeps its silhouette so
      // the rig still reads as the rig. Neither may carry a live colour.
      const faded = !!bind?.offline || binding?.status === "no-data" || binding?.status === "missing";
      for (const p of build.parts.values()) {
        p.fill.color.set(P.dim);
        p.edgeMat.color.set(P.dim);
        p.fill.opacity = faded ? Math.min(p.restFill, 0.03) : Math.min(p.restFill, 0.06);
        p.fill.visible = p.fill.opacity > 0;
        p.edgeMat.opacity = faded ? Math.min(p.restEdge, 0.22) : Math.min(p.restEdge, 0.4);
      }
    }
    for (const t of bind?.tint ?? []) {
      if (dead) break; // a tone is a reading; there is none
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
      // A glow is a claim that something is running. Without a live binding there is no
      // such claim to make, so every emitter stays dark.
      const on = e.on && !dead;
      for (const p of partsFor(build, e.node)) {
        if (on) {
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
    for (const s of bind?.show ?? []) for (const p of partsFor(build, s.node)) p.mesh.visible = dead ? false : s.visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build, bindKey, ctx.palette, ctx.style, dead, binding?.status, restoreTick]);

  // Per-frame bindings: spin, error pulse, hover lift. Motion is a reading too: an
  // instance with nothing live behind it stands still.
  const spinTargets = useMemo(
    () => (dead ? [] : (bind?.spin ?? []).flatMap((s) => partsFor(build, s.node).map((p) => ({ obj: p.mesh, period: fanPeriodSec(s.pct) })))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [build, bindKey, dead],
  );
  const hovered = useRef(false);
  const lastPulse = useRef(0);
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    if (!ctx.calm) for (const t of spinTargets) if (t.period) t.obj.rotateY((Math.PI * 2 * d) / t.period);
    if (bind?.errorPulse && !dead) {
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
      // The hover always says where the number came from — or that there is none.
      const sub = binding
        ? `${STATUS_WORD[binding.status]}${binding.entityId ? ` · ${binding.entityId}` : ""}${binding.value ? ` · ${binding.value}` : ""}`
        : `UNBOUND · no declaration · ${model.slug}`;
      ctx.setHover({ id, label: pick?.label ?? binding?.label ?? model.slug, sub, entityId: pick?.entityId, pos: top });
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
      {settled && visible ? <BindingChip instance={id} binding={binding} slug={model.slug} /> : null}
      {settled ? children : null}
    </>
  );
}

const STATUS_WORD: Record<TwinBinding["status"], string> = {
  live: "LIVE",
  simulated: "SIMULATED",
  held: "HELD",
  "no-data": "NO DATA",
  missing: "MISSING",
  unbound: "UNBOUND",
};

/**
 * The visible half of the honesty contract: a chip over any instance the scene is drawing
 * without a live value behind it. `LAYERS · Bindings` turns it off; the greyed-out look
 * and the hover text stay either way.
 */
function BindingChip({ instance, binding, slug }: { instance: string; binding: TwinBinding | undefined; slug: string }) {
  const { layers } = useTwin();
  const set = useAnchorSet(instance);
  if (!layers.bindings || !set) return null;
  if (binding && bindingIsLive(binding.status)) return null;
  const status = binding?.status ?? "unbound";
  const detail = binding ? binding.note || binding.entityId || "nothing reports it" : `no declaration · ${slug}`;
  const c = new THREE.Vector3();
  set.bounds.getCenter(c);
  return (
    <Html position={[c.x, set.bounds.max.y + 0.06, c.z]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div className="dsc-twin-plant-label is-muted">
        <b>{STATUS_WORD[status]}</b>
        <span>
          {binding?.label ?? instance} · {detail}
        </span>
      </div>
    </Html>
  );
}
