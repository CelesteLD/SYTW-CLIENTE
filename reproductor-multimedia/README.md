# Reproductor multimedia mejorado

Un reproductor de audio web minimalista pero robusto, creado como práctica para mostrar buenas prácticas en accesibilidad, control de reproducción, persistencia de estado y visualización en tiempo real de las frecuencias sonoras.

> Este README explica qué se ha implementado, cómo funciona a alto nivel y qué mejoras se han incorporado respecto a un reproductor básico.

![Captura de Cypress](./docs/captura-general.png)
*Figura 1: Captura general de la aplicación creada.*

---

## Estructura del proyecto

```
(base) celeste@MacBook-Air-de-Celeste-7 reproductor-multimedia % tree
.
├── README.md
├── assets
│   ├── bg.jpg
│   ├── cover.jpg
│   ├── demo-song.mp3
│   └── icono_circulo.svg
├── index.html
├── script.js
├── styles.css
└── visualizer.js

2 directories, 9 files
```

---

## Archivos principales

- `index.html` — Marca la estructura de la interfaz: carátula, metadatos, controles, barra de progreso, tooltip de previsualización y canvas para la visualización.
- `styles.css` — Estilos visuales (tipografía Poppins, diseño de tarjeta, barra de progreso y estados interactivos).
- `script.js` — Lógica principal del reproductor: controles (play/pause/stop/seek), manejo del volumen, guardado/recuperación del estado, integración con la API Media Session, barra de progreso con tooltip interactivo y lógica de buffering.
- `visualizer.js` — Inicializa la Web Audio API (AudioContext, MediaElementSource, Analyser) y dibuja en el `<canvas>` una representación visual de las frecuencias en tiempo real.
- `assets/*` — Recursos: carátula, pista de ejemplo y gráficos.

---

## Qué se ha realizado en la práctica

1. **Reproductor funcional y accesible**
   - Controles de reproducción: reproducir/pausar, detener, retroceder/avanzar 10s, mutear, ajuste de volumen y velocidad.
   - Soporte de teclado: la barra `Space` controla reproducir/pausar cuando el foco está en el body.
   - Etiquetas ARIA y roles en elementos clave para mejorar la experiencia de usuarios que usan tecnologías de asistencia.

![Captura de Cypress](./docs/captura-1.png)
*Figura 2: Visión general del reproductor.*

2. **Persistencia de estado**
   - Guardado automático en `localStorage` (prefijo `enhanced-audio-player::`) de la posición actual (`currentTime`), volumen, `playbackRate` y si estaba reproduciendo.
   - Restauración al recargar la página: cuando se cargan los metadatos, se aplica el estado guardado (posición, volumen, velocidad) y, si el usuario estaba reproduciendo, se intenta reanudar la reproducción.
   - Guardado periódico (cada segundo) y al finalizar o interactuar con controles importantes.

3. **Sistema de buffer en la barra de progreso** 
   - La barra de progreso no solo muestra la posición de reproducción, sino también el progreso de *buffering* (porcentaje descargado) usando `audio.buffered`.
   - `updateBuffered()` calcula `audio.buffered.end(audio.buffered.length - 1)` y lo convierte a porcentaje relativo a `audio.duration` para pintar la `progressBuffer`.
   - Se actualiza con los eventos `progress`, `durationchange` y con un `setInterval` como fallback cada 800ms para navegadores inconsistentes.
   - Esto permite al usuario ver hasta qué punto la pista está descargada y ayuda a evitar saltos en conexiones lentas.

4. **Integración con Media Session API** 
   - `navigator.mediaSession.metadata` se actualiza con título, artista, álbum y artwork (obtenidos de `data-*` del elemento `audio` o inferidos del `src`).
````
<div class="meta-text">
    <div id="trackTitle" class="track-title">Instagram Reels Marketing Music</div>
    <div id="trackArtist" class="track-artist">Tatamusic — Pixabay</div>
</div>
`````

   - Se registran manejadores para acciones estándar: `play`, `pause`, `seekbackward`, `seekforward`, `seekto`, `stop`. Esto permite control desde notificaciones, teclas multimedia y carátulas en dispositivos compatibles.
   - También se usa `setPositionState` cuando está disponible para sincronizar barra de progreso y controles del sistema con la reproducción actual.

5. **Visualizador de frecuencias con Web Audio API y Canvas** 
   - `visualizer.js` crea un `AudioContext`, una `MediaElementSource` conectada a un `AnalyserNode` y conecta finalmente al `destination`.
   - `analyser.fftSize = 256` → el número de barras dibujadas es `fftSize / 2` (resolución de frecuencia). Se recoge el array con `getByteFrequencyData`.
   - En cada frame (`requestAnimationFrame`) se dibujan barras en el `<canvas>` cuyo alto depende de la amplitud de cada banda de frecuencia. Se colorean usando HSL para un gradiente vibrante.
   - El inicializador está diseñado para respetar la política de autoplay de los navegadores: el `AudioContext` se crea/resume al interactuar (por ejemplo, al hacer clic en Play).
   - Se gestionan posibles errores por CORS/permiso del contexto de audio con `try/catch`.

![Captura de Cypress](./docs/captura-2.png)
*Figura 3: Visualización de frecuencias de la pista de audio.*

---

## Cómo ejecutar localmente

1. Clona o descarga el repositorio (o coloca los archivos en una carpeta local).
2. Abre `index.html` en un navegador moderno (Chrome, Edge, Firefox). Para evitar limitaciones con archivos locales en algunos navegadores, sirve el directorio con un servidor estático simple (por ejemplo Live Server de VSC).
3. Interactúa con los controles y observa la visualización en el canvas.

---