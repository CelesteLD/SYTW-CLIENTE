# Ejercicio 1 — Web Components (Custom Element básico)

## Objetivo
Implementar un **Web Component mínimo** que:
- Defina un **custom element** (`<hola-mundo>`) con **Shadow DOM**.
- Renderice un saludo dinámico en función del **atributo** `name`.
- Reaccione a cambios del atributo mediante `observedAttributes` y `attributeChangedCallback`.

Este ejercicio persigue asentar los conceptos fundamentales de **Custom Elements**, **ciclo de vida** y **encapsulación de estilos** con **Shadow DOM**.

---

## Estructura del directorio
```
practica-3/
└─ ejercicio-1/
   ├─ index.html
   └─ src/
      └─ hola-mundo.js
```
- `index.html`: página de ejemplo que instancia el componente tres veces.
- `src/hola-mundo.js`: definición del custom element y su lógica de renderizado.

---

## Tecnologías y alcance
- **HTML5** + **JavaScript ES Modules** (sin bundler ni framework).
- **Web Components estándar**: `customElements`, `HTMLElement`, `ShadowRoot`.
- **Compatibilidad**: navegadores modernos. No se incluyen polyfills.

---

## Instalación y ejecución local
No requiere instalación de dependencias. Basta con servir archivos estáticos.

Opciones para levantar un servidor local (una de las siguientes):
- Extensión **Live Server** (VS Code).

Abrir `index.html` en el navegador (recomendado a través de un servidor local).

---

## Uso del componente
En `index.html` se instancian tres ejemplos:
```html
<hola-mundo name="Celeste"></hola-mundo>
<hola-mundo></hola-mundo>
<hola-mundo name="Mundo"></hola-mundo>
```
- Cuando **existe** el atributo `name`, el componente saluda con su valor.
- Cuando **no existe**, muestra un saludo **por defecto** (“Hola, Web Components!”).

---

## API del componente

### Tag
- `<hola-mundo></hola-mundo>`

### Atributos
- `name` *(opcional, string)*: nombre a saludar. Si no se establece, se usa el mensaje por defecto.

### Eventos
- No expone eventos personalizados en esta versión.

---

## Ciclo de vida y comportamiento
- **`constructor`**: crea y adjunta el **Shadow DOM**; define el template y estilos internos.
- **`connectedCallback()`**: se ejecuta al insertarse en el DOM; realiza el primer renderizado.
- **`static get observedAttributes()`**: indica que el componente observa el atributo `name`.
- **`attributeChangedCallback()`**: re-renderiza si cambia `name`.
- **Renderizado**: centralizado en un método privado `#render()` que decide el texto según `name`.

---

## Implementación (resumen)
**`src/hola-mundo.js`**:
```js
class HolaMundo extends HTMLElement {
  static get observedAttributes() { return ['name']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = \`
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
      <div class="muted">Soy un Web Component con Shadow DOM ✨</div>
    \`;
    this.$title = this.shadowRoot.querySelector('.title');
  }

  connectedCallback() { this.#render(); }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'name' && oldVal !== newVal) this.#render();
  }

  #render() {
    const nombre = this.getAttribute('name')?.trim();
    this.$title.textContent = nombre
      ? \`Hola, \${nombre}!\`
      : 'Hola, Web Components!';
  }
}
customElements.define('hola-mundo', HolaMundo);
```

---

## Pruebas (manuales)
1. Abrir la página y verificar que aparecen **tres tarjetas** con textos distintos.
2. En la consola del navegador, probar cambios dinámicos:
   ```js
   const el = document.querySelector('hola-mundo');
   el.setAttribute('name', 'Ada');   // Debe actualizar el saludo sin recargar
   el.removeAttribute('name');       // Debe volver al texto por defecto
   ```

---
