import { memo, useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Placed, type EmissiveTone } from "./Placed";
import { getAnchor, getAnchorSet, useAnchorSet, useAnchorVersion } from "./anchors";
import { useTwin } from "./context";
import { PlantInstances } from "./PlantInstances";
import { AirflowLayer, type AirPath } from "./layers/AirflowLayer";
import { ThermalVolume } from "./layers/ThermalLayer";
import { HumidityVolume } from "./layers/HumidityLayer";
import { LightCone } from "./layers/LightLayer";
import { RisingParticles } from "./layers/Particles";
import type { TwinAppliance, TwinFan, TwinLamp, TwinZone } from "../lib/twinState";
import type { ZoneTone } from "../lib/zoneTone";

const ROT_UP: [number, number, number] = [-Math.PI / 2, 0, 0]; // model +Z → world +Y
const ROT_TO_NEG_X: [number, number, number] = [0, -Math.PI / 2, 0]; // model +Z → world −X
const ROT_TO_POS_X: [number, number, number] = [0, Math.PI / 2, 0]; // model +Z → world +X

function toneOf(t: ZoneTone): EmissiveTone {
  return t === "critical" ? "bad" : t === "warn" || t === "stale" ? "warn" : t === "muted" ? "dim" : "ok";
}

function fanOf(fans: TwinFan[], id: TwinFan["id"]): TwinFan | undefined {
  return fans.find((f) => f.id === id);
}
function appOf(apps: TwinAppliance[], id: TwinAppliance["id"]): TwinAppliance | undefined {
  return apps.find((a) => a.id === id);
}

function FanModel({ id, fan, slug, at, rotation, self }: { id: string; fan: TwinFan | undefined; slug: string; at: Parameters<typeof Placed>[0]["at"]; rotation: [number, number, number]; self: string }) {
  const pct = fan?.live ? fan.pct : NaN;
  return (
    <Placed
      id={id}
      slug={slug}
      at={at}
      rotation={rotation}
      self={self}
      bind={{
        spin: [{ node: "fan_blades", pct }],
        offline: !!fan && !fan.live,
        emissive: [{ node: "fan_controller_display", on: !!fan?.live && pct > 0, tone: fan?.simulated ? "warn" : "teal", level: 0.6 }],
      }}
      pick={fan ? { entityId: fan.pctEntity, label: `${fan.label} duty`, unit: "%" } : undefined}
    />
  );
}

function ApplianceModel({
  id,
  app,
  slug,
  at,
  rotation,
  spinNode,
  glowNode,
  glowTone,
  showNode,
}: {
  id: string;
  app: TwinAppliance | undefined;
  slug: string;
  at: Parameters<typeof Placed>[0]["at"];
  rotation?: [number, number, number];
  spinNode?: string;
  glowNode?: string | RegExp;
  glowTone?: EmissiveTone;
  showNode?: string;
}) {
  const on = app?.state === "on";
  const oos = !app || app.state === "oos" || app.state === "offline";
  return (
    <Placed
      id={id}
      slug={slug}
      at={at}
      rotation={rotation}
      bind={{
        offline: oos,
        spin: spinNode ? [{ node: spinNode, pct: on ? 60 : 0 }] : undefined,
        emissive: [
          ...(glowNode ? [{ node: glowNode, on, tone: glowTone ?? "heat", level: 0.9 }] : []),
          { node: /(_status_led|_led)$/, on: !oos && on, tone: app?.simulated ? "warn" : "ok", level: 1 },
        ],
        show: showNode ? [{ node: showNode, visible: on }] : undefined,
        errorPulse: app?.state === "offline",
      }}
      pick={app?.entityId ? { entityId: app.entityId, label: app.label, kind: "binary" } : undefined}
    />
  );
}

function LampModel({ id, lamp, at, self = "hang_point" }: { id: string; lamp: TwinLamp | undefined; at: Parameters<typeof Placed>[0]["at"]; self?: string }) {
  const on = !!lamp?.on && (lamp.available || lamp.simulated);
  const level = lamp?.brightnessPct != null ? lamp.brightnessPct / 100 : 1;
  return (
    <Placed
      id={id}
      slug="lamp-sf1000"
      at={at}
      self={self}
      bind={{
        offline: !!lamp && !lamp.available && !lamp.simulated,
        emissive: [
          { node: "lamp_emitter", on, level, tone: "lamp" },
          { node: "lamp_status_led", on: !!lamp?.available, tone: lamp?.simulated ? "warn" : "ok" },
        ],
      }}
      pick={lamp ? { entityId: lamp.entityId, label: lamp.label, unit: "%" } : undefined}
    />
  );
}

/** Zone readout floating over a tent — the same numbers as the cards, placed where they are. */
function ZoneLabel({ instance, zone, offsetY = 0.3 }: { instance: string; zone: TwinZone; offsetY?: number }) {
  const set = useAnchorSet(instance);
  const { layers } = useTwin();
  if (!set || !layers.labels) return null;
  const c = new THREE.Vector3();
  set.bounds.getCenter(c);
  const f = (r: TwinZone["temp"], d: number) => (r.available ? `${r.value.toFixed(d)}${r.unit === "%" ? " %" : ` ${r.unit}`}${r.stale ? " ·HELD" : ""}` : "—");
  return (
    <Html position={[c.x, set.bounds.max.y + offsetY, c.z]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
      <div className={`dsc-twin-zone-label is-${zone.tone}`}>
        <b>{zone.label}</b>
        <span>
          {f(zone.temp, 1)} · {f(zone.rh, 0)} · {f(zone.vpd, 2)}
        </span>
        {zone.stage ? <em>{zone.stage.toUpperCase()}</em> : null}
      </div>
    </Html>
  );
}

/** Thermal + humidity volumes for a tent instance, once its bounds are known. */
function ZoneVolumes({ instance, zone }: { instance: string; zone: TwinZone }) {
  const set = useAnchorSet(instance);
  const { palette, layers } = useTwin();
  const box = useMemo(() => {
    if (!set) return null;
    const b = set.bounds.clone();
    b.min.addScalar(0.04);
    b.max.subScalar(0.04);
    return b;
  }, [set]);
  if (!box) return null;
  return (
    <>
      {layers.heat ? <ThermalVolume box={box} zone={zone} palette={palette} /> : null}
      {layers.humidity ? <HumidityVolume box={box} zone={zone} palette={palette} /> : null}
    </>
  );
}

/** Light cone from a placed lamp down to the zone's canopy plane. */
function LampCone({ lampInstance, tentInstance, lamp, plantIds }: { lampInstance: string; tentInstance: string; lamp: TwinLamp | undefined; plantIds: string[] }) {
  const v = useAnchorVersion();
  const { palette, layers } = useTwin();
  const data = useMemo(() => {
    void v;
    const hang = getAnchor(lampInstance, "hang_point");
    const tent = getAnchorSet(tentInstance);
    if (!hang || !tent) return null;
    const emitter = hang.clone();
    emitter.y -= 0.16; // board face below the hook (lamp-sf1000 origin at the hook)
    let canopy = tent.bounds.min.y + 0.5;
    for (const id of plantIds) {
      const top = getAnchor(id, "canopy_top");
      if (top) canopy = Math.max(canopy, top.y);
    }
    const s = new THREE.Vector3();
    tent.bounds.getSize(s);
    return { emitter, canopyY: Math.min(canopy, emitter.y - 0.1), halfWidth: Math.min(s.x, s.z) / 2 - 0.05 };
  }, [v, lampInstance, tentInstance, plantIds]);
  if (!data || !layers.light) return null;
  const on = !!lamp?.on && (lamp.available || lamp.simulated);
  return <LightCone emitter={data.emitter} canopyY={data.canopyY} halfWidth={data.halfWidth} brightness={lamp?.brightnessPct != null ? lamp.brightnessPct / 100 : 1} on={on} color={lamp?.simulated ? palette.warn : palette.lamp} />;
}

/** Heat shimmer above a device's anchor while it runs. */
function Shimmer({ instance, anchor, active, color, offset = [0, 0, 0], height = 0.5, spread = 0.1 }: { instance: string; anchor: string; active: boolean; color: string; offset?: [number, number, number]; height?: number; spread?: number }) {
  const a = useAnchorSet(instance);
  const { layers } = useTwin();
  const origin = useMemo(() => {
    if (!a) return null;
    const p = anchor === "" ? new THREE.Vector3().setFromMatrixPosition(a.matrix) : a.pos.get(anchor);
    return p ? p.clone().add(new THREE.Vector3(...offset)) : null;
  }, [a, anchor, offset]);
  if (!origin || !layers.heat) return null;
  return <RisingParticles origin={origin} color={color} active={active} count={active ? 50 : 0} height={height} spread={spread} rise={0.25} size={0.016} opacity={0.5} />;
}

/** Mist from a humidifier nozzle while it runs. */
function Mist({ instance, active, color }: { instance: string; active: boolean; color: string }) {
  const p = useAnchorSet(instance);
  const { layers } = useTwin();
  const origin = useMemo(() => p?.pos.get("mist_out")?.clone() ?? null, [p]);
  if (!origin || !layers.humidity) return null;
  return <RisingParticles origin={origin} color={color} active={active} count={active ? 90 : 0} height={0.7} spread={0.03} rise={0.45} drift={0.12} size={0.022} opacity={0.7} />;
}

/**
 * Air paths from the placed anchors. Room air (no tube) → fan → duct (tube) → onward.
 * Everything is world space; rebuilt whenever a model settles.
 */
function useAirPaths(): AirPath[] {
  const v = useAnchorVersion();
  const { state, palette } = useTwin();
  return useMemo(() => {
    void v;
    const t4 = getAnchorSet("tent4x8");
    const t2 = getAnchorSet("tent2x4");
    const room = getAnchorSet("room");
    if (!t4 || !room) return [];
    const P4 = new THREE.Vector3().setFromMatrixPosition(t4.matrix);
    const C4 = P4.clone().add(new THREE.Vector3(0, 1.0, 0));
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const ceiling = room.bounds.max.y - 0.08;
    const paths: AirPath[] = [];
    const fan = (id: TwinFan["id"]) => state.fans.find((f) => f.id === id);

    const inMain = getAnchor("tent4x8", "fan_intake");
    if (inMain) {
      const f = fan("intake_main");
      paths.push({
        id: "intake_main",
        color: palette.blue,
        pct: f?.pct ?? NaN,
        cfm: f?.cfm ?? NaN,
        live: !!f?.live,
        simulated: f?.simulated,
        legs: [
          { pts: [V(1.55, 0.3, 1.15), V(1.5, 0.32, 0.6), inMain.clone().add(V(0.35, 0, 0)), inMain.clone(), inMain.clone().add(V(-0.35, 0.05, 0)), C4.clone().add(V(0.2, -0.2, 0))] },
        ],
      });
    }
    const exL = getAnchor("tent4x8", "fan_exhaust");
    if (exL) {
      const f = fan("exhaust_room");
      const top = exL.clone().add(V(0, 0.3, 0));
      const dump = V(exL.x - 0.35, Math.min(ceiling, top.y + 0.05), exL.z + 0.85);
      paths.push({
        id: "exhaust_room",
        color: palette.purple,
        pct: f?.pct ?? NaN,
        cfm: f?.cfm ?? NaN,
        live: !!f?.live,
        simulated: f?.simulated,
        legs: [
          { pts: [C4.clone().add(V(-0.3, 0, 0)), exL.clone().add(V(0, -0.35, 0)), exL.clone()] },
          { pts: [exL.clone().add(V(0, 0.28, 0)), top.clone().add(V(0, 0.02, 0.3)), dump], duct: true, radius: 0.076 },
          { pts: [dump, V(dump.x - 0.3, 1.5, 1.2), V(dump.x - 0.2, 0.5, 1.25)] },
        ],
      });
    }
    const exR = getAnchor("tent4x8", "fan_exhaust_2");
    const wall = getAnchor("room", "fan_exhaust_room");
    if (exR && wall) {
      const f = fan("exhaust_outside");
      const top = exR.clone().add(V(0, 0.28, 0));
      const mid = V((top.x + wall.x) / 2, Math.min(ceiling, Math.max(top.y, wall.y) + 0.12), (top.z + wall.z) / 2);
      paths.push({
        id: "exhaust_outside",
        color: palette.warn,
        pct: f?.pct ?? NaN,
        cfm: f?.cfm ?? NaN,
        live: !!f?.live,
        simulated: f?.simulated,
        legs: [
          { pts: [C4.clone().add(V(0.3, 0, 0)), exR.clone().add(V(0, -0.35, 0)), exR.clone()] },
          { pts: [top, mid, wall.clone().add(V(0, 0, 0.12)), wall.clone()], duct: true, radius: 0.076 },
          { pts: [wall.clone(), wall.clone().add(V(0, 0, -0.45))] },
        ],
      });
    }
    if (t2) {
      const P2 = new THREE.Vector3().setFromMatrixPosition(t2.matrix);
      const in2 = getAnchor("tent2x4", "fan_intake") ?? getAnchor("tent2x4", "vent_port_side_right_lower");
      const roof2 = getAnchor("tent2x4", "fan_exhaust") ?? getAnchor("tent2x4", "vent_port_roof");
      const f = fan("intake_2x4");
      if (in2 && roof2) {
        paths.push({
          id: "intake_2x4",
          color: palette.accent,
          pct: f?.pct ?? NaN,
          cfm: f?.cfm ?? NaN,
          live: !!f?.live,
          simulated: f?.simulated,
          legs: [
            {
              pts: [V(P2.x - 0.9, 0.3, 1.15), V(in2.x + 0.5, 0.3, in2.z + 0.4), in2.clone().add(V(0.35, 0, 0)), in2.clone(), in2.clone().add(V(-0.3, 0.05, 0)), P2.clone().add(V(0, 0.6, 0)), roof2.clone().add(V(0, -0.25, 0)), roof2.clone()],
            },
          ],
        });
        const pass = getAnchor("tent4x8", "duct_passive");
        if (pass) {
          const up = roof2.clone().add(V(0, 0.15, 0));
          const outer = pass.clone().add(V(-0.3, 0, 0));
          paths.push({
            id: "cascade_2x4",
            color: palette.teal,
            pct: Number.isFinite(state.cascadeCfm) ? Math.max(15, Math.min(100, state.cascadeCfm)) : f?.pct ?? NaN,
            cfm: state.cascadeCfm,
            live: Number.isFinite(state.cascadeCfm) || !!f?.live,
            legs: [
              { pts: [roof2.clone(), up, V(up.x + 0.3, Math.min(ceiling, up.y + 0.1), up.z - 0.3), V(outer.x - 0.15, outer.y + 0.5, outer.z), outer], duct: true, radius: 0.051 },
              { pts: [outer, pass.clone(), pass.clone().add(V(0.4, 0.1, 0))] },
            ],
          });
        }
      }
    }
    return paths;
  }, [v, state.fans, state.cascadeCfm, palette]);
}

/**
 * The rig as it stands today: the room, both tents, every device the kit knows, and the
 * roster in place — each bound to its zone / entity. Models come from the manifest by slug.
 */
function RigSceneImpl() {
  const { state, palette, layers } = useTwin();
  const { main, clone } = state.zones;
  const lampMain = state.lamps.find((l) => l.zone === "main");
  const lampClone = state.lamps.find((l) => l.zone === "clone");
  const heater = appOf(state.appliances, "heater");
  const hum = appOf(state.appliances, "humidifier");
  const dehum = appOf(state.appliances, "dehumidifier");
  const ac = appOf(state.appliances, "ac");
  const mat = appOf(state.appliances, "heatmat");
  const chum = appOf(state.appliances, "clone_humidifier");
  const mister = appOf(state.appliances, "mister");
  const airPaths = useAirPaths();
  const mainPlantIds = state.plants.filter((p) => p.zone === "main").map((p) => `plant-${p.slot}`);
  const clonePlantIds = state.plants.filter((p) => p.zone === "clone").map((p) => `plant-${p.slot}`);
  const cloneSeedlings = state.plants.some((p) => p.zone === "clone" && p.variant === "seedling");

  return (
    <group name="rig">
      <Placed id="room" slug="grow-room-shell" at={{ position: [0, 0, 0] }} bind={{ tint: [{ material: "trim_green", tone: toneOf(state.zones.room.tone) }] }}>
        {/* ---- 4×8 -------------------------------------------------------------- */}
        <Placed
          id="tent4x8"
          slug="grow-tent-240x120x210"
          at={{ parent: "room", anchor: "tent_4x8" }}
          bind={{ tint: [{ material: "trim_green", tone: toneOf(main.tone) }], errorPulse: main.tone === "critical" }}
          pick={{ entityId: main.temp.entityId, label: "4×8 tent", unit: "°C" }}
        >
          <LampModel id="lamp4x8" lamp={lampMain} at={{ parent: "tent4x8", anchor: "lamp_main" }} />
          {layers.devices ? (
            <>
              <FanModel id="fanExRoom" fan={fanOf(state.fans, "exhaust_room")} slug="fan-inline-6in" at={{ parent: "tent4x8", anchor: "fan_exhaust" }} rotation={ROT_UP} self="duct_in" />
              <FanModel id="fanExOut" fan={fanOf(state.fans, "exhaust_outside")} slug="fan-inline-6in" at={{ parent: "tent4x8", anchor: "fan_exhaust_2" }} rotation={ROT_UP} self="duct_in" />
              <Placed id="filterOut" slug="carbon-filter-4in" at={{ parent: "tent4x8", anchor: "fan_exhaust_2", offset: [0, -0.03, 0] }} rotation={ROT_UP} self="duct_out" />
              <FanModel id="fanIntakeMain" fan={fanOf(state.fans, "intake_main")} slug="fan-inline-4in" at={{ parent: "tent4x8", anchor: "fan_intake" }} rotation={ROT_TO_NEG_X} self="duct_out" />
              <Placed id="ventPassive" slug="vent-passive-mesh--4in" at={{ parent: "tent4x8", anchor: "duct_passive" }} rotation={ROT_TO_POS_X} self="duct_in" />
              <Placed id="puck4x8" slug="sensor-zigbee-puck" at={{ parent: "tent4x8", anchor: "canopy_sensor" }} self="hang_point" bind={{ emissive: [{ node: "puck_led", on: state.hubOnline, tone: "ok", level: 0.6 }] }} />
              <Placed id="cam4x8" slug="camera-ip-fixed" at={{ parent: "tent4x8", anchor: "", offset: [-1.18, 1.95, 0.6] }} rotation={[0.45, Math.PI * 0.72, 0]} self="mount" bind={{ emissive: [{ node: "cam_status_led", on: false, tone: "dim" }] }} />
              <ApplianceModel id="heater" app={heater} slug="heater-fan-2kw" at={{ parent: "tent4x8", anchor: "", offset: [-1.02, 0, -0.32] }} rotation={[0, Math.PI / 5, 0]} spinNode="heater_fan_blades" glowNode="heat_element" glowTone="heat" />
              <ApplianceModel id="humidifier" app={hum} slug="humidifier-ultrasonic-4l" at={{ parent: "tent4x8", anchor: "", offset: [1.02, 0, -0.32] }} showNode="mist_plume" />
              <Shimmer instance="heater" anchor="outlet_face" active={heater?.state === "on"} color={palette.warn} offset={[0, 0.05, 0.1]} height={0.8} spread={0.12} />
              <Mist instance="humidifier" active={hum?.state === "on"} color={palette.teal} />
            </>
          ) : null}
          <LampCone lampInstance="lamp4x8" tentInstance="tent4x8" lamp={lampMain} plantIds={mainPlantIds} />
          <ZoneVolumes instance="tent4x8" zone={main} />
          <ZoneLabel instance="tent4x8" zone={main} />
        </Placed>

        {/* ---- 2×4 -------------------------------------------------------------- */}
        <Placed
          id="tent2x4"
          slug="grow-tent-120x60x210"
          at={{ parent: "room", anchor: "tent_2x4" }}
          bind={{ tint: [{ material: "trim_green", tone: toneOf(clone.tone) }], errorPulse: clone.tone === "critical" }}
          pick={{ entityId: clone.temp.entityId, label: "2×4 tent", unit: "°C" }}
        >
          <LampModel id="lamp2x4" lamp={lampClone} at={{ parent: "tent2x4", anchor: "lamp_main" }} />
          <Placed id="mat2x4" slug="heat-mat-25x50" at={{ parent: "tent2x4", anchor: "mat_spot", offset: [0, 0.002, 0] }} rotation={[0, Math.PI / 2, 0]} bind={{ offline: !mat || mat.state === "offline", emissive: [{ node: "heat_element", on: mat?.state === "on", tone: mat?.simulated ? "warn" : "heat", level: 0.7 }] }} pick={mat?.entityId ? { entityId: mat.entityId, label: mat.label, kind: "binary" } : undefined} />
          {layers.devices ? (
            <>
              <FanModel id="fanIntake2x4" fan={fanOf(state.fans, "intake_2x4")} slug="fan-inline-4in" at={{ parent: "tent2x4", anchor: "fan_intake" }} rotation={ROT_TO_NEG_X} self="duct_out" />
              <Placed id="ventPassive2x4" slug="vent-passive-mesh--4in" at={{ parent: "tent2x4", anchor: "duct_passive_1" }} rotation={ROT_TO_POS_X} self="duct_in" />
              <ApplianceModel id="cloneHum" app={chum} slug="humidifier-ultrasonic-4l" at={{ parent: "tent2x4", anchor: "humidifier_spot", offset: [0, 0.002, 0] }} showNode="mist_plume" />
              <ApplianceModel id="mister" app={mister} slug="mister-clone" at={{ parent: "tent2x4", anchor: "mister_spot", offset: [0, 0.002, 0] }} showNode="mist_plume_1" />
              <Placed id="domeTray" slug="clone-dome-tray" at={{ parent: "tent2x4", anchor: "tray_upper", offset: [0, 0.002, 0] }} bind={{ show: [{ node: "sprouts", visible: cloneSeedlings }] }} />
              <Placed id="puck2x4" slug="sensor-zigbee-puck" at={{ parent: "tent2x4", anchor: "canopy_sensor", offset: [0, 0.13, 0] }} self="hang_point" bind={{ emissive: [{ node: "puck_led", on: state.hubOnline, tone: "ok", level: 0.6 }] }} />
              <Placed id="cam2x4" slug="camera-ip-fixed" at={{ parent: "tent2x4", anchor: "", offset: [-0.56, 0.95, 0.26] }} rotation={[0.35, Math.PI * 0.75, 0]} self="mount" bind={{ emissive: [{ node: "cam_status_led", on: false, tone: "dim" }] }} />
              <Shimmer instance="mat2x4" anchor="" active={mat?.state === "on"} color={palette.warn} offset={[0, 0.01, 0]} height={0.35} spread={0.2} />
              <Mist instance="cloneHum" active={chum?.state === "on"} color={palette.teal} />
            </>
          ) : null}
          <LampCone lampInstance="lamp2x4" tentInstance="tent2x4" lamp={lampClone} plantIds={clonePlantIds} />
          <ZoneVolumes instance="tent2x4" zone={clone} />
          <ZoneLabel instance="tent2x4" zone={clone} />
        </Placed>

        {/* ---- room-class kit ---------------------------------------------------- */}
        {layers.devices ? (
          <>
            <ApplianceModel id="dehum" app={dehum} slug="dehumidifier-compact-12l" at={{ parent: "room", anchor: "dehum_spot" }} rotation={[0, -Math.PI / 2, 0]} spinNode="dehum_fan_blades" />
            <ApplianceModel id="ac" app={ac} slug="ac-portable-9000btu" at={{ parent: "room", anchor: "ac_spot" }} rotation={[0, -Math.PI / 2, 0]} spinNode="ac_fan_blades" />
            <Placed id="tank" slug="reservoir-tank-60l" at={{ parent: "room", anchor: "tank_spot" }} bind={{ offline: true }} />
            <Placed id="brain" slug="brain-rpi" at={{ parent: "room", anchor: "tank_spot", offset: [0, 0.36, 0] }} bind={{ emissive: [{ node: /^brain_(power|activity)_led$/, on: true, tone: "ok", level: 0.9 }, { node: "zigbee_led", on: state.hubOnline, tone: "teal", level: 0.8 }] }} pick={{ entityId: "sensor.dsc_hub_heartbeat", label: "Brain (Pi)" }} />
            <Placed id="panel" slug="panel-cyd-control" at={{ parent: "room", anchor: "hub_mount", offset: [0.35, -0.1, 0.01] }} self="mount" bind={{ offline: !state.panelOnline, emissive: [{ node: "panel_screen", on: state.panelOnline, tone: "teal", level: 0.8 }, { node: "panel_status_led", on: state.panelOnline, tone: "ok" }] }} />
            <Placed
              id="hub"
              slug="hub-esp32-cyd"
              at={{ parent: "room", anchor: "hub_mount", offset: [0, -0.1, 0.01] }}
              self="mount"
              bind={{
                offline: !state.hubOnline,
                emissive: [
                  { node: "hub_screen", on: state.hubOnline, tone: "teal", level: 0.8 },
                  { node: /^hub_(status|link)_led/, on: state.hubOnline, tone: "ok", level: 0.9 },
                ],
              }}
              pick={{ entityId: "sensor.dsc_hub_heartbeat", label: "Hub heartbeat" }}
            />
          </>
        ) : null}
        <PlantInstances />
      </Placed>
      {layers.air ? <AirflowLayer paths={airPaths} /> : null}
    </group>
  );
}

export const RigScene = memo(RigSceneImpl);
