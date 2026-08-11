/** Compact duration for status chips (UP 10M / OFF 2M). */
export function fmtDurationMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${Math.max(1, sec)}S`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}M`;
  const hr = Math.floor(min / 60);
  const remM = min % 60;
  if (hr < 48) return remM > 0 ? `${hr}H ${remM}M` : `${hr}H`;
  const days = (hr / 24).toFixed(1);
  return `${days}D`;
}

export function fmtUptimeSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  return fmtDurationMs(seconds * 1000);
}

/** Offline duration from entity last_changed while unavailable. */
export function offlineDurationLabel(
  lastChanged: string | undefined,
  now = Date.now(),
): string {
  if (!lastChanged) return "—";
  const t = Date.parse(lastChanged);
  if (!Number.isFinite(t)) return "—";
  return fmtDurationMs(now - t);
}
