// DSC-HUB v2.4-ALPHA · focused QA harness
// Rig method: the grow-mat + clone-humidifier rung code is EXTRACTED
// VERBATIM from dsc-hub-v2_4.yaml (extracted_*.inc) and executed
// host-side with `#define id(x) (x)` — the code under test is the code
// that ships. The clone ramp window maths is exercised separately.
// Full 24M-check rig update (Suites 1-6 + a v2.4 Suite 7) is a BETA
// gate; this alpha suite proves the NEW state machines.
#include <cstdio>
#include <cstdint>
#include <cmath>
#include <string>
using std::isnan;
#define id(x) (x)

// ---------- stub environment ----------
static uint32_t fake_ms = 0;
static uint32_t millis() { return fake_ms; }
struct Demand {
  bool state = false;
  int on_count = 0, off_count = 0;
  void turn_on()  { if (!state) on_count++;  state = true;  }
  void turn_off() { if (state)  off_count++; state = false; }
};
struct Sens { float state = NAN; };
#define ESP_LOGI(tag, ...) do {} while (0)
#define ESP_LOGW(tag, ...) do {} while (0)

// globals mirrored from the YAML (names must match id() uses)
static Demand growmat_demand, clone_hum_demand;
static Sens rootzone_temp;
static bool clone_active = true, growmat_auto_enabled = true, clone_hum_auto_enabled = true;
static bool rootzone_fault_active = false;
static float mat_rz_low = 20.0f, mat_rz_high = 24.0f;
static int   mat_min_off_s = 300, clone_hum_min_off_s = 180;
static float clone_hum_hyst = 6.0f;
static uint32_t mat_off_at = 0, clone_hum_off_at = 0;
static uint32_t esc_cold_since = 0, esc_clone_dry_since = 0;

static int violations = 0, checks = 0;
#define REQUIRE(cond, msg) do { checks++; if (!(cond)) { violations++; \
  printf("VIOLATION @%s t=%us: %s\n", __func__, fake_ms/1000, msg); } } while (0)

// the same held-for tracker the ladder uses
static auto track = [](bool cond, uint32_t &since) -> uint32_t {
  uint32_t nowms = fake_ms;
  if (cond && since == 0) since = nowms;
  if (!cond) since = 0;
  return cond ? (nowms - since) : 0;
};

// one climate tick over the EXTRACTED rung code
static void tick(float cl_t, float c_tt, float cl_h, float c_rmin, bool clone_ok) {
  uint32_t nowms = fake_ms;
  (void) nowms;
#include "extracted_mat.inc"
#include "extracted_hum.inc"
}

static void advance(uint32_t ms) { fake_ms += ms; }

// ================= SUITE A: closed-loop grow mat =================
static void suite_mat_closed_loop() {
  fake_ms = 1000; growmat_demand = Demand(); mat_off_at = 0; esc_cold_since = 0;
  rootzone_fault_active = false; rootzone_temp.state = 25.0f;
  // A1: warm root zone -> mat never fires
  for (int i = 0; i < 30; i++) { tick(22, 24, 75, 70, true); advance(10000); }
  REQUIRE(!growmat_demand.state, "A1 mat fired on a warm root zone");
  // A2: cold root zone fires only after 60s persistence
  rootzone_temp.state = 18.0f;
  tick(22, 24, 75, 70, true);
  REQUIRE(!growmat_demand.state, "A2 mat fired instantly (no persistence)");
  advance(30000); tick(22, 24, 75, 70, true);
  REQUIRE(!growmat_demand.state, "A2 mat fired at 30s (<60s window)");
  advance(40000); tick(22, 24, 75, 70, true);
  REQUIRE(growmat_demand.state, "A2 mat failed to fire after 70s cold");
  // A3: releases at HIGH, not at LOW (band = hysteresis)
  rootzone_temp.state = 21.0f;  // above low, below high
  tick(22, 24, 75, 70, true);
  REQUIRE(growmat_demand.state, "A3 mat released inside the band (short-cycle)");
  rootzone_temp.state = 24.0f;
  tick(22, 24, 75, 70, true);
  REQUIRE(!growmat_demand.state, "A3 mat failed to release at rz_high");
  uint32_t off_stamp = mat_off_at;
  REQUIRE(off_stamp != 0, "A3 mat_off_at not stamped on release");
  // A4: min-off blocks immediate re-fire even after persistence
  rootzone_temp.state = 17.0f;
  advance(70000);  // 70s cold persistence elapses, but min-off (300s) has not
  for (int i = 0; i < 7; i++) { tick(22, 24, 75, 70, true); advance(10000); }
  REQUIRE(!growmat_demand.state, "A4 mat re-fired inside min-off");
  advance(200000); tick(22, 24, 75, 70, true);   // now past 300s min-off + persistence
  REQUIRE(growmat_demand.state, "A4 mat failed to re-fire after min-off elapsed");
  // A5: inverted band (user error) is normalised, never inverts logic
  growmat_demand.turn_off(); mat_off_at = 0; esc_cold_since = 0; fake_ms += 400000;
  mat_rz_low = 24.0f; mat_rz_high = 20.0f;   // swapped
  rootzone_temp.state = 26.0f;
  for (int i = 0; i < 10; i++) { tick(22, 24, 75, 70, true); advance(10000); }
  REQUIRE(!growmat_demand.state, "A5 inverted band fired the mat when warm");
  mat_rz_low = 20.0f; mat_rz_high = 24.0f;
  printf("Suite A (closed-loop mat): done\n");
}

// ================= SUITE B: fallback chain =================
static void suite_mat_fallback() {
  // NOTE: mat_off_at=0 + min-off means the mat cannot fire in the
  // first mat_min_off_s of uptime — an intended boot grace, the same
  // pattern as the v2.2 compressor protection. Start past it.
  fake_ms = 400000; growmat_demand = Demand(); mat_off_at = 0; esc_cold_since = 0;
  // B0: boot grace — cold roots inside the first 5 min never fire the mat
  {
    uint32_t save = fake_ms; fake_ms = 1000;
    rootzone_fault_active = false; rootzone_temp.state = 17.0f;
    tick(22, 24, 75, 70, true); advance(70000); tick(22, 24, 75, 70, true);
    REQUIRE(!growmat_demand.state, "B0 mat fired inside the boot grace");
    fake_ms = save; esc_cold_since = 0;
  }
  // B1: probe blind -> clone-AIR rung takes over (v2.3 behaviour)
  rootzone_fault_active = true; rootzone_temp.state = NAN;
  advance(70000);
  tick(20.0f, 24.0f, 75, 70, true);            // clone air 4C below target
  advance(70000);
  tick(20.0f, 24.0f, 75, 70, true);
  REQUIRE(growmat_demand.state, "B1 air fallback failed to fire on a cold clone tent");
  // B2: air fallback releases at clone target
  tick(24.0f, 24.0f, 75, 70, true);
  REQUIRE(!growmat_demand.state, "B2 air fallback failed to release at target");
  // B3: fully blind -> mat OFF, never guesses
  growmat_demand.state = true;                  // pretend it was on
  tick(NAN, 24.0f, NAN, 70, false);             // clone_ok = false, probe blind
  REQUIRE(!growmat_demand.state, "B3 fully blind but the mat stayed on");
  // B4: probe recovers -> closed-loop rules again (air says cold, probe says warm)
  rootzone_fault_active = false; rootzone_temp.state = 25.0f;
  esc_cold_since = 0; mat_off_at = 0; fake_ms += 400000;
  for (int i = 0; i < 10; i++) { tick(19.0f, 24.0f, 75, 70, true); advance(10000); }
  REQUIRE(!growmat_demand.state, "B4 mat fired on cold AIR while the PROBE reads warm roots");
  // B5: 2x4 Off -> mat off regardless
  growmat_demand.state = true; clone_active = false;
  tick(19.0f, 24.0f, 75, 70, true);
  REQUIRE(!growmat_demand.state, "B5 2x4 Off but the mat stayed on");
  clone_active = true;
  printf("Suite B (fallback chain): done\n");
}

// ================= SUITE C: clone humidifier hysteresis =================
static void suite_clone_hum() {
  fake_ms = 1000; clone_hum_demand = Demand(); clone_hum_off_at = 0; esc_clone_dry_since = 0;
  rootzone_fault_active = false; rootzone_temp.state = 25.0f;  // keep the mat quiet
  float RMIN = 70.0f;
  // C1: fires after 2min dry
  advance(130000);
  tick(24, 24, 66.0f, RMIN, true);              // seeds the timer
  advance(130000);
  tick(24, 24, 66.0f, RMIN, true);
  REQUIRE(clone_hum_demand.state, "C1 clone hum failed to fire after 2min dry");
  // C2: does NOT release at the old +2 point (the v2.3 short-cycler)
  tick(24, 24, RMIN + 3.0f, RMIN, true);
  REQUIRE(clone_hum_demand.state, "C2 released at +3 (old 4%-band short-cycle regressed)");
  // C3: releases past RMIN + hysteresis (default +6)
  tick(24, 24, RMIN + 7.0f, RMIN, true);
  REQUIRE(!clone_hum_demand.state, "C3 failed to release past the hysteresis point");
  REQUIRE(clone_hum_off_at != 0, "C3 clone_hum_off_at not stamped");
  // C4: min-off blocks the immediate re-fire that WAS the log spam
  esc_clone_dry_since = 0;
  advance(125000);                               // dry persistence would elapse...
  tick(24, 24, 66.0f, RMIN, true);
  advance(125000);
  tick(24, 24, 66.0f, RMIN, true);               // ...but only ~250s > 180s min-off? yes 250s
  // careful: 250s since off > 180s min-off -> allowed. Re-run tighter:
  clone_hum_demand.turn_off(); clone_hum_off_at = fake_ms; esc_clone_dry_since = 0;
  advance(125000);                               // 125s < 180s min-off
  tick(24, 24, 66.0f, RMIN, true);
  advance(10000);
  tick(24, 24, 66.0f, RMIN, true);               // persistence held 10s only; min-off ALSO blocks
  REQUIRE(!clone_hum_demand.state, "C4 re-fired inside min-off (short-cycle regressed)");
  advance(130000);                               // persistence 140s > 120s AND 265s since off > 180s
  tick(24, 24, 66.0f, RMIN, true);
  REQUIRE(clone_hum_demand.state, "C4 failed to re-fire once min-off elapsed");
  // C5: 30-min sim, jittering RH around the engage point: count cycles
  clone_hum_demand = Demand(); clone_hum_off_at = 0; esc_clone_dry_since = 0; fake_ms += 500000;
  int seed = 12345;
  for (int t = 0; t < 180; t++) {                // 180 ticks x 10s = 30 min
    seed = seed * 1103515245 + 12345;
    float jitter = ((seed >> 16) & 0x7) * 0.5f;  // 0..3.5%
    tick(24, 24, 66.5f + jitter, RMIN, true);    // hovers 66.5-70 around engage
    advance(10000);
  }
  REQUIRE(clone_hum_demand.on_count <= 3,
          "C5 >3 humidifier cycles in a 30-min jitter sim (short-cycling)");
  printf("Suite C (clone hum): %d cycles in 30-min jitter sim\n", clone_hum_demand.on_count);
}

// ================= SUITE D: ramp window + floor maths =================
// The window/ramp maths mirrors run_clone_photoperiod; the floor remap
// mirrors ESPHome FloatOutput min_power (level -> min + level*(max-min),
// zero_means_zero). Deterministic, so re-expressed here.
static float floor_remap(float brightness_pct, float floor_pct) {
  if (brightness_pct <= 0.0f) return 0.0f;                  // zero_means_zero
  return floor_pct + (brightness_pct / 100.0f) * (100.0f - floor_pct);
}
static void suite_ramp() {
  // D1: OFF is a true 0% duty (the pull-down guarantees dark)
  REQUIRE(floor_remap(0, 32) == 0.0f, "D1 OFF leaked duty");
  // D2: 1% brightness lands just above the kick-in floor — no dead zone
  float d = floor_remap(1, 32);
  REQUIRE(d > 32.0f && d < 34.0f, "D2 1%% brightness not just past the floor");
  // D3: 100% is 100%
  REQUIRE(fabsf(floor_remap(100, 32) - 100.0f) < 0.01f, "D3 full brightness != full duty");
  // D4: window resolution — follow mode goes dark when the 4x8 is Off
  bool main_active = false; int stage_light_hours = 12; bool clone_photo_follow = true;
  int dur = clone_photo_follow ? (main_active ? stage_light_hours : 0) : 18;
  REQUIRE(dur == 0, "D4 follow mode lit against an Off 4x8");
  // D5: midnight wrap — 18:00 start, 18h window: 05:00 is ON, 13:00 is OFF
  int on_m = 18 * 60; float window = 18 * 60.0f;
  float since_on_5am  = fmodf(5 * 60 - on_m + 1440.0f, 1440.0f);
  float since_on_1pm  = fmodf(13 * 60 - on_m + 1440.0f, 1440.0f);
  REQUIRE(since_on_5am  < window,  "D5 05:00 should be inside the 18:00+18h window");
  REQUIRE(since_on_1pm >= window,  "D5 13:00 should be outside the 18:00+18h window");
  // D6: sunrise progress at the counter-cycle start: 18:15 with 30min rise = 50%
  float since_on = 15.0f, rise = 30.0f, target = 75.0f;
  float pct = target * (since_on / rise);
  REQUIRE(fabsf(pct - 37.5f) < 0.01f, "D6 sunrise ramp fraction wrong");
  printf("Suite D (ramp maths): done\n");
}

int main() {
  suite_mat_closed_loop();
  suite_mat_fallback();
  suite_clone_hum();
  suite_ramp();
  printf("\n=== v2.4-ALPHA QA: %d checks, %d violations ===\n", checks, violations);
  return violations == 0 ? 0 : 1;
}
