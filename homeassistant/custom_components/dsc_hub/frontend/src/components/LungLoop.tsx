import { CfmProvenanceBadge } from "./CfmBadge";
import { StatusChip } from "./ui";
import type { CfmReading } from "../lib/cfmProvenance";

function dashFor(reading: CfmReading): string | undefined {
  return reading.kind === "allocated" || reading.kind === "mass-balance" ? undefined : "6 5";
}

function fmt(n: number): string {
  return Number.isFinite(n) ? String(Math.round(n)) : "—";
}

/**
 * Cascade 2×4 → 4×8 from Twin mkAir legs: allocated = solid, nameplate = dashed.
 * Not a second isometric tent.
 */
export function LungLoop({
  intakeClone,
  intakeMain,
  outCfm,
  recircCfm,
}: {
  intakeClone: CfmReading;
  intakeMain: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
}) {
  const cascadeVal =
    (Number.isFinite(intakeClone.value) ? intakeClone.value : 0) +
    (Number.isFinite(intakeMain.value) ? intakeMain.value : 0);
  return (
    <div className="dsc-lung-loop">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <CfmProvenanceBadge reading={outCfm} />
        <CfmProvenanceBadge reading={recircCfm} />
        <CfmProvenanceBadge reading={intakeClone} />
        <CfmProvenanceBadge reading={intakeMain} />
        <span className="dsc-muted" style={{ fontSize: 12 }}>
          Cascade 2×4→4×8 · solid = allocated, dashed = nameplate
        </span>
      </div>
      <svg viewBox="0 0 640 180" className="dsc-lung-svg" aria-label="Lung loop">
        <rect x="8" y="48" width="90" height="84" rx="10" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.6" />
        <text x="53" y="92" textAnchor="middle" fill="currentColor" fontSize="11">
          Room
        </text>
        <rect
          x="130"
          y="18"
          width="140"
          height="64"
          rx="8"
          fill="none"
          stroke="var(--dsc-teal)"
          strokeWidth="1.8"
          strokeDasharray={dashFor(intakeClone)}
        />
        <text x="200" y="48" textAnchor="middle" fill="currentColor" fontSize="11">
          2×4
        </text>
        <text x="200" y="66" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          {fmt(intakeClone.value)} cfm in
        </text>
        <rect
          x="130"
          y="100"
          width="140"
          height="64"
          rx="8"
          fill="none"
          stroke="var(--dsc-blue)"
          strokeWidth="1.8"
          strokeDasharray={dashFor(intakeMain)}
        />
        <text x="200" y="130" textAnchor="middle" fill="currentColor" fontSize="11">
          4×8
        </text>
        <text x="200" y="148" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          {fmt(intakeMain.value)} cfm in
        </text>
        <path
          d="M270 50 L330 50 L330 132 L270 132"
          fill="none"
          stroke="var(--dsc-amber)"
          strokeWidth="2"
          strokeDasharray={dashFor(intakeClone)}
        />
        <text x="352" y="96" fill="var(--dsc-amber)" fontSize="10">
          cascade {fmt(cascadeVal)}
        </text>
        <rect
          x="430"
          y="18"
          width="120"
          height="64"
          rx="8"
          fill="none"
          stroke="#ff8a65"
          strokeWidth="1.8"
          strokeDasharray={dashFor(outCfm)}
        />
        <text x="490" y="48" textAnchor="middle" fill="currentColor" fontSize="11">
          DUMP
        </text>
        <text x="490" y="66" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          {fmt(outCfm.value)} cfm
        </text>
        <rect
          x="430"
          y="100"
          width="120"
          height="64"
          rx="8"
          fill="none"
          stroke="#b388ff"
          strokeWidth="1.8"
          strokeDasharray={dashFor(recircCfm)}
        />
        <text x="490" y="130" textAnchor="middle" fill="currentColor" fontSize="11">
          RECIRC
        </text>
        <text x="490" y="148" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          {fmt(recircCfm.value)} cfm
        </text>
        <path d="M98 90 L130 50" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.5" strokeDasharray={dashFor(intakeClone)} />
        <path d="M98 90 L130 132" fill="none" stroke="var(--dsc-blue)" strokeWidth="1.5" strokeDasharray={dashFor(intakeMain)} />
        <path d="M270 132 L430 132" fill="none" stroke="#b388ff" strokeWidth="1.5" strokeDasharray={dashFor(recircCfm)} />
        <path d="M270 50 L430 50" fill="none" stroke="#ff8a65" strokeWidth="1.5" strokeDasharray={dashFor(outCfm)} />
      </svg>
      <StatusChip label="Mass-balance exhaust = Σ intake × dump/recirc split" tone="muted" />
    </div>
  );
}
