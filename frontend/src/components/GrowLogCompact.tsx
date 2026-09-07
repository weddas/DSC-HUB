import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_grow_log } from "../lib/fleetApi";
import { growLogSeverity, prepareGrowLog, type DisplayGrowLogEvent } from "../lib/growLogFilter";
import { growLogPlaybook } from "../lib/growLogPlaybook";
import { paths } from "../lib/paths";

type Glyph = { char: string; tone: "ok" | "warn" | "muted" };

/** ▲ alert · ▶ something switched on · ■ something switched off / settled · · note. */
export function growLogGlyph(message: string): Glyph {
  if (growLogSeverity(message) === "alert") return { char: "▲", tone: "warn" };
  const m = message.trim();
  if (/^▶|\bon$|\bon\b.*demand|demand on|\bstart/i.test(m)) return { char: "▶", tone: "ok" };
  if (/^■|\boff$|demand off|back in band|cleared|resolved/i.test(m)) return { char: "■", tone: "ok" };
  if (/\bstage\b/i.test(m)) return { char: "■", tone: "muted" };
  return { char: "·", tone: "muted" };
}

function shortTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useRecentGrowLog(hours = 24, limit = 60): { events: DisplayGrowLogEvent[]; loading: boolean } {
  const [events, setEvents] = useState<DisplayGrowLogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void get_grow_log(hours, limit).then((rows) => {
        if (cancelled) return;
        setEvents(prepareGrowLog(rows));
        setLoading(false);
      });
    };
    load();
    const timer = window.setInterval(load, 45_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [hours, limit]);
  return { events, loading };
}

/** time · glyph · text rows, newest first. Events only — journals live on Logs. */
export function GrowLogCompact({ events, loading, rows = 6 }: { events: DisplayGrowLogEvent[]; loading: boolean; rows?: number }) {
  const shown = events.slice(0, rows);
  return (
    <div className="dsc-log-compact">
      {loading && !shown.length ? <p className="dsc-panel-foot">Loading…</p> : null}
      {!loading && !shown.length ? <p className="dsc-panel-foot">No events in the last 24 h.</p> : null}
      {shown.length ? (
        <div className="dsc-log-grid">
          {shown.map((ev) => {
            const g = growLogGlyph(ev.message);
            const link = growLogPlaybook(ev.message);
            const text = (
              <>
                {ev.message.replace(/^[▶■▲◆●○•]\s*/, "")}
                {ev.repeatCount != null && ev.repeatCount > 1 ? (
                  <span className="dsc-log-repeat">×{ev.repeatCount}</span>
                ) : null}
              </>
            );
            return (
              <div key={ev.id} className="dsc-log-row">
                <span className="dsc-log-time">{shortTime(ev.ts)}</span>
                <span className={`dsc-log-glyph dsc-log-glyph--${g.tone}`} aria-hidden="true">
                  {g.char}
                </span>
                {link ? (
                  <Link to={link.href} className="dsc-log-text" title={link.cta}>
                    {text}
                  </Link>
                ) : (
                  <span className="dsc-log-text">{text}</span>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
      <p className="dsc-panel-foot">
        Grey means no data. Nothing here is a guess. <Link to={paths.logs()}>Open Logs →</Link>
      </p>
    </div>
  );
}
