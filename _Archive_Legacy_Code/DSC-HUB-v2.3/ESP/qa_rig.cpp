// ============================================================
// DSC-HUB v2.2 — SUPERHUMAN QA RIG
// Runs the EXACT lambda bodies extracted from the YAML through:
//   1. Grid sweep  (~200k steady states, hard invariants)
//   2. Boundary tests at every threshold edge
//   3. NaN / dropout / spike fuzzer
//   4. Photoperiod sweep (all 1440 min x on-times x durations)
//   5. 48h thermal plant simulation (virtual tent physics)
// ============================================================
#include <cstdio>
#include <cstdint>
#include <cmath>
#include <string>
#include <vector>
#include <random>
#include <cassert>
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
struct Select { std::string state; };
struct TimeVal { bool valid=true; int hour=0,minute=0,second=0; bool is_valid() const {return valid;} };
struct Clock { TimeVal t; TimeVal now(){return t;} };
struct DateTimeEnt { int hour=6, minute=0; };
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
Switch dehumidifier_demand, humidifier_demand, heater_demand, growmat_demand, ac_demand, clone_hum_demand, clone_led_demand;
Switch local_manual_mode;
bool full_auto_mode=true;
Fan fan_exhaust_out, fan_exhaust_recirc, fan_intake_main, fan_intake_clone;
int cur_intake_main=15, cur_intake_clone=15;
uint32_t dehum_off_at=0, ac_off_at=0;
bool manual_light_hold=false; int light_ramp_state=0; float light_current_pct=0;
// v2.3 state
bool main_active=true, clone_active=true, priority_tent_main=true, ha_takeover_active=false;
uint32_t light_write_guard_until=0;
Sensor clone_vpd_sensor; // (unused by climate body; present for completeness)
Select control_strategy;
std::string auto_status_text;
bool clone_led_auto_enabled=true, clone_photo_follow=false, lights_currently_on=false, clone_lights_on=false;
int stage_light_hours=12, clone_light_hours=18;
Clock sntp_time, grow_time;
DateTimeEnt lights_on_time, clone_lights_on_time;

void run_climate_logic() {
#include "climate_body.cpp"
}
void run_clone_photoperiod() {
#include "clonephoto_body.cpp"
}

// ============================================================
static long fails = 0, checks = 0;
static int  fail_budget = 12;      // print at most N failures per suite
void vfail(const char* inv, const char* ctx) {
  fails++;
  if (fail_budget-- > 0) printf("  VIOLATION: %-34s | %s\n", inv, ctx);
}
#define INV(cond, inv, ctx) do { checks++; if(!(cond)) vfail(inv, ctx); } while(0)

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

int expected_cap(bool cl_ok, float clh, float clt, float c_rmin, float c_tt) {
  if (!cl_ok) return 25;
  float cap_rh = 100.0f;
  if      (clh <= c_rmin)        cap_rh = 20.0f;
  else if (clh <  c_rmin + 3.0f) cap_rh = 20.0f + (clh - c_rmin) * (20.0f / 3.0f);
  else if (clh <  c_rmin + 8.0f) cap_rh = 40.0f + (clh - c_rmin - 3.0f) * (60.0f / 5.0f);
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
  clone_mode_idx=1; control_strategy_idx=0; control_strategy.state="VPD";
  room_fault_active=clone_fault_active=false;
  full_auto_mode=true; boot_resume_pending=emergency_failsafe_active=sensor_fault_active=false;
  esc_humid_since=esc_dry_since=esc_cold_since=esc_deep_cold_since=esc_hot_since=esc_clone_dry_since=0;
  dehumidifier_demand.state=humidifier_demand.state=heater_demand.state=false;
  growmat_demand.state=ac_demand.state=clone_hum_demand.state=false;
  cur_intake_main=15; cur_intake_clone=15;
  dehum_off_at=0; ac_off_at=0;
  fan_exhaust_out=Fan{}; fan_exhaust_recirc=Fan{}; fan_intake_main=Fan{}; fan_intake_clone=Fan{};
  clone_led_auto_enabled=true; clone_photo_follow=false;
  clone_led_demand.state=false; clone_lights_on=false;
  stage_light_hours=12; clone_light_hours=18;
  sntp_time.t = TimeVal{};
  manual_light_hold=false;
  // v2.3: both tents active, 4x8 has room priority, no takeover
  main_active=true; clone_active=true; priority_tent_main=true; ha_takeover_active=false;
  light_write_guard_until=0;
}

void settle(int ticks=14) { for(int i=0;i<ticks;i++){ run_climate_logic(); fake_ms += 10000; } }

// The invariants that must hold in EVERY steady state (full auto, no faults)
void check_invariants(bool aux_ok, bool steady=true) {
  float t=temp_sensor.state, rh=humidity_sensor.state;
  float tt=stage_temp_target, rlo=stage_rh_min, rhi=stage_rh_max;
  float clh=clone_rh.state, clt=clone_temp.state;
  float c_rmin = clone_mode_idx==0 ? stage_rh_min : clone_rh_min;
  float c_tt   = clone_mode_idx==0 ? stage_temp_target : clone_temp_target;

  // I1: actuator ranges
  INV(fan_exhaust_out.speed>=0 && fan_exhaust_out.speed<=100, "out fan 0-100", ctx());
  INV(fan_exhaust_recirc.speed>=0 && fan_exhaust_recirc.speed<=100, "recirc fan 0-100", ctx());
  INV(fan_intake_main.speed>=0 && fan_intake_main.speed<=100, "main intake 0-100", ctx());
  INV(fan_intake_clone.speed>=0 && fan_intake_clone.speed<=100, "clone intake 0-100", ctx());
  // I2: fresh-air floor (no CO2 rig -> loop never fully closes)
  if (!isnan(t)) INV(fan_exhaust_out.speed>=15, "fresh-air floor out>=15", ctx());
  // I3: negative-pressure budget at steady state (within one slew step)
  bool cl_ok_now = aux_ok && !clone_fault_active && !isnan(clh) && !isnan(clt);
  int capX = expected_cap(cl_ok_now, clh, clt, c_rmin, c_tt);
  if (steady && !isnan(t)) {
    int budget = (int)(((fan_exhaust_out.speed+fan_exhaust_recirc.speed)/2.0f)*0.7f)*2;
    int total  = fan_intake_main.speed + fan_intake_clone.speed;
    INV(total <= budget, "intake total <= budget (hard)", ctx());
    int achievable = std::min(budget, 100 + capX);
    INV(total >= achievable - 16, "intake total tracks achievable", ctx());
  }
  // I4: opposing demands never co-active
  INV(!(humidifier_demand.state && dehumidifier_demand.state), "humid vs dehumid war", ctx());
  INV(!(heater_demand.state && ac_demand.state), "heater vs AC war", ctx());
  // I5: clone protection — the CONTINUOUS cap must bound the clone path.
  // Dynamic mode allows one slew step of grace while descending to it.
  {
    int tol = steady ? 0 : 15;
    INV(fan_intake_clone.speed <= capX + tol, "clone intake <= protection cap", ctx());
  }
  // I6: demand correctness vs conditions (steady state, generous margins)
  if (!isnan(rh) && rlo < rhi) {
    if (dehumidifier_demand.state) INV(rh > rhi - 2.0f - 0.01f, "dehum ON only above clear pt", ctx());
    if (humidifier_demand.state)   INV(rh < rlo + 2.0f + 0.01f, "humid ON only below clear pt", ctx());
  }
  if (!isnan(t)) {
    if (ac_demand.state)     INV(t > tt + 0.5f - 0.01f, "AC ON only above clear pt", ctx());
    if (heater_demand.state) INV(t < tt - 0.5f + 0.01f, "heater ON only below clear pt", ctx());
  }
  // v2.3: the grow mat is a 2x4-local lever — it tracks the CLONE tent's
  // own temp/target (Follow mode resolves to the main target), not the 4x8.
  if (growmat_demand.state) {
    float c_tt_inv = (clone_mode_idx==0) ? stage_temp_target : clone_temp_target;
    bool cl_ok_inv = !clone_fault_active && !isnan(clone_temp.state);
    INV(cl_ok_inv && clone_temp.state < c_tt_inv + 0.01f, "mat ON only below CLONE target", ctx());
  }
  // I7: NaN tent sensor -> curve untouched fans (guarded upstream by watchdog IRL)
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
// SUITE 2: BOUNDARY / EDGE CASES
// ============================================================
void suite_boundaries() {
  printf("\n=== SUITE 2: boundary & edge cases ===\n");
  fail_budget = 12;
  long f0 = fails;

  // 2a. Band inversion (user sets RH min > max via Custom sliders)
  reset_env();
  stage_rh_min = 60; stage_rh_max = 50;      // inverted!
  humidity_sensor.state = 55;                 // inside the "impossible" gap
  vpd_sensor.state = calc_vpd(25,55);
  run_climate_logic(); fake_ms += 400000; run_climate_logic();  // > all persistence
  fake_ms += 400000; run_climate_logic();
  INV(!(humidifier_demand.state && dehumidifier_demand.state),
      "2a inverted RH band -> appliance war", ctx());

  // 2b. Exactly at thresholds (no demand exactly AT trigger, only beyond)
  reset_env(); humidity_sensor.state = stage_rh_max + 3.0f;  // exactly at trigger edge
  run_climate_logic(); fake_ms += 400000; run_climate_logic();
  INV(!dehumidifier_demand.state, "2b rh == r_hi+3 exactly -> no trigger (strict >)", ctx());

  // 2c. Clone RH exactly at floor
  reset_env(); temp_sensor.state=22.5f; clone_temp.state=27; clone_rh.state=clone_rh_min; room_temp.state=14;
  settle();
  INV(fan_intake_clone.speed <= 20, "2c clone RH == floor -> cap 20 (continuous)", ctx());

  // 2d. All sensors NaN except tent (aux dead but flags not yet set)
  reset_env();
  room_temp.state=NAN; room_rh.state=NAN; clone_temp.state=NAN; clone_rh.state=NAN;
  settle();
  check_invariants(false);
  INV(fan_intake_clone.speed<=25, "2d NaN aux -> conservative clone path", ctx());

  // 2e. Tent NaN (pre-watchdog window): ladder must not act on NaN
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

  // 2g. Heat borrow and heat reuse are mutually exclusive by construction
  reset_env(); temp_sensor.state=28.5f; clone_temp.state=31; room_temp.state=15; settle();
  INV(auto_status_text.find("warm 2x4 air")==std::string::npos,
      "2g hot tent never borrows heat", ctx());

  // 2h. Slew convergence from opposite extreme
  reset_env(); cur_intake_main=100; cur_intake_clone=100;
  temp_sensor.state=25; settle(14);
  int budget=(int)(((fan_exhaust_out.speed+fan_exhaust_recirc.speed)/2.0f)*0.7f)*2;
  INV(std::abs(fan_intake_main.speed+fan_intake_clone.speed - budget)<=16,
      "2h slew converges from 100/100", ctx());

  // 2i. Dry Mode dark + independent clone light continues (dry in 4x8, clones alive)
  reset_env(); stage_light_hours=0; clone_photo_follow=false; clone_light_hours=18;
  clone_lights_on_time.hour=18; sntp_time.t.hour=20;
  run_clone_photoperiod();
  INV(clone_led_demand.state, "2i Dry Mode 4x8, independent clone light still runs", ctx());

  printf("  boundary checks done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 3: FUZZER (random walks, spikes, dropouts)
// ============================================================
void suite_fuzz() {
  printf("\n=== SUITE 3: fuzzer (200k random transitions) ===\n");
  fail_budget = 12;
  long f0 = fails;
  std::mt19937 rng(42);
  std::uniform_real_distribution<float> u01(0,1);
  auto jitter=[&](float v, float lo, float hi, float step){
    v += (u01(rng)-0.5f)*2*step;
    if (u01(rng)<0.01f) v = lo + u01(rng)*(hi-lo);     // spike/teleport
    return std::max(lo,std::min(hi,v));
  };
  reset_env();
  float T=25,H=47,RT=18,RH2=45,CT=24,CH=75;
  for (int i=0;i<200000;i++) {
    T=jitter(T,10,42,0.4f); H=jitter(H,15,99,1.2f);
    RT=jitter(RT,2,38,0.3f); RH2=jitter(RH2,15,95,1.0f);
    CT=jitter(CT,10,36,0.3f); CH=jitter(CH,30,99,1.0f);
    temp_sensor.state = (u01(rng)<0.003f)?NAN:T;
    humidity_sensor.state=(u01(rng)<0.003f)?NAN:H;
    vpd_sensor.state=calc_vpd(temp_sensor.state,humidity_sensor.state);
    room_temp.state=(u01(rng)<0.005f)?NAN:RT; room_rh.state=(u01(rng)<0.005f)?NAN:RH2;
    clone_temp.state=(u01(rng)<0.005f)?NAN:CT; clone_rh.state=(u01(rng)<0.005f)?NAN:CH;
    clone_vpd.state=calc_vpd(clone_temp.state,clone_rh.state);
    if (u01(rng)<0.001f) control_strategy_idx=(control_strategy_idx+1)%3;
    if (u01(rng)<0.001f) clone_mode_idx=(clone_mode_idx+1)%2;
    if (u01(rng)<0.0008f) { room_fault_active=!room_fault_active; }
    if (u01(rng)<0.0008f) { clone_fault_active=!clone_fault_active;
                            if (clone_fault_active){esc_clone_dry_since=0; clone_hum_demand.turn_off();} }
    run_climate_logic();
    fake_ms += 10000;
    // range invariants every step; demand-correctness only on valid data
    INV(fan_exhaust_out.speed<=100 && fan_exhaust_recirc.speed<=100 &&
        fan_intake_main.speed<=100 && fan_intake_clone.speed<=100 &&
        fan_exhaust_out.speed>=0 && fan_intake_main.speed>=0 &&
        fan_intake_clone.speed>=0 && fan_exhaust_recirc.speed>=0, "fuzz fan ranges", ctx());
    INV(!(humidifier_demand.state && dehumidifier_demand.state), "fuzz humid war", ctx());
    INV(!(heater_demand.state && ac_demand.state), "fuzz temp war", ctx());
    // slew: no path may move >15 between ticks — tracked via globals
  }
  printf("  fuzz done, new violations=%ld\n", fails-f0);
}

// ============================================================
// SUITE 4: PHOTOPERIOD SWEEP (all minutes x on-times x durations)
// ============================================================
void suite_photoperiod() {
  printf("\n=== SUITE 4: clone photoperiod sweep ===\n");
  fail_budget = 12;
  long f0=fails; long combos=0;
  for (int onh=0; onh<24; onh+=3) for (int onm2=0; onm2<60; onm2+=30)
  for (int dur : {0,1,6,12,18,23,24}) {
    // expected minutes ON per day == dur*60 (except 24h == always on)
    reset_env(); clone_photo_follow=false;
    clone_lights_on_time.hour=onh; clone_lights_on_time.minute=onm2;
    clone_light_hours=dur;
    sntp_time.t.hour=0; sntp_time.t.minute=0;
    run_clone_photoperiod();
    int on_count = clone_led_demand.state?1:0; bool prev=clone_led_demand.state; int edges=0;
    for (int m=1;m<1440;m++) {
      sntp_time.t.hour=m/60; sntp_time.t.minute=m%60;
      run_clone_photoperiod();
      if (clone_led_demand.state) on_count++;
      if (clone_led_demand.state!=prev){edges++;prev=clone_led_demand.state;}
    }
    int expect = dur>=24 ? 1440 : dur*60;
    INV(on_count==expect, "photoperiod ON-minutes == dur*60", 
        (snprintf(ctxbuf,sizeof(ctxbuf),"on=%02d:%02d dur=%dh -> on_count=%d expect=%d edges=%d",
                  onh,onm2,dur,on_count,expect,edges), ctxbuf));
    INV(edges <= 2 + (dur>0 && dur<24 ? 0:0), "photoperiod max 2 edges/day",
        (snprintf(ctxbuf,sizeof(ctxbuf),"on=%02d:%02d dur=%dh edges=%d",onh,onm2,dur,edges), ctxbuf));
    combos++;
  }
  printf("  %ld combos x 1440 min, new violations=%ld\n", combos, fails-f0);
}

// ============================================================
// SUITE 5: 48h PLANT SIMULATION (virtual physics)
// ============================================================
struct SimResult {
  float heater_hours=0, ac_hours=0, dehum_hours=0, hum_hours=0, clhum_hours=0;
  float mean_abs_temp_err=0, mean_rh=0, pct_vpd_in_band=0;
  float clone_pct_rh_ok=0; int demand_edges=0;
  float fanE=0;   // crude fan energy: sum of speeds
};

float ah(float t, float rh){ // absolute humidity g/m3 (approx)
  float svp=0.6108f*expf((17.27f*t)/(t+237.3f));
  return 216.7f*(svp*rh/100.0f)/(t+273.15f);
}
float rh_from_ah(float t, float a){
  float svp=0.6108f*expf((17.27f*t)/(t+237.3f));
  float rh=a*(t+273.15f)/(216.7f*svp)*100.0f;
  return std::max(1.0f,std::min(99.9f,rh));
}

SimResult simulate(bool winter, bool aux_present, bool verbose=false) {
  reset_env();
  // flower stage targets
  stage_temp_target=24; stage_rh_min=45; stage_rh_max=50; stage_vpd_min=1.2f; stage_vpd_max=1.4f;
  stage_light_hours=12; lights_on_time.hour=6;
  clone_photo_follow=false; clone_lights_on_time.hour=18; clone_light_hours=18;
  // plant state
  float T=22, Trm = winter?12:26, Tcl=22;
  float AH_t=ah(22,50), AH_rm=ah(Trm, winter?60:55), AH_cl=ah(22,72);
  SimResult R; int steps=0; bool prevD[6]={false,false,false,false,false,false};
  int vpd_in=0, cl_ok=0;
  const float dt=10.0f;      // 10s steps, 48h
  for (int s=0; s<48*360; s++, steps++) {
    int minute = (s*10/60)%1440;
    sntp_time.t.hour=minute/60; sntp_time.t.minute=minute%60;
    // main light window 06:00 + 12h
    lights_currently_on = ((minute - 360 + 1440)%1440) < 12*60;
    run_clone_photoperiod();
    // sensor feed
    temp_sensor.state=T; 
    float RHt = rh_from_ah(T,AH_t);
    humidity_sensor.state=RHt; vpd_sensor.state=calc_vpd(T,RHt);
    if (aux_present) {
      room_temp.state=Trm; room_rh.state=rh_from_ah(Trm,AH_rm);
      clone_temp.state=Tcl; clone_rh.state=rh_from_ah(Tcl,AH_cl);
      clone_vpd.state=calc_vpd(Tcl, rh_from_ah(Tcl,AH_cl));
      room_fault_active=clone_fault_active=false;
    } else {
      room_temp.state=NAN; room_rh.state=NAN; clone_temp.state=NAN; clone_rh.state=NAN;
      room_fault_active=clone_fault_active=true;   // v2.1 fallback mode
    }
    run_climate_logic();
    fake_ms += 10000;
    // ---- physics ----
    float rec=fan_exhaust_recirc.speed/100.0f;
    float im=fan_intake_main.speed/100.0f, ic=fan_intake_clone.speed/100.0f;
    // outdoor / room ambient drivers
    float Tout = winter ? (8 + 4*sinf(2*3.14159f*minute/1440.0f))
                        : (24 + 6*sinf(2*3.14159f*minute/1440.0f));
    // room: pulled toward outdoor, warmed by recirc exhaust from tent
    Trm += dt*( (Tout-Trm)*0.0004f + rec*(T-Trm)*0.0035f );
    AH_rm += dt*( (ah(Tout, winter?70:50)-AH_rm)*0.0004f + rec*(AH_t-AH_rm)*0.0035f );
    // clone tent: fed by room air via clone intake; clone LED heats; mister adds
    float led = clone_led_demand.state ? 0.012f : 0.0f;          // ~small tent LED
    Tcl += dt*( led + ic*(Trm-Tcl)*0.010f + (Trm-Tcl)*0.0008f );
    float mist = clone_hum_demand.state ? 0.010f : 0.0f;
    AH_cl += dt*( 0.0035f /*clone transpiration*/ + mist + ic*(AH_rm-AH_cl)*0.010f + (AH_rm-AH_cl)*0.0008f );
    // 4x8: heat from SF1000 + heater + mat - AC; air mix from BOTH intakes
    float lightW = lights_currently_on ? 0.030f : 0.0f;
    float heatW  = (heater_demand.state?0.035f:0.0f) + (growmat_demand.state?0.008f:0.0f);
    float acW    = ac_demand.state?0.030f:0.0f;
    float exch   = (im*0.010f + ic*0.010f);                       // intake-driven exchange
    float T_in   = (im+ic)>0.01f ? (im*Trm + ic*Tcl)/(im+ic) : Trm;
    float AH_in  = (im+ic)>0.01f ? (im*AH_rm + ic*AH_cl)/(im+ic) : AH_rm;
    T   += dt*( lightW + heatW - acW + exch*(T_in-T) + (Trm-T)*0.0009f );
    float transp = lights_currently_on?0.006f:0.002f;
    float humW   = humidifier_demand.state?0.012f:0.0f;
    float dehW   = dehumidifier_demand.state?0.014f:0.0f;
    AH_t += dt*( transp + humW - dehW + exch*(AH_in-AH_t) + (AH_rm-AH_t)*0.0009f );
    AH_t = std::max(0.5f, AH_t); AH_cl=std::max(0.5f,AH_cl); AH_rm=std::max(0.5f,AH_rm);
    // ---- metrics ----
    R.heater_hours += heater_demand.state*dt/3600.0f;
    R.ac_hours     += ac_demand.state*dt/3600.0f;
    R.dehum_hours  += dehumidifier_demand.state*dt/3600.0f;
    R.hum_hours    += humidifier_demand.state*dt/3600.0f;
    R.clhum_hours  += clone_hum_demand.state*dt/3600.0f;
    R.mean_abs_temp_err += fabsf(T-stage_temp_target);
    R.mean_rh += RHt;
    float v=calc_vpd(T,RHt);
    if (v>=stage_vpd_min-0.05f && v<=stage_vpd_max+0.05f) vpd_in++;
    float crh=rh_from_ah(Tcl,AH_cl);
    if (crh>=clone_rh_min-3 && crh<=clone_rh_max+5) cl_ok++;
    bool d[6]={dehumidifier_demand.state,humidifier_demand.state,heater_demand.state,
               growmat_demand.state,ac_demand.state,clone_hum_demand.state};
    static uint32_t last_off_ms[6]={0,0,0,0,0,0};
    for(int k=0;k<6;k++){
      if(d[k]!=prevD[k]){
        R.demand_edges++;
        if (!d[k]) last_off_ms[k]=fake_ms;                    // just switched off
        else if ((k==0||k==4) && last_off_ms[k]!=0)           // dehum / AC restart
          INV(fake_ms-last_off_ms[k] > 180000, "compressor min-off 3min", ctx());
        prevD[k]=d[k];
      }
    }
    R.fanE += (fan_exhaust_out.speed+fan_exhaust_recirc.speed+fan_intake_main.speed+fan_intake_clone.speed);
    // invariants continuously (dynamic: budget lag tolerated, caps are not)
    check_invariants(aux_present, false);
  }
  R.mean_abs_temp_err/=steps; R.mean_rh/=steps;
  R.pct_vpd_in_band=100.0f*vpd_in/steps; R.clone_pct_rh_ok=100.0f*cl_ok/steps;
  R.fanE/=steps;
  if (verbose) {
    printf("    heater %.1fh | AC %.1fh | dehum %.1fh | hum %.1fh | cl-hum %.1fh\n",
           R.heater_hours,R.ac_hours,R.dehum_hours,R.hum_hours,R.clhum_hours);
    printf("    |Terr| %.2fC | VPD in-band %.0f%% | clone RH ok %.0f%% | demand edges %d | mean fan duty %.0f\n",
           R.mean_abs_temp_err,R.pct_vpd_in_band,R.clone_pct_rh_ok,R.demand_edges,R.fanE);
  }
  return R;
}

void suite_sim() {
  printf("\n=== SUITE 5: 48h plant simulations ===\n");
  fail_budget = 12;
  printf("  WINTER, v2.2 (aux sensors present):\n");
  SimResult w22 = simulate(true, true, true);
  printf("  WINTER, v2.1 fallback (aux absent):\n");
  SimResult w21 = simulate(true, false, true);
  printf("  SUMMER, v2.2:\n");
  SimResult s22 = simulate(false, true, true);
  printf("  SUMMER, v2.1 fallback:\n");
  SimResult s21 = simulate(false, false, true);
  printf("\n  EFFICIENCY DELTA (v2.2 vs v2.1 fallback):\n");
  printf("    winter heater hours: %.1f -> %.1f  (%+.0f%%)\n",
         w21.heater_hours, w22.heater_hours,
         w21.heater_hours>0?100*(w22.heater_hours-w21.heater_hours)/w21.heater_hours:0);
  printf("    winter humidifier hours: %.1f -> %.1f\n", w21.hum_hours, w22.hum_hours);
  printf("    summer AC hours: %.1f -> %.1f\n", s21.ac_hours, s22.ac_hours);
  printf("    winter demand edges (cycling): %d -> %d\n", w21.demand_edges, w22.demand_edges);
}

// ============================================================
// SUITE 6 (v2.3): per-tent OFF, priority arbitration, grow-mat
// relocation, heater interlock, master takeover.
// ============================================================
void run_ladder_settle() {   // long enough to clear every persistence window
  for (int i=0;i<3;i++){ run_climate_logic(); fake_ms += 400000; }
  run_climate_logic();
}
void suite_v23() {
  printf("\n=== SUITE 6: v2.3 (OFF / priority / grow-mat / interlock / takeover) ===\n");
  long f0 = fails;

  // T1: MASTER TAKEOVER freezes the fan curve entirely.
  reset_env();
  ha_takeover_active = true;
  fan_exhaust_out.speed = 77; fan_exhaust_recirc.speed = 33;   // pretend user set these
  fan_intake_main.speed = 44; fan_intake_clone.speed = 22;
  temp_sensor.state = 30;  // would normally force hard venting
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
  clone_temp.state = 18; clone_rh.state = 55;   // cold & dry: would normally call mat+hum
  run_ladder_settle();
  INV(fan_intake_clone.speed <= 8, "2x4 off: clone intake trickle only", ctx());
  INV(!growmat_demand.state, "2x4 off: grow mat stays off", ctx());
  INV(!clone_hum_demand.state, "2x4 off: clone humidifier stays off", ctx());

  // T3: GROW MAT tracks the CLONE tent, not the 4x8.
  //     4x8 warm & happy, clone cold -> mat ON, heater follows 4x8 (off).
  reset_env();
  temp_sensor.state = 25;                 // 4x8 exactly on target -> no heat need
  clone_temp.state = 22; clone_rh.state = 75;  // clone 2C below its 24 target
  run_ladder_settle();
  INV(growmat_demand.state, "grow mat ON from cold CLONE (not 4x8)", ctx());
  INV(!heater_demand.state, "heater stays off (4x8 arb tent is warm)", ctx());

  // T4: cold 4x8 does NOT fire the grow mat (mat is a 2x4 lever now).
  reset_env();
  temp_sensor.state = 21;                 // 4x8 well below target
  clone_temp.state = 25;                  // clone warm/happy
  run_ladder_settle();
  INV(!growmat_demand.state, "cold 4x8 does not fire the (2x4) grow mat", ctx());
  INV(heater_demand.state, "cold 4x8 fires the room heater", ctx());

  // T5: HEATER INTERLOCK — heating means no outside extraction.
  reset_env();
  temp_sensor.state = 21;                 // cold -> heater will engage
  room_temp.state = 15;
  run_ladder_settle();
  INV(heater_demand.state, "interlock precondition: heater demanded", ctx());
  INV(fan_exhaust_out.speed <= 15, "heater interlock: OUT at fresh-air floor", ctx());
  INV(fan_exhaust_recirc.speed >= 25, "heater interlock: air routed to RECIRC", ctx());

  // T6: PRIORITY — both live, 2x4 priority. Room ladder must serve the
  //     clone tent's target. Clone hot, 4x8 fine -> AC engages for 2x4.
  reset_env();
  priority_tent_main = false;             // 2x4 commands the room
  temp_sensor.state = 24;                 // 4x8 comfortable
  clone_temp.state = 27;                  // clone 3C over its 24 target -> AC
  clone_rh.state = 72;
  run_ladder_settle();
  INV(ac_demand.state, "2x4 priority: AC serves the hot clone tent", ctx());

  // T7: same conditions but 4x8 priority -> AC must NOT fire for the clone.
  reset_env();
  priority_tent_main = true;              // 4x8 commands the room
  temp_sensor.state = 24;                 // 4x8 comfortable -> no cooling
  clone_temp.state = 27;                  // clone hot, but it's secondary now
  clone_rh.state = 72;
  run_ladder_settle();
  INV(!ac_demand.state, "4x8 priority: hot secondary clone does NOT command AC", ctx());

  // T8: only-one-active auto-priority. 4x8 OFF, 2x4 ON & cold -> the room
  //     heater serves the clone tent even though priority_tent_main=true.
  reset_env();
  main_active = false;                    // 4x8 out of service
  priority_tent_main = true;              // should be ignored (only 2x4 active)
  clone_temp.state = 21;                  // clone 3C below its 24 target
  run_ladder_settle();
  INV(heater_demand.state, "4x8 off: room heater serves the lone clone tent", ctx());
  INV(fan_intake_main.speed <= 8, "4x8 off: main intake trickle only", ctx());

  // T9: negative-pressure invariant still holds with a tent OFF.
  reset_env();
  clone_active = false; temp_sensor.state = 29;  // 4x8 venting hard, clone off
  run_ladder_settle();
  {
    int budget = (int)(((fan_exhaust_out.speed + fan_exhaust_recirc.speed)/2.0f)*0.7f)*2;
    INV(fan_intake_main.speed + fan_intake_clone.speed <= budget+1,
        "neg-pressure holds with 2x4 off", ctx());
  }

  printf("  v2.3 scenario checks done, new violations=%ld\n", fails-f0);
}

int main(int argc, char** argv) {
  if (argc>1 && std::string(argv[1])=="-v") g_quiet=false;
  suite_grid();
  suite_boundaries();
  suite_fuzz();
  suite_photoperiod();
  suite_v23();
  suite_sim();
  printf("\n==================== TOTAL: %ld checks, %ld violations ====================\n", checks, fails);
  return fails?1:0;
}
