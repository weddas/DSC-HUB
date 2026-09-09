/**
 * The twin's three-free interface: the handful of values the page toolbar needs to
 * describe the scene before the scene exists.
 *
 * Nothing here may import three.js, `@react-three/*` or any scene module. The whole
 * three.js scene is a lazy chunk (`components/TwinStagePanel.tsx` → `twin/TwinStage`);
 * a single value import from the page into a module that touches three would drag
 * ~600 kB of renderer into the boot path and undo it. The `twin-shared` rule in
 * `vite.config.ts` keeps this file, `manifest.ts` and `context.ts` out of that chunk —
 * see the comment there before adding an import.
 */

export type CameraPreset = "room" | "main" | "clone" | "canopy" | "root";

export const CAMERA_PRESETS: ReadonlyArray<{ id: CameraPreset; label: string }> = [
  { id: "room", label: "Room" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "canopy", label: "Canopy" },
  { id: "root", label: "Root" },
];

/**
 * How solid the rig is drawn. `wire` is the holographic default (plan § 3D twin rule 3);
 * `xray` drops the fills and stops the edges depth-testing, so a duct behind a tent wall
 * or a probe inside a pot reads through; `solid` closes the fills for a still or for an
 * operator who finds the wire look hard to parse.
 */
export type TwinStyle = "wire" | "xray" | "solid";

export const TWIN_STYLES: ReadonlyArray<{ id: TwinStyle; label: string; hint: string }> = [
  { id: "wire", label: "Wire", hint: "The holographic look: faint fills, edges by material role" },
  { id: "xray", label: "X-ray", hint: "Edges only, nothing hidden — see ducts, probes and mats through the shells" },
  { id: "solid", label: "Solid", hint: "Closed fills that occlude, for a still or an easier read" },
];
