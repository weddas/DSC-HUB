import { Fragment, useEffect, useMemo, useState } from "react";
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
  framedSize,
  getCameraControls,
  putCamera,
  slugCameraId,
  testCameraSource,
  type CameraControl,
  type CameraExtra,
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
  /** Framing. Baked into the stored frame by the brain, not applied in the browser. */
  flip_h: boolean;
  flip_v: boolean;
  rotate: number;
  zoom: number;
  zoom_x: number;
  zoom_y: number;
  warmup_frames: number;
  /** Only the controls the operator actually touched; the rest are left where the camera
   * has them, which is a different thing from setting them to their defaults. */
  controls: Record<string, number>;
  enabled: boolean;
}

const CONTROL_GROUPS: Array<{ id: CameraControl["group"]; label: string; note?: string }> = [
  { id: "exposure", label: "Exposure", note: "A camera left on auto re-meters every capture, and a month of frames pulses. Manual is what a timelapse wants." },
  { id: "focus", label: "Focus", note: "Continuous AF hunts on a canopy moving under a fan. Focus once with it on, then switch it off to lock the lens." },
  { id: "colour", label: "Colour" },
  { id: "image", label: "Image" },
  { id: "framing", label: "Camera pan · tilt · zoom", note: "The camera's own optics, applied before the frame reaches the brain — unlike the digital zoom above, which is a crop." },
];

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
  flip_h: false,
  flip_v: false,
  rotate: 0,
  zoom: 1,
  zoom_x: 50,
  zoom_y: 50,
  warmup_frames: 0,
  controls: {},
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
    flip_h: Boolean(cam.extra.flip_h),
    flip_v: Boolean(cam.extra.flip_v),
    rotate: Number(cam.extra.rotate ?? 0),
    zoom: Number(cam.extra.zoom ?? 1),
    zoom_x: Number(cam.extra.zoom_x ?? 50),
    zoom_y: Number(cam.extra.zoom_y ?? 50),
    warmup_frames: Number(cam.extra.warmup_frames ?? 0),
    controls: { ...(cam.extra.controls ?? {}) },
    enabled: cam.enabled,
  };
}

/** The framing keys, shared by Save and by Test — a preview of a framing the saved camera
 * would not have is worse than no preview. */
function framingExtra(d: Draft): CameraExtra {
  return {
    flip_h: d.flip_h,
    flip_v: d.flip_v,
    rotate: d.rotate as CameraExtra["rotate"],
    zoom: d.zoom,
    zoom_x: d.zoom_x,
    zoom_y: d.zoom_y,
    warmup_frames: d.warmup_frames,
    // Controls are a USB-only idea; sending an empty map on any other kind clears whatever
    // a source-kind change left behind. The brain drops the key when the map is empty.
    controls: d.source_kind === "usb" ? d.controls : {},
  };
}

function patchFrom(d: Draft): CameraPatch {
  const extra: CameraPatch["extra"] = { auth: d.auth, assemble: d.assemble, fps: d.fps, ...framingExtra(d) };
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

/** The value a control will have after Save: the operator's if they touched it, otherwise
 * whatever the camera is holding right now. */
function controlValue(draft: Draft, control: CameraControl): number | null {
  const chosen = draft.controls[control.key];
  return chosen !== undefined ? chosen : control.value;
}

function gateHint(control: CameraControl, gate: CameraControl | undefined): string {
  if (!gate || !control.gated_by) return control.help;
  return `Set ${gate.label.toLowerCase()} to ${
    gate.options.find((o) => o.value === control.gated_by?.value)?.label ??
    (control.gated_by.value ? "on" : "off")
  } first — the camera refuses this while it is not.`;
}

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
  const [controls, setControls] = useState<CameraControl[] | null>(null);
  const [controlsErr, setControlsErr] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now() / 1000), 15_000);
    return () => window.clearInterval(id);
  }, []);

  // The camera's own knobs are read from the node rather than echoed back from the saved
  // row: a replug resets a UVC device to its defaults, so the row and the lens can disagree
  // and the lens is the one telling the truth. Re-read after each Test, which is the moment
  // the controls were last written.
  const controlDevice = editing?.source_kind === "usb" ? editing.source : "";
  useEffect(() => {
    if (!controlDevice) {
      setControls(null);
      setControlsErr(null);
      return;
    }
    let live = true;
    setControlsErr(null);
    getCameraControls(controlDevice)
      .then((list) => live && setControls(list))
      .catch((e) => live && (setControls([]), setControlsErr(e instanceof Error ? e.message : String(e))));
    return () => {
      live = false;
    };
  }, [controlDevice, testResult]);

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
  const setControl = (key: string, value: number) =>
    setEditing((d) => (d ? { ...d, controls: { ...d.controls, [key]: value } } : d));

  // What the sensor hands over before the framing: the pinned mode, else the largest the
  // node reports. Only then can the drawer say what a crop actually costs.
  const sensorSize = editing?.source_kind === "usb" ? editing.resolution || usbSelected?.best_size || "" : "";
  const zoomedSize = editing ? framedSize(sensorSize, framingExtra(editing)) : "";
  const framingOn = Boolean(editing && (editing.flip_h || editing.flip_v || editing.rotate || editing.zoom > 1));
  // Warm-up only earns its seconds while something is still converging.
  const autoMode = Boolean(
    editing?.source_kind === "usb" &&
      (controls ?? []).some(
        (c) =>
          (c.key === "focus_automatic_continuous" || c.key === "white_balance_automatic") &&
          controlValue(editing, c) === 1,
      ),
  );

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
        extra: {
          ...framingExtra(editing),
          auth: editing.auth,
          ...(editing.source_kind === "usb" && editing.resolution
            ? { width: Number(editing.resolution.split("x")[0]), height: Number(editing.resolution.split("x")[1]) }
            : {}),
          ...(editing.source_kind === "motioneye"
            ? { camera_no: editing.camera_no, stream_port: editing.stream_port.trim() ? Number(editing.stream_port) : undefined }
            : {}),
        },
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

            <h4 className="dsc-cam-h">Framing</h4>
            <p className="dsc-muted dsc-cam-form-help">
              Applied by the brain and baked into every stored frame — the frame on disk is the record, so a flip
              that lived only in the browser would leave the timelapse and the stored pixels disagreeing with what
              you see here. Changing it re-frames the record from now on: frames already taken keep the old
              geometry, and a timelapse spanning the change will jump.
            </p>
            <label className="dsc-cam-form-toggle">
              <span>Mirror</span>
              <Toggle checked={editing.flip_h} onChange={(v) => patchDraft({ flip_h: v })} label="Flip the frame left to right" />
              <em className="dsc-muted">Left–right. Webcams built for video calls hand out a mirrored frame; a tent needs it the way the plant is.</em>
            </label>
            <label className="dsc-cam-form-toggle">
              <span>Flip vertical</span>
              <Toggle checked={editing.flip_v} onChange={(v) => patchDraft({ flip_v: v })} label="Flip the frame top to bottom" />
              <em className="dsc-muted">For a camera hanging upside down off a tent bar.</em>
            </label>
            <label>
              <span>Rotate</span>
              <select value={editing.rotate} onChange={(e) => patchDraft({ rotate: Number(e.target.value) })}>
                <option value={0}>None</option>
                <option value={90}>90° clockwise</option>
                <option value={180}>180°</option>
                <option value={270}>90° anticlockwise</option>
              </select>
            </label>
            <label>
              <span>Digital zoom</span>
              <span className="dsc-cam-form-inline">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.1}
                  value={editing.zoom}
                  aria-label="Digital zoom"
                  onChange={(e) => patchDraft({ zoom: Number(e.target.value) })}
                />
                <em className="dsc-muted">
                  {editing.zoom > 1 ? `${editing.zoom.toFixed(1)}×` : "off"}
                  {zoomedSize ? ` · stores ${zoomedSize}` : ""}
                  {editing.zoom > 1 && sensorSize ? ` of ${sensorSize.replace("x", "×")}` : ""}
                </em>
              </span>
            </label>
            {editing.zoom > 1 ? (
              <>
                <p className="dsc-muted dsc-cam-form-help">
                  A crop, not a lens — those are the only pixels kept, and nothing brings the rest back afterwards.
                  On a USB webcam, pick the largest resolution above first so the crop has something to spend.
                </p>
                <label>
                  <span>Centre ←→</span>
                  <span className="dsc-cam-form-inline">
                    <input type="range" min={0} max={100} step={1} value={editing.zoom_x} aria-label="Crop centre, horizontal" onChange={(e) => patchDraft({ zoom_x: Number(e.target.value) })} />
                    <em className="dsc-muted">{editing.zoom_x}%</em>
                  </span>
                </label>
                <label>
                  <span>Centre ↑↓</span>
                  <span className="dsc-cam-form-inline">
                    <input type="range" min={0} max={100} step={1} value={editing.zoom_y} aria-label="Crop centre, vertical" onChange={(e) => patchDraft({ zoom_y: Number(e.target.value) })} />
                    <em className="dsc-muted">{editing.zoom_y}%</em>
                  </span>
                </label>
              </>
            ) : null}
            {framingOn && editing.source_kind !== "usb" && editing.source_kind !== "rtsp" && !ffmpeg ? (
              <p className="dsc-honesty">
                This source hands the brain a finished JPEG, so a mirror, rotation or zoom needs ffmpeg to re-encode it
                (<code>apt install ffmpeg</code>). Until it is there these captures will fail rather than quietly store
                untransformed frames — half a run mirrored is worse than a gap.
              </p>
            ) : null}
            <p className="dsc-muted dsc-cam-form-help">Use <b>Test source</b> above to see the result before you save.</p>

            {editing.source_kind === "usb" ? (
              <>
                <h4 className="dsc-cam-h">Camera controls</h4>
                <p className="dsc-muted dsc-cam-form-help">
                  The webcam's own knobs, read from the device and written back before every capture — a replug
                  resets a UVC camera to its defaults, so setting them once is not enough. Only the ones you touch
                  here are written; the rest are left wherever the camera has them.
                </p>
                {controlsErr ? <p className="dsc-honesty">{controlsErr}</p> : null}
                {controls && controls.length === 0 && !controlsErr ? (
                  <p className="dsc-muted">
                    This node reports none of them. That is the usual answer when the brain container has no camera
                    mapped (<code>DSC_CAMERA_DEVICE</code> in the brain <code>.env</code>) — plug the camera in and
                    recreate the container, then reopen this drawer.
                  </p>
                ) : null}
                {CONTROL_GROUPS.map((group) => {
                  const rows = (controls ?? []).filter((c) => c.group === group.id);
                  if (!rows.length) return null;
                  return (
                    <div key={group.id} className="dsc-cam-ctrl-group">
                      <span className="dsc-cam-subfield">{group.label}</span>
                      {group.note ? <p className="dsc-muted dsc-cam-form-help">{group.note}</p> : null}
                      {rows.map((c) => {
                        const value = controlValue(editing, c);
                        const gate = c.gated_by ? (controls ?? []).find((g) => g.key === c.gated_by?.key) : undefined;
                        const gateValue = gate ? controlValue(editing, gate) : null;
                        const blocked = Boolean(c.gated_by && gate && gateValue !== c.gated_by.value);
                        const managed = editing.controls[c.key] !== undefined;
                        const note = blocked ? gateHint(c, gate) : c.help;
                        return (
                          <Fragment key={c.key}>
                          <label className={c.type === "bool" ? "dsc-cam-form-toggle" : undefined}>
                            <span>{c.label}</span>
                            {c.type === "bool" ? (
                              <Toggle
                                checked={value === 1}
                                disabled={c.read_only || blocked}
                                onChange={(v) => setControl(c.key, v ? 1 : 0)}
                                label={c.label}
                              />
                            ) : c.type === "menu" ? (
                              <select value={value ?? c.default} disabled={c.read_only || blocked} onChange={(e) => setControl(c.key, Number(e.target.value))}>
                                {c.options.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="dsc-cam-form-inline">
                                <input
                                  type="range"
                                  min={c.min}
                                  max={c.max}
                                  step={c.step || 1}
                                  value={value ?? c.default}
                                  disabled={c.read_only || blocked}
                                  aria-label={c.label}
                                  onChange={(e) => setControl(c.key, Number(e.target.value))}
                                />
                                <em className="dsc-muted">
                                  {value ?? c.default}
                                  {managed ? "" : " · on the camera"}
                                </em>
                              </span>
                            )}
                            {c.type === "bool" ? (
                              <em className="dsc-muted">{note || `${c.driver_name} · default ${c.default}`}</em>
                            ) : null}
                          </label>
                          {c.type !== "bool" && note ? <p className="dsc-muted dsc-cam-form-help">{note}</p> : null}
                          </Fragment>
                        );
                      })}
                    </div>
                  );
                })}
                {Object.keys(editing.controls).length ? (
                  <div className="dsc-row-actions">
                    <Button onClick={() => patchDraft({ controls: {} })}>Stop managing these</Button>
                    <span className="dsc-muted">
                      Leaves the camera on whatever it currently holds — it does not put the defaults back.
                    </span>
                  </div>
                ) : null}
              </>
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
            {editing.source_kind === "usb" || editing.source_kind === "rtsp" ? (
              <label>
                <span>Warm-up frames</span>
                <span className="dsc-cam-form-inline">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={editing.warmup_frames}
                    onChange={(e) => patchDraft({ warmup_frames: Math.max(0, Math.min(30, Number(e.target.value) || 0)) })}
                  />
                  <em className="dsc-muted">
                    read and thrown away before the frame that is kept · 0 = take the first one
                  </em>
                </span>
              </label>
            ) : null}
            {editing.warmup_frames === 0 && autoMode ? (
              <p className="dsc-muted dsc-cam-form-help">
                Auto exposure and auto focus do not converge on frame 1. This camera is opened cold once an interval
                and exactly one frame is kept, so with no warm-up that frame is the hunting one — try 3 to 5.
              </p>
            ) : null}
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
