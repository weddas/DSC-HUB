# DSC-HUB firmware v4

Working directory for ESPHome configs. Current fleet release string:
**Live train:** hub **5.1.8** · Control **5.1.16** · pots **5.1.7** (tagged marketing
cut remains `v5.1.0`). See the repo root README / CHANGELOG / FOLLOWUPS.

Firmware QA: [docs/qa/FIRMWARE-QA-5.1.0.md](../../docs/qa/FIRMWARE-QA-5.1.0.md).
Fleet self-heal (hub 5.1.8 / Control 5.1.16 / pots 5.1.7):
[docs/qa/FLEET-SELF-HEAL-5.1.8.md](../../docs/qa/FLEET-SELF-HEAL-5.1.8.md).
Repo [README](../../README.md) and [INSTALL.md](../../INSTALL.md) for from-scratch HA setup.
Standalone SoftAP unboxing (no HA): [SETUP.md](../../SETUP.md).

Pre-flash sim gates (glyph / layout / fleet_fix_sim):

```bash
bash ../scripts/run_sim_gates.sh
```

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

Pots (`dsc-pot-common` **5.1.6+**): each soil channel has **Cal … Offset** / **Cal … Scale**
config numbers (NVS). Formula `raw * scale + offset` applies before range/median and feeds
HA + ESP-NOW. **Soil * Raw** diagnostic templates reverse cal for lab wet measured points.
**Reset Sensor Calibration** restores defaults and clears provenance. **Mark Soil Cal Peer Median**
(5.1.5+) and **Mark Soil Cal Lab Buffer** (5.1.6+) stamp method after HA push / lab wet.

## Panel (DSC-CONTROL **4.0.11**)

Package body: [`dsc-control-common.yaml`](dsc-control-common.yaml).

| Feature | Notes |
|---|---|
| Soil cards + detail | 0xD3 vitals / 0xD4 names; tap pot → NPK drill-down |
| Hold-to-lock | Hold ~3 s on primary tabs; hold lock screen to unlock |
| Demand / takeover gate | Confirm → Engage (not one stray tap) |
| Connections | Wi‑Fi channel; ESP-NOW RX age + TX seq; silent → ping/WiFi bounce |
| AP pin | Runtime only: hub **Lock WiFi AP** learns preferred BSSID into NVS; 0xD0 fleet-beats it; Control/pots `adopt_hub_wifi_ap`. Stubs stay `00:00:00:00:00:00` — never bake a site MAC into YAML. |
| Pulse VPD trend | 12×5 min ring → one label (no canvas charts) |
| HA API | **Plaintext** (no Noise); **mDNS off** — add by IP only |
| Stability | **4.0.10** page-gated `refresh_ui` @ 5 s |
| Snappiness | **4.0.11** `refresh_ui` reads `gv_*` live (template mirrors parked); 30 s Wi‑Fi channel poll |

After UI flashes: watch serial `boot` / `heap` lines. If the panel boot-loops, use **USB** not OTA until `DSC-CONTROL 4.0.11 up — free_heap=…` prints cleanly. See [`../_history/v4/crash-logs/`](../_history/v4/crash-logs/).

### Panel HA API reconnect

The `api:` block lives in [`dsc-control-common.yaml`](dsc-control-common.yaml). **v4.0.9+ has no Noise encryption** — LVGL RAM left the Noise handshake failing (`HANDSHAKESTATE_SETUP_FAILED`) and the teardown path double-freed the heap (reboot whenever HA probed). mDNS is **disabled** (setup OOM left it FAILED forever). ESPHome’s “Unable to connect… includes an `api` section” toast is **generic** — it does **not** mean the YAML is missing `api:`.

| Check | What to do |
|---|---|
| Panel boot-looping / no Wi‑Fi | USB flash; serial must show `DSC-CONTROL 4.0.11 up — free_heap=…`. OTA will not recover a looping board. |
| Host / mDNS | **IP only** — lab Nest reservation **`192.168.86.177`** (`use_address` in `dsc-control-wifi-lab.yaml`). Do not use `dsc-control.local`. |
| Encryption | Leave the key **blank** when adding/reconfiguring. If HA still has an old encrypted entry, **delete it** and re-add. |
| Stale `dsc-cyd1` | Delete old **dsc-cyd1** ESPHome device in HA Integrations if present. |
| Secrets on HA | Still need `dsc_control_ota_password` / `_ap_password` for Install/fallback AP (`dsc_control_api_key` unused by panel firmware). |
| Stub on HA | `/config/esphome/dsc-control.yaml` should match [`homeassistant/esphome/dsc-control.yaml`](../../homeassistant/esphome/dsc-control.yaml); Validate before Install. |
| Bundle fails: `… is not a valid YAML file` / `expected '<document start>'` | Almost always a **header comment** in the package body that lost its `#` (looks like `v4.0.x:` at column 2). ESPHome then treats the changelog line as YAML and dies before `substitutions:`. Fix on git, push, set stub `refresh: 0d`, Validate again. |

ESP-NOW (glass ↔ hub) does **not** need the HA API. Fix API only for OTA, diagnostics, and HA time backup.

**Package header rule:** changelog lines in `dsc-control-common.yaml` (and other bodies) must stay `#` comments. An uncommented `v4.0.11:`-style line breaks HA git-pull Install with `not a valid YAML file` at the first root key.

### Phase 1 fleet notes (stability + snappiness)

| Device | Change | Flash |
|---|---|---|
| Pots + Sonoffs | `power_save_mode: none` + `logger: INFO` | OTA fine |
| Hub | 30 s Wi‑Fi channel poll (silent Nest hops) | OTA fine |
| Panel 4.0.11 | Live `gv_*` UI + channel poll | **USB** if heap-sensitive / still looping |
| HA packages / automations / dashboard | Push sync (or copy) + reload | See [`../../RELEASE.md`](../../RELEASE.md) · [`../../scripts/HA-SYNC-BOOTSTRAP.md`](../../scripts/HA-SYNC-BOOTSTRAP.md) |

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
