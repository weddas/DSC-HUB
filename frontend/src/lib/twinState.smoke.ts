/**
 * The twin's honesty contract, checked without a browser: every scene instance resolves
 * to a status, an unbound one never claims a value, and a what-if override is always
 * flagged. Run with `npx tsx src/lib/twinState.smoke.ts`.
 */
import assert from "node:assert/strict";
import {
  SCENE_NODES,
  applyOverrides,
  bindingIsLive,
  fanPeriodSec,
  withBindings,
  type TwinEntityProbe,
  type TwinState,
  type TwinZone,
} from "./twinState";
import type { ZoneReading } from "../hooks/useZones";

function reading(entityId: string, value: number, unit: string, available = true, stale = false): ZoneReading {
  return { entityId, value, unit, stale, available, tone: available ? "ok" : "muted" };
}

function zone(id: TwinZone["id"], label: string, available = true): TwinZone {
  return {
    id,
    label,
    role: "grow",
    stage: "veg",
    temp: reading(`sensor.dsc_${id}_temp`, 24.2, "°C", available),
    rh: reading(`sensor.dsc_${id}_rh`, 58, "%", available),
    vpd: reading(`sensor.dsc_${id}_vpd`, 1.1, "kPa", available),
    dewPoint: 15.4,
    tempDelta: 0,
    rhDelta: 0,
    tone: available ? "ok" : "muted",
    lightHours: 18,
  } as TwinZone;
}

const base: TwinState = {
  zones: { main: zone("main", "4×8"), clone: zone("clone", "2×4"), room: zone("room", "Room", false) },
  fans: [
    { id: "intake_main", label: "Intake 4×8", pct: 40, cfm: 120, cfmEntity: "sensor.cfm_a", pctEntity: "sensor.dsc_fan_intake_main_pct", live: true, simulated: false },
    { id: "intake_2x4", label: "Intake 2×4", pct: NaN, cfm: NaN, cfmEntity: "sensor.cfm_b", pctEntity: "sensor.dsc_fan_intake_2x4_pct", live: false, simulated: false },
    { id: "exhaust_room", label: "Exhaust → room", pct: 55, cfm: 300, cfmEntity: "sensor.cfm_c", pctEntity: "sensor.dsc_fan_exhaust_room_pct", live: true, simulated: false },
    { id: "exhaust_outside", label: "Exhaust → outside", pct: NaN, cfm: NaN, cfmEntity: "sensor.cfm_d", pctEntity: "sensor.dsc_fan_exhaust_outside_pct", live: false, simulated: false },
  ],
  lamps: [{ zone: "main", entityId: "light.dsc_lamp_main", label: "Twin SF1000", on: true, brightnessPct: 80, available: true, simulated: false }],
  appliances: [{ id: "heater", zone: "main", label: "Heater", state: "on", entityId: "switch.dsc_heater", simulated: false }],
  plants: [],
  cascadeCfm: NaN,
  cascadeEntity: "sensor.dsc_cfm_cascade_2x4_allocated",
  hubOnline: true,
  panelOnline: false,
  panelKnown: false,
  simulated: false,
  bindings: {},
  bindingSummary: { total: 0, live: 0, simulated: 0, held: 0, noData: 0, missing: 0, unbound: 0 },
  updatedAt: 0,
};

// The brain knows the fans and the lamp; it has never heard of the 2×4 intake sensor.
const known = new Set([
  "sensor.dsc_main_temp",
  "sensor.dsc_clone_temp",
  "sensor.dsc_fan_intake_main_pct",
  "sensor.dsc_fan_exhaust_room_pct",
  "sensor.dsc_fan_exhaust_outside_pct",
  "light.dsc_lamp_main",
  "switch.dsc_heater",
]);
const probe: TwinEntityProbe = {
  known: (id) => known.has(id),
  available: (id) => known.has(id),
  text: (id) => (known.has(id) ? "ok" : null),
};

const s = withBindings(base, probe);

// 1. Every declared instance resolves — no scene node may be silently absent.
for (const d of SCENE_NODES) assert.ok(s.bindings[d.id], `no binding resolved for ${d.id}`);
assert.equal(s.bindingSummary.total, SCENE_NODES.length);

// 2. An entity the brain never published is MISSING, not "off".
assert.equal(s.bindings.fanIntake2x4.status, "missing");
assert.equal(s.bindings.fanIntake2x4.value, null);
assert.equal(bindingIsLive(s.bindings.fanIntake2x4.status), false);

// 3. A reporting fan is live and quotes its own duty.
assert.equal(s.bindings.fanIntakeMain.status, "live");
assert.equal(s.bindings.fanIntakeMain.value, "40 %");

// 4. Scenery is unbound and never carries a value.
for (const id of ["tank", "cam4x8", "cam2x4", "filterOut", "ventPassive"]) {
  assert.equal(s.bindings[id].status, "unbound", `${id} should be unbound`);
  assert.equal(s.bindings[id].value, null);
  assert.equal(s.bindings[id].entityId, null);
  assert.ok(s.bindings[id].note.length > 0, `${id} should say why it is unbound`);
}

// 5. A zone with no reading is NO DATA / MISSING, never a borrowed number.
assert.ok(["no-data", "missing"].includes(s.bindings.room.status));
assert.equal(s.bindings.room.value, null);

// 6. A seat the fleet does not carry is unbound, not "offline".
assert.equal(s.bindings.panel.status, "unbound");

// 7. Appliances the kit does not have are unbound, not off.
assert.equal(s.bindings.dehum.status, "unbound");
assert.equal(s.bindings.heater.status, "live");

// 8. A what-if override is flagged everywhere it lands and never becomes "live".
const sim = withBindings(applyOverrides(base, { fans: { intake_main: 90 }, appliances: { heater: false } }), probe);
assert.equal(sim.simulated, true);
assert.equal(sim.bindings.fanIntakeMain.status, "simulated");
assert.equal(sim.bindings.fanIntakeMain.value, "90 %");
assert.equal(sim.bindings.heater.status, "simulated");
assert.ok(sim.bindings.heater.note.includes("not written"));

// 9. An override on a fan that is not reporting still reads simulated, never live.
const sim2 = withBindings(applyOverrides(base, { fans: { intake_2x4: 50 } }), probe);
assert.equal(sim2.bindings.fanIntake2x4.status, "simulated");

// 10. A held reading is held, not live and not missing.
const heldState = { ...base, zones: { ...base.zones, main: { ...base.zones.main, temp: reading("sensor.dsc_main_temp", 24.2, "°C", true, true) } } };
assert.equal(withBindings(heldState, probe).bindings.tent4x8.status, "held");

// 11. Fan spin period: stopped at zero, faster with duty (the plan's 2.2 s − duty × 1.9 s).
assert.equal(fanPeriodSec(0), null);
assert.equal(fanPeriodSec(NaN), null);
assert.ok((fanPeriodSec(100) ?? 9) < (fanPeriodSec(20) ?? 0));

console.log(`twinState smoke tests ok — ${s.bindingSummary.total} scene instances resolved`);
