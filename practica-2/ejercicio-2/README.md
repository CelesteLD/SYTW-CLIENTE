# Práctica 2 — Ejercicio 2 (Parcel + GitHub Pages)

Landing de la práctica anterior empaquetada con **Parcel** y publicada en **GitHub Pages**. Parcel compila SCSS, procesa HTML, gestiona imágenes y minifica en producción.

---

## Demo

`https://celesteld.github.io/SYTW-CLIENTE/`

---

## Estructura

```
ejercicio-2/
├─ package.json
├─ package-lock.json
├─ postcss.config.json
└─ src/
   ├─ img/
   │  ├─ logo-empresa.jpg
   │  ├─ mockup.png
   │  ├─ result.png
   │  └─ ull-logo.png
   ├─ index.html
   └─ scss/
      ├─ _mixins.scss
      ├─ _variables.scss
      ├─ base/_base.scss
      ├─ layout/_header.scss
      ├─ layout/_main.scss
      ├─ layout/_navbar.scss
      └─ main.scss        
```

En `src/index.html` se referencia directamente el SCSS (Parcel lo compila):
```html
<link rel="stylesheet" href="./scss/main.scss">
<img src="./img/logo-empresa.jpg" alt="">
<img src="./img/ull-logo.png" alt="">
```

---

## Dependencias

- `parcel` — bundler
- `sass` — compilador SCSS
- `postcss` + `autoprefixer` — prefijos CSS
- `gh-pages` — deploy a la rama `gh-pages`
- `rimraf` — limpieza de `dist` y caché

**PostCSS**: se usa `postcss.config.json` para activar Autoprefixer aprovechando la caché de Parcel.

---

## Scripts de npm (actualizados)

```json
{
  "scripts": {
    "dev": "rimraf dist .parcel-cache && parcel src/index.html --dist-dir dist --port 5173 --open",
    "clean": "rimraf dist .parcel-cache",
    "build": "rimraf dist .parcel-cache && parcel build src/index.html --dist-dir dist --public-url /SYTW-CLIENTE/",
    "build:local": "rimraf dist .parcel-cache && parcel build src/index.html --dist-dir dist --public-url ./",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist -b gh-pages"
  }
}
```

### ¿Qué hace cada uno?
- **dev** → servidor de desarrollo en `http://localhost:5173/` con recarga en caliente. Limpia `dist` y `.parcel-cache` antes de arrancar.
- **build** → *producción* para GitHub Pages del repo `SYTW-CLIENTE`. Minifica assets, optimiza imágenes y reescribe rutas con `--public-url /SYTW-CLIENTE/`.
- **build:local** → *producción* para previsualizar `dist/` **en local** (rutas relativas `./`). Útil si quieres abrir `dist/index.html` con Live Server sin 404.
- **deploy** → ejecuta `build` y publica `dist/` en la rama `gh-pages` (fuente de Pages).

---

## Uso

### Desarrollo
```bash
npm install
npm run dev
```

### Producción (Pages)
```bash
npm run build
npm run deploy
# URL final: https://celesteld.github.io/SYTW-CLIENTE/
```

### Previsualizar dist con Live Server
```bash
npm run build:local
# Abrir en dist/index.html con Live Server (rutas correctas)
```

---

## ¿Qué hace Parcel?

- **Compila** `src/scss/main.scss` → CSS (usa *sass*).
- **PostCSS + Autoprefixer** desde `postcss.config.json`.
- **Minifica** CSS/JS/HTML en build.
- **Copia/optimiza imágenes** y añade **hash de contenido** a los nombres para evitar caché.
- **Reescribe rutas** con `--public-url` (clave para GitHub Pages de proyecto).

---