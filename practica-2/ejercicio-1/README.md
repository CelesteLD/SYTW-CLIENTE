# Práctica 2 — Ejercicio 1 (Sass + Grid/Flex + Gulp

Este proyecto parte del layout de la práctica anterior y añade **automatización con Gulp** para mejorar el flujo de trabajo.

## ¿Qué hace el *build system*?

- **Compilar Sass a CSS** con *sourcemaps* en desarrollo.
- **Autoprefixer** para compatibilidad de CSS.
- **Minificar CSS** en *build* de producción.
- **Imágenes**:
  - **Dev**: **copia 1:1** (byte a byte) desde `src/img` a `dist/img` para evitar corrupciones durante el desarrollo.
  - **Build**: **optimiza imágenes** (JPG/PNG/SVG) con `gulp-imagemin` y plugins.
- **Minificar JS** en producción (si existe carpeta `src/js`).
- **Watch**: recompila automáticamente al cambiar HTML, SCSS, imágenes o JS.
- **Sin servidor integrado**: usa **Live Server** (u otro estático) sobre `dist/`.

> Nota: en producción, `gulp-imagemin` puede mostrar *“Minified 0 images”* si los archivos ya están muy optimizados; es normal, igualmente se copian a `dist/img`.

---

## Estructura recomendada

```
ejercicio-1/
├─ src/
│  ├─ scss/
│  │  ├─ base/ _base.scss
│  │  ├─ layout/ _header.scss …
│  │  ├─ _variables.scss
│  │  ├─ _mixins.scss
│  │  └─ main.scss          # ← entry de Sass
│  ├─ img/                  # ← imágenes fuente (logo-empresa.jpg, ull.png, …)
│  ├─ js/                   # ← (opcional) ficheros JS
│  └─ index.html            # ← HTML fuente
├─ dist/                    # ← salida generada (no se commitea)
├─ gulpfile.js
├─ package.json
└─ README.md
```

En `src/index.html` enlaza los recursos **relativos a `dist/`** (cuando se abre con Live Server):

```html
<link rel="stylesheet" href="./css/style.css">
<img src="./img/logo-empresa.jpg" alt="">
<img src="./img/ull.png" alt="">
```

---

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+
- Extensión **Live Server** de VSCode (o cualquier servidor estático simple)

---

## Instalación

```bash
# En la carpeta ejercicio-1
npm install
```

Dependencias dev usadas (se instalan con el comando anterior):
- Base: `gulp`, `gulp-sass`, `sass`, `gulp-sourcemaps`, `gulp-postcss`
- CSS: `autoprefixer`, `cssnano`
- JS: `gulp-if`, `gulp-concat`, `gulp-uglify`
- Utilidades: `del`, `fast-glob`, `cross-env`
- **Optimización de imágenes (build):** `gulp-imagemin`, `imagemin-mozjpeg`, `imagemin-pngquant`, `imagemin-svgo`

> Si te falta alguna, se puede reinstalar con:  
> ```bash
> npm i -D gulp gulp-sass sass gulp-sourcemaps gulp-postcss autoprefixer cssnano >        gulp-if gulp-concat gulp-uglify del fast-glob cross-env >        gulp-imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo
> ```

---

## Scripts de npm

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development gulp",
    "build": "cross-env NODE_ENV=production gulp build"
  }
}
```

- `npm run dev` → compila todo y **observa cambios** (watch). Abre `dist/index.html` con **Live Server**.
- `npm run build` → **producción**: limpia, compila, **minifica CSS**, **minifica JS** (si hay) y **optimiza imágenes** a `dist/img`.

---

## Tareas de Gulp (lo que hace cada una)

> Todas las tareas están en **`gulpfile.js`**.

### `sass`
- **Entrada:** `src/scss/main.scss`
- **Proceso:**
  - Compila Sass → CSS
  - Añade prefijos con **Autoprefixer**
  - Genera **sourcemaps** si `NODE_ENV=development`
  - Renombra a **`style.css`**
- **Salida:** `dist/css/style.css` (+ `style.css.map` en dev)

### `minify-css`
- Minifica `dist/css/style.css` usando **cssnano**.
- Se ejecuta automáticamente en `npm run build`.

### `images`
- **Dev:** limpia `dist/img` y **copia 1:1** todo `src/img/**/*` → `dist/img` (sin transformar).
- **Build:** limpia `dist/img` y **optimiza** con `gulp-imagemin`:
  - **JPG:** `imagemin-mozjpeg` (calidad ~80, progressive)
  - **PNG:** `imagemin-pngquant` (calidad ~0.7–0.85)
  - **SVG:** `imagemin-svgo` (mantiene `viewBox`, limpia IDs)
- Si no hay reducción posible, puede reportar “0 imágenes minificadas”.

### `js`
- Si existe `src/js`, concatena en `dist/js/app.js`.
- **Minifica** cuando `NODE_ENV=production` (en `npm run build`).

### `watch`
- Observa cambios en:
  - `src/**/*.html` → copia a `dist/`
  - `src/scss/**/*.scss` → `sass`
  - `src/img/**/*` → `images` (copia/optimiza según modo)
  - `src/js/**/*.js` → `js` (si existe)
- **No** levanta servidor (usa **Live Server**).

### `build`
- Pipeline de producción: `clean` → `html + sass + js` → `minify-css + images (optimizadas)`
- **Resultado:** `dist/` lista para entrega/demo.

### `default`
- Ejecuta `build` y, a continuación, `watch` (ideal para trabajar en local).

---

## Flujo de trabajo recomendado

1. **Desarrollo**
   ```bash
   npm run dev
   ```
   - Deja el watcher corriendo.
   - Abre **`dist/index.html`** con **Live Server**.
   - Edita en `src/…` (HTML/SCSS/IMG/JS). Los cambios se vuelcan a `dist/` automáticamente.

2. **Entrega / Producción**
   ```bash
   npm run build
   ```
   - Entrega la carpeta `dist/` (CSS minificado, JS minificado si existe e **imágenes optimizadas**).

---

## Consejos / Problemas frecuentes

- **“gulp-imagemin: Minified 0 images”**
  - Suele indicar que las imágenes ya estaban optimizadas o que no hay optimización posible
  - Asegúrate de que los archivos resultantes están en `dist/img/`.

- **No tengo JS**
  - La tarea `js` no falla si no existe `src/js`, se ignora sin crear la carpeta.

---

## Notas

- El flujo separa **desarrollo** (copia binaria) y **producción** (optimización) para evitar problemas de corrupción durante el desarrollo y, a la vez, cumplir con la optimización requerida en la entrega.
