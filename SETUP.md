# DSC-HUB — standalone SoftAP setup (no Home Assistant)

**Product unbox path.** SoftAP + hub + DSC-CONTROL is the local climate kit.
**Pi island (current product):** DSC-Brain AP + SPA — see
[`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md), [`docs/ops/DSC-HUB-DOCKER.md`](docs/ops/DSC-HUB-DOCKER.md),
and Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c).
Home Assistant remains an optional lab scaffold ([`INSTALL.md`](INSTALL.md),
[`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md)).

Kit firmware stubs: `dsc-hub-kit.yaml`, `dsc-control-kit.yaml`, `dsc-pot{1..4}-kit.yaml`  
**Bridge kit retired (7.1):** former `dsc-bridge-kit.yaml` lives under `firmware/_history/v4/`.

Lab/bench stubs (`dsc-hub.yaml`, etc.) keep compile-time WiFi and MACs and do **not** include `dsc_fleet_setup` (hub/panel/pots use `${panel_mac}` / `${hub_mac}`). Kit SoftAP builds still load fleet setup.

## What you need

- Phone or laptop with Wi‑Fi
- Kit card password = `dsc_setup_ap_password` in `secrets.yaml` (from `generate-secrets.sh`)
- Power for HUB, DSC-CONTROL, and pot sensors
- **Optional:** home 2.4 GHz Wi‑Fi (fixed channel strongly recommended — mesh/Nest hops break ESP-NOW)
- Internet is optional (SNTP clock when available; local-only mode works with Control alone)

**Sonoffs (Pi island):** Flash onto DSC-Brain Wi‑Fi and let the brain appliance driver follow hub demand — [`docs/ops/SONOFF-FLASH.md`](docs/ops/SONOFF-FLASH.md). ETH01 bridge is archived; do not flash `_history` bridge YAML for new installs.

**Sonoffs (legacy SoftAP-only kit without Pi):** Require HA demand followers or a revived bridge path — not the supported 7.1 product cut.

## Flash order (factory / first kit)

From `firmware/v4/` with a filled `secrets.yaml`:

1. `esphome run dsc-hub-kit.yaml` (USB)
2. `esphome run dsc-control-kit.yaml` (USB)
3. `esphome run dsc-pot1-kit.yaml` … `dsc-pot4-kit.yaml` (USB; POT2 canary first if preferred)
4. Sonoffs — prefer Pi island helpers in [`docs/ops/SONOFF-FLASH.md`](docs/ops/SONOFF-FLASH.md) (LAN or fallback SoftAP). Skip bridge.

## Unboxing (end user)

1. **Power the HUB.** It opens SoftAP `DSC-Setup-XXXX` (XXXX = last four hex of hub MAC).
2. On your phone, join that network. Password is on the kit card.
3. Open a browser to `http://192.168.4.1/` (many phones open a captive page automatically).
4. Choose:
   - **Home Wi‑Fi** — pick/type your 2.4 GHz SSID + password. Prefer a **fixed channel**.
   - **Local only** — fleet stays on the HUB hotspot (no router). Optional: set local time for photoperiod.
   - **Pi island (preferred product):** migrate STA to `DSC-Brain` after Pi bootstrap — see [`docs/ops/DSC-HUB-DOCKER.md`](docs/ops/DSC-HUB-DOCKER.md).
5. Tap **Save & continue**. Keep the phone on the setup network.
6. **Power DSC-CONTROL.** It finds `DSC-Setup-*`, registers with the hub, pulls credentials, reboots onto the target network. It does **not** run a captive portal (CYD RAM).
7. **Power each pot.** Same automatic join / register / reboot.
8. **Do not power an ETH01 bridge for 7.1 Pi island** — configs are archived. Sonoffs join DSC-Brain; brain drives `main_relay`.
9. On the phone portal, confirm Control/pots appear under **Devices**, then tap **Finish setup**.
10. Leave the setup Wi‑Fi. Use Control (or Pi SPA `:8787`) to run climate; Soil tab shows pot data over ESP-NOW when that radio path is in use.

### Add a device later

On the hub portal (re-join SoftAP or use **Add device window** if still in range), tap **Add device window**, then power the new unit.

### Factory reset fleet config

Portal → **Factory reset fleet config** clears NVS Wi‑Fi/pairing on the HUB only. Re-run mode + pair satellites again.

## Modes

| Mode | Network | HA | Internet |
|---|---|---|---|
| Local only | HUB SoftAP | Not required | Not required |
| Home Wi‑Fi | Your router | Optional later | Optional (SNTP/OTA) |

## Lab vs kit

| | Lab stubs | Kit stubs |
|---|---|---|
| WiFi | `!secret wifi_ssid` baked in | SoftAP / NVS via portal |
| Peers | Hardcoded MACs in stubs | Learned via `/setup/hello` |
| Command | `esphome run dsc-hub.yaml` | `esphome run dsc-hub-kit.yaml` |

## Files

- Component: `firmware/v4/components/dsc_fleet_setup/`
- Hub portal package: `dsc-fleet-setup-hub.yaml`
- Satellite packages: `dsc-fleet-setup-satellite.yaml`, `dsc-fleet-setup-pot-kit.yaml`
- WiFi splits: `dsc-*-wifi-lab.yaml` / `dsc-*-wifi-kit.yaml`

## HA note

Home Assistant install remains documented in `INSTALL.md`. After this change, lab packages expect the `dsc_fleet_setup` component (copy `firmware/v4/components` beside your ESPHome configs, or use a git `external_components` source once published). Kit SoftAP setup does not require HA at all.
