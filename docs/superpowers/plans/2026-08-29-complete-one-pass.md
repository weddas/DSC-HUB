# Complete one-pass (Zigbee-first) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship DSC-HUB complete one-pass with Zigbee product path (radio + add→role→auto-integrate) first, then Twin SF1000, Bar3/IrrigAct, late stack, honesty/IR — verified on Pi with FOLLOWUPS evidence.

**Architecture:** Keep zigbee2mqtt + Mosquitto + SkyConnect. Bindings SoT is ieee-keyed `zigbee_device_bindings`. Ingest routes by role; canopy only from canopy roles. Twin SF1000 is a new GPIO5 PWM light. Bar3 SoT before IrrigAct. Sequenced verifiable units; no ZHA rewrite.

**Tech Stack:** Python FastAPI brain, zigbee2mqtt:2, ESPHome hub YAML, React SPA (Settings/Climate/Twin), pytest, Pi docker compose.

## Global Constraints

- Specs: `docs/superpowers/specs/2026-08-29-zigbee-roles-onboarding-design.md`, `2026-08-29-twin-sf1000-design.md`, `2026-08-29-root-steering-irrigact-design.md`
- Flash SkyConnect policy **B**: try `ember` first; flash 7.4.x only on measured HOST_FATAL; no factory reset without operator OK
- Pi brain `192.168.86.48:8787`; prefer SPA-only `docker cp`; soft kill/start — avoid hanging `docker restart`
- No cloud `/orchestrate` without `CURSOR_API_KEY`
- Do not invent actuators; OOS when hardware missing
- Commit only when user asks

---

## Task 1: ZB0 — ember adapter + recovery docs

**Files:**
- Modify: `services/dsc-hub/zigbee2mqtt/configuration.yaml`
- Modify: `docs/ops/ZIGBEE-RECOVERY.md`
- Modify: `docs/FOLLOWUPS.md` (ZB-P0-1 status note)

- [ ] **Step 1:** Set `serial.adapter: ember` in repo `configuration.yaml`
- [ ] **Step 2:** Update ZIGBEE-RECOVERY.md: ember is default; FW 7.4.x flash path; policy B; do not wipe DB
- [ ] **Step 3:** Baseline capture (readonly): note current `/health` zigbee + z2m logs if Pi reachable
- [ ] **Step 4:** Deploy/sync config to Pi z2m volume when safe; verify no HOST_FATAL or escalate to flash (operator)
- [ ] **Step 5:** Predicate: `radio_up=true` ≥15m **or** FOLLOWUPS dated “needs desk flash”

---

## Task 2: ZB-On1 — bindings schema + canopy honesty (TDD)

**Files:**
- Modify: `brain/dsc_brain/zigbee_mqtt.py`
- Modify: `brain/dsc_brain/api.py`
- Modify: `brain/dsc_brain/fleet_state.py` (if needed)
- Test: `brain/tests/test_brain_pi.py`

- [ ] **Step 1:** Write failing tests: unbound T/RH does not set `fleet.canopy`; bound `canopy_4x8` does; ieee bind survives friendly_name change
- [ ] **Step 2:** Implement `_bindings_map()` reading `zigbee_device_bindings` + migrate placements
- [ ] **Step 3:** Change ingest to route by role; kill first-sensor-wins
- [ ] **Step 4:** Add `GET /settings/zigbee/roles`, `PUT /settings/zigbee/bindings`; enrich devices GET
- [ ] **Step 5:** Run pytest; fix until green

---

## Task 3: ZB-On2 — Settings Role/Zone UI

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx`
- Modify: fleet API client if needed (`fleetApi.ts`)

- [ ] **Step 1:** Replace free-text placements SoT with Role + Zone selects + Save
- [ ] **Step 2:** Show status Unbound/Bound/Conflict; Unbound count chip
- [ ] **Step 3:** Build SPA; deploy; screenshot Unbound→Bound (or mock with fixture if radio down)

---

## Task 4: W0 — honesty residuals + improve-react HIGHs

**Files:** per `react-doctor-report.json` and honesty FOLLOWUPS (CatalogResearch navigate-in-render; useHass/useHeldReading ref-in-render; Twin/Climate/Cannalib gates)

- [ ] **Step 1:** Fix React Doctor HIGHs
- [ ] **Step 2:** Close honesty residual gates with screenshots/API dumps
- [ ] **Step 3:** Update FOLLOWUPS

---

## Task 5: SF1 — Twin SF1000 GPIO5

**Files:**
- Modify: `firmware/v4/dsc-hub-v4_0.yaml`
- Modify: SPA Twin / entity maps / `history_ops.py` as needed

- [ ] **Step 1:** Add GPIO5 PWM + light name Twin SF1000; leave GPIO23 clone
- [ ] **Step 2:** Map SPA Twin 4×8 to twin entity; window fallback
- [ ] **Step 3:** FOLLOWUPS hardware note; OTA when authorized

---

## Task 6: B3 — root_steering SoT

**Files:**
- Create: `brain/dsc_brain/root_steering.py`
- Create: SPA `rootSteering.ts`
- Modify: Root page + API
- Test: new pytest module

- [ ] **Step 1:** Failing tests for phase/dryback from fixtures
- [ ] **Step 2:** Implement SoT + expose
- [ ] **Step 3:** SPA read-only bind; verify Root

---

## Task 7: IA — IrrigAct

**Files:** brain control APIs + audit; Zigbee `plug_pump` consumer if bound

- [ ] **Step 1:** Guardrailed shot API; OOS if no seat
- [ ] **Step 2:** Evidence: audit log + relay/plug or OOS row

---

## Task 8: Late — TwinViz, UUID, SoftCal AI, pot3/4

- [ ] TwinViz: no blank 300×150; CFM honest or removed
- [ ] Plant UUID beyond `slot:N` + migration
- [ ] SoftCal + climate-mode AI guardrails
- [ ] pot3/4 Advanced restore + kit policy

---

## Task 9: Close

- [ ] Decision trail TSV (show-me-your-work) if shipping PR
- [ ] FOLLOWUPS dated for every in-scope item
- [ ] Goal completion audit against falsifiable done list

---

## Execution order

Task 1 → 2 → 3 (Zigbee product) in parallel with Task 4 only after ZB0 baseline if honesty is independent. Then 5 → 6 → 7 → 8 → 9.
