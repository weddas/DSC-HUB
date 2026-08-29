# 002 — Clarify useHistory loading reset (cancelled vs finally)

- **Status**: TODO
- **Commit**: `05e8471`
- **Severity**: MEDIUM
- **Category**: Bugs & correctness
- **Rule**: `react-doctor/no-loading-flag-reset-outside-finally`
- **Estimated scope**: 1 file (`src/hooks/useHistory.ts`), small

## Problem

React Doctor flags `useHistory.ts:77` and `:136` (`setLoading(false)`). Message claims success-only reset. Current code already uses `try` / `catch` / `finally`, but resets only when `!cancelled`:

```62:78:homeassistant/custom_components/dsc_hub/frontend/src/hooks/useHistory.ts
    async function loadPi() {
      setLoading(true);
      setError(null);
      try {
        const rows = await get_entity_history(entityId, hours);
        if (cancelled) return;
        ...
      } catch (e) {
        if (!cancelled) {
          setError(...);
          setPoints([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
```

Same pattern in `loadHa` (~136). Early exits at ~82–90 call `setLoading(false)` before any `setLoading(true)` for empty/`!connReady` — those are fine and must stay.

Risk: detector treats conditional-in-finally as non-finally; also if a future edit moves the reset out of `finally`, history drawers can stick on "loading".

## Target

Canonical recipe: *Reset the loading flag in `finally` so success and failure both clear it.*

Keep abort safety without teaching the linter that the reset is success-only. Prefer:

```ts
    async function loadPi() {
      setLoading(true);
      setError(null);
      try {
        const rows = await get_entity_history(entityId, hours);
        if (cancelled) return;
        const series = rows.filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
        series.sort((a, b) => a.t - b.t);
        setPoints(downsample(series, maxPoints));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "history unavailable");
        setPoints([]);
      } finally {
        setLoading(false);
      }
    }
```

Mirror for `loadHa`. If React Strict Mode / unmount warnings appear in soak, gate with a mounted ref pattern used elsewhere in the SPA — do not move `setLoading(false)` out of `finally`.

## Repo conventions to follow

- Match existing `cancelled` cleanup in the same effect return.
- Exemplar: other async loaders in frontend hooks that use `try/finally` (search `setLoading(false)` under `src/hooks/`).

## Steps

1. In `loadPi` and `loadHa`, make `finally { setLoading(false); }` unconditional.
2. Keep `if (cancelled) return` before `setPoints` / `setError` in try/catch.
3. Leave early `!entityId` / `!connReady` paths unchanged.
4. No API signature changes.

## Boundaries

- Do NOT change history downsampling, hours, or Pi vs HA source selection.
- Do NOT “fix” by eslint-disable.
- STOP if `useHistory.ts` no longer matches this structure at `05e8471`.

## Verification

- **Mechanical**: `react-doctor --scope changed` clears `no-loading-flag-reset-outside-finally` on `useHistory.ts`.
- **Behavior check**: Open Root seat history and Analytics; force a bad `entityId` or offline blip — loading spinner/flag must clear (not stick). Rapidly switching plants must not leave a permanent loading state.
- **Done when**: diagnostic clear; history still loads for a known good probe moisture entity on Pi.
