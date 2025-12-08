/* script.js: completo con Media Session + actualización visible de metadata */

const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPause');
const stopBtn = document.getElementById('stop');
const backBtn = document.getElementById('back10');
const forwardBtn = document.getElementById('forward10');
const muteBtn = document.getElementById('mute');
const volumeSlider = document.getElementById('volume');
const playbackRateSelect = document.getElementById('playbackRate');

const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressBuffer = document.getElementById('progressBuffer');
const progressTooltip = document.getElementById('progressTooltip');

const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

const coverImage = document.getElementById('coverImage');
const trackTitleEl = document.getElementById('trackTitle');
const trackArtistEl = document.getElementById('trackArtist');

const STORAGE_PREFIX = 'enhanced-audio-player::'; 
const audioKey = STORAGE_PREFIX + (audio.currentSrc || audio.querySelector('source')?.src || 'default');

// --- helpers ---
function formatTime(seconds = 0){
  if (!seconds || Number.isNaN(seconds) || !isFinite(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2,'0')}`;
}

function saveState(){
  try {
    const state = {
      time: audio.currentTime,
      volume: audio.volume,
      playbackRate: audio.playbackRate,
      wasPlaying: !audio.paused
    };
    localStorage.setItem(audioKey, JSON.stringify(state));
  } catch (e) {
    // ignoramos errores de almacenamiento
  }
}

function loadState(){
  try {
    const raw = localStorage.getItem(audioKey);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (typeof state.volume === 'number') {
      audio.volume = state.volume;
      volumeSlider.value = Math.round(state.volume * 100);
      updateRangeFill(volumeSlider, volumeSlider.value);
    }
    if (typeof state.playbackRate === 'number') {
      audio.playbackRate = state.playbackRate;
      playbackRateSelect.value = String(state.playbackRate);
    }
    if (typeof state.time === 'number' && !Number.isNaN(state.time)) {
      audio.addEventListener('loadedmetadata', () => {
        if (state.time > 0 && state.time < audio.duration) {
          audio.currentTime = state.time;
        }
        if (state.wasPlaying) {
          audio.play().catch(()=>{/* autoplay might be blocked; ignore */});
        }
      }, { once: true });
    }
  } catch (e) {}
}

// --- Actualizar UI visible de metadatos (título, artista, carátula) ---
function updateVisibleMetadataFromDataAttrs() {
  const dt = audio.dataset.title || guessTitleFromSrc(audio.currentSrc);
  const da = audio.dataset.artist || 'Desconocido';
  const dalb = audio.dataset.album || '';
  const dart = audio.dataset.artwork || 'assets/cover.jpg';

  trackTitleEl.textContent = dt;
  trackArtistEl.textContent = da + (dalb ? (' — ' + dalb) : '');
  // actualizar carátula (fallback si la ruta no existe será manejada por el navegador)
  coverImage.src = dart;
}

// --- controles básicos ---
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸ Pause';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶ Play';
  }
});

stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  playPauseBtn.textContent = '▶ Play';
  saveState();
});

backBtn.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
  saveState();
});

forwardBtn.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  saveState();
});

// Mutear / desmutear
let previousVolume = audio.volume;
muteBtn.addEventListener('click', () => {
  if (!audio.muted) {
    previousVolume = audio.volume;
    audio.muted = true;
    volumeSlider.value = 0;
    muteBtn.textContent = '🔇';
  } else {
    audio.muted = false;
    audio.volume = previousVolume || 1;
    volumeSlider.value = Math.round(audio.volume * 100);
    muteBtn.textContent = '🔊';
  }
  saveState();
});

// Barra de volumen (y relleno visual)
function updateRangeFill(rangeEl, percent) {
  rangeEl.style.background = `linear-gradient(90deg, var(--accent) ${percent}%, rgba(255,255,255,0.12) ${percent}%)`;
}

volumeSlider.addEventListener('input', (e) => {
  const v = Number(e.target.value) / 100;
  audio.volume = v;
  audio.muted = v === 0;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  updateRangeFill(volumeSlider, e.target.value);
  saveState();
});

// inicializar relleno del slider
updateRangeFill(volumeSlider, volumeSlider.value);

// Velocidad de reproducción
playbackRateSelect.addEventListener('change', (e) => {
  audio.playbackRate = Number(e.target.value);
  saveState();
});

// actualizar tiempos y barra (raf para suavidad)
let rafId;
function rafUpdate() {
  const cur = audio.currentTime || 0;
  const dur = audio.duration || 0;
  currentTimeEl.textContent = formatTime(cur);
  if (dur) {
    const pct = (cur / dur) * 100;
    progressBar.style.width = pct + '%';
    // Actualizar estado de posición en Media Session si está disponible
    try {
      if ('setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: dur,
          position: cur,
          playbackRate: audio.playbackRate
        });
      }
    } catch (err) {
      // evitar errores en navegadores restrictivos
    }
  } else {
    progressBar.style.width = '0%';
  }
  rafId = requestAnimationFrame(rafUpdate);
}
audio.addEventListener('play', () => { cancelAnimationFrame(rafId); rafUpdate(); });
audio.addEventListener('pause', () => cancelAnimationFrame(rafId));
audio.addEventListener('ended', () => cancelAnimationFrame(rafId));

// mostrarlos al cargar metadatos
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = '/ ' + formatTime(audio.duration || 0);
  currentTimeEl.textContent = formatTime(audio.currentTime || 0);
  updateBuffered();
  // actualizar visible metadata (carátula + texto)
  updateVisibleMetadataFromDataAttrs();
  // Actualizar metadata en Media Session cuando tengamos duration/metadata
  setupMediaSessionMetadata();
});

// Cuando se acabe el audio:
audio.addEventListener('ended', () => {
  playPauseBtn.textContent = '▶ Play';
  audio.currentTime = 0;
  saveState();
});

// Guardado periódico (1s)
let lastSave = 0;
audio.addEventListener('timeupdate', () => {
  const now = Date.now();
  if (now - lastSave > 1000) {
    saveState();
    lastSave = now;
  }
});

// progreso interactivo 
let isPointerDown = false;

function setProgressFromEvent(e){
  const rect = progressContainer.getBoundingClientRect();
  const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
  const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
  const pct = x / rect.width;

  if (audio.duration) {
    audio.currentTime = pct * audio.duration;
  }

  const cur = audio.currentTime || 0;
  const dur = audio.duration || 0;
  currentTimeEl.textContent = formatTime(cur);
  progressBar.style.width = (cur / dur * 100) + '%';
}

progressContainer.addEventListener('pointerdown', (e) => {
  isPointerDown = true;
  try { progressContainer.setPointerCapture(e.pointerId); } catch {}
  setProgressFromEvent(e);
});

progressContainer.addEventListener('pointermove', (e) => {
  if (!isPointerDown) {
    // mostramos preview aunque no se haga seek
    showPreviewAt(e.clientX);
  } else {
    // si arrastra, sigue realizando seek
    setProgressFromEvent(e);
    showPreviewAt(e.clientX);
  }
});

progressContainer.addEventListener('pointerup', (e) => {
  if (!isPointerDown) return;
  isPointerDown = false;
  try { progressContainer.releasePointerCapture(e.pointerId); } catch {}
  setProgressFromEvent(e);
  saveState();
  hidePreview();
});

// también permitir click simple (por si pointer no está disponible)
progressContainer.addEventListener('click', (e) => {
  setProgressFromEvent(e);
  saveState();
});

// === BUFFER + TOOLTIP LOGIC ===
function updateBuffered() {
  if (!audio.duration || !audio.buffered || audio.buffered.length === 0) {
    progressBuffer.style.width = '0%';
    return;
  }
  try {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
    const pct = Math.min(100, (bufferedEnd / audio.duration) * 100);
    progressBuffer.style.width = pct + '%';
  } catch (err) {
    progressBuffer.style.width = '0%';
  }
}
audio.addEventListener('progress', updateBuffered);
audio.addEventListener('durationchange', updateBuffered);

// tooltip preview helpers
function getTimeForPosition(clientX) {
  const rect = progressContainer.getBoundingClientRect();
  const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
  const pct = x / rect.width;
  return pct * (audio.duration || 0);
}
function positionTooltipAt(clientX) {
  const rect = progressContainer.getBoundingClientRect();
  const tooltipRect = progressTooltip.getBoundingClientRect();
  const halfW = tooltipRect.width / 2 || 30;
  let left = clientX - rect.left;
  left = Math.max(halfW, Math.min(rect.width - halfW, left));
  progressTooltip.style.left = left + 'px';
}

let tooltipRAF = null;
function showPreviewAt(clientX) {
  const t = getTimeForPosition(clientX);
  const text = (audio.duration && Number.isFinite(audio.duration)) ? formatTime(t) : '--:--';
  progressTooltip.textContent = text;
  if (tooltipRAF) cancelAnimationFrame(tooltipRAF);
  tooltipRAF = requestAnimationFrame(() => {
    positionTooltipAt(clientX);
    progressTooltip.classList.add('show');
    progressTooltip.setAttribute('aria-hidden', 'false');
  });
}
function hidePreview() {
  if (tooltipRAF) cancelAnimationFrame(tooltipRAF);
  progressTooltip.classList.remove('show');
  progressTooltip.setAttribute('aria-hidden', 'true');
}

progressContainer.addEventListener('pointerenter', (e) => {
  showPreviewAt(e.clientX);
});
progressContainer.addEventListener('pointerleave', (e) => {
  if (!isPointerDown) hidePreview();
});

// fallback: actualizar buffer periódicamente
setInterval(updateBuffered, 800);

// restaurar estado al inicio + cargar visible metadata ahora
updateVisibleMetadataFromDataAttrs();
loadState();

// accesibilidad: tecla espacio para reproducir/pausar si focus en body
document.body.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && (document.activeElement === document.body)) {
    e.preventDefault();
    playPauseBtn.click();
  }
});

/* ============================
   MEDIA SESSION API INTEGRATION
   ============================ */

function guessTitleFromSrc(src) {
  try {
    if (!src) return 'Pista';
    const parts = src.split('/').pop().split('?')[0];
    return decodeURIComponent(parts.replace(/\.[^/.]+$/, '').replace(/[_\-]/g, ' '));
  } catch (e) {
    return 'Pista';
  }
}

function setupMediaSessionMetadata() {
  if (!('mediaSession' in navigator)) return;

  // Obtener metadata desde data-* (si existe) o inferir del src
  const dataTitle = audio.dataset.title || guessTitleFromSrc(audio.currentSrc);
  const dataArtist = audio.dataset.artist || 'Desconocido';
  const dataAlbum = audio.dataset.album || '';
  const dataArtwork = audio.dataset.artwork || 'assets/cover.jpg';

  const artwork = [{ src: dataArtwork, sizes: '512x512', type: 'image/jpeg' }];

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: dataTitle,
      artist: dataArtist,
      album: dataAlbum,
      artwork
    });
  } catch (err) {
    // no romper si falla
  }

  // Action handlers (envueltos para evitar excepciones en navegadores restrictivos)
  try { navigator.mediaSession.setActionHandler('play', () => { audio.play(); playPauseBtn.textContent = '⏸ Pause'; }); } catch (e) {}
  try { navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); playPauseBtn.textContent = '▶ Play'; }); } catch (e) {}
  try {
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skip = (details && details.seekOffset) ? details.seekOffset : 10;
      audio.currentTime = Math.max(0, audio.currentTime - skip);
    });
  } catch (e) {}
  try {
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skip = (details && details.seekOffset) ? details.seekOffset : 10;
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + skip);
    });
  } catch (e) {}
  try {
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details && typeof details.seekTime === 'number') {
        audio.currentTime = details.seekTime;
      }
    });
  } catch (e) {}
  try { navigator.mediaSession.setActionHandler('stop', () => { audio.pause(); audio.currentTime = 0; playPauseBtn.textContent = '▶ Play'; }); } catch (e) {}

  // set initial position state if supported
  try {
    if ('setPositionState' in navigator.mediaSession && audio.duration && Number.isFinite(audio.duration)) {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        position: audio.currentTime || 0,
        playbackRate: audio.playbackRate || 1
      });
    }
  } catch (err) {}
}

/* FIN Media Session */
