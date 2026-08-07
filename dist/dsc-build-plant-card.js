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

  const DEFAULTS = () => ({
    type: `custom:${CARD_TYPE}`,
    title: "Build a Plant",
    subtitle: "Compose strain / medium / nutrition / light / climate",
  });

  const css = `
    :host { display:block; font-family: "Segoe UI", "IBM Plex Sans", system-ui, sans-serif; color:#e8efe9; }
    .wrap {
      background: linear-gradient(165deg, #121a16 0%, #0c1210 48%, #10161c 100%);
      border: 1px solid rgba(120,160,130,.18);
      min-height: 92vh; padding: 20px 22px 36px; box-sizing: border-box;
    }
    .hero { margin-bottom: 18px; }
    .brand { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color:#7fa88a; margin:0 0 6px; }
    h1 { margin:0; font-size: 28px; font-weight: 650; letter-spacing: .02em; color:#f2f7f3; }
    .sub { margin: 6px 0 0; color:#9aada0; font-size: 14px; max-width: 52ch; }
    .grid { display:grid; gap:14px; }
    @media (min-width: 980px) { .grid { grid-template-columns: 1.15fr .85fr; } }
    section {
      background: rgba(18,28,22,.55); border: 1px solid rgba(120,160,130,.14);
      border-radius: 4px; padding: 14px 14px 12px;
    }
    section h2 {
      margin:0 0 10px; font-size: 13px; letter-spacing: .14em; text-transform: uppercase;
      color:#8fb89a; display:flex; align-items:center; gap:8px;
    }
    section h2 ha-icon, section h2 .ico { --mdc-icon-size:18px; width:18px; height:18px; opacity:.9; }
    label { display:block; font-size:11px; color:#8a9c90; margin: 8px 0 4px; letter-spacing:.04em; }
    input[type=text], input[type=date], input[type=number], select {
      width:100%; box-sizing:border-box; background:#0b110e; color:#e8efe9;
      border:1px solid rgba(120,160,130,.28); border-radius:3px; padding:8px 10px; font-size:14px;
    }
    input[type=range] { width:100%; accent-color:#5b9f6b; }
    .row { display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end; }
    .row > * { flex:1; min-width:120px; }
    .bar {
      display:flex; height:18px; border-radius:3px; overflow:hidden; background:#0b110e;
      border:1px solid rgba(120,160,130,.2); margin-top:8px;
    }
    .bar span { display:block; height:100%; }
    .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .chip {
      font-size:11px; padding:3px 8px; border-radius:2px;
      background:rgba(91,159,107,.15); border:1px solid rgba(91,159,107,.35); color:#cfe8d5;
    }
    .chip.warn { background:rgba(196,163,90,.12); border-color:rgba(196,163,90,.4); color:#e8d7a8; }
    .chip.bad { background:rgba(180,70,70,.12); border-color:rgba(180,70,70,.4); color:#f0b4b4; }
    .search-box { position:relative; }
    .hits {
      position:absolute; z-index:20; left:0; right:0; top:calc(100% + 2px); max-height:260px; overflow:auto;
      background:#0e1612; border:1px solid rgba(120,160,130,.45); margin:0; padding:0; list-style:none;
      box-shadow: 0 10px 28px rgba(0,0,0,.45);
    }
    .hits li { padding:8px 10px; cursor:pointer; border-bottom:1px solid rgba(120,160,130,.12); font-size:13px; }
    .hits li:hover, .hits li.active { background:rgba(91,159,107,.22); }
    .hits .meta { color:#8a9c90; font-size:11px; margin-top:2px; }
    .hits .empty { padding:10px; color:#8a9c90; font-size:12px; cursor:default; }
    .hits .empty:hover { background:transparent; }
    table { width:100%; border-collapse:collapse; font-size:13px; margin-top:8px; }
    th, td { text-align:left; padding:6px 4px; border-bottom:1px solid rgba(120,160,130,.12); }
    th { color:#8a9c90; font-weight:500; font-size:11px; letter-spacing:.06em; text-transform:uppercase; }
    .actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    button {
      background:#1a2a20; color:#e8efe9; border:1px solid rgba(120,160,130,.35);
      border-radius:3px; padding:9px 12px; cursor:pointer; font-size:13px;
    }
    button.primary { background:#2a4a34; border-color:#5b9f6b; }
    button:hover { filter:brightness(1.08); }
    button:disabled { opacity:.45; cursor:not-allowed; }
    .muted { color:#8a9c90; font-size:12px; }
    .roster { font-size:12px; }
    .roster div { padding:4px 0; border-bottom:1px solid rgba(120,160,130,.1); }
  `;

  class DscBuildPlantCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = DEFAULTS();
      this._hass = null;
      this._indexes = { strains: [], nutrients: [], mediums: [], lights: [] };
      this._indexStatus = { loading: false, ok: false, errors: [] };
      this._q = { strain: "", nutrient: "", medium: "", light: "" };
      this._hits = { strain: [], nutrient: [], medium: [], light: [] };
      this._hitActive = { strain: -1, nutrient: -1, medium: -1, light: -1 };
      this._openKind = null;
      this._loaded = false;
      this._mediumSlot = 1;
      this._focusRestore = null;
      this._selectedStrain = null;
      this._selectedLight = null;
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
      // Avoid wiping an open typeahead / focused search on every HA state tick.
      if (this._openKind || this._isSearchFocused()) return;
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
      const kinds = [
        ["strains", "dsc_strains_search_index.json"],
        ["nutrients", "dsc_nutrients_search_index.json"],
        ["mediums", "dsc_mediums_search_index.json"],
        ["lights", "dsc_lights_search_index.json"],
      ];
      await Promise.all(
        kinds.map(async ([key, file]) => {
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
        })
      );
      const total = Object.values(this._indexes).reduce((n, a) => n + (a?.length || 0), 0);
      this._indexStatus.loading = false;
      this._indexStatus.ok = total > 0;
      if (!this._openKind) this._render();
      else this._paintCatalogChip();
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
      this._hits[kind] = this._filterItems(kind, q);
      this._hitActive[kind] = this._hits[kind].length ? 0 : -1;
      this._openKind = open ? kind : null;
      this._paintHits(kind);
    }

    _openSearch(kind) {
      this._openKind = kind;
      this._hits[kind] = this._filterItems(kind, this._q[kind] || "");
      this._hitActive[kind] = this._hits[kind].length ? 0 : -1;
      this._paintHits(kind);
    }

    _closeSearch(kind) {
      if (kind && this._openKind !== kind) return;
      this._openKind = null;
      if (kind) {
        this._hits[kind] = [];
        this._hitActive[kind] = -1;
        this._paintHits(kind);
      }
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
      this._openKind = null;
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
      } else {
        const slot = this._mediumSlot || 1;
        this._setText(`input_text.dsc_blend_component_${slot}_name`, item.name);
      }
      this._q.medium = "";
      this._hits.medium = [];
      this._hitActive.medium = -1;
      this._openKind = null;
      this._render();
    }

    async _addNutrient(item) {
      for (let n = 1; n <= 8; n++) {
        const name = this._str(`input_text.dsc_nutrient_${n}_name`);
        const inv = this._st(`input_boolean.dsc_nutrient_${n}_in_inventory`)?.state === "on";
        if (!name || !inv) {
          this._setText(`input_text.dsc_nutrient_${n}_name`, item.name);
          if (item.dose_ml_l != null && Number.isFinite(Number(item.dose_ml_l))) {
            this._setNumber(`input_number.dsc_nutrient_${n}_dose_ml_l`, Number(item.dose_ml_l));
          }
          this._call("input_boolean", "turn_on", {}, { entity_id: `input_boolean.dsc_nutrient_${n}_in_inventory` });
          break;
        }
      }
      this._q.nutrient = "";
      this._hits.nutrient = [];
      this._hitActive.nutrient = -1;
      this._openKind = null;
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
      this._openKind = null;
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

    _hitsHtml(kind) {
      if (this._openKind !== kind) return "";
      const hits = this._hits[kind] || [];
      const active = this._hitActive[kind] ?? -1;
      const indexCount = this._indexFor(kind).length;
      if (!this._indexStatus.ok && !this._indexStatus.loading) {
        return `<ul class="hits" role="listbox"><li class="empty">Catalog index missing for ${this._esc(INDEX_KEY[kind] || kind)}. Check /local/dsc-catalog/.</li></ul>`;
      }
      if (this._indexStatus.loading && !indexCount) {
        return `<ul class="hits" role="listbox"><li class="empty">Loading catalog...</li></ul>`;
      }
      if (!hits.length) {
        const q = (this._q[kind] || "").trim();
        return `<ul class="hits" role="listbox"><li class="empty">${q ? `No matches for "${this._esc(q)}"` : "Start typing to filter catalog"}</li></ul>`;
      }
      return `<ul class="hits" role="listbox">${hits
        .map((it, i) => {
          const meta = [it.brand || it.breeder, it.wattage_w != null ? `${it.wattage_w} W` : null, it.dose_ml_l != null ? `${it.dose_ml_l} ml/L` : null]
            .filter(Boolean)
            .join(" | ");
          return `<li role="option" data-kind="${kind}" data-i="${i}" class="${i === active ? "active" : ""}"><div>${this._esc(it.name)}</div>${meta ? `<div class="meta">${this._esc(meta)}</div>` : ""}</li>`;
        })
        .join("")}</ul>`;
    }

    _paintHits(kind) {
      const box = this.shadowRoot?.querySelector(`#${SEARCH_IDS[kind]}`)?.closest(".search-box");
      if (!box) return;
      const existing = box.querySelector(".hits");
      if (existing) existing.remove();
      const html = this._hitsHtml(kind);
      if (!html) return;
      box.insertAdjacentHTML("beforeend", html);
      box.querySelectorAll(".hits li[data-i]").forEach((li) => {
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
        return `<span class="chip warn" id="catalog-status">Loading catalogs...</span>`;
      }
      if (!this._indexStatus.ok) {
        const detail = this._indexStatus.errors[0] || "no index items";
        return `<span class="chip bad" id="catalog-status">Catalog load failed: ${this._esc(detail)}</span>`;
      }
      const n =
        (this._indexes.strains?.length || 0) +
        (this._indexes.mediums?.length || 0) +
        (this._indexes.nutrients?.length || 0) +
        (this._indexes.lights?.length || 0);
      return `<span class="chip" id="catalog-status">${n} catalog items ready</span>`;
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
      const strainHit = this._selectedStrain;
      const chemistry = strainHit?.has_chemistry
        ? [
            Array.isArray(strainHit.thc_range) ? `THC ${strainHit.thc_range.join("-")}%` : null,
            Array.isArray(strainHit.top_terpenes) && strainHit.top_terpenes.length
              ? strainHit.top_terpenes.join(", ")
              : null,
          ].filter(Boolean).join(" | ")
        : "";
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

      const barHtml = parts.length
        ? parts
            .map((p, i) => `<span style="width:${p.pct}%;background:${COLORS[i % COLORS.length]}" title="${this._esc(p.name)}"></span>`)
            .join("")
        : "";

      const focus = this._focusRestore;
      const openKind = this._openKind;

      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <div class="wrap">
          <div class="hero">
            <p class="brand">Digital Stealth Care / DSC-HUB</p>
            <h1>${this._esc(cfg.title)}</h1>
            <p class="sub">${this._esc(cfg.subtitle)} - then commit to inventory. Metric only - no invented PPFD grids or feed rates.</p>
            <div class="chips" style="margin-top:8px">${this._catalogChipHtml()}</div>
          </div>
          <div class="grid">
            <div class="stack">
              <section>
                <h2>Identity</h2>
                <label>Strain search</label>
                <div class="search-box">
                  <input type="text" id="q-strain" autocomplete="off" spellcheck="false" value="${this._esc(this._q.strain)}" placeholder="Type a strain name..." aria-autocomplete="list" />
                </div>
                <div class="row">
                  <div>
                    <label>Selected strain</label>
                    <input type="text" id="build-strain" value="${this._esc(this._str("input_text.dsc_build_strain"))}" />
                  </div>
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
                ${chemistry ? `<div class="chips"><span class="chip">Chemistry: ${this._esc(chemistry)}</span></div>` : ""}
              </section>

              <section>
                <h2>Medium / % blend</h2>
                <label>Search substrate (fills slot below)</label>
                <div class="row">
                  <div style="flex:2" class="search-box">
                    <input type="text" id="q-medium" autocomplete="off" spellcheck="false" value="${this._esc(this._q.medium)}" placeholder="Coco, perlite, LECA..." aria-autocomplete="list" />
                  </div>
                  <div>
                    <label>Target slot</label>
                    <select id="medium-slot">
                      <option value="1" ${this._mediumSlot === 1 ? "selected" : ""}>1</option>
                      <option value="2" ${this._mediumSlot === 2 ? "selected" : ""}>2</option>
                      <option value="3" ${this._mediumSlot === 3 ? "selected" : ""}>3</option>
                    </select>
                  </div>
                </div>
                ${[1, 2, 3]
                  .map(
                    (n) => `
                  <div class="row">
                    <div style="flex:2">
                      <label>Component ${n}</label>
                      <input type="text" data-blend-name="${n}" value="${this._esc(this._str(`input_text.dsc_blend_component_${n}_name`))}" />
                    </div>
                    <div>
                      <label>% / ${this._num(`input_number.dsc_blend_pct_${n}`, 0)}%</label>
                      <input type="range" min="0" max="100" data-blend-pct="${n}" value="${this._num(`input_number.dsc_blend_pct_${n}`, 0)}" />
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
                <div class="bar">${barHtml}</div>
                <div class="chips">
                  <span class="chip ${blendValid ? "" : "bad"}">${Math.round(sumPct)}% ${blendValid ? "valid" : "must sum 100"}</span>
                  ${parts
                    .map((p) => `<span class="chip">${this._esc(p.name)} / ${((p.pct / 100) * totalL).toFixed(1)} L</span>`)
                    .join("")}
                </div>
              </section>

              <section>
                <h2>Nutrition / ml / L</h2>
                <label>Search nutrients - add to inventory</label>
                <div class="search-box">
                  <input type="text" id="q-nutrient" autocomplete="off" spellcheck="false" value="${this._esc(this._q.nutrient)}" placeholder="CANNA Coco A..." aria-autocomplete="list" />
                </div>
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
            </div>

            <div class="stack">
              <section>
                <h2>Light</h2>
                <label>Search fixtures</label>
                <div class="search-box">
                  <input type="text" id="q-light" autocomplete="off" spellcheck="false" value="${this._esc(this._q.light)}" placeholder="Spider Farmer SF1000..." aria-autocomplete="list" />
                </div>
                <p style="margin:8px 0 4px;font-size:14px">${this._esc(lightName || "No fixture selected")}</p>
                <div class="chips">
                  ${watts && watts !== "unknown" ? `<span class="chip">${this._esc(watts)} W</span>` : ""}
                  ${ppf && ppf !== "unknown" ? `<span class="chip">${this._esc(ppf)} umol/s</span>` : ""}
                  ${ppe && ppe !== "unknown" ? `<span class="chip">${this._esc(ppe)} umol/J</span>` : ""}
                  ${ppfd && ppfd !== "unknown" ? `<span class="chip"><a href="${this._esc(ppfd)}" target="_blank" rel="noopener" style="color:inherit">PPFD map</a></span>` : `<span class="chip warn">No PPFD map URL</span>`}
                  ${this._selectedLight?.has_ppfd ? `<span class="chip">PPFD data available</span>` : ""}
                  ${spectrum && spectrum !== "unknown" ? `<span class="chip"><a href="${this._esc(spectrum)}" target="_blank" rel="noopener" style="color:inherit">Spectrum</a></span>` : ""}
                </div>
              </section>

              <section>
                <h2>Climate Want</h2>
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

              <section>
                <h2>Commit</h2>
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
                  ${hasCommitAssign ? `<button type="button" class="primary" id="btn-commit-assign">Commit + assign</button>` : ""}
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
        </div>
      `;

      this._wire();
      this._fillRoster();
      if (openKind) {
        this._openKind = openKind;
        this._paintHits(openKind);
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
      inp.addEventListener("focus", () => this._openSearch(kind));
      inp.addEventListener("blur", () => {
        // Delay so mousedown on a hit can fire first.
        setTimeout(() => {
          if (this.shadowRoot?.activeElement?.id === id) return;
          this._closeSearch(kind);
        }, 120);
      });
      inp.addEventListener("keydown", (e) => {
        const hits = this._hits[kind] || [];
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (!this._openKind) this._openSearch(kind);
          if (!hits.length) return;
          this._hitActive[kind] = Math.min((this._hitActive[kind] ?? -1) + 1, hits.length - 1);
          this._paintHits(kind);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (!hits.length) return;
          this._hitActive[kind] = Math.max((this._hitActive[kind] ?? 0) - 1, 0);
          this._paintHits(kind);
        } else if (e.key === "Enter") {
          if (this._openKind === kind && hits.length) {
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

      ["strain", "medium", "nutrient", "light"].forEach((k) => this._bindSearch(k));

      root.getElementById("medium-slot")?.addEventListener("change", (e) => {
        this._mediumSlot = Number(e.target.value) || 1;
      });

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

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, DscBuildPlantCard);
  }

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC Build a Plant",
    description: "Separate Build a Plant composition (strain, soil %, nutrients, light, climate).",
  });
})();
