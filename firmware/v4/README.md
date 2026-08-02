# DSC-HUB firmware v4

Working directory for ESPHome configs. Current fleet release string:
**`5.1.0`** (GitHub tag `v5.1.0`). See the repo
[README](../../README.md) and [INSTALL.md](../../INSTALL.md) for from-scratch HA setup.
Standalone SoftAP unboxing (no HA): [SETUP.md](../../SETUP.md).
Firmware QA: [docs/qa/FIRMWARE-QA-5.1.0.md](../../docs/qa/FIRMWARE-QA-5.1.0.md).

## Local vs HA

| Where | What |
|---|---|
| Here (`firmware/v4/`) | Stubs `!include` package bodies for Cursor edits + local flash. |
| [`homeassistant/esphome/`](../../homeassistant/esphome/) | Same stubs with **git-pull** packages from GitHub. |

Entry points (local lab): `dsc-hub.yaml`, `dsc-control.yaml`, `dsc-pot1.yaml`, …
Kit SoftAP setup: `dsc-hub-kit.yaml`, `dsc-control-kit.yaml`, `dsc-pot{1..4}-kit.yaml`

WiFi is split into `dsc-*-wifi-lab.yaml` / `dsc-*-wifi-kit.yaml` so kit builds omit compile-time SSIDs.
Fleet component: `components/dsc_fleet_setup/` (phone portal on hub; Control/pots join `DSC-Setup-*`).

Package bodies are remote-git safe (no `!secret`). Stubs pass credentials (and hub/panel MACs + `espnow_cmd_tag`) as substitutions.

Pots (`dsc-pot-common` **4.0.1+**): each soil channel has **Cal … Offset** / **Cal … Scale** config numbers (NVS). Formula `raw * scale + offset` applies before range/median and feeds HA + ESP-NOW. **Reset Sensor Calibration** restores defaults.

## Panel (DSC-CONTROL **5.1.14**)

Package body: [`dsc-control-common.yaml`](dsc-control-common.yaml).
CYD (no PSRAM) — lean glass after the 5.1.2–5.1.8 crash train. Fleet chip
compares **major.minor**, so panel `5.1.x` beside hub `5.1.0` stays `ok`.

| Feature | Notes |
|---|---|
| Boot | Blank → lite **Starting** (hello + vitals/config/soil) → Pulse; LVGL paused until heap settles |
| Tabs | Pulse / Clone / Main / Soil (+ soil detail); Modes inline on Control |
| Hold-to-lock | Visible lock glyph (top-right); hold overlay to unlock — no idle sleep / torch |
| Demand / takeover | Confirm → Engage gate |
| ESP-NOW recovery | Silent ladder: hello ping (15 s) → WiFi bounce (45 s) → `safe_reboot` (120 s, max 2/boot) |
| AP pin | Optional stub `wifi_bssid` + hub 0xD0 BSSID adopt during Starting |
| Panel Link | Hub `binary_sensor.dsc_hub_panel_link` — ESP-NOW presence (≠ HA API) |
| HA API | **Plaintext** (no Noise); **mDNS off** — add by **IP only** |
| Heap | 8% LVGL buffer; lean Wi‑Fi/LWIP; no `sram1_as_iram` (costs DRAM; OTA brick risk) |

After flash: serial should reach `DSC-CONTROL 5.1.14 UI armed — free_heap=…`.
Boot-loop → **USB**, not OTA. Crash history: [`../_history/v4/crash-logs/`](../_history/v4/crash-logs/).

### Panel HA API reconnect

`api:` lives in [`dsc-control-common.yaml`](dsc-control-common.yaml). Noise is off
(v4.0.9+) — handshake OOM / double-free on CYD. mDNS disabled. ESPHome’s
“Unable to connect… includes an `api` section” toast is **generic** — it does
**not** mean `api:` is missing.

| Check | What to do |
|---|---|
| Boot-loop / no Wi‑Fi | USB flash until `UI armed` prints cleanly |
| Host | **IP only** — lab Nest reservation **`192.168.86.177`** (`use_address` in `dsc-control-wifi-lab.yaml`). Never `dsc-control.local` |
| Encryption | Leave key **blank**; delete old encrypted HA entries and re-add |
| Stale `dsc-cyd1` | Delete leftover integration device if present |
| Secrets | `dsc_control_ota_password` / `_ap_password` required; `dsc_control_api_key` unused by panel |
| Stub drift | HA `/config/esphome/dsc-control.yaml` must match [`homeassistant/esphome/dsc-control.yaml`](../../homeassistant/esphome/dsc-control.yaml) |
| `not a valid YAML file` | Uncommented changelog line in a package body (e.g. `v5.1.x:` at column 2) — restore `#`, push, stub `refresh: 0d` |

ESP-NOW (glass ↔ hub) does **not** need the HA API. Fix API only for OTA,
diagnostics, and HA time backup.

**Package header rule:** changelog lines in package bodies must stay `#`
comments or HA git-pull Install dies before `substitutions:`.

## Fleet link, Nest AP pin, silent recovery

Temp mesh bandaid until a dedicated fixed-channel AP. Code lives in hub
[`dsc-hub-v4_0.yaml`](dsc-hub-v4_0.yaml) + [`dsc-hub-espnow-primary.yaml`](dsc-hub-espnow-primary.yaml),
panel [`dsc-control-common.yaml`](dsc-control-common.yaml), pots [`dsc-pot-common.yaml`](dsc-pot-common.yaml).

### Intent

Keep hub / panel / pots on the **same Nest point** so ESP-NOW shares a
channel, and recover silently when the link or HA API session wedges
without cold-cutting climate actuators.

### AP pin

| Path | How |
|---|---|
| Runtime (preferred) | Hub `switch.dsc_hub_lock_wifi_ap` ON → learns `text.dsc_hub_preferred_wifi_bssid` on connect; 0xD0 fleet beat carries the 6-byte BSSID |
| Compile-time | Stub `wifi_bssid:` (copy `sensor.dsc_hub_wifi_bssid`, all-caps). `00:00:00:00:00:00` = unlocked |
| Clear | Hub button / clear preferred BSSID |

Flash hub first, then panel/pots so followers can adopt the BSSID during boot.

### Silent recovery ladders (verified)

| Device | Trigger | Ladder |
|---|---|---|
| **Panel** | No hub vitals | 15 s hello (op 57) → 45 s WiFi bounce → 120 s `safe_reboot` (≤2/boot); boot grace 90 s |
| **Pots** | Hub heartbeat silent | ping → WiFi bounce → `safe_reboot` |
| **Hub** | API wedge (WiFi up, HA link/handshake dead) **or** panel quiet | ~45 s nudge → ~90 s WiFi bounce → ~180 s NVS sync + `safe_reboot` (**API path only**, ≤2/boot). Panel-only silence **never** reboots the hub |

HA demand followers debounce hub `unavailable` **25 s** before OFF so short
API blips do not kill the heater — see [`../../homeassistant/README.md`](../../homeassistant/README.md).

### Pitfalls

- Mesh/Nest channel hops break ESP-NOW — pin one BSSID or use a fixed-channel AP.
- Do **not** enable `sram1_as_iram` on panel (DRAM loss; OTA/bootloader mismatch).
- Hub `api.reboot_timeout` stays **0s** — HA maintenance must not bounce climate.

## Hub mat votes

In [`dsc-hub-v4_0.yaml`](dsc-hub-v4_0.yaml): `Mat Vote Pot 1`–`4` (`switch.dsc_hub_mat_vote_pot_N`). OFF pots are skipped by coldest/hottest root-zone voting (5–45 °C filter still applies). POT3 defaults OFF.

## Quick validate

```bash
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-heater.yaml
esphome config dsc-pot1.yaml
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

Requires `secrets.yaml` in this folder (gitignored). Start from `secrets.yaml.template` if needed.

`espnow_cmd_tag` is **54727** (`0xD5C7`) on hub + panel — flash both after changing it.

Fleet bring-up / cutover: [`../../INSTALL.md`](../../INSTALL.md) · [`../../UPGRADE.md`](../../UPGRADE.md).
