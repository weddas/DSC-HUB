# UX & feature suggestions — 7.4 (cannabis-domain + research triage)

**Date:** 2026-08-28  
**Sources:** `/cannabis-domain` skill (lifecycle, VPD, photoperiod, honesty rules); live 7.4 deploy (`index-p97kKy-P.js`); [`LIGHT-AUDIT-7.4-live.md`](LIGHT-AUDIT-7.4-live.md); [`PLAN-7.4.md`](PLAN-7.4.md) D3; [`PARALLEL-UX-7.4-PENDING.md`](PARALLEL-UX-7.4-PENDING.md); [`UX-AUDIT-7.1.md`](UX-AUDIT-7.1.md); [`WORKFLOW-AUDIT-7.1.md`](WORKFLOW-AUDIT-7.1.md).

**Parallel deep research:** **Not available.** `parallel-cli` never ran; items tagged `[parallel-pending]` are placeholders until `dsc-hub-ux-qol-7.4.md` exists.

---

## Cannabis-domain read on current dashboards

| Surface | Domain fit | Gap |
|---------|------------|-----|
| **Stage rail** (`tentWant.ts`) | Good — ordered germ→dry; drives light hours, VPD, RH | Empty-tent fallback still bleeds 4×8 grow stage into 2×4; no **autoflower** path (age-based, not 12/12) |
| **Light desk** | Photoperiod + dark violation = correct for photo plants | No **DLI** (PPFD×hours); 4×8 “Got” is window not canopy PPFD; lights-on unset breaks all schedule UX |
| **Climate** | VPD bands per tent match clone (lower) vs flower (higher) practice | Leaf VPD shown but not tied to stage copy; no explicit **RH during late flower** (35–45% band) callout |
| **Root** | Moisture, EC, pH, dryback = core irrigation signals | No stage-aware **dryback target** chip; germ/seedling mat vs rooted not obvious on Overview |
| **Compose / Research** | Strain pick → tent/medium = lifecycle start | Catalog chemistry is claim-tier; UI must not present bank % as lab fact (honesty ladder) |
| **Twin / airflow** | Spatial mental model for lung↔tent exchange | Particles scaffold only — CFM trim not yet tied to “what changes for clones vs flower” |

**Honesty rules that should shape UI copy:** indica/sativa labels in catalog = morphology/marketing, not pharmacology; flush/final 48–72h = stage rail exists but should not imply settled science; CO₂ proxy is informational until SCD41 (F-008).

---

## Consolidated suggestions (new or still open)

Priority: **P0** = blocks correct grow ops or violates domain honesty · **P1** = high QoL / closes workflow · **P2** = polish · **P3** = defer / needs parallel research

### Photoperiod & light (photo plants)

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P0 | L-01 | **Force-set / surface 4×8 lights-on time** on first visit when empty | Without it, clocks and timeline are useless (`LIGHT-AUDIT`) |
| P0 | L-02 | **Separate “schedule Follow” vs “climate Follow”** in one banner per 2×4 card | Two hub selects; conflating them causes wrong stage/window mental model |
| P1 | L-03 | **Show computed DLI** on Light desk: `hours × effective PPFD` (from cal curve if present, else “—”) | Domain: DLI is the actionable metric for veg vs flower, not hours alone |
| P1 | L-04 | **Stage-aware Want hours chip** — “Flowering · 12h rail” not “outside stage rail” | Tired operator needs stage name, not band jargon |
| P1 | L-05 | **Manual light hold + auto photoperiod conflict panel** when both ON during dark | Explains violation before user toggles blindly |
| P2 | L-06 | **Sunrise/sunset ramp preview** on timeline (dimmed edges) | Matches SF1000 ramp entities; sets expectation for gradual vs instant |
| P2 | L-07 | **Upcoming transition chip** — “Flip to 12/12 in N days” when stage rail ahead of schedule | Supports 4×8 flower / 2×4 veg clone split you described |
| P3 | L-08 | Autoflower tent profile (ignore 12/12; age-based day counter) | `[parallel-pending]` — only if autos enter roster |

### Tent separation (4×8 flower → 2×4 clones)

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P0 | T-01 | **Per-tent stage rail only from pots in that tent** — no global grow_stage fallback on Light chips | Deployed split scheduler; Want bands still inherit wrong stage when tent empty |
| P1 | T-02 | **“Move plant” wizard** — reassign pot, optionally copy photoperiod template (veg 18h vs flower 12h) | Your stated workflow: mothers/clones leave 4×8, 2×4 becomes veg nursery |
| P1 | T-03 | **Rename nav subtitles** — “4×8 · Flower” / “2×4 · Clone & veg” (size stays in tab) | UX-AUDIT P0-2: four vocabularies for same boxes |
| P1 | T-04 | **Independent 2×4 lights-on** editable when Independent; show why disabled when Follow | Live audit: Independent but fields readonly |
| P2 | T-05 | **Empty-tent playbook** — “No plants · assign via Roster or Compose” with deep link | Replaces “no plant/stage rail” engineer copy |

### Climate & VPD

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P1 | C-01 | **Stage rail label on Climate Want panel** per tent (same as Light) | Operator connects VPD target to flowering vs seedling |
| P1 | C-02 | **Clone vs flower VPD honesty line** — “Targets from stage rail; leaf VPD is canopy estimate” | Domain: leaf VPD ≠ air VPD; avoid over-trust |
| P1 | C-03 | **Alert → action** — dark violation chip → Light desk; VPD critical → Climate with tent focused | WORKFLOW-AUDIT P1-6 |
| P2 | C-04 | **Late flower RH reminder** when stage ≥ Late Flowering (40–45% band note) | Domain band; optional chip, not automation |
| P2 | C-05 | Finish **D2 airflow particles** + trim sliders; retire SVG when parity signed | PLAN-7.4 D2; domain: visualize lung exchange for clone humidity |

### Root & irrigation

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P0 | R-01 | **Fix Overview pot1 moisture map** (`_soil_moisture` vs `_got_moisture`) | WORKFLOW P0 — landing lies about pot1 |
| P1 | R-02 | **Dryback % vs stage** on Root card — Want band from pot helpers | Domain: dryback targets shift veg→flower |
| P1 | R-03 | **Germ/seedling badge** when stage ≤ Seedling (mat demand, higher RH want) | Separates clone propagation from flower pots |
| P2 | R-04 | **EC/pH unit clarity** on charts (µS/cm vs ppm500) | Domain: never invent feed charts; show unit from sensor |
| P2 | R-05 | Mobile probe soil test → auto-attach to pot timeline | Closes calibrate→root loop |

### Compose, catalog, roster

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P1 | G-01 | **Clear compose draft on retire** + “unsaved draft” warning | WORKFLOW P0 leftover gun |
| P1 | G-02 | **Research → Compose handoff to step 2** with strain locked | PLAN-7.4 D3 |
| P1 | G-03 | **Chemistry chips tier-labeled** — “bank claim” vs “lab COA” in Research | Cannabis-domain trust ladder |
| P1 | G-04 | **Default coco preset + remember last tent** in wizard | PLAN-7.4 D3 |
| P2 | G-05 | **Feminized / regular / auto** seed class in compose (when catalog has it) | Domain: do not collapse seed classes |
| P2 | G-06 | **Roster as Grow landing**; Compose as action | UX-AUDIT IA — grower asks “what’s planted?” first |

### Overview, Mission, operator mental model

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P0 | O-01 | **Hub online chip on Overview** (match Dash/Mission) | UX-AUDIT P0-3 |
| P1 | O-02 | **One “home”** — merge or demote Dash/Mission overlap; Overview = glance, Mission = triage only | UX-AUDIT P0-1 |
| P1 | O-03 | **Empty vs OOS vs live** legend on Root strip | UX-AUDIT P0-4 |
| P1 | O-04 | **Photoperiod strip** on Overview links to Light + shows both tents’ phase (lit/dark) | PLAN photoperiod deep-link |
| P2 | O-05 | Replace **KIT HONEST** with grower language (“Sensor gaps” + count) | UX-AUDIT P1-1 |
| P2 | O-06 | Grow log filter: **Alerts only / Stage changes / Climate** | Domain: stage transitions matter more than dehum chatter |

### Fleet, calibrate, trust

| Pri | ID | Suggestion | Rationale |
|-----|-----|------------|-----------|
| P1 | F-01 | **Single in-service SoT** — inventory vs hub pot switches | WORKFLOW P1-4 |
| P1 | F-02 | **Learning vs Calibrate** — one door or clear “sample fans” vs “edit curves” | UX-AUDIT nav confusion |
| P2 | F-03 | **PPFD / PAR acceptance** surfaces estimated DLI on Light after cal | Links tune pass to daily desk |
| P3 | F-04 | OTA from SPA (currently ticket stub) | WORKFLOW P0 firmware |

### From parallel interim (until full research runs)

| Pri | ID | Suggestion | Source |
|-----|-----|------------|--------|
| P1 | P-01 | Operator checklist when **re-homing plants** between tents | PARALLEL interim + your move plan |
| P1 | P-02 | **QoL: compact cockpit mode** — clocks + one gauge row on 4×8/2×4 | PLAN-7.4 D3 |
| P2 | P-03 | Twin pot select → Compose pre-fill tent | PLAN-7.4 D3 |
| P2 | P-04 | Catalog recent picks + strain filter presets | PLAN-7.4 D3 |
| P3 | P-05 | `[parallel-pending]` Full UX/QoL report merge | Run `/parallel-setup` + poll |

---

## Recommended 7.4 sequencing (after D1 deploy)

1. **P0 blockers:** L-01, L-02, T-01, R-01, O-01  
2. **Domain-coherent pass:** L-03–L-05, T-02–T-04, C-01–C-03, G-01–G-03  
3. **D2 airflow** (C-05) then **D3** with parallel research doc merged into this file  
4. **Defer:** autoflower profile, OTA, deep catalog genetics UI

---

## Next step for parallel research

When `parallel-cli` is installed, run poll → append **Section: Parallel research merge** below with de-duplicated items and mark promoted rows above as `merged`.
