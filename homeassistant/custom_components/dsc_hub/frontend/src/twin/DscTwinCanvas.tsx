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

function VesselPot({
  position,
  color,
  moisture,
  dashed = false,
}: {
  position: [number, number, number];
  color: string;
  moisture: number | null;
  dashed?: boolean;
}) {
  const fill =
    moisture != null && Number.isFinite(moisture) ? Math.min(1, Math.max(0, moisture / 100)) : null;
  return (
    <group position={position}>
      {/* Outer vessel wire — dashed when held / OOS / untrusted */}
      <mesh>
        <boxGeometry args={[0.5, 0.8, 0.5]} />
        <meshBasicMaterial color={color} wireframe opacity={dashed ? 0.35 : 0.85} transparent />
      </mesh>
      {/* Honest moisture column from live reading only — blank when missing */}
      {fill != null && fill > 0 ? (
        <mesh position={[0, -0.4 + fill * 0.4, 0]} castShadow>
          <boxGeometry args={[0.36, Math.max(0.06, fill * 0.72), 0.36]} />
          <meshStandardMaterial color={color} opacity={0.55} transparent roughness={0.65} metalness={0.05} />
        </mesh>
      ) : null}
    </group>
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
        const moisture =
          p.moisture != null && Number.isFinite(Number(p.moisture)) ? Number(p.moisture) : null;
        return (
          <VesselPot
            key={p.id}
            position={[x, 0.4, z]}
            color={color}
            moisture={moisture}
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
      {/* Soft ground plane for depth/shadow catch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0d151c" roughness={0.95} metalness={0} />
      </mesh>
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
      <Canvas shadows camera={{ position: [6, 5, 8], fov: 45 }} style={{ width: "100%", height: "100%" }}>
        <color attach="background" args={["#0a0f14"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 8, 4]} intensity={1.05} castShadow shadow-mapSize={[1024, 1024]} />
        <SceneBody pots={pots} focusTent={focusTent} held={held} />
      </Canvas>
      {held ? (
        <div
          className="dsc-chip dsc-chip--warn"
          style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
        >
          HELD · hub link down — rotation frozen
        </div>
      ) : null}
    </Suspense>
  );
}
