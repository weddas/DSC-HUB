import { useCallback, useEffect, useState } from "react";
import { getGlobalModifiers, patchGlobalModifiers, type GlobalModifiers, type GlobalModifiersPatch } from "../lib/fleetApi";
import type { SettingState } from "../components/settings/SettingRow";

type Snapshot = { modifiers: GlobalModifiers | null; state: "loading" | "ready" | "error"; error?: string };

let cache: Snapshot = { modifiers: null, state: "loading" };
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

async function load(): Promise<void> {
  if (inflight) return inflight;
  inflight = getGlobalModifiers()
    .then((m) => {
      cache = { modifiers: m, state: "ready" };
    })
    .catch((e: unknown) => {
      cache = { ...cache, state: "error", error: e instanceof Error ? e.message : String(e) };
    })
    .finally(() => {
      inflight = null;
      emit();
    });
  return inflight;
}

/**
 * Shared store for the brain's global modifiers (fan scale, light scale, dry line,
 * per-zone offsets). Several settings sections edit one slice each; a save patches only
 * that slice and every section sees the echo. Tier N: autosave with a per-row state.
 */
export function useGlobalModifiers(): Snapshot & {
  save: (patch: GlobalModifiersPatch) => Promise<GlobalModifiers>;
  refresh: () => Promise<void>;
} {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (cache.state === "loading" && !inflight) void load();
    return () => {
      listeners.delete(l);
    };
  }, []);
  const save = useCallback(async (patch: GlobalModifiersPatch) => {
    const saved = await patchGlobalModifiers(patch);
    cache = { modifiers: saved, state: "ready" };
    emit();
    return saved;
  }, []);
  return { ...cache, save, refresh: load };
}

/**
 * Per-row save state for autosaving tier-N rows: `pending` while the request is in
 * flight, `saved` for a moment after, `failed` with the brain's reason. Each row owns
 * its own state — never a shared busy flag (AGENTS.md house rule).
 */
export function useSaveState(): {
  state: SettingState;
  text?: string;
  run: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
} {
  const [state, setState] = useState<SettingState>(null);
  const [text, setText] = useState<string | undefined>(undefined);
  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setState("pending");
    setText(undefined);
    try {
      const out = await fn();
      setState("saved");
      window.setTimeout(() => setState((s) => (s === "saved" ? null : s)), 1800);
      return out;
    } catch (e) {
      setState("failed");
      setText(e instanceof Error ? e.message : String(e));
      return undefined;
    }
  }, []);
  return { state, text, run };
}
