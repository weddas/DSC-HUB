/** What a running light catch-up is going to do next, in the operator's terms.
 *
 * Catch-up repays light DEBT by running the lamp past the nominal window. Two things about
 * it were invisible on the desk (operator, 2026-09-10):
 *
 * 1. **Releasing a manual hold during catch-up turns the lamp ON.** The firmware self-heals
 *    the hold only when `photo_was_want_on && !want_on`; during catch-up `want_on` is TRUE,
 *    so clearing the hold does not leave the lamp where it is — it drives the SF1000 to
 *    target and keeps it there. The hold card said only that the hold "freezes" the lamp,
 *    which is true while held and misleading about letting go.
 * 2. **When it ends.** The clock chip counts the NOMINAL window, so during catch-up it
 *    reads OFF IN even though the lamp will keep running past that.
 *
 * Everything here is projection from values the hub already publishes. It is arithmetic on
 * a debt and a floor, not a promise: the hub owns the decision and re-evaluates every tick,
 * so the wording stays "expected", and a projection we cannot make honestly returns null
 * rather than a confident guess.
 */

export type CatchupProjection = {
  /** Hours of light still owed for this cycle. */
  debtH: number;
  /** Hours of darkness left before the next scheduled lights-on. */
  darkRemainingH: number | null;
  /** The minimum dark the hub will not encroach on. */
  minDarkH: number | null;
  /**
   * Why catch-up will stop: it repays the debt in full, or it runs out of room above the
   * dark floor and stops short. Null when we cannot tell.
   */
  endsBecause: "debt-repaid" | "dark-floor" | null;
  /** Hours catch-up is expected to run from now. Null when unknowable. */
  runsForH: number | null;
  /** Epoch ms the lamp is expected to go dark. Null when unknowable. */
  endsAtMs: number | null;
  /** True when the floor cuts it short — some debt will carry into the next cycle. */
  cutShort: boolean;
  /** Debt that will still be owed when it stops, when cut short. */
  carriesH: number;
};

function finite(n: number | null | undefined): number | null {
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

export function projectCatchup(input: {
  /** sensor.dsc_*_light_debt_hours */
  debtH: number | null | undefined;
  /** Hours until the next scheduled lights-on. */
  darkRemainingH: number | null | undefined;
  /** number.dsc_hub_photo_min_dark_hours */
  minDarkH: number | null | undefined;
  nowMs?: number;
}): CatchupProjection | null {
  const debt = finite(input.debtH);
  if (debt == null || debt <= 0) return null;

  const dark = finite(input.darkRemainingH);
  const floor = finite(input.minDarkH);
  const now = input.nowMs ?? Date.now();

  // Room to run = the dark left before the next lights-on, minus the floor the hub will
  // not eat into. Without both numbers we know the debt but not the deadline.
  const room = dark != null && floor != null ? dark - floor : null;
  if (room == null) {
    return {
      debtH: debt,
      darkRemainingH: dark,
      minDarkH: floor,
      endsBecause: null,
      runsForH: null,
      endsAtMs: null,
      cutShort: false,
      carriesH: 0,
    };
  }

  const cutShort = room < debt;
  const runsFor = Math.max(0, Math.min(debt, room));
  return {
    debtH: debt,
    darkRemainingH: dark,
    minDarkH: floor,
    endsBecause: cutShort ? "dark-floor" : "debt-repaid",
    runsForH: runsFor,
    endsAtMs: now + runsFor * 3600_000,
    cutShort,
    carriesH: cutShort ? debt - room : 0,
  };
}

/** "2 h 20 m" — durations in hours, said the way a grower reads a clock. */
export function fmtHours(h: number): string {
  if (!Number.isFinite(h) || h < 0) return "—";
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (whole === 0) return `${mins} m`;
  if (mins === 0) return `${whole} h`;
  return `${whole} h ${mins} m`;
}

/** The sentence shown when a manual hold is on while catch-up wants the lamp. */
export function holdReleaseWarning(p: CatchupProjection | null): string | null {
  if (!p) return null;
  const owed = fmtHours(p.debtH);
  if (p.runsForH == null) {
    return (
      `Releasing the hold will turn the lamp ON — catch-up is still owed ${owed} and will ` +
      `drive the fixture to its target brightness until the debt is repaid or the minimum ` +
      `dark period is reached.`
    );
  }
  const until = p.cutShort
    ? `for about ${fmtHours(p.runsForH)}, stopping at the minimum dark floor with ${fmtHours(p.carriesH)} still owed`
    : `for about ${fmtHours(p.runsForH)}, until the ${owed} is repaid`;
  return `Releasing the hold will turn the lamp ON — catch-up will run it ${until}.`;
}
