import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntityBus } from "../hooks/useEntityBus";
import { useAlertPrefs } from "../hooks/useAlertPrefs";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { usePreferences } from "../hooks/usePreference";
import { ALERT_ENTITY_IDS, playbookFor } from "../lib/alertPlaybook";
import { inQuietHours } from "../lib/alertPrefsApi";
import { paths } from "../lib/paths";
import { Icon } from "./ui";

const FAILSAFE_ID = "binary_sensor.dsc_hub_emergency_failsafe";
const TOAST_MS = 9000;

type Toast = { id: string; title: string; tone: "bad" | "warn"; at: number };

let audioCtx: AudioContext | null = null;
function beep(tone: "bad" | "warn") {
  try {
    audioCtx ??= new AudioContext();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const notes = tone === "bad" ? [880, 660, 880] : [660];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.12, now + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start(now + i * 0.18);
      o.stop(now + i * 0.18 + 0.17);
    });
  } catch {
    /* no audio device or autoplay blocked before the first gesture — the toast still shows */
  }
}

/** Preview the alert sound from Settings (needs a user gesture — the click is one). */
export function playAlertSoundPreview(tone: "bad" | "warn" = "bad") {
  beep(tone);
}

/**
 * In-page delivery for alerts (plan-settings S3): a toast on the rising edge of an
 * enabled alert, and a short tone when the browser preference allows it. Quiet hours
 * silence the tone but never the emergency failsafe. Disabled alerts never notify.
 * Nothing fires on first load — only on a change after the bus has settled.
 */
export function AlertNotifier() {
  const { state, tick } = useEntityBus();
  const prefs = usePreferences();
  const alerts = useAlertPrefs();
  const { isSnoozed } = useAlertSnooze();
  const navigate = useNavigate();
  const seen = useRef<Set<string> | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Screen readers only announce changes inside a live region that was already in the DOM,
  // so this text node is always rendered (visually hidden) and rewritten on each new alert.
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    // Wait for the fleet store to carry at least one alert entity; baselining on an
    // empty store would toast every alert that was already on when the page loaded.
    if (seen.current == null && !ALERT_ENTITY_IDS.some((id) => state(id, "") !== "")) return;
    const active = new Set(ALERT_ENTITY_IDS.filter((id) => state(id) === "on"));
    if (seen.current == null) {
      seen.current = active; // first populated read: baseline, no notifications
      return;
    }
    const fresh = [...active].filter((id) => !seen.current!.has(id));
    seen.current = active;
    if (!fresh.length) return;
    const quiet = inQuietHours(alerts.quietHours);
    const now = Date.now();
    const newToasts: Toast[] = [];
    let playTone: "bad" | "warn" | null = null;
    const spoken: string[] = [];
    for (const id of fresh) {
      if (!alerts.isEnabled(id) || isSnoozed(id)) continue;
      const sev = alerts.severityOf(id);
      const tone: "bad" | "warn" = sev === "critical" ? "bad" : "warn";
      const title = playbookFor(id, "alert").title;
      spoken.push(sev === "critical" ? `Critical: ${title}` : title);
      if (prefs.alertToast) newToasts.push({ id, title, tone, at: now });
      const soundOk = prefs.alertSound === "all" || (prefs.alertSound === "critical" && sev === "critical");
      if (soundOk && (!quiet || id === FAILSAFE_ID)) playTone = tone === "bad" ? "bad" : (playTone ?? "warn");
    }
    if (newToasts.length) setToasts((t) => [...newToasts, ...t].slice(0, 4));
    if (spoken.length) setAnnounce(`New alert${spoken.length > 1 ? "s" : ""}: ${spoken.join("; ")}`);
    if (playTone) beep(playTone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  useEffect(() => {
    if (!toasts.length) return;
    const t = window.setTimeout(() => setToasts((cur) => cur.filter((x) => Date.now() - x.at < TOAST_MS)), TOAST_MS + 50);
    return () => window.clearTimeout(t);
  }, [toasts]);

  return (
    <>
      <div className="dsc-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announce}
      </div>
      {toasts.length ? (
        <div className="dsc-toasts" role="region" aria-label="New alerts">
          {toasts.map((t) => (
        <div key={`${t.id}-${t.at}`} className={`dsc-toast dsc-toast--${t.tone}`} role={t.tone === "bad" ? "alert" : "status"}>
          <Icon name="bell" size={14} />
          <span className="dsc-toast-title">{t.title}</span>
          <button type="button" className="dsc-toast-cta" onClick={() => navigate(paths.alerts())}>
            OPEN ALERTS →
          </button>
          <button
            type="button"
            className="dsc-toast-close"
            aria-label="Dismiss"
            onClick={() => setToasts((cur) => cur.filter((x) => x !== t))}
          >
            <Icon name="close" size={12} />
          </button>
        </div>
      ))}
        </div>
      ) : null}
    </>
  );
}
