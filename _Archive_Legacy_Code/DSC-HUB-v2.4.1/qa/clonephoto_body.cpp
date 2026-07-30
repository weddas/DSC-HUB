if (id(boot_resume_pending)) return;    // waiting on resume prompt
if (id(emergency_failsafe_active)) return;  // trip handler owns the light
if (id(ha_takeover_active)) { id(light_ramp_state) = 0; return; }  // you own the light
if (!id(clone_active)) {                // 2x4 Off: apply_clone_mode already darked it
  id(clone_lights_on) = false;
  id(light_ramp_state) = 0;
  return;
}
if (!id(auto_photoperiod_enabled)) { id(light_ramp_state) = 0; return; }

// v2.4.1 · LATCH FIX: v2.4 stamped a blanket 15.5s write-guard
// here on EVERY 15s tick — so the guard was permanently live
// whenever the schedule was armed, an external SF1000 change
// (HA slider / dial) could never latch Manual Light Hold, and
// the ramp silently overwrote it on the next tick. That is the
// v2.2 "lights fight me from HA" bug back from the dead. The
// guard is now stamped per-WRITE (2s), immediately before each
// light call — device writes still never self-latch, and the
// ~13s gap between ticks is where an external touch is heard
// and latches the hold as designed.

// Resolve the window source
int dur, on_m;
if (id(clone_photo_follow)) {
  dur  = id(main_active) ? id(stage_light_hours) : 0;   // following an Off 4x8 = dark
  on_m = id(lights_on_time).hour * 60 + id(lights_on_time).minute;
} else {
  dur  = id(clone_light_hours);
  on_m = id(clone_lights_on_time).hour * 60 + id(clone_lights_on_time).minute;
}

if (dur <= 0) {                        // dark mode / following an Off or Dry 4x8
  if (id(manual_light_hold)) {         // explicit user hold wins;
    id(light_ramp_state) = 0;          // no window = no self-heal,
    id(light_current_pct) = id(light_sf1000).remote_values.is_on()   // clear via HA switch
        ? id(light_sf1000).remote_values.get_brightness() * 100.0f : 0.0f;
    return;
  }
  id(light_write_guard_until) = millis() + 2000;   // our write
  id(light_sf1000).turn_off().perform();
  id(clone_lights_on) = false;
  id(light_ramp_state) = 0;
  id(light_current_pct) = 0.0f;
  return;
}

auto now = id(sntp_time).now();
if (!now.is_valid()) now = id(grow_time).now();
if (!now.is_valid()) return;           // no clock yet -> leave the light

// Seconds-resolution clock for a smooth ramp
float cur  = now.hour * 60.0f + now.minute + now.second / 60.0f;
float window   = dur * 60.0f;
float since_on = fmodf(cur - on_m + 1440.0f, 1440.0f);   // handles midnight wrap
bool was_on = id(clone_lights_on);
bool on = since_on < window;
id(clone_lights_on) = on;

// MANUAL LIGHT HOLD: the schedule keeps ticking (so the display
// and countdowns stay honest) but the device does NOT touch the
// light. SELF-HEALS at the CLONE lights-off boundary: a daytime
// tweak resumes the schedule overnight, so the dark window is
// always enforced from the next cycle onward — no herm trap.
if (id(manual_light_hold)) {
  if (was_on && !on) {
    id(manual_light_hold) = false;
    ESP_LOGI("photoperiod", "Clone lights-off boundary -> manual light hold released, schedule resumes");
    // fall through: the !on branch below turns the light off now
  } else {
    id(light_ramp_state) = 0;
    id(light_current_pct) = id(light_sf1000).remote_values.is_on()
        ? id(light_sf1000).remote_values.get_brightness() * 100.0f : 0.0f;
    return;
  }
}

if (!on) {
  id(light_write_guard_until) = millis() + 2000;   // our write
  id(light_sf1000).turn_off().perform();
  id(light_ramp_state) = 0;
  id(light_current_pct) = 0.0f;
  return;
}

float target = (float) id(local_target_sf1000);          // the "X%"
float rise   = (float) id(sunrise_minutes);              // the "Y min"
float fall   = (float) id(sunset_minutes);
if (rise + fall > window && (rise + fall) > 0.0f) {      // never overlap
  float k = window / (rise + fall);
  rise *= k; fall *= k;
}

float to_off = window - since_on;
float pct; int ramp;
if (rise > 0.0f && since_on < rise)    { pct = target * (since_on / rise); ramp = 1; }
else if (fall > 0.0f && to_off < fall) { pct = target * (to_off / fall);   ramp = 2; }
else                                   { pct = target;                     ramp = 0; }
id(light_ramp_state)  = ramp;
id(light_current_pct) = pct;

if (pct >= 0.5f) {
  id(light_write_guard_until) = millis() + 2000;   // our write
  auto l = id(light_sf1000).turn_on();
  l.set_brightness(pct / 100.0f);
  // Glide between 15s updates while ramping so it looks continuous
  l.set_transition_length(ramp != 0 ? 14000 : 1000);
  l.perform();
} else {
  id(light_write_guard_until) = millis() + 2000;   // our write
  id(light_sf1000).turn_off().perform();
}

