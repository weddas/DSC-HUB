# DSC-HUB — Master follow-up list

Standing process for every plan:

1. **Start:** read this file; pull in-scope items into the plan  
2. **During:** note findings, warnings, incomplete fixes, red flags  
3. **End:** append a dated section (do not leave soak/log issues in chat only)

Categories: `red-flag` · `soak` · `deferred` · `next-plan` · `out-of-scope` · `done`

---

## Seed — deep dive + OOS pass (2026-08-03)

### deferred (hard / site)

| ID | Item | Notes |
|---|---|---|
| F-001 | Physical AC hardware + follower relay | In-service stays OFF until installed |
| F-002 | Physical clone mister + follower | In-service stays OFF |
| F-003 | Replace/repair POT3 probe | In-service OFF; mat vote excluded |
| F-004 | Nest / home AP channel lock | No router changes in DSC scope |
| F-005 | Multi-lever learn baseline engine | Fans+mat air-lever gate is interim |
| F-006 | HA-link flap root-cause campaign | Softened bounce in 5.1.x; still ~frequent offs |
| F-007 | Panel OOM / LVGL discipline | Panel on 5.1.14 heap healthier; keep watching |
| F-008 | SCD41 / real CO₂ sensor | ADC dynamic CO₂ demoted to informational |
| F-009 | Full Auto ≠ complete climate with reduced kit | UX honesty; capacity offline cues |

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-001 | Preferred BSSID ≠ current while Lock ON | Self-customize relearn exists; verify after hub 5.1.3 flash |
| N-002 | Fleet version skew cleanup | Flash Control/pots if still on old wifi stubs |
| N-003 | Soak warnings from OOS deploy | Fill after ~30 min post-flash soak |
| N-004 | Orphan helper cull pass | leaf_offset kept; unused Sankey/deltas audit |
| N-005 | Cooldown / open-loop wait retune | Evidence-based only; no site hardcodes |

### out-of-scope

| ID | Item |
|---|---|
| X-001 | Whole-house non-DSC purge |
| X-002 | Building physical AC/mister/POT3 in software alone |

### Process note

After each execution pass, append:

```markdown
## YYYY-MM-DD — <plan name>

### soak
- …

### red-flag
- …

### next-plan
- …
```

---

## 2026-08-03 — Device out-of-service + deep-dive follow-through

### done (this pass)

- Single `*_in_service` gate (AC / mister / pots); retired `*_actuator_wired`
- Soft capacity / reduced-kit cues; pot alerts gated; alert_count no dead-demand
- Hub 5.1.3 OTA: Full Auto skips OOS rungs; emergency fans-only if AC OOS
- HA surface 5.1.3 synced (`2499faf` / `bce6543`); dashboard In-service UI
- `docs/FOLLOWUPS.md` created

### soak (~30+ min post hub 5.1.3 flash)

- Hub link stayed **on**; uptime ~3000 s; FW **5.1.3**; HA surface **5.1.3**
- Full Auto **on**; `ac_auto` / `clone_humidifier_auto` **off**; AC/mister demands **off**
- Reduced kit: `AC, Clone mister, POT3`; no POT3 chemistry alerts
- First OTA attempt reset mid-upload; second (and version-string) OTA OK
- Preferred AP mismatch still **on** (`58:D9:D5:D7:AA:82` vs preferred `C4:E3:CE:68:73:93`)
- Alert count ~9 dominated by real pot1/2/4 moisture/pH + preferred mismatch (not OOS spam)

### next-plan / soak carry

| ID | Item | Notes |
|---|---|---|
| N-001 | Preferred BSSID ≠ current while Lock ON | Still open after 5.1.3 |
| N-002 | Flash Control/pots if wifi stubs not live | Mesh patches in tree; verify versions |
| N-006 | Full Auto NVS after OTA | Came up Full Auto **off** once after flash; operator re-armed |
| N-007 | Purge orphan `dsc_ac_actuator_wired` entity if still in registry | Entity registry leftover |
| N-008 | UNC-path ESPHome compile | Windows build must use local temp, not NAS path |

### red-flag

- None new blocking climate control during soak
