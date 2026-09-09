# Parallel-agent plan — remaining DSC-HUB large items (2026-09-09)

## Model
- **This session = orchestrator.** Spawns worktree-isolated agents, reviews their branches, merges to `master` in the order below, runs the suite once on the merged tree, then does **one** Pi deploy + live verify.
- **Parallel authoring, serial integration + deploy.** The Pi is one physical device: no agent deploys, SSHes, or recreates the brain. That stays with the orchestrator, one at a time. (This is what caused tonight's route-drop / dark-tent outages when it wasn't serialized.)
- **Isolation:** each agent runs in its own git worktree (`isolation: "worktree"`) so the shared checkout is never corrupted (`never git add -A` still holds inside each worktree — stage explicit paths).
- **Additive edits to hot files.** Where two agents must both touch `api.py` / `settings.py`, they append new functions/routes at the end rather than editing shared blocks; orchestrator resolves at merge.

## Agents, owned paths, forbidden files

### Agent A — 3D twin reboot   → branch `feat/twin-reboot`
- OWNS: `frontend/src/twin/**`, `frontend/src/components/Twin*.tsx`, `frontend/src/pages/Twin*.tsx`, `frontend/src/hooks/useTwinState.ts`, **`frontend/src/lib/twinState.ts`** (sole owner), `frontend/public/models/**`, the `twin-three` chunk rule in `vite.config.ts`.
- MUST NOT touch: `useZones.ts`, `ZoneCard.tsx`, any brain file, `api.py`.
- Note: needs operator-authored GLB models; agent does the R3F/bindings scaffold + honest node bindings, leaves model files as documented placeholders.

### Agent B — Derived-metrics layer   → branch `feat/derived-metrics`
- OWNS: `frontend/src/lib/derived/**`, `frontend/src/hooks/useHistory.ts`, and the consuming widgets `VpdHero.tsx`, `EquipmentTiles.tsx`, `ZoneCard.tsx`, `hooks/useZones.ts`; brain: a NEW module `brain/dsc_brain/derived_metrics.py` (do not edit existing calc files in place — add a module and call it).
- MUST NOT touch: `twinState.ts` (Agent A owns it), `settings.py`, `hub_tunables.py`.
- Conflict note: `ZoneCard.tsx`/`useZones.ts` are shared conceptually with settings but not edited there — safe.

### Agent C — Settings restructure + ~40 hub tunables   → branch `feat/settings-tunables`
- OWNS: `frontend/src/pages/settings/**`, `frontend/src/components/settings/**`, `frontend/src/routes.ts`, `frontend/src/lib/settingsIndex.ts`; brain: `brain/dsc_brain/hub_tunables.py`, `brain/dsc_brain/hub_controls.py`.
- APPENDS ONLY (no in-place edits) to: `brain/dsc_brain/api.py` (new settings routes at end), `brain/dsc_brain/settings.py` (new keys in the defaults dict only).
- MUST NOT touch: twin/*, lib/derived/*, `useBrain.tsx`.
- Follows the existing `docs/design/plan-settings-2026-09-07.md`.

### Agent D — Entity-id codegen (LAST, alone)   → branch `chore/entity-id-codegen`
- Generates the TS maps (`entityFleetMap.ts`, `fleetControlMap.ts`, `fleetFromHass.ts`, `kitInventory.ts`) from the Python entity tables at build time, so a rename fails the build instead of silently on the Pi.
- Touches ~everything (all brain literal-id tables + the 4 TS files) → **rebase onto merged master and run solo after A/B/C land.** Never in parallel with the others.

## Merge order (least-conflict first)
1. **A (twin)** — self-contained subsystem, near-zero shared surface.
2. **B (derived)** — new brain module + isolated lib; only shared UI files.
3. **C (settings+tunables)** — largest brain surface; merge after A/B so its api.py/settings.py appends rebase cleanly.
4. Run full suite + `tsc` + SPA build on merged `master`.
5. **One** Pi deploy + live verify (orchestrator).
6. **D (codegen)** — rebase on the deployed master, run solo, merge, re-verify.

## Honest caveats
- These are **feature** efforts (each ~a day of real work), not the quick bug-fixes we've been landing. Agents produce reviewable drafts; nothing reaches the live grow without orchestrator review + the single serial deploy.
- No agent can verify against the Pi — live behaviour is confirmed only by the orchestrator.
- Cost: 3 concurrent cold agents + a 4th after. Worth it only if you want these big items pushed now; a single small bug would not justify it.
- Recommended first wave if you want to start smaller: **B (derived) + D-scoped codegen are the most self-contained and highest signal-to-noise**; A and C are the biggest and benefit most from a dedicated review pass.
