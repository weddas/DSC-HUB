import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Rising particles from a point — heat shimmer above a mat or heater, mist above a
 * humidifier nozzle. Additive points; `rate` and `rise` scale with the bound state so a
 * stronger effect reads as more, faster, higher — never as a number.
 */
export function RisingParticles({
  origin,
  color,
  count = 60,
  spread = 0.08,
  rise = 0.35,
  height = 0.6,
  size = 0.02,
  opacity = 0.6,
  drift = 0.04,
  active = true,
}: {
  origin: THREE.Vector3;
  color: string;
  count?: number;
  /** Start radius in metres. */
  spread?: number;
  /** m/s. */
  rise?: number;
  /** Life height in metres. */
  height?: number;
  size?: number;
  opacity?: number;
  /** Sideways wander in metres. */
  drift?: number;
  active?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const a = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      a[i * 4] = Math.random();
      a[i * 4 + 1] = Math.random() * Math.PI * 2;
      a[i * 4 + 2] = Math.random();
      a[i * 4 + 3] = Math.random() * Math.PI * 2;
    }
    return a;
  }, [count]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  const tRef = useRef(0);
  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    tRef.current += Math.min(dt, 0.1) * (active ? 1 : 0);
    const t = tRef.current;
    const pos = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const phase = seeds[i * 4];
      const ang = seeds[i * 4 + 1];
      const r = seeds[i * 4 + 2] * spread;
      const wob = seeds[i * 4 + 3];
      const life = ((t * rise) / height + phase) % 1; // 0..1 along the rise
      const x = origin.x + Math.cos(ang) * r * (1 + life) + Math.sin(t * 1.3 + wob) * drift * life;
      const z = origin.z + Math.sin(ang) * r * (1 + life) + Math.cos(t * 1.1 + wob) * drift * life;
      const y = origin.y + life * height;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
    (p.material as THREE.PointsMaterial).opacity = active ? opacity : 0;
  });
  return (
    <points ref={ref} geometry={geom} frustumCulled={false}>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/**
 * A haze filling a box — humidity. Points drift slowly; density and tone are the state.
 */
export function VolumeHaze({
  box,
  color,
  count = 320,
  opacity = 0.3,
  size = 0.018,
  active = true,
}: {
  box: THREE.Box3;
  color: string;
  count?: number;
  opacity?: number;
  size?: number;
  active?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const base = useMemo(() => {
    const a = new Float32Array(count * 3);
    const s = new THREE.Vector3();
    box.getSize(s);
    for (let i = 0; i < count; i++) {
      a[i * 3] = box.min.x + Math.random() * s.x;
      a[i * 3 + 1] = box.min.y + Math.random() * s.y;
      a[i * 3 + 2] = box.min.z + Math.random() * s.z;
    }
    return a;
  }, [box, count]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(base.slice(), 3));
    return g;
  }, [base]);
  const t = useRef(0);
  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    t.current += Math.min(dt, 0.1);
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const tt = t.current;
    for (let i = 0; i < count; i++) {
      const k = i * 0.37;
      pos.setXYZ(i, base[i * 3] + Math.sin(tt * 0.25 + k) * 0.03, base[i * 3 + 1] + Math.sin(tt * 0.18 + k * 1.7) * 0.02, base[i * 3 + 2] + Math.cos(tt * 0.22 + k) * 0.03);
    }
    pos.needsUpdate = true;
    (p.material as THREE.PointsMaterial).opacity = active ? opacity : 0;
  });
  return (
    <points ref={ref} geometry={geom} frustumCulled={false}>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}
