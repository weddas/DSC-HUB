# Zone model

**In one line:** Every room and tent is one zone object with a flip-in-place **role**; roles change bands/labels in the SPA and journal a system entry — they do **not** move lamps, fans, or automation yet.

Design source: [`docs/design/plan-v2-dashboard-2026-09-06.md`](../design/plan-v2-dashboard-2026-09-06.md) (Turn 3 / Pass C). Code: [`brain/dsc_brain/zone_model.py`](../../brain/dsc_brain/zone_model.py).

## Hierarchy

```mermaid
flowchart TB
  site[Site / DSC-Core]
  room[Room · role=room · lung]
  z4[Zone 4x8 · grow|dry|cure|empty]
  z2[Zone 2x4 · grow|dry|cure|empty]
  plant[Plant · roster slot]
  site --> room
  room --> z4
  room --> z2
  z4 --> plant
  z2 --> plant
```

| Kind | `zone_id` today | Role |
|---|---|---|
| Room | kit room id (e.g. `grow_room`) | Always `room` — rename only; no role flip |
| Tent / space | space id (`4x8`, `2x4`, …) | `grow` · `dry` · `cure` · `empty` (default `grow`) |

Roles and operator names live in existing `space.extra_json` / `room.extra_json` — **no schema migration**.

## Public API

| Method | Path | Notes |
|---|---|---|
| `GET` | `/zones` | `{ zones, roles, effects }` — rooms first (with `children`), then spaces |
| `PATCH` | `/zones/{zone_id}` | Body: `{ name?, role?, notes? }` — allowed in demo mode |

### Example — list

```http
GET /zones
```

```json
{
  "zones": [
    {
      "zone_id": "grow_room",
      "kind": "room",
      "name": "Grow room",
      "role": "room",
      "children": ["4x8", "2x4"]
    },
    {
      "zone_id": "4x8",
      "kind": "tent",
      "name": "4×8",
      "parent": "grow_room",
      "role": "grow",
      "role_since": null,
      "role_history": [],
      "notes": ""
    }
  ],
  "roles": ["grow", "dry", "cure", "empty"],
  "effects": { "does": { "all": ["…"] }, "does_not": { "all": ["…"] } }
}
```

### Example — flip role

```http
PATCH /zones/4x8
Content-Type: application/json

{ "role": "dry" }
```

Returns `{ zone, changed, journal_entry }`. A role flip appends `role_history` (kept to 12), sets `role_since`, and writes a **system** space-journal entry tagged `role` + new role.

### Constraints (verified)

| Rule | Behavior |
|---|---|
| Unknown `zone_id` | HTTP **404** |
| Bad role / empty name | HTTP **400** |
| Room + non-`room` role | **400** — `"a room has no role to flip — flip the tents inside it"` |
| Name / notes length | name ≤ 40, notes ≤ 400 |
| Older brain (no `/zones`) | SPA treats non-JSON / 404 as "brain predates zones" — see `frontend/src/lib/zonesApi.ts` |

## What a role flip does / does not

The SPA confirm dialog must show the brain's `effects` list verbatim (`ROLE_EFFECTS` in `zone_model.py`):

**Does**

- Record role + `role_since` + history on the zone
- Write a system journal entry with snapshot
- Switch SPA bands / phase chip (Dry → Dry Mode rail; Cure / Empty → no climate band)

**Does not (control-pass follow-up)**

- Turn lamp, fans, mat, or appliances on/off
- Change automation rules, photoperiod, or Want setpoints
- Delete history, journals, or plants

## SPA surfaces

| Surface | Role |
|---|---|
| Settings › Zones | Rename, notes, role flip with before/after + effects confirm (`ZonesSettingsCard`) |
| Overview / Climate | Role chip; Dry rail / "not enforced" lamp tag via `useZoneMeta` + `useZones` |
| Zone strip | Context only (`?zone=`) — not a role editor |

Path builders: `frontend/src/lib/paths.ts`. Hooks: `useZones`, `useZoneMeta`, `useZoneFocus`.

## Tests

- `brain/tests/test_zone_model.py`
