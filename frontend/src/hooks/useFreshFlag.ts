import { useEffect, useRef, useState } from "react";
import { getPreference } from "../lib/preferences";

/**
 * True for `ms` after `value` actually changes — never on the first render, never on an
 * unchanged tick. Drives the `.is-fresh` refresh pulse on live numerals (plan § Motion):
 * a value that just moved gets a brief lift; a value that is merely re-rendered does not.
 */
export function useFreshFlag(value: number | string | null | undefined, ms = 600): boolean {
  const prev = useRef<number | string | null | undefined>(value);
  const [fresh, setFresh] = useState(false);
  useEffect(() => {
    if (Object.is(prev.current, value)) return;
    const wasNumber = typeof prev.current === "number" && Number.isFinite(prev.current);
    prev.current = value;
    // A NaN → number transition is a first reading, not a refresh.
    if (!wasNumber && typeof value === "number") return;
    if (!getPreference("freshPulse")) return;
    setFresh(true);
    const t = window.setTimeout(() => setFresh(false), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return fresh;
}
