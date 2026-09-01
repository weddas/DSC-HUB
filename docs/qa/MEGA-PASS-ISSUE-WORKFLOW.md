# Mega Pass — Issue lifecycle workflow

**Pass:** 2026-09 · **Register:** [`MEGA-PASS-2026-09-ISSUE-REGISTER.md`](MEGA-PASS-2026-09-ISSUE-REGISTER.md)

Every in-scope issue follows this workflow. The register is operational SoT; FOLLOWUPS is reconciled when a row reaches `closed`.

## States

| Status | Step | Meaning |
|--------|------|---------|
| `identified` | 1 | Repro documented; not yet designed |
| `fix_designed` | 2 | Root cause + file scope written |
| `applying` | 3 | Code change in progress |
| `unit_tested` | 4 | Targeted test green |
| `blast_radius` | 5 | Related tests + react-doctor on changed scope |
| `browser` | 6 | Pi SPA verify on affected route |
| `closed` | 7 | Evidence complete; FOLLOWUPS reconciled |
| `regressed` | — | Failed after close; links to `discovered_from` |
| `deferred` | — | Blocked (hardware, upstream, ops); owner + date |

P0/P1: no skipping steps 1–7. P2/P3: may note compressed blast-radius in Notes when single-file + existing test cover.

## Evidence columns (register)

| Column | Step |
|--------|------|
| Symptom | 1 |
| Files | 2–3 |
| Fix commit | 3 |
| Unit test | 4 |
| Blast radius | 5 |
| Browser evidence | 6 |
| Notes | 7 / defer reason |

## Regression intake

1. Failure during steps 4–6 → new `MP-xxx` row **or** parent → `regressed`.
2. Set `discovered_from: MP-xxx` on the new row.
3. Do not merge unrelated failures into one row.
4. After each WS batch: update register snapshot counts at top of register file.

## Three views

- **Being fixed:** status ∈ `{fix_designed, applying, unit_tested, blast_radius, browser}`
- **Fixed:** status = `closed` with evidence
- **Still open:** status ∈ `{identified, deferred}`
- **New after fix:** status = `regressed` or `discovered_from` set

## Pi verify checklist (step 6)

| Route | Surfaces |
|-------|----------|
| `#/grow/compose` | Plant wizard, presets, review |
| `#/grow/roster` | Table, delete, detach, assign |
| `#/fleet/calibrate` | SoftCal |
| `#/live/climate` | Airflow viz, Sankey |
| `#/live/twin` | R3F twin |
| `#/ops/dash` | Cannalib tiles |
| `#/fleet` | Overview |
| `#/settings` | Zigbee roles |

Hotpatch: `.audit/stress-spa-only-hotpatch.ps1` (Windows: plink/pscp per `dsc-pi-hotpatch.mdc`).
