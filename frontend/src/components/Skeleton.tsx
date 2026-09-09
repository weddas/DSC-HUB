/** Placeholder shown while a page's main content is waiting on its first data.
 *
 * Kit, Plants and Logs painted their header instantly and then left the content region
 * empty for about a second (observed live 2026-09-10), so the page read as
 * complete-but-empty — indistinguishable from "there is nothing here", which on an
 * honesty-first dashboard is a real claim rather than a cosmetic gap.
 *
 * This is deliberately NOT an empty state: it says "waiting", where the empty states say
 * "nothing to show". Those two must never look alike.
 */
export function Skeleton({
  rows = 3,
  label = "Loading…",
}: {
  /** How many placeholder bars to draw. */
  rows?: number;
  /** Announced to screen readers; the bars themselves are decorative. */
  label?: string;
}) {
  return (
    <div className="dsc-skeleton" role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="dsc-skeleton-bar" aria-hidden="true" />
      ))}
    </div>
  );
}
