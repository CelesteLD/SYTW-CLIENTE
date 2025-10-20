class CulturaCard extends HTMLElement {
  static get observedAttributes() {
    return ["id-espacio", "nombre", "municipio", "cp", "web"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const cssURL = new URL("../styles/card.css", import.meta.url);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL;

    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <div class="wrap">
        <div class="head">
          <div class="badge" aria-hidden="true">📚</div>
          <div class="title"></div>
        </div>

        <div class="actions" part="actions"></div>

        <cultura-rating class="rating"></cultura-rating>
        <div class="ubic"></div>
      </div>
    `;
    this.shadowRoot.append(link, tpl.content.cloneNode(true));

    this.$badge   = this.shadowRoot.querySelector(".badge");
    this.$title   = this.shadowRoot.querySelector(".title");
    this.$ubic    = this.shadowRoot.querySelector(".ubic");
    this.$rating  = this.shadowRoot.querySelector("cultura-rating");
    this.$actions = this.shadowRoot.querySelector(".actions");
  }

  attributeChangedCallback() { this.#render(); }

  #render() {
    const nombre    = (this.getAttribute("nombre") || "Sin nombre").trim();
    const municipio = (this.getAttribute("municipio") || "").trim();
    const cp        = (this.getAttribute("cp") || "").trim();
    const id        = this.getAttribute("id-espacio") || "";
    const webRaw    = (this.getAttribute("web") || "").trim();

    this.$title.textContent = nombre;
    this.$ubic.textContent = [municipio, cp].filter(Boolean).join(" · ");
    if (id) this.$rating.setAttribute("item-id", id);

    const initials = this.#initials(nombre);
    const hue = this.#hashHue(nombre);
    this.$badge.textContent = initials || "📚";
    this.$badge.style.background = `hsl(${hue} 80% 50%)`;


    this.$actions.replaceChildren();
    const url = this.#sanitizeURL(webRaw);

    if (url) {
      const a = document.createElement("a");
      a.className = "btn-link";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", `Abrir web de ${nombre}`);
      a.textContent = "Visitar web";
      this.$actions.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.className = "no-web";
      span.textContent = "Página web no disponible";
      this.$actions.appendChild(span);
    }

    // Scroll global: solo fijo textarea, no limito comments
    this.$rating.style.setProperty("--cr-textarea-min", "40px");
  }

  #sanitizeURL(raw) {
    let v = (raw || "").trim();
    if (!v || /^_u$/i.test(v)) return "";
    v = v.replace(/^https?:\/\//i, "");
    if (!/[a-z0-9-]+\.[a-z]{2,}/i.test(v)) return "";
    return `https://${v}`;
  }

  #initials(text) {
    const parts = text.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map(p => p[0]).join("").toUpperCase();
  }

  #hashHue(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h*31 + text.charCodeAt(i)) >>> 0;
    return h % 360;
  }
}

customElements.define("cultura-card", CulturaCard);
