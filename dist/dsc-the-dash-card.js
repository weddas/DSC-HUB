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
    .dash-scene-wrap canvas { display: block; width: 100%; height: 100%; }
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
    .dash-legend span { display: inline-flex; align-items: center; gap: 6px; }
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d12);
    scene.fog = new THREE.Fog(0x0a0d12, 14, 32);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(7.2, 5.4, 8.6);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xb0c4de, 0x1a1a1a, 0.55);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(6, 10, 4);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4fc3f7, 0.25);
    fill.position.set(-5, 4, -2);
    scene.add(fill);

    const root = new THREE.Group();
    scene.add(root);

    // Room plate + grid
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.08, 8),
      new THREE.MeshStandardMaterial({ color: 0x10161f, roughness: 0.9, metalness: 0.05 })
    );
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    root.add(floor);
    const grid = new THREE.GridHelper(10, 20, 0x2a3548, 0x1a2230);
    grid.position.y = 0.01;
    root.add(grid);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.55, roughness: 0.4 });
    const fabricMat = (tint) =>
      new THREE.MeshStandardMaterial({
        color: tint,
        metalness: 0.08,
        roughness: 0.82,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
      });
    const mylarInner = new THREE.MeshStandardMaterial({
      color: 0xdce3ea,
      metalness: 0.7,
      roughness: 0.22,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });

    const mkTent = (w, d, h, accent, glowColor) => {
      const g = new THREE.Group();
      const shellTint = 0x1c2430;
      const wall = (ww, hh, dd, x, y, z) => {
        const outer = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), fabricMat(shellTint));
        outer.position.set(x, y, z);
        g.add(outer);
      };
      wall(w, h, 0.05, 0, h / 2, -d / 2);
      wall(0.05, h, d, -w / 2, h / 2, 0);
      wall(0.05, h, d, w / 2, h / 2, 0);
      wall(w, 0.05, d, 0, h, 0);
      // Inner mylar (visible through open front)
      const inner = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, h * 0.96, d * 0.96), mylarInner);
      inner.position.y = h / 2;
      g.add(inner);
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.92, 0.06, d * 0.92),
        new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.8 })
      );
      tray.position.y = 0.05;
      g.add(tray);
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, h, 8), poleMat);
          p.position.set((sx * w) / 2, h / 2, (sz * d) / 2);
          g.add(p);
        }
      // Front zipper rails
      const zipL = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, h * 0.92, 0.03),
        new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.25 })
      );
      zipL.position.set(-w * 0.22, h / 2, d / 2 - 0.02);
      const zipR = zipL.clone();
      zipR.position.x = w * 0.22;
      g.add(zipL);
      g.add(zipR);
      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
        new THREE.LineBasicMaterial({ color: accent })
      );
      frame.position.y = h / 2;
      g.add(frame);
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.7, 0.08, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x37474f, emissive: glowColor, emissiveIntensity: 0.2 })
      );
      bar.position.set(0, h - 0.12, 0);
      g.add(bar);
      const lightPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.85, d * 0.75),
        new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      lightPlane.rotation.x = Math.PI / 2;
      lightPlane.position.y = h - 0.2;
      g.add(lightPlane);
      const volume = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.88, h * 0.75, d * 0.88),
        new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: 0.06,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      volume.position.y = h * 0.45;
      g.add(volume);
      g.userData.lightPlane = lightPlane;
      g.userData.bar = bar;
      g.userData.volume = volume;
      g.userData.color = accent;
      return g;
    };

    const tentClone = mkTent(2.4, 1.5, 2.1, 0x26c6da, 0x29b6f6);
    tentClone.position.set(-2.8, 0, 0.35);
    root.add(tentClone);

    const tentMain = mkTent(3.8, 2.15, 2.45, 0xff8a65, 0xf48fb1);
    tentMain.position.set(2.2, 0, 0.15);
    root.add(tentMain);

    // Ducting — real DSC path (no central “filter machine”):
    // Room → intake into each tent → cascade 2x4→4x8 → 4x8 splits to OUT / RECIRC
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.75, roughness: 0.28 });
    const glowDuct = (color) =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    const mkPipe = (r, len, mat = ductMat) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 24), mat);
      m.castShadow = true;
      return m;
    };
    const mkElbow = (from, to, radius = 0.14, mat = ductMat) => {
      const dir = new THREE.Vector3().subVectors(to, from);
      const len = Math.max(0.05, dir.length());
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const pipe = mkPipe(radius, len, mat);
      pipe.position.copy(mid);
      pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return pipe;
    };
    const mkArrow = (pos, dir, color) => {
      const g = new THREE.Group();
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.24, 10),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
      );
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      g.add(cone);
      g.position.copy(pos);
      return g;
    };

    const ducts = new THREE.Group();
    const blueMat = glowDuct(0x42a5f5);
    const amberMat = glowDuct(0xffb74d);
    const purpleMat = glowDuct(0xab47bc);
    const outMat = glowDuct(0xff8a65);

    // Room intake stubs (from front of room into each tent floor port)
    ducts.add(mkElbow(new THREE.Vector3(-2.8, 0.35, 2.2), new THREE.Vector3(-2.8, 0.35, 0.9), 0.12, blueMat));
    ducts.add(mkElbow(new THREE.Vector3(-2.8, 0.35, 0.9), new THREE.Vector3(-2.8, 0.35, 0.35), 0.12));
    ducts.add(mkElbow(new THREE.Vector3(2.2, 0.35, 2.4), new THREE.Vector3(2.2, 0.35, 1.0), 0.13, blueMat));
    ducts.add(mkElbow(new THREE.Vector3(2.2, 0.35, 1.0), new THREE.Vector3(2.2, 0.35, 0.4), 0.13));

    // Cascade 2x4 → 4x8 (passive / negative pressure)
    ducts.add(mkElbow(new THREE.Vector3(-1.55, 1.1, 0.3), new THREE.Vector3(0.2, 1.1, 0.2), 0.11, amberMat));
    ducts.add(mkElbow(new THREE.Vector3(0.2, 1.1, 0.2), new THREE.Vector3(1.55, 1.1, 0.15), 0.11, amberMat));

    // 4x8 exhaust: OUT (dump outside) — rise + back; small inline muffler on OUT only (not a central filter hub)
    ducts.add(mkElbow(new THREE.Vector3(2.2, 2.15, 0.2), new THREE.Vector3(2.2, 2.55, -0.6), 0.12, outMat));
    ducts.add(mkElbow(new THREE.Vector3(2.2, 2.55, -0.6), new THREE.Vector3(2.2, 2.9, -1.8), 0.12));
    const outCarbon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.38, 14),
      new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.45, roughness: 0.5 })
    );
    outCarbon.position.set(2.2, 2.55, -1.15);
    outCarbon.rotation.x = Math.PI / 2;
    ducts.add(outCarbon);

    // 4x8 exhaust: RECIRC back into room
    ducts.add(mkElbow(new THREE.Vector3(2.2, 1.85, 0.4), new THREE.Vector3(2.2, 1.4, 1.5), 0.11, purpleMat));
    ducts.add(mkElbow(new THREE.Vector3(2.2, 1.4, 1.5), new THREE.Vector3(1.0, 0.9, 2.3), 0.11, purpleMat));

    const airArrows = [
      mkArrow(new THREE.Vector3(-2.8, 0.5, 1.5), new THREE.Vector3(0, 0, -1), 0x42a5f5),
      mkArrow(new THREE.Vector3(2.2, 0.5, 1.7), new THREE.Vector3(0, 0, -1), 0x42a5f5),
      mkArrow(new THREE.Vector3(-0.4, 1.25, 0.25), new THREE.Vector3(1, 0, 0), 0xffb74d),
      mkArrow(new THREE.Vector3(2.2, 2.7, -1.0), new THREE.Vector3(0, 0.4, -1), 0xff8a65),
      mkArrow(new THREE.Vector3(1.5, 1.15, 1.9), new THREE.Vector3(-0.6, -0.2, 0.5), 0xab47bc),
    ];
    airArrows.forEach((a) => ducts.add(a));
    ducts.userData.arrows = airArrows;

    const mkFan = (pos, axis = "z") => {
      const g = new THREE.Group();
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.2, 20),
        new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.55, roughness: 0.35 })
      );
      if (axis === "z") housing.rotation.x = Math.PI / 2;
      else if (axis === "x") housing.rotation.z = Math.PI / 2;
      g.add(housing);
      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xeceff1 })
      );
      g.add(hub);
      const blades = [];
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(0.07, 0.02, 0.36),
          new THREE.MeshStandardMaterial({ color: 0x90caf9, metalness: 0.4, roughness: 0.4 })
        );
        b.rotation.y = (i * Math.PI * 2) / 3;
        g.add(b);
        blades.push(b);
      }
      g.position.copy(pos);
      g.userData.blades = blades;
      g.userData.speed = 0;
      return g;
    };

    const fanIntakeClone = mkFan(new THREE.Vector3(-2.8, 0.35, 1.15));
    const fanIntakeMain = mkFan(new THREE.Vector3(2.2, 0.35, 1.35));
    const fanExhaust = mkFan(new THREE.Vector3(2.2, 2.55, -0.9));
    const fanRecirc = mkFan(new THREE.Vector3(2.2, 1.55, 1.1));
    ducts.add(fanIntakeClone);
    ducts.add(fanIntakeMain);
    ducts.add(fanExhaust);
    ducts.add(fanRecirc);
    root.add(ducts);

    // Heat mat — 2x4 only (does not heat the room)
    const growMat = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.04, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x3e2723, emissive: 0xff6d00, emissiveIntensity: 0 })
    );
    growMat.position.set(0, 0.08, 0.15);
    tentClone.add(growMat);

    // Outside dump marker (window plane)
    const outside = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.1),
      new THREE.MeshBasicMaterial({ color: 0x1a3040, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    outside.position.set(2.2, 2.9, -2.15);
    root.add(outside);

    // Appliances on floor (room gear — heater is room heater, not the mat)
    const appliances = {};
    const mkAppliance = (name, x, z, color) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.35, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x222933, emissive: color, emissiveIntensity: 0 })
      );
      body.position.y = 0.18;
      g.add(body);
      g.position.set(x, 0, z);
      g.userData.body = body;
      root.add(g);
      appliances[name] = g;
      return g;
    };
    mkAppliance("heater", -4.2, 1.5, 0xff7043);
    mkAppliance("ac", -4.2, 0.6, 0x4fc3f7);
    mkAppliance("humidifier", -4.2, -0.3, 0x29b6f6);
    mkAppliance("dehumidifier", -4.2, -1.2, 0x80cbc4);
    mkAppliance("clone_humidifier", -3.6, 1.2, 0x81d4fa);

    // Pot slots with stylized plants
    const potMeshes = { clone: [], main: [] };
    const mkPlant = (tall) => {
      const pot = new THREE.Group();
      const potBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.15, 0.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.85 })
      );
      potBody.position.y = 0.12;
      pot.add(potBody);
      const soil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.04, 12),
        new THREE.MeshStandardMaterial({ color: 0x3e2723 })
      );
      soil.position.y = 0.22;
      pot.add(soil);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.03, tall ? 0.7 : 0.4, 6),
        new THREE.MeshStandardMaterial({ color: 0x2e7d32 })
      );
      stem.position.y = tall ? 0.55 : 0.42;
      pot.add(stem);
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(tall ? 0.28 : 0.2, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0x43a047, emissive: 0x1b5e20, emissiveIntensity: 0.25 })
      );
      canopy.position.y = tall ? 0.9 : 0.65;
      canopy.scale.y = 0.75;
      pot.add(canopy);
      if (tall) {
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x66bb6a })
        );
        leaf.position.set(0.12, 0.55, 0.05);
        leaf.scale.set(1.2, 0.45, 0.8);
        pot.add(leaf);
      }
      pot.userData.plant = pot;
      pot.userData.pad = potBody;
      pot.visible = false;
      return pot;
    };
    const placePots = (tentGroup, count, key, cols, tall) => {
      const w = key === "clone" ? 2.4 : 3.8;
      const d = key === "clone" ? 1.5 : 2.15;
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rows = Math.ceil(count / cols);
        const gx = (col - (cols - 1) / 2) * (w * 0.28);
        const gz = (row - (rows - 1) / 2) * (d * 0.32);
        const pot = mkPlant(tall);
        pot.position.set(gx, 0.08, gz);
        tentGroup.add(pot);
        potMeshes[key].push(pot);
      }
    };
    placePots(tentClone, 4, "clone", 2, false);
    placePots(tentMain, 8, "main", 4, true);

    // Air particles
    const air = {};
    const mkAir = (color, n) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size: 0.14,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      root.add(pts);
      return { pts, pos, n, t: new Float32Array(n).map(() => Math.random()), mat };
    };
    air.intake = mkAir(0x42a5f5, 70);
    air.cascade = mkAir(0xffb74d, 50);
    air.out = mkAir(0xff8a65, 55);
    air.recirc = mkAir(0xab47bc, 50);

    // Orbit state
    const orbit = { theta: 0.85, phi: 1.05, radius: 12.5, dragging: false, lx: 0, ly: 0 };
    const applyCam = () => {
      const x = orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta);
      const y = orbit.radius * Math.cos(orbit.phi);
      const z = orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta);
      camera.position.set(x, y, z);
      camera.lookAt(0, 1.1, 0);
    };
    applyCam();

    const onDown = (e) => {
      orbit.dragging = true;
      orbit.lx = e.clientX;
      orbit.ly = e.clientY;
    };
    const onUp = () => {
      orbit.dragging = false;
    };
    const onMove = (e) => {
      if (!orbit.dragging) return;
      const dx = e.clientX - orbit.lx;
      const dy = e.clientY - orbit.ly;
      orbit.lx = e.clientX;
      orbit.ly = e.clientY;
      orbit.theta -= dx * 0.005;
      orbit.phi = Math.max(0.35, Math.min(1.35, orbit.phi + dy * 0.005));
      applyCam();
    };
    const onWheel = (e) => {
      e.preventDefault();
      orbit.radius = Math.max(7, Math.min(18, orbit.radius + e.deltaY * 0.01));
      applyCam();
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    let live = {};
    const setLive = (L) => {
      live = L || {};
    };

    const resize = () => {
      const w = host.clientWidth || 640;
      const h = host.clientHeight || 400;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const updateAir = (sys, dt) => {
      const run = (sysBag, pathFn, intensity) => {
        const on = intensity > 0.04;
        sysBag.mat.opacity = on ? Math.min(0.9, 0.25 + intensity * 0.7) : 0.03;
        const arr = sysBag.pos;
        const speed = on ? 0.2 + intensity * 0.5 : 0.03;
        for (let i = 0; i < sysBag.n; i++) {
          sysBag.t[i] = (sysBag.t[i] + dt * speed) % 1;
          const p = pathFn(sysBag.t[i], i);
          arr[i * 3] = p.x;
          arr[i * 3 + 1] = p.y;
          arr[i * 3 + 2] = p.z;
        }
        sysBag.pts.geometry.attributes.position.needsUpdate = true;
      };
      const inClone = Math.max(0, live.fanIntakeClone || 0);
      const inMain = Math.max(0, live.fanIntakeMain || 0);
      const casc = Math.max(0, live.cascadeNorm || 0);
      const outI = (live.outShare || 0) * Math.max(0.1, live.fanExhaust || 0);
      const recI = (live.recircShare || 0) * Math.max(0.1, live.fanRecirc || 0);

      // Blue: room → into tent floor ports
      run(
        air.intake,
        (t, i) => {
          const toClone = i % 2 === 0;
          const inten = toClone ? inClone : inMain;
          const x = toClone ? -2.8 : 2.2;
          if (inten < 0.03) return new THREE.Vector3(x, 0.2, 2.4);
          const z0 = toClone ? 2.2 : 2.4;
          return new THREE.Vector3(x, 0.35, z0 - t * (z0 - 0.4));
        },
        Math.max(inClone, inMain)
      );
      // Amber: cascade 2x4 → 4x8
      run(
        air.cascade,
        (t) => new THREE.Vector3(-1.5 + t * 3.0, 1.1 + Math.sin(t * Math.PI) * 0.05, 0.25),
        casc
      );
      // Orange: 4x8 → outside dump
      run(
        air.out,
        (t) => {
          if (t < 0.4) return new THREE.Vector3(2.2, 2.15 + t * 1.0, 0.2 - t * 2.0);
          return new THREE.Vector3(2.2, 2.55 + (t - 0.4) * 0.8, -0.6 - (t - 0.4) * 2.2);
        },
        outI
      );
      // Purple: 4x8 → room recirc
      run(
        air.recirc,
        (t) => new THREE.Vector3(2.2 - t * 1.4, 1.85 - t * 0.9, 0.4 + t * 1.9),
        recI
      );
    };

    let last = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const ll = live.lightLevel || 0;
      tentClone.userData.lightPlane.material.opacity = live.cloneLit ? 0.22 + ll * 0.45 : 0.05;
      tentClone.userData.volume.material.opacity = live.cloneLit ? 0.1 + ll * 0.12 : 0.03;
      tentClone.userData.bar.material.emissiveIntensity = live.cloneLit ? 0.4 + ll * 0.8 : 0.08;
      // 4x8 has no lamp — keep canopy dim unless we add a future light
      tentMain.userData.lightPlane.material.opacity = 0.04;
      tentMain.userData.volume.material.opacity = 0.03;
      tentMain.userData.bar.material.emissiveIntensity = 0.05;

      growMat.material.emissiveIntensity = live.matOn ? 0.85 : 0.0;

      fanIntakeClone.userData.speed = (live.fanIntakeClone || 0) * 14;
      fanIntakeMain.userData.speed = (live.fanIntakeMain || 0) * 14;
      fanExhaust.userData.speed = (live.fanExhaust || 0) * 16;
      fanRecirc.userData.speed = (live.fanRecirc || 0) * 14;
      for (const f of [fanIntakeClone, fanIntakeMain, fanExhaust, fanRecirc]) {
        for (const b of f.userData.blades) b.rotation.y += f.userData.speed * dt;
      }
      if (ducts.userData.arrows) {
        const pulse = 0.65 + Math.sin(now * 0.004) * 0.25;
        ducts.userData.arrows.forEach((a) => a.scale.setScalar(pulse));
      }

      for (const [name, g] of Object.entries(appliances)) {
        const on = !!(live.devices || []).find((d) => d.id === name && d.on);
        g.userData.body.material.emissiveIntensity = on ? 0.55 : 0.0;
      }

      const assign = live.potSlots || { clone: [], main: [] };
      for (const key of ["clone", "main"]) {
        potMeshes[key].forEach((m, i) => {
          const filled = assign[key] && assign[key][i];
          m.visible = !!filled;
          if (filled && filled.color && m.children[3] && m.children[3].material) {
            m.children[3].material.color.set(filled.color);
          }
        });
      }

      updateAir(air, dt);
      renderer.render(scene, camera);
    };

    resize();
    raf = requestAnimationFrame(tick);

    return {
      resize,
      setLive,
      dispose() {
        cancelAnimationFrame(raf);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("wheel", onWheel);
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
                <div class="dash-legend">
                  <span><i class="dash-dot" style="background:#66bb6a"></i> 2x4 light</span>
                  <span><i class="dash-dot" style="background:#ff6d00"></i> 2x4 heat mat</span>
                  <span><i class="dash-dot" style="background:#42a5f5"></i> Intake</span>
                  <span><i class="dash-dot" style="background:#ffb74d"></i> Cascade 2x4→4x8</span>
                  <span><i class="dash-dot" style="background:#ff8a65"></i> Dump out</span>
                  <span><i class="dash-dot" style="background:#ab47bc"></i> Recirc</span>
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
        pots,
      };
    }

    async _update() {
      if (!this.shadowRoot || !this._hass) return;
      const live = this._buildLive();
      if (!live) return;

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
