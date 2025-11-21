# SYTW-CLIENTE — Mapa del repositorio

Repositorio de prácticas de **Sistemas y Tecnologías Web** (cliente). A continuación se muestra la estructura del repositorio con las diferentes prácticas realizadas


---

## Estructura

```
SYTW-CLIENTE/
├─ practica-1/                 # Maquetación con Sass + Flex + Grid
├─ practica-2/
│  ├─ ejercicio-1/             # Gulp (Sass, autoprefixer, minify, imágenes, watch)
│  └─ ejercicio-2/             # Parcel (bundler) + GitHub Pages
├─ practica-3/                 # Web Components Nativos
│  ├─ ejercicio-1/             # Custom Element básico (Shadow DOM)
│  └─ ejercicio-2/             # App compleja (API, filtrado y localStorage)
├─ practica-4/                 # Gatsby (JAMStack) + GraphQL + Cypress E2E
└─ .gitignore
```

---

## 📁 `practica-1/`
**Qué hay:**  
Maquetación “landing” base usando **Sass**, **Flexbox** y **Grid**. Es el diseño que reutilizamos en las siguientes prácticas.

**Cómo verlo:**  
Abre el `index.html` con tu servidor estático favorito (por ejemplo, la extensión *Live Server* de VSCode).

---

## 📁 `practica-2/ejercicio-1/` — *Gulp pipeline*
**Qué hay:**  
Automatización con **Gulp**:
- Compilar **Sass → CSS** con *sourcemaps* en desarrollo.
- **Autoprefixer** y **minificado** de CSS en producción.
- **Copia/optimización de imágenes** (optimizadas solo en producción).
- **Minificado de JS** si existe `/src/js` (tolerante a que no haya JS).
- **Watch** para HTML/SCSS/IMG/JS. (Sin BrowserSync: previsualiza `dist/` con Live Server).

**Estructura clave:**  
```
ejercicio-1/
├─ src/            # HTML/SCSS/IMG (origen)
├─ dist/           # salida generada
├─ gulpfile.js
└─ package.json
```

**Comandos rápidos:**
```bash
cd practica-2/ejercicio-1
npm install
npm run dev      # compila y observa cambios; abre dist/index.html con Live Server
npm run build    # producción: CSS minificado + imágenes optimizadas
```

---

## 📁 `practica-2/ejercicio-2/` — *Parcel + GitHub Pages*
**Qué hay:**  
La misma landing, empaquetada con **Parcel** (sin Gulp) y desplegada en **GitHub Pages**. Parcel compila SCSS, procesa HTML, gestiona imágenes (hash) y minifica en producción.

**Estructura clave:**  
```
ejercicio-2/
├─ src/
│  ├─ index.html
│  ├─ scss/          # main.scss + parciales
│  └─ img/           # imágenes
└─ package.json
```

**Scripts (resumen):**
- `npm run dev` → servidor local (usa puerto 5173) y recarga en caliente.
- `npm run build` → producción para **GitHub Pages del repo** (usa `--public-url /SYTW-CLIENTE/`).
- `npm run build:local` → producción con **rutas relativas** (`./`) para abrir `dist/` con Live Server sin 404.
- `npm run deploy` → genera `dist` y publica en la rama `gh-pages`.

**Comandos rápidos:**
```bash
cd practica-2/ejercicio-2
npm install
npm run dev               # http://localhost:5173
npm run build             # build para Pages (repo /SYTW-CLIENTE/)
npm run deploy            # publica en branch gh-pages
```

**Demo publicada:**  
`https://celesteld.github.io/SYTW-CLIENTE/`

---

## Notas generales
- Para **previsualizar dist en local** sin problemas de rutas, usa la variante `build:local` cuando exista (Parcel) o abre `dist/` generado con Gulp usando Live Server.

---

## 📁 `practica-3/` — Web Components

### `ejercicio-1/` — Custom Element básico
- Implementación de `<hola-mundo>` con **Shadow DOM**.
- Acepta el atributo `name` y renderiza un saludo dinámico (fallback: “Hola, Web Components!”).
- Ciclo de vida usado: `constructor` → `connectedCallback()` → `attributeChangedCallback()`.
- **Cómo probar**: abrir `index.html` con Live Server.

### `ejercicio-2/` — Tarjetas + rating (5⭐) consumiendo JSON por CDN
- Vista de **tarjetas** minimalistas (sin imagen): **nombre**, **horario**, **municipio · CP** y **valoración**.
- **Componentes**:
  - `<cultura-app>`: carga/filtra datos y muestra grid de tarjetas. Permite buscar por nombre/municipio y filtrar por tipología (p. ej. `biblioteca`).
  - `<cultura-card>`: tarjeta sin imagen con badge de color + iniciales y el rating.
  - `<cultura-rating>`: control de **1–5 estrellas** con **persistencia en `localStorage`** por `item-id`.
- **Datos**: se consumen desde un repo público vía **jsDelivr** (CORS OK):
  ```
  https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json
  ```
  Formato esperado: `{ "espacios": [ { ... } ] }` (se usan los campos `espacio_cultura_nombre`, `horario`, `direccion_municipio_nombre`, `direccion_codigo_postal`, `espacio_cultural_id`/`id`).
- **Scripts** (`practica-3/ejercicio-2/scripts/`):
  - `transform.py`: normaliza/filtra el dataset original (`espacios.json`) y genera `db.json` compatible.
  - `db.json`: ejemplo de salida compatible con My JSON Server/jsDelivr.
- **Cómo probar**: abrir `practica-3/ejercicio-2/index.html` con Live Server.

---

## 📁 `practica-4/` — Gatsby (JAMStack + GraphQL)
**Qué hay:** Sitio web estático desarrollado con **Gatsby** (React) siguiendo la arquitectura **JAMStack**. Consume la misma API de espacios culturales que la práctica anterior, pero genera las páginas estáticamente en tiempo de construcción (*build time*).

**Características principales:**
- **Generación de páginas dinámica**: Uso de `gatsby-node.js` y la API `createPages` para generar automáticamente una ruta (`/espacio/:id`) por cada ítem del JSON externo.
- **Micro-frontends**: Arquitectura basada en componentes reutilizables (`<Header>`, `<Layout>`, `<CartaEspacio>`).
- **Interactividad y Persistencia**: Los componentes de **Valoración** y **Noticias** son interactivos y utilizan `localStorage` para persistir los datos del usuario en el navegador (sin backend).
- **GraphQL**: Gestión de la capa de datos para alimentar tanto la página de inicio (listado) como las plantillas de detalle.
- **Calidad**:
  - **Accesibilidad**: Verificación mediante `eslint-plugin-jsx-a11y`.
  - **Testing E2E**: Pruebas de flujo completo (navegación e interacción) con **Cypress**.

**Comandos rápidos:**
```bash
cd practica-4
npm install
npm run develop   # Inicia servidor en http://localhost:8000 + GraphiQL
npx cypress open  # Abre la suite de tests E2E
```


---
## Enlaces internos útiles
- [Práctica 1](./practica-1/)
- [Práctica 2 — Ejercicio 1 (Gulp)](./practica-2/ejercicio-1/)
- [Práctica 2 — Ejercicio 2 (Parcel)](./practica-2/ejercicio-2/)
- [Práctica 3 - Ejercicio 1 (Hola mundo)](./practica-3/ejercicio-1/)
- [Práctica 3 - Ejercicio 2 (WebComponents + complejo)](./practica-3/ejercicio-2/)
- [Práctica 4 - Gatsby (JAMStack)](./practica4/practica-gatsby/)