## Learned User Preferences

- Prefer one coherent end-to-end pass over narrow phasing; keep polish and operator UX first-class, not a later polish pass.
- Demand behavioral honesty: gauges, chips, and labels must match real Light/Climate/Root Want→Got state — no blank WebGL/Sankey theater or status collages that look live when they are not; strain catalog images only when upstream media exists.
- Calibrate surfaces each expose What→Process→Expected; live calibration must state that Start holds live actuators until finish.
- Entity-bus round-trip must not gate wizard Next or primary actions — use local strain/assign/text drafts until the bus catches up.
- Operator SPA charting consolidates on ECharts (arc gauges, Sankey, charts); do not stack additional chart libraries without exhausting alternatives first.
- Operator chrome uses Probe/Plant language only (not Seat/POT); Expected/calendar stage must not read as live plant state.
- Pi brain is the control source of truth (Want→Got→Need→act), more capable than the former HA packages; hub may apply temporary offline/manual tweaks, then brain re-asserts on reconnect.
- Research peer grow/crop-steering products (OGB and others, including premium) before inventing information architecture or control UX.
- Public PD / DSC Help surfaces: contrast and readability are non-negotiable (public image).
- Prefer subagent-driven execution for large multi-bar plans; draft rules/skills until explicitly approved; commit/push only when asked.
- Park off-scope findings in `docs/FOLLOWUPS.md` rather than derailing the current pass; mega passes triage the full backlog first (reconcile stale flags vs live Pi), then phased parallel workstreams.
- Zigbee work must design the reusable add → role/zone/task → integrate path (operator picks from capability-filtered selects; task may OOS an appliance, raise a banner, or only supply a datapoint for existing automations), not one-off “wire this SKU”; introduce device types one at a time, not a massive catalog dump.

## Learned Workspace Facts

- Product path is ESPHome hub/panel/probes plus Pi DSC-Brain (SPA on `:8787`); Home Assistant is optional lab soak, not product SoT.
- Live kit probes are 1–2 (`KIT_PROBE_NUMBERS`); pot3/4 are retired from the kit (Device inventory / Advanced restore only); F-001 AC relay and F-002 clone mister are on hold indefinitely (honest OOS UI stays — not version gates or pending install work).
- Domain model is probe · plant · assignment: `assigned_plant_id` (roster | None) is separate from `idle_home` (Soil Test dock). Roster has 10 slots; retire/delete by slot number, not probe-only — stock and detached must be deletable.
- Pi brain/SPA hotpatch from Windows uses PuTTY `plink`/`pscp` with `-batch -hostkey`, not OpenSSH `scp` (password prompt hangs in agent shells); see `.audit/stress-*-hotpatch.ps1` and `dsc-pi-hotpatch.mdc`.
- Roster UI refresh: serialize `/fleet/computed` fetches, cache-bust GETs, bump brain tick after mutations; prove roster/probe edges in `brain/tests/test_roster_stress.py` (browser stress alone insufficient).
- 2×4 Climate Mode is policy-only: Follow 4x8 · Follow Plants · Custom · Off; Follow Plants is Pi-owned (~12h and on roster/assign change) and writes `clone_*` numbers only.
- SoftCal uses one ESP NVS calibration plane (gate dual stacks); do not SoftCal N/P/K as independent measured channels.
- Operator hub takeover is a temporary override; reconnect must re-plan from brain (`pending_reassert` is part of that story).
- Twin SF1000 and Zigbee/Z2M/SkyConnect are in-scope product surfaces; Zigbee onboarding is role/task binding with `capability_class` (optional `capability_override`) and operator-chosen `problem_when`, not bare device join alone. `tank_full_appliance` may OOS; `floor_flood_alert` is banner-only (never OOS). Space leak roles: `leak_floor_room` / `leak_floor_4x8` / `leak_floor_2x4`.
- Some kit Zigbee leak/liquid sensors expose wet/dry as `occupancy` (liquid present), not PIR motion — do not treat occupancy as motion for those SKUs. Climate Wet/Dry is that raw reading; Problem/Clear comes only from bound `policy_state` (SPA must not infer problem from wet).
- Light fixture PPFD maps are local static assets under `/dsc-catalog/ppfd/` (manifest + images), not vendor CDN hotlinks in the SPA.
- Recurring friction is encoded only after approval (e.g. `.cursor/rules/dsc-kit-sot.mdc`, `dsc-viz-honesty.mdc`, `dsc-roster-probe.mdc`, `dsc-pi-hotpatch.mdc`); durable ops debt stays in `docs/FOLLOWUPS.md`.
