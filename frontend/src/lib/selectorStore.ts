/**
 * Minimal useSyncExternalStore-based store so React context providers can publish
 * one value while consumers subscribe to just the slice they read (via `isEqual`),
 * instead of re-rendering on every publish regardless of what changed.
 */
import { useRef, useSyncExternalStore } from "react";

export interface Store<T> {
  getState: () => T;
  setState: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<() => void>();
  return {
    getState: () => state,
    setState(next) {
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Reads `selector(store.getState())`, only handing the component a new reference
 * (and thus triggering a re-render) when `isEqual` says the derived value actually changed.
 */
export function useStoreSelector<T, S>(
  store: Store<T>,
  selector: (state: T) => S,
  isEqual: (a: S, b: S) => boolean = Object.is,
): S {
  const cacheRef = useRef<{ has: boolean; value: S }>({ has: false, value: undefined as unknown as S });

  const getSnapshot = () => {
    const next = selector(store.getState());
    if (cacheRef.current.has && isEqual(cacheRef.current.value, next)) {
      return cacheRef.current.value;
    }
    cacheRef.current = { has: true, value: next };
    return next;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

/** Structural equality for JSON-shaped state (fleet snapshots, seat records, etc). Functions compare by reference. */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const aRec = a as Record<string, unknown>;
  const bRec = b as Record<string, unknown>;
  const aKeys = Object.keys(aRec);
  const bKeys = Object.keys(bRec);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bRec, key)) return false;
    if (!deepEqual(aRec[key], bRec[key])) return false;
  }
  return true;
}
