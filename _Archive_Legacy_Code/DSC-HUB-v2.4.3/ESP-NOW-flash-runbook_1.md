# DSC ESP-NOW Pot Rollout — USB Flash Runbook (tonight)

**Goal:** get the four soil pots off the old monolithic v0 firmware and onto `dsc-pot-common` v2.4.1, so each pot unicasts its `soil_temperature` straight to the hub every 60 s. That 60 s heartbeat is what stops the grow-mat's root-zone probe from ever false-going-offline — the exact failure that shut the mat off with your roots at 17.9 °C.

**Validated before you start:** hub v2.4.3 and all four pot configs pass `esphome config` clean in ESPHome 2026.6.5. The consumer (hub) resolves `providers: [dsc-pot1..4]` reading `remote_id: soil_temperature`; the pots send exactly that to the hub MAC. The link is schema-correct end to end — no config surprises at the USB cable.

## Files in this package

- `dsc-pot-common.yaml` — the v2.4.1 shared package (this **replaces** your current `dsc-pot-common.yaml`; the ESP-NOW provider block is at the bottom).
- `dsc-pot1.yaml … dsc-pot4.yaml` — the per-node stubs (unchanged pattern: name + friendly_name + 3 secret refs + `!include dsc-pot-common.yaml`).

Put all five in your ESPHome config folder next to your existing `secrets.yaml`.

### ⚠ Device names use UNDERSCORES (`dsc_pot1`), on purpose

The pot stubs set `name: dsc_pot1` (underscore), and the hub's ESP-NOW `providers:` / `provider:` are `dsc_pot1` to match. This is **load-bearing, not cosmetic**: I read the ESPHome `packet_transport` source — the sender stamps its exact `name:` field (`App.get_name()`) into every packet, and the hub matches providers by an exact `strcmp`. So the pot `name:` and the hub `providers: - name:` must be **byte-identical**, and they must match your deployed pots' existing identity (`dsc_pot*`). A hyphen on one side and an underscore on the other = the hub silently drops every packet and the link never lights.

ESPHome will print a warning on each pot build — *"Using the '_' character in the hostname is discouraged…"* — that is **expected and harmless here**; it's just ESPHome preferring hyphens in general. One consequence: `dsc_pot1.local` mDNS resolution can be flaky with underscores, so for later OTA updates target the pot's **IP** (e.g. `192.168.86.47`) rather than the `.local` name. Tonight's first flash is USB, so it doesn't apply.

## Device inventory (captured 19 Jul)

| Node | MAC | Role |
|---|---|---|
| DSC-HUB | `84:1F:E8:16:E6:60` | ESP-NOW **consumer** (already on v2.4.x) |
| DSC-POT#1 | `8C:4F:00:27:E0:10` | drives the mat's primary HA-mirror entity |
| DSC-POT#2 | `F0:24:F9:59:C3:14` | **canary** — flash first |
| DSC-POT#3 | `A0:A3:B3:90:DA:B0` | faulted moisture probe (temp link still useful) |
| DSC-POT#4 | `EC:E3:34:7B:E7:A8` | the cold pot from the 19 Jul incident |

---

## Step 0 — Pre-flight (5 minutes, do once)

**a) Generate the shared ESP-NOW key.** One key, byte-identical on all five nodes. On any machine:

```
openssl rand -hex 16
```

Add the result to your `secrets.yaml` (the same file all your devices build against):

```yaml
espnow_key: "<paste the 32-hex-char string here>"
```

The schema accepts any length, but 32 hex chars gives xxtea a full key. **It must be identical in every secrets.yaml the hub and the four pots build from** — a mismatch means the hub silently rejects the packets (auth fail) and you'll chase a ghost.

**b) Lock the router's 2.4 GHz channel.** ESP-NOW rides the WiFi channel. If the router auto-hops channels, the link splits silently. Pin the 2.4 GHz band to a fixed channel (1, 6, or 11) in the router admin. (If you skip this the mat still works — it degrades to the HA mirror — but the whole point is to not need HA, so lock it.)

**c) Make sure the hub is on v2.4.x with the ESP-NOW consumer.** v2.4.1/2/3 all have it. If you haven't flashed **v2.4.3** yet, do it now over the air (`esphome run dsc-hub-v2_4_3.yaml`) — it's the build with the mat root-safety fix and Full-Auto-as-master. The hub only *listens*; hearing nothing changes nothing, so flashing it first is safe.

---

## Step 1 — Flash POT2 (the canary) via USB

The pots are on old firmware whose OTA password won't match your new secrets, so the **first** flash of each pot must be over USB serial. After that, OTA works.

Plug POT2 into the machine running ESPHome. Then either path:

**ESPHome dashboard / HA add-on:** open `dsc-pot2.yaml` → **Install → Plug into this computer** → pick the serial port. (If you're on the HA add-on, the pot must be plugged into the HA host, or use the *ESPHome Web* flasher in Chrome for the first serial flash.)

**ESPHome CLI (Windows):**
```
esphome run dsc-pot2.yaml --device COM3
```
(swap `COM3` for the port that appears in Device Manager when you plug it in; on Linux/Mac it's `/dev/ttyUSB0` or `/dev/ttyACM0`.)

Most ESP32 dev boards auto-reset into the bootloader. If the upload can't connect, hold **BOOT** on the board while it says "Connecting…", release once it starts.

---

## Step 2 — Verify the link before touching the other three

This is the whole reason POT2 goes first. Within ~150 s of POT2 rebooting, on the **hub** check:

1. **`binary_sensor.dsc_hub_pot2_esp_now_link` → on.** That's the hub confirming it's hearing POT2's direct packets. (POT1/3/4 links will still be off — that's expected.)
2. **`binary_sensor.dsc_hub_root_zone_sensor_fault` → clears** (goes off), and the **ROOT-ZONE PROBE OFFLINE** banner disappears — one live pot is enough to keep the loop alive.
3. The mat resumes closed-loop on the real root temperature. In the log you'll see the honest `Root zone (coldest pot) …` line instead of the `PROBES BLIND - air proxy` one.

If the link stays **off** after ~3 min, stop and check the three usual suspects (see Troubleshooting) before flashing the rest — better to fix it on one node than four.

---

## Step 3 — Roll POT1, POT4, POT3

Once POT2's link is confirmed, flash the rest the same way (USB first time):

```
esphome run dsc-pot1.yaml --device COM3
esphome run dsc-pot4.yaml --device COM3
esphome run dsc-pot3.yaml --device COM3
```

Order rationale: POT2 (canary) → POT1 (mat-critical, so prove the method first) → POT4 (the cold-pot from the incident) → POT3 last (its moisture probe is faulted; the temp link should still come up — watch that its link goes on even though moisture reads 0.0 %). After each, confirm that node's `…_esp_now_link` goes on.

When all four are up, all four `binary_sensor.dsc_hub_potN_esp_now_link` read on, and the mat is heating on the coldest real root reading — HA is fully out of the mat's sense loop.

---

## Rollback / safety

- A pot that won't boot after a flash: just re-flash it over USB; nothing else depends on it being up, and the hub degrades that pot to its HA mirror (and, if all are blind, to the air proxy) automatically.
- Nothing here touches the hub's control logic — the pots are pure senders. The worst case of a botched pot flash is "that pot is offline," which is exactly the state v2.4.3 already handles safely.

## Troubleshooting — link won't come up

Three causes, in order of likelihood:

1. **Key mismatch** — `espnow_key` differs between the hub's secrets and this pot's. Re-check both are the exact same string, re-flash. (This is silent — packets arrive but fail auth, so the link just never lights.)
2. **Channel split** — router hopped channels, or the hub and pot associated on different channels. Lock the 2.4 GHz channel (Step 0b) and reboot both.
3. **MAC mismatch** — the pot is unicasting to `84:1F:E8:16:E6:60`; confirm that's still the hub's MAC (it's in `dsc-pot-common.yaml`'s `peers:` and `peer_address:`). If you ever reflash the hub to different hardware, update it.

If the link is up but a pot reads implausibly (POT3's 0.0), that's fine — the hub's 5–45 °C plausibility filter drops it from the mat's coldest/hottest scan, so a faulted probe can neither peg the mat on nor blind the loop.
