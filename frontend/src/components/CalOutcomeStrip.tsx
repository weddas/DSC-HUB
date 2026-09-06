/** Shared What / Process / Expected strip for calibration wizards. */
export function CalOutcomeStrip({
  what,
  process,
  expected,
}: {
  what: string;
  process: string;
  expected: string;
}) {
  return (
    <div className="dsc-cal-outcome" style={{ fontSize: "var(--dsc-fs-sm)", marginBottom: 10 }}>
      <p style={{ margin: "0 0 4px" }}>
        <strong>What:</strong> {what}
      </p>
      <p style={{ margin: "0 0 4px" }}>
        <strong>Process:</strong> {process}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Expected:</strong> {expected}
      </p>
    </div>
  );
}
