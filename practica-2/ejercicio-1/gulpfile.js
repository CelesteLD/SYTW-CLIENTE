// ===== Requires =====
const { src, dest, series, parallel, watch } = require("gulp");
const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

const gulpSass = require("gulp-sass");
const sass = gulpSass(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const gulpif = require("gulp-if");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// ===== Config =====
const isProd = process.env.NODE_ENV === "production";
const paths = {
  html: "src/**/*.html",
  styles: "src/scss/**/*.scss",
  stylesEntry: "src/scss/main.scss",
  images: "src/img/**/*",
  scripts: "src/js/**/*.js",
  dist: "dist",
};

// ===== Limpiezas =====
let deleteAsync;
async function clean() {
  if (!deleteAsync) {
    const d = await import("del");
    deleteAsync = d.deleteAsync || d.default;
  }
  return deleteAsync([paths.dist]);
}
async function cleanImages() {
  if (!deleteAsync) {
    const d = await import("del");
    deleteAsync = d.deleteAsync || d.default;
  }
  return deleteAsync([`${paths.dist}/img/**`, `!${paths.dist}`]);
}

// ===== HTML =====
function html() {
  return src(paths.html).pipe(dest(paths.dist));
}

// ===== CSS =====
let cssnanoPlugin;

function sassTask() {
  return src(paths.stylesEntry)
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass.sync({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(concat("style.css"))
    .pipe(gulpif(!isProd, sourcemaps.write(".")))
    .pipe(dest(`${paths.dist}/css`));
}

async function minifyCssTask() {
  if (!cssnanoPlugin) {
    const c = await import("cssnano");
    cssnanoPlugin = c.default;
  }
  return src(`${paths.dist}/css/style.css`, { allowEmpty: true })
    .pipe(postcss([cssnanoPlugin()]))
    .pipe(dest(`${paths.dist}/css`));
}

// ===== IMÁGENES =====
// DEV → copia 1:1 byte a byte (misma estrategia estable que ya funcionaba)
async function copyImages() {
  const baseDir = path.resolve("src/img");
  const files = await fg([paths.images], { onlyFiles: true });
  fs.mkdirSync(path.join(paths.dist, "img"), { recursive: true });

  await Promise.all(
    files.map(async (absSrc) => {
      const rel = path.relative(baseDir, path.resolve(absSrc));
      const absDst = path.join(paths.dist, "img", rel);
      fs.mkdirSync(path.dirname(absDst), { recursive: true });
      await fs.promises.copyFile(absSrc, absDst);
    })
  );
}

// PROD → optimiza con imagemin (ESM) y plugins
let imagemin, mozjpeg, pngquant, svgo;
async function optimizeImages() {
  if (!imagemin) {
    const m1 = await import("gulp-imagemin");
    imagemin = m1.default;
    const m2 = await import("imagemin-mozjpeg");
    mozjpeg = m2.default;
    const m3 = await import("imagemin-pngquant");
    pngquant = m3.default;
    const m4 = await import("imagemin-svgo");
    svgo = m4.default;
  }

  return src(paths.images, { allowEmpty: true })
    .pipe(
      imagemin([
        // JPG
        mozjpeg({ quality: 80 }),
        // PNG
        pngquant({ quality: [0.7, 0.85] }),
        // SVG: mantenemos viewBox y limpiamos IDs
        svgo({
          plugins: [
            { name: "removeViewBox", active: false },
            { name: "cleanupIDs", active: true },
          ],
        }),
      ])
    )
    .pipe(dest(`${paths.dist}/img`));
}

// Tarea pública: limpia y luego copia/optimiza en función del modo
const images = series(cleanImages, function imagesSwitch() {
  return isProd ? optimizeImages() : copyImages();
});

// ===== JS =====
function js() {
  if (!fs.existsSync("src/js")) return Promise.resolve();
  return src(paths.scripts, { allowEmpty: true })
    .pipe(concat("app.js"))
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest(`${paths.dist}/js`));
}

// ===== Watch (sin server) =====
function watchTask() {
  watch(paths.html, html);
  watch(paths.styles, series(sassTask));
  watch(paths.images, images);
  if (fs.existsSync("src/js")) watch(paths.scripts, js);
  console.log("Watching… abre dist/index.html con Live Server ✅");
}

// ===== Pipelines =====
const build = series(clean, parallel(html, sassTask, js), parallel(minifyCssTask, images));

exports.sass = sassTask;
exports["minify-css"] = minifyCssTask;
exports.images = images;
exports.js = js;
exports.watch = watchTask;
exports.build = build;
exports.default = series(build, watchTask);
