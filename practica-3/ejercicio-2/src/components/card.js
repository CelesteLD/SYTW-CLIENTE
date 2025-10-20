// src/components/card.js
// Componente <cultura-card>
// Tarjeta minimal sin imagen que muestra: nombre, horario, municipio · CP y el componente <cultura-rating>.
// He separado los estilos a /src/styles/card.css y los cargo con <link> dentro del Shadow DOM.

// Nota personal:
// - Uso Shadow DOM para encapsular estilos y evitar colisiones.
// - Cargo el CSS con un <link> apuntando a /src/styles/card.css (resuelto con import.meta.url).
// - El "badge" usa un color HSL estable calculado a partir del nombre (hashHue) y muestra iniciales.
// - El rating se vincula por "item-id" para persistir en localStorage (lo gestiona <cultura-rating>).

class CulturaCard extends HTMLElement {
  static get observedAttributes() {
    return ["id-espacio", "nombre", "horario", "municipio", "cp"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // CSS externo
    const cssURL = new URL("../styles/card.css", import.meta.url);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL;

    // DOM vía <template> (Safari-safe)
    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <div class="wrap">
        <div class="head">
          <div class="badge" aria-hidden="true">📚</div>
          <div class="title"></div>
        </div>

        <div class="muted horario"></div>
        <cultura-rating class="rating"></cultura-rating>
        <div class="ubic"></div>
      </div>
    `;

    this.shadowRoot.append(link, tpl.content.cloneNode(true));

    // Refs
    this.$badge  = this.shadowRoot.querySelector(".badge");
    this.$title  = this.shadowRoot.querySelector(".title");
    this.$horario= this.shadowRoot.querySelector(".horario");
    this.$ubic   = this.shadowRoot.querySelector(".ubic");
    this.$rating = this.shadowRoot.querySelector("cultura-rating");
  }


  attributeChangedCallback() {
    this.#render();
  }

  // Render principal: vuelca atributos en UI y ajusta detalles visuales
  #render() {
    const nombre = (this.getAttribute("nombre") || "Sin nombre").trim();
    const horario = (this.getAttribute("horario") || "Horario no disponible").trim();
    const municipio = (this.getAttribute("municipio") || "").trim();
    const cp = (this.getAttribute("cp") || "").trim();
    const id = this.getAttribute("id-espacio") || "";

    // Título + textos
    this.$title.textContent = nombre;
    this.$horario.textContent = horario;
    this.$ubic.textContent = [municipio, cp].filter(Boolean).join(" · ");

    // Vinculo el rating al id (para persistencia en localStorage)
    if (id) this.$rating.setAttribute("item-id", id);

    // Badge: iniciales + color estable
    const initials = this.#initials(nombre);
    const hue = this.#hashHue(nombre);
    this.$badge.textContent = initials || "📚";
    this.$badge.style.background = `hsl(${hue} 80% 50%)`;

    // Fuerzo tamaño compacto del área de comentarios (vía CSS custom props)
    this.$rating.style.setProperty("--cr-textarea-min", "40px");
    this.$rating.style.setProperty("--cr-comments-max", "50px");
  }

  // Iniciales del nombre (máx 2 palabras)
  #initials(text) {
    const parts = text.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((p) => p[0]).join("").toUpperCase();
  }

  // Hash simple -> tono HSL (para color del badge)
  #hashHue(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h % 360;
  }
}

customElements.define("cultura-card", CulturaCard);
