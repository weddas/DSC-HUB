import type { JournalEntry } from "../../types/journal";

export function fmtJournalWhen(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "—";
  }
}

export function provenanceTone(provenance: string | undefined): "ok" | "warn" | "muted" {
  const p = String(provenance || "").toLowerCase();
  if (p === "room" || p === "core") return "ok";
  if (p === "space") return "warn";
  if (p === "plant") return "muted";
  return "muted";
}

export function journalRowKey(row: JournalEntry): string {
  return `${row.provenance ?? "row"}-${row.id}-${row.space_id ?? ""}-${row.plant_id ?? ""}-${row.room_id ?? ""}`;
}

const SNAPSHOT_LABELS: Record<string, string> = {
  growth_stage: "Stage",
  moisture_pct: "Moisture",
  ec_us: "EC",
  ph: "pH",
  temp_c: "Temp",
  rh_pct: "RH",
  vpd_kpa: "VPD",
  window_open: "Window",
  lights_on_today_h: "Light h",
  climate_mode: "Climate",
  room_temp_c: "Room T",
  room_rh_pct: "Room RH",
  room_vpd_kpa: "Room VPD",
  brain_version: "Brain",
  active_alert_count: "Alerts",
};

export function snapshotChipLabel(key: string): string {
  return SNAPSHOT_LABELS[key] ?? key.replace(/_/g, " ");
}

export function formatSnapshotValue(key: string, val: unknown): string {
  if (val == null || val === "") return "—";
  if (key === "window_open") return val ? "Open" : "Closed";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "number") {
    if (key.includes("pct")) return `${val.toFixed(0)}%`;
    if (key.includes("temp") || key === "temp_c") return `${val.toFixed(1)}°C`;
    if (key.includes("vpd") || key.includes("kpa")) return `${val.toFixed(2)} kPa`;
    if (key.includes("ec")) return `${val.toFixed(2)} µS`;
    if (key === "ph") return val.toFixed(1);
    if (key === "lights_on_today_h") return `${val.toFixed(1)} h`;
    if (key === "active_alert_count") return String(Math.round(val));
    return String(val);
  }
  return String(val);
}

export function snapshotEntries(snapshot: Record<string, unknown> | undefined): Array<[string, unknown]> {
  if (!snapshot || typeof snapshot !== "object") return [];
  return Object.entries(snapshot).filter(([, v]) => v != null && v !== "");
}

export function toLocalInputValue(tsSec: number): string {
  const d = new Date(tsSec * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInputValue(v: string): number {
  const t = Date.parse(v);
  return Number.isFinite(t) ? t / 1000 : Date.now() / 1000;
}
