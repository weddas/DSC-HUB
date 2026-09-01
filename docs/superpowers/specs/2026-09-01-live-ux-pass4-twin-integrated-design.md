# Live UX Pass 4 — Twin-first integrated — Design

**Date:** 2026-09-01  
**Status:** **Pass 4 proven** (2026-09-01 gate GREEN — Twin software + integrated Live re-walk + debt closeout + FOLLOWUPS) — plan [`2026-09-01-live-ux-pass4-twin-integrated.md`](../plans/2026-09-01-live-ux-pass4-twin-integrated.md)  
**Parent:** [`2026-09-01-live-ux-honesty-program-design.md`](2026-09-01-live-ux-honesty-program-design.md) (Passes 1–3 proven; Pass 4 proven)  
**Domain:** Live desks + Twin SF1000 software path (4×8); honesty + light UX

## Problem

Passes 1–3 proved each Live desk in isolation. Pass 4 must (1) complete Twin PWM **software** as if the 4×8 lamp were present, (2) re-walk Live end-to-end and feed findings into a debt wave, (3) clear that debt plus known parks, and (4) full-stress prove with a durable FOLLOWUPS write-up. Physical lamp run is deferred; operator needs a clear **GPIO5** handoff for later rig-up.

## Goals

1. **Phase A — Twin software path:** 4×8 Twin on/off + brightness, hybrid Got, DutyStrip/history honest when Twin is the live path; GPIO5 reserved documented.
2. **Phase B — Integrated re-walk:** Light → Climate → Overview matrix; inventory only (minimal fixes); emit Phase B findings list for Phase C.
3. **Phase C — Debt closeout:** Fix all in-scope B findings, always including SV-P1-6 / DutyStrip, AirPathMap cascade alias, GAUGE-P0-1 moisture band.
4. **Gate:** Full stress (pytest + Pi HTTP + browser) + filled walk + **full FOLLOWUPS section from gate results** (required for green).
5. Leave **Pass 5** as stub for leftovers after this gate.

## Non-goals

- Physically powering or optically verifying the Twin lamp this pass
- Zigbee new recipes; F-001/F-002 install; pot3/4 restore
- 2×4 SF1000 PWM hardware redesign (except DutyStrip/history honesty if still 0.0H while ON)
- Chart-library swaps; Mission Triage rewrite
- Inventing Pass 5 requirements beyond parking leftovers

## Constraints (operator-locked)

| Choice | Decision |
|--------|----------|
| Approach | **A** — Twin-first → re-walk → debt → one prove |
| Phase B → C | B inventories and **passes findings to C**; C consumes the list |
| Prove | Full stress (Pass 1–3 grade) |
| Twin | Software as if present; no physical lamp required for gate |
| Got SoT (4×8) | **Hybrid** — Twin when available + healthy brightness/on history; else window |
| Hardware unlock | Twin PWM software only; GPIO5 reserved for later wire-up |
| Gate FOLLOWUPS | Mandatory full dated write-up from gate results/issues |

## Approach

```text
Phase A  Twin PWM software (4×8) — as if present; GPIO5 reserved note
    ↓
Phase B  Integrated Live re-walk — inventory → Phase B findings table
    ↓
Phase C  Debt closeout — B findings + named parks
    ↓
Gate     Full stress + walk filled + FOLLOWUPS write-up → green
```

---

## §1 Phase A — Twin PWM software (4×8)

**In scope**
- `light.dsc_hub_twin_sf1000` is the live 4×8 actuator for on/off + brightness (existing hub/ESP path); UI end-to-end without requiring optical output.
- **Hybrid Got:** prefer Twin when entity available and brightness/on history healthy; else photoperiod window with honest degrade copy.
- **DutyStrip / Actual:** 4×8 Actual hours follow Twin (or hybrid source) when Twin is live — not window-only forever (addresses SV-P1-6 family for Twin).
- Honesty copy: when Twin available, no “no GPIO lamp” theater; still state **GPIO5 reserved** for physical PWM (ops/FOLLOWUPS — never claim “wired” until physical).
- History ingest: Twin on/brightness samples must feed DutyStrip and Got hybrid (extend `history_ops` / hub ingest if gaps).
- Confirm patterns for live actuators stay as existing Light desk requires.

**Out of scope**
- Physical rig-up, PPFD measure, 2×4 PWM hardware.

**Operator handoff (required artifact)**  
One durable line in FOLLOWUPS + walk: **Hub GPIO5 = reserved for Twin SF1000 PWM module** (tonight/tomorrow wire-up).

---

## §2 Phase B — Integrated re-walk (inventory)

**In scope**
- Cross-desk matrix: Light (incl. Twin hybrid), Climate, Overview — both tents where exposed.
- Photoperiod glance vs Light SoT; journals; Sankey; KIT HONEST; banners vs grow log.
- **Minimal fixes** only if needed to complete inventory (e.g. crash blockers).

**Produces**
- `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md` section **Phase B findings**: severity, desk, evidence, in-scope vs Pass 5.
- Named parks always appear on the list if still open: SV-P1-6 / DutyStrip, AirPathMap cascade ← intake alias, GAUGE-P0-1 Overview moisture vs Root Want.

**Does not**
- Clear the debt list (that is Phase C).

---

## §3 Phase C — Debt closeout

**In scope**
- Fix **all** Phase B findings marked in-scope for Pass 4 (honesty + light UX + Twin software).
- Always clear (if still open):
  1. DutyStrip Actual vs ON (4×8 Twin primary; 2×4 SF1000 if still broken)
  2. AirPathMap cascade uses `sensor.dsc_cfm_cascade_2x4_allocated` (not `intakeClone` alias)
  3. Overview moisture band = Root `potWantBand` / seat rail; missing Want → unbanded, not fake 30–70 in-band

**Out of scope finds**
- Tagged Pass 5 / FOLLOWUPS — never silently dropped.

---

## §4 Gate + FOLLOWUPS write-up

**Prove**
- Local pytest for brain edges touched (Twin history/Got helpers, reduced-kit if touched, etc.).
- Pi hotpatch (plink/pscp); HTTP for Twin entity, energy confirm gates, journals, fleet, CFM cascade.
- Browser matrix all three desks + Twin software controls (no physical lamp).
- Walk `LIVE-UX-PASS4-WALK-2026-09.md` fully filled; restore any mutate stress.

**FOLLOWUPS (gate-blocking)**  
Dated section must include:
- What passed / failed / flaked at gate
- Residual issues + severity
- Parks for Pass 5
- Twin software status + **GPIO5 reserved** physical handoff
- Bundle hashes

Gate is **not green** until this write-up is committed to `docs/FOLLOWUPS.md`.

---

## §5 Pass 5 stub

After Pass 4 gate green: fresh `/brainstorming` for soak leftovers and anything Phase C deferred. Do not invent Pass 5 requirements here.

## §6 Error handling & restore

- Record pre lights-on / Twin brightness before mutate stress; restore; no active shift plans left.
- Do not claim physical PWM wired.
- Secrets never in walk/FOLLOWUPS bodies.

## §7 Success

Phase A Twin software path live; Phase B findings consumed by C; named parks cleared or explicitly deferred with reason; full-stress gate green; FOLLOWUPS gate write-up landed; GPIO5 handoff clear for operator.

## Artifacts

| Artifact | Role |
|----------|------|
| This design | Pass 4 SoT |
| Implementation plan | Phases A→B→C→Gate tasks |
| `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md` | Inventory + prove matrix |
| `docs/qa-screenshots-2026-09-01-live-ux/` | Pass 4 shots |
| FOLLOWUPS dated Pass 4 section | Gate-blocking write-up |

## Related

- Parent program design / plan (Passes 1–3)
- Skill `dsc-space-photoperiod-journal`; rules `dsc-space-energy.mdc`, `dsc-pi-hotpatch.mdc`
- Firmware note: GPIO5 reserved for 4×8 light + PWM (`firmware/v4/dsc-hub-v4_0.yaml` comments)
