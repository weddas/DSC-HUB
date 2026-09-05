import type { TentId } from "../lib/seatModel";
import { tentLabel } from "../lib/seatModel";

const ITEMS = [
  "Update pot tent assignment (Twin / Roster seat)",
  "Confirm photoperiod matches stage (18h veg · 12h flower)",
  "Review Climate Want for destination tent",
  "Check light desk — independent 2×4 vs follow 4×8",
  "Verify probe trust and moisture bands after move",
] as const;

/** Operator checklist when moving plants between tents (P-01). */
export function RehomeChecklist({
  from,
  to,
}: {
  from: TentId;
  to: TentId;
}) {
  if (from === to || to === "unassigned") return null;
  return (
    <div className="dsc-rehome-checklist">
      <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
        Moving from <strong>{tentLabel(from)}</strong> → <strong>{tentLabel(to)}</strong> — confirm:
      </p>
      <ul className="dsc-checklist">
        {ITEMS.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
