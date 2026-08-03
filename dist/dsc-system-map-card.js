/**
 * DSC-HUB neon isometric system map — Lovelace custom card.
 *
 * HACS Dashboard (preferred): install custom repo weddas/DSC-HUB → resource
 *   /hacsfiles/DSC-HUB/DSC-HUB.js  (SVG beside it in the same folder)
 * Manual /local fallback:
 *   /local/dsc-system-map-card.js + /local/dsc-system-map.svg
 *
 * type: custom:dsc-system-map-card
 */
(() => {
  const CARD_TYPE = "dsc-system-map-card";

  /** Resolve SVG next to the loaded card script (HACS or /local). */
  const resolveSvgUrl = () => {
    const candidates = [];
    try {
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      const me = scripts.find((s) =>
        /(?:DSC-HUB|dsc-system-map-card)\.js(?:\?|$)/i.test(s.src || "")
      );
      if (me && me.src) {
        const base = me.src.replace(/\/[^/?#]+(?:\?.*)?$/, "");
        candidates.push(`${base}/dsc-system-map.svg`);
      }
    } catch (_) {
      /* ignore */
    }
    candidates.push(
      "/hacsfiles/DSC-HUB/dsc-system-map.svg",
      "/local/community/DSC-HUB/dsc-system-map.svg",
      "/local/dsc-system-map.svg"
    );
    return candidates;
  };

  const DEFAULTS = {
    fan_out: "sensor.dsc_fan_exhaust_outside_pct",
    fan_recirc: "sensor.dsc_fan_exhaust_room_pct",
    fan_intake_main: "sensor.dsc_fan_intake_main_pct",
    fan_intake_2x4: "sensor.dsc_fan_intake_2x4_pct",
    light: "light.dsc_hub_sf1000_dimmer",
    heater: "switch.dsc_hub_heater_demand",
    humidifier: "switch.dsc_hub_humidifier_demand",
    dehumidifier: "switch.dsc_hub_dehumidifier_demand",
    grow_mat: "switch.dsc_hub_grow_mat_demand",
    heater_relay: "switch.dsc_heater_main_relay",
    humidifier_relay: "switch.dsc_humidifier_main_relay",
    dehumidifier_relay: "switch.dsc_de_humidifier_main_relay",
    grow_mat_relay: "switch.dsc_heatmat_main_relay",
    priority: "select.dsc_hub_priority_tent",
    emergency: "binary_sensor.dsc_hub_emergency_failsafe",
    hub_uptime: "sensor.dsc_hub_uptime",
    tent_temp: "sensor.dsc_hub_tent_temperature",
    tent_humidity: "sensor.dsc_hub_tent_humidity",
    clone_temp: "sensor.dsc_hub_clone_temperature",
    clone_humidity: "sensor.dsc_hub_clone_humidity",
    room_temp: "sensor.dsc_hub_room_temperature",
    room_humidity: "sensor.dsc_hub_room_humidity",
  };

  const stateOf = (hass, id) => (hass && id && hass.states[id]) || null;

  const numState = (hass, id, fallback = 0) => {
    const s = stateOf(hass, id);
    if (!s || s.state === "unavailable" || s.state === "unknown") return fallback;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : fallback;
  };

  const isOn = (hass, id) => {
    const s = stateOf(hass, id);
    return !!(s && s.state === "on");
  };

  const isUnavailable = (hass, id) => {
    const s = stateOf(hass, id);
    return !s || s.state === "unavailable" || s.state === "unknown";
  };

  const pct01 = (hass, id) => Math.max(0, Math.min(1, numState(hass, id, 0) / 100));

  const fmtClimate = (hass, tempId, humId) => {
    if (isUnavailable(hass, tempId) && isUnavailable(hass, humId)) return "--";
    const t = numState(hass, tempId, NaN);
    const h = numState(hass, humId, NaN);
    const ts = Number.isFinite(t) ? `${t.toFixed(1)}C` : "--";
    const hs = Number.isFinite(h) ? `${Math.round(h)}%` : "--";
    return `${ts}  ${hs}`;
  };

  const lightLevel = (hass, id) => {
    const s = stateOf(hass, id);
    if (!s || s.state === "unavailable" || s.state === "unknown") return 0;
    if (s.state === "off") return 0;
    const bri = s.attributes && s.attributes.brightness;
    if (typeof bri === "number") return Math.max(0, Math.min(1, bri / 255));
    return s.state === "on" ? 1 : 0;
  };

  const demandOn = (hass, demandId, relayId) =>
    isOn(hass, demandId) || isOn(hass, relayId);

  class DscSystemMapCard extends HTMLElement {
    constructor() {
      super();
      this._config = {};
      this._entities = { ...DEFAULTS };
      this._hass = null;
      this._svgReady = false;
      this._root = null;
      this._svg = null;
    }

    static getStubConfig() {
      return { title: "SYSTEM MAP" };
    }

    setConfig(config) {
      this._config = config || {};
      this._entities = { ...DEFAULTS, ...(config.entities || {}) };
      if (!this._root) this._build();
      this._loadSvg();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._svgReady) this._applyState();
    }

    getCardSize() {
      return this._config.rows || 8;
    }

    getGridOptions() {
      return {
        columns: this._config.grid_options?.columns ?? 12,
        rows: this._config.grid_options?.rows ?? 8,
      };
    }

    _build() {
      this._root = document.createElement("ha-card");
      this._root.style.overflow = "hidden";
      this._root.style.background = "#0E1116";
      this._root.style.border = "1px solid #2A3140";

      if (this._config.title) {
        const header = document.createElement("div");
        header.className = "card-header";
        header.style.cssText =
          "color:#00E676;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;padding:12px 16px 0;letter-spacing:0.06em;";
        header.textContent = this._config.title;
        this._root.appendChild(header);
      }

      this._wrap = document.createElement("div");
      this._wrap.style.cssText = "padding:4px 8px 12px;width:100%;box-sizing:border-box;";
      this._wrap.innerHTML =
        '<div style="color:#8B93A7;font-family:monospace;padding:24px;text-align:center;">Loading system map...</div>';
      this._root.appendChild(this._wrap);
      this.appendChild(this._root);
    }

    async _loadSvg() {
      if (!this._wrap) return;
      const urls = resolveSvgUrl();
      let lastErr = null;
      for (const url of urls) {
        try {
          const res = await fetch(`${url}?v=${Date.now()}`, { cache: "no-cache" });
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
          const text = await res.text();
          const doc = new DOMParser().parseFromString(text, "image/svg+xml");
          const svg = doc.documentElement;
          if (!svg || svg.nodeName.toLowerCase() !== "svg") {
            throw new Error("Invalid SVG");
          }

          svg.removeAttribute("data-demo");
          svg.setAttribute("data-live", "true");
          svg.style.width = "100%";
          svg.style.height = "auto";
          svg.style.display = "block";
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

          this._wrap.innerHTML = "";
          this._wrap.appendChild(document.importNode(svg, true));
          this._svg = this._wrap.querySelector("svg");
          this._svgReady = true;
          if (this._hass) this._applyState();
          return;
        } catch (err) {
          lastErr = err;
        }
      }
      this._wrap.innerHTML = `<div style="color:#F44336;font-family:monospace;padding:24px;text-align:center;">
          System map SVG failed to load.<br/>
          Install via HACS (Dashboard custom repo) or place
          <code>dsc-system-map.svg</code> beside the card JS.<br/>
          <span style="color:#8B93A7;font-size:12px;">${String(
            (lastErr && lastErr.message) || lastErr || "unknown error"
          )}</span>
        </div>`;
      this._svgReady = false;
    }

    _setFan(id, fraction) {
      const el = this._svg.querySelector(`#${id}`);
      if (!el) return;
      const pct = Math.round(fraction * 100);
      el.setAttribute("data-pct", String(pct > 0 ? pct : 0));
    }

    _setOn(selector, on) {
      const el = this._svg.querySelector(selector);
      if (el) el.setAttribute("data-on", on ? "true" : "false");
    }

    _setText(id, text) {
      const el = this._svg.querySelector(`#${id}`);
      if (el) el.textContent = text;
    }

    _applyPriority(priorityState) {
      const tent2x4 = this._svg.querySelectorAll("#tent-2x4 .tent-wire");
      const tent4x8 = this._svg.querySelectorAll("#tent-4x8 .tent-wire");
      const isClone =
        typeof priorityState === "string" &&
        /2\s*[xX]\s*4|clone/i.test(priorityState);
      const isMain =
        typeof priorityState === "string" &&
        /4\s*[xX]\s*8|main/i.test(priorityState);

      tent2x4.forEach((n) => n.classList.toggle("priority", !!isClone));
      tent4x8.forEach((n) => n.classList.toggle("priority", !!isMain || (!isClone && !isMain)));
    }

    _applyState() {
      if (!this._svg || !this._hass) return;
      const e = this._entities;
      const hass = this._hass;

      const fanOut = pct01(hass, e.fan_out);
      const fanRecirc = pct01(hass, e.fan_recirc);
      const fanMain = pct01(hass, e.fan_intake_main);
      const fan2x4 = pct01(hass, e.fan_intake_2x4);
      const light = lightLevel(hass, e.light);

      this._svg.style.setProperty("--fan-out", fanOut.toFixed(3));
      this._svg.style.setProperty("--fan-recirc", fanRecirc.toFixed(3));
      this._svg.style.setProperty("--fan-intake-main", fanMain.toFixed(3));
      this._svg.style.setProperty("--fan-intake-2x4", fan2x4.toFixed(3));
      this._svg.style.setProperty("--light", light.toFixed(3));

      this._setFan("fan-out", fanOut);
      this._setFan("fan-recirc", fanRecirc);
      this._setFan("fan-intake-main", fanMain);
      this._setFan("fan-intake-2x4", fan2x4);

      this._setOn("#appliance-heater", demandOn(hass, e.heater, e.heater_relay));
      this._setOn("#appliance-humidifier", demandOn(hass, e.humidifier, e.humidifier_relay));
      this._setOn("#appliance-dehumidifier", demandOn(hass, e.dehumidifier, e.dehumidifier_relay));
      this._setOn("#mat", demandOn(hass, e.grow_mat, e.grow_mat_relay));

      const priority = stateOf(hass, e.priority);
      this._applyPriority(priority ? priority.state : "");

      const emergency = isOn(hass, e.emergency);
      this._svg.setAttribute("data-emergency", emergency ? "true" : "false");

      const offline = isUnavailable(hass, e.hub_uptime);
      this._svg.setAttribute("data-offline", offline ? "true" : "false");

      this._setText("label-room", fmtClimate(hass, e.room_temp, e.room_humidity));
      this._setText("label-clone", fmtClimate(hass, e.clone_temp, e.clone_humidity));
      this._setText("label-tent", fmtClimate(hass, e.tent_temp, e.tent_humidity));
    }
  }

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, DscSystemMapCard);
  }

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC System Map",
    description: "Neon isometric DSC-HUB map — tents, fans, light, pots, appliances (live).",
    preview: true,
  });
})();

/**
 * DSC-HUB airflow status map — Lovelace custom card.
 *
 * Hybrid topology: Room / Outside / 2x4 / 4x8 with real directed ducts,
 * %/CFM blend exits, source-zone T/RH carry, room appliances, volume mass.
 *
 * HACS: /hacsfiles/DSC-HUB/DSC-HUB.js (bundled with system map)
 * Manual: /local/dsc-airflow-map-card.js
 *
 * type: custom:dsc-airflow-map-card
 */
(() => {
  const CARD_TYPE = "dsc-airflow-map-card";
  const CFM_TO_M3H = 1.699;
  const AIR_KG_M3 = 1.2;
  const FLOW_EPS = 0.5; // CFM near-zero threshold

  const DEFAULTS = {
    cfm_out: "sensor.dsc_cfm_exhaust_out",
    cfm_recirc: "sensor.dsc_cfm_exhaust_recirc",
    cfm_intake_main: "sensor.dsc_cfm_intake_main",
    cfm_intake_2x4: "sensor.dsc_cfm_intake_2x4",
    fan_out: "sensor.dsc_fan_exhaust_outside_pct",
    fan_recirc: "sensor.dsc_fan_exhaust_room_pct",
    fan_intake_main: "sensor.dsc_fan_intake_main_pct",
    fan_intake_2x4: "sensor.dsc_fan_intake_2x4_pct",
    cfm_out_max: "input_number.dsc_cfm_out_max",
    cfm_recirc_max: "input_number.dsc_cfm_recirc_max",
    cfm_intake_main_max: "input_number.dsc_cfm_intake_main_max",
    cfm_intake_2x4_max: "input_number.dsc_cfm_intake_clone_max",
    room_temp: "sensor.dsc_hub_room_temperature",
    room_humidity: "sensor.dsc_hub_room_humidity",
    clone_temp: "sensor.dsc_hub_clone_temperature",
    clone_humidity: "sensor.dsc_hub_clone_humidity",
    tent_temp: "sensor.dsc_hub_tent_temperature",
    tent_humidity: "sensor.dsc_hub_tent_humidity",
    ah_room: "sensor.dsc_ah_room",
    ah_clone: "sensor.dsc_ah_clone",
    ah_tent: "sensor.dsc_ah_tent",
    vol_room: "input_number.dsc_vol_room_m3",
    vol_2x4: "input_number.dsc_vol_2x4_m3",
    vol_4x8: "input_number.dsc_vol_4x8_m3",
    ach_2x4: "sensor.dsc_ach_2x4",
    ach_4x8: "sensor.dsc_ach_4x8",
    vent_heat_dump: "sensor.dsc_vent_heat_dump_btu",
    vent_moisture: "sensor.dsc_vent_moisture_removal",
    heater: "switch.dsc_hub_heater_demand",
    heater_relay: "switch.dsc_heater_main_relay",
    ac: "switch.dsc_hub_ac_demand",
    humidifier: "switch.dsc_hub_humidifier_demand",
    humidifier_relay: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_hub_dehumidifier_demand",
    dehumidifier_relay: "switch.dsc_de_humidifier_main_relay",
    grow_mat: "switch.dsc_hub_grow_mat_demand",
    grow_mat_relay: "switch.dsc_heatmat_main_relay",
    light: "light.dsc_hub_sf1000_dimmer",
    humidifier_routing: "switch.dsc_hub_humidifier_intake_routing",
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
    return !!(s && s.state === "on");
  };

  const demandOn = (hass, demandId, relayId) =>
    isOn(hass, demandId) || (relayId ? isOn(hass, relayId) : false);

  const lightLevel = (hass, id) => {
    const s = stateOf(hass, id);
    if (!s || s.state === "unavailable" || s.state === "unknown") return 0;
    if (s.state === "off") return 0;
    const bri = s.attributes && s.attributes.brightness;
    if (typeof bri === "number") return Math.max(0, Math.min(1, bri / 255));
    return s.state === "on" ? 1 : 0;
  };

  const fmtTemp = (t) => (Number.isFinite(t) ? `${t.toFixed(1)}°C` : "--");
  const fmtRh = (h) => (Number.isFinite(h) ? `${Math.round(h)}%` : "--");
  const fmtCfm = (c) => (Number.isFinite(c) ? `${Math.round(c)} CFM` : "--");
  const fmtPct = (p) => (Number.isFinite(p) ? `${Math.round(p)}%` : "--");

  const climatePair = (t, h) => `${fmtTemp(t)} ${fmtRh(h)}`;

  const airMassKg = (vol) =>
    Number.isFinite(vol) && vol > 0 ? vol * AIR_KG_M3 : NaN;

  const massFlowKgMin = (cfm) =>
    Number.isFinite(cfm) && cfm > 0
      ? (cfm * CFM_TO_M3H * AIR_KG_M3) / 60
      : NaN;

  const moistureDeltaGh = (cfm, ahSrc, ahDst) =>
    Number.isFinite(cfm) &&
    Number.isFinite(ahSrc) &&
    Number.isFinite(ahDst) &&
    cfm > 0
      ? cfm * CFM_TO_M3H * (ahSrc - ahDst)
      : NaN;

  const flowFrac = (cfm, max) => {
    if (!Number.isFinite(cfm) || cfm <= FLOW_EPS) return 0;
    const m = Number.isFinite(max) && max > 0 ? max : 200;
    return Math.max(0, Math.min(1, cfm / m));
  };

  const SVG_MARKUP = `
<svg viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DSC airflow map">
  <defs>
    <style>
      .af-bg { fill: #0E1116; }
      .af-title { fill: #00E676; font: 600 12px ui-monospace, Menlo, Consolas, monospace; letter-spacing: 0.08em; }
      .af-node { fill: #151A22; stroke-width: 2.2; }
      .af-node-label { fill: #E8ECF4; font: 600 11px ui-monospace, Menlo, Consolas, monospace; text-anchor: middle; }
      .af-node-sub { fill: #8B93A7; font: 10px ui-monospace, Menlo, Consolas, monospace; text-anchor: middle; }
      .af-node-meta { fill: #6B7385; font: 9px ui-monospace, Menlo, Consolas, monospace; text-anchor: middle; }
      .af-chip { fill: #1A2030; stroke: #2A3140; stroke-width: 1; rx: 3; }
      .af-chip-text { fill: #C5CDDC; font: 8.5px ui-monospace, Menlo, Consolas, monospace; text-anchor: middle; }
      .af-duct { fill: none; stroke-width: 2.4; stroke-linecap: round; opacity: 0.22; }
      .af-duct.active { opacity: 0.95; }
      .af-flow {
        fill: none; stroke-width: 2.4; stroke-linecap: round;
        stroke-dasharray: 6 10; opacity: 0;
      }
      .af-flow.active { opacity: 0.9; animation: af-dash var(--dur, 1.6s) linear infinite; }
      @keyframes af-dash { to { stroke-dashoffset: -64; } }
      .af-app { font: 8px ui-monospace, Menlo, Consolas, monospace; fill: #4A5266; }
      .af-app.on { fill: #FFB74D; }
      .af-app.on-cool { fill: #4FC3F7; }
      .af-app.on-hum { fill: #81C784; }
      .af-app.on-dehum { fill: #64B5F6; }
      .af-marker { font: 8px ui-monospace, Menlo, Consolas, monospace; fill: #4A5266; }
      .af-marker.on { fill: #FF8A65; }
      .af-narr { fill: #A8B0C2; font: 10px ui-monospace, Menlo, Consolas, monospace; }
      .af-legend { fill: #5A6275; font: 8px ui-monospace, Menlo, Consolas, monospace; }
      #duct-r2c { stroke: #26A69A; }
      #duct-r2m { stroke: #FFA726; }
      #duct-c2m { stroke: #26C6DA; }
      #duct-m2o { stroke: #42A5F5; }
      #duct-m2r { stroke: #AB47BC; }
      #flow-r2c { stroke: #26A69A; }
      #flow-r2m { stroke: #FFA726; }
      #flow-c2m { stroke: #26C6DA; }
      #flow-m2o { stroke: #42A5F5; }
      #flow-m2r { stroke: #AB47BC; }
      #node-room { stroke: #FFA726; }
      #node-out { stroke: #42A5F5; }
      #node-clone { stroke: #26A69A; }
      #node-main { stroke: #66BB6A; }
    </style>
  </defs>

  <rect class="af-bg" width="420" height="380" rx="10"/>
  <text class="af-title" x="16" y="22">AIRFLOW STATUS</text>
  <text class="af-legend" x="404" y="20" text-anchor="end">CFM · source T/RH · blend</text>

  <!-- Duct base paths (geometry only; direction via dash animation) -->
  <path id="duct-r2c" class="af-duct" d="M210 88 L210 250"/>
  <path id="duct-r2m" class="af-duct" d="M248 95 Q300 140 318 168"/>
  <path id="duct-c2m" class="af-duct" d="M248 278 Q300 240 318 210"/>
  <path id="duct-m2o" class="af-duct" d="M102 190 L318 190"/>
  <path id="duct-m2r" class="af-duct" d="M318 168 Q280 120 248 95"/>

  <path id="flow-r2c" class="af-flow" d="M210 88 L210 250"/>
  <path id="flow-r2m" class="af-flow" d="M248 95 Q300 140 318 168"/>
  <path id="flow-c2m" class="af-flow" d="M248 278 Q300 240 318 210"/>
  <path id="flow-m2o" class="af-flow" d="M318 190 L102 190"/>
  <path id="flow-m2r" class="af-flow" d="M318 168 Q280 120 248 95"/>

  <!-- Edge chips -->
  <g id="chip-r2c" transform="translate(218,165)">
    <rect class="af-chip" x="-52" y="-16" width="104" height="32"/>
    <text id="chip-r2c-a" class="af-chip-text" x="0" y="-2">—</text>
    <text id="chip-r2c-b" class="af-chip-text" x="0" y="11">—</text>
  </g>
  <g id="chip-r2m" transform="translate(292,118)">
    <rect class="af-chip" x="-52" y="-16" width="104" height="32"/>
    <text id="chip-r2m-a" class="af-chip-text" x="0" y="-2">—</text>
    <text id="chip-r2m-b" class="af-chip-text" x="0" y="11">—</text>
  </g>
  <g id="chip-c2m" transform="translate(292,250)">
    <rect class="af-chip" x="-52" y="-16" width="104" height="32"/>
    <text id="chip-c2m-a" class="af-chip-text" x="0" y="-2">—</text>
    <text id="chip-c2m-b" class="af-chip-text" x="0" y="11">—</text>
  </g>
  <g id="chip-m2o" transform="translate(160,178)">
    <rect class="af-chip" x="-52" y="-16" width="104" height="32"/>
    <text id="chip-m2o-a" class="af-chip-text" x="0" y="-2">—</text>
    <text id="chip-m2o-b" class="af-chip-text" x="0" y="11">—</text>
  </g>
  <g id="chip-m2r" transform="translate(255,130)">
    <rect class="af-chip" x="-52" y="-16" width="104" height="32"/>
    <text id="chip-m2r-a" class="af-chip-text" x="0" y="-2">—</text>
    <text id="chip-m2r-b" class="af-chip-text" x="0" y="11">—</text>
  </g>

  <!-- Room (top) -->
  <g id="node-room-g">
    <circle id="node-room" class="af-node" cx="210" cy="62" r="36"/>
    <text class="af-node-label" x="210" y="50">Room</text>
    <text id="room-climate" class="af-node-sub" x="210" y="64">--</text>
    <text id="room-mass" class="af-node-meta" x="210" y="76">--</text>
    <text id="app-heater" class="af-app" x="158" y="28">HEAT</text>
    <text id="app-ac" class="af-app" x="188" y="28">AC</text>
    <text id="app-hum" class="af-app" x="210" y="28">HUM</text>
    <text id="app-dehum" class="af-app" x="240" y="28">DEHUM</text>
    <text id="app-route" class="af-marker" x="210" y="96" text-anchor="middle"></text>
  </g>

  <!-- Outside (left) -->
  <g id="node-out-g">
    <circle id="node-out" class="af-node" cx="62" cy="190" r="36"/>
    <text class="af-node-label" x="62" y="178">Outside</text>
    <text id="out-climate" class="af-node-sub" x="62" y="192">dump</text>
    <text id="out-meta" class="af-node-meta" x="62" y="204">--</text>
  </g>

  <!-- 4x8 Main (right) -->
  <g id="node-main-g">
    <circle id="node-main" class="af-node" cx="358" cy="190" r="40"/>
    <text class="af-node-label" x="358" y="174">4x8 Main</text>
    <text id="main-climate" class="af-node-sub" x="358" y="188">--</text>
    <text id="main-mass" class="af-node-meta" x="358" y="200">--</text>
    <text id="main-marker" class="af-marker" x="358" y="212" text-anchor="middle"></text>
  </g>

  <!-- 2x4 Reservoir (bottom) -->
  <g id="node-clone-g">
    <circle id="node-clone" class="af-node" cx="210" cy="310" r="40"/>
    <text class="af-node-label" x="210" y="294">2x4 Reservoir</text>
    <text id="clone-climate" class="af-node-sub" x="210" y="308">--</text>
    <text id="clone-mass" class="af-node-meta" x="210" y="320">--</text>
    <text id="clone-marker" class="af-marker" x="210" y="332" text-anchor="middle"></text>
  </g>

  <text id="narrative" class="af-narr" x="16" y="364">—</text>
</svg>`;

  class DscAirflowMapCard extends HTMLElement {
    constructor() {
      super();
      this._config = {};
      this._entities = { ...DEFAULTS };
      this._hass = null;
      this._root = null;
      this._svg = null;
    }

    static getStubConfig() {
      return { title: "AIRFLOW STATUS" };
    }

    setConfig(config) {
      this._config = config || {};
      this._entities = { ...DEFAULTS, ...(config.entities || {}) };
      if (!this._root) this._build();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._svg) this._applyState();
    }

    getCardSize() {
      return this._config.rows || 6;
    }

    getGridOptions() {
      return {
        columns: this._config.grid_options?.columns ?? 12,
        rows: this._config.grid_options?.rows ?? 6,
      };
    }

    _build() {
      this._root = document.createElement("ha-card");
      this._root.style.overflow = "hidden";
      this._root.style.background = "#0E1116";
      this._root.style.border = "1px solid #2A3140";

      const wrap = document.createElement("div");
      wrap.style.cssText =
        "padding:4px 6px 8px;width:100%;box-sizing:border-box;";
      wrap.innerHTML = SVG_MARKUP;
      this._root.appendChild(wrap);
      this.appendChild(this._root);
      this._svg = wrap.querySelector("svg");
      if (this._hass) this._applyState();
    }

    _el(id) {
      return this._svg ? this._svg.querySelector(`#${id}`) : null;
    }

    _setText(id, text) {
      const el = this._el(id);
      if (el) el.textContent = text == null ? "" : String(text);
    }

    _setApp(id, on, onClass) {
      const el = this._el(id);
      if (!el) return;
      el.classList.remove("on", "on-cool", "on-hum", "on-dehum");
      if (on) el.classList.add(onClass || "on");
    }

    _setDuct(key, frac) {
      const duct = this._el(`duct-${key}`);
      const flow = this._el(`flow-${key}`);
      const active = frac > 0.02;
      if (duct) duct.classList.toggle("active", active);
      if (flow) {
        flow.classList.toggle("active", active);
        if (active) {
          // Faster dash when flow fraction higher (0.55s … 2.4s)
          const dur = (2.4 - frac * 1.85).toFixed(2);
          flow.style.setProperty("--dur", `${dur}s`);
        }
      }
      const chip = this._el(`chip-${key}`);
      if (chip) chip.style.opacity = active ? "1" : "0.35";
    }

    _edgeChip(key, lineA, lineB) {
      this._setText(`chip-${key}-a`, lineA || "—");
      this._setText(`chip-${key}-b`, lineB || "");
    }

    _buildNarrative(apps, intakes, exitMode, outPct, recPct) {
      const parts = [];
      if (apps.length) parts.push(apps.join("+"));
      parts.push("Room");
      if (intakes.length) parts.push(intakes.join("+"));
      else parts.push("(no intake)");
      if (intakes.includes("2x4") && !intakes.includes("Main")) {
        parts.push("4x8");
      } else if (intakes.length) {
        parts.push("4x8");
      }
      if (exitMode === "stalled") {
        parts.push("stalled");
        return parts.join(" → ");
      }
      if (exitMode === "blend") {
        parts.push(
          `Outside+Recirc (blend · Recirc ${Math.round(recPct)}% / Out ${Math.round(outPct)}%)`
        );
      } else if (exitMode === "closed") {
        parts.push("Recirc → Room (closed)");
      } else if (exitMode === "open") {
        parts.push("Outside (open)");
      }
      return parts.join(" → ");
    }

    _applyState() {
      if (!this._svg || !this._hass) return;
      const e = this._entities;
      const hass = this._hass;

      const cfmOut = numState(hass, e.cfm_out, 0);
      const cfmRec = numState(hass, e.cfm_recirc, 0);
      const cfmMain = numState(hass, e.cfm_intake_main, 0);
      const cfm2x4 = numState(hass, e.cfm_intake_2x4, 0);

      const pctOut = numState(hass, e.fan_out, 0);
      const pctRec = numState(hass, e.fan_recirc, 0);
      const pctMain = numState(hass, e.fan_intake_main, 0);
      const pct2x4 = numState(hass, e.fan_intake_2x4, 0);

      const maxOut = numState(hass, e.cfm_out_max, 440);
      const maxRec = numState(hass, e.cfm_recirc_max, 440);
      const maxMain = numState(hass, e.cfm_intake_main_max, 200);
      const max2x4 = numState(hass, e.cfm_intake_2x4_max, 200);

      const roomT = numState(hass, e.room_temp);
      const roomH = numState(hass, e.room_humidity);
      const cloneT = numState(hass, e.clone_temp);
      const cloneH = numState(hass, e.clone_humidity);
      const tentT = numState(hass, e.tent_temp);
      const tentH = numState(hass, e.tent_humidity);

      const ahRoom = numState(hass, e.ah_room);
      const ahClone = numState(hass, e.ah_clone);
      const ahTent = numState(hass, e.ah_tent);

      const volRoom = numState(hass, e.vol_room);
      const vol2x4 = numState(hass, e.vol_2x4);
      const vol4x8 = numState(hass, e.vol_4x8);
      const ach2x4 = numState(hass, e.ach_2x4);
      const ach4x8 = numState(hass, e.ach_4x8);

      const heatDump = numState(hass, e.vent_heat_dump);
      const moistDump = numState(hass, e.vent_moisture);

      const heater = demandOn(hass, e.heater, e.heater_relay);
      const ac = isOn(hass, e.ac);
      const hum = demandOn(hass, e.humidifier, e.humidifier_relay);
      const dehum = demandOn(hass, e.dehumidifier, e.dehumidifier_relay);
      const mat = demandOn(hass, e.grow_mat, e.grow_mat_relay);
      const light = lightLevel(hass, e.light);
      const humRoute = isOn(hass, e.humidifier_routing);

      // Nodes
      this._setText("room-climate", climatePair(roomT, roomH));
      this._setText("clone-climate", climatePair(cloneT, cloneH));
      this._setText("main-climate", climatePair(tentT, tentH));

      const mRoom = airMassKg(volRoom);
      const m2 = airMassKg(vol2x4);
      const m8 = airMassKg(vol4x8);
      this._setText(
        "room-mass",
        Number.isFinite(mRoom) ? `~${mRoom.toFixed(0)} kg air` : ""
      );
      const cloneMeta = [];
      if (Number.isFinite(m2)) cloneMeta.push(`~${m2.toFixed(1)} kg`);
      if (Number.isFinite(ach2x4) && ach2x4 > 0)
        cloneMeta.push(`${ach2x4.toFixed(1)} ACH`);
      this._setText("clone-mass", cloneMeta.join(" · "));
      const mainMeta = [];
      if (Number.isFinite(m8)) mainMeta.push(`~${m8.toFixed(1)} kg`);
      if (Number.isFinite(ach4x8) && ach4x8 > 0)
        mainMeta.push(`${ach4x8.toFixed(1)} ACH`);
      this._setText("main-mass", mainMeta.join(" · "));

      const outActive = cfmOut > FLOW_EPS;
      this._setText(
        "out-climate",
        outActive ? climatePair(tentT, tentH) : "no dump"
      );
      const outMeta = [];
      if (outActive && Number.isFinite(heatDump))
        outMeta.push(`${Math.round(heatDump)} BTU/h`);
      if (outActive && Number.isFinite(moistDump))
        outMeta.push(`${Math.round(moistDump)} g/h`);
      this._setText("out-meta", outMeta.join(" · ") || (outActive ? "leaving" : ""));

      // Appliances
      this._setApp("app-heater", heater, "on");
      this._setApp("app-ac", ac, "on-cool");
      this._setApp("app-hum", hum, "on-hum");
      this._setApp("app-dehum", dehum, "on-dehum");
      this._setText(
        "app-route",
        humRoute && hum ? "hum→intake route" : ""
      );
      this._setText("clone-marker", mat ? "MAT ON" : "");
      const mainMark = this._el("main-marker");
      if (mainMark) {
        mainMark.textContent =
          light > 0.02 ? `LIGHT ${Math.round(light * 100)}%` : "";
        mainMark.classList.toggle("on", light > 0.02);
      }
      const cloneMark = this._el("clone-marker");
      if (cloneMark) cloneMark.classList.toggle("on", mat);

      // Ducts + chips
      const fR2c = flowFrac(cfm2x4, max2x4);
      const fR2m = flowFrac(cfmMain, maxMain);
      const fC2m = fR2c; // cascade follows 2x4 intake
      const fM2o = flowFrac(cfmOut, maxOut);
      const fM2r = flowFrac(cfmRec, maxRec);

      this._setDuct("r2c", fR2c);
      this._setDuct("r2m", fR2m);
      this._setDuct("c2m", fC2m);
      this._setDuct("m2o", fM2o);
      this._setDuct("m2r", fM2r);

      const mf2 = massFlowKgMin(cfm2x4);
      const dAhR2c = moistureDeltaGh(cfm2x4, ahRoom, ahClone);
      const dAhR2m = moistureDeltaGh(cfmMain, ahRoom, ahTent);
      const dAhC2m = moistureDeltaGh(cfm2x4, ahClone, ahTent);
      const dAhRec = moistureDeltaGh(cfmRec, ahTent, ahRoom);

      this._edgeChip(
        "r2c",
        fR2c
          ? `${fmtCfm(cfm2x4)} · ${fmtPct(pct2x4)}`
          : "Room→2x4 idle",
        fR2c
          ? `${climatePair(roomT, roomH)}${
              Number.isFinite(dAhR2c) ? ` · ${dAhR2c >= 0 ? "+" : ""}${Math.round(dAhR2c)} g/h` : ""
            }${Number.isFinite(mf2) ? ` · ${mf2.toFixed(1)} kg/min` : ""}`
          : ""
      );
      this._edgeChip(
        "r2m",
        fR2m
          ? `${fmtCfm(cfmMain)} · ${fmtPct(pctMain)}`
          : "Room→4x8 idle",
        fR2m
          ? `${climatePair(roomT, roomH)}${
              Number.isFinite(dAhR2m) ? ` · ${dAhR2m >= 0 ? "+" : ""}${Math.round(dAhR2m)} g/h` : ""
            }`
          : ""
      );
      this._edgeChip(
        "c2m",
        fC2m
          ? `${fmtCfm(cfm2x4)} cascade`
          : "2x4→4x8 idle",
        fC2m
          ? `${climatePair(cloneT, cloneH)}${
              Number.isFinite(dAhC2m) ? ` · ${dAhC2m >= 0 ? "+" : ""}${Math.round(dAhC2m)} g/h` : ""
            }`
          : ""
      );

      const outLines = [];
      if (fM2o) {
        outLines.push(`${fmtCfm(cfmOut)} · ${fmtPct(pctOut)}`);
        const bits = [climatePair(tentT, tentH)];
        if (Number.isFinite(heatDump)) bits.push(`${Math.round(heatDump)} BTU/h`);
        if (Number.isFinite(moistDump)) bits.push(`${Math.round(moistDump)} g/h`);
        this._edgeChip("m2o", outLines[0], bits.join(" · "));
      } else {
        this._edgeChip("m2o", "OUT idle", "open dump off");
      }

      const exhaustSum = Math.max(0, cfmOut) + Math.max(0, cfmRec);
      const recircShare = exhaustSum > FLOW_EPS ? cfmRec / exhaustSum : 0;

      if (fM2r) {
        const dT =
          Number.isFinite(tentT) && Number.isFinite(roomT)
            ? tentT - roomT
            : NaN;
        const fb =
          Number.isFinite(dAhRec) && recircShare > 0
            ? dAhRec * recircShare
            : dAhRec;
        const bits = [climatePair(tentT, tentH)];
        if (Number.isFinite(dT))
          bits.push(`ΔT ${dT >= 0 ? "+" : ""}${dT.toFixed(1)}`);
        if (Number.isFinite(fb))
          bits.push(`fb ${fb >= 0 ? "+" : ""}${Math.round(fb)} g/h`);
        this._edgeChip(
          "m2r",
          `${fmtCfm(cfmRec)} · ${fmtPct(pctRec)}`,
          bits.join(" · ")
        );
      } else {
        this._edgeChip("m2r", "RECIRC idle", "no lung feedback");
      }

      // Narrative
      const apps = [];
      if (heater) apps.push("Heater");
      if (ac) apps.push("AC");
      if (hum) apps.push("Hum");
      if (dehum) apps.push("Dehum");

      const intakes = [];
      if (cfmMain > FLOW_EPS) intakes.push("Main");
      if (cfm2x4 > FLOW_EPS) intakes.push("2x4");

      let exitMode = "stalled";
      const outOn = cfmOut > FLOW_EPS;
      const recOn = cfmRec > FLOW_EPS;
      if (outOn && recOn) exitMode = "blend";
      else if (recOn) exitMode = "closed";
      else if (outOn) exitMode = "open";

      this._setText(
        "narrative",
        this._buildNarrative(apps, intakes, exitMode, pctOut, pctRec)
      );
    }
  }

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, DscAirflowMapCard);
  }

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC Airflow Status Map",
    description:
      "Hybrid airflow map — real ducts, % blend OUT/RECIRC, source T/RH carry, room appliances.",
    preview: true,
  });
})();
