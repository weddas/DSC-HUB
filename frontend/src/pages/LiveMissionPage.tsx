import { useEffect, useMemo, useRef, useState } from "react";
import { useAlertPrefs } from "../hooks/useAlertPrefs";
import { useNavigate } from "react-router-dom";
import { Button, Icon, StatusTag } from "../components/ui";
import { Panel } from "../components/Panel";
import { NextRecommendedCard } from "../components/Honesty";
import { HubLinkLine } from "../components/HubLinkLine";
import { useInspector } from "../components/InspectorHost";
import { GrowLogCompact, growLogGlyph, useRecentGrowLog } from "../components/GrowLogCompact";
import { thenSummary, whenSummary } from "../components/settings/AutomationRulesCard";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { useHubOfflineMs, useBeatOfflineMs, usePanelOfflineMs } from "../hooks/useHeldReading";
import { useSettledAvailability } from "../hooks/useSettledAvailability";
import { useAlertSnooze } from "../hooks/useAlertSnooze";
import { useAlertSince } from "../hooks/useAlertSince";
import { fmtDurationMs } from "../lib/formatDuration";
import { ALERT_ENTITY_IDS, alertRoute, playbookFor } from "../lib/alertPlaybook";
import { growLogSeverity, type DisplayGrowLogEvent } from "../lib/growLogFilter";
import {
  get_automation_targets,
  get_automations,
  put_automations,
  type AutomationRule,
  type AutomationTargets,
} from "../lib/fleetApi";
import { paths } from "../lib/paths";

/** Which zone a message or alert id is talking about — for the ZONE column. */
export function zoneOfText(text: string): string {
  const s = text.toLowerCase();
  const probe = /probe\s?(\d)|pot(\d)/.exec(s);
  if (probe) return `P${probe[1] ?? probe[2]}`;
  if (/2[x×]4|clone|mat\b|mister/.test(s)) return "2×4";
  if (/4[x×]8|\btent\b|main|twin/.test(s)) return "4×8";
  if (/room|lung|exhaust|intake|recirc/.test(s)) return "ROOM";
  if (/hub|panel|beat|heartbeat|fleet|firmware|failsafe/.test(s)) return "HUB";
  return "—";
}

/** Grow-log lines that count as "what the hub did" for an alert theme. */
function themeRegex(alertId: string): RegExp {
  const s = alertId.toLowerCase();
  if (/dark|light|photo|catchup/.test(s)) return /dark|light|sf1000|photoperiod|sunset|sunrise|lamp/i;
  if (/vpd|climate|humid|heater|vent/.test(s)) return /vpd|humidifier|dehumidifier|heater|fans?|ladder|climate|rung/i;
  if (/root|probe|pot|mat|tank/.test(s)) return /probe|mat|root|moisture|tank|pump|shot/i;
  if (/failsafe|emergency/.test(s)) return /failsafe|emergency|safe/i;
  if (/reduced_kit|nest/.test(s)) return /capacity|reduced|offline|relay/i;
  return /demand|ladder|rung|banner/i;
}

function hubDidFor(alertId: string, events: DisplayGrowLogEvent[]): DisplayGrowLogEvent | null {
  const re = themeRegex(alertId);
  const cutoff = Date.now() / 1000 - 6 * 3600;
  return events.find((ev) => ev.ts >= cutoff && re.test(ev.message)) ?? null;
}

function shortTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ruleState(r: AutomationRule): { label: string; tone: "ok" | "warn" | "bad" | "muted"; live?: boolean } {
  if (!r.enabled) return { label: "OFF", tone: "muted" };
  if (r.last_error) return { label: "WRITE FAILED", tone: "bad", live: true };
  if (r.firing) return { label: "FIRING", tone: "warn", live: true };
  if (r.pending) return { label: "PENDING", tone: "warn" };
  if (r.releasing) return { label: "RELEASING", tone: "ok" };
  return { label: "ARMED", tone: "ok" };
}

function ruleScope(r: AutomationRule): string {
  const ids = ("all" in r.trigger ? r.trigger.all : r.trigger.any) ?? [];
  const zones = Array.from(new Set(ids.map((c) => zoneOfText(String(c.entity_id))))).filter((z) => z !== "—");
  return zones.length ? zones.join(" · ") : "all";
}

/**
 * Alerts desk (frame 1j): active now → what the hub did about it → history → the rules it
 * follows before it calls you. Command stays on Climate; kit health lives on Kit.
 */
export function LiveMissionPage() {
  const { state, entity, tick } = useEntityBus();
  const fleet = useFleet();
  const navigate = useNavigate();
  const settled = useSettledAvailability();
  const { isSnoozed, snooze } = useAlertSnooze();
  const inspector = useInspector();
  const log = useRecentGrowLog(24, 120);
  void tick;

  const hubOnline = fleet.hub.online || settled("sensor.dsc_hub_uptime");
  const offlineMs = useHubOfflineMs();
  const beatOfflineMs = useBeatOfflineMs();
  const panelOfflineMs = usePanelOfflineMs();
  const panelLink = fleet.panel.online ? "on" : state("binary_sensor.dsc_hub_panel_link");
  const panelOk = fleet.panel.online || panelLink === "on";
  const panelSettled = settled("binary_sensor.dsc_hub_panel_link") || panelOk;
  const panelHaOnly = !panelOk && state("sensor.dsc_control_wifi_rssi", "") !== "";
  const panelOffline = !panelOk && !panelHaOnly && !panelSettled;
  const heartbeat =
    fleet.hub.values.heartbeat != null ? String(fleet.hub.values.heartbeat) : state("sensor.dsc_hub_heartbeat", "");
  const beatOk = fleet.hub.online && fleet.hub.values.heartbeat != null ? true : settled("sensor.dsc_hub_heartbeat");
  const takeover = state("switch.dsc_hub_manual_takeover") === "on";
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const reducedKit = !!fleet.system.reduced_kit;
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");
  const fleetOk = fleet.version === fleet.expected_firmware;

  const alertPrefs = useAlertPrefs();
  const activeIds = ALERT_ENTITY_IDS.filter((id) => state(id) === "on" && !isSnoozed(id) && alertPrefs.isEnabled(id));
  const snoozedIds = ALERT_ENTITY_IDS.filter((id) => state(id) === "on" && isSnoozed(id) && alertPrefs.isEnabled(id));
  const disabledActive = ALERT_ENTITY_IDS.filter((id) => state(id) === "on" && !alertPrefs.isEnabled(id)).length;
  const sinceOf = useAlertSince(activeIds);

  // Rules — read-only view of automation v2 with an enabled toggle; the editor stays in Settings.
  const [rules, setRules] = useState<AutomationRule[] | null>(null);
  const [targets, setTargets] = useState<AutomationTargets | null>(null);
  const [rulesErr, setRulesErr] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  // Rules and targets load independently: an older brain (the Pi today) serves the rules
  // but not the targets route, and a missing targets list only loses the friendly labels.
  const rulesInflight = useRef(false);
  const loadRules = async () => {
    if (rulesInflight.current) return; // the 30 s timer must not queue behind a slow brain
    rulesInflight.current = true;
    try {
      const a = await get_automations();
      setRules(a.rules);
      setRulesErr(null);
    } catch (e) {
      setRulesErr(e instanceof Error ? `Rules unavailable — ${e.message}` : "rules unavailable");
    }
    try {
      setTargets(await get_automation_targets());
    } catch {
      setTargets(null);
    } finally {
      rulesInflight.current = false;
    }
  };
  useEffect(() => {
    void loadRules();
    const timer = window.setInterval(() => void loadRules(), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleRule = async (rule: AutomationRule) => {
    if (!rules) return;
    setSavingId(rule.id);
    try {
      const next = rules.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
      const res = await put_automations(next);
      setRules(res.rules);
      setRulesErr(null);
    } catch (e) {
      setRulesErr(e instanceof Error ? e.message : "rule save failed");
    } finally {
      setSavingId(null);
    }
  };

  const history = useMemo(() => log.events.slice(0, 40), [log.events]);
  const firingCount = rules?.filter((r) => r.enabled && r.firing).length ?? 0;

  return (
    <div className="dsc-page dsc-alerts">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Live · Alerts</div>
          <h1 className="dsc-headline">The hub acts before it calls you.</h1>
          <p className="dsc-subline">
            {activeIds.length
              ? `${activeIds.length} active · ${rules?.length ?? "—"} rules · ${firingCount} firing now`
              : `Nothing active · ${rules?.length ?? "—"} rules · ${firingCount} firing now`}
            . Command lives on Climate; kit health on Kit.
          </p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag
            label={hubOnline ? "HUB ONLINE" : `HUB OFF ${offlineMs != null ? fmtDurationMs(offlineMs) : "—"}`}
            tone={hubOnline ? "ok" : "bad"}
            live={!hubOnline}
            onClick={() => inspector.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })}
          />
          <StatusTag
            label={
              panelOk
                ? "PANEL LINKED"
                : panelHaOnly
                  ? "PANEL LIMITED LINK"
                  : panelOffline
                    ? `PANEL OFF ${panelOfflineMs != null ? fmtDurationMs(panelOfflineMs) : "—"}`
                    : "PANEL…"
            }
            tone={panelOk ? "ok" : panelHaOnly ? "warn" : "bad"}
            live={panelOffline}
            onClick={() => inspector.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })}
          />
          <StatusTag
            label={beatOk ? `BEAT #${heartbeat}` : `NO BEAT ${beatOfflineMs != null ? fmtDurationMs(beatOfflineMs) : ""}`.trim()}
            tone={beatOk ? "ok" : "bad"}
            live={!beatOk}
            onClick={() => inspector.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })}
          />
          <StatusTag
            label={fleetOk ? `FLEET ${fleet.expected_firmware}` : "FLEET DRIFT"}
            tone={fleetOk ? "muted" : "warn"}
            onClick={() => navigate(paths.kit())}
          />
          {fullAuto ? <StatusTag label="FULL AUTO" tone="ok" /> : <StatusTag label="FULL AUTO OFF" tone="warn" />}
          {takeover ? <StatusTag label="MANUAL TAKEOVER" tone="bad" live /> : null}
          {fanOverride ? <StatusTag label="FAN OVERRIDE" tone="warn" /> : null}
          {fullAuto && reducedKit ? (
            <StatusTag
              label={honesty || "CAPACITY OFFLINE"}
              tone="warn"
              onClick={() => inspector.open({ entityId: "binary_sensor.dsc_reduced_kit", label: "Capacity offline", kind: "alert" })}
            />
          ) : null}
        </div>
      </header>

      <div className="dsc-alerts-grid">
        <Panel legendIcon="bell" legend={`ACTIVE NOW · ${activeIds.length}`} tone={activeIds.length ? "bad" : "ok"} live={activeIds.length > 0}>
          {activeIds.length === 0 ? (
            <p className="dsc-alerts-empty">
              Nothing active. {snoozedIds.length ? `${snoozedIds.length} acknowledged until the next hub boot.` : "The hub has nothing to say."}
            </p>
          ) : (
            <div className="dsc-alert-list">
              {activeIds.map((id) => {
                const pb = playbookFor(id, "alert");
                const route = alertRoute(id);
                const did = hubDidFor(id, log.events);
                const since = sinceOf(id);
                return (
                  <article key={id} className="dsc-alert-card">
                    <span className="dsc-alert-zone">
                      {zoneOfText(id)}
                      {alertPrefs.severityOf(id) !== "critical" ? (
                        <span className="dsc-alert-sev">{alertPrefs.severityOf(id).toUpperCase()}</span>
                      ) : null}
                    </span>
                    <div className="dsc-alert-body">
                      <div className="dsc-alert-title">{pb.title}</div>
                      <div className="dsc-alert-did">
                        {did
                          ? `Hub: ${did.message.replace(/^[▶■▲◆●○•]\s*/, "")} · ${shortTime(did.ts)}`
                          : "No automatic action recorded in the last 6 h"}
                      </div>
                      <div className="dsc-alert-fix">{pb.fix}</div>
                    </div>
                    <div className="dsc-alert-side">
                      <span className="dsc-alert-since" title="Since this screen first saw it — the hub does not stamp alert start times">
                        {since != null ? `seen ${fmtDurationMs(Date.now() - since)}` : "seen just now"}
                      </span>
                      <button type="button" className="dsc-alert-cta" onClick={() => navigate(route.href)}>
                        {route.cta.toUpperCase()} →
                      </button>
                      <button
                        type="button"
                        className="dsc-alert-ack"
                        onClick={() => snooze(id)}
                        title="Hide until the next hub boot — the condition itself is untouched"
                      >
                        <Icon name="snooze" size={11} /> acknowledge
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {disabledActive ? (
            <p className="dsc-panel-foot">
              {disabledActive} active alert{disabledActive === 1 ? "" : "s"} hidden by <a href="#/settings/alerts">Settings › Alerts</a>.
            </p>
          ) : null}
          {snoozedIds.length && activeIds.length ? (
            <p className="dsc-panel-foot">{snoozedIds.length} more acknowledged until the next hub boot.</p>
          ) : null}
        </Panel>

        <Panel legend="HISTORY · 24 H">
          {history.length ? (
            <div className="dsc-hist-grid">
              {history.map((ev) => {
                const g = growLogGlyph(ev.message);
                const sev = growLogSeverity(ev.message);
                const tag = sev === "alert" ? "ALERT" : g.char === "▶" || g.char === "■" ? "HUB" : "NOTE";
                return (
                  <div key={ev.id} className="dsc-hist-row">
                    <span className="dsc-hist-time">{shortTime(ev.ts)}</span>
                    <span className="dsc-hist-zone">{zoneOfText(ev.message)}</span>
                    <span className="dsc-hist-text">
                      {ev.message.replace(/^[▶■▲◆●○•]\s*/, "")}
                      {ev.repeatCount != null && ev.repeatCount > 1 ? <span className="dsc-log-repeat">×{ev.repeatCount}</span> : null}
                    </span>
                    <span className={`dsc-hist-tag dsc-hist-tag--${tag.toLowerCase()}`}>{tag}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <GrowLogCompact events={[]} loading={log.loading} rows={0} />
          )}
          <p className="dsc-panel-foot">
            ALERT = a notable the hub flagged · HUB = something it switched · NOTE = stage or operator line. Full review on the Logs desk.
          </p>
        </Panel>
      </div>

      <Panel legend="RULES · WHAT THE HUB DOES BEFORE IT CALLS YOU">
        {rulesErr ? <p className="dsc-honesty">{rulesErr}</p> : null}
        {rules && rules.length ? (
          <div className="dsc-rules-grid">
            <span className="dsc-legend">Condition</span>
            <span className="dsc-legend">Scope</span>
            <span className="dsc-legend">Hub action</span>
            <span className="dsc-legend">State</span>
            <span className="dsc-legend">On</span>
            {rules.map((r) => {
              const st = ruleState(r);
              return (
                <div key={r.id} className={`dsc-rule-row${r.enabled ? "" : " is-off"}`}>
                  <span className="dsc-rule-cond">
                    <strong>{r.name || r.id}</strong>
                    <span>{whenSummary(r)}</span>
                  </span>
                  <span className="dsc-rule-scope">{ruleScope(r)}</span>
                  <span className="dsc-rule-then">{thenSummary(r, targets)}</span>
                  <span>
                    <StatusTag label={st.label} tone={st.tone} live={st.live} title={r.last_error ?? undefined} />
                  </span>
                  <span>
                    <button
                      type="button"
                      className={`dsc-switch${r.enabled ? " is-on" : ""}`}
                      role="switch"
                      aria-checked={r.enabled}
                      aria-label={`${r.name || r.id} enabled`}
                      disabled={savingId != null}
                      onClick={() => void toggleRule(r)}
                    >
                      <span className="dsc-switch-thumb" />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        ) : rules ? (
          <p className="dsc-alerts-empty">No rules yet. The escalation ladder runs on the hub regardless; rules add what happens on top.</p>
        ) : (
          <p className="dsc-panel-foot">Loading rules…</p>
        )}
        <div className="dsc-row-actions">
          <Button onClick={() => navigate(paths.settings("automation"))}>Edit rules in Settings</Button>
          <Button onClick={() => navigate(paths.climate())}>Open Climate command</Button>
        </div>
        <p className="dsc-panel-foot">
          Fired counts are not recorded yet — STATE is live: ARMED, PENDING (inside debounce), FIRING, RELEASING, or WRITE FAILED.
        </p>
      </Panel>

      <div className="dsc-alerts-grid">
        <Panel legend="LINK">
          <HubLinkLine />
        </Panel>
        <Panel legend="DO THIS NEXT">
          <NextRecommendedCard />
        </Panel>
      </div>
    </div>
  );
}
