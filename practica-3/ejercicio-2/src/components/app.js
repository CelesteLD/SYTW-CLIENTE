// src/components/app.js
// Componente <cultura-app>
// Carga un JSON con espacios culturales, aplica filtros (tipología + búsqueda) y pinta <cultura-card>.
//
// Notas de funcionamiento:
// - El atributo data-url apunta al JSON (array o { espacios: [...] }).
// - "filtro" indica la tipología inicial seleccionada.
// - Filtro por texto busca en nombre y municipio.
// - Cada card recibe atributos con los campos relevantes (id, nombre, horario, municipio, cp).
// - Estilos de la toolbar + grid están en /src/styles/app.css.

const TIPOLOGIAS = ["biblioteca", "museo", "centro_cultural"];

class CulturaApp extends HTMLElement {
  static get observedAttributes() {
    return ["data-url", "filtro"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // CSS externo
    const cssURL = new URL("../styles/app.css", import.meta.url);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL;

    // DOM vía <template> (Safari-safe)
    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <div class="toolbar">
        <label>Tipo:
          <select id="tipo"></select>
        </label>
        <input id="q" type="search" placeholder="Buscar por nombre o municipio" />
      </div>
      <div id="status" class="empty">Cargando…</div>
      <div id="grid" class="grid" hidden></div>
    `;

    this.shadowRoot.append(link, tpl.content.cloneNode(true));

    // Refs
    this.$grid = this.shadowRoot.querySelector("#grid");
    this.$status = this.shadowRoot.querySelector("#status");
    this.$tipo = this.shadowRoot.querySelector("#tipo");
    this.$q = this.shadowRoot.querySelector("#q");
  }


  connectedCallback() {
    // Opciones de tipologías
    this.$tipo.innerHTML = TIPOLOGIAS.map((t) => `<option value="${t}">${t}</option>`).join("");
    this.$tipo.value = this.filtroInicial;
    this.$tipo.addEventListener("change", () => this.#render());
    this.$q.addEventListener("input", () => this.#render());
    this.#load();
  }

  get url() {
    return this.getAttribute("data-url");
  }
  get filtroInicial() {
    return this.getAttribute("filtro") || "biblioteca";
  }

  // Carga de datos vía fetch (acepta array o {espacios: [...]})
  async #load() {
    try {
      const res = await fetch(this.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      this.espacios = Array.isArray(raw) ? raw : raw.espacios ?? [];
      this.$status.textContent = "";
      this.$grid.hidden = false;
      this.#render();
    } catch (e) {
      console.error(e);
      this.$status.textContent = "Error cargando datos.";
    }
  }

  // Helpers de formato
  #fmtHorario(h) {
    return !h || h === "_U" ? "Horario no disponible" : String(h).trim();
  }
  #isYes(v) {
    return String(v).trim().toLowerCase().match(/^(sí|si|true|1|yes)$/);
  }

  // Filtro + pintado de cards
  #render() {
    if (!this.espacios) return;

    const tipo = this.$tipo.value || this.filtroInicial;
    const query = (this.$q.value || "").toLowerCase();

    const filtrados = this.espacios.filter((e) => {
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
      // Atributos extra por si los usas en el futuro:
      card.setAttribute("web", e?.pagina_web && e.pagina_web !== "_U" ? e.pagina_web : "");
      card.setAttribute("img", e?.imagen_url_1 ?? "");
      this.$grid.appendChild(card);
    }
  }
}

customElements.define("cultura-app", CulturaApp);
