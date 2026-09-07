import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlideDrawer } from "./chrome";
import { Button, Icon, StatusTag } from "./ui";
import { usePreference } from "../hooks/usePreference";
import { useCameraFastPoll, useSpaceCameras } from "../hooks/useCameras";
import { paths } from "../lib/paths";
import {
  CAMERAS_PREDATE,
  assembleTimelapse,
  captureCamera,
  formatAgo,
  formatBytes,
  frameUrl,
  getCameraDays,
  getCameraFrames,
  getCameraTimelapses,
  latestFrameUrl,
  timelapseUrl,
  type CameraDay,
  type CameraFrame,
  type CameraRecord,
  type CameraTimelapse,
} from "../lib/camerasApi";

/**
 * The camera slot on a zone card (plan-settings § S7): a live thumbnail per bound camera
 * that refreshes on the operator's cadence and opens the viewer; a dashed `CAMERA —` tag
 * with the "possible with …" hint when nothing is bound. Never a sample frame.
 */

type Freshness = { tone: "ok" | "warn" | "bad" | "muted"; text: string; title: string };

function freshness(cam: CameraRecord, now: number): Freshness {
  const st = cam.status;
  if (!cam.enabled) return { tone: "muted", text: "DISABLED", title: "Capture is off for this camera — enable it in Settings › Devices › Cameras" };
  if (!cam.has_latest) {
    if (st.last_error) return { tone: "bad", text: "NO FRAME", title: st.last_error };
    return { tone: "muted", text: "NO FRAME YET", title: "The brain has not captured a frame yet — first one lands within one interval" };
  }
  const age = now - (cam.latest_at ?? 0);
  const paused = st.skipped_reason === "lights off";
  if (st.last_error) return { tone: "bad", text: `HELD · ${formatAgo(cam.latest_at, now).toUpperCase()}`, title: `Last capture failed: ${st.last_error}. Showing the last good frame.` };
  if (paused) return { tone: "muted", text: `LIGHTS OFF · ${formatAgo(cam.latest_at, now).toUpperCase()}`, title: "Lights-on only — capture pauses while the zone's photoperiod window is closed" };
  if (age > cam.interval_s * 2.5) return { tone: "warn", text: `STALE · ${formatAgo(cam.latest_at, now).toUpperCase()}`, title: "Older than two capture intervals" };
  return { tone: "ok", text: formatAgo(cam.latest_at, now).toUpperCase(), title: `Captured ${formatAgo(cam.latest_at, now)} · every ${Math.round(cam.interval_s / 60)} min` };
}

function useNowSeconds(everyMs: number): number {
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now() / 1000), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
}

export function CameraThumb({ camera, onOpen, compact = false }: { camera: CameraRecord; onOpen?: () => void; compact?: boolean }) {
  const [refreshS] = usePreference("cameraThumbRefreshS");
  const [tick, setTick] = useState(() => Date.now() / 1000);
  useEffect(() => {
    if (!camera.has_latest || refreshS <= 0) return;
    const id = window.setInterval(() => setTick(Date.now() / 1000), Math.max(5, refreshS) * 1000);
    return () => window.clearInterval(id);
  }, [camera.has_latest, refreshS]);
  const now = useNowSeconds(15_000);
  const fresh = freshness(camera, now);
  // The URL changes when the brain reports a newer frame, or on the browser cadence.
  const src = latestFrameUrl(camera.camera_id, Math.max(camera.latest_at ?? 0, tick));
  const body = camera.has_latest ? (
    <img src={src} alt={`${camera.label} — latest frame`} loading="lazy" decoding="async" />
  ) : (
    <div className="dsc-cam-thumb-empty">
      <Icon name="camera-monitor" size={18} />
    </div>
  );
  return (
    <button type="button" className={`dsc-cam-thumb${compact ? " is-compact" : ""} is-${fresh.tone}`} onClick={onOpen} title={fresh.title}>
      {body}
      <span className="dsc-cam-thumb-cap">
        <b>{camera.label.toUpperCase()}</b>
        <span>{fresh.text}</span>
      </span>
    </button>
  );
}

export function CameraSlot({ spaceId, zoneLabel }: { spaceId: string; zoneLabel: string }) {
  const { cameras, predates, loaded } = useSpaceCameras(spaceId);
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  if (!loaded) return null;
  if (predates || cameras.length === 0) {
    return (
      <div className="dsc-cam-slot is-empty">
        <StatusTag
          icon="camera-monitor"
          label="CAMERA —"
          tone="muted"
          dashed
          title={predates ? CAMERAS_PREDATE : `Possible with an IP camera, a USB webcam on the brain, or a motionEye Pi bound to the ${zoneLabel}`}
          onClick={() => navigate(paths.settings("devices", "cameras"))}
        />
        <span className="dsc-cam-hint">{predates ? "brain predates cameras" : "possible with a camera bound to this tent"}</span>
      </div>
    );
  }
  const open = cameras.find((c) => c.camera_id === openId) ?? null;
  return (
    <div className="dsc-cam-slot">
      {cameras.map((c) => (
        <CameraThumb key={c.camera_id} camera={c} onOpen={() => setOpenId(c.camera_id)} />
      ))}
      <CameraViewer camera={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

/** Full view: latest frame, capture now, day strip, assembled timelapses. */
export function CameraViewer({ camera, onClose }: { camera: CameraRecord | null; onClose: () => void }) {
  const navigate = useNavigate();
  const open = camera != null;
  useCameraFastPoll(open, 10_000);
  const now = useNowSeconds(5_000);
  const [days, setDays] = useState<CameraDay[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [frames, setFrames] = useState<CameraFrame[]>([]);
  const [selected, setSelected] = useState<CameraFrame | null>(null);
  const [timelapses, setTimelapses] = useState<CameraTimelapse[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [captureMsg, setCaptureMsg] = useState<string | null>(null);
  const [assembling, setAssembling] = useState(false);
  const [assembleMsg, setAssembleMsg] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const id = camera?.camera_id ?? null;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setSelected(null);
    setCaptureMsg(null);
    setAssembleMsg(null);
    Promise.all([getCameraDays(id), getCameraTimelapses(id)])
      .then(([d, t]) => {
        if (cancelled) return;
        setDays(d);
        setTimelapses(t);
        setDay((cur) => cur && d.some((x) => x.day === cur) ? cur : d.length ? d[d.length - 1].day : null);
        setLoadErr(null);
      })
      .catch((e) => !cancelled && setLoadErr(e instanceof Error ? e.message : String(e)));
    return () => {
      cancelled = true;
    };
  }, [id, camera?.status.frames]);

  useEffect(() => {
    if (!id || !day) {
      setFrames([]);
      return;
    }
    let cancelled = false;
    getCameraFrames(id, day, 300)
      .then((f) => !cancelled && setFrames(f))
      .catch(() => !cancelled && setFrames([]));
    return () => {
      cancelled = true;
    };
  }, [id, day, camera?.status.frames]);

  const nextIn = useMemo(() => {
    if (!camera || !camera.enabled) return null;
    const last = camera.status.last_attempt_at;
    if (last == null) return "next capture on the next tick";
    if (camera.status.skipped_reason === "lights off") return "paused — lights off";
    const s = last + camera.interval_s - now;
    if (s <= 0) return "next capture on the next tick";
    return s < 90 ? `next capture in ${Math.round(s)} s` : `next capture in ${Math.round(s / 60)} min`;
  }, [camera, now]);

  if (!camera) {
    return (
      <SlideDrawer open={false} onClose={onClose} title="Camera" wide>
        <div />
      </SlideDrawer>
    );
  }

  const mainSrc = selected ? frameUrl(camera.camera_id, selected.name) : latestFrameUrl(camera.camera_id, camera.latest_at);
  const fresh = freshness(camera, now);

  const doCapture = async () => {
    setCapturing(true);
    setCaptureMsg(null);
    try {
      const res = await captureCamera(camera.camera_id);
      setCaptureMsg(res.ok ? "frame captured" : res.error ?? "capture failed");
      setSelected(null);
    } catch (e) {
      setCaptureMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setCapturing(false);
    }
  };

  const doAssemble = async () => {
    if (!day) return;
    setAssembling(true);
    setAssembleMsg(null);
    try {
      const tl = await assembleTimelapse(camera.camera_id, { day_from: day, day_to: day, fps: camera.extra.fps ?? 12 });
      setTimelapses(await getCameraTimelapses(camera.camera_id));
      setAssembleMsg(`assembled ${tl.frames ?? "?"} frames → ${tl.seconds ?? "?"} s`);
    } catch (e) {
      setAssembleMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setAssembling(false);
    }
  };

  return (
    <SlideDrawer open={open} onClose={onClose} title={camera.label} wide>
      <div className="dsc-cam-viewer">
        <div className={`dsc-cam-viewer-main is-${fresh.tone}`}>
          {camera.has_latest || selected ? (
            <img src={mainSrc} alt={selected ? `${camera.label} at ${new Date(selected.at * 1000).toLocaleString()}` : `${camera.label} — latest frame`} />
          ) : (
            <div className="dsc-cam-thumb-empty">
              <Icon name="camera-monitor" size={28} />
              <span>{fresh.text}</span>
            </div>
          )}
          <div className="dsc-cam-viewer-cap">
            <StatusTag label={selected ? new Date(selected.at * 1000).toLocaleString() : `LATEST · ${fresh.text}`} tone={selected ? "teal" : fresh.tone} title={fresh.title} />
            {selected ? <StatusTag label="BACK TO LATEST" tone="muted" onClick={() => setSelected(null)} /> : null}
          </div>
        </div>
        <dl className="dsc-cam-meta">
          <dt>Source</dt>
          <dd>{camera.kind_label}</dd>
          <dt>Frame</dt>
          <dd>{camera.status.width && camera.status.height ? `${camera.status.width} × ${camera.status.height} · ${formatBytes(camera.status.last_bytes)}` : "—"}</dd>
          <dt>Cadence</dt>
          <dd>
            every {Math.round(camera.interval_s / 60)} min{camera.lights_on_only ? ", lights on only" : ""}
            {nextIn ? ` · ${nextIn}` : ""}
          </dd>
          <dt>Record</dt>
          <dd>
            {camera.storage.frames} frames · {formatBytes(camera.storage.frame_bytes)}
            {camera.keep_days > 0 ? ` · kept ${camera.keep_days} d` : " · kept indefinitely"}
            {camera.cap_gb > 0 ? ` · cap ${camera.cap_gb} GB` : ""}
          </dd>
        </dl>
        {camera.status.last_error ? <p className="dsc-honesty">Last capture failed: {camera.status.last_error}</p> : null}
        <p className="dsc-muted dsc-cam-fixed">Fixed mount: the frame must not move — plant regions are pixel regions in this frame.</p>
        <div className="dsc-row-actions">
          <Button primary onClick={doCapture} busy={capturing} icon="camera-monitor">
            Capture now
          </Button>
          <Button onClick={() => navigate(paths.settings("devices", "cameras"))} icon="settings-gear">
            Camera settings
          </Button>
          {captureMsg ? <span className="dsc-muted">{captureMsg}</span> : null}
        </div>

        <h4 className="dsc-cam-h">Frames</h4>
        {loadErr ? <p className="dsc-honesty">{loadErr}</p> : null}
        {days.length ? (
          <>
            <div className="dsc-chip-row">
              {days.map((d) => (
                <button key={d.day} type="button" className={`dsc-chip${d.day === day ? " dsc-chip--ok" : ""}`} onClick={() => setDay(d.day)} title={`${d.frames} frames · ${formatBytes(d.bytes)}`}>
                  {d.day} · {d.frames}
                </button>
              ))}
            </div>
            <div className="dsc-cam-strip" role="list">
              {frames.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  role="listitem"
                  className={`dsc-cam-strip-item${selected?.name === f.name ? " is-selected" : ""}`}
                  onClick={() => setSelected(f)}
                  title={new Date(f.at * 1000).toLocaleString()}
                  aria-label={`Show frame from ${new Date(f.at * 1000).toLocaleString()}`}
                  aria-pressed={selected?.name === f.name}
                >
                  <img src={frameUrl(camera.camera_id, f.name)} alt="" loading="lazy" decoding="async" />
                  <span>{new Date(f.at * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="dsc-muted">No frames on disk yet.</p>
        )}

        <h4 className="dsc-cam-h">Timelapse</h4>
        <div className="dsc-row-actions">
          <Button onClick={doAssemble} busy={assembling} disabled={!day || (days.find((d) => d.day === day)?.frames ?? 0) < 2}>
            Assemble {day ?? "day"}
          </Button>
          {assembleMsg ? <span className="dsc-muted">{assembleMsg}</span> : null}
        </div>
        {timelapses.length ? (
          <ul className="dsc-cam-tl">
            {timelapses.map((t) => (
              <li key={t.name}>
                <a href={timelapseUrl(camera.camera_id, t.name)} target="_blank" rel="noreferrer">
                  {t.name}
                </a>
                <span className="dsc-muted">
                  {t.frames != null ? `${t.frames} frames · ` : ""}
                  {t.seconds != null ? `${t.seconds} s · ` : ""}
                  {formatBytes(t.bytes)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dsc-muted">None assembled yet. Daily or weekly assembly is set per camera in Settings.</p>
        )}
      </div>
    </SlideDrawer>
  );
}
