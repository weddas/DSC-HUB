/**
 * DSC-HUB — The Dash
 * Full-bleed cinematic ops surface: Three.js tent/duct scene + charts + flow.
 *
 * type: custom:dsc-the-dash-card
 * Requires THREE global (vendor/three.min.js bundled before this file).
 */
(() => {
  const CARD_TYPE = "dsc-the-dash-card";
  const EDITOR_TYPE = "dsc-the-dash-card-editor";
  const FLOW_EPS = 0.5;
  const POT_COLORS = ["#4fc3f7", "#81c784", "#ffb74d", "#ce93d8", "#ef9a9a", "#80cbc4", "#fff176", "#a5d6a7"];
  const STAGE_ORDER = [
    "Germination",
    "Seedling",
    "Early Vegetative",
    "Vegetative",
    "Late (Push) Vegetative",
    "Early Flowering",
    "Flowering",
    "Late Flowering",
    "Final 48-72h Flowering",
  ];

  const DSC_DEFAULTS = () => ({
    type: `custom:${CARD_TYPE}`,
    title: "DSC-HUB // ADVANCED CULTIVATION CONTROL",
    subtitle: "Zonal Cultivation Hub — 2-Tent System",
    pots: [
      { id: "pot1", tent: "clone", slot: 0, prefix: "dsc_pot1", in_service: "input_boolean.dsc_pot1_in_service" },
      { id: "pot2", tent: "clone", slot: 1, prefix: "dsc_pot2", in_service: "input_boolean.dsc_pot2_in_service" },
      { id: "pot3", tent: "main", slot: 0, prefix: "dsc_pot3", in_service: "input_boolean.dsc_pot3_in_service" },
      { id: "pot4", tent: "main", slot: 1, prefix: "dsc_pot4", in_service: "input_boolean.dsc_pot4_in_service" },
    ],
    entities: {
      room_temp: "sensor.dsc_hub_room_temperature",
      room_humidity: "sensor.dsc_hub_room_humidity",
      tent_temp: "sensor.dsc_hub_tent_temperature",
      tent_humidity: "sensor.dsc_hub_tent_humidity",
      tent_vpd: "sensor.dsc_hub_vpd_kpa",
      clone_temp: "sensor.dsc_hub_clone_temperature",
      clone_humidity: "sensor.dsc_hub_clone_humidity",
      clone_vpd: "sensor.dsc_hub_clone_vpd_kpa",
      cfm_intake_main: "sensor.dsc_cfm_intake_main",
      cfm_intake_2x4: "sensor.dsc_cfm_intake_2x4",
      cfm_out: "sensor.dsc_cfm_exhaust_out",
      cfm_recirc: "sensor.dsc_cfm_exhaust_recirc",
      fan_intake_main: "sensor.dsc_fan_intake_main_pct",
      fan_intake_2x4: "sensor.dsc_fan_intake_2x4_pct",
      fan_out: "sensor.dsc_fan_exhaust_outside_pct",
      fan_recirc: "sensor.dsc_fan_exhaust_room_pct",
      light: "light.dsc_hub_sf1000_dimmer",
      grow_mat: "switch.dsc_hub_grow_mat_demand",
      heater: "switch.dsc_hub_heater_demand",
      ac: "switch.dsc_hub_ac_demand",
      humidifier: "switch.dsc_hub_humidifier_demand",
      dehumidifier: "switch.dsc_hub_dehumidifier_demand",
      clone_humidifier: "switch.dsc_hub_clone_humidifier_demand",
      priority: "select.dsc_hub_priority_tent",
      strategy: "select.dsc_hub_control_strategy",
      emergency: "binary_sensor.dsc_hub_emergency_failsafe",
      lights_on_time: "time.dsc_hub_lights_on_time",
      clone_lights_on_time: "time.dsc_hub_clone_lights_on_time",
      expected_light_hours: "sensor.dsc_expected_light_hours",
      clone_expected_light_hours: "sensor.dsc_clone_expected_light_hours",
      next_light_event: "sensor.dsc_next_light_event",
      hub_link: "binary_sensor.dsc_hub_link",
      hub_api_down_age: "sensor.dsc_hub_api_down_age",
      hub_handshake_age: "sensor.dsc_hub_ha_handshake_age",
      hub_link_bounces: "sensor.dsc_hub_link_recovery_bounces",
      hub_rf_status: "sensor.dsc_hub_rf_status",
      hub_last_evt: "sensor.dsc_hub_last_evt",
      ha_link_flaps: "sensor.dsc_ha_link_flap_count_24h",
    },
  });

  const normalizeConfig = (raw) => {
    const d = DSC_DEFAULTS();
    if (!raw || typeof raw !== "object") return d;
    return {
      type: raw.type || d.type,
      title: raw.title || d.title,
      subtitle: raw.subtitle || d.subtitle,
      pots: Array.isArray(raw.pots) && raw.pots.length ? raw.pots : d.pots,
      entities: { ...d.entities, ...(raw.entities || {}) },
    };
  };

  const stateOf = (hass, id) => (hass && id && hass.states[id]) || null;
  const numState = (hass, id, fallback = NaN) => {
    const s = stateOf(hass, id);
    if (!s || s.state === "unavailable" || s.state === "unknown") return fallback;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : fallback;
  };
  const isOn = (hass, id) => {
    const s = stateOf(hass, id);
    return !!(s && (s.state === "on" || s.state === "true"));
  };
  const isUnavailable = (hass, id) => {
    const s = stateOf(hass, id);
    return !s || s.state === "unavailable" || s.state === "unknown";
  };
  const fmt = (n, digits = 1) => (Number.isFinite(n) ? n.toFixed(digits) : "—");
  const fmtHeld = (ms) => {
    const s = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m < 60) return `${m}m ${r}s`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  };
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const composeHubDiagLine = (hass, e) => {
    if (!hass || !e) return "";
    const bits = [];
    const apiAge = numState(hass, e.hub_api_down_age, NaN);
    const hsAge = numState(hass, e.hub_handshake_age, NaN);
    const bounces = numState(hass, e.hub_link_bounces, NaN);
    const flaps = numState(hass, e.ha_link_flaps, NaN);
    const rf = stateOf(hass, e.hub_rf_status)?.state;
    const evt = stateOf(hass, e.hub_last_evt)?.state;
    if (Number.isFinite(apiAge) && apiAge > 0) bits.push(`API down ${Math.round(apiAge)}s`);
    if (Number.isFinite(hsAge)) bits.push(`handshake age ${Math.round(hsAge)}s`);
    if (Number.isFinite(bounces)) bits.push(`link bounces ${Math.round(bounces)}`);
    if (Number.isFinite(flaps)) bits.push(`HA flaps 24h ${Math.round(flaps)}`);
    if (rf && rf !== "unavailable" && rf !== "unknown") bits.push(`RF ${rf}`);
    if (evt && evt !== "unavailable" && evt !== "unknown") bits.push(`EVT ${evt}`);
    return bits.join(" · ");
  };

  const lightLevel = (hass, id) => {
    const s = stateOf(hass, id);
    if (!s || s.state === "unavailable" || s.state === "unknown" || s.state === "off") return 0;
    const bri = s.attributes && s.attributes.brightness;
    if (typeof bri === "number") return Math.max(0, Math.min(1, bri / 255));
    return s.state === "on" ? 1 : 0;
  };

  const parseTimeToMinutes = (val) => {
    if (!val || val === "unknown" || val === "unavailable") return null;
    const m = String(val).match(/^(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return (+m[1]) * 60 + (+m[2]);
  };

  /** Minutes since lights-on (positive) or until lights-on (negative while dark). */
  const lightClockMinutes = (hass, ent, tent) => {
    const onId = tent === "clone" ? ent.clone_lights_on_time : ent.lights_on_time;
    const hoursId = tent === "clone" ? ent.clone_expected_light_hours : ent.expected_light_hours;
    const onMin = parseTimeToMinutes(stateOf(hass, onId)?.state);
    let hours = numState(hass, hoursId, NaN);
    if (!Number.isFinite(hours) || hours <= 0) hours = tent === "clone" ? 18 : 12;
    if (onMin == null) return NaN;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    let since = nowMin - onMin;
    if (since < -12 * 60) since += 24 * 60;
    if (since > 12 * 60) since -= 24 * 60;
    const window = hours * 60;
    if (since >= 0 && since <= window) return since; // since on
    // dark: negative minutes until next on
    if (since > window) return -(24 * 60 - since);
    return since; // before on today
  };

  const activePots = (cfg, hass) =>
    (cfg.pots || []).filter((p) => {
      if (!p || !p.prefix) return false;
      if (p.in_service && !isUnavailable(hass, p.in_service) && !isOn(hass, p.in_service)) return false;
      return true;
    });

  const potEntity = (prefix, suffix) => `sensor.${prefix}_${suffix}`;

  /** Extract pot number from id/prefix (pot1 / dsc_pot1 -> 1). */
  const potNumFrom = (p) => {
    const raw = String((p && (p.id || p.prefix)) || "");
    const m = raw.match(/pot\s*(\d+)/i);
    return m ? parseInt(m[1], 10) : NaN;
  };

  /**
   * Tent SoT: input_select.dsc_pot{N}_tent (unassigned | clone | main).
   * Falls back to cfg.pots[].tent when the select is missing.
   */
  const readPotTent = (hass, p) => {
    const n = potNumFrom(p);
    const selectId = Number.isFinite(n) ? `input_select.dsc_pot${n}_tent` : "";
    const sel = selectId ? stateOf(hass, selectId) : null;
    if (sel && sel.state !== "unavailable" && sel.state !== "unknown") {
      const v = String(sel.state || "").toLowerCase();
      if (v === "clone" || v === "main" || v === "unassigned") return v;
    }
    const fb = String((p && p.tent) || "").toLowerCase();
    if (fb === "clone" || fb === "main" || fb === "unassigned") return fb;
    return "unassigned";
  };

  /* ------------------------------------------------------------------ */
  /* Styles                                                             */
  /* ------------------------------------------------------------------ */

  const STYLES = `
    :host { display: block; }
    .dash {
      --bg: #0b0e14;
      --panel: #12171f;
      --line: #243044;
      --text: #e8eef8;
      --muted: #8b95a8;
      --accent: #26c6da;
      --ok: #66bb6a;
      --warn: #ffb74d;
      --bad: #ef5350;
      --blue: #42a5f5;
      --orange: #ff8a65;
      font-family: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
      color: var(--text);
      background:
        radial-gradient(1200px 600px at 20% 0%, #152033 0%, transparent 55%),
        radial-gradient(900px 500px at 90% 20%, #1a1520 0%, transparent 50%),
        var(--bg);
      border: 1px solid var(--line);
      border-radius: 10px;
      overflow: hidden;
      min-height: calc(100vh - 72px);
      height: calc(100vh - 72px);
      display: flex;
      flex-direction: column;
    }
    ha-card, :host { background: transparent; }
    .dash-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; padding: 12px 18px; border-bottom: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(20,26,36,0.95), rgba(12,16,22,0.8));
    }
    .dash-brand { font-weight: 700; letter-spacing: 0.04em; font-size: 15px; }
    .dash-sub { color: var(--muted); font-size: 12px; margin-top: 2px; }
    .dash-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 700;
      letter-spacing: 0.06em; border: 1px solid rgba(102,187,106,0.45);
      background: rgba(102,187,106,0.12); color: var(--ok);
    }
    .dash-pill.bad { border-color: rgba(239,83,80,0.5); background: rgba(239,83,80,0.12); color: var(--bad); }
    .dash-pill.warn { border-color: rgba(255,183,77,0.5); background: rgba(255,183,77,0.12); color: var(--warn); }
    .dash-body {
      flex: 1; display: grid;
      grid-template-columns: minmax(0, 1.55fr) minmax(340px, 1fr);
      gap: 12px; padding: 12px; min-height: 0;
    }
    .dash-main { display: flex; flex-direction: column; gap: 12px; min-height: 0; }
    .dash-scene-wrap {
      position: relative; flex: 1.35; min-height: 420px;
      background:
        radial-gradient(ellipse at 50% 30%, #1a2840 0%, transparent 55%),
        linear-gradient(180deg, #121a28, #070a10);
      border: 1px solid var(--line); border-radius: 8px; overflow: hidden;
    }
    .dash-scene-wrap::after {
      content: "";
      pointer-events: none;
      position: absolute; inset: 0; z-index: 1; border-radius: inherit;
      background:
        radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 2px);
      mix-blend-mode: soft-light;
      opacity: 0.85;
    }
    .dash-scene-wrap canvas { display: block; width: 100%; height: 100%; position: relative; z-index: 0; }
    .dash-hud {
      position: absolute; pointer-events: none; z-index: 2;
      background: rgba(8, 14, 16, 0.78); backdrop-filter: blur(12px);
      border: 1px solid rgba(38, 198, 218, 0.38); border-radius: 12px;
      padding: 12px 14px; min-width: 168px;
      box-shadow: 0 0 24px rgba(38, 198, 218, 0.18), 0 8px 28px rgba(0,0,0,0.45);
      transition: left 180ms ease, top 180ms ease, transform 180ms ease;
    }
    .dash-hud.left { left: 14px; top: 14px; }
    .dash-hud.right { right: 14px; top: 14px; }
    .dash-hud.is-anchored { right: auto; }
    .dash-hud .k { font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .dash-hud .v { font-size: 20px; font-weight: 700; margin-top: 4px; letter-spacing: 0.01em; }
    .dash-hud .v-split {
      display: flex; gap: 12px; margin-top: 6px; flex-wrap: wrap;
    }
    .dash-hud .v-split .metric { display: flex; flex-direction: column; gap: 2px; min-width: 3.2em; }
    .dash-hud .v-split .metric .mk {
      font-size: 9px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600;
    }
    .dash-hud .v-split .metric .mv { font-size: 18px; font-weight: 700; line-height: 1.1; }
    .dash-hud .s { font-size: 11px; color: var(--accent); margin-top: 6px; }
    .dash-hud .band {
      margin-top: 8px; height: 6px; border-radius: 999px;
      background: rgba(255,255,255,0.08); position: relative; overflow: hidden;
    }
    .dash-hud .band .want {
      position: absolute; top: 0; bottom: 0;
      background: rgba(38,198,218,0.35); border-left: 1px solid rgba(38,198,218,0.85);
      border-right: 1px solid rgba(38,198,218,0.85);
    }
    .dash-hud .band .got {
      position: absolute; top: -2px; width: 3px; height: 10px;
      background: #39ff14; border-radius: 2px;
      box-shadow: 0 0 8px rgba(57,255,20,0.75);
      transform: translateX(-50%);
    }
    .dash-hud .vpd-mini {
      margin-top: 8px; display: flex; align-items: center; gap: 8px;
    }
    .dash-hud .vpd-mini svg { flex: 0 0 auto; }
    .dash-hud .leader {
      position: absolute; width: 18px; height: 18px; border-radius: 50%;
      border: 1px solid rgba(38,198,218,0.55);
      box-shadow: 0 0 12px rgba(38,198,218,0.35);
      pointer-events: none;
    }
    .dash-pot-chips {
      position: absolute; left: 50%; bottom: 44px; transform: translateX(-50%);
      z-index: 3; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
      max-width: calc(100% - 28px); pointer-events: auto;
    }
    .dash-pot-chip {
      display: flex; flex-direction: column; gap: 2px;
      min-width: 92px; padding: 7px 10px;
      background: rgba(8,12,18,0.78); backdrop-filter: blur(8px);
      border: 1px solid rgba(100,120,150,0.4); border-radius: 8px;
      color: var(--text); cursor: pointer; text-align: left;
      transition: border-color 0.15s, background 0.15s;
    }
    .dash-pot-chip:hover, .dash-pot-chip.on {
      border-color: rgba(38,198,218,0.65);
      background: rgba(16,28,40,0.9);
    }
    .dash-pot-chip .chip-id {
      font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
    }
    .dash-pot-chip .chip-name { font-size: 12px; font-weight: 700; max-width: 120px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dash-pot-chip .chip-meta { font-size: 10px; color: var(--accent); }
    .dash-legend {
      position: absolute; left: 14px; bottom: 12px; z-index: 2;
      display: flex; gap: 14px; flex-wrap: wrap;
      font-size: 10px; color: var(--muted); letter-spacing: 0.04em;
    }
    .dash-legend span {
      display: inline-flex; align-items: center; gap: 6px;
      pointer-events: auto; cursor: pointer; padding: 2px 4px; border-radius: 4px;
      transition: color 0.15s, background 0.15s;
    }
    .dash-legend span:hover, .dash-legend span.on {
      color: var(--text); background: rgba(255,255,255,0.06);
    }
    .dash-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dash-charts {
      display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px;
    }
    .dash-chart {
      background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
      padding: 8px 8px 6px; min-height: 110px; display: flex; flex-direction: column;
    }
    .dash-chart h4 {
      margin: 0 0 4px; font-size: 9px; letter-spacing: 0.06em; color: var(--muted);
      text-transform: uppercase; font-weight: 700;
    }
    .dash-chart .leg {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 2px;
      font-size: 9px; color: var(--muted);
    }
    .dash-chart .leg i { width: 8px; height: 2px; display: inline-block; vertical-align: middle; margin-right: 3px; }
    .dash-chart canvas { width: 100%; flex: 1; min-height: 64px; }
    .dash-flow-caption {
      font-size: 10px; color: var(--muted); margin: 0 0 8px; line-height: 1.35;
    }
    .dash-rail { display: flex; flex-direction: column; gap: 12px; min-height: 0; }
    .dash-panel {
      background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
      padding: 12px;
    }
    .dash-panel h3 {
      margin: 0 0 10px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--muted); font-weight: 700;
    }
    .dash-timeline { display: flex; gap: 0; overflow: hidden; }
    .dash-chev {
      flex: 1; position: relative; padding: 10px 8px 10px 18px;
      background: #1a2230; color: var(--muted); font-size: 10px; font-weight: 700;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%);
      margin-left: -8px; text-align: center; letter-spacing: 0.04em;
    }
    .dash-chev:first-child { margin-left: 0; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%); }
    .dash-chev.on { background: #1565c0; color: #fff; }
    .dash-chev.next { background: #3e3428; color: #ffcc80; }
    .dash-flow { overflow: visible; }
    .dash-flow-grid {
      display: grid;
      grid-template-columns: 72px 1fr 1fr 1fr;
      gap: 8px;
      align-items: stretch;
      min-width: 0;
    }
    .dash-flow-col { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .dash-flow-col .col-h {
      font-size: 8px; letter-spacing: 0.06em; color: var(--muted);
      text-transform: uppercase; font-weight: 700; text-align: center;
    }
    .dash-flow-box {
      border-radius: 8px; padding: 8px 6px; text-align: center;
      background: #152030; border: 1px solid #243044; min-height: 44px;
    }
    .dash-flow-box .lbl { font-size: 9px; color: var(--muted); margin-bottom: 2px; }
    .dash-flow-box .val { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }
    .dash-flow-box .sub { font-size: 9px; color: #6a7788; margin-top: 4px; }
    .dash-flow-box.env { border-color: #26c6da; }
    .dash-flow-box.clone { border-color: #26c6da; background: #13202e; }
    .dash-flow-box.main { border-color: #ffb74d; background: #2a2018; }
    .dash-flow-box.casc {
      border-style: dashed; border-color: #ffb74d; background: #1e1810;
      padding: 6px;
    }
    .dash-flow-box.total {
      border-color: #78909c; background: #121820; padding: 6px;
    }
    .dash-flow-box.out { border-color: #42a5f5; }
    .dash-flow-box.rec { border-color: #ab47bc; background: #241830; }
    .dash-flow-box.gear { border-color: currentColor; }
    .dash-flow-box.idle { color: var(--muted); font-size: 11px; padding: 16px 6px; }
    .dash-flow-arrow {
      text-align: center; font-size: 9px; color: #6a7788; letter-spacing: 0.04em;
      line-height: 1; padding: 0 0 2px;
    }
    .dash-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .dash-btn {
      border: 1px solid var(--line); background: #1a222e; color: var(--text);
      border-radius: 6px; padding: 12px 8px; font-size: 10px; font-weight: 700;
      letter-spacing: 0.06em; cursor: pointer; text-transform: uppercase;
    }
    .dash-btn:hover { border-color: var(--accent); }
    .dash-btn.danger { background: #5c1a1a; border-color: #c62828; color: #ffcdd2; }
    .dash-btn.guard { background: #3e2723; border-color: #6d4c41; }
    .dash-footer {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      padding: 8px 16px; border-top: 1px solid var(--line);
      font-size: 11px; color: var(--muted); background: #0a0d12;
    }
    .dash-footer .alert { color: var(--warn); }
    .dash-footer .err { color: var(--bad); font-weight: 700; }
    .dash-missing {
      padding: 40px; text-align: center; color: var(--bad);
    }
    @media (max-width: 1100px) {
      .dash-body { grid-template-columns: 1fr; }
      .dash-charts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .dash { min-height: auto; height: auto; }
      .dash-scene-wrap { min-height: 320px; }
    }
  `;

  /* ------------------------------------------------------------------ */
  /* Flow diagram (device → split → exhaust)                             */
  /* ------------------------------------------------------------------ */

  const fmtCfm = (n) => (Number.isFinite(n) ? `${Math.round(n)} CFM` : "— CFM");

  const renderFlow = (live) => {
    // Col1 Active gear | Col2 Intake environment (room climate)
    // Col3 Intake CFM (2x4 + cascade transfer + 4x8 + Σ) | Col4 4x8 exhaust split
    const devices = (live.devices || []).filter((d) => d.on && !String(d.id).startsWith("fan_"));
    const gearHtml =
      devices.length === 0
        ? `<div class="dash-flow-box idle">None on</div>`
        : devices
            .map(
              (d) =>
                `<div class="dash-flow-box gear" style="color:${esc(d.color)};border-color:${esc(d.color)}">
                  <div class="val" style="font-size:11px">${esc(d.label)}</div>
                </div>`
            )
            .join("");

    const cfm2 = live.cfmClone ?? NaN;
    const cfm8 = live.cfmMain ?? NaN;
    const casc = live.cascadeCfm ?? NaN;
    const throughput =
      Number.isFinite(cfm2) && Number.isFinite(cfm8) ? cfm2 + cfm8 : Number.isFinite(live.throughput) ? live.throughput : NaN;
    const oPct = Math.round((live.outShare || 0) * 100);
    const rPct = Math.round((live.recircShare || 0) * 100);
    const cfmOut = live.cfmOut ?? NaN;
    const cfmRec = live.cfmRecirc ?? NaN;
    const roomParts = String(live.roomClimate || "— · — · —").split("·").map((s) => s.trim());

    return `
      <div class="dash-flow-grid" role="img" aria-label="Intake environment to CFM to exhaust">
        <div class="dash-flow-col">
          <div class="col-h">Active gear</div>
          ${gearHtml}
        </div>
        <div class="dash-flow-col">
          <div class="col-h">Intake environment</div>
          <div class="dash-flow-box env" style="flex:1">
            <div class="lbl">ROOM → TENTS</div>
            <div class="val">${esc(roomParts[0] || "—")}</div>
            <div class="val">${esc(roomParts[1] || "—")}</div>
            <div class="val" style="color:#26c6da">${esc(roomParts[2] || "—")}</div>
            <div class="sub">shared lung air into intakes</div>
          </div>
        </div>
        <div class="dash-flow-col">
          <div class="col-h">Intake CFM</div>
          <div class="dash-flow-box clone">
            <div class="lbl">2×4 from room</div>
            <div class="val">${esc(fmtCfm(cfm2))}</div>
          </div>
          <div class="dash-flow-arrow">↓ transfer (not +)</div>
          <div class="dash-flow-box casc">
            <div class="lbl">2×4 → 4×8 cascade</div>
            <div class="val" style="color:#ffcc80;font-size:12px">${esc(fmtCfm(casc))}</div>
            <div class="sub">same air · neg. pressure</div>
          </div>
          <div class="dash-flow-box main">
            <div class="lbl">4×8 from room</div>
            <div class="val">${esc(fmtCfm(cfm8))}</div>
          </div>
          <div class="dash-flow-box total">
            <div class="lbl">Σ into 4×8</div>
            <div class="val" style="font-size:12px">${esc(fmtCfm(throughput))}</div>
            <div class="sub">2×4 + 4×8 intakes</div>
          </div>
        </div>
        <div class="dash-flow-col">
          <div class="col-h">4×8 exhaust · ${esc(fmtCfm(throughput))}</div>
          <div class="dash-flow-box out">
            <div class="lbl">DUMP OUTSIDE</div>
            <div class="val">${oPct}%</div>
            <div class="sub">${esc(fmtCfm(cfmOut))}</div>
          </div>
          <div class="dash-flow-box rec" style="margin-top:auto">
            <div class="lbl">RECIRC ROOM</div>
            <div class="val">${rPct}%</div>
            <div class="sub">${esc(fmtCfm(cfmRec))}</div>
          </div>
          <div class="dash-flow-box total">
            <div class="lbl">Σ dump + recirc</div>
            <div class="val" style="font-size:12px">${esc(
              fmtCfm(Number.isFinite(cfmOut) && Number.isFinite(cfmRec) ? cfmOut + cfmRec : NaN)
            )}</div>
            <div class="sub">must equal Σ intake</div>
          </div>
        </div>
      </div>
      <p class="dash-flow-caption" style="margin-top:8px">
        Mass balance: exhaust CFM = Σ intake (${esc(fmtCfm(throughput))}) × dump/recirc split (from fan %).
        Cascade is a transfer of 2×4 air — do not add it to intake total.
        Raw sensor.dsc_cfm_exhaust_* stay nameplate proxies until Learning cal.
        Heat mat is 2×4-only.
      </p>`;
  };

  const renderTimeline = (live) => {
    const stages = live.timelineStages || [];
    return `<div class="dash-timeline">${stages
      .map((s) => `<div class="dash-chev ${s.cls}">${esc(s.label)}</div>`)
      .join("")}</div>`;
  };

  /* ------------------------------------------------------------------ */
  /* Chart drawing                                                      */
  /* ------------------------------------------------------------------ */

  const drawMultiLineChart = (canvas, series, opts = {}) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 200;
    const h = canvas.clientHeight || 80;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(0, 0, w, h);

    const all = [];
    for (const s of series) for (const p of s.points || []) if (Number.isFinite(p.v)) all.push(p.v);
    let min = opts.min != null ? opts.min : all.length ? Math.min(...all) : 0;
    let max = opts.max != null ? opts.max : all.length ? Math.max(...all) : 1;
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const pad = 4;
    const now = Date.now();
    const span = (opts.hours || 24) * 3600 * 1000;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const y = pad + ((h - pad * 2) * i) / 3;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    for (const s of series) {
      const pts = (s.points || []).filter((p) => Number.isFinite(p.v) && Number.isFinite(p.t));
      if (pts.length < 2) {
        if (pts.length === 1) {
          ctx.fillStyle = s.color;
          const x = w - pad;
          const y = pad + (1 - (pts[0].v - min) / (max - min)) * (h - pad * 2);
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        continue;
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = pad + ((p.t - (now - span)) / span) * (w - pad * 2);
        const y = pad + (1 - (p.v - min) / (max - min)) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  };

  /* ------------------------------------------------------------------ */
  /* Three.js scene                                                     */
  /* ------------------------------------------------------------------ */

  const createScene = (host, opts) => {
    if (typeof THREE === "undefined") return null;
    const onSelectPot = opts && typeof opts.onSelectPot === "function" ? opts.onSelectPot : null;

    const fx = THREE.DSCDashFX || null;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);
    scene.fog = new THREE.Fog(0x07090e, 12, 28);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      // Needed so we can detect a black composer FBO and fall back to direct render.
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if ("outputEncoding" in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    if (THREE.PCFSoftShadowMap) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    let post = null;
    if (fx && typeof fx.createComposer === "function") {
      try {
        post = fx.createComposer(renderer, scene, camera);
        if (post && post.bloomPass) {
          post.bloomPass.threshold = 0.58;
          post.bloomPass.strength = 1.05;
          post.bloomPass.radius = 0.72;
        }
      } catch (_) {
        post = null;
      }
    }

    const root = new THREE.Group();
    scene.add(root);

    const hemi = new THREE.HemisphereLight(0xb8cce0, 0x1a1420, 0.48);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffe2c4, 1.22);
    key.position.set(5.5, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.00045;
    key.shadow.normalBias = 0.025;
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -4;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 22;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6eb4ff, 0.52);
    fill.position.set(-6, 4.5, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9a0ff, 0.42);
    rim.position.set(4, 5, -6);
    scene.add(rim);
    // Room practicals — ceiling wash + warm bounce (HVAC digital-twin cue)
    const ceilWash = new THREE.PointLight(0xd8e6f5, 1.35, 14, 1.6);
    ceilWash.position.set(0, 3.85, 0.2);
    scene.add(ceilWash);
    const ceilSpotA = new THREE.SpotLight(0xfff0dd, 1.8, 12, 0.55, 0.45, 1.2);
    ceilSpotA.position.set(-2.6, 3.9, 0.4);
    ceilSpotA.target.position.set(-2.75, 0.8, 0.3);
    scene.add(ceilSpotA);
    scene.add(ceilSpotA.target);
    const ceilSpotB = new THREE.SpotLight(0xffe8d6, 2.1, 14, 0.6, 0.4, 1.2);
    ceilSpotB.position.set(2.2, 3.95, 0.2);
    ceilSpotB.target.position.set(2.15, 0.9, 0.08);
    scene.add(ceilSpotB);
    scene.add(ceilSpotB.target);
    const floorBounce = new THREE.PointLight(0x5a7a98, 0.55, 10, 2);
    floorBounce.position.set(0, 0.35, 0.2);
    scene.add(floorBounce);
    const tentFillClone = new THREE.PointLight(0x7ec8ff, 0.15, 3.2, 2);
    tentFillClone.position.set(-2.75, 1.6, 0.3);
    scene.add(tentFillClone);
    const tentFillMain = new THREE.PointLight(0xffb08a, 0.2, 4.5, 2);
    tentFillMain.position.set(2.15, 1.7, 0.08);
    scene.add(tentFillMain);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(11.5, 0.1, 8.2),
      new THREE.MeshStandardMaterial({ color: 0x101820, metalness: 0.12, roughness: 0.86 })
    );
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    root.add(floor);
    // Soft floor sheen card — reads lit room, not void
    const floorSheen = new THREE.Mesh(
      new THREE.PlaneGeometry(10.2, 7.2),
      new THREE.MeshBasicMaterial({
        color: 0x2a4058,
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
      })
    );
    floorSheen.rotation.x = -Math.PI / 2;
    floorSheen.position.y = 0.02;
    root.add(floorSheen);
    const grid = new THREE.GridHelper(10.8, 24, 0x31445c, 0x182230);
    grid.position.y = 0.005;
    if (grid.material) {
      grid.material.transparent = true;
      grid.material.opacity = 0.28;
    }
    root.add(grid);

    // Ceiling plane + practical fixtures
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(10.6, 7.1),
      new THREE.MeshStandardMaterial({ color: 0x1a222c, metalness: 0.05, roughness: 0.92, side: THREE.DoubleSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4.05;
    ceiling.receiveShadow = true;
    root.add(ceiling);
    const mkCeilingFixture = (x, z) => {
      const fixture = new THREE.Group();
      const pan = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.06, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xe8eef4, emissive: 0xfff6e8, emissiveIntensity: 0.85, roughness: 0.4 })
      );
      fixture.add(pan);
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 0.5),
        new THREE.MeshBasicMaterial({
          color: 0xfff3dd,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      glow.rotation.x = Math.PI / 2;
      glow.position.y = -0.04;
      fixture.add(glow);
      fixture.position.set(x, 3.98, z);
      root.add(fixture);
      return fixture;
    };
    mkCeilingFixture(-3.2, 0.2);
    mkCeilingFixture(0, 0.2);
    mkCeilingFixture(3.2, 0.2);

    const roomShell = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 4.3, 7.3),
      new THREE.MeshStandardMaterial({
        color: 0x1c2a38,
        metalness: 0.08,
        roughness: 0.9,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
      })
    );
    roomShell.position.y = 2.05;
    root.add(roomShell);
    const roomEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(10.8, 4.3, 7.3)),
      new THREE.LineBasicMaterial({ color: 0x5a7a96, transparent: true, opacity: 0.22 })
    );
    roomEdges.position.copy(roomShell.position);
    root.add(roomEdges);
    // Soft ceiling volumetric wash (not mid-room blue boxes)
    const roomLungSlices = [];
    for (let s = 0; s < 3; s++) {
      const slice = new THREE.Mesh(
        new THREE.PlaneGeometry(9.2 - s * 0.4, 5.8 - s * 0.3),
        new THREE.MeshBasicMaterial({
          color: 0xc5d8ea,
          transparent: true,
          opacity: 0.018 + s * 0.006,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      slice.rotation.x = -Math.PI / 2;
      slice.position.set(0, 3.55 - s * 0.22, 0.15);
      root.add(slice);
      roomLungSlices.push(slice);
    }

    const addContact = (x, z, sx, sz) => {
      const contact = new THREE.Mesh(
        new THREE.CircleGeometry(1, 40),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.38,
          depthWrite: false,
        })
      );
      contact.rotation.x = -Math.PI / 2;
      contact.scale.set(sx, sz, 1);
      contact.position.set(x, 0.012, z);
      root.add(contact);
    };
    addContact(-2.75, 0.3, 1.62, 1.08);
    addContact(2.15, 0.08, 2.45, 1.5);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0xb4c0c9, metalness: 0.72, roughness: 0.28 });
    let surfaces = null;
    if (fx && typeof fx.createPhotorealSurfaces === "function") {
      try {
        surfaces = fx.createPhotorealSurfaces();
      } catch (_) {
        surfaces = null;
      }
    }
    const mylarMat = new THREE.MeshStandardMaterial({
      color: 0xc5d4e2,
      map: surfaces ? surfaces.mylar : null,
      metalness: 0.88,
      roughness: 0.18,
      transparent: true,
      opacity: 0.42,
      side: THREE.BackSide,
    });
    const mkFabric = (opacity) =>
      new THREE.MeshStandardMaterial({
        color: 0x121a24,
        map: surfaces ? surfaces.fabric : null,
        metalness: 0.08,
        roughness: 0.88,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
      });

    const mkTent = (w, d, h, accent, lightColor) => {
      const group = new THREE.Group();
      const panels = [
        [new THREE.BoxGeometry(w, h, 0.065), [0, h / 2, -d / 2], 0.94],
        [new THREE.BoxGeometry(0.065, h, d), [-w / 2, h / 2, 0], 0.84],
        [new THREE.BoxGeometry(0.065, h, d), [w / 2, h / 2, 0], 0.84],
        [new THREE.BoxGeometry(w, 0.065, d), [0, h, 0], 0.9],
      ];
      panels.forEach(([geometry, position, opacity]) => {
        const panel = new THREE.Mesh(geometry, mkFabric(opacity));
        panel.position.set(...position);
        panel.castShadow = true;
        panel.receiveShadow = true;
        group.add(panel);
      });
      const inner = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, h * 0.94, d * 0.94), mylarMat.clone());
      inner.position.y = h / 2;
      group.add(inner);
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.9, 0.05, d * 0.9),
        new THREE.MeshStandardMaterial({ color: 0x151e29, roughness: 0.78, metalness: 0.22 })
      );
      tray.position.y = 0.04;
      tray.receiveShadow = true;
      group.add(tray);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, h, 12), poleMat);
          pole.position.set((sx * w) / 2, h / 2, (sz * d) / 2);
          pole.castShadow = true;
          group.add(pole);
        }
      }
      // Eave / ridge tubes — grow-tent frame cue (not just 4 vertical poles)
      const railR = 0.028;
      const addRail = (len, pos, axis) => {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(railR, railR, len, 10), poleMat);
        rail.position.set(pos[0], pos[1], pos[2]);
        if (axis === "x") rail.rotation.z = Math.PI / 2;
        if (axis === "z") rail.rotation.x = Math.PI / 2;
        rail.castShadow = true;
        group.add(rail);
      };
      addRail(w, [0, h, -d / 2], "x");
      addRail(w, [0, h, d / 2], "x");
      addRail(d, [-w / 2, h, 0], "z");
      addRail(d, [w / 2, h, 0], "z");
      addRail(w, [0, 0.06, -d / 2], "x");
      addRail(w, [0, 0.06, d / 2], "x");
      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.55 })
      );
      frame.position.y = h / 2;
      group.add(frame);
      // Front door panel + zipper strip (replaces flat accent veil)
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.88, h * 0.9),
        new THREE.MeshStandardMaterial({
          color: 0x0e141c,
          map: surfaces ? surfaces.fabric : null,
          metalness: 0.06,
          roughness: 0.9,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide,
        })
      );
      door.position.set(0, h / 2, d / 2 + 0.002);
      group.add(door);
      // Viewing window mesh (clear PVC cue)
      const windowPane = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.28, h * 0.22),
        THREE.MeshPhysicalMaterial
          ? new THREE.MeshPhysicalMaterial({
              color: 0xa8c8e0,
              metalness: 0.05,
              roughness: 0.12,
              transmission: 0.55,
              transparent: true,
              opacity: 0.55,
              side: THREE.DoubleSide,
            })
          : new THREE.MeshStandardMaterial({
              color: 0xa8c8e0,
              metalness: 0.1,
              roughness: 0.15,
              transparent: true,
              opacity: 0.35,
              side: THREE.DoubleSide,
            })
      );
      windowPane.position.set(w * 0.22, h * 0.62, d / 2 + 0.006);
      group.add(windowPane);
      const zipper = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, h * 0.86, 0.012),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.7, roughness: 0.35, emissive: accent, emissiveIntensity: 0.15 })
      );
      zipper.position.set(0, h / 2, d / 2 + 0.01);
      group.add(zipper);
      const seam = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.02, h * 0.88),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.35, depthWrite: false })
      );
      seam.position.set(-w * 0.22, h / 2, d / 2 + 0.014);
      group.add(seam);

      const lightBar = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.62, 0.075, 0.24),
        new THREE.MeshStandardMaterial({
          color: 0x273544,
          emissive: lightColor,
          emissiveIntensity: 0,
          metalness: 0.48,
          roughness: 0.38,
          transparent: true,
          opacity: 1,
        })
      );
      lightBar.position.set(0, h - 0.15, 0);
      lightBar.castShadow = true;
      group.add(lightBar);
      const barRim = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.67, 0.025, 0.29),
        new THREE.MeshStandardMaterial({ color: 0x607786, metalness: 0.68, roughness: 0.3 })
      );
      barRim.position.set(0, h - 0.105, 0);
      group.add(barRim);

      const shaftMat = new THREE.MeshBasicMaterial({
        color: lightColor,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const shafts = new THREE.Group();
      for (let i = -1; i <= 1; i++) {
        const shaft = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.22, h * 0.72), shaftMat.clone());
        shaft.position.set(i * w * 0.22, h * 0.52, 0);
        shaft.rotation.x = -0.06 * i;
        shafts.add(shaft);
      }
      group.add(shafts);

      // Layered ACH volume stack (multi-slice additive haze — not a single flat box)
      const achHaze = new THREE.Group();
      const achSlices = [];
      for (let s = 0; s < 3; s++) {
        const slice = new THREE.Mesh(
          new THREE.BoxGeometry(w * (0.78 + s * 0.04), h * (0.22 + s * 0.08), d * (0.72 + s * 0.04)),
          new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          })
        );
        slice.position.y = h * (0.28 + s * 0.14);
        achHaze.add(slice);
        achSlices.push(slice);
      }
      group.add(achHaze);
      group.userData = { size: { w, d, h }, lightBar, shafts, achHaze, achSlices };
      return group;
    };

    const tentClone = mkTent(2.4, 1.5, 2.1, 0x26c6da, 0x65d6ff);
    tentClone.position.set(-2.75, 0, 0.3);
    root.add(tentClone);
    const tentMain = mkTent(3.8, 2.15, 2.45, 0xff8a65, 0xf48fb1);
    tentMain.position.set(2.15, 0, 0.08);
    tentMain.userData.lightBar.material.emissiveIntensity = 0;
    tentMain.userData.lightBar.material.opacity = 0.025;
    tentMain.userData.shafts.visible = false;
    root.add(tentMain);

    const mkCurve = (points) =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
        false,
        "catmullrom",
        0.18
      );
    // Duct ports are independent (no shared Y-stub). Tent anchors:
    // 2x4 @ (-2.75,0,0.3) ~2.4×2.1×1.5 → front face z≈1.05
    // 4x8 @ (2.15,0,0.08) ~3.8×2.45×2.15 → front z≈1.155; right x≈4.05; rear z≈-0.995
    const curves = {
      intakeClone: mkCurve([
        [-2.75, 0.38, 2.95],
        [-2.75, 0.38, 2.05],
        [-2.75, 0.38, 1.35],
        [-2.75, 0.38, 1.05],
        [-2.75, 0.42, 0.78],
      ]),
      intakeMain: mkCurve([
        [2.15, 0.38, 2.95],
        [2.15, 0.38, 2.05],
        [2.15, 0.38, 1.45],
        [2.15, 0.38, 1.155],
        [2.15, 0.42, 0.85],
      ]),
      cascade: mkCurve([
        [-1.55, 1.15, 0.28],
        [-0.95, 1.15, 0.22],
        [-0.35, 1.15, 0.16],
        [0.25, 1.15, 0.1],
      ]),
      // OUT: rear dump port on 4×8 (negative Z) → outdoor vent
      out: mkCurve([
        [2.55, 1.72, -1.12],
        [2.55, 1.88, -1.55],
        [2.55, 2.12, -2.05],
        [2.55, 2.32, -2.55],
        [2.55, 2.42, -3.05],
      ]),
      // RECIRC: right-wall port on 4×8 (+X) → room return (matches annotated layout)
      recirc: mkCurve([
        [4.05, 1.55, 0.08],
        [4.55, 1.48, 0.28],
        [5.15, 1.28, 0.65],
        [5.55, 1.08, 1.15],
        [5.75, 0.9, 1.75],
      ]),
    };

    const ductGroup = new THREE.Group();
    root.add(ductGroup);
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x7d8f9b, metalness: 0.76, roughness: 0.29 });
    const shellMaterials = {};
    const paths = {};
    const pathColors = {
      intakeClone: 0x42a5f5,
      intakeMain: 0x42a5f5,
      cascade: 0xffb74d,
      out: 0xff765e,
      recirc: 0xa85be0,
    };
    const addPath = (name, radius, tubular, solidColor) => {
      const mat = solidColor
        ? new THREE.MeshStandardMaterial({ color: solidColor, metalness: 0.72, roughness: 0.32 })
        : ductMat;
      const solid = new THREE.Mesh(new THREE.TubeGeometry(curves[name], tubular, radius, 12, false), mat);
      solid.castShadow = true;
      solid.receiveShadow = true;
      ductGroup.add(solid);
      const shellMat = new THREE.MeshBasicMaterial({
        color: pathColors[name],
        transparent: true,
        // Exhaust legs keep a faint idle glow so OUT vs RECIRC read at 0 CFM.
        opacity: name === "out" || name === "recirc" ? 0.14 : 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const shell = new THREE.Mesh(new THREE.TubeGeometry(curves[name], tubular, radius * 1.22, 10, false), shellMat);
      ductGroup.add(shell);
      shellMaterials[name] = shellMat;
      let ribbon = null;
      if (fx && typeof fx.makeFlowRibbon === "function") {
        try {
          ribbon = fx.makeFlowRibbon(curves[name], {
            radius: radius * (name === "cascade" ? 0.48 : 0.36),
            tubular,
            color: pathColors[name],
            opacity: name === "out" || name === "recirc" ? 0.1 : 0,
            dashArray: name === "cascade" ? [0.12, 0.055] : [0.11, 0.085],
          });
          ribbon.userData.flow = { name, curve: curves[name], tubular, baseRadius: radius * 0.48, lastWidth: -1 };
          ductGroup.add(ribbon);
        } catch (_) {
          ribbon = null;
        }
      }
      paths[name] = { solid, shell, ribbon, intensity: 0, shaft: null, portJet: null };
    };
    addPath("intakeClone", 0.11, 44);
    addPath("intakeMain", 0.12, 44);
    addPath("cascade", 0.105, 48);
    addPath("out", 0.122, 50, 0x8a6a62);
    addPath("recirc", 0.118, 50, 0x6a6288);

    // Soft smoke-test shafts along ducts (HVAC pathline cinema — CFM-gated)
    const mkFlowShaft = (name, radius) => {
      const curve = curves[name];
      const shaft = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 36, radius * 1.85, 8, false),
        new THREE.MeshBasicMaterial({
          color: pathColors[name],
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      shaft.renderOrder = 2;
      ductGroup.add(shaft);
      paths[name].shaft = shaft;
      const isIntake = name.startsWith("intake");
      // Intakes: flare at tent pierce (suck-in). Exhaust: flare just inside port (suction).
      const jetT = isIntake ? 0.92 : 0.04;
      const jet = new THREE.Mesh(
        new THREE.ConeGeometry(radius * (isIntake ? 1.35 : 1.7), radius * (isIntake ? 2.4 : 3.4), 16, 1, true),
        new THREE.MeshBasicMaterial({
          color: pathColors[name],
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      const p0 = curve.getPoint(jetT);
      const t0 = curve.getTangent(jetT).normalize();
      // Point along flow: intakes into tent (+tangent), exhaust out of tent (+tangent from port)
      jet.position.copy(p0);
      jet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), isIntake ? t0 : t0);
      if (!isIntake) jet.position.addScaledVector(t0, -radius * 0.5);
      ductGroup.add(jet);
      paths[name].portJet = jet;
    };
    mkFlowShaft("intakeClone", 0.11);
    mkFlowShaft("intakeMain", 0.12);
    mkFlowShaft("cascade", 0.105);
    mkFlowShaft("out", 0.122);
    mkFlowShaft("recirc", 0.118);

    const addFlexRings = (curve, count, radius) => {
      const geometry = new THREE.TorusGeometry(radius, 0.011, 6, 18);
      const material = new THREE.MeshStandardMaterial({ color: 0xc8d2da, metalness: 0.88, roughness: 0.24 });
      const rings = new THREE.InstancedMesh(geometry, material, count);
      const matrix = new THREE.Matrix4();
      const scale = new THREE.Vector3(1, 1, 1);
      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count;
        const p = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        matrix.compose(p, quaternion, scale);
        rings.setMatrixAt(i, matrix);
      }
      rings.castShadow = true;
      ductGroup.add(rings);
    };
    addFlexRings(curves.intakeClone, 48, 0.126);
    addFlexRings(curves.intakeMain, 48, 0.137);
    addFlexRings(curves.cascade, 36, 0.118);
    addFlexRings(curves.out, 52, 0.138);
    addFlexRings(curves.recirc, 52, 0.134);

    const flangePrimitives = [];
    const mkFlange = (point, tangent, radius) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.026, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.75, roughness: 0.28 })
      );
      ring.position.copy(point);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent.clone().normalize());
      ring.castShadow = true;
      ductGroup.add(ring);
      flangePrimitives.push(ring);
      return ring;
    };
    Object.values(curves).forEach((curve) => {
      mkFlange(curve.getPoint(0.02), curve.getTangent(0.02), 0.15);
      mkFlange(curve.getPoint(0.98), curve.getTangent(0.98), 0.15);
    });

    // Tent cinch-port collars where ducts pierce walls (grow-tent style)
    const mkCinchPort = (point, tangent, radius, accentHex) => {
      const g = new THREE.Group();
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.032, 10, 28),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.78, roughness: 0.26, emissive: accentHex, emissiveIntensity: 0.12 })
      );
      const sleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.08, 20, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.55, roughness: 0.4 })
      );
      sleeve.rotation.x = Math.PI / 2;
      g.add(rim);
      g.add(sleeve);
      g.position.copy(point);
      g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent.clone().normalize());
      ductGroup.add(g);
      return g;
    };
    // Tent cinch-port collars at fabric pierces (grow-tent style)
    mkCinchPort(curves.out.getPoint(0.02), curves.out.getTangent(0.02), 0.16, 0xff765e);
    mkCinchPort(curves.recirc.getPoint(0.02), curves.recirc.getTangent(0.02), 0.155, 0xa85be0);
    // Intakes: room-side collar + front-wall pierce (~t 0.72 on 5-point curves)
    mkCinchPort(curves.intakeClone.getPoint(0.02), curves.intakeClone.getTangent(0.02), 0.135, 0x42a5f5);
    mkCinchPort(curves.intakeClone.getPoint(0.72), curves.intakeClone.getTangent(0.72), 0.14, 0x42a5f5);
    mkCinchPort(curves.intakeMain.getPoint(0.02), curves.intakeMain.getTangent(0.02), 0.14, 0x42a5f5);
    mkCinchPort(curves.intakeMain.getPoint(0.72), curves.intakeMain.getTangent(0.72), 0.145, 0x42a5f5);
    mkCinchPort(curves.cascade.getPoint(0.02), curves.cascade.getTangent(0.02), 0.13, 0xffb74d);
    mkCinchPort(curves.cascade.getPoint(0.98), curves.cascade.getTangent(0.98), 0.13, 0xffb74d);

    const mkFan = (curve, t, color) => {
      const group = new THREE.Group();
      const axis = curve.getTangent(t).normalize();
      group.position.copy(curve.getPoint(t));
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
      // Cloudline-like short inline housing + end flanges (primitive; GLTF may replace)
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.42, 32, 1, false),
        new THREE.MeshStandardMaterial({ color: 0x243038, metalness: 0.82, roughness: 0.22 })
      );
      housing.castShadow = true;
      group.add(housing);
      const badge = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.28, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xeceff1, metalness: 0.35, roughness: 0.4 })
      );
      badge.position.set(0.215, 0, 0);
      group.add(badge);
      for (const y of [-0.22, 0.22]) {
        const flange = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.26, 0.038, 32),
          new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.85, roughness: 0.22 })
        );
        flange.position.y = y;
        group.add(flange);
        const bolts = new THREE.Group();
        for (let b = 0; b < 6; b++) {
          const bolt = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, 0.02, 6),
            new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.2 })
          );
          const ang = (b / 6) * Math.PI * 2;
          bolt.position.set(Math.cos(ang) * 0.23, y, Math.sin(ang) * 0.23);
          bolts.add(bolt);
        }
        group.add(bolts);
      }
      const guard = new THREE.Mesh(
        new THREE.TorusGeometry(0.175, 0.014, 8, 28),
        new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.82, roughness: 0.2 })
      );
      guard.rotation.x = Math.PI / 2;
      group.add(guard);
      const rotor = new THREE.Group();
      for (let i = 0; i < 9; i++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.038, 0.014, 0.3),
          new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.16, metalness: 0.45, roughness: 0.35 })
        );
        blade.position.z = 0.02;
        blade.rotation.y = (i * Math.PI * 2) / 9;
        blade.rotation.z = 0.18;
        rotor.add(blade);
      }
      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0xe8edf0, metalness: 0.5, roughness: 0.22 })
      );
      rotor.add(hub);
      group.add(rotor);
      group.userData = { rotor, axis: axis.clone(), speed: 0 };
      ductGroup.add(group);
      return group;
    };
    const fans = {
      intakeClone: mkFan(curves.intakeClone, 0.46, 0x64b5f6),
      intakeMain: mkFan(curves.intakeMain, 0.46, 0x64b5f6),
      exhaust: mkFan(curves.out, 0.28, 0xff8a65),
      recirc: mkFan(curves.recirc, 0.28, 0xba68c8),
    };

    const muffler = new THREE.Group();
    const muffBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.215, 0.215, 0.55, 24),
      new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.62, roughness: 0.4 })
    );
    muffBody.rotation.x = Math.PI / 2;
    muffBody.castShadow = true;
    muffler.add(muffBody);
    for (const z of [-0.2, 0, 0.2]) {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.225, 0.022, 8, 22),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.75, roughness: 0.3 })
      );
      band.position.z = z;
      muffler.add(band);
    }
    muffler.position.copy(curves.out.getPoint(0.62));
    muffler.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curves.out.getTangent(0.62).normalize());
    ductGroup.add(muffler);
    // Offline GLTF accents (primitive fallback already in scene)
    if (fx && typeof fx.loadSimpleGltf === "function") {
      const accentBase = "/local/assets/dash/";
      fx.loadSimpleGltf(
        `${accentBase}muffler.gltf`,
        (mesh) => {
          mesh.material = muffBody.material.clone();
          mesh.rotation.copy(muffBody.rotation);
          muffler.remove(muffBody);
          muffBody.geometry.dispose();
          muffler.add(mesh);
        },
        () => {}
      );
      Object.values(fans).forEach((fan) => {
        fx.loadSimpleGltf(
          `${accentBase}fan_housing.gltf`,
          (mesh) => {
            const housing = fan.children.find((c) => c.geometry && c.geometry.type === "CylinderGeometry");
            if (!housing) return;
            mesh.material = housing.material.clone();
            fan.remove(housing);
            housing.geometry.dispose();
            fan.add(mesh);
          },
          () => {}
        );
      });
      fx.loadSimpleGltf(
        `${accentBase}flange.gltf`,
        (template) => {
          const targetMajor = 0.15;
          const sourceMajor = 0.208;
          const scale = targetMajor / sourceMajor;
          flangePrimitives.forEach((ring) => {
            try {
              const mesh = new THREE.Mesh(
                template.geometry.clone(),
                ring.material ? ring.material.clone() : template.material.clone()
              );
              mesh.position.copy(ring.position);
              mesh.quaternion.copy(ring.quaternion);
              mesh.scale.setScalar(scale);
              mesh.castShadow = true;
              mesh.name = "flangeAccent";
              ductGroup.add(mesh);
              ductGroup.remove(ring);
              ring.geometry.dispose();
              if (ring.material) ring.material.dispose();
            } catch (_) {
              /* keep torus primitive */
            }
          });
        },
        () => {}
      );
    }

    const vent = new THREE.Group();
    const ventGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.35, 1.05),
      new THREE.MeshBasicMaterial({
        color: 0xff735a,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    vent.add(ventGlow);
    const ventPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.9, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x172331, metalness: 0.5, roughness: 0.42 })
    );
    ventPlate.position.z = 0.015;
    vent.add(ventPlate);
    for (let i = -3; i <= 3; i++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.98, 0.045, 0.055),
        new THREE.MeshStandardMaterial({ color: 0xff846d, emissive: 0xff5d45, emissiveIntensity: 0.5 })
      );
      slat.position.set(0, i * 0.105, 0.07);
      vent.add(slat);
    }
    vent.position.copy(curves.out.getPoint(1));
    root.add(vent);

    const arrowByPath = {};
    const addArrow = (name, t) => {
      const arrow = new THREE.ArrowHelper(
        curves[name].getTangent(t).normalize(),
        curves[name].getPoint(t),
        0.44,
        pathColors[name],
        0.18,
        0.11
      );
      arrow.visible = false;
      arrowByPath[name] = arrowByPath[name] || [];
      arrowByPath[name].push(arrow);
      ductGroup.add(arrow);
    };
    addArrow("intakeClone", 0.28);
    addArrow("intakeMain", 0.28);
    addArrow("cascade", 0.5);
    addArrow("out", 0.78);
    addArrow("recirc", 0.72);

    let rampTexture = null;
    let mergeRampTexture = null;
    if (fx && typeof fx.createColorRamp === "function") {
      try {
        // Cascade → 4×8 merge cue only (OUT/RECIRC are separate ports — no shared Y ramp).
        mergeRampTexture = fx.createColorRamp([
          { t: 0, color: 0x42a5f5 },
          { t: 0.55, color: 0xffb74d },
          { t: 1, color: 0xff9148 },
        ]);
        const merge = new THREE.Mesh(
          new THREE.PlaneGeometry(0.58, 0.1),
          new THREE.MeshBasicMaterial({
            map: mergeRampTexture,
            transparent: true,
            opacity: 0.48,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          })
        );
        const mergePt = curves.cascade.getPoint(0.92);
        merge.position.copy(mergePt);
        merge.position.y += 0.08;
        merge.lookAt(camera.position);
        root.add(merge);
        rampTexture = mergeRampTexture;
      } catch (_) {
        rampTexture = null;
        mergeRampTexture = null;
      }
    }

    const growMat = new THREE.Group();
    const matRim = new THREE.Mesh(
      new THREE.BoxGeometry(1.68, 0.035, 1.14),
      new THREE.MeshStandardMaterial({ color: 0x6d3d29, metalness: 0.35, roughness: 0.45 })
    );
    growMat.add(matRim);
    const matPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.58, 0.052, 1.04),
      new THREE.MeshStandardMaterial({
        color: 0x3b1f18,
        emissive: 0xff5a00,
        emissiveIntensity: 0,
        roughness: 0.58,
      })
    );
    matPlate.position.y = 0.025;
    growMat.add(matPlate);
    const matGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 1.18),
      new THREE.MeshBasicMaterial({
        color: 0xff6d00,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    matGlow.rotation.x = -Math.PI / 2;
    matGlow.position.y = 0.07;
    growMat.add(matGlow);
    growMat.position.set(0, 0.095, 0);
    tentClone.add(growMat);

    const appliances = {};
    const addAppliance = (name, x, z, color) => {
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.36, 0.36),
        new THREE.MeshStandardMaterial({ color: 0x202936, emissive: color, emissiveIntensity: 0, roughness: 0.48 })
      );
      body.position.set(x, 0.18, z);
      body.castShadow = true;
      root.add(body);
      appliances[name] = body;
    };
    addAppliance("heater", -4.35, 1.4, 0xff7043);
    addAppliance("ac", -4.35, 0.65, 0x4fc3f7);
    addAppliance("humidifier", -4.35, -0.1, 0x29b6f6);
    addAppliance("dehumidifier", -4.35, -0.85, 0x80cbc4);
    addAppliance("clone_humidifier", -3.85, 1.35, 0x81d4fa);

    const pots = { clone: [], main: [] };
    const leafPlane = new THREE.PlaneGeometry(1, 1.15);
    const mkPlant = (tall) => {
      const plant = new THREE.Group();
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.14, 0.2, 20),
        new THREE.MeshStandardMaterial({
          color: 0x7a4530,
          roughness: 0.9,
          metalness: 0.04,
        })
      );
      pot.position.y = 0.11;
      pot.castShadow = true;
      pot.receiveShadow = true;
      plant.add(pot);
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.165, 0.014, 10, 24),
        new THREE.MeshStandardMaterial({ color: 0x4a2c1e, roughness: 0.75, metalness: 0.08 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.21;
      plant.add(rim);
      const soil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.045, 16),
        new THREE.MeshStandardMaterial({
          color: 0x2a1c14,
          roughness: 1,
          map: surfaces ? surfaces.soil : null,
        })
      );
      soil.position.y = 0.2;
      plant.add(soil);
      const stemHeight = tall ? 0.78 : 0.42;
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.026, stemHeight, 10),
        new THREE.MeshStandardMaterial({ color: 0x245a32, roughness: 0.65, metalness: 0.05 })
      );
      stem.position.y = 0.22 + stemHeight / 2;
      stem.castShadow = true;
      plant.add(stem);
      const leafMat = new THREE.MeshStandardMaterial({
        color: surfaces && surfaces.leaf ? 0xffffff : 0x3f9a52,
        map: surfaces ? surfaces.leaf : null,
        transparent: !!(surfaces && surfaces.leaf),
        alphaTest: surfaces && surfaces.leaf ? 0.28 : 0,
        emissive: 0x0a2812,
        emissiveIntensity: 0.16,
        roughness: 0.48,
        metalness: 0.02,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const leaflet = (scale) => {
        const leaf = new THREE.Mesh(leafPlane.clone(), leafMat.clone());
        leaf.scale.set(0.14 * scale, 0.14 * scale, 0.14 * scale);
        leaf.castShadow = true;
        return leaf;
      };
      const tiers = tall ? 5 : 3;
      const perTier = tall ? 6 : 4;
      for (let t = 0; t < tiers; t++) {
        const y = 0.34 + (t / Math.max(1, tiers - 1)) * stemHeight * 0.82;
        const rad = 0.08 + t * 0.04;
        for (let i = 0; i < perTier; i++) {
          const angle = (i / perTier) * Math.PI * 2 + t * 0.4;
          const fan = new THREE.Group();
          const fingers = tall ? 7 : 5;
          for (let f = 0; f < fingers; f++) {
            const mid = Math.floor(fingers / 2);
            const pet = leaflet((tall ? 1.05 : 0.82) * (0.75 + (f === mid ? 0.35 : 0)));
            const a = ((f - (fingers - 1) / 2) / ((fingers - 1) / 2 || 1)) * 0.7;
            pet.position.set(Math.cos(a) * 0.05, 0.02, Math.sin(a) * 0.03);
            pet.rotation.set(-0.85 + Math.abs(a) * 0.15, a * 0.35, a * 0.45);
            fan.add(pet);
          }
          fan.position.set(Math.cos(angle) * rad, y, Math.sin(angle) * rad);
          fan.rotation.y = -angle;
          fan.rotation.x = -0.4 - t * 0.04;
          plant.add(fan);
        }
      }
      const cola = new THREE.Group();
      for (let c = 0; c < (tall ? 5 : 3); c++) {
        const tip = leaflet(tall ? 0.7 : 0.55);
        tip.position.set((c - 2) * 0.03, stemHeight * 0.02, ((c % 2) - 0.5) * 0.02);
        tip.rotation.x = -1.1;
        cola.add(tip);
      }
      cola.position.y = 0.22 + stemHeight + 0.02;
      plant.add(cola);
      plant.userData.canopyMaterial = leafMat;
      plant.visible = false;
      return plant;
    };
    const placePlants = (tent, key, count, cols, tall) => {
      const size = tent.userData.size;
      for (let i = 0; i < count; i++) {
        const rows = Math.ceil(count / cols);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const plant = mkPlant(tall);
        plant.position.set(
          (col - (cols - 1) / 2) * size.w * 0.24,
          key === "clone" ? 0.13 : 0.08,
          (row - (rows - 1) / 2) * size.d * 0.3
        );
        tent.add(plant);
        pots[key].push(plant);
      }
    };
    placePlants(tentClone, "clone", 4, 2, false);
    placePlants(tentMain, "main", 8, 4, true);

    // Slot plants stay as invisible pad markers; free-floating potActors are the visible plants.
    const padWorld = { clone: [], main: [] };
    const _padTmp = new THREE.Vector3();
    const _rootLocal = new THREE.Vector3();
    ["clone", "main"].forEach((key) => {
      pots[key].forEach((plant, i) => {
        plant.visible = false;
        plant.userData.padMarker = true;
        padWorld[key][i] = new THREE.Vector3();
      });
    });
    const potActors = {};
    const refreshPadWorld = () => {
      ["clone", "main"].forEach((key) => {
        pots[key].forEach((plant, i) => {
          plant.getWorldPosition(_padTmp);
          root.worldToLocal(_rootLocal.copy(_padTmp));
          padWorld[key][i].copy(_rootLocal);
        });
      });
    };
    for (let n = 1; n <= 4; n++) {
      const actor = mkPlant(n >= 3);
      actor.visible = false;
      actor.userData.potNum = n;
      actor.userData.potId = `pot${n}`;
      actor.userData.lerpReady = false;
      actor.userData.highlightUntil = 0;
      root.add(actor);
      potActors[`pot${n}`] = actor;
    }
    let selectedPotNum = 0;
    const setSelectedPot = (n) => {
      selectedPotNum = Number(n) || 0;
      Object.values(potActors).forEach((actor) => {
        const on = actor.userData.potNum === selectedPotNum;
        if (on) actor.userData.highlightUntil = performance.now() + 1600;
        const canopy = actor.userData.canopyMaterial;
        if (canopy && canopy.emissiveIntensity != null) {
          canopy.emissiveIntensity = on ? 0.55 : 0.16;
        }
      });
    };

    let spriteTexture = null;
    if (fx && typeof fx.createSoftSpriteTexture === "function") {
      try {
        spriteTexture = fx.createSoftSpriteTexture(64);
      } catch (_) {
        spriteTexture = null;
      }
    }
    const air = {};
    const mkAir = (name, color, count, size) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      // True soft particles: sample scene DepthTexture vs particle view-Z
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: spriteTexture },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
          uSize: { value: size * 180 },
          uHasMap: { value: spriteTexture ? 1 : 0 },
          tDepth: { value: null },
          uHasDepth: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uCameraNear: { value: 0.1 },
          uCameraFar: { value: 80 },
          uSoftness: { value: 0.55 },
        },
        vertexShader: `
          uniform float uSize;
          varying float vViewZ;
          varying float vViewSoft;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vViewZ = -mv.z;
            vViewSoft = smoothstep(0.35, 2.8, vViewZ) * smoothstep(18.0, 6.0, vViewZ);
            gl_PointSize = uSize * (1.0 / max(1.0, vViewZ));
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          uniform sampler2D tDepth;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uHasMap;
          uniform float uHasDepth;
          uniform vec2 uResolution;
          uniform float uCameraNear;
          uniform float uCameraFar;
          uniform float uSoftness;
          varying float vViewZ;
          varying float vViewSoft;
          float perspDepthToViewZ(float d, float near, float far) {
            float z = d * 2.0 - 1.0;
            return (2.0 * near * far) / (far + near - z * (far - near));
          }
          void main() {
            // Elongated streak (HVAC pathline / smoke-test cue), not round blur balls
            vec2 uv = gl_PointCoord - 0.5;
            uv.y *= 2.8;
            float softEdge = 1.0 - smoothstep(0.22, 0.5, length(uv));
            float alpha = softEdge * vViewSoft * uOpacity;
            if (uHasMap > 0.5) {
              vec2 mapUv = vec2(gl_PointCoord.x, 0.5 + (gl_PointCoord.y - 0.5) * 0.55);
              alpha *= texture2D(uMap, mapUv).a;
            }
            if (uHasDepth > 0.5) {
              vec2 screenUv = gl_FragCoord.xy / uResolution;
              float sceneD = texture2D(tDepth, screenUv).x;
              float sceneZ = perspDepthToViewZ(sceneD, uCameraNear, uCameraFar);
              float dz = sceneZ - vViewZ;
              alpha *= smoothstep(0.0, uSoftness, dz);
            }
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      if (post && typeof post.registerSoftParticleMaterial === "function") {
        post.registerSoftParticleMaterial(material);
        // Only isolate particles on layer 1 when DepthTexture soft-intersect is live.
        if (post.depthTexture) points.layers.set(1);
      }
      root.add(points);
      const phase = new Float32Array(count);
      const seed = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        phase[i] = Math.random();
        seed[i] = Math.random();
      }
      air[name] = {
        points,
        positions,
        material,
        count,
        phase,
        seed,
        intensity: 0,
        setOpacity: (v) => {
          material.uniforms.uOpacity.value = v;
        },
        setColor: (c) => {
          material.uniforms.uColor.value.copy(c);
        },
      };
    };
    mkAir("intakeClone", 0x5eb8ff, 88, 0.055);
    mkAir("intakeMain", 0x5eb8ff, 96, 0.055);
    mkAir("cascade", 0xffc107, 96, 0.058);
    mkAir("out", 0xff8a65, 96, 0.058);
    mkAir("recirc", 0xce93d8, 96, 0.058);
    mkAir("matHeat", 0xff6d00, 34, 0.09);
    // Through-tent flow legs (not confined curl haze — that read as bouncing blur balls)
    mkAir("flowClone", 0x81d4fa, 72, 0.05);
    mkAir("flowMain", 0xffab91, 110, 0.05);
    const particleColors = {
      intake: new THREE.Color(0x42a5f5),
      intakeWarm: new THREE.Color(0x66a4d9).lerp(new THREE.Color(0xff9b55), 0.16),
      cascade: new THREE.Color(0xffb74d),
      cascadeWarm: new THREE.Color(0xff9148),
      mixCool: new THREE.Color(0x5eb8f0),
      mixWarm: new THREE.Color(0xff9a6b),
    };

    // Ambient room curl haze retired — it read as flying blur balls, not CFM flow.
    let curl = null;
    const confinedMix = [];

    const sampleCurve = (curve, t, radius, seed) => {
      const clamped = Math.max(0, Math.min(1, t));
      const point = curve.getPoint(clamped);
      const tangent = curve.getTangent(clamped);
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x);
      if (side.lengthSq() < 0.001) side.set(1, 0, 0);
      side.normalize();
      const up = new THREE.Vector3().crossVectors(tangent, side).normalize();
      const angle = seed * Math.PI * 2 + t * 8;
      // Tight centerline jitter so duct streams read as flow, not fog
      const r = radius * (0.22 + seed * 0.28);
      return point.addScaledVector(side, Math.cos(angle) * r).addScaledVector(up, Math.sin(angle) * r);
    };

    const climateValue = (zone, key) => {
      const source = live.climate && live.climate[zone] != null ? live.climate[zone] : live[`${zone}Climate`];
      if (source && typeof source === "object" && Number.isFinite(Number(source[key]))) return Number(source[key]);
      if (typeof source !== "string") return NaN;
      const nums = source.match(/-?\d+(?:\.\d+)?/g) || [];
      const index = key === "temperature" ? 0 : key === "humidity" ? 1 : 2;
      return Number(nums[index]);
    };

    const setZoneTint = () => {
      const cloneTemp = climateValue("clone", "temperature");
      const mainTemp = climateValue("main", "temperature");
      const roomHumidity = climateValue("room", "humidity");
      const tint = (value) => {
        if (!Number.isFinite(value)) return new THREE.Color(0x7bb8d7);
        const n = Math.max(0, Math.min(1, (value - 18) / 12));
        return new THREE.Color(0x5e9cff).lerp(new THREE.Color(0xff855e), n);
      };
      const cloneTint = tint(cloneTemp);
      const mainTint = tint(mainTemp);
      (tentClone.userData.achSlices || []).forEach((slice) => slice.material.color.copy(cloneTint));
      (tentMain.userData.achSlices || []).forEach((slice) => slice.material.color.copy(mainTint));
      roomShell.material.color.set(Number.isFinite(roomHumidity) && roomHumidity > 65 ? 0x355f72 : 0x183047);
      roomLungSlices.forEach((slice) => {
        slice.material.color.set(Number.isFinite(roomHumidity) && roomHumidity > 65 ? 0x4a8aaa : 0x3d7ea8);
      });
    };

    const orbit = { theta: 0.72, phi: 1.0, radius: 11.7, dragging: false, x: 0, y: 0 };
    const applyCamera = () => {
      camera.position.set(
        orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta),
        orbit.radius * Math.cos(orbit.phi),
        orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta)
      );
      camera.lookAt(0, 1.15, 0.15);
    };
    applyCamera();
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let ptrDown = null;
    const pickPotAt = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return 0;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const targets = Object.values(potActors).filter((a) => a.visible);
      if (!targets.length) return 0;
      const hits = raycaster.intersectObjects(targets, true);
      if (!hits.length) return 0;
      let obj = hits[0].object;
      while (obj && !obj.userData.potNum && obj.parent) obj = obj.parent;
      return (obj && obj.userData.potNum) || 0;
    };
    const onDown = (event) => {
      orbit.dragging = true;
      orbit.x = event.clientX;
      orbit.y = event.clientY;
      ptrDown = { x: event.clientX, y: event.clientY };
    };
    const onUp = (event) => {
      orbit.dragging = false;
      if (ptrDown) {
        const dx = (event.clientX || 0) - ptrDown.x;
        const dy = (event.clientY || 0) - ptrDown.y;
        if (Math.hypot(dx, dy) < 6) {
          const n = pickPotAt(event.clientX, event.clientY);
          if (n) {
            setSelectedPot(n);
            if (onSelectPot) onSelectPot(n);
          }
        }
      }
      ptrDown = null;
    };
    const onMove = (event) => {
      if (!orbit.dragging) return;
      orbit.theta -= (event.clientX - orbit.x) * 0.005;
      orbit.phi = Math.max(0.34, Math.min(1.38, orbit.phi + (event.clientY - orbit.y) * 0.005));
      orbit.x = event.clientX;
      orbit.y = event.clientY;
      applyCamera();
    };
    const onWheel = (event) => {
      event.preventDefault();
      orbit.radius = Math.max(7.5, Math.min(17, orbit.radius + event.deltaY * 0.01));
      applyCamera();
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    let live = {};
    const setLive = (next) => {
      live = next || {};
      setZoneTint();
    };
    const resize = () => {
      const width = host.clientWidth || 640;
      const height = host.clientHeight || 400;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (post && typeof post.setSize === "function") post.setSize(width, height);
      Object.values(paths).forEach((path) => {
        const res = path.ribbon && path.ribbon.material && path.ribbon.material.userData && path.ribbon.material.userData.uResolution;
        if (res && res.value) res.value.set(width, height);
      });
    };

    const highlights = (name) => {
      const wanted = String(live.pathHighlight || "").toLowerCase();
      if (!wanted) return false;
      if (wanted === "intake") return name === "intakeClone" || name === "intakeMain";
      return wanted === name;
    };
    const updatePathVisual = (name, intensity, now) => {
      const path = paths[name];
      const active = intensity >= 0.04;
      const boost = highlights(name) ? 1.45 : 1;
      const shown = active ? Math.min(1, intensity * boost) : 0;
      path.intensity = shown;
      const idleGlow = name === "out" || name === "recirc" ? 0.14 : 0;
      path.shell.material.opacity = active ? Math.max(idleGlow, 0.1 + shown * 0.48) : idleGlow;
      if (path.shaft) {
        path.shaft.material.opacity = active ? 0.055 + shown * 0.2 : 0;
      }
      if (path.portJet) {
        path.portJet.material.opacity = active ? 0.12 + shown * 0.35 : 0;
        const pulse = 0.92 + Math.sin(now * 0.008 + shown * 4) * 0.08;
        path.portJet.scale.setScalar(pulse);
      }
      (arrowByPath[name] || []).forEach((arrow) => {
        arrow.visible = active || name === "out" || name === "recirc";
        if (arrow.visible) arrow.scale.setScalar(0.88 + Math.sin(now * 0.005) * 0.12);
      });
      if (path.ribbon) {
        const uniforms = path.ribbon.material.userData;
        uniforms.uOpacity.value = active
          ? (name === "cascade" ? 0.55 : 0.38) + shown * 0.55
          : name === "out" || name === "recirc"
            ? 0.14
            : 0;
        // Velocity-band dash speed ∝ CFM (duct-network sim cue)
        uniforms.uDashOffset.value -= 0.008 + shown * 0.032;
        const width = active ? 0.55 + shown * 1.05 : 0.34;
        if (Math.abs(width - path.ribbon.userData.flow.lastWidth) > 0.08) {
          const nextRadius = path.ribbon.userData.flow.baseRadius * width;
          if (typeof path.ribbon.userData.rebuildFlowRibbon === "function") {
            path.ribbon.userData.rebuildFlowRibbon(nextRadius);
          } else if (fx && typeof fx.rebuildFlowRibbonGeometry === "function") {
            fx.rebuildFlowRibbonGeometry(
              path.ribbon,
              path.ribbon.userData.flow.curve,
              path.ribbon.userData.flow.tubular,
              nextRadius
            );
          } else {
            path.ribbon.geometry.dispose();
            path.ribbon.geometry = new THREE.TubeGeometry(
              path.ribbon.userData.flow.curve,
              path.ribbon.userData.flow.tubular,
              nextRadius,
              6,
              false
            );
          }
          path.ribbon.userData.flow.lastWidth = width;
        }
      }
    };

    const cfmNorm = (cfm, scale = 80) => Math.min(1, Math.max(0, Number(cfm) || 0) / scale);

    const updateSystem = (name, curve, dt, intensity, mapper, speedAt) => {
      const system = air[name];
      if (!system || !system.positions) return;
      const active = intensity >= 0.04;
      const boost = highlights(name) || (name.startsWith("intake") && highlights("intake")) ? 1.42 : 1;
      const shown = active ? Math.min(1, intensity * boost) : 0;
      system.intensity = shown;
      system.points.visible = active;
      system.setOpacity(active ? Math.min(1, 0.42 + shown * 0.58) : 0);
      if (!active) return;
      const baseSpeed = 0.2 + shown * 1.05;
      const activeCount = Math.max(16, Math.floor(system.count * (0.5 + shown * 0.5)));
      for (let i = 0; i < system.count; i++) {
        if (i >= activeCount) {
          system.positions[i * 3 + 1] = -99;
          continue;
        }
        const t0 = system.phase[i];
        const pace = typeof speedAt === "function" ? Math.max(0.12, speedAt(t0, system.seed[i])) : 1;
        system.phase[i] = (t0 + dt * baseSpeed * pace * (0.82 + (i % 7) * 0.045)) % 1;
        const point = mapper
          ? mapper(system.phase[i], system.seed[i], i)
          : sampleCurve(curve, system.phase[i], 0.016, system.seed[i]);
        system.positions[i * 3] = point.x;
        system.positions[i * 3 + 1] = point.y;
        system.positions[i * 3 + 2] = point.z;
      }
      system.points.geometry.attributes.position.needsUpdate = true;
    };

    /** World point inside a tent (local fractions: x/z -0.5..0.5, y 0..1). */
    const tentPoint = (tent, fx, fy, fz) => {
      const size = tent.userData.size;
      const local = new THREE.Vector3(fx * size.w, fy * size.h, fz * size.d);
      return tent.localToWorld(local);
    };

    /**
     * Full journey: duct → entry → slow pool → exit pull.
     * 0–0.38 duct, 0.38–0.52 entry, 0.52–0.78 pool, 0.78–1 exit.
     */
    const journeyThroughTent = (t, seed, i, opts) => {
      const intakeCurve = opts.intakeCurve;
      const exits = opts.exits || [];
      const tent = opts.tent;
      let pick = exits[0] && exits[0].point;
      let acc = 0;
      const totalW = exits.reduce((s, e) => s + Math.max(0, e.weight || 0), 0) || 1;
      for (let e = 0; e < exits.length; e++) {
        acc += Math.max(0, exits[e].weight || 0) / totalW;
        if (seed <= acc) {
          pick = exits[e].point;
          break;
        }
      }
      if (!pick) pick = intakeCurve.getPoint(1);

      if (t < 0.38) return sampleCurve(intakeCurve, t / 0.38, 0.016, seed);
      if (t < 0.52) {
        const u = (t - 0.38) / 0.14;
        const entry = intakeCurve.getPoint(1);
        const inside = tentPoint(
          tent,
          (seed - 0.5) * 0.2,
          0.16 + seed * 0.1,
          0.32 - u * 0.2 + (seed - 0.5) * 0.08
        );
        return entry.clone().lerp(inside, u);
      }
      if (t < 0.78) {
        const u = (t - 0.52) / 0.26;
        const from = tentPoint(tent, (seed - 0.5) * 0.2, 0.2, 0.12);
        const pool = tentPoint(
          tent,
          (seed - 0.5) * 0.5,
          0.22 + seed * 0.18 + Math.sin(u * Math.PI) * 0.05,
          (seed - 0.5) * 0.35
        );
        return from.lerp(pool, u);
      }
      const u = (t - 0.78) / 0.22;
      const ease = u * u;
      const pool = tentPoint(tent, (seed - 0.5) * 0.3, 0.3 + ((i % 5) / 5) * 0.08, (seed - 0.5) * 0.22);
      return pool.lerp(pick, 0.15 + ease * 0.85);
    };

    const journeyPace = (t) => {
      if (t < 0.38) return 1.35;
      if (t < 0.52) return 0.95;
      if (t < 0.78) return 0.28;
      return 1.55;
    };

    const flowThroughTent = journeyThroughTent;

    // In-tent dashed guide ribbons (visible when that leg has CFM)
    const tentGuides = {};
    const mkTentGuide = (key, pts, color) => {
      const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.22);
      let ribbon = null;
      if (fx && typeof fx.makeFlowRibbon === "function") {
        try {
          ribbon = fx.makeFlowRibbon(curve, {
            radius: 0.03,
            tubular: 48,
            color,
            opacity: 0,
            dashArray: [0.09, 0.07],
          });
          ribbon.userData.flow = { curve, tubular: 48, baseRadius: 0.03, lastWidth: -1 };
          root.add(ribbon);
        } catch (_) {
          ribbon = null;
        }
      }
      tentGuides[key] = { ribbon };
    };
    mkTentGuide(
      "clone",
      [
        curves.intakeClone.getPoint(1),
        tentPoint(tentClone, 0, 0.28, 0.15),
        tentPoint(tentClone, 0.15, 0.35, -0.05),
        curves.cascade.getPoint(0.02),
      ],
      0x81d4fa
    );
    mkTentGuide(
      "mainOut",
      [
        curves.intakeMain.getPoint(1),
        tentPoint(tentMain, 0, 0.32, 0.1),
        tentPoint(tentMain, 0.05, 0.5, -0.15),
        curves.out.getPoint(0.02),
      ],
      0xff8a65
    );
    mkTentGuide(
      "mainRec",
      [
        curves.intakeMain.getPoint(1),
        tentPoint(tentMain, 0.1, 0.3, 0.05),
        tentPoint(tentMain, 0.28, 0.45, 0.05),
        curves.recirc.getPoint(0.02),
      ],
      0xce93d8
    );
    const updateTentGuide = (key, intensity) => {
      const g = tentGuides[key];
      if (!g || !g.ribbon) return;
      const active = intensity >= 0.04;
      const shown = active ? Math.min(1, intensity) : 0;
      const u = g.ribbon.material.userData;
      u.uOpacity.value = active ? 0.22 + shown * 0.55 : 0;
      u.uDashOffset.value -= 0.01 + shown * 0.028;
    };

    const updateCascadePlume = (dt, intensity, outShare, recShare) => {
      air.cascade.setColor(live.matOn ? particleColors.cascadeWarm : particleColors.cascade);
      const outBias = Math.max(0, Number(outShare) || 0);
      const recBias = Math.max(0, Number(recShare) || 0);
      const splitSum = Math.max(0.001, outBias + recBias);
      const outPort = curves.out.getPoint(0.02);
      const recPort = curves.recirc.getPoint(0.02);
      updateSystem(
        "cascade",
        curves.cascade,
        dt,
        intensity,
        (t, seed, i) => {
          if (t < 0.42) return sampleCurve(curves.cascade, t / 0.42, 0.018, seed);
          const u = (t - 0.42) / 0.58;
          const entry = curves.cascade.getPoint(1);
          const target = seed < outBias / splitSum ? outPort : recPort;
          if (u < 0.4) {
            const pool = tentPoint(tentMain, (seed - 0.5) * 0.3, 0.32 + u * 0.12, (seed - 0.5) * 0.25);
            return entry.clone().lerp(pool, u / 0.4);
          }
          const v = (u - 0.4) / 0.6;
          const pool = tentPoint(tentMain, (seed - 0.5) * 0.22, 0.42, (seed - 0.5) * 0.18);
          return pool.lerp(target, v * v);
        },
        (t) => (t < 0.42 ? 1.25 : t < 0.66 ? 0.32 : 1.5)
      );
    };

    /** Exhaust: gather from pool toward port, then ride duct. */
    const exhaustFromInside = (t, seed, ductCurve, tent, portLocal) => {
      const port = ductCurve.getPoint(0.02);
      if (t < 0.28) {
        const u = t / 0.28;
        const inside = tentPoint(
          tent,
          portLocal[0] * (0.55 + seed * 0.25),
          portLocal[1] + (seed - 0.5) * 0.1,
          portLocal[2] * (0.55 + seed * 0.25)
        );
        return inside.lerp(port, u * u);
      }
      return sampleCurve(ductCurve, (t - 0.28) / 0.72, 0.016, seed);
    };

    const updateMatHeat = (dt, intensity) => {
      const system = air.matHeat;
      const active = intensity >= 0.04;
      const boost = highlights("mat") ? 1.5 : 1;
      system.points.visible = active;
      system.setOpacity(active ? Math.min(0.95, 0.48 * boost) : 0);
      if (!active) return;
      for (let i = 0; i < system.count; i++) {
        system.phase[i] = (system.phase[i] + dt * (0.24 + (i % 5) * 0.025)) % 1;
        const u = system.phase[i];
        const point = new THREE.Vector3(
          (system.seed[i] - 0.5) * 1.38 + Math.sin(u * 10 + i) * 0.05,
          0.12 + u * 0.72,
          (((i * 0.618) % 1) - 0.5) * 0.88
        );
        tentClone.localToWorld(point);
        system.positions[i * 3] = point.x;
        system.positions[i * 3 + 1] = point.y;
        system.positions[i * 3 + 2] = point.z;
      }
      system.points.geometry.attributes.position.needsUpdate = true;
    };

    let raf = 0;
    let disposed = false;
    let last = performance.now();
    const tick = (now) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      try {
        const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;

        const intakeClone = cfmNorm(live.cfmClone, 80);
        const intakeMain = cfmNorm(live.cfmMain, 80);
        const cascade = cfmNorm(live.cascadeCfm, 80);
        // Absolute CFM only for particle/fan motion (no fan-% fake motion at 0 CFM)
        const outVis = cfmNorm(live.cfmOut, 80);
        const recVis = cfmNorm(live.cfmRecirc, 80);
        const outShare = Math.max(0, Number(live.outShare) || 0);
        const recShare = Math.max(0, Number(live.recircShare) || 0);
        const shareSum = Math.max(0.001, outShare + recShare);
        const cascadeExit = curves.cascade.getPoint(0.02);

        updatePathVisual("intakeClone", intakeClone, now);
        updatePathVisual("intakeMain", intakeMain, now);
        updatePathVisual("cascade", cascade, now);
        updatePathVisual("out", outVis, now);
        updatePathVisual("recirc", recVis, now);

        // Journey streams: duct → pool → exit (pace slows in pool so settle reads)
        updateSystem("intakeClone", curves.intakeClone, dt, Math.min(1, intakeClone * 0.85), null, () => 1.2);
        updateSystem("intakeMain", curves.intakeMain, dt, Math.min(1, intakeMain * 0.85), null, () => 1.2);
        updateCascadePlume(dt, cascade, outShare, recShare);

        updateSystem(
          "out",
          curves.out,
          dt,
          outVis,
          (t, seed) => exhaustFromInside(t, seed, curves.out, tentMain, [0.05, 0.55, -0.42]),
          (t) => (t < 0.28 ? 0.55 : 1.45)
        );
        updateSystem(
          "recirc",
          curves.recirc,
          dt,
          recVis,
          (t, seed) => exhaustFromInside(t, seed, curves.recirc, tentMain, [0.42, 0.48, 0.02]),
          (t) => (t < 0.28 ? 0.55 : 1.45)
        );

        air.flowClone.setColor(
          particleColors.mixCool.clone().lerp(particleColors.mixWarm, live.matOn ? 0.35 : 0.1)
        );
        updateSystem(
          "flowClone",
          curves.intakeClone,
          dt,
          intakeClone,
          (t, seed, i) =>
            journeyThroughTent(t, seed, i, {
              tent: tentClone,
              intakeCurve: curves.intakeClone,
              exits: [{ point: cascadeExit, weight: 1 }],
            }),
          journeyPace
        );

        const mainFlow = Math.min(1, intakeMain * 0.55 + cascade * 0.45);
        air.flowMain.setColor(
          particleColors.mixCool.clone().lerp(particleColors.mixWarm, 0.22 + cascade * 0.5)
        );
        updateSystem(
          "flowMain",
          curves.intakeMain,
          dt,
          mainFlow,
          (t, seed, i) =>
            journeyThroughTent(t, seed, i, {
              tent: tentMain,
              intakeCurve: curves.intakeMain,
              exits: [
                { point: curves.out.getPoint(0.02), weight: outShare / shareSum },
                { point: curves.recirc.getPoint(0.02), weight: recShare / shareSum },
              ],
            }),
          journeyPace
        );

        updateTentGuide("clone", intakeClone);
        updateTentGuide("mainOut", Math.min(1, mainFlow * (outShare / shareSum) + outVis * 0.5));
        updateTentGuide("mainRec", Math.min(1, mainFlow * (recShare / shareSum) + recVis * 0.5));
        updateMatHeat(dt, live.matOn ? 1 : 0);

        if (live.matOn) {
          air.intakeClone.setColor(particleColors.intakeWarm);
        } else {
          air.intakeClone.setColor(particleColors.intake);
        }
        const lightLevel = Math.max(0, Number(live.lightLevel) || 0);
        const lightBoost = highlights("light") ? 1.35 : 1;
        tentClone.userData.lightBar.material.emissiveIntensity = live.cloneLit ? (2.2 + lightLevel * 4.2) * lightBoost : 0;
        tentClone.userData.shafts.visible = !!live.cloneLit;
        tentClone.userData.shafts.children.forEach((shaft, i) => {
          shaft.material.opacity = live.cloneLit ? (0.055 + lightLevel * 0.14) * lightBoost : 0;
          shaft.position.y = tentClone.userData.size.h * 0.5 + Math.sin(now * 0.0007 + i) * 0.02;
        });
        tentFillClone.intensity = live.cloneLit ? 0.35 + lightLevel * 1.4 : 0.12;
        tentFillMain.intensity = 0.18 + Math.max(intakeMain, cascade) * 0.55;
        tentMain.userData.lightBar.material.emissiveIntensity = 0;
        tentMain.userData.lightBar.material.opacity = 0.025;

        const pulse = 0.86 + Math.sin(now * 0.0045) * 0.14;
        matPlate.material.emissiveIntensity = live.matOn ? 3.4 * pulse * (highlights("mat") ? 1.35 : 1) : 0;
        matGlow.material.opacity = live.matOn ? 0.38 * pulse * (highlights("mat") ? 1.4 : 1) : 0;
        ventGlow.material.opacity = outVis >= 0.04 ? 0.09 + outVis * 0.4 : 0.015;
        // Separate-port bloom: OUT coral vs RECIRC violet shells when both legs live
        if (paths.out && paths.recirc) {
          paths.out.shell.material.color.setHex(0xff765e);
          paths.recirc.shell.material.color.setHex(0xa85be0);
          if (outVis >= 0.04 && recVis >= 0.04) {
            paths.out.shell.material.opacity = Math.max(paths.out.shell.material.opacity, 0.18 + outVis * 0.42);
            paths.recirc.shell.material.opacity = Math.max(paths.recirc.shell.material.opacity, 0.18 + recVis * 0.42);
          }
        }

        // ACH volume boxes retired — they read as “blur balls in a blue box”
        (tentClone.userData.achSlices || []).forEach((slice) => {
          slice.material.opacity = 0;
          slice.visible = false;
        });
        (tentMain.userData.achSlices || []).forEach((slice) => {
          slice.material.opacity = 0;
          slice.visible = false;
        });
        roomShell.material.opacity = 0.1 + recVis * 0.06;
        roomEdges.material.opacity = 0.18 + recVis * 0.1;
        roomLungSlices.forEach((slice, i) => {
          // Ceiling wash only — do not bob mid-room volumes
          slice.material.opacity = 0.016 + i * 0.006 + (recVis >= 0.04 ? recVis * 0.02 : 0);
          slice.position.y = 3.55 - i * 0.22;
        });
        ceilWash.intensity = 1.15 + (live.cloneLit ? 0.35 : 0) + recVis * 0.25;

        fans.intakeClone.userData.speed = intakeClone * 15;
        fans.intakeMain.userData.speed = intakeMain * 15;
        fans.exhaust.userData.speed = outVis * 17;
        fans.recirc.userData.speed = recVis * 15;
        Object.values(fans).forEach((fan) => {
          const rotor = fan.userData && fan.userData.rotor;
          if (rotor) rotor.rotation.y += (fan.userData.speed || 0) * dt;
        });

        Object.entries(appliances).forEach(([name, body]) => {
          const on = !!(live.devices || []).find((device) => device.id === name && device.on);
          body.material.emissiveIntensity = on ? 0.72 : 0;
        });

        // Pad markers stay invisible; potActors lerp toward assigned pad world positions (~0.8s).
        refreshPadWorld();
        const poseList = Array.isArray(live.plantPose) ? live.plantPose : [];
        const poseById = {};
        poseList.forEach((pose) => {
          if (pose && pose.id) poseById[pose.id] = pose;
        });
        // Fallback: derive poses from potSlots when plantPose absent
        if (!poseList.length) {
          const slots = live.potSlots || { clone: [], main: [] };
          ["clone", "main"].forEach((key) => {
            (slots[key] || []).forEach((slot, i) => {
              if (slot && slot.id) poseById[slot.id] = { id: slot.id, tent: key, slot: i, color: slot.color };
            });
          });
        }
        const lerpAlpha = 1 - Math.exp(-dt / 0.8);
        const nowMs = performance.now();
        for (let n = 1; n <= 4; n++) {
          const id = `pot${n}`;
          const actor = potActors[id];
          if (!actor) continue;
          const pose = poseById[id];
          const tent = pose && (pose.tent === "main" || pose.tent === "clone") ? pose.tent : null;
          const slotIdx = pose && Number.isFinite(+pose.slot) ? +pose.slot : -1;
          const pad = tent && slotIdx >= 0 && padWorld[tent] ? padWorld[tent][slotIdx] : null;
          if (!pad) {
            actor.visible = false;
            actor.userData.lerpReady = false;
            continue;
          }
          actor.visible = true;
          if (!actor.userData.lerpReady) {
            actor.position.copy(pad);
            actor.userData.lerpReady = true;
          } else {
            actor.position.lerp(pad, lerpAlpha);
          }
          if (pose.color) {
            const canopyTint = actor.userData.canopyMaterial;
            if (canopyTint) {
              if (canopyTint.map) canopyTint.emissive.set(pose.color);
              else canopyTint.color.set(pose.color);
            }
          }
          const hi = actor.userData.potNum === selectedPotNum || nowMs < (actor.userData.highlightUntil || 0);
          const canopy = actor.userData.canopyMaterial;
          if (canopy && canopy.emissiveIntensity != null) {
            canopy.emissiveIntensity = hi ? 0.55 : 0.16;
          }
        }
        // Keep tent-slot marker plants hidden
        ["clone", "main"].forEach((key) => {
          pots[key].forEach((plant) => {
            plant.visible = false;
          });
        });

        if (post && typeof post.render === "function") {
          try {
            post.render();
            // Detect truly blank composer output (not just a dark floor between tents).
            if (!tick._composerOk) {
              const gl = renderer.getContext();
              if (gl && !gl.isContextLost()) {
                const w = renderer.domElement.width;
                const h = renderer.domElement.height;
                const px = new Uint8Array(4);
                const samples = [
                  [0.28, 0.42],
                  [0.72, 0.42],
                  [0.5, 0.28],
                  [0.5, 0.55],
                  [0.5, 0.72],
                ];
                let lit = 0;
                for (let s = 0; s < samples.length; s++) {
                  gl.readPixels(
                    Math.floor(w * samples[s][0]),
                    Math.floor(h * samples[s][1]),
                    1,
                    1,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    px
                  );
                  if (px[0] + px[1] + px[2] >= 12) lit += 1;
                }
                if (lit >= 2) {
                  tick._composerOk = true;
                  tick._blackFrames = 0;
                } else {
                  tick._blackFrames = (tick._blackFrames || 0) + 1;
                  if (tick._blackFrames >= 12) {
                    tick._blackFrames = 0;
                    try { post.dispose(); } catch (_) {}
                    post = null;
                    renderer.setRenderTarget(null);
                    renderer.render(scene, camera);
                    console.warn("dsc-the-dash-card: composer abandoned after blank frames; direct render");
                  }
                }
              }
            }
          } catch (composerErr) {
            if (post && typeof post.dispose === "function") {
              try { post.dispose(); } catch (_) {}
            }
            post = null;
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
            if (!tick._composerFallen) {
              tick._composerFallen = true;
              console.warn("dsc-the-dash-card: composer failed; falling back to direct render", composerErr);
            }
          }
        } else {
          renderer.render(scene, camera);
        }
      } catch (err) {
        if (!tick._errLogged) {
          tick._errLogged = true;
          console.error("dsc-the-dash-card: render tick failed", err);
        }
        try {
          renderer.render(scene, camera);
        } catch (_) {}
      }
    };

    resize();
    raf = requestAnimationFrame(tick);

    return {
      resize,
      setLive,
      setSelectedPot,
      projectTentAnchors() {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        const project = (obj, yLift) => {
          if (!obj) return null;
          const v = new THREE.Vector3();
          obj.getWorldPosition(v);
          v.y += yLift;
          v.project(camera);
          return {
            x: (v.x * 0.5 + 0.5) * w,
            y: (-v.y * 0.5 + 0.5) * h,
            behind: v.z > 1,
          };
        };
        return {
          clone: project(tentClone, 2.05),
          main: project(tentMain, 2.15),
        };
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(raf);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("wheel", onWheel);
        if (post && typeof post.dispose === "function") post.dispose();
        if (curl && typeof curl.dispose === "function") curl.dispose();
        confinedMix.forEach((h) => {
          try {
            if (h && typeof h.dispose === "function") h.dispose();
          } catch (_) {}
        });
        try {
          scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
              mats.forEach((m) => m && m.dispose && m.dispose());
            }
          });
        } catch (_) {}
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      },
      // Debug handle for live recovery / QA (not part of public card API)
      _debug: {
        get renderer() { return renderer; },
        get scene() { return scene; },
        get camera() { return camera; },
        get post() { return post; },
        get disposed() { return disposed; },
      },
    };
  };

  /* ------------------------------------------------------------------ */
  /* History                                                            */
  /* ------------------------------------------------------------------ */

  const fetchHistory = async (hass, entityId, hours = 24) => {
    if (!hass || !entityId || !hass.connection) return [];
    const end = new Date();
    const start = new Date(end.getTime() - hours * 3600 * 1000);
    try {
      const result = await hass.connection.sendMessagePromise({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        significant_changes_only: false,
        include_start_time_state: true,
        minimal_response: true,
        no_attributes: true,
        entity_ids: [entityId],
      });
      const rows = result && result[entityId] ? result[entityId] : [];
      return rows
        .map((r) => ({
          t: new Date(r.lu ? r.lu * 1000 : r.last_changed || r.last_updated).getTime(),
          v: parseFloat(r.s != null ? r.s : r.state),
        }))
        .filter((p) => Number.isFinite(p.v) && Number.isFinite(p.t));
    } catch (_) {
      try {
        const url = `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${encodeURIComponent(end.toISOString())}&minimal_response`;
        const data = await hass.callApi("GET", url);
        const rows = Array.isArray(data) && data[0] ? data[0] : [];
        return rows
          .map((r) => ({
            t: new Date(r.last_changed || r.last_updated).getTime(),
            v: parseFloat(r.state),
          }))
          .filter((p) => Number.isFinite(p.v) && Number.isFinite(p.t));
      } catch (__) {
        return [];
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Card                                                               */
  /* ------------------------------------------------------------------ */

  class DscTheDashCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._cfg = normalizeConfig(null);
      this._hass = null;
      this._scene = null;
      this._hist = { moisture: {}, rate: {}, climate: {} };
      this._histAt = 0;
      this._ro = null;
      this._lastGoodLive = null;
      this._hubOfflineSince = 0;
      this._lastDiagLine = "";
    }

    static getConfigElement() {
      return document.createElement(EDITOR_TYPE);
    }

    static getStubConfig() {
      return DSC_DEFAULTS();
    }

    setConfig(config) {
      this._cfg = normalizeConfig(config);
      this._renderShell();
    }

    set hass(hass) {
      this._hass = hass;
      this._update();
    }

    getCardSize() {
      return 16;
    }

    connectedCallback() {
      this._renderShell();
    }

    disconnectedCallback() {
      if (this._scene) {
        this._scene.dispose();
        this._scene = null;
      }
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
    }

    _renderShell() {
      const cfg = this._cfg;
      this.shadowRoot.innerHTML = `
        <style>${STYLES}</style>
        <div class="dash">
          <div class="dash-header">
            <div>
              <div class="dash-brand" id="d-title">${esc(cfg.title)}</div>
              <div class="dash-sub" id="d-sub">${esc(cfg.subtitle)}</div>
            </div>
            <div class="dash-pill" id="d-status">ONLINE // …</div>
          </div>
          <div class="dash-body">
            <div class="dash-main">
              <div class="dash-scene-wrap" id="d-scene">
                ${typeof THREE === "undefined" ? `<div class="dash-missing">THREE.js not loaded — redeploy DSC-HUB bundle.</div>` : ""}
                <div class="dash-hud left" id="d-hud-clone"></div>
                <div class="dash-hud right" id="d-hud-main"></div>
                <div class="dash-pot-chips" id="d-pot-chips"></div>
                <div class="dash-legend" id="d-legend">
                  <span data-path="light"><i class="dash-dot" style="background:#66bb6a"></i> 2x4 light</span>
                  <span data-path="mat"><i class="dash-dot" style="background:#ff6d00"></i> 2x4 heat mat</span>
                  <span data-path="intake"><i class="dash-dot" style="background:#42a5f5"></i> Room intake</span>
                  <span data-path="cascade"><i class="dash-dot" style="background:#ffb74d"></i> Cascade 2x4→4x8</span>
                  <span data-path="out"><i class="dash-dot" style="background:#ff8a65"></i> Dump OUT</span>
                  <span data-path="recirc"><i class="dash-dot" style="background:#ab47bc"></i> Recirc</span>
                </div>
              </div>
              <div class="dash-charts">
                <div class="dash-chart"><h4>Moisture — pots</h4><canvas id="c-moist"></canvas></div>
                <div class="dash-chart"><h4>Feed intake rate — pots</h4><canvas id="c-rate"></canvas></div>
                <div class="dash-chart">
                  <h4>Temperature °C</h4>
                  <div class="leg"><span><i style="background:#26c6da"></i>2x4</span><span><i style="background:#ff8a65"></i>4x8</span><span><i style="background:#90a4ae"></i>Room</span></div>
                  <canvas id="c-temp"></canvas>
                </div>
                <div class="dash-chart">
                  <h4>Humidity %</h4>
                  <div class="leg"><span><i style="background:#26c6da"></i>2x4</span><span><i style="background:#ff8a65"></i>4x8</span><span><i style="background:#90a4ae"></i>Room</span></div>
                  <canvas id="c-rh"></canvas>
                </div>
                <div class="dash-chart">
                  <h4>VPD kPa</h4>
                  <div class="leg"><span><i style="background:#26c6da"></i>2x4</span><span><i style="background:#ff8a65"></i>4x8</span></div>
                  <canvas id="c-vpd"></canvas>
                </div>
              </div>
            </div>
            <div class="dash-rail">
              <div class="dash-panel">
                <h3>Crop scheduler &amp; cycle timeline</h3>
                <div id="d-timeline"></div>
              </div>
              <div class="dash-panel" style="flex:1">
                <h3>Air path · environment → CFM → exhaust</h3>
                <p class="dash-flow-caption">Room climate → intake CFM (2×4 / 4×8) + cascade transfer → 4×8 exhaust mass-balanced to Σ intake × dump/recirc split. Heat mat is 2×4-only.</p>
                <div id="d-flow" class="dash-flow"></div>
              </div>
              <div class="dash-panel">
                <h3>Actions</h3>
                <div class="dash-actions">
                  <button type="button" class="dash-btn" data-nav="/dsc-hub-pro/lighting">Master lighting</button>
                  <button type="button" class="dash-btn danger" data-more="binary_sensor.dsc_hub_emergency_failsafe">Emergency status</button>
                  <button type="button" class="dash-btn guard" data-nav="/dsc-hub-pro/climate">Climate engine</button>
                  <button type="button" class="dash-btn" data-nav="/dsc-hub-pro/root-zone">Root zone</button>
                </div>
              </div>
            </div>
          </div>
          <div class="dash-footer" id="d-footer"></div>
        </div>`;

      if (this._scene) {
        this._scene.dispose();
        this._scene = null;
      }
      const host = this.shadowRoot.getElementById("d-scene");
      if (host && typeof THREE !== "undefined") {
        this._scene = createScene(host, {
          onSelectPot: (n) => this._emitSelectPot(n),
        });
      }
      const chips = this.shadowRoot.getElementById("d-pot-chips");
      if (chips && !chips._dscBound) {
        chips._dscBound = true;
        chips.addEventListener("click", (ev) => {
          const chip = ev.target && ev.target.closest ? ev.target.closest("[data-pot]") : null;
          if (!chip) return;
          const n = parseInt(chip.getAttribute("data-pot"), 10);
          if (Number.isFinite(n) && n >= 1 && n <= 4) this._emitSelectPot(n);
        });
      }
      if (this._ro) this._ro.disconnect();
      this._ro = new ResizeObserver(() => this._scene && this._scene.resize());
      if (host) this._ro.observe(host);

      this.shadowRoot.querySelectorAll("[data-nav]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const path = btn.getAttribute("data-nav");
          history.pushState(null, "", path);
          window.dispatchEvent(new Event("location-changed"));
        });
      });
      this.shadowRoot.querySelectorAll("[data-more]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const entityId = btn.getAttribute("data-more");
          this.dispatchEvent(
            new CustomEvent("hass-more-info", {
              detail: { entityId },
              bubbles: true,
              composed: true,
            })
          );
        });
      });

      this._pathHighlight = "";
      const legend = this.shadowRoot.getElementById("d-legend");
      if (legend) {
        legend.querySelectorAll("[data-path]").forEach((el) => {
          const apply = (path) => {
            this._pathHighlight = path || "";
            legend.querySelectorAll("[data-path]").forEach((n) => {
              n.classList.toggle("on", !!path && n.getAttribute("data-path") === path);
            });
            if (this._scene && this._lastLive) {
              this._scene.setLive({ ...this._lastLive, pathHighlight: this._pathHighlight });
            }
          };
          el.addEventListener("mouseenter", () => apply(el.getAttribute("data-path")));
          el.addEventListener("mouseleave", () => apply(""));
          el.addEventListener("click", () => {
            const p = el.getAttribute("data-path");
            apply(this._pathHighlight === p ? "" : p);
          });
        });
      }

      this._update();
    }

    async _refreshHistory() {
      const hass = this._hass;
      const cfg = this._cfg;
      if (!hass) return;
      const pots = activePots(cfg, hass);
      const e = cfg.entities;
      const moist = {};
      const rate = {};
      await Promise.all(
        pots.map(async (p, idx) => {
          const color = POT_COLORS[idx % POT_COLORS.length];
          const mId = !isUnavailable(hass, potEntity(p.prefix, "got_moisture"))
            ? potEntity(p.prefix, "got_moisture")
            : potEntity(p.prefix, "soil_moisture");
          const rId = potEntity(p.prefix, "soil_moisture_rate");
          moist[p.id] = { color, label: p.id, points: await fetchHistory(hass, mId, 24) };
          rate[p.id] = { color, label: p.id, points: await fetchHistory(hass, rId, 24) };
        })
      );
      const [tClone, tMain, tRoom, hClone, hMain, hRoom, vClone, vMain] = await Promise.all([
        fetchHistory(hass, e.clone_temp, 24),
        fetchHistory(hass, e.tent_temp, 24),
        fetchHistory(hass, e.room_temp, 24),
        fetchHistory(hass, e.clone_humidity, 24),
        fetchHistory(hass, e.tent_humidity, 24),
        fetchHistory(hass, e.room_humidity, 24),
        fetchHistory(hass, e.clone_vpd, 24),
        fetchHistory(hass, e.tent_vpd, 24),
      ]);
      this._hist.moisture = moist;
      this._hist.rate = rate;
      this._hist.climate = { tClone, tMain, tRoom, hClone, hMain, hRoom, vClone, vMain };
      this._histAt = Date.now();
    }

    _emitSelectPot(n) {
      const pot = Number(n);
      if (!Number.isFinite(pot) || pot < 1 || pot > 4) return;
      if (this._scene && typeof this._scene.setSelectedPot === "function") {
        this._scene.setSelectedPot(pot);
      }
      this._selectedPot = pot;
      this.dispatchEvent(
        new CustomEvent("dsc-dash-select-pot", {
          detail: { pot },
          bubbles: true,
          composed: true,
        })
      );
      window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot } }));
      const chips = this.shadowRoot && this.shadowRoot.getElementById("d-pot-chips");
      if (chips) {
        chips.querySelectorAll("[data-pot]").forEach((el) => {
          el.classList.toggle("on", parseInt(el.getAttribute("data-pot"), 10) === pot);
        });
      }
    }

    _buildLive() {
      const hass = this._hass;
      const cfg = this._cfg;
      const e = cfg.entities;
      if (!hass) return null;

      const cfmMain = Math.max(0, numState(hass, e.cfm_intake_main, 0));
      const cfmClone = Math.max(0, numState(hass, e.cfm_intake_2x4, 0));
      let fanMain = numState(hass, e.fan_intake_main, 0) / 100;
      let fanClone = numState(hass, e.fan_intake_2x4, 0) / 100;
      const intakeSum = cfmMain + cfmClone;
      let splitMain = 0.5;
      let splitClone = 0.5;
      if (intakeSum > FLOW_EPS) {
        splitMain = cfmMain / intakeSum;
        splitClone = cfmClone / intakeSum;
      } else {
        const fsum = fanMain + fanClone;
        if (fsum > 0.02) {
          splitMain = fanMain / fsum;
          splitClone = fanClone / fsum;
        }
      }
      // Dump/recirc split: prefer live fan % (honest duty blend). Exhaust CFM sensors
      // are pct×nameplate until Learning cal — fine as a ratio fallback only.
      const fo = numState(hass, e.fan_out, 0) / 100;
      const fr = numState(hass, e.fan_recirc, 0) / 100;
      const fs = fo + fr;
      const cfmOutRaw = Math.max(0, numState(hass, e.cfm_out, 0));
      const cfmRecRaw = Math.max(0, numState(hass, e.cfm_recirc, 0));
      const exSum = cfmOutRaw + cfmRecRaw;
      let outShare = 0;
      let recircShare = 0;
      if (fs > 0.02) {
        outShare = fo / fs;
        recircShare = fr / fs;
      } else if (exSum > FLOW_EPS) {
        outShare = cfmOutRaw / exSum;
        recircShare = cfmRecRaw / exSum;
      }
      // Mass balance: absolute OUT/RECIRC CFM = intake throughput × split.
      // Do not use sensor.dsc_cfm_exhaust_* as absolute duct flow on The Dash.
      const throughput = intakeSum;
      const cfmOut = throughput * outShare;
      const cfmRec = throughput * recircShare;

      const devices = [
        { id: "heater", label: "Room heat", on: isOn(hass, e.heater), color: "#ff7043" },
        { id: "ac", label: "AC", on: isOn(hass, e.ac), color: "#4fc3f7" },
        { id: "humidifier", label: "Hum", on: isOn(hass, e.humidifier), color: "#29b6f6" },
        { id: "dehumidifier", label: "Dehum", on: isOn(hass, e.dehumidifier), color: "#80cbc4" },
        { id: "clone_humidifier", label: "C-Hum", on: isOn(hass, e.clone_humidifier), color: "#81d4fa" },
      ];
      // Grow mat is 2x4-only — show under active gear but never as room heat
      if (isOn(hass, e.grow_mat)) {
        devices.push({ id: "grow_mat", label: "2x4 mat", on: true, color: "#ff6d00" });
      }

      const cascadeCfm = cfmClone; // passive transfer ≈ what entered the 2x4
      const cascadeNorm = Math.min(1, cascadeCfm / 80);

      const pots = activePots(cfg, hass);
      // Tent SoT: pack slots from input_select.dsc_potN_tent (not hardcoded cfg.pots[].tent).
      const potSlots = { clone: Array(4).fill(null), main: Array(8).fill(null) };
      const byTent = { clone: [], main: [] };
      const plantPose = [];
      (cfg.pots || []).forEach((p, idx) => {
        if (!p || !p.id) return;
        const tent = readPotTent(hass, p);
        const color = POT_COLORS[idx % POT_COLORS.length];
        const n = potNumFrom(p);
        const nameState = Number.isFinite(n) ? stateOf(hass, `text.dsc_pot${n}_plant_name`) : null;
        const name =
          nameState && nameState.state !== "unavailable" && nameState.state !== "unknown"
            ? String(nameState.state)
            : p.id;
        if (tent !== "clone" && tent !== "main") {
          // Unassigned: hidden from potSlots / no pad target
          return;
        }
        byTent[tent].push({ id: p.id, color, name, tent, n, idx });
      });
      ["clone", "main"].forEach((tent) => {
        const max = tent === "main" ? 8 : 4;
        byTent[tent]
          .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }))
          .forEach((entry, slot) => {
            if (slot >= max) return;
            potSlots[tent][slot] = { id: entry.id, color: entry.color };
            plantPose.push({
              id: entry.id,
              tent,
              slot,
              color: entry.color,
              name: entry.name,
            });
          });
      });

      const stageBase = STAGE_ORDER.map((name) =>
        name
          .replace("Late (Push) Vegetative", "Late Veg")
          .replace("Final 48-72h Flowering", "Finish")
          .replace("Early Vegetative", "Early Veg")
          .replace("Early Flowering", "Early Flower")
      );
      const stages = stageBase.map((label, i) => ({ label, cls: "", idx: i }));
      let curIdx = -1;
      let mixed = false;
      for (const p of pots) {
        const st = stateOf(hass, potEntity(p.prefix, "expected_stage"))?.state || "";
        const days = numState(hass, potEntity(p.prefix, "days_since_sprout"), NaN);
        let idx = STAGE_ORDER.findIndex((s) => st && st.indexOf(s) >= 0);
        if (idx < 0 && /flower/i.test(st)) idx = 6;
        if (idx < 0 && /veg/i.test(st)) idx = 3;
        if (idx < 0 && /seed/i.test(st)) idx = 1;
        if (idx >= 0) {
          if (curIdx >= 0 && curIdx !== idx) mixed = true;
          if (idx > curIdx) curIdx = idx;
          if (Number.isFinite(days)) {
            stages[idx].label = `W${Math.max(1, Math.ceil(days / 7))}: ${stageBase[idx]}`;
          }
        }
      }
      if (curIdx >= 0) stages[curIdx].cls = "on";
      if (curIdx + 1 < stages.length) stages[curIdx + 1].cls = stages[curIdx + 1].cls || "next";
      const timelineStages = stages.filter((_, i) => i >= Math.max(0, curIdx - 1) && i <= curIdx + 2);
      if (!timelineStages.length) {
        timelineStages.push(
          { label: "WEEK ?", cls: "on" },
          { label: "Next", cls: "next" },
          { label: "Later", cls: "" }
        );
      }

      const emerg = isOn(hass, e.emergency);
      const strategy = stateOf(hass, e.strategy)?.state || "";
      const priority = stateOf(hass, e.priority)?.state || "";
      // Approximate room VPD from room T/RH (Magnus) when no dedicated sensor
      const rT = numState(hass, e.room_temp, NaN);
      const rH = numState(hass, e.room_humidity, NaN);
      let roomVpd = NaN;
      if (Number.isFinite(rT) && Number.isFinite(rH)) {
        const svp = 0.6108 * Math.exp((17.27 * rT) / (rT + 237.3));
        roomVpd = svp * (1 - rH / 100);
      }

      const hubLinkOn = !isUnavailable(hass, e.hub_link) && isOn(hass, e.hub_link);
      const climateLive =
        Number.isFinite(numState(hass, e.tent_temp, NaN)) ||
        Number.isFinite(numState(hass, e.clone_temp, NaN)) ||
        Number.isFinite(numState(hass, e.room_temp, NaN));
      const cfmLive = intakeSum > FLOW_EPS || fs > 0.02;
      const hubOnline = hubLinkOn && (climateLive || cfmLive);
      const diagLine = composeHubDiagLine(hass, e);

      const live = {
        devices,
        splitMain,
        splitClone,
        outShare,
        recircShare,
        cfmClone,
        cfmMain,
        cfmOut,
        cfmRecirc: cfmRec,
        throughput,
        cascadeCfm,
        cascadeNorm,
        fanIntakeClone: fanClone,
        fanIntakeMain: fanMain,
        fanExhaust: fo,
        fanRecirc: fr,
        lightLevel: lightLevel(hass, e.light),
        cloneLit: lightLevel(hass, e.light) > 0.02,
        mainLit: false,
        matOn: isOn(hass, e.grow_mat),
        potSlots,
        plantPose,
        timelineStages,
        mixed,
        emerg,
        strategy,
        priority,
        roomClimate: `${fmt(rT)}°C · ${fmt(rH, 0)}% · VPD ${fmt(roomVpd, 2)}`,
        cloneClimate: `${fmt(numState(hass, e.clone_temp))}°C · ${fmt(numState(hass, e.clone_humidity), 0)}% · VPD ${fmt(numState(hass, e.clone_vpd), 2)}`,
        mainClimate: `${fmt(numState(hass, e.tent_temp))}°C · ${fmt(numState(hass, e.tent_humidity), 0)}% · VPD ${fmt(numState(hass, e.tent_vpd), 2)}`,
        climate: {
          room: { temperature: rT, humidity: rH, vpd: roomVpd },
          clone: {
            temperature: numState(hass, e.clone_temp, NaN),
            humidity: numState(hass, e.clone_humidity, NaN),
            vpd: numState(hass, e.clone_vpd, NaN),
          },
          main: {
            temperature: numState(hass, e.tent_temp, NaN),
            humidity: numState(hass, e.tent_humidity, NaN),
            vpd: numState(hass, e.tent_vpd, NaN),
          },
        },
        pots,
        hubOnline,
        hubHeld: false,
        hubOfflineMs: 0,
        diagLine,
      };

      if (hubOnline) {
        this._lastGoodLive = {
          ...live,
          devices: devices.map((d) => ({ ...d })),
          potSlots: { clone: [...potSlots.clone], main: [...potSlots.main] },
          plantPose: plantPose.map((p) => ({ ...p })),
        };
        this._hubOfflineSince = 0;
        if (diagLine) this._lastDiagLine = diagLine;
        return live;
      }

      // Hub dropout: hold last-known-good values; start disconnect timer
      if (!this._hubOfflineSince) this._hubOfflineSince = Date.now();
      const offlineMs = Date.now() - this._hubOfflineSince;
      if (this._lastGoodLive) {
        return {
          ...this._lastGoodLive,
          hubOnline: false,
          hubHeld: true,
          hubOfflineMs: offlineMs,
          diagLine: this._lastDiagLine || diagLine || "Hub link lost — no prior diagnostic line cached",
          emerg: live.emerg || this._lastGoodLive.emerg,
        };
      }
      live.hubHeld = false;
      live.hubOfflineMs = offlineMs;
      live.diagLine = this._lastDiagLine || diagLine || "Hub offline · waiting for first good sample";
      return live;
    }

    async _update() {
      if (!this.shadowRoot || !this._hass) return;
      const live = this._buildLive();
      if (!live) return;
      live.pathHighlight = this._pathHighlight || "";
      this._lastLive = live;

      const status = this.shadowRoot.getElementById("d-status");
      if (status) {
        status.className = "dash-pill" + (live.emerg ? " bad" : live.hubHeld ? " warn" : "");
        if (live.emerg) {
          status.textContent = "FAILSAFE // EMERGENCY";
        } else if (live.hubHeld) {
          status.textContent = `HELD // hub offline ${fmtHeld(live.hubOfflineMs)}`;
        } else if (!live.hubOnline) {
          status.textContent = `OFFLINE // hub ${fmtHeld(live.hubOfflineMs || 0)}`;
        } else {
          status.textContent = `ONLINE // ${live.strategy || "NOMINAL"} · ${live.priority || ""}`.trim();
        }
      }

      const lightMins = lightClockMinutes(this._hass, this._cfg.entities, "clone");
      let lightNote = "Lights idle";
      if (live.cloneLit) {
        const hours = this._cfg.entities.expected_light_hours;
        const exp = numState(this._hass, hours, 18) * 60;
        const left = Number.isFinite(lightMins) ? Math.max(0, exp - lightMins) : NaN;
        lightNote = Number.isFinite(left)
          ? `SF1000 on · ${Math.floor(left / 60)}h ${Math.round(left % 60)}m to off`
          : "SF1000 on";
      } else if (Number.isFinite(lightMins) && lightMins < 0) {
        const until = Math.abs(lightMins);
        lightNote = `Dark · ${Math.floor(until / 60)}h ${Math.round(until % 60)}m to lights-on`;
      }
      const hudMetric = (zone) => {
        const c = (live.climate && live.climate[zone]) || {};
        return `<div class="v-split">
          <div class="metric"><span class="mk">T</span><span class="mv">${esc(fmt(c.temperature))}°</span></div>
          <div class="metric"><span class="mk">RH</span><span class="mv">${esc(fmt(c.humidity, 0))}%</span></div>
          <div class="metric"><span class="mk">VPD</span><span class="mv">${esc(fmt(c.vpd, 2))}</span></div>
        </div>`;
      };
      const bandHtml = (got, min, max, spanMin, spanMax) => {
        if (![got, min, max].every(Number.isFinite)) return "";
        const lo = Number.isFinite(spanMin) ? spanMin : Math.min(min, got) - 2;
        const hi = Number.isFinite(spanMax) ? spanMax : Math.max(max, got) + 2;
        const span = Math.max(hi - lo, 1e-6);
        const left = ((min - lo) / span) * 100;
        const width = ((max - min) / span) * 100;
        const gotPct = ((got - lo) / span) * 100;
        return `<div class="band"><div class="want" style="left:${left}%;width:${width}%"></div><div class="got" style="left:${Math.min(100, Math.max(0, gotPct))}%"></div></div>`;
      };
      const vpdMini = (vpd, min, max) => {
        if (!Number.isFinite(vpd)) return "";
        const span = Math.max((Number.isFinite(max) ? max : 2.5) - (Number.isFinite(min) ? min : 0), 0.2);
        const base = Number.isFinite(min) ? min : 0;
        const pct = Math.min(1, Math.max(0, (vpd - base) / span));
        const c = 2 * Math.PI * 14 * 0.75;
        const dash = c * pct;
        return `<div class="vpd-mini"><svg width="42" height="28" viewBox="0 0 42 28" aria-hidden="true">
          <path d="M4 24 A14 14 0 1 1 38 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4" stroke-linecap="round"/>
          <path d="M4 24 A14 14 0 1 1 38 24" fill="none" stroke="#26c6da" stroke-width="4" stroke-linecap="round" stroke-dasharray="${dash} ${c}"/>
        </svg><span class="s" style="margin:0">Want ${esc(fmt(min, 2))}–${esc(fmt(max, 2))} kPa</span></div>`;
      };
      const placeHud = (el, anchor, fallbackClass) => {
        if (!el) return;
        el.classList.add(fallbackClass);
        if (!anchor || anchor.behind) {
          el.classList.remove("is-anchored");
          el.style.left = "";
          el.style.top = "";
          el.style.transform = "";
          return;
        }
        el.classList.add("is-anchored");
        const x = Math.min((hostW || 400) - 190, Math.max(8, anchor.x - 84));
        const y = Math.min((hostH || 400) - 140, Math.max(8, anchor.y - 110));
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.right = "auto";
        el.style.transform = "none";
      };
      const wrap = this.shadowRoot.querySelector(".dash-scene-wrap");
      const hostW = wrap ? wrap.clientWidth : 640;
      const hostH = wrap ? wrap.clientHeight : 420;
      const anchors =
        this._scene && typeof this._scene.projectTentAnchors === "function"
          ? this._scene.projectTentAnchors()
          : null;
      const hass = this._hass;
      const e = this._cfg.entities;
      const mainRhMin = numState(hass, "number.dsc_hub_rh_target_min", NaN);
      const mainRhMax = numState(hass, "number.dsc_hub_rh_target_max", NaN);
      const mainVpdMin = numState(hass, "number.dsc_hub_vpd_target_min", NaN);
      const mainVpdMax = numState(hass, "number.dsc_hub_vpd_target_max", NaN);
      const cloneRhMin = numState(hass, "number.dsc_hub_clone_rh_min", NaN);
      const cloneRhMax = numState(hass, "number.dsc_hub_clone_rh_max", NaN);
      const cloneVpdMin = numState(hass, "number.dsc_hub_clone_vpd_min", NaN);
      const cloneVpdMax = numState(hass, "number.dsc_hub_clone_vpd_max", NaN);
      const hudC = this.shadowRoot.getElementById("d-hud-clone");
      if (hudC) {
        const c = (live.climate && live.climate.clone) || {};
        hudC.innerHTML = `<div class="k">2×4 Reservoir</div>${hudMetric("clone")}${bandHtml(c.humidity, cloneRhMin, cloneRhMax, 0, 100)}${vpdMini(c.vpd, cloneVpdMin, cloneVpdMax)}<div class="s">${esc(lightNote)}${live.matOn ? " · heat mat ON" : ""} · <a href="#/ops/climate" style="color:inherit">⋯ Climate</a></div>`;
        placeHud(hudC, anchors && anchors.clone, "left");
      }
      const hudM = this.shadowRoot.getElementById("d-hud-main");
      if (hudM) {
        const m = (live.climate && live.climate.main) || {};
        const heldNote = live.hubHeld ? " · HELD" : "";
        hudM.innerHTML = `<div class="k">4×8 Main</div>${hudMetric("main")}${bandHtml(m.humidity, mainRhMin, mainRhMax, 0, 100)}${vpdMini(m.vpd, mainVpdMin, mainVpdMax)}<div class="s">No lamp · cascade in${heldNote} · <a href="#/ops/climate" style="color:inherit">⋯ Climate</a></div>`;
        placeHud(hudM, anchors && anchors.main, "right");
      }

      const chipsEl = this.shadowRoot.getElementById("d-pot-chips");
      if (chipsEl) {
        const hass = this._hass;
        const selected = this._selectedPot || 0;
        chipsEl.innerHTML = (this._cfg.pots || [])
          .map((p, idx) => {
            const n = potNumFrom(p);
            if (!Number.isFinite(n)) return "";
            const tent = readPotTent(hass, p);
            const nameState = stateOf(hass, `text.dsc_pot${n}_plant_name`);
            const name =
              nameState && nameState.state !== "unavailable" && nameState.state !== "unknown" && nameState.state
                ? String(nameState.state)
                : p.id;
            const moistId = !isUnavailable(hass, potEntity(p.prefix, "got_moisture"))
              ? potEntity(p.prefix, "got_moisture")
              : potEntity(p.prefix, "soil_moisture");
            const moist = numState(hass, moistId, NaN);
            const tentLabel = tent === "main" ? "4×8" : tent === "clone" ? "2×4" : "—";
            const color = POT_COLORS[idx % POT_COLORS.length];
            const on = selected === n ? " on" : "";
            return `<button type="button" class="dash-pot-chip${on}" data-pot="${n}" style="border-left:3px solid ${color}">
              <span class="chip-id">Pot ${n}</span>
              <span class="chip-name">${esc(name)}</span>
              <span class="chip-meta">${esc(tentLabel)} · ${esc(fmt(moist, 0))}% moist</span>
            </button>`;
          })
          .join("");
      }

      const tl = this.shadowRoot.getElementById("d-timeline");
      if (tl) tl.innerHTML = renderTimeline(live);
      const flow = this.shadowRoot.getElementById("d-flow");
      if (flow) flow.innerHTML = renderFlow(live);

      if (this._scene) this._scene.setLive(live);

      if (Date.now() - this._histAt > 60000 || this._histAt === 0) {
        this._refreshHistory().then(() => this._drawCharts(live));
      } else {
        this._drawCharts(live);
      }

      const foot = this.shadowRoot.getElementById("d-footer");
      if (foot) {
        const alerts = [];
        if (live.emerg) alerts.push(`<span class="err">EMERGENCY FAILSAFE</span>`);
        if (live.mixed) alerts.push(`<span class="alert">Mixed pot stages</span>`);
        if (live.hubHeld) {
          alerts.push(`<span class="alert">Hub offline · held ${esc(fmtHeld(live.hubOfflineMs))}</span>`);
        } else if (!live.hubOnline) {
          alerts.push(`<span class="alert">Hub offline · ${esc(fmtHeld(live.hubOfflineMs || 0))}</span>`);
        }
        const diag = live.diagLine || "";
        const diagHtml = diag
          ? `<span class="alert" title="Last hub diagnostic line">ESP/link: ${esc(diag)}</span>`
          : "";
        foot.innerHTML = `
          <span>The Dash · presentation surface</span>
          <span>${new Date().toLocaleString()}</span>
          ${alerts.join(" · ") || `<span style="color:var(--ok)">All systems nominal</span>`}
          ${diagHtml}
          <span class="err" style="margin-left:auto">LOGS → Climate / Root Zone</span>`;
      }
    }

    _drawCharts(live) {
      const pots = live.pots || [];
      const e = this._cfg.entities;
      const moistSeries = pots.map((p, i) => ({
        color: POT_COLORS[i % POT_COLORS.length],
        points: (this._hist.moisture[p.id] && this._hist.moisture[p.id].points) || [
          { t: Date.now(), v: numState(this._hass, potEntity(p.prefix, "soil_moisture"), NaN) },
        ],
      }));
      const rateSeries = pots.map((p, i) => ({
        color: POT_COLORS[i % POT_COLORS.length],
        points: (this._hist.rate[p.id] && this._hist.rate[p.id].points) || [
          { t: Date.now(), v: numState(this._hass, potEntity(p.prefix, "soil_moisture_rate"), NaN) },
        ],
      }));
      const c = this._hist.climate || {};
      const tip = (id, fallbackPts) =>
        fallbackPts && fallbackPts.length
          ? fallbackPts
          : [{ t: Date.now(), v: numState(this._hass, id, NaN) }];
      const tempSeries = [
        { color: "#26c6da", points: tip(e.clone_temp, c.tClone) },
        { color: "#ff8a65", points: tip(e.tent_temp, c.tMain) },
        { color: "#90a4ae", points: tip(e.room_temp, c.tRoom) },
      ];
      const rhSeries = [
        { color: "#26c6da", points: tip(e.clone_humidity, c.hClone) },
        { color: "#ff8a65", points: tip(e.tent_humidity, c.hMain) },
        { color: "#90a4ae", points: tip(e.room_humidity, c.hRoom) },
      ];
      const vpdSeries = [
        { color: "#26c6da", points: tip(e.clone_vpd, c.vClone) },
        { color: "#ff8a65", points: tip(e.tent_vpd, c.vMain) },
      ];
      drawMultiLineChart(this.shadowRoot.getElementById("c-moist"), moistSeries, { min: 0, max: 100 });
      drawMultiLineChart(this.shadowRoot.getElementById("c-rate"), rateSeries);
      drawMultiLineChart(this.shadowRoot.getElementById("c-temp"), tempSeries);
      drawMultiLineChart(this.shadowRoot.getElementById("c-rh"), rhSeries, { min: 0, max: 100 });
      drawMultiLineChart(this.shadowRoot.getElementById("c-vpd"), vpdSeries, { min: 0 });
    }
  }

  class DscTheDashEditor extends HTMLElement {
    constructor() {
      super();
      this._cfg = normalizeConfig(null);
      this._hass = null;
    }
    set hass(h) {
      this._hass = h;
      // Re-render once so entity names resolve if needed
      if (this.isConnected) this._render();
    }
    setConfig(c) {
      this._cfg = normalizeConfig(c);
      this._render();
    }
    _fire() {
      this.dispatchEvent(
        new CustomEvent("config-changed", { detail: { config: { ...this._cfg } }, bubbles: true, composed: true })
      );
    }
    _render() {
      const c = this._cfg;
      const pots = (c.pots || []).slice();
      while (pots.length < 4) {
        const n = pots.length + 1;
        pots.push({
          id: `pot${n}`,
          tent: n <= 2 ? "clone" : "main",
          slot: n <= 2 ? n - 1 : n - 3,
          prefix: `dsc_pot${n}`,
          in_service: `input_boolean.dsc_pot${n}_in_service`,
        });
      }
      const potRows = pots
        .map(
          (p, i) => `
        <div style="display:grid;grid-template-columns:70px 1fr 90px 70px;gap:8px;align-items:center;margin-bottom:6px">
          <strong>Pot ${i + 1}</strong>
          <input data-pot="${i}" data-k="prefix" value="${esc(p.prefix || "")}" placeholder="dsc_pot1"/>
          <select data-pot="${i}" data-k="tent">
            <option value="clone" ${p.tent === "clone" ? "selected" : ""}>2x4</option>
            <option value="main" ${p.tent === "main" ? "selected" : ""}>4x8</option>
          </select>
          <input data-pot="${i}" data-k="slot" type="number" min="0" max="7" value="${esc(p.slot ?? 0)}" title="Slot index"/>
        </div>`
        )
        .join("");
      this.innerHTML = `
        <div style="padding:14px;display:grid;gap:12px;font-family:system-ui,sans-serif;max-width:640px">
          <p style="margin:0;color:#9aa;font-size:13px;line-height:1.45">
            <strong style="color:#cfd8e6">Air path (fixed topology):</strong>
            Room lung → tent intakes → cascade 2×4→4×8 (neg. pressure) → 4×8 splits DUMP outside / RECIRC room.
            Exhaust absolute CFM on The Dash is mass-balanced to Σ intake × fan-% split — not raw exhaust CFM sensors
            (those stay nameplate proxies until Learning cal). There is no central filter machine.
            Heat mat is always the 2×4 element (not room heat).
            Edit titles, pot slots, and airflow entity ids below — duct geometry itself is not editable on-glass.
          </p>
          <label style="display:grid;gap:4px">Title
            <input id="t" style="width:100%;padding:8px" value="${esc(c.title)}"/>
          </label>
          <label style="display:grid;gap:4px">Subtitle
            <input id="s" style="width:100%;padding:8px" value="${esc(c.subtitle)}"/>
          </label>
          <div>
            <div style="font-size:12px;color:#888;margin-bottom:6px;font-weight:700;letter-spacing:0.06em">AIRFLOW ENTITIES</div>
            <div style="display:grid;grid-template-columns:160px 1fr;gap:6px;align-items:center;font-size:12px">
              <span>2×4 intake CFM</span><input data-ent="cfm_intake_2x4" value="${esc(c.entities.cfm_intake_2x4 || "")}"/>
              <span>4×8 intake CFM</span><input data-ent="cfm_intake_main" value="${esc(c.entities.cfm_intake_main || "")}"/>
              <span>Dump OUT fan %</span><input data-ent="fan_out" value="${esc(c.entities.fan_out || "")}"/>
              <span>Recirc fan %</span><input data-ent="fan_recirc" value="${esc(c.entities.fan_recirc || "")}"/>
              <span>Dump OUT CFM (split fallback)</span><input data-ent="cfm_out" value="${esc(c.entities.cfm_out || "")}"/>
              <span>Recirc CFM (split fallback)</span><input data-ent="cfm_recirc" value="${esc(c.entities.cfm_recirc || "")}"/>
              <span>Room temp</span><input data-ent="room_temp" value="${esc(c.entities.room_temp || "")}"/>
              <span>Room humidity</span><input data-ent="room_humidity" value="${esc(c.entities.room_humidity || "")}"/>
              <span>2×4 heat mat</span><input data-ent="grow_mat" value="${esc(c.entities.grow_mat || "")}"/>
            </div>
          </div>
          <div>
            <div style="font-size:12px;color:#888;margin-bottom:6px;font-weight:700;letter-spacing:0.06em">POTS → TENT / SLOT</div>
            <div style="display:grid;grid-template-columns:70px 1fr 90px 70px;gap:8px;font-size:11px;color:#777;margin-bottom:4px">
              <span></span><span>Entity prefix</span><span>Tent</span><span>Slot</span>
            </div>
            ${potRows}
          </div>
          <button type="button" id="apply" style="padding:10px;font-weight:700;cursor:pointer">Save layout</button>
        </div>`;
      const syncPotsFromDom = () => {
        const next = pots.map((p, i) => {
          const prefix = this.querySelector(`[data-pot="${i}"][data-k="prefix"]`)?.value || p.prefix;
          const tent = this.querySelector(`[data-pot="${i}"][data-k="tent"]`)?.value || p.tent;
          let slot = parseInt(this.querySelector(`[data-pot="${i}"][data-k="slot"]`)?.value, 10);
          const max = tent === "main" ? 7 : 3;
          if (!Number.isFinite(slot)) slot = 0;
          slot = Math.max(0, Math.min(max, slot));
          return {
            ...p,
            id: p.id || `pot${i + 1}`,
            prefix,
            tent,
            slot,
            in_service: p.in_service || `input_boolean.${prefix}_in_service`,
          };
        });
        this._cfg = { ...this._cfg, pots: next };
      };
      const syncEntFromDom = () => {
        const ents = { ...this._cfg.entities };
        this.querySelectorAll("[data-ent]").forEach((el) => {
          const k = el.getAttribute("data-ent");
          if (k) ents[k] = el.value.trim();
        });
        this._cfg = { ...this._cfg, entities: ents };
      };
      this.querySelector("#t").onchange = (e) => {
        this._cfg = { ...this._cfg, title: e.target.value };
        this._fire();
      };
      this.querySelector("#s").onchange = (e) => {
        this._cfg = { ...this._cfg, subtitle: e.target.value };
        this._fire();
      };
      this.querySelectorAll("[data-pot]").forEach((el) => {
        el.addEventListener("change", () => {
          syncPotsFromDom();
          this._fire();
        });
      });
      this.querySelectorAll("[data-ent]").forEach((el) => {
        el.addEventListener("change", () => {
          syncEntFromDom();
          this._fire();
        });
      });
      this.querySelector("#apply").onclick = () => {
        syncPotsFromDom();
        syncEntFromDom();
        this._fire();
        this._render();
      };
    }
  }

  if (!customElements.get(CARD_TYPE)) customElements.define(CARD_TYPE, DscTheDashCard);
  if (!customElements.get(EDITOR_TYPE)) customElements.define(EDITOR_TYPE, DscTheDashEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC The Dash",
    description: "Cinematic 2-tent ops surface with Three.js airflow scene",
    preview: true,
  });
})();
