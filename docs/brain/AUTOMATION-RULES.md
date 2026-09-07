# Automation rules (v2)

**In one line:** Edge-triggered operator rules — compound triggers, window/debounce/hysteresis/max-age, fail-closed — with allow-listed actions that never fight the hub ladder or Sonoff appliance driver.

Code: [`brain/dsc_brain/automation_rules.py`](../../brain/dsc_brain/automation_rules.py). SPA editor: Settings › Brain + Alerts rules table (`AutomationRulesCard`).

## API

| Method | Path | Notes |
|---|---|---|
| `GET` | `/settings/automations` | Rules + live owned state |
| `GET` | `/settings/automations/targets` | Allow-listed relay / setpoint targets (+ ESP clamps) — SPA must not hardcode |
| `PUT` | `/settings/automations` | Replace rule list; re-evaluates immediately; **403 in demo mode** |

Every rule is **disabled by default**. Save validates allow-lists; invalid rules → HTTP **400**.

## Trigger model

```mermaid
flowchart TD
  raw[Fleet HA-shaped states] --> merge[Merged read view]
  computed[Computed entities · CFM VPD alerts] --> merge
  merge --> cond[Conditions all|any]
  cond --> win{Time window?}
  win -->|no / in window| deb{Debounce hold}
  deb -->|held| fire[Fire actions · capture prior]
  fire --> own[Owned-state tracking]
  own --> clr{Clear / release}
  clr -->|release_s clear| restore[Restore captured prior]
```

- v1 flat `trigger` object still loads as a one-condition `all` group.
- Conditions read one entity each (max 8). Numeric ops support **hysteresis**; any condition may set **max_age_s** (stale / missing timestamp → fail closed).
- Optional per-rule **window** (local HH:MM, wraps midnight), **debounce_s**, **release_s**.

## Actions and safety boundary

| Action | Use | Restore on clear |
|---|---|---|
| `banner` | Operator banner | yes (dismiss owned) |
| `oos_seat` | Mark Sonoff seat out of service | yes |
| `zigbee_switch` | Bound Zigbee switch | yes |
| `tuya_switch` | Bound Tuya Wi-Fi plug (`params.device_id`) | yes |
| `relay` | Allow-listed hub / Sonoff relays | yes (prior state) |
| `setpoint` | Allow-listed ESP-clamped numbers | yes (prior value) |

**Hard rules (save-time reject):**

1. **Sonoff appliance relays are cut-out only** (`on_when_firing` must be false). The rule forces OFF via the control proxy and OOS's the seat so `appliance_driver` stops mirroring hub demand; on clear the seat returns and the driver re-asserts from live demand.
2. **Hub `*_demand` switches are not targets** — the decision loop + hub ladder own them; writing them fights control (see shadow mode in [`DSC-BRAIN.md`](../DSC-BRAIN.md)).
3. Allowed hub switches are operator-owned only (manual takeover, tent override, light hold, humidifier intake routing, recirc de-strat pulse, …) — see `RELAY_TARGETS` in code.
4. Setpoints skip `clone_*` under Climate Mode **Follow Plants**; values go through `control_ops.call_service_proxy` with ESP clamps from `SETPOINT_TARGETS`.
5. **`tuya_switch` is not a Sonoff / hub relay** — no 45 s stale cut-out; the plug keeps last state if the brain dies. Prefer auxiliary `plug_*` roles. See [`TUYA-LOCAL.md`](TUYA-LOCAL.md). SPA lists Zigbee and Tuya actions separately (not one combined plug picker).

## Fail closed

Hub offline, missing entity, non-numeric value, or stale reading → that condition is **false**. Actuator write failures are logged; they never raise out of the evaluator.

## Operator UX

- Settings › Brain: full editor (compound triggers, targets from `/settings/automations/targets`).
- Alerts desk: rules table with live state + enabled switch (Dashboard v2 Pass D).
- Zigbee bound datapoints appear as fleet entities (`sensor.` / `binary_sensor.dsc_zigbee_<role>_<key>`) and are valid trigger targets when fresh.
- Tuya bound datapoints use `dsc_tuya_<role>_<key>` (same trigger path when fresh). Actuatable list: `GET /settings/devices/actuatable` (lane-tagged).

## Tests

- `brain/tests/test_automation_rules.py`
- `brain/tests/test_automation_rules_v2.py`
- `brain/tests/test_tuya_local.py` (`tuya_switch` fire/clear)
