if (id(boot_resume_pending)) return;   // waiting on resume prompt
if (id(emergency_failsafe_active)) return;
if (id(sensor_fault_active)) return;   // watchdog has control
if (id(ha_takeover_active)) return;    // v2.3: you hold the wheel

float rh   = id(humidity_sensor).state;
float temp = id(temp_sensor).state;
float vpd  = id(vpd_sensor).state;
int  strat = id(control_strategy_idx);

// ===== v2.2 · AUX SENSOR READS (soft-fault aware) =====
// room_ok / clone_ok false -> every v2.2 feature that leans on
// that sensor silently reverts to v2.1 behaviour. Never less
// safe than blind.
float rm_t = id(room_temp).state,  rm_h = id(room_rh).state;
float cl_t = id(clone_temp).state, cl_h = id(clone_rh).state;
bool room_ok  = !id(room_fault_active)  && !isnan(rm_t) && !isnan(rm_h);
bool clone_ok = !id(clone_fault_active) && !isnan(cl_t) && !isnan(cl_h);

// Resolve clone targets: Follow 4x8 reads the LIVE main targets
// so a stage change re-aims the clone tent too.
// v2.4.1: the clone VPD ceiling resolves here too — the clone
// humidifier rung is VPD-aware now.
float c_tt, c_rmin, c_rmax, c_vmax;
if (id(clone_mode_idx) == 0) {
  c_tt = id(stage_temp_target);
  c_rmin = fminf(id(stage_rh_min), id(stage_rh_max));      // QA guard:
  c_rmax = fmaxf(id(stage_rh_min), id(stage_rh_max));      // bands are
  c_vmax = fmaxf(id(stage_vpd_min), id(stage_vpd_max));    // normalised
} else {                                                    // everywhere
  c_tt = id(clone_temp_target);
  c_rmin = fminf(id(clone_rh_min), id(clone_rh_max));
  c_rmax = fmaxf(id(clone_rh_min), id(clone_rh_max));
  c_vmax = fmaxf(id(clone_vpd_min), id(clone_vpd_max));
}

// Router status flags (feed the screensaver verbs at the bottom)
bool heat_reuse = false;
int  borrow = 0;            // 0=idle, else clone-path draw %
int  borrow_why = 0;        // 1=heat, 2=humidity
bool borrow_capped = false;
int  clone_need = 15;       // clone tent's own exchange request
// v2.4.1: root-zone runaway flag — set by the mat rung, read by
// the fan router (flush the 2x4) and the status line.
bool rz_runaway = false;

// ============ APPLIANCE ESCALATION LADDER ============
// Fans are attempt #1 (curve below reacts within 10s). Appliances
// are attempt #2: demanded only when the condition PERSISTS
// despite the fans. Timers reset the moment the condition clears
// (and whenever the failsafe / watchdog engages — see those).
{
  uint32_t nowms = millis();

  // ===== v2.3 · PRIORITY ARBITRATION ===================
  // The ROOM appliances (dehumidifier/humidifier/heater/AC) are
  // shared — they can only condition the room to ONE tent's
  // target at a time. Pick which tent they serve:
  //   only one active  -> that tent (priority by definition)
  //   both active      -> the Priority Tent select
  //   both off         -> nobody (rungs gated by *_live below)
  // The GROW MAT is deliberately NOT in this arbitration — it
  // lives in the 2x4 and is that tent's own local heat lever,
  // so it always tracks the clone tent regardless of priority.
  bool arb_main;
  if      (id(main_active) && !id(clone_active)) arb_main = true;
  else if (!id(main_active) && id(clone_active)) arb_main = false;
  else                                           arb_main = id(priority_tent_main);
  // Never arbitrate on a blind sensor: clone falls back to main.
  if (!arb_main && !clone_ok) arb_main = true;
  bool room_live = id(main_active) || id(clone_active);

  // Arbitrated tent's sensor + target + normalised RH band.
  // v2.4.1: + the arbitrated VPD and its ceiling, so the
  // humidifier rung sees the SAME variable the strategy chases.
  float a_t, a_rh, a_tgt, a_rhi, a_rlo, a_vpd, a_vmax;
  if (arb_main) {
    a_t = temp; a_rh = rh; a_tgt = id(stage_temp_target);
    a_rhi = fmaxf(id(stage_rh_max), id(stage_rh_min));   // QA: normalise
    a_rlo = fminf(id(stage_rh_max), id(stage_rh_min));
    a_vpd = vpd;
    a_vmax = fmaxf(id(stage_vpd_min), id(stage_vpd_max));
  } else {
    a_t = cl_t; a_rh = cl_h; a_tgt = c_tt;
    a_rhi = c_rmax; a_rlo = c_rmin;                      // already normalised
    a_vpd = id(clone_vpd).state;
    a_vmax = c_vmax;
  }

  // held-for tracker: returns how long (ms) cond has been true
  auto track = [nowms](bool cond, uint32_t &since) -> uint32_t {
    if (cond && since == 0) since = nowms;
    if (!cond) since = 0;
    return cond ? (nowms - since) : 0;
  };

  // ===== v2.2 · REALITY GATES (v2.3: room is the source) =====
  // "Fans had N minutes" only makes sense if the ROOM air the
  // appliances condition can actually move the arbitrated tent.
  // If not, waiting is theatre — cut the persistence window.
  uint32_t dehum_wait = 300000, hum_wait = 120000;
  uint32_t heat_wait  = 300000, ac_wait  = 300000;
  if (room_ok && rm_h >= a_rhi)
    dehum_wait = 60000;   // room air can't pull RH below ceiling
  if (room_ok && rm_t >= a_tgt + 1.0f)
    ac_wait = 60000;      // venting can't cool below room temp
  {
    bool moist_src = room_ok && rm_h > a_rh + 5.0f;   // room can wet it
    bool warm_src  = room_ok && rm_t > a_t  + 1.0f;   // room can warm it
    if (!moist_src) hum_wait  = 60000;
    if (!warm_src)  heat_wait = 120000;
  }
  // v2.4: stash the gated windows so the Fire Countdown
  // sensors publish honest numbers (gates move tick-to-tick).
  id(cur_dehum_wait) = dehum_wait; id(cur_hum_wait) = hum_wait;
  id(cur_heat_wait)  = heat_wait;  id(cur_ac_wait)  = ac_wait;

  // Too humid -> DEHUMIDIFIER (fans had their window, RH still high)
  if (room_live && id(dehumidifier_auto_enabled) && !isnan(a_rh)) {
    // QA: compressor protection — never restart within 3 min.
    if (track(a_rh > a_rhi + 3.0f, id(esc_humid_since)) > dehum_wait && !id(dehumidifier_demand).state
        && (nowms - id(dehum_off_at)) > 180000) {
      id(dehumidifier_demand).turn_on();
      ESP_LOGI("ladder", "%s RH %.0f%% > %.0f%% for %us -> DEHUMIDIFIER", arb_main?"4x8":"2x4", a_rh, a_rhi, (unsigned)(dehum_wait / 1000));
    }
    if (id(dehumidifier_demand).state && a_rh < a_rhi - 2.0f) {
      id(dehumidifier_demand).turn_off();
      id(dehum_off_at) = nowms;
    }
  }
  // Too dry -> HUMIDIFIER (v2.4: min off-time — no rapid re-fire)
  // v2.4.1 · VPD-AWARE: waiting on the RH floor alone let VPD
  // sail over its ceiling with the humidifier silent (19 Jul:
  // VPD 0.94/0.99 over ceiling, RH 63%, no response). Under the
  // VPD strategy "too dry" is EITHER the RH floor breach OR the
  // arbitrated VPD over its ceiling. Release requires BOTH
  // healthy (RH back above floor+2 AND VPD at/under ceiling) so
  // the rung can't chatter between two half-recovered signals.
  // QA guard: at high temp VPD can top its ceiling while RH is
  // AT/OVER its own ceiling (hot air holds more water). That is
  // a cooling problem, not a humidity one — the VPD leg only
  // arms while RH is safely under the ceiling (below the
  // dehumidifier's own release point, rhi-2, so the two rungs'
  // hysteresis bands can never overlap) and never while the
  // dehumidifier demand is live. No humidifier/dehumidifier war.
  if (room_live && id(humidifier_auto_enabled) && !isnan(a_rh)) {
    bool vpd_dry = (strat == 0) && !isnan(a_vpd) && a_vpd > a_vmax + 0.05f
                   && a_rh < a_rhi - 2.0f && !id(dehumidifier_demand).state;
    bool too_dry = (a_rh < a_rlo - 2.0f) || vpd_dry;
    if (track(too_dry, id(esc_dry_since)) > hum_wait && !id(humidifier_demand).state
        && (nowms - id(hum_off_at)) > (uint32_t) id(hum_min_off_s) * 1000) {
      id(humidifier_demand).turn_on();
      ESP_LOGI("ladder", "%s RH %.0f%% (floor %.0f%%) VPD %.2f (ceil %.2f) for %us -> HUMIDIFIER",
               arb_main?"4x8":"2x4", a_rh, a_rlo, a_vpd, a_vmax, (unsigned)(hum_wait / 1000));
    }
    if (id(humidifier_demand).state
        && ((a_rh > a_rlo + 2.0f && (strat != 0 || isnan(a_vpd) || a_vpd <= a_vmax))
            || a_rh >= a_rhi)) {
      id(humidifier_demand).turn_off();
      id(hum_off_at) = nowms;
    }
  }
  // ===== v2.2 · CLONE RUNG: clone tent too dry -> CLONE HUMIDIFIER
  // 2x4-local; runs on the CLONE sensor + targets whenever the
  // clone tent is active (independent of priority). Soft fault
  // clears it (watchdog) — never guess wet.
  // v2.4 · SHORT-CYCLING FIX: the v2.3 release point (c_rmin+2)
  // gave a 4% total band -> rapid on/off cycling + Scribe spam.
  // Release is now c_rmin + Clone Hum Hysteresis (default +6),
  // and a min off-time blocks immediate re-fire. Both runtime-
  // tunable — retune for the micro-mister without a reflash.
  // v2.4.1 · VPD-AWARE: same fix as the room rung — unrooted
  // clones transpire on VPD, not RH. Fire on the RH floor OR
  // clone VPD over its ceiling; release needs both healthy.
  if (id(clone_active) && id(clone_hum_auto_enabled) && clone_ok) {
    float c_vpd = id(clone_vpd).state;
    bool c_vpd_dry = !isnan(c_vpd) && c_vpd > c_vmax + 0.05f
                     && cl_h < c_rmax - 2.0f          // QA: same
                     && !id(dehumidifier_demand).state; // no-war guard
    bool c_too_dry = (cl_h < c_rmin - 2.0f) || c_vpd_dry;
    if (track(c_too_dry, id(esc_clone_dry_since)) > 120000 && !id(clone_hum_demand).state
        && (nowms - id(clone_hum_off_at)) > (uint32_t) id(clone_hum_min_off_s) * 1000) {
      id(clone_hum_demand).turn_on();
      ESP_LOGI("ladder", "Clone RH %.0f%% (floor %.0f%%) VPD %.2f (ceil %.2f) for 2min -> CLONE HUMIDIFIER",
               cl_h, c_rmin, c_vpd, c_vmax);
    }
    if (id(clone_hum_demand).state
        && ((cl_h > c_rmin + id(clone_hum_hyst) && (isnan(c_vpd) || c_vpd <= c_vmax))
            || cl_h >= c_rmax)) {
      id(clone_hum_demand).turn_off();
      id(clone_hum_off_at) = nowms;
    }
  }
  // ===== v2.4 · GROW MAT — CLOSED-LOOP ROOT-ZONE HEAT =====
  // The mat is a 2x4-local lever (v2.3), but its plate
  // thermostat regulates the mat SURFACE — a 22C setpoint sat
  // the root zone at 16-19C. The soil probes are the only
  // trustworthy sense points, so demand tracks ROOT-ZONE temp
  // (via HA): energise below Mat Root-Zone Low, cut at Mat
  // Root-Zone High (the band IS the hysteresis), with a min
  // off-time — soil is a slow thermal mass, no cycling.
  // v2.4.1 · MULTI-PROBE + RUNAWAY:
  //   * ALL FOUR pots are sensed now (POT1-only missed the cold
  //     POT4 on 19 Jul). Heat decisions use the COLDEST
  //     plausible probe — the mat must keep every pot warm.
  //   * PLAUSIBILITY FILTER (5-45C): a faulted probe (POT3
  //     reads a flat 0.0C) is ignored, so it can never peg the
  //     mat on — the exact blocker that parked min() in v2.4.
  //   * RUNAWAY: hottest plausible probe >= High + 1C -> mat
  //     OFF immediately and the fan router flushes the 2x4
  //     with cooler room air. Fans handle runaway heat;
  //     the mat only ever ADDS heat.
  // FALLBACK CHAIN (never control on a blind sensor):
  //   any probe live -> closed-loop on the root zone
  //   all stale      -> v2.3 clone-AIR rung (clone sensor)
  //   fully blind    -> mat OFF (never guess root heat)
  if (id(clone_active) && id(growmat_auto_enabled)) {
    float rz_min = NAN, rz_max = NAN;
    {
      // v2.4.1 · SOURCE SELECT (per pot): ESP-NOW first — it is
      // local and survives HA loss — falling to the HA mirror
      // when that pot's direct link is stale (>150s = 2.5
      // missed 60s sends). Both sources feed the same
      // plausibility filter below, so a faulted probe is
      // ignored regardless of which path carried it.
      auto pick = [nowms](float now_v, uint32_t now_at, float ha_v) -> float {
        bool fresh = now_at != 0 && (nowms - now_at) < 150000;
        return fresh ? now_v : ha_v;
      };
      float probes[4] = {
        pick(id(rz_now_1).state, id(rz_now_1_at), id(rootzone_temp).state),
        pick(id(rz_now_2).state, id(rz_now_2_at), id(rootzone_temp_2).state),
        pick(id(rz_now_3).state, id(rz_now_3_at), id(rootzone_temp_3).state),
        pick(id(rz_now_4).state, id(rz_now_4_at), id(rootzone_temp_4).state) };
      for (int i = 0; i < 4; i++) {
        float p = probes[i];
        if (isnan(p) || p <= 5.0f || p >= 45.0f) continue;   // faulted/implausible
        if (isnan(rz_min) || p < rz_min) rz_min = p;
        if (isnan(rz_max) || p > rz_max) rz_max = p;
      }
    }
    bool rz_ok = !id(rootzone_fault_active) && !isnan(rz_min);
    bool mat_free = (nowms - id(mat_off_at)) > (uint32_t) id(mat_min_off_s) * 1000;
    if (rz_ok) {
      float rz_lo = fminf(id(mat_rz_low), id(mat_rz_high));   // QA guard:
      float rz_hi = fmaxf(id(mat_rz_low), id(mat_rz_high));   // band normalised
      // RUNAWAY first: overheating roots outrank everything —
      // a pot cooking at High+1 is a faster kill than a cold
      // one, so the flush wins even if another pot reads cold.
      if (rz_max >= rz_hi + 1.0f) {
        rz_runaway = true;
        id(esc_cold_since) = 0;
        if (id(growmat_demand).state) {
          id(growmat_demand).turn_off();
          id(mat_off_at) = nowms;
          ESP_LOGW("ladder", "Root zone %.1fC >= %.1fC RUNAWAY -> mat OFF, flushing 2x4 with room air", rz_max, rz_hi + 1.0f);
        }
      }
      if (!rz_runaway) {
        if (track(rz_min < rz_lo, id(esc_cold_since)) > 60000 && !id(growmat_demand).state && mat_free) {
          id(growmat_demand).turn_on();
          ESP_LOGI("ladder", "Root zone (coldest pot) %.1fC < %.1fC -> GROW MAT (closed-loop)", rz_min, rz_lo);
        }
        if (id(growmat_demand).state && rz_min >= rz_hi) {
          id(growmat_demand).turn_off();
          id(mat_off_at) = nowms;
          ESP_LOGI("ladder", "Root zone %.1fC >= %.1fC -> mat off (min-off %ds)", rz_min, rz_hi, id(mat_min_off_s));
        }
      }
    } else if (clone_ok) {
      // v2.3 fallback: clone-AIR rung (probes stale / HA down)
      if (track(cl_t < c_tt - 1.0f, id(esc_cold_since)) > 60000 && !id(growmat_demand).state && mat_free) {
        id(growmat_demand).turn_on();
        ESP_LOGI("ladder", "Clone %.1fC < %.1fC -> GROW MAT (air fallback - probes blind)", cl_t, c_tt - 1.0f);
      }
      if (id(growmat_demand).state && cl_t >= c_tt) {
        id(growmat_demand).turn_off();
        id(mat_off_at) = nowms;
      }
    } else if (id(growmat_demand).state) {
      id(growmat_demand).turn_off();   // fully blind -> mat off
      id(mat_off_at) = nowms;
    }
  } else if (!id(clone_active) && id(growmat_demand).state) {
    id(growmat_demand).turn_off();   // 2x4 off -> mat off
    id(mat_off_at) = nowms;
  }
  // Too cold -> 750W HEATER (room appliance; serves the arbitrated
  // tent. Note: NOT gated behind the mat any more — the mat now
  // heats a different tent, so the heater escalates on its own
  // deep-cold timer against whichever tent owns the room.)
  // v2.4: min off-time (default 60s) — resistive load, so this
  // is relay hygiene, not compressor protection.
  if (room_live && id(heater_auto_enabled) && !isnan(a_t)) {
    if (track(a_t < a_tgt - 2.0f, id(esc_deep_cold_since)) > heat_wait && !id(heater_demand).state
        && (nowms - id(heater_off_at)) > (uint32_t) id(heater_min_off_s) * 1000) {
      id(heater_demand).turn_on();
      ESP_LOGI("ladder", "%s %.1fC < %.1fC for %us -> HEATER", arb_main?"4x8":"2x4", a_t, a_tgt - 2.0f, (unsigned)(heat_wait / 1000));
    }
    if (id(heater_demand).state && a_t >= a_tgt - 0.5f) {
      id(heater_demand).turn_off();
      id(heater_off_at) = nowms;
    }
  }
  // Too hot -> AC (arbitrated tent held over target+2 despite fans)
  // v2.4.1 · FANS-FIRST GATE: "despite fans" was assumed, never
  // enforced — on 19 Jul the AC fired for the 2x4 while the
  // exchange fans idled. The AC may now only fire when the
  // arbitrated tent's fan lever is demonstrably saturated:
  //   4x8 -> OUT exhaust already driven to >= 80%
  //   2x4 -> the router reports the exchange path saturated
  //          (clone_fan_saturated: cooling flush requested AND
  //          the cap/budget ceiling already reached)
  // ...OR fans are physically useless (room air at/above the
  // target+1 — venting can't cool below source temp; same
  // physics as the reality gate that shortens ac_wait), OR the
  // room sensor is blind (never safer-than-blind), OR the fan
  // curve isn't running (manual/standby — ladder still signals).
  if (room_live && id(ac_auto_enabled) && !isnan(a_t)) {
    bool fans_useless = !room_ok || rm_t >= a_tgt + 1.0f;
    bool fans_maxed = arb_main
        ? (id(fan_exhaust_out).state && id(fan_exhaust_out).speed >= 80)
        : id(clone_fan_saturated);
    if (track(a_t > a_tgt + 2.0f, id(esc_hot_since)) > ac_wait && !id(ac_demand).state
        && (fans_maxed || fans_useless || !id(full_auto_mode))
        && (nowms - id(ac_off_at)) > 180000) {   // QA: compressor protection
      id(ac_demand).turn_on();
      ESP_LOGI("ladder", "%s %.1fC > %.1fC for %us (fans %s) -> AC", arb_main?"4x8":"2x4", a_t, a_tgt + 2.0f,
               (unsigned)(ac_wait / 1000), fans_useless ? "useless (room warm)" : "saturated");
    }
    if (id(ac_demand).state && a_t <= a_tgt + 0.5f) {
      id(ac_demand).turn_off();
      id(ac_off_at) = nowms;
    }
  }
}

// ================= TWO-AXIS FAN CONTROL =================
// OUT   (fan_exhaust_out)   -> outside: heat, RH overflow, fresh air
// RECIRC(fan_exhaust_recirc)-> room:    VPD/RH air movement, hold heat
// Blending the two IS the damper. Intakes slave to total exhaust.
int out = 0, recirc = 0;
bool rh_overflow = false;
if (id(full_auto_mode) && !isnan(temp)) {
  float rmax = fmaxf(id(stage_rh_max), id(stage_rh_min));   // QA guard

  // ---- RECIRC: move air past canopy, feed moisture to the room ----
  recirc = 20;   // baseline circulation, always on
  if (strat == 0 && !isnan(vpd)) {                 // VPD strategy
    float vmin = fminf(id(stage_vpd_min), id(stage_vpd_max));   // QA guard
    float vmax = fmaxf(id(stage_vpd_min), id(stage_vpd_max));
    if (vpd < vmin - 0.30f) recirc = 100;          // way too humid
    else if (vpd < vmin - 0.20f) recirc = 80;
    else if (vpd < vmin - 0.10f) recirc = 60;
    else if (vpd < vmin) recirc = 45;              // slightly humid
    else if (vpd <= vmax) recirc = 30;             // in band
    else recirc = 20;                              // too dry -> ease off
  } else if (strat == 2 && !isnan(rh)) {           // Humidity strategy
    if (rh > rmax + 15.0f) recirc = 100;
    else if (rh > rmax + 10.0f) recirc = 80;
    else if (rh > rmax + 5.0f) recirc = 60;
    else if (rh > rmax) recirc = 45;
    else recirc = 25;
  } else {                                         // Temperature strategy
    recirc = 25;   // OUT does the heat work; RECIRC just circulates
  }

  // ---- OUT: expel heat / moisture overflow / fresh air ----
  // Fresh-air floor: no CO2 rig, so makeup air is the only CO2
  // top-up. Never let the loop fully close.
  out = 15;
  float target = id(stage_temp_target);
  if (temp >= target + 3.0f) out = 100;            // dump heat hard
  else if (temp >= target + 2.0f) out = 80;
  else if (temp >= target + 1.0f) out = 60;
  else if (temp >= target) out = 40;
  // Moisture overflow: RH way over ceiling -> vent outside NOW,
  // in parallel with the ladder deciding about the dehumidifier.
  if (!isnan(rh) && rh > rmax + 5.0f) {
    if (out < 70) out = 70;
    rh_overflow = true;
  }

  // ===== v2.2 · HEAT REUSE: where should shed heat GO? =====
  // Lights are heaters. If the tent must shed heat while the
  // SYSTEM is heat-poor (heating rungs live, or the room is
  // cold) and the room can still absorb it, route the shed
  // through RECIRC instead of dumping it outside — the main
  // intake pulls that warmth straight back as makeup air.
  // Moisture overflow always wins: recirculated moisture just
  // comes back; it has to physically leave the building.
  if (out > 15 && !rh_overflow && room_ok
      && rm_t < temp - 1.0f                       // room can absorb
      && (id(heater_demand).state || id(growmat_demand).state
          || rm_t < target - 2.0f)) {             // system heat-poor
    int shed = out;
    if (recirc < shed) recirc = shed;             // shed to the room
    out = 15 + shed / 4;                          // fresh-air floor + trickle
    heat_reuse = true;
  }

  // ===== v2.3 · HEATER NO-EXTRACTION INTERLOCK ==========
  // Heat is expensive. If we're actively running the 750W heater
  // (or the mat), there's no sense blowing that bought heat out
  // the wall. Hard rule: whenever heater demand is live, OUT
  // drops to the fresh-air floor and the air routes RECIRC —
  // circulate and hold, don't vent. Moisture overflow still
  // wins (RH that high MUST leave the building), and the >35C
  // emergency purge is upstream of this whole block, so safety
  // is never trapped behind a closed damper.
  if (id(heater_demand).state && !rh_overflow) {
    if (recirc < out) recirc = out;   // keep canopy air moving inside
    if (recirc < 25)  recirc = 25;    // never fully still while heating
    out = 15;                          // fresh-air floor only
    heat_reuse = true;                 // (drives the status verb)
  }

  // ===== v2.2 · INTAKE ROUTER =============================
  // Negative-pressure budget preserved from v2.1: each intake
  // used to run at 0.7 * mean(exhaust); the router now PLACES
  // that same total across the two paths instead of mirroring.
  int budget = (int)(((out + recirc) / 2.0f) * 0.7f) * 2;

  // -- Clone protection cap: air exchange is what flushes a
  //    clone tent out of band. The 4x8 may only draw through
  //    the 2x4 up to this ceiling. QA: the cap is CONTINUOUS —
  //    a hard step made the router oscillate +-15% whenever a
  //    reading hovered on the boundary. Linear ramps have no
  //    boundary to oscillate around.
  //      RH:   20% at/below floor -> 40% at floor+3 -> 100% at floor+8
  //      Cold: 30% at target-1.5C -> 100% at target-0.5C
  //    Unknown clone env -> 25%.
  // v2.4.1: when the 2x4 ITSELF is overheating (air > target+2
  //    or root-zone runaway), the RH leg of the cap is relaxed
  //    to a 50% floor — moisture protection must not block
  //    emergency cooling of the same tent it protects. The
  //    cold leg stays: never room-flush a COLD clone tent.
  int cap = 100;
  if (clone_ok) {
    float cap_rh = 100.0f;
    if      (cl_h <= c_rmin)        cap_rh = 20.0f;
    else if (cl_h <  c_rmin + 3.0f) cap_rh = 20.0f + (cl_h - c_rmin) * (20.0f / 3.0f);
    else if (cl_h <  c_rmin + 8.0f) cap_rh = 40.0f + (cl_h - c_rmin - 3.0f) * (60.0f / 5.0f);
    bool clone_emergency_cool = (cl_t > c_tt + 2.0f) || rz_runaway;
    if (clone_emergency_cool && cap_rh < 50.0f) cap_rh = 50.0f;
    float cap_cold = 100.0f;
    if      (cl_t <= c_tt - 1.5f)   cap_cold = 30.0f;
    else if (cl_t <  c_tt - 0.5f)   cap_cold = 30.0f + (cl_t - (c_tt - 1.5f)) * 70.0f;
    cap = (int) fminf(cap_rh, cap_cold);
  } else cap = 25;

  // -- Clone tent's OWN need (mini-controller, source-gated:
  //    only ramp exchange when room air actually helps) --
  //    v2.3: an Off 2x4 draws only an anti-stagnation trickle.
  //    v2.4.1: FAN-FIRST COOLING ESCALATION — the exchange is
  //    graded on how far over target the 2x4 is (50/75/100%),
  //    so the fans demonstrably try before the AC rung may
  //    fire (its fans-first gate reads the saturation flag
  //    stashed below). Root-zone runaway flushes at >= 70%.
  //    Overheat outranks the dry-hold: heat kills clones
  //    faster than dry air does.
  if (clone_ok && id(clone_active)) {
    bool c_hot   = cl_t > c_tt + 1.0f;
    bool c_humid = cl_h > c_rmax + 3.0f;
    bool c_dry   = cl_h < c_rmin - 2.0f;
    if      (c_humid && room_ok && rm_h < cl_h - 3.0f) clone_need = 60; // room air can dry it
    else if (c_hot   && room_ok && rm_t < cl_t - 1.0f) clone_need = 50; // room air can cool it
    else if (c_humid || c_hot)                          clone_need = 30; // exchange helps a little
    if (c_dry) clone_need = 10;                  // hold the moisture in
    if (room_ok && rm_t < cl_t - 0.5f) {         // graded cooling (beats dry-hold)
      if      (cl_t > c_tt + 3.0f) { if (clone_need < 100) clone_need = 100; }
      else if (cl_t > c_tt + 2.0f) { if (clone_need < 75)  clone_need = 75;  }
    }
    if (rz_runaway && room_ok && rm_t < cl_t) {  // pots cooking -> flush
      if (clone_need < 70) clone_need = 70;
    }
  } else if (!id(clone_active)) {
    clone_need = 8;                              // 2x4 Off -> trickle only
  }

  // -- Donor selection for the 4x8: is warm/humid 2x4 air the
  //    better source than room air? (The whole point of the
  //    daisy-chain: a separate mini-lung on the counter-cycle.)
  //    v2.3: borrowing needs an ACTIVE 4x8 to serve AND an
  //    ACTIVE 2x4 to donate — an Off tent is neither.
  if (clone_ok && id(main_active) && id(clone_active)) {
    bool tent_needs_heat  = temp < target - 1.0f;
    bool tent_needs_humid = (!isnan(rh) && rh < id(stage_rh_min) - 2.0f)
                         || (strat == 0 && !isnan(vpd) && vpd > id(stage_vpd_max) + 0.1f);
    bool clone_warmer  = !room_ok || (cl_t > rm_t + 1.0f);
    bool clone_moister = !room_ok || (cl_h > rm_h + 5.0f);
    if      (tent_needs_heat  && cl_t > temp + 0.5f && clone_warmer)  { borrow = 60; borrow_why = 1; }
    else if (tent_needs_humid && cl_h > rh   + 5.0f && clone_moister) { borrow = 50; borrow_why = 2; }
    if (borrow > cap) { borrow = cap; borrow_capped = true; }
  }

  int clone_i = clone_need > borrow ? clone_need : borrow;
  // QA: the protection cap is UNCONDITIONAL. Flushing a cold
  // clone tent with 60% room air chills clones faster than damp
  // air harms them — the cap always wins, own-need included.
  // (v2.4.1: the RH leg self-relaxes for emergency cooling of
  // the 2x4 itself, computed above — the COLD leg never does.)
  if (clone_i > cap) clone_i = cap;

  // QA: CHAIN SERVICE. The 2x4 only exchanges what the 4x8
  // exhausts (daisy-chain). If the clone flush wants more than
  // the current budget carries AND venting is climate-safe for
  // the 4x8 (at/above target, no heating demand, not reusing
  // heat), lift OUT gently — never past 45%.
  // v2.4.1: a 2x4 in emergency cooling (air > target+2 or
  // root-zone runaway) may lift even with the 4x8 under target
  // — shed-heat economy never outranks cooking clones — and
  // the lift ceiling rises to 60%. Heater/mat guards stay.
  {
    bool clone_overheat = clone_ok && id(clone_active)
                          && ((cl_t > c_tt + 2.0f) || rz_runaway);
    if (clone_i > budget && (temp >= target || clone_overheat) && !heat_reuse
        && (!room_ok || rm_t < temp + 0.5f)      // QA: never lift OUT to
        && !id(heater_demand).state              // suck a hotter room in
        && !id(growmat_demand).state) {
      int lift_max = clone_overheat ? 60 : 45;
      int lift = 15 + (clone_i - budget) / 2;
      if (lift > lift_max) lift = lift_max;
      if (out < lift) out = lift;
      budget = (int)(((out + recirc) / 2.0f) * 0.7f) * 2;
    }
  }

  // QA: CHAIN SERVICE (borrow leg). Drawing conditioned 2x4 air
  // requires the 4x8 to exhaust the same volume — via RECIRC,
  // so the borrowed heat/moisture loops through the ROOM and
  // back, instead of being thrown outside. Bounded at 70%.
  if (borrow > 0 && clone_i > budget) {
    int r2 = (int) ceilf(clone_i / 0.7f) - out;
    if (r2 > 70) r2 = 70;
    if (recirc < r2) recirc = r2;
    budget = (int)(((out + recirc) / 2.0f) * 0.7f) * 2;
  }

  // QA: NEGATIVE PRESSURE IS A HARD INVARIANT. The intakes may
  // never place more air than the exhaust budget carries — a
  // positive tent leaks smell through every seam.
  if (clone_i > budget) clone_i = budget;
  // v2.4.1: stash "the 2x4 exchange path is saturated" for the
  // AC fans-first gate: a cooling flush was requested AND the
  // router has given it everything the cap/budget allow. The
  // ladder reads this NEXT tick (10s later) — by the time the
  // AC's 60-300s persistence window has elapsed, this flag is
  // long since honest.
  id(clone_fan_saturated) = (clone_need >= 50)
      && (clone_i >= cap - 2 || clone_i >= budget - 2 || clone_i >= 95);
  int main_i  = budget - clone_i;
  if (main_i > 100) {                       // main saturated: overflow
    int spill = main_i - 100;               // to the clone path, but
    int room_left = cap - clone_i;          // NEVER past the cap
    if (room_left > 0) clone_i += spill < room_left ? spill : room_left;
    main_i = 100;
  }
  if (main_i < 0) main_i = 0;

  // v2.3: an Off tent draws only an anti-stagnation trickle so
  // the room's conditioned air isn't wasted on an empty tent —
  // this is the "energy goes to the tent that's ON" win.
  // Clamping DOWN is always negative-pressure-safe (less air in).
  if (!id(clone_active) && clone_i > 8) clone_i = 8;
  if (!id(main_active)  && main_i  > 8) main_i  = 8;

  // Slew-limit both paths (±15%/10s tick): the router must
  // never oscillate between donors on sensor jitter.
  auto slew = [](int cur, int tgt) {
    int d = tgt - cur;
    if (d >  15) d =  15;
    if (d < -15) d = -15;
    return cur + d;
  };
  clone_i = slew(id(cur_intake_clone), clone_i);
  main_i  = slew(id(cur_intake_main),  main_i);
  // v2.4.1 QA: negative pressure is a HARD invariant even
  // MID-SLEW. A budget collapse (e.g. the heater interlock
  // cutting OUT while the intakes were still ramping) could
  // otherwise leave the slewed intakes above the new budget
  // for a tick or two. Trimming DOWN bypasses the slew — less
  // air in is always safe; fresh-air leg is trimmed first so
  // an active clone flush survives.
  {
    int over = (clone_i + main_i) - budget;
    if (over > 0) {
      int cut = over < main_i ? over : main_i;
      main_i -= cut; over -= cut;
      if (over > 0) clone_i = clone_i > over ? clone_i - over : 0;
    }
  }
  id(cur_intake_clone) = clone_i;
  id(cur_intake_main)  = main_i;

  auto co = id(fan_exhaust_out).make_call();    co.set_state(out > 0);     co.set_speed(out);     co.perform();
  auto cr = id(fan_exhaust_recirc).make_call(); cr.set_state(recirc > 0);  cr.set_speed(recirc);  cr.perform();
  auto ci = id(fan_intake_main).make_call();    ci.set_state(main_i > 0);  ci.set_speed(main_i);  ci.perform();
  auto cc = id(fan_intake_clone).make_call();   cc.set_state(clone_i > 0); cc.set_speed(clone_i); cc.perform();
}

// ---- Build the live "Running:" status line (screensaver) ----
{
  std::string s;
  auto add = [&s](const char *p) { if (!s.empty()) s += ",   "; s += p; };
  char b[72];
  if (id(ha_takeover_active)) {
    add("MANUAL TAKEOVER - you own every output (safety still armed)");
  } else if (!id(full_auto_mode)) {
    add(id(local_manual_mode).state ? "Manual control - holding set fan levels"
                                    : "Standby - HA driving outputs directly");
  } else if (isnan(temp)) {
    add("Waiting on climate sensor");
  } else {
    // v2.3: say who's live + who the room is serving
    if (!id(main_active) && !id(clone_active)) add("both tents Off - idle");
    else if (!id(main_active))                 add("4x8 Off - room serving 2x4 clone");
    else if (!id(clone_active))                add("2x4 Off - room serving 4x8");
    else add(id(priority_tent_main) ? "both live - 4x8 has room priority"
                                    : "both live - 2x4 has room priority");
    if (id(dehumidifier_demand).state)      add("Dehumidifier called in");
    else if (id(humidifier_demand).state)   add("Humidifier called in");
    if (id(ac_demand).state)                add("AC cooling (max 20C)");
    if (id(heater_demand).state)            add("heater assisting (venting held - reusing heat)");
    else if (id(growmat_demand).state)      add("grow mat warming 2x4 roots");
    // v2.4.1: root-zone runaway is loud — it's the fans' job now
    if (rz_runaway)          add("ROOT ZONE HOT - mat cut, flushing 2x4 with room air");
    // Air routing (which way is the air going, and why)
    if (rh_overflow)         add("venting moisture outside (room dehumidifier maxed)");
    else if (heat_reuse)     add("recycling tent heat into the room");
    else if (out >= 60)      add("venting outside to dump heat");
    else if (recirc >= 60)   add("recirculating hard through the room");
    else if (recirc > 25)    add("moving air, holding heat in room");
    else                     add("gentle recirculation + fresh-air trickle");
    // v2.2: donor selection — say WHICH air the 4x8 is drinking
    if (borrow_why == 1)      add(borrow_capped ? "drawing warm 2x4 air (capped - protecting clones)"
                                                : "drawing warm 2x4 air into the 4x8");
    else if (borrow_why == 2) add(borrow_capped ? "borrowing 2x4 humidity (capped - protecting clones)"
                                                : "borrowing 2x4 humidity for the 4x8");
    if (clone_need >= 50)     add("flushing clone tent with room air");
    else if (clone_need <= 10 && clone_ok) add("holding clone tent moisture in");
    add("maintaining internal negative pressure");
    if (strat == 0 && !isnan(vpd)) {
      if (vpd < id(stage_vpd_min))      { snprintf(b, sizeof(b), "raising VPD to target: %.1f", id(stage_vpd_min)); add(b); }
      else if (vpd > id(stage_vpd_max)) { snprintf(b, sizeof(b), "lowering VPD to target: %.1f", id(stage_vpd_max)); add(b); }
      else                              { snprintf(b, sizeof(b), "VPD %.2f inside %.1f-%.1f band", vpd, id(stage_vpd_min), id(stage_vpd_max)); add(b); }
    } else if (strat == 1) {
      float tt = id(stage_temp_target);
      if (temp >= tt + 1.0f)      { snprintf(b, sizeof(b), "cooling toward %.0fC (venting out)", tt); add(b); }
      else if (temp <= tt - 1.0f) { add("trying to maintain heat (recirculating)"); }
      else                        { snprintf(b, sizeof(b), "holding temp at %.0fC", tt); add(b); }
    } else if (!isnan(rh)) {
      if (rh > id(stage_rh_max))      { snprintf(b, sizeof(b), "pulling RH down to %.0f%%", id(stage_rh_max)); add(b); }
      else if (rh < id(stage_rh_min)) { snprintf(b, sizeof(b), "conserving RH above %.0f%%", id(stage_rh_min)); add(b); }
      else                            { snprintf(b, sizeof(b), "RH %.0f%% inside band", rh); add(b); }
    }
  }
  // v2.2: clone tent voice (v2.4: LED demand retired — the
  // SF1000 ramp verbs below ARE the clone light's voice now)
  if (id(clone_hum_demand).state)     add("clone humidifier called in");
  if (id(room_fault_active))          add("room sensor offline (v2.1 fallback)");
  if (id(clone_fault_active))         add("clone sensor offline (v2.1 fallback)");
  if (id(rootzone_fault_active) && id(growmat_auto_enabled))
                                      add("root-zone probes offline (mat on air fallback)");
  if (id(manual_light_hold))          add("SF1000 held manually (resumes at clone lights-off)");
  if (id(light_ramp_state) == 1)      { snprintf(b, sizeof(b), "clone sunrise ramp at %d%%", (int) id(light_current_pct)); add(b); }
  else if (id(light_ramp_state) == 2) { snprintf(b, sizeof(b), "clone sunset dimming at %d%%", (int) id(light_current_pct)); add(b); }
  id(auto_status_text) = s;
}

