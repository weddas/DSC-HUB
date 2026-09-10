# Camera storage: save location, external transfer, and a readable tree

**Date:** 2026-09-10
**Status:** planned
**Operator decisions (2026-09-10):** readable folder names frozen at creation; one media root
covering *all* media; a Move to external is an offload only — recording stays put.

---

## What is being asked for

1. **Choose where media is saved** — OS drive, SD card, USB drive.
2. **Copy or Move existing recordings to an external drive** — prompt for the drive, then
   transfer the whole media folder.
3. **Lay each camera's frames out as `zone/name/ddmmyyHHMM.ext`.**

---

## Starting position (checked on the live Pi, 2026-09-10)

* **Zero frames on disk.** One camera registered (`tent_4x8_cam`, zone `4x8`). So the new
  tree is not a migration — it can simply be the layout. This is the cheapest this change
  will ever be.
* The Pi boots from a **465 GB disk, 388 GB free**. There is **no SD card and no removable
  device attached**, so "nothing inserted yet" is the normal state the UI must handle.
* `/` has **shared** mount propagation, so a bind-mount of `/media` into the brain container
  will see drives mounted *after* the container started.
* `udisks2` is enabled but **inactive** — headless, no logged-in seat. **An inserted stick
  will not mount itself.** Something has to mount it.

---

## Three places the spec will bite

These are worth deciding now; each is a one-line change if caught early and a migration if
caught late.

### 1. `ddmmyyHHMM` does not sort chronologically

`1009261430` is 10 Sep 2026; `1108261430` is 11 Aug 2026. Sorted by name in any file
browser, **August lands after September**. The entire point of this tree is browsing the
stick on a laptop, and that is exactly where the mis-sort shows up.

`yymmddHHMM` — `2609101430` — sorts correctly, is the same length, and is equally readable
once you know the shape. **Building `ddmmyyHHMM` as asked**, with the format isolated in one
constant (`FRAME_STAMP_FMT`) so switching is a single edit.

### 2. A flat folder per camera gets very large

At the default 10-minute interval one camera writes **144 frames/day ≈ 4,400/month**. A year
is **~53,000 files in one directory**. That is slow to open on any filesystem and genuinely
bad on **FAT32**, which is what most USB sticks are formatted as.

`zone/name/ddmmyy/HHMM.ext` — one extra level — keeps directories at 144 entries and still
reads well. **Building the flat version as asked**, with the day level available as a small
change to `frame_relpath()`.

### 3. The tree lives under `media/camera/`, not directly under `media/`

The operator picked a preview showing `media/<zone>/<name>/`. Journal photos also live under
the media root (`media/journal/…`), so a zone folder directly at the root could collide with
one. Frames go under **`media/camera/<zone>/<name>/<stamp>.jpg`** — from the camera root
down the tree is exactly `zone/name/file` as specified, with no collision risk.

---

## Design

### Folder names, frozen at creation

`upsert_camera` computes two sanitised segments **on INSERT only** and stores them on the
row (`extra.zone_dir`, `extra.name_dir`). Renaming a camera afterwards leaves them alone, so
existing recordings never move and history never breaks.

Sanitising targets **FAT32**, because these folders are meant to be read on a stick:
`< > : " / \ | ? *` and control characters out, trailing dots and spaces trimmed, reserved
DOS names (`CON`, `NUL`, `COM1`…) suffixed, length capped, empty result falls back to the id.

```
media/camera/4x8 tent/4x8 corner/1009261430.jpg
                                 latest.jpg
                                 timelapse/*.mp4
```

### Day is derived, not stored

Removing the `frames/<YYYY-MM-DD>/` level means `list_days`, `list_frames`, `prune_frames`
and timelapse range selection can no longer read the day off a directory. They parse it back
out of the filename instead. One helper, `parse_frame_stamp()`, is the only place that knows
the format — the same constant as `FRAME_STAMP_FMT`.

Collisions (two captures in the same minute — the interval makes this rare, but *Capture
now* can do it) get a `-2`, `-3` suffix rather than overwriting.

### Media root as a setting

`paths.media_root()` gains a settings-backed override, read per call with a deferred import
of `settings` (`settings` imports `paths`, so a top-level import would cycle). Falls back to
`DSC_DATA/media` when unset, so nothing changes for existing installs or tests.

### Locations the brain can actually see

`GET /media/locations` lists candidate roots **that the brain can see and write to** — never
a device it merely knows exists. For each: path, label, filesystem, total/free bytes,
whether it is removable, whether it is the current root, and whether it is writable. A path
the brain cannot write is listed with the reason rather than hidden, so "why isn't my stick
here" has an answer on screen.

### Transfer as a job, not a request

Copying tens of GB cannot happen inside an HTTP request. `POST /media/transfer` starts a
background job (`copy` or `move`) and returns an id; `GET /media/transfer/<id>` reports
files done, bytes done, current file, and the outcome.

**Move is copy-then-verify-then-delete**, never `os.rename` across devices and never a
delete that is not preceded by a confirmed byte-for-byte-sized copy. A half-moved grow log
is worse than a failed move.

Recording continues at the current root throughout — the operator's decision, and it means
pulling the stick out mid-transfer cannot interrupt capture.

---

## Host-side work (a live change; needs its own approval)

Neither of these is code, and both touch the running rig:

1. **Compose bind mount** — `/media:/media:rslave` on the brain, so the container sees
   drives mounted on the host after it started. Requires a container recreate.
2. **Automount** — a udev rule invoking `systemd-mount --automount=yes` for USB block devices
   with a filesystem. Without it the operator must mount the stick by hand, and the
   "insert a drive" prompt will wait forever.

Until (1) lands, the location picker will correctly show only the internal drive — which is
honest, and is what it should show.

---

## Test plan

* Sanitising: FAT32-illegal characters, reserved DOS names, unicode, empty, over-long.
* Frozen names: rename a camera, existing frames stay put and new frames join them.
* Stamp round-trip: `parse_frame_stamp(format(ts)) == ts` to the minute; collision suffixes.
* Day derivation: `list_days` / `list_frames` / `prune_frames` agree with a known file set.
* Retention: prune deletes by parsed date with no day directories present.
* Transfer: copy leaves the source intact; move deletes only after a verified copy; a
  mid-transfer failure leaves the source complete.
* Locations: a non-writable candidate is listed with its reason, not dropped.
