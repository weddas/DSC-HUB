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
      min-height: calc(100vh - 96px);
      display: flex;
      flex-direction: column;
    }
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
      grid-template-columns: minmax(0, 1.75fr) minmax(280px, 0.9fr);
      gap: 12px; padding: 12px; min-height: 0;
    }
    .dash-main { display: flex; flex-direction: column; gap: 12px; min-height: 0; }
    .dash-scene-wrap {
      position: relative; flex: 1; min-height: 360px;
      background: linear-gradient(180deg, #101722, #0a0d12);
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
      display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;
    }
    .dash-chart {
      background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
      padding: 8px 10px 6px; min-height: 118px; display: flex; flex-direction: column;
    }
    .dash-chart h4 {
      margin: 0 0 4px; font-size: 10px; letter-spacing: 0.08em; color: var(--muted);
      text-transform: uppercase; font-weight: 700;
    }
    .dash-chart canvas { width: 100%; flex: 1; min-height: 72px; }
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
    .dash-flow svg { width: 100%; height: auto; display: block; }
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
      .dash-charts { grid-template-columns: 1fr; }
      .dash { min-height: auto; }
      .dash-scene-wrap { min-height: 320px; }
    }
  `;

  /* ------------------------------------------------------------------ */
  /* Flow diagram (device → split → exhaust)                             */
  /* ------------------------------------------------------------------ */

  const renderFlow = (live) => {
    const devices = (live.devices || []).filter((d) => d.on);
    const leftY = (i, n) => 30 + (n <= 1 ? 70 : (i * 140) / Math.max(1, n - 1));
    const leftNodes = devices
      .map((d, i) => {
        const y = leftY(i, devices.length);
        return `
          <g transform="translate(18,${y})">
            <rect x="0" y="-16" width="88" height="32" rx="6" fill="#1a2433" stroke="${d.color}" stroke-width="1.4"/>
            <text x="44" y="4" text-anchor="middle" fill="#cfd8e6" font-size="10" font-weight="700">${esc(d.label)}</text>
            <path d="M88 0 C120 0, 120 ${70 - y}, 150 ${70 - y}" fill="none" stroke="${d.color}" stroke-width="2.2" opacity="0.85"/>
          </g>`;
      })
      .join("");

    const s2 = Math.round((live.splitClone || 0) * 100);
    const s8 = Math.round((live.splitMain || 0) * 100);
    const o = Math.round((live.outShare || 0) * 100);
    const r = Math.round((live.recircShare || 0) * 100);

    return `
      <svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" aria-label="Airflow device split">
        ${leftNodes || `<text x="50" y="90" fill="#8b95a8" font-size="11">No active devices</text>`}
        <g transform="translate(150,70)">
          <rect x="0" y="-28" width="70" height="56" rx="8" fill="#152030" stroke="#26c6da" stroke-width="1.6"/>
          <text x="35" y="-6" text-anchor="middle" fill="#8b95a8" font-size="9">INTAKE</text>
          <text x="35" y="12" text-anchor="middle" fill="#e8eef8" font-size="12" font-weight="700">SPLIT</text>
        </g>
        <path d="M220 55 C250 40, 270 35, 290 35" fill="none" stroke="#26c6da" stroke-width="2.4"/>
        <path d="M220 85 C250 100, 270 115, 290 120" fill="none" stroke="#ffb74d" stroke-width="2.4"/>
        <g transform="translate(290,20)">
          <rect width="60" height="32" rx="6" fill="#13202e" stroke="#26c6da"/>
          <text x="30" y="13" text-anchor="middle" fill="#8b95a8" font-size="8">2x4</text>
          <text x="30" y="25" text-anchor="middle" fill="#e8eef8" font-size="12" font-weight="700">${s2}%</text>
        </g>
        <g transform="translate(290,104)">
          <rect width="60" height="32" rx="6" fill="#2a2018" stroke="#ffb74d"/>
          <text x="30" y="13" text-anchor="middle" fill="#8b95a8" font-size="8">4x8</text>
          <text x="30" y="25" text-anchor="middle" fill="#e8eef8" font-size="12" font-weight="700">${s8}%</text>
        </g>
        <g transform="translate(150,145)">
          <text x="0" y="0" fill="#8b95a8" font-size="9">EXHAUST</text>
          <text x="70" y="0" fill="#42a5f5" font-size="11" font-weight="700">OUT ${o}%</text>
          <text x="150" y="0" fill="#ab47bc" font-size="11" font-weight="700">RECIRC ${r}%</text>
        </g>
      </svg>`;
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

    // Floor / room plate
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 48),
      new THREE.MeshStandardMaterial({ color: 0x141a24, roughness: 0.85, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    root.add(floor);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(7.2, 7.5, 64),
      new THREE.MeshBasicMaterial({ color: 0x2a3548, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    root.add(ring);

    const mkTent = (w, d, h, color) => {
      const g = new THREE.Group();
      const shellMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a222c,
        metalness: 0.15,
        roughness: 0.35,
        transmission: 0.15,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), shellMat);
      box.position.y = h / 2;
      box.castShadow = true;
      g.add(box);
      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(w * 1.001, h * 1.001, d * 1.001)),
        new THREE.LineBasicMaterial({ color })
      );
      frame.position.y = h / 2;
      g.add(frame);
      const lightPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.7, d * 0.55),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
      );
      lightPlane.rotation.x = Math.PI / 2;
      lightPlane.position.y = h - 0.08;
      g.add(lightPlane);
      g.userData.shell = box;
      g.userData.lightPlane = lightPlane;
      g.userData.frame = frame;
      g.userData.color = color;
      return g;
    };

    const tentClone = mkTent(2.2, 1.4, 2.0, 0x26c6da);
    tentClone.position.set(-2.6, 0, 0.2);
    root.add(tentClone);

    const tentMain = mkTent(3.6, 2.0, 2.35, 0xff8a65);
    tentMain.position.set(2.1, 0, 0);
    root.add(tentMain);

    // Duct spine
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x6a7380, metalness: 0.65, roughness: 0.35 });
    const mkPipe = (r, len) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20), ductMat);
      m.castShadow = true;
      return m;
    };

    const spine = new THREE.Group();
    const vertical = mkPipe(0.18, 3.2);
    vertical.position.set(0, 2.0, -1.1);
    spine.add(vertical);

    const carbon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 1.1, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a3038, metalness: 0.4, roughness: 0.55 })
    );
    carbon.position.set(0, 1.5, -1.1);
    spine.add(carbon);
    const carbonBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.43, 0.04, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x90a4ae })
    );
    carbonBand.rotation.x = Math.PI / 2;
    carbonBand.position.copy(carbon.position);
    spine.add(carbonBand);

    const mkElbow = (from, to, radius = 0.14) => {
      const dir = new THREE.Vector3().subVectors(to, from);
      const len = dir.length();
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const pipe = mkPipe(radius, len);
      pipe.position.copy(mid);
      pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return pipe;
    };

    // Intake to clone
    spine.add(mkElbow(new THREE.Vector3(-2.6, 0.35, 0.9), new THREE.Vector3(-2.6, 0.35, -1.1), 0.11));
    spine.add(mkElbow(new THREE.Vector3(-2.6, 0.35, -1.1), new THREE.Vector3(0, 0.35, -1.1), 0.11));
    // Intake to main
    spine.add(mkElbow(new THREE.Vector3(2.1, 0.35, 1.1), new THREE.Vector3(2.1, 0.35, -1.1), 0.12));
    spine.add(mkElbow(new THREE.Vector3(2.1, 0.35, -1.1), new THREE.Vector3(0, 0.35, -1.1), 0.12));
    // Exhaust from tents to spine top
    spine.add(mkElbow(new THREE.Vector3(-2.6, 1.85, 0), new THREE.Vector3(-2.6, 1.85, -1.1), 0.1));
    spine.add(mkElbow(new THREE.Vector3(-2.6, 1.85, -1.1), new THREE.Vector3(0, 1.85, -1.1), 0.1));
    spine.add(mkElbow(new THREE.Vector3(2.1, 2.15, 0), new THREE.Vector3(2.1, 2.15, -1.1), 0.12));
    spine.add(mkElbow(new THREE.Vector3(2.1, 2.15, -1.1), new THREE.Vector3(0, 2.15, -1.1), 0.12));
    // Out stack
    const outStack = mkPipe(0.16, 1.4);
    outStack.position.set(0, 3.5, -1.1);
    spine.add(outStack);

    const mkFan = (pos) => {
      const g = new THREE.Group();
      const housing = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.06, 10, 24),
        new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.5, roughness: 0.4 })
      );
      housing.rotation.y = Math.PI / 2;
      g.add(housing);
      const blades = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x90caf9 })
      );
      blades.rotation.z = Math.PI / 2;
      const blade2 = blades.clone();
      blade2.rotation.x = Math.PI / 2;
      g.add(blades);
      g.add(blade2);
      g.position.copy(pos);
      g.userData.blades = [blades, blade2];
      g.userData.speed = 0;
      return g;
    };

    const fanIntake = mkFan(new THREE.Vector3(0, 0.35, -1.1));
    const fanExhaust = mkFan(new THREE.Vector3(0, 2.6, -1.1));
    spine.add(fanIntake);
    spine.add(fanExhaust);
    root.add(spine);

    // Appliances on floor
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
    mkAppliance("clone_humidifier", -3.5, 1.0, 0x81d4fa);

    // Pot slots
    const potMeshes = { clone: [], main: [] };
    const placePots = (tentGroup, count, key, cols) => {
      const w = key === "clone" ? 2.2 : 3.6;
      const d = key === "clone" ? 1.4 : 2.0;
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rows = Math.ceil(count / cols);
        const gx = (col - (cols - 1) / 2) * (w * 0.28);
        const gz = (row - (rows - 1) / 2) * (d * 0.28);
        const pot = new THREE.Group();
        const pad = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.18, 0.08, 16),
          new THREE.MeshStandardMaterial({ color: 0x2a3340, transparent: true, opacity: 0.35 })
        );
        pad.position.y = 0.05;
        pot.add(pad);
        const plant = new THREE.Mesh(
          new THREE.ConeGeometry(0.14, 0.45, 8),
          new THREE.MeshStandardMaterial({ color: 0x43a047, emissive: 0x1b5e20, emissiveIntensity: 0.15 })
        );
        plant.position.y = 0.32;
        plant.visible = false;
        pot.add(plant);
        pot.position.set(gx, 0, gz);
        pot.userData.plant = plant;
        pot.userData.pad = pad;
        tentGroup.add(pot);
        potMeshes[key].push(pot);
      }
    };
    placePots(tentClone, 4, "clone", 2);
    placePots(tentMain, 8, "main", 4);

    // Air particles
    const air = {
      intake: [],
      out: [],
      recirc: [],
    };
    const mkAir = (color, n) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size: 0.08,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(geo, mat);
      root.add(pts);
      return { pts, pos, n, t: new Float32Array(n).map(() => Math.random()), mat };
    };
    air.intake = mkAir(0x42a5f5, 80);
    air.out = mkAir(0xff8a65, 60);
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
        sysBag.mat.opacity = Math.min(0.85, intensity * 0.9);
        const arr = sysBag.pos;
        for (let i = 0; i < sysBag.n; i++) {
          sysBag.t[i] = (sysBag.t[i] + dt * (0.15 + intensity * 0.45)) % 1;
          const p = pathFn(sysBag.t[i]);
          arr[i * 3] = p.x;
          arr[i * 3 + 1] = p.y;
          arr[i * 3 + 2] = p.z;
        }
        sysBag.pts.geometry.attributes.position.needsUpdate = true;
      };
      const intenIn = Math.max(live.splitClone || 0, live.splitMain || 0) * (live.intakeActive || 0);
      const intenOut = live.outShare || 0;
      const intenRec = live.recircShare || 0;
      run(
        air.intake,
        (t) => {
          const side = t < 0.5 ? -1 : 1;
          const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
          const x = side * (u < 0.5 ? 0 : side < 0 ? 2.6 : 2.1);
          return new THREE.Vector3(
            side < 0 ? -u * 2.6 : u * 2.1,
            0.35 + Math.sin(u * Math.PI) * 0.05,
            -1.1 + u * 1.8
          );
        },
        intenIn
      );
      run(
        air.out,
        (t) => new THREE.Vector3(Math.sin(t * 6) * 0.05, 1.8 + t * 2.0, -1.1),
        intenOut
      );
      run(
        air.recirc,
        (t) => new THREE.Vector3(2.1 * (1 - t), 2.0 - t * 1.4, -0.2 + t * 1.2),
        intenRec
      );
    };

    let last = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const ll = live.lightLevel || 0;
      tentClone.userData.lightPlane.material.opacity = live.cloneLit ? 0.35 + ll * 0.35 : 0.05;
      tentClone.userData.lightPlane.material.color.set(0x26c6da);
      tentMain.userData.lightPlane.material.opacity = live.mainLit ? 0.25 + 0.45 : live.matOn ? 0.2 : 0.04;
      tentMain.userData.lightPlane.material.color.set(live.mainLit ? 0xff80ab : 0xff8a65);

      fanIntake.userData.speed = (live.fanIntake || 0) * 10;
      fanExhaust.userData.speed = (live.fanExhaust || 0) * 12;
      for (const f of [fanIntake, fanExhaust]) {
        for (const b of f.userData.blades) b.rotation.y += f.userData.speed * dt;
      }

      for (const [name, g] of Object.entries(appliances)) {
        const on = !!(live.devices || []).find((d) => d.id === name && d.on);
        g.userData.body.material.emissiveIntensity = on ? 0.55 : 0.0;
      }

      // pots
      const assign = live.potSlots || { clone: [], main: [] };
      for (const key of ["clone", "main"]) {
        potMeshes[key].forEach((m, i) => {
          const filled = assign[key] && assign[key][i];
          m.userData.plant.visible = !!filled;
          m.userData.pad.material.opacity = filled ? 0.85 : 0.25;
          if (filled && filled.color) m.userData.plant.material.color.set(filled.color);
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
      this._hist = { moisture: {}, rate: {}, light: {} };
      this._histAt = 0;
      this._lightSamples = {};
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
                  <span><i class="dash-dot" style="background:#66bb6a"></i> Active lights</span>
                  <span><i class="dash-dot" style="background:#42a5f5"></i> Intake air</span>
                  <span><i class="dash-dot" style="background:#ff8a65"></i> Exhaust air</span>
                  <span><i class="dash-dot" style="background:#ab47bc"></i> Recirc</span>
                </div>
              </div>
              <div class="dash-charts">
                <div class="dash-chart"><h4>Moisture — active pots</h4><canvas id="c-moist"></canvas></div>
                <div class="dash-chart"><h4>Feed intake rate — active pots</h4><canvas id="c-rate"></canvas></div>
                <div class="dash-chart"><h4>Light clock — since on / to off</h4><canvas id="c-light"></canvas></div>
              </div>
            </div>
            <div class="dash-rail">
              <div class="dash-panel">
                <h3>Crop scheduler &amp; cycle timeline</h3>
                <div id="d-timeline"></div>
              </div>
              <div class="dash-panel" style="flex:1">
                <h3>Device → intake split → exhaust</h3>
                <div id="d-flow"></div>
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
      this._hist.moisture = moist;
      this._hist.rate = rate;
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
      const cfmOut = Math.max(0, numState(hass, e.cfm_out, 0));
      const cfmRec = Math.max(0, numState(hass, e.cfm_recirc, 0));
      const exSum = cfmOut + cfmRec;
      let outShare = 0;
      let recircShare = 0;
      if (exSum > FLOW_EPS) {
        outShare = cfmOut / exSum;
        recircShare = cfmRec / exSum;
      } else {
        const fo = numState(hass, e.fan_out, 0) / 100;
        const fr = numState(hass, e.fan_recirc, 0) / 100;
        const fs = fo + fr;
        if (fs > 0.02) {
          outShare = fo / fs;
          recircShare = fr / fs;
        }
      }

      const devices = [
        { id: "heater", label: "Heater", on: isOn(hass, e.heater), color: "#ff7043" },
        { id: "ac", label: "AC", on: isOn(hass, e.ac), color: "#4fc3f7" },
        { id: "humidifier", label: "Hum", on: isOn(hass, e.humidifier), color: "#29b6f6" },
        { id: "dehumidifier", label: "Dehum", on: isOn(hass, e.dehumidifier), color: "#80cbc4" },
        { id: "clone_humidifier", label: "C-Hum", on: isOn(hass, e.clone_humidifier), color: "#81d4fa" },
      ];
      if (fanMain > 0.02) devices.push({ id: "fan_main", label: "In 4x8", on: true, color: "#ffb74d" });
      if (fanClone > 0.02) devices.push({ id: "fan_clone", label: "In 2x4", on: true, color: "#26c6da" });

      const pots = activePots(cfg, hass);
      const potSlots = { clone: Array(4).fill(null), main: Array(8).fill(null) };
      pots.forEach((p, idx) => {
        const tent = p.tent === "main" ? "main" : "clone";
        const max = tent === "main" ? 8 : 4;
        let slot = Number.isFinite(+p.slot) ? +p.slot : idx;
        if (slot < 0 || slot >= max) slot = 0;
        potSlots[tent][slot] = { id: p.id, color: POT_COLORS[idx % POT_COLORS.length] };
      });

      // Timeline from pots
      const stages = STAGE_ORDER.map((name, i) => ({
        label: name.replace("Late (Push) Vegetative", "Late Veg").replace("Final 48-72h Flowering", "Finish"),
        cls: "",
        idx: i,
      }));
      let curIdx = -1;
      let mixed = false;
      const seen = new Set();
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
          seen.add(idx);
          if (Number.isFinite(days)) stages[idx].label = `W${Math.max(1, Math.ceil(days / 7))}: ${stages[idx].label}`;
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

      return {
        devices,
        splitMain,
        splitClone,
        outShare,
        recircShare,
        intakeActive: Math.max(fanMain, fanClone, intakeSum > FLOW_EPS ? 1 : 0),
        fanIntake: Math.max(fanMain, fanClone),
        fanExhaust: Math.max(numState(hass, e.fan_out, 0), numState(hass, e.fan_recirc, 0)) / 100,
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

      const hudC = this.shadowRoot.getElementById("d-hud-clone");
      if (hudC) {
        hudC.innerHTML = `<div class="k">2×4 Reservoir</div><div class="v">${esc(live.cloneClimate)}</div><div class="s">${live.cloneLit ? "Light active" : "Lights idle"}</div>`;
      }
      const hudM = this.shadowRoot.getElementById("d-hud-main");
      if (hudM) {
        hudM.innerHTML = `<div class="k">4×8 Main</div><div class="v">${esc(live.mainClimate)}</div><div class="s">${live.matOn ? "Mat demand on" : "Mat idle"}</div>`;
      }

      const tl = this.shadowRoot.getElementById("d-timeline");
      if (tl) tl.innerHTML = renderTimeline(live);
      const flow = this.shadowRoot.getElementById("d-flow");
      if (flow) flow.innerHTML = renderFlow(live);

      if (this._scene) this._scene.setLive(live);

      // Light clock samples (session ring)
      const now = Date.now();
      for (const p of live.pots) {
        const mins = lightClockMinutes(this._hass, this._cfg.entities, p.tent === "main" ? "main" : "clone");
        if (!this._lightSamples[p.id]) this._lightSamples[p.id] = [];
        const arr = this._lightSamples[p.id];
        arr.push({ t: now, v: mins });
        const cut = now - 24 * 3600 * 1000;
        while (arr.length && arr[0].t < cut) arr.shift();
        if (arr.length > 600) arr.splice(0, arr.length - 600);
      }

      if (Date.now() - this._histAt > 60000) {
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
      const lightSeries = pots.map((p, i) => ({
        color: POT_COLORS[i % POT_COLORS.length],
        points: this._lightSamples[p.id] || [],
      }));
      drawMultiLineChart(this.shadowRoot.getElementById("c-moist"), moistSeries, { min: 0, max: 100 });
      drawMultiLineChart(this.shadowRoot.getElementById("c-rate"), rateSeries);
      drawMultiLineChart(this.shadowRoot.getElementById("c-light"), lightSeries);
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
    }
    setConfig(c) {
      this._cfg = normalizeConfig(c);
      this._render();
    }
    _fire() {
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._cfg }, bubbles: true, composed: true }));
    }
    _render() {
      const c = this._cfg;
      this.innerHTML = `
        <div style="padding:12px;display:grid;gap:10px;font-family:system-ui,sans-serif">
          <p style="margin:0;color:#888;font-size:13px">The Dash is a read-only presentation surface. Configure pots &amp; titles here only.</p>
          <label>Title <input id="t" style="width:100%" value="${esc(c.title)}"/></label>
          <label>Subtitle <input id="s" style="width:100%" value="${esc(c.subtitle)}"/></label>
          <div style="font-size:12px;color:#aaa">Pots (JSON) — tent: clone|main, slot 0–3 (2x4) or 0–7 (4x8)</div>
          <textarea id="p" rows="10" style="width:100%;font-family:ui-monospace,monospace;font-size:12px">${esc(JSON.stringify(c.pots, null, 2))}</textarea>
          <button type="button" id="apply">Apply pot config</button>
        </div>`;
      this.querySelector("#t").onchange = (e) => {
        this._cfg = { ...this._cfg, title: e.target.value };
        this._fire();
      };
      this.querySelector("#s").onchange = (e) => {
        this._cfg = { ...this._cfg, subtitle: e.target.value };
        this._fire();
      };
      this.querySelector("#apply").onclick = () => {
        try {
          const pots = JSON.parse(this.querySelector("#p").value);
          this._cfg = { ...this._cfg, pots };
          this._fire();
        } catch (err) {
          alert("Invalid pots JSON: " + err.message);
        }
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
