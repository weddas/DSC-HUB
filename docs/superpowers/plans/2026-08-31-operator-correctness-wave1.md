# Operator correctness Wave 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Honest SoftCal/Soil/lab assignment chrome, uniform cal What/Process/Expected strips, Build-a-Plant nickname flush on Next, dropdown stacking fixes, Learning demotion copy — with Pi evidence.

**Architecture:** SPA-only honesty pass. SoftCal reads fleet `assigned_plant_id` for kit probes; Calibrate tabs get a shared `CalOutcomeStrip` component; PlantWizard blurs focused inputs before step change so `EntityText` commits; CSS stacking for wizard selects. No auto-detach.

**Tech Stack:** React SPA (`SoftCalWizard`, `CalibratePage`, `PlantWizard`, `SoilTestWizard`, `LearningWizard`, `ui.tsx`, `dsc.css`), Vite `build:spa`, Pi `:8787` smoke.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-31-operator-correctness-wave1-design.md`
- SoftCal **allowed** on assigned probes; chip shows assignment; **no** silent auto-detach
- Fan SoT = Fleet → Calibrate; Learning link/copy only
- Probe/Plant language; behavioral honesty
- Zigbee + pump/PWM/2×4 hardware out of scope
- Commit only when user asks
- Prefer blur-active-element flush over a new global registry unless blur proves insufficient

### File map

| File | Responsibility |
|------|----------------|
| `frontend/src/components/CalOutcomeStrip.tsx` (new) | What / Process / Expected strip |
| `SoftCalWizard.tsx` | Assignment chip + strip |
| `CalibratePage.tsx` | Fan/lab/peer strips + assigned banners |
| `SoilTestWizard.tsx` | Assigned banner + strip |
| `PlantWizard.tsx` | Blur-before-Next/commit |
| `LearningWizard.tsx` | Demotion copy |
| `dsc.css` | Select stacking / overflow |
| `docs/FOLLOWUPS.md` | Wave 1 done after evidence |

---

### Task 1: `CalOutcomeStrip` + SoftCal assignment chip

**Files:**
- Create: `homeassistant/custom_components/dsc_hub/frontend/src/components/CalOutcomeStrip.tsx`
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/components/SoftCalWizard.tsx`

**Interfaces:**
- Consumes: fleet pots / inventory `assigned_plant_id`, roster nickname if available
- Produces: `<CalOutcomeStrip what process expected />`; SoftCal header chips

- [ ] **Step 1: Add strip component**

```tsx
export function CalOutcomeStrip({
  what,
  process,
  expected,
}: {
  what: string;
  process: string;
  expected: string;
}) {
  return (
    <div className="dsc-cal-outcome" style={{ fontSize: 12, marginBottom: 10 }}>
      <p><strong>What:</strong> {what}</p>
      <p><strong>Process:</strong> {process}</p>
      <p><strong>Expected:</strong> {expected}</p>
    </div>
  );
}
```

- [ ] **Step 2: SoftCal — assignment + strip**

For selected kit probe N, resolve `assigned_plant_id` from fleet inventory `potN` (or fleet pots). Chip:

- `Probe N · Unassigned · SoftCal OK` when empty
- `Probe N · {short plant id or nickname} · SoftCal OK` when set

Add strip copy from spec SoftCal row.

- [ ] **Step 3: Build SPA**

```bash
cd homeassistant/custom_components/dsc_hub/frontend && npm run build:spa
```

Expected: exit 0

- [ ] **Step 4: Commit** (only if user asked)

---

### Task 2: CalibratePage + SoilTest banners/strips + Learning copy

**Files:**
- Modify: `CalibratePage.tsx` (FanCalibrateWizard, LabWet, SoilCalHonesty/peer)
- Modify: `SoilTestWizard.tsx`
- Modify: `LearningWizard.tsx`

- [ ] **Step 1: Fan strip + live-hold warning**

Above fan steps, `CalOutcomeStrip` per spec fan row. Near Start: explicit “Start holds live fans.” Keep curves status visible.

- [ ] **Step 2: Lab wet + peer strips**

Same component; lab expected = script success / peer ≠ lab; peer strip per spec.

- [ ] **Step 3: SoilTestWizard**

If target probe has `assigned_plant_id`, show banner: `Probe has a plant — SoftCal OK; detach before Soil Test move if relocating the probe.` Plus soil-test outcome strip.

- [ ] **Step 4: Lab wet assigned banner**

Same banner when calibrating an assigned kit probe.

- [ ] **Step 5: LearningWizard**

Tighten ownership blurb: guided fan session on Calibrate; this page same helpers.

- [ ] **Step 6: `npm run build:spa`**

- [ ] **Step 7: Commit** (only if user asked)

---

### Task 3: Build-a-Plant nickname flush + select stacking

**Files:**
- Modify: `PlantWizard.tsx`
- Modify: `styles/dsc.css`

- [ ] **Step 1: Flush before Next/commit**

In `goNext` and commit handlers, before reading nickname/helpers:

```ts
const el = document.activeElement;
if (el instanceof HTMLElement) el.blur();
// optional: await microtask so onBlur commit runs
await Promise.resolve();
```

Prefer this over a flush registry first.

- [ ] **Step 2: CSS stacking**

```css
.dsc-wizard-panel .dsc-input,
.dsc-wizard-panel select.dsc-input {
  position: relative;
  z-index: 2;
}
.dsc-wizard-panel {
  overflow: visible; /* if safe; else only overflow-x */
}
/* Decision panel: avoid clipping native selects when no catalog picker */
.dsc-decision-panel:not(:has(.dsc-catalog-picker)) {
  overflow: visible;
}
```

Audit visually; do not break catalog drawer scroll.

- [ ] **Step 3: Build SPA**

- [ ] **Step 4: Commit** (only if user asked)

---

### Task 4: FOLLOWUPS + Pi evidence

**Files:**
- Modify: `docs/FOLLOWUPS.md`
- Optional: `.audit/` smoke notes / screenshots under `docs/qa-screenshots-2026-08-31/`

- [ ] **Step 1: Deploy SPA to Pi** (`docker cp` / existing hotpatch pattern; `timeout 25 docker restart` only if needed)

- [ ] **Step 2: Smoke checklist**

1. SoftCal chips show pot1/pot2 assignments  
2. Soil Test banner when assigned  
3. Nickname → Next without blur still on review  
4. Fan strip + live-hold copy visible  
5. Dropdown open on compose assign not clipped  

- [ ] **Step 3: Update FOLLOWUPS** dated Wave 1 section → done (live) / soak notes

- [ ] **Step 4: Commit** (only if user asked)

---

## Self-review (plan vs spec)

| Spec item | Task |
|-----------|------|
| SoftCal assignment chip | 1 |
| Soil/lab banners | 2 |
| Outcome strips all types | 1–2 |
| Learning demotion | 2 |
| Nickname flush | 3 |
| Select stacking | 3 |
| Pi evidence | 4 |
| No auto-detach / no Zigbee | Global |

## Execution handoff

After user approves the written Wave 1 **spec**, execute this plan (subagent-driven recommended). If the spec is still draft, do not ship SPA until they say the design is approved.
