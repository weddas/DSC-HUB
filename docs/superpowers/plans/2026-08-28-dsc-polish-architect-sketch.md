# Architect sketch — DSC polish / spectacular-reliability pass

**As of:** 2026-08-28 · Goal: bugs + deferred + UX polish with design/UX first-class.

## Caller usage (write first)

```
Operator lands on /dsc/help/ → understands product honesty in <10s
  ? tip opens Want/Got/Need + colour semantics with examples
Operator lands on Overview (:8787) → Age/Beat chips are human durations
Retire plant → Compose draft empty (brain clear_build_helpers)
Maintainer regenerates dsc-help.json → id/group survive extract tool
```

## Module map

| Surface | Contract |
|---------|----------|
| `help_tip(summary, body_html)` | Native `<details>` `?` callout; no JS (PD / WordPress) |
| `HubLinkLine` | Ages via `fmtUptimeSeconds` only — never raw floats (**done** tip `39d7f88`) |
| `extract_onboarding_content.CONTENT` | Always emit `workflows[].group` + `measures[].id` (**done**) |
| SPA `HelpTip` | Shipped on HubLinkLine — [`docs/brain/HELP-TIP.md`](../../brain/HELP-TIP.md); Want/Got/Full Auto tips still **next** |

## Synthesis decision

Ship **inline `?` disclosures** (native details) over a modal help system — matches PD FAQ pattern, works without JS, stays scannable. Prefer **root-cause chip formatting** in HubLinkLine over audit-doc theater. Peer controllers (TrolMaster/AC Infinity) emphasize remote alerts + schedule graphs; DSC differentiator is **honesty rail + Want/Got/Need** — amplify that, don't ape touch-screen calendars.

## Out of scope this slice

Hardware F-001–F-008, z2m Phase 0, Pi iframe, inventing CannaLib chem.
