const LS_KEY = "cultura_ratings_v1";
const loadMap = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const saveMap = (m) => localStorage.setItem(LS_KEY, JSON.stringify(m));

class CulturaRating extends HTMLElement {
  static get observedAttributes() { return ["item-id"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .wrap { display:inline-flex; gap:4px; align-items:center; }
        button.star {
          appearance:none; background:none; border:none; padding:0; font-size:20px; line-height:1; cursor:pointer;
        }
        button.star[aria-pressed="true"] { filter: drop-shadow(0 0 2px rgba(0,0,0,.2)); }
        .count { font-size:.9rem; color:#666; margin-left:6px; }
      </style>
      <div class="wrap" role="group" aria-label="Valoración">
        ${[1,2,3,4,5].map(i => `<button class="star" data-v="${i}" aria-label="${i} estrellas" aria-pressed="false">☆</button>`).join("")}
        <span class="count" aria-live="polite"></span>
      </div>
    `;
    this.$stars = [...this.shadowRoot.querySelectorAll("button.star")];
    this.$count = this.shadowRoot.querySelector(".count");
    this.$stars.forEach(b => b.addEventListener("click", () => this.#set(parseInt(b.dataset.v, 10))));
  }

  attributeChangedCallback() { this.#render(); }

  #get() {
    const id = this.getAttribute("item-id");
    const map = loadMap();
    return { id, map, val: id ? (map[id] ?? 0) : 0 };
  }

  #set(v) {
    const { id, map } = this.#get();
    if (!id) return;
    map[id] = v;
    saveMap(map);
    this.#render();
  }

  #render() {
    const { val } = this.#get();
    this.$stars.forEach((b, i) => {
      const filled = i < val;
      b.textContent = filled ? "★" : "☆";
      b.setAttribute("aria-pressed", String(filled));
    });
    this.$count.textContent = val ? `${val}/5` : "Sin valorar";
  }
}
customElements.define("cultura-rating", CulturaRating);
