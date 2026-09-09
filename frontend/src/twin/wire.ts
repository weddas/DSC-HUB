import * as THREE from "three";
import type { MaterialRole, TwinModel } from "./manifest";
import type { TwinStyle } from "./presets";

export type { TwinStyle };

/** Palette handed in from CSS tokens — the scene never hard-codes a colour. */
export interface TwinPalette {
  accent: string;
  teal: string;
  dim: string;
  bad: string;
  warn: string;
  lamp: string;
  blue: string;
  purple: string;
  white: string;
  background: string;
}

export interface WireStats {
  meshes: number;
  triangles: number;
}

/** One restyled mesh: the fill, its edge lines and the role it was drawn with. */
export interface WirePart {
  mesh: THREE.Mesh;
  fill: THREE.MeshBasicMaterial;
  edges: THREE.LineSegments;
  edgeMat: THREE.LineBasicMaterial;
  role: MaterialRole;
  materialName: string;
  restFill: number;
  restEdge: number;
  restColor: THREE.Color;
}

export interface WireBuild {
  root: THREE.Group;
  stats: WireStats;
  /** Node name → part, for the bindings (fan_blades, lamp_emitter, led_status…). */
  parts: Map<string, WirePart>;
  /** Anchor name → local position (empty named nodes, or a mesh-prefix bbox centre). */
  anchors: Map<string, THREE.Vector3>;
  /** Local bounding box of the fitted model. */
  bounds: THREE.Box3;
}

export function roleStyle(role: MaterialRole, palette: TwinPalette, style: TwinStyle = "wire"): { color: string; fill: number; edge: number } {
  const color = role === "accent" || role === "emissive" ? palette.accent : role === "glass" ? palette.teal : palette.dim;
  const fill =
    role === "glass" ? 0.14 : role === "emissive" ? 0.35 : role === "accent" ? 0.16 : role === "wire" ? 0 : role === "shell" ? 0.05 : 0.08;
  const edge = role === "emissive" ? 1 : role === "accent" ? 0.9 : role === "glass" ? 0.7 : role === "wire" ? 0.45 : role === "shell" ? 0.28 : 0.55;
  if (style === "xray") {
    // Emissive parts keep a trace of fill so a lit lamp still reads as a body, not a cage.
    return { color, fill: role === "emissive" ? fill * 0.5 : 0, edge: Math.min(1, edge * 1.15 + 0.1) };
  }
  if (style === "solid") {
    const solidFill =
      role === "emissive" ? 0.85 : role === "accent" ? 0.7 : role === "glass" ? 0.3 : role === "wire" ? 0.12 : role === "shell" ? 0.6 : 0.5;
    return { color, fill: solidFill, edge: Math.max(0.25, edge * 0.55) };
  }
  return { color, fill, edge };
}

/**
 * Re-style an already-built model in place: the rest colours and opacities move, the
 * geometry and the edge lines do not. `Placed` calls this at the top of its static
 * binding pass, so a style flip costs a material update, not a rebuild.
 */
export function applyStyle(build: WireBuild, palette: TwinPalette, style: TwinStyle): void {
  const solid = style === "solid";
  for (const p of build.parts.values()) {
    const st = roleStyle(p.role, palette, style);
    p.restFill = st.fill;
    p.restEdge = st.edge;
    p.restColor.set(st.color);
    p.fill.depthWrite = solid;
    const side = solid ? THREE.FrontSide : THREE.DoubleSide;
    if (p.fill.side !== side) {
      p.fill.side = side;
      p.fill.needsUpdate = true;
    }
    // X-ray: edges ignore depth so nothing in the rig can hide behind a shell.
    const depthTest = style !== "xray";
    if (p.edgeMat.depthTest !== depthTest) {
      p.edgeMat.depthTest = depthTest;
      p.edgeMat.needsUpdate = true;
    }
    p.edges.renderOrder = style === "xray" ? 2 : 0;
  }
}

/**
 * Restyle a loaded GLB into the holographic wire look (plan § 3D twin rule 3): a faint
 * translucent fill per material role plus edge lines in the same tone. Materials are
 * mapped through the manifest, so a model never carries its own colours.
 *
 * `fit`: hand-authored rows (no build metadata) are normalised to `dims_cm` standing on
 * y = 0; built rows are already in metres with their authored origin and are left alone.
 */
export function toWire(scene: THREE.Group, model: TwinModel, palette: TwinPalette, opts: { fit?: boolean; style?: TwinStyle } = {}): WireBuild {
  const root = scene.clone(true);
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  let triangles = 0;
  const parts = new Map<string, WirePart>();
  for (const m of meshes) {
    const g = m.geometry as THREE.BufferGeometry;
    triangles += Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
    const src = Array.isArray(m.material) ? m.material[0] : m.material;
    const materialName = src?.name ?? "";
    const role = model.materials[materialName] ?? "shell";
    const style = opts.style ?? "wire";
    const st = roleStyle(role, palette, style);
    const fill = new THREE.MeshBasicMaterial({
      color: st.color,
      transparent: true,
      opacity: st.fill,
      depthWrite: style === "solid",
      side: style === "solid" ? THREE.FrontSide : THREE.DoubleSide,
      visible: st.fill > 0,
    });
    m.material = fill;
    const edgeMat = new THREE.LineBasicMaterial({ color: st.color, transparent: true, opacity: st.edge, depthTest: style !== "xray" });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g, 25), edgeMat);
    edges.name = `${m.name}__edges`;
    edges.renderOrder = style === "xray" ? 2 : 0;
    edges.raycast = () => undefined;
    m.add(edges);
    parts.set(m.name, { mesh: m, fill, edges, edgeMat, role, materialName, restFill: st.fill, restEdge: st.edge, restColor: new THREE.Color(st.color) });
  }
  const built = model.origin_y != null || model.meshes != null;
  const fit = opts.fit ?? !built;
  if (fit) {
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const targetH = model.dims_cm[2] / 100;
    const s = size.y > 0 ? targetH / size.y : 1;
    root.scale.setScalar(s);
    const box2 = new THREE.Box3().setFromObject(root);
    const c = new THREE.Vector3();
    box2.getCenter(c);
    // Bake the fit into the children so the root stays a clean placement node.
    const wrap = new THREE.Group();
    wrap.name = root.name;
    const inner = root;
    inner.position.set(-c.x, -box2.min.y, -c.z);
    inner.name = `${root.name}__fit`;
    wrap.add(inner);
    return finish(wrap, model, parts, { meshes: meshes.length, triangles });
  }
  return finish(root, model, parts, { meshes: meshes.length, triangles });
}

function finish(root: THREE.Group, model: TwinModel, parts: Map<string, WirePart>, stats: WireStats): WireBuild {
  root.updateMatrixWorld(true);
  const anchors = new Map<string, THREE.Vector3>();
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  // 1) empty anchor nodes exported by the build harness
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) return;
    if (o === root) return;
    if (o.userData?.anchor || (model.anchors[o.name] && o.children.length === 0)) {
      const p = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld).applyMatrix4(inv);
      anchors.set(o.name, p);
    }
  });
  // 2) manifest anchors that are mesh-name prefixes (hand-authored tent): bbox centre of the group
  const bb = new THREE.Box3();
  for (const key of Object.keys(model.anchors)) {
    if (anchors.has(key)) continue;
    bb.makeEmpty();
    root.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      if (o.name === key || o.name.startsWith(`${key}_`)) bb.expandByObject(o);
    });
    if (!bb.isEmpty()) {
      const c = new THREE.Vector3();
      bb.getCenter(c);
      const cl = c.clone().applyMatrix4(inv);
      anchors.set(key, cl);
      const mn = bb.min.clone().applyMatrix4(inv);
      const mx = bb.max.clone().applyMatrix4(inv);
      anchors.set(`${key}__min`, mn);
      anchors.set(`${key}__max`, mx);
      // centre of the top and bottom faces — where things stand on / hang from a shelf or tray
      anchors.set(`${key}__top`, new THREE.Vector3(cl.x, mx.y, cl.z));
      anchors.set(`${key}__bottom`, new THREE.Vector3(cl.x, mn.y, cl.z));
    }
  }
  const bounds = new THREE.Box3().setFromObject(root);
  return { root, stats, parts, anchors, bounds };
}

/** Dispose everything a wire build created (fills, edge geometries) — the GLTF cache keeps the source. */
export function disposeWire(b: WireBuild): void {
  for (const p of b.parts.values()) {
    p.fill.dispose();
    p.edgeMat.dispose();
    p.edges.geometry.dispose();
  }
}
