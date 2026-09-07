# 3D twin — model briefs for Claude 3D designer (three-d-stage)

These are paste-ready prompts for authoring the twin's objects. Every model lands in
`frontend/public/models/<slug>.glb`, gets a row in `frontend/public/models/manifest.json`,
and is drawn by `TwinViewport` in the holographic wire look (materials → tokens, edge
lines, translucent fill). The scene is a **view of live Zone state**: every coloured or
moving part is bound by **node name** to an entity; unbound parts render static grey.

The first model (`grow-tent-120x60x210`, the 2×4) already follows these rules — copy it.

---

## 0. Shared header — paste this before every object prompt

```
You are authoring one object for a live digital-twin scene of a cannabis grow room
(DSC-HUB). Output a single GLB (glTF 2.0, no Draco, no textures, no lights, no camera).

Conventions (must follow exactly):
- Units metres. Y is up. Origin at the object's floor-contact centre (x/z centred,
  y = 0 at the bottom). Real-world dimensions as stated; do not scale to fit.
- One mesh per named node. Node names are snake_case, `<part>_<role>[_n]`, exactly as
  listed in the prompt — the app binds live data to these names. Any part that will move
  (fan blades, a door flap, a float) must be its OWN child node whose pivot is at its axis
  of rotation, so the app can rotate it alone.
- Materials by NAME only (no textures, no vertex colours). Use only names from this list;
  the app recolours them from design tokens at runtime:
    shell_black, foil_lining, trim_green, roller_silver, window_acrylic, frame_steel,
    tray_pvc, plastic_white, plastic_dark, duct_foil, fan_blade, lamp_emitter,
    heat_element, led_status, water, soil, leaf_green, pot_fabric, cable_black, screen_glass
  Emissive-capable parts (lamp_emitter, heat_element, led_status, screen_glass) must be
  their own meshes so they can glow independently.
- Low poly, clean: aim for the triangle budget in the prompt; no interior detail that is
  never visible; no duplicated coplanar faces; consistent outward normals; no n-gons.
  Prefer few, larger meshes — every mesh is a draw call on a phone.
- Anchors: where the prompt lists anchors, create a tiny (1 cm) hidden cube mesh named
  exactly `<anchor>` at the attachment point, material plastic_dark, so the app can snap
  other models (ducts, cables, probes) to it.
- Silhouette over surface detail: the app draws edges at 25°, so give parts crisp
  creases where a human would recognise the device; keep curved surfaces at 16–24
  segments.
- Export: GLB, +Y up, metres, all transforms applied, node hierarchy preserved
  (parent = the object root named after the slug). Also keep the OBJ+MTL source.
```

---

## 1. `grow-tent-240x120x210` — the 4×8 tent (Overview room panel, Climate 4×8 panel)

**Size** 2.40 × 1.20 × 2.10 m (w × d × h). **Budget** ≤ 12 k triangles, ≤ 60 meshes.

**Binds to:** 4×8 climate triad (panel tint by zone tone), lamp (`lamp_main` anchor → SF1000 / Twin), intake + exhaust fans on the ports, canopy Zigbee puck, four probe stakes on the tray.

```
Object: a 240 × 120 × 210 cm grow tent, the larger sibling of grow-tent-120x60x210 —
same construction language, same node naming, so the app can reuse bindings.
Geometry: black canvas shell over a steel pole frame; twin front doors (two zip panels,
each 60 cm wide) meeting at centre; one 30 × 40 cm observation window on the front
left door; a removable floor tray with 8 cm lip; corner poles 22 mm; three pole tiers
(base, mid at 105 cm, top). Ports: two 6" (152 mm) round duct ports on the roof rear
(left + right), one 6" port low on the right side, one 4" (102 mm) port low on the left
side, two 4" cable ports at the bottom of the back panel. Two roof hanger bars along
the width at 15 cm and 105 cm from the back, at the top tier — the lamp hangs from them.
Nodes (exact): grow_tent_240x120x210 (root); panel_top, panel_bottom, panel_side_left,
panel_side_right, panel_back, panel_upper_front; door_main_left, door_main_right;
zip_door_left, zip_door_right, zip_door_split; observation_window_1_pane,
observation_window_1_frame; lining_* (foil inner faces: lining_top, lining_left,
lining_right, lining_back); pole_corner_1..4; rail_top_front/back/left/right,
rail_mid_*, rail_base_*; hanger_bar_front, hanger_bar_back; floor_tray, tray_lip_*;
vent_port_roof_left_sleeve/ring/iris, vent_port_roof_right_sleeve/ring/iris,
vent_port_side_right_lower_*, vent_port_side_left_lower_*, cable_port_1_*, cable_port_2_*.
Materials: shell_black (panels, doors), foil_lining (lining_*), trim_green (zips, port
rings, window frame), frame_steel (poles, rails, hanger bars), window_acrylic (pane),
tray_pvc (tray).
Anchors (1 cm hidden cubes): lamp_main (centre of the hanger bars, 205 cm), lamp_twin
(same bar, 60 cm right of centre), fan_exhaust (centre of vent_port_roof_left),
fan_exhaust_2 (roof right), fan_intake (side right lower), duct_passive (side left
lower), canopy_sensor (hanging 30 cm below the lamp centre), probe_1..probe_4 (on the
tray at 2 × 2 grid, 60 cm spacing), cable_1, cable_2.
```

## 2. `lamp-sf1000` — Spider Farmer SF1000 LED (2×4 today; Twin on the 4×8)

**Size** 0.27 × 0.27 × 0.06 m board + 0.10 m hanger loop. **Budget** ≤ 2 k triangles.

**Binds to:** `light.dsc_hub_sf1000_dimmer` (on/brightness → `lamp_emitter` emissive), Twin on `light.dsc_hub_twin_sf1000`.

```
Object: a quantum-board LED grow light, 270 × 270 mm, 60 mm deep: a finned aluminium
heatsink slab on top (6 fins, 30 mm tall), a flat white LED board underneath with a
visible 12 × 12 dot grid suggested by a single inset panel (do NOT model 144 diodes), a
small driver box (120 × 60 × 35 mm) on top of the heatsink, a dimmer knob on the driver,
and a wire hanger (two 1.5 mm cables from the corners meeting in a hook 100 mm above).
Origin: hook tip at the top so it hangs from the tent's lamp anchor — put y = 0 at the
HOOK and let the board extend down to −0.16 m (exception to the floor-origin rule,
stated deliberately).
Nodes: lamp_sf1000 (root); lamp_heatsink; lamp_board; lamp_emitter (the flat light face,
1 mm below the board, its own mesh); lamp_driver; lamp_dimmer_knob; lamp_hanger;
lamp_status_led (a 4 mm dot on the driver).
Materials: frame_steel (heatsink), plastic_white (board, driver), lamp_emitter
(emitter face), plastic_dark (knob), cable_black (hanger), led_status (status dot).
Anchors: hang_point (at the hook), cable_out (rear of driver).
```

## 3. `fan-inline-4in` — 4" inline duct fan (intake + exhaust, both tents and room)

**Size** Ø 0.14 × 0.22 m body with 102 mm collars. **Budget** ≤ 1.5 k triangles.

**Binds to:** `sensor.dsc_fan_*_pct` (duty → `fan_blades` spin at `2.2 s − duty × 1.9 s`, stopped at 0 %/offline), CFM (particle rate on the attached duct).

```
Object: a 4-inch inline mixed-flow duct fan: a cylindrical body 140 mm diameter × 160 mm
long with a 102 mm round collar on each end (each 30 mm long), a small speed-controller
box (60 × 40 × 25 mm) on top with a knob, and a power lead stub. The impeller is visible
through the intake collar: a 5-blade backward-curved impeller on a 20 mm hub — model the
blades as 5 simple swept quads (no thickness needed), ONE child node, pivot at the fan
axis centre, axis along the body length (+Z is airflow direction).
Origin: at the body centre on the axis, y = 0 at the bottom of the body (it hangs or
clamps; the app positions it by anchor).
Nodes: fan_inline_4in (root); fan_body; fan_collar_in; fan_collar_out; fan_blades (child
of fan_body, pivot at axis); fan_hub; fan_controller; fan_controller_knob; fan_lead.
Materials: plastic_dark (body, collars), fan_blade (blades), roller_silver (hub),
plastic_white (controller), cable_black (lead).
Anchors: duct_in (centre of the intake collar face), duct_out (centre of the outlet
face), mount (top of body).
```

Also author **`fan-inline-6in`** with the same prompt at 152 mm collars / 190 mm body (the 4×8 exhaust).

## 4. `duct-4in-straight-1m` and `duct-4in-elbow-90` — foil ducting

**Budget** ≤ 600 triangles each. Airflow particles run along their centreline; CFM sets speed.

```
Object A: 1.0 m of 102 mm flexible aluminium duct, straight, with 12 soft ribs
(a ring every ~80 mm, ±3 mm radius). Object B: a 90° elbow of the same duct, bend
radius 150 mm, 6 ribs. Origin: at the inlet face centre, axis +Z (elbow turns toward +X).
Nodes: duct_4in_straight (root) → duct_tube; duct_4in_elbow (root) → duct_tube.
Materials: duct_foil. Anchors: duct_in (inlet face centre), duct_out (outlet face
centre, oriented along the outlet axis). Same two objects at 152 mm for 6".
```

## 5. `carbon-filter-4in` — activated-carbon canister

**Size** Ø 0.20 × 0.40 m with 102 mm flange. **Budget** ≤ 800 triangles. Static; bound only for OOS (dashed).

```
Object: a cylindrical carbon filter 200 mm diameter, 400 mm long, perforated steel
outer mesh suggested by a single cylinder with a slightly lighter material (do NOT
model holes), a white pre-filter sleeve band 20 mm at each end, a 102 mm flange
collar on one end (40 mm), a solid end cap on the other, two hanging eyelets on top.
Origin: at the flange face centre, axis +Z (air enters the body radially, exits the
flange). Nodes: carbon_filter_4in (root); filter_body; filter_sleeve_1; filter_sleeve_2;
filter_flange; filter_end_cap; filter_eyelet_1; filter_eyelet_2.
Materials: frame_steel (body, cap), plastic_white (sleeves), plastic_dark (flange),
roller_silver (eyelets). Anchors: duct_out (flange face centre), hang_1, hang_2.
```

## 6. `heat-mat-25x50` — seedling heat mat (clone tent floor)

**Size** 0.25 × 0.50 × 0.005 m. **Budget** ≤ 300 triangles.

**Binds to:** `switch.dsc_hub_grow_mat_demand` (on → `heat_element` emissive + the app's heat-shimmer sprite above it), mat/root °C.

```
Object: a flat rectangular heat mat 250 × 500 mm, 5 mm thick, with 12 mm rounded
corners, a subtle 15 mm border, and a 300 mm power lead exiting the middle of one short
edge with a small inline thermostat puck (35 mm) on the lead. The active area (inside
the border) is its own thin mesh 1 mm above the base so it can glow.
Origin: floor centre. Nodes: heat_mat_25x50 (root); mat_base; heat_element (active
area); mat_lead; mat_thermostat. Materials: plastic_dark (base, lead), heat_element
(active area), plastic_white (thermostat). Anchors: pot_1, pot_2 (centres of the two
halves, where pots sit), cable_out.
```

## 7. `probe-stake-soil` — DSC soil probe (the four "pots")

**Size** stake 0.20 m + ESP box 0.06 × 0.04 × 0.025 m. **Budget** ≤ 800 triangles.

**Binds to:** probe moisture/EC/temp (tone on `probe_status_led`), ESP-NOW link (led), OOS (dashed). One instance per `probe_n` anchor.

```
Object: a soil probe stake: two 200 mm stainless tines (5 mm diameter, 25 mm apart)
joined at the top by a 40 × 30 × 12 mm black collar; a 60 × 40 × 25 mm grey ESP
enclosure sits on top of the collar with a 3 mm status LED on its lid and a short
antenna stub (30 mm) on one end. Stake tip at y = 0 (it stands in the pot); the
enclosure lid at the top. Nodes: probe_stake_soil (root); probe_tine_1; probe_tine_2;
probe_collar; probe_box; probe_status_led; probe_antenna. Materials: frame_steel
(tines), plastic_dark (collar), plastic_white (box), led_status (LED), cable_black
(antenna). Anchors: soil_line (at 120 mm up the tines, where the substrate surface sits).
```

## 8. `pot-fabric-3gal-plant-<stage>` — pot + canopy placeholders (four stages)

**Size** pot Ø 0.25 × 0.22 m; canopy per stage. **Budget** ≤ 2.5 k each. Author four: `seedling`, `veg`, `flower`, `empty`.

**Binds to:** roster (stage → which variant is shown at each probe anchor), plant name on hover, VPD-in-band tone on `leaf_green`.

```
Object: a 3-gallon fabric pot (250 mm diameter, 220 mm tall, slightly tapered, two
small handles) filled with substrate to 20 mm below the rim (a flat soil disc), and a
stylised plant above it. Keep the plant abstract and low-poly — the scene is a wire
twin, not a render: (seedling) a 60 mm stem with two 40 mm cotyledon quads;
(veg) a 350 mm tall bush of 7 five-finger leaf fans (each fan = 5 thin quads) on a
central stem with 2 side branches; (flower) the veg bush plus 6 elongated bud
ellipsoids (40 × 90 mm) along the top of stem and branches; (empty) pot + soil only.
Origin: floor centre under the pot. Nodes: pot_plant_<stage> (root); pot_body;
pot_handles; soil_surface; plant_stem; plant_leaves (single merged mesh); plant_buds
(flower only). Materials: pot_fabric (pot), soil (soil), leaf_green (stem, leaves),
trim_green (buds — a distinct role so the app can tint by phase).
Anchors: probe_socket (on the soil surface, 60 mm from centre toward −Z), canopy_top
(top of the plant, where a canopy sensor reads).
```

## 9. `dehumidifier-compact-12l` — room dehumidifier

**Size** 0.30 × 0.20 × 0.48 m. **Budget** ≤ 1.5 k.

**Binds to:** `switch.dsc_hub_dehumidifier_demand` (on → `fan_blades` slow spin behind the grille + `led_status`), relay offline → dashed.

```
Object: a compact 12 L/day compressor dehumidifier: white upright box 300 × 200 × 480 mm
with rounded vertical edges (R 15 mm), a top-mounted air outlet grille (a recessed
rectangle 220 × 120 mm with 8 louvre slats), a front lower intake grille (rectangle with
horizontal ribs), a removable clear water tank occupying the bottom 160 mm of the front
(its own mesh, water level plane inside at 40 %), a small control panel with 3 buttons
and a status LED on the top rear, a carry handle recess on each side, a drain hose
stub at the back. Behind the top grille, a 6-blade axial fan disc (own child node,
pivot on its axis, axis vertical).
Origin: floor centre. Nodes: dehumidifier_compact (root); dehum_body; dehum_top_grille;
dehum_front_grille; dehum_tank; dehum_tank_water; dehum_panel; dehum_status_led;
dehum_fan_blades (child); dehum_drain. Materials: plastic_white (body, panel),
plastic_dark (grilles, drain), window_acrylic (tank), water (water plane), led_status,
fan_blade. Anchors: intake_face (front grille centre), outlet_face (top grille centre),
cable_out.
```

## 10. `humidifier-ultrasonic-4l` — tent humidifier (main + clone)

**Size** 0.18 × 0.18 × 0.32 m. **Budget** ≤ 1.2 k.

**Binds to:** `switch.dsc_hub_humidifier_demand` / `..._clone_humidifier_demand` (on → `mist_plume` visible + led), capacity offline → dashed.

```
Object: an ultrasonic humidifier: a squat dark base 180 × 180 × 70 mm with a dial and a
status LED, a translucent 4 L tank above it (a rounded box 170 × 170 × 220 mm, 30 % water
level plane inside), and a 25 mm rotating mist nozzle on top. Add a separate soft
"plume" mesh: a tapered translucent cone 60 mm base → 20 mm top, 150 mm tall, rising
from the nozzle — it is hidden by the app unless the unit is on.
Origin: floor centre. Nodes: humidifier_ultrasonic (root); hum_base; hum_dial;
hum_status_led; hum_tank; hum_tank_water; hum_nozzle; mist_plume. Materials:
plastic_dark (base, dial), led_status, window_acrylic (tank, plume), water (water
plane), plastic_white (nozzle). Anchors: mist_out (nozzle top), cable_out.
```

Also **`mister-clone`**: the same base (no tank) with a 6 mm tube rising 400 mm to a
3-head spray bar 200 mm wide; nodes `mister_base`, `mister_tube`, `mister_bar`,
`mist_plume_1..3`, `mister_status_led`; binds to the clone mister in-service flag.

## 11. `heater-fan-2kw` — space heater (main tent / room)

**Size** 0.26 × 0.14 × 0.36 m. **Budget** ≤ 1.2 k.

**Binds to:** `switch.dsc_hub_heater_demand` (on → `heat_element` emissive + `fan_blades` spin + the app's heat lines).

```
Object: an upright fan heater: dark rounded box 260 × 140 × 360 mm with a front
output grille (a 200 × 200 mm recessed square of 10 vertical slats), an orange/red
heating element visible as a flat glowing rectangle 20 mm behind the grille (its own
mesh), a 5-blade fan disc behind the element (own child, pivot on the horizontal axis
through the grille centre), two rotary dials on top, a tip-over foot plate 280 × 180 mm,
and a lead at the back. Origin: floor centre.
Nodes: heater_fan (root); heater_body; heater_grille; heat_element; heater_fan_blades
(child); heater_dial_1; heater_dial_2; heater_foot; heater_lead. Materials: plastic_dark
(body, grille, dials, foot), heat_element, fan_blade, cable_black. Anchors: outlet_face
(grille centre, +Z is outflow), cable_out.
```

## 12. `ac-portable-9000btu` — portable air conditioner ("Cool")

**Size** 0.44 × 0.38 × 0.72 m + 0.15 m exhaust hose stub. **Budget** ≤ 2 k.

**Binds to:** `switch.dsc_hub_ac_demand` (on → `fan_blades` + led), capacity offline → dashed (this is the unit that is OOS today).

```
Object: a portable AC unit: white/grey upright box 440 × 380 × 720 mm on four castors,
a front-top louvred outlet (300 × 100 mm, 6 horizontal vanes, the vane group its own
mesh), a rear intake grille (large recessed rectangle with vertical ribs), a top control
panel with a small display (own mesh, screen_glass) and 4 buttons, a 150 mm diameter
exhaust hose stub (200 mm long, 5 ribs) exiting high on the back, a drain plug low on
the back. A 6-blade fan disc behind the outlet (child node, horizontal axis).
Origin: floor centre. Nodes: ac_portable (root); ac_body; ac_castor_1..4; ac_outlet_vanes;
ac_rear_grille; ac_panel; ac_display; ac_status_led; ac_fan_blades (child);
ac_hose_stub; ac_drain. Materials: plastic_white (body, panel), plastic_dark (grilles,
castors, vanes, drain), screen_glass (display), led_status, fan_blade, duct_foil (hose).
Anchors: duct_out (hose stub end), outlet_face, cable_out.
```

## 13. `hub-esp32-cyd` — the DSC hub controller with its display

**Size** 0.12 × 0.09 × 0.03 m. **Budget** ≤ 700.

**Binds to:** hub online/heartbeat (`hub_status_led` breathe), CYD screen (`screen_glass` emissive when online), link state.

```
Object: a wall-mounted controller: a dark 120 × 90 × 30 mm enclosure with a 2.8"
(70 × 52 mm) display window on the front (screen its own mesh, screen_glass), a 3 mm
status LED beside it, a row of four 5 mm indicator LEDs along the bottom edge
(own meshes), an external 2.4 GHz antenna (80 mm stub with a 15 mm knuckle) on the
top right, two cable glands on the bottom edge, two mounting ears at the back. Origin:
at the back face centre (it mounts on a wall/pole; the app positions by anchor) with
y = 0 at the bottom edge. Nodes: hub_esp32_cyd (root); hub_enclosure; hub_screen;
hub_status_led; hub_link_led_1..4; hub_antenna; hub_gland_1; hub_gland_2; hub_ears.
Materials: plastic_dark (enclosure, glands, ears), screen_glass (screen), led_status
(all LEDs), cable_black (antenna). Anchors: mount (back face centre), cable_1, cable_2.
```

## 14. `plug-sonoff-s31` — smart plug (the Sonoff seats)

**Size** 0.06 × 0.04 × 0.08 m. **Budget** ≤ 400. Instance per seat; binds to relay state (led) and power (label on hover).

```
Object: a white smart plug: a rounded box 60 × 40 × 80 mm with an AU three-pin socket
face on the front (three flat slots as recessed quads), a small power button and a
3 mm LED on the top face, three flat pins protruding 15 mm from the back. Origin: at
the back face centre (pins) with y = 0 at the bottom. Nodes: plug_sonoff (root);
plug_body; plug_socket_face; plug_button; plug_status_led; plug_pins. Materials:
plastic_white (body), plastic_dark (socket slots, pins), led_status. Anchors: mount
(back), cable_out (front centre).
```

## 15. `sensor-zigbee-puck` and `sensor-leak-zigbee` — the Zigbee sensors

**Budget** ≤ 300 each. Puck binds to canopy T/RH (tone on `led_status`, hover values); leak sensor binds to leak state (bad glow).

```
Object A: a canopy temperature/humidity puck: a white disc 45 mm diameter × 14 mm
with a 6 mm vent ring groove around the side and a 2 mm LED pinhole on top, hanging
from a 1 mm cable that rises 120 mm to a loop. Origin at the loop (it hangs from a
canopy_sensor anchor; y = 0 at the loop, disc below). Nodes: sensor_zigbee_puck (root);
puck_body; puck_led; puck_cable. Materials: plastic_white, led_status, cable_black.
Object B: a leak sensor: a white puck 50 × 50 × 18 mm with two 6 mm gold contact pins
on the underside and a LED on top; origin floor centre. Nodes: sensor_leak_zigbee
(root); leak_body; leak_led; leak_pins. Materials: plastic_white, led_status,
roller_silver.
```

## 16. `reservoir-tank-60l` + `pump-submersible` — the tank (Root desk, future shots)

**Budget** ≤ 1.2 k + 400. Tank binds to level/EC/pH (water plane height, tone); pump binds to the future `plug_pump` role (impeller spin while a shot runs).

```
Object A: a 60 L black HDPE reservoir 500 × 400 × 350 mm with a 20 mm lip, a hinged
lid (own mesh), a bulkhead outlet low on one short side, and a water plane inside (own
mesh, at 70 % height). Origin floor centre. Nodes: reservoir_tank_60l (root); tank_body;
tank_lid; tank_outlet; tank_water; tank_probe_ph (a 15 mm rod hanging from the lid);
tank_probe_ec (same, 60 mm apart). Materials: plastic_dark (body, lid, outlet), water,
plastic_white (probes). Anchors: hose_out (outlet), pump_socket (inside bottom centre).
Object B: a submersible pump: a 90 × 70 × 80 mm black box with an intake grille on one
side, a 13 mm hose barb on top, an impeller disc inside visible through the grille (own
child, vertical axis), a suction-cup foot. Origin floor centre. Nodes: pump_submersible
(root); pump_body; pump_grille; pump_barb; pump_impeller (child); pump_feet.
Materials: plastic_dark, fan_blade (impeller), roller_silver (barb). Anchors: hose_out.
```

## 17. `grow-room-shell` — the room the tents stand in (Overview 3D | cards toggle)

**Size** authored to the real room; placeholder 3.6 × 2.4 × 2.4 m until measured. **Budget** ≤ 1.5 k.

**Binds to:** room T/RH (wall tint), exhaust-to-outside port (fan + duct particles), door.

```
Object: a plain rectangular room W × D × 2.4 m tall (use 3.6 × 2.4 until told the real
size) as five thin slabs (floor, ceiling, back, left, right) — NO front wall so the
camera can look in; a door opening 820 × 2040 mm on the right wall near the front with a
door leaf (own node, pivot on its hinge edge, closed); a 152 mm round exhaust port high
on the back wall; a single window opening 900 × 600 mm on the left wall with an acrylic
pane; a 2-gang power outlet plate low on the back wall. Origin floor centre.
Nodes: grow_room_shell (root); room_floor; room_ceiling; room_wall_back; room_wall_left;
room_wall_right; door_leaf (child, hinge pivot); door_frame; vent_port_wall_sleeve;
window_pane; window_frame; outlet_plate. Materials: shell_black (walls, ceiling — the
app draws them as faint wire), tray_pvc (floor), frame_steel (door frame, window frame),
plastic_white (door leaf, outlet plate), window_acrylic (pane), trim_green (port sleeve).
Anchors: tent_4x8 (floor, where the big tent stands — 0.2 m from the back wall,
centred), tent_2x4 (floor, front-left), fan_exhaust_room (wall port centre),
dehum_spot, ac_spot, tank_spot, hub_mount (back wall, 1.5 m up).
```

---

## Manifest rows to add (fill `bytes` after export)

```json
{ "slug": "grow-tent-240x120x210", "file": "/models/grow-tent-240x120x210.glb", "kind": "tent", "dims_cm": [240,120,210], "zone": "4x8",
  "anchors": { "vent_port_roof_left": "fan_exhaust", "vent_port_roof_right": "fan_exhaust", "vent_port_side_right_lower": "fan_intake", "vent_port_side_left_lower": "duct_passive", "cable_port_1": "cable", "cable_port_2": "cable", "floor_tray": "tray", "observation_window_1": "window", "door_main_left": "door", "door_main_right": "door", "lamp_main": "lamp", "lamp_twin": "lamp", "canopy_sensor": "probe", "probe_1": "probe", "probe_2": "probe", "probe_3": "probe", "probe_4": "probe" },
  "materials": { "shell_black": "shell", "foil_lining": "dim", "trim_green": "accent", "frame_steel": "frame", "window_acrylic": "glass", "tray_pvc": "frame" } }
```

Devices use `kind: "device"`, sensors `kind: "sensor"`, the room `kind: "room"`. New material
roles for the app (`TwinViewport.toWire`): `plastic_white` → dim, `plastic_dark` → shell,
`duct_foil` → frame, `fan_blade` → accent, `lamp_emitter` / `heat_element` / `led_status` /
`screen_glass` → **emissive** (bound), `water` → glass, `soil` → shell, `leaf_green` →
accent, `pot_fabric` → dim, `cable_black` → shell.

## Authoring order (each unlocks a view)

1. `grow-tent-240x120x210` — the Overview room panel can show both tents.
2. `lamp-sf1000` + `fan-inline-4in` + `duct-4in-*` — lamp emissive and fan spin, the two motions the plan names first.
3. `heat-mat-25x50` + `probe-stake-soil` + `pot-fabric-3gal-plant-*` — the Root desk twin.
4. `humidifier-ultrasonic-4l`, `dehumidifier-compact-12l`, `heater-fan-2kw`, `ac-portable-9000btu`, `mister-clone` — the Climate equipment tiles in place.
5. `hub-esp32-cyd`, `plug-sonoff-s31`, `sensor-zigbee-puck`, `sensor-leak-zigbee` — the Kit desk drawn in place.
6. `reservoir-tank-60l` + `pump-submersible`, `carbon-filter-4in`, `grow-room-shell` — the full room.
