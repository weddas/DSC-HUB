# Tuya / SmartLife Wi-Fi devices — local setup

DSC-HUB drives SmartLife (Tuya) Wi-Fi plugs and testers directly over your LAN. Once a device's
**local key** is on the Pi, the Tuya cloud is never used: the brain talks to the device on TCP 6668
with the `tinytuya` library, and you can block the device's internet access at the router.

This is the operator guide. The design is in
[`docs/design/plan-tuya-local-2026-09-07.md`](../design/plan-tuya-local-2026-09-07.md).

## Before you start — what Tuya devices can and cannot do here

| | Tuya **Zigbee** device (paired through a Tuya hub) | Tuya **Wi-Fi** device (paired straight to your Wi-Fi) |
|---|---|---|
| How DSC-HUB reaches it | Pair it to the Pi's Zigbee coordinator instead (Settings › Devices › Zigbee › Permit join). No keys, no cloud. | This guide. |
| Failsafe | Same as any Zigbee plug. | **Keeps its last state if the brain stops.** Use it for pumps, dosing and aux fans (`plug_*` roles), not for the heater / humidifier / dehumidifier / heat mat, which stay on the hub-driven relays. |
| Local connections | n/a | **One at a time.** While the brain holds the socket the SmartLife app goes through the cloud, or stops working for that device once you block its internet — which is the point. |

Supported device types today: **smart plug** (single gang, optional power metering), **relay / switch**,
**water quality tester** (pH · TDS · EC · salinity · SG · ORP · CF · water temperature). Other kinds are
added one at a time when someone has one.

## 1. Get the local keys (once, on any PC)

Tuya only hands out local keys through its developer platform. This is a one-time export; the brain
never contacts Tuya.

1. Sign up (free) at **iot.tuya.com** → *Cloud* → *Create Cloud Project*.
   Data centre: the region your SmartLife app uses (e.g. *Central Europe Data Center*, *Western America*).
   Industry *Smart Home*, development method *Smart Home*. Accept the free **IoT Core** trial when offered.
2. In the project: *Devices* → *Link Tuya App Account* → *Add App Account* → scan the QR code with the
   SmartLife app (Me → scanner). Your devices appear under the project.
3. From the project *Overview* note the **Access ID / Client ID** and **Access Secret / Client Secret**.
4. On the PC:

   ```bash
   python -m pip install tinytuya
   python -m tinytuya wizard
   ```

   Answer with the Access ID, the Access Secret, the id of **any one** of your devices (SmartLife → the
   device → ⚙ → *Device Information* → *Device ID*), and the region. Say **Y** to *Download DP Name
   mappings* / *download all device data* and **Y** to *Poll local devices* — polling fills in each
   device's IP.
5. The wizard writes `devices.json` next to where you ran it. That file is what you paste into DSC-HUB.

Notes

- The free IoT Core trial expires after a while. Keys you already exported keep working; you only need
  the platform again for a **new** device or after **re-pairing** one (re-pairing rotates the key).
- Keep `devices.json` private. Anyone on your LAN with a device's key can switch it.

## 2. Give each device a fixed address

The brain runs in a container on a bridge network and **cannot hear Tuya's discovery broadcasts**, so
every device needs a stable IP:

1. On your router, add a **DHCP reservation** for each Tuya device (MAC is in `devices.json` and in
   SmartLife → device → ⚙ → *Device Information*).
2. Optional but recommended: **block the device's WAN access** on the router. Then nothing about your
   grow leaves the house. The SmartLife app stops controlling that device; DSC-HUB takes over.

## 3. Import, probe, bind (in DSC-HUB)

Settings › **Devices** › **Zigbee** › card **Tuya / SmartLife (Wi-Fi, local)**
(`#/settings/devices#tuya`) → **Add devices (import keys)**.

1. **Get the keys** — paste the contents of `devices.json`, press **Import**. Devices without an IP are
   listed; you type the IP in the next step.
2. **Reach each device** — for each device: IP, protocol version (3.3 for most, 3.4/3.5 for newer
   firmware), **Probe**. Close the SmartLife app first. A good probe shows the raw datapoints (`DPS`)
   and suggests a type. Pick the type, **Save**.
   - `Check device key or version` → the key is wrong (re-run the wizard) or try another version.
   - `Unable to Connect` → wrong IP, device off, or the app still holds the socket.
3. **Done — bind roles** closes the drawer. In the table give each device a **Role** and **Zone**
   (and an optional **Task**), then **Save roles & tasks**. The lists are filtered by device type;
   **Show all** widens them.

The line under each device is its honesty state:

- **LIVE** a report within 30 s · **STALE** older · **OFFLINE** unreachable (60 s silence, or
  immediately after a socket/key error) · **KEY CHANGED** the device was re-paired — export and
  import again.
- After a write: **PENDING** commanded, echo not yet seen · **SYNCED** device agrees · **DIFFERS**
  someone changed it elsewhere (the app, the button) · **FAILED** the write did not land.

## 4. Use it

- **Rules** (Settings › Automation): action **Tuya plug** (`tuya_switch`) — ON or OFF while the
  rule fires, restored on clear. The picker lists **Tuya** plugs only; Zigbee uses a separate
  **Zigbee switch** action. Architecture: [`docs/brain/TUYA-LOCAL.md`](../brain/TUYA-LOCAL.md).
- **Tasks / recipes** work the same as for Zigbee devices (tank-full → appliance OOS, flood → banner).
- Every datapoint of a bound device is an entity the rule engine can trigger on:
  `sensor.dsc_tuya_<role>_<key>` / `binary_sensor.dsc_tuya_<role>_<key>` (e.g.
  `sensor.dsc_tuya_reservoir_4x8_ph`, `binary_sensor.dsc_tuya_plug_pump_state`).
- A tester bound to a **Reservoir** role appears in the shared Zigbee-by-role buckets (Climate
  Other sensors path). Entity ids use the `dsc_tuya_*` prefix above.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `TINYTUYA MISSING` chip | Brain image predates the Tuya lane | Update the brain (Firmware › Kit update) |
| Probe says key or version | Wrong key, or protocol 3.4/3.5 unit set to 3.3 | Re-run the wizard; try each version |
| OFFLINE right after the app was open | App held the single socket | Close the app; the brain reconnects within a minute |
| DIFFERS keeps coming back | The plug's physical button, or the app via cloud | Block WAN for the device; use DSC-HUB for control |
| A reading looks 10× off | Wrong scale for this unit | Edit → Advanced → Scales (e.g. `{"ph": 0.1}`) after checking the raw DPS from Probe |
| A reading is missing | The unit does not send that DPS, or it sits on another number | Probe; adjust Edit → Advanced → DPS map |

## Instead of keys: reflashing

If a device has an ESP8266/ESP32 inside (older units), flashing ESPHome makes it a native seat with the
same failsafe story as the rest of the kit — preferable to this lane. Most SmartLife hardware since
2021 uses Beken chips; those need OpenBeken via `tuya-cloudcutter`, which is outside this guide.
