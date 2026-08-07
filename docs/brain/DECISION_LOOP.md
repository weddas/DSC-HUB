# Brain decision loop

**In one line:** Ingest hub/pot state + catalogs → resolve Want → compute Need vs Got → propose setpoints/cmds → hub clamps and actuates.

Notion: [Pi offline brain](https://app.notion.com/p/3b52b4cda370818e8b66f671689f7a57) · [Ownership](https://app.notion.com/p/3b52b4cda370818da235e4569b1cc9c6)

```mermaid
flowchart LR
  tele[Hub and pot telemetry] --> loop[decision_tick]
  packs[Catalog packs] --> loop
  roster[Active plant seat] --> loop
  loop --> want[Want bands]
  loop --> need[Need gaps]
  loop --> proposal[Proposal JSON]
  proposal --> hub[Hub API / bridge]
  hub -->|clamp refuse| telemetry_next[Next tick]
```

## Tick inputs

- Active roster seat (strain id, stage, custom overrides)
- Catalog want_bands for that strain (or custom / stage default)
- Latest Got: temp, RH, VPD, soil EC/pH/moisture, light state
- Hub mode flags (Full Auto, Manual Takeover, in-service gates)

## Tick outputs (proposal)

```json
{
  "tick_id": "...",
  "seat": "pot1",
  "want": {"temp_c": [20, 28], "rh_pct": [45, 70]},
  "got": {"temp_c": 26.1, "rh_pct": 58},
  "need": {"temp_c": "ok", "rh_pct": "ok"},
  "commands": [],
  "advisories": [],
  "safety": {"hub_must_clamp": true}
}
```

## Never

- Bypass hub failsafe / min-off / fire countdown
- Drive Sonoff relays through HA as the *product* path (lab OK until F-010)
- Emit commands when Manual Takeover is asserted (unless user-approved advanced override)

## Implementation

Python: [`brain/dsc_brain/decision_loop.py`](../../brain/dsc_brain/decision_loop.py)  
Dry-run by default (`emit=False`); live emit is Phase D.
