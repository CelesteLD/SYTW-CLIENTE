// Tarjeta minimal sin imagen: nombre, horario, municipio·CP y 5⭐
// Genera un badge con color estable según el nombre y muestra iniciales (o emoji).

class CulturaCard extends HTMLElement {
  static get observedAttributes() {
    return ["id-espacio","nombre","horario","municipio","cp"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display:block; background:#fff; border:1px solid #e8e8e8;
          border-radius:18px; box-shadow:0 2px 10px rgba(0,0,0,.05);
          overflow:hidden; transition: transform .12s ease, box-shadow .12s ease;
        }
        :host(:hover){ transform: translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.08); }

        .wrap { display:grid; gap:10px; padding:14px; }
        .head { display:flex; align-items:center; gap:12px; }
        .badge {
          width:44px; height:44px; border-radius:50%;
          display:grid; place-items:center; font-weight:700;
          color:#fff; user-select:none; flex:0 0 44px;
          box-shadow: inset 0 -6px 12px rgba(0,0,0,.12);
        }
        .title { font-weight:750; font-size:1.02rem; line-height:1.2; }
        .muted { color:#666; font-size:.95rem; }
        .foot { display:flex; align-items:center; justify-content:space-between; }
        .meta { color:#7a7a7a; font-size:.92rem; }

        /* estética estrellas (lo hace el web component hijo) */
        cultura-rating { margin-top: 2px; }
      </style>

      <div class="wrap">
        <div class="head">
          <div class="badge" aria-hidden="true">📚</div>
          <div class="title"></div>
        </div>
        <div class="muted horario"></div>
        <div class="foot">
          <div class="meta ubic"></div>
          <cultura-rating></cultura-rating>
        </div>
      </div>
    `;

    this.$badge = this.shadowRoot.querySelector(".badge");
    this.$title = this.shadowRoot.querySelector(".title");
    this.$horario = this.shadowRoot.querySelector(".horario");
    this.$ubic = this.shadowRoot.querySelector(".meta.ubic");
    this.$rating = this.shadowRoot.querySelector("cultura-rating");
  }

  attributeChangedCallback() { this.#render(); }

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

    // Rating vinculado al id del elemento (persistencia localStorage)
    if (id) this.$rating.setAttribute("item-id", id);

    // Badge: color estable según el nombre + iniciales
    const initials = this.#initials(nombre);
    const hue = this.#hashHue(nombre);
    this.$badge.textContent = initials || "📚";
    this.$badge.style.background = `hsl(${hue} 80% 50%)`;
  }

  #initials(text) {
    const parts = text.split(/\s+/).filter(Boolean).slice(0,2);
    return parts.map(p => p[0]).join("").toUpperCase();
  }
  #hashHue(text) {
    let h = 0;
    for (let i=0; i<text.length; i++) h = (h*31 + text.charCodeAt(i)) >>> 0;
    return h % 360;
  }
}
customElements.define("cultura-card", CulturaCard);
