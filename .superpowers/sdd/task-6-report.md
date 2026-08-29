# Task 6 Report — Pi Bar 1 verification

**Status:** DONE (failover smoke partial)  
**Branch:** `feat/brain-control-recovery-bar1`  
**Runtime code changed:** no (hot-patch + docs only)  
**Docs commit:** `dadd8b8` — `docs: Bar 1 Pi verify evidence for brain control recovery`

## What was done

### 1. Hot-patch (Pi `192.168.86.48`)

- Packed local `spa-dist` (`index-fFZO7204.js`) + Bar 1 brain modules; `pscp` → `/tmp`; sudo `rsync` into `/opt/dsc-hub-repo/brain/{static,dsc_brain}`; `docker cp` into `dsc-hub-brain`; soft `docker restart` (no image rebuild).
- `/health` OK; served HTML references `assets/index-fFZO7204.js`.
- Container imports: `light_loop`, `hub_failover.note_reconnect` OK.

### 2. Light acceptance — PASS

Live hub had `time.dsc_hub_lights_on_time` empty → honesty `no schedule: main on-time unset` (correct). Set via `datetime.set_value` → `06:00:00`, honesty `ok`.

Browser Light desk (`?v=bar1-fFZO7204#/live/light`):

1. Follow 4×8 with ON 06:00 · OFF 18:00 — **no** Follow + NO SCHEDULE contradiction  
2. Header **SF1000 ON** (dimmer `on`, brightness attr `1`)  
3. Got / Want / Deviation from sensors (~12.7h / 12h / ~0.7h), not a free-floating 0–24 lie  

Shot: `docs/qa-screenshots-2026-08-29/bar1-light-schedule-ok.png`

### 3. Overview acceptance — PASS

Same tick as Climate: SF1000 ON; fans IN 4×8 **0%** / IN 2×4 **24%** / EX ROOM **20%** / EX OUT **15%**; MAT demand off. No manual-takeover banner (takeover off).

Shots: `bar1-overview-shared-air.png`, `bar1-climate-command.png`

### 4. Failover smoke — PARTIAL

- Bundle contains `Manual takeover — brain will re-plan on clear/reconnect`.
- Climate MASTER TAKEOVER confirm dialog works; `POST /control/service` returns `state=on`.
- **`/fleet/computed` never shows `switch.dsc_hub_manual_takeover=on`** — banner cannot light; TTL/clear path not exercised live.
- Side effect during probes: `switch.dsc_hub_tent_manual_override` appeared `on` while takeover stayed `off` (mapping/persist concern).

### 5. FOLLOWUPS + docs commit

Section appended to `docs/FOLLOWUPS.md`; screenshots under `docs/qa-screenshots-2026-08-29/`.

## Self-review

| Brief check | Result |
|-------------|--------|
| Hot-patch SPA + brain, careful restart | yes |
| Light: no false NO SCHEDULE when on-time set | yes |
| Light: SF label / Got Want Deviation | yes |
| Overview SF/MAT/fans agree | yes |
| Failover toggle + banner + clear | partial (persist fail) |
| Screenshots + FOLLOWUPS + docs commit | yes |

## Concerns

1. **`manual_takeover` does not persist** into `hass_extras` after successful control/service — blocks Bar 1 failover UX verify.  
2. **`tent_manual_override` flapped** during takeover attempts — check hub entity map / write path.  
3. **Dimmer brightness `1`** → SPA `readSfBrightnessPct` may treat as 100% on 0–1 scale while brain `dsc_light_effectively_off` says 0.4% — header still "SF1000 ON" (acceptable for on/off; % honesty deferred).  
4. Left live schedule at **06:00:00** (was empty).

## Files touched

| Path | Action |
|------|--------|
| Pi `/opt/dsc-hub-repo/brain/static` + container `/app/static` | hot-patched SPA |
| Pi brain modules in container | hot-patched |
| `docs/FOLLOWUPS.md` | Bar 1 section |
| `docs/qa-screenshots-2026-08-29/bar1-*.png` | evidence |
| `.superpowers/sdd/task-6-report.md` | this report |
