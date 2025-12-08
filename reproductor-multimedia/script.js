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
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

const STORAGE_PREFIX = 'enhanced-audio-player::'; 
const audioKey = STORAGE_PREFIX + (audio.currentSrc || audio.querySelector('source')?.src || 'default');

// --- helpers ---
function formatTime(seconds = 0){
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2,'0')}`;
}

function saveState(){
  try {
    const state = {
      time: audio.currentTime,
      volume: audio.volume,
      playbackRate: audio.playbackRate
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
    }
    if (typeof state.playbackRate === 'number') {
      audio.playbackRate = state.playbackRate;
      playbackRateSelect.value = String(state.playbackRate);
    }
    if (typeof state.time === 'number' && !Number.isNaN(state.time)) {
      // esperar a loadedmetadata para aplicar
      audio.addEventListener('loadedmetadata', () => {
        if (state.time > 0 && state.time < audio.duration) {
          audio.currentTime = state.time;
        }
      }, { once: true });
    }
  } catch (e) {}
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

// Barra de volumen
volumeSlider.addEventListener('input', (e) => {
  const v = Number(e.target.value) / 100;
  audio.volume = v;
  audio.muted = v === 0;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  saveState();
});

// Velocidad de reproducción
playbackRateSelect.addEventListener('change', (e) => {
  audio.playbackRate = Number(e.target.value);
  saveState();
});

// actualizar tiempos y barra
audio.addEventListener('timeupdate', () => {
  const cur = audio.currentTime || 0;
  const dur = audio.duration || 0;
  currentTimeEl.textContent = formatTime(cur);
  if (dur) {
    const pct = (cur / dur) * 100;
    progressBar.style.width = pct + '%';
  }
  // guardarlo periódicamente (cada timeupdate podría ser muy frecuente)
});

// mostrarlos al cargar metadatos
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = '/ ' + formatTime(audio.duration || 0);
  currentTimeEl.textContent = formatTime(audio.currentTime || 0);
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
  // soporta tanto mouse como touch (usamos clientX general)
  const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
  const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
  const pct = x / rect.width;
  if (audio.duration) {
    audio.currentTime = pct * audio.duration;
  }
}

progressContainer.addEventListener('pointerdown', (e) => {
  isPointerDown = true;
  progressContainer.setPointerCapture(e.pointerId);
  setProgressFromEvent(e);
});

progressContainer.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return;
  setProgressFromEvent(e);
});

progressContainer.addEventListener('pointerup', (e) => {
  if (!isPointerDown) return;
  isPointerDown = false;
  progressContainer.releasePointerCapture(e.pointerId);
  setProgressFromEvent(e);
  saveState();
});

// también permitir click simple (por si pointer no está disponible)
progressContainer.addEventListener('click', (e) => {
  setProgressFromEvent(e);
  saveState();
});

// restaurar estado al inicio
loadState();

// accesibilidad: tecla espacio para reproducir/pausar si focus en body
document.body.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && (document.activeElement === document.body)) {
    e.preventDefault();
    playPauseBtn.click();
  }
});
