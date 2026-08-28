# Relationship audit — DSC-HUB 7.1

**Date:** 2026-08-27  
**Scope:** Object graph only — plants, pots, hubs, tents, lights, appliances, sensors, Zigbee placements, clone/mother, Brain compose records. Not DEVICE-AUDIT (seats/IPs), ZIGBEE-AUDIT (z2m join), WORKFLOW-AUDIT (operator flows), or INPUT-REPLICATION (same field two places).  
**Brain:** `http://192.168.86.48:8787/` (`.30` is not the Brain). Health `7.1.0` / surface `7.1.0` / expected FW `7.0.0.0`.  
**Safety:** Read-only. Did not Commit plant, Apply network, fire demand, OTA, permit-join, or change live tent. pot3 left OOS.

**Verdict:** The graph is **not operator-honest.** Canonical links are split across three plant stores, two in-service SoTs, and hardcoded firmware maps. Live instance has **zero seated plants**, but Compose, pot helpers, and tent cockpits still imply tents, veg stages, a 2×4 light, and a pot3 draft.

---

## 1. ER one-pager (canonical)

```text
                    ┌─────────────┐
                    │  Tent *     │  logical only — no table
                    │  main=4×8   │  clone=2×4  unassigned
                    └──────┬──────┘
           optional        │         implied (no FK)
     pot.recipe.tent       │         hub serves BOTH
     pot helper tent       │         SF1000 treated as 2×4 light (BUG)
                    ┌──────┴──────┐
                    │             │
              ┌─────▼─────┐ ┌─────▼──────┐
              │ Hub 1     │ │ Light 0..1 │  hub SF1000 — no tent/plant FK
              │ inventory │ │            │  Compose light_fixture helper is dead
              └─────┬─────┘ └────────────┘
                    │ demand OID (code map, not extra)
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼────┐ ┌───▼────┐ ┌───▼─────┐
    │Sonoff   │ │ AC *   │ │ Mister *│  * demand switch only; no inventory seat
    │heater   │ │        │ │         │
    │heatmat  │ └────────┘ └─────────┘
    │hum/dehum│
    └─────────┘

  Plant identity is THREE records, not one:

  ┌──────────────────┐  1:1 seat_id   ┌─────────────┐  0..1 pot#  ┌─────────────────┐
  │ SQLite roster    │◄──────────────►│ Pot seat    │◄───────────►│ Roster slot[8]  │
  │ (canonical seat) │                │ inventory   │             │ settings JSON   │
  │ PK = potN        │                │ PK = potN   │             │ PK = slot 1..8  │
  └────────┬─────────┘                └──────┬──────┘             └────────┬────────┘
           │                                 │                             │
           │ mirrors (partial)               │ in_service (brain)          │ tent as "4x8"/"2x4"
           ▼                                 ▼                             ▼
  ┌──────────────────┐                ┌─────────────┐             ┌─────────────────┐
  │ Compose helpers  │                │ Hub FW      │             │ Compose draft   │
  │ potN_plant_name  │                │ potN_in_svc │             │ singleton       │
  │ potN_tent        │                │ (2nd SoT)   │             │ strain/tent/pot │
  └──────────────────┘                └─────────────┘             └─────────────────┘

  Zigbee: friendly_name ──settings.zigbee_placements──► placement label
                         ──inventory.extra.placement──► same map (optional)
          Device list is MQTT-live only — not a persisted node.

  Mother / clone plant: NOT A RELATIONSHIP. `select.dsc_hub_clone_mode=Mother`
  is a 2×4 lighting preset. No parent_plant / cut_from / mother_id column exists.
```

### Cardinality and FK owner

| Edge | Cardinality | Required? | FK owner | Notes |
|---|---|---|---|---|
| Plant (SQLite) → Pot | 0..1 : 1 | Optional | `roster.seat_id` = `potN` | Empty pot is legal. PK *is* the pot — a plant cannot exist off-seat here. |
| Roster slot → Pot | 0..1 : 0..1 | Optional | `slots[i].pot` = `"1"`..`"4"` \| `"none"` | Parallel stock list. Tent stored as UI label `4x8`/`2x4`. |
| Roster slot → Plant | 0..1 informal | Optional | Strain/nickname match, not an id | `find_roster_slot_for_strain` — collision-prone. |
| Pot → Tent | 0..1 : 1 | Optional | `recipe.tent` (SQLite) **or** `input_select.dsc_potN_tent` | Dual writers. Internal id `main`/`clone`. |
| Compose draft → Tent / Pot | 1 : 0..1 | Draft only | helpers `dsc_build_tent`, `dsc_build_assign_pot` | Not a committed plant. |
| Hub → Tent | none | — | — | One hub, two tents. `select.dsc_hub_priority_tent` is a chase hint, not a placement. |
| Light → Tent / Plant | none | — | — | SF1000 is hub-owned. Compose `dsc_light_fixture` never written to recipe. |
| Appliance → Hub demand | 1 : 1 (code) | Required for Sonoffs | `DEMAND_TO_SEAT` / `SEAT_DEMAND_ENTITY` | **Not** stored on `inventory.extra`. |
| Appliance → Tent | none | — | — | Room appliances chase priority tent. Heatmat is root-wide. |
| Sensor (hub) → Tent | implicit | Required for climate | firmware object_id | `tent_*` = 4×8, `clone_*` = 2×4, `room_*` = room. No placement row. |
| Sensor (pot) → Pot | 1 : 1 | Required | Native API seat | pot4 live with null probe values. |
| Zigbee device → Placement | 0..1 | Optional | `zigbee_placements` JSON + `inventory.extra` | Unplaced devices stay in `_device_states` only. |
| Mother plant → Clone | **missing** | — | — | No column. Veg-on-2×4 automates `clone_mode=Mother`. |

`tent_id()` (`stage_model.py`) maps unknown spellings to **`main`**, not `unassigned`. That is a silent FK rewrite.

---

## 2. Live instance (2026-08-27, `.48`)

APIs: `GET /roster`, `GET /fleet`, `GET /fleet/computed`, `GET /settings`, `GET /settings/zigbee/devices`.  
`GET /compose` and `GET /control` are **SPA HTML shells**, not graph dumps. Compose lives in `settings.compose_helpers_json`. Control lives in `fleet.hub.values.controls`.

### Counts

| Class | Count | Notes |
|---|---|---|
| Seated plants (SQLite `/roster`) | **0** | `{"roster":[]}` |
| Occupied roster slots | **0** | `sensor.dsc_plant_roster_summary` = `0 occupied` |
| Orphan seated plants (plant, no pot) | **0** | Impossible on SQLite PK; slots also empty |
| Ghost helper plants | **1** | `text.dsc_probe1_plant_name` helper still `Amnesia Blue` (computed overwrites display to `""`) |
| Leftover Compose drafts | **1** | Northern Lights / QA Dummy (pot3 test) → assign pot **3**, tent **2x4**, sprout **2026-07-09** |
| Empty in-service pots | **3** | pot1, pot2, pot4 |
| OOS pots | **1** | **pot3 `in_service=false`** — confirmed, not changed |
| Hub without tent FK | **1** | Structural |
| Tent assignment without a plant | **1** | pot1 helper/computed tent = `clone` |
| Zigbee devices / placements | **0 / 0** | `{"devices":[]}`, canopy `{}`, no `zigbee_placements` key |
| Appliances with persisted `demand_oid` | **0** | Four Sonoffs use code maps; AC + mister have demand switches and **no seat** |
| Sensors without placement row | **all Zigbee (0)** + **all inventory extras empty** | Hub onboard sensors are implicit only |

### Object table

| Object | Live id | Links the store actually has | UI/API implication | Honest? |
|---|---|---|---|---|
| pot1 | inventory in_service **true**, online, FW 7.0.0.0 | No SQLite plant. Helper tent `clone`. Helper name `Amnesia Blue` (hidden by computed). Stage synthesized `veg`. | 2×4 cockpit can count this as a seat. Overview P1 chip. | **No** |
| pot2 | in_service true, online | No plant. Tent `unassigned`. Moisture 19.4% / 18.5°C. | Empty seat + Overview gauge. | Partial |
| pot3 | in_service **false**, **absent** from `fleet.pots` | Helpers cleared. Compose draft still aimed here. | Compose “assign pot 3”. Seat graph defaults missing `in_service` to ON. | **No** (draft + SPA default) |
| pot4 | in_service true, online | No plant. Tent `unassigned`. moisture/temp/pH **null**. | Shown as a live empty seat. | Probe graph broken |
| Hub | in_service true, 10.42.0.10 | No tent FK. `grow_stage=Off`, `clone_mode=Custom`, `priority_tent=2x4 Clone`. FW pot1–4 `in_service` **all off**. | Climate/Overview speak two tents. | Dual in-service |
| 4×8 tent | logical `main` | No plant. Window **open**. SF1000 on, brightness **1**. Expected light hours **0** (stage Off). | Photo chip from 4×8 window. | OK empty |
| 2×4 tent | logical `clone` | No plant. Window **open**. Clone T/RH **= room** (23.9°C / ~61–63%). Expected clone light **18 h** (Custom → `clone_light_hours`). | Cockpit uses **SF1000** as 2×4 lamp. | **No** |
| Heatmat | seat + demand ON + relay ON | No plant. All `mat_vote_pot_*` **off**. | Running chip. | Demand without a plant graph |
| Heater / hum / dehum | seats in_service, demand off | Code demand map only | Climate demand toggles | OK |
| AC / mister | **no inventory row** | Hub demand + capacity-offline **on** | Climate shows Cool / C-Hum | Demand without appliance node |
| Light | hub SF1000 | No tent/plant/fixture recipe | Compose light picker; 2×4 “SF1000 ON” | **Wrong parent** |
| Zigbee | empty | `zigbee_permit_join=true` in settings | Settings device list empty | Join flag leftover (not toggled this pass) |
| Mother/clone | none | No parent edge | `clone_mode` options include Mother | Label ≠ relationship |

pot3 **is OOS** on inventory and omitted from `fleet.pots`. This pass did not put it in service.

---

## 3. Honesty (store vs UI/API)

### UI implies a link the store does not have

1. **Compose draft after revert.** Helpers still hold Northern Lights / QA Dummy / pot **3** / 2×4 / sprout 2026-07-09 / expected stage Late (Push) Vegetative day 48. `/roster` is empty. Acceptance 7.1.1 #5 said the dummy was reverted; the draft was not cleared.
2. **pot1 → 2×4.** Computed `input_select.dsc_probe1_tent=clone` with empty plant. `potsInTent("clone")` + tent cockpit `${seats.length} plants` will count a phantom 2×4 plant.
3. **Empty pots are `veg`.** `computed_ops` does `stage = row.get("stage") or "veg"` when there is no roster row. Seat editors and Want fallbacks see a growth stage that no plant owns.
4. **2×4 lamp = SF1000.** `LivePages.tsx` (`lit = tent === "clone" ? cloneLampOn : windowOpen`), `PlantExtra.tsx` (clone awake = SF1000 on), `dash_computed._dark_period_violation`, `sensor.dsc_lights_on_today_2x4` (SF1000 runtime). The 4×8 fixture is the 2×4 photoperiod parent.
5. **Apply-to-tent copy** (`GrowPages.tsx`) says “the hub rejected it” on helper write failure. Tent is a pot helper / recipe field, not a hub entity.
6. **Overview Root & tank** always renders P1–P4 names and moisture gauges, including OOS pot3 and plant-less seats.
7. **`clone_mode=Mother`** (and Compose automation that writes it for veg-on-2×4) reads as a mother plant. There is no mother record.

### Store has a link the UI hides or splits

1. **SQLite roster is the seated-plant SoT** (`GET /roster`). SPA plant chrome prefers `sensor.dsc_plant_roster_summary` slots (JSON) + pot helpers. Two lists can diverge on tent vocabulary (`main`/`clone` vs `4x8`/`2x4`) and on occupancy.
2. **Inventory `in_service` is correct on `GET /settings` and `to_hass_states`** (pot3 off). `fleetToHass` / `useBrain.tsx` merges **only** `/fleet/computed` extras, which **omit** `input_boolean.dsc_potN_in_service`. `isPotInService` then defaults missing to **ON** — pot3 re-enters the seat graph.
3. **Hub firmware `switch.dsc_hub_potN_in_service` is a second SoT**, live **all off**, while brain inventory has pot1/2/4 on. Mat votes follow the hub switches (all off) while the mat demand is still ON.
4. **`binary_sensor.dsc_reduced_kit` is off** while attributes.planned_oos = `AC, Clone mister, POT3, Tank`. Planned OOS does not flip the binary (`dash_computed._reduced_kit` uses unexpected `offline` only).
5. **Appliance demand OIDs** exist only in Python maps. Settings placement/function extras are empty on every seat. UI can PATCH `extra.placement`; nothing on the four Sonoffs points at `heater_demand` / `grow_mat_demand` / …

### Lighting / tent / stage from the wrong parent

| Derived fact | Should parent | Actual parent | Live effect |
|---|---|---|---|
| 2×4 lamp on / hours / dark violation | 2×4 window or a 2×4 fixture | `light.dsc_hub_sf1000_dimmer` | 2×4 story is the 4×8 dimmer |
| Hub `grow_stage` after assign | 4×8 plants (or explicit) | **First** SQLite plant with `recipe.tent==clone` | 2×4 veg overwrites 4×8 stage (`apply_clone_tent_automation`) |
| 2×4 mode for veg | Operator / mother record | `CLONE_MODE_BY_FAMILY["veg"]="Mother"` | Any 2×4 veg becomes Mother lighting |
| Compose expected stage | Strain type (auto vs photo) | `expected_stage(days)` **without** `auto=` in `computed_ops` | Photo OK today; auto would lie |
| `apply_climate_want` | Assigned pot stage | Hardcoded `stage="veg"` | Want bands ignore recipe stage |
| Clone T/RH | 2×4 placement | Live values **equal room** (23.9°C) | Two “tents” may be one sensor; no placement row to prove otherwise |
| Priority tent | Plants in tents | Hub select `2x4 Clone` with **zero** 2×4 plants | Room appliances chase an empty tent |

---

## 4. Defects

### P0

| ID | Defect | Why it is P0 |
|---|---|---|
| REL-P0-1 | **Three plant records, none authoritative in the UI.** SQLite `roster` (empty) vs `plant_roster_slots_json` (empty) vs compose helpers (draft + pot1 ghost). Commit/assign/retire dual-writes; revert cleared SQLite but not the draft. | Operator cannot tell which object is the plant. pot3 draft invites a second Commit onto an OOS seat. |
| REL-P0-2 | **SPA seat graph never sees inventory `in_service`.** `fleetToHass` drops `to_hass_states`; extras omit the booleans; `isPotInService` defaults ON. | pot3 is OOS in the store and still in the plant/tent UI. |
| REL-P0-3 | **2×4 photoperiod is parented to the 4×8 SF1000.** Cockpit, PlantExtra awake/asleep, clone dark-period, `lights_on_today_2x4`. | Lighting/tent/stage derived from the wrong parent — the brief’s honesty fail. |

### P1

| ID | Defect |
|---|---|
| REL-P1-1 | Dual in-service SoT: hub FW pot switches all **off**, brain inventory pot1/2/4 **on**. Mat demand ON, votes off, no plants. |
| REL-P1-2 | Empty pots emit `growth_stage=veg`; pot1 tent=`clone` with no plant → 2×4 counts a phantom seat. |
| REL-P1-3 | No mother/clone plant edge. Automation first-wins among 2×4 recipes and writes hub `grow_stage` + `clone_mode=Mother` for veg. |
| REL-P1-4 | `tent_id()` unknown → `main`. Slot tent is `4x8`/`2x4`; pot helper is `main`/`clone`. Apply-tent error blames the hub. |
| REL-P1-5 | No persisted appliance `demand_oid`. AC/mister are demand-only (no seat). `reduced_kit` binary ignores planned OOS listed in its own attributes. |
| REL-P1-6 | Zigbee graph is empty (0 devices, 0 placements) while `zigbee_permit_join=true`. Inventory `extra.placement` unused on every seat. |

### P2

| ID | Defect |
|---|---|
| REL-P2-1 | Compose `dsc_light_fixture` / vessel are not stored on the seated plant. |
| REL-P2-2 | `computed_ops` expected-stage ignores autoflower; `apply_climate_want` ignores pot stage. |
| REL-P2-3 | pot4 in service with null probe values — seat exists, sensor graph does not. |
| REL-P2-4 | Clone T/RH numerically equals room; no placement record. |
| REL-P2-5 | `GET /compose` and `GET /control` are not APIs — graph must be assembled from `/roster` + `/settings` + `/fleet`. |
| REL-P2-6 | Overview Root strip ignores in_service and roster emptiness (also noted as moisture-band mismatch in FOLLOWUPS). |

---

## 5. Sources

| Layer | Files |
|---|---|
| Schema | `brain/dsc_brain/settings.py` (`roster`, `fleet_inventory.extra_json`) |
| Helpers / slots | `brain/dsc_brain/compose_store.py` |
| Commit / assign / retire | `brain/dsc_brain/compose_ops.py` |
| Tent / stage / Mother map | `brain/dsc_brain/stage_model.py` |
| Clone automation + pot edit persist | `brain/dsc_brain/control_ops.py` |
| Demand → Sonoff | `brain/dsc_brain/appliance_driver.py`, `api.py` `SEAT_DEMAND_ENTITY` |
| Hub entity maps | `brain/dsc_brain/hub_controls.py` |
| Zigbee placement | `brain/dsc_brain/zigbee_mqtt.py` |
| Computed plant/tent/stage | `brain/dsc_brain/computed_ops.py`, `dash_computed.py` |
| SPA merge | `frontend/src/hooks/useBrain.tsx` `fleetToHass` |
| Seat / tent UI | `seatModel.ts`, `ComposePlant.tsx`, `GrowPages.tsx`, `LivePages.tsx`, `PlantExtra.tsx`, `OverviewPage.tsx`, `ClimatePage.tsx` |

Live dumps (agent temp, not in repo): `/health`, `/roster`, `/fleet`, `/fleet/computed`, `/settings`, `/settings/zigbee/devices`, `/fleet?include_hass=true`.

---

## 6. Operator-honest?

**No.** The store’s seated-plant set is empty and pot3 is honestly OOS on inventory. The UI still offers a pot3 Compose draft, a 2×4 tent assignment on pot1, veg stages on empty pots, 18 h of 2×4 light from the 4×8 dimmer, and a seat graph that cannot see OOS. Until one plant record, one in-service bit, and honest tent/light parents exist, the object graph is not safe to operate by eye.
