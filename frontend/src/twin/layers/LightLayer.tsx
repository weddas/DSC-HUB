import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying float vY;
  void main() {
    vY = position.y; // cone: +0.5 at the apex, -0.5 at the base
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLevel;
  varying float vY;
  void main() {
    float t = clamp(vY + 0.5, 0.0, 1.0);      // 1 at the emitter, 0 at the canopy
    float a = uLevel * mix(0.02, 0.22, t * t);
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * A lamp's light cone from the emitter face down to the canopy plane, brightness-scaled,
 * plus a footprint ring where it lands. The beam half-angle is a fixed 60° — a shape,
 * not a PPFD claim; PPFD only appears on the label when a PAR sensor is bound.
 */
export function LightCone({
  emitter,
  canopyY,
  halfWidth,
  brightness,
  on,
  color,
  active = true,
}: {
  /** World position of the emitter face. */
  emitter: THREE.Vector3;
  /** World y of the canopy plane the light lands on. */
  canopyY: number;
  /** Clip radius (half the tent's smaller side). */
  halfWidth: number;
  /** 0–1. */
  brightness: number;
  on: boolean;
  color: string;
  active?: boolean;
}) {
  const h = Math.max(0.05, emitter.y - canopyY);
  const r = Math.min(halfWidth, h * Math.tan(Math.PI / 3));
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(color) }, uLevel: { value: 0 } }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const level = on && active ? 0.35 + 0.65 * brightness : 0;
  useFrame(() => {
    const m = mat.current;
    if (!m) return;
    (m.uniforms.uColor.value as THREE.Color).set(color);
    m.uniforms.uLevel.value += (level - m.uniforms.uLevel.value) * 0.15;
  });
  const ring = useMemo(() => new THREE.RingGeometry(r * 0.985, r, 64), [r]);
  return (
    <group>
      <mesh position={[emitter.x, canopyY + h / 2, emitter.z]} scale={[r * 2, h, r * 2]} raycast={() => undefined}>
        {/* unit cone, apex up: radius 0.5 at the base, height 1 */}
        <coneGeometry args={[0.5, 1, 48, 1, true]} />
        <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[emitter.x, canopyY + 0.003, emitter.z]} rotation={[-Math.PI / 2, 0, 0]} geometry={ring} raycast={() => undefined}>
        <meshBasicMaterial color={color} transparent opacity={level > 0 ? 0.35 + 0.4 * brightness : 0.08} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
