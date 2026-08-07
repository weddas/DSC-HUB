/**
 * DSC-HUB — product shell section nav (wireframe for later webserver).
 * type: custom:dsc-app-nav-card
 * ASCII-only user strings.
 */
(() => {
  const CARD_TYPE = "dsc-app-nav-card";
  const SECTIONS = [
    { id: "ops", label: "Ops", path: "/dsc-hub-pro/ops" },
    { id: "plant", label: "Plant", path: "/dsc-hub-pro/plant" },
    { id: "advanced", label: "Advanced", path: "/dsc-hub-pro/advanced" },
    { id: "system", label: "System", path: "/dsc-hub-pro/system" },
  ];

  const css = `
    :host { display:block; font-family: "Segoe UI", "IBM Plex Sans", system-ui, sans-serif; }
    .nav {
      display:flex; flex-wrap:wrap; gap:8px; align-items:center;
      padding:10px 12px; margin:0 0 12px;
      background: linear-gradient(165deg, #121a16 0%, #0c1210 100%);
      border:1px solid rgba(120,160,130,.22); border-radius:4px;
    }
    .brand {
      font-size:10px; letter-spacing:.2em; text-transform:uppercase;
      color:#7fa88a; margin-right:8px;
    }
    a.tab {
      text-decoration:none; color:#cfe8d5; font-size:13px;
      padding:7px 12px; border-radius:3px;
      border:1px solid rgba(120,160,130,.28); background:#152018;
    }
    a.tab:hover { filter:brightness(1.08); }
    a.tab.active {
      background:#2a4a34; border-color:#5b9f6b; color:#f2f7f3; font-weight:600;
    }
  `;

  class DscAppNavCard extends HTMLElement {
    setConfig(config) {
      this._config = { type: `custom:${CARD_TYPE}`, ...(config || {}) };
    }
    set hass(hass) {
      this._hass = hass;
      this._render();
    }
    getCardSize() {
      return 1;
    }
    _activeId() {
      const path = (location.pathname || "").replace(/\/$/, "");
      if (path.includes("/plant") || path.includes("/catalog") || path.includes("/strains") || path.includes("/nutrient"))
        return "plant";
      if (path.includes("/advanced") || path.includes("/learning") || path.includes("/trends") || path.includes("/history"))
        return "advanced";
      if (path.includes("/system")) return "system";
      return "ops";
    }
    _nav(path) {
      history.pushState(null, "", path);
      const ev = new Event("location-changed", { bubbles: true, composed: true });
      ev.detail = { replace: false };
      window.dispatchEvent(ev);
    }
    _render() {
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const active = this._config.active || this._activeId();
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <nav class="nav" aria-label="DSC-HUB sections">
          <span class="brand">DSC-HUB</span>
          ${SECTIONS.map(
            (s) =>
              `<a class="tab ${s.id === active ? "active" : ""}" href="${s.path}" data-path="${s.path}">${s.label}</a>`
          ).join("")}
        </nav>
      `;
      this.shadowRoot.querySelectorAll("a.tab").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          this._nav(a.getAttribute("data-path"));
        });
      });
    }
  }

  if (!customElements.get(CARD_TYPE)) customElements.define(CARD_TYPE, DscAppNavCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "DSC App Nav",
    description: "Ops / Plant / Advanced / System product shell nav",
  });
})();
