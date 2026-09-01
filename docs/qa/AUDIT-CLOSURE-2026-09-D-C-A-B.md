# Post–Mega Pass D → C → A → B — Closure (2026-09-01)

**Prior:** [`AUDIT-CLOSURE-2026-09.md`](AUDIT-CLOSURE-2026-09.md) · **Gate 0:** [`GATE0-SOAK-2026-09.md`](GATE0-SOAK-2026-09.md)  
**Pi SPA after D:** `index-CXq-NptO.js` (hotpatched 2026-09-01)

---

## D — Quality splits (closed)

| Target | Result |
|--------|--------|
| `SettingsPage.tsx` | Extracted to `components/settings/*` (ZigbeeBindRow, Device rows, helpers) |
| `PlantWizard.tsx` | Orchestrator + `components/plantWizard/*Step.tsx` |
| `GrowPages.tsx` | `components/roster/RosterLifecycleDialogs.tsx` |
| Build | `npm run build:spa` green |
| Pi hotpatch | Live `index-CXq-NptO.js` |

---

## C — Hardware (partial close)

| Item | Status | Evidence |
|------|--------|----------|
| z2m radio | **closed** | `/settings/zigbee/health`: `radio_up: true`, `end_device_count: 4`, `bridge_state: online` |
| F-003 / POT3 | **retired** | Operator 2026-09-01: pot3/4 no longer in kit — not chasing flash/enable; Advanced restore only |
| F-001 AC relay | **on hold** | Operator 2026-09-01: indefinitely on hold; honest OOS UI remains |
| F-002 Clone mister | **on hold** | Operator 2026-09-01: indefinitely on hold; honest OOS UI remains |

Software: pot3/4 stay `in_service=false` by default (`test_pot3_default_out_of_service`); kit probes remain 1–2 only.

---

## A — CannaLib (closed for lab gateway)

| Item | Status | Evidence |
|------|--------|----------|
| MP-030 offset/pagination | **closed** | `/settings/catalog/status`: remote `http://192.168.86.2:8790` ok; `/v1/catalogs/strain?offset=0` vs `offset=3` return distinct rows |
| External prod deploy | **N/A** | Kit uses LAN CannaLib at `.86.2:8790`; offset honored by live API |

---

## B — Zigbee recipe (closed verify)

| Item | Status | Evidence |
|------|--------|----------|
| MP-040 one recipe | **closed** | `leak_floor_4x8` bound (`0xa4c1380d734f2033`); policy_state present; Climate/Settings Wet/Dry + Problem chips |
| Other recipes | **deferred** | MP-041 multi-sensor; MP-042 `leak_floor_2x4` (no HW) |

Devices on Pi: canopy_4x8, leak_tank, leak_floor_room, leak_floor_4x8.

---

## Register impact

- MP-053 → closed (splits + build)
- MP-062 partial: z2m closed; F-003/POT4 **retired**; F-001/F-002 **on hold** (operator 2026-09-01)
- MP-030 → closed (lab gateway offset verified)
- MP-040 → closed (leak_floor_4x8 live)

---

## Version

**7.4.0** no longer gated on F-003/F-001/F-002 (operator retired pot3/4; AC/mister on hold indefinitely). Remaining gates: Phase 0 soak signoff + operator walk on `.48`.
