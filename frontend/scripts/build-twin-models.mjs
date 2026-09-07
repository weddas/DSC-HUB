/**
 * Build the 3D twin's GLBs from the operator's model sources.
 *
 *   docs/design/models/src/pack/*.js  →  frontend/public/models/<slug>[--variant].glb
 *                                         + frontend/public/models/manifest.json
 *
 * Each source exports `build(THREE, P, L, variant?)` (and optionally `variants`, `budget`).
 * `P` is the named material palette, `L` the helper library — both defined here so the
 * sources stay pure geometry. Anchors are exported as empty named nodes (zero draw
 * calls); moving parts stay their own child nodes. Run from `frontend/`:
 *
 *   node scripts/build-twin-models.mjs            # everything
 *   node scripts/build-twin-models.mjs lamp-sf1000 grow-tent   # a subset
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// ---- Node polyfills the exporter expects from a browser -------------------------------
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        this.onloadend?.({ target: this });
        this.onload?.({ target: this });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(buf).toString("base64")}`;
        this.onloadend?.({ target: this });
        this.onload?.({ target: this });
      });
    }
  };
}
if (typeof globalThis.self === "undefined") globalThis.self = globalThis;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(HERE, "..");
const REPO = path.resolve(FRONTEND, "..");
const SRC = path.join(REPO, "docs", "design", "models", "src", "pack");
const OUT = path.join(FRONTEND, "public", "models");
const MANIFEST = path.join(OUT, "manifest.json");

// ---- Palette: material NAME is the contract; colours only matter to other viewers ------
const PALETTE = {
  shell_black: 0x12161f, foil_lining: 0xb3bcc6, trim_green: 0x348a0e, roller_silver: 0x959ea8,
  window_acrylic: [0xbcc9d2, 0.14], frame_steel: 0xc9ced2, tray_pvc: 0x0c0f13, plastic_white: 0xe9ebee,
  plastic_dark: 0x2a2f38, duct_foil: 0xb9bfc4, fan_blade: 0x3c4450, lamp_emitter: 0xfff2c0,
  heat_element: 0xff6a3d, led_status: 0x3ddc84, water: [0x3aa0d8, 0.5], soil: 0x4a3626, leaf_green: 0x3f9a3a,
  pot_fabric: 0x2b2b2b, cable_black: 0x111111, screen_glass: 0x1a2a3a, mesh_wire: 0x9aa3ad,
  glass_clear: [0xdfe8ee, 0.25], metal_brass: 0xb8923a, rubber_black: 0x1c1c1c,
};
const P = Object.fromEntries(
  Object.entries(PALETTE).map(([name, v]) => {
    const [color, opacity] = Array.isArray(v) ? v : [v, 1];
    const m = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.7, transparent: opacity < 1, opacity });
    m.name = name;
    return [name, m];
  }),
);

// ---- Helper library --------------------------------------------------------------------
const AXIS_ROT = { x: [0, 0, -Math.PI / 2], y: [0, 0, 0], z: [Math.PI / 2, 0, 0] };

function tg(T, geo, { pos, rot, scale, quat } = {}) {
  const q = quat ? quat.clone() : new T.Quaternion().setFromEuler(new T.Euler(...(rot ?? [0, 0, 0])));
  const m = new T.Matrix4().compose(new T.Vector3(...(pos ?? [0, 0, 0])), q, new T.Vector3(...(scale ?? [1, 1, 1])));
  geo.applyMatrix4(m);
  return geo;
}
function mesh(T, geo, mat, name, pos, rot) {
  const m = new T.Mesh(geo, mat);
  m.name = name;
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  return m;
}
function box(T, mat, name, [w, h, d], pos, rot) {
  return mesh(T, new T.BoxGeometry(w, h, d), mat, name, pos, rot);
}
function cyl(T, mat, name, { r, rt, rb, h, seg = 16, axis = "y", pos, open = false }) {
  const g = new T.CylinderGeometry(rt ?? r, rb ?? r, h, seg, 1, open);
  if (axis !== "y") tg(T, g, { rot: AXIS_ROT[axis] });
  return mesh(T, g, mat, name, pos);
}
function torus(T, mat, name, { r, tube, seg = 8, tseg = 16, axis = "y", pos, arc }) {
  // TorusGeometry lies in the XY plane (axis z); rotate so `axis` is the ring's axis
  const g = new T.TorusGeometry(r, tube, seg, tseg, arc ?? Math.PI * 2);
  const rot = axis === "y" ? [Math.PI / 2, 0, 0] : axis === "x" ? [0, Math.PI / 2, 0] : [0, 0, 0];
  tg(T, g, { rot });
  return mesh(T, g, mat, name, pos);
}
function plateGeo(T, { w, h, depth, hole }) {
  const shape = new T.Shape();
  shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2); shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
  if (hole) {
    const [cx, cy, hw, hh] = hole;
    const p = new T.Path();
    p.moveTo(cx - hw / 2, cy - hh / 2); p.lineTo(cx + hw / 2, cy - hh / 2); p.lineTo(cx + hw / 2, cy + hh / 2); p.lineTo(cx - hw / 2, cy + hh / 2); p.closePath();
    shape.holes.push(p);
  }
  const g = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, -depth / 2);
  return g;
}
function plate(T, mat, name, { pos, rot, ...rest }) {
  return mesh(T, plateGeo(T, rest), mat, name, pos, rot);
}
function roundedBoxGeo(T, { w, d, h, r, seg = 3 }) {
  // footprint w × d in x/z with rounded vertical edges, extruded up y from 0 to h
  const rr = Math.min(r, w / 2, d / 2);
  const s = new T.Shape();
  const x0 = -w / 2, x1 = w / 2, z0 = -d / 2, z1 = d / 2;
  s.moveTo(x0 + rr, z0);
  s.lineTo(x1 - rr, z0); s.quadraticCurveTo(x1, z0, x1, z0 + rr);
  s.lineTo(x1, z1 - rr); s.quadraticCurveTo(x1, z1, x1 - rr, z1);
  s.lineTo(x0 + rr, z1); s.quadraticCurveTo(x0, z1, x0, z1 - rr);
  s.lineTo(x0, z0 + rr); s.quadraticCurveTo(x0, z0, x0 + rr, z0);
  const g = new T.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg });
  g.rotateX(-Math.PI / 2); // shape XY → XZ, extrusion +Z → +Y
  g.translate(0, 0, 0);
  // after rotateX(-90°): shape y → -z? fix so shape's y maps to +z
  g.scale(1, 1, -1);
  g.computeVertexNormals();
  return g;
}
function roundedBox(T, mat, name, { pos, ...rest }) {
  return mesh(T, roundedBoxGeo(T, rest), mat, name, pos);
}
function rodGeo(T, from, to, r, seg = 8) {
  const a = new T.Vector3(...from), b = new T.Vector3(...to);
  const len = a.distanceTo(b);
  const g = new T.CylinderGeometry(r, r, len, seg);
  const dir = b.clone().sub(a).normalize();
  const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  g.applyMatrix4(new T.Matrix4().compose(mid, q, new T.Vector3(1, 1, 1)));
  return g;
}
function bladesGeo(T, n, { rIn, rOut, chord, pitch }) {
  // n swept quads around +Y: each blade spans rIn..rOut along +X, `chord` wide, tilted by `pitch`
  const parts = [];
  for (let i = 0; i < n; i++) {
    const q = new T.PlaneGeometry(rOut - rIn, chord);
    tg(T, q, { rot: [Math.PI / 2, 0, 0] });                 // lie flat in XZ
    tg(T, q, { rot: [0, 0, 0], pos: [(rIn + rOut) / 2, 0, 0] });
    tg(T, q, { rot: [pitch, 0, 0] });                        // pitch about the radial axis (≈ x near the blade)
    tg(T, q, { rot: [0, (i / n) * Math.PI * 2, 0] });
    parts.push(q);
  }
  return mergeGeometries(parts, false);
}
function anchor(T, _mat, name, pos) {
  const o = new T.Object3D();
  o.name = name;
  o.position.set(...pos);
  o.userData.anchor = true;
  return o;
}
function merge(_T, geos) {
  const cleaned = geos.map((g) => {
    const c = g.index ? g.toNonIndexed() : g;
    // keep only position/normal/uv so mixed geometries merge
    for (const k of Object.keys(c.attributes)) if (!["position", "normal", "uv"].includes(k)) c.deleteAttribute(k);
    if (!c.attributes.normal) c.computeVertexNormals();
    if (!c.attributes.uv) c.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array((c.attributes.position.count) * 2), 2));
    c.clearGroups();
    return c;
  });
  return mergeGeometries(cleaned, false);
}
const L = { box, cyl, torus, plate, plateGeo, roundedBox, roundedBoxGeo, tg, rodGeo, bladesGeo, mesh, merge, anchor };

// ---- Manifest helpers ------------------------------------------------------------------
const MATERIAL_ROLE = {
  shell_black: "shell", foil_lining: "dim", trim_green: "accent", roller_silver: "frame", window_acrylic: "glass",
  frame_steel: "frame", tray_pvc: "frame", plastic_white: "dim", plastic_dark: "shell", duct_foil: "frame",
  fan_blade: "accent", lamp_emitter: "emissive", heat_element: "emissive", led_status: "emissive", screen_glass: "emissive",
  water: "glass", soil: "shell", leaf_green: "accent", pot_fabric: "dim", cable_black: "shell", mesh_wire: "wire",
  glass_clear: "glass", metal_brass: "frame", rubber_black: "shell",
};
const ANCHOR_ROLE = [
  [/^fan_exhaust/, "fan_exhaust"], [/^fan_intake/, "fan_intake"], [/^duct_passive/, "duct_passive"], [/^duct_(in|out)/, "duct"],
  [/^cable/, "cable"], [/^tray/, "tray"], [/^shelf/, "shelf"], [/^lamp/, "lamp"], [/^hang/, "hang"], [/^mount/, "mount"],
  [/^probe/, "probe"], [/^canopy/, "canopy"], [/^pot_/, "pot"], [/^plant_base/, "pot"], [/^plug/, "plug"], [/^hose/, "hose"],
  [/^drain/, "hose"], [/^fill/, "hose"], [/^air_/, "air"], [/^tube/, "tube"], [/^outlet_face|^intake_face/, "airflow"],
  [/^mist_out|^tubing_end|^emitter/, "emitter"], [/^soil_line|^socket/, "socket"], [/^pump_socket/, "socket"],
  [/^clip_point/, "mount"], [/^tent_/, "tent"], [/^dehum_spot|^ac_spot|^tank_spot|^hub_mount/, "spot"], [/^jar_/, "jar"],
  [/^tier_/, "shelf"], [/^cutting/, "cutting"], [/^platform/, "spot"], [/^pipe/, "hose"], [/^gas_in/, "hose"], [/^sensor_in/, "probe"],
  [/^window|^observation/, "window"], [/^door/, "door"], [/^vent_port/, "duct_passive"], [/^pole_/, "mount"], [/^air_in/, "air"],
  // pack 3
  [/^plant_base/, "pot"], [/^canopy_centre/, "canopy"], [/^stake_/, "mount"], [/^aim$/, "aim"], [/^label_tab/, "label"],
  [/^dongle_tip/, "antenna"], [/^(tray_upper|mat_spot|humidifier_spot|mister_spot|brain_shelf|router_spot|wall_fan_mount)/, "spot"],
  [/^power_/, "plug"], [/^camera_/, "camera"], [/^lamp_upper/, "lamp"], [/^duct_upper/, "duct_passive"], [/^tip$/, "socket"],
  [/^contents_top|^lid_hinge|^cube_base/, "spot"],
];
/** Models whose y = 0 is not the floor: the compositor snaps these to a `plant_base`-style anchor. */
const ORIGIN = (slug) => (slug.startsWith("plant-stage") || slug.startsWith("plant-lod") || slug.startsWith("plant-cutting") ? "soil" : undefined);
function anchorRole(name) {
  for (const [re, role] of ANCHOR_ROLE) if (re.test(name)) return role;
  return name.replace(/_\d+$/, "");
}
function kindOf(slug) {
  if (slug.startsWith("grow-tent")) return "tent";
  if (slug.startsWith("grow-room")) return "room";
  if (slug.startsWith("plant-stage") || slug.startsWith("plant-lod") || slug.startsWith("plant-cutting")) return "plant";
  if (slug === "vessel" || slug.startsWith("pot-family")) return "vessel";
  if (/^(sensor-|probe-|camera-)/.test(slug)) return "sensor";
  return "device";
}
const ZONE = { "grow-tent-240x120x210": "4x8", "grow-tent-120x60x210": "2x4", "grow-room-shell": "grow_room" };

function stats(root) {
  let meshes = 0, tris = 0;
  const materials = new Set(), anchors = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (o.isMesh) {
      meshes += 1;
      const g = o.geometry;
      tris += Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) materials.add(m.name);
    } else if (o.userData.anchor) anchors.push(o.name);
  });
  const bb = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3(); bb.getSize(size);
  return { meshes, tris, materials: [...materials], anchors, size, min: bb.min };
}

function exportGlb(root) {
  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(root, (res) => resolve(Buffer.from(res)), reject, { binary: true, onlyVisible: false, includeCustomExtensions: false });
  });
}

// ---- Main -----------------------------------------------------------------------------
const only = new Set(process.argv.slice(2));
mkdirSync(OUT, { recursive: true });
const existing = (() => { try { return JSON.parse(readFileSync(MANIFEST, "utf-8")); } catch { return { version: 1, models: [] }; } })();
// Hand-authored rows survive a rebuild only while no builder produces the same slug (the 2×4
// was hand-exported until pack 3 rebuilt it with anchors).
const builtSlugs = new Set(readdirSync(SRC).filter((f) => f.endsWith(".js") && !f.startsWith("_")).map((f) => f.replace(/\.js$/, "")));
const keep = existing.models.filter((m) => (m.hand_authored || m.slug === "grow-tent-120x60x210") && !builtSlugs.has(m.slug));
const rows = [];
const problems = [];
const files = readdirSync(SRC).filter((f) => f.endsWith(".js") && !f.startsWith("_")).sort();
for (const f of files) {
  const slug = f.replace(/\.js$/, "");
  if (only.size && ![...only].some((o) => slug.startsWith(o))) continue;
  const mod = await import(pathToFileURL(path.join(SRC, f)).href);
  const variants = mod.variants ?? [null];
  for (const variant of variants) {
    const name = variant ? `${slug}--${variant}` : slug;
    let root;
    try {
      root = variant ? mod.build(THREE, P, L, variant) : mod.build(THREE, P, L);
    } catch (e) {
      problems.push(`${name}: build failed — ${e.message}`);
      continue;
    }
    if (!root.name) root.name = slug.replace(/-/g, "_");
    const st = stats(root);
    const budget = typeof mod.budget === "function" ? mod.budget(variant) : mod.budget ?? {};
    if (budget.tris && st.tris > budget.tris * 1.15) problems.push(`${name}: ${st.tris} tris > budget ${budget.tris}`);
    if (budget.meshes && st.meshes > budget.meshes) problems.push(`${name}: ${st.meshes} meshes > budget ${budget.meshes}`);
    const unknownMats = st.materials.filter((m) => !MATERIAL_ROLE[m]);
    if (unknownMats.length) problems.push(`${name}: unknown materials ${unknownMats.join(", ")}`);
    let glb;
    try {
      glb = await exportGlb(root);
    } catch (e) {
      problems.push(`${name}: export failed — ${e.message}`);
      continue;
    }
    const outFile = path.join(OUT, `${name}.glb`);
    writeFileSync(outFile, glb);
    const dims = [st.size.x, st.size.z, st.size.y].map((v) => Math.round(v * 100));
    rows.push({
      slug: name,
      file: `/models/${name}.glb`,
      kind: kindOf(slug),
      dims_cm: dims,
      ...(ZONE[name] ? { zone: ZONE[name] } : {}),
      ...(ORIGIN(slug) ? { origin: ORIGIN(slug) } : {}),
      bytes: statSync(outFile).size,
      origin_y: Math.round(st.min.y * 1000) / 1000,
      meshes: st.meshes,
      triangles: st.tris,
      anchors: Object.fromEntries(st.anchors.map((a) => [a, anchorRole(a)])),
      materials: Object.fromEntries(st.materials.map((m) => [m, MATERIAL_ROLE[m] ?? "shell"])),
    });
    console.log(`${name.padEnd(40)} ${String(st.meshes).padStart(3)} meshes ${String(st.tris).padStart(6)} tris ${String(Math.round(glb.length / 1024)).padStart(5)} KB  ${dims.join("×")} cm`);
  }
}
const manifest = { version: 2, generated: new Date().toISOString(), models: [...keep, ...rows.filter((r) => !keep.some((k) => k.slug === r.slug))] };
if (!only.size || rows.length) writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${rows.length} GLBs written to ${path.relative(REPO, OUT)}; manifest has ${manifest.models.length} rows`);
if (problems.length) {
  console.log(`\n${problems.length} problems:`);
  for (const p of problems) console.log("  - " + p);
  process.exitCode = 1;
}
