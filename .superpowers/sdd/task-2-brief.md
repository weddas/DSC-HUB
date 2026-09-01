### Task 2: Pass 1 â€” Light SPA honesty + light UX

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/LightPage.tsx`
- Modify as needed: `.../components/energy/LightEnergyPanel.tsx`, `.../components/journal/TentOccupancyJournal.tsx`
- Build: `npm.cmd run build:spa` from `homeassistant/custom_components/dsc_hub/frontend`

**Interfaces:**
- Consumes: fleet helpers, energy APIs, journal APIs
- Produces: SPA bundle with honest chips/copy; no new subsystems

- [ ] **Step 1: Inventory gaps on live `#/live/light`**

Browser both tents: Got/Want, DARK vs WINDOW OPEN, Follow vs Independent, Twin/SF1000 OFF copy, DLI calibrate CTA, Energy Estimate label, journal provenance. List mismatches in the Light walk â€œNotesâ€ column (not FOLLOWUPS unless out of scope).

- [ ] **Step 2: Fix honesty/copy/UX in SPA**

Only change what fails inventory: wrong live-lamp copy when GPIO absent; disabled Save clarity; hierarchy/spacing; ensure Energy never implies auto-apply; keep Climate Want deep-link honest.

- [ ] **Step 3: build:spa**

```powershell
cd homeassistant\custom_components\dsc_hub\frontend
npm.cmd run build:spa
```

Expected: `spa-dist/index.html` references new `index-*.js`.

---
