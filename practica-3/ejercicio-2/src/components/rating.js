// src/components/rating.js
// Componente <cultura-rating>
// Gestiona 5 estrellas + lista de comentarios con persistencia localStorage.
//
// Notas de diseño:
// - Mantengo la migración de una clave antigua a la nueva estructura.
// - El estado (rating + comments) se centraliza en "store" con helpers get/set.
// - Emite eventos personalizados "rating-change", "comment-add", "comment-remove"
//   por si en el futuro quiero reaccionar desde fuera.
// - CSS separado en /src/styles/rating.css y cargado con <link>.

const LS_RATINGS_OLD = "cultura_ratings_v1";
const LS_FEEDBACK = "cultura_feedback_v1";

// Helpers JSON seguros
const readJSON = (k, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Migración de estructura antigua -> nueva (id -> { rating, comments[] })
(function migrate() {
  const old = readJSON(LS_RATINGS_OLD, null);
  const cur = readJSON(LS_FEEDBACK, {});
  if (old && Object.keys(old).length) {
    for (const [id, rating] of Object.entries(old)) {
      cur[id] = cur[id] || { rating: 0, comments: [] };
      if (!cur[id].rating) cur[id].rating = rating;
    }
    writeJSON(LS_FEEDBACK, cur);
    // localStorage.removeItem(LS_RATINGS_OLD); // opcional
  }
})();

// "Store" muy simple sobre localStorage
const store = {
  getState(id) {
    const db = readJSON(LS_FEEDBACK, {});
    return db[id] || { rating: 0, comments: [] };
  },
  setRating(id, rating) {
    const db = readJSON(LS_FEEDBACK, {});
    db[id] = db[id] || { rating: 0, comments: [] };
    db[id].rating = rating;
    writeJSON(LS_FEEDBACK, db);
  },
  addComment(id, text) {
    const db = readJSON(LS_FEEDBACK, {});
    db[id] = db[id] || { rating: 0, comments: [] };
    const comment = {
      id: (crypto && crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
      text,
      ts: Date.now(),
    };
    db[id].comments.unshift(comment);
    writeJSON(LS_FEEDBACK, db);
    return comment;
  },
  removeComment(id, commentId) {
    const db = readJSON(LS_FEEDBACK, {});
    if (!db[id]) return;
    db[id].comments = db[id].comments.filter((c) => c.id !== commentId);
    writeJSON(LS_FEEDBACK, db);
  },
};

// Utils
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const escapeHTML = (s) =>
  s.replace(/[&<>"'`]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
  })[c]);
const fmtDate = (ts) => new Date(ts).toLocaleString();

// Web Component
class CulturaRating extends HTMLElement {
  static get observedAttributes() {
    return ["item-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // CSS externo
    const cssURL = new URL("../styles/rating.css", import.meta.url);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL;

    // DOM vía <template> (Safari-safe)
    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <div class="wrap">
        <div class="rating-row" role="group" aria-label="Valoración" part="rating-row">
          ${[1,2,3,4,5].map(i => `<button class="star" data-v="${i}" aria-label="${i} estrellas" aria-pressed="false">☆</button>`).join("")}
          <span class="count" aria-live="polite">Sin valorar</span>
        </div>

        <hr class="hr" aria-hidden="true"/>

        <form novalidate part="form">
          <label class="sr-only" for="cmt">Escribe un comentario</label>
          <textarea id="cmt" name="cmt" maxlength="240" placeholder="Añade un comentario (máx. 240 caracteres)"></textarea>
          <div class="row">
            <span class="muted"><span id="left">240</span> caracteres restantes</span>
            <div class="actions">
              <button type="submit" class="primary">Publicar</button>
            </div>
          </div>
          <div class="error" id="err" role="alert" style="display:none;"></div>
        </form>

        <ul class="comments" aria-live="polite" aria-label="Comentarios" part="comments"></ul>
      </div>
    `;

    this.shadowRoot.append(link, tpl.content.cloneNode(true));

    // Refs
    this.$stars = [...this.shadowRoot.querySelectorAll("button.star")];
    this.$count = this.shadowRoot.querySelector(".count");
    this.$form  = this.shadowRoot.querySelector("form");
    this.$ta    = this.shadowRoot.querySelector("textarea");
    this.$left  = this.shadowRoot.querySelector("#left");
    this.$err   = this.shadowRoot.querySelector("#err");
    this.$list  = this.shadowRoot.querySelector(".comments");

    // Eventos
    this.$stars.forEach(b => b.addEventListener("click", () => this.#setRating(parseInt(b.dataset.v, 10))));
    this.$ta.addEventListener("input", () => this.#updateCounter());
    this.$form.addEventListener("submit", (e) => { e.preventDefault(); this.#submitComment(); });
  }


  connectedCallback() {
    this.#renderAll();
  }
  attributeChangedCallback() {
    this.#renderAll();
  }

  // === Helpers de estado ===
  #getId() {
    return this.getAttribute("item-id") || "";
  }
  #disabled() {
    return !this.#getId();
  }

  // === Rating ===
  #setRating(v) {
    const id = this.#getId();
    if (!id) return;
    store.setRating(id, clamp(v, 1, 5));
    this.#renderRating();
    this.dispatchEvent(new CustomEvent("rating-change", { detail: { id, rating: v } }));
  }

  #renderRating() {
    const id = this.#getId();
    const { rating } = store.getState(id);
    this.$stars.forEach((b, i) => {
      const filled = i < rating;
      b.textContent = filled ? "★" : "☆";
      b.setAttribute("aria-pressed", String(filled));
      b.disabled = this.#disabled();
      b.style.cursor = this.#disabled() ? "not-allowed" : "pointer";
      b.title = this.#disabled()
        ? "Falta item-id en el componente"
        : `${i + 1} estrellas`;
    });
    this.$count.textContent = rating ? `${rating}/5` : "Sin valorar";
  }

  // === Comentarios ===
  #updateCounter() {
    const max = parseInt(this.$ta.getAttribute("maxlength") || "240", 10);
    const left = Math.max(0, max - (this.$ta.value || "").length);
    this.$left.textContent = left;
  }

  #submitComment() {
    const id = this.#getId();
    if (!id) return this.#showError("No se puede comentar sin un item-id.");

    const raw = (this.$ta.value || "").trim();
    const text = escapeHTML(raw);
    const len = text.length;

    if (len < 3) return this.#showError("El comentario es demasiado corto.");
    if (len > 240) return this.#showError("Te has pasado del límite de 240 caracteres.");

    const c = store.addComment(id, text);
    this.$ta.value = "";
    this.#updateCounter();
    this.#hideError();
    this.#prependComment(c);
    this.dispatchEvent(new CustomEvent("comment-add", { detail: { id, comment: c } }));
  }

  #removeComment(commentId) {
    const id = this.#getId();
    store.removeComment(id, commentId);
    const li = this.shadowRoot.querySelector(`li[data-id="${commentId}"]`);
    if (li) li.remove();
    this.dispatchEvent(new CustomEvent("comment-remove", { detail: { id, commentId } }));
  }

  #renderComments() {
    const { comments } = store.getState(this.#getId());
    this.$list.innerHTML = "";
    comments.forEach((c) => this.#appendComment(c));
  }

  #appendComment(c) {
    const li = document.createElement("li");
    li.className = "comment";
    li.dataset.id = c.id;
    li.innerHTML = `
      <div class="meta">
        <span>Anon</span>
        <span>·</span>
        <time datetime="${new Date(c.ts).toISOString()}">${fmtDate(c.ts)}</time>
        <span class="actions"><button class="del" aria-label="Eliminar comentario">Eliminar</button></span>
      </div>
      <div class="txt">${c.text}</div>
    `;
    li.querySelector(".del").addEventListener("click", () => this.#removeComment(c.id));
    this.$list.appendChild(li);
  }

  #prependComment(c) {
    const li = document.createElement("li");
    li.className = "comment";
    li.dataset.id = c.id;
    li.innerHTML = `
      <div class="meta">
        <span>Anon</span>
        <span>·</span>
        <time datetime="${new Date(c.ts).toISOString()}">${fmtDate(c.ts)}</time>
        <span class="actions"><button class="del" aria-label="Eliminar comentario">Eliminar</button></span>
      </div>
      <div class="txt">${c.text}</div>
    `;
    li.querySelector(".del").addEventListener("click", () => this.#removeComment(c.id));
    this.$list.prepend(li);
  }

  // === Errores UI ===
  #showError(msg) {
    this.$err.textContent = msg;
    this.$err.style.display = "block";
  }
  #hideError() {
    this.$err.textContent = "";
    this.$err.style.display = "none";
  }

  // === Render global ===
  #renderAll() {
    this.#renderRating();
    this.#renderComments();
    this.#updateCounter();
  }
}

customElements.define("cultura-rating", CulturaRating);
