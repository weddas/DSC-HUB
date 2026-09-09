# Plan — Unified "Want" model & single canonical editor

**Date:** 2026-09-10
**Status:** Design / not started
**Tracker rows:** "Improvement: one canonical 'Want' editor…" + the bug "Tent cockpit Want bands disagree with the Overview/desk cards for BOTH tents…"
**Author:** live-8.2.0 walkthrough

---

## 1. Problem

The tent target bands (temp / RH / VPD "Want") are **shown and edited in at least four surfaces**, and they were observed **disagreeing for the same tent**:

- **4×8**: tent cockpit `Want 25–28 °C` vs Overview/desk `want 18–26 °C` (RH agreed at 40–55).
- **2×4**: tent cockpit `Want 24–27 °C / RH 50–60` vs Overview `25–28 °C / RH 55–65` (both differed).
- The cockpit also labelled 4×8 temp **"in-band"** while Got (24.6 °C) was **below** its own stated Want-min (25.0 °C).

Two distinct faults are tangled here:

1. **Multiple editors over one value** → drift and "which is authoritative?" confusion.
2. **Multiple band *sources* presented as one "Want"** with no stated precedence: the **stage preset**, the **plant rail / plant Want**, and the **hub target** are all real and legitimately different, but the UI conflates them.

## 2. Current state (verified 2026-09-10)

Three band concepts exist in the product today:

- **Stage presets** — Settings › Climate "SETPOINTS BY PHASE" (e.g. BULK Flower `22.5–25.5 °C / RH 45–50 / VPD 1.2–1.4`). Templates.
- **Plant rail / "plant Want"** — what the Overview cards ("want 18–26") and the tent cockpit ("plant Want") show; described elsewhere as "the plants' own rail (catalog / stage defaults per probe)".
- **Hub target** — Settings › Climate TARGETS, tagged `HUB · SYNCED` or `HUB DIFFERS · HUB <value>`, with `DEFAULT`, `Adopt hub value` / `Push brain value`. This is what's actually loaded on the hub firmware.

Each is edited on its own surface, and the desks pull "Want" from different ones — hence the disagreement.

## 3. Target model (make the three explicit)

```
stage_preset[stage]         # read-only template defaults (per stage)
   │  (seeds)
effective_want[tent|plant]  # THE band the desks show + control aims at
   │  = plant_override ?? tent_rail ?? stage_preset[current_stage]
   │  (operator edits here)
hub_target[tent]            # what the firmware currently runs
   └─ reconcile: Push (effective→hub) / Adopt (hub→effective); divergence = "HUB DIFFERS"
```

**Precedence for `effective_want`:** plant override → tent rail → stage-preset default. This is the single value every desk displays and the in-band checks use.

## 4. Design

1. **One source of truth, computed brain-side.** The brain computes `effective_want` per tent (and per plant where a plant override exists) and exposes it on the fleet/computed payload. Every SPA surface **reads** this — none recompute (the recompute-per-view is exactly what produced the drift).
2. **One canonical editor.** A single `WantEditor` component/flow (temp/RH/VPD min–max). It edits `effective_want`. All other surfaces render the value **read-only** with an **"Edit Want →"** link that opens the one editor.
3. **Every displayed band is source-labelled.** "plant Want" / "tent rail" / "stage preset (default)" / "hub target" — so the operator always knows which layer they're looking at, and when a value is an override vs a default.
4. **Hub reconcile stays.** The existing `HUB DIFFERS / Adopt / Push` UI remains, now clearly acting between `effective_want` and `hub_target`.
5. **Fix the in-band check.** Band membership must compare `Got` against the **same `effective_want` min/max shown** (the current cockpit compares against a different band → the "in-band while below min" bug).

## 5. Edge cases

| Case | Behaviour |
|---|---|
| No plant override | Fall through to tent rail, then stage preset; label "tent rail" / "stage default" |
| Multiple plants in a tent, differing overrides | The tent's controlling band follows the designated **master** (the app already has a "VPD · MASTER" concept); per-plant bands still shown on plant cards |
| Stage change | Re-derive the preset default; **keep** explicit overrides (don't silently overwrite operator intent) — surface "stage changed; preset default is now X, your override Y still applies" |
| Hub differs | Unchanged reconcile UI; divergence chip stays |
| VPD band vs leaf-VPD colouring | Out of scope here but pairs with the "VPD gauge colours out of band" bug — colour the gauge by the same effective band shown |
| Autoflower / custom stages | Preset may be absent → fall to tent rail/override; never invent a band |

## 6. Surfaces (all read the one value)

- Settings › Climate (TARGETS) — the canonical editor lives here (or is shared).
- Climate desk, tent cockpit, Overview tent cards, per-plant cards — **read-only** display of `effective_want` + source label + "Edit Want →".

## 7. Implementation sketch

**Brain**
- Compute + expose `effective_want` (per tent, per plant-override) with `source` per field.
- Keep `stage_preset`, `hub_target` distinct; expose the diff for the reconcile UI.

**SPA**
- Extract the current Want-editing widgets into one `WantEditor`.
- Replace the cockpit / desk / Overview editors with the read-only display + link.
- Fix band-membership + gauge colour to use `effective_want`.

**Migration**
- On rollout, resolve the current disagreements by adopting `effective_want` as computed; write a one-time journal note per tent recording the reconciled band.

## 8. Test plan

- All four surfaces render **identical** temp/RH/VPD Want for a given tent (snapshot test across routes).
- In-band label matches the shown min/max on every surface (regression for the cockpit bug).
- Precedence: plant override > tent rail > stage preset resolves correctly; unset layers fall through.
- Stage change keeps overrides; preset default updates.
- Hub reconcile (Adopt/Push) still moves values and the DIFFERS chip clears.

## 9. Open questions (operator's call)

1. Confirm precedence order (plant override → tent rail → stage preset) — is a per-plant override even desired, or is Want strictly per-tent?
2. When multiple plants share a tent, which one is "master" — the VPD-master probe, or an explicit choice?
3. Should a stage change ever auto-adopt the new preset (with a confirm), or always keep the prior override until edited?
