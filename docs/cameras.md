# Cameras — vision for the grow spaces

DSC-HUB treats a camera as a brain-owned device bound to a zone (4×8, 2×4 or the grow
room). The brain captures **one frame per interval** (default every 10 min, lights-on
only), keeps the frames on the Pi's disk, shows the latest frame on the zone card, and
assembles timelapses with ffmpeg. Nothing streams continuously and nothing leaves the LAN.

Settings → Devices → **Cameras** (`#/settings/devices#cameras`) is the only place a
camera is configured. Every source kind is tested with **Test source** before Save so the
framing is seen first.

## Source kinds

| Kind | What the brain does | Needs |
|---|---|---|
| **USB webcam on the brain** | reads `/dev/videoN` with `ffmpeg -f v4l2` | `apt install ffmpeg` on the brain Pi |
| **HTTP snapshot URL** | GETs a URL that answers with one JPEG | nothing extra |
| **MJPEG stream URL** | opens the multipart stream, takes the first frame, hangs up | nothing extra |
| **RTSP stream** | grabs one frame with `ffmpeg -rtsp_transport tcp` | ffmpeg |
| **motionEye satellite Pi** | reads camera *N*'s motion stream port (`8080 + N`) as MJPEG | motionEye with streaming on |

Credentials (username + password, Basic or Digest for HTTP; embedded in the URL for RTSP)
are stored by the brain in its settings KV under `camera_password:<id>` and only ever
reported as *set*. They are not part of the setup-profile export.

## Recipe: an old Pi + an old webcam as a vision node

The kit's brain Pi should not spend its USB ports and CPU on cameras it can avoid. Any
spare Pi (Zero 2 W, 3, 4) with an old USB webcam or a Pi camera module becomes a
satellite that DSC-HUB reads like any IP camera:

1. Install motionEye on the spare Pi (motionEye's own install guide; Raspberry Pi OS
   Lite + `pip install motioneye` is enough, or the motionEyeOS image on older boards).
2. Open motionEye (`http://<satellite>:8765`), add the webcam as a camera. Note its
   camera number (the first camera is 1).
3. In the camera's **Video Streaming** settings: turn streaming **on**, leave the
   **Streaming Port** at `8081` for camera 1 (`8082` for camera 2 …), set **Streaming
   Authentication Mode** to *Basic* with a username/password (or *Disabled* on a
   trusted LAN), and pick a **Streaming Frame Rate** of 1–2 fps and a modest resolution —
   the brain only ever takes one frame.
4. Mount the satellite where the frame covers the tent and **will not move** — plant
   regions (next pass) are pixel regions in that fixed frame.
5. In DSC-HUB, Add camera → source kind *motionEye satellite Pi* → host or IP of the
   satellite, camera number, the streaming credentials if set → **Test source** → Save.

If motionEye's stream port is changed, put it in the **Stream port** field. If the
satellite is better reached by snapshot (motionEye's *Snapshot URL* on the Video Streaming
tab, `http://<satellite>:8765/picture/<n>/current/` when web auth is off), use the
*HTTP snapshot URL* kind with that URL instead.

Old motion-only setups (no motionEye) work the same way: motion's stream port is the
MJPEG source, so use the *MJPEG stream URL* kind with `http://<host>:8081/`.

## Recipe: a webcam on the brain Pi itself

The brain runs in the `dsc-hub-brain` container, so the webcam has to be passed through:

1. Plug it in and check the host sees it: `ls /dev/video*`. A USB webcam appears as
   `/dev/video0` (and `/dev/video1` for its metadata node); `/dev/video10` and up are the
   Pi SoC's own codec/ISP nodes and never a camera.
2. In `services/dsc-hub/.env` set `DSC_CAMERA_DEVICE=/dev/video0` (the compose file maps
   `${DSC_CAMERA_DEVICE:-/dev/null}` to the container's `/dev/video0`, so a kit without a
   webcam still starts). Recreate the container: `docker compose up -d brain`.
3. Add camera → *USB webcam on the brain*. The device list comes from
   `/sys/class/video4linux`; a webcam usually shows two nodes (`video0` capture, `video1`
   metadata) — pick the one whose Test returns a frame.

ffmpeg is installed by both brain Dockerfiles (`services/dsc-hub/brain/Dockerfile*`)
from this release on. On a container that predates that image, the hotpatch script
`.audit/cameras-pi-hotpatch.ps1` installs it into the running container's writable layer
(survives stop/start, not a recreate). The Cameras card says when it is missing.

## Cadence, gating, retention

* **Interval** 1–60 min. The brain's poller ticks every 15 s and captures when the interval
  has elapsed; **Capture now** on the zone card or the Cameras card forces one.
* **Lights on only** (default) follows the hub's photoperiod window for the zone
  (`binary_sensor.dsc_hub_4x8_window_open` / `…_2x4_window_open`). When the hub does not
  report the window the brain captures anyway and says *window unknown — captured
  anyway* in the camera's status. The grow room has no window, so the gate does not apply.
* **Keep frames** N days (0 = indefinitely) and a **storage cap** in GB. Pruning runs
  hourly, oldest day first; the latest frame and assembled timelapses are never pruned.
* Frames live under `DSC_DATA/media/camera/<id>/frames/YYYY-MM-DD/HHMMSS.jpg`,
  timelapses under `…/timelapse/`. `GET /cameras/storage` reports per-camera bytes for the
  System › Journals & storage card (S3).

## Timelapse

Assembly is snapshot-based: `ffmpeg -f concat` over the frames of a day range →
H.264 mp4 at the camera's fps (default 12) and 720 px high. **Assemble** in the viewer does
a day on demand; **Daily** assembles yesterday after midnight, **Weekly** the Mon–Sun week
that just ended. Each assembly writes a system entry to the tent's journal with the frame
count and a link.

## API

| Route | |
|---|---|
| `GET /cameras` | cameras with status + storage, source kinds, ffmpeg present, USB devices |
| `PUT /cameras/{id}` · `DELETE /cameras/{id}?delete_media=` | create/update · remove |
| `POST /cameras/test` | one frame from an unsaved spec, returned as a data URL |
| `POST /cameras/{id}/capture` | capture now |
| `GET /cameras/{id}/latest.jpg` | latest frame (`Cache-Control: no-store`) |
| `GET /cameras/{id}/days` · `/frames?day=` · `/frames/{day}/{name}` | the record |
| `POST /cameras/{id}/timelapse` · `GET /cameras/{id}/timelapses[/{name}]` | assembly |
| `GET /cameras/storage` | per-camera bytes |
| `GET /spaces` | each space now carries `cameras: [...]` for the zone card |

Demo mode never captures (cameras are LAN/USB fetches). A brain older than this route
set makes the SPA say *brain predates cameras* rather than showing an empty list.

## Not yet (plan-settings § S7, next pass)

Plant regions on the reference frame with the frame-drift check, the canopy-area derived
metric with provenance, auto journal entries with a frame attached, and the reference
markers (scale / wall line / floor grid). Those need Pillow on the brain for pixel work.
