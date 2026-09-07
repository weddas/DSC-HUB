import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TwinZone } from "../../lib/twinState";
import type { TwinPalette } from "../wire";

const VERT = /* glsl */ `
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// Vertical gradient: warm air pools at the top, cold at the floor; a slow shimmer keeps
// it alive without ever pretending to be a measured field.
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uHot;     // 1 = too warm (gradient up), -1 = too cold (gradient down), 0 = in band
  uniform float uTime;
  varying vec3 vLocal;
  void main() {
    float y = clamp(vLocal.y + 0.5, 0.0, 1.0);
    float g = uHot > 0.5 ? y : (uHot < -0.5 ? 1.0 - y : 0.5 + 0.25 * sin(y * 6.2831 + uTime * 0.6));
    float shimmer = 0.85 + 0.15 * sin(vLocal.x * 9.0 + uTime * 1.7) * sin(vLocal.z * 7.0 - uTime * 1.3);
    float a = uStrength * (0.05 + 0.22 * g) * shimmer;
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * Colour and strength of a zone's thermal volume from its temperature against the want
 * band: blue when cold, amber→red when warm, a faint teal wash when in band. The margin
 * that turns "warn" into "critical" on the cards is the same 3× band-margin rule.
 */
export function thermalTone(z: TwinZone, palette: TwinPalette): { color: string; strength: number; hot: number } {
  if (!z.temp.available) return { color: palette.dim, strength: 0, hot: 0 };
  const d = z.tempDelta;
  if (d === 0) return { color: palette.teal, strength: 0.35, hot: 0 };
  const mag = Math.min(1, Math.abs(d) / 3);
  if (d > 0) return { color: mag > 0.66 ? palette.bad : palette.warn, strength: 0.45 + 0.55 * mag, hot: 1 };
  return { color: palette.blue, strength: 0.45 + 0.55 * mag, hot: -1 };
}

/**
 * A tinted volume filling a zone's interior — the "hot/cold" read. One box per zone,
 * additive, depth-read but not written so the wire model shows through.
 */
export function ThermalVolume({ box, zone, palette, active = true }: { box: THREE.Box3; zone: TwinZone; palette: TwinPalette; active?: boolean }) {
  const tone = thermalTone(zone, palette);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(tone.color) }, uStrength: { value: tone.strength }, uHot: { value: tone.hot }, uTime: { value: 0 } }),
    // created once; updated in the frame loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const size = useMemo(() => {
    const s = new THREE.Vector3();
    box.getSize(s);
    return s;
  }, [box]);
  const centre = useMemo(() => {
    const c = new THREE.Vector3();
    box.getCenter(c);
    return c;
  }, [box]);
  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(dt, 0.1);
    (m.uniforms.uColor.value as THREE.Color).set(tone.color);
    m.uniforms.uStrength.value = active ? tone.strength : 0;
    m.uniforms.uHot.value = tone.hot;
  });
  return (
    <mesh position={centre} scale={[size.x * 0.96, size.y * 0.96, size.z * 0.96]} raycast={() => undefined}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
