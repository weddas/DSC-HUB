import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { Icon } from "./ui";

const ZONES: { id: ZoneFocus; label: string; hint: string }[] = [
  { id: "room", label: "Room", hint: "The umbrella lung — intake, exhaust, room T/RH" },
  { id: "main", label: "4×8", hint: "Flower tent" },
  { id: "clone", label: "2×4", hint: "Clone & veg tent" },
  { id: "compare", label: "All", hint: "Every zone side by side" },
];

/**
 * Zone context strip — sits under the desk nav on desks that own `?zone=`
 * (Climate, Root, Light). Zone is context, never a tab: the desk stays, the zone changes.
 */
export function ZoneStrip({
  only,
  label = "ZONE",
}: {
  /** Restrict to a subset (the tent cockpit has no room/all view). */
  only?: ZoneFocus[];
  label?: string;
}) {
  const { focus, setFocus } = useZoneFocus();
  const zones = only ? ZONES.filter((z) => only.includes(z.id)) : ZONES;
  return (
    <div className="dsc-zone-strip" role="group" aria-label="Zone">
      <span className="dsc-zone-strip-label">{label}</span>
      {zones.map((z) => (
        <button
          key={z.id}
          type="button"
          className={`dsc-zone-chip dsc-zone-chip--${z.id}${focus === z.id ? " is-active" : ""}`}
          aria-pressed={focus === z.id}
          aria-label={`${z.label} — ${z.hint}`}
          title={z.hint}
          onClick={() => setFocus(z.id)}
        >
          {z.id === "compare" ? <Icon name="compare" size={11} className="dsc-zone-strip-icon" /> : null}
          {z.label}
        </button>
      ))}
    </div>
  );
}
