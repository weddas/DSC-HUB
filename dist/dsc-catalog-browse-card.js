/**
 * DSC-HUB — Catalog Explorer (browse / filter / compare / Use in Build).
 * type: custom:dsc-catalog-browse-card
 * Strains + products: cannalib API when online. Local JSON is offline fallback.
 * Missing fields = "not in catalog". Do not invent chem or attach comparative photos to cultivars.
 */
(() => {
  const CARD_TYPE = "dsc-catalog-browse-card";
  const CATALOG_BASE = "/local/dsc-catalog";
  const LIST_CAP = 200;
  const CANNALIB_DEFAULT = "https://cannalib.plausible-deniability.net";
  const DOMAINS = [
    { id: "strains", label: "Strains", file: "dsc_strains_search_index.json", api: true },
    { id: "nutrients", label: "Nutrients", file: "dsc_nutrients_search_index.json", api: true },
    { id: "mediums", label: "Mediums", file: "dsc_mediums_search_index.json", api: true },
    { id: "lights", label: "Lights", file: "dsc_lights_search_index.json", api: true },
    { id: "media", label: "Reference images", file: null, api: true, media: true },
  ];

  const css = `
    :host { display:block; font-family: "Segoe UI", "IBM Plex Sans", system-ui, sans-serif; color:#e8efe9; }
    .wrap {
      background: linear-gradient(165deg, #121a16 0%, #0c1210 48%, #10161c 100%);
      border:1px solid rgba(120,160,130,.18); min-height:70vh; padding:16px 18px 28px; box-sizing:border-box;
    }
    .brand { font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#7fa88a; margin:0 0 4px; }
    h1 { margin:0; font-size:24px; font-weight:650; color:#f2f7f3; }
    .sub { margin:6px 0 14px; color:#9aada0; font-size:13px; max-width:60ch; }
    .tabs { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
    .tabs button {
      background:#152018; color:#cfe8d5; border:1px solid rgba(120,160,130,.3);
      border-radius:3px; padding:7px 11px; cursor:pointer; font-size:12px;
    }
    .tabs button.active { background:#2a4a34; border-color:#5b9f6b; font-weight:600; }
    .filters { display:grid; gap:8px; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); margin-bottom:12px; }
    label { display:block; font-size:10px; color:#8a9c90; margin:0 0 3px; letter-spacing:.04em; }
    input, select {
      width:100%; box-sizing:border-box; background:#0b110e; color:#e8efe9;
      border:1px solid rgba(120,160,130,.28); border-radius:3px; padding:7px 9px; font-size:13px;
    }
    .layout { display:grid; gap:12px; }
    @media (min-width:1000px) { .layout { grid-template-columns: 1.05fr .95fr; } }
    .panel {
      background:rgba(18,28,22,.55); border:1px solid rgba(120,160,130,.14);
      border-radius:4px; padding:12px; max-height:62vh; overflow:auto;
    }
    .panel h2 {
      margin:0 0 8px; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:#8fb89a;
    }
    .row {
      padding:8px 6px; border-bottom:1px solid rgba(120,160,130,.12); cursor:pointer;
    }
    .row:hover, .row.sel { background:rgba(91,159,107,.16); }
    .row .name { font-size:14px; font-weight:600; }
    .chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:5px; }
    .chip {
      font-size:10px; padding:2px 7px; border-radius:2px;
      background:rgba(91,159,107,.14); border:1px solid rgba(91,159,107,.35); color:#cfe8d5;
    }
    .chip.miss { background:rgba(120,120,120,.12); border-color:rgba(140,140,140,.3); color:#9a9a9a; }
    .muted { color:#8a9c90; font-size:12px; }
    .actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .notice { color:#e8c07a; font-size:12px; margin:8px 0 0; }
    button.act {
      background:#1a2a20; color:#e8efe9; border:1px solid rgba(120,160,130,.35);
      border-radius:3px; padding:8px 11px; cursor:pointer; font-size:12px;
    }
    button.act.primary { background:#2a4a34; border-color:#5b9f6b; }
    button.act:disabled { opacity:.45; cursor:not-allowed; }
    table.cmp { width:100%; border-collapse:collapse; font-size:12px; margin-top:8px; }
    table.cmp th, table.cmp td { text-align:left; padding:5px 4px; border-bottom:1px solid rgba(120,160,130,.12); vertical-align:top; }
    table.cmp th { color:#8a9c90; font-weight:500; }
    .detail dt { color:#8a9c90; font-size:11px; margin-top:8px; }
    .detail dd { margin:2px 0 0; font-size:13px; }
  `;

  class DscCatalogBrowseCard extends HTMLElement {
    constructor() {
      super();
      this._cache = {};
      this._domain = "strains";
      this._q = "";
      this._type = "";
      this._chemOnly = false;
      this._hasWant = false;
      this._tempMin = "";
      this._tempMax = "";
      this._heightMin = "";
      this._heightMax = "";
      this._category = "";
      this._selected = null;
      this._tree = null;
      this._mediaKind = "pathology_photo";
      this._compare = [];
      this._meta = {};
      this._notice = "";
    }
    setConfig(config) {
      this._config = { type: `custom:${CARD_TYPE}`, title: "Catalog", ...(config || {}) };
    }
    set hass(hass) {
      this._hass = hass;
      if (!this._booted) {
        this._booted = true;
        this._loadDomain(this._domain).then(() => this._render());
      } else {
        this._render();
      }
    }
    getCardSize() {
      return 10;
    }
    async _loadDomain(id) {
      const def = DOMAINS.find((d) => d.id === id);
      if (!def) return;
      if (def.api) {
        await this._apiSearchDomain(id, this._q || "");
        return;
      }
      if (this._cache[id]) {
        this._meta = this._cache[id];
        return;
      }
      try {
        const res = await fetch(`${CATALOG_BASE}/${def.file}?v=${Date.now()}`, { cache: "no-store" });
        const doc = await res.json();
        this._cache[id] = doc;
        this._meta = doc;
      } catch (e) {
        this._cache[id] = { items: [], note: String(e), count: 0 };
        this._meta = this._cache[id];
      }
    }
    _cannalibBase() {
      const s = this._hass?.states?.["input_text.dsc_cannalib_base_url"]?.state;
      const u = s && s !== "unknown" && s !== "unavailable" ? s : CANNALIB_DEFAULT;
      return String(u).replace(/\/$/, "");
    }
    _cannalibHeaders() {
      const h = { Accept: "application/json" };
      const key = this._hass?.states?.["input_text.dsc_cannalib_api_key"]?.state;
      if (key && key !== "unknown" && key !== "unavailable" && String(key).trim()) {
        h["X-Cannalib-Key"] = String(key).trim();
      }
      return h;
    }
    async _apiSearchDomain(id, q) {
      const seq = (this._apiSeq = (this._apiSeq || 0) + 1);
      const def = DOMAINS.find((d) => d.id === id);
      try {
        let url;
        if (def?.media) {
          const kind = this._mediaKind || "pathology_photo";
          url = `${this._cannalibBase()}/v1/catalogs/media?kind=${encodeURIComponent(kind)}&limit=80`;
        } else {
          url = `${this._cannalibBase()}/v1/catalogs/${id}?q=${encodeURIComponent(q || "")}&limit=80`;
        }
        const res = await fetch(url, { headers: this._cannalibHeaders(), cache: "no-store" });
        if (!res.ok) throw new Error(`cannalib ${res.status}`);
        const doc = await res.json();
        if (seq !== this._apiSeq) return;
        this._meta = {
          items: Array.isArray(doc.items) ? doc.items : [],
          count: doc.count,
          capped: Boolean(doc.capped),
          note: def?.media
            ? "Reference images by kind. Comparative/pathology are not cultivar portraits."
            : "Full corpus via cannalib (typeahead). Local JSON is offline fallback only.",
          source: "cannalib",
        };
        this._apiLive = true;
      } catch (e) {
        if (seq !== this._apiSeq) return;
        this._apiLive = false;
        if (def?.media || !def?.file) {
          this._meta = { items: [], note: `API offline — no local media index. ${e}`, count: 0 };
          return;
        }
        try {
          const res = await fetch(`${CATALOG_BASE}/${def.file}?v=${Date.now()}`, { cache: "no-store" });
          const doc = await res.json();
          this._meta = { ...doc, note: `API offline — local capped index. ${e}` };
        } catch (e2) {
          this._meta = { items: [], note: String(e2), count: 0 };
        }
      }
    }
    _items() {
      return Array.isArray(this._meta?.items) ? this._meta.items : [];
    }
    _bandOverlap(want, tmin, tmax) {
      if (!want || !Array.isArray(want.temp_c) || want.temp_c.length < 2) return false;
      const a0 = Number(want.temp_c[0]);
      const a1 = Number(want.temp_c[1]);
      if (Number.isNaN(a0) || Number.isNaN(a1)) return false;
      const b0 = tmin === "" ? -Infinity : Number(tmin);
      const b1 = tmax === "" ? Infinity : Number(tmax);
      if (Number.isNaN(b0) || Number.isNaN(b1)) return true;
      return a0 <= b1 && a1 >= b0;
    }
    _heightOk(item) {
      if (this._heightMin === "" && this._heightMax === "") return true;
      const h = item.height_cm;
      if (h == null) return false;
      const lo = Array.isArray(h) ? Number(h[0]) : Number(h);
      const hi = Array.isArray(h) ? Number(h[1] ?? h[0]) : Number(h);
      if (Number.isNaN(lo)) return false;
      const min = this._heightMin === "" ? -Infinity : Number(this._heightMin);
      const max = this._heightMax === "" ? Infinity : Number(this._heightMax);
      return lo <= max && hi >= min;
    }
    _filtered() {
      if (this._domain === "media") {
        const q = this._q.trim().toLowerCase();
        return this._items().filter((it) => {
          if (!q) return true;
          const hay = `${it.entity_id || ""} ${it.kind || ""} ${it.author_credit || ""}`.toLowerCase();
          return hay.includes(q);
        });
      }
      const q = this._q.trim().toLowerCase();
      return this._items().filter((it) => {
        if (q && !(it.name || "").toLowerCase().includes(q) && !(it.brand || "").toLowerCase().includes(q))
          return false;
        if (this._domain === "strains") {
          if (this._type && String(it.type || "").toLowerCase() !== this._type.toLowerCase()) return false;
          if (this._chemOnly && !it.has_chemistry) return false;
          if (this._hasWant && !it.want) return false;
          if ((this._tempMin !== "" || this._tempMax !== "") && !this._bandOverlap(it.want, this._tempMin, this._tempMax))
            return false;
          if (!this._heightOk(it)) return false;
        }
        if ((this._domain === "nutrients" || this._domain === "mediums") && this._category) {
          if (String(it.category || "").toLowerCase() !== this._category.toLowerCase()) return false;
        }
        return true;
      });
    }
    _esc(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    _fmtRange(v, unit) {
      if (v == null) return null;
      if (Array.isArray(v) && v.length >= 2) return `${v[0]}-${v[1]}${unit || ""}`;
      return `${v}${unit || ""}`;
    }
    _chips(it) {
      const chips = [];
      if (this._domain === "strains") {
        if (it.type) chips.push(it.type);
        if (it.has_chemistry && Array.isArray(it.thc_range)) chips.push(`THC ${it.thc_range.join("-")}%`);
        else if (!it.has_chemistry) chips.push({ miss: true, t: "no chem" });
        if (it.want?.temp_c) chips.push(`temp ${it.want.temp_c.join("-")}C`);
        else chips.push({ miss: true, t: "no climate" });
        if (it.height_cm != null) chips.push(`ht ${this._fmtRange(it.height_cm, "cm")}`);
        else chips.push({ miss: true, t: "no height" });
        if (it.flowering_days != null) chips.push(`flower ${this._fmtRange(it.flowering_days, "d")}`);
        else chips.push({ miss: true, t: "no flower days" });
        if (Array.isArray(it.top_terpenes) && it.top_terpenes.length) chips.push(it.top_terpenes.slice(0, 3).join(", "));
      } else if (this._domain === "nutrients") {
        if (it.brand) chips.push(it.brand);
        if (it.category) chips.push(it.category);
        if (it.dose_ml_l != null) chips.push(`${it.dose_ml_l} ml/L`);
        if (it.stage) chips.push(String(it.stage));
        if (it.npk) chips.push(`NPK ${it.npk}`);
      } else if (this._domain === "mediums") {
        if (it.brand) chips.push(it.brand);
        if (it.category) chips.push(it.category);
        if (it.composition) chips.push(typeof it.composition === "string" ? it.composition : JSON.stringify(it.composition));
      } else if (this._domain === "media") {
        if (it.kind) chips.push(it.kind);
        if (it.license_type) chips.push(it.license_type);
        if (it.entity_id === "comparative") chips.push({ miss: true, t: "comparative" });
        else if (it.entity_id) chips.push(it.entity_id);
      } else if (this._domain === "lights") {
        if (it.wattage_w != null) chips.push(`${it.wattage_w} W`);
        if (it.efficacy_umol_j != null) chips.push(`${it.efficacy_umol_j} umol/J`);
        if (it.has_ppfd) chips.push("PPFD map");
        else chips.push({ miss: true, t: "no PPFD" });
      }
      return chips
        .map((c) =>
          typeof c === "object" && c.miss
            ? `<span class="chip miss">${this._esc(c.t)}</span>`
            : `<span class="chip">${this._esc(c)}</span>`
        )
        .join("");
    }
    _call(domain, service, data) {
      if (!this._hass) return Promise.resolve();
      return this._hass.callService(domain, service, data);
    }
    _helperState(id) {
      const s = this._hass?.states?.[id]?.state;
      return s && s !== "unknown" && s !== "unavailable" ? String(s).trim() : "";
    }
    _inventoryOn(n) {
      return this._hass?.states?.[`input_boolean.dsc_nutrient_${n}_in_inventory`]?.state === "on";
    }
    _nextFreeNutrientSlot() {
      for (let n = 1; n <= 8; n++) {
        const name = this._helperState(`input_text.dsc_nutrient_${n}_name`);
        if (!name && !this._inventoryOn(n)) return n;
      }
      return 0;
    }
    _nextFreeMediumSlot() {
      for (let n = 1; n <= 3; n++) {
        const name = this._helperState(`input_text.dsc_blend_component_${n}_name`);
        const pct = parseFloat(this._hass?.states?.[`input_number.dsc_blend_pct_${n}`]?.state);
        if (!name && !(Number.isFinite(pct) && pct > 0)) return n;
      }
      return 0;
    }
    _nextFreeCustomSlot() {
      const selected = this._helperState("input_select.dsc_build_custom_slot");
      const nSel = Number(selected);
      const candidates = Number.isInteger(nSel) && nSel >= 1 && nSel <= 5 ? [nSel] : [1, 2, 3, 4, 5];
      for (const n of candidates) {
        if (!this._helperState(`input_text.dsc_custom_strain_${n}_name`)) return n;
      }
      return 0;
    }
    _goCompose() {
      const path = "/dsc-hub#/grow/compose";
      history.pushState(null, "", path);
      const ev = new Event("location-changed", { bubbles: true, composed: true });
      ev.detail = { replace: false };
      window.dispatchEvent(ev);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    async _useInBuild(it) {
      if (!it) return;
      try {
        if (this._domain === "strains") {
          this._goCompose();
          await this._call("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: it.name });
          const nick = this._hass?.states?.["input_text.dsc_build_nickname"]?.state;
          if (!nick || nick === "unknown" || nick === "") {
            await this._call("input_text", "set_value", { entity_id: "input_text.dsc_build_nickname", value: it.name });
          }
          this._notice = "";
        } else if (this._domain === "nutrients") {
          const n = this._nextFreeNutrientSlot();
          if (!n) {
            this._notice = "No free nutrient slot. Inventory-off bottles stay put; will not overwrite slot 1.";
            this._render();
            return;
          }
          this._goCompose();
          await this._call("input_text", "set_value", { entity_id: `input_text.dsc_nutrient_${n}_name`, value: it.name });
          if (it.dose_ml_l != null) {
            await this._call("input_number", "set_value", {
              entity_id: `input_number.dsc_nutrient_${n}_dose_ml_l`,
              value: Number(it.dose_ml_l),
            });
          }
          await this._call("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${n}_in_inventory` });
          this._notice = `Wrote ${it.name} to nutrient slot ${n}.`;
        } else if (this._domain === "mediums") {
          const n = this._nextFreeMediumSlot();
          if (!n) {
            this._notice = "No free medium slot. Will not overwrite slot 1.";
            this._render();
            return;
          }
          this._goCompose();
          await this._call("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${n}_name`,
            value: it.name,
          });
          this._notice = `Wrote ${it.name} to medium slot ${n}.`;
        } else if (this._domain === "lights") {
          this._goCompose();
          const fixture = this._hass?.states?.["input_select.dsc_light_fixture"];
          const opts = fixture?.attributes?.options || [];
          const match = opts.find((o) => String(o).toLowerCase().includes(String(it.name).toLowerCase().slice(0, 12)));
          if (match) {
            await this._call("input_select", "select_option", {
              entity_id: "input_select.dsc_light_fixture",
              option: match,
            });
          } else {
            await this._call("input_select", "select_option", {
              entity_id: "input_select.dsc_light_fixture",
              option: "Custom / other",
            });
            await this._call("input_text", "set_value", {
              entity_id: "input_text.dsc_light_custom_name",
              value: it.name,
            });
          }
          if (it.ppfd_url) {
            await this._call("input_text", "set_value", {
              entity_id: "input_text.dsc_light_ppfd_map_url",
              value: String(it.ppfd_url).slice(0, 255),
            });
          }
          this._notice = "";
        } else {
          this._goCompose();
          this._notice = "";
        }
      } catch (e) {
        console.warn("dsc-catalog Use in Build helpers", e);
        this._notice = "Use in Build failed — helpers not written.";
      }
      this._render();
    }
    async _fillCustom(it) {
      if (!it || this._domain !== "strains") return;
      const slot = this._nextFreeCustomSlot();
      if (!slot) {
        this._notice = "No free custom strain slot (1–5). Will not overwrite slot 1.";
        this._render();
        return;
      }
      try {
        await this._call("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: it.name });
        await this._call("script", "dsc_custom_fill_from_catalog", { slot, seed_name: it.name });
        this._notice = `Filled custom strain slot ${slot} from ${it.name}.`;
      } catch (e) {
        console.warn("dsc-catalog Fill Custom", e);
        this._notice = "Fill Custom failed — required slot/seed_name not written.";
      }
      this._render();
    }
    _toggleCompare(it) {
      const id = it.id || it.name;
      const idx = this._compare.findIndex((x) => (x.id || x.name) === id);
      if (idx >= 0) this._compare.splice(idx, 1);
      else if (this._compare.length < 3) this._compare.push(it);
      this._render();
    }
    _detailHtml(it) {
      if (!it) return `<p class="muted">Select a row for detail.</p>`;
      if (this._domain === "media") {
        const label =
          it.entity_id === "comparative"
            ? "comparative / pathology reference — not a named cultivar"
            : this._esc(it.entity_id);
        const src = it.source_url || "";
        return `
          <h2>Reference image</h2>
          <div class="name" style="font-size:18px;font-weight:650">${this._esc(it.kind)}</div>
          <dl class="detail">
            <dt>entity</dt><dd>${label}</dd>
            <dt>license</dt><dd>${this._esc(it.license_type || "unknown")}</dd>
            <dt>credit</dt><dd>${this._esc(it.author_credit || "—")}</dd>
          </dl>
          ${
            src
              ? `<p><img src="${this._esc(src)}" alt="" style="max-width:100%;height:auto;border-radius:4px" /></p>`
              : `<p class="muted">No source_url</p>`
          }
        `;
      }
      const missing = [];
      if (this._domain === "strains") {
        if (!it.want) missing.push("climate Want bands");
        if (it.height_cm == null) missing.push("height");
        if (!it.has_chemistry) missing.push("chemistry");
        if (it.flowering_days == null) missing.push("flowering days");
      }
      const want = it.want || {};
      return `
        <h2>Detail</h2>
        <div class="name" style="font-size:18px;font-weight:650">${this._esc(it.name)}</div>
        <div class="chips">${this._chips(it)}</div>
        <dl class="detail">
          <dt>id / source</dt><dd>${this._esc(it.id || "-")} · ${this._esc(it.source || "-")}</dd>
          ${
            this._domain === "strains"
              ? `
            <dt>Want temp C</dt><dd>${want.temp_c ? this._esc(want.temp_c.join(" - ")) : '<span class="muted">not in catalog</span>'}</dd>
            <dt>Want RH %</dt><dd>${want.rh_pct ? this._esc(want.rh_pct.join(" - ")) : '<span class="muted">not in catalog</span>'}</dd>
            <dt>Want EC veg / flower</dt><dd>${
              want.ec_veg_us || want.ec_flower_us
                ? this._esc(`${(want.ec_veg_us || ["?", "?"]).join("-")} / ${(want.ec_flower_us || ["?", "?"]).join("-")} uS/cm`)
                : '<span class="muted">not in catalog</span>'
            }</dd>
            <dt>Height</dt><dd>${it.height_cm != null ? this._esc(this._fmtRange(it.height_cm, " cm")) : '<span class="muted">not in catalog</span>'}</dd>
            <dt>Flowering days</dt><dd>${it.flowering_days != null ? this._esc(this._fmtRange(it.flowering_days, "")) : '<span class="muted">not in catalog</span>'}</dd>
          `
              : ""
          }
          ${
            this._domain === "lights" && it.ppfd_url
              ? `<dt>PPFD map</dt><dd><a href="${this._esc(it.ppfd_url)}" target="_blank" rel="noopener" style="color:#9fd0ad">${this._esc(it.ppfd_url)}</a></dd>`
              : ""
          }
          ${
            this._domain === "nutrients"
              ? `<dt>Dose</dt><dd>${it.dose_ml_l != null ? this._esc(it.dose_ml_l) + " ml/L" : '<span class="muted">not in catalog</span>'}</dd>
                 <dt>Stage</dt><dd>${it.stage ? this._esc(it.stage) : '<span class="muted">not in catalog</span>'}</dd>`
              : ""
          }
        </dl>
        ${this._domain === "strains" ? this._treeHtml() : ""}
        ${missing.length ? `<p class="muted">Missing (honest): ${this._esc(missing.join(", "))}</p>` : ""}
        <div class="actions">
          <button class="act primary" data-act="use">Use in Build</button>
          ${this._domain === "strains" ? `<button class="act" data-act="custom">Fill Custom slot</button>` : ""}
          <button class="act" data-act="cmp">${this._compare.some((x) => (x.id || x.name) === (it.id || it.name)) ? "Remove compare" : "Add to compare"}</button>
        </div>
      `;
    }
    _treeHtml() {
      const tree = this._tree;
      if (!tree || !tree.evidence) {
        return `<p class="muted">Hydrating strain tree… empty media stays empty; no comparative pile on this name.</p>`;
      }
      const ev = tree.evidence;
      const lin = ev.lineage || {};
      const media = ev.media || {};
      const chem = ev.chemistry || {};
      const n = Number(media.n || 0);
      const samples = Array.isArray(media.sample) ? media.sample : [];
      const mediaBits = n
        ? samples
            .map((m) => {
              const label =
                m.entity_id === "comparative"
                  ? "comparative (not this cultivar)"
                  : `${m.kind || "photo"}`;
              const src = m.source_url || "";
              const isComp = m.entity_id === "comparative";
              const link = src
                ? ` · <a href="${this._esc(src)}" target="_blank" rel="noopener" style="color:#9fd0ad">open</a>`
                : "";
              const showImg =
                !isComp && (src.startsWith("https://") || src.startsWith("/media"));
              const img = showImg
                ? `<br/><img src="${this._esc(src)}" alt="" style="max-width:100%;height:auto;border-radius:4px" />`
                : "";
              return `<div class="muted">${this._esc(label)}${link}${img}</div>`;
            })
            .join("")
        : `<p class="muted">media.n=0 — no cultivar photo on this id. Do not use the comparative dump here.</p>`;
      const mermaid = lin.mermaid
        ? `<pre class="muted" style="white-space:pre-wrap;font-size:11px">${this._esc(lin.mermaid)}</pre>`
        : `<p class="muted">${this._esc(lin.parse_note || "no pedigree")}</p>`;
      const span = (v) =>
        Array.isArray(v) && v.length >= 2 ? `${v[0]}–${v[1]}` : v != null ? String(v) : "not in catalog";
      return `
        <p class="muted">THC span ${this._esc(span(chem.thc_span))} · CBD ${this._esc(span(chem.cbd_span))} (rows not blended)</p>
        <p class="muted">Parents ${Array.isArray(lin.parents) ? lin.parents.length : 0} · children ${lin.children_n || 0}</p>
        ${mermaid}
        ${mediaBits}
      `;
    }
    _compareHtml() {
      if (!this._compare.length) return `<p class="muted">Compare up to 3 items (Add to compare).</p>`;
      const fields =
        this._domain === "strains"
          ? [
              ["Name", (i) => i.name],
              ["Type", (i) => i.type || "-"],
              ["Temp C", (i) => (i.want?.temp_c ? i.want.temp_c.join("-") : "n/a")],
              ["RH %", (i) => (i.want?.rh_pct ? i.want.rh_pct.join("-") : "n/a")],
              ["Height", (i) => this._fmtRange(i.height_cm, "cm") || "n/a"],
              ["THC", (i) => (Array.isArray(i.thc_range) ? i.thc_range.join("-") + "%" : "n/a")],
            ]
          : this._domain === "nutrients"
            ? [
                ["Name", (i) => i.name],
                ["Brand", (i) => i.brand || "-"],
                ["Category", (i) => i.category || "-"],
                ["Dose", (i) => (i.dose_ml_l != null ? i.dose_ml_l + " ml/L" : "n/a")],
                ["Stage", (i) => i.stage || "n/a"],
              ]
            : this._domain === "lights"
              ? [
                  ["Name", (i) => i.name],
                  ["W", (i) => i.wattage_w ?? "n/a"],
                  ["PPE", (i) => i.efficacy_umol_j ?? "n/a"],
                  ["PPFD", (i) => (i.has_ppfd ? "yes" : "n/a")],
                ]
              : [
                  ["Name", (i) => i.name],
                  ["Composition", (i) => (typeof i.composition === "string" ? i.composition : JSON.stringify(i.composition || "n/a"))],
                ];
      return `
        <h2>Compare</h2>
        <table class="cmp">
          <thead><tr><th></th>${this._compare.map((i) => `<th>${this._esc(i.name)}</th>`).join("")}</tr></thead>
          <tbody>
            ${fields
              .map(
                ([label, fn]) =>
                  `<tr><th>${this._esc(label)}</th>${this._compare.map((i) => `<td>${this._esc(fn(i))}</td>`).join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
        <div class="actions"><button class="act" data-act="clear-cmp">Clear compare</button></div>
      `;
    }
    _filterBar() {
      if (this._domain === "media") {
        const kinds = [
          "pathology_photo",
          "seedling_photo",
          "plant_photo",
          "flower_photo",
          "seed_photo",
          "phenotype_photo",
          "comparative_crop",
        ];
        return `
          <div class="filters">
            <div><label>Kind</label>
              <select id="mkind">
                ${kinds
                  .map(
                    (k) =>
                      `<option value="${k}" ${this._mediaKind === k ? "selected" : ""}>${k}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div><label>Filter</label><input type="text" id="q" value="${this._esc(this._q)}" placeholder="entity_id / credit" /></div>
          </div>`;
      }
      if (this._domain === "strains") {
        return `
          <div class="filters">
            <div><label>Search</label><input type="text" id="q" value="${this._esc(this._q)}" placeholder="Blue Dream..." /></div>
            <div><label>Type</label><input type="text" id="type" value="${this._esc(this._type)}" placeholder="photo / auto / hybrid" /></div>
            <div><label>Temp min C</label><input type="number" id="tmin" value="${this._esc(this._tempMin)}" /></div>
            <div><label>Temp max C</label><input type="number" id="tmax" value="${this._esc(this._tempMax)}" /></div>
            <div><label>Height min cm</label><input type="number" id="hmin" value="${this._esc(this._heightMin)}" /></div>
            <div><label>Height max cm</label><input type="number" id="hmax" value="${this._esc(this._heightMax)}" /></div>
            <div><label>Flags</label>
              <select id="flags">
                <option value="" ${!this._chemOnly && !this._hasWant ? "selected" : ""}>any</option>
                <option value="chem" ${this._chemOnly ? "selected" : ""}>has chemistry</option>
                <option value="want" ${this._hasWant ? "selected" : ""}>has Want bands</option>
              </select>
            </div>
          </div>`;
      }
      return `
        <div class="filters">
          <div><label>Search</label><input type="text" id="q" value="${this._esc(this._q)}" /></div>
          <div><label>Category</label><input type="text" id="cat" value="${this._esc(this._category)}" placeholder="base / bloom / substrate" /></div>
        </div>`;
    }
    async _hydrateSelected() {
      const it = this._selected;
      if (!it || this._domain !== "strains") return;
      const sid = it.name_norm || it.id;
      if (!sid) return;
      const seq = (this._hydSeq = (this._hydSeq || 0) + 1);
      try {
        const res = await fetch(
          `${this._cannalibBase()}/v1/catalogs/strains/${encodeURIComponent(sid)}`,
          { headers: this._cannalibHeaders(), cache: "no-store" }
        );
        if (!res.ok) throw new Error(String(res.status));
        const tree = await res.json();
        if (seq !== this._hydSeq) return;
        this._tree = tree;
        this._render();
      } catch (_e) {
        if (seq !== this._hydSeq) return;
        this._tree = { evidence: { lineage: { parse_note: "hydrate failed" }, media: { n: 0, sample: [] }, chemistry: {} } };
        this._render();
      }
    }
    _bind() {
      const root = this.shadowRoot;
      root.querySelectorAll(".tabs button").forEach((btn) => {
        btn.addEventListener("click", async () => {
          this._domain = btn.dataset.domain;
          this._selected = null;
          this._tree = null;
          this._compare = [];
          await this._loadDomain(this._domain);
          this._render();
        });
      });
      const syncFilters = () => {
        const prevQ = this._q;
        this._q = root.querySelector("#q")?.value || "";
        this._type = root.querySelector("#type")?.value || "";
        this._tempMin = root.querySelector("#tmin")?.value || "";
        this._tempMax = root.querySelector("#tmax")?.value || "";
        this._heightMin = root.querySelector("#hmin")?.value || "";
        this._heightMax = root.querySelector("#hmax")?.value || "";
        this._category = root.querySelector("#cat")?.value || "";
        const mkind = root.querySelector("#mkind")?.value;
        if (mkind && mkind !== this._mediaKind) {
          this._mediaKind = mkind;
          this._apiSearchDomain(this._domain, this._q).then(() => this._render());
          return;
        }
        const flags = root.querySelector("#flags")?.value || "";
        this._chemOnly = flags === "chem";
        this._hasWant = flags === "want";
        const def = DOMAINS.find((d) => d.id === this._domain);
        if (def?.api && this._q !== prevQ) {
          clearTimeout(this._apiTimer);
          this._apiTimer = setTimeout(async () => {
            await this._apiSearchDomain(this._domain, this._q);
            this._render();
          }, 200);
          return;
        }
        this._render();
      };
      ["q", "type", "tmin", "tmax", "hmin", "hmax", "cat", "flags", "mkind"].forEach((id) => {
        const el = root.querySelector("#" + id);
        if (!el) return;
        el.addEventListener(el.tagName === "SELECT" ? "change" : "input", syncFilters);
      });
      root.querySelectorAll(".row").forEach((row) => {
        row.addEventListener("click", () => {
          const idx = Number(row.dataset.idx);
          this._selected = this._filtered()[idx];
          this._tree = null;
          this._render();
          this._hydrateSelected();
        });
      });
      root.querySelector("[data-act=use]")?.addEventListener("click", () => this._useInBuild(this._selected));
      root.querySelector("[data-act=custom]")?.addEventListener("click", () => this._fillCustom(this._selected));
      root.querySelector("[data-act=cmp]")?.addEventListener("click", () => this._toggleCompare(this._selected));
      root.querySelector("[data-act=clear-cmp]")?.addEventListener("click", () => {
        this._compare = [];
        this._render();
      });
    }
    _render() {
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const items = this._filtered();
      const note = this._meta?.note || "";
      const count = this._meta?.count ?? items.length;
      const shown = items.slice(0, LIST_CAP);
      const extra = this._meta?.with_want != null
        ? ` · ${this._meta.with_want} with Want · ${this._meta.with_height || 0} with height`
        : "";
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <div class="wrap">
          <div class="brand">DSC-HUB / Plant</div>
          <h1>${this._esc(this._config.title || "Catalog")}</h1>
          <p class="sub">Live sqlite via cannalib; /local/dsc-catalog is offline fallback only. Missing height/climate stay blank. ${this._esc(note)}</p>
          <div class="tabs">
            ${DOMAINS.map(
              (d) =>
                `<button type="button" data-domain="${d.id}" class="${d.id === this._domain ? "active" : ""}">${d.label}</button>`
            ).join("")}
          </div>
          ${this._filterBar()}
          <p class="muted">${shown.length} shown / ${items.length} matched (cap ${LIST_CAP}) · ${count} indexed${extra}</p>
          ${this._notice ? `<p class="notice">${this._esc(this._notice)}</p>` : ""}
          <div class="layout">
            <div class="panel">
              <h2>Results</h2>
              ${
                shown.length
                  ? shown
                      .map((it, idx) => {
                        const sel = this._selected && (this._selected.id || this._selected.name) === (it.id || it.name);
                        return `<div class="row ${sel ? "sel" : ""}" data-idx="${idx}">
                          <div class="name">${this._esc(it.name || it.entity_id || it.kind || it.id)}</div>
                          <div class="chips">${this._chips(it)}</div>
                        </div>`;
                      })
                      .join("")
                  : `<p class="muted">No matches.</p>`
              }
            </div>
            <div class="panel">
              ${this._detailHtml(this._selected)}
              <hr style="border:none;border-top:1px solid rgba(120,160,130,.2);margin:14px 0" />
              ${this._compareHtml()}
            </div>
          </div>
        </div>
      `;
      this._bind();
    }
  }

  if (!customElements.get(CARD_TYPE)) customElements.define(CARD_TYPE, DscCatalogBrowseCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC Catalog Browse",
    description: "Browse/compare strains, nutrients, mediums, lights",
  });
})();
