# Pass C — Settings IA architect sketch

**Date:** 2026-08-29  
**Status:** Ready to implement (post A/B verify)  
**Explore:** agent `46341ffb-879e-44cf-9e1d-ca060e232078`

## Current

Settings is Fleet secondary `#/fleet/settings` — one ~1.1k-line `SettingsPage.tsx` scroll. Inventory already says “Probes”. SoftCal / SoilTest still pick 1–4.

## Target IA (blast radius)

| Section | Owns (from today’s dump) |
|---------|--------------------------|
| **Hub** | Appliance shell identity, backup export/import |
| **Brain** | Global tuning, Full-Auto-related scales, catalog reload |
| **Device** | Inventory in-service, assignment, probe stations, ESPHome OTA, Zigbee; SoftCal kit SoT pickers |
| **API** | Ollama + CannaLib integrations |
| **Network** | AP SSID/PSK/channel, DHCP map, Apply network (honest closed loop) |
| **Server** | ESPHome job queue dump, backup ops depth, host health if any |
| **General** | Leftover prefs; help links |

Promote **Settings** as primary (or Fleet→Settings becomes Settings with seven secondaries). Keep `/fleet/settings` → `/settings` redirect.

## Device funnel (Mycodo / ESPHome)

discover (ESPHome/Zigbee table) → assign role/placement → in-service (`patch_inventory`) → Brain consumes. Advanced restore (pot3/4) only under Device → Advanced, gated by `ALL_POT_NUMBERS`.

## SoftCal / SoilTest

`SOFT_CAL_POTS` / `POT_IDS` / lab-wet → `KIT_PROBE_NUMBERS`. Probe Stations chrome: `potN` → `Probe N` / home probe labels.

## Files (minimal)

1. `SettingsPage.tsx` → section components or hash/section state  
2. `routes.ts` + `App.tsx` — Settings primary + seven secondaries  
3. SoftCal trio + `CalibratePage` pickers  
4. Spec / FOLLOWUPS update  

Do **not** regress SETTINGS-AUDIT-7.1.2 honesty (OTA / Apply network copy).

## Verify

`#/settings` (or promoted path): seven section nav; Device shows Probe 1–2 defaults; SoftCal no pot3/4 chips; Network/API still patch; browser screenshots.
