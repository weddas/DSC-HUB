import { useEffect, useState, type ReactNode } from "react";
import { DecisionLayer } from "../DecisionLayer";
import { Button } from "../ui";
import { SettingRow, Stated, Toggle } from "./SettingRow";
import { useHubTunables } from "../../hooks/useHubTunables";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { paths } from "../../lib/paths";
import {
  defaultLabelOf,
  helpersOf,
  patchHelperTunable,
  resetHelperTunable,
  resetHubTunable,
  type HelperTunable,
  type HubTunableWithDefault,
} from "./tunableDefaultsApi";
import type { HubTunable } from "../../lib/hubTunablesApi";

/**
 * A hub-owned setting as a SettingRow (tier H). The value the operator edits is the
 * brain's *desired* value; the row shows the hub's echo and the sync state:
 * SYNCED · PENDING · HELD (hub offline, queued) · HUB DIFFERS (adopt / push) · FAILED.
 * Rows whose change moves an appliance or the lamp at once (`actuates`) confirm first.
 *
 * The row also carries what the plan asks of every setting: the owner (scope badge), the
 * firmware's own power-on value as the stated default, and a one-click reset back to it.
 * A reset is an ordinary desired write — same validation, same push, same sync state — so
 * an actuating row confirms before a reset just as it does before an edit. When the brain
 * states no default for a row (unknown, or one the running firmware would reject), the row
 * shows no default chip and no reset rather than inventing one.
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

/** Where a hub row takes effect, when the caller has nothing more specific to say. */
const SECTION_CONSUMERS: Record<string, { label: string; href: string }[]> = {
  climate: [{ label: "Climate", href: `#${paths.climate()}` }],
  light: [{ label: "Light", href: `#${paths.light()}` }],
  root: [{ label: "Root", href: `#${paths.root()}` }],
};

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
  const { byId, data, set, adopt, push, refresh } = useHubTunables();
  const row = byId[entityId] as HubTunableWithDefault | undefined;
  const save = useSaveState();
  const [draft, setDraft] = useState<string>("");
  const [confirm, setConfirm] = useState<{ value: string | number | boolean } | { reset: true } | null>(null);
  const [acting, setActing] = useState<"adopt" | "push" | null>(null);

  const desired = row?.desired ?? "";
  useEffect(() => setDraft(desired), [desired]);

  if (!row) return null;

  const write = (value: string | number | boolean) => {
    if (row.actuates) {
      setConfirm({ value });
      return;
    }
    void save.run(() => set(entityId, value));
  };

  const doReset = () =>
    void save.run(async () => {
      await resetHubTunable(entityId);
      await refresh();
    });

  const resetDefault = () => {
    if (row.actuates) {
      setConfirm({ reset: true });
      return;
    }
    doReset();
  };

  const defaultLabel = defaultLabelOf(row);
  // `is_default` is null when there is nothing to compare against; SettingRow only offers
  // the reset when it is explicitly false, so an unknown never renders a misleading action.
  const isDefault = defaultLabel == null ? undefined : (row.is_default ?? undefined);
  const confirmValue = confirm && "value" in confirm ? confirm.value : confirm ? (row.default ?? "") : "";

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
        defaultLabel={defaultLabel}
        isDefault={isDefault}
        onReset={defaultLabel != null && !disabled ? resetDefault : undefined}
        changedAt={sourceText(row)}
        state={state}
        stateText={stateText}
        advanced={advanced}
        forceShow={forceShow}
        consumers={consumers ?? SECTION_CONSUMERS[row.section]}
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
          const c = confirm;
          setConfirm(null);
          if (c == null) return;
          if ("reset" in c) doReset();
          else void save.run(() => set(entityId, c.value));
        }}
        title={confirm && "reset" in confirm ? `Reset ${row.label} to the firmware default` : `Change ${row.label} on the hub`}
        confirmLabel={confirm && "reset" in confirm ? "Reset on hub" : "Write to hub"}
        help={null}
      >
        <p>
          The hub acts on this at once — an appliance or the lamp can move.{" "}
          {row.hub != null ? (
            <>
              Hub now: <b>{fmt(row.hub, row.unit)}</b> → <b>{fmt(String(confirmValue), row.unit)}</b>.
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
 * A brain-held helper (`input_number.*`, tier N) as a SettingRow.
 *
 * These are the sensor-trust thresholds the panel firmware once owned. They used to be
 * edited by calling the entity-service proxy with `input_number.set_value` — an
 * entity-inspector write with no range check, no stated default and no journal line. They
 * are settings, so they now take the same brain-owned path as a hub tunable: the brain's
 * registry states the range and the default (the very fallback its consumer uses when the
 * helper is unset), validates the write and journals it. The rows ride the hub-tunables
 * snapshot, so there is one poll for the whole surface.
 */
export function HelperTunableRow({
  row,
  onSaved,
  advanced,
  forceShow,
  consumers,
}: {
  row: HelperTunable;
  onSaved: () => void;
  advanced?: boolean;
  forceShow?: boolean;
  consumers?: { label: string; href: string }[];
}) {
  const save = useSaveState();
  const [draft, setDraft] = useState(String(row.value));
  useEffect(() => setDraft(String(row.value)), [row.value]);
  const commit = () => {
    const n = Number(draft);
    if (!Number.isFinite(n) || n === row.value) return;
    void save.run(async () => {
      await patchHelperTunable(row.entity_id, n);
      onSaved();
    });
  };
  return (
    <SettingRow
      id={`helper-${row.entity_id.split(".")[1]}`}
      label={row.label}
      description={
        <>
          {row.description}
          {row.stored ? null : (
            <>
              {" "}
              <Stated>unset — the brain's own value is what runs</Stated>
            </>
          )}
        </>
      }
      scope="brain"
      defaultLabel={row.unit ? `${row.default} ${row.unit}` : String(row.default)}
      isDefault={row.is_default}
      onReset={() =>
        void save.run(async () => {
          await resetHelperTunable(row.entity_id);
          onSaved();
        })
      }
      state={save.state}
      stateText={save.text}
      advanced={advanced}
      forceShow={forceShow}
      consumers={consumers}
      control={
        <>
          <input
            type="number"
            step={row.step}
            min={row.min}
            max={row.max}
            value={draft}
            aria-label={row.label}
            aria-invalid={save.state === "failed" ? true : undefined}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          {row.unit ? <span className="dsc-setting-value">{row.unit}</span> : null}
        </>
      }
    />
  );
}

/** Every brain-held helper in one Settings group, in the brain's own order. */
export function HelperTunableRows({ group }: { group: string }) {
  const { data, state, refresh } = useHubTunables();
  const helpers = helpersOf(data);
  if (helpers == null && state === "loading") return null;
  if (helpers == null) {
    return (
      <SettingRow
        id={`helper-group-${group}`}
        label="Thresholds"
        scope="brain"
        description="This brain predates brain-owned thresholds — hotpatch it to edit them here instead of through the entity inspector."
        control={<Stated>not served by this brain</Stated>}
      />
    );
  }
  return (
    <>
      {helpers
        .filter((h) => h.group === group)
        .map((h) => (
          <HelperTunableRow key={h.entity_id} row={h} onSaved={() => void refresh()} />
        ))}
    </>
  );
}
