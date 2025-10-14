const TIPOLOGIAS = ["biblioteca", "museo", "centro_cultural"];

class CulturaApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        .toolbar { display:flex; gap: 8px; align-items:center; flex-wrap: wrap; }
        select, input {
          padding: 8px 10px; border-radius: 10px; border: 1px solid #ddd;
        }
        .grid {
          display: grid; gap: 16px; margin-top: 16px;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .empty { color: #666; margin-top: 8px; }
      </style>
      <div class="toolbar">
        <label>Tipo:
          <select id="tipo"></select>
        </label>
        <input id="q" type="search" placeholder="Buscar por nombre o municipio" />
      </div>
      <div id="status" class="empty">Cargando…</div>
      <div id="grid" class="grid" hidden></div>
    `;
    this.$grid = this.shadowRoot.querySelector("#grid");
    this.$status = this.shadowRoot.querySelector("#status");
    this.$tipo = this.shadowRoot.querySelector("#tipo");
    this.$q = this.shadowRoot.querySelector("#q");
  }

  static get observedAttributes() { return ["data-url", "filtro"]; }

  connectedCallback() {
    // opciones de tipologías
    this.$tipo.innerHTML = TIPOLOGIAS.map(t => `<option value="${t}">${t}</option>`).join("");
    this.$tipo.value = this.filtroInicial;
    this.$tipo.addEventListener("change", () => this.#render());
    this.$q.addEventListener("input", () => this.#render());
    this.#load();
  }

  get url() { return this.getAttribute("data-url"); }
  get filtroInicial() { return this.getAttribute("filtro") || "biblioteca"; }

  async #load() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      // jsDelivr nos sirve { espacios: [...] }
      this.espacios = Array.isArray(raw) ? raw : (raw.espacios ?? []);
      this.$status.textContent = "";
      this.$grid.hidden = false;
      this.#render();
    } catch (e) {
      console.error(e);
      this.$status.textContent = "Error cargando datos.";
    }
  }

  #fmtHorario(h) { return (!h || h === "_U") ? "Horario no disponible" : String(h).trim(); }
  #isYes(v) { return String(v).trim().toLowerCase().match(/^(sí|si|true|1|yes)$/); }

  #render() {
    if (!this.espacios) return;

    const tipo = this.$tipo.value || this.filtroInicial;
    const query = (this.$q.value || "").toLowerCase();

    const filtrados = this.espacios.filter(e => {
      const flag = this.#isYes(e?.[tipo]);
      const texto = `${e?.espacio_cultura_nombre ?? ""} ${e?.direccion_municipio_nombre ?? ""}`.toLowerCase();
      return flag && (!query || texto.includes(query));
    });

    this.$grid.replaceChildren();
    this.$status.textContent = filtrados.length ? "" : "No hay resultados.";

    for (const e of filtrados) {
      const card = document.createElement("cultura-card");
      card.setAttribute("id-espacio", String(e.espacio_cultural_id ?? e.id ?? ""));
      card.setAttribute("nombre", e.espacio_cultura_nombre ?? "Sin nombre");
      card.setAttribute("horario", this.#fmtHorario(e?.horario));
      card.setAttribute("municipio", e?.direccion_municipio_nombre ?? "");
      card.setAttribute("cp", e?.direccion_codigo_postal ?? "");
      card.setAttribute("web", (e?.pagina_web && e.pagina_web !== "_U") ? e.pagina_web : "");
      card.setAttribute("img", e?.imagen_url_1 ?? "");
      this.$grid.appendChild(card);
    }
  }
}
customElements.define("cultura-app", CulturaApp);
