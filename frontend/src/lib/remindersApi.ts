import { formatApiError } from "./apiError";

/** Pass S6 — cadence reminders, anchored to the journal rather than to a clock.
 *
 * `due_in_s` is negative when late; there is no separate "overdue" state, because due and
 * overdue are the same condition at different ages and a card that says how late it is
 * beats one that just shouts OVERDUE.
 */
export type Reminder = {
  id: number;
  scope_kind: "plant" | "space";
  scope_id: string;
  action: string;
  every_days: number;
  label: string;
  enabled: boolean;
  anchor_ts: number | null;
  snooze_until: number | null;
  /** When the action was last logged in this scope — null when nothing is logged yet. */
  last_done_ts: number | null;
  last_done_source: "journal" | "anchor" | "created";
  due_at: number;
  /** Seconds until due; negative means that many seconds late. */
  due_in_s: number;
  snoozed: boolean;
  due: boolean;
};

export async function fetchReminders(scope?: { kind?: string; id?: string }): Promise<{
  reminders: Reminder[];
  due: Reminder[];
  actions: string[];
}> {
  const q = new URLSearchParams();
  if (scope?.kind) q.set("scope_kind", scope.kind);
  if (scope?.id) q.set("scope_id", scope.id);
  const resp = await fetch(`/reminders?${q}`);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "could not load reminders"));
  return resp.json();
}

export async function createReminder(body: {
  scope_kind: string;
  scope_id: string;
  action: string;
  every_days: number;
  label?: string;
}): Promise<Reminder> {
  const resp = await fetch("/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "could not save the reminder"));
  return (await resp.json()).reminder as Reminder;
}

export async function patchReminder(id: number, patch: Partial<Reminder>): Promise<Reminder> {
  const resp = await fetch(`/reminders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "could not update the reminder"));
  return (await resp.json()).reminder as Reminder;
}

export async function snoozeReminder(id: number, hours = 24): Promise<Reminder> {
  const resp = await fetch(`/reminders/${id}/snooze?hours=${hours}`, { method: "POST" });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "could not snooze the reminder"));
  return (await resp.json()).reminder as Reminder;
}

export async function deleteReminder(id: number): Promise<void> {
  const resp = await fetch(`/reminders/${id}`, { method: "DELETE" });
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "could not delete the reminder"));
}

/** "4.2 days since the last one" / "nothing logged yet" — the card's second line. */
export function reminderSince(r: Reminder): string {
  if (r.last_done_ts == null) return "nothing logged yet";
  const days = (Date.now() / 1000 - r.last_done_ts) / 86400;
  return `${days.toFixed(1)} days since the last one`;
}

/** How late, in words. Only meaningful once `due` is true. */
export function reminderLateBy(r: Reminder): string {
  const late = -r.due_in_s;
  if (late <= 0) return "due now";
  const days = late / 86400;
  if (days >= 1) return `${days.toFixed(1)} days late`;
  return `${Math.round(late / 3600)} h late`;
}
