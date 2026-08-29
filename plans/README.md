# improve-react plans (DSC-HUB frontend)

Commit stamp when opened: `05e8471`. Source scan: `react-doctor-report.json` (read-only recon).

| Plan | Status | Depends on | Notes |
|------|--------|------------|-------|
| [001-multilinechart-stabilize-pad.md](001-multilinechart-stabilize-pad.md) | DONE (2026-08-29) | — | Hot chart path; do first |
| [002-usehistory-loading-finally.md](002-usehistory-loading-finally.md) | DONE (2026-08-29) | — | Independent |

## Intentionally not planned (settled / noise)

| Finding | Why skipped |
|---------|-------------|
| `useHass.tsx` / `useHeldReading.ts` `no-ref-current-in-render` | Documented intentional; FOLLOWUPS marks restore-during-render as done |
| `CatalogResearch.tsx` navigate-in-render | False positive — navigate is in event handler |
| Airflow `r3f-no-advancing-clock-in-use-frame` | Product decision: gate/remove Three.js under UI redesign, not a micro-fix |

## Execution

```text
improve-react execute 001-multilinechart-stabilize-pad
improve-react execute 002-usehistory-loading-finally
```

Or any agent implementing the plan files in an isolated worktree.
