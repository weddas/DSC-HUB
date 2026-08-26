# Device audit — DSC-HUB 7.1 (physical + ESPHome fleet)

**Date:** 2026-08-27  
**Scope:** Hubs, pots, Sonoff appliances, other seats — discovery, seating, firmware, `in_service`, online honesty, `appliance_link`.  
**Not this audit:** Zigbee / z2m / MQTT / permit-join (sibling `ZIGBEE-AUDIT-7.1.md`).  
**Brain:** `http://192.168.86.48:8787/` (`dsc-brain.local` → `.48`). **`.30` is not the Brain.**  
**Method:** read-only code + `GET` `/health` `/fleet` `/settings` `/roster` `/settings/network` `/settings/esphome/devices` `/grow-log`; SSH `iw` / ping / hostapd. No OTA, no factory reset, no Apply network, no relay slam. **pot3 left OOS.**

---

## Verdict

| Question | Answer |
|----------|--------|
| Seat count expected vs live | **10 / 10** inventory. **9 / 9** in-service online on Native API. pot3 OOS (F-003) but still on the AP. |
| Firmware mismatches | **None** on the product train for ingested seats — all report `7.0.0.0`. |
| `appliance_link` | **true** (hub-demand path fresh). Demand ↔ relay matches on all four Sonoffs (heatmat ON/ON; others OFF/OFF). |
| Fleet map operator-honest? | **`/fleet` JSON: mostly yes. Settings surfaces operators use to tell devices apart: no.** |

The live Native API snapshot is coherent: last_seen advances, pot3 is omitted from `pots{}`, product firmware is the text sensor not the ESPHome framework string, and appliance relays match hub demands. The Settings ESPHome table and the **control** device card still tell the operator that live nodes are offline. Ingest never expires `online` after a dead poll, so the API *would* keep saying online if a seat died.

---

## 1. Architecture (one pager)

```text
Studio LAN 192.168.86.0/24
    │
    ├─ 192.168.86.48 eth0  dsc-brain  (TTL 64, mDNS dsc-brain.local)
    │     Brain :8787  surface 7.1.0  expected FW 7.0.0.0
    │     sqlite fleet_inventory  = seat SoT (host, in_service)
    │     EsphomeIngest  ~5 s loop, serial Native API
    │     appliance_driver  2 s  hub demand → Sonoff main_relay
    │
    └─ 192.168.86.30  TTL 255  MAC e8:16:56:53:ec:ad  ping only — NOT Brain

Pi wlan0 AP  10.42.0.1  SSID DSC-Brain  ch6  max_num_sta=32
    brcmfmac minimal blob (8-sta standard cap bypassed)
    10 associated STAs  (fleet 10; pot3 OOS still holds a slot)

        .10 hub          Native API  climate + demand switches
        .11 control      panel (plaintext API; inventory id "control")
        .21–.24 pots     moisture / soil T / pH
        .50 heater       Sonoff BASIC  main_relay
        .51 heatmat
        .54 humidifier
        .55 dehumidifier

Firmware seats use static 10.42.0.x (manual_ip). Inventory MAC is null.
dnsmasq reservations are IP→name only (plus leftover dsc-bridge .5).
```

**How a seat becomes “known”**

1. Row in `fleet_inventory` (`brain/dsc_brain/settings.py` `DEFAULT_INVENTORY`, 10 seats). No mDNS discovery.
2. `in_service` false → ingest **skips** the host (`esphome_client.py`). Previous `FleetState` is copied forward for everyone else.
3. Successful Native API poll → `SeatState(online=True, firmware, values, last_seen=now)`.
4. Failed poll → **exception swallowed**; previous `online=True` kept forever.
5. Product firmware = `firmware_version` text sensor; fallback = `device_info.esphome_version`, then `EXPECTED_FIRMWARE` (`7.0.0.0`).
6. `system.appliance_link` = appliance driver `hub_ok` (hub demand read fresh ≤45 s) — **not** per-Sonoff reachability.
7. UI `in_service` = Brain inventory. Hub NVS `switch.dsc_hub_*_in_service` is a **second, unsynced** gate the climate ladder reads.

**Identity aliases:** inventory `seat_id=control` / role `panel` ↔ FleetState `panel`. Settings `resolveSeat("control")` does not map that alias.

---

## 2. Live seat table

Probed **2026-08-27 ~06:36 AEST**. `/health` `7.1.0` / expected `7.0.0.0`. Roster `[]`. Brain container `dsc-hub-brain:7.0.0` up ~20 min this boot; hub uptime ~5.7 h.

| Seat | Role | IP | MAC (ARP) | FW | in_service | last_seen | AP / ping | appliance / demand↔relay | Notes |
|------|------|----|-----------|----|------------|-----------|-----------|--------------------------|-------|
| hub | hub | 10.42.0.10 | `84:1f:e8:16:e6:60` | 7.0.0.0 | true | advancing (~95 s cycle) | assoc + UP | — | SSID DSC-Brain, RSSI −42, IP self-report `.10`. Framework `2025.12.4`. |
| control | panel | 10.42.0.11 | `30:76:f5:e9:22:0c` | 7.0.0.0 | true | advancing | assoc + UP | — | Matches hub yaml `panel_mac`. **Settings card shows OFFLINE** (`resolveSeat` miss). |
| pot1 | pot | 10.42.0.21 | `8c:4f:00:27:e0:10` | 7.0.0.0 | true | advancing | assoc + UP | — | Moisture 21.9 % · soil 18.4 °C · pH 6.3. |
| pot2 | pot | 10.42.0.22 | `f0:24:f9:59:c3:14` | 7.0.0.0 | true | advancing | assoc + UP | — | Moisture 19.5 % · soil 18.5 °C · pH 7.2. |
| pot3 | pot | 10.42.0.23 | `a0:a3:b3:90:da:b0` | — (not ingested) | **false** | absent from `pots{}` | **assoc + UP** | — | F-003 OOS. Still occupies an AP slot. Hub `pot3_esp_now_link` **true**. Do not enable. |
| pot4 | pot | 10.42.0.24 | `ec:e3:34:7b:e7:a8` | 7.0.0.0 | true | advancing | assoc + UP | — | **Moisture / soil T / pH all null.** API-online, probe-dark. |
| heater | sonoff_heater | 10.42.0.50 | `84:0d:8e:51:cf:a5` | 7.0.0.0 | true | advancing | assoc + UP | link sys-true · demand OFF · relay OFF | |
| heatmat | sonoff_heatmat | 10.42.0.51 | `dc:4f:22:94:97:9d` | 7.0.0.0 | true | advancing | assoc + UP | link sys-true · demand **ON** · relay **ON** | Reassociated ~20 min before peers; ARP went STALE, ping still UP. |
| humidifier | sonoff_humidifier | 10.42.0.54 | `dc:4f:22:92:1b:c5` | 7.0.0.0 | true | advancing | assoc + UP | link sys-true · demand OFF · relay OFF | |
| dehumidifier | sonoff_dehumidifier | 10.42.0.55 | `84:0d:8e:51:d3:b9` | 7.0.0.0 | true | advancing | assoc + UP | link sys-true · demand OFF · relay OFF | |

**Not in inventory (planned OOS, kit-map only):** AC, clone mister, tank — `inventoryInService` defaults false. Not ghosts.

**Counts**

| | Expected | Live |
|--|----------|------|
| Inventory rows | 10 | 10 |
| In service | 9 (pot3 off) | 9 |
| `/fleet` online (hub+panel+pots+sonoffs) | 9 | 9 |
| AP associated | 10 (incl. OOS pot3) | **10** |
| Product FW `7.0.0.0` among ingested | 9 | 9 |
| Duplicate IPs | 0 | 0 |
| Inventory MAC filled | 10 | **0** |

Hub climate at probe: tent 23.4 °C / 60.1 % / 1.15 kPa; clone 24.0 / 62.8 / 1.11. Full Auto on, takeover off, grow stage **Off**, clone **Custom / Independent 18 h**. Both `4x8_window_open` and `2x4_window_open` **true**. SF1000 state on, brightness 1. Grow-log has repeated “Clone dark-period violation — SF1000 on outside the 2x4 window”.

Hub NVS `switch.dsc_hub_pot{1–4}_in_service` and AC/mister in-service: **all off**, while Brain inventory has pot1/2/4 on.

---

## 3. Honesty

| Claim | Live? | Honest? |
|-------|-------|---------|
| `/fleet` online for in-service seats | yes, last_seen moving | **Yes now.** Code will keep `online=true` after the node dies (copy-forward). |
| Settings inventory card — control/panel | panel Native API up | **No** — `resolveSeat("control")` returns null → OFFLINE, no FW, no last_seen. |
| Settings ESPHome table last-seen column | hub+pot1/2/4 merged only | **No** — control + four Sonoffs + pot3 render **offline** (`api.py` merge misses `panel` / `sonoffs`). |
| Overview “HUB LINK” vs `/fleet` | not re-clicked this pass | Residual P1 (FOLLOWUPS). Code uses `fleet.hub.online`; historical banner lie was `/fleet/computed` starvation. |
| pot3 OOS | inventory false, not in `pots{}` | Inventory-honest. AP/ESP-NOW still up — operator can think it is gone. |
| pot4 online | Native API up, chemistry null | API-honest, **probe-dishonest** if the kit chip says idle/ok. |
| `appliance_link` | true | Honest as **hub-demand freshness**, not “all Sonoffs reachable”. One dead Sonoff would not flip it. |
| Demand vs relay | heatmat ON/ON; rest OFF/OFF | **Yes.** |
| `.30` is the Brain | docs/Kuma still mention it | **No.** Ping TTL 255, MAC `e8:16:56:53:ec:ad`, :8787 refused. Pi is `.48` / `e4:5f:01:e0:93:b3`. |
| 8-sta AP cap residual | 10/10 associated, `max_num_sta=32`, minimal blob in use | **Not firing.** Revert risk: `update-alternatives` **Best** is still `…-standard.bin`. |
| Ghost seats | no extra inventory rows | **Bridge leftover** in live `dnsmasq.conf` (`10.42.0.5,dsc-bridge`). Inventory correctly has no `bridge`. |
| Compose vs roster | roster empty | Compose helpers still primed: assign pot **3**, “Northern Lights”, “QA Dummy (pot3 test)”, tent 2x4, sprout 2026-07-09. |

**Ghost / duplicate / stale identity:** no duplicate 10.42 IPs. No extra ESPHome seats beyond the ten. Stale Brain identity is `.30` on the studio LAN, not a second `:8787`.

---

## 4. Gaps vs 7.1 MUST

| MUST | Status |
|------|--------|
| All seats at `7.0.0.0` | **Pass** for the nine ingested seats. pot3 not polled (OOS). Settings ESPHome table *hides* Sonoff/panel FW (shows offline). |
| `appliance_link` true for Sonoffs | **Pass** at the system bit; all four reachable and demand/relay consistent. Not a per-seat flag. |
| Operator can see which device is which | **Fail on Settings.** Seat_id + static IP exist on `/fleet`. Inventory MAC empty; function/placement empty; control card unlabeled-offline; ESPHome table lies. ARP on the Pi is the only live MAC map. |

---

## 5. Defects

### P0

1. **Settings tells the operator live seats are dead.** `resolveSeat` does not map `control` → `fleet.panel`. `/settings/esphome/devices` only copies online/FW for `hub` and `pots{}`. Result: panel + heater + heatmat + humidifier + dehumidifier display **offline** on the ESPHome table while `/fleet` has them at `7.0.0.0`.
2. **Ingest never marks a seat offline.** `_poll_once` copies previous seats; a failed `_fetch_device` leaves `online=true` and a frozen `last_seen`. Overview/Fleet *will* say online when the node is dead. Expire after N missed cycles (serial poll is ~30–90 s — do not use a 45 s cut).

### P1

3. **Dual `in_service` SoT.** Brain inventory pot1/2/4 **on**; hub NVS pot/AC/mister switches **off**. Toggle via Settings only writes sqlite (`control_ops`). Climate ladder may ignore pots the UI treats as in service.
4. **Inventory MAC / DHCP identity empty.** All `mac` null; `dhcp-host` lines are IP-only. Apply network cannot pin a seat to a radio. Operator cannot confirm “this Sonoff is the heatmat” from Settings.
5. **Compose leftovers target pot3.** Helpers still assign pot 3 + QA dummy + 2x4 + sprout 2026-07-09 after roster revert. One Compose commit can try to put pot3 back. **Do not enable pot3 to “fix” this.**
6. **pot4 in service + online + `7.0.0.0` with null chemistry.** Kit map can show idle instead of probe-dark. Hardware isolate still open (FOLLOWUPS keep-open).
7. **`appliance_link` is hub_ok, not per-Sonoff.** MUST wording is satisfied today only because all four are up.
8. **Photoperiod honesty.** Grow stage Off but `4x8_window_open` true; SF1000 `on` at PWM 1; grow-log dark-period violations. Operator cannot tell if the 4×8 is supposed to be dark.

### P2

9. pot3 holds an AP STA slot while OOS (known; ties F-003).
10. Live `dnsmasq.conf` still reserves `10.42.0.5,dsc-bridge`.
11. 8-sta fix holding; alternatives **Best** remains standard blob — `--auto` would regress.
12. Function/placement `extra` empty on every seat.
13. Hub `pot3_esp_now_link` true vs Brain OOS — two stories.
14. pot3 Settings card = OFFLINE (not ingested) vs ping UP.
15. Serial Native API poll (~3–5 s subscribe × 9 seats) makes last_seen look 1–2 min old while healthy.
16. `wlan0` has a 169.254.x link-local beside `10.42.0.1` (cosmetic).
17. Acceptance header still advertises Brain at `.30`.

**Observed, not owned:** `zigbee_permit_join` is `true` in settings; z2m container had just restarted at SSH time. Sibling Zigbee audit.

---

## 6. Code map

| Concern | Where |
|---------|--------|
| Seat list / `in_service` / pot3 F-003 gate | `brain/dsc_brain/settings.py` |
| Discover + name + firmware + online | `brain/dsc_brain/esphome_client.py` |
| Fleet snapshot + synthetic HA + `appliance_link` entity | `brain/dsc_brain/fleet_state.py` |
| Demand → relay + `hub_ok` | `brain/dsc_brain/appliance_driver.py` |
| Inventory toggle (sqlite only) | `brain/dsc_brain/control_ops.py` |
| Compose leftovers | `compose_helpers_json` in settings |
| Settings cards / ESPHome table | `frontend/src/pages/SettingsPage.tsx`, `api.py` `settings_esphome_devices` |
| Kit map OOS vs dark | `frontend/src/lib/kitInventory.ts`, `fleetModel.inventoryInService` |
| Island proof (pot3 warn) | `services/dsc-hub/pi/island-proof.sh` |

---

## 7. Safety / what this pass did not do

No OTA, no compile job, no Apply network, no `/control/demand`, no pot3 `in_service` patch, no hostapd/dnsmasq write, no commit, no deploy.

---

## 8. Sources

- `GET http://192.168.86.48:8787/{health,fleet,settings,roster,settings/network,settings/esphome/devices,grow-log}`
- Second `/fleet` ~95 s later (last_seen / uptime / heartbeat advanced)
- SSH `dsc@192.168.86.48`: `iw` STA count 10, ARP, ping 11/11 on `10.42.0.{1,10,11,21–24,50,51,54,55}`, hostapd, brcmfmac alternative, dnsmasq
- Code as in workspace 2026-08-27 (appliance-driver alias fix present; not re-audited as a flash task)
