// ============================================================
// DSC-HUB v2.4.1 — QA RIG (adapted from the v2.2/v2.3 rig)
// Compiles the EXACT run_climate_logic lambda body extracted
// from dsc-hub-v2_4_1.yaml and runs:
//   1. Grid sweep (steady-state invariants, ~2M states)
//   2. Boundary tests (v2.3 set, updated for v2.4.1 semantics)
//   3. NaN / dropout / spike fuzzer (200k transitions)
//   6. v2.3 scenario set (OFF / priority / interlock / takeover)
//   7. NEW v2.4.1 scenarios:
//      - VPD-aware humidifier (fire, release, no appliance war)
//      - AC fans-first gate (fans must saturate or be useless)
//      - Multi-probe root zone (cold POT4 seen; faulted 0.0C POT3
//        ignored; runaway -> mat off + 2x4 flush; min-off honoured)
// ============================================================
#include <cstdio>
#include <cstdint>
#include <cmath>
#include <string>
#include <vector>
#include <random>
#include <cassert>
#include <algorithm>
using std::isnan;

static uint32_t fake_ms = 1000000;
uint32_t millis() { return fake_ms; }
static bool g_quiet = true;
#define ESP_LOGI(tag, fmt, ...) do { if(!g_quiet) printf("[I][%s] " fmt "\n", tag, ##__VA_ARGS__); } while(0)
#define ESP_LOGW(tag, fmt, ...) do { if(!g_quiet) printf("[W][%s] " fmt "\n", tag, ##__VA_ARGS__); } while(0)

struct Sensor { float state = NAN; };
struct Switch { bool state=false; void turn_on(){state=true;} void turn_off(){state=false;} };
struct Fan {
  bool state=false; int speed=0;
  struct Call { Fan* f; bool st=false; int sp=0;
    Call& set_state(bool s){st=s;return *this;}
    Call& set_speed(int s){sp=s;return *this;}
    void perform(){f->state=st; f->speed=sp;} };
  Call make_call(){ Call c; c.f=this; return c; }
};
struct TimeVal { bool valid=true; int hour=0,minute=0,second=0; bool is_valid() const {return valid;} };
struct Clock { TimeVal t; TimeVal now(){return t;} };
struct DateTimeEnt { int hour=6, minute=0; };
struct Light {
  struct Values { bool on=false; float b=0;
    bool is_on() const {return on;}
    float get_brightness() const {return b;} } remote_values;
  struct Call { Light* L; bool on; float b=-1;
    Call& set_brightness(float x){b=x; return *this;}
    Call& set_transition_length(int){return *this;}
    void perform(){ L->remote_values.on = on; if(b>=0) L->remote_values.b=b; } };
  Call turn_on(){ Call c; c.L=this; c.on=true; return c; }
  Call turn_off(){ Call c; c.L=this; c.on=false; return c; }
};
#define id(x) (x)

// ---- entity/global universe ----
bool boot_resume_pending=false, emergency_failsafe_active=false, sensor_fault_active=false;
Sensor humidity_sensor, temp_sensor, vpd_sensor, room_temp, room_rh, clone_temp, clone_rh, clone_vpd;
int control_strategy_idx=0;
bool room_fault_active=false, clone_fault_active=false;
int clone_mode_idx=1;
float stage_temp_target=25, stage_rh_min=45, stage_rh_max=50, stage_vpd_min=1.2f, stage_vpd_max=1.4f;
float clone_temp_target=24, clone_rh_min=70, clone_rh_max=80, clone_vpd_min=0.4f, clone_vpd_max=0.8f;
bool dehumidifier_auto_enabled=true, humidifier_auto_enabled=true, heater_auto_enabled=true;
bool growmat_auto_enabled=true, ac_auto_enabled=true, clone_hum_auto_enabled=true;
uint32_t esc_humid_since=0, esc_dry_since=0, esc_cold_since=0, esc_deep_cold_since=0, esc_hot_since=0, esc_clone_dry_since=0;
Switch dehumidifier_demand, humidifier_demand, heater_demand, growmat_demand, ac_demand, clone_hum_demand;
Switch local_manual_mode;
bool full_auto_mode=true;
Fan fan_exhaust_out, fan_exhaust_recirc, fan_intake_main, fan_intake_clone;
int cur_intake_main=15, cur_intake_clone=15;
uint32_t dehum_off_at=0, ac_off_at=0;
bool manual_light_hold=false; int light_ramp_state=0; float light_current_pct=0;
bool main_active=true, clone_active=true, priority_tent_main=true, ha_takeover_active=false;
uint32_t light_write_guard_until=0;
std::string auto_status_text;
// ---- v2.4 / v2.4.1 additions ----
Sensor rootzone_temp, rootzone_temp_2, rootzone_temp_3, rootzone_temp_4;
Sensor rz_now_1, rz_now_2, rz_now_3, rz_now_4;
uint32_t rz_now_1_at=0, rz_now_2_at=0, rz_now_3_at=0, rz_now_4_at=0;
bool rootzone_fault_active=false;
float clone_hum_hyst=6.0f;
int clone_hum_min_off_s=180, hum_min_off_s=120, heater_min_off_s=60, mat_min_off_s=300;
float mat_rz_low=20.0f, mat_rz_high=24.0f;
uint32_t clone_hum_off_at=0, hum_off_at=0, heater_off_at=0, mat_off_at=0;
bool clone_fan_saturated=false;
uint32_t cur_dehum_wait=300000, cur_hum_wait=120000, cur_heat_wait=300000, cur_ac_wait=300000;
// ---- photoperiod universe ----
Clock sntp_time, grow_time;
DateTimeEnt lights_on_time, clone_lights_on_time;
Light light_sf1000;
bool auto_photoperiod_enabled=true;
bool clone_photo_follow=false, lights_currently_on=false, clone_lights_on=false;
int stage_light_hours=12, clone_light_hours=18;
int local_target_sf1000=75, sunrise_minutes=30, sunset_minutes=30;

void run_climate_logic() {
#include "climate_body.cpp"
}
void run_photoperiod() {
#include "photo_body.cpp"
}
void run_clone_photoperiod() {
#include "clonephoto_body.cpp"
}

// ============================================================
static long fails = 0, checks = 0;
static int  fail_budget = 12;
void vfail(const char* inv, const char* ctxs) {
  fails++;
  if (fail_budget-- > 0) printf("  VIOLATION: %-34s | %s\n", inv, ctxs);
}
#define INV(cond, inv, ctxs) do { checks++; if(!(cond)) vfail(inv, ctxs); } while(0)

char ctxbuf[256];
const char* ctx() {
  snprintf(ctxbuf,sizeof(ctxbuf),
    "T=%.1f RH=%.0f VPD=%.2f | rm %.1f/%.0f | cl %.1f/%.0f | strat=%d mode=%d | out=%d rec=%d im=%d ic=%d | D%d H%d h%d m%d A%d cH%d",
    temp_sensor.state, humidity_sensor.state, vpd_sensor.state,
    room_temp.state, room_rh.state, clone_temp.state, clone_rh.state,
    control_strategy_idx, clone_mode_idx,
    fan_exhaust_out.speed, fan_exhaust_recirc.speed, fan_intake_main.speed, fan_intake_clone.speed,
    (int)dehumidifier_demand.state,(int)humidifier_demand.state,(int)heater_demand.state,
    (int)growmat_demand.state,(int)ac_demand.state,(int)clone_hum_demand.state);
  return ctxbuf;
}

// helpers to read the rig's root-zone aggregate the way the firmware does
static void rz_minmax(float& mn, float& mx) {
  auto pick=[](float nv,uint32_t at,float hv){ return (at!=0 && (fake_ms-at)<150000)?nv:hv; };
  float probes[4] = { pick(rz_now_1.state,rz_now_1_at,rootzone_temp.state),
                      pick(rz_now_2.state,rz_now_2_at,rootzone_temp_2.state),
                      pick(rz_now_3.state,rz_now_3_at,rootzone_temp_3.state),
                      pick(rz_now_4.state,rz_now_4_at,rootzone_temp_4.state) };
  mn = NAN; mx = NAN;
  for (int i=0;i<4;i++) {
    float p=probes[i];
    if (isnan(p)||p<=5.0f||p>=45.0f) continue;
    if (isnan(mn)||p<mn) mn=p;
    if (isnan(mx)||p>mx) mx=p;
  }
}

int expected_cap(bool cl_ok, float clh, float clt, float c_rmin, float c_tt) {
  if (!cl_ok) return 25;
  float cap_rh = 100.0f;
  if      (clh <= c_rmin)        cap_rh = 20.0f;
  else if (clh <  c_rmin + 3.0f) cap_rh = 20.0f + (clh - c_rmin) * (20.0f / 3.0f);
  else if (clh <  c_rmin + 8.0f) cap_rh = 40.0f + (clh - c_rmin - 3.0f) * (60.0f / 5.0f);
  // v2.4.1: emergency-cooling relaxation of the RH leg
  float rzmn, rzmx; rz_minmax(rzmn, rzmx);
  float rz_hi = fmaxf(mat_rz_low, mat_rz_high);
  bool rz_run = clone_active && growmat_auto_enabled && !rootzone_fault_active
                && !isnan(rzmx) && rzmx >= rz_hi + 1.0f;
  bool emerg = (clt > c_tt + 2.0f) || rz_run;
  if (emerg && cap_rh < 50.0f) cap_rh = 50.0f;
  float cap_cold = 100.0f;
  if      (clt <= c_tt - 1.5f)   cap_cold = 30.0f;
  else if (clt <  c_tt - 0.5f)   cap_cold = 30.0f + (clt - (c_tt - 1.5f)) * 70.0f;
  return (int) fminf(cap_rh, cap_cold);
}

float calc_vpd(float t, float rh) {
  if (isnan(t)||isnan(rh)||rh<=0) return NAN;
  float svp = 0.6108f*expf((17.27f*t)/(t+237.3f));
  return svp - svp*(rh/100.0f);
}

void reset_env() {
  fake_ms = 1000000;
  temp_sensor.state=25; humidity_sensor.state=47; vpd_sensor.state=calc_vpd(25,47);
  room_temp.state=18; room_rh.state=45; clone_temp.state=24; clone_rh.state=75;
  clone_vpd.state=calc_vpd(24,75);
  stage_temp_target=25; stage_rh_min=45; stage_rh_max=50; stage_vpd_min=1.2f; stage_vpd_max=1.4f;
  clone_temp_target=24; clone_rh_min=70; clone_rh_max=80;
  clone_vpd_min=0.4f; clone_vpd_max=0.8f;
  clone_mode_idx=1; control_strategy_idx=0;
  room_fault_active=clone_fault_active=false;
  full_auto_mode=true; boot_resume_pending=emergency_failsafe_active=sensor_fault_active=false;
  ha_takeover_active=false;
  esc_humid_since=esc_dry_since=esc_cold_since=esc_deep_cold_since=esc_hot_since=esc_clone_dry_since=0;
  dehumidifier_demand.state=humidifier_demand.state=heater_demand.state=false;
  growmat_demand.state=ac_demand.state=clone_hum_demand.state=false;
  cur_intake_main=15; cur_intake_clone=15;
  dehum_off_at=0; ac_off_at=0;
  fan_exhaust_out=Fan{}; fan_exhaust_recirc=Fan{}; fan_intake_main=Fan{}; fan_intake_clone=Fan{};
  manual_light_hold=false;
  main_active=true; clone_active=true; priority_tent_main=true;
  light_write_guard_until=0;
  // v2.4/v2.4.1: probes default UNKNOWN -> mat runs the clone-AIR
  // fallback in the legacy suites (matches v2.3 behaviour); the new
  // suite sets probe values explicitly.
  rootzone_temp.state=NAN; rootzone_temp_2.state=NAN;
  rootzone_temp_3.state=NAN; rootzone_temp_4.state=NAN;
  rz_now_1.state=NAN; rz_now_2.state=NAN; rz_now_3.state=NAN; rz_now_4.state=NAN;
  rz_now_1_at=0; rz_now_2_at=0; rz_now_3_at=0; rz_now_4_at=0;
  rootzone_fault_active=false;
  clone_hum_hyst=6.0f; clone_hum_min_off_s=180; hum_min_off_s=120;
  heater_min_off_s=60; mat_min_off_s=300;
  mat_rz_low=20.0f; mat_rz_high=24.0f;
  clone_hum_off_at=0; hum_off_at=0; heater_off_at=0; mat_off_at=0;
  clone_fan_saturated=false;
  // photoperiod
  sntp_time.t = TimeVal{}; grow_time.t = TimeVal{}; grow_time.t.valid=false;
  lights_on_time.hour=6; lights_on_time.minute=0;
  clone_lights_on_time.hour=18; clone_lights_on_time.minute=0;
  light_sf1000 = Light{};
  auto_photoperiod_enabled=true; clone_photo_follow=false;
  lights_currently_on=false; clone_lights_on=false;
  stage_light_hours=12; clone_light_hours=18;
  local_target_sf1000=75; sunrise_minutes=30; sunset_minutes=30;
}

void settle(int ticks=14) { for(int i=0;i<ticks;i++){ run_climate_logic(); fake_ms += 10000; } }
void run_ladder_settle() {
  for (int i=0;i<3;i++){ run_climate_logic(); fake_ms += 400000; }
  run_climate_logic();
}

// The invariants that must hold in EVERY steady state (full auto, no faults)
void check_invariants(bool aux_ok, bool steady=true) {
  float t=temp_sensor.state, rh=humidity_sensor.state;
  float tt=stage_temp_target, rlo=stage_rh_min, rhi=stage_rh_max;
  float clh=clone_rh.state, clt=clone_temp.state;
  float c_rmin = clone_mode_idx==0 ? stage_rh_min : clone_rh_min;
  float c_tt   = clone_mode_idx==0 ? stage_temp_target : clone_temp_target;

  INV(fan_exhaust_out.speed>=0 && fan_exhaust_out.speed<=100, "out fan 0-100", ctx());
  INV(fan_exhaust_recirc.speed>=0 && fan_exhaust_recirc.speed<=100, "recirc fan 0-100", ctx());
  INV(fan_intake_main.speed>=0 && fan_intake_main.speed<=100, "main intake 0-100", ctx());
  INV(fan_intake_clone.speed>=0 && fan_intake_clone.speed<=100, "clone intake 0-100", ctx());
  if (!isnan(t)) INV(fan_exhaust_out.speed>=15, "fresh-air floor out>=15", ctx());
  bool cl_ok_now = aux_ok && !clone_fault_active && !isnan(clh) && !isnan(clt);
  int capX = expected_cap(cl_ok_now, clh, clt, c_rmin, c_tt);
  if (steady && !isnan(t)) {
    int budget = (int)(((fan_exhaust_out.speed+fan_exhaust_recirc.speed)/2.0f)*0.7f)*2;
    int total  = fan_intake_main.speed + fan_intake_clone.speed;
    INV(total <= budget, "intake total <= budget (hard)", ctx());
    int achievable = std::min(budget, 100 + capX);
    INV(total >= achievable - 16, "intake total tracks achievable", ctx());
  }
  INV(!(humidifier_demand.state && dehumidifier_demand.state), "humid vs dehumid war", ctx());
  INV(!(heater_demand.state && ac_demand.state), "heater vs AC war", ctx());
  {
    int tol = steady ? 0 : 15;
    INV(fan_intake_clone.speed <= capX + tol, "clone intake <= protection cap", ctx());
  }
  // I6 (v2.4.1 semantics): demand correctness vs conditions.
  if (!isnan(rh) && rlo < rhi) {
    if (dehumidifier_demand.state) INV(rh > rhi - 2.0f - 0.01f, "dehum ON only above clear pt", ctx());
    // Humidifier may be ON below the RH clear point OR (VPD strategy)
    // while the ARBITRATED VPD is over its ceiling with RH under ceiling.
    if (humidifier_demand.state) {
      bool arb_is_main = (main_active && !clone_active) ? true
                       : (!main_active && clone_active) ? false
                       : priority_tent_main;
      if (arb_is_main || clone_fault_active || isnan(clt)) {
        bool vleg = control_strategy_idx==0 && !isnan(vpd_sensor.state)
                    && vpd_sensor.state > stage_vpd_max - 0.01f && rh < rhi - 2.0f + 0.01f;
        INV(rh < rlo + 2.0f + 0.01f || vleg, "humid ON: RH-low or VPD-high", ctx());
      }
    }
  }
  if (!isnan(t)) {
    // AC/heater invariants only meaningful when the 4x8 is the arb tent
    bool arb_is_main = (main_active && !clone_active) ? true
                     : (!main_active && clone_active) ? false
                     : priority_tent_main;
    if (arb_is_main || clone_fault_active || isnan(clt)) {
      if (ac_demand.state)     INV(t > tt + 0.5f - 0.01f, "AC ON only above clear pt", ctx());
      if (heater_demand.state) INV(t < tt - 0.5f + 0.01f, "heater ON only below clear pt", ctx());
    }
  }
  // v2.4.1: with probes NaN the mat runs the clone-AIR fallback -> the
  // v2.3 invariant still holds in the legacy suites.
  if (growmat_demand.state) {
    float rzmn, rzmx; rz_minmax(rzmn, rzmx);
    if (isnan(rzmn)) {
      float c_tt_inv = (clone_mode_idx==0) ? stage_temp_target : clone_temp_target;
      bool cl_ok_inv = !clone_fault_active && !isnan(clone_temp.state);
      INV(cl_ok_inv && clone_temp.state < c_tt_inv + 0.01f, "mat ON only below CLONE target", ctx());
    } else {
      float rz_hi = fmaxf(mat_rz_low, mat_rz_high);
      INV(rzmn < rz_hi + 0.01f, "mat ON only below RZ high", ctx());
      INV(rzmx < rz_hi + 1.0f + 0.01f, "mat never ON in runaway", ctx());
    }
  }
}

// ============================================================
// SUITE 1: GRID SWEEP
// ============================================================
void suite_grid() {
  printf("\n=== SUITE 1: grid sweep (steady-state invariants) ===\n");
  fail_budget = 12;
  long states=0;
  float tents[] = {14,18,21,23,24.5f,25,25.5f,26,27,28,30,33,36};
  float trhs[]  = {20,30,40,44,47,50,53,58,65,75,85,95};
  float rooms[] = {5,10,14,18,22,26,30,34};
  float rrhs[]  = {25,40,55,70,85};
  float clts[]  = {15,20,22.5f,24,26,28,31};
  float clhs[]  = {45,60,66,69,72,76,84,92};
  for (float tt2 : tents) for (float trh : trhs)
  for (float rt : rooms)  for (float rrh : rrhs)
  for (float ct : clts)   for (float ch : clhs)
  for (int strat=0; strat<3; strat++)
  for (int cmode=0; cmode<2; cmode++) {
    reset_env();
    control_strategy_idx=strat; clone_mode_idx=cmode;
    temp_sensor.state=tt2; humidity_sensor.state=trh; vpd_sensor.state=calc_vpd(tt2,trh);
    room_temp.state=rt; room_rh.state=rrh;
    clone_temp.state=ct; clone_rh.state=ch; clone_vpd.state=calc_vpd(ct,ch);
    settle(14);
    check_invariants(true);
    states++;
  }
  printf("  states=%ld  checks=%ld  violations=%ld\n", states, checks, fails);
}

// ============================================================
// SUITE 2: BOUNDARY / EDGE CASES (v2.3 set, v2.4.1-adjusted)
// ============================================================
void suite_boundaries() {
  printf("\n=== SUITE 2: boundary & edge cases ===\n");
  fail_budget = 12;
  long f0 = fails;

  // 2a. Band inversion
  reset_env();
  stage_rh_min = 60; stage_rh_max = 50;
  humidity_sensor.state = 55;
  vpd_sensor.state = calc_vpd(25,55);
  run_climate_logic(); fake_ms += 400000; run_climate_logic();
  fake_ms += 400000; run_climate_logic();
  INV(!(humidifier_demand.state && dehumidifier_demand.state),
      "2a inverted RH band -> appliance war", ctx());

  // 2b. Exactly at thresholds
  reset_env(); humidity_sensor.state = stage_rh_max + 3.0f;
  vpd_sensor.state = calc_vpd(25, stage_rh_max + 3.0f);   // keep VPD honest (in band)
  run_climate_logic(); fake_ms += 400000; run_climate_logic();
  INV(!dehumidifier_demand.state, "2b rh == r_hi+3 exactly -> no trigger (strict >)", ctx());

  // 2c. Clone RH exactly at floor, clone NOT overheating -> cap 20 holds
  reset_env(); temp_sensor.state=22.5f; clone_temp.state=24.5f; clone_rh.state=clone_rh_min; room_temp.state=14;
  clone_vpd.state=calc_vpd(24.5f, clone_rh_min);
  settle();
  INV(fan_intake_clone.speed <= 20, "2c clone RH == floor (not hot) -> cap 20", ctx());

  // 2c-bis (v2.4.1). Same RH but clone overheating -> RH cap leg relaxes to 50
  reset_env(); temp_sensor.state=22.5f; clone_temp.state=27; clone_rh.state=clone_rh_min; room_temp.state=14;
  clone_vpd.state=calc_vpd(27, clone_rh_min);
  settle();
  INV(fan_intake_clone.speed <= 50, "2c-bis hot clone: relaxed cap bound 50", ctx());

  // 2d. All aux NaN
  reset_env();
  room_temp.state=NAN; room_rh.state=NAN; clone_temp.state=NAN; clone_rh.state=NAN;
  settle();
  check_invariants(false);
  INV(fan_intake_clone.speed<=25, "2d NaN aux -> conservative clone path", ctx());

  // 2e. Tent NaN: ladder must not act on NaN
  reset_env(); temp_sensor.state=NAN; humidity_sensor.state=NAN; vpd_sensor.state=NAN;
  run_climate_logic(); fake_ms+=400000; run_climate_logic();
  INV(!heater_demand.state && !ac_demand.state && !dehumidifier_demand.state && !humidifier_demand.state,
      "2e NaN tent -> no appliance demands", ctx());

  // 2f. Emergency freeze mid-borrow
  reset_env(); temp_sensor.state=22.5f; clone_temp.state=27; room_temp.state=14; settle();
  emergency_failsafe_active=true;
  int im=fan_intake_main.speed, ic=fan_intake_clone.speed;
  run_climate_logic();
  INV(im==fan_intake_main.speed && ic==fan_intake_clone.speed, "2f emergency freezes router", ctx());

  // 2g. Hot tent never borrows heat
  reset_env(); temp_sensor.state=28.5f; clone_temp.state=31; room_temp.state=15; settle();
  INV(auto_status_text.find("warm 2x4 air")==std::string::npos,
      "2g hot tent never borrows heat", ctx());

  // 2h. Slew convergence from opposite extreme
  reset_env(); cur_intake_main=100; cur_intake_clone=100;
  temp_sensor.state=25; settle(14);
  int budget=(int)(((fan_exhaust_out.speed+fan_exhaust_recirc.speed)/2.0f)*0.7f)*2;
  INV(std::abs(fan_intake_main.speed+fan_intake_clone.speed - budget)<=16,
      "2h slew converges from 100/100", ctx());

  printf("  boundary checks done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 3: FUZZER
// ============================================================
void suite_fuzz() {
  printf("\n=== SUITE 3: fuzzer (200k random transitions) ===\n");
  fail_budget = 12;
  long f0 = fails;
  std::mt19937 rng(42);
  std::uniform_real_distribution<float> u01(0,1);
  auto jitter=[&](float v, float lo, float hi, float step){
    v += (u01(rng)-0.5f)*2*step;
    if (u01(rng)<0.01f) v = lo + u01(rng)*(hi-lo);
    return std::max(lo,std::min(hi,v));
  };
  reset_env();
  float T=25,H=47,RT=18,RH2=45,CT=24,CH=75;
  float P1=21,P2=22,P4=20;
  for (int i=0;i<200000;i++) {
    T=jitter(T,10,42,0.4f); H=jitter(H,15,99,1.2f);
    RT=jitter(RT,2,38,0.3f); RH2=jitter(RH2,15,95,1.0f);
    CT=jitter(CT,10,36,0.3f); CH=jitter(CH,30,99,1.0f);
    P1=jitter(P1,4,40,0.2f); P2=jitter(P2,4,40,0.2f); P4=jitter(P4,4,40,0.2f);
    temp_sensor.state = (u01(rng)<0.003f)?NAN:T;
    humidity_sensor.state=(u01(rng)<0.003f)?NAN:H;
    vpd_sensor.state=calc_vpd(temp_sensor.state,humidity_sensor.state);
    room_temp.state=(u01(rng)<0.005f)?NAN:RT; room_rh.state=(u01(rng)<0.005f)?NAN:RH2;
    clone_temp.state=(u01(rng)<0.005f)?NAN:CT; clone_rh.state=(u01(rng)<0.005f)?NAN:CH;
    clone_vpd.state=calc_vpd(clone_temp.state,clone_rh.state);
    // v2.4.1: probes fuzzed too — POT3 is the permanently-faulted 0.0C
    rootzone_temp.state  =(u01(rng)<0.01f)?NAN:P1;
    rootzone_temp_2.state=(u01(rng)<0.01f)?NAN:P2;
    rootzone_temp_3.state=0.0f;                          // faulted, always
    rootzone_temp_4.state=(u01(rng)<0.01f)?NAN:P4;
    if (u01(rng)<0.001f) control_strategy_idx=(control_strategy_idx+1)%3;
    if (u01(rng)<0.001f) clone_mode_idx=(clone_mode_idx+1)%2;
    if (u01(rng)<0.0008f) { room_fault_active=!room_fault_active; }
    if (u01(rng)<0.0008f) { clone_fault_active=!clone_fault_active;
                            if (clone_fault_active){esc_clone_dry_since=0; clone_hum_demand.turn_off();} }
    run_climate_logic();
    fake_ms += 10000;
    INV(fan_exhaust_out.speed<=100 && fan_exhaust_recirc.speed<=100 &&
        fan_intake_main.speed<=100 && fan_intake_clone.speed<=100 &&
        fan_exhaust_out.speed>=0 && fan_intake_main.speed>=0 &&
        fan_intake_clone.speed>=0 && fan_exhaust_recirc.speed>=0, "fuzz fan ranges", ctx());
    INV(!(humidifier_demand.state && dehumidifier_demand.state), "fuzz humid war", ctx());
    INV(!(heater_demand.state && ac_demand.state), "fuzz temp war", ctx());
    // v2.4.1: the mat may NEVER be on while any plausible probe is in runaway
    if (growmat_demand.state) {
      float mn,mx; rz_minmax(mn,mx);
      if (!isnan(mx)) INV(mx < fmaxf(mat_rz_low,mat_rz_high)+1.0f+0.01f, "fuzz mat runaway", ctx());
    }
  }
  printf("  fuzz done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 6: v2.3 scenario set (regression)
// ============================================================
void suite_v23() {
  printf("\n=== SUITE 6: v2.3 regression (OFF / priority / mat / interlock / takeover) ===\n");
  fail_budget = 12;
  long f0 = fails;

  // T1: MASTER TAKEOVER freezes the fan curve entirely.
  reset_env();
  ha_takeover_active = true;
  fan_exhaust_out.speed = 77; fan_exhaust_recirc.speed = 33;
  fan_intake_main.speed = 44; fan_intake_clone.speed = 22;
  temp_sensor.state = 30;
  run_ladder_settle();
  INV(fan_exhaust_out.speed==77 && fan_exhaust_recirc.speed==33
      && fan_intake_main.speed==44 && fan_intake_clone.speed==22,
      "takeover: fans untouched by curve", ctx());
  INV(!dehumidifier_demand.state && !heater_demand.state && !ac_demand.state
      && !humidifier_demand.state && !growmat_demand.state,
      "takeover: ladder suspended (no demands)", ctx());

  // T2: 2x4 OFF -> clone intake trickles, no clone-local demands.
  reset_env();
  clone_active = false;
  clone_temp.state = 18; clone_rh.state = 55;
  clone_vpd.state = calc_vpd(18,55);
  run_ladder_settle();
  INV(fan_intake_clone.speed <= 8, "2x4 off: clone intake trickle only", ctx());
  INV(!growmat_demand.state, "2x4 off: grow mat stays off", ctx());
  INV(!clone_hum_demand.state, "2x4 off: clone humidifier stays off", ctx());

  // T3: GROW MAT tracks the CLONE tent (air fallback, probes NaN).
  reset_env();
  temp_sensor.state = 25;
  clone_temp.state = 22; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(22,75);
  run_ladder_settle();
  INV(growmat_demand.state, "grow mat ON from cold CLONE (air fallback)", ctx());
  INV(!heater_demand.state, "heater stays off (4x8 arb tent is warm)", ctx());

  // T3-bis (v2.4.1): cold POT4 fires the mat even with POT1 warm.
  reset_env();
  temp_sensor.state = 25;
  clone_temp.state = 24; clone_rh.state = 75;   // clone air fine
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state = 22.0f;   // POT1 warm (the only v2.4 sense point!)
  rootzone_temp_2.state = 21.5f;
  rootzone_temp_3.state = 0.0f;  // faulted probe
  rootzone_temp_4.state = 17.0f; // the cold pot from the 19 Jul alert
  run_ladder_settle();
  INV(growmat_demand.state, "T3-bis: cold POT4 fires mat (multi-probe)", ctx());

  // T3-ter (v2.4.1): POT3's 0.0C alone must NOT hold the mat on.
  reset_env();
  temp_sensor.state = 25;
  clone_temp.state = 24; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state = 22.0f; rootzone_temp_2.state = 21.5f;
  rootzone_temp_3.state = 0.0f;   // faulted: would read "< low" if trusted
  rootzone_temp_4.state = 21.0f;
  run_ladder_settle();
  INV(!growmat_demand.state, "T3-ter: faulted 0.0C probe ignored (mat off)", ctx());

  // T4: cold 4x8 does NOT fire the grow mat.
  reset_env();
  temp_sensor.state = 21;
  clone_temp.state = 25;
  clone_vpd.state = calc_vpd(25,75);
  run_ladder_settle();
  INV(!growmat_demand.state, "cold 4x8 does not fire the (2x4) grow mat", ctx());
  INV(heater_demand.state, "cold 4x8 fires the room heater", ctx());

  // T5: HEATER INTERLOCK — heating means no outside extraction.
  reset_env();
  temp_sensor.state = 21;
  room_temp.state = 15;
  run_ladder_settle();
  INV(heater_demand.state, "interlock precondition: heater demanded", ctx());
  INV(fan_exhaust_out.speed <= 15, "heater interlock: OUT at fresh-air floor", ctx());
  INV(fan_exhaust_recirc.speed >= 25, "heater interlock: air routed to RECIRC", ctx());

  // T6: PRIORITY — both live, 2x4 priority; hot clone -> AC engages,
  //     and (v2.4.1) ONLY after the exchange fans saturated.
  reset_env();
  priority_tent_main = false;
  temp_sensor.state = 24;
  clone_temp.state = 27; clone_rh.state = 72;
  clone_vpd.state = calc_vpd(27,72);
  {
    bool fans_ramped_before_ac = false;
    bool ac_seen = false;
    for (int i=0;i<80;i++) {           // 80 x 10s ticks = 13.3 min
      run_climate_logic();
      if (!ac_demand.state && fan_intake_clone.speed >= 30) fans_ramped_before_ac = true;
      if (ac_demand.state) { ac_seen = true; break; }
      fake_ms += 10000;
    }
    INV(ac_seen, "2x4 priority: AC serves the hot clone tent", ctx());
    INV(fans_ramped_before_ac, "v2.4.1: exchange fans ramped BEFORE AC", ctx());
  }

  // T7: same conditions but 4x8 priority -> AC must NOT fire for the clone.
  reset_env();
  priority_tent_main = true;
  temp_sensor.state = 24;
  clone_temp.state = 27; clone_rh.state = 72;
  clone_vpd.state = calc_vpd(27,72);
  run_ladder_settle();
  INV(!ac_demand.state, "4x8 priority: hot secondary clone does NOT command AC", ctx());

  // T8: only-one-active auto-priority.
  reset_env();
  main_active = false;
  priority_tent_main = true;
  clone_temp.state = 21;
  clone_vpd.state = calc_vpd(21,75);
  run_ladder_settle();
  INV(heater_demand.state, "4x8 off: room heater serves the lone clone tent", ctx());
  INV(fan_intake_main.speed <= 8, "4x8 off: main intake trickle only", ctx());

  // T9: negative-pressure invariant with a tent OFF.
  reset_env();
  clone_active = false; temp_sensor.state = 29;
  run_ladder_settle();
  {
    int budget = (int)(((fan_exhaust_out.speed + fan_exhaust_recirc.speed)/2.0f)*0.7f)*2;
    INV(fan_intake_main.speed + fan_intake_clone.speed <= budget+1,
        "neg-pressure holds with 2x4 off", ctx());
  }

  printf("  v2.3 regression done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 7: v2.4.1 — the 19 Jul incident scenarios
// ============================================================
void suite_v241() {
  printf("\n=== SUITE 7: v2.4.1 incident scenarios ===\n");
  fail_budget = 12;
  long f0 = fails;

  // V1: THE 5:28pm CASE — VPD over ceiling, RH above floor -> humidifier
  //     must fire under the VPD strategy (it never did in v2.4).
  //     Flower band: RH 45-50, VPD 1.2-1.4. T=28/RH=48 -> VPD ~1.97.
  reset_env();
  temp_sensor.state = 28; humidity_sensor.state = 46;
  vpd_sensor.state = calc_vpd(28,46);
  run_ladder_settle();
  INV(humidifier_demand.state, "V1: VPD over ceiling fires humidifier", ctx());
  INV(!dehumidifier_demand.state, "V1: no dehumidifier war", ctx());

  // V1-clone: same physics on the clone rung (Clones band RH 70-80,
  //     VPD 0.4-0.8). Clone 26C/68% -> VPD ~1.07 over 0.8 ceiling,
  //     RH 68 above floor-2 (v2.4 would sit silent).
  reset_env();
  clone_temp.state = 26; clone_rh.state = 68;
  clone_vpd.state = calc_vpd(26,68);
  run_ladder_settle();
  INV(clone_hum_demand.state, "V1c: clone VPD over ceiling fires clone hum", ctx());

  // V2: release + no-war — humidifier ON, then RH climbs over the
  //     ceiling while VPD stays high (hot air): humidifier must release.
  reset_env();
  temp_sensor.state = 28; humidity_sensor.state = 46;
  vpd_sensor.state = calc_vpd(28,46);
  run_ladder_settle();
  INV(humidifier_demand.state, "V2 precondition: humidifier on", ctx());
  humidity_sensor.state = 51;             // over the 50 ceiling
  vpd_sensor.state = calc_vpd(28,51);     // still ~1.85, way over VPD ceiling
  run_climate_logic();
  INV(!humidifier_demand.state, "V2: RH at ceiling releases humidifier", ctx());

  // V3: THE 5:56pm CASE — hot 2x4 (priority), cool room: fans must
  //     visibly ramp the exchange BEFORE the AC is allowed to fire.
  //     (Asserted inside T6 above; here: the graded escalation itself.)
  reset_env();
  priority_tent_main = false;
  temp_sensor.state = 24;
  clone_temp.state = 27.5f; clone_rh.state = 72;   // +3.5 over target
  clone_vpd.state = calc_vpd(27.5f,72);
  room_temp.state = 20;
  settle(6);
  INV(fan_intake_clone.speed >= 40, "V3: graded cooling flush >= 40%", ctx());

  // V3-bis: room air CANNOT cool (room hotter than clone target+1):
  //     fans are useless -> AC may fire without fan saturation.
  reset_env();
  priority_tent_main = false;
  temp_sensor.state = 24;
  clone_temp.state = 27; clone_rh.state = 72;
  clone_vpd.state = calc_vpd(27,72);
  room_temp.state = 28;                  // hotter than the tent
  run_ladder_settle();
  INV(ac_demand.state, "V3-bis: fans useless (hot room) -> AC fires", ctx());

  // V4: ROOT-ZONE RUNAWAY — one pot at High+1: mat cut + 2x4 flush.
  reset_env();
  temp_sensor.state = 25;
  clone_temp.state = 24; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state = 25.5f;           // >= 24+1 -> runaway
  rootzone_temp_2.state = 22.0f;
  rootzone_temp_3.state = 0.0f;
  rootzone_temp_4.state = 21.0f;
  growmat_demand.state = true;           // mat was on
  settle(8);
  INV(!growmat_demand.state, "V4: runaway cuts the mat", ctx());
  INV(fan_intake_clone.speed >= 35, "V4: runaway flushes the 2x4", ctx());

  // V5: min-off honoured after the runaway cut — pots swing cold, the
  //     mat may NOT re-fire inside Mat Min Off-Time (300s).
  {
    // continue from V4 state: make all pots cold now
    rootzone_temp.state = 17.0f; rootzone_temp_2.state = 17.5f;
    rootzone_temp_4.state = 16.5f;
    uint32_t cut_at = mat_off_at;
    bool refire_too_early = false;
    for (int i=0;i<40;i++) {             // 400s of 10s ticks
      run_climate_logic();
      if (growmat_demand.state && (fake_ms - cut_at) <= (uint32_t)mat_min_off_s*1000)
        refire_too_early = true;
      fake_ms += 10000;
    }
    INV(!refire_too_early, "V5: mat min-off honoured after runaway", ctx());
    INV(growmat_demand.state, "V5: mat re-fires once min-off elapsed", ctx());
  }

  printf("  v2.4.1 scenarios done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 8: v2.4 photoperiod + SF1000 ramp engine
// ============================================================
void set_clock(int m, int s=0){ sntp_time.t.hour=m/60; sntp_time.t.minute=m%60; sntp_time.t.second=s; }

void suite_photo() {
  printf("\n=== SUITE 8: photoperiod + SF1000 ramp engine ===\n");
  fail_budget = 12;
  long f0 = fails;

  // P1: window truth + commanded-light minutes for a grid of schedules
  for (int onh=0; onh<24; onh+=3) for (int onm=0; onm<60; onm+=30)
  for (int dur : {0,1,6,12,18,23,24}) {
    reset_env();
    clone_photo_follow=false;
    clone_lights_on_time.hour=onh; clone_lights_on_time.minute=onm;
    clone_light_hours=dur;
    int win_on=0, lit=0; float max_pct=0;
    for (int m=0;m<1440;m++) {
      set_clock((onh*60+onm+m)%1440);     // walk a full day starting at on-time
      run_clone_photoperiod();
      fake_ms += 15000;
      if (clone_lights_on) win_on++;
      if (light_sf1000.remote_values.is_on()) lit++;
      if (light_current_pct > max_pct) max_pct = light_current_pct;
      INV(light_current_pct <= local_target_sf1000 + 0.01f, "P1 pct <= target", ctx());
    }
    int expect_win = dur>=24 ? 1440 : dur*60;
    char c[96]; snprintf(c,sizeof(c),"on=%02d:%02d dur=%dh win=%d lit=%d max=%.0f",onh,onm,dur,win_on,lit,max_pct);
    INV(win_on==expect_win, "P1 window minutes == dur*60", c);
    // lit minutes: window minus the sub-0.5%% ramp edges (<=2 min slack)
    INV(std::abs(lit - expect_win) <= 2, "P1 lit minutes track window", c);
    if (dur>0) INV(max_pct >= local_target_sf1000 - 0.01f, "P1 ramp reaches target", c);
  }

  // P2: sunrise monotonic + phases (second-resolution walk)
  {
    reset_env();
    clone_lights_on_time.hour=18; clone_light_hours=12;
    sunrise_minutes=30; sunset_minutes=45; local_target_sf1000=80;
    float prev=-1; bool mono=true; bool saw_r1=false, saw_r2=false, saw_steady=false;
    for (int s=0; s<12*3600; s+=15) {
      int abs_min = 18*60 + s/60;
      set_clock(abs_min%1440, s%60);
      run_clone_photoperiod();
      fake_ms += 15000;
      if (s < 30*60) { if (light_current_pct < prev - 0.01f) mono=false; }
      prev = light_current_pct;
      if (light_ramp_state==1) saw_r1=true;
      if (light_ramp_state==2) saw_r2=true;
      if (light_ramp_state==0 && clone_lights_on && light_current_pct>79) saw_steady=true;
    }
    INV(mono, "P2 sunrise monotonic", ctx());
    INV(saw_r1 && saw_r2 && saw_steady, "P2 all three phases seen", ctx());
  }

  // P3: manual hold — engine leaves the light alone; self-heals at OFF edge
  {
    reset_env();
    clone_lights_on_time.hour=18; clone_light_hours=12;
    set_clock(20*60); run_clone_photoperiod(); fake_ms += 15000;   // mid-window steady
    INV(light_sf1000.remote_values.is_on(), "P3 pre: light on", ctx());
    manual_light_hold = true;
    light_sf1000.remote_values.b = 0.10f;   // user dimmed to 10%% externally
    for (int m=1;m<=60;m++){ set_clock(20*60+m); run_clone_photoperiod(); fake_ms += 15000; }
    INV(fabsf(light_sf1000.remote_values.b-0.10f)<1e-4, "P3 hold: engine hands off", ctx());
    // walk to the off edge (06:00): hold must release and light go dark
    set_clock(5*60+59); run_clone_photoperiod(); fake_ms += 15000;
    set_clock(6*60);   run_clone_photoperiod(); fake_ms += 15000;
    INV(!manual_light_hold, "P3 hold released at off edge", ctx());
    INV(!light_sf1000.remote_values.is_on(), "P3 light off after edge", ctx());
  }

  // P4: Follow-4x8 — dark when main Off; mirrors the main window otherwise
  {
    reset_env();
    clone_photo_follow=true; main_active=false;
    light_sf1000.remote_values.on = true; light_sf1000.remote_values.b=0.8f;
    set_clock(12*60); run_clone_photoperiod(); fake_ms += 15000;
    INV(!light_sf1000.remote_values.is_on(), "P4 follow Off-4x8 = dark", ctx());
    reset_env();
    clone_photo_follow=true; main_active=true; stage_light_hours=12; lights_on_time.hour=6;
    set_clock(12*60); run_clone_photoperiod(); fake_ms += 15000;
    INV(clone_lights_on && light_sf1000.remote_values.is_on(), "P4 follow mirrors open 4x8 window", ctx());
    set_clock(19*60); run_clone_photoperiod(); fake_ms += 15000;
    INV(!clone_lights_on && !light_sf1000.remote_values.is_on(), "P4 follow mirrors shut 4x8 window", ctx());
  }

  // P5: disarmed / takeover / emergency -> engine never touches the light
  {
    reset_env(); auto_photoperiod_enabled=false;
    light_sf1000.remote_values.on=true; light_sf1000.remote_values.b=0.42f;
    set_clock(2*60); run_clone_photoperiod();   // deep in dark period
    INV(light_sf1000.remote_values.is_on() && fabsf(light_sf1000.remote_values.b-0.42f)<1e-4,
        "P5 disarmed: untouched", ctx());
    reset_env(); ha_takeover_active=true;
    light_sf1000.remote_values.on=true; light_sf1000.remote_values.b=0.42f;
    set_clock(2*60); run_clone_photoperiod();
    INV(light_sf1000.remote_values.is_on(), "P5 takeover: untouched", ctx());
    reset_env(); emergency_failsafe_active=true;
    light_sf1000.remote_values.on=true;
    set_clock(20*60); run_clone_photoperiod();
    INV(light_sf1000.remote_values.is_on(), "P5 emergency: trip handler owns light", ctx());
  }

  // P6: overlap scaling — sunrise+sunset > window still peaks at target
  {
    reset_env();
    clone_lights_on_time.hour=18; clone_light_hours=1;
    sunrise_minutes=45; sunset_minutes=45; local_target_sf1000=60;
    float peak=0;
    for (int s=0; s<3600; s+=15){
      set_clock((18*60 + s/60)%1440, s%60);
      run_clone_photoperiod(); fake_ms += 15000;
      if (light_current_pct>peak) peak=light_current_pct;
      INV(light_current_pct <= 60.01f, "P6 pct bounded", ctx());
    }
    INV(peak >= 59.0f, "P6 scaled ramps still reach target", ctx());
  }

  // P7: 4x8 VIRTUAL window truth — minutes ON == dur*60
  for (int onh=0; onh<24; onh+=4) for (int dur : {0,12,18,24}) {
    reset_env();
    lights_on_time.hour=onh; lights_on_time.minute=0; stage_light_hours=dur;
    int on_count=0;
    for (int m=0;m<1440;m++){ set_clock(m); run_photoperiod(); if (lights_currently_on) on_count++; }
    int expect = dur>=24 ? 1440 : dur*60;
    char c[64]; snprintf(c,sizeof(c),"P7 on=%02d dur=%dh got=%d",onh,dur,on_count);
    INV(on_count==expect, "P7 virtual window minutes", c);
  }

  // P8: no-clock -> engine holds (never drives dark on a dead clock)
  {
    reset_env();
    set_clock(20*60); run_clone_photoperiod(); fake_ms += 15000;   // light on
    sntp_time.t.valid=false; grow_time.t.valid=false;
    bool was_on = light_sf1000.remote_values.is_on();
    run_clone_photoperiod();
    INV(light_sf1000.remote_values.is_on()==was_on, "P8 dead clock: hold state", ctx());
  }

  printf("  photoperiod checks done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 9: v2.4.1 ESP-NOW source-select (mat sense path)
// ============================================================
void suite_espnow() {
  printf("\n=== SUITE 9: ESP-NOW source-select ===\n");
  fail_budget = 12;
  long f0 = fails;

  // E1: fresh ESP-NOW beats the HA mirror — HA says warm, direct link
  //     says POT4 is cold: mat must fire on the direct reading.
  reset_env();
  temp_sensor.state = 25; clone_temp.state = 24; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state=22; rootzone_temp_2.state=22; rootzone_temp_3.state=0.0f; rootzone_temp_4.state=22; // HA (stale-ish story)
  rz_now_4.state = 17.0f; rz_now_4_at = fake_ms;   // direct link: cold!
  // keep the stamp fresh across the long settle
  for (int i=0;i<3;i++){ rz_now_4_at = fake_ms; run_climate_logic(); fake_ms += 120000; }
  rz_now_4_at = fake_ms; run_climate_logic();
  INV(growmat_demand.state, "E1: fresh ESP-NOW cold pot fires mat over warm HA mirror", ctx());

  // E2: stale ESP-NOW falls back to the HA mirror — direct link died
  //     showing cold, HA says all pots warm: mat must NOT fire.
  reset_env();
  temp_sensor.state = 25; clone_temp.state = 24; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state=22; rootzone_temp_2.state=22; rootzone_temp_3.state=0.0f; rootzone_temp_4.state=22;
  rz_now_4.state = 17.0f; rz_now_4_at = fake_ms - 200000;   // 200s old -> stale
  run_ladder_settle();
  INV(!growmat_demand.state, "E2: stale ESP-NOW ignored, HA mirror rules", ctx());

  // E3: runaway detected via the direct link (HA lagging behind).
  reset_env();
  temp_sensor.state = 25; clone_temp.state = 24; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state=22; rootzone_temp_2.state=22; rootzone_temp_4.state=21;
  rz_now_1.state = 25.5f;   // >= high(24)+1 -> runaway on the direct path
  growmat_demand.state = true;
  for (int i=0;i<8;i++){ rz_now_1_at = fake_ms; run_climate_logic(); fake_ms += 10000; }
  INV(!growmat_demand.state, "E3: runaway via ESP-NOW cuts mat", ctx());
  INV(fan_intake_clone.speed >= 35, "E3: runaway via ESP-NOW flushes 2x4", ctx());

  // E4: implausible ESP-NOW value (faulted probe over the direct link)
  //     is filtered exactly like the HA path — 0.0C can't fire the mat.
  reset_env();
  temp_sensor.state = 25; clone_temp.state = 24; clone_rh.state = 75;
  clone_vpd.state = calc_vpd(24,75);
  rootzone_temp.state=22; rootzone_temp_2.state=22; rootzone_temp_4.state=22;
  rz_now_3.state = 0.0f;
  for (int i=0;i<3;i++){ rz_now_3_at = fake_ms; run_climate_logic(); fake_ms += 120000; }
  rz_now_3_at = fake_ms; run_climate_logic();
  INV(!growmat_demand.state, "E4: implausible ESP-NOW value filtered", ctx());

  printf("  ESP-NOW source-select done, new violations=%ld\n", fails-f0);
}

int main(int argc, char** argv) {
  if (argc>1 && std::string(argv[1])=="-v") g_quiet=false;
  suite_grid();
  suite_boundaries();
  suite_fuzz();
  suite_v23();
  suite_v241();
  suite_photo();
  suite_espnow();
  printf("\n==================== TOTAL: %ld checks, %ld violations ====================\n", checks, fails);
  return fails?1:0;
}
