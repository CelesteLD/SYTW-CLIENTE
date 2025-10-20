# Práctica Web Components — Espacios Culturales (Refactor)

Este proyecto muestra una pequeña app de **Web Components** que lista espacios culturales (bibliotecas, museos, centros culturales), con tarjetas y un componente de valoración + comentarios con persistencia en `localStorage`.

La refactorización separa **lógica** (JavaScript) y **estilos** (CSS) por componente, mejora la **compatibilidad con navegadores** y mantiene la **encapsulación** mediante Shadow DOM.

---

## 🗂️ Estructura del proyecto

```
/src
  /components         # Lógica (Web Components)
    app.js            # <cultura-app> -> carga datos, filtros y grilla
    card.js           # <cultura-card> -> tarjeta por espacio
    rating.js         # <cultura-rating> -> 5★ + comentarios (localStorage)
  /styles             # Estilos de cada componente
    app.css
    card.css
    rating.css
index.html            # punto de entrada
```

Cada componente carga **su CSS** con `<link rel="stylesheet">` dentro del Shadow DOM usando rutas de ES Modules:

```js
const cssURL = new URL("../styles/card.css", import.meta.url);
link.rel = "stylesheet";
link.href = cssURL;
shadowRoot.appendChild(link);
```

> Ventajas: separación real CSS/JS, código más limpio y mantenible, y estilos encapsulados por componente.

---

## ▶️ Ejecutar en local

1. **Servir por HTTP** (no abrir con `file://`). Por ejemplo, usando Live Server (VS Code) o cualquier servidor estático.
2. Asegura que el `index.html` referencia las **nuevas rutas** (`src/components/*.js`).

Ejemplo de `index.html` mínimo:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Espacios culturales — Bibliotecas</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="font-family: system-ui, Arial, sans-serif; margin: 20px;">
    <h1>Espacios culturales — Bibliotecas</h1>

    <cultura-app
      data-url="https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json"
      filtro="biblioteca"
    ></cultura-app>

    <!-- Cargar módulos en orden para evitar “upgrades” tardíos -->
    <script type="module" src="./src/components/rating.js"></script>
    <script type="module" src="./src/components/card.js"></script>
    <script type="module" src="./src/components/app.js"></script>
  </body>
</html>
```

---

## 🧩 Componentes y responsabilidades

### `<cultura-app>`
- Carga el JSON desde `data-url` (acepta **array** o `{ espacios: [...] }`).
- Filtro por **tipología** (`biblioteca`, `museo`, `centro_cultural`) y **búsqueda de texto** (nombre + municipio).
- Pinta una cuadrícula de `<cultura-card>` usando `replaceChildren()`.
- Muestra estados: **Cargando…**, **Error cargando datos**, **No hay resultados**.
- Estilos: `src/styles/app.css` (toolbar y grid).

### `<cultura-card>`
- Presenta: **nombre**, **horario**, **municipio · CP** y el subcomponente `<cultura-rating>`.
- Calcula **iniciales** y **color HSL** estable para el badge a partir del nombre (hash).
- Pasa `id-espacio` a `<cultura-rating>` como `item-id` para persistencia.
- Ajusta el tamaño del comentario vía **CSS Custom Properties**.
- Estilos: `src/styles/card.css` (con `::part(...)` listo para afinar rating desde fuera).

### `<cultura-rating>`
- 5 estrellas + lista de comentarios con persistencia en `localStorage` (`cultura_feedback_v1`).
- **Migración** desde una clave antigua (`cultura_ratings_v1`) para no perder datos.
- Expone eventos personalizados: `rating-change`, `comment-add`, `comment-remove`.
- Accesibilidad: `role="group"`, `aria-label`, `aria-live`, `sr-only` y `maxlength`.
- Estilos: `src/styles/rating.css` (tamaños parametrizables con Custom Props).

---

## ♿ Accesibilidad y UX

- `aria-live` para actualizar estado de valoración y comentarios.
- `role="group"` en el bloque de estrellas, `aria-pressed` en cada estrella.
- `label` oculto (`.sr-only`) para el `textarea`.
- Validaciones básicas: longitud mínima/máxima del comentario y feedback de error.

---

## 🧱 Detalles de implementación

- **Shadow DOM**: encapsula estilos y estructura, evitando colisiones globales.
- **Carga de CSS**: `<link rel="stylesheet">` + `new URL(..., import.meta.url)` para rutas robustas en módulos.
- **Rendimiento**: uso de `replaceChildren()` al repintar; grid responsiva con `auto-fill, minmax(...)`.
- **Persistencia**: estado `{ rating, comments[] }` por `item-id` con helpers de lectura/escritura seguros.

