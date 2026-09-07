# 3D twin — model briefs, pack 3: what the live scene asked for

Packs 1 and 2 (`BRIEFS.md`, `BRIEFS-2.md`) are built: 101 GLBs in `frontend/public/models/`
from the 79 builder sources in `docs/design/models/src/pack/`. On 2026-09-07 the first
composed scene went live at `#/twin` (`frontend/src/twin/RigScene.tsx`): the room, both
tents, every rig device at its anchor, the roster in place, and the effect layers (air,
heat, humidity, light). Composing the library exposed the gaps below. Same rules, same
node grammar, same wire look; every prompt is paste-ready for the 3D designer and every
output is a builder module for `frontend/scripts/build-twin-models.mjs` (the harness
exports the GLBs and the manifest — do not hand-export).

Read this pack top to bottom: § A changes *how* plants are modelled (one decision, many
files), § B–F are new objects, § G is what the operator measures, § H is the manifest
delta the app needs.

---

## 0. Shared header (v3) — paste before every prompt

```
You are authoring objects for a live digital-twin scene of a cannabis grow room
(DSC-HUB). Output a three.js BUILDER MODULE per object, not a GLB:

  export const budget = { tris: <n>, meshes: <n> };
  export const variants = [ ... ];                 // only for families
  export function build(THREE, P, L, variant?) { ... return rootGroup; }

`P` is the named material palette, `L` the helper library (box, cyl, torus, plate,
plateGeo, roundedBox, roundedBoxGeo, tg, rodGeo, bladesGeo, mesh, merge, anchor) —
exactly as in docs/design/models/src/pack/_pot.js and _fan.js. Copy their style.

Conventions (must follow exactly):
- Units metres. Y is up. Origin at the object's floor-contact centre (x/z centred,
  y = 0 at the bottom) unless the prompt states another origin. Real dimensions.
- One mesh per named node; names snake_case `<part>_<role>[_n]` exactly as listed —
  the app binds live data by node name. Any part that moves (blades, vanes, a float,
  a door) is its OWN child node with its pivot at its axis of rotation. Blade meshes
  are built with L.bladesGeo so their spin axis is their local +Y.
- Materials by NAME only from this list (the app recolours them from design tokens):
    shell_black, foil_lining, trim_green, roller_silver, window_acrylic, frame_steel,
    tray_pvc, plastic_white, plastic_dark, duct_foil, fan_blade, lamp_emitter,
    heat_element, led_status, water, soil, leaf_green, pot_fabric, cable_black,
    screen_glass, mesh_wire, glass_clear, metal_brass, rubber_black
  Emissive-capable parts (lamp_emitter, heat_element, led_status, screen_glass) and
  anything the app tints by state (plume, water plane, buds, leaves) are their own mesh.
- Anchors: `L.anchor(THREE, P.plastic_dark, '<name>', [x, y, z])` — exported as empty
  named nodes. `duct_in` / `duct_out` sit at the opening centre with +Z along airflow.
- Low poly, clean: within budget; no interior detail never seen; outward normals; no
  n-gons; curves at 16–24 segments; prefer few larger meshes.
- Silhouette over surface detail: crisp creases where a human recognises the device;
  the app draws edges at 25°.
```

---

# A · Plants: split the plant from the pot

**Decision.** Pack 1's `pot-fabric-3gal-plant-<stage>` bakes a 3-gal pot and a plant
into one GLB. The live scene has to show *every roster plant at its real vessel and
real stage*, and the roster already carries both (`vessel` from the six-item catalogue,
`growth_stage` from the nine hub presets). Nine stages × six vessels is 54 baked GLBs;
split into **a plant family standing on a soil surface** and **a vessel family with a
`plant_base` anchor** it is 9 + 6, and any plant sits on any pot. The app already
scales the pot to the vessel volume and the canopy to the stage progression
(`frontend/src/twin/PlantInstances.tsx`); with this pack it stops scaling a 3-gal pot
into a 25 L bag and draws the real thing.

## 1. `plant-stage` — the nine hub stages (nine variants, one plant each)

**Budget** ≤ 1.8 k tris each (germination ≤ 200). **Origin:** at the soil surface centre
(y = 0 is the soil; the stem rises from it). **Binds to:** roster stage → variant;
progression inside the stage → app scale 0.85–1.15; zone VPD tone → `leaf_green`
tint; bud phase → `plant_buds` tint; hover → name · strain · day.

```
Object family: a stylised cannabis plant at each hub growth stage, standing on a soil
surface at y = 0 (no pot — the vessel family supplies it). Keep every plant abstract
and low-poly: leaves are five-finger fans of thin quads (see _plant.js fanGeo), stems
are rods, buds are elongated ellipsoids. Sizes are typical indoor plants under a
270 mm quantum board:
  germination   — a 15 mm split seed (soil-coloured sphere pair) with a 20 mm white
                  radicle loop: nodes plant_seed (soil), plant_stem (plastic_white).
  seedling      — 70 mm stem, two 40 mm cotyledon quads + one 3-finger 50 mm fan.
  early-veg     — 180 mm stem, 4 nodes of 5-finger fans (60–90 mm), no branches.
  veg           — 350 mm stem, 2 side branches, 7 fans (as pack-1 veg).
  push-veg      — 480 mm stem, 4 side branches, 11 fans, canopy Ø 500 mm.
  early-flower  — push-veg stretched to 620 mm with 8 small bud clusters (25 × 50 mm)
                  at branch tips and the apex; a few white pistil quads per cluster.
  flower        — 680 mm, 8 buds swelling to 40 × 90 mm, 9 fans; canopy Ø 550 mm.
  late-flower   — 680 mm, 8 buds 50 × 120 mm, fewer fans (6, one third yellowing —
                  its own mesh plant_leaves_fade using `soil` material so the app can
                  dim it), stem ties suggested by two thin rings.
  flush         — as late-flower with 4 fans only, all in plant_leaves_fade.
Nodes (exact, every variant): plant_stage (root); plant_stem; plant_leaves;
plant_leaves_fade (late-flower, flush only); plant_buds (early-flower onward);
plant_pistils (early-flower onward, plastic_white); plant_seed (germination only).
Materials: leaf_green (stem, leaves), trim_green (buds), plastic_white (pistils),
soil (seed, fading leaves).
Anchors: canopy_top (highest point), canopy_centre (centroid of the leaf mass — where
a canopy sensor reads), stake_1..2 (where support stakes enter, 60 mm off centre;
veg onward).
export const variants = ['germination','seedling','early-veg','veg','push-veg',
  'early-flower','flower','late-flower','flush'];
Export plant-stage--<variant>.glb.
```

## 2. `vessel` — the roster's vessel catalogue (six variants)

**Budget** ≤ 700 tris each. **Origin:** floor centre. **Binds to:** roster `vessel` id
→ variant; probe present → `probe_socket` takes a stake; water event → `soil_wet`
plane (hidden until a shot/irrigation is logged); dryback % → `soil_surface` tint.

The ids and volumes are the app's `VESSEL_CATALOG` (`frontend/src/lib/vesselSpec.ts`)
— keep them exactly so the manifest slug is `vessel--<catalogue id>`.

```
Object family: empty grow vessels with a substrate disc 25 mm below the rim and a thin
`soil_wet` disc 1 mm above it (hidden by the app until irrigation runs). Real
proportions for the volume:
  generic_fabric_25l   — fabric grow bag Ø 320 × 300 mm, slouched wall (a lathe with a
                         slight belly), 15 mm rolled rim, two 60 mm strap handles.
  generic_fabric_20l   — fabric bag Ø 300 × 280 mm, same construction.
  felt_15l             — felt pot Ø 270 × 260 mm, stiffer (straight taper), handles.
  generic_tall_pet_20l — tall translucent PET pot Ø 250 × 400 mm, straight sides with
                         four vertical ribs, 12 drain slots in the base (suggested by
                         a ring of shallow quads), material window_acrylic so the
                         soil column reads through it (soil_column mesh: a cylinder
                         5 mm inside the wall, material soil).
  plastic_taper_15l    — rigid tapered plastic pot Ø 280 top / 200 base × 260 mm,
                         10 mm rim, four drain slots.
  airpot_20l           — Air-Pot cylinder Ø 300 × 320 mm, wall as 8 rings of 20 shallow
                         cones (ONE mesh ≤ 500 tris), perforated base disc, a clip strip.
Nodes: vessel (root); pot_body; pot_rim; pot_handles (fabric/felt); pot_drain (PET,
taper, airpot); soil_surface; soil_wet; soil_column (PET only).
Materials: pot_fabric (bags, felt), plastic_dark (taper, airpot, rims, drains),
window_acrylic (PET wall), soil, water (soil_wet).
Anchors: plant_base (soil surface centre — a plant-stage root snaps here),
probe_socket (on the soil, 60 mm toward −Z), saucer_under (base centre),
emitter_1..2 (soil surface at ±80 mm x — drip stakes), label_tab (rim, +Z).
export const variants = ['generic_fabric_25l','generic_fabric_20l','felt_15l',
  'generic_tall_pet_20l','plastic_taper_15l','airpot_20l'];
```

## 3. `plant-lod-blob` — canopy proxies for the phone still and far camera

**Budget** ≤ 120 tris each. Three sizes (`s`, `m`, `l` = canopy Ø 0.25 / 0.45 / 0.65 m).
A soft ellipsoid hull on a stem stub, `leaf_green`; nodes `plant_lod` (root), `blob`,
`stem`. Anchor `canopy_top`. The app swaps to it beyond 5 m or on the pre-rendered still.

---

# B · The rig as it really stands

## 4. `grow-tent-120x60x210` — rebuild the 2×4 as a builder module

The hand-authored 2×4 (`docs/design/models/src/grow-tent-120x60x210.obj`) is the only
model without anchor empties: the app derives its ports from mesh-name prefixes and
guesses where the lamp hangs and the mat lies. Rebuild it from the pack-2 `grow-tent`
family builder with the divider kept.

```
Object: the 120 × 60 × 210 cm 2-in-1 clone tent, built with the pack-2 grow-tent
construction (poles, rails, lining, doors, windows, floor tray) plus its divider shelf
at 105 cm splitting a lower grow chamber from an upper propagation chamber; two
observation windows (front lower, front upper), a vent window on the upper front,
ports as the hand model: one 4" roof port rear-centre, one 4" side port low right,
one 4" side port upper left and one lower left, one 4" port into the upper chamber,
two cable ports. Same node names as the hand model where they exist
(vent_port_roof_*, vent_port_side_right_lower_*, vent_port_side_left_upper_*,
vent_port_side_left_lower_*, vent_port_upper_chamber_*, divider_shelf, floor_tray,
observation_window_1/2_*, vent_window_*, door_main_left/right_*).
Anchors (new — this is the point): lamp_main (divider underside centre − 2 cm),
lamp_upper (roof underside centre, for a T5 or clip lamp over the dome tray),
mat_spot (floor tray centre), probe_1 (x −25 cm), probe_2 (x +25 cm) on the tray,
tray_upper (divider top centre — takes a clone-dome-tray), fan_intake (side right
lower), fan_exhaust (roof), duct_passive_1 (side left lower), duct_passive_2 (side
left upper), duct_upper (upper chamber port), canopy_sensor (60 cm above the tray),
humidifier_spot (tray, x +45 cm z −15 cm), mister_spot (tray, x −45 cm z −15 cm),
cable_1, cable_2.
Budget ≤ 9 k tris, ≤ 60 meshes. Export grow-tent-120x60x210.glb (same slug — the
manifest row replaces the hand-authored one; keep `zone: "2x4"`).
```

## 5. `brain-rpi` — the Pi that runs the brain

**Size** 0.10 × 0.07 × 0.035 m case. **Budget** ≤ 400. Binds to brain reachability
(`led_status` breathe), Wi-Fi/eth link (two LEDs).

```
Object: a Raspberry Pi 4 in a dark aluminium case 100 × 70 × 35 mm with fins along the
top (6 shallow ridges), an Ethernet jack and two USB stacks on one short end (recessed
quads), a 3 mm activity LED and a 3 mm power LED on the front edge, a USB-C stub and a
micro-HDMI slot on the long side, a 20 mm Zigbee USB dongle standing out of one USB
port (own mesh with its own 2 mm LED). Origin floor centre (it sits on a shelf).
Nodes: brain_rpi (root); brain_case; brain_ports; brain_power_led; brain_activity_led;
zigbee_dongle; zigbee_led; brain_cable. Materials: plastic_dark (case), roller_silver
(ports), led_status (LEDs), plastic_white (dongle), cable_black. Anchors: mount,
cable_out, dongle_tip.
```

## 6. `panel-cyd-control` — the wall control panel seat

The rig has two CYD boards: the hub (`hub-esp32-cyd`, pack 1) and a `panel` seat.
Same brief as pack-1 § 13 with a 3.5" (74 × 49 mm) screen, no antenna, no glands, a
single USB-C stub; nodes `panel_cyd (root); panel_enclosure; panel_screen;
panel_status_led; panel_usb; panel_ears`. Anchors `mount`, `cable_out`. Budget ≤ 400.

## 7. `probe-temp-wired` — the root-zone / mat thermistor

The hub reads `coldest_root_zone_temp` from a wired probe under the mat. **Budget**
≤ 150.

```
Object: a stainless temperature probe: a 6 mm × 50 mm steel tip with a 20 mm black
strain-relief collar and a 300 mm cable ending in a 2-pin plug. Origin at the tip
(y = 0 at the tip point, probe standing up; the app lays it flat by rotation). Nodes:
probe_temp_wired (root); probe_tip; probe_collar; probe_cable; probe_plug. Materials:
frame_steel, rubber_black, cable_black, plastic_white. Anchors: tip, cable_out.
```

## 8. `sensor-hygrometer-lcd` — the cheap T/RH puck with a screen

Every grow has two or three. **Size** 0.06 × 0.06 × 0.02 m. **Budget** ≤ 250. Binds to
a Zigbee or Bluetooth T/RH role (screen glows when bound; hover T · RH).

```
Object: a square white hygrometer 60 × 60 × 20 mm with rounded corners, a 40 × 25 mm
LCD window (screen_glass), a small vent slot row on one side, a hanging hole tab on
top and a fold-out stand at the back (own child node hinged at the top edge). Origin at
the back face centre with y = 0 at the bottom edge. Nodes: sensor_hygro (root);
hygro_body; hygro_screen; hygro_vents; hygro_tab; hygro_stand (child). Materials:
plastic_white, screen_glass, plastic_dark. Anchors: mount, hang_point.
```

## 9. `sensor-ir-leaf-temp` — the leaf-temperature sensor the derived VPD is waiting for

`leafVpdKpa` uses a −1.5 °C assumption "until a leaf sensor exists". **Budget** ≤ 250.

```
Object: an IR leaf-temperature sensor: a 25 mm diameter × 40 mm black cylinder with a
10 mm lens ring (glass_clear disc) at the front, a 3 mm LED at the back, on a 200 mm
gooseneck (6 bends, roller_silver) from a 40 mm spring clip (two jaws). Origin at the
clip jaw centre, y = 0 at the clip bottom. Nodes: sensor_ir_leaf (root); ir_body;
ir_lens; ir_status_led; ir_gooseneck; clip_jaw_top; clip_jaw_bottom; ir_cable.
Materials: plastic_dark, glass_clear, led_status, roller_silver, cable_black. Anchors:
clip_point, aim (lens centre, +Z is the sight line), cable_out.
```

## 10. `plug-timer-mechanical` and `plug-smart-au-single`

Two more seats the twin should be able to draw when the kit grows: a 24-hour mechanical
segment timer (Ø 80 × 40 mm dial face, screen_glass for the dial, `timer_dial` its own
child so the app can turn it to the hour) and a generic AU smart plug (the S31 is US
pin-shaped; ours are AU). Same node grammar as pack-1 § 14. Budget ≤ 400 each.

## 11. `fan-wall-oscillating-40cm` — the 16" wall fan on the room wall

Pack 2 has clip, tower and pedestal fans; the room will get a wall-mounted oscillating
fan. **Budget** ≤ 1.2 k. As pack-2 § 44 (pedestal) without the column: a wall bracket
plate 150 × 100 mm, a 200 mm arm, tilt knuckle, `fan_head` (yaw pivot at the arm end),
guards, `fan_blades` (child of fan_head), pull cords. Origin at the bracket back face,
y = 0 at its bottom edge. Anchors `mount`, `outlet_face`, `cable_out`.

---

# C · Room and site

## 12. `grow-room-shell` — the real room (replaces the 3.6 × 2.4 placeholder)

Author only after § G is measured. Same nodes as pack-1 § 17 plus: `ceiling_light`
(a 300 × 300 × 40 mm LED panel flush on the ceiling, lamp_emitter face, own mesh —
binds to the room light plug if one exists), `outlet_plate_1..n` (one per real GPO),
`skirting` (one mesh), `door_leaf` (child, hinge pivot), `window_pane`. Anchors:
`tent_4x8`, `tent_2x4`, `fan_exhaust_room`, `dehum_spot`, `ac_spot`, `tank_spot`,
`hub_mount`, `panel_mount`, `brain_shelf`, `router_spot`, `power_1..n` (GPO centres),
`camera_1..2` (upper corners, see § 13), `wall_fan_mount`. Keep the front wall open
(+Z) so the camera can look in. Budget ≤ 2 k.

## 13. `camera-ip-fixed` — the per-tent camera the settings plan already decided on

The settings plan (2026-09-07) fixes one IP camera per tent for timelapse and plant
regions. Pack 2's `camera-cube` is a desk cam; this is the fixed one. **Budget** ≤ 350.

```
Object: a small fixed IP camera: a 40 mm diameter × 60 mm cylinder body with a 16 mm
lens ring (glass_clear), an IR LED ring of 6 dots around the lens (ONE mesh,
led_status), a 2 mm status LED, a 60 mm ball-joint bracket to a 50 mm square base
plate with two screw holes, a cable from the back. Origin at the base plate back face
centre with y = 0 at the plate's bottom edge (it screws to a tent pole or wall). Nodes:
camera_ip_fixed (root); cam_body; cam_lens_ring; cam_lens; cam_ir_ring; cam_status_led;
cam_ball; cam_base; cam_cable. Materials: plastic_white (body), plastic_dark (rings,
ball, base), glass_clear, led_status, cable_black. Anchors: mount, aim (lens centre,
+Z sight line), cable_out.
```

---

# D · Air that the scene draws procedurally today — hardware to keep honest

The live scene draws ducts as tubes along the anchor-to-anchor path (a route, not a
product). Two pieces make the route physical where it matters:

## 14. `duct-4in-flex` and `duct-6in-flex` as *deformable* builders

Instead of straight-1m + elbow pieces, one builder that takes a polyline in its
`variant` argument and extrudes a ribbed tube along it (TubeGeometry over a
CatmullRom curve, rib rings every 80 mm as slight radius modulation). The app will
call the harness with the real anchor-to-anchor polylines once they are known
(`docs/design/models/paths.json`, written by the app from the scene). Budget ≤ 900
per metre. Nodes `duct_flex (root); duct_tube`. Anchors `duct_in`, `duct_out`.

## 15. `port-collar-tent-4in` — the ring where a duct meets a tent port

Pack 2's `duct-fittings--collar-4in` is a rigid collar; the tent side needs the
drawstring sleeve pulled tight around a duct: a 102 mm tube 120 mm long with a
gathered ruffle ring (torus, shell_black) and a 6 mm drawcord loop (cable_black).
Origin at the tent-wall face centre, +Z outward. Anchors `duct_in`, `duct_out`.
Budget ≤ 300.

---

# E · Post-harvest and propagation extras the roster will reach

## 16. `plant-cutting-in-cube` — one rooted clone in a 25 mm rockwool cube

For the clone dome tray and the roster's cloning stage: a 25 mm cube (plastic_white),
a 60 mm stem with two small fans, `roots` as 6 thin white strands under the cube
(shown when the roster logs "rooted"). Nodes `plant_cutting (root); cube; stem;
leaves; roots`. Anchors `canopy_top`, `cube_base`. Budget ≤ 250.

## 17. `harvest-bin-40l` — the trimming tote

A 600 × 400 × 320 mm black tote with a lid (child, hinge) and a bud mass inside
(`trim_green`, hidden until a harvest is logged). Nodes `harvest_bin (root); bin_body;
bin_lid (child); bin_contents`. Anchors `lid_hinge`, `contents_top`. Budget ≤ 400.

---

# F · Cinematic helpers (app-side, listed so nobody models them)

These are **not** models — they are effect primitives the app draws over the wire
scene, recorded here so the library and the code agree on names:

| Effect | Drawn from | Bound to |
|---|---|---|
| Air streaks (`AirflowLayer`) | anchor-to-anchor path per fan | duty → count, learned CFM → speed, role → colour |
| Duct tube (`DuctTube`) | the duct legs of a path | fan live → opacity |
| Thermal volume (`ThermalVolume`) | tent bounds | temp vs want band → blue / amber / red, gradient direction |
| Humidity haze (`HumidityVolume`) | tent bounds | RH → density, band → tone, dew-point margin < 2 °C → red |
| Mist (`RisingParticles`) | `mist_out` anchor | humidifier / mister on |
| Heat shimmer (`RisingParticles`) | `outlet_face` / mat centre | heater / mat on |
| Light cone + footprint (`LightCone`) | lamp emitter → canopy plane | lamp on, brightness |
| Fan spin | `*_blades` nodes | duty → period `2.2 s − duty × 1.9 s` |
| Emissive glow | `lamp_emitter`, `heat_element`, `*_led`, `*_screen` | device state |
| Footprint ring | vessel diameter | roster vessel |
| Error pulse | whole instance edges | zone / device critical |

---

# G · What the operator measures (needed before § 12)

Fill this in and the room brief can be authored to the real room:

| Item | Measure | Notes |
|---|---|---|
| Room inside width × depth × height | ___ × ___ × ___ m | to the nearest cm |
| Door: which wall, offset from the corner, width × height, hinge side, swings in/out | | |
| Window(s): wall, offset, sill height, width × height | | |
| Exhaust-to-outside port: wall, centre height, offset, diameter | | today drawn on the back wall at 2.0 m |
| GPOs: wall, height, offset, gang count | | one row per outlet |
| Where the 4×8 stands: distance from back wall and from left wall, door side | | today 0.2 m from the back wall, centred |
| Where the 2×4 stands | | today front-left |
| Dehumidifier, AC, tank, Pi/brain shelf, router: floor positions | | |
| Hub and panel: wall, height | | |
| Camera positions per tent (which pole, height, facing) | | settings plan: one per tent |
| Ceiling light: type, position | | |
| Duct runs: each fan → where the duct actually goes (photos help) | | drives § 14 polylines |

---

# H · Manifest and app deltas this pack needs

- `kind` gains `"plant"` and `"vessel"` (builder `kindOf`: slugs starting `plant-` →
  plant, `vessel` → vessel). The app's `TwinModel.kind` union widens accordingly.
- `plant-stage--*` rows carry `origin: "soil"` (origin at the soil surface, not the
  floor) so the compositor snaps the root to a vessel's `plant_base`.
- `vessel--*` slugs are the catalogue ids; `PlantInstances` maps `plant.vessel.id` →
  slug and stops scaling the 3-gal pot.
- The hand-authored 2×4 row is replaced by the built one (same slug, anchors present);
  `wire.ts` keeps the prefix-bbox fallback for any future hand model.
- New anchor roles for `ANCHOR_ROLE` in the build harness: `plant_base` → pot,
  `canopy_centre` → canopy, `stake_*` → mount, `aim` → aim, `emitter_*` → emitter,
  `label_tab` → label, `dongle_tip` → antenna, `tray_upper|mat_spot|humidifier_spot|
  mister_spot` → spot, `power_*` → plug, `camera_*` → camera.

## Authoring order (each unlocks a view)

1. § 1 `plant-stage` + § 2 `vessel` — the roster drawn true to vessel and stage.
2. § 4 the built 2×4 — the clone tent's lamp, mat and probes snap instead of guess.
3. § 5–9 — Kit desk drawn in place, leaf VPD gets its sensor.
4. § G measured → § 12 the real room, § 13 cameras.
5. § 14–15 physical ducts along the real runs.
6. § 16–17 propagation and harvest.
