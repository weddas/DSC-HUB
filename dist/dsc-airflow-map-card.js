/**
 * DSC-HUB airflow status — GUI-first isometric tent scene.
 *
 * type: custom:dsc-airflow-map-card
 * Editor: custom:dsc-airflow-map-card-editor (getConfigElement)
 */
(() => {
  const CARD_TYPE = "dsc-airflow-map-card";
  const EDITOR_TYPE = "dsc-airflow-map-card-editor";
  const CFM_TO_M3H = 1.699;
  const AIR_KG_M3 = 1.2;
  const FLOW_EPS = 0.5;
  const MAX_TENTS = 4;

  const SIZE_SCALE = {
    "2x2": 0.55,
    "2x4": 0.7,
    "3x3": 0.8,
    "4x4": 0.9,
    "4x8": 1.0,
    "5x5": 1.1,
  };
  const SIZE_PRESETS = Object.keys(SIZE_SCALE);

  const KIND_COLOR = {
    intake: "#26C6DA",
    cascade: "#FFB74D",
    recirc: "#AB47BC",
    out: "#42A5F5",
  };

  /* ------------------------------------------------------------------ */
  /* Config model                                                       */
  /* ------------------------------------------------------------------ */

  const DSC_DEFAULTS = () => ({
    type: `custom:${CARD_TYPE}`,
    title: "AIRFLOW STATUS",
    zones: [
      {
        id: "room",
        role: "room",
        label: "Room",
        size: "4x4",
        temp: "sensor.dsc_hub_room_temperature",
        humidity: "sensor.dsc_hub_room_humidity",
        volume: "input_number.dsc_vol_room_m3",
      },
      { id: "outside", role: "outside", label: "Outside" },
      {
        id: "clone",
        role: "tent",
        label: "2x4 Reservoir",
        size: "2x4",
        temp: "sensor.dsc_hub_clone_temperature",
        humidity: "sensor.dsc_hub_clone_humidity",
        volume: "input_number.dsc_vol_2x4_m3",
        ach: "sensor.dsc_ach_2x4",
        mat: "switch.dsc_hub_grow_mat_demand",
      },
      {
        id: "main",
        role: "tent",
        label: "4x8 Main",
        size: "4x8",
        temp: "sensor.dsc_hub_tent_temperature",
        humidity: "sensor.dsc_hub_tent_humidity",
        volume: "input_number.dsc_vol_4x8_m3",
        ach: "sensor.dsc_ach_4x8",
        light: "light.dsc_hub_sf1000_dimmer",
      },
    ],
    ducts: [
      {
        id: "r2m",
        from: "room",
        from_wall: "front",
        to: "main",
        to_wall: "back",
        kind: "intake",
        cfm: "sensor.dsc_cfm_intake_main",
        fan_pct: "sensor.dsc_fan_intake_main_pct",
        cfm_max: "input_number.dsc_cfm_intake_main_max",
        components: [{ type: "inline_fan", at: "source" }],
      },
      {
        id: "r2c",
        from: "room",
        from_wall: "front",
        to: "clone",
        to_wall: "back",
        kind: "intake",
        cfm: "sensor.dsc_cfm_intake_2x4",
        fan_pct: "sensor.dsc_fan_intake_2x4_pct",
        cfm_max: "input_number.dsc_cfm_intake_clone_max",
        components: [{ type: "inline_fan", at: "source" }],
      },
      {
        id: "c2m",
        from: "clone",
        from_wall: "right",
        to: "main",
        to_wall: "left",
        kind: "cascade",
        components: [],
      },
      {
        id: "m2r",
        from: "main",
        from_wall: "front",
        to: "room",
        to_wall: "front",
        kind: "recirc",
        cfm: "sensor.dsc_cfm_exhaust_recirc_allocated",
        fan_pct: "sensor.dsc_fan_exhaust_room_pct",
        cfm_max: "input_number.dsc_cfm_recirc_max",
        components: [{ type: "inline_fan", at: "source" }],
      },
      {
        id: "m2o",
        from: "main",
        from_wall: "top",
        to: "outside",
        to_wall: "window",
        kind: "out",
        cfm: "sensor.dsc_cfm_exhaust_out_allocated",
        fan_pct: "sensor.dsc_fan_exhaust_outside_pct",
        cfm_max: "input_number.dsc_cfm_out_max",
        components: [
          { type: "inline_fan", at: "source" },
          { type: "carbon_filter", at: "mid", label: "Carbon" },
        ],
      },
    ],
  });

  const zoneScale = (z) => {
    if (z.size === "custom" && Number.isFinite(+z.scale)) return +z.scale;
    return SIZE_SCALE[z.size] || 1;
  };

  const normalizeConfig = (raw) => {
    const d = DSC_DEFAULTS();
    if (!raw || typeof raw !== "object") return d;
    const cfg = {
      type: raw.type || d.type,
      title: raw.title || d.title,
      grid_options: raw.grid_options,
      zones: Array.isArray(raw.zones) && raw.zones.length ? raw.zones : d.zones,
      ducts: Array.isArray(raw.ducts) && raw.ducts.length ? raw.ducts : d.ducts,
    };
    // Ensure room + outside exist
    if (!cfg.zones.some((z) => z.role === "room")) {
      cfg.zones.unshift({ ...d.zones.find((z) => z.role === "room") });
    }
    if (!cfg.zones.some((z) => z.role === "outside")) {
      cfg.zones.push({ ...d.zones.find((z) => z.role === "outside") });
    }
    // Cap tents
    let tents = 0;
    cfg.zones = cfg.zones.filter((z) => {
      if (z.role !== "tent") return true;
      tents += 1;
      return tents <= MAX_TENTS;
    });
    cfg.ducts = cfg.ducts.map((duct, i) => {
      const dd = { ...duct };
      if (!dd.id) dd.id = `duct${i}`;
      if (!dd.kind) dd.kind = "intake";
      if (!dd.from_wall) dd.from_wall = "front";
      if (!dd.to_wall) dd.to_wall = "back";
      if (!Array.isArray(dd.components)) {
        dd.components =
          dd.cfm || dd.fan_pct ? [{ type: "inline_fan", at: "source" }] : [];
      }
      // Exhaust into room: kind out + to room
      if (dd.kind === "out" && dd.to === "room" && !dd.to_wall) dd.to_wall = "front";
      if (dd.kind === "out" && dd.to === "outside" && !dd.to_wall)
        dd.to_wall = "window";
      return dd;
    });
    return cfg;
  };

  /* ------------------------------------------------------------------ */
  /* Hass helpers                                                       */
  /* ------------------------------------------------------------------ */

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
  const lightLevel = (hass, id) => {
    const s = stateOf(hass, id);
    if (!s || s.state === "unavailable" || s.state === "unknown") return 0;
    if (s.state === "off") return 0;
    const bri = s.attributes && s.attributes.brightness;
    if (typeof bri === "number") return Math.max(0, Math.min(1, bri / 255));
    return s.state === "on" ? 1 : 0;
  };
  const fmtTemp = (t) => (Number.isFinite(t) ? `${t.toFixed(1)}°C` : "—");
  const fmtRh = (h) => (Number.isFinite(h) ? `${Math.round(h)}%` : "—");
  const climatePair = (t, h) => `${fmtTemp(t)} ${fmtRh(h)}`;
  const flowFrac = (cfm, max) => {
    if (!Number.isFinite(cfm) || cfm <= FLOW_EPS) return 0;
    const m = Number.isFinite(max) && max > 0 ? max : 200;
    return Math.max(0, Math.min(1, cfm / m));
  };

  /* ------------------------------------------------------------------ */
  /* Layout engine                                                      */
  /* ------------------------------------------------------------------ */

  const VB = { w: 640, h: 420 };

  const layoutScene = (cfg) => {
    const room = cfg.zones.find((z) => z.role === "room");
    const outside = cfg.zones.find((z) => z.role === "outside");
    const tents = cfg.zones.filter((z) => z.role === "tent");
    const roomS = zoneScale(room || { size: "4x4" });

    const floorW = 420 * roomS;
    const floorH = 200 * Math.min(1.15, roomS);
    const floorX = (VB.w - floorW) / 2;
    const floorY = 150;

    const placed = [];
    const n = Math.max(1, tents.length);
    const gap = 18;
    const totalScale = tents.reduce((s, t) => s + zoneScale(t), 0) || 1;
    let usable = floorW - gap * (n + 1);
    let cursor = floorX + gap;

    tents.forEach((t) => {
      const sc = zoneScale(t);
      const tw = Math.max(70, (usable * sc) / totalScale);
      const th = Math.max(90, 110 * sc);
      const tx = cursor;
      const ty = floorY + floorH - th - 20;
      const ports = portAnchors(tx, ty, tw, th);
      placed.push({
        ...t,
        x: tx,
        y: ty,
        w: tw,
        h: th,
        ports,
      });
      cursor += tw + gap;
    });

    const roomPorts = {
      front: { x: floorX + floorW / 2, y: floorY + floorH - 4 },
      back: { x: floorX + floorW / 2, y: floorY + 8 },
      left: { x: floorX + 8, y: floorY + floorH / 2 },
      right: { x: floorX + floorW - 8, y: floorY + floorH / 2 },
      top: { x: floorX + floorW / 2, y: floorY + 24 },
    };

    const outX = 36;
    const outY = 120;
    const outsideLayout = {
      ...(outside || { id: "outside", role: "outside", label: "Outside" }),
      x: outX,
      y: outY,
      w: 56,
      h: 72,
      ports: {
        window: { x: outX + 56, y: outY + 36 },
        left: { x: outX, y: outY + 36 },
        right: { x: outX + 56, y: outY + 36 },
        front: { x: outX + 28, y: outY + 72 },
        back: { x: outX + 28, y: outY },
        top: { x: outX + 28, y: outY + 8 },
      },
    };

    const byId = {};
    byId.room = {
      ...(room || { id: "room", role: "room", label: "Room" }),
      x: floorX,
      y: floorY,
      w: floorW,
      h: floorH,
      ports: roomPorts,
    };
    byId.outside = outsideLayout;
    placed.forEach((p) => {
      byId[p.id] = p;
    });

    return {
      vb: VB,
      floor: { x: floorX, y: floorY, w: floorW, h: floorH },
      tents: placed,
      outside: outsideLayout,
      room: byId.room,
      byId,
    };
  };

  function portAnchors(x, y, w, h) {
    return {
      front: { x: x + w / 2, y: y + h },
      back: { x: x + w / 2, y: y + 6 },
      left: { x: x, y: y + h * 0.45 },
      right: { x: x + w, y: y + h * 0.45 },
      top: { x: x + w / 2, y: y + 2 },
    };
  }

  const pointOnPath = (a, b, t) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });

  const ribbonPath = (a, b, kind) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    let cx = mx;
    let cy = my;
    if (kind === "intake") {
      cx = mx + (b.x > a.x ? 24 : -24);
      cy = my - 36;
    } else if (kind === "cascade") {
      cy = my + 10;
    } else if (kind === "recirc") {
      cx = mx - 40;
      cy = my - 50;
    } else if (kind === "out") {
      cy = my - 20;
      cx = mx - 10;
    }
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  };

  /* ------------------------------------------------------------------ */
  /* Scene SVG                                                          */
  /* ------------------------------------------------------------------ */

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const renderScene = (cfg, live = {}) => {
    const layout = layoutScene(cfg);
    const { floor, tents, outside, room, byId, vb } = layout;
    const ductLive = live.ducts || {};

    const tentSvg = tents
      .map((t) => {
        const L = live.zones && live.zones[t.id] ? live.zones[t.id] : {};
        const glow = L.light > 0.02 || L.mat;
        const fill = glow ? "url(#af-tent-lit)" : "url(#af-tent)";
        return `
      <g class="af-tent" data-id="${esc(t.id)}">
        <rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="6"
          fill="${fill}" stroke="#00E676" stroke-width="1.8"
          ${glow ? 'filter="url(#af-glow-green)"' : ""}/>
        <path d="M${t.x + 8} ${t.y + 14} L${t.x + t.w - 8} ${t.y + 14} L${t.x + t.w - 14} ${t.y + t.h - 12} L${t.x + 14} ${t.y + t.h - 12} Z"
          fill="url(#af-mylar)" opacity="0.55"/>
        <text x="${t.x + t.w / 2}" y="${t.y + 28}" text-anchor="middle" class="af-tent-label">${esc(t.label || t.id)}</text>
        <foreignObject x="${t.x + 8}" y="${t.y + 36}" width="${Math.max(40, t.w - 16)}" height="54">
          <div xmlns="http://www.w3.org/1999/xhtml" class="af-hud">
            <div class="af-hud-main">${esc(L.climate || "—")}</div>
            <div class="af-hud-sub">${esc(L.meta || "")}</div>
            ${L.mark ? `<div class="af-hud-mark">${esc(L.mark)}</div>` : ""}
          </div>
        </foreignObject>
      </g>`;
      })
      .join("");

    const ductSvg = (cfg.ducts || [])
      .map((d) => {
        const fromZ = byId[d.from];
        const toZ = byId[d.to];
        if (!fromZ || !toZ) return "";
        const a =
          (fromZ.ports && fromZ.ports[d.from_wall]) ||
          fromZ.ports?.front ||
          { x: fromZ.x + fromZ.w / 2, y: fromZ.y };
        const b =
          (toZ.ports && toZ.ports[d.to_wall]) ||
          toZ.ports?.front ||
          { x: toZ.x + toZ.w / 2, y: toZ.y + toZ.h };
        const color = KIND_COLOR[d.kind] || "#26C6DA";
        const st = ductLive[d.id] || {};
        const frac = st.frac || 0;
        const active = frac > 0.02;
        const width = (2.2 + frac * 3.2).toFixed(2);
        const dur = (2.8 - frac * 2).toFixed(2);
        const path = ribbonPath(a, b, d.kind);
        const comps = (d.components || [])
          .map((c) => {
            const t = c.at === "source" ? 0.22 : c.at === "dest" ? 0.78 : 0.5;
            const p = pointOnPath(a, b, t);
            if (c.type === "carbon_filter") {
              return `<g transform="translate(${p.x - 10},${p.y - 14})">
                <rect width="20" height="28" rx="4" fill="#1a222e" stroke="${color}" stroke-width="1.4"/>
                <text x="10" y="17" text-anchor="middle" class="af-glyph">C</text>
              </g>`;
            }
            return `<g transform="translate(${p.x},${p.y})">
              <circle r="9" fill="#121820" stroke="${color}" stroke-width="1.6"/>
              <circle r="3" fill="${color}" opacity="0.85"/>
            </g>`;
          })
          .join("");
        const call =
          active && st.cfmLabel
            ? `<g>
          <rect x="${((a.x + b.x) / 2 - 18).toFixed(1)}" y="${((a.y + b.y) / 2 - 28).toFixed(1)}" width="36" height="16" rx="4"
            fill="rgba(8,12,18,0.88)" stroke="${color}" stroke-width="1"/>
          <text x="${((a.x + b.x) / 2).toFixed(1)}" y="${((a.y + b.y) / 2 - 16).toFixed(1)}" text-anchor="middle" class="af-call">${esc(st.cfmLabel)}</text>
        </g>`
            : "";
        return `
      <g class="af-duct-g" data-id="${esc(d.id)}" opacity="${active ? 1 : 0.18}">
        <path d="${path}" fill="none" stroke="${color}" stroke-width="${(+width + 6).toFixed(2)}" opacity="0.18" stroke-linecap="round" filter="url(#af-soft)"/>
        <path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" opacity="0.45" stroke-linecap="round"/>
        <path class="af-flow ${active ? "active" : ""}" d="${path}" fill="none" stroke="${color}" stroke-width="${width}"
          stroke-linecap="round" stroke-dasharray="7 12" style="--dur:${dur}s" filter="url(#af-soft)"/>
        ${comps}
        ${call}
      </g>`;
      })
      .join("");

    const roomLive = (live.zones && live.zones.room) || {};
    const outLive = (live.zones && live.zones.outside) || {};
    const needsOutside = (cfg.ducts || []).some((d) => d.to === "outside");

    return `
<svg viewBox="0 0 ${vb.w} ${vb.h}" xmlns="http://www.w3.org/2000/svg" class="af-scene-svg" role="img" aria-label="Airflow tent scene">
  <defs>
    <linearGradient id="af-room" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2433"/><stop offset="100%" stop-color="#0e141c"/>
    </linearGradient>
    <linearGradient id="af-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#243044"/><stop offset="100%" stop-color="#151c28"/>
    </linearGradient>
    <radialGradient id="af-tent" cx="35%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#1c2836"/><stop offset="100%" stop-color="#0c1016"/>
    </radialGradient>
    <radialGradient id="af-tent-lit" cx="40%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#3a3420"/><stop offset="55%" stop-color="#1a2218"/><stop offset="100%" stop-color="#0c1016"/>
    </radialGradient>
    <linearGradient id="af-mylar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c5d0e0" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#6a7788" stop-opacity="0.15"/>
    </linearGradient>
    <filter id="af-soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.4"/>
    </filter>
    <filter id="af-glow-green" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .af-scene-svg { width: 100%; height: auto; display: block; }
      .af-flow.active { animation: af-dash var(--dur, 1.6s) linear infinite; }
      @keyframes af-dash { to { stroke-dashoffset: -76; } }
      .af-tent-label { fill: #e8eef8; font: 700 11px ui-monospace, Menlo, Consolas, monospace; }
      .af-call { fill: #f5f7fc; font: 700 10px ui-monospace, Menlo, Consolas, monospace; }
      .af-glyph { fill: #c5d0e0; font: 700 10px ui-monospace, Menlo, Consolas, monospace; }
      .af-room-label { fill: #8b95a8; font: 600 11px ui-monospace, Menlo, Consolas, monospace; }
      .af-hud {
        font-family: ui-monospace, Menlo, Consolas, monospace;
        background: rgba(10,14,20,0.72);
        border: 1px solid rgba(0,230,118,0.28);
        border-radius: 6px;
        padding: 4px 6px;
        color: #eef2f8;
        backdrop-filter: blur(4px);
      }
      .af-hud-main { font-size: 11px; font-weight: 700; }
      .af-hud-sub { font-size: 9px; color: #9aa6b8; margin-top: 2px; }
      .af-hud-mark { font-size: 9px; color: #ff8a65; font-weight: 700; margin-top: 2px; }
    </style>
  </defs>

  <!-- Atmosphere -->
  <rect width="${vb.w}" height="${vb.h}" fill="#0a0d12"/>
  <rect x="0" y="0" width="${vb.w}" height="130" fill="url(#af-wall)"/>
  <ellipse cx="${floor.x + floor.w / 2}" cy="${floor.y + floor.h / 2}" rx="${floor.w * 0.55}" ry="${floor.h * 0.42}" fill="#00e676" opacity="0.04"/>

  <!-- Room floor -->
  <rect x="${floor.x}" y="${floor.y}" width="${floor.w}" height="${floor.h}" rx="10"
    fill="url(#af-room)" stroke="#2a3548" stroke-width="1.5"/>
  <text x="${floor.x + 12}" y="${floor.y + 18}" class="af-room-label">${esc(room.label || "Room")} · ${esc(room.size || "")}</text>
  <text x="${floor.x + 12}" y="${floor.y + 34}" class="af-room-label">${esc(roomLive.climate || "")}</text>

  ${
    needsOutside
      ? `<g>
    <rect x="${outside.x}" y="${outside.y}" width="${outside.w}" height="${outside.h}" rx="6"
      fill="#152030" stroke="#42A5F5" stroke-width="1.6"/>
    <rect x="${outside.x + 8}" y="${outside.y + 12}" width="${outside.w - 16}" height="${outside.h - 28}" rx="3"
      fill="#1e3a55" opacity="0.8"/>
    <text x="${outside.x + outside.w / 2}" y="${outside.y - 6}" text-anchor="middle" class="af-room-label">${esc(outside.label || "Outside")}</text>
    <text x="${outside.x + outside.w / 2}" y="${outside.y + outside.h + 14}" text-anchor="middle" class="af-room-label">${esc(outLive.climate || "")}</text>
  </g>`
      : ""
  }

  ${ductSvg}
  ${tentSvg}
</svg>`;
  };

  /* ------------------------------------------------------------------ */
  /* Card styles                                                        */
  /* ------------------------------------------------------------------ */

  const CARD_CSS = `
    .af-shell {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      color: #eef2f8;
      background:
        radial-gradient(120% 70% at 50% 0%, #162033 0%, transparent 55%),
        linear-gradient(180deg, #121820, #0a0d12);
      border-radius: 12px;
      overflow: hidden;
    }
    .af-head {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 12px 14px 4px; gap: 10px;
    }
    .af-title {
      margin: 0; font-size: 13px; font-weight: 700;
      letter-spacing: 0.12em; color: #00e676;
    }
    .af-head-meta { font-size: 11px; color: #8b95a8; text-align: right; }
    .af-scene { padding: 0 6px; }
    .af-blend {
      margin: 6px 14px 10px; padding: 8px 10px;
      border: 1px solid #243041; border-radius: 8px;
      background: rgba(0,0,0,0.28);
    }
    .af-blend-label {
      display: flex; justify-content: space-between;
      font-size: 11px; color: #8b95a8; margin-bottom: 6px;
    }
    .af-blend-label strong { color: #eef2f8; }
    .af-blend-track {
      position: relative; height: 12px; border-radius: 999px;
      overflow: hidden; background: #1a2230;
      box-shadow: inset 0 0 0 1px #2a3548;
    }
    .af-blend-rec {
      position: absolute; inset: 0 auto 0 0;
      background: linear-gradient(90deg, #7b1fa2, #ab47bc);
      box-shadow: 0 0 12px #ab47bc66; transition: width .45s ease;
    }
    .af-blend-out {
      position: absolute; inset: 0 0 0 auto;
      background: linear-gradient(90deg, #1e88e5, #42a5f5);
      box-shadow: 0 0 12px #42a5f566; transition: width .45s ease;
    }
    .af-blend-dump {
      position: absolute; inset: 0 0 0 auto;
      background: linear-gradient(90deg, #455a64, #78909c);
      transition: width .45s ease;
    }
    .af-foot {
      padding: 0 14px 12px; font-size: 11px; color: #8b95a8; line-height: 1.45;
    }
  `;

  /* ------------------------------------------------------------------ */
  /* Card element                                                       */
  /* ------------------------------------------------------------------ */

  class DscAirflowMapCard extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._root = null;
    }

    static getStubConfig() {
      const d = DSC_DEFAULTS();
      return { title: d.title, zones: d.zones, ducts: d.ducts };
    }

    static async getConfigElement() {
      await customElements.whenDefined(EDITOR_TYPE);
      return document.createElement(EDITOR_TYPE);
    }

    setConfig(config) {
      this._config = normalizeConfig(config);
      if (!this._root) this._build();
      else this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._root) this._applyLive();
    }

    getCardSize() {
      return 10;
    }

    getGridOptions() {
      return {
        columns: this._config?.grid_options?.columns ?? 12,
        rows: this._config?.grid_options?.rows ?? 11,
      };
    }

    _build() {
      this._root = document.createElement("ha-card");
      this._root.style.overflow = "hidden";
      this._root.style.background = "transparent";
      this._root.style.border = "1px solid #2A3140";
      const style = document.createElement("style");
      style.textContent = CARD_CSS;
      this._shell = document.createElement("div");
      this._shell.className = "af-shell";
      this._root.appendChild(style);
      this._root.appendChild(this._shell);
      this.appendChild(this._root);
      this._render();
      if (this._hass) this._applyLive();
    }

    _render() {
      if (!this._shell || !this._config) return;
      this._shell.innerHTML = `
        <div class="af-head">
          <h3 class="af-title">${esc(this._config.title || "AIRFLOW STATUS")}</h3>
          <div class="af-head-meta" id="af-head-meta">tent scene</div>
        </div>
        <div class="af-scene" id="af-scene"></div>
        <div class="af-blend">
          <div class="af-blend-label">
            <span id="blend-left-lbl">Recirc —</span>
            <span id="blend-right-lbl">Out —</span>
          </div>
          <div class="af-blend-track">
            <div class="af-blend-rec" id="blend-rec" style="width:0%"></div>
            <div class="af-blend-out" id="blend-out" style="width:0%"></div>
            <div class="af-blend-dump" id="blend-dump" style="width:0%"></div>
          </div>
        </div>
        <div class="af-foot" id="af-foot">Configure tents, walls, fans, and filters in Edit card.</div>
      `;
      this._applyLive();
    }

    _q(sel) {
      return this._shell?.querySelector(sel);
    }

    _applyLive() {
      if (!this._shell || !this._config) return;
      const hass = this._hass;
      const cfg = this._config;
      const live = { zones: {}, ducts: {} };

      for (const z of cfg.zones) {
        const t = hass ? numState(hass, z.temp) : NaN;
        const h = hass ? numState(hass, z.humidity) : NaN;
        const vol = hass ? numState(hass, z.volume) : NaN;
        const ach = hass ? numState(hass, z.ach) : NaN;
        const light = hass && z.light ? lightLevel(hass, z.light) : 0;
        const mat = hass && z.mat ? isOn(hass, z.mat) : false;
        const meta = [];
        if (Number.isFinite(vol)) meta.push(`~${(vol * AIR_KG_M3).toFixed(vol > 5 ? 0 : 1)} kg`);
        if (Number.isFinite(ach) && ach > 0) meta.push(`${ach.toFixed(0)} ACH`);
        let mark = "";
        if (light > 0.02) mark = `LIGHT ${Math.round(light * 100)}%`;
        else if (mat) mark = "MAT";
        live.zones[z.id] = {
          climate: climatePair(t, h),
          meta: meta.join(" · "),
          light,
          mat,
          mark,
        };
      }

      // Cascade CFM inherits from intake into same from-zone
      const intakeCfmByTo = {};
      for (const d of cfg.ducts) {
        if (d.kind === "intake" && hass) {
          intakeCfmByTo[d.to] = numState(hass, d.cfm, 0);
        }
      }

      let recCfm = 0;
      let outCfm = 0;
      let dumpCfm = 0;

      for (const d of cfg.ducts) {
        let cfm = 0;
        let pct = 0;
        let max = 200;
        if (hass) {
          if (d.kind === "cascade" && !d.cfm) {
            cfm = intakeCfmByTo[d.from] || 0;
          } else {
            cfm = numState(hass, d.cfm, 0);
          }
          pct = numState(hass, d.fan_pct, 0);
          max = numState(hass, d.cfm_max, 200);
        }
        const frac = flowFrac(cfm, max);
        live.ducts[d.id] = {
          frac,
          cfmLabel: frac > 0.02 ? `${Math.round(cfm)}` : "",
          cfm,
          pct,
        };
        if (d.kind === "recirc") recCfm += Math.max(0, cfm);
        else if (d.kind === "out" && d.to === "outside") outCfm += Math.max(0, cfm);
        else if (d.kind === "out" && d.to === "room") dumpCfm += Math.max(0, cfm);
      }

      const scene = this._q("#af-scene");
      if (scene) scene.innerHTML = renderScene(cfg, live);

      const sum = recCfm + outCfm + dumpCfm;
      const recPct = sum > FLOW_EPS ? Math.round((recCfm / sum) * 100) : 0;
      const outPct = sum > FLOW_EPS ? Math.round((outCfm / sum) * 100) : 0;
      const dumpPct = sum > FLOW_EPS ? Math.round((dumpCfm / sum) * 100) : 0;
      const br = this._q("#blend-rec");
      const bo = this._q("#blend-out");
      const bd = this._q("#blend-dump");
      if (br) br.style.width = `${recPct}%`;
      if (bo) bo.style.width = `${outPct}%`;
      if (bd) bd.style.width = `${dumpPct}%`;
      const left = this._q("#blend-left-lbl");
      const right = this._q("#blend-right-lbl");
      if (left) left.innerHTML = `<strong>Recirc ${recPct}%</strong>`;
      if (right) {
        if (outPct > 0 && dumpPct > 0)
          right.innerHTML = `<strong>Out ${outPct}% · Dump ${dumpPct}%</strong>`;
        else if (dumpPct > 0)
          right.innerHTML = `<strong>Dump→Room ${dumpPct}%</strong>`;
        else right.innerHTML = `<strong>Out ${outPct}%</strong>`;
      }

      const tents = cfg.zones.filter((z) => z.role === "tent").length;
      const hm = this._q("#af-head-meta");
      if (hm) hm.textContent = `${tents} tent${tents === 1 ? "" : "s"} · ${cfg.ducts.length} routes`;
      const foot = this._q("#af-foot");
      if (foot) {
        foot.textContent =
          "Room lung → tent intakes → cascade → exhaust blend. Only Recirc (and into-room dump) stays in the lung; through-wall Out leaves the room.";
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* GUI Editor                                                         */
  /* ------------------------------------------------------------------ */

  const EDITOR_CSS = `
    .afe {
      font-family: ui-monospace, Menlo, Consolas, monospace;
      color: var(--primary-text-color);
      padding: 4px 0 16px;
    }
    .afe h3 {
      margin: 16px 0 8px; font-size: 13px; letter-spacing: 0.06em;
      color: var(--secondary-text-color); text-transform: uppercase;
    }
    .afe-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; align-items: center; }
    .afe-field { flex: 1 1 140px; min-width: 120px; }
    .afe-field label { display: block; font-size: 11px; opacity: 0.7; margin-bottom: 3px; }
    .afe-field input, .afe-field select {
      width: 100%; box-sizing: border-box;
      padding: 8px; border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .afe-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .afe-chip {
      border: 1px solid var(--divider-color); border-radius: 999px;
      padding: 4px 10px; font-size: 12px; cursor: pointer;
      background: transparent; color: var(--primary-text-color);
    }
    .afe-chip.on {
      border-color: var(--primary-color); background: rgba(0,230,118,0.12);
      color: var(--primary-color); font-weight: 700;
    }
    .afe-card {
      border: 1px solid var(--divider-color); border-radius: 10px;
      padding: 10px; margin-bottom: 10px;
      background: var(--secondary-background-color, transparent);
    }
    .afe-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .afe-btn {
      cursor: pointer; border-radius: 8px; padding: 8px 12px; font-size: 12px;
      border: 1px solid var(--divider-color);
      background: var(--primary-color); color: var(--text-primary-color, #fff);
    }
    .afe-btn.ghost {
      background: transparent; color: var(--primary-text-color);
    }
    .afe-btn.danger { background: #c62828; border-color: #c62828; }
    .afe-seg { display: flex; gap: 0; border-radius: 8px; overflow: hidden; border: 1px solid var(--divider-color); }
    .afe-seg button {
      flex: 1; border: 0; padding: 8px; cursor: pointer; font-size: 11px;
      background: transparent; color: var(--primary-text-color);
    }
    .afe-seg button.on { background: var(--primary-color); color: #fff; font-weight: 700; }
    .afe-wall {
      display: grid; grid-template-columns: 28px 56px 28px; grid-template-rows: 22px 40px 22px;
      gap: 4px; width: 120px; margin: 6px 0;
    }
    .afe-wall button {
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: transparent; color: var(--primary-text-color);
      font-size: 9px; cursor: pointer; padding: 0;
    }
    .afe-wall button.on { background: var(--primary-color); color: #fff; font-weight: 700; }
    .afe-wall .mid { grid-column: 2; grid-row: 2; display: flex; align-items: center; justify-content: center;
      border: 1px dashed var(--divider-color); border-radius: 4px; font-size: 10px; opacity: 0.7; }
    .afe-preview {
      border: 1px solid var(--divider-color); border-radius: 10px;
      overflow: hidden; background: #0a0d12; margin-bottom: 8px;
    }
    .afe-preview .af-scene-svg { max-height: 220px; }
    .afe-comp {
      display: inline-flex; align-items: center; gap: 4px;
      border: 1px solid var(--divider-color); border-radius: 999px;
      padding: 3px 8px; font-size: 11px; margin: 2px; cursor: pointer;
    }
    .afe-adv {
      margin-top: 12px; border-top: 1px solid var(--divider-color); padding-top: 8px;
    }
    .afe-adv summary { cursor: pointer; font-size: 12px; opacity: 0.8; }
    .afe-adv textarea {
      width: 100%; min-height: 120px; margin-top: 8px; box-sizing: border-box;
      font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 11px;
      border-radius: 8px; border: 1px solid var(--divider-color);
      background: var(--card-background-color); color: var(--primary-text-color);
      padding: 8px;
    }
  `;

  class DscAirflowMapCardEditor extends HTMLElement {
    constructor() {
      super();
      this._config = normalizeConfig(null);
      this._hass = null;
    }

    setConfig(config) {
      this._config = normalizeConfig(config);
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      // entity pickers need hass; re-render lightly if already built
      if (this._wrap && !this._painted) this._render();
    }

    _fire() {
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: { ...this._config } },
          bubbles: true,
          composed: true,
        })
      );
    }

    _update(mutator) {
      const next = normalizeConfig(JSON.parse(JSON.stringify(this._config)));
      mutator(next);
      this._config = normalizeConfig(next);
      this._fire();
      this._render();
    }

    _render() {
      if (!this._wrap) {
        const style = document.createElement("style");
        style.textContent = EDITOR_CSS;
        this._wrap = document.createElement("div");
        this._wrap.className = "afe";
        this.appendChild(style);
        this.appendChild(this._wrap);
      }
      const cfg = this._config;
      const room = cfg.zones.find((z) => z.role === "room");
      const tents = cfg.zones.filter((z) => z.role === "tent");
      const zoneIds = cfg.zones.map((z) => z.id);

      this._wrap.innerHTML = `
        <div class="afe-preview" id="afe-preview">${renderScene(cfg, {})}</div>

        <h3>Room</h3>
        <div class="afe-card" data-sec="room">
          <div class="afe-row"><div class="afe-field"><label>Label</label>
            <input data-k="room-label" value="${esc(room?.label || "Room")}"/></div></div>
          <div class="afe-chips" data-k="room-size">
            ${SIZE_PRESETS.map(
              (s) =>
                `<button type="button" class="afe-chip ${room?.size === s ? "on" : ""}" data-size="${s}">${s}</button>`
            ).join("")}
          </div>
          <div class="afe-row">
            ${entityField("Temp", "room-temp", room?.temp)}
            ${entityField("Humidity", "room-humidity", room?.humidity)}
            ${entityField("Volume", "room-volume", room?.volume)}
          </div>
        </div>

        <h3>Tents <span style="opacity:.6;font-weight:400">(${tents.length}/${MAX_TENTS})</span></h3>
        <div id="afe-tents"></div>
        <div class="afe-actions">
          <button type="button" class="afe-btn" id="afe-add-tent" ${tents.length >= MAX_TENTS ? "disabled" : ""}>+ Add tent</button>
        </div>

        <h3>Routes</h3>
        <div id="afe-ducts"></div>
        <div class="afe-actions">
          <button type="button" class="afe-btn" id="afe-add-duct">+ Add route</button>
        </div>

        <details class="afe-adv">
          <summary>Advanced — raw config JSON</summary>
          <textarea id="afe-json">${esc(JSON.stringify({ title: cfg.title, zones: cfg.zones, ducts: cfg.ducts }, null, 2))}</textarea>
          <div class="afe-actions">
            <button type="button" class="afe-btn ghost" id="afe-apply-json">Apply JSON</button>
          </div>
        </details>
      `;

      // tents
      const tentsEl = this._wrap.querySelector("#afe-tents");
      tents.forEach((t, idx) => {
        const card = document.createElement("div");
        card.className = "afe-card";
        card.innerHTML = `
          <div class="afe-row">
            <div class="afe-field"><label>Label</label><input data-tent="${idx}" data-f="label" value="${esc(t.label || "")}"/></div>
            <div class="afe-field"><label>Id</label><input data-tent="${idx}" data-f="id" value="${esc(t.id || "")}"/></div>
          </div>
          <div class="afe-chips">
            ${SIZE_PRESETS.map(
              (s) =>
                `<button type="button" class="afe-chip ${t.size === s ? "on" : ""}" data-tent-size="${idx}" data-size="${s}">${s}</button>`
            ).join("")}
          </div>
          <div class="afe-row">
            ${entityField("Temp", `tent-${idx}-temp`, t.temp, idx)}
            ${entityField("Humidity", `tent-${idx}-humidity`, t.humidity, idx)}
            ${entityField("Volume", `tent-${idx}-volume`, t.volume, idx)}
          </div>
          <div class="afe-row">
            ${entityField("ACH", `tent-${idx}-ach`, t.ach, idx)}
            ${entityField("Light", `tent-${idx}-light`, t.light, idx)}
            ${entityField("Mat", `tent-${idx}-mat`, t.mat, idx)}
          </div>
          <div class="afe-actions">
            <button type="button" class="afe-btn danger ghost" data-del-tent="${idx}">Remove tent</button>
          </div>`;
        tentsEl.appendChild(card);
      });

      // ducts
      const ductsEl = this._wrap.querySelector("#afe-ducts");
      cfg.ducts.forEach((d, idx) => {
        const card = document.createElement("div");
        card.className = "afe-card";
        const isOut = d.kind === "out";
        const destOutside = d.to === "outside";
        card.innerHTML = `
          <div class="afe-row">
            <div class="afe-field"><label>From</label>
              <select data-duct="${idx}" data-f="from">${zoneIds.map((id) => `<option value="${esc(id)}" ${d.from === id ? "selected" : ""}>${esc(id)}</option>`).join("")}</select>
            </div>
            <div class="afe-field"><label>To</label>
              <select data-duct="${idx}" data-f="to">${zoneIds.map((id) => `<option value="${esc(id)}" ${d.to === id ? "selected" : ""}>${esc(id)}</option>`).join("")}</select>
            </div>
            <div class="afe-field"><label>Kind</label>
              <select data-duct="${idx}" data-f="kind">
                ${["intake", "cascade", "recirc", "out"]
                  .map(
                    (k) =>
                      `<option value="${k}" ${d.kind === k ? "selected" : ""}>${k}</option>`
                  )
                  .join("")}
              </select>
            </div>
          </div>
          ${
            isOut
              ? `<div class="afe-seg" data-dest="${idx}">
            <button type="button" class="${destOutside ? "on" : ""}" data-dest-val="outside">Through wall (Outside)</button>
            <button type="button" class="${!destOutside ? "on" : ""}" data-dest-val="room">Into room (dump)</button>
          </div>`
              : ""
          }
          <div class="afe-row">
            <div>
              <label style="font-size:11px;opacity:.7">From wall</label>
              ${wallPickerHtml(d.from_wall || "front", idx, "from_wall")}
            </div>
            <div>
              <label style="font-size:11px;opacity:.7">To wall</label>
              ${wallPickerHtml(d.to_wall || "back", idx, "to_wall")}
            </div>
          </div>
          <div class="afe-row">
            ${entityField("CFM", `duct-${idx}-cfm`, d.cfm, null, idx)}
            ${entityField("Fan %", `duct-${idx}-fan`, d.fan_pct, null, idx)}
            ${entityField("CFM max", `duct-${idx}-max`, d.cfm_max, null, idx)}
          </div>
          <div>
            <label style="font-size:11px;opacity:.7">Components</label>
            <div class="afe-row" data-comps="${idx}">
              ${(d.components || [])
                .map(
                  (c, ci) =>
                    `<span class="afe-comp" data-comp="${idx}:${ci}" title="tap to cycle position / right-click remove">${esc(c.type)} · ${esc(c.at || "mid")}</span>`
                )
                .join("")}
            </div>
            <div class="afe-actions">
              <button type="button" class="afe-btn ghost" data-add-fan="${idx}">+ Fan</button>
              <button type="button" class="afe-btn ghost" data-add-carbon="${idx}">+ Carbon filter</button>
              <button type="button" class="afe-btn danger ghost" data-del-duct="${idx}">Remove route</button>
            </div>
          </div>`;
        ductsEl.appendChild(card);
      });

      this._bind();
      this._painted = true;
    }

    _bind() {
      const w = this._wrap;

      w.querySelector('[data-k="room-label"]')?.addEventListener("change", (e) => {
        this._update((c) => {
          const room = c.zones.find((z) => z.role === "room");
          if (room) room.label = e.target.value;
        });
      });

      w.querySelectorAll("[data-size]").forEach((btn) => {
        if (btn.hasAttribute("data-tent-size")) return;
        btn.addEventListener("click", () => {
          const size = btn.getAttribute("data-size");
          this._update((c) => {
            const room = c.zones.find((z) => z.role === "room");
            if (room) room.size = size;
          });
        });
      });

      w.querySelectorAll("[data-tent-size]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = +btn.getAttribute("data-tent-size");
          const size = btn.getAttribute("data-size");
          this._update((c) => {
            const tents = c.zones.filter((z) => z.role === "tent");
            if (tents[idx]) tents[idx].size = size;
          });
        });
      });

      w.querySelectorAll("input[data-tent]").forEach((inp) => {
        inp.addEventListener("change", () => {
          const idx = +inp.getAttribute("data-tent");
          const f = inp.getAttribute("data-f");
          this._update((c) => {
            const tents = c.zones.filter((z) => z.role === "tent");
            if (!tents[idx]) return;
            const oldId = tents[idx].id;
            tents[idx][f] = inp.value;
            if (f === "id" && oldId !== inp.value) {
              c.ducts.forEach((d) => {
                if (d.from === oldId) d.from = inp.value;
                if (d.to === oldId) d.to = inp.value;
              });
            }
          });
        });
      });

      // entity text fields
      w.querySelectorAll("input[data-ent]").forEach((inp) => {
        inp.addEventListener("change", () => {
          const key = inp.getAttribute("data-ent");
          const val = inp.value.trim() || null;
          this._update((c) => {
            if (key.startsWith("room-")) {
              const room = c.zones.find((z) => z.role === "room");
              const f = key.replace("room-", "");
              if (room) room[f] = val;
            } else if (key.startsWith("tent-")) {
              const m = key.match(/^tent-(\d+)-(.+)$/);
              if (!m) return;
              const tents = c.zones.filter((z) => z.role === "tent");
              if (tents[+m[1]]) tents[+m[1]][m[2]] = val;
            } else if (key.startsWith("duct-")) {
              const m = key.match(/^duct-(\d+)-(cfm|fan|max)$/);
              if (!m) return;
              const map = { cfm: "cfm", fan: "fan_pct", max: "cfm_max" };
              if (c.ducts[+m[1]]) c.ducts[+m[1]][map[m[2]]] = val;
            }
          });
        });
      });

      w.querySelector("#afe-add-tent")?.addEventListener("click", () => {
        this._update((c) => {
          const n = c.zones.filter((z) => z.role === "tent").length;
          if (n >= MAX_TENTS) return;
          c.zones.push({
            id: `tent${n + 1}`,
            role: "tent",
            label: `Tent ${n + 1}`,
            size: "4x4",
          });
        });
      });

      w.querySelectorAll("[data-del-tent]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = +btn.getAttribute("data-del-tent");
          this._update((c) => {
            const tents = c.zones.filter((z) => z.role === "tent");
            const id = tents[idx]?.id;
            c.zones = c.zones.filter((z) => !(z.role === "tent" && z.id === id));
            c.ducts = c.ducts.filter((d) => d.from !== id && d.to !== id);
          });
        });
      });

      w.querySelectorAll("select[data-duct]").forEach((sel) => {
        sel.addEventListener("change", () => {
          const idx = +sel.getAttribute("data-duct");
          const f = sel.getAttribute("data-f");
          this._update((c) => {
            if (!c.ducts[idx]) return;
            c.ducts[idx][f] = sel.value;
            if (f === "kind" && sel.value === "out" && c.ducts[idx].to !== "outside" && c.ducts[idx].to !== "room") {
              c.ducts[idx].to = "outside";
              c.ducts[idx].to_wall = "window";
            }
          });
        });
      });

      w.querySelectorAll("[data-dest]").forEach((seg) => {
        const idx = +seg.getAttribute("data-dest");
        seg.querySelectorAll("button").forEach((btn) => {
          btn.addEventListener("click", () => {
            const val = btn.getAttribute("data-dest-val");
            this._update((c) => {
              if (!c.ducts[idx]) return;
              c.ducts[idx].kind = "out";
              c.ducts[idx].to = val;
              c.ducts[idx].to_wall = val === "outside" ? "window" : "front";
            });
          });
        });
      });

      w.querySelectorAll("[data-wall-duct]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = +btn.getAttribute("data-wall-duct");
          const which = btn.getAttribute("data-wall-which");
          const wall = btn.getAttribute("data-wall");
          this._update((c) => {
            if (c.ducts[idx]) c.ducts[idx][which] = wall;
          });
        });
      });

      w.querySelector("#afe-add-duct")?.addEventListener("click", () => {
        this._update((c) => {
          const tents = c.zones.filter((z) => z.role === "tent");
          const to = tents[0]?.id || "main";
          c.ducts.push({
            id: `duct${Date.now().toString(36)}`,
            from: "room",
            from_wall: "front",
            to,
            to_wall: "back",
            kind: "intake",
            components: [{ type: "inline_fan", at: "source" }],
          });
        });
      });

      w.querySelectorAll("[data-del-duct]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = +btn.getAttribute("data-del-duct");
          this._update((c) => {
            c.ducts.splice(idx, 1);
          });
        });
      });

      w.querySelectorAll("[data-add-fan]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = +btn.getAttribute("data-add-fan");
          this._update((c) => {
            c.ducts[idx].components = c.ducts[idx].components || [];
            c.ducts[idx].components.push({ type: "inline_fan", at: "source" });
          });
        });
      });

      w.querySelectorAll("[data-add-carbon]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = +btn.getAttribute("data-add-carbon");
          this._update((c) => {
            c.ducts[idx].components = c.ducts[idx].components || [];
            c.ducts[idx].components.push({
              type: "carbon_filter",
              at: "mid",
              label: "Carbon",
            });
          });
        });
      });

      const cycleAt = { source: "mid", mid: "dest", dest: "source" };
      w.querySelectorAll("[data-comp]").forEach((el) => {
        el.addEventListener("click", () => {
          const [di, ci] = el.getAttribute("data-comp").split(":").map(Number);
          this._update((c) => {
            const comp = c.ducts[di]?.components?.[ci];
            if (comp) comp.at = cycleAt[comp.at] || "mid";
          });
        });
        el.addEventListener("contextmenu", (ev) => {
          ev.preventDefault();
          const [di, ci] = el.getAttribute("data-comp").split(":").map(Number);
          this._update((c) => {
            c.ducts[di]?.components?.splice(ci, 1);
          });
        });
      });

      w.querySelector("#afe-apply-json")?.addEventListener("click", () => {
        try {
          const raw = JSON.parse(w.querySelector("#afe-json").value);
          this._config = normalizeConfig({
            ...this._config,
            ...raw,
            type: this._config.type,
          });
          this._fire();
          this._render();
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert(`Invalid JSON: ${err.message}`);
        }
      });
    }
  }

  function entityField(label, key, value) {
    return `<div class="afe-field"><label>${esc(label)}</label>
      <input data-ent="${esc(key)}" value="${esc(value || "")}" placeholder="entity.id"/></div>`;
  }

  function wallPickerHtml(current, ductIdx, which) {
    const walls = [
      ["", "top", ""],
      ["left", "mid", "right"],
      ["", "front", ""],
      ["", "back", ""],
    ];
    // compact: top / left mid right / front / back as grid
    return `<div class="afe-wall">
      <span></span>
      <button type="button" class="${current === "top" ? "on" : ""}" data-wall-duct="${ductIdx}" data-wall-which="${which}" data-wall="top">top</button>
      <span></span>
      <button type="button" class="${current === "left" ? "on" : ""}" data-wall-duct="${ductIdx}" data-wall-which="${which}" data-wall="left">L</button>
      <div class="mid">face</div>
      <button type="button" class="${current === "right" ? "on" : ""}" data-wall-duct="${ductIdx}" data-wall-which="${which}" data-wall="right">R</button>
      <span></span>
      <button type="button" class="${current === "front" ? "on" : ""}" data-wall-duct="${ductIdx}" data-wall-which="${which}" data-wall="front">front</button>
      <span></span>
      <span></span>
      <button type="button" class="${current === "back" || current === "window" ? "on" : ""}" data-wall-duct="${ductIdx}" data-wall-which="${which}" data-wall="${which === "to_wall" && current === "window" ? "window" : "back"}">${current === "window" ? "win" : "back"}</button>
      <span></span>
    </div>
    ${
      which === "to_wall"
        ? `<button type="button" class="afe-chip ${current === "window" ? "on" : ""}" data-wall-duct="${ductIdx}" data-wall-which="${which}" data-wall="window" style="margin-top:4px">window</button>`
        : ""
    }`;
  }

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, DscAirflowMapCard);
  }
  if (!customElements.get(EDITOR_TYPE)) {
    customElements.define(EDITOR_TYPE, DscAirflowMapCardEditor);
  }

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC Airflow Tent Scene",
    description:
      "GUI-configurable isometric tent airflow — room size, tents, wall ports, fans, carbon filters, exhaust into room or through wall.",
    preview: true,
    documentationURL: "https://github.com/weddas/DSC-HUB",
  });
})();
