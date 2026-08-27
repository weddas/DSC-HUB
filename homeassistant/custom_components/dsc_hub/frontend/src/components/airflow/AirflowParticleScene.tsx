import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { AirflowReadings } from "./AirflowParticleViz";
import { lungRoomPath, type AirPathId, LUNG_ROOM_SIZE, TENT_2X4_SIZE, TENT_4X8_SIZE } from "./lungRoomPaths";

function WireBox({
  w,
  h,
  d,
  color,
  position,
}: {
  w: number;
  h: number;
  d: number;
  color: string;
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[w, h, d]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function LungRoomShell() {
  const { w, h, d } = LUNG_ROOM_SIZE;
  return <WireBox w={w} h={h} d={d} color="#8b949e" position={[0, h / 2, 0]} />;
}

function TentShells() {
  return (
    <>
      <WireBox
        w={TENT_2X4_SIZE.w}
        h={TENT_2X4_SIZE.h}
        d={TENT_2X4_SIZE.d}
        color="#3fb950"
        position={[-5, TENT_2X4_SIZE.h / 2, -2]}
      />
      <WireBox
        w={TENT_4X8_SIZE.w}
        h={TENT_4X8_SIZE.h}
        d={TENT_4X8_SIZE.d}
        color="#58a6ff"
        position={[3, TENT_4X8_SIZE.h / 2, 0]}
      />
    </>
  );
}

function PathParticles({
  pathId,
  cfm,
  color,
  count = 24,
}: {
  pathId: AirPathId;
  cfm: number;
  color: string;
  count?: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const curve = useMemo(() => lungRoomPath(pathId), [pathId]);
  const speeds = useMemo(
    () => Array.from({ length: count }, (_, i) => 0.15 + (i % 7) * 0.04),
    [count],
  );
  const phase = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) % 1),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scale = Number.isFinite(cfm) && cfm > 0 ? Math.min(2.5, 0.6 + cfm / 120) : 0.35;

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t0 = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const u = (phase[i] + t0 * speeds[i] * scale * 0.08) % 1;
      const p = curve.getPoint(u);
      dummy.position.copy(p);
      dummy.scale.setScalar(0.12 * scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.18, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} />
    </instancedMesh>
  );
}

function CfmLegend({ readings }: { readings: AirflowReadings }) {
  const rows = [
    ["Intake 4×8", readings.intakeMain.value],
    ["Intake 2×4", readings.intakeClone.value],
    ["Exhaust outside", readings.outCfm.value],
    ["Exhaust recirc", readings.recircCfm.value],
  ] as const;
  return (
    <div className="dsc-airflow-legend">
      {rows.map(([label, cfm]) => (
        <span key={label}>
          {label}: {Number.isFinite(cfm) ? Math.round(cfm) : "—"} CFM
        </span>
      ))}
    </div>
  );
}

/** Phase D2b — wireframe + CFM-scaled path particles. */
export function AirflowParticleScene({
  readings,
  manualOverride,
}: {
  readings: AirflowReadings;
  manualOverride: boolean;
}) {
  void manualOverride;
  return (
    <div className="dsc-airflow-canvas-wrap">
      <Canvas camera={{ position: [0, 12, 25], fov: 45 }} style={{ height: 320 }}>
        <color attach="background" args={["#0d1117"]} />
        <fog attach="fog" args={["#0d1117", 18, 42]} />
        <ambientLight intensity={0.55} />
        <LungRoomShell />
        <TentShells />
        <PathParticles pathId="intake_main" cfm={readings.intakeMain.value} color="#58a6ff" />
        <PathParticles pathId="intake_clone" cfm={readings.intakeClone.value} color="#3fb950" />
        <PathParticles pathId="exhaust_outside" cfm={readings.outCfm.value} color="#f0883e" count={16} />
        <PathParticles pathId="exhaust_recirc" cfm={readings.recircCfm.value} color="#a371f7" count={16} />
        <OrbitControls enablePan={false} target={[0, 4, 0]} />
      </Canvas>
      <CfmLegend readings={readings} />
    </div>
  );
}
