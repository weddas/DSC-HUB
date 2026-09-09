# Plan — Closed-loop irrigation (steering → shot → arbitrated write → verify)

**Date:** 2026-09-10
**Status:** Design / not started — **safety-sensitive (live grow)**
**Tracker rows:** "Appliance driver closes its loop on what it commanded, never on what the relay actually is"; the irrigation `on_time=0` fix; the deferred R3 "arbitrated relay writer"; batch B1 (next-feed ETA) / B2 (dry-run preview)
**Author:** live-8.2.0 walkthrough

---

## 1. Current state (verified in code)

- **Shot primitive exists but is fire-and-forget.** `irrigact.py:irrigation_shot(pot_id, duration_s)` resolves the bound Zigbee `plug_pump` seat and publishes `{"state":"ON","on_time":max(1,int(round(dur)))}` to `zigbee2mqtt/<friendly>/set`. Guardrails today: pump-required (honest OOS when none), a max duration, and the `on_time` floor (never 0 → the plug's own auto-off can't be disabled). **No verification** that the shot happened or that the substrate responded.
- **The relay path trusts *commanded* state.** `appliance_driver.py` tracks `_relay_commanded[seat_id]`; `_set_sonoff_relay` short-circuits when the commanded value already matches, and records `relay_on` history **on command**, not on observed relay state — the tracked "closes its loop on what it commanded, not what the relay actually is" bug.
- **Steering computes dry-back + P1–P3** (`sensor_trust`/steering; Root shows `-6.06 %/h`, phases) but there is **no automatic steering→shot** path and **no arbitration** — manual shots, a future automation rule, the demand loop, and safety cutoffs can all write a relay independently.
- Root today: "No pump bound → shot editor withheld" (honest). This spec is what lights up when a pump **is** bound.

## 2. Goal

A safe, verified, single-writer irrigation loop:

```
steering(dryback phase, VWC target)
   → shot plan (size, interval)
   → ARBITRATED write (one owner per relay/plug)   ← R3
   → verify (relay actually switched; VWC responded)
   → journal + adjust
with safety gates and a watchdog OFF at every layer.
```

## 3. Design

### 3.1 Arbitrated relay/plug writer (R3) — prerequisite
- One module owns every relay/plug write. All intents (steering shot, manual shot, automation rule, appliance demand, safety cutoff) go through it as **requests with a priority**; safety-OFF always wins.
- It reconciles **commanded vs observed**: after writing, read back the actual relay/plug state (Sonoff relay state, Zigbee plug `state`) and record **that** as history — fixing the "loop on commanded" bug for every appliance, not just the pump.
- Single-writer removes the cross-loop race the Zigbee cut-out already showed (asyncio.Lock across loops).

### 3.2 Shot planner
- From current VWC, dry-back rate, the P1–P3 thresholds and the day/night VWC targets (all already in Settings › Root), compute **shot size (duration)** and **next-shot time**. (B1's next-feed ETA is the read-only projection of this; B2's dry-run preview is this planner with the write disabled.)
- Phases: P1 saturating shots to field capacity → P2 maintenance shots → P3 overnight dry-back (no shots). The plan is per pot (per plant), routed by the pot/probe model.

### 3.3 Verification (the new safety net)
- After a shot: expect the relay/plug to report ON then auto-OFF, **and** VWC to rise by ≥ X% within N minutes.
- **No response → alarm + hold:** "shot delivered, no VWC response" ⇒ likely dry reservoir, blocked line, or the plug didn't switch. Withhold further shots for that pot and raise an alert (not silent).
- **Overshoot / continuous rise → stuck-on:** brain-side watchdog issues an OFF and alarms, belt-and-suspenders to the plug's own `on_time` auto-off.

## 4. Safety gates (all must hold before a shot fires)

| Gate | Rule |
|---|---|
| Pump bound & in service | else honest OOS (today's behaviour) |
| Max shot duration | existing cap |
| Max shots/day, max daily volume | new — hard ceilings per pot |
| Min inter-shot interval | new — no machine-gunning |
| Tank-empty / low-level gate | no shot if reservoir below threshold (ties to the reservoir spec) |
| Dark-period gate | no shots in the dark window unless explicitly enabled |
| VWC sanity | don't shoot a pot already at/above field capacity |
| Probe trust | don't steer off a dark/untrusted probe (use the dark-timer) |
| Watchdog OFF | brain forces OFF if a plug stays ON past expected + margin |

## 5. Edge cases

| Case | Handling |
|---|---|
| Pot has no probe (pot/probe model) | manual shots only, no auto-steering; label clearly |
| Plug offline mid-shot | verify fails → alarm; assume worst-case ON and watchdog OFF |
| Brain restart mid-shot | on boot, force every pump OFF (appliance_driver already cut relays OFF on restart — extend to pumps), then resume planning |
| Two pots share one pump | serialize shots; the arbiter queues |
| Operator manual shot during auto | manual is a higher-priority request through the same arbiter; auto plan re-projects afterward |
| MQTT offline | `irrigation_shot` already returns "shot not sent" — surface it, never assume delivery |

## 6. Surfaces

- Root Shots/Irrigation: the live shot editor + plan + last-shot result + next-shot ETA (B2's preview becomes live when a pump binds).
- Alerts catalogue: "irrigation delivered no response", "reservoir low", "pump stuck on".
- Journals: every shot (planned/manual), its verification result, and volume — feeding the harvest report.

## 7. Test plan

- Arbiter: priority ordering (safety-OFF beats all); commanded-vs-observed reconciliation records observed state; no two writers race a relay.
- Planner: P1/P2/P3 transitions; day/night targets; per-pot routing; dry-run == live-plan (minus the write).
- Verification: VWC-response success; no-response → alarm+hold; stuck-on → watchdog OFF.
- Safety gates: each gate blocks a shot in isolation; dark-period + tank-empty + max-daily enforced.
- Failure injection: plug offline, MQTT down, brain restart mid-shot (boot-OFF), dry reservoir.
- **Never run destructive tests against the live grow** — simulate the pump seat.

## 8. Open questions (operator's call)

1. VWC-response threshold and window (X%, N min) per medium (coco vs living soil — the two live pots differ)?
2. Default daily volume / shots-per-day ceilings?
3. Are dark-period shots ever allowed (some steering strategies do a pre-dawn shot)?
4. Manual override scope — single shot vs a timed manual session, and how it interacts with the auto plan?
