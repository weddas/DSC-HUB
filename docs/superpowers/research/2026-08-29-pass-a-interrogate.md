# Pass A design interrogate

**Pass A design review (readonly)** — gaps that would still leave kit/honesty bugs after implementing the written spec.

### critical
1. **Fleet map ≠ fleet producers (dryback / rate / NPK).** A4 says fix `ENTITY_FLEET_MAP` + held readings, but never requires the **payload** to carry those metrics or to key-match them. Today `fleetFromHass` only fills `moisture_pct` / `soil_temp_c` / `ec_us` / `ph`; brain uses `nitrogen|phosphorus|potassium`, while a map of `n|p|k` / `dryback_pct` / `moisture_rate` still yields nulls. Worse: `fleetEntityAvailable` is seat-`online`, not “metric present,” so Root can keep empty dryback dials and lying NPK chips after a “map fix.” Spec must require producer+key alignment **or** omit gauge when `fleetLiveNumber` is null.

2. **Kit Pulse SoT consumer missing.** A1 lists “Kit Pulse spokes → `KIT_PROBE_NUMBERS`,” but spokes come from `KIT_DEFS` → `buildKitNodesFromFleet`, which still expands `ALL_POT_NUMBERS` (planned 3/4 as “Not installed”). Exporting `KIT_PROBE_NUMBERS` and fixing Root alone still leaves Dash/Mission/Fleet pulse as a 4-probe kit. Name `KIT_DEFS` / `buildKitNodesFromFleet` as mandatory consumers (filter to kit, Advanced restore only for 3/4).

### warning
3. **`isPotInServiceWithFleet` scope too narrow.** A3 binds Root/Live only; A1 honesty still implies HA `isPotInService`. `activePotNumbers`, `sensorHonesty`, `potTrust`, tent Live, and Root today all use the helper path — Fleet inventory can disagree with HA booleans and honesty can still nag about non-kit seats unless OOS list **and** in-service predicate both use kit + WithFleet.

4. **A7 Root-only verification vs “single kit SoT.”** A6 allows Twin/Mission untouched; callers still hardcode `ALL_POT_NUMBERS` (`TwinKeepAlive`, `LiveMissionPage`, `TuneAnalytics` p3/p4 series, `CropScheduler`). Pass A can “pass” while operator still sees pot3/4 furniture off Root. Either shrink those to kit in A, or add an explicit non-goal + follow-up so implementers don’t claim kit truth is done.

5. **NPK honesty under-specified.** A4’s OR (“hold path **or** hide”) lets Root keep `available()` chips → permanent `—` (or `0` when nitrogen exists as zero). No rule for SoftCal/EC-derived labeling, `sensor_fault`, or “hide entire chip row when unmapped.” A7.4 will flap unless the preferred path is **one**: hold+label **or** omit.

6. **Gauge scale + dual glow under-specified.** A5 wants printed min/mid/max and single glow; `ArcGauge` has tick **lines** only (no scale text) and **SVG `feGaussianBlur` + CSS** `.dsc-gauge-value` `drop-shadow` keyframes. Expanding viewBox alone fails A7.5 and leaves dual glow. Spec should require scale `<text>` (or bar ends) and name/remove the CSS glow.

7. **TuneFleet “defaults” wording too weak.** A1 says inventory toggles (default) → kit, Advanced restore keeps 3/4 — but `TuneFleetPages` still shows Pot 3/4 `InventoryInServiceToggle` inline (and “Pot N” labels). Spec should say: hide 3/4 from default Fleet kit UI; restore only under Device → Advanced.

### nit
8. **Vocabulary / CSS scar consumers omitted.** A2/A7 cover “Open … seat” / POT2 chrome, but not HelpTip POT copy, Notes “seat,” drawer `Plant seat · POT`, SoftCal/`SoilTestWizard` 1–4 pickers, or CSS `.dsc-pot-card*` vs JSX `DSC-Probe-card` (OOS styles dead). Easy to leave POT language and broken OOS styling after a “chrome pass.”