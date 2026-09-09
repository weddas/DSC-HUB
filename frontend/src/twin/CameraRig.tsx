import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { getAnchorSet, useAnchorVersion } from "./anchors";
import type { CameraPreset } from "./presets";

// The preset list itself lives in `./presets` (three-free) so the page toolbar can name
// the presets without importing this module — and with it, three.js — at boot.
export type { CameraPreset };

function presetPose(p: CameraPreset): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const t4 = getAnchorSet("tent4x8");
  const t2 = getAnchorSet("tent2x4");
  const P4 = t4 ? new THREE.Vector3().setFromMatrixPosition(t4.matrix) : new THREE.Vector3(0, 0, -0.4);
  const P2 = t2 ? new THREE.Vector3().setFromMatrixPosition(t2.matrix) : new THREE.Vector3(-1.2, 0, 0.5);
  switch (p) {
    case "main":
      return { pos: P4.clone().add(new THREE.Vector3(0.9, 1.7, 3.3)), target: P4.clone().add(new THREE.Vector3(0, 1.0, 0)) };
    case "clone":
      return { pos: P2.clone().add(new THREE.Vector3(0.6, 1.5, 2.6)), target: P2.clone().add(new THREE.Vector3(0, 0.9, 0)) };
    case "canopy":
      return { pos: P4.clone().add(new THREE.Vector3(0.05, 3.4, 0.9)), target: P4.clone().add(new THREE.Vector3(0, 0.7, 0)) };
    case "root":
      return { pos: P4.clone().add(new THREE.Vector3(1.1, 0.55, 2.3)), target: P4.clone().add(new THREE.Vector3(0, 0.3, 0)) };
    case "room":
    default:
      return { pos: new THREE.Vector3(3.9, 2.7, 4.9), target: new THREE.Vector3(-0.2, 0.9, 0) };
  }
}

/**
 * Camera presets with a damped glide between them, orbit for the operator, and a slow
 * cinematic auto-orbit when asked. Any drag cancels the glide — the operator always wins.
 */
export function CameraRig({ preset, cinematic, calm }: { preset: CameraPreset; cinematic: boolean; calm: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const v = useAnchorVersion();
  const lastPreset = useRef<CameraPreset | null>(null);
  const settledVersion = useRef(-1);

  // Re-aim when the preset changes, or when the tents first settle (their positions define the poses).
  useEffect(() => {
    const tentsReady = !!getAnchorSet("tent4x8");
    if (preset !== lastPreset.current || (tentsReady && settledVersion.current < 0)) {
      goal.current = presetPose(preset);
      lastPreset.current = preset;
      if (tentsReady) settledVersion.current = v;
    }
  }, [preset, v]);

  useFrame((_, dt) => {
    const c = controls.current;
    const g = goal.current;
    if (!c || !g) return;
    const k = calm ? 1 : 1 - Math.exp(-Math.min(dt, 0.1) * 4.5);
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.target, k);
    c.update();
    if (camera.position.distanceToSquared(g.pos) < 1e-4 && c.target.distanceToSquared(g.target) < 1e-4) goal.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan
      enableDamping
      dampingFactor={0.08}
      minDistance={0.6}
      maxDistance={12}
      maxPolarAngle={Math.PI / 2 + 0.05}
      autoRotate={cinematic && !calm}
      autoRotateSpeed={0.35}
      onStart={() => {
        goal.current = null;
      }}
    />
  );
}
