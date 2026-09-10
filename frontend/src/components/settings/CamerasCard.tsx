import { useEffect, useMemo, useState } from "react";
import { DecisionLayer } from "../DecisionLayer";
import { SlideDrawer } from "../chrome";
import { Button, StatusTag } from "../ui";
import { SettingsCard, Toggle } from "./SettingRow";
import { CameraThumb, CameraViewer } from "../CameraSlot";
import { useCameras } from "../../hooks/useCameras";
import { cameraErrorHelp } from "../../lib/cameraError";
import {
  deleteCamera,
  captureCamera,
  formatAgo,
  formatBytes,
  putCamera,
  slugCameraId,
  testCameraSource,
  type CameraPatch,
  type CameraRecord,
  type CameraSourceKind,
  type CameraTestResult,
} from "../../lib/camerasApi";

/**
 * Settings › Devices › Cameras (plan-settings § 3.11a / S7). One drawer per camera:
 * zone, source (USB webcam on the brain · HTTP snapshot · MJPEG · RTSP · motionEye
 * satellite Pi), credentials (masked, brain KV), cadence, lights-on gate, retention and
 * cap, timelapse assembly. Test grabs one frame before Save so the framing is seen first.
 */

const ZONE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "4x8", label: "4×8 tent" },
  { id: "2x4", label: "2×4 tent" },
  { id: "grow_room", label: "Grow room" },
];

const INTERVAL_OPTIONS = [60, 120, 300, 600, 900, 1800, 3600];

interface Draft {
  camera_id: string;
  label: string;
  space_id: string;
  source_kind: CameraSourceKind;
  source: string;
  username: string;
  password: string;
  auth: "basic" | "digest";
  camera_no: number;
  stream_port: string;
  interval_s: number;
  lights_on_only: boolean;
  keep_days: number;
  cap_gb: number;
  assemble: "off" | "daily" | "weekly";
  fps: number;
  /** "WxH", or "" for the largest mode the camera reports. */
  resolution: string;
  enabled: boolean;
}

const EMPTY_DRAFT: Draft = {
  camera_id: "",
  label: "",
  space_id: "4x8",
  source_kind: "snapshot",
  source: "",
  username: "",
  password: "",
  auth: "basic",
  camera_no: 1,
  stream_port: "",
  interval_s: 600,
  lights_on_only: true,
  keep_days: 30,
  cap_gb: 2,
  assemble: "off",
  fps: 12,
  resolution: "",
  enabled: true,
};

function draftFrom(cam: CameraRecord): Draft {
  return {
    camera_id: cam.camera_id,
    label: cam.label,
    space_id: cam.space_id,
    source_kind: cam.source_kind,
    source: cam.source,
    username: cam.username,
    password: "",
    auth: cam.extra.auth === "digest" ? "digest" : "basic",
    camera_no: Number(cam.extra.camera_no ?? 1),
    stream_port: cam.extra.stream_port ? String(cam.extra.stream_port) : "",
    interval_s: cam.interval_s,
    lights_on_only: cam.lights_on_only,
    keep_days: cam.keep_days,
    cap_gb: cam.cap_gb,
    assemble: cam.extra.assemble ?? "off",
    fps: Number(cam.extra.fps ?? 12),
    resolution: cam.extra.width && cam.extra.height ? `${cam.extra.width}x${cam.extra.height}` : "",
    enabled: cam.enabled,
  };
}

function patchFrom(d: Draft): CameraPatch {
  const extra: CameraPatch["extra"] = { auth: d.auth, assemble: d.assemble, fps: d.fps };
  if (d.source_kind === "usb" && d.resolution) {
    const [w, h] = d.resolution.split("x");
    extra.width = Number(w);
    extra.height = Number(h);
  }
  if (d.source_kind === "motioneye") {
    extra.camera_no = d.camera_no;
    extra.stream_port = d.stream_port.trim() ? Number(d.stream_port) : undefined;
  }
  const patch: CameraPatch = {
    label: d.label.trim(),
    space_id: d.space_id,
    source_kind: d.source_kind,
    source: d.source.trim(),
    username: d.username.trim(),
    enabled: d.enabled,
    interval_s: d.interval_s,
    lights_on_only: d.lights_on_only,
    keep_days: d.keep_days,
    cap_gb: d.cap_gb,
    extra,
  };
  if (d.password) patch.password = d.password;
  return patch;
}

const SOURCE_HELP: Record<CameraSourceKind, string> = {
  usb: "A webcam on one of the brain Pi's USB ports. The brain reads /dev/videoN with ffmpeg.",
  snapshot: "A URL that answers with one JPEG — most IP cameras (…/snapshot.jpg, …/cgi-bin/snapshot.cgi), an ESP32-CAM /capture, motion's /current.",
  mjpeg: "A multipart MJPEG stream; the brain takes the first frame and hangs up, so nothing streams continuously.",
  rtsp: "An RTSP stream (rtsp://host:554/…). One frame is grabbed with ffmpeg on the Pi.",
  motioneye: "An old Pi with an old webcam running motionEye. Give its host; the brain reads camera N's motion stream port (8080 + N) as MJPEG. Turn streaming on for the camera in motionEye.",
};

function statusTag(cam: CameraRecord, now: number): { label: string; tone: "ok" | "warn" | "bad" | "muted"; title: string } {
  const st = cam.status;
  if (!cam.enabled) return { label: "DISABLED", tone: "muted", title: "Not capturing" };
  if (st.last_error) return { label: `FAILED · ${formatAgo(st.last_attempt_at, now).toUpperCase()}`, tone: "bad", title: st.last_error };
  if (st.skipped_reason === "lights off") return { label: "LIGHTS OFF", tone: "muted", title: "Paused while the zone's photoperiod window is closed" };
  if (!cam.has_latest) return { label: "WAITING FOR FIRST FRAME", tone: "muted", title: "The poller captures within one interval" };
  return { label: `OK · ${formatAgo(cam.latest_at, now).toUpperCase()}`, tone: "ok", title: `${st.frames} captures · ${st.width ?? "?"} × ${st.height ?? "?"}` };
}

export function CamerasCard() {
  const { summary, error, predates, loaded, refresh } = useCameras();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<CameraTestResult | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CameraRecord | null>(null);
  const [deleteMedia, setDeleteMedia] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [capturingId, setCapturingId] = useState<string | null>(null);
  const [captureNote, setCaptureNote] = useState<Record<string, string>>({});
  const [viewing, setViewing] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now() / 1000), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const cameras = summary?.cameras ?? [];
  const usb = summary?.usb_devices ?? [];
  const usbSelected = usb.find((d) => (d.by_id || d.device) === editing?.source || d.device === editing?.source);
  const ffmpeg = summary?.ffmpeg ?? false;
  const viewingCam = useMemo(() => cameras.find((c) => c.camera_id === viewing) ?? null, [cameras, viewing]);

  const openNew = () => {
    setEditing({ ...EMPTY_DRAFT });
    setIsNew(true);
    setSaveErr(null);
    setTestResult(null);
  };
  const openEdit = (cam: CameraRecord) => {
    setEditing(draftFrom(cam));
    setIsNew(false);
    setSaveErr(null);
    setTestResult(null);
  };
  const closeDrawer = () => {
    if (saving || testing) return;
    setEditing(null);
  };

  const patchDraft = (p: Partial<Draft>) => setEditing((d) => (d ? { ...d, ...p } : d));

  const doTest = async () => {
    if (!editing) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testCameraSource({
        source_kind: editing.source_kind,
        source: editing.source.trim(),
        username: editing.username.trim(),
        password: editing.password,
        extra: editing.source_kind === "motioneye" ? { camera_no: editing.camera_no, stream_port: editing.stream_port.trim() ? Number(editing.stream_port) : undefined, auth: editing.auth } : { auth: editing.auth },
        camera_id: isNew ? undefined : editing.camera_id,
      });
      setTestResult(res);
    } catch (e) {
      setTestResult({ ok: false, error: e instanceof Error ? e.message : String(e) });
    } finally {
      setTesting(false);
    }
  };

  const doSave = async () => {
    if (!editing) return;
    const id = isNew ? editing.camera_id.trim() || slugCameraId(editing.label) : editing.camera_id;
    if (!id) {
      setSaveErr("give the camera a name");
      return;
    }
    setSaving(true);
    setSaveErr(null);
    try {
      await putCamera(id, patchFrom(editing));
      await refresh();
      setEditing(null);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCamera(pendingDelete.camera_id, deleteMedia);
      await refresh();
      setPendingDelete(null);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  };

  const doCapture = async (cam: CameraRecord) => {
    setCapturingId(cam.camera_id);
    try {
      const res = await captureCamera(cam.camera_id);
      setCaptureNote((n) => ({ ...n, [cam.camera_id]: res.ok ? "captured" : res.error ?? "failed" }));
      await refresh();
    } catch (e) {
      setCaptureNote((n) => ({ ...n, [cam.camera_id]: e instanceof Error ? e.message : String(e) }));
    } finally {
      setCapturingId(null);
    }
  };

  const toggleEnabled = async (cam: CameraRecord, next: boolean) => {
    try {
      await putCamera(cam.camera_id, { enabled: next });
      await refresh();
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e));
    }
  };

  const loadState = !loaded ? "loading" : predates || (error && !summary) ? "error" : "ready";

  return (
    <>
      <SettingsCard
        id="cameras"
        title="Cameras"
        icon="camera-monitor"
        intro="Fixed-mount cameras per zone: an IP camera, a USB webcam on the brain Pi, or an old Pi running motionEye with an old webcam. The brain captures a frame on its own cadence and keeps them on disk for live view and timelapse — local only, never sent anywhere, never in the setup-profile export."
        loadState={loadState}
        loadError={predates ? "The brain on the hub predates cameras — hotpatch the brain to bind a camera." : error ?? undefined}
        actions={
          <>
            <Button primary onClick={openNew} icon="camera-monitor">
              Add camera
            </Button>
            {summary ? (
              <span className="dsc-muted">
                {cameras.length} camera{cameras.length === 1 ? "" : "s"} · {formatBytes(summary.total_bytes)} on disk under <code>{summary.media_root}</code>
              </span>
            ) : null}
          </>
        }
      >
        {!ffmpeg && summary ? (
          <p className="dsc-honesty">ffmpeg is not installed on the brain host — USB webcams, RTSP sources and timelapse assembly need it (<code>apt install ffmpeg</code>). HTTP snapshot, MJPEG and motionEye sources work without it.</p>
        ) : null}
        {saveErr && !editing ? <p className="dsc-honesty">{saveErr}</p> : null}
        {cameras.length === 0 && loadState === "ready" ? (
          <p className="dsc-muted">No camera bound. The zone cards show a dashed CAMERA slot until one is.</p>
        ) : null}
        <div className="dsc-cam-list">
          {cameras.map((cam) => {
            const st = statusTag(cam, now);
            const zone = ZONE_OPTIONS.find((z) => z.id === cam.space_id)?.label ?? cam.space_id;
            return (
              <div key={cam.camera_id} className="dsc-cam-row">
                <CameraThumb camera={cam} compact onOpen={() => setViewing(cam.camera_id)} />
                <div className="dsc-cam-row-main">
                  <div className="dsc-cam-row-title">
                    <b>{cam.label}</b>
                    <span className="dsc-muted">
                      {zone} · {cam.kind_label} · every {Math.round(cam.interval_s / 60)} min{cam.lights_on_only ? " · lights on" : ""}
                    </span>
                  </div>
                  <div className="dsc-tagrow">
                    <StatusTag label={st.label} tone={st.tone} title={st.title} />
                    <StatusTag label={`${cam.storage.frames} FRAMES · ${formatBytes(cam.storage.bytes).toUpperCase()}`} tone="muted" title={cam.keep_days > 0 ? `Kept ${cam.keep_days} days, cap ${cam.cap_gb} GB` : `Kept indefinitely, cap ${cam.cap_gb} GB`} />
                    {cam.password_set ? <StatusTag label="CREDENTIALS SET" tone="muted" title="Password stored by the brain, never shown" /> : null}
                    {cam.extra.assemble && cam.extra.assemble !== "off" ? <StatusTag label={`TIMELAPSE ${cam.extra.assemble.toUpperCase()}`} tone="teal" /> : null}
                  </div>
                  <code className="dsc-cam-src">{cam.source_kind === "motioneye" ? `motionEye ${cam.source} · camera ${cam.extra.camera_no ?? 1}` : cam.source}</code>
                  {(() => {
                    const help = cameraErrorHelp(cam.status.last_error);
                    if (!help) return null;
                    // On a DISABLED camera this error is the last thing that happened before
                    // it was switched off, not a live failure — saying so removes the "is it
                    // still trying?" question the bare error left hanging.
                    return (
                      <p className="dsc-honesty">
                        {!cam.enabled ? <em>Last attempt before this camera was disabled — it is not capturing now. </em> : null}
                        {help.guidance}
                        {help.guidance !== help.raw ? (
                          <>
                            {" "}
                            <span className="dsc-muted" title={help.raw}>
                              ({help.raw})
                            </span>
                          </>
                        ) : null}
                      </p>
                    );
                  })()}
                </div>
                <div className="dsc-cam-row-actions">
                  <Toggle checked={cam.enabled} onChange={(v) => void toggleEnabled(cam, v)} label={`Capture enabled for ${cam.label}`} />
                  <Button onClick={() => void doCapture(cam)} busy={capturingId === cam.camera_id}>
                    Capture now
                  </Button>
                  <Button onClick={() => openEdit(cam)}>Edit</Button>
                  <Button variant="danger" onClick={() => { setPendingDelete(cam); setDeleteMedia(true); }}>
                    Remove
                  </Button>
                  {captureNote[cam.camera_id] ? <span className="dsc-muted">{captureNote[cam.camera_id]}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
        <p className="dsc-muted dsc-cam-fixed">Fixed mount is assumed: the frame must not move — plant regions (next pass) are pixel regions in that frame.</p>
      </SettingsCard>

      <SlideDrawer open={editing != null} onClose={closeDrawer} title={isNew ? "Add camera" : `Camera · ${editing?.label ?? ""}`} wide>
        {editing ? (
          <form
            className="dsc-cam-form"
            onSubmit={(e) => {
              e.preventDefault();
              void doSave();
            }}
          >
            <label>
              <span>Name</span>
              <input
                type="text"
                value={editing.label}
                placeholder="4×8 corner"
                onChange={(e) => patchDraft({ label: e.target.value, ...(isNew ? { camera_id: slugCameraId(e.target.value) } : {}) })}
              />
            </label>
            <label>
              <span>Id</span>
              <input type="text" value={editing.camera_id} disabled={!isNew} onChange={(e) => patchDraft({ camera_id: e.target.value })} placeholder="from the name" />
            </label>
            <label>
              <span>Zone</span>
              <select value={editing.space_id} onChange={(e) => patchDraft({ space_id: e.target.value })}>
                {ZONE_OPTIONS.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Source</span>
              <select
                value={editing.source_kind}
                onChange={(e) => {
                  const kind = e.target.value as CameraSourceKind;
                  patchDraft({ source_kind: kind, source: kind === "usb" ? usb[0]?.by_id || usb[0]?.device || "/dev/video0" : "" });
                  setTestResult(null);
                }}
              >
                {(summary?.source_kinds ?? []).map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="dsc-muted dsc-cam-form-help">{SOURCE_HELP[editing.source_kind]}</p>

            {editing.source_kind === "usb" ? (
              <label>
                <span>Device</span>
                {usb.length ? (
                  <select value={editing.source} onChange={(e) => patchDraft({ source: e.target.value })}>
                    {usb.map((d) => (
                      // Prefer the by-id path as the VALUE: /dev/videoN is probe-order and
                      // two identical cameras can swap numbers on a replug, which would
                      // quietly repoint a tent at the other tent. Label carries the serial
                      // so the two are tellable apart on screen.
                      <option key={d.device} value={d.by_id || d.device}>
                        {d.device} — {d.label || d.name || "unnamed"}
                      </option>
                    ))}
                    {!usb.some((d) => (d.by_id || d.device) === editing.source) ? <option value={editing.source}>{editing.source}</option> : null}
                  </select>
                ) : (
                  <input type="text" value={editing.source} placeholder="/dev/video0" onChange={(e) => patchDraft({ source: e.target.value })} />
                )}
                {/* Without this the operator has no way to know a 1080p camera is
                    recording at 640x480: ffmpeg given no format takes the driver default,
                    which on a UVC webcam is YUYV at its smallest common size. */}
                <span className="dsc-cam-subfield">Resolution</span>
                <select value={editing.resolution} onChange={(e) => patchDraft({ resolution: e.target.value })}>
                  <option value="">
                    Best available{usbSelected?.best_size ? ` (${usbSelected.best_size})` : ""}
                  </option>
                  {(usbSelected?.sizes ?? []).map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                  {editing.resolution && !(usbSelected?.sizes ?? []).includes(editing.resolution) ? (
                    <option value={editing.resolution}>{editing.resolution}</option>
                  ) : null}
                </select>
              </label>
            ) : editing.source_kind === "motioneye" ? (
              <>
                <label>
                  <span>Satellite host</span>
                  <input type="text" value={editing.source} placeholder="10.42.0.61 or pi-cam.local" onChange={(e) => patchDraft({ source: e.target.value })} />
                </label>
                <label>
                  <span>Camera number</span>
                  <input type="number" min={1} max={32} value={editing.camera_no} onChange={(e) => patchDraft({ camera_no: Math.max(1, Number(e.target.value) || 1) })} />
                </label>
                <label>
                  <span>Stream port</span>
                  <input type="text" value={editing.stream_port} placeholder={`${8080 + editing.camera_no} (motionEye default)`} onChange={(e) => patchDraft({ stream_port: e.target.value })} />
                </label>
              </>
            ) : (
              <label>
                <span>URL</span>
                <input
                  type="text"
                  value={editing.source}
                  placeholder={editing.source_kind === "rtsp" ? "rtsp://10.42.0.62:554/stream1" : editing.source_kind === "mjpeg" ? "http://10.42.0.62:8081/" : "http://10.42.0.62/snapshot.jpg"}
                  onChange={(e) => patchDraft({ source: e.target.value })}
                />
              </label>
            )}
            {editing.source_kind !== "usb" ? (
              <>
                <label>
                  <span>Username</span>
                  <input type="text" value={editing.username} autoComplete="off" onChange={(e) => patchDraft({ username: e.target.value })} />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={editing.password}
                    autoComplete="new-password"
                    placeholder={!isNew && cameras.find((c) => c.camera_id === editing.camera_id)?.password_set ? "•••••••• (set — leave blank to keep)" : "none"}
                    onChange={(e) => patchDraft({ password: e.target.value })}
                  />
                </label>
                {editing.source_kind !== "rtsp" ? (
                  <label>
                    <span>HTTP auth</span>
                    <select value={editing.auth} onChange={(e) => patchDraft({ auth: e.target.value as "basic" | "digest" })}>
                      <option value="basic">Basic</option>
                      <option value="digest">Digest</option>
                    </select>
                  </label>
                ) : null}
              </>
            ) : null}

            <div className="dsc-row-actions">
              <Button onClick={() => void doTest()} busy={testing} disabled={!editing.source.trim()}>
                Test source
              </Button>
              {testResult && !testResult.ok ? <span className="dsc-honesty">{testResult.error}</span> : null}
              {testResult && testResult.ok ? (
                <span className="dsc-muted">
                  {testResult.width ?? "?"} × {testResult.height ?? "?"} · {formatBytes(testResult.bytes)} · {testResult.ms} ms
                </span>
              ) : null}
            </div>
            {testResult && testResult.ok ? (
              <div className="dsc-cam-preview">
                <img src={testResult.preview} alt="Test frame" width={testResult.width ?? 640} height={testResult.height ?? 360} />
              </div>
            ) : null}

            <h4 className="dsc-cam-h">Capture</h4>
            <label>
              <span>Interval</span>
              <select value={editing.interval_s} onChange={(e) => patchDraft({ interval_s: Number(e.target.value) })}>
                {INTERVAL_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s < 3600 ? `${s / 60} min` : "60 min"}
                  </option>
                ))}
              </select>
            </label>
            <label className="dsc-cam-form-toggle">
              <span>Lights on only</span>
              <Toggle
                checked={editing.lights_on_only}
                disabled={editing.space_id === "grow_room"}
                onChange={(v) => patchDraft({ lights_on_only: v })}
                label="Capture only while the zone's photoperiod window is open"
              />
              <em className="dsc-muted">{editing.space_id === "grow_room" ? "The room has no photoperiod window — captures on the interval." : "From the hub's photoperiod window for the zone."}</em>
            </label>
            <label className="dsc-cam-form-toggle">
              <span>Enabled</span>
              <Toggle checked={editing.enabled} onChange={(v) => patchDraft({ enabled: v })} label="Capture enabled" />
            </label>

            <h4 className="dsc-cam-h">Retention</h4>
            <label>
              <span>Keep frames</span>
              <span className="dsc-cam-form-inline">
                <input type="number" min={0} max={3650} value={editing.keep_days} onChange={(e) => patchDraft({ keep_days: Math.max(0, Number(e.target.value) || 0) })} />
                <em className="dsc-muted">days · 0 = indefinitely</em>
              </span>
            </label>
            <label>
              <span>Storage cap</span>
              <span className="dsc-cam-form-inline">
                <input type="number" min={0} max={512} step={0.5} value={editing.cap_gb} onChange={(e) => patchDraft({ cap_gb: Math.max(0, Number(e.target.value) || 0) })} />
                <em className="dsc-muted">GB · oldest days go first · 0 = no cap</em>
              </span>
            </label>

            <h4 className="dsc-cam-h">Timelapse</h4>
            <label>
              <span>Assemble</span>
              <select value={editing.assemble} onChange={(e) => patchDraft({ assemble: e.target.value as Draft["assemble"] })}>
                <option value="off">On demand only</option>
                <option value="daily">Daily (yesterday's frames)</option>
                <option value="weekly">Weekly (Mon–Sun)</option>
              </select>
            </label>
            <label>
              <span>Frames per second</span>
              <input type="number" min={1} max={60} value={editing.fps} onChange={(e) => patchDraft({ fps: Math.max(1, Math.min(60, Number(e.target.value) || 12)) })} />
            </label>
            {!ffmpeg ? <p className="dsc-honesty">Assembly needs ffmpeg on the brain host.</p> : null}

            {saveErr ? <p className="dsc-honesty">{saveErr}</p> : null}
            <div className="dsc-row-actions">
              <Button primary type="submit" busy={saving}>
                {isNew ? "Add camera" : "Save"}
              </Button>
              <Button onClick={closeDrawer} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        ) : null}
      </SlideDrawer>

      <DecisionLayer
        open={pendingDelete != null}
        onDismiss={() => (deleting ? undefined : setPendingDelete(null))}
        onConfirm={() => void doDelete()}
        title={`Remove ${pendingDelete?.label ?? "camera"}?`}
        confirmLabel="Remove"
        busy={deleting}
      >
        <p>The camera record and its stored password go. The zone card returns to the dashed CAMERA slot.</p>
        {pendingDelete ? (
          <label className="dsc-cam-form-toggle">
            <Toggle checked={deleteMedia} onChange={setDeleteMedia} label="Also delete frames on disk" />
            <span>
              Also delete {pendingDelete.storage.frames} frames and {pendingDelete.storage.timelapses} timelapses ({formatBytes(pendingDelete.storage.bytes)}) on disk
            </span>
          </label>
        ) : null}
        <p className="dsc-muted">Download a timelapse first if you want the record — there is no undo for the media.</p>
      </DecisionLayer>

      <CameraViewer camera={viewingCam} onClose={() => setViewing(null)} />
    </>
  );
}
