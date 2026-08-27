import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { TwinFocusTent, VesselLive } from "../lib/dsc-twin-api";

function WireBox({
  position,
  size,
  color,
  dashed = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  dashed?: boolean;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} wireframe opacity={dashed ? 0.35 : 0.85} transparent />
    </mesh>
  );
}

function SceneBody({
  pots,
  focusTent,
  held,
}: {
  pots: VesselLive[];
  focusTent: TwinFocusTent;
  held: boolean;
}) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (held || !group.current) return;
    group.current.rotation.y += delta * 0.08;
  });

  const potMeshes = useMemo(
    () =>
      pots.map((p, i) => {
        const x = (p.slot ?? i) * 1.4 - 2;
        const z = p.tent === "clone" ? -2.2 : p.tent === "main" ? 2.2 : 0;
        const color = p.untrusted || !p.inService ? "#666" : p.need === "water" ? "#f59e0b" : "#22d3ee";
        return (
          <WireBox
            key={p.id}
            position={[x, 0.4, z]}
            size={[0.5, 0.8, 0.5]}
            color={color}
            dashed={!p.inService || p.untrusted || p.held}
          />
        );
      }),
    [pots],
  );

  const showMain = focusTent == null || focusTent === "main";
  const showClone = focusTent == null || focusTent === "clone";

  return (
    <group ref={group}>
      {showMain ? <WireBox position={[0, 1.2, 2.5]} size={[4, 2.4, 3]} color="#3b82f6" /> : null}
      {showClone ? <WireBox position={[0, 0.9, -2.5]} size={[2.5, 1.8, 2]} color="#14b8a6" /> : null}
      <WireBox position={[0, 0.5, 0]} size={[6, 1, 6]} color="#64748b" dashed />
      {potMeshes}
    </group>
  );
}

export function DscTwinCanvas({
  pots,
  focusTent,
  held,
  visible,
}: {
  pots: VesselLive[];
  focusTent: TwinFocusTent;
  held: boolean;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <Suspense fallback={<div className="dsc-empty">Loading twin…</div>}>
      <Canvas camera={{ position: [6, 5, 8], fov: 45 }} style={{ width: "100%", height: "100%" }}>
        <color attach="background" args={["#0a0f14"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 4]} intensity={0.8} />
        <SceneBody pots={pots} focusTent={focusTent} held={held} />
      </Canvas>
    </Suspense>
  );
}
