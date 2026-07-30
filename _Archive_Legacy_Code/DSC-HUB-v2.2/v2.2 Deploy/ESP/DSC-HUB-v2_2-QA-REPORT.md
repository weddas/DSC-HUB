# DSC-HUB v2.2 — QA Campaign Report

**Build under test:** `dsc-hub-v2_2.yaml` (2,872 lines, QA build) · **Method:** the exact lambda bodies are extracted from the YAML and executed on a host inside a stubbed ESPHome API, so the code that passed QA **is** the code that ships. Rig: `qa_rig.cpp` (reproducible).

## Scale

**24,176,680 checks · 0 violations** on the final build.

| Suite | Coverage |
|---|---|
| Grid sweep | 2,096,640 settled states: tent T×RH × room T×RH × clone T×RH × 3 strategies × 2 clone modes, hard invariants at each |
| Boundaries | Inverted bands, exact thresholds, all-NaN aux, NaN tent, emergency mid-borrow, slew from extremes, Dry-Mode-plus-clone-light |
| Fuzzer | 200,000 random transitions with 0.3–0.5% NaN injection, spikes, strategy/mode/fault flips |
| Photoperiod | 112 window combos × all 1,440 minutes — ON-minute counts exact, ≤2 edges/day |
| Plant sim | 4 × 48 h virtual-physics runs (winter/summer × v2.2/v2.1-fallback), invariants checked every 10 s step |

## Invariants enforced everywhere

Fans 0–100. Fresh-air floor OUT ≥ 15. **Intake total ≤ exhaust budget (negative pressure is a hard invariant).** Intake tracks the achievable budget. Clone intake ≤ continuous protection cap (±1 slew step when dynamic). No humidifier/dehumidifier co-activation. No heater/AC co-activation. Demands only ON beyond their hysteresis clear points. Compressors never restart within 3 min. Emergency freezes the router.

## Findings → fixes (all verified by re-run)

**F1 · Negative-pressure breach (severe).** The clone tent's own flush request (up to 60%) was served on top of the exhaust budget — steady states existed with intake ≈ 2× exhaust → positive tent pressure → smell leaks. *Fix:* hard budget clamp (`clone_i ≤ budget`, main gets the remainder ≥ 0).

**F2 · Cold-clone protection gap.** The 30% cold cap applied only to *borrowed* air; the clone tent's *own* humidity-flush could still run 60% of 15 °C room air through cold clones. *Fix:* the cap is unconditional — cold beats damp, always.

**F3 · Appliance war on inverted bands.** Custom sliders with RH min > max put both humidifier **and** dehumidifier ON simultaneously, permanently. *Fix:* all bands (main RH, VPD, clone RH) normalised with `fminf/fmaxf` at point of use.

**F4 · Compressor short-cycling.** Reality gates cut escalation waits to 60 s — correct for escalation, but they also allowed dehumidifier/AC restarts 60 s after stopping. *Fix:* 3-minute minimum-off for both compressor appliances (`dehum_off_at` / `ac_off_at`); sim verified zero restart-gap violations.

**F5 · Cap boundary oscillation.** The stepped cap (100→30 at exactly target−1 °C) made the router wobble ±15% forever when a reading hovered on the boundary. *Fix:* caps are now **continuous** linear ramps (RH: 20 at floor → 40 at floor+3 → 100 at floor+8; cold: 30 at target−1.5 → 100 at target−0.5) — no boundary exists to oscillate around, and no new state was needed.

**F6 · Chain service (two legs).** The daisy-chain means the 2×4 only exchanges what the 4×8 exhausts. (a) *Flush leg:* when the clone tent wants more flush than the budget carries and venting is climate-safe (tent ≥ target, room not hotter, no heating demand, not reusing heat), OUT lifts gently (≤45%). (b) *Borrow leg:* when borrowing heat/humidity exceeds the budget, **RECIRC** lifts (≤70%) instead — the borrowed heat loops room → 2×4 → 4×8 → room rather than being thrown outside. The initial flush-leg version raised summer AC by pulling hot room air; the room-temp guard fixed it.

## Measured results (48 h sims, v2.2 vs v2.1 fallback)

| Metric | Winter | Summer |
|---|---|---|
| Heater hours | 3.0 → **2.2 (−27%)** | 0 → 0 |
| Mean fan duty | 245 → **227 (−7%)** | 248 → **226 (−9%)** |
| VPD in-band | 13% → **23%** | 12% → **20%** |
| Clone tent RH in-band | 0% → 0%* | 0% → **72%** |
| AC hours | 5.2 → 6.0 | 24.7 → 26.5 |
| Temp error (mean abs) | 1.59 → **1.49 °C** | 3.16 → **3.05 °C** |

The summer AC increase (+1.8 h) is the price of actually operating a second controlled environment — it buys the clone tent going from unmanaged (0% in-band) to 72% in-band. Winter nets a clear power win: −27% heater, −7% fans.

*Caveats, honestly stated:* the plant model is a crude first-order toy (small clone LED, fast thermal mass) — directionally right, not calibrated to your tents. \*Winter clone RH pegged high in-sim because the model's clone tent runs cold, the cold cap correctly limits drying flush, and **v2.2 has no clone-dehumidify rung by design** (ventilation-only; a saturated cold clone tent is handled by mode choice / dome venting, or a future rung if real-world data demands one). Sim demand-edge counts rose vs v2.1 because v2.2 escalates faster by design; compressors are now dwell-protected, and real tents cycle far slower than the toy model.

## Residual recommendations (not implemented, low priority)

1. **Recirc futility trim** — when room RH ≥ tent RH, high recirc can't dry; capping it near 45% would shave fan duty further. Skipped: recirc also provides canopy air movement, which has value regardless.
2. **Clone over-humidity rung** — only if real-world 2×4 data shows sustained RH ceiling breaches that the capped flush can't clear.
3. Borrow thresholds (Δ1 °C / Δ5% RH) remain the tuning knobs if the router feels hesitant on marginal nights — commented at the donor-selection block.
