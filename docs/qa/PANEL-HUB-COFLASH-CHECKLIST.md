# Panel + Hub paired flash checklist (Climate Mode 0xD1 v2)

**When:** Any flash that changes `clone_mode_idx` meaning, grow_stage option count, or 0xD1 version byte.

**Protocol:** Hub vitals `0xD1` version byte **`0x02`**. Climate Mode idx: `0=Follow 4x8`, `1=Follow Plants`, `2=Custom`, `3=Off`. Grow stage idx `0–11` includes **Custom** then **Off**.

## Before flash

- [ ] Confirm working tree: `firmware/v4/dsc-hub-v4_0.yaml`, `dsc-hub-espnow-primary.yaml`, `dsc-control-common.yaml` on same commit
- [ ] Brain already ships Follow Plants / no `grow_stage` overwrite (`pytest` climate tests green)
- [ ] Operator knows SPA Climate Mode options will match policy taxonomy after HA rediscovers hub select

## Flash order

1. [ ] Flash **hub** (USB or OTA)
2. [ ] Flash **panel / control** immediately after (same release)
3. [ ] Do **not** leave old panel on new hub (or vice versa) — idx remap looks like wrong mode

## After flash

- [ ] Hub log: boot migrates `Clones & Seedlings` → `Follow Plants`, `Mother` → `Custom` if present
- [ ] Panel Pulse shows Climate Mode labels: Follow 4x8 / Follow Plants / Custom / Off
- [ ] Set Climate Mode to garbage/unknown via API if possible → hub log **no stamp** (fail-closed)
- [ ] `grow_stage` Off on panel selects Off (not Custom)
- [ ] Follow Plants + Pi online → clone temp/RH/VPD numbers update without changing 4×8 `grow_stage`

## Rollback

Flash previous matched hub+panel pair together. Do not mix versions.
