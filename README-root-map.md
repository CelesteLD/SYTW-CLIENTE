# SYTW-CLIENTE — Mapa del repositorio

Repositorio de prácticas de **Sistemas y Tecnologías Web** (cliente). A continuación se muestra la estructura del repositorio con las diferentes prácticas realizadas


---

## Estructura

```
SYTW-CLIENTE/
├─ practica-1/                 # Maquetación con Sass + Flex + Grid
├─ practica-2/
│  ├─ ejercicio-1/            # Gulp (Sass, autoprefixer, minify, imágenes, watch)
│  └─ ejercicio-2/            # Parcel (bundler) + GitHub Pages
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

## Enlaces internos útiles
- [Práctica 1](./practica-1/)
- [Práctica 2 — Ejercicio 1 (Gulp)](./practica-2/ejercicio-1/)
- [Práctica 2 — Ejercicio 2 (Parcel)](./practica-2/ejercicio-2/)
