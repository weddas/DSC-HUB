/** Operator-readable text for `root_steering`'s `reason` enum.
 *
 * The raw enum used to be printed verbatim on the Root probe card, which produced a
 * self-contradicting line (observed live 2026-09-10): Probe 2 showed a measured dry-back of
 * 21.3 % at −6.06 %/h and, on the same line, "steering: dryback_unknown". The enum does not
 * mean "dry-back is unknown" — it means the steering PHASE cannot be classified, because
 * that needs a shot / wet-point reference the probe has no record of. The sensor dry-back
 * and the steering reference are two different measurements.
 *
 * Worse, the identical string appeared on the genuinely-dark Probe 1, so the one case where
 * nothing is known looked exactly like the case where a real dry-back is on screen.
 */
const STEERING_REASON_TEXT: Record<string, string> = {
  dryback_unknown: "phase unknown — no shot reference yet",
  probe_not_ok: "phase unknown — probe reading not trusted",
  manual_override: "manual override — steering is not choosing",
  lights_off: "lights off — no steering during the dark period",
  shallow_dryback: "shallow dry-back (P1)",
  vegetative_band: "vegetative dry-back band (P2)",
  generative_dryback: "generative dry-back (P3)",
};

/** Human text for a steering reason, or the raw value when it is one we do not know. */
export function steeringReasonText(reason: string | null | undefined): string | null {
  if (!reason) return null;
  // An unrecognised reason is shown as-is rather than hidden: a new enum value should look
  // odd on screen, not silently vanish.
  return STEERING_REASON_TEXT[reason] ?? reason.replace(/_/g, " ");
}
