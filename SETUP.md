# DSC-HUB — standalone SoftAP setup (no Home Assistant)

**Product unbox path.** SoftAP + hub + DSC-CONTROL is the local climate kit.
Catalogs / Want / advanced UI destination: Pi offline brain — see
[`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md) and Notion
[Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c).
Home Assistant remains an optional lab scaffold ([`INSTALL.md`](INSTALL.md),
[`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md)).

Kit firmware stubs: `dsc-hub-kit.yaml`, `dsc-control-kit.yaml`, `dsc-pot{1..4}-kit.yaml`, `dsc-bridge-kit.yaml`

Lab/bench stubs (`dsc-hub.yaml`, etc.) keep compile-time WiFi and MACs and do **not** include `dsc_fleet_setup` (hub/panel/pots use `${panel_mac}` / `${hub_mac}`). Kit SoftAP builds still load fleet setup.

## What you need

- Phone or laptop with Wi‑Fi
- Kit card password = `dsc_setup_ap_password` in `secrets.yaml` (from `generate-secrets.sh`)
- Power for HUB, DSC-CONTROL, and pot sensors
- **Optional:** home 2.4 GHz Wi‑Fi (fixed channel strongly recommended — mesh/Nest hops break ESP-NOW)
- Internet is optional (SNTP clock when available; local-only mode works with Control alone)

Sonoffs flash onto SoftAP `DSC-Anchor` (static `192.168.4.20`–`.23`) with Nest/home as fallback. After the ETH01 bridge is paired and Ethernet is up, appliances follow hub demand without HA (F-010 / SoftAP NAPT). Local-only hub `DSC-Setup-*` without the bridge cannot reach Sonoffs.

## Flash order (factory / first kit)

From `firmware/v4/` with a filled `secrets.yaml`:

1. `esphome run dsc-hub-kit.yaml` (USB)
2. `esphome run dsc-control-kit.yaml` (USB)
3. `esphome run dsc-pot1-kit.yaml` … `dsc-pot4-kit.yaml` (USB; POT2 canary first if preferred)
4. `esphome run dsc-bridge-kit.yaml` (USB · WT32-ETH01 · `flash_mode: dio`)
5. Sonoffs (heater / heatmat / humidifier / dehumidifier) — SoftAP static IPs; flash after bridge

## Unboxing (end user)

1. **Power the HUB.** It opens SoftAP `DSC-Setup-XXXX` (XXXX = last four hex of hub MAC).
2. On your phone, join that network. Password is on the kit card.
3. Open a browser to `http://192.168.4.1/` (many phones open a captive page automatically).
4. Choose:
   - **Home Wi‑Fi** — pick/type your 2.4 GHz SSID + password. Prefer a **fixed channel**.
   - **Local only** — fleet stays on the HUB hotspot (no router). Optional: set local time for photoperiod.
5. Tap **Save & continue**. Keep the phone on the setup network.
6. **Power DSC-CONTROL.** It finds `DSC-Setup-*`, registers with the hub, pulls credentials, reboots onto the target network. It does **not** run a captive portal (CYD RAM).
7. **Power each pot.** Same automatic join / register / reboot.
8. **Power the ETH01 bridge** (Ethernet cabled to the LAN). SoftAP **`DSC-Anchor`** comes up on channel 11 with gateway `192.168.4.1`, NAPT, and ESP-NOW on `WIFI_IF_AP` (custom SoftAP — ESPHome cannot combine `wifi:` with `ethernet:`). Copy `sensor.dsc_bridge_anchor_bssid` (SoftAP AP MAC) into hub `bridge_mac` / Lock WiFi prefer. Automatic SoftAP hello to hub `DSC-Setup-*` for the bridge is deferred (F-014).
9. On the phone portal, confirm Control/pots appear under **Devices**, then tap **Finish setup**. Migrate **hub + Control** onto **DSC-Anchor** (static `.10` / `.11`; Lock WiFi prefer Anchor BSSID). Leave Nest as emergency fallback. **Pots stay ESP-NOW→hub** — do not prefer SoftAP on pots.
10. Leave the setup Wi‑Fi. Use Control to run climate; Soil tab shows pot data over ESP-NOW. Sonoffs join SoftAP (`.20`–`.23`); bridge drives them via Noise API when demand is on. Lab HA needs route `192.168.4.0/24 via` bridge ETH — see [`docs/qa/SOFTAP-FLEET-HOME.md`](docs/qa/SOFTAP-FLEET-HOME.md).

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
