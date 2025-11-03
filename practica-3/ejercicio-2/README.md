# Espacios Culturales — Web Components

> Proyecto de práctica con **Web Components nativos** (sin frameworks) para listar espacios culturales (bibliotecas, museos, centros culturales) consumiendo un JSON remoto y permitiendo **valorar con estrellas y comentar** cada tarjeta.  
> Tecnologías: HTML + ES Modules + Custom Elements + Shadow DOM + CSS por componentes.

---

## 🧭 ¿Qué hace este repositorio?

- Carga un dataset público alojado en GitHub (vía jsDelivr) con información de espacios culturales.
- Lo **presenta en tarjetas** con nombre, municipio/CP, un botón a la web oficial si existe y un **badge** de color basado en el nombre.
- Implementa un **sistema de rating (1–5 estrellas) + comentarios** por espacio, persistido en `localStorage` del navegador.
- Todo ello está construido con **Web Components** desacoplados y reutilizables:

```
<cultura-app>  -> orquesta la carga, filtros y el grid de resultados
  └─ <cultura-card> -> tarjeta individual (UI + accesos)
       └─ <cultura-rating> -> valoración por estrellas + comentarios (persistencia local)
```

---

## 📁 Estructura del proyecto

```
.
├── README.md            # Este documento
├── index.html           # Punto de entrada (sin build; ES Modules nativos)
└── src
    ├── components
    │   ├── app.js      # <cultura-app>: carga datos, pinta grid y filtra
    │   ├── card.js     # <cultura-card>: UI de tarjeta + badge + enlace web
    │   └── rating.js   # <cultura-rating>: estrellas + comentarios (localStorage)
    └── styles
        ├── app.css
        ├── card.css
        └── rating.css
```

> **Nota**: La carpeta `scripts/` existe en el repo, pero **no se explica en este caso**, pues se ha utilizado este repositorio en partes previas a la práctica para modificar la estructura del JSON "espacios".

---

## ▶️ Cómo ejecutar en local

1. Clona el repo y **abre `index.html` con un servidor estático** (recomendado *Live Server* de VSCode) para evitar políticas de CORS con `fetch`:
   - VSCode → botón derecho sobre `index.html` → **Open with Live Server**.
2. Deberías ver el título y el componente `<cultura-app>` funcionando con filtros y búsqueda.

---

## 🧩 Piezas y cómo se hablan entre sí

### 1) `<cultura-app>` — *el director de orquesta* (`src/components/app.js`)

- Observa atributos: `data-url` (JSON remoto) y `filtro` (tipología inicial).
- Monta una **toolbar** con:
  - `<select id="tipo">` de tipologías: `biblioteca | museo | centro_cultural`
  - `<input type="search">` para buscar por **nombre o municipio**.
- Hace `fetch(this.url)` y acepta tanto `[{...}]` como `{ espacios: [...] }`.
- Filtra por:
  - **banderines** booleanos en el JSON (`biblioteca|museo|centro_cultural`) mediante `#isYes()`,
  - y **texto** en nombre/municipio (case-insensitive).
- Pinta el grid creando **instancias de** `<cultura-card>` y **pasando atributos**:
  - `id-espacio`, `nombre`, `horario` (normalizado), `municipio`, `cp`, `web`, `img` (reservado para mejoras).
- Eventos: no necesita escuchar eventos de hijo en esta versión (los rating y comentarios son locales al navegador).

**Atributos soportados** por `<cultura-app>`:

| Atributo   | Tipo    | Descripción                                              |
|------------|---------|----------------------------------------------------------|
| `data-url` | string  | URL del JSON remoto a cargar.                            |
| `filtro`   | string  | Tipología inicial (`biblioteca` por defecto).            |

**Ejemplo de uso** (ver `index.html`):

```html
<cultura-app
  data-url="https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json"
  filtro="biblioteca">
</cultura-app>
```

---

### 2) `<cultura-card>` — *la tarjeta de cada lugar* (`src/components/card.js`)

- Encapsula su estilo con **Shadow DOM** y carga `../styles/card.css`.
- Muestra:
  - **Badge** con iniciales del nombre (`AB` de “Aula Biblioteca”). El color se genera con `#hashHue(nombre)` → un **HSL** estable por texto.
  - **Título** (nombre).
  - **Acciones**: si existe URL válida, pinta botón “Visitar web”; si no, muestra “Página web no disponible”.
  - **Ubicación**: `municipio · cp`.
  - **Slot rating**: un `<cultura-rating>` interno enlazado por `item-id` para persistir por espacio.
- **Sanitiza** la URL con `#sanitizeURL()` y fuerza `https://...`.
- Atributos observados: `id-espacio`, `nombre`, `municipio`, `cp`, `web`.

**Accesibilidad**:

- El botón de la web incluye `aria-label` con el nombre del espacio.
- `part="actions"` en el contenedor de acciones por si quieres **estilizar desde fuera**.

---

### 3) `<cultura-rating>` — *la historia del feedback* (`src/components/rating.js`)

> Imagina una mini app dentro de la tarjeta que **recuerda** lo que opinaste la última vez.  
> No hay backend ni login: tus valoraciones y comentarios viven en tu **navegador**.

#### 🗂️ Punto 1: La memoria (localStorage)
- Dos claves de almacenamiento:
  - `cultura_feedback_v1` → **estructura actual** `{ [itemId]: { rating: number, comments: Array<Comment> } }`
  - `cultura_ratings_v1` → **estructura antigua** `{ [itemId]: number }` (solo puntuación)
- Al cargar el componente se ejecuta **una migración** automática:
  - Si encuentra la clave antigua, la transforma a la nueva **sin perder tu puntuación**.

```js
// Migración resumida
const old = readJSON(LS_RATINGS_OLD, null);
const cur = readJSON(LS_FEEDBACK, {});
if (old) for (const [id, rating] of Object.entries(old)) {
  cur[id] = cur[id] || { rating: 0, comments: [] };
  if (!cur[id].rating) cur[id].rating = rating;
}
writeJSON(LS_FEEDBACK, cur);
```

#### ⭐ Punto 2: Las estrellas
- Se renderizan 5 botones “estrella” (`★/☆`) con `aria-pressed` y **título accesible**.
- Al hacer click:
  1. Se asegura que hay `item-id` (si no, deshabilita y avisa).
  2. Guarda el `rating` (1..5) con `store.setRating()`.
  3. Actualiza la UI y emite el evento `rating-change` con `{ id, rating }` por si algún día quieres escuchar desde fuera.

```js
this.dispatchEvent(new CustomEvent("rating-change", { detail: { id, rating: v } }));
```

#### 💬 Punto 3: Los comentarios
- Textarea limitado a **240** caracteres con contador vivo.
- Antes de guardar:
  - **Escapa HTML** (`escapeHTML`) → evita XSS al pintar comentarios.
  - Valida longitud mínima (≥3) y máxima (≤240).
- Cada comentario se guarda con:
  - `id` único (`crypto.randomUUID()` si está disponible),
  - `ts` (timestamp),
  - `text` escapado.
- Puedes **eliminar** cualquier comentario y se refleja al instante.

#### 🧱 Punto 4: La pared invisible (Shadow DOM + a11y)
- El componente es **autónomo**: su CSS y DOM no chocan con el resto.
- Anuncia cambios al lector de pantalla con `aria-live` en la lista de comentarios.
- Deshabilita interacciones si falta `item-id`, con `title` explicativo.

#### 🧰 API del componente
- Atributos observados: `item-id` (obligatorio para persistir).
- **Eventos** que emite:
  - `rating-change` → `{ id, rating }`
  - `comment-add` → `{ id, comment }`
  - `comment-remove` → `{ id, commentId }`

**Ejemplo embebido en la tarjeta**:

```html
<cultura-rating item-id="123"></cultura-rating>
```

---

## 🎛️ Personalización y estilos

- Cada componente trae su **CSS propio** (`app.css`, `card.css`, `rating.css`) que se inyecta con `<link>` dentro del Shadow DOM.
- Puedes **temar** desde fuera usando `::part(actions)` en la card o variables CSS que expone `rating` (p. ej. `--cr-textarea-min` para alto mínimo del textarea).
- El badge de la card usa HSL con un **hue** derivado del nombre: consistente y variado.

---

## 🛡️ Seguridad y calidad

- URL externas **sanitizadas**: sólo se aceptan dominios con pinta válida y se fuerza `https://`.
- Comentarios **escapados** (sin HTML) para evitar inyecciones.
- Interfaz **accesible**: labels, `aria-live`, `aria-pressed`, `role="group"`, `aria-label` y textos alternativos.

---

## 📌 Referencia rápida (atributos)

| Componente        | Atributo        | Descripción                                               |
|-------------------|-----------------|-----------------------------------------------------------|
| `<cultura-app>`   | `data-url`      | URL del JSON remoto.                                      |
|                   | `filtro`        | Tipología inicial (`biblioteca` por defecto).             |
| `<cultura-card>`  | `id-espacio`    | Identificador del espacio (propaga a rating).             |
|                   | `nombre`        | Texto del título.                                         |
|                   | `municipio`     | Municipio.                                                |
|                   | `cp`            | Código postal.                                            |
|                   | `web`           | URL de la web (se valida/sanitiza).                       |
| `<cultura-rating>`| `item-id`       | ID obligatorio para asociar rating/comentarios.          |

---

## 🧩 `index.html` mínimo

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Ejercicio 2 — Espacios culturales</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="font-family: system-ui, Arial, sans-serif; margin: 20px;">
    <h1>👩🏽‍💻 Espacios culturales — Web Components 👩🏽‍💻</h1>

    <cultura-app
      data-url="https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json"
      filtro="biblioteca">
    </cultura-app>

    <script type="module" src="./src/components/rating.js"></script>
    <script type="module" src="./src/components/card.js"></script>
    <script type="module" src="./src/components/app.js"></script>
  </body>
</html>
```
