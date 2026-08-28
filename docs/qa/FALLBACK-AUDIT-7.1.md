# Fallback / recovery audit — DSC-HUB 7.1

**Date:** 2026-08-27  
**Scope:** Fallback paths only — SoftAP, Sonoff/hub flash-fallback, hub offline skip/retry, Brain IP/mDNS, AP rejoin, island isolation, HA-off, driver alias defaults, soak when a node is gone.  
**Not this audit:** live seat health ([DEVICE-AUDIT-7.1](DEVICE-AUDIT-7.1.md)), Settings UI honesty, Zigbee, gauges/graphs, UX/design, input replication.  
**Brain:** `http://192.168.86.48:8787/` (`dsc-brain.local` → `.48`). **`.30` is not the Brain** (ICMP TTL 255, `:8787` refused).  
**Method:** repo inventory + live **read-only** SSH/HTTP. No flash, factory-reset, Apply network, relay slam, permit-join, or pot3 in-service. SoftAP/join left off. No `iw scan` (prior hang risk).

**Live probe (this pass):** `/health` `7.1.0` / surface `7.1.0` / expected FW `7.0.0.0`. AP `dsc-hub-ap.service` active, `wlan0` `10.42.0.1/24`, **10/10** stations (sudo `iw`). All ten fleet IPs ping on `10.42.0.0/24`. `/fleet`: hub+panel+pot1/2/4+4 Sonoffs online `7.0.0.0`; pot3 OOS; `appliance_link` true. Heatmat relay was ON under the ladder — observed only, not toggled.

---

## Verdict

**18 recovery-relevant paths inventoried. 8 proven live or by dated soak. 10 unproven, mis-aimed, or dead.**

An operator **can run climate without HA** (HA-off soak 2026-08-26). They **cannot reliably recover a dead Sonoff, hub, or Pi from the scripts as they sit**: the Pi does not have the fallback flashers, the Windows/Pi wrappers still point at `.30` or `10.42.0.1`, LAN-first OTA still aims at studio `192.168.86.x`, and every checked `.sh` is CRLF. A dead Pi is hands-on (SSH on eth0 if userspace is up; physical if not). HA does not recover the island.

---

## Path table

| # | Path | Trigger | Expected action | Actual code / ops path | Last live proof | Residual risk |
|---|------|---------|-----------------|------------------------|-----------------|---------------|
| 1 | **Device SoftAP (ESPHome `wifi.ap`)** | STA cannot hold `DSC-Brain` | Node opens fallback hotspot + captive portal | `firmware/v4/dsc-*-wifi-pi.yaml`: hub `DSC-HUB Fallback Hotspot`; control `DSC-CONTROL Fallback Hotspot`; **all pots share** `DSC-Probe Fallback Hotspot`; Sonoffs unique (`DSC-Heater…`, `DSC-HeatMat…`, `DSC-Humidifier…`, `DSC-De-Humidifi…` — 31-char clip). Single STA SSID — **no Nest/studio fallback**. | 2026-08-27 FOLLOWUPS: losers of the 8-sta cap fell into SoftAPs; none broadcasting now (10/10 on DSC-Brain). SoftAP SSIDs **not scanned** this pass. | Shared pot SSID = collision if two pots drop. Dehum SSID truncated. No house-WiFi safety net — Pi AP down ⇒ N independent islands. |
| 2 | **Sonoff flash-fallback (Pi wlan0 client)** | Sonoff on its SoftAP (or “LAN OTA first”) | Stop Brain AP, join `192.168.4.1`, `esphome run`, restore AP | `flash-sonoff-fallback-remote.sh` + `flash-sonoff-fallback-pi.ps1`. `try_lan_ota` uses **`192.168.86.50/.51/.54/.184`**, not `10.42.0.50+`. | Heatmat cycle cited in LIVE-ACCEPTANCE / SOAK-2026-08-26. Script **absent on live Pi** (`/opt/dsc-hub-repo/services/dsc-hub/pi/` is Aug 24: bootstrap + two units only). Workspace file is **CRLF** and **untracked**. | Default `$PiHost=192.168.86.30`. LAN-first can miss the real node or hit a house-LAN occupant (`.51` and `.54` still ICMP-up from the Pi). Unbounded `iw scan` hung the AP once (FOLLOWUPS 01:41–02:10). `set -e` + CRLF aborts if uploaded without `sed`. |
| 3 | **Hub flash-fallback** | Hub on `DSC-HUB Fallback Hotspot` | Same: stop AP, OTA `192.168.4.1`, restore AP | `flash-hub-fallback-remote.sh`. EXIT trap → `start_brain_ap`. | Hub “recovered on AP after brief offline window” (LIVE-ACCEPTANCE 2026-08-26). Script **not on Pi**. CRLF. | Must tear down the fleet AP to talk to the hub SoftAP. No compile-in-script (comment says compile first). Same `iw scan` hang. No pot/control equivalent. |
| 4 | **Windows SoftAP flash** | Laptop joins device SoftAP | Elevated `netsh` + static `192.168.4.2` → OTA | `flash-sonoff-fallback.ps1` / `-admin.ps1`. Same stale house-LAN IPs. | Not re-run this pass. | Leaves operator Wi-Fi on SoftAP if `Restore-HomeWifi` fails. Home SSID hardcoded `DSC-Brain`. |
| 5 | **House-LAN Sonoff OTA** | Device still on `192.168.86.x` | `esphome run` from Pi container | `flash-sonoff-lan-remote.sh` | **Dead for current seats.** Live ping from Pi: `.50` DOWN, `.51` UP, `.54` UP, `.184` DOWN, hub `.180` DOWN, panel `.177` DOWN. Fleet is `10.42.0.x`. | UP addresses may be **other hosts**. LAN-first flash is a wrong-box risk. |
| 6 | **Brain AP restore** | hostapd/dnsmasq down after flash or crash | `wlan0` `10.42.0.1`, hostapd+dnsmasq back | `dsc-hub-ap.service` `ExecStartPre=/etc/dsc-hub/wlan0-ap.sh`; flash-script `start_brain_ap` + EXIT trap. **No standalone `recover-softap.sh`.** | EXIT trap restored AP after the hung `iw scan` (FOLLOWUPS 2026-08-27). Service **active** this pass. | `Type=oneshot RemainAfterExit=yes`. `hostapd -B` then systemd is happy forever — later hostapd death is silent. `wlan0` also has `169.254.211.247/16`. |
| 7 | **8-station / SoftAP-orphan heal** | brcmfmac cap 8; two seats SoftAP | Minimal cyfmac blob + `max_num_sta=32` + deny | Live `/etc/dsc-hub/hostapd.conf` has the three knobs. `update-alternatives` **Value** = `cyfmac43455-sdio-minimal.bin`. | **This pass:** 10/10 STA, deny `34:6f:24:da:41:77`, 15 min proof earlier today. | `network_apply.render_hostapd_conf` and `pi-bootstrap.sh` **omit** `max_num_sta` / deny. Settings Apply writes that thinner file (SETTINGS-AUDIT: Apply does not even restart). Copy-to-`/etc` + restart **re-orphans two seats into SoftAP**. `--auto` on the blob would regress (DEVICE-AUDIT P2). |
| 8 | **AP rejoin (firmware)** | DSC-Brain returns after drop | STA reconnects; fallback AP stands down | `wifi-pi` packages: one network, `priority: 20`, `fast_connect: false`, `captive_portal`. Hub `reboot_timeout: 0s` (stay up). Sonoff API `reboot_timeout: 15min`. | Fleet rejoined after AP restore / deploy windows (ops note + LIVE-ACCEPTANCE). 10/10 associated now. | No BSSID pin. `clear-hub-wifi-pref.sh` exists in repo only (CRLF, `set -eu`). Fleet-heal REJOIN/FLEET_JUMP is ESP-NOW-era, parked. |
| 9 | **Brain IP / mDNS** | DHCP move / docs / helpers | Reach brain at `dsc-brain.local` or current lease | Avahi hostname `dsc-brain`. House LAN: `dsc-brain.local` → **`.48`**. AP dnsmasq: `address=/dsc-brain.local/10.42.0.1`. | **This pass:** mDNS `.48`; `/health` OK on `.48`; `.30:8787` refused. | LIVE-ACCEPTANCE header, `flash-sonoff-fallback-pi.ps1`, and several FOLLOWUPS curls still say `.30`. `deploy-brain.ps1` / `verify-brain.ps1` / `island-proof.ps1` / `soak-check.ps1` default **`10.42.0.1`** — **unreachable from this studio-LAN Windows host** (`:8787` timed out). Two correct answers (`.48` vs `10.42.0.1`) depending on NIC. |
| 10 | **Hub-offline skip** | Compose/assign while hub down | Refuse; do not claim applied | `apply_clone_tent_automation`: `if not _hub_is_online(): return {applied: False, reason: "hub offline"}` | 2026-08-27 pot3 Add-as-Plant: first commit lied while hub reconnecting; skip added (LIVE-ACCEPTANCE addendum). | No unit test. `_hub_is_online` is FleetState `hub.online` — DEVICE-AUDIT **DV-P0-2**: ingest never expires `online`, so skip may not fire on a zombie-online hub. |
| 11 | **Hub select retry** | Transient Native API fail | One 1 s retry then local helper | `_hub_select_retry` then `set_helper` + `*_local: True` on mode/stage | Same compose pass; retry once then succeeded. | Photoperiod/hours local writes omit a `*_local` flag. Helper write can make the SPA look applied while the hub is not. |
| 12 | **Island isolation** | Nest/HA climate off; Pi AP is home | Tent runs on Brain + hub ladder + appliance driver | `island-proof.sh` + ops cutover. HA followers in `dsc_v4_automations.yaml` are optional, not required. | `island-proof.ps1` green 2026-08-26 (LIVE-ACCEPTANCE). Script **not on Pi**; CRLF; wrapper defaults `10.42.0.1`. | Repo `island-proof.sh` `set -e`: `curl -sf /health` or `/fleet` fail **aborts** before the FAIL tally. |
| 13 | **HA-off climate** | HA Core / followers down | Pi driver still maps hub demand → Sonoff `main_relay` | `appliance_driver` 2 s tick. HA package text still calls followers “idempotent HA fallback”. | **2026-08-26T13:24–13:26Z** dehumidifier ON/OFF with HA climate off (SOAK). Later Manual Takeover proofs for the other three seats. | Dual actuation if someone re-enables HA followers. Not exercised this pass. |
| 14 | **Hub-gone failsafe (driver)** | Hub demand unreadable > 45 s | All four Sonoffs OFF | `appliance_driver.STALE_SEC = 45` | Code + comments. **Not live-fired** (would slam relays). | `appliance_link` is hub freshness, not per-Sonoff (DEVICE **DV-P1-5**). |
| 15 | **Sonoff node failsafe** | Relay ON + API gone > grace | Local OFF; no reboot | `dsc-sonoff-common.yaml` interval, `api_grace_ms` default 90 s, `restore_mode: ALWAYS_OFF`, 10 min button test | Design-proven; not re-tripped this pass. | Survives a dead Pi. Does **not** recover the node onto Wi-Fi. |
| 16 | **Driver alias defaults** | Hub exposes `grow_mat_demand` and/or `growmat_demand` | Only **discovered** oids drive the seat | `DEMAND_TO_SEAT` keeps both aliases; `_demands_from_discovered` drops undiscovered. Test `test_appliance_undiscovered_aliases_not_emitted`. | Heatmat chatter 16:52–16:55Z; clean ON/OFF after 16:57Z deploy (SOAK). Workspace **uncommitted**. | Clean-checkout deploy regresses chatter. FOLLOWUPS already tracks the commit gap. |
| 17 | **Soak when a node is gone** | Hourly cron; seats missing | Snapshot + honest warn; keep logging | **Live** `/home/dsc/soak-check.sh` (748 B, 2026-08-27 00:56): counts `sonoffs=N/4`, no `set -e`, appends even if fleet parse fails. Cron `0 * * * *`. **Repo** `soak-check.sh` is a different JSON snapshot with `set -e` + `curl -sf` (aborts if Brain is down). | Log `/var/lib/dsc-hub/soak-2026-08-26.log` **7 lines**. `15:00Z sonoffs=2/4`; `16:00Z` 4/4 `link=False`; later 4/4 `link=True`. Last line `20:00Z` (current at probe). | No alert, no page, no `fans_all_zero` on the **live** script. T+24h gate not closed. Repo script is not what cron runs. |
| 18 | **CannaLib / Want fallback** | Remote catalog down | On-Pi sqlite, else slim Want | `catalog_status` reports tiers. `catalog_search` **only hits remote**. `cannalib_use_local_fallback=true`. `want.py` `STAGE_DEFAULTS` if no catalog row. | **This pass:** `GET /settings/catalog/status` → `source=remote_api`, `local_fallback_enabled=true`, **`local_db_present=false`**. | Advertised fallback is a **dead path**. Eth0-down island loses strain search. |

Parked / retired (not counted as live fallbacks): DSC-Anchor SoftAP-home, ETH01 bridge, SoftAP NAPT OTA, ESP-NOW fleet-heal, kit `DSC-Setup` portal. Spec `docs/superpowers/specs/2026-08-10-softap-fleet-star-design.md` is history.

---

## Live vs repo (read-only)

| Item | Repo | Live Pi (`.48`) |
|------|------|-----------------|
| `flash-sonoff-fallback-remote.sh` | Workspace, **CRLF**, **untracked** | **Missing** (not in `/opt/dsc-hub-repo`, `/home/dsc`, `/tmp`) |
| `flash-hub-fallback-remote.sh` | Workspace, CRLF | **Missing** |
| `soak-check.sh` | JSON snapshot, `set -e`, CRLF | **Different** 748 B logger at `/home/dsc/soak-check.sh` (LF) |
| `island-proof.sh` | Repo, CRLF | **Missing** |
| `wlan0-ap.sh` | Embedded in `pi-bootstrap.sh` | Present `/etc/dsc-hub/wlan0-ap.sh` (90 B, LF) |
| `hostapd` `max_num_sta` | **Not** in `network_apply.py` / bootstrap template | **32** + `macaddr_acl=0` + deny file |
| cyfmac blob | Not in git | **minimal** selected; alternatives **Best** still `standard` |
| Soak cron | Documented in SOAK-2026-08-26 | Installed; 7 hourly rows |
| Pi repo `services/dsc-hub/pi/` | Full script set | **Stale Aug 24** — `pi-bootstrap.sh` + two unit files only |

Unprivileged `iw station dump` reported **0**. Recovery diagnostics without sudo will lie.

---

## Honesty (dead paths, `set -e`, CRLF, stale `.30`)

- **Every repo `services/dsc-hub/pi/*.sh` checked is CRLF** (`flash-sonoff-fallback-remote`, `flash-hub-fallback-remote`, `soak-check`, `island-proof`, `clear-hub-wifi-pref`, `pi-bootstrap`, `flash-sonoff-lan-remote`). Wrappers strip `\r` after `pscp`. A direct copy + `bash` under `set -e` dies on `$'\r'`.
- `flash-sonoff-fallback-remote.sh` already documents a prior `set -e` abort (`connect_fallback_ap` must stay inside `if`). The `iw scan` loop is still unguarded by `timeout` after a 25 min hang.
- `island-proof.sh` / repo `soak-check.sh`: `set -e` + `curl -sf` = **no snapshot when the Brain is the thing that died**.
- **`.30` is a different MAC.** Docs and `flash-sonoff-fallback-pi.ps1` still send the operator there. FOLLOWUPS 06:35-era “Pi SSH/HTTP down” at `.30` is **superseded** — Brain is up on `.48`.
- CannaLib “on-Pi sqlite fallback” is status text, not a search path, and the file is not on the Pi.
- Settings **Apply network** does not restart the AP (SETTINGS-AUDIT) but the file it would write is the **pre-fix** hostapd (no `max_num_sta`). That is a SoftAP-orphan factory.

---

## P0 / P1 / P2

### P0

| ID | Defect | Why it is P0 |
|----|--------|----------------|
| **FB-P0-1** | Recovery entrypoints aim at the **wrong host / wrong subnet** | `flash-sonoff-fallback-pi.ps1` defaults `192.168.86.30`. LAN-first OTA (Pi + Windows) uses `192.168.86.50/.51/.54/.184` while seats live at `10.42.0.50+`. `.51` and `.54` still ping on the house LAN. Operator can miss the Brain or flash the wrong box. |
| **FB-P0-2** | Hostapd **render/bootstrap omit the 8-sta heal** | `render_hostapd_conf` / `pi-bootstrap.sh` drop `max_num_sta=32` and the deny file. Re-bootstrap or copy-Apply → two seats SoftAP again. Cross-ref SETTINGS Apply-lie + DEVICE `--auto` blob note. |
| **FB-P0-3** | Fallback flashers **not on the Pi**, CRLF, sonoff script untracked; `iw scan` can **take the AP down** | There is no on-box recover-Sonoff/hub path. The only remote path already hung hostapd once. WF-P0-3 is right: SPA Queue OTA is a ticket, not a flash. |

### P1

| ID | Defect |
|----|--------|
| **FB-P1-1** | CannaLib local fallback is a **lie** (`local_db_present=false`; `catalog_search` never reads sqlite). Island without eth0 loses catalog. |
| **FB-P1-2** | `dsc-hub-ap.service` is **oneshot**; hostapd crash after start is invisible. No `recover-softap` / watchdog. |
| **FB-P1-3** | All four pots share **`DSC-Probe Fallback Hotspot`** — cannot recover two pots at once. |
| **FB-P1-4** | Soak: **repo ≠ cron script**; gone-node is a count only (`2/4` at 15:00Z); no notify. T+24h not closed (7 hours). |
| **FB-P1-5** | `apply_clone_tent_automation` skip/retry has **no unit test**; helper fallback can look applied. Couples to DV-P0-2 stale `hub.online`. |
| **FB-P1-6** | Studio-LAN helpers default `10.42.0.1` (`deploy-brain`, `verify-brain`, `island-proof`, `soak-check` ps1) — dead from the Windows agent unless on the AP. |
| **FB-P1-7** | No pot/control flash-fallback script. Hub/Sonoff only. |

### P2

- `169.254.*` leftovers on `wlan0` (and other ifaces).
- Inventory/DHCP MACs null (DEVICE **DV-P1-2**) — cannot pin a SoftAP rejoin to a seat from Settings.
- LIVE-ACCEPTANCE / DESIGN-AUDIT / `/fleet/computed` FOLLOWUPS still cite `.30` (do not rewrite those sibling docs here).
- `want.py` stage defaults and `spa_fallback` are data/UI fallbacks, not device recovery.
- Kit SoftAP / parked ESP-NOW stay history.

---

## Can an operator recover without HA?

| Asset | Without HA? | Honest answer |
|-------|-------------|---------------|
| **Climate while island is up** | **Yes** | HA-off soak + live `appliance_link`. Hub ladder + Pi driver. Sonoff local 90 s failsafe if the Pi dies. |
| **Dead Sonoff** | **Only with a laptop + corrected script** | SoftAP exists. Script is not on the Pi, defaults `.30`, LAN-first is the wrong subnet, CRLF. Power-cycle away from DSC-Brain, run `flash-sonoff-fallback-pi.ps1 -PiHost 192.168.86.48`, watch the AP come back. USB if SoftAP never appears. |
| **Dead hub** | **Same, worse** | `flash-hub-fallback-remote.sh` is workspace-only and **stops the fleet AP** to join the hub SoftAP. Compile first. No HA Device Builder on this path. |
| **Dead / hung Pi** | **No** | AP dies with userspace (already seen). Fleet fragments onto SoftAPs. `dsc-brain.local` / `.48` SSH if eth0 still answers. Do not power-cycle the Understairs Network Outlet. HA cannot boot the Pi or restore hostapd. |

---

## Counts

| | |
|--|--|
| Paths in table | **18** |
| Proven (live this pass or dated soak/acceptance) | **8** — SoftAP-as-coded + prior orphan; AP 10/10 + max_sta; mDNS `.48`; island-proof 08-26; HA-off demand→relay; clone skip/retry 08-27; alias fix; soak logged a 2/4 gap |
| Unproven / dead / mis-aimed | **10** — Pi flash-fallback deploy, hub flash-fallback deploy, Windows SoftAP, house-LAN OTA, 45 s driver failsafe (not fired), CannaLib sqlite, Apply/bootstrap hostapd, oneshot AP watchdog, shared pot SoftAP, repo soak-check |

**Top 8 defects:** FB-P0-1, FB-P0-2, FB-P0-3, FB-P1-1, FB-P1-2, FB-P1-3, FB-P1-4, FB-P1-6.

---

## This pass did not

Flash, factory-reset, Settings Apply network, slam relays, enable permit-join, put pot3 in service, start a fallback SoftAP, or leave join on. Did not commit. Did not deploy.
