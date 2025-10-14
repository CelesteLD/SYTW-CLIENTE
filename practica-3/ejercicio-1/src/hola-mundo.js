// Un nombre de custom element SIEMPRE lleva guion: "hola-mundo"
class HolaMundo extends HTMLElement {
  static get observedAttributes() {
    return ['name']; // Observamos cambios del atributo "name"
  }

  constructor() {
    super();
    // Creamos Shadow DOM para encapsular estilo y markup
    this.attachShadow({ mode: 'open' });
    // Estructura base
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #ddd;
          box-shadow: 0 1px 4px rgba(0,0,0,.06);
          background: #fff;
          margin: 8px 0;
        }
        .title { font-weight: 600; }
        .muted { color: #666; font-size: .95rem; }
      </style>
      <div class="title"></div>
      <div class="muted">Soy un Web Component con Shadow DOM</div>
    `;
    this.$title = this.shadowRoot.querySelector('.title');
  }

  connectedCallback() {
    // Se llama cuando el elemento entra en el DOM
    this.#render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'name' && oldVal !== newVal) this.#render();
  }

  // Renderiza el saludo usando el atributo "name" (con fallback)
  #render() {
    const nombre = this.getAttribute('name')?.trim();
    this.$title.textContent = nombre ? `Hola, ${nombre}!` : 'Hola, Web Components!';
  }
}

// Registramos el custom element
customElements.define('hola-mundo', HolaMundo);
