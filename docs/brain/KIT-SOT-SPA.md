# Kit SoT + professional SPA (Pass A–C)

**In one line:** Live kit is **Probe 1–2**; Settings is blast-radius IA; Climate shows one CFM surface; Root metrics follow producers (see [`../ops/FLEET-SOIL-METRICS.md`](../ops/FLEET-SOIL-METRICS.md)).

Shipped tip **`07bf25f`** (Pass A–C + residuals + NPK producers). Design lock: [`../superpowers/specs/2026-08-29-professional-spa-ui-design.md`](../superpowers/specs/2026-08-29-professional-spa-ui-design.md). Cursor encodes: `.cursor/rules/dsc-kit-sot.mdc`, `dsc-viz-honesty.mdc`, skill `dsc-spa-pi-verify`.

## Kit model

| Constant | Use |
|----------|-----|
| `KIT_PROBE_NUMBERS = [1, 2]` | Live Root, Grow Compose assign, SoftCal/SoilTest pickers, honesty OOS, Kit Pulse, Twin seats |
| `ALL_POT_NUMBERS = [1,2,3,4]` | Entity maps, Device inventory, Advanced restore **only** |

Chrome: **Probe** / **Plant** (not Seat / POT). Internal `seat_id` may stay `potN`.

In-service: prefer `isPotInServiceWithFleet(n, state, fleet)` so Root, honesty, and Settings agree.

```mermaid
flowchart TB
  subgraph live [Live / Grow / Tune]
    kit[KIT_PROBE_NUMBERS]
    kit --> root[Root cards]
    kit --> compose[Compose assign]
    kit --> softcal[SoftCal / SoilTest]
  end
  subgraph settings [Settings Device]
    all[ALL_POT_NUMBERS]
    all --> inv[Inventory + Advanced restore]
    inv -->|in_service| brain[Brain inventory]
  end
  brain --> kit
```

## Navigation (hash routes)

| Primary | Default / secondaries |
|---------|------------------------|
| Live | `#/live/overview` · climate · 4×8 · 2×4 · root · light · (mission/twin demoted) |
| Grow | `#/grow/roster` · compose · research |
| Tune | `#/tune/learning` · analytics |
| Fleet | `#/fleet` · `#/fleet/calibrate` |
| Settings | `#/settings/{hub,brain,device,api,network,server,general}` — `/fleet/settings` → device |

## Visual honesty (Pass B)

- Climate: **Air path** CFM only + honesty note — no Sankey / particle theater.
- Twin / Ops dash: honesty / gated (`TWIN_SURFACE_GATED`) — no blank WebGL.
- NPK / Rate / Dryback: value when finite; else omit or `· no channel` / `from EC`.

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Root still shows Probe 3/4 | Stale SPA bundle | Redeploy spa-dist; confirm `index-*.js` hash |
| NPK always `—` / 0 | Map used `n|p|k` or brain keys missing | Full keys + `/fleet/computed` merge (tip `07bf25f`) |
| Dryback/Rate no channel forever | Brain container lacks `sensor_trust` producers **or** no moisture history | Redeploy brain; wait for history |
| Compose offers pot 3/4 | Pre–Pass C picker | Kit filter via `KIT_PROBE_NUMBERS` |
| Pi SSH/HTTP timeout after restart | Tip `8b70d5f` redeploy gate | Recover host; then SPA + `sensor_trust` hot-patch |

## Verify

Skill checklist: [`.cursor/skills/dsc-spa-pi-verify/SKILL.md`](../../.cursor/skills/dsc-spa-pi-verify/SKILL.md). Screenshots: `docs/qa-screenshots-2026-08-29/`.

## Related

- Probe/plant assignment: [`PROBE-PLANT-MODEL.md`](PROBE-PLANT-MODEL.md)
- SoftCal: [`../ops/SOFT-CAL.md`](../ops/SOFT-CAL.md)
- Routes overview: [`WEBUI.md`](WEBUI.md)
