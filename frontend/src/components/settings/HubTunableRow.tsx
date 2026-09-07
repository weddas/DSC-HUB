import { useEffect, useState, type ReactNode } from "react";
import { DecisionLayer } from "../DecisionLayer";
import { Button } from "../ui";
import { SettingRow, Stated, Toggle } from "./SettingRow";
import { useHubTunables } from "../../hooks/useHubTunables";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { useFleetEntity } from "../../hooks/useFleetEntity";
import { useFleetActions } from "../../hooks/useFleetActions";
import type { HubTunable } from "../../lib/hubTunablesApi";

/**
 * A hub-owned setting as a SettingRow (tier H). The value the operator edits is the
 * brain's *desired* value; the row shows the hub's echo and the sync state:
 * SYNCED · PENDING · HELD (hub offline, queued) · HUB DIFFERS (adopt / push) · FAILED.
 * Rows whose change moves an appliance or the lamp at once (`actuates`) confirm first.
 */

function ago(ts: number | null | undefined): string {
  if (!ts) return "";
  const s = Math.max(0, Math.round(Date.now() / 1000 - ts));
  if (s < 60) return `${s} s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

function sourceText(row: HubTunable): string {
  if (!row.source) return "";
  const when = ago(row.updated_at);
  if (row.source === "adopted") return `adopted from the hub${when ? ` ${when}` : ""}`;
  if (row.source.startsWith("stage:")) return `stage preset ${row.source.slice(6)}${when ? ` · ${when}` : ""}`;
  return `set ${when || "just now"} (${row.source})`;
}

function fmt(v: string | null | undefined, unit?: string): string {
  if (v == null || v === "") return "—";
  return unit ? `${v} ${unit}` : v;
}

export function HubTunableRow({
  entityId,
  label,
  description,
  advanced,
  forceShow,
  consumers,
}: {
  entityId: string;
  label?: ReactNode;
  description?: ReactNode;
  advanced?: boolean;
  forceShow?: boolean;
  consumers?: { label: string; href: string }[];
}) {
  const { byId, data, set, adopt, push } = useHubTunables();
  const row = byId[entityId];
  const save = useSaveState();
  const [draft, setDraft] = useState<string>("");
  const [confirm, setConfirm] = useState<string | number | boolean | null>(null);
  const [acting, setActing] = useState<"adopt" | "push" | null>(null);

  const desired = row?.desired ?? "";
  useEffect(() => setDraft(desired), [desired]);

  if (!row) return null;

  const write = (value: string | number | boolean) => {
    if (row.actuates) {
      setConfirm(value);
      return;
    }
    void save.run(() => set(entityId, value));
  };

  const disabled = row.state === "missing" || !row.present;
  let control: ReactNode;
  if (row.state === "missing") {
    control = <Stated>not in this firmware</Stated>;
  } else if (row.kind === "number") {
    control = (
      <>
        <input
          type="number"
          min={row.min}
          max={row.max}
          step={row.step}
          value={draft}
          disabled={disabled}
          aria-label={typeof label === "string" ? label : row.label}
          aria-invalid={save.state === "failed" || row.state === "failed" ? true : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft !== desired && draft !== "") write(Number(draft));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />
        {row.unit ? <span className="dsc-setting-value">{row.unit}</span> : null}
      </>
    );
  } else if (row.kind === "select") {
    control = (
      <select
        value={desired}
        disabled={disabled}
        aria-label={typeof label === "string" ? label : row.label}
        onChange={(e) => write(e.target.value)}
      >
        {(row.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        {desired && !(row.options ?? []).includes(desired) ? <option value={desired}>{desired}</option> : null}
      </select>
    );
  } else {
    control = <Toggle checked={desired === "on"} disabled={disabled} label={row.label} onChange={(next) => write(next)} />;
  }

  // Sync state → row state text.
  let state: "saved" | "pending" | "failed" | "held" | null = null;
  let stateText: string | undefined;
  if (save.state === "pending") {
    state = "pending";
    stateText = "writing";
  } else if (save.state === "failed") {
    state = "failed";
    stateText = save.text;
  } else if (row.state === "synced") {
    state = "saved";
    stateText = "synced";
  } else if (row.state === "pending") {
    state = "pending";
    stateText = `pending · hub still ${fmt(row.hub, row.unit)}`;
  } else if (row.state === "held") {
    state = "held";
    stateText = "held · hub offline, push queued";
  } else if (row.state === "differs") {
    state = "failed";
    stateText = `hub differs · hub ${fmt(row.hub, row.unit)}`;
  } else if (row.state === "failed") {
    state = "failed";
    stateText = row.last_error || "push failed";
  }

  const differsActions =
    row.state === "differs" ? (
      <>
        <Button
          variant="secondary"
          disabled={acting != null}
          onClick={() => {
            setActing("adopt");
            void save.run(() => adopt(entityId)).finally(() => setActing(null));
          }}
        >
          Adopt hub value
        </Button>
        <span title={data?.blocked ? "Manual takeover or a reconnect override is holding pushes" : undefined}>
          <Button
            disabled={acting != null || data?.blocked}
            onClick={() => {
              setActing("push");
              void save.run(() => push(entityId)).finally(() => setActing(null));
            }}
          >
            Push brain value
          </Button>
        </span>
      </>
    ) : null;

  const desc = (
    <>
      {description ?? row.description}
      {row.oos ? (
        <>
          {" "}
          <Stated>on hold · {row.oos}</Stated>
        </>
      ) : null}
    </>
  );

  return (
    <>
      <SettingRow
        id={`hub-${entityId.split(".")[1]}`}
        label={label ?? row.label}
        description={desc}
        scope="hub"
        changedAt={sourceText(row)}
        state={state}
        stateText={stateText}
        advanced={advanced}
        forceShow={forceShow}
        consumers={consumers}
        control={
          <>
            {control}
            {differsActions}
          </>
        }
      />
      <DecisionLayer
        open={confirm != null}
        onDismiss={() => {
          setConfirm(null);
          setDraft(desired);
        }}
        onConfirm={() => {
          const v = confirm;
          setConfirm(null);
          if (v != null) void save.run(() => set(entityId, v));
        }}
        title={`Change ${row.label} on the hub`}
        confirmLabel="Write to hub"
        help={null}
      >
        <p>
          The hub acts on this at once — an appliance or the lamp can move.{" "}
          {row.hub != null ? (
            <>
              Hub now: <b>{fmt(row.hub, row.unit)}</b> → <b>{fmt(String(confirm ?? ""), row.unit)}</b>.
            </>
          ) : null}
        </p>
        {data?.blocked ? (
          <p className="dsc-honesty">Manual takeover or a reconnect override is holding pushes — the value is stored and pushes when it clears.</p>
        ) : null}
      </DecisionLayer>
    </>
  );
}

/** Rows for a list of hub tunables (a Settings group). */
export function HubTunableRows({
  ids,
  advanced,
  forceShow,
}: {
  ids: string[];
  advanced?: boolean;
  forceShow?: boolean;
}) {
  return (
    <>
      {ids.map((id) => (
        <HubTunableRow key={id} entityId={id} advanced={advanced} forceShow={forceShow} />
      ))}
    </>
  );
}

/**
 * A brain-held panel helper (`input_number.*`, tier N) as a SettingRow — the trust thresholds
 * the panel firmware once owned now live in the brain's helper store and reach the SPA as
 * computed states; unset helpers fall back to the brain's own default.
 */
export function HelperNumberRow({
  entityId,
  label,
  description,
  fallback,
  unit,
  step = 0.1,
  min,
  max,
  advanced,
  forceShow,
  consumers,
}: {
  entityId: string;
  label: string;
  description?: ReactNode;
  fallback: number;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  advanced?: boolean;
  forceShow?: boolean;
  consumers?: { label: string; href: string }[];
}) {
  const { state, available } = useFleetEntity(entityId);
  const { callService } = useFleetActions();
  const save = useSaveState();
  const live = available && Number.isFinite(Number(state)) ? Number(state) : fallback;
  const [draft, setDraft] = useState(String(live));
  useEffect(() => setDraft(String(live)), [live]);
  const commit = () => {
    const n = Number(draft);
    if (!Number.isFinite(n) || n === live) return;
    void save.run(() => callService("input_number", "set_value", { entity_id: entityId, value: n }));
  };
  return (
    <SettingRow
      id={`helper-${entityId.split(".")[1]}`}
      label={label}
      description={description}
      scope="brain"
      defaultLabel={unit ? `${fallback} ${unit}` : String(fallback)}
      isDefault={live === fallback}
      onReset={() => void save.run(() => callService("input_number", "set_value", { entity_id: entityId, value: fallback }))}
      state={save.state}
      stateText={save.text}
      advanced={advanced}
      forceShow={forceShow}
      consumers={consumers}
      control={
        <>
          <input
            type="number"
            step={step}
            min={min}
            max={max}
            value={draft}
            aria-label={label}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          {unit ? <span className="dsc-setting-value">{unit}</span> : null}
        </>
      }
    />
  );
}
