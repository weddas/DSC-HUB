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
