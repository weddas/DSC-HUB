/**
 * The one shape every derived value takes.
 *
 * A derived value is a number the kit does NOT measure — it is computed from the
 * relationship between sensors that do exist. Two states, never a third:
 *
 *  - resolved   `value` is a finite number and `provenance` names the inputs that made it.
 *  - unavailable `value` is null and `unavailable` says which input is missing.
 *
 * A missing input NEVER yields a number. There is no default, no last-known, no zero.
 * `possibleWith` names the sensor that would upgrade the value from absent (or from
 * assumed) to measured, so the operator can see what the kit is missing rather than
 * being shown a plausible-looking guess.
 */
export interface DerivedValue {
  /** Stable key for React lists and for the brain-side counterpart (`derived_metrics.py`). */
  key: string;
  /** Short display label, e.g. `Dew point`. */
  label: string;
  /** Display unit, e.g. `kPa`, `°C`, `g/m³`. Empty for a bare fraction. */
  unit: string;
  /** The number, or null when an input is missing. */
  value: number | null;
  /** Which inputs produced the number, e.g. `from T + RH`. Empty string when unavailable. */
  provenance: string;
  /** A modelling assumption the number rests on. Shown next to the value, never hidden. */
  assumption?: string;
  /** Why there is no number. Set if and only if `value === null`. */
  unavailable?: string;
  /** The sensor that would make this measured (or drop the assumption). */
  possibleWith?: string;
  /** Decimals to print. */
  precision: number;
}

/** Build a resolved derived value. Returns the unavailable form if `value` is not finite. */
export function resolvedValue(spec: {
  key: string;
  label: string;
  unit: string;
  value: number;
  provenance: string;
  precision?: number;
  assumption?: string;
  possibleWith?: string;
}): DerivedValue {
  if (!Number.isFinite(spec.value)) {
    return unavailableValue({
      key: spec.key,
      label: spec.label,
      unit: spec.unit,
      reason: "inputs did not produce a finite number",
      precision: spec.precision,
      possibleWith: spec.possibleWith,
    });
  }
  return {
    key: spec.key,
    label: spec.label,
    unit: spec.unit,
    value: spec.value,
    provenance: spec.provenance,
    precision: spec.precision ?? 2,
    ...(spec.assumption ? { assumption: spec.assumption } : {}),
    ...(spec.possibleWith ? { possibleWith: spec.possibleWith } : {}),
  };
}

/** Build the honest unavailable form: no number, and a reason that names the missing input. */
export function unavailableValue(spec: {
  key: string;
  label: string;
  unit: string;
  reason: string;
  precision?: number;
  possibleWith?: string;
}): DerivedValue {
  return {
    key: spec.key,
    label: spec.label,
    unit: spec.unit,
    value: null,
    provenance: "",
    unavailable: spec.reason,
    precision: spec.precision ?? 2,
    ...(spec.possibleWith ? { possibleWith: spec.possibleWith } : {}),
  };
}

/** Narrowing guard — the only way a consumer should reach `.value` as a number. */
export function isResolved(d: DerivedValue): d is DerivedValue & { value: number } {
  return d.value != null && Number.isFinite(d.value);
}

/** `1.24` when resolved, an em dash when not. Never prints a fallback number. */
export function fmtDerived(d: DerivedValue): string {
  return isResolved(d) ? d.value.toFixed(d.precision) : "—";
}

/** `1.24 kPa` / `—`. */
export function fmtDerivedWithUnit(d: DerivedValue): string {
  const n = fmtDerived(d);
  return d.unit ? `${n} ${d.unit}` : n;
}

/**
 * The one-line note that rides under the number: the provenance when resolved
 * (with the assumption appended), the reason plus the missing sensor when not.
 */
export function derivedNote(d: DerivedValue): string {
  if (isResolved(d)) {
    return d.assumption ? `${d.provenance} · ${d.assumption}` : d.provenance;
  }
  const why = d.unavailable ?? "unavailable";
  return d.possibleWith ? `unavailable — ${why} · possible with ${d.possibleWith}` : `unavailable — ${why}`;
}

/** The long form for a `title=` / tooltip: what it is, how it was made, what would improve it. */
export function derivedTitle(d: DerivedValue): string {
  const bits: string[] = [];
  if (isResolved(d)) {
    bits.push(`${d.label} ${fmtDerivedWithUnit(d)} — derived, not measured.`);
    bits.push(`Provenance: ${d.provenance}.`);
    if (d.assumption) bits.push(`Assumption: ${d.assumption}.`);
    if (d.possibleWith) bits.push(`Measured directly with ${d.possibleWith}.`);
  } else {
    bits.push(`${d.label} unavailable — ${d.unavailable ?? "an input is missing"}.`);
    bits.push("No number is shown rather than a guess.");
    if (d.possibleWith) bits.push(`Possible with ${d.possibleWith}.`);
  }
  return bits.join(" ");
}

/** Screen-reader sentence for a slot or a derived readout. */
export function derivedAria(d: DerivedValue): string {
  return isResolved(d)
    ? `${d.label} ${fmtDerivedWithUnit(d)}, derived ${d.provenance}`
    : `${d.label} unavailable, ${d.unavailable ?? "an input is missing"}${d.possibleWith ? `, possible with ${d.possibleWith}` : ""}`;
}
