### Task 6: Pi Bar 1 verification

**Files:**
- Evidence: `docs/qa-screenshots-2026-08-29/bar1-light-*.png`, `bar1-overview-*.png`, `bar1-climate-*.png`
- Update: `docs/FOLLOWUPS.md` with Bar 1 result rows
- Use skill: `.cursor/skills/dsc-spa-pi-verify/SKILL.md` if present

- [ ] **Step 1: Hot-patch** SPA `spa-dist` + brain modules to Pi `192.168.86.48` (existing pscp/plink pattern); avoid hung restart where possible

- [ ] **Step 2: Light acceptance**

Hard-reload Light. Confirm:
1. No Follow 4x8 + â€œNO SCHEDULEâ€ when `time.dsc_hub_lights_on_time` is set  
2. Header SF label matches dimmer on + brightness  
3. Got / Want / Deviation from same sensors (no free-floating 0â€“24 lie)  
4. Screenshots saved

- [ ] **Step 3: Overview acceptance**

SF / MAT / fans agree with Climate/Light for same tick; manual takeover banner if on.

- [ ] **Step 4: Failover smoke**

If safe: toggle manual takeover on Climate; confirm banner; clear; confirm override clears (or wait TTL in lab only).

- [ ] **Step 5: FOLLOWUPS + commit docs**

```
docs: Bar 1 Pi verify evidence for brain control recovery
```

---

