/**
 * DSC-HUB - Build a Plant
 * Separate composition surface (not The Dash / system-map).
 * type: custom:dsc-build-plant-card
 * Metric only (C, L, ml/L, umol, %).
 * User-visible strings are ASCII-only to avoid HA/resource encoding mojibake.
 */
(() => {
  const CARD_TYPE = "dsc-build-plant-card";
  const CATALOG_BASE = "/local/dsc-catalog";
  // Full-corpus host (all strains). Local JSON remains offline fallback (capped).
  const CANNALIB_DEFAULT = "https://cannalib.plausible-deniability.net";
  const COLORS = ["#5b9f6b", "#4a8f9f", "#c4a35a"];
  /** UI kind -> catalog index key */
  const INDEX_KEY = {
    strain: "strains",
    nutrient: "nutrients",
    medium: "mediums",
    light: "lights",
  };
  const SEARCH_IDS = {
    strain: "q-strain",
    medium: "q-medium",
    nutrient: "q-nutrient",
    light: "q-light",
  };
  const DRAWER_TITLES = {
    strain: "Strain search",
    medium: "Medium search",
    nutrient: "Nutrient search",
    light: "Light search",
  };
  const DRAWER_PLACEHOLDERS = {
    strain: "Type a strain name...",
    medium: "Coco, perlite, LECA...",
    nutrient: "CANNA Coco A...",
    light: "Spider Farmer SF1000...",
  };

  const ICO_SEARCH = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  const ICO_MORE = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="12" cy="5" r="1.75" fill="currentColor"/><circle cx="12" cy="12" r="1.75" fill="currentColor"/><circle cx="12" cy="19" r="1.75" fill="currentColor"/></svg>`;

  const DEFAULTS = () => ({
    type: `custom:${CARD_TYPE}`,
    title: "Build a Plant",
    subtitle: "Compose strain / medium / nutrition / light / climate",
  });

  const css = `
    :host {
      display:block;
      font-family: "Segoe UI", "IBM Plex Sans", system-ui, sans-serif;
      color:#e8efe9;
      --dsc-neon: #39ff14;
      --dsc-neon-dim: rgba(57, 255, 20, 0.35);
      --dsc-neon-glow: rgba(57, 255, 20, 0.55);
      --dsc-teal: #26c6da;
      --dsc-teal-dim: rgba(38, 198, 218, 0.4);
      --dsc-teal-glow: rgba(38, 198, 218, 0.55);
      --dsc-glass: rgba(12, 18, 16, 0.72);
      --dsc-glass-border: rgba(120, 180, 160, 0.28);
    }
    .wrap {
      position: relative;
      background:
        radial-gradient(900px 420px at 12% -8%, rgba(57,255,20,.06), transparent 55%),
        radial-gradient(700px 380px at 92% 0%, rgba(38,198,218,.05), transparent 50%),
        linear-gradient(165deg, #121a16 0%, #0c1210 48%, #10161c 100%);
      border: 1px solid var(--dsc-glass-border);
      min-height: 92vh; padding: 20px 22px 36px; box-sizing: border-box;
      overflow: hidden;
    }
    .hero {
      display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between;
      gap:12px; margin-bottom: 18px;
    }
    .brand { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color:#7fa88a; margin:0 0 6px; }
    h1 { margin:0; font-size: 28px; font-weight: 650; letter-spacing: .02em; color:#f2f7f3; }
    .sub { margin: 6px 0 0; color:#9aada0; font-size: 14px; max-width: 56ch; }
    .flow {
      display:flex; align-items:stretch; gap:0; flex-wrap:nowrap;
    }
    .flow-col {
      flex: 1 1 0; min-width: 0;
      display:flex; flex-direction:column; gap:14px;
    }
    .flow-col.mid { flex: 1.15 1 0; }
    .connector {
      flex: 0 0 36px; align-self: stretch; position: relative; margin: 28px 4px 28px;
      min-height: 48px;
    }
    .connector::before {
      content:""; position:absolute; left:50%; top:8%; bottom:8%; width:3px;
      transform:translateX(-50%);
      background: linear-gradient(180deg, transparent, var(--dsc-teal), var(--dsc-neon), transparent);
      box-shadow: 0 0 16px var(--dsc-teal-glow), 0 0 28px rgba(57,255,20,0.25);
      opacity:.95;
    }
    .connector::after {
      content:""; position:absolute; left:50%; top:50%; width:0; height:0;
      transform:translate(-20%, -50%);
      border-top:7px solid transparent; border-bottom:7px solid transparent;
      border-left:10px solid var(--dsc-teal);
      filter: drop-shadow(0 0 8px var(--dsc-teal-glow));
    }
    @media (max-width: 1100px) {
      .flow { flex-direction: column; }
      .connector { display:none; }
      .flow-col, .flow-col.mid { flex: 1 1 auto; }
    }
    section.glass {
      background: var(--dsc-glass);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid var(--dsc-glass-border);
      border-radius: 12px;
      padding: 14px 14px 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,.35);
    }
    section.glass.valid-glow {
      border-color: var(--dsc-teal-dim);
      box-shadow: 0 0 0 1px rgba(38,198,218,.15), 0 0 24px rgba(38,198,218,.14);
    }
    section h2 {
      margin:0 0 10px; font-size: 13px; letter-spacing: .14em; text-transform: uppercase;
      color:#8fb89a; display:flex; align-items:center; justify-content:space-between; gap:8px;
    }
    section h2 .h2-left { display:flex; align-items:center; gap:8px; }
    label { display:block; font-size:11px; color:#8a9c90; margin: 8px 0 4px; letter-spacing:.04em; }
    input[type=text], input[type=date], input[type=number], select {
      width:100%; box-sizing:border-box; background:#0b110e; color:#e8efe9;
      border:1px solid rgba(120,160,130,.28); border-radius:8px; padding:8px 10px; font-size:14px;
    }
    input[type=range] { width:100%; accent-color: var(--dsc-teal); }
    .row { display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end; }
    .row > * { flex:1; min-width:120px; }
    .result-row {
      display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:4px;
    }
    .result-chip {
      display:inline-flex; align-items:center; gap:8px; max-width:100%;
      padding:8px 12px; border-radius:999px;
      border:1px solid var(--dsc-teal-dim);
      background: rgba(38,198,218,.1);
      color:#f2f7f3; font-size:13px; min-width:0; flex:1 1 140px;
    }
    .result-chip.empty {
      border-color: rgba(120,160,130,.28);
      background: rgba(18,28,22,.45);
      color:#8a9c90;
    }
    .result-chip span {
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .icon-btn {
      appearance:none; width:36px; height:36px; padding:0;
      display:inline-flex; align-items:center; justify-content:center;
      border-radius:10px; border:1px solid rgba(120,160,130,.35);
      background:#1a2a20; color:#e8efe9; cursor:pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,.4);
      flex: 0 0 auto;
    }
    .icon-btn:hover { border-color: var(--dsc-teal-dim); color: var(--dsc-teal); }
    .icon-btn:active { transform: translateY(1px); }
    .overflow { position:relative; display:inline-block; }
    .overflow-menu {
      position:absolute; right:0; top:calc(100% + 6px); z-index:40;
      min-width:180px; padding:6px;
      background:#0c100d; border:1px solid rgba(120,160,130,.35);
      border-radius:10px; box-shadow: 0 8px 24px rgba(0,0,0,.45);
    }
    .overflow-menu button {
      appearance:none; width:100%; text-align:left; border:0;
      background:transparent; color:#e8efe9; font:inherit; font-size:13px;
      padding:10px 12px; border-radius:8px; cursor:pointer;
    }
    .overflow-menu button:hover {
      background: rgba(38,198,218,.12); color: var(--dsc-teal);
    }
    .overflow-menu button:disabled { opacity:.4; cursor:not-allowed; }
    .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .chip {
      font-size:11px; padding:3px 8px; border-radius:999px;
      background:rgba(91,159,107,.15); border:1px solid rgba(91,159,107,.35); color:#cfe8d5;
    }
    .chip.warn { background:rgba(196,163,90,.12); border-color:rgba(196,163,90,.4); color:#e8d7a8; }
    .chip.bad { background:rgba(180,70,70,.12); border-color:rgba(180,70,70,.4); color:#f0b4b4; }
    .chip.miss { background:rgba(120,120,130,.1); border-color:rgba(160,160,170,.35); color:#b0b4bc; }
    .chip.ok {
      background: rgba(57,255,20,.1); border-color: var(--dsc-neon-dim); color: var(--dsc-neon);
      box-shadow: 0 0 12px rgba(57,255,20,.12);
    }
    .chip.teal {
      background: rgba(38,198,218,.12); border-color: var(--dsc-teal-dim); color: #b8f0f7;
    }
    .catalog-pill {
      display:inline-flex; align-items:center; gap:8px;
      padding:8px 14px; border-radius:999px;
      border:1px solid var(--dsc-neon-dim);
      background: rgba(57,255,20,.08);
      color:#cfe8d5; font-size:12px;
      box-shadow: 0 0 16px rgba(57,255,20,.12);
    }
    .catalog-pill .dot {
      width:8px; height:8px; border-radius:50%; background: var(--dsc-neon);
      box-shadow: 0 0 8px var(--dsc-neon-glow);
    }
    .catalog-pill.warn { border-color: rgba(196,163,90,.45); box-shadow:none; }
    .catalog-pill.bad { border-color: rgba(180,70,70,.45); box-shadow:none; }
    .catalog-pill.warn .dot, .catalog-pill.bad .dot { background:#c4a35a; box-shadow:none; }
    .soil { width:100%; max-width:260px; margin: 10px auto 6px; }
    .soil-pot {
      position:relative; width:100%; aspect-ratio: 4 / 5;
      border-radius: 12px 12px 28px 28px;
      border: 2px solid rgba(120,160,130,.45);
      background: linear-gradient(180deg, #1a1410 0%, #0e0c0a 100%);
      overflow:hidden;
      box-shadow: inset 0 0 24px rgba(0,0,0,.55), 0 0 20px rgba(38,198,218,.08);
    }
    .soil-pot.is-valid {
      border-color: var(--dsc-teal-dim);
      box-shadow: inset 0 0 24px rgba(0,0,0,.55), 0 0 28px rgba(38,198,218,.28);
    }
    .soil-layer {
      position:absolute; left:8%; right:8%;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; letter-spacing:.04em; color: rgba(244,247,244,.92);
      text-shadow: 0 1px 2px rgba(0,0,0,.65);
      border-top: 1px solid rgba(255,255,255,.08);
      box-sizing:border-box; padding: 0 4px; text-align:center;
    }
    .soil-empty {
      position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      color:#8a9c90; font-size:13px; padding:16px; text-align:center;
    }
    .layer-block {
      margin-top:10px; padding-top:8px;
      border-top: 1px solid rgba(120,160,130,.12);
    }
    .hits {
      margin:10px 0 0; padding:0; list-style:none; max-height:min(52vh, 420px); overflow:auto;
      background:#0e1612; border:1px solid rgba(120,160,130,.35); border-radius:8px;
    }
    .hits li { padding:8px 10px; cursor:pointer; border-bottom:1px solid rgba(120,160,130,.12); font-size:13px; }
    .hits li:hover, .hits li.active { background:rgba(38,198,218,.16); }
    .hits .meta { color:#8a9c90; font-size:11px; margin-top:2px; }
    .hits .empty { padding:10px; color:#8a9c90; font-size:12px; cursor:default; }
    .hits .empty:hover { background:transparent; }
    table { width:100%; border-collapse:collapse; font-size:13px; margin-top:8px; }
    th, td { text-align:left; padding:6px 4px; border-bottom:1px solid rgba(120,160,130,.12); }
    th { color:#8a9c90; font-weight:500; font-size:11px; letter-spacing:.06em; text-transform:uppercase; }
    .actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    button {
      background:#1a2a20; color:#e8efe9; border:1px solid rgba(120,160,130,.35);
      border-radius:8px; padding:9px 12px; cursor:pointer; font-size:13px;
    }
    button.primary { background:#2a4a34; border-color:#5b9f6b; }
    button.teal {
      border-color: var(--dsc-teal-dim);
      background: rgba(38,198,218,.18);
      color:#f2f7f3;
      box-shadow: 0 0 18px rgba(38,198,218,.2);
    }
    button.teal.primary {
      background: var(--dsc-teal);
      color:#041018;
      font-weight:650;
      box-shadow: 0 0 22px var(--dsc-teal-glow);
    }
    button:hover { filter:brightness(1.08); }
    button:disabled { opacity:.45; cursor:not-allowed; }
    .muted { color:#8a9c90; font-size:12px; }
    .roster { font-size:12px; }
    .roster div { padding:4px 0; border-bottom:1px solid rgba(120,160,130,.1); }
    .drawer {
      position:absolute; inset:0; z-index:80; pointer-events:none;
    }
    .drawer.is-open { pointer-events:auto; }
    .drawer-scrim {
      position:absolute; inset:0; background: rgba(0,0,0,.45);
      opacity:0; transition: opacity 180ms ease;
    }
    .drawer.is-open .drawer-scrim { opacity:1; }
    .drawer-panel {
      position:absolute; top:0; bottom:0; right:0;
      width: min(380px, 92%);
      background: linear-gradient(165deg, #121a16, #0a100e);
      border: 1px solid var(--dsc-glass-border);
      border-radius: 14px 0 0 14px;
      box-shadow: -12px 0 40px rgba(0,0,0,.55);
      display:flex; flex-direction:column;
      transform: translateX(105%);
      transition: transform 220ms ease;
    }
    .drawer.is-open .drawer-panel { transform: none; }
    .drawer-rail {
      position:absolute; top:50%; left:-28px; transform:translateY(-50%);
      width:28px; height:64px;
      border:1px solid rgba(120,160,130,.35); background:#1a2a20; color:#e8efe9;
      border-radius:10px 0 0 10px;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; z-index:2;
    }
    .drawer-head {
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:14px 16px; border-bottom:1px solid rgba(120,160,130,.2);
    }
    .drawer-head h2 {
      margin:0; font-size:13px; letter-spacing:.12em; text-transform:uppercase; color:#9aada0;
    }
    .drawer-body { flex:1; overflow:auto; padding:14px 16px; }
    @media (prefers-reduced-motion: reduce) {
      .drawer-panel, .drawer-scrim { transition: none !important; }
    }
  `;

  class DscBuildPlantCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = DEFAULTS();
      this._hass = null;
      this._indexes = { strains: [], nutrients: [], mediums: [], lights: [] };
      this._indexStatus = { loading: false, ok: false, errors: [] };
      /** @type {{ strains?: number, nutrients?: number, mediums?: number, lights?: number, source?: string } | null} */
      this._corpus = null;
      this._q = { strain: "", nutrient: "", medium: "", light: "" };
      this._hits = { strain: [], nutrient: [], medium: [], light: [] };
      this._hitActive = { strain: -1, nutrient: -1, medium: -1, light: -1 };
      this._drawerKind = null;
      this._loaded = false;
      this._mediumSlot = 1;
      this._focusRestore = null;
      this._selectedStrain = null;
      this._selectedLight = null;
      this._overflowMenu = null;
      this._notice = "";
    }

    setConfig(config) {
      this._config = { ...DEFAULTS(), ...(config || {}) };
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (!this._loaded) {
        this._loaded = true;
        this._loadIndexes();
      }
      // Avoid wiping an open drawer / focused search on every HA state tick.
      if (this._drawerKind || this._isSearchFocused()) return;
      this._render();
    }

    getCardSize() { return 12; }

    _isSearchFocused() {
      const ae = this.shadowRoot?.activeElement;
      if (!ae || ae.tagName !== "INPUT") return false;
      return Object.values(SEARCH_IDS).includes(ae.id);
    }

    _indexFor(kind) {
      return this._indexes[INDEX_KEY[kind]] || [];
    }

    async _loadIndexes() {
      this._indexStatus = { loading: true, ok: false, errors: [] };
      this._corpus = null;
      const kinds = [
        ["strains", "dsc_strains_search_index.json"],
        ["nutrients", "dsc_nutrients_search_index.json"],
        ["mediums", "dsc_mediums_search_index.json"],
        ["lights", "dsc_lights_search_index.json"],
      ];
      await Promise.all([
        ...kinds.map(async ([key, file]) => {
          try {
            const r = await fetch(`${CATALOG_BASE}/${file}`, { cache: "no-cache" });
            if (!r.ok) {
              this._indexStatus.errors.push(`${file} (${r.status})`);
              return;
            }
            const j = await r.json();
            this._indexes[key] = Array.isArray(j.items) ? j.items : [];
          } catch (err) {
            this._indexStatus.errors.push(`${file}: ${err?.message || "fetch failed"}`);
          }
        }),
        this._loadCorpusCounts(),
      ]);
      const localTotal = Object.values(this._indexes).reduce((n, a) => n + (a?.length || 0), 0);
      this._indexStatus.loading = false;
      this._indexStatus.ok = localTotal > 0 || !!(this._corpus && this._corpus.strains);
      if (!this._drawerKind) this._render();
      else this._paintCatalogChip();
    }

    async _loadCorpusCounts() {
      // Prefer live HA sensor (metrics poll) when present; else hit /v1/corpus.
      const fromHa = Number(this._st("sensor.dsc_cannalib_corpus_strains")?.state);
      if (Number.isFinite(fromHa) && fromHa > 0) {
        this._corpus = {
          strains: fromHa,
          source: "ha-sensor",
        };
        return;
      }
      try {
        const r = await fetch(`${this._cannalibBase()}/v1/corpus`, {
          headers: this._cannalibHeaders(),
          cache: "no-store",
        });
        if (!r.ok) throw new Error(`corpus ${r.status}`);
        const j = await r.json();
        const c = j?.counts || {};
        this._corpus = {
          strains: Number(c.strains) || 0,
          nutrients: Number(c.nutrients) || 0,
          mediums: Number(c.mediums) || 0,
          lights: Number(c.lights) || 0,
          source: "cannalib",
        };
      } catch {
        this._corpus = null;
      }
    }

    _cannalibBase() {
      const u = this._str("input_text.dsc_cannalib_base_url");
      return (u || CANNALIB_DEFAULT).replace(/\/$/, "");
    }

    _cannalibHeaders() {
      const h = { Accept: "application/json" };
      const key = this._str("input_text.dsc_cannalib_api_key");
      if (key) h["X-Cannalib-Key"] = key;
      return h;
    }

    async _apiSearch(kind, q, limit = 12) {
      const map = {
        strain: "strains",
        nutrient: "nutrients",
        medium: "mediums",
        light: "lights",
      };
      const domain = map[kind];
      if (!domain) return null;
      const url = `${this._cannalibBase()}/v1/catalogs/${domain}?q=${encodeURIComponent(q || "")}&limit=${limit}`;
      const r = await fetch(url, { headers: this._cannalibHeaders(), cache: "no-store" });
      if (!r.ok) throw new Error(`cannalib ${r.status}`);
      const j = await r.json();
      return Array.isArray(j.items) ? j.items : [];
    }

    _st(id) {
      return this._hass?.states?.[id];
    }

    _num(id, fallback = 0) {
      const v = parseFloat(this._st(id)?.state);
      return Number.isFinite(v) ? v : fallback;
    }

    _str(id) {
      const s = this._st(id)?.state;
      return s && s !== "unknown" && s !== "unavailable" ? s : "";
    }

    _call(domain, service, data = {}, target) {
      if (!this._hass) return;
      const payload = { ...(data || {}) };
      if (target && target.entity_id) payload.entity_id = target.entity_id;
      // HA 2024+ callService is (domain, service, serviceData) — entity_id in data.
      return this._hass.callService(domain, service, payload);
    }

    _setText(entity, value) {
      this._call("input_text", "set_value", { entity_id: entity, value: value ?? "" });
    }

    _setNumber(entity, value) {
      this._call("input_number", "set_value", { entity_id: entity, value });
    }

    _setSelect(entity, option) {
      this._call("input_select", "select_option", { entity_id: entity, option });
    }

    _setDate(entity, date) {
      if (!date) return;
      this._call("input_datetime", "set_datetime", { entity_id: entity, date });
    }

    _filterItems(kind, q) {
      const items = this._indexFor(kind);
      const needle = (q || "").trim().toLowerCase();
      if (!needle) {
        return items.slice(0, 12);
      }
      if (needle.length === 1) {
        return items
          .filter((it) => {
            const hay = `${it.name || ""} ${it.brand || ""} ${it.breeder || ""}`.toLowerCase();
            return hay.startsWith(needle) || hay.includes(` ${needle}`);
          })
          .slice(0, 12);
      }
      return items
        .filter((it) => {
          const hay = `${it.name || ""} ${it.brand || ""} ${it.breeder || ""}`.toLowerCase();
          return hay.includes(needle);
        })
        .slice(0, 12);
    }

    _search(kind, q, { open = true } = {}) {
      this._q[kind] = q;
      if (open) this._drawerKind = kind;
      // All four domains via cannalib; local JSON is offline fallback.
      if (kind === "strain" || kind === "nutrient" || kind === "medium" || kind === "light") {
        const seq = (this._apiSeq = (this._apiSeq || 0) + 1);
        const needle = (q || "").trim();
        clearTimeout(this._apiTimer);
        this._apiTimer = setTimeout(async () => {
          try {
            const items = await this._apiSearch(kind, needle, 12);
            if (seq !== this._apiSeq) return;
            this._hits[kind] = items || [];
            this._apiLive = true;
          } catch (_err) {
            if (seq !== this._apiSeq) return;
            this._hits[kind] = this._filterItems(kind, needle);
            this._apiLive = false;
          }
          this._hitActive[kind] = this._hits[kind].length ? 0 : -1;
          this._paintHits(kind);
          this._paintCatalogChip();
        }, needle.length ? 180 : 0);
        return;
      }
      this._hits[kind] = this._filterItems(kind, q);
      this._hitActive[kind] = this._hits[kind].length ? 0 : -1;
      if (open) this._drawerKind = kind;
      this._paintHits(kind);
    }

    _openSearch(kind) {
      this._drawerKind = kind;
      this._overflowMenu = null;
      this._search(kind, this._q[kind] || "", { open: true });
      this._focusRestore = { id: SEARCH_IDS[kind], pos: (this._q[kind] || "").length };
      this._render();
    }

    _closeSearch(kind) {
      if (kind && this._drawerKind !== kind) return;
      this._drawerKind = null;
      if (kind) {
        this._hits[kind] = [];
        this._hitActive[kind] = -1;
      }
      this._render();
    }

    _closeDrawer() {
      this._drawerKind = null;
      this._render();
    }

    _applyHit(kind, item) {
      if (!item) return;
      if (kind === "strain") this._pickStrain(item);
      else if (kind === "medium") this._pickMedium(item);
      else if (kind === "nutrient") this._addNutrient(item);
      else if (kind === "light") this._pickLight(item);
    }

    _pickStrain(item) {
      this._selectedStrain = item;
      this._setText("input_text.dsc_build_strain", item.name);
      this._q.strain = item.name;
      this._hits.strain = [];
      this._hitActive.strain = -1;
      this._drawerKind = null;
      this._render();
    }

    _pickMedium(item) {
      const composition = item.composition && typeof item.composition === "object"
        ? Object.entries(item.composition)
            .filter(([, pct]) => Number.isFinite(Number(pct)) && Number(pct) > 0)
            .slice(0, 3)
        : [];
      if (composition.length) {
        for (let n = 1; n <= 3; n++) {
          const part = composition[n - 1];
          this._setText(`input_text.dsc_blend_component_${n}_name`, part ? part[0] : "");
          this._setNumber(`input_number.dsc_blend_pct_${n}`, part ? Number(part[1]) : 0);
        }
        this._notice = "";
      } else {
        const slot = this._nextEmptyMediumSlot();
        if (!slot) {
          this._notice = "No free medium slot. Will not overwrite slot 1.";
          this._render();
          return;
        }
        this._setText(`input_text.dsc_blend_component_${slot}_name`, item.name);
        this._notice = `Wrote ${item.name} to medium slot ${slot}.`;
      }
      this._q.medium = "";
      this._hits.medium = [];
      this._hitActive.medium = -1;
      this._drawerKind = null;
      this._render();
    }

    _nextFreeNutrientSlot() {
      for (let n = 1; n <= 8; n++) {
        const name = this._str(`input_text.dsc_nutrient_${n}_name`);
        const inv = this._st(`input_boolean.dsc_nutrient_${n}_in_inventory`)?.state === "on";
        if (!name && !inv) return n;
      }
      return 0;
    }

    async _addNutrient(item) {
      const n = this._nextFreeNutrientSlot();
      if (!n) {
        this._notice = "No free nutrient slot. Inventory-off bottles stay put; will not overwrite slot 1.";
        this._render();
        return;
      }
      this._setText(`input_text.dsc_nutrient_${n}_name`, item.name);
      if (item.dose_ml_l != null && Number.isFinite(Number(item.dose_ml_l))) {
        this._setNumber(`input_number.dsc_nutrient_${n}_dose_ml_l`, Number(item.dose_ml_l));
      }
      this._call("input_boolean", "turn_on", {}, { entity_id: `input_boolean.dsc_nutrient_${n}_in_inventory` });
      this._notice = `Wrote ${item.name} to nutrient slot ${n}.`;
      this._q.nutrient = "";
      this._hits.nutrient = [];
      this._hitActive.nutrient = -1;
      this._drawerKind = null;
      this._render();
    }

    _pickLight(item) {
      this._selectedLight = item;
      const fixture = this._st("input_select.dsc_light_fixture");
      const opts = fixture?.attributes?.options || [];
      const match = opts.find((o) => String(o).toLowerCase().includes(String(item.name || "").toLowerCase().slice(0, 18)));
      if (match) {
        this._setSelect("input_select.dsc_light_fixture", match);
      } else {
        this._setSelect("input_select.dsc_light_fixture", "Custom / other");
        this._setText("input_text.dsc_light_custom_name", item.name || "");
        if (item.ppfd_url) this._setText("input_text.dsc_light_ppfd_map_url", item.ppfd_url);
        if (item.spectrum_url) this._setText("input_text.dsc_light_spectrum_map_url", item.spectrum_url);
      }
      this._q.light = item.name;
      this._hits.light = [];
      this._hitActive.light = -1;
      this._drawerKind = null;
      this._render();
    }

    _blendParts() {
      const parts = [];
      for (let n = 1; n <= 3; n++) {
        const name = this._str(`input_text.dsc_blend_component_${n}_name`);
        const pct = this._num(`input_number.dsc_blend_pct_${n}`, 0);
        if (pct > 0) parts.push({ n, name: name || `#${n}`, pct });
      }
      return parts;
    }

    _activeMediumSlots() {
      const slots = [];
      for (let n = 1; n <= 3; n++) {
        const name = this._str(`input_text.dsc_blend_component_${n}_name`);
        const pct = this._num(`input_number.dsc_blend_pct_${n}`, 0);
        if (name || pct > 0) slots.push({ n, name, pct });
      }
      return slots;
    }

    _nextEmptyMediumSlot() {
      for (let n = 1; n <= 3; n++) {
        const name = this._str(`input_text.dsc_blend_component_${n}_name`);
        const pct = this._num(`input_number.dsc_blend_pct_${n}`, 0);
        if (!name && pct <= 0) return n;
      }
      return null;
    }

    _clearMediumSlot(n) {
      this._setText(`input_text.dsc_blend_component_${n}_name`, "");
      this._setNumber(`input_number.dsc_blend_pct_${n}`, 0);
    }

    _mixLines() {
      const L = this._num("input_number.dsc_mix_tank_liters", 20);
      const str = this._num("input_number.dsc_mix_strength_pct", 100) / 100;
      const lines = [];
      let total = 0;
      for (let n = 1; n <= 8; n++) {
        const name = this._str(`input_text.dsc_nutrient_${n}_name`);
        const dose = this._num(`input_number.dsc_nutrient_${n}_dose_ml_l`, 0);
        if (!name || dose <= 0) continue;
        const ml = Math.round(dose * L * str * 10) / 10;
        const stock = this._num(`input_number.dsc_nutrient_${n}_stock_ml`, 0);
        const inv = this._st(`input_boolean.dsc_nutrient_${n}_in_inventory`)?.state === "on";
        total += ml;
        lines.push({ n, name, dose, ml, stock, short: inv && stock < ml });
      }
      return { lines, total: Math.round(total * 10) / 10, L, str };
    }

    _fmtRange(v, unit) {
      if (v == null) return null;
      if (Array.isArray(v) && v.length >= 2) return `${v[0]}-${v[1]}${unit || ""}`;
      return `${v}${unit || ""}`;
    }

    _strainTraitMeta(it) {
      if (!it) return [];
      const bits = [];
      if (it.breeder) bits.push(it.breeder);
      if (it.type) bits.push(String(it.type));
      if (it.height_cm != null) bits.push(`ht ${this._fmtRange(it.height_cm, "cm")}`);
      if (it.flowering_days != null) bits.push(`flower ${this._fmtRange(it.flowering_days, "d")}`);
      if (it.has_chemistry && Array.isArray(it.thc_range)) bits.push(`THC ${it.thc_range.join("-")}%`);
      return bits;
    }

    _hitsHtml(kind) {
      if (this._drawerKind !== kind) return "";
      const hits = this._hits[kind] || [];
      const active = this._hitActive[kind] ?? -1;
      const indexCount = this._indexFor(kind).length;
      if (!this._indexStatus.ok && !this._indexStatus.loading) {
        return `<ul class="hits" id="drawer-hits" role="listbox"><li class="empty">Catalog index missing for ${this._esc(INDEX_KEY[kind] || kind)}. Check /local/dsc-catalog/.</li></ul>`;
      }
      if (this._indexStatus.loading && !indexCount) {
        return `<ul class="hits" id="drawer-hits" role="listbox"><li class="empty">Loading catalog...</li></ul>`;
      }
      if (!hits.length) {
        const q = (this._q[kind] || "").trim();
        return `<ul class="hits" id="drawer-hits" role="listbox"><li class="empty">${q ? `No matches for "${this._esc(q)}"` : "Start typing to filter catalog"}</li></ul>`;
      }
      return `<ul class="hits" id="drawer-hits" role="listbox">${hits
        .map((it, i) => {
          const meta = (
            kind === "strain"
              ? this._strainTraitMeta(it)
              : [
                  it.brand || it.breeder,
                  it.wattage_w != null ? `${it.wattage_w} W` : null,
                  it.dose_ml_l != null ? `${it.dose_ml_l} ml/L` : null,
                ]
          )
            .filter(Boolean)
            .join(" | ");
          return `<li role="option" data-kind="${kind}" data-i="${i}" class="${i === active ? "active" : ""}"><div>${this._esc(it.name)}</div>${meta ? `<div class="meta">${this._esc(meta)}</div>` : ""}</li>`;
        })
        .join("")}</ul>`;
    }

    _paintHits(kind) {
      const body = this.shadowRoot?.getElementById("drawer-body");
      if (!body || this._drawerKind !== kind) return;
      const existing = body.querySelector("#drawer-hits");
      if (existing) existing.remove();
      const html = this._hitsHtml(kind);
      if (!html) return;
      body.insertAdjacentHTML("beforeend", html);
      body.querySelectorAll("#drawer-hits li[data-i]").forEach((li) => {
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          const i = Number(li.getAttribute("data-i"));
          this._applyHit(kind, this._hits[kind]?.[i]);
        });
      });
    }

    _paintCatalogChip() {
      const el = this.shadowRoot?.getElementById("catalog-status");
      if (!el) return;
      el.outerHTML = this._catalogChipHtml();
    }

    _catalogChipHtml() {
      if (this._indexStatus.loading) {
        return `<span class="catalog-pill warn" id="catalog-status"><span class="dot"></span>Loading catalogs...</span>`;
      }
      if (!this._indexStatus.ok) {
        const detail = this._indexStatus.errors[0] || "no index items";
        return `<span class="catalog-pill bad" id="catalog-status"><span class="dot"></span>Catalog load failed: ${this._esc(detail)}</span>`;
      }
      const localProducts =
        (this._indexes.mediums?.length || 0) +
        (this._indexes.nutrients?.length || 0) +
        (this._indexes.lights?.length || 0);
      const localStrains = this._indexes.strains?.length || 0;
      const corpusStrains = Number(this._corpus?.strains) || 0;
      // Honesty: do not sum capped local strains and call that "catalog ready".
      if (corpusStrains > 0) {
        const products =
          (Number(this._corpus?.nutrients) || 0) +
          (Number(this._corpus?.mediums) || 0) +
          (Number(this._corpus?.lights) || 0);
        const productBit =
          products > 0
            ? ` · ${products.toLocaleString()} products`
            : localProducts > 0
              ? ` · ${localProducts.toLocaleString()} local products`
              : "";
        return `<span class="catalog-pill" id="catalog-status" title="Strains via cannalib full corpus; local JSON is offline fallback only."><span class="dot"></span>${corpusStrains.toLocaleString()} strains (full corpus)${productBit}</span>`;
      }
      const n = localStrains + localProducts;
      return `<span class="catalog-pill warn" id="catalog-status" title="Cannalib unreachable — showing capped /local/dsc-catalog indexes only."><span class="dot"></span>${n.toLocaleString()} local index items (capped)</span>`;
    }

    _soilHtml(parts, blendValid) {
      if (!parts.length) {
        return `<div class="soil"><div class="soil-pot"><div class="soil-empty">No medium layers yet</div></div></div>`;
      }
      let cursor = 0;
      const layers = parts
        .map((p, i) => {
          const bottom = cursor;
          cursor += p.pct;
          const label = p.pct >= 12 ? `${this._esc(p.name)} ${Math.round(p.pct)}%` : "";
          return `<div class="soil-layer" style="bottom:${bottom}%;height:${p.pct}%;background:${COLORS[i % COLORS.length]}" title="${this._esc(p.name)} ${p.pct}%">${label}</div>`;
        })
        .join("");
      return `<div class="soil"><div class="soil-pot${blendValid ? " is-valid" : ""}">${layers}</div></div>`;
    }

    _resultRow(kind, label, emptyLabel) {
      const has = !!(label && String(label).trim());
      const menuOpen = this._overflowMenu === kind;
      return `
        <div class="result-row" data-result="${kind}">
          <div class="result-chip${has ? "" : " empty"}"><span>${this._esc(has ? label : emptyLabel)}</span></div>
          <button type="button" class="icon-btn" data-open-drawer="${kind}" aria-label="Search ${kind}">${ICO_SEARCH}</button>
          <div class="overflow">
            <button type="button" class="icon-btn" data-overflow="${kind}" aria-label="More ${kind} actions" aria-expanded="${menuOpen ? "true" : "false"}">${ICO_MORE}</button>
            ${menuOpen ? this._overflowMenuHtml(kind) : ""}
          </div>
        </div>`;
    }

    _overflowMenuHtml(kind) {
      if (kind === "medium") {
        const next = this._nextEmptyMediumSlot();
        const active = this._activeMediumSlots();
        return `<div class="overflow-menu" role="menu">
          <button type="button" role="menuitem" data-medium-action="add" ${next ? "" : "disabled"}>Add medium layer</button>
          <button type="button" role="menuitem" data-medium-action="remove" ${active.length ? "" : "disabled"}>Remove layer</button>
          <button type="button" role="menuitem" data-medium-action="change">Change</button>
        </div>`;
      }
      if (kind === "strain") {
        return `<div class="overflow-menu" role="menu">
          <button type="button" role="menuitem" data-overflow-action="change" data-kind="strain">Change</button>
          <button type="button" role="menuitem" data-overflow-action="clear-strain">Clear strain</button>
        </div>`;
      }
      if (kind === "nutrient") {
        return `<div class="overflow-menu" role="menu">
          <button type="button" role="menuitem" data-overflow-action="change" data-kind="nutrient">Add nutrient</button>
        </div>`;
      }
      if (kind === "light") {
        return `<div class="overflow-menu" role="menu">
          <button type="button" role="menuitem" data-overflow-action="change" data-kind="light">Change</button>
        </div>`;
      }
      return "";
    }

    _drawerHtml() {
      const kind = this._drawerKind;
      const open = !!kind;
      const title = kind ? DRAWER_TITLES[kind] : "Search";
      const ph = kind ? DRAWER_PLACEHOLDERS[kind] : "";
      const q = kind ? this._q[kind] || "" : "";
      const sid = kind ? SEARCH_IDS[kind] : "q-drawer";
      return `
        <div class="drawer${open ? " is-open" : ""}" aria-hidden="${open ? "false" : "true"}">
          <div class="drawer-scrim" id="drawer-scrim"></div>
          <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="${this._esc(title)}">
            <button type="button" class="drawer-rail" id="drawer-rail" aria-label="Close panel">&gt;</button>
            <div class="drawer-head">
              <h2>${this._esc(title)}</h2>
              <button type="button" class="icon-btn" id="drawer-close" aria-label="Close">X</button>
            </div>
            <div class="drawer-body" id="drawer-body">
              ${open ? `
                <label for="${sid}">Filter catalog</label>
                <input type="text" id="${sid}" autocomplete="off" spellcheck="false" value="${this._esc(q)}" placeholder="${this._esc(ph)}" aria-autocomplete="list" />
                ${this._hitsHtml(kind)}
              ` : ""}
            </div>
          </aside>
        </div>`;
    }

    _esc(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    _render() {
      if (!this.shadowRoot) return;
      const cfg = this._config;
      const parts = this._blendParts();
      const sumPct = parts.reduce((a, p) => a + p.pct, 0);
      const totalL = this._num("input_number.dsc_blend_total_l", 20);
      const mix = this._mixLines();
      const blendValid = Math.round(sumPct) === 100;
      const roster = this._str("sensor.dsc_plant_roster_summary") || "-";
      const mixState = this._str("sensor.dsc_mix_calculator") || `${mix.total} ml total`;
      const shortStock = this._st("sensor.dsc_mix_calculator")?.attributes?.short_stock_any === true
        || mix.lines.some((line) => line.short);
      const lightName = this._str("sensor.dsc_light_active_summary") || this._str("input_select.dsc_light_fixture");
      const ppfd = this._selectedLight?.ppfd_url || this._str("sensor.dsc_light_ppfd_map");
      const spectrum = this._str("sensor.dsc_light_spectrum_map");
      const watts = this._str("sensor.dsc_light_wattage_w");
      const ppf = this._str("sensor.dsc_light_ppf_umol_s");
      const ppe = this._str("sensor.dsc_light_ppe_umol_j");
      const strainName = this._str("input_text.dsc_build_strain") || this._selectedStrain?.name || "";
      const strainHit = this._selectedStrain;
      const chemistry = strainHit?.has_chemistry
        ? [
            Array.isArray(strainHit.thc_range) ? `THC ${strainHit.thc_range.join("-")}%` : null,
            Array.isArray(strainHit.top_terpenes) && strainHit.top_terpenes.length
              ? strainHit.top_terpenes.join(", ")
              : null,
          ].filter(Boolean).join(" | ")
        : "";
      const heightChip =
        strainHit?.height_cm != null
          ? `Height: ${this._fmtRange(strainHit.height_cm, " cm")}`
          : "";
      const flowerChip =
        strainHit?.flowering_days != null
          ? `Flower: ${this._fmtRange(strainHit.flowering_days, " d")}`
          : "";
      const strainChips = [
        chemistry ? `<span class="chip">Chemistry: ${this._esc(chemistry)}</span>` : "",
        heightChip ? `<span class="chip">${this._esc(heightChip)}</span>` : "",
        flowerChip ? `<span class="chip">${this._esc(flowerChip)}</span>` : "",
        strainHit && !chemistry && !heightChip && !flowerChip
          ? `<span class="chip miss">No densified traits in catalog for this pick</span>`
          : "",
      ]
        .filter(Boolean)
        .join("");
      const assignPot = this._str("input_select.dsc_build_assign_pot");
      const livePot = ["1", "2", "3", "4"].includes(assignPot)
        ? {
            n: assignPot,
            plant: this._str(`text.dsc_pot${assignPot}_plant_name`),
            strain: this._str(`sensor.dsc_pot${assignPot}_strain_display`),
            need: this._str(`sensor.dsc_pot${assignPot}_need_summary`),
            days: this._str(`sensor.dsc_pot${assignPot}_days_since_sprout`),
            ph: this._str(`sensor.dsc_pot${assignPot}_got_ph`),
            ec: this._str(`sensor.dsc_pot${assignPot}_got_ec`),
            moisture: this._str(`sensor.dsc_pot${assignPot}_got_moisture`),
          }
        : null;
      const hasCommitAssign = !!this._st("script.dsc_build_plant_commit_and_assign");
      const activeMedium = this._activeMediumSlots();
      const nutrientSummary = mix.lines.length
        ? mix.lines.map((l) => l.name).slice(0, 3).join(", ") + (mix.lines.length > 3 ? ` +${mix.lines.length - 3}` : "")
        : "";

      const focus = this._focusRestore;
      const drawerKind = this._drawerKind;

      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <div class="wrap">
          <div class="hero">
            <div>
              <p class="brand">Digital Stealth Care / DSC-HUB</p>
              <h1>${this._esc(cfg.title)}</h1>
              <p class="sub">${this._esc(cfg.subtitle)} - then commit to inventory. Metric only - no invented PPFD grids or feed rates.</p>
            </div>
            <div>${this._catalogChipHtml()}</div>
          </div>
          ${this._notice ? `<p class="muted">${this._esc(this._notice)}</p>` : ""}

          <div class="flow">
            <div class="flow-col">
              <section class="glass">
                <h2><span class="h2-left">Identity</span></h2>
                <label>Strain</label>
                ${this._resultRow("strain", strainName, "No strain selected")}
                <div class="row">
                  <div>
                    <label>Nickname</label>
                    <input type="text" id="build-nick" value="${this._esc(this._str("input_text.dsc_build_nickname"))}" />
                  </div>
                  <div>
                    <label>Sprout date</label>
                    <input type="date" id="build-sprout" value="${this._esc((this._str("input_datetime.dsc_build_sprout_date") || "").slice(0, 10))}" />
                  </div>
                </div>
                <div class="row">
                  <div>
                    <label>Recipe note</label>
                    <input type="text" id="recipe-note" value="${this._esc(this._str("input_text.dsc_build_recipe_note"))}" />
                  </div>
                  <div>
                    <label>Custom strain slot</label>
                    <select id="custom-slot">
                      ${["auto", "1", "2", "3", "4", "5"]
                        .map((o) => `<option value="${o}" ${this._str("input_select.dsc_build_custom_slot") === o ? "selected" : ""}>${o}</option>`)
                        .join("")}
                    </select>
                  </div>
                </div>
                <input type="hidden" id="build-strain" value="${this._esc(strainName)}" />
                ${strainChips ? `<div class="chips">${strainChips}</div>` : ""}
              </section>
            </div>

            <div class="connector" aria-hidden="true"></div>

            <div class="flow-col mid">
              <section class="glass${blendValid ? " valid-glow" : ""}">
                <h2>
                  <span class="h2-left">Medium</span>
                </h2>
                <label>Blend</label>
                ${this._resultRow(
                  "medium",
                  parts.length ? parts.map((p) => `${p.name} ${Math.round(p.pct)}%`).join(" / ") : "",
                  "No medium layers yet"
                )}
                ${this._soilHtml(parts, blendValid)}
                ${activeMedium
                  .map(
                    (slot) => `
                  <div class="layer-block">
                    <div class="row">
                      <div style="flex:2">
                        <label>Layer ${slot.n}</label>
                        <input type="text" data-blend-name="${slot.n}" value="${this._esc(slot.name)}" />
                      </div>
                      <div>
                        <label>% / ${slot.pct}%</label>
                        <input type="range" min="0" max="100" data-blend-pct="${slot.n}" value="${slot.pct}" />
                      </div>
                    </div>
                  </div>`
                  )
                  .join("")}
                <div class="row">
                  <div>
                    <label>Total bag volume (L)</label>
                    <input type="number" id="blend-l" step="0.5" min="1" value="${totalL}" />
                  </div>
                </div>
                <div class="chips">
                  <span class="chip ${blendValid ? "ok" : "bad"}">${Math.round(sumPct)}% ${blendValid ? "valid" : "must sum 100"}</span>
                  ${parts
                    .map((p) => `<span class="chip teal">${this._esc(p.name)} / ${((p.pct / 100) * totalL).toFixed(1)} L</span>`)
                    .join("")}
                </div>
              </section>
            </div>

            <div class="connector" aria-hidden="true"></div>

            <div class="flow-col">
              <section class="glass">
                <h2><span class="h2-left">Nutrition</span></h2>
                <label>Bottles</label>
                ${this._resultRow("nutrient", nutrientSummary, "No doses yet")}
                <div class="row">
                  <div>
                    <label>Tank (L)</label>
                    <input type="number" id="tank-l" step="0.5" min="1" value="${mix.L}" />
                  </div>
                  <div>
                    <label>Strength (%)</label>
                    <input type="number" id="strength" step="5" min="10" max="100" value="${mix.str * 100}" />
                  </div>
                </div>
                <table>
                  <thead><tr><th>Bottle</th><th>ml/L</th><th>ml for tank</th><th>stock</th></tr></thead>
                  <tbody>
                    ${mix.lines
                      .map(
                        (l) => `<tr>
                      <td>${this._esc(l.name)}</td>
                      <td><input type="number" step="0.1" min="0" max="20" data-dose="${l.n}" value="${l.dose}" style="width:72px" /></td>
                      <td>${l.ml} ml</td>
                      <td>${l.stock} ml</td>
                    </tr>`
                      )
                      .join("") || `<tr><td colspan="4" class="muted">No doses yet - search and add bottles.</td></tr>`}
                  </tbody>
                </table>
                <div class="chips">
                  <span class="chip">${this._esc(mixState)}</span>
                  <span class="chip">${mix.total} ml total</span>
                  ${shortStock ? `<span class="chip bad">SHORT STOCK</span>` : ""}
                </div>
                <div class="actions">
                  <button type="button" id="btn-accept">Accept mix (burn stock)</button>
                </div>
                <p class="muted">Accept uses script.dsc_accept_mix - QA gate, no pumps.</p>
              </section>

              <section class="glass">
                <h2><span class="h2-left">Light</span></h2>
                <label>Fixture</label>
                ${this._resultRow("light", lightName, "No fixture selected")}
                <div class="chips">
                  ${watts && watts !== "unknown" ? `<span class="chip">${this._esc(watts)} W</span>` : ""}
                  ${ppf && ppf !== "unknown" ? `<span class="chip">${this._esc(ppf)} umol/s</span>` : ""}
                  ${ppe && ppe !== "unknown" ? `<span class="chip">${this._esc(ppe)} umol/J</span>` : ""}
                  ${ppfd && ppfd !== "unknown" ? `<span class="chip"><a href="${this._esc(ppfd)}" target="_blank" rel="noopener" style="color:inherit">PPFD map</a></span>` : `<span class="chip warn">No PPFD map URL</span>`}
                  ${this._selectedLight?.has_ppfd ? `<span class="chip">PPFD data available</span>` : ""}
                  ${spectrum && spectrum !== "unknown" ? `<span class="chip"><a href="${this._esc(spectrum)}" target="_blank" rel="noopener" style="color:inherit">Spectrum</a></span>` : ""}
                </div>
              </section>

              <section class="glass">
                <h2><span class="h2-left">Climate Want</span></h2>
                <p class="muted">Applies custom-slot temp/RH only when set (!= 0). Catalog strains have no invented climate bands.</p>
                <div class="row">
                  <div>
                    <label>Apply for pot</label>
                    <select id="climate-pot">
                      ${["Fleet", "1", "2", "3", "4"]
                        .map((o) => `<option value="${o}" ${this._str("input_select.dsc_build_climate_pot") === o ? "selected" : ""}>${o}</option>`)
                        .join("")}
                    </select>
                  </div>
                </div>
                <div class="actions">
                  <button type="button" class="primary" id="btn-climate">Apply climate Want</button>
                </div>
              </section>
            </div>

            <div class="connector" aria-hidden="true"></div>

            <div class="flow-col">
              <section class="glass">
                <h2><span class="h2-left">Commit</span></h2>
                <div class="row">
                  <div>
                    <label>Assign pot</label>
                    <select id="assign-pot">
                      ${["none", "1", "2", "3", "4"]
                        .map((o) => `<option value="${o}" ${this._str("input_select.dsc_build_assign_pot") === o ? "selected" : ""}>${o}</option>`)
                        .join("")}
                    </select>
                  </div>
                </div>
                <div class="actions">
                  <button type="button" class="primary" id="btn-commit">Add to inventory</button>
                  <button type="button" id="btn-assign">Assign to pot now</button>
                  ${hasCommitAssign ? `<button type="button" class="teal primary" id="btn-commit-assign">Commit + assign</button>` : ""}
                </div>
                ${livePot ? `
                  <div class="chips">
                    <span class="chip">POT${livePot.n}</span>
                    <span class="chip">${this._esc(livePot.plant || "No plant name")}</span>
                    <span class="chip">${this._esc(livePot.strain || "No strain")}</span>
                    <span class="chip">Day ${this._esc(livePot.days || "-")}</span>
                    <span class="chip">pH ${this._esc(livePot.ph || "-")}</span>
                    <span class="chip">EC ${this._esc(livePot.ec || "-")}</span>
                    <span class="chip">Moisture ${this._esc(livePot.moisture || "-")}</span>
                    <span class="chip ${livePot.need && livePot.need !== "OK" ? "warn" : ""}">${this._esc(livePot.need || "Need unavailable")}</span>
                  </div>` : ""}
                <p class="muted" style="margin-top:10px">Roster: ${this._esc(roster)}</p>
                <div class="roster" id="roster-list"></div>
              </section>
            </div>
          </div>

          ${this._drawerHtml()}
        </div>
      `;

      this._wire();
      this._fillRoster();
      if (drawerKind) {
        this._drawerKind = drawerKind;
        this._wireDrawerHits(drawerKind);
      }
      if (focus) {
        const inp = this.shadowRoot.getElementById(focus.id);
        if (inp) {
          inp.focus();
          try {
            const pos = typeof focus.pos === "number" ? focus.pos : inp.value.length;
            inp.setSelectionRange(pos, pos);
          } catch (_) { /* date/number inputs */ }
        }
        this._focusRestore = null;
      }
    }

    _wireDrawerHits(kind) {
      const root = this.shadowRoot;
      root?.querySelectorAll("#drawer-hits li[data-i]").forEach((li) => {
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          const i = Number(li.getAttribute("data-i"));
          this._applyHit(kind, this._hits[kind]?.[i]);
        });
      });
    }

    _fillRoster() {
      const el = this.shadowRoot?.getElementById("roster-list");
      if (!el) return;
      const slots = this._st("sensor.dsc_plant_roster_summary")?.attributes?.slots || [];
      if (!Array.isArray(slots) || !slots.length) {
        el.innerHTML = `<div class="muted">No plants in roster yet.</div>`;
        return;
      }
      el.innerHTML = slots
        .map((s) => `<div>#${s.slot} ${this._esc(s.nickname || s.strain || "-")} / ${this._esc(s.status)} / pot ${this._esc(s.pot)}</div>`)
        .join("");
    }

    _bindSearch(kind) {
      const root = this.shadowRoot;
      const id = SEARCH_IDS[kind];
      const inp = root.getElementById(id);
      if (!inp) return;

      inp.addEventListener("input", (e) => {
        this._focusRestore = { id, pos: e.target.selectionStart };
        this._search(kind, e.target.value, { open: true });
      });
      inp.addEventListener("keydown", (e) => {
        const hits = this._hits[kind] || [];
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (!this._drawerKind) this._openSearch(kind);
          if (!hits.length) return;
          this._hitActive[kind] = Math.min((this._hitActive[kind] ?? -1) + 1, hits.length - 1);
          this._paintHits(kind);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (!hits.length) return;
          this._hitActive[kind] = Math.max((this._hitActive[kind] ?? 0) - 1, 0);
          this._paintHits(kind);
        } else if (e.key === "Enter") {
          if (this._drawerKind === kind && hits.length) {
            e.preventDefault();
            const i = this._hitActive[kind] >= 0 ? this._hitActive[kind] : 0;
            this._applyHit(kind, hits[i]);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          this._closeSearch(kind);
        }
      });
    }

    _wire() {
      const root = this.shadowRoot;
      if (!root) return;

      if (this._drawerKind) this._bindSearch(this._drawerKind);

      root.querySelectorAll("[data-open-drawer]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const kind = btn.getAttribute("data-open-drawer");
          if (kind) this._openSearch(kind);
        });
      });

      root.querySelectorAll("[data-overflow]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const kind = btn.getAttribute("data-overflow");
          this._overflowMenu = this._overflowMenu === kind ? null : kind;
          this._render();
        });
      });

      root.querySelectorAll("[data-medium-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-medium-action");
          this._overflowMenu = null;
          if (action === "add") {
            const next = this._nextEmptyMediumSlot();
            if (!next) return;
            this._mediumSlot = next;
            this._openSearch("medium");
            return;
          }
          if (action === "remove") {
            const active = this._activeMediumSlots();
            const last = active[active.length - 1];
            if (!last) return;
            this._clearMediumSlot(last.n);
            this._render();
            return;
          }
          if (action === "change") {
            const active = this._activeMediumSlots();
            this._mediumSlot = active.length ? active[active.length - 1].n : this._nextEmptyMediumSlot() || 1;
            this._openSearch("medium");
          }
        });
      });

      root.querySelectorAll("[data-overflow-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-overflow-action");
          const kind = btn.getAttribute("data-kind");
          this._overflowMenu = null;
          if (action === "change" && kind) {
            this._openSearch(kind);
            return;
          }
          if (action === "clear-strain") {
            this._selectedStrain = null;
            this._setText("input_text.dsc_build_strain", "");
            this._q.strain = "";
            this._render();
          }
        });
      });

      root.getElementById("drawer-scrim")?.addEventListener("click", () => this._closeDrawer());
      root.getElementById("drawer-rail")?.addEventListener("click", () => this._closeDrawer());
      root.getElementById("drawer-close")?.addEventListener("click", () => this._closeDrawer());

      root.getElementById("build-strain")?.addEventListener("change", (e) => this._setText("input_text.dsc_build_strain", e.target.value));
      root.getElementById("build-nick")?.addEventListener("change", (e) => this._setText("input_text.dsc_build_nickname", e.target.value));
      root.getElementById("build-sprout")?.addEventListener("change", (e) => this._setDate("input_datetime.dsc_build_sprout_date", e.target.value));
      root.getElementById("recipe-note")?.addEventListener("change", (e) => this._setText("input_text.dsc_build_recipe_note", e.target.value));
      root.getElementById("custom-slot")?.addEventListener("change", (e) => this._setSelect("input_select.dsc_build_custom_slot", e.target.value));

      root.querySelectorAll("[data-blend-name]").forEach((inp) => {
        inp.addEventListener("change", (e) => {
          const n = e.target.getAttribute("data-blend-name");
          this._setText(`input_text.dsc_blend_component_${n}_name`, e.target.value);
        });
      });
      root.querySelectorAll("[data-blend-pct]").forEach((inp) => {
        inp.addEventListener("change", (e) => {
          const n = e.target.getAttribute("data-blend-pct");
          this._setNumber(`input_number.dsc_blend_pct_${n}`, Number(e.target.value));
        });
      });
      root.getElementById("blend-l")?.addEventListener("change", (e) => this._setNumber("input_number.dsc_blend_total_l", Number(e.target.value)));
      root.getElementById("tank-l")?.addEventListener("change", (e) => this._setNumber("input_number.dsc_mix_tank_liters", Number(e.target.value)));
      root.getElementById("strength")?.addEventListener("change", (e) => this._setNumber("input_number.dsc_mix_strength_pct", Number(e.target.value)));
      root.querySelectorAll("[data-dose]").forEach((inp) => {
        inp.addEventListener("change", (e) => {
          const n = e.target.getAttribute("data-dose");
          this._setNumber(`input_number.dsc_nutrient_${n}_dose_ml_l`, Number(e.target.value));
        });
      });

      root.getElementById("climate-pot")?.addEventListener("change", (e) => this._setSelect("input_select.dsc_build_climate_pot", e.target.value));
      root.getElementById("assign-pot")?.addEventListener("change", (e) => this._setSelect("input_select.dsc_build_assign_pot", e.target.value));

      root.getElementById("btn-accept")?.addEventListener("click", () => this._call("script", "turn_on", {}, { entity_id: "script.dsc_accept_mix" }));
      root.getElementById("btn-climate")?.addEventListener("click", () => this._call("script", "turn_on", {}, { entity_id: "script.dsc_apply_climate_want" }));
      root.getElementById("btn-commit")?.addEventListener("click", () => this._call("script", "turn_on", {}, { entity_id: "script.dsc_build_plant_commit" }));
      root.getElementById("btn-commit-assign")?.addEventListener("click", () => this._call("script", "turn_on", {}, { entity_id: "script.dsc_build_plant_commit_and_assign" }));
      root.getElementById("btn-assign")?.addEventListener("click", () => {
        const pot = this._str("input_select.dsc_build_assign_pot");
        if (!pot || pot === "none") return;
        this._call("script", "turn_on", {
          entity_id: "script.dsc_plant_assign_to_pot",
          variables: { pot },
        });
      });
    }
  }

  // Lovlace may already have registered a stale class from DSC-HUB.js.
  // Upgrade the live prototype so Compose picks up corpus-honest chip/search.
  const existing = customElements.get(CARD_TYPE);
  if (existing) {
    const proto = existing.prototype;
    proto._loadIndexes = DscBuildPlantCard.prototype._loadIndexes;
    proto._loadCorpusCounts = DscBuildPlantCard.prototype._loadCorpusCounts;
    proto._catalogChipHtml = DscBuildPlantCard.prototype._catalogChipHtml;
    proto._cannalibBase = DscBuildPlantCard.prototype._cannalibBase;
    proto._cannalibHeaders = DscBuildPlantCard.prototype._cannalibHeaders;
    proto._apiSearch = DscBuildPlantCard.prototype._apiSearch;
  } else {
    customElements.define(CARD_TYPE, DscBuildPlantCard);
  }

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC Build a Plant",
    description: "Separate Build a Plant composition (strain, soil %, nutrients, light, climate).",
  });
})();
