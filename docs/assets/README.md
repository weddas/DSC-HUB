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

### Plant seat dash (requested direction)

Per-plant / per-pot detail view — not the room twin, not compose:

- **Soil cross-section** from committed blend (layered %, volume) — same graphic language as Build Medium card
- **Identity:** nickname, strain, sprout date → age (days)
- **Nutrition:** recipe / mix note + stage dose honesty (catalog only — no invented feed rates)
- **Live Got:** moisture / EC / pH / NPK when pot sensors exist; “unavailable” when not
- **Seat link:** roster slot ↔ assigned pot; opens from Dash click or Root Zone / Fleet seats

Data already partly wired: roster blend + recipe, `sensor.dsc_potN_days_since_sprout`, soil Got, Build live-pot chips. Visual north star is glass HUD over the soil graphic + sparse stats, not another form.
