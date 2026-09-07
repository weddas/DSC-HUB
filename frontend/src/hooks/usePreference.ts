import { useCallback, useSyncExternalStore } from "react";
import {
  getPreferences,
  setPreference,
  subscribePreferences,
  type PreferenceKey,
  type Preferences,
} from "../lib/preferences";

/** The whole preference object; re-renders on any change. */
export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribePreferences, getPreferences, getPreferences);
}

/** One preference + a typed setter. */
export function usePreference<K extends PreferenceKey>(
  key: K,
): [Preferences[K], (next: Preferences[K]) => void] {
  const prefs = usePreferences();
  const set = useCallback((next: Preferences[K]) => setPreference(key, next), [key]);
  return [prefs[key], set];
}
