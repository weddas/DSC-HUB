# 3D twin — model briefs, pack 2: the generic library

Pack 1 (`BRIEFS.md`) covers the rig as it stands today. This pack is the rest of a
**generic** library: every archetype a home or small commercial grow can contain, so the
twin can draw any zone the operator configures, not only ours. Same rules, same node
grammar, same wire look. Where a family has sizes, ONE prompt produces several GLBs.

Dimensions below are typical of the class, checked against current products where the
class has a de-facto standard (4×4 bar LEDs, Cloudline-style inline fans, 20 lb CO₂
cylinders, 12 000 BTU mini-split heads, 30 L dehumidifiers, 6" air-cooled hoods, T5 HO
fixtures). Where a class varies widely the brief says "typical" and picks the median.

---

## 0. Shared header (v2) — paste this before every prompt in this pack

```
You are authoring objects for a live digital-twin scene of a cannabis grow room
(DSC-HUB). Output GLB files (glTF 2.0, no Draco, no textures, no lights, no camera).

Conventions (must follow exactly):
- Units metres. Y is up. Origin at the object's floor-contact centre (x/z centred,
  y = 0 at the bottom) unless the prompt states another origin (hanging or wall-mounted
  objects put y = 0 at their hook or mounting face). Real-world dimensions as stated.
- One mesh per named node. Node names are snake_case, `<part>_<role>[_n]`, exactly as
  listed — the app binds live data to these names. Any part that will move (fan blades,
  impellers, a door flap, a float, louvre vanes) must be its OWN child node with its
  pivot at its axis of rotation, so the app can rotate it alone.
- Families: when a prompt lists sizes/variants, export one GLB per variant named
  `<slug>--<variant>` (e.g. `grow-tent--120x120x200.glb`) with the SAME node names in
  each; only dimensions change. The root node is named after the slug (no variant).
- Materials by NAME only (no textures, no vertex colours). Use only these names; the
  app recolours them from design tokens at runtime:
    shell_black, foil_lining, trim_green, roller_silver, window_acrylic, frame_steel,
    tray_pvc, plastic_white, plastic_dark, duct_foil, fan_blade, lamp_emitter,
    heat_element, led_status, water, soil, leaf_green, pot_fabric, cable_black,
    screen_glass, mesh_wire, glass_clear, metal_brass, rubber_black
  Emissive-capable parts (lamp_emitter, heat_element, led_status, screen_glass) must be
  their own meshes so they can glow independently. Anything the app tints by state
  (a status LED, a water plane, a mist plume, an emitter) is its own mesh.
- Low poly, clean: stay within the triangle budget; no interior detail that is never
  visible; no duplicated coplanar faces; outward normals; no n-gons; curved surfaces at
  16–24 segments. Prefer few, larger meshes — every mesh is a draw call on a phone.
- Anchors: for each listed anchor create a 1 cm cube mesh named exactly `<anchor>`,
  material plastic_dark, at the attachment point, exported hidden (visible=false) but
  kept in the node tree. Anchors named `duct_in` / `duct_out` sit at the centre of the
  opening with the node's +Z pointing along the airflow.
- Silhouette over surface detail: the app draws edges at 25°, so give parts crisp
  creases where a human would recognise the device.
- Export: GLB, +Y up, metres, all transforms applied, node hierarchy preserved
  (parent = root named after the slug). Keep the OBJ+MTL source alongside.
```

---

# A · Spaces

## 1. `grow-tent` — the tent family (six sizes)

**Sizes** `60x60x140`, `80x80x160`, `100x100x200`, `120x120x200`, `150x150x200`, `300x150x200` (w × d × h cm). **Budget** ≤ 8 k triangles, ≤ 45 meshes each. Pack 1 already has `120x60x210` and `240x120x210`.

**Binds to:** zone tone on the shell, lamp/fan/probe anchors, door and window state if a contact sensor is ever bound.

```
Object family: rectangular grow tents in six sizes — 60×60×140, 80×80×160, 100×100×200,
120×120×200, 150×150×200 and 300×150×200 cm (w × d × h). Same construction as
grow-tent-120x60x210: black canvas shell over 19 mm steel poles (three tiers: base, mid
at half height, top), reflective foil lining on the inner faces, one front door
(sizes ≤ 100 wide: single zip door full width; ≥ 120 wide: two doors meeting at
centre), one 30 × 40 cm observation window on the front door, a removable floor tray
with 8 cm lip, two roof hanger bars along the width at ¼ and ¾ depth. Ports scale with
size: ≤ 80 wide → one 4" (102 mm) roof port rear-centre, one 4" side port low left, one
cable port; 100–150 → two 6" (152 mm) roof ports rear left/right, one 6" side port low
right, one 4" side port low left, two cable ports; 300 → four 6" roof ports (two rear,
two front), two 6" side ports low right, two 4" side ports low left, two cable ports.
Nodes (exact, present in every size; omit ports a size does not have):
grow_tent (root); panel_top, panel_bottom, panel_side_left, panel_side_right,
panel_back, panel_upper_front; door_main (single) or door_main_left + door_main_right;
zip_door_1, zip_door_2; observation_window_1_pane, observation_window_1_frame;
lining_top, lining_left, lining_right, lining_back; pole_corner_1..4; rail_top_front,
rail_top_back, rail_top_left, rail_top_right, rail_mid_*, rail_base_*; hanger_bar_front,
hanger_bar_back; floor_tray, tray_lip_front/back/left/right;
vent_port_roof_1_sleeve/ring/iris .. vent_port_roof_4_*, vent_port_side_right_1_*,
vent_port_side_right_2_*, vent_port_side_left_1_*, vent_port_side_left_2_*,
cable_port_1_*, cable_port_2_*.
Materials: shell_black (panels, doors), foil_lining (lining_*), trim_green (zips, port
rings, window frame), frame_steel (poles, rails, hanger bars), window_acrylic (pane),
tray_pvc (tray).
Anchors: lamp_main (centre between the hanger bars at top height − 5 cm), lamp_2 (only
≥ 150 wide: 60 cm right of lamp_main; 300 wide: lamp_2 at x = +75 cm and lamp_3 at
x = −75 cm with lamp_main removed), fan_exhaust (roof port 1), fan_exhaust_2 (roof
port 2 where present), fan_intake (side right 1), duct_passive (side left 1),
canopy_sensor (30 cm below lamp_main), probe_1..probe_n on the tray in a grid with
≥ 45 cm spacing (60: 1; 80: 2; 100: 4; 120: 4; 150: 6; 300: 12), cable_1, cable_2.
Export six GLBs: grow-tent--60x60x140.glb … grow-tent--300x150x200.glb.
```

## 2. `rack-wire-4tier` — shelf rack for clones, drying and gear

**Size** 0.90 × 0.45 × 1.80 m. **Budget** ≤ 1.5 k. Static; shelves are anchors for trays, jars and lamps.

```
Object: a chrome wire shelving rack 900 × 450 × 1800 mm: four 25 mm tube posts on
levelling feet, four wire shelves at 150, 650, 1150 and 1650 mm — each shelf a thin
slab 900 × 450 × 30 mm whose top face uses mesh_wire (the app draws the wire look; do
NOT model individual wires) with a 30 mm solid rim. Origin floor centre.
Nodes: rack_wire_4tier (root); rack_post_1..4; rack_foot_1..4; rack_shelf_1..4
(rim + mesh as one mesh each). Materials: roller_silver (posts, rims, feet), mesh_wire
(shelf tops). Anchors: shelf_1..shelf_4 (top-face centre of each shelf), lamp_under_2,
lamp_under_3, lamp_under_4 (underside centre of shelves 2–4, where a T5 or clip lamp
hangs for the shelf below).
```

## 3. `clone-dome-tray` — propagation tray with humidity dome

**Size** 0.54 × 0.28 × 0.18 m (1020 tray + 7" dome). **Budget** ≤ 1.2 k.

**Binds to:** clone-tent humidity (dome `window_acrylic` tint), heat mat below (anchor), roster count (how many cube slots show a sprout).

```
Object: a standard 1020 propagation tray 540 × 280 × 60 mm (black, 10 mm rim, slight
draft) holding a 50-cell insert (5 × 10 grid of 45 mm square cells, modelled as one
mesh with cell tops only — no interior), a clear 7" (180 mm tall) humidity dome with a
20 mm lip and two 40 mm adjustable vents on top (each vent a small disc, its own
mesh), and 10 stylised sprouts (one mesh: 10 pairs of 25 mm cotyledon quads on 20 mm
stems) in the first two rows so the app can show or hide them.
Origin floor centre. Nodes: clone_dome_tray (root); tray_base; cell_insert; dome_shell;
dome_vent_1; dome_vent_2; sprouts. Materials: plastic_dark (tray, insert), window_acrylic
(dome), plastic_white (vents), leaf_green (sprouts). Anchors: mat_under (tray underside
centre), lamp_over (300 mm above the dome centre), sensor_in (inside the dome, rear).
```

# B · Lighting

## 4. `lamp-bar-led` — bar-style LED fixtures (6-bar 4×4, 8-bar 4×8)

**Sizes** `6bar` 0.84 × 0.84 × 0.08 m (the 4×4 class; SE5000/FC-E4800 are 84–85 cm square, 8 cm tall); `8bar` 0.84 × 1.68 × 0.08 m (two 4×4 spans end to end). **Budget** ≤ 2.5 k each.

**Binds to:** lamp on/brightness → `lamp_emitter_n` emissive; driver `led_status`.

```
Object family: bar-style LED grow lights. 6bar: six 840 mm bars, each 40 mm wide × 30 mm
deep, on 168 mm centres, joined by two 840 mm cross spines (60 × 30 mm) at ¼ and ¾;
a 300 × 110 × 55 mm driver box centred on top of the spines with a dimmer knob and a
4 mm status LED; four 1.5 mm hanging cables from the spine ends to a single hook 250 mm
above the bars. 8bar: eight bars 1680 mm long on 120 mm centres with three cross
spines; two driver boxes. The light-emitting face of each bar (a 30 mm strip on its
underside, 1 mm proud) is its own mesh so it can glow.
Origin: at the hook (y = 0), bars below (deliberate exception). Nodes: lamp_bar_led
(root); lamp_bar_1..6 (or ..8); lamp_emitter_1..6 (or ..8); lamp_spine_1..2 (or ..3);
lamp_driver (or lamp_driver_1..2); lamp_dimmer_knob; lamp_status_led; lamp_hanger.
Materials: frame_steel (bars, spines), lamp_emitter (emitter strips), plastic_white
(driver), plastic_dark (knob), led_status, cable_black (hanger). Anchors: hang_point
(hook), cable_out (driver rear). Export lamp-bar-led--6bar.glb and lamp-bar-led--8bar.glb.
```

## 5. `lamp-hood-hps-600` — air-cooled HID hood with remote ballast

**Size** hood 0.58 × 0.43 × 0.23 m with 6" collars; ballast 0.30 × 0.12 × 0.08 m. **Budget** ≤ 2.5 k.

**Binds to:** lamp on → `lamp_emitter` (the bulb) emissive + the app's heat lines; fan on the collars.

```
Object: a 6" air-cooled reflector hood 580 × 430 × 230 mm: a white-painted aluminium
box with a hinged tempered-glass underside (glass its own mesh, window_acrylic), a
152 mm round duct collar on each short end (60 mm long), an internal parabolic
reflector suggested by four angled inner faces, and a horizontal HID bulb inside
(a 40 mm diameter × 260 mm capsule with a 20 mm base — its own mesh, lamp_emitter).
Two hanging eyelets on top. A separate remote ballast: a 300 × 120 × 80 mm dark box
with cooling ribs on top, a status LED, a power inlet and a lamp cord stub — export it
as a second GLB named lamp-hood-hps-600--ballast.glb with its own floor origin.
Hood origin: at the eyelet hook height (y = 0), hood below (hanging exception).
Nodes (hood): lamp_hood_hps (root); hood_body; hood_glass; hood_reflector;
hood_collar_in; hood_collar_out; lamp_emitter; lamp_base; hood_eyelet_1; hood_eyelet_2.
Nodes (ballast): lamp_ballast (root); ballast_body; ballast_ribs; ballast_status_led;
ballast_inlet; ballast_cord. Materials: plastic_white (hood), window_acrylic (glass),
roller_silver (reflector), plastic_dark (collars, ballast), lamp_emitter, led_status,
cable_black. Anchors (hood): hang_1, hang_2, duct_in (collar), duct_out (collar).
Anchors (ballast): cable_out, mount.
```

## 6. `lamp-t5-ho` — T5 HO fluorescent fixtures (2 ft 4-tube, 4 ft 4-tube)

**Sizes** `2ft4` 0.59 × 0.25 × 0.08 m; `4ft4` 1.20 × 0.25 × 0.08 m (a 2 ft 4-lamp fixture is 23¼ × 9¾ × 3 in). **Budget** ≤ 1.2 k each.

**Binds to:** on/off → each tube `lamp_emitter_n`; used under rack shelves and over clone trays.

```
Object family: T5 HO fluorescent fixtures. A white sheet-steel housing with a
parabolic reflector face, four 16 mm diameter tubes on 55 mm centres (each tube its own
mesh, lamp_emitter, with 10 mm grey end caps as part of the housing), a 2-position
switch and a cord at one end, two hanging V-hooks on top. 2ft4: 590 × 250 × 80 mm;
4ft4: 1200 × 250 × 80 mm. Origin at the hooks (y = 0), fixture below.
Nodes: lamp_t5_ho (root); t5_housing; t5_reflector; lamp_emitter_1..4; t5_switch;
t5_cord; t5_hook_1; t5_hook_2. Materials: plastic_white (housing), roller_silver
(reflector), lamp_emitter (tubes), plastic_dark (switch, caps), cable_black. Anchors:
hang_1, hang_2, cable_out. Export lamp-t5-ho--2ft4.glb and lamp-t5-ho--4ft4.glb.
```

## 7. `lamp-clip-led` — gooseneck clip light for clones and mothers

**Size** head Ø 0.11 × 0.05 m, gooseneck 0.35 m, clip 0.08 m. **Budget** ≤ 800.

```
Object: a clip-on LED grow light: a spring clamp (two 80 × 40 mm jaws with a 20 mm
knuckle), a 12 mm flexible gooseneck 350 mm long rising and curving 90° forward (model
as a smooth tube with 6 bends), and a 110 mm diameter × 50 mm round head whose face is
a lamp_emitter disc with a 5 mm rim. Origin at the clamp's jaw centre (it clips to a
rack post or tent pole; y = 0 at the clamp bottom). Nodes: lamp_clip_led (root);
clip_jaw_top; clip_jaw_bottom; clip_knuckle; gooseneck; lamp_head; lamp_emitter;
lamp_cord. Materials: plastic_dark (clamp, head), roller_silver (gooseneck),
lamp_emitter, cable_black. Anchors: clip_point (jaw centre), cable_out.
```

# C · Air

## 8. `fan-inline` — 6" and 8" inline duct fans (the 4" is in pack 1)

**Sizes** `6in` 0.20 × 0.32 × 0.21 m (152 mm collars; a Cloudline S6 is 7.9 × 12.6 × 8.4 in); `8in` 0.22 × 0.30 × 0.23 m (203 mm collars; T8 8.5 × 11.9 × 9.2 in). **Budget** ≤ 1.5 k each.

**Binds to:** fan duty % → `fan_blades` spin; CFM → duct particles; controller display `screen_glass`.

```
Object family: EC inline duct fans with a mixed-flow impeller. Same construction as
fan-inline-4in: cylindrical body with a round collar each end, a mounting bracket
strap under the body, a small controller box on top (with a 40 × 20 mm display, its
own mesh, and a knob), a 7-blade backward-curved impeller visible through the intake
collar as ONE child node pivoting on the axis (+Z = airflow). 6in: body 200 mm
diameter × 250 mm, collars 152 mm × 35 mm, overall 320 mm long. 8in: body 240 mm
diameter × 230 mm, collars 203 mm × 35 mm, overall 300 mm long. Origin: axis centre,
y = 0 at the bracket bottom. Nodes: fan_inline (root); fan_body; fan_collar_in;
fan_collar_out; fan_blades (child, pivot at axis); fan_hub; fan_bracket;
fan_controller; fan_controller_display; fan_controller_knob; fan_lead. Materials:
plastic_dark (body, collars, bracket), fan_blade, roller_silver (hub), plastic_white
(controller), screen_glass (display), cable_black. Anchors: duct_in, duct_out, mount.
Export fan-inline--6in.glb and fan-inline--8in.glb.
```

## 9. `duct-fittings` — Y-branch, reducer, port collar (4" and 6")

**Budget** ≤ 700 each. Particles follow the centrelines; the collar is how a duct meets a tent port.

```
Object family, six GLBs: (a) duct-fittings--y-4in: a 102 mm Y-branch, trunk 200 mm
long, two 45° arms 180 mm long; (b) duct-fittings--y-6in: same at 152 mm; (c)
duct-fittings--reducer-6to4: a 152 → 102 mm conical reducer 150 mm long with 30 mm
straight ends; (d) duct-fittings--reducer-8to6: 203 → 152 mm; (e) duct-fittings--
collar-4in: a 102 mm flanged port collar — a 40 mm tube with a 150 mm square flange
plate 3 mm thick and a worm-drive clamp band suggested by a 12 mm ring; (f)
duct-fittings--collar-6in: same at 152 mm with a 200 mm flange. Origin at the trunk /
large-end inlet face centre, axis +Z. Nodes: duct_fitting (root); fitting_body;
fitting_flange (collars only); fitting_clamp (collars only). Materials: duct_foil
(Y and reducers), frame_steel (collar tube, flange), roller_silver (clamp ring).
Anchors: duct_in (inlet), duct_out (outlet; Y-branches: duct_out_1 and duct_out_2).
```

## 10. `fan-clip-oscillating-6in` — clip fan on a tent pole

**Size** head Ø 0.16 × 0.10 m, clamp 0.09 m. **Budget** ≤ 1 k.

**Binds to:** clip-fan plug on/off → `fan_blades` spin at a fixed 0.4 s/rev and a slow ±45° yaw of `fan_head` when oscillating.

```
Object: a 6" clip fan: a spring clamp (two 90 × 45 mm jaws), a short neck with a 30 mm
tilt knuckle, a 160 mm diameter × 100 mm deep cylindrical head with a front wire guard
(model as one mesh_wire disc, no individual wires) and a rear grille, a 3-blade fan
disc inside as its own child node pivoting on the head axis, and a 30 mm oscillation
knob on the head. Make fan_head the parent of the guard, grille and blades and give it
its pivot at the knuckle (vertical axis) so the app can yaw it. Origin at the clamp
jaw centre, y = 0 at the clamp bottom. Nodes: fan_clip_osc (root); clip_jaw_top;
clip_jaw_bottom; clip_knuckle; fan_head (child, yaw pivot); fan_guard; fan_grille;
fan_blades (child of fan_head, pivot on axis); fan_osc_knob; fan_cord. Materials:
plastic_dark (clamp, head, knob), mesh_wire (guard, grille), fan_blade, cable_black.
Anchors: clip_point, cable_out.
```

## 11. `fan-tower-76cm` — room circulation tower fan

**Size** 0.28 × 0.28 × 0.76 m. **Budget** ≤ 1 k. Binds to a plug on/off (grille band glow subtle + `fan_column` slow yaw).

```
Object: a tower fan: a round base 280 mm diameter × 40 mm, a tapered column 760 mm tall
(200 mm wide at the base tapering to 160 mm at the top, oval section) with a full-
height front outlet grille band 80 mm wide (its own mesh, mesh_wire) and a rear intake
band, a control cap on top with 4 buttons and a small display (screen_glass). Make
fan_column its own child node pivoting on the vertical axis so the app can oscillate
it ±40°. Origin floor centre. Nodes: fan_tower (root); fan_base; fan_column (child);
fan_outlet_grille; fan_intake_grille; fan_cap; fan_cap_display; fan_cord. Materials:
plastic_dark (base, column, cap), mesh_wire (grilles), screen_glass, cable_black.
Anchors: outlet_face (grille centre, +Z), cable_out.
```

## 12. `vent-passive-mesh` — passive intake vent with insect mesh (4" and 6")

**Budget** ≤ 400 each. Static; drawn dashed when the zone's intake is passive.

```
Object family: a passive intake vent for a tent port: a 40 mm long tube (102 mm or
152 mm diameter) with a square flange (150 / 200 mm) and a fine insect mesh disc
across the opening (one mesh_wire disc), plus an internal light-baffle suggested by
two staggered half-discs 15 mm apart. Origin at the flange face centre, axis +Z
(inflow). Nodes: vent_passive (root); vent_tube; vent_flange; vent_mesh; vent_baffle.
Materials: frame_steel (tube, flange), mesh_wire, plastic_dark (baffle). Anchors:
duct_in, duct_out. Export vent-passive-mesh--4in.glb and --6in.glb.
```

## 13. `duct-silencer` — inline noise silencer (4" and 6")

**Budget** ≤ 500 each. Static.

```
Object family: an inline duct silencer: a cylindrical canister (4in: 200 mm diameter ×
450 mm; 6in: 250 mm × 600 mm) with 102 / 152 mm collars 40 mm long on both ends and
two hanging straps on top. Origin at the inlet collar face, axis +Z. Nodes:
duct_silencer (root); silencer_body; silencer_collar_in; silencer_collar_out;
silencer_strap_1; silencer_strap_2. Materials: duct_foil (body), plastic_dark
(collars), cable_black (straps). Anchors: duct_in, duct_out, hang_1, hang_2.
Export duct-silencer--4in.glb and --6in.glb.
```

# D · Climate

## 14. `dehumidifier-30l` — room-class compressor dehumidifier

**Size** 0.36 × 0.27 × 0.52 m (30 L-class units run 34–39 × 25–27 × 50–52 cm). **Budget** ≤ 1.8 k.

**Binds to:** dehumidifier demand → `fan_blades` + `led_status`; tank level plane; relay offline → dashed.

```
Object: a 30 L/day dehumidifier 360 × 270 × 520 mm: white upright body with rounded
vertical edges (R 20 mm), four castors, a top outlet with 10 louvre vanes (the vane
group its own child node pivoting on its long axis so the app can tilt it), a full-
height rear intake grille with vertical ribs, a removable clear tank in the lower front
(own mesh, window_acrylic) with a water plane at 50 %, a top control panel with a
two-digit display (screen_glass), 5 buttons and a status LED, a carry handle recess on
each side, a continuous-drain hose barb at the back. A 7-blade fan disc behind the top
outlet (own child, vertical axis). Origin floor centre. Nodes: dehumidifier_30l (root);
dehum_body; dehum_castor_1..4; dehum_vanes (child); dehum_rear_grille; dehum_tank;
dehum_tank_water; dehum_panel; dehum_display; dehum_status_led; dehum_fan_blades
(child); dehum_drain_barb. Materials: plastic_white (body, panel), plastic_dark
(grilles, castors, vanes, barb), window_acrylic (tank), water, screen_glass,
led_status, fan_blade. Anchors: intake_face, outlet_face, cable_out, drain_out.
```

## 15. `humidifier-evaporative` — wick-drum evaporative humidifier

**Size** 0.32 × 0.22 × 0.36 m. **Budget** ≤ 1.2 k.

**Binds to:** humidifier demand → `fan_blades` slow spin + `led_status` (no visible plume: evaporative units emit dry vapour).

```
Object: an evaporative humidifier: a dark base 320 × 220 × 120 mm with a water trough,
a light-grey upper housing 320 × 220 × 240 mm with a large top outlet grille (mesh_wire
rectangle 240 × 140 mm), a translucent side window showing the water level (own mesh,
window_acrylic, with a water plane at 60 % behind it), a 3-position dial and a status
LED on the front, and inside a vertical wick drum (a 180 mm diameter × 200 mm cylinder,
plastic_white) with a 5-blade fan disc above it (own child, vertical axis). Origin
floor centre. Nodes: humidifier_evap (root); hum_base; hum_housing; hum_outlet_grille;
hum_window; hum_water; hum_dial; hum_status_led; hum_wick_drum; hum_fan_blades (child);
hum_cord. Materials: plastic_dark (base, dial), plastic_white (housing, drum),
mesh_wire, window_acrylic, water, led_status, fan_blade, cable_black. Anchors:
outlet_face (top), cable_out.
```

## 16. `heater-oil-column-7fin` — oil-filled radiator

**Size** 0.38 × 0.15 × 0.63 m. **Budget** ≤ 1.2 k.

**Binds to:** heater demand → all fins `heat_element` emissive (low) + the app's heat lines; thermostat dial static.

```
Object: an oil-filled column heater: seven vertical fins, each 60 × 25 × 600 mm with
rounded tops, on 50 mm centres, joined by top and bottom header tubes (25 mm diameter);
the fins are ONE mesh named heat_element so they can glow together; a control box
120 × 100 × 200 mm at one end with a thermostat dial, a 3-position switch and a power
LED; two castor feet (each a 200 mm wide bar with two 40 mm wheels) under the end
fins; a cord. Origin floor centre. Nodes: heater_oil_column (root); heat_element;
heater_header_top; heater_header_bottom; heater_control_box; heater_dial;
heater_switch; heater_status_led; heater_foot_1; heater_foot_2; heater_cord.
Materials: heat_element (fins), plastic_white (headers, control box), plastic_dark
(dial, switch, feet), led_status, cable_black. Anchors: cable_out.
```

## 17. `heater-ceramic-tube-60cm` — tubular heater for a tent floor or under a rack

**Size** Ø 0.06 × 0.60 m + 0.05 m brackets. **Budget** ≤ 500.

```
Object: a tubular ceramic heater: a 60 mm diameter × 600 mm horizontal tube (its
outer skin the heat_element mesh) inside a wire guard cage (a 90 mm diameter × 620 mm
cylinder, mesh_wire, no individual wires), two 50 mm tall wall/floor brackets at the
ends, a cord from one end. Origin floor centre under the brackets. Nodes:
heater_ceramic_tube (root); heat_element; heater_guard; heater_bracket_1;
heater_bracket_2; heater_cord. Materials: heat_element, mesh_wire, plastic_dark
(brackets), cable_black. Anchors: mount_1, mount_2, cable_out.
```

## 18. `ac-minisplit-indoor` — wall-mounted split system head

**Size** 0.80 × 0.19 × 0.30 m (12 000 BTU heads are ~80 × 19 × 28–30 cm). **Budget** ≤ 1.2 k.

**Binds to:** AC demand → `ac_vane` opens (rotates 60°) + `fan_blades` (a barrel fan, horizontal axis) + `led_status`; display `screen_glass`.

```
Object: an indoor mini-split head 800 × 190 × 300 mm: a white rounded housing with a
top intake grille (mesh_wire strip 700 × 60 mm), a front panel, a bottom-front outlet
slot 680 × 40 mm with a single long louvre vane (own child, pivot on its long axis),
a small display window and status LED at the right of the front panel, and a wall
mounting plate at the back. Inside the outlet, a barrel (cross-flow) fan: a 90 mm
diameter × 680 mm cylinder with 12 shallow blade ridges — own child node pivoting on
its long horizontal axis. Origin at the back mounting plate centre with y = 0 at the
bottom edge (wall-mounted). Nodes: ac_minisplit_indoor (root); ac_housing;
ac_intake_grille; ac_front_panel; ac_vane (child); ac_barrel_fan (child); ac_display;
ac_status_led; ac_mount_plate. Materials: plastic_white (housing, panel, plate),
mesh_wire, plastic_dark (vane), fan_blade (barrel), screen_glass, led_status.
Anchors: mount, outlet_face (slot centre, +Z out and 30° down), pipe_out (right rear).
```

## 19. `ac-window-unit` — window air conditioner

**Size** 0.50 × 0.40 × 0.35 m. **Budget** ≤ 1.2 k.

```
Object: a window AC unit 500 × 400 × 350 mm: a grey steel box with a front plastic
fascia holding a 300 × 200 mm outlet louvre panel (12 vanes as one child node pivoting
on the horizontal axis), a side intake grille strip, a control cluster (two dials, a
display, a status LED) at the right, an accordion side panel 150 mm wide on each side
(thin ribbed slabs), and a rear condenser grille (mesh_wire). A 5-blade fan disc behind
the outlet (child, horizontal axis). Origin floor centre (it sits on a sill; the app
positions by anchor). Nodes: ac_window_unit (root); ac_body; ac_fascia; ac_vanes
(child); ac_intake_grille; ac_dial_1; ac_dial_2; ac_display; ac_status_led;
ac_side_panel_left; ac_side_panel_right; ac_rear_grille; ac_fan_blades (child).
Materials: frame_steel (body), plastic_white (fascia, side panels), plastic_dark
(vanes, dials), mesh_wire, screen_glass, led_status, fan_blade. Anchors: outlet_face,
mount, cable_out.
```

## 20. `co2-source` — tank + regulator, bag, generator (three GLBs)

**Sizes** tank Ø 0.20 × 0.69 m (a 20 lb aluminium cylinder is 8 in diameter × 27 in with valve); bag 0.30 × 0.20 × 0.10 m; generator 0.40 × 0.30 × 0.60 m. **Budget** ≤ 1.2 k / 300 / 1.2 k.

**Binds to:** CO₂ solenoid on → `led_status` + a faint plume from the tubing end; ppm → hover.

```
Object family, three GLBs.
(a) co2-source--tank: a 20 lb aluminium CO₂ cylinder 200 mm diameter × 630 mm tall
with a domed top, a 40 mm neck, a CGA-320 valve with a hand-wheel, a carry handle
collar, and a regulator assembly on the valve: a 60 mm body, two 50 mm gauges (each
face screen_glass), a solenoid block 40 × 30 × 50 mm with a status LED, a needle valve
knob, and 600 mm of 6 mm tubing ending in a small diffuser. Origin floor centre.
Nodes: co2_tank (root); tank_body; tank_neck; tank_valve; tank_handwheel;
tank_handle; regulator_body; gauge_1; gauge_2; solenoid_body; solenoid_status_led;
needle_knob; co2_tubing; co2_diffuser; co2_plume (a 100 mm faint cone at the diffuser,
hidden by the app until the solenoid is on). Materials: roller_silver (cylinder),
metal_brass (valve, regulator, needle), plastic_dark (solenoid, handle), screen_glass
(gauges), led_status, rubber_black (tubing), window_acrylic (plume). Anchors:
tubing_end (diffuser), cable_out.
(b) co2-source--bag: a 300 × 200 × 100 mm mycelium CO₂ bag: a soft rounded block with a
40 mm vent patch on the top face (own mesh) and a hanging loop. Origin at the loop
(hangs). Nodes: co2_bag (root); bag_body; bag_vent; bag_loop. Materials: plastic_white
(bag), plastic_dark (vent), cable_black (loop). Anchors: hang_point.
(c) co2-source--generator: a propane CO₂ generator 400 × 300 × 600 mm: a dark steel box
with a louvred front (12 slats), a burner window 100 × 60 mm (heat_element behind it),
a hanging bracket on top, a gas inlet fitting and a solenoid with LED at the back.
Origin at the hanging bracket (hangs). Nodes: co2_generator (root); gen_body;
gen_louvres; gen_window; heat_element; gen_bracket; gen_gas_inlet; solenoid_body;
solenoid_status_led. Materials: plastic_dark (body, louvres), window_acrylic (window),
heat_element, frame_steel (bracket), metal_brass (inlet), led_status. Anchors:
hang_point, gas_in, cable_out.
```

# E · Water and root zone

## 21. `reservoir-ibc-1000l` — caged IBC tote

**Size** 1.20 × 1.00 × 1.16 m. **Budget** ≤ 1.5 k. Water plane by level; valve and pump anchors.

```
Object: a 1000 L IBC: a translucent white HDPE bottle 1150 × 950 × 1000 mm with
rounded corners inside a galvanised tube cage (a lattice of 20 mm tubes: 4 vertical
corner tubes + 3 horizontal rings per face, modelled as ONE mesh), on a 1200 × 1000 ×
150 mm plastic pallet base, a 150 mm screw cap on top, a 2" ball valve at the bottom
front with a lever, and a water plane inside at 60 % (own mesh). Origin floor centre.
Nodes: reservoir_ibc (root); ibc_bottle; ibc_cage; ibc_pallet; ibc_cap; ibc_valve;
ibc_valve_lever; ibc_water. Materials: window_acrylic (bottle), frame_steel (cage),
plastic_dark (pallet, valve), plastic_white (cap), water. Anchors: hose_out (valve),
pump_socket (inside bottom centre), probe_socket (through the cap), fill_in (cap).
```

## 22. `pump-dosing-peristaltic-3ch` — nutrient doser

**Size** 0.17 × 0.11 × 0.09 m. **Budget** ≤ 800. Binds to dose events (`pump_rotor_n` spins while dosing) and stock levels on hover.

```
Object: a 3-channel peristaltic dosing pump: a white box 170 × 110 × 80 mm with three
50 mm diameter pump heads on the front (each head a clear cover over a 3-roller rotor;
rotor its own child node pivoting on its axis), six 4 mm tube stubs (in/out per head),
a small display (screen_glass), two buttons and a status LED on the top face. Origin
floor centre. Nodes: pump_dosing (root); dosing_body; dosing_head_1..3;
dosing_rotor_1..3 (children); dosing_tube_1..6; dosing_display; dosing_status_led.
Materials: plastic_white (body), window_acrylic (head covers), plastic_dark (rotors),
rubber_black (tubes), screen_glass, led_status. Anchors: tube_out_1..3, cable_out.
```

## 23. `drip-manifold-8` — irrigation manifold with emitters and stakes

**Size** hub 0.06 m, 8 lines × 0.60 m. **Budget** ≤ 1.2 k. Binds to shot events (line `water` tint while a shot runs).

```
Object: a drip irrigation manifold: a 60 mm diameter × 40 mm 8-port hub with a 13 mm
inlet barb on one side, eight 6 mm lines leaving radially and curving to lie flat
(each 600 mm long, ending in a 100 mm angled stake with a 12 mm drip emitter body
at its top). Each line + emitter + stake is one mesh named drip_line_n; the water
inside is suggested by a thin inner tube mesh per line named drip_water_n (hidden by
the app until a shot runs). Origin at the hub centre on the floor. Nodes:
drip_manifold (root); drip_hub; drip_inlet; drip_line_1..8; drip_water_1..8. Materials:
plastic_dark (hub, lines, stakes), rubber_black (inlet), water (water tubes). Anchors:
hose_in (inlet barb), emitter_1..8 (stake tips).
```

## 24. `flood-table-120x60` — ebb-and-flow tray on a stand

**Size** 1.20 × 0.60 × 0.18 m tray on a 0.75 m stand. **Budget** ≤ 1 k. Water plane rises during a flood.

```
Object: a flood-and-drain table: a white ABS tray 1200 × 600 × 180 mm with channelled
floor ridges (8 shallow ribs along the length), a fill fitting and an overflow
standpipe (a 20 mm tube 120 mm tall) in one corner, a water plane at 20 mm (own mesh,
hidden until a flood), on a 25 mm square-tube steel stand 750 mm tall with cross
bracing. Origin floor centre. Nodes: flood_table (root); table_tray; table_ribs;
table_fill; table_overflow; table_water; table_stand. Materials: plastic_white (tray,
ribs), plastic_dark (fittings), water, frame_steel (stand). Anchors: hose_in (fill),
drain_out (overflow), pot_1..pot_6 (a 3 × 2 grid on the tray floor, 380 mm spacing).
```

## 25. `dwc-bucket-20l` — deep-water-culture bucket, empty and planted

**Size** Ø 0.30 × 0.38 m + net pot. **Budget** ≤ 1.5 k each. Two GLBs: `empty` and `veg`.

**Binds to:** air pump on → `bubbles` visible; water level plane; plant stage.

```
Object family: a 20 L black DWC bucket 300 mm diameter × 380 mm with a lid holding a
150 mm net pot (a tapered mesh_wire cup 120 mm deep) filled with clay pebbles (a
rounded disc, soil), a 6 mm airline entering through the lid to a 50 mm airstone
disc at the bottom, a column of bubbles above the airstone (12 small spheres in a
20 mm column as ONE mesh named bubbles, hidden until the air pump runs), a water plane
at 70 % (own mesh), and a 15 mm sight tube on the outside with its own water line.
`veg` variant adds a stylised 400 mm plant (stem + 6 five-finger leaf fans as in
pot-fabric-3gal-plant--veg) growing from the net pot. Origin floor centre. Nodes:
dwc_bucket (root); bucket_body; bucket_lid; net_pot; pebbles; airline; airstone;
bubbles; bucket_water; sight_tube; sight_water; plant_stem; plant_leaves (veg only).
Materials: plastic_dark (bucket, lid), mesh_wire (net pot), soil (pebbles),
rubber_black (airline), plastic_white (airstone), window_acrylic (bubbles, sight
tube), water, leaf_green. Anchors: air_in (airline top), probe_socket (through the lid),
canopy_top (veg only). Export dwc-bucket-20l--empty.glb and --veg.glb.
```

## 26. `pot-family` — the other pots (empty)

**Sizes** fabric `1gal` Ø 0.18 × 0.15 m, `5gal` Ø 0.30 × 0.25 m, `7gal` Ø 0.36 × 0.28 m; `square-3.6l` 0.15 × 0.15 × 0.20 m plastic; `airpot-10l` Ø 0.25 × 0.30 m; plus `saucer-30` Ø 0.30 × 0.03 m. **Budget** ≤ 800 each. Pack 1 has the planted 3 gal.

```
Object family, six GLBs, all empty with a substrate disc 20 mm below the rim: three
fabric pots (slightly tapered cylinders with a 15 mm rolled rim and two 60 mm strap
handles) at 180 × 150, 300 × 250 and 360 × 280 mm (diameter × height); a square
plastic pot 150 × 150 × 200 mm with a 10 mm rim and four drain slots; an air-pot
250 mm diameter × 300 mm — a cylinder whose wall shows the dimpled cone pattern as
8 rings of 16 shallow cones (keep it one mesh, ≤ 600 triangles) with a perforated
base disc; and a 300 mm round saucer 30 mm deep. Origin floor centre. Nodes:
pot (root); pot_body; pot_handles (fabric only); pot_rim; soil_surface (not on the
saucer); pot_drain (plastic and air-pot). Materials: pot_fabric (fabric pots),
plastic_dark (plastic pot, air-pot, saucer), soil. Anchors: probe_socket (60 mm off
centre on the soil), plant_base (soil centre), saucer_under (pot underside centre).
Export pot-family--1gal.glb, --5gal.glb, --7gal.glb, --square-3.6l.glb,
--airpot-10l.glb, --saucer-30.glb.
```

## 27. `heat-mat-50x120` — the large propagation mat

**Size** 0.50 × 1.20 × 0.005 m. **Budget** ≤ 300. Same nodes as heat-mat-25x50 so bindings reuse.

```
Object: a 500 × 1200 mm heat mat, 5 mm thick, 12 mm rounded corners, 15 mm border,
active area its own mesh 1 mm above the base (heat_element), a lead from the middle of
one short edge with a thermostat puck. Origin floor centre. Nodes: heat_mat (root);
mat_base; heat_element; mat_lead; mat_thermostat. Materials: plastic_dark,
heat_element, plastic_white. Anchors: tray_1, tray_2 (centres of the two halves —
each takes a 1020 tray), cable_out.
```

## 28. `trellis-and-stakes` — scrog net and plant stakes

**Sizes** net 1.20 × 1.20 m (150 mm mesh) on a 25 mm frame; stakes 0.90 m bamboo (bundle of 4). **Budget** ≤ 600 + 200.

```
Object family, two GLBs. (a) trellis-and-stakes--net-120: a 1200 × 1200 mm square
frame of 25 mm tube with a 150 mm grid net inside (the net is ONE mesh: 7 + 7 thin
strips 4 mm wide, material mesh_wire), four 30 mm corner clamps that grip tent poles.
Origin at the frame centre with y = 0 at the frame's underside (the app raises it to
canopy height). Nodes: trellis_net (root); net_frame; net_mesh; net_clamp_1..4.
Materials: frame_steel (frame), mesh_wire (net), plastic_dark (clamps). Anchors:
pole_1..4 (clamp centres). (b) trellis-and-stakes--stakes-90: four 12 mm × 900 mm
bamboo stakes standing in a 100 mm square with two 5 mm ties between them at 400 and
700 mm; one mesh for the stakes, one for the ties. Origin floor centre. Nodes:
plant_stakes (root); stakes; stake_ties. Materials: soil (stakes — the app draws it as
a warm dim tone), rubber_black (ties). Anchors: plant_base.
```

# F · Sensing

## 29. `sensor-co2-module` — CO₂ sensor enclosure

**Size** 0.06 × 0.04 × 0.025 m + 1 m cable. **Budget** ≤ 300. Binds to ppm (LED tone: green in band, amber high, red low/fault).

```
Object: a small grey enclosure 60 × 40 × 25 mm with six 2 mm vent slots on one face,
a 3 mm status LED on the lid, a cable gland at one end with a 200 mm cable stub, and a
hanging tab. Origin at the tab (hangs at canopy height). Nodes: sensor_co2 (root);
co2_box; co2_vents; co2_status_led; co2_cable; co2_tab. Materials: plastic_white
(box), plastic_dark (vents, gland), led_status, cable_black. Anchors: hang_point,
cable_out.
```

## 30. `sensor-par-quantum` — PAR / PPFD sensor on a levelling plate

**Size** puck Ø 0.024 × 0.033 m on a 0.06 m plate. **Budget** ≤ 300. Binds to PPFD (hover value, `led_status` breathe while sampling).

```
Object: a quantum PAR sensor: a 24 mm diameter × 33 mm anodised puck with a 12 mm white
diffuser dome on top (own mesh, plastic_white) on a 60 mm diameter levelling plate
with three thumb screws and a bubble level (a 6 mm glass_clear disc), a 2 m cable stub
(model 150 mm) from the plate edge. Origin at the plate underside centre (it sits at
canopy height on a stand or hangs). Nodes: sensor_par (root); par_plate; par_puck;
par_diffuser; par_screws; par_bubble; par_cable. Materials: plastic_dark (plate,
puck), plastic_white (diffuser), roller_silver (screws), glass_clear (bubble),
cable_black. Anchors: canopy_point (diffuser top), cable_out.
```

## 31. `probe-ph-ec-pen` — reservoir probes (pH and EC, two GLBs)

**Size** Ø 0.03 × 0.15 m body + 0.06 m glass tip. **Budget** ≤ 300 each. Binds to pH / EC (hover value; `led_status` tone by band).

```
Object family: a lab-style pen probe: a 30 mm diameter × 150 mm body with a small LCD
(screen_glass 20 × 10 mm), a status LED, a 12 mm glass tip 60 mm long (pH: a bulb
tip; EC: two 3 mm graphite pins), and a 2 mm cable from the top (model 150 mm).
Origin at the tip bottom (it hangs in a reservoir through a probe_socket anchor, tip
down; y = 0 at the tip). Nodes: probe_pen (root); pen_body; pen_display;
pen_status_led; pen_tip; pen_cable. Materials: plastic_white (body), screen_glass,
led_status, glass_clear (tip), cable_black. Anchors: socket (top of body), cable_out.
Export probe-ph-ec-pen--ph.glb and --ec.glb.
```

## 32. `sensor-float-level` — reservoir float switch

**Size** stem 0.10 m, float Ø 0.03 m. **Budget** ≤ 200. Binds to level state (float node rises 40 mm when high).

```
Object: a vertical float switch: a 10 mm diameter × 100 mm stem with an M16 threaded
bulkhead and nut at the top, a 30 mm diameter × 25 mm ring float on the stem (own
child node so the app can slide it), a stop clip at the stem bottom, a cable from the
top. Origin at the bulkhead underside (mounts through a tank wall or lid, stem
hanging down; y = 0 at the bulkhead). Nodes: sensor_float (root); float_stem;
float_bulkhead; float_nut; float_ring (child); float_stop; float_cable. Materials:
plastic_dark (stem, clip), metal_brass (bulkhead, nut), plastic_white (float),
cable_black. Anchors: mount, cable_out.
```

## 33. `camera-cube` — zone camera

**Size** 0.03 m cube on a 0.05 m magnetic stand. **Budget** ≤ 300. Binds to online (LED) and recording (LED red).

```
Object: a 30 mm cube camera with a 12 mm lens ring on the front (glass_clear lens
disc), a 2 mm status LED beside the lens, on a ball joint over a 50 mm diameter × 12 mm
magnetic base, a cable from the back. Origin at the base underside centre (it sits on
a pole clamp or shelf). Nodes: camera_cube (root); cam_body; cam_lens_ring; cam_lens;
cam_status_led; cam_ball; cam_base; cam_cable. Materials: plastic_white (body),
plastic_dark (ring, ball, base), glass_clear (lens), led_status, cable_black.
Anchors: mount, cable_out.
```

## 34. `sensor-door-contact` — magnetic contact on a tent door or room door

**Size** two halves 0.04 × 0.015 × 0.01 m. **Budget** ≤ 100. Binds to door open/closed (the app draws the two halves apart and tints the LED).

```
Object: a two-part magnetic door contact: a 40 × 15 × 10 mm sensor half with a 2 mm
LED and a 30 × 10 × 10 mm magnet half, side by side with a 5 mm gap. Origin at the
sensor half's mounting face (wall-mounted; y = 0 at the bottom edge). Nodes:
sensor_door (root); door_sensor_half; door_magnet_half (own child so it can move
with the door); door_status_led. Materials: plastic_white, led_status. Anchors:
mount_fixed (sensor half back), mount_moving (magnet half back).
```

# G · Control and power

## 35. `power-strip-6way` — six-outlet strip with switch

**Size** 0.30 × 0.06 × 0.04 m. **Budget** ≤ 400. Binds to each outlet's relay state if it is a smart strip (`outlet_led_n`).

```
Object: a six-outlet power strip 300 × 60 × 40 mm: a white bar with six AU socket
faces (three flat slots each, recessed quads) on the top face on 45 mm centres, a
lit rocker switch at one end (own mesh, led_status), a 2 mm LED beside each socket
(own meshes), two keyhole slots underneath, a cord from the end. Origin floor centre
(it lies flat or mounts by the keyholes). Nodes: power_strip (root); strip_body;
strip_socket_1..6; strip_switch; outlet_led_1..6; strip_cord. Materials: plastic_white
(body), plastic_dark (socket slots), led_status (switch, LEDs), cable_black. Anchors:
mount, cable_out, plug_1..6 (socket face centres).
```

## 36. `relay-box-4ch` — the appliance bridge

**Size** 0.15 × 0.09 × 0.06 m. **Budget** ≤ 500. Binds to four relay channels (`relay_led_n`) and link state (`hub_status_led`).

```
Object: a DIN-style relay enclosure 150 × 90 × 60 mm: a grey box with a clear hinged
lid (window_acrylic), inside it four 30 × 20 mm relay modules in a row (one mesh) each
with a 3 mm LED beside it (four own meshes), a small ESP board with an antenna stub
and a status LED, six cable glands along the bottom edge, two mounting ears. Origin at
the back face centre with y = 0 at the bottom edge (wall-mounted). Nodes:
relay_box_4ch (root); relay_enclosure; relay_lid; relay_modules; relay_led_1..4;
relay_board; hub_status_led; relay_antenna; relay_glands; relay_ears. Materials:
plastic_dark (enclosure, glands, ears, board), window_acrylic (lid), plastic_white
(modules), led_status, cable_black (antenna). Anchors: mount, cable_1..6.
```

## 37. `controller-fan-speed` — standalone speed controller / thermostat puck

**Size** 0.08 × 0.06 × 0.05 m. **Budget** ≤ 300. Binds to fan duty (display value on hover) and on/off LED.

```
Object: a fan speed controller: an 80 × 60 × 50 mm dark box with a 40 mm rotary knob on
the front (own mesh with a pointer notch), a 30 × 12 mm display above it
(screen_glass), a status LED, a cord in and a socket out on the back, a hanging tab.
Origin at the back face centre with y = 0 at the bottom edge (hangs on a pole strap).
Nodes: controller_fan_speed (root); ctrl_body; ctrl_knob; ctrl_display;
ctrl_status_led; ctrl_cord; ctrl_socket; ctrl_tab. Materials: plastic_dark (body,
knob), screen_glass, led_status, cable_black, plastic_white (socket). Anchors: mount,
cable_in, cable_out.
```

# H · Plants and post-harvest

## 38. `plant-mother-7gal` — a large vegetative mother plant

**Size** pot Ø 0.36 × 0.28 m, canopy Ø 0.70 × 0.60 m above the pot. **Budget** ≤ 3 k. Binds like the pack-1 pots (name on hover, VPD tone on `leaf_green`).

```
Object: a 7-gallon fabric pot (360 × 280 mm, as pot-family--7gal, with soil) holding a
mature vegetative mother plant: a 20 mm main stem 500 mm tall with four 12 mm side
branches at 120, 220, 320 and 420 mm height, each carrying 4 five-finger leaf fans;
plus 6 leaf fans on the main stem — all leaves ONE mesh (each fan 5 thin quads ≤ 60 mm
long), branches + stem ONE mesh. Overall canopy about 700 mm wide × 600 mm tall above
the pot rim. Origin floor centre. Nodes: plant_mother (root); pot_body; pot_handles;
pot_rim; soil_surface; plant_stem; plant_leaves. Materials: pot_fabric, soil,
leaf_green. Anchors: probe_socket (on the soil, 80 mm off centre), canopy_top,
cutting_1..4 (branch tips — where clones are taken).
```

## 39. `hanging-line-branches` — drying line with hung branches

**Size** 1.20 m line, six branch bundles 0.30 m long. **Budget** ≤ 1.5 k. Binds to the dry-room role (shown only when a zone is in Dry), `leaf_green` tinted dim by the app as the dry progresses (days since harvest).

```
Object: a drying line: a 1200 mm taut 3 mm cord between two 40 mm S-hooks, with six
harvested branches hung upside down at 180 mm spacing — each branch a 6 mm stem 300 mm
long with three side twigs carrying 8 elongated bud ellipsoids (35 × 70 mm) and 4
small leaf fans; buds ONE mesh (trim_green), stems + leaves ONE mesh (leaf_green).
Origin at the line's left hook (y = 0 at the hook, branches hanging below). Nodes:
hanging_line (root); line_cord; line_hook_1; line_hook_2; branch_stems; branch_buds;
branch_leaves. Materials: cable_black (cord), roller_silver (hooks), leaf_green,
trim_green. Anchors: hang_1, hang_2.
```

## 40. `curing-jars-tray` — six 1 L jars on a tray with hygrometer pucks

**Size** tray 0.40 × 0.28 m, jars Ø 0.10 × 0.17 m. **Budget** ≤ 1.8 k. Binds to the cure role: each jar's `jar_status_led_n` (hygrometer puck tone) by RH band; jar fill by logged weight.

```
Object: a 400 × 280 × 20 mm black tray holding six 1 L wide-mouth glass jars
(100 mm diameter × 170 mm, straight sides, 90 mm metal lid) in a 3 × 2 grid on 130 mm
centres; each jar filled to 60 % with a bud mass (a rounded lumpy block, trim_green,
own mesh per jar) and a 30 mm hygrometer puck on the inside of the lid whose face is
a tiny screen_glass disc plus a 2 mm led_status dot (own meshes per jar). Origin floor
centre. Nodes: curing_jars (root); jar_tray; jar_1..6; jar_lid_1..6; jar_bud_1..6;
jar_hygro_1..6; jar_status_led_1..6. Materials: plastic_dark (tray), glass_clear
(jars), roller_silver (lids), trim_green (bud), screen_glass, led_status. Anchors:
jar_1..6 (lid centres).
```

## 41. `scale-bench-5kg` — harvest scale

**Size** 0.20 × 0.15 × 0.03 m. **Budget** ≤ 300. Binds to the last logged harvest weight (display on hover).

```
Object: a bench scale 200 × 150 × 30 mm: a dark base with a stainless 180 × 130 mm
weighing platform (roller_silver, 2 mm proud), a 50 × 20 mm display window
(screen_glass) and two buttons on the front lip. Origin floor centre. Nodes: scale
(root); scale_base; scale_platform; scale_display; scale_buttons. Materials:
plastic_dark, roller_silver, screen_glass. Anchors: platform_centre.
```

# I · Added so nothing is folded away

## 42. `propagation-cabinet` — enclosed clone cabinet with its own light

**Size** 0.60 × 0.40 × 0.90 m. **Budget** ≤ 1.5 k. Binds to the clone-zone tone, its T5 lamp and dome tray anchors.

```
Object: a small enclosed propagation cabinet 600 × 400 × 900 mm: a white panel box
with a hinged front door (own child node, hinge on the left edge) holding a 300 × 500 mm
acrylic window, two internal shelves at 300 and 600 mm (mesh_wire tops with 20 mm
rims), a 60 mm round vent hole with mesh top-rear, a 40 mm cable port low on the back,
four 30 mm feet. Origin floor centre. Nodes: propagation_cabinet (root); cab_body;
cab_door (child); cab_window; cab_shelf_1; cab_shelf_2; cab_vent; cab_cable_port;
cab_feet. Materials: plastic_white (body, door), window_acrylic (window), mesh_wire
(shelves, vent), plastic_dark (port, feet). Anchors: shelf_1, shelf_2, lamp_under_top
(underside of the roof, centre), lamp_under_2 (underside of shelf 2), fan_exhaust
(vent), cable_1, tray_1 (shelf 1 centre — takes a clone-dome-tray).
```

## 43. `drying-rack-mesh-6tier` — hanging mesh drying rack

**Size** Ø 0.60 × 1.20 m. **Budget** ≤ 1.2 k. Shown for Dry-role zones; tier contents by harvest log.

```
Object: a collapsible hanging herb-drying rack: six circular mesh tiers 600 mm
diameter on 200 mm spacing (each tier a thin disc with a 20 mm zipped rim — the disc
top mesh_wire, the rim plastic_dark; one mesh per tier), joined by four vertical
nylon straps (one mesh) to a top ring and a 60 mm S-hook. Model a bud layer on tiers
1–3 as three flat lumpy discs 15 mm thick (trim_green, own meshes) the app can hide.
Origin at the hook (y = 0), rack hanging below. Nodes: drying_rack (root);
rack_hook; rack_top_ring; rack_straps; rack_tier_1..6; rack_buds_1..3. Materials:
roller_silver (hook, ring), cable_black (straps), mesh_wire, plastic_dark, trim_green.
Anchors: hang_point, tier_1..6 (tier centres).
```

## 44. `fan-floor-pedestal-40cm` — pedestal fan

**Size** head Ø 0.45 × 0.15 m on a 1.20 m stand. **Budget** ≤ 1.2 k. Binds to a plug on/off (`fan_blades` 0.3 s/rev, `fan_head` yaw ±45°).

```
Object: a 16" pedestal fan: a 450 mm diameter round base plate 30 mm thick, a 30 mm
telescopic column 1000 mm tall, a tilt knuckle, a 450 mm diameter × 150 mm head with
front and rear wire guards (one mesh_wire disc each), a 3-blade fan disc inside (own
child, pivot on the head axis), a motor housing 120 mm diameter × 150 mm behind the
head, and a pull-cord oscillation knob. Make fan_head the parent of guards, blades and
motor with its pivot at the knuckle (vertical axis). Origin floor centre. Nodes:
fan_pedestal (root); fan_base; fan_column; fan_knuckle; fan_head (child); fan_guard_front;
fan_guard_rear; fan_blades (child of fan_head); fan_motor; fan_osc_knob; fan_cord.
Materials: plastic_dark (base, knuckle, motor, knob), roller_silver (column), mesh_wire,
fan_blade, cable_black. Anchors: outlet_face (front guard centre, +Z), cable_out.
```

## 45. `air-pump-dual` — aquarium-style air pump for DWC and reservoirs

**Size** 0.12 × 0.08 × 0.06 m. **Budget** ≤ 300. Binds to the air-pump plug (bubbles on the DWC buckets, `led_status`).

```
Object: a dual-outlet diaphragm air pump 120 × 80 × 60 mm: a rounded dark box on four
rubber feet, two 6 mm air outlets on one end, a flow dial on top, a small power LED,
a cord. Origin floor centre. Nodes: air_pump (root); pump_body; pump_feet;
pump_outlet_1; pump_outlet_2; pump_dial; pump_status_led; pump_cord. Materials:
plastic_dark (body, dial), rubber_black (feet), plastic_white (outlets), led_status,
cable_black. Anchors: air_out_1, air_out_2, cable_out.
```

## 46. `water-heater-aquarium-300w` — submersible reservoir heater

**Size** Ø 0.03 × 0.30 m. **Budget** ≤ 200. Binds to reservoir heater relay (`heat_element` emissive when on).

```
Object: a submersible glass-tube heater: a 30 mm diameter × 300 mm tube (glass_clear)
with the internal element as a 20 mm × 220 mm inner rod (heat_element, own mesh), a
dark plastic cap with a temperature dial and an indicator LED at the top, two suction
cups on a clip, a cable from the cap. Origin at the tube bottom (it hangs in a
reservoir through a probe_socket-style anchor, tip down; y = 0 at the tip). Nodes:
water_heater (root); heater_tube; heat_element; heater_cap; heater_dial;
heater_status_led; heater_clip; heater_cable. Materials: glass_clear, heat_element,
plastic_dark (cap, dial, clip), led_status, cable_black. Anchors: socket (cap top),
cable_out.
```

## 47. `water-chiller-1-10hp` — reservoir chiller

**Size** 0.34 × 0.28 × 0.36 m. **Budget** ≤ 1 k. Binds to chiller relay (`fan_blades` + `led_status`), set-point on hover.

```
Object: a 1/10 HP water chiller 340 × 280 × 360 mm: a white box with a front intake
grille (mesh_wire rectangle 200 × 160 mm) over a 5-blade fan disc (own child,
horizontal axis), a top control panel with a display (screen_glass), two buttons and a
status LED, two 13 mm hose barbs (in/out) on the back, side exhaust louvres, four
feet, a cord. Origin floor centre. Nodes: water_chiller (root); chiller_body;
chiller_grille; chiller_fan_blades (child); chiller_panel; chiller_display;
chiller_status_led; chiller_barb_in; chiller_barb_out; chiller_louvres; chiller_feet;
chiller_cord. Materials: plastic_white (body, panel), mesh_wire, fan_blade,
screen_glass, led_status, plastic_dark (barbs, louvres, feet), cable_black. Anchors:
hose_in, hose_out, cable_out.
```

## 48. `ac-minisplit-outdoor` — the condenser that goes with §18

**Size** 0.80 × 0.30 × 0.55 m. **Budget** ≤ 1.2 k. Binds to AC demand (`fan_blades` spin behind the grille); placed outside the room shell.

```
Object: a mini-split outdoor condenser 800 × 300 × 550 mm: a grey steel box on two
rubber feet, a large round front fan grille (mesh_wire disc 420 mm) with a 3-blade
propeller behind it (own child, horizontal axis), a side condenser coil face (fine
vertical ribs suggested by one lightly ribbed slab, roller_silver), a service-valve
cover on the right with two brass valves and two insulated pipes (rubber_black) exiting
toward the wall, a top lid with a lifting handle. Origin floor centre. Nodes:
ac_minisplit_outdoor (root); cond_body; cond_feet; cond_grille; cond_fan_blades
(child); cond_coil; cond_valve_cover; cond_valves; cond_pipes; cond_lid. Materials:
frame_steel (body, lid), rubber_black (feet, pipes), mesh_wire, fan_blade,
roller_silver (coil), plastic_dark (valve cover), metal_brass (valves). Anchors:
pipe_in (valve side), cable_out, mount.
```

---

## Manifest rows

Use `kind: "tent"` for §1, `"room"` for none here, `"device"` for §2–28, §35–41 and §42–48,
`"sensor"` for §29–34. Families get one row per exported variant, `slug` =
`<family>--<variant>`, sharing the same `anchors` and `materials` maps. Copy the
pattern from `BRIEFS.md`; `dims_cm` is the variant's real size; `zone` is left unset
for devices (the app places them by anchor when a zone binds them).

New material roles the app must learn (add to `TwinViewport.toWire` with pack 1's):
`mesh_wire` → dim at 0.5 edge opacity, no fill; `glass_clear` → glass; `metal_brass` →
frame (warm); `rubber_black` → shell.

## Authoring order for this pack

1. §1 tents (six sizes) and §4 bar LEDs — every configurable zone can be drawn.
2. §8 fans, §9 fittings, §12 vents, §13 silencers — the air path for any layout.
3. §14–§20 climate — the Climate desk's equipment tiles in place for any kit.
4. §21–§28 water and root — Root desk for hydro and larger soil grows.
5. §29–§37 sensors and control — Kit desk drawn in place.
6. §2–§3, §5–§7, §10–§11, §38–§48 — racks, propagation, legacy lighting, circulation
   fans, mothers, post-harvest, and the hydro support kit (air pump, heater, chiller,
   condenser). Nothing in the catalogue is folded into another brief; families export
   every listed variant.
