import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Placed, type PlaceAt, type EmissiveTone } from "./Placed";
import { useAnchor } from "./anchors";
import { useTwin } from "./context";
import type { TwinPlant } from "../lib/twinState";
import type { ZoneTone } from "../lib/zoneTone";
import { probeLabel } from "../lib/probeModel";

function toneOf(t: ZoneTone): EmissiveTone {
  return t === "critical" ? "bad" : t === "warn" || t === "stale" ? "warn" : t === "muted" ? "dim" : "ok";
}

function stageShort(stage: string): string {
  const s = stage.toLowerCase();
  if (s.includes("germ")) return "GERM";
  if (s.includes("seedling")) return "SEEDLING";
  if (s.includes("early veg")) return "EARLY VEG";
  if (s.includes("push")) return "PUSH VEG";
  if (s.includes("veg")) return "VEG";
  if (s.includes("early flower")) return "EARLY FLWR";
  if (s.includes("final")) return "FLUSH";
  if (s.includes("late flower")) return "LATE FLWR";
  if (s.includes("flower")) return "FLOWER";
  return stage === "—" ? "NO STAGE" : stage.toUpperCase();
}

/** Label above the canopy (or the pot rim when nothing grows yet). */
function PlantLabel({ plant, vesselId, plantId }: { plant: TwinPlant; vesselId: string; plantId: string }) {
  const canopy = useAnchor(plantId, "canopy_top");
  const rim = useAnchor(vesselId, "label_tab");
  const ctx = useTwin();
  const top = canopy ?? rim;
  if (!top || !ctx.layers.labels) return null;
  const tone = plant.probeOos ? "muted" : plant.moistureTone;
  return (
    <Html position={[top.x, top.y + 0.12, top.z]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className={`dsc-twin-plant-label is-${tone}`}>
        <b>{plant.name}</b>
        <span>
          {stageShort(plant.stage)}
          {plant.day != null ? ` · DAY ${plant.day}` : ""}
          {plant.pot != null ? ` · ${probeLabel(plant.pot).toUpperCase()}` : " · NO PROBE"}
          {Number.isFinite(plant.moisture) ? ` · ${Math.round(plant.moisture)} %` : ""}
        </span>
      </div>
    </Html>
  );
}

/**
 * Where a plant stands: its probe anchor in the 4×8 or the 2×4, or the waiting bench along
 * the room's open front. The 2×4 (120 × 60 × 210) carries only two probe anchors, so a
 * third clone and beyond stand on the mat between them rather than piling onto probe_1 —
 * spaced along the tent's 1.2 m width, which is where they would really go.
 */
export function plantPlace(p: TwinPlant, index: number, cloneIndex: number): PlaceAt {
  if (p.zone === "main" && p.pot != null && p.pot >= 1 && p.pot <= 4) return { parent: "tent4x8", anchor: `probe_${p.pot}` };
  if (p.zone === "clone") {
    if (cloneIndex < 2) return { parent: "tent2x4", anchor: cloneIndex === 0 ? "probe_1" : "probe_2" };
    // −0.36 … +0.36 m across the mat, two rows deep once more than four are in the tent.
    const n = cloneIndex - 2;
    return { parent: "tent2x4", anchor: "mat_spot", offset: [-0.36 + (n % 4) * 0.24, 0.002, n >= 4 ? -0.14 : 0.1] };
  }
  return { position: [-1.5 + (index % 5) * 0.4, 0, 1.05] };
}

/**
 * Every roster plant, in place, as two models (pack 3): the catalogue vessel it is potted
 * in, and the plant at its hub growth stage standing on the vessel's soil (`plant_base`),
 * scaled 0.85–1.15 by progression through the stage. Leaves tint by the zone's VPD tone;
 * the probe stake in the soil lights by moisture tone. Falls back to the pack-1 baked pot
 * when a vessel model is missing from the manifest.
 */
export function PlantInstances() {
  const { state, models, layers } = useTwin();
  const plants = state.plants;
  const rows = useMemo(() => {
    let clone = 0;
    return plants.map((p, i) => ({ p, at: plantPlace(p, i, p.zone === "clone" ? clone++ : 0), id: `plant-${p.slot}` }));
  }, [plants]);
  if (!layers.plants) return null;
  return (
    <group name="plants">
      {rows.map(({ p, at, id }) => {
        const zoneTone = p.zone === "main" ? state.zones.main.vpd.tone : p.zone === "clone" ? state.zones.clone.vpd.tone : "muted";
        const leaf = toneOf(zoneTone);
        const vesselSlug = `vessel--${p.vessel.id}`;
        const vesselModel = models[vesselSlug];
        const plantSlug = p.stageSlug ? `plant-stage--${p.stageSlug}` : null;
        const canopyScale = 0.85 + 0.3 * p.progress;
        if (!vesselModel) {
          // pack-1 fallback: baked pot + plant, scaled by the app
          return (
            <Placed key={id} id={id} slug={`pot-fabric-3gal-plant-${p.variant}`} at={at} bind={{ tint: [{ node: /^plant_(stem|leaves)$/, tone: leaf }] }} pick={p.pot != null ? { entityId: `text.dsc_probe${p.pot}_plant_name`, label: p.name } : undefined}>
              <Footprint id={id} radius={p.potDiameterM / 2} tone={p.zone === "unassigned" ? "dim" : leaf} />
              <PlantLabel plant={p} vesselId={id} plantId={id} />
            </Placed>
          );
        }
        const footprintM = (vesselModel.dims_cm[0] / 100) / 2;
        const plantId = `${id}-plant`;
        return (
          <Placed
            key={id}
            id={id}
            slug={vesselSlug}
            at={at}
            bind={{
              show: [{ node: "soil_wet", visible: false }],
              tint: [{ node: "soil_surface", tone: p.probeOos ? "dim" : toneOf(p.moistureTone) }],
            }}
            pick={p.pot != null ? { entityId: `text.dsc_probe${p.pot}_plant_name`, label: `${p.name} · ${p.vessel.label}` } : undefined}
          >
            <Footprint id={id} radius={footprintM} tone={p.zone === "unassigned" ? "dim" : leaf} />
            {plantSlug ? (
              <Placed
                id={plantId}
                slug={plantSlug}
                at={{ parent: id, anchor: "plant_base" }}
                scale={canopyScale}
                bind={{ tint: [{ node: /^plant_(stem|leaves)$/, tone: leaf }] }}
                pick={p.pot != null ? { entityId: `select.dsc_probe${p.pot}_growth_stage`, label: `${p.name} · ${p.stage}` } : undefined}
              />
            ) : null}
            {p.pot != null ? (
              <Placed
                id={`probe-${p.pot}`}
                slug="probe-stake-soil"
                at={{ parent: id, anchor: "probe_socket" }}
                self="soil_line"
                bind={{ offline: p.probeOos, emissive: [{ node: "probe_status_led", on: !p.probeOos, tone: toneOf(p.moistureTone) }] }}
                pick={{ entityId: `sensor.dsc_probe${p.pot}_got_moisture`, label: `Probe ${p.pot} moisture`, unit: "%" }}
              />
            ) : null}
            <PlantLabel plant={p} vesselId={id} plantId={plantId} />
          </Placed>
        );
      })}
    </group>
  );
}

function Footprint({ id, radius, tone }: { id: string; radius: number; tone: EmissiveTone }) {
  const base = useAnchor(id, "");
  const { palette } = useTwin();
  const geo = useMemo(() => new THREE.RingGeometry(Math.max(0.02, radius * 1.1 - 0.01), radius * 1.1, 48), [radius]);
  if (!base) return null;
  const color = tone === "bad" ? palette.bad : tone === "warn" ? palette.warn : tone === "dim" ? palette.dim : palette.accent;
  return (
    <mesh position={[base.x, base.y + 0.004, base.z]} rotation={[-Math.PI / 2, 0, 0]} geometry={geo} raycast={() => undefined}>
      <meshBasicMaterial color={color} transparent opacity={0.45} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}
