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
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

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
      background: rgba(8,12,18,0.72); backdrop-filter: blur(8px);
      border: 1px solid rgba(100,120,150,0.35); border-radius: 8px;
      padding: 8px 10px; min-width: 110px;
    }
    .dash-hud.left { left: 14px; top: 14px; }
    .dash-hud.right { right: 14px; top: 14px; }
    .dash-hud .k { font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
    .dash-hud .v { font-size: 14px; font-weight: 700; margin-top: 2px; }
    .dash-hud .s { font-size: 11px; color: var(--accent); margin-top: 4px; }
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

  const createScene = (host) => {
    if (typeof THREE === "undefined") return null;

    const fx = THREE.DSCDashFX || null;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);
    scene.fog = new THREE.Fog(0x07090e, 12, 28);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if ("outputEncoding" in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    if (THREE.PCFSoftShadowMap) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    let post = null;
    if (fx && typeof fx.createComposer === "function") {
      try {
        post = fx.createComposer(renderer, scene, camera);
        if (post.bloomPass) {
          post.bloomPass.threshold = 0.72;
          post.bloomPass.strength = 0.7;
          post.bloomPass.radius = 0.55;
        }
      } catch (_) {
        post = null;
      }
    }

    const root = new THREE.Group();
    scene.add(root);

    const hemi = new THREE.HemisphereLight(0x9fbad2, 0x161019, 0.32);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffd8ad, 1.08);
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
    const fill = new THREE.DirectionalLight(0x5aa9ff, 0.38);
    fill.position.set(-6, 4.5, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xb66cff, 0.56);
    rim.position.set(4, 5, -6);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(11.5, 0.1, 8.2),
      new THREE.MeshStandardMaterial({ color: 0x0c1119, metalness: 0.08, roughness: 0.92 })
    );
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    root.add(floor);
    const grid = new THREE.GridHelper(10.8, 24, 0x263349, 0x131c29);
    grid.position.y = 0.005;
    if (grid.material) {
      grid.material.transparent = true;
      grid.material.opacity = 0.42;
    }
    root.add(grid);

    const roomShell = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 4.3, 7.3),
      new THREE.MeshBasicMaterial({
        color: 0x183047,
        transparent: true,
        opacity: 0.026,
        side: THREE.BackSide,
        depthWrite: false,
      })
    );
    roomShell.position.y = 2.05;
    root.add(roomShell);
    const roomEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(10.8, 4.3, 7.3)),
      new THREE.LineBasicMaterial({ color: 0x44637e, transparent: true, opacity: 0.18 })
    );
    roomEdges.position.copy(roomShell.position);
    root.add(roomEdges);
    // Room lung — layered horizontal volumetric slices (read as body, not bare grid)
    const roomLungSlices = [];
    for (let s = 0; s < 4; s++) {
      const slice = new THREE.Mesh(
        new THREE.PlaneGeometry(9.6 - s * 0.35, 6.2 - s * 0.25),
        new THREE.MeshBasicMaterial({
          color: 0x3d7ea8,
          transparent: true,
          opacity: 0.012 + s * 0.004,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      slice.rotation.x = -Math.PI / 2;
      slice.position.set(0, 0.55 + s * 0.72, 0.15);
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
    const mylarMat = new THREE.MeshStandardMaterial({
      color: 0xb9c8d7,
      metalness: 0.82,
      roughness: 0.22,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });
    const mkFabric = (opacity) =>
      new THREE.MeshStandardMaterial({
        color: 0x111822,
        metalness: 0.12,
        roughness: 0.82,
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
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, h, 10), poleMat);
          pole.position.set((sx * w) / 2, h / 2, (sz * d) / 2);
          pole.castShadow = true;
          group.add(pole);
        }
      }
      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.76 })
      );
      frame.position.y = h / 2;
      group.add(frame);
      const veil = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.94, h * 0.92),
        new THREE.MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.025,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      veil.position.set(0, h / 2, d / 2 - 0.012);
      group.add(veil);

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
    const curves = {
      intakeClone: mkCurve([
        [-2.75, 0.34, 3.05],
        [-2.75, 0.34, 2.1],
        [-2.75, 0.34, 1.2],
        [-2.75, 0.34, 0.5],
      ]),
      intakeMain: mkCurve([
        [2.15, 0.36, 3.15],
        [2.15, 0.36, 2.15],
        [2.15, 0.36, 1.28],
        [2.15, 0.36, 0.48],
      ]),
      cascade: mkCurve([
        [-1.52, 1.2, 0.28],
        [-0.82, 1.28, 0.22],
        [0.05, 1.25, 0.15],
        [0.95, 1.17, 0.1],
        [1.92, 1.08, 0.08],
      ]),
      out: mkCurve([
        [2.15, 2.34, 0.08],
        [2.15, 2.52, -0.45],
        [2.15, 2.65, -1.08],
        [2.15, 2.82, -1.72],
        [2.15, 2.96, -2.45],
      ]),
      recirc: mkCurve([
        [2.15, 2.32, 0.08],
        [2.05, 2.02, 0.72],
        [1.72, 1.55, 1.38],
        [0.95, 1.05, 2.05],
        [-0.2, 0.78, 2.72],
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
    const addPath = (name, radius, tubular) => {
      const solid = new THREE.Mesh(new THREE.TubeGeometry(curves[name], tubular, radius, 12, false), ductMat);
      solid.castShadow = true;
      solid.receiveShadow = true;
      ductGroup.add(solid);
      const shellMat = new THREE.MeshBasicMaterial({
        color: pathColors[name],
        transparent: true,
        opacity: 0,
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
            opacity: 0,
            dashArray: name === "cascade" ? [0.12, 0.055] : [0.11, 0.085],
          });
          ribbon.userData.flow = { name, curve: curves[name], tubular, baseRadius: radius * 0.38, lastWidth: -1 };
          ductGroup.add(ribbon);
        } catch (_) {
          ribbon = null;
        }
      }
      paths[name] = { solid, shell, ribbon, intensity: 0 };
    };
    addPath("intakeClone", 0.11, 44);
    addPath("intakeMain", 0.12, 44);
    addPath("cascade", 0.105, 58);
    addPath("out", 0.118, 50);
    addPath("recirc", 0.105, 52);

    const addFlexRings = (curve, count, radius) => {
      const geometry = new THREE.TorusGeometry(radius, 0.015, 6, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0xa9b7bf, metalness: 0.72, roughness: 0.34 });
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
    addFlexRings(curves.intakeClone, 24, 0.126);
    addFlexRings(curves.intakeMain, 24, 0.137);

    const mkFlange = (point, tangent, radius) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.026, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.75, roughness: 0.28 })
      );
      ring.position.copy(point);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent.clone().normalize());
      ring.castShadow = true;
      ductGroup.add(ring);
    };
    Object.values(curves).forEach((curve) => {
      mkFlange(curve.getPoint(0.02), curve.getTangent(0.02), 0.15);
      mkFlange(curve.getPoint(0.98), curve.getTangent(0.98), 0.15);
    });

    const mkFan = (curve, t, color) => {
      const group = new THREE.Group();
      const axis = curve.getTangent(t).normalize();
      group.position.copy(curve.getPoint(t));
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.255, 0.255, 0.2, 24, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x3b4d59, metalness: 0.72, roughness: 0.28 })
      );
      housing.castShadow = true;
      group.add(housing);
      const guard = new THREE.Mesh(
        new THREE.TorusGeometry(0.205, 0.018, 7, 24),
        new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8, roughness: 0.22 })
      );
      guard.rotation.x = Math.PI / 2;
      group.add(guard);
      const rotor = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.055, 0.022, 0.34),
          new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.16, metalness: 0.4 })
        );
        blade.position.y = 0;
        blade.rotation.y = (i * Math.PI * 2) / 5;
        rotor.add(blade);
      }
      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 14, 12),
        new THREE.MeshStandardMaterial({ color: 0xe8edf0, metalness: 0.45, roughness: 0.25 })
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
      exhaust: mkFan(curves.out, 0.42, 0xff8a65),
      recirc: mkFan(curves.recirc, 0.42, 0xba68c8),
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
    muffler.position.copy(curves.out.getPoint(0.68));
    muffler.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curves.out.getTangent(0.68).normalize());
    ductGroup.add(muffler);

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
        rampTexture = fx.createColorRamp([
          { t: 0, color: 0xffb74d },
          { t: 0.48, color: 0xff765e },
          { t: 1, color: 0xa85be0 },
        ]);
        const junction = new THREE.Mesh(
          new THREE.PlaneGeometry(0.72, 0.11),
          new THREE.MeshBasicMaterial({
            map: rampTexture,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          })
        );
        junction.position.set(2.15, 2.37, 0.08);
        junction.rotation.y = Math.PI / 2;
        root.add(junction);
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
    const mkPlant = (tall) => {
      const plant = new THREE.Group();
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.145, 0.22, 12),
        new THREE.MeshStandardMaterial({ color: 0x5b392c, roughness: 0.8 })
      );
      pot.position.y = 0.12;
      pot.castShadow = true;
      plant.add(pot);
      const stemHeight = tall ? 0.65 : 0.38;
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.03, stemHeight, 7),
        new THREE.MeshStandardMaterial({ color: 0x2f7b3c, roughness: 0.75 })
      );
      stem.position.y = 0.24 + stemHeight / 2;
      plant.add(stem);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x49a85a, emissive: 0x103b19, emissiveIntensity: 0.24 });
      for (let i = 0; i < (tall ? 6 : 4); i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(tall ? 0.12 : 0.09, 8, 6), leafMat.clone());
        const angle = (i * Math.PI * 2) / (tall ? 6 : 4);
        leaf.position.set(Math.cos(angle) * 0.14, 0.42 + (i % 2) * stemHeight * 0.45, Math.sin(angle) * 0.14);
        leaf.scale.set(1.7, 0.35, 0.85);
        leaf.rotation.y = -angle;
        plant.add(leaf);
      }
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
      // Depth-soft particles: soft sprite + view-Z edge fade so points dissolve into geometry
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: spriteTexture },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
          uSize: { value: size * 180 },
          uHasMap: { value: spriteTexture ? 1 : 0 },
        },
        vertexShader: `
          uniform float uSize;
          varying float vSoft;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vSoft = smoothstep(-0.35, -2.8, mv.z) * smoothstep(-18.0, -6.0, mv.z);
            gl_PointSize = uSize * (1.0 / max(1.0, -mv.z));
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uHasMap;
          varying float vSoft;
          void main() {
            vec2 uv = gl_PointCoord;
            float softEdge = 1.0 - smoothstep(0.32, 0.5, length(uv - 0.5));
            float alpha = softEdge * vSoft * uOpacity;
            if (uHasMap > 0.5) {
              alpha *= texture2D(uMap, uv).a;
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
    mkAir("intakeClone", 0x42a5f5, 58, 0.12);
    mkAir("intakeMain", 0x42a5f5, 66, 0.12);
    mkAir("cascade", 0xffb74d, 92, 0.145);
    mkAir("out", 0xff765e, 68, 0.135);
    mkAir("recirc", 0xa85be0, 68, 0.135);
    mkAir("matHeat", 0xff6d00, 34, 0.11);
    const particleColors = {
      intake: new THREE.Color(0x42a5f5),
      intakeWarm: new THREE.Color(0x66a4d9).lerp(new THREE.Color(0xff9b55), 0.16),
      cascade: new THREE.Color(0xffb74d),
      cascadeWarm: new THREE.Color(0xff9148),
    };

    let curl = null;
    if (fx && typeof fx.createCurlHaze === "function") {
      try {
        curl = fx.createCurlHaze(renderer, 520);
        curl.points.scale.set(0.78, 0.58, 0.58);
        curl.points.position.set(0, 1.25, 0.3);
        root.add(curl.points);
      } catch (_) {
        curl = null;
      }
    }

    const sampleCurve = (curve, t, radius, seed) => {
      const clamped = Math.max(0, Math.min(1, t));
      const point = curve.getPoint(clamped);
      const tangent = curve.getTangent(clamped);
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x);
      if (side.lengthSq() < 0.001) side.set(1, 0, 0);
      side.normalize();
      const up = new THREE.Vector3().crossVectors(tangent, side).normalize();
      const angle = seed * Math.PI * 2 + t * 8;
      return point
        .addScaledVector(side, Math.cos(angle) * radius * (0.35 + seed * 0.65))
        .addScaledVector(up, Math.sin(angle) * radius * (0.35 + seed * 0.65));
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
    const onDown = (event) => {
      orbit.dragging = true;
      orbit.x = event.clientX;
      orbit.y = event.clientY;
    };
    const onUp = () => {
      orbit.dragging = false;
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
      path.shell.material.opacity = active ? 0.08 + shown * 0.38 : 0;
      (arrowByPath[name] || []).forEach((arrow) => {
        arrow.visible = active;
        if (active) arrow.scale.setScalar(0.88 + Math.sin(now * 0.005) * 0.12);
      });
      if (path.ribbon) {
        const uniforms = path.ribbon.material.userData;
        uniforms.uOpacity.value = active ? (name === "cascade" ? 0.46 : 0.25) + shown * 0.58 : 0;
        uniforms.uDashOffset.value -= 0.005 + shown * 0.018;
        const width = active ? 0.46 + shown * 0.86 : 0.32;
        if (Math.abs(width - path.ribbon.userData.flow.lastWidth) > 0.08) {
          path.ribbon.geometry.dispose();
          path.ribbon.geometry = new THREE.TubeGeometry(
            path.ribbon.userData.flow.curve,
            path.ribbon.userData.flow.tubular,
            path.ribbon.userData.flow.baseRadius * width,
            6,
            false
          );
          path.ribbon.userData.flow.lastWidth = width;
        }
      }
    };

    const updateSystem = (name, curve, dt, intensity, mapper) => {
      const system = air[name];
      const active = intensity >= 0.04;
      const boost = highlights(name) || (name.startsWith("intake") && highlights("intake")) ? 1.42 : 1;
      const shown = active ? Math.min(1, intensity * boost) : 0;
      system.intensity = shown;
      system.points.visible = active;
      system.setOpacity(active ? Math.min(1, 0.3 + shown * 0.7) : 0);
      if (!active) return;
      const speed = 0.14 + shown * 0.62;
      for (let i = 0; i < system.count; i++) {
        system.phase[i] = (system.phase[i] + dt * speed * (0.82 + (i % 7) * 0.045)) % 1;
        const point = mapper
          ? mapper(system.phase[i], system.seed[i], i)
          : sampleCurve(curve, system.phase[i], 0.052, system.seed[i]);
        system.positions[i * 3] = point.x;
        system.positions[i * 3 + 1] = point.y;
        system.positions[i * 3 + 2] = point.z;
      }
      system.points.geometry.attributes.position.needsUpdate = true;
    };

    const updateCascadePlume = (dt, intensity) => {
      air.cascade.setColor(live.matOn ? particleColors.cascadeWarm : particleColors.cascade);
      updateSystem("cascade", curves.cascade, dt, intensity, (t, seed, i) => {
        if (t < 0.52) return sampleCurve(curves.cascade, t / 0.52, 0.055 + t * 0.08, seed);
        const u = (t - 0.52) / 0.48;
        const entry = curves.cascade.getPoint(1);
        const exhaust = curves.out.getPoint(0.04);
        const point = entry.clone().lerp(exhaust, Math.pow(u, 1.38));
        const swell = Math.sin(Math.PI * u);
        point.x += (seed - 0.5) * 1.65 * swell;
        point.y += ((i % 9) / 8 - 0.35) * 1.28 * swell;
        point.z += (((i * 0.618) % 1) - 0.5) * 1.25 * swell;
        return point;
      });
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
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      const intakeClone = Math.max(0, Number(live.fanIntakeClone) || 0);
      const intakeMain = Math.max(0, Number(live.fanIntakeMain) || 0);
      const cascade = Math.max(0, Number(live.cascadeNorm) || 0);
      const exhaust = Math.max(0, Number(live.fanExhaust) || 0);
      const recircFan = Math.max(0, Number(live.fanRecirc) || 0);
      const out = Math.max(0, Number(live.outShare) || 0) * exhaust;
      const recirc = Math.max(0, Number(live.recircShare) || 0) * recircFan;

      updatePathVisual("intakeClone", intakeClone, now);
      updatePathVisual("intakeMain", intakeMain, now);
      updatePathVisual("cascade", cascade, now);
      updatePathVisual("out", out, now);
      updatePathVisual("recirc", recirc, now);
      updateSystem("intakeClone", curves.intakeClone, dt, intakeClone);
      updateSystem("intakeMain", curves.intakeMain, dt, intakeMain);
      updateCascadePlume(dt, cascade);
      updateSystem("out", curves.out, dt, out);
      updateSystem("recirc", curves.recirc, dt, recirc);
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
      tentMain.userData.lightBar.material.emissiveIntensity = 0;
      tentMain.userData.lightBar.material.opacity = 0.025;

      const pulse = 0.86 + Math.sin(now * 0.0045) * 0.14;
      matPlate.material.emissiveIntensity = live.matOn ? 3.4 * pulse * (highlights("mat") ? 1.35 : 1) : 0;
      matGlow.material.opacity = live.matOn ? 0.38 * pulse * (highlights("mat") ? 1.4 : 1) : 0;
      ventGlow.material.opacity = out >= 0.04 ? 0.09 + out * 0.4 : 0.015;
      // Y-split bloom beat: OUT coral vs RECIRC violet shells diverge when both legs live
      if (paths.out && paths.recirc) {
        paths.out.shell.material.color.setHex(0xff765e);
        paths.recirc.shell.material.color.setHex(0xa85be0);
        if (out >= 0.04 && recirc >= 0.04) {
          paths.out.shell.material.opacity = Math.max(paths.out.shell.material.opacity, 0.18 + out * 0.42);
          paths.recirc.shell.material.opacity = Math.max(paths.recirc.shell.material.opacity, 0.18 + recirc * 0.42);
        }
      }

      const setAch = (tent, base) => {
        (tent.userData.achSlices || []).forEach((slice, i) => {
          slice.material.opacity = base * (0.55 + i * 0.28);
        });
      };
      setAch(tentClone, intakeClone >= 0.04 ? 0.025 + intakeClone * 0.085 : 0.008);
      setAch(
        tentMain,
        Math.max(intakeMain, cascade, exhaust) >= 0.04
          ? 0.026 + Math.max(intakeMain, cascade, exhaust) * 0.09
          : 0.008
      );
      roomShell.material.opacity = 0.024 + recirc * 0.045;
      roomEdges.material.opacity = 0.14 + recirc * 0.12;
      roomLungSlices.forEach((slice, i) => {
        slice.material.opacity = (0.01 + recirc * 0.055) * (0.55 + i * 0.18);
        slice.position.y = 0.55 + i * 0.72 + Math.sin(now * 0.00055 + i) * 0.04 * (0.4 + recirc);
      });
      if (curl) curl.update(dt, recirc);

      fans.intakeClone.userData.speed = intakeClone * 15;
      fans.intakeMain.userData.speed = intakeMain * 15;
      fans.exhaust.userData.speed = exhaust * 17;
      fans.recirc.userData.speed = recircFan * 15;
      Object.values(fans).forEach((fan) => {
        fan.userData.rotor.rotation.y += fan.userData.speed * dt;
      });

      Object.entries(appliances).forEach(([name, body]) => {
        const on = !!(live.devices || []).find((device) => device.id === name && device.on);
        body.material.emissiveIntensity = on ? 0.72 : 0;
      });
      const slots = live.potSlots || { clone: [], main: [] };
      ["clone", "main"].forEach((key) => {
        pots[key].forEach((plant, i) => {
          const slot = slots[key] && slots[key][i];
          plant.visible = !!slot;
          if (slot && slot.color) {
            plant.children.slice(2).forEach((leaf) => {
              if (leaf.material && leaf.material.color) leaf.material.color.set(slot.color);
            });
          }
        });
      });

      if (post && typeof post.render === "function") post.render();
      else renderer.render(scene, camera);
    };

    resize();
    raf = requestAnimationFrame(tick);

    return {
      resize,
      setLive,
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
        const geometries = new Set();
        const materials = new Set();
        scene.traverse((object) => {
          if (object.geometry) geometries.add(object.geometry);
          if (Array.isArray(object.material)) object.material.forEach((material) => materials.add(material));
          else if (object.material) materials.add(object.material);
        });
        geometries.forEach((geometry) => geometry.dispose && geometry.dispose());
        materials.forEach((material) => material.dispose && material.dispose());
        if (spriteTexture) spriteTexture.dispose();
        if (rampTexture) rampTexture.dispose();
        if (mergeRampTexture) mergeRampTexture.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
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
        this._scene = createScene(host);
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
      const potSlots = { clone: Array(4).fill(null), main: Array(8).fill(null) };
      pots.forEach((p, idx) => {
        const tent = p.tent === "main" ? "main" : "clone";
        const max = tent === "main" ? 8 : 4;
        let slot = Number.isFinite(+p.slot) ? +p.slot : idx;
        if (slot < 0 || slot >= max) slot = 0;
        potSlots[tent][slot] = { id: p.id, color: POT_COLORS[idx % POT_COLORS.length] };
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

      return {
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
      };
    }

    async _update() {
      if (!this.shadowRoot || !this._hass) return;
      const live = this._buildLive();
      if (!live) return;
      live.pathHighlight = this._pathHighlight || "";
      this._lastLive = live;

      const status = this.shadowRoot.getElementById("d-status");
      if (status) {
        status.className = "dash-pill" + (live.emerg ? " bad" : "");
        status.textContent = live.emerg
          ? "FAILSAFE // EMERGENCY"
          : `ONLINE // ${live.strategy || "NOMINAL"} · ${live.priority || ""}`.trim();
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
      const hudC = this.shadowRoot.getElementById("d-hud-clone");
      if (hudC) {
        hudC.innerHTML = `<div class="k">2×4 Reservoir</div><div class="v">${esc(live.cloneClimate)}</div><div class="s">${esc(lightNote)}${live.matOn ? " · heat mat ON" : ""}</div>`;
      }
      const hudM = this.shadowRoot.getElementById("d-hud-main");
      if (hudM) {
        hudM.innerHTML = `<div class="k">4×8 Main</div><div class="v">${esc(live.mainClimate)}</div><div class="s">No lamp · cascade in · exhaust split OUT/RECIRC</div>`;
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
        foot.innerHTML = `
          <span>The Dash · presentation surface</span>
          <span>${new Date().toLocaleString()}</span>
          ${alerts.join(" · ") || `<span style="color:var(--ok)">All systems nominal</span>`}
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
