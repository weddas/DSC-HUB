import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui";
import { HelpTip } from "../HelpTip";
import { StatusChip } from "../ui";
import { SettingsTable, SettingsRow, SettingsSubRow, InlineEditCell, ActionsCell } from "./SettingsTable";
import {
  get_automation_targets,
  get_automations,
  get_zigbee_actuatable,
  put_automations,
  type AutomationCondition,
  type AutomationRule,
  type AutomationTargets,
} from "../../lib/fleetApi";

const SLUG_RE = /^[a-z][a-z0-9_]{1,47}$/;
const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MAX_CONDITIONS = 8;
const NUMERIC_OPS = new Set(["gt", "lt", "gte", "lte"]);

const OP_LABELS: Record<string, string> = {
  gt: "> ",
  lt: "< ",
  gte: "≥ ",
  lte: "≤ ",
  eq: "is",
  ne: "is not",
  is: "is (on/off)",
  is_not: "is not (on/off)",
};

/** Raw fleet ids first, then computed ids the brain derives (CFM, alerts, need summaries). */
const ENTITY_SUGGESTIONS = [
  "sensor.dsc_hub_tent_temperature",
  "sensor.dsc_hub_tent_humidity",
  "sensor.dsc_hub_vpd_kpa",
  "sensor.dsc_hub_clone_temperature",
  "sensor.dsc_hub_clone_humidity",
  "sensor.dsc_hub_clone_vpd_kpa",
  "sensor.dsc_hub_room_temperature",
  "sensor.dsc_hub_room_humidity",
  "sensor.dsc_probe1_soil_moisture",
  "sensor.dsc_probe2_soil_moisture",
  "binary_sensor.dsc_hub_link",
  "binary_sensor.dsc_hub_4x8_window_open",
  "binary_sensor.dsc_hub_2x4_window_open",
  "switch.dsc_hub_manual_takeover",
  "select.dsc_hub_clone_mode",
  "sensor.dsc_cfm_exhaust_out",
  "sensor.dsc_cfm_intake_main",
  "sensor.dsc_active_alert_count",
  "sensor.dsc_leaf_vpd_kpa",
];

const inputStyle = { width: 72 } as const;
const fieldRow = { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" } as const;
const blockStyle = { display: "grid", gap: 6, padding: "6px 0" } as const;

function blankCondition(): AutomationCondition {
  return { entity_id: "sensor.dsc_hub_tent_temperature", op: "gt", value: 32 };
}

function blankRule(n: number): AutomationRule {
  return {
    id: `rule_${n}`,
    name: `Rule ${n}`,
    enabled: false,
    trigger: { all: [blankCondition()] },
    window: null,
    debounce_s: 0,
    release_s: 0,
    action: { type: "banner", params: { text: "", tone: "warn" } },
  };
}

function conditionsOf(r: AutomationRule): AutomationCondition[] {
  return (r.trigger.all ?? r.trigger.any ?? []) as AutomationCondition[];
}

function groupMode(r: AutomationRule): "all" | "any" {
  return r.trigger.any ? "any" : "all";
}

function withConditions(r: AutomationRule, mode: "all" | "any", conds: AutomationCondition[]): AutomationRule {
  return { ...r, trigger: mode === "any" ? { any: conds } : { all: conds } };
}

function hasTimestamp(entityId: string, agePrefixes: string[]): boolean {
  return agePrefixes.some((p) => entityId === p || entityId.startsWith(p));
}

function numOrUndef(v: unknown): number | undefined {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function condSummary(c: AutomationCondition): string {
  const short = String(c.entity_id).replace(/^(sensor|binary_sensor|switch|select|number)\.dsc_(hub_)?/, "");
  const op = OP_LABELS[String(c.op)] ?? c.op;
  const hyst = c.hysteresis ? ` ±${c.hysteresis}` : "";
  const age = c.max_age_s ? ` (≤${c.max_age_s}s old)` : "";
  return `${short} ${op}${String(c.value)}${hyst}${age}`.replace(/\s+/g, " ").trim();
}

function whenSummary(r: AutomationRule): string {
  const conds = conditionsOf(r);
  const head = conds.length > 1 ? `${groupMode(r)} of ${conds.length}: ` : "";
  const parts = [head + conds.map(condSummary).join(conds.length > 1 ? " · " : "")];
  if (r.window?.start && r.window?.end) parts.push(`${r.window.start}–${r.window.end}`);
  if (r.debounce_s) parts.push(`hold ${r.debounce_s}s`);
  if (r.release_s) parts.push(`release ${r.release_s}s`);
  return parts.join(" · ");
}

function thenSummary(r: AutomationRule, targets: AutomationTargets | null): string {
  const p = r.action.params;
  switch (r.action.type) {
    case "banner":
      return `Banner (${String(p.tone ?? "warn")}): ${String(p.text ?? "")}`;
    case "oos_seat":
      return `Seat ${String(p.seat_id ?? "—")} out of service`;
    case "zigbee_switch":
      return `Zigbee ${String(p.friendly_name ?? "—")} ${p.on_when_firing === false ? "OFF" : "ON"} while firing`;
    case "relay": {
      const t = targets?.relays.find((x) => x.entity_id === p.entity_id);
      return `${t?.label ?? String(p.entity_id ?? "—")} ${p.on_when_firing ? "ON" : "OFF"} while firing, restored on clear`;
    }
    case "setpoint": {
      const t = targets?.setpoints.find((x) => x.entity_id === p.entity_id);
      return `${t?.label ?? String(p.entity_id ?? "—")} → ${String(p.value ?? "—")}${t?.unit ?? ""}${
        p.restore_on_clear === false ? "" : ", restored on clear"
      }`;
    }
    default:
      return String(r.action.type);
  }
}

function ruleInvalid(r: AutomationRule, targets: AutomationTargets | null): string | null {
  if (!SLUG_RE.test(r.id)) return "id must be a lowercase slug";
  const conds = conditionsOf(r);
  if (!conds.length) return "needs at least one condition";
  for (const c of conds) {
    if (!String(c.entity_id).includes(".")) return "condition needs a domain.object entity id";
    if (NUMERIC_OPS.has(String(c.op)) && !Number.isFinite(Number(c.value))) return "numeric compare needs a number";
    if (c.max_age_s != null && c.max_age_s !== undefined && Number(c.max_age_s) <= 0) return "max age must be > 0 s";
  }
  const w = r.window;
  if (w && (w.start || w.end)) {
    if (!HHMM_RE.test(w.start) || !HHMM_RE.test(w.end)) return "window needs HH:MM start and end";
    if (w.start === w.end) return "window start and end must differ";
  }
  const p = r.action.params;
  switch (r.action.type) {
    case "banner":
      return String(p.text ?? "").trim() ? null : "banner needs text";
    case "oos_seat":
      return String(p.seat_id ?? "").trim() ? null : "pick a seat";
    case "zigbee_switch":
      return String(p.friendly_name ?? "").trim() ? null : "pick a Zigbee device";
    case "relay": {
      const t = targets?.relays.find((x) => x.entity_id === p.entity_id);
      if (!t) return "pick an allowed relay";
      if (t.cutout_only && p.on_when_firing) return `${t.label} can only be held OFF`;
      return null;
    }
    case "setpoint": {
      const t = targets?.setpoints.find((x) => x.entity_id === p.entity_id);
      if (!t) return "pick an allowed setpoint";
      return Number.isFinite(Number(p.value)) ? null : "setpoint needs a number";
    }
    default:
      return "unknown action";
  }
}

/**
 * Operator automation rules (v2). Trigger group (all/any) → one action, on the
 * shared settings-table primitive. Each rule has a collapsed summary row and an
 * expandable editor. Rules are off until armed; the engine is edge-triggered and
 * fails closed on stale / offline / missing inputs. Relay and setpoint actions
 * are limited to server allow-lists (loop-owned outputs are never offered).
 */
export function AutomationRulesCard({ seats }: { seats: string[] }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");
  const [nextN, setNextN] = useState(1);
  const [zbSwitches, setZbSwitches] = useState<string[]>([]);
  const [targets, setTargets] = useState<AutomationTargets | null>(null);
  const [targetsErr, setTargetsErr] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  /** Rules removed since the last save — restorable with Undo until Save commits. */
  const [removed, setRemoved] = useState<AutomationRule[]>([]);

  useEffect(() => {
    void get_zigbee_actuatable()
      .then((r) => setZbSwitches((r.devices ?? []).map((d) => d.friendly_name).filter(Boolean)))
      .catch(() => undefined);
    void get_automation_targets()
      .then(setTargets)
      .catch(() => setTargetsErr(true));
  }, []);

  const load = () => {
    void get_automations()
      .then((r) => {
        setRules(r.rules ?? []);
        setRemoved([]);
        setDirty(false);
        setNextN((r.rules?.length ?? 0) + 1);
      })
      .catch(() => undefined);
  };
  useEffect(load, []);

  const removeRule = (i: number) => {
    const gone = rules[i];
    if (!gone) return;
    setRules((prev) => prev.filter((_, j) => j !== i));
    setRemoved((prev) => [...prev, gone]);
    setDirty(true);
  };

  const undoRemove = (id: string) => {
    const back = removed.find((r) => r.id === id);
    if (!back) return;
    setRemoved((prev) => prev.filter((r) => r.id !== id));
    setRules((prev) => (prev.some((r) => r.id === id) ? prev : [...prev, back]));
    setDirty(true);
  };

  const agePrefixes = targets?.age_prefixes ?? [];
  // Static well-known ids first, then whatever bound Zigbee devices currently export
  // (CO₂, lux, contact, power …) so a trigger can name any live datapoint.
  const entitySuggestions = useMemo(() => {
    const seen = new Set<string>(ENTITY_SUGGESTIONS);
    const live = (targets?.entities ?? []).map((e) => e.entity_id).filter((id) => !seen.has(id));
    return [...ENTITY_SUGGESTIONS, ...live];
  }, [targets]);
  const relayTargets = targets?.relays ?? [];
  const setpointTargets = targets?.setpoints ?? [];

  const patch = (i: number, fn: (r: AutomationRule) => AutomationRule) => {
    setRules((prev) => prev.map((r, j) => (j === i ? fn(r) : r)));
    setDirty(true);
  };

  const patchCond = (i: number, ci: number, fn: (c: AutomationCondition) => AutomationCondition) =>
    patch(i, (r) =>
      withConditions(
        r,
        groupMode(r),
        conditionsOf(r).map((c, k) => (k === ci ? fn(c) : c)),
      ),
    );

  const addCondition = (i: number) =>
    patch(i, (r) => withConditions(r, groupMode(r), [...conditionsOf(r), blankCondition()]));

  const removeCondition = (i: number, ci: number) =>
    patch(i, (r) => withConditions(r, groupMode(r), conditionsOf(r).filter((_, k) => k !== ci)));

  const setActionType = (i: number, type: string) =>
    patch(i, (r) => {
      const firstRelay = relayTargets[0];
      const firstSp = setpointTargets[0];
      switch (type) {
        case "zigbee_switch":
          return { ...r, action: { type, params: { friendly_name: zbSwitches[0] ?? "", on_when_firing: true } } };
        case "oos_seat":
          return { ...r, action: { type, params: { seat_id: seats[0] ?? "", banner: "" } } };
        case "relay":
          return {
            ...r,
            action: {
              type,
              params: { entity_id: firstRelay?.entity_id ?? "", on_when_firing: firstRelay ? !firstRelay.cutout_only : false },
            },
          };
        case "setpoint":
          return {
            ...r,
            action: { type, params: { entity_id: firstSp?.entity_id ?? "", value: firstSp?.min ?? 0, restore_on_clear: true } },
          };
        default:
          return { ...r, action: { type: "banner", params: { text: "", tone: "warn" } } };
      }
    });

  const setActionParam = (i: number, k: string, v: unknown) =>
    patch(i, (r) => ({ ...r, action: { ...r.action, params: { ...r.action.params, [k]: v } } }));

  const toggleOpen = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addRule = () => {
    const r = blankRule(nextN);
    setRules((prev) => [...prev, r]);
    setOpen((prev) => new Set(prev).add(r.id));
    setNextN((n) => n + 1);
    setDirty(true);
  };

  const save = async () => {
    try {
      const cleaned: AutomationRule[] = rules.map((r) => {
        const mode = groupMode(r);
        const conds = conditionsOf(r).map((c) => {
          const numeric = NUMERIC_OPS.has(String(c.op));
          const out: AutomationCondition = {
            entity_id: String(c.entity_id).trim(),
            op: c.op,
            value: numeric ? Number(c.value) : String(c.value),
          };
          const h = numOrUndef(c.hysteresis);
          if (numeric && h && h > 0) out.hysteresis = h;
          const a = numOrUndef(c.max_age_s);
          if (a && a > 0) out.max_age_s = a;
          return out;
        });
        const w = r.window && r.window.start && r.window.end ? { start: r.window.start, end: r.window.end } : null;
        const params = { ...r.action.params };
        if (r.action.type === "setpoint") params.value = Number(params.value);
        return {
          ...withConditions(r, mode, conds),
          window: w,
          debounce_s: numOrUndef(r.debounce_s) ?? 0,
          release_s: numOrUndef(r.release_s) ?? 0,
          action: { ...r.action, params },
        };
      });
      const r = await put_automations(cleaned);
      setRules(r.rules ?? []);
      setRemoved([]);
      setDirty(false);
      setMsg(`Saved ${r.rules?.length ?? 0} rule${(r.rules?.length ?? 0) === 1 ? "" : "s"}.`);
    } catch (e) {
      setMsg(String((e as Error).message || e));
    }
  };

  const problems = useMemo(() => rules.map((r) => ruleInvalid(r, targets)), [rules, targets]);
  const invalid = problems.some((p) => p !== null);
  const COLS = 5;

  return (
    <section className="dsc-card" hidden={false}>
      <h3 className="dsc-card-title">
        Automations
        <HelpTip title="Automation rules">
          <p>
            When fleet or computed readings match a condition group (<b>all</b> / <b>any</b>), do one thing: raise a
            banner, take a seat out of service, switch a Zigbee plug, hold an allowed hub switch or appliance relay,
            or move a hub setpoint. Rules are <b>off</b> until you arm them, act once on the edge (not
            continuously), and <b>fail closed</b> — an offline hub, a missing or non-numeric reading, or a reading
            older than its max age never fires one.
          </p>
          <p>
            <b>Hold for</b> makes a condition persist before firing; <b>release after</b> keeps the effect until
            it has been clear that long. <b>±</b> hysteresis latches a numeric compare until the value crosses back
            by that margin. An optional time window (local time, may wrap midnight) gates the whole rule.
          </p>
          <p>
            Relay and setpoint rules capture the previous state when they fire and restore it on clear. They can
            only target the server allow-list: operator-owned hub switches, and appliance relays as{" "}
            <b>cut-out only</b> (held OFF with the seat out of service; the climate loop takes the relay back on
            clear). Loop-driven outputs — demand switches, fans, lights — are never offered. Setpoints are clamped
            to the hub's own min/max; 2x4 setpoints are skipped while Climate Mode is Follow Plants.
          </p>
        </HelpTip>
      </h3>

      <datalist id="dsc-automation-entities">
        {entitySuggestions.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>

      <SettingsTable
        columns={[
          { key: "name", label: "Name" },
          { key: "when", label: "When" },
          { key: "then", label: "Then" },
          { key: "status", label: "Status", tight: true },
          { key: "act", label: "", tight: true },
        ]}
        caption={rules.length ? `${rules.length} rule${rules.length === 1 ? "" : "s"}` : "No rules yet"}
      >
        {rules.map((r, i) => {
          const conds = conditionsOf(r);
          const mode = groupMode(r);
          const isOpen = open.has(r.id);
          const problem = problems[i];
          const relayTarget = relayTargets.find((t) => t.entity_id === r.action.params.entity_id);
          const spTarget = setpointTargets.find((t) => t.entity_id === r.action.params.entity_id);
          return [
            <SettingsRow key={r.id} tone={r.enabled ? undefined : "muted"}>
              <InlineEditCell
                value={r.name}
                ariaLabel={`Rename ${r.name}`}
                onCommit={(next) => patch(i, (x) => ({ ...x, name: next }))}
                secondary={<code>{r.id}</code>}
              />
              <td>{whenSummary(r)}</td>
              <td>
                {thenSummary(r, targets)}
                {r.last_error ? (
                  <div className="dsc-honesty" style={{ marginTop: 2 }}>
                    {r.last_error}
                  </div>
                ) : null}
              </td>
              <td className="is-tight">
                {r.firing ? (
                  <StatusChip label={r.releasing ? "RELEASING" : "FIRING"} tone="bad" />
                ) : r.pending ? (
                  <StatusChip label="HOLDING" tone="warn" />
                ) : r.enabled ? (
                  <StatusChip label="ARMED" tone="ok" />
                ) : (
                  <StatusChip label="OFF" tone="muted" />
                )}
              </td>
              <ActionsCell>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--dsc-fs-sm)" }}>
                  <input
                    type="checkbox"
                    checked={r.enabled}
                    onChange={(e) => patch(i, (x) => ({ ...x, enabled: e.target.checked }))}
                  />
                  arm
                </label>
                <Button variant="secondary" onClick={() => toggleOpen(r.id)}>
                  {isOpen ? "Done" : "Edit"}
                </Button>
                <Button variant="secondary" onClick={() => removeRule(i)}>
                  Remove
                </Button>
              </ActionsCell>
            </SettingsRow>,
            isOpen ? (
              <SettingsSubRow key={`${r.id}-edit`} colSpan={COLS}>
                <div style={blockStyle}>
                  <div style={fieldRow}>
                    <span>When</span>
                    <select
                      aria-label="Match all or any condition"
                      value={mode}
                      onChange={(e) => patch(i, (x) => withConditions(x, e.target.value as "all" | "any", conditionsOf(x)))}
                    >
                      <option value="all">all of</option>
                      <option value="any">any of</option>
                    </select>
                    <span>these hold:</span>
                  </div>
                  {conds.map((c, ci) => {
                    const numeric = NUMERIC_OPS.has(String(c.op));
                    const stamped = hasTimestamp(String(c.entity_id), agePrefixes);
                    const ageSet = c.max_age_s != null && c.max_age_s !== undefined && String(c.max_age_s) !== "";
                    return (
                      <div key={ci} style={{ ...fieldRow, paddingLeft: 12 }}>
                        <input
                          list="dsc-automation-entities"
                          aria-label={`Condition ${ci + 1} entity`}
                          value={c.entity_id}
                          style={{ minWidth: 200 }}
                          onChange={(e) => patchCond(i, ci, (x) => ({ ...x, entity_id: e.target.value }))}
                        />
                        <select
                          aria-label={`Condition ${ci + 1} operator`}
                          value={String(c.op)}
                          onChange={(e) =>
                            patchCond(i, ci, (x) => ({
                              ...x,
                              op: e.target.value,
                              hysteresis: NUMERIC_OPS.has(e.target.value) ? x.hysteresis : undefined,
                            }))
                          }
                        >
                          {Object.entries(OP_LABELS).map(([k, lbl]) => (
                            <option key={k} value={k}>
                              {lbl}
                            </option>
                          ))}
                        </select>
                        <input
                          aria-label={`Condition ${ci + 1} value`}
                          value={String(c.value)}
                          style={inputStyle}
                          onChange={(e) => patchCond(i, ci, (x) => ({ ...x, value: e.target.value }))}
                        />
                        {numeric ? (
                          <label style={fieldRow} title="Hysteresis: once firing, stay firing until the value crosses back by this margin">
                            ±
                            <input
                              type="number"
                              min={0}
                              step="any"
                              aria-label={`Condition ${ci + 1} hysteresis`}
                              placeholder="0"
                              value={c.hysteresis ?? ""}
                              style={{ width: 56 }}
                              onChange={(e) =>
                                patchCond(i, ci, (x) => ({ ...x, hysteresis: e.target.value === "" ? undefined : Number(e.target.value) }))
                              }
                            />
                          </label>
                        ) : null}
                        <label style={fieldRow} title="Max age: the reading must be newer than this, by its device's last-seen">
                          max age
                          <input
                            type="number"
                            min={1}
                            step={1}
                            aria-label={`Condition ${ci + 1} max age seconds`}
                            placeholder="—"
                            value={c.max_age_s ?? ""}
                            style={{ width: 64 }}
                            onChange={(e) =>
                              patchCond(i, ci, (x) => ({ ...x, max_age_s: e.target.value === "" ? undefined : Number(e.target.value) }))
                            }
                          />
                          s
                        </label>
                        {conds.length > 1 ? (
                          <Button variant="secondary" onClick={() => removeCondition(i, ci)}>
                            Remove
                          </Button>
                        ) : null}
                        {ageSet && targets && !stamped ? (
                          <span className="dsc-honesty">
                            No device timestamp for this entity (computed values have none) — with a max age it can never pass.
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                  <div style={{ ...fieldRow, paddingLeft: 12 }}>
                    <Button variant="secondary" disabled={conds.length >= MAX_CONDITIONS} onClick={() => addCondition(i)}>
                      Add condition
                    </Button>
                    {conds.length >= MAX_CONDITIONS ? <span className="dsc-honesty">Max {MAX_CONDITIONS} conditions.</span> : null}
                  </div>

                  <div style={fieldRow}>
                    <span>Only between</span>
                    <input
                      type="time"
                      aria-label="Window start"
                      value={r.window?.start ?? ""}
                      onChange={(e) => patch(i, (x) => ({ ...x, window: { start: e.target.value, end: x.window?.end ?? "" } }))}
                    />
                    <span>and</span>
                    <input
                      type="time"
                      aria-label="Window end"
                      value={r.window?.end ?? ""}
                      onChange={(e) => patch(i, (x) => ({ ...x, window: { start: x.window?.start ?? "", end: e.target.value } }))}
                    />
                    {r.window?.start || r.window?.end ? (
                      <Button variant="secondary" onClick={() => patch(i, (x) => ({ ...x, window: null }))}>
                        Always
                      </Button>
                    ) : (
                      <span className="dsc-honesty">blank = always; end before start wraps past midnight</span>
                    )}
                  </div>

                  <div style={fieldRow}>
                    <label style={fieldRow}>
                      Hold for
                      <input
                        type="number"
                        min={0}
                        step={1}
                        aria-label="Debounce seconds"
                        value={r.debounce_s ?? 0}
                        style={inputStyle}
                        onChange={(e) => patch(i, (x) => ({ ...x, debounce_s: Number(e.target.value) }))}
                      />
                      s before firing
                    </label>
                    <label style={fieldRow}>
                      Release after
                      <input
                        type="number"
                        min={0}
                        step={1}
                        aria-label="Release seconds"
                        value={r.release_s ?? 0}
                        style={inputStyle}
                        onChange={(e) => patch(i, (x) => ({ ...x, release_s: Number(e.target.value) }))}
                      />
                      s clear
                    </label>
                  </div>

                  <div style={fieldRow}>
                    <span>Then</span>
                    <select aria-label="Action type" value={r.action.type} onChange={(e) => setActionType(i, e.target.value)}>
                      <option value="banner">Raise banner</option>
                      <option value="oos_seat">Seat out of service</option>
                      <option value="zigbee_switch" disabled={zbSwitches.length === 0}>
                        Zigbee switch {zbSwitches.length === 0 ? "(none bound)" : ""}
                      </option>
                      <option value="relay" disabled={relayTargets.length === 0}>
                        Hold relay / hub switch {targetsErr ? "(targets unavailable)" : ""}
                      </option>
                      <option value="setpoint" disabled={setpointTargets.length === 0}>
                        Move setpoint {targetsErr ? "(targets unavailable)" : ""}
                      </option>
                    </select>
                    {r.action.type === "banner" ? (
                      <>
                        <input
                          placeholder="Banner text"
                          aria-label="Banner text"
                          value={String(r.action.params.text ?? "")}
                          style={{ minWidth: 200 }}
                          onChange={(e) => setActionParam(i, "text", e.target.value)}
                        />
                        <select
                          aria-label="Banner tone"
                          value={String(r.action.params.tone ?? "warn")}
                          onChange={(e) => setActionParam(i, "tone", e.target.value)}
                        >
                          <option value="info">info</option>
                          <option value="warn">warn</option>
                          <option value="critical">critical</option>
                        </select>
                      </>
                    ) : r.action.type === "zigbee_switch" ? (
                      <>
                        <select
                          aria-label="Zigbee device"
                          value={String(r.action.params.friendly_name ?? "")}
                          onChange={(e) => setActionParam(i, "friendly_name", e.target.value)}
                        >
                          <option value="">— device —</option>
                          {zbSwitches.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Zigbee direction"
                          value={r.action.params.on_when_firing === false ? "off" : "on"}
                          onChange={(e) => setActionParam(i, "on_when_firing", e.target.value === "on")}
                        >
                          <option value="on">turn ON while firing</option>
                          <option value="off">turn OFF while firing</option>
                        </select>
                      </>
                    ) : r.action.type === "relay" ? (
                      <>
                        <select
                          aria-label="Relay target"
                          value={String(r.action.params.entity_id ?? "")}
                          onChange={(e) => {
                            const t = relayTargets.find((x) => x.entity_id === e.target.value);
                            patch(i, (x) => ({
                              ...x,
                              action: {
                                ...x.action,
                                params: {
                                  ...x.action.params,
                                  entity_id: e.target.value,
                                  on_when_firing: t?.cutout_only ? false : Boolean(x.action.params.on_when_firing),
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">— target —</option>
                          {relayTargets.map((t) => (
                            <option key={t.entity_id} value={t.entity_id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Relay direction"
                          disabled={Boolean(relayTarget?.cutout_only)}
                          value={r.action.params.on_when_firing ? "on" : "off"}
                          onChange={(e) => setActionParam(i, "on_when_firing", e.target.value === "on")}
                        >
                          <option value="on">hold ON while firing</option>
                          <option value="off">hold OFF while firing</option>
                        </select>
                        {relayTarget ? <span className="dsc-honesty">{relayTarget.why}</span> : null}
                      </>
                    ) : r.action.type === "setpoint" ? (
                      <>
                        <select
                          aria-label="Setpoint target"
                          value={String(r.action.params.entity_id ?? "")}
                          onChange={(e) => {
                            const t = setpointTargets.find((x) => x.entity_id === e.target.value);
                            patch(i, (x) => ({
                              ...x,
                              action: {
                                ...x.action,
                                params: {
                                  ...x.action.params,
                                  entity_id: e.target.value,
                                  value: t
                                    ? Math.min(t.max, Math.max(t.min, Number(x.action.params.value ?? t.min) || t.min))
                                    : x.action.params.value,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="">— setpoint —</option>
                          {setpointTargets.map((t) => (
                            <option key={t.entity_id} value={t.entity_id}>
                              {t.label} ({t.min}–{t.max}
                              {t.unit})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          aria-label="Setpoint value"
                          min={spTarget?.min}
                          max={spTarget?.max}
                          step={spTarget?.step ?? "any"}
                          value={String(r.action.params.value ?? "")}
                          style={{ width: 80 }}
                          onChange={(e) => setActionParam(i, "value", e.target.value)}
                        />
                        {spTarget ? <span>{spTarget.unit}</span> : null}
                        <label style={fieldRow}>
                          <input
                            type="checkbox"
                            checked={r.action.params.restore_on_clear !== false}
                            onChange={(e) => setActionParam(i, "restore_on_clear", e.target.checked)}
                          />
                          restore on clear
                        </label>
                        {spTarget?.pi_owned_when === "follow_plants" ? (
                          <span className="dsc-honesty">Pi-owned while 2x4 Climate Mode is Follow Plants — the write is skipped then.</span>
                        ) : null}
                      </>
                    ) : (
                      <select
                        aria-label="Seat"
                        value={String(r.action.params.seat_id ?? "")}
                        onChange={(e) => setActionParam(i, "seat_id", e.target.value)}
                      >
                        <option value="">— seat —</option>
                        {seats.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {problem ? <div className="dsc-honesty">Not saveable yet: {problem}.</div> : null}
                </div>
              </SettingsSubRow>
            ) : null,
          ];
        })}
      </SettingsTable>

      {removed.length ? (
        <div className="dsc-honesty" style={{ ...fieldRow, marginTop: 6 }}>
          <span>
            Removed (not saved yet): {removed.map((r) => r.name).join(", ")}.
          </span>
          {removed.map((r) => (
            <Button key={r.id} variant="secondary" onClick={() => undoRemove(r.id)}>
              Undo {r.name}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="dsc-row-actions">
        <Button onClick={addRule}>Add rule</Button>
        <Button primary disabled={!dirty || invalid} onClick={save}>
          Save rules
        </Button>
      </div>
      {msg ? <p className="dsc-honesty">{msg}</p> : null}
    </section>
  );
}
