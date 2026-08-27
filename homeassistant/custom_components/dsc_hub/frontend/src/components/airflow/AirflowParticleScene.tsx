import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { AirflowReadings } from "./AirflowParticleViz";
import { LUNG_ROOM_SIZE, TENT_2X4_SIZE, TENT_4X8_SIZE } from "./lungRoomPaths";

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

/** Phase D2a — wireframe scene; particles in D2b. */
export function AirflowParticleScene({
  readings,
}: {
  readings: AirflowReadings;
  manualOverride: boolean;
}) {
  return (
    <div className="dsc-airflow-canvas-wrap">
      <Canvas camera={{ position: [0, 12, 25], fov: 45 }} style={{ height: 320 }}>
        <color attach="background" args={["#0d1117"]} />
        <fog attach="fog" args={["#0d1117", 18, 42]} />
        <ambientLight intensity={0.55} />
        <LungRoomShell />
        <TentShells />
        <OrbitControls enablePan={false} target={[0, 4, 0]} />
      </Canvas>
      <CfmLegend readings={readings} />
    </div>
  );
}
