import { useEffect, useState } from "react";
import { useFleetLastUpdated } from "../hooks/useFleet";

function ageText(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}S`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}M`;
  return `${Math.round(m / 60)}H`;
}

/**
 * `UPDATED 34S` for a panel legend (plan § Motion, refresh pulse row). The age is the
 * fleet snapshot's wall-clock age — the same fact the top-bar tag shows — so a panel
 * never claims a fresher reading than the bus has. Ticks once a second; goes warn
 * past two minutes because that is when the hub mirror is normally stale.
 */
export function UpdatedStamp({ className = "" }: { className?: string }) {
  const at = useFleetLastUpdated();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!at) return null;
  const age = now - at;
  return (
    <span className={`dsc-updated-stamp${age > 120_000 ? " is-warn" : ""}${className ? ` ${className}` : ""}`} title="Age of the last fleet snapshot">
      UPDATED {ageText(age)}
    </span>
  );
}
