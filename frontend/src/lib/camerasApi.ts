import { formatApiError } from "./apiError";

/**
 * Cameras (plan-settings § S7): brain-owned vision devices bound to a zone. The brain
 * captures on its own cadence and keeps frames on disk; the SPA reads `latest.jpg`,
 * day lists, frame lists and assembled timelapses. Credentials never come back — only
 * `password_set`.
 */

export type CameraSourceKind = "usb" | "snapshot" | "mjpeg" | "rtsp" | "motioneye";

export interface CameraStatus {
  last_attempt_at: number | null;
  last_ok_at: number | null;
  last_error: string;
  last_bytes: number;
  width: number | null;
  height: number | null;
  frames: number;
  consecutive_failures: number;
  skipped_reason: string;
  last_prune_at: number | null;
  last_assemble_day: string;
}

export interface CameraStorage {
  frames: number;
  frame_bytes: number;
  timelapses: number;
  timelapse_bytes: number;
  bytes: number;
  oldest_day_at: number | null;
}

export interface CameraExtra {
  camera_no?: number;
  stream_port?: number;
  auth?: "basic" | "digest";
  assemble?: "off" | "daily" | "weekly";
  fps?: number;
  [key: string]: unknown;
}

export interface CameraRecord {
  camera_id: string;
  space_id: string;
  label: string;
  source_kind: CameraSourceKind;
  source: string;
  username: string;
  enabled: boolean;
  interval_s: number;
  lights_on_only: boolean;
  keep_days: number;
  cap_gb: number;
  extra: CameraExtra;
  created_at: number;
  updated_at: number;
  password_set: boolean;
  stream_url: string | null;
  status: CameraStatus;
  storage: CameraStorage;
  has_latest: boolean;
  latest_at: number | null;
  kind_label: string;
}

/** The compact shape `/spaces` carries per space for the zone card. */
export interface SpaceCamera {
  camera_id: string;
  label: string;
  enabled: boolean;
  source_kind: CameraSourceKind;
  has_latest: boolean;
  latest_at: number | null;
  last_error: string;
  interval_s: number;
}

export interface CamerasSummary {
  cameras: CameraRecord[];
  source_kinds: Array<{ id: CameraSourceKind; label: string }>;
  ffmpeg: boolean;
  usb_devices: Array<{ device: string; name: string }>;
  media_root: string;
  total_bytes: number;
}

export interface CameraPatch {
  space_id?: string;
  label?: string;
  source_kind?: CameraSourceKind;
  source?: string;
  username?: string;
  password?: string;
  clear_password?: boolean;
  enabled?: boolean;
  interval_s?: number;
  lights_on_only?: boolean;
  keep_days?: number;
  cap_gb?: number;
  extra?: CameraExtra;
}

export interface CameraTestSpec {
  source_kind: CameraSourceKind;
  source: string;
  username?: string;
  password?: string;
  extra?: CameraExtra;
  camera_id?: string;
}

export type CameraTestResult =
  | { ok: true; ms: number; bytes: number; width: number | null; height: number | null; preview: string; stream_url: string | null }
  | { ok: false; error: string };

export interface CameraFrame {
  name: string;
  at: number;
  bytes: number;
}

export interface CameraDay {
  day: string;
  frames: number;
  bytes: number;
}

export interface CameraTimelapse {
  name: string;
  bytes: number;
  at: number;
  day_from?: string;
  day_to?: string;
  frames?: number;
  fps?: number;
  seconds?: number;
}

export const CAMERAS_PREDATE = "the brain on the hub predates cameras — hotpatch the brain to bind a camera";

async function jsonOrPredates<T>(resp: Response, fallback: string): Promise<T> {
  if (resp.status === 404 && !(resp.headers.get("content-type") || "").includes("json")) throw new Error(CAMERAS_PREDATE);
  const ctype = resp.headers.get("content-type") || "";
  if (!ctype.includes("json")) throw new Error(CAMERAS_PREDATE);
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), fallback));
  return (await resp.json()) as T;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function getCameras(): Promise<CamerasSummary> {
  return jsonOrPredates<CamerasSummary>(await fetch(`/cameras?_=${Date.now()}`), "cameras failed");
}

export async function putCamera(cameraId: string, patch: CameraPatch): Promise<CameraRecord> {
  const resp = await fetch(`/cameras/${encodeURIComponent(cameraId)}`, { method: "PUT", headers: JSON_HEADERS, body: JSON.stringify(patch) });
  return jsonOrPredates<CameraRecord>(resp, "camera save failed");
}

export async function deleteCamera(cameraId: string, deleteMedia: boolean): Promise<{ deleted: boolean }> {
  const resp = await fetch(`/cameras/${encodeURIComponent(cameraId)}?delete_media=${deleteMedia ? "true" : "false"}`, { method: "DELETE" });
  return jsonOrPredates(resp, "camera delete failed");
}

export async function captureCamera(cameraId: string): Promise<{ ok: boolean; error?: string; frame?: string; camera: CameraRecord | null }> {
  const resp = await fetch(`/cameras/${encodeURIComponent(cameraId)}/capture`, { method: "POST" });
  return jsonOrPredates(resp, "capture failed");
}

export async function testCameraSource(spec: CameraTestSpec): Promise<CameraTestResult> {
  const resp = await fetch("/cameras/test", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(spec) });
  return jsonOrPredates<CameraTestResult>(resp, "camera test failed");
}

export async function getCameraDays(cameraId: string): Promise<CameraDay[]> {
  const data = await jsonOrPredates<{ days: CameraDay[] }>(await fetch(`/cameras/${encodeURIComponent(cameraId)}/days?_=${Date.now()}`), "camera days failed");
  return data.days;
}

export async function getCameraFrames(cameraId: string, day?: string, limit = 200): Promise<CameraFrame[]> {
  const q = new URLSearchParams({ limit: String(limit), _: String(Date.now()) });
  if (day) q.set("day", day);
  const data = await jsonOrPredates<{ frames: CameraFrame[] }>(await fetch(`/cameras/${encodeURIComponent(cameraId)}/frames?${q}`), "camera frames failed");
  return data.frames;
}

export async function getCameraTimelapses(cameraId: string): Promise<CameraTimelapse[]> {
  const data = await jsonOrPredates<{ timelapses: CameraTimelapse[] }>(
    await fetch(`/cameras/${encodeURIComponent(cameraId)}/timelapses?_=${Date.now()}`),
    "timelapses failed",
  );
  return data.timelapses;
}

export async function assembleTimelapse(
  cameraId: string,
  body: { day_from: string; day_to: string; fps?: number; height?: number },
): Promise<CameraTimelapse> {
  const resp = await fetch(`/cameras/${encodeURIComponent(cameraId)}/timelapse`, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body) });
  return jsonOrPredates<CameraTimelapse>(resp, "timelapse failed");
}

export function latestFrameUrl(cameraId: string, stamp: number | null | undefined): string {
  return `/cameras/${encodeURIComponent(cameraId)}/latest.jpg?t=${Math.round((stamp ?? 0) * 1000)}`;
}

export function frameUrl(cameraId: string, name: string): string {
  return `/cameras/${encodeURIComponent(cameraId)}/frames/${name}`;
}

export function timelapseUrl(cameraId: string, name: string): string {
  return `/cameras/${encodeURIComponent(cameraId)}/timelapses/${encodeURIComponent(name)}`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function formatAgo(ts: number | null | undefined, now = Date.now() / 1000): string {
  if (ts == null) return "never";
  const s = Math.max(0, now - ts);
  if (s < 60) return `${Math.round(s)} s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${(s / 3600).toFixed(1)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

/** A camera id from a label: `4×8 corner` → `4x8-corner`. */
export function slugCameraId(label: string): string {
  return label
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
