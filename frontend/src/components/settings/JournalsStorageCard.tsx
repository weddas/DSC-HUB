import { useEffect, useState } from "react";
import { Button } from "../ui";
import { DecisionLayer } from "../DecisionLayer";
import { SettingRow, SettingsCard, Stated } from "./SettingRow";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { formatStamp } from "../../lib/units";
import { paths } from "../../lib/paths";
import {
  archiveExportHref,
  createArchive,
  getArchives,
  getJournalStorage,
  journalExportHref,
  journalsBundleHref,
  patchJournalRetention,
  type ArchiveHeader,
  type JournalStorage,
  type RetentionResult,
} from "../../lib/journalStorageApi";

function bytes(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function age(ts: number | null | undefined): string {
  if (!ts) return "—";
  const d = Math.floor((Date.now() / 1000 - ts) / 86400);
  return d < 1 ? "today" : `${d} d`;
}

function RetentionRow({
  j,
  onPreview,
  onSaved,
}: {
  j: JournalStorage["journals"][number];
  onPreview: (kind: string, days: number, preview: RetentionResult) => void;
  onSaved: (r: RetentionResult) => void;
}) {
  const save = useSaveState();
  const [draft, setDraft] = useState(String(j.retention_days));
  useEffect(() => setDraft(String(j.retention_days)), [j.retention_days]);
  const commit = () => {
    const n = Math.max(0, Math.min(3650, Math.round(Number(draft) || 0)));
    if (n === j.retention_days) return;
    void save.run(async () => {
      const r = await patchJournalRetention({ [j.kind]: n }, false);
      if (!r.stored) onPreview(j.kind, n, r);
      else onSaved(r);
    });
  };
  return (
    <SettingRow
      id={`journal-${j.kind}`}
      label={j.label}
      description={
        <>
          {j.description} {j.present ? `${j.rows.toLocaleString()} entries · oldest ${age(j.oldest_ts)} · ~${bytes(j.share_bytes)}` : "no table yet"}
          {j.archived_plants ? ` · ${j.archived_plants} archived plant${j.archived_plants === 1 ? "" : "s"} immune to retention` : ""}
        </>
      }
      scope="brain"
      defaultLabel="0 = keep forever"
      isDefault={j.retention_days === 0}
      onReset={() => void save.run(async () => onSaved(await patchJournalRetention({ [j.kind]: 0 }, true)))}
      state={save.state}
      stateText={save.text}
      control={
        <>
          <input
            type="number"
            min={0}
            max={3650}
            step={1}
            value={draft}
            aria-label={`${j.label} retention in days`}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          <span className="dsc-setting-value">days</span>
          <a className="dsc-chip" href={journalExportHref(j.kind, undefined, "json")} download>
            JSON
          </a>
          <a className="dsc-chip" href={journalExportHref(j.kind, undefined, "csv")} download>
            CSV
          </a>
        </>
      }
    />
  );
}

/**
 * Settings › System › Journals & storage (plan-settings S3, operator decision 6):
 * database size + free space, one row per journal with retention (0 = forever), rows,
 * oldest entry, estimated share of the file and downloads; a retention cut previews what
 * it would delete and offers the download first; the archive list with grow-record bundles.
 */
export function JournalsStorageCard() {
  const [data, setData] = useState<JournalStorage | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState<{ kind: string; days: number; preview: RetentionResult } | null>(null);
  const [archives, setArchives] = useState<ArchiveHeader[]>([]);
  const [archiveMsg, setArchiveMsg] = useState("");
  const confirmSave = useSaveState();

  const load = async () => {
    try {
      setData(await getJournalStorage());
      setState("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
    }
    try {
      setArchives((await getArchives()).archives);
    } catch {
      setArchives([]);
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const affectedKinds = pending ? [pending.kind] : [];
  const used = data ? data.total_bytes - data.free_bytes : 0;

  return (
    <>
      <SettingsCard
        id="journals"
        title="Journals & storage"
        icon="journal"
        intro={
          data
            ? `Database ${bytes(data.db_bytes)} · card ${bytes(used)} used of ${bytes(data.total_bytes)} (${bytes(data.free_bytes)} free). ${data.estimate_note}`
            : "Every journal the brain keeps, with its retention and size."
        }
        loadState={state}
        loadError={error}
        actions={
          <>
            <a className="dsc-btn dsc-btn-secondary" href={journalsBundleHref()} download>
              Download every journal (zip)
            </a>
            <Button variant="secondary" onClick={() => void load()}>
              Refresh sizes
            </Button>
          </>
        }
      >
        {data ? (
          <div className="dsc-storage-bar" role="img" aria-label="Storage share by journal">
            {[...data.journals.map((j) => ({ k: j.kind, b: j.share_bytes, l: j.label })), { k: "fleet", b: data.fleet_history.share_bytes, l: "Fleet history" }, { k: "archive", b: data.archive.share_bytes, l: "Archive" }]
              .filter((s) => s.b > 0)
              .map((s) => (
                <span key={s.k} className={`dsc-storage-seg dsc-storage-seg--${s.k}`} style={{ flexGrow: s.b }} title={`${s.l} ~${bytes(s.b)}`} />
              ))}
          </div>
        ) : null}
        {data?.journals.map((j) => (
          <RetentionRow key={j.kind} j={j} onPreview={(kind, days, preview) => setPending({ kind, days, preview })} onSaved={(r) => r.stats && setData(r.stats)} />
        ))}
        {data ? (
          <SettingRow
            id="journal-fleet-history"
            label="Fleet history"
            description={`Every numeric reading per seat per poll — ${data.fleet_history.rows.toLocaleString()} rows · oldest ${age(data.fleet_history.oldest_ts)} · ~${bytes(data.fleet_history.share_bytes)}. Its retention lives with the logs above.`}
            scope="brain"
            control={<Stated>{data.fleet_history.retention_days === 0 ? "kept forever" : `${data.fleet_history.retention_days} days`}</Stated>}
            consumers={[{ label: "Storage", href: `#${paths.settings("system", "storage")}` }]}
          />
        ) : null}
      </SettingsCard>

      <SettingsCard
        id="archive"
        title="Grow records"
        icon="harvest-tote"
        intro="A plant's whole journal plus its tent's entries for the run, frozen when the plant is retired or harvested. Immune to retention; download as one bundle."
        actions={
          <>
            <ArchiveNowControl onDone={async (msg) => {
              setArchiveMsg(msg);
              await load();
            }} />
            {archiveMsg ? <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>{archiveMsg}</span> : null}
          </>
        }
      >
        {archives.length ? (
          archives.map((a) => (
            <SettingRow
              key={a.id}
              id={`archive-${a.id}`}
              label={`${a.nickname || a.strain || a.plant_id}${a.strain && a.nickname ? ` · ${a.strain}` : ""}`}
              description={`${a.reason} ${formatStamp(a.archived_at * 1000)} · ${a.entry_count} entries · ${a.tent_entry_count} tent entries${a.tent ? ` · ${a.tent}` : ""}${a.sprout_date ? ` · sprouted ${a.sprout_date}` : ""}`}
              scope="brain"
              control={
                <>
                  <a className="dsc-chip" href={archiveExportHref(a.id, "zip")} download>
                    Bundle
                  </a>
                  <a className="dsc-chip" href={archiveExportHref(a.id, "json")} download>
                    JSON
                  </a>
                  <a className="dsc-chip" href={archiveExportHref(a.id, "csv")} download>
                    CSV
                  </a>
                </>
              }
            />
          ))
        ) : (
          <p className="dsc-muted">No grow records yet — retiring or harvesting a plant writes the first one.</p>
        )}
      </SettingsCard>

      <DecisionLayer
        open={pending != null}
        busy={confirmSave.state === "pending"}
        onDismiss={() => setPending(null)}
        onConfirm={() => {
          const p = pending;
          if (!p) return;
          void confirmSave.run(async () => {
            const r = await patchJournalRetention({ [p.kind]: p.days }, true);
            if (r.stats) setData(r.stats);
            setPending(null);
          });
        }}
        title={`Keep ${pending?.days} days of ${data?.journals.find((j) => j.kind === pending?.kind)?.label ?? pending?.kind}?`}
        confirmLabel="Delete without download"
        help={null}
      >
        <p>
          This deletes <b>{pending?.preview.would_delete.toLocaleString()}</b> entries older than{" "}
          {pending?.preview.previews[0]?.cutoff_ts ? formatStamp(pending.preview.previews[0].cutoff_ts * 1000) : "the cutoff"}
          {pending?.preview.previews[0]?.oldest_ts ? ` (oldest ${formatStamp(pending.preview.previews[0].oldest_ts * 1000)})` : ""}. Archived
          grow records are never touched. Nothing is deleted until you confirm.
        </p>
        <p>
          <a className="dsc-btn dsc-btn-primary" href={journalsBundleHref(affectedKinds)} download>
            Download first (zip)
          </a>
        </p>
        {confirmSave.state === "failed" ? <p className="dsc-honesty">{confirmSave.text}</p> : null}
      </DecisionLayer>
    </>
  );
}

function ArchiveNowControl({ onDone }: { onDone: (msg: string) => Promise<void> }) {
  const [plantId, setPlantId] = useState("");
  const save = useSaveState();
  return (
    <span className="dsc-row-actions" style={{ alignItems: "center" }}>
      <input
        type="text"
        value={plantId}
        placeholder="plant:<uuid> to archive now"
        aria-label="Plant id to archive"
        style={{ minWidth: 220 }}
        onChange={(e) => setPlantId(e.target.value)}
      />
      <Button
        variant="secondary"
        disabled={!plantId.trim() || save.state === "pending"}
        onClick={() =>
          void save.run(async () => {
            const a = await createArchive(plantId.trim(), "manual");
            setPlantId("");
            await onDone(`Archived ${a.nickname || a.plant_id}: ${a.entry_count} entries`);
          })
        }
      >
        Archive now
      </Button>
      {save.state === "failed" ? <span className="dsc-honesty">{save.text}</span> : null}
    </span>
  );
}
