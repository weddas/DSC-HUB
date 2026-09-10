import { useEffect, useRef, useState } from "react";
import { SettingsCard } from "./SettingRow";
import { StatusChip } from "../ui";
import {
  cancelMediaTransfer,
  fetchMediaLocations,
  fetchMediaTransfer,
  fmtBytes,
  setMediaLocation,
  startMediaTransfer,
  type MediaLocation,
  type MediaLocations,
  type MediaTransfer,
} from "../../lib/mediaStoreApi";

/** Where recordings are kept, and getting them onto a drive you can carry away.
 *
 * Two operations that read similarly and are not remotely alike:
 *
 * - **Save here** changes where NEW media is written. Nothing moves.
 * - **Copy / Move** transfers what is already on disk. Move deletes the originals.
 *
 * Move is the only thing in the whole UI that deletes a grow log, so it is confirmed
 * explicitly and never shares a button with Copy.
 */

function LocationRow({
  loc,
  busy,
  onUse,
}: {
  loc: MediaLocation;
  busy: boolean;
  onUse: (path: string) => void;
}) {
  const pct = loc.total_bytes > 0 ? Math.round(((loc.total_bytes - loc.free_bytes) / loc.total_bytes) * 100) : null;
  return (
    <div className="dsc-media-loc">
      <div className="dsc-media-loc-head">
        <code className="dsc-media-loc-path">{loc.path}</code>
        {loc.is_current ? <StatusChip label="SAVING HERE" tone="teal" /> : null}
        {loc.removable ? <StatusChip label="REMOVABLE" tone="muted" /> : null}
        {!loc.writable ? <StatusChip label="UNAVAILABLE" tone="warn" title={loc.reason} /> : null}
      </div>
      <div className="dsc-media-loc-meta">
        {loc.total_bytes > 0 ? (
          <span>
            {fmtBytes(loc.free_bytes)} free of {fmtBytes(loc.total_bytes)}
            {pct != null ? ` · ${pct}% used` : ""}
          </span>
        ) : (
          <span>size unknown</span>
        )}
        {loc.fstype ? <span> · {loc.fstype}</span> : null}
      </div>
      {/* The reason is shown, not hidden behind a tooltip: an unavailable drive is exactly
          the case where the operator needs to read what went wrong. */}
      {!loc.writable && loc.reason ? <p className="dsc-media-loc-reason">{loc.reason}</p> : null}
      <div className="dsc-media-loc-actions">
        <button type="button" disabled={busy || loc.is_current || !loc.writable} onClick={() => onUse(loc.path)}>
          {loc.is_current ? "Saving here" : "Save here"}
        </button>
      </div>
    </div>
  );
}

function TransferProgress({ job, onCancel }: { job: MediaTransfer; onCancel: () => void }) {
  const pct = job.bytes_total > 0 ? Math.round((job.bytes_done / job.bytes_total) * 100) : 0;
  return (
    <div className="dsc-media-job">
      <div className="dsc-media-job-head">
        <strong>{job.mode === "move" ? "Moving" : "Copying"}</strong>
        <code>{job.dest}</code>
        <StatusChip
          label={job.state.toUpperCase()}
          tone={job.state === "done" ? "teal" : job.state === "failed" ? "warn" : "muted"}
        />
      </div>
      {job.state === "running" ? (
        <>
          <div className="dsc-media-bar">
            <div className="dsc-media-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="dsc-muted">
            {job.files_done} of {job.files_total} files · {fmtBytes(job.bytes_done)} of {fmtBytes(job.bytes_total)}
            {job.current ? ` · ${job.current}` : ""}
          </p>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </>
      ) : null}
      {job.state === "done" ? (
        <p className="dsc-muted">
          {job.files_done} files · {fmtBytes(job.bytes_done)}
          {job.mode === "move" ? ` · ${job.deleted} originals removed` : " · originals left in place"}
        </p>
      ) : null}
      {job.state === "failed" ? <p className="dsc-media-loc-reason">{job.error}</p> : null}
      {job.state === "cancelled" ? (
        <p className="dsc-muted">Cancelled. Whatever had already copied is on the drive; nothing was deleted.</p>
      ) : null}
    </div>
  );
}

export function MediaStorageCard() {
  const [data, setData] = useState<MediaLocations | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [job, setJob] = useState<MediaTransfer | null>(null);
  const [waiting, setWaiting] = useState(false);
  const pollRef = useRef<number | null>(null);

  const load = () =>
    fetchMediaLocations()
      .then((r) => {
        setData(r);
        setError(null);
        return r;
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "could not read the save locations");
        return null;
      });

  useEffect(() => {
    void load();
  }, []);

  // While waiting for a drive, re-read locations so one appears as soon as it is mounted.
  useEffect(() => {
    if (!waiting) return;
    const id = window.setInterval(() => {
      void load().then((r) => {
        if (r && r.locations.some((l) => l.removable && l.writable)) setWaiting(false);
      });
    }, 2000);
    return () => window.clearInterval(id);
  }, [waiting]);

  // Follow a running transfer to completion.
  useEffect(() => {
    if (!job || job.state !== "running") return;
    pollRef.current = window.setInterval(() => {
      fetchMediaTransfer(job.job_id)
        .then((j) => {
          setJob(j);
          if (j.state !== "running") void load();
        })
        .catch(() => undefined);
    }, 1000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [job?.job_id, job?.state]);

  const use = async (path: string) => {
    setBusy(true);
    setError(null);
    try {
      await setMediaLocation(path);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "could not change the save location");
    } finally {
      setBusy(false);
    }
  };

  const transfer = async (dest: string, mode: "copy" | "move") => {
    if (mode === "move") {
      const ok = window.confirm(
        `Move every recording to ${dest}?\n\n` +
          "Each file is copied first and only deleted once the copy is confirmed complete. " +
          "New recordings keep saving to the current location.",
      );
      if (!ok) return;
    }
    setBusy(true);
    setError(null);
    try {
      setJob(await startMediaTransfer(dest, mode));
    } catch (e) {
      setError(e instanceof Error ? e.message : "could not start the transfer");
    } finally {
      setBusy(false);
    }
  };

  const externals = (data?.locations ?? []).filter((l) => l.removable);
  const internals = (data?.locations ?? []).filter((l) => !l.removable);

  return (
    <SettingsCard
      id="media-storage"
      title="Recording storage"
      icon="system"
      intro="Where camera frames, timelapses and journal photos are saved — and how to get them onto a drive you can take away."
      loadState={data ? "ready" : error ? "error" : "loading"}
      loadError={error ?? undefined}
    >
      {error && data ? <p className="dsc-media-loc-reason">{error}</p> : null}

      <h4 className="dsc-media-h">On this machine</h4>
      {internals.map((l) => (
        <LocationRow key={l.path} loc={l} busy={busy} onUse={use} />
      ))}

      <h4 className="dsc-media-h">Removable drives</h4>
      {!data?.external_visible ? (
        // Not the same as "no drive plugged in", and the fix is different, so say which.
        <p className="dsc-muted">
          The brain cannot see removable drives at all. It runs in a container, and no drive mount point has been
          passed into it — until that is done, inserting a drive will not make it appear here.
        </p>
      ) : externals.length ? (
        externals.map((l) => (
          <LocationRow key={l.path} loc={l} busy={busy} onUse={use} />
        ))
      ) : (
        <p className="dsc-muted">
          {waiting ? "Waiting for a drive… insert a USB stick or SD card now." : "No removable drive is mounted."}
        </p>
      )}

      <div className="dsc-media-loc-actions">
        <button type="button" onClick={() => setWaiting((w) => !w)} disabled={!data?.external_visible}>
          {waiting ? "Stop waiting" : "Insert a drive…"}
        </button>
      </div>

      <h4 className="dsc-media-h">Copy or move existing recordings</h4>
      {externals.filter((l) => l.writable).length ? (
        externals
          .filter((l) => l.writable)
          .map((l) => (
            <div key={l.path} className="dsc-media-loc">
              <code className="dsc-media-loc-path">{l.path}</code>
              <div className="dsc-media-loc-actions">
                <button type="button" disabled={busy || job?.state === "running"} onClick={() => void transfer(l.path, "copy")}>
                  Copy here
                </button>
                {/* Deliberately separate from Copy. This one deletes. */}
                <button type="button" disabled={busy || job?.state === "running"} onClick={() => void transfer(l.path, "move")}>
                  Move here
                </button>
              </div>
            </div>
          ))
      ) : (
        <p className="dsc-muted">Mount a drive to copy or move recordings onto it.</p>
      )}

      {job ? <TransferProgress job={job} onCancel={() => void cancelMediaTransfer(job.job_id).catch(() => undefined)} /> : null}

      <p className="dsc-muted dsc-cam-form-help">
        Moving is an offload: recordings keep saving to the current location either way, so removing the drive can
        never interrupt capture.
      </p>
    </SettingsCard>
  );
}
