import assert from "node:assert/strict";
import { buildCloneLightDesk, headerSfLabel } from "./lightViewModel";

assert.equal(headerSfLabel({ sfOn: true, sfBrightness: 80 }), "SF1000 ON");
assert.equal(headerSfLabel({ sfOn: true, sfBrightness: 0 }), "SF1000 ON · 0%");
assert.equal(headerSfLabel({ sfOn: false, sfBrightness: 0 }), "SF1000 OFF");
assert.equal(headerSfLabel({ sfOn: true, sfBrightness: null }), "SF1000 ON");

function mockBus(map: Record<string, { state?: string; num?: number; attrs?: Record<string, unknown> }>) {
  return {
    state: (id: string, fb = "—") => map[id]?.state ?? fb,
    num: (id: string, fb = NaN) => (map[id]?.num != null ? map[id]!.num! : fb),
    entity: (id: string) =>
      map[id] ? { attributes: map[id].attrs ?? {} } : undefined,
  };
}

const followOk = buildCloneLightDesk(
  mockBus({
    "light.dsc_hub_sf1000_dimmer": { state: "on", attrs: { brightness: 200 } },
    "select.dsc_hub_clone_photoperiod": { state: "Follow 4x8" },
    "time.dsc_hub_lights_on_time": { state: "06:00:00" },
    "sensor.dsc_clone_expected_light_hours": { num: 12, attrs: { honesty: "ok" } },
    "sensor.dsc_lights_on_today_2x4": { num: 4.5 },
    "sensor.dsc_lights_deviation_today": { num: -7.5 },
    "switch.dsc_hub_auto_photoperiod": { state: "on" },
    "switch.dsc_hub_manual_light_hold": { state: "off" },
  }),
);
assert.equal(followOk.followsMain, true);
assert.equal(followOk.scheduleValid, true);
assert.equal(followOk.headerLabel, "SF1000 ON");
assert.equal(followOk.sfBrightness, 78);
assert.equal(followOk.wantHours, 12);
assert.equal(followOk.gotHours, 4.5);

const followNoSchedule = buildCloneLightDesk(
  mockBus({
    "light.dsc_hub_sf1000_dimmer": { state: "on", attrs: { brightness: 0 } },
    "select.dsc_hub_clone_photoperiod": { state: "Follow 4x8" },
    "time.dsc_hub_lights_on_time": { state: "" },
    "sensor.dsc_clone_expected_light_hours": {
      num: 12,
      attrs: { honesty: "no schedule: main on-time unset" },
    },
  }),
);
assert.equal(followNoSchedule.scheduleValid, false);
assert.equal(followNoSchedule.headerLabel, "SF1000 ON · 0%");
assert.match(followNoSchedule.scheduleHonesty, /no schedule|unset/i);

const dateOnlyIsUnset = buildCloneLightDesk(
  mockBus({
    "light.dsc_hub_sf1000_dimmer": { state: "off" },
    "select.dsc_hub_clone_photoperiod": { state: "Follow 4x8" },
    "datetime.dsc_hub_lights_on_time": { state: "2026-08-29" },
    "time.dsc_hub_lights_on_time": { state: "" },
  }),
);
assert.equal(dateOnlyIsUnset.scheduleValid, false);

console.log("lightViewModel tests ok");
