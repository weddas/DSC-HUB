/** Round HA float strings for chips (avoids 24.100000381469727). */
export function fmtReading(raw: string | number | undefined | null, digits = 1): string {
  if (raw == null || raw === "" || raw === "—" || raw === "unknown" || raw === "unavailable") {
    return "—";
  }
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[^\d.eE+-]/g, ""));
  if (!Number.isFinite(n)) return String(raw);
  return n.toFixed(digits);
}
