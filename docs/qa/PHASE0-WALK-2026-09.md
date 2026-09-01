# Phase 0 — Live walk & gate status (2026-09-01)

**Pi:** `192.168.86.48:8787` · **Surface:** `7.4.0` · **SPA:** `index-K2_ziUnM.js`  
**Prior:** [`GATE0-SOAK-2026-09.md`](GATE0-SOAK-2026-09.md) · [`AUDIT-CLOSURE-7.4.md`](AUDIT-CLOSURE-7.4.md)

---

## Phase 0 gate matrix

| Gate | Owner | Status | Evidence |
|------|-------|--------|----------|
| z2m radio | Operator | **closed** | `/settings/zigbee/health`: `radio_up: true`, `end_device_count: 4`, bridge online |
| Live walk | Operator | **pass (API-backed)** | Brain APIs green; sprout/stage live on probe1/2; bundle `index-CXq-NptO.js` |
| FlowSankey 48h soak | Operator | **closed** | [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md) — calendar elapsed; air CFM live; mass chip gated |

**Phase 0: CLOSED** — see [`AUDIT-CLOSURE-7.4.md`](AUDIT-CLOSURE-7.4.md).

---

## API walk (2026-09-01)

| Endpoint | Result |
|----------|--------|
| `/` | SPA HTML serves `index-CXq-NptO.js` |
| `/fleet/computed` | probe1 stage `Final 48-72h Flowering` · day 669; probe2 `Early Flowering` · day 54 |
| `/settings/catalog/status` | CannaLib remote ok (`192.168.86.2:8790`) |
| `/settings/zigbee/health` | `radio_up: true` |
| `/settings/zigbee/devices` | 4 bound end devices incl. `leak_floor_4x8` |

**Browser note:** First automation load showed transient "Connecting to fleet…"; API `/fleet/computed` confirms live brain state (same as Gate 0).

---

## Hardware gates (do not block 7.4.0)

Per operator 2026-09-01: POT3/POT4 **retired**; F-001/F-002 **on hold indefinitely**. Honest OOS UI remains.

---

## Next

1. Deploy 7.4.0 surface to Pi (brain + SPA + `.env`)
2. Operator signoff → git tag `v7.4.0`
