import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TwinFan } from "../../lib/twinState";

/** One leg of an air path: a run of control points; `duct` legs are drawn as a tube. */
export interface AirLeg {
  pts: THREE.Vector3[];
  duct?: boolean;
  /** Duct radius in metres (4" → 0.051, 6" → 0.076). */
  radius?: number;
}

export interface AirPath {
  id: TwinFan["id"] | "cascade_2x4";
  legs: AirLeg[];
  color: string;
  /** Duty % (NaN/0 → no particles). */
  pct: number;
  /** Learned CFM (NaN → duty-only speed). */
  cfm: number;
  live: boolean;
  simulated?: boolean;
}

function fullCurve(legs: AirLeg[]): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (const l of legs) for (const p of l.pts) if (!pts.length || pts[pts.length - 1].distanceToSquared(p) > 1e-6) pts.push(p);
  return new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
}

/** Streak particles along a path; count from duty, speed from CFM. */
function Streaks({ path, curve }: { path: AirPath; curve: THREE.CatmullRomCurve3 }) {
  const count = Number.isFinite(path.pct) && path.pct > 0 ? Math.min(28, 6 + Math.round(path.pct / 4)) : 0;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const length = useMemo(() => curve.getLength(), [curve]);
  const phase = useMemo(() => Array.from({ length: 28 }, (_, i) => (i * 0.618034) % 1), []);
  const jitter = useMemo(() => Array.from({ length: 28 }, () => (Math.random() - 0.5) * 0.06), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const uRef = useRef(0);
  // m/s, legible rather than physical: 300 cfm through a 6" duct is ~8 m/s in life.
  const speed = Number.isFinite(path.cfm) && path.cfm > 0 ? 0.25 + path.cfm / 150 : 0.25 + (path.pct || 0) / 120;
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m || !count) return;
    uRef.current = (uRef.current + (Math.min(dt, 0.1) * speed) / Math.max(0.5, length)) % 1;
    for (let i = 0; i < count; i++) {
      const u = (phase[i] + uRef.current) % 1;
      const p = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const side = new THREE.Vector3().crossVectors(tangent, up).normalize().multiplyScalar(jitter[i]);
      dummy.position.copy(p).add(side);
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      const fade = Math.sin(u * Math.PI); // fade in/out at the ends
      dummy.scale.set(1, 1, 0.6 + fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.count = count;
    m.instanceMatrix.needsUpdate = true;
  });
  if (!count) return null;
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 28]} frustumCulled={false}>
      <boxGeometry args={[0.012, 0.012, 0.1]} />
      <meshBasicMaterial color={path.color} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

/** A duct drawn as a wire tube along its leg. Dim when the fan is silent. */
function DuctTube({ leg, color, live }: { leg: AirLeg; color: string; live: boolean }) {
  const geo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(leg.pts, false, "centripetal", 0.5);
    return new THREE.TubeGeometry(c, Math.max(8, leg.pts.length * 6), leg.radius ?? 0.051, 10, false);
  }, [leg]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 40), [geo]);
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color={color} transparent opacity={live ? 0.06 : 0.03} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={live ? 0.35 : 0.16} />
      </lineSegments>
    </group>
  );
}

/** Faint centreline so a path is legible even when no air moves. */
function Centreline({ curve, color, live }: { curve: THREE.CatmullRomCurve3; color: string; live: boolean }) {
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: live ? 0.18 : 0.08 });
    const l = new THREE.Line(geo, mat);
    l.raycast = () => undefined;
    return l;
  }, [curve, color, live]);
  useEffect(() => () => {
    line.geometry.dispose();
    (line.material as THREE.Material).dispose();
  }, [line]);
  return <primitive object={line} />;
}

/**
 * Airflow: every fan's path drawn as ducts + a centreline, with streak particles whose
 * number follows duty and speed follows learned CFM (plan § 3D motion: particles by CFM).
 * Colour is the path's role — cool intake, warm exhaust, recirculation — so hot and
 * cold air read at a glance.
 */
export function AirflowLayer({ paths }: { paths: AirPath[] }) {
  return (
    <group name="airflow">
      {paths.map((p) => (
        <AirPathView key={p.id} path={p} />
      ))}
    </group>
  );
}

function AirPathView({ path }: { path: AirPath }) {
  const curve = useMemo(() => fullCurve(path.legs), [path.legs]);
  if (curve.points.length < 2) return null;
  return (
    <group name={`air-${path.id}`}>
      <Centreline curve={curve} color={path.color} live={path.live && path.pct > 0} />
      {path.legs.filter((l) => l.duct && l.pts.length >= 2).map((l, i) => (
        <DuctTube key={i} leg={l} color={path.color} live={path.live && path.pct > 0} />
      ))}
      <Streaks path={path} curve={curve} />
    </group>
  );
}
