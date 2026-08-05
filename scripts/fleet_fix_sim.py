#!/usr/bin/env python3
"""fleet_fix_sim.py — pure-Python model checks for the hub's fleet-heal math.

No pytest, no ESPHome build. This re-implements, in plain Python, the small
number formulas and state machines that are easy to get subtly wrong in C++
and hard to iterate on inside an ESPHome compile/flash loop:

  1. Light-quota catch-up budget         (dsc-hub-v4_0.yaml: run_clone_photoperiod)
  2. First-ledger NVS seed (no invented debt) (same script, photo_ledger_rev<1)
  3. RF status shorthand codes            (dsc-hub-fleet-heal.yaml: rf_status_ts)
  4. EVT ring-buffer freshness / TTL       (dsc-hub-fleet-heal.yaml: emit_evt + EVT|... age)
  5. Fix-attempt state machine            (fail-cap + all-links-up success gate)

Each check asserts a specific, named scenario from the task spec and prints
PASS/FAIL. main() exits 0 only if every check passes.
"""
import sys

# ======================================================================
# 1) Light-quota catch-up budget
# ----------------------------------------------------------------------
# Mirrors run_clone_photoperiod's debt_s / dark_remaining_s / min_dark_s.
# The firmware itself only carries a boolean "catchup_want" (debt_s > 0
# AND dark_remaining_s > min_dark_s) — the *budget* modelled here is the
# amount of extra light time that will actually get delivered before the
# min-dark floor forces catch-up off again, which is the number the task
# spec is really asking about ("catchup budget").
# ======================================================================


def light_quota_catchup_budget_s(target_h, missed_h, min_dark_h, night_h):
    target_s = target_h * 3600
    delivered_s = max(0, (target_h - missed_h)) * 3600
    debt_s = max(0, target_s - delivered_s)
    min_dark_s = min_dark_h * 3600
    dark_remaining_s = night_h * 3600
    available_s = max(0, dark_remaining_s - min_dark_s)
    return min(debt_s, available_s)


# ======================================================================
# 2) First-ledger NVS seed
# ----------------------------------------------------------------------
# Mirrors the photo_ledger_rev < 1 branch: on fresh NVS (or an upgrade
# mid-cycle), seed delivered_s from the CURRENT window position instead
# of leaving it at 0 — otherwise a mid-dark OTA invents a full night of
# debt and catch-up blazes the light through the night (the 5.1.6 bug
# this fixed; see FOLLOWUPS.md N-030 / hub 5.1.7).
# ======================================================================


def first_ledger_seed(dur_h, in_nominal, since_on_h=0.0):
    target_s = dur_h * 3600
    if in_nominal:
        elapsed_s = since_on_h * 3600
        delivered_s = min(elapsed_s, target_s)
    else:
        delivered_s = target_s
    debt_s = max(0, target_s - delivered_s)
    return delivered_s, debt_s


# ======================================================================
# 3) RF status shorthand codes
# ----------------------------------------------------------------------
# Mirrors dsc-hub-fleet-heal.yaml's rf_status_ts: WRB (not associated),
# CHX (associated to a BSSID that isn't the preferred one), WEAK/FAR by
# RSSI floor, else OK. Order matters: WRB short-circuits everything else;
# FAR must be checked BEFORE WEAK — every FAR rssi (<-90) also satisfies
# WEAK's (<-80), so checking WEAK first makes FAR unreachable dead code.
# This check caught exactly that bug in the real hub firmware (fixed in
# the same pass, dsc-hub-fleet-heal.yaml rf_status_ts) — this model is
# the corrected precedence, not the bug.
# ======================================================================


def rf_status_code(connected: bool, assoc_bssid, pref_bssid, rssi: int) -> str:
    if not connected:
        return "WRB"
    code = "OK"
    if pref_bssid and pref_bssid != assoc_bssid:
        code = "CHX"
    if code == "OK" and rssi < -90:
        code = "FAR"
    if code == "OK" and rssi < -80:
        code = "WEAK"
    return code


# ======================================================================
# 4) EVT freshness / TTL
# ----------------------------------------------------------------------
# The EVT ring buffer / last_evt_ts stamps an epoch per event
# (dsc-hub-fleet-heal.yaml: emit_evt). A consumer (panel, HA, or a peer
# reading "EVT|H|CODE|epoch|detail") should treat anything older than the
# TTL as stale and drop it rather than act on it.
# ======================================================================

EVT_TTL_S = 300


def evt_is_fresh(event_epoch: int, now_epoch: int, ttl_s: int = EVT_TTL_S) -> bool:
    age = now_epoch - event_epoch
    return 0 <= age <= ttl_s


# ======================================================================
# 5) Fix-attempt state machine
# ----------------------------------------------------------------------
# A per-device fix ladder: every attempt() call either (a) declares
# success once ALL THREE links are up simultaneously (wifi + espnow +
# ha — any one missing is not a fix), or (b) counts a failure. After 5
# consecutive failures the device is marked "skip" so the fleet-heal
# loop stops hammering a device that isn't coming back this session.
# ======================================================================

FIX_FAIL_CAP = 5


class FixState:
    def __init__(self):
        self.fail_count = 0
        self.status = "pending"  # pending | success | skip

    def attempt(self, wifi_ok: bool, espnow_ok: bool, ha_ok: bool) -> str:
        if self.status == "skip":
            return self.status
        if wifi_ok and espnow_ok and ha_ok:
            self.status = "success"
            self.fail_count = 0
            return self.status
        self.fail_count += 1
        if self.fail_count >= FIX_FAIL_CAP:
            self.status = "skip"
        return self.status


# ======================================================================
# checks
# ======================================================================

_results = []


def check(name, condition, detail=""):
    _results.append((name, bool(condition), detail))
    status = "PASS" if condition else "FAIL"
    line = f"  [{status}] {name}"
    if detail:
        line += f" - {detail}"
    print(line)


def run_checks():
    print("1) Light quota catch-up budget")
    budget_s = light_quota_catchup_budget_s(target_h=18, missed_h=5.5, min_dark_h=4, night_h=6)
    check(
        "target 18h, miss 5.5h, min-dark 4h, 6h night -> 2h catch-up budget",
        budget_s == 2 * 3600,
        f"got {budget_s / 3600:.2f}h",
    )
    # sanity: no debt -> no budget regardless of dark headroom
    check(
        "zero debt -> zero catch-up budget",
        light_quota_catchup_budget_s(target_h=18, missed_h=0, min_dark_h=4, night_h=6) == 0,
    )
    # sanity: debt exceeds available dark headroom -> capped, not full debt
    capped = light_quota_catchup_budget_s(target_h=18, missed_h=5.5, min_dark_h=5.9, night_h=6)
    check(
        "debt bigger than dark headroom is capped by (night - min_dark)",
        capped == round(0.1 * 3600),
        f"got {capped / 3600:.2f}h",
    )

    print("\n2) First-ledger NVS seed")
    delivered_s, debt_s = first_ledger_seed(dur_h=18, in_nominal=False)
    check(
        "fresh ledger seeded past the window -> delivered=target, debt=0",
        delivered_s == 18 * 3600 and debt_s == 0,
        f"delivered={delivered_s / 3600:.1f}h debt={debt_s / 3600:.1f}h",
    )
    delivered_s2, debt_s2 = first_ledger_seed(dur_h=18, in_nominal=True, since_on_h=5.0)
    check(
        "fresh ledger seeded mid-window -> delivered=elapsed, debt=remaining nominal",
        delivered_s2 == 5 * 3600 and debt_s2 == 13 * 3600,
        f"delivered={delivered_s2 / 3600:.1f}h debt={debt_s2 / 3600:.1f}h",
    )

    print("\n3) RF status codes")
    check("not associated -> WRB", rf_status_code(False, None, None, -40) == "WRB")
    check(
        "associated but preferred != associated -> CHX",
        rf_status_code(True, "AA:BB", "CC:DD", -40) == "CHX",
    )
    check(
        "associated to preferred, weak RSSI (<-80) -> WEAK",
        rf_status_code(True, "AA:BB", "AA:BB", -85) == "WEAK",
    )
    check(
        "associated to preferred, very weak RSSI (<-90) -> FAR",
        rf_status_code(True, "AA:BB", "AA:BB", -95) == "FAR",
    )
    check(
        "associated to preferred, healthy RSSI -> OK",
        rf_status_code(True, "AA:BB", "AA:BB", -55) == "OK",
    )
    check(
        "no preferred set yet (empty) -> not CHX",
        rf_status_code(True, "AA:BB", None, -55) == "OK",
    )

    print("\n4) EVT freshness / TTL")
    check("age 0s is fresh", evt_is_fresh(1000, 1000))
    check("age 299s (< 300s TTL) is fresh", evt_is_fresh(1000, 1299))
    check("age exactly 300s TTL is still fresh (inclusive)", evt_is_fresh(1000, 1300))
    check("age 301s (> 300s TTL) is dropped as stale", not evt_is_fresh(1000, 1301))

    print("\n5) Fix-attempt state machine")
    fs = FixState()
    for i in range(FIX_FAIL_CAP):
        fs.attempt(wifi_ok=False, espnow_ok=False, ha_ok=False)
    check(
        f"{FIX_FAIL_CAP} consecutive fails -> skip",
        fs.status == "skip",
        f"fail_count={fs.fail_count} status={fs.status}",
    )
    check("skip is sticky (no further attempts)", fs.attempt(True, True, True) == "skip")

    fs2 = FixState()
    check(
        "wifi+espnow+ha all up on first attempt -> success",
        fs2.attempt(wifi_ok=True, espnow_ok=True, ha_ok=True) == "success",
    )

    fs3 = FixState()
    fs3.attempt(wifi_ok=True, espnow_ok=True, ha_ok=False)  # ha still down -> not success
    check(
        "wifi+espnow up but ha down -> not success (counts as a fail)",
        fs3.status == "pending" and fs3.fail_count == 1,
        f"status={fs3.status} fail_count={fs3.fail_count}",
    )
    fs3.attempt(wifi_ok=True, espnow_ok=True, ha_ok=True)
    check(
        "ha recovers -> success, and fail_count resets",
        fs3.status == "success" and fs3.fail_count == 0,
    )


def main() -> int:
    run_checks()
    passed = sum(1 for _, ok, _ in _results if ok)
    total = len(_results)
    print(f"\nfleet_fix_sim: {passed}/{total} checks passed.")
    if passed != total:
        print("fleet_fix_sim: FAIL")
        for name, ok, detail in _results:
            if not ok:
                print(f"  FAILED: {name} ({detail})")
        return 1
    print("fleet_fix_sim: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
