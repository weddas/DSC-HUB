# Docs assets (GitHub / social)

Place release screenshots here for the GitHub social preview and README:

| File | Suggested content |
|---|---|
| `home-fleet-chip.png` | Home pulse with FLEET 5.1.0 / DRIFT chip |
| `learning-phase-b.png` | Learning view Phase A+B + wait bases |
| `system-version-table.png` | System fleet version table |

After capture from a live `/dsc-hub-pro` session, set the repo social preview image
in GitHub → Settings → General → Social preview.

## Inspiration (dashboard visual north star)

Concept renders for DSC-Dashboard / The Dash / Build a Plant — not live UI:

| File | Maps to |
|---|---|
| `inspiration/build-a-plant-flow.png` | Plant → Compose (`dsc-build-plant-card`) — linear Identity → Medium → Light/Climate → Commit |
| `inspiration/ops-dash-hud-vpd.png` | Ops → Dash cinema — digital twin + VPD / cycle HUD overlays |
| `inspiration/ops-dash-climate-glass.png` | Ops climate / tent callouts — glass bubbles anchored to tents (T/RH, flows) |

### Plant seat dash (shipped surface 6.2.0)

Per-plant / per-pot detail — not the room twin, not compose. Live route:
`/dsc-hub#/ops/plant-seat?pot=N`. Ops: [`docs/qa/LIVE-UI-CUSTOM-PANEL.md`](../qa/LIVE-UI-CUSTOM-PANEL.md).

- **Soil cross-section** from committed roster blend — same graphic language as Build Medium
- **Identity:** nickname, strain, sprout date → age (days)
- **Nutrition:** recipe / mix note (catalog / roster only — no invented feed rates)
- **Live Got:** moisture / EC / pH / NPK when pot sensors exist; `—` when not
- **Tent apply:** `script.dsc_apply_pot_to_tent` → `input_select.dsc_potN_tent`; Dash lerps (~0.8s)
- **Entry:** Ops Home chips · Root Zone row · Dash pot click / chip

These inspiration PNGs remain the north star for glass HUD density; do not treat
them as pixel-perfect screenshots of the live panel.
