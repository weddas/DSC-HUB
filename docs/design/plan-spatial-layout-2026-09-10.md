# Plan — Multiple devices, and a rig you can rearrange

**Date:** 2026-09-10
**Ask (operator):** a tent or room can hold more than one fan, light, etc. Allow adding multiple
devices. Which leads to letting a user move and place their gear in the space, and move plants
around — and placing gear changes the way air moves.

---

## 0. The finding this plan starts from

**The rig's physical layout is not data. It is source code.**

- `frontend/src/twin/RigScene.tsx` places every real object with **36 hand-written `<Placed>`
  calls** — `<FanModel id="fanExRoom" slug="fan-inline-6in" at={{parent:"tent4x8", anchor:"fan_exhaust"}} />`,
  a camera at a literal `offset={[-1.18, 1.95, 0.6]}`, a heater rotated by `Math.PI / 5`.
- A plant's position is **derived from its pot number** (`PlantInstances.tsx`: pot 1-4 becomes
  `probe_1..probe_4`), so a plant cannot be anywhere its pot slot is not.
- Airflow knows **exactly four fans**, hardcoded in `computed_ops.CFM_SPECS` and bound to fixed hub
  entities and fixed calibration prefixes.

So "add a second fan" and "move the fan" are not two features. They are **one change**: turn the
layout into data and render from it. Everything else follows.

The good news is that the hard part is already built. `Placed` is a real placement primitive —
`at={{parent, anchor, offset}}`, `rotation`, `self` (which of the child's own anchors snaps to the
parent's), and `anchors.ts` resolves the whole thing as a dependency graph in world space, async
model loads and all. **It is driven by JSX today, but it does not have to be.** Feeding it a list
instead of a literal tree is a much smaller job than building placement from scratch.

---

## 1. What actually blocks multiples today

| Layer | Multiple devices? | Why |
|---|---|---|
| `space_device` (energy/inventory) | **Already fine** | `PRIMARY KEY (space_id, device_id)` — N rows per space. Nothing to change. |
| `space` | **Already fine** | Has an optional `room_id`; rooms exist as a concept. |
| Control plane | **Physically bounded** | The hub firmware has a fixed set of fan/relay channels. See §2 — this is the honest constraint. |
| Airflow model | **Blocked** | `CFM_SPECS` is a 4-entry literal, one per fixed hub entity, one per fixed cal prefix. |
| Twin | **Blocked** | 36 literal placements. |
| Desks | **Blocked** | Fixed role names (`exhaust_room`, `intake_2x4`) resolved by lookup, not iteration. |

**So the data model is not the blocker. The literals are.**

---

## 2. The constraint that has to be said out loud

**A device the brain can *place* is not necessarily a device the brain can *drive*.**

The hub has a fixed number of PWM fan channels and relays. A user can own six fans; the hub can
only drive the ones wired to it. The rest can still be plugged into a Zigbee or Tuya smart plug
(on/off, and power metering) — or into nothing at all.

That splits every device into three honest tiers, and the UI must never blur them:

| Tier | Brain can | Still contributes |
|---|---|---|
| **Driven** | set speed / on-off, read back state | control, energy, airflow |
| **Switched** | on-off only, via Zigbee/Tuya plug; often real power metering | energy, airflow (at its one speed) |
| **Known** | nothing — it is just *there* | energy (nameplate estimate), airflow, and the space it occupies |

A "known" oscillating fan in the corner still moves air and still costs money. It belongs in the
model. It must never render as if it had a control the user can press — the `oos` prop on
`EntityToggle` (dashed, "On hold", disabled) already solves exactly this and should be reused.

---

## 3. The three layers, in dependency order

### L1 — Instances: a device is a row, not a name

One table, `space_device`, already almost there. Each device instance gains:

| Field | Meaning |
|---|---|
| `kind` | `fan` / `light` / `filter` / `heater` / `humidifier` / `sensor` / `camera` / … |
| `role` | what it does here: `exhaust_outside`, `intake`, `circulation`, `canopy_light` … **many rows may share a role** |
| `tier` | `driven` / `switched` / `known` (§2) |
| `binding` | the hub entity, Zigbee ieee, or Tuya id — **null for `known`** |
| `catalog_id` | CannaLib equipment record (the ducting plan's D3/D4) |
| `placement` | §L2 |

Then the four hardcoded fans become four rows, and a fifth is just another row.

**`CFM_SPECS` dies.** Airflow iterates the fan rows of a space instead of a 4-entry literal, and
each row carries its own nameplate, duct size and calibration prefix. This is the single highest
-value change in the plan and it is mostly deletion.

**Migration is the risk, not the design.** The four existing fans must land as four rows with
byte-identical behaviour — same entities, same cal prefixes, same numbers — before anything new is
added. That is a test, not a hope: snapshot every airflow entity before and after and diff.

### L2 — Placement: where it physically is

Placement is a small record per instance, and it should express *what the operator means*, not raw
world coordinates:

```
placement = { parent: "tent4x8", anchor: "fan_exhaust" }          // snapped to a mount point
placement = { parent: "tent4x8", offset: [-1.02, 0, -0.32],       // free, relative to the tent
              rotation: [0, 0.63, 0] }
```

That is exactly `Placed`'s existing `at` prop — so **the persisted shape and the render shape are
the same shape**, and RigScene becomes a `.map()` over instances instead of a literal tree.

- **Anchors stay first-class.** A tent's mount points are real (fan ports, hanging bars, tray
  positions). Snapping to them is what makes placement feel correct rather than fiddly.
- **Free placement is the fallback**, for the oscillating fan on the floor that no anchor describes.
- **Plants get the same treatment.** Position stops being `f(pot number)` and becomes a placement
  like everything else, with the probe anchors as snap targets. That is what "move plants around"
  means, and it also fixes the current 2×4 fudge where a third clone lands on `mat_spot` with a
  computed offset because only two probe anchors exist.
- **Editing** happens in the twin (drag to a snap point) *and* as a plain list with numbers,
  because dragging in 3D on a phone is miserable and the numbers are what the operator actually
  knows ("it's 30 cm off the back wall").

### L3 — Effects: placement changes light and air

**Light is already done and is the template.** `ppfdField.ts` builds a dense canopy grid from
placed fixtures plus catalog PPFD maps, marks every cell `derived` / `estimated`, and refuses to
invent light outside a fixture's measured footprint ("that fixture contributes 0 there and the gap
is flagged, not filled"). Move a lamp, the field moves. That is precisely the behaviour wanted for
air, and the honesty conventions are already established.

**Airflow: what is honestly tractable.**

Not CFD. Never CFD. A tent is a turbulent, obstacle-filled box and a real solve is both far beyond
this codebase and impossible to validate with one anemometer. Claiming a velocity field would be
the exact failure mode this project keeps digging out — a number that looks measured and is not.

What *is* defensible, and genuinely useful:

1. **Air changes per hour**, per space. `measured CFM ÷ tent volume`. Already have the CFM (from
   calibration, honestly labelled) and the volume (tent dimensions). One number, correct, actionable
   — "your 4×8 turns over 42×/hour". This alone is worth more than any visualisation.
2. **A flow axis.** Intake position → exhaust position defines a dominant direction. Placement is
   the whole input. Drawn as a direction, not a speed.
3. **Exchange shadow.** Volume far from the axis, or behind a large obstacle (a heater, a dense
   canopy), exchanges more slowly. Render as a *qualitative* low-exchange region — shaded, labelled
   "modelled, not measured", with no number attached.
4. **Placement warnings that are just geometry** and are the most useful output of all:
   intake and exhaust on the same wall (short-circuiting — the fan pulls the air it just pushed);
   a filter fouling an intake; a plant hard against an exhaust port; no intake at all on a tent
   running an exhaust fan.

Rule: **air gets a *shape*, not a *number*, except for ACH — which is arithmetic, not a model.**

---

## 4. Slices

| # | Slice | Depends on | Risk |
|---|---|---|---|
| **S1** | Instances table + migrate the four fans, byte-identical | — | **Medium** — touches the airflow path |
| **S2** | Kill `CFM_SPECS`; airflow iterates instances | S1 | Medium |
| **S3** | Add/remove a device, with the three tiers | S1 | Low |
| **S4** | Placement record; RigScene renders from data | S1 | Medium — 36 literals to port |
| **S5** | Placement editor (list-with-numbers first, drag second) | S4 | Low |
| **S6** | Plants placed like everything else | S4 | Low |
| **S7** | ACH per space | S2 | Low — pure arithmetic |
| **S8** | Flow axis + placement warnings | S4, S7 | Low |
| **S9** | Exchange shadow in the twin | S8 | Medium |

**Recommended order: S1 → S2 → S7 → S3.** That sequence delivers a real number (air changes per
hour) and unlimited fans without touching the twin at all. The twin work (S4-S6, S9) is the larger
and more visible half, but it is not what unblocks the model.

---

## 5. Rules

1. **Migrate before extending.** The four fans become four rows with identical behaviour, proven by
   a before/after snapshot diff of every airflow entity, *before* a fifth is possible.
2. **Never render a control for a device that has none.** Tier is not decoration (§2).
3. **Placement is an operator statement, not a measurement.** Nothing derived from it may be stamped
   as measured — the `ppfdField` convention, applied to air.
4. **ACH is arithmetic; everything else about air is a shape.** No velocity numbers.
5. **A calibration belongs to a fan instance, not a position.** Move a fan to another port and its
   curve is no longer valid — the run changed. Placement change must invalidate, or at minimum
   flag, the curve. This is the same "stability treated as correctness" trap as the frozen probe
   and the flat curve.

---

## 6. Open decisions for the operator

1. **Twin editing or list editing first?** Recommendation: **list first.** It is a tenth of the work,
   it is usable on a phone, and it makes the twin work a pure rendering job afterwards.
2. **How far does air go?** Recommendation: **stop at S8** (ACH, axis, warnings). S9's shaded
   exchange regions look impressive and are the hardest to keep honest.
3. **Do "known" (uncontrolled) devices earn their keep?** Recommendation: **yes** — an unplugged
   oscillating fan still moves air, costs nothing, and occupies space the flow model needs.
4. **Rooms as first-class, or tents only?** `space.room_id` already exists. Recommendation: defer
   until tents work; a room is just a bigger box with the same model.
