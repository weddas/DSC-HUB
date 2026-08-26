# Settings audit — DSC-HUB 7.1.0

**Date:** 2026-08-27  
**Scope:** Pi SPA Settings completeness and honesty — every device, integration, and operator lever the surface claims to cover.  
**Distinct from:** design, interactive catalog, workflows, UX mental-model (sibling 7.1 audits).  
**Live:** `http://192.168.86.48:8787/#/fleet/settings` (also `http://dsc-brain.local:8787/#/fleet/settings`). `.30` is not the Brain.  
**Hash:** real route is **`/#/fleet/settings`** (Fleet → Settings). `/#/settings` is **not** mapped — it hits the SPA Not-found page. `/#/system` redirects to Fleet Overview, not Settings.  
**Method:** live GET of every Settings API + in-browser walk of every section. Danger controls documented only — **not fired:** Apply network, Queue OTA/compile, import backup, in-service toggles, permit-join. Safe probes fired: `POST /settings/integrations/test-ollama`, `POST /settings/integrations/test-cannalib`, `GET /settings/catalog/status`, `GET /settings/calibration/*`.  
**Code:** `SettingsPage.tsx`, `fleetApi.ts`, `brain/dsc_brain/api.py` + `settings.py`, `network_apply.py`, `esphome_jobs.py`, `integrations.py`, `zigbee_mqtt.py`, `device_calibration.py`, `backup_ops.py`.

---

## Verdict

Settings is a **purpose-built operator console shell**, not a leftover Lovelace dump. The page is one long appliance form with real GET/PATCH wiring.

It is **not yet an honest console.** Several levers claim to do work they do not do (OTA queue, Apply network restart). The settings sqlite still holds a **Home Assistant helper dump** (`compose_helpers_json`, `plant_roster_slots_json`) that the UI never shows. Device assignment and Zigbee add/placement are empty write-sinks. Fleet Overview’s “Kit / In service” toggles are a **dead HA-shaped twin** of the Settings checkboxes.

**Configured vs labeled (live 2026-08-27):** product firmware **7.0.0.0** on hub / pots / sonoffs matches the cards; hub is on AP `DSC-Brain` at `10.42.0.10` matching Network; CannaLib remote and Ollama tests succeed. Control/panel, ESPHome “last seen”, Zigbee, assignment, and OTA copy do **not** match live truth.

---

## Top 8 defects

| # | Pri | Defect |
|---|-----|--------|
| 1 | **P0** | ESPHome “Queue OTA / compile” inserts a sqlite ticket and tells the operator to open `:6052`. No worker flashes anything. Copy says updates are sent over the air. Two jobs already sit `queued` forever (control + hub). |
| 2 | **P0** | Apply network copy says it restarts the hub’s Wi-Fi. Backend only writes `hostapd.conf` / `dnsmasq.conf` into the data dir and returns a `systemctl` hint. It does not restart the Pi AP, and it is not the hub’s radio. |
| 3 | **P0** | Panel is live (`/fleet.panel` online, firmware 7.0.0.0, host 10.42.0.11). Settings inventory seat is `control`. `resolveSeat("control")` never finds `fleet.panel`, so the card shows **CONTROL OFFLINE**, firmware —, last seen —. |
| 4 | **P0** | `GET /settings` returns the AP PSK in plaintext and dumps unused HA helper JSON (`compose_helpers_json`, `plant_roster_slots_json`) into the SPA. The password field is bound to that value (length 8). |
| 5 | **P1** | Three in-service stories: Settings sqlite checkboxes (wired), Fleet Overview `input_boolean` toggles (disabled, show “—”), hub firmware `switch.dsc_hub_*_in_service` (pots 1–3 **off** while inventory pot1/2/4 are **on**). AC / clone mister / tank exist on Fleet Overview only. |
| 6 | **P1** | Device assignment (function / placement / max %) is empty for all 10 seats. `extra.function`, `extra.placement`, `capability_max_pct` are written to sqlite and **never read** by climate, CFM, or lights. Copy claims they tell the brain what each sensor/fan measures. |
| 7 | **P1** | Firmware honesty gap: cards show product **7.0.0.0**; hub also reports `esphome_version` **2025.12.4** (Pi image `esphome/esphome:2025.12.4`) which Settings never displays. ESPHome table “Last seen” column marks live sonoffs **offline** because the API only stamps `last_firmware`/`online` for hub + pots. |
| 8 | **P1** | Zigbee: labeled SkyConnect + “permit join (2 min)” + extra-sensor placement. Live: `GET /settings/zigbee/devices` = `[]`, canopy empty, no add UI, no join-state chip. Sqlite `zigbee_permit_join` is already `true` while z2m yaml defaults `permit_join: false`. Settings does not show that split. |

---

## Live kit vs what Settings shows

| Device | Live `/fleet` | Settings inventory card | In Settings inventory? |
|--------|---------------|-------------------------|------------------------|
| hub | online, FW 7.0.0.0, IP 10.42.0.10, RSSI −35, uptime ~345 min, SSID DSC-Brain | ONLINE, 7.0.0.0, 10.42.0.10, RSSI −35 dBm, 345 min | yes |
| panel / control | `panel` online, FW 7.0.0.0, host 10.42.0.11 | **CONTROL OFFLINE**, FW —, last seen — | yes, wrong seat id |
| pot1 | online 7.0.0.0 @ 10.42.0.21 | ONLINE 7.0.0.0 | yes |
| pot2 | online 7.0.0.0 @ 10.42.0.22 | ONLINE 7.0.0.0 | yes |
| pot3 | **absent** from `/fleet.pots` (ingest skips `in_service=false`) | OFFLINE, FW —, in service no | yes — labeled offline, not OOS |
| pot4 | online 7.0.0.0 @ 10.42.0.24 (moisture/pH null) | ONLINE 7.0.0.0 | yes |
| heater / heatmat / humidifier / dehumidifier | all online 7.0.0.0 | ONLINE 7.0.0.0 | yes |
| AC | planned OOS (no inventory row) | — | **missing** |
| clone mister | planned OOS | — | **missing** |
| tank | planned OOS | — | **missing** |
| fans / SF1000 | hub controls (live duties) | — | **missing** as seats |
| extra / Zigbee sensors | none reported | empty “No Zigbee devices…” | no add / no placement rows |

MAC is `null` on every inventory row. DHCP reservation lines in `apply_network` cannot bind.

---

## 1. Fleet inventory

Copy: *“Every device with its address, firmware, online state, and service status.”*

| Control / field | What it does | Wired? | Live |
|-----------------|--------------|--------|------|
| Seat card (icon + id) | Identity | GET `/settings` + `/fleet` | 10 cards: control, 4 sonoffs, hub, pot1–4. No AC/mister/tank/fans/light. |
| Role | Inventory `role` | GET | Matches seed (`panel`, `pot`, `sonoff_*`, `hub`). |
| IP / host | Inventory host, else fleet host | GET | All `10.42.0.x` AP-era addresses; match live fleet hosts. |
| MAC | Inventory mac | GET | All **—**. Never captured. |
| Firmware | `seat.firmware` or `values.firmware_version` | GET `/fleet` | 7.0.0.0 on live seats. **—** on control + pot3. Hub `esphome_version` 2025.12.4 not shown. |
| Uptime | `values.uptime` / 60 | GET | Hub only (345 min). Sonoffs/pots —. |
| RSSI | `wifi_rssi` / `rssi` | GET | Hub only (−35 dBm). |
| Online | fleet seat `online` | GET | Honest except **control** (false negative) and **pot3** (offline because skipped, not because radio is dead). |
| Function / Placement | `extra.function` / `extra.placement` | GET | All **—**. |
| Last seen | fleet `last_seen` | GET | Live seats “Aug 27, 06:36 AM”. control/pot3 —. |
| In service checkbox | `PATCH /settings/inventory/{seat}` `{in_service}` | **Wired — danger** | pot3 unchecked; others checked. **Not toggled this audit.** |

**Honesty:** cards are a real inventory+fleet merge, not theater. Completeness fails: missing kit seats, control/panel id split, pot3 “offline” vs OOS, no extra sensors.

---

## 2. Device assignment

Copy: *“Function and placement tell the brain what each sensor/fan measures. Capability override caps max fan/light output when hardware differs from nameplate.”*

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| Function text | Writes `extra.function` | PATCH inventory | Empty placeholders (`intake_temp`). |
| Placement text | Writes `extra.placement` | PATCH inventory | Empty (`4x8 intake duct`). |
| Max % | Writes `extra.capability_max_pct` | PATCH inventory | Empty. |
| Save (per row) | Sends extra blob | **Wired write; unread** | 10 rows, all blank. |

`capability_max_pct` / `extra.function` have **no brain consumers**. `extra.placement` is only consulted by Zigbee ingest when `extra.zigbee_friendly_name` is also set — Zigbee devices are not inventory rows, so this table cannot place them. No UI for `zigbee_placements` JSON.

**Missing:** user-defined placement/function for extra sensors; per-device calibration links.

---

## 3. Network

Copy: *“Channel is limited to 1, 6, or 11. Applying restarts the hub's Wi-Fi — devices reconnect on their own.”*

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| AP SSID | `settings.ap_ssid` | GET/PATCH `/settings` | `DSC-Brain`. Hub `wifi_ssid` is `DSC-Brain`. |
| AP PSK | `settings.ap_psk` | GET/PATCH (plaintext GET) | Set (`ap_psk_set: true`). Password field bound (8 chars). Value not repeated here. |
| Channel select | `ap_channel` ∈ {1,6,11} | GET/PATCH | `6`. |
| DHCP map table | From inventory host/mac | GET `/settings/network` | 10 seats, hosts filled, MAC —. |
| Apply network | PATCH settings then `POST /settings/network/apply` | **Danger — not fired** | Backend writes files under data `network/`; returns restart command. Does **not** restart. Copy names the wrong radio (hub vs Pi AP). |
| Save settings (page footer) | PATCH entire settings object | Wired | Also re-saves hidden HA dump keys if they are in React state. |

`eth_uplink: eth0` is returned by the API and **not rendered**.

---

## 4. Integrations

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| Ollama URL | `ollama_base_url` | GET/PATCH | `http://192.168.86.2:11434` |
| Ollama model | `ollama_model` | GET/PATCH | `llama3.1:8b` |
| Test Ollama | `POST /settings/integrations/test-ollama` | **Wired** (hits saved URL, not dirty form) | `ok: true`; model list includes `llama3.1:8b` plus others. |
| CannaLib API URL | `cannalib_api_url` | GET/PATCH | `http://192.168.86.2:8790` |
| CannaLib API key | `cannalib_api_key` | GET/PATCH password | Empty; remote is `auth: public`. |
| Local sqlite fallback checkbox | `cannalib_use_local_fallback` | GET/PATCH | Checked (`true`). Catalog status: `local_db_present: false`. |
| Test CannaLib | `POST /settings/integrations/test-cannalib` | **Wired** | `ok: true`, CannaLib `0.4.0-stdlib`, `sample_count: 1`. |

Honest and live. Gap: Test uses last **saved** values; unsaved edits are ignored. No “Save” on this card except the page-footer button.

---

## 5. Catalog

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| Status note | `GET /settings/catalog/status` | Wired | “CannaLib API primary (source: remote_api)”. |
| Honesty line | Static copy | n/a | Matches CannaLib contract. |
| Refresh status | Re-GET status | Wired | Works. |
| Reload local catalogs | `POST /admin/reload-catalogs` | Wired, **fire-and-forget** | Click does not await or show result. Local slim catalog is fallback only; remote is primary. |

---

## 6. ESPHome

Copy: *“Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it.”*  
Also: *“Pot 5 and beyond are unavailable until their firmware exists.”* (true — no pot5+ yaml.)

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| Seat / YAML / Expected | Inventory + `SEAT_YAML` + `EXPECTED_FIRMWARE` | GET `/settings/esphome/devices` | Expected **7.0.0.0** for all 10. YAML names match tree. |
| Last seen column | `online ? last_firmware : "offline"` | Partial | Hub/pot1/2/4 show `7.0.0.0`. **control + all four sonoffs show offline** even though inventory cards show them online. API only copies fleet firmware/online for `pots` and `hub`. |
| Queue OTA | `POST /settings/esphome/jobs` `{action:"ota"}` | **Danger — sqlite ticket only** | Not fired. Two existing jobs remain `queued` with detail “open ESPHome dashboard :6052 or docker exec …”. No processor. |
| Queue compile | Same, `action:"compile"` | Same theater | One-at-a-time guard exists for compile only. |
| Jobs dump (`<pre>`) | Last 3 jobs JSON | GET | Shows the two queued tickets. Status never leaves `queued`. |

Pi runs `esphome/esphome:2025.12.4` on `:6052`. Product stamp is **7.0.0.0**. Settings never shows both numbers on one row.

---

## 7. Zigbee (SkyConnect)

Copy: *“Extra canopy sensors and smart plugs — separate from climate control.”*

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| Permit join (2 min) | `POST /settings/zigbee/permit-join` `{enabled:true}` + setting key | **Danger — not fired** | Best-effort MQTT publish. No 2-minute timer in UI. No current-state chip. Sqlite already `zigbee_permit_join=true`. z2m config file still `permit_join: false`. |
| Stop join | Same, `enabled:false` | Not fired | Same. |
| Device table | `GET /settings/zigbee/devices` | Wired | Empty. UI: “No Zigbee devices reported yet — enable permit join, then refresh.” There is **no Refresh** on this card (page load only). |
| Add device | — | **Missing** | No interview wizard, rename, or bind-to-placement. |
| Placement / function | Backend `_placement_map()` | No Settings UI | `zigbee_placements` setting unused by the page. |

`/fleet.canopy` is `{}`. Compose advertises z2m + SkyConnect (`/dev/ttyACM0`, ember). Settings cannot tell the operator whether the stick is up.

---

## 8. Backup

| Control | What it does | Wired? | Live |
|---------|--------------|--------|------|
| Download backup | `GET /settings/backup/export` → zip | Wired (GET) | `HEAD` is 405 (export is GET-only). Zip includes ops sqlite, `manifest.json` (settings+inventory), optional `.env` and `z2m/`. **Not downloaded** (secrets). |
| Import backup file | `POST /settings/backup/import` on file pick | **Danger — no confirm** | Restores sqlite (with `.bak`) and `.env`. Does not restart services. Immediate on `<input type=file>` change. Not fired. |

---

## 9. Calibration (claimed by Settings family, not on this page)

| Item | Status |
|------|--------|
| Route | `/#/fleet/calibrate` (sibling tab). **No link from Settings cards.** |
| API | `GET/POST /settings/calibration/{device_id}` wired (`fan_cfm`, `light_par`). |
| Live DB | `dsc_cal_cfm_out`, `sf1000`, `hub`, `pot1` all `{calibrations: []}`. |
| Per-device pages | **Missing.** Fan wizard is four hub ducts; light wizard is SF1000 only. No pot/sonoff/panel cal. |

---

## 10. Save settings + hidden keys

Footer **Save settings** PATCHes the entire `settings` object from `GET /settings`, including keys the page never edits:

| Key | Shown in UI? | Live |
|-----|--------------|------|
| `ap_*`, `ollama_*`, `cannalib_*` | yes | as above |
| `zigbee_permit_join` | no | `"true"` |
| `pot3_f003_gate` | no | `"applied"` |
| `compose_helpers_json` | no | Full HA helper dump (input_number/select/boolean/text, pot names, cal flags, …) |
| `plant_roster_slots_json` | no | 8 empty roster slots |

That kv dump is the leftover HA surface. The page itself is not a Lovelace port.

---

## Danger controls (do not fire)

| Control | Why dangerous | What actually happens |
|---------|---------------|----------------------|
| Apply network | Drops the fleet AP if a real restart were wired | Today: writes files only. Copy still promises a restart. |
| Queue OTA / compile | Would flash if a worker existed | Today: queues a ticket. Existing queued jobs already prove no worker. |
| Import backup | Overwrites ops sqlite + `.env` with no confirm | Immediate on file pick. |
| In service checkbox | Takes a seat out of ingest/alerts | pot3 already OOS (F-003). pot1/2/4 on. |
| Permit join | Opens Zigbee join window | Sqlite already true; UI has no state. Prefer document-only. |

---

## Fleet Overview overlap (not Settings, same claim)

`/#/fleet` subtitle: *“7 of 11 devices in service.”* Kit Pulse includes AC / mister / tank. **Kit / In service** `EntityToggle`s for AC, clone mister, pot1–4, tank are **disabled** and show “—”. Those HA helpers are not a working Pi control. Settings is the only live in-service writer, and it does not list AC/mister/tank.

---

## Priority backlog

### P0

- ESPHome job queue is theater — stop saying OTA happens, or run a real worker and show progress/fail.
- Apply network copy vs `apply_network_configs()` — say “write host files” or actually restart the Pi AP (operator-gated).
- `control` ↔ `panel` seat id so the panel card is honest.
- Stop returning AP PSK (and unused HA JSON) on `GET /settings`. Mask secrets; keep compose/roster out of this kv.

### P1

- One in-service SoT. Surface AC / mister / tank on Settings or drop them from Fleet Overview toggles. Reconcile hub firmware `*_in_service` switches with inventory.
- Make assignment extras do work, or remove the copy. Add extra-sensor / Zigbee placement.
- Show product FW **and** ESPHome framework (7.0.0.0 vs 2025.12.4). Stamp sonoff/panel online+FW on the ESPHome table.
- Zigbee: join state, device list refresh, empty-vs-stick-down honesty, no silent `permit_join` desync.
- Import backup needs DecisionLayer confirm.
- Per-device calibration entry points (or a clear “Calibrate is Fleet → Calibrate, fans+SF1000 only”).

### P2

- Map `/#/settings` → `/#/fleet/settings`.
- Test Ollama/CannaLib should save or warn if the form is dirty.
- Reload catalogs should show the JSON result.
- pot3 card should say **out of service**, not only OFFLINE.
- Capture MACs so DHCP apply can reserve.
- Hide or explain `eth_uplink`.
- Permit-join 2-minute countdown if the MQTT path is kept.

---

## Audit notes

- Brain `/health`: `version` 7.1.0, `surface` 7.1.0, `expected_firmware` 7.0.0.0.
- Settings subtitle hardcodes “DSC-HUB 7.1.0 — Pi appliance” (not the `/health` surface).
- Browser walk used in-app Fleet → Settings. Hash-navigate via CDP can unmount the SPA (known FOLLOWUPS artifact); do not treat that as a Settings bug.
- No deploy, no commit, no danger writes.
