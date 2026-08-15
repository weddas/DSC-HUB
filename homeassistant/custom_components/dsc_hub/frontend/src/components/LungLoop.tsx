import { StatusChip } from "./ui";
import { cfmKindLabel, type CfmKind } from "../lib/cfmProvenance";

/**
 * 2D lung loop: room → 2×4 → cascade → 4×8 → dump/recirc.
 * Allocated = solid, nameplate = dashed. Extracted from Twin mkAir mass-balance math, not a second isometric tent.
 */
export function LungLoop({
  intakeClone,
  intakeMain,
  outCfm,
  recircCfm,
  kind,
}: {
  intakeClone: number;
  intakeMain: number;
  outCfm: number;
  recircCfm: number;
  kind: CfmKind;
}) {
  const dash = kind === "nameplate" ? "6 5" : undefined;
  const fmt = (n: number) => (Number.isFinite(n) ? Math.round(n) : "—");
  return (
    <div className="dsc-lung-loop">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <StatusChip label={cfmKindLabel(kind)} tone={kind === "nameplate" ? "warn" : "ok"} />
        <span className="dsc-muted" style={{ fontSize: 12 }}>
          Cascade 2×4→4×8 · mass-balance exhaust = Σ intake × split
        </span>
      </div>
      <svg viewBox="0 0 640 180" className="dsc-lung-svg" aria-label="Lung loop">
        <rect x="8" y="48" width="90" height="84" rx="10" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.6" strokeDasharray={dash} />
        <text x="53" y="92" textAnchor="middle" fill="currentColor" fontSize="11">Room</text>
        <rect x="130" y="18" width="140" height="64" rx="8" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.8" strokeDasharray={dash} />
        <text x="200" y="48" textAnchor="middle" fill="currentColor" fontSize="11">2×4</text>
        <text x="200" y="66" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">{fmt(intakeClone)} cfm in</text>
        <rect x="130" y="100" width="140" height="64" rx="8" fill="none" stroke="var(--dsc-blue)" strokeWidth="1.8" strokeDasharray={dash} />
        <text x="200" y="130" textAnchor="middle" fill="currentColor" fontSize="11">4×8</text>
        <text x="200" y="148" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">{fmt(intakeMain)} cfm in</text>
        <path d="M270 50 L330 50 L330 132 L270 132" fill="none" stroke="var(--dsc-amber)" strokeWidth="2" strokeDasharray={dash} markerEnd="url(#lung-arr)" />
        <text x="352" y="96" fill="var(--dsc-amber)" fontSize="10">cascade</text>
        <rect x="430" y="18" width="120" height="64" rx="8" fill="none" stroke="#ff8a65" strokeWidth="1.8" strokeDasharray={dash} />
        <text x="490" y="48" textAnchor="middle" fill="currentColor" fontSize="11">DUMP</text>
        <text x="490" y="66" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">{fmt(outCfm)} cfm</text>
        <rect x="430" y="100" width="120" height="64" rx="8" fill="none" stroke="#b388ff" strokeWidth="1.8" strokeDasharray={dash} />
        <text x="490" y="130" textAnchor="middle" fill="currentColor" fontSize="11">RECIRC</text>
        <text x="490" y="148" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">{fmt(recircCfm)} cfm</text>
        <path d="M98 90 L130 50" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.5" strokeDasharray={dash} />
        <path d="M98 90 L130 132" fill="none" stroke="var(--dsc-blue)" strokeWidth="1.5" strokeDasharray={dash} />
        <path d="M270 132 L430 132" fill="none" stroke="#b388ff" strokeWidth="1.5" strokeDasharray={dash} />
        <path d="M270 50 L430 50" fill="none" stroke="#ff8a65" strokeWidth="1.5" strokeDasharray={dash} />
      </svg>
    </div>
  );
}
